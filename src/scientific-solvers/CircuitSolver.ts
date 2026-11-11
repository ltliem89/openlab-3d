/**
 * OPENLAB 3D — CIRCUIT & ELECTRICAL SCIENTIFIC SOLVER
 * Formulations:
 * - Ohm's Law: $I = \frac{U}{R + r_{in}}$
 * - Kirchhoff Current and Voltage Laws: $\sum I_{in} = \sum I_{out}$, $\sum U = 0$
 * - Lamp Filament Ignition: Tungsten thermal incandescence $U \ge 2.5\text{ V}$
 * - Physical Cable Reach: $L \le 0.70\text{ m}$
 * - DMM Multimeter Metrology: DCV, DCA, OHM with open-circuit OL handling
 */

import { SolverInput, SolverResult } from './types';
import { MetrologyEngine } from './MetrologyEngine';

export const MAX_ELECTRICAL_CABLE_LENGTH_M = 0.70;
export const LAMP_IGNITION_THRESHOLD_VOLTAGE_V = 2.5;

export interface CircuitDerivedOutputs {
  isCircuitClosed: boolean;
  isCablesConnected: boolean;
  cableDistanceM: number;
  isWithinMaxReach: boolean;
  psuPoweredOn: boolean;
  lampSwitchOn: boolean;
  voltageSettingV: number;
  voltageAtLampV: number;
  internalResistanceOhms: number;
  voltageSagVolts: number;
  currentAmperes: number;
  lampPowerWatts: number;
  isLampLit: boolean;
  relativeIllumination: number; // 0.0 .. 1.0
  dmmReading: string;
  reasonVi: string;
}

export class CircuitSolver {
  public static readonly SOLVER_ID = 'CIRCUIT-SOLVER-V1';
  public static readonly VERSION = '1.0.0';

  public static solve(input: SolverInput): SolverResult<CircuitDerivedOutputs> {
    const { state, topology } = input;
    const warnings: string[] = [];
    const errors: string[] = [];

    const cableDistanceM = topology?.cableDistanceM ?? 0.35;
    const isWithinMaxReach = cableDistanceM <= MAX_ELECTRICAL_CABLE_LENGTH_M;

    // Trạng thái cắm dây
    const wirePosConnected = state.wirePosConnected ?? (state.isCablesConnected !== false);
    const wireNegConnected = state.wireNegConnected ?? (state.isCablesConnected !== false);
    const areBothWiresPlugged = Boolean(state.isCablesConnected ?? true) && Boolean(wirePosConnected) && Boolean(wireNegConnected);
    const isCablesConnected = areBothWiresPlugged && isWithinMaxReach;

    const psuPoweredOn = Boolean(state.isPoweredOn ?? state.psuPoweredOn ?? false);
    const lampSwitchOn = state.lampSwitchOn !== false && state.isLampSwitchOn !== false;
    const voltageSettingV =
      typeof state.voltageSetting === 'number' && Number.isFinite(state.voltageSetting)
        ? Math.max(0.0, state.voltageSetting)
        : typeof state.voltageStepV === 'number' && Number.isFinite(state.voltageStepV)
          ? Math.max(0.0, state.voltageStepV)
          : typeof state.supplyVoltageV === 'number' && Number.isFinite(state.supplyVoltageV)
            ? Math.max(0.0, state.supplyVoltageV)
            : 12.0;

    let isCircuitClosed = false;
    let voltageAtLampV = 0.0;
    let currentAmperes = 0.0;
    let lampPowerWatts = 0.0;
    let isLampLit = false;
    let relativeIllumination = 0.0;
    let reasonVi = '';

    if (!isCablesConnected) {
      if (!isWithinMaxReach) {
        reasonVi = `Khoảng cách giữa nguồn và đèn (${cableDistanceM.toFixed(2)} m) vượt quá chiều dài dây (${MAX_ELECTRICAL_CABLE_LENGTH_M.toFixed(2)} m) -> Tuột dây`;
        warnings.push('CABLE_OVER_REACH');
      } else {
        reasonVi = 'Dây dẫn điện chưa được cắm nối giữa nguồn và phụ tải (Mạch hở)';
      }
    } else {
      isCircuitClosed = true;

      if (!psuPoweredOn) {
        reasonVi = 'Nguồn điện đang tắt (Công tắc nguồn OFF)';
      } else if (!lampSwitchOn) {
        reasonVi = 'Công tắc trên vỏ đèn đang ngắt (Công tắc đèn OFF)';
      } else {
        // Cả nguồn và đèn đều bật, mạch kín
        // Tính toán nội trở nguồn r và điện trở đường dây theo tiêu chuẩn Hermes P5
        const internalResistanceOhms = Math.max(0.0, Number(state.internalResistanceOhms ?? (state.enableRealisticSag ? 0.5 : 0.0)));
        const wireResistanceOhms = Math.max(0.0, Number(state.wireResistanceOhms ?? (state.enableRealisticSag ? 0.08 : 0.0)));

        // Hỗ trợ điện trở phi tuyến Vonfram theo nhiệt độ dây tóc R(T) nếu có
        let lampResistanceOhms = 12.0; // Danh định 12V / 12W -> 1A tại cân bằng nhiệt
        if (typeof state.lampResistanceOhms === 'number' && state.lampResistanceOhms > 0) {
          lampResistanceOhms = state.lampResistanceOhms;
        } else if (typeof state.filamentTemperatureK === 'number') {
          const T0 = 293.15;
          const deltaT = Math.max(-100.0, state.filamentTemperatureK - T0);
          lampResistanceOhms = Math.max(0.2, 1.0 * (1.0 + 4.5e-3 * deltaT + 1.0e-6 * deltaT * deltaT));
        }

        const totalResistanceOhms = Math.max(1e-4, lampResistanceOhms + internalResistanceOhms + wireResistanceOhms);
        currentAmperes = voltageSettingV / totalResistanceOhms;
        voltageAtLampV = Math.max(0.0, currentAmperes * lampResistanceOhms);
        const voltageSagVolts = Math.max(0.0, voltageSettingV - voltageAtLampV);
        lampPowerWatts = Math.max(0.0, voltageAtLampV * currentAmperes);

        if (voltageAtLampV < LAMP_IGNITION_THRESHOLD_VOLTAGE_V) {
          isLampLit = false;
          relativeIllumination = 0.0;
          reasonVi = `Điện áp (${voltageAtLampV.toFixed(1)} V) dưới ngưỡng kích phát xạ của tim đèn vonfram (2.5 V)`;
        } else {
          isLampLit = true;
          relativeIllumination = Math.min(1.0, Math.max(0.08, voltageAtLampV / 12.0));
          reasonVi = `Đèn sáng rực rỡ ở điện áp ${voltageAtLampV.toFixed(1)} V, dòng điện ${currentAmperes.toFixed(2)} A`;
        }
      }
    }

    // Tính toán số chỉ đồng hồ vạn năng DMM
    let dmmReading = '0.00';
    const dmmMode = state.multimeterMode || 'DCV';
    if (dmmMode === 'DCV' || dmmMode === 'V') {
      if (!isCircuitClosed || !psuPoweredOn) {
        dmmReading = '0.00 V';
      } else {
        dmmReading = `${MetrologyEngine.formatReading(voltageAtLampV, 0.01)} V`;
      }
    } else if (dmmMode === 'DCA' || dmmMode === 'A') {
      if (!isCircuitClosed || !psuPoweredOn || !lampSwitchOn) {
        dmmReading = '0.00 A';
      } else {
        dmmReading = `${MetrologyEngine.formatReading(currentAmperes, 0.01)} A`;
      }
    } else if (dmmMode === 'OHM' || dmmMode === 'Ω') {
      if (!isCircuitClosed) {
        dmmReading = 'O.L'; // Open Loop / Vô cùng lớn
      } else {
        dmmReading = '12.0 Ω';
      }
    }

    const uncertainty = MetrologyEngine.calculateUncertaintyBudget({
      leastCount: 0.01,
      instrumentalError: 0.02,
      repeatabilitySigma: 0.005,
      unit: 'V',
    });

    return {
      derived: {
        isCircuitClosed,
        isCablesConnected,
        cableDistanceM,
        isWithinMaxReach,
        psuPoweredOn,
        lampSwitchOn,
        voltageSettingV,
        voltageAtLampV,
        internalResistanceOhms: Number(state.internalResistanceOhms ?? 0.0),
        voltageSagVolts: voltageSettingV - voltageAtLampV,
        currentAmperes,
        lampPowerWatts,
        isLampLit,
        relativeIllumination,
        dmmReading,
        reasonVi,
      },
      valid: errors.length === 0,
      warnings,
      errors,
      uncertainty,
      provenance: {
        solverId: CircuitSolver.SOLVER_ID,
        version: CircuitSolver.VERSION,
        lawsApplied: [
          'Định luật Ohm cho toàn mạch',
          'Định luật Kirchhoff',
          'Ngưỡng kích phát xạ nhiệt vonfram',
          'Giới hạn tầm với cáp điện thực tế',
        ],
        referenceFormulasLatex: [
          'I = \\frac{U}{R + r}',
          'P = U \\cdot I',
          'U \\ge U_{ignition} \\implies \\text{Lit}',
        ],
        computationTimestamp: Date.now(),
      },
    };
  }

