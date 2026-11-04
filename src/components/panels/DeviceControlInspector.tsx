import React, { useState, useMemo } from 'react';
import { AssetDefinition, SceneInstance } from '../../domain/types';
import { deviceControlEngine } from '../../device-control/DeviceControlEngine';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  Activity,
  BookOpen,
} from 'lucide-react';

interface DeviceControlInspectorProps {
  selectedAsset: AssetDefinition;
  selectedInstance: SceneInstance;
  onUpdateInstanceState: (
    instanceId: string,
    patch: Partial<SceneInstance['instanceState']>,
  ) => void;
  isDarkMode?: boolean;
}

/**
 * Việt hóa nhãn trạng thái FSM để thân thiện, gần gũi với học sinh THCS
 */
function getFriendlyFsmState(fsmState?: string): string {
  if (!fsmState) return '';
  const map: Record<string, string> = {
    BALANCED_HORIZONTAL: 'Thăng bằng',
    TILTED_LEFT: 'Nghiêng trái',
    TILTED_RIGHT: 'Nghiêng phải',
    LEVELS_EQUALIZED: 'Mặt thoáng đồng mức',
    LEVELS_TILTING: 'Mặt thoáng nằm ngang',
    DC_VOLTAGE_ACTIVE: 'Đang đo điện áp DC',
    AC_VOLTAGE_ACTIVE: 'Đang đo điện áp AC',
    DC_CURRENT_ACTIVE: 'Đang đo dòng điện',
    RESISTANCE_ACTIVE: 'Đang đo điện trở',
    CONTINUITY_ACTIVE: 'Thông mạch (Buzzer)',
    POWER_OFF: 'Đang tắt',
    OUTPUT_ACTIVE: 'Đang cấp điện',
    OVERLOAD_PROTECTION: 'Quá tải (Tự ngắt)',
    IN_FOCUS: 'Lấy nét sắc nét',
    DEFOCUS_BLUR: 'Lệch tiêu cự (Mờ)',
    TOTAL_DEFOCUS: 'Mất nét hoàn toàn',
    CALIPER_READY: 'Sẵn sàng kẹp đo',
    MEASURING_SPECIMEN: 'Đang kẹp mẫu vật',
    ZERO_CALIBRATED: 'Đã chuẩn hóa Zero',
    TARED_ZERO: 'Đã trừ bì về 0',
    WEIGHING_ACTIVE: 'Đang cân',
  };
  return map[fsmState] || fsmState.replace(/_/g, ' ');
}

