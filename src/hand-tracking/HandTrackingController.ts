/**
 * HAND-01 (Vòng 2) — Điều khiển camera + MediaPipe HandLandmarker.
 *
 * - Chạy trên máy (on-device), không upload / không lưu frame hay landmark.
 * - Camera chỉ bật sau khi người dùng bấm nút Camera; tắt là dừng track ngay.
 * - Model + WASM: thử đường local trong public/ trước
 *   (/hand-tracking/hand_landmarker.task, /hand-tracking/wasm), do script
 *   scripts/download-hand-tracking-assets.mjs tạo ra lúc postinstall/prebuild
 *   (file sinh ra, không commit — xem .gitignore). Nếu chưa có thì dùng CDN
 *   jsDelivr với phiên bản đã pin 0.10.14 làm dự phòng cuối.
 */

import type { Landmark } from './handMath';

export const MEDIAPIPE_VERSION = '0.10.14';
const LOCAL_WASM_URL = '/hand-tracking/wasm';
const CDN_WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const LOCAL_MODEL_URL = '/hand-tracking/hand_landmarker.task';
const CDN_MODEL_URL = `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`;

export interface HandFrame {
  landmarks: Landmark[];
  /** Thời gian video (ms) để detectForVideo dùng. */
  timestampMs: number;
}

async function urlExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

export class HandTrackingController {
  private landmarker: unknown = null;
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private rafId = 0;
  private running = false;
  private lastVideoTimeMs = -1;

  get isRunning(): boolean {
    return this.running;
  }

  /** Nạp model. Trả về nguồn đã dùng ('local' | 'cdn') để UI ghi rõ. */
  async init(): Promise<'local' | 'cdn'> {
    const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
    // Vòng 5 (C): local chỉ dùng khi đủ cả model + file .js glue + file .wasm
    // (trước đây chỉ kiểm .wasm nên có thể chọn local thiếu file glue).
    const useLocal =
      (await urlExists(LOCAL_MODEL_URL)) &&
      (await urlExists(`${LOCAL_WASM_URL}/vision_wasm_internal.js`)) &&
      (await urlExists(`${LOCAL_WASM_URL}/vision_wasm_internal.wasm`));
    const wasmUrl = useLocal ? LOCAL_WASM_URL : CDN_WASM_URL;
    const modelUrl = useLocal ? LOCAL_MODEL_URL : CDN_MODEL_URL;
    const vision = await FilesetResolver.forVisionTasks(wasmUrl);
    this.landmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: modelUrl, delegate: 'GPU' },
      runningMode: 'VIDEO',
      numHands: 1,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    return useLocal ? 'local' : 'cdn';
  }

  /** Bật camera (chỉ sau tap của người dùng) và bắt đầu vòng lặp nhận diện. */
  async start(
    video: HTMLVideoElement,
    onFrame: (frame: HandFrame | null) => void,
    onError: (messageVi: string) => void,
  ): Promise<void> {
    if (!this.landmarker) {
      onError('Chưa nạp được mô hình nhận diện bàn tay');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      onError('Trình duyệt này không hỗ trợ camera');
      return;
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
    } catch {
      onError('Không mở được camera — hãy cho phép quyền camera rồi bấm lại');
      return;
    }
    this.video = video;
    video.srcObject = this.stream;
    await video.play();
    this.running = true;
    const loop = () => {
      if (!this.running || !this.video || !this.landmarker) return;
      const v = this.video;
      if (v.readyState >= 2 && v.currentTime !== this.lastVideoTimeMs) {
        this.lastVideoTimeMs = v.currentTime;
        const nowMs = performance.now();
        try {
          const result = (
            this.landmarker as {
              detectForVideo: (v: HTMLVideoElement, t: number) => {
                landmarks?: Array<Array<{ x: number; y: number; z: number }>>;
              };
            }
          ).detectForVideo(v, nowMs);
          const lm = result.landmarks?.[0];
          onFrame(lm ? { landmarks: lm, timestampMs: nowMs } : null);
        } catch {
          onFrame(null);
        }
      }
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  /** Dừng hẳn: huỷ vòng lặp, dừng track camera, đóng model. */
  stop(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }
    const lm = this.landmarker as { close?: () => void } | null;
    lm?.close?.();
    this.landmarker = null;
  }
}
