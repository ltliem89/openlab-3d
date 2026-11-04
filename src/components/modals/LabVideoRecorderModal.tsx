import React, { useState, useRef } from 'react';
import {
  LabRecordingSession,
  RecordedStepMilestone,
  formatRecTime,
  generateExperimentSummaryVideo,
} from '../../three-runtime/LabVideoRecorderEngine';
import {
  X,
  Video,
  Download,
  Film,
  Clock,
  CheckCircle2,
  Sparkles,
  FileText,
  Trash2,
  Plus,
  RefreshCw,
} from 'lucide-react';

interface LabVideoRecorderModalProps {
  session: LabRecordingSession;
  onClose: () => void;
  onUpdateMilestoneTitle: (milestoneId: string, newTitle: string) => void;
  onDeleteMilestone: (milestoneId: string) => void;
  onSaveSummaryVideoToSession: (blob: Blob, url: string) => void;
  onStartNewRecording: () => void;
  onNotify: (
    message: string,
    tone?: 'info' | 'success' | 'warning' | 'error',
  ) => void;
}

export const LabVideoRecorderModal: React.FC<LabVideoRecorderModalProps> = ({
  session,
  onClose,
  onUpdateMilestoneTitle,
  onDeleteMilestone,
  onSaveSummaryVideoToSession,
  onStartNewRecording,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<'full-video' | 'summary-video'>(
    session.summaryVideoUrl ? 'summary-video' : 'full-video',
  );
  const [isGeneratingSummary, setIsGeneratingSummary] =
    useState<boolean>(false);
  const [summaryProgress, setSummaryProgress] = useState<number>(0);
  const [summaryStatusText, setSummaryStatusText] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  const fullVideoRef = useRef<HTMLVideoElement | null>(null);
  const summaryVideoRef = useRef<HTMLVideoElement | null>(null);

  const handleSeekToMilestone = (ms: RecordedStepMilestone) => {
    setActiveTab('full-video');
    setTimeout(() => {
      if (fullVideoRef.current) {
        fullVideoRef.current.currentTime = Math.max(0, ms.elapsedSec);
        fullVideoRef.current.play().catch(() => {});
      }
    }, 60);
  };

  const handleDownloadFullVideo = () => {
    if (!session.videoUrl) return;
    const link = document.createElement('a');
    link.href = session.videoUrl;
    const safeName = session.experimentTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '');
    link.download = `openlab3d-thuc-hanh-${safeName || 'khtn9'}-${Date.now()}.${session.fileExtension}`;
    link.click();
    onNotify(
      `Đã tải xuống Video ghi hình thực hành (.${session.fileExtension}).`,
      'success',
    );
  };

  const handleGenerateSummaryReel = async () => {
    if (isGeneratingSummary) return;
    if (session.milestones.length === 0) {
      onNotify(
        'Chưa có bước thực hành nào để tổng hợp. Hãy giữ ít nhất 1 bước trong danh sách.',
        'warning',
      );
      return;
    }

    try {
      setIsGeneratingSummary(true);
      setActiveTab('summary-video');
      setSummaryProgress(5);
      setSummaryStatusText('Khởi tạo bộ dựng Video Tóm Tắt Quá Trình...');

      const result = await generateExperimentSummaryVideo({
        session,
        onProgress: (pct, txt) => {
          setSummaryProgress(pct);
          setSummaryStatusText(txt);
        },
      });

      onSaveSummaryVideoToSession(result.blob, result.url);
      setIsGeneratingSummary(false);
      onNotify(
        'Đã tạo thành công Video Tóm Tắt Quá Trình Thực Hành! Bạn có thể xem lại hoặc tải về máy.',
        'success',
      );
    } catch (err) {
      setIsGeneratingSummary(false);
      onNotify(
        `Không thể tạo video tóm tắt: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`,
        'error',
      );
    }
  };

  const handleDownloadSummaryVideo = () => {
    if (!session.summaryVideoUrl) return;
    const link = document.createElement('a');
    link.href = session.summaryVideoUrl;
    const safeName = session.experimentTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '');
    link.download = `openlab3d-video-tom-tat-${safeName || 'khtn9'}-${Date.now()}.${session.fileExtension}`;
    link.click();
    onNotify(
      `Đã tải xuống Video Tóm Tắt Quá Trình Thực Hành (.${session.fileExtension}).`,
      'success',
    );
  };

  const handleExportHtmlReport = () => {
    const stepsHtml = session.milestones
      .map(
        (m) => `
      <div style="border:1px solid #28436C;border-radius:12px;padding:16px;margin-bottom:16px;background:#13223C;display:flex;gap:16px;align-items:center;">
        ${
          m.thumbnailDataUrl
            ? `<img src="${m.thumbnailDataUrl}" alt="Bước ${m.stepNumber}" style="width:280px;height:158px;object-fit:cover;border-radius:8px;border:1px solid #00BCEB;" />`
            : ''
        }
        <div style="flex:1;">
          <div style="color:#00BCEB;font-weight:800;font-size:13px;font-family:monospace;">
            BƯỚC ${m.stepNumber} · Mốc video: ${formatRecTime(m.elapsedSec)} · Giờ thực VN: ${m.realTimeVn}
          </div>
          <h3 style="margin:6px 0;color:#FACC15;font-size:18px;">${m.title}</h3>
          <div style="margin-top:8px;padding:8px 12px;background:#08152C;border-left:3px solid #14B8A6;color:#5EEAD4;font-family:monospace;font-size:14px;">
            <strong>Số liệu đo & Hiện tượng:</strong> ${m.measurementsSummary}
          </div>
        </div>
      </div>`,
      )
      .join('\n');

    const htmlDoc = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Báo Cáo Thực Hành KHTN 9 — ${session.experimentTitle}</title>
</head>
<body style="background:#0B1526;color:#F1F5F9;font-family:system-ui,-apple-system,sans-serif;padding:32px;max-width:980px;margin:0 auto;">
  <div style="border:2px solid #00BCEB;border-radius:14px;padding:24px;background:#0F1A2E;">
    <div style="color:#00BCEB;font-weight:800;font-size:13px;letter-spacing:1px;">OPENLAB 3D — HỒ SƠ THỰC HÀNH KHOA HỌC TỰ NHIÊN 9</div>
    <h1 style="margin:8px 0 6px;color:#FFFFFF;font-size:26px;">${session.experimentTitle}</h1>
    <p style="margin:0 0 20px;color:#93C5FD;font-family:monospace;font-size:14px;">
      Thời điểm bắt đầu: ${session.startedAtVn} &nbsp;|&nbsp; Tổng thời lượng ghi hình: ${formatRecTime(session.durationSec)} &nbsp;|&nbsp; Tổng số bước lưu: ${session.milestones.length}
    </p>
    <hr style="border:0;border-top:1px solid #28436C;margin:16px 0 24px;" />
    <h2 style="color:#4ADE80;font-size:18px;margin-bottom:14px;">NHẬT KÝ HÌNH ẢNH & SỐ LIỆU CÁC BƯỚC THỰC HÀNH</h2>
    ${stepsHtml}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-thuc-hanh-khtn9-${Date.now()}.html`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    onNotify(
      'Đã xuất Phiếu Báo Cáo Thực Hành KHTN 9 kèm ảnh chụp & số liệu từng bước (.html).',
      'success',
    );
  };

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
            <div className="w-9 h-9 rounded-lg bg-red-500/25 border border-red-400 flex items-center justify-center">
              <Video className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-400/40">
                  STUDIO GHI HÌNH & TÓM TẮT THỰC HÀNH 3D
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#00BCEB]/20 text-[#00BCEB] border border-[#00BCEB]/40">
                  Thời lượng: {formatRecTime(session.durationSec)} ·{' '}
                  {session.milestones.length} bước thực hành
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                {session.experimentTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartNewRecording();
              }}
              className="px-3 py-1.5 rounded-lg bg-[#17335E] hover:bg-red-600 border border-red-400/60 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Bắt đầu phiên ghi hình thực hành mới"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ghi hình mới</span>
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
        <div className="px-5 pt-2.5 bg-[#13223C] border-b border-[#233E68] flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('full-video')}
              className={`px-4 py-2 text-xs font-extrabold rounded-t-lg border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'full-video'
                  ? 'bg-[#0F1A2E] text-[#00BCEB] border-[#00BCEB]'
                  : 'text-slate-300 border-transparent hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>
                1. Video Ghi Hình Toàn Bộ ({formatRecTime(session.durationSec)})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('summary-video')}
              className={`px-4 py-2 text-xs font-extrabold rounded-t-lg border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === 'summary-video'
                  ? 'bg-[#0F1A2E] text-[#FACC15] border-[#FACC15]'
                  : 'text-slate-300 border-transparent hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#FACC15]" />
              <span>
                2. Xuất Video Tóm Tắt Quá Trình ({session.milestones.length} bước)
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-1.5">
            <button
              type="button"
              onClick={handleExportHtmlReport}
              className="px-3 py-1.5 rounded-lg bg-[#15243D] hover:bg-[#1E3454] border border-[#38BDF8]/60 text-xs font-bold text-[#7DD3FC] flex items-center gap-1.5 cursor-pointer"
              title="Tải xuống Phiếu Báo Cáo Thực Hành (.html) có ảnh chụp 3D và số liệu từng bước"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Xuất Phiếu Báo Cáo (.HTML)</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Cột Trái (7 cột): Trình phát Video & Nút Xuất Video */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {activeTab === 'full-video' ? (
              <div className="bg-[#15243D] border border-[#28436C] rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Film className="w-4 h-4 text-[#00BCEB]" />
                      <span>Bản Ghi Hình Trực Tiếp Khung Nhìn 3D</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Nhấn vào bất kỳ bước thực hành nào ở cột bên phải để tua
                      video đến đúng thời điểm thao tác đó.
                    </p>
                  </div>
                  {session.videoUrl && (
                    <button
                      type="button"
                      onClick={handleDownloadFullVideo}
                      className="px-3.5 py-2 rounded-lg bg-[#1E6BFF] hover:bg-[#1557D8] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        Tải Video Đầy Đủ (.{session.fileExtension.toUpperCase()})
                      </span>
                    </button>
                  )}
                </div>

                <div className="relative w-full aspect-video bg-[#08101E] rounded-lg overflow-hidden border border-[#233E68] flex items-center justify-center">
                  {session.videoUrl ? (
                    <video
                      ref={fullVideoRef}
                      src={session.videoUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-6 text-slate-400 text-xs">
                      Chưa có luồng video đầy đủ. Bạn vẫn có thể tổng hợp Video
                      Tóm Tắt từ các bước thực hành đã lưu!
                    </div>
                  )}
                </div>

                {/* Nút chuyển nhanh sang Tạo Video Tóm Tắt Quá Trình */}
                <div className="p-3.5 rounded-xl bg-[#0B192C] border border-[#FACC15]/50 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-extrabold text-[#FACC15] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>
                        Cần nộp báo cáo ngắn gọn cho Giáo viên?
                      </span>
                    </div>
                    <div className="text-[11.5px] text-slate-300">
                      Hệ thống sẽ tự động ghép tiêu đề bài học, ảnh 3D của{' '}
                      <strong>{session.milestones.length} bước thực hành</strong>{' '}
                      kèm số liệu đo và bảng tổng kết thành 1 video tóm tắt súc
                      tích.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateSummaryReel}
                    disabled={isGeneratingSummary}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#08152C] text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Xuất Video Tóm Tắt Quá Trình</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#15243D] border border-[#28436C] rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#FACC15] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FACC15]" />
                      <span>
                        Video Tóm Tắt Quá Trình Thực Hành (Summary Reel)
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Tổng hợp tự động gồm: Màn hình Mở đầu + Trình chiếu từng
                      Bước kèm Số liệu đo + Bảng Tổng Kết.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateSummaryReel}
                      disabled={isGeneratingSummary}
                      className="px-3 py-2 rounded-lg bg-[#17335E] hover:bg-[#1E6BFF] border border-[#00BCEB] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${
                          isGeneratingSummary ? 'animate-spin' : ''
                        }`}
                      />
                      <span>
                        {session.summaryVideoUrl
                          ? 'Dựng lại Video Tóm Tắt'
                          : 'Tạo Video Tóm Tắt'}
                      </span>
                    </button>

                    {session.summaryVideoUrl && !isGeneratingSummary && (
                      <button
                        type="button"
                        onClick={handleDownloadSummaryVideo}
                        className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#08152C] text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>
                          Tải Video Tóm Tắt (.
                          {session.fileExtension.toUpperCase()})
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative w-full aspect-video bg-[#08101E] rounded-lg overflow-hidden border border-[#233E68] flex items-center justify-center">
                  {isGeneratingSummary ? (
                    <div className="p-8 text-center space-y-3 max-w-md">
                      <RefreshCw className="w-8 h-8 text-[#FACC15] animate-spin mx-auto" />
                      <div className="text-sm font-extrabold text-white">
                        {summaryStatusText ||
                          'Đang kết xuất Video Tóm Tắt Quá Trình...'}
                      </div>
                      <div className="w-full h-2.5 bg-[#15243D] rounded-full overflow-hidden border border-[#28436C]">
                        <div
                          style={{ width: `${summaryProgress}%` }}
                          className="h-full bg-gradient-to-r from-[#00BCEB] to-[#22C55E] transition-all duration-150"
                        />
                      </div>
                      <div className="text-xs font-mono text-[#67E8F9]">
                        Tiến độ kết xuất HD 1280×720: {summaryProgress}%
                      </div>
                    </div>
                  ) : session.summaryVideoUrl ? (
                    <video
                      ref={summaryVideoRef}
                      src={session.summaryVideoUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="p-8 text-center space-y-3 max-w-md">
                      <Sparkles className="w-10 h-10 text-[#FACC15] mx-auto opacity-80" />
                      <div className="text-sm font-bold text-white">
                        Sẵn sàng kết xuất Video Tóm Tắt từ{' '}
                        {session.milestones.length} bước thực hành đã lưu
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Bạn có thể chỉnh sửa tên bước thực hành ở danh sách bên
                        phải trước khi nhấn nút tạo video tóm tắt.
                      </p>
                      <button
                        type="button"
                        onClick={handleGenerateSummaryReel}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#08152C] text-xs font-extrabold inline-flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Bắt Đầu Tạo Video Tóm Tắt Ngay</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cột Phải (5 cột): Dòng thời gian các Bước thực hành đã lưu */}
          <div className="lg:col-span-5 flex flex-col bg-[#15243D] border border-[#28436C] rounded-xl p-4 max-h-[68vh]">
            <div className="flex items-center justify-between pb-3 border-b border-[#233E68]">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#00BCEB] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  <span>
                    Các Bước Thực Hành Đã Lưu ({session.milestones.length})
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Tự động chụp khi thao tác dụng cụ hoặc khi nhấn nút &ldquo;+
                  Lưu bước&rdquo;.
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 mt-3 pr-1">
              {session.milestones.map((ms) => (
                <div
                  key={ms.id}
                  className="p-2.5 rounded-xl bg-[#0B1526] border border-[#233E68] hover:border-[#00BCEB] transition-colors flex gap-3 items-start group"
                >
                  {/* Ảnh chụp Thumbnail của bước */}
                  <button
                    type="button"
                    onClick={() => handleSeekToMilestone(ms)}
                    className="relative w-28 h-16 rounded-lg overflow-hidden border border-[#28436C] shrink-0 bg-[#132238] cursor-pointer"
                    title="Nhấn để phát video tại đúng mốc thời gian của bước này"
                  >
                    {ms.thumbnailDataUrl ? (
                      <img
                        src={ms.thumbnailDataUrl}
                        alt={ms.title}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#08152C]/90 text-[#FACC15] font-mono text-[10px] font-bold">
                      {formatRecTime(ms.elapsedSec)}
                    </span>
                  </button>

                  {/* Nội dung bước & Số liệu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10.5px] font-mono font-extrabold text-[#00BCEB]">
                        BƯỚC {ms.stepNumber} · {ms.realTimeVn}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(ms.id);
                            setEditingText(ms.title);
                          }}
                          className="text-[10.5px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-[#15243D] cursor-pointer"
                        >
                          Sửa tên
                        </button>
                        {session.milestones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onDeleteMilestone(ms.id)}
                            className="p-1 text-slate-400 hover:text-red-400 cursor-pointer"
                            title="Xóa bước này khỏi video tóm tắt"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {editingId === ms.id ? (
                      <div className="mt-1 flex items-center gap-1">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 bg-[#15243D] border border-[#00BCEB] rounded px-2 py-1 text-xs text-white outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (editingText.trim()) {
                              onUpdateMilestoneTitle(ms.id, editingText.trim());
                            }
                            setEditingId(null);
                          }}
                          className="px-2 py-1 rounded bg-[#1E6BFF] text-white text-[11px] font-bold cursor-pointer"
                        >
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSeekToMilestone(ms)}
                        className="text-left text-xs font-bold text-white hover:text-[#FACC15] line-clamp-2 mt-0.5 cursor-pointer"
                      >
                        {ms.title}
                      </button>
                    )}

                    <div className="mt-1 px-2 py-1 rounded bg-[#051C18] border border-[#14B8A6]/40 font-mono text-[11px] text-[#5EEAD4] truncate">
                      {ms.measurementsSummary}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
