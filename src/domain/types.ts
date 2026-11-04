/**
 * OPENLAB 3D — DOMAIN TYPES & MODULE CONTRACTS
 * Tuân thủ đặc tả OL3D-MASTER-SPEC v1.0
 * Tách biệt 4 lớp độc lập:
 * 1. Geometry / Presentation Layer
 * 2. Scientific / Technical Metadata Layer
 * 3. Behavior / Capabilities Layer
 * 4. Scene Instance / Placement Layer
 */

export type PublicationStatus =
  | 'draft'
  | 'submitted'
  | 'in-review'
  | 'changes-requested'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'deprecated';

export type VerificationStatus =
  | 'not-verified'
  | 'partially-verified'
  | 'verified'
  | 'failed';

export type DataProvenanceStatus =
  | 'illustrative' // Dữ liệu mẫu minh họa
  | 'reported'     // Dữ liệu do người tạo cung cấp
  | 'measured'     // Đã đo đạc thực nghiệm nhưng chờ hội đồng duyệt
  | 'verified';    // Đã kiểm chứng chuẩn đo lường

export type CapabilityState =
  | 'ui-demo'
  | 'implemented'
  | 'validated'
  | 'not-implemented';

export type ScienceSubject =
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'stem'
  | 'general-science';

export type EquipmentGroupGId =
  | 'G01' // Đo chiều dài, kích thước, góc (Thước cặp, Panme, Thước đo góc)
  | 'G02' // Cân, khối lượng, lực, cơ học (Cân điện tử, Lực kế, Quả cân, Ròng rọc)
  | 'G03' // Thời gian, nhiệt độ, điện (Đồng hồ bấm giây, Nhiệt kế, Ampe/Vôn kế, Vạn năng)
  | 'G04' // Chứa & đo thể tích chất lỏng (Ống đong, Buret, Pipet, Bình định mức, Cốc)
  | 'G05' // Hóa học, gia nhiệt (Ống nghiệm, Đèn cồn, Bình tam giác, Bình tràn, Nhiệt lượng kế)
  | 'G06' // Quang học, ánh sáng (Thấu kính, Gương cầu, Lăng kính, Nguồn Laser)
  | 'G07' // Điện tử & mạch điện (Pin, Điện trở, Biến trở, Công tắc, LED, Cuộn cảm ứng)
  | 'G08' // Cơ học, nhiệt học, năng lượng (Xe lăn, Mặt phẳng nghiêng, Lò xo, Khối ma sát)
  | 'G09' // Sinh học, mẫu vật quan sát (Kính hiển vi, Tiêu bản lam kính, Mô hình ADN)
  | 'G10'; // Môi trường, mẫu, sinh thái (Máy đo pH, Máy đo EC/TDS, Độ đục NTU, DO)

export type PhysicsFidelityLevel = 'L1' | 'L2' | 'L3' | 'L4';

export interface MeasurementRecord {
  recordId: string;
  assetId: string;
  assetNameVi: string;
  groupG?: EquipmentGroupGId;
  fidelityLevel: PhysicsFidelityLevel;
  timestamp: number;
  simulationElapsedSec: number;
  data: Record<string, number>;
  unit: string;
  environmentSnapshot?: {
    airTemperatureC: number;
    gravityMps2: number;
    atmosphericPressureKPa: number;
  };
}

export type EquipmentCategoryId =
  | 'mass-measurement'
  | 'volume-measurement'
  | 'force-measurement'
  | 'length-measurement'
  | 'measuring-instrument'
  | 'laboratory-glassware'
  | 'chemical-apparatus'
  | 'solid-specimens'
  | 'hollow-specimens'
  | 'electrical-equipment'
  | 'optical-equipment'
  | 'thermal-equipment'
  | 'biology-microscopy'
  | 'support-hardware';

export type ProceduralArchetype =
  | 'electronic-balance'
  | 'graduated-cylinder'
  | 'beaker-250'
  | 'overflow-can'
  | 'spring-dynamometer'
  | 'vernier-caliper'
  | 'calibration-weight'
  | 'solid-cylinder'
  | 'solid-sphere'
  | 'solid-block'
  | 'erlenmeyer-flask'
  | 'retort-stand'
  | 'optical-lens'
  | 'thermometer'
  | 'alcohol-burner'
  | 'hollow-cylinder'
  | 'laser-source'
  | 'semicircular-slab'
  | 'optical-prism'
  | 'magnifying-glass'
  | 'galvanometer'
  | 'digital-multimeter'
  | 'induction-coil-led'
  | 'porcelain-dish'
  | 'separatory-funnel'
  | 'distillation-flask'
  | 'optical-microscope'
  | 'dna-double-helix'
  | 'water-dispenser'
  | 'optical-bench'
  | 'optical-lamp'
  | 'frosted-f-object'
  | 'optical-screen'
  | 'optical-power-supply'
  | 'optical-lens-box'
  | 'lever-balance-apparatus'
  | 'communicating-vessels-3way';

