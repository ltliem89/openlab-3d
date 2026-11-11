import katex from 'katex';
import { NEURAL_DEVICE_NODES, NEURAL_SYNAPSE_EDGES, EXPERIMENT_MACRO_CLUSTERS } from '../src/domain/neuralNetworkTopology';
import { PHYSICAL_LAW_MAPPINGS } from '../src/domain/neuralConnectionEngine';
import { EPISTEMIC_LAWS_PRESET, SOCRATIC_MISCONCEPTIONS_PRESET } from '../src/domain/cognitiveTopology';
import { DEVICE_CONTROL_PROFILES } from '../src/device-control/DeviceControlProfilesData';
import { EXPERIMENT_WORKFLOWS } from '../src/experiments/ExperimentWorkflows';
import { equipmentRepository } from '../src/repositories/CatalogRepository';
import { MOCK_EXPERIMENTS } from '../src/data/mockCatalog';
import { PHYSICS_FIDELITY_SPECS } from '../src/three-runtime/LabEnvironmentEngine';
import { TT38_METROLOGY_CATALOG } from '../src/core-physics/IsoGUMMetrologyEngine';
import { MechanicsSolver } from '../src/scientific-solvers/MechanicsSolver';
import { OpticsSolver } from '../src/scientific-solvers/OpticsSolver';
import { CircuitSolver } from '../src/scientific-solvers/CircuitSolver';
import { FluidThermalSolver, FLUID_PROPERTIES_DATABASE } from '../src/scientific-solvers/FluidThermalSolver';

function cleanTex(raw: string): string {
  let tex = raw.trim();
  while ((tex.startsWith('$') && tex.endsWith('$')) && tex.length >= 2) {
    if (tex.startsWith('$$') && tex.endsWith('$$') && tex.length >= 4) {
      tex = tex.slice(2, -2).trim();
    } else {
      tex = tex.slice(1, -1).trim();
    }
  }
  return tex;
}

function testKaTeX(label: string, raw: string): boolean {
  const cleaned = cleanTex(raw);
  try {
    katex.renderToString(cleaned, { throwOnError: true, strict: 'ignore' });
    return true;
  } catch (err: any) {
    console.error(`❌ KaTeX Parse Error in [${label}]: "${raw}" -> "${cleaned}"`);
    console.error(`   Message: ${err.message}`);
    return false;
  }
}

console.log('=== 1. CHECKING NEURAL DEVICE NODES vs CATALOG ASSETS ===');
const catalogAssets = new Set(equipmentRepository.list().map((a) => a.assetId));
let missingAssets = 0;
for (const node of NEURAL_DEVICE_NODES) {
  if (!catalogAssets.has(node.assetId)) {
    console.error(`❌ Node ${node.id} has assetId "${node.assetId}" which DOES NOT EXIST in CatalogRepository!`);
    missingAssets++;
  }
}
if (missingAssets === 0) {
  console.log(`✅ All ${NEURAL_DEVICE_NODES.length} Neural Device Nodes have valid assetIds in CatalogRepository.`);
}

console.log('\n=== 2. TESTING ALL NEURAL NODE FORMULAS WITH KATEX ===');
let nodeFormulaErrors = 0;
for (const node of NEURAL_DEVICE_NODES) {
  if (node.mathFormula) {
    if (!testKaTeX(`Node ${node.id} mathFormula`, node.mathFormula)) {
      nodeFormulaErrors++;
    }
  }
}
console.log(`✅ Node mathFormulas checked (${NEURAL_DEVICE_NODES.length} nodes, ${nodeFormulaErrors} errors)`);

console.log('\n=== 3. TESTING PHYSICAL LAW MAPPINGS FORMULAS WITH KATEX ===');
let lawFormulaErrors = 0;
for (const [kind, meta] of Object.entries(PHYSICAL_LAW_MAPPINGS)) {
  if (!testKaTeX(`LawMapping ${kind}`, meta.formula)) {
    lawFormulaErrors++;
  }
}
console.log(`✅ PHYSICAL_LAW_MAPPINGS checked (${Object.keys(PHYSICAL_LAW_MAPPINGS).length} laws, ${lawFormulaErrors} errors)`);

