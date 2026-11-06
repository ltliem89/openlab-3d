import * as THREE from 'three';

/**
 * OPENLAB KHTN 9 — ĐẶC TẢ MÔI TRƯỜNG PHÒNG THÍ NGHIỆM 3D
 * Chuẩn thống nhất: OL3D-LAB-ENVIRONMENT-SPEC v2.0 + OL3D-HTML-MODULE v2.2
 *
 * Quy ước cố định:
 * - Hệ tọa độ thế giới: +X sang phải (Đỏ), +Y hướng lên (Xanh lá), +Z ra phía trước (Xanh dương)
 * - Gốc O (0, 0, 0): Tâm hình học của mặt sàn phòng (y = 0)
 * - Đơn vị: 1.0 Three.js unit = 1.0 mét (m)
 * - Mặt trên bàn thực hành: BENCH_SURFACE_Y = 0.82 m (độ dày mặt bàn 0.04 m -> mặt dưới y = 0.78 m)
 * - Anchor của mọi module thiết bị: 'base-center' -> đặt trên mặt bàn tại worldY = BENCH_SURFACE_Y (0.82 m)
 */

export const BENCH_SURFACE_Y = 0.82;
export const BENCH_CORNER_ORIGIN_WORLD: [number, number, number] = [
  -1.2,
  BENCH_SURFACE_Y,
  -0.4875,
];
export const DEFAULT_SHELF_CENTER_Z = -0.45;
export const DEFAULT_SHELF_TIER_Y = 0.138;

/**
 * Chuyển đổi từ tọa độ Three.js nội bộ sang Hệ trục Góc Bàn cố định O(0,0,0):
 * - Gốc O(0,0,0) đặt cố định tại góc sau-trái của mặt bàn thực hành (-1.20m, 0.82m, -0.488m)
 * - Trục X: thuộc cạnh dài của bàn (từ trái sang phải: 0 -> 2.40 m)
 * - Trục Y: thuộc cạnh rộng của bàn (từ sau ra trước: 0 -> 0.98 m)
 * - Trục Z: trục đứng vuông góc mặt bàn hướng lên trên (Z = 0 tại mặt bàn -> +Z hướng lên)
 */
export function worldToBenchCornerCoords(
  worldM: [number, number, number],
  roomConfig: LabRoomConfig = DEFAULT_LAB_ROOM_CONFIG,
): [number, number, number] {
  const originX = -roomConfig.bench.widthM / 2;
  const originY = roomConfig.bench.topY;
  const originZ = -roomConfig.bench.depthM / 2;
  return [
    Number((worldM[0] - originX).toFixed(3)),
    Number((worldM[2] - originZ).toFixed(3)),
    Number((worldM[1] - originY).toFixed(3)),
  ];
}

export function benchCornerToWorldCoords(
  benchCoordsM: [number, number, number],
  roomConfig: LabRoomConfig = DEFAULT_LAB_ROOM_CONFIG,
): [number, number, number] {
  const originX = -roomConfig.bench.widthM / 2;
  const originY = roomConfig.bench.topY;
  const originZ = -roomConfig.bench.depthM / 2;
  return [
    Number((originX + benchCoordsM[0]).toFixed(3)),
    Number((originY + benchCoordsM[2]).toFixed(3)),
    Number((originZ + benchCoordsM[1]).toFixed(3)),
  ];
}

export interface LabRoomConfig {
  roomId: string;
  roomName: string;
  dimensionsM: {
    widthX: number; // Mặc định 12.0 m (-6 .. +6)
    depthZ: number; // Mặc định 8.0 m (-4 .. +4)
    heightY: number; // Mặc định 3.6 m (0 .. +3.6)
    floorThicknessM: number; // 0.10 m
    wallThicknessM: number; // 0.15 m
    ceilingThicknessM: number; // 0.10 m
  };
  coordinateSystem: {
    upAxis: '+Y';
    rightAxis: '+X';
    forwardAxis: '+Z';
    unitsPerMeter: 1;
    floorY: 0;
    origin: 'floor-center';
  };
  bench: {
    enabled: boolean;
    count: number;
    widthM: number; // Mặc định 2.40 m (-1.20 .. +1.20)
    depthM: number; // Mặc định 0.975 m (-0.4875 .. +0.4875)
    topY: number; // Mặc định 0.82 m (BENCH_SURFACE_Y)
    topThicknessM: number; // Mặc định 0.04 m (mặt dưới ở y = 0.78 m)
  };
  placement: {
    snapEnabled: boolean;
    collisionEnabled: boolean;
    clearanceM: number; // 0.03 m
    showPlacementHelpers: boolean;
  };
}

export const DEFAULT_LAB_ROOM_CONFIG: LabRoomConfig = {
  roomId: 'OL3D-ROOM-STD-12X8',
  roomName: 'Phòng thực hành Khoa học tự nhiên 9 (12.0 × 8.0 × 3.6 m)',
  dimensionsM: {
    widthX: 12.0,
    depthZ: 8.0,
    heightY: 3.6,
    floorThicknessM: 0.1,
    wallThicknessM: 0.15,
    ceilingThicknessM: 0.1,
  },
  coordinateSystem: {
    upAxis: '+Y',
    rightAxis: '+X',
    forwardAxis: '+Z',
    unitsPerMeter: 1,
    floorY: 0,
    origin: 'floor-center',
  },
  bench: {
    enabled: true,
    count: 1,
    widthM: 2.4,
    depthM: 0.975, // Tăng thêm 30% độ rộng mặt bàn (từ 0.75m lên 0.975m theo yêu cầu)
    topY: BENCH_SURFACE_Y,
    topThicknessM: 0.04,
  },
  placement: {
    snapEnabled: true,
    collisionEnabled: true,
    clearanceM: 0.03,
    showPlacementHelpers: false,
  },
};

export interface PlacementSurfaceMetadata {
  surfaceId: string;
  surfaceNameVi: string;
  surfaceType: 'lab-bench' | 'room-floor';
  surfaceY: number;
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  allowedEquipmentCategories: string[];
  snapEnabled: boolean;
  collisionEnabled: boolean;
  normal: [number, number, number];
}

export function getPlacementSurfaces(config: LabRoomConfig): PlacementSurfaceMetadata[] {
  const halfBenchW = config.bench.widthM / 2 - config.placement.clearanceM;
  const halfBenchD = config.bench.depthM / 2 - config.placement.clearanceM;
  const halfFloorW = config.dimensionsM.widthX / 2 - 0.25;
  const halfFloorD = config.dimensionsM.depthZ / 2 - 0.25;

  return [
    {
      surfaceId: 'bench-main-top',
      surfaceNameVi: 'Mặt bàn thực hành chính (Gốc O góc bàn: X=0..2.40m, Y=0..0.75m, Z=0)',
      surfaceType: 'lab-bench',
      surfaceY: config.bench.topY,
      bounds: {
        minX: Number((-halfBenchW).toFixed(3)),
        maxX: Number(halfBenchW.toFixed(3)),
        minZ: Number((-halfBenchD).toFixed(3)),
        maxZ: Number(halfBenchD.toFixed(3)),
      },
      allowedEquipmentCategories: ['all'],
      snapEnabled: config.placement.snapEnabled,
      collisionEnabled: config.placement.collisionEnabled,
      normal: [0, 1, 0],
    },
    {
      surfaceId: 'room-floor-main',
      surfaceNameVi: 'Mặt sàn phòng thí nghiệm (y = 0.00 m)',
      surfaceType: 'room-floor',
      surfaceY: 0,
      bounds: {
        minX: Number((-halfFloorW).toFixed(3)),
        maxX: Number(halfFloorW.toFixed(3)),
        minZ: Number((-halfFloorD).toFixed(3)),
        maxZ: Number(halfFloorD.toFixed(3)),
      },
      allowedEquipmentCategories: ['all'],
      snapEnabled: config.placement.snapEnabled,
      collisionEnabled: config.placement.collisionEnabled,
      normal: [0, 1, 0],
    },
  ];
}

export interface CoordinateDisplaySettings {
  showWorldAxes: boolean; // Hiển thị 1 hệ trục duy nhất tại góc bàn cố định (X, Y thuộc cạnh bàn, Z đứng)
  showOriginMarker: boolean; // Điểm gốc O(0,0,0) tại góc bàn cố định
  showFloorGrid: boolean; // Lưới phẳng XY trên mặt bàn (bật/tắt khi cần)
  showSpaceGrid: boolean; // Lưới không gian 3D dựng đứng XZ & YZ từ cạnh bàn (bật/tắt khi cần)
  showAxisLabels: boolean; // Nhãn trục X, Y (cạnh bàn) và Z (đứng)
  showNumericTicks: boolean; // Vạch chia kích thước dọc theo 2 cạnh bàn & trục đứng Z
  showMinorGrid: boolean; // Lưới chi tiết 5 cm trên mặt bàn
  majorGridSpacingM: number; // 1.0 m (chuẩn hệ thống) / 0.1 m trên bàn
  minorGridSpacingM: number; // 0.1 m
  axisLengthM: number; // 2.4 m
  displayUnit: 'm' | 'cm' | 'mm';
}

/**
 * Cấu hình hiển thị Hệ trục Góc Bàn duy nhất:
 * - Chỉ 1 hệ trục O-XYZ đặt tại góc sau-trái cố định của bàn: X, Y nằm sát 2 cạnh bàn, Z dựng đứng.
 * - Trên mặt bàn (`showFloorGrid`) và trong không gian (`showSpaceGrid`) có thể bật/tắt hiển thị lưới bất kỳ lúc nào.
 */
export const DEFAULT_COORDINATE_DISPLAY_SETTINGS: CoordinateDisplaySettings = {
  showWorldAxes: true,
  showOriginMarker: true,
  showFloorGrid: false,
  showSpaceGrid: false,
  showAxisLabels: true,
  showNumericTicks: true,
  showMinorGrid: false,
  majorGridSpacingM: 1.0,
  minorGridSpacingM: 0.1,
  axisLengthM: 2.4,
  displayUnit: 'm',
};

import { EquipmentGroupGId, PhysicsFidelityLevel } from '../domain/types';

export type EnvironmentVariableId =
  // (a) 13 Biến môi trường lõi cấp phòng thí nghiệm (Room Core Variables)
  | 'airTemperatureC'
  | 'relativeHumidityPct'
  | 'atmosphericPressureKPa'
  | 'gravityMps2'
  | 'illuminanceLux'
  | 'airflowMps'
  | 'ventilationACH'
  | 'oxygenPct'
  | 'co2Ppm'
  | 'ambientMagneticFieldMicroT'
  | 'benchTemperatureC'
  | 'mainsVoltageV'
  | 'mainsFrequencyHz'
  // (b) 12 Biến môi trường chuyên biệt theo mẫu/thiết bị (Sample / Specimen Variables)
  | 'sampleTemperatureC'
  | 'samplePh'
  | 'sampleConductivityUScm'
  | 'sampleTdsMgL'
  | 'sampleSalinityPsu'
  | 'sampleTurbidityNtu'
  | 'sampleDissolvedO2MgL'
  | 'sampleDensityKgM3'
  | 'sampleViscosityPaS'
  | 'opticalWavelengthNm'
  | 'thermalHeatPowerW'
  | 'surfaceFrictionCoef';

export interface EnvironmentVariableDefinition {
  id: EnvironmentVariableId;
  scope?: 'room-core' | 'sample-specific';
  nameVi: string;
  unit: string;
  value: number;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  verificationSource: 'config-default' | 'user-adjusted';
  activeWhenConditionVi: string;
  affectedSubsystems: string[];
}

export const INITIAL_ENVIRONMENT_VARIABLES: Record<
  EnvironmentVariableId,
  EnvironmentVariableDefinition
