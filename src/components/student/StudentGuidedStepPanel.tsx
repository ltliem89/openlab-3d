import React from 'react';
import {
  AssetDefinition,
  ExperimentDefinition,
  SceneInstance,
} from '../../domain/types';
import {
  BookOpen,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export type StudentGuidedStepNumber = 1 | 2 | 3 | 4 | 5;

interface StudentGuidedStepPanelProps {
  experiments: ExperimentDefinition[];
  activeExperiment: ExperimentDefinition;
  guidedStep: StudentGuidedStepNumber;
  selectedAsset: AssetDefinition | null;
  selectedInstance: SceneInstance | null;
  sceneInstances: SceneInstance[];
  assetsMap: Map<string, AssetDefinition>;
  isExploreOnlyMode?: boolean;
  isDarkMode?: boolean;
  isCollapsed?: boolean;
  onShowGuide?: () => void;
  onHideGuide?: () => void;
  onSelectExperiment: (experimentId: string) => void;
  onChangeGuidedStep: (step: StudentGuidedStepNumber) => void;
  onSelectAssetById: (assetId: string) => void;
  onAddAssetToTable: (assetId: string) => void;
  onPlaceAllRequiredForExperiment: () => void;
  onUpdateInstanceState: (
    instanceId: string,
    patch: Partial<SceneInstance['instanceState']>,
  ) => void;
  onDeleteInstance: (instanceId: string) => void;
  onResetLabTable: () => void;
  onOpenAssetDetailModal: (asset: AssetDefinition) => void;
  onSwitchFromExploreToLab: () => void;
  onOpenVideoGuide?: () => void;
}

const FIVE_PRACTICE_STEPS: Array<{
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
    shortDesc: 'Kiểm tra bảng số liệu bên dưới.',
  },
];

export const StudentGuidedStepPanel: React.FC<
  StudentGuidedStepPanelProps & {
    onAssembleOpticalBench?: () => void;
  }
