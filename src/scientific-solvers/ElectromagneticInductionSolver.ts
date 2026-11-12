/**
 * OPENLAB 3D — ELECTROMAGNETIC INDUCTION SCIENTIFIC SOLVER
 * Formulations:
 * - Faraday's Law of Electromagnetic Induction: $\mathcal{E}_{ci} = -N \frac{\Delta \Phi}{\Delta t}$
 * - Lenz's Law: Direction of induced current opposes magnetic flux variation
 * - LED Dual-Polarity Emission:
 *     - dPhi/dt > 0 (Magnet approaching): LED 1 (Red) emits, LED 2 (Green) off
 *     - dPhi/dt < 0 (Magnet receding): LED 1 off, LED 2 (Green) emits
 *     - dPhi/dt = 0 (Magnet stationary): Both LEDs off (emissiveIntensity = 0.0)
 */

import { SolverInput, SolverResult } from './types';
import { MetrologyEngine } from './MetrologyEngine';

export interface InductionDerivedOutputs {
  inducedEmfVolts: number;
  inducedCurrentMicroAmps: number;
  fluxDerivativeWbPerS: number;
  lenzDampingForceNewtons: number;
  netMagnetAccelerationMps2: number;
  ledRedIntensity: number;   // 0.0 .. 2.0
  ledGreenIntensity: number; // 0.0 .. 2.0
  isLedRedOn: boolean;
  isLedGreenOn: boolean;
  reasonVi: string;
}

export class ElectromagneticInductionSolver {
  public static readonly SOLVER_ID = 'INDUCTION-SOLVER-V1';
  public static readonly VERSION = '1.0.0';

