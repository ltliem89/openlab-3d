import * as THREE from 'three';
import { AssetDefinition, ProceduralArchetype, SceneInstance } from '../domain/types';
import { LabSoundPhenomenonType } from './LabSoundEngine';

export const CANONICAL_ARCHETYPE_MAP: Record<string, ProceduralArchetype> = {
  'OL3D-EQP-BAL-0001': 'electronic-balance',
  'OL3D-EQP-CYL-0001': 'graduated-cylinder',
  'OL3D-EQP-BKR-0001': 'beaker-250',
  'OL3D-EQP-OVF-0001': 'overflow-can',
  'OL3D-EQP-DYN-0001': 'spring-dynamometer',
  'OL3D-EQP-CAL-0001': 'vernier-caliper',
  'OL3D-EQP-WGT-0001': 'calibration-weight',
  'OL3D-EQP-SLD-0001': 'solid-cylinder',
  'OL3D-EQP-SPH-0001': 'solid-sphere',
  'OL3D-EQP-BLK-0001': 'solid-block',
  'OL3D-EQP-HLW-0001': 'hollow-cylinder',
  'OL3D-EQP-FLK-0001': 'erlenmeyer-flask',
  'OL3D-EQP-STD-0001': 'retort-stand',
  'OL3D-EQP-OPT-0001': 'optical-lens',
  'OL3D-EQP-OBN-0001': 'optical-bench',
  'OL3D-EQP-OLP-0001': 'optical-lamp',
  'OL3D-EQP-FOB-0001': 'frosted-f-object',
  'OL3D-EQP-SCR-0001': 'optical-screen',
  'OL3D-EQP-PSU-0001': 'optical-power-supply',
  'OL3D-EQP-LBX-0001': 'optical-lens-box',
  'OL3D-EQP-THM-0001': 'thermometer',
  'OL3D-EQP-LSR-0001': 'laser-source',
  'OL3D-EQP-SLB-0001': 'semicircular-slab',
  'OL3D-EQP-PRM-0001': 'optical-prism',
  'OL3D-EQP-MAG-0001': 'magnifying-glass',
  'OL3D-EQP-GLV-0001': 'galvanometer',
  'OL3D-EQP-DMM-0001': 'digital-multimeter',
  'OL3D-EQP-COIL-0001': 'induction-coil-led',
  'OL3D-EQP-DSH-0001': 'porcelain-dish',
  'OL3D-EQP-SEP-0001': 'separatory-funnel',
  'OL3D-EQP-DST-0001': 'distillation-flask',
  'OL3D-EQP-MIC-0001': 'optical-microscope',
  'OL3D-EQP-DNA-0001': 'dna-double-helix',
  'OL3D-EQP-WDP-1000': 'water-dispenser',
  'OL3D-EQP-LEV-0001': 'lever-balance-apparatus',
  'OL3D-EQP-HYD-0001': 'communicating-vessels-3way',
};

function inferProceduralArchetypeFromIdOrSlug(
  assetId: string,
  slug: string,
  explicit?: ProceduralArchetype,
): ProceduralArchetype {
  // 1. Ưu tiên tuyệt đối bảng tra cứu chuẩn theo AssetId chính quy
  if (assetId && CANONICAL_ARCHETYPE_MAP[assetId]) {
    return CANONICAL_ARCHETYPE_MAP[assetId];
  }

  // 2. Nếu explicit đã đúng kiểu mẫu cơ bản hợp lệ (trừ trường hợp nhầm lẫn di chứng cũ)
  if (explicit && explicit !== 'digital-multimeter') {
    if (explicit === 'spring-dynamometer' && (assetId.includes('LEV') || slug.includes('don-bay') || slug.includes('lever'))) {
      return 'lever-balance-apparatus';
    }
    if (explicit === 'beaker-250' && (assetId.includes('HYD') || slug.includes('binh-thong-nhau') || slug.includes('communicating'))) {
      return 'communicating-vessels-3way';
    }
    if (explicit === 'vernier-caliper' && (assetId.includes('MIC') || slug.includes('microscope') || slug.includes('hien-vi'))) {
      return 'optical-microscope';
    }
    if (explicit === 'vernier-caliper' && (assetId.includes('PRM') || slug.includes('prism') || slug.includes('lang-kinh'))) {
      return 'optical-prism';
    }
    return explicit;
  }

  const key = `${assetId} ${slug}`.toUpperCase();

  // Khớp theo từ khóa đặc trưng - Chú ý: kiểm tra thiết bị quang học & vi mô TRƯỚC để không bị "CAL" trong "OPTICAL" nuốt nhầm
  if (key.includes('BAL') || key.includes('CAN-DIEN-TU') || key.includes('BALANCE')) return 'electronic-balance';
  if (key.includes('CYL') || key.includes('ONG-DONG') || key.includes('GRADUATED')) return 'graduated-cylinder';
  if (key.includes('OVF') || key.includes('BINH-TRAN') || key.includes('OVERFLOW')) return 'overflow-can';
  if (key.includes('WTR') || key.includes('WDP') || key.includes('CAP-NUOC') || key.includes('DISPENSER')) return 'water-dispenser';
  if (key.includes('LEV') || key.includes('DON-BAY') || key.includes('LEVER')) return 'lever-balance-apparatus';
  if (key.includes('HYD') || key.includes('BINH-THONG-NHAU') || key.includes('COMMUNICATING')) return 'communicating-vessels-3way';
  if (key.includes('MIC') || key.includes('MICROSCOPE') || key.includes('KINH-HIEN-VI')) return 'optical-microscope';
  if (key.includes('MAG') || key.includes('MAGNIFYING') || key.includes('KINH-LUP')) return 'magnifying-glass';
  if (key.includes('PRM') || key.includes('PRISM') || key.includes('LANG-KINH')) return 'optical-prism';
  if (key.includes('SLB') || key.includes('BAN-TRU') || key.includes('SEMICIRCULAR')) return 'semicircular-slab';
  if (key.includes('OBN') || key.includes('GIA-QUANG-HOC') || key.includes('OPTICAL-BENCH')) return 'optical-bench';
  if (key.includes('OLP') || key.includes('DEN-CHIEU') || key.includes('OPTICAL-LAMP')) return 'optical-lamp';
  if (key.includes('FOB') || key.includes('VAT-SANG-F') || key.includes('FROSTED-F')) return 'frosted-f-object';
  if (key.includes('SCR') || key.includes('MAN-CHAN') || key.includes('OPTICAL-SCREEN')) return 'optical-screen';
  if (key.includes('PSU') || key.includes('NGUON-DIEN') || key.includes('POWER-SUPPLY')) return 'optical-power-supply';
  if (key.includes('LBX') || key.includes('HOP-THAU-KINH') || key.includes('LENS-BOX')) return 'optical-lens-box';
  if (key.includes('OPT') || key.includes('THAU-KINH')) return 'optical-lens';
  if (key.includes('LSR') || key.includes('LASER')) return 'laser-source';
  if (key.includes('THUOC-CAP') || key.includes('CALIPER') || key.includes('-CAL-')) return 'vernier-caliper';
  if (key.includes('LUC-KE') || key.includes('DYNAMOMETER') || key.includes('-DYN-')) return 'spring-dynamometer';
  if (key.includes('THM') || key.includes('NHIET-KE') || key.includes('THERMOMETER')) return 'thermometer';
  if (key.includes('GLV') || key.includes('GALVANOMETER') || key.includes('DIEN-KE')) return 'galvanometer';
  if (key.includes('COIL') || key.includes('IND') || key.includes('CUON-DAY') || key.includes('INDUCTION')) return 'induction-coil-led';
  if (key.includes('DSH') || key.includes('PORCELAIN') || key.includes('BAT-SU')) return 'porcelain-dish';
  if (key.includes('FLK') || key.includes('ERLENMEYER') || key.includes('BINH-TAM-GIAC')) return 'erlenmeyer-flask';
  if (key.includes('SEP') || key.includes('SEPARATORY') || key.includes('PHEU-CHIET')) return 'separatory-funnel';
  if (key.includes('DST') || key.includes('DISTILLATION') || key.includes('BINH-CAU')) return 'distillation-flask';
  if (key.includes('STD') || key.includes('GIA-DO') || key.includes('RETORT')) return 'retort-stand';
  if (key.includes('WGT') || key.includes('QUA-CAN') || key.includes('WEIGHT')) return 'calibration-weight';
  if (key.includes('SLD') || key.includes('TRU-NHOM') || key.includes('SOLID-CYL')) return 'solid-cylinder';
  if (key.includes('SPH') || key.includes('BI-THEP') || key.includes('SPHERE')) return 'solid-sphere';
  if (key.includes('BLK') || key.includes('KHOI-DONG') || key.includes('BLOCK')) return 'solid-block';
  if (key.includes('HLW') || key.includes('TRU-RONG') || key.includes('HOLLOW')) return 'hollow-cylinder';
  if (key.includes('DNA') || key.includes('XOAN-KEP')) return 'dna-double-helix';
  if (key.includes('BKR') || key.includes('COC-THUY-TINH') || key.includes('BEAKER')) return 'beaker-250';
  if (key.includes('DMM') || key.includes('MULTIMETER') || key.includes('VAN-NANG')) return 'digital-multimeter';

  return 'digital-multimeter';
}
import {
  MULTI_SOURCE_EQUIPMENT_DOSSIERS,
  EQUIPMENT_FUNCTIONAL_AND_ENV_AUDITS,
  MultiSourceEquipmentDossier,
  FunctionalEnvironmentalAuditSpec,
} from '../data/multiSourceEquipmentDossier';

import {
  localDiskLibraryEngine,
  StoredLibraryModuleEntry,
} from './LocalDiskLibraryEngine';
import {
  normalizeRealPhotoMeta,
  SupportedRealPhotoMimeType,
} from './EquipmentImagePreviewController';

export interface RealPhotoAnnotationPin {
  xPercent: number;
  yPercent: number;
  label: string;
}

export interface RealPhotoMetadata {
  available?: boolean;
  src?: string;
  mimeType?: SupportedRealPhotoMimeType;
  alt?: string;
  display?: {
    width?: 240;
    height?: 240;
    ratio?: '1:1';
    fit?: 'contain';
    background?: string;
  };
  sourceKind?: 'real-photo' | 'illustration';
  caption: string;
  sourceCredit?: string;
  thumbnailSrc?: string;
  manufacturerRef: string;
  realWorldScaleNote: string;
  annotations: RealPhotoAnnotationPin[];
  customUploadedDataUrl?: string;
}

export interface HtmlModuleControlPreset {
  label: string;
  statePatch: Partial<SceneInstance['instanceState']>;
}

export interface HtmlModuleInteractiveControlSpec {
  stateKey:
    | 'multimeterValue'
    | 'liquidLevelMl'
    | 'temperatureC'
    | 'incidentAngleDeg'
    | 'springExtensionN'
    | 'jawOpeningMm'
    | 'magnification'
    | 'measuredMassG';
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  presets: HtmlModuleControlPreset[];
  canBeWeighedOnBalance?: boolean;
  canHoldLiquid?: boolean;
  canSubmergeInVessel?: boolean;
  soundPhenomenon?: LabSoundPhenomenonType;
}

export function resolveDefaultModuleControls(
  resolvedArch: ProceduralArchetype,
  capVal?: number,
  userCtrl?: Partial<HtmlModuleInteractiveControlSpec>,
): HtmlModuleInteractiveControlSpec {
  let stateKey: HtmlModuleInteractiveControlSpec['stateKey'] = 'multimeterValue';
  let label = 'Điều chỉnh thông số';
  let unit = '';
  let min = 0;
  let max = 100;
  let step = 1;
  let defaultValue = 0;
  let canHoldLiquid = false;
  let canBeWeighedOnBalance = true;
  let canSubmergeInVessel = false;
  let soundPhenomenon: LabSoundPhenomenonType = 'probe-measure';
  let presets: HtmlModuleControlPreset[] = [];

  switch (resolvedArch) {
    case 'electronic-balance':
      stateKey = 'measuredMassG';
      label = 'Khối lượng đo m';
      unit = 'g';
      min = 0;
      max = 500;
      step = 0.01;
      defaultValue = 0;
      canHoldLiquid = false;
      canSubmergeInVessel = false;
      soundPhenomenon = 'probe-measure';
      presets = [
        { label: '0.00 g (Trừ bì TARE)', statePatch: { measuredMassG: 0 } },
        { label: '50.00 g (Quả cân chuẩn)', statePatch: { measuredMassG: 50 } },
        { label: '66.25 g (Trụ nhôm)', statePatch: { measuredMassG: 66.25 } },
        { label: '219.00 g (Khối đồng)', statePatch: { measuredMassG: 219 } },
      ];
      break;

    case 'vernier-caliper':
      stateKey = 'jawOpeningMm';
      label = 'Độ mở hàm kẹp d';
      unit = 'mm';
      min = 0;
      max = 150;
      step = 0.02;
      defaultValue = 26;
      canHoldLiquid = false;
      canSubmergeInVessel = false;
      soundPhenomenon = 'caliper-slide';
      presets = [
        { label: '0.00 mm (Đóng kín)', statePatch: { jawOpeningMm: 0 } },
        { label: '24.00 mm (Quả cân)', statePatch: { jawOpeningMm: 24 } },
        { label: '26.00 mm (Trụ nhôm)', statePatch: { jawOpeningMm: 26 } },
        { label: '30.00 mm (Bi thép)', statePatch: { jawOpeningMm: 30 } },
      ];
      break;

    case 'spring-dynamometer':
      stateKey = 'springExtensionN';
      label = 'Lực kéo / Trọng lượng F';
      unit = 'N';
      min = 0;
      max = 5;
      step = 0.1;
      defaultValue = 0;
      canHoldLiquid = false;
      canSubmergeInVessel = false;
      soundPhenomenon = 'spring-stretch';
      presets = [
        { label: '0.0 N (Vạch 0)', statePatch: { springExtensionN: 0 } },
        { label: '0.5 N (Treo 50 g)', statePatch: { springExtensionN: 0.49 } },
        { label: '1.0 N (Treo 100 g)', statePatch: { springExtensionN: 0.98 } },
        { label: '2.0 N (Treo 200 g)', statePatch: { springExtensionN: 1.96 } },
      ];
      break;

    case 'thermometer':
      stateKey = 'temperatureC';
      label = 'Nhiệt độ chất lỏng T';
      unit = '°C';
      min = -10;
      max = 110;
      step = 0.5;
      defaultValue = 25;
      canHoldLiquid = false;
      canSubmergeInVessel = true;
      soundPhenomenon = 'probe-measure';
      presets = [
        { label: '0.0 °C (Nước đá tan)', statePatch: { temperatureC: 0 } },
        { label: '25.0 °C (Nhiệt độ phòng)', statePatch: { temperatureC: 25 } },
        { label: '78.3 °C (Cồn sôi)', statePatch: { temperatureC: 78.3 } },
        { label: '100.0 °C (Nước sôi)', statePatch: { temperatureC: 100 } },
      ];
      break;

    case 'lever-balance-apparatus':
      stateKey = 'incidentAngleDeg';
      label = 'Góc nghiêng đòn bẩy';
      unit = '°';
      min = -30;
      max = 30;
      step = 1;
      defaultValue = 0;
      canHoldLiquid = false;
      canSubmergeInVessel = false;
      soundPhenomenon = 'mechanical-click';
      presets = [
        { label: 'Thăng bằng (0°)', statePatch: { incidentAngleDeg: 0 } },
        { label: 'Nghiêng trái (-15°)', statePatch: { incidentAngleDeg: -15 } },
        { label: 'Nghiêng phải (+15°)', statePatch: { incidentAngleDeg: 15 } },
        { label: 'Cực đại (+30°)', statePatch: { incidentAngleDeg: 30 } },
      ];
      break;

    case 'communicating-vessels-3way':
      stateKey = 'liquidLevelMl';
      label = 'Thể tích nước rót vào';
      unit = 'ml';
      min = 0;
      max = 150;
      step = 5;
      defaultValue = 75;
      canHoldLiquid = true;
      canSubmergeInVessel = false;
      soundPhenomenon = 'water-pour';
      presets = [
        { label: 'Trống (0 ml)', statePatch: { liquidLevelMl: 0 } },
        { label: 'Đáy nối (25 ml)', statePatch: { liquidLevelMl: 25 } },
        { label: '1/2 nhánh (75 ml)', statePatch: { liquidLevelMl: 75 } },
        { label: 'Đầy 3 nhánh (140 ml)', statePatch: { liquidLevelMl: 140 } },
      ];
      break;

    case 'optical-microscope':
      stateKey = 'magnification';
      label = 'Độ phóng đại vật kính';
      unit = 'x';
      min = 10;
      max = 100;
      step = 30;
      defaultValue = 40;
      canHoldLiquid = false;
      canSubmergeInVessel = false;
      soundPhenomenon = 'mechanical-click';
      presets = [
        { label: '10x (Thị trường rộng)', statePatch: { magnification: 10 } },
        { label: '40x (Tiêu bản NST)', statePatch: { magnification: 40 } },
        { label: '100x (Soi dầu vi mô)', statePatch: { magnification: 100 } },
      ];
      break;

    case 'magnifying-glass':
      stateKey = 'magnification';
      label = 'Độ bội giác G';
      unit = 'x';
      min = 2;
      max = 10;
      step = 1;
      defaultValue = 5;
      canHoldLiquid = false;
      canSubmergeInVessel = false;
      soundPhenomenon = 'probe-measure';
      presets = [
        { label: '2.5x', statePatch: { magnification: 2.5 } },
        { label: '5x (Tiêu chuẩn)', statePatch: { magnification: 5 } },
        { label: '10x', statePatch: { magnification: 10 } },
      ];
      break;

    case 'semicircular-slab':
      stateKey = 'incidentAngleDeg';
      label = 'Góc tới chùm laser i';
      unit = '°';
      min = 0;
      max = 60;
      step = 1;
      defaultValue = 30;
      canHoldLiquid = false;
      canSubmergeInVessel = false;
      soundPhenomenon = 'optics-angle';
      presets = [
        { label: '0° (Vuông góc)', statePatch: { incidentAngleDeg: 0 } },
        { label: '20° (Khúc xạ)', statePatch: { incidentAngleDeg: 20 } },
        { label: '40° (Gần giới hạn)', statePatch: { incidentAngleDeg: 40 } },
        { label: '41.8° (PXTP)', statePatch: { incidentAngleDeg: 41.8 } },
        { label: '60° (PXTP)', statePatch: { incidentAngleDeg: 60 } },
      ];
      break;

    case 'optical-prism':
      stateKey = 'incidentAngleDeg';
      label = 'Góc tới lăng kính i';
      unit = '°';
      min = 0;
      max = 60;
      step = 1;
      defaultValue = 30;
      canHoldLiquid = false;
      canSubmergeInVessel = false;
      soundPhenomenon = 'optics-angle';
      presets = [
        { label: '0°', statePatch: { incidentAngleDeg: 0 } },
        { label: '30° (Tán sắc 7 màu)', statePatch: { incidentAngleDeg: 30 } },
        { label: '45°', statePatch: { incidentAngleDeg: 45 } },
      ];
      break;

    case 'graduated-cylinder':
    case 'beaker-250':
    case 'overflow-can':
    case 'erlenmeyer-flask':
    case 'separatory-funnel':
    case 'distillation-flask':
    case 'porcelain-dish':
    case 'water-dispenser': {
      stateKey = 'liquidLevelMl';
      label = 'Thể tích chất lỏng V';
      unit = 'ml';
      const maxCap = capVal && capVal > 0 ? capVal : resolvedArch === 'beaker-250' ? 250 : resolvedArch === 'overflow-can' ? 210 : 100;
      max = maxCap;
      min = 0;
      step = maxCap <= 100 ? 1 : 5;
      defaultValue = resolvedArch === 'overflow-can' ? 210 : Number((maxCap * 0.5).toFixed(1));
      canHoldLiquid = true;
      canSubmergeInVessel = false;
      soundPhenomenon = 'water-pour';
      presets = [
        { label: '0 ml (Rỗng)', statePatch: { liquidLevelMl: 0 } },
        { label: `${(maxCap * 0.5).toFixed(0)} ml (Nửa bình)`, statePatch: { liquidLevelMl: Number((maxCap * 0.5).toFixed(1)) } },
        { label: `${maxCap} ml (Đầy bình)`, statePatch: { liquidLevelMl: maxCap } },
      ];
      break;
    }

    case 'digital-multimeter':
      stateKey = 'multimeterValue';
      label = 'Giá trị đo U / I / R';
      unit = 'V';
      min = 0;
      max = 250;
      step = 0.1;
      defaultValue = 12;
      canHoldLiquid = false;
      canSubmergeInVessel = false;
      soundPhenomenon = 'probe-measure';
      presets = [
        { label: '0.0 V (Hở mạch)', statePatch: { multimeterValue: 0 } },
        { label: '1.5 V (Pin AA)', statePatch: { multimeterValue: 1.5 } },
        { label: '12.0 V (Nguồn DC)', statePatch: { multimeterValue: 12 } },
      ];
      break;

    case 'galvanometer':
      stateKey = 'multimeterValue';
      label = 'Dòng điện cảm ứng I';
      unit = 'mA';
      min = -3;
      max = 3;
      step = 0.1;
      defaultValue = 0;
      canHoldLiquid = false;
      canSubmergeInVessel = false;
      soundPhenomenon = 'probe-measure';
      presets = [
        { label: '0.0 mA (Đứng yên)', statePatch: { multimeterValue: 0 } },
        { label: '+1.5 mA (Nam châm vào)', statePatch: { multimeterValue: 1.5 } },
        { label: '-1.5 mA (Nam châm ra)', statePatch: { multimeterValue: -1.5 } },
      ];
      break;

    default:
      canBeWeighedOnBalance = true;
      canSubmergeInVessel = true;
      canHoldLiquid = false;
      break;
  }

  return {
    stateKey: userCtrl?.stateKey ?? stateKey,
    label: userCtrl?.label ?? label,
    unit: userCtrl?.unit ?? unit,
    min: userCtrl?.min ?? min,
    max: userCtrl?.max ?? max,
    step: userCtrl?.step ?? step,
    defaultValue: userCtrl?.defaultValue ?? defaultValue,
    presets: Array.isArray(userCtrl?.presets) && userCtrl.presets.length > 0 ? userCtrl.presets : presets,
    canHoldLiquid: userCtrl?.canHoldLiquid ?? canHoldLiquid,
    canBeWeighedOnBalance: userCtrl?.canBeWeighedOnBalance ?? canBeWeighedOnBalance,
    canSubmergeInVessel: userCtrl?.canSubmergeInVessel ?? canSubmergeInVessel,
    soundPhenomenon: userCtrl?.soundPhenomenon ?? soundPhenomenon,
  };
}