> = ({
  experiments,
  activeExperiment,
  guidedStep,
  isDarkMode = false,
  isCollapsed = false,
  onShowGuide,
  onHideGuide,
  onSelectExperiment,
  onChangeGuidedStep,
  onPlaceAllRequiredForExperiment,
  onAssembleOpticalBench,
}) => {
  if (isCollapsed) {
    return (
      <aside
        className="absolute right-1.5 top-11 z-20 flex items-center select-none"
        aria-label="Mở tab Hướng dẫn"
      >
        <button
          type="button"
          onClick={onShowGuide}
          className={`h-8 px-2 rounded-l-[9px] rounded-r-[6px] border-[1.5px] flex items-center gap-1 shadow-md transition-all cursor-pointer backdrop-blur-md ${
            isDarkMode
              ? 'bg-[#081528]/80 hover:bg-[#1D63E8] border-[#38BDF8]/80 text-white'
              : 'bg-white/90 hover:bg-[#1D63E8] hover:text-white border-[#1D63E8]/75 text-[#051630]'
          }`}
          title="Hiện tab Hướng dẫn thực hành"
          aria-label="Hiện tab Hướng dẫn thực hành"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.8] shrink-0" />
          <BookOpen className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
        </button>
      </aside>
    );
  }

  const isOpticsLensExp =
    activeExperiment.experimentId === 'OL3D-EXP-OPTICS-LENS-0001';
  const isDensityExp =
    activeExperiment.experimentId === 'OL3D-EXP-DENSITY-0001';

  const displaySteps: Array<{
    step: StudentGuidedStepNumber;
    title: string;
    shortDesc: string;
  }> = isDensityExp
    ? FIVE_PRACTICE_STEPS
    : activeExperiment.steps.slice(0, 5).map((s, idx) => ({
        step: ((idx + 1) as StudentGuidedStepNumber) || 1,
        title: s.title.replace(/^Bước\s*\d+\s*:\s*/i, ''),
        shortDesc: s.instructionDetail || s.description,
      }));

  return (
    <aside
      className={`fixed inset-x-2 bottom-2 top-[56px] z-40 lg:static lg:inset-auto lg:w-[305px] lg:z-20 border-[1.5px] rounded-[12px] p-3.5 sm:p-4 flex flex-col justify-between lg:h-full shrink-0 select-none transition-colors safe-bottom backdrop-blur-2xl ${
        isDarkMode
          ? 'bg-[#081528]/75 lg:bg-[#131E30] border-[#38BDF8] lg:border-[#3B5984] text-white shadow-[0_16px_42px_rgba(0,0,0,0.68)] lg:shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
          : 'bg-white/75 lg:bg-[#F2F6FB] border-[#1D63E8] lg:border-[#88ADD8] text-[#051630] shadow-[0_16px_42px_rgba(5,22,48,0.32)] lg:shadow-[0_2px_10px_rgba(18,52,107,0.08)]'
      }`}
    >
      <div className="flex flex-col min-h-0 flex-1">
        {/* Header: Biểu tượng quyển sách xanh lá + Tiêu đề “Hướng dẫn” + Mũi tên nhỏ thu gọn */}
        <div
          className={`flex items-center justify-between gap-2 pb-2.5 border-b shrink-0 ${
            isDarkMode ? 'border-[#3B5984]' : 'border-[#88ADD8]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-[8px] bg-[#16A34A]/20 border border-[#16A34A]/60 flex items-center justify-center text-[#15803D] shrink-0">
              <BookOpen className="w-5 h-5 stroke-[2.4]" />
            </div>
            <h2
              className={`text-[19px] font-extrabold leading-tight truncate ${
                isDarkMode ? 'text-white' : 'text-[#051630]'
              }`}
            >
              Hướng dẫn
            </h2>
          </div>

          {onHideGuide && (
            <button
              type="button"
              onClick={onHideGuide}
              className="h-7 px-2 rounded-[6px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[12px] font-extrabold flex items-center gap-0.5 transition-colors shrink-0 cursor-pointer shadow-xs"
              title="Ẩn tab Hướng dẫn"
              aria-label="Ẩn tab Hướng dẫn"
            >
              <span>Ẩn</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.6] text-white shrink-0" />
            </button>
          )}
        </div>

        {/* Chọn Bài thực hành (Khi chọn bài, các thiết bị gợi ý sẽ tự động xếp lên Kệ trưng bày 2 tầng) */}
        <div className="py-2.5 shrink-0 space-y-1.5">
          <label
            htmlFor="student-experiment-select"
            className={`block text-[12.5px] font-extrabold uppercase tracking-wider ${
              isDarkMode ? 'text-sky-300' : 'text-[#1E3A5F]'
            }`}
          >
            Chọn bài thí nghiệm (SGK KHTN 9):
          </label>
          <select
            id="student-experiment-select"
            value={activeExperiment.experimentId}
            onChange={(e) => onSelectExperiment(e.target.value)}
            className={`w-full rounded-[8px] border-[1.5px] px-2.5 py-1.5 text-[13.5px] font-extrabold cursor-pointer focus:outline-none ${
              isDarkMode
                ? 'bg-[#0C192C] border-[#38BDF8] text-white'
                : 'bg-white border-[#1D63E8] text-[#051630]'
            }`}
          >
            {experiments.map((exp) => (
              <option key={exp.experimentId} value={exp.experimentId}>
                {exp.title}
              </option>
            ))}
          </select>

          {isOpticsLensExp ? (
            <button
              type="button"
              onClick={onAssembleOpticalBench}
              className="w-full py-2 px-3 rounded-[8px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[13px] flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <span>⚡ Lắp ráp Bộ Thấu kính (Hình 8.12)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onPlaceAllRequiredForExperiment}
              className={`w-full py-1.5 px-2.5 rounded-[8px] border text-[12.5px] font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-[#162338] hover:bg-[#1E2E48] border-[#38BDF8]/60 text-sky-200'
                  : 'bg-[#E2ECF8] hover:bg-[#CFE2FA] border-[#1D63E8]/60 text-[#051630]'
              }`}
            >
              <span>Đặt đủ dụng cụ bài này xuống bàn</span>
            </button>
          )}
        </div>

        {/* Các bước thực hành trình bày dạng danh sách đứng */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-0.5 min-h-0">
          {displaySteps.map((item) => {
            const isCurrent = guidedStep === item.step;
            const isCompleted = guidedStep > item.step;

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => onChangeGuidedStep(item.step)}
                className={`w-full p-2.5 rounded-[10px] text-left transition-all flex items-start gap-2.5 border-[1.5px] cursor-pointer ${
                  isCurrent
                    ? isDarkMode
                      ? 'bg-[#1D63E8]/35 border-[#38BDF8] shadow-xs'
                      : 'bg-[#CFE2FA] border-[#1D63E8] shadow-xs'
                    : isCompleted
                      ? isDarkMode
                        ? 'bg-[#1A273D] border-[#3B5984] hover:bg-[#22324D]'
                        : 'bg-[#E2ECF8] border-[#88ADD8] hover:bg-[#CFE2FA]/80'
                      : isDarkMode
                        ? 'bg-[#162234] border-[#2D4568] hover:bg-[#1A273D]'
                        : 'bg-white border-[#9BBBE0] hover:bg-[#E2ECF8]'
                }`}
              >
                {/* Số thứ tự bước */}
                <span
                  className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[14px] font-extrabold shrink-0 mt-0.5 ${
                    isCurrent
                      ? 'bg-[#1D63E8] text-white'
                      : isCompleted
                        ? 'bg-[#16A34A] text-white'
                        : isDarkMode
                          ? 'bg-[#243552] text-white'
                          : 'bg-[#CFE2FA] text-[#051630]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    item.step
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[15px] font-extrabold leading-snug ${
                      isDarkMode ? 'text-white' : 'text-[#051630]'
                    }`}
                  >
                    {item.step}. {item.title}
                  </div>
                  <p
                    className={`text-[13.5px] font-bold leading-snug mt-0.5 ${
                      isDarkMode ? 'text-slate-200' : 'text-[#152E4D]'
                    }`}
                  >
                    {item.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nút ở đáy panel: “Tiếp theo” */}
      <div
        className={`pt-3 mt-2 border-t shrink-0 ${
          isDarkMode ? 'border-[#3B5984]' : 'border-[#88ADD8]'
        }`}
      >
        <button
          type="button"
          onClick={() =>
            onChangeGuidedStep(
              (guidedStep < displaySteps.length
                ? guidedStep + 1
                : 1) as StudentGuidedStepNumber,
            )
          }
          className="w-full py-2.5 px-4 rounded-[9px] bg-[#1D63E8] hover:bg-[#1552C7] active:scale-[0.99] text-white font-extrabold text-[16px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <span>
            {guidedStep < displaySteps.length ? 'Tiếp theo' : 'Làm lại'}
          </span>
          <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
        </button>
      </div>
    </aside>
  );
};
