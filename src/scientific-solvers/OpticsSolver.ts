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

export interface SpectralComponent {
  wavelengthNm: number;
  colorHex: string;
  refractiveIndex: number;
  refractionAngleDeg: number;
  deviationAngleDeg: number;
}

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
  sharpnessRatio: number;
  spectralComponents?: SpectralComponent[];
  isRayPathVisible: boolean;
  rayCount: number;
  reasonVi: string;
}

export class OpticsSolver {
  public static readonly SOLVER_ID = 'OPTICS-SOLVER-V1';
  public static readonly VERSION = '1.0.0';

  /**
   * Tính chiết suất theo phương trình tán sắc thực nghiệm Cauchy cho thủy tinh Crown:
   * $$n(\lambda) = A + \frac{B}{\lambda^2} + \frac{C}{\lambda^4}$$
   * @param wavelengthNm Bước sóng photon ánh sáng (nm, ví dụ đỏ: 656.3 nm, lam: 486.1 nm)
   */
  public static calculateCauchyRefractionIndex(
    wavelengthNm: number,
    A: number = 1.5046,
    B: number = 4.2e3,
    C: number = 0.0
  ): number {
    const lambda = Math.max(300.0, Math.min(1000.0, wavelengthNm));
    const invL2 = 1.0 / (lambda * lambda);
    return A + B * invL2 + C * invL2 * invL2;
  }

