# BÁO CÁO KIỂM TOÁN VÀ ĐỀ XUẤT TRIỂN KHAI — AGENT A2
## (AGENT A2: SCIENTIFIC SOLVERS & METROLOGY)

> **Mã báo cáo:** `OPENLAB3D-AGENT-A2-REPORT-2026`  
> **Chuyên trách:** Bộ giải khoa học, định luật vật lý/hóa học, đo lường, ngân sách sai số và FSM  
> **Tài liệu tham chiếu:** Mockup 02 (`02_MOCKUP_BO_GIAI_KHOA_HOC_DINH_LUAT_VA_DO_LUONG.md`), Master Spec v3.0.0, 24 kịch bản SCI-01..24  
> **Ngày lập:** 04/11/2026

---

### 1. HIỆN TRẠNG THỰC TẾ
- Các định luật vật lý đã được kiểm chứng thông qua bộ kịch bản 24/24 SCI tests (`scripts/verify-scientific-interaction.ts`).
- Tuy nhiên, mã nguồn tính toán khoa học hiện đang bị phân tán:
  - Bộ giải mạch điện (`solveElectricalCircuit`) nằm trong `src/three-runtime/AssemblySystem.ts`.
  - Bộ giải định luật khúc xạ ánh sáng Snell nằm trực tiếp trong `src/three-runtime/ProceduralLabModels.ts` và `LabViewport3D.tsx`.
  - Công thức tính toán và FSM được ghi rải rác trong `DeviceControlProfilesData.ts` và `scripts/scientific-profiles.ts`.
- Chưa có thư mục chuyên biệt `src/scientific-solvers/` với các interface chuẩn hóa `SolverInput` và `SolverResult`.

### 2. CHỨC NĂNG ĐÃ CÓ VÀ ĐÃ KIỂM CHỨNG
- **Nhóm P01 (Decoupled Switches):** Công tắc nguồn độc lập với công tắc đèn, không gây deadlock.
- **Nhóm P02 (Causal Illumination):** Đèn chỉ sáng khi mạch kín, nguồn bật, công tắc bật, và điện áp $U \ge 2.5\text{ V}$.
- **Nhóm P03 (Ray Coordinate Fidelity):** Tia sáng phát ra từ tọa độ thực của nguồn đèn, không nhảy tọa độ ma.
- **Nhóm P04 (Passive Optics):** Bản bán nguyệt không tự phát sáng nếu không có chùm tia tới.
- **Nhóm P05 (Electromagnetic Induction):** Cuộn dây LED chỉ sáng khi nam châm chuyển động ($d\Phi/dt \neq 0$), đổi chiều theo định luật Lenz.
- **Nhóm P06 (Thermodynamics):** Bát sứ chỉ tăng nhiệt độ khi đặt đúng trên ngọn lửa đèn cồn; kéo ra xa thì hạ nhiệt về nhiệt độ phòng 25°C.
- **Nhóm P07 (Metrology & DMM):** Đồng hồ vạn năng hiện 0.00 V khi que đo hở mạch, hiện "O.L" ở thang đo điện trở hở mạch.
- **Nhóm P08 (Physical Cabling):** Dây dẫn dài quá 0.70m tự động tuột mạch.

### 3. CHỨC NĂNG CÒN THIẾU
- Chưa có module tính toán tập trung cho:
  - Ngân sách sai số (Error Budget), độ không đảm bảo đo chuẩn ($u_A, u_B, U_{expanded}$) theo ISO/IEC Guide 98-3 (GUM).
  - Lượng tử hóa độ chia nhỏ nhất (Least Count quantization) gắn liền với mô hình nhiễu lặp lại có thể tái lập bằng hạt giống ngẫu nhiên (seeded repeatable noise).
  - Bộ giải áp suất chất lỏng thủy tĩnh tổng quát cho các hình dạng bình chứa khác nhau.

### 4. LỖI HOẶC ĐIỂM CHƯA NHẤT QUÁN
- Logic tính derived outputs hiện được lặp lại tại hai nơi: hàm `evaluateOutputs` trong `DeviceControlProfilesData.ts` và logic nội bộ trong các file test / viewport.
- Đơn vị tính toán trong một số profile chưa quy đổi triệt để về hệ đơn vị SI trước khi giải phương trình.

### 5. ĐỀ XUẤT CẢI TIẾN
- Xây dựng thư mục chuẩn `src/scientific-solvers/`:
  - `types.ts`: Định nghĩa typed `SolverInput`, `SolverResult`, `UncertaintyBudget`.
  - `CircuitSolver.ts`: Độc lập hóa giải thuật mạch điện Ohm/Kirchhoff.
  - `OpticsSolver.ts`: Giải hình học tia, Snell, thấu kính mỏng Gauss, tán sắc.
  - `FluidThermalSolver.ts`: Giải thủy tĩnh, Archimedes, truyền nhiệt, cân bằng nhiệt.
  - `ElectromagneticInductionSolver.ts`: Giải Faraday-Lenz và dòng cảm ứng.
  - `MechanicsSolver.ts`: Giải cân bằng đòn bẩy, định luật Hooke, khối lượng tịnh.
  - `MetrologyEngine.ts`: Tính toán sai số dụng cụ, ĐCNN, nhiễu đo lặp lại.
  - `ScientificSolverRegistry.ts`: Đầu mối điều phối tập trung cho toàn hệ thống.
- Cập nhật `DeviceControlProfilesData.ts` để gọi trực tiếp các Solver từ Registry.

### 6. FILE VÀ MODULE BỊ TÁC ĐỘNG
- `src/scientific-solvers/` (Toàn bộ các file mới).
- `src/device-control/DeviceControlProfilesData.ts` (Ủy thác tính toán cho Solvers).
- `src/three-runtime/AssemblySystem.ts` (Kế thừa và forward sang CircuitSolver).

### 7. QUAN HỆ PHỤ THUỘC VỚI AGENT KHÁC
- Phụ thuộc Coordinator: Phê duyệt schema `SolverInput` và `SolverResult`.
- Phụ thuộc A1 (Controls): Nhận trạng thái phần cứng (`instanceState`) từ các bộ phận điều khiển.
- Phụ thuộc A3 (Assembly): Nhận đồ thị topo (`AssemblyTopology`) để biết liên kết mạch điện, ray quang học, bình hứng.
- Phụ thuộc A5 (Environment): Nhận các biến môi trường chuẩn ($T_{air}, g, P_{atm}, \text{lux}, \text{v\_air}$).
- Handoff sang A4 (UI/Inspector): Cung cấp kết quả tính toán khoa học chuẩn xác kèm theo sai số đo lường.

### 8. TIÊU CHÍ NGHIỆM THU
- Toàn bộ 24/24 kịch bản SCI tiếp tục đạt PASS 100%.
- Không có số liệu hard-code hiển thị; mọi kết quả đo đều truy xuất được công thức và nguồn gốc.
- Các bài kiểm tra đơn vị cho 5 bộ giải cốt lõi đạt kết quả xác định (deterministic) với sai số số học $\le 10^{-6}$.

### 9. RỦI RO VÀ PHƯƠNG ÁN KIỂM SOÁT
- *Rủi ro:* Tính toán vi phân hoặc ma trận mạch điện trong vòng lặp animation gây đơ giao diện.
- *Kiểm soát:* Áp dụng giải thuật đại số đóng (closed-form equations) và lưu cache kết quả (`inputHash`) khi đầu vào không thay đổi.
