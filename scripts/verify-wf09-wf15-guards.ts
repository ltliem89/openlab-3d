/**
 * Vòng 3 — Test âm cho guard WF-03 b.3, WF-09, WF-10 b.2, WF-11, WF-14 b.1, WF-15 b.3 (C-11/C-17).
 * Guard phải FAIL khi chưa thao tác đúng và PASS chỉ khi có số đo thật.
 * Các bước kẹt vì thiếu asset (WF-10 b.1/b.3, WF-14 b.2/b.3, WF-15 b.1/b.2) phải FAIL
 * với lý do trung thực, KHÔNG pass giả — test khẳng định điều đó.
 * Chạy: npx tsx scripts/verify-wf09-wf15-guards.ts
 */
import { EXPERIMENT_WORKFLOWS } from '../src/experiments/ExperimentWorkflows';
import type { SceneInstance } from '../src/domain/types';

function inst(assetId: string, state: Record<string, unknown> = {}, pos: [number, number, number] = [0, 0, 0]): SceneInstance {
  return {
    instanceId: 'test-' + assetId,
    assetId,
    assetVersion: '1.0.0',
    parentZone: 'bench-main',
    transform: { positionM: pos, rotationRad: [0, 0, 0], displayScale: [1, 1, 1] },
    visible: true,
    locked: false,
    labelVisible: false,
    instanceState: state as SceneInstance['instanceState'],
  };
}

let passed = 0;
let failed = 0;
function check(name: string, actual: boolean, expected: boolean, detail = '') {
  const ok = actual === expected;
  if (ok) passed++;
  else failed++;
  console.log(`${ok ? '  ✅ PASS' : '  ❌ FAIL'}: ${name} — got isPassed=${actual}, expected ${expected}${detail ? ` — ${detail}` : ''}`);
}
function guard(wf: string, step: number, instances: SceneInstance[]) {
  const stepDef = EXPERIMENT_WORKFLOWS[wf].steps.find((s) => s.stepIndex === step)!;
  return stepDef.validationGuard(instances);
}

const DYN = 'OL3D-EQP-DYN-0001';
const WGT = 'OL3D-EQP-WGT-0001';
const OVF = 'OL3D-EQP-OVF-0001';
const SLD = 'OL3D-EQP-SLD-0001';
const CYL = 'OL3D-EQP-CYL-0001';
const BKR = 'OL3D-EQP-BKR-0001';
const THM = 'OL3D-EQP-THM-0001';
const ALC = 'OL3D-EQP-ALC-0001';
const STW = 'OL3D-EQP-STW-0001';
const FLK = 'OL3D-EQP-FLK-0001';
const PHM = 'OL3D-EQP-PHM-0001';

console.log('--- WF-03 step 3: móc quả 50 g, F = 0,49 N ---');
check('không có gì -> fail', guard('WF-03', 3, []).isPassed, false);
check('chỉ có DYN -> fail', guard('WF-03', 3, [inst(DYN, { springExtensionN: 0 })]).isPassed, false);
check('WGT chưa móc -> fail', guard('WF-03', 3, [inst(DYN, { springExtensionN: 0 }), inst(WGT)]).isPassed, false);
check('WGT móc, F=0,49 -> pass', guard('WF-03', 3, [inst(DYN, { springExtensionN: 0.49 }), inst(WGT, { attachedToInstanceId: 'test-' + DYN, attachmentSlot: 'dynamometer-hook' })]).isPassed, true);
check('WGT móc, F=1,25 (treo vật khác) -> fail', guard('WF-03', 3, [inst(DYN, { springExtensionN: 1.25 }), inst(WGT, { attachedToInstanceId: 'test-' + DYN, attachmentSlot: 'dynamometer-hook' })]).isPassed, false);
check('WGT móc, thiếu springExtensionN -> fail', guard('WF-03', 3, [inst(DYN), inst(WGT, { attachedToInstanceId: 'test-' + DYN, attachmentSlot: 'dynamometer-hook' })]).isPassed, false);

console.log('--- WF-09 step 1: bình tràn đầy 210 ml ---');
check('không có gì -> fail', guard('WF-09', 1, []).isPassed, false);
check('chỉ có BKR (bẫy includes OVR/CAN cũ) -> fail', guard('WF-09', 1, [inst(BKR)]).isPassed, false);
check('OVF 125 ml (mức ban đầu) -> fail', guard('WF-09', 1, [inst(OVF, { baseLiquidLevelMl: 125 })]).isPassed, false);
check('OVF 209,5 ml -> pass', guard('WF-09', 1, [inst(OVF, { baseLiquidLevelMl: 209.5 })]).isPassed, true);
check('OVF 210 ml -> pass', guard('WF-09', 1, [inst(OVF, { baseLiquidLevelMl: 210 })]).isPassed, true);

