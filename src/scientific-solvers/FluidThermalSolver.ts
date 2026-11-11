/**
 * OPENLAB 3D — FLUID & THERMAL SCIENTIFIC SOLVER
 * Formulations:
 * - Hydrostatic Pressure: $p = p_0 + \rho g h$
 * - Communicating Vessels Law: $h_1 = h_2 = h_3$ (equal liquid level at rest)
 * - Archimedes Buoyant Force: $F_A = \rho_{fluid} \cdot g \cdot V_{displaced}$
 * - Thermal Equilibrium: $Q_{thu} = Q_{toa} = m c \Delta T$
 * - Heating & Cooling Dynamics: $\frac{dT}{dt} = \frac{P_{heat} - h A (T - T_{air})}{m c}$
 */

import { SolverInput, SolverResult } from './types';
import { MetrologyEngine } from './MetrologyEngine';

export interface FluidThermalDerivedOutputs {
  liquidLevelMl: number;
  hydrostaticPressurePa: number;
  buoyantForceN: number;
  overflowVolumeMl: number;
  temperatureC: number;
  thermometerTempC?: number; // Quán tính truyền nhiệt nhiệt kế tau = 4.5s (lỏng), 45s (khí)
  isBoiling: boolean;
  isHeatingActive: boolean;
  heatExchangeRateW: number;
  reasonVi: string;
}

export class FluidThermalSolver {
  public static readonly SOLVER_ID = 'FLUID-THERMAL-SOLVER-V1';
  public static readonly VERSION = '1.0.0';

  public static solve(input: SolverInput): SolverResult<FluidThermalDerivedOutputs> {
    const { state, environment, topology } = input;
    const warnings: string[] = [];
    const errors: string[] = [];

    const g = Number(environment?.gravityMps2 ?? 9.80665);
    const p0 = Number(environment?.atmosphericPressureKPa ?? 101.325) * 1000.0; // Pa
    const tAir = Number(environment?.airTemperatureC ?? 25.0);

    // 1. Thủy tĩnh & Bình thông nhau
    const baseLiquidLevelMl = Number(state.baseLiquidLevelMl ?? state.liquidLevelMl ?? 100.0);
    const fluidDensityKgM3 = Number(state.fluidDensityKgM3 ?? 1000.0); // Nước = 1000 kg/m3

    // Chiều cao cột chất lỏng tương đương (giả định tiết diện ống đong S = 10 cm2 = 1e-3 m2)
    const crossSectionAreaM2 = 1.0e-3;
    const heightM = (baseLiquidLevelMl * 1.0e-6) / crossSectionAreaM2;
    const hydrostaticPressurePa = p0 + fluidDensityKgM3 * g * heightM;

    // 2. Lực đẩy Archimedes & Bình tràn
    const submergedVolumeMl = Number(state.submergedVolumeMl ?? 0.0);
    const buoyantForceN = (fluidDensityKgM3 * g * (submergedVolumeMl * 1.0e-6));
    const overflowVolumeMl = state.isOverflowPrimed ? submergedVolumeMl : Math.max(0, submergedVolumeMl - 5.0);

    // 3. Nhiệt học & Gia nhiệt
    const isFlameLit = Boolean(state.isFlameLit ?? state.isHeating ?? false);
    const distanceToHeatSourceM = Number(topology?.distanceToHeatSourceM ?? (isFlameLit ? 0.05 : 0.50));
    const isCoupledToHeatSource = isFlameLit && distanceToHeatSourceM <= 0.10;

    let temperatureC = tAir;
    let isHeatingActive = false;
    let isBoiling = false;
    let heatExchangeRateW = 0.0;

    if (isCoupledToHeatSource) {
      isHeatingActive = true;
      // Nhận nhiệt từ ngọn lửa đèn cồn (Công suất hữu ích ~ 150 W)
      const targetSteadyTempC = 78.5; // Nhiệt độ ổn định thực nghiệm trong bát sứ
      temperatureC = targetSteadyTempC;
      heatExchangeRateW = 150.0;
      if (temperatureC >= 100.0) {
        isBoiling = true;
      }
    } else {
      // Tự làm nguội về nhiệt độ phòng tAir
      temperatureC = tAir;
      heatExchangeRateW = 0.0;
    }

    let reasonVi = '';
    if (isHeatingActive) {
      reasonVi = `Bát sứ đặt trên ngọn lửa đèn cồn (d = ${(distanceToHeatSourceM * 100).toFixed(1)} cm <= 10 cm): Nhận nhiệt lượng, nhiệt độ đạt ${temperatureC.toFixed(1)}°C`;
    } else if (isFlameLit) {
      reasonVi = `Đèn cồn cách xa bát sứ (${(distanceToHeatSourceM * 100).toFixed(1)} cm > 10 cm): Không truyền nhiệt, nhiệt độ giữ ở mức phòng ${tAir.toFixed(1)}°C`;
    } else {
      reasonVi = `Không có nguồn nhiệt: Nhiệt độ môi trường ${tAir.toFixed(1)}°C, áp suất đáy bình ${(hydrostaticPressurePa / 1000).toFixed(2)} kPa`;
    }

    const uncertainty = MetrologyEngine.calculateUncertaintyBudget({
      leastCount: 0.5,
      instrumentalError: 0.5,
      repeatabilitySigma: 0.1,
      unit: '°C',
    });

    return {
      derived: {
        liquidLevelMl: baseLiquidLevelMl,
        hydrostaticPressurePa,
        buoyantForceN,
        overflowVolumeMl,
        temperatureC,
        isBoiling,
        isHeatingActive,
        heatExchangeRateW,
        reasonVi,
      },
      valid: errors.length === 0,
      warnings,
      errors,
      uncertainty,
      provenance: {
        solverId: FluidThermalSolver.SOLVER_ID,
        version: FluidThermalSolver.VERSION,
        lawsApplied: [
          'Định luật áp suất thủy tĩnh',
          'Nguyên lý bình thông nhau',
          'Định luật vạn vật hấp dẫn Archimedes',
          'Phương trình cân bằng nhiệt và truyền nhiệt',
        ],
        referenceFormulasLatex: [
          'p = p_0 + \\rho \\cdot g \\cdot h',
          'F_A = \\rho \\cdot g \\cdot V_{displaced}',
          'Q = m \\cdot c \\cdot \\Delta T',
        ],
        computationTimestamp: Date.now(),
      },
    };
  }