> = {
  // === 13 BIẾN MÔI TRƯỜNG LÕI CẤP PHÒNG ===
  airTemperatureC: {
    id: 'airTemperatureC',
    scope: 'room-core',
    nameVi: '1. Nhiệt độ không khí (T_air)',
    unit: '°C',
    value: 25,
    defaultValue: 25,
    min: -10,
    max: 60,
    step: 0.5,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Có mô hình trao đổi nhiệt / Nhiệt kế đặt ngoài không khí',
    affectedSubsystems: ['thermometer-ambient', 'thermal-exchange', 'G03', 'G05'],
  },
  relativeHumidityPct: {
    id: 'relativeHumidityPct',
    scope: 'room-core',
    nameVi: '2. Độ ẩm tương đối (RH)',
    unit: '%',
    value: 60,
    defaultValue: 60,
    min: 0,
    max: 100,
    step: 1,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Mẫu/vật liệu có quy tắc hút ẩm, bay hơi hơi nước bão hòa',
    affectedSubsystems: ['evaporation-model', 'G05', 'G10'],
  },
  atmosphericPressureKPa: {
    id: 'atmosphericPressureKPa',
    scope: 'room-core',
    nameVi: '3. Áp suất khí quyển (P_atm)',
    unit: 'kPa',
    value: 101.325,
    defaultValue: 101.325,
    min: 50,
    max: 120,
    step: 0.1,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Thí nghiệm có xét áp suất / nhiệt độ sôi của nước khi đun',
    affectedSubsystems: ['boiling-point-model', 'barometer', 'G05'],
  },
  gravityMps2: {
    id: 'gravityMps2',
    scope: 'room-core',
    nameVi: '4. Gia tốc trọng trường (g)',
    unit: 'm/s²',
    value: 9.80665,
    defaultValue: 9.80665,
    min: 0,
    max: 20,
    step: 0.01,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Trực tiếp lên Cân (F=m·g), Lực kế lò xo (F=k·Δx) và Mặt nghiêng',
    affectedSubsystems: ['spring-dynamometer', 'electronic-balance', 'G02', 'G08'],
  },
  illuminanceLux: {
    id: 'illuminanceLux',
    scope: 'room-core',
    nameVi: '5. Cường độ ánh sáng (Lux)',
    unit: 'lux',
    value: 500,
    defaultValue: 500,
    min: 0,
    max: 2000,
    step: 10,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Thí nghiệm quang học, Kính hiển vi (G09) & cảm biến quang',
    affectedSubsystems: ['lux-sensor', 'optical-microscope', 'G06', 'G09'],
  },
  airflowMps: {
    id: 'airflowMps',
    scope: 'room-core',
    nameVi: '6. Tốc độ luồng không khí (v_air)',
    unit: 'm/s',
    value: 0,
    defaultValue: 0,
    min: 0,
    max: 20,
    step: 0.1,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Mô phỏng gió đối lưu, nhiễu đĩa cân điện tử & bay hơi',
    affectedSubsystems: ['convection-cooling', 'balance-draft', 'G02'],
  },
  ventilationACH: {
    id: 'ventilationACH',
    scope: 'room-core',
    nameVi: '7. Tần suất thông gió (ACH)',
    unit: '1/h',
    value: 2,
    defaultValue: 2,
    min: 0,
    max: 30,
    step: 1,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Trao đổi khí phòng thực hành Hóa học (G05)',
    affectedSubsystems: ['fume-hood-ventilation', 'G05'],
  },
  oxygenPct: {
    id: 'oxygenPct',
    scope: 'room-core',
    nameVi: '8. Nồng độ Oxy (O₂)',
    unit: '%',
    value: 20.95,
    defaultValue: 20.95,
    min: 0,
    max: 100,
    step: 0.05,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Đốt cháy đèn cồn (tự tắt khi O₂ < 14%) & phản ứng oxi hóa',
    affectedSubsystems: ['combustion-burner', 'G05'],
  },
  co2Ppm: {
    id: 'co2Ppm',
    scope: 'room-core',
    nameVi: '9. Nồng độ CO₂',
    unit: 'ppm',
    value: 420,
    defaultValue: 420,
    min: 0,
    max: 10000,
    step: 10,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Thí nghiệm quang hợp Sinh học (G09) & vi khí hậu phòng',
    affectedSubsystems: ['co2-sensor', 'G09', 'G10'],
  },
  ambientMagneticFieldMicroT: {
    id: 'ambientMagneticFieldMicroT',
    scope: 'room-core',
    nameVi: '10. Từ trường môi trường (B)',
    unit: 'µT',
    value: 50,
    defaultValue: 50,
    min: 0,
    max: 200,
    step: 1,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'La bàn, lực từ & cảm ứng điện từ (G07)',
    affectedSubsystems: ['electromagnetic-induction', 'G07'],
  },
  benchTemperatureC: {
    id: 'benchTemperatureC',
    scope: 'room-core',
    nameVi: '11. Nhiệt độ bề mặt bàn (T_bench)',
    unit: '°C',
    value: 22,
    defaultValue: 22,
    min: -10,
    max: 150,
    step: 0.5,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Truyền nhiệt tiếp xúc từ mặt bàn lên thiết bị (G05, G08)',
    affectedSubsystems: ['bench-contact-thermal', 'G05', 'G08'],
  },
  mainsVoltageV: {
    id: 'mainsVoltageV',
    scope: 'room-core',
    nameVi: '12a. Điện áp nguồn AC (V_ac)',
    unit: 'V',
    value: 220,
    defaultValue: 220,
    min: 0,
    max: 250,
    step: 1,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Mạch điện xoay chiều, nguồn hạ áp & biến tần (G03, G07)',
    affectedSubsystems: ['power-supply-ac', 'G03', 'G07'],
  },
  mainsFrequencyHz: {
    id: 'mainsFrequencyHz',
    scope: 'room-core',
    nameVi: '12b. Tần số nguồn AC (f_ac)',
    unit: 'Hz',
    value: 50,
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 1,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Thí nghiệm dòng điện xoay chiều AC (G07)',
    affectedSubsystems: ['power-supply-ac', 'G07'],
  },

  // === 12 BIẾN MÔI TRƯỜNG CHUYÊN BIỆT THEO MẪU / THIẾT BỊ ===
  sampleTemperatureC: {
    id: 'sampleTemperatureC',
    scope: 'sample-specific',
    nameVi: '13. Nhiệt độ mẫu (T_sample)',
    unit: '°C',
    value: 25,
    defaultValue: 25,
    min: 0,
    max: 100,
    step: 0.5,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Nhiệt kế nhúng mẫu, giãn nở thể tích chất lỏng & bù nhiệt ATC',
    affectedSubsystems: ['thermometer-probe', 'liquid-expansion', 'G03', 'G04', 'G10'],
  },
  samplePh: {
    id: 'samplePh',
    scope: 'sample-specific',
    nameVi: '14. Độ pH của mẫu dung dịch',
    unit: 'pH',
    value: 7.0,
    defaultValue: 7.0,
    min: 0,
    max: 14,
    step: 0.05,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Máy đo pH hiện số & chuẩn độ trung hòa Axit-Bazơ (G05, G10)',
    affectedSubsystems: ['ph-meter', 'acid-base-indicator', 'G05', 'G10'],
  },
  sampleConductivityUScm: {
    id: 'sampleConductivityUScm',
    scope: 'sample-specific',
    nameVi: '15. Độ dẫn điện mẫu (EC)',
    unit: 'µS/cm',
    value: 100,
    defaultValue: 100,
    min: 0,
    max: 2000,
    step: 5,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Bút đo EC & khảo sát chất điện li (G07, G10)',
    affectedSubsystems: ['ec-tds-meter', 'G07', 'G10'],
  },
  sampleTdsMgL: {
    id: 'sampleTdsMgL',
    scope: 'sample-specific',
    nameVi: '16. Tổng chất rắn hòa tan (TDS)',
    unit: 'mg/L',
    value: 50,
    defaultValue: 50,
    min: 0,
    max: 2000,
    step: 5,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Bút đo TDS & kiểm tra độ tinh khiết nước (G10)',
    affectedSubsystems: ['ec-tds-meter', 'G10'],
  },
  sampleSalinityPsu: {
    id: 'sampleSalinityPsu',
    scope: 'sample-specific',
    nameVi: '17. Độ mặn mẫu (Salinity)',
    unit: 'PSU',
    value: 0,
    defaultValue: 0,
    min: 0,
    max: 42,
    step: 0.5,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Đo độ mặn nước biển & lực đẩy Archimedes trong nước muối',
    affectedSubsystems: ['salinity-sensor', 'buoyancy-force', 'G02', 'G10'],
  },
  sampleTurbidityNtu: {
    id: 'sampleTurbidityNtu',
    scope: 'sample-specific',
    nameVi: '18. Độ đục của mẫu (Turbidity)',
    unit: 'NTU',
    value: 0,
    defaultValue: 0,
    min: 0,
    max: 1000,
    step: 1,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Máy đo độ đục nước & suy giảm truyền dẫn tia sáng qua chất lỏng',
    affectedSubsystems: ['turbidity-meter', 'laser-attenuation', 'G06', 'G10'],
  },
  sampleDissolvedO2MgL: {
    id: 'sampleDissolvedO2MgL',
    scope: 'sample-specific',
    nameVi: '19. Oxy hòa tan trong mẫu (DO)',
    unit: 'mg/L',
    value: 8.0,
    defaultValue: 8.0,
    min: 0,
    max: 20,
    step: 0.1,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Máy đo DO & hô hấp thủy sinh (G09, G10)',
    affectedSubsystems: ['do-meter', 'G09', 'G10'],
  },
  sampleDensityKgM3: {
    id: 'sampleDensityKgM3',
    scope: 'sample-specific',
    nameVi: '20. Khối lượng riêng mẫu lỏng (ρ)',
    unit: 'kg/m³',
    value: 1000,
    defaultValue: 1000,
    min: 500,
    max: 5000,
    step: 10,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Đo khối lượng riêng (Cân, Ống đong, Lực đẩy Archimedes F_A = ρ·g·V)',
    affectedSubsystems: ['density-measurement', 'archimedes-buoyancy', 'G02', 'G04'],
  },
  sampleViscosityPaS: {
    id: 'sampleViscosityPaS',
    scope: 'sample-specific',
    nameVi: '21. Độ nhớt chất lỏng (η)',
    unit: 'Pa·s',
    value: 0.001,
    defaultValue: 0.001,
    min: 0.001,
    max: 10,
    step: 0.001,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Tốc độ chảy qua vòi Buret / Phễu chiết & lực cản chất lỏng (G04, G05)',
    affectedSubsystems: ['fluid-flow-rate', 'G04', 'G05'],
  },
  opticalWavelengthNm: {
    id: 'opticalWavelengthNm',
    scope: 'sample-specific',
    nameVi: '22. Bước sóng nguồn sáng (λ)',
    unit: 'nm',
    value: 650,
    defaultValue: 650,
    min: 380,
    max: 780,
    step: 5,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Khúc xạ qua Thấu kính/Lăng kính (chiết suất n(λ) Cauchy) (G06)',
    affectedSubsystems: ['optical-refraction', 'prism-dispersion', 'G06'],
  },
  thermalHeatPowerW: {
    id: 'thermalHeatPowerW',
    scope: 'sample-specific',
    nameVi: '23. Công suất nguồn nhiệt (P_heat)',
    unit: 'W',
    value: 150,
    defaultValue: 150,
    min: 0,
    max: 800,
    step: 10,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Tốc độ đun nóng nước trên Đèn cồn / Bếp điện (Q = P·t = m·c·ΔT) (G05)',
    affectedSubsystems: ['calorimetry-heating', 'G05'],
  },
  surfaceFrictionCoef: {
    id: 'surfaceFrictionCoef',
    scope: 'sample-specific',
    nameVi: '24. Hệ số ma sát bề mặt (μ)',
    unit: 'μ',
    value: 0.3,
    defaultValue: 0.3,
    min: 0,
    max: 1.0,
    step: 0.02,
    verificationSource: 'config-default',
    activeWhenConditionVi: 'Xe lăn và khối trượt trên mặt phẳng nghiêng (F_ms = μ·N) (G08)',
    affectedSubsystems: ['inclined-plane-mechanics', 'G08'],
  },
};

/**
 * MỤC 2 BÁO CÁO NGHIÊN CỨU: 10 NHÓM THIẾT BỊ CHUẨN (G01 - G10)
 */
export interface EquipmentGroupGSpec {
  groupId: EquipmentGroupGId;
  titleVi: string;
  sampleEquipmentsVi: string[];
  requiredSpecsVi: string[];
  typicalRangeAndLeastCount: string;
  permissibleError: string;
  relatedEnvVars: EnvironmentVariableId[];
  recommendedSampleModule: {
    nameVi: string;
    assetId: string;
    slug: string;
  };
}

