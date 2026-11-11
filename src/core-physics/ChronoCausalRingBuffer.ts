/**
 * OPENLAB 3D — CHRONO-CAUSAL RING BUFFER (3600 FRAMES)
 * 
 * Bộ đệm vòng xác định (Deterministic Circular Ring Buffer) lưu trữ 3600 khung hình
 * (tương đương 60 giây ở 60 FPS hoặc 30 giây ở 120 Hz).
 * 
 * NGUYÊN LÝ NHÂN QUẢ XÁC ĐỊNH (PEARL CAUSAL FRAMEWORK):
 * 1. Tuyệt đối KHÔNG đảo dấu bước thời gian (dt < 0) trên các hệ tiêu tán năng lượng (Dissipative ODEs),
 *    bởi ma sát $-\gamma v$ biến thành $+\gamma v$ (Anti-damping), kích nổ năng lượng $e^{+\gamma t} \to \infty$.
 * 2. Thay vào đó, bộ đệm lưu vết trạng thái vật lý chuẩn xác ở chiều xuôi thời gian.
 * 3. Khi người dùng tua ngược (Time Rewind), hệ thống tái hiện (replay) và nội suy mượt mà (Hermite/Linear)
 *    từ kho lưu trữ 3600 frames.
 * 4. Khi người dùng can thiệp đối thực ($do(X = x)$) tại thời điểm quá khứ $t_{\text{can thiep}}$, bộ đệm
 *    thực hiện phân nhánh nhân quả (Counterfactual Branching): giữ nguyên quá khứ trước $t$,
 *    hủy bỏ tương lai cũ đã bị vô hiệu hóa, và khởi phát một nhánh thực tại vật lý mới.
 */

import { MultiPhysicsBusSnapshot } from './MultiPhysicsCouplingBus';

export const CHRONO_BUFFER_DEFAULT_CAPACITY = 3600; // 3600 frames (60 giây ở 60 FPS)

export interface CausalFrameRecord {
  frameIndex: number;
  simulationTimeSec: number;
  recordedWallTimeMs: number;
  snapshot: MultiPhysicsBusSnapshot;
  // Kênh dữ liệu vô hướng trích xuất nhanh phục vụ đồ thị và nội suy
  channels: {
    liquidTempC: number;
    liquidMassKg: number;
    liquidVolumeMl: number;
    magnetZM: number;
    magnetVM: number;
    inducedCurrentA: number;
    lenzForceN: number;
    filamentTempK: number;
    filamentCurrentA: number;
    relativeBrightness: number;
  };
}

export class ChronoCausalRingBuffer {
  private readonly _capacity: number;
  private readonly _buffer: (CausalFrameRecord | null)[];
  private _headIndex: number = 0; // Vị trí ghi tiếp theo
  private _count: number = 0; // Số lượng khung hình hiện có
  private _totalFramesCaptured: number = 0;
  private _isRewinding: boolean = false;
  private _currentPlaybackTimeSec: number = 0.0;

  constructor(capacity: number = CHRONO_BUFFER_DEFAULT_CAPACITY) {
    if (capacity <= 10 || !Number.isInteger(capacity)) {
      throw new Error(`[ChronoCausalRingBuffer] Sức chứa không hợp lệ: ${capacity}`);
    }
    this._capacity = capacity;
    this._buffer = new Array(capacity).fill(null);
  }

  public get capacity(): number {
    return this._capacity;
  }

  public get count(): number {
    return this._count;
  }

  public get totalFramesCaptured(): number {
    return this._totalFramesCaptured;
  }

  public get isRewinding(): boolean {
    return this._isRewinding;
  }

  public set isRewinding(val: boolean) {
    this._isRewinding = val;
  }