console.log('--- WF-09 step 2: móc trụ nhôm, P1 = 0,65 N ---');
check('không có gì -> fail', guard('WF-09', 2, []).isPassed, false);
check('chỉ có DYN -> fail', guard('WF-09', 2, [inst(DYN, { springExtensionN: 0 })]).isPassed, false);
check('SLD chưa móc -> fail', guard('WF-09', 2, [inst(DYN, { springExtensionN: 0 }), inst(SLD)]).isPassed, false);
const g92 = guard('WF-09', 2, [inst(DYN, { springExtensionN: 0.65 }), inst(SLD, { attachedToInstanceId: 'test-' + DYN, attachmentSlot: 'dynamometer-hook' })]);
check('SLD móc, F=0,65 -> pass', g92.isPassed, true, g92.reasonVi);
check('SLD móc, F=1,25 (vật khác) -> fail', guard('WF-09', 2, [inst(DYN, { springExtensionN: 1.25 }), inst(SLD, { attachedToInstanceId: 'test-' + DYN, attachmentSlot: 'dynamometer-hook' })]).isPassed, false);

console.log('--- WF-09 step 3: nhúng chìm, tràn 24,5 ml ---');
check('không có gì -> fail', guard('WF-09', 3, []).isPassed, false);
check('SLD chưa chìm -> fail', guard('WF-09', 3, [inst(OVF, { overflowingVolumeMl: 0 }), inst(SLD)]).isPassed, false);
check('SLD chìm, chưa tràn (bình chưa đầy) -> fail', guard('WF-09', 3, [inst(OVF, { overflowingVolumeMl: 0 }), inst(SLD, { attachedToInstanceId: 'test-' + OVF, attachmentSlot: 'inside-vessel' })]).isPassed, false);
check('SLD chìm, tràn 20 ml -> fail', guard('WF-09', 3, [inst(OVF, { overflowingVolumeMl: 20 }), inst(SLD, { attachedToInstanceId: 'test-' + OVF, attachmentSlot: 'inside-vessel' })]).isPassed, false);
const g93 = guard('WF-09', 3, [inst(OVF, { overflowingVolumeMl: 24.54 }), inst(SLD, { attachedToInstanceId: 'test-' + OVF, attachmentSlot: 'inside-vessel' })]);
check('SLD chìm, tràn 24,54 ml -> pass', g93.isPassed, true, g93.reasonVi);
console.log(`    reason: ${g93.reasonVi}`);

console.log('--- WF-10 step 1: cân 10 g NaCl — KẸT (thiếu asset) ---');
check('bàn trống -> fail (trung thực)', guard('WF-10', 1, []).isPassed, false);
check('có cân cũng fail (chưa có NaCl)', guard('WF-10', 1, [inst('OL3D-EQP-BAL-0001', { measuredMassG: 50 })]).isPassed, false);

console.log('--- WF-10 step 2: đong 90 ml ---');
check('không có gì -> fail', guard('WF-10', 2, []).isPassed, false);
check('CYL 50 ml (mức ban đầu) -> fail', guard('WF-10', 2, [inst(CYL, { baseLiquidLevelMl: 50 })]).isPassed, false);
check('CYL 87,9 ml -> fail', guard('WF-10', 2, [inst(CYL, { baseLiquidLevelMl: 87.9 })]).isPassed, false);
check('CYL 88 ml (biên dưới) -> pass', guard('WF-10', 2, [inst(CYL, { baseLiquidLevelMl: 88 })]).isPassed, true);
check('CYL 90 ml -> pass', guard('WF-10', 2, [inst(CYL, { baseLiquidLevelMl: 90 })]).isPassed, true);
check('CYL 92 ml (biên trên) -> pass', guard('WF-10', 2, [inst(CYL, { baseLiquidLevelMl: 92 })]).isPassed, true);
check('CYL 100 ml (thừa) -> fail', guard('WF-10', 2, [inst(CYL, { baseLiquidLevelMl: 100 })]).isPassed, false);

console.log('--- WF-10 step 3: khuấy tan — KẸT (thiếu đũa khuấy) ---');
check('có cốc 90 ml cũng fail (chưa có đũa/cảm biến)', guard('WF-10', 3, [inst(BKR, { baseLiquidLevelMl: 90 })]).isPassed, false);