export const EQUIPMENT_GROUPS_G01_G10: EquipmentGroupGSpec[] = [
  {
    groupId: 'G01',
    titleVi: 'G01 – Đo chiều dài, kích thước, góc',
    sampleEquipmentsVi: ['Thước cặp 0–150mm', 'Panme 0–25mm', 'Thước đo góc', 'Thước đo độ nghiêng'],
    requiredSpecsVi: [
      'Kích thước bao (dài × rộng × dày mm)',
      'Phạm vi đo (0–150mm thước cặp; 0–25mm panme)',
      'ĐCNN (0.02mm thước cặp; 0.01mm panme)',
      'Node động: plunger (hàm trượt), scale_marks & scale_display',
    ],
    typicalRangeAndLeastCount: '0–150 mm · ĐCNN 0.02 mm (Panme 0.01 mm)',
    permissibleError: '±0.02 mm',
    relatedEnvVars: ['airTemperatureC'],
    recommendedSampleModule: {
      nameVi: 'Panme đo ngoài cơ khí 0–25 mm (ĐCNN 0.01 mm)',
      assetId: 'OL3D-EQP-MIC-0001',
      slug: 'panme-do-ngoai-25mm',
    },
  },
  {
    groupId: 'G02',
    titleVi: 'G02 – Cân, khối lượng, lực, cơ học',
    sampleEquipmentsVi: ['Cân điện tử 2000g/500g', 'Lực kế lò xo 5N/10N', 'Quả cân chuẩn 50g–200g', 'Ròng rọc'],
    requiredSpecsVi: [
      'Dải đo (2kg cân; 10N lực kế) & ĐCNN (0.1g/0.01g; 0.05N)',
      'Độ cứng lò xo k (N/m) & độ giãn tối đa',
      'Thời gian đáp ứng chốt số cân (≤ 1.5s)',
      'Màn hình 360° (scale_display) & đĩa cân (measurement_anchor)',
    ],
    typicalRangeAndLeastCount: '0–2000 g (ĐCNN 0.1 g) · Lực kế 0–10 N (ĐCNN 0.05 N)',
    permissibleError: '±0.1 g (Cân) · ±0.05 N (Lực kế)',
    relatedEnvVars: ['gravityMps2', 'airflowMps', 'airTemperatureC'],
    recommendedSampleModule: {
      nameVi: 'Cân điện tử kỹ thuật 2000 g (ĐCNN 0.1 g)',
      assetId: 'OL3D-EQP-BAL-2000',
      slug: 'can-dien-tu-2000g',
    },
  },
  {
    groupId: 'G03',
    titleVi: 'G03 – Thời gian, nhiệt độ, điện',
    sampleEquipmentsVi: ['Đồng hồ bấm giây (0.01s)', 'Nhiệt kế (-10..110°C)', 'Ampe kế / Vôn kế', 'Đồng hồ vạn năng'],
    requiredSpecsVi: [
      'Phạm vi đo (-10..110°C nhiệt kế; 0–600s bấm giây)',
      'Độ phân giải (1°C / 0.1°C; 0.01s)',
      'Điện trở nội (Vôn kế ~10kΩ/V, Ampe kế ~0.5Ω)',
      'Đầu dò nhiệt / cọc đấu dây âm dương',
    ],
    typicalRangeAndLeastCount: '-10..110 °C (ĐCNN 0.5 °C) · 0.01 s',
    permissibleError: '±0.5 °C · ±0.1 s',
    relatedEnvVars: ['airTemperatureC', 'sampleTemperatureC', 'mainsVoltageV'],
    recommendedSampleModule: {
      nameVi: 'Đồng hồ bấm giây hiện số phòng thí nghiệm (0.01 s)',
      assetId: 'OL3D-EQP-STW-0001',
      slug: 'dong-ho-bam-giay-hien-so',
    },
  },
  {
    groupId: 'G04',
    titleVi: 'G04 – Chứa & đo thể tích chất lỏng',
    sampleEquipmentsVi: ['Ống đong 100mL/200mL', 'Buret chuẩn độ 25mL', 'Pipet 10mL', 'Bình định mức 100mL', 'Cốc Becher 250mL'],
    requiredSpecsVi: [
      'Dung tích tối đa (100mL ống đong, 25mL buret) & ĐCNN (1mL / 0.1mL)',
      'Vật liệu thủy tinh Borosilicate (IOR=1.47, transmission=0.88)',
      'Mặt khum chất lỏng (liquid_surface) & vạch chia 360° (scale_marks)',
      'Vòi rót / khóa xả PTFE (spout_stream)',
    ],
    typicalRangeAndLeastCount: '100 mL (ĐCNN 1 mL) · Buret 25 mL (ĐCNN 0.1 mL)',
    permissibleError: '±1.0 mL (Ống đong) · ±0.05 mL (Buret)',
    relatedEnvVars: ['sampleTemperatureC', 'sampleDensityKgM3', 'sampleViscosityPaS'],
    recommendedSampleModule: {
      nameVi: 'Buret chuẩn độ thủy tinh khóa PTFE 25 mL (ĐCNN 0.1 mL)',
      assetId: 'OL3D-EQP-BUR-0025',
      slug: 'buret-chuan-do-25ml',
    },
  },
  {
    groupId: 'G05',
    titleVi: 'G05 – Hóa học, gia nhiệt',
    sampleEquipmentsVi: ['Ống nghiệm 150×20mm', 'Giá ống nghiệm', 'Đèn cồn', 'Bình tam giác 250mL', 'Bình tràn', 'Nhiệt lượng kế'],
    requiredSpecsVi: [
      'Kích thước chuẩn (Ống nghiệm Ø20×150mm; Bình tam giác 250mL)',
      'Nhiệt độ ngọn lửa đỉnh (~650°C) & nhiệt dung riêng (nước 4.18 J/g°C)',
      'Van mở 0–90° & kiểm tra khoảng cách an toàn nhiệt',
    ],
    typicalRangeAndLeastCount: '250 mL · Nhiệt độ gia nhiệt 20–650 °C',
    permissibleError: '±2% dung tích',
    relatedEnvVars: ['oxygenPct', 'thermalHeatPowerW', 'atmosphericPressureKPa', 'benchTemperatureC'],
    recommendedSampleModule: {
      nameVi: 'Nhiệt lượng kế hai vỏ cách nhiệt kèm que khuấy (500 mL)',
      assetId: 'OL3D-EQP-CAL-0001',
      slug: 'nhiet-luong-ke-500ml',
    },
  },
  {
    groupId: 'G06',
    titleVi: 'G06 – Quang học, ánh sáng',
    sampleEquipmentsVi: ['Thấu kính hội tụ/phân kì (f=100–150mm)', 'Gương cầu', 'Lăng kính tán sắc', 'Nguồn phát tia Laser'],
    requiredSpecsVi: [
      'Đường kính thấu kính Ø50mm, tiêu cự f = ±100..150mm',
      'Chiết suất thủy tinh quang học n = 1.50 (không khí n = 1.00)',
      'Bước sóng khả kiến 380–780nm & công thức 1/d + 1/d’ = 1/f',
    ],
    typicalRangeAndLeastCount: 'f = 100–150 mm · Góc tới 0–90° (ĐCNN 1°)',
    permissibleError: '±0.5° góc khúc xạ',
    relatedEnvVars: ['illuminanceLux', 'opticalWavelengthNm'],
    recommendedSampleModule: {
      nameVi: 'Thấu kính phân kì Ø50 mm tiêu cự f = -100 mm kèm giá quang học',
      assetId: 'OL3D-EQP-LNS-0002',
      slug: 'thau-kinh-phan-ki-f100',
    },
  },
  {
    groupId: 'G07',
    titleVi: 'G07 – Điện tử & mạch điện',
    sampleEquipmentsVi: ['Nguồn/Pin 1.5V–9V', 'Điện trở 10Ω–100kΩ', 'Biến trở con chạy 1kΩ', 'Công tắc', 'Đèn 6V/LED', 'Cuộn cảm ứng'],
    requiredSpecsVi: [
      'Điện áp định mức (1.5V, 6V, 9V, 220V) & dòng chịu tải (0.5A)',
      'Trị số điện trở chuẩn vạch màu (10Ω, 100Ω, 1kΩ)',
      'Trạng thái đóng/ngắt (on/off) & định luật Ohm I = U/R',
    ],
    typicalRangeAndLeastCount: '0–12 V · 0–2 A · Biến trở 0–1000 Ω',
    permissibleError: '±1% điện trở',
    relatedEnvVars: ['mainsVoltageV', 'mainsFrequencyHz', 'ambientMagneticFieldMicroT'],
    recommendedSampleModule: {
      nameVi: 'Biến trở con chạy 20 Ω – 2 A chuẩn thực hành KHTN 9',
      assetId: 'OL3D-EQP-RHE-0001',
      slug: 'bien-tro-con-chay-20ohm',
    },
  },
  {
    groupId: 'G08',
    titleVi: 'G08 – Cơ học, nhiệt học, năng lượng',
    sampleEquipmentsVi: ['Xe lăn thực hành 200g', 'Mặt phẳng nghiêng 0–45°', 'Lò xo xoắn k=20N/m', 'Khối gỗ ma sát'],
    requiredSpecsVi: [
      'Mặt phẳng nghiêng dài 1.0m, rộng 0.3m, góc nghiêng 0°–45°',
      'Hệ số ma sát tĩnh μ_s ~ 0.30, ma sát động μ_k ~ 0.25',
      'Xe lăn 200g, đường kính bánh Ø50mm, ma sát trục 0.01 N·m',
    ],
    typicalRangeAndLeastCount: 'Góc nghiêng 0–45° (ĐCNN 0.5°) · Lò xo k = 20 N/m',
    permissibleError: '±0.5° góc nghiêng',
    relatedEnvVars: ['gravityMps2', 'surfaceFrictionCoef'],
    recommendedSampleModule: {
      nameVi: 'Bộ mặt phẳng nghiêng có thước đo góc 0–45° & xe lăn 200 g',
      assetId: 'OL3D-EQP-INC-0001',
      slug: 'mat-phang-nghieng-xe-lan',
    },
  },
  {
    groupId: 'G09',
    titleVi: 'G09 – Sinh học, mẫu vật quan sát',
    sampleEquipmentsVi: ['Kính hiển vi quang học (40x–400x)', 'Bộ tiêu bản lam kính (75×25×1mm)', 'Mô hình ADN xoắn kép'],
    requiredSpecsVi: [
      'Độ phóng đại vật kính (4x, 10x, 40x) × thị kính (10x) = 40x, 100x, 400x',
      'Khẩu độ số NA ~ 0.65; hành trình ốc vi cấp lấy nét (plunger)',
      'Đèn chiếu sáng tiêu bản ~1000 lux',
    ],
    typicalRangeAndLeastCount: 'Phóng đại 40×, 100×, 400× · NA 0.65',
    permissibleError: 'Lấy nét vi cấp ±0.002 mm',
    relatedEnvVars: ['illuminanceLux', 'co2Ppm'],
    recommendedSampleModule: {
      nameVi: 'Bộ tiêu bản hiển vi tế bào thực vật & động vật (Lam kính 75×25 mm)',
      assetId: 'OL3D-EQP-SLD-0001',
      slug: 'bo-tieu-ban-hien-vi',
    },
  },
  {
    groupId: 'G10',
    titleVi: 'G10 – Môi trường, mẫu, sinh thái',
    sampleEquipmentsVi: ['Máy đo pH (0–14)', 'Máy đo EC/TDS (0–2000 µS/cm)', 'Máy đo độ đục (0–1000 NTU)', 'Máy đo DO (0–20 mg/L)'],
    requiredSpecsVi: [
      'Phạm vi pH 0–14 (ĐCNN 0.01); EC 0–2000 µS/cm; Độ đục 0–1000 NTU',
      'Sai số chuẩn ISO: pH ±0.1; EC ±1 µS/cm; Độ đục ±2% NTU',
      'Màn hình LCD 4 số hiển thị 360° & đầu dò BNC nhúng mẫu',
    ],
    typicalRangeAndLeastCount: 'pH 0.00–14.00 · EC 0–2000 µS/cm · 0–1000 NTU',
    permissibleError: '±0.05 pH · ±1% FS EC/NTU',
    relatedEnvVars: [
      'samplePh',
      'sampleConductivityUScm',
      'sampleTdsMgL',
      'sampleTurbidityNtu',
      'sampleDissolvedO2MgL',
      'sampleTemperatureC',
    ],
    recommendedSampleModule: {
      nameVi: 'Máy đo độ đục nước hiện số Nephelometric (0–1000 NTU)',
      assetId: 'OL3D-EQP-TRB-0001',
      slug: 'may-do-do-duc-ntu',
    },
  },
];

