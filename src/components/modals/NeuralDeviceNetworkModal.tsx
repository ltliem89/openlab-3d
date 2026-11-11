import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  NEURAL_DEVICE_NODES,
  NEURAL_SYNAPSE_EDGES,
  EXPERIMENT_MACRO_CLUSTERS,
  CATEGORY_META,
  SYNAPSE_META,
  NeuralDeviceNode,
  NeuralSynapseEdge,
  DeviceCategory,
  SynapseKind,
  ExperimentMacroCluster,
  ThcsGrade
} from '../../domain/neuralNetworkTopology';
import { PHYSICAL_LAW_MAPPINGS } from '../../domain/neuralConnectionEngine';
import { EquipmentThumbnailSvg } from '../common/EquipmentThumbnailSvg';
import { ProceduralArchetype } from '../../domain/types';
import { MathFormula, RichMathText } from '../common/MathFormula';

export interface NeuralDeviceNetworkModalProps {
  isOpen: boolean;
  initialDeviceId?: string | null;
  onClose: () => void;
  onSelectDevice?: (deviceId: string, positionM?: [number, number, number]) => void;
  onTriggerMacroCluster?: (cluster: ExperimentMacroCluster) => void;
  activeSceneDeviceIds?: string[];
}

interface NodeSimulationState {
  device: NeuralDeviceNode;
  x: number;
  y: number;
  tx: number;
  ty: number;
  radius: number;
  connections: number;
}

interface SynapseParticle {
  edge: NeuralSynapseEdge;
  sourceNode: NodeSimulationState;
  targetNode: NodeSimulationState;
  progress: number;
  speed: number;
  size: number;
  color: string;
  flowDirection: 'outflow' | 'inflow' | 'bidirectional';
}

// Hàm chắt lọc diễn giải nhân quả ngắn gọn, súc tích, tránh từ ngữ thừa thãi
// Hàm chắt lọc diễn giải nhân quả ngắn gọn, súc tích, giữ nguyên động từ chỉ dẫn
const distillCausal = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/nhé các em!?/gi, '')
    .replace(/\s*->\s*/g, ' → ')
    .trim();
};

// ĐỘNG CƠ ÂM THANH WEB AUDIO & GIỌNG ĐỌC TỰ NHIÊN (ZERO ASSETS)
class ProceduralAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isVoiceMuted: boolean = false;
  private cachedViVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.initVoiceListener();
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  private initVoiceListener() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const findVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;
      // 1. Ưu tiên giọng đọc Natural / Online tiếng Việt chất lượng cao (Microsoft HoaiMy, NamMinh, Google Tiếng Việt)
      const naturalVi = voices.find(
        (v) =>
          (v.lang.startsWith('vi') || v.lang.toLowerCase().includes('vi_vn')) &&
          (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('HoaiMy') || v.name.includes('NamMinh'))
      );
      // 2. Giọng tiếng Việt tiêu chuẩn bất kỳ
      const anyVi = voices.find(
        (v) =>
          v.lang.startsWith('vi') ||
          v.lang.toLowerCase().includes('vi_vn') ||
          v.name.toLowerCase().includes('vietnam') ||
          v.name.toLowerCase().includes('tiếng việt')
      );
      this.cachedViVoice = naturalVi || anyVi || null;
    };

    findVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = findVoice;
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (mute) this.stopSpeech();
  }

  setVoiceMute(mute: boolean) {
    this.isVoiceMuted = mute;
    if (mute) this.stopSpeech();
  }

  getVoiceMute(): boolean {
    return this.isVoiceMuted;
  }

  // Làm sạch văn bản để giọng đọc phát âm tự nhiên, không đọc ký hiệu lạ hay mã LaTeX
  cleanTextForSpeech(text: string): string {
    if (!text) return '';
    return text
      // Thay thế công thức hay gặp bằng từ ngữ phát âm chuẩn tiếng Việt
      .replace(/D\s*=\s*m\s*\/\s*V/gi, 'khối lượng riêng bằng m chia V')
      .replace(/P\s*=\s*m\s*[\*·]\s*g/gi, 'trọng lượng P')
      .replace(/d\s*[\*·]\s*V/gi, 'trọng lượng riêng nhân thể tích')
      .replace(/F_A/gi, 'lực đẩy Ác-si-mét')
      // Khử toàn bộ công thức toán LaTeX $...$ hoặc $$...$$
      .replace(/\$\$[\s\S]+?\$\$/g, '')
      .replace(/\$[^\$]+?\$/g, '')
      .replace(/\\[a-zA-Z]+/g, ' ')
      .replace(/[{}\[\]\(\)]/g, ' ')
      // Chuyển đổi ký hiệu mũi tên thành từ liên kết tự nhiên
      .replace(/\s*(?:→|➔|->|-->)\s*/g, ', giúp ')
      // Khử biểu tượng emoji, ký hiệu lạ
      .replace(/[⚡🔗🚰🧪⚙️🔬📐🎯➕➖✕✖️✓✔•*#]/g, '')
      // Đọc các đơn vị đo lường thông dụng bằng tiếng Việt chuẩn
      .replace(/(\d+(?:\.\d+)?)\s*ml\b/gi, '$1 mi-li-lít')
      .replace(/(\d+(?:\.\d+)?)\s*mm\b/gi, '$1 mi-li-mét')
      .replace(/(\d+(?:\.\d+)?)\s*cm\b/gi, '$1 xen-ti-mét')
      .replace(/(\d+(?:\.\d+)?)\s*kg\b/gi, '$1 ki-lô-gam')
      .replace(/(\d+(?:\.\d+)?)\s*g\b/gi, '$1 gam')
      .replace(/(\d+(?:\.\d+)?)\s*V\b/g, '$1 Vôn')
      .replace(/(\d+(?:\.\d+)?)\s*N\b/g, '$1 Niu-tơn')
      .replace(/(\d+(?:\.\d+)?)\s*W\b/gi, '$1 Oát')
      .replace(/(\d+(?:\.\d+)?)\s*°C/gi, '$1 độ C')
      .replace(/(\d+)\.00(?=\s|$)/g, '$1')
      // Dọn dẹp khoảng trắng, dấu phẩy thừa
      .replace(/,\s*,/g, ',')
      .replace(/\s+/g, ' ')
      .trim();
  }

  playNodeClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  playSuccessChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.25);
      });
    } catch {}
  }

  playErrorBuzz() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.setValueAtTime(140, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {}
  }

  playSynapseGuide(synapseKind: SynapseKind, speechText?: string) {
    if (this.isMuted) return;
    this.init();
    if (this.ctx) {
      try {
        const now = this.ctx.currentTime;
        // Âm thanh đặc trưng cho từng loại liên kết nơ-ron
        if (
          synapseKind === 'fluid_spout' ||
          synapseKind === 'fluid_receptacle' ||
          synapseKind === 'submersion' ||
          synapseKind === 'buoyancy_force'
        ) {
          // Tiếng giọt nước long lanh (Bubble Pulse)
          [380, 620, 880].forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.045);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.45, now + i * 0.045 + 0.11);
            gain.gain.setValueAtTime(0.13, now + i * 0.045);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.13);
            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(now + i * 0.045);
            osc.stop(now + i * 0.045 + 0.14);
          });
        } else if (
          synapseKind === 'electrical_terminal' ||
          synapseKind === 'electrical_interlock' ||
          synapseKind === 'electromagnetic_induction'
        ) {
          // Tiếng xung kích điện từ ngân vang (Electric Resonance)
          [440, 880].forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.03);
            gain.gain.setValueAtTime(0.14, now + i * 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(now + i * 0.03);
            osc.stop(now + 0.24);
          });
        } else {
          // Tiếng xung dẫn truyền chuẩn Synapse (Cosmic Harmonic)
          [520, 780].forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.05);
            gain.gain.setValueAtTime(0.13, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.18);
            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.19);
          });
        }
      } catch {}
    }

    // Giọng đọc hướng dẫn tiếng Việt tự nhiên qua Web Speech API
    if (!this.isVoiceMuted && speechText && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const cleaned = this.cleanTextForSpeech(speechText);
        if (!cleaned) return;

        // Cập nhật lại voice nếu chưa có
        if (!this.cachedViVoice) {
          const voices = window.speechSynthesis.getVoices();
          const naturalVi = voices.find(
            (v) =>
              (v.lang.startsWith('vi') || v.lang.toLowerCase().includes('vi_vn')) &&
              (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('HoaiMy') || v.name.includes('NamMinh'))
          );
          const anyVi = voices.find(
            (v) =>
              v.lang.startsWith('vi') ||
              v.lang.toLowerCase().includes('vi_vn') ||
              v.name.toLowerCase().includes('vietnam') ||
              v.name.toLowerCase().includes('tiếng việt')
          );
          this.cachedViVoice = naturalVi || anyVi || null;
        }

        const voices = window.speechSynthesis.getVoices();
        const hasAnyViVoice = this.cachedViVoice || voices.some((v) => v.lang.startsWith('vi') || v.name.toLowerCase().includes('vietnam') || v.name.toLowerCase().includes('tiếng việt'));

        // Chỉ kích hoạt đọc nếu có giọng tiếng Việt thực sự, tránh dùng giọng tiếng Anh (David/Zira) đọc méo mó từ ngữ tiếng Việt
        if (hasAnyViVoice) {
          const utter = new SpeechSynthesisUtterance(cleaned);
          if (this.cachedViVoice) {
            utter.voice = this.cachedViVoice;
            utter.lang = this.cachedViVoice.lang || 'vi-VN';
          } else {
            utter.lang = 'vi-VN';
          }
          // Tốc độ 0.95: Nhịp điệu điềm tĩnh, tự nhiên, rõ ràng cho học sinh THCS
          utter.rate = 0.95;
          utter.pitch = 1.0;
          utter.volume = 0.95;
          window.speechSynthesis.speak(utter);
        }
      } catch {}
    }
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }
}

const audioFX = new ProceduralAudio();

// TÍNH TOÁN DÂY DẪN HƯỚNG NEO CHÚ THÍCH (DYNAMIC ANCHORED LEADER LINE)
const computeLeaderLineFromRect = (
  rectLeft: number,
  rectTop: number,
  popupW: number,
  popupH: number,
  anchorX: number,
  anchorY: number,
) => {
  const rectRight = rectLeft + popupW;
  const rectBottom = rectTop + popupH;
  const cxBox = rectLeft + popupW / 2;
  const cyBox = rectTop + popupH / 2;

  // Nếu điểm neo nằm gọn bên trong hộp popup, ẩn dây nối để không vẽ đè lên chữ
  const isInside =
    anchorX >= rectLeft - 6 &&
    anchorX <= rectRight + 6 &&
    anchorY >= rectTop - 6 &&
    anchorY <= rectBottom + 6;

  const dx = anchorX - cxBox;
  const dy = anchorY - cyBox;
  const nx = dx / Math.max(1, popupW / 2);
  const ny = dy / Math.max(1, popupH / 2);

  let sx = cxBox;
  let sy = rectBottom;
  let c1x = sx;
  let c1y = sy;
  let c2x = anchorX;
  let c2y = anchorY;

  if (Math.abs(nx) > Math.abs(ny)) {
    // Điểm neo nằm chủ yếu bên TRÁI hoặc PHẢI hộp
    const marginY = Math.min(28, popupH * 0.25);
    sy = Math.max(rectTop + marginY, Math.min(rectBottom - marginY, anchorY));
    if (dx < 0) {
      sx = rectLeft;
    } else {
      sx = rectRight;
    }
    const midX = (sx + anchorX) / 2;
    c1x = midX;
    c1y = sy;
    c2x = midX;
    c2y = anchorY;
  } else {
    // Điểm neo nằm chủ yếu bên TRÊN hoặc DƯỚI hộp
    const marginX = Math.min(32, popupW * 0.25);
    sx = Math.max(rectLeft + marginX, Math.min(rectRight - marginX, anchorX));
    if (dy < 0) {
      sy = rectTop;
    } else {
      sy = rectBottom;
    }
    const midY = (sy + anchorY) / 2;
    c1x = sx;
    c1y = midY;
    c2x = anchorX;
    c2y = midY;
  }

  // Điểm kết thúc lùi lại 8px so với tâm điểm neo để đầu mũi tên chỉ đúng vào viền vòng tròn neo
  const dist = Math.hypot(anchorX - sx, anchorY - sy);
  let ex = anchorX;
  let ey = anchorY;
  if (dist > 18) {
    const vX = anchorX - c2x || anchorX - sx;
    const vY = anchorY - c2y || anchorY - sy;
    const len = Math.hypot(vX, vY) || 1;
    ex = anchorX - (vX / len) * 8;
    ey = anchorY - (vY / len) * 8;
  }

  return { sx, sy, c1x, c1y, c2x, c2y, ex, ey, isInside };
};

