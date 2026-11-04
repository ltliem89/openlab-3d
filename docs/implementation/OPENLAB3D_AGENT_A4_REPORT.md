# BÁO CÁO KIỂM TOÁN VÀ ĐỀ XUẤT TRIỂN KHAI — AGENT A4
## (AGENT A4: UI, INSPECTOR & GUIDANCE)

> **Mã báo cáo:** `OPENLAB3D-AGENT-A4-REPORT-2026`  
> **Chuyên trách:** Giao diện người dùng, bảng điều khiển chi tiết (Inspector), thẻ nổi hướng dẫn (HoverCard), HUD đo lường và hệ thống kiểm định  
> **Tài liệu tham chiếu:** Mockup 04 (`04_MOCKUP_GIAO_DIEN_HUONG_DAN_VA_KIEM_DINH.md`), Master Spec v3.0.0, 12 tiêu chí UX-01..12  
> **Ngày lập:** 04/11/2026

---

### 1. HIỆN TRẠNG THỰC TẾ
- Giao diện người dùng bao gồm:
  - `src/components/panels/DeviceControlInspector.tsx`: Bảng thanh tra tham số điều khiển theo từng thiết bị và bộ phận.
  - `src/components/common/EquipmentHoverCard.tsx`: Thẻ nổi Glassmorphism xem trước thông số kỹ thuật, ảnh thật và mô tả khi rê chuột trong thư viện thiết bị.
  - `src/components/student/StudentEquipmentSidebar.tsx` và `StudentGuidedStepPanel.tsx`: Hướng dẫn học sinh từng bước bài học KHTN.
  - Thanh HUD đáy 2 dòng được kiểm định đạt 12/12 tiêu chí UX (`scripts/verify-ux-wiring-hud-controls.ts`).
- Tuy nhiên, một số dữ liệu trên Inspector và HoverCard hiện chưa tự động liên kết với bộ tính toán sai số động của các Solver và chưa đồng bộ hoàn toàn với tiến trình của Workflow thực nghiệm.

### 2. CHỨC NĂNG ĐÃ CÓ VÀ ĐÃ KIỂM CHỨNG
- **Kiểm định UX-01..12 (100% PASS):**
  - HUD dòng 1 chống vỡ dòng (`flex-nowrap`), cụm phím góc nhìn 90° cố định không bị rớt dòng.
  - Dòng 2 cuộn ngang mượt mà, ngăn kéo popover nổi không che khuất vùng thao tác 3D.
  - Vùng bấm hitbox cọc cắm điện được mở rộng (2.6 cm cho PSU, 2.8 cm cho Đèn), chống rung tay với ngưỡng dragThreshold = 9px.
  - Cột đỡ màn chắn và giá thấu kính có cao độ chuẩn xác, không che khuất trục quang học.
- **Thanh tra điều khiển (DeviceControlInspector):**
  - Hiển thị FSM tiếng Việt thân thiện với học sinh THCS (Thăng bằng, Mặt thoáng đồng mức, Đang đo điện áp DC, Lấy nét sắc nét...).
  - Render các thanh trượt điều khiển theo đúng min/max/step của `DevicePartSpec`.

### 3. CHỨC NĂNG CÒN THIẾU
- Chưa có tab hiển thị chuyên sâu về Độ không đảm bảo đo và Ngân sách sai số (Uncertainty Budget Tab) cho học sinh lớp 8-9 và giáo viên.
- Chưa tích hợp thông báo hướng dẫn thích ứng (Adaptive Guidance Prompts) khi học sinh thao tác sai (ví dụ: cảnh báo "Cần nối thêm dây cực âm (-) để tạo mạch kín").

### 4. LỖI HOẶC ĐIỂM CHƯA NHẤT QUÁN
- Khi người dùng điều khiển đồng thời trên 3D và trên bảng Inspector, cần đảm bảo trạng thái cập nhật mượt mà, không bị hiện tượng nhảy slider do giật vòng lặp cập nhật ngược (update feedback loop).
- Thẻ `EquipmentHoverCard` đôi khi bị tràn màn hình ở góc phải dưới nếu thiết bị có quá nhiều dòng thông số kỹ thuật.

### 5. ĐỀ XUẤT CẢI TIẾN
- Nâng cấp `DeviceControlInspector.tsx`:
  - Hiển thị trực tiếp kết quả tính toán khoa học từ `ScientificSolverRegistry` (bao gồm giá trị tính toán, đơn vị SI, và độ không đảm bảo đo $\pm \Delta X$).
  - Bổ sung chỉ số FSM động và cảnh báo an toàn tương ứng với trạng thái thực.
- Cập nhật `StudentGuidedStepPanel.tsx` để đọc kết quả từ `ExperimentWorkflows`, hiển thị trạng thái từng bước bài học KHTN (Hoàn thành / Đang thực hiện / Chưa đạt yêu cầu).
- Hoàn thiện thẻ `EquipmentHoverCard.tsx` tự động căn chỉnh vị trí hiển thị (flip position) tránh tràn viền màn hình.

### 6. FILE VÀ MODULE BỊ TÁC ĐỘNG
- `src/components/panels/DeviceControlInspector.tsx`
- `src/components/common/EquipmentHoverCard.tsx`
- `src/components/student/StudentGuidedStepPanel.tsx`

### 7. QUAN HỆ PHỤ THUỘC VỚI AGENT KHÁC
- Phụ thuộc Coordinator: Phê duyệt giao diện props và không thay đổi cấu trúc cây component chính.
- Phụ thuộc A1 (Controls): Nhận danh sách bộ phận điều khiển và giới hạn cơ học.
- Phụ thuộc A2 (Solvers): Nhận số đo, kết quả dẫn xuất và ngân sách sai số đo lường.
- Phụ thuộc A3 (Workflows): Nhận tiến trình các bước thực hành và điều kiện chuyển bước.
- Phụ thuộc A5 (Environment): Nhận thông số môi trường để hiển thị trên HUD.

### 8. TIÊU CHÍ NGHIỆM THU
- Bảng Inspector cập nhật đồng bộ 100% với trạng thái của thiết bị được chọn trên 3D.
- Không có hiện tượng giật cục slider hoặc desync giữa số đo trên màn hình 3D và giao diện UI.
- Thẻ HoverCard hiển thị đầy đủ thông tin, không tràn viền, hỗ trợ chế độ tương phản cao.

### 9. RỦI RO VÀ PHƯƠNG ÁN KIỂM SOÁT
- *Rủi ro:* Quá nhiều component React re-render khi giá trị solver cập nhật 60 lần/giây.
- *Kiểm soát:* Áp dụng `React.memo`, `useMemo` và cơ chế debounce / throttle cho các hiển thị số đo thập phân.
