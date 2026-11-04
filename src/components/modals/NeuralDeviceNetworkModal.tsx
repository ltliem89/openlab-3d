import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  NEURAL_DEVICE_NODES,
  NEURAL_SYNAPSE_EDGES,
  EXPERIMENT_MACRO_CLUSTERS,
  NeuralDeviceNode,
  NeuralSynapseEdge,
  DeviceCategory,
  SynapseKind,
  ExperimentMacroCluster,
  ThcsGrade
} from '../../domain/neuralNetworkTopology';

export interface NeuralDeviceNetworkModalProps {
  isOpen: boolean;
  initialDeviceId?: string | null;
  onClose: () => void;
  onSelectDevice?: (deviceId: string) => void;
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
}

const CATEGORY_META: Record<DeviceCategory, { name: string; studentName: string; color: string; icon: string }> = {
  G01_DIMENSION:    { name: 'G01 · Kích thước & Góc', studentName: 'Dụng cụ Đo chiều dài', color: '#f97316', icon: '📏' },
  G02_MASS_FORCE:   { name: 'G02 · Khối lượng & Lực', studentName: 'Cân & Đo lực', color: '#ef4444', icon: '⚖️' },
  G03_TIME_TEMP:    { name: 'G03 · Thời gian & Nhiệt', studentName: 'Nhiệt kế & Bấm giờ', color: '#eab308', icon: '🌡️' },
  G04_VOLUMETRIC:   { name: 'G04 · Đo Thể tích', studentName: 'Ống đong & Bình chứa', color: '#06b6d4', icon: '🧪' },
  G05_CHEM_HEATING: { name: 'G05 · Hóa học & Gia nhiệt', studentName: 'Đèn cồn & Đun nóng', color: '#ec4899', icon: '🔥' },
  G06_OPTICS:       { name: 'G06 · Quang học', studentName: 'Đèn chiếu & Thấu kính', color: '#8b5cf6', icon: '🔦' },
  G07_ELECTRICITY:  { name: 'G07 · Điện & Cảm ứng', studentName: 'Nguồn điện & Nam châm', color: '#10b981', icon: '⚡' },
  G08_MECHANICS:    { name: 'G08 · Cơ học & Cân bằng', studentName: 'Đòn bẩy & Bình nước', color: '#f59e0b', icon: '⚙️' },
  G09_BIOLOGY:      { name: 'G09 · Sinh học & Vi mô', studentName: 'Kính hiển vi & Tế bào', color: '#22c55e', icon: '🔬' },
  G10_FLUID_SUPPLY: { name: 'G10 · Nguồn Lưu chất', studentName: 'Bình cấp nước sạch', color: '#3b82f6', icon: '🚰' },
};

const SYNAPSE_META: Record<SynapseKind, { name: string; studentName: string; color: string; dash?: number[] }> = {
  mechanical_support:        { name: 'Đỡ tải cơ học', studentName: 'Đặt lên đĩa cân', color: '#ef4444' },
  mechanical_clamp:          { name: 'Kẹp ôm khít', studentName: 'Kẹp đo kích thước', color: '#f97316' },
  mechanical_hook:           { name: 'Móc treo đàn hồi', studentName: 'Móc treo lực kế', color: '#fb923c', dash: [6, 4] },
  mechanical_rail:           { name: 'Ray trượt 1D', studentName: 'Gắn trượt trên ray', color: '#eab308' },
  optical_carrier:           { name: 'Đế mang quang', studentName: 'Đế trượt quang học', color: '#a78bfa' },
  optical_alignment:         { name: 'Đồng trục truyền quang', studentName: 'Chiếu tia sáng qua', color: '#c084fc', dash: [5, 5] },
  optical_refraction:        { name: 'Khúc xạ & Tán sắc', studentName: 'Bẻ cong tia sáng / Cầu vồng', color: '#e879f9', dash: [4, 4] },
  electrical_terminal:       { name: 'Cọc cắm điện 4mm', studentName: 'Dây cắm nguồn điện', color: '#10b981' },
  electrical_interlock:      { name: 'Liên động nguồn điện', studentName: 'Cắm điện mới sáng đèn', color: '#06b6d4', dash: [8, 3] },
  fluid_spout:               { name: 'Rót / Xả chất lỏng', studentName: 'Nước chảy từ vòi', color: '#3b82f6' },
  fluid_receptacle:          { name: 'Miệng hứng chất lỏng', studentName: 'Hứng nước chảy vào', color: '#60a5fa', dash: [4, 4] },
  submersion:                { name: 'Thả chìm chiếm chỗ', studentName: 'Thả chìm làm dâng nước', color: '#14b8a6', dash: [8, 4] },
  buoyancy_force:            { name: 'Lực đẩy Archimedes', studentName: 'Lực đẩy nước nâng lên', color: '#2dd4bf', dash: [3, 5] },
  electromagnetic_induction: { name: 'Cảm ứng điện từ', studentName: 'Nam châm tạo ra điện', color: '#facc15', dash: [6, 4] },
  thermal_exchange:          { name: 'Truyền nhiệt đối lưu', studentName: 'Đun nóng truyền nhiệt', color: '#f43f5e', dash: [5, 5] },
  microscopy_dock:           { name: 'Gá vi thể hiển vi', studentName: 'Soi mẫu vật tế bào', color: '#4ade80' }
};

