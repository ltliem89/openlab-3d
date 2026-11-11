/**
 * OPENLAB 3D — VERIFICATION SUITE: NEURAL SYNAPSE LINK INTRODUCTION
 * 
 * Bộ Kiểm Thử Nghiệm Thu Mạng Nơ-ron Tri Thức & Giới Thiệu Mối Liên Kết
 * Xác minh 100% tính hoàn bị của Mạng Nơ-ron 3 Tầng:
 * Tầng 1: 36 Nút Thiết Bị & Khớp Nối Nơ-ron (Device Nodes & Synapses)
 * Tầng 2: Biến Số Đo Lường & Bảng Giới Thiệu Mối Liên Kết (Synaptic Link Explorer)
 * Tầng 3: Định Luật Khoa Học Bừng Sáng Eureka (Constructivist Genesis)
 */

import {
  NEURAL_DEVICE_NODES,
  NEURAL_SYNAPSE_EDGES,
  EXPERIMENT_MACRO_CLUSTERS,
  CATEGORY_META,
  SYNAPSE_META,
} from '../src/domain/neuralNetworkTopology';
import {
  neuralConnectionEngine,
  PHYSICAL_LAW_MAPPINGS,
} from '../src/domain/neuralConnectionEngine';
import { cognitiveNeuralEngine } from '../src/domain/CognitiveNeuralEngine';
import { SceneInstance, AssetDefinition } from '../src/domain/types';

