# BÁO CÁO KIỂM TOÁN HỆ THỐNG MÔ PHỎNG NƯỚC & CHẤT LỎNG (FLUID SIMULATION AUDIT)
**Dự án:** OpenLab 3D — Phòng Thí Nghiệm Khoa Học Tự Nhiên 3D  
**Vị trí:** Chuyên viên Mô phỏng Chất lỏng (Fluid Simulation Specialist Agent)  
**Thời gian:** 04/11/2026  
**Trạng thái:** HOÀN THÀNH KIỂM TOÁN (AUDIT COMPLETE)

---

## 1. TỔNG QUAN HIỆN TRẠNG TRƯỚC KHI NÂNG CẤP

Hệ thống mô phỏng chất lỏng trong OpenLab 3D hiện được phân bổ chính giữa hai tệp mã nguồn:
- `src/three-runtime/ProceduralLabModels.ts`: Chịu trách nhiệm khởi tạo vật liệu (`createWaterMaterial`), hình học cột nước (`liquid_body`), mặt khum (`surface_cap`, `meniscus_wall`) và giải thuật thủy tĩnh biến dạng đỉnh (`syncHydrostaticLiquidToGravity`).
- `src/three-runtime/LabViewport3D.tsx`: Quản lý vòng lặp kết xuất Three.js, thao tác kéo xoay nghiêng bình (Tinkercad-style tilt gizmo), phát hiện va chạm rót nước giữa các bình lân cận, tạo dòng rót (`active_pouring_stream_group`) và cam kết thể tích sang `App.tsx`.

Sau khi kiểm toán toàn diện mã nguồn và hình ảnh thực tế, nhóm chuyên gia xác định 6 vấn đề trọng yếu khiến trải nghiệm chất lỏng chưa đạt độ chân thực:

---

## 2. CHI TIẾT CÁC VẤN ĐỀ TRỌNG YẾU

### 2.1. Quang học & Vật liệu: Màu sắc xanh đồng nhất, thiếu chiều sâu quang học
- **Hiện trạng:** Hàm `createWaterMaterial` sử dụng `color: 0x0284c7`, `emissive: 0x0284c7`, `emissiveIntensity: 0.20`, `transmission: 0.80`, `opacity: 0.85`.
- **Nguyên nhân vật lý:** 
  - Nước nguyên chất trong tự nhiên và phòng thí nghiệm là môi trường trong suốt đẳng hướng với chiết suất $n \approx 1.333$. Nước không tự phát sáng (`emissive`). Việc gán `emissiveIntensity = 0.20` khiến nước trông như một khối gel phát quang hoặc khối nhựa màu xanh lam đục.
  - Thiếu mô hình hấp thụ quang học theo định luật Beer-Lambert ($I = I_0 e^{-\alpha \cdot d}$): Lớp nước mỏng gần thành hoặc đáy bình có đường truyền ánh sáng ngắn $d \rightarrow 0$ nên phải hoàn toàn trong suốt, không có màu; chỉ khi lớp nước có độ sâu quang học lớn ($d > 5\text{ cm}$) thì ánh sáng đỏ mới bị hấp thụ và để lại sắc xanh lơ nhạt tự nhiên.
  - Three.js `MeshPhysicalMaterial` hỗ trợ `attenuationColor` và `attenuationDistance`, nhưng hệ thống hiện tại chưa cấu hình thuộc tính này, dẫn đến màu sắc bị phân bố phẳng đều trên toàn bộ thể tích.
  - Không có sự phân biệt giữa nước sạch tinh khiết, dung dịch hóa chất có màu (như $\text{CuSO}_4$ xanh lam đậm, $\text{KMnO}_4$ tím) và dung dịch huyền phù đục ($\text{BaSO}_4$).

### 2.2. Mặt khum mao dẫn (Meniscus) chưa tương thích với đa dạng hình học vật chứa
- **Hiện trạng:** Hàm `addConcaveMeniscusAndRipples` chỉ tạo một đĩa tròn phẳng `RingGeometry` và một hình trụ ngắn `CylinderGeometry` cố định.
- **Nguyên nhân:**
  - Đối với các bình có tiết diện thay đổi như bình tam giác Erlenmeyer hay chén sứ/bát nung, mặt khum tròn bị lệch khỏi hình học thực tế.
  - Độ cong tiếp xúc thành bình (góc thấm ướt $\theta \approx 15^\circ - 20^\circ$ đối với nước/thủy tinh) chưa thay đổi theo bán kính trong của ống nghiệm nhỏ ($\approx 8\text{ mm}$) so với cốc lớn ($\approx 35\text{ mm}$).

