# BÁO CÁO KIỂM TOÁN VÀ ĐỀ XUẤT TRIỂN KHAI — AGENT A1
## (AGENT A1: EQUIPMENT GEOMETRY & PART CONTROLS)

> **Mã báo cáo:** `OPENLAB3D-AGENT-A1-REPORT-2026`  
> **Chuyên trách:** Cấu tạo 3D, chi tiết chuyển động, giới hạn cơ học và hồ sơ điều khiển thiết bị  
> **Tài liệu tham chiếu:** Mockup 01 (`01_MOCKUP_CAU_TAO_3D_VA_DIEU_KHIEN_TUNG_CHI_TIET.md`), Master Spec v3.0.0, Catalog 36 thiết bị  
> **Ngày lập:** 04/11/2026

---

### 1. HIỆN TRẠNG THỰC TẾ
- Danh mục 36 thiết bị (`OL3D-EQP-...`) đã được mô hình hóa trong `src/three-runtime/ProceduralLabModels.ts` với đầy đủ lưới đa thành phần (Anti-blocky >= 4 meshes/thiết bị, pbr materials, canvas textures cho nhãn/thước chia).
- Toàn bộ 36 thiết bị đã có hồ sơ cấu hình điều khiển cơ bản trong `src/device-control/DeviceControlProfilesData.ts`.
- Lớp tương tác chuột và chọn chi tiết raycast đã có trong `src/three-runtime/LabViewport3D.tsx` (xử lý con chạy ray quang học, núm vặn đèn nguồn, mâm cân, kẹp giữ).
- Tuy nhiên, một số thiết bị còn phụ thuộc vào việc render trực tiếp biến thể hình học trong `ProceduralLabModels.ts` mà chưa tách bạch rõ ràng giữa trạng thái động và thuộc tính tĩnh.

### 2. CHỨC NĂNG ĐÃ CÓ VÀ ĐÃ KIỂM CHỨNG
- **Kiểm định 7 cổng G1-G7:** 100% đạt chuẩn trên các module tiêu biểu (như `OL3D-EQP-LEV-0001`, `OL3D-EQP-HYD-0001`), y_min = 0.000m tiếp xúc mặt bàn chuẩn.
- **Hành trình & Cơ cấu điều khiển:**
  - Cân điện tử 500g: Phím TARE / Zero hoạt động, trừ bì chính xác `m_net = max(0, m_gross - m_tare)`.
  - Lực kế lò xo 5N: Độ dãn lò xo tuyến tính tỷ lệ thuận lực kéo theo định luật Hooke.
  - Bình thông nhau 3 nhánh: Mực chất lỏng đồng mức ở trạng thái tĩnh.
  - Bộ thí nghiệm đòn bẩy: Trục quay cân bằng mômen lực $\sum M_O = 0$.
  - Giá quang học & Đèn chiếu: Con trượt ray 1D di chuyển từ $0 \dots 100\text{ cm}$, trục quang chuẩn $y = 0.125\text{ m}$.

### 3. CHỨC NĂNG CÒN THIẾU
- Một số bộ phận nhỏ trên các thiết bị hóa học và sinh học (như khóa van phễu chiết, nắp bọc đèn cồn, ốc sơ cấp/vi cấp của kính hiển vi trên bàn 3D) chưa có đường liên kết điều khiển riêng biệt hai chiều với bảng Inspector.
- Thiếu cơ chế kiểm tra giới hạn cứng (hard stops) vật lý khi học sinh kéo chuột vượt quá tầm vươn hoặc góc quay cho phép của cơ cấu.

### 4. LỖI HOẶC ĐIỂM CHƯA NHẤT QUÁN
- Trong các phiên bản trước, một số thuộc tính điều khiển góc tới (`incidentAngleDeg`) trên đĩa chia độ quang học bị lẫn giữa góc tới và góc khúc xạ.
- Tên các sub-mesh trong một số mô hình 3D thủ tục chưa đồng nhất 100% với `nodeName` khai báo trong `DevicePartSpec`.

### 5. ĐỀ XUẤT CẢI TIẾN
- Bổ sung định nghĩa `PartControlSpec` chuẩn hóa, mapping chặt chẽ `partId` $\to$ `nodeName` $\to$ `stateKey`.
- Tích hợp bộ bảo vệ (`guards`) vào `DeviceControlEngine` để chặn thao tác khi thiết bị đang ở trạng thái khóa cơ học hoặc ngoài giới hạn hành trình.
- Đồng bộ phản hồi hình học (visual feedback) qua `applyInstanceStateToObject3D` mà không tạo thêm bộ đệm dữ liệu thừa.

### 6. FILE VÀ MODULE BỊ TÁC ĐỘNG
- `src/three-runtime/ProceduralLabModels.ts`
- `src/device-control/DeviceControlProfile.ts`
- `src/device-control/DeviceControlProfilesData.ts`
- `src/device-control/DeviceControlEngine.ts`

### 7. QUAN HỆ PHỤ THUỘC VỚI AGENT KHÁC
- Phụ thuộc Coordinator: Duyệt `DevicePartSpec` và schema `instanceState`.
- Handoff sang A2 (Scientific Solvers): Cung cấp các biến điều khiển động đầu vào (`incidentAngleDeg`, `jawOpeningMm`, `voltageSetting`, `tareOffsetG`).
- Handoff sang A3 (Assembly): Khớp nối tọa độ cục bộ của connector (`localCoordinateM`) với hình học thực.
- Handoff sang A4 (UI/Inspector): Cung cấp metadata hướng dẫn, nhãn tiếng Việt và giới hạn min/max/step.

### 8. TIÊU CHÍ NGHIỆM THU
- Mọi bộ phận tương tác khai báo `interactive` đều có phản hồi thị giác và cập nhật `instanceState`.
- Thao tác kéo chuột / nhập số bị chặn cứng tại min/max, không gây lỗi NaN hay vượt quá hành trình.
- Toàn bộ 36 thiết bị vượt qua bài kiểm tra toàn vẹn hình học không bị vỡ mesh hoặc lệch trục tọa độ.

### 9. RỦI RO VÀ PHƯƠNG ÁN KIỂM SOÁT
- *Rủi ro:* Cập nhật mesh quá thường xuyên gây sụt giảm khung hình (FPS lag).
- *Kiểm soát:* Chỉ cập nhật thuộc tính biến đổi (`rotation`, `position`, `scale`, `material.emissiveIntensity`) khi giá trị `instanceState` thực sự thay đổi; tránh re-create Geometry hoặc Texture.
