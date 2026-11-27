# Vòng 5: Mạng chỉ dẫn WF-08 + Trọng lực nguồn duy nhất + Model/WASM tay về local

Ngày: 2026-11-26. Nhánh đích: xếp chồng lên nhánh Vòng 4 (Vòng 1–4 đã có trong
bản chạy thử). Thứ tự làm: (C) → (B) → (A).

## (C) Model + WASM tay về local — xong

- Script mới `scripts/download-hand-tracking-assets.mjs` (chỉ dùng built-in
  Node): copy 4 file WASM từ `node_modules/@mediapipe/tasks-vision/wasm/` và
  tải `hand_landmarker.task` (7,46 MB) từ Google Storage vào
  `public/hand-tracking/`. Idempotent — chạy lại bỏ qua file đã đúng.
- `package.json`: thêm `"prebuild"` và `"postinstall"` chạy script trên.
- `public/hand-tracking/` thêm vào `.gitignore` (file sinh ra, không commit).
- `HandTrackingController.ts`: điều kiện dùng local nay kiểm cả file `.js`
  glue chứ không chỉ `.wasm`; CDN pin 0.10.14 giữ làm dự phòng cuối.
- Kiểm chứng: đủ 5 file local; `npm run build` copy đủ 5 file vào
  `dist/hand-tracking/`; `vite preview` + curl: `.task` HTTP 200,
  `.wasm` HTTP 200 + `Content-Type: application/wasm`, `.js` HTTP 200.
- Giới hạn: chưa kiểm bằng tay thật (máy kiểm định không có camera) — việc
  controller khởi tạo thành công với model local trong trình duyệt thật vẫn
  cần thử trên link Preview. Khi mở camera, panel sẽ ghi "Mô hình: máy chủ
  local" thay vì "Mô hình: CDN".

## (B) Trọng lực nguồn duy nhất — xong

- `LabEnvironmentEngine.ts`: `export const STANDARD_GRAVITY_MPS2 = 9.80665`
  đặt trước `INITIAL_ENVIRONMENT_VARIABLES`; `gravityMps2.value/defaultValue`
  tham chiếu tới nó. Bảng `CELESTIAL_GRAVITY_PRESETS` (Earth/Moon/Mars/
  Jupiter/Microgravity) cũng là nguồn duy nhất ở đây.
- `MultiPhysicsCouplingBus.ts:52`: bỏ hằng riêng, import
  `STANDARD_GRAVITY_MPS2` từ LabEnvironmentEngine (không tạo import vòng —
  LabEnvironmentEngine chỉ import `three`); giữ bí danh
  `STANDARD_GRAVITY_M_S2` để tương thích ngược.
- `ChronoCausalSandbox.ts`: xóa bảng preset trùng, import bảng chung;
  Sao Hỏa sửa 3.72 → 3.71 m/s²; `_customGravity` khởi tạo bằng hằng chuẩn.
- Kho mới `src/three-runtime/environmentStore.ts`: `currentEnvironment` +
  `subscribe/notify` + `getGravityMps2()` (+ `getEnvironmentVariables()`,
  `updateEnvironmentVariable`, `resetEnvironmentVariables`).
  `LabViewport3D.handleUpdateEnvVar` ghi vào store sau khi clamp và đẩy g
  thật vào `MultiPhysicsCouplingBus.setEnvironment` (qua
  `scientificSolverRegistry.getMultiPhysicsBus()`); `handleResetEnvVars`
  reset store cùng lúc. Sửa fallback bịa `referenceMass ?? 66.25` ở đó thành
  bỏ qua vật không có khối lượng.
