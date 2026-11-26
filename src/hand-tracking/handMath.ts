/**
 * HAND-01 (Vòng 2) — Toán thuần cho nhận diện bàn tay bằng camera.
 * Mọi hàm ở đây đều thuần (không chạm DOM / camera / MediaPipe) nên kiểm
 * định được bằng script mà không cần camera thật.
 *
 * Nguồn số liệu:
 * - Pinch: tỉ lệ |ngón cái 4 − ngón trỏ 8| / cỡ bàn tay |cổ tay 0 − MCP giữa 9|,
 *   trễ hai ngưỡng vào 0.30 / ra 0.45 (nghiên cứu sâu 26/11/2026).
 * - Trọng lực: g live từ kho môi trường (environmentStore.getGravityMps2()),
 *   fallback về hằng chuẩn STANDARD_GRAVITY_MPS2 = 9.80665 m/s²
 *   (LabEnvironmentEngine.ts) — Vòng 5 (B). KHÔNG hard-code 9.81 mới.
 * - Giới hạn bàn: BENCH_LIMIT_X = 1.15, BENCH_LIMIT_Z = 0.435
 *   (LabViewport3D.tsx) — vị trí tay luôn clamp vào bàn.
 */

import { getGravityMps2 } from '../three-runtime/environmentStore';

/**
 * Vòng 5 (B): g live cho rơi khi buông tay — đọc từ kho môi trường
 * (người dùng đổi preset Mặt Trăng thì vật rơi chậm lại thật), fallback về
 * hằng chuẩn STANDARD_GRAVITY_MPS2 khi kho chưa có giá trị.
 */
export function getLiveGravityMps2(): number {
  return getGravityMps2();
}

export const BENCH_LIMIT_X_M = 1.15;
export const BENCH_LIMIT_Z_M = 0.435;
/** Độ cao tối đa tay có thể nâng vật (m, trên mặt bàn). */
export const HAND_MAX_HEIGHT_M = 0.35;
/** Ngưỡng pinch: vào cầm / ra buông. */
export const PINCH_ON_RATIO = 0.3;
export const PINCH_OFF_RATIO = 0.45;

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

function dist(a: Landmark, b: Landmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Tỉ lệ chụm = khoảng cách đầu ngón cái (4) − đầu ngón trỏ (8), chia cho cỡ
 * bàn tay (cổ tay 0 − khớp MCP ngón giữa 9). Chuẩn hoá theo cỡ tay nên không
 * phụ thuộc khoảng cách tay–camera. Trả về NaN khi thiếu landmark.
 */
export function computePinchRatio(landmarks: Landmark[] | null | undefined): number {
  if (!landmarks || landmarks.length < 10) return NaN;
  const handSize = dist(landmarks[0], landmarks[9]);
  if (!(handSize > 0)) return NaN;
  return dist(landmarks[4], landmarks[8]) / handSize;
}

/** Máy trạng thái chụm với trễ hai ngưỡng + giữ + nguội sau buông. */
export type PinchState = 'open' | 'pinching';
export class PinchStateMachine {
  private state: PinchState = 'open';
  private pinchSinceMs = 0;
  private lastReleaseMs = -10000;
  constructor(
    private readonly holdMs = 150,
    private readonly cooldownMs = 150,
  ) {}
  get current(): PinchState {
    return this.state;
  }
  /**
   * Cập nhật với tỉ lệ chụm hiện tại. Trả về trạng thái mới.
   * - open → pinching: tỉ lệ < 0.30 và giữ liên tục đủ holdMs.
   * - pinching → open: tỉ lệ > 0.45, rồi nguội cooldownMs trước khi cầm lại.
   */
  update(ratio: number, nowMs: number): PinchState {
    if (this.state === 'open') {
      if (Number.isFinite(ratio) && ratio < PINCH_ON_RATIO) {
        if (this.pinchSinceMs === 0) this.pinchSinceMs = nowMs;
        if (nowMs - this.pinchSinceMs >= this.holdMs && nowMs - this.lastReleaseMs >= this.cooldownMs) {
          this.state = 'pinching';
          this.pinchSinceMs = 0;
        }
      } else {
        this.pinchSinceMs = 0;
      }
    } else if (Number.isFinite(ratio) && ratio > PINCH_OFF_RATIO) {
      this.state = 'open';
      this.lastReleaseMs = nowMs;
      this.pinchSinceMs = 0;
    }
    return this.state;
  }
  reset(): void {
    this.state = 'open';
    this.pinchSinceMs = 0;
    this.lastReleaseMs = -10000;
  }
}

/** Lọc One Euro (mặc định minCutoff 1.0 Hz, beta 0, dCutoff 1.0 Hz). */
export class OneEuroFilter {
  private xPrev: number | null = null;
  private dxPrev = 0;
  private tPrev: number | null = null;
  constructor(
    private readonly minCutoff = 1.0,
    private readonly beta = 0,
    private readonly dCutoff = 1.0,
  ) {}
  private alpha(cutoff: number, dt: number): number {
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / dt);
  }
  filter(x: number, nowMs: number): number {
    if (this.xPrev === null || this.tPrev === null) {
      this.xPrev = x;
      this.tPrev = nowMs;
      return x;
    }
    const dt = Math.max(1, nowMs - this.tPrev) / 1000;
    const dx = (x - this.xPrev) / dt;
    const aD = this.alpha(this.dCutoff, dt);
    const dxHat = aD * dx + (1 - aD) * this.dxPrev;
    const cutoff = this.minCutoff + this.beta * Math.abs(dxHat);
    const a = this.alpha(cutoff, dt);
    const xHat = a * x + (1 - a) * this.xPrev;
    this.xPrev = xHat;
    this.dxPrev = dxHat;
    this.tPrev = nowMs;
    return xHat;
  }
  reset(): void {
    this.xPrev = null;
    this.dxPrev = 0;
    this.tPrev = null;
  }
}

