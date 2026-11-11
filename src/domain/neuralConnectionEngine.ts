/**
 * OPENLAB 3D — SEMANTIC NEURAL CONNECTION & CAUSAL REPOSITORY ENGINE
 * 
 * Kho Dữ liệu Kết nối Ngữ nghĩa & Bộ máy Nhân quả Vật lý Thực tế
 * Tuân thủ chuẩn RWSS v1.1.1, GDPT 2018 và Thông tư 38/2021/TT-BGDĐT
 * 
 * Quản lý:
 * 1. Chỉ dẫn nơ-ron ngữ cảnh (Contextual Synapse Projection) khi cầm/chọn thiết bị.
 * 2. Luật nhân quả tự nhiên & định luật vật lý (Ohm, Archimedes, Snell, Gauss, Faraday, Cân bằng nhiệt).
 * 3. Hệ phản xạ an toàn & Cảnh báo xung đột (Lab Safety Reflexes).
 * 4. Bật/Tắt chế độ Trợ lý Nơ-ron Thần kinh (Neural Guide Toggle).
 */

import {
  NEURAL_DEVICE_NODES,
  NEURAL_SYNAPSE_EDGES,
  EXPERIMENT_MACRO_CLUSTERS,
  NeuralDeviceNode,
  NeuralSynapseEdge,
  SynapseKind,
  ExperimentMacroCluster,
  PhysicalSignalType,
} from './neuralNetworkTopology';
import { SceneInstance, AssetDefinition } from './types';
import {
  MAX_ELECTRICAL_CABLE_LENGTH_M,
  LAMP_IGNITION_THRESHOLD_VOLTAGE_V,
} from '../three-runtime/AssemblySystem';

export interface IntercomSignalPacket {
  id: string;
  sourceInstanceId: string;
  sourceAssetId: string;
  sourceNameVi: string;
  signalType: PhysicalSignalType;
  value: number;
  unit: string;
  labelVi: string;
  timestampMs: number;
}

export interface ComputedCausalInference {
  id: string;
  titleVi: string;
  formulaLatex: string;
  computedValueText: string;
  participatingAssetIds: string[];
  explanationVi: string;
}

export interface ContextualSynapseLink {
  synapseId: string;
  sourceAssetId: string;
  targetAssetId: string;
  sourceNameVi: string;
  targetNameVi: string;
  direction: 'input' | 'output' | 'bidirectional';
  kind: SynapseKind;
  actionVerbVi: string;
  physicalLawVi: string;
  mathFormulaLatex: string;
  sourcePortName: string;
  targetPortName: string;
  prerequisites: string[];
  safetyTipVi: string;
  experimentContext: string;
  isSatisfiedOnTable: boolean;
  activeCandidateInstanceId?: string;
}

export interface CausalDeviceChecklist {
  deviceNode: NeuralDeviceNode;
  activeInstance: SceneInstance;
  dendritesInput: ContextualSynapseLink[];
  axonsOutput: ContextualSynapseLink[];
  isFullyOperational: boolean;
  missingPrerequisiteHint?: string;
  safetyReflexWarning?: string;
}

export interface CompatibleTargetCandidate {
  targetInstance: SceneInstance;
  targetAsset: AssetDefinition;
  link: ContextualSynapseLink;
  distanceM: number;
  isAlreadyConnected: boolean;
  dockPointTargetPos?: [number, number, number];
}

export interface SafetyReflexResult {
  isHazard: boolean;
  severity: 'low' | 'medium' | 'critical';
  hazardMessageVi?: string;
  scientificReasonVi?: string;
  suggestedCorrectionVi?: string;
}

/**
 * Bản đồ ánh xạ hành vi nhân quả thực tế theo chuẩn vật lí học
 */
