/**
 * OPENLAB 3D — FULL SYSTEM INTEGRATION & CAUSAL VERIFICATION SUITE
 * Verifies all 5 specialized agent domains:
 * A1: Equipment Geometry & Part Controls
 * A2: Scientific Solvers & Metrology (Circuit, Optics, Fluid-Thermal, Induction, Mechanics, GUM)
 * A3: Assembly Graph & Experiment Workflows (WF-01 .. WF-06)
 * A4: UI Inspector & Real-Time Output Synchronization
 * A5: Lab Environment & Coupling Isolation
 */

import {
  CircuitSolver,
  OpticsSolver,
  FluidThermalSolver,
  ElectromagneticInductionSolver,
  MechanicsSolver,
  MetrologyEngine,
  scientificSolverRegistry,
} from '../src/scientific-solvers';
import { experimentWorkflowEngine } from '../src/experiments';
import { deviceControlEngine } from '../src/device-control/DeviceControlEngine';
import { SceneInstance } from '../src/domain/types';

interface TestItem {
  code: string;
  category: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

const testResults: TestItem[] = [];

function check(
  code: string,
  category: string,
  name: string,
  passed: boolean,
  expected: string,
  actual: string,
  details?: string
) {
  testResults.push({ code, category, name, passed, expected, actual, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${code}] [${category}] ${name}: ${passed ? 'PASS' : 'FAIL'}`);
  if (!passed) {
    console.error(`   Expected: ${expected}`);
    console.error(`   Actual:   ${actual}`);
    if (details) console.error(`   Details:  ${details}`);
  }
}

console.log('========================================================================');
console.log('🧪 BẮT ĐẦU KIỂM THỬ TÍCH HỢP HỆ THỐNG TOÀN DIỆN (INT-01 .. INT-25)');
console.log('========================================================================\n');

// -----------------------------------------------------------------------------
// NHÓM 1: BỘ GIẢI MẠCH ĐIỆN (CIRCUIT SOLVER)
// -----------------------------------------------------------------------------
const cRes1 = CircuitSolver.solve({
  instanceId: 'psu-test-1',
  state: { isPoweredOn: true, voltageSetting: 12.0, isCablesConnected: true, wirePosConnected: true, wireNegConnected: true, multimeterMode: 'DCV' },
  topology: { cableDistanceM: 0.35 },
});
check(
  'INT-01',
  'CircuitSolver',
  'Mạch kín đủ điện 12V -> Đèn sáng, DMM đọc 12.00 V',
  cRes1.derived.isLampLit === true && cRes1.derived.dmmReading === '12.00 V',
  'isLampLit=true, dmm=12.00 V',
  `isLampLit=${cRes1.derived.isLampLit}, dmm=${cRes1.derived.dmmReading}`
);

const cRes2 = CircuitSolver.solve({
  instanceId: 'psu-test-2',
  state: { isPoweredOn: true, voltageSetting: 12.0, isCablesConnected: false, multimeterMode: 'OHM' },
  topology: { cableDistanceM: 0.35 },
});
check(
  'INT-02',
  'CircuitSolver',
  'Mạch hở cắm dây -> Đèn tắt, DMM thang Ohm hiển thị "O.L"',
  cRes2.derived.isLampLit === false && cRes2.derived.dmmReading === 'O.L',
  'isLampLit=false, dmm=O.L',
  `isLampLit=${cRes2.derived.isLampLit}, dmm=${cRes2.derived.dmmReading}`
);

const cRes3 = CircuitSolver.solve({
  instanceId: 'psu-test-3',
  state: { isPoweredOn: true, voltageSetting: 2.0, isCablesConnected: true, wirePosConnected: true, wireNegConnected: true },
  topology: { cableDistanceM: 0.35 },
});
check(
  'INT-03',
  'CircuitSolver',
  'Điện áp dưới 2.5V (2.0V) -> Chưa đủ ngưỡng phát quang tim vonfram, đèn tắt',
  cRes3.derived.isLampLit === false,
  'isLampLit=false',
  `isLampLit=${cRes3.derived.isLampLit}`
);

// -----------------------------------------------------------------------------
// NHÓM 2: BỘ GIẢI QUANG HỌC (OPTICS SOLVER)
// -----------------------------------------------------------------------------
const oRes1 = OpticsSolver.solve({
  instanceId: 'opt-test-1',
  state: { isLampLit: true, incidentAngleDeg: 30.0, refractiveIndex: 1.50 },
});
check(
  'INT-04',
  'OpticsSolver',
  'Định luật Snell: i = 30° qua thủy tinh n = 1.50 -> r xấp xỉ 19.5°',
  Math.abs(oRes1.derived.refractionAngleDeg - 19.47) <= 0.1,
  'r ≈ 19.47°',
  `r = ${oRes1.derived.refractionAngleDeg}°`
);

const oRes2 = OpticsSolver.solve({
  instanceId: 'opt-test-2',
  state: { isLampLit: false, incidentAngleDeg: 30.0 },
});
check(
  'INT-05',
  'OpticsSolver',
  'Nguồn sáng tắt -> Chùm tia triệt tiêu hoàn toàn (rayCount = 0)',
  oRes2.derived.rayCount === 0 && oRes2.derived.isRayPathVisible === false,
  'rayCount=0, visible=false',
  `rayCount=${oRes2.derived.rayCount}, visible=${oRes2.derived.isRayPathVisible}`
);

const oRes3 = OpticsSolver.solve({
  instanceId: 'opt-test-3',
  state: { isLampLit: true, focalLengthCm: 10.0, objectDistanceDCm: 20.0, screenDistanceCm: 20.0 },
});
check(
  'INT-06',
  'OpticsSolver',
  'Thấu kính mỏng: d = 20cm, f = 10cm -> d\' = 20cm, phóng đại k = -1.0, ảnh sắc nét',
  oRes3.derived.imageDistanceDPrimeCm === 20.0 && oRes3.derived.linearMagnification === -1.0 && oRes3.derived.isSharpFocus === true,
  'd\'=20cm, k=-1.0, sharp=true',
  `d\'=${oRes3.derived.imageDistanceDPrimeCm}, k=${oRes3.derived.linearMagnification}, sharp=${oRes3.derived.isSharpFocus}`
);

// -----------------------------------------------------------------------------
// NHÓM 3: BỘ GIẢI THỦY TĨNH & NHIỆT HỌC (FLUID & THERMAL SOLVER)
// -----------------------------------------------------------------------------
const fRes1 = FluidThermalSolver.solve({
  instanceId: 'fluid-test-1',
  state: { baseLiquidLevelMl: 100.0, submergedVolumeMl: 25.0, fluidDensityKgM3: 1000.0 },
  environment: { gravityMps2: 9.80665, atmosphericPressureKPa: 101.325 },
});
check(
  'INT-07',
  'FluidThermalSolver',
  'Lực đẩy Archimedes cho vật 25 ml chìm trong nước: F_A = ρ·g·V ≈ 0.245 N',
  Math.abs(fRes1.derived.buoyantForceN - 0.245) <= 0.005,
  'F_A ≈ 0.245 N',
  `F_A = ${fRes1.derived.buoyantForceN.toFixed(3)} N`
);

const fRes2 = FluidThermalSolver.solve({
  instanceId: 'thermal-test-1',
  state: { isFlameLit: true },
  environment: { airTemperatureC: 25.0 },
  topology: { distanceToHeatSourceM: 0.05 },
});
check(
  'INT-08',
  'FluidThermalSolver',
  'Bát sứ đặt trên ngọn lửa đèn cồn (d = 5cm <= 10cm) -> Nhận nhiệt, T = 78.5°C',
  fRes2.derived.isHeatingActive === true && fRes2.derived.temperatureC === 78.5,
  'isHeating=true, T=78.5°C',
  `isHeating=${fRes2.derived.isHeatingActive}, T=${fRes2.derived.temperatureC}°C`
);

const fRes3 = FluidThermalSolver.solve({
  instanceId: 'thermal-test-2',
  state: { isFlameLit: true },
  environment: { airTemperatureC: 25.0 },
  topology: { distanceToHeatSourceM: 0.50 },
});
check(
  'INT-09',
  'FluidThermalSolver',
  'Đèn cồn kéo xa bát sứ (d = 50cm > 10cm) -> Không truyền nhiệt, T giữ mức phòng 25.0°C',
  fRes3.derived.isHeatingActive === false && fRes3.derived.temperatureC === 25.0,
  'isHeating=false, T=25.0°C',
  `isHeating=${fRes3.derived.isHeatingActive}, T=${fRes3.derived.temperatureC}°C`
);

// -----------------------------------------------------------------------------
// NHÓM 4: BỘ GIẢI CẢM ỨNG ĐIỆN TỪ (INDUCTION SOLVER)
// -----------------------------------------------------------------------------
const iRes1 = ElectromagneticInductionSolver.solve({
  instanceId: 'ind-test-1',
  state: { magnetVelocityMps: 0.0 },
});
check(
  'INT-10',
  'InductionSolver',
  'Nam châm đứng yên (v = 0) -> Cả 2 LED đều tắt (emissive = 0.0)',
  iRes1.derived.isLedRedOn === false && iRes1.derived.isLedGreenOn === false,
  'both LEDs off',
  `Red=${iRes1.derived.isLedRedOn}, Green=${iRes1.derived.isLedGreenOn}`
);

const iRes2 = ElectromagneticInductionSolver.solve({
  instanceId: 'ind-test-2',
  state: { magnetVelocityMps: 0.5 },
});
check(
  'INT-11',
  'InductionSolver',
  'Nam châm tiến lại gần (v > 0) -> LED Đỏ sáng (1.4), LED Xanh tắt',
  iRes2.derived.isLedRedOn === true && iRes2.derived.isLedGreenOn === false,
  'Red ON, Green OFF',
  `Red=${iRes2.derived.isLedRedOn}, Green=${iRes2.derived.isLedGreenOn}`
);

const iRes3 = ElectromagneticInductionSolver.solve({
  instanceId: 'ind-test-3',
  state: { magnetVelocityMps: -0.5 },
});
check(
  'INT-12',
  'InductionSolver',
  'Nam châm rút ra xa (v < 0) -> Đổi chiều dòng điện, LED Đỏ tắt, LED Xanh sáng',
  iRes3.derived.isLedRedOn === false && iRes3.derived.isLedGreenOn === true,
  'Red OFF, Green ON',
  `Red=${iRes3.derived.isLedRedOn}, Green=${iRes3.derived.isLedGreenOn}`
);

// -----------------------------------------------------------------------------
// NHÓM 5: BỘ GIẢI CƠ HỌC & ĐO LƯỜNG (MECHANICS & METROLOGY SOLVER)
// -----------------------------------------------------------------------------
const mRes1 = MechanicsSolver.solve({
  instanceId: 'mech-test-1',
  state: { measuredMassG: 66.25, tareOffsetG: 66.25 },
});
check(
  'INT-13',
  'MechanicsSolver',
  'Cân điện tử trừ bì: m_gross = 66.25g, m_tare = 66.25g -> m_net = 0.00g',
  mRes1.derived.massNetG === 0.0,
  'm_net = 0.00 g',
  `m_net = ${mRes1.derived.massNetG} g`
);

const mRes2 = MechanicsSolver.solve({
  instanceId: 'mech-test-2',
  state: { springExtensionN: 2.5 },
});
check(
  'INT-14',
  'MechanicsSolver',
  'Lực kế lò xo theo định luật Hooke (k = 50 N/m): F = 2.5 N -> Lò xo dãn đúng 50.0 mm',
  mRes2.derived.springExtensionMm === 50.0,
  'Δl = 50.0 mm',
  `Δl = ${mRes2.derived.springExtensionMm} mm`
);

const mRes3 = MechanicsSolver.solve({
  instanceId: 'mech-test-3',
  state: { massLeftG: 50.0, armLeftM: 0.10, massRightG: 50.0, armRightM: 0.10 },
});
check(
  'INT-15',
  'MechanicsSolver',
  'Đòn bẩy thăng bằng: M_trái = M_phải -> isLeverBalanced = true',
  mRes3.derived.isLeverBalanced === true,
  'isLeverBalanced=true',
  `isLeverBalanced=${mRes3.derived.isLeverBalanced}`
);

// -----------------------------------------------------------------------------
// NHÓM 6: ĐIỀU PHỐI ĐĂNG KÝ BỘ GIẢI (SCIENTIFIC SOLVER REGISTRY)
// -----------------------------------------------------------------------------
const regRes1 = scientificSolverRegistry.solve('electronic-balance', {
  instanceId: 'bal-reg-1',
  state: { measuredMassG: 120.0, tareOffsetG: 20.0 },
});
check(
  'INT-16',
  'SolverRegistry',
  'Registry dispatch "electronic-balance" -> MechanicsSolver m_net = 100.0g',
  regRes1.derived.massNetG === 100.0 && regRes1.provenance.solverId === MechanicsSolver.SOLVER_ID,
  'm_net=100.0, solverId=MECHANICS-SOLVER-V1',
  `m_net=${regRes1.derived.massNetG}, solverId=${regRes1.provenance.solverId}`
);

const regRes2 = scientificSolverRegistry.solve('optical-lamp', {
  instanceId: 'lamp-reg-1',
  state: { isPoweredOn: true, voltageSetting: 12.0, isCablesConnected: true, wirePosConnected: true, wireNegConnected: true },
});
check(
  'INT-17',
  'SolverRegistry',
  'Registry dispatch "optical-lamp" -> CircuitSolver isLampLit = true',
  regRes2.derived.isLampLit === true && regRes2.provenance.solverId === CircuitSolver.SOLVER_ID,
  'isLampLit=true, solverId=CIRCUIT-SOLVER-V1',
  `isLampLit=${regRes2.derived.isLampLit}, solverId=${regRes2.provenance.solverId}`
);

// -----------------------------------------------------------------------------
// NHÓM 7: NGÂN SÁCH ĐỘ KHÔNG ĐẢM BẢO ĐO (METROLOGY & UNCERTAINTY BUDGET)
// -----------------------------------------------------------------------------
const uBudget = MetrologyEngine.calculateUncertaintyBudget({
  leastCount: 0.01,
  instrumentalError: 0.02,
  repeatabilitySigma: 0.01,
  unit: 'g',
});
check(
  'INT-18',
  'MetrologyEngine',
  'Tính độ không đảm bảo đo mở rộng U (k = 2) hợp lệ > 0',
  uBudget.expandedUncertainty > 0 && uBudget.expandedUncertainty <= 0.05,
  '0 < U <= 0.05 g',
  `U = ${uBudget.expandedUncertainty} ${uBudget.unit}`
);

const qVal = MetrologyEngine.quantizeToLeastCount(15.437, 0.05);
check(
  'INT-19',
  'MetrologyEngine',
  'Lượng tử hóa thước cặp ĐCNN 0.05mm: 15.437 mm -> 15.45 mm',
  qVal === 15.45,
  '15.45 mm',
  `${qVal} mm`
);

// -----------------------------------------------------------------------------
// NHÓM 8: QUY TRÌNH THÍ NGHIỆM LIÊN THÔNG (EXPERIMENT WORKFLOWS WF-01 .. WF-06)
// -----------------------------------------------------------------------------
const mockInstancesWF01: SceneInstance[] = [
  {
    instanceId: 'bal-1',
    assetId: 'OL3D-EQP-BAL-0001',
    assetVersion: '1.0',
    parentZone: 'bench-main',
    transform: { positionM: [0, 0.82, 0], rotationRad: [0, 0, 0], displayScale: [1, 1, 1] },
    visible: true,
    locked: false,
    labelVisible: true,
    instanceState: { isPoweredOn: true, measuredMassG: 50.0, tareOffsetG: 50.0 },
  },
  {
    instanceId: 'bkr-1',
    assetId: 'OL3D-EQP-BKR-0001',
    assetVersion: '1.0',
    parentZone: 'bench-main',
    transform: { positionM: [0, 0.82, 0], rotationRad: [0, 0, 0], displayScale: [1, 1, 1] },
    visible: true,
    locked: false,
    labelVisible: true,
    instanceState: { liquidLevelMl: 50.0 },
  },
];

const wfStep1 = experimentWorkflowEngine.validateStep('WF-01', 1, mockInstancesWF01);
check(
  'INT-20',
  'ExperimentWorkflow',
  'WF-01 Bước 1: Cân đã bật nguồn -> PASS',
  wfStep1.isPassed === true,
  'isPassed=true',
  `isPassed=${wfStep1.isPassed} (${wfStep1.reasonVi})`
);

const wfStep2 = experimentWorkflowEngine.validateStep('WF-01', 2, mockInstancesWF01);
check(
  'INT-21',
  'ExperimentWorkflow',
  'WF-01 Bước 2: Đã đặt cốc đong lên đĩa cân -> PASS',
  wfStep2.isPassed === true,
  'isPassed=true',
  `isPassed=${wfStep2.isPassed} (${wfStep2.reasonVi})`
);

const wfStep3 = experimentWorkflowEngine.validateStep('WF-01', 3, mockInstancesWF01);
check(
  'INT-22',
  'ExperimentWorkflow',
  'WF-01 Bước 3: Đã trừ bì TARE về 0 -> PASS',
  wfStep3.isPassed === true,
  'isPassed=true',
  `isPassed=${wfStep3.isPassed} (${wfStep3.reasonVi})`
);

// -----------------------------------------------------------------------------
// NHÓM 9: TÍCH HỢP DEVICE CONTROL ENGINE & MA TRẬN PHỤ THUỘC MÔI TRƯỜNG
// -----------------------------------------------------------------------------
const devOutputs = deviceControlEngine.evaluateOutputs(
  'OL3D-EQP-BAL-0001',
  { measuredMassG: 150.0, tareOffsetG: 50.0 },
  { airTemperatureC: 25.0, gravityMps2: 9.80665 }
);
check(
  'INT-23',
  'DeviceControlEngine',
  'DeviceControlEngine tích hợp Solver: m_net = 100.0g kèm theo provenance',
  devOutputs.netMassG === 100.0 && devOutputs._provenance !== undefined,
  'netMassG=100.0, has provenance',
  `netMassG=${devOutputs.netMassG}, hasProv=${Boolean(devOutputs._provenance)}`
);

// Kiểm tra cách ly môi trường: Biến gravity chỉ tác động lực học, không tác động quang học/điện áp
const cEnvNormal = CircuitSolver.solve({
  instanceId: 'psu-1',
  state: { isPoweredOn: true, voltageSetting: 12.0, isCablesConnected: true, wirePosConnected: true, wireNegConnected: true },
  environment: { gravityMps2: 9.80665 },
});
const cEnvHighGravity = CircuitSolver.solve({
  instanceId: 'psu-1',
  state: { isPoweredOn: true, voltageSetting: 12.0, isCablesConnected: true, wirePosConnected: true, wireNegConnected: true },
  environment: { gravityMps2: 20.0 },
});
check(
  'INT-24',
  'EnvironmentIsolation',
  'Biến trọng lực thay đổi từ 9.8 lên 20 m/s² KHÔNG làm thay đổi điện áp nguồn 12V',
  cEnvNormal.derived.voltageAtLampV === cEnvHighGravity.derived.voltageAtLampV,
  'voltageAtLampV không đổi = 12.0 V',
  `V_normal=${cEnvNormal.derived.voltageAtLampV}, V_highG=${cEnvHighGravity.derived.voltageAtLampV}`
);

// Kiểm tra bảo toàn CIA: User action -> State -> Solver -> Derived Output
const mActionState = { measuredMassG: 300.0, tareOffsetG: 0.0 };
const outBeforeTare = deviceControlEngine.evaluateOutputs('OL3D-EQP-BAL-0001', mActionState);
const mActionStateAfterTare = { ...mActionState, tareOffsetG: 300.0 };
const outAfterTare = deviceControlEngine.evaluateOutputs('OL3D-EQP-BAL-0001', mActionStateAfterTare);
check(
  'INT-25',
  'CausalChain',
  'Luồng nhân quả CIA: Thao tác TARE cập nhật state -> Solver trả m_net từ 300.0g về đúng 0.00g',
  outBeforeTare.netMassG === 300.0 && outAfterTare.netMassG === 0.0,
  'Before=300.0g, After=0.00g',
  `Before=${outBeforeTare.netMassG}g, After=${outAfterTare.netMassG}g`
);

console.log('\n========================================================================');
console.log('📊 TỔNG KẾT KIỂM THỬ TÍCH HỢP HỆ THỐNG TOÀN DIỆN:');
console.log('========================================================================');
const passedCount = testResults.filter((t) => t.passed).length;
const totalCount = testResults.length;
console.log(`Kết quả: ${passedCount} / ${totalCount} kịch bản PASS (${((passedCount / totalCount) * 100).toFixed(1)}%)`);

if (passedCount === totalCount) {
  console.log('🎉 XÁC NHẬN: TẤT CẢ 25/25 KỊCH BẢN TÍCH HỢP HỆ THỐNG ĐẠT CHUẨN PASS TUYỆT ĐỐI!');
} else {
  console.error(`🚨 CÒN ${totalCount - passedCount} KỊCH BẢN THẤT BẠI!`);
  process.exit(1);
}
