/**
 * OPENLAB 3D — CHRONO-CAUSAL SANDBOX & COUNTERFACTUAL ENGINE
 * 
 * Hệ thống Đảo chiều Nhân quả Xác định (Deterministic Causal Time-Reversal)
 * & Mô phỏng Đa kịch bản Đối thực (Counterfactual Simulation Sandbox)
 * 
 * 1. Lưu trữ Circular Ring Buffer 180 khung hình (3 giây ở 60 FPS) trạng thái vật lý.
 * 2. Hỗ trợ thao tác tua ngược thời gian (Time Rewind t -> -t) đảo ngược tiến trình chất lỏng và mạch điện.
 * 3. Hỗ trợ biến thiên tham số điều kiện biên gia tốc trọng trường g (Mặt Trăng, Trái Đất, Sao Hỏa, Sao Mộc)
 *    để phân tích nhân quả đối thực theo chuẩn Judea Pearl.
 */

export interface SimulationStateSnapshot {
  timestampMs: number;
  instancesState: Map<string, Record<string, any>>;
  environmentG: number;
  environmentTempC: number;
}

// Vòng 5 (B): bảng preset dùng chung từ LabEnvironmentEngine (nguồn duy nhất).
// Sao Hỏa đã sửa 3.72 → 3.71 m/s² (NASA). Re-export để code cũ vẫn import được.
import {
  CELESTIAL_GRAVITY_PRESETS,
  STANDARD_GRAVITY_MPS2,
  type CelestialBodyGravity,
} from '../three-runtime/LabEnvironmentEngine';

export { CELESTIAL_GRAVITY_PRESETS, type CelestialBodyGravity };

export class ChronoCausalSandbox {
  private _historyBuffer: SimulationStateSnapshot[] = [];
  private readonly _maxBufferCapacity: number = 180; // 3 giây ở 60 FPS
  private _bufferHead: number = 0;
  private _isFull: number = 0;
  private _isRewinding: boolean = false;
  private _currentPreset: CelestialBodyGravity = 'EARTH';
  private _customGravity: number = STANDARD_GRAVITY_MPS2;

  constructor() {
    this._historyBuffer = new Array(this._maxBufferCapacity);
  }

  /**
   * Lưu trữ một trạng thái tức thời vào Circular Ring Buffer
   */
  public captureSnapshot(instancesMap: Map<string, Record<string, any>>): void {
    if (this._isRewinding) return;

    const clonedMap = new Map<string, Record<string, any>>();
    for (const [id, state] of instancesMap.entries()) {
      // Deep clone cô lập hoàn toàn trạng thái (Chống State Bleed)
      try {
        clonedMap.set(id, JSON.parse(JSON.stringify(state)));
      } catch {
        clonedMap.set(id, { ...state });
      }
    }

    const snapshot: SimulationStateSnapshot = {
      timestampMs: performance.now(),
      instancesState: clonedMap,
      environmentG: this._customGravity,
      environmentTempC: 25.0,
    };

    this._historyBuffer[this._bufferHead] = snapshot;
    this._bufferHead = (this._bufferHead + 1) % this._maxBufferCapacity;
    if (this._isFull < this._maxBufferCapacity) {
      this._isFull++;
    }
  }

  /**
   * Kiểm tra khả năng tua ngược thời gian
   */
  public canStepBackward(): boolean {
    return this._isFull > 1;
  }

  /**
   * Lấy trạng thái quá khứ liền trước (t -> t - dt)
   */
  public stepBackward(): SimulationStateSnapshot | null {
    if (this._isFull <= 1) return null;

    this._isRewinding = true;
    this._bufferHead = (this._bufferHead - 1 + this._maxBufferCapacity) % this._maxBufferCapacity;
    this._isFull--;

    const snapshot = this._historyBuffer[this._bufferHead];
    // Cho phép tiếp tục capture sau khi kết thúc chu kỳ tua
    setTimeout(() => {
      this._isRewinding = false;
    }, 50);

    return snapshot ?? null;
  }

  /**
   * Tua ngược thời gian theo số giây yêu cầu (ChronoCausal Rewind)
   */
  public rewindSeconds(seconds: number = 5): SimulationStateSnapshot | null {
    const framesToRewind = Math.max(1, Math.round(seconds * 60));
    let lastSnap: SimulationStateSnapshot | null = null;
    const steps = Math.min(framesToRewind, Math.max(1, this._isFull - 1));
    for (let i = 0; i < steps; i++) {
      const snap = this.stepBackward();
      if (snap) lastSnap = snap;
    }
    // Đồng bộ với ChronoCausalRingBuffer trong Solver Registry nếu có
    try {
      if (typeof window !== 'undefined' && (window as any).scientificSolverRegistry) {
        const ring = (window as any).scientificSolverRegistry.getChronoRingBuffer();
        const pastSnap = ring.scrubBackward(seconds);
        if (pastSnap) {
          ring.forkBranchAt(pastSnap.simulationTimeSec);
        } else {
          ring.isRewinding = false;
        }
      }
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openlab:chrono-rewind', { detail: { seconds, snapshot: lastSnap } }));
    }
    return lastSnap;
  }

  /**
   * Thiết lập trọng trường đối thực (Counterfactual Sandbox)
   */
  public setCelestialGravity(preset: CelestialBodyGravity): number {
    this._currentPreset = preset;
    this._customGravity = Math.max(0.001, CELESTIAL_GRAVITY_PRESETS[preset].g);
    return this._customGravity;
  }

  public get currentGravity(): number {
    return this._customGravity;
  }

  public get currentPreset(): CelestialBodyGravity {
    return this._currentPreset;
  }

  public get isRewinding(): boolean {
    return this._isRewinding;
  }

  public reset(): void {
    this._bufferHead = 0;
    this._isFull = 0;
    this._isRewinding = false;
  }
}

export const chronoCausalSandbox = new ChronoCausalSandbox();

declare global {
  interface Window {
    chronoCausalSandbox?: ChronoCausalSandbox;
  }
}

if (typeof window !== 'undefined') {
  (window as any).chronoCausalSandbox = chronoCausalSandbox;
}
