/**
 * Vòng 5 — Kiểm định 3 phần (C) model/WASM local, (B) trọng lực nguồn duy
 * nhất, (A) mạng chỉ dẫn thí điểm WF-08. Không cần camera thật / trình duyệt.
 * Chạy: npx tsx scripts/verify-vong5-guide-gravity.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { EXPERIMENT_WORKFLOWS } from '../src/experiments/ExperimentWorkflows';
import {
  experimentWorkflowEngine,
  matchesRequiredArchetype,
} from '../src/experiments/ExperimentWorkflowEngine';
import {
  CELESTIAL_GRAVITY_PRESETS,
  LAB_EVENT_GUIDE_HINT_SHOWN,
  LAB_EVENT_WORKFLOW_STEP_FAIL,
  LAB_EVENT_WORKFLOW_STEP_PASS,
  STANDARD_GRAVITY_MPS2,
} from '../src/three-runtime/LabEnvironmentEngine';
import {
  getEnvironmentVariables,
  getGravityMps2,
  resetEnvironmentVariables,
  subscribeEnvironment,
  updateEnvironmentVariable,
} from '../src/three-runtime/environmentStore';
import { getLiveGravityMps2 } from '../src/hand-tracking/handMath';
import {
  createGuidePilotTracker,
  guideLogKey,
  recordGuideEvaluation,
  shouldShowGuideHint,
} from '../src/components/panels/guidePilot';
import type { SceneInstance } from '../src/domain/types';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function inst(
  assetId: string,
  state: Record<string, unknown> = {},
  pos: [number, number, number] = [0, 0, 0],
): SceneInstance {
  return {
    instanceId: 'test-' + assetId + '-' + pos.join(','),
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
function check(name: string, actual: unknown, expected: unknown, detail = '') {
  const ok = actual === expected;
  if (ok) passed++;
  else failed++;
  console.log(`${ok ? '  ✅ PASS' : '  ❌ FAIL'}: ${name} — got ${actual}, expected ${expected}${detail ? ` — ${detail}` : ''}`);
}
function checkClose(name: string, actual: number, expected: number, tol = 1e-6) {
  const ok = Math.abs(actual - expected) <= tol;
  if (ok) passed++;
  else failed++;
  console.log(`${ok ? '  ✅ PASS' : '  ❌ FAIL'}: ${name} — got ${actual}, expected ${expected} ± ${tol}`);
}
function guard(wf: string, step: number, instances: SceneInstance[]) {
  const stepDef = EXPERIMENT_WORKFLOWS[wf].steps.find((s) => s.stepIndex === step)!;
  return stepDef.validationGuard(instances);
}

const LEV = 'OL3D-EQP-LEV-0001';
const BAL = 'OL3D-EQP-BAL-0001';

// ================= (C) Model + WASM local =================
console.log('--- (C) Model + WASM tay về local ---');
const localFiles = [
  'public/hand-tracking/hand_landmarker.task',
  'public/hand-tracking/wasm/vision_wasm_internal.js',
  'public/hand-tracking/wasm/vision_wasm_internal.wasm',
  'public/hand-tracking/wasm/vision_wasm_nosimd_internal.js',
  'public/hand-tracking/wasm/vision_wasm_nosimd_internal.wasm',
];
for (const f of localFiles) {
  const p = path.join(ROOT, f);
  const ok = fs.existsSync(p) && fs.statSync(p).size > 0;
  check(`file local tồn tại: ${f}`, ok, true, ok ? `${(fs.statSync(p).size / 1048576).toFixed(2)} MB` : 'thiếu hoặc rỗng');
}
// Controller chọn nguồn local khi đủ cả 3 file probe (model + .js glue + .wasm).
const probeFiles = [
  'public/hand-tracking/hand_landmarker.task',
  'public/hand-tracking/wasm/vision_wasm_internal.js',
  'public/hand-tracking/wasm/vision_wasm_internal.wasm',
];
check(
  'controller sẽ chọn nguồn local (đủ 3 file probe)',
  probeFiles.every((f) => fs.existsSync(path.join(ROOT, f))),
  true,
);
// Build đã copy file vào dist (chạy sau npm run build).
const distFiles = localFiles.map((f) => f.replace('public/', 'dist/'));
check(
  'dist có đủ 5 file (build copy từ public/)',
  distFiles.every((f) => fs.existsSync(path.join(ROOT, f))),
  true,
  distFiles.filter((f) => !fs.existsSync(path.join(ROOT, f))).join(', ') || 'đủ',
);
// Chạy lại script tải phải idempotent (bỏ qua file đã đúng, exit 0).
try {
  const out = execSync('node scripts/download-hand-tracking-assets.mjs', {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 120000,
  });
  const skipped = (out.match(/bỏ qua/g) || []).length;
  check('chạy lại script tải: idempotent (bỏ qua 5 file đã đúng)', skipped >= 5, true, out.trim().split('\n').pop() ?? '');
} catch (e) {
  check('chạy lại script tải: idempotent', 'lỗi', 'exit 0', String(e));
}

// ================= (B) Trọng lực nguồn duy nhất =================
console.log('--- (B) Trọng lực nguồn duy nhất ---');
check('STANDARD_GRAVITY_MPS2 = 9.80665', STANDARD_GRAVITY_MPS2, 9.80665);
check('preset Trái Đất', CELESTIAL_GRAVITY_PRESETS.EARTH.g, 9.80665);
check('preset Mặt Trăng', CELESTIAL_GRAVITY_PRESETS.MOON.g, 1.62);
check('preset Sao Hỏa (đã sửa 3.72 → 3.71)', CELESTIAL_GRAVITY_PRESETS.MARS.g, 3.71);

// Kho môi trường: mặc định → đổi Moon → reset.
resetEnvironmentVariables();
check('store: g mặc định', getGravityMps2(), 9.80665);
check('handMath: g live mặc định', getLiveGravityMps2(), 9.80665);
let notified = 0;
const unsub = subscribeEnvironment(() => {
  notified++;
});
updateEnvironmentVariable('gravityMps2', 1.62);
check('store: đổi preset Moon → g = 1.62', getGravityMps2(), 1.62);
check('store: subscribe được gọi khi đổi g', notified >= 1, true);
check('store: getEnvironmentVariables().gravityMps2 = 1.62', getEnvironmentVariables().gravityMps2, 1.62);
// DYN đang treo 66,25 g trên Mặt Trăng phải hiện ≈ 0,11 N.
const forceMoonN = Number(((66.25 / 1000) * getGravityMps2()).toFixed(2));
check('DYN 66,25 g trên Mặt Trăng ≈ 0,11 N', forceMoonN, 0.11);
const forceEarthN = Number(((66.25 / 1000) * STANDARD_GRAVITY_MPS2).toFixed(2));
check('DYN 66,25 g trên Trái Đất = 0,65 N', forceEarthN, 0.65);
updateEnvironmentVariable('gravityMps2', 3.71);
check('store: đổi preset Mars → g = 3.71', getGravityMps2(), 3.71);
check('DYN 66,25 g trên Sao Hỏa ≈ 0,25 N', Number(((66.25 / 1000) * getGravityMps2()).toFixed(2)), 0.25);
unsub();
resetEnvironmentVariables();
check('store: reset về Trái Đất', getGravityMps2(), 9.80665);

// WF-08 vẫn pass với cùng cặp cân bằng (g triệt tiêu hai phía).
const levBalanced = inst(LEV, { leftMassG: 100, leftHoleIndex: 4, rightMassG: 50, rightHoleIndex: 8, incidentAngleDeg: 0 });
check('WF-08 b.3 vẫn pass (100g lỗ 4 vs 50g lỗ 8)', guard('WF-08', 3, [levBalanced]).isPassed, true);
check('WF-08 b.1 vẫn pass (có LEV)', guard('WF-08', 1, [levBalanced]).isPassed, true);
check('WF-08 b.2 vẫn pass (không tải, θ=0)', guard('WF-08', 2, [inst(LEV, { incidentAngleDeg: 0 })]).isPassed, true);
const levUnbalanced = inst(LEV, { leftMassG: 100, leftHoleIndex: 5, rightMassG: 50, rightHoleIndex: 9, incidentAngleDeg: 0 });
check('WF-08 b.3 vẫn fail khi lệch 10%', guard('WF-08', 3, [levUnbalanced]).isPassed, false);

// Grep: chỉ 1 định nghĩa hằng g, còn lại là chú thích/văn bản.
const grepOut = execSync('grep -rn "9\\.80665\\|9\\.81\\|0\\.00980665" src/ --include="*.ts" --include="*.tsx"', {
  cwd: ROOT,
  encoding: 'utf8',
});
const grepLines = grepOut.trim().split('\n').filter(Boolean);
let defCount = 0;
const badLines: string[] = [];
for (const line of grepLines) {
  const firstColon = line.indexOf(':');
  const secondColon = line.indexOf(':', firstColon + 1);
  const text = line.slice(secondColon + 1);
  if (/export const STANDARD_GRAVITY_MPS2 = 9\.80665/.test(text)) {
    defCount++;
    continue;
  }
  const idx = text.search(/9\.80665|9\.81|0\.00980665/);
  const before = text.slice(0, idx);
  const inComment = before.includes('//') || before.trimStart().startsWith('*');
  const inString = (before.match(/['"`]/g) || []).length % 2 === 1;
  if (inComment || inString) continue;
  badLines.push(line);
}
check('grep: chỉ 1 định nghĩa hằng g', defCount, 1);
check('grep: không còn literal g trong code tính toán', badLines.length, 0, badLines.join(' | '));

// ================= (A) Mạng chỉ dẫn thí điểm WF-08 =================
console.log('--- (A) Mạng chỉ dẫn thí điểm WF-08 ---');
check('LabEventLog: WORKFLOW_STEP_FAIL', LAB_EVENT_WORKFLOW_STEP_FAIL, 'WORKFLOW_STEP_FAIL');
check('LabEventLog: WORKFLOW_STEP_PASS', LAB_EVENT_WORKFLOW_STEP_PASS, 'WORKFLOW_STEP_PASS');
check('LabEventLog: GUIDE_HINT_SHOWN', LAB_EVENT_GUIDE_HINT_SHOWN, 'GUIDE_HINT_SHOWN');

const engine = experimentWorkflowEngine;
engine.stopWorkflow();
check('engine: chưa start thì không có workflow', engine.getActiveWorkflow(), null);
engine.startWorkflow('WF-08');
check('engine: start WF-08', engine.getActiveWorkflow()?.workflowId, 'WF-08');

// Bước 1: chưa có LEV → fail; có LEV → pass, rồi tự tiến bước sau dwell.
check('WF-08 b.1 fail khi bàn trống', engine.evaluateCurrentStep([]).isPassed, false);
const levStep1 = [inst(LEV, { incidentAngleDeg: 0 })];
check('WF-08 b.1 pass khi có LEV', engine.evaluateCurrentStep(levStep1).isPassed, true);
let res = engine.solveContinuousStepVerification(levStep1, 1.0);
check('WF-08 b.1 tự tiến bước sau dwell 1,0 s', res.stepAdvanced, true);
check('engine: đang ở bước 2', engine.getProgressState().stepIndex, 2);

// Bước 2: còn quả cân → fail; không tải θ=0 → pass.
const levLoaded = [inst(LEV, { leftMassG: 50, leftHoleIndex: 4, incidentAngleDeg: 0 })];
check('WF-08 b.2 fail khi còn quả cân', engine.evaluateCurrentStep(levLoaded).isPassed, false);
check('WF-08 b.2 pass khi không tải', engine.evaluateCurrentStep(levStep1).isPassed, true);
res = engine.solveContinuousStepVerification(levStep1, 1.0);
check('WF-08 b.2 tự tiến bước', res.stepAdvanced, true);
check('engine: đang ở bước 3', engine.getProgressState().stepIndex, 3);

// Bước 3: recommendation + pass → hoàn thành.
const rec = engine.getARNeuralRecommendation([levBalanced]);
check('recommendation: có gợi ý bước 3', rec.hasRecommendation, true);
check('recommendation: stepIndex = 3', rec.stepIndex, 3);
check('recommendation: có động từ hành động', rec.actionVerbVi.length > 0, true);
check('recommendation: source là LEV', rec.sourceAssetId, LEV);
check('WF-08 b.3 pass với cặp cân bằng', engine.evaluateCurrentStep([levBalanced]).isPassed, true);
res = engine.solveContinuousStepVerification([levBalanced], 1.0);
check('WF-08 b.3 tự tiến bước → hoàn thành', res.stepAdvanced, true);
check('engine: workflow hoàn thành', engine.getProgressState().isCompleted, true);
engine.stopWorkflow();

// Tracker gợi ý: 3 lần sai → hint; làm đúng → hết hint; 30 s → hint.
const t = createGuidePilotTracker();
check('tracker: mới đầu chưa hint', shouldShowGuideHint(t, 1000), false);
recordGuideEvaluation(t, false, true, 1000);
recordGuideEvaluation(t, false, true, 1500);
check('tracker: 2 lần sai chưa hint', shouldShowGuideHint(t, 2000), false);
recordGuideEvaluation(t, false, true, 2000);
check('tracker: 3 lần sai → hint hiện', shouldShowGuideHint(t, 2500), true);
recordGuideEvaluation(t, true, true, 3000);
check('tracker: làm đúng → hết hint', shouldShowGuideHint(t, 3500), false);
const t2 = createGuidePilotTracker();
recordGuideEvaluation(t2, false, false, 0);
check('tracker: fail 29,999 s chưa hint', shouldShowGuideHint(t2, 29999), false);
check('tracker: fail 30,000 s → hint hiện', shouldShowGuideHint(t2, 30000), true);
check('tracker: tick đồng hồ không đếm số lần sai', t2.consecutiveFails, 0);

// Khóa log: cùng reason chỉ log 1 lần.
check('logKey: fail giống nhau → cùng khóa', guideLogKey(2, false, 'Chưa đặt đòn bẩy'), guideLogKey(2, false, 'Chưa đặt đòn bẩy'));
check(
  'logKey: reason khác → khóa khác',
  guideLogKey(2, false, 'Chưa đặt đòn bẩy') !== guideLogKey(2, false, 'Còn quả cân'),
  true,
);
check('logKey: pass dùng khóa riêng', guideLogKey(2, true, 'x'), '__PASS__:2');

// Nhãn ≤ 3: chỉ ứng viên khớp archetype bước hiện tại, slice tối đa 3.
check('matcher: LEV khớp lever-balance-apparatus', matchesRequiredArchetype(inst(LEV), 'lever-balance-apparatus'), true);
check('matcher: BAL không khớp lever-balance-apparatus', matchesRequiredArchetype(inst(BAL), 'lever-balance-apparatus'), false);
const fakeCandidates = [
  { targetInstance: inst(LEV) },
  { targetInstance: inst(BAL) },
  { targetInstance: inst('OL3D-EQP-BKR-0001') },
  { targetInstance: inst('OL3D-EQP-SLB-0001') },
  { targetInstance: inst('OL3D-EQP-LSR-0001') },
];
const stepReqs = ['lever-balance-apparatus'];
const shown = fakeCandidates
  .filter((c) => stepReqs.some((req) => matchesRequiredArchetype(c.targetInstance, req)))
  .slice(0, 3);
check('lọc ứng viên theo archetype bước: chỉ LEV', shown.length, 1);
check('nhãn hiển thị ≤ 3', shown.length <= 3, true);

console.log(`\n================================================================`);
console.log(`🏁 VÒNG 5 TESTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`================================================================`);
process.exit(failed > 0 ? 1 : 0);
