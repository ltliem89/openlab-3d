/**
 * Vòng 5 (A) — Card hành động tiếp theo (thí điểm WF-08).
 *
 * Card DOM duy nhất của mạng chỉ dẫn: hiện "Bước k/3" + động từ hành động +
 * 1 dòng hướng dẫn, lấy từ experimentWorkflowEngine.getARNeuralRecommendation.
 * Nhãn lấy từ reasonVi của guard, không tính số mới. Tối đa 3 nhãn trong mọi
 * trường hợp (card này chỉ có 2 dòng nội dung + 1 hint khi kẹt).
 *
 * Hint chỉ xuất hiện khi người học kẹt (fail liên tiếp ≥ 3 lần hoặc fail liên
 * tục ≥ 30 s) — do LabViewport3D quyết định, card chỉ hiển thị.
 */
import React from 'react';

export interface GuideNextAction {
  stepIndex: number;
  totalSteps: number;
  titleVi: string;
  actionVerbVi: string;
  instructionVi: string;
  /** 1 hint duy nhất, chỉ khi kẹt; null = chưa tới ngưỡng. */
  hintVi?: string | null;
  isCompleted?: boolean;
}

export function GuideNextActionCard({ action }: { action: GuideNextAction | null }) {
  if (!action) return null;

  if (action.isCompleted) {
    return (
      <div
        className="w-[300px] rounded-xl bg-[#061122]/92 backdrop-blur-xl border border-emerald-400/60 px-3 py-2.5 shadow-xl text-left"
        role="status"
        aria-label="Đã hoàn thành bài thí nghiệm"
      >
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
          ✓ Đã hoàn thành WF-08
        </div>
        <div className="text-xs text-slate-100 font-semibold mt-0.5">
          Đòn bẩy đã thăng bằng — mô-men hai phía bằng nhau.
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-[300px] rounded-xl bg-[#061122]/92 backdrop-blur-xl border border-cyan-400/50 px-3 py-2.5 shadow-xl text-left"
      role="status"
      aria-label={`Hướng dẫn bước ${action.stepIndex} trên ${action.totalSteps}`}
    >
      <div className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-300">
        Bước {action.stepIndex}/{action.totalSteps} · {action.titleVi}
      </div>
      <div className="text-[13px] text-white font-bold leading-snug mt-1">
        {action.actionVerbVi}
      </div>
      <div className="text-xs text-slate-300 leading-snug mt-0.5">{action.instructionVi}</div>
      {action.hintVi ? (
        <div className="text-xs text-amber-300 leading-snug mt-1.5 border-t border-white/15 pt-1.5">
          💡 Gợi ý: {action.hintVi}
        </div>
      ) : null}
    </div>
  );
}