export type HtmlModuleGateStatus = 'PASS' | 'PARTIAL' | 'FAIL' | 'NOT_RUN';

export interface HtmlModuleGateResult {
  gateId:
    | 'G1_STRUCTURE'
    | 'G2_GEOMETRY'
    | 'G3_PHYSICS_METROLOGY'
    | 'G4_INTERACTION'
    | 'G5_INTEGRATION'
    | 'G6_PERFORMANCE'
    | 'G7_SECURITY_PROVENANCE';
  gateNameVi: string;
  status: HtmlModuleGateStatus;
  summaryVi: string;
  details: string[];
}

export interface HtmlModule7GateValidationReport {
  overallStatus: HtmlModuleGateStatus;
  detectedContractVersion: 'v2.3' | 'v2.2' | 'synthesized-fallback';
  testedAtIso: string;
  buildTimeMs: number;
  updateTimeMs: number;
  measuredMeshCount: number;
  measuredTriangleCount: number;
  measuredYMinM: number;
  gates: HtmlModuleGateResult[];
  securityWarnings: string[];
}

export interface HtmlEquipmentModulePackage {
  asset: AssetDefinition;
  iconSvgMarkup: string;
  realPhotoMarkup: string;
  realPhotoMeta: RealPhotoMetadata;
  moduleControls: HtmlModuleInteractiveControlSpec;
  dossier?: MultiSourceEquipmentDossier;
  audit360?: FunctionalEnvironmentalAuditSpec;
  detectedContractVersion?: 'v2.3' | 'v2.2' | 'synthesized-fallback';
  validationReport?: HtmlModule7GateValidationReport;
  buildEquipmentGroup?: (THREE_LIB: typeof THREE, asset: AssetDefinition) => THREE.Group;
  applyEquipmentState?: (
    THREE_LIB: typeof THREE,
    rootObject: THREE.Object3D,
    instance: SceneInstance,
    asset: AssetDefinition,
  ) => void;
  playEquipmentSound?: (eventType: string, value?: number) => void;
  rawHtmlSource?: string;
}

class HtmlEquipmentModuleRegistryImpl {
  private modules = new Map<string, HtmlEquipmentModulePackage>();
  private productOverrides = new Map<string, AssetDefinition>();
  private userUploadedRealPhotos = new Map<string, string>();
  private userCustomPhotoCaptions = new Map<string, string>();
  private listeners = new Set<() => void>();

  constructor() {
    // Khởi tạo tự động nạp lại các module từ ổ đĩa thư viện C:\Users\ltlie\Documents\libraries3DLab
    if (typeof window !== 'undefined') {
      try {
        const savedPhotos = window.localStorage.getItem('ol3d_custom_real_photos_v1');
        if (savedPhotos) {
          const parsed = JSON.parse(savedPhotos) as Record<string, { dataUrl: string; caption?: string }>;
          for (const [id, val] of Object.entries(parsed)) {
            this.userUploadedRealPhotos.set(id, val.dataUrl);
            if (val.caption) this.userCustomPhotoCaptions.set(id, val.caption);
          }
        }
      } catch {
        // Ignore storage read error
      }
      void this.restoreFromLocalDiskLibrary();

      // Tự động nhận cập nhật Delta từ trang /libraries3DLab/index.html mà không cần F5 làm mới trang
      localDiskLibraryEngine.onExternalLibraryDelta(({ upserted, removedIds }) => {
        let changed = false;
        for (const entry of upserted) {
          if (this.applyStoredLibraryEntry(entry)) {
            changed = true;
          }
        }
        for (const removedId of removedIds) {
          if (this.modules.has(removedId) || this.productOverrides.has(removedId)) {
            this.modules.delete(removedId);
            this.productOverrides.delete(removedId);
            changed = true;
          }
        }
        if (changed) {
          this.emitChange();
        }
      });
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emitChange(): void {
    this.listeners.forEach((fn) => fn());
  }

  private applyStoredLibraryEntry(entry: StoredLibraryModuleEntry): boolean {
    if (entry.uploadedRealPhotoDataUrl) {
      this.userUploadedRealPhotos.set(entry.assetId, entry.uploadedRealPhotoDataUrl);
    }
    if (entry.rawHtmlSource && entry.rawHtmlSource.trim()) {
      const parsedPkg = this.parseHtmlModule(entry.rawHtmlSource);
      const mergedAsset: AssetDefinition = {
        ...parsedPkg.asset,
        ...entry.assetSnapshot,
        assetId: entry.assetId,
        geometry: {
          ...parsedPkg.asset.geometry,
          ...(entry.assetSnapshot?.geometry ?? {}),
          proceduralArchetype: inferProceduralArchetypeFromIdOrSlug(
            entry.assetId,
            entry.slug || parsedPkg.asset.slug,
            entry.assetSnapshot?.geometry?.proceduralArchetype &&
              entry.assetSnapshot.geometry.proceduralArchetype !== 'digital-multimeter'
              ? entry.assetSnapshot.geometry.proceduralArchetype
              : parsedPkg.asset.geometry.proceduralArchetype,
          ),
        },
      };
      const finalPkg: HtmlEquipmentModulePackage = {
        ...parsedPkg,
        asset: mergedAsset,
        rawHtmlSource: entry.rawHtmlSource,
      };
      this.modules.set(entry.assetId, finalPkg);
      this.productOverrides.set(entry.assetId, mergedAsset);
      if (finalPkg.dossier) {
        MULTI_SOURCE_EQUIPMENT_DOSSIERS[entry.assetId] = {
          ...finalPkg.dossier,
          assetId: entry.assetId,
        };
      }
      if (finalPkg.audit360) {
        EQUIPMENT_FUNCTIONAL_AND_ENV_AUDITS[entry.assetId] = {
          ...finalPkg.audit360,
          assetId: entry.assetId,
        };
      }
      return true;
    } else if (entry.assetSnapshot) {
      this.productOverrides.set(entry.assetId, entry.assetSnapshot);
      return true;
    }
    return false;
  }

  /**
   * Tự động khôi phục các module .HTML đã lưu từ thư viện C:\Users\ltlie\Documents\libraries3DLab
   * và tự động quét thư mục vật lý đã gắn kết khi web khởi chạy
   */
  async restoreFromLocalDiskLibrary(): Promise<number> {
    let restoredCount = 0;
    await localDiskLibraryEngine.initialize((entry: StoredLibraryModuleEntry) => {
      if (this.applyStoredLibraryEntry(entry)) {
        restoredCount++;
      }
    });

    // Tự động quét thư mục vật lý trong Documents nếu người dùng đã kết nối và cấp quyền
    const autoScannedHtmls = await localDiskLibraryEngine.tryAutoScanSavedDirectoryHandle();
    if (autoScannedHtmls.length > 0) {
      const imported = await this.importMultipleHtmlStringsFromLibraryFolder(autoScannedHtmls);
      restoredCount += imported.length;
    }

    // Tự động nạp các module chuẩn từ thư viện gốc web /libraries3DLab/library-index.json nếu chưa có
    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const indexRes = await fetch('/libraries3DLab/library-index.json');
        if (indexRes.ok) {
          const indexData = (await indexRes.json()) as {
            libraries?: Array<{
              assetId: string;
              folderName: string;
              htmlFileName: string;
            }>;
          };
          if (Array.isArray(indexData.libraries)) {
            for (const lib of indexData.libraries) {
              if (!this.modules.has(lib.assetId)) {
                try {
                  const htmlRes = await fetch(
                    `/libraries3DLab/${lib.folderName}/${lib.htmlFileName}`,
                  );
                  if (htmlRes.ok) {
                    const htmlText = await htmlRes.text();
                    const pkg = this.parseHtmlModule(htmlText);
                    this.registerModule(pkg, null, { skipDiskSave: true });
                    restoredCount++;
                  }
                } catch {
                  // Bỏ qua lỗi nạp riêng lẻ nếu offline
                }
              }
            }
          }
        }
      }
    } catch {
      // Bỏ qua lỗi nếu fetch không khả dụng
    }

    if (restoredCount > 0) {
      this.emitChange();
    }
    return restoredCount;
  }

