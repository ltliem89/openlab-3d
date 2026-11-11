/**
 * OPENLAB 3D — MULTI-PHYSICS COUPLING BUS (120 Hz)
 * 
 * Trục liên thông nhân quả đa miền vật lý liên tục:
 * 
 * 1. ĐIỆN -> NHIỆT -> THỦY:
 *    - Công suất tỏa nhiệt Joule trên điện trở/dây sấy:
 *      $$P_{\text{Joule}} = I^2 R$$
 *    - Truyền nhiệt vào chất lỏng trong cốc theo định luật Fourier và định luật làm nguội Newton:
 *      $$\dot{Q}_{\text{in}} = \eta \cdot P_{\text{Joule}}$$
 *      $$\dot{Q}_{\text{loss}} = h \cdot S \cdot (T - T_{\text{mt}})$$
 *      $$\dot{Q}_{\text{net}} = \dot{Q}_{\text{in}} - \dot{Q}_{\text{loss}}$$
 *      $$\frac{dT}{dt} = \frac{\dot{Q}_{\text{net}}}{m_{\text{lỏng}} c_{\text{lỏng}} + C_{\text{cốc}}}$$
 *    - Trạng thái sôi và bốc hơi chất lỏng ở nhiệt độ sôi ($T \ge T_{\text{sôi}} = 100^\circ\text{C}$):
 *      $$\frac{dm_{\text{lỏng}}}{dt} = -\frac{\max(0, \dot{Q}_{\text{net}})}{L_{\text{hóa hơi}}}$$
 *      với nhiệt hóa hơi của nước $L = 2.26 \times 10^6\text{ J/kg}$.
 *    - Cột chất lỏng và áp suất thủy tĩnh biến thiên liên tục:
 *      $$V(t) = \frac{m(t)}{\rho(T)}, \quad h(t) = \frac{V(t)}{S_{\text{đáy}}}, \quad p = p_0 + \rho g h(t)$$
 * 
 * 2. TỪ -> ĐIỆN -> CƠ:
 *    - Cảm ứng điện từ Faraday: Nam châm rơi qua ống dây làm biến thiên từ thông:
 *      $$\mathcal{E}_{\text{ind}} = -N \frac{d\Phi}{dt} = -N \left(\frac{\partial B_z}{\partial z} S_{\text{ống}}\right) v$$
 *    - Dòng điện cảm ứng trong mạch cuộn dây:
 *      $$i = \frac{\mathcal{E}_{\text{ind}}}{R_{\text{tổng}}} = -\frac{N}{R_{\text{tổng}}}\frac{d\Phi}{dt}$$
 *    - Lực hãm Lenz-Lorentz hãm chuyển động rơi của nam châm:
 *      $$F_{\text{Lenz}} = -\left(N \frac{\partial B}{\partial z}\right)^2 \frac{v}{R_{\text{tổng}}}$$
 *    - Phương trình động lực học nam châm:
 *      $$m \frac{dv}{dt} = m g + F_{\text{Lenz}} - \gamma_{\text{khí}} v, \quad \frac{dz}{dt} = v$$
 *      đạt vận tốc tới hạn (Terminal Eddy Current Velocity) khi $F_{\text{Lenz}} + m g = 0$.
 * 
 * 3. DÂY TÓC BÓNG ĐÈN PHI TUYẾN THEO NHIỆT ĐỘ & DÒNG XUNG KÍCH (INRUSH CURRENT):
 *    - Điện trở dây tóc vonfram biến thiên phi tuyến theo nhiệt độ:
 *      $$R(T) = R_0 [1 + \alpha(T - T_0) + \beta(T - T_0)^2]$$
 *      với $T_0 = 293.15\text{ K}$, $\alpha = 4.5 \times 10^{-3}\text{ K}^{-1}$, $\beta = 1.0 \times 10^{-6}\text{ K}^{-2}$.
 *    - Khi dây tóc nguội ($T = 293\text{ K}$), $R_{\text{nguội}} = R_0 \approx 1\ \Omega$.
 *    - Dòng xung kích tức thời (Inrush current) vọt cao gấp 10-12 lần dòng danh định khi đóng mạch:
 *      $$I(0) = \frac{U}{R_0 + R_{\text{mạch}}} \gg I_{\text{định mức}}$$
 *    - Phương trình cân bằng nhiệt dây tóc:
 *      $$C_{\text{dây tóc}} \frac{dT}{dt} = I^2 R(T) - \varepsilon \sigma S_{\text{dây tóc}} (T^4 - T_{\text{mt}}^4) - h_{\text{khí}} S (T - T_{\text{mt}})$$
 */