export interface BenchPoint {
  /** X trên mặt bàn (m), −1.15..+1.15. */
  x: number;
  /** Z trên mặt bàn (m), −0.435..+0.435. */
  z: number;
  /** Độ cao vật so với mặt bàn (m), 0..0.35. */
  heightM: number;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/**
 * Ánh xạ landmark 9 (MCP ngón giữa — điểm neo con trỏ) sang mặt bàn.
 * Camera selfie bị lật ngang nên X đảo dấu. Y ảnh (0 trên, 1 dưới) → Z bàn
 * (trên ảnh = xa, Z âm; dưới ảnh = gần, Z dương). Độ sâu chỉ là gợi ý từ cỡ
 * bàn tay, clamp 0..0.35 m — không dùng z thô của MediaPipe (nhiễu, không có
 * đơn vị thực).
 */
export function landmarkToBench(
  landmark9: Landmark,
  handSizeNorm: number,
): BenchPoint {
  const x = clamp((0.5 - landmark9.x) * 2 * BENCH_LIMIT_X_M, -BENCH_LIMIT_X_M, BENCH_LIMIT_X_M);
  const z = clamp((landmark9.y - 0.5) * 2 * BENCH_LIMIT_Z_M, -BENCH_LIMIT_Z_M, BENCH_LIMIT_Z_M);
  // Tay càng gần camera (cỡ tay càng lớn) thì nâng càng cao; tay xa → thấp.
  const heightM = clamp((handSizeNorm - 0.12) * 2.5, 0, HAND_MAX_HEIGHT_M);
  return { x, z, heightM };
}

/** Một bước tích phân rơi: vy -= g·dt; y += vy·dt; chạm y=0 thì dừng. */
export function stepDrop(
  y: number,
  vy: number,
  dtS: number,
  g: number = getLiveGravityMps2(),
): { y: number; vy: number; landed: boolean } {
  const nextVy = vy - g * dtS;
  const nextY = y + nextVy * dtS;
  if (nextY <= 0) return { y: 0, vy: 0, landed: true };
  return { y: nextY, vy: nextVy, landed: false };
}

/**
 * Tap = pinch ngắn + ít di chuyển: phân biệt "chạm để chọn/mở chỉ dẫn" với
 * "chụm để cầm". Ngưỡng: < 250 ms và dịch con trỏ < 6 px (theo nghiên cứu).
 */
export function isTap(
  pinchDurationMs: number,
  cursorMovePx: number,
  maxDurationMs = 250,
  maxMovePx = 6,
): boolean {
  return pinchDurationMs < maxDurationMs && cursorMovePx < maxMovePx;
}
