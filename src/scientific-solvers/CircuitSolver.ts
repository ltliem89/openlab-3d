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
      typeof state.voltageSetting === 'number' && state.voltageSetting > 0
        ? state.voltageSetting
        : typeof state.voltageStepV === 'number' && state.voltageStepV > 0
          ? state.voltageStepV
          : typeof state.supplyVoltageV === 'number' && state.supplyVoltageV > 0
            ? state.supplyVoltageV
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
        voltageAtLampV = voltageSettingV;
        const lampResistanceOhms = 12.0; // Điện trở tim đèn danh định 12V / 12W -> 1A
        currentAmperes = voltageAtLampV / lampResistanceOhms;
        lampPowerWatts = voltageAtLampV * currentAmperes;

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
}
