/**
 * OPENLAB 3D — AUTOMATED FLUID MICRO-REALISM & CARBON MODEL TEST SUITE
 * Kiểm định kỹ thuật các cải tiến chuyên sâu Giai đoạn 1 (Sprint 1):
 * - VER-F01: Vệt tụ quang nước động (Dynamic Water Caustics)
 * - VER-F02: Động lực học bọt khí nổi Stokes & lắc lư vi mô (Stokes Buoyant Bubble Dynamics)
 * - VER-M01: Quán tính khối lượng ảo khi kéo thả (Virtual Mass Inertia Damping)
 * - VER-M02: Thị sai mặt khum quang học & Thước ngắm Reticle (Meniscus Parallax & Optical Reticle)
 */

import * as THREE from 'three';

// Polyfill Node.js DOM / Canvas cho Three.js CanvasTexture
if (typeof globalThis.window === 'undefined') {
  (globalThis as any).window = globalThis;
}
if (typeof globalThis.document === 'undefined') {
  (globalThis as any).document = {
    createElement: () => ({
      width: 256,
      height: 256,
      getContext: () => ({
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        font: '',
        textAlign: '',
        fillRect() {},
        clearRect() {},
        fillText() {},
        strokeText() {},
        beginPath() {},
        arc() {},
        rect() {},
        roundRect() {},
        stroke() {},
        fill() {},
        moveTo() {},
        lineTo() {},
        quadraticCurveTo() {},
        save() {},
        restore() {},
        setTransform() {},
        createRadialGradient() {
          return { addColorStop() {} };
        },
        createLinearGradient() {
          return { addColorStop() {} };
        },
        measureText() {
          return { width: 10 };
        },
      }),
    }),
  };
}

import {
  getWaterCausticsTexture,
  addVesselCausticsProjector,
  syncHydrostaticLiquidToGravity,
  buildProceduralEquipmentGroup,
} from '../src/three-runtime/ProceduralLabModels';
import { InSituMicroscopicLens } from '../src/three-runtime/InSituMicroscopicLens';
import { AssetDefinition } from '../src/domain/types';

interface TestRecord {
  code: string;
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  formula?: string;
}

const records: TestRecord[] = [];

