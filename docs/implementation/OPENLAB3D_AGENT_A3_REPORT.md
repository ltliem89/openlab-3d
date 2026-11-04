# BÁO CÁO KIỂM TOÁN VÀ ĐỀ XUẤT TRIỂN KHAI — AGENT A3
## (AGENT A3: ASSEMBLY & EXPERIMENT WORKFLOWS)

> **Mã báo cáo:** `OPENLAB3D-AGENT-A3-REPORT-2026`  
> **Chuyên trách:** Ghép nối thiết bị, đồ thị lắp ráp (Assembly Graph), cổng kết nối và quy trình thí nghiệm liên thông  
> **Tài liệu tham chiếu:** Mockup 03 (`03_MOCKUP_GHEP_NOI_THIET_BI_VA_QUY_TRINH_THI_NGHIEM.md`), Tiêu chuẩn RWSS v1.1.1, 24 kịch bản ASM-01..24  
> **Ngày lập:** 04/11/2026

---

### 1. HIỆN TRẠNG THỰC TẾ
- Hệ thống lắp ráp hiện tại được hiện thực trong `src/three-runtime/AssemblySystem.ts`, bao gồm:
  - 15 loại cổng kết nối (Connectors) chuẩn xác từ `CONN_BALANCE_PAN` đến `CONN_LENS_HOLDER_SOCKET`.
  - Bộ quản lý đồ thị ghép nối `AssemblyGraphManager` theo dõi các node, edge và ràng buộc.
  - Bộ kiểm định lắp ráp đạt tuyệt đối 100/100 điểm với 24 kịch bản ASM (`scripts/verify-assembly-acceptance.ts`).
- Tuy nhiên, các quy trình thí nghiệm thực hành từng bước (Experiment Workflows WF-01 .. WF-06) hiện chỉ nằm dưới dạng mô tả tĩnh trong tài liệu mà chưa có module quản lý FSM quy trình thực thi động trong mã nguồn.

### 2. CHỨC NĂNG ĐÃ CÓ VÀ ĐÃ KIỂM CHỨNG
- **Kiểm định tương thích cổng:** Chấp nhận đúng loại đầu nối, từ chối ghép nối sai loại.
- **Dung sai bắt điểm (Snap Tolerance):** Bắt nhạy cọc cắm điện trong bán kính 6.5 cm, bắt ray quang học 4.0 cm.
- **Khóa bậc tự do (DoF):** Con trượt giá quang học bị khóa chuyển động 1D dọc trục ray.
- **Quản lý vị trí đơn nhất (Exclusive Slot Occupancy):** Khi đưa thấu kính mới vào ổ gá, tự động giải phóng thấu kính cũ về bàn.
- **Liên động mạch điện thực:** Dây dẫn chỉ truyền điện khi cắm đủ 2 đầu (+ và -) và khoảng cách giữa nguồn với đèn $\le 0.70\text{ m}$.
- **Giải phóng quan hệ:** Tháo dỡ thiết bị thu hồi toàn bộ liên kết, không để lại cạnh ma (orphan edges).

### 3. CHỨC NĂNG CÒN THIẾU
- Chưa có module `ExperimentWorkflows` chuẩn hóa để kiểm tra tính liên tục của bài thực hành:
  - Bước 1: Chuẩn bị thiết bị và kiểm tra điều kiện an toàn ban đầu.
  - Bước 2: Thiết lập cấu hình lắp ráp và kiểm tra topology.
  - Bước 3: Đóng nguồn / khởi chạy tác nhân vật lý.
  - Bước 4: Thu thập số liệu đo lường và tính toán sai số.
  - Bước 5: Đánh giá hoàn thành mục tiêu bài học.
- Chưa có cơ chế tự động phát hiện thí nghiệm thiếu thiết bị phụ trợ (ví dụ: có bình tràn nhưng quên đặt cốc hứng nước dưới vòi xả).

### 4. LỖI HOẶC ĐIỂM CHƯA NHẤT QUÁN
- Khi người dùng kéo một cụm thiết bị đã lắp ráp (như cụm giá quang học gồm ray, đèn và thấu kính), việc cập nhật vị trí đồng bộ đôi khi phụ thuộc vào thứ tự tick render.
- Một số định nghĩa kịch bản thực hành trong `mockCatalog.ts` chưa liên kết trực tiếp với đồ thị `AssemblyGraph`.

### 5. ĐỀ XUẤT CẢI TIẾN
- Tạo module mới `src/experiments/ExperimentWorkflows.ts`:
  - Định nghĩa 6 bài thực hành cốt lõi: WF-01 (Cân khối lượng), WF-02 (Đo thể tích bằng ống đong), WF-03 (Bình tràn), WF-04 (Lực kế lò xo), WF-05 (Đòn bẩy), WF-06 (Quang học).
  - Cung cấp hàm `validateWorkflowStep(workflowId, stepNumber, instances, graph)` trả về trạng thái hợp lệ, lỗi còn thiếu và hướng dẫn khắc phục.
- Mở rộng `AssemblyGraphManager` để xuất báo cáo Topology Snapshot cung cấp cho các Scientific Solvers.

### 6. FILE VÀ MODULE BỊ TÁC ĐỘNG
- `src/three-runtime/AssemblySystem.ts`
- `src/experiments/ExperimentWorkflows.ts` (Tạo mới)
- `src/experiments/index.ts` (Tạo mới)

### 7. QUAN HỆ PHỤ THUỘC VỚI AGENT KHÁC
- Phụ thuộc Coordinator: Phê duyệt danh mục Connector IDs bất biến và quy trình WF.
- Phụ thuộc A1 (Equipment Geometry): Điểm neo hình học (`localCoordinateM`) và anchor của các mesh.
- Handoff sang A2 (Scientific Solvers): Đồ thị mạch điện kín/hở, khoảng cách vật lý và liên kết nhiệt.
- Handoff sang A4 (UI/Guidance): Cung cấp trạng thái bước thí nghiệm và danh sách thiết bị còn thiếu để hiển thị trên `StudentGuidedStepPanel`.

### 8. TIÊU CHÍ NGHIỆM THU
- Bảo toàn 24/24 kịch bản ASM-01..24 đạt 100/100 điểm.
- 6/6 kịch bản quy trình WF-01..06 phát hiện chính xác khi lắp thiếu hoặc kết nối sai cổng.
- Không cho phép hệ thống tự xác nhận hoàn thành bước khi điều kiện vật lý chưa thỏa mãn.

### 9. RỦI RO VÀ PHƯƠNG ÁN KIỂM SOÁT
- *Rủi ro:* Đồ thị lắp ráp phát sinh chu trình lặp (circular dependency) làm treo thuật toán duyệt DFS/BFS.
- *Kiểm soát:* Áp dụng kiểm tra chu trình đồ thị có hướng (Directed Acyclic Graph check) trước khi tạo liên kết phụ thuộc cha-con.
