import * as THREE from 'three';

export interface RecordedStepMilestone {
  id: string;
  stepNumber: number;
  elapsedSec: number;
  realTimeVn: string;
  title: string;
  measurementsSummary: string;
  thumbnailDataUrl: string;
}

export interface LabLiveMeasurementChip {
  label: string;
  valueText: string;
  isHighlight?: boolean;
}

export interface LabRecordingSession {
  sessionId: string;
  experimentTitle: string;
  startedAtVn: string;
  durationSec: number;
  videoBlob: Blob | null;
  videoUrl: string | null;
  summaryVideoBlob?: Blob | null;
  summaryVideoUrl?: string | null;
  mimeType: string;
  fileExtension: 'webm' | 'mp4';
  milestones: RecordedStepMilestone[];
}

export function getSupportedVideoMimeType(): {
  mimeType: string;
  fileExtension: 'webm' | 'mp4';
} {
  if (typeof MediaRecorder === 'undefined') {
    return { mimeType: 'video/webm', fileExtension: 'webm' };
  }
  const candidates: Array<{ mimeType: string; fileExtension: 'webm' | 'mp4' }> = [
    { mimeType: 'video/webm;codecs=vp9', fileExtension: 'webm' },
    { mimeType: 'video/webm;codecs=vp8', fileExtension: 'webm' },
    { mimeType: 'video/webm', fileExtension: 'webm' },
    { mimeType: 'video/mp4', fileExtension: 'mp4' },
  ];
  for (const c of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(c.mimeType)) {
        return c;
      }
    } catch {
      // Ignore
    }
  }
  return { mimeType: '', fileExtension: 'webm' };
}