import { ContinuousIntegratorRK4, DerivativeFunction } from './ContinuousIntegratorRK4';

// ==========================================
// 1. CÁC THÔNG SỐ VẬT LÝ VÀ HẰNG SỐ TIÊU CHUẨN
// ==========================================

export const STEFAN_BOLTZMANN_SIGMA = 5.670374419e-8; // W/(m^2 K^4)
export const WATER_LATENT_HEAT_VAPORIZATION_J_KG = 2.26e6; // 2.26 MJ/kg
export const WATER_SPECIFIC_HEAT_J_KG_K = 4184.0; // J/(kg*K)
export const WATER_ROOM_DENSITY_KG_M3 = 998.2; // kg/m3 tại 20°C
export const STANDARD_GRAVITY_M_S2 = 9.80665; // m/s^2

/**
 * Trạng thái của cụm Điện -> Nhiệt -> Thủy
 */
export interface ElectroThermalFluidState {
  // Trạng thái nguồn và điện trở
  supplyVoltageV: number;
  circuitClosed: boolean;
  heaterResistanceOhms: number;
  heaterCurrentAmperes: number;
  heaterPowerWatts: number;
  thermalCouplingEfficiency: number; // 0.0 .. 1.0 (mặc định 0.85)

  // Trạng thái nhiệt & chất lỏng
  liquidMassKg: number;
  liquidVolumeMl: number;
  temperatureC: number;
  vesselThermalCapacityJK: number; // Nhiệt dung cốc thủy tinh/bát sứ
  heatExchangeRateW: number; // Q_net
  isBoiling: boolean;
  evaporatedMassKg: number;
  evaporationRateKgS: number;

  // Thủy tĩnh
  beakerRadiusM: number;
  liquidHeightM: number;
  hydrostaticPressurePa: number;
}

/**
 * Trạng thái của cụm Từ -> Điện -> Cơ (Faraday - Lenz)
 */
export interface FaradayLenzState {
  magnetMassKg: number;
  magnetPositionZM: number; // Tọa độ z dọc trục ống dây
  magnetVelocityMps: number; // Vận tốc v = dz/dt
  magnetAccelerationMps2: number;
  coilTurnsN: number;
  coilRadiusM: number;
  coilHeightM: number;
  coilCenterZM: number; // Vị trí tâm ống dây
  coilResistanceOhms: number;
  loadResistanceOhms: number;
  totalCircuitResistanceOhms: number;

  // Biến cảm ứng điện từ
  magneticFluxWb: number;
  fluxDerivativeWbPerS: number; // dPhi/dt
  inducedEmfVolts: number; // E = -N dPhi/dt
  inducedCurrentAmperes: number;
  lenzBrakingForceNewtons: number; // F_Lenz < 0 khi rơi xuống
  gravityMps2: number;
  isInsideCoil: boolean;
}

/**
 * Trạng thái của Dây tóc bóng đèn phi tuyến (Inrush Current)
 */
export interface FilamentNonlinearState {
  supplyVoltageV: number;
  circuitClosed: boolean;
  coldResistanceOhms: number; // R0 tại T0 = 293.15 K (~1.0 Ohm)
  filamentTemperatureK: number; // T (K)
  filamentResistanceOhms: number; // R(T)
  currentAmperes: number; // I(t)
  powerWatts: number;
  isInrushPhase: boolean; // Dòng xung kích khởi động
  relativeBrightness: number; // 0.0 .. 1.0
  thermalCapacityFilamentJK: number; // C_fil ~ 0.015 J/K
  alphaTempCoef: number; // 4.5e-3 /K
  betaTempCoef: number; // 1.0e-6 /K^2
}

/**
 * Trạng thái tổng hợp thời gian thực của MultiPhysicsCouplingBus
 */
export interface MultiPhysicsBusSnapshot {
  simulationTimeSec: number;
  ambientTemperatureC: number;
  atmosphericPressureKPa: number;
  gravityMps2: number;
  electroThermalFluid: ElectroThermalFluidState;
  faradayLenz: FaradayLenzState;
  filament: FilamentNonlinearState;
}

