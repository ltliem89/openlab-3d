/**
 * OPENLAB 3D — ISO/IEC GUIDE 98-3 (GUM) & CIRCULAR 38/2021/TT-BGDĐT METROLOGY ENGINE
 * 
 * Động cơ đo lường học và lan truyền sai số khoa học đạt chuẩn quốc tế:
 * 
 * 1. THUẬT TOÁN WELFORD TRỰC TUYẾN (WELFORD ONLINE ONE-PASS ALGORITHM):
 *    - Loại bỏ hoàn toàn thảm họa triệt tiêu số học (Catastrophic Cancellation)
 *      khi đo lường các đại lượng có độ lệch rất nhỏ:
 *      $$M_{2,k} = M_{2,k-1} + (x_k - \bar{x}_{k-1})(x_k - \bar{x}_k)$$
 *      $$\bar{x}_k = \bar{x}_{k-1} + \frac{x_k - \bar{x}_{k-1}}{k}$$
 *      $$s^2 = \frac{M_{2,n}}{n - 1} \quad (n \ge 2), \quad u_A = \frac{s}{\sqrt{n}}$$
 * 
 * 2. SAI SỐ LOẠI B THEO ĐCNN & QUY CHUẨN THÔNG TƯ 38/2021/TT-BGDĐT:
 *    - Sai số do độ phân giải (Độ chia nhỏ nhất ĐCNN $\Delta_{\text{res}}$):
 *      $$u_{B,\text{res}} = \frac{\Delta_{\text{res}} / 2}{\sqrt{3}} = \frac{\Delta_{\text{res}}}{2\sqrt{3}}$$
 *    - Sai số dụng cụ của nhà sản xuất $\Delta_{\text{inst}}$:
 *      $$u_{B,\text{inst}} = \frac{\Delta_{\text{inst}}}{\sqrt{3}}$$
 *    - Sai số chuẩn tổng hợp (Combined Standard Uncertainty):
 *      $$u_c = \sqrt{u_A^2 + u_{B,\text{res}}^2 + u_{B,\text{inst}}^2}$$
 *    - Độ không đảm bảo đo mở rộng với hệ số phủ $k = 2$ (độ tin cậy 95.45%):
 *      $$U_{95\%} = 2 \cdot u_c$$
 *    - Bậc tự do hiệu dụng Welch-Satterthwaite (chống chia cho 0):
 *      $$\nu_{\text{eff}} = \frac{u_c^4}{\frac{u_A^4}{\max(1, n - 1)} + \varepsilon}$$
 * 
 * 3. ĐÁP ỨNG ĐỘNG HỌC GIẢM CHẤN LOADCELL CÂN ĐIỆN TỬ ($\tau = 0.8\text{ s}$):
 *    - Phương trình vi phân dao động tắt dần bậc 2:
 *      $$\ddot{m} + 2 \zeta \omega_n \dot{m} + \omega_n^2 m = \omega_n^2 m_{\text{thuc}}$$
 *      với hằng số thời gian $\tau = 0.8\text{ s}$, hệ số giảm chấn $\zeta = 0.68$, $\omega_n = \frac{1}{\tau \zeta} \approx 1.838\text{ rad/s}$.
 * 
 * 4. SAI SỐ THỊ SAI GÓC NHÌN ỐNG ĐONG CHIA ĐỘ ($\Delta V_{\text{parallax}}$):
 *    - Khi mắt quan sát lệch một góc $\theta_{\text{view}}$ so với phương ngang tiếp tuyến đáy mặt cong Meniscus:
 *      $$\Delta h_{\text{parallax}} = R_{\text{trong}} \cdot \tan(\theta_{\text{view}})$$
 *      $$\Delta V_{\text{parallax}} = S_{\text{tiet dien}} \cdot \Delta h_{\text{parallax}} = \pi R_{\text{trong}}^3 \cdot \tan(\theta_{\text{view}})$$
 */

// ==========================================
// 1. CẤU TRÚC DỮ LIỆU ĐO LƯỜNG VÀ KẾT QUẢ GUM
// ==========================================

export interface UncertaintyBudgetResult {
  sampleCountN: number;
  mean: number;
  varianceSample: number;
  stdDevSample: number;
  uA: number; // Sai số loại A
  uB_resolution: number; // Sai số loại B do ĐCNN
  uB_instrument: number; // Sai số loại B do dụng cụ
  uB_combined: number; // Tổng hợp loại B
  uCombined: number; // uc
  expandedU95: number; // U95 = 2 * uc
  effectiveDegreesOfFreedom: number; // nu_eff
  coverageFactorK: number; // k = 2
  leastCount: number;
  instrumentalError: number;
  unit: string;
  latexResult: string;
  formattedDisplay: string;
}

