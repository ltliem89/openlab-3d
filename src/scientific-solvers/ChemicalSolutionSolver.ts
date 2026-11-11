/**
 * OPENLAB 3D — CHEMICAL SOLUTION & IONIC EQUILIBRIUM SCIENTIFIC SOLVER
 * ====================================================================
 * Giải thuật Toán - Hóa học liên tục tuân thủ các định luật cơ bản:
 * 1. Định luật Bảo toàn Khối lượng khi hòa tan: $m_{\text{dd}} = m_{\text{dm}} + m_{\text{ct\_tan}}$
 * 2. Đường cong độ tan theo nhiệt độ: $S(T) = S_0 + k_S (T - 20)$
 * 3. Nồng độ phần trăm: $C\% = \frac{m_{\text{ct\_tan}}}{m_{\text{dd}}} \times 100\%$
 * 4. Nồng độ mol: $C_M = \frac{n}{V} = \frac{m / M}{V_{\text{L}}}$
 * 5. Khối lượng riêng thực nghiệm dung dịch nước: $\rho(C) = \rho_{\text{nuoc}} \times (1 + \beta_C \cdot C\%)$
 * 6. Thang đo pH Sorensen & Cân bằng ion nước: $[H^+][OH^-] = 10^{-14}$, $pH = -\log_{10}[H^+]$
 * 7. Quang phổ màu chỉ thị pH vạn năng & Giấy quỳ tím chuẩn SGK KHTN 8.
 */

import { SolverInput, SolverResult } from './types';
import { MetrologyEngine } from './MetrologyEngine';

export interface ChemicalSolutionDerivedOutputs {
  // 1. Hòa tan & Nồng độ
  soluteType: 'nacl' | 'sugar' | 'cuso4' | 'caco3' | 'custom';
  waterMassG: number;
  soluteAddedG: number;
  solubilityLimitGPer100GWater: number;
  maxDissolvableG: number;
  actualDissolvedG: number;
  precipitateG: number;
  isSaturated: boolean;
  solutionMassG: number;
  massPercentageCPercent: number;
  molarityCM: number;
  solutionDensityGPerMl: number;
  solutionVolumeMl: number;

  // 2. Cân bằng Acid - Base & Thang đo pH
  sampleKind: 'water' | 'hcl' | 'naoh' | 'ch3cooh' | 'lemon' | 'soap' | 'limewater' | 'custom';
  hydrogenIonConcentrationM: number;
  hydroxideIonConcentrationM: number;
  measuredPH: number;
  phClassificationVi: 'acid_strong' | 'acid_weak' | 'neutral' | 'base_weak' | 'base_strong';
  litmusPaperColorVi: 'red' | 'purple' | 'blue';
  universalIndicatorHex: string;
  digitalPHMeterDisplay: string;
  isElectrodeSettled: boolean;

  // 3. Giải trình sư phạm & Truy xuất nguồn gốc
  reasonVi: string;
}

export class ChemicalSolutionSolver {
  public static readonly SOLVER_ID = 'CHEMICAL-SOLUTION-SOLVER-V1';
  public static readonly VERSION = '1.0.0';

  /**
   * Tính toán độ tan bão hòa S (g / 100g nước) theo nhiệt độ T (°C)
   */
  public static calculateSolubility(solute: string, tempC: number = 25.0): number {
    const t = Math.max(0.0, Math.min(100.0, tempC));
    switch (solute.toLowerCase()) {
      case 'nacl':
      case 'salt':
        // NaCl: 35.7g ở 0°C, 36.0g ở 20°C, 39.1g ở 100°C
        return 36.0 + 0.038 * (t - 20.0);
      case 'sugar':
      case 'sucrose':
        // Đường ăn C12H22O11: 204g ở 20°C, tan cực mạnh khi đun nóng
        return 204.0 + 1.85 * (t - 20.0);
      case 'cuso4':
        // CuSO4 khan: ~20.7g ở 20°C, 75g ở 100°C
        return 20.7 + 0.68 * (t - 20.0);
      case 'caco3':
        // Đá vôi kết tủa hầu như không tan
        return 0.0013;
      default:
        return 36.0;
    }
  }

