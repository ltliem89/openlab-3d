/**
 * Vòng 4 (C-18/C-19) — Kiểm định guard mới WF-10 b.1/b.3, WF-12, WF-13,
 * WF-14 b.2/b.3, WF-15 b.1/b.2 + solver mạch điện + matcher neural-guide
 * + defaultValue "chưa đo" của module PHM/STR/DMM.
 * Chạy: npx tsx scripts/verify-vong4-guards.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXPERIMENT_WORKFLOWS } from '../src/experiments/ExperimentWorkflows';
import { matchesRequiredArchetype } from '../src/experiments/ExperimentWorkflowEngine';
import {
  solveResistiveCircuit,
  solveMultiBranchCircuit,
} from '../src/three-runtime/AssemblySystem';
import { resolveDefaultModuleControls } from '../src/three-runtime/HtmlEquipmentModuleRegistry';
import { MOCK_EQUIPMENT_ASSETS } from '../src/data/mockCatalog';
import type { SceneInstance } from '../src/domain/types';

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

const BAL = 'OL3D-EQP-BAL-0001';
const NAC = 'OL3D-EQP-NAC-0001';
const CYL = 'OL3D-EQP-CYL-0001';
const BKR = 'OL3D-EQP-BKR-0001';
const STR = 'OL3D-EQP-STR-0001';
const PSU = 'OL3D-EQP-PSU-0001';
const RES = 'OL3D-EQP-RES-0001';
const RHE = 'OL3D-EQP-RHE-0001';
const AMP = 'OL3D-EQP-AMP-0001';
const VOL = 'OL3D-EQP-VOL-0001';
const SOC = 'OL3D-EQP-SOC-0001';
const FLK = 'OL3D-EQP-FLK-0001';
const TWG1 = 'OL3D-EQP-TWG-0001';
const TWG2 = 'OL3D-EQP-TWG-0002';
const TUB = 'OL3D-EQP-TUB-0001';
const LIT = 'OL3D-EQP-LIT-0001';
const PHM = 'OL3D-EQP-PHM-0001';

// ---------- Solver mạch điện trở (WF-12) ----------
console.log('--- Solver mạch điện trở ---');
const psuOn = (v = 6) => inst(PSU, { isPoweredOn: true, voltageSetting: v });
const res10 = inst(RES, { resistanceOhms: 10 });
const rhe10 = inst(RHE, { rheostatOhms: 10, rheostatAdjusted: false });
const nodes = [
  { instance: psuOn(6), role: 'psu' as const, resistanceOhms: 0 },
  { instance: res10, role: 'resistor' as const, resistanceOhms: 10 },
  { instance: rhe10, role: 'rheostat' as const, resistanceOhms: 10 },
];
const s1 = solveResistiveCircuit(nodes);
check('mạch kín U=6 R=20', s1.isCircuitClosed, true);
checkClose('I = 6/20 = 0.30 A', s1.currentA, 0.3);
checkClose('U_RES = 3.0 V', s1.voltageAtResistorV, 3.0);
checkClose('U_RHE = 3.0 V', s1.voltageAtRheostatV, 3.0);
checkClose('P = 1.8 W', s1.powerW, 1.8);
const sOff = solveResistiveCircuit([
  { instance: inst(PSU, { isPoweredOn: false, voltageSetting: 6 }), role: 'psu' as const, resistanceOhms: 0 },
  { instance: res10, role: 'resistor' as const, resistanceOhms: 10 },
  { instance: rhe10, role: 'rheostat' as const, resistanceOhms: 10 },
]);
check('PSU tắt -> mạch hở', sOff.isCircuitClosed, false);
checkClose('PSU tắt vẫn đọc được R_total = 20 (đo Ω)', sOff.resistanceTotalOhms, 20);
const sNoRes = solveResistiveCircuit([
  { instance: psuOn(6), role: 'psu' as const, resistanceOhms: 0 },
]);
check('thiếu RES/RHE -> mạch hở', sNoRes.isCircuitClosed, false);

// ---------- Solver mạch 2 bóng (WF-13) ----------
console.log('--- Solver mạch 2 bóng ---');
const socA = inst(SOC, { bulbResistanceOhms: 12 }, [0, 0, 0]);
const socB = inst(SOC, { bulbResistanceOhms: 12 }, [0.2, 0, 0]);
const mSeries = solveMultiBranchCircuit(psuOn(6), [socA, socB], 'series');
check('nối tiếp: mạch kín', mSeries.isCircuitClosed, true);
checkClose('nối tiếp: I = 6/24 = 0.25 A', mSeries.totalCurrentA, 0.25);
checkClose('nối tiếp: U1 = 3.0 V', mSeries.branches[0].voltageV, 3.0);
checkClose('nối tiếp: U2 = 3.0 V', mSeries.branches[1].voltageV, 3.0);
check('nối tiếp: cả 2 sáng', mSeries.branches.every((b) => b.isLit), true);
const mPar = solveMultiBranchCircuit(psuOn(6), [socA, socB], 'parallel');
checkClose('song song: U1 = 6 V', mPar.branches[0].voltageV, 6);
checkClose('song song: U2 = 6 V', mPar.branches[1].voltageV, 6);
checkClose('song song: I_total = 1.0 A', mPar.totalCurrentA, 1.0);
const mOff = solveMultiBranchCircuit(inst(PSU, { isPoweredOn: false, voltageSetting: 6 }), [socA, socB], 'series');
check('PSU tắt -> mạch 2 bóng hở', mOff.isCircuitClosed, false);
const mOne = solveMultiBranchCircuit(psuOn(6), [socA], 'series');
check('chỉ 1 bóng -> mạch hở', mOne.isCircuitClosed, false);

// ---------- WF-10 b.1: cân 10,0 g NaCl ----------
console.log('--- WF-10 b.1: cân 10,0 g NaCl ---');
check('bàn trống -> fail', guard('WF-10', 1, []).isPassed, false);
check('chỉ có cân -> fail', guard('WF-10', 1, [inst(BAL, { measuredMassG: 0, tareOffsetG: 0 })]).isPassed, false);
check('có NAC, chưa TARE -> fail', guard('WF-10', 1, [inst(BAL, { measuredMassG: 60, tareOffsetG: 0 }), inst(NAC, { sampleMassG: 0 })]).isPassed, false);
check('TARE rồi, muối 5,0 g -> fail', guard('WF-10', 1, [inst(BAL, { measuredMassG: 65, tareOffsetG: 60 }), inst(NAC, { sampleMassG: 5 })]).isPassed, false);
check('TARE rồi, muối 10,0 g -> pass', guard('WF-10', 1, [inst(BAL, { measuredMassG: 70, tareOffsetG: 60 }), inst(NAC, { sampleMassG: 10 })]).isPassed, true);
check('TARE rồi, muối 10,2 g (dung sai 0,2) -> pass', guard('WF-10', 1, [inst(BAL, { measuredMassG: 70.2, tareOffsetG: 60 }), inst(NAC, { sampleMassG: 10.2 })]).isPassed, true);
check('TARE rồi, muối 10,5 g -> fail', guard('WF-10', 1, [inst(BAL, { measuredMassG: 70.5, tareOffsetG: 60 }), inst(NAC, { sampleMassG: 10.5 })]).isPassed, false);

// ---------- WF-10 b.3: khuấy ≥ 10 s ----------
console.log('--- WF-10 b.3: khuấy ≥ 10 s ---');
const b1b2ok = [
  inst(BAL, { measuredMassG: 70, tareOffsetG: 60 }),
  inst(CYL, { baseLiquidLevelMl: 90 }),
];
check('b.1 chưa xong -> fail', guard('WF-10', 3, [inst(CYL, { baseLiquidLevelMl: 90 }), inst(STR, { stirTimeS: 15 })]).isPassed, false);
check('b.2 chưa xong -> fail', guard('WF-10', 3, [inst(BAL, { measuredMassG: 70, tareOffsetG: 60 }), inst(CYL, { baseLiquidLevelMl: 50 }), inst(STR, { stirTimeS: 15 })]).isPassed, false);
check('chưa có máy khuấy -> fail', guard('WF-10', 3, [...b1b2ok]).isPassed, false);
check('khuấy 5 s -> fail', guard('WF-10', 3, [...b1b2ok, inst(STR, { stirTimeS: 5 })]).isPassed, false);
check('khuấy 10 s -> pass', guard('WF-10', 3, [...b1b2ok, inst(STR, { stirTimeS: 10 })]).isPassed, true);

// ---------- WF-12 ----------
console.log('--- WF-12 b.1: lắp mạch ---');
check('bàn trống -> fail', guard('WF-12', 1, []).isPassed, false);
check('thiếu ampe kế -> fail', guard('WF-12', 1, [psuOn(6), res10, rhe10]).isPassed, false);
check('PSU tắt -> fail', guard('WF-12', 1, [inst(PSU, { isPoweredOn: false, voltageSetting: 6 }), res10, rhe10, inst(AMP, { multimeterMode: 'DCA' })]).isPassed, false);
check('đủ thiết bị, PSU 6V bật -> pass', guard('WF-12', 1, [psuOn(6), res10, rhe10, inst(AMP, { multimeterMode: 'DCA' })]).isPassed, true);
console.log('--- WF-12 b.2: vôn kế đọc U_RES ---');
const wf12base = [psuOn(6), res10, rhe10];
check('vôn kế sai thang (A) -> fail', guard('WF-12', 2, [...wf12base, inst(VOL, { multimeterMode: 'A', multimeterValue: 3 }, [0.1, 0, 0])]).isPassed, false);
check('vôn kế xa RES (> 0,35 m) -> fail', guard('WF-12', 2, [...wf12base, inst(VOL, { multimeterMode: 'V', multimeterValue: 3 }, [1.0, 0, 0])]).isPassed, false);
check('vôn kế đọc 3,00 V gần RES -> pass', guard('WF-12', 2, [...wf12base, inst(VOL, { multimeterMode: 'V', multimeterValue: 3 }, [0.1, 0, 0])]).isPassed, true);
check('vôn kế đọc 2,50 V (lệch 0,5) -> fail', guard('WF-12', 2, [...wf12base, inst(VOL, { multimeterMode: 'V', multimeterValue: 2.5 }, [0.1, 0, 0])]).isPassed, false);
console.log('--- WF-12 b.3: vặn biến trở + kiểm chứng Ôm ---');
check('chưa vặn biến trở -> fail', guard('WF-12', 3, [psuOn(6), res10, inst(RHE, { rheostatOhms: 10, rheostatAdjusted: false }), inst(AMP, { multimeterMode: 'DCA', multimeterValue: 0.3 })]).isPassed, false);
check('đã vặn, I đo = 0,30 A (U=6, R=20) -> pass', guard('WF-12', 3, [psuOn(6), res10, inst(RHE, { rheostatOhms: 10, rheostatAdjusted: true }), inst(AMP, { multimeterMode: 'DCA', multimeterValue: 0.3 })]).isPassed, true);
check('đã vặn RHE=0, I đo = 0,60 A (U=6, R=10) -> pass', guard('WF-12', 3, [psuOn(6), res10, inst(RHE, { rheostatOhms: 0, rheostatAdjusted: true }), inst(AMP, { multimeterMode: 'DCA', multimeterValue: 0.6 })]).isPassed, true);
check('I đo sai 20% -> fail', guard('WF-12', 3, [psuOn(6), res10, inst(RHE, { rheostatOhms: 10, rheostatAdjusted: true }), inst(AMP, { multimeterMode: 'DCA', multimeterValue: 0.36 })]).isPassed, false);

// ---------- WF-13 ----------
console.log('--- WF-13 b.1: nối tiếp ---');
check('chỉ 1 bóng -> fail', guard('WF-13', 1, [psuOn(6), socA]).isPassed, false);
check('topology song song -> fail', guard('WF-13', 1, [inst(PSU, { isPoweredOn: true, voltageSetting: 6, circuitTopology: 'parallel' }), socA, socB]).isPassed, false);
check('nối tiếp 6V, 2 bóng sáng -> pass', guard('WF-13', 1, [psuOn(6), socA, socB]).isPassed, true);
check('nối tiếp 3V (U nhánh 1,5 V < 2,5 V) -> fail', guard('WF-13', 1, [psuOn(3), socA, socB]).isPassed, false);
console.log('--- WF-13 b.2: vôn kế đọc nhánh ---');
check('vôn kế đọc 3,00 V (nhánh nối tiếp) -> pass', guard('WF-13', 2, [psuOn(6), socA, socB, inst(VOL, { multimeterMode: 'V', multimeterValue: 3 }, [0.1, 0, 0])]).isPassed, true);
check('vôn kế đọc 5,00 V (không khớp nhánh) -> fail', guard('WF-13', 2, [psuOn(6), socA, socB, inst(VOL, { multimeterMode: 'V', multimeterValue: 5 }, [0.1, 0, 0])]).isPassed, false);
console.log('--- WF-13 b.3: song song ---');
check('topology nối tiếp -> fail', guard('WF-13', 3, [psuOn(6), socA, socB]).isPassed, false);
check('song song 6V -> pass', guard('WF-13', 3, [inst(PSU, { isPoweredOn: true, voltageSetting: 6, circuitTopology: 'parallel' }), socA, socB]).isPassed, true);

// ---------- WF-14 b.2/b.3 ----------
console.log('--- WF-14 b.2: cắm cành ---');
const flaskA = inst(FLK, { baseLiquidLevelMl: 105 }, [0, 0, 0]);
const flaskB = inst(FLK, { baseLiquidLevelMl: 105 }, [0.3, 0, 0]);
check('chưa có cành -> fail', guard('WF-14', 2, [flaskA, flaskB]).isPassed, false);
check('cành chưa cắm vào bình -> fail', guard('WF-14', 2, [flaskA, flaskB, inst(TWG1, {}), inst(TWG2, {})]).isPassed, false);
check('2 cành cắm chung 1 bình -> fail', guard('WF-14', 2, [flaskA, flaskB, inst(TWG1, { attachedToInstanceId: flaskA.instanceId, attachmentSlot: 'inside-vessel' }), inst(TWG2, { attachedToInstanceId: flaskA.instanceId, attachmentSlot: 'inside-vessel' })]).isPassed, false);
check('mỗi cành 1 bình -> pass', guard('WF-14', 2, [flaskA, flaskB, inst(TWG1, { attachedToInstanceId: flaskA.instanceId, attachmentSlot: 'inside-vessel' }), inst(TWG2, { attachedToInstanceId: flaskB.instanceId, attachmentSlot: 'inside-vessel' })]).isPassed, true);
console.log('--- WF-14 b.3: độ tụt mực nước ---');
const twiggedA = (nowA: number, initA = 105) =>
  inst(FLK, { baseLiquidLevelMl: nowA, initialLiquidLevelMl: initA }, [0, 0, 0]);
const twiggedB = (nowB: number, initB = 105) =>
  inst(FLK, { baseLiquidLevelMl: nowB, initialLiquidLevelMl: initB }, [0.3, 0, 0]);
const twigs = [
  inst(TWG1, { attachedToInstanceId: twiggedA(93).instanceId, attachmentSlot: 'inside-vessel' }),
  inst(TWG2, { attachedToInstanceId: twiggedB(104.5).instanceId, attachmentSlot: 'inside-vessel' }),
];
check('chưa cắm cành -> fail', guard('WF-14', 3, [twiggedA(93), twiggedB(104.5)]).isPassed, false);
check('chưa ghi mốc ban đầu -> fail', guard('WF-14', 3, [inst(FLK, { baseLiquidLevelMl: 93 }, [0, 0, 0]), twiggedB(104.5), ...twigs]).isPassed, false);
check('A tụt 5 ml (< 10) -> fail', guard('WF-14', 3, [twiggedA(100), twiggedB(104.5), ...twigs]).isPassed, false);
check('A tụt 12 ml, B tụt 0,5 ml -> pass', guard('WF-14', 3, [twiggedA(93), twiggedB(104.5), ...twigs]).isPassed, true);
check('A tụt 12 ml, B tụt 3 ml (chưa gấp 5) -> fail', guard('WF-14', 3, [twiggedA(93), twiggedB(102), ...twigs]).isPassed, false);

// ---------- WF-15 b.1/b.2 ----------
console.log('--- WF-15 b.1: 3 mẫu ---');
check('chỉ 2 ống -> fail', guard('WF-15', 1, [inst(TUB, { samplePh: 2.9 }), inst(TUB, { samplePh: 7.0 })]).isPassed, false);
check('3 ống chưa chọn mẫu -> fail', guard('WF-15', 1, [inst(TUB, {}), inst(TUB, {}), inst(TUB, {})]).isPassed, false);
check('3 ống toàn axit -> fail', guard('WF-15', 1, [inst(TUB, { samplePh: 2.9 }), inst(TUB, { samplePh: 2.9 }), inst(TUB, { samplePh: 2.9 })]).isPassed, false);
check('3 ống 2,90 / 7,00 / 11,50 -> pass', guard('WF-15', 1, [inst(TUB, { samplePh: 2.9 }), inst(TUB, { samplePh: 7.0 }), inst(TUB, { samplePh: 11.5 })]).isPassed, true);
console.log('--- WF-15 b.2: nhúng giấy chỉ thị ---');
const tubeAcid = inst(TUB, { samplePh: 2.9 });
check('chưa có giấy -> fail', guard('WF-15', 2, [tubeAcid]).isPassed, false);
check('giấy chưa nhúng -> fail', guard('WF-15', 2, [tubeAcid, inst(LIT, {})]).isPassed, false);
check('giấy nhúng vào ống chưa chọn mẫu -> fail', guard('WF-15', 2, [inst(TUB, {}), inst(LIT, { attachedToInstanceId: 'test-x', attachmentSlot: 'inside-vessel' })]).isPassed, false);
const litInAcid = inst(LIT, { attachedToInstanceId: tubeAcid.instanceId, attachmentSlot: 'inside-vessel', indicatorColorHex: '#f87171' });
check('giấy nhúng vào ống axit, có màu -> pass', guard('WF-15', 2, [tubeAcid, litInAcid]).isPassed, true);
const litNoColor = inst(LIT, { attachedToInstanceId: tubeAcid.instanceId, attachmentSlot: 'inside-vessel' });
check('giấy nhúng nhưng chưa có màu -> fail', guard('WF-15', 2, [tubeAcid, litNoColor]).isPassed, false);

// ---------- Catalog + module defaults ----------
console.log('--- Catalog 51 asset + defaultValue "chưa đo" ---');
check('catalog có 51 asset', MOCK_EQUIPMENT_ASSETS.length, 51);
for (const id of ['OL3D-EQP-STR-0001', 'OL3D-EQP-NAC-0001', 'OL3D-EQP-AMP-0001', 'OL3D-EQP-VOL-0001', 'OL3D-EQP-RES-0001', 'OL3D-EQP-RHE-0001', 'OL3D-EQP-SOC-0001', 'OL3D-EQP-TWG-0001', 'OL3D-EQP-TWG-0002', 'OL3D-EQP-LIT-0001']) {
  check(`catalog có ${id}`, MOCK_EQUIPMENT_ASSETS.some((a) => a.assetId === id), true);
}
const libRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'libraries3DLab');
const readManifest = (folder: string) =>
  JSON.parse(fs.readFileSync(path.join(libRoot, folder, 'manifest.json'), 'utf8'));
check('PHM ship: defaultValue = 0', readManifest('OL3D-EQP-PHM-0001_may-do-ph-hien-so').moduleControls.defaultValue, 0);
check('STR ship: defaultValue = 0', readManifest('OL3D-EQP-STR-0001_may-khuay-tu-gia-nhiet').moduleControls.defaultValue, 0);
check('DMM ship: defaultValue = 0', readManifest('OL3D-EQP-DMM-0001_digital-multimeter-ac-dc').moduleControls.defaultValue, 0);
check('DMM ship: không còn preset đặt giá trị đo', readManifest('OL3D-EQP-DMM-0001_digital-multimeter-ac-dc').moduleControls.presets.length, 0);
const index = JSON.parse(fs.readFileSync(path.join(libRoot, 'library-index.json'), 'utf8'));
check('library-index có 21 module', index.libraries.length, 21);
check('PHM đặt lên bàn không tự có số đo (guard b.3 vẫn fail)', guard('WF-15', 3, [inst(PHM, { multimeterMode: 'pH', multimeterValue: 0 })]).isPassed, false);

// ---------- resolveDefaultModuleControls ----------
console.log('--- resolveDefaultModuleControls ---');
const nacCtrl = resolveDefaultModuleControls('chemical-sample');
check('NAC: stateKey sampleMassG', nacCtrl.stateKey, 'sampleMassG');
check('NAC: default 0', nacCtrl.defaultValue, 0);
const rheCtrl = resolveDefaultModuleControls('rheostat');
check('RHE: stateKey rheostatOhms', rheCtrl.stateKey, 'rheostatOhms');
check('RHE: default 10', rheCtrl.defaultValue, 10);
const dmmCtrl = resolveDefaultModuleControls('digital-multimeter');
check('DMM case: default 0', dmmCtrl.defaultValue, 0);
check('DMM case: không preset đặt giá trị đo', dmmCtrl.presets.length, 0);

// ---------- Matcher neural-guide ----------
console.log('--- Matcher neural-guide (archetype thật) ---');
const balInst = inst(BAL, {});
check("matcher: 'electronic-balance' khớp BAL-0001", matchesRequiredArchetype(balInst, 'electronic-balance'), true);
check("matcher: 'spring-dynamometer' khớp DYN-0001", matchesRequiredArchetype(inst('OL3D-EQP-DYN-0001', {}), 'spring-dynamometer'), true);
check("matcher: 'resistor-sample' khớp RES-0001", matchesRequiredArchetype(inst(RES, {}), 'resistor-sample'), true);
check("matcher tương thích ngược: 'BAL' vẫn khớp BAL-0001", matchesRequiredArchetype(balInst, 'BAL'), true);
check("matcher: 'spring-dynamometer' KHÔNG khớp BAL-0001", matchesRequiredArchetype(balInst, 'spring-dynamometer'), false);

console.log(`\n================================================================`);
console.log(`🏁 VÒNG 4 GUARD TESTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`================================================================`);
process.exit(failed > 0 ? 1 : 0);
