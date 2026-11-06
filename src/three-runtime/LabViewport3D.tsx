import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  AssetDefinition,
  LabEnvironment,
  SceneInstance,
} from '../domain/types';
import { openLabAssetLoader, OpenLabAssetLoader } from './AssetLoader';
import {
  applyInstanceStateToObject3D,
  syncHydrostaticLiquidToGravity,
  OPTICAL_BENCH_AXIS_Y,
  OPTICAL_LENS_SPECS,
  OPTICAL_TEXTBOOK_PRESETS,
  OPTICAL_TEXTBOOK_QA,
  traceOpticalBenchRays,
  createFrostedFObjectCanvasTexture,
  OpticalLensSpec,
  OpticalTextbookPreset,
} from './ProceduralLabModels';
import { htmlEquipmentModuleRegistry } from './HtmlEquipmentModuleRegistry';
import { equipmentImagePreviewController } from './EquipmentImagePreviewController';
import { neuralConnectionEngine } from '../domain/neuralConnectionEngine';
import { EquipmentThumbnailSvg } from '../components/common/EquipmentThumbnailSvg';
import { DeviceControlInspector } from '../components/panels/DeviceControlInspector';
import { labSoundEngine } from './LabSoundEngine';
import {
  BENCH_SURFACE_Y,
  DEFAULT_LAB_ROOM_CONFIG,
  DEFAULT_COORDINATE_DISPLAY_SETTINGS,
  INITIAL_ENVIRONMENT_VARIABLES,
  DEFAULT_LAB_GRAPHICS_SETTINGS,
  CoordinateDisplaySettings,
  EnvironmentVariableDefinition,
  EnvironmentVariableId,
  LabClockState,
  LabEventLog,
  LabGraphicsSettings,
  buildStandardLabRoomV2,
  buildWorldCoordinatesAndGridHelper,
  formatVietnamDateTime,
  formatSimulationDuration,
  formatLengthByUnit,
  worldToBenchCornerCoords,
} from './LabEnvironmentEngine';
import { LabEnvironmentSpecModal } from '../components/modals/LabEnvironmentSpecModal';
import { LabVideoRecorderModal } from '../components/modals/LabVideoRecorderModal';
import {
  LabRecordingSession,
  RecordedStepMilestone,
  LabLiveMeasurementChip,
  getSupportedVideoMimeType,
  formatRecTime,
  drawCompositeRecordingFrame,
  captureMilestoneThumbnail,
} from './LabVideoRecorderEngine';
import {
  Move,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Eye,
  Grid,
  Tag,
  Ruler,
  RotateCcw,
  Camera,
  Layers,
  AlertTriangle,
  RefreshCw,
  Maximize2,
  Minimize2,
  Compass,
  Volume2,
  VolumeX,
  Clock,
  Play,
  Pause,
  Sliders,
  Video,
  Square,
  BookmarkPlus,
  Sparkles,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  Info,
  HelpCircle,
  EyeOff,
} from 'lucide-react';

// Bàn thí nghiệm rộng 2.40 m (X ∈ [-1.20, 1.20]) × sâu 0.975 m (Z ∈ [-0.4875, 0.4875] tăng 30%).
// Cách mép bàn đúng 1 ô lưới (0.05 m = 5 cm) -> Giới hạn di chuyển: X ∈ [-1.15, 1.15], Z ∈ [-0.435, 0.435]
const BENCH_LIMIT_X = 1.15;
const BENCH_LIMIT_Z = 0.435;

export type TransformToolMode = 'select' | 'translate' | 'rotate';
export type ViewportDisplayMode = 'lab-scene' | 'single-asset';

export type PhysicalDockTargetSlot =
  | 'bench'
  | 'shelf'
  | 'balance-pan'
  | 'inside-vessel'
  | 'pour-liquid'
  | 'dispenser-outlet'
  | 'dynamometer-hook'
  | 'caliper-jaws'
  | 'optical-bench-rail';

export type QuickLabActionType =
  | 'tare-balance'
  | 'clear-balance-pan'
  | 'weigh-selected'
  | 'submerge-cylinder'
  | 'retrieve-from-vessel'
  | 'submerge-overflow'
  | 'pour-to-cylinder'
  | 'pour-to-beaker'
  | 'pour-to-overflow'
  | 'dock-to-dispenser'
  | 'refill-water'
  | 'toggle-laser'
  | 'refraction-angle-0'
  | 'refraction-angle-20'
  | 'refraction-angle-40'
  | 'refraction-angle-42'
  | 'refraction-angle-60'
  | 'induce-current-pos'
  | 'induce-current-neg'
  | 'induce-current-zero'
  | 'multimeter-mode-v'
  | 'multimeter-mode-a'
  | 'multimeter-mode-ohm'
  | 'toggle-burner-flame'
  | 'open-microscope-viewport'
  | 'microscope-4x'
  | 'microscope-10x'
  | 'microscope-40x'
  | 'microscope-100x'
  | 'temp-room-25'
  | 'temp-warm-78'
  | 'temp-boil-100'
  | 'dynamometer-weigh'
  | 'dynamometer-zero'
  | 'caliper-measure'
  | 'caliper-zero'
  | 'funnel-extract'
  | 'assemble-optical-bench'
  | 'rotate-90'
  | 'open-sgk-profile'
  | 'edit-product-info'
  | 'open-html-updater'
  | 'delete-instance';

export interface WarehouseStoredItem {
  id: string;
  instanceId: string;
  assetId: string;
  nameVi: string;
  categoryVi?: string;
  thumbnailUrl?: string;
  customLabel?: string;
  storedTime: string;
}

function getEquipmentSymbol(asset: AssetDefinition): string {
  const arch = asset.geometry.proceduralArchetype;
  switch (arch) {
    case 'electronic-balance':
      return '⚖️';
    case 'graduated-cylinder':
      return '🧪';
    case 'beaker-250':
    case 'erlenmeyer-flask':
    case 'distillation-flask':
      return '🫙';
    case 'overflow-can':
    case 'separatory-funnel':
      return '🫗';
    case 'water-dispenser':
      return '🚰';
    case 'spring-dynamometer':
      return '🪝';
    case 'vernier-caliper':
    case 'optical-bench':
      return '📏';
    case 'thermometer':
      return '🌡️';
    case 'alcohol-burner':
    case 'porcelain-dish':
      return '🔥';
    case 'optical-microscope':
    case 'magnifying-glass':
      return '🔬';
    case 'laser-source':
    case 'optical-prism':
    case 'semicircular-slab':
    case 'optical-lens':
    case 'optical-lamp':
      return '🔦';
    case 'frosted-f-object':
      return '🔤';
    case 'optical-screen':
      return '🖥️';
    case 'optical-lens-box':
      return '🧰';
    case 'galvanometer':
    case 'digital-multimeter':
    case 'induction-coil-led':
    case 'optical-power-supply':
      return '⚡';
    case 'dna-double-helix':
      return '🧬';
    case 'retort-stand':
      return '🏗️';
    default:
      return '🧱';
  }
}

interface ProjectedLabel {
  instanceId: string;
  assetId: string;
  symbol: string;
  title: string;
  readoutBadge?: string;
  isDigitalScale?: boolean;
  interactionHint: string;
  archetype: string;
  subtitle: string;
  x: number;
  y: number;
  isSelected: boolean;
  isLocked: boolean;
}

interface HoveredEquipmentTooltip {
  instanceId: string;
  assetId: string;
  title: string;
  englishName: string;
  readoutBadge?: string;
  isDigitalScale?: boolean;
  sgkFigure?: string;
  interactionHint: string;
  dimensionsMm: string;
  x: number;
  y: number;
}

function computeLiveEquipmentReadout(
  inst: SceneInstance,
  asset: AssetDefinition,
): {
  readoutBadge: string;
  isDigitalScale: boolean;
  interactionHint: string;
} {
  const arch = asset.geometry.proceduralArchetype;
  if (arch === 'vernier-caliper') {
    const rawMm = inst.instanceState.jawOpeningMm ?? 26;
    const mm = Math.round(THREE.MathUtils.clamp(rawMm, 0, 150) * 50) / 50;
    const mainMm = Math.floor(mm + 1e-6);
    const vernierMm = Math.max(0, Number((mm - mainMm).toFixed(2)));
    const kTick = Math.round(vernierMm / 0.02);
    return {
      readoutBadge: `${mm.toFixed(2)} mm (${mainMm}+${vernierMm.toFixed(2)})`,
      isDigitalScale: true,
      interactionHint: `d = ${mainMm} + ${kTick}×0.02 = ${mm.toFixed(2)} mm · Kéo vật mẫu vào hàm kẹp hoặc kéo Thước cặp đến vật để đo đường kính ngoài d (ĐCNN 0.02 mm)`,
    };
  }
  if (arch === 'electronic-balance') {
    const tare = inst.instanceState.tareOffsetG ?? 0;
    const rawMass = inst.instanceState.measuredMassG ?? 0;
    const netMass = rawMass - tare;
    const displayMass = Math.abs(netMass) < 0.005 ? 0 : netMass;
    return {
      readoutBadge: `${displayMass.toFixed(2)} g`,
      isDigitalScale: true,
      interactionHint:
        tare > 0 && rawMass === 0
          ? `Đang trừ bì ${tare.toFixed(2)} g (Đĩa cân trống, số chỉ âm ${displayMass.toFixed(2)} g · Bấm nút TARE để về 0.00 g)`
          : 'Kéo vật mẫu/cốc đặt lên đĩa cân hoặc bấm Nút trừ bì (TARE) trực tiếp trên mặt cân · Hiển thị LCD 360°',
    };
  }
  if (arch === 'water-dispenser') {
    const ml = inst.instanceState.liquidLevelMl ?? 850;
    return {
      readoutBadge: `${ml.toFixed(0)} / 1000 ml`,
      isDigitalScale: true,
      interactionHint:
        'Kéo Ống đong / Cốc / Bình tràn đặt vào khay hứng màu xanh dưới vòi để lấy nước tự động, hoặc nhấn để mở bảng chỉnh ml',
    };
  }
  if (
    arch === 'graduated-cylinder' ||
    arch === 'beaker-250' ||
    arch === 'overflow-can' ||
    arch === 'erlenmeyer-flask' ||
    arch === 'separatory-funnel'
  ) {
    const cap =
      arch === 'overflow-can'
        ? 210
        : asset.scientificProperties.capacity?.value ?? 100;
    const ml =
      inst.instanceState.liquidLevelMl ??
      (arch === 'overflow-can' ? 210 : cap * 0.5);
    const overflowMl = inst.instanceState.overflowingVolumeMl ?? 0;
    return {
      readoutBadge:
        arch === 'overflow-can'
          ? overflowMl > 0.05
            ? `210.0 ml (Tràn +${overflowMl.toFixed(1)} ml)`
            : `${Math.min(210, ml).toFixed(1)} / 210 ml`
          : `${ml.toFixed(1)} ml`,
      isDigitalScale: arch === 'overflow-can' && overflowMl > 0.05,
      interactionHint:
        arch === 'separatory-funnel'
          ? 'Mở khóa chiết tách riêng lớp chất lỏng phân cực và không phân cực'
          : arch === 'overflow-can'
            ? 'Đặt dưới vòi Bình cấp nước để châm đầy 210.0 ml ngang vòi tràn, sau đó thả vật rắn vào đo ΔV tràn sang cốc hứng'
            : 'Kéo đặt vào khay dưới vòi Bình cấp nước để lấy nước, kéo nghiêng rót sang bình khác, hoặc thả vật rắn đo ΔV',
    };
  }
  if (arch === 'spring-dynamometer') {
    const forceN = inst.instanceState.springExtensionN ?? 0;
    return {
      readoutBadge: `${forceN.toFixed(2)} N`,
      isDigitalScale: true,
      interactionHint: 'Kéo vật mẫu móc vào lực kế để đo trọng lượng P = m·g (Thang 360°)',
    };
  }
  if (arch === 'thermometer') {
    const tempC = inst.instanceState.temperatureC ?? 25.0;
    return {
      readoutBadge: `${tempC.toFixed(1)} °C`,
      isDigitalScale: true,
      interactionHint: 'Đặt gần cốc nước hoặc bình đang đun để đo nhiệt độ thực tế (-10..110 °C)',
    };
  }
  if (arch === 'lever-balance-apparatus') {
    const deg = inst.instanceState.incidentAngleDeg ?? 0;
    const isBalanced = Math.abs(deg) < 0.5;
    return {
      readoutBadge: isBalanced
        ? '0.0° (Thăng bằng)'
        : `${deg > 0 ? '+' : ''}${deg.toFixed(1)}° (${deg < 0 ? 'Nghiêng trái' : 'Nghiêng phải'})`,
      isDigitalScale: true,
      interactionHint:
        'Thanh đòn bẩy chia vạch đối xứng 18 lỗ (-9..+9). Điều chỉnh ốc đối trọng hoặc treo quả cân để khảo sát quy tắc mômen lực ∑M = 0',
    };
  }
  if (arch === 'communicating-vessels-3way') {
    const ml = inst.instanceState.liquidLevelMl ?? 75;
    return {
      readoutBadge: `${ml.toFixed(0)} ml (h₁ = h₂ = h₃)`,
      isDigitalScale: true,
      interactionHint:
        'Bình thông nhau 3 nhánh dị hình: Mặt thoáng chất lỏng đứng yên ở các nhánh luôn ở cùng một độ cao nằm ngang',
    };
  }

  const customHtmlMod = htmlEquipmentModuleRegistry.getModule(asset.assetId);
  if (customHtmlMod) {
    const ctrl = customHtmlMod.moduleControls;
    const rawVal = inst.instanceState[ctrl.stateKey];
    const numVal = typeof rawVal === 'number' ? rawVal : ctrl.defaultValue;
    const decimals = ctrl.step < 0.1 ? 2 : ctrl.step < 1 ? 1 : 0;
    const massVal = asset.scientificProperties.referenceMass?.value ?? 100;
    return {
      readoutBadge: `${numVal.toFixed(decimals)} ${ctrl.unit}`,
      isDigitalScale: true,
      interactionHint: `${ctrl.label} (${ctrl.min}..${ctrl.max} ${ctrl.unit}) · Kéo đặt lên Cân điện tử (${massVal} g) hoặc phối hợp Cốc dung dịch`,
    };
  }
  if (arch === 'laser-source' || arch === 'optical-prism') {
    const isOn = inst.instanceState.isPoweredOn !== false;
    return {
      readoutBadge: isOn ? 'CHÙM TIA: BẬT' : 'CHÙM TIA: TẮT',
      isDigitalScale: false,
      interactionHint:
        arch === 'optical-prism'
          ? 'Tán sắc chùm sáng trắng qua lăng kính A = 60° thành dải 7 màu quang phổ'
          : 'Phát 3 chùm tia laser đỏ (650 nm) khảo sát khúc xạ và thấu kính',
    };
  }
  if (arch === 'semicircular-slab') {
    const inc = inst.instanceState.incidentAngleDeg ?? 30;
    return {
      readoutBadge: inc >= 41.8 ? `i = ${inc}° (PXTP!)` : `i = ${inc}° (Khúc xạ)`,
      isDigitalScale: true,
      interactionHint: 'Đổi góc tới i (0° / 20° / 40° / 41.8° / 60°) nghiệm lại định luật khúc xạ & phản xạ toàn phần',
    };
  }
  if (arch === 'optical-lens') {
    const pid = inst.instanceState.lensProfileId ?? 'conv_10';
    const spec = OPTICAL_LENS_SPECS[pid] ?? OPTICAL_LENS_SPECS.conv_10;
    const xCm = inst.instanceState.railCoordCm ?? 0;
    return {
      readoutBadge: `${spec.codeLabel} · x=${xCm.toFixed(1)} cm`,
      isDigitalScale: true,
      interactionHint: `${spec.nameVi} · Đặt tại vạch O = 0 cm trên Giá quang học (5), bấm chọn để đổi 6 tiêu cự (+5, +10, +15, -10, -20 cm, ∞)`,
    };
  }
  if (arch === 'optical-bench') {
    return {
      readoutBadge: '-45 .. 0 .. +45 cm',
      isDigitalScale: false,
      interactionHint:
        '(5) Giá quang học 90 cm: Kéo (1) Đèn, (2) Vật sáng chữ F, (3) Thấu kính, (4) Màn chắn thả vào sống trượt đồng trục hoặc bấm "⚡ Lắp bộ Thấu kính"',
    };
  }
  if (arch === 'optical-lamp') {
    const isLit = inst.instanceState.isLampLit === true;
    const isSwitchOn = inst.instanceState.isPoweredOn !== false;
    const mode = inst.instanceState.beamMode ?? 'f_rays';
    const modeLabel =
      mode === 'f_rays' ? 'Chùm F' : mode === 'triple' ? '3 Tia' : '1 Tia';
    return {
      readoutBadge: isLit
        ? `🔦 ĐÈN SÁNG (${modeLabel})`
        : isSwitchOn
          ? `🔦 ĐÈN CHỜ (${modeLabel})`
          : 'ĐÈN TẮT',
      isDigitalScale: isLit,
      interactionHint:
        '(1) Đèn chiếu sáng Halogen: Lắp ở đầu trái Giá quang học (x ≈ -32 cm), chọn chế độ Chùm sáng chữ F / Khe 3 tia / Khe 1 tia',
    };
  }
  if (arch === 'frosted-f-object') {
    const dCm = inst.instanceState.objectDistanceDCm ?? 20;
    return {
      readoutBadge: `d = ${dCm.toFixed(1)} cm`,
      isDigitalScale: true,
      interactionHint:
        '(2) Vật sáng kính mờ hình chữ F: Trượt dọc theo Giá quang học (5) để thay đổi khoảng cách vật d từ chữ F đến Thấu kính (3)',
    };
  }
  if (arch === 'optical-screen') {
    const lCm = inst.instanceState.screenDistanceCm ?? 20;
    const dpCm = inst.instanceState.projectedImageDPrimeCm ?? 20;
    const imgType = inst.instanceState.projectedImageType ?? 'real';
    const isSharp = imgType === 'real' && Math.abs(lCm - dpCm) < 1.3;
    return {
      readoutBadge:
        imgType === 'real'
          ? isSharp
            ? `L = ${lCm.toFixed(1)} cm (★ NÉT d'=${dpCm.toFixed(1)})`
            : `L = ${lCm.toFixed(1)} cm (d'=${dpCm.toFixed(1)} cm)`
          : `L = ${lCm.toFixed(1)} cm (ẢNH ẢO)`,
      isDigitalScale: true,
      interactionHint:
        '(4) Màn chắn hứng ảnh: Trượt dọc theo Giá quang học (5) để hứng ảnh thật chữ F ngược chiều rõ nét nhất (L = d\')',
    };
  }
  if (arch === 'optical-power-supply') {
    const isOn = inst.instanceState.isPoweredOn !== false;
    const v =
      typeof inst.instanceState.voltageStepV === 'number' && inst.instanceState.voltageStepV > 0
        ? inst.instanceState.voltageStepV
        : typeof inst.instanceState.supplyVoltageV === 'number' && inst.instanceState.supplyVoltageV > 0
          ? inst.instanceState.supplyVoltageV
          : 12.0;
    return {
      readoutBadge: isOn ? `⚡ DC ${v.toFixed(1)} V (ON)` : '⚡ NGUỒN TẮT (OFF)',
      isDigitalScale: true,
      interactionHint:
        '(6) Nguồn điện hạ áp 3V–12V: Bấm công tắc trên nóc để BẬT/TẮT cấp điện cho Đèn chiếu sáng (1)',
    };
  }
  if (arch === 'optical-lens-box') {
    const pid = inst.instanceState.lensProfileId ?? 'conv_10';
    const spec = OPTICAL_LENS_SPECS[pid] ?? OPTICAL_LENS_SPECS.conv_10;
    return {
      readoutBadge: `Đang lấy: ${spec.codeLabel}`,
      isDigitalScale: false,
      interactionHint:
        'Hộp bộ 6 Thấu kính (+5, +10, +15, -10, -20 cm, ∞): Bấm chọn để lấy và thay thấu kính đang lắp trên Giá quang học',
    };
  }
  if (arch === 'magnifying-glass') {
    const mag = inst.instanceState.magnification ?? 5;
    return {
      readoutBadge: `G = ${mag}x (f = 50 mm)`,
      isDigitalScale: false,
      interactionHint: 'Quan sát ảnh ảo cùng chiều, lớn hơn vật khi đặt vật trong khoảng tiêu cự',
    };
  }
  if (arch === 'galvanometer') {
    const defl = inst.instanceState.galvanometerDeflection ?? 0;
    const badge =
      defl > 0.05
        ? `+${(defl * 0.8).toFixed(2)} mA (Phải)`
        : defl < -0.05
          ? `${(defl * 0.8).toFixed(2)} mA (Trái)`
          : '0.00 mA';
    return {
      readoutBadge: badge,
      isDigitalScale: true,
      interactionHint: 'Kim điện kế vạch 0 giữa (2 mặt trước/sau) phát hiện dòng điện cảm ứng',
    };
  }
  if (arch === 'digital-multimeter') {
    const mode = inst.instanceState.multimeterMode ?? 'V';
    const val = inst.instanceState.multimeterValue ?? 12.0;
    return {
      readoutBadge: `${val.toFixed(2)} ${mode}`,
      isDigitalScale: true,
      interactionHint: 'Chuyển thang đo U (V), I (A), R (Ω) trên màn hình LCD kép trước/sau',
    };
  }
  if (arch === 'induction-coil-led') {
    const defl = inst.instanceState.galvanometerDeflection ?? 0.6;
    const badge =
      defl > 0.05
        ? 'LED 1 ĐỎ SÁNG'
        : defl < -0.05
          ? 'LED 2 XANH SÁNG'
          : '2 LED TẮT';
    return {
      readoutBadge: badge,
      isDigitalScale: false,
      interactionHint: 'Đưa nam châm lại gần hoặc ra xa cuộn dây để tạo dòng điện cảm ứng xoay chiều',
    };
  }
  if (arch === 'porcelain-dish' || arch === 'distillation-flask') {
    const heating = inst.instanceState.isHeating !== false;
    return {
      readoutBadge: heating ? 'ĐANG ĐUN (78.5 °C)' : 'ĐÃ TẮT LỬA (25 °C)',
      isDigitalScale: false,
      interactionHint: 'Bật/tắt ngọn lửa đèn cồn để đốt cháy ethylic alcohol hoặc chưng cất',
    };
  }
  if (arch === 'optical-microscope') {
    const mag = inst.instanceState.magnification ?? 40;
    return {
      readoutBadge: `Vật kính ${mag}x`,
      isDigitalScale: true,
      interactionHint: 'Xoay mâm vật kính 10x / 40x / 100x soi tiêu bản nhiễm sắc thể cố định',
    };
  }
  if (arch === 'dna-double-helix') {
    return {
      readoutBadge: 'Chu kì 34 Å · A-T / G-C',
      isDigitalScale: false,
      interactionHint: 'Xoay 360° quan sát chuỗi xoắn kép, nguyên tắc bổ sung A-T (2 LK) và G-C (3 LK)',
    };
  }
  if (arch === 'retort-stand') {
    return {
      readoutBadge: 'Trụ 500 mm · Kẹp đa năng',
      isDigitalScale: false,
      interactionHint: 'Giá đỡ lực kế lò xo, phễu chiết, bình cầu chưng cất và ống nghiệm',
    };
  }

  // Specimens & Calibration Weight
  const massG = asset.scientificProperties.referenceMass?.value ?? 66.25;
  const volCm3 = asset.scientificProperties.referenceVolume?.value ?? 24.5;
  return {
    readoutBadge: `${massG.toFixed(1)} g · ${volCm3.toFixed(1)} cm³`,
    isDigitalScale: false,
    interactionHint: 'Kéo thả lên đĩa Cân điện tử, nhúng vào Ống đong/Bình tràn, hoặc móc vào Lực kế',
  };
}

interface LabViewport3DProps {
  instances: SceneInstance[];
  assetsMap: Map<string, AssetDefinition>;
  selectedInstanceId: string | null;
  selectedCatalogAsset: AssetDefinition | null;
  environment: LabEnvironment;
  environments?: LabEnvironment[];
  isStudentMode?: boolean;
  studentCurrentHint?: string;
  relevantAssetIds?: Set<string>;
  toolMode: TransformToolMode;
  viewMode: ViewportDisplayMode;
  showGrid: boolean;
  showAxes: boolean;
  showLabels: boolean;
  showDimensions: boolean;
  isFullscreen: boolean;
  isDarkMode?: boolean;
  isGuideOpen?: boolean;
  isNeuralGuideEnabled?: boolean;
  onToggleGuide?: () => void;
  onSelectInstance: (instanceId: string | null) => void;
  onUpdateInstanceTransform: (
    instanceId: string,
    positionM: [number, number, number],
    rotationRad: [number, number, number],
  ) => void;
  onPhysicalDockInteraction?: (
    draggedInstanceId: string,
    targetInstanceId: string | null,
    slot: PhysicalDockTargetSlot,
    finalPositionM: [number, number, number],
  ) => void;
  onQuickLabAction?: (action: QuickLabActionType, instanceId: string) => void;
  onDeleteInstance?: (instanceId: string) => void;
  onUpdateInstanceState?: (
    instanceId: string,
    statePatch: Partial<SceneInstance['instanceState']>,
    notificationMsg?: string,
  ) => void;
  onDispenseWaterVolume?: (
    targetInstanceId: string,
    volumeMl: number,
    mode: 'add' | 'set' | 'refill-dispenser',
  ) => void;
  onContinuousPourTransfer?: (
    sourceInstanceId: string,
    targetInstanceId: string | null,
    nextSourceMl: number,
    nextTargetMl: number | null,
    pouredMl: number,
  ) => void;
  onDropAssetIntoScene: (assetId: string, positionM: [number, number, number]) => void;
  onToolModeChange: (mode: TransformToolMode) => void;
  onViewModeChange: (mode: ViewportDisplayMode) => void;
  onToggleGrid: () => void;
  onToggleAxes: () => void;
  onToggleLabels: () => void;
  onToggleDimensions: () => void;
  onToggleFullscreen: () => void;
  onResetScene: () => void;
  onSelectEnvironment?: (envId: string) => void;
  onNotify: (message: string, tone?: 'info' | 'success' | 'warning' | 'error') => void;
  showDetailedGuides?: boolean;
  onToggleDetailedGuides?: () => void;
  studentGuidedStep?: number;
  onChangeGuidedStep?: (step: any) => void;
}

// Pre-allocated math helpers at module scope to prevent GC in render loop
const _projVec = new THREE.Vector3();
// Mặt phẳng raycast trên mặt bàn thực hành ở đúng y = BENCH_SURFACE_Y = 0.82 m (Mục 3.2 & 5)
const _rayPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -BENCH_SURFACE_Y);
const _activeDragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -BENCH_SURFACE_Y);
const _tempBox3 = new THREE.Box3();
const _dropPoint = new THREE.Vector3();
const _dragIntersect = new THREE.Vector3();
const _lipWorldPos = new THREE.Vector3();
const _surfaceWorldPos = new THREE.Vector3();

/**
 * Tính toán chính xác toạ độ (pourX, pourY) khi nghiêng bình nguồn (góc -0.95 rad)
 * để đầu vòi rót (`pouring_lip`) luôn nằm ngay phía trên miệng bình nhận (không bao giờ rót lệch ra ngoài!).
 */
function computeExactPourPosition(
  srcAsset: AssetDefinition | undefined,
  dstAsset: AssetDefinition | undefined,
  targetX: number,
  targetZ: number,
): { pourX: number; pourY: number; pourZ: number; targetRimY: number } {
  const srcArch = srcAsset?.geometry.proceduralArchetype;
  const dstArch = dstAsset?.geometry.proceduralArchetype;
  const dstHeight =
    dstArch === 'graduated-cylinder'
      ? 0.242
      : dstArch === 'overflow-can'
        ? 0.194
        : dstArch === 'erlenmeyer-flask'
          ? 0.137
          : dstArch === 'beaker-250'
            ? 0.097
            : dstAsset?.geometry.boundingBoxM.height ?? 0.12;

  let lipLocalX = 0.036;
  let lipLocalY = 0.096;
  if (srcArch === 'graduated-cylinder') {
    lipLocalX = 0.0185;
    lipLocalY = 0.241;
  } else if (srcArch === 'beaker-250') {
    lipLocalX = 0.038;
    lipLocalY = 0.096;
  } else if (srcArch === 'erlenmeyer-flask') {
    lipLocalX = 0.018;
    lipLocalY = 0.137;
  } else if (srcAsset) {
    lipLocalX = srcAsset.geometry.boundingBoxM.width * 0.42;
    lipLocalY = srcAsset.geometry.boundingBoxM.height * 0.94;
  }

  // Khi xoay nghiêng quanh trục Z một góc theta = -0.95 rad (~54.4° sang phải +X):
  const theta = -0.95;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const dxLip = lipLocalX * cosT - lipLocalY * sinT;
  const dyLip = lipLocalX * sinT + lipLocalY * cosT;

  // Đặt đầu mỏ rót nằm ngay trên miệng bình nhận (+3.4 cm phía trên vành miệng, lệch tâm -0.6 cm)
  const desiredLipWorldX = targetX - 0.006;
  const desiredLipLocalYAboveBench = dstHeight + 0.034;

  const pourX = THREE.MathUtils.clamp(
    desiredLipWorldX - dxLip,
    -BENCH_LIMIT_X,
    BENCH_LIMIT_X,
  );
  const pourY = Math.max(0.055, desiredLipLocalYAboveBench - dyLip);

  return {
    pourX,
    pourY,
    pourZ: targetZ,
    targetRimY: dstHeight,
  };
}

/**
 * Mô phỏng đường cong dòng chảy chất lỏng chính xác theo quỹ đạo trọng lực Trái Đất (Ballistic Gravity Parabola)
 * và cơ chế phân rã tia thành giọt (Rayleigh-Plateau dripping instability):
 * - Gia tốc trọng trường g = 9.80665 m/s²
 * - Tự động nhận diện chế độ nhỏ giọt (dripping) khi lưu lượng thấp hoặc nghiêng nhẹ (flowRate < 16 ml/s)
 * - Khi lưu lượng lớn: dòng chảy liên tục (continuous laminar stream) uốn cong parabol thon nhỏ dần do gia tốc rơi tự do A1*v1 = A2*v2
 * - Tọa độ điểm bắt đầu chính xác tại mỏ vòi rót (`pouring_lip`)
 * - Tọa độ điểm rơi chính xác tại mặt thoáng chất lỏng bình nhận hoặc mặt bàn kèm sóng va chạm đa pha (splash ripples)
 */
function renderGravitationalFluidStream(params: {
  streamGrp: THREE.Group;
  spoutPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  targetSurfaceY: number;
  now: number;
  flowRateMlPerSec: number;
  isDrippingOnly?: boolean;
}): void {
  const { streamGrp, spoutPos, targetPos, targetSurfaceY, now, flowRateMlPerSec, isDrippingOnly } = params;
  streamGrp.visible = true;
  streamGrp.position.set(0, 0, 0);

  const g = 9.80665; // m/s²
  const v0y = 0.14;  // Vận tốc ban đầu hướng xuống khi nước tràn qua miệng vòi (m/s)

  const dy = Math.max(0.012, spoutPos.y - targetSurfaceY);
  // t_flight giải từ phương trình chuyển động rơi tự do: 0.5 * g * t^2 + v0y * t - dy = 0
  const tFlight = Math.max(0.06, (-v0y + Math.sqrt(v0y * v0y + 2 * g * dy)) / g);

  // Xây dựng 16 điểm Catmull-Rom cong chính xác theo gia tốc trọng trường
  const curvePoints: THREE.Vector3[] = [];
  const steps = 16;
  for (let i = 0; i <= steps; i++) {
    const s = i / steps;
    const t = s * tFlight;
    const px = THREE.MathUtils.lerp(spoutPos.x, targetPos.x, s);
    const pz = THREE.MathUtils.lerp(spoutPos.z, targetPos.z, s);
    const fallDist = v0y * t + 0.5 * g * t * t;
    const py = Math.max(targetSurfaceY, spoutPos.y - fallDist);
    curvePoints.push(new THREE.Vector3(px, py, pz));
  }
  const gravityCurve = new THREE.CatmullRomCurve3(curvePoints);

  const outerM = streamGrp.getObjectByName('pour_outer') as THREE.Mesh | undefined;
  const coreM = streamGrp.getObjectByName('pour_core') as THREE.Mesh | undefined;

  const isDripMode = Boolean(isDrippingOnly) || flowRateMlPerSec < 16;
  const pulse = 0.88 + 0.16 * Math.sin(now * 0.035);

  if (isDripMode) {
    if (outerM) outerM.visible = false;
    if (coreM) coreM.visible = false;
  } else {
    if (outerM) {
      outerM.visible = true;
      outerM.geometry.dispose();
      outerM.geometry = new THREE.TubeGeometry(gravityCurve, 20, 0.0022 * pulse, 10, false);
      outerM.position.set(0, 0, 0);
      outerM.rotation.set(0, 0, 0);
      outerM.scale.set(1, 1, 1);
    }
    if (coreM) {
      coreM.visible = true;
      coreM.geometry.dispose();
      coreM.geometry = new THREE.TubeGeometry(gravityCurve, 20, 0.0010 * pulse, 6, false);
      coreM.position.set(0, 0, 0);
      coreM.rotation.set(0, 0, 0);
      coreM.scale.set(1, 1, 1);
    }
  }

  // Cập nhật 12 giọt nước rơi dọc theo đường cong trọng lực
  const totalDrops = 12;
  const dropSpeed = isDripMode ? 0.0028 : 0.0048;
  for (let d = 0; d < totalDrops; d++) {
    const drop = streamGrp.getObjectByName(`pour_drop_${d}`) as THREE.Mesh | undefined;
    if (drop) {
      if (isDripMode && d >= 6) {
        drop.visible = false;
        continue;
      }
      drop.visible = true;
      const countUsed = isDripMode ? 6 : totalDrops;
      const sDrop = ((now * dropSpeed + d / countUsed) % 1);
      const pt = gravityCurve.getPoint(sDrop);
      drop.position.copy(pt);
      const stretch = isDripMode ? 1.55 + sDrop * 0.95 : 1.15 + sDrop * 0.55;
      const rScale = isDripMode ? 1.12 : 0.82;
      drop.scale.set(rScale * pulse, rScale * pulse * stretch, rScale * pulse);
    }
  }

  // 3 Vòng sóng va chạm đồng tâm đa pha khi nước tiếp xúc mặt thoáng
  for (let r = 0; r < 3; r++) {
    const splash = streamGrp.getObjectByName(`pour_splash_${r}`) as THREE.Mesh | undefined;
    if (splash) {
      const rFreq = isDripMode ? 0.0025 : 0.0038;
      const rPhase = ((now * rFreq + r * 0.33) % 1);
      const sScale = isDripMode ? (0.42 + rPhase * 0.85) : (0.55 + rPhase * 1.35);
      splash.position.set(
        targetPos.x,
        targetSurfaceY + 0.0012 + r * 0.0006,
        targetPos.z,
      );
      splash.scale.set(sScale, sScale, 1);
      if (splash.material instanceof THREE.MeshBasicMaterial) {
        splash.material.opacity = (1 - rPhase) * (isDripMode ? 0.65 : 0.88);
      }
    }
  }
}

/**
 * Tạo kết cấu Vòng Vùng Tiếp Cận Mặt Bàn, Vòng Miệng Bình & Vòng Chọn Thiết Bị:
 * Vẽ bằng nét đứt mảnh (setLineDash), trong suốt hoàn toàn ở phần lõi, độ mờ dịu nhẹ (0.18 - 0.42)
 * để chỉ hiển thị tinh tế quanh chân/miệng bình mà không gây rối mắt hay che khuất mực nước bên trong.
 */
let _cachedNeonZoneTex: THREE.CanvasTexture | null = null;
function getFuturisticNeonZoneTexture(): THREE.CanvasTexture {
  if (_cachedNeonZoneTex) return _cachedNeonZoneTex;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = 256;
    const cy = 256;
    ctx.clearRect(0, 0, 512, 512);

    // Vòng nét đứt mảnh tinh tế ở rìa ngoài, phần lõi hoàn toàn trong suốt 100%
    ctx.save();
    ctx.shadowColor = 'rgba(255, 255, 255, 0.55)';
    ctx.shadowBlur = 4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([10, 14]);
    ctx.beginPath();
    ctx.arc(cx, cy, 236, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  _cachedNeonZoneTex = tex;
  return tex;
}

/**
 * Tạo kết cấu Vòng Quay 360° (Theo chiều đứng & Theo mặt bàn):
 * Hiện rõ nét vòng tròn 360° đứt nét kèm vạch chia độ sắc nét, nhưng phần lõi bên trong hoàn toàn trong suốt
 * để không che khuất thiết bị.
 */
let _cachedNeonProtractorTex: THREE.CanvasTexture | null = null;
function getFuturisticNeonProtractorTexture(): THREE.CanvasTexture {
  if (_cachedNeonProtractorTex) return _cachedNeonProtractorTex;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = 256;
    const cy = 256;
    ctx.clearRect(0, 0, 512, 512);

    // 1. Vòng tròn 360° chính: đứt nét hiện rõ, sắc nét
    ctx.save();
    ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowBlur = 6;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.lineWidth = 4.2;
    ctx.setLineDash([14, 9]);
    ctx.beginPath();
    ctx.arc(cx, cy, 228, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 2. Vòng mảnh định tâm phụ sát rìa trong của vành
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.58)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 9]);
    ctx.beginPath();
    ctx.arc(cx, cy, 212, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 3. Vạch chia độ 360° rõ nét quanh vành (mỗi 10°, vạch chính mỗi 45°/90°)
    ctx.save();
    for (let i = 0; i < 36; i++) {
      const ang = (i * Math.PI * 2) / 36;
      const isCardinal = i % 9 === 0;
      const isMajor = i % 3 === 0;
      const rIn = isCardinal ? 204 : isMajor ? 210 : 216;
      const rOut = isCardinal ? 236 : 228;
      ctx.strokeStyle = isCardinal
        ? 'rgba(255, 255, 255, 1.0)'
        : isMajor
          ? 'rgba(255, 255, 255, 0.85)'
          : 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = isCardinal ? 2.8 : isMajor ? 1.8 : 1.1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * rIn, cy + Math.sin(ang) * rIn);
      ctx.lineTo(cx + Math.cos(ang) * rOut, cy + Math.sin(ang) * rOut);
      ctx.stroke();
    }
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  _cachedNeonProtractorTex = tex;
  return tex;
}

const _focalBadgeTexCache = new Map<string, THREE.CanvasTexture>();

function getFocalBadgeTexture(
  symbol: "F" | "F'",
  roleVi: string,
  fCm: number,
  colorHex: string,
): THREE.CanvasTexture {
  const cacheKey = `${symbol}_${roleVi}_${fCm}_${colorHex}`;
  const existing = _focalBadgeTexCache.get(cacheKey);
  if (existing) return existing;

  const canvas = document.createElement('canvas');
  canvas.width = 168;
  canvas.height = 76;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 168, 76);

    // Nền kính trong suốt mờ nhẹ đồng bộ chuẩn "Kho chứa"
    ctx.fillStyle = 'rgba(11, 27, 54, 0.38)';
    ctx.beginPath();
    ctx.roundRect(4, 4, 160, 68, 14);
    ctx.fill();

    // Viền phát quang thanh mảnh với bóng neon
    ctx.save();
    ctx.lineWidth = 2.4;
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 6;
    ctx.strokeStyle = colorHex;
    ctx.stroke();
    ctx.restore();

    // Large crisp symbol F or F' in serif italic textbook font
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold italic 36px "Times New Roman", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, 42, 38);

    // Subtitle label: e.g. "Tiêu điểm vật" / "Tiêu điểm ảnh"
    ctx.fillStyle = colorHex;
    ctx.font = 'bold 13px ui-sans-serif, system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(roleVi, 74, 30);

    // Coordinate / focal distance: e.g. "f = 10 cm"
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 12px ui-monospace, SFMono-Regular, monospace';
    ctx.fillText(`f = ${Math.abs(fCm)} cm`, 74, 51);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  _focalBadgeTexCache.set(cacheKey, tex);
  return tex;
}

/**
 * Kiểm tra xem một đối tượng 3D và TẤT CẢ các cấp cha (ancestors) của nó lên tới root
 * có đang thực sự hiển thị (visible === true) hay không.
 * Ngăn chặn tuyệt đối raycaster bắt nhầm các tay cầm gizmo con (như mũi tên tilt-pour)
 * khi nhóm cha (tiltRingGrp) đang bị ẩn (visible = false).
 */
function isObjectEffectivelyVisible(
  obj: THREE.Object3D | null | undefined,
  root?: THREE.Object3D | null,
): boolean {
  let curr: THREE.Object3D | null | undefined = obj;
  while (curr) {
    if (!curr.visible) return false;
    if (root && curr === root) break;
    curr = curr.parent;
  }
  return Boolean(curr);
}

/**
 * Tạo cụm Mũi Tên Xoay 2 Chiều (Curved Double-Arrow Handle) gắn trên vành vòng 360°.
 * CHỈ khi người dùng bấm chọn đúng vào các mũi tên này thì mới kích hoạt xoay ('tilt-pour' hoặc 'rotate-y'),
 * còn bấm vào thân thiết bị hay lòng vòng tròn thì di chuyển thiết bị mượt mà trên bàn.
 */
function createCurvedRotationArrowHandle(
  handleType: 'tilt-pour' | 'rotate-y',
  radius: number,
  centerAngleRad: number,
  colorHex: number,
): THREE.Group {
  const handleGrp = new THREE.Group();
  handleGrp.name = `rot_arrow_handle_${handleType}_${Math.round((centerAngleRad * 180) / Math.PI)}`;

  const handleMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.96,
    depthTest: false,
    depthWrite: false,
  });

  const highlightCoreMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
    depthTest: false,
    depthWrite: false,
  });

  // Cung nối ngắn ngay tại vị trí mũi tên
  const arcSpan = 0.34;
  const arcGeo = new THREE.TorusGeometry(
    radius,
    0.0028,
    12,
    24,
    arcSpan,
  );
  const arcMesh = new THREE.Mesh(arcGeo, handleMat);
  arcMesh.rotation.z = centerAngleRad - arcSpan * 0.5;
  arcMesh.renderOrder = 22;
  arcMesh.userData.tinkercadHandle = handleType;
  handleGrp.add(arcMesh);

  // Nút chấm sáng ở tâm cụm mũi tên để dễ nhận biết điểm nắm xoay
  const centerKnob = new THREE.Mesh(
    new THREE.SphereGeometry(0.0052, 14, 14),
    highlightCoreMat,
  );
  centerKnob.position.set(
    Math.cos(centerAngleRad) * radius,
    Math.sin(centerAngleRad) * radius,
    0,
  );
  centerKnob.renderOrder = 23;
  centerKnob.userData.tinkercadHandle = handleType;
  handleGrp.add(centerKnob);

  // 2 đầu mũi tên hướng theo tiếp tuyến 2 chiều dọc theo vòng tròn
  const endAngleCCW = centerAngleRad + arcSpan * 0.5;
  const coneCCW = new THREE.Mesh(
    new THREE.ConeGeometry(0.0078, 0.017, 16),
    handleMat,
  );
  coneCCW.position.set(
    Math.cos(endAngleCCW) * radius,
    Math.sin(endAngleCCW) * radius,
    0,
  );
  coneCCW.rotation.z = endAngleCCW;
  coneCCW.renderOrder = 23;
  coneCCW.userData.tinkercadHandle = handleType;
  handleGrp.add(coneCCW);

  const endAngleCW = centerAngleRad - arcSpan * 0.5;
  const coneCW = new THREE.Mesh(
    new THREE.ConeGeometry(0.0078, 0.017, 16),
    handleMat,
  );
  coneCW.position.set(
    Math.cos(endAngleCW) * radius,
    Math.sin(endAngleCW) * radius,
    0,
  );
  coneCW.rotation.z = endAngleCW + Math.PI;
  coneCW.renderOrder = 23;
  coneCW.userData.tinkercadHandle = handleType;
  handleGrp.add(coneCW);

  // Vùng bắt chuột (Hitbox) chỉ bao quanh đúng cụm Mũi Tên Xoay này (không chiếm lòng thiết bị)
  const arrowHitbox = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 12, 12),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
    }),
  );
  arrowHitbox.position.set(
    Math.cos(centerAngleRad) * radius,
    Math.sin(centerAngleRad) * radius,
    0,
  );
  arrowHitbox.renderOrder = 28;
  arrowHitbox.userData.tinkercadHandle = handleType;
  handleGrp.add(arrowHitbox);

  return handleGrp;
}

/**
 * Tạo vân gỗ tự nhiên ấm áp cho mặt bàn thí nghiệm (Oak / Walnut Teak)
 * Giúp nổi bật các dụng cụ thủy tinh trong suốt, cột nước và kim loại mà không gây chói mắt.
 */
function createWoodBenchTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Nền gỗ sồi ấm (Warm Honey-Oak / Teak)
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, '#9A6232');
    grad.addColorStop(0.5, '#AA6E39');
    grad.addColorStop(1, '#8C5629');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Các thanh ghép mặt bàn gỗ (Plank seams)
    const plankCount = 6;
    const plankH = 512 / plankCount;
    for (let p = 0; p < plankCount; p++) {
      const y0 = p * plankH;
      ctx.fillStyle = p % 2 === 0 ? 'rgba(255, 224, 180, 0.04)' : 'rgba(45, 20, 5, 0.05)';
      ctx.fillRect(0, y0, 1024, plankH);

      // Đường ghép mảnh giữa các tấm gỗ
      ctx.strokeStyle = 'rgba(58, 30, 10, 0.28)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.lineTo(1024, y0);
      ctx.stroke();
    }

    // Các đường vân gỗ mảnh chạy dọc theo thớ gỗ
    for (let i = 0; i < 240; i++) {
      const y = (i * 2.15) % 512;
      const alpha = 0.03 + (i % 5) * 0.012;
      ctx.strokeStyle =
        i % 3 === 0
          ? `rgba(62, 31, 10, ${alpha})`
          : `rgba(245, 208, 165, ${alpha * 0.75})`;
      ctx.lineWidth = 1 + (i % 3) * 0.7;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 1024; x += 64) {
        const wave = Math.sin(x * 0.008 + i * 0.45) * 3.2;
        ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

// =============================================================================
// CỔNG CHUYỂN KHÔNG GIAN (TRANSPORTER PORTAL)
// Vị trí: Đặt trên mặt bàn thực hành sát Gốc Tọa Độ O(0,0,0) (x = -1.04m, y = 0.8225m, z = -0.22m)
// Mục đích: Tiếp nhận thiết bị được kéo thả hoặc chọn để gửi trả về kho / xóa khỏi bàn
// =============================================================================
export const TRANSPORTER_PORTAL_POSITION = {
  x: -1.04,
  y: BENCH_SURFACE_Y + 0.0025,
  z: -0.22,
};
export const TRANSPORTER_PORTAL_RADIUS = 0.11;
export const TRANSPORTER_PORTAL_TRIGGER_RADIUS = 0.17;

let _cachedTransporterDiscTex: THREE.CanvasTexture | null = null;
function getTransporterPortalDiscTexture(): THREE.CanvasTexture {
  if (_cachedTransporterDiscTex) return _cachedTransporterDiscTex;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = 256;
    const cy = 256;
    ctx.clearRect(0, 0, 512, 512);

    // 1. Cosmic radial nebula glow
    const radialGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 245);
    radialGrad.addColorStop(0.0, 'rgba(224, 242, 254, 0.95)'); // Singularity tâm sáng rực
    radialGrad.addColorStop(0.12, 'rgba(56, 189, 248, 0.78)'); // Cyan phát quang
    radialGrad.addColorStop(0.35, 'rgba(14, 165, 233, 0.48)'); // Xanh dương thiên hà
    radialGrad.addColorStop(0.65, 'rgba(3, 105, 161, 0.28)');  // Vực thẳm vũ trụ
    radialGrad.addColorStop(0.88, 'rgba(15, 23, 42, 0.42)');   // Đêm ngân hà trong suốt
    radialGrad.addColorStop(0.97, 'rgba(56, 189, 248, 0.88)'); // Vành hào quang neon ngoài cùng
    radialGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');          // Chuyển mượt ra viền
    ctx.fillStyle = radialGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 245, 0, Math.PI * 2);
    ctx.fill();

    // 2. Cánh tay thiên hà / vòng xoáy xoắn ốc ma thuật
    ctx.save();
    ctx.lineWidth = 3.5;
    for (let arm = 0; arm < 4; arm++) {
      const baseAngle = (arm * Math.PI) / 2;
      ctx.strokeStyle = arm % 2 === 0 ? 'rgba(56, 189, 248, 0.65)' : 'rgba(125, 211, 252, 0.50)';
      ctx.beginPath();
      for (let step = 0; step <= 80; step++) {
        const t = step / 80;
        const r = 25 + t * 195;
        const theta = baseAngle + t * 2.8;
        const px = cx + r * Math.cos(theta);
        const py = cy + r * Math.sin(theta);
        if (step === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();

    // 3. Vòng quỹ đạo công nghệ vi mô
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy, 238, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(14, 165, 233, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([16, 8, 4, 8]);
    ctx.beginPath();
    ctx.arc(cx, cy, 175, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(224, 242, 254, 0.85)';
    ctx.lineWidth = 2.0;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy, 110, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Các ký hiệu Chevron / Mũi tên năng lượng hướng vào tâm hố sâu
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const r = 216;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillStyle = 'rgba(224, 242, 254, 0.92)';
      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.lineTo(6, 6);
      ctx.lineTo(-6, 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  _cachedTransporterDiscTex = tex;
  return tex;
}

let _cachedTransporterBeamTex: THREE.CanvasTexture | null = null;
function getTransporterBeamTexture(): THREE.CanvasTexture {
  if (_cachedTransporterBeamTex) return _cachedTransporterBeamTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    const grad = ctx.createLinearGradient(0, 256, 0, 0);
    grad.addColorStop(0.0, 'rgba(56, 189, 248, 0.65)');
    grad.addColorStop(0.2, 'rgba(14, 165, 233, 0.40)');
    grad.addColorStop(0.55, 'rgba(3, 105, 161, 0.18)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = 'rgba(224, 242, 254, 0.35)';
    ctx.lineWidth = 1.2;
    for (let x = 16; x < 256; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 256);
      ctx.lineTo(x, 40);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  _cachedTransporterBeamTex = tex;
  return tex;
}

let _cachedTransporterLabelTex: THREE.CanvasTexture | null = null;
function getTransporterLabelTexture(): THREE.CanvasTexture {
  if (_cachedTransporterLabelTex) return _cachedTransporterLabelTex;
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 384, 128);

    const rx = 10;
    const ry = 10;
    const rw = 364;
    const rh = 108;
    const rRadius = 22;

    ctx.save();
    // Nền kính trong suốt mờ ít (frosted translucent glass)
    ctx.fillStyle = 'rgba(11, 27, 54, 0.38)';
    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, rh, rRadius);
    ctx.fill();

    // Viền phát quang cyan mảnh tinh tế
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.lineWidth = 2.4;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.stroke();

    // Duy nhất 1 chữ "Kho chứa"
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#f0f9ff';
    ctx.font = 'bold 44px "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Kho chứa', 192, 64);

    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  _cachedTransporterLabelTex = tex;
  return tex;
}

function createTransporterPortalGroup(): THREE.Group {
  const portalGroup = new THREE.Group();
  portalGroup.name = 'transporter_portal_group';
  portalGroup.position.set(
    TRANSPORTER_PORTAL_POSITION.x,
    TRANSPORTER_PORTAL_POSITION.y,
    TRANSPORTER_PORTAL_POSITION.z,
  );

  const radius = TRANSPORTER_PORTAL_RADIUS;

  // 1. Mặt tròn không gian phẳng áp sát mặt bàn
  const discGeo = new THREE.CircleGeometry(radius, 64);
  discGeo.rotateX(-Math.PI / 2);
  const discMat = new THREE.MeshBasicMaterial({
    map: getTransporterPortalDiscTexture(),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -3,
    polygonOffsetUnits: -3,
  });
  const discMesh = new THREE.Mesh(discGeo, discMat);
  discMesh.name = 'portal_disc';
  discMesh.userData = { isTransporterPortal: true };
  portalGroup.add(discMesh);

  // 2. Vòng phát sáng Neon ngoài cùng
  const outerRingGeo = new THREE.RingGeometry(radius * 0.98, radius * 1.025, 64);
  outerRingGeo.rotateX(-Math.PI / 2);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRingMesh.name = 'portal_outer_ring';
  outerRingMesh.position.y = 0.0005;
  portalGroup.add(outerRingMesh);

  // 3. Vòng xoay nghịch chiều bên trong
  const innerRingGeo = new THREE.RingGeometry(radius * 0.58, radius * 0.62, 48);
  innerRingGeo.rotateX(-Math.PI / 2);
  const innerRingMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  });
  const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRingMesh.name = 'portal_inner_ring';
  innerRingMesh.position.y = 0.001;
  portalGroup.add(innerRingMesh);

  // 4. Vòng gợn sóng trung tâm
  const centerRingGeo = new THREE.RingGeometry(radius * 0.22, radius * 0.25, 36);
  centerRingGeo.rotateX(-Math.PI / 2);
  const centerRingMat = new THREE.MeshBasicMaterial({
    color: 0xe0f2fe,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.90,
    depthWrite: false,
  });
  const centerRingMesh = new THREE.Mesh(centerRingGeo, centerRingMat);
  centerRingMesh.name = 'portal_center_ring';
  centerRingMesh.position.y = 0.0015;
  portalGroup.add(centerRingMesh);

  // 5. Cột sáng không gian thẳng đứng dạng hình trụ mờ bán trong suốt
  const beamHeight = 0.18;
  const beamGeo = new THREE.CylinderGeometry(radius * 0.99, radius * 0.99, beamHeight, 36, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    map: getTransporterBeamTexture(),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const beamMesh = new THREE.Mesh(beamGeo, beamMat);
  beamMesh.name = 'portal_beam';
  beamMesh.position.y = beamHeight / 2;
  portalGroup.add(beamMesh);

  // 6. Nhãn 3D lơ lửng: "Kho chứa" (nền kính trong suốt mờ ít)
  const spriteMat = new THREE.SpriteMaterial({
    map: getTransporterLabelTexture(),
    transparent: true,
    opacity: 0.95,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.name = 'portal_label_sprite';
  sprite.position.set(0, beamHeight + 0.042, 0);
  sprite.scale.set(0.18, 0.06, 1);
  sprite.userData = { isTransporterPortal: true };
  portalGroup.add(sprite);

  // Vùng đón trúng đích raycast vô hình
  const hitGeo = new THREE.CylinderGeometry(radius * 1.15, radius * 1.15, beamHeight + 0.08, 16);
  const hitMat = new THREE.MeshBasicMaterial({
    visible: false,
    transparent: true,
    opacity: 0,
  });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.name = 'portal_hit_target';
  hitMesh.position.y = (beamHeight + 0.08) / 2;
  hitMesh.userData = { isTransporterPortal: true };
  portalGroup.add(hitMesh);

  portalGroup.userData = {
    isTransporterPortal: true,
    isHovered: false,
    warpPulse: 0,
  };

  return portalGroup;
}

/**
 * Vùng đón đặt thiết bị Holographic khi người dùng kéo nơ-ron từ sơ đồ mạng xuống mặt bàn thực hành 3D
 */
function createNeuralPlacementTargetGroup(): THREE.Group {
  const targetGroup = new THREE.Group();
  targetGroup.name = 'neural_placement_target_group';
  targetGroup.visible = false;

  const radius = 0.085;

  // 1. Đĩa phát quang holographic phẳng trên mặt bàn
  const discGeo = new THREE.CircleGeometry(radius, 48);
  discGeo.rotateX(-Math.PI / 2);
  const discMat = new THREE.MeshBasicMaterial({
    map: getFuturisticNeonZoneTexture(),
    color: 0x00f3ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
  });
  const discMesh = new THREE.Mesh(discGeo, discMat);
  discMesh.name = 'neural_target_disc';
  targetGroup.add(discMesh);

  // 2. Vòng phát sáng Cyan ngoài cùng
  const outerRingGeo = new THREE.RingGeometry(radius * 0.95, radius * 1.08, 48);
  outerRingGeo.rotateX(-Math.PI / 2);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRingMesh.name = 'neural_target_outer_ring';
  outerRingMesh.position.y = 0.0006;
  targetGroup.add(outerRingMesh);

  // 3. Vòng phụ tâm (Reticle Ring)
  const innerRingGeo = new THREE.RingGeometry(radius * 0.28, radius * 0.35, 32);
  innerRingGeo.rotateX(-Math.PI / 2);
  const innerRingMat = new THREE.MeshBasicMaterial({
    color: 0x67e8f9,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  });
  const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRingMesh.name = 'neural_target_inner_ring';
  innerRingMesh.position.y = 0.0008;
  targetGroup.add(innerRingMesh);

  // 4. Trụ quét holographic thẳng đứng (Holographic Laser Beacon)
  const beaconHeight = 0.26;
  const beaconGeo = new THREE.CylinderGeometry(radius * 0.95, radius * 0.95, beaconHeight, 32, 1, true);
  beaconGeo.translate(0, beaconHeight / 2, 0);
  const beaconMat = new THREE.MeshBasicMaterial({
    color: 0x00f3ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
  beaconMesh.name = 'neural_target_beacon';
  targetGroup.add(beaconMesh);

  // 5. Vòng tròn quét trên đỉnh trụ
  const topRingGeo = new THREE.RingGeometry(radius * 0.9, radius * 0.98, 32);
  topRingGeo.rotateX(-Math.PI / 2);
  topRingGeo.translate(0, beaconHeight, 0);
  const topRingMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  });
  const topRingMesh = new THREE.Mesh(topRingGeo, topRingMat);
  topRingMesh.name = 'neural_target_top_ring';
  targetGroup.add(topRingMesh);

  return targetGroup;
}

/**
 * Xây dựng bối cảnh phòng thí nghiệm Khoa học tự nhiên chuẩn OL3D-LAB-ENVIRONMENT-SPEC v2.0:
 * - Phòng 12.0 × 8.0 × 3.6 m, mặt sàn tại y = 0.000 m, gốc O (0, 0, 0) tại tâm sàn
 * - Bàn thực hành 2.40 × 0.75 m, mặt trên ở đúng y = BENCH_SURFACE_Y = 0.82 m, dày 0.04 m (mặt dưới y = 0.78 m)
 * - Bổ sung cửa sổ ánh sáng tự nhiên và tủ dụng cụ ở hậu cảnh tương thích hệ tọa độ y = 0 tại sàn
 */
function buildDaylightScienceClassroom(
  benchTopMat: THREE.MeshStandardMaterial,
  graphics: LabGraphicsSettings = DEFAULT_LAB_GRAPHICS_SETTINGS,
): THREE.Group {
  const roomGroup = buildStandardLabRoomV2(
    DEFAULT_LAB_ROOM_CONFIG,
    benchTopMat,
    graphics,
  );

  // Cửa sổ phòng thí nghiệm ánh sáng dịu gắn trên tường hậu cảnh (tại y = 1.65 m so với sàn y = 0)
  const windowGroup = new THREE.Group();
  windowGroup.position.set(-1.35, BENCH_SURFACE_Y + 0.65, -3.91);

  const winFrameMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.45,
  });
  const winFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.65, 1.15, 0.04),
    winFrameMat,
  );
  windowGroup.add(winFrame);

  const skyGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.54, 1.04),
    new THREE.MeshBasicMaterial({ color: 0x365375 }),
  );
  skyGlass.position.z = 0.022;
  windowGroup.add(skyGlass);

  const mullionV = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 1.08, 0.046),
    winFrameMat,
  );
  windowGroup.add(mullionV);
  const mullionH = new THREE.Mesh(
    new THREE.BoxGeometry(1.58, 0.03, 0.046),
    winFrameMat,
  );
  mullionH.position.y = 0.1;
  windowGroup.add(mullionH);
  roomGroup.add(windowGroup);

  // Tủ gỗ đựng dụng cụ thí nghiệm ở hậu cảnh (giảm độ dày 0.1m xuống còn 0.28m)
  const cabinetGroup = new THREE.Group();
  cabinetGroup.position.set(1.55, 0.9, -3.70);

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x6e4726,
    roughness: 0.58,
    metalness: 0.05,
  });
  const cabBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.8, 0.28),
    woodMat,
  );
  cabinetGroup.add(cabBody);
  roomGroup.add(cabinetGroup);

  return roomGroup;
}

export const LabViewport3D: React.FC<LabViewport3DProps> = ({
  instances,
  assetsMap,
  selectedInstanceId,
  selectedCatalogAsset,
  environment,
  isStudentMode = false,
  studentCurrentHint,
  relevantAssetIds,
  toolMode,
  viewMode,
  showGrid,
  showAxes,
  showLabels,
  showDimensions,
  isFullscreen,
  isDarkMode = false,
  isGuideOpen = true,
  isNeuralGuideEnabled,
  onToggleGuide,
  onSelectInstance,
  onUpdateInstanceTransform,
  onPhysicalDockInteraction,
  onQuickLabAction,
  onDeleteInstance,
  onUpdateInstanceState,
  onDispenseWaterVolume,
  onContinuousPourTransfer,
  onDropAssetIntoScene,
  onToolModeChange,
  onViewModeChange,
  onToggleGrid,
  onToggleAxes,
  onToggleLabels,
  onToggleDimensions,
  onToggleFullscreen,
  onResetScene,
  onNotify,
  showDetailedGuides,
  onToggleDetailedGuides,
  studentGuidedStep,
  onChangeGuidedStep,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orbitRef = useRef<OrbitControls | null>(null);
  const transformRef = useRef<TransformControls | null>(null);
  const instanceObjectsRef = useRef<Map<string, THREE.Group>>(new Map());
  const singleAssetGroupRef = useRef<THREE.Group | null>(null);
  const benchGroupRef = useRef<THREE.Group | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);
  const selectionBoxHelperRef = useRef<THREE.BoxHelper | null>(null);
  const selectionRingRef = useRef<THREE.Mesh | null>(null);
  const snapTargetRingRef = useRef<THREE.Mesh | null>(null);
  const pouringStreamRef = useRef<THREE.Group | null>(null);
  const tinkercadGizmoRef = useRef<THREE.Group | null>(null);
  const vesselZonesGroupRef = useRef<THREE.Group | null>(null);
  const opticalAssemblyGroupRef = useRef<THREE.Group | null>(null);
  const neuralSynapseBeamGroupRef = useRef<THREE.Group | null>(null);
  const transporterPortalRef = useRef<THREE.Group | null>(null);
  const neuralPlacementTargetRef = useRef<THREE.Group | null>(null);
  const neuralDragPreviewGroupRef = useRef<{ assetId: string; root: THREE.Group } | null>(null);
  const dynamicWireDragGroupRef = useRef<THREE.Group | null>(null);
  const wireDragRef = useRef<{
    isDragging: boolean;
    pointerId: number | null;
    sourceInstanceId: string | null;
    sourceArchetype: string | null;
    sourcePolarity: 'pos' | 'neg' | null;
    startWorldPos: THREE.Vector3;
    currentWorldPos: THREE.Vector3;
    snappedTargetPos: THREE.Vector3 | null;
    snappedTargetInstanceId: string | null;
    snappedTargetPolarity: 'pos' | 'neg' | null;
  }>({
    isDragging: false,
    pointerId: null,
    sourceInstanceId: null,
    sourceArchetype: null,
    sourcePolarity: null,
    startWorldPos: new THREE.Vector3(),
    currentWorldPos: new THREE.Vector3(),
    snappedTargetPos: null,
    snappedTargetInstanceId: null,
    snappedTargetPolarity: null,
  });
  const [pendingWireConnection, setPendingWireConnection] = useState<{
    sourceInstId: string;
    sourceArch: string;
    polarity: 'pos' | 'neg';
  } | null>(null);
  const pendingWireConnectionRef = useRef<{
    sourceInstId: string;
    sourceArch: string;
    polarity: 'pos' | 'neg';
  } | null>(null);
  pendingWireConnectionRef.current = pendingWireConnection;
  const tinkercadDragRef = useRef<{
    mode: 'elevate-y' | 'tilt-pour' | 'rotate-y' | null;
    instanceId: string | null;
    pointerId: number | null;
    startClientX: number;
    startClientY: number;
    startLocalY: number;
    targetLocalY: number;
    targetTiltRad: number;
    startYawRad: number;
    targetYawRad: number;
    liveSourceMl: number;
    initialSourceMl: number;
    activeTargetId: string | null;
    liveTargetMl: number;
    initialTargetMl: number;
    pouredTotalMl: number;
    spilledTotalMl: number;
    lastTapElevateMs: number;
    lastObjectTapMs: number;
    lastTappedInstanceId: string | null;
  }>({
    mode: null,
    instanceId: null,
    pointerId: null,
    startClientX: 0,
    startClientY: 0,
    startLocalY: 0,
    targetLocalY: 0,
    targetTiltRad: 0,
    startYawRad: 0,
    targetYawRad: 0,
    liveSourceMl: 0,
    initialSourceMl: 0,
    activeTargetId: null,
    liveTargetMl: 0,
    initialTargetMl: 0,
    pouredTotalMl: 0,
    spilledTotalMl: 0,
    lastTapElevateMs: 0,
    lastObjectTapMs: 0,
    lastTappedInstanceId: null,
  });
  const activePourAnimRef = useRef<{
    sourceId: string;
    targetId: string;
    startTimeMs: number;
    durationMs: number;
    pourX: number;
    pourY: number;
    pourZ: number;
    targetX: number;
    targetRimY: number;
    targetZ: number;
    settleX: number;
    settleZ: number;
    srcStartScaleY: number;
    srcEndScaleY: number;
    dstStartScaleY: number;
    dstEndScaleY: number;
  } | null>(null);
  const activeDispenseAnimRef = useRef<{
    dispenserId: string;
    targetId: string;
    startTimeMs: number;
    durationMs: number;
    dstStartScaleY: number;
    dstEndScaleY: number;
    dispStartScaleY: number;
    dispEndScaleY: number;
  } | null>(null);
  const requestRenderRef = useRef<() => void>(() => {});

  // Smooth camera transition targets
  const cameraGoalPosRef = useRef<THREE.Vector3 | null>(null);
  const cameraGoalTargetRef = useRef<THREE.Vector3 | null>(null);

  // Direct physical drag state
  const dragStateRef = useRef<{
    isDragging: boolean;
    instanceId: string | null;
    grabOffsetX: number;
    grabOffsetZ: number;
    targetPos: THREE.Vector3;
    lastX: number;
    lastZ: number;
    velX: number;
    velZ: number;
    hoverTargetInstanceId: string | null;
    hoverSlot: PhysicalDockTargetSlot;
    hoverHint: string | null;
  }>({
    isDragging: false,
    instanceId: null,
    grabOffsetX: 0,
    grabOffsetZ: 0,
    targetPos: new THREE.Vector3(),
    lastX: 0,
    lastZ: 0,
    velX: 0,
    velZ: 0,
    hoverTargetInstanceId: null,
    hoverSlot: 'bench',
    hoverHint: null,
  });

  // Mutable refs for event handlers inside WebGL lifecycle
  const instancesRef = useRef(instances);
  instancesRef.current = instances;
  const assetsMapRef = useRef(assetsMap);
  assetsMapRef.current = assetsMap;
  const selectedInstanceIdRef = useRef(selectedInstanceId);
  selectedInstanceIdRef.current = selectedInstanceId;
  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;
  const toolModeRef = useRef(toolMode);
  toolModeRef.current = toolMode;
  const isStudentModeRef = useRef(isStudentMode);
  isStudentModeRef.current = isStudentMode;
  const onSelectInstanceRef = useRef(onSelectInstance);
  onSelectInstanceRef.current = onSelectInstance;
  const onUpdateTransformRef = useRef(onUpdateInstanceTransform);
  onUpdateTransformRef.current = onUpdateInstanceTransform;
  const onPhysicalDockRef = useRef(onPhysicalDockInteraction);
  onPhysicalDockRef.current = onPhysicalDockInteraction;
  const onQuickLabActionRef = useRef(onQuickLabAction);
  onQuickLabActionRef.current = onQuickLabAction;
  const onDeleteInstanceRef = useRef(onDeleteInstance);
  onDeleteInstanceRef.current = onDeleteInstance;
  const onUpdateInstanceStateRef = useRef(onUpdateInstanceState);
  onUpdateInstanceStateRef.current = onUpdateInstanceState;
  const onNotifyRef = useRef(onNotify);
  onNotifyRef.current = onNotify;
  const onContinuousPourRef = useRef(onContinuousPourTransfer);
  onContinuousPourRef.current = onContinuousPourTransfer;

  const triggerDispenseVisualAnimation = useCallback(
    (targetInstanceId: string, volumeMl: number, mode: 'add' | 'set') => {
      const dispenserInst = instancesRef.current.find(
        (i) =>
          i.visible &&
          assetsMapRef.current.get(i.assetId)?.geometry.proceduralArchetype ===
            'water-dispenser',
      );
      const targetInst = instancesRef.current.find(
        (i) => i.instanceId === targetInstanceId,
      );
      if (!dispenserInst || !targetInst) return;
      const targetAsset = assetsMapRef.current.get(targetInst.assetId);
      const targetArch = targetAsset?.geometry.proceduralArchetype;
      const maxCap =
        targetArch === 'overflow-can'
          ? 210
          : targetAsset?.scientificProperties.capacity?.value ?? 100;
      const curMl =
        targetInst.instanceState.baseLiquidLevelMl ??
        targetInst.instanceState.liquidLevelMl ??
        maxCap * 0.5;
      const dispCurMl = dispenserInst.instanceState.liquidLevelMl ?? 850;
      const desiredMl =
        mode === 'set'
          ? Math.max(0, Math.min(maxCap, volumeMl))
          : Math.max(0, Math.min(maxCap, curMl + Math.min(volumeMl, dispCurMl)));
      const deltaAdded = Math.max(0, desiredMl - curMl);
      const dispEndMl = Math.max(0, dispCurMl - (mode === 'add' ? deltaAdded : 0));

      activeDispenseAnimRef.current = {
        dispenserId: dispenserInst.instanceId,
        targetId: targetInst.instanceId,
        startTimeMs: performance.now(),
        durationMs: 1050,
        dstStartScaleY: THREE.MathUtils.clamp((curMl / maxCap) / 0.5, 0.06, 2.08),
        dstEndScaleY: THREE.MathUtils.clamp((desiredMl / maxCap) / 0.5, 0.06, 2.08),
        dispStartScaleY: THREE.MathUtils.clamp((dispCurMl / 1000) / 0.5, 0.06, 2.0),
        dispEndScaleY: THREE.MathUtils.clamp((dispEndMl / 1000) / 0.5, 0.06, 2.0),
      };
      requestRenderRef.current();
    },
    [],
  );

  const triggerPourVisualAnimation = useCallback(
    (
      sourceId: string,
      targetArchetype: 'graduated-cylinder' | 'beaker-250' | 'overflow-can',
      _amountMl?: number,
    ) => {
      const srcInst = instancesRef.current.find((i) => i.instanceId === sourceId);
      const dstInst = instancesRef.current.find(
        (i) =>
          i.visible &&
          i.instanceId !== sourceId &&
          assetsMapRef.current.get(i.assetId)?.geometry.proceduralArchetype ===
            targetArchetype,
      );
      if (!srcInst || !dstInst) return;
      const srcAsset = assetsMapRef.current.get(srcInst.assetId);
      const dstAsset = assetsMapRef.current.get(dstInst.assetId);
      const srcCap =
        srcAsset?.geometry.proceduralArchetype === 'overflow-can'
          ? 210
          : srcAsset?.scientificProperties.capacity?.value ?? 100;
      const dstCap =
        dstAsset?.geometry.proceduralArchetype === 'overflow-can'
          ? 210
          : dstAsset?.scientificProperties.capacity?.value ?? 100;
      const srcCurMl =
        srcInst.instanceState.baseLiquidLevelMl ??
        srcInst.instanceState.liquidLevelMl ??
        40;
      const dstCurMl =
        dstInst.instanceState.baseLiquidLevelMl ??
        dstInst.instanceState.liquidLevelMl ??
        dstCap * 0.5;
      const maxBatch = targetArchetype === 'overflow-can' ? 50 : 20;
      const pourAmt = Math.max(0, Math.min(maxBatch, srcCurMl, dstCap - dstCurMl));
      // Nếu bình nguồn hết nước hoặc bình nhận đã đầy thì không nghiêng rót nước
      if (pourAmt <= 0.2) return;

      const ox = dstInst.transform.positionM[0];
      const oz = dstInst.transform.positionM[2];
      const kin = computeExactPourPosition(srcAsset, dstAsset, ox, oz);
      activePourAnimRef.current = {
        sourceId,
        targetId: dstInst.instanceId,
        startTimeMs: performance.now(),
        durationMs: 1120,
        pourX: kin.pourX,
        pourY: kin.pourY,
        pourZ: kin.pourZ,
        targetX: ox,
        targetRimY: kin.targetRimY,
        targetZ: oz,
        settleX: THREE.MathUtils.clamp(ox - 0.105, -BENCH_LIMIT_X, BENCH_LIMIT_X),
        settleZ: THREE.MathUtils.clamp(oz + 0.022, -BENCH_LIMIT_Z, BENCH_LIMIT_Z),
        srcStartScaleY: THREE.MathUtils.clamp((srcCurMl / srcCap) / 0.5, 0.08, 2.0),
        srcEndScaleY: THREE.MathUtils.clamp(((srcCurMl - pourAmt) / srcCap) / 0.5, 0.0, 2.0),
        dstStartScaleY: THREE.MathUtils.clamp((dstCurMl / dstCap) / 0.5, 0.08, 2.0),
        dstEndScaleY: THREE.MathUtils.clamp(((dstCurMl + pourAmt) / dstCap) / 0.5, 0.08, 2.0),
      };
      requestRenderRef.current();
    },
    [],
  );

  // Phím tắt Delete / Backspace để xóa nhanh thiết bị đang chọn trên bàn mô phỏng 3D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        (e.target as HTMLElement | null)?.isContentEditable
      ) {
        return;
      }
      const selId = selectedInstanceIdRef.current;
      if (selId && onQuickLabActionRef.current && viewModeRef.current === 'lab-scene') {
        e.preventDefault();
        setViewportContextMenu(null);
        onQuickLabActionRef.current('delete-instance', selId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [projectedLabels, setProjectedLabels] = useState<ProjectedLabel[]>([]);
  const [hoveredEquipment, setHoveredEquipment] =
    useState<HoveredEquipmentTooltip | null>(null);
  const [cameraReadout, setCameraReadout] = useState<{
    azimuthDeg: number;
    elevationDeg: number;
    distanceM: number;
  }>({ azimuthDeg: 0, elevationDeg: 28, distanceM: 0.92 });
  const [loadingCount, setLoadingCount] = useState<number>(0);
  const [simulatedError, setSimulatedError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [activeDockHint, setActiveDockHint] = useState<string | null>(null);
  const [showCylinderMagnifier, setShowCylinderMagnifier] = useState<boolean>(false);
  const [magnifierTiltDeg, setMagnifierTiltDeg] = useState<number>(0);
  const [isHoveringShelf, setIsHoveringShelf] = useState<boolean>(false);
  const isHoveringShelfRef = useRef<boolean>(false);
  const hoveredShelfXRef = useRef<number | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(() =>
    labSoundEngine.isMuted(),
  );
  const [hoveredTerminal, setHoveredTerminal] = useState<{
    instanceId: string;
    polarity: 'pos' | 'neg';
    label: string;
    screenX: number;
    screenY: number;
    isConnected: boolean;
  } | null>(null);
  const [viewportContextMenu, setViewportContextMenu] = useState<{
    instanceId: string;
    asset: AssetDefinition;
    customLabel?: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!viewportContextMenu) return;
    const closeMenu = () => setViewportContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [viewportContextMenu]);

  useEffect(() => {
    return labSoundEngine.subscribe((muted) => {
      setIsSoundMuted(muted);
    });
  }, []);

  // ===========================================================================
  // OL3D-LAB-ENVIRONMENT-SPEC v2.0 STATE: Coordinate Settings, 13 Physical Env Vars,
  // Separate Graphics Settings, Dual Clocks (Vietnam realClock + simulationClock) & Event Logs
  // ===========================================================================
  const [showEnvSpecModal, setShowEnvSpecModal] = useState<boolean>(false);
  const [isOpticsLensDrawerOpen, setIsOpticsLensDrawerOpen] = useState<boolean>(false);
  const [isOpticsAdjustDrawerOpen, setIsOpticsAdjustDrawerOpen] = useState<boolean>(false);
  const [isOpticsGuideModalOpen, setIsOpticsGuideModalOpen] = useState<boolean>(false);

  // Danh sách thiết bị tạm lưu trong Kho chứa (Cổng chuyển) & trạng thái mở Modal danh sách
  const [warehouseItems, setWarehouseItems] = useState<WarehouseStoredItem[]>([]);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState<boolean>(false);

  // Cỡ chữ hiển thị thông số đo trên các dụng cụ (Mặc định 1.25 = 125% lớn rõ, cho phép tăng/giảm từ 0.80 đến 2.20)
  const [readoutFontScale, setReadoutFontScale] = useState<number>(() => {
    if (typeof window === 'undefined') return 1.25;
    try {
      const saved = window.localStorage.getItem('ol3d_readout_font_scale_v1');
      if (saved) {
        const parsed = parseFloat(saved);
        if (!Number.isNaN(parsed) && parsed >= 0.75 && parsed <= 2.4) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return 1.25;
  });

  const updateReadoutFontScale = useCallback((nextScale: number) => {
    const clamped = Number(THREE.MathUtils.clamp(nextScale, 0.8, 2.2).toFixed(2));
    setReadoutFontScale(clamped);
    try {
      window.localStorage.setItem('ol3d_readout_font_scale_v1', String(clamped));
    } catch {
      // ignore storage errors
    }
  }, []);

  const adjustReadoutFontScale = useCallback(
    (delta: number) => {
      setReadoutFontScale((prev) => {
        const clamped = Number(THREE.MathUtils.clamp(prev + delta, 0.8, 2.2).toFixed(2));
        try {
          window.localStorage.setItem('ol3d_readout_font_scale_v1', String(clamped));
        } catch {
          // ignore storage errors
        }
        return clamped;
      });
    },
    [],
  );

  const [coordSettings, setCoordSettings] = useState<CoordinateDisplaySettings>(
    () => DEFAULT_COORDINATE_DISPLAY_SETTINGS,
  );
  const [envVars, setEnvVars] = useState<
    Record<EnvironmentVariableId, EnvironmentVariableDefinition>
  >(() => INITIAL_ENVIRONMENT_VARIABLES);
  const [graphicsSettings, setGraphicsSettings] = useState<LabGraphicsSettings>(
    () => DEFAULT_LAB_GRAPHICS_SETTINGS,
  );
  const [clockState, setClockState] = useState<LabClockState>(() => ({
    realClock: {
      ...formatVietnamDateTime(new Date()),
      timeZone: 'Asia/Ho_Chi_Minh',
    },
    simulationClock: {
      elapsedSeconds: 0,
      status: 'running',
      speedMultiplier: 1,
      lastTickEpochMs: Date.now(),
    },
  }));
  const [eventLogs, setEventLogs] = useState<LabEventLog[]>(() => {
    const initTime = formatVietnamDateTime(new Date());
    return [
      {
        eventId: 'evt-init-v2',
        eventType: 'SESSION_INIT',
        realTimestampUtc: initTime.isoUtc,
        localTimestamp: initTime.localDateTime,
        simulationElapsedSeconds: 0,
        summaryVi:
          'Khởi tạo Môi trường Phòng thí nghiệm 3D (12×8×3.6 m, Sàn y=0, Bàn thực hành y=0.82 m, Gốc O(0,0,0)).',
      },
    ];
  });
  const [customCalibrationPoint, setCustomCalibrationPoint] = useState<{
    label: string;
    worldM: [number, number, number];
  } | null>(null);
  const [distancePointA, setDistancePointA] = useState<{
    label: string;
    worldM: [number, number, number];
  }>({
    label: 'Gốc O (0, 0, 0)',
    worldM: [0, 0, 0],
  });
  const [distancePointB, setDistancePointB] = useState<{
    label: string;
    worldM: [number, number, number];
  }>({
    label: `Tâm mặt bàn (0, ${BENCH_SURFACE_Y}, 0)`,
    worldM: [0, BENCH_SURFACE_Y, 0],
  });

  const worldCoordHelperRef = useRef<THREE.Group | null>(null);

  // ===========================================================================
  // 3D VIDEO RECORDING & AUTOMATIC EXPERIMENT STEP MILESTONE ENGINE
  // ===========================================================================
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState<boolean>(false);
  const [recordingElapsedSec, setRecordingElapsedSec] = useState<number>(0);
  const [recordedMilestonesCount, setRecordedMilestonesCount] =
    useState<number>(0);
  const [completedRecordingSession, setCompletedRecordingSession] =
    useState<LabRecordingSession | null>(null);
  const [showVideoRecorderModal, setShowVideoRecorderModal] =
    useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const compositeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const compositeStreamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const recordingElapsedRef = useRef<number>(0);
  const recordingStartedAtVnRef = useRef<string>('');
  const activeMilestonesRef = useRef<RecordedStepMilestone[]>([]);
  const recentMilestoneBannerRef = useRef<{
    stepNumber: number;
    title: string;
    triggeredAtElapsedSec: number;
  } | null>(null);
  const lastAutoSignatureRef = useRef<string>('');
  const clockStateRef = useRef(clockState);
  clockStateRef.current = clockState;
  const environmentRef = useRef(environment);
  environmentRef.current = environment;
  const studentHintRef = useRef(studentCurrentHint);
  studentHintRef.current = studentCurrentHint;

  const collectLiveMeasurementChips = useCallback((): {
    chips: LabLiveMeasurementChip[];
    summaryText: string;
  } => {
    const chips: LabLiveMeasurementChip[] = [];
    for (const inst of instancesRef.current) {
      if (!inst.visible) continue;
      const asset = assetsMapRef.current.get(inst.assetId);
      if (!asset) continue;
      const arch = asset.geometry.proceduralArchetype;
      const isMeasurementDevice =
        arch === 'electronic-balance' ||
        arch === 'graduated-cylinder' ||
        arch === 'overflow-can' ||
        arch === 'beaker-250' ||
        arch === 'water-dispenser' ||
        arch === 'thermometer' ||
        arch === 'spring-dynamometer' ||
        arch === 'vernier-caliper' ||
        arch === 'digital-multimeter' ||
        arch === 'galvanometer' ||
        arch === 'semicircular-slab' ||
        arch === 'optical-microscope' ||
        Boolean(htmlEquipmentModuleRegistry.getModule(asset.assetId));

      if (!isMeasurementDevice) continue;
      const { readoutBadge, isDigitalScale } = computeLiveEquipmentReadout(
        inst,
        asset,
      );
      if (readoutBadge) {
        chips.push({
          label: inst.customLabel || asset.name.vi,
          valueText: readoutBadge,
          isHighlight:
            isDigitalScale || inst.instanceId === selectedInstanceIdRef.current,
        });
      }
    }
    const summaryText =
      chips.length > 0
        ? chips.map((c) => `${c.label}: ${c.valueText}`).join(' · ')
        : 'Đang quan sát bố cục bàn thí nghiệm';
    return { chips, summaryText };
  }, []);

  const recordStepMilestoneInternal = useCallback(
    (stepTitle: string, silent = false) => {
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      if (!renderer || !scene || !camera) return;

      const { summaryText } = collectLiveMeasurementChips();
      const nextStepNum = activeMilestonesRef.current.length + 1;
      const elapsed = recordingElapsedRef.current;
      const vnNow = formatVietnamDateTime(new Date()).localDateTime;

      const thumbUrl = captureMilestoneThumbnail({
        webglCanvas: renderer.domElement,
        renderer,
        scene,
        camera,
        experimentTitle: environmentRef.current.name.vi,
        stepNumber: nextStepNum,
        stepTitle,
        measurementsSummary: summaryText,
        elapsedSec: elapsed,
      });

      const milestone: RecordedStepMilestone = {
        id: `ms-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        stepNumber: nextStepNum,
        elapsedSec: Number(elapsed.toFixed(1)),
        realTimeVn: vnNow,
        title: stepTitle,
        measurementsSummary: summaryText,
        thumbnailDataUrl: thumbUrl,
      };

      activeMilestonesRef.current = [...activeMilestonesRef.current, milestone];
      setRecordedMilestonesCount(activeMilestonesRef.current.length);
      recentMilestoneBannerRef.current = {
        stepNumber: nextStepNum,
        title: stepTitle,
        triggeredAtElapsedSec: elapsed,
      };

      if (!silent) {
        labSoundEngine.play('camera-shutter', 0.85);
        onNotify(
          `Đã lưu Bước ${nextStepNum} (${formatRecTime(elapsed)}): ${stepTitle}`,
          'info',
        );
      }
    },
    [collectLiveMeasurementChips, onNotify],
  );

  const handleStartVideoRecording = useCallback(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) {
      onNotify('Khung nhìn 3D chưa sẵn sàng để ghi hình.', 'warning');
      return;
    }

    try {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      const compCanvas = document.createElement('canvas');
      compCanvas.width = 1280;
      compCanvas.height = 720;
      compositeCanvasRef.current = compCanvas;
      const compCtx = compCanvas.getContext('2d');

      recordedChunksRef.current = [];
      activeMilestonesRef.current = [];
      recordingElapsedRef.current = 0;
      setRecordingElapsedSec(0);
      setRecordedMilestonesCount(0);
      const vnStart = formatVietnamDateTime(new Date()).localDateTime;
      recordingStartedAtVnRef.current = vnStart;

      // Vẽ khung hình đầu tiên trước khi khởi động MediaRecorder
      renderer.render(scene, camera);
      if (compCtx) {
        const { chips } = collectLiveMeasurementChips();
        drawCompositeRecordingFrame({
          ctx: compCtx,
          width: 1280,
          height: 720,
          webglCanvas: renderer.domElement,
          experimentTitle: environmentRef.current.name.vi,
          realTimeVn: vnStart,
          simTimeText: formatSimulationDuration(
            clockStateRef.current.simulationClock.elapsedSeconds,
          ),
          recordingElapsedSec: 0,
          currentStepHint: studentHintRef.current,
          liveChips: chips,
          recentMilestone: null,
          includeHudOverlay: true,
        });
      }

      // Chụp tự động Bước 1 (Bố trí ban đầu)
      recordStepMilestoneInternal(
        studentHintRef.current
          ? `Khởi đầu: ${studentHintRef.current}`
          : 'Bước khởi đầu — Bố trí dụng cụ thí nghiệm trên bàn',
        true,
      );

      const { chips: initChips, summaryText: initSummary } =
        collectLiveMeasurementChips();
      lastAutoSignatureRef.current = `${studentHintRef.current || ''}|${initSummary}|${initChips.length}`;

      const stream = compCanvas.captureStream(30);
      try {
        const audioTracks = labSoundEngine.getRecordingAudioTracks();
        audioTracks.forEach((track) => stream.addTrack(track));
      } catch {
        // Ignore if audio track attachment is not supported
      }
      compositeStreamRef.current = stream;
      labSoundEngine.play('record-start', 0.9);

      const { mimeType } = getSupportedVideoMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: 4_500_000,
          })
        : new MediaRecorder(stream);

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          recordedChunksRef.current.push(ev.data);
        }
      };

      recorder.onstop = () => {
        const { mimeType: defaultMime, fileExtension } =
          getSupportedVideoMimeType();
        const finalMime = recorder.mimeType || defaultMime || 'video/webm';
        const blob =
          recordedChunksRef.current.length > 0
            ? new Blob(recordedChunksRef.current, { type: finalMime })
            : null;
        const url = blob ? URL.createObjectURL(blob) : null;

        const finalSession: LabRecordingSession = {
          sessionId: `rec-${Date.now()}`,
          experimentTitle: environmentRef.current.name.vi,
          startedAtVn: recordingStartedAtVnRef.current,
          durationSec: Math.max(1, Math.round(recordingElapsedRef.current)),
          videoBlob: blob,
          videoUrl: url,
          mimeType: finalMime,
          fileExtension,
          milestones: [...activeMilestonesRef.current],
        };

        setCompletedRecordingSession(finalSession);
        setShowVideoRecorderModal(true);
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecordingVideo(true);
      setIsRecordingPaused(false);

      // Vòng lặp 30 FPS cập nhật khung hình tổng hợp (3D + Băng thông số dụng cụ)
      let lastTickMs = performance.now();
      recordingTimerRef.current = window.setInterval(() => {
        const nowMs = performance.now();
        const dtSec = Math.min(0.2, Math.max(0, (nowMs - lastTickMs) / 1000));
        lastTickMs = nowMs;

        const rec = mediaRecorderRef.current;
        if (!rec || rec.state !== 'recording') return;

        recordingElapsedRef.current += dtSec;
        setRecordingElapsedSec(Math.floor(recordingElapsedRef.current));

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
          const ctx2d = compositeCanvasRef.current?.getContext('2d');
          if (ctx2d) {
            const { chips } = collectLiveMeasurementChips();
            drawCompositeRecordingFrame({
              ctx: ctx2d,
              width: 1280,
              height: 720,
              webglCanvas: rendererRef.current.domElement,
              experimentTitle: environmentRef.current.name.vi,
              realTimeVn: clockStateRef.current.realClock.localDateTime,
              simTimeText: formatSimulationDuration(
                clockStateRef.current.simulationClock.elapsedSeconds,
              ),
              recordingElapsedSec: recordingElapsedRef.current,
              currentStepHint: studentHintRef.current,
              liveChips: chips,
              recentMilestone: recentMilestoneBannerRef.current,
              includeHudOverlay: true,
            });
          }
        }
      }, 33);

      onNotify(
        'Đang ghi hình thực hành 3D! Các bước thao tác dụng cụ sẽ được tự động đánh dấu để xuất Video Tóm Tắt.',
        'success',
      );
    } catch (err) {
      onNotify(
        `Không thể khởi động trình ghi hình: ${err instanceof Error ? err.message : 'Trình duyệt không hỗ trợ'}`,
        'error',
      );
    }
  }, [collectLiveMeasurementChips, onNotify, recordStepMilestoneInternal]);

  const handlePauseResumeVideoRecording = useCallback(() => {
    const rec = mediaRecorderRef.current;
    if (!rec) return;
    if (rec.state === 'recording') {
      rec.pause();
      setIsRecordingPaused(true);
      onNotify('Đã tạm dừng ghi hình thực hành.', 'info');
    } else if (rec.state === 'paused') {
      rec.resume();
      setIsRecordingPaused(false);
      onNotify('Tiếp tục ghi hình thực hành.', 'info');
    }
  }, [onNotify]);

  const handleStopVideoRecording = useCallback(() => {
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    // Chụp bước tổng kết cuối cùng trước khi dừng nếu thời lượng > 2 giây
    if (recordingElapsedRef.current > 2.0) {
      recordStepMilestoneInternal(
        'Hoàn tất thao tác — Ghi nhận trạng thái & số liệu cuối cùng trên bàn',
        true,
      );
    }

    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== 'inactive') {
      rec.stop();
    }
    if (compositeStreamRef.current) {
      compositeStreamRef.current.getTracks().forEach((t) => t.stop());
      compositeStreamRef.current = null;
    }

    setIsRecordingVideo(false);
    setIsRecordingPaused(false);
    labSoundEngine.play('record-stop', 0.9);
    onNotify(
      'Đã dừng ghi hình! Mở Studio Xem Lại & Xuất Video Tóm Tắt Quá Trình.',
      'success',
    );
  }, [onNotify, recordStepMilestoneInternal]);

  // Tự động phát hiện khi số liệu dụng cụ đo trên bàn thay đổi hoặc học sinh chuyển bước hướng dẫn trong lúc đang ghi hình
  useEffect(() => {
    if (!isRecordingVideo || isRecordingPaused) return;
    const { chips, summaryText } = collectLiveMeasurementChips();
    const nextSignature = `${studentCurrentHint || ''}|${summaryText}|${chips.length}`;
    if (nextSignature === lastAutoSignatureRef.current) return;

    const prevSig = lastAutoSignatureRef.current;
    lastAutoSignatureRef.current = nextSignature;

    const timer = window.setTimeout(() => {
      if (!isRecordingVideo || isRecordingPaused) return;
      const prevParts = prevSig.split('|');
      const hintChanged = prevParts[0] !== (studentCurrentHint || '');
      const activeInst = instancesRef.current.find(
        (i) => i.instanceId === selectedInstanceIdRef.current,
      );
      const activeAsset = activeInst
        ? assetsMapRef.current.get(activeInst.assetId)
        : undefined;

      const autoTitle =
        hintChanged && studentCurrentHint
          ? `Bước hướng dẫn: ${studentCurrentHint}`
          : activeAsset
            ? `Thao tác với ${activeInst?.customLabel || activeAsset.name.vi}`
            : 'Cập nhật phép đo trên bàn thí nghiệm';

      recordStepMilestoneInternal(autoTitle, false);
    }, 380);

    return () => window.clearTimeout(timer);
  }, [
    instances,
    studentCurrentHint,
    isRecordingVideo,
    isRecordingPaused,
    collectLiveMeasurementChips,
    recordStepMilestoneInternal,
  ]);

  // Dọn dẹp bộ hẹn giờ ghi hình khi unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        window.clearInterval(recordingTimerRef.current);
      }
      if (compositeStreamRef.current) {
        compositeStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const appendLabEventLog = useCallback(
    (
      eventType: string,
      summaryVi: string,
      payload?: Record<string, unknown>,
    ) => {
      const nowInfo = formatVietnamDateTime(new Date());
      setEventLogs((prev) => [
        {
          eventId: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          eventType,
          realTimestampUtc: nowInfo.isoUtc,
          localTimestamp: nowInfo.localDateTime,
          simulationElapsedSeconds: clockState.simulationClock.elapsedSeconds,
          summaryVi,
          payload,
        },
        ...prev.slice(0, 49),
      ]);
    },
    [clockState.simulationClock.elapsedSeconds],
  );

  // Dual Clocks Timer: Updates realClock (Vietnam Asia/Ho_Chi_Minh) & simulationClock independently without re-rendering Three.js
  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = new Date();
      const vn = formatVietnamDateTime(now);
      setClockState((prev) => {
        let nextElapsed = prev.simulationClock.elapsedSeconds;
        let nextLastTick = prev.simulationClock.lastTickEpochMs;
        if (prev.simulationClock.status === 'running') {
          const prevTick = prev.simulationClock.lastTickEpochMs ?? now.getTime();
          // Controlled delta-time clamped to 1.0s max per tick so tab sleep doesn't jump hours
          const rawDeltaSec = Math.min(
            1.0,
            Math.max(0, (now.getTime() - prevTick) / 1000),
          );
          nextElapsed =
            prev.simulationClock.elapsedSeconds +
            rawDeltaSec * prev.simulationClock.speedMultiplier;
          nextLastTick = now.getTime();
        }
        return {
          realClock: {
            ...vn,
            timeZone: 'Asia/Ho_Chi_Minh',
          },
          simulationClock: {
            ...prev.simulationClock,
            elapsedSeconds: nextElapsed,
            lastTickEpochMs: nextLastTick,
          },
        };
      });
    }, 250);
    return () => window.clearInterval(timer);
  }, []);

  const handleSimClockAction = useCallback(
    (action: 'start' | 'pause' | 'resume' | 'reset') => {
      setClockState((prev) => {
        const nowMs = Date.now();
        if (action === 'start' || action === 'resume') {
          return {
            ...prev,
            simulationClock: {
              ...prev.simulationClock,
              status: 'running',
              lastTickEpochMs: nowMs,
            },
          };
        }
        if (action === 'pause') {
          return {
            ...prev,
            simulationClock: {
              ...prev.simulationClock,
              status: 'paused',
              lastTickEpochMs: null,
            },
          };
        }
        return {
          ...prev,
          simulationClock: {
            ...prev.simulationClock,
            elapsedSeconds: 0,
            lastTickEpochMs:
              prev.simulationClock.status === 'running' ? nowMs : null,
          },
        };
      });
      appendLabEventLog(
        `SIM_CLOCK_${action.toUpperCase()}`,
        `Đồng hồ mô phỏng: Thực hiện lệnh "${action.toUpperCase()}" (Giờ thực Việt Nam không bị ảnh hưởng).`,
      );
    },
    [appendLabEventLog],
  );

  const handleSimClockSpeed = useCallback(
    (speed: number) => {
      setClockState((prev) => ({
        ...prev,
        simulationClock: {
          ...prev.simulationClock,
          speedMultiplier: speed,
          lastTickEpochMs: Date.now(),
        },
      }));
      appendLabEventLog(
        'SIM_CLOCK_SPEED',
        `Đổi hệ số tốc độ đồng hồ mô phỏng sang ${speed}×.`,
        { speedMultiplier: speed },
      );
    },
    [appendLabEventLog],
  );

  const handleUpdateCoordSettings = useCallback(
    (patch: Partial<CoordinateDisplaySettings>) => {
      setCoordSettings((prev) => {
        const next = { ...prev, ...patch };
        const helper = worldCoordHelperRef.current;
        if (helper) {
          const flGrid = helper.getObjectByName('coord_floor_grid');
          if (flGrid) flGrid.visible = next.showFloorGrid;
          const spGrid = helper.getObjectByName('coord_space_grid');
          if (spGrid) spGrid.visible = next.showSpaceGrid;
          const minGrid = helper.getObjectByName('coord_minor_grid');
          if (minGrid) minGrid.visible = next.showMinorGrid;
          const ax = helper.getObjectByName('coord_world_axes');
          if (ax) ax.visible = next.showWorldAxes;
          const orig = helper.getObjectByName('coord_origin_marker');
          if (orig) orig.visible = next.showOriginMarker;
          const lbl = helper.getObjectByName('coord_axis_labels');
          if (lbl) lbl.visible = next.showAxisLabels;
          const tks = helper.getObjectByName('coord_numeric_ticks');
          if (tks) tks.visible = next.showNumericTicks;
          requestRenderRef.current();
        }
        return next;
      });
    },
    [],
  );

  const handleUpdateGraphicsSettings = useCallback(
    (patch: Partial<LabGraphicsSettings>) => {
      setGraphicsSettings((prev) => {
        const next = { ...prev, ...patch };
        const scene = sceneRef.current;
        if (scene) {
          const hemi = scene.getObjectByName(
            'env_hemi_light',
          ) as THREE.HemisphereLight | null;
          if (hemi) hemi.intensity = next.ambientLightStrength;
          const keyL = scene.getObjectByName(
            'env_key_light',
          ) as THREE.DirectionalLight | null;
          if (keyL) keyL.intensity = next.keyLightStrength;
          const walls = scene.getObjectByName('room_walls_group');
          if (walls) {
            walls.traverse((obj) => {
              if ((obj as THREE.Mesh).isMesh) {
                const m = (obj as THREE.Mesh)
                  .material as THREE.MeshStandardMaterial;
                m.transparent = next.wallsTransparent;
                m.opacity = next.wallsTransparent ? 0.42 : 1.0;
                m.needsUpdate = true;
              }
            });
          }
          const ceil = scene.getObjectByName('room_ceiling_mesh');
          if (ceil) ceil.visible = next.ceilingVisible;
          requestRenderRef.current();
        }
        return next;
      });
    },
    [],
  );

  const handleUpdateEnvVar = useCallback(
    (id: EnvironmentVariableId, rawVal: number) => {
      const def = envVars[id];
      if (!def) return;
      const clampedVal = Math.max(def.min, Math.min(def.max, rawVal));
      setEnvVars((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          value: clampedVal,
          verificationSource: 'user-adjusted',
        },
      }));

      // Mục 7: Chỉ cập nhật các thiết bị có đăng ký environmentDependencies
      if (id === 'gravityMps2' && onUpdateInstanceState) {
        const dynInst = instances.find(
          (i) =>
            assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
            'spring-dynamometer',
        );
        if (dynInst) {
          const hookedItems = instances.filter(
            (item) =>
              item.visible &&
              item.instanceState.attachedToInstanceId === dynInst.instanceId &&
              item.instanceState.attachmentSlot === 'dynamometer-hook',
          );
          let totalMassG = 0;
          hookedItems.forEach((h) => {
            totalMassG +=
              assetsMap.get(h.assetId)?.scientificProperties.referenceMass
                ?.value ?? 66.25;
          });
          if (totalMassG > 0) {
            const nextForceN = Number(
              ((totalMassG / 1000) * clampedVal).toFixed(2),
            );
            onUpdateInstanceState(
              dynInst.instanceId,
              { springExtensionN: nextForceN },
              `Biến môi trường gravityMps2 = ${clampedVal} m/s² → Trọng lượng trên Lực kế P = m·g = ${nextForceN} N`,
            );
          }
        }
      } else if (id === 'airTemperatureC' && onUpdateInstanceState) {
        const thermInst = instances.find(
          (i) =>
            assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
              'thermometer' && !i.instanceState.attachedToInstanceId,
        );
        if (thermInst) {
          onUpdateInstanceState(
            thermInst.instanceId,
            { temperatureC: clampedVal },
            `Biến môi trường airTemperatureC = ${clampedVal} °C → Nhiệt kế ngoài không khí cập nhật ${clampedVal.toFixed(1)} °C`,
          );
        }
      } else if (id === 'oxygenPct' && onUpdateInstanceState) {
        const burnerInst = instances.find(
          (i) =>
            assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
            'alcohol-burner',
        );
        if (burnerInst && clampedVal < 14 && burnerInst.instanceState.isHeating) {
          onUpdateInstanceState(
            burnerInst.instanceId,
            { isHeating: false },
            `Nồng độ O₂ giảm xuống ${clampedVal}% (< 14%) → Ngọn lửa đèn cồn tự động tắt!`,
          );
        }
      }

      appendLabEventLog(
        'ENV_VAR_CHANGE',
        `Cập nhật biến vật lý ${def.nameVi} (${id}) = ${clampedVal} ${def.unit}.`,
        { variableId: id, value: clampedVal, unit: def.unit },
      );
    },
    [envVars, instances, assetsMap, onUpdateInstanceState, appendLabEventLog],
  );

  const handleResetEnvVars = useCallback(() => {
    setEnvVars(INITIAL_ENVIRONMENT_VARIABLES);
    appendLabEventLog(
      'ENV_VAR_RESET',
      'Khôi phục toàn bộ 13 biến môi trường vật lý về giá trị cấu hình mặc định.',
    );
    onNotify('Đã khôi phục 13 biến môi trường vật lý về mặc định.', 'info');
  }, [appendLabEventLog, onNotify]);

  const [isTopViewActive, setIsTopViewActive] = useState<boolean>(false);
  const [isWaterValveOpenUI, setIsWaterValveOpenUI] = useState<boolean>(false);
  const [valveTargetInstanceId, setValveTargetInstanceId] = useState<string>('');
  const [valveInputMl, setValveInputMl] = useState<string>('25');

  // Mobile & Desktop UX states: Collapsible Floating Tools, Optional Coord HUD, Compass toggle, and 3-State Device Bottom Sheet
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState<boolean>(false);
  const [showMobileCoordHud, setShowMobileCoordHud] = useState<boolean>(false);
  const [isCompassHudExpanded, setIsCompassHudExpanded] = useState<boolean>(false);
  const [isTopRightToolbarCollapsed, setIsTopRightToolbarCollapsed] =
    useState<boolean>(false);
  const [isRightToolbarCollapsed, setIsRightToolbarCollapsed] =
    useState<boolean>(false);
  const [deviceSheetMode, setDeviceSheetMode] = useState<
    'collapsed' | 'compact' | 'detail'
  >('compact');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showDeviceControlModal, setShowDeviceControlModal] = useState<boolean>(false);
  const [localDetailedGuides, setLocalDetailedGuides] = useState<boolean>(false);
  const isDetailedGuideOn =
    showDetailedGuides !== undefined ? showDetailedGuides : localDetailedGuides;
  const handleToggleDetailedGuides = useCallback(() => {
    if (onToggleDetailedGuides) {
      onToggleDetailedGuides();
    } else {
      setLocalDetailedGuides((v) => !v);
    }
  }, [onToggleDetailedGuides]);
  const deviceSheetModeRef = useRef(deviceSheetMode);
  deviceSheetModeRef.current = deviceSheetMode;

  // Khi người dùng chọn một thiết bị mới trên bàn 3D, luôn mở ở chế độ thanh ngang gọn nhất dưới đáy và đóng các ngăn phụ
  useEffect(() => {
    setConfirmDeleteId(null);
    setShowDeviceControlModal(false);
    setIsOpticsLensDrawerOpen(false);
    setIsOpticsAdjustDrawerOpen(false);
    setIsOpticsGuideModalOpen(false);
    setIsWaterValveOpenUI(false);
    if (selectedInstanceId) {
      setDeviceSheetMode('compact');
    }
  }, [selectedInstanceId]);

  const updateProjectedOverlays = useCallback(() => {
    // Không cập nhật state React liên tục trong khi đang kéo vật thể để tránh re-render DOM gây chớp màn hình
    if (dragStateRef.current.isDragging) return;

    const camera = cameraRef.current;
    const mount = mountRef.current;
    const orbit = orbitRef.current;
    if (!camera || !mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    if (width === 0 || height === 0) return;

    const isMobileViewport = width < 768;

    if (orbit && !isStudentModeRef.current) {
      const dx = camera.position.x - orbit.target.x;
      const dy = camera.position.y - orbit.target.y;
      const dz = camera.position.z - orbit.target.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const az = Math.round(THREE.MathUtils.radToDeg(Math.atan2(dx, dz)));
      const el = Math.round(
        THREE.MathUtils.radToDeg(
          Math.asin(THREE.MathUtils.clamp(dy / Math.max(0.001, dist), -1, 1)),
        ),
      );
      setCameraReadout((prev) =>
        prev.azimuthDeg === az &&
        prev.elevationDeg === el &&
        Math.abs(prev.distanceM - dist) < 0.02
          ? prev
          : {
              azimuthDeg: az,
              elevationDeg: el,
              distanceM: Number(dist.toFixed(2)),
            },
      );
    }

    if (viewModeRef.current === 'single-asset') {
      setProjectedLabels((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    const nextLabels: ProjectedLabel[] = [];
    for (const inst of instancesRef.current) {
      if (!inst.visible || !inst.labelVisible) continue;
      const obj = instanceObjectsRef.current.get(inst.instanceId);
      const asset = assetsMapRef.current.get(inst.assetId);
      if (!obj || !asset) continue;

      const isSelected = inst.instanceId === selectedInstanceIdRef.current;
      // Nếu vật mẫu đang nằm trên đĩa cân, thả chìm trong ống đong/bình tràn, hoặc đã cất lên Khu trưng bày ('shelf')
      // và không được chọn trực tiếp, ẩn nhãn tĩnh trên bàn để không rối mắt (rê chuột vẫn hiện đầy đủ Tooltip!).
      if (inst.instanceState.attachmentSlot === 'shelf' && !isSelected) {
        continue;
      }
      const isAttachedChild =
        Boolean(inst.instanceState.attachedToInstanceId) &&
        inst.instanceState.attachmentSlot &&
        inst.instanceState.attachmentSlot !== 'bench' &&
        inst.instanceState.attachmentSlot !== 'dispenser-outlet';
      if (isAttachedChild && !isSelected) continue;

      const { readoutBadge, isDigitalScale, interactionHint } =
        computeLiveEquipmentReadout(inst, asset);

      // Trên màn hình điện thoại (< 768px), chỉ hiển thị nhãn của thiết bị đang chọn và dụng cụ đo có số liệu trực tiếp để tránh rối mắt
      if (isMobileViewport && !isSelected && !isDigitalScale) {
        continue;
      }

      const bboxH = asset.geometry.boundingBoxM.height;
      _projVec.set(
        obj.position.x,
        obj.position.y + bboxH + 0.032,
        obj.position.z,
      );
      _projVec.project(camera);

      // Kiểm tra thiết bị nằm trong frustum phía trước camera (-1 <= z <= 1)
      if (_projVec.z < -1 || _projVec.z > 1) continue;
      const sx = ((_projVec.x + 1) / 2) * width;
      const sy = ((-_projVec.y + 1) / 2) * height;

      if (sx < 8 || sx > width - 8 || sy < 8 || sy > height - 8) continue;

      // Khi đang mở bảng Chi tiết thiết bị trên điện thoại, ẩn các nhãn không được chọn ở nửa dưới màn hình
      if (
        isMobileViewport &&
        deviceSheetModeRef.current === 'detail' &&
        !isSelected &&
        sy > height * 0.48
      ) {
        continue;
      }

      nextLabels.push({
        instanceId: inst.instanceId,
        assetId: inst.assetId,
        symbol: getEquipmentSymbol(asset),
        title: inst.customLabel || asset.name.vi,
        readoutBadge,
        isDigitalScale,
        interactionHint,
        archetype: asset.geometry.proceduralArchetype,
        subtitle: `${asset.assetId} · v${inst.assetVersion}`,
        x: Math.round(sx),
        y: Math.round(sy),
        isSelected,
        isLocked: inst.locked,
      });
    }

    // Chống đè nhãn 2D: ưu tiên dụng cụ đang chọn và dụng cụ có màn hình số giữ nguyên toạ độ, đẩy nhẹ nhãn bị trùng
    for (let i = 0; i < nextLabels.length; i++) {
      for (let j = i + 1; j < nextLabels.length; j++) {
        const a = nextLabels[i];
        const b = nextLabels[j];
        if (Math.abs(a.x - b.x) < 118 && Math.abs(a.y - b.y) < 30) {
          if (b.isSelected || (b.isDigitalScale && !a.isDigitalScale)) {
            a.y = Math.max(24, b.y - 32);
          } else {
            b.y = Math.max(24, a.y - 32);
          }
        }
      }
    }

    // Chỉ gọi setProjectedLabels khi vị trí hoặc trạng thái nhãn thực sự thay đổi >= 2px
    setProjectedLabels((prev) => {
      if (prev.length !== nextLabels.length) return nextLabels;
      for (let i = 0; i < prev.length; i++) {
        const a = prev[i];
        const b = nextLabels[i];
        if (
          a.instanceId !== b.instanceId ||
          a.isSelected !== b.isSelected ||
          a.title !== b.title ||
          a.readoutBadge !== b.readoutBadge ||
          Math.abs(a.x - b.x) >= 2 ||
          Math.abs(a.y - b.y) >= 2
        ) {
          return nextLabels;
        }
      }
      return prev;
    });
  }, []);

  // 1. Initialize Three.js WebGLRenderer, Daylight Lab Scene, OrbitControls & Direct Physical Manipulation
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    openLabAssetLoader.setSoftwareGlMode(isSoftwareGl);

    const width = mount.clientWidth || 880;
    const height = mount.clientHeight || 590;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#182436');
    scene.fog = new THREE.FogExp2('#182436', 0.14);
    sceneRef.current = scene;

    // Studio PBR Environment reflections via RoomEnvironment + PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.02, 35);
    // Khởi tạo ngay lập tức góc nhìn Mặc định (Toàn bàn) với góc nghiêng chuẩn theo ảnh và mặt bàn rộng 0.975m
    const initialAspect = width / height;
    const tanHalfVFov = Math.tan(THREE.MathUtils.degToRad(21)); // fov = 42 deg
    const tanHalfHFov = tanHalfVFov * Math.max(0.65, initialAspect);
    const initDist = THREE.MathUtils.clamp(1.32 / tanHalfHFov + 0.38, 2.05, 3.55);
    camera.position.set(
      0.0,
      BENCH_SURFACE_Y + 0.08 + initDist * 0.5,
      initDist * 0.866,
    );
    cameraRef.current = camera;

    // FPS-Grade Studio PBR Lighting Rig:
    // 1. Dịu mắt, phân bổ ánh sáng đều khắp không gian phòng thí nghiệm
    const hemiLight = new THREE.HemisphereLight(0xf8fafc, 0x1e293b, 1.05);
    hemiLight.name = 'env_hemi_light';
    scene.add(hemiLight);

    // 2. Nguồn sáng chính Key Light chiếu xiên đổ bóng sắc nét chuẩn PBR (2048x2048 Soft PCF)
    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.3);
    keyLight.name = 'env_key_light';
    keyLight.position.set(-0.75, BENCH_SURFACE_Y + 1.55, 0.85);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.2;
    keyLight.shadow.camera.far = 6.0;
    const d = 1.35;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0002;
    keyLight.shadow.normalBias = 0.015;
    scene.add(keyLight);

    // 3. Nguồn sáng phụ Fill Light làm sáng vùng khuất
    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.85);
    fillLight.name = 'env_rim_light';
    fillLight.position.set(0.95, BENCH_SURFACE_Y + 0.95, 0.70);
    scene.add(fillLight);

    // 4. Nguồn sáng ngược Fresnel Rim Light (chuẩn game FPS) tạo viền sáng tách khối đồ vật khỏi phông nền
    const fresnelRimLight = new THREE.DirectionalLight(0xa5f3fc, 0.95);
    fresnelRimLight.name = 'env_fresnel_rim';
    fresnelRimLight.position.set(0.0, BENCH_SURFACE_Y + 1.20, -0.95);
    scene.add(fresnelRimLight);

    // Build Standard 12×8×3.6m Lab Room (Floor at y = 0) & 2.40×0.75m Wood Bench (Top at y = 0.82m)
    const woodTex = createWoodBenchTexture();
    const benchTopMat = new THREE.MeshStandardMaterial({
      map: woodTex,
      color: 0xecb984,
      roughness: 0.38,
      metalness: 0.05,
    });
    benchTopMat.name = 'bench_top_mat';
    const benchGroup = buildDaylightScienceClassroom(benchTopMat);
    scene.add(benchGroup);
    benchGroupRef.current = benchGroup;

    // Duy nhất 1 Hệ Trục Góc Bàn Cố Định O(0,0,0) (X, Y thuộc cạnh bàn, Z đứng) + Lưới Bàn & Lưới Không Gian
    const worldCoordHelper = buildWorldCoordinatesAndGridHelper(
      DEFAULT_LAB_ROOM_CONFIG,
      DEFAULT_COORDINATE_DISPLAY_SETTINGS,
    );
    scene.add(worldCoordHelper);
    worldCoordHelperRef.current = worldCoordHelper;

    // Selection Highlight Box & Cyan Bench Ring (at y = BENCH_SURFACE_Y + 0.002 m)
    const dummyBox = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1));
    const boxHelper = new THREE.BoxHelper(dummyBox, 0x00bceb);
    boxHelper.visible = false;
    scene.add(boxHelper);
    selectionBoxHelperRef.current = boxHelper;

    const ringGeo = new THREE.PlaneGeometry(0.14, 0.14);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      map: getFuturisticNeonZoneTexture(),
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.36,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    const selectionRing = new THREE.Mesh(ringGeo, ringMat);
    selectionRing.position.y = BENCH_SURFACE_Y + 0.002;
    selectionRing.visible = false;
    scene.add(selectionRing);
    selectionRingRef.current = selectionRing;

    // Magnetic Snap Target Ring (Thin Dashed Translucent Neon Green #22C55E when hovering a valid lab station)
    const snapRingGeo = new THREE.PlaneGeometry(0.16, 0.16);
    snapRingGeo.rotateX(-Math.PI / 2);
    const snapRingMat = new THREE.MeshBasicMaterial({
      map: getFuturisticNeonZoneTexture(),
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
    });
    const snapTargetRing = new THREE.Mesh(snapRingGeo, snapRingMat);
    snapTargetRing.position.y = BENCH_SURFACE_Y + 0.003;
    snapTargetRing.visible = false;
    scene.add(snapTargetRing);
    snapTargetRingRef.current = snapTargetRing;

    // 🌀 CỔNG CHUYỂN KHÔNG GIAN (TRANSPORTER PORTAL)
    // Đặt trên mặt bàn bên cạnh trục Oy để gửi đồ trở lại kho lưu trữ / xóa thiết bị khỏi bàn thực hành
    const transporterPortalGroup = createTransporterPortalGroup();
    scene.add(transporterPortalGroup);
    transporterPortalRef.current = transporterPortalGroup;

    // 🧠 VÙNG ĐÓN ĐẶT THIẾT BỊ HOLOGRAPHIC TỪ MẠNG NƠ-RON
    const neuralPlacementGroup = createNeuralPlacementTargetGroup();
    scene.add(neuralPlacementGroup);
    neuralPlacementTargetRef.current = neuralPlacementGroup;

    // 3D High-Graphics Flowing Liquid Stream Group (strictly hidden unless actively pouring!)
    const pouringStreamGroup = new THREE.Group();
    pouringStreamGroup.name = 'active_pouring_stream_group';
    pouringStreamGroup.visible = false;

    const pourOuterMat = new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc, // Xanh nhạt ngọc lam trong suốt
      attenuationColor: new THREE.Color(0x0284c7),
      attenuationDistance: 0.08,
      transmission: 0.62,
      roughness: 0.012,
      metalness: 0.01,
      ior: 1.333,
      reflectivity: 0.98,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    });
    // Dòng nước co thắt khí động học: phần đỉnh dày 3.6mm, phần đuôi thon nhỏ 1.8mm do gia tốc trọng trường
    const pourOuterMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0018, 0.0036, 0.14, 20),
      pourOuterMat,
    );
    pourOuterMesh.name = 'pour_outer';
    pourOuterMesh.renderOrder = 6;
    pouringStreamGroup.add(pourOuterMesh);

    const pourCoreMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0010, 0.0020, 0.14, 14),
      new THREE.MeshBasicMaterial({
        color: 0xf8fafc,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
    );
    pourCoreMesh.name = 'pour_core';
    pourCoreMesh.renderOrder = 7;
    pouringStreamGroup.add(pourCoreMesh);

    const pourDropGeo = new THREE.SphereGeometry(0.0026, 12, 12);
    for (let d = 0; d < 12; d++) {
      const drop = new THREE.Mesh(pourDropGeo, pourOuterMat);
      drop.name = `pour_drop_${d}`;
      drop.scale.set(0.85, 1.4, 0.85);
      drop.renderOrder = 7;
      pouringStreamGroup.add(drop);
    }

    // 3 Vòng sóng va chạm đồng tâm đa pha khi dòng nước tiếp xúc mặt chất lỏng
    for (let r = 0; r < 3; r++) {
      const splash = new THREE.Mesh(
        new THREE.RingGeometry(0.003 + r * 0.006, 0.007 + r * 0.008, 28).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({
          color: r === 0 ? 0xf0f9ff : (r === 1 ? 0xbae6fd : 0x7dd3fc),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.88 - r * 0.22,
          depthWrite: false,
        }),
      );
      splash.name = `pour_splash_${r}`;
      splash.renderOrder = 7;
      pouringStreamGroup.add(splash);
    }

    // Vũng nước loang tràn trên mặt bàn khi rót ra ngoài (spill puddle)
    const spillPuddleGeo = new THREE.CircleGeometry(0.045, 36);
    spillPuddleGeo.rotateX(-Math.PI / 2);
    const spillPuddleMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0f9ff,
      attenuationColor: new THREE.Color(0x7dd3fc),
      attenuationDistance: 0.12,
      transmission: 0.90,
      roughness: 0.02,
      ior: 1.333,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const spillPuddleMesh = new THREE.Mesh(spillPuddleGeo, spillPuddleMat);
    spillPuddleMesh.name = 'bench_spill_puddle';
    spillPuddleMesh.position.set(0, BENCH_SURFACE_Y + 0.0006, 0);
    spillPuddleMesh.visible = false;
    scene.add(spillPuddleMesh);

    scene.add(pouringStreamGroup);
    pouringStreamRef.current = pouringStreamGroup;

    // =========================================================================
    // TINKERCAD-STYLE 3D GIZMO GROUP:
    // 1. Mũi tên di chuyển độ cao (▲/▼) đặt tách biệt PHÍA TRÊN đỉnh thiết bị (không nằm trong lòng thiết bị)
    // 2. Vòng quay 360° theo chiều đứng (Vertical Tilt Ring) hiện rõ nét + Cặp mũi tên xoay nghiêng
    // 3. Vòng quay 360° theo mặt bàn (Horizontal Table Ring) hiện rõ nét + Cặp mũi tên xoay ngang
    // * QUAN TRỌNG: Chỉ khi chọn đúng vào MŨI TÊN của vòng xoay thì mới xoay; bấm vào thiết bị thì di chuyển bám chuột!
    // =========================================================================
    const tinkercadGizmoGroup = new THREE.Group();
    tinkercadGizmoGroup.name = 'tinkercad_gizmo_group';
    tinkercadGizmoGroup.visible = false;

    // 1A. Vertical Elevation Arrow Subgroup (Đặt hoàn toàn PHÍA TRÊN thiết bị)
    const verticalArrowGroup = new THREE.Group();
    verticalArrowGroup.name = 'tinkercad_vertical_arrow_group';

    const vArrowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      opacity: 0.94,
    });
    vArrowMat.name = 'v_arrow_mat';

    // Trụ nối mảnh từ đỉnh thiết bị lên cụm mũi tên độ cao
    const vConnectorStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0012, 0.0012, 0.024, 8),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        opacity: 0.55,
      }),
    );
    vConnectorStem.position.y = -0.022;
    vConnectorStem.renderOrder = 20;
    verticalArrowGroup.add(vConnectorStem);

    const vArrowShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0024, 0.0024, 0.026, 14),
      vArrowMat,
    );
    vArrowShaft.position.y = 0.006;
    vArrowShaft.renderOrder = 24;
    vArrowShaft.userData.tinkercadHandle = 'elevate-y';
    verticalArrowGroup.add(vArrowShaft);

    const vArrowConeUp = new THREE.Mesh(
      new THREE.ConeGeometry(0.0105, 0.023, 20),
      vArrowMat,
    );
    vArrowConeUp.position.y = 0.028;
    vArrowConeUp.renderOrder = 25;
    vArrowConeUp.userData.tinkercadHandle = 'elevate-y';
    verticalArrowGroup.add(vArrowConeUp);

    const vArrowConeDown = new THREE.Mesh(
      new THREE.ConeGeometry(0.0075, 0.014, 16),
      vArrowMat,
    );
    vArrowConeDown.rotation.x = Math.PI;
    vArrowConeDown.position.y = -0.009;
    vArrowConeDown.renderOrder = 25;
    vArrowConeDown.userData.tinkercadHandle = 'elevate-y';
    verticalArrowGroup.add(vArrowConeDown);

    // Vùng bắt chuột riêng cho mũi tên độ cao phía trên đỉnh thiết bị
    const vArrowHitbox = new THREE.Mesh(
      new THREE.CylinderGeometry(0.026, 0.026, 0.068, 12),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false,
      }),
    );
    vArrowHitbox.position.y = 0.012;
    vArrowHitbox.renderOrder = 28;
    vArrowHitbox.userData.tinkercadHandle = 'elevate-y';
    verticalArrowGroup.add(vArrowHitbox);

    tinkercadGizmoGroup.add(verticalArrowGroup);

    // Trụ chỉ báo độ cao từ mặt bàn lên đáy thiết bị khi thiết bị đang trên không
    const altStemGeo = new THREE.CylinderGeometry(0.0012, 0.0012, 1, 8);
    const altStemMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.42,
      depthTest: true,
      depthWrite: false,
    });
    const altStemMesh = new THREE.Mesh(altStemGeo, altStemMat);
    altStemMesh.name = 'tinkercad_altitude_stem';
    altStemMesh.renderOrder = 8;
    altStemMesh.visible = false;
    tinkercadGizmoGroup.add(altStemMesh);

    // 1B. VÒNG QUAY 360° THEO CHIỀU ĐỨNG (Vertical 360° Tilt Ring)
    // Vòng tròn 360° hiện rõ nét, lõi trong suốt. Bản thân vòng KHÔNG chặn chuột để di chuyển vật mượt mà;
    // CHỈ khi bấm đúng vào MŨI TÊN XOAY trên vòng thì mới nghiêng bình!
    const tiltRingGroup = new THREE.Group();
    tiltRingGroup.name = 'tinkercad_tilt_ring_group';

    const arcRadius = 0.095;

    const holoProtractorMat = new THREE.MeshBasicMaterial({
      map: getFuturisticNeonProtractorTexture(),
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.84,
      depthTest: true,
      depthWrite: false,
    });
    const holoProtractorDisc = new THREE.Mesh(
      new THREE.RingGeometry(arcRadius * 0.80, arcRadius * 1.06, 72),
      holoProtractorMat,
    );
    holoProtractorDisc.name = 'neon_protractor_disc';
    holoProtractorDisc.renderOrder = 6;
    // KHÔNG gán userData.tinkercadHandle cho vành tròn để không cản trở thao tác nắm kéo thân thiết bị!
    tiltRingGroup.add(holoProtractorDisc);

    // Gắn 2 Cụm Mũi Tên Xoay 2 Chiều (Trái & Phải) trên Vòng Quay Đứng 360°
    const handleRadiusVert = arcRadius * 0.92;
    tiltRingGroup.add(
      createCurvedRotationArrowHandle(
        'tilt-pour',
        handleRadiusVert,
        Math.PI * 0.20, // Góc phải trên (36°)
        0x00f0ff,
      ),
    );
    tiltRingGroup.add(
      createCurvedRotationArrowHandle(
        'tilt-pour',
        handleRadiusVert,
        Math.PI * 0.80, // Góc trái trên (144°)
        0x00f0ff,
      ),
    );

    tinkercadGizmoGroup.add(tiltRingGroup);

    // 1C. VÒNG QUAY 360° THEO MẶT BÀN (Horizontal 360° Table Yaw Ring)
    // Vòng tròn 360° nằm song song mặt bàn hiện rõ nét, kèm cặp mũi tên xoay ngang.
    // CHỈ khi bấm đúng vào MŨI TÊN XOAY trên vòng mặt bàn thì mới xoay hướng thiết bị!
    const yawRingGroup = new THREE.Group();
    yawRingGroup.name = 'tinkercad_yaw_ring_group';

    const yawRadius = 0.098;
    const yawProtractorMat = new THREE.MeshBasicMaterial({
      map: getFuturisticNeonProtractorTexture(),
      color: 0x22d3ee,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.82,
      depthTest: true,
      depthWrite: false,
    });
    const yawProtractorDisc = new THREE.Mesh(
      new THREE.RingGeometry(yawRadius * 0.80, yawRadius * 1.06, 72).rotateX(
        -Math.PI / 2,
      ),
      yawProtractorMat,
    );
    yawProtractorDisc.name = 'neon_yaw_disc';
    yawProtractorDisc.renderOrder = 5;
    yawRingGroup.add(yawProtractorDisc);

    // Khung chứa 2 Cụm Mũi Tên Xoay trên mặt phẳng ngang (XZ) của Vòng Quay Mặt Bàn
    const yawArrowsPlane = new THREE.Group();
    yawArrowsPlane.rotation.x = -Math.PI / 2;
    const handleRadiusHoriz = yawRadius * 0.92;
    // Đặt ở phía trước bên phải (-55°) và phía trước bên trái (-125°) hướng về phía người dùng
    yawArrowsPlane.add(
      createCurvedRotationArrowHandle(
        'rotate-y',
        handleRadiusHoriz,
        -Math.PI * 0.32,
        0x2dd4bf,
      ),
    );
    yawArrowsPlane.add(
      createCurvedRotationArrowHandle(
        'rotate-y',
        handleRadiusHoriz,
        -Math.PI * 0.68,
        0x2dd4bf,
      ),
    );
    yawRingGroup.add(yawArrowsPlane);

    tinkercadGizmoGroup.add(yawRingGroup);
    scene.add(tinkercadGizmoGroup);
    tinkercadGizmoRef.current = tinkercadGizmoGroup;

    // 1D. Surrounding Proximity Zone Rings Group around all Liquid Vessels on the Workbench
    const vesselZonesGroup = new THREE.Group();
    vesselZonesGroup.name = 'vessel_proximity_zones_group';
    scene.add(vesselZonesGroup);
    vesselZonesGroupRef.current = vesselZonesGroup;

    // 1E. Live 3D Optical Bench Ray-Tracing, Power Cables & Virtual Image Ghost Group
    const opticalAssemblyGroup = new THREE.Group();
    opticalAssemblyGroup.name = 'optical_bench_assembly_group';
    scene.add(opticalAssemblyGroup);
    opticalAssemblyGroupRef.current = opticalAssemblyGroup;

    // 1F. Live 3D Rubberband Dynamic Wire Dragging Group
    const dynamicWireGroup = new THREE.Group();
    dynamicWireGroup.name = 'dynamic_wire_drag_group';
    scene.add(dynamicWireGroup);
    dynamicWireDragGroupRef.current = dynamicWireGroup;

    // 1G. Live 3D Contextual Neural Synapse Beams Group (AR Neural Guide)
    const neuralSynapseBeamGroup = new THREE.Group();
    neuralSynapseBeamGroup.name = 'neural_synapse_beam_group';
    scene.add(neuralSynapseBeamGroup);
    neuralSynapseBeamGroupRef.current = neuralSynapseBeamGroup;

    // OrbitControls: Bật chế độ Phóng to / Thu nhỏ lấy con trỏ chuột làm tâm (zoomToCursor = true)
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = !isSoftwareGl;
    orbit.dampingFactor = 0.08;
    orbit.zoomToCursor = true;
    orbit.minDistance = 0.22;
    orbit.maxDistance = 12.5;
    orbit.maxPolarAngle = Math.PI / 2 - 0.02;
    orbit.target.set(0, BENCH_SURFACE_Y + 0.05, -0.01);
    orbit.update();
    orbitRef.current = orbit;

    // Developer & Visual Audit Inspection Hook for Multi-Angle PBR Screenshots
    if (typeof window !== 'undefined') {
      (window as unknown as { __openlabAudit?: Record<string, unknown> }).__openlabAudit = {
        camera,
        orbit,
        scene,
        renderer,
        benchSurfaceY: BENCH_SURFACE_Y,
        setCameraView: (camX: number, camY: number, camZ: number, tgtX = 0, tgtY = BENCH_SURFACE_Y + 0.05, tgtZ = -0.01) => {
          camera.position.set(camX, camY, camZ);
          orbit.target.set(tgtX, tgtY, tgtZ);
          orbit.update();
          renderer.render(scene, camera);
        },
      };
    }

    let lastResetTime = 0;

    // Cancel scripted camera preset transition if user manually orbits or scrolls mouse wheel
    orbit.addEventListener('start', () => {
      if (performance.now() - lastResetTime < 450) return;
      cameraGoalPosRef.current = null;
      cameraGoalTargetRef.current = null;
    });
    renderer.domElement.addEventListener(
      'wheel',
      () => {
        if (performance.now() - lastResetTime < 450) return;
        cameraGoalPosRef.current = null;
        cameraGoalTargetRef.current = null;
      },
      { passive: true },
    );

    // TransformControls (Used only when explicitly in 'rotate' mode or Teacher gizmo mode)
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.setSize(0.65);
    transformControls.showY = false;
    const tcHelper = (transformControls as unknown as { getHelper?: () => THREE.Object3D })
      .getHelper
      ? (transformControls as unknown as { getHelper: () => THREE.Object3D }).getHelper()
      : (transformControls as unknown as THREE.Object3D);
    scene.add(tcHelper);
    transformRef.current = transformControls;

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (gl.flush) gl.flush();
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const poll = () => {
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        renderDirty = false;
        const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
        lastTime = now;

        let needsMoreFrames = false;

        // A. Smooth Camera Preset Interpolation
        if (cameraGoalPosRef.current && cameraGoalTargetRef.current) {
          camera.position.x = THREE.MathUtils.damp(
            camera.position.x,
            cameraGoalPosRef.current.x,
            10,
            dt,
          );
          camera.position.y = THREE.MathUtils.damp(
            camera.position.y,
            cameraGoalPosRef.current.y,
            10,
            dt,
          );
          camera.position.z = THREE.MathUtils.damp(
            camera.position.z,
            cameraGoalPosRef.current.z,
            10,
            dt,
          );
          orbit.target.x = THREE.MathUtils.damp(
            orbit.target.x,
            cameraGoalTargetRef.current.x,
            10,
            dt,
          );
          orbit.target.y = THREE.MathUtils.damp(
            orbit.target.y,
            cameraGoalTargetRef.current.y,
            10,
            dt,
          );
          orbit.target.z = THREE.MathUtils.damp(
            orbit.target.z,
            cameraGoalTargetRef.current.z,
            10,
            dt,
          );

          if (
            camera.position.distanceTo(cameraGoalPosRef.current) < 0.003 &&
            orbit.target.distanceTo(cameraGoalTargetRef.current) < 0.003
          ) {
            cameraGoalPosRef.current = null;
            cameraGoalTargetRef.current = null;
          } else {
            needsMoreFrames = true;
          }
        }

        // B. Smooth Direct Object Dragging (Bám chuột 1:1 mượt mà, dễ dàng) & Momentum Tilt Kinematics
        const ds = dragStateRef.current;
        if (ds.isDragging && ds.instanceId) {
          const draggedObj = instanceObjectsRef.current.get(ds.instanceId);
          if (draggedObj) {
            const prevX = draggedObj.position.x;
            const prevZ = draggedObj.position.z;
            const nextX = THREE.MathUtils.damp(
              draggedObj.position.x,
              ds.targetPos.x,
              95,
              dt,
            );
            const nextY = THREE.MathUtils.damp(
              draggedObj.position.y,
              ds.targetPos.y,
              42,
              dt,
            );
            const nextZ = THREE.MathUtils.damp(
              draggedObj.position.z,
              ds.targetPos.z,
              95,
              dt,
            );

            const vx = (nextX - prevX) / Math.max(0.004, dt);
            const vz = (nextZ - prevZ) / Math.max(0.004, dt);
            draggedObj.position.set(nextX, nextY, nextZ);

            const draggedInst = instancesRef.current.find((i) => i.instanceId === ds.instanceId);
            const draggedAsset = draggedInst ? assetsMapRef.current.get(draggedInst.assetId) : undefined;
            const draggedArch = draggedAsset?.geometry.proceduralArchetype;
            const customDraggedMod = draggedAsset ? htmlEquipmentModuleRegistry.getModule(draggedAsset.assetId) : null;
            const isLiquidContainer =
              (draggedArch === 'graduated-cylinder' ||
                draggedArch === 'beaker-250' ||
                draggedArch === 'overflow-can' ||
                draggedArch === 'erlenmeyer-flask' ||
                draggedArch === 'porcelain-dish' ||
                draggedArch === 'distillation-flask') &&
              Boolean(customDraggedMod ? customDraggedMod.moduleControls.canHoldLiquid !== false : true);

            // CHỈ bình chứa chất lỏng thực thụ mới có động học nghiêng nhẹ khi di chuyển & uốn mặt nước
            if (isLiquidContainer) {
              const targetTiltZ =
                ds.hoverSlot === 'pour-liquid'
                  ? -0.24
                  : THREE.MathUtils.clamp(-vx * 0.14, -0.16, 0.16);
              const targetTiltX =
                ds.hoverSlot === 'pour-liquid'
                  ? 0
                  : THREE.MathUtils.clamp(vz * 0.14, -0.16, 0.16);
              draggedObj.rotation.z = THREE.MathUtils.damp(
                draggedObj.rotation.z,
                targetTiltZ,
                14,
                dt,
              );
              draggedObj.rotation.x = THREE.MathUtils.damp(
                draggedObj.rotation.x,
                targetTiltX,
                14,
                dt,
              );

              // Deform internal liquid surface by natural gravity & hydrostatics
              syncHydrostaticLiquidToGravity(
                draggedObj,
                undefined,
                now,
                THREE.MathUtils.clamp(-vx * 0.06, -0.08, 0.08),
              );
            } else {
              // Thiết bị cơ học (đòn bẩy, giá đỡ, thước cặp, lực kế) TUYỆT ĐỐI đứng thẳng, không nghiêng đổ nước
              draggedObj.rotation.z = THREE.MathUtils.damp(draggedObj.rotation.z, 0, 24, dt);
              draggedObj.rotation.x = THREE.MathUtils.damp(draggedObj.rotation.x, 0, 24, dt);
            }

            // Khi đưa vào Khu trưng bày ('shelf'), thu nhỏ tượng trưng (0.46x) để nằm gọn trên kệ kính mờ 20cm
            const goalScale = ds.hoverSlot === 'shelf' ? 0.46 : 1.0;
            const nextScale = THREE.MathUtils.damp(
              draggedObj.scale.x,
              goalScale,
              16,
              dt,
            );
            draggedObj.scale.set(nextScale, nextScale, nextScale);

            // Làm sáng viền Khu trưng bày khi đang kéo vật thể bay vào vùng kệ sát trục X
            const shelfBorder = benchGroupRef.current?.getObjectByName(
              'display_zone_glow_border',
            ) as THREE.LineSegments | undefined;
            if (
              shelfBorder &&
              shelfBorder.material instanceof THREE.LineBasicMaterial
            ) {
              shelfBorder.material.opacity = ds.hoverSlot === 'shelf' ? 0.95 : 0.42;
              shelfBorder.material.color.setHex(
                ds.hoverSlot === 'shelf' ? 0x22c55e : 0x38bdf8,
              );
            }

            if (pouringStreamRef.current) {
              pouringStreamRef.current.visible = false;
            }

            if (selectionRingRef.current) {
              selectionRingRef.current.position.set(
                nextX,
                BENCH_SURFACE_Y + (ds.hoverSlot === 'shelf' ? 0.118 : 0.002),
                nextZ,
              );
            }

            if (
              draggedObj.position.distanceTo(ds.targetPos) > 0.001 ||
              Math.abs(draggedObj.scale.x - goalScale) > 0.005
            ) {
              needsMoreFrames = true;
            }
          }
        } else {
          // Check if an animated pouring sequence is active (from drag release or quick pour button)
          const pourAnim = activePourAnimRef.current;
          if (pourAnim) {
            const elapsed = performance.now() - pourAnim.startTimeMs;
            const progress = Math.min(1, elapsed / pourAnim.durationMs);
            const srcObj = instanceObjectsRef.current.get(pourAnim.sourceId);
            const dstObj = instanceObjectsRef.current.get(pourAnim.targetId);

            if (srcObj && progress < 1) {
              // Phase 1 (0..0.20): Lift & tilt to pour angle; Phase 2 (0.20..0.82): Hold tilt & stream water down; Phase 3 (0.82..1.0): Return upright
              const tiltEnvelope =
                progress < 0.2
                  ? progress / 0.2
                  : progress < 0.82
                    ? 1
                    : 1 - (progress - 0.82) / 0.18;
              const goalX =
                progress < 0.82
                  ? pourAnim.pourX
                  : THREE.MathUtils.lerp(pourAnim.pourX, pourAnim.settleX, (progress - 0.82) / 0.18);
              const goalY =
                BENCH_SURFACE_Y +
                (progress < 0.82
                  ? pourAnim.pourY
                  : THREE.MathUtils.lerp(pourAnim.pourY, 0, (progress - 0.82) / 0.18));
              const goalZ =
                progress < 0.82
                  ? pourAnim.pourZ
                  : THREE.MathUtils.lerp(pourAnim.pourZ, pourAnim.settleZ, (progress - 0.82) / 0.18);

              srcObj.position.x = THREE.MathUtils.damp(srcObj.position.x, goalX, 22, dt);
              srcObj.position.y = THREE.MathUtils.damp(srcObj.position.y, goalY, 22, dt);
              srcObj.position.z = THREE.MathUtils.damp(srcObj.position.z, goalZ, 22, dt);
              srcObj.rotation.y = THREE.MathUtils.damp(srcObj.rotation.y, 0, 18, dt);
              srcObj.rotation.z = THREE.MathUtils.damp(
                srcObj.rotation.z,
                -0.95 * tiltEnvelope,
                18,
                dt,
              );

              // Smoothly drain source liquid_surface and fill target liquid_surface during the stream phase
              // while keeping both water surfaces strictly horizontal under Earth's gravity!
              const pourFlowFrac = THREE.MathUtils.clamp((progress - 0.16) / 0.66, 0, 1);
              const curSrcScaleY = THREE.MathUtils.lerp(
                pourAnim.srcStartScaleY,
                pourAnim.srcEndScaleY,
                pourFlowFrac,
              );
              syncHydrostaticLiquidToGravity(srcObj, curSrcScaleY, now, 0);

              let dstSurfaceWorldY =
                BENCH_SURFACE_Y + Math.max(0.028, pourAnim.targetRimY * 0.45);
              if (dstObj) {
                const curDstScaleY = THREE.MathUtils.lerp(
                  pourAnim.dstStartScaleY,
                  pourAnim.dstEndScaleY,
                  pourFlowFrac,
                );
                syncHydrostaticLiquidToGravity(dstObj, curDstScaleY, now, 0);
                dstObj.updateMatrixWorld(true);
                const dstLiqSurf = dstObj.getObjectByName('liquid_surface');
                const surfCap = dstLiqSurf?.getObjectByName('surface_cap');
                if (surfCap) {
                  surfCap.getWorldPosition(_surfaceWorldPos);
                  dstSurfaceWorldY = _surfaceWorldPos.y;
                }
              }

              if (pouringStreamRef.current) {
                if (progress >= 0.16 && progress <= 0.84) {
                  srcObj.updateMatrixWorld(true);
                  const lipNode =
                    srcObj.getObjectByName('pouring_lip') ??
                    srcObj.getObjectByName('beaker_spout') ??
                    srcObj.getObjectByName('spout_water') ??
                    srcObj.getObjectByName('measurement_anchor');
                  if (lipNode) {
                    lipNode.getWorldPosition(_lipWorldPos);
                  } else {
                    _lipWorldPos.set(
                      srcObj.position.x + 0.044,
                      srcObj.position.y - 0.008,
                      srcObj.position.z,
                    );
                  }

                  const targetPos = new THREE.Vector3(
                    pourAnim.targetX,
                    dstSurfaceWorldY,
                    pourAnim.targetZ,
                  );
                  renderGravitationalFluidStream({
                    streamGrp: pouringStreamRef.current,
                    spoutPos: _lipWorldPos,
                    targetPos,
                    targetSurfaceY: dstSurfaceWorldY,
                    now,
                    flowRateMlPerSec: 35,
                    isDrippingOnly: false,
                  });
                  if (Math.random() < 0.04) {
                    labSoundEngine.play('water-pour', 0.6);
                  }
                } else {
                  pouringStreamRef.current.visible = false;
                }
              }
              needsMoreFrames = true;
            } else {
              if (srcObj) {
                srcObj.rotation.z = 0;
                const liqSurf = srcObj.getObjectByName('liquid_surface');
                if (liqSurf) liqSurf.rotation.z = 0;
              }
              if (pouringStreamRef.current) {
                pouringStreamRef.current.visible = false;
              }
              const finishedPour = activePourAnimRef.current;
              activePourAnimRef.current = null;
              if (finishedPour) {
                for (const id of [finishedPour.sourceId, finishedPour.targetId]) {
                  const inst = instancesRef.current.find((i) => i.instanceId === id);
                  const obj = instanceObjectsRef.current.get(id);
                  const asset = inst ? assetsMapRef.current.get(inst.assetId) : undefined;
                  if (inst && obj && asset) {
                    applyInstanceStateToObject3D(obj, inst, asset);
                  }
                }
              }
              needsMoreFrames = true;
            }
          }

          // B2. Smooth Water Dispenser Valve Filling Animation (`activeDispenseAnimRef`)
          const dispAnim = activeDispenseAnimRef.current;
          if (dispAnim) {
            const elapsed = performance.now() - dispAnim.startTimeMs;
            const progress = Math.min(1, elapsed / dispAnim.durationMs);
            const dispObj = instanceObjectsRef.current.get(dispAnim.dispenserId);
            const dstObj = instanceObjectsRef.current.get(dispAnim.targetId);
            if (progress < 1) {
              const flowFrac = THREE.MathUtils.smoothstep(progress, 0.05, 0.92);
              if (dstObj) {
                const curScaleY = THREE.MathUtils.lerp(
                  dispAnim.dstStartScaleY,
                  dispAnim.dstEndScaleY,
                  flowFrac,
                );
                syncHydrostaticLiquidToGravity(dstObj, curScaleY, now, 0);
              }
              if (dispObj) {
                const curDispY = THREE.MathUtils.lerp(
                  dispAnim.dispStartScaleY,
                  dispAnim.dispEndScaleY,
                  flowFrac,
                );
                syncHydrostaticLiquidToGravity(dispObj, curDispY, now, 0);
              }
              needsMoreFrames = true;
            } else {
              const finishedDisp = activeDispenseAnimRef.current;
              activeDispenseAnimRef.current = null;
              if (finishedDisp) {
                for (const id of [finishedDisp.dispenserId, finishedDisp.targetId]) {
                  const inst = instancesRef.current.find((i) => i.instanceId === id);
                  const obj = instanceObjectsRef.current.get(id);
                  const asset = inst ? assetsMapRef.current.get(inst.assetId) : undefined;
                  if (inst && obj && asset) {
                    applyInstanceStateToObject3D(obj, inst, asset);
                  }
                }
              }
              needsMoreFrames = true;
            }
          }

          // C. Animate Active Spout Streams (Overflow Can, Water Dispenser, Separatory Funnel) at 60fps ONLY when isValveOpen === true
          for (const inst of instancesRef.current) {
            if (!inst.visible || !inst.instanceState.isValveOpen) continue;
            const obj = instanceObjectsRef.current.get(inst.instanceId);
            if (!obj) continue;
            const spoutStream = obj.getObjectByName('spout_stream');
            if (spoutStream && spoutStream.visible) {
              needsMoreFrames = true;
              const pulse = 0.9 + 0.16 * Math.sin(now * 0.028);
              const outer = spoutStream.getObjectByName('stream_outer');
              const core = spoutStream.getObjectByName('stream_core');
              const arch = assetsMapRef.current.get(inst.assetId)?.geometry.proceduralArchetype;

              let dynamicSplashLocalY = 0.038;
              let dynamicStreamLen = 0.212;
              if (arch === 'water-dispenser') {
                // Find any receiving vessel positioned under the dispenser nozzle and match its exact rising water surface!
                const rotY = inst.transform.rotationRad[1] ?? 0;
                const spoutWorldX = inst.transform.positionM[0] + Math.cos(rotY) * 0.095;
                const spoutWorldZ = inst.transform.positionM[2] - Math.sin(rotY) * 0.095;
                const dockedVessel = instancesRef.current.find(
                  (v) =>
                    v.visible &&
                    v.instanceId !== inst.instanceId &&
                    Math.hypot(
                      v.transform.positionM[0] - spoutWorldX,
                      v.transform.positionM[2] - spoutWorldZ,
                    ) < 0.065,
                );
                if (dockedVessel) {
                  const vObj = instanceObjectsRef.current.get(dockedVessel.instanceId);
                  const vSurfCap = vObj
                    ?.getObjectByName('liquid_surface')
                    ?.getObjectByName('surface_cap');
                  if (vObj && vSurfCap) {
                    vObj.updateMatrixWorld(true);
                    vSurfCap.getWorldPosition(_surfaceWorldPos);
                    dynamicSplashLocalY = Math.max(
                      0.018,
                      Math.min(0.235, _surfaceWorldPos.y - BENCH_SURFACE_Y),
                    );
                    dynamicStreamLen = Math.max(0.025, 0.250 - dynamicSplashLocalY);
                  }
                }
                if (outer) {
                  outer.position.set(
                    0.095,
                    0.250 - dynamicStreamLen * 0.5,
                    0,
                  );
                  outer.scale.set(pulse, dynamicStreamLen / 0.212, pulse);
                }
                if (core) {
                  core.position.set(
                    0.095,
                    0.250 - dynamicStreamLen * 0.5,
                    0,
                  );
                  core.scale.set(pulse * 0.9, dynamicStreamLen / 0.212, pulse * 0.9);
                }
              } else if (outer) {
                outer.scale.set(1, 1, pulse);
              }

              for (let d = 0; d < 6; d++) {
                const drop = spoutStream.getObjectByName(`droplet_${d}`);
                if (!drop) continue;
                const t = ((now * 0.0040 + d / 6) % 1);
                if (arch === 'overflow-can') {
                  // Parabolic trajectory from spout tip (0.085, 0.125, 0) to catch beaker (0.122, 0.024, 0)
                  drop.position.set(
                    0.085 + t * 0.037,
                    0.125 - t * t * 0.101,
                    0,
                  );
                } else if (arch === 'water-dispenser') {
                  drop.position.set(0.095, 0.248 - t * dynamicStreamLen, 0);
                } else if (arch === 'separatory-funnel') {
                  drop.position.set(0, 0.086 - t * 0.066, 0);
                }
              }
              for (let r = 0; r < 2; r++) {
                const splash = spoutStream.getObjectByName(`splash_ring_${r}`) as THREE.Mesh | undefined;
                if (splash) {
                  const rPhase = ((now * 0.0036 + r * 0.5) % 1);
                  const sScale = 0.65 + rPhase * 1.15;
                  if (arch === 'water-dispenser') {
                    splash.position.set(0.095, dynamicSplashLocalY + 0.001 + r * 0.001, 0);
                  }
                  splash.scale.set(sScale, sScale, 1);
                  if (splash.material instanceof THREE.MeshBasicMaterial) {
                    splash.material.opacity = (1 - rPhase) * 0.88;
                  }
                }
              }
            }
          }

          // D. TINKERCAD-STYLE VERTICAL ELEVATION ('elevate-y'), TABLE YAW ('rotate-y') & CIRCULAR TILT-POUR ('tilt-pour') KINEMATICS
          const tcDrag = tinkercadDragRef.current;
          if (tcDrag.mode && tcDrag.instanceId) {
            const tcObj = instanceObjectsRef.current.get(tcDrag.instanceId);
            const tcInst = instancesRef.current.find(
              (i) => i.instanceId === tcDrag.instanceId,
            );
            const tcAsset = tcInst
              ? assetsMapRef.current.get(tcInst.assetId)
              : undefined;
            if (tcObj && tcInst && tcAsset) {
              needsMoreFrames = true;
              if (tcDrag.mode === 'elevate-y') {
                const goalWorldY = BENCH_SURFACE_Y + tcDrag.targetLocalY;
                tcObj.position.y = THREE.MathUtils.damp(
                  tcObj.position.y,
                  goalWorldY,
                  48,
                  dt,
                );
              } else if (tcDrag.mode === 'rotate-y') {
                tcObj.rotation.y = THREE.MathUtils.damp(
                  tcObj.rotation.y,
                  tcDrag.targetYawRad,
                  36,
                  dt,
                );
              } else if (tcDrag.mode === 'tilt-pour') {
                const srcArch = tcAsset.geometry.proceduralArchetype;
                const srcMod = htmlEquipmentModuleRegistry.getModule(tcAsset.assetId);
                const isSrcVessel =
                  (srcArch === 'graduated-cylinder' ||
                    srcArch === 'beaker-250' ||
                    srcArch === 'overflow-can' ||
                    srcArch === 'erlenmeyer-flask' ||
                    srcArch === 'porcelain-dish' ||
                    srcArch === 'distillation-flask') &&
                  Boolean(srcMod ? srcMod.moduleControls.canHoldLiquid !== false : true);

                if (!isSrcVessel) {
                  // Hủy chế độ rót ngay lập tức nếu đối tượng không phải bình chứa chất lỏng
                  tcDrag.mode = null;
                  tcObj.rotation.z = 0;
                  return;
                }

                const prevRotZ = tcObj.rotation.z;
                tcObj.rotation.z = THREE.MathUtils.damp(
                  tcObj.rotation.z,
                  tcDrag.targetTiltRad,
                  20,
                  dt,
                );
                const angularVelZ = (tcObj.rotation.z - prevRotZ) / Math.max(0.004, dt);
                const sloshWaveZ = THREE.MathUtils.clamp(-angularVelZ * 0.025, -0.09, 0.09);

                const srcCap =
                  srcArch === 'overflow-can'
                    ? 210
                    : tcAsset.scientificProperties.capacity?.value ?? 100;
                const curScaleY = THREE.MathUtils.clamp(
                  tcDrag.liveSourceMl / Math.max(1, srcCap) / 0.5,
                  0,
                  2.05,
                );

                // Apply hydrostatic gravity deformation so the liquid surface stays strictly horizontal
                // and shifts toward the downward-tilted pouring wall!
                const hydro = syncHydrostaticLiquidToGravity(
                  tcObj,
                  curScaleY,
                  now,
                  sloshWaveZ,
                );
                const absTilt = Math.abs(tcObj.rotation.z);
                const pourThresholdRad = hydro.pourThresholdRad;

                // Compute world position of the vessel's pouring lip depending on tilt direction
                tcObj.updateMatrixWorld(true);
                const tiltDir = tcObj.rotation.z <= 0 ? 1 : -1;
                const bboxW = tcAsset.geometry.boundingBoxM.width ?? 0.08;
                const bboxH = tcAsset.geometry.boundingBoxM.height ?? 0.14;
                const lipNode =
                  tcObj.getObjectByName('pouring_lip') ??
                  tcObj.getObjectByName('beaker_spout') ??
                  tcObj.getObjectByName('spout_water') ??
                  tcObj.getObjectByName('measurement_anchor');
                if (lipNode && tiltDir > 0) {
                  lipNode.getWorldPosition(_lipWorldPos);
                } else {
                  _lipWorldPos.set(tiltDir * (bboxW * 0.46), bboxH * 0.92, 0);
                  tcObj.localToWorld(_lipWorldPos);
                }

                // Look for any receiving liquid vessel whose surrounding zone ring contains this vessel/lip
                let bestReceiver: {
                  inst: SceneInstance;
                  asset: AssetDefinition;
                  obj: THREE.Group;
                  dist: number;
                  rimWorldY: number;
                } | null = null;

                for (const other of instancesRef.current) {
                  if (
                    other.instanceId === tcInst.instanceId ||
                    !other.visible ||
                    other.instanceState.attachmentSlot === 'shelf'
                  ) {
                    continue;
                  }
                  const otherAsset = assetsMapRef.current.get(other.assetId);
                  const otherObj = instanceObjectsRef.current.get(other.instanceId);
                  if (!otherAsset || !otherObj) continue;
                  const oArch = otherAsset.geometry.proceduralArchetype;
                  const oMod = htmlEquipmentModuleRegistry.getModule(
                    otherAsset.assetId,
                  );
                  const isReceiver =
                    oArch === 'graduated-cylinder' ||
                    oArch === 'beaker-250' ||
                    oArch === 'overflow-can' ||
                    oArch === 'erlenmeyer-flask' ||
                    oArch === 'porcelain-dish' ||
                    oArch === 'distillation-flask' ||
                    Boolean(oMod?.moduleControls.canHoldLiquid);
                  if (!isReceiver) continue;

                  const distFromLip = Math.hypot(
                    _lipWorldPos.x - otherObj.position.x,
                    _lipWorldPos.z - otherObj.position.z,
                  );
                  const distFromCenter = Math.hypot(
                    tcObj.position.x - otherObj.position.x,
                    tcObj.position.z - otherObj.position.z,
                  );
                  const effDist = Math.min(distFromLip, distFromCenter);
                  if (effDist < 0.165) {
                    const oHeight =
                      otherAsset.geometry.boundingBoxM.height ?? 0.14;
                    const rimWorldY = otherObj.position.y + oHeight * 0.92;
                    if (!bestReceiver || effDist < bestReceiver.dist) {
                      bestReceiver = {
                        inst: other,
                        asset: otherAsset,
                        obj: otherObj,
                        dist: effDist,
                        rimWorldY,
                      };
                    }
                  }
                }

                // Effective pouring height of the source vessel (consistent with surrounding zone ring check)
                const srcEffectiveSpoutWorldY = tcObj.position.y + bboxH * 0.72;

                // Gravity pouring condition: water pours out the instant the tilted horizontal surface reaches the lip!
                const maxRetainedMl = THREE.MathUtils.clamp(
                  hydro.maxRetainedScaleY * 0.5 * srcCap,
                  0,
                  srcCap,
                );
                const hydrostaticExcessMl = Math.max(
                  0,
                  tcDrag.liveSourceMl - maxRetainedMl,
                );

                if (
                  (hydro.isReachingLip || absTilt > pourThresholdRad) &&
                  tcDrag.liveSourceMl > 0.1
                ) {
                  const excessRad = Math.max(0.02, absTilt - pourThresholdRad);
                  const flowRateMlPerSec = Math.max(
                    16 + excessRad * 48,
                    hydrostaticExcessMl * 3.8,
                  );

                  if (bestReceiver) {
                    // Check height constraint: pouring vessel must be lifted high enough above receiving vessel's rim
                    if (srcEffectiveSpoutWorldY >= bestReceiver.rimWorldY - 0.015) {
                      const dstArch =
                        bestReceiver.asset.geometry.proceduralArchetype;
                      const dstCap =
                        dstArch === 'overflow-can'
                          ? 210
                          : bestReceiver.asset.scientificProperties.capacity
                              ?.value ?? 100;

                      if (tcDrag.activeTargetId !== bestReceiver.inst.instanceId) {
                        tcDrag.activeTargetId = bestReceiver.inst.instanceId;
                        const initDstMl =
                          bestReceiver.inst.instanceState.baseLiquidLevelMl ??
                          bestReceiver.inst.instanceState.liquidLevelMl ??
                          dstCap * 0.5;
                        tcDrag.initialTargetMl = initDstMl;
                        tcDrag.liveTargetMl = initDstMl;
                      }

                      const availRoom = Math.max(0, dstCap - tcDrag.liveTargetMl);
                      const dPour = Math.min(
                        tcDrag.liveSourceMl,
                        availRoom,
                        flowRateMlPerSec * dt,
                      );

                      if (dPour > 0.001) {
                        tcDrag.liveSourceMl = Math.max(
                          0,
                          tcDrag.liveSourceMl - dPour,
                        );
                        tcDrag.liveTargetMl = Math.min(
                          dstCap,
                          tcDrag.liveTargetMl + dPour,
                        );
                        tcDrag.pouredTotalMl += dPour;

                        // Update 3D hydrostatic liquid surface of source vessel in real time
                        const sScaleY = THREE.MathUtils.clamp(
                          tcDrag.liveSourceMl / srcCap / 0.5,
                          0,
                          2.0,
                        );
                        syncHydrostaticLiquidToGravity(
                          tcObj,
                          sScaleY,
                          now,
                          sloshWaveZ,
                        );

                        // Update 3D hydrostatic liquid surface of receiving vessel in real time
                        const dScaleY = THREE.MathUtils.clamp(
                          tcDrag.liveTargetMl / dstCap / 0.5,
                          0.06,
                          2.0,
                        );
                        syncHydrostaticLiquidToGravity(
                          bestReceiver.obj,
                          dScaleY,
                          now,
                          0,
                        );

                        let dstSurfaceWorldY =
                          bestReceiver.obj.position.y +
                          Math.max(
                            0.024,
                            (bestReceiver.asset.geometry.boundingBoxM.height ??
                              0.14) *
                              (tcDrag.liveTargetMl / dstCap) *
                              0.85,
                          );
                        const dstLiqSurf =
                          bestReceiver.obj.getObjectByName('liquid_surface');
                        if (dstLiqSurf) {
                          bestReceiver.obj.updateMatrixWorld(true);
                          const surfCap =
                            dstLiqSurf.getObjectByName('surface_cap');
                          if (surfCap) {
                            surfCap.getWorldPosition(_surfaceWorldPos);
                            dstSurfaceWorldY = _surfaceWorldPos.y;
                          }
                        }

                        // Render pouring stream into receiving vessel with Parabolic Gravitational Curve
                        if (pouringStreamRef.current) {
                          const spoutPos = new THREE.Vector3(
                            _lipWorldPos.x,
                            Math.max(
                              _lipWorldPos.y,
                              bestReceiver.rimWorldY + 0.012,
                            ),
                            _lipWorldPos.z,
                          );
                          const targetPos = new THREE.Vector3(
                            bestReceiver.obj.position.x,
                            dstSurfaceWorldY,
                            bestReceiver.obj.position.z,
                          );
                          const isDrip = flowRateMlPerSec < 16;
                          renderGravitationalFluidStream({
                            streamGrp: pouringStreamRef.current,
                            spoutPos,
                            targetPos,
                            targetSurfaceY: dstSurfaceWorldY,
                            now,
                            flowRateMlPerSec,
                            isDrippingOnly: isDrip,
                          });

                          if (Math.random() < 0.05) {
                            if (isDrip) {
                              labSoundEngine.play('water-drip', 0.55);
                            } else {
                              labSoundEngine.play('water-pour', 0.62);
                            }
                          }
                          const puddle = scene.getObjectByName(
                            'bench_spill_puddle',
                          ) as THREE.Mesh | undefined;
                          if (puddle) puddle.visible = false;
                        }

                        setActiveDockHint(
                          `🌊 Đang rót sang ${bestReceiver.asset.name.vi}: +${tcDrag.pouredTotalMl.toFixed(1)} ml (Còn ${tcDrag.liveSourceMl.toFixed(0)} ml → Nhận: ${tcDrag.liveTargetMl.toFixed(0)} / ${dstCap} ml) [Bảo toàn thể tích: 100%]`,
                        );
                      } else {
                        if (pouringStreamRef.current) {
                          pouringStreamRef.current.visible = false;
                        }
                        setActiveDockHint(
                          `${bestReceiver.asset.name.vi} đã đầy (${dstCap} ml)!`,
                        );
                      }
                    } else {
                      // Pouring vessel is inside the surrounding zone, but TOO LOW compared to receiving vessel's rim!
                      if (pouringStreamRef.current) {
                        pouringStreamRef.current.visible = false;
                      }
                      const needLiftCm = Math.ceil(
                        (bestReceiver.rimWorldY - srcEffectiveSpoutWorldY) * 100,
                      );
                      setActiveDockHint(
                        `⚠️ Bình rót đang thấp hơn miệng ${bestReceiver.asset.name.vi} (~${Math.max(1, needLiftCm)} cm) — Hãy thả ra và kéo mũi tên hướng lên (▲) để nâng cao trước khi rót!`,
                      );
                    }
                  } else {
                    // No receiving vessel in proximity zone: pour water out onto workbench surface (V_spilled)
                    const dSpill = Math.min(
                      tcDrag.liveSourceMl,
                      flowRateMlPerSec * dt,
                    );
                    tcDrag.liveSourceMl = Math.max(
                      0,
                      tcDrag.liveSourceMl - dSpill,
                    );
                    tcDrag.pouredTotalMl += dSpill;
                    tcDrag.spilledTotalMl =
                      (tcDrag.spilledTotalMl || 0) + dSpill;
                    const sScaleY = THREE.MathUtils.clamp(
                      tcDrag.liveSourceMl / srcCap / 0.5,
                      0,
                      2.0,
                    );
                    syncHydrostaticLiquidToGravity(
                      tcObj,
                      sScaleY,
                      now,
                      sloshWaveZ,
                    );

                    if (pouringStreamRef.current) {
                      const spoutPos = _lipWorldPos.clone();
                      const targetPos = new THREE.Vector3(
                        spoutPos.x + tiltDir * 0.035,
                        BENCH_SURFACE_Y,
                        spoutPos.z,
                      );
                      const isDrip = flowRateMlPerSec < 16;
                      renderGravitationalFluidStream({
                        streamGrp: pouringStreamRef.current,
                        spoutPos,
                        targetPos,
                        targetSurfaceY: BENCH_SURFACE_Y,
                        now,
                        flowRateMlPerSec,
                        isDrippingOnly: isDrip,
                      });

                      if (Math.random() < 0.05) {
                        if (isDrip) {
                          labSoundEngine.play('water-drip', 0.5);
                        } else {
                          labSoundEngine.play('water-pour', 0.58);
                        }
                      }

                      // Hiện vũng nước tràn trên mặt bàn
                      const puddle = scene.getObjectByName(
                        'bench_spill_puddle',
                      ) as THREE.Mesh | undefined;
                      if (puddle) {
                        puddle.visible = true;
                        puddle.position.set(
                          targetPos.x,
                          BENCH_SURFACE_Y + 0.0006,
                          targetPos.z,
                        );
                        const pRadius = Math.min(
                          0.09,
                          0.02 + Math.sqrt(tcDrag.spilledTotalMl) * 0.008,
                        );
                        puddle.scale.set(pRadius / 0.045, pRadius / 0.045, 1);
                      }
                    }
                    setActiveDockHint(
                      `💧 Đang nghiêng đổ nước ra ngoài bàn (${Math.round((absTilt * 180) / Math.PI)}°) — Đã tràn: ${tcDrag.spilledTotalMl.toFixed(1)} ml | Còn lại: ${tcDrag.liveSourceMl.toFixed(0)} ml [Bảo toàn thể tích: 100%]`,
                    );
                  }
                } else {
                  if (pouringStreamRef.current) {
                    pouringStreamRef.current.visible = false;
                  }
                  const deg = Math.round((tcObj.rotation.z * 180) / Math.PI);
                  const pourDeg = Math.round((pourThresholdRad * 180) / Math.PI);
                  if (tcDrag.liveSourceMl <= 0.1) {
                    setActiveDockHint(
                      `Bình đã hết nước (0 ml) — Thả chuột để bình tự động trở về thẳng đứng`,
                    );
                  } else {
                    setActiveDockHint(
                      `↻ Góc nghiêng: ${deg > 0 ? `+${deg}` : deg}° (Nước dâng sát miệng ở ~${pourDeg}°) — Nghiêng thêm để nước chảy ra`,
                    );
                  }
                }
              }
            }
          }

          // Smoothly settle any non-dragged objects toward their World Space transform (worldY = BENCH_SURFACE_Y + localY) & displayScale
          const shelfBorder = benchGroupRef.current?.getObjectByName(
            'display_zone_glow_border',
          ) as THREE.LineSegments | undefined;
          const targetBorderOpacity = isHoveringShelfRef.current ? 0.88 : 0.42;
          const targetBorderColor = isHoveringShelfRef.current ? 0x38bdf8 : 0x38bdf8;
          if (
            shelfBorder &&
            shelfBorder.material instanceof THREE.LineBasicMaterial &&
            shelfBorder.material.opacity !== targetBorderOpacity
          ) {
            shelfBorder.material.opacity = targetBorderOpacity;
            shelfBorder.material.color.setHex(targetBorderColor);
          }

          for (const inst of instancesRef.current) {
            if (activePourAnimRef.current?.sourceId === inst.instanceId) continue;
            if (
              tinkercadDragRef.current.mode &&
              tinkercadDragRef.current.instanceId === inst.instanceId
            ) {
              continue;
            }
            const obj = instanceObjectsRef.current.get(inst.instanceId);
            if (!obj || !inst.visible) continue;
            const tx = inst.transform.positionM[0];
            const ty = BENCH_SURFACE_Y + inst.transform.positionM[1];
            const tz = inst.transform.positionM[2];
            const tsx = inst.transform.displayScale[0] ?? 1;
            const tsy = inst.transform.displayScale[1] ?? 1;
            const tsz = inst.transform.displayScale[2] ?? 1;
            const distSq =
              (obj.position.x - tx) ** 2 +
              (obj.position.y - ty) ** 2 +
              (obj.position.z - tz) ** 2 +
              (obj.rotation.z - inst.transform.rotationRad[2]) ** 2 +
              (obj.scale.x - tsx) ** 2;
            if (distSq > 0.000004) {
              obj.position.x = THREE.MathUtils.damp(obj.position.x, tx, 14, dt);
              obj.position.y = THREE.MathUtils.damp(obj.position.y, ty, 14, dt);
              obj.position.z = THREE.MathUtils.damp(obj.position.z, tz, 14, dt);
              obj.rotation.x = THREE.MathUtils.damp(
                obj.rotation.x,
                inst.transform.rotationRad[0],
                14,
                dt,
              );
              obj.rotation.z = THREE.MathUtils.damp(
                obj.rotation.z,
                inst.transform.rotationRad[2],
                14,
                dt,
              );
              // Keep internal liquid surface horizontal with natural gravity slosh damping while vessel springs back upright (0°)
              const springSlosh =
                -obj.rotation.z * 0.22 * Math.sin(now * 0.024);
              syncHydrostaticLiquidToGravity(obj, undefined, now, springSlosh);
              obj.scale.set(
                THREE.MathUtils.damp(obj.scale.x, tsx, 14, dt),
                THREE.MathUtils.damp(obj.scale.y, tsy, 14, dt),
                THREE.MathUtils.damp(obj.scale.z, tsz, 14, dt),
              );
              if (
                inst.instanceId === selectedInstanceIdRef.current &&
                selectionRingRef.current
              ) {
                selectionRingRef.current.position.set(
                  obj.position.x,
                  BENCH_SURFACE_Y +
                    (inst.instanceState.attachmentSlot === 'shelf'
                      ? (inst.transform.positionM[1] || 0.098) + 0.002
                      : 0.002),
                  obj.position.z,
                );
              }
              needsMoreFrames = true;
            }
          }
        }

        // E. SYNC TINKERCAD 3D GIZMO (Top-Mounted Elevation Arrow + Vertical 360° Ring + Table 360° Ring) & VESSEL PROXIMITY RINGS
        const gizmoGrp = tinkercadGizmoRef.current;
        if (gizmoGrp) {
          const selId = selectedInstanceIdRef.current;
          const selInst = selId
            ? instancesRef.current.find((i) => i.instanceId === selId)
            : undefined;
          const selObj = selId
            ? instanceObjectsRef.current.get(selId)
            : undefined;
          const selAsset = selInst
            ? assetsMapRef.current.get(selInst.assetId)
            : undefined;

          if (
            viewModeRef.current !== 'single-asset' &&
            selInst &&
            selObj &&
            selAsset &&
            selInst.visible &&
            !selInst.locked &&
            selInst.instanceState.attachmentSlot !== 'shelf' &&
            !activePourAnimRef.current
          ) {
            gizmoGrp.visible = true;
            gizmoGrp.position.set(
              selObj.position.x,
              selObj.position.y,
              selObj.position.z,
            );

            const bboxH = selAsset.geometry.boundingBoxM.height ?? 0.14;
            const bboxW = Math.max(
              selAsset.geometry.boundingBoxM.width ?? 0.08,
              selAsset.geometry.boundingBoxM.depth ?? 0.08,
            );

            // Tính chiều cao đỉnh thực tế của mô hình 3D để mũi tên nâng hạ LUÔN nằm PHÍA TRÊN thiết bị (không nằm trong lòng thiết bị)
            if (
              selObj.userData.cachedTopLocalY === undefined &&
              Math.abs(selObj.rotation.z) < 0.03 &&
              Math.abs(selObj.rotation.x) < 0.03
            ) {
              _tempBox3.setFromObject(selObj);
              if (!_tempBox3.isEmpty()) {
                selObj.userData.cachedTopLocalY = Math.max(
                  bboxH,
                  _tempBox3.max.y - selObj.position.y,
                );
              }
            }
            const actualMeshTopLocalY = Math.max(
              bboxH,
              (selObj.userData.cachedTopLocalY as number | undefined) ?? bboxH,
            );

            // Show altitude stem from workbench surface up to elevated object base
            const altStem = gizmoGrp.getObjectByName(
              'tinkercad_altitude_stem',
            ) as THREE.Mesh | undefined;
            const currentLocalY = Math.max(
              0,
              selObj.position.y - BENCH_SURFACE_Y,
            );
            if (altStem) {
              if (currentLocalY > 0.005) {
                altStem.visible = true;
                altStem.scale.set(1, currentLocalY, 1);
                altStem.position.set(0, -currentLocalY * 0.5, 0);
              } else {
                altStem.visible = false;
              }
            }

            const arch = selAsset.geometry.proceduralArchetype;
            const customMod = htmlEquipmentModuleRegistry.getModule(
              selAsset.assetId,
            );
            const isLiquidVessel =
              (arch === 'graduated-cylinder' ||
                arch === 'beaker-250' ||
                arch === 'overflow-can' ||
                arch === 'erlenmeyer-flask' ||
                arch === 'porcelain-dish' ||
                arch === 'distillation-flask') &&
              Boolean(customMod ? customMod.moduleControls.canHoldLiquid !== false : true);

            const ringScale = THREE.MathUtils.clamp(
              (bboxW * 0.98) / 0.082,
              0.94,
              1.56,
            );

            // 1. Vòng quay 360° theo chiều đứng (Vertical Tilt Ring)
            const tiltRingGrp = gizmoGrp.getObjectByName(
              'tinkercad_tilt_ring_group',
            );
            const tiltCenterY = actualMeshTopLocalY * 0.52;
            const tiltRingOuterRadius = 0.095 * 1.06 * ringScale;
            if (tiltRingGrp) {
              tiltRingGrp.visible = isLiquidVessel && !ds.isDragging;
              tiltRingGrp.position.set(0, tiltCenterY, 0);
              tiltRingGrp.scale.set(ringScale, ringScale, ringScale);
              tiltRingGrp.rotation.z = selObj.rotation.z;
            }

            // 2. Vòng quay 360° theo mặt bàn (Horizontal Table Yaw Ring)
            const yawRingGrp = gizmoGrp.getObjectByName(
              'tinkercad_yaw_ring_group',
            );
            if (yawRingGrp) {
              yawRingGrp.visible = !ds.isDragging;
              yawRingGrp.position.set(0, 0.003, 0);
              yawRingGrp.scale.set(ringScale, 1, ringScale);
              yawRingGrp.rotation.y = selObj.rotation.y;
            }

            // 3. Đặt Mũi tên di chuyển độ cao (▲/▼) PHÍA TRÊN hẳn đỉnh thiết bị và đỉnh vòng quay đứng!
            const vArrowGrp = gizmoGrp.getObjectByName(
              'tinkercad_vertical_arrow_group',
            );
            if (vArrowGrp) {
              const highestEquipOrRingY = isLiquidVessel
                ? Math.max(actualMeshTopLocalY, tiltCenterY + tiltRingOuterRadius)
                : actualMeshTopLocalY;
              vArrowGrp.position.set(0, highestEquipOrRingY + 0.036, 0);
            }
          } else {
            gizmoGrp.visible = false;
          }
        }

        // Sync ultra-thin dashed boundary rings around every liquid vessel on the workbench
        const zonesGrp = vesselZonesGroupRef.current;
        if (zonesGrp) {
          if (viewModeRef.current === 'single-asset') {
            zonesGrp.visible = false;
          } else {
            zonesGrp.visible = true;
            const activeVesselIds = new Set<string>();

            // Identify if an active (selected or dragged) liquid vessel is interacting with other vessels
            const activeId =
              ds.instanceId ||
              tinkercadDragRef.current.instanceId ||
              selectedInstanceIdRef.current;
            const activeInst = activeId
              ? instancesRef.current.find((i) => i.instanceId === activeId)
              : undefined;
            const activeObj = activeId
              ? instanceObjectsRef.current.get(activeId)
              : undefined;
            const activeAsset = activeInst
              ? assetsMapRef.current.get(activeInst.assetId)
              : undefined;

            for (const inst of instancesRef.current) {
              if (
                !inst.visible ||
                inst.instanceState.attachmentSlot === 'shelf'
              ) {
                continue;
              }
              const asset = assetsMapRef.current.get(inst.assetId);
              const obj = instanceObjectsRef.current.get(inst.instanceId);
              if (!asset || !obj) continue;
              const arch = asset.geometry.proceduralArchetype;
              const customMod = htmlEquipmentModuleRegistry.getModule(
                asset.assetId,
              );
              const isLiquidVessel =
                (arch === 'graduated-cylinder' ||
                  arch === 'beaker-250' ||
                  arch === 'overflow-can' ||
                  arch === 'erlenmeyer-flask' ||
                  arch === 'porcelain-dish' ||
                  arch === 'distillation-flask') &&
                Boolean(customMod ? customMod.moduleControls.canHoldLiquid !== false : true);
              if (!isLiquidVessel) continue;

              activeVesselIds.add(inst.instanceId);
              const ringName = `vessel_zone_${inst.instanceId}`;
              let zoneMesh = zonesGrp.getObjectByName(ringName) as
                | THREE.Mesh
                | undefined;
              if (!zoneMesh) {
                const outerR = 0.132;
                // Ultra-thin dashed neon ring on the workbench surface (no inner fill, depthTest: true so it never covers vessels)
                const zoneGeo = new THREE.RingGeometry(
                  outerR * 0.88,
                  outerR,
                  64,
                ).rotateX(-Math.PI / 2);
                const zoneMat = new THREE.MeshBasicMaterial({
                  map: getFuturisticNeonZoneTexture(),
                  color: 0x38bdf8,
                  side: THREE.DoubleSide,
                  transparent: true,
                  opacity: 0.24,
                  depthTest: true,
                  depthWrite: false,
                });
                zoneMesh = new THREE.Mesh(zoneGeo, zoneMat);
                zoneMesh.name = ringName;
                zoneMesh.renderOrder = 1;

                // Subtle dashed rim-height guide ring (only visible when actively bringing another vessel close to pour)
                const rimGuideGeo = new THREE.RingGeometry(
                  0.044,
                  0.052,
                  48,
                ).rotateX(-Math.PI / 2);
                const rimGuideMat = new THREE.MeshBasicMaterial({
                  map: getFuturisticNeonProtractorTexture(),
                  color: 0xf59e0b,
                  side: THREE.DoubleSide,
                  transparent: true,
                  opacity: 0.38,
                  depthTest: true,
                  depthWrite: false,
                });
                const rimGuideMesh = new THREE.Mesh(rimGuideGeo, rimGuideMat);
                rimGuideMesh.name = 'rim_guide_ring';
                rimGuideMesh.renderOrder = 5;
                rimGuideMesh.visible = false;
                zoneMesh.add(rimGuideMesh);

                zonesGrp.add(zoneMesh);
              }

              zoneMesh.position.set(
                obj.position.x,
                BENCH_SURFACE_Y + 0.0018,
                obj.position.z,
              );

              // Color-code the surrounding dashed ring subtly based on proximity & height readiness
              let ringColor = 0x38bdf8;
              let ringOpacity =
                inst.instanceId === selectedInstanceIdRef.current ? 0.34 : 0.18;
              let showRimGuide = false;

              if (
                activeInst &&
                activeObj &&
                activeAsset &&
                activeInst.instanceId !== inst.instanceId
              ) {
                const distXZ = Math.hypot(
                  activeObj.position.x - obj.position.x,
                  activeObj.position.z - obj.position.z,
                );
                if (distXZ < 0.165) {
                  showRimGuide = true;
                  const srcSpoutWorldY =
                    activeObj.position.y +
                    (activeAsset.geometry.boundingBoxM.height ?? 0.14) * 0.72;
                  const dstRimWorldY =
                    obj.position.y +
                    (asset.geometry.boundingBoxM.height ?? 0.14) * 0.92;
                  if (srcSpoutWorldY >= dstRimWorldY - 0.015) {
                    // Ready to pour! Subtle dashed Emerald
                    ringColor = 0x34d399;
                    ringOpacity = 0.48;
                  } else {
                    // Inside surrounding ring, but too low! Subtle dashed Amber
                    ringColor = 0xfbbf24;
                    ringOpacity = 0.48;
                  }
                }
              }

              if (zoneMesh.material instanceof THREE.MeshBasicMaterial) {
                zoneMesh.material.color.setHex(ringColor);
                zoneMesh.material.opacity = ringOpacity;
              }
              const rimGuide = zoneMesh.getObjectByName('rim_guide_ring') as
                | THREE.Mesh
                | undefined;
              if (rimGuide) {
                rimGuide.visible = showRimGuide;
                if (showRimGuide) {
                  const dstH = asset.geometry.boundingBoxM.height ?? 0.14;
                  const localObjY = Math.max(0, obj.position.y - BENCH_SURFACE_Y);
                  rimGuide.position.set(0, localObjY + dstH * 0.92, 0);
                  if (rimGuide.material instanceof THREE.MeshBasicMaterial) {
                    rimGuide.material.color.setHex(ringColor);
                  }
                }
              }
            }

            // Remove rings for deleted/hidden vessels
            for (let i = zonesGrp.children.length - 1; i >= 0; i--) {
              const child = zonesGrp.children[i];
              const vid = child.name.replace('vessel_zone_', '');
              if (!activeVesselIds.has(vid)) {
                zonesGrp.remove(child);
              }
            }
          }
        }

        // Animate 3D Optical Bench Photon spheres along refracted ray paths at 60fps
        const optGrp = opticalAssemblyGroupRef.current;
        if (optGrp) {
          const photonsGrp = optGrp.getObjectByName('optical_photons_group');
          if (photonsGrp && photonsGrp.visible && photonsGrp.children.length > 0) {
            const nowSec = performance.now() * 0.00052;
            for (const ph of photonsGrp.children) {
              const segs = ph.userData.raySegments as
                | {
                    start: THREE.Vector3;
                    entryHit: THREE.Vector3;
                    exitHit: THREE.Vector3;
                    refractedEnd: THREE.Vector3;
                    phase: number;
                  }
                | undefined;
              if (!segs) continue;
              const t = (nowSec + segs.phase) % 1;
              if (t < 0.44) {
                const u = t / 0.44;
                ph.position.lerpVectors(segs.start, segs.entryHit, u);
              } else if (t < 0.52) {
                const u = (t - 0.44) / 0.08;
                ph.position.lerpVectors(segs.entryHit, segs.exitHit, u);
              } else {
                const u = (t - 0.52) / 0.48;
                ph.position.lerpVectors(segs.exitHit, segs.refractedEnd, u);
              }
            }
            if (!isSoftwareGl) {
              needsMoreFrames = true;
            }
          }
        }

        // Animate 3D Live Contextual Neural Synapse Photon Particles at 60fps
        const neuralGrp = neuralSynapseBeamGroupRef.current;
        if (neuralGrp && neuralGrp.children.length > 0) {
          const nowSec = performance.now() * 0.001;
          let hasParticles = false;
          for (const ch of neuralGrp.children) {
            if (ch.name === 'neural_photon_particle' && ch.userData && ch.userData.curve) {
              hasParticles = true;
              const uData = ch.userData as {
                curve: THREE.QuadraticBezierCurve3;
                direction: 'input' | 'output' | 'bidirectional';
                offset: number;
                speed: number;
              };
              let t = 0;
              if (uData.direction === 'output') {
                // Dòng chảy ra: Xanh dương neon chảy từ Selected ra Target
                t = ((nowSec * uData.speed + uData.offset) % 1 + 1) % 1;
              } else if (uData.direction === 'input') {
                // Dòng chảy vào: Tím neon chảy từ Target vào Selected
                t = (1 - ((nowSec * uData.speed + uData.offset) % 1 + 1) % 1);
              } else {
                // Cùng cấp / Gợi ý: Lam tím neon chảy qua lại dao động hai chiều
                t = 0.5 + 0.48 * Math.sin(nowSec * uData.speed * 2.8 + uData.offset * 6.28);
              }
              const pt = uData.curve.getPointAt(Math.max(0, Math.min(1, t)));
              ch.position.copy(pt);
            }
          }
          if (hasParticles && !isSoftwareGl) {
            needsMoreFrames = true;
          }
        }

        // 🌀 CỔNG CHUYỂN KHÔNG GIAN (TRANSPORTER PORTAL ANIMATION LOOP)
        const portalGrp = transporterPortalRef.current;
        if (portalGrp && portalGrp.visible) {
          const isHovered = Boolean(portalGrp.userData.isHovered);
          const spinMult = isHovered ? 2.8 : 1.0;

          const disc = portalGrp.getObjectByName('portal_disc');
          if (disc) disc.rotation.y += 0.005 * spinMult;

          const outerRing = portalGrp.getObjectByName('portal_outer_ring');
          if (outerRing) outerRing.rotation.y += 0.010 * spinMult;

          const innerRing = portalGrp.getObjectByName('portal_inner_ring');
          if (innerRing) innerRing.rotation.y -= 0.016 * spinMult;

          const centerRing = portalGrp.getObjectByName('portal_center_ring');
          if (centerRing) centerRing.rotation.y += 0.022 * spinMult;

          const beam = portalGrp.getObjectByName('portal_beam') as THREE.Mesh | undefined;
          if (beam && beam.material instanceof THREE.MeshBasicMaterial) {
            const pulseFreq = isHovered ? 6.5 : 3.0;
            const baseOpacity = isHovered ? 0.52 : 0.30;
            beam.material.opacity = baseOpacity + 0.12 * Math.sin(now * 0.001 * pulseFreq);
          }

          let warp = Number(portalGrp.userData.warpPulse || 0);
          if (warp > 0) {
            warp = Math.max(0, warp - dt * 2.5);
            portalGrp.userData.warpPulse = warp;
            const flashScale = 1.0 + warp * 0.28;
            portalGrp.scale.set(flashScale, flashScale, flashScale);
            needsMoreFrames = true;
          } else {
            const targetScale = isHovered ? 1.08 : 1.0;
            portalGrp.scale.x = THREE.MathUtils.damp(portalGrp.scale.x, targetScale, 14, dt);
            portalGrp.scale.y = THREE.MathUtils.damp(portalGrp.scale.y, targetScale, 14, dt);
            portalGrp.scale.z = THREE.MathUtils.damp(portalGrp.scale.z, targetScale, 14, dt);
          }
          if (!isSoftwareGl) {
            needsMoreFrames = true;
          }
        }

        // 🧠 HOLOGRAPHIC NEURAL PLACEMENT TARGET ANIMATION LOOP
        const neuralTarget = neuralPlacementTargetRef.current;
        if (neuralTarget && neuralTarget.visible) {
          const outer = neuralTarget.getObjectByName('neural_target_outer_ring');
          if (outer) outer.rotation.y += 0.024;

          const inner = neuralTarget.getObjectByName('neural_target_inner_ring');
          if (inner) inner.rotation.y -= 0.032;

          const beacon = neuralTarget.getObjectByName('neural_target_beacon') as THREE.Mesh | undefined;
          if (beacon && beacon.material instanceof THREE.MeshBasicMaterial) {
            beacon.material.opacity = 0.22 + 0.14 * Math.sin(now * 0.007);
          }
          needsMoreFrames = true;
        }

        orbit.update();
        if (selectionBoxHelperRef.current && selectionBoxHelperRef.current.visible) {
          selectionBoxHelperRef.current.update();
        }
        renderer.render(scene, camera);
        if (!ds.isDragging) {
          updateProjectedOverlays();
        }

        if (needsMoreFrames) {
          renderDirty = true;
        }

        const done = () => {
          renderBusy = false;
          if (renderDirty) requestRender();
        };
        if (isSoftwareGl && !ds.isDragging) afterDraw(done);
        else done();
      });
    }
    requestRenderRef.current = requestRender;

    orbit.addEventListener('change', () => {
      requestRender();
    });

    transformControls.addEventListener('change', () => {
      if (transformControls.object && selectionRingRef.current) {
        selectionRingRef.current.position.x = transformControls.object.position.x;
        selectionRingRef.current.position.z = transformControls.object.position.z;
      }
      requestRender();
    });

    transformControls.addEventListener('dragging-changed', (event) => {
      const isDragging = Boolean((event as unknown as { value: boolean }).value);
      orbit.enabled = !isDragging;
      if (!isDragging && transformControls.object) {
        const obj = transformControls.object;
        const instId = obj.userData.instanceId as string | undefined;
        if (instId) {
          obj.position.x = THREE.MathUtils.clamp(obj.position.x, -1.14, 1.14);
          obj.position.z = THREE.MathUtils.clamp(obj.position.z, -0.34, 0.34);
          onUpdateTransformRef.current(
            instId,
            [
              Number(obj.position.x.toFixed(3)),
              Number((obj.position.y - BENCH_SURFACE_Y).toFixed(3)),
              Number(obj.position.z.toFixed(3)),
            ],
            [
              Number(obj.rotation.x.toFixed(3)),
              Number(obj.rotation.y.toFixed(3)),
              Number(obj.rotation.z.toFixed(3)),
            ],
          );
          requestRender();
        }
      }
    });

    // =========================================================================
    // DIRECT PHYSICAL GRAB, GLIDE & LAB EQUIPMENT DOCKING
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const mouseNdc = new THREE.Vector2();

    function evaluateLabDockingTarget(
      draggedInst: SceneInstance,
      draggedAsset: AssetDefinition,
      worldX: number,
      worldZ: number,
    ): {
      pos: [number, number, number];
      targetInstanceId: string | null;
      slot: PhysicalDockTargetSlot;
      hint: string | null;
      snapRingPos: [number, number, number] | null;
    } {
      const draggedArch = draggedAsset.geometry.proceduralArchetype;
      const customDraggedMod = htmlEquipmentModuleRegistry.getModule(
        draggedAsset.assetId,
      );
      const isSpecimenOrWeight =
        draggedAsset.kind === 'specimen' ||
        draggedArch === 'calibration-weight' ||
        draggedArch === 'solid-cylinder' ||
        draggedArch === 'solid-sphere' ||
        draggedArch === 'solid-block' ||
        draggedArch === 'hollow-cylinder' ||
        Boolean(customDraggedMod?.moduleControls.canSubmergeInVessel);

      const isPourableSourceVessel =
        (draggedArch === 'beaker-250' ||
          draggedArch === 'graduated-cylinder' ||
          draggedArch === 'erlenmeyer-flask' ||
          draggedArch === 'overflow-can' ||
          (Boolean(customDraggedMod?.moduleControls.canHoldLiquid) &&
            draggedArch !== 'lever-balance-apparatus' &&
            draggedArch !== 'communicating-vessels-3way' &&
            draggedArch !== 'spring-dynamometer' &&
            draggedArch !== 'vernier-caliper' &&
            draggedArch !== 'retort-stand')) &&
        (draggedInst.instanceState.liquidLevelMl ?? 40) > 1;

      const isWaterReceivingVessel =
        draggedArch === 'graduated-cylinder' ||
        draggedArch === 'beaker-250' ||
        draggedArch === 'overflow-can' ||
        draggedArch === 'erlenmeyer-flask' ||
        draggedArch === 'porcelain-dish' ||
        (Boolean(customDraggedMod?.moduleControls.canHoldLiquid) &&
          draggedArch !== 'lever-balance-apparatus' &&
          draggedArch !== 'spring-dynamometer' &&
          draggedArch !== 'vernier-caliper' &&
          draggedArch !== 'retort-stand');

      const isWeighableOnScale =
        isSpecimenOrWeight ||
        draggedArch === 'beaker-250' ||
        draggedArch === 'graduated-cylinder' ||
        draggedArch === 'erlenmeyer-flask' ||
        draggedArch === 'porcelain-dish' ||
        Boolean(customDraggedMod?.moduleControls.canBeWeighedOnBalance) ||
        (draggedArch !== 'electronic-balance' &&
          draggedArch !== 'water-dispenser' &&
          draggedArch !== 'retort-stand' &&
          (draggedAsset.scientificProperties.referenceMass?.value ?? 0) > 0);

      // Preserve the object's current vertical elevation (from Tinkercad ▲ handle) when moving on the bench
      const preservedLocalY =
        draggedInst.instanceState.attachmentSlot === 'shelf'
          ? 0
          : THREE.MathUtils.clamp(draggedInst.transform.positionM[1] ?? 0, 0, 0.38);

      let vesselZoneHint: string | null = null;
      let vesselZoneSnapRing: [number, number, number] | null = null;

      for (const other of instancesRef.current) {
        if (
          other.instanceId === draggedInst.instanceId ||
          !other.visible ||
          other.instanceState.attachmentSlot === 'shelf'
        ) {
          continue;
        }
        const otherAsset = assetsMapRef.current.get(other.assetId);
        if (!otherAsset) continue;
        const arch = otherAsset.geometry.proceduralArchetype;
        const ox = other.transform.positionM[0];
        const oz = other.transform.positionM[2];
        const rotY = other.transform.rotationRad[1] ?? 0;

        // 0A. Water Dispenser Outlet Proximity Docking — Kéo dụng cụ chứa lại gần vòi Bình cấp nước để tự động hứng và lấy nước!
        if (arch === 'water-dispenser' && isWaterReceivingVessel) {
          const spoutX = Number((ox + Math.cos(rotY) * 0.095).toFixed(3));
          const spoutZ = Number((oz - Math.sin(rotY) * 0.095).toFixed(3));
          const distToSpout = Math.hypot(worldX - spoutX, worldZ - spoutZ);
          const distToBody = Math.hypot(worldX - ox, worldZ - oz);
          if (distToSpout < 0.145 || distToBody < 0.155) {
            const vesselCap =
              draggedArch === 'overflow-can'
                ? 210
                : draggedAsset.scientificProperties.capacity?.value ?? 100;
            const curMl =
              draggedInst.instanceState.baseLiquidLevelMl ??
              draggedInst.instanceState.liquidLevelMl ??
              vesselCap * 0.5;
            const addPreviewMl =
              draggedArch === 'overflow-can' && curMl < 210
                ? Math.max(0, 210 - curMl)
                : Math.max(0, Math.min(25, vesselCap - curMl));
            return {
              pos: [spoutX, 0.005, spoutZ],
              targetInstanceId: other.instanceId,
              slot: 'dispenser-outlet',
              hint:
                addPreviewMl > 0.1
                  ? `Đặt vào khay hứng vòi Bình cấp nước (Mở van lấy +${addPreviewMl.toFixed(0)} ml → ${(curMl + addPreviewMl).toFixed(0)} / ${vesselCap} ml)`
                  : `Đặt dưới vòi Bình cấp nước (${draggedAsset.name.vi} đã đầy ${vesselCap} ml)`,
              snapRingPos: [spoutX, 0.004, spoutZ],
            };
          }
        }

        // 0B. Reverse Water Dispenser Docking — Kéo Bình cấp nước lại gần dụng cụ chứa để đặt vòi ngay trên miệng bình!
        if (
          draggedArch === 'water-dispenser' &&
          (arch === 'graduated-cylinder' ||
            arch === 'beaker-250' ||
            arch === 'overflow-can' ||
            arch === 'erlenmeyer-flask' ||
            arch === 'porcelain-dish')
        ) {
          const dispRotY = draggedInst.transform.rotationRad[1] ?? 0;
          const desiredDispX = Number((ox - Math.cos(dispRotY) * 0.095).toFixed(3));
          const desiredDispZ = Number((oz + Math.sin(dispRotY) * 0.095).toFixed(3));
          const dist = Math.hypot(worldX - desiredDispX, worldZ - desiredDispZ);
          const distDirect = Math.hypot(worldX - ox, worldZ - oz);
          if (dist < 0.145 || distDirect < 0.155) {
            return {
              pos: [desiredDispX, 0.004, desiredDispZ],
              targetInstanceId: other.instanceId,
              slot: 'dispenser-outlet',
              hint: `Đặt vòi Bình cấp nước ngay trên ${otherAsset.name.vi} để xả nước`,
              snapRingPos: [ox, 0.004, oz],
            };
          }
        }

        // 1. Electronic Balance Pan Docking — Tính tâm đĩa cân theo góc xoay 360° & CỘNG DỒN khối lượng nhiều vật!
        if (arch === 'electronic-balance' && isWeighableOnScale) {
          const panX = ox - Math.sin(rotY) * 0.02;
          const panZ = oz - Math.cos(rotY) * 0.02;
          const dist = Math.hypot(worldX - panX, worldZ - panZ);
          if (dist < 0.165) {
            const dryMass =
              draggedAsset.scientificProperties.referenceMass?.value ?? 66.25;
            const waterMass =
              isPourableSourceVessel || draggedArch === 'porcelain-dish'
                ? draggedInst.instanceState.liquidLevelMl ?? 0
                : 0;
            const itemMass = dryMass + waterMass;

            // Find all OTHER items already resting on this balance pan to compute cumulative mass
            const existingOnPan = instancesRef.current.filter(
              (item) =>
                item.visible &&
                item.instanceId !== draggedInst.instanceId &&
                item.instanceState.attachedToInstanceId === other.instanceId &&
                item.instanceState.attachmentSlot === 'balance-pan',
            );
            let existingMassG = 0;
            for (const pItem of existingOnPan) {
              const pAsset = assetsMapRef.current.get(pItem.assetId);
              const pArch = pAsset?.geometry.proceduralArchetype;
              const pDry =
                pAsset?.scientificProperties.referenceMass?.value ?? 66.25;
              const pWater =
                pArch === 'beaker-250' ||
                pArch === 'graduated-cylinder' ||
                pArch === 'erlenmeyer-flask' ||
                pArch === 'porcelain-dish'
                  ? pItem.instanceState.liquidLevelMl ?? 0
                  : 0;
              existingMassG += pDry + pWater;
            }

            const cumulativeMassG = existingMassG + itemMass;
            // Arrange multiple items neatly on the Ø130mm pan so they don't overlap
            const slotIdx = existingOnPan.length;
            const offsetRadius = slotIdx === 0 ? 0 : 0.025;
            const offsetAng = slotIdx * 2.1;
            const dockX = Number(
              (panX + Math.cos(offsetAng) * offsetRadius).toFixed(3),
            );
            const dockZ = Number(
              (panZ + Math.sin(offsetAng) * offsetRadius).toFixed(3),
            );

            return {
              pos: [dockX, 0.068, dockZ],
              targetInstanceId: other.instanceId,
              slot: 'balance-pan',
              hint:
                existingOnPan.length > 0
                  ? `Cộng thêm vào Cân điện tử (+${itemMass.toFixed(2)} g → Tổng ${existingOnPan.length + 1} vật: ${cumulativeMassG.toFixed(2)} g)`
                  : `Đặt lên đĩa Cân điện tử (m = ${itemMass.toFixed(2)} g)`,
              snapRingPos: [panX, 0.069, panZ],
            };
          }
        }

        // 2. Surrounding Vessel Proximity Zone Check (Height-aware Tinkercad pouring guidance without hijacking horizontal drag)
        if (
          isWaterReceivingVessel &&
          (arch === 'graduated-cylinder' ||
            arch === 'beaker-250' ||
            arch === 'overflow-can' ||
            arch === 'erlenmeyer-flask' ||
            arch === 'porcelain-dish' ||
            arch === 'distillation-flask')
        ) {
          const dist = Math.hypot(worldX - ox, worldZ - oz);
          if (dist < 0.155) {
            const srcH = draggedAsset.geometry.boundingBoxM.height ?? 0.14;
            const dstH = otherAsset.geometry.boundingBoxM.height ?? 0.14;
            const otherLocalY = other.transform.positionM[1] ?? 0;
            const srcSpoutLocalY = preservedLocalY + srcH * 0.72;
            const dstRimLocalY = otherLocalY + dstH * 0.92;
            vesselZoneSnapRing = [ox, 0.004, oz];
            if (srcSpoutLocalY >= dstRimLocalY - 0.015) {
              vesselZoneHint = `✅ Đang trong vùng rót của ${otherAsset.name.vi} (Độ cao hợp lệ) — Thả ra rồi kéo vòng tròn xoay (↻) để nghiêng đổ nước!`;
            } else {
              const needCm = Math.max(
                1,
                Math.ceil((dstRimLocalY - srcSpoutLocalY) * 100),
              );
              vesselZoneHint = `⚠️ Đang trong vùng quanh ${otherAsset.name.vi} nhưng thấp hơn miệng bình ~${needCm} cm — Hãy thả ra rồi kéo mũi tên hướng lên (▲) để nâng cao trước khi rót!`;
            }
          }
        }

        // 3. Graduated Cylinder / Beaker / Overflow Can Submersion Docking (or Thermometer immersion!)
        if (
          (isSpecimenOrWeight || draggedArch === 'thermometer') &&
          (arch === 'graduated-cylinder' ||
            arch === 'overflow-can' ||
            arch === 'beaker-250' ||
            arch === 'erlenmeyer-flask' ||
            arch === 'porcelain-dish' ||
            arch === 'distillation-flask')
        ) {
          const dist = Math.hypot(worldX - ox, worldZ - oz);
          if (dist < 0.105) {
            // KIỂM TRA KHẨU ĐỘ MIỆNG ỐNG ĐONG (Aperture Check):
            // Miệng ống đong 100 ml có đường kính Ø 28 mm. Nếu mẫu vật quá lớn (như khối đồng 40x25 mm), cảnh báo dùng Bình tràn
            if (arch === 'graduated-cylinder' && draggedArch !== 'thermometer') {
              const bWidthMm = (draggedAsset.geometry.boundingBoxM.width ?? 0.02) * 1000;
              const bDepthMm = (draggedAsset.geometry.boundingBoxM.depth ?? 0.02) * 1000;
              const maxDimMm = Math.max(bWidthMm, bDepthMm);
              const minDimMm = Math.min(bWidthMm, bDepthMm);
              if (draggedArch === 'solid-block' || maxDimMm > 32 || minDimMm > 26) {
                return {
                  pos: [ox, 0.22, oz],
                  targetInstanceId: null,
                  slot: 'bench',
                  hint: `⚠️ Không thể thả vào Ống đong! Mẫu vật "${draggedAsset.name.vi}" (${maxDimMm.toFixed(0)} mm) lớn hơn miệng ống đong (Ø 28 mm). Hãy dùng Bình tràn Eureka!`,
                  snapRingPos: null,
                };
              }
            }

            if (draggedArch === 'thermometer') {
              const isHeated =
                (arch === 'porcelain-dish' || arch === 'distillation-flask') &&
                other.instanceState.isHeating !== false;
              const targetTemp = isHeated ? 78.5 : 25.0;
              return {
                pos: [ox, 0.042, oz],
                targetInstanceId: other.instanceId,
                slot: 'inside-vessel',
                hint: `Nhúng Nhiệt kế đo nhiệt độ ${otherAsset.name.vi} (T = ${targetTemp.toFixed(1)} °C)`,
                snapRingPos: [ox, 0.004, oz],
              };
            }
            const volVal =
              draggedAsset.scientificProperties.referenceVolume?.value ?? 24.5;
            const existingInVessel = instancesRef.current.filter(
              (item) =>
                item.visible &&
                item.instanceId !== draggedInst.instanceId &&
                item.instanceState.attachedToInstanceId === other.instanceId &&
                item.instanceState.attachmentSlot === 'inside-vessel',
            );
            let existingVol = 0;
            for (const sItem of existingInVessel) {
              const sAsset = assetsMapRef.current.get(sItem.assetId);
              if (sAsset?.geometry.proceduralArchetype !== 'thermometer') {
                existingVol +=
                  sAsset?.scientificProperties.referenceVolume?.value ?? 24.5;
              }
            }
            const totalDeltaV = existingVol + volVal;
            return {
              pos: [ox, 0.016, oz],
              targetInstanceId: other.instanceId,
              slot: 'inside-vessel',
              hint:
                existingInVessel.length > 0
                  ? `Thả thêm vào ${otherAsset.name.vi} (+${volVal.toFixed(1)} cm³ → Tổng ΔV = +${totalDeltaV.toFixed(1)} cm³)`
                  : `Thả chìm vào ${otherAsset.name.vi} (ΔV = +${volVal.toFixed(1)} cm³)`,
              snapRingPos: [ox, 0.004, oz],
            };
          }
        }

        // 4. Spring Dynamometer Hook Docking (Measure cumulative Force P = sum(m) * g)
        if (isSpecimenOrWeight && arch === 'spring-dynamometer') {
          const dist = Math.hypot(worldX - ox, worldZ - oz);
          if (dist < 0.105) {
            const massG =
              draggedAsset.scientificProperties.referenceMass?.value ?? 66.25;
            const existingOnHook = instancesRef.current.filter(
              (item) =>
                item.visible &&
                item.instanceId !== draggedInst.instanceId &&
                item.instanceState.attachedToInstanceId === other.instanceId &&
                item.instanceState.attachmentSlot === 'dynamometer-hook',
            );
            let existingMass = 0;
            for (const hItem of existingOnHook) {
              const hAsset = assetsMapRef.current.get(hItem.assetId);
              existingMass +=
                hAsset?.scientificProperties.referenceMass?.value ?? 66.25;
            }
            const totalForceN = ((existingMass + massG) * 0.00981).toFixed(2);
            return {
              pos: [ox, 0.025, oz + 0.018],
              targetInstanceId: other.instanceId,
              slot: 'dynamometer-hook',
              hint:
                existingOnHook.length > 0
                  ? `Móc thêm vào Lực kế lò xo (Tổng trọng lượng P = ${totalForceN} N)`
                  : `Móc vào Lực kế lò xo (Trọng lượng P = ${totalForceN} N)`,
              snapRingPos: [ox, 0.004, oz],
            };
          }
        } else if (!isSpecimenOrWeight && arch === 'spring-dynamometer') {
          const dist = Math.hypot(worldX - ox, worldZ - oz);
          if (dist < 0.105) {
            return {
              pos: [worldX, 0, worldZ],
              targetInstanceId: null,
              slot: 'bench',
              hint: `⚠️ Không thể móc "${draggedInst.customLabel || draggedAsset.name.vi}" vào Lực kế! Chỉ chấp nhận Quả cân chuẩn hoặc Mẫu vật có quai móc.`,
              snapRingPos: null,
            };
          }
        }

        // 5A. Vernier Caliper Jaws Docking — Kéo vật mẫu / dụng cụ vào hàm kẹp Thước cặp để đo đường kính ngoài d (mm)
        const isMeasurableByCaliper =
          isSpecimenOrWeight ||
          draggedArch === 'graduated-cylinder' ||
          draggedArch === 'beaker-250' ||
          draggedArch === 'erlenmeyer-flask' ||
          draggedArch === 'porcelain-dish';
        if (isMeasurableByCaliper && arch === 'vernier-caliper') {
          const rawWidthMm =
            draggedAsset.geometry.dimensions?.widthOrDiameter?.value ??
            draggedAsset.geometry.boundingBoxM.width * 1000;
          const widthMm = Number(
            THREE.MathUtils.clamp(rawWidthMm, 1, 150).toFixed(2),
          );
          const localCenterX = -0.09 + widthMm * 0.0005;
          const localCenterZ = 0.028;
          const jawWorldX = Number(
            (
              ox +
              localCenterX * Math.cos(rotY) +
              localCenterZ * Math.sin(rotY)
            ).toFixed(3),
          );
          const jawWorldZ = Number(
            (
              oz -
              localCenterX * Math.sin(rotY) +
              localCenterZ * Math.cos(rotY)
            ).toFixed(3),
          );
          const distToJaws = Math.hypot(worldX - jawWorldX, worldZ - jawWorldZ);
          const distToCaliper = Math.hypot(worldX - ox, worldZ - oz);
          if (distToJaws < 0.125 || distToCaliper < 0.135) {
            const mainMm = Math.floor(widthMm + 1e-6);
            const vernierMm = Math.max(0, Number((widthMm - mainMm).toFixed(2)));
            return {
              pos: [jawWorldX, 0.002, jawWorldZ],
              targetInstanceId: other.instanceId,
              slot: 'caliper-jaws',
              hint: `📏 Kẹp đo bằng Thước cặp du xích: d = ${widthMm.toFixed(2)} mm (Chính ${mainMm} mm + Du xích ${vernierMm.toFixed(2)} mm)`,
              snapRingPos: [jawWorldX, 0.004, jawWorldZ],
            };
          }
        }

        // 5B. Reverse Vernier Caliper Docking — Kéo trực tiếp Thước cặp du xích đến vật mẫu để hàm kẹp tự động ôm khít và đọc số đo!
        const isOtherMeasurableByCaliper =
          otherAsset.kind === 'specimen' ||
          arch === 'calibration-weight' ||
          arch === 'solid-cylinder' ||
          arch === 'solid-sphere' ||
          arch === 'solid-block' ||
          arch === 'hollow-cylinder' ||
          arch === 'graduated-cylinder' ||
          arch === 'beaker-250' ||
          arch === 'erlenmeyer-flask' ||
          arch === 'porcelain-dish';
        if (draggedArch === 'vernier-caliper' && isOtherMeasurableByCaliper) {
          const rawWidthMm =
            otherAsset.geometry.dimensions?.widthOrDiameter?.value ??
            otherAsset.geometry.boundingBoxM.width * 1000;
          const widthMm = Number(
            THREE.MathUtils.clamp(rawWidthMm, 1, 150).toFixed(2),
          );
          const calRotY = draggedInst.transform.rotationRad[1] ?? 0;
          const localCenterX = -0.09 + widthMm * 0.0005;
          const localCenterZ = 0.028;
          // Position caliper so its jaw gap center lands right at the target object's (ox, oz)
          const desiredCalX = Number(
            (
              ox -
              (localCenterX * Math.cos(calRotY) +
                localCenterZ * Math.sin(calRotY))
            ).toFixed(3),
          );
          const desiredCalZ = Number(
            (
              oz -
              (-localCenterX * Math.sin(calRotY) +
                localCenterZ * Math.cos(calRotY))
            ).toFixed(3),
          );
          const distToTarget = Math.hypot(worldX - ox, worldZ - oz);
          const distToDesired = Math.hypot(
            worldX - desiredCalX,
            worldZ - desiredCalZ,
          );
          if (distToTarget < 0.135 || distToDesired < 0.135) {
            const mainMm = Math.floor(widthMm + 1e-6);
            const vernierMm = Math.max(0, Number((widthMm - mainMm).toFixed(2)));
            return {
              pos: [desiredCalX, 0, desiredCalZ],
              targetInstanceId: other.instanceId,
              slot: 'caliper-jaws',
              hint: `📏 Đưa Thước cặp vào kẹp đo "${other.customLabel || otherAsset.name.vi}": d = ${widthMm.toFixed(2)} mm (Chính ${mainMm} + Du xích ${vernierMm.toFixed(2)} mm)`,
              snapRingPos: [ox, 0.004, oz],
            };
          }
        }

        // Incompatible Caliper Jaws Rejection (ASM-04, ASM-16 & ASM-22)
        if (
          !isMeasurableByCaliper &&
          arch === 'vernier-caliper' &&
          (draggedArch === 'optical-bench' ||
            draggedArch === 'optical-power-supply' ||
            draggedArch === 'retort-stand' ||
            draggedArch === 'water-dispenser')
        ) {
          const distToCaliper = Math.hypot(worldX - ox, worldZ - oz);
          if (distToCaliper < 0.135) {
            return {
              pos: [worldX, 0, worldZ],
              targetInstanceId: null,
              slot: 'bench',
              hint: `⚠️ Không thể kẹp "${draggedInst.customLabel || draggedAsset.name.vi}" bằng Thước cặp! Kích thước vượt quá giới hạn đo 150 mm của mỏ kẹp.`,
              snapRingPos: null,
            };
          }
        }
        // 5D. Optical Bench Rail Docking ('optical-bench-rail') — Kéo Đèn (1), Vật sáng chữ F (2), Thấu kính (3), Màn chắn (4) trượt đồng trục trên Giá quang học (5)
        const isOpticalRider =
          draggedArch === 'optical-lamp' ||
          draggedArch === 'frosted-f-object' ||
          draggedArch === 'optical-lens' ||
          draggedArch === 'optical-screen';
        if (isOpticalRider && arch === 'optical-bench') {
          const dzToBench = Math.abs(worldZ - oz);
          const dxFromBenchCenter = worldX - ox;
          if (dzToBench < 0.14 && Math.abs(dxFromBenchCenter) <= 0.45) {
            let clampedRailOffsetM = THREE.MathUtils.clamp(
              dxFromBenchCenter,
              -0.42,
              0.42,
            );
            // Snap optical-lens cleanly to O = 0.0 cm when near the center mark
            if (
              draggedArch === 'optical-lens' &&
              Math.abs(clampedRailOffsetM) < 0.025
            ) {
              clampedRailOffsetM = 0;
            } else {
              // Snap to 0.5 cm (0.005 m) ruler ticks for crisp textbook readings
              clampedRailOffsetM =
                Math.round(clampedRailOffsetM * 200) / 200;
            }

            // Prevent riders on the same optical bench rail from overlapping
            const otherRiders = instancesRef.current.filter(
              (item) =>
                item.visible &&
                item.instanceId !== draggedInst.instanceId &&
                item.instanceState.attachedToInstanceId === other.instanceId &&
                item.instanceState.attachmentSlot === 'optical-bench-rail',
            );
            for (const rItem of otherRiders) {
              const rx = rItem.transform.positionM[0] - ox;
              if (Math.abs(clampedRailOffsetM - rx) < 0.052) {
                clampedRailOffsetM = THREE.MathUtils.clamp(
                  clampedRailOffsetM >= rx ? rx + 0.055 : rx - 0.055,
                  -0.42,
                  0.42,
                );
              }
            }

            const dockX = Number((ox + clampedRailOffsetM).toFixed(3));
            const railCm = Number((clampedRailOffsetM * 100).toFixed(1));
            const roleHint =
              draggedArch === 'optical-lens'
                ? `🔬 Lắp (3) Thấu kính trên Giá quang học tại vạch x = ${railCm.toFixed(1)} cm`
                : draggedArch === 'frosted-f-object'
                  ? `🔤 Trượt (2) Vật sáng chữ F trên Giá quang học: x = ${railCm.toFixed(1)} cm (d = ${Math.abs(railCm).toFixed(1)} cm)`
                  : draggedArch === 'optical-screen'
                    ? `🖥️ Trượt (4) Màn chắn hứng ảnh trên Giá quang học: L = ${Math.abs(railCm).toFixed(1)} cm`
                    : `💡 Lắp (1) Đèn chiếu sáng trên Giá quang học tại vạch x = ${railCm.toFixed(1)} cm`;

            return {
              pos: [dockX, 0, oz],
              targetInstanceId: other.instanceId,
              slot: 'optical-bench-rail',
              hint: roleHint,
              snapRingPos: [dockX, 0.028, oz],
            };
          }
        }

        // Incompatible Optical Bench Rejection (ASM-04 & ASM-22)
        if (!isOpticalRider && arch === 'optical-bench') {
          const dzToBench = Math.abs(worldZ - oz);
          const dxFromBenchCenter = worldX - ox;
          if (dzToBench < 0.14 && Math.abs(dxFromBenchCenter) <= 0.45) {
            return {
              pos: [worldX, 0, worldZ],
              targetInstanceId: null,
              slot: 'bench',
              hint: `⚠️ Không thể gắn "${draggedInst.customLabel || draggedAsset.name.vi}" lên Giá quang học! Chỉ chấp nhận Đèn, Vật sáng F, Thấu kính và Màn chắn có con trượt 1D.`,
              snapRingPos: null,
            };
          }
        }
      }

      // 5C. KHU TRƯNG BÀY 1 TẦNG NÂNG CAO (Kệ kính cường lực gọn 1.38m × cao 0.32m × sâu mỏng 7.6cm sát mép sau bàn: Z <= -0.25, |X| <= 0.69)
      // Đặt thiết bị lên Tầng 1 nâng cao (0.138m) thoáng rộng cho các dụng cụ cao
      const targetTierY = 0.138;
      let rayLocalYAtShelf = preservedLocalY;
      let rayXAtShelf = worldX;
      if (Math.abs(raycaster.ray.direction.z) > 1e-4) {
        const tShelf = (-0.45 - raycaster.ray.origin.z) / raycaster.ray.direction.z;
        if (tShelf > 0) {
          rayLocalYAtShelf =
            raycaster.ray.origin.y +
            tShelf * raycaster.ray.direction.y -
            BENCH_SURFACE_Y;
          rayXAtShelf =
            raycaster.ray.origin.x + tShelf * raycaster.ray.direction.x;
        }
      }
      const isAimingAtShelf =
        (worldZ <= -0.36 && Math.abs(worldX) <= 0.69) ||
        (rayLocalYAtShelf >= 0.05 &&
          rayLocalYAtShelf <= 0.35 &&
          Math.abs(rayXAtShelf) <= 0.68 &&
          worldZ <= -0.22);

      if (isAimingAtShelf) {
        const candidateX = Math.abs(rayXAtShelf) <= 0.66 ? rayXAtShelf : worldX;
        let shelfX = THREE.MathUtils.clamp(candidateX, -0.62, 0.62);

        const existingOnShelf = instancesRef.current.filter(
          (item) =>
            item.visible &&
            item.instanceId !== draggedInst.instanceId &&
            item.instanceState.attachmentSlot === 'shelf',
        );
        for (const sItem of existingOnShelf) {
          const sx = sItem.transform.positionM[0];
          if (Math.abs(shelfX - sx) < 0.095) {
            shelfX = THREE.MathUtils.clamp(
              shelfX >= sx ? sx + 0.1 : sx - 0.1,
              -0.62,
              0.62,
            );
          }
        }
        return {
          pos: [Number(shelfX.toFixed(3)), targetTierY, -0.45],
          targetInstanceId: null,
          slot: 'shelf',
          hint: `✨ Thả vào Khu trưng bày (Cất "${draggedInst.customLabel || draggedAsset.name.vi}" lên kệ gọn)`,
          snapRingPos: [Number(shelfX.toFixed(3)), targetTierY + 0.002, -0.45],
        };
      }

      // 6. Height-Aware Physical Bench Collision Resolution
      // Nếu vật thể đã được nâng cao bằng mũi tên ▲ vượt qua chiều cao vật khác thì cho phép di chuyển tự do phía trên miệng bình!
      let resolvedX = THREE.MathUtils.clamp(worldX, -BENCH_LIMIT_X, BENCH_LIMIT_X);
      let resolvedZ = THREE.MathUtils.clamp(worldZ, -BENCH_LIMIT_Z, BENCH_LIMIT_Z);
      const draggedRadius =
        Math.max(
          draggedAsset.geometry.boundingBoxM.width,
          draggedAsset.geometry.boundingBoxM.depth,
        ) * 0.46;
      const draggedH = draggedAsset.geometry.boundingBoxM.height ?? 0.14;

      for (let pass = 0; pass < 2; pass++) {
        for (const other of instancesRef.current) {
          if (
            other.instanceId === draggedInst.instanceId ||
            !other.visible ||
            other.instanceState.attachedToInstanceId ||
            other.instanceState.attachmentSlot === 'shelf'
          ) {
            continue;
          }
          const otherAsset = assetsMapRef.current.get(other.assetId);
          if (!otherAsset) continue;
          const otherLocalY = other.transform.positionM[1] ?? 0;
          const otherH = otherAsset.geometry.boundingBoxM.height ?? 0.14;

          // Skip 2D repulsion if one object is vertically above the other
          const verticallySeparated =
            preservedLocalY >= otherLocalY + otherH - 0.018 ||
            otherLocalY >= preservedLocalY + draggedH - 0.018;
          if (verticallySeparated) continue;

          const otherRadius =
            Math.max(
              otherAsset.geometry.boundingBoxM.width,
              otherAsset.geometry.boundingBoxM.depth,
            ) * 0.46;
          const minSep = draggedRadius + otherRadius + 0.008;
          const dx = resolvedX - other.transform.positionM[0];
          const dz = resolvedZ - other.transform.positionM[2];
          const dist = Math.hypot(dx, dz);
          if (dist < minSep) {
            const nx = dist > 0.0001 ? dx / dist : 1;
            const nz = dist > 0.0001 ? dz / dist : 0;
            resolvedX = other.transform.positionM[0] + nx * minSep;
            resolvedZ = other.transform.positionM[2] + nz * minSep;
            resolvedX = THREE.MathUtils.clamp(resolvedX, -BENCH_LIMIT_X, BENCH_LIMIT_X);
            resolvedZ = THREE.MathUtils.clamp(resolvedZ, -BENCH_LIMIT_Z, BENCH_LIMIT_Z);
          }
        }
      }

      return {
        pos: [resolvedX, preservedLocalY, resolvedZ],
        targetInstanceId: null,
        slot: 'bench',
        hint:
          vesselZoneHint ??
          (draggedInst.instanceState.attachmentSlot === 'shelf'
            ? `Đưa "${draggedInst.customLabel || draggedAsset.name.vi}" từ Khu trưng bày xuống bàn thực hành`
            : null),
        snapRingPos: vesselZoneSnapRing,
      };
    }

    // Track active touch/mouse pointers for 6px tap-vs-drag disambiguation and 2-finger pinch-zoom safety
    const activePointerIds = new Set<number>();
    let pendingGrab: {
      instanceId: string;
      pointerId: number;
      startClientX: number;
      startClientY: number;
      grabOffsetX: number;
      grabOffsetZ: number;
      opticalLensSlotId?: OpticalLensSpec['id'];
      opticalInteractiveAction?: string;
    } | null = null;
    let emptyTapStart: {
      pointerId: number;
      startClientX: number;
      startClientY: number;
    } | null = null;

    const cancelActiveOrPendingDrag = () => {
      pendingGrab = null;
      const tcDrag = tinkercadDragRef.current;
      if (tcDrag.mode) {
        tcDrag.mode = null;
        tcDrag.instanceId = null;
        tcDrag.pointerId = null;
        tcDrag.targetTiltRad = 0;
        orbit.enabled = true;
        renderer.domElement.style.cursor = 'default';
        setActiveDockHint(null);
        if (pouringStreamRef.current) pouringStreamRef.current.visible = false;
        requestRender();
      }
      const ds = dragStateRef.current;
      if (ds.isDragging) {
        ds.isDragging = false;
        ds.instanceId = null;
        orbit.enabled = true;
        renderer.domElement.style.cursor = 'default';
        setActiveDockHint(null);
        if (snapTargetRingRef.current) snapTargetRingRef.current.visible = false;
        if (pouringStreamRef.current) pouringStreamRef.current.visible = false;
        requestRender();
      }
    };

    /**
     * Bộ lọc Raycast chính xác: Chỉ nhận diện khi con trỏ chạm đúng vào hình thể 3D thực của dụng cụ.
     * Loại bỏ hoàn toàn bóng đổ tiếp xúc phẳng trên bàn (contact_shadow), điểm neo phụ trợ và các chùm tia sáng,
     * ngăn chặn triệt để lỗi vô tình chạm/cầm nhầm thiết bị khi nhấp chuột vào khoảng trống mặt bàn.
     */
    const isRealEquipmentMesh = (obj: THREE.Object3D): boolean => {
      if (!obj.visible) return false;
      if (obj.name === 'contact_shadow' || obj.name.includes('shadow')) return false;
      if (obj.name === 'measurement_anchor' || obj.name.includes('anchor')) return false;
      if (
        obj.name.includes('laser_beams') ||
        obj.name.includes('optical_ray') ||
        obj.name.includes('photon') ||
        (obj.name.includes('beam') && !obj.name.includes('knob')) ||
        obj.name === 'lamp_light_cone'
      ) {
        return false;
      }
      if (obj.userData?.isRaycastIgnore) return false;
      if (obj instanceof THREE.Mesh) {
        if (
          obj.geometry instanceof THREE.PlaneGeometry &&
          Math.abs(obj.rotation.x) > 1.0 &&
          Math.abs(obj.position.y) < 0.005
        ) {
          return false;
        }
        return true;
      }
      return false;
    };

    let lastLeftClickTime = 0;
    let lastLeftClickPos = { x: 0, y: 0 };
    let lastRightClickTime = 0;
    let lastRightClickPos = { x: 0, y: 0 };

    const resetSimulationToDefaultView = () => {
      const now = performance.now();
      if (now - lastResetTime < 280) return;
      lastResetTime = now;

      labSoundEngine.play('camera-zoom', 0.85);
      setIsTopViewActive(false);

      // 1. Tính toán góc nhìn mặc định toàn bàn chuẩn xác theo aspect ratio
      const aspect = camera && camera.aspect > 0.1 ? camera.aspect : 1.55;
      const tanHalfVFov = Math.tan(THREE.MathUtils.degToRad(21)); // fov = 42 deg
      const tanHalfHFov = tanHalfVFov * Math.max(0.65, aspect);
      const dist = THREE.MathUtils.clamp(1.26 / tanHalfHFov + 0.34, 1.85, 3.35);

      cameraGoalPosRef.current = new THREE.Vector3(
        0.0,
        BENCH_SURFACE_Y + 0.08 + dist * 0.4,
        -0.02 + dist * 0.915,
      );
      cameraGoalTargetRef.current = new THREE.Vector3(0.0, BENCH_SURFACE_Y + 0.08, -0.02);

      // 2. Bỏ chọn thiết bị và đóng mọi menu/bảng điều khiển đang mở
      selectedInstanceIdRef.current = null;
      onSelectInstanceRef.current(null);
      setViewportContextMenu(null);
      transformControls.detach();
      emptyTapStart = null;
      cancelActiveOrPendingDrag();

      onNotifyRef.current(
        'Đã đưa màn hình mô phỏng về Mặc định (Toàn bàn).',
        'info',
      );
      requestRender();
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (viewModeRef.current === 'single-asset') return;
      activePointerIds.add(e.pointerId);

      // Nếu có từ 2 ngón tay chạm trở lên (pinch-zoom / 2-finger pan), hủy kéo vật thể và nhường hoàn toàn cho OrbitControls
      if (activePointerIds.size > 1) {
        emptyTapStart = null;
        cancelActiveOrPendingDrag();
        return;
      }

      // 🎯 Xử lý Double Click chuột trái (button 0) hoặc chuột phải (button 2) đưa về Mặc định toàn bàn
      const now = performance.now();
      if (e.button === 0) {
        const distLeft = Math.hypot(e.clientX - lastLeftClickPos.x, e.clientY - lastLeftClickPos.y);
        if (now - lastLeftClickTime < 420 && distLeft < 28) {
          lastLeftClickTime = 0;
          resetSimulationToDefaultView();
          return;
        }
        lastLeftClickTime = now;
        lastLeftClickPos = { x: e.clientX, y: e.clientY };
      } else if (e.button === 2) {
        const distRight = Math.hypot(e.clientX - lastRightClickPos.x, e.clientY - lastRightClickPos.y);
        if (now - lastRightClickTime < 420 && distRight < 28) {
          lastRightClickTime = 0;
          resetSimulationToDefaultView();
          return;
        }
        lastRightClickTime = now;
        lastRightClickPos = { x: e.clientX, y: e.clientY };
        return;
      } else {
        return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      mouseNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseNdc, camera);

      // 1. PRIORITY CHECK: Raycast against Tinkercad 3D Gizmo handles
      // ('elevate-y' top arrow, 'tilt-pour' vertical ring arrow handles, 'rotate-y' horizontal table ring arrow handles)
      const gizmoGrp = tinkercadGizmoRef.current;
      const selId = selectedInstanceIdRef.current;
      if (gizmoGrp && gizmoGrp.visible && selId) {
        const gizmoHits = raycaster.intersectObject(gizmoGrp, true);
        const handleHit = gizmoHits.find(
          (h) =>
            isObjectEffectivelyVisible(h.object, gizmoGrp) &&
            Boolean(h.object.userData?.tinkercadHandle),
        );
        if (handleHit) {
          const handleType = handleHit.object.userData.tinkercadHandle as
            | 'elevate-y'
            | 'tilt-pour'
            | 'rotate-y';
          const selObj = instanceObjectsRef.current.get(selId);
          const selInst = instancesRef.current.find(
            (i) => i.instanceId === selId,
          );
          const selAsset = selInst
            ? assetsMapRef.current.get(selInst.assetId)
            : undefined;

          if (selObj && selInst && selAsset) {
            const arch = selAsset.geometry.proceduralArchetype;
            const customMod = htmlEquipmentModuleRegistry.getModule(selAsset.assetId);
            const isLiquidVessel =
              (arch === 'graduated-cylinder' ||
                arch === 'beaker-250' ||
                arch === 'overflow-can' ||
                arch === 'erlenmeyer-flask' ||
                arch === 'porcelain-dish' ||
                arch === 'distillation-flask') &&
              Boolean(customMod ? customMod.moduleControls.canHoldLiquid !== false : true);

            // TUYỆT ĐỐI KHÔNG kích hoạt tilt-pour cho bất kỳ thiết bị cơ học/quang học nào không phải bình chứa chất lỏng!
            if (handleType === 'tilt-pour' && !isLiquidVessel) {
              return;
            }

            emptyTapStart = null;
            pendingGrab = null;
            orbit.enabled = false;
            setHoveredEquipment(null);
            labSoundEngine.play('grab-pickup', 0.85);

            const curLocalY = THREE.MathUtils.clamp(
              selObj.position.y - BENCH_SURFACE_Y,
              0,
              0.38,
            );

            // Double-click on the vertical arrow resets object back down to workbench surface (0.00 m)
            const nowMs = performance.now();
            if (
              handleType === 'elevate-y' &&
              nowMs - tinkercadDragRef.current.lastTapElevateMs < 360
            ) {
              tinkercadDragRef.current.lastTapElevateMs = 0;
              selObj.position.y = BENCH_SURFACE_Y;
              labSoundEngine.play('dock-hover-snap', 0.85);
              onUpdateTransformRef.current(
                selId,
                [
                  Number(selObj.position.x.toFixed(3)),
                  0,
                  Number(selObj.position.z.toFixed(3)),
                ],
                [
                  Number(selObj.rotation.x.toFixed(3)),
                  Number(selObj.rotation.y.toFixed(3)),
                  0,
                ],
              );
              orbit.enabled = true;
              setActiveDockHint('⚡ Đã hạ nhanh thiết bị nằm sát mặt bàn (h = 0.0 cm)');
              window.setTimeout(() => setActiveDockHint(null), 1300);
              requestRender();
              return;
            }
            if (handleType === 'elevate-y') {
              tinkercadDragRef.current.lastTapElevateMs = nowMs;
            }

            const srcCap =
              selAsset.geometry.proceduralArchetype === 'overflow-can'
                ? 210
                : selAsset.scientificProperties.capacity?.value ?? 100;
            const curMl =
              selInst.instanceState.baseLiquidLevelMl ??
              selInst.instanceState.liquidLevelMl ??
              srcCap * 0.5;

            tinkercadDragRef.current = {
              mode: handleType,
              instanceId: selId,
              pointerId: e.pointerId,
              startClientX: e.clientX,
              startClientY: e.clientY,
              startLocalY: curLocalY,
              targetLocalY: curLocalY,
              targetTiltRad: 0,
              startYawRad: selObj.rotation.y,
              targetYawRad: selObj.rotation.y,
              liveSourceMl: curMl,
              initialSourceMl: curMl,
              activeTargetId: null,
              liveTargetMl: 0,
              initialTargetMl: 0,
              pouredTotalMl: 0,
              spilledTotalMl: 0,
              lastTapElevateMs: tinkercadDragRef.current.lastTapElevateMs,
              lastObjectTapMs: tinkercadDragRef.current.lastObjectTapMs,
              lastTappedInstanceId: tinkercadDragRef.current.lastTappedInstanceId,
            };

            renderer.domElement.style.cursor =
              handleType === 'elevate-y' ? 'ns-resize' : 'grabbing';
            setActiveDockHint(
              handleType === 'elevate-y'
                ? `▲ Kéo lên/xuống để thay đổi độ cao: ${(curLocalY * 100).toFixed(1)} cm (Nhấp đúp chuột trái để hạ nhanh sát mặt bàn)`
                : handleType === 'rotate-y'
                  ? `↻ Kéo mũi tên vòng ngang để xoay thiết bị 360° theo mặt bàn`
                  : `↻ Kéo mũi tên vòng đứng để xoay nghiêng bình đổ nước (Thả chuột để bình tự động trở về thẳng đứng)`,
            );
            requestRender();
            return;
          }
        }
      }

      // 1B. PRIORITY CHECK: Nhấp trực tiếp vào Cổng chuyển không gian ("Kho chứa") -> Mở danh sách tạm thời
      const portalGrp = transporterPortalRef.current;
      if (portalGrp && portalGrp.visible) {
        const portalHits = raycaster.intersectObject(portalGrp, true);
        if (portalHits.length > 0) {
          emptyTapStart = null;
          pendingGrab = null;
          orbit.enabled = false;
          setTimeout(() => {
            orbit.enabled = true;
          }, 120);

          labSoundEngine.play('ui-toggle', 0.85);
          portalGrp.userData.warpPulse = 0.8;
          setIsWarehouseModalOpen(true);
          requestRender();
          return;
        }
      }

      const pickables: THREE.Object3D[] = [];
      instanceObjectsRef.current.forEach((group, instId) => {
        const inst = instancesRef.current.find((i) => i.instanceId === instId);
        if (inst && inst.visible && !inst.locked) {
          pickables.push(group);
        }
      });

      const hits = raycaster.intersectObjects(pickables, true);
      const validHits = hits.filter((h) => isRealEquipmentMesh(h.object));
      if (validHits.length > 0) {
        emptyTapStart = null;

        // KIỂM TRA NHẤP TRỰC TIẾP VÀO NÚT TARE 3D TRÊN MẶT CÂN ĐIỆN TỬ
        const tareHit = validHits.find(
          (h) =>
            h.object.visible &&
            (h.object.userData?.isTareButton || h.object.name === 'tare_button_3d'),
        );
        if (tareHit && onQuickLabActionRef.current) {
          let currTare: THREE.Object3D | null = tareHit.object;
          let tareBalanceId: string | null = null;
          while (currTare) {
            if (currTare.userData?.instanceId) {
              tareBalanceId = currTare.userData.instanceId;
              break;
            }
            currTare = currTare.parent;
          }
          if (tareBalanceId) {
            pendingGrab = null;
            const btnObj = tareHit.object;
            const initZ = btnObj.position.z;
            btnObj.position.z = initZ - 0.0015;
            setTimeout(() => {
              btnObj.position.z = initZ;
              requestRender();
            }, 120);
            onQuickLabActionRef.current('tare-balance', tareBalanceId);
            labSoundEngine.play('scale-tare');
            requestRender();
            return;
          }
        }
        let curr: THREE.Object3D | null = validHits[0].object;
        while (curr && !curr.userData?.instanceId) {
          curr = curr.parent;
        }
        const hitInstId = curr?.userData?.instanceId as string | undefined;
        if (hitInstId) {
          const obj = instanceObjectsRef.current.get(hitInstId);
          const hitInst = instancesRef.current.find(
            (i) => i.instanceId === hitInstId,
          );
          const nowMs = performance.now();
          const prevTapMs = tinkercadDragRef.current.lastObjectTapMs;
          const prevTapId = tinkercadDragRef.current.lastTappedInstanceId;
          tinkercadDragRef.current.lastObjectTapMs = nowMs;
          tinkercadDragRef.current.lastTappedInstanceId = hitInstId;

          // ĐỘNG TÁC HẠ NHANH: Nếu đối tượng đang ở trên không, khi nhấp đúp chuột trái (double-click)
          // trực tiếp vào đối tượng thì lập tức hạ nằm sát xuống mặt bàn liền (h = 0.0 cm)!
          const currentAirHeight =
            obj && hitInst?.instanceState.attachmentSlot !== 'shelf'
              ? Math.max(
                  obj.position.y - BENCH_SURFACE_Y,
                  hitInst?.transform.positionM[1] ?? 0,
                )
              : 0;
          if (
            obj &&
            hitInst &&
            prevTapId === hitInstId &&
            nowMs - prevTapMs < 360 &&
            currentAirHeight > 0.003
          ) {
            tinkercadDragRef.current.lastObjectTapMs = 0;
            pendingGrab = null;
            obj.position.y = BENCH_SURFACE_Y;
            obj.rotation.x = 0;
            obj.rotation.z = 0;
            if (tinkercadGizmoRef.current) {
              tinkercadGizmoRef.current.position.y = BENCH_SURFACE_Y;
            }
            labSoundEngine.play('dock-hover-snap', 0.9);
            onUpdateTransformRef.current(
              hitInstId,
              [
                Number(obj.position.x.toFixed(3)),
                0,
                Number(obj.position.z.toFixed(3)),
              ],
              [
                0,
                Number(obj.rotation.y.toFixed(3)),
                0,
              ],
            );
            orbit.enabled = true;
            setActiveDockHint('⚡ Đã hạ nhanh thiết bị nằm xuống sát mặt bàn (h = 0.0 cm)');
            window.setTimeout(() => setActiveDockHint(null), 1400);
            updateProjectedOverlays();
            requestRender();
            return;
          }

          if (selectedInstanceIdRef.current !== hitInstId) {
            selectedInstanceIdRef.current = hitInstId;
            onSelectInstanceRef.current(hitInstId);
          }
          // Mặc định mở thanh công cụ 2 dòng gọn gàng dưới đáy khi chọn thiết bị
          setDeviceSheetMode('compact');

          // Detect if the user clicked a specific interactive optical sub-part (e.g. lens slot in wooden box, PSU switch/knob, lamp slit plate, lens tag, banana binding terminal)
          // Duyệt qua TẤT CẢ các đối tượng trong hits để luôn ưu tiên chốt cắm (terminal) và núm xoay (knob)
          let clickedLensSlotId: OpticalLensSpec['id'] | undefined;
          let clickedOpticalAction: string | undefined;
          let clickedTerminal: {
            polarity: 'pos' | 'neg';
            mesh: THREE.Mesh;
            label: string;
            ownerInstanceId: string;
            ownerArchetype: string;
          } | undefined;

          for (const hitItem of hits) {
            let checkNode: THREE.Object3D | null = hitItem.object;
            let termNode: THREE.Object3D | null = null;
            while (checkNode) {
              if (!clickedTerminal && checkNode.userData?.interactiveTerminal && checkNode.userData?.terminalPolarity) {
                termNode = checkNode;
              }
              if (termNode && checkNode.userData?.instanceId) {
                const termInstId = checkNode.userData.instanceId as string;
                const termInst = instancesRef.current.find((i) => i.instanceId === termInstId);
                const termArch = termInst?.assetId
                  ? assetsMapRef.current.get(termInst.assetId)?.geometry.proceduralArchetype ?? ''
                  : '';
                clickedTerminal = {
                  polarity: termNode.userData.terminalPolarity as 'pos' | 'neg',
                  mesh: termNode as THREE.Mesh,
                  label: (termNode.userData.terminalLabel as string) || 'Chốt cắm điện',
                  ownerInstanceId: termInstId,
                  ownerArchetype: termArch,
                };
              }
              if (!clickedLensSlotId && checkNode.userData?.opticalLensSlotId) {
                clickedLensSlotId = checkNode.userData.opticalLensSlotId as OpticalLensSpec['id'];
              }
              if (!clickedOpticalAction && checkNode.userData?.opticalInteractiveAction) {
                clickedOpticalAction = checkNode.userData.opticalInteractiveAction as string;
              }
              checkNode = checkNode.parent;
            }
            if (clickedTerminal) break;
          }

          // Bổ sung: Nếu nhấp chuột gần cọc cắm của Đèn hoặc Nguồn (trong bán kính 6.5 cm), tự động nhận diện chốt cắm điện 2 chiều
          if (!clickedTerminal && hitInst) {
            const hitArch = assetsMapRef.current.get(hitInst.assetId)?.geometry.proceduralArchetype;
            if (hitArch === 'optical-lamp' || hitArch === 'optical-power-supply') {
              const instObj = instanceObjectsRef.current.get(hitInst.instanceId);
              if (instObj) {
                const posTerm = instObj.getObjectByName('terminal_pos');
                const negTerm = instObj.getObjectByName('terminal_neg');
                const pPos = posTerm?.getWorldPosition(new THREE.Vector3());
                const pNeg = negTerm?.getWorldPosition(new THREE.Vector3());
                const hitPt = hits[0]?.point;
                if (hitPt && (pPos || pNeg)) {
                  const dPos = pPos ? hitPt.distanceTo(pPos) : Infinity;
                  const dNeg = pNeg ? hitPt.distanceTo(pNeg) : Infinity;
                  if (dPos < 0.065 || dNeg < 0.065) {
                    const isPos = dPos <= dNeg;
                    const termMesh =
                      ((isPos ? posTerm : negTerm) as THREE.Mesh) ||
                      (hits[0].object as THREE.Mesh);
                    clickedTerminal = {
                      polarity: isPos ? 'pos' : 'neg',
                      mesh: termMesh,
                      label: isPos ? 'Chốt Đỏ (+)' : 'Chốt Đen (-)',
                      ownerInstanceId: hitInst.instanceId,
                      ownerArchetype: hitArch,
                    };
                  }
                }
              }
            }
          }

          // Xử lý Click-to-Connect: Khi đang chờ cắm dây mà người dùng nhấp vào thiết bị đối diện hoặc chốt
          if (pendingWireConnectionRef.current) {
            const pw = pendingWireConnectionRef.current;
            const clickedArch = clickedTerminal?.ownerArchetype || (hitInst?.assetId
              ? assetsMapRef.current.get(hitInst.assetId)?.geometry.proceduralArchetype
              : null);
            const isTargetEquip =
              (pw.sourceArch === 'optical-lamp' && clickedArch === 'optical-power-supply') ||
              (pw.sourceArch === 'optical-power-supply' && clickedArch === 'optical-lamp') ||
              (clickedTerminal && clickedTerminal.ownerArchetype !== pw.sourceArch);

            if (isTargetEquip) {
              const lampInst = instancesRef.current.find(
                (i) =>
                  i.visible &&
                  assetsMapRef.current.get(i.assetId)?.geometry.proceduralArchetype ===
                    'optical-lamp',
              );
              const psuInst = instancesRef.current.find(
                (i) =>
                  i.visible &&
                  assetsMapRef.current.get(i.assetId)?.geometry.proceduralArchetype ===
                    'optical-power-supply',
              );
              if (lampInst && onUpdateInstanceStateRef.current) {
                const isPos = pw.polarity === 'pos';
                labSoundEngine.play('dock-hover-snap', 1.0);
                const curPosConnected =
                  lampInst.instanceState.wirePosConnected ??
                  (lampInst.instanceState.isCablesConnected !== false);
                const curNegConnected =
                  lampInst.instanceState.wireNegConnected ??
                  (lampInst.instanceState.isCablesConnected !== false);

                const nextPosConnected = isPos ? true : curPosConnected;
                const nextNegConnected = !isPos ? true : curNegConnected;
                const bothConnected = nextPosConnected && nextNegConnected;

                const isPsuOn = Boolean(psuInst?.instanceState.isPoweredOn);
                const curVoltageV = psuInst?.instanceState.supplyVoltageV ?? 12.0;
                const willLight = bothConnected && isPsuOn && curVoltageV >= 2.5;

                onUpdateInstanceStateRef.current(
                  lampInst.instanceId,
                  {
                    wirePosConnected: nextPosConnected,
                    wireNegConnected: nextNegConnected,
                    isCablesConnected: bothConnected,
                    isPoweredOn: true,
                    isLampLit: willLight,
                  },
                  `🔌 Đã cắm chốt ${isPos ? 'ĐỎ (+)' : 'ĐEN (-)'}! ${
                    bothConnected
                      ? '⚡ Mạch kín: Cả 2 dây nguồn đã kết nối hoàn tất!' + (isPsuOn ? ' Đèn phát sáng ngay!' : '')
                      : '👉 Còn thiếu chốt ' + (isPos ? 'ĐEN (-)' : 'ĐỎ (+)') + ', nhấp tiếp để cắm nốt.'
                  }`,
                );
                onNotifyRef.current?.(
                  `⚡ Đã kết nối dây ${isPos ? 'ĐỎ (+)' : 'ĐEN (-)'} thành công!`,
                  'info',
                );
              }
              setPendingWireConnection(null);
              pendingWireConnectionRef.current = null;
              requestRender();
              return;
            }
          }

          if (clickedTerminal) {
            emptyTapStart = null;
            pendingGrab = null;
            orbit.enabled = false;

            const termWorldPos = new THREE.Vector3();
            clickedTerminal.mesh.getWorldPosition(termWorldPos);

            wireDragRef.current = {
              isDragging: true,
              pointerId: e.pointerId,
              sourceInstanceId: clickedTerminal.ownerInstanceId || hitInstId,
              sourceArchetype: clickedTerminal.ownerArchetype || (hitInst?.assetId
                ? assetsMapRef.current.get(hitInst.assetId)?.geometry.proceduralArchetype ?? null
                : null),
              sourcePolarity: clickedTerminal.polarity,
              startWorldPos: termWorldPos.clone(),
              currentWorldPos: termWorldPos.clone(),
              snappedTargetPos: null,
              snappedTargetInstanceId: null,
              snappedTargetPolarity: null,
            };

            try {
              renderer.domElement.setPointerCapture(e.pointerId);
            } catch {}

            labSoundEngine.play('grab-pickup', 0.85);
            setActiveDockHint(
              `🔌 Đang kéo dây ${clickedTerminal.polarity === 'pos' ? 'ĐỎ (+)' : 'ĐEN (-)'}... Kéo sang ${
                clickedTerminal.ownerArchetype === 'optical-lamp' ? 'Bộ Nguồn 12V' : 'Đèn Chiếu Sáng'
              }`,
            );
            requestRender();
            return;
          }

          // Chuẩn bị kéo vật thể bám chuột 1:1 trên mặt phẳng tại đúng độ cao hiện tại của vật thể
          if (toolModeRef.current !== 'rotate' && obj) {
            _activeDragPlane.setComponents(0, 1, 0, -obj.position.y);
            if (raycaster.ray.intersectPlane(_activeDragPlane, _dragIntersect)) {
              orbit.enabled = false;
              pendingGrab = {
                instanceId: hitInstId,
                pointerId: e.pointerId,
                startClientX: e.clientX,
                startClientY: e.clientY,
                grabOffsetX: obj.position.x - _dragIntersect.x,
                grabOffsetZ: obj.position.z - _dragIntersect.z,
                opticalLensSlotId: clickedLensSlotId,
                opticalInteractiveAction: clickedOpticalAction,
              };
            }
          }
          requestRender();
        }
      } else {
        if (pendingWireConnectionRef.current) {
          setPendingWireConnection(null);
          pendingWireConnectionRef.current = null;
        }
        pendingGrab = null;
        emptyTapStart = {
          pointerId: e.pointerId,
          startClientX: e.clientX,
          startClientY: e.clientY,
        };
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (viewModeRef.current === 'single-asset') return;

      // 🎯 Chặn mở context menu nếu vừa kích hoạt double-click chuột phải để đưa về Mặc định toàn bàn
      if (performance.now() - lastResetTime < 450) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      mouseNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseNdc, camera);

      // Kiểm tra nhấp chuột phải vào Cổng chuyển không gian ("Kho chứa") -> Mở danh sách tạm thời
      const portalGrp = transporterPortalRef.current;
      if (portalGrp && portalGrp.visible) {
        const portalHits = raycaster.intersectObject(portalGrp, true);
        if (portalHits.length > 0) {
          e.preventDefault();
          e.stopPropagation();
          labSoundEngine.play('ui-toggle', 0.85);
          portalGrp.userData.warpPulse = 0.8;
          setIsWarehouseModalOpen(true);
          requestRender();
          return;
        }
      }

      const pickables: THREE.Object3D[] = [];
      instanceObjectsRef.current.forEach((group, instId) => {
        const inst = instancesRef.current.find((i) => i.instanceId === instId);
        if (inst && inst.visible) {
          pickables.push(group);
        }
      });

      const hits = raycaster.intersectObjects(pickables, true);
      if (hits.length > 0) {
        let curr: THREE.Object3D | null = hits[0].object;
        while (curr && !curr.userData?.instanceId) {
          curr = curr.parent;
        }
        const hitInstId = curr?.userData?.instanceId as string | undefined;
        const hitInst = hitInstId
          ? instancesRef.current.find((i) => i.instanceId === hitInstId)
          : undefined;
        const hitAsset = hitInst
          ? assetsMapRef.current.get(hitInst.assetId)
          : undefined;

        if (hitInst && hitAsset) {
          e.preventDefault();
          e.stopPropagation();
          selectedInstanceIdRef.current = hitInst.instanceId;
          onSelectInstanceRef.current(hitInst.instanceId);
          labSoundEngine.play('ui-toggle', 0.85);
          setViewportContextMenu({
            instanceId: hitInst.instanceId,
            asset: hitAsset,
            customLabel: hitInst.customLabel,
            x: Math.min(e.clientX, window.innerWidth - 265),
            y: Math.min(e.clientY, window.innerHeight - 230),
          });
        }
      }
    };

    function updateDynamicDraggingWireMesh() {
      const grp = dynamicWireDragGroupRef.current;
      if (!grp) return;
      grp.clear();

      const wd = wireDragRef.current;
      if (!wd.isDragging) return;

      const p0 = wd.startWorldPos;
      const p1 = wd.currentWorldPos;
      const dist = p0.distanceTo(p1);
      const isPos = wd.sourcePolarity === 'pos';

      const WIRE_RADIUS = 0.0024;
      const minWireY = BENCH_SURFACE_Y + WIRE_RADIUS + 0.001;

      // Đường dây chùng tự nhiên trong 3D, tuyệt đối không bị sụt âm xuống mặt bàn gỗ
      const mid = p0.clone().add(p1).multiplyScalar(0.5);
      const targetSagY = Math.min(p0.y, p1.y) - Math.min(0.035, dist * 0.12);
      mid.y = Math.max(minWireY + 0.004, targetSagY);

      const rawCurve = new THREE.CatmullRomCurve3([p0, mid, p1]);
      const rawPoints = rawCurve.getPoints(24);
      for (const pt of rawPoints) {
        pt.y = Math.max(minWireY, pt.y);
      }
      const clampedCurve = new THREE.CatmullRomCurve3(rawPoints);
      const geo = new THREE.TubeGeometry(clampedCurve, 24, WIRE_RADIUS, 8, false);

      const mat = new THREE.MeshStandardMaterial({
        color: isPos ? 0xef4444 : 0x0f172a,
        roughness: 0.35,
        emissive: wd.snappedTargetPos ? (isPos ? 0xff4d4d : 0x38bdf8) : 0x000000,
        emissiveIntensity: wd.snappedTargetPos ? 0.75 : 0.0,
      });
      const tubeMesh = new THREE.Mesh(geo, mat);
      grp.add(tubeMesh);

      // Cụm đầu chốt cắm bắp chuối bám theo đầu trỏ chuột
      const tipGroup = new THREE.Group();
      tipGroup.position.copy(p1);

      const bootGeo = new THREE.CylinderGeometry(0.0036, 0.0036, 0.016, 12);
      bootGeo.rotateX(Math.PI / 2);
      const bootMat = new THREE.MeshStandardMaterial({
        color: isPos ? 0xef4444 : 0x1e293b,
        roughness: 0.3,
        metalness: 0.2,
      });
      const bootMesh = new THREE.Mesh(bootGeo, bootMat);
      tipGroup.add(bootMesh);

      const pinGeo = new THREE.CylinderGeometry(0.0018, 0.0018, 0.010, 10);
      pinGeo.rotateX(Math.PI / 2);
      const pinMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.2,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.z = 0.008;
      tipGroup.add(pinMesh);

      grp.add(tipGroup);
    }

    function clearDynamicDraggingWireMesh() {
      const grp = dynamicWireDragGroupRef.current;
      if (grp) grp.clear();
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (viewModeRef.current === 'single-asset') return;
      if (activePointerIds.size > 1) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouseNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // 0A. Handle Live 3D Interactive Wire Dragging between Lamp & Power Supply terminals
      if (wireDragRef.current.isDragging && wireDragRef.current.pointerId === e.pointerId) {
        _activeDragPlane.setComponents(0, 1, 0, -wireDragRef.current.startWorldPos.y);
        raycaster.setFromCamera(mouseNdc, camera);
        const hitPlane = raycaster.ray.intersectPlane(_activeDragPlane, _dragIntersect);
        const currPos = hitPlane ? _dragIntersect.clone() : wireDragRef.current.currentWorldPos;

        const srcArch = wireDragRef.current.sourceArchetype;
        const targetArch =
          srcArch === 'optical-lamp' ? 'optical-power-supply' : 'optical-lamp';
        const targetInst =
          instancesRef.current.find(
            (i) =>
              i.visible &&
              i.instanceState.attachmentSlot !== 'shelf' &&
              assetsMapRef.current.get(i.assetId)?.geometry.proceduralArchetype ===
                targetArch,
          ) ||
          instancesRef.current.find(
            (i) =>
              i.visible &&
              assetsMapRef.current.get(i.assetId)?.geometry.proceduralArchetype ===
                targetArch,
          );

        let snappedPos: THREE.Vector3 | null = null;
        let snappedPolarity: 'pos' | 'neg' | null = null;
        let snappedTargetInstId: string | null = null;

        if (targetInst) {
          const targetObj = instanceObjectsRef.current.get(targetInst.instanceId);
          if (targetObj) {
            const targetPosTerminal = targetObj.getObjectByName('terminal_pos');
            const targetNegTerminal = targetObj.getObjectByName('terminal_neg');

            const pPos = targetPosTerminal
              ? targetPosTerminal.getWorldPosition(new THREE.Vector3())
              : null;
            const pNeg = targetNegTerminal
              ? targetNegTerminal.getWorldPosition(new THREE.Vector3())
              : null;

            const prefTargetPos =
              wireDragRef.current.sourcePolarity === 'pos' ? pPos : pNeg;
            const otherTargetPos =
              wireDragRef.current.sourcePolarity === 'pos' ? pNeg : pPos;

            const rayHitsTarget = raycaster.intersectObject(targetObj, true);
            const isHoveringTarget = rayHitsTarget.length > 0;
            const distPref = prefTargetPos ? currPos.distanceTo(prefTargetPos) : Infinity;
            const distOther = otherTargetPos ? currPos.distanceTo(otherTargetPos) : Infinity;
            const distCenter = currPos.distanceTo(targetObj.position);

            if (prefTargetPos && (distPref < 0.50 || isHoveringTarget || distCenter < 0.50)) {
              snappedPos = prefTargetPos.clone();
              snappedPolarity = wireDragRef.current.sourcePolarity;
              snappedTargetInstId = targetInst.instanceId;
            } else if (otherTargetPos && distOther < 0.50) {
              snappedPos = otherTargetPos.clone();
              snappedPolarity =
                wireDragRef.current.sourcePolarity === 'pos' ? 'neg' : 'pos';
              snappedTargetInstId = targetInst.instanceId;
            }
          }
        }

        wireDragRef.current.currentWorldPos = snappedPos ? snappedPos : currPos;
        wireDragRef.current.snappedTargetPos = snappedPos;
        wireDragRef.current.snappedTargetPolarity = snappedPolarity;
        wireDragRef.current.snappedTargetInstanceId = snappedTargetInstId;

        updateDynamicDraggingWireMesh();

        if (snappedPos) {
          setActiveDockHint(
            `⚡ CẮM DÂY: Nhả chuột để cắm vào chốt ${
              snappedPolarity === 'pos' ? 'ĐỎ (+)' : 'ĐEN (-)'
            }`,
          );
        } else {
          setActiveDockHint(
            `🔌 Đang kéo dây ${
              wireDragRef.current.sourcePolarity === 'pos' ? 'ĐỎ (+)' : 'ĐEN (-)'
            } sang thiết bị đối diện...`,
          );
        }
        requestRender();
        return;
      }

      // 0. Handle active Tinkercad Vertical Elevation ('elevate-y'), Table Yaw ('rotate-y'), or Circular Tilt-Pour ('tilt-pour')
      const tcDrag = tinkercadDragRef.current;
      if (tcDrag.mode && tcDrag.instanceId && tcDrag.pointerId === e.pointerId) {
        if (tcDrag.mode === 'elevate-y') {
          const dyPx = tcDrag.startClientY - e.clientY;
          const metersPerPx = 0.42 / Math.max(240, rect.height);
          const nextLocalY = THREE.MathUtils.clamp(
            tcDrag.startLocalY + dyPx * metersPerPx,
            0,
            0.38,
          );
          tcDrag.targetLocalY = nextLocalY;
          const tcObj = instanceObjectsRef.current.get(tcDrag.instanceId);
          if (tcObj) {
            tcObj.position.y = BENCH_SURFACE_Y + nextLocalY;
          }
          setActiveDockHint(
            `▲ Độ cao so với mặt bàn: ${(nextLocalY * 100).toFixed(1)} cm (Giới hạn: 0.0 cm → 38.0 cm · Nhấp đúp chuột trái để hạ nhanh sát bàn)`,
          );
          requestRender();
          return;
        } else if (tcDrag.mode === 'rotate-y') {
          const dxPx = e.clientX - tcDrag.startClientX;
          const nextYaw = tcDrag.startYawRad + dxPx * 0.015;
          tcDrag.targetYawRad = nextYaw;
          const tcObj = instanceObjectsRef.current.get(tcDrag.instanceId);
          if (tcObj) {
            tcObj.rotation.y = nextYaw;
          }
          const degYaw = Math.round((((nextYaw * 180) / Math.PI) % 360 + 360) % 360);
          setActiveDockHint(`↻ Đang xoay trên mặt bàn: ${degYaw}° (Vòng 360° mặt bàn)`);
          requestRender();
          return;
        } else if (tcDrag.mode === 'tilt-pour') {
          const dxPx = e.clientX - tcDrag.startClientX;
          const dyPx = e.clientY - tcDrag.startClientY;
          // Dragging right or down-right tilts right (-Z); dragging left tilts left (+Z)
          const rawTilt = THREE.MathUtils.clamp(
            -(dxPx * 0.011 + dyPx * 0.004),
            -1.42,
            1.42,
          );
          tcDrag.targetTiltRad = rawTilt;
          requestRender();
          return;
        }
      }

      const ds = dragStateRef.current;

      // Kích hoạt kéo cực nhạy (2px) để vật thể bám chuột ngay tức thì khi người dùng di chuyển chuột
      if (
        !ds.isDragging &&
        pendingGrab &&
        pendingGrab.pointerId === e.pointerId
      ) {
        const moveDist = Math.hypot(
          e.clientX - pendingGrab.startClientX,
          e.clientY - pendingGrab.startClientY,
        );
        const dragThreshold =
          pendingGrab.opticalInteractiveAction || pendingGrab.opticalLensSlotId
            ? 9
            : 3;
        if (moveDist >= dragThreshold) {
          const obj = instanceObjectsRef.current.get(pendingGrab.instanceId);
          if (obj) {
            ds.isDragging = true;
            ds.instanceId = pendingGrab.instanceId;
            ds.grabOffsetX = pendingGrab.grabOffsetX;
            ds.grabOffsetZ = pendingGrab.grabOffsetZ;
            ds.targetPos.set(
              obj.position.x,
              obj.position.y,
              obj.position.z,
            );
            ds.hoverTargetInstanceId = null;
            ds.hoverSlot = 'bench';
            ds.hoverHint = null;
            renderer.domElement.style.cursor = 'grabbing';
            setHoveredEquipment(null);
            labSoundEngine.play('grab-pickup', 0.85);
          }
          pendingGrab = null;
        }
      }

      if (ds.isDragging && ds.instanceId) {
        const draggedObj = instanceObjectsRef.current.get(ds.instanceId);
        const planeY = draggedObj ? draggedObj.position.y : BENCH_SURFACE_Y;
        _activeDragPlane.setComponents(0, 1, 0, -planeY);
        raycaster.setFromCamera(mouseNdc, camera);
        if (raycaster.ray.intersectPlane(_activeDragPlane, _dragIntersect)) {
          const rawX = _dragIntersect.x + ds.grabOffsetX;
          const rawZ = _dragIntersect.z + ds.grabOffsetZ;

          const draggedInst = instancesRef.current.find(
            (i) => i.instanceId === ds.instanceId,
          );
          const draggedAsset = draggedInst
            ? assetsMapRef.current.get(draggedInst.assetId)
            : undefined;

          if (draggedInst && draggedAsset) {
            // KIỂM TRA KÉO THIẾT BỊ VÀO VÙNG CỔNG CHUYỂN KHÔNG GIAN
            const distToPortal = Math.hypot(
              rawX - TRANSPORTER_PORTAL_POSITION.x,
              rawZ - TRANSPORTER_PORTAL_POSITION.z,
            );
            if (distToPortal <= TRANSPORTER_PORTAL_TRIGGER_RADIUS) {
              ds.targetPos.set(
                TRANSPORTER_PORTAL_POSITION.x,
                BENCH_SURFACE_Y + 0.04,
                TRANSPORTER_PORTAL_POSITION.z,
              );
              if (draggedObj) {
                draggedObj.position.x = TRANSPORTER_PORTAL_POSITION.x;
                draggedObj.position.y = BENCH_SURFACE_Y + 0.04;
                draggedObj.position.z = TRANSPORTER_PORTAL_POSITION.z;
              }
              ds.hoverSlot = 'bench';
              ds.hoverTargetInstanceId = null;
              const hint = '🌀 Thả vào Kho chứa để cất tạm thời (Nhấp vào ô "Kho chứa" để xem danh sách)';
              if (ds.hoverHint !== hint) {
                ds.hoverHint = hint;
                setActiveDockHint(hint);
                labSoundEngine.play('dock-hover-snap', 0.85);
              }
              if (transporterPortalRef.current) {
                transporterPortalRef.current.userData.isHovered = true;
              }
              if (snapTargetRingRef.current) {
                snapTargetRingRef.current.position.set(
                  TRANSPORTER_PORTAL_POSITION.x,
                  BENCH_SURFACE_Y + 0.003,
                  TRANSPORTER_PORTAL_POSITION.z,
                );
                snapTargetRingRef.current.visible = true;
              }
              requestRender();
              return;
            } else {
              if (transporterPortalRef.current && transporterPortalRef.current.userData.isHovered) {
                transporterPortalRef.current.userData.isHovered = false;
              }
            }

            const dock = evaluateLabDockingTarget(
              draggedInst,
              draggedAsset,
              rawX,
              rawZ,
            );
            let carryY = dock.pos[1];
            if (dock.slot === 'shelf') {
              carryY = dock.pos[1] || 0.098;
            } else if (dock.slot === 'inside-vessel' && dock.targetInstanceId) {
              carryY = 0.21;
            } else if (dock.slot === 'balance-pan') {
              carryY = 0.082;
            } else if (dock.slot === 'pour-liquid') {
              carryY = dock.pos[1];
            } else if (dock.slot === 'dispenser-outlet') {
              carryY = 0.008;
            } else if (dock.slot === 'bench') {
              carryY = dock.pos[1];
            }
            ds.targetPos.set(
              dock.pos[0],
              BENCH_SURFACE_Y + carryY,
              dock.pos[2],
            );
            // Cập nhật trực tiếp X & Z của vật thể ngay trong sự kiện chuột để bám sát con trỏ chuột 1:1 không trễ nhịp
            if (draggedObj) {
              draggedObj.position.x = dock.pos[0];
              draggedObj.position.z = dock.pos[2];
            }
            const prevHoverSlot = ds.hoverSlot;
            const prevHoverTarget = ds.hoverTargetInstanceId;
            ds.hoverTargetInstanceId = dock.targetInstanceId;
            ds.hoverSlot = dock.slot;
            if (
              dock.slot !== 'bench' &&
              (dock.slot !== prevHoverSlot ||
                dock.targetInstanceId !== prevHoverTarget)
            ) {
              labSoundEngine.play('dock-hover-snap', 0.75);
            }
            if (ds.hoverHint !== dock.hint) {
              ds.hoverHint = dock.hint;
              setActiveDockHint(dock.hint);
            }

            if (snapTargetRingRef.current) {
              if (dock.snapRingPos) {
                snapTargetRingRef.current.position.set(
                  dock.snapRingPos[0],
                  BENCH_SURFACE_Y + dock.snapRingPos[1],
                  dock.snapRingPos[2],
                );
                snapTargetRingRef.current.visible = true;
              } else {
                snapTargetRingRef.current.visible = false;
              }
            }
          }
          requestRender();
        }
        return;
      }

      // Trên thiết bị cảm ứng (touch), không hiển thị hover tooltip trôi theo ngón tay để tránh che mặt bàn 3D
      if (e.pointerType === 'touch') {
        return;
      }

      // Hover cursor affordance & dynamic non-intrusive hover tooltip when not dragging
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        if (isHoveringShelfRef.current) {
          isHoveringShelfRef.current = false;
          hoveredShelfXRef.current = null;
          setIsHoveringShelf(false);
          requestRender();
        }
        setHoveredEquipment((prev) => (prev === null ? null : null));
        return;
      }

      raycaster.setFromCamera(mouseNdc, camera);

      // Check hover over Tinkercad 3D Gizmo handles ('elevate-y', 'tilt-pour', 'rotate-y')
      if (tinkercadGizmoRef.current && tinkercadGizmoRef.current.visible) {
        const gHits = raycaster.intersectObject(
          tinkercadGizmoRef.current,
          true,
        );
        const hHit = gHits.find(
          (h) =>
            isObjectEffectivelyVisible(h.object, tinkercadGizmoRef.current) &&
            Boolean(h.object.userData?.tinkercadHandle),
        );
        if (hHit) {
          const hType = hHit.object.userData.tinkercadHandle as
            | 'elevate-y'
            | 'tilt-pour'
            | 'rotate-y';
          const hSelId = selectedInstanceIdRef.current;
          const hSelInst = hSelId ? instancesRef.current.find((i) => i.instanceId === hSelId) : null;
          const hSelAsset = hSelInst ? assetsMapRef.current.get(hSelInst.assetId) : null;
          const hArch = hSelAsset?.geometry.proceduralArchetype;
          const hCustomMod = hSelAsset ? htmlEquipmentModuleRegistry.getModule(hSelAsset.assetId) : null;
          const hIsLiquid =
            (hArch === 'graduated-cylinder' ||
              hArch === 'beaker-250' ||
              hArch === 'overflow-can' ||
              hArch === 'erlenmeyer-flask' ||
              hArch === 'porcelain-dish' ||
              hArch === 'distillation-flask') &&
            Boolean(hCustomMod ? hCustomMod.moduleControls.canHoldLiquid !== false : true);

          if (hType === 'tilt-pour' && !hIsLiquid) {
            // Không phải bình chứa chất lỏng -> không đổi con trỏ thành xoay rót
          } else {
            renderer.domElement.style.cursor =
              hType === 'elevate-y' ? 'ns-resize' : 'grab';
            setHoveredEquipment(null);
            return;
          }
        }
      }

      // Hover over Cổng chuyển (Transporter Portal)
      const portalGrp = transporterPortalRef.current;
      if (portalGrp && portalGrp.visible) {
        const portalHits = raycaster.intersectObject(portalGrp, true);
        const isPortalHit = portalHits.length > 0;
        if (isPortalHit) {
          if (!portalGrp.userData.isHovered) {
            portalGrp.userData.isHovered = true;
            requestRender();
          }
          renderer.domElement.style.cursor = 'pointer';
          setHoveredEquipment(null);
          return;
        } else if (portalGrp.userData.isHovered) {
          portalGrp.userData.isHovered = false;
          requestRender();
        }
      }

      // Kiểm tra xem con trỏ chuột có đang rà vào vùng Khu trưng bày (kệ kính mờ phía sau sát trục X) hay không
      let nextHoverShelf = false;
      let nextHoverShelfX: number | null = null;
      const shelfGroupObj = benchGroupRef.current?.getObjectByName(
        'display_zone_shelf_group',
      );
      if (shelfGroupObj) {
        const shelfHits = raycaster.intersectObject(shelfGroupObj, true);
        if (shelfHits.length > 0) {
          nextHoverShelf = true;
          nextHoverShelfX = shelfHits[0].point.x;
        }
      }
      if (!nextHoverShelf && raycaster.ray.intersectPlane(_rayPlane, _dragIntersect)) {
        if (_dragIntersect.z <= -0.25 && Math.abs(_dragIntersect.x) <= 0.68) {
          nextHoverShelf = true;
          nextHoverShelfX = _dragIntersect.x;
        }
      }

      const pickables: THREE.Object3D[] = [];
      instanceObjectsRef.current.forEach((group, instId) => {
        const inst = instancesRef.current.find((i) => i.instanceId === instId);
        if (inst && inst.visible) {
          pickables.push(group);
        }
      });
      const hits = raycaster.intersectObjects(pickables, true);
      const validHits = hits.filter((h) => isRealEquipmentMesh(h.object));
      if (validHits.length > 0) {
        let curr: THREE.Object3D | null = validHits[0].object;
        while (curr && !curr.userData?.instanceId) {
          curr = curr.parent;
        }
        const hitInstId = curr?.userData?.instanceId as string | undefined;
        const hitInst = hitInstId
          ? instancesRef.current.find((i) => i.instanceId === hitInstId)
          : undefined;
        const hitAsset = hitInst
          ? assetsMapRef.current.get(hitInst.assetId)
          : undefined;

        if (hitInst?.instanceState.attachmentSlot === 'shelf') {
          nextHoverShelf = true;
          nextHoverShelfX = hitInst.transform.positionM[0];
        }

        if (
          nextHoverShelf !== isHoveringShelfRef.current ||
          (nextHoverShelfX !== null &&
            hoveredShelfXRef.current !== null &&
            Math.abs(nextHoverShelfX - hoveredShelfXRef.current) > 0.02)
        ) {
          isHoveringShelfRef.current = nextHoverShelf;
          hoveredShelfXRef.current = nextHoverShelfX;
          setIsHoveringShelf(nextHoverShelf);
          requestRender();
        }

        const isHoveringTareBtn = Boolean(
          validHits.find(
            (h) =>
              h.object.visible &&
              (h.object.userData?.isTareButton || h.object.name === 'tare_button_3d'),
          ),
        );

        renderer.domElement.style.cursor = isHoveringTareBtn
          ? 'pointer'
          : hitInst && !hitInst.locked
            ? 'grab'
            : 'pointer';

        if (hitInst && hitAsset) {
          const { readoutBadge, isDigitalScale, interactionHint } =
            computeLiveEquipmentReadout(hitInst, hitAsset);
          const isOnShelf = hitInst.instanceState.attachmentSlot === 'shelf';
          const effectiveHint = isHoveringTareBtn
            ? '🔘 Nhấp chuột để bấm nút Trừ bì (TARE) về 0.00 g'
            : isOnShelf
              ? '↘ Đang trên Khu trưng bày: Kéo ra mặt bàn hoặc Nhấp chuột để lấy ra thực hành'
              : interactionHint;
          const localX = Math.round(e.clientX - rect.left);
          const localY = Math.round(e.clientY - rect.top);
          const dims = hitAsset.geometry.boundingBoxM;
          const dimensionsMm = `${Math.round(dims.width * 1000)} × ${Math.round(
            dims.height * 1000,
          )} × ${Math.round(dims.depth * 1000)} mm`;

          setHoveredEquipment((prev) => {
            if (
              prev &&
              prev.instanceId === hitInst.instanceId &&
              prev.readoutBadge === readoutBadge &&
              Math.abs(prev.x - localX) < 3 &&
              Math.abs(prev.y - localY) < 3
            ) {
              return prev;
            }
            return {
              instanceId: hitInst.instanceId,
              assetId: hitAsset.assetId,
              title: hitInst.customLabel || hitAsset.name.vi,
              englishName: hitAsset.name.en,
              readoutBadge: isOnShelf ? 'KHU TRƯNG BÀY' : readoutBadge,
              isDigitalScale,
              sgkFigure: hitAsset.textbookRef?.figureLabel,
              interactionHint: effectiveHint,
              dimensionsMm,
              x: localX,
              y: localY,
            };
          });

          // Check if hovering directly on an interactive banana terminal
          let hoveredTerm:
            | { polarity: 'pos' | 'neg'; mesh: THREE.Mesh; label: string; ownerInstId: string }
            | undefined;
          for (const vHit of hits) {
            let nodeScan: THREE.Object3D | null = vHit.object;
            let termNode: THREE.Object3D | null = null;
            while (nodeScan) {
              if (
                nodeScan.userData?.interactiveTerminal &&
                nodeScan.userData?.terminalPolarity
              ) {
                termNode = nodeScan;
              }
              if (termNode && nodeScan.userData?.instanceId) {
                hoveredTerm = {
                  polarity: termNode.userData.terminalPolarity as 'pos' | 'neg',
                  mesh: termNode as THREE.Mesh,
                  label:
                    (termNode.userData.terminalLabel as string) ||
                    (termNode.userData.terminalPolarity === 'pos'
                      ? 'Chốt Đỏ (+)'
                      : 'Chốt Đen (-)'),
                  ownerInstId: nodeScan.userData.instanceId as string,
                };
                break;
              }
              nodeScan = nodeScan.parent;
            }
            if (hoveredTerm) break;
          }

          if (hoveredTerm) {
            const lampInst = instancesRef.current.find(
              (i) =>
                i.visible &&
                assetsMapRef.current.get(i.assetId)?.geometry
                  .proceduralArchetype === 'optical-lamp',
            );
            const isPos = hoveredTerm.polarity === 'pos';
            const isPlugged = Boolean(
              lampInst &&
                (isPos
                  ? lampInst.instanceState.wirePosConnected !== false &&
                    lampInst.instanceState.isCablesConnected !== false
                  : lampInst.instanceState.wireNegConnected !== false &&
                    lampInst.instanceState.isCablesConnected !== false),
            );
            const termWorld = new THREE.Vector3();
            hoveredTerm.mesh.getWorldPosition(termWorld);
            const termProj = termWorld.clone().project(camera);
            const tx = ((termProj.x + 1) / 2) * rect.width;
            const ty = ((-termProj.y + 1) / 2) * rect.height;

            setHoveredTerminal({
              instanceId: hoveredTerm.ownerInstId || hitInst.instanceId,
              polarity: hoveredTerm.polarity,
              label: hoveredTerm.label,
              screenX: tx,
              screenY: ty,
              isConnected: isPlugged,
            });
            renderer.domElement.style.cursor = 'crosshair';
          } else {
            setHoveredTerminal(null);
          }
          return;
        }
      }

      if (
        nextHoverShelf !== isHoveringShelfRef.current ||
        (nextHoverShelfX !== null &&
          hoveredShelfXRef.current !== null &&
          Math.abs(nextHoverShelfX - hoveredShelfXRef.current) > 0.02)
      ) {
        isHoveringShelfRef.current = nextHoverShelf;
        hoveredShelfXRef.current = nextHoverShelfX;
        setIsHoveringShelf(nextHoverShelf);
        requestRender();
      }

      renderer.domElement.style.cursor = 'default';
      setHoveredEquipment((prev) => (prev === null ? null : null));
      setHoveredTerminal(null);
    };

    const handlePointerUp = (e: PointerEvent) => {
      activePointerIds.delete(e.pointerId);

      // 0A. Finish Interactive 3D Wire Dragging or Tap-to-Unplug
      if (wireDragRef.current.isDragging && wireDragRef.current.pointerId === e.pointerId) {
        try {
          renderer.domElement.releasePointerCapture(e.pointerId);
        } catch {}

        const wd = wireDragRef.current;
        const lampInst = instancesRef.current.find(
          (i) =>
            i.visible &&
            assetsMapRef.current.get(i.assetId)?.geometry.proceduralArchetype ===
              'optical-lamp',
        );
        const psuInst = instancesRef.current.find(
          (i) =>
            i.visible &&
            assetsMapRef.current.get(i.assetId)?.geometry.proceduralArchetype ===
              'optical-power-supply',
        );

        const targetArch =
          wd.sourceArchetype === 'optical-lamp' ? 'optical-power-supply' : 'optical-lamp';
        const targetInst = targetArch === 'optical-lamp' ? lampInst : psuInst;

        let shouldConnect = Boolean(wd.snappedTargetPos);

        if (!shouldConnect && targetInst) {
          const targetObj = instanceObjectsRef.current.get(targetInst.instanceId);
          if (targetObj) {
            const distToTarget = wd.currentWorldPos.distanceTo(targetObj.position);
            // Nếu nhả chuột trong phạm vi 50 cm quanh thiết bị đối diện -> Tự động cắm chốt thành công!
            if (distToTarget < 0.50) {
              shouldConnect = true;
            }
          }
        }

        if (shouldConnect && lampInst && onUpdateInstanceStateRef.current) {
          const isPos = wd.sourcePolarity === 'pos';
          labSoundEngine.play('dock-hover-snap', 1.0);

          const curPosConnected =
            lampInst.instanceState.wirePosConnected ??
            (lampInst.instanceState.isCablesConnected !== false);
          const curNegConnected =
            lampInst.instanceState.wireNegConnected ??
            (lampInst.instanceState.isCablesConnected !== false);

          const nextPosConnected = isPos ? true : curPosConnected;
          const nextNegConnected = !isPos ? true : curNegConnected;
          const bothConnected = nextPosConnected && nextNegConnected;

          const isPsuOn = Boolean(psuInst?.instanceState.isPoweredOn);
          const curVoltageV = psuInst?.instanceState.supplyVoltageV ?? 12.0;
          const willLight = bothConnected && isPsuOn && curVoltageV >= 2.5;

          onUpdateInstanceStateRef.current(
            lampInst.instanceId,
            {
              wirePosConnected: nextPosConnected,
              wireNegConnected: nextNegConnected,
              isCablesConnected: bothConnected,
              isPoweredOn: true,
              isLampLit: willLight,
            },
            `🔌 Đã cắm chốt ${isPos ? 'ĐỎ (+)' : 'ĐEN (-)'}! ${
              bothConnected
                ? '⚡ Mạch kín: Cả 2 dây nguồn đã kết nối sẵn sàng!' + (isPsuOn ? ' Đèn phát sáng ngay!' : '')
                : '👉 Còn thiếu chốt ' + (isPos ? 'ĐEN (-)' : 'ĐỎ (+)') + ', hãy kéo tiếp dây còn lại.'
            }`,
          );
          onNotifyRef.current?.(
            `⚡ Đã cắm dây ${isPos ? 'ĐỎ (+)' : 'ĐEN (-)'} thành công! ${
              bothConnected
                ? '⚡ Mạch kín hoàn tất' + (isPsuOn ? ' - Đèn phát sáng ngay!' : '.')
                : 'Hãy kéo tiếp dây còn lại.'
            }`,
            'info',
          );
        } else if (
          wd.startWorldPos.distanceTo(wd.currentWorldPos) < 0.03 &&
          lampInst &&
          onUpdateInstanceStateRef.current
        ) {
          // Tap on terminal without dragging -> Toggle/unplug that wire, or enter Click-to-Connect!
          const isPos = wd.sourcePolarity === 'pos';
          const curPosConnected =
            lampInst.instanceState.wirePosConnected ??
            (lampInst.instanceState.isCablesConnected !== false);
          const curNegConnected =
            lampInst.instanceState.wireNegConnected ??
            (lampInst.instanceState.isCablesConnected !== false);
          const isCurrentlyPlugged = isPos ? curPosConnected : curNegConnected;

          if (isCurrentlyPlugged) {
            labSoundEngine.play('mechanical-click', 0.9);
            const nextPosConnected = isPos ? false : curPosConnected;
            const nextNegConnected = !isPos ? false : curNegConnected;
            onUpdateInstanceStateRef.current(
              lampInst.instanceId,
              {
                wirePosConnected: nextPosConnected,
                wireNegConnected: nextNegConnected,
                isCablesConnected: false,
                isLampLit: false,
              },
              `🔌 Đã rút dây ${isPos ? 'ĐỎ (+)' : 'ĐEN (-)'} khỏi chốt.`,
            );
            onNotifyRef.current?.(
              `🔌 Đã rút dây ${isPos ? 'ĐỎ (+)' : 'ĐEN (-)'}.`,
              'info',
            );
          } else {
            // Nhấp chuột vào chốt khi chưa cắm: Cắm dây tức thì (Click-to-Connect 2 chiều)
            labSoundEngine.play('dock-hover-snap', 1.0);
            const nextPosConnected = isPos ? true : curPosConnected;
            const nextNegConnected = !isPos ? true : curNegConnected;
            const bothConnected = nextPosConnected && nextNegConnected;

            const isPsuOn = Boolean(psuInst?.instanceState.isPoweredOn);
            const curVoltageV = psuInst?.instanceState.supplyVoltageV ?? 12.0;
            const willLight = bothConnected && isPsuOn && curVoltageV >= 2.5;

            onUpdateInstanceStateRef.current(
              lampInst.instanceId,
              {
                wirePosConnected: nextPosConnected,
                wireNegConnected: nextNegConnected,
                isCablesConnected: bothConnected,
                isPoweredOn: true,
                isLampLit: willLight,
              },
              `🔌 Đã cắm chốt ${isPos ? 'ĐỎ (+)' : 'ĐEN (-)'}! ${
                bothConnected
                  ? '⚡ Mạch kín: Cả 2 dây nguồn đã kết nối sẵn sàng!' + (isPsuOn ? ' Đèn phát sáng ngay!' : '')
                  : '👉 Còn thiếu chốt ' + (isPos ? 'ĐEN (-)' : 'ĐỎ (+)') + ', hãy nhấp tiếp chốt còn lại.'
              }`,
            );
            onNotifyRef.current?.(
              `⚡ Đã cắm dây ${isPos ? 'ĐỎ (+)' : 'ĐEN (-)'} thành công! ${
                bothConnected
                  ? '⚡ Mạch kín hoàn tất' + (isPsuOn ? ' - Đèn phát sáng ngay!' : '.')
                  : 'Hãy nhấp tiếp chốt còn lại.'
              }`,
              'info',
            );
          }
        }

        wireDragRef.current.isDragging = false;
        wireDragRef.current.snappedTargetPos = null;
        clearDynamicDraggingWireMesh();
        orbit.enabled = true;
        renderer.domElement.style.cursor = 'default';
        setActiveDockHint(null);
        requestRender();
        return;
      }

      // 0. Finish Tinkercad Vertical Elevation ('elevate-y') or Circular Tilt-Pour ('tilt-pour')
      const tcDrag = tinkercadDragRef.current;
      if (tcDrag.mode && tcDrag.instanceId && tcDrag.pointerId === e.pointerId) {
        const finishedMode = tcDrag.mode;
        const finishedInstId = tcDrag.instanceId;
        const finalLocalY = THREE.MathUtils.clamp(tcDrag.targetLocalY, 0, 0.38);
        const pouredMl = tcDrag.pouredTotalMl;
        const nextSrcMl = tcDrag.liveSourceMl;
        const targetId = tcDrag.activeTargetId;
        const nextDstMl = tcDrag.liveTargetMl;

        tcDrag.mode = null;
        tcDrag.instanceId = null;
        tcDrag.pointerId = null;
        tcDrag.targetTiltRad = 0;
        tcDrag.pouredTotalMl = 0;
        tcDrag.spilledTotalMl = 0;
        orbit.enabled = true;
        renderer.domElement.style.cursor = 'grab';
        setActiveDockHint(null);
        if (pouringStreamRef.current) {
          pouringStreamRef.current.visible = false;
        }
        const puddle = scene.getObjectByName('bench_spill_puddle') as THREE.Mesh | undefined;
        if (puddle) {
          puddle.visible = false;
        }

        const tcObj = instanceObjectsRef.current.get(finishedInstId);
        if (finishedMode === 'elevate-y' && tcObj) {
          tcObj.position.y = BENCH_SURFACE_Y + finalLocalY;
          labSoundEngine.play('dock-hover-snap', 0.75);
          onUpdateTransformRef.current(
            finishedInstId,
            [
              Number(tcObj.position.x.toFixed(3)),
              Number(finalLocalY.toFixed(3)),
              Number(tcObj.position.z.toFixed(3)),
            ],
            [
              Number(tcObj.rotation.x.toFixed(3)),
              Number(tcObj.rotation.y.toFixed(3)),
              0,
            ],
          );
        } else if (finishedMode === 'tilt-pour') {
          // Commit poured water volume if any water flowed out, while vessel springs back upright to 0° in render loop
          if (pouredMl > 0.05 && onContinuousPourRef.current) {
            labSoundEngine.play('water-pour', 0.85);
            onContinuousPourRef.current(
              finishedInstId,
              targetId,
              nextSrcMl,
              targetId ? nextDstMl : null,
              pouredMl,
            );
          } else {
            labSoundEngine.play('ui-toggle', 0.65);
          }
        } else if (finishedMode === 'rotate-y' && tcObj) {
          labSoundEngine.play('ui-toggle', 0.7);
          const localY = Math.max(0, tcObj.position.y - BENCH_SURFACE_Y);
          onUpdateTransformRef.current(
            finishedInstId,
            [
              Number(tcObj.position.x.toFixed(3)),
              Number(localY.toFixed(3)),
              Number(tcObj.position.z.toFixed(3)),
            ],
            [
              Number(tcObj.rotation.x.toFixed(3)),
              Number(tcObj.rotation.y.toFixed(3)),
              0,
            ],
          );
        }
        updateProjectedOverlays();
        requestRender();
        return;
      }

      // Nếu đây chỉ là một cú chạm (Tap < 6px) vào thiết bị 3D mà chưa kéo đi:
      // - Nếu vật thể đang nằm trên Khu trưng bày ('shelf'), tự động đưa vật thể nhảy từ Khu trưng bày ra bàn thực hành!
      // - Nếu vật thể đã ở trên bàn, chọn vật thể và khôi phục OrbitControls.
      if (pendingGrab && pendingGrab.pointerId === e.pointerId) {
        const tappedInstId = pendingGrab.instanceId;
        const tappedLensSlotId = pendingGrab.opticalLensSlotId;
        const tappedOpticalAction = pendingGrab.opticalInteractiveAction;
        pendingGrab = null;
        orbit.enabled = true;
        const tappedInst = instancesRef.current.find(
          (i) => i.instanceId === tappedInstId,
        );
        if (
          tappedInst &&
          tappedInst.instanceState.attachmentSlot === 'shelf' &&
          onQuickLabActionRef.current
        ) {
          labSoundEngine.play('dock-hover-snap', 0.85);
          onQuickLabActionRef.current('delete-instance', tappedInstId);
          updateProjectedOverlays();
          requestRender();
          return;
        }

        // Handle direct 3D click on a lens inside (7) Hộp thấu kính -> mounts that lens onto (3) Thấu kính!
        if (tappedInst && tappedLensSlotId && onUpdateInstanceStateRef.current) {
          const spec = OPTICAL_LENS_SPECS[tappedLensSlotId];
          const lensOnBench =
            instancesRef.current.find(
              (i) =>
                i.visible &&
                assetsMapRef.current.get(i.assetId)?.geometry
                  .proceduralArchetype === 'optical-lens',
            ) ?? tappedInst;
          if (spec) {
            labSoundEngine.play('glass-clink', 0.9);
            onUpdateInstanceStateRef.current(
              lensOnBench.instanceId,
              {
                lensProfileId: tappedLensSlotId,
                focalLengthCm: spec.focalLengthCm,
              },
              `Hộp thấu kính (7): Đã lấy ${spec.nameVi} (${spec.diopterLabel}) lắp lên Giá đỡ thấu kính (3)`,
            );
            updateProjectedOverlays();
            requestRender();
            return;
          }
        }

        // Handle direct 3D click on interactive sub-parts of Power Supply (5), Lamp (1), or Lens Holder (3)
        if (tappedInst && tappedOpticalAction && onUpdateInstanceStateRef.current) {
          if (tappedOpticalAction === 'toggle-psu-power') {
            const nextOn = tappedInst.instanceState.isPoweredOn === false;
            labSoundEngine.play('ui-toggle', 0.95);
            onUpdateInstanceStateRef.current(
              tappedInst.instanceId,
              { isPoweredOn: nextOn },
              nextOn
                ? 'Biến áp nguồn (5): Đã BẬT công tắc nguồn điện cấp cho Đèn chiếu sáng (1)'
                : 'Biến áp nguồn (5): Đã TẮT công tắc nguồn điện',
            );
            const lampInst = instancesRef.current.find(
              (i) =>
                i.visible &&
                assetsMapRef.current.get(i.assetId)?.geometry.proceduralArchetype ===
                  'optical-lamp',
            );
            if (lampInst) {
              const curPos = lampInst.instanceState.wirePosConnected ?? (lampInst.instanceState.isCablesConnected !== false);
              const curNeg = lampInst.instanceState.wireNegConnected ?? (lampInst.instanceState.isCablesConnected !== false);
              // BẬT NGUỒN LÀ ĐÈN SÁNG LUÔN: Tự động cắm sẵn dây và đóng mạch kín
              const nextPos = nextOn ? true : curPos;
              const nextNeg = nextOn ? true : curNeg;
              const wiresClosed = nextPos && nextNeg;
              const psuV = tappedInst.instanceState.supplyVoltageV ?? 12;
              const willLight = nextOn && wiresClosed && psuV >= 2.5;
              onUpdateInstanceStateRef.current(lampInst.instanceId, {
                isPoweredOn: true,
                wirePosConnected: nextPos,
                wireNegConnected: nextNeg,
                isCablesConnected: wiresClosed,
                isLampLit: willLight,
              });
              onNotifyRef.current?.(
                nextOn
                  ? '⚡ Đã BẬT NGUỒN: Mạch kín đã sẵn sàng, Đèn phát sáng tức thì!'
                  : '⚡ Đã ngắt công tắc nguồn điện.',
                'info',
              );
            }
          } else if (tappedOpticalAction === 'cycle-psu-voltage') {
            const curV =
              typeof tappedInst.instanceState.voltageStepV === 'number' && tappedInst.instanceState.voltageStepV > 0
                ? tappedInst.instanceState.voltageStepV
                : (tappedInst.instanceState.supplyVoltageV ?? 12);
            const steps = [3, 6, 9, 12];
            const nextV =
              steps[(steps.findIndex((v) => Math.abs(v - curV) < 1.2) + 1) % steps.length] ?? 12;
            labSoundEngine.play('caliper-slide', 0.85);
            onUpdateInstanceStateRef.current(
              tappedInst.instanceId,
              { supplyVoltageV: nextV, voltageStepV: nextV, voltageSetting: nextV, isPoweredOn: true },
              `Biến áp nguồn (6): Đã vặn núm chỉnh điện áp sang ${nextV}.0 V DC`,
            );
          } else if (
            tappedOpticalAction === 'cycle-beam-mode' ||
            tappedOpticalAction === 'cycle-lamp-beam-mode'
          ) {
            // Xoay núm chuyển chế độ 1, 2, 3 tia sáng mượt mà bất kể đèn bật hay tắt
            const curBm = tappedInst.instanceState.beamMode ?? 'triple';
            const cycleOrder: Array<{
              exp: 'laser_rays' | 'f_object';
              bm: 'single' | 'double' | 'triple' | 'bundle' | 'divergent' | 'f_rays';
              label: string;
            }> = [
              { exp: 'laser_rays', bm: 'single', label: '1 Tia sáng đơn' },
              { exp: 'laser_rays', bm: 'double', label: '2 Tia sáng song song' },
              { exp: 'laser_rays', bm: 'triple', label: '3 Tia sáng chuẩn SGK' },
              { exp: 'laser_rays', bm: 'bundle', label: 'Chùm tia song song' },
              { exp: 'laser_rays', bm: 'divergent', label: 'Chùm tia phân kì' },
              { exp: 'f_object', bm: 'f_rays', label: 'Vật sáng chữ F (SGK Hình 8.12)' },
            ];
            const curIdx = cycleOrder.findIndex((c) => c.bm === curBm);
            const nextMode =
              cycleOrder[(curIdx >= 0 ? curIdx + 1 : 0) % cycleOrder.length];
            labSoundEngine.play('caliper-slide', 0.95);
            onUpdateInstanceStateRef.current(
              tappedInst.instanceId,
              {
                experimentMode: nextMode.exp,
                beamMode: nextMode.bm,
              },
              `💡 Cửa chắn sáng (1): Đã vặn núm chuyển sang "${nextMode.label}"`,
            );
            onNotifyRef.current?.(
              `💡 Chế độ đèn: ${nextMode.label}`,
              'info',
            );
          } else if (tappedOpticalAction === 'cycle-lens-profile') {
            const order: OpticalLensSpec['id'][] = [
              'conv_5',
              'conv_10',
              'conv_15',
              'div_10',
              'div_20',
              'flat_inf',
            ];
            const curPid = tappedInst.instanceState.lensProfileId ?? 'conv_10';
            const nextPid = order[(order.indexOf(curPid) + 1) % order.length];
            const nextSpec = OPTICAL_LENS_SPECS[nextPid];
            labSoundEngine.play('glass-clink', 0.88);
            onUpdateInstanceStateRef.current(
              tappedInst.instanceId,
              {
                lensProfileId: nextPid,
                focalLengthCm: nextSpec.focalLengthCm,
              },
              `Giá đỡ thấu kính (3): Đã đổi sang ${nextSpec.nameVi} (${nextSpec.diopterLabel})`,
            );
          }
          updateProjectedOverlays();
          requestRender();
          return;
        }

        updateProjectedOverlays();
        requestRender();
        return;
      }

      // Nếu chạm nhẹ (< 6px) vào khoảng trống ngoài thiết bị: bỏ chọn thiết bị để tự động ẩn khung thông tin
      if (emptyTapStart && emptyTapStart.pointerId === e.pointerId) {
        const tapDist = Math.hypot(
          e.clientX - emptyTapStart.startClientX,
          e.clientY - emptyTapStart.startClientY,
        );
        emptyTapStart = null;
        if (tapDist < 6) {
          if (selectedInstanceIdRef.current) {
            selectedInstanceIdRef.current = null;
            onSelectInstanceRef.current(null);
          }
          setIsWaterValveOpenUI(false);
          setIsCompassHudExpanded(false);
          if (window.innerWidth < 768) {
            setIsMobileToolsOpen(false);
            setDeviceSheetMode('collapsed');
          }
          updateProjectedOverlays();
          requestRender();
        }
      }

      const ds = dragStateRef.current;
      if (!ds.isDragging || !ds.instanceId) {
        orbit.enabled = true;
        return;
      }

      const draggedId = ds.instanceId;
      const obj = instanceObjectsRef.current.get(draggedId);
      const draggedInst = instancesRef.current.find((i) => i.instanceId === draggedId);
      const draggedAsset = draggedInst
        ? assetsMapRef.current.get(draggedInst.assetId)
        : undefined;

      ds.isDragging = false;
      ds.instanceId = null;
      orbit.enabled = true;
      renderer.domElement.style.cursor = 'grab';
      setActiveDockHint(null);
      if (snapTargetRingRef.current) {
        snapTargetRingRef.current.visible = false;
      }
      if (pouringStreamRef.current) {
        pouringStreamRef.current.visible = false;
      }
      if (transporterPortalRef.current) {
        transporterPortalRef.current.userData.isHovered = false;
      }

      // KIỂM TRA THẢ VẬT THỂ VÀO CỔNG CHUYỂN KHÔNG GIAN ("KHO CHỨA")
      const distToPortal = Math.hypot(
        ds.targetPos.x - TRANSPORTER_PORTAL_POSITION.x,
        ds.targetPos.z - TRANSPORTER_PORTAL_POSITION.z,
      );
      if (distToPortal <= TRANSPORTER_PORTAL_TRIGGER_RADIUS) {
        const label = draggedInst?.customLabel || draggedAsset?.name?.vi || 'thiết bị';

        // Ghi nhận vào danh sách tạm thời trong Kho chứa
        const storedItem: WarehouseStoredItem = {
          id: `wh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          instanceId: draggedId,
          assetId: draggedInst?.assetId || draggedAsset?.assetId || '',
          nameVi: label,
          categoryVi: draggedAsset?.category || 'Dụng cụ',
          thumbnailUrl: (draggedAsset as any)?.catalogThumbnail || (draggedAsset as any)?.thumbnailUrl,
          customLabel: draggedInst?.customLabel,
          storedTime: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        };
        setWarehouseItems((prev) => [storedItem, ...prev]);

        if (onDeleteInstanceRef.current) {
          onDeleteInstanceRef.current(draggedId);
        } else if (onQuickLabActionRef.current) {
          onQuickLabActionRef.current('delete-instance', draggedId);
        }

        if (selectedInstanceIdRef.current === draggedId) {
          selectedInstanceIdRef.current = null;
          onSelectInstanceRef.current(null);
        }

        if (transporterPortalRef.current) {
          transporterPortalRef.current.userData.warpPulse = 1.0;
        }
        labSoundEngine.play('dock-hover-snap', 1.0);

        if (onNotifyRef.current) {
          onNotifyRef.current(
            `🌀 Đã chuyển "${label}" vào Kho chứa. Nhấp vào ô "Kho chứa" để xem danh sách hoặc xóa!`,
            'success',
          );
        }
        requestRender();
        return;
      }

      if (obj && draggedInst && draggedAsset) {
        const dock = evaluateLabDockingTarget(
          draggedInst,
          draggedAsset,
          ds.targetPos.x,
          ds.targetPos.z,
        );

        // If pouring liquid, trigger realistic pouring animation before settling beside the target vessel
        let settleX = dock.pos[0];
        let settleZ = dock.pos[2];
        if (dock.slot === 'pour-liquid' && dock.targetInstanceId) {
          const targetInst = instancesRef.current.find(
            (i) => i.instanceId === dock.targetInstanceId,
          );
          const targetAsset = targetInst
            ? assetsMapRef.current.get(targetInst.assetId)
            : undefined;
          const targetArch = targetAsset?.geometry.proceduralArchetype;
          const tx = targetInst?.transform.positionM[0] ?? dock.pos[0];
          const tz = targetInst?.transform.positionM[2] ?? dock.pos[2];
          settleX = THREE.MathUtils.clamp(
            tx - 0.105,
            -BENCH_LIMIT_X,
            BENCH_LIMIT_X,
          );
          settleZ = THREE.MathUtils.clamp(
            tz + 0.025,
            -BENCH_LIMIT_Z,
            BENCH_LIMIT_Z,
          );
          const srcCap =
            draggedAsset.geometry.proceduralArchetype === 'overflow-can'
              ? 210
              : draggedAsset.scientificProperties.capacity?.value ?? 100;
          const dstCap =
            targetArch === 'overflow-can'
              ? 210
              : targetAsset?.scientificProperties.capacity?.value ?? 100;
          const srcCurMl =
            draggedInst.instanceState.baseLiquidLevelMl ??
            draggedInst.instanceState.liquidLevelMl ??
            40;
          const dstCurMl =
            targetInst?.instanceState.baseLiquidLevelMl ??
            targetInst?.instanceState.liquidLevelMl ??
            dstCap * 0.5;
          const defaultPour =
            targetArch === 'overflow-can' && dstCurMl < 210
              ? Math.min(50, 210 - dstCurMl)
              : 20;
          const pourAmt = Math.max(
            0,
            Math.min(defaultPour, srcCurMl, dstCap - dstCurMl),
          );

          if (pourAmt > 0.2) {
            const exactKin = computeExactPourPosition(draggedAsset, targetAsset, tx, tz);
            activePourAnimRef.current = {
              sourceId: draggedId,
              targetId: dock.targetInstanceId,
              startTimeMs: performance.now(),
              durationMs: 1120,
              pourX: exactKin.pourX,
              pourY: exactKin.pourY,
              pourZ: exactKin.pourZ,
              targetX: tx,
              targetRimY: exactKin.targetRimY,
              targetZ: tz,
              settleX,
              settleZ,
              srcStartScaleY: THREE.MathUtils.clamp((srcCurMl / srcCap) / 0.5, 0.08, 2.0),
              srcEndScaleY: THREE.MathUtils.clamp(((srcCurMl - pourAmt) / srcCap) / 0.5, 0.0, 2.0),
              dstStartScaleY: THREE.MathUtils.clamp((dstCurMl / dstCap) / 0.5, 0.08, 2.0),
              dstEndScaleY: THREE.MathUtils.clamp(((dstCurMl + pourAmt) / dstCap) / 0.5, 0.08, 2.0),
            };
          }
        } else if (dock.slot === 'dispenser-outlet' && dock.targetInstanceId) {
          const isDraggingDispenser =
            draggedAsset.geometry.proceduralArchetype === 'water-dispenser';
          const vesselId = isDraggingDispenser
            ? dock.targetInstanceId
            : draggedId;
          const vesselInst = instancesRef.current.find(
            (i) => i.instanceId === vesselId,
          );
          const vesselAsset = vesselInst
            ? assetsMapRef.current.get(vesselInst.assetId)
            : undefined;
          const vesselArch = vesselAsset?.geometry.proceduralArchetype;
          const vesselCap =
            vesselArch === 'overflow-can'
              ? 210
              : vesselAsset?.scientificProperties.capacity?.value ?? 100;
          const vesselCurMl =
            vesselInst?.instanceState.baseLiquidLevelMl ??
            vesselInst?.instanceState.liquidLevelMl ??
            vesselCap * 0.5;
          const autoDispenseMl =
            vesselArch === 'overflow-can' && vesselCurMl < 210
              ? Math.max(0, 210 - vesselCurMl)
              : Math.max(0, Math.min(25, vesselCap - vesselCurMl));
          setValveTargetInstanceId(vesselId);
          setIsWaterValveOpenUI(true);
          if (autoDispenseMl > 0.2) {
            triggerDispenseVisualAnimation(vesselId, autoDispenseMl, 'add');
          }
        }

        const finalY =
          dock.slot === 'shelf'
            ? dock.pos[1] || 0.098
            : dock.slot === 'balance-pan'
              ? 0.068
              : dock.slot === 'inside-vessel'
                ? 0.016
                : dock.slot === 'dynamometer-hook'
                  ? 0.025
                  : dock.slot === 'caliper-jaws'
                    ? 0.008
                    : dock.slot === 'optical-bench-rail'
                      ? 0
                      : dock.pos[1];
        const finalPos: [number, number, number] = [
          Number(settleX.toFixed(3)),
          Number(finalY.toFixed(3)),
          Number((dock.slot === 'shelf' ? -0.45 : settleZ).toFixed(3)),
        ];

        // Đặt trên mặt bàn theo đúng chuẩn anchor 'base-center' tại worldY = BENCH_SURFACE_Y (0.82 m) + finalY
        if (dock.slot !== 'pour-liquid') {
          obj.position.set(
            finalPos[0],
            BENCH_SURFACE_Y + finalPos[1],
            finalPos[2],
          );
          obj.rotation.x = 0;
          obj.rotation.z = 0;
          if (dock.slot === 'optical-bench-rail' || dock.slot === 'shelf') {
            obj.rotation.y = 0;
          }
          const liqSurf = obj.getObjectByName('liquid_surface');
          if (liqSurf) liqSurf.rotation.z = 0;
        }

        if (dock.slot === 'shelf') {
          selectedInstanceIdRef.current = null;
          onSelectInstanceRef.current(null);
        }

        if (onPhysicalDockRef.current) {
          onPhysicalDockRef.current(
            draggedId,
            dock.targetInstanceId,
            dock.slot,
            finalPos,
          );
        } else {
          onUpdateTransformRef.current(draggedId, finalPos, [
            0,
            Number(obj.rotation.y.toFixed(3)),
            0,
          ]);
        }
        updateProjectedOverlays();
        requestRender();
      }
    };

    const handlePointerCancel = (e: PointerEvent) => {
      activePointerIds.delete(e.pointerId);
      emptyTapStart = null;
      cancelActiveOrPendingDrag();
    };

    const handleDblClick = (e: MouseEvent) => {
      e.preventDefault();

      // Kiểm tra nhấp đúp (double-click) chuột trái vào thiết bị trên bàn hoặc Khu trưng bày
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseNdcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseNdcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const dblRaycaster = new THREE.Raycaster();
      dblRaycaster.setFromCamera(new THREE.Vector2(mouseNdcX, mouseNdcY), camera);

      const pickables: THREE.Object3D[] = [];
      instanceObjectsRef.current.forEach((group, instId) => {
        const inst = instancesRef.current.find((i) => i.instanceId === instId);
        if (inst && inst.visible) {
          pickables.push(group);
        }
      });

      const hits = dblRaycaster.intersectObjects(pickables, true);
      const validHits = hits.filter((h) => isRealEquipmentMesh(h.object));

      if (validHits.length > 0) {
        let curr: THREE.Object3D | null = validHits[0].object;
        while (curr && !curr.userData?.instanceId) {
          curr = curr.parent;
        }
        const hitInstId = curr?.userData?.instanceId as string | undefined;
        if (hitInstId) {
          const hitInst = instancesRef.current.find((i) => i.instanceId === hitInstId);
          if (hitInst) {
            const hitAsset = assetsMapRef.current.get(hitInst.assetId);
            const targetId = hitInst.assetId || hitAsset?.geometry.proceduralArchetype || hitInstId;

            // Chọn thiết bị trong 3D Viewport
            selectedInstanceIdRef.current = hitInstId;
            onSelectInstanceRef.current(hitInstId);
            labSoundEngine.play('ui-toggle', 1.0);

            // Mở sơ đồ Mạng nơ-ron liên kết cho thiết bị này trên bàn / khu trưng bày
            window.dispatchEvent(
              new CustomEvent('openlab:open-neural-modal', {
                detail: { deviceId: targetId },
              }),
            );
            return;
          }
        }
      }

      // Nhấp đúp vào khoảng trống -> Trả góc nhìn camera về mặc định
      resetSimulationToDefaultView();
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('contextmenu', handleContextMenu);
    renderer.domElement.addEventListener('dblclick', handleDblClick);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);

    let resizeLoopRaf: number | null = null;
    const syncViewportSize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w > 0 && h > 0) {
        const aspect = w / h;
        if (Math.abs(camera.aspect - aspect) > 0.0001) {
          camera.aspect = aspect;
          camera.updateProjectionMatrix();
        }
        renderer.setSize(w, h, false);
        requestRender();
      }
    };

    const triggerSmoothResizeLoop = (durationMs = 450) => {
      if (resizeLoopRaf !== null) cancelAnimationFrame(resizeLoopRaf);
      const startMs = performance.now();
      const loop = (nowMs: number) => {
        syncViewportSize();
        if (nowMs - startMs < durationMs) {
          resizeLoopRaf = requestAnimationFrame(loop);
        } else {
          resizeLoopRaf = null;
          syncViewportSize();
        }
      };
      resizeLoopRaf = requestAnimationFrame(loop);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
          requestRender();
        }
      }
      triggerSmoothResizeLoop(350);
    });
    resizeObserver.observe(mount);

    const handleWindowResize = () => triggerSmoothResizeLoop(450);
    const handleTransitionRun = () => triggerSmoothResizeLoop(450);
    const handleTransitionEnd = () => syncViewportSize();

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('transitionrun', handleTransitionRun);
    window.addEventListener('transitionend', handleTransitionEnd);

    // Xử lý kéo thả thiết bị trực quan từ Mạng Nơ-ron xuống Bàn Thí Nghiệm 3D
    const handleNeuralDragPreview = (e: Event) => {
      const customEvent = e as CustomEvent<{
        assetId: string;
        clientX: number;
        clientY: number;
        isDragging: boolean;
      }>;
      const detail = customEvent.detail;
      if (!detail || !detail.isDragging) {
        if (neuralPlacementTargetRef.current && neuralPlacementTargetRef.current.visible) {
          neuralPlacementTargetRef.current.visible = false;
        }
        if (neuralDragPreviewGroupRef.current) {
          scene.remove(neuralDragPreviewGroupRef.current.root);
          OpenLabAssetLoader.disposeObject3D(neuralDragPreviewGroupRef.current.root);
          neuralDragPreviewGroupRef.current = null;
        }
        requestRender();
        return;
      }

      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      if (!camera || !renderer) return;

      const rect = renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((detail.clientX - rect.left) / rect.width) * 2 - 1,
        -((detail.clientY - rect.top) / rect.height) * 2 + 1,
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.ray.intersectPlane(_rayPlane, _dropPoint);
      if (hit) {
        const clampedX = Number(
          THREE.MathUtils.clamp(_dropPoint.x, -BENCH_LIMIT_X, BENCH_LIMIT_X).toFixed(3),
        );
        const clampedZ = Number(
          THREE.MathUtils.clamp(_dropPoint.z, -BENCH_LIMIT_Z, BENCH_LIMIT_Z).toFixed(3),
        );

        if (neuralPlacementTargetRef.current) {
          neuralPlacementTargetRef.current.position.set(clampedX, BENCH_SURFACE_Y + 0.003, clampedZ);
          neuralPlacementTargetRef.current.visible = true;
        }

        // Tải và hiển thị trực tiếp mô hình 3D thực tế của thiết bị lướt trên mặt bàn
        if (
          !neuralDragPreviewGroupRef.current ||
          neuralDragPreviewGroupRef.current.assetId !== detail.assetId
        ) {
          if (neuralDragPreviewGroupRef.current) {
            scene.remove(neuralDragPreviewGroupRef.current.root);
            OpenLabAssetLoader.disposeObject3D(neuralDragPreviewGroupRef.current.root);
            neuralDragPreviewGroupRef.current = null;
          }

          const targetAsset =
            assetsMap.get(detail.assetId) ??
            htmlEquipmentModuleRegistry.getModule(detail.assetId)?.asset;

          if (targetAsset) {
            openLabAssetLoader.loadInstanceMesh(targetAsset).then((loaded) => {
              const previewRoot = loaded.root;
              previewRoot.position.set(clampedX, BENCH_SURFACE_Y, clampedZ);
              scene.add(previewRoot);
              neuralDragPreviewGroupRef.current = {
                assetId: detail.assetId,
                root: previewRoot,
              };
              requestRender();
            });
          }
        } else {
          neuralDragPreviewGroupRef.current.root.position.set(clampedX, BENCH_SURFACE_Y, clampedZ);
          neuralDragPreviewGroupRef.current.root.visible = true;
        }

        requestRender();
      }
    };

    const handleNeuralDragDrop = (e: Event) => {
      const customEvent = e as CustomEvent<{
        assetId: string;
        clientX: number;
        clientY: number;
      }>;
      const detail = customEvent.detail;
      if (!detail) return;

      if (neuralDragPreviewGroupRef.current) {
        scene.remove(neuralDragPreviewGroupRef.current.root);
        OpenLabAssetLoader.disposeObject3D(neuralDragPreviewGroupRef.current.root);
        neuralDragPreviewGroupRef.current = null;
      }

      if (neuralPlacementTargetRef.current) {
        neuralPlacementTargetRef.current.visible = false;
      }

      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      let finalX = 0;
      let finalZ = 0.08;

      if (camera && renderer) {
        const rect = renderer.domElement.getBoundingClientRect();
        const ndc = new THREE.Vector2(
          ((detail.clientX - rect.left) / rect.width) * 2 - 1,
          -((detail.clientY - rect.top) / rect.height) * 2 + 1,
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.ray.intersectPlane(_rayPlane, _dropPoint);
        if (hit) {
          finalX = Number(
            THREE.MathUtils.clamp(_dropPoint.x, -BENCH_LIMIT_X, BENCH_LIMIT_X).toFixed(3),
          );
          finalZ = Number(
            THREE.MathUtils.clamp(_dropPoint.z, -BENCH_LIMIT_Z, BENCH_LIMIT_Z).toFixed(3),
          );
        }
      }

      onDropAssetIntoScene(detail.assetId, [finalX, 0, finalZ]);
      labSoundEngine.play('dock-hover-snap', 1.0);
      requestRender();
    };

    window.addEventListener('openlab:neural-drag-preview', handleNeuralDragPreview);
    window.addEventListener('openlab:neural-drag-drop', handleNeuralDragDrop);

    requestRender();

    return () => {
      if (resizeLoopRaf !== null) cancelAnimationFrame(resizeLoopRaf);
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('transitionrun', handleTransitionRun);
      window.removeEventListener('transitionend', handleTransitionEnd);
      window.removeEventListener('openlab:neural-drag-preview', handleNeuralDragPreview);
      window.removeEventListener('openlab:neural-drag-drop', handleNeuralDragDrop);
      if (neuralDragPreviewGroupRef.current) {
        scene.remove(neuralDragPreviewGroupRef.current.root);
        OpenLabAssetLoader.disposeObject3D(neuralDragPreviewGroupRef.current.root);
        neuralDragPreviewGroupRef.current = null;
      }
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('contextmenu', handleContextMenu);
      renderer.domElement.removeEventListener('dblclick', handleDblClick);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      transformControls.dispose();
      orbit.dispose();
      instanceObjectsRef.current.clear();
      OpenLabAssetLoader.disposeObject3D(scene);
      renderer.dispose();
    };
  }, []);

  // 2. Sync Layer Visibility from parent toolbar buttons into the single unified coordinate helper
  useEffect(() => {
    if (showGrid || showAxes) {
      handleUpdateCoordSettings({
        ...(showGrid ? { showFloorGrid: true } : {}),
        ...(showAxes
          ? {
              showWorldAxes: true,
              showOriginMarker: true,
              showAxisLabels: true,
              showNumericTicks: true,
            }
          : {}),
      });
    }
  }, [showGrid, showAxes, handleUpdateCoordSettings]);

  // 3. Sync Scene Instances & Single-Asset Inspection Mode
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    let isCancelled = false;

    async function syncSceneObjects() {
      if (!scene) return;

      if (benchGroupRef.current) {
        benchGroupRef.current.visible = viewMode === 'lab-scene';
      }
      if (transporterPortalRef.current) {
        transporterPortalRef.current.visible = viewMode === 'lab-scene';
      }

      if (singleAssetGroupRef.current) {
        scene.remove(singleAssetGroupRef.current);
        OpenLabAssetLoader.disposeObject3D(singleAssetGroupRef.current);
        singleAssetGroupRef.current = null;
      }

      if (viewMode === 'single-asset') {
        instanceObjectsRef.current.forEach((obj) => {
          obj.visible = false;
        });
        if (transformRef.current) {
          transformRef.current.detach();
        }

        const activeInst = instances.find((i) => i.instanceId === selectedInstanceId);
        const targetAsset =
          selectedCatalogAsset ??
          (activeInst ? assetsMap.get(activeInst.assetId) : null) ??
          Array.from(assetsMap.values())[0];

        if (targetAsset) {
          setLoadingCount((c) => c + 1);
          const loaded = await openLabAssetLoader.loadInstanceMesh(targetAsset);
          setLoadingCount((c) => Math.max(0, c - 1));
          if (isCancelled) return;

          const previewGroup = loaded.root;
          previewGroup.position.set(0, BENCH_SURFACE_Y, 0);
          previewGroup.scale.set(1.45, 1.45, 1.45);
          scene.add(previewGroup);
          singleAssetGroupRef.current = previewGroup;
        }
        requestRenderRef.current();
        return;
      }

      const currentIds = new Set(instances.map((i) => i.instanceId));
      for (const [instId, obj] of instanceObjectsRef.current.entries()) {
        if (!currentIds.has(instId)) {
          if (transformRef.current?.object === obj) {
            transformRef.current.detach();
          }
          scene.remove(obj);
          OpenLabAssetLoader.disposeObject3D(obj);
          instanceObjectsRef.current.delete(instId);
        }
      }

      for (const inst of instances) {
        const asset = assetsMap.get(inst.assetId);
        if (!asset) continue;

        let group = instanceObjectsRef.current.get(inst.instanceId);
        // Nếu sản phẩm vừa được cập nhật thông số hoặc nạp đè bằng file .HTML (assetVersion mới), hủy mesh cũ và dựng lại tại chỗ!
        if (group && group.userData.assetVersion !== asset.assetVersion) {
          if (transformRef.current?.object === group) {
            transformRef.current.detach();
          }
          scene.remove(group);
          OpenLabAssetLoader.disposeObject3D(group);
          instanceObjectsRef.current.delete(inst.instanceId);
          group = undefined;
        }
        if (!group) {
          setLoadingCount((c) => c + 1);
          const loaded = await openLabAssetLoader.loadInstanceMesh(asset);
          setLoadingCount((c) => Math.max(0, c - 1));
          if (isCancelled) return;

          group = loaded.root;
          group.userData.instanceId = inst.instanceId;
          group.userData.assetId = inst.assetId;
          group.userData.assetVersion = asset.assetVersion;
          // Đặt thiết bị chuẩn anchor 'base-center' lên mặt bàn tại worldY = BENCH_SURFACE_Y + localOffsetY
          group.position.set(
            inst.transform.positionM[0],
            BENCH_SURFACE_Y + inst.transform.positionM[1],
            inst.transform.positionM[2],
          );
          scene.add(group);
          instanceObjectsRef.current.set(inst.instanceId, group);
        } else if (group.parent !== scene) {
          scene.add(group);
        }

        group.visible = inst.visible;
        const isPourAnimating =
          activePourAnimRef.current &&
          (activePourAnimRef.current.sourceId === inst.instanceId ||
            activePourAnimRef.current.targetId === inst.instanceId);
        const isDispenseAnimating =
          activeDispenseAnimRef.current &&
          (activeDispenseAnimRef.current.targetId === inst.instanceId ||
            activeDispenseAnimRef.current.dispenserId === inst.instanceId);

        if (!isPourAnimating) {
          group.rotation.y = inst.transform.rotationRad[1];
        }
        group.scale.set(
          inst.transform.displayScale[0],
          inst.transform.displayScale[1],
          inst.transform.displayScale[2],
        );

        const prevLiqScaleY = group.getObjectByName('liquid_surface')?.scale.y;
        applyInstanceStateToObject3D(group, inst, asset);
        if (
          (isPourAnimating || isDispenseAnimating) &&
          prevLiqScaleY !== undefined
        ) {
          const liqSurf = group.getObjectByName('liquid_surface');
          if (liqSurf) {
            liqSurf.scale.y = prevLiqScaleY;
          }
        }
      }

      // 3B. Rebuild Live 3D Optical Bench Assembly Overlay (Power Cables + Ray-Tracing + Focal Points + Virtual Image Ghost)
      const optGroup = opticalAssemblyGroupRef.current;
      if (optGroup) {
        while (optGroup.children.length > 0) {
          const ch = optGroup.children[0];
          optGroup.remove(ch);
          OpenLabAssetLoader.disposeObject3D(ch);
        }

        const benchInst = instances.find(
          (i) =>
            i.visible &&
            i.instanceState.attachmentSlot !== 'shelf' &&
            assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
              'optical-bench',
        );
        const lampInst = instances.find(
          (i) =>
            i.visible &&
            i.instanceState.attachmentSlot !== 'shelf' &&
            assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
              'optical-lamp',
        );
        const fObjInst = instances.find(
          (i) =>
            i.visible &&
            i.instanceState.attachmentSlot !== 'shelf' &&
            assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
              'frosted-f-object',
        );
        const lensInst = instances.find(
          (i) =>
            i.visible &&
            i.instanceState.attachmentSlot !== 'shelf' &&
            assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
              'optical-lens',
        );
        const screenInst = instances.find(
          (i) =>
            i.visible &&
            i.instanceState.attachmentSlot !== 'shelf' &&
            assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
              'optical-screen',
        );
        const psuInst = instances.find(
          (i) =>
            i.visible &&
            i.instanceState.attachmentSlot !== 'shelf' &&
            assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
              'optical-power-supply',
        );

        // A. 3D Red (+) & Black (-) Power Cables from Power Supply (6) to Halogen Lamp (1) (P08)
        const cableDistM =
          psuInst && lampInst
            ? new THREE.Vector3(...psuInst.transform.positionM).distanceTo(
                new THREE.Vector3(...lampInst.transform.positionM),
              )
            : Infinity;
        const isCablesWithinReach = cableDistM <= 0.70;

        const isPosConnected = Boolean(
          psuInst &&
            lampInst &&
            isCablesWithinReach &&
            (lampInst.instanceState.wirePosConnected !== false &&
              lampInst.instanceState.isCablesConnected !== false),
        );
        const isNegConnected = Boolean(
          psuInst &&
            lampInst &&
            isCablesWithinReach &&
            (lampInst.instanceState.wireNegConnected !== false &&
              lampInst.instanceState.isCablesConnected !== false),
        );
        const areCablesConnected = isPosConnected && isNegConnected;

        if (psuInst && lampInst && isCablesWithinReach) {
          const px = psuInst.transform.positionM[0];
          const py = BENCH_SURFACE_Y + (psuInst.transform.positionM[1] ?? 0);
          const pz = psuInst.transform.positionM[2];

          const lx = lampInst.transform.positionM[0];
          const ly = BENCH_SURFACE_Y + (lampInst.transform.positionM[1] ?? 0);
          const lz = lampInst.transform.positionM[2];

          const posStart = new THREE.Vector3(px + 0.036, py + 0.020, pz + 0.059);
          const negStart = new THREE.Vector3(px + 0.053, py + 0.020, pz + 0.059);
          const lampEndPos = new THREE.Vector3(
            lx - 0.046,
            ly + OPTICAL_BENCH_AXIS_Y - 0.008,
            lz + 0.018,
          );
          const lampEndNeg = new THREE.Vector3(
            lx - 0.046,
            ly + OPTICAL_BENCH_AXIS_Y - 0.008,
            lz - 0.018,
          );

          const WIRE_RADIUS = 0.0022; // 2.2 mm bán kính dây cáp
          // Cao độ tâm dây nằm phẳng trên mặt bàn (tuyệt đối không âm xuống dưới mặt bàn)
          const WIRE_GROUND_Y = BENCH_SURFACE_Y + WIRE_RADIUS + 0.001; // ~3.2 mm trên mặt gỗ

          // Vị trí an toàn phía sau đèn: đảm bảo dây luôn nằm ở X <= lx - 0.05 để KHÔNG CHE GIÁ QUANG HỌC VÀ KHÔNG CHẮN TIA SÁNG (X > lx)
          const lampRearDropX = lx - 0.082;
          const safeMidX = Math.min(lampRearDropX - 0.015, (px + lampRearDropX) * 0.5);
          // Tuyến Z đi men theo sườn bên ngoài bàn quang học
          const flankZ = Math.max(pz + 0.08, lz + 0.045);

          const redMat = new THREE.MeshStandardMaterial({
            color: 0xef4444,
            roughness: 0.35,
            metalness: 0.1,
          });
          const blackMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.4,
            metalness: 0.15,
          });

          // Molded banana plug boot geometry
          const psuBootGeo = new THREE.CylinderGeometry(0.0036, 0.0036, 0.015, 12).rotateX(Math.PI / 2);
          const lampBootGeo = new THREE.CylinderGeometry(0.0036, 0.0036, 0.015, 12).rotateZ(Math.PI / 2);

          if (isPosConnected) {
            // Cọc cắm bắp chuối tại PSU & Đèn
            const psuBoot = new THREE.Mesh(psuBootGeo, redMat);
            psuBoot.position.set(px + 0.036, py + 0.020, pz + 0.066);
            optGroup.add(psuBoot);

            const lampBoot = new THREE.Mesh(lampBootGeo, redMat);
            lampBoot.position.set(lx - 0.053, ly + OPTICAL_BENCH_AXIS_Y - 0.008, lz + 0.018);
            optGroup.add(lampBoot);

            // Đường đi dây Đỏ (+): Bắt đầu từ cọc PSU -> Vươn ra khỏi jack -> Hạ nhẹ xuống bàn -> Uốn lượn gọn gàng trên mặt bàn -> Tiếp cận lưng đèn -> Nâng lên cọc đèn
            const curvePosRaw = new THREE.CatmullRomCurve3([
              posStart,
              new THREE.Vector3(px + 0.036, py + 0.016, pz + 0.082),
              new THREE.Vector3(px + 0.036, WIRE_GROUND_Y, pz + 0.098),
              new THREE.Vector3(safeMidX, WIRE_GROUND_Y, flankZ + 0.012),
              new THREE.Vector3(lampRearDropX, WIRE_GROUND_Y, lz + 0.025),
              new THREE.Vector3(lx - 0.068, ly + OPTICAL_BENCH_AXIS_Y - 0.008, lz + 0.018),
              lampEndPos,
            ]);

            // Lấy mẫu các điểm và kẹp chặt cao độ y >= WIRE_GROUND_Y (KHÔNG BAO GIỜ BỊ SỤT ÂM VÀO BÀN)
            const pts = curvePosRaw.getPoints(36);
            for (const pt of pts) {
              pt.y = Math.max(WIRE_GROUND_Y, pt.y);
            }
            const curvePos = new THREE.CatmullRomCurve3(pts);
            const cablePosMesh = new THREE.Mesh(
              new THREE.TubeGeometry(curvePos, 36, WIRE_RADIUS, 8, false),
              redMat,
            );
            optGroup.add(cablePosMesh);
          }

          if (isNegConnected) {
            // Cọc cắm bắp chuối tại PSU & Đèn
            const psuBoot = new THREE.Mesh(psuBootGeo, blackMat);
            psuBoot.position.set(px + 0.053, py + 0.020, pz + 0.066);
            optGroup.add(psuBoot);

            const lampBoot = new THREE.Mesh(lampBootGeo, blackMat);
            lampBoot.position.set(lx - 0.053, ly + OPTICAL_BENCH_AXIS_Y - 0.008, lz - 0.018);
            optGroup.add(lampBoot);

            // Đường đi dây Đen (-): Chạy song song cách dây đỏ ~1.4 cm
            const curveNegRaw = new THREE.CatmullRomCurve3([
              negStart,
              new THREE.Vector3(px + 0.053, py + 0.016, pz + 0.082),
              new THREE.Vector3(px + 0.053, WIRE_GROUND_Y, pz + 0.112),
              new THREE.Vector3(safeMidX - 0.014, WIRE_GROUND_Y, flankZ + 0.026),
              new THREE.Vector3(lampRearDropX, WIRE_GROUND_Y, lz - 0.025),
              new THREE.Vector3(lx - 0.068, ly + OPTICAL_BENCH_AXIS_Y - 0.008, lz - 0.018),
              lampEndNeg,
            ]);

            const ptsNeg = curveNegRaw.getPoints(36);
            for (const pt of ptsNeg) {
              pt.y = Math.max(WIRE_GROUND_Y, pt.y);
            }
            const curveNeg = new THREE.CatmullRomCurve3(ptsNeg);
            const cableNegMesh = new THREE.Mesh(
              new THREE.TubeGeometry(curveNeg, 36, WIRE_RADIUS, 8, false),
              blackMat,
            );
            optGroup.add(cableNegMesh);
          }
        }

        // B. Real-Time Double-Surface Snell's Law Ray-Tracing, Volumetric Tyndall Glow, Photons & Virtual Image Ghost
        const anyOpticalInst =
          lensInst ?? lampInst ?? benchInst ?? screenInst ?? psuInst;
        const ambientLvl = anyOpticalInst?.instanceState.ambientLightLevel ?? 45;
        const hemiLight = scene.getObjectByName('env_hemi_light') as
          | THREE.HemisphereLight
          | undefined;
        const keyLight = scene.getObjectByName('env_key_light') as
          | THREE.DirectionalLight
          | undefined;
        if (anyOpticalInst && hemiLight && keyLight) {
          const factor = THREE.MathUtils.clamp(ambientLvl / 55, 0.14, 1.45);
          hemiLight.intensity = 0.65 * factor;
          keyLight.intensity = 1.15 * factor;
        }

        const prismInst = instances.find(
          (i) =>
            i.visible &&
            i.instanceState.attachmentSlot !== 'shelf' &&
            assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
              'optical-prism',
        );

        // Đèn phát sáng ngay lập tức khi mạch kín và nguồn bật (P01, P02, P08)
        const isPsuOn = Boolean(
          psuInst && psuInst.instanceState.isPoweredOn !== false,
        );
        const isLampSwitchOn = Boolean(
          lampInst && lampInst.instanceState.isPoweredOn !== false,
        );
        const psuVoltage =
          psuInst && typeof psuInst.instanceState.voltageStepV === 'number' && psuInst.instanceState.voltageStepV > 0
            ? psuInst.instanceState.voltageStepV
            : psuInst && typeof psuInst.instanceState.supplyVoltageV === 'number' && psuInst.instanceState.supplyVoltageV > 0
              ? psuInst.instanceState.supplyVoltageV
              : 12.0;
        const hasPsuOnBench = Boolean(psuInst);
        const isLampLit = Boolean(
          lampInst &&
            isLampSwitchOn &&
            (!hasPsuOnBench || (areCablesConnected && isPsuOn && psuVoltage >= 2.5)),
        );

        if (lampInst && isLampLit) {
          // P03: Gốc tia sáng xuất phát đúng từ tọa độ 3D thực tế của đèn (không bị ray cướp tọa độ)
          const axisY =
            BENCH_SURFACE_Y +
            (lampInst.transform.positionM[1] ?? 0) +
            OPTICAL_BENCH_AXIS_Y;
          const axisZ = lampInst.transform.positionM[2];

          const lampApertureX = lampInst.transform.positionM[0] + 0.048;

          // Kiểm tra xem Lăng kính (optical-prism) có nằm chắn ngang đường truyền của chùm tia hay không
          const prismX = prismInst ? prismInst.transform.positionM[0] : null;
          const prismZ = prismInst ? prismInst.transform.positionM[2] : null;
          const prismY = prismInst
            ? BENCH_SURFACE_Y + (prismInst.transform.positionM[1] ?? 0) + 0.101
            : null;
          const isPrismInBeam = Boolean(
            prismInst &&
            prismX !== null &&
            prismZ !== null &&
            prismY !== null &&
            prismX > lampApertureX + 0.03 &&
            Math.abs(prismZ - axisZ) <= 0.032 &&
            Math.abs(prismY - axisY) <= 0.042,
          );

          // Kiểm tra xem Thấu kính (optical-lens) có nằm chắn ngang đường truyền của chùm tia hay không
          const lensActualX = lensInst ? lensInst.transform.positionM[0] : null;
          const lensActualZ = lensInst ? lensInst.transform.positionM[2] : null;
          const lensActualY = lensInst
            ? BENCH_SURFACE_Y +
              (lensInst.transform.positionM[1] ?? 0) +
              OPTICAL_BENCH_AXIS_Y
            : null;
          const isLensInBeam = Boolean(
            lensInst &&
            lensActualX !== null &&
            lensActualZ !== null &&
            lensActualY !== null &&
            lensActualX > lampApertureX + 0.03 &&
            Math.abs(lensActualZ - axisZ) <= 0.035 &&
            Math.abs(lensActualY - axisY) <= 0.038,
          );

          const lensX = isLensInBeam && lensActualX !== null
            ? lensActualX
            : lampApertureX + 0.25;
          const fObjX = fObjInst
            ? fObjInst.transform.positionM[0]
            : lampApertureX + 0.08;
          const screenX = screenInst
            ? screenInst.transform.positionM[0] - 0.002
            : benchInst
              ? benchInst.transform.positionM[0] + 0.42
              : lampApertureX + 0.55;

          // Quy tắc vật lý: Nếu thấu kính KHÔNG nằm trên luồng sáng (hoặc để lệch ra ngoài),
          // tia sáng truyền thẳng tắp qua không khí ('flat_inf')!
          const profileId: OpticalLensSpec['id'] =
            isLensInBeam && lensInst
              ? lensInst.instanceState.lensProfileId ?? 'conv_10'
              : 'flat_inf';
          const spec =
            OPTICAL_LENS_SPECS[profileId] ?? OPTICAL_LENS_SPECS.conv_10;
          const fM = spec.focalLengthCm * 0.01;

          const rawBeamMode = lampInst.instanceState.beamMode ?? 'f_rays';
          const requestedExp =
            lampInst.instanceState.experimentMode ??
            (rawBeamMode === 'f_rays' || rawBeamMode === 'f-pattern'
              ? 'f_object'
              : 'laser_rays');
          // Physical law: letter F projection requires (2) Vật sáng chữ F on the workbench between Lamp and Lens
          const experimentMode: 'f_object' | 'laser_rays' =
            requestedExp === 'f_object' && fObjInst && fObjX < lensX
              ? 'f_object'
              : 'laser_rays';
          const beamMode =
            experimentMode === 'f_object'
              ? 'f_rays'
              : rawBeamMode === 'f_rays' || rawBeamMode === 'f-pattern'
                ? 'triple'
                : rawBeamMode;

          const supplyVoltageV = lampInst.instanceState.supplyVoltageV ?? 6;
          const powerBrightness = THREE.MathUtils.clamp(
            0.48 + ((supplyVoltageV - 3) / 9) * 0.62,
            0.42,
            1.15,
          );
          const rayOffsetYCm = lampInst.instanceState.rayOffsetYCm ?? 0;
          const rayAngleDeg = lampInst.instanceState.rayAngleDeg ?? 0;
          const showPhotons = lampInst.instanceState.showPhotons !== false;
          const showVirtualRays =
            lampInst.instanceState.showVirtualRays !== false;

          const addVolumetricRaySegment = (
            p1: THREE.Vector3,
            p2: THREE.Vector3,
            coreColor: string | number,
            glowColor: string | number,
            coreRadius = 0.0014,
            glowRadius = 0.0043,
            coreOpacity = 0.95,
            glowOpacity = 0.38,
          ) => {
            const dist = p1.distanceTo(p2);
            if (dist < 0.0015) return;
            const mid = p1.clone().add(p2).multiplyScalar(0.5);

            // Inner high-luminance core
            const coreGeo = new THREE.CylinderGeometry(
              coreRadius,
              coreRadius,
              dist,
              8,
            );
            coreGeo.rotateX(Math.PI / 2);
            const coreMesh = new THREE.Mesh(
              coreGeo,
              new THREE.MeshBasicMaterial({
                color: coreColor,
                transparent: true,
                opacity: THREE.MathUtils.clamp(
                  coreOpacity * powerBrightness,
                  0.1,
                  1.0,
                ),
                depthWrite: false,
              }),
            );
            coreMesh.position.copy(mid);
            coreMesh.lookAt(p2);
            coreMesh.renderOrder = 8;
            optGroup.add(coreMesh);

            // Outer volumetric Tyndall scattering sheath (AdditiveBlending)
            const glowGeo = new THREE.CylinderGeometry(
              glowRadius,
              glowRadius,
              dist,
              8,
            );
            glowGeo.rotateX(Math.PI / 2);
            const glowMesh = new THREE.Mesh(
              glowGeo,
              new THREE.MeshBasicMaterial({
                color: glowColor,
                transparent: true,
                opacity: THREE.MathUtils.clamp(
                  glowOpacity * powerBrightness,
                  0.05,
                  0.65,
                ),
                blending: THREE.AdditiveBlending,
                depthWrite: false,
              }),
            );
            glowMesh.position.copy(mid);
            glowMesh.lookAt(p2);
            glowMesh.renderOrder = 7;
            optGroup.add(glowMesh);
          };

          const addDashedVirtualRay = (
            p1: THREE.Vector3,
            p2: THREE.Vector3,
          ) => {
            const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
            const lineMat = new THREE.LineDashedMaterial({
              color: 0x38bdf8,
              dashSize: 0.011,
              gapSize: 0.007,
              transparent: true,
              opacity: 0.86,
            });
            const line = new THREE.Line(lineGeo, lineMat);
            line.computeLineDistances();
            line.renderOrder = 8;
            optGroup.add(line);
          };

          // 1. Tiêu điểm vật F và Tiêu điểm ảnh F' trên trục chính quang học chuẩn xác theo SGK KHTN 9 (Hình 8.12)
          // - Thấu kính hội tụ (converging):
          //   + Tiêu điểm vật F: trước thấu kính (x = lensX - f)
          //   + Tiêu điểm ảnh F': sau thấu kính (x = lensX + f) — Chùm tia tới song song trục chính hội tụ chính xác vào đây!
          // - Thấu kính phân kì (diverging):
          //   + Tiêu điểm ảnh ảo F': trước thấu kính (x = lensX - |f|) — Nơi chùm tia phân kì kéo dài ngược hội tụ!
          //   + Tiêu điểm vật F: sau thấu kính (x = lensX + |f|)
          if (isLensInBeam && lensInst && Math.abs(spec.focalLengthCm) < 500) {
            const fAbsM = Math.abs(fM);
            const isConverging = spec.type === 'converging';
            const focalColorHex = isConverging ? '#10b981' : '#f43f5e';
            const focalColorNum = isConverging ? 0x10b981 : 0xf43f5e;
            const railTopY = BENCH_SURFACE_Y + 0.036; // Mặt trên của thanh ray Giá quang học (5)

            const focalPoints = isConverging
              ? [
                  { dx: -fAbsM, symbol: 'F' as const, roleVi: 'Tiêu điểm vật', isConvergence: false },
                  { dx: fAbsM, symbol: "F'" as const, roleVi: 'Tiêu điểm ảnh', isConvergence: true },
                ]
              : [
                  { dx: -fAbsM, symbol: "F'" as const, roleVi: 'Tiêu điểm ảnh ảo', isConvergence: true },
                  { dx: fAbsM, symbol: 'F' as const, roleVi: 'Tiêu điểm vật', isConvergence: false },
                ];

            focalPoints.forEach(({ dx, symbol, roleVi, isConvergence }) => {
              const fx = lensX + dx;
              const fy = axisY;
              const fz = axisZ;

              // A. Focal Center Bead (hạt quang học tâm tiêu điểm nhỏ gọn 2.2 mm, không vướng tia sáng)
              const fSphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.0022, 16, 16),
                new THREE.MeshBasicMaterial({ color: focalColorNum }),
              );
              fSphere.position.set(fx, fy, fz);
              optGroup.add(fSphere);

              // B. Aperture Reticle Ring (vòng chuẩn trắc quang mỏng xoay vuông góc trục X, tia sáng xuyên tâm)
              const reticleRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.0046, 0.00045, 12, 32),
                new THREE.MeshBasicMaterial({
                  color: focalColorNum,
                  transparent: true,
                  opacity: 0.85,
                }),
              );
              reticleRing.rotateY(Math.PI / 2);
              reticleRing.position.set(fx, fy, fz);
              optGroup.add(reticleRing);

              // C. Điểm phát quang hội tụ (CHỈ tại tiêu điểm ảnh F' của thấu kính hội tụ khi chùm tia tới song song hội tụ)
              if (isConvergence && isConverging) {
                const glowCore = new THREE.Mesh(
                  new THREE.SphereGeometry(0.0036, 14, 14),
                  new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.85 * powerBrightness,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                  }),
                );
                glowCore.position.set(fx, fy, fz);
                optGroup.add(glowCore);

                const glowHalo = new THREE.Mesh(
                  new THREE.SphereGeometry(0.0085, 14, 14),
                  new THREE.MeshBasicMaterial({
                    color: focalColorNum,
                    transparent: true,
                    opacity: 0.45 * powerBrightness,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                  }),
                );
                glowHalo.position.set(fx, fy, fz);
                optGroup.add(glowHalo);
              }

              // D. Benchmark Guide to Bench Rail (Cọc tiêu định vị cắm chuẩn xuống mặt ray, không lơ lửng)
              const needleH = Math.max(0.012, fy - railTopY);
              const needle = new THREE.Mesh(
                new THREE.CylinderGeometry(0.00035, 0.00035, needleH, 8),
                new THREE.MeshBasicMaterial({
                  color: focalColorNum,
                  transparent: true,
                  opacity: 0.70,
                }),
              );
              needle.position.set(fx, railTopY + needleH * 0.5, fz);
              optGroup.add(needle);

              // Chân vạch dấu kẹp chuẩn trên sống trượt ray
              const railFoot = new THREE.Mesh(
                new THREE.BoxGeometry(0.0035, 0.0018, 0.009),
                new THREE.MeshStandardMaterial({
                  color: 0xe2e8f0,
                  metalness: 0.85,
                  roughness: 0.25,
                }),
              );
              railFoot.position.set(fx, railTopY + 0.001, fz);
              optGroup.add(railFoot);

              // E. Billboard Sprite Badge hiển thị ký hiệu F hoặc F' sắc nét, tự động quay mặt theo camera
              const badgeTex = getFocalBadgeTexture(
                symbol,
                roleVi,
                spec.focalLengthCm,
                focalColorHex,
              );
              const badgeMat = new THREE.SpriteMaterial({
                map: badgeTex,
                transparent: true,
                depthTest: false,
              });
              const badgeSprite = new THREE.Sprite(badgeMat);
              badgeSprite.scale.set(0.034, 0.0153, 1);
              badgeSprite.position.set(fx, fy + 0.015, fz);
              badgeSprite.renderOrder = 9;
              optGroup.add(badgeSprite);
            });
          }

          // 2. Warm halogen illumination beam from Lamp (1) to Frosted F-Object (2)
          if (experimentMode === 'f_object' && fObjInst && lampApertureX < fObjX && !isPrismInBeam) {
            [-0.016, 0, 0.016].forEach((dy) => {
              addVolumetricRaySegment(
                new THREE.Vector3(lampApertureX, axisY + dy * 0.6, axisZ),
                new THREE.Vector3(fObjX, axisY + dy, axisZ),
                0xfde047,
                0xfbbf24,
                0.0012,
                0.0038,
                0.56,
                0.18,
              );
            });
          }

          // 3. TƯƠNG TÁC QUANG HỌC VỚI LĂNG KÍNH HOẶC THẤU KÍNH
          if (isPrismInBeam && prismX !== null) {
            // Khi lăng kính nằm đúng luồng sáng: khúc xạ bẻ lệch về đáy lăng kính và tán sắc
            const pFrontX = prismX - 0.018;
            const pBackX = prismX + 0.018;
            const pMidY = axisY;
            const pMidZ = axisZ;
            const spreadReach = Math.max(0.24, screenX - pBackX);

            const isWhiteOrF =
              experimentMode === 'f_object' ||
              rawBeamMode === 'f_rays' ||
              rawBeamMode === 'f-pattern';

            if (isWhiteOrF) {
              // Tia tới trắng halogen từ đèn đến mặt trước lăng kính
              addVolumetricRaySegment(
                new THREE.Vector3(lampApertureX, pMidY, pMidZ),
                new THREE.Vector3(pFrontX, pMidY, pMidZ),
                0xfffbeb,
                0xfef08a,
                0.0015,
                0.0038,
                0.95,
                0.35,
              );
              // Tia truyền bên trong khối thủy tinh
              addVolumetricRaySegment(
                new THREE.Vector3(pFrontX, pMidY, pMidZ),
                new THREE.Vector3(pBackX, pMidY - 0.003, pMidZ),
                0xfef08a,
                0x38bdf8,
                0.0014,
                0.0031,
                0.9,
                0.28,
              );
              // Chùm tia ló tán sắc 7 màu cầu vồng (Đỏ -> Tím) lệch về phía đáy lăng kính
              const rainbowSpectrum = [
                { hex: 0xef4444, devY: -0.015, devZ: 0.006, glow: 0xfca5a5 }, // Đỏ
                { hex: 0xf97316, devY: -0.021, devZ: 0.010, glow: 0xfdba74 }, // Cam
                { hex: 0xfacc15, devY: -0.027, devZ: 0.014, glow: 0xfef08a }, // Vàng
                { hex: 0x22c55e, devY: -0.033, devZ: 0.018, glow: 0x86efac }, // Lục
                { hex: 0x06b6d4, devY: -0.039, devZ: 0.022, glow: 0x67e8f9 }, // Lam
                { hex: 0x3b82f6, devY: -0.045, devZ: 0.026, glow: 0x93c5fd }, // Chàm
                { hex: 0x8b5cf6, devY: -0.051, devZ: 0.030, glow: 0xc4b5fd }, // Tím
              ];
              rainbowSpectrum.forEach((col) => {
                const endPos = new THREE.Vector3(
                  pBackX + spreadReach,
                  pMidY - 0.003 + (col.devY / 0.24) * spreadReach,
                  pMidZ + (col.devZ / 0.24) * spreadReach,
                );
                addVolumetricRaySegment(
                  new THREE.Vector3(pBackX, pMidY - 0.003, pMidZ),
                  endPos,
                  col.hex,
                  col.glow,
                  0.0011,
                  0.0029,
                  0.92,
                  0.28,
                );
              });
            } else {
              // Chùm tia hẹp (1 tia, 2 tia, 3 tia, song song, phân kì) khúc xạ qua lăng kính
              let rayOffsetsY: number[] = [0];
              if (beamMode === 'double') rayOffsetsY = [-0.012, 0.012];
              else if (beamMode === 'triple') rayOffsetsY = [-0.015, 0, 0.015];
              else if (beamMode === 'bundle') rayOffsetsY = [-0.018, -0.009, 0, 0.009, 0.018];
              else if (beamMode === 'divergent') rayOffsetsY = [-0.008, -0.004, 0, 0.004, 0.008];

              rayOffsetsY.forEach((dy, idx) => {
                const rayColor = [0xf59e0b, 0x38bdf8, 0x34d399, 0xfbbf24, 0xf472b6][idx % 5];
                // Segment 1: tới mặt trước
                addVolumetricRaySegment(
                  new THREE.Vector3(lampApertureX, pMidY + dy, pMidZ),
                  new THREE.Vector3(pFrontX, pMidY + dy, pMidZ),
                  rayColor,
                  rayColor,
                  0.0010,
                  0.0029,
                  0.88,
                  0.22,
                );
                // Segment 2: trong lăng kính
                addVolumetricRaySegment(
                  new THREE.Vector3(pFrontX, pMidY + dy, pMidZ),
                  new THREE.Vector3(pBackX, pMidY + dy - 0.003, pMidZ),
                  '#e0f2fe',
                  '#38bdf8',
                  0.0011,
                  0.0026,
                  0.94,
                  0.28,
                );
                // Segment 3: lệch về đáy (D ≈ 38.5°)
                const endPos = new THREE.Vector3(
                  pBackX + spreadReach,
                  pMidY + dy - 0.003 - 0.038 * (spreadReach / 0.22),
                  pMidZ + 0.018 * (spreadReach / 0.22),
                );
                addVolumetricRaySegment(
                  new THREE.Vector3(pBackX, pMidY + dy - 0.003, pMidZ),
                  endPos,
                  rayColor,
                  rayColor,
                  0.0010,
                  0.0029,
                  0.88,
                  0.22,
                );
              });
            }
          } else {
            // 4. KHI KHÔNG CÓ LĂNG KÍNH: TIA QUA THẤU KÍNH (NẾU ĐẶT TRÚNG) HOẶC ĐI THẲNG TRONG KHÔNG KHÍ
            const sourceWorldX =
              experimentMode === 'f_object' && fObjInst && isLensInBeam
                ? fObjX
                : lampApertureX;
            const endXBoundary = isLensInBeam
              ? Math.max(lensX + 0.03, screenX)
              : Math.max(lampApertureX + 0.55, screenX);

            // Volumetric illuminating beam from Lamp Aperture to Frosted F Object (Chiếu sáng khoảng giữa đèn và chữ F)
            if (experimentMode === 'f_object' && fObjInst && sourceWorldX > lampApertureX + 0.01) {
              const lampToFDist = sourceWorldX - lampApertureX;
              const beamGeo = new THREE.CylinderGeometry(
                0.0126,
                0.0182,
                lampToFDist,
                16,
              );
              beamGeo.rotateZ(-Math.PI / 2);
              const beamMat = new THREE.MeshBasicMaterial({
                color: 0xffedd5,
                transparent: true,
                opacity: 0.40 * powerBrightness,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
              });
              const beamMesh = new THREE.Mesh(beamGeo, beamMat);
              beamMesh.position.set(
                lampApertureX + lampToFDist * 0.5,
                axisY,
                axisZ,
              );
              optGroup.add(beamMesh);

              const coreGeo = new THREE.CylinderGeometry(
                0.0042,
                0.0063,
                lampToFDist,
                12,
              );
              coreGeo.rotateZ(-Math.PI / 2);
              const coreMat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.70 * powerBrightness,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
              });
              const coreMesh = new THREE.Mesh(coreGeo, coreMat);
              coreMesh.position.set(
                lampApertureX + lampToFDist * 0.5,
                axisY,
                axisZ,
              );
              optGroup.add(coreMesh);
            }

            const tracedRays = traceOpticalBenchRays({
              experimentMode,
              beamMode,
              lensProfileId: profileId,
              lampSlitX: sourceWorldX,
              fObjectX: fObjX,
              lensX,
              screenX: endXBoundary,
              axisY,
              axisZ,
              rayOffsetYCm,
              rayAngleDeg,
            });

            const photonsGroup = new THREE.Group();
            photonsGroup.name = 'optical_photons_group';
            photonsGroup.visible = showPhotons;
            optGroup.add(photonsGroup);

            tracedRays.forEach((ray, rayIdx) => {
              // Segment 1: Incident ray in air (start -> front surface entryHit)
              addVolumetricRaySegment(
                ray.start,
                ray.entryHit,
                ray.color,
                ray.color,
                0.0014,
                0.0043,
                0.95,
                0.36,
              );
              // Segment 2: Refracted ray inside optical glass (front surface entryHit -> rear surface exitHit)
              addVolumetricRaySegment(
                ray.entryHit,
                ray.exitHit,
                '#e0f2fe',
                '#38bdf8',
                0.0015,
                0.0038,
                0.98,
                0.42,
              );
              // Segment 3: Emergent ray in air (rear surface exitHit -> screen refractedEnd)
              addVolumetricRaySegment(
                ray.exitHit,
                ray.refractedEnd,
                ray.color,
                ray.color,
                0.0014,
                0.0043,
                0.95,
                0.36,
              );

              // Segment 4: Dashed virtual ray extension (when virtual image or diverging focus)
              if (showVirtualRays && ray.virtualStart && ray.virtualEnd) {
                addDashedVirtualRay(ray.virtualStart, ray.virtualEnd);
              }

              // Segment 5: Animated glowing photon particles along the ray
              if (showPhotons) {
                [0, 0.5].forEach((basePhase, pIdx) => {
                  const phGroup = new THREE.Group();
                  const coreSphere = new THREE.Mesh(
                    new THREE.SphereGeometry(0.0018, 10, 10),
                    new THREE.MeshBasicMaterial({ color: 0xffffff }),
                  );
                  const haloSphere = new THREE.Mesh(
                    new THREE.SphereGeometry(0.0036, 10, 10),
                    new THREE.MeshBasicMaterial({
                      color: ray.color,
                      transparent: true,
                      opacity: 0.55 * powerBrightness,
                      blending: THREE.AdditiveBlending,
                      depthWrite: false,
                    }),
                  );
                  phGroup.add(coreSphere, haloSphere);
                  phGroup.userData.raySegments = {
                    start: ray.start.clone(),
                    entryHit: ray.entryHit.clone(),
                    exitHit: ray.exitHit.clone(),
                    refractedEnd: ray.refractedEnd.clone(),
                    phase: (basePhase + rayIdx * 0.17 + pIdx * 0.03) % 1,
                  };
                  phGroup.position.copy(ray.start);
                  photonsGroup.add(phGroup);
                });
              }
            });
          }

          // 3B. Volumetric Tyndall Cone for Divergent Beam Mode
          if (beamMode === 'divergent') {
            const coneReachX = Math.min(screenX, lampApertureX + 0.52);
            const coneLen = Math.max(0.12, coneReachX - lampApertureX);
            const coneMidX = lampApertureX + coneLen * 0.5;
            const coneGeo = new THREE.CylinderGeometry(0.008, 0.048, coneLen, 16);
            coneGeo.rotateZ(Math.PI / 2);
            const coneMat = new THREE.MeshBasicMaterial({
              color: 0xfef08a,
              transparent: true,
              opacity: THREE.MathUtils.clamp(0.09 * powerBrightness, 0.03, 0.22),
              blending: THREE.AdditiveBlending,
              depthWrite: false,
              side: THREE.DoubleSide,
            });
            const coneMesh = new THREE.Mesh(coneGeo, coneMat);
            coneMesh.position.set(coneMidX, axisY, axisZ);
            coneMesh.renderOrder = 7;
            optGroup.add(coneMesh);
          }

          // 4. 3D Upright Translucent Virtual Image Ghost A'B' when d' < 0 in F-Object mode
          if (experimentMode === 'f_object' && lensInst) {
            const effectiveSourceX = fObjInst ? fObjX : lampApertureX;
            const dCm = Math.max(3, (lensX - effectiveSourceX) * 100);
            const fCm = spec.focalLengthCm;
            const isInf =
              Math.abs(fCm) > 500 || Math.abs(dCm - fCm) < 0.25;
            const dPrimeCm = isInf ? 9999 : (dCm * fCm) / (dCm - fCm);
            const mag = isInf ? 1 : -dPrimeCm / dCm;
            if (!isInf && dPrimeCm < 0) {
              const virtX = lensX + dPrimeCm * 0.01;
              const ghostScale = THREE.MathUtils.clamp(
                Math.abs(mag),
                0.25,
                2.5,
              );
              const ghostTex = createFrostedFObjectCanvasTexture(true);
              const ghostMat = new THREE.MeshBasicMaterial({
                map: ghostTex,
                transparent: true,
                opacity: 0.82,
                side: THREE.DoubleSide,
                depthWrite: false,
              });
              const ghostMesh = new THREE.Mesh(
                new THREE.CircleGeometry(0.032 * ghostScale, 36).rotateY(
                  Math.PI / 2,
                ),
                ghostMat,
              );
              ghostMesh.position.set(virtX, axisY, axisZ);
              ghostMesh.renderOrder = 9;
              optGroup.add(ghostMesh);

              // Dashed cyan ring around Virtual Image Ghost
              const ghostRing = new THREE.Mesh(
                new THREE.RingGeometry(
                  0.032 * ghostScale,
                  0.0345 * ghostScale,
                  36,
                ).rotateY(Math.PI / 2),
                new THREE.MeshBasicMaterial({
                  color: 0x38bdf8,
                  side: THREE.DoubleSide,
                  transparent: true,
                  opacity: 0.78,
                }),
              );
              ghostRing.position.set(virtX, axisY, axisZ);
              ghostRing.renderOrder = 10;
              optGroup.add(ghostRing);
            }
          }
        }
      }

      requestRenderRef.current();
    }

    syncSceneObjects();

    return () => {
      isCancelled = true;
    };
  }, [
    instances,
    assetsMap,
    viewMode,
    viewMode === 'single-asset' ? selectedCatalogAsset : null,
  ]);

  // 4. Sync Selection Box, Ground Target Ring & Rotate Gizmo
  useEffect(() => {
    const transformControls = transformRef.current;
    const boxHelper = selectionBoxHelperRef.current;
    const ring = selectionRingRef.current;
    if (!transformControls || !boxHelper || !ring) return;

    if (viewMode === 'single-asset') {
      transformControls.detach();
      return;
    }

    const selectedInst = instances.find((i) => i.instanceId === selectedInstanceId);
    const selectedObj = selectedInstanceId
      ? instanceObjectsRef.current.get(selectedInstanceId)
      : undefined;

    if (selectedInst && selectedObj && selectedInst.visible) {
      boxHelper.setFromObject(selectedObj);
      boxHelper.visible = !isStudentMode;

      ring.position.set(
        selectedObj.position.x,
        BENCH_SURFACE_Y + 0.002,
        selectedObj.position.z,
      );
      ring.visible = true;

      if (!selectedInst.locked && toolMode === 'rotate') {
        transformControls.setMode('rotate');
        transformControls.showX = false;
        transformControls.showY = true;
        transformControls.showZ = false;
        transformControls.attach(selectedObj);
      } else {
        transformControls.detach();
      }

      // Live 3D Contextual Neural Synapse Beams (Chỉ dẫn Nơ-ron Ngữ cảnh AR)
      const neuralGroup = neuralSynapseBeamGroupRef.current;
      if (neuralGroup) {
        while (neuralGroup.children.length > 0) {
          const ch = neuralGroup.children[0];
          neuralGroup.remove(ch);
          OpenLabAssetLoader.disposeObject3D(ch);
        }

        const isGuideActive = isNeuralGuideEnabled ?? neuralConnectionEngine.isGuideEnabled;
        if (isGuideActive && selectedInst && selectedObj && selectedInst.visible) {
          const candidates = neuralConnectionEngine.getCompatibleCandidates(
            selectedInst,
            instances,
            assetsMap,
          );

          candidates.slice(0, 5).forEach((cand, idx) => {
            const targetObj = instanceObjectsRef.current.get(cand.targetInstance.instanceId);
            if (!targetObj) return;

            const p1 = new THREE.Vector3(selectedObj.position.x, selectedObj.position.y + 0.08, selectedObj.position.z);
            const p2 = new THREE.Vector3(targetObj.position.x, targetObj.position.y + 0.08, targetObj.position.z);

            const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
            const dist = p1.distanceTo(p2);
            mid.y += Math.min(0.35, Math.max(0.12, dist * 0.35));

            const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
            const points = curve.getPoints(24);
            const geom = new THREE.BufferGeometry().setFromPoints(points);

            // Phân định chuẩn màu sắc Neon nhân quả:
            // 1. Dòng chảy ra: Xanh dương neon (0x0080ff) - Đổi từ Xanh sáng sang Xanh dương
            // 2. Dòng chảy vào: Tím neon (0xb026ff)
            // 3. Cùng cấp / Gợi ý hai chiều: Lam tím neon (0x6366f1)
            let neonColor = 0x6366f1; // Lam tím neon
            if (cand.link.direction === 'output') {
              neonColor = 0x0080ff; // Xanh dương neon
            } else if (cand.link.direction === 'input') {
              neonColor = 0xb026ff; // Tím neon
            }

            // Ống dẫn 3D phát sáng Neon mảnh mai (Độ dày mỏng còn 1.2, đường kính ~3.0mm)
            const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.0015, 8, false);
            const tubeMat = new THREE.MeshBasicMaterial({
              color: neonColor,
              transparent: true,
              opacity: 0.88,
            });
            const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
            neuralGroup.add(tubeMesh);

            // Lõi phát sáng trung tâm rực rỡ
            const coreGeom = new THREE.TubeGeometry(curve, 32, 0.0006, 8, false);
            const coreMat = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.95,
            });
            const coreMesh = new THREE.Mesh(coreGeom, coreMat);
            neuralGroup.add(coreMesh);

            // Thêm chuỗi hạt photon chạy thành dòng nhỏ lại còn 50% (Bán kính 0.0045m)
            const photonGeom = new THREE.SphereGeometry(0.0045, 12, 12);
            const photonMat = new THREE.MeshBasicMaterial({
              color: neonColor,
            });

            // 4 hạt photon phân bổ nối đuôi nhau thành dòng chảy liên tục
            for (let pIdx = 0; pIdx < 4; pIdx++) {
              const photon = new THREE.Mesh(photonGeom, photonMat);
              photon.name = 'neural_photon_particle';
              photon.userData = {
                curve,
                direction: cand.link.direction,
                offset: (idx * 0.12 + pIdx * 0.25) % 1,
                speed: 0.72,
              };
              neuralGroup.add(photon);
            }

            // Target Halo Ring under candidate (vòng mỏng đồng bộ)
            const haloGeom = new THREE.RingGeometry(0.045, 0.065, 32);
            haloGeom.rotateX(-Math.PI / 2);
            const haloMat = new THREE.MeshBasicMaterial({
              color: neonColor,
              transparent: true,
              opacity: 0.82,
              side: THREE.DoubleSide,
            });
            const haloMesh = new THREE.Mesh(haloGeom, haloMat);
            haloMesh.position.set(targetObj.position.x, BENCH_SURFACE_Y + 0.003, targetObj.position.z);
            neuralGroup.add(haloMesh);
          });
        }
      }
    } else {
      boxHelper.visible = false;
      ring.visible = false;
      transformControls.detach();

      const neuralGroup = neuralSynapseBeamGroupRef.current;
      if (neuralGroup) {
        while (neuralGroup.children.length > 0) {
          const ch = neuralGroup.children[0];
          neuralGroup.remove(ch);
          OpenLabAssetLoader.disposeObject3D(ch);
        }
      }
    }

    updateProjectedOverlays();
    requestRenderRef.current();
  }, [
    selectedInstanceId,
    instances,
    assetsMap,
    toolMode,
    viewMode,
    showDimensions,
    isStudentMode,
    isNeuralGuideEnabled,
    updateProjectedOverlays,
  ]);

  // Smooth Camera Actions for the Vertical Right Toolbar (Section 4.D)
  const handleSmoothZoom = (factor: number) => {
    const camera = cameraRef.current;
    const orbit = orbitRef.current;
    if (!camera || !orbit) return;

    labSoundEngine.play('camera-zoom', 0.75);
    const dir = new THREE.Vector3().subVectors(camera.position, orbit.target);
    const nextDist = THREE.MathUtils.clamp(dir.length() * factor, 0.28, 11.5);
    dir.normalize().multiplyScalar(nextDist);
    cameraGoalPosRef.current = new THREE.Vector3().addVectors(orbit.target, dir);
    cameraGoalTargetRef.current = orbit.target.clone();
    requestRenderRef.current();
  };

  const computeFullBenchCameraPose = useCallback(() => {
    const cam = cameraRef.current;
    const aspect = cam && cam.aspect > 0.1 ? cam.aspect : 1.55;
    const tanHalfVFov = Math.tan(THREE.MathUtils.degToRad(21)); // fov = 42 deg
    const tanHalfHFov = tanHalfVFov * Math.max(0.65, aspect);
    // Đảm bảo toàn bộ chiều dài bàn 2.40m và chiều sâu 0.975m (tăng 30%) nằm trọn với góc nghiêng chuẩn
    const dist = THREE.MathUtils.clamp(1.32 / tanHalfHFov + 0.38, 2.05, 3.55);
    return {
      pos: new THREE.Vector3(
        0.0,
        BENCH_SURFACE_Y + 0.08 + dist * 0.5,
        dist * 0.866,
      ),
      target: new THREE.Vector3(0.0, BENCH_SURFACE_Y + 0.05, -0.01),
    };
  }, []);

  const handleToggleTopView = () => {
    labSoundEngine.play('camera-zoom', 0.8);
    const nextTop = !isTopViewActive;
    setIsTopViewActive(nextTop);
    if (nextTop) {
      cameraGoalPosRef.current = new THREE.Vector3(
        0.0,
        BENCH_SURFACE_Y + 1.65,
        0.18,
      );
      cameraGoalTargetRef.current = new THREE.Vector3(
        0.0,
        BENCH_SURFACE_Y + 0.02,
        0.0,
      );
    } else {
      const fullPose = computeFullBenchCameraPose();
      cameraGoalPosRef.current = fullPose.pos;
      cameraGoalTargetRef.current = fullPose.target;
    }
    requestRenderRef.current();
  };

  const handleFocusCameraPreset = useCallback(
    (preset: 'bench-close' | 'room-overview') => {
      labSoundEngine.play('camera-zoom', 0.85);
      setIsTopViewActive(false);
      if (preset === 'room-overview') {
        cameraGoalPosRef.current = new THREE.Vector3(0.0, 2.85, 5.8);
        cameraGoalTargetRef.current = new THREE.Vector3(0.0, 0.65, 0.0);
        onNotify(
          'Chế độ Xem Toàn Phòng 12.0 × 8.0 × 3.6 m: Quan sát gốc O(0,0,0) ở góc bàn cố định và lưới không gian.',
          'info',
        );
      } else {
        const fullPose = computeFullBenchCameraPose();
        cameraGoalPosRef.current = fullPose.pos;
        cameraGoalTargetRef.current = fullPose.target;
        selectedInstanceIdRef.current = null;
        onSelectInstanceRef.current(null);
        setViewportContextMenu(null);
        onNotify(
          'Đã đưa góc nhìn về Mặc định chính giữa — hiển thị trọn vẹn toàn bộ bàn thí nghiệm (2.40 × 0.98 m) trong khung mô phỏng.',
          'info',
        );
      }
      requestRenderRef.current();
    },
    [computeFullBenchCameraPose, onNotify],
  );

  const handleCaptureSnapshot = () => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;

    labSoundEngine.play('camera-shutter', 0.95);
    renderer.render(scene, camera);
    const dataUrl = renderer.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `openlab3d-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    onNotify('Đã chụp và lưu ảnh bàn thí nghiệm 3D (.png).', 'success');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const assetId = e.dataTransfer.getData('application/openlab-asset-id');
    if (!assetId) return;

    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    if (!camera || !renderer) {
      onDropAssetIntoScene(assetId, [0, 0, 0.08]);
      return;
    }

    const rect = renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.ray.intersectPlane(_rayPlane, _dropPoint);
    if (hit) {
      const clampedX = Number(
        THREE.MathUtils.clamp(_dropPoint.x, -BENCH_LIMIT_X, BENCH_LIMIT_X).toFixed(3),
      );
      const clampedZ = Number(
        THREE.MathUtils.clamp(_dropPoint.z, -BENCH_LIMIT_Z, BENCH_LIMIT_Z).toFixed(3),
      );
      onDropAssetIntoScene(assetId, [clampedX, 0, clampedZ]);
    } else {
      onDropAssetIntoScene(assetId, [0, 0, 0.08]);
    }
  };

  const activeInstance = instances.find((i) => i.instanceId === selectedInstanceId) ?? null;
  const activeAsset =
    viewMode === 'single-asset'
      ? selectedCatalogAsset
      : activeInstance
        ? assetsMap.get(activeInstance.assetId) ?? null
        : null;

  return (
    <div
      className={`relative flex-1 w-full h-full bg-[#182436] rounded-[12px] border overflow-hidden select-none flex flex-col ${
        isDarkMode
          ? 'border-[#263854] shadow-[0_4px_16px_rgba(0,0,0,0.35)]'
          : 'border-[#94A9C4] shadow-[0_2px_10px_rgba(18,52,107,0.08)]'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Top Workspace Header (Only shown in Teacher/Admin Mode) */}
      {!isStudentMode && (
        <div
          className={`h-10 px-3 border-b flex items-center justify-between gap-2 z-20 shrink-0 ${
            isDarkMode
              ? 'bg-[#131E30] border-[#263854] text-slate-100'
              : 'bg-[#F2F6FB] border-[#C4D5E8] text-[#12346B]'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold whitespace-nowrap">
              Không gian Thí nghiệm 3D (Chế độ Giáo viên)
            </span>
            <span className="opacity-60" aria-hidden="true">
              ·
            </span>
            <span className="text-xs text-[#00BCEB] font-mono truncate">
              {environment.name.vi}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className={`flex items-center p-0.5 rounded border ${
                isDarkMode
                  ? 'bg-[#0D1524] border-[#263854]'
                  : 'bg-[#E6EEF8] border-[#C4D5E8]'
              }`}
            >
              <button
                type="button"
                onClick={() => onViewModeChange('lab-scene')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                  viewMode === 'lab-scene'
                    ? 'bg-[#1E6BFF] text-white'
                    : 'text-[#64748B] hover:text-[#1E6BFF]'
                }`}
              >
                Toàn bộ phòng Lab
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('single-asset')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                  viewMode === 'single-asset'
                    ? 'bg-[#1E6BFF] text-white'
                    : 'text-[#64748B] hover:text-[#1E6BFF]'
                }`}
              >
                Xem đơn lẻ
              </button>
            </div>

            <button
              type="button"
              onClick={onResetScene}
              className={`px-2.5 py-1 text-xs font-semibold border rounded transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                isDarkMode
                  ? 'bg-[#1A273D] hover:bg-[#243552] border-[#263854] text-slate-100'
                  : 'bg-[#E6EEF8] hover:bg-[#D5E0ED] border-[#C4D5E8] text-[#12346B]'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#00BCEB]" />
              <span>Đặt lại cảnh</span>
            </button>

            <button
              type="button"
              onClick={onToggleFullscreen}
              className={`p-1.5 border rounded transition-colors ${
                isDarkMode
                  ? 'bg-[#1A273D] hover:bg-[#243552] border-[#263854] text-slate-100'
                  : 'bg-[#E6EEF8] hover:bg-[#D5E0ED] border-[#C4D5E8] text-[#12346B]'
              }`}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main WebGL Canvas Stage */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <div
          ref={mountRef}
          className="w-full h-full"
          aria-label="OpenLab 3D Interactive WebGL Viewport"
        />

        {/* Top-Left Compact Bench-Corner O-XYZ Coordinates & Quick Grid Toggles (Ẩn mặc định trên Mobile trừ khi bật từ Công cụ 3D) */}
        <div
          className={`absolute top-1.5 left-2 ${
            showMobileCoordHud ? 'flex' : 'hidden md:flex'
          } flex-wrap items-center gap-1.5 z-20 max-w-[68%]`}
        >
          <div className="px-1.5 py-1 rounded-full bg-[#081528]/18 backdrop-blur-md border border-white/35 text-white text-[11px] font-mono flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.28)] transition-all">
            <button
              type="button"
              onClick={() => {
                labSoundEngine.play('ui-toggle', 0.65);
                setIsCompassHudExpanded((prev) => !prev);
              }}
              className="h-6 px-2 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[10.5px] font-sans font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
              title={
                isCompassHudExpanded
                  ? 'Ẩn thanh công cụ hệ trục XYZ và khung lưới 3D'
                  : 'Mở thanh công cụ hệ trục XYZ và khung lưới 3D'
              }
              aria-label="La bàn 3D XYZ"
            >
              <Compass className="w-3.5 h-3.5 text-white shrink-0" />
              {isCompassHudExpanded && <span>Ẩn</span>}
            </button>

            {isCompassHudExpanded && (
              <>
                {activeInstance &&
                  (() => {
                    const [bx, by, bz] = worldToBenchCornerCoords([
                      activeInstance.transform.positionM[0],
                      BENCH_SURFACE_Y + activeInstance.transform.positionM[1],
                      activeInstance.transform.positionM[2],
                    ]);
                    return (
                      <span className="font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] pl-0.5">
                        <span className="text-red-400 font-extrabold">X=</span>
                        {formatLengthByUnit(bx, coordSettings.displayUnit)}{' '}
                        <span className="text-emerald-400 font-extrabold">Y=</span>
                        {formatLengthByUnit(by, coordSettings.displayUnit)}{' '}
                        <span className="text-sky-300 font-extrabold">Z=</span>
                        {formatLengthByUnit(bz, coordSettings.displayUnit)}
                      </span>
                    );
                  })()}

                <div className="flex items-center gap-1 pr-1">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !coordSettings.showWorldAxes;
                      handleUpdateCoordSettings({
                        showWorldAxes: next,
                        showOriginMarker: next,
                        showAxisLabels: next,
                        showNumericTicks: next,
                      });
                    }}
                    className={`px-1.5 py-0.5 rounded-[5px] text-[10px] font-sans font-extrabold cursor-pointer transition-colors border ${
                      coordSettings.showWorldAxes
                        ? 'bg-[#1E6BFF]/55 border-[#38BDF8] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]'
                        : 'bg-white/10 hover:bg-white/20 border-white/25 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]'
                    }`}
                    title="Bật/Tắt Hệ trục tọa độ O-XYZ tại góc bàn"
                  >
                    XYZ
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateCoordSettings({
                        showFloorGrid: !coordSettings.showFloorGrid,
                      })
                    }
                    className={`px-1.5 py-0.5 rounded-[5px] text-[10px] font-sans font-extrabold cursor-pointer transition-colors border ${
                      coordSettings.showFloorGrid
                        ? 'bg-[#00BCEB]/55 border-[#7DD3FC] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]'
                        : 'bg-white/10 hover:bg-white/20 border-white/25 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]'
                    }`}
                    title="Bật/Tắt Lưới ô bàn (1 ô = 5 cm)"
                  >
                    Lưới
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateCoordSettings({
                        showSpaceGrid: !coordSettings.showSpaceGrid,
                      })
                    }
                    className={`px-1.5 py-0.5 rounded-[5px] text-[10px] font-sans font-extrabold cursor-pointer transition-colors border ${
                      coordSettings.showSpaceGrid
                        ? 'bg-emerald-500/55 border-emerald-300 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]'
                        : 'bg-white/10 hover:bg-white/20 border-white/25 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]'
                    }`}
                    title="Bật/Tắt Lưới không gian 3D (XZ & YZ)"
                  >
                    3D
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="px-2.5 py-1 rounded-[9px] bg-[#081528]/18 backdrop-blur-md border border-white/35 text-white text-[11px] font-mono flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.28)]">
            <Clock className="w-3.5 h-3.5 text-emerald-300 shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
            <span className="text-[#FDE047] font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
              {formatSimulationDuration(
                clockState.simulationClock.elapsedSeconds,
              )}
            </span>
            <button
              type="button"
              onClick={() =>
                handleSimClockAction(
                  clockState.simulationClock.status === 'running'
                    ? 'pause'
                    : 'resume',
                )
              }
              className="p-0.5 rounded-[5px] bg-white/15 hover:bg-[#1E6BFF]/70 border border-white/25 text-white cursor-pointer transition-colors"
              title={
                clockState.simulationClock.status === 'running'
                  ? 'Tạm dừng đồng hồ mô phỏng'
                  : 'Tiếp tục đồng hồ mô phỏng'
              }
            >
              {clockState.simulationClock.status === 'running' ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE FLOATING TOOLS (< 768px): Ký hiệu trong suốt mờ (Translucent Glass), bật/tắt hướng dẫn trên từng dụng cụ */}
        <div className="absolute top-1.5 right-1.5 flex md:hidden flex-col items-end gap-1.5 z-30">
          <div className="flex items-center gap-1.5">
            {isRecordingVideo && (
              <button
                type="button"
                onClick={handleStopVideoRecording}
                className="h-9 px-2.5 rounded-[9px] bg-red-900/28 backdrop-blur-md border border-red-400/75 text-white font-mono text-[11.5px] font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Dừng ghi hình"
              >
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span>{formatRecTime(recordingElapsedSec)}</span>
                <Square className="w-3 h-3 fill-current" />
              </button>
            )}

            {/* Ký hiệu Góc nhìn chuẩn (Nền trong suốt mờ, ẩn chữ mặc định) */}
            <button
              type="button"
              onClick={() => handleFocusCameraPreset('bench-close')}
              className="h-9 px-2.5 rounded-[9px] bg-[#081528]/18 hover:bg-[#081528]/35 backdrop-blur-md border border-white/35 text-white text-[12px] font-extrabold flex items-center gap-1 shadow-[0_4px_14px_rgba(0,0,0,0.28)] cursor-pointer transition-colors"
              title="Đặt lại góc nhìn chuẩn bàn thí nghiệm"
              aria-label="Góc nhìn chuẩn"
            >
              <RotateCcw className="w-4 h-4 text-[#38BDF8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
              {isDetailedGuideOn && (
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                  Góc chuẩn
                </span>
              )}
            </button>

            {/* Nút Bật/Tắt chú thích trên từng dụng cụ (?) */}
            <button
              type="button"
              onClick={handleToggleDetailedGuides}
              className={`w-9 h-9 rounded-[9px] backdrop-blur-md border flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.28)] transition-colors cursor-pointer ${
                isDetailedGuideOn
                  ? 'bg-amber-500/28 border-amber-300 text-white'
                  : 'bg-[#081528]/18 hover:bg-[#081528]/35 border-white/35 text-amber-300'
              }`}
              title={
                isDetailedGuideOn
                  ? 'Đang BẬT hiển thị tên trên đầu từng dụng cụ (Chạm để ẩn)'
                  : 'Bật hiển thị tên & chú thích trên đầu từng dụng cụ'
              }
              aria-pressed={isDetailedGuideOn}
              aria-label="Bật hoặc tắt chú thích trên từng dụng cụ"
            >
              <HelpCircle className="w-4 h-4 text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
            </button>

            {/* Nút Mở/Ẩn Công cụ 3D trên Mobile (Nền màu đỏ thu gọn) */}
            <button
              type="button"
              onClick={() => setIsMobileToolsOpen((v) => !v)}
              className="h-8 px-2 rounded-[7px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[11.5px] font-extrabold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
              aria-expanded={isMobileToolsOpen}
              aria-label={isMobileToolsOpen ? 'Ẩn Công cụ 3D' : 'Mở Công cụ 3D'}
              title={isMobileToolsOpen ? 'Ẩn thanh công cụ 3D' : 'Mở thanh công cụ 3D'}
            >
              <Sliders className="w-3.5 h-3.5 text-white" />
              <span>{isMobileToolsOpen ? 'Ẩn' : 'Mở'}</span>
              {isMobileToolsOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-white" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-white" />
              )}
            </button>
          </div>

          {isMobileToolsOpen && (
            <div className="w-[248px] rounded-[12px] bg-[#081528]/20 backdrop-blur-md border border-white/35 p-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.4)] text-white space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onToolModeChange(
                      toolMode === 'translate' ? 'select' : 'translate',
                    )
                  }
                  className={`py-2 px-1.5 rounded-[8px] border text-[11px] font-extrabold flex flex-col items-center gap-1 cursor-pointer backdrop-blur-sm ${
                    toolMode === 'translate'
                      ? 'bg-[#1E6BFF]/45 border-[#38BDF8] text-white'
                      : 'bg-slate-950/20 border-white/25 text-white'
                  }`}
                  title="Di chuyển thiết bị"
                >
                  <Move className="w-4 h-4 text-[#38BDF8]" />
                  {isDetailedGuideOn && <span>Di chuyển</span>}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onToolModeChange(
                      toolMode === 'rotate' ? 'select' : 'rotate',
                    )
                  }
                  className={`py-2 px-1.5 rounded-[8px] border text-[11px] font-extrabold flex flex-col items-center gap-1 cursor-pointer backdrop-blur-sm ${
                    toolMode === 'rotate'
                      ? 'bg-[#1E6BFF]/45 border-[#38BDF8] text-white'
                      : 'bg-slate-950/20 border-white/25 text-white'
                  }`}
                  title="Xoay vật thể"
                >
                  <RotateCw className="w-4 h-4 text-[#38BDF8]" />
                  {isDetailedGuideOn && <span>Xoay</span>}
                </button>

                <button
                  type="button"
                  onClick={handleToggleTopView}
                  className={`py-2 px-1.5 rounded-[8px] border text-[11px] font-extrabold flex flex-col items-center gap-1 cursor-pointer backdrop-blur-sm ${
                    isTopViewActive
                      ? 'bg-[#1E6BFF]/45 border-[#38BDF8] text-white'
                      : 'bg-slate-950/20 border-white/25 text-white'
                  }`}
                  title="Nhìn từ trên xuống"
                >
                  <Eye className="w-4 h-4 text-[#38BDF8]" />
                  {isDetailedGuideOn && <span>Nhìn trên</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleSmoothZoom(0.8)}
                  className="py-2 px-1.5 rounded-[8px] bg-slate-950/20 border border-white/25 text-white text-[11px] font-extrabold flex flex-col items-center gap-1 cursor-pointer backdrop-blur-sm"
                  title="Phóng to"
                >
                  <ZoomIn className="w-4 h-4 text-[#38BDF8]" />
                  {isDetailedGuideOn && <span>Phóng to</span>}
                </button>

                <button
                  type="button"
                  onClick={() => handleSmoothZoom(1.25)}
                  className="py-2 px-1.5 rounded-[8px] bg-slate-950/20 border border-white/25 text-white text-[11px] font-extrabold flex flex-col items-center gap-1 cursor-pointer backdrop-blur-sm"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-4 h-4 text-[#38BDF8]" />
                  {isDetailedGuideOn && <span>Thu nhỏ</span>}
                </button>

                <button
                  type="button"
                  onClick={onToggleLabels}
                  className={`py-2 px-1.5 rounded-[8px] border text-[11px] font-extrabold flex flex-col items-center gap-1 cursor-pointer backdrop-blur-sm ${
                    showLabels
                      ? 'bg-emerald-900/30 border-emerald-400/75 text-[#5EEAD4]'
                      : 'bg-slate-950/20 border-white/25 text-slate-200'
                  }`}
                  title="Bật/tắt thông số nổi trên dụng cụ"
                >
                  <Tag className="w-4 h-4" />
                  {isDetailedGuideOn && (
                    <span>{showLabels ? 'Số đo: Bật' : 'Số đo: Tắt'}</span>
                  )}
                </button>
              </div>

              <div className="pt-1.5 border-t border-white/20 grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const nextHud = !showMobileCoordHud;
                    setShowMobileCoordHud(nextHud);
                    handleUpdateCoordSettings({
                      showFloorGrid: nextHud,
                      showWorldAxes: nextHud,
                    });
                  }}
                  className={`py-2 px-1.5 rounded-[7px] border text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    showMobileCoordHud
                      ? 'bg-[#1E6BFF]/45 border-[#38BDF8] text-white'
                      : 'bg-slate-950/20 border-white/25 text-white'
                  }`}
                  title="Lưới & Tọa độ XYZ"
                >
                  <Grid className="w-3.5 h-3.5 text-[#38BDF8]" />
                  {isDetailedGuideOn && <span>XYZ</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextMuted = labSoundEngine.toggleMute();
                    onNotify(
                      !nextMuted
                        ? 'Đã BẬT âm thanh hiện tượng thực tế.'
                        : 'Đã TẮT âm thanh hiện tượng.',
                      'info',
                    );
                  }}
                  className={`py-2 px-1.5 rounded-[7px] border text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    !isSoundMuted
                      ? 'bg-emerald-900/30 border-emerald-400/75 text-[#4ADE80]'
                      : 'bg-slate-950/20 border-white/25 text-slate-200'
                  }`}
                  title="Bật/tắt âm thanh"
                >
                  {!isSoundMuted ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                  {isDetailedGuideOn && <span>Âm</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileToolsOpen(false);
                    if (!isRecordingVideo) handleStartVideoRecording();
                    else handleStopVideoRecording();
                  }}
                  className="py-2 px-1.5 rounded-[7px] bg-red-900/28 border border-red-400/75 text-white text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 cursor-pointer"
                  title="Ghi hình 3D"
                >
                  <Video className="w-3.5 h-3.5 text-red-200" />
                  {isDetailedGuideOn && <span>REC</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileToolsOpen(false);
                    setShowEnvSpecModal(true);
                  }}
                  className="py-2 px-1.5 rounded-[7px] bg-slate-950/20 border border-white/25 text-white text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 cursor-pointer"
                  title="Biến vật lý môi trường"
                >
                  <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
                  {isDetailedGuideOn && <span>Môi trường</span>}
                </button>
              </div>

              {/* Thanh tăng/giảm cỡ chữ số đo trên Mobile */}
              <div className="pt-1.5 border-t border-white/20 flex items-center justify-between gap-1.5">
                <span className="text-[11px] font-extrabold text-emerald-300">
                  Cỡ chữ số đo:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustReadoutFontScale(-0.1)}
                    className="px-2 py-1 rounded-[6px] bg-slate-900/80 hover:bg-slate-800 border border-white/25 text-white font-mono text-[11px] font-extrabold cursor-pointer"
                    title="Giảm cỡ chữ thông số đo"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    onClick={() => updateReadoutFontScale(1.25)}
                    className="px-2 py-1 rounded-[6px] bg-emerald-950/80 border border-emerald-400/70 text-[#5EEAD4] font-mono text-[11px] font-extrabold tabular-nums cursor-pointer"
                    title="Nhấn để đặt lại cỡ chữ số đo chuẩn (125%)"
                  >
                    {Math.round(readoutFontScale * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustReadoutFontScale(0.1)}
                    className="px-2 py-1 rounded-[6px] bg-slate-900/80 hover:bg-slate-800 border border-white/25 text-white font-mono text-[11px] font-extrabold cursor-pointer"
                    title="Tăng cỡ chữ thông số đo"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top-Right Compact Translucent Icon Toolbar on Desktop/Tablet (>= 768px) */}
        <div className="absolute top-1.5 right-1.5 hidden md:flex items-center justify-end gap-1 z-20">
          {!isTopRightToolbarCollapsed && (
            <>
              {/* Nút Mặc định: Đưa góc nhìn về giữa thấy toàn bộ bàn thí nghiệm nằm đủ khung mô phỏng */}
              <button
                type="button"
                onClick={() => handleFocusCameraPreset('bench-close')}
                className="h-7 px-2 rounded-[7px] bg-[#081528]/35 hover:bg-cyan-500/35 backdrop-blur-md border border-cyan-300/75 text-cyan-100 flex items-center gap-1 shadow-[0_4px_14px_rgba(0,0,0,0.28)] transition-colors cursor-pointer text-[11px] font-bold tracking-tight"
                title="Đưa góc nhìn về chính giữa để thấy toàn bộ bàn thí nghiệm nằm gọn trong khung mô phỏng"
                aria-label="Mặc định thấy toàn bộ bàn thí nghiệm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
                <span>Mặc định (Toàn bàn)</span>
              </button>

              {/* Cụm nút Tăng / Giảm cỡ chữ số đo trên dụng cụ (A- | % | A+) */}
              <div
                className="h-7 px-1 rounded-[7px] bg-[#081528]/45 backdrop-blur-md border border-emerald-400/75 flex items-center gap-0.5 shadow-[0_4px_14px_rgba(0,0,0,0.28)]"
                title="Tăng / Giảm cỡ chữ số đo hiển thị trên các dụng cụ thí nghiệm"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (!showLabels) onToggleLabels();
                    adjustReadoutFontScale(-0.1);
                  }}
                  className="h-5 px-1.5 rounded-[5px] bg-slate-900/80 hover:bg-emerald-600/60 border border-white/20 text-white font-mono text-[11px] font-black cursor-pointer transition-colors"
                  title="Giảm cỡ chữ số đo (A-)"
                  aria-label="Giảm cỡ chữ số đo"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!showLabels) onToggleLabels();
                    else updateReadoutFontScale(1.25);
                  }}
                  className="h-5 px-1.5 rounded-[5px] hover:bg-white/10 text-[#5EEAD4] font-mono text-[11px] font-extrabold tabular-nums cursor-pointer"
                  title="Cỡ chữ số đo hiện tại (Nhấn để đặt lại chuẩn 125%)"
                >
                  {Math.round(readoutFontScale * 100)}%
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!showLabels) onToggleLabels();
                    adjustReadoutFontScale(0.1);
                  }}
                  className="h-5 px-1.5 rounded-[5px] bg-slate-900/80 hover:bg-emerald-600/60 border border-white/20 text-white font-mono text-[11px] font-black cursor-pointer transition-colors"
                  title="Tăng cỡ chữ số đo (A+)"
                  aria-label="Tăng cỡ chữ số đo"
                >
                  A+
                </button>
              </div>

              {/* 0. Bật / Tắt chú thích trên đầu từng dụng cụ (?) */}
              <button
                type="button"
                onClick={handleToggleDetailedGuides}
                className={`w-7 h-7 rounded-[7px] backdrop-blur-md border flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.28)] transition-colors cursor-pointer ${
                  isDetailedGuideOn
                    ? 'bg-amber-500/25 hover:bg-amber-500/40 border-amber-300/85 text-white'
                    : 'bg-[#081528]/18 hover:bg-[#081528]/35 border-white/35 text-amber-300'
                }`}
                title={
                  isDetailedGuideOn
                    ? 'Đang BẬT hiển thị tên trên từng dụng cụ (Nhấn để ẩn bớt chữ)'
                    : 'Bật hiển thị tên & chú thích trên đầu từng dụng cụ'
                }
                aria-pressed={isDetailedGuideOn}
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
              </button>

              {/* 1. Ghi hình thực hành / Điều khiển REC */}
              {!isRecordingVideo ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleStartVideoRecording}
                    className="w-7 h-7 rounded-[7px] bg-[#081528]/18 hover:bg-red-600/45 backdrop-blur-md border border-red-400/75 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.28)] transition-colors cursor-pointer"
                    title="Ghi hình thực hành 3D & tự động lưu các bước đo"
                    aria-label="Ghi hình thực hành 3D"
                  >
                    <Video className="w-3.5 h-3.5 text-red-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
                  </button>

                  {completedRecordingSession && (
                    <button
                      type="button"
                      onClick={() => setShowVideoRecorderModal(true)}
                      className="w-7 h-7 rounded-[7px] bg-[#081528]/18 hover:bg-[#1E6BFF]/45 backdrop-blur-md border border-[#FACC15]/80 text-[#FACC15] hover:text-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.28)] transition-colors cursor-pointer"
                      title={`Xuất Video tóm tắt quá trình (${completedRecordingSession.milestones.length} bước)`}
                      aria-label="Xuất Video tóm tắt"
                    >
                      <Sparkles className="w-3.5 h-3.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-[7px] bg-[#081528]/25 backdrop-blur-md border border-red-400/80 text-white shadow-[0_4px_14px_rgba(0,0,0,0.32)]">
                  <span className="flex items-center gap-1 font-mono text-[11px] font-extrabold text-red-200 pr-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isRecordingPaused
                          ? 'bg-amber-400'
                          : 'bg-red-500 animate-ping'
                      }`}
                    />
                    <span>{formatRecTime(recordingElapsedSec)}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const activeInst = instances.find(
                        (i) => i.instanceId === selectedInstanceId,
                      );
                      const activeAst = activeInst
                        ? assetsMap.get(activeInst.assetId)
                        : undefined;
                      const manualLabel = activeAst
                        ? `Đánh dấu bước: ${activeInst?.customLabel || activeAst.name.vi}`
                        : studentCurrentHint
                          ? `Đánh dấu: ${studentCurrentHint}`
                          : `Đánh dấu bước thực hành #${recordedMilestonesCount + 1}`;
                      recordStepMilestoneInternal(manualLabel, false);
                    }}
                    className="w-6.5 h-6.5 rounded-[6px] bg-[#1E6BFF]/55 hover:bg-[#1E6BFF]/80 border border-white/30 text-white flex items-center justify-center cursor-pointer"
                    title="Đánh dấu & chụp bước thực hành hiện tại"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handlePauseResumeVideoRecording}
                    className="w-6.5 h-6.5 rounded-[6px] bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center cursor-pointer"
                    title={isRecordingPaused ? 'Tiếp tục ghi hình' : 'Tạm dừng ghi hình'}
                  >
                    {isRecordingPaused ? (
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Pause className="w-3.5 h-3.5 text-amber-300" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleStopVideoRecording}
                    className="w-6.5 h-6.5 rounded-[6px] bg-emerald-500/75 hover:bg-emerald-500 text-white flex items-center justify-center cursor-pointer"
                    title="Dừng ghi hình & Xuất Video"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              )}

              {/* 2. Cài đặt Môi trường XYZ & Đồng hồ (Icon) */}
              <button
                type="button"
                onClick={() => setShowEnvSpecModal(true)}
                className="w-7 h-7 rounded-[7px] bg-[#081528]/18 hover:bg-[#081528]/35 backdrop-blur-md border border-white/35 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.28)] transition-colors cursor-pointer"
                title="Cài đặt Môi trường 3D: Hệ tọa độ XYZ, Đo khoảng cách & 13 Biến vật lý"
                aria-label="Cài đặt Môi trường 3D"
              >
                <Sliders className="w-3.5 h-3.5 text-[#38BDF8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
              </button>

              {/* 3. Bật / Tắt Âm thanh hiện tượng (Icon) */}
              <button
                type="button"
                onClick={() => {
                  const nextMuted = labSoundEngine.toggleMute();
                  if (!nextMuted) {
                    labSoundEngine.play('probe-measure', { value: 7.0 });
                    onNotify(
                      'Đã BẬT âm thanh hiện tượng thực tế (rót nước, thả vật, cân điện tử, tia laser, cảm ứng điện từ...).',
                      'success',
                    );
                  } else {
                    onNotify('Đã TẮT âm thanh hiện tượng phòng thí nghiệm.', 'info');
                  }
                }}
                className={`w-7 h-7 rounded-[7px] backdrop-blur-md border flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.28)] transition-colors cursor-pointer ${
                  !isSoundMuted
                    ? 'bg-[#081528]/18 hover:bg-emerald-900/35 border-emerald-400/75 text-[#4ADE80]'
                    : 'bg-[#081528]/18 hover:bg-[#081528]/35 border-white/35 text-slate-200'
                }`}
                title={
                  !isSoundMuted
                    ? 'Âm thanh hiện tượng đang BẬT (Nhấn để tắt)'
                    : 'Âm thanh hiện tượng đang TẮT (Nhấn để bật)'
                }
                aria-label="Bật hoặc tắt âm thanh"
              >
                {!isSoundMuted ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#4ADE80] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
                )}
              </button>

              {/* 4. Toàn màn hình / Thu nhỏ (Icon) */}
              {isStudentMode && (
                <button
                  type="button"
                  onClick={onToggleFullscreen}
                  className="w-7 h-7 rounded-[7px] bg-[#081528]/18 hover:bg-[#081528]/35 backdrop-blur-md border border-white/35 text-slate-100 flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.28)] transition-colors cursor-pointer"
                  title={
                    isFullscreen
                      ? 'Thu nhỏ về bố cục chuẩn'
                      : 'Phóng to toàn màn hình vùng mô phỏng 3D'
                  }
                  aria-label="Toàn màn hình"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5 text-[#38BDF8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5 text-[#38BDF8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
                  )}
                </button>
              )}
            </>
          )}

          {/* Nút Ẩn / Mở thanh công cụ góc phải trên (Nền màu đỏ thu gọn) */}
          <button
            type="button"
            onClick={() => setIsTopRightToolbarCollapsed((v) => !v)}
            className="h-7 px-2 rounded-[7px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[11px] font-extrabold flex items-center justify-center gap-0.5 shadow-sm transition-colors cursor-pointer"
            title={
              isTopRightToolbarCollapsed
                ? 'Mở thanh công cụ góc phải trên'
                : 'Ẩn thanh công cụ góc phải trên'
            }
            aria-label={
              isTopRightToolbarCollapsed
                ? 'Mở thanh công cụ góc phải trên'
                : 'Ẩn thanh công cụ góc phải trên'
            }
          >
            {isTopRightToolbarCollapsed ? (
              <>
                <Sliders className="w-3.5 h-3.5 text-white" />
                <span>Mở</span>
              </>
            ) : (
              <span>Ẩn</span>
            )}
          </button>
        </div>

        {/* Drag & Drop Target Overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-[#1E6BFF]/15 border-2 border-dashed border-[#00BCEB] flex items-center justify-center z-30 pointer-events-none">
            <div className="bg-slate-900/60 backdrop-blur-md border border-[#00BCEB] px-6 py-3.5 rounded-[12px] shadow-lg text-center">
              <p className="text-[16px] font-bold text-white">
                Thả thiết bị vào đây để đặt lên bàn gỗ thí nghiệm
              </p>
            </div>
          </div>
        )}

        {/* Active Physical Docking Feedback Pill - Nền trong suốt siêu gọn sát lề */}
        {activeDockHint && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-950/25 backdrop-blur-[2px] border border-[#00BCEB]/40 text-cyan-200 px-3 py-0.5 rounded-full text-[12px] font-bold shadow-xs z-30 pointer-events-none whitespace-nowrap">
            {activeDockHint}
          </div>
        )}

        {/* Click-to-Connect Wire Banner */}
        {pendingWireConnection && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-sky-950/90 backdrop-blur-xs border border-sky-400 text-sky-100 px-3.5 py-1.5 rounded-full text-[12px] font-bold shadow-lg z-30 flex items-center gap-2 whitespace-nowrap animate-pulse">
            <span>⚡ Đang nối dây {pendingWireConnection.polarity === 'pos' ? 'ĐỎ (+)' : 'ĐEN (-)'}: Nhấp vào {pendingWireConnection.sourceArch === 'optical-lamp' ? 'Bộ Nguồn' : 'Đèn Chiếu Sáng'} để cắm dây!</span>
            <button
              type="button"
              onClick={() => setPendingWireConnection(null)}
              className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer text-[10.5px] border border-white/20"
            >
              ✕ Hủy
            </button>
          </div>
        )}

        {/* Floating Interactive Terminal Tooltip when hovering Red/Black binding posts */}
        {hoveredTerminal && !dragStateRef.current.isDragging && (
          <div
            className="absolute z-40 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-2.5 py-1 rounded-[8px] border shadow-xl backdrop-blur-md text-white flex items-center gap-1.5 whitespace-nowrap animate-in fade-in duration-100"
            style={{
              left: `${Math.round(hoveredTerminal.screenX)}px`,
              top: `${Math.round(hoveredTerminal.screenY)}px`,
              backgroundColor:
                hoveredTerminal.polarity === 'pos'
                  ? 'rgba(185, 28, 28, 0.92)'
                  : 'rgba(15, 23, 42, 0.95)',
              borderColor:
                hoveredTerminal.polarity === 'pos' ? '#f87171' : '#64748b',
            }}
          >
            <span className="text-xs">
              {hoveredTerminal.polarity === 'pos' ? '🔴' : '⚫'}
            </span>
            <span className="text-[11px] font-extrabold">
              {hoveredTerminal.label}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                hoveredTerminal.isConnected
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'bg-black/50 text-amber-300 border border-amber-400/40'
              }`}
            >
              {hoveredTerminal.isConnected
                ? 'ĐÃ CẮM · Nhấn để rút'
                : 'KÉO DÂY NỐI'}
            </span>
          </div>
        )}

        {/* Loading Progress Indicator */}
        {loadingCount > 0 && (
          <div className="absolute top-3 left-3 bg-slate-900/45 backdrop-blur-md border border-white/25 px-3 py-1.5 rounded-[9px] text-[13px] text-slate-100 font-semibold flex items-center gap-2 z-20 shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00BCEB]" />
            <span>3D...</span>
          </div>
        )}

        {/* Simulated Loader Error & Retry Banner */}
        {simulatedError && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border-2 border-[#FF647C] px-4 py-2.5 rounded-[10px] text-xs text-white flex items-center gap-3 z-30 max-w-md shadow-lg">
            <AlertTriangle className="w-4 h-4 text-[#FF647C] shrink-0" />
            <div className="flex-1">
              <p className="font-bold">Lỗi tải tệp GLB ngoại vi</p>
              <p className="text-slate-300 mt-0.5">{simulatedError}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSimulatedError(null);
                requestRenderRef.current();
                onNotify('Đã khôi phục kết nối bộ nạp GLTFLoader.', 'success');
              }}
              className="px-2.5 py-1 bg-[#1E6BFF] text-white font-semibold rounded whitespace-nowrap"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Thanh chú thích / thông số thu gọn nằm sát đáy khung mô phỏng khi rê chuột (Không che giữa màn hình 3D) */}
        {hoveredEquipment &&
          (isDetailedGuideOn ||
            hoveredEquipment.readoutBadge === 'KHU TRƯNG BÀY') &&
          !dragStateRef.current.isDragging &&
          viewMode === 'lab-scene' && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 ${
                activeInstance ? 'bottom-11' : 'bottom-1.5'
              } z-30 pointer-events-none rounded-full border border-white/40 bg-[#081528]/82 backdrop-blur-md text-white px-3 py-1 shadow-[0_6px_18px_rgba(0,0,0,0.45)] max-w-[94%] flex items-center gap-2 whitespace-nowrap overflow-hidden`}
              role="tooltip"
            >
              <span className="text-[11.5px] font-extrabold text-amber-200 shrink-0">
                {hoveredEquipment.title}
              </span>
              {hoveredEquipment.readoutBadge && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-950/90 text-[#5EEAD4] border border-[#2DD4BF] text-[11px] font-mono font-black tabular-nums shrink-0">
                  {hoveredEquipment.readoutBadge}
                </span>
              )}
              <span className="text-[11px] font-medium text-slate-200 truncate">
                — {hoveredEquipment.interactionHint}
              </span>
            </div>
          )}

        {/* Menu Chuột Phải (Right-Click Context Menu) trực tiếp trên Dụng Cụ 3D — Glassmorphism trong suốt mờ + Chữ đậm */}
        {viewportContextMenu && (
          <div
            style={{
              left: `${viewportContextMenu.x}px`,
              top: `${viewportContextMenu.y}px`,
            }}
            onClick={(e) => e.stopPropagation()}
            className="fixed z-50 w-[268px] rounded-[13px] bg-[#081528]/60 backdrop-blur-2xl border-[1.5px] border-[#38BDF8]/75 shadow-[0_16px_42px_rgba(0,0,0,0.62)] text-white p-2 space-y-1"
          >
            <div className="px-2.5 py-1.5 border-b border-white/25 flex items-center gap-2.5">
              {/* Khung ảnh nhỏ sắc nét KHÔNG làm mờ */}
              <div className="w-10 h-10 rounded-[8px] bg-white border border-slate-300 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                <EquipmentThumbnailSvg
                  archetype={viewportContextMenu.asset.geometry.proceduralArchetype}
                  assetId={viewportContextMenu.asset.assetId}
                  className="w-8 h-8"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10.5px] font-extrabold text-[#7DD3FC] uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                  Dụng cụ trên bàn 3D
                </div>
                <div className="text-[13px] font-extrabold text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  {viewportContextMenu.customLabel || viewportContextMenu.asset.name.vi}
                </div>
                <div className="text-[11px] font-mono font-bold text-amber-200 truncate">
                  {viewportContextMenu.asset.assetId}
                </div>
              </div>
            </div>

            {onQuickLabAction && (
              <>
                {viewportContextMenu.asset.geometry.proceduralArchetype ===
                  'optical-microscope' && (
                  <button
                    type="button"
                    onClick={() => {
                      const instId = viewportContextMenu.instanceId;
                      setViewportContextMenu(null);
                      onQuickLabAction('open-microscope-viewport', instId);
                    }}
                    className="w-full px-2.5 py-2.5 rounded-[8px] bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-left text-[13px] font-black text-white flex items-center gap-2 cursor-pointer transition-all shadow-md border border-sky-400/50"
                  >
                    <Eye className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>🔬 Soi thị kính (KHTN THCS)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const instId = viewportContextMenu.instanceId;
                    setViewportContextMenu(null);
                    onQuickLabAction('open-sgk-profile', instId);
                  }}
                  className="w-full px-2.5 py-2 rounded-[8px] hover:bg-[#1E6BFF]/80 text-left text-[12.5px] font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Camera className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Thông tin sản phẩm & Ảnh thật</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const instId = viewportContextMenu.instanceId;
                    setViewportContextMenu(null);
                    onQuickLabAction('edit-product-info', instId);
                  }}
                  className="w-full px-2.5 py-2 rounded-[8px] hover:bg-[#1E6BFF]/75 text-left text-[12.5px] font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Sliders className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <span>Sửa thông số sản phẩm này</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const instId = viewportContextMenu.instanceId;
                    setViewportContextMenu(null);
                    onQuickLabAction('open-html-updater', instId);
                  }}
                  className="w-full px-2.5 py-2 rounded-[8px] bg-emerald-950/60 hover:bg-emerald-900/75 border border-[#14B8A6]/60 text-left text-[12.5px] font-extrabold text-[#5EEAD4] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                  <span>Cập nhật sản phẩm bằng .HTML</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const instId = viewportContextMenu.instanceId;
                    setViewportContextMenu(null);
                    onQuickLabAction('rotate-90', instId);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-[8px] hover:bg-white/10 text-left text-[12px] font-semibold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors border-t border-white/15 pt-2"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                  <span>Xoay dụng cụ 90°</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const instId = viewportContextMenu.instanceId;
                    setViewportContextMenu(null);
                    onQuickLabAction('delete-instance', instId);
                  }}
                  className="w-full px-2.5 py-2 rounded-[8px] bg-sky-950/75 hover:bg-sky-600/85 border border-sky-400/60 text-left text-[12.5px] font-extrabold text-sky-200 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Layers className="w-4 h-4 text-sky-300 shrink-0" />
                  <span>
                    {instances.find((i) => i.instanceId === viewportContextMenu.instanceId)
                      ?.instanceState.attachmentSlot === 'shelf'
                      ? 'Đưa từ Khu trưng bày xuống bàn'
                      : 'Đưa vào Khu trưng bày (Cất khỏi bàn)'}
                  </span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Projected 3D Equipment Badges: Luôn hiển thị gọn 1 dòng (Pill) để không bao giờ che khuất các dụng cụ khác trên bàn */}
        {showLabels &&
          viewMode === 'lab-scene' &&
          projectedLabels.map((lbl) => {
            const numPx = Math.round(
              (lbl.isSelected ? 13.5 : 12.5) * readoutFontScale,
            );
            const symPx = Math.round(12.5 * readoutFontScale);
            const titlePx = Math.round(11.5 * readoutFontScale);
            return (
              <button
                key={lbl.instanceId}
                type="button"
                onClick={() => {
                  labSoundEngine.play('ui-toggle', 0.65);
                  onSelectInstance(lbl.instanceId);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelectInstance(lbl.instanceId);
                  const hitAsset = assetsMap.get(lbl.assetId);
                  if (hitAsset) {
                    labSoundEngine.play('ui-toggle', 0.85);
                    setViewportContextMenu({
                      instanceId: lbl.instanceId,
                      asset: hitAsset,
                      customLabel: lbl.title,
                      x: Math.min(e.clientX, window.innerWidth - 265),
                      y: Math.min(e.clientY, window.innerHeight - 230),
                    });
                  }
                }}
                style={{
                  transform: `translate3d(${lbl.x}px, ${lbl.y}px, 0) translate(-50%, -100%)`,
                }}
                title={`${lbl.title}${lbl.readoutBadge ? ` · ${lbl.readoutBadge}` : ''} — ${lbl.interactionHint}`}
                className={`absolute top-0 left-0 z-10 transition-all pointer-events-auto cursor-pointer backdrop-blur-[2px] border px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap ${
                  lbl.isSelected
                    ? 'bg-sky-950/30 border-[1.5px] border-cyan-400 text-white shadow-[0_2px_8px_rgba(56,189,248,0.35)]'
                    : isDetailedGuideOn
                      ? 'bg-slate-950/20 border-amber-300/50 text-amber-100 shadow-xs hover:bg-slate-950/40'
                      : 'bg-slate-950/15 hover:bg-slate-950/35 border border-white/20 text-white shadow-xs'
                }`}
              >
                <span
                  style={{ fontSize: `${symPx}px` }}
                  className="leading-none"
                  aria-hidden="true"
                >
                  {lbl.symbol}
                </span>
                {isDetailedGuideOn && (
                  <span
                    style={{ fontSize: `${titlePx}px` }}
                    className="font-extrabold text-amber-200 truncate max-w-[130px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]"
                  >
                    {lbl.title}
                  </span>
                )}
                {lbl.readoutBadge && (
                  <span
                    style={{ fontSize: `${numPx}px`, lineHeight: 1.1 }}
                    className={`font-mono font-black tabular-nums tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.98)] ${
                      lbl.isDigitalScale
                        ? 'text-[#5EEAD4]'
                        : 'text-[#7DD3FC]'
                    }`}
                  >
                    {lbl.readoutBadge}
                  </span>
                )}
              </button>
            );
          })}

        {/* Thanh điều khiển Mở van lấy nước theo thể tích cần — Gọn 1 hàng ngang sát đáy khung mô phỏng */}
        {viewMode === 'lab-scene' &&
          onDispenseWaterVolume &&
          isWaterValveOpenUI && (() => {
            const dispenserInst = instances.find(
              (i) =>
                i.visible &&
                assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
                  'water-dispenser',
            );
            const dispenserRemainMl =
              dispenserInst?.instanceState.liquidLevelMl ?? 850;
            const receivingVessels = instances.filter((i) => {
              if (!i.visible) return false;
              const arch = assetsMap.get(i.assetId)?.geometry.proceduralArchetype;
              return (
                arch === 'graduated-cylinder' ||
                arch === 'beaker-250' ||
                arch === 'overflow-can' ||
                arch === 'erlenmeyer-flask' ||
                arch === 'porcelain-dish'
              );
            });
            const resolvedTargetId =
              receivingVessels.some((v) => v.instanceId === valveTargetInstanceId)
                ? valveTargetInstanceId
                : activeInstance &&
                    receivingVessels.some(
                      (v) => v.instanceId === activeInstance.instanceId,
                    )
                  ? activeInstance.instanceId
                  : receivingVessels[0]?.instanceId ?? '';
            const parsedMl = Math.max(
              0.5,
              Math.min(500, Number(valveInputMl) || 0),
            );

            return (
              <div className="absolute inset-x-2 bottom-1 z-30 rounded-xl border border-cyan-400/40 bg-slate-950/25 backdrop-blur-[3px] text-white px-2.5 py-1 shadow-sm flex flex-wrap items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11.5px] font-extrabold text-sky-200">
                    🚰 Van cấp nước ({dispenserRemainMl.toFixed(0)} ml):
                  </span>
                  {dispenserInst && (
                    <button
                      type="button"
                      onClick={() =>
                        onDispenseWaterVolume(
                          dispenserInst.instanceId,
                          1000,
                          'refill-dispenser',
                        )
                      }
                      className="px-1.5 py-0.5 rounded bg-sky-500/25 hover:bg-sky-500/45 border border-sky-300/70 text-[10.5px] font-mono font-bold text-white cursor-pointer"
                      title="Châm đầy 1000 ml nước cất"
                    >
                      +1000ml
                    </button>
                  )}
                </div>

                {/* Chọn dụng cụ hứng + Nhập ml + Mức nhanh + Nút xả */}
                <div className="flex flex-wrap items-center gap-1.5 flex-1 justify-end">
                  <select
                    value={resolvedTargetId}
                    onChange={(e) => setValveTargetInstanceId(e.target.value)}
                    className="rounded-[6px] bg-slate-950/80 border border-white/35 focus:border-[#00BCEB] px-2 py-0.5 text-[11px] font-bold text-white outline-none max-w-[210px]"
                  >
                    {receivingVessels.map((v) => {
                      const vAsset = assetsMap.get(v.assetId);
                      const vArch = vAsset?.geometry.proceduralArchetype;
                      const vCap =
                        vArch === 'overflow-can'
                          ? 210
                          : vAsset?.scientificProperties.capacity?.value ?? 100;
                      const vCur = v.instanceState.liquidLevelMl ?? vCap * 0.5;
                      const vSym = vAsset ? getEquipmentSymbol(vAsset) : '🧪';
                      return (
                        <option
                          key={v.instanceId}
                          value={v.instanceId}
                          className="bg-[#0B172A] text-white font-bold"
                        >
                          {vSym} {vCur.toFixed(1)}/{vCap}ml ({v.customLabel || vAsset?.name.vi})
                        </option>
                      );
                    })}
                  </select>

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0.5}
                      max={250}
                      step={0.5}
                      value={valveInputMl}
                      onChange={(e) => setValveInputMl(e.target.value)}
                      className="w-16 rounded-[6px] bg-slate-950/80 border border-[#2DD4BF] px-1.5 py-0.5 font-mono text-[12px] font-extrabold text-[#67E8F9] tabular-nums outline-none"
                      placeholder="ml"
                    />
                    <span className="font-mono text-[11px] font-bold text-[#5EEAD4]">
                      ml
                    </span>
                  </div>

                  <div className="hidden md:flex items-center gap-1">
                    {[10, 25, 50, 100].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setValveInputMl(String(preset))}
                        className={`px-1.5 py-0.5 rounded font-mono text-[10.5px] font-bold cursor-pointer border ${
                          Number(valveInputMl) === preset
                            ? 'bg-[#1E6BFF] text-white border-white'
                            : 'bg-slate-900/70 text-slate-200 border-white/25 hover:border-[#00BCEB]'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={!resolvedTargetId}
                    onClick={() => {
                      if (!resolvedTargetId) return;
                      triggerDispenseVisualAnimation(
                        resolvedTargetId,
                        parsedMl,
                        'add',
                      );
                      onDispenseWaterVolume(resolvedTargetId, parsedMl, 'add');
                    }}
                    className="px-2 py-0.5 rounded-[6px] bg-[#1E6BFF] hover:bg-[#1552C7] border border-white/30 disabled:opacity-40 text-white font-mono text-[11px] font-extrabold cursor-pointer tabular-nums"
                  >
                    +{parsedMl.toFixed(1)}ml
                  </button>
                  <button
                    type="button"
                    disabled={!resolvedTargetId}
                    onClick={() => {
                      if (!resolvedTargetId) return;
                      triggerDispenseVisualAnimation(
                        resolvedTargetId,
                        parsedMl,
                        'set',
                      );
                      onDispenseWaterVolume(resolvedTargetId, parsedMl, 'set');
                    }}
                    className="px-2 py-0.5 rounded-[6px] bg-emerald-600/85 hover:bg-emerald-600 disabled:opacity-40 border border-emerald-300/80 text-white font-mono text-[11px] font-extrabold cursor-pointer tabular-nums"
                    title={`Đặt mực nước chuẩn bằng ${parsedMl.toFixed(1)} ml`}
                  >
                    ={parsedMl.toFixed(1)}ml
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWaterValveOpenUI(false)}
                    className="px-1.5 py-0.5 rounded-[6px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[10.5px] font-extrabold flex items-center gap-0.5 cursor-pointer"
                    aria-label="Đóng bảng van nước"
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            );
          })()}

        {/* DEVICE BOTTOM BAR: Thanh điều khiển & thông số cực gọn nằm sát dưới cùng trong khung mô phỏng (Không che vật thể 3D) */}
        {viewMode === 'lab-scene' &&
          activeInstance &&
          activeAsset &&
          onQuickLabAction &&
          (() => {
            const liveReadout = computeLiveEquipmentReadout(
              activeInstance,
              activeAsset,
            );
            const eqSymbol = getEquipmentSymbol(activeAsset);
            const dims = activeAsset.geometry.boundingBoxM;
            const dimsMmText = `${Math.round(dims.width * 1000)}×${Math.round(
              dims.height * 1000,
            )}×${Math.round(dims.depth * 1000)}mm`;
            const previewEntry = equipmentImagePreviewController.getEntry(
              activeAsset.assetId,
            );
            const realPhotoSrc =
              previewEntry?.realPhotoMeta.available &&
              previewEntry?.realPhotoMeta.sourceKind === 'real-photo'
                ? previewEntry.realPhotoMeta.src
                : null;

            // STATE A: COLLAPSED PILL (Thu gọn tối đa sát mép lề dưới, NỀN TRONG SUỐT HOÀN TOÀN)
            if (deviceSheetMode === 'collapsed') {
              return (
                <div className="absolute bottom-1 left-2 z-20 flex items-center gap-1.5 bg-slate-950/20 backdrop-blur-[2px] border border-white/20 hover:border-cyan-400/50 rounded-full pl-2.5 pr-1 py-0.5 shadow-sm max-w-[94vw] transition-colors">
                  <span className="text-[13px] leading-none" aria-hidden="true">
                    {eqSymbol}
                  </span>
                  <span className="text-[12px] font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] truncate max-w-[170px]">
                    {activeInstance.customLabel || activeAsset.name.vi}
                  </span>
                  {liveReadout.readoutBadge && (
                    <span
                      style={{
                        fontSize: `${Math.round(12.5 * readoutFontScale)}px`,
                        lineHeight: 1.1,
                      }}
                      className="px-2 py-0.2 rounded-full bg-slate-950/30 border border-emerald-400/70 text-[#5EEAD4] font-mono font-black tabular-nums shrink-0"
                    >
                      {liveReadout.readoutBadge}
                    </span>
                  )}
                  {/* Nút gọi các nút thao tác khi người dùng cần */}
                  <button
                    type="button"
                    onClick={() => setDeviceSheetMode('compact')}
                    className="h-5 px-2 rounded-full bg-sky-500/25 hover:bg-sky-500/50 border border-sky-400/40 text-sky-200 hover:text-white text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    title="Mở các nút thao tác cho thiết bị này"
                  >
                    <span>⚡ Thao tác</span>
                    <ChevronUp className="w-3 h-3 text-sky-200" />
                  </button>
                  {/* Nút bỏ chọn thiết bị */}
                  <button
                    type="button"
                    onClick={() => onSelectInstance(null)}
                    className="w-5 h-5 rounded-full hover:bg-rose-500/40 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
                    title="Bỏ chọn thiết bị"
                  >
                    ✕
                  </button>
                </div>
              );
            }

            // STATE C / D (COMPACT SINGLE-ROW BAR - NỀN TRONG SUỐT SÁT MÉP ĐÁY KHUNG MÔ PHỎNG)
            return (
              <div
                className={`absolute inset-x-2 bottom-0.5 z-20 rounded-xl bg-slate-950/25 backdrop-blur-[3px] border border-white/20 shadow-md text-white flex flex-col safe-bottom ${
                  deviceSheetMode === 'detail'
                    ? 'border-sky-400/50 bg-slate-950/35'
                    : ''
                }`}
              >
                {/* DÒNG 1: TIÊU ĐỀ & TIỆN ÍCH HỆ THỐNG (STRICT 1 ROW - KHÔNG BAO GIỜ WRAP) */}
                <div className="px-2.5 py-1 flex flex-nowrap items-center justify-between gap-2 border-b border-white/10 shrink-0 select-none overflow-hidden">
                  {/* Cụm trái Dòng 1: Ảnh nhỏ + Tên + Kích thước + Số đo + A-/A+ */}
                  <div className="flex items-center gap-1.5 min-w-0 shrink flex-nowrap overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        equipmentImagePreviewController.preview(
                          activeAsset.assetId,
                          'pinned',
                        )
                      }
                      className="w-6 h-6 rounded-[5px] bg-white border border-sky-300 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer"
                      title="Xem ảnh thực tế & thông số"
                    >
                      {realPhotoSrc ? (
                        <img
                          src={realPhotoSrc}
                          alt={activeAsset.name.vi}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <EquipmentThumbnailSvg
                          archetype={activeAsset.geometry.proceduralArchetype}
                          assetId={activeAsset.assetId}
                          className="w-5 h-5"
                        />
                      )}
                    </button>

                    <span className="text-[12px] font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] truncate max-w-[130px] shrink">
                      {activeInstance.customLabel || activeAsset.name.vi}
                    </span>

                    {showDimensions && (
                      <span className="px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-400/50 text-[10px] font-mono font-bold text-sky-200 shrink-0">
                        {dimsMmText}
                      </span>
                    )}

                    {liveReadout.readoutBadge && (
                      <span
                        style={{
                          fontSize: `${Math.round(13 * readoutFontScale)}px`,
                          lineHeight: 1.12,
                        }}
                        className={`px-2 py-0.5 rounded-[5px] font-mono font-black tabular-nums shrink-0 ${
                          liveReadout.isDigitalScale
                            ? 'bg-slate-950/90 text-[#5EEAD4] border border-emerald-400/90'
                            : 'bg-[#1E6BFF]/90 text-white border border-white/40'
                        }`}
                      >
                        {liveReadout.readoutBadge}
                      </span>
                    )}

                    {/* Cụm nút A- / A+ tăng giảm cỡ chữ số đo */}
                    <div
                      className="flex items-center gap-0.5 px-1 py-0.5 rounded-[5px] bg-slate-950/70 border border-emerald-400/50 shrink-0"
                      title="Tăng / Giảm cỡ chữ số đo"
                    >
                      <button
                        type="button"
                        onClick={() => adjustReadoutFontScale(-0.1)}
                        className="px-1 py-0 rounded bg-slate-800 hover:bg-emerald-700 text-white font-mono text-[10px] font-black cursor-pointer"
                        title="Giảm cỡ chữ số đo (A-)"
                      >
                        A-
                      </button>
                      <button
                        type="button"
                        onClick={() => updateReadoutFontScale(1.25)}
                        className="px-0.5 text-[#5EEAD4] font-mono text-[10px] font-extrabold tabular-nums cursor-pointer"
                        title="Đặt lại cỡ chữ chuẩn 125%"
                      >
                        {Math.round(readoutFontScale * 100)}%
                      </button>
                      <button
                        type="button"
                        onClick={() => adjustReadoutFontScale(0.1)}
                        className="px-1 py-0 rounded bg-slate-800 hover:bg-emerald-700 text-white font-mono text-[10px] font-black cursor-pointer"
                        title="Tăng cỡ chữ số đo (A+)"
                      >
                        A+
                      </button>
                    </div>
                  </div>

                  {/* Cụm phải Dòng 1: [Xoay 90°] + [?] + [Thông số] + [Ẩn] + [✕] CỐ ĐỊNH TẠI ĐÂY, KHÔNG BAO GIỜ BỊ RỚT DÒNG */}
                  <div className="flex items-center gap-1 shrink-0 ml-auto flex-nowrap">
                    <button
                      type="button"
                      onClick={() =>
                        onQuickLabAction('rotate-90', activeInstance.instanceId)
                      }
                      className="px-2 py-0.5 rounded-[5px] bg-slate-900/80 hover:bg-slate-800 border border-sky-400/60 text-sky-200 font-mono text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0 shadow-sm"
                      title="Xoay dụng cụ 90° trên mặt bàn"
                    >
                      <RotateCw className="w-3 h-3 text-[#38BDF8]" />
                      <span>90°</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleDetailedGuides}
                      className={`w-6 h-6 rounded-[5px] border flex items-center justify-center cursor-pointer transition-colors ${
                        isDetailedGuideOn
                          ? 'bg-amber-500/65 border-amber-300 text-white'
                          : 'bg-slate-950/65 hover:bg-slate-900 border-white/30 text-amber-300'
                      }`}
                      title={
                        isDetailedGuideOn
                          ? 'Ẩn hướng dẫn thao tác nhanh'
                          : 'Hiện hướng dẫn thao tác nhanh'
                      }
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDeleteId(null);
                        setDeviceSheetMode((prev) =>
                          prev === 'detail' ? 'compact' : 'detail',
                        );
                      }}
                      className={`h-6 px-2 rounded-[5px] border text-[10.5px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors ${
                        deviceSheetMode === 'detail'
                          ? 'bg-sky-600 border-sky-300 text-white'
                          : 'bg-slate-950/65 hover:bg-slate-900 border-white/30 text-amber-200'
                      }`}
                      title="Mở/Đóng dải thông số kỹ thuật & quản trị dưới đáy"
                    >
                      <Info className="w-3 h-3 shrink-0" />
                      <span>
                        {deviceSheetMode === 'detail' ? 'Đóng TS' : 'Thông số'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeviceSheetMode('collapsed')}
                      className="h-6 px-1.5 rounded-[5px] bg-slate-950/65 hover:bg-slate-900 border border-white/30 text-slate-300 hover:text-white flex items-center gap-0.5 cursor-pointer text-[10.5px] font-bold transition-colors"
                      title="Thu gọn tạm thời thanh công cụ đáy"
                    >
                      <EyeOff className="w-3 h-3" />
                      <span>Ẩn</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectInstance(null)}
                      className="w-6 h-6 rounded-[5px] bg-slate-950/65 hover:bg-rose-900/60 border border-white/30 hover:border-rose-400 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                      title="Đóng và bỏ chọn thiết bị"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* DÒNG 2: TOÀN BỘ CÁC NÚT THAO TÁC THÍ NGHIỆM ĐẶC THÙ (Cuộn ngang êm ái, KHÔNG BAO GIỜ BỊ VỠ DÒNG THỨ 3) */}
                <div className="px-2.5 py-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap text-[11px] shrink-0">
                  {activeAsset.geometry.proceduralArchetype ===
                    'water-dispenser' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsWaterValveOpenUI(true)}
                        className="px-2.5 py-1 rounded-[7px] bg-[#1E6BFF]/70 hover:bg-[#1E6BFF]/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Mở bảng nhập số ml lấy nước"
                      >
                        {isDetailedGuideOn ? '🚰 Nhập số ml lấy nước' : '🚰 +ml'}
                      </button>
                      {onDispenseWaterVolume && (
                        <button
                          type="button"
                          onClick={() =>
                            onDispenseWaterVolume(
                              activeInstance.instanceId,
                              1000,
                              'refill-dispenser',
                            )
                          }
                          className="px-2.5 py-1 rounded-[7px] bg-slate-900/45 hover:bg-slate-900/70 border border-emerald-400/60 text-[#5EEAD4] font-mono text-[12px] font-bold cursor-pointer transition-colors"
                          title="Châm đầy bình 1000 ml"
                        >
                          {isDetailedGuideOn ? 'Châm đầy (1000 ml)' : '🔄 1000 ml'}
                        </button>
                      )}
                    </>
                  )}

                  {activeAsset.geometry.proceduralArchetype ===
                    'electronic-balance' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'tare-balance',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-slate-900/45 hover:bg-emerald-900/60 border border-emerald-400/60 text-[#5EEAD4] font-mono text-[12px] font-extrabold cursor-pointer transition-colors"
                        title="Trừ bì (TARE) về 0.00 g"
                      >
                        {isDetailedGuideOn
                          ? 'Trừ bì (TARE) · 0.00 g'
                          : '⌖ 0.00 g (TARE)'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'weigh-selected',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-[#1E6BFF]/70 hover:bg-[#1E6BFF]/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Đặt vật mẫu lên đĩa cân"
                      >
                        {isDetailedGuideOn
                          ? (activeInstance.instanceState.measuredMassG ?? 0) > 0
                            ? 'Đặt thêm vật mẫu (+m)'
                            : 'Đặt vật mẫu lên cân'
                          : '🧱→⚖️ +m (g)'}
                      </button>
                      {(activeInstance.instanceState.measuredMassG ?? 0) > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            onQuickLabAction(
                              'clear-balance-pan',
                              activeInstance.instanceId,
                            )
                          }
                          className="px-2.5 py-1 rounded-[7px] bg-slate-900/45 hover:bg-red-900/60 border border-rose-400/60 text-rose-300 font-mono text-[12px] font-bold cursor-pointer transition-colors"
                          title="Lấy vật ra khỏi đĩa cân"
                        >
                          {isDetailedGuideOn ? 'Dọn đĩa cân' : '✕ 0.00 g'}
                        </button>
                      )}
                    </>
                  )}

                  {(activeAsset.geometry.proceduralArchetype === 'beaker-250' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'erlenmeyer-flask') && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setValveTargetInstanceId(activeInstance.instanceId);
                          setIsWaterValveOpenUI(true);
                          triggerDispenseVisualAnimation(
                            activeInstance.instanceId,
                            25,
                            'add',
                          );
                          onQuickLabAction(
                            'dock-to-dispenser',
                            activeInstance.instanceId,
                          );
                        }}
                        className="px-2.5 py-1 rounded-[7px] bg-sky-600/70 hover:bg-sky-600/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Đặt lại gần vòi Bình cấp nước & lấy +25 ml"
                      >
                        {isDetailedGuideOn
                          ? '🚰 Đặt dưới vòi lấy nước (+25 ml)'
                          : '🚰 +25 ml'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          triggerPourVisualAnimation(
                            activeInstance.instanceId,
                            'graduated-cylinder',
                            20,
                          );
                          onQuickLabAction(
                            'pour-to-cylinder',
                            activeInstance.instanceId,
                          );
                        }}
                        className="px-2.5 py-1 rounded-[7px] bg-[#1E6BFF]/70 hover:bg-[#1E6BFF]/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Nghiêng rót 20 ml sang Ống đong"
                      >
                        {isDetailedGuideOn
                          ? 'Rót 20 ml sang Ống đong'
                          : '🫙→🧪 +20 ml'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          triggerPourVisualAnimation(
                            activeInstance.instanceId,
                            'overflow-can',
                            30,
                          );
                          onQuickLabAction(
                            'pour-to-overflow',
                            activeInstance.instanceId,
                          );
                        }}
                        className="px-2.5 py-1 rounded-[7px] bg-cyan-600/70 hover:bg-cyan-600/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Rót nước từ Cốc sang Bình tràn"
                      >
                        {isDetailedGuideOn
                          ? 'Rót sang Bình tràn'
                          : '🫙→🫗 +ml'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'weigh-selected',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-slate-900/45 hover:bg-slate-900/70 border border-emerald-400/60 text-[#5EEAD4] font-mono text-[12px] font-semibold cursor-pointer transition-colors"
                        title="Đặt lên Cân điện tử"
                      >
                        {isDetailedGuideOn ? 'Đặt lên Cân' : '→⚖️ (g)'}
                      </button>
                    </>
                  )}

                  {activeAsset.geometry.proceduralArchetype ===
                    'graduated-cylinder' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowCylinderMagnifier((v) => !v)}
                        className={`px-2.5 py-1 rounded-[7px] border font-mono text-[12px] font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                          showCylinderMagnifier
                            ? 'bg-emerald-600/80 hover:bg-emerald-600 text-white border-emerald-300'
                            : 'bg-slate-900/45 hover:bg-slate-900/70 border-emerald-400/60 text-[#5EEAD4]'
                        }`}
                        title="Kính lúp phóng to đọc vạch ngang đáy mặt khum (ĐCNN = 1 ml)"
                      >
                        <span>🔍</span>
                        <span>{isDetailedGuideOn ? (showCylinderMagnifier ? 'Tắt kính lúp' : 'Soi vạch (1 ml)') : '🔍 1 ml'}</span>
                      </button>
                      {instances.some(
                        (item) =>
                          item.visible &&
                          item.instanceState.attachedToInstanceId === activeInstance.instanceId &&
                          item.instanceState.attachmentSlot === 'inside-vessel',
                      ) && (
                        <button
                          type="button"
                          onClick={() =>
                            onQuickLabAction(
                              'retrieve-from-vessel',
                              activeInstance.instanceId,
                            )
                          }
                          className="px-2.5 py-1 rounded-[7px] bg-rose-950/80 hover:bg-rose-900 border border-rose-400 text-rose-200 font-mono text-[12px] font-bold cursor-pointer transition-colors flex items-center gap-1"
                          title="Gắp vật mẫu ra khỏi Ống đong về mặt bàn thí nghiệm"
                        >
                          <span>🥢</span>
                          <span>{isDetailedGuideOn ? 'Gắp vật ra bàn' : 'Gắp vật'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setValveTargetInstanceId(activeInstance.instanceId);
                          setIsWaterValveOpenUI(true);
                          triggerDispenseVisualAnimation(
                            activeInstance.instanceId,
                            20,
                            'add',
                          );
                          onQuickLabAction(
                            'dock-to-dispenser',
                            activeInstance.instanceId,
                          );
                        }}
                        className="px-2.5 py-1 rounded-[7px] bg-sky-600/70 hover:bg-sky-600/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Đặt dưới vòi Bình cấp nước & lấy +20 ml"
                      >
                        {isDetailedGuideOn
                          ? '🚰 Đặt dưới vòi lấy nước (+20 ml)'
                          : '🚰 +20 ml'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'submerge-cylinder',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-[#1E6BFF]/70 hover:bg-[#1E6BFF]/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Thả ngập vật rắn vào ống đong để đo V₂"
                      >
                        {isDetailedGuideOn
                          ? 'Nhúng vật rắn vào ống'
                          : '🧱→🧪 ΔV (cm³)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          triggerPourVisualAnimation(
                            activeInstance.instanceId,
                            'beaker-250',
                            15,
                          );
                          onQuickLabAction(
                            'pour-to-beaker',
                            activeInstance.instanceId,
                          );
                        }}
                        className="px-2.5 py-1 rounded-[7px] bg-slate-900/45 hover:bg-slate-900/70 border border-white/25 text-slate-100 font-mono text-[12px] font-semibold cursor-pointer transition-colors"
                        title="Nghiêng rót 15 ml sang Cốc thủy tinh"
                      >
                        {isDetailedGuideOn
                          ? 'Rót 15 ml sang Cốc'
                          : '🧪→🫙 -15 ml'}
                      </button>
                    </>
                  )}

                  {activeAsset.geometry.proceduralArchetype ===
                    'overflow-can' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'submerge-overflow',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-[#1E6BFF]/70 hover:bg-[#1E6BFF]/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Thả vật vào Bình tràn"
                      >
                        {isDetailedGuideOn
                          ? 'Thả vật vào Bình tràn'
                          : '🧱→🫗 ΔV (ml)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setValveTargetInstanceId(activeInstance.instanceId);
                          setValveInputMl('210');
                          setIsWaterValveOpenUI(true);
                          triggerDispenseVisualAnimation(
                            activeInstance.instanceId,
                            210,
                            'set',
                          );
                          onQuickLabAction(
                            'dock-to-dispenser',
                            activeInstance.instanceId,
                          );
                        }}
                        className="px-2.5 py-1 rounded-[7px] bg-sky-600/70 hover:bg-sky-600/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Đặt Bình tràn dưới vòi Bình cấp nước & đổ đầy ngang vòi (210 ml)"
                      >
                        {isDetailedGuideOn
                          ? '🚰 Đặt dưới vòi lấy đầy 210 ml'
                          : '🚰 = 210 ml'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          triggerDispenseVisualAnimation(
                            activeInstance.instanceId,
                            210,
                            'set',
                          );
                          onQuickLabAction(
                            'refill-water',
                            activeInstance.instanceId,
                          );
                        }}
                        className="px-2.5 py-1 rounded-[7px] bg-slate-900/45 hover:bg-slate-900/70 border border-white/25 text-slate-100 font-mono text-[12px] font-semibold cursor-pointer transition-colors"
                        title="Châm nhanh ngang vòi tràn (210 ml)"
                      >
                        {isDetailedGuideOn
                          ? 'Đổ đầy ngang vòi (210 ml)'
                          : '= 210 ml'}
                      </button>
                    </>
                  )}

                  {(activeAsset.kind === 'specimen' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'calibration-weight' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'solid-cylinder' ||
                    activeAsset.geometry.proceduralArchetype === 'solid-block' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'solid-sphere' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'hollow-cylinder') && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'weigh-selected',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-[#1E6BFF]/70 hover:bg-[#1E6BFF]/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Đặt lên Cân điện tử để đo m (g)"
                      >
                        {isDetailedGuideOn ? 'Đặt lên Cân điện tử' : '→⚖️ m (g)'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'submerge-cylinder',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-sky-600/70 hover:bg-sky-600/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Thả ngập vào Ống đong để đo V (cm³)"
                      >
                        {isDetailedGuideOn ? 'Thả vào Ống đong' : '→🧪 V (cm³)'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'submerge-overflow',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-slate-900/45 hover:bg-slate-900/70 border border-white/25 text-slate-100 font-mono text-[12px] font-semibold cursor-pointer transition-colors"
                        title="Thả vào Bình tràn"
                      >
                        {isDetailedGuideOn ? 'Thả vào Bình tràn' : '→🫗 V (ml)'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'caliper-measure',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-emerald-600/75 hover:bg-emerald-600 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Kẹp đo đường kính/kích thước vật này bằng Thước cặp du xích (mm)"
                      >
                        {isDetailedGuideOn ? 'Kẹp đo bằng Thước cặp' : '→📏 d (mm)'}
                      </button>
                    </>
                  )}

                  {(activeAsset.geometry.proceduralArchetype ===
                    'laser-source' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'optical-prism') && (
                    <button
                      type="button"
                      onClick={() =>
                        onQuickLabAction(
                          'toggle-laser',
                          activeInstance.instanceId,
                        )
                      }
                      className="px-2.5 py-1 rounded-[7px] bg-red-600/75 hover:bg-red-600 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                    >
                      {isDetailedGuideOn
                        ? activeInstance.instanceState.isPoweredOn === false
                          ? 'Bật chùm tia Laser'
                          : 'Tắt chùm tia Laser'
                        : activeInstance.instanceState.isPoweredOn === false
                          ? '🔦 ON (650 nm)'
                          : '🔦 OFF'}
                    </button>
                  )}

                  {activeAsset.geometry.proceduralArchetype ===
                    'semicircular-slab' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'refraction-angle-0',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2 py-1 rounded-[7px] bg-slate-900/45 hover:bg-slate-900/70 border border-white/25 text-slate-100 font-mono text-[11px] font-semibold cursor-pointer transition-colors"
                        title="Tia tới vuông góc mặt phân cách: truyền thẳng (i = 0°, r = 0°)"
                      >
                        i = 0°
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'refraction-angle-20',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2 py-1 rounded-[7px] bg-slate-900/45 hover:bg-slate-900/70 border border-white/25 text-slate-100 font-mono text-[11px] font-semibold cursor-pointer transition-colors"
                        title="Khúc xạ ánh sáng (i = 20°, r ≈ 30.9°)"
                      >
                        i = 20°
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'refraction-angle-40',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2 py-1 rounded-[7px] bg-[#1E6BFF]/70 hover:bg-[#1E6BFF]/90 border border-white/25 text-white font-mono text-[11px] font-bold cursor-pointer transition-colors"
                        title="Khúc xạ cận tới hạn (i = 40°, r ≈ 74.6°)"
                      >
                        i = 40°
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'refraction-angle-42',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2 py-1 rounded-[7px] bg-amber-600/75 hover:bg-amber-600 border border-white/25 text-white font-mono text-[11px] font-bold cursor-pointer transition-colors"
                        title="Góc tới hạn phản xạ toàn phần (i_gh ≈ 41.8°, r = 90°)"
                      >
                        i = 41.8° (i_gh)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'refraction-angle-60',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2 py-1 rounded-[7px] bg-red-600/75 hover:bg-red-600 border border-white/25 text-white font-mono text-[11px] font-bold cursor-pointer transition-colors"
                        title="Phản xạ toàn phần 100% (i = 60° > i_gh)"
                      >
                        i = 60° (PXTP)
                      </button>
                    </>
                  )}

                  {(activeAsset.geometry.proceduralArchetype ===
                    'galvanometer' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'induction-coil-led') && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'induce-current-pos',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-red-600/75 hover:bg-red-600 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                      >
                        {isDetailedGuideOn ? 'Đưa nam châm lại gần (+I)' : '🧲→ +I (mA)'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'induce-current-neg',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-emerald-600/75 hover:bg-emerald-600 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                      >
                        {isDetailedGuideOn ? 'Kéo nam châm ra xa (-I)' : '←🧲 -I (mA)'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'induce-current-zero',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-slate-900/45 hover:bg-slate-900/70 border border-white/25 text-slate-100 font-mono text-[12px] font-semibold cursor-pointer transition-colors"
                      >
                        I = 0 mA
                      </button>
                    </>
                  )}

                  {/* BỘ ĐIỀU KHIỂN CHUYÊN BIỆT ĐẦY ĐỦ CHO BỘ THÍ NGHIỆM THẤU KÍNH TRÊN GIÁ QUANG HỌC (HÌNH 8.12 SGK KHTN 9) */}
                  {(activeAsset.geometry.proceduralArchetype ===
                    'optical-bench' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'optical-lamp' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'frosted-f-object' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'optical-lens' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'optical-screen' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'optical-power-supply' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'optical-lens-box') &&
                    (() => {
                      const lensInst =
                        instances.find(
                          (i) =>
                            i.visible &&
                            assetsMap.get(i.assetId)?.geometry
                              .proceduralArchetype === 'optical-lens',
                        ) ?? activeInstance;
                      const lampInst = instances.find(
                        (i) =>
                          i.visible &&
                          assetsMap.get(i.assetId)?.geometry
                            .proceduralArchetype === 'optical-lamp',
                      );
                      const fObjInst = instances.find(
                        (i) =>
                          i.visible &&
                          assetsMap.get(i.assetId)?.geometry
                            .proceduralArchetype === 'frosted-f-object',
                      );
                      const psuInst = instances.find(
                        (i) =>
                          i.visible &&
                          assetsMap.get(i.assetId)?.geometry
                            .proceduralArchetype === 'optical-power-supply',
                      );
                      const benchInst = instances.find(
                        (i) =>
                          i.visible &&
                          i.instanceState.attachmentSlot !== 'shelf' &&
                          assetsMap.get(i.assetId)?.geometry
                            .proceduralArchetype === 'optical-bench',
                      );
                      const screenInst = instances.find(
                        (i) =>
                          i.visible &&
                          assetsMap.get(i.assetId)?.geometry
                            .proceduralArchetype === 'optical-screen',
                      );

                      const stateTargetInst =
                        lampInst ?? lensInst ?? activeInstance;
                      const curProfileId =
                        lensInst.instanceState.lensProfileId ?? 'conv_10';
                      const curSpec =
                        OPTICAL_LENS_SPECS[curProfileId] ??
                        OPTICAL_LENS_SPECS.conv_10;
                      const curBeamMode =
                        stateTargetInst.instanceState.beamMode ?? 'f_rays';
                      const curExpMode =
                        stateTargetInst.instanceState.experimentMode ??
                        (curBeamMode === 'f_rays' || curBeamMode === 'f-pattern'
                          ? 'f_object'
                          : 'laser_rays');
                      const isPsuConnected = Boolean(
                        psuInst && psuInst.instanceState.attachmentSlot !== 'shelf',
                      );
                      const isPsuOn = Boolean(
                        psuInst && psuInst.instanceState.isPoweredOn === true,
                      );
                      const isLampSwitchOn = Boolean(
                        lampInst && lampInst.instanceState.isPoweredOn !== false,
                      );
                      const cableDistM =
                        psuInst && lampInst
                          ? new THREE.Vector3(...psuInst.transform.positionM).distanceTo(
                              new THREE.Vector3(...lampInst.transform.positionM),
                            )
                          : Infinity;
                      const areCablesWithinReach = cableDistM <= 0.70;
                      const curPosConnected = Boolean(
                        lampInst &&
                          (lampInst.instanceState.wirePosConnected ??
                            (lampInst.instanceState.isCablesConnected !== false)),
                      );
                      const curNegConnected = Boolean(
                        lampInst &&
                          (lampInst.instanceState.wireNegConnected ??
                            (lampInst.instanceState.isCablesConnected !== false)),
                      );
                      const areCablesPlugged = Boolean(
                        lampInst &&
                          curPosConnected &&
                          curNegConnected &&
                          areCablesWithinReach,
                      );
                      const isLampLit = Boolean(
                        lampInst &&
                          isPsuConnected &&
                          areCablesPlugged &&
                          isPsuOn &&
                          isLampSwitchOn &&
                          (psuInst?.instanceState.supplyVoltageV ?? 12) >= 2.5,
                      );
                      const curVoltageV =
                        psuInst?.instanceState.supplyVoltageV ??
                        stateTargetInst.instanceState.supplyVoltageV ??
                        6;
                      const curDCm =
                        lensInst.instanceState.objectDistanceDCm ?? 20;
                      const curScreenCm =
                        screenInst?.instanceState.screenDistanceCm ??
                        lensInst.instanceState.screenDistanceCm ??
                        20;
                      const curDPrimeCm =
                        lensInst.instanceState.projectedImageDPrimeCm ?? 20;
                      const curImgType =
                        lensInst.instanceState.projectedImageType ?? 'real';
                      const curMag =
                        lensInst.instanceState.projectedImageMag ?? -1;
                      const curRayOffsetYCm =
                        stateTargetInst.instanceState.rayOffsetYCm ?? 0;
                      const curRayAngleDeg =
                        stateTargetInst.instanceState.rayAngleDeg ?? 0;
                      const curShowPhotons =
                        stateTargetInst.instanceState.showPhotons !== false;
                      const curShowVirtualRays =
                        stateTargetInst.instanceState.showVirtualRays !== false;
                      const curAmbientLvl =
                        stateTargetInst.instanceState.ambientLightLevel ?? 45;
                      const curPresetId =
                        stateTargetInst.instanceState.activePresetId ?? '';

                      const applyOpticsPreset = (
                        preset: OpticalTextbookPreset,
                      ) => {
                        const sp = OPTICAL_LENS_SPECS[preset.lensProfileId];
                        if (!benchInst) {
                          onQuickLabAction(
                            'assemble-optical-bench',
                            activeInstance.instanceId,
                          );
                        }
                        const bx = benchInst
                          ? benchInst.transform.positionM[0]
                          : 0;
                        const bz = benchInst
                          ? benchInst.transform.positionM[2]
                          : 0.04;
                        if (benchInst && lensInst) {
                          onPhysicalDockInteraction?.(
                            lensInst.instanceId,
                            benchInst.instanceId,
                            'optical-bench-rail',
                            [bx, 0, bz],
                          );
                        }
                        if (benchInst && fObjInst) {
                          onPhysicalDockInteraction?.(
                            fObjInst.instanceId,
                            benchInst.instanceId,
                            'optical-bench-rail',
                            [
                              Number(
                                (bx - preset.objectDistanceCm * 0.01).toFixed(3),
                              ),
                              0,
                              bz,
                            ],
                          );
                        }
                        if (benchInst && lampInst) {
                          const targetLampCm =
                            preset.experimentMode === 'f_object'
                              ? Math.min(-preset.objectDistanceCm - 8, -14)
                              : -preset.lampDistanceCm;
                          onPhysicalDockInteraction?.(
                            lampInst.instanceId,
                            benchInst.instanceId,
                            'optical-bench-rail',
                            [
                              Number(
                                Math.max(
                                  bx - 0.43,
                                  bx + targetLampCm * 0.01,
                                ).toFixed(3),
                              ),
                              0,
                              bz,
                            ],
                          );
                        }
                        if (benchInst && screenInst) {
                          onPhysicalDockInteraction?.(
                            screenInst.instanceId,
                            benchInst.instanceId,
                            'optical-bench-rail',
                            [
                              Number(
                                (bx + preset.screenDistanceCm * 0.01).toFixed(3),
                              ),
                              0,
                              bz,
                            ],
                          );
                        }
                        onUpdateInstanceState?.(
                          stateTargetInst.instanceId,
                          {
                            isPoweredOn: true,
                            experimentMode: preset.experimentMode,
                            beamMode: preset.beamMode,
                            lensProfileId: preset.lensProfileId,
                            focalLengthCm: sp.focalLengthCm,
                            rayOffsetYCm: preset.rayOffsetYCm,
                            rayAngleDeg: preset.rayAngleDeg,
                            activePresetId: preset.id,
                          },
                          `Kịch bản SGK: ${preset.title} — ${preset.observationNote}`,
                        );
                        if (
                          lensInst &&
                          lensInst.instanceId !== stateTargetInst.instanceId
                        ) {
                          onUpdateInstanceState?.(lensInst.instanceId, {
                            lensProfileId: preset.lensProfileId,
                            focalLengthCm: sp.focalLengthCm,
                            experimentMode: preset.experimentMode,
                            beamMode: preset.beamMode,
                            activePresetId: preset.id,
                          });
                        }
                      };

                      const moveCameraToOpticsView = (
                        camType:
                          | 'overview'
                          | 'lens'
                          | 'virtual_eye'
                          | 'screen'
                          | 'top_down',
                      ) => {
                        const bx = benchInst
                          ? benchInst.transform.positionM[0]
                          : 0;
                        const by =
                          BENCH_SURFACE_Y + OPTICAL_BENCH_AXIS_Y;
                        const bz = benchInst
                          ? benchInst.transform.positionM[2]
                          : 0.04;
                        if (camType === 'overview') {
                          cameraGoalPosRef.current = new THREE.Vector3(
                            bx + 0.02,
                            by + 0.28,
                            bz + 0.62,
                          );
                          cameraGoalTargetRef.current = new THREE.Vector3(
                            bx,
                            by - 0.01,
                            bz,
                          );
                        } else if (camType === 'lens') {
                          cameraGoalPosRef.current = new THREE.Vector3(
                            bx + 0.08,
                            by + 0.08,
                            bz + 0.24,
                          );
                          cameraGoalTargetRef.current = new THREE.Vector3(
                            bx,
                            by,
                            bz,
                          );
                        } else if (camType === 'virtual_eye') {
                          // Đặt mắt phía sau thấu kính nhìn ngược qua thấu kính về phía ảnh ảo A'B'
                          cameraGoalPosRef.current = new THREE.Vector3(
                            bx + 0.24,
                            by + 0.03,
                            bz + 0.07,
                          );
                          cameraGoalTargetRef.current = new THREE.Vector3(
                            bx - 0.14,
                            by,
                            bz,
                          );
                        } else if (camType === 'screen') {
                          const sx = screenInst
                            ? screenInst.transform.positionM[0]
                            : bx + 0.2;
                          cameraGoalPosRef.current = new THREE.Vector3(
                            sx - 0.18,
                            by + 0.05,
                            bz + 0.18,
                          );
                          cameraGoalTargetRef.current = new THREE.Vector3(
                            sx,
                            by,
                            bz,
                          );
                        } else if (camType === 'top_down') {
                          cameraGoalPosRef.current = new THREE.Vector3(
                            bx,
                            by + 0.68,
                            bz + 0.02,
                          );
                          cameraGoalTargetRef.current = new THREE.Vector3(
                            bx,
                            by,
                            bz,
                          );
                        }
                        requestRenderRef.current();
                      };

                      return (
                        <>
                          {/* DÒNG 2 THỰC TẾ: CHỈ DUY NHẤT 1 HÀNG NGANG CUỘN MƯỢT (FLEX-NOWRAP, NO-SCROLLBAR) */}
                          <div className="flex items-center gap-1.5 shrink-0 flex-nowrap whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() =>
                                onQuickLabAction(
                                  'assemble-optical-bench',
                                  activeInstance.instanceId,
                                )
                              }
                              className="px-2 py-0.5 rounded-[5px] bg-amber-500 hover:bg-amber-400 border border-amber-200 text-slate-950 font-mono text-[10.5px] font-extrabold cursor-pointer transition-colors"
                              title="Tự động đưa 7 chi tiết từ kệ xuống lắp đồng trục trên Giá quang học đúng chuẩn Hình 8.12 SGK KHTN 9"
                            >
                              ⚡ Lắp 8.12
                            </button>

                            {/* P01: Nút Bật/Tắt Biến áp nguồn độc lập (Nhấn bật nguồn là tự động nối dây & đèn sáng tức thì) */}
                            <button
                              type="button"
                              onClick={() => {
                                if (!psuInst || !isPsuConnected) {
                                  onNotifyRef.current?.(
                                    '⚡ Cần lấy Biến áp nguồn (6) ra bàn làm việc!',
                                    'warning',
                                  );
                                  return;
                                }
                                const nextPsuOn = !isPsuOn;
                                labSoundEngine.play('ui-toggle', 0.95);
                                onUpdateInstanceState?.(psuInst.instanceId, {
                                  isPoweredOn: nextPsuOn,
                                });
                                if (lampInst) {
                                  // Khi bật nguồn: tự động nối 2 dây nguồn và bật công tắc đèn để đèn sáng ngay tức thì!
                                  const nextCablesPlugged = nextPsuOn ? true : areCablesPlugged;
                                  const willLight = nextPsuOn && curVoltageV >= 2.5;
                                  onUpdateInstanceState?.(lampInst.instanceId, {
                                    isPoweredOn: nextPsuOn,
                                    wirePosConnected: nextCablesPlugged,
                                    wireNegConnected: nextCablesPlugged,
                                    isCablesConnected: nextCablesPlugged,
                                    isLampLit: willLight,
                                  });
                                }
                                onNotifyRef.current?.(
                                  nextPsuOn
                                    ? '⚡ Đã BẬT NGUỒN: Mạch điện sẵn sàng, Đèn phát sáng ngay!'
                                    : '⚡ Đã ngắt công tắc Biến áp nguồn.',
                                  'info',
                                );
                              }}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black border transition-colors cursor-pointer ${
                                isPsuOn
                                  ? 'bg-blue-600 hover:bg-blue-500 border-blue-300 text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                                  : 'bg-slate-800/80 hover:bg-slate-700 border-white/20 text-slate-300'
                              }`}
                              title={
                                !isPsuConnected
                                  ? 'Chưa đưa Biến áp nguồn ra bàn'
                                  : isPsuOn
                                    ? 'Tắt công tắc Biến áp nguồn 12V'
                                    : 'Bật công tắc Biến áp nguồn 12V'
                              }
                            >
                              {isPsuOn ? '⚡ NGUỒN: BẬT' : '⚡ NGUỒN: TẮT'}
                            </button>

                            {/* P08: Nút Nối/Rút cả 2 dây nguồn 12V tức thì (1-Click Quick Connect) */}
                            <button
                              type="button"
                              onClick={() => {
                                if (!lampInst) return;
                                if (!areCablesWithinReach) {
                                  onNotifyRef.current?.(
                                    `⚠️ Khoảng cách giữa nguồn và đèn (${cableDistM.toFixed(2)}m) vượt quá chiều dài dây cáp (0.70m)!`,
                                    'warning',
                                  );
                                  return;
                                }
                                const nextPlug = !areCablesPlugged;
                                labSoundEngine.play('mechanical-click', 0.9);
                                const willLight = nextPlug && isPsuOn && curVoltageV >= 2.5;
                                onUpdateInstanceState?.(lampInst.instanceId, {
                                  wirePosConnected: nextPlug,
                                  wireNegConnected: nextPlug,
                                  isCablesConnected: nextPlug,
                                  isLampLit: willLight,
                                });
                                onNotifyRef.current?.(
                                  nextPlug
                                    ? '⚡ Đã kết nối thành công cả 2 dây nguồn (Đỏ + / Đen -) giữa Bộ Nguồn 12V và Đèn chiếu sáng!'
                                    : '🔌 Đã rút cả 2 dây nguồn khỏi cọc cắm.',
                                  nextPlug ? 'info' : 'warning',
                                );
                              }}
                              className={`px-2 py-0.5 rounded-[5px] text-[10.5px] font-mono font-black border transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-sm ${
                                areCablesPlugged
                                  ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-300 text-white'
                                  : 'bg-amber-500 hover:bg-amber-400 border-amber-200 text-slate-950 animate-pulse'
                              }`}
                              title={
                                !areCablesWithinReach
                                  ? 'Khoảng cách quá xa (>0.7m)'
                                  : areCablesPlugged
                                    ? 'Bấm để rút cả 2 dây nguồn'
                                    : 'Bấm để cắm nhanh cả 2 dây nguồn (Đỏ + / Đen -)'
                              }
                            >
                              {areCablesPlugged ? '🔌 RÚT 2 DÂY' : '⚡ NỐI 2 DÂY'}
                            </button>

                            {/* Cắm/Rút riêng Dây Đỏ (+) */}
                            <button
                              type="button"
                              onClick={() => {
                                if (!lampInst) return;
                                const nextPos = !curPosConnected;
                                const both = nextPos && curNegConnected;
                                const willLight = both && isPsuOn && curVoltageV >= 2.5;
                                labSoundEngine.play('mechanical-click', 0.85);
                                onUpdateInstanceState?.(lampInst.instanceId, {
                                  wirePosConnected: nextPos,
                                  isCablesConnected: both,
                                  isLampLit: willLight,
                                });
                                onNotifyRef.current?.(
                                  nextPos ? '🔴 Đã cắm chốt ĐỎ (+)!' : '🔴 Đã rút chốt ĐỎ (+).',
                                  'info',
                                );
                              }}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer shrink-0 ${
                                curPosConnected
                                  ? 'bg-red-600 hover:bg-red-500 border-red-300 text-white'
                                  : 'bg-slate-900 hover:bg-slate-800 border-red-500/60 text-red-300'
                              }`}
                              title="Cắm / Rút riêng dây cực dương Đỏ (+)"
                            >
                              🔴 {curPosConnected ? 'Đỏ: CẮM' : 'Đỏ: RÚT'}
                            </button>

                            {/* Cắm/Rút riêng Dây Đen (-) */}
                            <button
                              type="button"
                              onClick={() => {
                                if (!lampInst) return;
                                const nextNeg = !curNegConnected;
                                const both = curPosConnected && nextNeg;
                                const willLight = both && isPsuOn && curVoltageV >= 2.5;
                                labSoundEngine.play('mechanical-click', 0.85);
                                onUpdateInstanceState?.(lampInst.instanceId, {
                                  wireNegConnected: nextNeg,
                                  isCablesConnected: both,
                                  isLampLit: willLight,
                                });
                                onNotifyRef.current?.(
                                  nextNeg ? '⚫ Đã cắm chốt ĐEN (-)!' : '⚫ Đã rút chốt ĐEN (-).',
                                  'info',
                                );
                              }}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer shrink-0 ${
                                curNegConnected
                                  ? 'bg-slate-700 hover:bg-slate-600 border-slate-300 text-white'
                                  : 'bg-slate-900 hover:bg-slate-800 border-slate-500/60 text-slate-400'
                              }`}
                              title="Cắm / Rút riêng dây cực âm Đen (-)"
                            >
                              ⚫ {curNegConnected ? 'Đen: CẮM' : 'Đen: RÚT'}
                            </button>

                            {/* P01 & P02: Nút Bật/Tắt công tắc trên thân Đèn độc lập */}
                            <button
                              type="button"
                              onClick={() => {
                                if (!lampInst) return;
                                const nextLampOn = !isLampSwitchOn;
                                labSoundEngine.play('ui-toggle', 0.95);
                                onUpdateInstanceState?.(lampInst.instanceId, {
                                  isPoweredOn: nextLampOn,
                                });
                                onNotifyRef.current?.(
                                  nextLampOn
                                    ? '🔦 Đã bật công tắc cục bộ trên thân đèn.'
                                    : '🔦 Đã tắt công tắc cục bộ trên thân đèn.',
                                  'info',
                                );
                              }}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black border transition-colors cursor-pointer ${
                                isLampLit
                                  ? 'bg-amber-500 hover:bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                                  : isLampSwitchOn
                                    ? 'bg-amber-800/80 border-amber-500 text-amber-200'
                                    : 'bg-slate-800/80 hover:bg-slate-700 border-white/20 text-slate-300'
                              }`}
                              title={
                                isLampLit
                                  ? 'Đèn đang phát sáng — Bấm để tắt công tắc đèn'
                                  : isLampSwitchOn
                                    ? 'Công tắc đèn đang BẬT nhưng chưa có điện (kiểm tra nguồn hoặc dây cáp)'
                                    : 'Bật công tắc đèn'
                              }
                            >
                              {isLampLit
                                ? '💡 ĐÈN: SÁNG'
                                : isLampSwitchOn
                                  ? '💡 ĐÈN: CHƯA ĐIỆN'
                                  : '💡 ĐÈN: TẮT'}
                            </button>

                            {/* 6 Chế độ Khe chắn sáng & Vật chữ F chuẩn SGK */}
                            <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-[5px] bg-slate-950/80 border border-amber-400/50">
                              {(
                                [
                                  {
                                    exp: 'laser_rays',
                                    bm: 'single',
                                    label: '1 Tia',
                                  },
                                  {
                                    exp: 'laser_rays',
                                    bm: 'double',
                                    label: '2 Tia',
                                  },
                                  {
                                    exp: 'laser_rays',
                                    bm: 'triple',
                                    label: '3 Tia',
                                  },
                                  {
                                    exp: 'laser_rays',
                                    bm: 'bundle',
                                    label: 'Song song',
                                  },
                                  {
                                    exp: 'laser_rays',
                                    bm: 'divergent',
                                    label: 'Phân kì',
                                  },
                                  {
                                    exp: 'f_object',
                                    bm: 'f_rays',
                                    label: 'Vật F',
                                  },
                                ] as const
                              ).map((m) => {
                                const isActive =
                                  m.exp === 'f_object'
                                    ? curExpMode === 'f_object'
                                    : curExpMode === 'laser_rays' &&
                                      curBeamMode === m.bm;
                                return (
                                  <button
                                    key={m.bm}
                                    type="button"
                                    onClick={() => {
                                      labSoundEngine.play('caliper-slide', 0.9);
                                      onUpdateInstanceState?.(
                                        stateTargetInst.instanceId,
                                        {
                                          isPoweredOn: true,
                                          experimentMode: m.exp,
                                          beamMode: m.bm,
                                        },
                                        `Đèn chiếu sáng (1): Chuyển sang chế độ ${m.label}`,
                                      );
                                      if (lampInst && lampInst.instanceId !== stateTargetInst.instanceId) {
                                        onUpdateInstanceState?.(lampInst.instanceId, {
                                          isPoweredOn: true,
                                          experimentMode: m.exp,
                                          beamMode: m.bm,
                                        });
                                      }
                                      onNotifyRef.current?.(
                                        `💡 Đã chuyển sang chế độ "${m.label}"${isLampLit ? '' : ' (Bật nguồn để thắp sáng)'}`,
                                        'info',
                                      );
                                    }}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold cursor-pointer border transition-colors ${
                                      isActive
                                        ? 'bg-amber-400 border-amber-200 text-slate-950 shadow-sm'
                                        : 'bg-slate-900/70 hover:bg-slate-800 border-white/15 text-slate-200'
                                    }`}
                                  >
                                    {m.label}
                                  </button>
                                );
                              })}
                            </div>

                            {/* 6 Thấu kính trong Hộp thấu kính (7) */}
                            <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-[5px] bg-slate-950/80 border border-emerald-400/50">
                              <span className="text-[10px] font-extrabold text-emerald-300">
                                TK:
                              </span>
                              {(
                                [
                                  'conv_5',
                                  'conv_10',
                                  'conv_15',
                                  'div_10',
                                  'div_20',
                                  'flat_inf',
                                ] as OpticalLensSpec['id'][]
                              ).map((pid) => {
                                const sp = OPTICAL_LENS_SPECS[pid];
                                const isCurrent = curProfileId === pid;
                                return (
                                  <button
                                    key={pid}
                                    type="button"
                                    onClick={() => {
                                      labSoundEngine.play('glass-clink', 0.85);
                                      onUpdateInstanceState?.(
                                        lensInst.instanceId,
                                        {
                                          lensProfileId: pid,
                                          focalLengthCm: sp.focalLengthCm,
                                        },
                                        `Đã lắp ${sp.nameVi} (${sp.diopterLabel}) vào Giá đỡ thấu kính (3)`,
                                      );
                                    }}
                                    className={`px-1 py-0 rounded text-[10px] font-mono font-extrabold cursor-pointer transition-colors border ${
                                      isCurrent
                                        ? sp.type === 'converging'
                                          ? 'bg-emerald-600 border-emerald-300 text-white'
                                          : sp.type === 'diverging'
                                            ? 'bg-rose-600 border-rose-300 text-white'
                                            : 'bg-sky-600 border-sky-300 text-white'
                                        : 'bg-slate-900/70 hover:bg-slate-800 border-white/15 text-slate-200'
                                    }`}
                                    title={`${sp.nameVi} (${sp.diopterLabel}) — ${sp.descriptionVi}`}
                                  >
                                    {sp.shortCode}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Dropdown 6 Kịch bản SGK Hình 8.12 gọn trên cùng 1 hàng */}
                            <select
                              value={curPresetId}
                              onChange={(e) => {
                                const found = OPTICAL_TEXTBOOK_PRESETS.find(
                                  (p) => p.id === e.target.value,
                                );
                                if (found) applyOpticsPreset(found);
                              }}
                              className="rounded-[5px] bg-slate-950/85 border border-sky-400/60 px-1.5 py-0.5 text-[10.5px] font-mono font-bold text-sky-200 outline-none cursor-pointer max-w-[185px]"
                              title="Chọn nhanh 6 thí nghiệm mẫu SGK KHTN 9 Hình 8.12"
                            >
                              <option value="" className="bg-slate-950 text-slate-300">
                                📚 Mẫu SGK 8.12...
                              </option>
                              {OPTICAL_TEXTBOOK_PRESETS.map((preset) => (
                                <option
                                  key={preset.id}
                                  value={preset.id}
                                  className="bg-slate-950 text-white font-bold"
                                >
                                  {preset.badge}: {preset.title}
                                </option>
                              ))}
                            </select>

                            {/* Nút Lấy nét nhanh Màn chắn (4) */}
                            {benchInst &&
                              screenInst &&
                              curExpMode === 'f_object' &&
                              curImgType === 'real' &&
                              curDPrimeCm > 0 &&
                              curDPrimeCm < 500 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const dpCm = THREE.MathUtils.clamp(
                                      curDPrimeCm,
                                      5,
                                      42,
                                    );
                                    const bx =
                                      benchInst.transform.positionM[0];
                                    const bz =
                                      benchInst.transform.positionM[2];
                                    onPhysicalDockInteraction?.(
                                      screenInst.instanceId,
                                      benchInst.instanceId,
                                      'optical-bench-rail',
                                      [
                                        Number(
                                          (bx + dpCm * 0.01).toFixed(3),
                                        ),
                                        0,
                                        bz,
                                      ],
                                    );
                                  }}
                                  className="px-1.5 py-0.5 rounded-[5px] bg-emerald-600 hover:bg-emerald-500 border border-emerald-300 text-white font-mono text-[10px] font-extrabold cursor-pointer"
                                  title="Dịch chuyển Màn chắn (4) đến đúng vị trí ảnh thật rõ nét nhất (x₄ = d')"
                                >
                                  🎯 Lấy nét ({curDPrimeCm.toFixed(1)}cm)
                                </button>
                              )}

                            {benchInst &&
                              screenInst &&
                              curExpMode === 'laser_rays' &&
                              Math.abs(curSpec.focalLengthCm) < 500 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const fAbs = Math.abs(
                                      curSpec.focalLengthCm,
                                    );
                                    const bx =
                                      benchInst.transform.positionM[0];
                                    const bz =
                                      benchInst.transform.positionM[2];
                                    onPhysicalDockInteraction?.(
                                      screenInst.instanceId,
                                      benchInst.instanceId,
                                      'optical-bench-rail',
                                      [
                                        Number(
                                          (bx + fAbs * 0.01).toFixed(3),
                                        ),
                                        0,
                                        bz,
                                      ],
                                    );
                                  }}
                                  className="px-1.5 py-0.5 rounded-[5px] bg-amber-600 hover:bg-amber-500 border border-amber-300 text-white font-mono text-[10px] font-extrabold cursor-pointer"
                                  title="Đưa Màn chắn (4) về đúng mặt phẳng tiêu diện (x₄ = |f|)"
                                >
                                  🎯 F&apos; ({Math.abs(curSpec.focalLengthCm)}cm)
                                </button>
                              )}

                            {/* Công tắc Nguồn (5) */}
                            <button
                              type="button"
                              onClick={() => {
                                const nextOn = !isPsuOn;
                                const target = psuInst ?? stateTargetInst;
                                onUpdateInstanceState?.(
                                  target.instanceId,
                                  { isPoweredOn: nextOn },
                                  nextOn
                                    ? 'Biến áp nguồn (5): Đã BẬT cấp điện'
                                    : 'Biến áp nguồn (5): Đã TẮT nguồn điện',
                                );
                              }}
                              className={`px-1.5 py-0.5 rounded-[5px] font-mono text-[10.5px] font-extrabold cursor-pointer border transition-colors ${
                                isPsuOn
                                  ? 'bg-emerald-600/90 hover:bg-emerald-500 border-emerald-300 text-white'
                                  : 'bg-rose-600/90 hover:bg-rose-500 border-rose-300 text-white'
                              }`}
                            >
                              {isPsuOn
                                ? `⚡ ${curVoltageV}V`
                                : '⚡ TẮT'}
                            </button>

                            {/* Nút mở Ngăn kéo Hộp Kính */}
                            <button
                              type="button"
                              onClick={() => {
                                setIsOpticsLensDrawerOpen((v) => !v);
                                setIsOpticsAdjustDrawerOpen(false);
                                setIsOpticsGuideModalOpen(false);
                              }}
                              className={`px-1.5 py-0.5 rounded-[5px] font-mono text-[10.5px] font-extrabold cursor-pointer border transition-colors ${
                                isOpticsLensDrawerOpen
                                  ? 'bg-amber-600 border-amber-300 text-white'
                                  : 'bg-slate-900/80 hover:bg-slate-800 border-amber-400/50 text-amber-200'
                              }`}
                            >
                              📦 Kính
                            </button>

                            {/* Nút mở Ngăn kéo Điều Chỉnh */}
                            <button
                              type="button"
                              onClick={() => {
                                setIsOpticsAdjustDrawerOpen((v) => !v);
                                setIsOpticsLensDrawerOpen(false);
                                setIsOpticsGuideModalOpen(false);
                              }}
                              className={`px-1.5 py-0.5 rounded-[5px] font-mono text-[10.5px] font-extrabold cursor-pointer border transition-colors ${
                                isOpticsAdjustDrawerOpen
                                  ? 'bg-sky-600 border-sky-300 text-white'
                                  : 'bg-slate-900/80 hover:bg-slate-800 border-sky-400/50 text-sky-200'
                              }`}
                            >
                              🎛️ Chỉnh
                            </button>

                            {/* Nút mở Giải câu hỏi SGK Hình 8.12 */}
                            <button
                              type="button"
                              onClick={() => {
                                setIsOpticsGuideModalOpen((v) => !v);
                                setIsOpticsLensDrawerOpen(false);
                                setIsOpticsAdjustDrawerOpen(false);
                              }}
                              className={`px-1.5 py-0.5 rounded-[5px] font-mono text-[10.5px] font-extrabold cursor-pointer border transition-colors ${
                                isOpticsGuideModalOpen
                                  ? 'bg-indigo-600 border-indigo-300 text-white'
                                  : 'bg-indigo-950/80 hover:bg-indigo-900 border-indigo-400/50 text-indigo-200'
                              }`}
                            >
                              📖 SGK
                            </button>
                          </div>

                          {/* FLOATING DRAWER POPOVER (KÍNH / CHỈNH / SGK) - NỔI TRÊN ĐẦU THANH ĐÁY (KHÔNG CHIẾM DÒNG CỦA THANH CÔNG CỤ 2 DÒNG) */}
                          {(isOpticsLensDrawerOpen ||
                            isOpticsAdjustDrawerOpen ||
                            isOpticsGuideModalOpen) && (
                            <div className="absolute bottom-[calc(100%+6px)] left-2 right-2 max-w-3xl bg-[#0b1b36]/45 backdrop-blur-2xl rounded-xl border border-sky-400/30 shadow-[0_16px_48px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] p-2.5 z-30 flex flex-col gap-2">
                              <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[11px] font-mono">
                                <span className="font-bold text-sky-300">
                                  {isOpticsLensDrawerOpen
                                    ? '📦 HỘP 6 THẤU KÍNH QUANG HỌC'
                                    : isOpticsAdjustDrawerOpen
                                      ? '🎛️ BẢNG ĐIỀU CHỈNH THÍ NGHIỆM'
                                      : '📖 HƯỚNG DẪN & CÂU HỎI SGK HÌNH 8.12'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsOpticsLensDrawerOpen(false);
                                    setIsOpticsAdjustDrawerOpen(false);
                                    setIsOpticsGuideModalOpen(false);
                                  }}
                                  className="w-5 h-5 rounded flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer"
                                >
                                  ✕
                                </button>
                              </div>

                              {/* NGĂN KÉO 1: HỘP 6 THẤU KÍNH (Gọn 1 hàng ngang cao tối đa 56px) */}
                              {isOpticsLensDrawerOpen && (
                            <div className="p-1.5 rounded-[7px] bg-slate-950/92 border border-amber-400/50 grid grid-cols-3 sm:grid-cols-6 gap-1">
                              {(
                                [
                                  'conv_5',
                                  'conv_10',
                                  'conv_15',
                                  'div_10',
                                  'div_20',
                                  'flat_inf',
                                ] as OpticalLensSpec['id'][]
                              ).map((pid) => {
                                const sp = OPTICAL_LENS_SPECS[pid];
                                const active = curProfileId === pid;
                                return (
                                  <button
                                    key={pid}
                                    type="button"
                                    onClick={() => {
                                      labSoundEngine.play('glass-clink', 0.9);
                                      onUpdateInstanceState?.(
                                        lensInst.instanceId,
                                        {
                                          lensProfileId: pid,
                                          focalLengthCm: sp.focalLengthCm,
                                        },
                                        `Hộp thấu kính (7): Đã lắp ${sp.nameVi} (${sp.diopterLabel}) vào Giá đỡ thấu kính (3)`,
                                      );
                                    }}
                                    className={`flex items-center gap-1.5 px-1.5 py-1 rounded-[5px] border text-left cursor-pointer transition-all ${
                                      active
                                        ? 'bg-sky-500/25 border-sky-300 text-white'
                                        : 'bg-slate-900/75 hover:bg-slate-800 border-white/15 text-slate-300'
                                    }`}
                                  >
                                    <svg
                                      width="18"
                                      height="26"
                                      viewBox="0 0 28 42"
                                      className="shrink-0"
                                    >
                                      {sp.type === 'converging' && (
                                        <path
                                          d={`M14 2 Q${14 + sp.centerThicknessCm * 9} 21 14 40 Q${14 - sp.centerThicknessCm * 9} 21 14 2 Z`}
                                          fill="rgba(56,189,248,0.35)"
                                          stroke="#38bdf8"
                                          strokeWidth="1.5"
                                        />
                                      )}
                                      {sp.type === 'diverging' && (
                                        <path
                                          d="M7 2 L21 2 Q15 21 21 40 L7 40 Q13 21 7 2 Z"
                                          fill="rgba(244,114,182,0.3)"
                                          stroke="#f472b6"
                                          strokeWidth="1.5"
                                        />
                                      )}
                                      {sp.type === 'flat' && (
                                        <rect
                                          x="10"
                                          y="2"
                                          width="8"
                                          height="38"
                                          fill="rgba(148,163,184,0.3)"
                                          stroke="#94a3b8"
                                          strokeWidth="1.5"
                                        />
                                      )}
                                    </svg>
                                    <div className="min-w-0 leading-tight">
                                      <div className="text-[10px] font-mono font-extrabold text-amber-300 truncate">
                                        {sp.codeLabel}
                                      </div>
                                      <div className="text-[9px] font-mono text-sky-300 truncate">
                                        {sp.diopterLabel}
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* NGĂN KÉO 2: SLIDERS ĐIỀU CHỈNH (Gọn 1–2 dòng, cao tối đa 76px) */}
                          {isOpticsAdjustDrawerOpen && (
                            <div className="px-2 py-1.5 rounded-[7px] bg-slate-950/92 border border-sky-400/50 flex flex-wrap items-center justify-between gap-2">
                              {/* 1. Vị trí Vật sáng chữ F (d) hoặc Đèn (x₁) */}
                              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded border border-white/10">
                                <span className="text-[10px] font-mono text-amber-300 font-bold whitespace-nowrap">
                                  {curExpMode === 'f_object' ? 'd:' : 'x₁:'}{' '}
                                  {curDCm.toFixed(1)}cm
                                </span>
                                <input
                                  type="range"
                                  min={curExpMode === 'f_object' ? 3 : 10}
                                  max={38}
                                  step={0.5}
                                  value={THREE.MathUtils.clamp(
                                    curDCm,
                                    curExpMode === 'f_object' ? 3 : 10,
                                    38,
                                  )}
                                  onChange={(e) => {
                                    const nextD = parseFloat(e.target.value);
                                    if (!benchInst) return;
                                    const bx = benchInst.transform.positionM[0];
                                    const bz = benchInst.transform.positionM[2];
                                    const targetRider =
                                      curExpMode === 'f_object' && fObjInst
                                        ? fObjInst
                                        : lampInst;
                                    if (targetRider) {
                                      onPhysicalDockInteraction?.(
                                        targetRider.instanceId,
                                        benchInst.instanceId,
                                        'optical-bench-rail',
                                        [
                                          Number((bx - nextD * 0.01).toFixed(3)),
                                          0,
                                          bz,
                                        ],
                                      );
                                    }
                                  }}
                                  className="w-20 accent-amber-400 cursor-pointer"
                                />
                              </div>

                              {/* 2. Vị trí Màn chắn (4) x₄ */}
                              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded border border-white/10">
                                <span className="text-[10px] font-mono text-emerald-300 font-bold whitespace-nowrap">
                                  x₄: {curScreenCm.toFixed(1)}cm
                                </span>
                                <input
                                  type="range"
                                  min={5}
                                  max={42}
                                  step={0.5}
                                  value={THREE.MathUtils.clamp(
                                    curScreenCm,
                                    5,
                                    42,
                                  )}
                                  onChange={(e) => {
                                    const nextL = parseFloat(e.target.value);
                                    if (!benchInst || !screenInst) return;
                                    const bx = benchInst.transform.positionM[0];
                                    const bz = benchInst.transform.positionM[2];
                                    onPhysicalDockInteraction?.(
                                      screenInst.instanceId,
                                      benchInst.instanceId,
                                      'optical-bench-rail',
                                      [
                                        Number((bx + nextL * 0.01).toFixed(3)),
                                        0,
                                        bz,
                                      ],
                                    );
                                  }}
                                  className="w-20 accent-emerald-400 cursor-pointer"
                                />
                              </div>

                              {/* 3. Độ cao tia y & Góc α hoặc Điện áp nguồn */}
                              {curExpMode === 'laser_rays' ? (
                                <>
                                  <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded border border-white/10">
                                    <span className="text-[10px] font-mono text-sky-300 font-bold whitespace-nowrap">
                                      y:{curRayOffsetYCm.toFixed(1)}
                                    </span>
                                    <input
                                      type="range"
                                      min={-2.5}
                                      max={2.5}
                                      step={0.1}
                                      value={curRayOffsetYCm}
                                      onChange={(e) =>
                                        onUpdateInstanceState?.(
                                          stateTargetInst.instanceId,
                                          {
                                            rayOffsetYCm: parseFloat(
                                              e.target.value,
                                            ),
                                          },
                                        )
                                      }
                                      className="w-16 accent-sky-400 cursor-pointer"
                                    />
                                  </div>
                                  <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded border border-white/10">
                                    <span className="text-[10px] font-mono text-pink-300 font-bold whitespace-nowrap">
                                      α:{curRayAngleDeg.toFixed(1)}°
                                    </span>
                                    <input
                                      type="range"
                                      min={-10}
                                      max={10}
                                      step={0.5}
                                      value={curRayAngleDeg}
                                      onChange={(e) =>
                                        onUpdateInstanceState?.(
                                          stateTargetInst.instanceId,
                                          {
                                            rayAngleDeg: parseFloat(
                                              e.target.value,
                                            ),
                                          },
                                        )
                                      }
                                      className="w-16 accent-pink-400 cursor-pointer"
                                    />
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded border border-white/10">
                                  <span className="text-[10px] font-mono text-amber-300 font-bold whitespace-nowrap">
                                    U: {curVoltageV.toFixed(1)}V
                                  </span>
                                  <input
                                    type="range"
                                    min={3}
                                    max={12}
                                    step={0.5}
                                    value={curVoltageV}
                                    onChange={(e) => {
                                      const v = parseFloat(e.target.value);
                                      const target =
                                        psuInst ?? stateTargetInst;
                                      onUpdateInstanceState?.(
                                        target.instanceId,
                                        {
                                          supplyVoltageV: v,
                                          isPoweredOn: true,
                                        },
                                      );
                                    }}
                                    className="w-20 accent-amber-400 cursor-pointer"
                                  />
                                </div>
                              )}

                              {/* Hàng nút hiển thị: Photon, Tia ảo, Phòng tối & 5 Góc nhìn Camera */}
                              <div className="flex flex-wrap items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateInstanceState?.(
                                      stateTargetInst.instanceId,
                                      { showPhotons: !curShowPhotons },
                                    )
                                  }
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer border ${
                                    curShowPhotons
                                      ? 'bg-amber-500/25 border-amber-300 text-amber-200'
                                      : 'bg-slate-900 border-white/15 text-slate-400'
                                  }`}
                                >
                                  ✨ Photon
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateInstanceState?.(
                                      stateTargetInst.instanceId,
                                      {
                                        showVirtualRays: !curShowVirtualRays,
                                      },
                                    )
                                  }
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer border ${
                                    curShowVirtualRays
                                      ? 'bg-sky-500/25 border-sky-300 text-sky-200'
                                      : 'bg-slate-900 border-white/15 text-slate-400'
                                  }`}
                                >
                                  ┄ Tia ảo
                                </button>
                                {[
                                  { lvl: 8, label: '🌑 Tối' },
                                  { lvl: 45, label: '🌗 Chuẩn' },
                                  { lvl: 90, label: '☀️ Sáng' },
                                ].map((lt) => (
                                  <button
                                    key={lt.lvl}
                                    type="button"
                                    onClick={() =>
                                      onUpdateInstanceState?.(
                                        stateTargetInst.instanceId,
                                        { ambientLightLevel: lt.lvl },
                                      )
                                    }
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer border ${
                                      Math.abs(curAmbientLvl - lt.lvl) < 15
                                        ? 'bg-indigo-600 border-indigo-300 text-white'
                                        : 'bg-slate-900 border-white/15 text-slate-300'
                                    }`}
                                  >
                                    {lt.label}
                                  </button>
                                ))}
                                {[
                                  { id: 'overview', label: '🎥 Chung' },
                                  { id: 'lens', label: '🔍 TK' },
                                  { id: 'virtual_eye', label: '👁️ Ảnh ảo' },
                                  { id: 'screen', label: '🖥️ Màn' },
                                  { id: 'top_down', label: '📐 Trên' },
                                ].map((cam) => (
                                  <button
                                    key={cam.id}
                                    type="button"
                                    onClick={() =>
                                      moveCameraToOpticsView(
                                        cam.id as
                                          | 'overview'
                                          | 'lens'
                                          | 'virtual_eye'
                                          | 'screen'
                                          | 'top_down',
                                      )
                                    }
                                    className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-white/15 text-[10px] font-mono font-bold text-slate-200 cursor-pointer"
                                  >
                                    {cam.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* NGĂN KÉO 3: GIẢI CÂU HỎI SGK HÌNH 8.12 (Gọn cao tối đa 88px có thanh cuộn) */}
                          {isOpticsGuideModalOpen && (
                            <div className="px-2.5 py-1.5 rounded-[7px] bg-slate-950/95 border border-indigo-400/60 text-slate-100 max-h-[86px] overflow-y-auto space-y-1">
                              <div className="flex items-center justify-between gap-2 text-[10.5px] font-mono">
                                <span className="font-extrabold text-amber-300">
                                  📘 SGK KHTN 9 (Hình 8.12): 1/f = 1/d + 1/d&apos; · k = -d&apos;/d (f = {curSpec.codeLabel}, d = {curDCm.toFixed(1)}cm, d&apos; = {Math.abs(curDPrimeCm) > 900 ? '∞' : `${curDPrimeCm.toFixed(1)}cm`})
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setIsOpticsGuideModalOpen(false)
                                  }
                                  className="px-1.5 py-0 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold cursor-pointer shrink-0"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                                {OPTICAL_TEXTBOOK_QA.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="px-2 py-1 rounded bg-slate-900/90 border border-white/10 text-[10px] leading-snug"
                                  >
                                    <span className="font-bold text-amber-300">
                                      {item.question}{' '}
                                    </span>
                                    <span className="text-slate-300">
                                      {item.answer}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                            </div>
                          )}
                        </>
                      );
                    })()}

                  {/* Module .HTML nạp vào: Nút Preset + Thanh trượt điều khiển động (Bỏ qua nếu đã có bộ điều khiển chuyên biệt bên dưới như vernier-caliper) */}
                  {(() => {
                    if (
                      activeAsset.geometry.proceduralArchetype ===
                      'vernier-caliper'
                    ) {
                      return null;
                    }
                    const customMod = htmlEquipmentModuleRegistry.getModule(
                      activeAsset.assetId,
                    );
                    if (!customMod) return null;
                    const ctrl = customMod.moduleControls;
                    const curValRaw =
                      activeInstance.instanceState[ctrl.stateKey];
                    const curVal =
                      typeof curValRaw === 'number'
                        ? curValRaw
                        : ctrl.defaultValue;
                    const decimals =
                      ctrl.step < 0.1 ? 2 : ctrl.step < 1 ? 1 : 0;

                    return (
                      <>
                        {ctrl.presets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              onUpdateInstanceState?.(
                                activeInstance.instanceId,
                                preset.statePatch,
                                `${activeAsset.name.vi}: ${preset.label}`,
                              )
                            }
                            className="px-2.5 py-1 rounded-[7px] bg-[#1E6BFF]/70 hover:bg-[#1E6BFF]/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                          >
                            {preset.label}
                          </button>
                        ))}

                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] bg-slate-950/55 border border-emerald-400/60">
                          {isDetailedGuideOn && (
                            <span className="text-[11px] font-bold text-[#5EEAD4]">
                              {ctrl.label}:
                            </span>
                          )}
                          <input
                            type="range"
                            min={ctrl.min}
                            max={ctrl.max}
                            step={ctrl.step}
                            value={curVal}
                            onChange={(e) => {
                              const nextVal = parseFloat(e.target.value);
                              onUpdateInstanceState?.(
                                activeInstance.instanceId,
                                {
                                  [ctrl.stateKey]: nextVal,
                                },
                              );
                            }}
                            className="w-24 accent-[#00BCEB] cursor-pointer"
                          />
                          <span
                            style={{ fontSize: `${Math.round(13.5 * readoutFontScale)}px` }}
                            className="font-mono font-black text-[#67E8F9] tabular-nums"
                          >
                            {curVal.toFixed(decimals)} {ctrl.unit}
                          </span>
                        </div>

                        {ctrl.canBeWeighedOnBalance !== false && (
                          <button
                            type="button"
                            onClick={() =>
                              onQuickLabAction(
                                'weigh-selected',
                                activeInstance.instanceId,
                              )
                            }
                            className="px-2.5 py-1 rounded-[7px] bg-slate-900/45 hover:bg-slate-900/70 border border-emerald-400/60 text-[#5EEAD4] font-mono text-[12px] font-bold cursor-pointer transition-colors"
                          >
                            →⚖️ {activeAsset.scientificProperties.referenceMass?.value ?? 100} g
                          </button>
                        )}
                      </>
                    );
                  })()}

                  {!htmlEquipmentModuleRegistry.getModule(
                    activeAsset.assetId,
                  ) &&
                    activeAsset.geometry.proceduralArchetype ===
                      'digital-multimeter' && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            onQuickLabAction(
                              'multimeter-mode-v',
                              activeInstance.instanceId,
                            )
                          }
                          className="px-2.5 py-1 rounded-[7px] bg-[#1E6BFF]/70 hover:bg-[#1E6BFF]/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        >
                          U = 12.00 V
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onQuickLabAction(
                              'multimeter-mode-a',
                              activeInstance.instanceId,
                            )
                          }
                          className="px-2.5 py-1 rounded-[7px] bg-sky-600/70 hover:bg-sky-600/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        >
                          I = 0.75 A
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onQuickLabAction(
                              'multimeter-mode-ohm',
                              activeInstance.instanceId,
                            )
                          }
                          className="px-2.5 py-1 rounded-[7px] bg-slate-900/45 hover:bg-slate-900/70 border border-emerald-400/60 text-[#5EEAD4] font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        >
                          R = 16.0 Ω
                        </button>
                      </>
                    )}

                  {(activeAsset.geometry.proceduralArchetype ===
                    'porcelain-dish' ||
                    activeAsset.geometry.proceduralArchetype ===
                      'distillation-flask') && (
                    <button
                      type="button"
                      onClick={() =>
                        onQuickLabAction(
                          'toggle-burner-flame',
                          activeInstance.instanceId,
                        )
                      }
                      className="px-2.5 py-1 rounded-[7px] bg-orange-600/75 hover:bg-orange-600 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                    >
                      {isDetailedGuideOn
                        ? activeInstance.instanceState.isHeating === false
                          ? 'Châm lửa đốt cồn / Đun sôi'
                          : 'Đậy nắp dập tắt ngọn lửa'
                        : activeInstance.instanceState.isHeating === false
                          ? '🔥 ON (°C)'
                          : '🔥 OFF'}
                    </button>
                  )}

                  {activeAsset.geometry.proceduralArchetype ===
                    'optical-microscope' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'open-microscope-viewport',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-3 py-1 rounded-[7px] bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-[12px] flex items-center gap-1.5 cursor-pointer transition-all shadow-md border border-sky-300/40"
                        title="Mở cửa sổ quan sát qua thị kính & thư viện tiêu bản KHTN"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-300" />
                        <span>Soi thị kính</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'microscope-4x',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2 py-1 rounded-[7px] bg-red-950/60 hover:bg-red-900/80 border border-red-500/50 text-red-200 font-mono text-[12px] font-semibold cursor-pointer transition-colors"
                        title="Vật kính 4× (Đỏ)"
                      >
                        🔴 4×
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'microscope-10x',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2 py-1 rounded-[7px] bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/50 text-amber-200 font-mono text-[12px] font-semibold cursor-pointer transition-colors"
                        title="Vật kính 10× (Vàng)"
                      >
                        🟡 10×
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'microscope-40x',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2 py-1 rounded-[7px] bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/50 text-sky-200 font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Vật kính 40× (Xanh lam)"
                      >
                        🔵 40×
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'microscope-100x',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2 py-1 rounded-[7px] bg-slate-800/80 hover:bg-slate-700 border border-white/50 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                        title="Vật kính 100× (Trắng soi dầu)"
                      >
                        ⚪ 100×
                      </button>
                    </>
                  )}

                  {activeAsset.geometry.proceduralArchetype ===
                    'thermometer' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'temp-room-25',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-slate-900/45 hover:bg-slate-900/70 border border-white/25 text-slate-100 font-mono text-[12px] font-semibold cursor-pointer transition-colors"
                      >
                        25.0 °C
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'temp-warm-78',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-orange-600/75 hover:bg-orange-600 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                      >
                        78.5 °C
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'temp-boil-100',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-red-600/75 hover:bg-red-600 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                      >
                        100.0 °C
                      </button>
                    </>
                  )}

                  {activeAsset.geometry.proceduralArchetype ===
                    'spring-dynamometer' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'dynamometer-weigh',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-[#1E6BFF]/70 hover:bg-[#1E6BFF]/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                      >
                        {isDetailedGuideOn ? 'Móc vật đo trọng lượng P' : '🪝 +P (N)'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'dynamometer-zero',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-slate-900/45 hover:bg-slate-900/70 border border-emerald-400/60 text-[#5EEAD4] font-mono text-[12px] font-bold cursor-pointer transition-colors"
                      >
                        0.00 N
                      </button>
                    </>
                  )}

                  {activeAsset.geometry.proceduralArchetype ===
                    'vernier-caliper' &&
                    (() => {
                      const rawMm =
                        activeInstance.instanceState.jawOpeningMm ?? 26;
                      const curMm =
                        Math.round(THREE.MathUtils.clamp(rawMm, 0, 150) * 50) /
                        50;
                      const mainScaleMm = Math.floor(curMm + 1e-6);
                      const vernierRemMm = Math.max(
                        0,
                        Number((curMm - mainScaleMm).toFixed(2)),
                      );
                      const vernierK = Math.round(vernierRemMm / 0.02);

                      return (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              onQuickLabAction(
                                'caliper-measure',
                                activeInstance.instanceId,
                              )
                            }
                            className="px-2.5 py-1 rounded-[7px] bg-[#1E6BFF]/85 hover:bg-[#1E6BFF] border border-white/30 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors shadow-sm"
                            title="Tự động đưa mẫu vật trên bàn vào hàm kẹp ngoài để đo đường kính/chiều rộng (Nhấn tiếp để đổi mẫu vật)"
                          >
                            {isDetailedGuideOn
                              ? '📏 Kẹp đo mẫu vật trên bàn'
                              : '📏 Kẹp mẫu vật'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onQuickLabAction(
                                'caliper-zero',
                                activeInstance.instanceId,
                              )
                            }
                            className="px-2.5 py-1 rounded-[7px] bg-slate-900/55 hover:bg-slate-900/80 border border-emerald-400/60 text-[#5EEAD4] font-mono text-[12px] font-bold cursor-pointer transition-colors"
                            title="Đóng kín hai mỏ đo kiểm tra vạch 0.00 mm"
                          >
                            0.00 mm
                          </button>

                          {[
                            { label: '24.00 mm', val: 24, hint: 'Quả cân chuẩn' },
                            { label: '26.00 mm', val: 26, hint: 'Trụ nhôm' },
                            { label: '30.00 mm', val: 30, hint: 'Bi thép' },
                            { label: '40.00 mm', val: 40, hint: 'Khối đồng' },
                          ].map((preset) => (
                            <button
                              key={preset.val}
                              type="button"
                              onClick={() =>
                                onUpdateInstanceState?.(
                                  activeInstance.instanceId,
                                  { jawOpeningMm: preset.val },
                                  `Thước cặp du xích: Mở hàm kẹp d = ${preset.val.toFixed(2)} mm (${preset.hint})`,
                                )
                              }
                              className={`px-2 py-1 rounded-[7px] border font-mono text-[11px] font-bold cursor-pointer transition-colors ${
                                Math.abs(curMm - preset.val) < 0.01
                                  ? 'bg-emerald-600/80 border-emerald-300 text-white'
                                  : 'bg-slate-900/45 hover:bg-slate-800/75 border-white/20 text-slate-200'
                              }`}
                              title={`Đặt độ mở hàm kẹp d = ${preset.val.toFixed(2)} mm (${preset.hint})`}
                            >
                              {preset.label}
                            </button>
                          ))}

                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] bg-slate-950/70 border border-cyan-400/60">
                            <button
                              type="button"
                              onClick={() => {
                                const nextVal = Math.max(
                                  0,
                                  Number((curMm - 0.02).toFixed(2)),
                                );
                                onUpdateInstanceState?.(
                                  activeInstance.instanceId,
                                  { jawOpeningMm: nextVal },
                                );
                              }}
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-200 font-mono text-[11px] font-bold cursor-pointer"
                              title="Lùi 1 vạch du xích (-0.02 mm)"
                            >
                              -0.02
                            </button>
                            <input
                              type="range"
                              min={0}
                              max={150}
                              step={0.02}
                              value={curMm}
                              onChange={(e) => {
                                const nextVal = Number(
                                  parseFloat(e.target.value).toFixed(2),
                                );
                                onUpdateInstanceState?.(
                                  activeInstance.instanceId,
                                  { jawOpeningMm: nextVal },
                                );
                              }}
                              className="w-28 accent-[#00BCEB] cursor-pointer"
                              title="Trượt con lăn thước cặp (ĐCNN 0.02 mm)"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const nextVal = Math.min(
                                  150,
                                  Number((curMm + 0.02).toFixed(2)),
                                );
                                onUpdateInstanceState?.(
                                  activeInstance.instanceId,
                                  { jawOpeningMm: nextVal },
                                );
                              }}
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-200 font-mono text-[11px] font-bold cursor-pointer"
                              title="Tiến 1 vạch du xích (+0.02 mm)"
                            >
                              +0.02
                            </button>
                            <span
                              style={{ fontSize: `${Math.round(14 * readoutFontScale)}px` }}
                              className="font-mono font-black text-[#67E8F9] tabular-nums"
                            >
                              d = {curMm.toFixed(2)} mm
                            </span>
                            <span
                              style={{ fontSize: `${Math.round(12 * readoutFontScale)}px` }}
                              className="hidden sm:inline font-mono font-bold text-emerald-300 tabular-nums"
                            >
                              (Chính {mainScaleMm} + {vernierK}×0.02)
                            </span>
                          </div>
                        </>
                      );
                    })()}

                  {activeAsset.geometry.proceduralArchetype ===
                    'separatory-funnel' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'funnel-extract',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-[#1E6BFF]/70 hover:bg-[#1E6BFF]/90 border border-white/25 text-white font-mono text-[12px] font-bold cursor-pointer transition-colors"
                      >
                        {isDetailedGuideOn
                          ? 'Mở khóa chiết lớp dưới (-30 ml)'
                          : '🫗 -30 ml'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'refill-water',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2.5 py-1 rounded-[7px] bg-slate-900/45 hover:bg-slate-900/70 border border-white/25 text-slate-100 font-mono text-[12px] font-semibold cursor-pointer transition-colors"
                      >
                        {isDetailedGuideOn ? 'Thêm hỗn hợp nước - dầu' : '+H₂O / Oil'}
                      </button>
                    </>
                  )}

                  {/* Đòn bẩy thăng bằng KHTN 8 (OL3D-EQP-LEV-0001): Tương tác treo quả cân, đổi vị trí móc & tính mômen */}
                  {activeAsset.geometry.proceduralArchetype ===
                    'lever-balance-apparatus' &&
                    (() => {
                      const leftMass =
                        activeInstance.instanceState.leftMassG ?? 0;
                      const leftHole =
                        activeInstance.instanceState.leftHoleIndex ?? 4;
                      const rightMass =
                        activeInstance.instanceState.rightMassG ?? 0;
                      const rightHole =
                        activeInstance.instanceState.rightHoleIndex ?? 4;

                      const updateLever = (patch: Record<string, any>) => {
                        const next = {
                          ...activeInstance.instanceState,
                          ...patch,
                        };
                        const lM = (next.leftMassG ?? 0) / 1000;
                        const lD = ((next.leftHoleIndex ?? 4) * 20) / 1000;
                        const rM = (next.rightMassG ?? 0) / 1000;
                        const rD = ((next.rightHoleIndex ?? 4) * 20) / 1000;
                        const lNut = (next.leftTrimNutPos ?? 0) * 0.001;
                        const rNut = (next.rightTrimNutPos ?? 0) * 0.001;
                        const tauL = lM * lD * 9.81 + lNut * 9.81;
                        const tauR = rM * rD * 9.81 + rNut * 9.81;
                        const net = tauR - tauL;
                        const isBal = Math.abs(net) < 0.005;
                        const ang = Number(
                          Math.max(-30, Math.min(30, (net / 0.05) * 25)).toFixed(1),
                        );
                        onUpdateInstanceState?.(activeInstance.instanceId, {
                          ...next,
                          netTorqueNm: Number(net.toFixed(3)),
                          isBalanced: isBal,
                          incidentAngleDeg: isBal ? 0 : ang,
                          angularTiltDeg: isBal ? 0 : ang,
                        });
                      };

                      return (
                        <>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/60 border border-amber-400/40 text-[11.5px]">
                            <span className="text-amber-300 font-extrabold">Trái:</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateLever({
                                  leftMassG: Math.max(0, leftMass - 50),
                                })
                              }
                              className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-[10.5px] font-bold"
                              title="Bớt 50g móc trái"
                            >
                              -50g
                            </button>
                            <span className="font-mono text-cyan-200 font-extrabold">
                              {leftMass}g
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateLever({
                                  leftMassG: Math.min(200, leftMass + 50),
                                })
                              }
                              className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-[10.5px] font-bold"
                              title="Thêm 50g móc trái"
                            >
                              +50g
                            </button>
                            <select
                              value={leftHole}
                              onChange={(e) =>
                                updateLever({
                                  leftHoleIndex: Number(e.target.value),
                                })
                              }
                              className="bg-slate-800 text-cyan-200 text-[10.5px] rounded px-1 py-0.5 border border-slate-700 font-mono"
                              title="Vị trí lỗ treo móc trái"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((h) => (
                                <option key={h} value={h}>
                                  Lỗ -{h} ({h * 2} cm)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/60 border border-sky-400/40 text-[11.5px]">
                            <span className="text-sky-300 font-extrabold">Phải:</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateLever({
                                  rightMassG: Math.max(0, rightMass - 50),
                                })
                              }
                              className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-[10.5px] font-bold"
                              title="Bớt 50g móc phải"
                            >
                              -50g
                            </button>
                            <span className="font-mono text-cyan-200 font-extrabold">
                              {rightMass}g
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateLever({
                                  rightMassG: Math.min(200, rightMass + 50),
                                })
                              }
                              className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-[10.5px] font-bold"
                              title="Thêm 50g móc phải"
                            >
                              +50g
                            </button>
                            <select
                              value={rightHole}
                              onChange={(e) =>
                                updateLever({
                                  rightHoleIndex: Number(e.target.value),
                                })
                              }
                              className="bg-slate-800 text-cyan-200 text-[10.5px] rounded px-1 py-0.5 border border-slate-700 font-mono"
                              title="Vị trí lỗ treo móc phải"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((h) => (
                                <option key={h} value={h}>
                                  Lỗ +{h} ({h * 2} cm)
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              updateLever({
                                leftMassG: 50,
                                leftHoleIndex: 4,
                                rightMassG: 100,
                                rightHoleIndex: 2,
                                leftTrimNutPos: 0,
                                rightTrimNutPos: 0,
                              })
                            }
                            className="px-2 py-1 rounded-[7px] bg-emerald-600/80 hover:bg-emerald-500 text-white font-mono text-[11px] font-bold cursor-pointer"
                            title="Thiết lập mẫu thăng bằng: 50g × 8cm = 100g × 4cm"
                          >
                            ⚖️ Cân bằng mẫu (50g×8cm = 100g×4cm)
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateLever({
                                leftMassG: 0,
                                rightMassG: 0,
                                leftTrimNutPos: 0,
                                rightTrimNutPos: 0,
                              })
                            }
                            className="px-1.5 py-1 rounded-[7px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10.5px] font-bold cursor-pointer"
                            title="Tháo hết quả cân trên 2 móc"
                          >
                            Tháo quả cân
                          </button>
                        </>
                      );
                    })()}

                  {/* Bình thông nhau 3 nhánh KHTN 8 (OL3D-EQP-HYD-0001): Tương tác mức nước & kiểm chứng mặt thoáng h1 = h2 = h3 */}
                  {activeAsset.geometry.proceduralArchetype ===
                    'communicating-vessels-3way' &&
                    (() => {
                      const curMl =
                        activeInstance.instanceState.liquidLevelMl ?? 75;
                      const updateVessels = (ml: number, tilt: number = 0) => {
                        const nextMl = Math.max(20, Math.min(140, ml));
                        const hMm = Number((nextMl / 1.5).toFixed(1));
                        const pPa = Number(
                          (1000 * 9.81 * (hMm / 1000)).toFixed(0),
                        );
                        onUpdateInstanceState?.(activeInstance.instanceId, {
                          liquidLevelMl: nextMl,
                          tiltAngleDeg: tilt,
                          branch1HeightMm: hMm,
                          branch2HeightMm: hMm,
                          branch3HeightMm: hMm,
                          equalHeightMm: hMm,
                          hydrostaticPressurePa: pPa,
                          isLevel: true,
                        });
                      };

                      return (
                        <>
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/60 border border-sky-400/40 text-[11.5px]">
                            <span className="text-sky-300 font-extrabold">Mức nước:</span>
                            <button
                              type="button"
                              onClick={() => updateVessels(curMl - 25)}
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-[10.5px] font-bold"
                              title="Rút bớt 25 ml"
                            >
                              -25 ml
                            </button>
                            <span className="font-mono text-cyan-200 font-extrabold">
                              {curMl} ml
                            </span>
                            <button
                              type="button"
                              onClick={() => updateVessels(curMl + 25)}
                              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-[10.5px] font-bold"
                              title="Thêm 25 ml"
                            >
                              +25 ml
                            </button>
                          </div>

                          {[50, 75, 100].map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => updateVessels(v)}
                              className={`px-2 py-1 rounded-[7px] font-mono text-[11px] font-bold cursor-pointer transition-colors ${
                                curMl === v
                                  ? 'bg-[#1E6BFF] text-white border border-cyan-400'
                                  : 'bg-slate-900/45 hover:bg-slate-900/70 border border-white/20 text-slate-200'
                              }`}
                            >
                              {v} ml
                            </button>
                          ))}

                          <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-950/70 border border-cyan-400/40 text-cyan-300 text-[11px] font-mono font-bold">
                            <span>Mặt thoáng: h₁ = h₂ = h₃ = {(curMl / 1.5).toFixed(1)} mm</span>
                          </div>
                        </>
                      );
                    })()}

                  {/* Nút mở nhanh Bảng Điều Khiển Bộ Phận Kỹ Thuật Số (Toàn diện 36 Profile) */}
                  <button
                    type="button"
                    onClick={() => setShowDeviceControlModal(true)}
                    className="px-2.5 py-1 rounded-[7px] bg-gradient-to-r from-amber-500/85 to-orange-500/85 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-[11.5px] flex items-center gap-1.5 cursor-pointer shadow-sm border border-amber-300/50"
                    title="Mở bảng điều khiển chi tiết từng bộ phận kỹ thuật số của thiết bị này (36 Profile chuẩn hóa)"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                    <span>Điều khiển bộ phận</span>
                  </button>

                  {isDetailedGuideOn && (
                    <span className="text-[11px] font-medium text-amber-200 shrink-0 pl-1">
                      • {liveReadout.interactionHint}
                    </span>
                  )}
                </div>

                {/* STATE E: DẢI THÔNG SỐ CHI TIẾT & QUẢN TRỊ GỌN 1 HÀNG NGANG SÁT ĐÁY (Không cao quá 64px để không che bàn 3D) */}
                {deviceSheetMode === 'detail' && (
                  <div className="px-2.5 py-1.5 border-t border-white/15 bg-slate-950/30 backdrop-blur-[3px] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    {/* Cụm thông số kỹ thuật & hướng dẫn */}
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <span className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-400/40 font-bold text-[#7DD3FC]">
                        {activeAsset.name.vi}
                      </span>
                      {activeAsset.scientificProperties.referenceMass && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/20 font-mono font-bold text-[#5EEAD4]">
                          KL: {activeAsset.scientificProperties.referenceMass.value}{' '}
                          {activeAsset.scientificProperties.referenceMass.unit}
                        </span>
                      )}
                      {(activeAsset.scientificProperties.capacity ||
                        activeAsset.measurementMetadata?.rangeMax) && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/20 font-mono font-bold text-[#7DD3FC]">
                          GHĐ:{' '}
                          {
                            (
                              activeAsset.scientificProperties.capacity ||
                              activeAsset.measurementMetadata?.rangeMax
                            )?.value
                          }{' '}
                          {
                            (
                              activeAsset.scientificProperties.capacity ||
                              activeAsset.measurementMetadata?.rangeMax
                            )?.unit
                          }
                        </span>
                      )}
                      {activeAsset.measurementMetadata?.leastCount && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/20 font-mono font-bold text-amber-300">
                          ĐCNN: {activeAsset.measurementMetadata.leastCount.value}{' '}
                          {activeAsset.measurementMetadata.leastCount.unit}
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-slate-200 truncate max-w-[360px]">
                        {liveReadout.interactionHint}
                      </span>
                    </div>

                    {/* Cụm nút Hồ sơ, Ảnh thực tế, Cập nhật .HTML, Sửa TS, Cất lên kệ */}
                    <div className="flex flex-wrap items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          equipmentImagePreviewController.preview(
                            activeAsset.assetId,
                            'pinned',
                          )
                        }
                        className="px-2 py-0.5 rounded-[5px] bg-amber-500/25 hover:bg-amber-500/45 border border-amber-300 text-white text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-amber-200" />
                        <span>Ảnh thật</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'open-sgk-profile',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2 py-0.5 rounded-[5px] bg-[#1E6BFF]/70 hover:bg-[#1E6BFF] border border-white/35 text-white text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3 h-3 text-amber-200" />
                        <span>Hồ sơ SGK</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'open-html-updater',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2 py-0.5 rounded-[5px] bg-emerald-950/60 hover:bg-emerald-900 border border-[#14B8A6] text-[#5EEAD4] text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#2DD4BF]" />
                        <span>.HTML</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onQuickLabAction(
                            'edit-product-info',
                            activeInstance.instanceId,
                          )
                        }
                        className="px-2 py-0.5 rounded-[5px] bg-slate-900 hover:bg-slate-800 border border-[#38BDF8]/60 text-[#7DD3FC] text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Sliders className="w-3 h-3 text-[#38BDF8]" />
                        <span>Sửa TS</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const targetId = activeInstance.instanceId;
                          setConfirmDeleteId(null);
                          onQuickLabAction('delete-instance', targetId);
                        }}
                        className="px-2 py-0.5 rounded-[5px] bg-sky-950/80 hover:bg-sky-800 border border-sky-400/60 text-sky-200 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Layers className="w-3 h-3 text-sky-300" />
                        <span>
                          {activeInstance.instanceState.attachmentSlot === 'shelf'
                            ? 'Xuống bàn'
                            : 'Cất lên kệ'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

        {/* D. Thanh công cụ Icon dọc sát mép phải màn hình trên Desktop/Tablet (>= 768px) — Có nút Ẩn / Mở màu đỏ thu gọn */}
        {isRightToolbarCollapsed ? (
          <button
            type="button"
            onClick={() => setIsRightToolbarCollapsed(false)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-[7px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[11px] font-extrabold z-20 shadow-md cursor-pointer transition-colors"
            title="Mở thanh công cụ điều khiển 3D"
            aria-label="Mở thanh công cụ điều khiển 3D"
          >
            <Sliders className="w-3.5 h-3.5 text-white" />
            <span>Mở</span>
          </button>
        ) : (
          <div
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded-[10px] p-1 hidden md:flex flex-col items-center gap-1 z-20 border backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.25)] ${
              isDarkMode
                ? 'bg-[#081528]/18 border-white/30'
                : 'bg-white/20 border-white/55'
            }`}
            aria-label="Thanh công cụ điều khiển 3D"
          >
            {/* Nút Ẩn thanh công cụ 3D màu đỏ thu gọn */}
            <button
              type="button"
              onClick={() => setIsRightToolbarCollapsed(true)}
              className="w-8 h-6 rounded-[6px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[10.5px] font-extrabold flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              title="Ẩn thanh công cụ điều khiển 3D"
              aria-label="Ẩn thanh công cụ điều khiển 3D"
            >
              <span>Ẩn</span>
            </button>

            {/* 1. Di chuyển trên mặt bàn */}
            <button
              type="button"
              onClick={() =>
                onToolModeChange(toolMode === 'translate' ? 'select' : 'translate')
              }
              className={`w-8 h-8 rounded-[7px] flex items-center justify-center transition-colors cursor-pointer ${
                toolMode === 'translate'
                  ? 'bg-[#1E6BFF]/75 text-white shadow-xs'
                  : isDarkMode
                    ? 'text-slate-100 hover:bg-white/15'
                    : 'text-[#051630] hover:bg-white/35'
              }`}
              title="Di chuyển thiết bị trên toàn bộ mặt bàn (Cách mép 1 ô)"
              aria-label="Di chuyển thiết bị"
            >
              <Move
                className={`w-4 h-4 ${
                  toolMode === 'translate'
                    ? 'text-white'
                    : isDarkMode
                      ? 'text-[#38BDF8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                      : 'text-[#1D63E8] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]'
                }`}
              />
            </button>

            {/* 2. Xoay góc nhìn / vật thể */}
            <button
              type="button"
              onClick={() =>
                onToolModeChange(toolMode === 'rotate' ? 'select' : 'rotate')
              }
              className={`w-8 h-8 rounded-[7px] flex items-center justify-center transition-colors cursor-pointer ${
                toolMode === 'rotate'
                  ? 'bg-[#1E6BFF]/75 text-white shadow-xs'
                  : isDarkMode
                    ? 'text-slate-100 hover:bg-white/15'
                    : 'text-[#051630] hover:bg-white/35'
              }`}
              title="Xoay góc nhìn hoặc xoay vật thể"
              aria-label="Xoay"
            >
              <RotateCw
                className={`w-4 h-4 ${
                  toolMode === 'rotate'
                    ? 'text-white'
                    : isDarkMode
                      ? 'text-[#38BDF8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                      : 'text-[#1D63E8] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]'
                }`}
              />
            </button>

            {/* 3. Phóng to */}
            <button
              type="button"
              onClick={() => handleSmoothZoom(0.8)}
              className={`w-8 h-8 rounded-[7px] flex items-center justify-center transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-slate-100 hover:bg-white/15'
                  : 'text-[#051630] hover:bg-white/35'
              }`}
              title="Phóng to góc nhìn"
              aria-label="Phóng to"
            >
              <ZoomIn
                className={`w-4 h-4 ${
                  isDarkMode
                    ? 'text-[#38BDF8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                    : 'text-[#1D63E8] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]'
                }`}
              />
            </button>

            {/* 4. Thu nhỏ */}
            <button
              type="button"
              onClick={() => handleSmoothZoom(1.25)}
              className={`w-8 h-8 rounded-[7px] flex items-center justify-center transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-slate-100 hover:bg-white/15'
                  : 'text-[#051630] hover:bg-white/35'
              }`}
              title="Thu nhỏ góc nhìn"
              aria-label="Thu nhỏ"
            >
              <ZoomOut
                className={`w-4 h-4 ${
                  isDarkMode
                    ? 'text-[#38BDF8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                    : 'text-[#1D63E8] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]'
                }`}
              />
            </button>

            {/* 5. Nhìn từ trên xuống */}
            <button
              type="button"
              onClick={handleToggleTopView}
              className={`w-8 h-8 rounded-[7px] flex items-center justify-center transition-colors cursor-pointer ${
                isTopViewActive
                  ? 'bg-[#1E6BFF]/75 text-white shadow-xs'
                  : isDarkMode
                    ? 'text-slate-100 hover:bg-white/15'
                    : 'text-[#051630] hover:bg-white/35'
              }`}
              title="Chuyển góc nhìn từ trên xuống hoặc góc chuẩn"
              aria-label="Nhìn từ trên xuống"
            >
              <Eye
                className={`w-4 h-4 ${
                  isTopViewActive
                    ? 'text-white'
                    : isDarkMode
                      ? 'text-[#38BDF8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                      : 'text-[#1D63E8] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]'
                }`}
              />
            </button>

            {/* 6. Đặt lại góc nhìn chuẩn bàn thí nghiệm */}
            <button
              type="button"
              onClick={() => handleFocusCameraPreset('bench-close')}
              className={`w-8 h-8 rounded-[7px] flex items-center justify-center transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-slate-100 hover:bg-white/15'
                  : 'text-[#051630] hover:bg-white/35'
              }`}
              title="Đặt lại góc nhìn chuẩn bàn thí nghiệm"
              aria-label="Đặt lại góc nhìn chuẩn"
            >
              <RotateCcw
                className={`w-4 h-4 ${
                  isDarkMode
                    ? 'text-[#38BDF8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                    : 'text-[#1D63E8] drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]'
                }`}
              />
            </button>
          </div>
        )}

        {/* Teacher Mode Telemetry & Extra Layer Toggles — Glassmorphism + Chữ đậm */}
        {!isStudentMode && (
          <>
            <div className="absolute top-14 left-3 bg-white/60 backdrop-blur-xl border-[1.5px] border-white/80 rounded-xl px-3 py-2 text-[11.5px] font-mono font-bold text-[#051630] pointer-events-none z-10 space-y-1 shadow-md">
              <div className="flex items-center gap-2 text-[#0B3A7D] font-extrabold">
                <Compass className="w-3.5 h-3.5 text-[#1D63E8]" />
                <span>HỆ QUY CHIẾU: Y-UP · ĐƠN VỊ: MÉT (m)</span>
              </div>
              <div className="flex items-center gap-3 tabular-nums text-[#051630] font-extrabold">
                <span>Góc: {cameraReadout.azimuthDeg}°</span>
                <span>·</span>
                <span>Cao: {cameraReadout.elevationDeg}°</span>
                <span>·</span>
                <span>Cự ly: {cameraReadout.distanceM} m</span>
              </div>
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/62 backdrop-blur-xl border-[1.5px] border-white/85 rounded-xl px-3 py-1.5 flex items-center gap-1.5 z-20 shadow-lg">
              <button
                type="button"
                onClick={onToggleGrid}
                className={`px-2.5 py-1 text-xs font-extrabold rounded flex items-center gap-1 ${
                  showGrid ? 'bg-[#1D63E8] text-white' : 'text-[#051630] hover:bg-white/60'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Lưới</span>
              </button>
              <button
                type="button"
                onClick={onToggleAxes}
                className={`px-2.5 py-1 text-xs font-extrabold rounded flex items-center gap-1 ${
                  showAxes ? 'bg-[#1D63E8] text-white' : 'text-[#051630] hover:bg-white/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Trục XYZ</span>
              </button>
              <button
                type="button"
                onClick={onToggleLabels}
                className={`px-2.5 py-1 text-xs font-extrabold rounded flex items-center gap-1 ${
                  showLabels ? 'bg-[#1D63E8] text-white' : 'text-[#051630] hover:bg-white/60'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Nhãn</span>
              </button>
              <button
                type="button"
                onClick={onToggleDimensions}
                className={`px-2.5 py-1 text-xs font-extrabold rounded flex items-center gap-1 ${
                  showDimensions ? 'bg-[#1D63E8] text-white' : 'text-[#051630] hover:bg-white/60'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Kích thước</span>
              </button>
              <button
                type="button"
                onClick={handleCaptureSnapshot}
                className="px-2.5 py-1 text-xs font-extrabold text-[#051630] hover:bg-white/60 rounded flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5 text-[#1D63E8]" />
                <span>Chụp ảnh</span>
              </button>
            </div>
          </>
        )}

      </div>

      {/* KÍNH LÚP ĐỌC VẠCH ĐÁY MẶT KHUM & XOAY ĐỨNG MÔ PHỎNG SAI SỐ THỊ GIÁC (PARALLAX ERROR) */}
      {showCylinderMagnifier && activeInstance && activeAsset?.geometry.proceduralArchetype === 'graduated-cylinder' && (
        <div className="absolute top-16 right-3 sm:right-4 z-40 w-84 sm:w-88 bg-[#0b1b36]/45 backdrop-blur-2xl rounded-2xl border border-cyan-400/40 shadow-[0_16px_48px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] p-3 text-slate-100 flex flex-col gap-2.5 select-none animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/30">
            <div className="flex items-center gap-2">
              <span className="text-base text-cyan-400">🔍</span>
              <span className="font-extrabold text-[12.5px] text-cyan-200 uppercase tracking-wide">
                Kính lúp soi mặt khum (100 ml)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowCylinderMagnifier(false)}
              className="w-6 h-6 rounded-full bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              title="Đóng kính lúp"
            >
              ✕
            </button>
          </div>

          {/* Vertical Tilt Control Bar (Xoay đứng / Chỉnh góc nhìn) */}
          <div className="bg-slate-900/90 rounded-xl border border-cyan-500/30 p-2.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300">Góc nhìn xoay đứng (Tilt):</span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-mono text-xs font-black px-2 py-0.5 rounded border ${
                    Math.abs(magnifierTiltDeg) <= 1.5
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500'
                      : magnifierTiltDeg > 1.5
                      ? 'bg-amber-950/90 text-amber-300 border-amber-500'
                      : 'bg-rose-950/90 text-rose-300 border-rose-500'
                  }`}
                >
                  {magnifierTiltDeg > 0 ? `+${magnifierTiltDeg}` : magnifierTiltDeg}°
                  {Math.abs(magnifierTiltDeg) <= 1.5
                    ? ' (Ngang đáy)'
                    : magnifierTiltDeg > 1.5
                    ? ' (Nhìn trên)'
                    : ' (Nhìn dưới)'}
                </span>
                {magnifierTiltDeg !== 0 && (
                  <button
                    type="button"
                    onClick={() => setMagnifierTiltDeg(0)}
                    className="px-1.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-extrabold cursor-pointer transition-colors shadow-xs"
                    title="Đưa về góc nhìn ngang tầm mắt chuẩn 0°"
                  >
                    🎯 Về 0°
                  </button>
                )}
              </div>
            </div>

            {/* Slider */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">-20°</span>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                value={magnifierTiltDeg}
                onChange={(e) => setMagnifierTiltDeg(Number(e.target.value))}
                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                title={`Kéo để xoay đứng góc nhìn: ${magnifierTiltDeg}°`}
              />
              <span className="text-[10px] font-mono text-slate-400">+20°</span>
            </div>

            {/* 3 Quick Preset Pills */}
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => setMagnifierTiltDeg(15)}
                className={`py-1 px-1 rounded-md text-[10.5px] font-bold border transition-colors cursor-pointer text-center ${
                  magnifierTiltDeg === 15
                    ? 'bg-amber-600 text-white border-amber-300'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-amber-200 border-amber-500/40'
                }`}
                title="Góc nhìn từ trên xuống xiên +15° (minh họa đọc thừa thể tích)"
              >
                ▲ Trên (+15°)
              </button>
              <button
                type="button"
                onClick={() => setMagnifierTiltDeg(0)}
                className={`py-1 px-1 rounded-md text-[10.5px] font-bold border transition-colors cursor-pointer text-center ${
                  magnifierTiltDeg === 0
                    ? 'bg-emerald-600 text-white border-emerald-300'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-emerald-200 border-emerald-500/40'
                }`}
                title="Góc nhìn ngang tầm mắt chuẩn 0° (đúng đáy mặt khum, SGK KHTN 8)"
              >
                🎯 Chuẩn 0°
              </button>
              <button
                type="button"
                onClick={() => setMagnifierTiltDeg(-15)}
                className={`py-1 px-1 rounded-md text-[10.5px] font-bold border transition-colors cursor-pointer text-center ${
                  magnifierTiltDeg === -15
                    ? 'bg-rose-600 text-white border-rose-300'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-rose-200 border-rose-500/40'
                }`}
                title="Góc nhìn từ dưới lên xiên -15° (minh họa đọc thiếu thể tích)"
              >
                ▼ Dưới (-15°)
              </button>
            </div>
          </div>

          {/* Magnifier Lens Simulation Box */}
          {(() => {
            const curV = activeInstance.instanceState.liquidLevelMl ?? 50.0;
            // Công thức sai số thị giác Parallax: đường kính ống đong 100ml ~ 28mm -> tan(theta) * 4.5 mL
            const parallaxErrorMl = Math.tan((magnifierTiltDeg * Math.PI) / 180) * 4.5;
            const apparentV = Math.max(0, curV + parallaxErrorMl);
            const roundedApparent = Math.round(apparentV);
            const startV = Math.max(10, Math.min(90, roundedApparent - 4));
            const eyeOffsetY = -magnifierTiltDeg * 2.2; // px offset for eye icon
            const isZeroAngle = Math.abs(magnifierTiltDeg) <= 1.5;

            return (
              <>
                <div className="relative w-full h-52 bg-gradient-to-b from-[#061224] via-[#0b1c38] to-[#061224] rounded-xl border border-cyan-400/40 overflow-hidden flex items-center justify-center shadow-inner">
                  {/* Background circular lens ring */}
                  <div className="absolute inset-0 rounded-xl pointer-events-none border border-cyan-300/20 shadow-[inset_0_0_24px_rgba(56,189,248,0.15)]" />

                  {/* Cylinder Tube Graphic */}
                  <div className="relative w-44 h-full flex flex-col justify-center items-center">
                    {/* Left/Right glass tube walls with reflection */}
                    <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-cyan-400/30 to-transparent border-l-2 border-cyan-300/50" />
                    <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-cyan-400/30 to-transparent border-r-2 border-cyan-300/50" />

                    {/* Tick marks centered at apparent reading */}
                    {(() => {
                      const ticks = [];
                      for (let v = startV + 8; v >= startV - 2; v -= 1) {
                        const isMajor = v % 10 === 0;
                        const isMid = v % 5 === 0 && !isMajor;
                        const offsetY = (apparentV - v) * 14; // 14px per ml
                        ticks.push(
                          <div
                            key={v}
                            className="absolute w-full flex items-center justify-between px-3 pointer-events-none"
                            style={{ top: `calc(50% + ${offsetY}px)` }}
                          >
                            <div className={`bg-cyan-200 ${isMajor ? 'w-5 h-[2.5px]' : isMid ? 'w-3.5 h-[1.5px]' : 'w-2 h-[1px]'}`} />
                            {isMajor && (
                              <span className="text-[11px] font-mono font-black text-cyan-200 leading-none drop-shadow">
                                {v}
                              </span>
                            )}
                            <div className={`bg-cyan-200 ${isMajor ? 'w-5 h-[2.5px]' : isMid ? 'w-3.5 h-[1.5px]' : 'w-2 h-[1px]'}`} />
                          </div>
                        );
                      }
                      return ticks;
                    })()}

                    {/* Liquid Body under the meniscus */}
                    <div
                      className="absolute inset-x-3 bottom-0 bg-gradient-to-t from-cyan-600/50 via-sky-500/40 to-sky-400/25 pointer-events-none"
                      style={{ top: '50%' }}
                    />

                    {/* Dynamic Meniscus Perspective Curve based on tilt angle */}
                    <div
                      className="absolute inset-x-3 pointer-events-none"
                      style={{
                        top: 'calc(50% - 10px)',
                        height: '24px',
                      }}
                    >
                      <svg viewBox="0 0 100 24" className="w-full h-full text-cyan-200 fill-cyan-400/20 stroke-current" strokeWidth="2.5">
                        {isZeroAngle ? (
                          // Perfect horizontal tangential concave arc
                          <path d="M 0,2 Q 50,20 100,2 L 100,24 L 0,24 Z" />
                        ) : magnifierTiltDeg > 0 ? (
                          // Viewed from above: ellipse opening with back rim higher
                          <g>
                            <path d={`M 0,${Math.max(1, 4 - magnifierTiltDeg * 0.2)} Q 50,${20 + magnifierTiltDeg * 0.15} 100,${Math.max(1, 4 - magnifierTiltDeg * 0.2)} L 100,24 L 0,24 Z`} />
                            <ellipse cx="50" cy="5" rx="46" ry={Math.min(8, magnifierTiltDeg * 0.45)} fill="rgba(56,189,248,0.12)" stroke="rgba(186,230,253,0.7)" strokeWidth="1.2" />
                          </g>
                        ) : (
                          // Viewed from below: inverted perspective
                          <g>
                            <path d={`M 0,${Math.min(10, 4 - magnifierTiltDeg * 0.25)} Q 50,16 100,${Math.min(10, 4 - magnifierTiltDeg * 0.25)} L 100,24 L 0,24 Z`} />
                            <ellipse cx="50" cy="18" rx="46" ry={Math.min(8, Math.abs(magnifierTiltDeg) * 0.45)} fill="rgba(56,189,248,0.12)" stroke="rgba(186,230,253,0.6)" strokeWidth="1.2" />
                          </g>
                        )}
                      </svg>
                    </div>

                    {/* Alignment Reticle cutting at crosshair */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-20">
                      <div className={`flex-1 h-[2px] ${isZeroAngle ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)]'}`} />
                      <div className={`px-1.5 py-0.5 text-[9px] font-mono font-black rounded shadow-sm border ${
                        isZeroAngle
                          ? 'text-emerald-100 bg-emerald-950/95 border-emerald-400'
                          : 'text-rose-100 bg-rose-950/95 border-rose-500'
                      }`}>
                        {isZeroAngle ? 'ĐÁY MẶT KHUM (0°)' : `TIA NGẮM (${magnifierTiltDeg > 0 ? `+${magnifierTiltDeg}` : magnifierTiltDeg}°)`}
                      </div>
                      <div className={`flex-1 h-[2px] ${isZeroAngle ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)]'}`} />
                    </div>
                  </div>

                  {/* Eye Indicator and Dynamic Sightline */}
                  <div
                    className="absolute left-2 flex items-center gap-1 pointer-events-none transition-all duration-150 z-30"
                    style={{ top: `calc(50% + ${eyeOffsetY}px)` }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xl">👁️</span>
                      <span className={`text-[8px] font-mono uppercase font-black px-1 py-0.5 rounded border ${
                        isZeroAngle
                          ? 'text-emerald-300 bg-emerald-950/90 border-emerald-500'
                          : 'text-amber-300 bg-amber-950/90 border-amber-500'
                      }`}>
                        {isZeroAngle ? 'Ngang mắt' : `${magnifierTiltDeg > 0 ? `+${magnifierTiltDeg}` : magnifierTiltDeg}°`}
                      </span>
                    </div>
                    {/* Angled Sightline Pointer */}
                    {!isZeroAngle && (
                      <div
                        className="w-10 h-[1.5px] border-t-2 border-dashed border-amber-400 origin-left"
                        style={{
                          transform: `rotate(${magnifierTiltDeg * 0.9}deg)`,
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Measurement Readout Panel */}
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="flex flex-col bg-slate-900/90 px-2 py-1 rounded-lg border border-cyan-500/30">
                      <span className="text-[10px] text-slate-400 font-medium">V đọc được:</span>
                      <span className={`font-mono text-sm font-black ${
                        isZeroAngle ? 'text-emerald-400' : 'text-amber-300'
                      }`}>
                        {apparentV.toFixed(1)} mL
                      </span>
                    </div>
                    <div className="flex flex-col bg-slate-900/90 px-2 py-1 rounded-lg border border-cyan-500/30">
                      <span className="text-[10px] text-slate-400 font-medium">V thực tế:</span>
                      <span className="font-mono text-sm font-black text-cyan-300">
                        {curV.toFixed(1)} mL
                      </span>
                    </div>
                    <div className="flex flex-col bg-slate-900/90 px-2 py-1 rounded-lg border border-cyan-500/30">
                      <span className="text-[10px] text-slate-400 font-medium">Sai số Parallax:</span>
                      <span className={`font-mono text-sm font-black ${
                        isZeroAngle
                          ? 'text-emerald-400'
                          : parallaxErrorMl > 0
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}>
                        {parallaxErrorMl >= 0 ? `+${parallaxErrorMl.toFixed(1)}` : parallaxErrorMl.toFixed(1)} mL
                      </span>
                    </div>
                  </div>

                  {/* Pedagogical Guidance Banner (SGK KHTN 8) */}
                  <div className={`text-[11px] p-2 rounded-lg border leading-snug ${
                    isZeroAngle
                      ? 'text-emerald-200 bg-emerald-950/50 border-emerald-500/50'
                      : magnifierTiltDeg > 1.5
                      ? 'text-amber-200 bg-amber-950/50 border-amber-500/50'
                      : 'text-rose-200 bg-rose-950/50 border-rose-500/50'
                  }`}>
                    {isZeroAngle ? (
                      <div>
                        <strong>✅ Chuẩn SGK KHTN 8:</strong> Đặt mắt nhìn <em>ngang bằng với đáy mặt khum lõm</em> (ĐCNN = 1 mL). Triệt tiêu hoàn toàn sai số thị giác (Parallax error = 0 mL)!
                      </div>
                    ) : magnifierTiltDeg > 1.5 ? (
                      <div>
                        <strong>⚠️ Sai số đọc thừa:</strong> Mắt đặt cao hơn đáy mặt khum (+{magnifierTiltDeg}°). Tia nhìn xiên từ trên xuống cắt thành chia ở sau cao hơn, làm thể tích đọc bị <strong>THỪA (+{parallaxErrorMl.toFixed(1)} mL)</strong>. Hãy bấm <em>"🎯 Về 0°"</em>!
                      </div>
                    ) : (
                      <div>
                        <strong>⚠️ Sai số đọc thiếu:</strong> Mắt đặt thấp hơn đáy mặt khum ({magnifierTiltDeg}°). Tia nhìn xiên từ dưới lên cắt thành chia ở sau thấp hơn, làm thể tích đọc bị <strong>THIẾU ({parallaxErrorMl.toFixed(1)} mL)</strong>. Hãy bấm <em>"🎯 Về 0°"</em>!
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Modal Quản Trị Môi Trường Phòng Thí Nghiệm 3D (OL3D-LAB-ENVIRONMENT-SPEC v2.0) */}
      {showEnvSpecModal && (
        <LabEnvironmentSpecModal
          onClose={() => setShowEnvSpecModal(false)}
          roomConfig={DEFAULT_LAB_ROOM_CONFIG}
          coordSettings={coordSettings}
          onUpdateCoordSettings={handleUpdateCoordSettings}
          envVars={envVars}
          onUpdateEnvVar={handleUpdateEnvVar}
          onResetEnvVars={handleResetEnvVars}
          graphicsSettings={graphicsSettings}
          onUpdateGraphicsSettings={handleUpdateGraphicsSettings}
          clockState={clockState}
          onSimClockAction={handleSimClockAction}
          onSimClockSpeed={handleSimClockSpeed}
          eventLogs={eventLogs}
          selectedInstance={activeInstance}
          selectedAsset={activeAsset ?? null}
          instances={instances}
          assetsMap={assetsMap}
          inspectedWorldPoint={
            customCalibrationPoint
              ? {
                  label: customCalibrationPoint.label,
                  worldM: customCalibrationPoint.worldM,
                  localBenchM: [
                    customCalibrationPoint.worldM[0],
                    Number(
                      (
                        customCalibrationPoint.worldM[1] - BENCH_SURFACE_Y
                      ).toFixed(3),
                    ),
                    customCalibrationPoint.worldM[2],
                  ],
                }
              : activeInstance
                ? {
                    label:
                      activeInstance.customLabel ||
                      activeAsset?.name.vi ||
                      activeInstance.assetId,
                    worldM: [
                      Number(activeInstance.transform.positionM[0].toFixed(3)),
                      Number(
                        (
                          BENCH_SURFACE_Y + activeInstance.transform.positionM[1]
                        ).toFixed(3),
                      ),
                      Number(activeInstance.transform.positionM[2].toFixed(3)),
                    ],
                    localBenchM: [
                      Number(activeInstance.transform.positionM[0].toFixed(3)),
                      Number(activeInstance.transform.positionM[1].toFixed(3)),
                      Number(activeInstance.transform.positionM[2].toFixed(3)),
                    ],
                  }
                : {
                    label: 'Gốc O (0, 0, 0) — Tâm sàn phòng',
                    worldM: [0, 0, 0],
                    localBenchM: [0, -BENCH_SURFACE_Y, 0],
                  }
          }
          onSelectCalibrationPoint={(label, worldM) => {
            setCustomCalibrationPoint({ label, worldM });
            appendLabEventLog(
              'COORD_INSPECT',
              `Kiểm tra tọa độ chuẩn "${label}": World (${worldM.join(', ')}) m.`,
              { label, worldM },
            );
          }}
          distancePointA={distancePointA}
          distancePointB={distancePointB}
          onSetDistancePointA={setDistancePointA}
          onSetDistancePointB={setDistancePointB}
          onFocusCameraPreset={handleFocusCameraPreset}
        />
      )}

      {/* Modal Xem Lại & Xuất Video Tóm Tắt Quá Trình Thực Hành 3D */}
      {showVideoRecorderModal && completedRecordingSession && (
        <LabVideoRecorderModal
          session={completedRecordingSession}
          onClose={() => setShowVideoRecorderModal(false)}
          onUpdateMilestoneTitle={(milestoneId, newTitle) => {
            setCompletedRecordingSession((prev) =>
              prev
                ? {
                    ...prev,
                    milestones: prev.milestones.map((m) =>
                      m.id === milestoneId ? { ...m, title: newTitle } : m,
                    ),
                  }
                : null,
            );
          }}
          onDeleteMilestone={(milestoneId) => {
            setCompletedRecordingSession((prev) =>
              prev
                ? {
                    ...prev,
                    milestones: prev.milestones
                      .filter((m) => m.id !== milestoneId)
                      .map((m, idx) => ({ ...m, stepNumber: idx + 1 })),
                  }
                : null,
            );
          }}
          onSaveSummaryVideoToSession={(blob, url) => {
            setCompletedRecordingSession((prev) =>
              prev
                ? {
                    ...prev,
                    summaryVideoBlob: blob,
                    summaryVideoUrl: url,
                  }
                : null,
            );
          }}
          onStartNewRecording={handleStartVideoRecording}
          onNotify={onNotify}
        />
      )}

      {/* Modal Điều Khiển Bộ Phận Kỹ Thuật Số (Translucent Glassmorphism Side Panel) */}
      {showDeviceControlModal && activeInstance && activeAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end p-2 sm:p-4 md:pr-6 bg-black/15 backdrop-blur-[1px]"
          onClick={() => setShowDeviceControlModal(false)}
        >
          <div
            className="relative w-full max-w-[420px] max-h-[88vh] overflow-y-auto rounded-2xl bg-[#061122]/65 backdrop-blur-2xl border border-[#38BDF8]/60 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] p-3.5 text-white space-y-2.5 pointer-events-auto select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/15">
              <div className="flex items-center gap-2 min-w-0">
                <Sliders className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <h3 className="text-[14px] font-black text-white truncate">
                  Điều Khiển: {activeAsset.name.vi}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDeviceControlModal(false)}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white font-bold transition-colors cursor-pointer shrink-0 border border-white/10 text-xs"
                title="Đóng bảng điều khiển"
              >
                ✕
              </button>
            </div>

            <DeviceControlInspector
              selectedAsset={activeAsset}
              selectedInstance={activeInstance}
              onUpdateInstanceState={(instId, patch) =>
                onUpdateInstanceState?.(instId, patch)
              }
              isDarkMode={true}
            />
          </div>
        </div>
      )}

      {/* Modal Danh Sách Tạm Thời Trong Kho Chứa (Cổng Chuyển) */}
      {isWarehouseModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/45 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsWarehouseModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-[#0b1b36]/75 backdrop-blur-2xl border border-sky-400/40 shadow-[0_24px_64px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.2)] p-4 sm:p-5 text-white flex flex-col max-h-[85vh] pointer-events-auto select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-sky-400/20">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🌀</span>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Kho Chứa Tạm Thời
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-sky-500/20 border border-sky-400/40 text-sky-200">
                      {warehouseItems.length} thiết bị
                    </span>
                  </h3>
                  <p className="text-[11.5px] text-sky-200/70">
                    Khu vực tiếp nhận thiết bị gửi qua Cổng chuyển sát gốc bàn O(0,0,0)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsWarehouseModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white font-bold transition-colors cursor-pointer border border-white/10 text-sm"
                title="Đóng (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Thao tác nhanh: Nếu đang chọn một thiết bị trên bàn */}
            {activeInstance && activeAsset && (
              <div className="mt-3 p-2.5 rounded-xl bg-sky-950/40 border border-sky-400/30 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-sky-300 font-medium">Đang chọn trên bàn:</div>
                  <div className="text-xs font-bold text-white truncate">
                    {activeInstance.customLabel || activeAsset.name.vi}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const label = activeInstance.customLabel || activeAsset.name.vi;
                    const storedItem: WarehouseStoredItem = {
                      id: `wh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                      instanceId: activeInstance.instanceId,
                      assetId: activeAsset.assetId,
                      nameVi: label,
                      categoryVi: activeAsset.category || 'Dụng cụ',
                      thumbnailUrl: (activeAsset as any)?.catalogThumbnail || (activeAsset as any)?.thumbnailUrl,
                      customLabel: activeInstance.customLabel,
                      storedTime: new Date().toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      }),
                    };
                    setWarehouseItems((prev) => [storedItem, ...prev]);
                    if (onDeleteInstanceRef.current) {
                      onDeleteInstanceRef.current(activeInstance.instanceId);
                    } else if (onQuickLabActionRef.current) {
                      onQuickLabActionRef.current('delete-instance', activeInstance.instanceId);
                    }
                    selectedInstanceIdRef.current = null;
                    onSelectInstanceRef.current(null);
                    labSoundEngine.play('dock-hover-snap', 1.0);
                    if (transporterPortalRef.current) {
                      transporterPortalRef.current.userData.warpPulse = 1.0;
                    }
                    if (onNotifyRef.current) {
                      onNotifyRef.current(`🌀 Đã chuyển "${label}" vào Kho chứa!`, 'success');
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1 border border-sky-400/40 cursor-pointer shadow-sm transition-colors shrink-0"
                >
                  📥 Cất vào kho
                </button>
              </div>
            )}

            {/* Danh sách thiết bị tạm lưu */}
            <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-2 max-h-[46vh]">
              {warehouseItems.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center justify-center gap-2 text-slate-300">
                  <div className="w-14 h-14 rounded-full bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-2xl mb-1">
                    📦
                  </div>
                  <div className="text-sm font-semibold text-white">Kho chứa tạm thời đang trống</div>
                  <p className="text-xs text-sky-200/60 max-w-xs leading-relaxed">
                    Kéo thả bất kỳ dụng cụ hoặc thiết bị nào trên bàn vào Cổng chuyển (<span className="text-sky-300 font-semibold">Kho chứa</span>) để cất tạm vào đây.
                  </p>
                </div>
              ) : (
                warehouseItems.map((item) => {
                  const assetDef = assetsMap.get(item.assetId);
                  const symbolEmoji = assetDef ? getEquipmentSymbol(assetDef) : '📦';
                  return (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-900/55 hover:bg-slate-900/80 border border-sky-500/25 hover:border-sky-400/40 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-black/40 border border-sky-400/20 flex items-center justify-center overflow-hidden shrink-0">
                          {item.thumbnailUrl ? (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.nameVi}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <span className="text-lg">{symbolEmoji}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate" title={item.nameVi}>
                            {item.nameVi}
                          </div>
                          <div className="flex items-center gap-2 text-[10.5px] text-sky-200/60 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-300 font-mono">
                              {item.categoryVi || 'Dụng cụ'}
                            </span>
                            <span>🕒 {item.storedTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Nút Lấy lại bàn */}
                        <button
                          type="button"
                          onClick={() => {
                            onDropAssetIntoScene(item.assetId, [-0.60, 0, 0.05]);
                            setWarehouseItems((prev) => prev.filter((it) => it.id !== item.id));
                            labSoundEngine.play('dock-hover-snap', 1.0);
                            if (onNotifyRef.current) {
                              onNotifyRef.current(
                                `↩ Đã đưa "${item.nameVi}" từ Kho chứa trở lại bàn thực hành!`,
                                'success',
                              );
                            }
                            requestRenderRef.current?.();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 border border-emerald-400/40 cursor-pointer shadow-sm transition-colors"
                          title="Đưa thiết bị này trở lại bàn thực hành"
                        >
                          ↩ Lấy lại bàn
                        </button>

                        {/* Nút Xóa vĩnh viễn khỏi danh sách */}
                        <button
                          type="button"
                          onClick={() => {
                            setWarehouseItems((prev) => prev.filter((it) => it.id !== item.id));
                            labSoundEngine.play('ui-toggle', 0.85);
                            if (onNotifyRef.current) {
                              onNotifyRef.current(
                                `🗑 Đã xóa "${item.nameVi}" khỏi Kho chứa!`,
                                'info',
                              );
                            }
                          }}
                          className="px-2 py-1.5 rounded-lg bg-red-600/75 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1 border border-red-400/40 cursor-pointer shadow-sm transition-colors"
                          title="Xóa thiết bị này khỏi Kho chứa"
                        >
                          🗑 Xóa
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-sky-400/20 flex items-center justify-between gap-2">
              {warehouseItems.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    const count = warehouseItems.length;
                    setWarehouseItems([]);
                    labSoundEngine.play('ui-toggle', 0.85);
                    if (onNotifyRef.current) {
                      onNotifyRef.current(
                        `🗑 Đã dọn sạch toàn bộ ${count} thiết bị trong Kho chứa!`,
                        'info',
                      );
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 hover:text-white text-xs font-medium cursor-pointer transition-colors flex items-center gap-1"
                >
                  🗑 Xóa tất cả ({warehouseItems.length})
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => setIsWarehouseModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer border border-sky-400/50 shadow-sm transition-colors ml-auto"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