### 2.3. Động lực học mặt thoáng: Thiếu quán tính dao động (Sloshing & Damping)
- **Hiện trạng:** `syncHydrostaticLiquidToGravity` tính toán độ nghiêng mặt nước tức thời dựa trên góc xoay bình $kx = -\tan(\text{rotZ})$.
- **Nguyên nhân:**
  - Khi người dùng xoay bình nhanh hoặc dừng đột ngột, mặt nước dừng ngay lập tức mà không có dao động sóng tắt dần (damped harmonic oscillation).
  - Thiếu phương trình dao động bậc hai: $\ddot{\theta}_{\text{slosh}} + 2\zeta\omega_n\dot{\theta}_{\text{slosh}} + \omega_n^2 \theta_{\text{slosh}} = -\ddot{\theta}_{\text{vessel}}$, khiến cảm giác quán tính khối lượng của chất lỏng bị triệt tiêu.

### 2.4. Hình học dòng chảy khi rót (Pouring Stream Dynamics)
- **Hiện trạng:** Trong `LabViewport3D.tsx`, dòng nước rót được tạo bởi một hình trụ đơn `pour_outer` kéo dài từ vị trí mép bình đến tâm bình nhận.
- **Nguyên nhân:**
  - Dòng nước thực tế chịu tác dụng của gia tốc trọng trường $g = 9.8\text{ m/s}^2$, tạo thành quỹ đạo cong parabol, không phải một thanh trụ thẳng cứng.
  - Định luật bảo toàn lưu lượng liên tục ($A_1 v_1 = A_2 v_2$) đòi hỏi tiết diện dòng nước phải co thắt thon dần khi rơi xuống do vận tốc tăng dần ($v = \sqrt{v_0^2 + 2gh}$).
  - Thiếu hiện tượng gợn sóng lan tỏa đồng tâm đa pha khi dòng nước cắm vào mặt nước trong bình nhận.

### 2.5. Bảo toàn thể tích & Thất thoát khi rót (Volume Conservation & Spillage)
- **Hiện trạng:** Khi rót vào bình nhận, nếu không có bình nhận nào ở gần, hệ thống tính `dSpill` nhưng chưa thể hiện trực quan vũng nước tràn trên mặt bàn và chưa có bảng ghi nhận chỉ số bảo toàn thể tích chính xác.
- **Yêu cầu bắt buộc:** $V_{\text{initial}} = V_{\text{source}} + V_{\text{received}} + V_{\text{spilled}}$.

---

## 3. KẾ HOẠCH NÂNG CẤP KIẾN TRÚC THEO 3 CẤP ĐỘ

1. **Cấp độ 1 — Tĩnh & Quang học (Static Optical Realism):**
   - Triển khai động cơ vật liệu chất lỏng `FluidMaterialEngine` với mô hình hấp thụ Beer-Lambert (`attenuationColor`, `attenuationDistance`).
   - Cung cấp 4 profile chất lỏng chuẩn: Nước sạch trong suốt (`clean-water`), Dung dịch xanh lam (`copper-sulfate`), Dung dịch tím (`permanganate`), Dung dịch huyền phù đục (`precipitate-cloudy`).
   - Thiết kế lại mặt khum mao dẫn thích ứng kích thước và vật liệu bình chứa.

2. **Cấp độ 2 — Động lực học Thủy tĩnh (Dynamic Slosh Physics):**
   - Nâng cấp `syncHydrostaticLiquidToGravity` tích hợp bộ dao động điều hòa cản nhớt (second-order damped harmonic slosh oscillator).
   - Kiểm soát biên va chạm thành trong bình, đảm bảo không clipping hay xuyên thủng thành thủy tinh.

3. **Cấp độ 3 — Động học Rót & Bảo toàn (Pouring Ballistics & Conservation):**
   - Xây dựng dòng nước cong parabol tự nhiên theo trọng lực bằng `CatmullRomCurve3` với đường kính co thắt khí động học.
   - Hiệu ứng sóng va chạm đa tầng trên mặt nước bình nhận.
   - Xử lý vệt nước đổ trên mặt bàn khi rót ra ngoài, đảm bảo bất biến $V_{\text{initial}} = V_{\text{source}} + V_{\text{received}} + V_{\text{spilled}}$.
