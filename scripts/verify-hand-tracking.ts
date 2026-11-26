/**
 * Vòng 2 (HAND-01) — Kiểm định toán thuần của nhận diện bàn tay.
 * Không cần camera thật. Chạy: npx tsx scripts/verify-hand-tracking.ts
 */
import {
  BENCH_LIMIT_X_M,
  BENCH_LIMIT_Z_M,
  computePinchRatio,
  getLiveGravityMps2,
  isTap,
  landmarkToBench,
  OneEuroFilter,
  PinchStateMachine,
  stepDrop,
} from '../src/hand-tracking/handMath';
import type { Landmark } from '../src/hand-tracking/handMath';

let passed = 0;
let failed = 0;
function check(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (ok) passed++;
  else failed++;
  console.log(`${ok ? '  ✅ PASS' : '  ❌ FAIL'}: ${name} — got ${actual}, expected ${expected}`);
}
function checkClose(name: string, actual: number, expected: number, tol = 1e-6) {
  const ok = Math.abs(actual - expected) <= tol;
  if (ok) passed++;
  else failed++;
  console.log(`${ok ? '  ✅ PASS' : '  ❌ FAIL'}: ${name} — got ${actual}, expected ${expected} ± ${tol}`);
}
function lm(x: number, y: number, z = 0): Landmark {
  return { x, y, z };
}
function hand(open: boolean): Landmark[] {
  // Cổ tay 0 tại (0.5, 0.8); MCP giữa 9 tại (0.5, 0.5) → cỡ tay 0.3.
  // Mở: ngón cái 4 tại (0.35, 0.45), ngón trỏ 8 tại (0.65, 0.35) → |4-8| ≈ 0.316 → tỉ lệ ≈ 1.05.
  // Chụm: 4 và 8 cùng tại (0.5, 0.45) → tỉ lệ 0.
  const arr: Landmark[] = Array.from({ length: 21 }, () => lm(0.5, 0.5));
  arr[0] = lm(0.5, 0.8);
  arr[9] = lm(0.5, 0.5);
  arr[4] = open ? lm(0.35, 0.45) : lm(0.5, 0.45);
  arr[8] = open ? lm(0.65, 0.35) : lm(0.5, 0.45);
  return arr;
}

console.log('--- Pinch ratio ---');
checkClose('tay mở: tỉ lệ > 0.45', computePinchRatio(hand(true)), 1.054, 0.01);
check('tay chụm: tỉ lệ = 0', computePinchRatio(hand(false)), 0);
check('thiếu landmark -> NaN', Number.isNaN(computePinchRatio(null)), true);
check('thiếu landmark -> NaN (mảng ngắn)', Number.isNaN(computePinchRatio([lm(0, 0)])), true);

console.log('--- Pinch state machine (trễ 0.30 vào / 0.45 ra, giữ 150ms) ---');
const sm = new PinchStateMachine();
check('mở ban đầu', sm.current, 'open');
check('chụm 0ms chưa đủ giữ -> open', sm.update(0.1, 1000), 'open');
check('chụm 100ms chưa đủ giữ -> open', sm.update(0.1, 1100), 'open');
check('chụm 200ms đủ giữ -> pinching', sm.update(0.1, 1200), 'pinching');
check('tỉ lệ 0.35 (vùng trễ) vẫn pinching', sm.update(0.35, 1300), 'pinching');
check('tỉ lệ 0.5 > 0.45 -> open', sm.update(0.5, 1400), 'open');
check('cầm lại ngay trong nguội 150ms -> open', sm.update(0.1, 1500), 'open');
check('sau nguội + giữ đủ -> pinching', sm.update(0.1, 1700), 'pinching');

console.log('--- One Euro filter: làm mượt nhiễu ---');
const f = new OneEuroFilter();
const noisy = [0.5, 0.52, 0.48, 0.51, 0.49, 0.5, 0.5, 0.5];
let last = 0;
noisy.forEach((v, i) => {
  last = f.filter(v, 1000 + i * 33);
});
check('nhiễu ±0.02 quanh 0.5 -> ra gần 0.5', Math.abs(last - 0.5) < 0.01, true);

console.log('--- landmark -> bench mapping ---');
const center = landmarkToBench(lm(0.5, 0.5), 0.2);
checkClose('giữa ảnh -> x=0', center.x, 0);
checkClose('giữa ảnh -> z=0', center.z, 0);
const left = landmarkToBench(lm(0.0, 0.5), 0.2);
check('trái ảnh (đã lật selfie) -> x dương tối đa', left.x > 0, true);
check('x clamp trong bàn', Math.abs(left.x) <= BENCH_LIMIT_X_M, true);
const top = landmarkToBench(lm(0.5, 0.0), 0.2);
check('trên ảnh -> z âm (xa)', top.z < 0, true);
check('z clamp trong bàn', Math.abs(top.z) <= BENCH_LIMIT_Z_M, true);
check('tay xa (cỡ 0.12) -> cao 0', landmarkToBench(lm(0.5, 0.5), 0.12).heightM, 0);
check('tay gần (cỡ 0.3) -> cao > 0', landmarkToBench(lm(0.5, 0.5), 0.3).heightM > 0, true);
check('cao clamp ≤ 0.35', landmarkToBench(lm(0.5, 0.5), 1.0).heightM <= 0.35, true);

console.log('--- Rơi khi buông (g live từ kho môi trường, Vòng 5) ---');
checkClose('g mặc định = 9.80665', getLiveGravityMps2(), 9.80665);
let drop = stepDrop(0.35, 0, 0.016);
check('rơi 1 frame: y giảm, chưa chạm', drop.landed, false);
check('rơi 1 frame: vy âm', drop.vy < 0, true);
let y = 0.35;
let vy = 0;
let steps = 0;
while (steps < 100) {
  const r = stepDrop(y, vy, 0.016);
  y = r.y;
  vy = r.vy;
  steps++;
  if (r.landed) break;
}
check('rơi từ 0.35m chạm bàn trong < 100 frame', y, 0);
check('chạm bàn: vy = 0', vy, 0);
check('thời gian rơi ≈ sqrt(2*0.35/9.81) ≈ 0.267s (~17 frame)', steps >= 15 && steps <= 19, true);

console.log('--- Tap vs cầm ---');
check('chụm 100ms, dịch 2px -> tap', isTap(100, 2), true);
check('chụm 300ms -> không phải tap', isTap(300, 2), false);
check('chụm 100ms, dịch 20px -> không phải tap', isTap(100, 20), false);

console.log(`\n================================================================`);
console.log(`🏁 HAND-TRACKING TESTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`================================================================`);
process.exit(failed > 0 ? 1 : 0);
