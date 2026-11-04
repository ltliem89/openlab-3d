/**
 * OPENLAB 3D — OPTICS & WAVE PROPAGATION SCIENTIFIC SOLVER
 * Formulations:
 * - Snell's Law of Refraction: $n_1 \sin i = n_2 \sin r$
 * - Total Internal Reflection Critical Angle: $\sin i_{crit} = \frac{n_2}{n_1}$ ($n_1 > n_2$)
 * - Gauss Thin Lens Formula: $\frac{1}{f} = \frac{1}{d} + \frac{1}{d'}$
 * - Transverse Linear Magnification: $k = -\frac{d'}{d}$
 * - Cauchy Dispersion: $n(\lambda) = A + \frac{B}{\lambda^2}$
 */

import { SolverInput, SolverResult } from './types';
import { MetrologyEngine } from './MetrologyEngine';

export interface OpticsDerivedOutputs {
  incidentAngleDeg: number;
  refractionAngleDeg: number;
  reflectionAngleDeg: number;
  isTotalInternalReflection: boolean;
  criticalAngleDeg: number;
  refractiveIndexMedium: number;
  objectDistanceDCm: number;
  imageDistanceDPrimeCm: number | null;
  focalLengthCm: number;
  linearMagnification: number | null;
  imageType: 'real' | 'virtual' | 'infinity';
  isSharpFocus: boolean;
  isRayPathVisible: boolean;
  rayCount: number;
  reasonVi: string;
}

export class OpticsSolver {
  public static readonly SOLVER_ID = 'OPTICS-SOLVER-V1';
  public static readonly VERSION = '1.0.0';

  public static solve(input: SolverInput): SolverResult<OpticsDerivedOutputs> {
    const { state, topology } = input;
    const warnings: string[] = [];
    const errors: string[] = [];

    const isLightSourceActive = Boolean(state.isLampLit ?? state.isPoweredOn ?? false);
    const incidentAngleDeg = Number(state.incidentAngleDeg ?? state.rayAngleDeg ?? 30.0);
    const n1 = 1.00029; // Không khí
    const n2 = Number(state.refractiveIndex ?? 1.50); // Thủy tinh Crown tiêu chuẩn

    // 1. Khúc xạ Snell & Phản xạ toàn phần
    const sinCrit = n1 / n2;
    const criticalAngleDeg = (Math.asin(Math.min(1.0, sinCrit)) * 180) / Math.PI;

    const radI = (incidentAngleDeg * Math.PI) / 180;
    const sinR = (n1 / n2) * Math.sin(radI);

    let isTotalInternalReflection = false;
    let refractionAngleDeg = 0.0;
    const reflectionAngleDeg = incidentAngleDeg;

    if (Math.abs(sinR) > 1.0) {
      isTotalInternalReflection = true;
      refractionAngleDeg = 0.0;
      warnings.push('TOTAL_INTERNAL_REFLECTION');
    } else {
      refractionAngleDeg = Number(((Math.asin(sinR) * 180) / Math.PI).toFixed(2));
    }

    // 2. Thấu kính mỏng Gauss
    const focalLengthCm = Number(state.focalLengthCm ?? 10.0);
    const objectDistanceDCm = Number(state.objectDistanceDCm ?? 20.0);
    let imageDistanceDPrimeCm: number | null = null;
    let linearMagnification: number | null = null;
    let imageType: 'real' | 'virtual' | 'infinity' = 'real';
    let isSharpFocus = false;

    if (Math.abs(focalLengthCm) > 9999) {
      // Bản thủy tinh phẳng / Không hội tụ
      imageDistanceDPrimeCm = objectDistanceDCm;
      linearMagnification = 1.0;
      imageType = 'virtual';
    } else if (Math.abs(objectDistanceDCm - focalLengthCm) < 0.05) {
      // Vật tại đúng tiêu diện f -> Ảnh ở vô cực
      imageDistanceDPrimeCm = null;
      linearMagnification = null;
      imageType = 'infinity';
    } else {
      // 1/d' = 1/f - 1/d -> d' = (f * d) / (d - f)
      const dPrime = (focalLengthCm * objectDistanceDCm) / (objectDistanceDCm - focalLengthCm);
      imageDistanceDPrimeCm = Number(dPrime.toFixed(2));
      linearMagnification = Number((-(dPrime / objectDistanceDCm)).toFixed(2));
      imageType = dPrime > 0 ? 'real' : 'virtual';

      // Kiểm tra độ sắc nét trên màn hứng (nếu có vị trí màn chắn)
      const screenDistanceCm = Number(state.screenDistanceCm ?? 20.0);
      if (Math.abs(screenDistanceCm - dPrime) <= 0.4) {
        isSharpFocus = true;
      }
    }

    // 3. Hiển thị tia sáng (Chỉ hiển thị khi có nguồn sáng thực)
    const isRayPathVisible = isLightSourceActive;
    const rayCount = isLightSourceActive ? (state.beamMode === 'triple' ? 3 : 1) : 0;

    let reasonVi = '';
    if (!isLightSourceActive) {
      reasonVi = 'Nguồn sáng đang tắt, không có chùm tia trong không gian';
    } else if (isTotalInternalReflection) {
      reasonVi = `Góc tới i = ${incidentAngleDeg}° >= góc tới hạn ${criticalAngleDeg.toFixed(1)}° -> Phản xạ toàn phần`;
    } else {
      reasonVi = `Khúc xạ qua bản thủy tinh: i = ${incidentAngleDeg}°, r = ${refractionAngleDeg}°. Thấu kính tạo ảnh ${imageType === 'real' ? 'thật' : (imageType === 'virtual' ? 'ảo' : 'vô cực')} tại d' = ${imageDistanceDPrimeCm ?? '∞'} cm`;
    }

    const uncertainty = MetrologyEngine.calculateUncertaintyBudget({
      leastCount: 0.5,
      instrumentalError: 0.5,
      repeatabilitySigma: 0.2,
      unit: 'deg',
    });

    return {
      derived: {
        incidentAngleDeg,
        refractionAngleDeg,
        reflectionAngleDeg,
        isTotalInternalReflection,
        criticalAngleDeg,
        refractiveIndexMedium: n2,
        objectDistanceDCm,
        imageDistanceDPrimeCm,
        focalLengthCm,
        linearMagnification,
        imageType,
        isSharpFocus,
        isRayPathVisible,
        rayCount,
        reasonVi,
      },
      valid: errors.length === 0,
      warnings,
      errors,
      uncertainty,
      provenance: {
        solverId: OpticsSolver.SOLVER_ID,
        version: OpticsSolver.VERSION,
        lawsApplied: [
          'Định luật truyền thẳng ánh sáng',
          'Định luật phản xạ ánh sáng',
          'Định luật khúc xạ ánh sáng Snell',
          'Công thức thấu kính mỏng Gauss',
          'Hệ thức tán sắc Cauchy',
        ],
        referenceFormulasLatex: [
          'n_1 \\sin i = n_2 \\sin r',
          '\\sin i_{crit} = \\frac{n_2}{n_1}',
          '\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}',
          'k = -\\frac{d\'}{d}',
        ],
        computationTimestamp: Date.now(),
      },
    };
  }
}
