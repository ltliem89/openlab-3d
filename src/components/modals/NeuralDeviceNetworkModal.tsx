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
  flowDirection: 'outflow' | 'inflow' | 'bidirectional';
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

// Hàm chắt lọc diễn giải nhân quả ngắn gọn, súc tích, tránh từ ngữ thừa thãi
const distillCausal = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/^Thả\s+/i, '')
    .replace(/^Nhẹ nhàng\s+/i, '')
    .replace(/^Vặn\s+/i, '')
    .replace(/nhé các em!?/gi, '')
    .replace(/\s*->\s*/g, ' → ')
    .trim();
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
}

const audioFX = new ProceduralAudio();

export const NeuralDeviceNetworkModal: React.FC<NeuralDeviceNetworkModalProps> = ({
  isOpen,
  initialDeviceId,
  onClose,
  onSelectDevice,
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
  const [layoutMode, setLayoutMode] = useState<'circular' | 'neural_layers'>('circular');
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
  const lastClickTimeRef = useRef<number>(0);

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
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
      }

      const w = canvas.width;
      const h = canvas.height;
      const cam = cameraRef.current;

      nodesRef.current.forEach(n => {
        n.x += (n.tx - n.x) * 0.08;
        n.y += (n.ty - n.y) * 0.08;
      });

      if (isFiringSignal && filteredEdges.length > 0) {
        if (particlesRef.current.length < 240 && Math.random() < 0.45) {
          const edge = filteredEdges[Math.floor(Math.random() * filteredEdges.length)];
          const srcNode = nodesRef.current.find(n => n.device.id === edge.source);
          const tgtNode = nodesRef.current.find(n => n.device.id === edge.target);
          if (srcNode && tgtNode) {
            let color = '#6366f1'; // Mặc định lam tím neon (cùng cấp / gợi ý)
            let flowDirection: 'outflow' | 'inflow' | 'bidirectional' = 'bidirectional';

            if (selectedNode) {
              if (edge.source === selectedNode.id) {
                color = '#0080ff'; // Dòng chảy ra: Xanh dương neon
                flowDirection = 'outflow';
              } else if (edge.target === selectedNode.id) {
                color = '#b026ff'; // Dòng chảy vào: Tím neon
                flowDirection = 'inflow';
              }
            } else {
              // Phân định dòng năng lượng theo nhóm chức năng
              if (['G07_ELECTRICITY', 'G06_OPTICS', 'G10_FLUID_SUPPLY'].includes(srcNode.device.category)) {
                color = '#0080ff';
                flowDirection = 'outflow';
              } else if (['G02_MASS_FORCE', 'G04_VOLUMETRIC', 'G03_TIME_TEMP'].includes(tgtNode.device.category)) {
                color = '#b026ff';
                flowDirection = 'inflow';
              }
            }

            // Tạo chuỗi 3 hạt photon nhỏ liên tiếp chảy thành dòng (kích thước giảm 50%)
            for (let sIdx = 0; sIdx < 3; sIdx++) {
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
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.progress += p.speed * dt;
        if (p.progress >= 1) particlesRef.current.splice(i, 1);
      }

      // ĐẢM BẢO NỀN TRONG SUỐT HOÀN TOÀN (TRANSPARENT BACKGROUND)
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      const gridSize = 45 * cam.zoom;
      const offX = (-cam.x * cam.zoom + w / 2) % gridSize;
      const offY = (-cam.y * cam.zoom + h / 2) % gridSize;
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.04)';
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

      // Vẽ khớp nối Synapse (Độ dày nét 1.2, màu Neon chuẩn)
      filteredEdges.forEach(edge => {
        const src = nodesRef.current.find(n => n.device.id === edge.source);
        const tgt = nodesRef.current.find(n => n.device.id === edge.target);
        if (!src || !tgt) return;

        const sPos = toScreen(src.x, src.y);
        const tPos = toScreen(tgt.x, tgt.y);

        let strokeColor = '#6366f1'; // Lam tím neon
        if (selectedNode) {
          if (edge.source === selectedNode.id) {
            strokeColor = '#0080ff'; // Xanh dương neon
          } else if (edge.target === selectedNode.id) {
            strokeColor = '#b026ff'; // Tím neon
          }
        }

        const meta = SYNAPSE_META[edge.type] || { color: strokeColor };

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
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 2.4 * cam.zoom;
          ctx.shadowColor = strokeColor;
          ctx.shadowBlur = 12;
          ctx.globalAlpha = 1.0;
        } else {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.2 * cam.zoom;
          ctx.shadowColor = strokeColor;
          ctx.shadowBlur = 4;
          ctx.globalAlpha = selectedNode || selectedExperiment ? 0.12 : 0.38;
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
        const arrowL = 5.8 * cam.zoom;

        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(ax + (adx / adist) * arrowL, ay + (ady / adist) * arrowL);
        ctx.lineTo(ax - (ady / adist) * (arrowL * 0.6) - (adx / adist) * arrowL, ay + (adx / adist) * (arrowL * 0.6) - (ady / adist) * arrowL);
        ctx.lineTo(ax + (ady / adist) * (arrowL * 0.6) - (adx / adist) * arrowL, ay - (adx / adist) * (arrowL * 0.6) - (ady / adist) * arrowL);
        ctx.closePath();
        ctx.fillStyle = strokeColor;
        ctx.shadowColor = strokeColor;
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.restore();
      });

      // Vẽ hạt photon phát sáng Neon
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
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
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

        if (isSelected || isHovered || isInActiveScene || isInCurrentExperiment) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r + 9 * cam.zoom, 0, Math.PI * 2);
          ctx.strokeStyle = isInActiveScene ? '#10b981' : isInCurrentExperiment ? '#eab308' : meta.color;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = isInActiveScene ? '#10b981' : isInCurrentExperiment ? '#eab308' : meta.color;
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

          // BIỆN PHÁP 1: RÚT GỌN TỪ KHÓA NHÃN (PILL-TAGS THÔNG MINH)
          // Mặc định: Hiển thị shortKeyword ngắn gọn (6-12 ký tự, rộng 60-90px)
          // Khi chọn hoặc hover hoặc trong bài thực hành đang mở: Hiển thị tên đầy đủ
          const isExpanded = isSelected || isHovered || isInCurrentExperiment;
          const label = isExpanded
            ? (userMode === 'student' ? n.device.nameStudent : n.device.nameVi)
            : (n.device.shortKeyword || (userMode === 'student' ? n.device.nameStudent : n.device.nameVi));

          const labelWidth = ctx.measureText(label).width;
          const padH = 6 * cam.zoom;
          const bw = labelWidth + padH * 2;
          const bh = Math.max(16, 18 * cam.zoom);

          // BIỆN PHÁP 2: ĐẶT NHÃN HƯỚNG TÂM MỞ RA NGOÀI (RADIAL OUTWARD ANCHORING)
          let bx = pos.x - bw / 2;
          let by = pos.y + r + 5 * cam.zoom;

          if (layoutMode === 'circular') {
            const len = Math.hypot(n.x, n.y) || 1;
            const ux = n.x / len;
            const uy = n.y / len;

            if (uy < -0.42) {
              // Nửa trên vòng tròn: Nhãn hướng LÊN PHÍA TRÊN (thoát khỏi tâm đồ thị)
              by = pos.y - r - bh - 5 * cam.zoom;
              bx = pos.x - bw / 2 + ux * 10 * cam.zoom;
            } else if (uy > 0.42) {
              // Nửa dưới vòng tròn: Nhãn hướng XUỐNG PHÍA DƯỚI
              by = pos.y + r + 5 * cam.zoom;
              bx = pos.x - bw / 2 + ux * 10 * cam.zoom;
            } else if (ux > 0) {
              // Phía sườn bên phải: Nhãn nằm BÊN PHẢI nút
              bx = pos.x + r + 7 * cam.zoom;
              by = pos.y - bh / 2 + uy * 8 * cam.zoom;
            } else {
              // Phía sườn bên trái: Nhãn nằm BÊN TRÁI nút
              bx = pos.x - r - bw - 7 * cam.zoom;
              by = pos.y - bh / 2 + uy * 8 * cam.zoom;
            }
          } else {
            // Layout đa tầng: So le nhãn trên/dưới
            const isStaggerAbove = (n.device.id.charCodeAt(0) % 2 === 0);
            if (isStaggerAbove) {
              by = pos.y - r - bh - 5 * cam.zoom;
            } else {
              by = pos.y + r + 5 * cam.zoom;
            }
          }

          ctx.fillStyle = isSelected ? 'rgba(30, 41, 59, 0.96)' : isHovered ? 'rgba(15, 23, 42, 0.94)' : 'rgba(8, 12, 28, 0.90)';
          ctx.strokeStyle = isSelected ? meta.color : isHovered ? '#ffffff' : (isInCurrentExperiment ? '#eab308' : 'rgba(99, 102, 241, 0.35)');
          ctx.lineWidth = isSelected || isHovered || isInCurrentExperiment ? 1.5 : 1;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(bx, by, bw, bh, 5);
          } else {
            ctx.rect(bx, by, bw, bh);
          }
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isSelected || isHovered ? '#ffffff' : isInCurrentExperiment ? '#fef08a' : '#cbd5e1';
          ctx.fillText(label, bx + bw / 2, by + bh / 2);
        }

        ctx.restore();
      });

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isOpen, filteredEdges, filteredNodeIds, selectedNode, hoveredNode, selectedExperiment, activeSceneDeviceIds, isFiringSignal, userMode]);

  // Căn giữa camera mượt mà
  const handleResetCamera = () => {
    cameraRef.current = { x: 0, y: 0, zoom: 1 };
    setSelectedNode(null);
    setSelectedExperiment(null);
    setChallengeFeedback(null);
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
          setChallengeFeedback(`❌ Chưa đúng rồi! ${selectedNode.nameStudent} và ${clicked.device.nameStudent} không trực tiếp ghép nối.`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-2 md:p-4 animate-in fade-in duration-200">
      <div className="relative w-full h-[96vh] max-w-7xl flex flex-col bg-slate-950/20 backdrop-blur-2xl border border-cyan-500/35 rounded-2xl shadow-[0_0_60px_rgba(0,243,255,0.15)] overflow-hidden text-slate-200">
        
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-600/30 border border-indigo-500/40 flex items-center justify-center text-lg shadow-inner">
              🧠
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  {userMode === 'student' ? 'SƠ ĐỒ LIÊN KẾT THIẾT BỊ KHTN THCS' : 'MẠNG NƠ-RON THẦN KINH OPENLAB 3D (CHUYÊN GIA)'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-medium">
                  {userMode === 'student' ? 'Học sinh Lớp 6 - 9' : 'Chuẩn RWSS v1.1.1'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {userMode === 'student'
                  ? 'Mạng liên kết nhân quả giữa các dụng cụ thí nghiệm khoa học tự nhiên'
                  : 'Kiến trúc tương tác nhân quả 36 thiết bị & 15 cổng connector Thông tư 38/2021/TT-BGDĐT'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* NÚT MỞ BẢNG ĐIỀU HƯỚNG KHI ĐANG THU GỌN */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 text-white text-xs font-semibold shadow-xl flex items-center gap-1.5 transition-all"
              >
                <span>📂</span>
                <span>Bài thực hành</span>
              </button>
            )}

            {/* NÚT CHUYỂN ĐỔI DUAL-MODE */}
            <div className="flex rounded-xl bg-slate-900/90 p-1 border border-indigo-500/30 text-xs">
              <button
                onClick={() => setUserMode('student')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
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
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
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
                  className={`px-2 py-1 rounded-lg transition-all text-[11px] ${
                    selectedGrade === gr
                      ? 'bg-indigo-600 text-white font-medium shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {gr === 'ALL' ? 'Tất cả' : gr === 'grade6' ? 'Lớp 6' : gr === 'grade7' ? 'Lớp 7' : gr === 'grade8' ? 'Lớp 8' : 'Lớp 9'}
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
                  ? 'bg-amber-500/25 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>🎮</span>
              <span>{challengeMode ? `Thử thách: ${challengeScore}đ` : 'Thử thách'}</span>
            </button>

            {/* Nút đóng */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/60 hover:bg-rose-500/20 hover:border-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        {/* WORKSPACE BODY */}
        <div className="relative flex-1 flex overflow-hidden">
          
          {/* THANH ĐIỀU HƯỚNG TRÁI: DANH SÁCH BÀI THỰC HÀNH SGK (TỐI GIẢN, GỌN GÀNG, KHÔNG RỐI MẮT) */}
          <div
            className={`transition-all duration-300 border-r border-white/10 bg-slate-950/40 backdrop-blur-2xl flex flex-col p-3.5 gap-3 overflow-y-auto ${
              isSidebarOpen ? 'w-[275px] flex-shrink-0' : 'w-0 p-0 overflow-hidden border-none opacity-0 pointer-events-none'
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
                className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 flex items-center gap-1 transition-all"
                title="Thu gọn bảng để mở rộng sơ đồ nơ-ron"
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
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Danh sách bài thực hành SGK (Chỉ hiển thị tên bài hoặc tên thí nghiệm, không hiển thị bước làm rối) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Danh Mục Bài Học ({filteredExperiments.length})
                </span>
                {selectedExperiment && (
                  <button
                    onClick={() => setSelectedExperiment(null)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 underline"
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
                          ? 'bg-indigo-600/30 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)] text-white'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-[11.5px] leading-snug">
                        {cluster.title}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-indigo-500/25 border border-indigo-400/30 text-indigo-300 font-medium">
                          {cluster.grade}
                        </span>
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {cluster.subject}
                        </span>
                        <span className="text-[9.5px] text-slate-500 ml-auto">
                          {cluster.deviceIds.length} dụng cụ
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CANVAS TRUNG TÂM (NỀN TRONG SUỐT HOÀN TOÀN, ĐẢM BẢO TỶ LỆ 1:1 KHÔNG BỊ BIẾN DẠNG) */}
          <div className="relative flex-1 bg-transparent overflow-hidden">
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

            {/* THÔNG BÁO THỬ THÁCH NỔI TRÊN CANVAS (GIỮ GỌN BẢNG BÊN TRÁI) */}
            {challengeMode && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950/80 border border-amber-500/50 backdrop-blur-md text-xs shadow-lg animate-in fade-in">
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <span>🎯 Thử thách:</span>
                  <span className="text-white font-normal">Nhấp 2 thiết bị liên kết nhân quả!</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-300 font-bold border border-amber-500/40">
                  {challengeScore} điểm
                </span>
                {challengeFeedback && (
                  <span className="text-[11px] text-amber-200 pl-2 border-l border-amber-500/40">
                    {challengeFeedback}
                  </span>
                )}
              </div>
            )}

            {/* THANH ĐIỀU KHIỂN DƯỚI ĐÁY */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/45 border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-xs">
              <button
                onClick={handleResetCamera}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1.5"
                title="Đưa góc nhìn về vị trí chuẩn (hoặc nhấp đúp chuột lên màn hình)"
              >
                🎯 Căn giữa
              </button>
              <button
                onClick={() => setIsFiringSignal(prev => !prev)}
                className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                  isFiringSignal ? 'bg-indigo-600/30 border border-indigo-500 text-indigo-300' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {isFiringSignal ? '⚡ Xung: BẬT' : '⏸ Xung: TẮT'}
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
                title="Lưu ảnh sơ đồ nơ-ron PNG"
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

          {/* SIDEBAR PHẢI: CHI TIẾT THIẾT BỊ NƠ-RON (CHẮT LỌC TỪ NGỮ GỌN ĐỦ NGHĨA, TRÁNH RỐI MẮT) */}
          {selectedNode && selectedNodeDetails && (
            <div className="w-[310px] flex-shrink-0 border-l border-white/10 bg-slate-950/40 backdrop-blur-2xl flex flex-col p-4 overflow-y-auto">
              {/* Header thiết bị */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
                    {selectedNode.glyphIcon}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {userMode === 'student' ? selectedNode.nameStudent : selectedNode.nameVi}
                    </h3>
                    <p className="text-[10.5px] text-slate-400">
                      {userMode === 'student' ? selectedNode.nameVi : selectedNode.nameEn}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-xs"
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
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-indigo-300 font-medium">
                  {selectedNode.grades.map(g => g.replace('grade', 'Lớp ')).join(', ')}
                </span>
              </div>

              {/* KHUNG QUY CHUẨN & NGUYÊN LÝ (CHẮT LỌC NGẮN GỌN, SÚC TÍCH) */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-md space-y-2 text-[10.5px]">
                <div className="text-slate-200 leading-snug">
                  <span className="text-cyan-300 font-bold">🎯 Thao tác: </span>
                  <span>{selectedNode.description || 'Lắp ráp đúng trục và cắm tiếp điểm tương thích.'}</span>
                </div>

                {selectedNode.studentTip && (
                  <div className="text-amber-200/90 leading-snug">
                    <span className="text-amber-300 font-bold">⚠️ Lưu ý: </span>
                    <span>{selectedNode.studentTip}</span>
                  </div>
                )}

                {(selectedNode.mathFormula || selectedNode.sgkFormula) && (
                  <div className="p-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/25 font-mono text-[10px] text-indigo-200">
                    <span className="text-indigo-300 font-sans font-bold text-[9.5px] block mb-0.5">📐 Định luật / Công thức:</span>
                    <span>${selectedNode.mathFormula || selectedNode.sgkFormula}$</span>
                  </div>
                )}
              </div>

              {/* Cổng kết nối */}
              {(selectedNode.studentPorts.length > 0 || selectedNode.ports.length > 0) && (
                <div className="mt-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Cổng liên kết:
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(userMode === 'student' ? selectedNode.studentPorts : selectedNode.ports).map(p => (
                      <span
                        key={p}
                        className="text-[9.5px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-emerald-300"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dòng chảy ra (Xanh Dương Neon) */}
              <div className="mt-3">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#0080ff] flex items-center gap-1.5">
                  <span>➔</span>
                  <span>Dòng Chảy Ra (Xanh Dương Neon):</span>
                  <span className="text-[9.5px] opacity-80 font-normal">({selectedNodeDetails.outgoing.length})</span>
                </label>
                <div className="flex flex-col gap-1.5 mt-1">
                  {selectedNodeDetails.outgoing.length === 0 ? (
                    <div className="text-[10px] text-slate-500 italic p-1.5 rounded bg-slate-900/40">
                      Không có kết nối phát tín hiệu đi
                    </div>
                  ) : (
                    selectedNodeDetails.outgoing.map(edge => {
                      const tgt = NEURAL_DEVICE_NODES.find(n => n.id === edge.target);
                      const meta = SYNAPSE_META[edge.type];
                      return (
                        <div
                          key={edge.id}
                          onClick={() => tgt && setSelectedNode(tgt)}
                          className="p-2 rounded-xl bg-blue-950/25 hover:bg-blue-950/50 border border-blue-500/35 hover:border-blue-400 text-xs cursor-pointer transition-all shadow-[0_0_10px_rgba(0,128,255,0.12)]"
                          title="Nhấp để xem thiết bị này"
                        >
                          <div className="flex items-center justify-between font-bold text-blue-200 text-[11px]">
                            <span>{userMode === 'student' ? tgt?.nameStudent : tgt?.nameVi}</span>
                            <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-400/40 text-blue-300">
                              {userMode === 'student' ? meta.studentName : meta.name}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                            {distillCausal(userMode === 'student' ? edge.studentCausal : edge.causalRule)}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Dòng chảy vào (Tím Neon) */}
              <div className="mt-3">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#b026ff] flex items-center gap-1.5">
                  <span>➔</span>
                  <span>Dòng Chảy Vào (Tím Neon):</span>
                  <span className="text-[9.5px] opacity-80 font-normal">({selectedNodeDetails.incoming.length})</span>
                </label>
                <div className="flex flex-col gap-1.5 mt-1">
                  {selectedNodeDetails.incoming.length === 0 ? (
                    <div className="text-[10px] text-slate-500 italic p-1.5 rounded bg-slate-900/40">
                      Không có kết nối nhận tín hiệu vào
                    </div>
                  ) : (
                    selectedNodeDetails.incoming.map(edge => {
                      const src = NEURAL_DEVICE_NODES.find(n => n.id === edge.source);
                      const meta = SYNAPSE_META[edge.type];
                      return (
                        <div
                          key={edge.id}
                          onClick={() => src && setSelectedNode(src)}
                          className="p-2 rounded-xl bg-purple-950/25 hover:bg-purple-950/50 border border-purple-500/35 hover:border-purple-400 text-xs cursor-pointer transition-all shadow-[0_0_10px_rgba(176,38,255,0.12)]"
                          title="Nhấp để xem thiết bị này"
                        >
                          <div className="flex items-center justify-between font-bold text-purple-200 text-[11px]">
                            <span>{userMode === 'student' ? src?.nameStudent : src?.nameVi}</span>
                            <span className="text-[8.5px] px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-400/40 text-purple-300">
                              {userMode === 'student' ? meta.studentName : meta.name}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                            {distillCausal(userMode === 'student' ? edge.studentCausal : edge.causalRule)}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Nút nạp vào phòng lab 3D */}
              {onSelectDevice && (
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => onSelectDevice(selectedNode.id)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-[11px] shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
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
