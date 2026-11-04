import React, { useState } from 'react';
import {
  AssetDefinition,
  EquipmentKit,
  LabEnvironment,
} from '../../domain/types';
import { BehaviorRegistry } from '../../three-runtime/BehaviorRegistry';
import {
  X,
  ShieldCheck,
  Layers,
  CheckSquare,
  FileCode,
  ArrowRight,
} from 'lucide-react';

import {
  EQUIPMENT_GROUPS_G01_G10,
  PHYSICS_FIDELITY_SPECS,
  METROLOGY_VALIDATION_BENCHMARK,
  computeMetrologyTTestStats,
} from '../../three-runtime/LabEnvironmentEngine';

interface GovernanceOverviewModalProps {
  mode: 'overview' | 'governance';
  assets: AssetDefinition[];
  kits: EquipmentKit[];
  environments: LabEnvironment[];
  onClose: () => void;
  onSelectAssetAndInspect: (assetId: string) => void;
}

export const GovernanceOverviewModal: React.FC<GovernanceOverviewModalProps> = ({
  mode,
  assets,
  kits,
  environments,
  onClose,
  onSelectAssetAndInspect,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'architecture' | 'audit' | 'checklist' | 'metrology_g01_g10'
  >(mode === 'governance' ? 'metrology_g01_g10' : 'architecture');

  const behaviors = BehaviorRegistry.listAll();
  const tTestStats = computeMetrologyTTestStats(METROLOGY_VALIDATION_BENCHMARK);
  const verifiedGeoCount = assets.filter(
    (a) => a.validation.geometryStatus === 'verified',
  ).length;
  const verifiedMetrologyCount = assets.filter(
    (a) => a.validation.metrologyStatus === 'verified',
  ).length;

  return (
    <div
      className="fixed inset-0 bg-slate-950/35 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[88vh] bg-[#0B172A]/68 backdrop-blur-2xl border-2 border-[#38BDF8]/70 rounded-[16px] shadow-[0_24px_64px_rgba(0,0,0,0.65)] flex flex-col overflow-hidden text-white"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#061020]/78 backdrop-blur-xl border-b border-white/20 flex items-center justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-base font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              {mode === 'overview'
                ? 'Tổng quan Kiến trúc Nền tảng OpenLab 3D (v2.3)'
                : 'Quản trị, Phân nhóm G01–G10 & Kiểm định Đo lường Thống kê (t-test)'}
            </h2>
            <p className="text-xs font-bold text-[#7DD3FC] mt-0.5">
              Tuân thủ đặc tả OL3D-MASTER-SPEC · 10 Nhóm G01–G10 · 24 Biến Môi Trường · Mô hình L1–L4 · Thư viện libraries3DLab
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/EQUIPMENT_MODULE_STANDARD.md"
              download="EQUIPMENT_MODULE_STANDARD.md"
              className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Tải file Luật & Hướng dẫn tạo hàng loạt module .HTML (v2.3)"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Tải Luật Tạo Hàng Loạt (.MD)</span>
            </a>
            <a
              href="/OPENLAB_3D_ARCHITECTURE_OVERVIEW.md"
              download="OPENLAB_3D_ARCHITECTURE_OVERVIEW.md"
              className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Tải file Markdown tổng quan kiến trúc để gửi cho ChatGPT / AI khác"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Tải .MD Tổng quan</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="px-5 py-2 bg-[#0B0F17]/60 border-b border-slate-800 flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('architecture')}
            className={`px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 ${
              activeSubTab === 'architecture'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Kiến trúc 4 lớp & Behavior Registry</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('metrology_g01_g10')}
            className={`px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 ${
              activeSubTab === 'metrology_g01_g10'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2. 10 Nhóm G01–G10, Vật lý L1–L4 & Kiểm định t-test</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 ${
              activeSubTab === 'audit'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. Bảng kiểm duyệt 3 cấp ({assets.length} tài sản)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('checklist')}
            className={`px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1.5 ${
              activeSubTab === 'checklist'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>4. Checklist Kiểm duyệt & Gói libraries3DLab</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {activeSubTab === 'architecture' && (
            <div className="space-y-5">
              {/* Summary Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded bg-[#0B0F17] border border-slate-800">
                  <div className="text-[11px] text-slate-400">Tổng tài sản thiết bị 3D</div>
                  <div className="text-2xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
                    {assets.length}
                  </div>
                  <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                    {kits.length} Bộ thiết bị · {environments.length} Môi trường
                  </div>
                </div>

                <div className="p-3.5 rounded bg-[#0B0F17] border border-slate-800">
                  <div className="text-[11px] text-slate-400">Kiểm chứng Hình học 3D</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                    {verifiedGeoCount}/{assets.length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Chuẩn hóa Y-Up, mét (m), base-center
                  </div>
                </div>

                <div className="p-3.5 rounded bg-[#0B0F17] border border-slate-800">
                  <div className="text-[11px] text-slate-400">Kiểm chứng Đo lường</div>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                    {verifiedMetrologyCount}/{assets.length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Tách biệt rõ với dữ liệu minh họa
                  </div>
                </div>

                <div className="p-3.5 rounded bg-[#0B0F17] border border-slate-800">
                  <div className="text-[11px] text-slate-400">Mô-đun Hành vi An toàn</div>
                  <div className="text-2xl font-bold font-mono text-cyan-300 mt-1 tabular-nums">
                    {behaviors.length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Cấm thực thi JS tùy ý từ tệp tải lên
                  </div>
                </div>
              </div>

              {/* 4 Independent Layers Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded bg-[#0B0F17] border border-slate-800 space-y-1.5">
                  <div className="font-semibold text-cyan-300">
                    Lớp 1 — Geometry / Presentation Asset
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Lưu trữ tệp hình học GLB/glTF hoặc Procedural PBR, bounding box (m), điểm neo <code>base-center</code> và danh sách các node đặt tên chuẩn (<code>scale_display</code>, <code>liquid_surface</code>, <code>plunger</code>).
                  </p>
                </div>

                <div className="p-3.5 rounded bg-[#0B0F17] border border-slate-800 space-y-1.5">
                  <div className="font-semibold text-cyan-300">
                    Lớp 2 — Scientific / Technical Metadata
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Lưu trữ thông số vật liệu, khối lượng/thể tích tham chiếu, giới hạn đo (GHĐ), độ chia nhỏ nhất (ĐCNN), sai số và trạng thái nguồn dữ liệu (<code>illustrative</code>, <code>reported</code>, <code>verified</code>).
                  </p>
                </div>

                <div className="p-3.5 rounded bg-[#0B0F17] border border-slate-800 space-y-1.5">
                  <div className="font-semibold text-cyan-300">
                    Lớp 3 — Controlled Behavior Module Registry
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Manifest của tài sản chỉ khai báo ID hành vi nằm trong <code>BehaviorRegistry</code> (ví dụ <code>bhv-electronic-balance</code>). Không cho phép tệp tải lên nhúng mã thực thi tùy ý.
                  </p>
                </div>

                <div className="p-3.5 rounded bg-[#0B0F17] border border-slate-800 space-y-1.5">
                  <div className="font-semibold text-cyan-300">
                    Lớp 4 — Scene Instance Placement
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Mỗi thiết bị đặt vào bàn thí nghiệm tạo một <code>SceneInstance</code> riêng chứa tọa độ, góc xoay và trạng thái cục bộ (mực nước, số trừ bì Tare). Xóa hoặc di chuyển instance không ảnh hưởng tài sản gốc.
                  </p>
                </div>
              </div>

              {/* Registered Behavior Modules Table */}
              <div className="bg-[#0B0F17] border border-slate-800 rounded overflow-hidden">
                <div className="px-3.5 py-2.5 border-b border-slate-800 font-semibold text-slate-200">
                  Danh mục Mô-đun Hành vi đã đăng ký trong BehaviorRegistry
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] text-slate-400 bg-[#090D16]">
                        <th className="py-2 px-3">Mã Module</th>
                        <th className="py-2 px-3">Tên Mô-đun Hành vi</th>
                        <th className="py-2 px-3">Phiên bản</th>
                        <th className="py-2 px-3">Capabilities hỗ trợ</th>
                        <th className="py-2 px-3">Trạng thái hiện tại</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {behaviors.map((bhv) => {
                        const badge = BehaviorRegistry.getCapabilityBadgeMeta(
                          bhv.implementationState,
                        );
                        return (
                          <tr key={bhv.id} className="hover:bg-slate-800/30">
                            <td className="py-2 px-3 font-mono text-cyan-300">{bhv.id}</td>
                            <td className="py-2 px-3 text-slate-200 font-medium">
                              <div>{bhv.name}</div>
                              <div className="text-[11px] text-slate-400 font-normal">
                                {bhv.description}
                              </div>
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-300">
                              v{bhv.version}
                            </td>
                            <td className="py-2 px-3 font-mono text-[11px] text-slate-400">
                              {bhv.supportedCapabilities.join(', ')}
                            </td>
                            <td className={`py-2 px-3 font-mono ${badge.toneClass}`}>
                              {badge.label}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'audit' && (
            <div className="space-y-4">
              <div className="p-3 rounded bg-[#0B0F17] border border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="text-slate-300">
                  Quy trình vòng đời tài sản:{' '}
                  <span className="font-mono text-cyan-300">
                    draft → submitted → in-review → approved → published
                  </span>
                </div>
                <span className="text-[11px] text-amber-400 font-mono">
                  Giai đoạn Prototype: Dữ liệu kiểm duyệt lưu cục bộ trong MockRepository
                </span>
              </div>

              <div className="bg-[#0B0F17] border border-slate-800 rounded overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] text-slate-400 bg-[#090D16]">
                      <th className="py-2 px-3">Mã bất biến</th>
                      <th className="py-2 px-3">Tên thiết bị / Vật mẫu</th>
                      <th className="py-2 px-3">Asset Ver</th>
                      <th className="py-2 px-3">1. Duyệt Tài sản</th>
                      <th className="py-2 px-3">2. Kiểm chứng Hình học</th>
                      <th className="py-2 px-3">3. Kiểm chứng Đo lường</th>
                      <th className="py-2 px-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {assets.map((asset) => (
                      <tr key={asset.assetId} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-mono text-cyan-300">
                          {asset.assetId}
                        </td>
                        <td className="py-2 px-3 text-slate-100 font-medium">
                          {asset.name.vi}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-300">
                          v{asset.assetVersion}
                        </td>
                        <td className="py-2 px-3 font-mono uppercase text-emerald-400">
                          {asset.validation.assetReviewStatus}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-300">
                          {asset.validation.geometryStatus}
                        </td>
                        <td className="py-2 px-3 font-mono text-amber-300">
                          {asset.validation.metrologyStatus}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectAssetAndInspect(asset.assetId);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[11px] inline-flex items-center gap-1"
                          >
                            <span>Mở trong Inspector</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === 'metrology_g01_g10' && (
            <div className="space-y-5">
              {/* 1. 4 Cấp độ Mô hình Vật lý L1 - L4 */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  A. 4 Cấp Độ Mô Hình Vật Lý & Đánh Đổi Hiệu Năng WebGL (L1 – L4)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {PHYSICS_FIDELITY_SPECS.map((spec) => (
                    <div
                      key={spec.level}
                      className="p-3 rounded bg-[#0B0F17] border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs">
                          {spec.level}
                        </span>
                        <span className="font-mono text-[11px] text-cyan-400">
                          ~{spec.targetWebGlFps} FPS · Chính xác {spec.accuracyPercent}%
                        </span>
                      </div>
                      <div className="font-bold text-slate-100">{spec.titleVi}</div>
                      <div className="font-mono text-[11px] text-amber-300 bg-slate-900/90 px-2 py-1 rounded border border-slate-800">
                        {spec.formulaSummary}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {spec.descriptionVi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Bảng Phân Loại 10 Nhóm Thiết Bị KHTN THCS (G01 - G10) */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  B. Thông Số Kỹ Thuật 10 Nhóm Thiết Bị Chuẩn KHTN THCS (G01 – G10)
                </h3>
                <div className="rounded bg-[#0B0F17] border border-slate-800 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] text-slate-400 bg-[#090D16]">
                        <th className="py-2 px-3">Mã Nhóm</th>
                        <th className="py-2 px-3">Thiết bị mẫu</th>
                        <th className="py-2 px-3">Dải đo & ĐCNN</th>
                        <th className="py-2 px-3">Sai số cho phép</th>
                        <th className="py-2 px-3">Biến môi trường tác động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {EQUIPMENT_GROUPS_G01_G10.map((grp) => (
                        <tr key={grp.groupId} className="hover:bg-slate-800/30">
                          <td className="py-2 px-3 font-bold text-cyan-300 whitespace-nowrap">
                            {grp.titleVi}
                          </td>
                          <td className="py-2 px-3 text-slate-300">
                            {grp.sampleEquipmentsVi.join(', ')}
                          </td>
                          <td className="py-2 px-3 font-mono text-amber-300 whitespace-nowrap">
                            {grp.typicalRangeAndLeastCount}
                          </td>
                          <td className="py-2 px-3 font-mono text-emerald-300 whitespace-nowrap">
                            {grp.permissibleError}
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-400">
                            {grp.relatedEnvVars.join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Bảng Kiểm Định Phép Đo Khối Lượng Riêng Ảo vs Thực (10 Mẫu - Kiểm định t-test) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    C. Báo Cáo Kiểm Định Phép Đo Ảo vs Thực (10 Mẫu Vật Rắn — Kiểm định thống kê t-test)
                  </h3>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      Sai số TB: {tTestStats.meanAbsRelErrorPct}% (Ngưỡng ≤ 5.0%)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      SD: ±{tTestStats.stdDevDensityGCm3} g/cm³ · t = {tTestStats.tStatistic} &lt; t_crit({tTestStats.tCritical95})
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      {tTestStats.isAccepted ? 'ĐẠT CHUẨN KIỂM ĐỊNH (PASS)' : 'CẦN HIỆU CHỈNH'}
                    </span>
                  </div>
                </div>

                <div className="rounded bg-[#0B0F17] border border-slate-800 overflow-x-auto">
                  <table className="w-full text-left border-collapse font-mono text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-[#090D16] font-sans">
                        <th className="py-2 px-3">Mẫu kiểm định</th>
                        <th className="py-2 px-3">Vật liệu</th>
                        <th className="py-2 px-3 text-right">m_real (g)</th>
                        <th className="py-2 px-3 text-right">m_virt (g)</th>
                        <th className="py-2 px-3 text-right">V_real (cm³)</th>
                        <th className="py-2 px-3 text-right">V_virt (cm³)</th>
                        <th className="py-2 px-3 text-right">ρ_real (g/cm³)</th>
                        <th className="py-2 px-3 text-right">ρ_virt (g/cm³)</th>
                        <th className="py-2 px-3 text-right">Sai số (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {METROLOGY_VALIDATION_BENCHMARK.map((row) => (
                        <tr key={row.sampleIndex} className="hover:bg-slate-800/30">
                          <td className="py-1.5 px-3 font-sans font-semibold text-slate-200">
                            {row.specimenNameVi}
                          </td>
                          <td className="py-1.5 px-3 font-sans text-slate-400">
                            {row.materialVi}
                          </td>
                          <td className="py-1.5 px-3 text-right text-slate-300">
                            {row.realMassG.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-3 text-right text-cyan-300">
                            {row.virtMassG.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-3 text-right text-slate-300">
                            {row.realVolumeCm3.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-3 text-right text-cyan-300">
                            {row.virtVolumeCm3.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-3 text-right font-bold text-slate-100">
                            {row.realDensityGCm3.toFixed(3)}
                          </td>
                          <td className="py-1.5 px-3 text-right font-bold text-emerald-300">
                            {row.virtDensityGCm3.toFixed(3)}
                          </td>
                          <td className="py-1.5 px-3 text-right text-amber-300">
                            {row.relativeErrorPct > 0 ? `+${row.relativeErrorPct}` : row.relativeErrorPct}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'checklist' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded bg-[#0B0F17] border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                  <CheckSquare className="w-4 h-4" />
                  <span>Checklist Kiểm duyệt Tài sản 3D Chính thức</span>
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  <li>• Định dạng GLB/glTF hoặc Module .HTML v2.3 hợp lệ, không chứa mã độc.</li>
                  <li>• Đơn vị mét (m), trục Y-up, điểm gốc (anchor) tại tâm đáy (y = 0).</li>
                  <li>• Phân nhóm chuẩn G01–G10 và cấp độ mô hình vật lý L1–L4.</li>
                  <li>• Phân biệt rõ dữ liệu minh họa (illustrative) và dữ liệu đã kiểm chứng (verified).</li>
                  <li>• Đạt tiêu chí kiểm định phép đo Ảo vs Thực (sai số thống kê t-test ≤ ±5%).</li>
                  <li>• Tự động đóng gói vào thư viện C:\Users\ltlie\Documents\libraries3DLab.</li>
                </ul>
              </div>

              <div className="p-4 rounded bg-[#0B0F17] border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                  <FileCode className="w-4 h-4" />
                  <span>Cấu trúc gói thư viện chuẩn Arduino (libraries3DLab)</span>
                </div>
                <pre className="p-3 rounded bg-[#090D16] border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
{`C:\\Users\\ltlie\\Documents\\libraries3DLab\\
├── library-index.json
├── README_LIBRARIES_3DLAB.md
└── OL3D-EQP-CYL-0001_ong-dong-thuy-tinh-100ml\\
    ├── library.properties
    ├── manifest.json
    └── ong-dong-thuy-tinh-100ml.html`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