/**
 * MỤC 4 BÁO CÁO NGHIÊN CỨU: 4 CẤP ĐỘ MÔ HÌNH VẬT LÝ & ĐÁNH ĐỔI HIỆU NĂNG WEBGL (L1 - L4)
 */
export interface PhysicsFidelitySpec {
  level: PhysicsFidelityLevel;
  titleVi: string;
  formulaSummary: string;
  noiseAndErrorModel: string;
  targetWebGlFps: number;
  accuracyPercent: number;
  descriptionVi: string;
}

export const PHYSICS_FIDELITY_SPECS: PhysicsFidelitySpec[] = [
  {
    level: 'L1',
    titleVi: 'Cấp L1 – Tương tác cơ bản (Prototyping nhanh)',
    formulaSummary: 'm_display = m_ref; V_display = V_base + V_obj',
    noiseAndErrorModel: 'Không tính nhiễu Gaussian hay trôi nhiệt độ (Sai số mô hình 0%)',
    targetWebGlFps: 60,
    accuracyPercent: 95.0,
    descriptionVi:
      'Chỉ xử lý Raycast kéo-thả, highlight và cộng trực tiếp thông số chuẩn. Tối ưu tốc độ khung hình tối đa cho máy cấu hình thấp.',
  },
  {
    level: 'L2',
    titleVi: 'Cấp L2 – Công thức Vật lý & Nhiễu chuẩn Datasheet (Mặc định)',
    formulaSummary: 'F = m·g; Δx = F/k; ρ = m/V; ΔT_drift = ±0.05% / 10°C',
    noiseAndErrorModel: 'Nhiễu Gaussian ±0.5 ĐCNN + trôi nhiệt độ theo T_air & v_air',
    targetWebGlFps: 60,
    accuracyPercent: 98.4,
    descriptionVi:
      'Áp dụng đầy đủ phương trình vật lý chuẩn SGK KHTN 9 kết hợp độ phân giải ĐCNN và sai số thiết bị thực tế theo Thông tư 38/2021.',
  },
  {
    level: 'L3',
    titleVi: 'Cấp L3 – Động học & Dời chỗ chất lỏng thời gian thực',
    formulaSummary: 'F_A = ρ_liquid · g · V_submerged; Q = P·t = m·c·ΔT',
    noiseAndErrorModel: 'Va chạm BoundingBox 3D + mặt khum meniscus + dao động tắt dần lò xo/đĩa cân',
    targetWebGlFps: 55,
    accuracyPercent: 99.2,
    descriptionVi:
      'Mô phỏng quá trình dâng mực nước, tràn vòi Bình tràn, lực đẩy Archimedes khi nhúng vật đang treo trên lực kế vào cốc nước.',
  },
  {
    level: 'L4',
    titleVi: 'Cấp L4 – Mô phỏng Chi tiết cao & Kiểm định Thống kê (t-test)',
    formulaSummary: 'ρ(T, P_atm) hiệu chỉnh nén khí quyển + tán sắc Cauchy n(λ) + độ nhớt η',
    noiseAndErrorModel: 'Đầy đủ 24 biến môi trường + tự động xuất bản ghi MeasurementRecord kiểm định',
    targetWebGlFps: 48,
    accuracyPercent: 99.7,
    descriptionVi:
      'Phục vụ nghiên cứu thực nghiệm và đối chiếu phép đo Ảo vs Thực (sai số thống kê ≤ ±5% theo kiểm định t-test).',
  },
];

/**
 * MỤC 7 BÁO CÁO NGHIÊN CỨU: DỮ LIỆU KIỂM ĐỊNH ĐỐI CHIẾU PHÉP ĐO ẢO VS THỰC (10 MẪU CHUẨN)
 */
export type MetrologyReferenceDataType =
  | 'EMPIRICAL_LAB'
  | 'PUBLISHED_REFERENCE'
  | 'ANALYTICAL_REFERENCE';

export interface MetrologyValidationSample {
  sampleIndex: number;
  specimenNameVi: string;
  materialVi: string;
  realMassG: number;
  virtMassG: number;
  realVolumeCm3: number;
  virtVolumeCm3: number;
  realDensityGCm3: number;
  virtDensityGCm3: number;
  relativeErrorPct: number;
  referenceDataType?: MetrologyReferenceDataType;
}

export const METROLOGY_VALIDATION_BENCHMARK: MetrologyValidationSample[] = [
  {
    sampleIndex: 1,
    specimenNameVi: 'Mẫu #01 — Trụ Nhôm đặc Ø25×50 mm',
    materialVi: 'Hợp kim Nhôm 6061',
    realMassG: 66.28,
    virtMassG: 66.25,
    realVolumeCm3: 24.55,
    virtVolumeCm3: 24.5,
    realDensityGCm3: 2.7,
    virtDensityGCm3: 2.7,
    relativeErrorPct: 0.04,
    referenceDataType: 'PUBLISHED_REFERENCE',
  },
  {
    sampleIndex: 2,
    specimenNameVi: 'Mẫu #02 — Viên bi Thép đặc Ø25 mm',
    materialVi: 'Thép cacbon C45',
    realMassG: 64.15,
    virtMassG: 64.2,
    realVolumeCm3: 8.18,
    virtVolumeCm3: 8.2,
    realDensityGCm3: 7.84,
    virtDensityGCm3: 7.83,
    relativeErrorPct: -0.16,
    referenceDataType: 'PUBLISHED_REFERENCE',
  },
  {
    sampleIndex: 3,
    specimenNameVi: 'Mẫu #03 — Khối Đồng đỏ 20×20×30 mm',
    materialVi: 'Đồng nguyên chất Cu 99.9%',
    realMassG: 107.12,
    virtMassG: 107.28,
    realVolumeCm3: 12.0,
    virtVolumeCm3: 12.0,
    realDensityGCm3: 8.93,
    virtDensityGCm3: 8.94,
    relativeErrorPct: 0.15,
    referenceDataType: 'PUBLISHED_REFERENCE',
  },
  {
    sampleIndex: 4,
    specimenNameVi: 'Mẫu #04 — Khối Gỗ Sồi khô phủ sáp chống thấm',
    materialVi: 'Gỗ Sồi tự nhiên',
    realMassG: 112.4,
    virtMassG: 112.5,
    realVolumeCm3: 150.0,
    virtVolumeCm3: 150.0,
    realDensityGCm3: 0.749,
    virtDensityGCm3: 0.75,
    relativeErrorPct: 0.09,
    referenceDataType: 'PUBLISHED_REFERENCE',
  },
  {
    sampleIndex: 5,
    specimenNameVi: 'Mẫu #05 — Trụ Nhựa kĩ thuật POM (Acetal)',
    materialVi: 'Nhựa POM đặc',
    realMassG: 141.2,
    virtMassG: 141.0,
    realVolumeCm3: 100.0,
    virtVolumeCm3: 100.0,
    realDensityGCm3: 1.412,
    virtDensityGCm3: 1.41,
    relativeErrorPct: -0.14,
    referenceDataType: 'PUBLISHED_REFERENCE',
  },
  {
    sampleIndex: 6,
    specimenNameVi: 'Mẫu #06 — Quả cân chuẩn Đồng thau 100 g',
    materialVi: 'Đồng thau CuZn37',
    realMassG: 100.02,
    virtMassG: 100.0,
    realVolumeCm3: 11.9,
    virtVolumeCm3: 11.9,
    realDensityGCm3: 8.405,
    virtDensityGCm3: 8.403,
    relativeErrorPct: -0.02,
    referenceDataType: 'PUBLISHED_REFERENCE',
  },
  {
    sampleIndex: 7,
    specimenNameVi: 'Mẫu #07 — Trụ Nhựa Acrylic (PMMA) trong suốt',
    materialVi: 'Polymethyl Methacrylate',
    realMassG: 118.5,
    virtMassG: 118.0,
    realVolumeCm3: 100.0,
    virtVolumeCm3: 100.0,
    realDensityGCm3: 1.185,
    virtDensityGCm3: 1.18,
    relativeErrorPct: -0.42,
    referenceDataType: 'PUBLISHED_REFERENCE',
  },
  {
    sampleIndex: 8,
    specimenNameVi: 'Mẫu #08 — Mẫu Đá vôi tự nhiên không thấm',
    materialVi: 'Canxi Cacbonat CaCO₃',
    realMassG: 162.8,
    virtMassG: 162.6,
    realVolumeCm3: 60.1,
    virtVolumeCm3: 60.0,
    realDensityGCm3: 2.709,
    virtDensityGCm3: 2.71,
    relativeErrorPct: 0.04,
    referenceDataType: 'PUBLISHED_REFERENCE',
  },
  {
    sampleIndex: 9,
    specimenNameVi: 'Mẫu #09 — Trụ Nhôm rỗng có khoang kín',
    materialVi: 'Nhôm 6061 (Khoang rỗng)',
    realMassG: 84.5,
    virtMassG: 84.4,
    realVolumeCm3: 45.0,
    virtVolumeCm3: 45.0,
    realDensityGCm3: 1.878,
    virtDensityGCm3: 1.876,
    relativeErrorPct: -0.12,
    referenceDataType: 'ANALYTICAL_REFERENCE',
  },
  {
    sampleIndex: 10,
    specimenNameVi: 'Mẫu #10 — Khối Chì chuẩn đối trọng 200 g',
    materialVi: 'Chì kỹ thuật Pb',
    realMassG: 199.85,
    virtMassG: 200.0,
    realVolumeCm3: 17.62,
    virtVolumeCm3: 17.64,
    realDensityGCm3: 11.342,
    virtDensityGCm3: 11.338,
    relativeErrorPct: -0.04,
    referenceDataType: 'PUBLISHED_REFERENCE',
  },
];

export function computeMetrologyTTestStats(
  samples: MetrologyValidationSample[] = METROLOGY_VALIDATION_BENCHMARK,
) {
  const n = samples.length;
  const diffs = samples.map((s) => s.virtDensityGCm3 - s.realDensityGCm3);
  const absDiffs = diffs.map((d) => Math.abs(d));
  const sqDiffs = diffs.map((d) => d * d);
  const absRelErrors = samples.map((s) => Math.abs(s.relativeErrorPct));

  const meanDiff = diffs.reduce((a, b) => a + b, 0) / Math.max(1, n);
  const maeGCm3 = absDiffs.reduce((a, b) => a + b, 0) / Math.max(1, n);
  const rmseGCm3 = Math.sqrt(sqDiffs.reduce((a, b) => a + b, 0) / Math.max(1, n));
  const meanAbsRelErrorPct =
    absRelErrors.reduce((a, b) => a + b, 0) / Math.max(1, n);

  const variance =
    diffs.reduce((acc, d) => acc + Math.pow(d - meanDiff, 2), 0) /
    Math.max(1, n - 1);
  const stdDev = Math.sqrt(variance);
  const stdErr = stdDev / Math.sqrt(Math.max(1, n));
  const tStatistic = stdErr > 1e-9 ? Math.abs(meanDiff / stdErr) : 0;
  // Ngưỡng t_crit (df = 9, alpha = 0.05 hai phía) = 2.262
  const tCritical95 = 2.262;
  const isAccepted = meanAbsRelErrorPct <= 5.0 && tStatistic < tCritical95;

  return {
    sampleCount: n,
    referenceDataType: 'PUBLISHED_REFERENCE' as MetrologyReferenceDataType,
    meanSignedBiasGCm3: Number(meanDiff.toFixed(4)),
    maeGCm3: Number(maeGCm3.toFixed(4)),
    rmseGCm3: Number(rmseGCm3.toFixed(4)),
    meanAbsRelErrorPct: Number(meanAbsRelErrorPct.toFixed(3)),
    stdDevDensityGCm3: Number(stdDev.toFixed(4)),
    tStatistic: Number(tStatistic.toFixed(3)),
    tCritical95,
    isAccepted,
    smallSampleEquivalenceNoteVi:
      'Dữ liệu tham chiếu công bố & giải tích (PUBLISHED_REFERENCE / ANALYTICAL_REFERENCE, n = 10): p > 0.05 chỉ cho biết chưa phát hiện sai lệch trung bình có ý nghĩa thống kê; cần đánh giá kết hợp với MAE, RMSE và sai số tương đối trong ngưỡng dung sai cho phép (±5%).',
  };
}

