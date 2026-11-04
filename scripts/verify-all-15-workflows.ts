/**
 * OPENLAB 3D — VERIFICATION SUITE FOR 15 EXPERIMENT WORKFLOWS & PACKAGING
 */

import { EXPERIMENT_WORKFLOWS, experimentWorkflowEngine } from '../src/experiments';
import { scormXapiPackageEngine } from '../src/packaging/ScormXapiPackageEngine';
import { FluidThermalSolver } from '../src/scientific-solvers/FluidThermalSolver';
import { CircuitSolver } from '../src/scientific-solvers/CircuitSolver';

console.log('================================================================');
console.log('🧪 OPENLAB 3D: VERIFYING ALL 15 EXPERIMENT WORKFLOWS & PACKAGING');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${msg}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failCount++;
  }
}

// 1. Verify 15 Workflows Exist
console.log('--- 1. Testing Workflow Definitions (WF-01 .. WF-15) ---');
const expectedWorkflows = [
  'WF-01', 'WF-02', 'WF-03', 'WF-04', 'WF-05',
  'WF-06', 'WF-07', 'WF-08', 'WF-09', 'WF-10',
  'WF-11', 'WF-12', 'WF-13', 'WF-14', 'WF-15'
];

assert(Object.keys(EXPERIMENT_WORKFLOWS).length === 15, `Found exactly 15 workflows (got ${Object.keys(EXPERIMENT_WORKFLOWS).length})`);

for (const wfId of expectedWorkflows) {
  const wf = EXPERIMENT_WORKFLOWS[wfId];
  assert(!!wf, `Workflow ${wfId} is defined`);
  if (wf) {
    assert(wf.steps.length >= 3, `${wfId}: "${wf.titleVi}" has ${wf.steps.length} pedagogical steps (>= 3)`);
    assert(wf.targetCompetenciesVi.length >= 2, `${wfId} specifies target competencies`);
    assert(wf.steps.every(s => s.mathFormulaLatex.startsWith('$') && s.mathFormulaLatex.endsWith('$')), `${wfId} math formulas formatted in LaTeX`);
  }
}

// 2. Testing ExperimentWorkflowEngine Runtime
console.log('\n--- 2. Testing ExperimentWorkflowEngine Runtime & FSM ---');
const started = experimentWorkflowEngine.startWorkflow('WF-01');
assert(started, 'experimentWorkflowEngine.startWorkflow("WF-01") returns true');

const activeWf = experimentWorkflowEngine.getActiveWorkflow();
assert(activeWf?.workflowId === 'WF-01', 'getActiveWorkflow() returns WF-01');

const curStep = experimentWorkflowEngine.getCurrentStep();
assert(curStep?.stepIndex === 1, 'Current step is 1');

// Mock scene instances for WF-01
const mockInstances: any[] = [
  {
    instanceId: 'inst_bal',
    assetId: 'OL3D-EQP-BAL-0001',
    transform: { positionM: [0, 0, 0] },
    visible: true,
    instanceState: { isPoweredOn: true, measuredMassG: 0.0, tareOffsetG: 0.0 }
  }
];

const evalStep1 = experimentWorkflowEngine.evaluateCurrentStep(mockInstances);
assert(evalStep1.isPassed, `Step 1 evaluation passes: ${evalStep1.reasonVi}`);

const advResult = experimentWorkflowEngine.advanceStep(mockInstances);
assert(advResult.success, `Advance step 1 succeeds -> Step 2`);

const arRec = experimentWorkflowEngine.getARNeuralRecommendation(mockInstances);
assert(arRec.hasRecommendation, `AR Neural recommendation generated for Step ${arRec.stepIndex}: "${arRec.titleVi}"`);
assert(arRec.mathFormulaLatex.length > 0, `AR formula: ${arRec.mathFormulaLatex}`);

// 3. Testing Continuous Dynamical Solvers
console.log('\n--- 3. Testing Continuous Solvers (solveContinuous) ---');
const continuousThermal = FluidThermalSolver.solveContinuous({
  state: {
    containerAssetId: 'beaker-250',
    temperatureC: 25.0,
    liquidLevelMl: 100.0,
    fluidDensityKgM3: 1000.0,
    isFlameLit: true,
  },
  environment: {
    airTemperatureC: 25.0,
    gravityMps2: 9.80665,
    atmosphericPressureKPa: 101.325,
  },
  topology: {
    distanceToHeatSourceM: 0.05,
  },
}, 1.0); // 1 second step

assert(continuousThermal.derived.temperatureC > 25.0, `Thermal continuous step: temp rose from 25.0°C to ${continuousThermal.derived.temperatureC.toFixed(2)}°C`);
assert(continuousThermal.derived.heatExchangeRateW > 0, `Heat exchange rate = ${continuousThermal.derived.heatExchangeRateW.toFixed(1)} W`);

const continuousCircuit = CircuitSolver.solveContinuous({
  state: {
    isPoweredOn: true,
    lampSwitchOn: true,
    voltageSetting: 12.0,
    isCablesConnected: true,
    relativeIllumination: 0.0,
  },
  topology: {
    cableDistanceM: 0.35,
  },
}, 0.05); // 50ms step

assert(continuousCircuit.derived.relativeIllumination > 0.0, `Bulb continuous heating: illumination rose to ${continuousCircuit.derived.relativeIllumination.toFixed(3)}`);
assert(continuousCircuit.derived.isLampLit, `Bulb lit up under continuous voltage`);

// 4. Testing SCORM 2004 & xAPI Packaging Engine
console.log('\n--- 4. Testing SCORM 2004 & xAPI Packaging Engine ---');
const imsXml = scormXapiPackageEngine.generateImsManifestXml(EXPERIMENT_WORKFLOWS['WF-01']);
assert(imsXml.includes('<schemaversion>2004 4th Edition</schemaversion>'), 'IMS manifest contains SCORM 2004 4th Edition schema');
assert(imsXml.includes('OPENLAB3D_WF-01'), 'IMS manifest contains WF-01 identifier');

const xapiStmt = scormXapiPackageEngine.createXApiStatement(
  { name: 'Nguyễn Văn A', mbox: 'mailto:hocsinh@openedulab.vn' },
  EXPERIMENT_WORKFLOWS['WF-01'],
  null,
  100,
  true,
  125
);
assert(xapiStmt.verb.id === 'http://adlnet.gov/expapi/verbs/completed', 'xAPI statement verb is "completed"');
assert(xapiStmt.result?.score?.raw === 100, 'xAPI statement raw score is 100');
assert(xapiStmt.result?.duration === 'PT2M5S', `xAPI duration is properly formatted ISO: ${xapiStmt.result?.duration}`);

console.log('\n================================================================');
console.log(`🏁 VERIFICATION COMPLETE: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
}