console.log('--- WF-11 step 1: cốc + nhiệt kế cắm trong + đèn sát cốc ---');
check('không có gì -> fail', guard('WF-11', 1, []).isPassed, false);
check('chỉ có cốc -> fail', guard('WF-11', 1, [inst(BKR)]).isPassed, false);
check('nhiệt kế chưa cắm vào cốc -> fail', guard('WF-11', 1, [inst(BKR), inst(THM), inst(ALC, {}, [0.1, 0, 0])]).isPassed, false);
check('nhiệt kế cắm, chưa có đèn -> fail', guard('WF-11', 1, [inst(BKR), inst(THM, { attachedToInstanceId: 'test-' + BKR, attachmentSlot: 'inside-vessel' })]).isPassed, false);
check('đủ đồ, đèn cách 0,5 m -> fail', guard('WF-11', 1, [inst(BKR), inst(THM, { attachedToInstanceId: 'test-' + BKR, attachmentSlot: 'inside-vessel' }), inst(ALC, {}, [0.5, 0, 0])]).isPassed, false);
check('đủ đồ, đèn cách 0,35 m (biên) -> pass', guard('WF-11', 1, [inst(BKR), inst(THM, { attachedToInstanceId: 'test-' + BKR, attachmentSlot: 'inside-vessel' }), inst(ALC, {}, [0.35, 0, 0])]).isPassed, true);
check('đủ đồ, đèn cách 0,1 m -> pass', guard('WF-11', 1, [inst(BKR), inst(THM, { attachedToInstanceId: 'test-' + BKR, attachmentSlot: 'inside-vessel' }), inst(ALC, {}, [0.1, 0, 0])]).isPassed, true);

console.log('--- WF-11 step 2: châm lửa đèn cồn ---');
check('không có gì -> fail', guard('WF-11', 2, []).isPassed, false);
check('đèn chưa cháy -> fail', guard('WF-11', 2, [inst(ALC, { isFlameLit: false })]).isPassed, false);
check('đèn cháy (isFlameLit) -> pass', guard('WF-11', 2, [inst(ALC, { isFlameLit: true })]).isPassed, true);
check('đèn cháy (isHeating) -> pass', guard('WF-11', 2, [inst(ALC, { isHeating: true })]).isPassed, true);
check('asset lạ BRN-0001 -> fail', guard('WF-11', 2, [inst('OL3D-EQP-BRN-0001', { isFlameLit: true })]).isPassed, false);

console.log('--- WF-11 step 3: sôi 100 °C sau ≥ 18 s đun thật ---');
check('không có gì -> fail', guard('WF-11', 3, []).isPassed, false);
check('nhiệt kế chưa cắm vào cốc -> fail', guard('WF-11', 3, [inst(BKR), inst(THM, { temperatureC: 100 }), inst(ALC, { isFlameLit: true }), inst(STW, { recordedTimeS: 22.5 })]).isPassed, false);
check('đèn tắt, T=100 -> fail', guard('WF-11', 3, [inst(BKR), inst(THM, { temperatureC: 100, attachedToInstanceId: 'test-' + BKR, attachmentSlot: 'inside-vessel' }), inst(ALC, { isFlameLit: false }), inst(STW, { recordedTimeS: 22.5 })]).isPassed, false);
check('T=50, đèn cháy -> fail', guard('WF-11', 3, [inst(BKR), inst(THM, { temperatureC: 50, attachedToInstanceId: 'test-' + BKR, attachmentSlot: 'inside-vessel' }), inst(ALC, { isFlameLit: true }), inst(STW, { recordedTimeS: 22.5 })]).isPassed, false);
check('T=100 nhưng không có bấm giờ (lỗ hổng pass-giả cũ) -> fail', guard('WF-11', 3, [inst(BKR), inst(THM, { temperatureC: 100, attachedToInstanceId: 'test-' + BKR, attachmentSlot: 'inside-vessel' }), inst(ALC, { isFlameLit: true })]).isPassed, false);
check('T=100, bấm giờ chỉ 5 s (preset/bấm next) -> fail', guard('WF-11', 3, [inst(BKR), inst(THM, { temperatureC: 100, attachedToInstanceId: 'test-' + BKR, attachmentSlot: 'inside-vessel' }), inst(ALC, { isFlameLit: true }), inst(STW, { recordedTimeS: 5 })]).isPassed, false);
const g113 = guard('WF-11', 3, [inst(BKR), inst(THM, { temperatureC: 100, attachedToInstanceId: 'test-' + BKR, attachmentSlot: 'inside-vessel' }), inst(ALC, { isFlameLit: true }), inst(STW, { recordedTimeS: 22.5 })]);
check('T=100, bấm giờ 22,5 s -> pass', g113.isPassed, true, g113.reasonVi);
console.log(`    reason: ${g113.reasonVi}`);

