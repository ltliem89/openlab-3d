/**
 * OPENLAB 3D — CONTINUOUS PHYSICS CORE VERIFICATION SUITE
 * 
 * Kịch bản kiểm định số học toàn diện 4 trụ cột lõi vật lý liên tục:
 * 1. ContinuousIntegratorRK4: Bảo toàn năng lượng dao động điều hòa dE/E < 10^-6
 * 2. MultiPhysicsCouplingBus: Liên thông 3 miền (Điện-Nhiệt-Thủy, Faraday-Lenz, Dây tóc phi tuyến)
 * 3. ChronoCausalRingBuffer: Đệm vòng 3600 frames, tua mượt và phân nhánh đối thực Pearl
 * 4. IsoGUMMetrologyEngine: Welford chống triệt tiêu số, Loadcell tau=0.8s, thị sai Meniscus
 */

import {
  ContinuousIntegratorRK4,
  DerivativeFunction,
  EnergyEvaluator,
  EnergyProjectionFunction,
  MultiPhysicsCouplingBus,
  ChronoCausalRingBuffer,
  IsoGUMMetrologyEngine,
  WelfordAccumulator,
  TT38_METROLOGY_CATALOG,
} from '../src/core-physics';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ THẤT BẠI: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

console.log('=================================================================');
console.log(' [OPENLAB 3D] KIỂM ĐỊNH TOÁN LÝ & 4 MODULES VẬT LÝ HỢP NHẤT 120 HZ');
console.log('=================================================================\n');

// -------------------------------------------------------------
// 1. KIỂM ĐỊNH ContinuousIntegratorRK4
// -------------------------------------------------------------
console.log('--- [1] KIỂM ĐỊNH BỘ TÍCH PHÂN RK4 (120 Hz, dE/E < 10^-6) ---');
{
  // Hệ dao động điều hòa bảo toàn: m = 1 kg, k = 144 N/m (omega = 12 rad/s)
  // E = 0.5 * m * v^2 + 0.5 * k * x^2
  // x(0) = 0.1 m, v(0) = 0 m/s -> E0 = 0.5 * 144 * 0.01 = 0.72 J
  const m = 1.0;
  const k = 144.0;
  const dt = 1.0 / 120.0;
  const steps = 360; // 3 giây mô phỏng = 360 bước ở 120 Hz

  const integrator = new ContinuousIntegratorRK4({
    dimension: 2,
    fixedDt: dt,
    energyTolerance: 1.0e-6,
  });

  const state = new Float64Array([0.1, 0.0]); // [x, v]

  const harmonicDerivatives: DerivativeFunction = (_t, y, dydt) => {
    dydt[0] = y[1];           // dx/dt = v
    dydt[1] = -(k / m) * y[0]; // dv/dt = -(k/m) * x
  };

  const evalEnergy: EnergyEvaluator = (_t, y) => {
    const x = y[0];
    const v = y[1];
    return 0.5 * m * v * v + 0.5 * k * x * x;
  };

  const projectEnergy: EnergyProjectionFunction = (_t, y, targetE) => {
    // Chiếu đa tạp năng lượng: Giữ x, co giãn v để bảo toàn chính xác E
    const pot = 0.5 * k * y[0] * y[0];
    const kinTarget = Math.max(0.0, targetE - pot);
    const vMagTarget = Math.sqrt((2.0 * kinTarget) / m);
    y[1] = y[1] >= 0 ? vMagTarget : -vMagTarget;
  };

  const initialE = evalEnergy(0, state);
  integrator.setInitialEnergy(initialE);

  let maxDrift = 0.0;
  let t = 0.0;

  for (let i = 0; i < steps; i++) {
    const res = integrator.stepWithEnergyMonitor(
      t,
      state,
      harmonicDerivatives,
      evalEnergy,
      projectEnergy,
      dt
    );
    t = res.t;
    state.set(res.nextY);

    if (res.relativeEnergyDrift !== undefined && res.relativeEnergyDrift > maxDrift) {
      maxDrift = res.relativeEnergyDrift;
    }
  }

  const finalE = evalEnergy(t, state);
  const finalDrift = Math.abs(finalE - initialE) / initialE;

  console.log(`  Năng lượng ban đầu E0 = ${initialE.toFixed(6)} J`);
  console.log(`  Năng lượng sau 3s (360 bước) E = ${finalE.toFixed(6)} J`);
  console.log(`  Độ trôi cực đại max(dE/E) = ${maxDrift.toExponential(4)}`);
  console.log(`  Độ trôi cuối cùng dE/E = ${finalDrift.toExponential(4)}`);

  assert(finalDrift < 1.0e-6, `Độ trôi năng lượng phải nhỏ hơn 10^-6 (thực tế: ${finalDrift.toExponential(3)})`);
  assert(maxDrift < 1.0e-6, `Độ trôi cực đại trong toàn quá trình phải < 10^-6 (thực tế: ${maxDrift.toExponential(3)})`);
}

