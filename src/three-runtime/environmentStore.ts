/**
 * Vòng 5 (B) — Kho biến môi trường dùng chung (không thêm dependency).
 *
 * Vấn đề: giá trị g sống trong state React của LabViewport3D (`envVars`),
 * nên code ngoài React (solver, hand-tracking, bus vật lý) không đọc được g
 * live mà phải hard-code 9.80665 / 9.81. Kho này giữ một bản sao số hiện tại
 * của các biến môi trường, LabViewport3D ghi vào sau mỗi lần clamp
 * (handleUpdateEnvVar / handleResetEnvVars), các nơi khác đọc qua
 * getGravityMps2() / getEnvironmentVariables().
 *
 * Nguồn mặc định: INITIAL_ENVIRONMENT_VARIABLES (LabEnvironmentEngine).
 * Fallback khi chưa có giá trị: STANDARD_GRAVITY_MPS2.
 */
import {
  INITIAL_ENVIRONMENT_VARIABLES,
  STANDARD_GRAVITY_MPS2,
  type EnvironmentVariableId,
} from './LabEnvironmentEngine';

export type EnvironmentValues = Record<EnvironmentVariableId, number>;

function snapshotFromDefinitions(): EnvironmentValues {
  const out = {} as EnvironmentValues;
  for (const [id, def] of Object.entries(INITIAL_ENVIRONMENT_VARIABLES)) {
    (out as Record<string, number>)[id] = def.value;
  }
  return out;
}

let currentEnvironment: EnvironmentValues = snapshotFromDefinitions();
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((l) => l());
}

/** Đăng ký nghe thay đổi; trả về hàm huỷ đăng ký (dùng với useSyncExternalStore). */
export function subscribeEnvironment(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Bản snapshot hiện tại (identity đổi mỗi lần có cập nhật). */
export function getEnvironmentSnapshot(): EnvironmentValues {
  return currentEnvironment;
}

/** Toàn bộ giá trị biến môi trường hiện tại (bản sao). */
export function getEnvironmentVariables(): EnvironmentValues {
  return { ...currentEnvironment };
}

/** Giá trị hiện tại của một biến (undefined nếu không có biến đó). */
export function getEnvironmentVariable(id: EnvironmentVariableId): number | undefined {
  return currentEnvironment[id];
}

/** g live hiện tại; fallback về hằng chuẩn khi chưa có giá trị. */
export function getGravityMps2(): number {
  const g = currentEnvironment.gravityMps2;
  return typeof g === 'number' && Number.isFinite(g) ? g : STANDARD_GRAVITY_MPS2;
}

/** Ghi một biến (đã clamp ở nơi gọi) rồi thông báo cho listener. */
export function updateEnvironmentVariable(id: EnvironmentVariableId, value: number): void {
  if (currentEnvironment[id] === value) return;
  currentEnvironment = { ...currentEnvironment, [id]: value };
  notify();
}

/** Ghi đè toàn bộ biến (dùng khi reset về mặc định). */
export function setEnvironmentVariables(values: Partial<EnvironmentValues>): void {
  currentEnvironment = { ...currentEnvironment, ...values };
  notify();
}

/** Khôi phục toàn bộ về mặc định của LabEnvironmentEngine. */
export function resetEnvironmentVariables(): void {
  currentEnvironment = snapshotFromDefinitions();
  notify();
}