export type BusListener = (snapshot: MultiPhysicsBusSnapshot) => void;

export class MultiPhysicsCouplingBus {
  private _simTimeSec: number = 0.0;
  private _ambientTempC: number = 25.0;
  private _atmosphericPressureKPa: number = 101.325;
  private _gravityMps2: number = STANDARD_GRAVITY_M_S2;

  // 1. Cụm Điện -> Nhiệt -> Thủy (Biến vi phân: [T_fluid_C, m_liquid_kg])
  private _etf_U: number = 12.0;
  private _etf_closed: boolean = false;
  private _etf_R_heater: number = 2.0; // 2 Ohm -> P ~ 72 W ở 12 V
  private _etf_efficiency: number = 0.88;
  private _etf_tempC: number = 25.0;
  private _etf_liquidMassKg: number = 0.150; // 150g nước
  private _etf_vesselC_JK: number = 80.0; // Nhiệt dung cốc Borosilicate
  private _etf_beakerRadiusM: number = 0.035; // Bán kính cốc 35 mm
  private _etf_heatTransferCoeff_h: number = 18.0; // W/(m^2 K) đối lưu tự nhiên
  private _etf_evaporatedMassKg: number = 0.0;
  private _etf_lastEvapRateKgS: number = 0.0;
  private _etf_lastQNetW: number = 0.0;

  // 2. Cụm Từ -> Điện -> Cơ (Biến vi phân: [z_magnet, v_magnet])
  private _fl_magnetMassKg: number = 0.080; // Nam châm 80g
  private _fl_magnetZM: number = 0.15; // Thả từ độ cao +15 cm
  private _fl_magnetVM: number = 0.0; // Vận tốc đầu = 0
  private _fl_magnetAM: number = -STANDARD_GRAVITY_M_S2;
  private _fl_coilTurnsN: number = 600; // Cuộn 600 vòng
  private _fl_coilRadiusM: number = 0.020; // Bán kính ống 20 mm
  private _fl_coilHeightM: number = 0.065; // Chiều dài ống 65 mm
  private _fl_coilCenterZM: number = 0.0; // Tâm ống đặt tại z = 0
  private _fl_coilResistanceOhms: number = 2.4; // Điện trở cuộn dây
  private _fl_loadResistanceOhms: number = 5.0; // Điện trở ngoài
  private _fl_dipoleMoment: number = 2.5; // A*m^2 (Nam châm Neodymium N42)
  private _fl_airDampingGamma: number = 0.005; // Hệ số cản không khí N/(m/s)

  // 3. Dây tóc Vonfram phi tuyến (Biến vi phân: [T_filament_K])
  private _fil_U: number = 12.0;
  private _fil_closed: boolean = false;
  private _fil_R0: number = 1.0; // 1.0 Ohm khi nguội tại 293.15 K
  private _fil_tempK: number = 293.15; // Nhiệt độ dây tóc K
  private _fil_C_JK: number = 0.012; // Nhiệt dung dây tóc vonfram rất nhỏ
  private _fil_emissivity: number = 0.38;
  private _fil_surfaceAreaM2: number = 1.2e-4; // 120 mm2
  private _fil_convCoeffH: number = 12.0; // W/(m2 K)
  private _fil_alpha: number = 4.5e-3;
  private _fil_beta: number = 1.0e-6;

  // Vector trạng thái vi phân hợp nhất 5 chiều:
  // y[0] = T_fluid (C)
  // y[1] = m_liquid (kg)
  // y[2] = z_magnet (m)
  // y[3] = v_magnet (m/s)
  // y[4] = T_filament (K)
  private readonly _stateVector: Float64Array = new Float64Array(5);
  private readonly _integrator: ContinuousIntegratorRK4;
  private readonly _listeners: Set<BusListener> = new Set();

  constructor() {
    this._integrator = new ContinuousIntegratorRK4({
      dimension: 5,
      fixedDt: 1.0 / 120.0, // 120 Hz
      energyTolerance: 1.0e-6,
    });

    this._syncStateVectorFromFields();
  }

  /**
   * Đồng bộ từ các thuộc tính nội bộ sang Float64Array
   */
  private _syncStateVectorFromFields(): void {
    this._stateVector[0] = this._etf_tempC;
    this._stateVector[1] = this._etf_liquidMassKg;
    this._stateVector[2] = this._fl_magnetZM;
    this._stateVector[3] = this._fl_magnetVM;
    this._stateVector[4] = this._fil_tempK;
  }