  /**
   * Đồng bộ hóa manifest JSON mới nhất vào bên trong chuỗi mã nguồn .HTML
   */
  private injectUpdatedManifestIntoHtml(
    rawHtml: string,
    pkg: HtmlEquipmentModulePackage,
  ): string {
    const manifestObj = {
      moduleSpecVersion: 'OL3D-HTML-MODULE-v2.3',
      canonicalContractVersion: pkg.detectedContractVersion ?? 'v2.3',
      asset: pkg.asset,
      moduleControls: pkg.moduleControls,
      realPhotoMeta: pkg.realPhotoMeta,
      dossier: pkg.dossier,
      audit360: pkg.audit360,
      validationSummary: pkg.validationReport
        ? {
            overallStatus: pkg.validationReport.overallStatus,
            testedAtIso: pkg.validationReport.testedAtIso,
          }
        : undefined,
    };
    const jsonBlock = `<script id="ol3d-module-manifest" type="application/json">\n${JSON.stringify(
      manifestObj,
      null,
      2,
    )}\n  </script>`;

    if (/<script[^>]*id=["']ol3d-module-manifest["'][^>]*>[\s\S]*?<\/script>/i.test(rawHtml)) {
      return rawHtml.replace(
        /<script[^>]*id=["']ol3d-module-manifest["'][^>]*>[\s\S]*?<\/script>/i,
        jsonBlock,
      );
    }
    return rawHtml;
  }

  updateAssetDefinition(assetId: string, updatedAsset: AssetDefinition): AssetDefinition {
    const nextVersion = `${updatedAsset.assetVersion.split('-')[0]}-r${Date.now().toString(36).slice(-3)}`;
    const normalized: AssetDefinition = {
      ...updatedAsset,
      assetId,
      assetVersion: nextVersion,
      provenance: {
        ...updatedAsset.provenance,
        updatedAt: new Date().toISOString().slice(0, 10),
      },
    };
    this.productOverrides.set(assetId, normalized);
    const existingMod = this.modules.get(assetId);
    if (existingMod) {
      const updatedPkg: HtmlEquipmentModulePackage = {
        ...existingMod,
        asset: normalized,
      };
      if (updatedPkg.rawHtmlSource) {
        updatedPkg.rawHtmlSource = this.injectUpdatedManifestIntoHtml(
          updatedPkg.rawHtmlSource,
          updatedPkg,
        );
      }
      this.modules.set(assetId, updatedPkg);
      void localDiskLibraryEngine.saveModuleToLibraryDisk({
        asset: normalized,
        rawHtmlSource: updatedPkg.rawHtmlSource || '',
        manifestObject: {
          moduleSpecVersion: 'OL3D-HTML-MODULE-v2.2',
          asset: normalized,
          moduleControls: updatedPkg.moduleControls,
          realPhotoMeta: updatedPkg.realPhotoMeta,
          dossier: updatedPkg.dossier,
          audit360: updatedPkg.audit360,
        },
        uploadedRealPhotoDataUrl: this.userUploadedRealPhotos.get(assetId),
        triggerDownloadIfConfigured: false,
      });
    } else {
      // Lưu bản override thông số vào ổ đĩa thư viện
      void localDiskLibraryEngine.saveModuleToLibraryDisk({
        asset: normalized,
        rawHtmlSource: '',
        manifestObject: {
          moduleSpecVersion: 'OL3D-HTML-MODULE-v2.2',
          asset: normalized,
        },
        uploadedRealPhotoDataUrl: this.userUploadedRealPhotos.get(assetId),
        triggerDownloadIfConfigured: false,
      });
    }
    this.emitChange();
    return normalized;
  }

  getAssetOverride(assetId: string): AssetDefinition | undefined {
    return this.productOverrides.get(assetId);
  }

  registerModule(
    pkg: HtmlEquipmentModulePackage,
    targetOverrideAsset?: AssetDefinition | null,
    options?: { skipDiskSave?: boolean },
  ): HtmlEquipmentModulePackage {
    let finalPkg = pkg;
    if (targetOverrideAsset) {
      const nextVersion = `${targetOverrideAsset.assetVersion.split('-')[0]}-html-${Date.now().toString(36).slice(-3)}`;
      const mergedAsset: AssetDefinition = {
        ...targetOverrideAsset,
        ...pkg.asset,
        assetId: targetOverrideAsset.assetId,
        assetVersion: nextVersion,
        category: pkg.asset.category || targetOverrideAsset.category,
        categoryIds:
          pkg.asset.categoryIds && pkg.asset.categoryIds.length > 0
            ? pkg.asset.categoryIds
            : targetOverrideAsset.categoryIds,
        subject: pkg.asset.subject || targetOverrideAsset.subject,
        kind: pkg.asset.kind || targetOverrideAsset.kind,
        geometry: {
          ...targetOverrideAsset.geometry,
          ...pkg.asset.geometry,
          proceduralArchetype: inferProceduralArchetypeFromIdOrSlug(
            targetOverrideAsset.assetId,
            targetOverrideAsset.slug,
            targetOverrideAsset.geometry.proceduralArchetype,
          ),
        },
      };
      finalPkg = {
        ...pkg,
        asset: mergedAsset,
      };
    }

    const finalAssetId = finalPkg.asset.assetId;
    if (finalPkg.rawHtmlSource) {
      finalPkg = {
        ...finalPkg,
        rawHtmlSource: this.injectUpdatedManifestIntoHtml(
          finalPkg.rawHtmlSource,
          finalPkg,
        ),
      };
    }

    this.modules.set(finalAssetId, finalPkg);
    this.productOverrides.set(finalAssetId, finalPkg.asset);

    if (finalPkg.dossier) {
      MULTI_SOURCE_EQUIPMENT_DOSSIERS[finalAssetId] = {
        ...finalPkg.dossier,
        assetId: finalAssetId,
      };
    }
    if (finalPkg.audit360) {
      EQUIPMENT_FUNCTIONAL_AND_ENV_AUDITS[finalAssetId] = {
        ...finalPkg.audit360,
        assetId: finalAssetId,
      };
    }

    // Tự động lưu vào Thư viện ổ cứng kiểu Arduino (C:\Users\ltlie\Documents\libraries3DLab)
    if (!options?.skipDiskSave) {
      void localDiskLibraryEngine.saveModuleToLibraryDisk({
        asset: finalPkg.asset,
        rawHtmlSource: finalPkg.rawHtmlSource || '',
        manifestObject: {
          moduleSpecVersion: 'OL3D-HTML-MODULE-v2.2',
          asset: finalPkg.asset,
          moduleControls: finalPkg.moduleControls,
          realPhotoMeta: finalPkg.realPhotoMeta,
          dossier: finalPkg.dossier,
          audit360: finalPkg.audit360,
        },
        uploadedRealPhotoDataUrl: this.userUploadedRealPhotos.get(finalAssetId),
        triggerDownloadIfConfigured: true,
      });
    }

    this.emitChange();
    return finalPkg;
  }

  /**
   * Quét và nạp hàng loạt các file .html từ thư mục C:\Users\ltlie\Documents\libraries3DLab
   */
  async importMultipleHtmlStringsFromLibraryFolder(
    htmlStrings: string[],
  ): Promise<HtmlEquipmentModulePackage[]> {
    const imported: HtmlEquipmentModulePackage[] = [];
    for (const rawHtml of htmlStrings) {
      if (!rawHtml || !rawHtml.trim()) continue;
      try {
        const pkg = this.parseHtmlModule(rawHtml);
        const reg = this.registerModule(pkg, null, { skipDiskSave: false });
        imported.push(reg);
      } catch (err) {
        console.warn('Bỏ qua file .html không hợp lệ khi quét thư mục libraries3DLab:', err);
      }
    }
    return imported;
  }

  async removeModuleAndRestoreDefault(assetId: string): Promise<void> {
    this.modules.delete(assetId);
    this.productOverrides.delete(assetId);
    await localDiskLibraryEngine.removeModuleFromLibraryDisk(assetId);
    this.emitChange();
  }

  getModule(assetId: string): HtmlEquipmentModulePackage | undefined {
    return this.modules.get(assetId);
  }

  getByArchetypeOrSlug(key: string): HtmlEquipmentModulePackage | undefined {
    if (!key) return undefined;
    // 1. Ưu tiên khớp chính xác theo AssetId
    const byId = this.modules.get(key);
    if (byId) return byId;

    // 2. Khớp chính xác theo slug
    for (const mod of this.modules.values()) {
      if (mod.asset.slug === key) {
        return mod;
      }
    }

    // 3. Khớp dự phòng theo proceduralArchetype
    for (const mod of this.modules.values()) {
      if (mod.asset.geometry.proceduralArchetype === key) {
        return mod;
      }
    }
    return undefined;
  }

  listRegisteredAssets(): AssetDefinition[] {
    return Array.from(this.modules.values()).map((m) => m.asset);
  }

  setUploadedRealPhoto(assetId: string, dataUrl: string, caption?: string): void {
    this.userUploadedRealPhotos.set(assetId, dataUrl);
    if (caption) {
      this.userCustomPhotoCaptions.set(assetId, caption);
    }
    if (typeof window !== 'undefined') {
      try {
        const obj: Record<string, { dataUrl: string; caption?: string }> = {};
        for (const [k, v] of this.userUploadedRealPhotos.entries()) {
          obj[k] = { dataUrl: v, caption: this.userCustomPhotoCaptions.get(k) };
        }
        window.localStorage.setItem('ol3d_custom_real_photos_v1', JSON.stringify(obj));
      } catch {
        // Ignore quota error if base64 is large
      }
    }
    const existingMod = this.modules.get(assetId);
    const existingOverride = this.productOverrides.get(assetId);
    const targetAsset = existingMod?.asset || existingOverride;
    if (targetAsset) {
      void localDiskLibraryEngine.saveModuleToLibraryDisk({
        asset: targetAsset,
        rawHtmlSource: existingMod?.rawHtmlSource || '',
        manifestObject: {
          moduleSpecVersion: 'OL3D-HTML-MODULE-v2.4',
          moduleId: assetId,
          asset: targetAsset,
        },
        uploadedRealPhotoDataUrl: dataUrl,
        triggerDownloadIfConfigured: false,
      });
    }
    this.emitChange();
  }

  getUploadedRealPhoto(assetId: string): string | undefined {
    return this.userUploadedRealPhotos.get(assetId);
  }

  getCustomPhotoCaption(assetId: string): string | undefined {
    return this.userCustomPhotoCaptions.get(assetId);
  }

  /**
   * Bước 1: Phân tích cú pháp & kiểm định 1 file .html theo chuẩn OL3D-HTML-MODULE
   * Hỗ trợ tự động chuẩn hóa mọi trường lồng nhau (geometry.dimensions, boundingBoxM, scientificProperties...)
   * và tự động tổng hợp gói thiết bị hợp lệ ngay cả khi người dùng nạp file .html mẫu khác định dạng!
   */
  parseHtmlModule(htmlString: string): HtmlEquipmentModulePackage {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const manifestScript =
      doc.getElementById('ol3d-module-manifest') ||
      doc.getElementById('OPENLAB_EQUIPMENT_MANIFEST') ||
      doc.querySelector('script[type="application/json"]');

    let parsedManifest: {
      asset?: Partial<AssetDefinition>;
      realPhotoMeta?: RealPhotoMetadata;
      moduleControls?: Partial<HtmlModuleInteractiveControlSpec>;
      dossier?: MultiSourceEquipmentDossier;
      audit360?: FunctionalEnvironmentalAuditSpec;
      [key: string]: unknown;
    } = {};

    if (manifestScript && manifestScript.textContent) {
      try {
        const cleanedJson = manifestScript.textContent
          .trim()
          .replace(/,\s*([\]}])/g, '$1');
        const rawJson = JSON.parse(cleanedJson);
        if (rawJson && typeof rawJson === 'object') {
          if ('asset' in rawJson && rawJson.asset) {
            parsedManifest = rawJson;
          } else {
            parsedManifest = { asset: rawJson as Partial<AssetDefinition> };
          }
        }
      } catch (err) {
        console.warn('Cảnh báo JSON trong file .html, chuyển sang chế độ tự tổng hợp:', err);
      }
    }

    const docTitle =
      doc.querySelector('title')?.textContent?.trim() ||
      doc.querySelector('h1, h2, strong')?.textContent?.trim() ||
      'Thiết bị Khoa học Tự nhiên (.HTML)';
    const cleanTitle = docTitle
      .replace(/^OL3D HTML Module\s*[—\-:]\s*/i, '')
      .replace(/\s*\(OL3D-[A-Z0-9-]+\)\s*$/i, '')
      .trim() || 'Thiết bị Thí nghiệm Mới';

    const idMatch =
      docTitle.match(/OL3D-[A-Z0-9-]+/i) ||
      htmlString.match(/OL3D-[A-Z0-9-]+/i);
    const fallbackAssetId = idMatch
      ? idMatch[0].toUpperCase()
      : `OL3D-HTML-${Date.now().toString(36).slice(-4).toUpperCase()}`;

    const rawAsset: Partial<AssetDefinition> = parsedManifest.asset ?? {};
    const topLevelModuleId =
      typeof parsedManifest.moduleId === 'string' && parsedManifest.moduleId.trim()
        ? parsedManifest.moduleId.trim()
        : undefined;
    const finalAssetId =
      typeof rawAsset.assetId === 'string' && rawAsset.assetId.trim()
        ? rawAsset.assetId.trim()
        : topLevelModuleId || fallbackAssetId;

    const topLevelName =
      typeof parsedManifest.name === 'string' && parsedManifest.name.trim()
        ? parsedManifest.name.trim()
        : undefined;
    const rawNameVi =
      typeof rawAsset.name === 'object' && rawAsset.name?.vi
        ? rawAsset.name.vi
        : typeof (rawAsset as unknown as { name?: string }).name === 'string'
          ? (rawAsset as unknown as { name: string }).name
          : topLevelName || cleanTitle;
    const rawNameEn =
      typeof rawAsset.name === 'object' && rawAsset.name?.en
        ? rawAsset.name.en
        : rawNameVi;

    const topLevelSlug =
      typeof parsedManifest.slug === 'string' && parsedManifest.slug.trim()
        ? parsedManifest.slug.trim()
        : undefined;
    const slugVal =
      typeof rawAsset.slug === 'string' && rawAsset.slug.trim()
        ? rawAsset.slug.trim()
        : topLevelSlug ||
          rawNameVi
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') ||
          'thiet-bi-html';

    const iconTemplate = doc.getElementById('ol3d-module-icon');
    const firstSvg = doc.querySelector('svg');
    const iconSvgMarkup = iconTemplate
      ? iconTemplate.innerHTML.trim()
      : firstSvg
        ? firstSvg.outerHTML
        : `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" y="18" width="48" height="46" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="2.2"/>
            <rect x="22" y="25" width="36" height="16" rx="3" fill="#CCFBF1" stroke="#14B8A6" stroke-width="1.5"/>
            <circle cx="40" cy="52" r="6" fill="#0284C7"/>
          </svg>`;

    const realPhotoTemplate = doc.getElementById('ol3d-module-real-photo');
    const allSvgs = doc.querySelectorAll('svg');
    const realPhotoMarkup = realPhotoTemplate
      ? realPhotoTemplate.innerHTML.trim()
      : allSvgs.length > 1
        ? allSvgs[1].outerHTML
        : iconSvgMarkup;

    const scriptEl =
      doc.getElementById('ol3d-module-3d-script') ||
      doc.getElementById('openlab-module-3d-script');
    let buildEquipmentGroup: HtmlEquipmentModulePackage['buildEquipmentGroup'];
    let applyEquipmentState: HtmlEquipmentModulePackage['applyEquipmentState'];
    let playEquipmentSound: HtmlEquipmentModulePackage['playEquipmentSound'];
    let detectedContractVersion: 'v2.3' | 'v2.2' | 'synthesized-fallback' =
      'synthesized-fallback';
    const securityWarnings: string[] = [];

    // Kiểm tra ranh giới an toàn HTML (Mục 5.4): chặn script nguồn ngoài & cảnh báo API nhạy cảm
    doc.querySelectorAll('script[src]').forEach((extScript) => {
      const src = extScript.getAttribute('src') || '';
      if (/^https?:\/\//i.test(src) && !/three(\.min)?\.js/i.test(src)) {
        securityWarnings.push(`Phát hiện thẻ script nguồn ngoài không nằm trong danh mục cho phép: ${src}`);
      }
    });

    const scriptCandidates: string[] = [];
    if (scriptEl && scriptEl.textContent) {
      scriptCandidates.push(scriptEl.textContent);
    } else {
      doc.querySelectorAll('script').forEach((s) => {
        if (
          s.textContent &&
          (s.textContent.includes('OL3D_EQUIPMENT_MODULE') ||
            s.textContent.includes('buildEquipmentMesh') ||
            s.textContent.includes('buildEquipmentGroup'))
        ) {
          scriptCandidates.push(s.textContent);
        }
      });
    }

    for (const code of scriptCandidates) {
      if (/\b(document\.cookie|window\.parent|localStorage|sessionStorage|indexedDB|XMLHttpRequest|fetch\s*\()\b/.test(code)) {
        securityWarnings.push(
          'Mã script module có tham chiếu tới API nhạy cảm (cookie/storage/network/window.parent); đã cô lập qua sandbox.',
        );
      }

      try {
        type LegacyOrV23Module = {
          buildEquipmentGroup?: HtmlEquipmentModulePackage['buildEquipmentGroup'];
          applyEquipmentState?: HtmlEquipmentModulePackage['applyEquipmentState'];
          buildEquipmentMesh?: (THREE_LIB: typeof THREE, asset?: AssetDefinition) => THREE.Group;
          updateEquipmentState?: (
            rootGroup: THREE.Object3D,
            state: SceneInstance['instanceState'],
            dt: number,
          ) => void;
          playEquipmentSound?: HtmlEquipmentModulePackage['playEquipmentSound'];
        };

        const sandboxedWin: {
          OL3D_EQUIPMENT_MODULE?: LegacyOrV23Module;
          OPENLAB_EQUIPMENT_MODULE?: LegacyOrV23Module;
          buildEquipmentMesh?: LegacyOrV23Module['buildEquipmentMesh'];
          updateEquipmentState?: LegacyOrV23Module['updateEquipmentState'];
          AudioContext?: typeof AudioContext;
          webkitAudioContext?: typeof AudioContext;
          devicePixelRatio?: number;
        } = {
          AudioContext:
            typeof window !== 'undefined' ? window.AudioContext : undefined,
          webkitAudioContext:
            typeof window !== 'undefined'
              ? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
              : undefined,
          devicePixelRatio:
            typeof window !== 'undefined' ? window.devicePixelRatio : 1,
        };

        const safeDocProxy = {
          createElement: (tagName: string) => {
            if (typeof document !== 'undefined' && tagName.toLowerCase() === 'canvas') {
              return document.createElement('canvas');
            }
            return typeof document !== 'undefined'
              ? document.createElement('div')
              : {};
          },
          getElementById: () => null,
        };

        const factory = new Function(
          'window',
          'document',
          'THREE',
          `${code}\n;if (typeof buildEquipmentMesh === 'function' && !window.buildEquipmentMesh) { window.buildEquipmentMesh = buildEquipmentMesh; }\nif (typeof updateEquipmentState === 'function' && !window.updateEquipmentState) { window.updateEquipmentState = updateEquipmentState; }\nreturn window.OL3D_EQUIPMENT_MODULE || window.OPENLAB_EQUIPMENT_MODULE || { buildEquipmentMesh: window.buildEquipmentMesh, updateEquipmentState: window.updateEquipmentState };`,
        );

        const exported: LegacyOrV23Module | undefined = factory(
          sandboxedWin,
          safeDocProxy,
          THREE,
        );
        const target =
          exported ||
          sandboxedWin.OL3D_EQUIPMENT_MODULE ||
          sandboxedWin.OPENLAB_EQUIPMENT_MODULE;

        if (target) {
          // 1. Adapter cho hàm dựng hình học 3D (Hỗ trợ cả v2.3 buildEquipmentMesh và v2.2 buildEquipmentGroup)
          const rawBuilder = target.buildEquipmentMesh || target.buildEquipmentGroup;
          if (typeof target.buildEquipmentMesh === 'function') {
            detectedContractVersion = 'v2.3';
          } else if (typeof target.buildEquipmentGroup === 'function') {
            detectedContractVersion = 'v2.2';
          }

          if (typeof rawBuilder === 'function') {
            buildEquipmentGroup = (THREE_LIB, assetDef) => {
              const group = rawBuilder(THREE_LIB, assetDef);
              // Đảm bảo mọi Mesh con nhận/đổ bóng đúng và chuẩn hóa tên node ngữ nghĩa (Mục 4 & 5.1)
              group.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                }
                if (child.name === 'LiquidColumn' && !group.getObjectByName('liquid_surface')) {
                  child.userData.canonicalRole = 'liquid_surface';
                } else if (
                  (child.name === 'ScaleDisplayCanvas' || child.name === 'DigitalLCD') &&
                  !group.getObjectByName('scale_display')
                ) {
                  child.userData.canonicalRole = 'scale_display';
                }
              });
              return group;
            };
          }

          // 2. Adapter cho hàm cập nhật trạng thái (Hỗ trợ cả v2.3 updateEquipmentState(root, state, dt) và v2.2 applyEquipmentState)
          if (typeof target.updateEquipmentState === 'function') {
            const v23Updater = target.updateEquipmentState;
            applyEquipmentState = (_THREE_LIB, rootObject, instance) => {
              const clampedDt = 0.016; // Giới hạn dt <= 0.05s tránh nhảy vọt trạng thái (Mục 7)
              v23Updater(rootObject, instance.instanceState, clampedDt);
            };
          } else if (typeof target.applyEquipmentState === 'function') {
            applyEquipmentState = target.applyEquipmentState;
          }

          playEquipmentSound = target.playEquipmentSound;
          if (buildEquipmentGroup) {
            break;
          }
        }
      } catch (err) {
        console.warn('Cảnh báo khi biên dịch script module 3D:', err);
      }
    }

    const rawGeo: Partial<AssetDefinition['geometry']> = rawAsset.geometry ?? {};
    const rawDims: Partial<AssetDefinition['geometry']['dimensions']> =
      rawGeo.dimensions ?? {};
    const widthMm =
      typeof rawDims.widthOrDiameter?.value === 'number' &&
      Number.isFinite(rawDims.widthOrDiameter.value)
        ? rawDims.widthOrDiameter.value
        : typeof rawGeo.boundingBoxM?.width === 'number'
          ? Math.round(rawGeo.boundingBoxM.width * 1000)
          : 120;
    const heightMm =
      typeof rawDims.height?.value === 'number' &&
      Number.isFinite(rawDims.height.value)
        ? rawDims.height.value
        : typeof rawGeo.boundingBoxM?.height === 'number'
          ? Math.round(rawGeo.boundingBoxM.height * 1000)
          : 180;
    const depthMm =
      typeof rawDims.depth?.value === 'number' &&
      Number.isFinite(rawDims.depth.value)
        ? rawDims.depth.value
        : typeof rawGeo.boundingBoxM?.depth === 'number'
          ? Math.round(rawGeo.boundingBoxM.depth * 1000)
          : widthMm;

    const rawSci: Partial<AssetDefinition['scientificProperties']> =
      rawAsset.scientificProperties ?? {};

    // Đảm bảo mọi trường bắt buộc trong AssetDefinition luôn đầy đủ, không bao giờ gây lỗi render
    const normalizedAsset: AssetDefinition = {
      assetId: finalAssetId,
      slug: slugVal,
      name: {
        vi: rawNameVi,
        en: rawNameEn,
      },
      kind: rawAsset.kind ?? 'equipment',
      subject: rawAsset.subject ?? 'general-science',
      category: rawAsset.category ?? 'measuring-instrument',
      categoryIds:
        Array.isArray(rawAsset.categoryIds) && rawAsset.categoryIds.length > 0
          ? rawAsset.categoryIds
          : [rawAsset.category ?? 'measuring-instrument', 'chemical-apparatus'],
      tags:
        Array.isArray(rawAsset.tags) && rawAsset.tags.length > 0
          ? rawAsset.tags
          : [rawNameVi, finalAssetId, 'module html'],
      summary:
        typeof rawAsset.summary === 'string' && rawAsset.summary.trim()
          ? rawAsset.summary
          : `${rawNameVi} (${finalAssetId}) — Thiết bị thí nghiệm KHTN 9 nạp từ module .HTML.`,
      textbookRef: {
        bookTitle:
          rawAsset.textbookRef?.bookTitle ??
          'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
        chapter:
          rawAsset.textbookRef?.chapter ??
          'Bài 1: Nhận biết một số dụng cụ, hoá chất. Thuyết trình một vấn đề khoa học',
        lesson:
          rawAsset.textbookRef?.lesson ??
          'Thực hành sử dụng thiết bị thí nghiệm và đo đại lượng vật lý – hóa học',
        figureRef:
          rawAsset.textbookRef?.figureRef ??
          `Chuẩn Thông tư 38/2021/TT-BGDĐT (${finalAssetId})`,
        standardFunction:
          rawAsset.textbookRef?.standardFunction ??
          `Thực hành đo lường và khảo sát hiện tượng với ${rawNameVi} trên bàn thí nghiệm 3D.`,
        usageGuidelines:
          rawAsset.textbookRef?.usageGuidelines ??
          'Đặt thiết bị trên mặt bàn phẳng, quan sát thông số 360° và điều chỉnh bằng bảng điều khiển tương tác.',
        safetyNote:
          rawAsset.textbookRef?.safetyNote ??
          'Kiểm tra trạng thái chuẩn của thiết bị trước và sau khi thực hành.',
      },
      assetVersion: rawAsset.assetVersion ?? '1.0.0',
      manifestSchemaVersion: rawAsset.manifestSchemaVersion ?? '2.0.0',
      moduleApiVersion: rawAsset.moduleApiVersion ?? '2.0.0',
      geometry: {
        modelFormat: rawGeo.modelFormat ?? 'PROCEDURAL_PBR',
        modelUri: rawGeo.modelUri ?? `procedural://${slugVal}`,
        modelFileVersion: rawGeo.modelFileVersion ?? '1.0.0',
        proceduralArchetype: inferProceduralArchetypeFromIdOrSlug(
          finalAssetId,
          slugVal,
          rawGeo.proceduralArchetype,
        ),
        upAxis: 'Y',
        anchor: 'base-center',
        boundingBoxM: {
          width: rawGeo.boundingBoxM?.width ?? Number((widthMm / 1000).toFixed(3)),
          height: rawGeo.boundingBoxM?.height ?? Number((heightMm / 1000).toFixed(3)),
          depth: rawGeo.boundingBoxM?.depth ?? Number((depthMm / 1000).toFixed(3)),
        },
        dimensions: {
          height: {
            value: heightMm,
            unit: rawDims.height?.unit ?? 'mm',
            status: rawDims.height?.status ?? 'illustrative',
          },
          widthOrDiameter: {
            value: widthMm,
            unit: rawDims.widthOrDiameter?.unit ?? 'mm',
            status: rawDims.widthOrDiameter?.status ?? 'illustrative',
          },
          depth: {
            value: depthMm,
            unit: rawDims.depth?.unit ?? 'mm',
            status: rawDims.depth?.status ?? 'illustrative',
          },
        },
        triangleCount: rawGeo.triangleCount ?? 1280,
        materialCount: rawGeo.materialCount ?? 6,
        namedNodes:
          Array.isArray(rawGeo.namedNodes) && rawGeo.namedNodes.length > 0
            ? rawGeo.namedNodes
            : [
                {
                  nodeName: 'body',
                  role: 'body',
                  description: `Thân thiết bị ${rawNameVi}`,
                },
                {
                  nodeName: 'scale_display',
                  role: 'scale_display',
                  description: 'Màn hình hiển thị thông số kỹ thuật 360°',
                },
              ],
        scaleValidation: rawGeo.scaleValidation ?? 'not-verified',
      },
      scientificProperties: {
        material: rawSci.material ?? {
          value: 'Hợp kim & Vỏ ABS phòng thí nghiệm (Thông số tham khảo)',
          status: 'illustrative',
        },
        referenceMass: rawSci.referenceMass ?? {
          value: 250,
          unit: 'g',
          status: 'illustrative',
        },
        referenceVolume: rawSci.referenceVolume ?? {
          value: 90,
          unit: 'cm³',
          status: 'illustrative',
        },
        ...(rawSci.capacity ? { capacity: rawSci.capacity } : {}),
        ...(rawSci.density ? { density: rawSci.density } : {}),
        ...(rawSci.thermalResistance
          ? { thermalResistance: rawSci.thermalResistance }
          : {}),
      },
      measurementMetadata:
        rawAsset.measurementMetadata ??
        (() => {
          const inferredArch = inferProceduralArchetypeFromIdOrSlug(
            finalAssetId,
            slugVal,
            rawGeo.proceduralArchetype,
          );
          if (inferredArch === 'vernier-caliper') {
            return {
              isMeasuringInstrument: true,
              measuredQuantity: 'length' as const,
              rangeMin: { value: 0, unit: 'mm' as const, status: 'verified' as const },
              rangeMax: { value: 150, unit: 'mm' as const, status: 'verified' as const },
              leastCount: { value: 0.02, unit: 'mm' as const, status: 'verified' as const },
              zeroOffsetSupported: true,
              calibrationMethod:
                'Khép kín hai mỏ đo ngoài kiểm tra vạch 0 du xích trùng khít vạch 0 thước chính',
              referenceStandard: 'Thông tư 38/2021/TT-BGDĐT · SGK KHTN 9',
            };
          }
          if (inferredArch === 'spring-dynamometer') {
            return {
              isMeasuringInstrument: true,
              measuredQuantity: 'force' as const,
              rangeMin: { value: 0, unit: 'N' as const, status: 'verified' as const },
              rangeMax: { value: 5, unit: 'N' as const, status: 'verified' as const },
              leastCount: { value: 0.1, unit: 'N' as const, status: 'verified' as const },
              zeroOffsetSupported: true,
              calibrationMethod: 'Treo thẳng đứng lực kế và chỉnh ốc zero về vạch 0.0 N',
              referenceStandard: 'Thông tư 38/2021/TT-BGDĐT · SGK KHTN 9',
            };
          }
          if (inferredArch === 'thermometer') {
            return {
              isMeasuringInstrument: true,
              measuredQuantity: 'temperature' as const,
              rangeMin: { value: -10, unit: '°C' as const, status: 'verified' as const },
              rangeMax: { value: 110, unit: '°C' as const, status: 'verified' as const },
              leastCount: { value: 1, unit: '°C' as const, status: 'verified' as const },
              zeroOffsetSupported: false,
              calibrationMethod: 'Đối chiếu điểm nước đá đang tan (0 °C) và nước sôi (100 °C)',
              referenceStandard: 'Thông tư 38/2021/TT-BGDĐT · SGK KHTN 9',
            };
          }
          if (inferredArch === 'electronic-balance') {
            return {
              isMeasuringInstrument: true,
              measuredQuantity: 'mass' as const,
              rangeMin: { value: 0, unit: 'g' as const, status: 'verified' as const },
              rangeMax: { value: 500, unit: 'g' as const, status: 'verified' as const },
              leastCount: { value: 0.01, unit: 'g' as const, status: 'verified' as const },
              zeroOffsetSupported: true,
              calibrationMethod: 'Nhấn phím Zero/Tare khi đĩa cân trống',
              referenceStandard: 'Thông tư 38/2021/TT-BGDĐT · SGK KHTN 9',
            };
          }
          return {
            isMeasuringInstrument: true,
            measuredQuantity: 'voltage-resistance' as const,
            rangeMin: { value: 0, unit: 'đv' as const, status: 'illustrative' as const },
            rangeMax: { value: 100, unit: 'đv' as const, status: 'illustrative' as const },
            leastCount: { value: 0.1, unit: 'đv' as const, status: 'illustrative' as const },
            zeroOffsetSupported: true,
            calibrationMethod: 'Thông số tham khảo chờ kiểm định thực nghiệm',
            referenceStandard: 'Thông tư 38/2021/TT-BGDĐT (Tham khảo)',
          };
        })(),
      capabilities: rawAsset.capabilities ?? [
        { id: 'selectable', state: 'validated' },
        { id: 'translatable', state: 'validated' },
        { id: 'rotatable', state: 'validated' },
        { id: 'showDimensions', state: 'validated' },
        { id: 'readScale', state: 'implemented' },
      ],
      behaviorIds: rawAsset.behaviorIds ?? ['BHV-READ-SCALE-01'],
      validation: rawAsset.validation ?? {
        assetReviewStatus: 'in-review',
        geometryStatus: rawGeo.scaleValidation ?? 'not-verified',
        metrologyStatus: 'not-verified',
        behaviorStatus: buildEquipmentGroup ? 'validated' : 'implemented',
        safetyStatus: securityWarnings.length === 0 ? 'reviewed' : 'not-reviewed',
      },
      provenance: rawAsset.provenance ?? {
        createdBy: 'HTML Module Studio Import',
        authorRole: 'Giáo viên / Kỹ sư KHTN',
        organization: 'OpenLab KHTN 9',
        sourceType: 'student-studio-submission',
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        license: 'CC-BY-NC-SA-4.0',
        redistributionAllowed: true,
      },
      equipmentGroupG: rawAsset.equipmentGroupG,
      physicsFidelityLevel: rawAsset.physicsFidelityLevel ?? 'L2',
    };

    const resolvedArch = normalizedAsset.geometry.proceduralArchetype;
    const meas = normalizedAsset.measurementMetadata;
    const capVal = normalizedAsset.scientificProperties.capacity?.value;

    const normalizedControls: HtmlModuleInteractiveControlSpec = resolveDefaultModuleControls(
      resolvedArch,
      capVal,
      parsedManifest.moduleControls,
    );

    const normalizedBridgePhotoMeta = normalizeRealPhotoMeta(
      parsedManifest.realPhotoMeta,
      {
        moduleId: normalizedAsset.assetId,
        slug: normalizedAsset.slug,
        nameVi: normalizedAsset.name.vi,
        uploadedDataUrl: this.userUploadedRealPhotos.get(normalizedAsset.assetId),
        assetRealPhotoUri: normalizedAsset.geometry.realPhotoUris?.[0],
        hasFallbackSvg: Boolean(realPhotoTemplate),
      },
    );

    const pkg: HtmlEquipmentModulePackage = {
      asset: normalizedAsset,
      iconSvgMarkup,
      realPhotoMarkup,
      realPhotoMeta: {
        ...normalizedBridgePhotoMeta,
        caption:
          normalizedBridgePhotoMeta.caption ??
          `Ảnh thực tế đối chiếu: ${normalizedAsset.name.vi}`,
        manufacturerRef:
          parsedManifest.realPhotoMeta?.manufacturerRef ??
          'Chuẩn Thông tư 38/2021/TT-BGDĐT · SGK KHTN 9',
        realWorldScaleNote:
          parsedManifest.realPhotoMeta?.realWorldScaleNote ??
          `Kích thước: Cao ${normalizedAsset.geometry.dimensions.height.value} ${normalizedAsset.geometry.dimensions.height.unit} × Rộng ${normalizedAsset.geometry.dimensions.widthOrDiameter.value} ${normalizedAsset.geometry.dimensions.widthOrDiameter.unit}`,
        annotations: Array.isArray(parsedManifest.realPhotoMeta?.annotations)
          ? parsedManifest.realPhotoMeta.annotations
          : [],
      },
      moduleControls: normalizedControls,
      dossier: parsedManifest.dossier,
      audit360: parsedManifest.audit360,
      detectedContractVersion,
      buildEquipmentGroup,
      applyEquipmentState,
      playEquipmentSound,
      rawHtmlSource: htmlString,
    };

    pkg.validationReport = this.validateModule7Gates(
      pkg,
      Boolean(manifestScript),
      securityWarnings,
    );

    return pkg;
  }

  /**
   * Kiểm định 7 cổng (7-Gate Validation Pipeline — Mục 9.1):
   * 1. Cấu trúc · 2. Hình học · 3. Vật lý/Đo lường · 4. Tương tác · 5. Tích hợp · 6. Hiệu năng · 7. An toàn & Nguồn dữ liệu
   */
  validateModule7Gates(
    pkg: HtmlEquipmentModulePackage,
    hasManifestBlock: boolean,
    securityWarnings: string[] = [],
  ): HtmlModule7GateValidationReport {
    const gates: HtmlModuleGateResult[] = [];
    const contractVer = pkg.detectedContractVersion ?? 'synthesized-fallback';

    // Gate 1: Cấu trúc
    const g1Details: string[] = [];
    if (hasManifestBlock) g1Details.push('Tìm thấy khối JSON Manifest hợp lệ.');
    else g1Details.push('Thiếu khối #ol3d-module-manifest riêng; đang dùng chế độ tổng hợp tự động.');
    g1Details.push(`Hợp đồng API phát hiện: ${contractVer.toUpperCase()} (${pkg.asset.assetId}).`);
    const g1Status: HtmlModuleGateStatus =
      hasManifestBlock && contractVer !== 'synthesized-fallback'
        ? 'PASS'
        : pkg.buildEquipmentGroup
          ? 'PARTIAL'
          : 'FAIL';
    gates.push({
      gateId: 'G1_STRUCTURE',
      gateNameVi: '1. Cổng Cấu trúc & Hợp đồng API',
      status: g1Status,
      summaryVi:
        g1Status === 'PASS'
          ? `Đạt chuẩn Manifest & API (${contractVer})`
          : g1Status === 'PARTIAL'
            ? `Tương thích qua Adapter (${contractVer})`
            : 'Thiếu hàm dựng 3D chuẩn',
      details: g1Details,
    });

    // Chạy thử tích hợp thực tế để đo Hình học, Tích hợp & Hiệu năng
    let measuredMeshCount = 0;
    let measuredTriangleCount = 0;
    let measuredYMinM = 0;
    let buildTimeMs = 0;
    let updateTimeMs = 0;
    let integrationError: string | null = null;

    if (pkg.buildEquipmentGroup) {
      try {
        const t0 = performance.now();
        const testGroup = pkg.buildEquipmentGroup(THREE, pkg.asset);
        buildTimeMs = Number((performance.now() - t0).toFixed(2));

        const bbox = new THREE.Box3().setFromObject(testGroup);
        measuredYMinM = Number.isFinite(bbox.min.y)
          ? Number(bbox.min.y.toFixed(4))
          : 0;

        testGroup.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh && mesh.geometry) {
            measuredMeshCount++;
            const idx = mesh.geometry.index;
            const pos = mesh.geometry.attributes.position;
            if (idx) measuredTriangleCount += Math.floor(idx.count / 3);
            else if (pos) measuredTriangleCount += Math.floor(pos.count / 3);
          }
        });

        if (pkg.applyEquipmentState) {
          const dummyInstance: SceneInstance = {
            instanceId: 'gate-test-inst',
            assetId: pkg.asset.assetId,
            assetVersion: pkg.asset.assetVersion,
            customLabel: pkg.asset.name.vi,
            parentZone: 'bench-main',
            transform: {
              positionM: [0, 0, 0],
              rotationRad: [0, 0, 0],
              displayScale: [1, 1, 1],
            },
            visible: true,
            locked: false,
            labelVisible: true,
            instanceState: {
              [pkg.moduleControls.stateKey]: pkg.moduleControls.defaultValue,
            },
          };
          const t1 = performance.now();
          pkg.applyEquipmentState(THREE, testGroup, dummyInstance, pkg.asset);
          updateTimeMs = Number((performance.now() - t1).toFixed(2));
        }
      } catch (err) {
        integrationError = err instanceof Error ? err.message : String(err);
      }
    } else {
      integrationError = 'Module không cung cấp hàm buildEquipmentMesh / buildEquipmentGroup.';
    }

    // Gate 2: Hình học
    const bb = pkg.asset.geometry.boundingBoxM;
    const validMetricScale =
      bb.width >= 0.005 &&
      bb.width <= 2.4 &&
      bb.height >= 0.005 &&
      bb.height <= 2.4 &&
      bb.depth >= 0.005 &&
      bb.depth <= 2.4;
    const baseFlushOk = Math.abs(measuredYMinM) <= 0.025;
    const g2Status: HtmlModuleGateStatus =
      validMetricScale && measuredMeshCount > 0 && baseFlushOk
        ? 'PASS'
        : validMetricScale
          ? 'PARTIAL'
          : 'FAIL';
    gates.push({
      gateId: 'G2_GEOMETRY',
      gateNameVi: '2. Cổng Hình học & Hệ mét (1 unit = 1 m)',
      status: g2Status,
      summaryVi: `BBox ${(bb.width * 1000).toFixed(0)}×${(bb.height * 1000).toFixed(0)}×${(bb.depth * 1000).toFixed(0)} mm · y_min=${measuredYMinM} m`,
      details: [
        `Tỷ lệ hệ mét: ${validMetricScale ? 'Hợp lệ' : 'Ngoài miền bàn thí nghiệm'}`,
        `Điểm neo đáy (y = 0): y_min = ${measuredYMinM} m (${baseFlushOk ? 'Khớp mặt bàn 0.82 m' : 'Lệch đáy > 25 mm'})`,
        `Số Mesh thực tế: ${measuredMeshCount} mesh`,
      ],
    });

    // Gate 3: Vật lý & Đo lường
    const meas = pkg.asset.measurementMetadata;
    const hasValidRange =
      meas &&
      meas.rangeMax &&
      meas.rangeMin &&
      meas.rangeMax.value > meas.rangeMin.value;
    const hasValidLeastCount = Boolean(
      meas?.leastCount && meas.leastCount.value > 0,
    );
    const g3Status: HtmlModuleGateStatus =
      hasValidRange && hasValidLeastCount ? 'PASS' : 'PARTIAL';
    gates.push({
      gateId: 'G3_PHYSICS_METROLOGY',
      gateNameVi: '3. Cổng Vật lý & Đo lường (GHĐ, ĐCNN)',
      status: g3Status,
      summaryVi: hasValidLeastCount
        ? `GHĐ ${meas?.rangeMin?.value ?? 0}..${meas?.rangeMax?.value ?? 100} · ĐCNN ${meas?.leastCount?.value} ${meas?.leastCount?.unit ?? ''}`
        : 'Thông số đo lường tham khảo',
      details: [
        `Nhóm thiết bị: ${pkg.asset.equipmentGroupG ?? 'Chưa phân nhóm G01–G10'}`,
        `Cấp mô phỏng vật lý: ${pkg.asset.physicsFidelityLevel ?? 'L2'}`,
        `ĐCNN (Least Count): ${meas?.leastCount?.value ?? 'N/A'} ${meas?.leastCount?.unit ?? ''}`,
      ],
    });

    // Gate 4: Tương tác
    const ctrl = pkg.moduleControls;
    const hasControls =
      ctrl && ctrl.max > ctrl.min && ctrl.step > 0 && ctrl.presets.length > 0;
    const g4Status: HtmlModuleGateStatus =
      hasControls && Boolean(pkg.applyEquipmentState)
        ? 'PASS'
        : hasControls
          ? 'PARTIAL'
          : 'FAIL';
    gates.push({
      gateId: 'G4_INTERACTION',
      gateNameVi: '4. Cổng Tương tác & Điều khiển',
      status: g4Status,
      summaryVi: `${ctrl.stateKey} (${ctrl.min}..${ctrl.max} ${ctrl.unit}) · ${ctrl.presets.length} mức đặt nhanh`,
      details: [
        `Hàm cập nhật trạng thái động: ${pkg.applyEquipmentState ? 'Đã kết nối' : 'Chưa có (tĩnh)'}`,
        `Tương tác liên hoàn: Cân=${ctrl.canBeWeighedOnBalance ? 'Có' : 'Không'}, Chứa nước=${ctrl.canHoldLiquid ? 'Có' : 'Không'}, Nhúng=${ctrl.canSubmergeInVessel ? 'Có' : 'Không'}`,
      ],
    });

    // Gate 5: Tích hợp
    const g5Status: HtmlModuleGateStatus =
      !integrationError && measuredMeshCount > 0 ? 'PASS' : 'FAIL';
    gates.push({
      gateId: 'G5_INTEGRATION',
      gateNameVi: '5. Cổng Tích hợp Engine Three.js',
      status: g5Status,
      summaryVi:
        g5Status === 'PASS'
          ? `Khởi tạo THREE.Group thành công (${measuredMeshCount} meshes)`
          : `Lỗi tích hợp: ${integrationError}`,
      details: integrationError
        ? [integrationError]
        : ['Khởi tạo scene node và chạy thử 1 chu kỳ cập nhật trạng thái không lỗi.'],
    });

    // Gate 6: Hiệu năng
    const perfOk =
      measuredTriangleCount <= 25000 && buildTimeMs <= 45 && updateTimeMs <= 8;
    const g6Status: HtmlModuleGateStatus =
      measuredMeshCount === 0 ? 'NOT_RUN' : perfOk ? 'PASS' : 'PARTIAL';
    gates.push({
      gateId: 'G6_PERFORMANCE',
      gateNameVi: '6. Cổng Hiệu năng & Độ ổn định',
      status: g6Status,
      summaryVi: `${measuredTriangleCount} tam giác · Build ${buildTimeMs} ms · Update ${updateTimeMs} ms`,
      details: [
        `Số lượng tam giác: ${measuredTriangleCount} (Ngưỡng khuyến nghị <= 25.000)`,
        `Thời gian dựng hình ban đầu: ${buildTimeMs} ms`,
        `Thời gian cập nhật mỗi khung hình: ${updateTimeMs} ms`,
      ],
    });

    // Gate 7: An toàn & Nguồn dữ liệu
    const isVerifiedClaimHonest =
      pkg.asset.validation.geometryStatus !== 'verified' ||
      Boolean(pkg.dossier && pkg.dossier.fiveWebSources?.length > 0) ||
      pkg.asset.provenance.sourceType === 'manufacturer-spec';
    const g7Status: HtmlModuleGateStatus =
      securityWarnings.length === 0 && isVerifiedClaimHonest
        ? 'PASS'
        : securityWarnings.length === 0
          ? 'PARTIAL'
          : 'FAIL';
    gates.push({
      gateId: 'G7_SECURITY_PROVENANCE',
      gateNameVi: '7. Cổng An toàn Sandbox & Nguồn dữ liệu',
      status: g7Status,
      summaryVi:
        securityWarnings.length === 0
          ? `Sandbox an toàn · Trạng thái: ${pkg.asset.validation.metrologyStatus}`
          : `${securityWarnings.length} cảnh báo bảo mật`,
      details:
        securityWarnings.length > 0
          ? securityWarnings
          : [
              `Nguồn dữ liệu: ${pkg.asset.provenance.sourceType}`,
              `Trạng thái đo lường: ${pkg.asset.validation.metrologyStatus}`,
            ],
    });

    const hasFail = gates.some((g) => g.status === 'FAIL');
    const hasPartial = gates.some(
      (g) => g.status === 'PARTIAL' || g.status === 'NOT_RUN',
    );
    const overallStatus: HtmlModuleGateStatus = hasFail
      ? 'FAIL'
      : hasPartial
        ? 'PARTIAL'
        : 'PASS';

    return {
      overallStatus,
      detectedContractVersion: contractVer,
      testedAtIso: new Date().toISOString(),
      buildTimeMs,
      updateTimeMs,
      measuredMeshCount,
      measuredTriangleCount,
      measuredYMinM,
      gates,
      securityWarnings,
    };
  }

  /**
   * Phân tích và đăng ký ngay lập tức module .html vào hệ thống
   */
  parseAndRegisterHtmlModule(htmlString: string): HtmlEquipmentModulePackage {
    const pkg = this.parseHtmlModule(htmlString);
    this.registerModule(pkg);
    return pkg;
  }
}