console.log('--- WF-14 step 1: 2 bình ~100 ml ---');
check('không có gì -> fail', guard('WF-14', 1, []).isPassed, false);
check('1 bình 105 ml -> fail', guard('WF-14', 1, [inst(FLK, { baseLiquidLevelMl: 105 })]).isPassed, false);
check('2 bình 125 ml (mức ban đầu) -> fail', guard('WF-14', 1, [inst(FLK, { baseLiquidLevelMl: 125 }), inst(FLK, { baseLiquidLevelMl: 125 })]).isPassed, false);
check('2 bình 105 ml -> pass', guard('WF-14', 1, [inst(FLK, { baseLiquidLevelMl: 105 }), inst(FLK, { baseLiquidLevelMl: 105 })]).isPassed, true);
check('2 bình 95/110 ml (biên) -> pass', guard('WF-14', 1, [inst(FLK, { baseLiquidLevelMl: 95 }), inst(FLK, { baseLiquidLevelMl: 110 })]).isPassed, true);
check('2 bình, 1 bình 94 ml -> fail', guard('WF-14', 1, [inst(FLK, { baseLiquidLevelMl: 105 }), inst(FLK, { baseLiquidLevelMl: 94 })]).isPassed, false);
check('2 bình, 1 bình 111 ml -> fail', guard('WF-14', 1, [inst(FLK, { baseLiquidLevelMl: 105 }), inst(FLK, { baseLiquidLevelMl: 111 })]).isPassed, false);

console.log('--- WF-14 step 2/3 — KẸT (thiếu cành cây + cơ chế thời gian) ---');
check('b2: 2 bình đủ nước cũng fail', guard('WF-14', 2, [inst(FLK, { baseLiquidLevelMl: 105 }), inst(FLK, { baseLiquidLevelMl: 105 })]).isPassed, false);
check('b3: 2 bình đủ nước cũng fail', guard('WF-14', 3, [inst(FLK, { baseLiquidLevelMl: 105 }), inst(FLK, { baseLiquidLevelMl: 105 })]).isPassed, false);

console.log('--- WF-15 step 1/2 — KẸT (thiếu khay mẫu / giấy pH) ---');
check('b1: bàn trống -> fail', guard('WF-15', 1, []).isPassed, false);
check('b2: bàn trống -> fail', guard('WF-15', 2, []).isPassed, false);

console.log('--- WF-15 step 3: máy đo pH PHM-0001, chọn mẫu preset ---');
check('không có gì -> fail', guard('WF-15', 3, []).isPassed, false);
check('PHM chưa chọn chế độ -> fail', guard('WF-15', 3, [inst(PHM)]).isPassed, false);
check('PHM ở chế độ V (không phải pH) -> fail', guard('WF-15', 3, [inst(PHM, { multimeterMode: 'V', multimeterValue: 7.0 })]).isPassed, false);
check('PHM chế độ pH, chưa có số đọc -> fail', guard('WF-15', 3, [inst(PHM, { multimeterMode: 'pH' })]).isPassed, false);
check('PHM pH=5,00 (không khớp mẫu) -> fail', guard('WF-15', 3, [inst(PHM, { multimeterMode: 'pH', multimeterValue: 5.0 })]).isPassed, false);
const g153a = guard('WF-15', 3, [inst(PHM, { multimeterMode: 'pH', multimeterValue: 2.9 })]);
check('PHM pH=2,90 (Axit) -> pass', g153a.isPassed, true, g153a.reasonVi);
check('PHM pH=7,00 (Nước cất) -> pass', guard('WF-15', 3, [inst(PHM, { multimeterMode: 'pH', multimeterValue: 7.0 })]).isPassed, true);
check('PHM pH=11,50 (Kiềm) -> pass', guard('WF-15', 3, [inst(PHM, { multimeterMode: 'pH', multimeterValue: 11.5 })]).isPassed, true);
check('PHM pH=7,04 (trong dung sai) -> pass', guard('WF-15', 3, [inst(PHM, { multimeterMode: 'pH', multimeterValue: 7.04 })]).isPassed, true);
check('PHM pH=7,06 (ngoài dung sai) -> fail', guard('WF-15', 3, [inst(PHM, { multimeterMode: 'pH', multimeterValue: 7.06 })]).isPassed, false);
console.log(`    reason: ${g153a.reasonVi}`);

console.log(`\n================================================================`);
console.log(`🏁 WF-09/WF-15 GUARD TESTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`================================================================`);
process.exit(failed > 0 ? 1 : 0);