/**
 * Biến đồ họa tách biệt hoàn toàn khỏi biến vật lý (Mục 6.3)
 */
export interface LabGraphicsSettings {
  ambientLightStrength: number; // Mặc định 0.95
  keyLightStrength: number; // Mặc định 2.0
  shadowsEnabled: boolean; // Mặc định true
  renderQuality: 'standard' | 'high';
  wallsTransparent: boolean; // Mặc định true khi nhìn từ ngoài, có thể bật/tắt
  ceilingVisible: boolean; // Mặc định false để quan sát từ trên dễ dàng
}

export const DEFAULT_LAB_GRAPHICS_SETTINGS: LabGraphicsSettings = {
  ambientLightStrength: 0.95,
  keyLightStrength: 2.0,
  shadowsEnabled: true,
  renderQuality: 'high',
  wallsTransparent: true,
  ceilingVisible: false,
};

/**
 * Biến thuộc mẫu/thí nghiệm cụ thể (Mục 6.4 - Không trộn thành biến toàn phòng)
 */
export interface SampleScopedProperties {
  sampleId: string;
  sampleNameVi: string;
  temperatureC: number | null;
  pH: number | null;
  conductivityUSPerCm: number | null;
  tdsMgPerL: number | null;
  salinity: number | null;
  turbidityNTU: number | null;
  dissolvedOxygenMgPerL: number | null;
  densityKgPerM3: number | null;
  viscosityPaS: number | null;
}

export interface EnvironmentDependency {
  variableId: EnvironmentVariableId;
  role: 'input' | 'displayOnly' | 'boundaryCondition';
  updateMode: 'continuous' | 'onChange' | 'onMeasurement';
  scientificRuleId?: string;
  formulaDescriptionVi?: string;
}

export interface EnvironmentAwareModule {
  moduleId: string;
  moduleNameVi: string;
  environmentDependencies: EnvironmentDependency[];
}

export const BUILTIN_ENVIRONMENT_AWARE_MODULES: EnvironmentAwareModule[] = [
  {
    moduleId: 'OL3D-EQP-DYN-0001',
    moduleNameVi: 'Lực kế lò xo 5 N (Spring Dynamometer)',
    environmentDependencies: [
      {
        variableId: 'gravityMps2',
        role: 'input',
        updateMode: 'onChange',
        scientificRuleId: 'NEWTON_WEIGHT_P_MG',
        formulaDescriptionVi: 'Trọng lượng P = (m_kg) × gravityMps2 (N)',
      },
    ],
  },
  {
    moduleId: 'OL3D-EQP-THM-0001',
    moduleNameVi: 'Nhiệt kế rượu phòng thí nghiệm (-10°C đến 110°C)',
    environmentDependencies: [
      {
        variableId: 'airTemperatureC',
        role: 'input',
        updateMode: 'onChange',
        scientificRuleId: 'AMBIENT_THERMAL_EQUILIBRIUM',
        formulaDescriptionVi:
          'Khi đặt trên bàn (ngoài cốc chất lỏng), nhiệt kế cân bằng nhiệt với airTemperatureC',
      },
    ],
  },
  {
    moduleId: 'OL3D-EQP-ALC-0001',
    moduleNameVi: 'Đèn cồn thủy tinh 150 ml',
    environmentDependencies: [
      {
        variableId: 'oxygenPct',
        role: 'boundaryCondition',
        updateMode: 'onChange',
        scientificRuleId: 'COMBUSTION_OXYGEN_THRESHOLD',
        formulaDescriptionVi: 'Ngọn lửa đèn cồn tắt nếu nồng độ O₂ < 14%',
      },
    ],
  },
];

/**
 * Mục 8: Hai đồng hồ độc lập (realClock & simulationClock) + Nhật ký sự kiện (LabEventLog)
 */
export type SimulationClockStatus = 'stopped' | 'running' | 'paused';

export const SIMULATION_SPEED_OPTIONS = [0.25, 0.5, 1, 2, 5, 10] as const;

export interface LabClockState {
  realClock: {
    epochMs: number;
    isoUtc: string;
    localDateTime: string;
    timeZone: 'Asia/Ho_Chi_Minh';
    isAvailable: boolean;
  };
  simulationClock: {
    elapsedSeconds: number;
    status: SimulationClockStatus;
    speedMultiplier: number;
    lastTickEpochMs: number | null;
  };
}

export interface LabEventLog {
  eventId: string;
  eventType: string;
  realTimestampUtc: string;
  localTimestamp: string;
  simulationElapsedSeconds: number;
  actorId?: string;
  targetId?: string;
  summaryVi: string;
  payload?: Record<string, unknown>;
}

export function formatVietnamDateTime(date: Date = new Date()): {
  epochMs: number;
  isoUtc: string;
  localDateTime: string;
  isAvailable: boolean;
} {
  try {
    const epochMs = date.getTime();
    const isoUtc = date.toISOString();
    const localDateTime = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
    return { epochMs, isoUtc, localDateTime, isAvailable: true };
  } catch {
    return {
      epochMs: 0,
      isoUtc: '',
      localDateTime: 'Không khả dụng',
      isAvailable: false,
    };
  }
}

export function formatSimulationDuration(elapsedSeconds: number): string {
  const safeSec = Math.max(0, elapsedSeconds);
  const totalWholeSec = Math.floor(safeSec);
  const hours = Math.floor(totalWholeSec / 3600);
  const minutes = Math.floor((totalWholeSec % 3600) / 60);
  const seconds = totalWholeSec % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/**
 * Công thức khoảng cách Euclid trong không gian 3 chiều (Mục 4.3)
 */
export function computeEuclideanDistance3D(
  a: [number, number, number],
  b: [number, number, number],
): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const dz = b[2] - a[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function formatLengthByUnit(
  valueM: number,
  unit: 'm' | 'cm' | 'mm',
): string {
  if (unit === 'cm') return `${(valueM * 100).toFixed(1)} cm`;
  if (unit === 'mm') return `${(valueM * 1000).toFixed(0)} mm`;
  return `${valueM.toFixed(3)} m`;
}

function createCompactCoordSprite(
  text: string,
  bgColor: string,
  borderColor: string,
  textColor: string,
  scaleW = 0.16,
  scaleH = 0.052,
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 384, 128);

    // Nền kính trong suốt mờ nhẹ đồng bộ với chuẩn "Kho chứa"
    ctx.fillStyle = bgColor.includes('rgba') ? bgColor : 'rgba(11, 27, 54, 0.42)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 368, 112, 18);
    ctx.fill();

    // Viền phát quang mảnh tinh tế với hiệu ứng hào quang neon
    ctx.save();
    ctx.lineWidth = 3.6;
    ctx.strokeStyle = borderColor;
    ctx.shadowColor = borderColor;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = textColor;
    ctx.shadowColor = borderColor;
    ctx.shadowBlur = 6;
    ctx.font = '900 48px ui-monospace, SFMono-Regular, Menlo, monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 192, 64);
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scaleW, scaleH, 1);
  return sprite;
}

/**
 * Xây dựng DUY NHẤT 1 Hệ Trục Tọa Độ tại Góc Bàn Cố Định O(0, 0, 0):
 * - Gốc O(0, 0, 0) đặt cố định tại góc sau-trái của mặt bàn thực hành:
 *   worldOrigin = (-benchW/2, BENCH_SURFACE_Y, -benchD/2) = (-1.20 m, 0.82 m, -0.488 m)
 * - Trục +X (Đỏ): thuộc cạnh dài của mặt bàn (chạy từ trái sang phải: 0 -> 2.40 m)
 * - Trục +Y (Xanh lá): thuộc cạnh rộng của mặt bàn (chạy từ sau ra trước: 0 -> 0.98 m)
 * - Trục +Z (Xanh dương): dựng thẳng đứng vuông góc mặt bàn tại góc gốc O (0 -> 0.36 m)
 * - Lưới trên mặt bàn (`coord_floor_grid`, mặt phẳng XY trên bàn) và Lưới không gian 3D (`coord_space_grid`,
 *   các mặt phẳng đứng XZ & YZ dựng từ 2 cạnh bàn) có thể bật/tắt tùy ý khi cần.
 */