export interface InstrumentMetrologySpec {
  leastCount: number; // ĐCNN
  instrumentalError: number; // Sai số dụng cụ
  unit: string;
  symbol?: string;
  equipmentCodeTT38?: string;
}

/**
 * Danh mục thông số đo lường tối thiểu các thiết bị theo Thông tư 38/2021/TT-BGDĐT
 */
export const TT38_METROLOGY_CATALOG: Record<string, InstrumentMetrologySpec> = {
  // 1. Cân điện tử hiện số 200g / 0.01g
  DIGITAL_BALANCE_200G: {
    leastCount: 0.01,
    instrumentalError: 0.02,
    unit: 'g',
    symbol: 'm',
    equipmentCodeTT38: 'TB-KHTN-01',
  },
  // 2. Ống đong chia độ 100mL thủy tinh Borosilicate
  GRADUATED_CYLINDER_100ML: {
    leastCount: 1.0,
    instrumentalError: 0.5,
    unit: 'mL',
    symbol: 'V',
    equipmentCodeTT38: 'TB-KHTN-02',
  },
  // 3. Vôn kế một chiều DC 0-15V
  DC_VOLTMETER_15V: {
    leastCount: 0.1,
    instrumentalError: 0.1,
    unit: 'V',
    symbol: 'U',
    equipmentCodeTT38: 'TB-VL-03',
  },
  // 4. Ampe kế một chiều DC 0-3A
  DC_AMMETER_3A: {
    leastCount: 0.02,
    instrumentalError: 0.02,
    unit: 'A',
    symbol: 'I',
    equipmentCodeTT38: 'TB-VL-04',
  },
  // 5. Lực kế lò xo 5N
  SPRING_DYNAMOMETER_5N: {
    leastCount: 0.1,
    instrumentalError: 0.1,
    unit: 'N',
    symbol: 'F',
    equipmentCodeTT38: 'TB-VL-05',
  },
  // 6. Thước cặp cơ khí 150mm (du xích chuẩn 0.02mm)
  VERNIER_CALIPER_150MM: {
    leastCount: 0.02,
    instrumentalError: 0.02,
    unit: 'mm',
    symbol: 'd',
    equipmentCodeTT38: 'TB-VL-06',
  },
  // 7. Nhiệt kế thủy ngân / rượu -10..110°C
  LAB_THERMOMETER_110C: {
    leastCount: 1.0,
    instrumentalError: 0.5,
    unit: '°C',
    symbol: 'T',
    equipmentCodeTT38: 'TB-KHTN-07',
  },
  // 8. Thước thẳng 300mm / 1mm
  STEEL_RULER_300MM: {
    leastCount: 1.0,
    instrumentalError: 0.5,
    unit: 'mm',
    symbol: 'l',
    equipmentCodeTT38: 'TB-KHTN-08',
  },
  // 9. Panme đo ngoài 0-25mm / 0.01mm
  MICROMETER_25MM: {
    leastCount: 0.01,
    instrumentalError: 0.01,
    unit: 'mm',
    symbol: 'd',
    equipmentCodeTT38: 'TB-VL-09',
  },
  // 10. Đồng hồ vạn năng hiện số DMM
  DIGITAL_MULTIMETER_DMM: {
    leastCount: 0.01,
    instrumentalError: 0.02,
    unit: 'V',
    symbol: 'U',
    equipmentCodeTT38: 'TB-VL-10',
  },
  // 11. Đồng hồ bấm giây hiện số 0.01s
  DIGITAL_STOPWATCH_001S: {
    leastCount: 0.01,
    instrumentalError: 0.02,
    unit: 's',
    symbol: 't',
    equipmentCodeTT38: 'TB-KHTN-11',
  },
};

// ==========================================
// 2. THUẬT TOÁN WELFORD TRỰC TUYẾN (BẢO VỆ TRIỆT TIÊU SỐ)
// ==========================================

export class WelfordAccumulator {
  private _n: number = 0;
  private _mean: number = 0.0;
  private _M2: number = 0.0;
  private _min: number = Number.POSITIVE_INFINITY;
  private _max: number = Number.NEGATIVE_INFINITY;

