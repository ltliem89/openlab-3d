import React, { useState, useMemo } from 'react';
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
  RotateCcw,
  RotateCw,
  Download,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { StudentGuidedStepNumber } from './StudentGuidedStepPanel';
import { ExperimentDefinition } from '../../domain/types';
import { MathFormula, RichMathText } from '../common/MathFormula';

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
  activeExperiment?: ExperimentDefinition;
  onAssembleOpticalBench?: () => void;
  waterTemperatureC?: number;
  isFlameLit?: boolean;
  onQuickIgniteBurner?: () => void;
  onQuickCoolWater?: () => void;
  measuredForceAirN?: number | null;
  measuredForceSubN?: number | null;
  displacedVolumeMl?: number | null;
  opticalDCm?: number | null;
  opticalDPrimeCm?: number | null;
  opticalFCm?: number | null;
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
    title: 'Cân vật ($m$)',
    shortDesc: 'Đặt vật lên đĩa cân để đọc khối lượng $m$.',
  },
  {
    step: 3,
    title: 'Đo thể tích ($V$)',
    shortDesc: 'Thả ngập vật vào ống đong để đọc $V = V_2 - V_1$.',
  },
  {
    step: 4,
    title: 'Tính KLR ($\\rho$)',
    shortDesc: 'Tính theo công thức $\\rho = \\frac{m}{V}$.',
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
  activeExperiment,
  onAssembleOpticalBench,
  waterTemperatureC,
  isFlameLit = false,
  onQuickIgniteBurner,
  onQuickCoolWater,
  measuredForceAirN,
  measuredForceSubN,
  displacedVolumeMl,
  opticalDCm,
  opticalDPrimeCm,
  opticalFCm,
}) => {
  const [activeTab, setActiveTab] = useState<StudentBottomTabId>('results');
  const [unitSystem, setUnitSystem] = useState<MeasurementUnitSystem>('CGS');
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [localDetailedGuides, setLocalDetailedGuides] = useState<boolean>(false);

  const isThermal = activeExperiment?.experimentId === 'OL3D-EXP-THERMAL-BOIL-0001';
  const isOptics = activeExperiment?.experimentId === 'OL3D-EXP-OPTICS-LENS-0001';
  const isDisplacement = activeExperiment?.experimentId === 'OL3D-EXP-DISPLACEMENT-0001';
  const isDensity = !isOptics && !isDisplacement && !isThermal;

  const currentPracticeSteps = useMemo(() => {
    if (activeExperiment?.steps && activeExperiment.steps.length > 0) {
      return activeExperiment.steps.slice(0, 5).map((s, idx) => ({
        step: ((idx + 1) as StudentGuidedStepNumber),
        title: s.title.replace(/^Bước\s*\d+\s*:\s*/i, ''),
        shortDesc: s.instructionDetail || s.description,
      }));
    }
    return MOBILE_PRACTICE_STEPS;
  }, [activeExperiment]);

  const isDetailedMode =
    showDetailedGuides !== undefined ? showDetailedGuides : localDetailedGuides;


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

  const rows = useMemo(() => {
    if (isThermal) {
      const currentT = waterTemperatureC ?? 25.0;
      const t0 = 25.0;
      const deltaT = Math.max(0, currentT - t0);
      const massKg = 0.10; // 100 mL water
      const cWater = 4184; // J/(kg·K)
      const qJoules = massKg * cWater * deltaT;
      const isBoiling = currentT >= 99.5;

      return [
        {
          id: 'thm-t',
          label: 'Nhiệt độ hiện tại của nước',
          symbol: 'T',
          mathSymbol: 'T',
          value: currentT.toFixed(1),
          unit: '°C',
          leastCountNote: 'Nhiệt kế rượu (ĐCNN: 1,0 °C · ±0,5 °C)',
          isReady: true,
          highlight: isBoiling,
          onClick: onQuickIgniteBurner,
          actionLabel: isFlameLit ? 'Dập tắt đèn cồn' : 'Châm lửa đèn cồn đun sôi',
        },
        {
          id: 'thm-t0',
          label: 'Nhiệt độ phòng ban đầu',
          symbol: 'T₀',
          mathSymbol: 'T_0',
          value: '25.0',
          unit: '°C',
          leastCountNote: 'Nhiệt độ chuẩn phòng thí nghiệm',
          isReady: true,
          onClick: onQuickCoolWater,
          actionLabel: 'Làm nguội nước về 25°C',
        },
        {
          id: 'thm-dt',
          label: 'Độ biến thiên nhiệt độ (T − T₀)',
          symbol: 'ΔT',
          mathSymbol: '\\Delta T = T - T_0',
          value: deltaT.toFixed(1),
          unit: 'K (°C)',
          leastCountNote: isBoiling ? 'Đạt nhiệt độ sôi chuẩn 100°C' : 'Tăng tuyến tính khi đun',
          isReady: deltaT > 0,
        },
        {
          id: 'thm-q',
          label: 'Nhiệt lượng thu vào (m·c·ΔT)',
          symbol: 'Q',
          mathSymbol: 'Q = m \\cdot c \\cdot \\Delta T',
          value: qJoules.toFixed(0),
          unit: 'J',
          leastCountNote: 'm = 0,10 kg · c = 4184 J/(kg·K)',
          isReady: qJoules > 0,
          highlight: true,
        },
        {
          id: 'thm-state',
          label: 'Trạng thái nhiệt động học',
          symbol: 'TT',
          mathSymbol: '\\text{State}',
          value: isBoiling ? 'Đang sôi (100°C)' : isFlameLit ? 'Đang đun nóng...' : 'Cân bằng nhiệt',
          unit: '',
          leastCountNote: isBoiling ? 'Bình nguyên nhiệt độ không đổi' : isFlameLit ? 'Ngọn lửa cồn đang cháy ~700°C' : 'Đèn cồn đang tắt',
          isReady: true,
        },
      ];
    }
    if (isOptics) {
      const d = opticalDCm ?? 20.0;
      const f = opticalFCm ?? 10.0;
      const dPrime = opticalDPrimeCm ?? (Math.abs(d - f) > 0.05 ? (f * d) / (d - f) : 999.9);
      const mag = Math.abs(dPrime / Math.max(0.1, d));
      return [
        {
          id: 'opt-d',
          label: 'Khoảng cách vật sáng chữ F tới thấu kính',
          symbol: 'd',
          mathSymbol: 'd',
          value: d.toFixed(1),
          unit: 'cm',
          leastCountNote: 'ĐCNN: 1 mm (thước ray 90 cm)',
          isReady: true,
          onClick: onAssembleOpticalBench,
          actionLabel: 'Căn chỉnh vị trí vật sáng F',
        },
        {
          id: 'opt-dp',
          label: 'Khoảng cách màn hứng ảnh tới thấu kính',
          symbol: "d'",
          mathSymbol: "d'",
          value: Math.abs(dPrime) > 300 ? '∞' : dPrime.toFixed(1),
          unit: 'cm',
          leastCountNote: dPrime > 0 ? 'Vị trí ảnh thật rõ nét' : 'Ảnh ảo không hứng được trên màn',
          isReady: true,
          onClick: onAssembleOpticalBench,
          actionLabel: 'Dịch chuyển màn chắn tìm ảnh nét',
        },
        {
          id: 'opt-f',
          label: 'Tiêu cự thấu kính đo được (Gaussian)',
          symbol: 'f',
          mathSymbol: 'f = \\frac{d \\cdot d\'}{d + d\'}',
          value: f.toFixed(1),
          unit: 'cm',
          leastCountNote: f > 0 ? 'Thấu kính hội tụ f > 0' : 'Thấu kính phân kỳ f < 0',
          isReady: true,
          highlight: true,
        },
        {
          id: 'opt-mag',
          label: 'Độ phóng đại ảnh (|k| = |d\'| / d)',
          symbol: '|k|',
          mathSymbol: '|k| = \\frac{|d\'|}{d}',
          value: Math.abs(dPrime) > 300 ? '∞' : mag.toFixed(2),
          unit: 'lần',
          leastCountNote: dPrime > 0 ? 'Ảnh thật ngược chiều' : 'Ảnh ảo cùng chiều',
          isReady: true,
        },
      ];
    }
    if (isDisplacement) {
      const pAir = measuredForceAirN ?? 0.65;
      const fSub = measuredForceSubN ?? 0.41;
      const fa = Math.max(0, pAir - fSub);
      const dispV = displacedVolumeMl ?? 24.5;
      return [
        {
          id: 'arch-p',
          label: 'Trọng lượng vật ngoài không khí',
          symbol: 'P',
          mathSymbol: 'P',
          value: pAir.toFixed(2),
          unit: 'N',
          leastCountNote: 'Đọc trên lực kế 5 N (ĐCNN: 0.1 N)',
          isReady: true,
        },
        {
          id: 'arch-f',
          label: 'Số chỉ lực kế khi vật ngập nước',
          symbol: 'F',
          mathSymbol: 'F',
          value: fSub.toFixed(2),
          unit: 'N',
          leastCountNote: 'Lực căng giảm do lực đẩy chất lỏng',
          isReady: true,
        },
        {
          id: 'arch-fa',
          label: 'Độ lớn lực đẩy Archimedes (P − F)',
          symbol: 'F_A',
          mathSymbol: 'F_A = P - F',
          value: fa.toFixed(2),
          unit: 'N',
          leastCountNote: `${pAir.toFixed(2)} N - ${fSub.toFixed(2)} N = ${fa.toFixed(2)} N`,
          isReady: true,
          highlight: true,
        },
        {
          id: 'arch-v',
          label: 'Thể tích nước dời chỗ hứng được',
          symbol: 'V',
          mathSymbol: 'V',
          value: dispV.toFixed(1),
          unit: 'mL',
          leastCountNote: 'Kiểm chứng F_A = d × V',
          isReady: true,
        },
      ];
    }
    return [
      {
        id: 'mass',
        label: 'Khối lượng vật',
        symbol: 'm',
        mathSymbol: 'm',
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
        mathSymbol: 'V_1',
        value: formatVolume(initialVolumeCm3),
        unit: volUnit,
        leastCountNote: isSI || isMgL ? 'ĐCNN: 0,001 L' : 'ĐCNN: 1,0 cm³',
        isReady: true,
      },
      {
        id: 'v2',
        label: 'Mực nước sau',
        symbol: 'V₂',
        mathSymbol: 'V_2',
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
        mathSymbol: 'V = V_2 - V_1',
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
        mathSymbol: '\\rho = \\frac{m}{V}',
        value: formatDensity(densityGCm3),
        unit: densityUnit,
        leastCountNote: combinedUncertaintyText
          ? `Sai số: ${combinedUncertaintyText}`
          : 'Cần đo m và V',
        isReady: densityGCm3 !== null,
        highlight: true,
      },
    ];
  }, [
    isThermal,
    isOptics,
    isDisplacement,
    waterTemperatureC,
    isFlameLit,
    onQuickIgniteBurner,
    onQuickCoolWater,
    opticalDCm,
    opticalDPrimeCm,
    opticalFCm,
    measuredForceAirN,
    measuredForceSubN,
    displacedVolumeMl,
    measuredMassG,
    initialVolumeCm3,
    finalVolumeCm3,
    objectVolumeCm3,
    densityGCm3,
    isMgL,
    isSI,
    massUnit,
    volUnit,
    densityUnit,
    combinedUncertaintyText,
    onQuickWeighSpecimen,
    onQuickSubmergeSpecimen,
    onAssembleOpticalBench,
  ]);

  const handleExportCSV = () => {
    const escapeCSV = (val: string) => `"${String(val).replace(/"/g, '""')}"`;
    const headers = ['Đại lượng', 'Ký hiệu', 'Giá trị', 'Đơn vị', 'ĐCNN / Sai số'];
    const csvLines = [
      headers.map(escapeCSV).join(','),
      ...rows.map((r) =>
        [r.label, r.symbol, r.value, r.unit, r.leastCountNote].map(escapeCSV).join(','),
      ),
    ];
    // Thêm BOM UTF-8 (\uFEFF) để hiển thị đúng tiếng Việt và ký hiệu khoa học trên Excel
    const csvContent = '\uFEFF' + csvLines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ket-qua-thi-nghiem-${unitSystem.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      aria-label="Khay kết quả và công thức"
      className={`border rounded-[12px] flex flex-col shrink-0 select-none transition-all overflow-hidden backdrop-blur-md ${
        isFullScreen
          ? 'fixed inset-2 sm:inset-4 z-50 h-auto shadow-2xl'
          : isDockCollapsed
            ? 'h-[38px]'
            : 'h-[148px] md:h-[140px]'
      } ${
        isDarkMode
          ? 'bg-[#0F1828]/95 border-[#263854]/85 text-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.28)]'
          : 'bg-[#F2F6FB]/95 border-[#C4D5E8] text-[#123059] shadow-[0_2px_10px_rgba(18,52,107,0.06)]'
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
          {/* Tab 1: Bảng số liệu */}
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
            title="Bảng kết quả đo số liệu thực nghiệm"
          >
            <Table2 className="w-4 h-4 shrink-0 text-[#38BDF8]" />
            <span className="font-mono font-extrabold">
              {isThermal
                ? (isDetailedMode ? 'Kết quả Nhiệt học (T · ΔT · Q)' : 'T(°C) · ΔT · Q(J)')
                : isOptics
                ? (isDetailedMode ? 'Kết quả đo Quang học (d · d\' · f)' : 'd · d\' · f (cm)')
                : isDisplacement
                ? (isDetailedMode ? 'Kết quả đo Lực & Thể tích (P · F · F_A)' : 'P · F · F_A (N)')
                : (isDetailedMode
                  ? `Kết quả đo (${massUnit} · ${isSI ? 'L' : 'cm³'} · ${densityUnit})`
                  : `m(${massUnit}) · V(${isSI ? 'L' : 'cm³'})`)}
            </span>
            {isDensity && densityGCm3 !== null && (
              <span className="ml-0.5 font-mono text-[11.5px] sm:text-[12.5px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 tabular-nums">
                ρ={formatDensity(densityGCm3)} {densityUnit}
              </span>
            )}
            {isThermal && (
              <span className="ml-0.5 font-mono text-[11.5px] sm:text-[12.5px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40 tabular-nums">
                T={(waterTemperatureC ?? 25.0).toFixed(1)}°C
              </span>
            )}
          </button>

          {/* Tab 2: Hiển thị thẳng công thức */}
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
            title="Công thức vật lý chủ đạo"
          >
            <Calculator className="w-3.5 h-3.5 shrink-0 text-[#F59E0B]" />
            <span className="font-extrabold tracking-tight flex items-center gap-1">
              {isDetailedMode && <span>Công thức:</span>}
              {isThermal ? (
                <MathFormula math="Q = m \cdot c \cdot \Delta T" />
              ) : isOptics ? (
                <MathFormula math="\frac{1}{f} = \frac{1}{d} + \frac{1}{d'}" />
              ) : isDisplacement ? (
                <MathFormula math={isDetailedMode ? 'F_A = P - F = d\\cdot V' : 'F_A = P - F'} />
              ) : (
                <MathFormula math={`\\rho = \\frac{m}{V}\\text{ (${densityUnit})}`} />
              )}
            </span>
          </button>

          {/* Tab 3: Ký hiệu cách đo & ĐCNN */}
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
            title="Cách đọc vạch chia & Độ chia nhỏ nhất (ĐCNN)"
          >
            <Eye className="w-4 h-4 shrink-0 text-[#FF647C]" />
            <span className="font-mono font-extrabold">
              {isThermal
                ? (isDetailedMode ? 'Nhiệt kế: ĐCNN 1,0 °C (±0,5 °C)' : 'ĐCNN ±0,5 °C')
                : isOptics
                ? (isDetailedMode ? 'Thước ray Giá quang: ĐCNN ±1 mm' : 'ĐCNN ±1 mm')
                : isDisplacement
                ? (isDetailedMode ? 'Lực kế: ±0,1 N · Ống đong: ±1 mL' : '±0,1 N · ±1 mL')
                : (isDetailedMode
                  ? `Cách đo & ĐCNN: ±${isSI ? '0,00001 kg' : '0,01 g'} · ±${isSI ? '0,001 L' : '1 mL'}`
                  : `±${isSI ? '0,00001 kg' : '0,01 g'} · ±${isSI ? '0,001 L' : '1 mL'}`)}
            </span>
          </button>

          {/* Tab 4: Ký hiệu Bước thực hành */}
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
              {isDetailedMode ? `Hướng dẫn (B${guidedStep}/${currentPracticeSteps.length})` : `B${guidedStep}/${currentPracticeSteps.length}`}
            </span>
          </button>
        </div>

        {/* Cụm chuyển đổi đơn vị (Cho phép đổi đơn vị KLR ở bài 1, hoặc hiển thị hệ đo chuẩn ở bài khác) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {isDensity ? (
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
                className={`px-2 py-0.5 rounded-[6px] transition-colors cursor-pointer whitespace-nowrap ${
                  unitSystem === 'CGS'
                    ? 'bg-[#1D63E8] text-white font-black shadow-xs'
                    : isDarkMode
                      ? 'text-slate-300 hover:text-white'
                      : 'text-[#4B6280] hover:text-[#123059]'
                }`}
                title="Chuẩn thực hành KHTN THCS: g/cm³ (g, mL)"
              >
                <span>g/cm³</span>
              </button>
              <button
                type="button"
                onClick={() => setUnitSystem('SI')}
                className={`px-2 py-0.5 rounded-[6px] transition-colors cursor-pointer whitespace-nowrap ${
                  unitSystem === 'SI'
                    ? 'bg-[#1D63E8] text-white font-black shadow-xs'
                    : isDarkMode
                      ? 'text-slate-300 hover:text-white'
                      : 'text-[#4B6280] hover:text-[#123059]'
                }`}
                title="Chuẩn Hệ đo lường quốc tế SI: kg/m³ (kg, m³)"
              >
                <span>kg/m³ (SI)</span>
              </button>
            </div>
          ) : (
            <div
              className={`px-2 py-0.5 rounded-[7px] border font-mono text-[11.5px] sm:text-[12px] font-extrabold whitespace-nowrap ${
                isDarkMode
                  ? 'bg-[#162234]/80 border-[#2E476B] text-cyan-300'
                  : 'bg-white/90 border-[#C4D5E8] text-[#1D63E8]'
              }`}
              title="Đơn vị chuẩn của bài thí nghiệm"
            >
              {isThermal ? 'Đơn vị: °C · J · kg · s' : isOptics ? 'Đơn vị: cm · mm' : 'Đơn vị: N · mL'}
            </div>
          )}

          {/* Nút Xuất dữ liệu CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className={`h-7 px-2 rounded-[7px] text-[12px] font-extrabold flex items-center gap-1 border transition-colors cursor-pointer shrink-0 ${
              isDarkMode
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/50 text-emerald-300 shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800 shadow-xs'
            }`}
            title="Tải xuống bảng kết quả thí nghiệm hiện tại dưới định dạng CSV"
            aria-label="Xuất dữ liệu"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Xuất dữ liệu</span>
          </button>



          {/* Nút Phóng to toàn màn hình / Thu nhỏ lại */}
          <button
            type="button"
            onClick={() => {
              setIsFullScreen((prev) => {
                const next = !prev;
                if (next && isDockCollapsed) {
                  setIsDockCollapsed(false);
                }
                return next;
              });
            }}
            className={`h-7 px-2 rounded-[7px] text-[12px] font-extrabold flex items-center gap-1 border transition-colors cursor-pointer shrink-0 ${
              isFullScreen
                ? 'bg-[#1D63E8] border-[#38BDF8] text-white shadow-xs'
                : isDarkMode
                  ? 'bg-white/5 hover:bg-white/15 border-white/15 text-slate-200'
                  : 'bg-white hover:bg-[#DCE8F8] border-[#C4D5E8] text-[#123059]'
            }`}
            title={isFullScreen ? 'Thu nhỏ bảng về thanh dưới đáy' : 'Phóng to bảng toàn màn hình'}
            aria-label={isFullScreen ? 'Thu lại' : 'Toàn màn hình'}
          >
            {isFullScreen ? (
              <Minimize2 className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 shrink-0" />
            )}
            <span className="hidden sm:inline">{isFullScreen ? 'Thu lại' : 'Toàn màn hình'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (isFullScreen) {
                setIsFullScreen(false);
              }
              setIsDockCollapsed((v) => !v);
            }}
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
                {isDensity ? (
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
                ) : isThermal ? (
                  <div className="flex xl:hidden items-center gap-2">
                    <button
                      type="button"
                      onClick={onQuickIgniteBurner}
                      className={`flex-1 py-1.5 px-2.5 rounded-[7px] text-[12.5px] font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        isFlameLit
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                      }`}
                    >
                      <span>{isFlameLit ? '🛑 Tắt đèn cồn' : '🔥 Châm lửa đèn cồn'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={onQuickCoolWater}
                      className="flex-1 py-1.5 px-2.5 rounded-[7px] text-[12.5px] font-bold flex items-center justify-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                    >
                      <span>❄️ Làm nguội (25°C)</span>
                    </button>
                  </div>
                ) : isOptics ? (
                  <div className="flex xl:hidden items-center gap-2">
                    <button
                      type="button"
                      onClick={onAssembleOpticalBench}
                      className="flex-1 py-1.5 px-2.5 rounded-[7px] text-[12.5px] font-bold flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer"
                    >
                      <span>⚡ Lắp bộ Thấu kính</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeGuidedStep?.(3)}
                      className="flex-1 py-1.5 px-2.5 rounded-[7px] text-[12.5px] font-bold flex items-center justify-center gap-1.5 bg-[#1D63E8] hover:bg-[#1552C7] text-white cursor-pointer"
                    >
                      <span>🎯 Lấy nét (d&apos; = 20 cm)</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex xl:hidden items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onChangeGuidedStep?.(2)}
                      className="flex-1 py-1.5 px-2.5 rounded-[7px] text-[12.5px] font-bold flex items-center justify-center gap-1.5 bg-[#1D63E8] hover:bg-[#1552C7] text-white cursor-pointer"
                    >
                      <span>1. Đo P = 0.65 N</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onChangeGuidedStep?.(3)}
                      className="flex-1 py-1.5 px-2.5 rounded-[7px] text-[12.5px] font-bold flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                    >
                      <span>2. Nhúng ngập bình tràn</span>
                    </button>
                  </div>
                )}

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
                          <MathFormula math={r.mathSymbol || r.symbol} />
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
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[13px] font-extrabold">Thao tác nhanh:</span>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className={`px-2 py-0.5 rounded-[6px] text-[11.5px] font-bold flex items-center gap-1 border transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/50 text-emerald-300'
                        : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
                    }`}
                    title="Xuất bảng kết quả đo ra tệp CSV"
                  >
                    <Download className="w-3 h-3 shrink-0" />
                    <span>Xuất dữ liệu</span>
                  </button>
                </div>
                <div className="space-y-1.5">
                  {isDensity ? (
                    <>
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
                    </>
                  ) : isThermal ? (
                    <>
                      <button
                        type="button"
                        onClick={onQuickIgniteBurner}
                        className={`w-full py-2 px-2.5 rounded-[7px] text-[13px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          isFlameLit
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                        }`}
                      >
                        <span>{isFlameLit ? '🛑 Tắt đèn cồn' : '🔥 Châm lửa đèn cồn'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={onQuickCoolWater}
                        className="w-full py-1.5 px-2.5 rounded-[7px] text-[13px] font-bold flex items-center justify-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                      >
                        <span>❄️ Làm nguội (25°C)</span>
                      </button>
                    </>
                  ) : isOptics ? (
                    <>
                      <button
                        type="button"
                        onClick={onAssembleOpticalBench}
                        className="w-full py-2 px-2.5 rounded-[7px] text-[13px] font-extrabold flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer shadow-xs"
                      >
                        <span>⚡ Lắp bộ Thấu kính</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeGuidedStep?.(3)}
                        className="w-full py-1.5 px-2.5 rounded-[7px] text-[13px] font-bold flex items-center justify-center gap-1.5 bg-[#1D63E8] hover:bg-[#1552C7] text-white cursor-pointer"
                      >
                        <span>🎯 Lấy nét (d&apos; = 20 cm)</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => onChangeGuidedStep?.(2)}
                        className="w-full py-1.5 px-2.5 rounded-[7px] text-[13px] font-bold flex items-center justify-center gap-1.5 bg-[#1D63E8] hover:bg-[#1552C7] text-white cursor-pointer"
                      >
                        <span>1. Đo P = 0.65 N</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeGuidedStep?.(3)}
                        className="w-full py-1.5 px-2.5 rounded-[7px] text-[13px] font-bold flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                      >
                        <span>2. Nhúng vào bình tràn</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CÔNG THỨC */}
          {activeTab === 'formula' && (
            <div className="flex flex-col sm:flex-row items-center gap-4 h-full py-1">
              {isThermal ? (
                <>
                  <div
                    className={`px-5 py-3 rounded-[10px] border flex flex-col items-center justify-center shrink-0 ${
                      isDarkMode
                        ? 'bg-[#1A273D] border-[#00BCEB]/50'
                        : 'bg-[#FAF3DD] border-[#E8B84B]'
                    }`}
                  >
                    <div className="text-xl font-bold font-mono tracking-wide">
                      <MathFormula displayMode math="Q = m \cdot c \cdot \Delta T \quad | \quad P_{\text{toa}} = \frac{Q}{\Delta t}" />
                    </div>
                    <span
                      className={`text-[12px] mt-1 font-semibold ${
                        isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'
                      }`}
                    >
                      Định luật bảo toàn năng lượng & Truyền nhiệt
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 flex-1 w-full text-[13.5px]">
                    <div className={`p-2.5 rounded-[9px] border ${isDarkMode ? 'bg-[#162234] border-[#263854]' : 'bg-white border-[#C4D5E8]'}`}>
                      <div className="font-extrabold text-[14.5px] flex items-center gap-1.5">
                        <MathFormula math="m = 0{,}10\text{ kg}" className="text-[#3B82F6]" /> — Khối lượng nước
                      </div>
                      <p className={`text-[12.5px] mt-1 ${isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'}`}>
                        Khối lượng nước trong cốc thủy tinh chịu nhiệt (<MathFormula math="100\text{ mL} = 0{,}10\text{ kg}" />).
                      </p>
                    </div>

                    <div className={`p-2.5 rounded-[9px] border ${isDarkMode ? 'bg-[#162234] border-[#263854]' : 'bg-white border-[#C4D5E8]'}`}>
                      <div className="font-extrabold text-[14.5px] flex items-center gap-1.5">
                        <MathFormula math="c = 4184\text{ J/(kg}\cdot\text{K)}" className="text-[#00BCEB]" /> — Nhiệt dung riêng
                      </div>
                      <p className={`text-[12.5px] mt-1 ${isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'}`}>
                        Nhiệt lượng cần cung cấp để 1 kg nước tăng thêm 1 °C.
                      </p>
                    </div>

                    <div className={`p-2.5 rounded-[9px] border ${isDarkMode ? 'bg-[#162234] border-[#263854]' : 'bg-white border-[#C4D5E8]'}`}>
                      <div className="font-extrabold text-[14.5px] flex items-center gap-1.5">
                        <MathFormula math="\Delta T = T_2 - T_1" className="text-emerald-400" /> — Độ tăng nhiệt độ
                      </div>
                      <p className={`text-[12.5px] mt-1 ${isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'}`}>
                        Hiệu số nhiệt độ đọc trên nhiệt kế (<MathFormula math="T_{\text{soi}} = 100{,}0^\circ\text{C}" /> ở 1 atm).
                      </p>
                    </div>
                  </div>
                </>
              ) : isOptics ? (
                <>
                  <div
                    className={`px-5 py-3 rounded-[10px] border flex flex-col items-center justify-center shrink-0 ${
                      isDarkMode
                        ? 'bg-[#1A273D] border-[#00BCEB]/50'
                        : 'bg-[#FAF3DD] border-[#E8B84B]'
                    }`}
                  >
                    <div className="text-xl font-bold font-mono tracking-wide">
                      <MathFormula displayMode math="f = \frac{d \cdot d'}{d + d'} \quad \text{hoac} \quad f = \frac{d + d'}{4}" />
                    </div>
                    <span
                      className={`text-[12px] mt-1 font-semibold ${
                        isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'
                      }`}
                    >
                      Khi ảnh thật rõ nét cao bằng vật: <MathFormula math="d = d' = 2f" />
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 flex-1 w-full text-[13.5px]">
                    <div className={`p-2.5 rounded-[9px] border ${isDarkMode ? 'bg-[#162234] border-[#263854]' : 'bg-white border-[#C4D5E8]'}`}>
                      <div className="font-extrabold text-[14.5px] flex items-center gap-1.5">
                        <MathFormula math="d" className="text-[#3B82F6]" /> — Khoảng cách vật (cm)
                      </div>
                      <p className={`text-[12.5px] mt-1 ${isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'}`}>
                        Khoảng cách từ vật sáng chữ F đến quang tâm O của thấu kính.
                      </p>
                    </div>

                    <div className={`p-2.5 rounded-[9px] border ${isDarkMode ? 'bg-[#162234] border-[#263854]' : 'bg-white border-[#C4D5E8]'}`}>
                      <div className="font-extrabold text-[14.5px] flex items-center gap-1.5">
                        <MathFormula math="d'" className="text-[#00BCEB]" /> — Khoảng cách ảnh (cm)
                      </div>
                      <p className={`text-[12.5px] mt-1 ${isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'}`}>
                        Khoảng cách từ màn chắn hứng ảnh nét đến thấu kính.
                      </p>
                    </div>

                    <div className={`p-2.5 rounded-[9px] border ${isDarkMode ? 'bg-[#162234] border-[#263854]' : 'bg-white border-[#C4D5E8]'}`}>
                      <div className="font-extrabold text-[14.5px] flex items-center gap-1.5">
                        <MathFormula math="f" className="text-emerald-400" /> — Tiêu cự (cm)
                      </div>
                      <p className={`text-[12.5px] mt-1 ${isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'}`}>
                        Thấu kính hội tụ có <MathFormula math="f > 0" /> (+10 cm trong bộ thí nghiệm KHTN 9).
                      </p>
                    </div>
                  </div>
                </>
              ) : isDisplacement ? (
                <>
                  <div
                    className={`px-5 py-3 rounded-[10px] border flex flex-col items-center justify-center shrink-0 ${
                      isDarkMode
                        ? 'bg-[#1A273D] border-[#00BCEB]/50'
                        : 'bg-[#FAF3DD] border-[#E8B84B]'
                    }`}
                  >
                    <div className="text-xl font-bold font-mono tracking-wide">
                      <MathFormula displayMode math="F_A = P - F = d_{\text{long}} \cdot V" />
                    </div>
                    <span
                      className={`text-[12px] mt-1 font-semibold ${
                        isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'
                      }`}
                    >
                      Lực đẩy Archimedes bằng trọng lượng phần nước bị chiếm chỗ
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 flex-1 w-full text-[13.5px]">
                    <div className={`p-2.5 rounded-[9px] border ${isDarkMode ? 'bg-[#162234] border-[#263854]' : 'bg-white border-[#C4D5E8]'}`}>
                      <div className="font-extrabold text-[14.5px] flex items-center gap-1.5">
                        <MathFormula math="P" className="text-[#3B82F6]" /> — Trọng lượng không khí (N)
                      </div>
                      <p className={`text-[12.5px] mt-1 ${isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'}`}>
                        Đo bằng lực kế khi treo vật tự do ngoài không khí.
                      </p>
                    </div>

                    <div className={`p-2.5 rounded-[9px] border ${isDarkMode ? 'bg-[#162234] border-[#263854]' : 'bg-white border-[#C4D5E8]'}`}>
                      <div className="font-extrabold text-[14.5px] flex items-center gap-1.5">
                        <MathFormula math="F" className="text-[#00BCEB]" /> — Lực kế khi nhúng nước (N)
                      </div>
                      <p className={`text-[12.5px] mt-1 ${isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'}`}>
                        Số chỉ giảm vì nước tác dụng lực đẩy thẳng đứng hướng lên.
                      </p>
                    </div>

                    <div className={`p-2.5 rounded-[9px] border ${isDarkMode ? 'bg-[#162234] border-[#263854]' : 'bg-white border-[#C4D5E8]'}`}>
                      <div className="font-extrabold text-[14.5px] flex items-center gap-1.5">
                        <MathFormula math="F_A" className="text-emerald-400" /> — Lực đẩy Archimedes (N)
                      </div>
                      <p className={`text-[12.5px] mt-1 ${isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'}`}>
                        Độ chênh lệch <MathFormula math="F_A = P - F" /> chính bằng <MathFormula math="d \cdot V" />.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`px-6 py-3.5 rounded-[10px] border flex flex-col items-center justify-center shrink-0 ${
                      isDarkMode
                        ? 'bg-[#1A273D] border-[#00BCEB]/50'
                        : 'bg-[#FAF3DD] border-[#E8B84B]'
                    }`}
                  >
                    <div className="text-2xl font-extrabold font-mono tracking-wide">
                      <MathFormula displayMode math="\rho = \frac{m}{V}" />
                    </div>
                    <span
                      className={`text-[12.5px] mt-1 font-semibold ${
                        isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'
                      }`}
                    >
                      <MathFormula math="V = V_2 - V_1" /> (bình chia độ / bình tràn)
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
                      <div className="font-extrabold text-[15.5px] flex items-center gap-1.5">
                        <MathFormula math="m" className="text-[#3B82F6]" /> — Khối lượng ({massUnit})
                      </div>
                      <p
                        className={`text-[13px] mt-1 ${
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
                      <div className="font-extrabold text-[15.5px] flex items-center gap-1.5">
                        <MathFormula math="V" className="text-[#00BCEB]" /> — Thể tích ({volUnit})
                      </div>
                      <p
                        className={`text-[13px] mt-1 ${
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
                      <div className="font-extrabold text-[15.5px] flex items-center gap-1.5">
                        <MathFormula math="\rho" className="text-emerald-400" /> — KLR ({densityUnit})
                      </div>
                      <p
                        className={`text-[13px] mt-1 ${
                          isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'
                        }`}
                      >
                        Khối lượng 1 đơn vị thể tích (<MathFormula math="1\text{ g/cm}^3 = 1000\text{ kg/m}^3" />).
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: CÁCH ĐỌC & ĐCNN */}
          {activeTab === 'reading-guide' && (
            <div className="flex items-center gap-4 h-full py-1">
              {isThermal ? (
                <div className="space-y-2 text-[14.5px] flex-1">
                  <div className="font-extrabold text-[16px] text-amber-300">
                    Quy tắc sử dụng & đọc số chỉ Nhiệt kế thủy tinh KHTN 8
                  </div>
                  <p className={isDarkMode ? 'text-slate-200 leading-relaxed' : 'text-[#4B6280] leading-relaxed'}>
                    • <strong>Độ sâu nhúng nhiệt kế:</strong> Bầu cảm nhiệt phải chìm hoàn toàn trong lòng khối nước, <em>tuyệt đối không chạm đáy hoặc thành cốc</em> để tránh đo sai nhiệt độ của ngọn lửa đèn cồn.
                  </p>
                  <p className={isDarkMode ? 'text-slate-200 leading-relaxed' : 'text-[#4B6280] leading-relaxed'}>
                    • <strong>Quy tắc đọc vạch:</strong> Đặt mắt ngang bằng đỉnh cột chất lỏng chỉ nhiệt, đọc theo vạch gần nhất (ĐCNN: 1,0 °C, Sai số dụng cụ: ±0,5 °C).
                  </p>
                </div>
              ) : isOptics ? (
                <div className="space-y-2 text-[14.5px] flex-1">
                  <div className="font-extrabold text-[16px] text-cyan-300">
                    Quy tắc ngắm chừng & đo khoảng cách trên Giá quang học
                  </div>
                  <p className={isDarkMode ? 'text-slate-200 leading-relaxed' : 'text-[#4B6280] leading-relaxed'}>
                    • <strong>Đọc tọa độ vạch:</strong> Đọc kim chỉ vạch của đế trượt chữ U trên thước ray 90 cm (ĐCNN: 1 mm). Khoảng cách <MathFormula math="d = |x_{\text{kinh}} - x_{\text{vat}}|" />.
                  </p>
                  <p className={isDarkMode ? 'text-slate-200 leading-relaxed' : 'text-[#4B6280] leading-relaxed'}>
                    • <strong>Tiêu chuẩn ảnh thật rõ nét:</strong> Khi dịch chuyển màn chắn, dừng lại đúng vị trí viền chữ F tương phản sắc nét nhất, không có quầng sáng nhòe.
                  </p>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}

          {/* TAB 4: HƯỚNG DẪN BƯỚC THỰC HÀNH */}
          {activeTab === 'steps' && (
            <div className="flex flex-col gap-2 py-0.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {currentPracticeSteps.map((item) => {
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
                          {item.step}. <RichMathText text={item.title} />
                        </div>
                        <div
                          className={`text-[12px] leading-snug mt-0.5 ${
                            isDarkMode ? 'text-slate-300' : 'text-[#4B6280]'
                          }`}
                        >
                          <RichMathText text={item.shortDesc} />
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
                        (guidedStep < currentPracticeSteps.length
                          ? guidedStep + 1
                          : 1) as StudentGuidedStepNumber,
                      )
                    }
                    className="px-3.5 py-1.5 rounded-[8px] bg-[#1D63E8] hover:bg-[#1552C7] text-white text-[13px] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    title={guidedStep < currentPracticeSteps.length ? `Tiến tới Bước ${guidedStep + 1} (⟳)` : 'Làm lại từ Bước 1 (⟳)'}
                  >
                    <span>
                      {guidedStep < currentPracticeSteps.length
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