// ĐỘNG CƠ ÂM THANH WEB AUDIO NỘI TẠI (ZERO ASSETS)
class ProceduralAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
  }

  // Tiếng bấm nơ-ron (Pluck synth)
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

  // Tiếng thành công (Success chime)
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

  // Tiếng thử thách sai (Low buzz)
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
}

const audioFX = new ProceduralAudio();

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

  useEffect(() => {
    if (isOpen && initialDeviceId) {
      const match = NEURAL_DEVICE_NODES.find(
        (n) => n.assetId === initialDeviceId || n.id === initialDeviceId,
      );
      if (match) {
        setSelectedNode(match);
      }
    }
  }, [isOpen, initialDeviceId]);
  const [hoveredNode, setHoveredNode] = useState<NeuralDeviceNode | null>(null);
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentMacroCluster | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [layoutMode, setLayoutMode] = useState<'circular' | 'neural_layers'>('circular');
  const [subjectFilter, setSubjectFilter] = useState<'all' | 'physics' | 'chemistry' | 'biology'>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isFiringSignal, setIsFiringSignal] = useState<boolean>(true);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [challengeMode, setChallengeMode] = useState<boolean>(false);
  const [challengeScore, setChallengeScore] = useState<number>(0);
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Camera
  const cameraRef = useRef<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 1 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const nodesRef = useRef<NodeSimulationState[]>([]);
  const particlesRef = useRef<SynapseParticle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Toggle sound
  const handleToggleSound = () => {
    setIsSoundMuted(prev => {
      audioFX.setMute(!prev);
      return !prev;
    });
  };

  // Lọc Node
  const filteredNodes = useMemo(() => {
    return NEURAL_DEVICE_NODES.filter(device => {
      if (selectedGrade !== 'ALL' && !device.grades.includes(selectedGrade)) return false;
      if (subjectFilter !== 'all' && device.subject !== subjectFilter && device.subject !== 'general') return false;
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchVi = device.nameVi.toLowerCase().includes(kw);
        const matchStudent = device.nameStudent.toLowerCase().includes(kw);
        const matchId = device.assetId.toLowerCase().includes(kw);
        if (!matchVi && !matchStudent && !matchId) return false;
      }
      return true;
    });
  }, [selectedGrade, subjectFilter, searchKeyword]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  // Lọc Edges
  const filteredEdges = useMemo(() => {
    return NEURAL_SYNAPSE_EDGES.filter(edge => {
      if (!filteredNodeIds.has(edge.source) || !filteredNodeIds.has(edge.target)) return false;
      if (selectedExperiment) {
        if (selectedExperiment.steps && selectedExperiment.steps.length > 0) {
          const currentStep = selectedExperiment.steps[currentStepIndex];
          if (currentStep) {
            return currentStep.activeSynapseIds.includes(edge.id);
          }
        }
        return selectedExperiment.deviceIds.includes(edge.source) && selectedExperiment.deviceIds.includes(edge.target);
      }
      return true;
    });
  }, [filteredNodeIds, selectedExperiment, currentStepIndex]);

  // Vị trí Target: Gốc (0, 0) là tâm World Space + Thuật toán khử đè nhãn
  const computeTargetPositions = useCallback((width: number, height: number, mode: typeof layoutMode) => {
    const nodes = nodesRef.current;
    if (nodes.length === 0) return;

    // Giới hạn bán kính quỹ đạo tương quan với chiều cao modal
    const R_orbit = Math.min((width - 320) * 0.44, (height - 160) * 0.40);

    if (mode === 'circular') {
      const categories = Object.keys(CATEGORY_META) as DeviceCategory[];
      const activeCats = categories.filter(cat => nodes.some(n => n.device.category === cat));
      const groupCount = activeCats.length;

      activeCats.forEach((cat, gIndex) => {
        const angle = (gIndex / groupCount) * Math.PI * 2 - Math.PI / 2;
        const gx = R_orbit * Math.cos(angle);
        const gy = R_orbit * Math.sin(angle) * 0.88;

        const inCat = nodes.filter(n => n.device.category === cat);
        if (inCat.length === 1) {
          inCat[0].tx = gx;
          inCat[0].ty = gy;
        } else {
          const fanSpan = Math.PI * 0.36;
          const startAngle = angle - fanSpan / 2;
          inCat.forEach((node, idx) => {
            const a = startAngle + (idx / Math.max(1, inCat.length - 1)) * fanSpan;
            const rOffset = idx % 2 === 0 ? 0.85 : 1.12;
            node.tx = gx + (R_orbit * 0.26 * rOffset) * Math.cos(a);
            node.ty = gy + (R_orbit * 0.24 * rOffset) * Math.sin(a);
          });
        }
      });

      // THUẬT TOÁN KHỬ TRÙNG LẶP & ĐÈ NHÃN (ELLIPTICAL COLLISION RELAXATION)
      for (let iter = 0; iter < 50; iter++) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = b.tx - a.tx;
            const dy = b.ty - a.ty;
            const rx = 112;
            const ry = 42;
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

      const totalW = Math.min((width - 320) * 0.88, 920);
      const spacingX = totalW / 5;
      const totalH = Math.min(height * 0.65, 520);

      layers.forEach((layerNodes, lIdx) => {
        const lx = -totalW / 2 + lIdx * spacingX;
        const count = layerNodes.length;
        layerNodes.forEach((node, nIdx) => {
          node.tx = lx;
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

    nodesRef.current = NEURAL_DEVICE_NODES.map(dev => ({
      device: dev,
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      radius: Math.min(26, 12 + (countMap[dev.id] || 0) * 1.6),
      connections: countMap[dev.id] || 0
    }));

    if (canvasRef.current) {
      const w = canvasRef.current.parentElement?.clientWidth || window.innerWidth;
      const h = canvasRef.current.parentElement?.clientHeight || window.innerHeight;
      canvasRef.current.width = w;
      canvasRef.current.height = h;

      nodesRef.current.forEach(n => {
        n.x = w / 2;
        n.y = h / 2;
      });
      computeTargetPositions(w, h, layoutMode);
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
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const w = canvas.width;
      const h = canvas.height;
      const cam = cameraRef.current;

      nodesRef.current.forEach(n => {
        n.x += (n.tx - n.x) * 0.08;
        n.y += (n.ty - n.y) * 0.08;
      });

      if (isFiringSignal && filteredEdges.length > 0) {
        if (particlesRef.current.length < 180 && Math.random() < 0.4) {
          const edge = filteredEdges[Math.floor(Math.random() * filteredEdges.length)];
          const srcNode = nodesRef.current.find(n => n.device.id === edge.source);
          const tgtNode = nodesRef.current.find(n => n.device.id === edge.target);
          if (srcNode && tgtNode) {
            particlesRef.current.push({
              edge,
              sourceNode: srcNode,
              targetNode: tgtNode,
              progress: 0,
              speed: (0.32 + Math.random() * 0.35) * edge.signalSpeed,
              size: 2.4 + Math.random() * 1.8,
              color: SYNAPSE_META[edge.type]?.color || '#818cf8'
            });
          }
        }
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.progress += p.speed * dt;
        if (p.progress >= 1) particlesRef.current.splice(i, 1);
      }

      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      const gridSize = 45 * cam.zoom;
      const offX = (-cam.x * cam.zoom + w / 2) % gridSize;
      const offY = (-cam.y * cam.zoom + h / 2) % gridSize;
      ctx.strokeStyle = 'rgba(79, 110, 247, 0.05)';
      ctx.lineWidth = 1;
      for (let x = offX; x < w; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = offY; y < h; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      ctx.restore();

      const toScreen = (wx: number, wy: number) => ({
        x: (wx - cam.x) * cam.zoom + w / 2,
        y: (wy - cam.y) * cam.zoom + h / 2
      });

      // Vẽ khớp nối Synapse
      filteredEdges.forEach(edge => {
        const src = nodesRef.current.find(n => n.device.id === edge.source);
        const tgt = nodesRef.current.find(n => n.device.id === edge.target);
        if (!src || !tgt) return;

        const sPos = toScreen(src.x, src.y);
        const tPos = toScreen(tgt.x, tgt.y);
        const meta = SYNAPSE_META[edge.type] || { color: '#6366f1' };

        const isHighlighted =
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

        if (meta.dash) ctx.setLineDash(meta.dash);

        if (isHighlighted) {
          ctx.strokeStyle = meta.color;
          ctx.lineWidth = 2.6 * cam.zoom;
          ctx.shadowColor = meta.color;
          ctx.shadowBlur = 14;
          ctx.globalAlpha = 1.0;
        } else {
          ctx.strokeStyle = meta.color;
          ctx.lineWidth = 1.0 * cam.zoom;
          ctx.globalAlpha = selectedNode || selectedExperiment ? 0.08 : 0.28;
        }
        ctx.stroke();

        // Mũi tên
        const t = 0.65;
        const ax = (1 - t) * (1 - t) * sPos.x + 2 * (1 - t) * t * cx + t * t * tPos.x;
        const ay = (1 - t) * (1 - t) * sPos.y + 2 * (1 - t) * t * cy + t * t * tPos.y;
        const nextT = t + 0.02;
        const nax = (1 - nextT) * (1 - nextT) * sPos.x + 2 * (1 - nextT) * nextT * cx + nextT * nextT * tPos.x;
        const nay = (1 - nextT) * (1 - nextT) * sPos.y + 2 * (1 - nextT) * nextT * cy + nextT * nextT * tPos.y;
        const adx = nax - ax;
        const ady = nay - ay;
        const adist = Math.sqrt(adx * adx + ady * ady) || 1;
        const arrowL = 6 * cam.zoom;

        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(ax + (adx / adist) * arrowL, ay + (ady / adist) * arrowL);
        ctx.lineTo(ax - (ady / adist) * (arrowL * 0.6) - (adx / adist) * arrowL, ay + (adx / adist) * (arrowL * 0.6) - (ady / adist) * arrowL);
        ctx.lineTo(ax + (ady / adist) * (arrowL * 0.6) - (adx / adist) * arrowL, ay - (adx / adist) * (arrowL * 0.6) - (ady / adist) * arrowL);
        ctx.closePath();
        ctx.fillStyle = meta.color;
        ctx.fill();

        ctx.restore();
      });

      // Vẽ hạt photon
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

        const pr = p.progress;
        const px = (1 - pr) * (1 - pr) * s.x + 2 * (1 - pr) * pr * cx + pr * pr * t.x;
        const py = (1 - pr) * (1 - pr) * s.y + 2 * (1 - pr) * pr * cy + pr * pr * t.y;

        const alpha = Math.sin(pr * Math.PI);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(px, py, p.size * cam.zoom, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      // Vẽ Node Nơ-ron
      nodesRef.current.forEach(n => {
        if (!filteredNodeIds.has(n.device.id)) return;

        const pos = toScreen(n.x, n.y);
        const meta = CATEGORY_META[n.device.category];
        const r = n.radius * cam.zoom;

        const isSelected = selectedNode?.id === n.device.id;
        const isHovered = hoveredNode?.id === n.device.id;
        const isInActiveScene = activeSceneDeviceIds.includes(n.device.id);

        let isInCurrentStep = false;
        if (selectedExperiment && selectedExperiment.steps && selectedExperiment.steps.length > 0) {
          const step = selectedExperiment.steps[currentStepIndex];
          isInCurrentStep = step?.activeDeviceIds.includes(n.device.id) ?? false;
        } else if (selectedExperiment) {
          isInCurrentStep = selectedExperiment.deviceIds.includes(n.device.id);
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
        } else if (selectedExperiment && !isInCurrentStep) {
          alpha = 0.14;
        }

        ctx.save();
        ctx.globalAlpha = alpha;

        if (isSelected || isHovered || isInActiveScene || isInCurrentStep) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r + 9 * cam.zoom, 0, Math.PI * 2);
          ctx.strokeStyle = isInActiveScene ? '#10b981' : isInCurrentStep ? '#eab308' : meta.color;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = isInActiveScene ? '#10b981' : isInCurrentStep ? '#eab308' : meta.color;
          ctx.shadowBlur = 20;
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
        grad.addColorStop(0.7, meta.color + 'aa');
        grad.addColorStop(1, '#0f172a');

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = meta.color;
        ctx.shadowBlur = isSelected ? 22 : 6;
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

          const label = userMode === 'student' ? n.device.nameStudent : n.device.nameVi;
          const labelWidth = ctx.measureText(label).width;
          const padH = 7 * cam.zoom;
          const bx = pos.x - labelWidth / 2 - padH;
          const by = pos.y + r + 5 * cam.zoom;
          const bw = labelWidth + padH * 2;
          const bh = Math.max(16, 18 * cam.zoom);

          ctx.fillStyle = isSelected ? 'rgba(30, 41, 59, 0.95)' : isHovered ? 'rgba(15, 23, 42, 0.92)' : 'rgba(8, 12, 28, 0.88)';
          ctx.strokeStyle = isSelected ? meta.color : isHovered ? '#ffffff' : (isInCurrentStep ? '#eab308' : 'rgba(99, 102, 241, 0.35)');
          ctx.lineWidth = isSelected || isHovered || isInCurrentStep ? 1.5 : 1;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(bx, by, bw, bh, 5);
          } else {
            ctx.rect(bx, by, bw, bh);
          }
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isSelected || isHovered ? '#ffffff' : isInCurrentStep ? '#fef08a' : '#cbd5e1';
          ctx.fillText(label, pos.x, by + bh / 2);
        }

        ctx.restore();
      });

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isOpen, filteredEdges, filteredNodeIds, selectedNode, hoveredNode, selectedExperiment, currentStepIndex, activeSceneDeviceIds, isFiringSignal, userMode]);

  // Xử lý chuột / chạm cảm ứng
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
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
      return dx * dx + dy * dy <= (n.radius + 6) * (n.radius + 6);
    });

    if (clicked) {
      audioFX.playNodeClick();
      if (challengeMode && selectedNode && selectedNode.id !== clicked.device.id) {
        const isConnected = NEURAL_SYNAPSE_EDGES.some(
          edge => (edge.source === selectedNode.id && edge.target === clicked.device.id) ||
                  (edge.target === selectedNode.id && edge.source === clicked.device.id)
        );
        if (isConnected) {
          setChallengeScore(s => s + 10);
          setChallengeFeedback(`🎉 CHÍNH XÁC! ${selectedNode.nameStudent} kết nối chuẩn với ${clicked.device.nameStudent}! (+10 điểm)`);
          audioFX.playSuccessChime();
        } else {
          setChallengeFeedback(`❌ Chưa đúng rồi! ${selectedNode.nameStudent} và ${clicked.device.nameStudent} không trực tiếp ghép nối với nhau.`);
          audioFX.playErrorBuzz();
        }
      }
      setSelectedNode(prev => (prev?.id === clicked.device.id ? null : clicked.device));
    } else {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      cameraStartRef.current = { x: cam.x, y: cam.y };
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (isDraggingRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      cameraRef.current.x = cameraStartRef.current.x - dx / cameraRef.current.zoom;
      cameraRef.current.y = cameraStartRef.current.y - dy / cameraRef.current.zoom;
      return;
    }

    const cam = cameraRef.current;
    const wx = (mx - canvas.width / 2) / cam.zoom + cam.x;
    const wy = (my - canvas.height / 2) / cam.zoom + cam.y;

    const hov = nodesRef.current.find(n => {
      if (!filteredNodeIds.has(n.device.id)) return false;
      const dx = n.x - wx;
      const dy = n.y - wy;
      return dx * dx + dy * dy <= (n.radius + 6) * (n.radius + 6);
    });

    setHoveredNode(hov ? hov.device : null);
    canvas.style.cursor = hov ? 'pointer' : isDraggingRef.current ? 'grabbing' : 'grab';
  };

  const handlePointerUp = () => { isDraggingRef.current = false; };
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    cameraRef.current.zoom = Math.max(0.2, Math.min(3.5, cameraRef.current.zoom * factor));
  };

  const handleResetCamera = () => {
    cameraRef.current = { x: 0, y: 0, zoom: 1 };
    setSelectedNode(null);
    setSelectedExperiment(null);
    setCurrentStepIndex(0);
    setChallengeFeedback(null);
    if (canvasRef.current) {
      computeTargetPositions(canvasRef.current.width, canvasRef.current.height, layoutMode);
    }
  };

  const selectedNodeDetails = useMemo(() => {
    if (!selectedNode) return null;
    const outgoing = NEURAL_SYNAPSE_EDGES.filter(e => e.source === selectedNode.id);
    const incoming = NEURAL_SYNAPSE_EDGES.filter(e => e.target === selectedNode.id);
    return { outgoing, incoming };
  }, [selectedNode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full h-[95vh] max-w-7xl flex flex-col bg-[#070b1a] border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-indigo-500/20 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-600/30 border border-indigo-500/40 flex items-center justify-center text-xl shadow-inner">
              🧠
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  {userMode === 'student' ? 'SƠ ĐỒ LIÊN KẾT THIẾT BỊ KHTN THCS' : 'MẠNG NƠ-RON THẦN KINH OPENLAB 3D (CHUYÊN GIA)'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-medium">
                  {userMode === 'student' ? 'Dành cho Học sinh Lớp 6 - 9' : 'Chuẩn RWSS v1.1.1'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {userMode === 'student'
                  ? 'Khám phá cách các thiết bị kết hợp với nhau qua từng bước làm thí nghiệm'
                  : 'Kiến trúc tương tác nhân quả 36 thiết bị & 15 cổng connector Thông tư 38/2021/TT-BGDĐT'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* NÚT MỞ BẢNG ĐIỀU HƯỚNG KHI ĐANG THU GỌN */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 text-white text-xs font-semibold shadow-xl flex items-center gap-1.5 transition-all"
              >
                <span>📂</span>
                <span>Chọn bài thực hành</span>
              </button>
            )}

            {/* NÚT CHUYỂN ĐỔI DUAL-MODE */}
            <div className="flex rounded-xl bg-slate-900/90 p-1 border border-indigo-500/30 text-xs">
              <button
                onClick={() => setUserMode('student')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  userMode === 'student'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🎒</span>
                <span>Học sinh</span>
              </button>
              <button
                onClick={() => setUserMode('expert')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  userMode === 'expert'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🔬</span>
                <span>Chuyên gia</span>
              </button>
            </div>

            {/* BỘ LỌC KHỐI LỚP */}
            <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800 text-xs">
              {(['ALL', 'grade6', 'grade7', 'grade8', 'grade9'] as const).map(gr => (
                <button
                  key={gr}
                  onClick={() => setSelectedGrade(gr)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    selectedGrade === gr
                      ? 'bg-indigo-600 text-white font-medium shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {gr === 'ALL' ? 'Tất cả lớp' : gr === 'grade6' ? 'Lớp 6' : gr === 'grade7' ? 'Lớp 7' : gr === 'grade8' ? 'Lớp 8' : 'Lớp 9'}
                </button>
              ))}
            </div>

            {/* BẬT MINI GAME THỬ THÁCH NỐI MẠCH */}
            <button
              onClick={() => {
                setChallengeMode(prev => !prev);
                setChallengeFeedback(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                challengeMode
                  ? 'bg-amber-500/25 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>🎮</span>
              <span>{challengeMode ? `Thử thách: ${challengeScore}đ` : 'Thử thách nối mạch'}</span>
            </button>

            {/* Nút đóng */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/60 hover:bg-rose-500/20 hover:border-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* WORKSPACE BODY */}
        <div className="relative flex-1 flex overflow-hidden">
          
          {/* THANH ĐIỀU HƯỚNG TRÁI: CỐ ĐỊNH KÍCH THƯỚC 320PX & CÓ THỂ THU GỌN */}
          <div
            className={`transition-all duration-300 border-r border-indigo-500/15 bg-slate-950/80 backdrop-blur-md flex flex-col p-4 gap-3.5 overflow-y-auto ${
              isSidebarOpen ? 'w-[320px] flex-shrink-0' : 'w-0 p-0 overflow-hidden border-none opacity-0 pointer-events-none'
            }`}
          >
            {/* Tiêu đề thanh trái & Nút thu gọn */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🔬</span>
                <span>Bài Thực Hành SGK</span>
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 flex items-center gap-1 transition-all"
                title="Thu gọn bảng điều khiển để mở rộng toàn màn hình sơ đồ"
              >
                <span>◀ Thu gọn</span>
              </button>
            </div>

            {/* Thanh tìm kiếm */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                🔍 Tìm kiếm dụng cụ thí nghiệm
              </label>
              <input
                type="text"
                placeholder={userMode === 'student' ? 'Gõ tên dụng cụ (cân, đèn, kính)...' : 'Mã asset hoặc tên quy chuẩn...'}
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Box thử thách */}
            {challengeMode && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>🎯 Hướng dẫn thử thách:</span>
                </div>
                <p className="text-[11px] text-amber-200/90 mt-1">
                  1. Nhấp chọn 1 thiết bị phát tín hiệu.<br/>
                  2. Nhấp chọn tiếp thiết bị mà bạn nghĩ nó sẽ liên kết trực tiếp tới!
                </p>
                {challengeFeedback && (
                  <div className="mt-2 p-2 rounded bg-black/40 text-[11px] font-medium border border-amber-500/30 text-amber-100">
                    {challengeFeedback}
                  </div>
                )}
              </div>
            )}

            {/* Danh sách bài thực hành SGK */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                  🔬 Bài Thực Hành Tiêu Biểu SGK
                </label>
                <span className="text-[10px] text-slate-500">{EXPERIMENT_MACRO_CLUSTERS.length} bài</span>
              </div>

              <div className="flex flex-col gap-2">
                {EXPERIMENT_MACRO_CLUSTERS.map(cluster => {
                  const isActive = selectedExperiment?.id === cluster.id;
                  return (
                    <div
                      key={cluster.id}
                      onClick={() => {
                        if (isActive) {
                          setSelectedExperiment(null);
                          setCurrentStepIndex(0);
                        } else {
                          setSelectedExperiment(cluster);
                          setCurrentStepIndex(0);
                          setSelectedNode(null);
                          audioFX.playNodeClick();
                        }
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        isActive
                          ? 'bg-indigo-600/25 border-indigo-500 shadow-md shadow-indigo-500/15'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-100">{cluster.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                          {cluster.grade}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {userMode === 'student' ? cluster.studentGoal : cluster.description}
                      </p>

                      {/* TIẾN TRÌNH TỪNG BƯỚC */}
                      {isActive && cluster.steps && cluster.steps.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-indigo-500/30">
                          <div className="flex items-center justify-between text-[11px] text-amber-300 font-semibold mb-1.5">
                            <span>Tiến trình từng bước SGK:</span>
                            <span>{currentStepIndex + 1} / {cluster.steps.length}</span>
                          </div>

                          <div className="p-2 rounded-lg bg-black/50 border border-indigo-500/30 mb-2">
                            <div className="font-medium text-white text-[11px]">
                              {cluster.steps[currentStepIndex].title}
                            </div>
                            <p className="text-[10px] text-slate-300 mt-0.5">
                              {cluster.steps[currentStepIndex].instruction}
                            </p>
                            <div className="text-[9px] text-amber-300/90 mt-1 italic">
                              💡 Mẹo: {cluster.steps[currentStepIndex].focusNote}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <button
                              disabled={currentStepIndex === 0}
                              onClick={e => {
                                e.stopPropagation();
                                setCurrentStepIndex(i => Math.max(0, i - 1));
                                audioFX.playNodeClick();
                              }}
                              className="px-2 py-1 rounded bg-slate-800 disabled:opacity-40 text-[10px] text-slate-200"
                            >
                              ◀ Bước trước
                            </button>
                            <button
                              disabled={currentStepIndex === cluster.steps.length - 1}
                              onClick={e => {
                                e.stopPropagation();
                                setCurrentStepIndex(i => Math.min(cluster.steps.length - 1, i + 1));
                                audioFX.playNodeClick();
                              }}
                              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-[10px] text-white font-medium"
                            >
                              Bước tiếp ▶
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CANVAS TRUNG TÂM */}
          <div className="relative flex-1 bg-black overflow-hidden">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onWheel={handleWheel}
              className="w-full h-full block"
            />

            {/* THANH ĐIỀU KHIỂN DƯỚI ĐÁY */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/85 border border-slate-800 backdrop-blur-md shadow-2xl text-xs">
              <button
                onClick={handleResetCamera}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1.5"
              >
                🎯 Căn giữa
              </button>
              <button
                onClick={() => setIsFiringSignal(prev => !prev)}
                className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                  isFiringSignal ? 'bg-indigo-600/30 border border-indigo-500 text-indigo-300' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {isFiringSignal ? '⚡ Xung tín hiệu: BẬT' : '⏸ Xung: TẮT'}
              </button>
              <button
                onClick={handleToggleSound}
                className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                  !isSoundMuted ? 'bg-indigo-600/30 border border-indigo-500 text-indigo-300' : 'bg-slate-900 text-slate-400'
                }`}
                title="Bật/Tắt âm thanh tương tác"
              >
                {!isSoundMuted ? '🔊 Âm thanh' : '🔇 Tắt tiếng'}
              </button>
              <button
                onClick={handleExportDiagramPng}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1.5"
                title="Lưu ảnh sơ đồ để dán vào báo cáo thực hành"
              >
                📸 Xuất ảnh PNG
              </button>
              <button
                onClick={() => {
                  const nextMode = layoutMode === 'circular' ? 'neural_layers' : 'circular';
                  setLayoutMode(nextMode);
                  if (canvasRef.current) computeTargetPositions(canvasRef.current.width, canvasRef.current.height, nextMode);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
              >
                🔄 Bố cục: {layoutMode === 'circular' ? 'Vòng tròn' : 'Đa tầng'}
              </button>
              <div className="h-4 w-px bg-slate-800" />
              <span className="text-[11px] text-slate-400">
                {filteredNodes.length} thiết bị · {filteredEdges.length} khớp nối
              </span>
            </div>
          </div>

          {/* SIDEBAR PHẢI: CHI TIẾT THIẾT BỊ NƠ-RON */}
          {selectedNode && selectedNodeDetails && (
            <div className="w-[340px] flex-shrink-0 border-l border-indigo-500/15 bg-slate-950/90 backdrop-blur-md flex flex-col p-5 overflow-y-auto">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedNode.glyphIcon}</span>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {userMode === 'student' ? selectedNode.nameStudent : selectedNode.nameVi}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {userMode === 'student' ? selectedNode.nameVi : selectedNode.nameEn}
                      </p>
                    </div>
                  </div>
                  {userMode === 'expert' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mt-1 inline-block">
                      {selectedNode.assetId}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-white text-sm p-1"
                >
                  ✕
                </button>
              </div>

              {/* Tag phân loại & lớp */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span
                  className="text-[11px] px-2.5 py-1 rounded-lg font-medium"
                  style={{
                    backgroundColor: `${CATEGORY_META[selectedNode.category].color}25`,
                    color: CATEGORY_META[selectedNode.category].color
                  }}
                >
                  {userMode === 'student' ? CATEGORY_META[selectedNode.category].studentName : CATEGORY_META[selectedNode.category].name}
                </span>
                <span className="text-[10px] px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-indigo-300 font-medium">
                  {selectedNode.grades.map(g => g.replace('grade', 'Lớp ')).join(', ')}
                </span>
              </div>

              {/* Mẹo an toàn */}
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <span>💡 Mẹo thao tác đúng & an toàn:</span>
                </div>
                <p className="text-[11px] text-amber-100/90 mt-1 leading-relaxed">
                  {selectedNode.studentTip}
                </p>
              </div>

              {/* Công thức */}
              <div className="mt-3">
                <label className="text-[11px] font-semibold uppercase text-slate-400">
                  {userMode === 'student' ? 'Công thức SGK quen thuộc' : 'Phương trình toán học chuẩn'}
                </label>
                <div className="mt-1 px-3 py-2 bg-indigo-950/40 border border-indigo-500/30 rounded-xl font-mono text-xs text-indigo-200">
                  {userMode === 'student' ? (selectedNode.sgkFormula || selectedNode.mathFormula) : selectedNode.mathFormula}
                </div>
              </div>

              {/* Cổng kết nối */}
              <div className="mt-3">
                <label className="text-[11px] font-semibold uppercase text-slate-400">
                  {userMode === 'student' ? 'Vị trí cắm & gá lắp trên dụng cụ' : 'Cổng Connector RWSS v1.1.1'}
                </label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(userMode === 'student' ? selectedNode.studentPorts : selectedNode.ports).map(p => (
                    <span
                      key={p}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Liên kết đầu ra */}
              <div className="mt-4">
                <label className="text-[11px] font-semibold uppercase text-indigo-400">
                  {userMode === 'student' ? '→ Tác động truyền tới' : '→ Axon Output Synapses'} ({selectedNodeDetails.outgoing.length})
                </label>
                <div className="flex flex-col gap-2 mt-1.5">
                  {selectedNodeDetails.outgoing.map(edge => {
                    const tgt = NEURAL_DEVICE_NODES.find(n => n.id === edge.target);
                    const meta = SYNAPSE_META[edge.type];
                    return (
                      <div key={edge.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between font-medium text-slate-200">
                          <span>{userMode === 'student' ? tgt?.nameStudent : tgt?.nameVi}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${meta.color}25`, color: meta.color }}>
                            {userMode === 'student' ? meta.studentName : meta.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {userMode === 'student' ? edge.studentCausal : edge.causalRule}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Liên kết đầu vào */}
              <div className="mt-4">
                <label className="text-[11px] font-semibold uppercase text-emerald-400">
                  {userMode === 'student' ? '← Nhận tương tác từ' : '← Dendrite Input Synapses'} ({selectedNodeDetails.incoming.length})
                </label>
                <div className="flex flex-col gap-2 mt-1.5">
                  {selectedNodeDetails.incoming.map(edge => {
                    const src = NEURAL_DEVICE_NODES.find(n => n.id === edge.source);
                    const meta = SYNAPSE_META[edge.type];
                    return (
                      <div key={edge.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between font-medium text-slate-200">
                          <span>{userMode === 'student' ? src?.nameStudent : src?.nameVi}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${meta.color}25`, color: meta.color }}>
                            {userMode === 'student' ? meta.studentName : meta.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {userMode === 'student' ? edge.studentCausal : edge.causalRule}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nút nạp vào phòng lab 3D */}
              {onSelectDevice && (
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => onSelectDevice(selectedNode.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>➕ Đưa vào Bàn Thí Nghiệm 3D</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
