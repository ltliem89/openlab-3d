import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  MICROSCOPE_SPECIMENS,
  OBJECTIVE_SPECS,
  SpecimenDefinition,
  SpecimenCategory,
  StructureAnnotation,
} from '../../data/microscopeSpecimenCatalog';
import { MicroscopeSpecimenSvgRenderer } from './MicroscopeSpecimenSvgRenderer';
import { labSoundEngine } from '../../three-runtime/LabSoundEngine';
import {
  Maximize2,
  Minimize2,
  X,
  Volume2,
  VolumeX,
  Eye,
  Camera,
  Sun,
  SunDim,
  Sliders,
  Move,
  RotateCcw,
  BookOpen,
  Info,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  AlertTriangle,
  Layers,
  Crosshair,
  Sparkles,
  ChevronRight,
  ListOrdered,
  ZoomIn,
} from 'lucide-react';

interface MicroscopeSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSpecimenId?: string;
  initialObjectiveMag?: number;
  onSyncWith3DScene?: (state: {
    magnification: number;
    specimenId: string;
    focusZ: number;
    stageX: number;
    stageY: number;
    isLightOn: boolean;
    brightness: number;
  }) => void;
}

export const MicroscopeSimulationModal: React.FC<
  MicroscopeSimulationModalProps
> = ({
  isOpen,
  onClose,
  initialSpecimenId = 'spc-paramecium',
  initialObjectiveMag = 10,
  onSyncWith3DScene,
}) => {
  // 1. Trạng thái mẫu vật
  const [selectedSpecimenId, setSelectedSpecimenId] = useState<string>(initialSpecimenId);
  const [selectedCategory, setSelectedCategory] = useState<SpecimenCategory | 'all'>('all');
  const [activeAnnotation, setActiveAnnotation] = useState<StructureAnnotation | null>(null);

  // 2. Trạng thái quang học & mâm vật kính
  const [objectiveMag, setObjectiveMag] = useState<number>(initialObjectiveMag);
  const [eyepieceMag, setEyepieceMag] = useState<10 | 16>(10);
  const totalMagnification = objectiveMag * eyepieceMag;

  // 3. Trạng thái cơ học (Bàn sa trượt X/Y và Lấy nét thô/tinh Z)
  const [coarseFocusZ, setCoarseFocusZ] = useState<number>(5.0); // mm (bước lớn 0.5mm)
  const [fineFocusZ, setFineFocusZ] = useState<number>(0.0); // mm (bước nhỏ ±0.02mm)
  const [stageX, setStageX] = useState<number>(0); // mm (-20 đến 20)
  const [stageY, setStageY] = useState<number>(0); // mm (-20 đến 20)

  // Thẻ nổi thông tin mẫu vật khi rê chuột (Specimen Hover Information Card)
  const [hoveredSpecimen, setHoveredSpecimen] = useState<{
    spc: SpecimenDefinition;
    rect: DOMRect;
  } | null>(null);
  const specimenHoverTimeoutRef = useRef<number | null>(null);

  // 4. Trạng thái chiếu sáng & khẩu độ
  const [isLightOn, setIsLightOn] = useState<boolean>(true);
  const [brightness, setBrightness] = useState<number>(0.85); // 0.0 đến 1.0
  const [diaphragm, setDiaphragm] = useState<number>(0.65); // 0.1 đến 1.0

  // 5. Trạng thái giao diện hỗ trợ quan sát
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [showReticle, setShowReticle] = useState<boolean>(false);
  const [showPrepModal, setShowPrepModal] = useState<boolean>(false);
  const [prepStepIndex, setPrepStepIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  // Animation timer cho sinh vật sống chuyển động
  const [animTimeSec, setAnimTimeSec] = useState<number>(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setAnimTimeSec((t) => t + dt);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Tìm mẫu vật hiện hành
  const currentSpecimen = useMemo(() => {
    return (
      MICROSCOPE_SPECIMENS.find((s) => s.id === selectedSpecimenId) ||
      MICROSCOPE_SPECIMENS[0]
    );
  }, [selectedSpecimenId]);

  // Thông số vật kính hiện hành
  const currentObjSpec = useMemo(() => {
    return OBJECTIVE_SPECS[objectiveMag] || OBJECTIVE_SPECS[10];
  }, [objectiveMag]);

  // TÍNH TOÁN QUANG HỌC TIÊU CỰ RIÊNG TỪNG MẪU VẬT:
  // Tiêu cự chuẩn z0 của mẫu vật hiện hành (mm)
  const targetFocusZ = currentSpecimen.optimalFocusZ;
  const totalFocusZ = Number((coarseFocusZ + fineFocusZ).toFixed(3));
  const deltaZ = Number((totalFocusZ - targetFocusZ).toFixed(3));
  const absDeltaZ = Math.abs(deltaZ);

  // Chiều sâu trường ảnh hiệu dụng (Effective Depth of Field):
  // Càng ở vật kính cao (40x, 100x), trường nét càng mỏng
  const effTolerance = useMemo(() => {
    return currentSpecimen.focalToleranceMm * (10 / objectiveMag);
  }, [currentSpecimen.focalToleranceMm, objectiveMag]);

  // Tính toán độ mờ quang học (Focal Blur px)
  // Khi |deltaZ| <= effTolerance -> hình ảnh sắc nét tuyệt đối (blur = 0)
  // Khi lệch khỏi tiêu cự -> độ mờ tăng dần tỷ lệ thuận với độ mở số NA & độ phóng đại
  const focalBlurPx = useMemo(() => {
    if (absDeltaZ <= effTolerance) return 0;
    const excess = absDeltaZ - effTolerance;
    const sensitivity = (objectiveMag / 10) * 14.0;
    return Math.min(26, excess * sensitivity);
  }, [absDeltaZ, effTolerance, objectiveMag]);

  // HỆ THỐNG HƯỚNG DẪN THÍCH ỨNG THÔNG MINH (Real-time Diagnostic Coach)
  // Đánh giá trực tiếp trạng thái thực tế: nguồn sáng, khẩu độ, vật kính, độ lệch tiêu cự mm
  const diagnosticCoachInfo = useMemo(() => {
    // 1. Kiểm tra nguồn sáng
    if (!isLightOn) {
      return {
        level: 'danger' as const,
        badge: 'ĐÈN TẮT',
        title: 'Chưa bật nguồn đèn LED',
        advice: 'Bật công tắc nguồn đèn LED phía dưới để có chùm sáng xuyên qua tiêu bản.',
      };
    }
    if (brightness < 0.2) {
      return {
        level: 'warning' as const,
        badge: 'THIẾU SÁNG',
        title: 'Độ sáng LED quá yếu',
        advice: `Tăng chiết áp đèn LED lên khoảng ${(currentSpecimen.optimalBrightness * 100).toFixed(0)}% để làm rõ cấu trúc tế bào.`,
      };
    }

    // 2. Kiểm tra độ phù hợp của vật kính
    if (currentSpecimen.id === 'spc-lactobacillus' && objectiveMag < 40) {
      return {
        level: 'warning' as const,
        badge: 'VK QUÁ NHỎ',
        title: 'Vi khuẩn kích thước siêu hiển vi (1 – 3 µm)',
        advice: 'Ở 4×/10× chỉ thấy bụi mờ li ti. Hãy chuyển sang vật kính 40× hoặc 100× có dầu soi!',
      };
    }
    if (currentSpecimen.id === 'spc-paramecium' && objectiveMag === 100) {
      return {
        level: 'warning' as const,
        badge: 'TRƯỜNG QUÁ HẸP',
        title: 'Mẫu vật trùng giày có kích thước lớn (~200 µm)',
        advice: 'Ở 100× trường nhìn quá hẹp dễ làm mất mẫu vật. Hãy chuyển về 10× hoặc 40×.',
      };
    }

    // 3. Kiểm tra độ nét (Focal Plane Status)
    if (absDeltaZ <= effTolerance) {
      return {
        level: 'success' as const,
        badge: 'NÉT HOÀN HẢO',
        title: 'Đúng mặt phẳng tiêu cự',
        advice: currentSpecimen.focusingGuidanceVi,
      };
    }

    if (absDeltaZ <= 0.15) {
      const dirText = deltaZ > 0 ? 'ngược chiều kim đồng hồ (-)' : 'theo chiều kim đồng hồ (+)';
      return {
        level: 'near' as const,
        badge: 'GẦN NÉT',
        title: `Lệch nhẹ (${deltaZ > 0 ? '+' : ''}${deltaZ.toFixed(2)} mm)`,
        advice: `Dùng Ốc vi cấp (tinh) vặn ${dirText} để tinh chỉnh về z₀ = ${targetFocusZ.toFixed(2)} mm.`,
      };
    }

    if (absDeltaZ < 0.85) {
      const dirAction = deltaZ > 0 ? 'HẠ BÀN KÍNH (-)' : 'NÂNG BÀN KÍNH (+)';
      return {
        level: 'warning' as const,
        badge: deltaZ > 0 ? 'BÀN KÍNH QUÁ CAO' : 'BÀN KÍNH QUÁ THẤP',
        title: `Lệch tiêu điểm ${deltaZ > 0 ? '+' : ''}${deltaZ.toFixed(2)} mm`,
        advice: `Dùng Ốc sơ cấp (chỉnh thô) để ${dirAction} về gần mức ${targetFocusZ.toFixed(1)} mm.`,
      };
    }

    // Mất nét hoàn toàn (Total Defocus)
    return {
      level: 'danger' as const,
      badge: 'MẤT NÉT HOÀN TOÀN',
      title: 'Mẫu vật bị tiêu tán khỏi trường nhìn',
      advice: `Bàn kính lệch quá xa (${deltaZ > 0 ? '+' : ''}${deltaZ.toFixed(2)} mm). Bấm "Nét chuẩn" hoặc vặn ốc thô về mức ${targetFocusZ.toFixed(1)} mm.`,
    };
  }, [
    isLightOn,
    brightness,
    currentSpecimen,
    objectiveMag,
    absDeltaZ,
    effTolerance,
    deltaZ,
    targetFocusZ,
  ]);

  // Đồng bộ trạng thái về Scene 3D
  useEffect(() => {
    onSyncWith3DScene?.({
      magnification: objectiveMag,
      specimenId: selectedSpecimenId,
      focusZ: coarseFocusZ + fineFocusZ,
      stageX,
      stageY,
      isLightOn,
      brightness,
    });
  }, [
    objectiveMag,
    selectedSpecimenId,
    coarseFocusZ,
    fineFocusZ,
    stageX,
    stageY,
    isLightOn,
    brightness,
    onSyncWith3DScene,
  ]);

  // Âm thanh cơ học khi xoay vật kính
  const handleSelectObjective = useCallback(
    (mag: number) => {
      if (mag === objectiveMag) return;
      if (!isMuted) labSoundEngine.play('mechanical-click', { value: mag });
      setObjectiveMag(mag);
    },
    [objectiveMag, isMuted],
  );

  // Âm thanh khi chỉnh ốc lấy nét
  const handleCoarseAdjust = (delta: number) => {
    if (!isMuted) labSoundEngine.play('rotate-object', 0.5);
    setCoarseFocusZ((prev) => Math.max(3.0, Math.min(7.0, Number((prev + delta).toFixed(2)))));
  };

  const handleFineAdjust = (delta: number) => {
    if (!isMuted) labSoundEngine.play('rotate-object', 0.25);
    setFineFocusZ((prev) => Math.max(-1.0, Math.min(1.0, Number((prev + delta).toFixed(3)))));
  };

  // Di chuyển bàn sa trượt X/Y
  const handleStageMove = (dx: number, dy: number) => {
    if (!isMuted) labSoundEngine.play('caliper-slide', 0.35);
    setStageX((prev) => Math.max(-15, Math.min(15, Number((prev + dx).toFixed(1)))));
    setStageY((prev) => Math.max(-15, Math.min(15, Number((prev + dy).toFixed(1)))));
  };

  const handleResetStage = () => {
    if (!isMuted) labSoundEngine.play('mechanical-click', 0.6);
    setStageX(0);
    setStageY(0);
  };

  // Tự động lấy nét chuẩn riêng cho từng mẫu vật (Auto Focus Helper)
  const handleAutoFocus = () => {
    if (!isMuted) labSoundEngine.play('mechanical-click', 0.8);
    const z0 = currentSpecimen.optimalFocusZ;
    const coarse = Number(z0.toFixed(1));
    const fine = Number((z0 - coarse).toFixed(3));
    setCoarseFocusZ(coarse);
    setFineFocusZ(fine);
  };

  // Chụp ảnh snapshot thị kính
  const handleCaptureSnapshot = () => {
    if (!isMuted) labSoundEngine.play('camera-shutter', 0.95);
    const timeStr = new Date().toLocaleTimeString('vi-VN');
    const toastMsg = `Đã chụp ảnh tiêu bản ${currentSpecimen.nameVi} ở ${totalMagnification}× (${timeStr})`;
    setSnapshotToast(toastMsg);
    setTimeout(() => setSnapshotToast(null), 3500);
  };

  // Lọc mẫu vật theo nhóm
  const filteredSpecimens = useMemo(() => {
    if (selectedCategory === 'all') return MICROSCOPE_SPECIMENS;
    return MICROSCOPE_SPECIMENS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  // Cảnh báo độ phóng đại không phù hợp
  const currentWarning = useMemo(() => {
    return currentSpecimen.unsuitableWarning?.find((w) => w.mag === totalMagnification);
  }, [currentSpecimen, totalMagnification]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-[1440px] h-[95vh] max-h-[960px] bg-[#0A101D] text-slate-100 rounded-2xl border border-sky-500/40 shadow-[0_24px_64px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden ${
          isFullscreen ? 'fixed inset-0 max-w-none h-full rounded-none' : ''
        }`}
      >
        {/* ==============================================================
            HEADER: TIÊU ĐỀ & TRẠNG THÁI TỔNG ĐỘ PHÓNG ĐẠI
           ============================================================== */}
        <div className="h-14 px-4 bg-gradient-to-r from-[#0d1829] via-[#10223d] to-[#0d1829] border-b border-sky-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-300">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-black text-white tracking-wide uppercase">
                  Mô phỏng Kính hiển vi Quang học 3D
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/40">
                  {currentSpecimen.curriculumLessonVi}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>Mẫu vật:</span>
                <span className="font-bold text-amber-300">{currentSpecimen.nameVi}</span>
                <span className="italic text-slate-400">({currentSpecimen.scientificName})</span>
              </div>
            </div>
          </div>

          {/* Cụm thông báo phóng đại & nút tiện ích */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-amber-400/50 text-amber-300 font-mono font-black text-xs">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Độ phóng đại:</span>
              <span className="text-sm text-white">{totalMagnification}×</span>
              <span className="text-[10px] text-slate-400">
                ({objectiveMag}× vật kính × {eyepieceMag}× thị kính)
              </span>
            </div>

            {/* Bật/Tắt âm thanh */}
            <button
              type="button"
              onClick={() => setIsMuted((v) => !v)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title={isMuted ? 'Bật âm thanh thao tác' : 'Tắt âm thanh thao tác'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-300" />}
            </button>

            {/* Toàn màn hình */}
            <button
              type="button"
              onClick={() => setIsFullscreen((v) => !v)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Xem toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Đóng cửa sổ */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white transition-colors cursor-pointer"
              title="Đóng mô phỏng kính hiển vi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==============================================================
            MAIN WORKSPACE: 3 CỘT (ZONE A, ZONE B & HARDWARE, ZONE C & D)
           ============================================================== */}
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-3 p-3 overflow-hidden">
          {/* ------------------------------------------------------------
              CỘT TRÁI (3 CỘT): KHU VỰC A -- THƯ VIỆN MẪU VẬT KHTN
             ------------------------------------------------------------ */}
          <div className="col-span-12 lg:col-span-3 flex flex-col min-h-0 bg-[#0E1626]/90 rounded-xl border border-slate-800 p-2.5 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-black text-sky-400 uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Khu vực A · Thư viện mẫu vật</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPrepStepIndex(0);
                  setShowPrepModal(true);
                }}
                className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 flex items-center gap-1 cursor-pointer transition-colors"
                title="Xem hướng dẫn quy trình làm tiêu bản KHTN"
              >
                <BookOpen className="w-3 h-3" />
                <span>Quy trình làm tiêu bản</span>
              </button>
            </div>

            {/* Lọc nhóm mẫu vật */}
            <div className="flex flex-wrap gap-1 shrink-0">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'protozoa', label: 'Đơn bào' },
                { id: 'plant_cells', label: 'Thực vật' },
                { id: 'animal_cells', label: 'Động vật' },
                { id: 'algae', label: 'Tảo xoắn' },
                { id: 'microorganisms', label: 'Vi sinh' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id as SpecimenCategory | 'all')}
                  className={`px-2 py-1 rounded text-[10.5px] font-bold transition-colors cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-sky-500 text-slate-950 font-black'
                      : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Danh sách thẻ mẫu vật */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredSpecimens.map((spc) => {
                const isSelected = spc.id === selectedSpecimenId;
                return (
                  <div
                    key={spc.id}
                    onClick={() => {
                      if (!isMuted) labSoundEngine.play('ui-toggle', 0.7);
                      setSelectedSpecimenId(spc.id);
                      setActiveAnnotation(null);
                    }}
                    onMouseEnter={(e) => {
                      if (specimenHoverTimeoutRef.current) clearTimeout(specimenHoverTimeoutRef.current);
                      const rect = e.currentTarget.getBoundingClientRect();
                      specimenHoverTimeoutRef.current = window.setTimeout(() => {
                        setHoveredSpecimen({ spc, rect });
                      }, 90);
                    }}
                    onMouseLeave={() => {
                      if (specimenHoverTimeoutRef.current) clearTimeout(specimenHoverTimeoutRef.current);
                      specimenHoverTimeoutRef.current = window.setTimeout(() => {
                        setHoveredSpecimen(null);
                      }, 110);
                    }}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-sky-950/70 border-sky-400 shadow-xs'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-black text-white truncate">
                          {spc.nameVi}
                        </div>
                        <div className="text-[10px] font-mono italic text-slate-400 truncate">
                          {spc.scientificName}
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {spc.lengthUmText}
                      </span>
                      <span className="text-amber-400 font-semibold">
                        VK khuyên dùng: {spc.recommendedObjectives.map((m) => `${m}×`).join(', ')}
                      </span>
                    </div>

                    <div className="mt-1 text-[9.5px] text-slate-400 line-clamp-1">
                      {spc.stainTypeVi}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ------------------------------------------------------------
              CỘT GIỮA (6 CỘT): KHU VỰC B -- CỬA SỔ THỊ KÍNH & BỘ ĐIỀU KHIỂN CƠ HỌC
             ------------------------------------------------------------ */}
          <div className="col-span-12 lg:col-span-6 flex flex-col min-h-0 space-y-2">
            {/* CỬA SỔ THỊ KÍNH TRÒN (Eyepiece Viewport) */}
            <div className="flex-1 min-h-[320px] bg-[#050811] rounded-xl border border-sky-500/40 relative flex items-center justify-center overflow-hidden p-2">
              {/* Vòng kim loại thị kính ngoài cùng (Eyepiece bezel ring) */}
              <div
                ref={viewportRef}
                className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] rounded-full border-[12px] sm:border-[16px] border-[#1e293b] shadow-[0_0_50px_rgba(0,0,0,0.95),inset_0_0_30px_rgba(0,0,0,0.9)] relative overflow-hidden flex items-center justify-center bg-black"
              >
                {/* Lớp hiển thị SVG tế bào */}
                <MicroscopeSpecimenSvgRenderer
                  specimen={currentSpecimen}
                  objectiveMag={objectiveMag}
                  eyepieceMag={eyepieceMag}
                  deltaZ={deltaZ}
                  stageX={stageX}
                  stageY={stageY}
                  focalBlurPx={focalBlurPx}
                  brightness={brightness}
                  diaphragm={diaphragm}
                  isLightOn={isLightOn}
                  showAnnotations={showAnnotations}
                  activeAnnotationId={activeAnnotation?.id || null}
                  onSelectAnnotation={(ann) => setActiveAnnotation(ann)}
                  animTimeSec={animTimeSec}
                />

                {/* Thước chữ thập / Vòng tròn thị kính (Reticle Graticule) */}
                {showReticle && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <svg viewBox="-100 -100 200 200" className="w-full h-full opacity-60">
                      {/* Trục X và Y chia vạch micro */}
                      <line x1="-95" y1="0" x2="95" y2="0" stroke="#0284c7" strokeWidth="0.8" />
                      <line x1="0" y1="-95" x2="0" y2="95" stroke="#0284c7" strokeWidth="0.8" />
                      {/* Các vạch chia 10 đơn vị */}
                      {[-80, -60, -40, -20, 20, 40, 60, 80].map((tick) => (
                        <g key={tick}>
                          <line x1={tick} y1="-3" x2={tick} y2="3" stroke="#0284c7" strokeWidth="0.8" />
                          <line x1="-3" y1={tick} x2="3" y2={tick} stroke="#0284c7" strokeWidth="0.8" />
                        </g>
                      ))}
                      <circle cx="0" cy="0" r="40" fill="none" stroke="#0284c7" strokeWidth="0.6" strokeDasharray="3 3" />
                      <circle cx="0" cy="0" r="75" fill="none" stroke="#0284c7" strokeWidth="0.6" strokeDasharray="4 4" />
                    </svg>
                  </div>
                )}

                {/* Vành kính phản chiếu quang học (Lens glare & Fresnel ring) */}
                <div className="absolute inset-0 rounded-full pointer-events-none border border-sky-400/25 shadow-[inset_0_0_25px_rgba(56,189,248,0.2)]" />
              </div>

              {/* THƯỚC TỶ LỆ HIỆU CHUẨN (Calibrated Scale Bar µm) GÓC DƯỚI */}
              <div className="absolute bottom-3 left-4 bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700/80 pointer-events-none">
                <div className="flex items-center gap-1.5 text-[10.5px] font-mono font-bold text-sky-300">
                  <div className="w-12 h-1 bg-white border border-slate-900 relative">
                    <div className="absolute -top-1 left-0 w-0.5 h-3 bg-white" />
                    <div className="absolute -top-1 right-0 w-0.5 h-3 bg-white" />
                  </div>
                  <span>{currentObjSpec.reticleScaleMicrons} µm</span>
                </div>
                <div className="text-[9px] text-slate-400">
                  Trường nhìn: ⌀ {(currentObjSpec.fovDiameterUm / 1000).toFixed(2)} mm
                </div>
              </div>

              {/* CỤM NÚT ĐIỀU KHIỂN VIEWPORT GÓC PHẢI TRÊN */}
              <div className="absolute top-3 right-4 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowAnnotations((v) => !v)}
                  className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    showAnnotations
                      ? 'bg-sky-500 text-slate-950 font-black'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white'
                  }`}
                  title="Bật/Tắt chú thích cấu trúc tế bào"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Chú thích</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReticle((v) => !v)}
                  className={`p-1.5 rounded text-xs font-bold transition-colors cursor-pointer ${
                    showReticle
                      ? 'bg-sky-500 text-slate-950 font-black'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white'
                  }`}
                  title="Bật/Tắt thước đo thị kính (Graticule)"
                >
                  <Crosshair className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Chụp ảnh quan sát qua thị kính"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Chụp ảnh</span>
                </button>
              </div>

              {/* THÔNG BÁO CHỤP ẢNH SNAPSHOT */}
              {snapshotToast && (
                <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-black shadow-lg animate-in fade-in slide-in-from-top duration-200">
                  {snapshotToast}
                </div>
              )}

              {/* CARD CHI TIẾT CHÚ THÍCH KHI BẤM VÀO PIN */}
              {activeAnnotation && (
                <div className="absolute bottom-3 right-4 max-w-[260px] bg-slate-900/95 backdrop-blur-md p-2.5 rounded-xl border border-sky-400/80 shadow-xl text-left">
                  <div className="flex items-center justify-between text-xs font-black text-sky-300">
                    <span>{activeAnnotation.nameVi}</span>
                    <button
                      type="button"
                      onClick={() => setActiveAnnotation(null)}
                      className="text-slate-400 hover:text-white p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-200 leading-snug">
                    {activeAnnotation.descriptionVi}
                  </div>
                </div>
              )}
            </div>

            {/* HỆ THỐNG HƯỚNG DẪN THÍCH ỨNG THÔNG MINH (Real-time Diagnostic Coach) */}
            <div
              className={`px-3 py-2 rounded-xl border backdrop-blur-md flex items-center justify-between gap-2.5 transition-all shadow-md shrink-0 ${
                diagnosticCoachInfo.level === 'success'
                  ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200'
                  : diagnosticCoachInfo.level === 'near'
                    ? 'bg-sky-950/80 border-sky-400 text-sky-200'
                    : diagnosticCoachInfo.level === 'warning'
                      ? 'bg-amber-950/70 border-amber-500/80 text-amber-200'
                      : 'bg-rose-950/70 border-rose-500/80 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase shrink-0 ${
                    diagnosticCoachInfo.level === 'success'
                      ? 'bg-emerald-500 text-slate-950'
                      : diagnosticCoachInfo.level === 'near'
                        ? 'bg-sky-400 text-slate-950'
                        : diagnosticCoachInfo.level === 'warning'
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-rose-500 text-white animate-pulse'
                  }`}
                >
                  {diagnosticCoachInfo.badge}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-extrabold truncate text-white">
                    {diagnosticCoachInfo.title}
                  </div>
                  <div className="text-[10.5px] opacity-90 truncate">
                    {diagnosticCoachInfo.advice}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-[9px] text-slate-400 uppercase font-mono">Độ lệch tiêu cự:</div>
                  <div
                    className={`font-mono text-[11px] font-black ${
                      absDeltaZ <= effTolerance
                        ? 'text-emerald-400'
                        : absDeltaZ <= 0.15
                          ? 'text-sky-300'
                          : 'text-amber-400'
                    }`}
                  >
                    Δz = {deltaZ > 0 ? `+${deltaZ.toFixed(2)}` : deltaZ.toFixed(2)} mm
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFocus}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 text-[11px] font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  title={`Đưa bàn kính về đúng tiêu cự chuẩn ${targetFocusZ.toFixed(2)} mm của ${currentSpecimen.nameVi}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Nét chuẩn</span>
                </button>
              </div>
            </div>

            {/* BẢNG ĐIỀU KHIỂN CƠ HỌC: LẤY NÉT & BÀN SA TRƯỢT & CHIẾU SÁNG */}
            <div className="h-[175px] bg-[#0E1626]/90 rounded-xl border border-slate-800 p-2.5 grid grid-cols-12 gap-3 shrink-0">
              {/* Cụm 1: Núm chỉnh thô & Núm chỉnh tinh (Lấy nét Z) */}
              <div className="col-span-5 flex flex-col justify-between border-r border-slate-800 pr-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-black text-sky-400 uppercase tracking-wider flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Lấy nét (Z-Focus)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFocus}
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 hover:bg-sky-500 hover:text-slate-950 transition-colors cursor-pointer"
                    title="Tự động đưa về cự ly nét chuẩn 5.0 mm"
                  >
                    Tự động nét
                  </button>
                </div>

                {/* Ốc sơ cấp (Coarse Focus - bước lớn) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="text-slate-300 font-bold">Ốc sơ cấp (Chỉnh thô):</span>
                    <span className="font-mono text-amber-300">{coarseFocusZ.toFixed(1)} mm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCoarseAdjust(-0.5)}
                      className="w-7 h-6 rounded bg-slate-800 hover:bg-slate-700 font-bold text-xs"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="3.0"
                      max="7.0"
                      step="0.1"
                      value={coarseFocusZ}
                      onChange={(e) => setCoarseFocusZ(parseFloat(e.target.value))}
                      className="flex-1 accent-sky-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => handleCoarseAdjust(0.5)}
                      className="w-7 h-6 rounded bg-slate-800 hover:bg-slate-700 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Ốc vi cấp (Fine Focus - bước nhỏ) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="text-slate-300 font-bold">Ốc vi cấp (Chỉnh tinh):</span>
                    <span className="font-mono text-emerald-300">
                      {fineFocusZ >= 0 ? `+${fineFocusZ.toFixed(2)}` : fineFocusZ.toFixed(2)} mm
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleFineAdjust(-0.02)}
                      className="w-7 h-6 rounded bg-slate-800 hover:bg-slate-700 font-bold text-xs"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="-0.5"
                      max="0.5"
                      step="0.01"
                      value={fineFocusZ}
                      onChange={(e) => setFineFocusZ(parseFloat(e.target.value))}
                      className="flex-1 accent-emerald-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => handleFineAdjust(0.02)}
                      className="w-7 h-6 rounded bg-slate-800 hover:bg-slate-700 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Cụm 2: Bàn sa trượt X/Y (Stage Pan) */}
              <div className="col-span-4 flex flex-col justify-between border-r border-slate-800 pr-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-black text-sky-400 uppercase tracking-wider flex items-center gap-1">
                    <Move className="w-3.5 h-3.5" />
                    <span>Bàn sa trượt (X/Y)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleResetStage}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Về tâm (0, 0)"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>

                {/* 4 phím điều hướng D-pad cho học sinh */}
                <div className="flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-1 w-24">
                    <div />
                    <button
                      type="button"
                      onClick={() => handleStageMove(0, 1.5)}
                      className="h-6 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 font-black text-xs flex items-center justify-center"
                      title="Đẩy bàn kính lên trên (mẫu vật trôi xuống)"
                    >
                      ▲
                    </button>
                    <div />
                    <button
                      type="button"
                      onClick={() => handleStageMove(-1.5, 0)}
                      className="h-6 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 font-black text-xs flex items-center justify-center"
                      title="Đẩy bàn kính sang trái (mẫu vật trôi sang phải)"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={handleResetStage}
                      className="h-6 rounded bg-slate-700 text-[9px] font-bold flex items-center justify-center"
                    >
                      •
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStageMove(1.5, 0)}
                      className="h-6 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 font-black text-xs flex items-center justify-center"
                      title="Đẩy bàn kính sang phải (mẫu vật trôi sang trái)"
                    >
                      ▶
                    </button>
                    <div />
                    <button
                      type="button"
                      onClick={() => handleStageMove(0, -1.5)}
                      className="h-6 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 font-black text-xs flex items-center justify-center"
                      title="Đẩy bàn kính xuống dưới (mẫu vật trôi lên)"
                    >
                      ▼
                    </button>
                    <div />
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400 font-mono">
                  X: {stageX.toFixed(1)} mm | Y: {stageY.toFixed(1)} mm
                </div>
              </div>

              {/* Cụm 3: Chiếu sáng & Màn chắn sáng (Illumination & Diaphragm) */}
              <div className="col-span-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-black text-sky-400 uppercase tracking-wider flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5" />
                    <span>Chiếu sáng</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLightOn((v) => !v)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      isLightOn
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isLightOn ? 'BẬT' : 'TẮT'}
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="text-slate-300">Độ sáng LED:</span>
                    <span className="font-mono text-amber-300">{Math.round(brightness * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    disabled={!isLightOn}
                    value={brightness}
                    onChange={(e) => setBrightness(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer disabled:opacity-40"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="text-slate-300">Khẩu độ (Màn chắn):</span>
                    <span className="font-mono text-sky-300">{Math.round(diaphragm * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={diaphragm}
                    onChange={(e) => setDiaphragm(parseFloat(e.target.value))}
                    className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------
              CỘT PHẢI (3 CỘT): KHU VỰC C (PHÓNG ĐẠI), D (THÔNG TIN), E (XEM TRƯỚC)
             ------------------------------------------------------------ */}
          <div className="col-span-12 lg:col-span-3 flex flex-col min-h-0 space-y-2.5">
            {/* KHU VỰC C: BẢNG ĐIỀU KHIỂN ĐỘ PHÓNG ĐẠI */}
            <div className="bg-[#0E1626]/90 rounded-xl border border-slate-800 p-2.5 space-y-2 shrink-0">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-xs font-black text-sky-400 uppercase tracking-wider">
                  Khu vực C · Mâm vật kính
                </span>
                <div className="flex items-center gap-1 text-[11px] text-slate-300">
                  <span>Thị kính:</span>
                  <select
                    value={eyepieceMag}
                    onChange={(e) => setEyepieceMag(parseInt(e.target.value) as 10 | 16)}
                    className="bg-slate-800 text-sky-300 rounded px-1 py-0.5 font-bold cursor-pointer"
                  >
                    <option value={10}>10×</option>
                    <option value={16}>16×</option>
                  </select>
                </div>
              </div>

              {/* 4 Nút xoay mâm vật kính quốc tế DIN (4x Đỏ, 10x Vàng, 40x Lam, 100x Trắng) */}
              <div className="grid grid-cols-4 gap-1.5">
                {[4, 10, 40, 100].map((mag) => {
                  const spec = OBJECTIVE_SPECS[mag];
                  const isCur = objectiveMag === mag;
                  return (
                    <button
                      key={mag}
                      type="button"
                      onClick={() => handleSelectObjective(mag)}
                      className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                        isCur
                          ? 'border-2 shadow-xs'
                          : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60'
                      }`}
                      style={{
                        borderColor: isCur ? spec.colorHex : undefined,
                        backgroundColor: isCur ? `${spec.colorHex}22` : undefined,
                      }}
                    >
                      <div
                        className="w-3.5 h-1.5 rounded-full mb-1"
                        style={{ backgroundColor: spec.colorHex }}
                      />
                      <span className="text-xs font-black text-white">{mag}×</span>
                      <span className="text-[9px] text-slate-400 truncate">
                        {mag * eyepieceMag}×
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Cảnh báo nếu chọn mức phóng đại không phù hợp */}
              {currentWarning && (
                <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[11px] flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <span>{currentWarning.message}</span>
                </div>
              )}
            </div>

            {/* KHU VỰC E: XEM TRƯỚC CÁC MỨC PHÓNG ĐẠI (40x, 100x, 400x, 1000x) */}
            <div className="bg-[#0E1626]/90 rounded-xl border border-slate-800 p-2.5 space-y-1.5 shrink-0">
              <span className="text-[11px] font-black text-sky-400 uppercase tracking-wider block">
                Khu vực E · Xem nhanh 4 mức phóng đại
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[4, 10, 40, 100].map((mag) => {
                  const isCur = objectiveMag === mag;
                  return (
                    <button
                      key={mag}
                      type="button"
                      onClick={() => handleSelectObjective(mag)}
                      className={`p-1.5 rounded-lg text-center transition-all cursor-pointer border ${
                        isCur
                          ? 'bg-sky-500 text-slate-950 border-sky-300 font-black'
                          : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300 border-slate-700/60'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{mag * eyepieceMag}×</div>
                      <div className="text-[8.5px] opacity-75">VK {mag}×</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* KHU VỰC D: HỒ SƠ CHI TIẾT MẪU VẬT KHTN */}
            <div className="flex-1 min-h-0 bg-[#0E1626]/90 rounded-xl border border-slate-800 p-2.5 flex flex-col space-y-2 overflow-hidden">
              <div className="flex items-center gap-1.5 text-xs font-black text-sky-400 uppercase tracking-wider pb-1.5 border-b border-slate-800 shrink-0">
                <Info className="w-4 h-4" />
                <span>Khu vực D · Hồ sơ mẫu vật</span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-xs">
                <div>
                  <div className="font-black text-amber-300 text-[13px]">
                    {currentSpecimen.nameVi}
                  </div>
                  <div className="italic text-slate-400 text-[11px]">
                    {currentSpecimen.scientificName}
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-900/80 border border-slate-800 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kích thước:</span>
                    <span className="font-mono text-white font-bold">
                      {currentSpecimen.lengthUmText}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Chiều rộng:</span>
                    <span className="font-mono text-white font-bold">
                      {currentSpecimen.widthUmText}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dung dịch nhuộm:</span>
                    <span className="text-emerald-400 font-bold truncate max-w-[140px]">
                      {currentSpecimen.stainTypeVi}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-200 mb-1">Cấu trúc nhận biết:</div>
                  <div className="space-y-0.5">
                    {currentSpecimen.visibleStructures.map((st, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-200 mb-0.5">Đặc điểm hình thái:</div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    {currentSpecimen.descriptionVi}
                  </div>
                </div>

                <div className="p-2 rounded bg-blue-950/40 border border-blue-500/30 text-[10.5px] text-sky-200">
                  <span className="font-bold">Lưu ý KHTN: </span>
                  {currentSpecimen.scientificNotes}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================================================
          MODAL CON: QUY TRÌNH LÀM TIÊU BẢN THỰC HÀNH KHTN
         ============================================================== */}
      {showPrepModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-[#0D1829] rounded-2xl border border-sky-400/60 shadow-2xl p-5 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-white uppercase">
                    Quy trình làm tiêu bản hiển vi KHTN THCS
                  </div>
                  <div className="text-xs text-amber-300 font-bold">
                    Mẫu: {currentSpecimen.nameVi} ({currentSpecimen.stainTypeVi})
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrepModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Các bước hướng dẫn */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {currentSpecimen.preparationSteps.map((step, idx) => {
                const isCurrent = idx === prepStepIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => setPrepStepIndex(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-sky-950/80 border-sky-400 shadow-md'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-200 leading-relaxed">
                      {step}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-200">
              💡 <strong>Quy tắc an toàn KHTN:</strong> Luôn hạ lamen từ góc 45° để tránh bóng khí làm nhầm lẫn với tế bào; dùng giấy thấm hút hết nước tràn ra ngoài trước khi kẹp tiêu bản lên bàn kính.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowPrepModal(false)}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs cursor-pointer transition-colors"
              >
                Đã hoàn thành làm tiêu bản · Đưa lên kính quan sát
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THẺ NỔI HƯỚNG DẪN CHI TIẾT MẪU VẬT KHI RÊ CHUỘT TRONG THƯ VIỆN KHU VỰC A (Specimen Hover Card) */}
      {hoveredSpecimen && (
        <div
          style={{
            left: `${Math.min(window.innerWidth - 325, hoveredSpecimen.rect.right + 12)}px`,
            top: `${Math.min(window.innerHeight - 360, hoveredSpecimen.rect.top)}px`,
          }}
          className="fixed z-[85] w-[315px] pointer-events-none animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="rounded-[14px] bg-[#0b1b36]/45 backdrop-blur-2xl border border-sky-400/30 shadow-[0_16px_48px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] text-white p-3 space-y-2">
            <div className="flex items-start justify-between gap-1.5 border-b border-white/15 pb-1.5">
              <div>
                <div className="text-[13px] font-black text-white">
                  {hoveredSpecimen.spc.nameVi}
                </div>
                <div className="text-[10.5px] font-mono italic text-[#7DD3FC]">
                  {hoveredSpecimen.spc.scientificName}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 backdrop-blur-sm">
                {hoveredSpecimen.spc.categoryNameVi}
              </span>
            </div>

            <div className="text-[10px] text-amber-200 font-semibold bg-amber-400/[0.08] backdrop-blur-md px-2 py-1 rounded-[6px] border border-amber-400/30">
              📚 {hoveredSpecimen.spc.curriculumLessonVi}
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
              <div className="bg-white/[0.08] backdrop-blur-md p-1.5 rounded-lg border border-white/15">
                <span className="text-slate-300 block text-[9px]">Kích thước:</span>
                <span className="text-sky-300 font-bold">{hoveredSpecimen.spc.lengthUmText}</span>
              </div>
              <div className="bg-white/[0.08] backdrop-blur-md p-1.5 rounded-lg border border-white/15">
                <span className="text-slate-300 block text-[9px]">Vật kính đề xuất:</span>
                <span className="text-emerald-300 font-bold">
                  {hoveredSpecimen.spc.recommendedObjectives.map((m) => `${m}×`).join(', ')} (chuẩn {hoveredSpecimen.spc.optimalObjective}×)
                </span>
              </div>
            </div>

            <div className="text-[10.5px] text-slate-300 leading-snug line-clamp-2">
              {hoveredSpecimen.spc.descriptionVi}
            </div>

            <div className="border-t border-white/10 pt-1.5 space-y-1 text-[10px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>Tiêu cự chuẩn:</span>
                <span className="font-mono text-amber-300 font-bold">z₀ = {hoveredSpecimen.spc.optimalFocusZ.toFixed(2)} mm</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Độ sáng LED tối ưu:</span>
                <span className="font-mono text-sky-300 font-bold">{Math.round(hoveredSpecimen.spc.optimalBrightness * 100)}%</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Khẩu độ Abbe (tương phản):</span>
                <span className="font-mono text-emerald-300 font-bold">{Math.round(hoveredSpecimen.spc.optimalDiaphragm * 100)}%</span>
              </div>
            </div>

            <div className="bg-sky-950/50 p-2 rounded text-[10px] text-sky-200 border border-sky-500/30">
              <div className="font-extrabold text-[#38BDF8] flex items-center gap-1 mb-0.5">
                <Sparkles className="w-3 h-3" />
                <span>Mẹo lấy nét & quan sát:</span>
              </div>
              <div className="leading-snug">{hoveredSpecimen.spc.focusingGuidanceVi}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
