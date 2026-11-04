/**
 * OPENLAB 3D — MECHANICS & FORCE SCIENTIFIC SOLVER
 * Formulations:
 * - Gravitational Force: $P = m \cdot g$
 * - Hooke's Law of Elasticity: $F_{dh} = k \cdot |\Delta l| \iff |\Delta l| = \frac{F}{k}$
 * - Lever Equilibrium: $\sum M_O = 0 \iff F_1 \cdot d_1 = F_2 \cdot d_2$
 * - Mass Weighing with Tare: $m_{net} = \max(0, m_{gross} - m_{tare})$
 * - Vernier Caliper Principle: $L = L_{main} + N_{vernier} \times 0.05\text{ mm}$
 */

import { SolverInput, SolverResult } from './types';
import { MetrologyEngine } from './MetrologyEngine';

export interface MechanicsDerivedOutputs {
  massNetG: number;
  massGrossG: number;
  tareOffsetG: number;
  forceNewtons: number;
  springExtensionMm: number;
  leverTorqueLeftNm: number;
  leverTorqueRightNm: number;
  isLeverBalanced: boolean;
  caliperLengthMm: number;
  settledReadingDisplay: string;
  reasonVi: string;
}

export class MechanicsSolver {
  public static readonly SOLVER_ID = 'MECHANICS-SOLVER-V1';
  public static readonly VERSION = '1.0.0';

  public static solve(input: SolverInput): SolverResult<MechanicsDerivedOutputs> {
    const { state, environment } = input;
    const warnings: string[] = [];
    const errors: string[] = [];

    const g = Number(environment?.gravityMps2 ?? 9.80665);

    // 1. Cân điện tử & Khối lượng tịnh
    const massGrossG = Number(state.measuredMassG ?? state.rawMassG ?? 0.0);
    const tareOffsetG = Number(state.tareOffsetG ?? 0.0);
    const massNetG = Math.max(0.0, massGrossG - tareOffsetG);

    // 2. Lực kế lò xo & Định luật Hooke
    // Độ cứng lò xo chuẩn lực kế 5N: k = 50 N/m (5 N dãn 100 mm = 0.1 m)
    const springConstantK = 50.0; // N/m
    let forceNewtons = 0.0;

    if (typeof state.springExtensionN === 'number') {
      forceNewtons = state.springExtensionN;
    } else if (typeof state.attachedMassKg === 'number') {
      forceNewtons = state.attachedMassKg * g;
    } else if (massGrossG > 0) {
      forceNewtons = (massGrossG / 1000.0) * g;
    }

    // Giới hạn đo của lực kế 5N
    if (forceNewtons > 5.5) {
      warnings.push('SPRING_OVER_CAPACITY');
    }
    const springExtensionM = forceNewtons / springConstantK;
    const springExtensionMm = springExtensionM * 1000.0;

    // 3. Đòn bẩy thăng bằng
    const massLeftG = Number(state.massLeftG ?? 50.0);
    const armLeftM = Number(state.armLeftM ?? 0.10); // 10 cm
    const massRightG = Number(state.massRightG ?? 50.0);
    const armRightM = Number(state.armRightM ?? 0.10); // 10 cm

    const forceLeftN = (massLeftG / 1000.0) * g;
    const forceRightN = (massRightG / 1000.0) * g;
    const leverTorqueLeftNm = forceLeftN * armLeftM;
    const leverTorqueRightNm = forceRightN * armRightM;
    const isLeverBalanced = Math.abs(leverTorqueLeftNm - leverTorqueRightNm) <= 1e-4;

    // 4. Thước cặp cơ khí
    const jawOpeningMm = Number(state.jawOpeningMm ?? 15.45);
    const caliperLengthMm = MetrologyEngine.quantizeToLeastCount(jawOpeningMm, 0.05);

    // Màn hình hiển thị
    const settledReadingDisplay = massNetG > 0
      ? `${MetrologyEngine.formatReading(massNetG, 0.01)} g`
      : `${MetrologyEngine.formatReading(forceNewtons, 0.1)} N`;

    let reasonVi = '';
    if (massNetG > 0) {
      reasonVi = `Cân điện tử: m_gross = ${massGrossG.toFixed(2)} g, trừ bì m_tare = ${tareOffsetG.toFixed(2)} g -> m_net = ${massNetG.toFixed(2)} g`;
    } else if (forceNewtons > 0) {
      reasonVi = `Lực kế lò xo: F = ${forceNewtons.toFixed(2)} N -> Lò xo dãn ${springExtensionMm.toFixed(1)} mm theo định luật Hooke`;
    } else if (isLeverBalanced) {
      reasonVi = `Đòn bẩy thăng bằng: M_trái (${(leverTorqueLeftNm * 1000).toFixed(1)} mN·m) = M_phải (${(leverTorqueRightNm * 1000).toFixed(1)} mN·m)`;
    } else {
      reasonVi = 'Hệ cơ học ở trạng thái thăng bằng tự do';
    }

    const uncertainty = MetrologyEngine.calculateUncertaintyBudget({
      leastCount: 0.01,
      instrumentalError: 0.02,
      repeatabilitySigma: 0.01,
      unit: 'g',
    });

    return {
      derived: {
        massNetG,
        massGrossG,
        tareOffsetG,
        forceNewtons,
        springExtensionMm,
        leverTorqueLeftNm,
        leverTorqueRightNm,
        isLeverBalanced,
        caliperLengthMm,
        settledReadingDisplay,
        reasonVi,
      },
      valid: errors.length === 0,
      warnings,
      errors,
      uncertainty,
      provenance: {
        solverId: MechanicsSolver.SOLVER_ID,
        version: MechanicsSolver.VERSION,
        lawsApplied: [
          'Định luật vạn vật hấp dẫn và trọng lượng',
          'Định luật biến dạng đàn hồi Hooke',
          'Quy tắc mômen lực cân bằng đòn bẩy',
          'Nguyên lý trừ bì cảm biến đo khối lượng',
        ],
        referenceFormulasLatex: [
          'P = m \\cdot g',
          'F_{dh} = k \\cdot \\Delta l',
          '\\sum M_O = 0 \\iff F_1 \\cdot d_1 = F_2 \\cdot d_2',
          'm_{net} = \\max(0, m_{gross} - m_{tare})',
        ],
        computationTimestamp: Date.now(),
      },
    };
  }
}
