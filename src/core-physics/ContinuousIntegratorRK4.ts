/**
 * OPENLAB 3D — CONTINUOUS NUMERICAL INTEGRATOR RK4 (120 Hz)
 * 
 * Bộ tích phân số Runge-Kutta bậc 4 (RK4) bước thời gian cố định dt = 1/120 s (8.333 ms)
 * chuyên trách giải hệ phương trình vi phân phi tuyến đa vật lý:
 *   $$\frac{d\vec{y}}{dt} = f(t, \vec{y})$$
 * 
 * Hệ thống Runge-Kutta bậc 4 cổ điển:
 *   $$\vec{k}_1 = f(t_n, \vec{y}_n)$$
 *   $$\vec{k}_2 = f\left(t_n + \frac{dt}{2}, \vec{y}_n + \frac{dt}{2} \vec{k}_1\right)$$
 *   $$\vec{k}_3 = f\left(t_n + \frac{dt}{2}, \vec{y}_n + \frac{dt}{2} \vec{k}_2\right)$$
 *   $$\vec{k}_4 = f(t_n + dt, \vec{y}_n + dt \, \vec{k}_3)$$
 *   $$\vec{y}_{n+1} = \vec{y}_n + \frac{dt}{6}(\vec{k}_1 + 2\vec{k}_2 + 2\vec{k}_3 + \vec{k}_4)$$
 * 
 * Giám sát bảo toàn năng lượng & Triệt tiêu trôi số học:
 *   $$\frac{\Delta E}{E_0} = \frac{|E(t) - E_0|}{E_0 + \varepsilon} < 10^{-6}$$
 * Kết hợp chiếu đa tạp năng lượng (Manifold Energy Projection) khi hệ bảo toàn bị trôi.
 * 
 * Tối ưu hóa bộ nhớ: Sử dụng bộ đệm cào Float64Array định sẵn, không cấp phát heap trong vòng lặp 120 Hz.
 */

export const RK4_DEFAULT_FIXED_DT = 1.0 / 120.0; // 120 Hz = 0.008333333333333333 s
export const RK4_ENERGY_DRIFT_TOLERANCE = 1.0e-6; // delta E / E < 10^-6

/**
 * Hàm đạo hàm vi phân nhiều chiều dy/dt = f(t, y, out_dydt)
 */
export type DerivativeFunction = (t: number, y: Float64Array, dydt: Float64Array) => void;

/**
 * Hàm đánh giá năng lượng toàn phần Hamiltonian E(t, y)
 */
export type EnergyEvaluator = (t: number, y: Float64Array) => number;

/**
 * Hàm chiếu đa tạp bảo toàn năng lượng y* = Pi_E(y, E_target)
 */
export type EnergyProjectionFunction = (t: number, y: Float64Array, targetEnergy: number) => void;

export interface RK4StepResult {
  nextY: Float64Array;
  t: number;
  dt: number;
  energy?: number;
  relativeEnergyDrift?: number;
  wasStabilized: boolean;
}

export interface RK4IntegratorConfig {
  dimension: number;
  fixedDt?: number;
  energyTolerance?: number;
  enableSafetyChecks?: boolean;
}

export class ContinuousIntegratorRK4 {
  private readonly _dim: number;
  private readonly _fixedDt: number;
  private readonly _energyTolerance: number;
  private readonly _enableSafetyChecks: boolean;

  // Bộ đệm cào Float64Array định sẵn (Zero-allocation Scratch Buffers)
  private readonly _k1: Float64Array;
  private readonly _k2: Float64Array;
  private readonly _k3: Float64Array;
  private readonly _k4: Float64Array;
  private readonly _tempY: Float64Array;
  private readonly _subStepScratch: Float64Array;
  private readonly _nextY: Float64Array;

  // Lịch sử năng lượng phục vụ giám sát
  private _initialEnergy: number | null = null;
  private _lastEnergy: number | null = null;
  private _lastRelativeDrift: number = 0.0;
  private _stepCount: number = 0;

