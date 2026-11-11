/**
 * OPENLAB 3D — NEURAL SYNAPSE INTRO PANEL
 * 
 * Bảng Giới thiệu Mối liên kết Nơ-ron Tri thức & Nhân quả Trực tiếp trên Bàn Thí nghiệm 3D
 * Giải quyết triệt để tính rời rạc của thí nghiệm: Biến mọi tương tác thiết bị thành
 * hành trình nhận thức có định hướng, giới thiệu rõ quy luật khoa học, công thức KaTeX chuẩn MathType,
 * hành động nhân quả do(X) -> Y và phản xạ an toàn Socratic.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { SceneInstance, AssetDefinition } from '../../domain/types';
import {
  neuralConnectionEngine,
  CompatibleTargetCandidate,
  ContextualSynapseLink,
  SafetyReflexResult,
  IntercomSignalPacket,
  ComputedCausalInference,
} from '../../domain/neuralConnectionEngine';
import {
  NeuralDeviceNode,
  CATEGORY_META,
} from '../../domain/neuralNetworkTopology';
import { MathFormula, RichMathText } from '../common/MathFormula';

export interface NeuralSynapseIntroPanelProps {
  selectedInstance: SceneInstance | null;
  allInstances: SceneInstance[];
  assetsMap: Map<string, AssetDefinition>;
  isNeuralGuideEnabled: boolean;
  onToggleNeuralGuide?: () => void;
  onOpenNeuralModal: (deviceId?: string) => void;
  onDropAssetIntoScene?: (assetId: string) => void;
  onClose: () => void;
  isDarkMode?: boolean;
  positionClassName?: string;
}

export const NeuralSynapseIntroPanel: React.FC<NeuralSynapseIntroPanelProps> = ({
  selectedInstance,
  allInstances,
  assetsMap,
  isNeuralGuideEnabled,
  onToggleNeuralGuide,
  onOpenNeuralModal,
  onDropAssetIntoScene,
  onClose,
  positionClassName = 'top-12 left-3',
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'on_table' | 'potential_network'>('on_table');
  const [selectedLinkDetail, setSelectedLinkDetail] = useState<ContextualSynapseLink | null>(null);
  const [busSignals, setBusSignals] = useState<IntercomSignalPacket[]>(() => neuralConnectionEngine.getActiveSignals());
  const [causalInferences, setCausalInferences] = useState<ComputedCausalInference[]>(() => neuralConnectionEngine.computeCausalInferences());

  useEffect(() => {
    return neuralConnectionEngine.subscribeToBus((sigs, infs) => {
      setBusSignals(sigs);
      setCausalInferences(infs);
    });
  }, []);

  // Tra cứu Node thiết bị hiện tại
  const currentNode: NeuralDeviceNode | undefined = useMemo(() => {
    if (!selectedInstance) return undefined;
    return neuralConnectionEngine.getNode(selectedInstance.assetId);
  }, [selectedInstance]);

  // Checklist nhân quả và các ứng viên trên bàn
  const causalChecklist = useMemo(() => {
    if (!selectedInstance) return null;
    return neuralConnectionEngine.getCausalChecklist(selectedInstance, allInstances, assetsMap);
  }, [selectedInstance, allInstances, assetsMap]);

  const activeCandidates: CompatibleTargetCandidate[] = useMemo(() => {
    if (!selectedInstance) return [];
    return neuralConnectionEngine.getCompatibleCandidates(selectedInstance, allInstances, assetsMap);
  }, [selectedInstance, allInstances, assetsMap]);

  // Đánh giá phản xạ an toàn thời gian thực với từng ứng viên
  const safetyWarnings: Map<string, SafetyReflexResult> = useMemo(() => {
    const map = new Map<string, SafetyReflexResult>();
    if (!selectedInstance) return map;

    for (const cand of activeCandidates) {
      const reflex = neuralConnectionEngine.evaluateSafetyReflex(
        selectedInstance,
        cand.targetInstance,
        cand.distanceM,
      );
      if (reflex.isHazard) {
        map.set(cand.targetInstance.instanceId, reflex);
      }
    }
    return map;
  }, [selectedInstance, activeCandidates]);

  // Các liên kết tiềm năng trong mạng nơ-ron chưa có trên bàn thí nghiệm
  const potentialLinks = useMemo(() => {
    if (!causalChecklist) return [];
    const allLinks = [...causalChecklist.dendritesInput, ...causalChecklist.axonsOutput];
    return allLinks.filter((link) => !link.isSatisfiedOnTable);
  }, [causalChecklist]);

  if (!selectedInstance || !currentNode) {
    return null;
  }

  const categoryMeta = CATEGORY_META[currentNode.category] || {
    name: 'Dụng cụ thí nghiệm',
    studentName: 'Dụng cụ',
    color: '#38bdf8',
  };

  // Nếu thu gọn: Hiển thị thanh Huy hiệu nơ-ron nổi tinh tế
  if (isMinimized) {
    return (
      <div className={`absolute ${positionClassName} z-30 pointer-events-auto animate-in fade-in slide-in-from-top-2`}>
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#071326]/95 hover:bg-[#0c1f3d] border border-cyan-400/55 backdrop-blur-xl shadow-2xl text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Mở rộng Bảng Giới thiệu Mối liên kết Nơ-ron"
        >
          <span className="text-xl p-1 rounded-xl bg-slate-900/90 border border-cyan-400/35">
            {currentNode.glyphIcon}
          </span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-cyan-200 leading-tight">
              {currentNode.nameStudent}
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold">
              ⚡ {activeCandidates.length} trên bàn · {potentialLinks.length} tiềm năng
            </span>
          </div>
          <span className="text-xs text-cyan-300 ml-1">📂</span>
        </button>
      </div>
    );
  }

  // Luôn sử dụng giao diện Cosmic Glass Tương phản cao vì Panel nằm nổi trên nền Canvas 3D tối
  return (
    <aside
      className={`absolute ${positionClassName} z-30 w-[340px] max-w-[calc(100vw-24px)] max-h-[calc(100%-140px)] flex flex-col rounded-2xl border border-cyan-400/50 bg-[#071326]/95 text-slate-100 backdrop-blur-2xl shadow-[0_16px_44px_rgba(2,8,23,0.8)] overflow-hidden pointer-events-auto transition-all animate-in fade-in slide-in-from-left-3 duration-200`}
      aria-label="Bảng Giới thiệu Mối liên kết Nơ-ron Tri thức"
    >
      {/* 1. HEADER NÚT NƠ-RON ĐANG CHỌN */}
      <div className="p-3 bg-gradient-to-r from-[#0B1E3D] via-[#0F1B33] to-[#1A1640] border-b border-cyan-400/35 flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0 w-11 h-11 rounded-xl bg-[#040B18] border border-cyan-400/45 flex items-center justify-center text-2xl shadow-inner">
            <span>{currentNode.glyphIcon}</span>
            <span
              className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#040B18]"
              style={{
                backgroundColor: causalChecklist?.isFullyOperational ? '#10b981' : '#f59e0b',
              }}
              title={
                causalChecklist?.isFullyOperational
                  ? 'Sẵn sàng vận hành'
                  : 'Cần bổ sung thiết bị liên kết'
              }
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="text-[9.5px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-white/10"
                style={{
                  backgroundColor: `${categoryMeta.color}30`,
                  color: '#E0F2FE',
                }}
              >
                {categoryMeta.studentName}
              </span>
              <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-200 border border-cyan-400/40 font-mono font-bold">
                {currentNode.grades.map((g) => g.replace('grade', 'Lớp ')).join(', ')}
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-white truncate mt-0.5" title={currentNode.nameVi}>
              {currentNode.nameStudent}
            </h3>
            <p className="text-[10px] text-cyan-200/80 truncate">{currentNode.nameVi}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="w-7 h-7 rounded-lg bg-slate-900/70 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer border border-white/10"
            title="Thu nhỏ bảng"
          >
            _
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-900/70 hover:bg-rose-800 text-slate-200 hover:text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer border border-white/10"
            title="Đóng bảng giới thiệu"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 2. CHUYỂN TAB: TRÊN BÀN (LIVE) vs TIỀM NĂNG TOÀN MẠNG (POTENTIAL) */}
      <div className="flex items-center border-b border-cyan-500/30 bg-[#040B18] p-1 gap-1 text-[11px] font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('on_table')}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'on_table'
              ? 'bg-cyan-500/25 text-cyan-100 border border-cyan-400/60 shadow-sm font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
          }`}
        >
          <span>⚡ Trên bàn ({activeCandidates.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('potential_network')}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'potential_network'
              ? 'bg-indigo-500/30 text-indigo-100 border border-indigo-400/60 shadow-sm font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
          }`}
        >
          <span>🌐 Tiềm năng ({potentialLinks.length})</span>
        </button>
      </div>

      {/* 3. NỘI DUNG CUỘN CHÍNH */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-3">
        {/* NGUYÊN LÝ THIẾT BỊ NƠ-RON */}
        <div className="p-2.5 rounded-xl bg-[#0A1830] border border-cyan-500/30 text-[11px] space-y-2 shadow-inner">
          <div className="text-slate-100 leading-snug">
            <span className="text-cyan-300 font-bold">🎯 Chức năng: </span>
            <RichMathText text={currentNode.description} />
          </div>

          {(currentNode.mathFormula || currentNode.sgkFormula) && (
            <div className="p-2 rounded-lg bg-[#040B18] border border-cyan-400/40 text-[12px] text-white flex items-center justify-between gap-2">
              <span className="text-cyan-300 text-[10.5px] font-bold shrink-0">📐 Công thức:</span>
              <span className="font-semibold text-cyan-50 overflow-x-auto no-scrollbar">
                <MathFormula math={currentNode.mathFormula || currentNode.sgkFormula} />
              </span>
            </div>
          )}
        </div>

        {/* BUS TRUYỀN TIN LIÊN THIẾT BỊ (DEVICE INTER-COMMUNICATION BUS) */}
        {(busSignals.length > 0 || causalInferences.length > 0) && (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0F2447]/95 to-[#161438]/95 border border-emerald-400/50 space-y-2 shadow-[0_0_16px_rgba(16,185,129,0.18)]">
            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Thiết bị đang giao tiếp thời gian thực</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-mono">
                {busSignals.length} tín hiệu
              </span>
            </div>

            {busSignals.map((sig) => (
              <div
                key={sig.id}
                className={`px-2 py-1.5 rounded-lg border text-[11px] flex items-center justify-between gap-2 ${
                  sig.sourceAssetId === selectedInstance.assetId
                    ? 'bg-emerald-950/70 border-emerald-400/60 text-emerald-100'
                    : 'bg-[#050B18]/80 border-cyan-500/25 text-slate-200'
                }`}
              >
                <span className="truncate font-semibold">{sig.sourceNameVi}:</span>
                <span className="font-mono font-bold text-amber-300 shrink-0">
                  {sig.value.toFixed(sig.unit === 'g' || sig.unit === 'cm³' ? 1 : 2)} {sig.unit}
                </span>
              </div>
            ))}

            {causalInferences.map((inf) => (
              <div
                key={inf.id}
                className="p-2 rounded-lg bg-[#050B18]/90 border border-amber-400/60 space-y-1"
              >
                <div className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1">
                  <span>✨</span>
                  <span>{inf.titleVi}</span>
                </div>
                <div className="text-[11.5px] font-mono font-bold text-white bg-amber-500/10 px-2 py-1 rounded border border-amber-400/30">
                  {inf.computedValueText}
                </div>
                <p className="text-[10px] text-slate-300 leading-snug">
                  {inf.explanationVi}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 1: CÁC MỐI LIÊN KẾT ĐANG HOẠT ĐỘNG TRÊN BÀN THÍ NGHIỆM */}
        {activeTab === 'on_table' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10.5px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <span>⚡</span>
                <span>Mối liên kết trên bàn ({activeCandidates.length})</span>
              </label>
              {onToggleNeuralGuide && (
                <button
                  type="button"
                  onClick={onToggleNeuralGuide}
                  className={`text-[10px] px-2 py-0.5 rounded font-bold border transition-colors cursor-pointer ${
                    isNeuralGuideEnabled
                      ? 'bg-cyan-500/25 border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/35'
                      : 'bg-slate-800 border-slate-600 text-slate-300 hover:text-white'
                  }`}
                  title="Bật/Tắt hiển thị tia sáng nơ-ron AR trong không gian 3D"
                >
                  {isNeuralGuideEnabled ? 'Tia sáng: BẬT' : 'Tia sáng: TẮT'}
                </button>
              )}
            </div>

            {activeCandidates.length === 0 ? (
              <div className="py-5 px-3 rounded-xl bg-[#091529] border border-slate-700/70 text-center space-y-2">
                <span className="text-2xl block">🔍</span>
                <p className="text-xs text-slate-100 font-semibold">
                  Chưa có thiết bị liên kết tương thích trên bàn
                </p>
                <p className="text-[10.5px] text-slate-300 leading-relaxed">
                  Thiết bị này cần kết hợp với các dụng cụ khác để tạo thành thí nghiệm hoàn chỉnh.
                  Hãy mở tab <span className="text-indigo-300 font-bold">"Tiềm năng"</span> để lấy thiết bị ghép đôi ra bàn nhé!
                </p>
              </div>
            ) : (
              activeCandidates.map((cand) => {
                const targetNode = neuralConnectionEngine.getNode(cand.targetInstance.assetId);
                const isSelected = selectedLinkDetail?.synapseId === cand.link.synapseId;
                const reflex = safetyWarnings.get(cand.targetInstance.instanceId);

                const isAxon = cand.link.direction === 'output';
                const isDendrite = cand.link.direction === 'input';
                const dirBg = isAxon
                  ? 'bg-sky-500/20 text-sky-200 border-sky-400/40'
                  : isDendrite
                  ? 'bg-purple-500/20 text-purple-200 border-purple-400/40'
                  : 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40';
                const dirLabel = isAxon ? 'Tác động ra (Axon)' : isDendrite ? 'Nhận vào (Dendrite · Tia tím)' : 'Tương tác hai chiều';

                return (
                  <div
                    key={cand.targetInstance.instanceId}
                    onClick={() => setSelectedLinkDetail(isSelected ? null : cand.link)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0E203F] border-cyan-400 shadow-[0_0_16px_rgba(56,189,248,0.28)]'
                        : 'bg-[#0A172E] hover:bg-[#0E203F] border-cyan-500/30 hover:border-cyan-400/60'
                    }`}
                  >
                    {/* Header mối liên kết */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg flex-shrink-0">
                          {targetNode?.glyphIcon || '📦'}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {targetNode?.nameStudent || cand.targetAsset.name.vi}
                          </div>
                          <div className="text-[9.5px] text-slate-300 flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className={`px-1.5 py-0.2 rounded font-semibold border ${dirBg}`}>
                              {dirLabel}
                            </span>
                            <span>•</span>
                            <span className="text-cyan-200 font-medium">
                              Cách {(cand.distanceM * 100).toFixed(0)} cm
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="text-xs text-cyan-300 shrink-0">
                        {isSelected ? '▲' : '▼'}
                      </span>
                    </div>

                    {/* Cảnh báo an toàn nếu vi phạm cự ly / thao tác */}
                    {reflex?.isHazard && (
                      <div className="mt-2 p-2 rounded-lg bg-rose-950/80 border border-rose-400/60 text-[10.5px] text-rose-100 space-y-1">
                        <div className="font-bold flex items-center gap-1 text-rose-200">
                          <span>⚠️</span>
                          <span>{reflex.hazardMessageVi}</span>
                        </div>
                        <div className="text-[9.5px] opacity-95 leading-tight">
                          <RichMathText text={reflex.scientificReasonVi} />
                        </div>
                      </div>
                    )}

                    {/* Khung giải thích quy luật & công thức KaTeX chuẩn MathType */}
                    <div className="mt-2 pt-2 border-t border-cyan-500/20 space-y-1.5 text-[10.5px]">
                      <div className="text-slate-100 leading-snug">
                        <span className="text-cyan-300 font-bold">⚡ Nhân quả: </span>
                        <RichMathText text={cand.link.actionVerbVi} />
                      </div>

                      <div className="p-2 rounded-lg bg-[#040B18] border border-cyan-400/35 text-white flex flex-col gap-1">
                        <span className="text-[9.5px] text-cyan-300 font-bold">
                          📐 {cand.link.physicalLawVi}:
                        </span>
                        <div className="text-[12px] text-cyan-50 text-center py-0.5 overflow-x-auto no-scrollbar">
                          <MathFormula math={cand.link.mathFormulaLatex} />
                        </div>
                      </div>

                      {/* Chi tiết mở rộng khi click chọn */}
                      {isSelected && (
                        <div className="p-2 rounded-lg bg-[#061224] border border-cyan-400/35 space-y-1.5 text-[10px] text-slate-100 animate-in fade-in">
                          <div>
                            <span className="font-bold text-cyan-300">📚 Bối cảnh bài học: </span>
                            <RichMathText text={cand.link.experimentContext} />
                          </div>
                          <div>
                            <span className="font-bold text-amber-300">💡 Mẹo thao tác đúng: </span>
                            <RichMathText text={cand.link.safetyTipVi} />
                          </div>
                          <div className="pt-1 flex items-center gap-1.5">
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-200 border border-cyan-500/40 font-mono">
                              Cổng: {cand.link.sourcePortName} ➔ {cand.link.targetPortName}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: CÁC MỐI LIÊN KẾT TIỀM NĂNG TRONG TOÀN BỘ MẠNG NƠ-RON */}
        {activeTab === 'potential_network' && (
          <div className="space-y-2">
            <label className="text-[10.5px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <span>🌐</span>
              <span>Liên kết nơ-ron tiềm năng ({potentialLinks.length})</span>
            </label>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              Các thiết bị sau có thể kết hợp với <strong className="text-white">{currentNode.nameStudent}</strong> để tạo thành bài thí nghiệm:
            </p>

            {potentialLinks.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#091529] border border-slate-700/70 text-center text-xs text-slate-300">
                Toàn bộ các thiết bị liên kết của nơ-ron này đều đã có mặt trên bàn thí nghiệm!
              </div>
            ) : (
              potentialLinks.map((link) => {
                const partnerAssetId =
                  link.direction === 'input' ? link.sourceAssetId : link.targetAssetId;
                const partnerNode = neuralConnectionEngine.getNode(partnerAssetId);
                const isAxon = link.direction === 'output';

                return (
                  <div
                    key={link.synapseId}
                    className="p-2.5 rounded-xl bg-[#0A172E] hover:bg-[#0E203F] border border-indigo-400/35 hover:border-indigo-400/65 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg">{partnerNode?.glyphIcon || '📦'}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {partnerNode?.nameStudent || partnerNode?.nameVi || 'Thiết bị đối tác'}
                          </div>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-semibold border ${
                              isAxon
                                ? 'bg-sky-500/20 border-sky-400/40 text-sky-200'
                                : 'bg-purple-500/20 border-purple-400/40 text-purple-200'
                            }`}
                          >
                            {isAxon ? '➔ Cung cấp tín hiệu' : '➔ Cần nhận tín hiệu'}
                          </span>
                        </div>
                      </div>

                      {onDropAssetIntoScene && partnerAssetId && (
                        <button
                          type="button"
                          onClick={() => onDropAssetIntoScene(partnerAssetId)}
                          className="px-2 py-1 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-[10px] shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                          title="Lấy thiết bị này ra bàn thí nghiệm để ghép đôi"
                        >
                          ➕ Lấy ra bàn
                        </button>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-200 leading-snug">
                      <span className="text-indigo-300 font-bold">Quy luật: </span>
                      <span>{link.physicalLawVi}</span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-[#040B18] border border-indigo-400/35 text-[11.5px] text-cyan-100 text-center overflow-x-auto no-scrollbar">
                      <MathFormula math={link.mathFormulaLatex} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 4. MẸO AN TOÀN SƯ PHẠM SOCRATES */}
        {currentNode.studentTip && (
          <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-400/40 text-[10.5px] text-amber-100 leading-snug space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>💡</span>
              <span>Lưu ý thao tác & An toàn:</span>
            </div>
            <p><RichMathText text={currentNode.studentTip} /></p>
          </div>
        )}
      </div>

      {/* 5. FOOTER: NÚT MỞ SƠ ĐỒ MẠNG NƠ-RON TOÀN CẢNH */}
      <div className="p-2.5 bg-[#040B18] border-t border-cyan-500/30 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onOpenNeuralModal(currentNode.assetId || currentNode.id)}
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>🌐 Mở Sơ Đồ Mạng Nơ-ron Toàn Cảnh</span>
        </button>
      </div>
    </aside>
  );
};
