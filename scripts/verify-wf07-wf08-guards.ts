/**
 * Vòng 1 — Test âm cho guard WF-07 / WF-08 (C-11/C-17).
 * Guard phải FAIL khi chưa thao tác đúng và PASS chỉ khi có số đo thật.
 * Chạy: npx tsx scripts/verify-wf07-wf08-guards.ts
 */
import { EXPERIMENT_WORKFLOWS } from '../src/experiments/ExperimentWorkflows';
import type { SceneInstance } from '../src/domain/types';

function inst(assetId: string, state: Record<string, unknown> = {}): SceneInstance {
  return {
    instanceId: 'test-' + assetId,
    assetId,
    assetVersion: '1.0.0',
    parentZone: 'bench-main',
    transform: { positionM: [0, 0, 0], rotationRad: [0, 0, 0], displayScale: [1, 1, 1] },
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

const SLB = 'OL3D-EQP-SLB-0001';
const LSR = 'OL3D-EQP-LSR-0001';
const LEV = 'OL3D-EQP-LEV-0001';
const BAL = 'OL3D-EQP-BAL-0001'; // cân điện tử — guard WF-08 cũ bắt nhầm

console.log('--- WF-07 step 1: đặt bản bán trụ ---');
check('không có gì trên bàn -> fail', guard('WF-07', 1, []).isPassed, false);
check('chỉ có SLB -> pass', guard('WF-07', 1, [inst(SLB)]).isPassed, true);

console.log('--- WF-07 step 2: laser + góc tới 45° ---');
check('không có gì -> fail', guard('WF-07', 2, []).isPassed, false);
check('laser tắt -> fail', guard('WF-07', 2, [inst(LSR, { isPoweredOn: false }), inst(SLB, { incidentAngleDeg: 45 })]).isPassed, false);
check('laser bật, chưa đặt SLB -> fail', guard('WF-07', 2, [inst(LSR, { isPoweredOn: true })]).isPassed, false);
check('laser bật, góc 0° (mặc định) -> fail', guard('WF-07', 2, [inst(LSR, { isPoweredOn: true }), inst(SLB, { incidentAngleDeg: 0 })]).isPassed, false);
check('laser bật, góc 30° (default module) -> fail', guard('WF-07', 2, [inst(LSR, { isPoweredOn: true }), inst(SLB, { incidentAngleDeg: 30 })]).isPassed, false);
check('laser bật, góc 40° (preset) -> fail', guard('WF-07', 2, [inst(LSR, { isPoweredOn: true }), inst(SLB, { incidentAngleDeg: 40 })]).isPassed, false);
const g245 = guard('WF-07', 2, [inst(LSR, { isPoweredOn: true }), inst(SLB, { incidentAngleDeg: 45 })]);
check('laser bật, góc 45° -> pass', g245.isPassed, true, g245.reasonVi);

console.log('--- WF-07 step 3: r, n tính từ i ---');
check('laser tắt -> fail', guard('WF-07', 3, [inst(LSR, { isPoweredOn: false }), inst(SLB, { incidentAngleDeg: 45 })]).isPassed, false);
check('góc 30° -> fail', guard('WF-07', 3, [inst(LSR, { isPoweredOn: true }), inst(SLB, { incidentAngleDeg: 30 })]).isPassed, false);
const g345 = guard('WF-07', 3, [inst(LSR, { isPoweredOn: true }), inst(SLB, { incidentAngleDeg: 45 })]);
check('góc 45° -> pass, r=28.1 n=1.50', g345.isPassed, true, g345.reasonVi);
console.log(`    reason: ${g345.reasonVi}`);

console.log('--- WF-08 step 1: đặt đòn bẩy ---');
check('không có gì -> fail', guard('WF-08', 1, []).isPassed, false);
check('chỉ có cân BAL-0001 (bẫy cũ) -> fail', guard('WF-08', 1, [inst(BAL)]).isPassed, false);
check('có LEV -> pass', guard('WF-08', 1, [inst(LEV)]).isPassed, true);

console.log('--- WF-08 step 2: cân bằng không tải ---');
check('không có LEV -> fail', guard('WF-08', 2, []).isPassed, false);
check('LEV không tải, θ=0 -> pass (trạng thái ban đầu)', guard('WF-08', 2, [inst(LEV, { incidentAngleDeg: 0 })]).isPassed, true);
check('LEV còn quả cân -> fail', guard('WF-08', 2, [inst(LEV, { incidentAngleDeg: 0, leftMassG: 50 })]).isPassed, false);
check('LEV nghiêng 5° -> fail', guard('WF-08', 2, [inst(LEV, { incidentAngleDeg: 5 })]).isPassed, false);

console.log('--- WF-08 step 3: mô-men lực ---');
check('không có LEV -> fail', guard('WF-08', 3, []).isPassed, false);
check('chưa treo quả nào -> fail', guard('WF-08', 3, [inst(LEV, { incidentAngleDeg: 0 })]).isPassed, false);
check('chỉ treo trái -> fail', guard('WF-08', 3, [inst(LEV, { incidentAngleDeg: 0, leftMassG: 100, leftHoleIndex: 4 })]).isPassed, false);
check('treo mà chưa chọn lỗ phải -> fail', guard('WF-08', 3, [inst(LEV, { incidentAngleDeg: 0, leftMassG: 100, leftHoleIndex: 4, rightMassG: 50 })]).isPassed, false);
check('cặp cũ không làm được: 100g lỗ 5 vs 50g lỗ 9 (500 vs 450, lệch 10%) -> fail', guard('WF-08', 3, [inst(LEV, { incidentAngleDeg: 0, leftMassG: 100, leftHoleIndex: 5, rightMassG: 50, rightHoleIndex: 9 })]).isPassed, false);
const g3ok = guard('WF-08', 3, [inst(LEV, { incidentAngleDeg: 0, leftMassG: 100, leftHoleIndex: 4, rightMassG: 50, rightHoleIndex: 8 })]);
check('cặp mới: 100g lỗ 4 (800) vs 50g lỗ 8 (800) -> pass', g3ok.isPassed, true, g3ok.reasonVi);
console.log(`    reason: ${g3ok.reasonVi}`);
const g3alt = guard('WF-08', 3, [inst(LEV, { incidentAngleDeg: 0, leftMassG: 50, leftHoleIndex: 8, rightMassG: 100, rightHoleIndex: 4 })]);
check('cặp cân bằng khác (đổi bên) -> pass', g3alt.isPassed, true);
check('mô-men bằng nhau nhưng θ=5° -> fail', guard('WF-08', 3, [inst(LEV, { incidentAngleDeg: 5, leftMassG: 100, leftHoleIndex: 4, rightMassG: 50, rightHoleIndex: 8 })]).isPassed, false);

console.log(`\n================================================================`);
console.log(`🏁 WF-07/WF-08 GUARD TESTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`================================================================`);
process.exit(failed > 0 ? 1 : 0);
