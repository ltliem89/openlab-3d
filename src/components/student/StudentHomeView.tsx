import React from 'react';
import {
  AssetDefinition,
  EquipmentKit,
  ExperimentDefinition,
} from '../../domain/types';
import { EquipmentThumbnailSvg } from '../common/EquipmentThumbnailSvg';
import {
  Play,
  Compass,
  FlaskConical,
  Package,
  HelpCircle,
  Sparkles,
  ArrowRight,
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
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-7 pc-cosmos-shell text-[#E8F2FF]">
      <div className="max-w-6xl mx-auto space-y-7">
        {/* 1. HERO BANNER — Planetary Cosmos Experiment Launch Deck */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#050B18] via-[#0B1930] to-[#10223D] border border-[#41D9F5]/35 shadow-[0_18px_48px_rgba(3,8,20,0.65)] p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#4D8DFF]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-[#9B83FF]/15 blur-3xl" />

          <div className="relative z-10 space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1930]/90 border border-[#41D9F5]/45 text-[#41D9F5] text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB85C]" />
              <span>Hệ Hành Tinh Phòng Lab 3D · KHTN THCS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#E8F2FF] tracking-tight leading-snug">
              Không Gian Thực Hành Khoa Học Tự Nhiên 3D
            </h1>
            <p className="text-sm text-[#A8BCD5] leading-relaxed">
              Quan sát 360° thiết bị chuẩn Thông tư 38/2021/TT-BGDĐT, lắp ráp dụng cụ trên bàn thí nghiệm và thực hiện phép đo chính xác theo sách giáo khoa.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onEnterLabDirectly}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#4D8DFF] to-[#41D9F5] hover:from-[#3B7BFF] hover:to-[#28C8E8] text-[#050B18] font-extrabold text-sm flex items-center gap-2 shadow-[0_0_24px_rgba(65,217,245,0.35)] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Vào phòng thí nghiệm 3D</span>
            </button>

            <button
              type="button"
              onClick={onOpenHelp}
              className="px-4 py-3 rounded-xl bg-[#0B1930]/90 hover:bg-[#10223D] border border-[#41D9F5]/40 text-[#E8F2FF] font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#41D9F5]" />
              <span>Hướng dẫn thao tác</span>
            </button>
          </div>
        </section>

        {/* 2. 3 LỰA CHỌN TRUNG TÂM — Planetary Constellation Launch Cards */}
        <section aria-label="Lựa chọn chế độ học tập" className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Choice 1: Khám phá thiết bị */}
            <button
              type="button"
              onClick={onOpenExploreEquipment}
              className="group text-left p-5 rounded-2xl pc-orbital-card transition-all flex flex-col justify-between gap-5 cursor-pointer"
            >
              <div className="h-36 rounded-xl bg-[#050B18]/85 border border-[#41D9F5]/20 flex items-center justify-around px-3">
                <EquipmentThumbnailSvg
                  archetype="beaker-250"
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
                  <div className="w-11 h-11 rounded-xl bg-[#10223D] border border-[#41D9F5]/40 flex items-center justify-center text-[#41D9F5] shrink-0">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#E8F2FF] group-hover:text-[#41D9F5] transition-colors">
                      Khám phá thiết bị
                    </h2>
                    <span className="text-xs font-medium text-[#A8BCD5]">
                      Quan sát 360° · {assetsMap.size || 36} dụng cụ chuẩn
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#41D9F5] shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* Choice 2: Vào phòng thí nghiệm */}
            <button
              type="button"
              onClick={onEnterLabDirectly}
              className="group text-left p-5 rounded-2xl bg-[#10223D]/90 hover:bg-[#152C4F] border-2 border-[#41D9F5] shadow-[0_0_28px_rgba(65,217,245,0.2)] transition-all flex flex-col justify-between gap-5 cursor-pointer"
            >
              <div className="h-36 rounded-xl bg-[#050B18]/90 border border-[#41D9F5]/35 flex items-center justify-around px-3">
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
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#4D8DFF] to-[#41D9F5] text-[#050B18] flex items-center justify-center shrink-0 shadow-md">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#E8F2FF]">
                      Vào phòng thí nghiệm
                    </h2>
                    <span className="text-xs font-bold text-[#41D9F5]">
                      Thực hành 3D trực quan
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#41D9F5] shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* Choice 3: Bộ thí nghiệm của em */}
            <button
              type="button"
              onClick={onOpenMyKits}
              className="group text-left p-5 rounded-2xl pc-orbital-card transition-all flex flex-col justify-between gap-5 cursor-pointer"
            >
              <div className="h-36 rounded-xl bg-[#050B18]/85 border border-[#41D9F5]/20 flex items-center justify-around px-3">
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
                  <div className="w-11 h-11 rounded-xl bg-[#FFB85C]/15 border border-[#FFB85C]/50 flex items-center justify-center text-[#FFB85C] shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-[#E8F2FF] group-hover:text-[#FFB85C] transition-colors">
                      Bộ thí nghiệm của em
                    </h2>
                    <span className="text-xs font-medium text-[#A8BCD5]">
                      {kits.length} bộ dụng cụ sắp sẵn
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#FFB85C] shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </section>

        {/* 3. Thí nghiệm gợi ý bằng Thẻ hình ảnh lớn */}
        <section aria-label="Thí nghiệm gợi ý" className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#41D9F5]" />
            <h2 className="text-xl font-extrabold text-[#E8F2FF]">
              Bài thực hành gợi ý theo SGK
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
                  className="rounded-2xl pc-orbital-card overflow-hidden flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="h-40 bg-[#050B18]/90 border-b border-[rgba(130,180,230,0.18)] px-4 flex items-center justify-around">
                      {stepAssets.map((asset) => (
                        <div
                          key={asset.assetId}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <EquipmentThumbnailSvg
                            archetype={asset.geometry.proceduralArchetype}
                            assetId={asset.assetId}
                            className="w-20 h-20"
                          />
                          <span className="text-[11.5px] font-semibold text-[#A8BCD5] truncate max-w-[100px]">
                            {asset.name.vi}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="text-xs text-[#41D9F5] font-bold uppercase tracking-wide">
                        {exp.gradeLevel}
                      </div>
                      <h3 className="text-base font-bold text-[#E8F2FF] leading-snug">
                        {exp.title}
                      </h3>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      type="button"
                      onClick={() => onStartExperiment(exp.experimentId)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4D8DFF] to-[#41D9F5] hover:from-[#3B7BFF] hover:to-[#28C8E8] text-[#050B18] font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
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
