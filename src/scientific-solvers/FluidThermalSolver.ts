/**
 * OPENLAB 3D — FLUID & THERMAL SCIENTIFIC SOLVER
 * Formulations:
 * - Hydrostatic Pressure: $p = p_0 + \rho g h$
 * - Communicating Vessels Law: $z_1 = z_2 = z_3$ (equal liquid level at rest)
 * - Archimedes Buoyant Force: $F_A = \rho_{fluid} \cdot g \cdot V_{displaced}$
 * - Thermal Equilibrium: $Q_{thu} = Q_{toa} = m c \Delta T$
 * - Heating & Cooling Dynamics: $\frac{dT}{dt} = \frac{P_{heat} - h A (T - T_{air})}{m c}$
 * - Boiling Point Dependence: $T_{boil}(p) = 100.0 \times (p / 101.325)^{0.285}$
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
  boilingPointC: number;
  evaporatedMassG?: number;
  reasonVi: string;
}

export interface FluidPhysicalProperties {
  densityKgM3: number;
  specificHeatJKgK: number;
  latentHeatVaporizationJKg: number;
  normalBoilingPointC: number;
}

export const FLUID_PROPERTIES_DATABASE: Record<string, FluidPhysicalProperties> = {
  water: {
    densityKgM3: 998.2, // ~1000 kg/m3
    specificHeatJKgK: 4184.0,
    latentHeatVaporizationJKg: 2.26e6,
    normalBoilingPointC: 100.0,
  },
  ethanol: {
    densityKgM3: 789.0,
    specificHeatJKgK: 2440.0,
    latentHeatVaporizationJKg: 8.46e5,
    normalBoilingPointC: 78.37,
  },
  saltwater_10pct: {
    densityKgM3: 1070.0,
    specificHeatJKgK: 3810.0,
    latentHeatVaporizationJKg: 2.26e6,
    normalBoilingPointC: 101.5,
  },
};

/**
 * Tiết diện hình học chuẩn của các bình chứa trong phòng thí nghiệm (m2)
 */
export const VESSEL_CROSS_SECTION_AREAS_M2: Record<string, number> = {
  'graduated-cylinder': 6.158e-4, // D_trong = 28 mm -> r = 14 mm
  'beaker-250': 3.632e-3,         // D_trong = 68 mm -> r = 34 mm
  'overflow-can': 2.827e-3,       // D_trong = 60 mm -> r = 30 mm
  'erlenmeyer-flask': 2.376e-3,   // D_trung bình = 55 mm
  'porcelain-dish': 5.027e-3,     // D_miệng = 80 mm -> r = 40 mm
  'communicating-vessels-3way': 1.847e-4, // Ống nhánh D = 15.3 mm
  'test-tube': 2.011e-4,          // D_trong = 16 mm -> r = 8 mm
};

export class FluidThermalSolver {
  public static readonly SOLVER_ID = 'FLUID-THERMAL-SOLVER-V1';
  public static readonly VERSION = '2.1.0';

  /**
   * Tính nhiệt độ sôi phụ thuộc áp suất khí quyển p (kPa) theo hệ thức Antoine / Clausius-Clapeyron
   */
  public static calculateBoilingPoint(fluidType: string = 'water', pressureKPa: number = 101.325): number {
    const p = Math.max(10.0, Math.min(500.0, pressureKPa));
    const fluid = FLUID_PROPERTIES_DATABASE[fluidType] ?? FLUID_PROPERTIES_DATABASE.water;
    // T_boil(p) = T_norm * (p / 101.325)^0.285 (K) chuyển sang °C
    const tNormK = fluid.normalBoilingPointC + 273.15;
    const tBoilK = tNormK * Math.pow(p / 101.325, 0.285);
    return Number((tBoilK - 273.15).toFixed(2));
  }

  /**
   * Lấy tiết diện ngang của bình chứa theo archetype
   */
  public static getVesselCrossSectionArea(archetype?: string): number {
    if (!archetype) return 1.0e-3;
    const key = archetype.toLowerCase();
    for (const [vesselKey, area] of Object.entries(VESSEL_CROSS_SECTION_AREAS_M2)) {
      if (key.includes(vesselKey)) {
        return area;
      }
    }
    return 1.0e-3; // Mặc định 10 cm2
  }