export function formatRecTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mm = String(Math.floor(safe / 60)).padStart(2, '0');
  const ss = String(safe % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

/**
 * Vẽ 1 khung hình tổng hợp (Composite Frame) gồm:
 * - Hình ảnh 3D trực tiếp từ WebGLRenderer
 * - Băng thông tin Thí nghiệm KHTN 9 ở cạnh trên (Tên bài, Thời gian thực VN, Đồng hồ ghi hình)
 * - Băng thông số dụng cụ đo ở cạnh dưới (Cân điện tử, Ống đong, Bình tràn, Nhiệt kế...)
 * - Thông báo Bước thực hành vừa thực hiện (nếu trong vòng 3.5 giây kể từ khi đánh dấu mốc)
 */
export function drawCompositeRecordingFrame(params: {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  webglCanvas: HTMLCanvasElement;
  experimentTitle: string;
  realTimeVn: string;
  simTimeText: string;
  recordingElapsedSec: number;
  currentStepHint?: string;
  liveChips: LabLiveMeasurementChip[];
  recentMilestone?: {
    stepNumber: number;
    title: string;
    triggeredAtElapsedSec: number;
  } | null;
  includeHudOverlay: boolean;
}): void {
  const {
    ctx,
    width,
    height,
    webglCanvas,
    experimentTitle,
    realTimeVn,
    simTimeText,
    recordingElapsedSec,
    currentStepHint,
    liveChips,
    recentMilestone,
    includeHudOverlay,
  } = params;

  // 1. Nền tối phòng lab & vẽ khung hình 3D WebGL
  ctx.fillStyle = '#121E30';
  ctx.fillRect(0, 0, width, height);
  try {
    ctx.drawImage(webglCanvas, 0, 0, width, height);
  } catch {
    // Ignore transient context resize
  }

  if (!includeHudOverlay) return;

  // 2. Băng tiêu đề phía trên (Top Telemetry Bar)
  const topBarH = 48;
  const topGrad = ctx.createLinearGradient(0, 0, 0, topBarH);
  topGrad.addColorStop(0, 'rgba(8, 21, 44, 0.92)');
  topGrad.addColorStop(1, 'rgba(11, 32, 64, 0.80)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, topBarH);

  ctx.strokeStyle = 'rgba(0, 188, 235, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, topBarH);
  ctx.lineTo(width, topBarH);
  ctx.stroke();

  // Huy hiệu REC đỏ nhấp nháy
  const pulseOn = Math.floor(recordingElapsedSec * 2) % 2 === 0;
  ctx.fillStyle = pulseOn ? '#EF4444' : '#991B1B';
  ctx.beginPath();
  ctx.arc(24, 24, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 14px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillStyle = '#FCA5A5';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`REC ${formatRecTime(recordingElapsedSec)}`, 38, 24);

  // Tên bài thí nghiệm
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`OPENLAB KHTN 9 · ${experimentTitle}`, 136, 24);

  // Đồng hồ góc trên phải
  ctx.font = 'bold 13px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillStyle = '#67E8F9';
  ctx.textAlign = 'right';
  ctx.fillText(`VN: ${realTimeVn}  |  Sim: ${simTimeText}`, width - 18, 24);

  // 3. Nếu có mốc bước thực hành vừa được kích hoạt trong vòng 3.5 giây -> Hiện Banner nổi bật
  if (
    recentMilestone &&
    recordingElapsedSec - recentMilestone.triggeredAtElapsedSec <= 3.5 &&
    recordingElapsedSec >= recentMilestone.triggeredAtElapsedSec
  ) {
    const bannerW = Math.min(width - 80, 680);
    const bannerH = 44;
    const bx = (width - bannerW) / 2;
    const by = topBarH + 14;

    ctx.fillStyle = 'rgba(11, 58, 125, 0.94)';
    ctx.beginPath();
    ctx.roundRect(bx, by, bannerW, bannerH, 10);
    ctx.fill();

    ctx.strokeStyle = '#00BCEB';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#FACC15';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const bannerText = `★ BƯỚC ${recentMilestone.stepNumber}: ${recentMilestone.title}`;
    ctx.fillText(
      bannerText.length > 76 ? `${bannerText.slice(0, 73)}...` : bannerText,
      width / 2,
      by + bannerH / 2,
    );
  }

  // 4. Băng thông số dụng cụ đo ở cạnh dưới (Bottom Scientific Readout Strip)
  const bottomBarH = 54;
  const by0 = height - bottomBarH;
  const botGrad = ctx.createLinearGradient(0, by0, 0, height);
  botGrad.addColorStop(0, 'rgba(8, 21, 44, 0.82)');
  botGrad.addColorStop(1, 'rgba(6, 15, 32, 0.95)');
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, by0, width, bottomBarH);

  ctx.strokeStyle = 'rgba(0, 188, 235, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, by0);
  ctx.lineTo(width, by0);
  ctx.stroke();

  // Vẽ các chip thông số đo trực tiếp
  let curX = 16;
  const chipY = by0 + 11;
  const chipH = 32;

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  for (const chip of liveChips.slice(0, 6)) {
    const labelStr = `${chip.label}: `;
    const valStr = chip.valueText;
    ctx.font = '600 12.5px system-ui, -apple-system, sans-serif';
    const wLabel = ctx.measureText(labelStr).width;
    ctx.font = 'bold 13.5px ui-monospace, SFMono-Regular, Menlo, monospace';
    const wVal = ctx.measureText(valStr).width;
    const boxW = Math.ceil(wLabel + wVal + 22);

    if (curX + boxW > width - 16) break;

    ctx.fillStyle = chip.isHighlight
      ? 'rgba(5, 28, 24, 0.95)'
      : 'rgba(21, 36, 61, 0.92)';
    ctx.beginPath();
    ctx.roundRect(curX, chipY, boxW, chipH, 7);
    ctx.fill();

    ctx.strokeStyle = chip.isHighlight ? '#14B8A6' : '#334E73';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.font = '600 12.5px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText(labelStr, curX + 10, chipY + chipH / 2);

    ctx.font = 'bold 13.5px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = chip.isHighlight ? '#5EEAD4' : '#38BDF8';
    ctx.fillText(valStr, curX + 10 + wLabel, chipY + chipH / 2);

    curX += boxW + 10;
  }

  // Nếu có gợi ý bước thực hành hiện tại ở góc dưới phải
  if (currentStepHint && curX < width - 220) {
    ctx.font = '600 12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#93C5FD';
    ctx.textAlign = 'right';
    const maxHintChars = 48;
    const cleanHint =
      currentStepHint.length > maxHintChars
        ? `${currentStepHint.slice(0, maxHintChars - 3)}...`
        : currentStepHint;
    ctx.fillText(cleanHint, width - 16, chipY + chipH / 2);
  }
}