// -------------------------------------------------------------
// 2. KIỂM ĐỊNH MultiPhysicsCouplingBus
// -------------------------------------------------------------
console.log('\n--- [2] KIỂM ĐỊNH TRỤC LIÊN THÔNG ĐA MIỀN MultiPhysicsCouplingBus ---');
{
  const bus = new MultiPhysicsCouplingBus();
  bus.setEnvironment(25.0, 101.325, 9.80665);

  // 2.1. Cụm Điện -> Nhiệt -> Thủy
  // Nguồn U = 24 V, Điện trở sấy R = 4 Ohm -> P = 144 W. Nước m = 50g = 0.05 kg
  bus.setElectroThermalFluidControls({
    voltageV: 24.0,
    circuitClosed: true,
    heaterResistanceOhms: 4.0,
    initialLiquidMassKg: 0.05,
    beakerRadiusM: 0.03,
  });

  const snap0 = bus.getSnapshot();
  console.log(`  [Điện->Nhiệt->Thủy] Ban đầu: T = ${snap0.electroThermalFluid.temperatureC.toFixed(2)}°C, P = ${snap0.electroThermalFluid.heaterPowerWatts.toFixed(1)} W, m = ${(snap0.electroThermalFluid.liquidMassKg * 1000).toFixed(1)} g`);
  assert(Math.abs(snap0.electroThermalFluid.heaterPowerWatts - 144.0) < 0.1, 'Công suất sấy P = U^2/R = 144 W');

  // Chạy 600 bước (5.0 giây ở 120 Hz)
  for (let s = 0; s < 600; s++) {
    bus.step(1.0 / 120.0);
  }

  const snap1 = bus.getSnapshot();
  console.log(`  [Điện->Nhiệt->Thủy] Sau 5 giây: T = ${snap1.electroThermalFluid.temperatureC.toFixed(2)}°C, Q_net = ${snap1.electroThermalFluid.heatExchangeRateW.toFixed(1)} W`);
  assert(snap1.electroThermalFluid.temperatureC > snap0.electroThermalFluid.temperatureC, 'Nhiệt độ chất lỏng phải tăng lên do nhiệt Joule');

  // Đẩy nhiệt độ lên điểm sôi 100°C và kiểm tra bốc hơi
  bus.setElectroThermalFluidControls({
    voltageV: 48.0,
    initialTempC: 99.5,
  });
  // Chạy thêm 3600 bước (30s)
  for (let s = 0; s < 3600; s++) {
    bus.step(1.0 / 120.0);
  }
  const snapBoil = bus.getSnapshot();
  console.log(`  [Điện->Nhiệt->Thủy] Điểm sôi: T = ${snapBoil.electroThermalFluid.temperatureC.toFixed(2)}°C, Đang sôi: ${snapBoil.electroThermalFluid.isBoiling}, Đã bốc hơi: ${(snapBoil.electroThermalFluid.evaporatedMassKg * 1000).toFixed(2)} g`);
  assert(snapBoil.electroThermalFluid.isBoiling === true, 'Nước phải đạt trạng thái sôi');
  assert(snapBoil.electroThermalFluid.evaporatedMassKg > 0.0, 'Khối lượng nước phải bốc hơi theo nhiệt hóa hơi dm/dt = -Q/L');

  // 2.2. Cụm Từ -> Điện -> Cơ (Faraday - Lenz)
  console.log('\n  [Từ->Điện->Cơ] Kiểm định hiện tượng cảm ứng và lực hãm Lenz:');
  bus.setFaradayLenzControls({
    magnetPositionZM: 0.02, // Nam châm đang lao vào miệng ống dây (z = 2 cm)
    magnetVelocityMps: -1.5, // Rơi xuống với vận tốc -1.5 m/s
    coilTurnsN: 600,
    loadResistanceOhms: 2.0,
    magnetMassKg: 0.08,
  });

  const snapLenz0 = bus.getSnapshot();
  console.log(`    Vận tốc v = ${snapLenz0.faradayLenz.magnetVelocityMps.toFixed(2)} m/s`);
  console.log(`    Suất điện động cảm ứng E = ${snapLenz0.faradayLenz.inducedEmfVolts.toExponential(3)} V`);
  console.log(`    Lực hãm Lenz F_Lenz = ${snapLenz0.faradayLenz.lenzBrakingForceNewtons.toExponential(3)} N`);

  // Bước 1 bước để tính phản lực Lenz
  bus.step(1.0 / 120.0);
  const snapLenz1 = bus.getSnapshot();
  assert(snapLenz1.faradayLenz.lenzBrakingForceNewtons > 0.0, 'Lực hãm Lenz phải hướng ngược chiều rơi (dương) để cản trở chuyển động');
  assert(snapLenz1.faradayLenz.inducedCurrentAmperes !== 0.0, 'Phải sinh dòng điện cảm ứng qua cuộn dây');

  // 2.3. Cụm Dây tóc bóng đèn Vonfram phi tuyến & Inrush Current
  console.log('\n  [Dây tóc Vonfram] Kiểm định điện trở phi tuyến R(T) và Dòng xung kích:');
  bus.setFilamentControls({
    voltageV: 12.0,
    circuitClosed: true,
    coldResistanceOhms: 1.0,
    initialTempK: 293.15,
  });

  const rCold = bus.calculateFilamentResistance(293.15);
  const rHot = bus.calculateFilamentResistance(2500.0);
  console.log(`    Điện trở khi nguội R(293K) = ${rCold.toFixed(2)} Ohm`);
  console.log(`    Điện trở khi nóng sáng R(2500K) = ${rHot.toFixed(2)} Ohm (~ gấp 12 lần)`);
  assert(Math.abs(rCold - 1.0) < 0.05, 'Điện trở khi nguội xấp xỉ R0 = 1.0 Ohm');
  assert(rHot > 10.0, 'Điện trở khi sợi đốt phát sáng phải lớn hơn 10 Ohm');

  const snapInrush = bus.getSnapshot();
  console.log(`    Dòng xung kích ban đầu I(0) = ${snapInrush.filament.currentAmperes.toFixed(2)} A (Giai đoạn xung kích: ${snapInrush.filament.isInrushPhase})`);
  assert(snapInrush.filament.isInrushPhase === true, 'Phải nhận diện giai đoạn dòng xung kích inrush current khi tim đèn còn nguội');
}