  /**
   * Đẩy một mẫu đo lường vào bộ tích lũy trực tuyến: O(1) time, O(1) space
   */
  public update(x: number): void {
    if (!Number.isFinite(x)) {
      throw new Error(`[WelfordAccumulator] Giá trị mẫu đo không hữu hạn: ${x}`);
    }

    this._n++;
    const delta = x - this._mean;
    this._mean += delta / this._n;
    const delta2 = x - this._mean;
    this._M2 += delta * delta2;

    if (x < this._min) this._min = x;
    if (x > this._max) this._max = x;
  }

  /**
   * Nạp nhanh một mảng mẫu đo lường
   */
  public updateBatch(readings: number[]): void {
    for (const val of readings) {
      this.update(val);
    }
  }

  public get count(): number {
    return this._n;
  }

  public get mean(): number {
    return this._mean;
  }

  public get min(): number {
    return this._n > 0 ? this._min : 0.0;
  }

  public get max(): number {
    return this._n > 0 ? this._max : 0.0;
  }

  /**
   * Phương sai mẫu s^2 = M2 / (n - 1)
   */
  public getSampleVariance(): number {
    if (this._n < 2) return 0.0;
    const s2 = this._M2 / (this._n - 1);
    // Bảo đảm không bao giờ âm do sai số dấu phẩy động
    return Math.max(0.0, s2);
  }

  /**
   * Độ lệch chuẩn mẫu s = sqrt(s^2)
   */
  public getSampleStdDev(): number {
    return Math.sqrt(this.getSampleVariance());
  }

  /**
   * Sai số chuẩn loại A u_A = s / sqrt(n)
   */
  public getStandardError(): number {
    if (this._n < 2) return 0.0;
    return this.getSampleStdDev() / Math.sqrt(this._n);
  }

  /**
   * Đặt lại bộ tích lũy
   */
  public reset(): void {
    this._n = 0;
    this._mean = 0.0;
    this._M2 = 0.0;
    this._min = Number.POSITIVE_INFINITY;
    this._max = Number.NEGATIVE_INFINITY;
  }
}

// ==========================================
// 3. ĐỘNG CƠ TÍNH TOÁN SAI SỐ CHUẨN ISO GUM
// ==========================================

export class IsoGUMMetrologyEngine {
  /**
   * Tính toán ngân sách độ không đảm bảo đo hoàn chỉnh theo ISO GUM & Thông tư 38
   */
  public static evaluateMeasurement(
    readings: number[],
    spec: InstrumentMetrologySpec
  ): UncertaintyBudgetResult {
    if (!readings || readings.length === 0) {
      throw new Error('[IsoGUMMetrologyEngine] Mảng số liệu quan sát rỗng');
    }

    // 1. Tính toán Loại A qua Welford
    const welford = new WelfordAccumulator();
    welford.updateBatch(readings);

    const n = welford.count;
    const mean = welford.mean;
    const s2 = welford.getSampleVariance();
    const s = welford.getSampleStdDev();
    const uA = welford.getStandardError();

    // 2. Tính toán Loại B theo Thông tư 38
    // Phân bố đều nửa khoảng chia ĐCNN: uB_res = (leastCount / 2) / sqrt(3)
    const uB_res = (spec.leastCount * 0.5) / Math.sqrt(3.0);
    // Phân bố đều giới hạn sai số dụng cụ: uB_inst = instrumentalError / sqrt(3)
    const uB_inst = spec.instrumentalError / Math.sqrt(3.0);
    // Tổng hợp Loại B
    const uB_comb = Math.sqrt(uB_res * uB_res + uB_inst * uB_inst);

    // 3. Độ không đảm bảo đo chuẩn tổng hợp uc
    const uc = Math.sqrt(uA * uA + uB_comb * uB_comb);

    // 4. Độ không đảm bảo đo mở rộng U_95% với k = 2
    const coverageK = 2.0;
    const expandedU95 = coverageK * uc;

    // 5. Bậc tự do hiệu dụng Welch-Satterthwaite (an toàn chống chia 0)
    let nu_eff = 1000.0; // Mặc định vô cùng lớn khi Type B chiếm ưu thế
    if (uA > 1e-12 && n >= 2) {
      const denom = Math.pow(uA, 4) / (n - 1);
      nu_eff = Math.min(10000.0, Math.pow(uc, 4) / Math.max(1e-15, denom));
    }

    // 6. Định dạng hiển thị và LaTeX
    const decimals = IsoGUMMetrologyEngine.getDisplayDecimals(spec.leastCount);
    const formattedMean = mean.toFixed(decimals);
    const formattedU = expandedU95.toFixed(decimals);
    const safeUnit = IsoGUMMetrologyEngine.sanitizeLatex(spec.unit);
    const safeSymbol = IsoGUMMetrologyEngine.sanitizeLatex(spec.symbol || 'x');

    const latexResult = `\\bar{${safeSymbol}} \\pm U_{95\\%} = ${formattedMean} \\pm ${formattedU}\\text{ ${safeUnit}} \\quad (k=2)`;
    const formattedDisplay = `${formattedMean} ± ${formattedU} ${spec.unit}`;

    return {
      sampleCountN: n,
      mean: Number(mean.toFixed(decimals + 2)),
      varianceSample: s2,
      stdDevSample: s,
      uA,
      uB_resolution: uB_res,
      uB_instrument: uB_inst,
      uB_combined: uB_comb,
      uCombined: uc,
      expandedU95: Number(expandedU95.toFixed(decimals + 2)),
      effectiveDegreesOfFreedom: Math.round(nu_eff),
      coverageFactorK: coverageK,
      leastCount: spec.leastCount,
      instrumentalError: spec.instrumentalError,
      unit: spec.unit,
      latexResult,
      formattedDisplay,
    };
  }