export interface QuantityValue {
  value: number;
  unit: string;
  uncertainty?: number;
  uncertaintyUnit?: string;
  status: DataProvenanceStatus;
  methodRef?: string;
  measuredAt?: string;
  notes?: string;
}

/**
 * LỚP 1 — HÌNH HỌC VÀ HIỂN THỊ (Geometry / Presentation Layer)
 */
export interface GeometryNodeSpec {
  nodeName: string;
  role: 'root' | 'body' | 'scale_display' | 'scale_marks' | 'liquid_surface' | 'plunger' | 'handle' | 'measurement_anchor' | 'lens_element';
  description: string;
}

export interface GeometryAssetSpec {
  modelFormat: 'GLB' | 'glTF' | 'PROCEDURAL_PBR';
  modelUri: string;
  modelFileVersion: string;
  thumbnailUri?: string;
  realPhotoUris?: string[];
  proceduralArchetype: ProceduralArchetype;
  upAxis: 'Y';
  anchor: 'base-center' | 'center' | 'top-hook';
  boundingBoxM: {
    width: number;  // X (m)
    height: number; // Y (m)
    depth: number;  // Z (m)
  };
  dimensions: {
    height: QuantityValue;
    widthOrDiameter: QuantityValue;
    depth?: QuantityValue;
  };
  triangleCount: number;
  materialCount: number;
  namedNodes: GeometryNodeSpec[];
  scaleValidation: VerificationStatus;
}

/**
 * LỚP 2 — HỒ SƠ KHOA HỌC VÀ KỸ THUẬT (Scientific / Technical Metadata Layer)
 */
export interface ScientificMetadata {
  material: {
    value: string;
    status: DataProvenanceStatus;
  };
  referenceMass?: QuantityValue;
  referenceVolume?: QuantityValue;
  referenceDensity?: QuantityValue;
  density?: QuantityValue;
  capacity?: QuantityValue;
  focalLength?: QuantityValue;
  temperatureRating?: QuantityValue;
  thermalResistance?: QuantityValue;
  internalCavity?: {
    isHollow: boolean;
    cavityVolume?: QuantityValue;
    wallThickness?: QuantityValue;
  };
}

export interface MeasurementMetadata {
  isMeasuringInstrument: boolean;
  measuredQuantity?:
    | 'mass'
    | 'volume'
    | 'force'
    | 'length'
    | 'temperature'
    | 'focal-length'
    | 'electric-current'
    | 'voltage-resistance'
    | 'refraction-angle'
    | 'magnification'
    | 'none';
  rangeMin?: QuantityValue;
  rangeMax?: QuantityValue;
  leastCount?: QuantityValue; // Độ chia nhỏ nhất (ĐCNN)
  zeroOffsetSupported?: boolean;
  calibrationMethod?: string;
  referenceStandard?: string;
  lastMeasuredDate?: string;
}

/**
 * LỚP 3 — HÀNH VI VÀ KHẢ NĂNG TƯƠNG TÁC (Behavior / Capabilities Layer)
 */
export interface EquipmentCapability {
  id:
    | 'selectable'
    | 'translatable'
    | 'rotatable'
    | 'scalableViewOnly'
    | 'showDimensions'
    | 'readScale'
    | 'weighObject'
    | 'displacementVolume'
    | 'measureForce'
    | 'caliperMeasure'
    | 'opticalFocus';
  state: CapabilityState;
  behaviorModuleId?: string;
  config?: Record<string, string | number | boolean>;
}

export interface BehaviorDefinition {
  id: string;
  name: string;
  version: string;
  moduleApiVersion: string;
  supportedAssetKinds: Array<'equipment' | 'specimen'>;
  supportedCapabilities: EquipmentCapability['id'][];
  safetyLevel: 'visual-only' | 'interactive' | 'measurement';
  implementationState: CapabilityState;
  description: string;
  allowedParameters: string[];
}

/**
 * HỒ SƠ KIỂM CHỨNG & QUẢN TRỊ (Governance & Provenance)
 */
