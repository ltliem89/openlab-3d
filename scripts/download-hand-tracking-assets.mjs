/**
 * Vòng 5 (C) — Đưa model + WASM nhận diện bàn tay về local.
 *
 * - Copy 4 file WASM từ node_modules/@mediapipe/tasks-vision/wasm/
 *   → public/hand-tracking/wasm/ (đã cài qua npm, pin 0.10.14).
 * - Tải hand_landmarker.task từ Google Storage (MediaPipe Models)
 *   → public/hand-tracking/ (file nhị phân ~8 MB, không commit qua GitHub API
 *   nên lấy lúc cài đặt/build thay vì đưa vào repo).
 * - Idempotent: chạy lại sẽ bỏ qua file đã đúng dung lượng.
 * - Chỉ dùng built-in Node (https/fs/crypto/path), không thêm dependency.
 *
 * Chạy tay:  node scripts/download-hand-tracking-assets.mjs
 * Tự chạy:   postinstall + prebuild (xem package.json).
 */
import { createWriteStream, existsSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
import { get as httpsGet } from 'node:https';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WASM_FILES = [
  'vision_wasm_internal.js',
  'vision_wasm_internal.wasm',
  'vision_wasm_nosimd_internal.js',
  'vision_wasm_nosimd_internal.wasm',
];
const WASM_SRC_DIR = join(ROOT, 'node_modules', '@mediapipe', 'tasks-vision', 'wasm');
const WASM_DEST_DIR = join(ROOT, 'public', 'hand-tracking', 'wasm');
const TASK_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
const TASK_DEST = join(ROOT, 'public', 'hand-tracking', 'hand_landmarker.task');

function formatBytes(n) {
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
}

function fetchHead(url) {
  return new Promise((resolve) => {
    const req = httpsGet(url, { method: 'HEAD' }, (res) => {
      res.resume();
      resolve({ status: res.statusCode, length: Number(res.headers['content-length'] || 0) });
    });
    req.on('error', () => resolve({ status: 0, length: 0 }));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ status: 0, length: 0 });
    });
  });
}

function downloadToFile(url, dest, redirects = 0) {
  return new Promise((resolve, reject) => {
    const req = httpsGet(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects < 3) {
        res.resume();
        downloadToFile(res.headers.location, dest, redirects + 1).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode} khi tải ${url}`));
        return;
      }
      const out = createWriteStream(dest);
      let bytes = 0;
      res.on('data', (chunk) => {
        bytes += chunk.length;
      });
      res.pipe(out);
      out.on('finish', () => resolve(bytes));
      out.on('error', reject);
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(120000, () => {
      req.destroy(new Error('Hết thời gian tải (120s)'));
    });
  });
}

async function main() {
  mkdirSync(WASM_DEST_DIR, { recursive: true });
  let copied = 0;
  let skipped = 0;
  for (const name of WASM_FILES) {
    const src = join(WASM_SRC_DIR, name);
    const dest = join(WASM_DEST_DIR, name);
    if (!existsSync(src)) {
      console.warn(`[hand-tracking] CẢNH BÁO: không thấy ${src} — bỏ qua (cần npm install @mediapipe/tasks-vision).`);
      continue;
    }
    const srcSize = statSync(src).size;
    if (existsSync(dest) && statSync(dest).size === srcSize) {
      console.log(`[hand-tracking] bỏ qua ${name} (đã có, ${formatBytes(srcSize)})`);
      skipped++;
      continue;
    }
    copyFileSync(src, dest);
    console.log(`[hand-tracking] copy ${name} (${formatBytes(srcSize)})`);
    copied++;
  }

  // Model .task: chỉ tải khi chưa có hoặc sai dung lượng so với HEAD.
  const head = await fetchHead(TASK_URL);
  const expected = head.length || 0;
  if (existsSync(TASK_DEST)) {
    const localSize = statSync(TASK_DEST).size;
    if (expected > 0 && localSize === expected) {
      console.log(`[hand-tracking] bỏ qua hand_landmarker.task (đã có, ${formatBytes(localSize)})`);
    } else if (expected === 0) {
      console.log(`[hand-tracking] giữ hand_landmarker.task hiện có (${formatBytes(localSize)}) — không kiểm được dung lượng gốc (mạng/HEAD lỗi).`);
    } else {
      console.log(`[hand-tracking] hand_landmarker.task sai dung lượng (${formatBytes(localSize)} != ${formatBytes(expected)}) — tải lại...`);
      const bytes = await downloadToFile(TASK_URL, TASK_DEST);
      console.log(`[hand-tracking] tải hand_landmarker.task (${formatBytes(bytes)})`);
    }
  } else {
    if (head.status !== 200 && expected === 0) {
      console.log('[hand-tracking] không lấy được HEAD của model — thử tải trực tiếp...');
    }
    const bytes = await downloadToFile(TASK_URL, TASK_DEST);
    console.log(`[hand-tracking] tải hand_landmarker.task (${formatBytes(bytes)})`);
  }

  console.log(`[hand-tracking] xong: copy ${copied}, bỏ qua ${skipped} file WASM; model + WASM ở public/hand-tracking/.`);
}

main().catch((err) => {
  console.error(`[hand-tracking] LỖI: ${err.message}`);
  console.error('[hand-tracking] Ứng dụng vẫn chạy được bằng fallback CDN (xem HandTrackingController).');
  process.exit(1);
});