  // ==========================================
  // 4. ĐÁP ỨNG ĐỘNG HỌC LOADCELL CÂN ĐIỆN TỬ
  // ==========================================

  /**
   * Mô phỏng đáp ứng dao động tắt dần bậc 2 của Loadcell cân điện tử:
   * $$m(t) = m_{\text{dich}} \left[ 1 - e^{-\zeta \omega_n t} \left(\cos(\omega_d t) + \frac{\zeta}{\sqrt{1 - \zeta^2}}\sin(\omega_d t)\right) \right]$$
   * với $\tau = 0.8\text{ s}$, $\zeta = 0.68$.
   * 
   * @param targetMassG Khối lượng thực đặt lên đĩa cân (gam)
   * @param elapsedSec Thời gian trôi qua từ khi đặt vật (giây)
   * @param tareG Giá trị trừ bì (gam)
   * @param leastCount ĐCNN hiển thị (mặc định 0.01 g)
   */
  public static calculateLoadcellResponse(
    targetMassG: number,
    elapsedSec: number,
    tareG: number = 0.0,
    leastCount: number = 0.01
  ): {
    indicatedMassG: number;
    netSettledMassG: number;
    settlingRatio: number;
    isSettled: boolean;
    displayString: string;
  } {
    const netTarget = Math.max(0.0, targetMassG - tareG);
    if (netTarget <= 1e-9) {
      return {
        indicatedMassG: 0.0,
        netSettledMassG: 0.0,
        settlingRatio: 1.0,
        isSettled: true,
        displayString: (0.0).toFixed(IsoGUMMetrologyEngine.getDisplayDecimals(leastCount)) + ' g',
      };
    }

    const t = Math.max(0.0, elapsedSec);
    const tau = 0.8; // Hằng số thời gian tiêu chuẩn 0.8s
    const zeta = 0.68; // Hệ số suy giảm dao động
    const omegaN = 1.0 / (tau * zeta); // ~1.838 rad/s
    const omegaD = omegaN * Math.sqrt(1.0 - zeta * zeta); // Tần số dao động tắt dần ~1.348 rad/s

    // Hệ số suy giảm hàm mũ
    const decay = Math.exp(-zeta * omegaN * t);
    const cosTerm = Math.cos(omegaD * t);
    const sinTerm = (zeta / Math.sqrt(1.0 - zeta * zeta)) * Math.sin(omegaD * t);

    // Tỉ lệ đạt trạng thái xác lập
    const responseFactor = Math.max(0.0, 1.0 - decay * (cosTerm + sinTerm));
    const rawIndicated = netTarget * responseFactor;

    // Lượng tử hóa theo ĐCNN
    const quantized = IsoGUMMetrologyEngine.quantizeToLeastCount(rawIndicated, leastCount);
    // Coi như đã ổn định khi t >= tau hoặc độ sai lệch < 0.2%
    const isSettled = t >= tau && Math.abs(quantized - netTarget) <= leastCount + 1e-5;

    const decimals = IsoGUMMetrologyEngine.getDisplayDecimals(leastCount);

    return {
      indicatedMassG: quantized,
      netSettledMassG: netTarget,
      settlingRatio: responseFactor,
      isSettled,
      displayString: `${quantized.toFixed(decimals)} g`,
    };
  }

