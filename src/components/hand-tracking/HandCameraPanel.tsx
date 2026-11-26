/**
 * HAND-01 (Vòng 2) — Panel camera nhận diện bàn tay.
 * Hiện khi người dùng bật nút Camera (mặc định TẮT). Vẽ video selfie + khung
 * xương tay + con trỏ tay. Không lưu frame/landmark, không gửi đi đâu.
 *
 * Sự kiện gửi lên App qua onHandEvent:
 * - move: con trỏ tay di chuyển trên mặt bàn (x, z, heightM).
 * - grab: bắt đầu chụm (cầm) — App tìm vật gần con trỏ nhất để cầm.
 * - release: buông tay — App cho vật rơi.
 * - tap: chụm ngắn + ít di chuyển — App chọn vật / mở mạng chỉ dẫn.
 */
import { useEffect, useRef, useState } from 'react';
import { HandTrackingController } from '../../hand-tracking/HandTrackingController';
import {
  computePinchRatio,
  isTap,
  landmarkToBench,
  OneEuroFilter,
  PinchStateMachine,
} from '../../hand-tracking/handMath';
import type { BenchPoint, Landmark } from '../../hand-tracking/handMath';

export type HandEvent =
  | { type: 'move'; point: BenchPoint }
  | { type: 'grab'; point: BenchPoint }
  | { type: 'release'; point: BenchPoint }
  | { type: 'tap'; point: BenchPoint };

interface Props {
  onHandEvent: (e: HandEvent) => void;
  onError: (messageVi: string) => void;
}

const LANDMARK_CONNECTIONS: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
];

export function HandCameraPanel({ onHandEvent, onError }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<string>('Đang nạp mô hình nhận diện tay…');
  const [modelSource, setModelSource] = useState<string>('');
  const [grabbing, setGrabbing] = useState(false);
  const stateRef = useRef({
    pinch: new PinchStateMachine(),
    filterX: new OneEuroFilter(),
    filterY: new OneEuroFilter(),
    filterH: new OneEuroFilter(),
    pinchStartMs: 0,
    pinchStartPoint: null as BenchPoint | null,
    lastPoint: null as BenchPoint | null,
    lastFrameMs: 0,
  });

  useEffect(() => {
    const controller = new HandTrackingController();
    let cancelled = false;
    const st = stateRef.current;

    const draw = (landmarks: Landmark[] | null, point: BenchPoint | null) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!landmarks) return;
      ctx.strokeStyle = '#48D6A0';
      ctx.lineWidth = 2;
      for (const [a, b] of LANDMARK_CONNECTIONS) {
        const p1 = landmarks[a];
        const p2 = landmarks[b];
        if (!p1 || !p2) continue;
        ctx.beginPath();
        ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
        ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
        ctx.stroke();
      }
      ctx.fillStyle = '#F5C542';
      for (const lm of landmarks) {
        ctx.beginPath();
        ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (point) {
        // Con trỏ tay: chấm tại landmark 9 (đã lật ngang như video selfie).
        const lm9 = landmarks[9];
        if (lm9) {
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(lm9.x * canvas.width, lm9.y * canvas.height, 9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    controller
      .init()
      .then((source) => {
        if (cancelled) {
          controller.stop();
          return;
        }
        setModelSource(source === 'local' ? 'Mô hình: máy chủ local' : 'Mô hình: CDN (Vòng 3 sẽ đưa về local)');
        setStatus('Đang mở camera…');
        const video = videoRef.current;
        if (!video) return;
        return controller.start(
          video,
          (frame) => {
            if (cancelled) return;
            const nowMs = performance.now();
            if (!frame) {
              st.lastFrameMs = nowMs;
              setStatus('Không thấy tay — đưa tay vào khung hình');
              draw(null, null);
              return;
            }
            const lm = frame.landmarks;
            const lm9 = lm[9];
            if (!lm9) return;
            const ratio = computePinchRatio(lm);
            const handSize = Math.hypot(lm[0].x - lm[9].x, lm[0].y - lm[9].y);
            const raw = landmarkToBench(lm9, handSize);
            const point: BenchPoint = {
              x: st.filterX.filter(raw.x, nowMs),
              z: st.filterY.filter(raw.z, nowMs),
              heightM: st.filterH.filter(raw.heightM, nowMs),
            };
            const prev = st.pinch.current;
            const next = st.pinch.update(ratio, nowMs);
            if (prev === 'open' && next === 'pinching') {
              st.pinchStartMs = nowMs;
              st.pinchStartPoint = point;
              setGrabbing(true);
              setStatus('Đang cầm — di chuyển tay để di chuyển thiết bị');
              onHandEvent({ type: 'grab', point });
            } else if (prev === 'pinching' && next === 'open') {
              const duration = nowMs - st.pinchStartMs;
              const movedPx = st.pinchStartPoint
                ? Math.hypot(point.x - st.pinchStartPoint.x, point.z - st.pinchStartPoint.z) * 1000
                : 999;
              setGrabbing(false);
              if (isTap(duration, movedPx)) {
                setStatus('Đã chạm — mở thiết bị');
                onHandEvent({ type: 'tap', point });
              } else {
                setStatus('Đã buông — thiết bị đang rơi');
                onHandEvent({ type: 'release', point });
              }
              st.pinchStartPoint = null;
            } else if (next === 'pinching') {
              onHandEvent({ type: 'move', point });
            } else {
              setStatus('Đã thấy tay — chụm ngón cái và ngón trỏ để cầm thiết bị');
              onHandEvent({ type: 'move', point });
            }
            st.lastPoint = point;
            draw(lm, point);
          },
          (msg) => {
            if (!cancelled) onError(msg);
          },
        );
      })
      .catch(() => {
        if (!cancelled) onError('Không nạp được mô hình nhận diện tay — kiểm tra mạng rồi thử lại');
      });

    return () => {
      cancelled = true;
      controller.stop();
    };
    // Chỉ chạy 1 lần khi panel được gắn vào; onHandEvent/onError ổn định từ App.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed bottom-3 right-3 z-50 w-[280px] rounded-[12px] border border-[#48D6A0]/40 bg-[#0B1930]/95 p-2 shadow-[0_0_20px_rgba(72,214,160,0.25)]"
      role="region"
      aria-label="Camera nhận diện bàn tay"
    >
      <div className="relative overflow-hidden rounded-[8px] bg-black">
        <video ref={videoRef} className="block h-[180px] w-full -scale-x-100 object-cover" muted playsInline />
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full -scale-x-100" />
        {grabbing && (
          <span className="absolute left-2 top-2 rounded-full bg-[#F5C542] px-2 py-0.5 text-[11px] font-bold text-black">
            ĐANG CẦM
          </span>
        )}
      </div>
      <p className="mt-2 text-[12px] leading-snug text-[#A8BCD5]">{status}</p>
      {modelSource && <p className="text-[11px] text-[#6B7F99]">{modelSource}</p>}
      <p className="mt-1 text-[11px] leading-snug text-[#6B7F99]">
        Chụm ngón cái + ngón trỏ để cầm, buông ra để thả rơi. Chụm nhanh để chạm mở thiết bị. Video chỉ xử lý trên máy, không gửi đi đâu.
      </p>
    </div>
  );
}