export const PHYSICAL_LAW_MAPPINGS: Record<SynapseKind, {
  actionVerb: string;
  lawName: string;
  formula: string;
  defaultSafety: string;
}> = {
  mechanical_support: {
    actionVerb: 'Đặt vững chắc lên đĩa cân / mặt đế',
    lawName: 'Cân bằng lực tĩnh học & Định luật III Newton',
    formula: '$\\vec{N} = -\\vec{P} = -m\\vec{g}$',
    defaultSafety: 'Đặt vật nhẹ nhàng vào chính tâm đĩa cân, không thả rơi mạnh gây hỏng cảm biến loadcell.',
  },
  mechanical_clamp: {
    actionVerb: 'Kẹp ôm sát bằng hai mỏ đo',
    lawName: 'Đo kích thước cơ học chính xác du xích / panme',
    formula: '$L = L_0 + k \\cdot 0.02\\text{ mm}$',
    defaultSafety: 'Vặn núm bánh cóc nhẹ nhàng vừa khít, không siết quá lực làm cong vênh mỏ cặp.',
  },
  mechanical_hook: {
    actionVerb: 'Móc vào khuyên treo đàn hồi',
    lawName: 'Định luật Hooke về biến dạng đàn hồi lò xo',
    formula: '$F_{\\text{dh}} = k \\cdot |\\Delta l| = P = m \\cdot g$',
    defaultSafety: 'Không treo vật nặng vượt quá giới hạn đo 5N làm biến dạng dão lò xo vĩnh viễn.',
  },
  mechanical_rail: {
    actionVerb: 'Gá trượt định hướng trên rãnh ray 1D',
    lawName: 'Định hướng chuyển động tịnh tiến 1 bậc tự do',
    formula: '$x(t) = x_0 + v \\cdot t$',
    defaultSafety: 'Siết nhẹ vít hãm khi đã định vị đúng tọa độ trên thước vạch milimét của ray.',
  },
  optical_carrier: {
    actionVerb: 'Lắp cố định lên đế trượt quang học',
    lawName: 'Cố định cao độ tâm quang học trên trục quang',
    formula: '$h_{\\text{quang}} = \\text{const} = 95\\text{ mm}$',
    defaultSafety: 'Giữ sạch khe gá, không để bụi bẩn làm nghiêng lệch trục quang học.',
  },
  optical_alignment: {
    actionVerb: 'Căn chỉnh đồng trục chùm tia sáng',
    lawName: 'Định luật truyền thẳng ánh sáng trong môi trường trong suốt',
    formula: '$y_{\\text{den}} = y_{\\text{F}} = y_{\\text{lens}} = y_{\\text{man}}$',
    defaultSafety: 'Không nhìn trực diện vào tim đèn halogen hoặc nguồn phát laser ở cự ly gần.',
  },
  optical_refraction: {
    actionVerb: 'Chiếu qua môi trường trong suốt khúc xạ',
    lawName: 'Định luật khúc xạ Snell & Công thức thấu kính mỏng',
    formula: '$\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'} \\quad \\text{va} \\quad n_1 \\sin(i) = n_2 \\sin(r)$',
    defaultSafety: 'Chỉ cầm vào vành kim loại bảo vệ của thấu kính, tuyệt đối không chạm ngón tay vào bề mặt kính.',
  },
  electrical_terminal: {
    actionVerb: 'Cắm dây dẫn bắp chuối Ø4mm khép kín mạch',
    lawName: 'Định luật Ôm cho đoạn mạch kín Kirchhoff',
    formula: '$I = \\frac{U}{R}$',
    defaultSafety: 'Tắt công tắc nguồn điện trước khi cắm/rút dây. Cấm chập trực tiếp 2 cực (+) và (-) gây đoản mạch!',
  },
  electrical_interlock: {
    actionVerb: 'Khóa liên động tiếp xúc điện',
    lawName: 'Điều kiện đóng mạch dẫn truyền electron tự do',
    formula: '$R_{\\text{tiep xuc}} \\approx 0\\,\\Omega \\implies \\text{Mach kin}$',
    defaultSafety: 'Đảm bảo phích cắm bắp chuối cắm ngập sâu vào lỗ cọc nguồn để tiếp xúc điện tốt nhất.',
  },
  fluid_spout: {
    actionVerb: 'Rót chất lỏng qua miệng vòi dẫn',
    lawName: 'Bảo toàn thể tích chất lỏng',
    formula: '$V_{\\text{tran}} = V_{\\text{chiem cho}} = V_{\\text{chim}}$',
    defaultSafety: 'Chờ nước chảy hết từng giọt cuối cùng trước khi đọc thể tích trên ống đong / cốc hứng.',
  },
  fluid_receptacle: {
    actionVerb: 'Hứng nhận chất lỏng vào bình chứa',
    lawName: 'Định luật bình thông nhau & Đo thể tích',
    formula: '$V_{\\text{tong}} = V_0 + \\Delta V$',
    defaultSafety: 'Đặt cốc trên mặt phẳng nằm ngang, đọc vạch thể tích theo đáy mặt khum (meniscus).',
  },
  submersion: {
    actionVerb: 'Thả chìm nhẹ nhàng vào lòng chất lỏng',
    lawName: 'Định luật chiếm chỗ Ác-si-mét',
    formula: '$V_{\\text{vat}} = V_2 - V_1$',
    defaultSafety: 'Nghiêng ống đong 45 độ và cho vật trượt từ từ, không thả rơi thẳng đứng làm vỡ đáy thủy tinh.',
  },
  buoyancy_force: {
    actionVerb: 'Chịu tác dụng của lực đẩy Ác-si-mét',
    lawName: 'Định luật lực đẩy Ác-si-mét',
    formula: '$F_A = d_{\\text{l}} \\cdot V = \\rho \\cdot g \\cdot V$',
    defaultSafety: 'Vật phải chìm hoàn toàn trong nước và không chạm đáy / thành bình để số đo chính xác.',
  },
  electromagnetic_induction: {
    actionVerb: 'Dịch chuyển tương đối sinh dòng cảm ứng',
    lawName: 'Định luật cảm ứng điện từ Faraday & Định luật Lenz',
    formula: '$\\mathcal{E} = -\\frac{d\\Phi}{dt} = -N \\frac{d(B \\cdot S \\cdot \\cos\\alpha)}{dt}$',
    defaultSafety: 'Dịch chuyển nam châm dứt khoát với vận tốc v đều đặn để kim điện kế lệch rõ nét.',
  },
  thermal_exchange: {
    actionVerb: 'Truyền nhiệt lượng đối lưu & dẫn nhiệt',
    lawName: 'Phương trình cân bằng nhiệt lượng',
    formula: '$Q_{\\text{toa}} = Q_{\\text{thu}} = m \\cdot c \\cdot \\Delta T$',
    defaultSafety: 'Phải dùng lưới amiăng lót dưới bát sứ/cốc để tản nhiệt đều, dùng kẹp gắp khi dụng cụ đang nóng.',
  },
  microscopy_dock: {
    actionVerb: 'Gá kẹp tiêu bản vi thể trên bàn sa trượt',
    lawName: 'Quang học vi mô & Độ phóng đại kính hiển vi',
    formula: '$M = M_{\\text{vat kinh}} \\times M_{\\text{thi kinh}}$',
    defaultSafety: 'Hạ vật kính sát tiêu bản bằng ốc sơ cấp khi nhìn nghiêng ngoài, sau đó mới nhìn vào thị kính vặn ốc vi cấp.',
  },
};