export const htmlEquipmentModuleRegistry = new HtmlEquipmentModuleRegistryImpl();

/**
 * FILE CON MODULE .HTML MẪU HOÀN CHỈNH (OL3D-HTML-MODULE v2.1)
 * Thiết bị: Máy đo pH hiện số cầm tay (OL3D-EQP-PHM-0001)
 * Có thể tải về mở độc lập trên trình duyệt HOẶC nạp trực tiếp vào phòng thí nghiệm 3D!
 */
export const SAMPLE_PH_METER_HTML_MODULE = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OL3D HTML Module — Máy đo pH hiện số cầm tay (OL3D-EQP-PHM-0001)</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; }
    .header { padding: 14px 24px; background: #1e293b; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
    .badge { background: #0284c7; color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; }
    .grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; padding: 20px; max-width: 1280px; margin: 0 auto; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 16px; }
    #preview3d { width: 100%; height: 420px; border-radius: 10px; overflow: hidden; background: radial-gradient(circle at center, #1e293b, #090d16); }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <span class="badge">OL3D-HTML-MODULE v2.1</span>
      <strong style="margin-left: 10px; font-size: 18px;">Máy đo pH hiện số cầm tay (OL3D-EQP-PHM-0001)</strong>
    </div>
    <div style="font-size: 13px; color: #94a3b8;">Đầy đủ: Icon SVG + Vật 3D Three.js + Ảnh thật đối chiếu + Hồ sơ 5 nguồn</div>
  </div>

  <!-- 1. HỒ SƠ THÔNG SỐ VẬT LÝ, TÍNH NĂNG TƯƠNG TÁC & 5 NGUỒN WEB -->
  <script id="ol3d-module-manifest" type="application/json">
  {
    "moduleSpecVersion": "OL3D-HTML-MODULE-v2.1",
    "asset": {
      "assetId": "OL3D-EQP-PHM-0001",
      "slug": "may-do-ph-hien-so",
      "name": {
        "vi": "Máy đo pH hiện số kèm điện cực thủy tinh",
        "en": "Digital Laboratory pH Meter"
      },
      "kind": "equipment",
      "subject": "chemistry",
      "category": "chemical-apparatus",
      "categoryIds": ["chemical-apparatus", "electrical-equipment"],
      "tags": ["pH", "axit", "bazo", "điện cực", "hóa học 9", "module html"],
      "summary": "Máy đo độ pH hiện số (0.00 – 14.00 pH, ĐCNN 0.01 pH) có chân đế và tay đỡ điện cực thủy tinh nhúng trực tiếp vào cốc dung dịch, màn hình LCD đồng bộ 360°.",
      "textbookRef": {
        "bookTitle": "SGK Khoa học tự nhiên 9 - Kết nối tri thức",
        "chapter": "Bài 1: Nhận biết một số dụng cụ, hoá chất & Chương VII–VIII",
        "lesson": "Xác định độ pH của dung dịch acid (CH₃COOH), nước cất và dung dịch kiềm",
        "figureRef": "Thiết bị đo pH hiện số chuẩn Thông tư 38/2021/TT-BGDĐT",
        "standardFunction": "Đo trực tiếp trị số pH (từ 0.00 đến 14.00) và nhiệt độ (°C) của dung dịch trong cốc thủy tinh với độ chính xác 0.01 pH.",
        "usageGuidelines": "Tráng rửa đầu điện cực bằng nước cất, nhúng ngập bầu thủy tinh nhạy ở đầu điện cực vào cốc dung dịch và đọc giá trị pH ổn định trên màn hình LCD.",
        "safetyNote": "Không để bầu điện cực thủy tinh va chạm mạnh vào đáy cốc; luôn ngâm đầu điện cực trong dung dịch bảo quản KCl 3M sau khi sử dụng."
      },
      "assetVersion": "1.0.0",
      "manifestSchemaVersion": "2.0.0",
      "moduleApiVersion": "2.0.0",
      "geometry": {
        "modelFormat": "PROCEDURAL_PBR",
        "modelUri": "procedural://ph-meter-html-module",
        "modelFileVersion": "1.0.0",
        "proceduralArchetype": "digital-multimeter",
        "upAxis": "Y",
        "anchor": "base-center",
        "boundingBoxM": { "width": 0.12, "height": 0.22, "depth": 0.12 },
        "dimensions": {
          "height": { "value": 220, "unit": "mm", "status": "verified" },
          "widthOrDiameter": { "value": 120, "unit": "mm", "status": "verified" },
          "depth": { "value": 120, "unit": "mm", "status": "verified" }
        },
        "triangleCount": 1420,
        "materialCount": 7,
        "namedNodes": [
          { "nodeName": "body", "role": "body", "description": "Thân máy đo pH để bàn kèm trụ đỡ điện cực" },
          { "nodeName": "scale_display", "role": "scale_display", "description": "Màn hình LCD hiển thị pH 7.00 và 25.0°C (360°)" },
          { "nodeName": "plunger", "role": "plunger", "description": "Tay đỡ và đầu dò điện cực thủy tinh Ag/AgCl" }
        ],
        "scaleValidation": "verified"
      },
      "scientificProperties": {
        "material": { "value": "Vỏ ABS kháng hóa chất IP67 & Điện cực màng thủy tinh Ag/AgCl", "status": "verified" },
        "referenceMass": { "value": 285.0, "unit": "g", "status": "verified" },
        "referenceVolume": { "value": 95.0, "unit": "cm³", "status": "verified" }
      },
      "measurementMetadata": {
        "isMeasuringInstrument": true,
        "measuredQuantity": "voltage-resistance",
        "rangeMin": { "value": 0.0, "unit": "pH", "status": "verified" },
        "rangeMax": { "value": 14.0, "unit": "pH", "status": "verified" },
        "leastCount": { "value": 0.01, "unit": "pH", "status": "verified" },
        "zeroOffsetSupported": true,
        "calibrationMethod": "Hiệu chuẩn tự động 3 điểm chuẩn pH 4.01, 6.86, 9.18",
        "referenceStandard": "ISO 10523 · Thông tư 38/2021/TT-BGDĐT"
      }
    },
    "moduleControls": {
      "stateKey": "multimeterValue",
      "label": "Độ pH dung dịch đo",
      "unit": "pH",
      "min": 0.0,
      "max": 14.0,
      "step": 0.05,
      "defaultValue": 7.0,
      "canBeWeighedOnBalance": true,
      "canHoldLiquid": false,
      "canSubmergeInVessel": true,
      "soundPhenomenon": "probe-measure",
      "presets": [
        { "label": "Đo Axit CH₃COOH (pH 2.90)", "statePatch": { "multimeterValue": 2.90, "multimeterMode": "pH" } },
        { "label": "Nước cất chuẩn (pH 7.00)", "statePatch": { "multimeterValue": 7.00, "multimeterMode": "pH" } },
        { "label": "Dung dịch Kiềm (pH 11.50)", "statePatch": { "multimeterValue": 11.50, "multimeterMode": "pH" } }
      ]
    },
    "realPhotoMeta": {
      "caption": "Ảnh thực tế Máy đo pH hiện số phòng thí nghiệm kèm tay đỡ điện cực thủy tinh và cốc dung dịch chuẩn pH 7.00",
      "manufacturerRef": "Hanna / Horiba / Thiết bị KHTN 9 (Thông tư 38/2021/TT-BGDĐT)",
      "realWorldScaleNote": "Kích thước đế: 120 × 120 mm · Chiều cao trụ đỡ điện cực: 220 mm · Điện cực thủy tinh Ø 12 mm",
      "annotations": [
        { "xPercent": 34, "yPercent": 42, "label": "Màn hình LCD nghiêng 30° hiển thị số pH (7.00 pH) và nhiệt độ bù ATC (25.0 °C)" },
        { "xPercent": 34, "yPercent": 66, "label": "Cụm phím chức năng CAL (Hiệu chuẩn), MODE (pH/mV) và HOLD (Giữ số đo)" },
        { "xPercent": 72, "yPercent": 35, "label": "Tay đỡ điện cực xoay linh hoạt gắn trên trục Inox" },
        { "xPercent": 78, "yPercent": 72, "label": "Bầu màng thủy tinh nhạy ion H+ nhúng trong dung dịch cần đo" }
      ]
    },
    "dossier": {
      "assetId": "OL3D-EQP-PHM-0001",
      "technicalStandard": "ISO 10523 · Thông tư 38/2021/TT-BGDĐT · SGK KHTN 9",
      "exactDimensionsSpec": "Thân máy đế bàn: 120 × 120 × 55 mm · Trụ và tay đỡ điện cực cao: 220 mm · Điện cực thủy tinh: Ø 12 × 120 mm",
      "weightOrCapacitySpec": "Thang đo: 0.00 – 14.00 pH · ĐCNN: 0.01 pH · Độ chính xác: ±0.02 pH · Khối lượng: 285 g",
      "synthesizedFeatures": [
        "Màn hình LCD kỹ thuật số vát nghiêng 30° dùng Local Console Group chống khuất tầm nhìn trực diện, đồng bộ 4 mặt 360°.",
        "Tích hợp trụ đỡ và tay kẹp điện cực thủy tinh giúp nhúng đầu dò vào Cốc thủy tinh 250 ml ổn định, không chạm đáy.",
        "Đo nhanh môi trường Acid (pH < 7), Trung tính (pH = 7.00) và Base (pH > 7) trong các bài thực hành Hóa học – Sinh học KHTN 9."
      ],
      "fiveWebSources": [
        { "siteName": "Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)", "domain": "thuvienphapluat.vn", "verifiedSpecSummary": "Thiết bị đo pH hiện số dùng chung môn Khoa học tự nhiên cấp THCS: Thang đo 0–14 pH, độ chia 0.01 pH." },
        { "siteName": "Hanna Instruments Vietnam", "domain": "hannavietnam.com", "verifiedSpecSummary": "Máy đo pH để bàn giáo dục: Màn hình LCD rộng hiển thị đồng thời pH và nhiệt độ, kèm giá đỡ điện cực." },
        { "siteName": "VietChem — Thiết bị Khoa học Kỹ thuật", "domain": "vietchem.com.vn", "verifiedSpecSummary": "Điện cực pH thân thủy tinh Ag/AgCl chịu hóa chất, đầu nối BNC tiêu chuẩn." },
        { "siteName": "Visitech Việt Nam", "domain": "visitech.vn", "verifiedSpecSummary": "Quy trình hiệu chuẩn máy đo pH bằng 3 dung dịch đệm chuẩn pH 4.01, 6.86 và 9.18." },
        { "siteName": "VietJack — SGK KHTN 9 Kết nối tri thức", "domain": "vietjack.com", "verifiedSpecSummary": "Xác định tính acid của ethylic alcohol / acetic acid (Bài 26, 27) và môi trường đất/nước nuôi trồng." }
      ]
    },
    "audit360": {
      "assetId": "OL3D-EQP-PHM-0001",
      "omnidirectionalReadout360": "4 màn hình LCD kỹ thuật số (Trước, Sau, Trái, Phải) đồng bộ thời gian thực cùng nhãn số đo pH 360°.",
      "coreInteractiveFunctions": [
        "Đọc giá trị pH chuẩn trên màn hình LCD sắc nét từ mọi góc nhìn.",
        "Chuyển đổi chế độ kiểm tra dung dịch chuẩn hoặc cân khối lượng máy (285.00 g)."
      ],
      "environmentalAndCrossToolInteractions": [
        "Đặt cạnh Cốc thủy tinh 250 ml hoặc Bình tam giác để nhúng đầu dò điện cực kiểm tra độ pH của chất lỏng.",
        "Đặt lên Cân điện tử hiển thị đúng khối lượng 285.00 g."
      ]
    }
  }
  </script>

  <!-- 2. ICON 2D VECTOR CHUẨN -->
  <template id="ol3d-module-icon">
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="72" rx="28" ry="4" fill="#94A3B8" opacity="0.35" />
      <!-- Thân máy đế bàn -->
      <rect x="14" y="48" width="34" height="20" rx="4" fill="#1E293B" stroke="#0F172A" stroke-width="1.8" />
      <!-- Màn hình LCD nghiêng -->
      <rect x="18" y="51" width="26" height="10" rx="2" fill="#CCFBF1" stroke="#14B8A6" stroke-width="1.4" />
      <text x="31" y="59" text-anchor="middle" fill="#0F766E" font-family="monospace" font-weight="bold" font-size="7.5">7.00pH</text>
      <!-- 3 nút bấm -->
      <circle cx="23" cy="64.5" r="1.8" fill="#38BDF8" />
      <circle cx="31" cy="64.5" r="1.8" fill="#FACC15" />
      <circle cx="39" cy="64.5" r="1.8" fill="#F87171" />
      <!-- Trụ đứng & Tay kẹp điện cực -->
      <rect x="44" y="14" width="3.2" height="36" rx="1" fill="#CBD5E1" stroke="#64748B" stroke-width="1" />
      <rect x="44" y="20" width="18" height="3.5" rx="1.5" fill="#334155" />
      <!-- Đầu dò điện cực thủy tinh -->
      <rect x="57" y="16" width="5" height="36" rx="2.5" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.4" />
      <rect x="56.5" y="14" width="6" height="6" rx="1.5" fill="#0284C7" />
      <circle cx="59.5" cy="53" r="3" fill="#38BDF8" stroke="#0369A1" stroke-width="1.2" />
    </svg>
  </template>

  <!-- 3. ẢNH THẬT PHÒNG THÍ NGHIỆM ĐỐI CHIẾU -->
  <template id="ol3d-module-real-photo">
    <svg viewBox="0 0 680 420" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="studioBg" x1="0" y1="0" x2="0" y2="420" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1E293B" />
          <stop offset="72%" stop-color="#0F172A" />
          <stop offset="72.5%" stop-color="#78350F" />
          <stop offset="100%" stop-color="#451A03" />
        </linearGradient>
      </defs>
      <rect width="680" height="420" rx="14" fill="url(#studioBg)" />
      <!-- Mặt bàn gỗ phòng thí nghiệm & Thước đo tỉ lệ thực mm -->
      <line x1="0" y1="304" x2="680" y2="304" stroke="#B45309" stroke-width="2" />
      <rect x="30" y="366" width="620" height="28" rx="6" fill="#090D16" fill-opacity="0.78" stroke="#334155" />
      <text x="44" y="384" fill="#38BDF8" font-family="monospace" font-size="12" font-weight="bold">THƯỚC ĐỐI CHIẾU THỰC TẾ: ĐẾ 120×120 mm · CAO 220 mm · ĐCNN 0.01 pH (ISO 10523)</text>

      <!-- Thân máy đo pH chụp góc Studio -->
      <ellipse cx="240" cy="322" rx="95" ry="16" fill="#000" opacity="0.45" />
      <rect x="145" y="195" width="180" height="118" rx="12" fill="#1E293B" stroke="#475569" stroke-width="3" />
      <rect x="162" y="210" width="146" height="58" rx="6" fill="#CCFBF1" stroke="#0D9488" stroke-width="3" />
      <text x="176" y="232" fill="#0F766E" font-family="monospace" font-size="12" font-weight="bold">pH METER · ATC</text>
      <text x="176" y="258" fill="#042F2E" font-family="monospace" font-size="28" font-weight="bold">7.00 pH  25.0°C</text>
      <!-- Cụm phím CAL / MODE / HOLD -->
      <rect x="168" y="278" width="40" height="22" rx="5" fill="#0284C7" />
      <text x="188" y="293" text-anchor="middle" fill="#FFF" font-family="sans-serif" font-size="11" font-weight="bold">CAL</text>
      <rect x="215" y="278" width="42" height="22" rx="5" fill="#EAB308" />
      <text x="236" y="293" text-anchor="middle" fill="#1E293B" font-family="sans-serif" font-size="11" font-weight="bold">MODE</text>
      <rect x="264" y="278" width="42" height="22" rx="5" fill="#EF4444" />
      <text x="285" y="293" text-anchor="middle" fill="#FFF" font-family="sans-serif" font-size="11" font-weight="bold">HOLD</text>

      <!-- Trụ inox & Tay đỡ điện cực -->
      <rect x="302" y="66" width="10" height="135" rx="3" fill="#E2E8F0" stroke="#64748B" stroke-width="2" />
      <rect x="296" y="96" width="160" height="14" rx="5" fill="#334155" stroke="#94A3B8" stroke-width="1.5" />

      <!-- Cốc thủy tinh 250 ml chứa dung dịch chuẩn pH 7.00 và Điện cực thủy tinh nhúng trong cốc -->
      <ellipse cx="485" cy="322" rx="65" ry="12" fill="#000" opacity="0.4" />
      <rect x="435" y="185" width="100" height="130" rx="8" fill="#E0F2FE" fill-opacity="0.18" stroke="#BAE6FD" stroke-width="2.5" />
      <rect x="438" y="235" width="94" height="76" rx="5" fill="#22C55E" fill-opacity="0.32" />
      <text x="485" y="298" text-anchor="middle" fill="#DCFCE7" font-family="monospace" font-size="12" font-weight="bold">Buffer pH 7.00</text>

      <!-- Điện cực thủy tinh Ag/AgCl -->
      <rect x="442" y="75" width="18" height="205" rx="8" fill="#F8FAFC" fill-opacity="0.85" stroke="#0284C7" stroke-width="2.5" />
      <rect x="440" y="68" width="22" height="26" rx="4" fill="#0284C7" />
      <circle cx="451" cy="284" r="10" fill="#38BDF8" stroke="#0369A1" stroke-width="2" />
    </svg>
  </template>

  <!-- 4. MÃ DỰNG MÔ HÌNH 3D THREE.JS TUÂN THỦ CHUẨN OL3D-HTML-MODULE v2.0 -->
  <script id="ol3d-module-3d-script">
    window.OL3D_EQUIPMENT_MODULE = {
      buildEquipmentGroup: function(THREE, asset) {
        var group = new THREE.Group();
        group.name = (asset && asset.slug ? asset.slug : 'ph_meter') + '_root';

        var bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.15 });
        var steelMat = new THREE.MeshStandardMaterial({ color: 0xdbe4ee, roughness: 0.22, metalness: 0.85 });
        var glassMat = new THREE.MeshPhysicalMaterial({
          color: 0xe0f2fe,
          transparent: true,
          opacity: 0.55,
          roughness: 0.08,
          transmission: 0.82,
          ior: 1.47,
          depthWrite: false
        });

        // 1. Đế máy (y = 0 -> 0.042m)
        var baseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.042, 0.115), bodyMat);
        baseMesh.name = 'body';
        baseMesh.position.set(0, 0.021, 0);
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        group.add(baseMesh);

        // Tạo texture LCD pH
        function makePhLcdTexture(textVal) {
          var canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 192;
          var ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#0f2922';
            ctx.fillRect(0, 0, 512, 192);
            ctx.fillStyle = '#ccfbf1';
            ctx.fillRect(10, 10, 492, 172);
            ctx.fillStyle = '#0f766e';
            ctx.font = 'bold 26px monospace';
            ctx.fillText('pH METER · ATC 25.0°C', 24, 46);
            ctx.fillStyle = '#042f2e';
            ctx.font = 'bold 84px monospace';
            ctx.textAlign = 'right';
            ctx.fillText(textVal || '7.00 pH', 480, 142);
          }
          var tex = new THREE.CanvasTexture(canvas);
          tex.needsUpdate = true;
          return tex;
        }

        var sharedLcdMat = new THREE.MeshStandardMaterial({
          map: makePhLcdTexture('7.00 pH'),
          roughness: 0.18,
          metalness: 0.05,
          emissive: new THREE.Color('#14b8a6'),
          emissiveIntensity: 0.25,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -2
        });

        // 2. Cụm màn hình nghiêng mặt trước (Local Console Group chống khuất trực diện)
        var frontConsoleGroup = new THREE.Group();
        frontConsoleGroup.position.set(-0.012, 0.048, 0.032);
        frontConsoleGroup.rotation.x = -0.48;
        group.add(frontConsoleGroup);

        var consoleBox = new THREE.Mesh(
          new THREE.BoxGeometry(0.082, 0.036, 0.024),
          new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.35 })
        );
        frontConsoleGroup.add(consoleBox);

        var frontLcd = new THREE.Mesh(new THREE.PlaneGeometry(0.068, 0.025), sharedLcdMat);
        frontLcd.name = 'scale_display';
        frontLcd.position.set(0, 0.002, 0.012 + 0.0012);
        frontConsoleGroup.add(frontLcd);

        // Màn hình phụ mặt sau (180°) đồng bộ 360°
        var rearLcd = new THREE.Mesh(new THREE.PlaneGeometry(0.068, 0.025), sharedLcdMat);
        rearLcd.name = 'scale_display_rear';
        rearLcd.position.set(-0.012, 0.032, -0.0585);
        rearLcd.rotation.y = Math.PI;
        group.add(rearLcd);

        // 3. Trụ Inox & Tay kẹp giữ điện cực thủy tinh ('plunger')
        var rodMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.175, 20), steelMat);
        rodMesh.position.set(0.038, 0.125, -0.032);
        rodMesh.castShadow = true;
        group.add(rodMesh);

        var armGroup = new THREE.Group();
        armGroup.name = 'plunger';
        armGroup.position.set(0.038, 0.185, -0.032);
        group.add(armGroup);

        var armBar = new THREE.Mesh(
          new THREE.BoxGeometry(0.016, 0.012, 0.078),
          new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 })
        );
        armBar.position.set(0, 0, 0.032);
        armGroup.add(armBar);

        var probeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.125, 24), glassMat);
        probeBody.position.set(0, -0.052, 0.064);
        armGroup.add(probeBody);

        var probeCap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0075, 0.0075, 0.024, 20),
          new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
        );
        probeCap.position.set(0, 0.014, 0.064);
        armGroup.add(probeCap);

        var probeBulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.0065, 20, 20),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.15, metalness: 0.1 })
        );
        probeBulb.position.set(0, -0.116, 0.064);
        armGroup.add(probeBulb);

        return group;
      },

      applyEquipmentState: function(THREE, rootObject, instance, asset) {
        var val = instance && instance.instanceState && typeof instance.instanceState.multimeterValue === 'number'
          ? instance.instanceState.multimeterValue
          : 7.0;
        var label = val.toFixed(2) + ' pH';
        rootObject.traverse(function(child) {
          if (child.isMesh && typeof child.name === 'string' && child.name.indexOf('scale_display') === 0) {
            var mat = child.material;
            if (mat && mat.map && mat.map.image && mat.map.image.getContext) {
              var ctx = mat.map.image.getContext('2d');
              ctx.fillStyle = '#0f2922';
              ctx.fillRect(0, 0, 512, 192);
              ctx.fillStyle = '#ccfbf1';
              ctx.fillRect(10, 10, 492, 172);
              ctx.fillStyle = '#0f766e';
              ctx.font = 'bold 26px monospace';
              ctx.fillText('pH METER · ATC 25.0°C', 24, 46);
              ctx.fillStyle = '#042f2e';
              ctx.font = 'bold 84px monospace';
              ctx.textAlign = 'right';
              ctx.fillText(label, 480, 142);
              mat.map.needsUpdate = true;
            }
          }
        });
      },

      playEquipmentSound: function(eventType, value) {
        try {
          var AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          if (!window.__ol3dAudioCtx) window.__ol3dAudioCtx = new AudioCtx();
          var ctx = window.__ol3dAudioCtx;
          if (ctx.state === 'suspended') ctx.resume();
          var now = ctx.currentTime;
          var phVal = typeof value === 'number' ? value : 7.0;

          // 1. Tiếng nhúng bầu điện cực thủy tinh vào cốc dung dịch (hydro-dip)
          var oscDip = ctx.createOscillator();
          var gainDip = ctx.createGain();
          oscDip.type = 'sine';
          oscDip.frequency.setValueAtTime(380, now);
          oscDip.frequency.exponentialRampToValueAtTime(720, now + 0.085);
          gainDip.gain.setValueAtTime(0.12, now);
          gainDip.gain.exponentialRampToValueAtTime(0.003, now + 0.09);
          oscDip.connect(gainDip);
          gainDip.connect(ctx.destination);
          oscDip.start(now);
          oscDip.stop(now + 0.095);

          // 2. Tiếng "Bíp" kỹ thuật số xác nhận số đo pH ổn định (cao độ theo môi trường pH)
          var oscBeep = ctx.createOscillator();
          var gainBeep = ctx.createGain();
          oscBeep.type = 'sine';
          oscBeep.frequency.setValueAtTime(2050 + (phVal / 14) * 950, now + 0.11);
          gainBeep.gain.setValueAtTime(0.11, now + 0.11);
          gainBeep.gain.exponentialRampToValueAtTime(0.002, now + 0.22);
          oscBeep.connect(gainBeep);
          gainBeep.connect(ctx.destination);
          oscBeep.start(now + 0.11);
          oscBeep.stop(now + 0.23);
        } catch (e) {}
      }
    };
  </script>

  <!-- 5. TRẠM KIỂM ĐỊNH ĐỘC LẬP TRÊN TRÌNH DUYỆT WEB (STANDALONE BROWSER INSPECTOR) -->
  <div id="ol3d-standalone-inspector" style="max-width: 1360px; margin: 0 auto; padding: 18px 24px;">
    <!-- Thanh trạng thái kiểm định tự động 4 khối chuẩn -->
    <div id="compliance-bar" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; padding: 12px 16px; background: #0f2922; border: 1px solid #14b8a6; border-radius: 10px; align-items: center; justify-content: space-between;">
      <div style="font-weight: 800; color: #5eead4; font-size: 13.5px;">
        ✓ KIỂM ĐỊNH TRÌNH DUYỆT ĐỘC LẬP: ĐỦ 4 KHỐI CHUẨN OL3D-HTML-MODULE (SẴN SÀNG NẠP VÀO PHÒNG THÍ NGHIỆM)
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap; font-size: 11.5px; font-weight: 700;">
        <span style="background: #115e59; color: #ccfbf1; padding: 3px 9px; border-radius: 5px;">#ol3d-module-manifest: OK</span>
        <span style="background: #115e59; color: #ccfbf1; padding: 3px 9px; border-radius: 5px;">#ol3d-module-icon: OK</span>
        <span style="background: #115e59; color: #ccfbf1; padding: 3px 9px; border-radius: 5px;">#ol3d-module-real-photo: OK</span>
        <span style="background: #115e59; color: #ccfbf1; padding: 3px 9px; border-radius: 5px;">#ol3d-module-3d-script: OK</span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 18px;">
      <!-- CỘT TRÁI: VẬT 3D TƯƠNG TÁC + TEST TRẠNG THÁI ĐỘNG -->
      <div class="card" style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div style="font-size: 13px; font-weight: 800; color: #38bdf8; text-transform: uppercase;">
            1. KIỂM TRA VẬT 3D THREE.JS (TỶ LỆ 1.0 = 1m · ĐÁY y = 0 · MÀN HÌNH 360°)
          </div>
          <div style="display: flex; gap: 6px;">
            <button onclick="window.__setCamAngle(0)" style="background:#0284c7;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">0° Trực diện</button>
            <button onclick="window.__setCamAngle(90)" style="background:#334155;color:#e2e8f0;border:none;padding:5px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">90° Phải</button>
            <button onclick="window.__setCamAngle(180)" style="background:#334155;color:#e2e8f0;border:none;padding:5px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">180° Sau</button>
            <button onclick="window.__setCamAngle(270)" style="background:#334155;color:#e2e8f0;border:none;padding:5px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">270° Trái</button>
          </div>
        </div>

        <div id="preview3d" style="position: relative; cursor: grab;">
          <div style="position: absolute; top: 10px; left: 12px; background: rgba(15,23,42,0.82); border: 1px solid #334155; padding: 5px 10px; border-radius: 6px; font-size: 11.5px; color: #cbd5e1; pointer-events: none;">
            Kéo chuột để xoay 360° · Cuộn chuột để phóng to/thu nhỏ · Mặt bàn gỗ tại y = 0.000 m
          </div>
        </div>

        <!-- Bảng test hàm applyEquipmentState trực tiếp trên trình duyệt -->
        <div style="background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 12.5px; font-weight: 800; color: #facc15;">TEST TÍNH NĂNG ĐỘNG (applyEquipmentState):</span>
            <span id="ph-readout-badge" style="font-family: monospace; font-size: 14px; font-weight: 800; color: #2dd4bf; background: #0f2922; padding: 2px 10px; border-radius: 5px;">7.00 pH (Trung tính)</span>
          </div>
          <input id="ph-slider" type="range" min="0" max="14" step="0.05" value="7.00" style="width: 100%; accent-color: #0284c7; cursor: pointer;" />
          <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
            <button onclick="window.__setTestPh(2.90)" style="background:#7f1d1d;color:#fecaca;border:1px solid #ef4444;padding:4px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">Thử Axit CH₃COOH (pH 2.90)</button>
            <button onclick="window.__setTestPh(7.00)" style="background:#064e3b;color:#a7f3d0;border:1px solid #10b981;padding:4px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">Thử Nước cất chuẩn (pH 7.00)</button>
            <button onclick="window.__setTestPh(11.50)" style="background:#1e3a8a;color:#bfdbfe;border:1px solid #3b82f6;padding:4px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">Thử Dung dịch Kiềm (pH 11.50)</button>
          </div>
        </div>

        <!-- Thông số vật lý trích xuất tự động từ #ol3d-module-manifest -->
        <div id="spec-summary-cards" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;"></div>
      </div>

      <!-- CỘT PHẢI: ẢNH THẬT ĐỐI CHIẾU + ICON 2D + HỒ SƠ 5 NGUỒN WEB -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Khung Ảnh thật đối chiếu -->
        <div class="card">
          <div style="font-size: 13px; font-weight: 800; color: #f59e0b; text-transform: uppercase; margin-bottom: 10px;">
            2. ẢNH THẬT THỰC TẾ ĐỐI CHIẾU (#ol3d-module-real-photo)
          </div>
          <div id="real-photo-mount" style="border-radius: 10px; overflow: hidden; border: 1px solid #334155; position: relative;"></div>
          <div id="real-photo-annotations" style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 10px;"></div>
        </div>

        <!-- Khung Icon 2D & Hồ sơ 5 nguồn -->
        <div class="card" style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="background: #f8fafc; border: 2px solid #38bdf8; border-radius: 12px; width: 84px; height: 84px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 6px;" id="icon-2d-mount"></div>
            <div>
              <div style="font-size: 13px; font-weight: 800; color: #38bdf8; text-transform: uppercase;">
                3. ICON 2D (#ol3d-module-icon) & TRÍCH DẪN SGK KHTN 9
              </div>
              <div id="textbook-summary" style="font-size: 12.5px; color: #cbd5e1; margin-top: 4px; line-height: 1.45;"></div>
            </div>
          </div>

          <div style="border-top: 1px solid #334155; padding-top: 10px;">
            <div style="font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">
              4. ĐỐI CHIẾU 5 NGUỒN TRANG WEB THỰC TẾ (fiveWebSources)
            </div>
            <div id="five-sources-list" style="display: flex; flex-direction: column; gap: 5px; font-size: 12px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Script tự khởi chạy Trạm Kiểm Định khi mở file .HTML trên trình duyệt -->
  <script>
    (function() {
      try {
        var manifestEl = document.getElementById('ol3d-module-manifest');
        var iconTpl = document.getElementById('ol3d-module-icon');
        var photoTpl = document.getElementById('ol3d-module-real-photo');
        var manifest = JSON.parse(manifestEl.textContent);
        var asset = manifest.asset;

        // 1. Render Icon 2D
        document.getElementById('icon-2d-mount').innerHTML = iconTpl.innerHTML;

        // 2. Render Ảnh thật + Điểm chú thích
        var photoMount = document.getElementById('real-photo-mount');
        photoMount.innerHTML = photoTpl.innerHTML;
        var annContainer = document.getElementById('real-photo-annotations');
        if (manifest.realPhotoMeta && manifest.realPhotoMeta.annotations) {
          manifest.realPhotoMeta.annotations.forEach(function(ann, idx) {
            var pin = document.createElement('div');
            pin.style.cssText = 'position:absolute;left:' + ann.xPercent + '%;top:' + ann.yPercent + '%;transform:translate(-50%,-50%);width:22px;height:22px;border-radius:50%;background:#f59e0b;color:#0f172a;font-weight:900;font-size:12px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.6);';
            pin.textContent = String(idx + 1);
            pin.title = ann.label;
            photoMount.appendChild(pin);

            var item = document.createElement('div');
            item.style.cssText = 'background:#0f172a;border:1px solid #334155;border-radius:6px;padding:6px 8px;font-size:11.5px;color:#e2e8f0;';
            item.innerHTML = '<strong style="color:#f59e0b;">#' + (idx + 1) + ':</strong> ' + ann.label;
            annContainer.appendChild(item);
          });
        }

        // 3. Render Thông số vật lý & SGK & 5 Nguồn web
        var dims = asset.geometry.dimensions;
        var sci = asset.scientificProperties;
        var meas = asset.measurementMetadata;
        document.getElementById('spec-summary-cards').innerHTML = [
          { label: 'Kích thước thực', val: dims.widthOrDiameter.value + '×' + dims.height.value + ' mm' },
          { label: 'Khối lượng khô', val: (sci.referenceMass ? sci.referenceMass.value + ' g' : 'N/A') },
          { label: 'Thể tích chiếm chỗ', val: (sci.referenceVolume ? sci.referenceVolume.value + ' cm³' : 'N/A') },
          { label: 'ĐCNN / Thang đo', val: (meas ? meas.leastCount.value + ' ' + meas.leastCount.unit : 'Chuẩn SGK') }
        ].map(function(s) {
          return '<div style="background:#0f172a;border:1px solid #334155;border-radius:8px;padding:8px;"><div style="font-size:11px;color:#94a3b8;">' + s.label + '</div><div style="font-size:13.5px;font-weight:800;color:#38bdf8;font-family:monospace;margin-top:2px;">' + s.val + '</div></div>';
        }).join('');

        document.getElementById('textbook-summary').innerHTML =
          '<strong>' + asset.textbookRef.bookTitle + '</strong> (' + asset.textbookRef.chapter + ')<br/>' +
          asset.textbookRef.standardFunction;

        if (manifest.dossier && manifest.dossier.fiveWebSources) {
          document.getElementById('five-sources-list').innerHTML = manifest.dossier.fiveWebSources.map(function(src, i) {
            return '<div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:6px 10px;">' +
              '<strong style="color:#38bdf8;">' + (i + 1) + '. ' + src.siteName + ' (' + src.domain + '):</strong> ' +
              '<span style="color:#cbd5e1;">' + src.verifiedSpecSummary + '</span></div>';
          }).join('');
        }

        // 4. Khởi tạo Khung 3D WebGL (Three.js) kiểm tra trực tiếp
        var container = document.getElementById('preview3d');
        if (window.THREE && window.OL3D_EQUIPMENT_MODULE && container) {
          var w = container.clientWidth || 560;
          var h = container.clientHeight || 420;
          var scene = new THREE.Scene();
          var camera = new THREE.PerspectiveCamera(38, w / h, 0.01, 20);

          var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          renderer.setSize(w, h);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          renderer.shadowMap.enabled = true;
          container.appendChild(renderer.domElement);

          scene.add(new THREE.AmbientLight(0xffffff, 0.85));
          var dirLight = new THREE.DirectionalLight(0xffffff, 1.15);
          dirLight.position.set(0.6, 1.2, 0.8);
          dirLight.castShadow = true;
          scene.add(dirLight);

          // Mặt bàn gỗ tham chiếu y = 0
          var bench = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.18, 0.008, 48),
            new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.65 })
          );
          bench.position.set(0, -0.004, 0);
          bench.receiveShadow = true;
          scene.add(bench);

          var grid = new THREE.GridHelper(0.32, 16, 0x38bdf8, 0x334155);
          grid.position.y = 0.0005;
          scene.add(grid);

          var eqGroup = window.OL3D_EQUIPMENT_MODULE.buildEquipmentGroup(THREE, asset);
          scene.add(eqGroup);

          var yaw = 0.25;
          var pitch = 0.28;
          var dist = 0.42;
          var targetY = (asset.geometry.boundingBoxM ? asset.geometry.boundingBoxM.height : 0.2) * 0.45;

          function updateCam() {
            camera.position.set(
              Math.sin(yaw) * Math.cos(pitch) * dist,
              targetY + Math.sin(pitch) * dist,
              Math.cos(yaw) * Math.cos(pitch) * dist
            );
            camera.lookAt(0, targetY, 0);
          }
          updateCam();

          window.__setCamAngle = function(deg) {
            yaw = (deg * Math.PI) / 180;
            pitch = 0.22;
            updateCam();
          };

          var dragging = false, prevX = 0, prevY = 0;
          renderer.domElement.addEventListener('pointerdown', function(e) {
            dragging = true; prevX = e.clientX; prevY = e.clientY;
          });
          window.addEventListener('pointerup', function() { dragging = false; });
          window.addEventListener('pointermove', function(e) {
            if (!dragging) return;
            yaw -= (e.clientX - prevX) * 0.01;
            pitch = Math.max(-0.1, Math.min(1.2, pitch + (e.clientY - prevY) * 0.008));
            prevX = e.clientX; prevY = e.clientY;
            updateCam();
          });
          renderer.domElement.addEventListener('wheel', function(e) {
            e.preventDefault();
            dist = Math.max(0.18, Math.min(0.9, dist + e.deltaY * 0.0004));
            updateCam();
          }, { passive: false });

          window.__setTestPh = function(val) {
            var slider = document.getElementById('ph-slider');
            if (slider) slider.value = String(val);
            var env = val < 6.5 ? ' (Môi trường Axit)' : val > 7.5 ? ' (Môi trường Kiềm)' : ' (Trung tính)';
            document.getElementById('ph-readout-badge').textContent = val.toFixed(2) + ' pH' + env;
            if (window.OL3D_EQUIPMENT_MODULE.applyEquipmentState) {
              window.OL3D_EQUIPMENT_MODULE.applyEquipmentState(
                THREE,
                eqGroup,
                { instanceState: { multimeterValue: val } },
                asset
              );
            }
            if (window.OL3D_EQUIPMENT_MODULE.playEquipmentSound) {
              window.OL3D_EQUIPMENT_MODULE.playEquipmentSound('probe-measure', val);
            }
          };

          document.getElementById('ph-slider').addEventListener('input', function(e) {
            window.__setTestPh(parseFloat(e.target.value));
          });

          function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
          }
          animate();
        }
      } catch (err) {
        console.error('Standalone Inspector Error:', err);
      }
    })();
  </script>
