/**
 * OPENLAB 3D — METROLOGY & UNCERTAINTY ENGINE
 * Standard: ISO/IEC Guide 98-3 (GUM) - Guide to the Expression of Uncertainty in Measurement
 * Handles least-count quantization, instrument error, temperature drift, and repeatability noise.
 */

import { UncertaintyBudget } from './types';

export interface MetrologySpec {
  leastCount: number; // ĐCNN (e.g. 0.01g, 0.05mm, 0.1N, 0.01V)
  instrumentalError: number; // Sai số dụng cụ (e.g. ±0.02g, ±0.05mm, ±0.05N)
  repeatabilitySigma?: number; // Độ lệch chuẩn lặp lại
  tempDriftCoefPerC?: number; // Hệ số trôi nhiệt độ (/°C)
  unit: string;
}

export class MetrologyEngine {
  /**
   * Làm tròn số đo theo bội số của Độ chia nhỏ nhất (Least Count)
   */
  public static quantizeToLeastCount(value: number, leastCount: number): number {
    if (leastCount <= 0) return value;
    const factor = 1 / leastCount;
    return Math.round(value * factor) / factor;
  }

  /**
   * Tạo nhiễu lặp lại ngẫu nhiên giả lập với hạt giống cố định (Deterministic pseudo-random Gaussian noise)
   */
  public static pseudoGaussianNoise(seed: number = 42, sigma: number = 0.01): number {
    // Box-Muller transform with pseudo-random LCG
    const lcg = (s: number) => {
      const a = 1664525;
      const c = 1013904223;
      const m = 4294967296;
      return ((a * s + c) % m) / m;
    };
    const u1 = Math.max(1e-7, lcg(seed));
    const u2 = lcg(seed + 1337);
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * sigma;
  }

  /**
   * Tính toán độ trôi nhiệt độ khi nhiệt độ môi trường lệch khỏi 25°C
   */
  public static calculateThermalDrift(
    nominalValue: number,
    airTemperatureC: number = 25,
    tempDriftCoefPerC: number = 1.5e-5
  ): number {
    const deltaT = airTemperatureC - 25.0;
    return nominalValue * tempDriftCoefPerC * deltaT;
  }

  /**
   * Tính toán ngân sách độ không đảm bảo đo chuẩn và mở rộng (k = 2, p = 95%)
   */
  public static calculateUncertaintyBudget(spec: MetrologySpec): UncertaintyBudget {
    const uB_inst = spec.instrumentalError / Math.sqrt(3); // Phân bố đều
    const uB_res = (spec.leastCount / 2) / Math.sqrt(3);  // Phân bố đều nửa khoảng ĐCNN
    const uA = spec.repeatabilitySigma ?? (spec.leastCount * 0.5);

    // Độ không đảm bảo đo tổng hợp uc
    const uc = Math.sqrt(uA * uA + uB_inst * uB_inst + uB_res * uB_res);
    // Độ không đảm bảo đo mở rộng U với hệ số phủ k = 2 (độ tin cậy 95%)
    const expanded = uc * 2.0;

    return {
      instrumentalError: spec.instrumentalError,
      leastCount: spec.leastCount,
      repeatabilitySigma: uA,
      expandedUncertainty: Number(expanded.toFixed(4)),
      unit: spec.unit,
    };
  }

  /**
   * Định dạng số hiển thị trên màn hình LCD/LED với số chữ số thập phân tương ứng ĐCNN
   */
  public static formatReading(value: number, leastCount: number): string {
    if (leastCount >= 1) return Math.round(value).toString();
    const decimals = Math.max(0, Math.ceil(-Math.log10(leastCount)));
    return value.toFixed(decimals);
  }
}