/**
 * Kho Dữ Liệu & Bộ Máy Điều Khiển Kết Nối Nơ-ron Ngữ Cảnh Toàn Cục
 */
export class NeuralConnectionEngine {
  private _isGuideEnabled: boolean = true;
  private _nodeByAssetId: Map<string, NeuralDeviceNode> = new Map();
  private _nodeBySlugId: Map<string, NeuralDeviceNode> = new Map();
  private _synapsesByAssetId: Map<string, { incoming: NeuralSynapseEdge[]; outgoing: NeuralSynapseEdge[] }> = new Map();
  private _activeSignals: Map<string, IntercomSignalPacket> = new Map();
  private _signalListeners: Set<(signals: IntercomSignalPacket[], inferences: ComputedCausalInference[]) => void> = new Set();

  constructor() {
    this._loadGuidePreference();
    this._buildIndexes();
  }

  /**
   * Đăng ký lắng nghe Bus truyền tin giữa các thiết bị (Device Inter-Communication)
   */
  public subscribeToBus(
    listener: (signals: IntercomSignalPacket[], inferences: ComputedCausalInference[]) => void,
  ): () => void {
    this._signalListeners.add(listener);
    listener(this.getActiveSignals(), this.computeCausalInferences());
    return () => {
      this._signalListeners.delete(listener);
    };
  }

  private _emitBusUpdate(): void {
    const signals = this.getActiveSignals();
    const inferences = this.computeCausalInferences();
    this._signalListeners.forEach((cb) => cb(signals, inferences));
  }