/**
 * Chụp nhanh 1 ảnh Thumbnail (JPEG DataURL) từ khung hình 3D hiện tại kèm thông số để lưu vào Bước thực hành
 */
export function captureMilestoneThumbnail(params: {
  webglCanvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
  experimentTitle: string;
  stepNumber: number;
  stepTitle: string;
  measurementsSummary: string;
  elapsedSec: number;
}): string {
  const {
    webglCanvas,
    renderer,
    scene,
    camera,
    experimentTitle,
    stepNumber,
    stepTitle,
    measurementsSummary,
    elapsedSec,
  } = params;

  renderer.render(scene, camera);

  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = 960;
  thumbCanvas.height = 540;
  const ctx = thumbCanvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#0F1A2E';
  ctx.fillRect(0, 0, 960, 540);
  try {
    ctx.drawImage(webglCanvas, 0, 0, 960, 540);
  } catch {
    // Ignore
  }

  // Header strip trên ảnh chụp bước thực hành
  ctx.fillStyle = 'rgba(8, 21, 44, 0.88)';
  ctx.fillRect(0, 0, 960, 42);
  ctx.fillStyle = '#00BCEB';
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    `BƯỚC ${stepNumber} (${formatRecTime(elapsedSec)}) — ${experimentTitle}`,
    16,
    21,
  );

  // Footer strip hiển thị thao tác và kết quả đo
  ctx.fillStyle = 'rgba(8, 21, 44, 0.92)';
  ctx.fillRect(0, 540 - 64, 960, 64);
  ctx.strokeStyle = '#00BCEB';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 540 - 64);
  ctx.lineTo(960, 540 - 64);
  ctx.stroke();

  ctx.fillStyle = '#FACC15';
  ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(stepTitle, 16, 540 - 42);

  ctx.fillStyle = '#5EEAD4';
  ctx.font = 'bold 14px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(`Số liệu đo: ${measurementsSummary}`, 16, 540 - 18);

  return thumbCanvas.toDataURL('image/jpeg', 0.88);
}

/**
 * Tự động tổng hợp và xuất ra "Video Tóm Tắt Quá Trình Thực Hành" (Summary Reel Video)
 * Gồm:
 * 1. Màn hình Mở đầu (Title Card: Tên bài thực hành KHTN 9, Thời gian, Số bước thực hiện)
 * 2. Trình chiếu từng Bước thực hành (Hình ảnh 3D có hiệu ứng chuyển động mượt + Số liệu đo + Mốc thời gian)
 * 3. Màn hình Tổng kết (Bảng tổng hợp toàn bộ các bước và kết quả đo)
 */