  /**
   * Khối lượng mol phân tử M (g/mol)
   */
  public static getMolarMass(solute: string): number {
    switch (solute.toLowerCase()) {
      case 'nacl':
      case 'salt':
        return 58.44; // Na (23) + Cl (35.45)
      case 'sugar':
      case 'sucrose':
        return 342.3; // C12H22O11
      case 'cuso4':
        return 159.6; // Cu (64) + S (32) + O4 (64)
      case 'caco3':
        return 100.09; // Ca (40.08) + C (12.01) + O3 (48.00)
      case 'hcl':
        return 36.46;
      case 'naoh':
        return 40.0;
      case 'ch3cooh':
        return 60.05;
      default:
        return 58.44;
    }
  }

  /**
   * Ánh xạ giá trị pH sang mã màu HEX của Giấy chỉ thị pH Vạn năng
   */
  public static getUniversalIndicatorHex(ph: number): string {
    const clamped = Math.max(0.0, Math.min(14.0, ph));
    if (clamped <= 1.0) return '#ef4444'; // Đỏ tươi
    if (clamped <= 3.0) return '#f87171'; // Đỏ nhạt
    if (clamped <= 4.5) return '#fb923c'; // Cam đỏ
    if (clamped <= 5.5) return '#f59e0b'; // Vàng cam
    if (clamped <= 6.5) return '#eab308'; // Vàng chanh
    if (clamped <= 7.5) return '#22c55e'; // Xanh lục trung tính
    if (clamped <= 8.5) return '#06b6d4'; // Xanh lơ nhạt
    if (clamped <= 9.5) return '#0284c7'; // Lam biển
    if (clamped <= 11.0) return '#2563eb'; // Xanh dương đậm
    if (clamped <= 12.5) return '#7c3aed'; // Tím
    return '#581c87'; // Tím sẫm
  }

