# Vòng 4 (C-18/C-19): Tài sản còn thiếu cho WF-10, WF-12, WF-13, WF-14, WF-15

Ngày: 2026-11-26. Nhánh: `feature/vong4-assets-c18-c19` (xếp chồng Vòng 1–3).
Trạng thái: 9/9 bước xong, toàn bộ kiểm định xanh.

## Tài sản mới: 10 asset, catalog 41 → 51

| Asset | Workflow mở khóa | Thân 3D / module |
|---|---|---|
| NAC-0001 muối ăn NaCl | WF-10 b.1 (cân 10,0 g) | Mới, slider `sampleMassG` 0–20 g (mặc định 0) |
| STR-0001 máy khuấy từ | WF-10 b.3 (khuấy ≥ 10 s) | Module mồ côi đã có sẵn, nay ship vào `public/libraries3DLab/`; tốc độ khuấy mặc định 600 → 0 rpm |
| RES-0001 điện trở 10 Ω | WF-12 | Builder mới `resistor-sample` |
| RHE-0001 biến trở 0–20 Ω | WF-12 | Builder mới `rheostat`, slider trong inspector |
| AMP-0001 ampe kế DC | WF-12 | Thân `digital-multimeter`, mặc định thang DCA |
| VOL-0001 vôn kế DC | WF-12 | Thân `digital-multimeter`, mặc định thang DCV |
| SOC-0001 đui đèn (dùng 2 instance) | WF-13 | Builder mới `incandescent-lamp-socket` |
| TWG-0001 cành có lá, TWG-0002 cành không lá | WF-14 b.2/b.3 | Builder mới, kind `specimen` (dock vào bình miễn phí) |
| LIT-0001 giấy chỉ thị pH | WF-15 b.2 | Builder mới `ph-indicator-strip`, màu từ `ChemicalSolutionSolver` |

## Sửa bẫy cũ (pass giả) trong lượt này

- **DMM-0001 vừa đặt lên bàn đã "đo" 12 V:** `defaultValue` 12 → 0 ở cả manifest trong `public/` và case registry; bỏ preset đặt giá trị đo (0/1,5/12 V), chỉ giữ nút chọn thang đo.
- **PHM-0001 vừa đặt đã "đo" pH 7,00:** `defaultValue` 7,00 → 0; module đã ship vào `public/libraries3DLab/` (trước đó mồ côi).
- **STR-0001 vừa đặt đã "khuấy 600 rpm":** `defaultValue` 600 → 0.
- **Matcher neural-guide:** `requiredArchetypes` khớp theo archetype thật trong catalog (fallback substring cho các chuỗi cũ như 'BAL', 'BKR').
- **Số đọc DMM bịa trong viewport** ("U = 12.00 V / I = 0.75 A / R = 16.0 Ω") → số đọc thật do solver ghi.
- Text cũ "36 thiết bị" trong `build-master-simulation-report.ts` → 51.

## Solver mới

- `solveResistiveCircuit` (AssemblySystem.ts): mạch PSU — RES — RHE — AMP nối tiếp, VOL song song với RES; R_total = 10 + R_biến trở, I = U/R, U_RES, U_RHE, P. DMM đọc thật qua reconcile (V gần RES ≤ 0,35 m, A gần PSU ≤ 0,70 m, Ω chỉ khi PSU tắt).
- `solveMultiBranchCircuit`: 2 đui đèn nối tiếp (U₁+U₂ = U_nguồn) / song song (U₁ = U₂ = U_nguồn, I = I₁+I₂); đèn sáng khi U_nhánh ≥ 2,5 V; cách mắc chọn bằng toggle trên PSU.
- Vòng thoát hơi (WF-14): cùng nhịp 450 ms với vòng đun, chỉ khi đèn halogen sáng + bình trong 0,35 m + có cành gắn; 1 s thật = 1 phút mô phỏng, có lá −0,4 ml/phút, không lá −0,02 ml/phút.
- Bảng số liệu WF-12 sửa theo PSU thật: 2/4/6/8 V → 3/6/9/12 V. Đề WF-14 b.3 sửa đơn vị mm → ml.

## Guard mới (WF-10 b.1/b.3, WF-12, WF-13, WF-14 b.2/b.3, WF-15 b.1/b.2)

Tất cả 15 workflow giờ đều có guard thật ở mọi bước có thể làm được — không còn bước nào pass vô điều kiện mà có thể kiểm chứng được. Các bước còn lại đều là fail trung thực chờ dữ liệu/thiết bị thật.

## Kiểm định Vòng 4 (chạy local 26/11/2026, tự chạy lại)

- `npx tsc --noEmit`: exit 0. `npm run build`: exit 0 (2,68 s).
- Guard mới `scripts/verify-vong4-guards.ts`: **96 PASSED, 0 FAILED**.
- `verify-all-15-workflows.ts`: 77 PASSED. `verify-wf07-wf08-guards.ts`: 27 PASSED. `verify-wf09-wf15-guards.ts`: 71 PASSED. `verify-hand-tracking.ts`: 31 PASSED. Tổng 302 test xanh.

## Giới hạn đã biết

- **Điện trở bóng đèn SOC = 12 Ω là giả định mô phỏng** (`status: 'reported'`) — cần phòng lab xác nhận công suất bóng thật.
- Khối lượng/kích thước danh nghĩa của 10 asset mới cần phòng lab xác nhận.
- Builder 3D mới chỉ qua tsc + build, chưa render kiểm tra trực quan trong trình duyệt; vòng khuấy/thoát hơi chỉ kiểm bằng test logic, chưa chạy thử trên UI thật. Chưa kiểm chứng bằng tay thật + camera (giới hạn đã biết của Vòng 2).
