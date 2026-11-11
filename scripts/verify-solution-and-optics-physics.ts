/**
 * OPENLAB 3D — KIỂM ĐỊNH ĐỘNG HỌC DUNG DỊCH HÓA HỌC (DOM-06) & QUANG PHỔ CAUCHY (DOM-05)
 */

import { ChemicalSolutionSolver, OpticsSolver, scientificSolverRegistry } from '../src/scientific-solvers';

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`❌ [FAIL] ${msg}`);
    process.exit(1);
  }
  console.log(`✅ [PASS] ${msg}`);
}

console.log('========================================================================');
console.log('🧪 KIỂM ĐỊNH ĐỘNG HỌC DUNG DỊCH HÓA HỌC (DOM-06) & QUANG PHỔ TÁN SẮC (DOM-05)');
console.log('========================================================================\n');

// ------------------------------------------------------------------------
// 1. KIỂM ĐỊNH HÒA TAN ĐỘ TAN BÃO HÒA & NỒNG ĐỘ C%, CM (NaCl & Đường)
// ------------------------------------------------------------------------
console.log('--- [DOM-06A] Pha chế NaCl & Đường cong Độ tan S(T) ---');
{
  // Pha 20g NaCl vào 80g nước ở 25°C -> tan hết (S ~ 36.19g/100g nước -> max 28.95g)
  const unsaturated = ChemicalSolutionSolver.solve({
    instanceId: 'beaker-1',
    state: { soluteType: 'nacl', waterMassG: 80.0, soluteAddedG: 20.0, temperatureC: 25.0 },
  });
  console.log(`  Pha 20g NaCl + 80g H2O: tan = ${unsaturated.derived.actualDissolvedG.toFixed(2)}g, C% = ${unsaturated.derived.massPercentageCPercent.toFixed(2)}%, rho = ${unsaturated.derived.solutionDensityGPerMl.toFixed(4)} g/mL`);
  assert(Math.abs(unsaturated.derived.massPercentageCPercent - 20.0) < 0.01, 'Nồng độ phần trăm phải bằng 20/(80+20) = 20.00%');
  assert(unsaturated.derived.precipitateG === 0 && !unsaturated.derived.isSaturated, 'Dung dịch 20g/80g chưa bão hòa, không có kết tủa');
  assert(unsaturated.derived.solutionDensityGPerMl > 1.1, 'Nước muối 20% có khối lượng riêng lớn hơn 1.1 g/mL');

  // Pha quá bão hòa: 50g NaCl vào 100g nước ở 20°C (S = 36.0g/100g) -> dư 14.0g kết tủa
  const saturated = ChemicalSolutionSolver.solve({
    instanceId: 'beaker-2',
    state: { soluteType: 'nacl', waterMassG: 100.0, soluteAddedG: 50.0, temperatureC: 20.0 },
  });
  console.log(`  Pha 50g NaCl + 100g H2O (20°C): tan tối đa = ${saturated.derived.actualDissolvedG.toFixed(2)}g, kết tủa = ${saturated.derived.precipitateG.toFixed(2)}g`);
  assert(saturated.derived.isSaturated && Math.abs(saturated.derived.precipitateG - 14.0) < 0.05, 'Dung dịch phải đạt bão hòa và kết tủa đúng 14.0 g muối dư');
}