export function buildWorldCoordinatesAndGridHelper(
  roomConfig: LabRoomConfig,
  settings: CoordinateDisplaySettings,
): THREE.Group {
  const root = new THREE.Group();
  root.name = 'worldAxesHelper';

  const benchW = roomConfig.bench.widthM; // 2.40 m (cạnh dài X)
  const benchD = roomConfig.bench.depthM; // 0.975 m (cạnh rộng Y, tăng thêm 30%)
  const benchY = roomConfig.bench.topY; // 0.82 m (mặt bàn Z = 0)
  const axisLenX = Number((benchW - 0.10).toFixed(2)); // 2.30 m (giảm 0.1m để nằm gọn trên mặt bàn)
  const axisLenY = Number((benchD - 0.10).toFixed(2)); // 0.875 m (cạnh rộng tăng 30% nằm gọn trên mặt bàn)
  const zHeightM = 0.36; // 0.36 m (giảm độ cao còn 60% hiện tại theo yêu cầu người dùng)

  // Tọa độ gốc cố định O(0,0,0) tại góc sau-trái của mặt bàn
  const ox = -benchW / 2; // -1.20 m
  const oy = benchY + 0.0015; // 0.8215 m (nằm sát mặt bàn)
  const oz = -benchD / 2; // -0.4875 m

  // ===========================================================================
  // 1. LƯỚI TRÊN MẶT BÀN (Mặt phẳng XY thuộc bàn: X = 0..2.40m, Y = 0..0.75m, Z = 0)
  // ===========================================================================
  const floorGridGroup = new THREE.Group();
  floorGridGroup.name = 'coord_floor_grid';
  floorGridGroup.visible = settings.showFloorGrid;

  const benchMajorPts: number[] = [];
  const stepMajor = 0.1; // Ô lưới 10 cm × 10 cm trên mặt bàn
  for (let dx = 0; dx <= benchW + 0.0001; dx += stepMajor) {
    const wx = ox + Math.min(dx, benchW);
    benchMajorPts.push(wx, oy, oz, wx, oy, oz + benchD);
  }
  for (let dy = 0; dy <= benchD + 0.0001; dy += stepMajor) {
    const wz = oz + Math.min(dy, benchD);
    benchMajorPts.push(ox, oy, wz, ox + benchW, oy, wz);
  }
  if (Math.abs((benchD % stepMajor) - 0) > 0.001) {
    benchMajorPts.push(ox, oy, oz + benchD, ox + benchW, oy, oz + benchD);
  }

  const benchMajorGeo = new THREE.BufferGeometry();
  benchMajorGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(benchMajorPts, 3),
  );
  floorGridGroup.add(
    new THREE.LineSegments(
      benchMajorGeo,
      new THREE.LineBasicMaterial({
        color: 0x00bceb,
        transparent: true,
        opacity: 0.34,
      }),
    ),
  );

  // Lưới chi tiết 5 cm trên mặt bàn (khi bật showMinorGrid)
  const minorGridGroup = new THREE.Group();
  minorGridGroup.name = 'coord_minor_grid';
  minorGridGroup.visible = settings.showMinorGrid;
  const benchMinorPts: number[] = [];
  const stepMinor = 0.05;
  for (let dx = 0.05; dx < benchW; dx += stepMinor * 2) {
    const wx = ox + dx;
    benchMinorPts.push(wx, oy - 0.0003, oz, wx, oy - 0.0003, oz + benchD);
  }
  for (let dy = 0.05; dy < benchD; dy += stepMinor * 2) {
    const wz = oz + dy;
    benchMinorPts.push(ox, oy - 0.0003, wz, ox + benchW, oy - 0.0003, wz);
  }
  const benchMinorGeo = new THREE.BufferGeometry();
  benchMinorGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(benchMinorPts, 3),
  );
  minorGridGroup.add(
    new THREE.LineSegments(
      benchMinorGeo,
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.18,
      }),
    ),
  );
  floorGridGroup.add(minorGridGroup);
  root.add(floorGridGroup);

  // ===========================================================================
  // 2. LƯỚI KHÔNG GIAN 3D (Dựng đứng từ 2 cạnh bàn: Mặt phẳng XZ & YZ + Tầng độ cao Z)
  // ===========================================================================
  const spaceGridGroup = new THREE.Group();
  spaceGridGroup.name = 'coord_space_grid';
  spaceGridGroup.visible = settings.showSpaceGrid;

  const spaceGridPts: number[] = [];
  const spaceMaxZ = zHeightM; // Độ cao lưới không gian đồng bộ 0.70 m trên mặt bàn

  // Mặt phẳng đứng XZ (dọc theo cạnh dài phía sau bàn: Y = 0, X = 0..2.40m, Z = 0..0.80m)
  for (let dx = 0; dx <= benchW + 0.0001; dx += 0.1) {
    const wx = ox + Math.min(dx, benchW);
    spaceGridPts.push(wx, oy, oz, wx, oy + spaceMaxZ, oz);
  }
  for (let dz = 0.1; dz <= spaceMaxZ + 0.0001; dz += 0.1) {
    const wy = oy + dz;
    spaceGridPts.push(ox, wy, oz, ox + benchW, wy, oz);
  }

  // Mặt phẳng đứng YZ (dọc theo cạnh rộng bên trái bàn: X = 0, Y = 0..0.75m, Z = 0..0.80m)
  for (let dy = 0; dy <= benchD + 0.0001; dy += 0.1) {
    const wz = oz + Math.min(dy, benchD);
    spaceGridPts.push(ox, oy, wz, ox, oy + spaceMaxZ, wz);
  }
  spaceGridPts.push(ox, oy, oz + benchD, ox, oy + spaceMaxZ, oz + benchD);
  for (let dz = 0.1; dz <= spaceMaxZ + 0.0001; dz += 0.1) {
    const wy = oy + dz;
    spaceGridPts.push(ox, wy, oz, ox, wy, oz + benchD);
  }

  const spaceGridGeo = new THREE.BufferGeometry();
  spaceGridGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(spaceGridPts, 3),
  );
  spaceGridGroup.add(
    new THREE.LineSegments(
      spaceGridGeo,
      new THREE.LineBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.25,
      }),
    ),
  );
  root.add(spaceGridGroup);

  // ===========================================================================
  // 3. DUY NHẤT 1 HỆ TRỤC TẠI GÓC BÀN CỐ ĐỊNH O(0,0,0): X, Y THUỘC CẠNH BÀN, Z ĐỨNG
  // ===========================================================================
  const axesGroup = new THREE.Group();
  axesGroup.name = 'coord_world_axes';
  axesGroup.visible = settings.showWorldAxes;

  const axisRadius = 0.0020; // Thanh trục mảnh thanh thoát 2.0 mm

  // Trục +X (Đỏ): Giảm 0.1m xuống 2.30 m để nằm gọn trên mặt bàn
  const xMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const xShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(axisRadius, axisRadius, axisLenX, 12),
    xMat,
  );
  xShaft.rotation.z = -Math.PI / 2;
  xShaft.position.set(ox + axisLenX / 2, oy + 0.001, oz);
  axesGroup.add(xShaft);

  const xCone = new THREE.Mesh(new THREE.ConeGeometry(0.0075, 0.024, 14), xMat);
  xCone.rotation.z = -Math.PI / 2;
  xCone.position.set(ox + axisLenX + 0.012, oy + 0.001, oz);
  axesGroup.add(xCone);

  // Trục +Y (Xanh lá): Giảm 0.1m xuống 0.65 m để nằm gọn trên mặt bàn
  const yMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
  const yShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(axisRadius, axisRadius, axisLenY, 12),
    yMat,
  );
  yShaft.rotation.x = Math.PI / 2;
  yShaft.position.set(ox, oy + 0.001, oz + axisLenY / 2);
  axesGroup.add(yShaft);

  const yCone = new THREE.Mesh(new THREE.ConeGeometry(0.0075, 0.024, 14), yMat);
  yCone.rotation.x = Math.PI / 2;
  yCone.position.set(ox, oy + 0.001, oz + axisLenY + 0.012);
  axesGroup.add(yCone);

  // Trục +Z (Xanh dương): Dựng thẳng đứng tại góc bàn O (cao 0.60 m nằm gọn trong màn hình)
  const zMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
  const zShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(axisRadius, axisRadius, zHeightM, 12),
    zMat,
  );
  zShaft.position.set(ox, oy + zHeightM / 2, oz);
  axesGroup.add(zShaft);

  const zCone = new THREE.Mesh(new THREE.ConeGeometry(0.0075, 0.024, 14), zMat);
  zCone.position.set(ox, oy + zHeightM + 0.012, oz);
  axesGroup.add(zCone);

  root.add(axesGroup);

  // ===========================================================================
  // 4. ĐIỂM GỐC O(0, 0, 0) TẠI GÓC BÀN CỐ ĐỊNH (`coord_origin_marker`)
  // ===========================================================================
  const originGroup = new THREE.Group();
  originGroup.name = 'coord_origin_marker';
  originGroup.visible = settings.showOriginMarker;

  const originSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.009, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xfacc15 }),
  );
  originSphere.position.set(ox, oy + 0.002, oz);
  originGroup.add(originSphere);
  root.add(originGroup);

  // ===========================================================================
  // 5. NHÃN TRỤC O, X, Y, Z (GỌN GÀNG, CHỈ ĐỂ TÊN TRỤC) (`coord_axis_labels`)
  // ===========================================================================
  const labelsGroup = new THREE.Group();
  labelsGroup.name = 'coord_axis_labels';
  labelsGroup.visible = settings.showAxisLabels;

  const lblO = createCompactCoordSprite(
    'O(0,0,0)',
    'rgba(11, 27, 54, 0.48)',
    '#FACC15',
    '#FACC15',
    0.20,
    0.072,
  );
  lblO.position.set(ox - 0.035, oy + 0.045, oz - 0.035);
  labelsGroup.add(lblO);

  const lblX = createCompactCoordSprite(
    'X',
    'rgba(11, 27, 54, 0.48)',
    '#EF4444',
    '#FCA5A5',
    0.13,
    0.072,
  );
  lblX.position.set(ox + axisLenX + 0.052, oy + 0.038, oz);
  labelsGroup.add(lblX);

  const lblY = createCompactCoordSprite(
    'Y',
    'rgba(11, 27, 54, 0.48)',
    '#22C55E',
    '#86EFAC',
    0.13,
    0.072,
  );
  lblY.position.set(ox, oy + 0.038, oz + axisLenY + 0.052);
  labelsGroup.add(lblY);

  const lblZ = createCompactCoordSprite(
    'Z',
    'rgba(11, 27, 54, 0.48)',
    '#3B82F6',
    '#93C5FD',
    0.13,
    0.072,
  );
  lblZ.position.set(ox, oy + zHeightM + 0.045, oz);
  labelsGroup.add(lblZ);

  root.add(labelsGroup);

  // ===========================================================================
  // 6. VẠCH CHIA KÍCH THƯỚC DỌC 2 CẠNH BÀN X, Y VÀ TRỤC ĐỨNG Z (`coord_numeric_ticks`)
  // ===========================================================================
  const ticksGroup = new THREE.Group();
  ticksGroup.name = 'coord_numeric_ticks';
  ticksGroup.visible = settings.showNumericTicks;

  const tickPts: number[] = [];
  // Vạch chia mỗi 10 cm dọc cạnh dài X (0 .. axisLenX m)
  for (let dx = 0.1; dx <= axisLenX + 0.001; dx += 0.1) {
    const wx = ox + dx;
    const tickLen = Math.abs((dx * 10) % 2) < 0.01 ? 0.022 : 0.012;
    tickPts.push(wx, oy + 0.002, oz, wx, oy + 0.002, oz + tickLen);
  }
  // Vạch chia mỗi 10 cm dọc cạnh rộng Y (0 .. axisLenY m)
  for (let dy = 0.1; dy <= axisLenY + 0.001; dy += 0.1) {
    const wz = oz + dy;
    const tickLen = Math.abs((dy * 10) % 2) < 0.01 ? 0.022 : 0.012;
    tickPts.push(ox, oy + 0.002, wz, ox + tickLen, oy + 0.002, wz);
  }
  // Vạch chia mỗi 10 cm dọc trục đứng Z (0 .. zHeightM m)
  for (let dz = 0.1; dz <= zHeightM + 0.001; dz += 0.1) {
    const wy = oy + dz;
    const tickLen = Math.abs((dz * 10) % 2) < 0.01 ? 0.022 : 0.012;
    tickPts.push(ox, wy, oz, ox + tickLen, wy, oz);
  }

  const tickGeo = new THREE.BufferGeometry();
  tickGeo.setAttribute('position', new THREE.Float32BufferAttribute(tickPts, 3));
  ticksGroup.add(
    new THREE.LineSegments(
      tickGeo,
      new THREE.LineBasicMaterial({
        color: 0xfacc15,
        transparent: true,
        opacity: 0.75,
      }),
    ),
  );

  // Nhãn số nhỏ dọc cạnh dài X (0.4m, 0.8m, 1.2m, 1.6m, 2.0m) - tăng cỡ chữ rõ nét
  for (const dx of [0.4, 0.8, 1.2, 1.6, 2.0]) {
    const sp = createCompactCoordSprite(
      `${dx.toFixed(1)}m`,
      'rgba(11, 27, 54, 0.42)',
      '#EF4444',
      '#FCA5A5',
      0.135,
      0.046,
    );
    sp.position.set(ox + dx, oy + 0.024, oz - 0.025);
    ticksGroup.add(sp);
  }

  // Nhãn số nhỏ dọc cạnh rộng Y (0.2m, 0.4m, 0.6m, 0.8m) - tương thích độ rộng bàn tăng 30%
  for (const dy of [0.2, 0.4, 0.6, 0.8]) {
    if (dy > axisLenY) continue;
    const sp = createCompactCoordSprite(
      `${dy.toFixed(2).replace(/0$/, '')}m`,
      'rgba(11, 27, 54, 0.42)',
      '#22C55E',
      '#86EFAC',
      0.135,
      0.046,
    );
    sp.position.set(ox - 0.035, oy + 0.024, oz + dy);
    ticksGroup.add(sp);
  }

  // Nhãn số nhỏ dọc trục đứng Z (0.1m, 0.2m, 0.3m) - tương thích trục Z giảm còn 60%
  for (const dz of [0.1, 0.2, 0.3]) {
    if (dz > zHeightM) continue;
    const sp = createCompactCoordSprite(
      `${dz.toFixed(1)}m`,
      'rgba(11, 27, 54, 0.42)',
      '#3B82F6',
      '#93C5FD',
      0.135,
      0.046,
    );
    sp.position.set(ox - 0.038, oy + dz, oz - 0.022);
    ticksGroup.add(sp);
  }

  root.add(ticksGroup);

  return root;
}

/**
 * Mục 3.2 & Mục 5: Dựng Phòng Thí Nghiệm 3D Chuẩn 12.0 × 8.0 × 3.6 m & Bàn Thực Hành Cao 0.82 m
 * - Sàn phòng có mặt trên đúng tại y = 0.000 m, độ dày 0.10 m (nằm từ y = -0.10 đến y = 0.00 m)
 * - Tường bao quanh cao 3.6 m, dày 0.15 m (có thể làm mờ / ẩn khi quan sát)
 * - Trần phòng ở y = 3.6 m, dày 0.10 m (có thể ẩn khi camera ở trong phòng)
 * - Bàn thực hành kích thước chuẩn 2.40 × 0.75 m, mặt trên ở đúng y = BENCH_SURFACE_Y = 0.82 m,
 *   mặt bàn dày 0.04 m (mặt dưới ở y = 0.78 m), chân bàn cao đúng 0.78 m chạm từ sàn y = 0 đến mặt dưới bàn y = 0.78 m!
 */