export const DeviceControlInspector: React.FC<DeviceControlInspectorProps> = ({
  selectedAsset,
  selectedInstance,
  onUpdateInstanceState,
}) => {
  const [activeHelpPartId, setActiveHelpPartId] = useState<string | null>(null);

  // Lấy Profile chuẩn của thiết bị từ Registry
  const profile = useMemo(() => {
    return (
      deviceControlEngine.getProfile(selectedAsset.assetId) ||
      deviceControlEngine.getProfile(selectedAsset.geometry.proceduralArchetype)
    );
  }, [selectedAsset.assetId, selectedAsset.geometry.proceduralArchetype]);

  // Trạng thái hiện tại của Instance
  const currentState = selectedInstance.instanceState as Record<string, any>;

  // Đánh giá đầu ra khoa học theo chu trình nhân quả
  const scientificOutputs = useMemo(() => {
    if (!profile) return {};
    return deviceControlEngine.evaluateOutputs(
      profile.deviceId,
      currentState,
    );
  }, [profile, currentState]);

  if (!profile) {
    return (
      <div className="p-3 rounded-xl bg-slate-900/40 border border-white/10 text-xs text-slate-300 backdrop-blur-md">
        Thiết bị chưa có bảng điều khiển chuyên biệt. Đang sử dụng điều khiển cơ bản.
      </div>
    );
  }

  // Handler cập nhật biến trạng thái
  const handlePartChange = (key: string, value: any) => {
    const nextState = {
      ...currentState,
      [key]: value,
    };
    // Tự động tính toán các trường đầu ra khoa học
    const nextOutputs = profile.evaluateOutputs
      ? profile.evaluateOutputs(nextState)
      : {};
    onUpdateInstanceState(selectedInstance.instanceId, {
      ...nextState,
      ...nextOutputs,
    });
  };

  const handleResetToDefault = () => {
    const def = { ...profile.initialState };
    const outputs = profile.evaluateOutputs ? profile.evaluateOutputs(def) : {};
    onUpdateInstanceState(selectedInstance.instanceId, {
      ...def,
      ...outputs,
    });
  };

  const friendlyFsm = getFriendlyFsmState(scientificOutputs.fsmState);

  return (
    <div className="space-y-2.5 relative select-none">
      {/* 1. HEADER PROFILE THIẾT BỊ — TINH GIẢN CHO HỌC SINH */}
      <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/15 backdrop-blur-md space-y-1.5 shadow-xs">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-[13.5px] font-black text-white truncate block">
              {profile.titleVi}
            </span>
            <div className="text-[10.5px] text-amber-300/90 font-medium flex items-center gap-1.5 mt-0.5">
              <BookOpen className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span className="truncate">{profile.curriculumLessonVi}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10.5px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 border border-white/10"
            title="Đưa thiết bị về trạng thái ban đầu"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>

      {/* 2. BẢNG THÔNG SỐ ĐO & KẾT QUẢ QUAN SÁT */}
      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/15 backdrop-blur-md space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Thông số đo & Kết quả</span>
          </span>
          {friendlyFsm && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-400/50">
              {friendlyFsm}
            </span>
          )}
        </div>

        {/* Danh sách outputs */}
        <div className="grid grid-cols-2 gap-1.5">
          {profile.outputs.map((out) => {
            const val =
              scientificOutputs[out.key] ??
              currentState[out.key] ??
              0;
            const displayVal =
              typeof val === 'number' && out.formatDecimals !== undefined
                ? val.toFixed(out.formatDecimals)
                : String(val);

            return (
              <div
                key={out.key}
                className="bg-slate-950/40 p-2 rounded-lg border border-white/10 flex flex-col justify-between"
              >
                <span className="text-slate-300 text-[10px] truncate font-medium">
                  {out.labelVi}:
                </span>
                <span className="text-[13px] font-mono font-black text-cyan-300 truncate mt-0.5">
                  {displayVal} {out.unit}
                </span>
              </div>
            );
          })}
        </div>

        {/* Phương trình MathType áp dụng */}
        {profile.equations.length > 0 && (
          <div className="p-2 rounded-lg bg-black/35 border border-white/10 space-y-1">
            <div className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
              <span>Công thức áp dụng:</span>
            </div>
            {profile.equations.map((eq) => (
              <div key={eq.id} className="text-[11px] font-mono text-amber-200">
                <span>${eq.latex}$</span>
                <span className="text-[10px] text-slate-300 block mt-0.5 font-sans">
                  → {eq.meaningVi}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. BẢNG THAO TÁC THỰC HÀNH (PARTS CONTROLS) */}
      <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/15 backdrop-blur-md space-y-2.5 shadow-xs">
        <div className="text-[11px] font-black uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          <span>Thao tác điều khiển</span>
        </div>

        <div className="space-y-2.5">
          {profile.parts.map((part) => {
            const currentVal = currentState[part.stateKey] ?? part.defaultValue ?? 0;

            return (
              <div
                key={part.partId}
                className="p-2 rounded-lg bg-slate-950/40 border border-white/10 space-y-1.5"
              >
                {/* Tiêu đề part + Nút help */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>{part.nameVi}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {part.limits?.unit && (
                      <span className="font-mono text-cyan-300 font-bold">
                        {typeof currentVal === 'number'
                          ? currentVal.toFixed(part.limits.step && part.limits.step < 1 ? 2 : 0)
                          : currentVal}{' '}
                        {part.limits.unit}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveHelpPartId((prev) =>
                          prev === part.partId ? null : part.partId,
                        )
                      }
                      onMouseEnter={() => setActiveHelpPartId(part.partId)}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        activeHelpPartId === part.partId
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'hover:bg-white/10 text-sky-400'
                      }`}
                      title="Xem hướng dẫn thao tác (Bấm hoặc Rê chuột)"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* CONTROLS THEO TỪNG LOẠI */}
                {part.controlType === 'slider' && part.limits && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const step = part.limits?.step ?? 1;
                        const min = part.limits?.min ?? 0;
                        const next = Math.max(min, Number((currentVal - step).toFixed(2)));
                        handlePartChange(part.stateKey, next);
                      }}
                      className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 font-bold text-xs text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min={part.limits.min}
                      max={part.limits.max}
                      step={part.limits.step ?? 1}
                      value={currentVal}
                      onChange={(e) =>
                        handlePartChange(part.stateKey, parseFloat(e.target.value))
                      }
                      className="flex-1 accent-[#38BDF8] h-1.5 bg-slate-700/60 rounded cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const step = part.limits?.step ?? 1;
                        const max = part.limits?.max ?? 100;
                        const next = Math.min(max, Number((currentVal + step).toFixed(2)));
                        handlePartChange(part.stateKey, next);
                      }}
                      className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 font-bold text-xs text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                )}

                {part.controlType === 'dial' && part.options && (
                  <select
                    value={currentVal}
                    onChange={(e) => handlePartChange(part.stateKey, e.target.value)}
                    className="w-full bg-slate-900/80 text-sky-200 text-xs rounded-lg px-2.5 py-1.5 font-bold border border-white/15 cursor-pointer backdrop-blur-sm"
                  >
                    {part.options.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {part.controlType === 'switch' && (
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[10.5px] text-slate-300">Trạng thái công tắc:</span>
                    <button
                      type="button"
                      onClick={() => handlePartChange(part.stateKey, !currentVal)}
                      className={`px-3 py-1 rounded-md text-xs font-black transition-colors cursor-pointer ${
                        currentVal
                          ? 'bg-emerald-500 text-slate-950 shadow-xs'
                          : 'bg-white/10 text-slate-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {currentVal ? 'ĐANG BẬT (ON)' : 'ĐANG TẮT (OFF)'}
                    </button>
                  </div>
                )}

                {part.controlType === 'button' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (part.stateKey === 'tareOffsetG') {
                        // TARE button
                        const gross = currentState.measuredMassG ?? 0;
                        handlePartChange('tareOffsetG', gross);
                      } else {
                        handlePartChange(part.stateKey, true);
                      }
                    }}
                    className="w-full py-1.5 px-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{part.nameVi}</span>
                  </button>
                )}

                {/* 5. GLASSMORPHISM HƯỚNG DẪN THỰC HÀNH GỌN GÀNG CHO HỌC SINH */}
                {activeHelpPartId === part.partId && (
                  <div className="mt-2 rounded-xl bg-[#0b1b36]/45 backdrop-blur-2xl border border-sky-400/30 shadow-[0_16px_48px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] text-white p-2.5 space-y-1.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-white/15 pb-1">
                      <span className="text-[11.5px] font-black text-sky-300">
                        Hướng dẫn: {part.nameVi}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveHelpPartId(null)}
                        className="text-[10px] text-slate-300 hover:text-white px-1.5 py-0.5 rounded bg-white/10 border border-white/10 cursor-pointer"
                      >
                        ✕ Đóng
                      </button>
                    </div>

                    <div className="space-y-1 text-[10px]">
                      <div className="bg-white/[0.07] backdrop-blur-md p-1.5 rounded-lg border border-white/15 text-slate-200">
                        <strong className="text-sky-300 block mb-0.5">🎯 Cách thực hiện:</strong>
                        <span>{part.help.operationGuideVi}</span>
                      </div>

                      <div className="bg-emerald-500/10 backdrop-blur-md p-1.5 rounded-lg border border-emerald-400/25 text-emerald-200">
                        <strong className="text-emerald-300 block mb-0.5">👁️ Hiện tượng quan sát:</strong>
                        <span>{part.help.expectedFeedbackVi}</span>
                      </div>

                      {part.help.commonErrorsVi && (
                        <div className="bg-rose-500/10 backdrop-blur-md p-1.5 rounded-lg border border-rose-400/25 text-rose-200">
                          <strong className="text-rose-300 block mb-0.5">⚠️ Lưu ý tránh lỗi:</strong>
                          <span>{part.help.commonErrorsVi}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. QUY TẮC AN TOÀN THỰC HÀNH */}
      {profile.safetyRules.length > 0 && (
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/25 backdrop-blur-md space-y-1">
          <div className="text-[10.5px] font-extrabold text-amber-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Lưu ý An toàn Thí nghiệm:</span>
          </div>
          <ul className="text-[10px] text-amber-200/90 space-y-0.5 list-disc list-inside">
            {profile.safetyRules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