  public static solve(input: SolverInput): SolverResult<OpticsDerivedOutputs> {
    const { state, topology } = input;
    const warnings: string[] = [];
    const errors: string[] = [];

    const isLightSourceActive = Boolean(state.isLampLit ?? state.isPoweredOn ?? false);
    const incidentAngleDeg = Number(state.incidentAngleDeg ?? state.rayAngleDeg ?? 30.0);
    const n1 = Number(state.airRefractiveIndex ?? 1.00029); // Không khí
    const n2 = Number(state.refractiveIndex ?? 1.50); // Thủy tinh Crown tiêu chuẩn

    // 1. Khúc xạ Snell & Phản xạ toàn phần (hỗ trợ cả tia đi từ không khí -> thủy tinh và thủy tinh -> không khí)
    const isFromDenserMedium = Boolean(state.isInsideMedium ?? state.fromMediumToAir ?? state.reverseDirection ?? false);
    const nIncident = isFromDenserMedium ? n2 : n1;
    const nTransmitted = isFromDenserMedium ? n1 : n2;

    const sinCrit = Math.min(n1, n2) / Math.max(n1, n2);
    const criticalAngleDeg = Number(((Math.asin(Math.min(1.0, sinCrit)) * 180) / Math.PI).toFixed(2));

    const radI = (incidentAngleDeg * Math.PI) / 180;
    const sinR = (nIncident / nTransmitted) * Math.sin(radI);

    let isTotalInternalReflection = false;
    let refractionAngleDeg = 0.0;
    const reflectionAngleDeg = incidentAngleDeg;

    if (nIncident > nTransmitted && Math.abs(sinR) >= 1.0) {
      isTotalInternalReflection = true;
      refractionAngleDeg = 0.0;
      warnings.push('TOTAL_INTERNAL_REFLECTION');
    } else {
      refractionAngleDeg = Number(((Math.asin(Math.max(-1.0, Math.min(1.0, sinR))) * 180) / Math.PI).toFixed(2));
    }

    // 2. Thấu kính mỏng Gauss
    const focalLengthCm = Number(state.focalLengthCm ?? 10.0);
    const objectDistanceDCm = Number(state.objectDistanceDCm ?? 20.0);
    let imageDistanceDPrimeCm: number | null = null;
    let linearMagnification: number | null = null;
    let imageType: 'real' | 'virtual' | 'infinity' = 'real';
    let isSharpFocus = false;
    let sharpnessRatio = 0.0;

    if (Math.abs(focalLengthCm) > 9999) {
      // Bản thủy tinh phẳng / Không hội tụ
      imageDistanceDPrimeCm = objectDistanceDCm;
      linearMagnification = 1.0;
      imageType = 'virtual';
      sharpnessRatio = 1.0;
      isSharpFocus = true;
    } else if (Math.abs(objectDistanceDCm) < 0.05) {
      // Bảo vệ điểm kỳ dị d -> 0 ngay sát quang tâm
      imageDistanceDPrimeCm = 0.0;
      linearMagnification = 1.0;
      imageType = 'virtual';
      sharpnessRatio = 0.0;
      isSharpFocus = false;
    } else if (Math.abs(objectDistanceDCm - focalLengthCm) < 0.05) {
      // Vật tại đúng tiêu diện f -> Ảnh ở vô cực
      imageDistanceDPrimeCm = null;
      linearMagnification = null;
      imageType = 'infinity';
      sharpnessRatio = 0.0;
      isSharpFocus = false;
    } else {
      // 1/d' = 1/f - 1/d -> d' = (f * d) / (d - f)
      const dPrime = (focalLengthCm * objectDistanceDCm) / (objectDistanceDCm - focalLengthCm);
      imageDistanceDPrimeCm = Number(dPrime.toFixed(2));
      linearMagnification = Number((-(dPrime / objectDistanceDCm)).toFixed(2));
      imageType = dPrime > 0 ? 'real' : 'virtual';

      if (imageType === 'real') {
        // Hàm trải điểm quang học Gauss PSF (Point Spread Function) liên tục cho ảnh thật trên màn hứng:
        const screenDistanceCm = Number(state.screenDistanceCm ?? 20.0);
        const deltaScreen = screenDistanceCm - dPrime;
        const sigmaFocusCm = 0.75;
        sharpnessRatio = Math.max(0.0, Math.exp(-(deltaScreen * deltaScreen) / (2.0 * sigmaFocusCm * sigmaFocusCm)));
        if (Math.abs(deltaScreen) <= 0.4) {
          isSharpFocus = true;
        }
      } else {
        // Ảnh ảo (d' < 0) không thể hứng trên màn ảnh thật
        sharpnessRatio = 0.0;
        isSharpFocus = false;
      }
    }

    // Tán sắc ánh sáng trắng qua lăng kính / bản bán nguyệt theo phương trình Cauchy
    const isWhiteLight = Boolean(state.isWhiteLight || state.beamMode === 'white' || state.enableDispersion);
    const spectralComponents: SpectralComponent[] = [];

    if (isLightSourceActive && (isWhiteLight || state.beamMode === 'dispersion')) {
      const primaryBands = [
        { name: 'Red', lambda: 656.3, hex: '#ef4444' },
        { name: 'Yellow', lambda: 589.3, hex: '#eab308' },
        { name: 'Green', lambda: 532.0, hex: '#22c55e' },
        { name: 'Cyan', lambda: 486.1, hex: '#06b6d4' },
        { name: 'Violet', lambda: 404.7, hex: '#8b5cf6' },
      ];

      for (const band of primaryBands) {
        const nLambda = OpticsSolver.calculateCauchyRefractionIndex(band.lambda);
        const sinRLambda = (n1 / nLambda) * Math.sin(radI);
        const rDeg = Math.abs(sinRLambda) <= 1.0
          ? (Math.asin(sinRLambda) * 180.0) / Math.PI
          : 0.0;
        const devDeg = Math.abs(incidentAngleDeg - rDeg);
        spectralComponents.push({
          wavelengthNm: band.lambda,
          colorHex: band.hex,
          refractiveIndex: Number(nLambda.toFixed(4)),
          refractionAngleDeg: Number(rDeg.toFixed(2)),
          deviationAngleDeg: Number(devDeg.toFixed(2)),
        });
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
        sharpnessRatio,
        spectralComponents,
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