  /**
   * Đồng bộ ngược từ Float64Array về các thuộc tính
   */
  private _syncFieldsFromStateVector(): void {
    this._etf_tempC = Math.max(0.0, this._stateVector[0]);
    this._etf_liquidMassKg = Math.max(0.0, this._stateVector[1]);
    this._fl_magnetZM = this._stateVector[2];
    this._fl_magnetVM = this._stateVector[3];
    this._fil_tempK = Math.max(200.0, this._stateVector[4]);
  }

  /**
   * Đăng ký quan sát dữ liệu trục Bus
   */
  public subscribe(listener: BusListener): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  /**
   * Thiết lập môi trường thí nghiệm
   */
  public setEnvironment(ambientTempC: number, pressureKPa: number, gravityMps2: number): void {
    this._ambientTempC = ambientTempC;
    this._atmosphericPressureKPa = Math.max(1.0, pressureKPa);
    this._gravityMps2 = Math.max(0.0, gravityMps2);
  }

  /**
   * Điều khiển cụm Điện -> Nhiệt -> Thủy
   */
  public setElectroThermalFluidControls(config: {
    voltageV?: number;
    circuitClosed?: boolean;
    heaterResistanceOhms?: number;
    initialLiquidMassKg?: number;
    beakerRadiusM?: number;
    initialTempC?: number;
  }): void {
    if (typeof config.voltageV === 'number') this._etf_U = Math.max(0.0, config.voltageV);
    if (typeof config.circuitClosed === 'boolean') this._etf_closed = config.circuitClosed;
    if (typeof config.heaterResistanceOhms === 'number') this._etf_R_heater = Math.max(0.1, config.heaterResistanceOhms);
    if (typeof config.initialLiquidMassKg === 'number') {
      this._etf_liquidMassKg = Math.max(0.001, config.initialLiquidMassKg);
      this._stateVector[1] = this._etf_liquidMassKg;
    }
    if (typeof config.initialTempC === 'number') {
      this._etf_tempC = Math.max(0.0, config.initialTempC);
      this._stateVector[0] = this._etf_tempC;
    }
    if (typeof config.beakerRadiusM === 'number') this._etf_beakerRadiusM = Math.max(0.01, config.beakerRadiusM);
  }

  /**
   * Điều khiển cụm Từ -> Điện -> Cơ (Nam châm & Ống dây)
   */
  public setFaradayLenzControls(config: {
    magnetPositionZM?: number;
    magnetVelocityMps?: number;
    coilTurnsN?: number;
    coilResistanceOhms?: number;
    loadResistanceOhms?: number;
    magnetMassKg?: number;
    dipoleMoment?: number;
    coilRadiusM?: number;
  }): void {
    if (typeof config.magnetPositionZM === 'number') {
      this._fl_magnetZM = config.magnetPositionZM;
      this._stateVector[2] = this._fl_magnetZM;
    }
    if (typeof config.magnetVelocityMps === 'number') {
      this._fl_magnetVM = config.magnetVelocityMps;
      this._stateVector[3] = this._fl_magnetVM;
    }
    if (typeof config.coilTurnsN === 'number') this._fl_coilTurnsN = Math.max(1, Math.round(config.coilTurnsN));
    if (typeof config.coilResistanceOhms === 'number') this._fl_coilResistanceOhms = Math.max(0.05, config.coilResistanceOhms);
    if (typeof config.loadResistanceOhms === 'number') this._fl_loadResistanceOhms = Math.max(0.0, config.loadResistanceOhms);
    if (typeof config.magnetMassKg === 'number') this._fl_magnetMassKg = Math.max(0.001, config.magnetMassKg);
    if (typeof config.dipoleMoment === 'number') this._fl_dipoleMoment = Math.max(0.05, config.dipoleMoment);
    if (typeof config.coilRadiusM === 'number') this._fl_coilRadiusM = Math.max(0.005, config.coilRadiusM);
  }

