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
    const { state } = input;
    const warnings: string[] = [];
    const errors: string[] = [];

    // Vận tốc chuyển động của thanh nam châm v (m/s) qua cuộn dây
    const magnetVelocityMps = Number(state.magnetVelocityMps ?? state.magnetSpeed ?? 0.0);
    const coilTurnsN = Number(state.coilTurns ?? 500);

    // Độ biến thiên từ thông dPhi/dt tỷ lệ thuận với vận tốc v
    const fluxDerivativeWbPerS = magnetVelocityMps * 2.0e-3;
    const inducedEmfVolts = -coilTurnsN * fluxDerivativeWbPerS;
    const coilResistanceOhms = 50.0;
    const inducedCurrentMicroAmps = (inducedEmfVolts / coilResistanceOhms) * 1e6;

    let ledRedIntensity = 0.0;
    let ledGreenIntensity = 0.0;
    let isLedRedOn = false;
    let isLedGreenOn = false;
    let reasonVi = '';

    if (Math.abs(magnetVelocityMps) < 1e-4) {
      // Nam châm đứng yên -> dPhi/dt = 0 -> không có dòng điện cảm ứng
      ledRedIntensity = 0.0;
      ledGreenIntensity = 0.0;
      isLedRedOn = false;
      isLedGreenOn = false;
      reasonVi = 'Nam châm đứng yên (dΦ/dt = 0): Từ thông qua cuộn dây không biến thiên, cả 2 LED đều tắt';
    } else if (magnetVelocityMps > 0) {
      // Nam châm tiến lại gần -> dPhi/dt > 0 -> Dòng điện chiều thuận kích LED đỏ
      ledRedIntensity = Math.min(2.0, 1.4);
      ledGreenIntensity = 0.0;
      isLedRedOn = true;
      isLedGreenOn = false;
      reasonVi = `Nam châm tiến lại gần (v = ${magnetVelocityMps.toFixed(2)} m/s > 0): Từ thông tăng, LED Đỏ phát sáng (${ledRedIntensity.toFixed(1)})`;
    } else {
      // Nam châm rút ra xa -> dPhi/dt < 0 -> Dòng điện chiều nghịch kích LED xanh
      ledRedIntensity = 0.0;
      ledGreenIntensity = Math.min(2.0, 1.4);
      isLedRedOn = false;
      isLedGreenOn = true;
      reasonVi = `Nam châm rút ra xa (v = ${magnetVelocityMps.toFixed(2)} m/s < 0): Từ thông giảm, LED Xanh phát sáng (${ledGreenIntensity.toFixed(1)})`;
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