// -------------------------------------------------------------
// 3. KIỂM ĐỊNH ChronoCausalRingBuffer
// -------------------------------------------------------------
console.log('\n--- [3] KIỂM ĐỊNH BỘ ĐỆM VÒNG ChronoCausalRingBuffer (3600 FRAMES) ---');
{
  const ring = new ChronoCausalRingBuffer(3600);
  assert(ring.capacity === 3600, 'Sức chứa danh định phải bằng 3600 frames');
  assert(ring.count === 0, 'Ban đầu đệm phải rỗng');

  const bus = new MultiPhysicsCouplingBus();

  // Nạp 1200 frames (10 giây ở 120 Hz)
  for (let i = 0; i < 1200; i++) {
    const snap = bus.step(1.0 / 120.0);
    ring.push(snap);
  }

  assert(ring.count === 1200, 'Số lượng frames ghi nhận phải đạt 1200');
  const span = ring.getTimeSpan();
  console.log(`  Khoảng thời gian đệm lưu trữ: [${span?.oldestSec.toFixed(2)}s .. ${span?.latestSec.toFixed(2)}s] (Thời lượng: ${span?.durationSec.toFixed(2)}s)`);

  // Kiểm tra nội suy mượt mà tại t = 5.253s
  const sample = ring.sampleAtTime(5.253);
  assert(sample !== null && sample.found === true, 'Phải tìm thấy và nội suy được trạng thái tại t = 5.253s');
  console.log(`  Nội suy tại t = 5.253s: T_fluid = ${sample?.interpolatedChannels.liquidTempC.toFixed(2)}°C, Magnet_z = ${sample?.interpolatedChannels.magnetZM.toFixed(3)} m`);

  // Kiểm tra tua ngược (Scrub Backward)
  const prevSnap = ring.scrubBackward(2.0);
  assert(prevSnap !== null, 'Phải tua lùi thành công 2.0s');
  assert(ring.isRewinding === true, 'Trạng thái tua ngược phải được kích hoạt');
  console.log(`  Tua lùi 2s: Thời gian hiện tại = ${prevSnap?.simulationTimeSec.toFixed(2)}s`);

  // Kiểm tra phân nhánh đối thực (Counterfactual Pearl Branching)
  const branchSnap = ring.forkBranchAt(4.0);
  assert(branchSnap !== null, 'Phải phân nhánh đối thực thành công tại t = 4.0s');
  assert(ring.count < 1200, 'Số lượng khung hình sau điểm can thiệp phải bị cắt tỉa (pruned)');
  const newSpan = ring.getTimeSpan();
  console.log(`  Sau phân nhánh đối thực: Đệm còn lại ${ring.count} frames, thời gian mới nhất = ${newSpan?.latestSec.toFixed(2)}s`);
  assert(newSpan !== null && Math.abs(newSpan.latestSec - 4.0) < 0.05, 'Thời gian chốt nhánh phải xấp xỉ 4.0s');
}