- Mọi literal g trong code tính toán đã thay bằng hằng/g live:
  `LabViewport3D` (tia rót, mô-men đòn bẩy, áp suất ống chữ U),
  `App.tsx` (P = m·g của liveArchimedesParams và reconcile lực kế),
  `CognitiveNeuralEngine` (lực đẩy Archimedes), `neuralConnectionEngine`
  (P = m·g), `ProceduralLabModels` (tia nước — g truyền qua tham số của
  `buildProceduralEquipmentGroup`, caller `AssetLoader` truyền g live),
  3 solver (`?? 9.80665` → `?? STANDARD_GRAVITY_MPS2`),
  `DeviceControlInspector` (truyền env live từ store vào
  `deviceControlEngine.evaluateOutputs` — trước đây solver luôn nhận
  `environment: undefined`), `ExperimentWorkflows` (F hiển thị WF-08 và
  F_A WF-09 dùng g live), `handMath` (`HAND_GRAVITY_MPS2` → hàm
  `getLiveGravityMps2()` đọc từ store).
- Preset Trái Đất/Mặt Trăng/Sao Hỏa: 3 nút trong `LabEnvironmentSpecModal`
  (thẻ biến `gravityMps2`) gọi `onUpdateEnvVar('gravityMps2', g)`. Không đưa
  Sao Mộc (24.79 vượt max env 20).
- Kiểm chứng bằng test logic (không chạy được UI thật nên ghi rõ): đổi preset
  Moon → DYN treo 66,25 g hiện 0,11 N; Mars → 0,25 N; Earth → 0,65 N.
  WF-08 vẫn pass với cùng cặp cân bằng.
- Grep `9.80665|9.81|0.00980665` trong `src/` sau Vòng 5: chỉ còn đúng 1 định
  nghĩa hằng (`LabEnvironmentEngine.ts:273`) + 7 dòng chú thích/văn bản
  (đã ghi chú trong test).
- KHÔNG đổi theo g (đã giữ nguyên): điều kiện cân bằng đòn bẩy WF-08
  (g triệt tiêu hai phía — chỉ số mô-men hiển thị đổi theo g),
  số đọc khối lượng `measuredMassG`, nhiệt độ sôi, tốc độ bay hơi.

## (A) Mạng chỉ dẫn thí điểm WF-08 — xong

- Component mới `src/components/panels/GuideNextActionCard.tsx`: card DOM duy
  nhất, hiện "Bước k/3" + động từ hành động + 1 dòng hướng dẫn (lấy từ
  `experimentWorkflowEngine.getARNeuralRecommendation`), nhãn từ `reasonVi`
  của guard, không tính số mới. Tối đa 3 nhãn trong mọi trường hợp.
- Nối dây tại MỘT điểm duy nhất trong `LabViewport3D`: effect đồng bộ scene
  (chỗ gọi `cognitiveNeuralEngine.syncSceneInstances` +
  `neuralConnectionEngine.syncSceneSignals`) gọi `refreshGuidePilot()`
  (debounce 500 ms) + đồng hồ 500 ms riêng (chỉ chạy khi pilot active) để đo
  fail liên tục ≥ 30 s. Không dùng thẻ hologram làm nhãn trong thí điểm.
- `LabViewport3D: candidates.slice(0, 12)` → khi pilot WF-08 active: lọc
  ứng viên khớp `requiredArchetypes` của bước hiện tại qua
  `matchesRequiredArchetype`, tối đa 3 tia; khi không có pilot giữ như cũ.
- 3 loại sự kiện LabEventLog mới (`LabEnvironmentEngine.ts`):
  `WORKFLOW_STEP_FAIL`, `WORKFLOW_STEP_PASS`, `GUIDE_HINT_SHOWN` — ghi tại
  điểm đánh giá guard duy nhất, chống spam (chỉ log khi `reasonVi` đổi).
- Hint chỉ hiện khi kẹt: (a) fail sau 3 lần thao tác sai liên tiếp, HOẶC
  (b) fail liên tục ≥ 30 s. Trước ngưỡng chỉ có card hành động tiếp theo.
  Sau ngưỡng thêm đúng 1 hint = `hintVi` của guard. Logic thuần tách ra
  `src/components/panels/guidePilot.ts` để test được (đếm fail chỉ tính
  thao tác, tick đồng hồ không đếm).