  /**
   * Điều khiển cụm Dây tóc bóng đèn Vonfram
   */
  public setFilamentControls(config: {
    voltageV?: number;
    circuitClosed?: boolean;
    coldResistanceOhms?: number;
    initialTempK?: number;
  }): void {
    if (typeof config.voltageV === 'number') this._fil_U = Math.max(0.0, config.voltageV);
    if (typeof config.circuitClosed === 'boolean') this._fil_closed = config.circuitClosed;
    if (typeof config.coldResistanceOhms === 'number') this._fil_R0 = Math.max(0.1, config.coldResistanceOhms);
    if (typeof config.initialTempK === 'number') {
      this._fil_tempK = Math.max(200.0, config.initialTempK);
      this._stateVector[4] = this._fil_tempK;
    }
  }

  /**
   * Hàm tính gradient từ trường nam châm lưỡng cực dBz/dz tại khoảng cách z
   * $$B_z(z) = \frac{\mu_0 m}{2 \pi (z^2 + R^2)^{3/2}} \implies \frac{\partial B_z}{\partial z} = -\frac{3 \mu_0 m z}{2 \pi (z^2 + R^2)^{5/2}}$$
   */
  private _calcMagneticFieldGradient(z: number): number {
    const mu0 = 4.0 * Math.PI * 1e-7;
    const m = this._fl_dipoleMoment;
    const rCoil = this._fl_coilRadiusM;
    const relZ = z - this._fl_coilCenterZM;

    const denom = Math.pow(relZ * relZ + rCoil * rCoil, 2.5);
    if (denom <= 1e-12) return 0.0;
    return -(3.0 * mu0 * m * relZ) / (2.0 * Math.PI * denom);
  }

  /**
   * Tính điện trở dây tóc bóng đèn phi tuyến R(T)
   * $$R(T) = R_0 [1 + \alpha (T - T_0) + \beta (T - T_0)^2]$$
   */
  public calculateFilamentResistance(tempK: number): number {
    const T0 = 293.15; // 20°C
    const deltaT = Math.max(-100.0, tempK - T0);
    const factor = 1.0 + this._fil_alpha * deltaT + this._fil_beta * deltaT * deltaT;
    return Math.max(0.2, this._fil_R0 * factor);
  }