console.log('\n=== 4. TESTING COGNITIVE EPISTEMIC LAWS WITH KATEX ===');
let epistemicErrors = 0;
for (const law of EPISTEMIC_LAWS_PRESET) {
  if (!testKaTeX(`EpistemicLaw ${law.id}`, law.formulaLatex)) {
    epistemicErrors++;
  }
}
console.log(`✅ EPISTEMIC_LAWS_PRESET checked (${EPISTEMIC_LAWS_PRESET.length} laws, ${epistemicErrors} errors)`);

console.log('\n=== 5. TESTING DEVICE CONTROL PROFILES EQUATIONS WITH KATEX ===');
let deviceProfileErrors = 0;
for (const [devId, prof] of Object.entries(DEVICE_CONTROL_PROFILES)) {
  for (const eq of prof.equations) {
    if (!testKaTeX(`Profile ${devId} eq ${eq.id}`, eq.latex)) {
      deviceProfileErrors++;
    }
  }
}
console.log(`✅ DeviceControlProfiles equations checked (${deviceProfileErrors} errors)`);

console.log('\n=== 6. TESTING EXPERIMENT WORKFLOWS FORMULAS WITH KATEX ===');
let wfErrors = 0;
for (const [wfId, wf] of Object.entries(EXPERIMENT_WORKFLOWS)) {
  for (const step of wf.steps) {
    if (step.mathFormulaLatex) {
      if (!testKaTeX(`Workflow ${wfId} step ${step.stepIndex}`, step.mathFormulaLatex)) {
        wfErrors++;
      }
    }
  }
}
console.log(`✅ EXPERIMENT_WORKFLOWS formulas checked (${wfErrors} errors)`);

console.log('\n=== 7. TESTING MOCK EXPERIMENTS FORMULAS & RESULTS WITH KATEX ===');
let mockExpErrors = 0;
for (const exp of MOCK_EXPERIMENTS) {
  for (const f of exp.formulas) {
    if (!testKaTeX(`MockExperiment ${exp.experimentId} formula`, f.expression)) {
      mockExpErrors++;
    }
  }
  for (const r of exp.sampleResults) {
    if (!testKaTeX(`MockExperiment ${exp.experimentId} sampleResult symbol: ${r.symbol}`, r.symbol)) {
      mockExpErrors++;
    }
  }
}
console.log(`✅ MOCK_EXPERIMENTS formulas & sampleResults checked (${mockExpErrors} errors)`);

console.log('\n=== 8. TESTING PHYSICS FIDELITY SPECS WITH KATEX ===');
let fidelityErrors = 0;
for (const spec of PHYSICS_FIDELITY_SPECS) {
  if (!testKaTeX(`FidelitySpec ${spec.level}`, spec.formulaSummary)) {
    fidelityErrors++;
  }
}
console.log(`✅ PHYSICS_FIDELITY_SPECS checked (${PHYSICS_FIDELITY_SPECS.length} specs, ${fidelityErrors} errors)`);

console.log('\n=== 9. TESTING NEURAL GRAPH INTEGRITY & CLUSTER EQUATIONS ===');
let graphErrors = 0;
const seenEdgeIds = new Set<string>();
for (const edge of NEURAL_SYNAPSE_EDGES) {
  if (seenEdgeIds.has(edge.id)) {
    console.error(`❌ Duplicate Synapse Edge ID: ${edge.id}`);
    graphErrors++;
  }
  seenEdgeIds.add(edge.id);
}
for (const node of NEURAL_DEVICE_NODES) {
  const hasEdge = NEURAL_SYNAPSE_EDGES.some((e) => e.source === node.id || e.target === node.id);
  if (!hasEdge) {
    console.error(`❌ Orphan Neural Node (0 edges): ${node.id} (${node.assetId})`);
    graphErrors++;
  }
}
for (const cluster of EXPERIMENT_MACRO_CLUSTERS) {
  if (!testKaTeX(`MacroCluster ${cluster.id}`, cluster.coreEquation)) {
    graphErrors++;
  }
}
console.log(`✅ Graph Integrity & Cluster Equations checked (${NEURAL_DEVICE_NODES.length} nodes, ${NEURAL_SYNAPSE_EDGES.length} edges, ${graphErrors} errors)`);

