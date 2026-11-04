import React, { useState } from 'react';
import {
  Lightbulb,
  Calculator,
  Table2,
  ChevronDown,
  ChevronUp,
  Scale,
  Droplets,
  BookOpen,
  Check,
  ArrowRight,
  Eye,
  HelpCircle,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { StudentGuidedStepNumber } from './StudentGuidedStepPanel';

export type MeasurementUnitSystem = 'CGS' | 'MG_L' | 'SI';
export type StudentBottomTabId =
  | 'results'
  | 'formula'
  | 'reading-guide'
  | 'steps';

interface StudentBottomPanelsRowProps {
  measuredMassG: number | null;
  initialVolumeCm3: number;
  finalVolumeCm3: number | null;
  objectVolumeCm3: number | null;
  densityGCm3: number | null;
  isDarkMode?: boolean;
  guidedStep?: StudentGuidedStepNumber;
  onChangeGuidedStep?: (step: StudentGuidedStepNumber) => void;
  onQuickWeighSpecimen?: () => void;
  onQuickSubmergeSpecimen?: () => void;
  showDetailedGuides?: boolean;
  onToggleDetailedGuides?: () => void;
}

const MOBILE_PRACTICE_STEPS: Array<{
  step: StudentGuidedStepNumber;
  title: string;
  shortDesc: string;
}> = [
  {
    step: 1,
    title: 'Chuẩn bị',
    shortDesc: 'Đặt cân, ống đong và vật mẫu lên bàn.',
  },
  {
    step: 2,
    title: 'Cân vật (m)',
    shortDesc: 'Đặt vật lên đĩa cân để đọc khối lượng m.',
  },
  {
    step: 3,
    title: 'Đo thể tích (V)',
    shortDesc: 'Thả ngập vật vào ống đong để đọc V.',
  },
  {
    step: 4,
    title: 'Tính KLR (ρ)',
    shortDesc: 'Tính theo công thức ρ = m / V.',
  },
  {
    step: 5,
    title: 'Kết quả',
    shortDesc: 'Kiểm tra bảng số liệu và sai số.',
  },
];

export const StudentBottomPanelsRow: React.FC<StudentBottomPanelsRowProps> = ({
  measuredMassG,
  initialVolumeCm3,
  finalVolumeCm3,
  objectVolumeCm3,
  densityGCm3,
  isDarkMode = false,
  guidedStep = 1,
  onChangeGuidedStep,
  onQuickWeighSpecimen,
  onQuickSubmergeSpecimen,
  showDetailedGuides,
  onToggleDetailedGuides,
}) => {
  const [activeTab, setActiveTab] = useState<StudentBottomTabId>('results');
  const [unitSystem, setUnitSystem] = useState<MeasurementUnitSystem>('CGS');
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(true);
  const [localDetailedGuides, setLocalDetailedGuides] = useState<boolean>(false);

  const isDetailedMode =
    showDetailedGuides !== undefined ? showDetailedGuides : localDetailedGuides;
  const handleToggleDetailed = () => {
    if (onToggleDetailedGuides) {
      onToggleDetailedGuides();
    } else {
      setLocalDetailedGuides((v) => !v);
    }
  };

  const isSI = unitSystem === 'SI';
  const isMgL = unitSystem === 'MG_L';

  // Chuyển đổi đơn vị CGS (g, cm³, g/cm³) <-> MG_L (mg, L, g/L) <-> SI (kg, L hoặc m³, kg/m³)
  const formatMass = (massG: number | null): string => {
    if (massG === null) return 'Chưa đo';
    if (isMgL) return (massG * 1000).toFixed(0);
    return isSI ? (massG / 1000).toFixed(4) : massG.toFixed(2);
  };

  const formatVolume = (volCm3: number | null): string => {
    if (volCm3 === null) return 'Chưa đo';
    // Trong thực hành SI / MG_L: 1 cm³ = 1 mL = 0.001 L
    return isSI || isMgL ? (volCm3 / 1000).toFixed(4) : volCm3.toFixed(1);
  };

  const formatDensity = (rhoGCm3: number | null): string => {
    if (rhoGCm3 === null) return 'Chưa tính';
    return isSI || isMgL ? (rhoGCm3 * 1000).toFixed(0) : rhoGCm3.toFixed(2);
  };

  const massUnit = isMgL ? 'mg' : isSI ? 'kg' : 'g';
  const volUnit = isSI || isMgL ? 'L (dm³)' : 'cm³ (mL)';
  const densityUnit = isMgL ? 'g/L' : isSI ? 'kg/m³' : 'g/cm³';

  // Ước lượng độ không đảm bảo đo tổ hợp khi đã có cả m và V (Δρ/ρ ≈ Δm/m + ΔV/V)
  const combinedUncertaintyText = (() => {
    if (measuredMassG === null || objectVolumeCm3 === null || objectVolumeCm3 <= 0 || densityGCm3 === null) {
      return null;
    }
    const relErr = 0.01 / Math.max(0.1, measuredMassG) + 0.5 / Math.max(0.5, objectVolumeCm3);
    const absErrGCm3 = densityGCm3 * relErr;
    if (isMgL) return `±${(absErrGCm3 * 1000).toFixed(0)} g/L`;
    return isSI
      ? `±${(absErrGCm3 * 1000).toFixed(0)} kg/m³`
      : `±${absErrGCm3.toFixed(2)} g/cm³`;
  })();

  const rows = [
    {
      id: 'mass',
      label: 'Khối lượng vật',
      symbol: 'm',
      value: formatMass(measuredMassG),
      unit: massUnit,
      leastCountNote: isMgL ? 'ĐCNN: 10 mg' : isSI ? 'ĐCNN: 0,00001 kg' : 'ĐCNN: 0,01 g',
      isReady: measuredMassG !== null,
      onClick: onQuickWeighSpecimen,
      actionLabel: 'Đặt vật lên cân',
    },
    {
      id: 'v1',
      label: 'Mực nước đầu',
      symbol: 'V₁',
      value: formatVolume(initialVolumeCm3),
      unit: volUnit,
      leastCountNote: isSI || isMgL ? 'ĐCNN: 0,001 L' : 'ĐCNN: 1,0 cm³',
      isReady: true,
    },
    {
      id: 'v2',
      label: 'Mực nước sau',
      symbol: 'V₂',
      value: formatVolume(finalVolumeCm3),
      unit: volUnit,
      leastCountNote: isSI || isMgL ? 'ĐCNN: 0,001 L' : 'ĐCNN: 1,0 cm³',
      isReady: finalVolumeCm3 !== null,
      onClick: onQuickSubmergeSpecimen,
      actionLabel: 'Thả ngập vật vào ống đong',
    },
    {
      id: 'v',
      label: 'Thể tích vật (V₂ − V₁)',
      symbol: 'V',
      value: formatVolume(objectVolumeCm3),
      unit: volUnit,
      leastCountNote: 'Độ dâng mực nước',
      isReady: objectVolumeCm3 !== null,
      onClick: onQuickSubmergeSpecimen,
    },
    {
      id: 'rho',
      label: 'Khối lượng riêng (m / V)',
      symbol: 'ρ',
      value: formatDensity(densityGCm3),
      unit: densityUnit,
      leastCountNote: combinedUncertaintyText
        ? `Sai số: ${combinedUncertaintyText}`
        : 'Cần đo m và V',
      isReady: densityGCm3 !== null,
      highlight: true,
    },
  ];

  return (
    <section
      aria-label="Khay kết quả và công thức"
      className={`border rounded-[12px] flex flex-col shrink-0 select-none transition-all overflow-hidden backdrop-blur-md ${
        isDockCollapsed ? 'h-[38px]' : 'h-[148px] md:h-[140px]'
      } ${
        isDarkMode
          ? 'bg-[#0F1828]/80 border-[#263854]/85 text-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.28)]'
          : 'bg-[#F2F6FB]/88 border-[#C4D5E8] text-[#123059] shadow-[0_2px_10px_rgba(18,52,107,0.06)]'
      }`}
    >
      {/* Thanh tiêu đề Dock ưu tiên Ký hiệu + Công thức trực tiếp + Đơn vị rõ ràng */}
      <div
        className={`h-[38px] px-2 sm:px-3 flex items-center justify-between gap-1.5 border-b shrink-0 ${
          isDarkMode ? 'border-[#263854]/80 bg-[#0B1424]/75' : 'border-[#C4D5E8] bg-[#E8F0FA]/85'
        }`}
      >
        {/* Nhóm Tab chuyển đổi nội dung bằng Ký hiệu & Thông số trực tiếp */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar min-w-0">
          {/* Tab 1: Bảng số liệu m · V · ρ */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('results');
              if (isDockCollapsed) setIsDockCollapsed(false);
            }}
            className={`px-2 sm:px-2.5 py-1 rounded-[8px] text-[13px] sm:text-[14px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'results' && !isDockCollapsed
                ? 'bg-[#1D63E8]/90 text-white shadow-xs'
                : isDarkMode
                  ? 'text-slate-200 hover:bg-white/10'
                  : 'text-[#123059] hover:bg-[#DCE8F8]'
            }`}
            title="Bảng kết quả đo Khối lượng (m), Thể tích (V) và Khối lượng riêng (ρ)"
          >
            <Table2 className="w-4 h-4 shrink-0 text-[#38BDF8]" />
            <span className="font-mono font-extrabold">
              {isDetailedMode
                ? `Kết quả đo (${massUnit} · ${isSI ? 'L' : 'cm³'} · ${densityUnit})`
                : `m(${massUnit}) · V(${isSI ? 'L' : 'cm³'})`}
            </span>
            {densityGCm3 !== null && (
              <span className="ml-0.5 font-mono text-[11.5px] sm:text-[12.5px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 tabular-nums">
                ρ={formatDensity(densityGCm3)} {densityUnit}
              </span>
            )}
          </button>

          {/* Tab 2: Hiển thị thẳng công thức ρ = m / V thay cho chữ "Công thức" */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('formula');
              if (isDockCollapsed) setIsDockCollapsed(false);
            }}
            className={`px-2 sm:px-2.5 py-1 rounded-[8px] text-[13px] sm:text-[14px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'formula' && !isDockCollapsed
                ? 'bg-[#1D63E8]/90 text-white shadow-xs'
                : isDarkMode
                  ? 'text-slate-200 hover:bg-white/10'
                  : 'text-[#123059] hover:bg-[#DCE8F8]'
            }`}
            title="Công thức tính khối lượng riêng: ρ = m / V"
          >
            <Calculator className="w-3.5 h-3.5 shrink-0 text-[#F59E0B]" />
            <span className="font-mono font-extrabold tracking-tight">
              {isDetailedMode
                ? `Công thức: ρ = m / V (${densityUnit})`
                : `ρ = m / V (${densityUnit})`}
            </span>
          </button>

          {/* Tab 3: Ký hiệu cách đo (Con mắt ngắm vạch chia) + Ghi rõ đơn vị ĐCNN */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('reading-guide');
              if (isDockCollapsed) setIsDockCollapsed(false);
            }}
            className={`px-2 sm:px-2.5 py-1 rounded-[8px] text-[13px] sm:text-[14px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'reading-guide' && !isDockCollapsed
                ? 'bg-[#1D63E8]/90 text-white shadow-xs'
                : isDarkMode
                  ? 'text-slate-200 hover:bg-white/10'
                  : 'text-[#123059] hover:bg-[#DCE8F8]'
            }`}
            title="Cách đọc vạch chia mặt khum (Meniscus) & Độ chia nhỏ nhất (ĐCNN)"
          >
            <Eye className="w-4 h-4 shrink-0 text-[#FF647C]" />
            <span className="font-mono font-extrabold">
              {isDetailedMode
                ? `Cách đo & ĐCNN: ±${isSI ? '0,00001 kg' : '0,01 g'} · ±${isSI ? '0,001 L' : '1 mL'}`
                : `±${isSI ? '0,00001 kg' : '0,01 g'} · ±${isSI ? '0,001 L' : '1 mL'}`}
            </span>
          </button>

          {/* Tab 4: Ký hiệu Bước thực hành B1/5 */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('steps');
              if (isDockCollapsed) setIsDockCollapsed(false);
            }}
            className={`px-2 sm:px-2.5 py-1 rounded-[8px] text-[13px] sm:text-[14px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'steps' && !isDockCollapsed
                ? 'bg-[#1D63E8]/90 text-white shadow-xs'
                : isDarkMode
                  ? 'text-slate-200 hover:bg-white/10'
                  : 'text-[#123059] hover:bg-[#DCE8F8]'
            }`}
            title="Các bước thực hành thí nghiệm"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0 text-[#22C55E]" />
            <span className="font-mono font-extrabold">
              {isDetailedMode ? `Hướng dẫn (B${guidedStep}/5)` : `B${guidedStep}/5`}
            </span>
          </button>
        </div>

        {/* Cụm chuyển đổi đơn vị (Ghi rõ đơn vị g/cm³ · mL và kg/m³ · L) + Nút Bật/Tắt Giải thích (?) + Nút Mở/Ẩn khay */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <div
            className={`flex items-center p-0.5 rounded-[8px] border font-mono text-[11.5px] sm:text-[12.5px] font-extrabold ${
              isDarkMode
                ? 'bg-[#162234]/80 border-[#2E476B]'
                : 'bg-white/90 border-[#C4D5E8]'
            }`}
            role="group"
            aria-label="Đổi đơn vị đo"
          >
            <button
              type="button"
              onClick={() => setUnitSystem('CGS')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-[6px] transition-colors cursor-pointer whitespace-nowrap ${
                unitSystem === 'CGS'
                  ? 'bg-[#1D63E8] text-white'
                  : isDarkMode
                    ? 'text-slate-300 hover:text-white'
                    : 'text-[#4B6280] hover:text-[#123059]'
              }`}
              title="Hệ đơn vị thực hành: g, cm³ (mL), g/cm³"
            >
              <span>g · mL</span>
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('MG_L')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-[6px] transition-colors cursor-pointer whitespace-nowrap ${
                unitSystem === 'MG_L'
                  ? 'bg-[#1D63E8] text-white'
                  : isDarkMode
                    ? 'text-slate-300 hover:text-white'
                    : 'text-[#4B6280] hover:text-[#123059]'
              }`}
              title="Chuyển đổi đơn vị: miligam (mg), lít (L), g/L"
            >
              <span>mg · L</span>
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('SI')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-[6px] transition-colors cursor-pointer whitespace-nowrap ${
                unitSystem === 'SI'
                  ? 'bg-[#1D63E8] text-white'
                  : isDarkMode
                    ? 'text-slate-300 hover:text-white'
                    : 'text-[#4B6280] hover:text-[#123059]'
              }`}
              title="Hệ đơn vị SI chuẩn: kg, L (dm³), kg/m³"
            >
              <span>kg/m³ · L</span>
            </button>
          </div>

          {/* Nút bật/tắt chế độ Giải thích chi tiết & Hướng dẫn trên đầu dụng cụ */}
          <button
            type="button"
            onClick={handleToggleDetailed}
            className={`h-7 px-2 rounded-[7px] text-[12px] font-extrabold flex items-center gap-1 border transition-colors cursor-pointer ${
              isDetailedMode
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-xs'
                : isDarkMode
                  ? 'bg-white/5 hover:bg-white/15 border-white/15 text-slate-300'
                  : 'bg-white hover:bg-[#DCE8F8] border-[#C4D5E8] text-[#123059]'
            }`}
            title={
              isDetailedMode
                ? 'Đang BẬT giải thích chữ & hướng dẫn trên từng dụng cụ (Nhấn để về chế độ Ký hiệu gọn)'
                : 'Bật hiển thị chữ giải thích chi tiết & hướng dẫn trên đầu từng dụng cụ'
            }
            aria-pressed={isDetailedMode}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            {isDetailedMode && <span className="hidden sm:inline">Giải thích</span>}
          </button>

          <button
            type="button"
            onClick={() => setIsDockCollapsed((v) => !v)}
            className="h-6.5 px-2 rounded-[6px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[11.5px] font-extrabold flex items-center gap-0.5 transition-colors cursor-pointer shadow-xs shrink-0"
            title={isDockCollapsed ? 'Mở bảng số liệu' : 'Ẩn bảng số liệu'}
            aria-label={isDockCollapsed ? 'Mở bảng số liệu' : 'Ẩn bảng số liệu'}
          >
            <span>{isDockCollapsed ? 'Mở' : 'Ẩn'}</span>
            {isDockCollapsed ? (
              <ChevronUp className="w-3.5 h-3.5 text-white" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Nội dung của Tab đang chọn */}
      {!isDockCollapsed && (
        <div className="flex-1 overflow-y-auto px-3.5 py-2 min-h-0">
          {/* TAB 1: KẾT QUẢ ĐO */}
          {activeTab === 'results' && (
            <div className="flex flex-col lg:flex-row items-stretch gap-2.5 sm:gap-3 h-full">
              <div className="flex-1 overflow-y-auto space-y-2">
                {/* Hàng nút Thao tác đo nhanh dành cho Mobile / Tablet (< 1280px) */}
                <div className="flex xl:hidden items-center gap-2">
                  <button
                    type="button"
                    onClick={onQuickWeighSpecimen}
                    className={`flex-1 py-1.5 px-2.5 rounded-[7px] text-[12.5px] sm:text-[13.5px] font-bold flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                      measuredMassG !== null
                        ? isDarkMode
                          ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-[#1D63E8] hover:bg-[#1552C7] text-white border-transparent'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {measuredMassG !== null
                        ? `m = ${formatMass(measuredMassG)} ${massUnit}`
                        : '1. Cân vật (m)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={onQuickSubmergeSpecimen}
                    className={`flex-1 py-1.5 px-2.5 rounded-[7px] text-[12.5px] sm:text-[13.5px] font-bold flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                      finalVolumeCm3 !== null
                        ? isDarkMode
                          ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : isDarkMode
                          ? 'bg-[#1A273D] hover:bg-[#243552] border-[#2E476B] text-slate-100'
                          : 'bg-white hover:bg-[#DCE8F8] border-[#C4D5E8] text-[#123059]'
                    }`}
                  >
                    <Droplets className="w-3.5 h-3.5 shrink-0 text-[#00BCEB]" />
                    <span className="truncate">
                      {finalVolumeCm3 !== null
                        ? `V = ${formatVolume(objectVolumeCm3)} ${volUnit}`
                        : '2. Đo thể tích (V)'}
                    </span>
                  </button>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr
                      className={`border-b text-[12.5px] sm:text-[13.5px] font-bold ${
                        isDarkMode
                          ? 'border-[#263854] text-slate-200 bg-[#1A273D]'
                          : 'border-[#C4D5E8] text-[#123059] bg-[#E6EEF8]'
                      }`}
                    >
                      <th className="py-1 px-2 sm:px-2.5 rounded-tl-[6px]">Đại lượng</th>
                      <th className="py-1 px-1.5 sm:px-2 text-center">Ký hiệu</th>
                      <th className="py-1 px-2 sm:px-2.5 text-right">Giá trị</th>
                      <th className="py-1 px-2 sm:px-2.5 text-right">Đơn vị</th>
                      <th className="hidden md:table-cell py-1 px-2.5 text-right rounded-tr-[6px]">
                        ĐCNN / Sai số
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y text-[13.5px] sm:text-[14.5px] ${
                      isDarkMode ? 'divide-[#1E2E48]' : 'divide-[#DCE8F8]'
                    }`}
                  >
                    {rows.map((r) => (
                      <tr
                        key={r.id}
                        onClick={r.onClick}
                        title={r.actionLabel}
                        className={`transition-colors ${
                          r.highlight
                            ? isDarkMode
                              ? 'bg-[#1D63E8]/20 font-bold'
                              : 'bg-[#DCE8F8]/85 font-bold'
                            : r.onClick
                              ? isDarkMode
                                ? 'hover:bg-[#1A273D] cursor-pointer'
                                : 'hover:bg-[#E6EEF8] cursor-pointer'
                              : ''
                        }`}
                      >
                        <td
                          className={`py-1 px-2 sm:px-2.5 font-semibold ${
                            isDarkMode ? 'text-slate-100' : 'text-[#123059]'
                          }`}
                        >
                          {r.label}
                        </td>
                        <td
                          className={`py-1 px-1.5 sm:px-2 text-center font-mono font-bold ${
                            isDarkMode ? 'text-[#00BCEB]' : 'text-[#1D63E8]'
                          }`}
                        >
                          {r.symbol}
                        </td>
                        <td
                          className={`py-1 px-2 sm:px-2.5 text-right font-mono tabular-nums font-bold ${
                            r.isReady
                              ? r.highlight
                                ? isDarkMode
                                  ? 'text-[#00BCEB] text-[15px] sm:text-[16px]'
                                  : 'text-[#1D63E8] text-[15px] sm:text-[16px]'
                                : isDarkMode
                                  ? 'text-white'
                                  : 'text-[#123059]'
                              : isDarkMode
                                ? 'text-slate-400'
                                : 'text-[#4B6280]'
                          }`}
                        >
                          {r.value}
                        </td>
                        <td
                          className={`py-1 px-2 sm:px-2.5 text-right font-mono text-[12.5px] sm:text-[13.5px] font-semibold ${
                            isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'
                          }`}
                        >
                          {r.unit}
                        </td>
                        <td
                          className={`hidden md:table-cell py-1 px-2.5 text-right text-[13px] ${
                            isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'
                          }`}
                        >
                          {r.leastCountNote}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Thao tác đo nhanh rút gọn trên Desktop XL */}
              <div
                className={`hidden xl:flex w-[225px] rounded-[10px] border p-2.5 flex-col justify-between shrink-0 ${
                  isDarkMode
                    ? 'bg-[#162234] border-[#263854]'
                    : 'bg-[#E6EEF8]/70 border-[#C4D5E8]'
                }`}
              >
                <div className="text-[14px] font-extrabold">
                  Thao tác nhanh:
                </div>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={onQuickWeighSpecimen}
                    className={`w-full py-1.5 px-2.5 rounded-[7px] text-[13.5px] font-bold flex items-center gap-2 border transition-colors cursor-pointer ${
                      measuredMassG !== null
                        ? isDarkMode
                          ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-[#1D63E8] hover:bg-[#1552C7] text-white border-transparent'
                    }`}
                  >
                    <Scale className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {measuredMassG !== null
                        ? `m = ${formatMass(measuredMassG)} ${massUnit}`
                        : '1. Cân vật (m)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={onQuickSubmergeSpecimen}
                    className={`w-full py-1.5 px-2.5 rounded-[7px] text-[13.5px] font-bold flex items-center gap-2 border transition-colors cursor-pointer ${
                      finalVolumeCm3 !== null
                        ? isDarkMode
                          ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : isDarkMode
                          ? 'bg-[#1A273D] hover:bg-[#243552] border-[#2E476B] text-slate-100'
                          : 'bg-white hover:bg-[#DCE8F8] border-[#C4D5E8] text-[#123059]'
                    }`}
                  >
                    <Droplets className="w-4 h-4 shrink-0 text-[#00BCEB]" />
                    <span className="truncate">
                      {finalVolumeCm3 !== null
                        ? `V = ${formatVolume(objectVolumeCm3)} ${volUnit}`
                        : '2. Đo thể tích (V)'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CÔNG THỨC */}
          {activeTab === 'formula' && (
            <div className="flex flex-col sm:flex-row items-center gap-4 h-full py-1">
              <div
                className={`px-6 py-3.5 rounded-[10px] border flex flex-col items-center justify-center shrink-0 ${
                  isDarkMode
                    ? 'bg-[#1A273D] border-[#00BCEB]/50'
                    : 'bg-[#FAF3DD] border-[#E8B84B]'
                }`}
              >
                <div className="text-[30px] font-extrabold font-mono tracking-wide">
                  ρ = <span className="text-[#3B82F6]">m</span> /{' '}
                  <span className="text-[#00BCEB]">V</span>
                </div>
                <span
                  className={`text-[13.5px] mt-1 font-semibold ${
                    isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'
                  }`}
                >
                  V = V₂ − V₁ (bình chia độ / bình tràn)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 w-full text-[14.5px]">
                <div
                  className={`p-2.5 rounded-[9px] border ${
                    isDarkMode
                      ? 'bg-[#162234] border-[#263854]'
                      : 'bg-white border-[#C4D5E8]'
                  }`}
                >
                  <div className="font-extrabold text-[15.5px]">
                    <span className="font-mono text-[#3B82F6]">m</span> — Khối lượng ({massUnit})
                  </div>
                  <p
                    className={`text-[14px] mt-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'
                    }`}
                  >
                    Đo bằng cân điện tử sau khi bấm <strong>Trừ bì (TARE)</strong> về 0,00 g.
                  </p>
                </div>

                <div
                  className={`p-2.5 rounded-[9px] border ${
                    isDarkMode
                      ? 'bg-[#162234] border-[#263854]'
                      : 'bg-white border-[#C4D5E8]'
                  }`}
                >
                  <div className="font-extrabold text-[15.5px]">
                    <span className="font-mono text-[#00BCEB]">V</span> — Thể tích ({volUnit})
                  </div>
                  <p
                    className={`text-[14px] mt-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'
                    }`}
                  >
                    Phần nước dâng lên khi nhúng ngập vật rắn.
                  </p>
                </div>

                <div
                  className={`p-2.5 rounded-[9px] border ${
                    isDarkMode
                      ? 'bg-[#162234] border-[#263854]'
                      : 'bg-white border-[#C4D5E8]'
                  }`}
                >
                  <div className="font-extrabold text-[15.5px]">
                    <span className="font-mono text-emerald-400">ρ</span> — KLR ({densityUnit})
                  </div>
                  <p
                    className={`text-[14px] mt-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'
                    }`}
                  >
                    Khối lượng 1 đơn vị thể tích (1 g/cm³ = 1000 kg/m³).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CÁCH ĐỌC & ĐCNN */}
          {activeTab === 'reading-guide' && (
            <div className="flex items-center gap-4 h-full py-1">
              <div
                className={`w-[110px] h-[120px] rounded-[10px] border flex items-center justify-center shrink-0 p-1 ${
                  isDarkMode
                    ? 'bg-[#1A273D] border-[#2E476B]'
                    : 'bg-[#E6EEF8] border-[#C4D5E8]'
                }`}
              >
                <svg
                  viewBox="0 0 120 130"
                  className="w-full h-full"
                  aria-label="Minh họa đọc đáy mặt khum"
                >
                  <rect
                    x="22"
                    y="14"
                    width="44"
                    height="102"
                    fill="rgba(224,242,254,0.38)"
                    stroke="#0284C7"
                    strokeWidth="2"
                    rx="2"
                  />
                  <path
                    d="M23 56 Q44 68 65 56 V115 H23 Z"
                    fill="rgba(56,189,248,0.58)"
                  />
                  <path
                    d="M23 56 Q44 68 65 56"
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth="2.5"
                  />
                  {[28, 40, 52, 62, 74, 86, 98].map((y, idx) => (
                    <line
                      key={y}
                      x1="23"
                      y1={y}
                      x2={idx % 2 === 1 ? '38' : '32'}
                      y2={y}
                      stroke="#0B3A7D"
                      strokeWidth={idx % 2 === 1 ? '1.8' : '1.2'}
                    />
                  ))}
                  <line
                    x1="36"
                    y1="62"
                    x2="92"
                    y2="62"
                    stroke="#22C55E"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />
                  <circle cx="44" cy="62" r="3" fill="#22C55E" />
                  <path
                    d="M94 62 Q103 55 112 62 Q103 69 94 62 Z"
                    fill="#FFFFFF"
                    stroke="#12346B"
                    strokeWidth="1.8"
                  />
                  <circle cx="103" cy="62" r="2.8" fill="#1E6BFF" />
                  <text
                    x="72"
                    y="54"
                    fill="#22C55E"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    Đúng
                  </text>
                </svg>
              </div>

              <div className="space-y-1.5 text-[14.5px]">
                <div className="font-extrabold text-[16px]">
                  Quy tắc đọc mặt khum & ĐCNN
                </div>
                <p
                  className={
                    isDarkMode ? 'text-slate-200 leading-relaxed' : 'text-[#4B6280] leading-relaxed'
                  }
                >
                  • <strong>Đọc mặt khum:</strong> Đặt mắt ngang <strong>đáy mặt khum lõm</strong>, đọc theo vạch chia gần nhất.
                </p>
                <p
                  className={
                    isDarkMode ? 'text-slate-200 leading-relaxed' : 'text-[#4B6280] leading-relaxed'
                  }
                >
                  • <strong>ĐCNN & Sai số:</strong> ĐCNN là hiệu 2 vạch liên tiếp (ống đong: 1,0 mL). ĐCNN cho biết độ phân giải đọc vạch.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: HƯỚNG DẪN 5 BƯỚC (Tích hợp trực tiếp cho Mobile / Tablet) */}
          {activeTab === 'steps' && (
            <div className="flex flex-col gap-2 py-0.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {MOBILE_PRACTICE_STEPS.map((item) => {
                  const isCurrent = guidedStep === item.step;
                  const isCompleted = guidedStep > item.step;
                  return (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => onChangeGuidedStep?.(item.step)}
                      className={`p-2.5 rounded-[9px] border text-left transition-all flex items-start gap-2 cursor-pointer ${
                        isCurrent
                          ? isDarkMode
                            ? 'bg-[#1D63E8]/25 border-[#00BCEB] shadow-xs'
                            : 'bg-[#DCE8F8] border-[#1D63E8] shadow-xs'
                          : isCompleted
                            ? isDarkMode
                              ? 'bg-[#1A273D] border-[#263854]'
                              : 'bg-[#E6EEF8] border-[#C4D5E8]'
                            : isDarkMode
                              ? 'bg-[#162234] border-[#22324D]'
                              : 'bg-white border-[#D0DFEE]'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[12.5px] font-extrabold shrink-0 mt-0.5 ${
                          isCurrent
                            ? 'bg-[#1D63E8] text-white'
                            : isCompleted
                              ? 'bg-[#22C55E] text-white'
                              : isDarkMode
                                ? 'bg-[#243552] text-slate-300'
                                : 'bg-[#DCE8F8] text-[#123059]'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          item.step
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13.5px] font-bold leading-snug">
                          {item.step}. {item.title}
                        </div>
                        <div
                          className={`text-[12px] leading-snug mt-0.5 ${
                            isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'
                          }`}
                        >
                          {item.shortDesc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {onChangeGuidedStep && (
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      onChangeGuidedStep(
                        Math.max(1, guidedStep - 1) as StudentGuidedStepNumber,
                      )
                    }
                    disabled={guidedStep <= 1}
                    className={`px-3 py-1.5 rounded-[8px] border text-[13px] font-extrabold flex items-center gap-1.5 transition-colors ${
                      guidedStep <= 1
                        ? 'opacity-30 cursor-not-allowed bg-slate-800 text-slate-500 border-slate-700'
                        : 'bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white border-sky-500/40 cursor-pointer'
                    }`}
                    title="Quay về bước trước (⟲)"
                  >
                    <RotateCcw className="w-3.5 h-3.5 stroke-[2.4]" />
                    <span>Bước trước</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onChangeGuidedStep(
                        (guidedStep < 5
                          ? guidedStep + 1
                          : 1) as StudentGuidedStepNumber,
                      )
                    }
                    className="px-3.5 py-1.5 rounded-[8px] bg-[#1D63E8] hover:bg-[#1552C7] text-white text-[13px] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    title={guidedStep < 5 ? `Tiến tới Bước ${guidedStep + 1} (⟳)` : 'Làm lại từ Bước 1 (⟳)'}
                  >
                    <span>
                      {guidedStep < 5
                        ? `Sang Bước ${guidedStep + 1}`
                        : 'Làm lại từ Bước 1'}
                    </span>
                    <RotateCw className="w-3.5 h-3.5 stroke-[2.4]" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