export const NeuralDeviceNetworkModal: React.FC<NeuralDeviceNetworkModalProps> = ({
  isOpen,
  initialDeviceId,
  onClose,
  onSelectDevice,
  onTriggerMacroCluster,
  activeSceneDeviceIds = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States
  const [userMode, setUserMode] = useState<'student' | 'expert'>('student');
  const [selectedGrade, setSelectedGrade] = useState<'ALL' | ThcsGrade>('ALL');
  const [selectedNode, setSelectedNode] = useState<NeuralDeviceNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<NeuralSynapseEdge | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<NeuralSynapseEdge | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && initialDeviceId) {
      const match = NEURAL_DEVICE_NODES.find(
        (n) => n.assetId === initialDeviceId || n.id === initialDeviceId,
      );
      if (match) {
        setSelectedNode(match);
        setSelectedEdge(null);
        selectedEdgeRef.current = null;
        setEdgePopupPos(null);
        edgePopupPosRef.current = null;
        setShowDetailDrawer(false); // Mặc định không bật bảng to che bản đồ
        const targetSim = nodesRef.current.find(n => n.device.id === match.id);
        if (targetSim) {
          cameraRef.current = { x: targetSim.tx * 0.45, y: targetSim.ty * 0.45, zoom: 1.15 };
        }
      }
    } else if (isOpen) {
      setShowDetailDrawer(false);
      setSelectedEdge(null);
      selectedEdgeRef.current = null;
      setEdgePopupPos(null);
      edgePopupPosRef.current = null;
    }
  }, [isOpen, initialDeviceId]);

  const selectedEdgeRef = useRef<NeuralSynapseEdge | null>(null);
  useEffect(() => {
    selectedEdgeRef.current = selectedEdge;
  }, [selectedEdge]);

  const edgeClickCandidateRef = useRef<{ edge: NeuralSynapseEdge; startX: number; startY: number } | null>(null);
  const [edgePopupPos, setEdgePopupPos] = useState<{ x: number; y: number } | null>(null);
  const edgePopupPosRef = useRef<{ x: number; y: number } | null>(null);
  const popupContainerRef = useRef<HTMLDivElement | null>(null);

  // SVG Leader Line DOM Refs cho hiệu năng 60-120 FPS
  const leaderSvgGroupRef = useRef<SVGGElement | null>(null);
  const leaderGlowPathRef = useRef<SVGPathElement | null>(null);
  const leaderCorePathRef = useRef<SVGPathElement | null>(null);
  const leaderStudRef = useRef<SVGCircleElement | null>(null);
  const leaderAnchorRingRef = useRef<SVGCircleElement | null>(null);
  const leaderAnchorHaloRef = useRef<SVGCircleElement | null>(null);
  const leaderAnchorDotRef = useRef<SVGCircleElement | null>(null);

  const isDraggingPopupRef = useRef<boolean>(false);
  const popupDragStartRef = useRef<{ mouseX: number; mouseY: number; startPopupX: number; startPopupY: number }>({
    mouseX: 0,
    mouseY: 0,
    startPopupX: 0,
    startPopupY: 0,
  });

  const [hoveredNode, setHoveredNode] = useState<NeuralDeviceNode | null>(null);
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentMacroCluster | null>(null);
  const [layoutMode, setLayoutMode] = useState<'circular' | 'neural_layers'>('circular');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isFiringSignal, setIsFiringSignal] = useState<boolean>(true);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [challengeMode, setChallengeMode] = useState<boolean>(false);
  const [challengeScore, setChallengeScore] = useState<number>(0);
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [mapTheme, setMapTheme] = useState<'dark' | 'light' | 'transparent'>('dark');
  const [qualityMode] = useState<'performance' | 'balanced' | 'cinematic'>('balanced');
  const [viewPresentation, setViewPresentation] = useState<'cosmos_canvas' | 'accessible_table'>('cosmos_canvas');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  // Kéo thả nơ-ron biến hình thành thiết bị thật vào bàn 3D
  const [isDraggingToScene, setIsDraggingToScene] = useState<boolean>(false);
  const [draggedNode, setDraggedNode] = useState<NeuralDeviceNode | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragCurrentPos, setDragCurrentPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragCandidateRef = useRef<{ node: NeuralDeviceNode; startX: number; startY: number } | null>(null);
  const isNodeDragActiveRef = useRef<boolean>(false);

  // Camera
  const cameraRef = useRef<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 1 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastClickTimeRef = useRef<number>(0);

  const nodesRef = useRef<NodeSimulationState[]>([]);
  const particlesRef = useRef<SynapseParticle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Toggle sound
  const handleToggleSound = () => {
    setIsSoundMuted(prev => {
      const next = !prev;
      audioFX.setMute(next);
      if (next) audioFX.stopSpeech();
      return next;
    });
  };

  // Đồng bộ dây dẫn hướng neo chú thích (Leader Line) thời gian thực theo tọa độ màn hình 60-120 FPS
  const syncLeaderLine = useCallback(() => {
    const edge = selectedEdgeRef.current;
    const canvas = canvasRef.current;
    if (!edge || !canvas) {
      if (leaderSvgGroupRef.current) leaderSvgGroupRef.current.style.display = 'none';
      return;
    }

    const src = nodesRef.current.find((n) => n.device.id === edge.source);
    const tgt = nodesRef.current.find((n) => n.device.id === edge.target);
    if (!src || !tgt) {
      if (leaderSvgGroupRef.current) leaderSvgGroupRef.current.style.display = 'none';
      return;
    }

    const cam = cameraRef.current;
    const sPos = {
      x: (src.x - cam.x) * cam.zoom + canvas.width / 2,
      y: (src.y - cam.y) * cam.zoom + canvas.height / 2,
    };
    const tPos = {
      x: (tgt.x - cam.x) * cam.zoom + canvas.width / 2,
      y: (tgt.y - cam.y) * cam.zoom + canvas.height / 2,
    };

    const midX = (sPos.x + tPos.x) / 2;
    const midY = (sPos.y + tPos.y) / 2;
    const dx = tPos.x - sPos.x;
    const dy = tPos.y - sPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const curvature = Math.min(dist * 0.12, 32);
    const cx = midX - (dy / dist) * curvature;
    const cy = midY + (dx / dist) * curvature;
    const mt = 0.5;
    const aX = (1 - mt) * (1 - mt) * sPos.x + 2 * (1 - mt) * mt * cx + mt * mt * tPos.x;
    const aY = (1 - mt) * (1 - mt) * sPos.y + 2 * (1 - mt) * mt * cy + mt * mt * tPos.y;

    const popupPos = edgePopupPosRef.current;
    if (!popupPos) {
      if (leaderSvgGroupRef.current) leaderSvgGroupRef.current.style.display = 'none';
      return;
    }

    const popupW = popupContainerRef.current?.offsetWidth || 370;
    const popupH = popupContainerRef.current?.offsetHeight || 270;

    const line = computeLeaderLineFromRect(popupPos.x, popupPos.y, popupW, popupH, aX, aY);

    if (leaderSvgGroupRef.current) leaderSvgGroupRef.current.style.display = 'block';

    // Cập nhật vị trí điểm neo trên sợi dây nơ-ron
    if (leaderAnchorRingRef.current) {
      leaderAnchorRingRef.current.setAttribute('cx', String(aX));
      leaderAnchorRingRef.current.setAttribute('cy', String(aY));
    }
    if (leaderAnchorHaloRef.current) {
      leaderAnchorHaloRef.current.setAttribute('cx', String(aX));
      leaderAnchorHaloRef.current.setAttribute('cy', String(aY));
    }
    if (leaderAnchorDotRef.current) {
      leaderAnchorDotRef.current.setAttribute('cx', String(aX));
      leaderAnchorDotRef.current.setAttribute('cy', String(aY));
    }

    // Nếu hộp popup bị kéo đè trực tiếp lên điểm neo, ẩn dây nối để tránh chướng mắt
    const linePathD = `M ${line.sx} ${line.sy} C ${line.c1x} ${line.c1y}, ${line.c2x} ${line.c2y}, ${line.ex} ${line.ey}`;
    const lineOpacity = line.isInside ? '0' : '1';

    if (leaderGlowPathRef.current) {
      leaderGlowPathRef.current.setAttribute('d', linePathD);
      leaderGlowPathRef.current.style.opacity = lineOpacity;
    }
    if (leaderCorePathRef.current) {
      leaderCorePathRef.current.setAttribute('d', linePathD);
      leaderCorePathRef.current.style.opacity = lineOpacity;
    }
    if (leaderStudRef.current) {
      leaderStudRef.current.setAttribute('cx', String(line.sx));
      leaderStudRef.current.setAttribute('cy', String(line.sy));
      leaderStudRef.current.style.opacity = lineOpacity;
    }
  }, []);

  // Kích hoạt chọn khớp nối nơ-ron: phát giọng đọc tự nhiên, đặt vị trí tối ưu trên màn hình và neo dây dẫn hướng
  const selectSynapseEdge = useCallback((edge: NeuralSynapseEdge) => {
    const srcNode = NEURAL_DEVICE_NODES.find((n) => n.id === edge.source) || null;
    const tgtNode = NEURAL_DEVICE_NODES.find((n) => n.id === edge.target) || null;
    const sMeta = SYNAPSE_META[edge.type];
    const lawMeta = PHYSICAL_LAW_MAPPINGS[edge.type];

    // Phát âm thanh đặc trưng và đọc hướng dẫn tiếng Việt tự nhiên (Web Speech API)
    const speechSummary = edge.studentCausal
      ? edge.studentCausal
      : lawMeta?.actionVerb
      ? `${srcNode?.nameStudent || 'Thiết bị nguồn'} kết hợp với ${tgtNode?.nameStudent || 'thiết bị nhận'}: ${lawMeta.actionVerb}.`
      : `${srcNode?.nameStudent || 'Thiết bị nguồn'} kết nối với ${tgtNode?.nameStudent || 'thiết bị đích'} qua ${sMeta?.studentName || 'liên kết'}.`;
    audioFX.playSynapseGuide(edge.type, speechSummary);

    selectedEdgeRef.current = edge;
    setSelectedEdge(edge);
    setShowDetailDrawer(false);
    setSelectedNode(null);

    // Tính toán tọa độ ban đầu tối ưu của hộp popup sao cho không che khuất khớp nối
    const canvas = canvasRef.current;
    if (canvas) {
      const src = nodesRef.current.find((n) => n.device.id === edge.source);
      const tgt = nodesRef.current.find((n) => n.device.id === edge.target);
      if (src && tgt) {
        const cam = cameraRef.current;
        const sPos = {
          x: (src.x - cam.x) * cam.zoom + canvas.width / 2,
          y: (src.y - cam.y) * cam.zoom + canvas.height / 2,
        };
        const tPos = {
          x: (tgt.x - cam.x) * cam.zoom + canvas.width / 2,
          y: (tgt.y - cam.y) * cam.zoom + canvas.height / 2,
        };
        const midX = (sPos.x + tPos.x) / 2;
        const midY = (sPos.y + tPos.y) / 2;
        const dx = tPos.x - sPos.x;
        const dy = tPos.y - sPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const curvature = Math.min(dist * 0.12, 32);
        const cx = midX - (dy / dist) * curvature;
        const cy = midY + (dx / dist) * curvature;
        const mt = 0.5;
        const aX = (1 - mt) * (1 - mt) * sPos.x + 2 * (1 - mt) * mt * cx + mt * mt * tPos.x;
        const aY = (1 - mt) * (1 - mt) * sPos.y + 2 * (1 - mt) * mt * cy + mt * mt * tPos.y;

        const popupW = 370;
        const popupH = 270;
        const canvasW = canvas.width;
        const canvasH = canvas.height;

        // Căn ngang: Tâm hộp trùng với aX (clamped)
        const initX = Math.max(12, Math.min(Math.max(12, canvasW - popupW - 12), aX - popupW / 2));

        // Căn dọc: Nếu phía trên có đủ chỗ (>= popupH + 36px) thì đặt trên, ngược lại đặt dưới
        let initY: number;
        if (aY - 32 - popupH >= 12) {
          initY = aY - 32 - popupH;
        } else {
          initY = Math.min(Math.max(12, canvasH - popupH - 12), aY + 32);
        }

        edgePopupPosRef.current = { x: initX, y: initY };
        setEdgePopupPos({ x: initX, y: initY });

        requestAnimationFrame(() => {
          syncLeaderLine();
        });
      }
    }
  }, [syncLeaderLine]);

  // Kéo thả di chuyển hộp Popup chú thích tự do mà vẫn giữ nguyên điểm neo chỉ hướng
  const handlePopupPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    // Không bắt kéo nếu bấm vào nút bấm thao tác
    if (target.closest('button') || target.closest('input')) return;

    e.stopPropagation();
    isDraggingPopupRef.current = true;
    const curPos = edgePopupPosRef.current || { x: 100, y: 100 };
    popupDragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startPopupX: curPos.x,
      startPopupY: curPos.y,
    };
  };

  useEffect(() => {
    const handleWindowPopupPointerMove = (e: PointerEvent) => {
      if (!isDraggingPopupRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dx = e.clientX - popupDragStartRef.current.mouseX;
      const dy = e.clientY - popupDragStartRef.current.mouseY;

      const popupW = popupContainerRef.current?.offsetWidth || 370;
      const popupH = popupContainerRef.current?.offsetHeight || 270;
      const canvasW = canvas.width || 1200;
      const canvasH = canvas.height || 800;

      const nextX = Math.max(12, Math.min(Math.max(12, canvasW - popupW - 12), popupDragStartRef.current.startPopupX + dx));
      const nextY = Math.max(12, Math.min(Math.max(12, canvasH - popupH - 12), popupDragStartRef.current.startPopupY + dy));

      edgePopupPosRef.current = { x: nextX, y: nextY };
      if (popupContainerRef.current) {
        popupContainerRef.current.style.left = `${nextX}px`;
        popupContainerRef.current.style.top = `${nextY}px`;
      }
      syncLeaderLine();
    };

    const handleWindowPopupPointerUp = () => {
      if (isDraggingPopupRef.current) {
        isDraggingPopupRef.current = false;
        if (edgePopupPosRef.current) {
          setEdgePopupPos({ ...edgePopupPosRef.current });
        }
      }
    };

    window.addEventListener('pointermove', handleWindowPopupPointerMove);
    window.addEventListener('pointerup', handleWindowPopupPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleWindowPopupPointerMove);
      window.removeEventListener('pointerup', handleWindowPopupPointerUp);
    };
  }, [syncLeaderLine]);

  // Lọc Node
  const filteredNodes = useMemo(() => {
    return NEURAL_DEVICE_NODES.filter(device => {
      if (selectedGrade !== 'ALL' && !device.grades.includes(selectedGrade)) return false;
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchVi = device.nameVi.toLowerCase().includes(kw);
        const matchStudent = device.nameStudent.toLowerCase().includes(kw);
        const matchId = device.assetId.toLowerCase().includes(kw);
        if (!matchVi && !matchStudent && !matchId) return false;
      }
      return true;
    });
  }, [selectedGrade, searchKeyword]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  // Lọc danh sách bài thực hành SGK
  const filteredExperiments = useMemo(() => {
    return EXPERIMENT_MACRO_CLUSTERS.filter(cluster => {
      if (selectedGrade !== 'ALL' && cluster.gradeCode !== selectedGrade) return false;
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchTitle = cluster.title.toLowerCase().includes(kw);
        const matchSubject = cluster.subject.toLowerCase().includes(kw);
        const matchGoal = cluster.studentGoal.toLowerCase().includes(kw);
        const matchDevs = cluster.deviceIds.some(id => {
          const dev = NEURAL_DEVICE_NODES.find(d => d.id === id);
          return dev && (dev.nameVi.toLowerCase().includes(kw) || dev.nameStudent.toLowerCase().includes(kw));
        });
        if (!matchTitle && !matchSubject && !matchGoal && !matchDevs) return false;
      }
      return true;
    });
  }, [selectedGrade, searchKeyword]);

  // Lọc Edges
  const filteredEdges = useMemo(() => {
    return NEURAL_SYNAPSE_EDGES.filter(edge => {
      if (!filteredNodeIds.has(edge.source) || !filteredNodeIds.has(edge.target)) return false;
      if (selectedExperiment) {
        return selectedExperiment.deviceIds.includes(edge.source) && selectedExperiment.deviceIds.includes(edge.target);
      }
      return true;
    });
  }, [filteredNodeIds, selectedExperiment]);

  // Tìm khớp nối nơ-ron tại tọa độ màn hình (Hit-testing đường cong Bezier)
  const findEdgeAtScreenPoint = useCallback(
    (mx: number, my: number, canvasWidth: number, canvasHeight: number): NeuralSynapseEdge | null => {
      const cam = cameraRef.current;
      const toScreen = (wx: number, wy: number) => ({
        x: (wx - cam.x) * cam.zoom + canvasWidth / 2,
        y: (wy - cam.y) * cam.zoom + canvasHeight / 2,
      });

      let bestEdge: NeuralSynapseEdge | null = null;
      let bestDistSq = 14 * 14; // Bán kính nhận diện 14px

      for (const edge of filteredEdges) {
        const src = nodesRef.current.find((n) => n.device.id === edge.source);
        const tgt = nodesRef.current.find((n) => n.device.id === edge.target);
        if (!src || !tgt) continue;

        const sPos = toScreen(src.x, src.y);
        const tPos = toScreen(tgt.x, tgt.y);

        const midX = (sPos.x + tPos.x) / 2;
        const midY = (sPos.y + tPos.y) / 2;
        const dx = tPos.x - sPos.x;
        const dy = tPos.y - sPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const curvature = Math.min(dist * 0.12, 32);
        const cx = midX - (dy / dist) * curvature;
        const cy = midY + (dx / dist) * curvature;

        // Lấy mẫu 9 điểm trên đường cong Bezier bậc 2
        for (let step = 1; step <= 9; step++) {
          const t = step / 10;
          const bx = (1 - t) * (1 - t) * sPos.x + 2 * (1 - t) * t * cx + t * t * tPos.x;
          const by = (1 - t) * (1 - t) * sPos.y + 2 * (1 - t) * t * cy + t * t * tPos.y;
          const d2 = (mx - bx) * (mx - bx) + (my - by) * (my - by);
          if (d2 < bestDistSq) {
            bestDistSq = d2;
            bestEdge = edge;
          }
        }
      }
      return bestEdge;
    },
    [filteredEdges],
  );

  // Vị trí Target: Gốc (0, 0) là tâm World Space - Cố định hình học tròn chuẩn 1:1, không bị méo khi mở/đóng bảng
  const computeTargetPositions = useCallback((_width: number, height: number, mode: typeof layoutMode) => {
    const nodes = nodesRef.current;
    if (nodes.length === 0) return;

    // Tự động mở rộng bán kính theo khung hình thực tế của canvas, tạo không gian thoáng đãng
    const maxR = Math.min((_width - 160) * 0.38, (height - 80) * 0.44);
    const R_orbit = Math.max(260, Math.min(380, maxR));

    if (mode === 'circular') {
      const categories = Object.keys(CATEGORY_META) as DeviceCategory[];
      const activeCats = categories.filter(cat => nodes.some(n => n.device.category === cat));
      const groupCount = activeCats.length;

      activeCats.forEach((cat, gIndex) => {
        const angle = (gIndex / groupCount) * Math.PI * 2 - Math.PI / 2;
        const inCat = nodes.filter(n => n.device.category === cat);

        if (inCat.length === 1) {
          inCat[0].tx = R_orbit * Math.cos(angle);
          inCat[0].ty = R_orbit * Math.sin(angle);
        } else if (inCat.length === 2) {
          // 2 thiết bị: Tách nhẹ theo cung với bán kính so le
          const halfSpan = 0.16;
          inCat[0].tx = (R_orbit * 0.92) * Math.cos(angle - halfSpan);
          inCat[0].ty = (R_orbit * 0.92) * Math.sin(angle - halfSpan);
          inCat[1].tx = (R_orbit * 1.16) * Math.cos(angle + halfSpan);
          inCat[1].ty = (R_orbit * 1.16) * Math.sin(angle + halfSpan);
        } else {
          // BIỆN PHÁP 3: TÁCH TẦNG ĐA BÁN KÍNH (CONCENTRIC TIERING)
          // Tầng Lõi (Core Tier, R * 0.78): 1-2 thiết bị đo trung tâm (nhiều kết nối nhất)
          // Tầng Vệ tinh (Satellite Tier, R * 1.25): Các mẫu vật & phụ kiện xòe rộng ra ngoài
          const sortedInCat = [...inCat].sort((a, b) => b.connections - a.connections);
          const coreCount = sortedInCat.length >= 6 ? 2 : 1;
          const coreNodes = sortedInCat.slice(0, coreCount);
          const satNodes = sortedInCat.slice(coreCount);

          if (coreNodes.length === 1) {
            coreNodes[0].tx = (R_orbit * 0.78) * Math.cos(angle);
            coreNodes[0].ty = (R_orbit * 0.78) * Math.sin(angle);
          } else {
            const coreSpan = 0.32;
            coreNodes.forEach((cn, cIdx) => {
              const ca = angle - coreSpan / 2 + (cIdx / (coreNodes.length - 1)) * coreSpan;
              cn.tx = (R_orbit * 0.78) * Math.cos(ca);
              cn.ty = (R_orbit * 0.78) * Math.sin(ca);
            });
          }

          const satSpan = Math.PI * 0.44; // Cung xòe rộng 79 độ
          satNodes.forEach((sn, sIdx) => {
            const sa = angle - satSpan / 2 + (sIdx / Math.max(1, satNodes.length - 1)) * satSpan;
            const satRadius = R_orbit * (1.20 + (sIdx % 2 === 0 ? 0.14 : -0.04));
            sn.tx = satRadius * Math.cos(sa);
            sn.ty = satRadius * Math.sin(sa);
          });
        }
      });

      // KHỬ TRÙNG LẶP & ĐÈ NHÃN CÂN BẰNG TỶ LỆ HỘP CHỮ NHẬT THỰC TẾ (AABB)
      for (let iter = 0; iter < 50; iter++) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = b.tx - a.tx;
            const dy = b.ty - a.ty;
            const rx = 105;
            const ry = 46;
            const nx = dx / rx;
            const ny = dy / ry;
            const d2 = nx * nx + ny * ny;
            if (d2 < 1 && d2 > 0.0001) {
              const d = Math.sqrt(d2);
              const overlap = (1 - d) * 0.5;
              const pushX = (nx / d) * overlap * rx;
              const pushY = (ny / d) * overlap * ry;
              b.tx += pushX;
              b.ty += pushY;
              a.tx -= pushX;
              a.ty -= pushY;
            }
          }
        }
      }
    } else {
      // BỐ CỤC ĐA TẦNG 6 GIAI ĐOẠN KHÔNG TRÙNG LẶP
      const layerRoles: Record<DeviceCategory, number> = {
        G10_FLUID_SUPPLY: 0,
        G07_ELECTRICITY:  0,
        G01_DIMENSION:    1,
        G02_MASS_FORCE:   2,
        G04_VOLUMETRIC:   2,
        G05_CHEM_HEATING: 3,
        G06_OPTICS:       4,
        G08_MECHANICS:    4,
        G03_TIME_TEMP:    5,
        G09_BIOLOGY:      5
      };

      const layers: NodeSimulationState[][] = [[], [], [], [], [], []];
      nodes.forEach(n => {
        const layerIdx = layerRoles[n.device.category] ?? 3;
        layers[layerIdx].push(n);
      });

      const totalW = Math.min(_width * 0.75, 820);
      const spacingX = totalW / 5;
      const totalH = Math.min(height * 0.70, 520);

      layers.forEach((layerNodes, lIdx) => {
        const lx = -totalW / 2 + lIdx * spacingX;
        const count = layerNodes.length;
        layerNodes.forEach((node, nIdx) => {
          const xStagger = (nIdx % 2 === 0 ? -12 : 12);
          node.tx = lx + xStagger;
          node.ty = -totalH / 2 + ((nIdx + 0.5) / (count || 1)) * totalH;
        });
      });
    }
  }, []);

  // Khởi tạo
  useEffect(() => {
    if (!isOpen) return;

    const countMap: Record<string, number> = {};
    NEURAL_SYNAPSE_EDGES.forEach(e => {
      countMap[e.source] = (countMap[e.source] || 0) + 1;
      countMap[e.target] = (countMap[e.target] || 0) + 1;
    });

    nodesRef.current = NEURAL_DEVICE_NODES.map(dev => {
      const deg = countMap[dev.id] || 0;
      return {
        device: dev,
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
        // Planetary Cosmos scaling: bán kính tỷ lệ với căn bậc 2 của số kết nối nhân quả
        radius: Math.min(28, 12.5 + Math.sqrt(deg) * 3.8),
        connections: deg
      };
    });

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const w = Math.round(rect.width) || canvasRef.current.parentElement?.clientWidth || window.innerWidth;
      const h = Math.round(rect.height) || canvasRef.current.parentElement?.clientHeight || window.innerHeight;
      canvasRef.current.width = w;
      canvasRef.current.height = h;

      computeTargetPositions(w, h, layoutMode);
      nodesRef.current.forEach(n => {
        n.x = n.tx;
        n.y = n.ty;
      });
    }
  }, [isOpen, layoutMode, computeTargetPositions]);

  // Xuất ảnh đồ thị PNG để chèn vào báo cáo thực hành
  const handleExportDiagramPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `openlab3d-so-do-thiet-bi-${Date.now()}.png`;
    a.click();
    audioFX.playSuccessChime();
  };

  // Render loop
  useEffect(() => {
    if (!isOpen || viewPresentation !== 'cosmos_canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // ĐỒNG BỘ ĐỘ PHÂN GIẢI CANVAS THEO KÍCH THƯỚC THỰC TẾ 1:1, TRIỆT TIÊU HIỆN TƯỢNG MÉO DẸT
      const rect = canvas.getBoundingClientRect();
      const curW = Math.round(rect.width);
      const curH = Math.round(rect.height);
      if (curW > 0 && curH > 0 && (canvas.width !== curW || canvas.height !== curH)) {
        canvas.width = curW;
        canvas.height = curH;
        computeTargetPositions(curW, curH, layoutMode);
      }

      const w = canvas.width;
      const h = canvas.height;
      const cam = cameraRef.current;

      nodesRef.current.forEach(n => {
        n.x += (n.tx - n.x) * (prefersReducedMotion ? 0.35 : 0.08);
        n.y += (n.ty - n.y) * (prefersReducedMotion ? 0.35 : 0.08);
      });

      const maxParticles =
        prefersReducedMotion || qualityMode === 'performance'
          ? 0
          : qualityMode === 'balanced'
          ? 160
          : 260;

      if (isFiringSignal && maxParticles > 0 && filteredEdges.length > 0) {
        if (particlesRef.current.length < maxParticles && Math.random() < 0.45) {
          const edge = filteredEdges[Math.floor(Math.random() * filteredEdges.length)];
          const srcNode = nodesRef.current.find(n => n.device.id === edge.source);
          const tgtNode = nodesRef.current.find(n => n.device.id === edge.target);
          if (srcNode && tgtNode) {
            let color = '#41D9F5'; // Planetary Cyan mặc định
            let flowDirection: 'outflow' | 'inflow' | 'bidirectional' = 'bidirectional';

            if (selectedNode) {
              if (edge.source === selectedNode.id) {
                color = '#4D8DFF'; // Dòng chảy ra (Axon): Planetary Blue
                flowDirection = 'outflow';
              } else if (edge.target === selectedNode.id) {
                color = '#9B83FF'; // Dòng chảy vào (Dendrite): Planetary Violet
                flowDirection = 'inflow';
              }
            } else {
              // Phân định dòng năng lượng theo nhóm chức năng
              if (['G07_ELECTRICITY', 'G06_OPTICS', 'G10_FLUID_SUPPLY'].includes(srcNode.device.category)) {
                color = '#4D8DFF';
                flowDirection = 'outflow';
              } else if (['G02_MASS_FORCE', 'G04_VOLUMETRIC', 'G03_TIME_TEMP'].includes(tgtNode.device.category)) {
                color = '#9B83FF';
                flowDirection = 'inflow';
              }
            }

            const burstCount = qualityMode === 'cinematic' ? 3 : 2;
            for (let sIdx = 0; sIdx < burstCount; sIdx++) {
              particlesRef.current.push({
                edge,
                sourceNode: srcNode,
                targetNode: tgtNode,
                progress: -sIdx * 0.08,
                speed: (0.35 + Math.random() * 0.3) * edge.signalSpeed,
                size: 1.4 + Math.random() * 0.7,
                color,
                flowDirection,
              });
            }
          }
        }
      } else if (maxParticles === 0 && particlesRef.current.length > 0) {
        particlesRef.current.length = 0;
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.progress += p.speed * dt;
        if (p.progress >= 1) particlesRef.current.splice(i, 1);
      }

      // ĐẢM BẢO NỀN PHÙ HỢP VỚI CHẾ ĐỘ NỀN TỐI (PLANETARY COSMOS) / SÁNG / TRONG SUỐT
      ctx.clearRect(0, 0, w, h);

      if (mapTheme === 'dark') {
        const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
        bgGrad.addColorStop(0, '#0B1930');
        bgGrad.addColorStop(0.55, '#071326');
        bgGrad.addColorStop(1, '#050B18');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
      } else if (mapTheme === 'light') {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);
      }

      const toScreen = (wx: number, wy: number) => ({
        x: (wx - cam.x) * cam.zoom + w / 2,
        y: (wy - cam.y) * cam.zoom + h / 2
      });

      ctx.save();
      const gridSize = 48 * cam.zoom;
      const offX = (-cam.x * cam.zoom + w / 2) % gridSize;
      const offY = (-cam.y * cam.zoom + h / 2) % gridSize;
      ctx.strokeStyle = mapTheme === 'light' ? 'rgba(77, 141, 255, 0.12)' : 'rgba(65, 217, 245, 0.045)';
      ctx.lineWidth = 1;
      for (let x = offX; x < w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = offY; y < h; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Vòng quỹ đạo đồng tâm Planetary Cosmos (Concentric Orbital Rings) khi ở chế độ Circular
      if (layoutMode === 'circular') {
        const centerPos = toScreen(0, 0);
        const maxR = Math.min((w - 160) * 0.38, (h - 80) * 0.44);
        const baseOrbit = Math.max(260, Math.min(380, maxR));
        const ringRadii = [baseOrbit * 0.78, baseOrbit * 1.0, baseOrbit * 1.24];

        ringRadii.forEach((rWorld, idx) => {
          ctx.beginPath();
          ctx.arc(centerPos.x, centerPos.y, rWorld * cam.zoom, 0, Math.PI * 2);
          ctx.strokeStyle =
            mapTheme === 'light'
              ? 'rgba(77, 141, 255, 0.18)'
              : idx === 1
              ? 'rgba(65, 217, 245, 0.14)'
              : 'rgba(155, 131, 255, 0.09)';
          ctx.lineWidth = idx === 1 ? 1.4 : 1;
          ctx.setLineDash(idx === 1 ? [] : [5, 7]);
          ctx.stroke();
        });
        ctx.setLineDash([]);
      }
      ctx.restore();

      // Vẽ khớp nối Synapse Planetary Cosmos
      filteredEdges.forEach(edge => {
        const src = nodesRef.current.find(n => n.device.id === edge.source);
        const tgt = nodesRef.current.find(n => n.device.id === edge.target);
        if (!src || !tgt) return;

        const sPos = toScreen(src.x, src.y);
        const tPos = toScreen(tgt.x, tgt.y);

        const isEdgeSelected = selectedEdge?.id === edge.id;
        const isEdgeHovered = hoveredEdge?.id === edge.id;

        let strokeColor = '#41D9F5'; // Planetary Cyan
        if (isEdgeSelected) {
          strokeColor = '#FACC15'; // Gold-Yellow cho Khớp nối đang soi
        } else if (isEdgeHovered) {
          strokeColor = '#38BDF8';
        } else if (selectedNode) {
          if (edge.source === selectedNode.id) {
            strokeColor = '#4D8DFF'; // Planetary Blue (Outgoing Axon)
          } else if (edge.target === selectedNode.id) {
            strokeColor = '#9B83FF'; // Planetary Violet (Incoming Dendrite)
          }
        }

        const meta = SYNAPSE_META[edge.type] || { color: strokeColor };

        const isHighlighted =
          isEdgeSelected ||
          isEdgeHovered ||
          (selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target)) ||
          (hoveredNode && (hoveredNode.id === edge.source || hoveredNode.id === edge.target)) ||
          (selectedExperiment && selectedExperiment.deviceIds.includes(edge.source) && selectedExperiment.deviceIds.includes(edge.target));

        ctx.save();
        ctx.beginPath();

        const midX = (sPos.x + tPos.x) / 2;
        const midY = (sPos.y + tPos.y) / 2;
        const dx = tPos.x - sPos.x;
        const dy = tPos.y - sPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const curvature = Math.min(dist * 0.12, 32);
        const cx = midX - (dy / dist) * curvature;
        const cy = midY + (dx / dist) * curvature;

        ctx.moveTo(sPos.x, sPos.y);
        ctx.quadraticCurveTo(cx, cy, tPos.x, tPos.y);

        if (meta.dash && !isEdgeSelected) ctx.setLineDash(meta.dash);

        if (isEdgeSelected) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 3.8 * cam.zoom;
          if (qualityMode !== 'performance') {
            ctx.shadowColor = '#FACC15';
            ctx.shadowBlur = 16;
          }
          ctx.globalAlpha = 1.0;
        } else if (isHighlighted) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = (isEdgeHovered ? 3.1 : 2.4) * cam.zoom;
          if (qualityMode !== 'performance') {
            ctx.shadowColor = strokeColor;
            ctx.shadowBlur = qualityMode === 'cinematic' ? 14 : 9;
          }
          ctx.globalAlpha = 1.0;
        } else {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.2 * cam.zoom;
          if (qualityMode === 'cinematic') {
            ctx.shadowColor = strokeColor;
            ctx.shadowBlur = 4;
          }
          ctx.globalAlpha = selectedNode || selectedExperiment || selectedEdge ? 0.12 : 0.36;
        }
        ctx.stroke();

        // Mũi tên nhỏ tinh tế
        const t = 0.65;
        const ax = (1 - t) * (1 - t) * sPos.x + 2 * (1 - t) * t * cx + t * t * tPos.x;
        const ay = (1 - t) * (1 - t) * sPos.y + 2 * (1 - t) * t * cy + t * t * tPos.y;
        const nextT = t + 0.02;
        const nax = (1 - nextT) * (1 - nextT) * sPos.x + 2 * (1 - nextT) * nextT * cx + nextT * nextT * tPos.x;
        const nay = (1 - nextT) * (1 - nextT) * sPos.y + 2 * (1 - nextT) * nextT * cy + nextT * nextT * tPos.y;
        const adx = nax - ax;
        const ady = nay - ay;
        const adist = Math.sqrt(adx * adx + ady * ady) || 1;
        const arrowL = (isEdgeSelected ? 7.2 : 5.8) * cam.zoom;

        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(ax + (adx / adist) * arrowL, ay + (ady / adist) * arrowL);
        ctx.lineTo(ax - (ady / adist) * (arrowL * 0.6) - (adx / adist) * arrowL, ay + (adx / adist) * (arrowL * 0.6) - (ady / adist) * arrowL);
        ctx.lineTo(ax + (ady / adist) * (arrowL * 0.6) - (adx / adist) * arrowL, ay - (adx / adist) * (arrowL * 0.6) - (ady / adist) * arrowL);
        ctx.closePath();
        ctx.fillStyle = strokeColor;
        if (qualityMode !== 'performance') {
          ctx.shadowColor = strokeColor;
          ctx.shadowBlur = 6;
        }
        ctx.fill();

        // Nhãn tóm tắt Mối liên kết tại trung điểm đường cong khi chọn hoặc rê chuột
        if ((isEdgeSelected || isEdgeHovered) && cam.zoom > 0.4) {
          const mt = 0.5;
          const mxCurve = (1 - mt) * (1 - mt) * sPos.x + 2 * (1 - mt) * mt * cx + mt * mt * tPos.x;
          const myCurve = (1 - mt) * (1 - mt) * sPos.y + 2 * (1 - mt) * mt * cy + mt * mt * tPos.y;
          const lawInfo = PHYSICAL_LAW_MAPPINGS[edge.type];
          const pillLabel = lawInfo ? `${meta.studentName}` : edge.id;
          ctx.font = `700 ${Math.max(10, 10.5 * cam.zoom)}px system-ui, -apple-system, sans-serif`;
          const tw = ctx.measureText(pillLabel).width;
          const pw = tw + 14 * cam.zoom;
          const ph = 18 * cam.zoom;
          ctx.fillStyle = isEdgeSelected ? 'rgba(15, 23, 42, 0.96)' : 'rgba(7, 19, 38, 0.9)';
          ctx.strokeStyle = isEdgeSelected ? '#FACC15' : '#38BDF8';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(mxCurve - pw / 2, myCurve - ph / 2, pw, ph, 6);
          } else {
            ctx.rect(mxCurve - pw / 2, myCurve - ph / 2, pw, ph);
          }
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = isEdgeSelected ? '#FDE047' : '#7DD3FC';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(pillLabel, mxCurve, myCurve);
        }

        ctx.restore();
      });

      // Vẽ hạt photon phát sáng trên quỹ đạo
      particlesRef.current.forEach(p => {
        const s = toScreen(p.sourceNode.x, p.sourceNode.y);
        const t = toScreen(p.targetNode.x, p.targetNode.y);
        const midX = (s.x + t.x) / 2;
        const midY = (s.y + t.y) / 2;
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const curvature = Math.min(dist * 0.12, 32);
        const cx = midX - (dy / dist) * curvature;
        const cy = midY + (dx / dist) * curvature;

        if (p.progress < 0 || p.progress > 1) return;

        let pr = p.progress;
        if (p.flowDirection === 'inflow') {
          pr = 1 - p.progress;
        } else if (p.flowDirection === 'bidirectional') {
          pr = 0.5 + 0.48 * Math.sin(p.progress * Math.PI * 2);
        }

        const px = (1 - pr) * (1 - pr) * s.x + 2 * (1 - pr) * pr * cx + pr * pr * t.x;
        const py = (1 - pr) * (1 - pr) * s.y + 2 * (1 - pr) * pr * cy + pr * pr * t.y;

        const alpha = Math.sin(p.progress * Math.PI);
        ctx.save();
        ctx.globalAlpha = Math.max(0.18, alpha);
        ctx.beginPath();
        ctx.arc(px, py, (p.size || 1.4) * cam.zoom, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        if (qualityMode !== 'performance') {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.restore();
      });

      // Vẽ Node Hành Tinh (Planetary Device Nodes)
      nodesRef.current.forEach(n => {
        if (!filteredNodeIds.has(n.device.id)) return;

        const pos = toScreen(n.x, n.y);
        const meta = CATEGORY_META[n.device.category];
        const r = n.radius * cam.zoom;

        const isSelected = selectedNode?.id === n.device.id;
        const isHovered = hoveredNode?.id === n.device.id;
        const isInActiveScene = activeSceneDeviceIds.includes(n.device.id);

        let isInCurrentExperiment = false;
        if (selectedExperiment) {
          isInCurrentExperiment = selectedExperiment.deviceIds.includes(n.device.id);
        }

        let alpha = 1.0;
        if (selectedNode) {
          const isRelated =
            isSelected ||
            filteredEdges.some(e =>
              (e.source === selectedNode.id && e.target === n.device.id) ||
              (e.target === selectedNode.id && e.source === n.device.id)
            );
          if (!isRelated) alpha = 0.14;
        } else if (selectedExperiment && !isInCurrentExperiment) {
          alpha = 0.14;
        }

        ctx.save();
        ctx.globalAlpha = alpha;

        // Vành đai hành tinh (Planetary Ring) cho node đang chọn, hover, hoặc có bậc liên kết cao
        if (isSelected || isHovered || isInActiveScene || isInCurrentExperiment || n.connections >= 4) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r + (isSelected || isHovered ? 9 : 5.5) * cam.zoom, 0, Math.PI * 2);
          const ringColor = isInActiveScene
            ? '#48D6A0'
            : isInCurrentExperiment
            ? '#FFB85C'
            : isSelected
            ? '#41D9F5'
            : meta.color;
          ctx.strokeStyle = ringColor;
          ctx.lineWidth = isSelected || isHovered ? 2.4 : 1.3;
          if (qualityMode !== 'performance' && (isSelected || isHovered || isInActiveScene)) {
            ctx.shadowColor = ringColor;
            ctx.shadowBlur = 16;
          }
          ctx.stroke();
        }

        const grad = ctx.createRadialGradient(
          pos.x - r * 0.3,
          pos.y - r * 0.3,
          0,
          pos.x,
          pos.y,
          r
        );
        grad.addColorStop(0, meta.color);
        grad.addColorStop(0.7, meta.color + 'bb');
        grad.addColorStop(1, '#071326');

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        if (qualityMode !== 'performance') {
          ctx.shadowColor = meta.color;
          ctx.shadowBlur = isSelected ? 22 : 6;
        }
        ctx.fill();

        // Biểu tượng Glyph
        if (cam.zoom > 0.45) {
          ctx.font = `${Math.max(12, 13 * cam.zoom)}px system-ui, "Apple Color Emoji", "Segoe UI Emoji"`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(n.device.glyphIcon, pos.x, pos.y);
        }

        // Nhãn tên dạng thẻ bo góc cao cấp
        if (cam.zoom > 0.35) {
          ctx.font = `600 ${Math.max(10, 11 * cam.zoom)}px system-ui, -apple-system, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const isExpanded = isSelected || isHovered || isInCurrentExperiment;
          const label = isExpanded
            ? (userMode === 'student' ? n.device.nameStudent : n.device.nameVi)
            : (n.device.shortKeyword || (userMode === 'student' ? n.device.nameStudent : n.device.nameVi));

          const labelWidth = ctx.measureText(label).width;
          const padH = 6 * cam.zoom;
          const bw = labelWidth + padH * 2;
          const bh = Math.max(16, 18 * cam.zoom);

          let bx = pos.x - bw / 2;
          let by = pos.y + r + 5 * cam.zoom;

          if (layoutMode === 'circular') {
            const len = Math.hypot(n.x, n.y) || 1;
            const ux = n.x / len;
            const uy = n.y / len;

            if (uy < -0.42) {
              by = pos.y - r - bh - 5 * cam.zoom;
              bx = pos.x - bw / 2 + ux * 10 * cam.zoom;
            } else if (uy > 0.42) {
              by = pos.y + r + 5 * cam.zoom;
              bx = pos.x - bw / 2 + ux * 10 * cam.zoom;
            } else if (ux > 0) {
              bx = pos.x + r + 7 * cam.zoom;
              by = pos.y - bh / 2 + uy * 8 * cam.zoom;
            } else {
              bx = pos.x - r - bw - 7 * cam.zoom;
              by = pos.y - bh / 2 + uy * 8 * cam.zoom;
            }
          } else {
            const isStaggerAbove = (n.device.id.charCodeAt(0) % 2 === 0);
            if (isStaggerAbove) {
              by = pos.y - r - bh - 5 * cam.zoom;
            } else {
              by = pos.y + r + 5 * cam.zoom;
            }
          }

          if (mapTheme === 'light') {
            ctx.fillStyle = isSelected ? 'rgba(255, 255, 255, 0.98)' : isHovered ? 'rgba(241, 245, 249, 0.98)' : 'rgba(255, 255, 255, 0.92)';
            ctx.strokeStyle = isSelected ? meta.color : isHovered ? '#1e293b' : (isInCurrentExperiment ? '#d97706' : 'rgba(148, 163, 184, 0.7)');
            ctx.lineWidth = isSelected || isHovered || isInCurrentExperiment ? 1.8 : 1.2;
          } else {
            ctx.fillStyle = isSelected ? 'rgba(16, 34, 61, 0.96)' : isHovered ? 'rgba(11, 25, 48, 0.94)' : 'rgba(5, 11, 24, 0.90)';
            ctx.strokeStyle = isSelected ? '#41D9F5' : isHovered ? '#E8F2FF' : (isInCurrentExperiment ? '#FFB85C' : 'rgba(130, 180, 230, 0.28)');
            ctx.lineWidth = isSelected || isHovered || isInCurrentExperiment ? 1.5 : 1;
          }
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(bx, by, bw, bh, 5);
          } else {
            ctx.rect(bx, by, bw, bh);
          }
          ctx.fill();
          ctx.stroke();

          if (mapTheme === 'light') {
            ctx.fillStyle = isSelected ? meta.color : isHovered ? '#0f172a' : isInCurrentExperiment ? '#b45309' : '#1e293b';
          } else {
            ctx.fillStyle = isSelected || isHovered ? '#E8F2FF' : isInCurrentExperiment ? '#FFE0A3' : '#A8BCD5';
          }
          ctx.fillText(label, bx + bw / 2, by + bh / 2);
        }

        ctx.restore();
      });

      // Luôn cập nhật vị trí dây dẫn hướng neo động theo thời gian thực (60 FPS)
      if (selectedEdgeRef.current) {
        syncLeaderLine();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isOpen, viewPresentation, qualityMode, layoutMode, filteredEdges, filteredNodeIds, selectedNode, hoveredNode, selectedEdge, hoveredEdge, selectedExperiment, activeSceneDeviceIds, isFiringSignal, userMode, mapTheme, syncLeaderLine]);

  // Căn giữa camera mượt mà
  const handleResetCamera = () => {
    cameraRef.current = { x: 0, y: 0, zoom: 1 };
    setSelectedNode(null);
    setSelectedEdge(null);
    selectedEdgeRef.current = null;
    setEdgePopupPos(null);
    edgePopupPosRef.current = null;
    setSelectedExperiment(null);
    setChallengeFeedback(null);
    setShowDetailDrawer(false);
    audioFX.stopSpeech();
    if (canvasRef.current) {
      computeTargetPositions(canvasRef.current.width, canvasRef.current.height, layoutMode);
    }
  };

  // Xử lý chuột & chạm cảm ứng (kèm đúp chuột để reset)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const now = performance.now();
    if (now - lastClickTimeRef.current < 280) {
      handleResetCamera();
      lastClickTimeRef.current = 0;
      return;
    }
    lastClickTimeRef.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const cam = cameraRef.current;
    const wx = (mx - canvas.width / 2) / cam.zoom + cam.x;
    const wy = (my - canvas.height / 2) / cam.zoom + cam.y;

    const clicked = nodesRef.current.find(n => {
      if (!filteredNodeIds.has(n.device.id)) return false;
      const dx = n.x - wx;
      const dy = n.y - wy;
      return dx * dx + dy * dy <= (n.radius + 8) * (n.radius + 8);
    });

    if (clicked) {
      dragCandidateRef.current = {
        node: clicked.device,
        startX: e.clientX,
        startY: e.clientY,
      };
      edgeClickCandidateRef.current = null;
      isNodeDragActiveRef.current = false;
    } else {
      const clickedEdge = findEdgeAtScreenPoint(mx, my, canvas.width, canvas.height);
      edgeClickCandidateRef.current = clickedEdge
        ? { edge: clickedEdge, startX: e.clientX, startY: e.clientY }
        : null;
      dragCandidateRef.current = null;
      isNodeDragActiveRef.current = false;
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      cameraStartRef.current = { x: cam.x, y: cam.y };
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      cameraRef.current.x = cameraStartRef.current.x - dx / cameraRef.current.zoom;
      cameraRef.current.y = cameraStartRef.current.y - dy / cameraRef.current.zoom;
      // Cập nhật lại dây dẫn hướng theo camera khi đang pan
      if (selectedEdgeRef.current) {
        syncLeaderLine();
      }
      return;
    }

    if (isDraggingToScene) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const cam = cameraRef.current;
    const wx = (mx - canvas.width / 2) / cam.zoom + cam.x;
    const wy = (my - canvas.height / 2) / cam.zoom + cam.y;

    const hov = nodesRef.current.find(n => {
      if (!filteredNodeIds.has(n.device.id)) return false;
      const dx = n.x - wx;
      const dy = n.y - wy;
      return dx * dx + dy * dy <= (n.radius + 8) * (n.radius + 8);
    });

    setHoveredNode(hov ? hov.device : null);
    if (!hov) {
      const hovEdge = findEdgeAtScreenPoint(mx, my, canvas.width, canvas.height);
      setHoveredEdge(hovEdge);
      canvas.style.cursor = hovEdge ? 'pointer' : isDraggingRef.current ? 'grabbing' : 'grab';
    } else {
      setHoveredEdge(null);
      canvas.style.cursor = 'pointer';
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Lắng nghe sự kiện kéo thả toàn cục để biến hình nơ-ron thành thiết bị 3D
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!dragCandidateRef.current) return;

      const dist = Math.hypot(
        e.clientX - dragCandidateRef.current.startX,
        e.clientY - dragCandidateRef.current.startY,
      );

      if (!isNodeDragActiveRef.current && dist > 8) {
        isNodeDragActiveRef.current = true;
        setIsDraggingToScene(true);
        setDraggedNode(dragCandidateRef.current.node);
        setDragStartPos({ x: dragCandidateRef.current.startX, y: dragCandidateRef.current.startY });
        setDragCurrentPos({ x: e.clientX, y: e.clientY });
        audioFX.playNodeClick();
        window.dispatchEvent(
          new CustomEvent('openlab:neural-drag-preview', {
            detail: {
              assetId: dragCandidateRef.current.node.assetId,
              nodeId: dragCandidateRef.current.node.id,
              clientX: e.clientX,
              clientY: e.clientY,
              isDragging: true,
            },
          }),
        );
      } else if (isNodeDragActiveRef.current) {
        setDragCurrentPos({ x: e.clientX, y: e.clientY });
        window.dispatchEvent(
          new CustomEvent('openlab:neural-drag-preview', {
            detail: {
              assetId: dragCandidateRef.current.node.assetId,
              nodeId: dragCandidateRef.current.node.id,
              clientX: e.clientX,
              clientY: e.clientY,
              isDragging: true,
            },
          }),
        );
      }
    };

    const handleWindowPointerUp = (e: PointerEvent) => {
      if (isNodeDragActiveRef.current && dragCandidateRef.current) {
        const candidate = dragCandidateRef.current.node;
        // Bắn sự kiện thả thiết bị vào không gian 3D
        window.dispatchEvent(
          new CustomEvent('openlab:neural-drag-drop', {
            detail: {
              assetId: candidate.assetId,
              nodeId: candidate.id,
              clientX: e.clientX,
              clientY: e.clientY,
            },
          }),
        );
        window.dispatchEvent(
          new CustomEvent('openlab:neural-drag-preview', {
            detail: {
              assetId: candidate.assetId,
              nodeId: candidate.id,
              clientX: e.clientX,
              clientY: e.clientY,
              isDragging: false,
            },
          }),
        );
        audioFX.playSuccessChime();
        setIsDraggingToScene(false);
        setDraggedNode(null);
        isNodeDragActiveRef.current = false;
        dragCandidateRef.current = null;
        onClose();
        return;
      }

      if (dragCandidateRef.current && !isNodeDragActiveRef.current) {
        // Chỉ là click chọn nút đơn thuần
        const candidate = dragCandidateRef.current.node;
        dragCandidateRef.current = null;
        isNodeDragActiveRef.current = false;
        audioFX.playNodeClick();
        if (challengeMode && selectedNode && selectedNode.id !== candidate.id) {
          const isConnected = NEURAL_SYNAPSE_EDGES.some(
            (edge) =>
              (edge.source === selectedNode.id && edge.target === candidate.id) ||
              (edge.target === selectedNode.id && edge.source === candidate.id),
          );
          if (isConnected) {
            setChallengeScore((s) => s + 10);
            setChallengeFeedback(
              `🎉 CHÍNH XÁC! ${selectedNode.nameStudent} kết nối chuẩn với ${candidate.nameStudent}! (+10 điểm)`,
            );
            audioFX.playSuccessChime();
          } else {
            setChallengeFeedback(
              `❌ Chưa đúng rồi! ${selectedNode.nameStudent} và ${candidate.nameStudent} không trực tiếp ghép nối.`,
            );
            audioFX.playErrorBuzz();
          }
        }
        setSelectedNode((prev) => {
          const next = prev?.id === candidate.id ? null : candidate;
          setSelectedEdge(null);
          selectedEdgeRef.current = null;
          setEdgePopupPos(null);
          edgePopupPosRef.current = null;
          // Không tự động mở Sidebar to; chỉ khi học sinh bấm nút [📋 Chi tiết] trên huy hiệu nổi thì mới mở
          return next;
        });
      } else if (edgeClickCandidateRef.current) {
        const edgeCand = edgeClickCandidateRef.current;
        edgeClickCandidateRef.current = null;
        const moveDist = Math.hypot(
          e.clientX - edgeCand.startX,
          e.clientY - edgeCand.startY,
        );
        if (moveDist <= 6) {
          selectSynapseEdge(edgeCand.edge);
        }
      }

      isDraggingRef.current = false;
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
    };
  }, [isOpen, challengeMode, selectedNode, onClose, selectSynapseEdge]);

  // Nhấn phím Escape để hủy kéo thả, đóng hộp chú thích hoặc thoát modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDraggingToScene) {
          window.dispatchEvent(
            new CustomEvent('openlab:neural-drag-preview', {
              detail: { isDragging: false },
            }),
          );
          setIsDraggingToScene(false);
          setDraggedNode(null);
          isNodeDragActiveRef.current = false;
          dragCandidateRef.current = null;
        } else if (selectedEdgeRef.current) {
          selectedEdgeRef.current = null;
          setSelectedEdge(null);
          setEdgePopupPos(null);
          edgePopupPosRef.current = null;
          audioFX.stopSpeech();
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDraggingToScene, isOpen, onClose]);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    cameraRef.current.zoom = Math.max(0.2, Math.min(3.5, cameraRef.current.zoom * factor));
    if (selectedEdgeRef.current) {
      syncLeaderLine();
    }
  };

  const handleZoomIn = () => {
    cameraRef.current.zoom = Math.min(3.5, cameraRef.current.zoom * 1.2);
    audioFX.playNodeClick();
    if (selectedEdgeRef.current) {
      syncLeaderLine();
    }
  };

  const handleZoomOut = () => {
    cameraRef.current.zoom = Math.max(0.2, cameraRef.current.zoom / 1.2);
    audioFX.playNodeClick();
    if (selectedEdgeRef.current) {
      syncLeaderLine();
    }
  };

  const handleToggleFullScreen = () => {
    setIsFullScreen((prev) => {
      const next = !prev;
      if (next) {
        if (
          typeof document !== 'undefined' &&
          !document.fullscreenElement &&
          modalContainerRef.current?.requestFullscreen
        ) {
          modalContainerRef.current.requestFullscreen().catch(() => {});
        }
      } else {
        if (typeof document !== 'undefined' && document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
      return next;
    });
    audioFX.playNodeClick();
  };

  useEffect(() => {
    const onFullScreenChange = () => {
      if (typeof document !== 'undefined' && !document.fullscreenElement) {
        // Keep state synced when exiting browser native fullscreen via Esc
      }
    };
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    handleResetCamera();
  };

  const selectedNodeDetails = useMemo(() => {
    if (!selectedNode) return null;
    const outgoing = NEURAL_SYNAPSE_EDGES.filter(e => e.source === selectedNode.id);
    const incoming = NEURAL_SYNAPSE_EDGES.filter(e => e.target === selectedNode.id);
    return { outgoing, incoming };
  }, [selectedNode]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isDraggingToScene || mapTheme === 'transparent'
          ? 'bg-transparent backdrop-blur-none'
          : isFullScreen
            ? 'bg-[#050B18] p-0'
            : 'bg-[#050B18]/75 backdrop-blur-sm'
      } ${
        isDraggingToScene
          ? 'pointer-events-none'
          : isFullScreen
            ? 'p-0'
            : 'p-3 md:p-6'
      } animate-in fade-in duration-200`}
    >
      <div
        ref={modalContainerRef}
        className={`relative flex flex-col overflow-hidden text-[#E8F2FF] transition-all duration-300 ${
          isFullScreen
            ? 'w-screen h-screen max-w-none rounded-none border-0'
            : 'w-[95vw] h-[88vh] max-w-6xl rounded-2xl border border-[#41D9F5]/35'
        } ${
          isDraggingToScene
            ? 'opacity-0 scale-[0.98] pointer-events-none'
            : mapTheme === 'transparent'
              ? 'bg-transparent backdrop-blur-none shadow-none'
              : 'bg-[#071326]/92 backdrop-blur-2xl shadow-[0_24px_70px_rgba(2,8,23,0.75)]'
        }`}
      >
        {/* HEADER BAR — PLANETARY COSMOS COMMAND DECK */}
        <div className="flex items-center justify-between gap-2 px-3 md:px-4 py-2 shrink-0 border-b border-[rgba(130,180,230,0.18)] bg-[#050B18]/90 backdrop-blur-xl">
          {/* CỤM TIÊU ĐỀ TRÁI VÀ NÚT MỞ BÀI HỌC */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#41D9F5]/20 via-[#4D8DFF]/20 to-[#9B83FF]/25 border border-[#41D9F5]/45 flex items-center justify-center text-sm shadow-sm shrink-0">
              🪐
            </div>
            <div className="min-w-0 flex items-center gap-2">
              <h2 className="text-xs md:text-sm font-bold text-[#E8F2FF] tracking-wide truncate">
                MẠNG NƠ-RON THIẾT BỊ KHTN
              </h2>
              <span className="hidden xl:inline-block text-[9.5px] px-1.5 py-0.5 rounded-full bg-[#48D6A0]/15 border border-[#48D6A0]/40 text-[#48D6A0] font-semibold shrink-0">
                GDPT 2018
              </span>
            </div>

            {/* NÚT MỞ BẢNG ĐIỀU HƯỚNG BÀI HỌC KHI ĐANG THU GỌN */}
            {!isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-[#10223D] hover:bg-[#163056] border border-[#41D9F5]/40 text-[#E8F2FF] text-[11px] font-semibold shadow-xs flex items-center gap-1 transition-all cursor-pointer shrink-0 ml-1"
                title="Mở danh sách bài thực hành SGK"
              >
                <span>📂</span>
                <span className="hidden sm:inline">Bài học</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#4D8DFF]/30 text-[#41D9F5]">
                  {filteredExperiments.length}
                </span>
              </button>
            )}
          </div>

          {/* CỤM ĐIỀU KHIỂN TINH GỌN BÊN PHẢI */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            {/* 1. CHUYỂN ĐỔI BẢN ĐỒ / DANH SÁCH */}
            <div
              className="flex rounded-lg bg-[#0B1930] p-0.5 border border-[rgba(130,180,230,0.2)] text-[11px]"
              role="tablist"
              aria-label="Chế độ hiển thị mạng thiết bị"
            >
              <button
                type="button"
                role="tab"
                aria-selected={viewPresentation === 'cosmos_canvas'}
                onClick={() => setViewPresentation('cosmos_canvas')}
                className={`px-2 py-0.5 rounded-md font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  viewPresentation === 'cosmos_canvas'
                    ? 'bg-[#4D8DFF] text-white shadow-xs font-semibold'
                    : 'text-[#A8BCD5] hover:text-white'
                }`}
                title="Hiển thị Bản đồ Hệ Hành Tinh tương tác (Canvas 2D)"
              >
                <span>🌌</span>
                <span className="hidden sm:inline">Bản đồ</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewPresentation === 'accessible_table'}
                onClick={() => setViewPresentation('accessible_table')}
                className={`px-2 py-0.5 rounded-md font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  viewPresentation === 'accessible_table'
                    ? 'bg-[#4D8DFF] text-white shadow-xs font-semibold'
                    : 'text-[#A8BCD5] hover:text-white'
                }`}
                title="Chế độ Danh sách Bảng hỗ trợ bàn phím & tra cứu"
              >
                <span>📋</span>
                <span className="hidden sm:inline">Danh sách</span>
              </button>
            </div>

            {/* 2. BỘ LỌC KHỐI LỚP (DẠNG SELECT NHỎ GỌN) */}
            <div className="flex items-center rounded-lg bg-[#0B1930] border border-[rgba(130,180,230,0.2)] px-2 py-0.5 text-[11px]">
              <span className="text-[#A8BCD5] mr-1 text-[10.5px] hidden md:inline">Lớp:</span>
              <select
                aria-label="Chọn khối lớp"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as any)}
                className="bg-transparent text-[#E8F2FF] text-[11px] font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#0B1930] text-[#E8F2FF]">Tất cả lớp</option>
                <option value="grade6" className="bg-[#0B1930] text-[#E8F2FF]">Lớp 6</option>
                <option value="grade7" className="bg-[#0B1930] text-[#E8F2FF]">Lớp 7</option>
                <option value="grade8" className="bg-[#0B1930] text-[#E8F2FF]">Lớp 8</option>
                <option value="grade9" className="bg-[#0B1930] text-[#E8F2FF]">Lớp 9</option>
              </select>
            </div>

            {/* 3. DUAL-MODE HỌC SINH / CHUYÊN GIA (TOGGLE 1-CLICK) */}
            <button
              type="button"
              onClick={() => setUserMode(prev => (prev === 'student' ? 'expert' : 'student'))}
              className={`px-2 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                userMode === 'student'
                  ? 'bg-[#48D6A0]/20 border-[#48D6A0]/50 text-[#48D6A0]'
                  : 'bg-[#9B83FF]/20 border-[#9B83FF]/50 text-[#C4B5FD]'
              }`}
              title={`Đang ở chế độ ${userMode === 'student' ? 'Học sinh (đơn giản, dễ hiểu)' : 'Chuyên gia (đầy đủ thuật ngữ, thông số)'}. Nhấp để chuyển đổi.`}
            >
              <span>{userMode === 'student' ? '🎒' : '🔬'}</span>
              <span className="hidden md:inline">{userMode === 'student' ? 'Học sinh' : 'Chuyên gia'}</span>
            </button>

            {/* 4. MINI GAME THỬ THÁCH NỐI MẠCH */}
            <button
              type="button"
              onClick={() => {
                setChallengeMode(prev => !prev);
                setChallengeFeedback(null);
              }}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all flex items-center gap-1 cursor-pointer ${
                challengeMode
                  ? 'bg-[#FFB85C]/20 border-[#FFB85C] text-[#FFB85C] shadow-xs'
                  : 'bg-[#0B1930] border-[rgba(130,180,230,0.2)] text-[#A8BCD5] hover:text-white'
              }`}
              title="Chế độ trò chơi thử thách kiến thức liên kết thiết bị"
            >
              <span>🎮</span>
              <span className="hidden md:inline">{challengeMode ? `${challengeScore}đ` : 'Thử thách'}</span>
            </button>

            {/* 5. NÚT PHÓNG TO TOÀN MÀN HÌNH / THU NHỎ (ICON NHỎ) */}
            <button
              type="button"
              onClick={handleToggleFullScreen}
              aria-label={isFullScreen ? 'Thu nhỏ bản đồ lại' : 'Phóng to bản đồ toàn màn hình'}
              title={isFullScreen ? 'Thu nhỏ bản đồ về khung cửa sổ' : 'Phóng to bản đồ toàn màn hình'}
              className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center border transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                isFullScreen
                  ? 'bg-[#41D9F5]/20 border-[#41D9F5] text-[#41D9F5] shadow-xs'
                  : 'bg-[#10223D] hover:bg-[#163056] border-[#41D9F5]/45 text-[#E8F2FF]'
              }`}
            >
              <span>{isFullScreen ? '🗗' : '⛶'}</span>
            </button>

            {/* 6. NÚT ĐÓNG MẠNG LƯỚI TINH GỌN */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng hệ thống mạng lưới thiết bị"
              title="Đóng sơ đồ mạng lưới để quay lại bàn thí nghiệm 3D (Phím Esc)"
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 border border-rose-400 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <span className="text-xs leading-none">✕</span>
              <span>Đóng</span>
            </button>
          </div>
        </div>

        {/* WORKSPACE BODY */}
        <div className="relative flex-1 flex overflow-hidden">
          {/* THANH ĐIỀU HƯỚNG TRÁI: DANH SÁCH BÀI THỰC HÀNH SGK */}
          <div
            className={`transition-all duration-300 border-r border-[rgba(130,180,230,0.18)] bg-[#050B18]/75 backdrop-blur-2xl flex flex-col p-3.5 gap-3 overflow-y-auto ${
              isSidebarOpen ? 'w-[275px] flex-shrink-0' : 'w-0 p-0 overflow-hidden border-none opacity-0 pointer-events-none'
            }`}
          >
            {/* Tiêu đề thanh trái & Nút thu gọn */}
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(130,180,230,0.15)]">
              <span className="text-[11px] font-bold text-[#41D9F5] uppercase tracking-wider flex items-center gap-1.5">
                <span>🪐</span>
                <span>Chòm Sao Bài Học SGK</span>
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-[10px] text-[#A8BCD5] hover:text-white px-2 py-0.5 rounded-lg bg-[#0B1930] border border-[rgba(130,180,230,0.2)] hover:bg-[#10223D] flex items-center gap-1 transition-all cursor-pointer"
                title="Thu gọn bảng để mở rộng sơ đồ"
              >
                <span>◀ Thu gọn</span>
              </button>
            </div>

            {/* Thanh tìm kiếm */}
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Tìm bài hoặc dụng cụ..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-[#0B1930] border border-[rgba(130,180,230,0.22)] text-[#E8F2FF] placeholder-[#6E86A6] focus:outline-none focus:border-[#41D9F5]"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8BCD5] hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Danh sách bài thực hành SGK */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8BCD5]">
                  Danh Mục Bài Học ({filteredExperiments.length})
                </span>
                {selectedExperiment && (
                  <button
                    onClick={() => setSelectedExperiment(null)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                  >
                    Bỏ chọn
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                {filteredExperiments.map(cluster => {
                  const isActive = selectedExperiment?.id === cluster.id;
                  return (
                    <div
                      key={cluster.id}
                      onClick={() => {
                        if (isActive) {
                          setSelectedExperiment(null);
                        } else {
                          setSelectedExperiment(cluster);
                          setSelectedNode(null);
                          audioFX.playNodeClick();
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isActive
                          ? 'bg-[#10223D] border-[#41D9F5] shadow-[0_0_15px_rgba(65,217,245,0.2)] text-[#E8F2FF]'
                          : 'bg-[#0B1930]/75 border-[rgba(130,180,230,0.16)] hover:bg-[#10223D]/70 hover:border-[#41D9F5]/40 text-[#A8BCD5]'
                      }`}
                    >
                      <div className="font-semibold text-[11.5px] leading-snug text-[#E8F2FF]">
                        {cluster.title}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-[#4D8DFF]/20 border border-[#4D8DFF]/40 text-[#41D9F5] font-medium">
                          {cluster.grade}
                        </span>
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-[#050B18]/70 text-[#A8BCD5]">
                          {cluster.subject}
                        </span>
                        <span className="text-[9.5px] text-[#6E86A6] ml-auto font-mono">
                          {cluster.deviceIds.length} dụng cụ
                        </span>
                      </div>
                      {isActive && onTriggerMacroCluster && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            audioFX.playSuccessChime();
                            onTriggerMacroCluster(cluster);
                          }}
                          className="mt-2.5 w-full py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-[#059669] to-[#10B981] hover:brightness-110 text-white font-extrabold text-[10.5px] shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>⚡</span>
                          <span>Đưa trọn cụm ra Bàn 3D ({cluster.deviceIds.length} thiết bị)</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* KHU VỰC TRUNG TÂM: BẢN ĐỒ VŨ TRỤ 2D HOẶC CHẾ ĐỘ DANH SÁCH TRỢ NĂNG */}
          <div className="relative flex-1 bg-transparent overflow-hidden">
            {viewPresentation === 'accessible_table' ? (
              <div
                className="w-full h-full overflow-y-auto p-4 md:p-6 bg-[#050B18]/90 text-[#E8F2FF]"
                role="region"
                aria-label="Danh sách thiết bị và liên kết nhân quả"
              >
                <div className="max-w-5xl mx-auto space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[rgba(130,180,230,0.18)]">
                    <div>
                      <h3 className="text-sm font-bold text-[#E8F2FF]">
                        📋 Bảng Tra Cứu Hệ Hành Tinh Thiết Bị ({filteredNodes.length} thiết bị)
                      </h3>
                      <p className="text-xs text-[#A8BCD5]">
                        Hỗ trợ điều hướng bằng bàn phím (Tab / Enter) — Nhấp chọn thiết bị để xem chi tiết hoặc đưa thẳng vào bàn 3D.
                      </p>
                    </div>
                    <input
                      type="text"
                      placeholder="🔍 Lọc nhanh tên dụng cụ, mã thiết bị..."
                      value={searchKeyword}
                      onChange={e => setSearchKeyword(e.target.value)}
                      className="w-64 px-3 py-1.5 text-xs rounded-xl bg-[#0B1930] border border-[rgba(130,180,230,0.28)] text-[#E8F2FF] placeholder-[#6E86A6] focus:outline-none focus:border-[#41D9F5]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredNodes.map(dev => {
                      const catMeta = CATEGORY_META[dev.category];
                      const outCount = NEURAL_SYNAPSE_EDGES.filter(e => e.source === dev.id).length;
                      const inCount = NEURAL_SYNAPSE_EDGES.filter(e => e.target === dev.id).length;
                      const isSel = selectedNode?.id === dev.id;
                      const inScene = activeSceneDeviceIds.includes(dev.id);
                      return (
                        <div
                          key={dev.id}
                          tabIndex={0}
                          role="button"
                          onClick={() => {
                            setSelectedNode(dev);
                            setShowDetailDrawer(true);
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedNode(dev);
                              setShowDetailDrawer(true);
                            }
                          }}
                          className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#41D9F5] ${
                            isSel
                              ? 'bg-[#10223D] border-[#41D9F5] shadow-[0_0_16px_rgba(65,217,245,0.2)]'
                              : 'bg-[#0B1930]/85 border-[rgba(130,180,230,0.18)] hover:border-[#41D9F5]/45'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="text-xl p-1.5 rounded-xl bg-[#050B18] border border-[rgba(130,180,230,0.2)] shrink-0">
                              {dev.glyphIcon}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-[#E8F2FF]">
                                  {userMode === 'student' ? dev.nameStudent : dev.nameVi}
                                </span>
                                {inScene && (
                                  <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-[#48D6A0]/20 border border-[#48D6A0]/50 text-[#48D6A0] font-semibold">
                                    Trên bàn 3D
                                  </span>
                                )}
                              </div>
                              <div className="text-[10.5px] text-[#A8BCD5] mt-0.5">
                                {userMode === 'student' ? catMeta.studentName : catMeta.name} ·{' '}
                                {dev.grades.map(g => g.replace('grade', 'Lớp ')).join(', ')}
                              </div>
                              <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono">
                                <span className="text-[#4D8DFF]">➔ Phát ra: {outCount}</span>
                                <span className="text-[#9B83FF]">⬅ Nhận vào: {inCount}</span>
                              </div>
                            </div>
                          </div>

                          {onSelectDevice && (
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                onSelectDevice(dev.id);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#4D8DFF] hover:bg-[#3b7be8] text-white text-[10.5px] font-semibold shrink-0 cursor-pointer"
                            >
                              + Bàn 3D
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onWheel={handleWheel}
                onDoubleClick={handleResetCamera}
                onContextMenu={handleContextMenu}
                className="w-full h-full block"
              />
            )}

            {/* CHÚ GIẢI HỆ HÀNH TINH (PLANETARY COSMOS LEGEND) — ĐẶT GÓC TRÊN TRÁI ĐỂ KHÔNG ĐÈ THANH ĐIỀU KHIỂN ĐÁY */}
            {viewPresentation === 'cosmos_canvas' && (
              <div className="hidden lg:flex absolute top-3 left-3 z-20 items-center gap-2.5 px-2.5 py-1 rounded-xl bg-[#050B18]/85 border border-[rgba(130,180,230,0.2)] backdrop-blur-md text-[10px] text-[#A8BCD5] pointer-events-none">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#41D9F5] inline-block" />
                  <span>Cỡ = Bậc nối</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-0.5 bg-[#4D8DFF] inline-block" />
                  <span className="text-[#4D8DFF] font-semibold">Tác động ra</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-0.5 bg-[#9B83FF] inline-block" />
                  <span className="text-[#9B83FF] font-semibold">Nhận vào</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full border border-[#48D6A0] inline-block" />
                  <span className="text-[#48D6A0]">Trên bàn 3D</span>
                </span>
              </div>
            )}

            {/* THÔNG BÁO THỬ THÁCH NỔI TRÊN CANVAS */}
            {challengeMode && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-xl bg-[#050B18]/90 border border-[#FFB85C]/50 backdrop-blur-md text-xs shadow-lg animate-in fade-in">
                <span className="text-[#FFB85C] font-bold flex items-center gap-1.5">
                  <span>🎯 Thử thách:</span>
                  <span className="text-[#E8F2FF] font-normal">Nhấp 2 thiết bị liên kết nhân quả!</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FFB85C]/25 text-[#FFB85C] font-bold border border-[#FFB85C]/40">
                  {challengeScore} điểm
                </span>
                {challengeFeedback && (
                  <span className="text-[11px] text-amber-200 pl-2 border-l border-[#FFB85C]/40">
                    {challengeFeedback}
                  </span>
                )}
              </div>
            )}

            {/* HUY HIỆU CỤM BÀI THỰC HÀNH ĐANG CHỌN & NÚT 1-CLICK DEPLOY RA BÀN 3D */}
            {selectedExperiment && !challengeMode && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#050B18]/92 border border-[#41D9F5]/60 backdrop-blur-xl text-xs shadow-2xl max-w-[92%] animate-in fade-in">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#41D9F5]">
                    Cụm mạng liên kết · {selectedExperiment.grade}
                  </span>
                  <span className="font-bold text-white truncate max-w-[260px]">
                    {selectedExperiment.title}
                  </span>
                </div>
                {onTriggerMacroCluster && (
                  <button
                    type="button"
                    onClick={() => {
                      audioFX.playSuccessChime();
                      onTriggerMacroCluster(selectedExperiment);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#059669] to-[#10B981] hover:brightness-110 text-white font-extrabold text-[11px] shadow-[0_0_16px_rgba(16,185,129,0.4)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>🚀</span>
                    <span>Đưa {selectedExperiment.deviceIds.length} thiết bị ra Bàn 3D</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedExperiment(null)}
                  className="w-6 h-6 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-xs cursor-pointer"
                  title="Bỏ lọc cụm thí nghiệm"
                >
                  ✕
                </button>
              </div>
            )}

            {/* HUY HIỆU NỔI THIẾT BỊ ĐANG CHỌN */}
            {selectedNode && selectedNodeDetails && !showDetailDrawer && (
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2.5 p-1.5 pl-3 rounded-2xl bg-[#0B1930]/92 border border-[#41D9F5]/50 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-2 pointer-events-auto">
                <span className="text-base p-1 rounded-xl bg-[#050B18] border border-[rgba(130,180,230,0.2)] shadow-inner">
                  {selectedNode.glyphIcon}
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#E8F2FF] leading-tight">
                    {userMode === 'student' ? selectedNode.nameStudent : selectedNode.nameVi}
                  </span>
                  <span className="text-[10px] text-[#41D9F5]">
                    {selectedNodeDetails.outgoing.length} tác động ra · {selectedNodeDetails.incoming.length} nhận vào
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowDetailDrawer(true);
                    audioFX.playNodeClick();
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-[#4D8DFF] hover:bg-[#3b7be8] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ml-1 cursor-pointer"
                  title="Xem thông tin chi tiết đầy đủ của thiết bị này"
                >
                  <span>📋</span>
                  <span>Chi tiết</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    audioFX.playNodeClick();
                  }}
                  className="w-6 h-6 rounded-lg hover:bg-[#10223D] text-[#A8BCD5] hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                  title="Bỏ chọn thiết bị"
                >
                  ✕
                </button>
              </div>
            )}

            {/* ĐƯỜNG DẪN HƯỚNG NEO ĐỘNG (LEADER LINE) GIỮ CHÍNH XÁC HƯỚNG CHÚ THÍCH VÀO SỢI DÂY */}
            <svg className="absolute inset-0 pointer-events-none z-30 w-full h-full overflow-visible">
              <defs>
                <filter id="glow-leader" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Đầu mũi tên chỉ hướng chính xác vào điểm neo trên sợi dây nơ-ron */}
                <marker
                  id="arrow-leader"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 1 2 L 7 5 L 1 8 z" fill="#FACC15" />
                </marker>
              </defs>

              <g ref={leaderSvgGroupRef} style={{ display: selectedEdge ? 'block' : 'none' }}>
                {/* Điểm neo ghim cố định tại sợi dây nơ-ron */}
                <circle
                  ref={leaderAnchorRingRef}
                  cx={0}
                  cy={0}
                  r="12"
                  fill="none"
                  stroke="#FACC15"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.85"
                />
                <circle
                  ref={leaderAnchorHaloRef}
                  cx={0}
                  cy={0}
                  r="5.5"
                  fill="#FACC15"
                  filter="url(#glow-leader)"
                  opacity="0.95"
                />
                <circle
                  ref={leaderAnchorDotRef}
                  cx={0}
                  cy={0}
                  r="2"
                  fill="#FFFFFF"
                />

                {/* Dây dẫn hướng viền phát sáng nối từ hộp chú thích về đúng điểm neo */}
                <path
                  ref={leaderGlowPathRef}
                  d=""
                  fill="none"
                  stroke="#FACC15"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  filter="url(#glow-leader)"
                  opacity="0.92"
                  markerEnd="url(#arrow-leader)"
                />

                {/* Lõi dây dẫn sáng trung tâm */}
                <path
                  ref={leaderCorePathRef}
                  d=""
                  fill="none"
                  stroke="#FFFBEB"
                  strokeWidth="1.2"
                  opacity="0.75"
                />

                {/* Chốt neo gắn chặt trên mép hộp chú thích */}
                <circle
                  ref={leaderStudRef}
                  cx={0}
                  cy={0}
                  r="4"
                  fill="#FACC15"
                  stroke="#060F1E"
                  strokeWidth="1.5"
                />
              </g>
            </svg>

            {/* POPUP CALLOUT KHUNG MỜ DI CHUYỂN TỰ DO, CHỮ TRONG HỘP SẮC NÉT */}
            {selectedEdge && edgePopupPos && (() => {
              const src = NEURAL_DEVICE_NODES.find((n) => n.id === selectedEdge.source);
              const tgt = NEURAL_DEVICE_NODES.find((n) => n.id === selectedEdge.target);
              const sMeta = SYNAPSE_META[selectedEdge.type];
              const lawMeta = PHYSICAL_LAW_MAPPINGS[selectedEdge.type];

              return (
                <div
                  ref={popupContainerRef}
                  style={{
                    left: `${edgePopupPos.x}px`,
                    top: `${edgePopupPos.y}px`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={handlePopupPointerDown}
                  className="absolute z-40 w-[350px] sm:w-[380px] max-w-[calc(100vw-24px)] rounded-2xl bg-[#071326]/38 border border-[#FACC15]/65 backdrop-blur-xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] space-y-2 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 select-none cursor-grab active:cursor-grabbing"
                >
                  {/* Hộp 1: Tiêu đề Popup (Thanh nắm kéo di chuyển) & Nút nghe lại / tắt */}
                  <div
                    className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#071326]/95 border border-[#FACC15]/80 backdrop-blur-xl shadow-md cursor-grab active:cursor-grabbing"
                    title="Giữ chuột tại đây hoặc trên khung để kéo di chuyển hộp thông tin"
                  >
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FDE047] flex items-center gap-1.5 min-w-0">
                      <span className="text-amber-400/80 text-xs shrink-0 font-mono">⠿</span>
                      <span className="shrink-0">🔗</span>
                      <span className="truncate">{userMode === 'student' ? sMeta?.studentName : sMeta?.name}</span>
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => {
                          const textToSpeak =
                            selectedEdge.studentCausal ||
                            lawMeta?.actionVerb ||
                            selectedEdge.causalRule;
                          audioFX.playSynapseGuide(selectedEdge.type, textToSpeak);
                        }}
                        className="w-6 h-6 rounded-md hover:bg-white/15 text-cyan-300 hover:text-white flex items-center justify-center text-xs cursor-pointer transition-colors"
                        title="Nghe lại hướng dẫn (Giọng đọc tự nhiên)"
                      >
                        🔊
                      </button>
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => {
                          selectedEdgeRef.current = null;
                          setSelectedEdge(null);
                          setEdgePopupPos(null);
                          edgePopupPosRef.current = null;
                          audioFX.stopSpeech();
                        }}
                        className="w-6 h-6 rounded-md hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-xs cursor-pointer transition-colors"
                        title="Đóng chỉ dẫn"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Hộp 2: Thiết bị Nguồn -> Đích */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-2 rounded-xl bg-[#040B18]/95 border border-cyan-500/45 backdrop-blur-xl shadow-md text-[11.5px] font-bold text-white">
                    <div className="flex items-center gap-1.5 min-w-0" title={src?.nameStudent || src?.nameVi}>
                      <span className="shrink-0 text-sm">{src?.glyphIcon}</span>
                      <span className="leading-tight break-words line-clamp-2">{src?.nameStudent || src?.nameVi}</span>
                    </div>
                    <span className="text-amber-300 px-1 shrink-0 font-bold">➔</span>
                    <div className="flex items-center gap-1.5 min-w-0 justify-end text-right" title={tgt?.nameStudent || tgt?.nameVi}>
                      <span className="leading-tight break-words line-clamp-2">{tgt?.nameStudent || tgt?.nameVi}</span>
                      <span className="shrink-0 text-sm">{tgt?.glyphIcon}</span>
                    </div>
                  </div>

                  {/* Hộp 3: Hành động nhân quả ngắn gọn */}
                  <div className="px-3 py-2 rounded-xl bg-[#040B18]/95 border border-emerald-500/45 backdrop-blur-xl shadow-md text-[11.5px] text-emerald-300 font-semibold flex items-start gap-1.5">
                    <span className="shrink-0 text-amber-400">⚡</span>
                    <span className="leading-snug">
                      <RichMathText
                        text={distillCausal(
                          userMode === 'student'
                            ? (selectedEdge.studentCausal || lawMeta?.actionVerb || selectedEdge.causalRule)
                            : (lawMeta?.actionVerb || selectedEdge.causalRule)
                        )}
                      />
                    </span>
                  </div>

                  {/* Hộp 4: Công thức KaTeX chuẩn MathType */}
                  {lawMeta?.formula && (
                    <div className="p-2.5 rounded-xl bg-[#040B18]/95 border border-cyan-400/45 backdrop-blur-xl shadow-md text-[11px] text-cyan-200 space-y-1">
                      <div className="text-[10.5px] text-slate-300 font-medium leading-tight">
                        {lawMeta.lawName}:
                      </div>
                      <div className="text-white font-semibold py-0.5 overflow-x-auto no-scrollbar flex items-center justify-center">
                        <MathFormula math={lawMeta.formula} />
                      </div>
                    </div>
                  )}

                  {/* Hộp 5: Nút thao tác đưa trọn cặp ra bàn 3D */}
                  {onSelectDevice && src && tgt && (
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => {
                        audioFX.playSuccessChime();
                        audioFX.stopSpeech();
                        onSelectDevice(src.id, [-0.14, 0, 0.05]);
                        onSelectDevice(tgt.id, [0.14, 0, 0.05]);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-[0.98] text-slate-950 font-black text-[11.5px] shadow-[0_8px_24px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>⚡</span>
                      <span>Đặt Cả Cặp Này Lên Bàn 3D</span>
                    </button>
                  )}
                </div>
              );
            })()}

            {/* THANH ĐIỀU KHIỂN DƯỚI ĐÁY */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1 rounded-2xl bg-[#050B18]/90 border border-[rgba(130,180,230,0.22)] backdrop-blur-xl shadow-2xl text-xs pointer-events-auto">
              <button
                type="button"
                onClick={handleZoomIn}
                className="w-8 h-8 rounded-xl bg-[#0B1930] hover:bg-[#10223D] text-[#E8F2FF] border border-[rgba(130,180,230,0.2)] flex items-center justify-center text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Phóng to bản đồ (+)"
              >
                ➕
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="w-8 h-8 rounded-xl bg-[#0B1930] hover:bg-[#10223D] text-[#E8F2FF] border border-[rgba(130,180,230,0.2)] flex items-center justify-center text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Thu nhỏ bản đồ (−)"
              >
                ➖
              </button>
              <button
                onClick={handleResetCamera}
                className="w-8 h-8 rounded-xl bg-[#0B1930] hover:bg-[#10223D] text-[#E8F2FF] border border-[rgba(130,180,230,0.2)] flex items-center justify-center text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Căn giữa sơ đồ (Nhấp đúp chuột lên màn hình)"
              >
                🎯
              </button>
              <button
                type="button"
                onClick={handleToggleFullScreen}
                className={`h-8 px-2.5 rounded-xl border flex items-center justify-center gap-1 text-xs font-semibold whitespace-nowrap transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isFullScreen
                    ? 'bg-[#41D9F5]/25 border-[#41D9F5] text-[#41D9F5] shadow-[0_0_10px_rgba(65,217,245,0.3)]'
                    : 'bg-[#0B1930] hover:bg-[#10223D] text-[#E8F2FF] border-[rgba(130,180,230,0.2)]'
                }`}
                title={isFullScreen ? 'Thu nhỏ bản đồ về khung cửa sổ' : 'Phóng to bản đồ toàn màn hình'}
              >
                <span>{isFullScreen ? '🗗' : '⛶'}</span>
                <span className="hidden sm:inline whitespace-nowrap">{isFullScreen ? 'Thu lại' : 'Toàn màn hình'}</span>
              </button>
              <button
                onClick={() => {
                  if (selectedNode) {
                    setShowDetailDrawer(prev => !prev);
                    audioFX.playNodeClick();
                  }
                }}
                disabled={!selectedNode}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-105 active:scale-95 ${
                  selectedNode
                    ? showDetailDrawer
                      ? 'bg-[#4D8DFF]/35 border border-[#41D9F5] text-[#E8F2FF] shadow-[0_0_10px_rgba(65,217,245,0.35)] cursor-pointer'
                      : 'bg-[#10223D] hover:bg-[#163056] border border-[#41D9F5]/60 text-[#41D9F5] animate-pulse cursor-pointer'
                    : 'bg-[#0B1930]/50 text-[#6E86A6] border border-[rgba(130,180,230,0.1)] cursor-not-allowed opacity-40'
                }`}
                title={
                  selectedNode
                    ? showDetailDrawer
                      ? 'Đóng bảng chi tiết thiết bị'
                      : `Xem chi tiết thiết bị: ${userMode === 'student' ? selectedNode.nameStudent : selectedNode.nameVi}`
                    : 'Chọn một thiết bị trên sơ đồ để xem chi tiết'
                }
              >
                📋
              </button>
              <button
                onClick={() => setIsFiringSignal(prev => !prev)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isFiringSignal
                    ? 'bg-[#FFB85C]/25 border border-[#FFB85C] text-[#FFB85C] shadow-[0_0_10px_rgba(255,184,92,0.3)]'
                    : 'bg-[#0B1930] hover:bg-[#10223D] text-[#A8BCD5] border border-[rgba(130,180,230,0.2)] opacity-60'
                }`}
                title={isFiringSignal ? 'Xung tín hiệu: ĐANG BẬT (Bấm để tạm dừng)' : 'Xung tín hiệu: ĐÃ DỪNG (Bấm để bật)'}
              >
                ⚡
              </button>
              <button
                onClick={handleToggleSound}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  !isSoundMuted
                    ? 'bg-[#4D8DFF]/30 border border-[#41D9F5]/60 text-[#E8F2FF]'
                    : 'bg-[#0B1930] hover:bg-[#10223D] text-[#A8BCD5] border border-[rgba(130,180,230,0.2)]'
                }`}
                title={!isSoundMuted ? 'Âm thanh tương tác: ĐANG BẬT (Bấm để tắt tiếng)' : 'Âm thanh: ĐÃ TẮT (Bấm để bật)'}
              >
                {!isSoundMuted ? '🔊' : '🔇'}
              </button>
              <button
                onClick={handleExportDiagramPng}
                className="w-8 h-8 rounded-xl bg-[#0B1930] hover:bg-[#10223D] text-[#E8F2FF] border border-[rgba(130,180,230,0.2)] flex items-center justify-center text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Lưu ảnh chụp sơ đồ nơ-ron PNG"
              >
                📸
              </button>
              <button
                onClick={() => {
                  setMapTheme(prev => prev === 'dark' ? 'light' : prev === 'light' ? 'transparent' : 'dark');
                  audioFX.playNodeClick();
                }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  mapTheme === 'light'
                    ? 'bg-[#FFB85C]/20 hover:bg-[#FFB85C]/30 text-[#FFB85C] border border-[#FFB85C]/60'
                    : mapTheme === 'transparent'
                    ? 'bg-[#41D9F5]/25 hover:bg-[#41D9F5]/35 text-[#41D9F5] border border-[#41D9F5]/60'
                    : 'bg-[#0B1930] hover:bg-[#10223D] text-[#41D9F5] border border-[rgba(130,180,230,0.2)]'
                }`}
                title={
                  mapTheme === 'dark'
                    ? 'Nền bản đồ: VŨ TRỤ TỐI (Nhấp để đổi sang NỀN SÁNG)'
                    : mapTheme === 'light'
                    ? 'Nền bản đồ: SÁNG (Nhấp để đổi sang NỀN TRONG SUỐT)'
                    : 'Nền bản đồ: TRONG SUỐT (Nhấp để đổi sang NỀN VŨ TRỤ TỐI)'
                }
              >
                {mapTheme === 'dark' ? '🌙' : mapTheme === 'light' ? '☀️' : '🪟'}
              </button>
              <button
                onClick={() => {
                  const nextMode = layoutMode === 'circular' ? 'neural_layers' : 'circular';
                  setLayoutMode(nextMode);
                  if (canvasRef.current) computeTargetPositions(canvasRef.current.width, canvasRef.current.height, nextMode);
                }}
                className="w-8 h-8 rounded-xl bg-[#0B1930] hover:bg-[#10223D] text-[#E8F2FF] border border-[rgba(130,180,230,0.2)] flex items-center justify-center text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title={`Bố cục: ${layoutMode === 'circular' ? 'Quỹ đạo Hành tinh' : 'Phân tầng Nơ-ron'} (Nhấp để đổi)`}
              >
                🔄
              </button>
              <div className="h-4 w-px bg-[rgba(130,180,230,0.2)] mx-0.5" />
              <button
                className="w-8 h-8 rounded-xl bg-[#0B1930]/70 hover:bg-[#10223D] text-[#A8BCD5] border border-[rgba(130,180,230,0.18)] flex items-center justify-center text-xs transition-all cursor-help"
                title={`Hướng dẫn: Cuộn chuột để Thu/Phóng · Giữ chuột trái trên thiết bị và kéo ra ngoài để đặt xuống bàn 3D · Nhấp đúp để Căn giữa (${filteredNodes.length} thiết bị, ${filteredEdges.length} khớp nối)`}
              >
                ℹ️
              </button>
              <button
                type="button"
                onClick={onClose}
                title="Đóng hệ thống mạng lưới và quay lại bàn thí nghiệm 3D (Esc)"
                className="h-8 px-3 rounded-xl bg-rose-600/90 hover:bg-rose-500 border border-rose-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(244,63,94,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer ml-0.5"
              >
                <span>✕</span>
                <span>Đóng</span>
              </button>
            </div>
          </div>

          {/* SIDEBAR PHẢI: CHỈ HIỂN THỊ KHI CHỌN NÚT THIẾT BỊ VÀ KHÔNG CHỌN SỢI DÂY (ĐÃ TÁCH KHỎI CLICK DÂY) */}
          {selectedNode && selectedNodeDetails && showDetailDrawer && !selectedEdge && (
            <div className="w-[320px] flex-shrink-0 border-l border-[rgba(130,180,230,0.22)] bg-[#050B18]/94 backdrop-blur-2xl flex flex-col p-4 overflow-y-auto animate-in slide-in-from-right duration-200">
              {/* Header thiết bị */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-1.5 rounded-xl bg-[#0B1930] border border-[rgba(130,180,230,0.22)] shadow-inner">
                    {selectedNode.glyphIcon}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#E8F2FF] leading-tight">
                      {userMode === 'student' ? selectedNode.nameStudent : selectedNode.nameVi}
                    </h3>
                    <p className="text-[10.5px] text-[#A8BCD5]">
                      {userMode === 'student' ? selectedNode.nameVi : selectedNode.nameEn}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDetailDrawer(false);
                    audioFX.playNodeClick();
                  }}
                  className="w-7 h-7 rounded-lg bg-[#0B1930] hover:bg-[#10223D] text-[#A8BCD5] hover:text-white flex items-center justify-center transition-colors text-xs cursor-pointer"
                  title="Thu gọn bảng chi tiết"
                >
                  ✕
                </button>
              </div>

              {/* Tag phân loại & lớp */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                  style={{
                    backgroundColor: `${CATEGORY_META[selectedNode.category].color}25`,
                    color: CATEGORY_META[selectedNode.category].color
                  }}
                >
                  {userMode === 'student' ? CATEGORY_META[selectedNode.category].studentName : CATEGORY_META[selectedNode.category].name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#0B1930] border border-[rgba(130,180,230,0.2)] text-[#41D9F5] font-medium">
                  {selectedNode.grades.map(g => g.replace('grade', 'Lớp ')).join(', ')}
                </span>
              </div>

              {/* KHUNG QUY CHUẨN & NGUYÊN LÝ */}
              <div className="mt-3 p-2.5 rounded-xl bg-[#0B1930]/85 border border-[#41D9F5]/30 backdrop-blur-md space-y-2 text-[10.5px]">
                <div className="text-[#E8F2FF] leading-snug">
                  <span className="text-[#41D9F5] font-bold">🎯 Thao tác: </span>
                  <span>{selectedNode.description || 'Lắp ráp đúng trục và cắm tiếp điểm tương thích.'}</span>
                </div>

                {selectedNode.studentTip && (
                  <div className="text-amber-200/90 leading-snug">
                    <span className="text-[#FFB85C] font-bold">⚠️ Lưu ý: </span>
                    <span>{selectedNode.studentTip}</span>
                  </div>
                )}

                {(selectedNode.mathFormula || selectedNode.sgkFormula) && (
                  <div className="p-1.5 rounded-lg bg-[#10223D] border border-[#4D8DFF]/30 font-mono text-[10px] text-[#E8F2FF]">
                    <span className="text-[#41D9F5] font-sans font-bold text-[9.5px] block mb-0.5">📐 Định luật / Công thức:</span>
                    <div className="py-0.5 overflow-x-auto">
                      <MathFormula math={selectedNode.mathFormula || selectedNode.sgkFormula} displayMode className="text-[#E8F2FF] text-[11px]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Cổng kết nối */}
              {(selectedNode.studentPorts.length > 0 || selectedNode.ports.length > 0) && (
                <div className="mt-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#A8BCD5]">
                    Cổng liên kết:
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(userMode === 'student' ? selectedNode.studentPorts : selectedNode.ports).map(p => (
                      <span
                        key={p}
                        className="text-[9.5px] px-2 py-0.5 rounded bg-[#0B1930] border border-[rgba(130,180,230,0.22)] text-[#48D6A0]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dòng chảy ra (Planetary Blue) */}
              <div className="mt-3">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#4D8DFF] flex items-center gap-1.5">
                  <span>➔</span>
                  <span>Tác Động Ra (Axon):</span>
                  <span className="text-[9.5px] opacity-80 font-normal">({selectedNodeDetails.outgoing.length})</span>
                </label>
                <div className="flex flex-col gap-1.5 mt-1">
                  {selectedNodeDetails.outgoing.length === 0 ? (
                    <div className="text-[10px] text-[#6E86A6] italic p-1.5 rounded bg-[#0B1930]/50">
                      Không có kết nối phát tín hiệu đi
                    </div>
                  ) : (
                    selectedNodeDetails.outgoing.map(edge => {
                      const tgt = NEURAL_DEVICE_NODES.find(n => n.id === edge.target);
                      const meta = SYNAPSE_META[edge.type];
                      const lawMeta = PHYSICAL_LAW_MAPPINGS[edge.type];
                      const isEdgeActive = false; // Sidebar chỉ mở khi !selectedEdge
                      return (
                        <div
                          key={edge.id}
                          onClick={() => selectSynapseEdge(edge)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                            isEdgeActive
                              ? 'bg-[#10223D] border-[#FACC15] shadow-[0_0_12px_rgba(250,204,21,0.22)]'
                              : 'bg-[#10223D]/70 hover:bg-[#10223D] border-[#4D8DFF]/35 hover:border-[#4D8DFF]'
                          }`}
                          title="Nhấp để soi chi tiết khớp nối nơ-ron này trên bản đồ"
                        >
                          <div className="flex items-center justify-between font-bold text-[#E8F2FF] text-[11px]">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-sm shrink-0">{tgt?.glyphIcon}</span>
                              <span className="truncate">{userMode === 'student' ? tgt?.nameStudent : tgt?.nameVi}</span>
                            </div>
                            <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-[#4D8DFF]/20 border border-[#4D8DFF]/40 text-[#41D9F5] shrink-0">
                              {userMode === 'student' ? meta.studentName : meta.name}
                            </span>
                          </div>

                          {lawMeta && (
                            <div className="flex items-center justify-between text-[9.5px] bg-[#071326] px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
                              <span className="text-[#41D9F5] font-sans font-semibold truncate">{lawMeta.lawName}:</span>
                              <span className="text-white shrink-0 font-bold">
                                <MathFormula math={lawMeta.formula} className="text-white" />
                              </span>
                            </div>
                          )}

                          <div className="text-[10px] text-[#A8BCD5] leading-tight">
                            <RichMathText text={distillCausal(userMode === 'student' ? edge.studentCausal : edge.causalRule)} />
                          </div>

                          <div className="pt-0.5 flex items-center justify-between gap-1 text-[9px]">
                            <span className="text-[#41D9F5]/70 truncate">📚 {edge.experimentContext}</span>
                            {tgt && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedNode(tgt);
                                  selectSynapseEdge(edge);
                                }}
                                className="px-1.5 py-0.5 rounded bg-[#4D8DFF]/20 hover:bg-[#4D8DFF]/40 text-cyan-200 border border-[#4D8DFF]/30 shrink-0 cursor-pointer font-semibold transition-colors"
                                title="Chuyển tiêu điểm khám phá sang thiết bị đích"
                              >
                                ➔ Tới nút
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Dòng chảy vào (Planetary Violet) */}
              <div className="mt-3">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#9B83FF] flex items-center gap-1.5">
                  <span>➔</span>
                  <span>Nhận Tín Hiệu Vào (Dendrite):</span>
                  <span className="text-[9.5px] opacity-80 font-normal">({selectedNodeDetails.incoming.length})</span>
                </label>
                <div className="flex flex-col gap-1.5 mt-1">
                  {selectedNodeDetails.incoming.length === 0 ? (
                    <div className="text-[10px] text-[#6E86A6] italic p-1.5 rounded bg-[#0B1930]/50">
                      Không có kết nối nhận tín hiệu vào
                    </div>
                  ) : (
                    selectedNodeDetails.incoming.map(edge => {
                      const src = NEURAL_DEVICE_NODES.find(n => n.id === edge.source);
                      const meta = SYNAPSE_META[edge.type];
                      const lawMeta = PHYSICAL_LAW_MAPPINGS[edge.type];
                      const isEdgeActive = false; // Sidebar chỉ mở khi !selectedEdge
                      return (
                        <div
                          key={edge.id}
                          onClick={() => selectSynapseEdge(edge)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                            isEdgeActive
                              ? 'bg-[#10223D] border-[#FACC15] shadow-[0_0_12px_rgba(250,204,21,0.22)]'
                              : 'bg-[#10223D]/55 hover:bg-[#10223D] border border-[#9B83FF]/35 hover:border-[#9B83FF]'
                          }`}
                          title="Nhấp để soi chi tiết khớp nối nơ-ron này trên bản đồ"
                        >
                          <div className="flex items-center justify-between font-bold text-[#E8F2FF] text-[11px]">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-sm shrink-0">{src?.glyphIcon}</span>
                              <span className="truncate">{userMode === 'student' ? src?.nameStudent : src?.nameVi}</span>
                            </div>
                            <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-[#9B83FF]/20 border border-[#9B83FF]/40 text-[#9B83FF] shrink-0">
                              {userMode === 'student' ? meta.studentName : meta.name}
                            </span>
                          </div>

                          {lawMeta && (
                            <div className="flex items-center justify-between text-[9.5px] bg-[#071326] px-2 py-0.5 rounded border border-indigo-500/20 font-mono">
                              <span className="text-[#9B83FF] font-sans font-semibold truncate">{lawMeta.lawName}:</span>
                              <span className="text-white shrink-0 font-bold">
                                <MathFormula math={lawMeta.formula} className="text-white" />
                              </span>
                            </div>
                          )}

                          <div className="text-[10px] text-[#A8BCD5] leading-tight">
                            <RichMathText text={distillCausal(userMode === 'student' ? edge.studentCausal : edge.causalRule)} />
                          </div>

                          <div className="pt-0.5 flex items-center justify-between gap-1 text-[9px]">
                            <span className="text-[#9B83FF]/70 truncate">📚 {edge.experimentContext}</span>
                            {src && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedNode(src);
                                  selectSynapseEdge(edge);
                                }}
                                className="px-1.5 py-0.5 rounded bg-[#9B83FF]/20 hover:bg-[#9B83FF]/40 text-purple-200 border border-[#9B83FF]/30 shrink-0 cursor-pointer font-semibold transition-colors"
                                title="Chuyển tiêu điểm khám phá sang thiết bị nguồn"
                              >
                                ➔ Tới nút
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Nút nạp vào phòng lab 3D */}
              {onSelectDevice && (
                <div className="mt-4 pt-3 border-t border-[rgba(130,180,230,0.18)]">
                  <button
                    onClick={() => onSelectDevice(selectedNode.id)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#4D8DFF] to-[#9B83FF] hover:from-[#3b7be8] hover:to-[#886ef5] text-white font-semibold text-[11px] shadow-lg shadow-[#4D8DFF]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>➕ Đưa vào Bàn Thí Nghiệm 3D</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 🏷️ NHÃN TÊN THIẾT BỊ NỔI TRÊN ĐẦU MÔ HÌNH 3D (KHÔNG CHE MÔ HÌNH 3D PHÍA SAU) */}
      {isDraggingToScene && draggedNode && (
        <div
          className="fixed z-[9999] pointer-events-none -translate-x-1/2 -translate-y-full select-none"
          style={{ left: dragCurrentPos.x, top: dragCurrentPos.y - 32 }}
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#050B18]/90 border border-[#41D9F5] shadow-[0_0_20px_rgba(65,217,245,0.45)] backdrop-blur-md text-[#E8F2FF]">
              <span className="text-base">{draggedNode.glyphIcon}</span>
              <span className="text-xs font-bold tracking-wide">
                {userMode === 'student' ? draggedNode.nameStudent : draggedNode.nameVi}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#41D9F5] animate-ping" />
            </div>
            {/* Tia định hướng laser chỉ xuống mô hình 3D thực tế dưới bàn */}
            <div className="w-0.5 h-3 bg-gradient-to-b from-[#41D9F5] to-transparent" />
          </div>
        </div>
      )}
    </div>
  );
};
