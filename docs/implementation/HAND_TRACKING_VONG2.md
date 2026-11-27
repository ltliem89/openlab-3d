# Vòng 2 (HAND-01): Camera nhận diện bàn tay điều khiển thiết bị

Ngày: 2026-11-26. Nhánh: `feature/hand-tracking-hand-01` (từ `main` v2.5.0).
Trạng thái: prototype đầu tiên, chạy được — cần kiểm tra bằng tay thật trên link Preview.

## Người dùng làm gì được (khác biệt thấy ngay)

1. Bấm nút **📷 Tay: TẮT** trên thanh trên cùng → camera bật, panel video hiện góc dưới-phải.
2. Đưa tay vào khung hình → thấy khung xương tay + chấm con trỏ xanh.
3. **Chụm ngón cái + ngón trỏ** (giữ ≥ 150 ms) gần một thiết bị → cầm thiết bị đó.
4. Di chuyển tay trái/phải, lên/xuống, vào/ra → thiết bị đi theo.
5. **Buông tay** → thiết bị rơi xuống bàn dưới trọng lực g = 9,80665 m/s².
6. **Chụm nhanh** (< 250 ms, dịch < 6 px) lên một thiết bị → chọn thiết bị; chụm nhanh lần nữa lên thiết bị đang chọn → mở mạng lưới chỉ dẫn (như double-click chuột).
7. Bấm lại nút **Tay: BẬT** → camera tắt hẳn (dừng track).

Chuột/cảm ứng vẫn dùng như cũ khi tắt camera.

## Cách hoạt động (tóm tắt kỹ thuật)

| Thành phần | File | Ghi chú |
|---|---|---|
| Toán thuần (pinch, trễ, One Euro, ánh xạ bàn, rơi) | `src/hand-tracking/handMath.ts` | Kiểm định được không cần camera |
| MediaPipe HandLandmarker + getUserMedia | `src/hand-tracking/HandTrackingController.ts` | VIDEO mode, 1 tay, 640×480 |
| Panel video + overlay khung xương + trạng thái | `src/components/hand-tracking/HandCameraPanel.tsx` | Chỉ hiện khi bật |
| Nút Camera trên thanh trên | `src/components/navigation/TopNavBar.tsx` | Cạnh nút Nơ-ron, cùng pattern |
| Trạng thái + xử lý sự kiện tay | `src/App.tsx` | `isHandCameraEnabled`, `handleHandEvent` |
| Dependency | `package.json` | `@mediapipe/tasks-vision` pin 0.10.14 |

Thuật toán (theo nghiên cứu sâu 26/11/2026):
- Pinch = |đầu ngón cái 4 − đầu ngón trỏ 8| / cỡ tay |cổ tay 0 − MCP giữa 9|; vào < 0,30, ra > 0,45, giữ 150 ms, nguội 150 ms.
- Con trỏ neo ở landmark 9, làm mượt bằng One Euro (minCutoff 1,0 Hz).
- Ánh xạ: X ảnh (đã lật selfie) → X bàn ±1,15 m; Y ảnh → Z bàn ±0,435 m; độ cao từ cỡ tay, clamp 0–0,35 m. Không dùng z thô của MediaPipe.
- Rơi: tự tích phân `vy -= g·dt`, `y += vy·dt`, g lấy từ `INITIAL_ENVIRONMENT_VARIABLES.gravityMps2.defaultValue` (9,80665) — không hard-code 9,81 mới.
- Trong lúc cầm chỉ commit vị trí 100 ms/lần, khi buông commit 1 lần cuối y = 0 — tránh `setScene` mỗi frame (rủi ro R1 trong khảo sát).

## Kiểm định Vòng 2 (chạy local 26/11/2026)

- `npx tsx scripts/verify-hand-tracking.ts`: **31 PASSED, 0 FAILED** (pinch, trễ, One Euro, ánh xạ bàn, rơi, tap).
- `npx tsc --noEmit`: exit 0. `npm run build`: exit 0 (2,56 s).
- `scripts/verify-all-15-workflows.ts`: 77 PASSED, 0 FAILED (không đổi).
- `scripts/verify-wf07-wf08-guards.ts`: 27 PASSED, 0 FAILED (không đổi — nhánh này chưa chứa guard Vòng 1, PR #2 riêng).
- Dev server: HTTP 200.

## Giới hạn đã biết (nói thật, chưa kiểm chứng)

1. **Chưa kiểm tra bằng tay thật.** Máy kiểm định không có camera nên vòng lặp nhận diện trực tiếp (landmark thật, độ trễ, độ ổn định khi cầm) chưa được xác minh. Người dùng cần thử trên link Preview và báo lại.
2. **Model + WASM chưa vendor vào repo.** Vòng 2 chưa đẩy được file nhị phân qua GitHub API nên controller thử đường local `/hand-tracking/` trước, nếu không có thì dùng CDN jsDelivr (WASM, pin 0.10.14) và Google Storage (model `hand_landmarker.task`, float16) — cần mạng khi mở camera lần đầu. Vòng 3 sẽ vendor file vào repo.
3. **Chỉ 1 tay, 1 vật một lúc.** Chưa có va chạm giữa các vật; vật rơi xuyên qua vật khác nếu thả đè lên. Chưa dùng collider.
4. **Độ sâu vào/ra là gợi ý** từ cỡ bàn tay, chưa đo thực — dùng một webcam đơn.
5. **Di chuyển bằng tay dùng commit thưa 100 ms** qua `handleUpdateInstanceTransform` (có chạy reconcile); chưa di chuyển trực tiếp `Object3D` trong viewport như kéo chuột. Vòng 3 sẽ tối ưu đường này.
6. **PR này tách khỏi PR #2 (guard Vòng 1).** Muốn vừa có guard thật vừa có camera thì merge cả hai PR vào main (không xung đột file, trừ `package.json` đã khớp v2.5.0).

## Quyền riêng tư

- Camera mặc định TẮT, chỉ bật sau khi người dùng bấm nút.
- Video + landmark chỉ xử lý trên máy, không upload, không lưu.
- Tắt camera là dừng track ngay (`track.stop()`).
- Dữ liệu sinh trắc học — cần ý kiến nhà trường/pháp lý trước khi dùng với học sinh (Nghị định 13/2023 Điều 20, xem roadmap v2 §7).