  /**
   * Giải toàn diện tương tác Hóa học - Dung dịch - Cân bằng ion
   */
  public static solve(input: SolverInput): SolverResult<ChemicalSolutionDerivedOutputs> {
    const { state, environment } = input;
    const warnings: string[] = [];
    const errors: string[] = [];

    const tempC = Number(state.temperatureC ?? environment?.airTemperatureC ?? 25.0);

    // ========================================================
    // 1. HÒA TAN CHẤT TAN & NỒNG ĐỘ DUNG DỊCH (SGK KHTN 8 BÀI 6)
    // ========================================================
    const soluteType = (state.soluteType ?? state.solute ?? 'nacl').toLowerCase();
    const waterMassG = Math.max(0.0, Number(state.waterMassG ?? state.liquidVolumeMl ?? 100.0));
    const soluteAddedG = Math.max(0.0, Number(state.soluteAddedG ?? state.saltMassG ?? 15.0));

    const S = ChemicalSolutionSolver.calculateSolubility(soluteType, tempC);
    const maxDissolvableG = (S / 100.0) * waterMassG;
    const actualDissolvedG = Math.min(soluteAddedG, maxDissolvableG);
    const precipitateG = Math.max(0.0, soluteAddedG - maxDissolvableG);
    const isSaturated = soluteAddedG >= maxDissolvableG - 1e-4;

    const solutionMassG = waterMassG + actualDissolvedG;
    const massPercentageCPercent = solutionMassG > 0
      ? (actualDissolvedG / solutionMassG) * 100.0
      : 0.0;

    // Khối lượng riêng dung dịch tăng dần theo nồng độ (thực nghiệm nước muối: +0.007 g/mL cho mỗi 1% C%)
    const densityBeta = soluteType === 'sugar' ? 0.004 : 0.007;
    const solutionDensityGPerMl = solutionMassG > 0
      ? Math.max(1.0, 1.0 + densityBeta * massPercentageCPercent)
      : 1.0;
    const solutionVolumeMl = solutionMassG / solutionDensityGPerMl;

    const M = ChemicalSolutionSolver.getMolarMass(soluteType);
    const moles = actualDissolvedG / M;
    const molarityCM = solutionVolumeMl > 0 ? moles / (solutionVolumeMl * 1e-3) : 0.0;

    if (isSaturated && precipitateG > 0.05) {
      warnings.push(`SOLUTION_SATURATED_PRECIPITATE: Đã đạt bão hòa ở ${tempC.toFixed(1)}°C, còn ${precipitateG.toFixed(2)} g chất tan chưa tan lắng ở đáy cốc`);
    }

    // ========================================================
    // 2. CÂN BẰNG ACID - BASE & THANG ĐO pH (SGK KHTN 8 BÀI 10)
    // ========================================================
    const sampleKind = (state.sampleKind ?? state.solutionKind ?? 'water').toLowerCase();
    let hydrogenIonM = 1.0e-7;

    if (typeof state.hydrogenIonM === 'number' && state.hydrogenIonM > 0) {
      hydrogenIonM = state.hydrogenIonM;
    } else if (typeof state.phSetting === 'number') {
      hydrogenIonM = Math.pow(10, -Math.max(0.0, Math.min(14.0, state.phSetting)));
    } else {
      switch (sampleKind) {
        case 'hcl': {
          const cM = Math.max(1e-5, Number(state.concentrationM ?? 0.10));
          hydrogenIonM = cM; // HCl điện li mạnh hoàn toàn
          break;
        }
        case 'naoh': {
          const cM = Math.max(1e-5, Number(state.concentrationM ?? 0.10));
          // [OH-] = cM -> [H+] = 10^-14 / [OH-]
          hydrogenIonM = 1.0e-14 / cM;
          break;
        }
        case 'ch3cooh':
        case 'vinegar': {
          const cM = Math.max(1e-5, Number(state.concentrationM ?? 0.10));
          const Ka = 1.75e-5;
          // [H+] = sqrt(Ka * C)
          hydrogenIonM = Math.sqrt(Ka * cM);
          break;
        }
        case 'lemon':
          hydrogenIonM = 3.98e-3; // pH ~ 2.4
          break;
        case 'soap':
          hydrogenIonM = 3.16e-10; // pH ~ 9.5
          break;
        case 'limewater':
          hydrogenIonM = 1.0e-12; // pH ~ 12.0
          break;
        case 'water':
        default:
          hydrogenIonM = 1.0e-7; // Nước tinh khiết pH = 7.0
          break;
      }
    }

    const calculatedPH = -Math.log10(Math.max(1e-15, hydrogenIonM));
    const hydroxideIonM = 1.0e-14 / Math.max(1e-15, hydrogenIonM);

    let phClassificationVi: ChemicalSolutionDerivedOutputs['phClassificationVi'] = 'neutral';
    let litmusPaperColorVi: ChemicalSolutionDerivedOutputs['litmusPaperColorVi'] = 'purple';

    if (calculatedPH < 3.5) {
      phClassificationVi = 'acid_strong';
      litmusPaperColorVi = 'red';
    } else if (calculatedPH < 6.8) {
      phClassificationVi = 'acid_weak';
      litmusPaperColorVi = 'red';
    } else if (calculatedPH <= 7.2) {
      phClassificationVi = 'neutral';
      litmusPaperColorVi = 'purple';
    } else if (calculatedPH <= 11.0) {
      phClassificationVi = 'base_weak';
      litmusPaperColorVi = 'blue';
    } else {
      phClassificationVi = 'base_strong';
      litmusPaperColorVi = 'blue';
    }

    const universalIndicatorHex = ChemicalSolutionSolver.getUniversalIndicatorHex(calculatedPH);

    // Đáp ứng động học của bút đo pH điện tử (trôi ổn định điện cực thủy tinh ~ 1.5s)
    const elapsedElectrodeSec = Math.max(0.0, Number(state.elapsedElectrodeSec ?? 3.0));
    const tauElectrode = 0.5;
    const responseFactor = Math.min(1.0, 1.0 - Math.exp(-elapsedElectrodeSec / tauElectrode));
    const displayPH = calculatedPH * responseFactor + (1.0 - responseFactor) * 7.0;
    const isElectrodeSettled = elapsedElectrodeSec >= 3.0 * tauElectrode;
    const digitalPHMeterDisplay = `${displayPH.toFixed(2)}`;

    // ========================================================
    // 3. DIỄN GIẢI SƯ PHẠM CHUẨN
    // ========================================================
    let reasonVi = '';
    if (soluteAddedG > 0) {
      reasonVi = `Pha ${soluteAddedG.toFixed(1)}g ${soluteType.toUpperCase()} vào ${waterMassG.toFixed(1)}g nước (${tempC.toFixed(1)}°C) -> Đã hòa tan ${actualDissolvedG.toFixed(1)}g, C% = ${massPercentageCPercent.toFixed(2)}%, CM = ${molarityCM.toFixed(2)} M. ${isSaturated ? `Dung dịch bão hòa (Độ tan S = ${S.toFixed(1)}g/100g H2O).` : 'Dung dịch chưa bão hòa.'}`;
    } else {
      reasonVi = `Mẫu dung dịch: ${sampleKind.toUpperCase()} -> pH = ${calculatedPH.toFixed(2)} (${phClassificationVi}), giấy quỳ chuyển màu ${litmusPaperColorVi === 'red' ? 'Đỏ' : litmusPaperColorVi === 'blue' ? 'Xanh' : 'Tím'}.`;
    }

    const uncertainty = MetrologyEngine.calculateUncertaintyBudget({
      leastCount: 0.01,
      instrumentalError: 0.02,
      repeatabilitySigma: 0.01,
      unit: 'pH',
    });

    return {
      derived: {
        soluteType: soluteType as any,
        waterMassG,
        soluteAddedG,
        solubilityLimitGPer100GWater: S,
        maxDissolvableG,
        actualDissolvedG,
        precipitateG,
        isSaturated,
        solutionMassG,
        massPercentageCPercent,
        molarityCM,
        solutionDensityGPerMl,
        solutionVolumeMl,
        sampleKind: sampleKind as any,
        hydrogenIonConcentrationM: hydrogenIonM,
        hydroxideIonConcentrationM: hydroxideIonM,
        measuredPH: calculatedPH,
        phClassificationVi,
        litmusPaperColorVi,
        universalIndicatorHex,
        digitalPHMeterDisplay,
        isElectrodeSettled,
        reasonVi,
      },
      valid: errors.length === 0,
      warnings,
      errors,
      uncertainty,
      provenance: {
        solverId: ChemicalSolutionSolver.SOLVER_ID,
        version: ChemicalSolutionSolver.VERSION,
        lawsApplied: [
          'Định luật bảo toàn khối lượng khi hòa tan',
          'Phương trình độ tan phụ thuộc nhiệt độ S(T)',
          'Định nghĩa nồng độ phần trăm C% và nồng độ mol CM',
          'Cân bằng ion trong dung dịch nước [H+][OH-] = 10^-14',
          'Thang đo pH Sorensen và đặc tuyến chỉ thị màu',
        ],
        referenceFormulasLatex: [
          'C\\% = \\frac{m_{\\text{ct}}}{m_{\\text{dd}}} \\times 100\\%',
          'C_M = \\frac{n}{V} = \\frac{m / M}{V}',
          '\\text{pH} = -\\log_{10}[H^+]',
          '[H^+][OH^-] = 1.0 \\times 10^{-14}',
        ],
        computationTimestamp: Date.now(),
      },
    };
  }
}