// -------------------------------------------------------------
// 4. KIỂM ĐỊNH IsoGUMMetrologyEngine
// -------------------------------------------------------------
console.log('\n--- [4] KIỂM ĐỊNH ĐỘNG CƠ ĐO LƯỜNG ISO GUM & THÔNG TƯ 38/2021 ---');
{
  // 4.1. Kiểm định thuật toán Welford chống triệt tiêu số
  // Chuỗi số siêu nhạy: 10.0001, 10.0002, 10.0003, 10.0002, 10.0001
  const readings = [10.0001, 10.0002, 10.0003, 10.0002, 10.0001];
  const welford = new WelfordAccumulator();
  welford.updateBatch(readings);

  console.log(`  [Welford] Mẫu n = ${welford.count}, Mean = ${welford.mean.toFixed(6)}`);
  console.log(`  [Welford] Phương sai s^2 = ${welford.getSampleVariance().toExponential(6)} (Không bị âm hay NaN)`);
  console.log(`  [Welford] Sai số chuẩn uA = ${welford.getStandardError().toExponential(6)}`);
  assert(welford.getSampleVariance() > 0, 'Phương sai Welford phải dương với các giá trị khác biệt vi mô');
  assert(!Number.isNaN(welford.getSampleVariance()), 'Tuyệt đối không bị NaN do triệt tiêu số học');

  // 4.2. Tính toán ngân sách sai số theo cân điện tử Thông tư 38 (0.01g)
  const balanceSpec = TT38_METROLOGY_CATALOG.DIGITAL_BALANCE_200G;
  const massReadings = [25.42, 25.43, 25.42, 25.44, 25.42];
  const gumResult = IsoGUMMetrologyEngine.evaluateMeasurement(massReadings, balanceSpec);

  console.log(`  [GUM TT38] Khối lượng trung bình m = ${gumResult.mean} g`);
  console.log(`  [GUM TT38] Sai số loại A: u_A = ${gumResult.uA.toFixed(4)} g`);
  console.log(`  [GUM TT38] Sai số loại B (ĐCNN): u_B_res = ${gumResult.uB_resolution.toFixed(4)} g`);
  console.log(`  [GUM TT38] Sai số loại B (Dụng cụ): u_B_inst = ${gumResult.uB_instrument.toFixed(4)} g`);
  console.log(`  [GUM TT38] Sai số chuẩn tổng hợp: u_c = ${gumResult.uCombined.toFixed(4)} g`);
  console.log(`  [GUM TT38] Độ không đảm bảo đo mở rộng U_95% = ${gumResult.expandedU95.toFixed(4)} g`);
  console.log(`  [GUM TT38] Công thức LaTeX hiển thị Hologram: ${gumResult.latexResult}`);

  assert(gumResult.expandedU95 >= gumResult.uCombined, 'U95 = 2 * uc phải lớn hơn uc');
  assert(gumResult.latexResult.includes('\\bar{m}'), 'LaTeX phải chứa ký hiệu m an toàn');

  // 4.3. Kiểm định động học giảm chấn Loadcell cân điện tử (tau = 0.8s)
  console.log('\n  [Loadcell Damped Response] Kiểm định đáp ứng quá độ Loadcell:');
  const targetMass = 50.0; // 50g
  const r0 = IsoGUMMetrologyEngine.calculateLoadcellResponse(targetMass, 0.0);
  const r1 = IsoGUMMetrologyEngine.calculateLoadcellResponse(targetMass, 0.4);
  const r2 = IsoGUMMetrologyEngine.calculateLoadcellResponse(targetMass, 0.8);
  const rSettled = IsoGUMMetrologyEngine.calculateLoadcellResponse(targetMass, 7.5);

  console.log(`    Tại t = 0.0s: ${r0.displayString} (Tỉ lệ: ${(r0.settlingRatio * 100).toFixed(1)}%, Ổn định: ${r0.isSettled})`);
  console.log(`    Tại t = 0.4s: ${r1.displayString} (Tỉ lệ: ${(r1.settlingRatio * 100).toFixed(1)}%, Ổn định: ${r1.isSettled})`);
  console.log(`    Tại t = 0.8s: ${r2.displayString} (Tỉ lệ: ${(r2.settlingRatio * 100).toFixed(1)}%, Ổn định: ${r2.isSettled})`);
  console.log(`    Tại t = 7.5s: ${rSettled.displayString} (Tỉ lệ: ${(rSettled.settlingRatio * 100).toFixed(1)}%, Ổn định: ${rSettled.isSettled})`);

  assert(r0.indicatedMassG === 0.0, 'Tại t = 0, số chỉ cân phải bằng 0');
  assert(rSettled.isSettled === true, 'Tại t = 7.5s (> 9 tau), cân phải xác lập ổn định');
  assert(Math.abs(rSettled.indicatedMassG - 50.0) <= 0.01, 'Khối lượng sau khi xác lập phải khớp 50.00 g');

  // 4.4. Kiểm định sai số thị sai góc nhìn Meniscus ống đong
  console.log('\n  [Parallax Error] Kiểm định sai số thị sai Meniscus:');
  const pLevel = IsoGUMMetrologyEngine.calculateParallaxError(13.5, 0.0);
  const pAbove = IsoGUMMetrologyEngine.calculateParallaxError(13.5, 8.0);
  const pBelow = IsoGUMMetrologyEngine.calculateParallaxError(13.5, -8.0);

  console.log(`    Góc 0.0° (Ngang bằng): Sai số thể tích = ${pLevel.deltaVolumeMl.toFixed(3)} mL`);
  console.log(`    Góc +8.0° (Nhìn từ trên): Sai số thể tích = +${pAbove.deltaVolumeMl.toFixed(3)} mL`);
  console.log(`    Góc -8.0° (Nhìn từ dưới): Sai số thể tích = ${pBelow.deltaVolumeMl.toFixed(3)} mL`);

  assert(pLevel.deltaVolumeMl === 0.0, 'Khi mắt ngang bằng đáy Meniscus, sai số thị sai phải triệt tiêu hoàn toàn (0 mL)');
  assert(pAbove.deltaVolumeMl > 0.0, 'Nhìn từ trên xuống làm đọc thừa thể tích (> 0 mL)');
  assert(pBelow.deltaVolumeMl < 0.0, 'Nhìn từ dưới lên làm đọc thiếu thể tích (< 0 mL)');
}

console.log('\n=================================================================');
console.log(' 🎉 TẤT CẢ 4/4 MODULES VẬT LÝ HỢP NHẤT ĐÃ ĐƯỢC KIỂM ĐỊNH XUẤT SẮC!');
console.log('=================================================================');




