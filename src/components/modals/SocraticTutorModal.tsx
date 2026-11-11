import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  HelpCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { cognitiveNeuralEngine, SocraticDialogState } from '../../domain/CognitiveNeuralEngine';
import { SocraticMisconception } from '../../domain/cognitiveTopology';
import { RichMathText } from '../common/MathFormula';

export const SocraticTutorModal: React.FC = () => {
  const [state, setState] = useState<SocraticDialogState>(cognitiveNeuralEngine.getSocraticState());
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; feedbackVi: string; actionVi: string } | null>(null);

  useEffect(() => {
    return cognitiveNeuralEngine.subscribe(() => {
      const cur = cognitiveNeuralEngine.getSocraticState();
      setState(cur);
      if (!cur.hasAnswered) {
        setFeedback(null);
      }
    });
  }, []);

  if (!state.isOpen || !state.activeMisconception) return null;

  const misconception: SocraticMisconception = state.activeMisconception;

  const handleSelectOption = (optId: string) => {
    const res = cognitiveNeuralEngine.answerSocraticQuestion(optId);
    setFeedback(res);
  };

  const handleClose = () => {
    cognitiveNeuralEngine.closeSocraticDialog();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/60 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Trợ Lý Nhận Thức Socrates</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
                  Phản Xạ An Toàn 3D
                </span>
              </div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-1.5 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                {misconception.hazardTitleVi}
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors"
            title="Đóng hội thoại"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Socratic Question Card */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex gap-3">
            <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
                Câu hỏi chẩn đoán tư duy:
              </p>
              <div className="text-sm font-medium text-slate-200 leading-relaxed">
                <RichMathText text={misconception.socraticQuestionVi} />
              </div>
            </div>
          </div>

          {/* Options list */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Chọn cách em hiểu về hiện tượng này:
            </p>
            {misconception.options.map((opt, idx) => {
              const isSelected = state.selectedOptionId === opt.id;
              const hasAnswered = state.hasAnswered;

              let btnStyle = 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-cyan-500/40 text-slate-200';
              if (isSelected) {
                btnStyle = opt.isCorrectUnderstanding
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 ring-1 ring-emerald-500/50'
                  : 'bg-rose-950/40 border-rose-500/60 text-rose-200 ring-1 ring-rose-500/50';
              } else if (hasAnswered && opt.isCorrectUnderstanding) {
                btnStyle = 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300/80';
              }

              return (
                <button
                  key={opt.id}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1 text-sm font-normal leading-relaxed">
                    <RichMathText text={opt.answerTextVi} />
                  </div>
                  {isSelected && (
                    opt.isCorrectUnderstanding
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      : <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Socratic Feedback Result */}
          {feedback && (
            <div className={`p-4 rounded-xl border animate-in slide-in-from-bottom-2 duration-300 ${
              feedback.isCorrect
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-100'
            }`}>
              <div className="flex items-start gap-3">
                {feedback.isCorrect ? (
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 flex-1">
                  <div className="text-sm font-medium leading-relaxed">
                    <RichMathText text={feedback.feedbackVi} />
                  </div>
                  <div className="pt-2 border-t border-slate-700/50 flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Hành động khắc phục: <RichMathText text={feedback.actionVi} className="inline font-normal text-slate-200" /></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scientific Insight Section */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 uppercase tracking-wider block">
              Góc nhìn Khoa học ViSEF & Sư phạm:
            </span>
            <div className="leading-relaxed text-slate-300">
              <RichMathText text={misconception.scientificInsightVi} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="italic">
            Phương pháp phản vấn Socrates — Tự học sinh nhận diện và khắc phục ngộ nhận tư duy.
          </span>
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
          >
            Đã hiểu & Tiếp tục thí nghiệm
          </button>
        </div>
      </div>
    </div>
  );
};