export async function generateExperimentSummaryVideo(params: {
  session: LabRecordingSession;
  onProgress?: (percent: number, statusText: string) => void;
}): Promise<{ blob: Blob; url: string; mimeType: string }> {
  const { session, onProgress } = params;
  const width = 1280;
  const height = 720;
  const fps = 30;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Không thể khởi tạo Canvas 2D để dựng video tóm tắt.');
  }

  // Nạp trước toàn bộ ảnh Thumbnail của các bước thực hành
  const loadedImages: Array<HTMLImageElement | null> = await Promise.all(
    session.milestones.map(
      (m) =>
        new Promise<HTMLImageElement | null>((resolve) => {
          if (!m.thumbnailDataUrl) {
            resolve(null);
            return;
          }
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = m.thumbnailDataUrl;
        }),
    ),
  );

  const { mimeType } = getSupportedVideoMimeType();
  const stream = canvas.captureStream(fps);
  const recorder = mimeType
    ? new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 4_500_000,
      })
    : new MediaRecorder(stream);

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) {
      chunks.push(ev.data);
    }
  };

  const stopPromise = new Promise<{ blob: Blob; url: string; mimeType: string }>(
    (resolve) => {
      recorder.onstop = () => {
        const finalMime = recorder.mimeType || mimeType || 'video/webm';
        const blob = new Blob(chunks, { type: finalMime });
        const url = URL.createObjectURL(blob);
        resolve({ blob, url, mimeType: finalMime });
      };
    },
  );

  recorder.start(100);

  const introFrames = 45; // 1.5s
  const framesPerStep = 60; // 2.0s mỗi bước
  const outroFrames = 60; // 2.0s màn hình tổng kết
  const stepsCount = Math.max(1, session.milestones.length);
  const totalFrames = introFrames + stepsCount * framesPerStep + outroFrames;

  const waitFrame = () =>
    new Promise<void>((r) => window.setTimeout(r, 1000 / fps));

  // --- PHẦN 1: MÀN HÌNH MỞ ĐẦU (INTRO SLIDE) ---
  for (let f = 0; f < introFrames; f++) {
    const progress = f / introFrames;
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#08152C');
    grad.addColorStop(0.5, '#0B254B');
    grad.addColorStop(1, '#0F1A2E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Khung viền kỹ thuật
    ctx.strokeStyle = 'rgba(0, 188, 235, 0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#00BCEB';
    ctx.font = 'bold 20px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(
      'PHÒNG THÍ NGHIỆM ẢO 3D — KHOA HỌC TỰ NHIÊN 9 (OPENLAB 3D)',
      width / 2,
      210,
    );

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
    ctx.fillText('VIDEO TÓM TẮT QUÁ TRÌNH THỰC HÀNH', width / 2, 290);

    ctx.fillStyle = '#FACC15';
    ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
    ctx.fillText(session.experimentTitle, width / 2, 365);

    ctx.fillStyle = '#5EEAD4';
    ctx.font = 'bold 21px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(
      `Thời điểm thực hiện: ${session.startedAtVn}   |   Tổng thời lượng: ${formatRecTime(session.durationSec)}   |   Số bước: ${session.milestones.length}`,
      width / 2,
      455,
    );

    // Thanh tiến trình mở đầu
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(width / 2 - 220, 520, 440, 8);
    ctx.fillStyle = '#00BCEB';
    ctx.fillRect(width / 2 - 220, 520, 440 * progress, 8);

    if (f % 10 === 0 && onProgress) {
      onProgress(
        Math.round((f / totalFrames) * 100),
        'Đang dựng màn hình mở đầu báo cáo...',
      );
    }
    await waitFrame();
  }

  // --- PHẦN 2: TRÌNH CHIẾU TỪNG BƯỚC THỰC HÀNH (STEP HIGHLIGHTS) ---
  for (let s = 0; s < session.milestones.length; s++) {
    const ms = session.milestones[s];
    const img = loadedImages[s];

    for (let f = 0; f < framesPerStep; f++) {
      const globalFrame = introFrames + s * framesPerStep + f;
      const stepProg = f / framesPerStep;

      ctx.fillStyle = '#0B1526';
      ctx.fillRect(0, 0, width, height);

      // Vẽ ảnh 3D của bước thực hành với hiệu ứng phóng nhẹ (Ken Burns)
      if (img) {
        const zoom = 1 + stepProg * 0.035;
        const dw = width * zoom;
        const dh = height * zoom;
        const dx = (width - dw) / 2;
        const dy = (height - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
      }

      // Header của bước
      ctx.fillStyle = 'rgba(8, 21, 44, 0.92)';
      ctx.fillRect(0, 0, width, 68);
      ctx.strokeStyle = '#00BCEB';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 68);
      ctx.lineTo(width, 68);
      ctx.stroke();

      // Huy hiệu BƯỚC X/N
      ctx.fillStyle = '#1E6BFF';
      ctx.beginPath();
      ctx.roundRect(24, 14, 155, 40, 8);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `BƯỚC ${ms.stepNumber} / ${session.milestones.length}`,
        24 + 77.5,
        34,
      );

      ctx.textAlign = 'left';
      ctx.fillStyle = '#FACC15';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText(ms.title, 198, 34);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#67E8F9';
      ctx.font = 'bold 17px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(
        `Mốc: ${formatRecTime(ms.elapsedSec)} (${ms.realTimeVn})`,
        width - 24,
        34,
      );

      // Thẻ Kết quả đo ở cạnh dưới
      ctx.fillStyle = 'rgba(6, 18, 36, 0.94)';
      ctx.fillRect(0, height - 92, width, 92);
      ctx.strokeStyle = '#14B8A6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height - 92);
      ctx.lineTo(width, height - 92);
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
      ctx.fillText(
        'THÔNG SỐ ĐO & HIỆN TƯỢNG GHI NHẬN TẠI BƯỚC NÀY:',
        28,
        height - 64,
      );

      ctx.fillStyle = '#5EEAD4';
      ctx.font = 'bold 22px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(ms.measurementsSummary, 28, height - 30);

      if (f % 12 === 0 && onProgress) {
        onProgress(
          Math.round((globalFrame / totalFrames) * 100),
          `Đang tổng hợp Bước ${ms.stepNumber}/${session.milestones.length}: ${ms.title}...`,
        );
      }
      await waitFrame();
    }
  }

  // --- PHẦN 3: MÀN HÌNH BẢNG TỔNG KẾT QUÁ TRÌNH THỰC HÀNH (OUTRO SUMMARY CARD) ---
  for (let f = 0; f < outroFrames; f++) {
    const globalFrame =
      introFrames + session.milestones.length * framesPerStep + f;
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#08152C');
    grad.addColorStop(1, '#0F1A2E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#4ADE80';
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.fillText(
      `TỔNG KẾT QUÁ TRÌNH THỰC HÀNH — ${session.experimentTitle.toUpperCase()}`,
      68,
      86,
    );

    ctx.fillStyle = '#93C5FD';
    ctx.font = 'bold 17px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(
      `Hoàn thành ${session.milestones.length} bước thực hành · Thời lượng: ${formatRecTime(session.durationSec)} · Ngày giờ VN: ${session.startedAtVn}`,
      68,
      124,
    );

    // Vẽ danh sách tối đa 6 bước gần nhất lên bảng tổng kết
    const displaySteps = session.milestones.slice(-6);
    let rowY = 168;
    for (const st of displaySteps) {
      ctx.fillStyle = 'rgba(21, 36, 61, 0.92)';
      ctx.beginPath();
      ctx.roundRect(68, rowY, width - 136, 74, 10);
      ctx.fill();
      ctx.strokeStyle = '#28436C';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#FACC15';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.fillText(
        `Bước ${st.stepNumber} [${formatRecTime(st.elapsedSec)}]: ${st.title}`,
        88,
        rowY + 25,
      );

      ctx.fillStyle = '#5EEAD4';
      ctx.font = 'bold 16px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(`Số liệu: ${st.measurementsSummary}`, 88, rowY + 52);

      rowY += 84;
    }

    if (f % 15 === 0 && onProgress) {
      onProgress(
        Math.min(99, Math.round((globalFrame / totalFrames) * 100)),
        'Đang hoàn tất bảng tổng kết số liệu thực hành...',
      );
    }
    await waitFrame();
  }

  if (onProgress) {
    onProgress(100, 'Hoàn tất xuất Video Tóm Tắt Quá Trình!');
  }

  recorder.stop();
  stream.getTracks().forEach((t) => t.stop());
  return stopPromise;
}