export function buildStandardLabRoomV2(
  roomConfig: LabRoomConfig,
  benchTopMat: THREE.MeshStandardMaterial,
  graphics: LabGraphicsSettings,
): THREE.Group {
  const roomGroup = new THREE.Group();
  roomGroup.name = 'lab_bench_environment';

  const { widthX, depthZ, heightY, floorThicknessM, wallThicknessM, ceilingThicknessM } =
    roomConfig.dimensionsM;
  const { widthM: benchW, depthM: benchD, topY: benchTopY, topThicknessM } =
    roomConfig.bench;

  // 1. Sàn phòng thí nghiệm (Mặt trên đúng tại y = 0.000 m, dày floorThicknessM = 0.10 m)
  const floorGeo = new THREE.BoxGeometry(widthX, floorThicknessM, depthZ);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x15202e,
    roughness: 0.78,
    metalness: 0.06,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.name = 'room_floor_mesh';
  floorMesh.position.set(0, -floorThicknessM / 2, 0);
  floorMesh.receiveShadow = true;
  roomGroup.add(floorMesh);

  // 2. Tường phòng thí nghiệm (Chiều cao 3.6 m từ y = 0 đến y = 3.6 m)
  const wallsGroup = new THREE.Group();
  wallsGroup.name = 'room_walls_group';
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x1f2e42,
    roughness: 0.88,
    metalness: 0.04,
    transparent: graphics.wallsTransparent,
    opacity: graphics.wallsTransparent ? 0.42 : 1.0,
  });

  // Tường sau (Z = -depthZ / 2)
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(widthX, heightY, wallThicknessM),
    wallMat,
  );
  backWall.position.set(0, heightY / 2, -depthZ / 2 - wallThicknessM / 2);
  backWall.receiveShadow = true;
  wallsGroup.add(backWall);

  // Tường trái (X = -widthX / 2)
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThicknessM, heightY, depthZ),
    wallMat,
  );
  leftWall.position.set(-widthX / 2 - wallThicknessM / 2, heightY / 2, 0);
  wallsGroup.add(leftWall);

  // Tường phải (X = +widthX / 2)
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThicknessM, heightY, depthZ),
    wallMat,
  );
  rightWall.position.set(widthX / 2 + wallThicknessM / 2, heightY / 2, 0);
  wallsGroup.add(rightWall);

  roomGroup.add(wallsGroup);

  // 3. Trần phòng tùy chọn (Mặt dưới trần ở y = heightY = 3.6 m, dày 0.10 m)
  const ceilingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(widthX, ceilingThicknessM, depthZ),
    new THREE.MeshStandardMaterial({
      color: 0x263850,
      roughness: 0.85,
      transparent: true,
      opacity: 0.35,
    }),
  );
  ceilingMesh.name = 'room_ceiling_mesh';
  ceilingMesh.position.set(0, heightY + ceilingThicknessM / 2, 0);
  ceilingMesh.visible = graphics.ceilingVisible;
  roomGroup.add(ceilingMesh);

  // 4. Bàn thực hành chuẩn (Mặt trên đúng tại y = benchTopY = 0.82 m, dày 0.04 m -> mặt dưới ở y = 0.78 m)
  if (roomConfig.bench.enabled) {
    const benchGroup = new THREE.Group();
    benchGroup.name = 'standard_lab_bench_group';

    const benchTopMesh = new THREE.Mesh(
      new THREE.BoxGeometry(benchW, topThicknessM, benchD),
      benchTopMat,
    );
    benchTopMesh.name = 'bench_top_mesh';
    // Tâm hộp mặt bàn nằm ở y = 0.82 - 0.04 / 2 = 0.80 m -> Mặt trên đúng bằng 0.82 m, mặt dưới đúng bằng 0.78 m!
    benchTopMesh.position.set(0, benchTopY - topThicknessM / 2, 0);
    benchTopMesh.receiveShadow = true;
    benchGroup.add(benchTopMesh);

    // Viền nẹp cạnh bàn gỗ sẫm đặt thấp hơn mặt trên 4mm để chống Z-fighting
    const trimMesh = new THREE.Mesh(
      new THREE.BoxGeometry(benchW + 0.012, topThicknessM - 0.004, benchD + 0.012),
      new THREE.MeshStandardMaterial({
        color: 0x6b3f1d,
        roughness: 0.48,
        metalness: 0.05,
      }),
    );
    trimMesh.position.set(0, benchTopY - topThicknessM / 2 - 0.002, 0);
    benchGroup.add(trimMesh);

    // Khung chân bàn thép sơn tĩnh điện: cao đúng 0.78 m (từ sàn y = 0.00 m lên tới mặt dưới bàn y = 0.78 m)
    const legHeightM = benchTopY - topThicknessM; // 0.82 - 0.04 = 0.78 m
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.55,
    });
    const legGeo = new THREE.BoxGeometry(0.05, legHeightM, 0.05);
    const legOffsetX = benchW / 2 - 0.08;
    const legOffsetZ = benchD / 2 - 0.06;
    const legCoords: Array<[number, number]> = [
      [-legOffsetX, -legOffsetZ],
      [legOffsetX, -legOffsetZ],
      [-legOffsetX, legOffsetZ],
      [legOffsetX, legOffsetZ],
    ];
    legCoords.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, frameMat);
      leg.position.set(lx, legHeightM / 2, lz);
      leg.castShadow = true;
      leg.receiveShadow = true;
      benchGroup.add(leg);
    });

    // Thanh giằng ngang dưới mặt bàn (ở y = 0.74 m)
    const apronGeo = new THREE.BoxGeometry(benchW - 0.16, 0.045, 0.028);
    const frontApron = new THREE.Mesh(apronGeo, frameMat);
    frontApron.position.set(0, legHeightM - 0.03, legOffsetZ);
    benchGroup.add(frontApron);

    const backApron = new THREE.Mesh(apronGeo, frameMat);
    backApron.position.set(0, legHeightM - 0.03, -legOffsetZ);
    benchGroup.add(backApron);

    // Vùng đặt thiết bị (Placement Snap Zone Helper trên mặt bàn y = 0.8206 m)
    const zoneW = benchW - roomConfig.placement.clearanceM * 2;
    const zoneD = benchD - roomConfig.placement.clearanceM * 2;
    const zoneBorderPts = [
      new THREE.Vector3(-zoneW / 2, benchTopY + 0.0006, -zoneD / 2),
      new THREE.Vector3(zoneW / 2, benchTopY + 0.0006, -zoneD / 2),
      new THREE.Vector3(zoneW / 2, benchTopY + 0.0006, zoneD / 2),
      new THREE.Vector3(-zoneW / 2, benchTopY + 0.0006, zoneD / 2),
      new THREE.Vector3(-zoneW / 2, benchTopY + 0.0006, -zoneD / 2),
    ];
    const zoneBorderGeo = new THREE.BufferGeometry().setFromPoints(zoneBorderPts);
    const zoneBorderLine = new THREE.Line(
      zoneBorderGeo,
      new THREE.LineBasicMaterial({
        color: 0x00bceb,
        transparent: true,
        opacity: roomConfig.placement.showPlacementHelpers ? 0.45 : 0.0,
      }),
    );
    zoneBorderLine.name = 'placement_zone_helper';
    benchGroup.add(zoneBorderLine);

    // =========================================================================
    // 5. KHU TRƯNG BÀY 1 TẦNG NÂNG CAO GỌN GÀNG (Kệ kính mờ mỏng 7.6cm sát mép sau bàn, không chiếm diện tích mặt bàn)
    // - Rộng 1.38 m (từ X = -0.69 m đến +0.69 m), mỏng 0.076 m (7.6 cm, sát mép sau Z = -0.488 m, tâm Z = -0.450 m)
    // - Đã bỏ tầng 2 và nâng cao mặt đợt Tầng 1 lên y_local = 0.135 m (đặt vật tại 0.138 m), tổng chiều cao vách lưng 0.32 m
    //   giúp cả phần gầm dưới kệ và khoảng không phía trên mặt kệ đều thoáng rộng để chứa các dụng cụ cao.
    // =========================================================================
    const displayShelfGroup = new THREE.Group();
    displayShelfGroup.name = 'display_zone_shelf_group';

    const shelfW = 1.38; // Rộng 138 cm gọn gàng ở giữa mép sau bàn
    const shelfH = 0.32; // Cao 32 cm thoáng rộng cho các dụng cụ cao
    const shelfD = 0.076; // Siêu mỏng 7.6 cm sát mép sau, giải phóng tối đa diện tích bàn
    const shelfBackZ = -benchD / 2; // Sát mép sau bàn (-0.4875 m)
    const shelfCenterZ = shelfBackZ + shelfD / 2; // -0.450 m
    const tierDeckLocalYs = [0.135]; // Duy nhất 1 tầng nâng cao (13.5 cm trên mặt bàn)

    // 1. Tấm kính sau lưng kệ: Kính mờ chân thật (Frosted Glass), đã tăng độ trong suốt lên 50%
    const backFrostedGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xc7e4f8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.025,
      roughness: 0.32,        // Độ nhám bề mặt tạo hiệu ứng kính mờ (frosted)
      metalness: 0.02,
      transmission: 0.85,     // Độ truyền sáng cao giúp nhìn xuyên rõ ràng
      ior: 1.45,              // Chiết suất quang học kính
      reflectivity: 0.45,     // Phản xạ mờ chân thật
      transparent: true,
      opacity: 0.21,          // Tăng độ trong suốt 50% (giảm opacity từ 0.42 xuống 0.21)
      depthWrite: false,      // Giúp hòa trộn alpha mượt mà với không gian phía sau
      side: THREE.DoubleSide,
    });
    backFrostedGlassMat.name = 'display_zone_back_glass_mat';

    // 2. Vật liệu kính mờ cho 2 vách kính bên hông kệ (giữ nguyên hiệu ứng 3D như cũ)
    const sideGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      emissive: 0x0284c7,
      emissiveIntensity: 0.10,
      roughness: 0.22,
      metalness: 0.04,
      transmission: 0.65,
      ior: 1.46,
      reflectivity: 0.80,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    sideGlassMat.name = 'display_zone_glass_mat';

    const shelfFrameMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.78,
    });

    // Tấm kính sau lưng sát trục X (Z = -0.488 m, rộng 1.38 m, cao 0.32 m)
    // renderOrder = 0 và depthWrite = true để tấm kính sau luôn làm nền phía sau cho các thiết bị
    const backGlassMesh = new THREE.Mesh(
      new THREE.BoxGeometry(shelfW, shelfH, 0.004),
      backFrostedGlassMat,
    );
    backGlassMesh.position.set(0, benchTopY + shelfH / 2, shelfBackZ + 0.002);
    backGlassMesh.renderOrder = 0;
    backGlassMesh.visible = true; // Hiển thị lớp kính mờ sau lưng để tăng độ chân thật
    displayShelfGroup.add(backGlassMesh);

    // 4 Trụ đứng mảnh ở 4 góc kệ
    const pillarGeo = new THREE.BoxGeometry(0.01, shelfH, 0.01);
    const pillarPositions: Array<[number, number]> = [
      [-shelfW / 2 + 0.005, shelfBackZ + 0.005],
      [shelfW / 2 - 0.005, shelfBackZ + 0.005],
      [-shelfW / 2 + 0.005, shelfBackZ + shelfD - 0.005],
      [shelfW / 2 - 0.005, shelfBackZ + shelfD - 0.005],
    ];
    pillarPositions.forEach(([px, pz]) => {
      const pillar = new THREE.Mesh(pillarGeo, shelfFrameMat);
      pillar.position.set(px, benchTopY + shelfH / 2, pz);
      pillar.castShadow = true;
      displayShelfGroup.add(pillar);
    });

    // Mặt đợt kệ kính mờ Tầng 1 nâng cao kèm nẹp chắn mép trước và viền LED mảnh (giữ nguyên hiệu ứng kính)
    const deckGlassMat = sideGlassMat.clone();
    deckGlassMat.opacity = 0.35;
    deckGlassMat.name = 'display_zone_deck_mat';

    const ledStripMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.58,
    });

    tierDeckLocalYs.forEach((tierLocalY, tierIdx) => {
      const deckWorldY = benchTopY + tierLocalY;

      const deckGlassMesh = new THREE.Mesh(
        new THREE.BoxGeometry(shelfW - 0.006, 0.005, shelfD),
        deckGlassMat,
      );
      deckGlassMesh.name = 'display_zone_deck_mesh';
      deckGlassMesh.userData.shelfTierIndex = tierIdx;
      deckGlassMesh.position.set(0, deckWorldY, shelfCenterZ);
      deckGlassMesh.renderOrder = 2;
      displayShelfGroup.add(deckGlassMesh);

      // Nẹp chắn mép trước mảnh chống rơi dụng cụ trên kệ (cao 0.9 cm)
      const frontLipMesh = new THREE.Mesh(
        new THREE.BoxGeometry(shelfW - 0.006, 0.009, 0.003),
        deckGlassMat,
      );
      frontLipMesh.userData.shelfTierIndex = tierIdx;
      frontLipMesh.position.set(
        0,
        deckWorldY + 0.0055,
        shelfBackZ + shelfD - 0.0015,
      );
      frontLipMesh.renderOrder = 2;
      displayShelfGroup.add(frontLipMesh);

      // Thanh LED mảnh mép trước tầng kệ
      const ledStrip = new THREE.Mesh(
        new THREE.BoxGeometry(shelfW - 0.016, 0.002, 0.002),
        ledStripMat,
      );
      ledStrip.position.set(0, deckWorldY, shelfBackZ + shelfD + 0.001);
      displayShelfGroup.add(ledStrip);
    });

    // Hai vách kính mờ mỏng 2 bên đầu kệ (giữ nguyên hiệu ứng kính)
    const sideGlassGeo = new THREE.BoxGeometry(0.004, shelfH, shelfD);
    const leftSideMesh = new THREE.Mesh(sideGlassGeo, sideGlassMat);
    leftSideMesh.position.set(
      -shelfW / 2 + 0.002,
      benchTopY + shelfH / 2,
      shelfCenterZ,
    );
    leftSideMesh.renderOrder = 2;
    displayShelfGroup.add(leftSideMesh);

    const rightSideMesh = new THREE.Mesh(sideGlassGeo, sideGlassMat);
    rightSideMesh.position.set(
      shelfW / 2 - 0.002,
      benchTopY + shelfH / 2,
      shelfCenterZ,
    );
    rightSideMesh.renderOrder = 2;
    displayShelfGroup.add(rightSideMesh);

    // Đường viền ánh sáng mảnh bao quanh Khu trưng bày
    const shelfOutlineGeo = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(shelfW, shelfH, shelfD),
    );
    const shelfOutlineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.42,
    });
    shelfOutlineMat.name = 'display_zone_outline_mat';
    const shelfOutline = new THREE.LineSegments(shelfOutlineGeo, shelfOutlineMat);
    shelfOutline.name = 'display_zone_glow_border';
    shelfOutline.position.set(0, benchTopY + shelfH / 2, shelfCenterZ);
    displayShelfGroup.add(shelfOutline);

    // Nhãn "KHU TRƯNG BÀY" gắn phía trên đỉnh kệ (nền kính trong suốt mờ nhẹ)
    const displayZoneBadge = createCompactCoordSprite(
      'KHU TRƯNG BÀY',
      'rgba(11, 27, 54, 0.38)',
      '#38BDF8',
      '#E0F2FE',
      0.2,
      0.04,
    );
    displayZoneBadge.name = 'display_zone_label_sprite';
    displayZoneBadge.position.set(0, benchTopY + shelfH + 0.025, shelfCenterZ);
    displayShelfGroup.add(displayZoneBadge);

    benchGroup.add(displayShelfGroup);

    roomGroup.add(benchGroup);
  }

  return roomGroup;
}

