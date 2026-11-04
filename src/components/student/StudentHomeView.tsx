import React from 'react';
import {
  AssetDefinition,
  EquipmentKit,
  ExperimentDefinition,
} from '../../domain/types';
import { EquipmentThumbnailSvg } from '../common/EquipmentThumbnailSvg';
import {
  Compass,
  FlaskConical,
  Package,
  HelpCircle,
  ArrowRight,
  Play,
  Sparkles,
} from 'lucide-react';

interface StudentHomeViewProps {
  experiments: ExperimentDefinition[];
  kits: EquipmentKit[];
  assetsMap: Map<string, AssetDefinition>;
  onStartExperiment: (experimentId: string) => void;
  onEnterLabDirectly: () => void;
  onOpenExploreEquipment: () => void;
  onOpenMyKits: () => void;
  onOpenHelp: () => void;
}

export const StudentHomeView: React.FC<StudentHomeViewProps> = ({
  experiments,
  kits,
  assetsMap,
  onStartExperiment,
  onEnterLabDirectly,
  onOpenExploreEquipment,
  onOpenMyKits,
  onOpenHelp,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#EAF4FF] text-[#12346B] px-5 py-7 md:px-10 md:py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 1. Lời chào ngắn gọn + Nút Trợ giúp lớn */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[14px] bg-white border border-[#D4E6FF] shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[12px] bg-[#F3F8FF] border border-[#D4E6FF] flex items-center justify-center shrink-0">
              <EquipmentThumbnailSvg archetype="beaker-250" className="w-14 h-14" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#12346B]">
                Phòng thí nghiệm Khoa học tự nhiên OpenLab 3D
              </h1>
              <p className="text-[15px] text-[#506789] font-medium mt-0.5">
                Chọn hoạt động bên dưới hoặc vào thẳng bàn thí nghiệm 3D để bắt đầu thực hành
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenHelp}
            className="self-start sm:self-center px-4 py-2.5 rounded-[10px] bg-[#EAF4FF] hover:bg-[#D4E6FF] border border-[#D4E6FF] text-[15px] font-bold text-[#12346B] flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 text-[#1E6BFF]" />
            <span>Hướng dẫn</span>
          </button>
        </div>

        {/* 2. Ba lựa chọn lớn */}
        <section aria-label="Ba hoạt động chính">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Choice 1: Khám phá thiết bị */}
            <button
              type="button"
              onClick={onOpenExploreEquipment}
              className="group text-left p-5 rounded-[14px] bg-white hover:bg-[#F3F8FF] border-2 border-[#D4E6FF] hover:border-[#1E6BFF] transition-all flex flex-col justify-between gap-5 shadow-xs cursor-pointer"
            >
              <div className="h-36 rounded-[10px] bg-[#F3F8FF] border border-[#D4E6FF] flex items-center justify-around px-3">
                <EquipmentThumbnailSvg
                  archetype="electronic-balance"
                  className="w-20 h-20 transition-transform group-hover:scale-105"
                />
                <EquipmentThumbnailSvg
                  archetype="vernier-caliper"
                  className="w-20 h-20 transition-transform group-hover:scale-105"
                />
                <EquipmentThumbnailSvg
                  archetype="optical-lens"
                  className="w-20 h-20 transition-transform group-hover:scale-105"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-[10px] bg-[#EAF4FF] border border-[#D4E6FF] flex items-center justify-center text-[#1E6BFF] shrink-0">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#12346B] group-hover:text-[#1E6BFF]">
                      Khám phá thiết bị
                    </h2>
                    <span className="text-[13.5px] font-medium text-[#506789]">
                      Quan sát 360° · 14 dụng cụ
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#1E6BFF] shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* Choice 2: Vào phòng thí nghiệm */}
            <button
              type="button"
              onClick={onEnterLabDirectly}
              className="group text-left p-5 rounded-[14px] bg-white hover:bg-[#F3F8FF] border-2 border-[#1E6BFF] transition-all flex flex-col justify-between gap-5 shadow-md cursor-pointer"
            >
              <div className="h-36 rounded-[10px] bg-[#EAF4FF] border border-[#1E6BFF]/30 flex items-center justify-around px-3">
                <EquipmentThumbnailSvg
                  archetype="electronic-balance"
                  className="w-22 h-22 transition-transform group-hover:scale-105"
                />
                <EquipmentThumbnailSvg
                  archetype="graduated-cylinder"
                  className="w-22 h-22 transition-transform group-hover:scale-105"
                />
                <EquipmentThumbnailSvg
                  archetype="solid-cylinder"
                  className="w-20 h-20 transition-transform group-hover:scale-105"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-[10px] bg-[#1E6BFF] text-white flex items-center justify-center shrink-0">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#12346B]">
                      Vào phòng thí nghiệm
                    </h2>
                    <span className="text-[13.5px] font-bold text-[#1E6BFF]">
                      Thực hành 3D trực quan
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#1E6BFF] shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* Choice 3: Bộ thí nghiệm của em */}
            <button
              type="button"
              onClick={onOpenMyKits}
              className="group text-left p-5 rounded-[14px] bg-white hover:bg-[#F3F8FF] border-2 border-[#D4E6FF] hover:border-[#1E6BFF] transition-all flex flex-col justify-between gap-5 shadow-xs cursor-pointer"
            >
              <div className="h-36 rounded-[10px] bg-[#F3F8FF] border border-[#D4E6FF] flex items-center justify-around px-3">
                <EquipmentThumbnailSvg
                  archetype="spring-dynamometer"
                  className="w-20 h-20 transition-transform group-hover:scale-105"
                />
                <EquipmentThumbnailSvg
                  archetype="overflow-can"
                  className="w-20 h-20 transition-transform group-hover:scale-105"
                />
                <EquipmentThumbnailSvg
                  archetype="erlenmeyer-flask"
                  className="w-20 h-20 transition-transform group-hover:scale-105"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-[10px] bg-[#FFFBEB] border border-[#FFC83D] flex items-center justify-center text-[#D97706] shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#12346B] group-hover:text-[#1E6BFF]">
                      Bộ thí nghiệm của em
                    </h2>
                    <span className="text-[13.5px] font-medium text-[#506789]">
                      {kits.length} bộ dụng cụ sắp sẵn
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#1E6BFF] shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </section>

        {/* 3. Thí nghiệm gợi ý bằng Thẻ hình ảnh lớn */}
        <section aria-label="Thí nghiệm gợi ý" className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1E6BFF]" />
            <h2 className="text-xl font-extrabold text-[#12346B]">
              Bài thực hành gợi ý
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {experiments.map((exp) => {
              const stepAssets = Array.from(
                new Set(exp.steps.flatMap((s) => s.requiredAssetIds)),
              )
                .map((id) => assetsMap.get(id))
                .filter((a): a is AssetDefinition => Boolean(a))
                .slice(0, 3);

              return (
                <div
                  key={exp.experimentId}
                  className="rounded-[14px] bg-white border border-[#D4E6FF] hover:border-[#1E6BFF] overflow-hidden flex flex-col justify-between shadow-xs transition-colors"
                >
                  <div>
                    <div className="h-40 bg-[#F3F8FF] border-b border-[#D4E6FF] px-4 flex items-center justify-around">
                      {stepAssets.map((asset) => (
                        <div
                          key={asset.assetId}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <EquipmentThumbnailSvg
                            archetype={asset.geometry.proceduralArchetype}
                            className="w-20 h-20"
                          />
                          <span className="text-[12px] font-semibold text-[#12346B] truncate max-w-[100px]">
                            {asset.name.vi}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="text-[13px] text-[#1E6BFF] font-bold">
                        {exp.gradeLevel}
                      </div>
                      <h3 className="text-[17px] font-bold text-[#12346B] leading-snug">
                        {exp.title}
                      </h3>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      type="button"
                      onClick={() => onStartExperiment(exp.experimentId)}
                      className="w-full py-2.5 px-4 rounded-[9px] bg-[#1E6BFF] hover:bg-[#1557D6] text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Vào bàn thực hành</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