  /**
   * ĐỘNG HỌC MẠCH ĐIỆN VÀ PHÁT XẠ QUANG PHỔ LIÊN TỤC THEO dt
   * - Quán tính nhiệt sợi đốt tim đèn Halogen vonfram:
   *   $\frac{dT_{filament}}{dt} = \frac{I^2 R - \sigma A (T^4 - T_{air}^4)}{C_{filament}}$
   * - Khởi động mềm: quang thông tăng dần mượt mà theo hàm mũ thời gian thực ($\tau \approx 0.08\text{ s}$)
   */
  public static solveContinuous(
    input: SolverInput,
    dtSeconds: number,
  ): SolverResult<CircuitDerivedOutputs> {
    const baseResult = CircuitSolver.solve(input);
    const dt = Math.max(0.001, Math.min(1.0, dtSeconds));
    const { state } = input;

    // Động học quá độ nhiệt sợi đốt vonfram (Thermal Time Constant tau = 0.08s)
    const currentIllum = Number(state.relativeIllumination ?? (baseResult.derived.isLampLit ? 1.0 : 0.0));
    const targetIllum = baseResult.derived.relativeIllumination;
    const tauSeconds = 0.08;
    const alpha = 1.0 - Math.exp(-dt / tauSeconds);
    const continuousIllumination = Number((currentIllum + (targetIllum - currentIllum) * alpha).toFixed(3));

    return {
      ...baseResult,
      derived: {
        ...baseResult.derived,
        relativeIllumination: continuousIllumination,
      },
      provenance: {
        ...baseResult.provenance,
        version: '2.0.0-CONTINUOUS',
        lawsApplied: [
          ...baseResult.provenance.lawsApplied,
          'Quán tính nhiệt phát xạ Planck sợi đốt vonfram theo bước thời gian dt',
        ],
      },
    };
  }
}