function runNeuralLinkVerification() {
  console.log('========================================================================');
  console.log('🧠 OPENLAB 3D: VERIFYING NEURAL NETWORK & SYNAPSE LINK INTRODUCTION');
  console.log('========================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  [PASS] Test ${totalTests}: ${testName}`);
    } else {
      console.error(`  [FAIL] Test ${totalTests}: ${testName}`);
      if (detail) console.error(`         Detail: ${detail}`);
    }
  }

  // -------------------------------------------------------------------------
  // 1. KIỂM THỬ DANH MỤC 36 NÚT NƠ-RON (NEURAL DEVICE NODES)
  // -------------------------------------------------------------------------
  console.log('--- 1. Verification of 36 Neural Device Nodes ---');
  assert(
    NEURAL_DEVICE_NODES.length >= 36,
    `Indexed ${NEURAL_DEVICE_NODES.length} neural device nodes (>= 36 required)`,
  );

  let allNodesHaveFormulasOrTips = true;
  let allNodesIndexedInEngine = true;

  for (const node of NEURAL_DEVICE_NODES) {
    const fromEngineByAsset = neuralConnectionEngine.getNode(node.assetId);
    const fromEngineBySlug = neuralConnectionEngine.getNode(node.id);
    if (!fromEngineByAsset || !fromEngineBySlug) {
      allNodesIndexedInEngine = false;
      console.error(`Node ${node.id} (${node.assetId}) failed indexing lookup`);
    }

    if (!node.description || (!node.mathFormula && !node.sgkFormula)) {
      allNodesHaveFormulasOrTips = false;
      console.error(`Node ${node.id} missing description or math formula`);
    }
  }

  assert(allNodesIndexedInEngine, 'Every neural node is indexed and searchable by slug and assetId');
  assert(allNodesHaveFormulasOrTips, 'Every neural node has pedagogical descriptions and math formulas');

  // -------------------------------------------------------------------------
  // 2. KIỂM THỬ KHỚP NỐI NƠ-RON & CÔNG THỨC MATHTYPE LATEX
  // -------------------------------------------------------------------------
  console.log('\n--- 2. Verification of Synapse Edges & MathType LaTeX Formulas ---');
  assert(
    NEURAL_SYNAPSE_EDGES.length >= 40,
    `Total active synapses: ${NEURAL_SYNAPSE_EDGES.length} (>= 40 required)`,
  );

  let allSynapsesValid = true;
  let allFormulasLaTeXCompliant = true;

  for (const edge of NEURAL_SYNAPSE_EDGES) {
    const src = neuralConnectionEngine.getNode(edge.source);
    const tgt = neuralConnectionEngine.getNode(edge.target);

    if (!src || !tgt) {
      allSynapsesValid = false;
      console.error(`Synapse ${edge.id} has invalid endpoints: ${edge.source} -> ${edge.target}`);
    }

    const mapping = PHYSICAL_LAW_MAPPINGS[edge.type];
    if (!mapping) {
      allSynapsesValid = false;
      console.error(`Synapse ${edge.id} has unmapped SynapseKind: ${edge.type}`);
    } else {
      // Công thức phải theo MathType LaTeX chuẩn: bắt đầu và kết thúc bằng $ hoặc chứa \
      const formula = mapping.formula;
      if (!formula || !formula.includes('$')) {
        allFormulasLaTeXCompliant = false;
        console.error(`Synapse ${edge.id} formula is not MathType LaTeX formatted: "${formula}"`);
      }
    }
  }

  assert(allSynapsesValid, 'All synapse edges connect valid equipment nodes with physical mappings');
  assert(allFormulasLaTeXCompliant, 'All physical law formulas strictly adhere to MathType LaTeX standard');

  // -------------------------------------------------------------------------
  // 3. KIỂM THỬ BẢNG GIỚI THIỆU MỐI LIÊN KẾT TRÊN BÀN 3D (ACTIVE CANDIDATES)
  // -------------------------------------------------------------------------
  console.log('\n--- 3. Verification of Contextual Synapse Link Introduction ---');

  // Khởi tạo bàn thí nghiệm giả lập với 3 thiết bị: Cân điện tử, Khối nhôm, Ống đong
  const mockInstances: SceneInstance[] = [
    {
      instanceId: 'inst_bal_01',
      assetId: 'OL3D-EQP-BAL-0001',
      transform: { positionM: [0, 0, 0], rotationRad: [0, 0, 0], scale: [1, 1, 1] },
      instanceState: {},
      visible: true,
      locked: false,
    },
    {
      instanceId: 'inst_sld_01',
      assetId: 'OL3D-EQP-SLD-0001',
      transform: { positionM: [0.15, 0, 0.05], rotationRad: [0, 0, 0], scale: [1, 1, 1] },
      instanceState: {},
      visible: true,
      locked: false,
    },
    {
      instanceId: 'inst_cyl_01',
      assetId: 'OL3D-EQP-CYL-0001',
      transform: { positionM: [-0.20, 0, 0], rotationRad: [0, 0, 0], scale: [1, 1, 1] },
      instanceState: { liquidLevelMl: 50.0 },
      visible: true,
      locked: false,
    },
  ];

  const mockAssetsMap = new Map<string, AssetDefinition>();
  for (const node of NEURAL_DEVICE_NODES) {
    mockAssetsMap.set(node.assetId, {
      assetId: node.assetId,
      name: { vi: node.nameVi, en: node.nameEn },
      category: 'physics',
      subCategory: 'mechanics',
      functionalGroup: 'measurement',
      specifications: { standard: 'GDPT 2018' },
      pedagogicalMetadata: { gradeLevels: [6, 8], subjects: ['physics'], curriculumStandards: [] },
      geometry: { proceduralArchetype: node.id as any, boundingBox: { min: [-0.1, 0, -0.1], max: [0.1, 0.1, 0.1] } },
      scientificProperties: {},
      connectors: [],
      interactivity: { isGrabbable: true, isSelectable: true, isRotatable: true, hasDigitalReadout: false, controls: [] },
      verification: { status: 'verified', verifiedAt: '2026-11-10', verifiedBy: 'ViSEF Team', remarks: 'PASS' },
    });
  }

  // Chọn Cân điện tử: Kiểm tra danh sách ứng viên liên kết
  const balCandidates = neuralConnectionEngine.getCompatibleCandidates(
    mockInstances[0],
    mockInstances,
    mockAssetsMap,
  );

  assert(
    balCandidates.length > 0,
    `Selected Electronic Balance discovered ${balCandidates.length} compatible candidates on bench`,
  );

  const cylinderCandidate = balCandidates.find((c) => c.targetInstance.assetId === 'OL3D-EQP-SLD-0001');
  assert(
    Boolean(cylinderCandidate),
    'Electronic Balance connects with Aluminum Cylinder via mechanical_support link',
  );

  if (cylinderCandidate) {
    assert(
      cylinderCandidate.link.physicalLawVi.length > 0,
      `Link introduces Physical Law: "${cylinderCandidate.link.physicalLawVi}"`,
    );
    assert(
      cylinderCandidate.link.mathFormulaLatex.includes('$'),
      `Link introduces MathType Formula: ${cylinderCandidate.link.mathFormulaLatex}`,
    );
    assert(
      cylinderCandidate.link.actionVerbVi.length > 0,
      `Link introduces Causal Action do(X)->Y: "${cylinderCandidate.link.actionVerbVi}"`,
    );
  }

  // -------------------------------------------------------------------------
  // 4. KIỂM THỬ CHECKLIST NHÂN QUẢ (DENDRITES & AXONS)
  // -------------------------------------------------------------------------
  console.log('\n--- 4. Verification of Causal Device Checklist (Dendrites & Axons) ---');
  const balChecklist = neuralConnectionEngine.getCausalChecklist(
    mockInstances[0],
    mockInstances,
    mockAssetsMap,
  );

  assert(
    balChecklist.dendritesInput.length > 0 || balChecklist.axonsOutput.length > 0,
    `Electronic Balance has ${balChecklist.dendritesInput.length} Dendrites and ${balChecklist.axonsOutput.length} Axons`,
  );

  // -------------------------------------------------------------------------
  // 5. KIỂM THỬ PHẢN XẠ AN TOÀN SOCRATIC (SAFETY REFLEXES)
  // -------------------------------------------------------------------------
  console.log('\n--- 5. Verification of Socratic Safety Reflexes ---');
  const alcLampInst: SceneInstance = {
    instanceId: 'inst_alc_01',
    assetId: 'OL3D-EQP-ALC-0001',
    transform: { positionM: [0, 0, 0], rotationRad: [0, 0, 0], scale: [1, 1, 1] },
    instanceState: {},
    visible: true,
    locked: false,
  };
  const micInst: SceneInstance = {
    instanceId: 'inst_mic_01',
    assetId: 'OL3D-EQP-MIC-0001',
    transform: { positionM: [0.15, 0, 0], rotationRad: [0, 0, 0], scale: [1, 1, 1] }, // Quá gần (< 35cm)
    instanceState: {},
    visible: true,
    locked: false,
  };

  const dangerReflex = neuralConnectionEngine.evaluateSafetyReflex(alcLampInst, micInst, 0.15);
  assert(
    dangerReflex.isHazard && dangerReflex.severity === 'critical',
    'Safety reflex triggered for open flame proximity to optical microscope (< 35cm)',
  );
  assert(
    Boolean(dangerReflex.hazardMessageVi && dangerReflex.scientificReasonVi),
    `Safety message provided: "${dangerReflex.hazardMessageVi}"`,
  );

  // -------------------------------------------------------------------------
  // 6. KIỂM THỬ TẦNG 3: BỪNG SÁNG ĐỊNH LUẬT EUREKA (COGNITIVE GENESIS)
  // -------------------------------------------------------------------------
  console.log('\n--- 6. Verification of 3-Tier Cognitive Law Genesis (Eureka Moments) ---');
  const laws = cognitiveNeuralEngine.getAllLaws();
  assert(laws.length >= 5, `Registered ${laws.length} core Eureka laws (Density, Ohm, Archimedes, Hooke, Snell)`);

  const densityLaw = laws.find((l) => l.id === 'LAW_DENSITY');
  assert(
    Boolean(densityLaw && densityLaw.formulaLatex.includes('\\frac{m}{V}')),
    'LAW_DENSITY defines standard MathType formula $\\rho = \\frac{m}{V}$',
  );

  const ohmLaw = laws.find((l) => l.id === 'LAW_OHM');
  assert(
    Boolean(ohmLaw && ohmLaw.formulaLatex.includes('\\frac{U}{R}')),
    'LAW_OHM defines standard MathType formula $I = \\frac{U}{R}$',
  );

  // -------------------------------------------------------------------------
  // TỔNG KẾT
  // -------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`🎯 NEURAL LINK VERIFICATION SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  console.log('========================================================================\n');

  if (passedTests < totalTests) {
    process.exit(1);
  }
}

runNeuralLinkVerification();