console.log('\n=== 10. TESTING REAL-WORLD METROLOGY, PHYSICS SOLVERS & CALIBRATIONS ===');
let physicsErrors = 0;

// 10.1. Metrology ĐCNN
if (TT38_METROLOGY_CATALOG.VERNIER_CALIPER_150MM.leastCount !== 0.02) {
  console.error(`❌ Vernier Caliper least count must be 0.02 mm (got ${TT38_METROLOGY_CATALOG.VERNIER_CALIPER_150MM.leastCount})`);
  physicsErrors++;
}
if (TT38_METROLOGY_CATALOG.DIGITAL_BALANCE_200G.leastCount !== 0.01) {
  console.error(`❌ Digital Balance least count must be 0.01 g (got ${TT38_METROLOGY_CATALOG.DIGITAL_BALANCE_200G.leastCount})`);
  physicsErrors++;
}
if (TT38_METROLOGY_CATALOG.GRADUATED_CYLINDER_100ML.leastCount !== 1.0) {
  console.error(`❌ Graduated Cylinder least count must be 1.0 mL (got ${TT38_METROLOGY_CATALOG.GRADUATED_CYLINDER_100ML.leastCount})`);
  physicsErrors++;
}
if (TT38_METROLOGY_CATALOG.LAB_THERMOMETER_110C.leastCount !== 1.0) {
  console.error(`❌ Glass Thermometer least count must be 1.0 °C (got ${TT38_METROLOGY_CATALOG.LAB_THERMOMETER_110C.leastCount})`);
  physicsErrors++;
}

// 10.2. Standard Physics Constants
if (FLUID_PROPERTIES_DATABASE.water.specificHeatJKgK !== 4184.0) {
  console.error(`❌ Water specific heat must be exactly 4184.0 J/(kg*K) (got ${FLUID_PROPERTIES_DATABASE.water.specificHeatJKgK})`);
  physicsErrors++;
}

// 10.3. Unified Aluminum Specimen
const sldAsset = equipmentRepository.getById('OL3D-EQP-SLD-0001');
if (!sldAsset) {
  console.error('❌ Solid aluminum specimen OL3D-EQP-SLD-0001 not found in Catalog!');
  physicsErrors++;
} else {
  const m = sldAsset.scientificProperties.referenceMass?.value ?? 0;
  const v = sldAsset.scientificProperties.referenceVolume?.value ?? 0;
  const rho = sldAsset.scientificProperties.referenceDensity?.value ?? 0;
  if (Math.abs(m - 66.25) > 0.01 || Math.abs(v - 24.54) > 0.01 || Math.abs(rho - 2.70) > 0.01) {
    console.error(`❌ Specimen OL3D-EQP-SLD-0001 must have m=66.25g, V=24.54cm³, rho=2.70g/cm³ (got m=${m}, V=${v}, rho=${rho})`);
    physicsErrors++;
  }
}

// 10.4. Hollow Cylinder Floating / Sinking Physics
const hlwAsset = equipmentRepository.getById('OL3D-EQP-HLW-0001');
if (!hlwAsset) {
  console.error('❌ Hollow cylinder specimen OL3D-EQP-HLW-0001 not found in Catalog!');
  physicsErrors++;
} else {
  const mShell = hlwAsset.scientificProperties.referenceMass?.value ?? 0;
  const vOuter = hlwAsset.scientificProperties.referenceVolume?.value ?? 0;
  const rhoSealed = mShell / Math.max(0.1, vOuter);
  if (rhoSealed >= 1.0) {
    console.error(`❌ Hollow cylinder sealed must float with rho < 1.0 (got ${rhoSealed.toFixed(3)})`);
    physicsErrors++;
  }
}

