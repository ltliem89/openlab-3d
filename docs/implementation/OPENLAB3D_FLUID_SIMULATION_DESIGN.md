# TÀI LIỆU THIẾT KẾ MÔ PHỎNG NƯỚC & CHẤT LỎNG CHÂN THỰC
# (OPENLAB 3D ADVANCED FLUID SIMULATION DESIGN)

**Dự án:** OpenLab 3D — KHTN THCS & THPT  
**Module:** Three.js Fluid Simulation Architecture v2.0  
**Tác giả:** Fluid Simulation Specialist Agent  
**Ngày:** 04/11/2026  
**Trạng thái:** ACCEPTED FOR IMPLEMENTATION  

---

## 1. MỤC TIÊU & KIẾN TRÚC TỔNG THỂ

Tài liệu này xác lập thiết kế kỹ thuật chi tiết để khắc phục triệt để 6 khiếm khuyết được nêu trong tài liệu Kiểm toán `OPENLAB3D_FLUID_SIMULATION_AUDIT.md`.
Kiến trúc được chia làm 3 tầng độc lập, tích hợp chặt chẽ theo mô hình `ADD → ADAPT → INTEGRATE → VERIFY`:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CẤP ĐỘ 3: POURING DYNAMICS & CONSERVATION            │
│  - Parabolic Ballistic Stream Curve (CatmullRom / Bezier dưới g)       │
│  - Dynamic Flow Rate (Torricelli/Weir: Q = Cd * W * sqrt(2g*dh^3))     │
│  - Collision & Splash Impact Ripples trên mặt nước bình nhận           │
│  - Strict Volume Conservation Invariant: V_init = V_src + V_dst + V_spl│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                   CẤP ĐỘ 2: DYNAMIC SLOSH & HYDROSTATICS               │
│  - Second-order Damped Harmonic Oscillator: d2θ/dt2 + 2ζω dθ/dt + ω2θ   │
│  - Cylindrical Ungula & Conical Flask Internal Volume Integrals        │
│  - Wall Boundary Clamp (Strict Zero-Clipping qua thành thủy tinh)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                   CẤP ĐỘ 1: OPTICS & FLUID MATERIAL PROFILES           │
│  - Beer-Lambert Optical Depth Absorption (attenuationColor & Distance) │
│  - Pure Water Optical Index n = 1.333, High Transmission (0.94 - 0.96) │
│  - Multi-Fluid Profiles: clean-water, CuSO4, KMnO4, precipitate        │
│  - Geometry-Adaptive Meniscus (Góc thấm ướt thủy tinh 15° - 20°)       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. THIẾT KẾ CHI TIẾT CẤP ĐỘ 1 — QUANG HỌC & ĐA CHẤT LỎNG

### 2.1. Mô hình Quang học Beer-Lambert (Optical Absorption)
Theo định luật Beer-Lambert, cường độ ánh sáng sau khi truyền qua chiều dài đường quang $d$ trong chất lỏng:
$$I(\lambda, d) = I_0(\lambda) \cdot \exp\left(-\alpha(\lambda) \cdot d\right)$$

Trong Three.js `MeshPhysicalMaterial`:
- **Độ truyền sáng nền (`transmission`):** Được thiết lập ở mức cao $0.94 - 0.96$ để thể hiện bản chất chất lỏng trong suốt tuyệt đối.
- **Màu hấp thụ theo độ sâu (`attenuationColor`):** Sử dụng sắc xanh lơ dịu `#7dd3fc` hoặc `#38bdf8`. Khi tia sáng đi qua lớp nước mỏng ($d < 1\text{ cm}$), hấp thụ gần như bằng 0 $\rightarrow$ nước hoàn toàn không màu và trong suốt. Khi lớp nước dày lên ($d > 5\text{ cm}$), hấp thụ tích lũy tạo nên ánh xanh lam nhạt tự nhiên của nước trong hồ/bể thí nghiệm.
- **Khoảng cách suy giảm (`attenuationDistance`):** Đặt từ $0.18\text{ m}$ đến $0.35\text{ m}$ tùy theo đường kính vật chứa.
- **Chiết suất quang học (`ior`):** $n = 1.333$ cho nước tinh khiết; $n = 1.352$ cho dung dịch muối/axit.
- **Độ phản xạ Fresnel (`specularIntensity`, `clearcoat`):** `specularIntensity = 0.98`, `clearcoat = 1.0`, `clearcoatRoughness = 0.01` mang lại độ bóng gương đặc trưng của chất lỏng.

### 2.2. Hồ sơ Phân loại Đa Chất lỏng (Multi-Fluid Profiles)
Hệ thống hỗ trợ 4 hồ sơ chất lỏng cơ bản cho các bài thực hành KHTN:
1. `clean-water`: Nước sạch tinh khiết ($n = 1.333$, trong suốt, attenuation xanh ngọc nhạt).
2. `copper-sulfate` ($\text{CuSO}_4$): Dung dịch muối đồng màu xanh lam ngọc trong suốt ($n = 1.34$, transmission $0.85$, attenuation `#0284c7`).
3. `permanganate` ($\text{KMnO}_4$): Dung dịch thuốc tím oxi hóa ($n = 1.345$, transmission $0.78$, attenuation `#701a75`).
4. `precipitate-cloudy` ($\text{BaSO}_4$ / Tinh bột): Huyền phù đục trắng ($n = 1.36$, transmission $0.32$, roughness $0.22$, opacity $0.88$).