  /**
   * ĐỘNG HỌC LIÊN TỤC THEO BƯỚC THỜI GIAN dt (CONTINUOUS DYNAMICAL SOLVER)
   * - Truyền nhiệt vi phân từ ngọn lửa đèn cồn:
   *   $\frac{dT}{dt} = \frac{P_{in}(d) - h \cdot A \cdot (T - T_{air})}{m \cdot c}$
   * - Hiện tượng sôi khi $T \ge 100^\circ\text{C}$: bốc hơi nước theo nhiệt hóa hơi $L = 2.26 \times 10^6\text{ J/kg}$
   * - Bình thông nhau liên tục: lưu lượng chảy cân bằng mặt thoáng giữa 2 nhánh
   * - Áp suất thủy tĩnh và lực đẩy Archimedes phụ thuộc thời gian
   */
  public static solveContinuous(
    input: SolverInput,
    dtSeconds: number,
  ): SolverResult<FluidThermalDerivedOutputs> {
    const dt = Math.max(0.001, Math.min(1.0, dtSeconds));
    const { state, environment, topology } = input;
    const warnings: string[] = [];
    const errors: string[] = [];

    const g = Number(environment?.gravityMps2 ?? 9.80665);
    const p0 = Number(environment?.atmosphericPressureKPa ?? 101.325) * 1000.0;
    const tAir = Number(environment?.airTemperatureC ?? 25.0);

    // 1. Thủy tĩnh & Động học mức chất lỏng
    let currentLiquidMl = Number(state.liquidLevelMl ?? state.baseLiquidLevelMl ?? 100.0);
    const fluidDensityKgM3 = Number(state.fluidDensityKgM3 ?? 1000.0);

    // Lưu lượng cân bằng bình thông nhau theo định luật Torricelli & Bernoulli vi phân (Hermes Patch P1)
    if (topology?.communicatingConnected && typeof topology?.peerLiquidLevelMl === 'number') {
      const deltaH = (currentLiquidMl - topology.peerLiquidLevelMl) * 0.001; // chênh lệch cột nước (m)
      if (Math.abs(deltaH) > 1e-5) {
        const Cd = 0.62; // Hệ số xả nhớt vòi thủy tinh
        const dOrificeM = 0.006; // Đường kính ống thông 6 mm
        const aOrificeM2 = Math.PI * Math.pow(dOrificeM * 0.5, 2);
        const vTorricelli = Math.sqrt(2.0 * g * Math.abs(deltaH));
        // Lưu lượng m^3/s -> mL/s
        const flowRateMlPerSec = Cd * aOrificeM2 * vTorricelli * 1.0e6 * Math.sign(deltaH);
        // Tránh quá đà dao động (Overshoot Limiter)
        const maxDeltaMl = Math.abs(currentLiquidMl - topology.peerLiquidLevelMl) * 0.5;
        const actualTransferMl = Math.min(maxDeltaMl, Math.abs(flowRateMlPerSec * dt)) * Math.sign(flowRateMlPerSec);
        currentLiquidMl = Math.max(0, currentLiquidMl - actualTransferMl);
      }
    }

    const crossSectionAreaM2 = 1.0e-3;
    const heightM = (currentLiquidMl * 1.0e-6) / crossSectionAreaM2;
    const hydrostaticPressurePa = p0 + fluidDensityKgM3 * g * heightM;

    // 2. Lực đẩy Archimedes
    const submergedVolumeMl = Number(state.submergedVolumeMl ?? 0.0);
    const buoyantForceN = fluidDensityKgM3 * g * (submergedVolumeMl * 1.0e-6);
    const overflowVolumeMl = state.isOverflowPrimed ? submergedVolumeMl : Math.max(0, submergedVolumeMl - 5.0);

    // 3. Động học truyền nhiệt ngọn lửa đèn cồn liên tục
    const isFlameLit = Boolean(state.isFlameLit ?? state.isHeating ?? false);
    const distanceToHeatSourceM = Number(topology?.distanceToHeatSourceM ?? (isFlameLit ? 0.05 : 0.50));
    const isCoupledToHeatSource = isFlameLit && distanceToHeatSourceM <= 0.10;

    const currentTempC = Number(state.temperatureC ?? tAir);
    let newTempC = currentTempC;
    let isHeatingActive = false;
    let isBoiling = false;
    let heatExchangeRateW = 0.0;

    // Nhiệt dung toàn phần của hệ (nước + vỏ thủy tinh/bát sứ)
    // C_total = m_water * c_water + m_dish * c_dish
    const mWaterKg = currentLiquidMl * 1.0e-3;
    const cWater = 4184; // J/(kg*K)
    const mDishKg = 0.080; // 80g sứ
    const cDish = 840; // J/(kg*K)
    const totalThermalCapacityJK = Math.max(30.0, mWaterKg * cWater + mDishKg * cDish);

    if (isCoupledToHeatSource) {
      isHeatingActive = true;
      const P_flameMaxW = 250.0; // Công suất ngọn lửa đèn cồn
      const proximityFactor = Math.max(0, 1.0 - distanceToHeatSourceM / 0.10);
      const usefulHeatPowerW = P_flameMaxW * (proximityFactor * proximityFactor);

      // Tổn hao đối lưu & bức xạ ra không khí phòng: P_loss = h * A * (T - T_air)
      const hA = 1.65; // W/K
      const heatLossW = hA * Math.max(0, currentTempC - tAir);
      const netPowerW = usefulHeatPowerW - heatLossW;
      heatExchangeRateW = netPowerW;

      // dT/dt = P_net / C_total
      const dTdt = netPowerW / totalThermalCapacityJK;
      newTempC = currentTempC + dTdt * dt;

      // Ngưỡng sôi 100°C: Nhiệt hóa hơi L = 2.26e6 J/kg
      if (newTempC >= 100.0) {
        newTempC = 100.0;
        isBoiling = true;
        if (netPowerW > 0 && currentLiquidMl > 0) {
          const LVaporization = 2.26e6;
          const boilLossKgPerSec = netPowerW / LVaporization;
          const boiledVolumeMl = (boilLossKgPerSec * dt) * 1.0e6 / fluidDensityKgM3;
          currentLiquidMl = Math.max(0, currentLiquidMl - boiledVolumeMl);
        }
      }
    } else {
      // Tự làm nguội tự nhiên về tAir
      const hA = 1.25;
      const coolingPowerW = hA * Math.max(0, currentTempC - tAir);
      heatExchangeRateW = -coolingPowerW;
      const dTdt = -coolingPowerW / totalThermalCapacityJK;
      newTempC = Math.max(tAir, currentTempC + dTdt * dt);
    }

    // 4. Quán tính truyền nhiệt của nhiệt kế (Hermes Patch P3)
    // T_therm(t + dt) = T_env + (T_therm(t) - T_env) * exp(-dt / tau)
    const prevThermometerTempC = Number(state.thermometerTempC ?? tAir);
    const isThermometerInLiquid = Boolean(state.isThermometerInLiquid ?? true);
    const tauThermometer = isThermometerInLiquid ? 4.5 : 45.0; // 4.5s trong nước, 45s trong không khí
    const alphaTherm = 1.0 - Math.exp(-dt / tauThermometer);
    const targetFluidTemp = isThermometerInLiquid ? newTempC : tAir;
    const thermometerTempC = Number((prevThermometerTempC + (targetFluidTemp - prevThermometerTempC) * alphaTherm).toFixed(2));

    let reasonVi = '';
    if (isHeatingActive) {
      reasonVi = isBoiling
        ? `Nước đang sôi sùng sục ở 100.0°C! Đang hóa hơi với công suất ${heatExchangeRateW.toFixed(1)} W`
        : `Ngọn lửa đèn cồn gia nhiệt liên tục: T = ${newTempC.toFixed(1)}°C (+${heatExchangeRateW.toFixed(1)} W)`;
    } else if (isFlameLit) {
      reasonVi = `Đèn cồn cách xa bát sứ (${(distanceToHeatSourceM * 100).toFixed(1)} cm > 10 cm): Không truyền nhiệt, làm nguội dần về ${tAir.toFixed(1)}°C`;
    } else {
      reasonVi = `Môi trường cân bằng: T = ${newTempC.toFixed(1)}°C, Áp suất thủy tĩnh = ${(hydrostaticPressurePa / 1000).toFixed(2)} kPa`;
    }

    const uncertainty = MetrologyEngine.calculateUncertaintyBudget({
      leastCount: 0.1,
      instrumentalError: 0.2,
      repeatabilitySigma: 0.05,
      unit: '°C',
    });

    return {
      derived: {
        liquidLevelMl: Number(currentLiquidMl.toFixed(1)),
        hydrostaticPressurePa,
        buoyantForceN,
        overflowVolumeMl,
        temperatureC: Number(newTempC.toFixed(2)),
        thermometerTempC,
        isBoiling,
        isHeatingActive,
        heatExchangeRateW: Number(heatExchangeRateW.toFixed(1)),
        reasonVi,
      },
      valid: errors.length === 0,
      warnings,
      errors,
      uncertainty,
      provenance: {
        solverId: FluidThermalSolver.SOLVER_ID,
        version: '2.0.0-CONTINUOUS',
        lawsApplied: [
          'Phương trình vi phân truyền nhiệt Fourier và làm nguội Newton',
          'Nhiệt hóa hơi nước L = 2.26e6 J/kg',
          'Định luật áp suất thủy tĩnh và bình thông nhau động học',
          'Định luật lực đẩy Archimedes biến thiên thời gian',
        ],
        referenceFormulasLatex: [
          '\\frac{dT}{dt} = \\frac{P_{in} - h \\cdot A \\cdot (T - T_{air})}{m \\cdot c}',
          '\\frac{dm_{evap}}{dt} = \\frac{P_{net}}{L}',
          'p = p_0 + \\rho \\cdot g \\cdot h',
        ],
        computationTimestamp: Date.now(),
      },
    };
  }
}