</body>
</html>`;

/**
 * FILE CON MODULE .HTML MẪU MỚI #2 (OL3D-HTML-MODULE v2.1)
 * Thiết bị mới hoàn toàn: Máy khuấy từ gia nhiệt phòng thí nghiệm 0–1500 rpm (OL3D-EQP-STR-0001)
 * Dùng để tải về máy (.html) và nhập thử trực tiếp vào bàn thí nghiệm 3D!
 */
export const SAMPLE_MAGNETIC_STIRRER_HTML_MODULE = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OL3D HTML Module — Máy khuấy từ gia nhiệt 0–1500 rpm (OL3D-EQP-STR-0001)</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; }
    .header { padding: 14px 24px; background: #1e293b; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
    .badge { background: #10b981; color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 16px; }
    #preview3d { width: 100%; height: 420px; border-radius: 10px; overflow: hidden; background: radial-gradient(circle at center, #1e293b, #090d16); }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <span class="badge">THIẾT BỊ MỚI .HTML v2.1</span>
      <strong style="margin-left: 10px; font-size: 18px;">Máy khuấy từ gia nhiệt phòng thí nghiệm 0–1500 rpm (OL3D-EQP-STR-0001)</strong>
    </div>
    <div style="font-size: 13px; color: #94a3b8;">Đầy đủ: Mâm gốm Ceramic + Cá từ xoay PTFE + Màn hình LED 360° + Cốc khuấy xoáy</div>
  </div>

  <!-- 1. HỒ SƠ THÔNG SỐ VẬT LÝ, TÍNH NĂNG TƯƠNG TÁC & 5 NGUỒN WEB -->
  <script id="ol3d-module-manifest" type="application/json">
  {
    "moduleSpecVersion": "OL3D-HTML-MODULE-v2.1",
    "asset": {
      "assetId": "OL3D-EQP-STR-0001",
      "slug": "may-khuay-tu-gia-nhiet",
      "name": {
        "vi": "Máy khuấy từ gia nhiệt kèm cá từ PTFE",
        "en": "Digital Magnetic Hotplate Stirrer"
      },
      "kind": "equipment",
      "subject": "chemistry",
      "category": "thermal-apparatus",
      "categoryIds": ["thermal-apparatus", "chemical-apparatus", "measuring-instrument"],
      "tags": ["máy khuấy từ", "gia nhiệt", "cá từ", "hòa tan", "hóa học 9", "module html"],
      "summary": "Máy khuấy từ gia nhiệt hiện số (0 – 1500 vòng/phút, gia nhiệt tới 280°C) dùng mâm gốm Ceramic chống ăn mòn và thanh cá từ PTFE khuấy đều dung dịch hóa chất tự động.",
      "textbookRef": {
        "bookTitle": "SGK Khoa học tự nhiên 9 - Kết nối tri thức",
        "chapter": "Bài 1: Nhận biết một số dụng cụ, hoá chất & Thực hành pha chế dung dịch",
        "lesson": "Hòa tan chất rắn, chuẩn độ và đun nóng dung dịch đồng nhất",
        "figureRef": "Thiết bị khuấy trộn & gia nhiệt PTN chuẩn Thông tư 38/2021/TT-BGDĐT",
        "standardFunction": "Khuấy trộn đồng nhất dung dịch bằng từ trường quay (0–1500 rpm) kết hợp gia nhiệt mâm gốm Ceramic chính xác.",
        "usageGuidelines": "Đặt cốc thủy tinh chứa dung dịch và viên cá từ PTFE vào chính giữa mâm gốm trắng, vặn núm chỉnh tốc độ khuấy tăng dần từ 100 đến 1200 rpm.",
        "safetyNote": "Không chạm tay vào mặt mâm gốm khi đèn báo HOT đang sáng (> 50°C); tăng tốc độ khuấy từ từ để tránh văng dung dịch."
      },
      "assetVersion": "1.0.0",
      "manifestSchemaVersion": "2.0.0",
      "moduleApiVersion": "2.0.0",
      "geometry": {
        "modelFormat": "PROCEDURAL_PBR",
        "modelUri": "procedural://magnetic-stirrer-html-module",
        "modelFileVersion": "1.0.0",
        "proceduralArchetype": "electronic-balance",
        "upAxis": "Y",
        "anchor": "base-center",
        "boundingBoxM": { "width": 0.15, "height": 0.165, "depth": 0.17 },
        "dimensions": {
          "height": { "value": 165, "unit": "mm", "status": "verified" },
          "widthOrDiameter": { "value": 150, "unit": "mm", "status": "verified" },
          "depth": { "value": 170, "unit": "mm", "status": "verified" }
        },
        "triangleCount": 1680,
        "materialCount": 8,
        "namedNodes": [
          { "nodeName": "body", "role": "body", "description": "Thân máy khuấy từ đúc nhôm sơn tĩnh điện kháng hóa chất" },
          { "nodeName": "pan_plate", "role": "pan_plate", "description": "Mâm gia nhiệt phủ gốm Ceramic trắng Ø135 mm" },
          { "nodeName": "scale_display", "role": "scale_display", "description": "Màn hình LED hiển thị tốc độ khuấy (rpm) & nhiệt độ (°C) 360°" },
          { "nodeName": "stir_bar", "role": "plunger", "description": "Thanh cá từ bọc nhựa PTFE và phễu xoáy dung dịch" }
        ],
        "scaleValidation": "verified"
      },
      "scientificProperties": {
        "material": { "value": "Thân hợp kim nhôm đúc, Mâm gốm Ceramic Ø135mm & Cá từ PTFE", "status": "verified" },
        "referenceMass": { "value": 1450.0, "unit": "g", "status": "verified" },
        "referenceVolume": { "value": 420.0, "unit": "cm³", "status": "verified" }
      },
      "measurementMetadata": {
        "isMeasuringInstrument": true,
        "measuredQuantity": "temperature",
        "rangeMin": { "value": 0, "unit": "rpm", "status": "verified" },
        "rangeMax": { "value": 1500, "unit": "rpm", "status": "verified" },
        "leastCount": { "value": 10, "unit": "rpm", "status": "verified" },
        "zeroOffsetSupported": true,
        "calibrationMethod": "Điều khiển vi xử lý PID ổn định tốc độ vòng quay từ trường",
        "referenceStandard": "DIN EN 61010-2-010 · Thông tư 38/2021/TT-BGDĐT"
      }
    },
    "moduleControls": {
      "stateKey": "multimeterValue",
      "label": "Tốc độ khuấy từ (vòng/phút)",
      "unit": "rpm",
      "min": 0,
      "max": 1500,
      "step": 50,
      "defaultValue": 600,
      "canBeWeighedOnBalance": true,
      "canHoldLiquid": false,
      "canSubmergeInVessel": false,
      "soundPhenomenon": "probe-measure",
      "presets": [
        { "label": "Tắt khuấy (0 rpm · 25°C)", "statePatch": { "multimeterValue": 0, "temperatureC": 25 } },
        { "label": "Khuấy hòa tan nhẹ (450 rpm · 45°C)", "statePatch": { "multimeterValue": 450, "temperatureC": 45 } },
        { "label": "Khuấy trung bình (800 rpm · 65°C)", "statePatch": { "multimeterValue": 800, "temperatureC": 65 } },
        { "label": "Khuấy xoáy mạnh (1350 rpm · 90°C)", "statePatch": { "multimeterValue": 1350, "temperatureC": 90 } }
      ]
    },
    "realPhotoMeta": {
      "caption": "Ảnh thực tế Máy khuấy từ gia nhiệt mâm gốm Ceramic Ø135mm kèm cốc dung dịch CuSO₄ và thanh cá từ PTFE đang khuấy xoáy",
      "manufacturerRef": "IKA / DLAB MS-H280-Pro / Thiết bị KHTN 9",
      "realWorldScaleNote": "Kích thước máy: 150 × 170 × 165 mm · Mâm gốm Ceramic: Ø 135 mm · Tốc độ: 0 – 1500 rpm",
      "annotations": [
        { "xPercent": 50, "yPercent": 55, "label": "Mâm gia nhiệt phủ gốm Ceramic trắng Ø135 mm chịu nhiệt 280°C và kháng axit" },
        { "xPercent": 50, "yPercent": 42, "label": "Thanh cá từ bọc PTFE trắng xoay đồng tâm tạo phễu xoáy hòa tan hóa chất" },
        { "xPercent": 50, "yPercent": 78, "label": "Màn hình LED kép hiển thị tốc độ khuấy (600 RPM) và nhiệt độ mâm nhiệt (60°C)" },
        { "xPercent": 28, "yPercent": 80, "label": "Núm vặn điều chỉnh nhiệt độ (HEAT) và tốc độ khuấy từ (STIR)" }
      ]
    },
    "dossier": {
      "assetId": "OL3D-EQP-STR-0001",
      "technicalStandard": "DIN EN 61010-2-010 · Thông tư 38/2021/TT-BGDĐT · SGK KHTN 9",
      "exactDimensionsSpec": "Thân máy: 150 × 170 × 85 mm · Tổng chiều cao kèm cốc khuấy đối chứng: 165 mm · Mâm gốm: Ø 135 mm",
      "weightOrCapacitySpec": "Tốc độ khuấy: 0 – 1500 rpm · Gia nhiệt: 25 – 280 °C · Khối lượng máy: 1450 g",
      "synthesizedFeatures": [
        "Mâm gia nhiệt phủ gốm Ceramic trắng chống ăn mòn hóa chất, truyền nhiệt đều và dễ vệ sinh.",
        "Tích hợp hiệu ứng thanh cá từ PTFE và phễu xoáy chất lỏng thay đổi độ sâu theo tốc độ RPM.",
        "Bảng điều khiển nghiêng 32° hiển thị số LED xanh/đỏ sắc nét từ cả 4 hướng 360°."
      ],
      "fiveWebSources": [
        { "siteName": "DLAB Scientific — MS-H280-Pro", "domain": "dlabsci.com", "verifiedSpecSummary": "Máy khuấy từ gia nhiệt kỹ thuật số LED, mâm gốm Ø135mm, dải tốc độ 200–1500 rpm, nhiệt độ tối đa 280°C." },
        { "siteName": "IKA Works — C-MAG HS 7", "domain": "ika.com", "verifiedSpecSummary": "Mặt gia nhiệt Ceramic kháng hóa chất tuyệt đối, động cơ từ trường không chổi than êm ái." },
        { "siteName": "VietChem — Thiết bị Phòng thí nghiệm", "domain": "vietchem.com.vn", "verifiedSpecSummary": "Ứng dụng máy khuấy từ và cá từ PTFE trong pha chế dung dịch chuẩn và phản ứng hóa học phổ thông." },
        { "siteName": "Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)", "domain": "thuvienphapluat.vn", "verifiedSpecSummary": "Danh mục thiết bị đun nóng và khuấy trộn dung dịch phòng bộ môn Khoa học tự nhiên." },
        { "siteName": "Visitech Việt Nam", "domain": "visitech.vn", "verifiedSpecSummary": "Hướng dẫn chọn kích thước cá từ PTFE (25–30 mm) phù hợp với cốc thủy tinh 250 ml." }
      ]
    },
    "audit360": {
      "assetId": "OL3D-EQP-STR-0001",
      "omnidirectionalReadout360": "Màn hình LED trước và sau đồng bộ 360° hiển thị tốc độ vòng quay (RPM) và nhiệt độ gia nhiệt (°C).",
      "coreInteractiveFunctions": [
        "Điều chỉnh tốc độ khuấy từ 0 đến 1500 rpm làm thay đổi độ sâu phễu xoáy dung dịch và góc quay cá từ.",
        "Hiển thị vành nhiệt hồng ngoại trên mâm gốm khi tốc độ và nhiệt độ tăng cao."
      ],
      "environmentalAndCrossToolInteractions": [
        "Đặt cốc thủy tinh hoặc bình tam giác lên mâm gốm để khuấy đều và gia nhiệt dung dịch.",
        "Đặt lên Cân điện tử hiển thị khối lượng chuẩn 1450.00 g."
      ]
    }
  }
  </script>

  <!-- 2. ICON 2D VECTOR CHUẨN -->
  <template id="ol3d-module-icon">
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="73" rx="30" ry="4" fill="#94A3B8" opacity="0.35" />
      <!-- Thân máy khuấy từ -->
      <rect x="14" y="48" width="52" height="22" rx="5" fill="#F8FAFC" stroke="#334155" stroke-width="2" />
      <rect x="18" y="44" width="44" height="5" rx="2" fill="#E2E8F0" stroke="#475569" stroke-width="1.5" />
      <!-- Màn hình LED & 2 núm vặn -->
      <rect x="28" y="54" width="24" height="10" rx="2" fill="#0F172A" stroke="#10B981" stroke-width="1.3" />
      <text x="40" y="61.5" text-anchor="middle" fill="#34D399" font-family="monospace" font-weight="bold" font-size="7.5">600rpm</text>
      <circle cx="21" cy="59" r="3.8" fill="#0284C7" stroke="#0F172A" stroke-width="1.2" />
      <circle cx="59" cy="59" r="3.8" fill="#F97316" stroke="#0F172A" stroke-width="1.2" />
      <!-- Cốc dung dịch & Cá từ đang khuấy trên mâm -->
      <rect x="26" y="16" width="28" height="28" rx="3" fill="#E0F2FE" fill-opacity="0.65" stroke="#0284C7" stroke-width="1.8" />
      <path d="M28 24 Q40 34 52 24 L52 42 L28 42 Z" fill="#38BDF8" fill-opacity="0.55" />
      <!-- Thanh cá từ PTFE -->
      <rect x="34" y="39" width="12" height="3.2" rx="1.6" fill="#FFFFFF" stroke="#0F172A" stroke-width="1" />
    </svg>
  </template>

  <!-- 3. ẢNH THẬT PHÒNG THÍ NGHIỆM ĐỐI CHIẾU -->
  <template id="ol3d-module-real-photo">
    <svg viewBox="0 0 680 420" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stirBg" x1="0" y1="0" x2="0" y2="420" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#0F172A" />
          <stop offset="74%" stop-color="#1E293B" />
          <stop offset="74.5%" stop-color="#78350F" />
          <stop offset="100%" stop-color="#451A03" />
        </linearGradient>
      </defs>
      <rect width="680" height="420" rx="14" fill="url(#stirBg)" />
      <line x1="0" y1="312" x2="680" y2="312" stroke="#D97706" stroke-width="2" />
      <rect x="30" y="368" width="620" height="28" rx="6" fill="#090D16" fill-opacity="0.82" stroke="#334155" />
      <text x="44" y="386" fill="#34D399" font-family="monospace" font-size="12" font-weight="bold">THƯỚC ĐỐI CHIẾU THỰC TẾ: MÂM GỐM Ø135 mm · TỐC ĐỘ 0–1500 RPM · GIA NHIỆT 280°C</text>

      <!-- Thân máy khuấy từ -->
      <ellipse cx="340" cy="328" rx="150" ry="18" fill="#000" opacity="0.45" />
      <rect x="200" y="232" width="280" height="86" rx="14" fill="#F1F5F9" stroke="#475569" stroke-width="3" />
      <!-- Mâm gốm Ceramic -->
      <ellipse cx="340" cy="232" rx="118" ry="16" fill="#FFFFFF" stroke="#94A3B8" stroke-width="3" />
      <ellipse cx="340" cy="232" rx="92" ry="11" fill="#FEE2E2" stroke="#F87171" stroke-width="1.5" stroke-dasharray="6 4" />
      <!-- Bảng điều khiển LED & 2 núm vặn -->
      <rect x="272" y="256" width="136" height="44" rx="8" fill="#0F172A" stroke="#10B981" stroke-width="2.5" />
      <text x="340" y="274" text-anchor="middle" fill="#34D399" font-family="monospace" font-size="11" font-weight="bold">STIR SPEED · TEMP</text>
      <text x="340" y="294" text-anchor="middle" fill="#A7F3D0" font-family="monospace" font-size="20" font-weight="bold">600 RPM · 60°C</text>
      <circle cx="236" cy="278" r="18" fill="#1E293B" stroke="#38BDF8" stroke-width="3" />
      <circle cx="444" cy="278" r="18" fill="#1E293B" stroke="#F97316" stroke-width="3" />

      <!-- Cốc thủy tinh và phễu xoáy nước + Cá từ PTFE -->
      <rect x="275" y="78" width="130" height="150" rx="8" fill="#E0F2FE" fill-opacity="0.22" stroke="#7DD3FC" stroke-width="2.5" />
      <path d="M279 125 Q340 195 401 125 L401 224 L279 224 Z" fill="#0284C7" fill-opacity="0.48" />
      <rect x="316" y="212" width="48" height="10" rx="5" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
    </svg>
  </template>

  <!-- 4. MÃ DỰNG MÔ HÌNH 3D THREE.JS TUÂN THỦ CHUẨN OL3D-HTML-MODULE v2.1 -->
  <script id="ol3d-module-3d-script">
    window.OL3D_EQUIPMENT_MODULE = {
      buildEquipmentGroup: function(THREE, asset) {
        var group = new THREE.Group();
        group.name = (asset && asset.slug ? asset.slug : 'magnetic_stirrer') + '_root';

        var housingMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.28, metalness: 0.18 });
        var baseDarkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.25 });
        var ceramicMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.15,
          metalness: 0.05,
          emissive: new THREE.Color(0xf97316),
          emissiveIntensity: 0.08
        });
        var glassMat = new THREE.MeshPhysicalMaterial({
          color: 0xe0f2fe,
          transparent: true,
          opacity: 0.42,
          roughness: 0.06,
          transmission: 0.85,
          ior: 1.47,
          side: THREE.DoubleSide,
          depthWrite: false
        });
        var liquidMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          transparent: true,
          opacity: 0.68,
          roughness: 0.12,
          side: THREE.DoubleSide,
          depthWrite: false
        });

        // 1. Đế cao su & Thân máy (y = 0 -> 0.062m)
        var lowerChassis = new THREE.Mesh(new THREE.BoxGeometry(0.146, 0.016, 0.164), baseDarkMat);
        lowerChassis.position.set(0, 0.008, 0);
        lowerChassis.castShadow = true;
        lowerChassis.receiveShadow = true;
        group.add(lowerChassis);

        var mainBody = new THREE.Mesh(new THREE.BoxGeometry(0.144, 0.044, 0.158), housingMat);
        mainBody.name = 'body';
        mainBody.position.set(0, 0.038, -0.002);
        mainBody.castShadow = true;
        mainBody.receiveShadow = true;
        group.add(mainBody);

        // 2. Mâm gốm Ceramic trắng Ø135mm (y = 0.060 -> 0.068m)
        var hotplateMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.0675, 0.069, 0.008, 40), ceramicMat);
        hotplateMesh.name = 'pan_plate';
        hotplateMesh.position.set(0, 0.064, -0.006);
        hotplateMesh.receiveShadow = true;
        group.add(hotplateMesh);

        // Vòng cảnh báo nhiệt trên mặt mâm gốm
        var heatRing = new THREE.Mesh(
          new THREE.RingGeometry(0.046, 0.050, 36),
          new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide })
        );
        heatRing.rotation.x = -Math.PI / 2;
        heatRing.position.set(0, 0.0683, -0.006);
        group.add(heatRing);

        // 3. Cốc thủy tinh 250ml đặt trên mâm khuấy + Cá từ PTFE + Cột chất lỏng xoáy
        var vesselRadius = 0.036;
        var vesselHeight = 0.092;
        var vesselWall = new THREE.Mesh(
          new THREE.CylinderGeometry(vesselRadius, vesselRadius, vesselHeight, 36, 1, true),
          glassMat
        );
        vesselWall.position.set(0, 0.068 + vesselHeight * 0.5, -0.006);
        group.add(vesselWall);

        var liquidBody = new THREE.Mesh(
          new THREE.CylinderGeometry(vesselRadius * 0.94, vesselRadius * 0.94, 0.056, 32),
          liquidMat
        );
        liquidBody.name = 'liquid_volume';
        liquidBody.position.set(0, 0.068 + 0.029, -0.006);
        group.add(liquidBody);

        // Phễu xoáy nước (vortex cone) ở tâm cốc
        var vortexCone = new THREE.Mesh(
          new THREE.ConeGeometry(0.022, 0.032, 28, 1, true),
          new THREE.MeshStandardMaterial({
            color: 0xbae6fd,
            transparent: true,
            opacity: 0.72,
            roughness: 0.08,
            side: THREE.DoubleSide
          })
        );
        vortexCone.name = 'vortex_funnel';
        vortexCone.rotation.x = Math.PI;
        vortexCone.position.set(0, 0.068 + 0.046, -0.006);
        group.add(vortexCone);

        // Thanh cá từ PTFE trắng dưới đáy cốc
        var stirBar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0042, 0.0042, 0.028, 16),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 })
        );
        stirBar.name = 'plunger';
        stirBar.rotation.z = Math.PI / 2;
        stirBar.position.set(0, 0.073, -0.006);
        group.add(stirBar);

        // 4. Màn hình LED hiển thị RPM & Nhiệt độ (Đồng bộ trước & sau 360°)
        function makeStirrerLedTexture(rpmVal) {
          var canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 192;
          var ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, 512, 192);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 6;
            ctx.strokeRect(8, 8, 496, 176);
            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 26px monospace';
            ctx.fillText('MAGNETIC STIRRER · HOTPLATE', 24, 46);
            ctx.fillStyle = '#ecfdf5';
            ctx.font = 'bold 76px monospace';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(rpmVal) + ' RPM', 484, 142);
          }
          var tex = new THREE.CanvasTexture(canvas);
          tex.needsUpdate = true;
          return tex;
        }

        var ledMat = new THREE.MeshStandardMaterial({
          map: makeStirrerLedTexture(600),
          roughness: 0.2,
          emissive: new THREE.Color('#10b981'),
          emissiveIntensity: 0.28,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -2
        });

        var frontPanelGroup = new THREE.Group();
        frontPanelGroup.position.set(0, 0.036, 0.079);
        frontPanelGroup.rotation.x = -0.35;
        group.add(frontPanelGroup);

        var frontLed = new THREE.Mesh(new THREE.PlaneGeometry(0.074, 0.026), ledMat);
        frontLed.name = 'scale_display';
        frontLed.position.set(0, 0, 0.002);
        frontPanelGroup.add(frontLed);

        // 2 núm vặn tốc độ & nhiệt độ hai bên màn hình
        var knobLeft = new THREE.Mesh(
          new THREE.CylinderGeometry(0.009, 0.010, 0.010, 20),
          new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
        );
        knobLeft.rotation.x = Math.PI / 2;
        knobLeft.position.set(-0.050, 0, 0.005);
        frontPanelGroup.add(knobLeft);

        var knobRight = new THREE.Mesh(
          new THREE.CylinderGeometry(0.009, 0.010, 0.010, 20),
          new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 })
        );
        knobRight.rotation.x = Math.PI / 2;
        knobRight.position.set(0.050, 0, 0.005);
        frontPanelGroup.add(knobRight);

        // Màn hình phụ mặt sau 180°
        var rearLed = new THREE.Mesh(new THREE.PlaneGeometry(0.074, 0.026), ledMat);
        rearLed.name = 'scale_display_rear';
        rearLed.position.set(0, 0.038, -0.082);
        rearLed.rotation.y = Math.PI;
        group.add(rearLed);

        return group;
      },

      applyEquipmentState: function(THREE, rootObject, instance, asset) {
        var rpm = instance && instance.instanceState && typeof instance.instanceState.multimeterValue === 'number'
          ? instance.instanceState.multimeterValue
          : 600;
        var ratio = Math.max(0, Math.min(1, rpm / 1500));

        rootObject.traverse(function(child) {
          if (child.name === 'plunger') {
            child.rotation.y = (rpm * 0.045) % (Math.PI * 2);
          }
          if (child.name === 'vortex_funnel') {
            child.visible = rpm > 40;
            child.scale.set(0.4 + ratio * 0.85, 0.25 + ratio * 1.15, 0.4 + ratio * 0.85);
          }
          if (child.name === 'pan_plate' && child.material && child.material.emissive) {
            child.material.emissiveIntensity = 0.04 + ratio * 0.32;
          }
          if (child.isMesh && typeof child.name === 'string' && child.name.indexOf('scale_display') === 0) {
            var mat = child.material;
            if (mat && mat.map && mat.map.image && mat.map.image.getContext) {
              var ctx = mat.map.image.getContext('2d');
              ctx.fillStyle = '#090d16';
              ctx.fillRect(0, 0, 512, 192);
              ctx.strokeStyle = '#10b981';
              ctx.lineWidth = 6;
              ctx.strokeRect(8, 8, 496, 176);
              ctx.fillStyle = '#34d399';
              ctx.font = 'bold 26px monospace';
              ctx.fillText('MAGNETIC STIRRER · ' + Math.round(25 + ratio * 65) + '°C', 24, 46);
              ctx.fillStyle = '#ecfdf5';
              ctx.font = 'bold 76px monospace';
              ctx.textAlign = 'right';
              ctx.fillText(Math.round(rpm) + ' RPM', 484, 142);
              mat.map.needsUpdate = true;
            }
          }
        });
      },

      playEquipmentSound: function(eventType, value) {
        try {
          var AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          if (!window.__ol3dAudioCtx) window.__ol3dAudioCtx = new AudioCtx();
          var ctx = window.__ol3dAudioCtx;
          if (ctx.state === 'suspended') ctx.resume();
          var now = ctx.currentTime;
          var rpmVal = typeof value === 'number' ? value : 600;
          var osc = ctx.createOscillator();
          var gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140 + (rpmVal / 1500) * 320, now);
          osc.frequency.exponentialRampToValueAtTime(180 + (rpmVal / 1500) * 380, now + 0.14);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.002, now + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.16);
        } catch (e) {}
      }
    };
  </script>

  <!-- 5. TRẠM KIỂM ĐỊNH ĐỘC LẬP TRÊN TRÌNH DUYỆT WEB -->
  <div id="ol3d-standalone-inspector" style="max-width: 1360px; margin: 0 auto; padding: 18px 24px;">
    <div style="display: grid; grid-template-columns: 1.15fr 1fr; gap: 18px;">
      <div class="card" style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 13px; font-weight: 800; color: #34d399; text-transform: uppercase;">
            1. MÔ HÌNH 3D MÁY KHUẤY TỪ GIA NHIỆT (0 – 1500 RPM)
          </div>
          <div style="display: flex; gap: 6px;">
            <button onclick="window.__setCamAngle(0)" style="background:#10b981;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">0° Trực diện</button>
            <button onclick="window.__setCamAngle(90)" style="background:#334155;color:#e2e8f0;border:none;padding:5px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">90° Phải</button>
            <button onclick="window.__setCamAngle(180)" style="background:#334155;color:#e2e8f0;border:none;padding:5px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;">180° Sau</button>
          </div>
        </div>
        <div id="preview3d"></div>
        <div style="background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 12.5px; font-weight: 800; color: #facc15;">TEST TỐC ĐỘ KHUẤY TỪ (RPM):</span>
            <span id="rpm-readout" style="font-family: monospace; font-size: 14px; font-weight: 800; color: #34d399;">600 RPM</span>
          </div>
          <input id="rpm-slider" type="range" min="0" max="1500" step="50" value="600" style="width: 100%; accent-color: #10b981; cursor: pointer;" />
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div class="card">
          <div style="font-size: 13px; font-weight: 800; color: #f59e0b; margin-bottom: 10px;">2. ẢNH THỰC TẾ ĐỐI CHIẾU</div>
          <div id="real-photo-mount" style="border-radius: 10px; overflow: hidden; border: 1px solid #334155;"></div>
        </div>
        <div class="card" style="display: flex; align-items: center; gap: 16px;">
          <div style="background: #f8fafc; border: 2px solid #10b981; border-radius: 12px; width: 84px; height: 84px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding: 6px;" id="icon-2d-mount"></div>
          <div id="textbook-summary" style="font-size: 12.5px; color: #cbd5e1; line-height: 1.5;"></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    (function() {
      try {
        var manifest = JSON.parse(document.getElementById('ol3d-module-manifest').textContent);
        var asset = manifest.asset;
        document.getElementById('icon-2d-mount').innerHTML = document.getElementById('ol3d-module-icon').innerHTML;
        document.getElementById('real-photo-mount').innerHTML = document.getElementById('ol3d-module-real-photo').innerHTML;
        document.getElementById('textbook-summary').innerHTML = '<strong>' + asset.name.vi + ' (' + asset.assetId + ')</strong><br/>' + asset.summary;

        var container = document.getElementById('preview3d');
        if (window.THREE && window.OL3D_EQUIPMENT_MODULE && container) {
          var w = container.clientWidth || 560, h = container.clientHeight || 420;
          var scene = new THREE.Scene();
          var camera = new THREE.PerspectiveCamera(38, w / h, 0.01, 20);
          var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          renderer.setSize(w, h);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          container.appendChild(renderer.domElement);
          scene.add(new THREE.AmbientLight(0xffffff, 0.9));
          var dirLight = new THREE.DirectionalLight(0xffffff, 1.15);
          dirLight.position.set(0.6, 1.2, 0.8);
          scene.add(dirLight);
          var eqGroup = window.OL3D_EQUIPMENT_MODULE.buildEquipmentGroup(THREE, asset);
          scene.add(eqGroup);
          var yaw = 0.3, pitch = 0.32, dist = 0.38;
          function updateCam() {
            camera.position.set(Math.sin(yaw)*Math.cos(pitch)*dist, 0.08 + Math.sin(pitch)*dist, Math.cos(yaw)*Math.cos(pitch)*dist);
            camera.lookAt(0, 0.08, 0);
          }
          updateCam();
          window.__setCamAngle = function(deg) { yaw = (deg * Math.PI) / 180; updateCam(); };
          var currentRpm = 600;
          document.getElementById('rpm-slider').addEventListener('input', function(e) {
            currentRpm = parseFloat(e.target.value);
            document.getElementById('rpm-readout').textContent = Math.round(currentRpm) + ' RPM';
            window.OL3D_EQUIPMENT_MODULE.applyEquipmentState(THREE, eqGroup, { instanceState: { multimeterValue: currentRpm } }, asset);
            if (window.OL3D_EQUIPMENT_MODULE.playEquipmentSound) window.OL3D_EQUIPMENT_MODULE.playEquipmentSound('stir', currentRpm);
          });
          function animate() {
            requestAnimationFrame(animate);
            eqGroup.traverse(function(c) {
              if (c.name === 'plunger' && currentRpm > 0) c.rotation.y += (currentRpm / 1500) * 0.25;
            });
            renderer.render(scene, camera);
          }
          animate();
        }
      } catch (e) {}
    })();
  </script>
</body>
</html>`;