  public static solve(input: SolverInput): SolverResult<FluidThermalDerivedOutputs> {
    const { state, environment, topology, archetype } = input;
    const warnings: string[] = [];
    const errors: string[] = [];

    const g = Number(environment?.gravityMps2 ?? 9.80665);
    const p0KPa = Number(environment?.atmosphericPressureKPa ?? 101.325);
    const p0 = p0KPa * 1000.0; // Pa
    const tAir = Number(environment?.airTemperatureC ?? 25.0);

    const fluidType = (state.fluidType ?? 'water').toLowerCase();
    const fluidProps = FLUID_PROPERTIES_DATABASE[fluidType] ?? FLUID_PROPERTIES_DATABASE.water;
    const fluidDensityKgM3 = Number(state.fluidDensityKgM3 ?? fluidProps.densityKgM3);
    const boilingPointC = FluidThermalSolver.calculateBoilingPoint(fluidType, p0KPa);

    // 1. Thủy tĩnh & Tiết diện bình chứa thực
    const baseLiquidLevelMl = Number(state.baseLiquidLevelMl ?? state.liquidLevelMl ?? 100.0);
    const crossSectionAreaM2 = FluidThermalSolver.getVesselCrossSectionArea(archetype ?? state.archetype);
    const heightM = (baseLiquidLevelMl * 1.0e-6) / crossSectionAreaM2;
    const hydrostaticPressurePa = p0 + fluidDensityKgM3 * g * heightM;

    // 2. Lực đẩy Archimedes & Bình tràn
    const rawSubmergedVolumeMl = Number(state.submergedVolumeMl ?? 0.0);
    const specimenVolumeLimitMl = Number(state.specimenVolumeMl ?? 24.54);
    const submergedVolumeMl = Math.max(0.0, Math.min(rawSubmergedVolumeMl, specimenVolumeLimitMl));
    const buoyantForceN = fluidDensityKgM3 * g * (submergedVolumeMl * 1.0e-6);
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
      // Công suất ngọn lửa đèn cồn hữu ích ~ 150 W
      const usefulPowerW = 150.0 * Math.max(0.2, 1.0 - distanceToHeatSourceM / 0.10);
      heatExchangeRateW = usefulPowerW;
      
      // Nhiệt độ đạt trạng thái dừng khi công suất cấp bằng công suất tản nhiệt Newton:
      // P_net = P_in - hA*(T - T_air) = 0 => T_ss = T_air + P_in / hA
      const hA = 1.85; // W/K
      const theoreticalSteadyTempC = tAir + usefulPowerW / hA;
      temperatureC = Math.min(boilingPointC, theoreticalSteadyTempC);

      if (temperatureC >= boilingPointC - 0.1) {
        temperatureC = boilingPointC;
        isBoiling = true;
      }
    } else {
      // Tự làm nguội về nhiệt độ phòng tAir
      temperatureC = tAir;
      heatExchangeRateW = 0.0;
    }

    let reasonVi = '';
    if (isHeatingActive) {
      reasonVi = isBoiling
        ? `Nước đang sôi sùng sục ở ${boilingPointC.toFixed(1)}°C (p = ${p0KPa.toFixed(1)} kPa): Đang bay hơi mạnh`
        : `Gia nhiệt trên ngọn lửa đèn cồn (d = ${(distanceToHeatSourceM * 100).toFixed(1)} cm <= 10 cm): T = ${temperatureC.toFixed(1)}°C (+${heatExchangeRateW.toFixed(1)} W)`;
    } else if (isFlameLit) {
      reasonVi = `Đèn cồn cách xa bình chứa (${(distanceToHeatSourceM * 100).toFixed(1)} cm > 10 cm): Không truyền nhiệt, nhiệt độ giữ ở mức phòng ${tAir.toFixed(1)}°C`;
    } else {
      reasonVi = `Môi trường cân bằng: Nhiệt độ phòng ${tAir.toFixed(1)}°C, áp suất đáy bình ${(hydrostaticPressurePa / 1000).toFixed(2)} kPa`;
    }

    const uncertainty = MetrologyEngine.calculateUncertaintyBudget({
      leastCount: 1.0,
      instrumentalError: 0.5,
      repeatabilitySigma: 0.2,
      unit: '°C',
    });

