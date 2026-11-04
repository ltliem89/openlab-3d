import React, { useState } from 'react';
import {
  AssetDefinition,
  DataProvenanceStatus,
  QuantityValue,
  SceneInstance,
  VerificationStatus,
} from '../../domain/types';
import { BehaviorRegistry } from '../../three-runtime/BehaviorRegistry';
import { DeviceControlInspector } from './DeviceControlInspector';
import {
  MULTI_SOURCE_EQUIPMENT_DOSSIERS,
  EQUIPMENT_FUNCTIONAL_AND_ENV_AUDITS,
} from '../../data/multiSourceEquipmentDossier';
import {
  Info,
  Box,
  FlaskConical,
  Gauge,
  Cpu,
  History,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Plus,
  Trash2,
  Code2,
  Globe,
} from 'lucide-react';

export type InspectorTabId =
  | 'overview'
  | 'geometry'
  | 'scientific'
  | 'measurement'
  | 'behaviors'
  | 'provenance';

interface InspectorPanelProps {
  selectedInstance: SceneInstance | null;
  selectedAsset: AssetDefinition | null;
  onUpdateInstanceTransform: (
    instanceId: string,
    positionM: [number, number, number],
    rotationRad: [number, number, number],
    displayScale?: [number, number, number],
  ) => void;
  onUpdateInstanceState: (
    instanceId: string,
    patch: Partial<SceneInstance['instanceState']>,
  ) => void;
  onAddAssetToScene: (assetId: string) => void;
  onDeleteInstance: (instanceId: string) => void;
}

