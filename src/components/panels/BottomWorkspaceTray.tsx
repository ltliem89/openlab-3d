import React, { useState, useMemo, useEffect } from 'react';
import {
  AssetDefinition,
  ExperimentDefinition,
  ExperimentMeasurementRow,
  LabEnvironment,
  SceneInstance,
} from '../../domain/types';
import { MathFormula, RichMathText } from '../common/MathFormula';
import {
  ChevronDown,
  ChevronUp,
  ListChecks,
  Table2,
  Globe,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  PlusCircle,
  Scale,
  ArrowLeftRight,
} from 'lucide-react';

export type BottomTrayTabId = 'procedure' | 'results' | 'environments';
export type ScientificUnitMode = 'standard' | 'converted';

interface BottomWorkspaceTrayProps {
  experiments: ExperimentDefinition[];
  activeExperiment: ExperimentDefinition;
  currentStepIndex: number;
  environments: LabEnvironment[];
  activeEnvironmentId: string;
  sceneInstances: SceneInstance[];
  assetsMap: Map<string, AssetDefinition>;
  onSelectExperiment: (experimentId: string) => void;
  onStepChange: (stepIndex: number) => void;
  onSelectEnvironment: (environmentId: string) => void;
  onAddAssetToScene: (assetId: string) => void;
}

