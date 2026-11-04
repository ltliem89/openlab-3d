# BÁO CÁO KIỂM TOÁN VÀ ĐỀ XUẤT TRIỂN KHAI — AGENT A5
## (AGENT A5: LAB ENVIRONMENT & PHYSICAL CONTEXT)

> **Mã báo cáo:** `OPENLAB3D-AGENT-A5-REPORT-2026`  
> **Chuyên trách:** Môi trường phòng thí nghiệm 3D, bối cảnh vật lý, hệ tọa độ thế giới và ma trận phụ thuộc môi trường  
> **Tài liệu tham chiếu:** Mockup 05 (`05_MOCKUP_MOI_TRUONG_PHONG_LAB_VAT_LY_TUONG_TAC.md`), Master Spec v3.0.0, Mô hình 13 biến cấp phòng  
> **Ngày lập:** 04/11/2026

---

### 1. HIỆN TRẠNG THỰC TẾ
- Không gian phòng thí nghiệm và bàn thực hành chuẩn SI đã được hiện thực trong `src/three-runtime/LabEnvironmentEngine.ts`:
  - Kích thước phòng: $12.0\text{ m} \times 8.0\text{ m} \times 3.6\text{ m}$, sàn tại $y = 0.000\text{ m}$.
  - Mặt bàn thực hành: $2.40\text{ m} \times 0.75\text{ m}$, cao độ mặt trên cố định $y = 0.820\text{ m}$ (`BENCH_SURFACE_Y = 0.82`).
  - Hệ tọa độ kép: Hệ tọa độ thế giới Three.js (gốc tâm sàn) và Hệ trục góc bàn $O(0,0,0)$ tại góc sau-trái mặt bàn.
  - Bộ 13 biến môi trường lõi cấp phòng (`INITIAL_ENVIRONMENT_VARIABLES`) đã được định nghĩa.
- Tuy nhiên, trong Mockup 05 có sự xuất hiện của danh sách 25 biến (gộp 13 biến phòng và 12 thuộc tính mẫu vật), gây nguy cơ nhập nhằng nếu xem toàn bộ 25 biến là biến toàn cục cấp phòng.

### 2. CHỨC NĂNG ĐÃ CÓ VÀ ĐÃ KIỂM CHỨNG
- **Cao độ và ranh giới mặt bàn:** Bàn thí nghiệm và vùng đặt thiết bị (clearance 3 cm mép bàn) được xác định chính xác; các bài kiểm tra điểm tựa $y_{min} = 0.000\text{ m}$ (trên mặt bàn tương ứng $y_{world} = 0.820\text{ m}$) đạt chuẩn.
- **Hệ tọa độ chuyển đổi:** Chuyển đổi qua lại giữa World Coords và Bench Corner Coords được bảo toàn với sai số $< 1\text{ mm}$.
- **Bộ lọc động lực học tay cầm (Spring Follower):** Giảm rung tay khi kéo thả mô hình trong không gian 3D.
- **13 biến môi trường toàn cầu:** Nhiệt độ không khí (25°C), Độ ẩm (60%), Áp suất khí quyển (101.325 kPa), Trọng lực (9.80665 m/s²), Ánh sáng (500 lux), Tốc độ gió (0 m/s)... được quản lý tập trung.

### 3. CHỨC NĂNG CÒN THIẾU
- Chưa có cấu trúc dữ liệu tách biệt hình thức giữa:
  1. Biến cấp phòng toàn cục (Global Room Environment - 13 biến).
  2. Thuộc tính mẫu vật (Sample-Scoped Properties - 12 thuộc tính: pH, TDS, độ đục, độ mặn, nhiệt độ riêng của mẫu...).
  3. Trường cục bộ (Local Fields: ngọn lửa đèn cồn, chùm tia laser, từ trường cục bộ của nam châm).
- Ma trận đăng ký phụ thuộc (Device-Environment Coupling Matrix) hiện chưa có hàm kiểm tra tự động để ngăn biến môi trường rò rỉ sang thiết bị không đăng ký phụ thuộc.

### 4. LỖI HOẶC ĐIỂM CHƯA NHẤT QUÁN
- Khi người dùng thay đổi độ rọi phòng (`illuminanceLux`), cần bảo đảm chỉ tác động đến độ tương phản quang học và cảm biến quang, không làm thay đổi vật lý của các bài thí nghiệm nhiệt học hoặc cơ học.
- Một số mẫu chất lỏng trong các bình chứa trước đây lấy trực tiếp nhiệt độ phòng mà không có thuộc tính nhiệt độ dung dịch riêng biệt (`sampleTemperatureC`).

### 5. ĐỀ XUẤT CẢI TIẾN
- Nâng cấp `src/three-runtime/LabEnvironmentEngine.ts`:
  - Khẳng định mô hình phân tầng chuẩn mực 3 cấp:
    - Tier A: `GlobalRoomEnvironment` (13 biến bất biến cấp phòng).
    - Tier B: `SampleEnvironmentProperties` (12 thuộc tính gắn vào instance mẫu vật).
    - Tier C: `LocalFieldZone` (trường nhiệt, trường quang, trường từ cục bộ).
  - Triển khai `DeviceEnvironmentCouplingManager`: Cho phép thiết bị đăng ký danh sách biến môi trường phụ thuộc (`affectedSubsystems`), chặn triệt để các tác động môi trường không có cơ sở khoa học.
- Bổ sung các preset môi trường điển hình: Phòng chuẩn 25°C, Phòng tối quang học (Dark Room - 8 lux), Vùng núi cao (Áp suất thấp 70 kPa), Phòng có gió (v_air = 2.5 m/s).

### 6. FILE VÀ MODULE BỊ TÁC ĐỘNG
- `src/three-runtime/LabEnvironmentEngine.ts`
- `src/components/modals/LabEnvironmentSpecModal.tsx`

### 7. QUAN HỆ PHỤ THUỘC VỚI AGENT KHÁC
- Phụ thuộc Coordinator: Phê duyệt danh sách 13 biến phòng chuẩn và 12 thuộc tính mẫu.
- Handoff sang A2 (Scientific Solvers): Cung cấp snapshot môi trường đã lọc theo đúng các biến mà solver đăng ký phụ thuộc.
- Handoff sang A1 (Equipment Geometry): Cung cấp ranh giới mặt bàn và vùng đặt thiết bị an toàn.
- Handoff sang A4 (UI): Cung cấp dữ liệu môi trường để hiển thị trên HUD và Modal cài đặt phòng.

### 8. TIÊU CHÍ NGHIỆM THU
- Thay đổi biến môi trường chỉ làm thay đổi số đo của các thiết bị có đăng ký phụ thuộc (ví dụ: thay đổi $g \to$ chỉ thay đổi lực kế và cân, không làm thay đổi điện áp nguồn).
- Phục hồi preset môi trường trả toàn bộ hệ thống về baseline chuẩn mà không gây trôi dữ liệu.
- Kích thước bàn, phòng và hệ tọa độ SI hoàn toàn nhất quán với Master Spec v3.0.0.

### 9. RỦI RO VÀ PHƯƠNG ÁN KIỂM SOÁT
- *Rủi ro:* Học sinh vô tình đẩy biến môi trường về giá trị vô lý (như áp suất âm hoặc độ ẩm > 100%) gây crash các hàm giải toán học.
- *Kiểm soát:* Bắt buộc kiểm tra biên (Clamping & Domain Guard) ngay tại tầng cập nhật của `LabEnvironmentEngine`.
