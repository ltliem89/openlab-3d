import katex from 'katex';
import { NEURAL_DEVICE_NODES, NEURAL_SYNAPSE_EDGES, EXPERIMENT_MACRO_CLUSTERS } from '../src/domain/neuralNetworkTopology';
import { PHYSICAL_LAW_MAPPINGS } from '../src/domain/neuralConnectionEngine';
import { EPISTEMIC_LAWS_PRESET, SOCRATIC_MISCONCEPTIONS_PRESET } from '../src/domain/cognitiveTopology';
import { DEVICE_CONTROL_PROFILES } from '../src/device-control/DeviceControlProfilesData';
import { EXPERIMENT_WORKFLOWS } from '../src/experiments/ExperimentWorkflows';
import { equipmentRepository } from '../src/repositories/CatalogRepository';
import { MOCK_EXPERIMENTS } from '../src/data/mockCatalog';
import { PHYSICS_FIDELITY_SPECS } from '../src/three-runtime/LabEnvironmentEngine';

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

const totalErrors = missingAssets + nodeFormulaErrors + lawFormulaErrors + epistemicErrors + deviceProfileErrors + wfErrors + mockExpErrors + fidelityErrors + graphErrors;
console.log(`\n========================================`);
console.log(`AUDIT FINISHED. Total issues found: ${totalErrors}`);
if (totalErrors > 0) {
  process.exit(1);
} else {
  console.log('ALL FORMULAS AND ASSETS VERIFIED 100% CLEAN!');
}