export const BottomWorkspaceTray: React.FC<BottomWorkspaceTrayProps> = ({
  experiments,
  activeExperiment,
  currentStepIndex,
  environments,
  activeEnvironmentId,
  sceneInstances,
  assetsMap,
  onSelectExperiment,
  onStepChange,
  onSelectEnvironment,
  onAddAssetToScene,
}) => {
  const [activeTab, setActiveTab] = useState<BottomTrayTabId>('procedure');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [unitMode, setUnitMode] = useState<ScientificUnitMode>('standard');

  useEffect(() => {
    // Notify viewport to run continuous resize synchronization loop during collapse/expand transition
    window.dispatchEvent(new Event('resize'));
  }, [isCollapsed]);

  const isConverted = unitMode === 'converted';

  const handleToggleUnitMode = () => {
    setUnitMode((prev) => (prev === 'standard' ? 'converted' : 'standard'));
  };

  const steps = activeExperiment.steps;
  const activeStep = steps[currentStepIndex] ?? steps[0];

  const presentAssetIds = new Set(
    sceneInstances.filter((i) => i.visible).map((i) => i.assetId),
  );

  // Compute live scenario measurements from active workbench instances
  const liveScenarioSummary = useMemo(() => {
    const activeBenchItems = sceneInstances.filter(
      (i) => i.visible && i.instanceState.attachmentSlot !== 'shelf',
    );
    let balanceMassG: number | null = null;
    let totalLiquidMl = 0;
    let liquidVesselCount = 0;

    for (const inst of activeBenchItems) {
      const asset = assetsMap.get(inst.assetId);
      const arch = asset?.geometry.proceduralArchetype;
      if (arch === 'electronic-balance') {
        const netG =
          (inst.instanceState.measuredMassG ?? 0) -
          (inst.instanceState.tareOffsetG ?? 0);
        balanceMassG = Number(Math.max(0, netG).toFixed(2));
      }
      if (
        arch === 'graduated-cylinder' ||
        arch === 'beaker-250' ||
        arch === 'overflow-can' ||
        arch === 'water-dispenser' ||
        arch === 'erlenmeyer-flask'
      ) {
        const ml =
          inst.instanceState.liquidLevelMl ??
          inst.instanceState.baseLiquidLevelMl ??
          0;
        totalLiquidMl += ml;
        liquidVesselCount += 1;
      }
    }

    const formattedMass =
      balanceMassG !== null
        ? isConverted
          ? `${(balanceMassG * 1000).toFixed(0)} mg`
          : `${balanceMassG.toFixed(2)} g`
        : isConverted
          ? '66250 mg (mẫu)'
          : '66.25 g (mẫu)';

    const sampleVolMl = liquidVesselCount > 0 ? totalLiquidMl : 50.0;
    const formattedVolume = isConverted
      ? `${(sampleVolMl / 1000).toFixed(4)} L`
      : `${sampleVolMl.toFixed(1)} mL`;

    const isOpticsExp = activeExperiment.experimentId === 'OL3D-EXP-OPTICS-LENS-0001';
    const isDisplacementExp = activeExperiment.experimentId === 'OL3D-EXP-DISPLACEMENT-0001';
    const isThermalExp = activeExperiment.experimentId === 'OL3D-EXP-THERMAL-BOIL-0001';

    let metricLabel = `Khối lượng: ${formattedMass} · Thể tích: ${formattedVolume}`;
    if (isOpticsExp) {
      metricLabel = isConverted
        ? "$d = 200\\text{ mm} \\cdot d' = 200\\text{ mm} \\cdot f = +100\\text{ mm}$"
        : "$d = 20.0\\text{ cm} \\cdot d' = 20.0\\text{ cm} \\cdot f = +10.0\\text{ cm}$";
    } else if (isDisplacementExp) {
      metricLabel = isConverted
        ? '$P = 650\\text{ mN} \\cdot F = 410\\text{ mN} \\cdot F_A = 240\\text{ mN}$'
        : '$P = 0.65\\text{ N} \\cdot F = 0.41\\text{ N} \\cdot F_A = 0.24\\text{ N}$';
    } else if (isThermalExp) {
      metricLabel = isConverted
        ? '$T = 100.0^\\circ\\text{C} = 373.15\\text{ K} \\cdot Q = 31.38\\text{ kJ}$'
        : '$T_1 = 25.0^\\circ\\text{C} \\cdot T_{\\text{soi}} = 100.0^\\circ\\text{C} \\cdot Q = 31380\\text{ J}$';
    }

    return {
      formattedMass,
      formattedVolume,
      metricLabel,
    };
  }, [sceneInstances, assetsMap, isConverted, activeExperiment.experimentId]);

  // Convert sample measurement rows based on current unitMode ('standard' vs 'converted')
  const displayedResults = useMemo<ExperimentMeasurementRow[]>(() => {
    if (!isConverted) return activeExperiment.sampleResults;

    return activeExperiment.sampleResults.map((row) => {
      const numVal =
        typeof row.value === 'number' ? row.value : Number(row.value);
      const hasNumeric = !Number.isNaN(numVal);
      const u = row.unit.trim().toLowerCase();

      // 1. Mass: g -> mg
      if (u === 'g') {
        return {
          ...row,
          value: hasNumeric ? Number((numVal * 1000).toFixed(1)) : row.value,
          unit: 'mg',
          formulaNote: row.formulaNote
            ? `${row.formulaNote} (1 g = 1000 mg)`
            : 'Đã quy đổi sang miligam (mg)',
        };
      }

      // 2. Volume: cm³ (ml), cm³, ml -> L
      if (u.includes('ml') || u === 'cm³') {
        return {
          ...row,
          value: hasNumeric ? Number((numVal / 1000).toFixed(5)) : row.value,
          unit: 'L (dm³)',
          formulaNote: row.formulaNote
            ? `${row.formulaNote} (1 L = 1000 mL)`
            : 'Đã quy đổi sang lít (L)',
        };
      }

      // 3. Density: g/cm³ -> kg/m³ (hoặc g/L)
      if (u === 'g/cm³') {
        return {
          ...row,
          value: hasNumeric ? Number((numVal * 1000).toFixed(1)) : row.value,
          unit: 'g/L (kg/m³)',
          formulaNote: row.formulaNote
            ? `${row.formulaNote} (1 g/cm³ = 1000 g/L)`
            : 'Đã quy đổi sang g/L (kg/m³)',
        };
      }

      // 4. Force: N -> mN
      if (u === 'n') {
        return {
          ...row,
          value: hasNumeric ? Number((numVal * 1000).toFixed(0)) : row.value,
          unit: 'mN',
          formulaNote: row.formulaNote
            ? `${row.formulaNote} (1 N = 1000 mN)`
            : 'Đã quy đổi sang mili-Newton (mN)',
        };
      }

      // 5. Length: mm -> m
      if (u.startsWith('mm')) {
        return {
          ...row,
          value: hasNumeric ? Number((numVal / 1000).toFixed(4)) : row.value,
          unit: 'm',
          formulaNote: row.formulaNote
            ? `${row.formulaNote} (1 m = 1000 mm)`
            : 'Đã quy đổi sang mét (m)',
        };
      }

      return row;
    });
  }, [activeExperiment.sampleResults, isConverted]);

  return (
    <section
      className={`bg-[#0E1420] border-t border-slate-800/90 flex flex-col shrink-0 select-none z-20 transition-all ${
        isCollapsed ? 'h-9' : 'h-56'
      }`}
    >
      {/* Tray Header & Tab Switcher */}
      <div className="h-9 px-3 border-b border-slate-800/80 flex items-center justify-between gap-4 shrink-0 bg-[#0B0F17]/70">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('procedure');
              if (isCollapsed) setIsCollapsed(false);
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'procedure' && !isCollapsed
                ? 'bg-slate-800 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>A. Quy trình thí nghiệm ({steps.length} bước)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('results');
              if (isCollapsed) setIsCollapsed(false);
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'results' && !isCollapsed
                ? 'bg-slate-800 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            <span>B. Bảng kết quả minh họa</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('environments');
              if (isCollapsed) setIsCollapsed(false);
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'environments' && !isCollapsed
                ? 'bg-slate-800 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>C. Môi trường phòng thí nghiệm ({environments.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Scientific Measurement Unit Toggle Button (g/mL <-> mg/L) */}
          <button
            type="button"
            onClick={handleToggleUnitMode}
            aria-pressed={isConverted}
            title="Chuyển đổi đơn vị đo khoa học cho kịch bản hiện tại (g ↔ mg, mL ↔ L, N ↔ mN, mm ↔ m)"
            className={`h-6.5 px-2.5 rounded-[6px] border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              isConverted
                ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-400/70 text-cyan-200 shadow-xs'
                : 'bg-[#090D16] hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              Đơn vị: {isConverted ? 'mg · L · mN · m' : 'g · mL · N · mm'}
            </span>
            <ArrowLeftRight className="w-3 h-3 text-cyan-300 opacity-80 shrink-0" />
          </button>

          {/* Experiment Selector */}
          <select
            value={activeExperiment.experimentId}
            onChange={(e) => onSelectExperiment(e.target.value)}
            className="hidden md:block bg-[#090D16] border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500/60"
          >
            {experiments.map((exp) => (
              <option key={exp.experimentId} value={exp.experimentId}>
                Bài thực hành: {exp.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsCollapsed((v) => !v)}
            className="h-6.5 px-2 rounded-[6px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[11.5px] font-extrabold flex items-center gap-0.5 whitespace-nowrap cursor-pointer shadow-xs"
          >
            <span>{isCollapsed ? 'Mở' : 'Ẩn'}</span>
            {isCollapsed ? (
              <ChevronUp className="w-3.5 h-3.5 text-white" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Tray Body */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-3">
          {/* TAB A: EXPERIMENT PROCEDURE */}
          {activeTab === 'procedure' && activeStep && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full">
              {/* Step List Column */}
              <div className="lg:col-span-4 flex flex-col justify-between bg-[#0B0F17] border border-slate-800 rounded p-2.5">
                <div className="space-y-1 overflow-y-auto">
                  {steps.map((st, idx) => {
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => onStepChange(idx)}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between gap-2 transition-colors ${
                          isCurrent
                            ? 'bg-cyan-500/20 text-cyan-200 font-semibold border border-cyan-500/40'
                            : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                        }`}
                      >
                        <span className="truncate">
                          Bước {st.stepNumber}. <RichMathText text={st.title} />
                        </span>
                        <span className="text-[10px] font-mono shrink-0">
                          {idx < currentStepIndex ? 'Hoàn tất' : isCurrent ? 'Đang mở' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={currentStepIndex === 0}
                    onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
                    className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Bước trước</span>
                  </button>
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                    Bước {currentStepIndex + 1} / {steps.length}
                  </span>
                  <button
                    type="button"
                    disabled={currentStepIndex >= steps.length - 1}
                    onClick={() =>
                      onStepChange(Math.min(steps.length - 1, currentStepIndex + 1))
                    }
                    className="px-2.5 py-1 text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 disabled:opacity-40 text-cyan-200 rounded flex items-center gap-1"
                  >
                    <span>Bước tiếp</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Active Step Detail & Required Assets Check */}
              <div className="lg:col-span-8 bg-[#0B0F17] border border-slate-800 rounded p-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-100">
                      Bước {activeStep.stepNumber}: <RichMathText text={activeStep.title} />
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded tabular-nums">
                        <RichMathText text={liveScenarioSummary.metricLabel} />
                      </span>
                      <span className="text-[11px] font-mono text-amber-400">
                        Mức mô phỏng: {activeExperiment.simulationFidelity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300"><RichMathText text={activeStep.description} /></p>
                  <p className="text-xs text-cyan-200/90 bg-cyan-950/30 border border-cyan-500/30 rounded p-2">
                    <span className="font-bold text-cyan-300">Hướng dẫn thao tác: </span>
                    <RichMathText text={activeStep.instructionDetail} />
                  </p>
                </div>

                {/* Required Assets in Scene Verification */}
                <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center flex-wrap gap-2 text-[11px]">
                    <span className="text-slate-400 font-medium">
                      Thiết bị cần cho bước này:
                    </span>
                    {activeStep.requiredAssetIds.map((reqId) => {
                      const asset = assetsMap.get(reqId);
                      const isPresent = presentAssetIds.has(reqId);
                      return (
                        <span
                          key={reqId}
                          className="inline-flex items-center gap-1 font-mono"
                        >
                          {isPresent ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {asset?.name.vi || reqId}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onAddAssetToScene(reqId)}
                              className="text-amber-300 hover:text-amber-200 underline flex items-center gap-1"
                            >
                              <PlusCircle className="w-3 h-3" />
                              Thêm {asset?.name.vi || reqId}
                            </button>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB B: ILLUSTRATIVE RESULTS TABLE */}
          {activeTab === 'results' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {activeExperiment.formulas.map((f) => {
                    const cleanMath = f.expression
                      .replace(/ρ/g, '\\rho')
                      .replace(/V₂/g, 'V_2')
                      .replace(/V₁/g, 'V_1')
                      .replace(/×/g, '\\times ');
                    return (
                      <span
                        key={f.expression}
                        className="text-cyan-300 bg-[#0B0F17] border border-slate-800 px-2 py-0.5 rounded flex items-center"
                        title={f.description}
                      >
                        <MathFormula math={cleanMath} />
                      </span>
                    );
                  })}
                  <button
                    type="button"
                    onClick={handleToggleUnitMode}
                    className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded border border-cyan-500/50 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ArrowLeftRight className="w-3 h-3 text-cyan-300" />
                    <span>
                      Đổi đơn vị: {isConverted ? 'mg / L (Đang bật)' : 'g / mL → mg / L'}
                    </span>
                  </button>
                </div>
                <span className="text-[11px] font-mono text-amber-400">
                  NHÃN BẮT BUỘC: DỮ LIỆU MINH HỌA (CHƯA HIỆU CHUẨN VẬT LÝ THỰC)
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded bg-[#0B0F17]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] text-slate-400 bg-[#090D16]">
                      <th className="py-1.5 px-3 font-medium">Đại lượng đo</th>
                      <th className="py-1.5 px-3 font-medium">Ký hiệu</th>
                      <th className="py-1.5 px-3 font-medium text-right">Giá trị</th>
                      <th className="py-1.5 px-3 font-medium">Đơn vị</th>
                      <th className="py-1.5 px-3 font-medium">Ghi chú / Công thức</th>
                      <th className="py-1.5 px-3 font-medium">Trạng thái xác thực</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 font-mono tabular-nums">
                    {displayedResults.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-800/40">
                        <td className="py-1.5 px-3 font-sans text-slate-200">
                          {row.quantityName}
                        </td>
                        <td className="py-1.5 px-3 text-cyan-300 font-semibold">
                          <MathFormula math={row.symbol} />
                        </td>
                        <td className="py-1.5 px-3 text-right text-slate-100 font-semibold">
                          {row.value}
                        </td>
                        <td className="py-1.5 px-3 text-cyan-300 font-semibold">
                          {row.unit}
                        </td>
                        <td className="py-1.5 px-3 font-sans text-slate-400">
                          <RichMathText text={row.formulaNote} />
                        </td>
                        <td className="py-1.5 px-3 text-amber-400 text-[11px]">
                          DỮ LIỆU MINH HỌA ({row.status})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB C: LABORATORY ENVIRONMENTS SELECTOR */}
          {activeTab === 'environments' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {environments.map((env) => {
                const isSelected = env.environmentId === activeEnvironmentId;
                return (
                  <button
                    key={env.environmentId}
                    type="button"
                    onClick={() => onSelectEnvironment(env.environmentId)}
                    className={`p-2.5 rounded border text-left transition-colors flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-400'
                        : 'bg-[#0B0F17] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span
                          className="w-4 h-4 rounded-sm border border-slate-600 shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${env.visualPreset.skyColorHex} 45%, ${env.visualPreset.benchTopColorHex} 55%)`,
                          }}
                        />
                        <span className="text-[10px] font-mono text-slate-400 truncate">
                          {env.environmentId}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-100 line-clamp-1">
                        {env.name.vi}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {env.description}
                      </p>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">v{env.environmentVersion}</span>
                      <span
                        className={
                          isSelected ? 'text-cyan-300 font-semibold' : 'text-slate-500'
                        }
                      >
                        {isSelected ? 'ĐANG DÙNG' : 'CHỌN'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