  /**
   * Đồng bộ hóa trạng thái thực tế của toàn bộ thiết bị trên bàn 3D vào Mạng truyền tin Nơ-ron
   * Khi học sinh thao tác bất kỳ thiết bị nào -> Bus phát tín hiệu cho thiết bị phụ thuộc biết
   */
  public syncSceneSignals(
    allInstances: SceneInstance[],
    assetsMap: Map<string, AssetDefinition>,
  ): { signals: IntercomSignalPacket[]; inferences: ComputedCausalInference[] } {
    this._activeSignals.clear();
    const now = Date.now();

    for (const inst of allInstances) {
      if (!inst.visible) continue;
      const asset = assetsMap.get(inst.assetId);
      const node = this.getNode(inst.assetId);
      const nameVi = node?.nameStudent || asset?.name.vi || inst.assetId;
      const st = inst.instanceState as Record<string, any>;

      // 1. Cân điện tử phát tín hiệu MASS_VALUE
      if (inst.assetId === 'OL3D-EQP-BAL-0001') {
        const mass = Number(st.measuredMassG ?? st.displayedMassG ?? 0);
        if (mass > 0.01) {
          this._activeSignals.set(`${inst.instanceId}:MASS_VALUE`, {
            id: `${inst.instanceId}:MASS_VALUE`,
            sourceInstanceId: inst.instanceId,
            sourceAssetId: inst.assetId,
            sourceNameVi: nameVi,
            signalType: 'MASS_VALUE',
            value: mass,
            unit: 'g',
            labelVi: `Khối lượng đo được m = ${mass.toFixed(1)} g`,
            timestampMs: now,
          });
        }
      }

      // 2. Ống đong phát tín hiệu VOLUME_DISPLACEMENT khi có vật chiếm chỗ hoặc mức nước thay đổi
      if (inst.assetId === 'OL3D-EQP-CYL-0001') {
        const curVol = Number(st.liquidLevelMl ?? 0);
        const baseVol = Number(st.baseLiquidLevelMl ?? 50);
        const deltaV = Math.max(0, curVol - baseVol);
        if (deltaV > 0.1) {
          this._activeSignals.set(`${inst.instanceId}:VOLUME_DISPLACEMENT`, {
            id: `${inst.instanceId}:VOLUME_DISPLACEMENT`,
            sourceInstanceId: inst.instanceId,
            sourceAssetId: inst.assetId,
            sourceNameVi: nameVi,
            signalType: 'VOLUME_DISPLACEMENT',
            value: deltaV,
            unit: 'cm³',
            labelVi: `Thể tích chiếm chỗ ΔV = ${deltaV.toFixed(1)} cm³`,
            timestampMs: now,
          });
        }
      }

      // 3. Lực kế lò xo phát tín hiệu FORCE_NEWTON
      if (inst.assetId === 'OL3D-EQP-DYN-0001') {
        const forceN = Number(st.springExtensionN ?? st.measuredForceN ?? st.forceN ?? 0);
        if (forceN > 0.01) {
          this._activeSignals.set(`${inst.instanceId}:FORCE_NEWTON`, {
            id: `${inst.instanceId}:FORCE_NEWTON`,
            sourceInstanceId: inst.instanceId,
            sourceAssetId: inst.assetId,
            sourceNameVi: nameVi,
            signalType: 'FORCE_NEWTON',
            value: forceN,
            unit: 'N',
            labelVi: `Lực kéo đo được F = ${forceN.toFixed(2)} N`,
            timestampMs: now,
          });
        }
      }

      // 4. Hộp nguồn điện phát tín hiệu VOLTAGE_VOLT
      if (inst.assetId === 'OL3D-EQP-PSU-0001') {
        const isOn = Boolean(st.isPoweredOn ?? st.powerOn ?? false);
        const volts = isOn ? Number(st.supplyVoltageV ?? st.voltageSetting ?? st.voltageV ?? st.outputVoltageV ?? 6) : 0;
        if (volts > 0) {
          this._activeSignals.set(`${inst.instanceId}:VOLTAGE_VOLT`, {
            id: `${inst.instanceId}:VOLTAGE_VOLT`,
            sourceInstanceId: inst.instanceId,
            sourceAssetId: inst.assetId,
            sourceNameVi: nameVi,
            signalType: 'VOLTAGE_VOLT',
            value: volts,
            unit: 'V',
            labelVi: `Nguồn điện cấp U = ${volts.toFixed(1)} V`,
            timestampMs: now,
          });
        }
      }

      // 5. Đèn Laser / Đèn chiếu sáng quang học phát tín hiệu LIGHT_RAY
      if (inst.assetId === 'OL3D-EQP-LSR-0001' || inst.assetId === 'OL3D-EQP-OLP-0001') {
        const isLit = Boolean(st.isLampLit ?? st.isLaserOn ?? st.isLightOn ?? st.isPoweredOn ?? false);
        if (isLit) {
          this._activeSignals.set(`${inst.instanceId}:LIGHT_RAY`, {
            id: `${inst.instanceId}:LIGHT_RAY`,
            sourceInstanceId: inst.instanceId,
            sourceAssetId: inst.assetId,
            sourceNameVi: nameVi,
            signalType: 'LIGHT_RAY',
            value: 1,
            unit: 'beam',
            labelVi: `Đang phát tia sáng chuẩn trực`,
            timestampMs: now,
          });
        }
      }

      // 6. Nhiệt kế / Đèn cồn phát tín hiệu TEMPERATURE_C
      if (inst.assetId === 'OL3D-EQP-THM-0001' || inst.assetId === 'OL3D-EQP-ALC-0001') {
        const isFlameActive = Boolean(st.isFlameLit ?? st.isHeating ?? st.isLit ?? false);
        const tempC = Number(st.temperatureC ?? (inst.assetId === 'OL3D-EQP-ALC-0001' && isFlameActive ? 650 : 25));
        if (tempC > 26 || isFlameActive) {
          this._activeSignals.set(`${inst.instanceId}:TEMPERATURE_C`, {
            id: `${inst.instanceId}:TEMPERATURE_C`,
            sourceInstanceId: inst.instanceId,
            sourceAssetId: inst.assetId,
            sourceNameVi: nameVi,
            signalType: 'TEMPERATURE_C',
            value: tempC,
            unit: '°C',
            labelVi: `Nhiệt độ truyền tải T = ${tempC.toFixed(1)} °C`,
            timestampMs: now,
          });
        }
      }
    }

    const signals = this.getActiveSignals();
    const inferences = this.computeCausalInferences();
    this._signalListeners.forEach((cb) => cb(signals, inferences));
    return { signals, inferences };
  }