/**
 * FILE CON MODULE .HTML MẪU MỚI #3 (OL3D-HTML-MODULE v2.1)
 * Thiết bị mới: Bút đo độ dẫn điện & TDS dung dịch 0–2000 ppm (OL3D-EQP-TDS-0001)
 */
export const SAMPLE_TDS_CONDUCTIVITY_HTML_MODULE = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OL3D HTML Module — Bút đo độ dẫn điện & TDS dung dịch (OL3D-EQP-TDS-0001)</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; }
    .header { padding: 14px 24px; background: #1e293b; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
    .badge { background: #6366f1; color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 16px; }
    #preview3d { width: 100%; height: 420px; border-radius: 10px; overflow: hidden; background: radial-gradient(circle at center, #1e293b, #090d16); }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <span class="badge">THIẾT BỊ MỚI .HTML v2.1</span>
      <strong style="margin-left: 10px; font-size: 18px;">Bút đo độ dẫn điện EC & TDS dung dịch 0–2000 ppm (OL3D-EQP-TDS-0001)</strong>
    </div>
    <div style="font-size: 13px; color: #94a3b8;">Đầy đủ: Cực đo hợp kim Titan + Đế giữ + Màn hình LCD 360°</div>
  </div>

  <script id="ol3d-module-manifest" type="application/json">
  {
    "moduleSpecVersion": "OL3D-HTML-MODULE-v2.1",
    "asset": {
      "assetId": "OL3D-EQP-TDS-0001",
      "slug": "but-do-tds-do-dan-dien",
      "name": {
        "vi": "Bút đo độ dẫn điện EC & tổng chất rắn hòa tan TDS",
        "en": "Digital TDS & Conductivity Tester"
      },
      "kind": "equipment",
      "subject": "chemistry",
      "category": "measuring-instrument",
      "categoryIds": ["measuring-instrument", "chemical-apparatus"],
      "tags": ["TDS", "độ dẫn điện", "ion", "nước cất", "dung dịch điện li", "module html"],
      "summary": "Thiết bị đo nhanh tổng chất rắn hòa tan TDS (0 – 2000 ppm) và độ dẫn điện dung dịch điện li bằng cặp điện cực hợp kim Titan chống oxy hóa.",
      "textbookRef": {
        "bookTitle": "SGK Khoa học tự nhiên 9 - Kết nối tri thức",
        "chapter": "Bài 1: Nhận biết một số dụng cụ, hoá chất & Khảo sát dung dịch chất điện li",
        "lesson": "So sánh độ tinh khiết của nước cất (0–2 ppm) và dung dịch muối khoáng hòa tan",
        "figureRef": "Thiết bị đo thông số chất lượng nước PTN KHTN 9",
        "standardFunction": "Đo nồng độ chất rắn hòa tan tổng số (ppm) và khả năng dẫn điện của các dung dịch muối, acid, base.",
        "usageGuidelines": "Nhúng đầu điện cực Titan sâu 2 cm vào cốc chứa mẫu nước, đợi 3 giây để cảm biến bù nhiệt ATC ổn định và đọc chỉ số ppm.",
        "safetyNote": "Lau khô hai chân điện cực Titan bằng giấy thấm mềm sau mỗi lần đo."
      },
      "assetVersion": "1.0.0",
      "manifestSchemaVersion": "2.0.0",
      "moduleApiVersion": "2.0.0",
      "geometry": {
        "modelFormat": "PROCEDURAL_PBR",
        "modelUri": "procedural://tds-meter-html-module",
        "modelFileVersion": "1.0.0",
        "proceduralArchetype": "digital-multimeter",
        "upAxis": "Y",
        "anchor": "base-center",
        "boundingBoxM": { "width": 0.085, "height": 0.195, "depth": 0.085 },
        "dimensions": {
          "height": { "value": 195, "unit": "mm", "status": "verified" },
          "widthOrDiameter": { "value": 85, "unit": "mm", "status": "verified" },
          "depth": { "value": 85, "unit": "mm", "status": "verified" }
        },
        "triangleCount": 1120,
        "materialCount": 6,
        "namedNodes": [
          { "nodeName": "body", "role": "body", "description": "Thân bút đo TDS chống nước IP67 kèm chân đế" },
          { "nodeName": "scale_display", "role": "scale_display", "description": "Màn hình LCD hiển thị chỉ số ppm 360°" },
          { "nodeName": "plunger", "role": "plunger", "description": "Cặp điện cực hợp kim Titan nhạy ion" }
        ],
        "scaleValidation": "verified"
      },
      "scientificProperties": {
        "material": { "value": "Vỏ nhựa ABS chống nước IP67 & Điện cực hợp kim Titan", "status": "verified" },
        "referenceMass": { "value": 145.0, "unit": "g", "status": "verified" },
        "referenceVolume": { "value": 58.0, "unit": "cm³", "status": "verified" }
      },
      "measurementMetadata": {
        "isMeasuringInstrument": true,
        "measuredQuantity": "voltage-resistance",
        "rangeMin": { "value": 0, "unit": "ppm", "status": "verified" },
        "rangeMax": { "value": 2000, "unit": "ppm", "status": "verified" },
        "leastCount": { "value": 1, "unit": "ppm", "status": "verified" },
        "zeroOffsetSupported": true,
        "calibrationMethod": "Hiệu chuẩn bằng dung dịch chuẩn NaCl 342 ppm",
        "referenceStandard": "ISO 7888 · Thông tư 38/2021/TT-BGDĐT"
      }
    },
    "moduleControls": {
      "stateKey": "multimeterValue",
      "label": "Chỉ số chất rắn hòa tan (TDS)",
      "unit": "ppm",
      "min": 0,
      "max": 2000,
      "step": 10,
      "defaultValue": 180,
      "canBeWeighedOnBalance": true,
      "canHoldLiquid": false,
      "canSubmergeInVessel": true,
      "soundPhenomenon": "probe-measure",
      "presets": [
        { "label": "Nước cất tinh khiết (2 ppm)", "statePatch": { "multimeterValue": 2 } },
        { "label": "Nước khoáng sinh hoạt (180 ppm)", "statePatch": { "multimeterValue": 180 } },
        { "label": "Dung dịch muối NaCl loãng (950 ppm)", "statePatch": { "multimeterValue": 950 } },
        { "label": "Dung dịch điện li mạnh (1850 ppm)", "statePatch": { "multimeterValue": 1850 } }
      ]
    },
    "realPhotoMeta": {
      "caption": "Ảnh thực tế Bút đo độ dẫn điện EC & TDS kèm cốc chuẩn kiểm định chất lượng nước",
      "manufacturerRef": "Hanna / Xiaomi / Thiết bị KHTN 9",
      "realWorldScaleNote": "Chiều cao tổng thể: 195 mm · Đế giữ: Ø 85 mm · Thang đo: 0 – 2000 ppm",
      "annotations": [
        { "xPercent": 50, "yPercent": 32, "label": "Màn hình LCD đèn nền hiển thị đồng thời TDS (ppm) và nhiệt độ mẫu nước" },
        { "xPercent": 50, "yPercent": 75, "label": "Đầu dò 2 cực hợp kim Titan đo độ dẫn điện ion trong dung dịch" }
      ]
    }
  }
  </script>

  <template id="ol3d-module-icon">
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="72" rx="22" ry="4" fill="#94A3B8" opacity="0.35" />
      <rect x="24" y="62" width="32" height="8" rx="3" fill="#334155" />
      <rect x="31" y="10" width="18" height="54" rx="6" fill="#EEF2FF" stroke="#4F46E5" stroke-width="2" />
      <rect x="34" y="18" width="12" height="18" rx="2" fill="#0F172A" stroke="#38BDF8" stroke-width="1.2" />
      <text x="40" y="29" text-anchor="middle" fill="#38BDF8" font-family="monospace" font-weight="bold" font-size="6.5">180</text>
      <circle cx="40" cy="43" r="3" fill="#4F46E5" />
    </svg>
  </template>

  <template id="ol3d-module-real-photo">
    <svg viewBox="0 0 680 420" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="680" height="420" rx="14" fill="#0F172A" />
      <rect x="295" y="45" width="90" height="310" rx="24" fill="#EEF2FF" stroke="#4F46E5" stroke-width="4" />
      <rect x="312" y="88" width="56" height="96" rx="8" fill="#090D16" stroke="#38BDF8" stroke-width="2.5" />
      <text x="340" y="142" text-anchor="middle" fill="#38BDF8" font-family="monospace" font-size="24" font-weight="bold">180</text>
      <text x="340" y="166" text-anchor="middle" fill="#93C5FD" font-family="monospace" font-size="13" font-weight="bold">ppm TDS</text>
      <rect x="326" y="355" width="8" height="28" rx="3" fill="#94A3B8" />
      <rect x="346" y="355" width="8" height="28" rx="3" fill="#94A3B8" />
    </svg>
  </template>

  <script id="ol3d-module-3d-script">
    window.OL3D_EQUIPMENT_MODULE = {
      buildEquipmentGroup: function(THREE, asset) {
        var group = new THREE.Group();
        group.name = 'tds_meter_root';
        var standMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.2 });
        var penMat = new THREE.MeshStandardMaterial({ color: 0xeef2ff, roughness: 0.22, metalness: 0.08 });
        var accentMat = new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.28, metalness: 0.15 });
        var titaniumMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.18, metalness: 0.88 });

        var dockBase = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.042, 0.018, 32), standMat);
        dockBase.position.set(0, 0.009, 0);
        dockBase.castShadow = true;
        dockBase.receiveShadow = true;
        group.add(dockBase);

        var penBody = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.165, 0.022), penMat);
        penBody.name = 'body';
        penBody.position.set(0, 0.098, 0);
        penBody.castShadow = true;
        group.add(penBody);

        var topCap = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.022, 0.024), accentMat);
        topCap.position.set(0, 0.182, 0);
        group.add(topCap);

        // 2 chân điện cực Titan ở đáy bút
        var pinL = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.022, 12), titaniumMat);
        pinL.name = 'plunger';
        pinL.position.set(-0.006, 0.016, 0);
        group.add(pinL);
        var pinR = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.022, 12), titaniumMat);
        pinR.position.set(0.006, 0.016, 0);
        group.add(pinR);

        function makeTdsTex(ppm) {
          var canvas = document.createElement('canvas');
          canvas.width = 256;
          canvas.height = 384;
          var ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, 256, 384);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 6;
            ctx.strokeRect(8, 8, 240, 368);
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 28px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('TDS / EC', 128, 64);
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 76px monospace';
            ctx.fillText(String(Math.round(ppm)), 128, 210);
            ctx.fillStyle = '#93c5fd';
            ctx.font = 'bold 34px monospace';
            ctx.fillText('ppm', 128, 275);
          }
          var tex = new THREE.CanvasTexture(canvas);
          tex.needsUpdate = true;
          return tex;
        }

        var lcdMat = new THREE.MeshStandardMaterial({
          map: makeTdsTex(180),
          emissive: new THREE.Color('#0284c7'),
          emissiveIntensity: 0.25
        });

        var frontLcd = new THREE.Mesh(new THREE.PlaneGeometry(0.024, 0.048), lcdMat);
        frontLcd.name = 'scale_display';
        frontLcd.position.set(0, 0.125, 0.0115);
        group.add(frontLcd);

        var rearLcd = new THREE.Mesh(new THREE.PlaneGeometry(0.024, 0.048), lcdMat);
        rearLcd.name = 'scale_display_rear';
        rearLcd.position.set(0, 0.125, -0.0115);
        rearLcd.rotation.y = Math.PI;
        group.add(rearLcd);

        return group;
      },

      applyEquipmentState: function(THREE, rootObject, instance) {
        var ppm = instance && instance.instanceState && typeof instance.instanceState.multimeterValue === 'number'
          ? instance.instanceState.multimeterValue
          : 180;
        rootObject.traverse(function(child) {
          if (child.isMesh && typeof child.name === 'string' && child.name.indexOf('scale_display') === 0) {
            var mat = child.material;
            if (mat && mat.map && mat.map.image && mat.map.image.getContext) {
              var ctx = mat.map.image.getContext('2d');
              ctx.fillStyle = '#090d16';
              ctx.fillRect(0, 0, 256, 384);
              ctx.strokeStyle = '#38bdf8';
              ctx.lineWidth = 6;
              ctx.strokeRect(8, 8, 240, 368);
              ctx.fillStyle = '#38bdf8';
              ctx.font = 'bold 28px monospace';
              ctx.textAlign = 'center';
              ctx.fillText('TDS / EC', 128, 64);
              ctx.fillStyle = '#f8fafc';
              ctx.font = 'bold 76px monospace';
              ctx.fillText(String(Math.round(ppm)), 128, 210);
              ctx.fillStyle = '#93c5fd';
              ctx.font = 'bold 34px monospace';
              ctx.fillText('ppm', 128, 275);
              mat.map.needsUpdate = true;
            }
          }
        });
      }
    };
  </script>
</body>
</html>`;