### 2.3. Mặt Khum Mao Dẫn Tự Nhiên (Adaptive Capillary Meniscus)
- Đối với nước trong ống đong/cốc thủy tinh: Nước làm ướt thành bình (góc tiếp xúc $\theta_c \approx 15^\circ - 20^\circ$).
- Độ dâng mao dẫn $h_c = \frac{2\gamma \cos\theta_c}{\rho g r}$.
- Hệ thống tự động tính bán kính cong mặt khum theo bán kính trong $r_{\text{in}}$ của vật chứa, tạo viền phản xạ ánh sáng nổi nhẹ tại đường tiếp xúc 3 pha (Thủy tinh — Nước — Không khí).

---

## 3. THIẾT KẾ CHI TIẾT CẤP ĐỘ 2 — ĐỘNG LỰC HỌC THỦY TĨNH & SLOSHING

### 3.1. Bộ Dao Động Điều Hòa Cản Nhớt (Damped Harmonic Slosh Oscillator)
Khi bình chứa bị nghiêng hoặc di chuyển, góc nghiêng của mặt nước $\theta_{\text{slosh}}$ phản ứng theo phương trình:
$$\ddot{\theta}_{\text{slosh}} + 2\zeta\omega_n \dot{\theta}_{\text{slosh}} + \omega_n^2 \theta_{\text{slosh}} = -\ddot{\theta}_{\text{vessel}}$$
Trong đó:
- $\omega_n = \sqrt{g \cdot \frac{1.84}{r_{\text{eff}}}}$: tần số dao động riêng của sóng dừng trong ống trụ.
- $\zeta \approx 0.18 - 0.25$: hệ số cản nhớt chất lỏng (nhớt động học $\nu = 1.0 \times 10^{-6}\text{ m}^2/\text{s}$).

### 3.2. Bảo Toàn Thể Tích Nêm Nghiêng (Cylindrical Ungula)
Khi góc nghiêng thay đổi:
1. **Chế độ bình thường ($h_{\text{upright}} \ge r \cdot |\tan\theta|$):** Tâm mặt nước giữ nguyên độ cao, mép nước dâng về phía thành thấp:
   $$z_{\text{lip}} = h_{\text{upright}} + r \cdot |\tan\theta|$$
2. **Chế độ nêm khô đáy ($h_{\text{upright}} < r \cdot |\tan\theta|$):** Nước tụ lại thành hình nêm (ungula) ở góc đáy thành:
   $$z_{\text{lip}} = \sqrt{2.85 \cdot h_{\text{upright}} \cdot r |\tan\theta|}$$

### 3.3. Khắc phục Triệt để Hiện tượng Xuyên Thành Bình (Zero-Clipping Boundary Clamp)
Toàn bộ tọa độ đỉnh $(x, y, z)$ của lưới nước `liquid_body` sau khi áp dụng ma trận thủy tĩnh được kiểm tra và kẹp chặt (clamp) bên trong mặt trụ trong $x^2 + z^2 \le r_{\text{in}}^2$ và chiều cao $0 \le y \le h_{\text{vessel}}$, đảm bảo không một đỉnh nào có thể xuyên qua lớp vỏ ngoài của thủy tinh trong bất kỳ góc nhìn phối cảnh nào.

---

## 4. THIẾT KẾ CHI TIẾT CẤP ĐỘ 3 — DÒNG CHẢY RÓT & BẢO TOÀN THỂ TÍCH

### 4.1. Điều kiện Bắt đầu Rót Dựa trên Hình học Thực
Dòng rót CHỈ xuất hiện khi:
$$\theta_{\text{tilt}} \ge \theta_{\text{pour}} = \arctan\left(\frac{h_{\text{lip}} - h_{\text{liquid}}}{r_{\text{lip}}}\right)$$
Vị trí phát sinh dòng rót $\vec{P}_{\text{spout}}$ được neo chính xác tại tọa độ World Space của miệng vòi rót (`pouring_lip`).

### 4.2. Quỹ Đạo Dòng Nước Cong Parabol
Dòng nước không còn là thanh trụ thẳng mà là đường cong tham số 3D dưới tác dụng của gia tốc trọng trường $g$:
$$\vec{r}(t) = \vec{P}_{\text{spout}} + \vec{v}_0 t + \frac{1}{2}\vec{g} t^2$$
Đường kính dòng nước thon dần từ miệng bình xuống điểm va chạm theo phương trình bảo toàn lưu lượng:
$$d(y) = d_0 \left(1 + \frac{2g(y_{\text{spout}} - y)}{v_0^2}\right)^{-1/4}$$

### 4.3. Tương tác Va chạm & Gợn Sóng Mặt Nước Nhận
Khi dòng nước tiếp xúc với mặt thoáng của bình nhận:
- Xác định điểm va chạm $\vec{P}_{\text{impact}} = (x_{\text{dest}}, y_{\text{dest\_surface}}, z_{\text{dest}})$.
- Kích hoạt hệ thống sóng tròn đồng tâm (concentric ripple wave) lan tỏa từ $\vec{P}_{\text{impact}}$ trên mặt khum bình nhận.
- Mực nước trong bình nhận dâng lên mượt mà theo đúng thể tích nhận được.

### 4.4. Xử lý Tràn & Bất biến Bảo toàn Thể tích (Conservation Invariant)
Hệ số bảo toàn thể tích nghiêm ngặt:
$$V_{\text{initial}} = V_{\text{source}}(t) + V_{\text{received}}(t) + V_{\text{spilled}}(t)$$
- Nếu miệng bình nhận không nằm dưới điểm rơi của dòng nước, lượng nước chảy ra sẽ chuyển thành $V_{\text{spilled}}$, tạo thành một vệt nước loang phản quang trên mặt bàn gỗ kèm âm thanh giọt nước rơi.
- Bình nhận chỉ được tăng thể tích khi dòng nước thực sự đi xuyên qua mặt cắt phẳng của miệng bình nhận.