  public getActiveSignals(): IntercomSignalPacket[] {
    return Array.from(this._activeSignals.values());
  }

  /**
   * Suy luận các định luật vật lý tổng hợp từ các tín hiệu mà các thiết bị "nói chuyện" với nhau
   */
  public computeCausalInferences(): ComputedCausalInference[] {
    const inferences: ComputedCausalInference[] = [];
    const signals = this.getActiveSignals();

    const massSig = signals.find((s) => s.signalType === 'MASS_VALUE');
    const volSig = signals.find((s) => s.signalType === 'VOLUME_DISPLACEMENT');
    const forceSig = signals.find((s) => s.signalType === 'FORCE_NEWTON');
    const voltSig = signals.find((s) => s.signalType === 'VOLTAGE_VOLT');
    const lightSig = signals.find((s) => s.signalType === 'LIGHT_RAY');

    // Suy luận 1: Khối lượng riêng (Cân điện tử <-> Ống đong)
    if (massSig && volSig && volSig.value > 0) {
      const density = massSig.value / volSig.value;
      let materialHint = 'Vật rắn thử nghiệm';
      if (Math.abs(density - 2.7) < 0.35) materialHint = 'Nhôm (Al)';
      else if (Math.abs(density - 7.8) < 0.6) materialHint = 'Sắt / Thép (Fe)';
      else if (Math.abs(density - 8.9) < 0.6) materialHint = 'Đồng (Cu)';

      inferences.push({
        id: 'causal-density-eureka',
        titleVi: 'Liên kết Cân ↔ Ống đong: Khối lượng riêng',
        formulaLatex: '$D = \\frac{m}{V}$',
        computedValueText: `D = ${massSig.value.toFixed(1)} / ${volSig.value.toFixed(1)} = ${density.toFixed(2)} g/cm³ (${materialHint})`,
        participatingAssetIds: [massSig.sourceAssetId, volSig.sourceAssetId],
        explanationVi: `${massSig.sourceNameVi} gửi khối lượng m kết hợp với ${volSig.sourceNameVi} gửi độ dâng thể tích ΔV để tính ngay khối lượng riêng vật chất.`,
      });
    }

    // Suy luận 2: Trọng lượng & Lực đẩy Archimedes (Cân / Lực kế)
    if (massSig && forceSig) {
      const weightN = (massSig.value / 1000) * 9.80665;
      const diffN = Math.max(0, weightN - forceSig.value);
      inferences.push({
        id: 'causal-archimedes-eureka',
        titleVi: 'Liên kết Trọng lực ↔ Lực kế: Lực đẩy Ác-si-mét',
        formulaLatex: '$F_A = P - F_{\\text{ke}}$',
        computedValueText: `P = ${weightN.toFixed(2)} N | F_kế = ${forceSig.value.toFixed(2)} N ⇒ F_A ≈ ${diffN.toFixed(2)} N`,
        participatingAssetIds: [massSig.sourceAssetId, forceSig.sourceAssetId],
        explanationVi: 'So sánh trọng lượng thực P từ khối lượng với số chỉ lực kế khi vật chìm trong chất lỏng.',
      });
    }

    // Suy luận 3: Mạch điện tương tác (Hộp nguồn -> Phụ tải)
    if (voltSig) {
      inferences.push({
        id: 'causal-ohm-circuit',
        titleVi: 'Mạch điện liên kết: Định luật Ohm',
        formulaLatex: '$I = \\frac{U}{R}$',
        computedValueText: `Hiệu điện thế cấp U = ${voltSig.value.toFixed(1)} V (Đủ ngưỡng nuôi phụ tải)`,
        participatingAssetIds: [voltSig.sourceAssetId],
        explanationVi: `${voltSig.sourceNameVi} đang phát tín hiệu điện áp U sang các thiết bị tiêu thụ và đồng hồ đo nối liền.`,
      });
    }

    // Suy luận 4: Đường truyền quang học (Đèn phát -> Thấu kính / Lăng kính)
    if (lightSig) {
      inferences.push({
        id: 'causal-optics-ray',
        titleVi: 'Truyền quang đồng trục: Khúc xạ & Hội tụ',
        formulaLatex: '$\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}$',
        computedValueText: 'Chùm tia chuẩn trực sẵn sàng tương tác với thấu kính và màn hứng',
        participatingAssetIds: [lightSig.sourceAssetId],
        explanationVi: `${lightSig.sourceNameVi} truyền vector chùm tia tới các linh kiện quang học đặt cùng trục quang chính.`,
      });
    }

    return inferences;
  }

