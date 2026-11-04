import React, { useState, useMemo } from 'react';
import {
  BENCH_SURFACE_Y,
  CoordinateDisplaySettings,
  EnvironmentVariableDefinition,
  EnvironmentVariableId,
  LabClockState,
  LabEventLog,
  LabGraphicsSettings,
  LabRoomConfig,
  SIMULATION_SPEED_OPTIONS,
  BUILTIN_ENVIRONMENT_AWARE_MODULES,
  computeEuclideanDistance3D,
  formatLengthByUnit,
  formatSimulationDuration,
  getPlacementSurfaces,
  runLabEnvironmentAcceptanceTests,
} from '../../three-runtime/LabEnvironmentEngine';
import { SceneInstance, AssetDefinition } from '../../domain/types';
import {
  X,
  Compass,
  Clock,
  Sliders,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Ruler,
  Eye,
  Layers,
  ShieldCheck,
  Activity,
} from 'lucide-react';

interface LabEnvironmentSpecModalProps {
  onClose: () => void;
  roomConfig: LabRoomConfig;
  coordSettings: CoordinateDisplaySettings;
  onUpdateCoordSettings: (patch: Partial<CoordinateDisplaySettings>) => void;
  envVars: Record<EnvironmentVariableId, EnvironmentVariableDefinition>;
  onUpdateEnvVar: (id: EnvironmentVariableId, nextVal: number) => void;
  onResetEnvVars: () => void;
  graphicsSettings: LabGraphicsSettings;
  onUpdateGraphicsSettings: (patch: Partial<LabGraphicsSettings>) => void;
  clockState: LabClockState;
  onSimClockAction: (action: 'start' | 'pause' | 'resume' | 'reset') => void;
  onSimClockSpeed: (speed: number) => void;
  eventLogs: LabEventLog[];
  selectedInstance: SceneInstance | null;
  selectedAsset: AssetDefinition | null;
  instances: SceneInstance[];
  assetsMap: Map<string, AssetDefinition>;
  inspectedWorldPoint: {
    label: string;
    worldM: [number, number, number];
    localBenchM?: [number, number, number];
  };
  onSelectCalibrationPoint: (
    label: string,
    worldM: [number, number, number],
  ) => void;
  distancePointA: { label: string; worldM: [number, number, number] };
  distancePointB: { label: string; worldM: [number, number, number] };
  onSetDistancePointA: (pt: {
    label: string;
    worldM: [number, number, number];
  }) => void;
  onSetDistancePointB: (pt: {
    label: string;
    worldM: [number, number, number];
  }) => void;
  onFocusCameraPreset: (preset: 'bench-close' | 'room-overview') => void;
}

type ModalTabId = 'coordinates' | 'environment' | 'clocks' | 'acceptance';