export interface ValidationSummary {
  assetReviewStatus: PublicationStatus;
  geometryStatus: VerificationStatus;
  metrologyStatus: VerificationStatus;
  behaviorStatus: CapabilityState;
  safetyStatus: 'reviewed' | 'not-reviewed';
  reviewerNotes?: string;
}

export interface ProvenanceMetadata {
  createdBy: string;
  authorRole: string;
  organization: string;
  sourceType: 'sample-data' | 'school-lab-scan' | 'manufacturer-spec' | 'student-studio-submission';
  createdAt: string;
  updatedAt: string;
  license: string;
  redistributionAllowed: boolean;
}

export interface TextbookReferenceMetadata {
  bookTitle: string;
  chapter: string;
  lesson: string;
  figureRef?: string;
  figureLabel?: string;
  standardFunction: string;
  usageGuidelines: string;
  safetyNote?: string;
}

/**
 * ĐỊNH NGHĨA TÀI SẢN 3D HOÀN CHỈNH (AssetDefinition / EquipmentAsset)
 */
export interface AssetDefinition {
  assetId: string; // Mã bất biến: OL3D-EQP-...
  slug: string;
  name: {
    vi: string;
    en: string;
  };
  kind: 'equipment' | 'specimen';
  subject: ScienceSubject;
  category: EquipmentCategoryId;
  categoryIds: EquipmentCategoryId[];
  equipmentGroupG?: EquipmentGroupGId;
  physicsFidelityLevel?: PhysicsFidelityLevel;
  materialCategory?: string;
  tags: string[];
  summary: string;
  textbookRef?: TextbookReferenceMetadata;
  // Tách biệt các phiên bản theo Phần IV Mục 10
  assetVersion: string;
  manifestSchemaVersion: string;
  moduleApiVersion: string;
  // 3 lớp dữ liệu tài sản gốc
  geometry: GeometryAssetSpec;
  scientificProperties: ScientificMetadata;
  measurementMetadata: MeasurementMetadata;
  capabilities: EquipmentCapability[];
  behaviorIds: string[];
  validation: ValidationSummary;
  provenance: ProvenanceMetadata;
}

/**
 * LỚP 4 — PHIÊN BẢN ĐẶT TRONG CẢNH (Scene Instance Layer)
 * Không bao giờ ghi đè vào AssetDefinition gốc.
 */
export interface SceneInstance {
  instanceId: string;
  assetId: string;
  assetVersion: string;
  customLabel?: string;
  parentZone: 'bench-main' | 'bench-scale' | 'bench-glassware' | 'retort-holder';
  transform: {
    positionM: [number, number, number];
    rotationRad: [number, number, number];
    displayScale: [number, number, number];
  };
  visible: boolean;
  locked: boolean;
  labelVisible: boolean;
  instanceState: {
    tareOffsetG?: number;
    measuredMassG?: number;
    baseLiquidLevelMl?: number;
    liquidLevelMl?: number;
    jawOpeningMm?: number;
    springExtensionN?: number;
    isPoweredOn?: boolean;
    incidentAngleDeg?: number;
    galvanometerDeflection?: number; // -1..+1 (-50..+50 uA)
    multimeterMode?: 'DCV' | 'DCA' | 'OHM' | 'V' | 'A' | 'Ω';
    multimeterValue?: number;
    magnification?: number;
    isHeating?: boolean;
    temperatureC?: number;
    isValveOpen?: boolean;
    overflowingVolumeMl?: number;
    experimentMode?: 'f_object' | 'laser_rays';
    lensProfileId?: 'conv_5' | 'conv_10' | 'conv_15' | 'div_10' | 'div_20' | 'flat_inf';
    focalLengthCm?: number; // +5, +10, +15, -10, -20, or 999999 for Infinity
    beamMode?: 'single' | 'double' | 'triple' | 'bundle' | 'divergent' | 'f_rays' | 'f-pattern';
    rayOffsetYCm?: number; // -2.6 to +2.6 cm vertical beam shift
    rayAngleDeg?: number; // -10 to +10 deg incident beam angle
    showPhotons?: boolean;
    showVirtualRays?: boolean;
    ambientLightLevel?: number; // 8 (dark room), 45 (standard), 90 (bright room)
    activePresetId?: string;
    supplyVoltageV?: number;
    voltageSetting?: number; // Configured nominal DC output voltage on power supply (3.0 .. 12.0 V)
    isLampLit?: boolean; // Causal physical state: true only when circuit is closed + PSU on + lamp switch on + voltage >= 2.5V
    isCablesConnected?: boolean; // Electrical circuit topology: true when cables are firmly connected between terminals
    wirePosConnected?: boolean; // Positive terminal (+ Red) cable connection status
    wireNegConnected?: boolean; // Negative terminal (- Black) cable connection status
    isLaserHit?: boolean; // Optical causal state: true when a real laser beam hits the passive optic element
    isFlameLit?: boolean; // Thermodynamic causal state: true when alcohol burner flame is actively burning
    railCoordCm?: number;
    objectDistanceDCm?: number;
    projectedImageDPrimeCm?: number | null;
    projectedImageMag?: number | null;
    projectedImageType?: 'real' | 'virtual' | 'infinity';
    screenDistanceCm?: number;
    attachedToInstanceId?: string | null;
    attachmentSlot?:
      | 'bench'
      | 'shelf'
      | 'balance-pan'
      | 'inside-vessel'
      | 'dynamometer-hook'
      | 'caliper-jaws'
      | 'retort-clamp'
      | 'dispenser-outlet'
      | 'optical-bench-rail';
    [key: string]: any;
  };
}