// 10.5. Optics Solver Total Internal Reflection & Gauss Sharpness
const opticsTirTest = OpticsSolver.solve({
  state: {
    isLampLit: true,
    incidentAngleDeg: 45.0,
    refractiveIndex: 1.50,
    isInsideMedium: true, // From glass (n=1.50) into air (n=1.00029)
  },
});
if (!opticsTirTest.derived.isTotalInternalReflection) {
  console.error('❌ OpticsSolver failed to detect Total Internal Reflection at 45° in glass!');
  physicsErrors++;
}

const opticsLensTest = OpticsSolver.solve({
  state: {
    isLampLit: true,
    objectDistanceDCm: 20.0,
    focalLengthCm: 10.0,
    screenDistanceCm: 20.0,
  },
});
if (opticsLensTest.derived.imageDistanceDPrimeCm !== 20.0 || opticsLensTest.derived.linearMagnification !== -1.0) {
  console.error(`❌ OpticsSolver thin lens must give d'=20.0, k=-1.0 for d=20, f=10 (got d'=${opticsLensTest.derived.imageDistanceDPrimeCm}, k=${opticsLensTest.derived.linearMagnification})`);
  physicsErrors++;
}

// 10.6. Circuit Solver Over-Current Protection & OHM Safety
const circuitOcpTest = CircuitSolver.solve({
  state: {
    isPoweredOn: true,
    lampSwitchOn: true,
    voltageSetting: 12.0,
    lampResistanceOhms: 0.1, // Near short circuit
    isCablesConnected: true,
  },
});
if (!circuitOcpTest.warnings.includes('OVERCURRENT_PROTECTION_TRIPPED')) {
  console.error('❌ CircuitSolver must trip OVERCURRENT_PROTECTION_TRIPPED on near short-circuit!');
  physicsErrors++;
}

const circuitOhmLiveTest = CircuitSolver.solve({
  state: {
    isPoweredOn: true,
    voltageSetting: 12.0,
    multimeterMode: 'OHM',
    isCablesConnected: true,
  },
});
if (circuitOhmLiveTest.derived.dmmReading !== 'ERR.LIVE') {
  console.error(`❌ CircuitSolver must return 'ERR.LIVE' when measuring resistance on live circuit (got '${circuitOhmLiveTest.derived.dmmReading}')`);
  physicsErrors++;
}

// 10.7. Thermal Boiling Experiment Presence
const thermalExp = MOCK_EXPERIMENTS.find(e => e.experimentId === 'OL3D-EXP-THERMAL-BOIL-0001');
if (!thermalExp) {
  console.error('❌ MOCK_EXPERIMENTS missing OL3D-EXP-THERMAL-BOIL-0001!');
  physicsErrors++;
} else {
  const hasHeatFormula = thermalExp.formulas.some(f => f.expression.includes('m \\cdot c'));
  if (!hasHeatFormula) {
    console.error('❌ OL3D-EXP-THERMAL-BOIL-0001 missing Q = m * c * Delta T formula!');
    physicsErrors++;
  }
}

// 10.8. Socratic Misconceptions Count
if (SOCRATIC_MISCONCEPTIONS_PRESET.length !== 6) {
  console.error(`❌ SOCRATIC_MISCONCEPTIONS_PRESET must contain exactly 6 misconceptions (got ${SOCRATIC_MISCONCEPTIONS_PRESET.length})`);
  physicsErrors++;
}

console.log(`✅ Metrology & Physics Solvers checked (${physicsErrors} errors)`);

const totalErrors = missingAssets + nodeFormulaErrors + lawFormulaErrors + epistemicErrors + deviceProfileErrors + wfErrors + mockExpErrors + fidelityErrors + graphErrors + physicsErrors;
console.log(`\n========================================`);
console.log(`AUDIT FINISHED. Total issues found: ${totalErrors}`);
if (totalErrors > 0) {
  process.exit(1);
} else {
  console.log('ALL FORMULAS, PHYSICS SOLVERS AND ASSETS VERIFIED 100% CLEAN!');
}