    return {
      derived: {
        liquidLevelMl: baseLiquidLevelMl,
        hydrostaticPressurePa,
        buoyantForceN,
        overflowVolumeMl,
        temperatureC: Number(temperatureC.toFixed(2)),
        isBoiling,
        isHeatingActive,
        heatExchangeRateW: Number(heatExchangeRateW.toFixed(1)),
        boilingPointC,
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
          'Phương trình Antoine điểm sôi chất lỏng',
        ],
        referenceFormulasLatex: [
          'p = p_0 + \\rho \\cdot g \\cdot h',
          'F_A = \\rho \\cdot g \\cdot V_{\\text{displaced}}',
          'Q = m \\cdot c \\cdot \\Delta T',
          'T_{\\text{boil}}(p) = T_0 \\cdot \\left(\\frac{p}{p_0}\\right)^{0.285}',
        ],
        computationTimestamp: Date.now(),
      },
    };
  }

  /**
   * ĐỘNG HỌC LIÊN TỤC THEO BƯỚC THỜI GIAN dt (CONTINUOUS DYNAMICAL SOLVER)
   * - Truyền nhiệt vi phân từ ngọn lửa đèn cồn:
   *   $\frac{dT}{dt} = \frac{P_{in}(d) - h \cdot A \cdot (T - T_{air})}{m \cdot c}$
   * - Hiện tượng sôi khi $T \ge T_{boil}$: bốc hơi nước theo nhiệt hóa hơi $L = 2.26 \times 10^6\text{ J/kg}$
   * - Bình thông nhau liên tục: lưu lượng chảy cân bằng mặt thoáng giữa các nhánh theo Torricelli
   * - Áp suất thủy tĩnh và lực đẩy Archimedes phụ thuộc thời gian
   */
  public static solveContinuous(
    input: SolverInput,
    dtSeconds: number,
  ): SolverResult<FluidThermalDerivedOutputs> {
    const dt = Math.max(0.001, Math.min(1.0, dtSeconds));
    const { state, environment, topology, archetype } = input;
    const warnings: string[] = [];
    const errors: string[] = [];

    const g = Number(environment?.gravityMps2 ?? 9.80665);
    const p0KPa = Number(environment?.atmosphericPressureKPa ?? 101.325);
    const p0 = p0KPa * 1000.0;
    const tAir = Number(environment?.airTemperatureC ?? 25.0);

    const fluidType = (state.fluidType ?? 'water').toLowerCase();
    const fluidProps = FLUID_PROPERTIES_DATABASE[fluidType] ?? FLUID_PROPERTIES_DATABASE.water;
    const fluidDensityKgM3 = Number(state.fluidDensityKgM3 ?? fluidProps.densityKgM3);
    const boilingPointC = FluidThermalSolver.calculateBoilingPoint(fluidType, p0KPa);

    // 1. Thủy tĩnh & Động học mức chất lỏng
    let currentLiquidMl = Number(state.liquidLevelMl ?? state.baseLiquidLevelMl ?? 100.0);
    const crossSectionAreaM2 = FluidThermalSolver.getVesselCrossSectionArea(archetype ?? state.archetype);

    // Lưu lượng cân bằng bình thông nhau theo định luật Torricelli & Bernoulli vi phân
    if (topology?.communicatingConnected && typeof topology?.peerLiquidLevelMl === 'number') {
      const peerAreaM2 = FluidThermalSolver.getVesselCrossSectionArea(topology?.peerArchetype ?? archetype);
      const hSelfM = (currentLiquidMl * 1.0e-6) / crossSectionAreaM2;
      const hPeerM = (topology.peerLiquidLevelMl * 1.0e-6) / peerAreaM2;
      const tiltAngleRad = ((Number(state.tiltAngleDeg ?? 0.0)) * Math.PI) / 180.0;
      const cosTilt = Math.max(0.1, Math.cos(tiltAngleRad));
      
      const deltaElevationM = (hSelfM - hPeerM) * cosTilt;
      if (Math.abs(deltaElevationM) > 1e-4) {
        const Cd = 0.62; // Hệ số xả nhớt
        const dOrificeM = 0.006; // Đường kính ống thông 6 mm
        const aOrificeM2 = Math.PI * Math.pow(dOrificeM * 0.5, 2);
        const vTorricelli = Math.sqrt(2.0 * g * Math.abs(deltaElevationM));
        const flowRateMlPerSec = Cd * aOrificeM2 * vTorricelli * 1.0e6 * Math.sign(deltaElevationM);
        
        // Tránh quá đà dao động
        const maxDeltaMl = Math.abs(currentLiquidMl - topology.peerLiquidLevelMl) * 0.5;
        const actualTransferMl = Math.min(maxDeltaMl, Math.abs(flowRateMlPerSec * dt)) * Math.sign(flowRateMlPerSec);
        currentLiquidMl = Math.max(0, currentLiquidMl - actualTransferMl);
      }
    }

    const heightM = (currentLiquidMl * 1.0e-6) / crossSectionAreaM2;
    const hydrostaticPressurePa = p0 + fluidDensityKgM3 * g * heightM;

    // 2. Lực đẩy Archimedes
    const rawSubmergedVolumeMl = Number(state.submergedVolumeMl ?? 0.0);
    const specimenVolumeLimitMl = Number(state.specimenVolumeMl ?? 24.54);
    const submergedVolumeMl = Math.max(0.0, Math.min(rawSubmergedVolumeMl, specimenVolumeLimitMl));
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
    let evaporatedMassG = Number(state.evaporatedMassG ?? 0.0);

    // Nhiệt dung toàn phần của hệ (chất lỏng + vỏ thủy tinh / bát sứ)
    const mLiquidKg = currentLiquidMl * (fluidDensityKgM3 * 1.0e-6);
    const cFluid = fluidProps.specificHeatJKgK;
    const mVesselKg = Number(state.vesselMassKg ?? 0.096); // 96g cốc thủy tinh Borosilicate
    const cVessel = 840.0; // J/(kg*K)
    const totalThermalCapacityJK = Math.max(30.0, mLiquidKg * cFluid + mVesselKg * cVessel);

    if (isCoupledToHeatSource) {
      isHeatingActive = true;
      const P_flameMaxW = 250.0; // Công suất đèn cồn
      const proximityFactor = Math.max(0, 1.0 - distanceToHeatSourceM / 0.10);
      const usefulHeatPowerW = P_flameMaxW * (proximityFactor * proximityFactor);

      // Tổn hao đối lưu & bức xạ qua thành và mặt thoáng
      const hA = 1.65; // W/K
      const heatLossW = hA * Math.max(0, currentTempC - tAir);
      const netPowerW = usefulHeatPowerW - heatLossW;
      heatExchangeRateW = netPowerW;

      // dT/dt = P_net / C_total
      const dTdt = netPowerW / totalThermalCapacityJK;
      newTempC = currentTempC + dTdt * dt;

      // Ngưỡng sôi phụ thuộc áp suất
      if (newTempC >= boilingPointC) {
        newTempC = boilingPointC;
        isBoiling = true;
        if (netPowerW > 0 && currentLiquidMl > 0) {
          const LVaporization = fluidProps.latentHeatVaporizationJKg;
          const boilLossKg = (netPowerW * dt) / LVaporization;
          const boiledVolumeMl = (boilLossKg * 1.0e6) / fluidDensityKgM3;
          currentLiquidMl = Math.max(0, currentLiquidMl - boiledVolumeMl);
          evaporatedMassG += boilLossKg * 1000.0;
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

    // 4. Quán tính truyền nhiệt của nhiệt kế
    const prevThermometerTempC = Number(state.thermometerTempC ?? tAir);
    const isThermometerInLiquid = Boolean(state.isThermometerInLiquid ?? true);
    const tauThermometer = isThermometerInLiquid ? 4.5 : 45.0; // 4.5s trong nước, 45s trong không khí
    const alphaTherm = 1.0 - Math.exp(-dt / tauThermometer);
    const targetFluidTemp = isThermometerInLiquid ? newTempC : tAir;
    const thermometerTempC = Number((prevThermometerTempC + (targetFluidTemp - prevThermometerTempC) * alphaTherm).toFixed(2));

    let reasonVi = '';
    if (isHeatingActive) {
      reasonVi = isBoiling
        ? `Nước đang sôi sùng sục ở ${boilingPointC.toFixed(1)}°C! Hóa hơi với công suất ${heatExchangeRateW.toFixed(1)} W`
        : `Ngọn lửa đèn cồn gia nhiệt liên tục: T = ${newTempC.toFixed(1)}°C (+${heatExchangeRateW.toFixed(1)} W)`;
    } else if (isFlameLit) {
      reasonVi = `Đèn cồn cách xa bình chứa (${(distanceToHeatSourceM * 100).toFixed(1)} cm > 10 cm): Không truyền nhiệt, làm nguội dần về ${tAir.toFixed(1)}°C`;
    } else {
      reasonVi = `Môi trường cân bằng: T = ${newTempC.toFixed(1)}°C, Áp suất thủy tĩnh = ${(hydrostaticPressurePa / 1000).toFixed(2)} kPa`;
    }

    const uncertainty = MetrologyEngine.calculateUncertaintyBudget({
      leastCount: 1.0,
      instrumentalError: 0.5,
      repeatabilitySigma: 0.1,
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
        boilingPointC,
        evaporatedMassG: Number(evaporatedMassG.toFixed(2)),
        reasonVi,
      },
      valid: errors.length === 0,
      warnings,
      errors,
      uncertainty,
      provenance: {
        solverId: FluidThermalSolver.SOLVER_ID,
        version: '2.1.0-CONTINUOUS',
        lawsApplied: [
          'Phương trình vi phân truyền nhiệt Fourier và làm nguội Newton',
          'Nhiệt hóa hơi chất lỏng L',
          'Định luật áp suất thủy tĩnh và bình thông nhau động học',
          'Định luật lực đẩy Archimedes biến thiên thời gian',
          'Phương trình Antoine điểm sôi chất lỏng',
        ],
        referenceFormulasLatex: [
          '\\frac{dT}{dt} = \\frac{P_{in} - h \\cdot A \\cdot (T - T_{air})}{m \\cdot c}',
          '\\frac{dm_{evap}}{dt} = \\frac{P_{net}}{L}',
          'p = p_0 + \\rho \\cdot g \\cdot h',
          'T_{\\text{boil}}(p) = T_0 \\cdot \\left(\\frac{p}{p_0}\\right)^{0.285}',
        ],
        computationTimestamp: Date.now(),
      },
    };
  }
}