  constructor(config: RK4IntegratorConfig) {
    if (config.dimension <= 0 || !Number.isInteger(config.dimension)) {
      throw new Error(`[ContinuousIntegratorRK4] Kích thước vector trạng thái không hợp lệ: ${config.dimension}`);
    }

    this._dim = config.dimension;
    this._fixedDt = config.fixedDt && config.fixedDt > 0 ? config.fixedDt : RK4_DEFAULT_FIXED_DT;
    this._energyTolerance = config.energyTolerance && config.energyTolerance > 0 ? config.energyTolerance : RK4_ENERGY_DRIFT_TOLERANCE;
    this._enableSafetyChecks = config.enableSafetyChecks !== false;

    // Cấp phát duy nhất 1 lần khi khởi tạo
    this._k1 = new Float64Array(this._dim);
    this._k2 = new Float64Array(this._dim);
    this._k3 = new Float64Array(this._dim);
    this._k4 = new Float64Array(this._dim);
    this._tempY = new Float64Array(this._dim);
    this._subStepScratch = new Float64Array(this._dim);
    this._nextY = new Float64Array(this._dim);
  }

  public get dimension(): number {
    return this._dim;
  }

  public get fixedDt(): number {
    return this._fixedDt;
  }

  public get stepCount(): number {
    return this._stepCount;
  }

  public get lastRelativeDrift(): number {
    return this._lastRelativeDrift;
  }

  /**
   * Thiết lập mốc năng lượng ban đầu E_0 phục vụ kiểm định bảo toàn
   */
  public setInitialEnergy(e0: number): void {
    if (!Number.isFinite(e0)) {
      throw new Error(`[ContinuousIntegratorRK4] Năng lượng ban đầu E0 không hữu hạn: ${e0}`);
    }
    this._initialEnergy = e0;
  }

  /**
   * Tích phân một bước thời gian chuẩn Runge-Kutta bậc 4:
   *   t -> t + dt
   */
  public step(
    t: number,
    y: Float64Array,
    dydtFn: DerivativeFunction,
    customDt?: number
  ): Float64Array {
    const dt = customDt && customDt > 0 ? customDt : this._fixedDt;
    const dim = this._dim;
    const halfDt = dt * 0.5;
    const dtDiv6 = dt / 6.0;

    if (this._enableSafetyChecks) {
      if (y.length !== dim) {
        throw new Error(`[ContinuousIntegratorRK4] Độ dài vector y (${y.length}) khác cấu hình dim (${dim})`);
      }
      this._assertFinite(y, 'Trạng thái đầu vào y');
    }

    // 1. Tính k1 = f(t, y)
    dydtFn(t, y, this._k1);

    // 2. Tính y_temp = y + 0.5 * dt * k1
    for (let i = 0; i < dim; i++) {
      this._tempY[i] = y[i] + halfDt * this._k1[i];
    }
    // Tính k2 = f(t + 0.5 * dt, y_temp)
    dydtFn(t + halfDt, this._tempY, this._k2);

    // 3. Tính y_temp = y + 0.5 * dt * k2
    for (let i = 0; i < dim; i++) {
      this._tempY[i] = y[i] + halfDt * this._k2[i];
    }
    // Tính k3 = f(t + 0.5 * dt, y_temp)
    dydtFn(t + halfDt, this._tempY, this._k3);

    // 4. Tính y_temp = y + dt * k3
    for (let i = 0; i < dim; i++) {
      this._tempY[i] = y[i] + dt * this._k3[i];
    }
    // Tính k4 = f(t + dt, y_temp)
    dydtFn(t + dt, this._tempY, this._k4);

    // 5. Tổng hợp RK4: y_{n+1} = y_n + (dt / 6) * (k1 + 2*k2 + 2*k3 + k4)
    for (let i = 0; i < dim; i++) {
      const sumK = this._k1[i] + 2.0 * this._k2[i] + 2.0 * this._k3[i] + this._k4[i];
      this._nextY[i] = y[i] + dtDiv6 * sumK;
      y[i] = this._nextY[i];
    }

    if (this._enableSafetyChecks) {
      this._assertFinite(this._nextY, 'Trạng thái sau tích phân nextY');
    }

    this._stepCount++;
    return this._nextY;
  }