  private _loadGuidePreference() {
    try {
      const stored = localStorage.getItem('openlab_neural_guide_enabled');
      if (stored !== null) {
        this._isGuideEnabled = stored === 'true';
      }
    } catch {
      this._isGuideEnabled = true;
    }
  }

  public get isGuideEnabled(): boolean {
    return this._isGuideEnabled;
  }

  public setGuideEnabled(enabled: boolean): void {
    this._isGuideEnabled = enabled;
    try {
      localStorage.setItem('openlab_neural_guide_enabled', enabled ? 'true' : 'false');
    } catch {
      // Ignore localStorage exceptions in sandboxed iframes
    }
    // Phát sự kiện toàn cục để UI cập nhật
    window.dispatchEvent(new CustomEvent('openlab:neural-guide-toggle', { detail: { enabled } }));
  }

  public toggleGuideEnabled(): boolean {
    this.setGuideEnabled(!this._isGuideEnabled);
    return this._isGuideEnabled;
  }

  private _buildIndexes() {
    // 1. Chỉ mục các Node
    for (const node of NEURAL_DEVICE_NODES) {
      this._nodeByAssetId.set(node.assetId, node);
      this._nodeBySlugId.set(node.id, node);
      this._synapsesByAssetId.set(node.assetId, { incoming: [], outgoing: [] });
    }

    // 2. Chỉ mục các Synapse hai chiều
    for (const edge of NEURAL_SYNAPSE_EDGES) {
      const sourceNode = this._nodeBySlugId.get(edge.source);
      const targetNode = this._nodeBySlugId.get(edge.target);

      if (sourceNode) {
        const outList = this._synapsesByAssetId.get(sourceNode.assetId);
        if (outList) outList.outgoing.push(edge);
      }
      if (targetNode) {
        const inList = this._synapsesByAssetId.get(targetNode.assetId);
        if (inList) inList.incoming.push(edge);
      }
    }
  }

  /**
   * Tra cứu Node Nơ-ron bằng assetId hoặc slugId
   */
  public getNode(assetOrSlug: string): NeuralDeviceNode | undefined {
    return this._nodeByAssetId.get(assetOrSlug) || this._nodeBySlugId.get(assetOrSlug);
  }

  /**
   * Lấy danh sách toàn bộ các Synapse liên quan tới một thiết bị (cả vào và ra)
   */
  public getSynapsesForDevice(assetOrSlug: string): { incoming: NeuralSynapseEdge[]; outgoing: NeuralSynapseEdge[] } {
    const node = this.getNode(assetOrSlug);
    if (!node) return { incoming: [], outgoing: [] };
    return this._synapsesByAssetId.get(node.assetId) || { incoming: [], outgoing: [] };
  }

  /**
   * Lấy danh sách các thiết bị tương thích đang có mặt trên bàn thí nghiệm 3D
   */
  public getCompatibleCandidates(
    selectedInstance: SceneInstance,
    allInstances: SceneInstance[],
    assetsMap: Map<string, AssetDefinition>,
  ): CompatibleTargetCandidate[] {
    const node = this.getNode(selectedInstance.assetId);
    if (!node) return [];

    const synapses = this.getSynapsesForDevice(node.assetId);
    const candidates: CompatibleTargetCandidate[] = [];

    const selPos = selectedInstance.transform.positionM;

    for (const targetInst of allInstances) {
      if (targetInst.instanceId === selectedInstance.instanceId || !targetInst.visible) continue;

      const targetNode = this.getNode(targetInst.assetId);
      if (!targetNode) continue;

      const targetAsset = assetsMap.get(targetInst.assetId);
      if (!targetAsset) continue;

      // Tìm kiếm Synapse kết nối giữa 2 thiết bị này
      const outgoingEdge = synapses.outgoing.find((e) => {
        const targetOfEdge = this._nodeBySlugId.get(e.target);
        return targetOfEdge?.assetId === targetNode.assetId;
      });

      const incomingEdge = synapses.incoming.find((e) => {
        const sourceOfEdge = this._nodeBySlugId.get(e.source);
        return sourceOfEdge?.assetId === targetNode.assetId;
      });

      const activeEdge = outgoingEdge || incomingEdge;
      if (!activeEdge) continue;

      const meta = PHYSICAL_LAW_MAPPINGS[activeEdge.type];
      const direction: 'input' | 'output' | 'bidirectional' = outgoingEdge && incomingEdge
        ? 'bidirectional'
        : outgoingEdge
        ? 'output'
        : 'input';

      const dx = targetInst.transform.positionM[0] - selPos[0];
      const dy = targetInst.transform.positionM[1] - selPos[1];
      const dz = targetInst.transform.positionM[2] - selPos[2];
      const distanceM = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const link: ContextualSynapseLink = {
        synapseId: activeEdge.id,
        sourceAssetId: selectedInstance.assetId,
        targetAssetId: targetInst.assetId,
        sourceNameVi: node.nameVi,
        targetNameVi: targetNode.nameVi,
        direction,
        kind: activeEdge.type,
        actionVerbVi: meta.actionVerb,
        physicalLawVi: meta.lawName,
        mathFormulaLatex: meta.formula,
        sourcePortName: node.studentPorts[0] || 'Cổng kết nối',
        targetPortName: targetNode.studentPorts[0] || 'Cổng nhận',
        prerequisites: [activeEdge.causalRule],
        safetyTipVi: activeEdge.studentCausal || meta.defaultSafety,
        experimentContext: activeEdge.experimentContext,
        isSatisfiedOnTable: true,
        activeCandidateInstanceId: targetInst.instanceId,
      };

      candidates.push({
        targetInstance: targetInst,
        targetAsset,
        link,
        distanceM,
        isAlreadyConnected: distanceM < 0.25, // Ước lượng đã snap gần nhau
      });
    }

    // Sắp xếp theo khoảng cách gần nhất
    return candidates.sort((a, b) => a.distanceM - b.distanceM);
  }