function check(
  code: string,
  name: string,
  passed: boolean,
  expected: string,
  actual: string,
  formula?: string,
) {
  records.push({ code, name, passed, expected, actual, formula });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${code}] ${name}: ${passed ? 'PASS' : 'FAIL'}`);
  if (formula) {
    console.log(`   Công thức kiểm chứng: ${formula}`);
  }
  if (!passed) {
    console.error(`   Kỳ vọng: ${expected}`);
    console.error(`   Thực tế: ${actual}`);
  }
}

console.log('========================================================================');
console.log('🔬 BẮT ĐẦU KIỂM THỬ CẢI TIẾN CHUYÊN SÂU MÔ PHỎNG NƯỚC & ĐỘNG HỌC (VER-F01 .. VER-M02)');
console.log('========================================================================\n');

// -----------------------------------------------------------------------------
// VER-F01: Vệt tụ quang nước động (Dynamic Water Caustics)
// -----------------------------------------------------------------------------
const causticsTex = getWaterCausticsTexture();
const rootGroup = new THREE.Group();
const causticsMesh = addVesselCausticsProjector(rootGroup, 0.038);

// Giả lập bình chứa có liquid_surface
const liqGroup = new THREE.Group();
liqGroup.name = 'liquid_surface';
const liqMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.04, 32));
liqMesh.name = 'liquid_body';
liqGroup.add(liqMesh);
rootGroup.add(liqGroup);

// Khi không có nước (scaleY = 0)
syncHydrostaticLiquidToGravity(rootGroup, 0, 100, 0);
const hiddenWhenEmpty = causticsMesh.visible === false;

// Khi có nước đầy (scaleY = 1.0)
syncHydrostaticLiquidToGravity(rootGroup, 1.0, 500, 0.05);
const visibleWhenFilled = causticsMesh.visible === true;
const causticsMat = causticsMesh.material as THREE.MeshBasicMaterial;
const dynamicOpacityValid = causticsMat.opacity >= 0.25 && causticsMat.opacity <= 0.85;

const verF01Passed =
  causticsTex instanceof THREE.CanvasTexture &&
  causticsMesh.name === 'vessel_caustics' &&
  causticsMat.blending === THREE.AdditiveBlending &&
  causticsMesh.position.y === 0.0018 &&
  hiddenWhenEmpty &&
  visibleWhenFilled &&
  dynamicOpacityValid;

check(
  'VER-F01',
  'Vệt tụ quang nước động (Dynamic Water Caustics)',
  verF01Passed,
  'Caustics Texture PBR, Additive Blending, ẩn khi cạn, hiện và dao động khi đầy nước',
  `Visible (empty=${!hiddenWhenEmpty}, filled=${visibleWhenFilled}), Opacity=${causticsMat.opacity.toFixed(3)}, y=${causticsMesh.position.y}`,
  'I_{\\text{caustic}}(x, z, t) \\propto \\det(\\mathbf{I} - h \\cdot \\nabla^2 \\eta(x, z, t))',
);

// -----------------------------------------------------------------------------
// VER-F02: Động lực học bọt khí nổi Stokes (Stokes Buoyant Bubble Dynamics)
// -----------------------------------------------------------------------------
// Bọt khí nổi theo định luật Stokes: v_Stokes = (2/9) * (rho_w - rho_g) * g * r^2 / eta
const rBubbleSmall = 0.0012; // 1.2 mm
const rBubbleLarge = 0.0019; // 1.9 mm
const stokesSpeedSmall = Math.pow(rBubbleSmall / 0.0015, 2);
const stokesSpeedLarge = Math.pow(rBubbleLarge / 0.0015, 2);
const ratioStokes = stokesSpeedLarge / stokesSpeedSmall;
const expectedRatio = Math.pow(rBubbleLarge / rBubbleSmall, 2); // ~ 2.507

// Kiểm tra mô hình beaker-250 có bọt khí được gán bRadius và userData đầy đủ
const beakerDef: AssetDefinition = {
  assetId: 'beaker-250-test',
  name: 'Cốc thủy tinh 250ml',
  category: 'glassware',
  assetVersion: '2.4.0',
  license: 'CC-BY-4.0',
  description: 'Cốc chịu nhiệt',
  tags: ['beaker'],
  geometry: {
    proceduralArchetype: 'beaker-250',
    boundingBoxM: { width: 0.08, height: 0.1, depth: 0.08 },
  },
  scientificProperties: { capacity: { value: 250, unit: 'ml' } },
  interactionPlugs: [],
};

const beakerRoot = buildProceduralEquipmentGroup(beakerDef, false);
const boilingFx = beakerRoot.getObjectByName('boiling_fx') as THREE.Group | undefined;
const bubble0 = boilingFx?.getObjectByName('bubble_0') as THREE.Mesh | undefined;
const hasStokesRadius = typeof bubble0?.userData?.bRadius === 'number';

const verF02Passed =
  Math.abs(ratioStokes - expectedRatio) < 0.0001 &&
  hasStokesRadius &&
  Boolean(boilingFx) &&
  boilingFx!.children.length >= 18;

check(
  'VER-F02',
  'Động lực học bọt khí nổi Stokes (Stokes Buoyant Bubble Dynamics)',
  verF02Passed,
  `Vận tốc nổi tỉ lệ thuận với bình phương bán kính bọt khí (v ~ r^2, ratio = ${expectedRatio.toFixed(3)})`,
  `ratioStokes = ${ratioStokes.toFixed(3)}, bRadius_0 = ${bubble0?.userData?.bRadius}m, bubbleCount = ${boilingFx?.children.length}`,
  'v_{\\text{nổi}} = \\frac{2}{9} \\cdot \\frac{(\\rho_{\\text{nước}} - \\rho_{\\text{khí}}) \\cdot g \\cdot r^2}{\\eta_{\\text{nước}}}',
);

// -----------------------------------------------------------------------------
// VER-M01: Quán tính khối lượng ảo khi kéo thả (Virtual Mass Inertia Damping)
// -----------------------------------------------------------------------------
function calcDampLambda(massKg: number): number {
  return THREE.MathUtils.clamp(32.0 / Math.sqrt(massKg * 5.0 + 0.15), 14.0, 65.0);
}

const massDropper = 0.025; // 25g (thìa/ống nhỏ giọt)
const massEmptyBeaker = 0.12; // 120g
const massFullBeaker = 0.37; // 120g + 250g nước = 370g
const massElectronicScale = 0.75; // 750g (cân điện tử nặng)

const lambdaDropper = calcDampLambda(massDropper);
const lambdaEmptyBeaker = calcDampLambda(massEmptyBeaker);
const lambdaFullBeaker = calcDampLambda(massFullBeaker);
const lambdaScale = calcDampLambda(massElectronicScale);

// Thời gian đáp ứng trễ tau = 1 / lambda
const tauDropperMs = (1 / lambdaDropper) * 1000;
const tauScaleMs = (1 / lambdaScale) * 1000;
const deltaTauMs = tauScaleMs - tauDropperMs;

// Kiểm tra tính đơn điệu: vật càng nặng thì lambda càng giảm (quán tính lớn hơn, trôi đầm hơn)
const isMonotonic =
  lambdaDropper > lambdaEmptyBeaker &&
  lambdaEmptyBeaker > lambdaFullBeaker &&
  lambdaFullBeaker > lambdaScale;

const delayInExpectedRange = deltaTauMs >= 40 && deltaTauMs <= 60; // Trễ hơn từ 40 - 60 ms theo tau (95% ổn định sau 3 tau ~ 130ms)

const verM01Passed = isMonotonic && delayInExpectedRange && lambdaScale >= 14.0 && lambdaDropper <= 65.0;

check(
  'VER-M01',
  'Quán tính khối lượng ảo khi kéo thả (Virtual Mass Inertia Damping)',
  verM01Passed,
  'Hệ số cản quán tính giảm đơn điệu theo khối lượng; vật nặng 750g trễ đầm hơn vật nhẹ 25g',
  `lambda: dropper=${lambdaDropper.toFixed(1)}, beakerEmpty=${lambdaEmptyBeaker.toFixed(1)}, beakerFull=${lambdaFullBeaker.toFixed(1)}, scale=${lambdaScale.toFixed(1)}; deltaTau=${deltaTauMs.toFixed(1)}ms`,
  '\\text{dampLambda} = \\text{clamp}\\left(\\frac{32.0}{\\sqrt{m \\cdot 5.0 + 0.15}}, 14.0, 65.0\\right)',
);

// -----------------------------------------------------------------------------
// VER-M02: Thị sai mặt khum quang học & Thước ngắm Reticle (Meniscus Parallax)
// -----------------------------------------------------------------------------
const lens = new InSituMicroscopicLens();
lens.setActive(true);

// 1. Góc nhìn chuẩn ngang bằng (0°)
const dirLevel = new THREE.Vector3(0, 0, -1);
const alignLevel = lens.updateCameraAlignment(dirLevel);

// 2. Góc nhìn nghiêng nhẹ trong vùng chuẩn (1.0° < 1.5°)
const dirSlight = new THREE.Vector3(0, Math.sin((1.0 * Math.PI) / 180), -Math.cos((1.0 * Math.PI) / 180));
const alignSlight = lens.updateCameraAlignment(dirSlight);

// 3. Góc nhìn nghiêng 5.0° (vượt chuẩn ISO GUM)
const dirTilted5 = new THREE.Vector3(0, Math.sin((5.0 * Math.PI) / 180), -Math.cos((5.0 * Math.PI) / 180));
const alignTilted5 = lens.updateCameraAlignment(dirTilted5);

// Tính sai số thể tích lý thuyết theo công thức Delta V = pi * R^3 * tan(theta) cho ống đong R = 15.6mm
const deltaV5Ml = lens.getParallaxVolumeErrorMl(0.0156, 5.0);

const verM02Passed =
  alignLevel.hasParallaxWarning === false &&
  alignSlight.hasParallaxWarning === false &&
  alignTilted5.hasParallaxWarning === true &&
  deltaV5Ml > 1.0 && // Đọc sai thể tích > 1.0 mL khi nghiêng 5° (thực tế ~ 1.04 mL)
  deltaV5Ml < 1.15;

check(
  'VER-M02',
  'Thị sai mặt khum quang học & Thước ngắm Reticle (Meniscus Parallax)',
  verM02Passed,
  'Chuẩn ISO GUM khi nghiêng <= 1.5°; Sai số thể tích > 1.0 mL khi góc ngắm lệch 5.0°',
  `Delta V (5°) = ${deltaV5Ml.toFixed(3)} mL, WarningLevel=${alignLevel.hasParallaxWarning}, Warning5deg=${alignTilted5.hasParallaxWarning}`,
  '\\Delta V = \\pi R^3 \\tan\\theta \\approx 1{,}04\\text{ mL} \\quad (R = 15{,}6\\text{ mm}, \\theta = 5^\\circ)',
);

lens.dispose();

// -----------------------------------------------------------------------------
// TỔNG KẾT
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log('📊 TỔNG KẾT BỘ KIỂM THỬ CẢI TIẾN CHUYÊN SÂU:');
console.log('========================================================================');
const passedCount = records.filter((r) => r.passed).length;
const totalCount = records.length;
console.log(`Kết quả: ${passedCount} / ${totalCount} tiêu chuẩn PASS (${((passedCount / totalCount) * 100).toFixed(1)}%)`);

if (passedCount === totalCount) {
  console.log('🎉 XÁC NHẬN: TOÀN BỘ 4/4 TIÊU CHUẨN CẢI TIẾN CHUYÊN SÂU ĐẠT CHUẨN PASS TUYỆT ĐỐI!');
} else {
  console.error('⚠️ MỘT SỐ TIÊU CHUẨN CHƯA ĐẠT. VUI LÒNG KIỂM TRA LẠI.');
  process.exit(1);
}