  /**
   * Hệ phương trình vi phân liên hợp đa vật lý: dy/dt = f(t, y)
   * 
   * y[0] = T_fluid (C)
   * y[1] = m_liquid (kg)
   * y[2] = z_magnet (m)
   * y[3] = v_magnet (m/s)
   * y[4] = T_filament (K)
   */
  private _evaluateDerivatives: DerivativeFunction = (_t, y, dydt) => {
    const tFluidC = y[0];
    const mLiquidKg = y[1];
    const zMagnet = y[2];
    const vMagnet = y[3];
    const tFilamentK = y[4];

    const ambientTempC = this._ambientTempC;
    const ambientTempK = ambientTempC + 273.15;
    const g = this._gravityMps2;

    // ----------------------------------------------------
    // MIỀN 1: ĐIỆN -> NHIỆT -> THỦY
    // ----------------------------------------------------
    let qNetW = 0.0;
    let dTFluidDt = 0.0;
    let dMLiquidDt = 0.0;

    if (this._etf_closed && this._etf_U > 0.0) {
      // Công suất Joule: P = U^2 / R
      const pJoule = (this._etf_U * this._etf_U) / this._etf_R_heater;
      const qIn = pJoule * this._etf_efficiency;

      // Diện tích truyền nhiệt thành cốc + mặt thoáng chất lỏng
      const rBeaker = this._etf_beakerRadiusM;
      const baseArea = Math.PI * rBeaker * rBeaker;
      // Chiều cao chất lỏng xấp xỉ
      const liquidVolM3 = Math.max(1e-6, mLiquidKg / WATER_ROOM_DENSITY_KG_M3);
      const hLiquid = liquidVolM3 / baseArea;
      const sideArea = 2.0 * Math.PI * rBeaker * hLiquid;
      const surfaceArea = baseArea + sideArea;

      // Làm nguội Newton: Q_loss = h * S * (T - T_mt)
      const qLoss = this._etf_heatTransferCoeff_h * surfaceArea * Math.max(0.0, tFluidC - ambientTempC);
      qNetW = qIn - qLoss;
    } else {
      // Khi ngắt điện: chỉ làm nguội tự nhiên
      const rBeaker = this._etf_beakerRadiusM;
      const baseArea = Math.PI * rBeaker * rBeaker;
      const liquidVolM3 = Math.max(1e-6, mLiquidKg / WATER_ROOM_DENSITY_KG_M3);
      const hLiquid = liquidVolM3 / baseArea;
      const surfaceArea = baseArea + 2.0 * Math.PI * rBeaker * hLiquid;
      const qLoss = this._etf_heatTransferCoeff_h * surfaceArea * (tFluidC - ambientTempC);
      qNetW = -qLoss;
    }

    this._etf_lastQNetW = qNetW;

    // Nhiệt dung toàn phần C_total = m_water * c_water + C_vessel
    const totalThermalCapacity = Math.max(20.0, mLiquidKg * WATER_SPECIFIC_HEAT_J_KG_K + this._etf_vesselC_JK);

    // Nhiệt độ sôi của nước ở áp suất khí quyển p (Antoine / Clapeyron đơn giản: T_boil = 100°C ở 101.325 kPa)
    const boilTempC = 100.0 * Math.pow(this._atmosphericPressureKPa / 101.325, 0.285);

    if (tFluidC >= boilTempC && qNetW > 0.0 && mLiquidKg > 0.0) {
      // Đã sôi: Nhiệt lượng thừa chuyển sang bốc hơi dm/dt = -Q_excess / L
      dTFluidDt = 0.0; // Giữ nhiệt độ cố định tại điểm sôi
      const evapRateKgS = qNetW / WATER_LATENT_HEAT_VAPORIZATION_J_KG;
      dMLiquidDt = -evapRateKgS;
      this._etf_lastEvapRateKgS = evapRateKgS;
    } else {
      // Chưa sôi hoặc đang làm nguội
      dTFluidDt = qNetW / totalThermalCapacity;
      dMLiquidDt = 0.0;
      this._etf_lastEvapRateKgS = 0.0;
    }

    // Nếu cạn nước, không thể bốc hơi tiếp
    if (mLiquidKg <= 0.0 && dMLiquidDt < 0.0) {
      dMLiquidDt = 0.0;
    }

    // ----------------------------------------------------
    // MIỀN 2: TỪ -> ĐIỆN -> CƠ (FARADAY & LENZ)
    // ----------------------------------------------------
    // dz/dt = v
    const dZMagnetDt = vMagnet;

    // Tính gradient từ trường dBz/dz và đạo hàm từ thông dPhi/dt
    const dBzDz = this._calcMagneticFieldGradient(zMagnet);
    const coilArea = Math.PI * this._fl_coilRadiusM * this._fl_coilRadiusM;
    // dPhi/dt = S_coil * (dBz/dz) * v
    const dPhiDt = coilArea * dBzDz * vMagnet;

    // Suất điện động cảm ứng: E = -N * dPhi/dt
    const N = this._fl_coilTurnsN;
    const rTotal = Math.max(0.1, this._fl_coilResistanceOhms + this._fl_loadResistanceOhms);
    const inducedEmf = -N * dPhiDt;
    const inducedCurrent = inducedEmf / rTotal;

    // Lực hãm Lenz: F_Lenz = -(N * dBz/dz * S_coil)^2 * v / R_total
    const couplingConst = N * coilArea * dBzDz;
    const lenzForce = -(couplingConst * couplingConst / rTotal) * vMagnet;

    // Lực cản không khí
    const airDrag = -this._fl_airDampingGamma * vMagnet;

    // Phương trình chuyển động Newton: m * a = -m * g + F_Lenz + F_drag (chiều dương hướng lên)
    const mMagnet = this._fl_magnetMassKg;
    const netForceZ = -mMagnet * g + lenzForce + airDrag;
    const dVMagnetDt = netForceZ / mMagnet;
    this._fl_magnetAM = dVMagnetDt;

    // Phản lực tiếp xúc sàn bàn thí nghiệm (z = -0.5 m) theo mô hình đàn hồi Hertzian liên tục (Hermes Patch P8)
    let finalDVMagnetDt = dVMagnetDt;
    const penetrationM = -0.5 - zMagnet;
    if (penetrationM > 0.0) {
      const kFloor = 2.5e4;
      const cFloor = 18.0;
      const fHertz = kFloor * Math.pow(penetrationM, 1.5);
      const fDamp = vMagnet < 0.0 ? -cFloor * vMagnet : 0.0;
      const fContact = fHertz + fDamp;
      finalDVMagnetDt = (netForceZ + fContact) / mMagnet;
    }

    // ----------------------------------------------------
    // MIỀN 3: DÂY TÓC BÓNG ĐÈN PHI TUYẾN & DÒNG XUNG KÍCH
    // ----------------------------------------------------
    let dTFilamentDt = 0.0;
    if (this._fil_closed && this._fil_U > 0.0) {
      const rFil = this.calculateFilamentResistance(tFilamentK);
      const iFil = this._fil_U / rFil;
      const pElec = iFil * iFil * rFil;

      // Bức xạ nhiệt Stefan-Boltzmann: P_rad = eps * sigma * S * (T^4 - T_mt^4)
      const pRad = this._fil_emissivity * STEFAN_BOLTZMANN_SIGMA * this._fil_surfaceAreaM2 *
        (Math.pow(tFilamentK, 4) - Math.pow(ambientTempK, 4));

      // Đối lưu nhiệt: P_conv = h * S * (T - T_mt)
      const pConv = this._fil_convCoeffH * this._fil_surfaceAreaM2 * Math.max(0.0, tFilamentK - ambientTempK);

      const pNetFil = pElec - pRad - pConv;
      dTFilamentDt = pNetFil / Math.max(1e-4, this._fil_C_JK);
    } else {
      // Tắt đèn: Làm nguội nhanh về nhiệt độ phòng
      const pRad = this._fil_emissivity * STEFAN_BOLTZMANN_SIGMA * this._fil_surfaceAreaM2 *
        (Math.pow(tFilamentK, 4) - Math.pow(ambientTempK, 4));
      const pConv = this._fil_convCoeffH * this._fil_surfaceAreaM2 * (tFilamentK - ambientTempK);
      dTFilamentDt = -(pRad + pConv) / Math.max(1e-4, this._fil_C_JK);
    }

    // Gán kết quả đạo hàm vào mảng dydt
    dydt[0] = dTFluidDt;
    dydt[1] = dMLiquidDt;
    dydt[2] = dZMagnetDt;
    dydt[3] = finalDVMagnetDt;
    dydt[4] = dTFilamentDt;
  };