const TABS: Array<{ id: InspectorTabId; label: string; icon: React.ReactNode }> = [
  { id: 'overview', label: '1. Tổng quan', icon: <Info className="w-3.5 h-3.5" /> },
  { id: 'geometry', label: '2. Hình học 3D', icon: <Box className="w-3.5 h-3.5" /> },
  { id: 'scientific', label: '3. Khoa học', icon: <FlaskConical className="w-3.5 h-3.5" /> },
  { id: 'measurement', label: '4. Đo lường', icon: <Gauge className="w-3.5 h-3.5" /> },
  { id: 'behaviors', label: '5. Hành vi', icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: 'provenance', label: '6. Phiên bản', icon: <History className="w-3.5 h-3.5" /> },
];

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedInstance,
  selectedAsset,
  onUpdateInstanceTransform,
  onUpdateInstanceState,
  onAddAssetToScene,
  onDeleteInstance,
}) => {
  const [activeTab, setActiveTab] = useState<InspectorTabId>('overview');
  const [showRawManifest, setShowRawManifest] = useState<boolean>(false);

  const renderProvenanceStatusText = (status: DataProvenanceStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="text-emerald-400 font-medium">
            Đã kiểm chứng thực nghiệm
          </span>
        );
      case 'measured':
        return (
          <span className="text-cyan-400 font-medium">
            Đã đo mẫu (Chờ hội đồng duyệt)
          </span>
        );
      case 'reported':
        return (
          <span className="text-amber-300 font-medium">
            Do người tạo cung cấp
          </span>
        );
      case 'illustrative':
      default:
        return (
          <span className="text-amber-400 font-semibold">
            DỮ LIỆU MINH HỌA (Mẫu)
          </span>
        );
    }
  };

  const renderVerificationStatusLine = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã xác minh</span>
          </span>
        );
      case 'partially-verified':
        return (
          <span className="text-amber-400 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Xác minh một phần</span>
          </span>
        );
      case 'not-verified':
      default:
        return (
          <span className="text-slate-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Chưa kiểm chứng đo lường</span>
          </span>
        );
    }
  };

  const renderQuantityRow = (label: string, q?: QuantityValue) => {
    if (!q) {
      return (
        <div className="py-1.5 border-b border-slate-800/70 flex items-center justify-between text-xs">
          <span className="text-slate-400">{label}</span>
          <span className="text-slate-500 font-mono">Chưa xác định</span>
        </div>
      );
    }
    return (
      <div className="py-2 border-b border-slate-800/70 space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs text-slate-300">{label}</span>
          <div className="font-mono tabular-nums text-right">
            <span className="text-sm font-semibold text-slate-100">{q.value}</span>
            <span className="text-xs text-cyan-400 ml-1">{q.unit}</span>
            {q.uncertainty !== undefined && (
              <span className="text-[11px] text-slate-400 ml-1">
                (±{q.uncertainty} {q.uncertaintyUnit || q.unit})
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Nguồn dữ liệu:</span>
          {renderProvenanceStatusText(q.status)}
        </div>
        {q.notes && <p className="text-[11px] text-slate-400 italic">{q.notes}</p>}
      </div>
    );
  };

  if (!selectedAsset) {
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center text-center bg-[#0E1420]">
        <p className="text-xs font-semibold text-slate-300">
          Chưa chọn tài sản hoặc đối tượng
        </p>
        <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
          Hãy nhấp vào một thiết bị trong Viewport 3D, cây đối tượng hoặc danh sách Asset Explorer để kiểm tra 6 lớp thông số.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0E1420] select-none">
      {/* Inspector Header */}
      <div className="p-3 border-b border-slate-800/90 bg-[#0B0F17]/60 shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
              <span>{selectedAsset.assetId}</span>
              <span aria-hidden="true">·</span>
              <span>v{selectedAsset.assetVersion}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedInstance ? 'Instance trong cảnh' : 'Tài sản thư viện'}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 mt-0.5 truncate">
              {selectedInstance?.customLabel || selectedAsset.name.vi}
            </h3>
            <p className="text-[11px] text-slate-400 truncate">
              {selectedAsset.name.en}
            </p>
          </div>

          {selectedInstance ? (
            <button
              type="button"
              onClick={() => onDeleteInstance(selectedInstance.instanceId)}
              className="px-2 py-1 text-[11px] font-medium text-rose-300 bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/30 rounded flex items-center gap-1 shrink-0"
              title="Gỡ instance này khỏi cảnh (Không xóa tài sản gốc)"
            >
              <Trash2 className="w-3 h-3" />
              <span>Gỡ khỏi cảnh</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onAddAssetToScene(selectedAsset.assetId)}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3 h-3" />
              <span>Thêm vào cảnh</span>
            </button>
          )}
        </div>

        {/* 6 Inspector Tabs Grid */}
        <div className="grid grid-cols-3 gap-1 mt-2.5 bg-[#090D16] p-1 rounded border border-slate-800">
          {TABS.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-2 py-1 text-[11px] font-medium rounded flex items-center gap-1 transition-colors whitespace-nowrap truncate ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {t.icon}
                <span className="truncate">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {/* TAB 1: TỔNG QUAN */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded bg-[#0B0F17] border border-slate-800 space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400">
                Mô tả công dụng khoa học
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedAsset.summary}
              </p>
              <div className="pt-1.5 border-t border-slate-800/80 flex items-center flex-wrap gap-1.5 text-[11px] text-slate-400 font-mono">
                <span>Loại: {selectedAsset.kind === 'equipment' ? 'Thiết bị' : 'Vật mẫu'}</span>
                <span>·</span>
                <span>Môn: {selectedAsset.subject.toUpperCase()}</span>
                <span>·</span>
                <span>Tags: {selectedAsset.tags.join(', ')}</span>
              </div>
            </div>

            {MULTI_SOURCE_EQUIPMENT_DOSSIERS[selectedAsset.assetId] && (
              <div className="p-2.5 rounded bg-[#0B0F17] border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tổng hợp Kích thước & 5 Nguồn Web Kiểm chứng</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                    5/5 Nguồn
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-200 bg-slate-900/80 p-2 rounded border border-slate-800">
                  <div>
                    <span className="text-slate-400">Kích thước: </span>
                    {MULTI_SOURCE_EQUIPMENT_DOSSIERS[selectedAsset.assetId].exactDimensionsSpec}
                  </div>
                  <div className="mt-1 text-cyan-300">
                    <span className="text-slate-400">Thông số: </span>
                    {MULTI_SOURCE_EQUIPMENT_DOSSIERS[selectedAsset.assetId].weightOrCapacitySpec}
                  </div>
                </div>
                <div className="space-y-1">
                  {MULTI_SOURCE_EQUIPMENT_DOSSIERS[
                    selectedAsset.assetId
                  ].fiveWebSources.map((src, i) => (
                    <div
                      key={i}
                      className="p-1.5 rounded bg-slate-900/60 border border-slate-800/90 text-[11px]"
                    >
                      <div className="font-semibold text-slate-200 flex items-center justify-between gap-1">
                        <span className="truncate">
                          {i + 1}. {src.siteName}
                        </span>
                        <span className="font-mono text-[10px] text-cyan-400 shrink-0">
                          {src.domain}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 mt-0.5 leading-snug">
                        {src.verifiedSpecSummary}
                      </p>
                    </div>
                  ))}
                </div>

                {EQUIPMENT_FUNCTIONAL_AND_ENV_AUDITS[selectedAsset.assetId] && (
                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <div className="text-[11px] font-bold text-emerald-400">
                      Kiểm chứng Hiển thị 360° & Tương tác Vật lý:
                    </div>
                    <div className="p-2 rounded bg-slate-900/90 border border-cyan-500/30 text-[11px] text-slate-200 leading-snug">
                      <span className="text-cyan-400 font-semibold">360° Readout: </span>
                      {
                        EQUIPMENT_FUNCTIONAL_AND_ENV_AUDITS[selectedAsset.assetId]
                          .omnidirectionalReadout360
                      }
                    </div>
                    <div className="space-y-1 text-[10.5px] text-slate-300">
                      {EQUIPMENT_FUNCTIONAL_AND_ENV_AUDITS[
                        selectedAsset.assetId
                      ].environmentalAndCrossToolInteractions.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Instance Transform Controls (Separated from Master Asset) */}
            {selectedInstance ? (
              <div className="p-2.5 rounded bg-[#0B0F17] border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-300">
                    Bố trí SceneInstance ({selectedInstance.instanceId})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Độc lập với tài sản gốc
                  </span>
                </div>

                {/* Position X (m) */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Tọa độ X (Trái / Phải bàn):</span>
                    <span className="text-slate-200 tabular-nums">
                      {selectedInstance.transform.positionM[0].toFixed(3)} m
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-0.6}
                    max={0.6}
                    step={0.01}
                    disabled={selectedInstance.locked}
                    value={selectedInstance.transform.positionM[0]}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateInstanceTransform(
                        selectedInstance.instanceId,
                        [
                          val,
                          selectedInstance.transform.positionM[1],
                          selectedInstance.transform.positionM[2],
                        ],
                        selectedInstance.transform.rotationRad,
                      );
                    }}
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Position Z (m) */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Tọa độ Z (Trước / Sau bàn):</span>
                    <span className="text-slate-200 tabular-nums">
                      {selectedInstance.transform.positionM[2].toFixed(3)} m
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-0.3}
                    max={0.3}
                    step={0.01}
                    disabled={selectedInstance.locked}
                    value={selectedInstance.transform.positionM[2]}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateInstanceTransform(
                        selectedInstance.instanceId,
                        [
                          selectedInstance.transform.positionM[0],
                          selectedInstance.transform.positionM[1],
                          val,
                        ],
                        selectedInstance.transform.rotationRad,
                      );
                    }}
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Rotation Y (deg) */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Góc xoay trục Y:</span>
                    <span className="text-slate-200 tabular-nums">
                      {Math.round(
                        (selectedInstance.transform.rotationRad[1] * 180) / Math.PI,
                      )}
                      °
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={5}
                    disabled={selectedInstance.locked}
                    value={Math.round(
                      (selectedInstance.transform.rotationRad[1] * 180) / Math.PI,
                    )}
                    onChange={(e) => {
                      const deg = parseFloat(e.target.value);
                      const rad = Number(((deg * Math.PI) / 180).toFixed(3));
                      onUpdateInstanceTransform(
                        selectedInstance.instanceId,
                        selectedInstance.transform.positionM,
                        [0, rad, 0],
                      );
                    }}
                    className="w-full accent-cyan-400"
                  />
                </div>

                {/* Display Scale (View-only magnification) */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Tỷ lệ hiển thị (displayScale):</span>
                    <span className="text-amber-300 tabular-nums">
                      {selectedInstance.transform.displayScale[0].toFixed(2)}×{' '}
                      {selectedInstance.transform.displayScale[0] !== 1
                        ? '(Phóng đại thị giác)'
                        : '(Kích thước thực 1:1)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1.0, 1.25, 1.5].map((scaleVal) => (
                      <button
                        key={scaleVal}
                        type="button"
                        onClick={() =>
                          onUpdateInstanceTransform(
                            selectedInstance.instanceId,
                            selectedInstance.transform.positionM,
                            selectedInstance.transform.rotationRad,
                            [scaleVal, scaleVal, scaleVal],
                          )
                        }
                        className={`flex-1 py-1 text-[11px] font-mono rounded border ${
                          selectedInstance.transform.displayScale[0] === scaleVal
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {scaleVal}×
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-slate-400 text-[11px]">
                Bạn đang xem thông tin tài sản gốc trong thư viện. Nhấn <strong>"Thêm vào cảnh"</strong> để tạo một instance riêng trên bàn thí nghiệm 3D.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HÌNH HỌC 3D */}
        {activeTab === 'geometry' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded bg-[#0B0F17] border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-200">
                Thông số Hình học & Tệp 3D (Lớp 1)
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Định dạng mô hình</span>
                  <span className="font-mono text-slate-200">
                    {selectedAsset.geometry.modelFormat}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Phiên bản tệp 3D</span>
                  <span className="font-mono text-slate-200">
                    v{selectedAsset.geometry.modelFileVersion}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Trục hướng lên / Điểm gốc</span>
                  <span className="font-mono text-slate-200">
                    {selectedAsset.geometry.upAxis}-Up · {selectedAsset.geometry.anchor}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Số đa giác / Vật liệu</span>
                  <span className="font-mono text-slate-200 tabular-nums">
                    {selectedAsset.geometry.triangleCount.toLocaleString()} tris ·{' '}
                    {selectedAsset.geometry.materialCount} PBR
                  </span>
                </div>
              </div>
              <div className="pt-1.5 border-t border-slate-800/80 text-[11px]">
                <span className="text-slate-500 block">Đường dẫn gói mô hình (modelUri):</span>
                <code className="text-cyan-300 break-all">
                  {selectedAsset.geometry.modelUri}
                </code>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#0B0F17] border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-slate-200 mb-1">
                Kích thước tham chiếu & Bounding Box
              </div>
              {renderQuantityRow('Chiều cao (Height)', selectedAsset.geometry.dimensions.height)}
              {renderQuantityRow(
                'Chiều rộng / Đường kính ngoài',
                selectedAsset.geometry.dimensions.widthOrDiameter,
              )}
              {selectedAsset.geometry.dimensions.depth &&
                renderQuantityRow('Chiều sâu (Depth)', selectedAsset.geometry.dimensions.depth)}
            </div>

            <div className="p-2.5 rounded bg-[#0B0F17] border border-slate-800 space-y-1.5">
              <div className="text-xs font-semibold text-slate-200">
                Quy ước các Node đặt tên trong mô hình ({selectedAsset.geometry.namedNodes.length})
              </div>
              <div className="space-y-1">
                {selectedAsset.geometry.namedNodes.map((node) => (
                  <div
                    key={node.nodeName}
                    className="p-1.5 rounded bg-[#090D16] border border-slate-800/80 text-[11px]"
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-cyan-300 font-semibold">{node.nodeName}</span>
                      <span className="text-slate-500">{node.role}</span>
                    </div>
                    <p className="text-slate-400 mt-0.5">{node.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: THUỘC TÍNH KHOA HỌC */}
        {activeTab === 'scientific' && (
          <div className="space-y-3">
            {/* Explicit Scientific Disclaimer Banner */}
            <div className="p-2.5 rounded bg-amber-950/35 border border-amber-500/40 text-[11px] text-amber-200 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Nguyên tắc minh bạch dữ liệu khoa học</span>
              </div>
              <p className="text-amber-200/90 leading-relaxed">
                Mô hình 3D hiển thị trực quan không đồng nghĩa thông số vật lý đã được hiệu chuẩn. Mọi đại lượng dưới đây đều ghi rõ trạng thái: <strong>Dữ liệu minh họa</strong>, <strong>Do người tạo cung cấp</strong> hoặc <strong>Đã kiểm chứng</strong>.
              </p>
            </div>

            <div className="p-2.5 rounded bg-[#0B0F17] border border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-slate-200 mb-1">
                Vật liệu & Đặc tính Vật lý (Lớp 2)
              </div>
              <div className="py-2 border-b border-slate-800/70 space-y-1">
                <span className="text-slate-400 block text-[11px]">Vật liệu chế tạo:</span>
                <span className="text-slate-100 font-medium block">
                  {selectedAsset.scientificProperties.material.value}
                </span>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Độ tin cậy:</span>
                  {renderProvenanceStatusText(selectedAsset.scientificProperties.material.status)}
                </div>
              </div>

              {renderQuantityRow(
                'Khối lượng tham chiếu (m)',
                selectedAsset.scientificProperties.referenceMass,
              )}
              {renderQuantityRow(
                'Thể tích tham chiếu (V)',
                selectedAsset.scientificProperties.referenceVolume,
              )}
              {renderQuantityRow(
                'Khối lượng riêng tham chiếu (ρ)',
                selectedAsset.scientificProperties.referenceDensity,
              )}
              {renderQuantityRow(
                'Dung tích danh định',
                selectedAsset.scientificProperties.capacity,
              )}
              {selectedAsset.scientificProperties.focalLength &&
                renderQuantityRow(
                  'Tiêu cự danh định (f)',
                  selectedAsset.scientificProperties.focalLength,
                )}
            </div>

            {/* Hollow / Internal Cavity Inspection */}
            {selectedAsset.scientificProperties.internalCavity && (
              <div className="p-2.5 rounded bg-[#0B0F17] border border-slate-800 space-y-1.5">
                <div className="text-xs font-semibold text-slate-200">
                  Cấu trúc đặc / Khoang rỗng bên trong
                </div>
                <div className="text-[11px] text-slate-300">
                  Trạng thái:{' '}
                  <strong
                    className={
                      selectedAsset.scientificProperties.internalCavity.isHollow
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }
                  >
                    {selectedAsset.scientificProperties.internalCavity.isHollow
                      ? 'Vật rỗng (Có khoang chứa khí bên trong)'
                      : 'Vật rắn đặc đồng nhất'}
                  </strong>
                </div>
                {selectedAsset.scientificProperties.internalCavity.cavityVolume &&
                  renderQuantityRow(
                    'Thể tích khoang rỗng',
                    selectedAsset.scientificProperties.internalCavity.cavityVolume,
                  )}
                {selectedAsset.scientificProperties.internalCavity.wallThickness &&
                  renderQuantityRow(
                    'Bề dày thành vật',
                    selectedAsset.scientificProperties.internalCavity.wallThickness,
                  )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DỮ LIỆU ĐO LƯỜNG */}
        {activeTab === 'measurement' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded bg-[#0B0F17] border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">
                  Hồ sơ Đo lường & Hiệu chuẩn
                </span>
                <span className="text-[11px] font-mono text-cyan-400">
                  {selectedAsset.measurementMetadata.isMeasuringInstrument
                    ? 'Thiết bị đo'
                    : 'Dụng cụ / Vật mẫu'}
                </span>
              </div>

              {renderQuantityRow(
                'Giới hạn đo dưới (Min)',
                selectedAsset.measurementMetadata.rangeMin,
              )}
              {renderQuantityRow(
                'Giới hạn đo trên (GHĐ / Max)',
                selectedAsset.measurementMetadata.rangeMax,
              )}
              {renderQuantityRow(
                'Độ chia nhỏ nhất (ĐCNN)',
                selectedAsset.measurementMetadata.leastCount,
              )}

              <div className="py-1.5 border-b border-slate-800/70 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Hỗ trợ chỉnh số 0 / Trừ bì (Tare):</span>
                <span className="font-mono text-slate-200">
                  {selectedAsset.measurementMetadata.zeroOffsetSupported ? 'Có' : 'Không'}
                </span>
              </div>

              {selectedAsset.measurementMetadata.referenceStandard && (
                <div className="py-1.5 border-b border-slate-800/70 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Tiêu chuẩn tham chiếu:</span>
                  <span className="font-mono text-cyan-300">
                    {selectedAsset.measurementMetadata.referenceStandard}
                  </span>
                </div>
              )}

              {selectedAsset.measurementMetadata.calibrationMethod && (
                <div className="pt-1.5 text-[11px] space-y-1">
                  <span className="text-slate-400 block">Phương pháp đo & quy tắc đọc:</span>
                  <p className="text-slate-200 leading-relaxed bg-[#090D16] p-2 rounded border border-slate-800">
                    {selectedAsset.measurementMetadata.calibrationMethod}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: HÀNH VI TƯƠNG TÁC (BEHAVIOR MODULES & DIGITAL TWIN CONTROLS) */}
        {activeTab === 'behaviors' && (
          <div className="space-y-3">
            {/* Bộ điều khiển Digital Twin chuẩn hóa theo Device Control Profile (36 thiết bị) */}
            {selectedInstance && (
              <DeviceControlInspector
                selectedAsset={selectedAsset}
                selectedInstance={selectedInstance}
                onUpdateInstanceState={onUpdateInstanceState}
                isDarkMode={true}
              />
            )}

            {/* Capabilities List */}
            <div className="p-2.5 rounded bg-[#0B0F17] border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-200">
                Danh sách Capability đã đăng ký (Lớp 3)
              </div>
              <div className="space-y-1.5">
                {selectedAsset.capabilities.map((cap) => {
                  const badge = BehaviorRegistry.getCapabilityBadgeMeta(cap.state);
                  return (
                    <div
                      key={cap.id}
                      className="p-2 rounded bg-[#090D16] border border-slate-800/80 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-slate-200">
                          {BehaviorRegistry.describeCapabilityName(cap.id)}
                        </span>
                        <span className={`text-[11px] font-mono ${badge.toneClass}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        id: {cap.id} · module: {cap.behaviorModuleId || 'core'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: NGUỒN GỐC & PHIÊN BẢN */}
        {activeTab === 'provenance' && (
          <div className="space-y-3">
            {/* Multi-dimensional SemVer Table */}
            <div className="p-2.5 rounded bg-[#0B0F17] border border-slate-800 space-y-1.5">
              <div className="text-xs font-semibold text-slate-200">
                Quản lý Phiên bản Độc lập (SemVer)
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-1.5 rounded bg-[#090D16] border border-slate-800/80">
                  <span className="text-slate-500 block">assetVersion</span>
                  <span className="font-mono text-cyan-300 font-semibold">
                    {selectedAsset.assetVersion}
                  </span>
                </div>
                <div className="p-1.5 rounded bg-[#090D16] border border-slate-800/80">
                  <span className="text-slate-500 block">modelFileVersion</span>
                  <span className="font-mono text-slate-200">
                    {selectedAsset.geometry.modelFileVersion}
                  </span>
                </div>
                <div className="p-1.5 rounded bg-[#090D16] border border-slate-800/80">
                  <span className="text-slate-500 block">manifestSchemaVersion</span>
                  <span className="font-mono text-slate-200">
                    {selectedAsset.manifestSchemaVersion}
                  </span>
                </div>
                <div className="p-1.5 rounded bg-[#090D16] border border-slate-800/80">
                  <span className="text-slate-500 block">moduleApiVersion</span>
                  <span className="font-mono text-slate-200">
                    {selectedAsset.moduleApiVersion}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Independent Verification Statuses */}
            <div className="p-2.5 rounded bg-[#0B0F17] border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-200">
                Ba lớp Kiểm chứng Độc lập
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/70">
                  <span className="text-slate-400">1. Trạng thái xuất bản tài sản:</span>
                  <span className="font-mono text-emerald-400 uppercase">
                    {selectedAsset.validation.assetReviewStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/70">
                  <span className="text-slate-400">2. Kiểm chứng hình học 3D:</span>
                  {renderVerificationStatusLine(selectedAsset.validation.geometryStatus)}
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/70">
                  <span className="text-slate-400">3. Kiểm chứng đo lường khoa học:</span>
                  {renderVerificationStatusLine(selectedAsset.validation.metrologyStatus)}
                </div>
              </div>
              {selectedAsset.validation.reviewerNotes && (
                <p className="text-[11px] text-slate-300 bg-[#090D16] p-2 rounded border border-slate-800">
                  {selectedAsset.validation.reviewerNotes}
                </p>
              )}
            </div>

            {/* Provenance & License */}
            <div className="p-2.5 rounded bg-[#0B0F17] border border-slate-800 space-y-1.5 text-[11px]">
              <div className="text-xs font-semibold text-slate-200">
                Nguồn gốc & Bản quyền
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/70">
                <span className="text-slate-400">Tác giả / Nhóm tạo:</span>
                <span className="text-slate-200 font-medium">
                  {selectedAsset.provenance.createdBy}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/70">
                <span className="text-slate-400">Đơn vị:</span>
                <span className="text-slate-200">{selectedAsset.provenance.organization}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/70">
                <span className="text-slate-400">Giấy phép:</span>
                <span className="font-mono text-cyan-300">
                  {selectedAsset.provenance.license}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Cập nhật lần cuối:</span>
                <span className="font-mono text-slate-300">
                  {selectedAsset.provenance.updatedAt}
                </span>
              </div>
            </div>

            {/* Raw Manifest JSON Preview Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowRawManifest((v) => !v)}
                className="w-full py-1.5 px-3 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-200 flex items-center justify-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {showRawManifest ? 'Ẩn Manifest JSON' : 'Xem hợp đồng Manifest JSON'}
                </span>
              </button>
              {showRawManifest && (
                <pre className="mt-2 p-2.5 rounded bg-[#090D16] border border-slate-800 text-[10px] font-mono text-slate-300 overflow-x-auto max-h-60">
                  {JSON.stringify(selectedAsset, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