// ------------------------------------------------------------------------
// 2. KIỂM ĐỊNH CÂN BẰNG ION & THANG ĐO pH SORENSEN
// ------------------------------------------------------------------------
console.log('\n--- [DOM-06B] Cân bằng Acid - Base & Thang đo pH ---');
{
  const resHcl = scientificSolverRegistry.solve('solution-ph', {
    instanceId: 'ph-1',
    state: { sampleKind: 'hcl', concentrationM: 0.01, soluteAddedG: 0 },
  });
  const resNaoh = scientificSolverRegistry.solve('solution-ph', {
    instanceId: 'ph-2',
    state: { sampleKind: 'naoh', concentrationM: 0.01, soluteAddedG: 0 },
  });
  const resVinegar = scientificSolverRegistry.solve('solution-ph', {
    instanceId: 'ph-3',
    state: { sampleKind: 'ch3cooh', concentrationM: 0.1, soluteAddedG: 0 },
  });

  console.log(`  HCl 0.01M: pH = ${resHcl.derived.measuredPH.toFixed(2)}, Quỳ: ${resHcl.derived.litmusPaperColorVi}, Chỉ thị: ${resHcl.derived.universalIndicatorHex}`);
  console.log(`  NaOH 0.01M: pH = ${resNaoh.derived.measuredPH.toFixed(2)}, Quỳ: ${resNaoh.derived.litmusPaperColorVi}, Chỉ thị: ${resNaoh.derived.universalIndicatorHex}`);
  console.log(`  CH3COOH 0.1M (Axit yếu Ka=1.75e-5): pH = ${resVinegar.derived.measuredPH.toFixed(2)}`);

  assert(Math.abs(resHcl.derived.measuredPH - 2.0) < 0.01 && resHcl.derived.litmusPaperColorVi === 'red', 'HCl 0.01M phải có pH = 2.00 và hóa đỏ quỳ tím');
  assert(Math.abs(resNaoh.derived.measuredPH - 12.0) < 0.01 && resNaoh.derived.litmusPaperColorVi === 'blue', 'NaOH 0.01M phải có pH = 12.00 và hóa xanh quỳ tím');
  assert(resVinegar.derived.measuredPH > 2.8 && resVinegar.derived.measuredPH < 3.0, 'Giấm ăn CH3COOH 0.1M tính theo Ka phải cho pH ~ 2.88');
}

// ------------------------------------------------------------------------
// 3. KIỂM ĐỊNH QUANG PHỔ TÁN SẮC CAUCHY & GAUSSIAN PSF
// ------------------------------------------------------------------------
console.log('\n--- [DOM-05] Tán sắc Cauchy đa bước sóng & Hàm trải điểm Gauss PSF ---');
{
  const optWhite = OpticsSolver.solve({
    instanceId: 'prism-1',
    state: {
      isLampLit: true,
      incidentAngleDeg: 40.0,
      isWhiteLight: true,
      focalLengthCm: 10.0,
      objectDistanceDCm: 20.0,
      screenDistanceCm: 20.0,
    },
  });
  const optBlurred = OpticsSolver.solve({
    instanceId: 'lens-1',
    state: {
      isLampLit: true,
      incidentAngleDeg: 40.0,
      focalLengthCm: 10.0,
      objectDistanceDCm: 20.0,
      screenDistanceCm: 23.0, // Lệch tiêu điểm 3 cm
    },
  });

  const bands = optWhite.derived.spectralComponents ?? [];
  const red = bands.find((b) => b.wavelengthNm === 656.3);
  const violet = bands.find((b) => b.wavelengthNm === 404.7);

  console.log(`  Đỏ (656.3nm): n = ${red?.refractiveIndex}, góc lệch = ${red?.deviationAngleDeg}°`);
  console.log(`  Tím (404.7nm): n = ${violet?.refractiveIndex}, góc lệch = ${violet?.deviationAngleDeg}°`);
  console.log(`  Độ nét Gauss PSF tại d'=20cm: ${optWhite.derived.sharpnessRatio.toFixed(3)}, khi lệch 3cm: ${optBlurred.derived.sharpnessRatio.toFixed(3)}`);

  assert(bands.length === 5 && Boolean(red) && Boolean(violet), 'Phải xuất đầy đủ dải quang phổ Cauchy 5 dải sóng');
  assert((violet!.refractiveIndex > red!.refractiveIndex) && (violet!.deviationAngleDeg > red!.deviationAngleDeg), 'Tia tím phải có chiết suất lớn hơn và bị lệch nhiều hơn tia đỏ');
  assert(optWhite.derived.sharpnessRatio > 0.99 && optBlurred.derived.sharpnessRatio < 0.05, 'Độ sắc nét Gauss PSF phải đạt cực đại 1.0 tại đúng ảnh và nhòe dần khi dịch màn');
}

console.log('\n========================================================================');
console.log('🏆 HOÀN TẤT KIỂM ĐỊNH ĐỘNG HỌC DUNG DỊCH (DOM-06) & QUANG PHỔ (DOM-05)!');
console.log('========================================================================');