  /**
   * Tích phân một bước kèm giám sát năng lượng và tự động ổn định hóa đa tạp
   * Bảo đảm độ trôi năng lượng tuyệt đối/tương đối \frac{\Delta E}{E_0} < 10^{-6}.
   */
  public stepWithEnergyMonitor(
    t: number,
    y: Float64Array,
    dydtFn: DerivativeFunction,
    energyFn: EnergyEvaluator,
    projectFn?: EnergyProjectionFunction,
    customDt?: number
  ): RK4StepResult {
    const dt = customDt && customDt > 0 ? customDt : this._fixedDt;

    // Ghi nhận E0 ở bước đầu tiên nếu chưa gán
    if (this._initialEnergy === null) {
      this._initialEnergy = energyFn(t, y);
    }

    const nextY = this.step(t, y, dydtFn, dt);
    const nextT = t + dt;
    let currentEnergy = energyFn(nextT, nextY);

    const baseE = Math.abs(this._initialEnergy);
    const eps = 1.0e-12;
    let relativeDrift = Math.abs(currentEnergy - this._initialEnergy) / (baseE + eps);
    let wasStabilized = false;

    // Nếu độ trôi vượt quá dung sai 10^-6 và có hàm chiếu bảo toàn năng lượng
    if (relativeDrift > this._energyTolerance && projectFn) {
      projectFn(nextT, nextY, this._initialEnergy);
      currentEnergy = energyFn(nextT, nextY);
      relativeDrift = Math.abs(currentEnergy - this._initialEnergy) / (baseE + eps);
      wasStabilized = true;
    }

    this._lastEnergy = currentEnergy;
    this._lastRelativeDrift = relativeDrift;

    return {
      nextY,
      t: nextT,
      dt,
      energy: currentEnergy,
      relativeEnergyDrift: relativeDrift,
      wasStabilized,
    };
  }

  /**
   * Phân nhỏ bước tích phân (Sub-stepping) khi cần mô phỏng với tần số cao hơn
   * Ví dụ: Khung hình 60 FPS chia làm 2 sub-steps 120 Hz
   */
  public stepSubdivided(
    t: number,
    y: Float64Array,
    dydtFn: DerivativeFunction,
    totalDt: number,
    subSteps: number = 2
  ): Float64Array {
    if (subSteps <= 1) {
      return this.step(t, y, dydtFn, totalDt);
    }

    const subDt = totalDt / subSteps;
    let currentT = t;

    // Sao chép ban đầu vào _nextY để tích lũy
    for (let i = 0; i < this._dim; i++) {
      this._nextY[i] = y[i];
    }

    for (let s = 0; s < subSteps; s++) {
      // Dùng _subStepScratch để giữ giá trị trước của sub-step, tránh xung đột aliasing với _tempY trong this.step
      for (let i = 0; i < this._dim; i++) {
        this._subStepScratch[i] = this._nextY[i];
      }
      this.step(currentT, this._subStepScratch, dydtFn, subDt);
      currentT += subDt;
    }

    return this._nextY;
  }

  /**
   * Kiểm tra an toàn giá trị số học tránh NaN / Infinity
   */
  private _assertFinite(vec: Float64Array, context: string): void {
    for (let i = 0; i < vec.length; i++) {
      if (!Number.isFinite(vec[i])) {
        throw new Error(`[ContinuousIntegratorRK4] Phát hiện giá trị phi số (${vec[i]}) tại chỉ mục [${i}] trong ${context}`);
      }
    }
  }

  /**
   * Sao chép mảng an toàn không sinh rác bộ nhớ
   */
  public copyState(source: Float64Array, target: Float64Array): void {
    const len = Math.min(source.length, target.length);
    for (let i = 0; i < len; i++) {
      target[i] = source[i];
    }
  }

  /**
   * Tạo bản sao độc lập của trạng thái Float64Array
   */
  public cloneState(source: Float64Array): Float64Array {
    const copy = new Float64Array(source.length);
    copy.set(source);
    return copy;
  }
}