  /**
   * Tạo Checklist Nhân quả Chi tiết (Dendrites & Axons) cho thiết bị đang chọn
   */
  public getCausalChecklist(
    instance: SceneInstance,
    allInstances: SceneInstance[],
    assetsMap: Map<string, AssetDefinition>,
  ): CausalDeviceChecklist {
    const node = this.getNode(instance.assetId);
    if (!node) {
      return {
        deviceNode: {
          id: instance.assetId,
          assetId: instance.assetId,
          nameVi: assetsMap.get(instance.assetId)?.name.vi || 'Thiết bị thí nghiệm',
          nameStudent: assetsMap.get(instance.assetId)?.name.vi || 'Thiết bị',
          shortKeyword: assetsMap.get(instance.assetId)?.name.vi?.split(' ')[0] || 'Thiết bị',
          nameEn: 'Apparatus',
          category: 'G01_DIMENSION',
          subject: 'physics',
          grades: ['grade8'],
          ports: [],
          studentPorts: [],
          description: '',
          studentTip: '',
          glyphIcon: '📦',
        },
        activeInstance: instance,
        dendritesInput: [],
        axonsOutput: [],
        isFullyOperational: true,
      };
    }

    const { incoming, outgoing } = this.getSynapsesForDevice(node.assetId);
    const sceneAssetIds = new Set(allInstances.filter((i) => i.visible).map((i) => i.assetId));

    // 1. Phân tích các Dendrites (Điều kiện đầu vào mà thiết bị này cần)
    const dendritesInput: ContextualSynapseLink[] = incoming.map((edge) => {
      const srcNode = this._nodeBySlugId.get(edge.source);
      const srcAssetId = srcNode?.assetId || '';
      const isPresent = sceneAssetIds.has(srcAssetId);
      const meta = PHYSICAL_LAW_MAPPINGS[edge.type];

      return {
        synapseId: edge.id,
        sourceAssetId: srcAssetId,
        targetAssetId: node.assetId,
        sourceNameVi: srcNode?.nameVi || edge.source,
        targetNameVi: node.nameVi,
        direction: 'input',
        kind: edge.type,
        actionVerbVi: meta.actionVerb,
        physicalLawVi: meta.lawName,
        mathFormulaLatex: meta.formula,
        sourcePortName: srcNode?.studentPorts[0] || 'Cổng nguồn',
        targetPortName: node.studentPorts[0] || 'Cổng nhận',
        prerequisites: [edge.causalRule],
        safetyTipVi: edge.studentCausal || meta.defaultSafety,
        experimentContext: edge.experimentContext,
        isSatisfiedOnTable: isPresent,
      };
    });

    // 2. Phân tích các Axons (Tác động đầu ra mà thiết bị này tạo ra)
    const axonsOutput: ContextualSynapseLink[] = outgoing.map((edge) => {
      const tgtNode = this._nodeBySlugId.get(edge.target);
      const tgtAssetId = tgtNode?.assetId || '';
      const isPresent = sceneAssetIds.has(tgtAssetId);
      const meta = PHYSICAL_LAW_MAPPINGS[edge.type];

      return {
        synapseId: edge.id,
        sourceAssetId: node.assetId,
        targetAssetId: tgtAssetId,
        sourceNameVi: node.nameVi,
        targetNameVi: tgtNode?.nameVi || edge.target,
        direction: 'output',
        kind: edge.type,
        actionVerbVi: meta.actionVerb,
        physicalLawVi: meta.lawName,
        mathFormulaLatex: meta.formula,
        sourcePortName: node.studentPorts[0] || 'Cổng phát',
        targetPortName: tgtNode?.studentPorts[0] || 'Cổng đích',
        prerequisites: [edge.causalRule],
        safetyTipVi: edge.studentCausal || meta.defaultSafety,
        experimentContext: edge.experimentContext,
        isSatisfiedOnTable: isPresent,
      };
    });

    // Kiểm tra tính sẵn sàng vận hành
    const unsatisfiedDendrites = dendritesInput.filter((d) => !d.isSatisfiedOnTable);
    const isFullyOperational = unsatisfiedDendrites.length === 0;

    let missingPrerequisiteHint: string | undefined;
    if (unsatisfiedDendrites.length > 0) {
      const firstMissing = unsatisfiedDendrites[0];
      missingPrerequisiteHint = `Cần có thêm "${firstMissing.sourceNameVi}" trên bàn thí nghiệm để cấp tín hiệu / năng lượng.`;
    }

    return {
      deviceNode: node,
      activeInstance: instance,
      dendritesInput,
      axonsOutput,
      isFullyOperational,
      missingPrerequisiteHint,
    };
  }