  // ==========================================
  // 5. SAI SỐ THỊ SAI MENISCUS ỐNG ĐONG
  // ==========================================

  /**
   * Tính toán sai số thị sai thể tích khi mắt không đặt ngang đáy mặt cong Meniscus:
   * $$\Delta V_{\text{parallax}} = \pi R_{\text{trong}}^3 \cdot \tan(\theta_{\text{view}})$$
   * 
   * @param innerRadiusMm Bán kính lòng trong ống đong (mm, ví dụ 13.5 mm cho ống 100 mL)
   * @param viewAngleDeg Góc lệch của tia nhìn so với phương nằm ngang (độ; > 0 khi nhìn từ trên xuống)
   */
  public static calculateParallaxError(
    innerRadiusMm: number = 13.5,
    viewAngleDeg: number = 0.0
  ): {
    deltaHeightMm: number;
    deltaVolumeMl: number;
    guidelineVi: string;
  } {
    // Kẹp góc nhìn trong khoảng [-85°, +85°] để tránh điểm kỳ dị tan(90°) -> Infinity
    const clampedAngleDeg = Math.max(-85.0, Math.min(85.0, viewAngleDeg));
    const angleRad = (clampedAngleDeg * Math.PI) / 180.0;
    // Độ lệch chiều cao biểu kiến trên thành ống
    const deltaHeightMm = innerRadiusMm * Math.tan(angleRad);

    // Tiết diện đáy: S = pi * R^2 (mm^2)
    const crossAreaMm2 = Math.PI * innerRadiusMm * innerRadiusMm;
    // Sai số thể tích: delta V = S * delta h (mm^3 -> mL = cm^3 = 1000 mm^3)
    const deltaVolumeMm3 = crossAreaMm2 * deltaHeightMm;
    const deltaVolumeMl = deltaVolumeMm3 / 1000.0;

    let guidelineVi = '';
    if (Math.abs(viewAngleDeg) < 0.25) {
      guidelineVi = 'Tia nhìn chuẩn xác: Mắt đặt ngang bằng với đáy mặt cong Meniscus, sai số thị sai triệt tiêu (0 mL).';
    } else if (viewAngleDeg > 0) {
      guidelineVi = `Nhìn nghiêng từ trên xuống (+${viewAngleDeg.toFixed(1)}°): Mặt cong bị chiếu cao hơn thực tế, thể tích đọc thừa +${deltaVolumeMl.toFixed(2)} mL.`;
    } else {
      guidelineVi = `Nhìn nghiêng từ dưới lên (${viewAngleDeg.toFixed(1)}°): Mặt cong bị chiếu thấp hơn thực tế, thể tích đọc thiếu ${deltaVolumeMl.toFixed(2)} mL.`;
    }

    return {
      deltaHeightMm: Number(deltaHeightMm.toFixed(3)),
      deltaVolumeMl: Number(deltaVolumeMl.toFixed(3)),
      guidelineVi,
    };
  }

  // ==========================================
  // 6. TIỆN ÍCH LÀM TRÒN VÀ LÀM SẠCH LATEX
  // ==========================================

  public static quantizeToLeastCount(value: number, leastCount: number): number {
    if (leastCount <= 0 || !Number.isFinite(leastCount)) return value;
    const quantized = Math.round((value + Number.EPSILON) / leastCount) * leastCount;
    const decimals = IsoGUMMetrologyEngine.getDisplayDecimals(leastCount);
    return Number(quantized.toFixed(decimals));
  }

  public static getDisplayDecimals(leastCount: number): number {
    if (leastCount >= 1.0) return 0;
    const str = leastCount.toString();
    const dotIdx = str.indexOf('.');
    return dotIdx >= 0 ? str.length - dotIdx - 1 : 0;
  }

  /**
   * Khử độc (sanitize) chuỗi trước khi gắn vào KaTeX/DOM để chống XSS và lỗi ngắt cú pháp
   */
  public static sanitizeLatex(input: string): string {
    if (!input) return '';
    return input
      .replace(/[<>{}\\]/g, '') // Loại bỏ các ký tự điều khiển nguy hiểm
      .trim();
  }
}