  public static solve(input: SolverInput): SolverResult<InductionDerivedOutputs> {
    const { state, environment } = input;
    const warnings: string[] = [];
    const errors: string[] = [];

    // Vận tốc chuyển động của thanh nam châm v (m/s) qua cuộn dây
    const magnetVelocityMps = Number(state.magnetVelocityMps ?? state.magnetSpeed ?? 0.0);
    const coilTurnsN = Number(state.coilTurns ?? 500);

    // Độ biến thiên từ thông theo vị trí kPhi = dPhi/dz (Wb/m) và dPhi/dt = kPhi * v
    // Mặc định 8.0e-3 Wb/m để đảm bảo suất điện động cảm ứng vượt ngưỡng kích sáng điốt LED 1.65V tại v = 0.5 m/s (E = -N * dPhi/dt = 2.0 V)
    const dPhiDz = Number(state.fluxGradientWbPerM ?? 8.0e-3);
    const fluxDerivativeWbPerS = magnetVelocityMps * dPhiDz;
    const inducedEmfVolts = -coilTurnsN * fluxDerivativeWbPerS;
    const coilResistanceOhms = Math.max(0.1, Number(state.coilResistanceOhms ?? 2.4));
    const loadResistanceOhms = Math.max(0.0, Number(state.loadResistanceOhms ?? 47.6));
    const totalResistanceOhms = Math.max(0.1, coilResistanceOhms + loadResistanceOhms);
    const inducedCurrentMicroAmps = (inducedEmfVolts / totalResistanceOhms) * 1e6;

    // Lực hãm cảm ứng điện từ Lenz tuân thủ Bảo toàn Năng lượng (F_Lenz * v = -E^2 / R_total):
    // F_Lenz = - (N * dPhi/dz)^2 / R_total * v
    const electromechanicalCoupling = coilTurnsN * dPhiDz;
    const rawLenzForce = -((electromechanicalCoupling * electromechanicalCoupling) / totalResistanceOhms) * magnetVelocityMps;
    const lenzDampingForceNewtons = Math.max(-100.0, Math.min(100.0, rawLenzForce));
    const magnetMassKg = Math.max(0.001, Number(state.magnetMassKg ?? 0.08));
    const gravityMps2 = Number(environment?.gravityMps2 ?? 9.80665);
    const netMagnetAccelerationMps2 = Math.max(-50.0, Math.min(50.0, gravityMps2 + (lenzDampingForceNewtons / magnetMassKg)));

    // Ngưỡng điện áp mở bán dẫn điốt phát quang LED: V_F ~ 1.65 V (hoặc 0.2 V nếu không nối trực tiếp diode ngưỡng cao)
    const ledThresholdV = Number(state.ledForwardVoltageV ?? 1.65);
    const absEmf = Math.abs(inducedEmfVolts);

    let ledRedIntensity = 0.0;
    let ledGreenIntensity = 0.0;
    let isLedRedOn = false;
    let isLedGreenOn = false;
    let reasonVi = '';

    if (Math.abs(magnetVelocityMps) < 1e-4) {
      // Nam châm đứng yên -> dPhi/dt = 0 -> không có dòng điện cảm ứng
      reasonVi = 'Nam châm đứng yên (dΦ/dt = 0): Từ thông qua cuộn dây không biến thiên, cả 2 LED đều tắt';
    } else if (absEmf < ledThresholdV) {
      reasonVi = `Nam châm dịch chuyển quá chậm (|E| = ${absEmf.toFixed(2)} V < V_F = ${ledThresholdV.toFixed(2)} V): Chưa đủ điện áp ngưỡng kích sáng LED`;
    } else if (magnetVelocityMps > 0) {
      // Nam châm tiến lại gần -> dPhi/dt > 0 -> Dòng điện chiều thuận kích LED đỏ
      ledRedIntensity = Math.min(2.0, Math.max(0.25, (absEmf - ledThresholdV + 0.5) * 0.8));
      isLedRedOn = true;
      reasonVi = `Nam châm tiến lại gần (v = ${magnetVelocityMps.toFixed(2)} m/s > 0, |E| = ${absEmf.toFixed(2)} V): Từ thông tăng, LED Đỏ phát sáng (${ledRedIntensity.toFixed(1)})`;
    } else {
      // Nam châm rút ra xa -> dPhi/dt < 0 -> Dòng điện chiều nghịch kích LED xanh
      ledGreenIntensity = Math.min(2.0, Math.max(0.25, (absEmf - ledThresholdV + 0.5) * 0.8));
      isLedGreenOn = true;
      reasonVi = `Nam châm rút ra xa (v = ${magnetVelocityMps.toFixed(2)} m/s < 0, |E| = ${absEmf.toFixed(2)} V): Từ thông giảm, LED Xanh phát sáng (${ledGreenIntensity.toFixed(1)})`;
    }

    const uncertainty = MetrologyEngine.calculateUncertaintyBudget({
      leastCount: 0.1,
      instrumentalError: 0.1,
      repeatabilitySigma: 0.05,
      unit: 'µA',
    });

    return {
      derived: {
        inducedEmfVolts,
        inducedCurrentMicroAmps,
        fluxDerivativeWbPerS,
        lenzDampingForceNewtons,
        netMagnetAccelerationMps2,
        ledRedIntensity,
        ledGreenIntensity,
        isLedRedOn,
        isLedGreenOn,
        reasonVi,
      },
      valid: errors.length === 0,
      warnings,
      errors,
      uncertainty,
      provenance: {
        solverId: ElectromagneticInductionSolver.SOLVER_ID,
        version: ElectromagneticInductionSolver.VERSION,
        lawsApplied: [
          'Định luật cảm ứng điện từ Faraday',
          'Định luật cảm ứng Lenz về chiều dòng điện',
          'Đặc tuyến bán dẫn điốt phát quang LED',
        ],
        referenceFormulasLatex: [
          '\\mathcal{E}_{ci} = -N \\frac{\\Delta \\Phi}{\\Delta t}',
          'I = \\frac{\\mathcal{E}}{R}',
        ],
        computationTimestamp: Date.now(),
      },
    };
  }
}