- Nối dây `solveContinuousStepVerification` (trước đây 0 caller): gọi trong
  `refreshGuidePilot` với dt thực tế — tự tiến bước khi pass ổn định ≥ 0.8 s
  (logic sẵn của engine). Pilot tự kích hoạt khi đòn bẩy LEV-0001 có trên bàn
  (`startWorkflow('WF-08')`), tắt khi dỡ xuống. Engine trước đây là code
  chết (không caller, không map `experimentId` → WF-08) nên pilot không dựa
  vào `studentGuidedStep` của App — hai hệ bước vẫn tách nhau, xem giới hạn.
- Sửa các `??` bịa số trong `CognitiveNeuralEngine.syncSceneInstances`
  (9 điểm: khối lượng 66.25, mức nước 74.5/50.0, thể tích 24.5, PSU 6.0,
  dòng 0.50, lực 0.65, nhiệt độ 25.0, góc tới 45.0): bỏ giá trị bù — thiếu
  số thì không hiện nhãn đó (tag cũ bị đánh inactive). Lực kế nay đọc trường
  thật `springExtensionN`; PSU đọc `voltageStepV/voltageSetting/
  supplyVoltageV` thật; dòng điện chỉ hiện khi solver đo được
  (`multimeterValue` là preset, không dùng). Chưa sửa hết được: không có —
  cả 9 điểm đã sửa xong.
- KHÔNG làm: tutor tự do/chat, tự mở hội thoại Socrates, gọi
  `triggerGoldenViSEFDemo`, dùng số từ CognitiveNeuralEngine hay
  `syncSceneSignals` làm nhãn, mở `NeuralDeviceNetworkModal` toàn cảnh trong
  luồng bước.

## Kiểm định (chạy local 26/11/2026, tự chạy lại)

| Lệnh | Kết quả |
|---|---|
| `npx tsx scripts/verify-vong5-guide-gravity.ts` (mới) | **62 PASSED, 0 FAILED** |
| `npx tsc --noEmit` | exit 0 |
| `npm run build` | exit 0 (4,09 s; prebuild chạy script tải, idempotent) |
| `npx tsx scripts/verify-all-15-workflows.ts` | 77 PASSED, 0 FAILED |
| `npx tsx scripts/verify-wf07-wf08-guards.ts` | 27 PASSED, 0 FAILED |
| `npx tsx scripts/verify-wf09-wf15-guards.ts` | 71 PASSED, 0 FAILED |
| `npx tsx scripts/verify-hand-tracking.ts` | 31 PASSED, 0 FAILED |
| `npx tsx scripts/verify-vong4-guards.ts` | 96 PASSED, 0 FAILED |

Tổng: 364 test xanh (77+27+71+31+96+62).

## Giới hạn đã biết

1. Chưa kiểm bằng tay thật / UI thật: khởi tạo camera với model local, card
   chỉ dẫn hiển thị trên viewport, preset Moon đổi số đọc DYN trên UI — đều
   mới kiểm bằng test logic + curl, cần thử trên link Preview.
2. Hai hệ bước vẫn tách nhau: engine WF-08 tự tiến bước nội bộ; App vẫn dùng
   `studentGuidedStep` riêng cho 4 bài `OL3D-EXP-*` (không có bài đòn bẩy).
   Card pilot đọc bước từ engine, không đồng bộ ngược lên App.
3. `liveArchimedesParams` trong App (giá trị 0.65/0.41 gán theo bước hướng
   dẫn) vẫn tồn tại — Vòng 5 chỉ đổi literal g trong đó, chưa dỡ bỏ cơ chế
   gán theo bước (việc của vòng sau).
4. Tia nước bình cấp (`gJet`) lấy g lúc dựng mô hình (AssetLoader cache
   prototype) — đổi preset g sau khi mô hình đã dựng không vẽ lại tia cho tới
   khi tải lại trang.
5. Trong một lần chạy `exec` ở Vòng 5, hệ thống báo một kết quả lệnh (diff
   package.json) không qua kiểm tra rủi ro thực thi — nội dung đó chỉ là văn
   bản diff, không có lệnh nào được chạy từ nó; mọi lệnh build/test đều là
   lệnh của repo đã giao.
