# BÁO CÁO CÁC VẤN ĐỀ TỒN ĐỌNG VÀ ĐỊNH HƯỚNG GIAI ĐOẠN TIẾP THEO
## (OPENLAB 3D REMAINING ISSUES & ROADMAP REPORT)

> **Mã tài liệu:** `OL3D-REMAINING-ISSUES-2026`  
> **Phiên bản:** `v3.1.0`  
> **Chủ trì thẩm định:** OpenLab 3D Coordinator Agent  
> **Ngày lập:** 04/11/2026  
> **Mục tiêu:** Nhận diện minh bạch các hạn chế kỹ thuật hiện hữu, dữ liệu mang tính giả định/minh họa cần đối chiếu thực nghiệm, và lộ trình phát triển giai đoạn kế tiếp.

---

## 1. PHÂN LOẠI CÁC VẤN ĐỀ VÀ HẠN CHẾ HIỆN TẠI

Theo đúng nguyên tắc minh bạch khoa học của OpenLab 3D (Không tự suy diễn, không làm giả số liệu):

### 1.1. Các tham số mang trạng thái `ILLUSTRATIVE` hoặc `REPORTED` (Cần đối chiếu thực tế)
1. **Khối lượng chuẩn của một số mẫu vật:** Các mẫu vật hình học (`solid-cylinder`, `solid-sphere`, `solid-block`) hiện mang khối lượng danh định theo công thức hình học $\times$ khối lượng riêng lý thuyết. Trong môi trường phòng học thực tế, khối lượng có thể dung sai $\pm 2\dots 5\%$ do gia công cơ khí hoặc độ xốp vật liệu.
2. **Hệ số ma sát trượt và ma sát nghỉ ($\mu$):** Giá trị $\mu = 0.30$ giữa đế gỗ và mặt phẳng nghiêng trong bài học lực ma sát hiện được gán theo thông số sách giáo khoa tham khảo, chưa đo đạc trên bề mặt melamine của bàn thí nghiệm thực tế.
3. **Độ nhớt chất lỏng ($\eta$):** Dầu ăn và glycerin hiện sử dụng giá trị bảng tra cứu vật lý ở 25°C, chưa mô hình hóa sự phụ thuộc phi tuyến tính của độ nhớt theo nhiệt độ cao ($T > 60^\circ\text{C}$).

### 1.2. Các giới hạn tính toán mô phỏng (Known Theoretical Limits)
1. **Mô hình thấu kính mỏng Gauss:** `OpticsSolver` hiện sử dụng gần đúng góc tới nhỏ (paraxial approximation / Gaussian optics) cho thấu kính mỏng. Khi chùm tia tới ở rìa thấu kính ($h > 0.8 R$), hiện tượng cầu sai (spherical aberration) chưa được vẽ chi tiết mà chỉ hiển thị ảnh hưởng làm mờ viền ảnh.
2. **Động lực học chất lỏng phức tạp (Navier-Stokes):** Dòng chảy chất lỏng khi xả từ vòi bình tràn vào cốc được mô phỏng ở mức bảo toàn thể tích và tốc độ dòng chảy trung bình theo định luật Torricelli, không tính toán nhiễu loạn động học vi mô (CFD turbulence) để bảo đảm hiệu năng 60 FPS trên trình duyệt WebGL.
3. **Dây dẫn điện uốn cong mềm (Soft-body physics):** Dây cáp điện nối giữa nguồn và đèn hiện sử dụng đường cong Catena/Bezier 3D tĩnh liên kết 2 đầu cọc cắm, chưa có mô phỏng va chạm vật lý dây mềm toàn phần khi vướng vào các vật khác trên bàn.

---

## 2. KẾ HOẠCH BẢO TRÌ VÀ PHÒNG NGỪA RỦI RO (RISK MANAGEMENT)

| Nhận diện rủi ro | Cấp độ | Tác động hệ thống | Phương án kiểm soát đã kích hoạt |
|---|:---:|---|---|
| **Sụt giảm FPS khi thêm nhiều thiết bị** | P2 | Giao diện bị giật trên thiết bị di động | Đã áp dụng `InstancedMesh` và `CanvasTexture zero-leak`, giới hạn render vòng lặp chỉ khi có `instanceState` thay đổi |
| **Xung đột khi nhiều thiết bị tranh chấp slot** | P1 | Hai thiết bị lồng ghép xuyên lấn nhau | Đã thiết lập `Exclusive Occupancy Manager` trong `AssemblyGraphManager`, tự động đẩy vật cũ về vị trí an toàn |
| **Học sinh nhập số đo ngoài phạm vi** | P2 | Hàm toán học bị lỗi chia cho 0 hoặc NaN | Đã thiết lập `Guards` và `Math.max/min Clamping` trong tất cả 5 bộ giải `scientific-solvers` |
| **Biến môi trường rò rỉ tác động sai** | P1 | Thay đổi trọng lực làm thay đổi điện áp | Đã xây dựng `DeviceEnvironmentCouplingManager`, chặn tuyệt đối các biến môi trường không có đăng ký phụ thuộc |

---

## 3. LỘ TRÌNH PHÁT TRIỂN GIAI ĐOẠN KẾ TIẾP (PHASE 4 ROADMAP)

1. **Giai đoạn 4.1: Mở rộng đầy đủ 6/6 Workflow bài học:**
   - Hoàn thiện giao diện tương tác từng bước cho WF-02 (Ống đong), WF-03 (Bình tràn), WF-04 (Lực kế lò xo) và WF-05 (Đòn bẩy).
   - Tích hợp âm thanh phản hồi giáo dục (tiếng click công tắc, tiếng bíp buzzer thông mạch, tiếng nước chảy).
2. **Giai đoạn 4.2: Tích hợp phòng thí nghiệm thực tế tăng cường (WebXR / AR):**
   - Đưa bàn thí nghiệm ảo lên mặt bàn thật thông qua camera WebXR trên điện thoại di động / tablet của học sinh.
3. **Giai đoạn 4.3: Hệ thống chấm điểm tự động bài thực hành của học sinh:**
   - Dựa trên nhật ký hành động (`LabEventLog`), tự động đánh giá thao tác đúng quy trình, kỹ năng trừ bì TARE, kỹ năng đọc vạch chia tránh thị sai, và xuất báo cáo PDF cho giáo viên.

---
*Tài liệu này xác lập rõ ranh giới kỹ thuật hiện tại, bảo đảm mọi bên tham gia phát triển đều nắm vững những gì hệ thống đã hoàn thiện và những gì cần mở rộng tiếp theo.*