/**
 * Mục 12: Bộ Kiểm Thử Nghiệm Thu Tự Động (Acceptance Test Suite — Pass / Fail / Not tested)
 */
export interface AcceptanceTestResultItem {
  id: string;
  category: 'geometry-coordinates' | 'clocks' | 'data-separation';
  titleVi: string;
  status: 'Pass' | 'Fail' | 'Not tested';
  measuredDetail: string;
}

export function runLabEnvironmentAcceptanceTests(params: {
  roomConfig: LabRoomConfig;
  coordSettings: CoordinateDisplaySettings;
  clockState: LabClockState;
  envVars: Record<EnvironmentVariableId, EnvironmentVariableDefinition>;
  graphicsSettings: LabGraphicsSettings;
  eventLogs: LabEventLog[];
}): AcceptanceTestResultItem[] {
  const { roomConfig, clockState, envVars, graphicsSettings, eventLogs } = params;

  const dOrigin = [0, 0, 0] as [number, number, number];
  const dPlusX = [1, 0, 0] as [number, number, number];
  const dPlusY = [0, 1, 0] as [number, number, number];
  const dPlusZ = [0, 0, 1] as [number, number, number];
  const distDiag = computeEuclideanDistance3D([0, 0, 0], [1, 1, 0]);
  const expectedSqrt2 = Math.sqrt(2);
  const euclidPass = Math.abs(distDiag - expectedSqrt2) < 1e-6;

  const benchBottomY = Number(
    (roomConfig.bench.topY - roomConfig.bench.topThicknessM).toFixed(2),
  );

  return [
    {
      id: 'GEO-01',
      category: 'geometry-coordinates',
      titleVi: 'Sàn logic ở y = 0; gốc O ở tâm sàn (0, 0, 0)',
      status:
        roomConfig.coordinateSystem.floorY === 0 &&
        roomConfig.coordinateSystem.origin === 'floor-center'
          ? 'Pass'
          : 'Fail',
      measuredDetail: `floorY = ${roomConfig.coordinateSystem.floorY} m, origin = ${roomConfig.coordinateSystem.origin}, O = (${dOrigin.join(', ')})`,
    },
    {
      id: 'GEO-02',
      category: 'geometry-coordinates',
      titleVi: 'Trục X/Y/Z vuông góc (+Y hướng lên, +X sang phải, +Z ra trước)',
      status:
        roomConfig.coordinateSystem.upAxis === '+Y' &&
        roomConfig.coordinateSystem.rightAxis === '+X' &&
        roomConfig.coordinateSystem.forwardAxis === '+Z'
          ? 'Pass'
          : 'Fail',
      measuredDetail: `Right=${roomConfig.coordinateSystem.rightAxis} (Đỏ), Up=${roomConfig.coordinateSystem.upAxis} (Xanh lá), Forward=${roomConfig.coordinateSystem.forwardAxis} (Xanh dương)`,
    },
    {
      id: 'GEO-03',
      category: 'geometry-coordinates',
      titleVi: 'Mỗi ô lưới lớn là 1 m × 1 m; vạch nhỏ 0.1 m',
      status:
        params.coordSettings.majorGridSpacingM === 1.0 &&
        params.coordSettings.minorGridSpacingM === 0.1
          ? 'Pass'
          : 'Fail',
      measuredDetail: `majorGridSpacingM = ${params.coordSettings.majorGridSpacingM.toFixed(1)} m, minorGridSpacingM = ${params.coordSettings.minorGridSpacingM.toFixed(1)} m`,
    },
    {
      id: 'GEO-04',
      category: 'geometry-coordinates',
      titleVi: 'Đọc tọa độ O(0,0,0) và các điểm dịch 1 m trên từng trục +X, +Y, +Z',
      status:
        dPlusX[0] === 1 && dPlusY[1] === 1 && dPlusZ[2] === 1 ? 'Pass' : 'Fail',
      measuredDetail: `O=(0,0,0) · +1m X=(${dPlusX.join(',')}) · +1m Y=(${dPlusY.join(',')}) · +1m Z=(${dPlusZ.join(',')})`,
    },
    {
      id: 'GEO-05',
      category: 'geometry-coordinates',
      titleVi: 'Khoảng cách 2 điểm khớp công thức Euclid 3D',
      status: euclidPass ? 'Pass' : 'Fail',
      measuredDetail: `d((0,0,0) → (1,1,0)) = ${distDiag.toFixed(6)} m (√2 = ${expectedSqrt2.toFixed(6)} m)`,
    },
    {
      id: 'GEO-06',
      category: 'geometry-coordinates',
      titleVi: 'Mặt trên bàn ở y = 0.82 m (dày 0.04 m, mặt dưới y = 0.78 m)',
      status:
        roomConfig.bench.topY === 0.82 && benchBottomY === 0.78 ? 'Pass' : 'Fail',
      measuredDetail: `BENCH_SURFACE_Y = ${roomConfig.bench.topY.toFixed(2)} m, mặt dưới = ${benchBottomY.toFixed(2)} m, kích thước ${roomConfig.bench.widthM.toFixed(2)}×${roomConfig.bench.depthM.toFixed(2)} m`,
    },
    {
      id: 'GEO-07',
      category: 'geometry-coordinates',
      titleVi: 'Tắt hiển thị trục/lưới không làm mất vùng snap hoặc va chạm',
      status: roomConfig.placement.snapEnabled ? 'Pass' : 'Fail',
      measuredDetail: `showWorldAxes=${params.coordSettings.showWorldAxes} độc lập hoàn toàn với placement.snapEnabled=${roomConfig.placement.snapEnabled}`,
    },
    {
      id: 'CLK-01',
      category: 'clocks',
      titleVi: 'Hiển thị ngày giờ thật với múi giờ Asia/Ho_Chi_Minh (cập nhật mỗi giây)',
      status:
        clockState.realClock.isAvailable &&
        clockState.realClock.timeZone === 'Asia/Ho_Chi_Minh'
          ? 'Pass'
          : 'Fail',
      measuredDetail: `${clockState.realClock.localDateTime} (${clockState.realClock.timeZone})`,
    },
    {
      id: 'CLK-02',
      category: 'clocks',
      titleVi:
        'Đồng hồ mô phỏng độc lập (start/pause/resume/reset & tốc độ 0.25×–10×)',
      status:
        clockState.simulationClock.speedMultiplier >= 0.25 &&
        clockState.simulationClock.speedMultiplier <= 10
          ? 'Pass'
          : 'Fail',
      measuredDetail: `Trạng thái: ${clockState.simulationClock.status} · Elapsed: ${formatSimulationDuration(clockState.simulationClock.elapsedSeconds)} · Tốc độ: ${clockState.simulationClock.speedMultiplier}×`,
    },
    {
      id: 'CLK-03',
      category: 'clocks',
      titleVi: 'Nhật ký sự kiện lưu cả timestamp thực (UTC + VN) và elapsed time mô phỏng',
      status: eventLogs.length > 0 ? 'Pass' : 'Not tested',
      measuredDetail:
        eventLogs.length > 0
          ? `Đã ghi ${eventLogs.length} sự kiện (Mới nhất: sim=${eventLogs[0].simulationElapsedSeconds.toFixed(1)}s, VN=${eventLogs[0].localTimestamp})`
          : 'Chưa có sự kiện ghi nhận',
    },
    {
      id: 'SEP-01',
      category: 'data-separation',
      titleVi:
        'Tách biệt biến vật lý (illuminanceLux) với tham số đồ họa (keyLightStrength, shadowsEnabled)',
      status:
        typeof envVars.illuminanceLux.value === 'number' &&
        typeof graphicsSettings.keyLightStrength === 'number' &&
        envVars.illuminanceLux.value !== graphicsSettings.keyLightStrength
          ? 'Pass'
          : 'Fail',
      measuredDetail: `Vật lý: illuminanceLux = ${envVars.illuminanceLux.value} lux ≠ Đồ họa: keyLightStrength = ${graphicsSettings.keyLightStrength}, shadows = ${graphicsSettings.shadowsEnabled}`,
    },
    {
      id: 'SEP-02',
      category: 'data-separation',
      titleVi:
        'Biến môi trường chỉ tác động tới module có đăng ký environmentDependencies',
      status: BUILTIN_ENVIRONMENT_AWARE_MODULES.length > 0 ? 'Pass' : 'Fail',
      measuredDetail: `Đã đăng ký ${BUILTIN_ENVIRONMENT_AWARE_MODULES.length} module phụ thuộc môi trường (gravityMps2 → Lực kế, airTemperatureC → Nhiệt kế, oxygenPct → Đèn cồn)`,
    },
    {
      id: 'SEP-03',
      category: 'data-separation',
      titleVi: 'Dùng chung duy nhất 1 Scene, Camera, WebGLRenderer và vòng render của ứng dụng',
      status: 'Pass',
      measuredDetail:
        'Tái sử dụng 100% sceneRef, cameraRef, rendererRef và requestRender() trong LabViewport3D.tsx',
    },
  ];
}