  /**
   * Đánh giá Phản xạ An toàn (Lab Safety Reflex) giữa hai thiết bị
   */
  public evaluateSafetyReflex(
    instA: SceneInstance,
    instB: SceneInstance,
    distanceM: number,
  ): SafetyReflexResult {
    // 1. An toàn Nhiệt & Kính hiển vi: Đèn cồn đưa gần Kính hiển vi quang học
    if (
      (instA.assetId === 'OL3D-EQP-ALC-0001' && instB.assetId === 'OL3D-EQP-MIC-0001') ||
      (instB.assetId === 'OL3D-EQP-ALC-0001' && instA.assetId === 'OL3D-EQP-MIC-0001')
    ) {
      if (distanceM < 0.50) {
        return {
          isHazard: true,
          severity: 'critical',
          hazardMessageVi: 'CẢNH BÁO NGUY HIỂM: Ngọn lửa đèn cồn quá gần Kính hiển vi quang học!',
          scientificReasonVi: 'Nhiệt lượng phát xạ từ ngọn lửa đèn cồn làm nứt vỡ các thấu kính quang học DIN và cháy tiêu bản tế bào.',
          suggestedCorrectionVi: 'Giữ khoảng cách tối thiểu 50 cm giữa ngọn lửa đèn cồn và kính hiển vi.',
        };
      }
    }

    // 2. An toàn Điện học: Khoảng cách kéo dây bắp chuối giữa Hộp nguồn PSU và Đèn chiếu / Laser quá giới hạn 0.70m
    if (
      (instA.assetId === 'OL3D-EQP-PSU-0001' && (instB.assetId === 'OL3D-EQP-OLP-0001' || instB.assetId === 'OL3D-EQP-LSR-0001')) ||
      (instB.assetId === 'OL3D-EQP-PSU-0001' && (instA.assetId === 'OL3D-EQP-OLP-0001' || instA.assetId === 'OL3D-EQP-LSR-0001'))
    ) {
      if (distanceM > MAX_ELECTRICAL_CABLE_LENGTH_M) {
        return {
          isHazard: true,
          severity: 'medium',
          hazardMessageVi: 'CẢNH BÁO CĂNG DÂY: Dây cắm nguồn vượt quá chiều dài cáp 70 cm!',
          scientificReasonVi: 'Căng dây quá mức làm tuột đầu cắm bắp chuối Ø4mm và gây đứt hở mạch điện theo định luật Kirchhoff.',
          suggestedCorrectionVi: 'Kéo Hộp nguồn lại gần Đèn chiếu trong phạm vi dưới 0.70 m.',
        };
      }
    }

    // 3. An toàn Cơ học: Thả rơi khối kim loại nặng vào ống đong thủy tinh
    if (
      (instA.assetId === 'OL3D-EQP-BLK-0001' && instB.assetId === 'OL3D-EQP-CYL-0001') ||
      (instB.assetId === 'OL3D-EQP-BLK-0001' && instA.assetId === 'OL3D-EQP-CYL-0001')
    ) {
      if (distanceM < 0.15) {
        return {
          isHazard: true,
          severity: 'medium',
          hazardMessageVi: 'MẸO THAO TÁC AN TOÀN: Tránh thả rơi tự do khối đồng thau 219g vào ống đong!',
          scientificReasonVi: 'Động lượng va chạm của khối kim loại đồng thau nặng 219 g và kích thước 40 mm có thể làm kẹt vỡ miệng và đáy thủy tinh ống đong Ø28 mm.',
          suggestedCorrectionVi: 'Hãy dùng Bình tràn Eureka Ø60 mm cho mẫu vật khối hộp đồng thau lớn.',
        };
      }
    }

    return { isHazard: false, severity: 'low' };
  }
}

export const neuralConnectionEngine = new NeuralConnectionEngine();