  /**
   * Lưu một khung hình mới vào bộ đệm vòng (O(1) complexity, Zero GC leakage)
   */
  public push(snapshot: MultiPhysicsBusSnapshot): void {
    const frameIndex = this._totalFramesCaptured;
    const simTime = snapshot.simulationTimeSec;

    // Trích xuất kênh vô hướng
    const record: CausalFrameRecord = {
      frameIndex,
      simulationTimeSec: simTime,
      recordedWallTimeMs: Date.now(),
      snapshot: this._deepCloneSnapshot(snapshot),
      channels: {
        liquidTempC: snapshot.electroThermalFluid.temperatureC,
        liquidMassKg: snapshot.electroThermalFluid.liquidMassKg,
        liquidVolumeMl: snapshot.electroThermalFluid.liquidVolumeMl,
        magnetZM: snapshot.faradayLenz.magnetPositionZM,
        magnetVM: snapshot.faradayLenz.magnetVelocityMps,
        inducedCurrentA: snapshot.faradayLenz.inducedCurrentAmperes,
        lenzForceN: snapshot.faradayLenz.lenzBrakingForceNewtons,
        filamentTempK: snapshot.filament.filamentTemperatureK,
        filamentCurrentA: snapshot.filament.currentAmperes,
        relativeBrightness: snapshot.filament.relativeBrightness,
      },
    };

    this._buffer[this._headIndex] = record;
    this._headIndex = (this._headIndex + 1) % this._capacity;

    if (this._count < this._capacity) {
      this._count++;
    }
    this._totalFramesCaptured++;
    this._currentPlaybackTimeSec = simTime;
  }

  /**
   * Lấy khung hình cổ nhất trong bộ nhớ
   */
  public getOldestRecord(): CausalFrameRecord | null {
    if (this._count === 0) return null;
    const oldestIndex = (this._headIndex - this._count + this._capacity) % this._capacity;
    return this._buffer[oldestIndex];
  }

  /**
   * Lấy khung hình mới nhất trong bộ nhớ
   */
  public getLatestRecord(): CausalFrameRecord | null {
    if (this._count === 0) return null;
    const latestIndex = (this._headIndex - 1 + this._capacity) % this._capacity;
    return this._buffer[latestIndex];
  }

  /**
   * Lấy bản ghi tại chỉ mục tương đối [0 .. count - 1] (0 = cổ nhất, count-1 = mới nhất)
   */
  public getRecordAt(relativeIndex: number): CausalFrameRecord | null {
    if (relativeIndex < 0 || relativeIndex >= this._count) return null;
    const actualIndex = (this._headIndex - this._count + relativeIndex + this._capacity) % this._capacity;
    return this._buffer[actualIndex];
  }

  /**
   * Khoảng thời gian mô phỏng đang được lưu giữ trong đệm [t_oldest, t_latest]
   */
  public getTimeSpan(): { oldestSec: number; latestSec: number; durationSec: number } | null {
    const oldest = this.getOldestRecord();
    const latest = this.getLatestRecord();
    if (!oldest || !latest) return null;
    return {
      oldestSec: oldest.simulationTimeSec,
      latestSec: latest.simulationTimeSec,
      durationSec: Math.max(0, latest.simulationTimeSec - oldest.simulationTimeSec),
    };
  }