export const LabEnvironmentSpecModal: React.FC<LabEnvironmentSpecModalProps> = ({
  onClose,
  roomConfig,
  coordSettings,
  onUpdateCoordSettings,
  envVars,
  onUpdateEnvVar,
  onResetEnvVars,
  graphicsSettings,
  onUpdateGraphicsSettings,
  clockState,
  onSimClockAction,
  onSimClockSpeed,
  eventLogs,
  instances,
  assetsMap,
  inspectedWorldPoint,
  onSelectCalibrationPoint,
  distancePointA,
  distancePointB,
  onSetDistancePointA,
  onSetDistancePointB,
  onFocusCameraPreset,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTabId>('coordinates');

  const placementSurfaces = useMemo(
    () => getPlacementSurfaces(roomConfig),
    [roomConfig],
  );

  const euclideanDistM = useMemo(
    () =>
      computeEuclideanDistance3D(distancePointA.worldM, distancePointB.worldM),
    [distancePointA, distancePointB],
  );

  const acceptanceResults = useMemo(
    () =>
      runLabEnvironmentAcceptanceTests({
        roomConfig,
        coordSettings,
        clockState,
        envVars,
        graphicsSettings,
        eventLogs,
      }),
    [roomConfig, coordSettings, clockState, envVars, graphicsSettings, eventLogs],
  );

  const passCount = acceptanceResults.filter((r) => r.status === 'Pass').length;

  const presetPoints: Array<{
    label: string;
    worldM: [number, number, number];
  }> = useMemo(() => {
    const base: Array<{ label: string; worldM: [number, number, number] }> = [
      { label: 'Gốc O (0, 0, 0) — Tâm sàn', worldM: [0, 0, 0] },
      { label: 'Điểm chuẩn +1m Trục X (1, 0, 0)', worldM: [1, 0, 0] },
      { label: 'Điểm chuẩn +1m Trục Y (0, 1, 0)', worldM: [0, 1, 0] },
      { label: 'Điểm chuẩn +1m Trục Z (0, 0, 1)', worldM: [0, 0, 1] },
      {
        label: `Tâm mặt bàn (0, ${BENCH_SURFACE_Y}, 0)`,
        worldM: [0, BENCH_SURFACE_Y, 0],
      },
      { label: 'Điểm kiểm thử chéo (1, 1, 0)', worldM: [1, 1, 0] },
    ];
    instances.forEach((inst) => {
      if (!inst.visible) return;
      const asset = assetsMap.get(inst.assetId);
      const wx = Number(inst.transform.positionM[0].toFixed(3));
      const wy = Number(
        (BENCH_SURFACE_Y + inst.transform.positionM[1]).toFixed(3),
      );
      const wz = Number(inst.transform.positionM[2].toFixed(3));
      base.push({
        label: `Thiết bị: ${inst.customLabel || asset?.name.vi || inst.assetId}`,
        worldM: [wx, wy, wz],
      });
    });
    return base;
  }, [instances, assetsMap]);

  return (
    <div
      className="fixed inset-0 bg-slate-950/35 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl bg-[#0B172A]/68 backdrop-blur-2xl border-2 border-[#38BDF8]/75 rounded-[16px] shadow-[0_24px_64px_rgba(0,0,0,0.65)] overflow-hidden text-white flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#071B3B]/80 backdrop-blur-xl border-b border-white/20 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E6BFF]/35 border border-[#38BDF8] flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#7DD3FC]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#00BCEB]/25 text-[#7DD3FC] border border-[#38BDF8]/60">
                  OL3D-LAB-ENVIRONMENT-SPEC v2.0 + MODULE v2.2
                </span>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/25 text-[#6EE7B7] border border-emerald-400/60">
                  Kiểm thử Mục 12: {passCount}/{acceptanceResults.length} PASS
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                Quản Trị Môi Trường Phòng Thí Nghiệm 3D — Hệ Tọa Độ XYZ, Biến Vật Lý & Đồng Hồ Kép
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onFocusCameraPreset('room-overview');
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#17335E] hover:bg-[#1E6BFF] border border-[#38BDF8] text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
              title="Đưa camera ra xa để quan sát toàn bộ phòng 12×8×3.6m và gốc O(0,0,0) tại sàn"
            >
              <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Xem Toàn Phòng 12×8m</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onFocusCameraPreset('bench-close');
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#17335E] hover:bg-[#1E6BFF] border border-[#22C55E] text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
              title="Đưa camera lại gần mặt bàn thực hành ở y = 0.82 m"
            >
              <Layers className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Xem Bàn Thực Hành (y=0.82m)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-2.5 bg-[#13223C] border-b border-[#233E68] flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('coordinates')}
            className={`px-4 py-2 text-xs font-extrabold rounded-t-lg border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'coordinates'
                ? 'bg-[#0F1A2E] text-[#00BCEB] border-[#00BCEB]'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. Hệ Tọa Độ XYZ & Đo Khoảng Cách Euclid</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('environment')}
            className={`px-4 py-2 text-xs font-extrabold rounded-t-lg border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'environment'
                ? 'bg-[#0F1A2E] text-[#00BCEB] border-[#00BCEB]'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>2. 13 Biến Môi Trường Vật Lý & Đồ Họa (Mục 6 & 7)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('clocks')}
            className={`px-4 py-2 text-xs font-extrabold rounded-t-lg border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer cursor-pointer transition-colors ${
              activeTab === 'clocks'
                ? 'bg-[#0F1A2E] text-[#00BCEB] border-[#00BCEB]'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>3. Đồng Hồ Thực (VN) + Mô Phỏng & Nhật Ký (Mục 8)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('acceptance')}
            className={`px-4 py-2 text-xs font-extrabold rounded-t-lg border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'acceptance'
                ? 'bg-[#0F1A2E] text-[#22C55E] border-[#22C55E]'
                : 'text-slate-300 border-transparent hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span>
              4. Nghiệm Thu Mục 12 ({passCount}/{acceptanceResults.length} Pass)
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: HỆ TỌA ĐỘ XYZ, BÀN Y = 0.82M & ĐO KHOẢNG CÁCH EUCLID */}
          {activeTab === 'coordinates' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Cột trái: Cấu hình phòng 12x8x3.6m, Bàn y=0.82m & Công tắc hiển thị worldAxesHelper */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-[#15243D] border border-[#28436C] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#00BCEB]">
                      Hệ Trục Góc Bàn Cố Định Duy Nhất (O tại góc bàn · X, Y thuộc cạnh bàn · Z đứng)
                    </h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0B1526] text-[#FACC15] border border-[#FACC15]/40">
                      1.0 unit = 1.0 mét (m)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#0B1526] border border-red-500/40">
                      <div className="font-extrabold text-red-400">
                        Trục +X (Cạnh dài bàn)
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        Chạy dọc cạnh dài bàn từ gốc O sang phải (0 → {roomConfig.bench.widthM.toFixed(2)} m)
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0B1526] border border-emerald-500/40">
                      <div className="font-extrabold text-emerald-400">
                        Trục +Y (Cạnh rộng bàn)
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        Chạy dọc cạnh rộng bàn từ gốc O ra trước (0 → {roomConfig.bench.depthM.toFixed(2)} m)
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0B1526] border border-blue-500/40">
                      <div className="font-extrabold text-blue-400">
                        Trục +Z (Trục đứng)
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        Dựng thẳng đứng vuông góc mặt bàn tại góc O (Z = 0 → +0.85 m)
                      </div>
                    </div>
                  </div>

                  {/* Công tắc bật/tắt Hệ trục góc bàn & Lưới mặt bàn / Lưới không gian */}
                  <div className="pt-2 border-t border-[#233E68] space-y-2">
                    <div className="text-xs font-bold text-slate-200">
                      Điều khiển hiển thị Hệ trục Góc Bàn O-XYZ, Lưới trên bàn & Lưới không gian 3D:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        {
                          key: 'showWorldAxes' as const,
                          label: 'Trục X, Y (cạnh bàn) & Z (đứng)',
                        },
                        {
                          key: 'showOriginMarker' as const,
                          label: 'Gốc bàn cố định O(0,0,0)',
                        },
                        {
                          key: 'showFloorGrid' as const,
                          label: 'Lưới trên mặt bàn (XY)',
                        },
                        {
                          key: 'showSpaceGrid' as const,
                          label: 'Lưới không gian 3D (XZ/YZ)',
                        },
                        {
                          key: 'showMinorGrid' as const,
                          label: 'Lưới chi tiết 5 cm trên bàn',
                        },
                        {
                          key: 'showAxisLabels' as const,
                          label: 'Nhãn trục +X / +Y / +Z',
                        },
                        {
                          key: 'showNumericTicks' as const,
                          label: 'Vạch chia số dọc cạnh bàn',
                        },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex items-center gap-2 p-2 rounded-lg bg-[#0B1526] border border-[#233E68] cursor-pointer hover:border-[#00BCEB]"
                        >
                          <input
                            type="checkbox"
                            checked={coordSettings[item.key]}
                            onChange={(e) =>
                              onUpdateCoordSettings({
                                [item.key]: e.target.checked,
                              })
                            }
                            className="accent-[#00BCEB]"
                          />
                          <span className="font-semibold text-slate-200">
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-300 font-semibold">
                        Đơn vị hiển thị giao diện (Gốc lưu bằng mét):
                      </span>
                      <div className="flex items-center gap-1 bg-[#0B1526] p-1 rounded-lg border border-[#233E68]">
                        {(['m', 'cm', 'mm'] as const).map((u) => (
                          <button
                            key={u}
                            type="button"
                            onClick={() =>
                              onUpdateCoordSettings({ displayUnit: u })
                            }
                            className={`px-3 py-1 rounded text-xs font-extrabold cursor-pointer ${
                              coordSettings.displayUnit === u
                                ? 'bg-[#1E6BFF] text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata Bàn thực hành y = 0.82 m & Vùng đặt thiết bị */}
                <div className="bg-[#15243D] border border-[#28436C] rounded-xl p-4 space-y-2.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#22C55E]">
                    Bàn Thực Hành Chuẩn (`BENCH_SURFACE_Y = 0.82 m`) & Vùng Đặt Snap
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    Mọi thiết bị theo chuẩn <code className="text-[#00BCEB]">anchor: 'base-center'</code> có điểm thấp nhất tại <code className="text-[#00BCEB]">y = 0</code> cục bộ. Khi đặt lên mặt bàn thực hành, tọa độ thế giới được gán trực tiếp:
                    <div className="mt-1.5 p-2 rounded bg-[#0B1526] font-mono text-[11.5px] text-emerald-300 border border-emerald-500/30">
                      equipmentRoot.position.set(worldX, 0.82, worldZ)
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {placementSurfaces.map((surf) => (
                      <div
                        key={surf.surfaceId}
                        className="p-2.5 rounded-lg bg-[#0B1526] border border-[#233E68] text-xs flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-white">
                            {surf.surfaceNameVi}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            ID: {surf.surfaceId} · X: [{surf.bounds.minX}..{surf.bounds.maxX}m] · Z: [{surf.bounds.minZ}..{surf.bounds.maxZ}m]
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                          y = {surf.surfaceY.toFixed(2)} m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cột phải: Công cụ đọc tọa độ World/Local & Đo khoảng cách Euclid giữa 2 điểm A-B */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-[#15243D] border border-[#28436C] rounded-xl p-4 space-y-3">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#FACC15]">
                    Công Cụ Đọc Tọa Độ Thế Giới (`World`) & Cục Bộ (`Local`)
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B1526] border border-[#00BCEB] space-y-2">
                    <div className="text-xs font-bold text-[#00BCEB]">
                      Đang kiểm tra: {inspectedWorldPoint.label}
                    </div>
                    <div className="font-mono text-sm font-extrabold text-white">
                      World: X ={' '}
                      {formatLengthByUnit(
                        inspectedWorldPoint.worldM[0],
                        coordSettings.displayUnit,
                      )}
                      , Y ={' '}
                      {formatLengthByUnit(
                        inspectedWorldPoint.worldM[1],
                        coordSettings.displayUnit,
                      )}
                      , Z ={' '}
                      {formatLengthByUnit(
                        inspectedWorldPoint.worldM[2],
                        coordSettings.displayUnit,
                      )}
                    </div>
                    {inspectedWorldPoint.localBenchM && (
                      <div className="font-mono text-xs text-emerald-300">
                        Local (so với tâm mặt bàn y=0.82m): x ={' '}
                        {formatLengthByUnit(
                          inspectedWorldPoint.localBenchM[0],
                          coordSettings.displayUnit,
                        )}
                        , y ={' '}
                        {formatLengthByUnit(
                          inspectedWorldPoint.localBenchM[1],
                          coordSettings.displayUnit,
                        )}
                        , z ={' '}
                        {formatLengthByUnit(
                          inspectedWorldPoint.localBenchM[2],
                          coordSettings.displayUnit,
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-300">
                      Kiểm tra nhanh các điểm chuẩn nghiệm thu (Mục 4.3 & Mục 12):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Gốc O (0,0,0)', pt: [0, 0, 0] as [number, number, number] },
                        { label: 'Dịch +1m X (1,0,0)', pt: [1, 0, 0] as [number, number, number] },
                        { label: 'Dịch +1m Y (0,1,0)', pt: [0, 1, 0] as [number, number, number] },
                        { label: 'Dịch +1m Z (0,0,1)', pt: [0, 0, 1] as [number, number, number] },
                        {
                          label: 'Mặt bàn (0, 0.82, 0)',
                          pt: [0, BENCH_SURFACE_Y, 0] as [number, number, number],
                        },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() =>
                            onSelectCalibrationPoint(item.label, item.pt)
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-[#0B1526] hover:bg-[#1E6BFF] border border-[#28436C] text-xs font-mono font-bold text-slate-200 hover:text-white cursor-pointer transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Công cụ đo khoảng cách Euclid giữa 2 điểm A và B */}
                <div className="bg-[#15243D] border border-[#28436C] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#00BCEB] flex items-center gap-1.5">
                      <Ruler className="w-4 h-4" />
                      <span>Công Cụ Đo Khoảng Cách Euclid Giữa 2 Điểm A – B</span>
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Công cụ hình học World Space
                    </span>
                  </div>

                  {/* Chọn Điểm A */}
                  <div className="p-2.5 rounded-lg bg-[#0B1526] border border-[#233E68] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-amber-300">
                        Điểm A: {distancePointA.label}
                      </span>
                      <select
                        value=""
                        onChange={(e) => {
                          const idx = Number(e.target.value);
                          if (!Number.isNaN(idx) && presetPoints[idx]) {
                            onSetDistancePointA(presetPoints[idx]);
                          }
                        }}
                        className="bg-[#15243D] border border-[#28436C] rounded px-2 py-1 text-xs text-slate-200"
                      >
                        <option value="">-- Chọn nhanh Điểm A --</option>
                        {presetPoints.map((p, idx) => (
                          <option key={`pa-${idx}`} value={idx}>
                            {p.label} ({p.worldM.join(', ')} m)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['X', 'Y', 'Z'] as const).map((axis, aIdx) => (
                        <div key={axis} className="flex items-center gap-1">
                          <span className="text-xs font-mono text-slate-400">
                            {axis}A(m):
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            value={distancePointA.worldM[aIdx]}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              if (!Number.isNaN(v)) {
                                const next: [number, number, number] = [
                                  ...distancePointA.worldM,
                                ];
                                next[aIdx] = v;
                                onSetDistancePointA({
                                  label: 'Tọa độ nhập tay A',
                                  worldM: next,
                                });
                              }
                            }}
                            className="w-full bg-[#15243D] border border-[#28436C] rounded px-2 py-1 text-xs font-mono text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chọn Điểm B */}
                  <div className="p-2.5 rounded-lg bg-[#0B1526] border border-[#233E68] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-cyan-300">
                        Điểm B: {distancePointB.label}
                      </span>
                      <select
                        value=""
                        onChange={(e) => {
                          const idx = Number(e.target.value);
                          if (!Number.isNaN(idx) && presetPoints[idx]) {
                            onSetDistancePointB(presetPoints[idx]);
                          }
                        }}
                        className="bg-[#15243D] border border-[#28436C] rounded px-2 py-1 text-xs text-slate-200"
                      >
                        <option value="">-- Chọn nhanh Điểm B --</option>
                        {presetPoints.map((p, idx) => (
                          <option key={`pb-${idx}`} value={idx}>
                            {p.label} ({p.worldM.join(', ')} m)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['X', 'Y', 'Z'] as const).map((axis, aIdx) => (
                        <div key={axis} className="flex items-center gap-1">
                          <span className="text-xs font-mono text-slate-400">
                            {axis}B(m):
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            value={distancePointB.worldM[aIdx]}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              if (!Number.isNaN(v)) {
                                const next: [number, number, number] = [
                                  ...distancePointB.worldM,
                                ];
                                next[aIdx] = v;
                                onSetDistancePointB({
                                  label: 'Tọa độ nhập tay B',
                                  worldM: next,
                                });
                              }
                            }}
                            className="w-full bg-[#15243D] border border-[#28436C] rounded px-2 py-1 text-xs font-mono text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kết quả khoảng cách Euclid */}
                  <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 flex items-center justify-between">
                    <div className="text-xs text-emerald-200 font-mono">
                      d = √((xB-xA)² + (yB-yA)² + (zB-zA)²)
                    </div>
                    <div className="text-base font-mono font-extrabold text-emerald-300">
                      d = {formatLengthByUnit(euclideanDistM, coordSettings.displayUnit)}{' '}
                      <span className="text-xs text-slate-400">
                        ({euclideanDistM.toFixed(4)} m)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 13 BIẾN MÔI TRƯỜNG VẬT LÝ & BIẾN ĐỒ HỌA TÁCH BIỆT */}
          {activeTab === 'environment' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2 bg-[#15243D] border border-[#28436C] rounded-xl p-3.5">
                <div className="text-xs text-slate-200">
                  <span className="font-extrabold text-[#00BCEB]">
                    Quy tắc phụ thuộc môi trường (Mục 6 & 7):
                  </span>{' '}
                  Biến vật lý chỉ tác động đến các thiết bị có khai báo{' '}
                  <code className="text-emerald-300">environmentDependencies</code>{' '}
                  (ví dụ: <code className="text-amber-300">gravityMps2</code> đổi trọng lượng trên Lực kế lò xo <code className="text-amber-300">P = m·g</code>;{' '}
                  <code className="text-amber-300">airTemperatureC</code> đổi số đọc Nhiệt kế ngoài không khí;{' '}
                  <code className="text-amber-300">oxygenPct &lt; 14%</code> làm tắt ngọn lửa Đèn cồn). Không gán trực tiếp <code className="text-amber-300">illuminanceLux</code> vào intensity đèn Three.js.
                </div>
                <button
                  type="button"
                  onClick={onResetEnvVars}
                  className="px-3 py-1.5 rounded-lg bg-[#1E3A6D] hover:bg-[#2563EB] text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục 13 biến mặc định</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(Object.values(envVars) as EnvironmentVariableDefinition[]).map(
                  (v) => {
                    const dependentModules =
                      BUILTIN_ENVIRONMENT_AWARE_MODULES.filter((m) =>
                        m.environmentDependencies.some(
                          (d) => d.variableId === v.id,
                        ),
                      );
                    return (
                      <div
                        key={v.id}
                        className="p-3.5 rounded-xl bg-[#15243D] border border-[#28436C] flex flex-col justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-extrabold text-white">
                              {v.nameVi}
                            </span>
                            <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-[#0B1526] text-[#00BCEB] border border-[#00BCEB]/30">
                              {v.value} {v.unit}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            ID: {v.id} · Miền: [{v.min}…{v.max} {v.unit}] · Mặc định: {v.defaultValue}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={v.min}
                            max={v.max}
                            step={v.step}
                            value={v.value}
                            onChange={(e) =>
                              onUpdateEnvVar(v.id, Number(e.target.value))
                            }
                            className="flex-1 accent-[#00BCEB] cursor-pointer"
                          />
                          <input
                            type="number"
                            min={v.min}
                            max={v.max}
                            step={v.step}
                            value={v.value}
                            onChange={(e) => {
                              const num = Number(e.target.value);
                              if (!Number.isNaN(num)) {
                                onUpdateEnvVar(v.id, num);
                              }
                            }}
                            className="w-20 bg-[#0B1526] border border-[#28436C] rounded px-2 py-1 text-xs font-mono text-white text-right"
                          />
                        </div>

                        <div className="text-[11px] pt-1.5 border-t border-[#233E68]">
                          {dependentModules.length > 0 ? (
                            <span className="text-emerald-300 font-semibold">
                              ✓ Đang liên kết công thức:{' '}
                              {dependentModules.map((m) => m.moduleNameVi).join(', ')}
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              Điều kiện tác động: {v.activeWhenConditionVi} (Chưa có mô hình tác động trực tiếp trên bàn)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>

              {/* Biến đồ họa tách biệt (Mục 6.3) */}
              <div className="bg-[#15243D] border border-[#28436C] rounded-xl p-4 space-y-3">
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                  Biến Đồ Họa Tách Biệt (Mục 6.3 — Thay đổi đồ họa không làm sai lệch kết quả khoa học)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0B1526] border border-[#233E68] space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span>ambientLightStrength</span>
                      <span className="font-mono text-[#00BCEB]">
                        {graphicsSettings.ambientLightStrength.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.2}
                      max={2.0}
                      step={0.05}
                      value={graphicsSettings.ambientLightStrength}
                      onChange={(e) =>
                        onUpdateGraphicsSettings({
                          ambientLightStrength: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#00BCEB]"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0B1526] border border-[#233E68] space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span>keyLightStrength</span>
                      <span className="font-mono text-[#00BCEB]">
                        {graphicsSettings.keyLightStrength.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.4}
                      max={3.5}
                      step={0.1}
                      value={graphicsSettings.keyLightStrength}
                      onChange={(e) =>
                        onUpdateGraphicsSettings({
                          keyLightStrength: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#00BCEB]"
                    />
                  </div>

                  <label className="p-2.5 rounded-lg bg-[#0B1526] border border-[#233E68] flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={graphicsSettings.wallsTransparent}
                      onChange={(e) =>
                        onUpdateGraphicsSettings({
                          wallsTransparent: e.target.checked,
                        })
                      }
                      className="accent-[#00BCEB]"
                    />
                    <span className="font-semibold">
                      Làm mờ tường bao (`wallsTransparent`)
                    </span>
                  </label>

                  <label className="p-2.5 rounded-lg bg-[#0B1526] border border-[#233E68] flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={graphicsSettings.ceilingVisible}
                      onChange={(e) =>
                        onUpdateGraphicsSettings({
                          ceilingVisible: e.target.checked,
                        })
                      }
                      className="accent-[#00BCEB]"
                    />
                    <span className="font-semibold">
                      Hiển thị trần phòng y=3.6m (`ceilingVisible`)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HAI ĐỒNG HỒ ĐỘC LẬP (GIỜ THỰC VN & ĐỒNG HỒ MÔ PHỎNG) + NHẬT KÝ SỰ KIỆN */}
          {activeTab === 'clocks' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 space-y-4">
                {/* Đồng hồ thời gian thực */}
                <div className="bg-[#15243D] border border-[#28436C] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#00BCEB]">
                      1. Đồng Hồ Thời Gian Thực (`realClock`)
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      Giờ Việt Nam — Asia/Ho_Chi_Minh
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-white py-1">
                    {clockState.realClock.localDateTime}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    ISO UTC: {clockState.realClock.isoUtc}
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Độc lập 100% với nút Pause, Reset hay tua nhanh của đồng hồ mô phỏng.
                  </div>
                </div>

                {/* Đồng hồ thời gian mô phỏng */}
                <div className="bg-[#15243D] border border-[#28436C] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                      2. Đồng Hồ Thời Gian Mô Phỏng (`simulationClock`)
                    </span>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded ${
                        clockState.simulationClock.status === 'running'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : clockState.simulationClock.status === 'paused'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {clockState.simulationClock.status === 'running'
                        ? 'Đang chạy'
                        : clockState.simulationClock.status === 'paused'
                          ? 'Tạm dừng'
                          : 'Đã dừng'}
                      {clockState.simulationClock.speedMultiplier !== 1
                        ? ` (${clockState.simulationClock.speedMultiplier}×)`
                        : ''}
                    </span>
                  </div>

                  <div className="text-3xl font-mono font-extrabold text-[#FACC15] py-1">
                    {formatSimulationDuration(
                      clockState.simulationClock.elapsedSeconds,
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {clockState.simulationClock.status === 'stopped' && (
                      <button
                        type="button"
                        onClick={() => onSimClockAction('start')}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Bắt đầu</span>
                      </button>
                    )}
                    {clockState.simulationClock.status === 'running' && (
                      <button
                        type="button"
                        onClick={() => onSimClockAction('pause')}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        <span>Tạm dừng</span>
                      </button>
                    )}
                    {clockState.simulationClock.status === 'paused' && (
                      <button
                        type="button"
                        onClick={() => onSimClockAction('resume')}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Tiếp tục</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSimClockAction('reset')}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Đặt lại (00:00:00)</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#233E68] space-y-1.5">
                    <div className="text-xs font-bold text-slate-300">
                      Hệ số tốc độ mô phỏng (`speedMultiplier`):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SIMULATION_SPEED_OPTIONS.map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={() => onSimClockSpeed(spd)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-extrabold cursor-pointer ${
                            clockState.simulationClock.speedMultiplier === spd
                              ? 'bg-[#1E6BFF] text-white border border-[#00BCEB]'
                              : 'bg-[#0B1526] text-slate-300 border border-[#28436C] hover:text-white'
                          }`}
                        >
                          {spd}×
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nhật ký sự kiện có cả timestamp thực & thời gian mô phỏng */}
              <div className="lg:col-span-7 bg-[#15243D] border border-[#28436C] rounded-xl p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#00BCEB] flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    <span>
                      Nhật Ký Sự Kiện Khoa Học (`LabEventLog` — Giờ Thực VN + Thời Gian Mô Phỏng)
                    </span>
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    {eventLogs.length} bản ghi
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[340px] space-y-2 pr-1">
                  {eventLogs.map((log) => (
                    <div
                      key={log.eventId}
                      className="p-2.5 rounded-lg bg-[#0B1526] border border-[#233E68] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-mono font-bold text-[#00BCEB]">
                          [{log.eventType}]
                        </span>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300">
                            Sim: {formatSimulationDuration(log.simulationElapsedSeconds)}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                            Giờ VN: {log.localTimestamp}
                          </span>
                        </div>
                      </div>
                      <div className="text-slate-200 font-medium">
                        {log.summaryVi}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BẢNG KIỂM THỬ NGHIỆM THU MỤC 12 (PASS / FAIL / NOT TESTED) */}
          {activeTab === 'acceptance' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs text-slate-100">
                    <span className="font-extrabold text-emerald-300">
                      Báo cáo Kiểm thử Nghiệm thu Trực tiếp (Mục 12 `OL3D-LAB-ENVIRONMENT-SPEC v2.0`):
                    </span>{' '}
                    Tất cả các phép kiểm tra hình học XYZ, mặt bàn <code className="text-emerald-300">y = 0.82 m</code>, công thức khoảng cách Euclid, hai đồng hồ độc lập và phân tách dữ liệu vật lý/đồ họa đều được thực thi trực tiếp trên runtime.
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-mono text-xs font-extrabold">
                  {passCount} / {acceptanceResults.length} PASS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {acceptanceResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#15243D] border border-[#28436C] flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#00BCEB]">
                          [{item.id}]
                        </span>
                        <span className="text-xs font-extrabold text-white">
                          {item.titleVi}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-300">
                        {item.measuredDetail}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-extrabold shrink-0 ${
                        item.status === 'Pass'
                          ? 'bg-emerald-600 text-white'
                          : item.status === 'Fail'
                            ? 'bg-red-600 text-white'
                            : 'bg-amber-600 text-white'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