  /**
   * Tiến một bước vi phân đa vật lý cố định 120 Hz (dt = 1/120 s)
   */
  public step(dt: number = 1.0 / 120.0): MultiPhysicsBusSnapshot {
    // _syncStateVectorFromFields

    // Tích phân RK4 chuẩn 120 Hz
    this._integrator.step(this._simTimeSec, this._stateVector, this._evaluateDerivatives, dt);

    this._simTimeSec += dt;
    this._syncFieldsFromStateVector();

    // Cập nhật lượng bốc hơi lũy kế
    if (this._etf_lastEvapRateKgS > 0) {
      this._etf_evaporatedMassKg += this._etf_lastEvapRateKgS * dt;
    }

    const snapshot = this.getSnapshot();

    // Thông báo toàn bộ listeners
    for (const listener of this._listeners) {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('[MultiPhysicsCouplingBus] Lỗi trong BusListener callback:', err);
      }
    }

    return snapshot;
  }

  /**
   * Chụp toàn bộ trạng thái đa trường tại thời điểm hiện tại
   */
  public getSnapshot(): MultiPhysicsBusSnapshot {
    // 1. Dữ liệu Thủy - Nhiệt
    const liquidMass = this._etf_liquidMassKg;
    const liquidVolM3 = liquidMass / WATER_ROOM_DENSITY_KG_M3;
    const liquidVolMl = liquidVolM3 * 1.0e6;
    const baseArea = Math.PI * this._etf_beakerRadiusM * this._etf_beakerRadiusM;
    const liquidHeightM = liquidVolM3 / baseArea;
    const pAtmPa = this._atmosphericPressureKPa * 1000.0;
    const hydrostaticPressurePa = pAtmPa + WATER_ROOM_DENSITY_KG_M3 * this._gravityMps2 * liquidHeightM;
    const boilTempC = 100.0 * Math.pow(this._atmosphericPressureKPa / 101.325, 0.285);
    const isBoiling = this._etf_tempC >= boilTempC - 0.05 && this._etf_lastQNetW > 0;

    const etfCurrent = this._etf_closed ? this._etf_U / this._etf_R_heater : 0.0;
    const etfPower = etfCurrent * etfCurrent * this._etf_R_heater;

    // 2. Dữ liệu Cảm ứng Faraday - Lenz
    const coilArea = Math.PI * this._fl_coilRadiusM * this._fl_coilRadiusM;
    const dBzDz = this._calcMagneticFieldGradient(this._fl_magnetZM);
    const dPhiDt = coilArea * dBzDz * this._fl_magnetVM;
    const inducedEmf = -this._fl_coilTurnsN * dPhiDt;
    const rTotal = this._fl_coilResistanceOhms + this._fl_loadResistanceOhms;
    const inducedCurrent = inducedEmf / rTotal;
    const couplingConst = this._fl_coilTurnsN * coilArea * dBzDz;
    const lenzForce = -(couplingConst * couplingConst / rTotal) * this._fl_magnetVM;
    const isInsideCoil = Math.abs(this._fl_magnetZM - this._fl_coilCenterZM) <= (this._fl_coilHeightM * 0.5);

    // 3. Dữ liệu Dây tóc phi tuyến
    const rFil = this.calculateFilamentResistance(this._fil_tempK);
    const iFil = this._fil_closed ? this._fil_U / rFil : 0.0;
    const pFil = iFil * iFil * rFil;
    // Dòng xung kích: T < 600K và mạch vừa đóng
    const isInrush = this._fil_closed && this._fil_tempK < 700.0 && iFil > (this._fil_U / 12.0) * 1.5;
    // Độ sáng tương đối theo định luật Stefan-Boltzmann phát xạ khả kiến
    const relativeBrightness = Math.max(0.0, Math.min(1.0, Math.pow(Math.max(0.0, this._fil_tempK - 800.0) / 1700.0, 3.5)));

    return {
      simulationTimeSec: this._simTimeSec,
      ambientTemperatureC: this._ambientTempC,
      atmosphericPressureKPa: this._atmosphericPressureKPa,
      gravityMps2: this._gravityMps2,
      electroThermalFluid: {
        supplyVoltageV: this._etf_U,
        circuitClosed: this._etf_closed,
        heaterResistanceOhms: this._etf_R_heater,
        heaterCurrentAmperes: etfCurrent,
        heaterPowerWatts: etfPower,
        thermalCouplingEfficiency: this._etf_efficiency,
        liquidMassKg: liquidMass,
        liquidVolumeMl: liquidVolMl,
        temperatureC: this._etf_tempC,
        vesselThermalCapacityJK: this._etf_vesselC_JK,
        heatExchangeRateW: this._etf_lastQNetW,
        isBoiling,
        evaporatedMassKg: this._etf_evaporatedMassKg,
        evaporationRateKgS: this._etf_lastEvapRateKgS,
        beakerRadiusM: this._etf_beakerRadiusM,
        liquidHeightM,
        hydrostaticPressurePa,
      },
      faradayLenz: {
        magnetMassKg: this._fl_magnetMassKg,
        magnetPositionZM: this._fl_magnetZM,
        magnetVelocityMps: this._fl_magnetVM,
        magnetAccelerationMps2: this._fl_magnetAM,
        coilTurnsN: this._fl_coilTurnsN,
        coilRadiusM: this._fl_coilRadiusM,
        coilHeightM: this._fl_coilHeightM,
        coilCenterZM: this._fl_coilCenterZM,
        coilResistanceOhms: this._fl_coilResistanceOhms,
        loadResistanceOhms: this._fl_loadResistanceOhms,
        totalCircuitResistanceOhms: rTotal,
        magneticFluxWb: coilArea * (this._fl_dipoleMoment * 4e-7 / Math.pow(Math.max(0.01, Math.abs(this._fl_magnetZM)), 3)),
        fluxDerivativeWbPerS: dPhiDt,
        inducedEmfVolts: inducedEmf,
        inducedCurrentAmperes: inducedCurrent,
        lenzBrakingForceNewtons: lenzForce,
        gravityMps2: this._gravityMps2,
        isInsideCoil,
      },
      filament: {
        supplyVoltageV: this._fil_U,
        circuitClosed: this._fil_closed,
        coldResistanceOhms: this._fil_R0,
        filamentTemperatureK: this._fil_tempK,
        filamentResistanceOhms: rFil,
        currentAmperes: iFil,
        powerWatts: pFil,
        isInrushPhase: isInrush,
        relativeBrightness,
        thermalCapacityFilamentJK: this._fil_C_JK,
        alphaTempCoef: this._fil_alpha,
        betaTempCoef: this._fil_beta,
      },
    };
  }

  public get simulationTimeSec(): number {
    return this._simTimeSec;
  }

  public resetTime(): void {
    this._simTimeSec = 0.0;
  }
}