  /**
   * Nội suy trạng thái mượt mà tại thời điểm t bất kỳ trong khoảng đệm
   */
  public sampleAtTime(targetTimeSec: number): {
    found: boolean;
    interpolatedChannels: CausalFrameRecord['channels'];
    snapshot: MultiPhysicsBusSnapshot;
    effectiveTimeSec: number;
  } | null {
    if (this._count === 0) return null;

    const oldest = this.getOldestRecord()!;
    const latest = this.getLatestRecord()!;

    // Chặn biên trong khoảng thời gian có sẵn
    const clampedT = Math.max(oldest.simulationTimeSec, Math.min(latest.simulationTimeSec, targetTimeSec));

    if (this._count === 1 || Math.abs(latest.simulationTimeSec - oldest.simulationTimeSec) < 1e-6) {
      return {
        found: true,
        interpolatedChannels: { ...latest.channels },
        snapshot: this._deepCloneSnapshot(latest.snapshot),
        effectiveTimeSec: latest.simulationTimeSec,
      };
    }

    // Tìm kiếm nhị phân cặp khung hình kề nhau [k, k + 1] sao cho t_k <= clampedT <= t_{k+1}
    let low = 0;
    let high = this._count - 1;
    let bestIndex = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const rec = this.getRecordAt(mid)!;
      if (rec.simulationTimeSec <= clampedT) {
        bestIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const r1 = this.getRecordAt(bestIndex)!;
    const nextIdx = Math.min(this._count - 1, bestIndex + 1);
    const r2 = this.getRecordAt(nextIdx)!;

    if (bestIndex === nextIdx || Math.abs(r2.simulationTimeSec - r1.simulationTimeSec) < 1e-6) {
      return {
        found: true,
        interpolatedChannels: { ...r1.channels },
        snapshot: this._deepCloneSnapshot(r1.snapshot),
        effectiveTimeSec: r1.simulationTimeSec,
      };
    }

    // Tỉ lệ nội suy alpha thuộc [0, 1]
    const alpha = (clampedT - r1.simulationTimeSec) / (r2.simulationTimeSec - r1.simulationTimeSec);
    const lerp = (a: number, b: number) => a + (b - a) * alpha;

    const interChannels: CausalFrameRecord['channels'] = {
      liquidTempC: lerp(r1.channels.liquidTempC, r2.channels.liquidTempC),
      liquidMassKg: lerp(r1.channels.liquidMassKg, r2.channels.liquidMassKg),
      liquidVolumeMl: lerp(r1.channels.liquidVolumeMl, r2.channels.liquidVolumeMl),
      magnetZM: lerp(r1.channels.magnetZM, r2.channels.magnetZM),
      magnetVM: lerp(r1.channels.magnetVM, r2.channels.magnetVM),
      inducedCurrentA: lerp(r1.channels.inducedCurrentA, r2.channels.inducedCurrentA),
      lenzForceN: lerp(r1.channels.lenzForceN, r2.channels.lenzForceN),
      filamentTempK: lerp(r1.channels.filamentTempK, r2.channels.filamentTempK),
      filamentCurrentA: lerp(r1.channels.filamentCurrentA, r2.channels.filamentCurrentA),
      relativeBrightness: lerp(r1.channels.relativeBrightness, r2.channels.relativeBrightness),
    };

    // Chọn snapshot gần nhất để dựng đầy đủ cấu trúc
    const baseSnapshot = alpha >= 0.5 ? r2.snapshot : r1.snapshot;
    const blendedSnapshot = this._deepCloneSnapshot(baseSnapshot);
    blendedSnapshot.simulationTimeSec = clampedT;
    blendedSnapshot.electroThermalFluid.temperatureC = interChannels.liquidTempC;
    blendedSnapshot.electroThermalFluid.liquidMassKg = interChannels.liquidMassKg;
    blendedSnapshot.electroThermalFluid.liquidVolumeMl = interChannels.liquidVolumeMl;
    blendedSnapshot.faradayLenz.magnetPositionZM = interChannels.magnetZM;
    blendedSnapshot.faradayLenz.magnetVelocityMps = interChannels.magnetVM;
    blendedSnapshot.faradayLenz.inducedCurrentAmperes = interChannels.inducedCurrentA;
    blendedSnapshot.faradayLenz.lenzBrakingForceNewtons = interChannels.lenzForceN;
    blendedSnapshot.filament.filamentTemperatureK = interChannels.filamentTempK;
    blendedSnapshot.filament.currentAmperes = interChannels.filamentCurrentA;
    blendedSnapshot.filament.relativeBrightness = interChannels.relativeBrightness;

    return {
      found: true,
      interpolatedChannels: interChannels,
      snapshot: blendedSnapshot,
      effectiveTimeSec: clampedT,
    };
  }

  /**
   * Tua lùi thời gian một đoạn deltaSeconds (Scrub Backward)
   */
  public scrubBackward(deltaSeconds: number): MultiPhysicsBusSnapshot | null {
    if (this._count === 0) return null;
    this._isRewinding = true;
    const targetTime = this._currentPlaybackTimeSec - Math.max(0.001, deltaSeconds);
    const sample = this.sampleAtTime(targetTime);
    if (!sample) return null;
    this._currentPlaybackTimeSec = sample.effectiveTimeSec;
    return sample.snapshot;
  }

  /**
   * Tua tiến thời gian một đoạn deltaSeconds (Scrub Forward)
   */
  public scrubForward(deltaSeconds: number): MultiPhysicsBusSnapshot | null {
    if (this._count === 0) return null;
    const targetTime = this._currentPlaybackTimeSec + Math.max(0.001, deltaSeconds);
    const sample = this.sampleAtTime(targetTime);
    if (!sample) return null;
    this._currentPlaybackTimeSec = sample.effectiveTimeSec;
    return sample.snapshot;
  }

  /**
   * PHÂN NHÁNH ĐỐI THỰC (PEARL COUNTERFACTUAL FORK):
   * Khi người dùng can thiệp vào quá khứ tại mốc t_intervention:
   * 1. Cắt bỏ (prune) toàn bộ các khung hình phía sau t_intervention (tương lai cũ bị hủy diệt).
   * 2. Đặt con trỏ headIndex về sau điểm can thiệp.
   * 3. Trả về snapshot làm hạt giống để bộ tích phân RK4 tiếp tục chạy nhánh tương lai mới.
   */
  public forkBranchAt(interventionTimeSec: number): MultiPhysicsBusSnapshot | null {
    if (this._count === 0) return null;

    const oldest = this.getOldestRecord()!;
    const latest = this.getLatestRecord()!;
    const clampedT = Math.max(oldest.simulationTimeSec, Math.min(latest.simulationTimeSec, interventionTimeSec));

    // Tìm vị trí phần tử có simulationTimeSec <= clampedT
    let retainedCount = 0;
    for (let i = 0; i < this._count; i++) {
      const rec = this.getRecordAt(i);
      if (rec && rec.simulationTimeSec <= clampedT) {
        retainedCount = i + 1;
      } else {
        break;
      }
    }

    if (retainedCount === 0) {
      retainedCount = 1;
    }

    // Sao lưu các bản ghi cần giữ lại vào mảng tạm
    const retainedRecords: CausalFrameRecord[] = [];
    for (let i = 0; i < retainedCount; i++) {
      const rec = this.getRecordAt(i);
      if (rec) retainedRecords.push(rec);
    }

    // Thiết lập lại đệm vòng
    this._buffer.fill(null);
    for (let i = 0; i < retainedRecords.length; i++) {
      this._buffer[i] = retainedRecords[i];
    }
    this._count = retainedRecords.length;
    this._headIndex = this._count % this._capacity;
    this._isRewinding = false;

    const seedRecord = retainedRecords[retainedRecords.length - 1];
    this._currentPlaybackTimeSec = seedRecord.simulationTimeSec;

    return this._deepCloneSnapshot(seedRecord.snapshot);
  }

  /**
   * Xóa sạch toàn bộ đệm
   */
  public clear(): void {
    this._buffer.fill(null);
    this._headIndex = 0;
    this._count = 0;
    this._totalFramesCaptured = 0;
    this._isRewinding = false;
    this._currentPlaybackTimeSec = 0.0;
  }

  /**
   * Sao chép sâu an toàn một Snapshot
   */
  private _deepCloneSnapshot(src: MultiPhysicsBusSnapshot): MultiPhysicsBusSnapshot {
    return {
      simulationTimeSec: src.simulationTimeSec,
      ambientTemperatureC: src.ambientTemperatureC,
      atmosphericPressureKPa: src.atmosphericPressureKPa,
      gravityMps2: src.gravityMps2,
      electroThermalFluid: { ...src.electroThermalFluid },
      faradayLenz: { ...src.faradayLenz },
      filament: { ...src.filament },
    };
  }
}