/**
 * BỘ THIẾT BỊ (Equipment Kit)
 */
export interface EquipmentKit {
  kitId: string;
  kitVersion: string;
  name: {
    vi: string;
    en: string;
  };
  subject: ScienceSubject;
  purpose: string;
  categoryIds: EquipmentCategoryId[];
  publicationStatus: PublicationStatus;
  verificationStatus: VerificationStatus;
  items: Array<{
    assetId: string;
    assetVersion: string;
    quantity: number;
    role: string;
    optional: boolean;
  }>;
}

/**
 * MÔI TRƯỜNG PHÒNG THÍ NGHIỆM 3D (Lab Environment)
 */
export interface LabEnvironment {
  environmentId: string;
  environmentVersion: string;
  name: {
    vi: string;
    en: string;
  };
  subject: ScienceSubject;
  description: string;
  publicationStatus: PublicationStatus;
  visualPreset: {
    skyColorHex: string;
    fogColorHex: string;
    benchTopColorHex: string;
    benchFrameColorHex: string;
    floorColorHex: string;
    keyLightColorHex: string;
    keyLightIntensity: number;
    hemisphereSkyHex: string;
    hemisphereGroundHex: string;
    accentColorHex: string;
  };
  benchDimensionsM: {
    width: number;
    depth: number;
    surfaceHeight: number;
  };
  anchors: Array<{
    anchorId: string;
    label: string;
    positionM: [number, number, number];
  }>;
}

/**
 * BÀI THÍ NGHIỆM (Experiment Definition)
 */
export interface ExperimentStep {
  stepNumber: number;
  id: string;
  title: string;
  description: string;
  instructionDetail: string;
  requiredAssetIds: string[];
  highlightCapability?: EquipmentCapability['id'];
}

export interface ExperimentMeasurementRow {
  id: string;
  quantityName: string;
  symbol: string;
  value: number | string;
  unit: string;
  formulaNote?: string;
  status: DataProvenanceStatus;
}

export interface ExperimentDefinition {
  experimentId: string;
  experimentVersion: string;
  title: string;
  subject: ScienceSubject;
  gradeLevel: string;
  objective: string;
  recommendedKitId: string;
  recommendedEnvironmentId: string;
  simulationFidelity: 'illustrative' | 'interactive-demo' | 'validated';
  safetyNotes: string[];
  formulas: Array<{
    expression: string;
    description: string;
  }>;
  steps: ExperimentStep[];
  sampleResults: ExperimentMeasurementRow[];
}

/**
 * CẢNH THÍ NGHIỆM 3D (Lab Scene)
 */
export interface LabScene {
  sceneId: string;
  sceneRevision: number;
  name: string;
  environmentId: string;
  experimentId: string;
  instances: SceneInstance[];
  cameraPreset: {
    position: [number, number, number];
    target: [number, number, number];
  };
  updatedAt: string;
}

/**
 * RWSS v1.1.1 — HỆ THỐNG LẮP RÁP & CONNECTOR (Assembly & Connector Spec)
 */
export type PhysicalDockTargetSlot =
  | 'bench'
  | 'shelf'
  | 'balance-pan'
  | 'inside-vessel'
  | 'dynamometer-hook'
  | 'caliper-jaws'
  | 'retort-clamp'
  | 'dispenser-outlet'
  | 'optical-bench-rail'
  | 'pour-liquid';

export type AssemblyStateCode =
  | 'FREE'
  | 'DRAGGING'
  | 'CANDIDATE'
  | 'ATTACHED'
  | 'CONSTRAINED'
  | 'REJECTED'
  | 'RELEASED';

