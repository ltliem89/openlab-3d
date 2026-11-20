# LỘ TRÌNH CẢI TIẾN LÕI MÔ PHỎNG SỐ OPENLAB 3D
## HƯỚNG TỚI ĐỘ CHÂN THỰC TỰ NHIÊN (CARBON-REALISM ROADMAP)

> **Dự án:** OpenLab 3D — Phòng thí nghiệm khoa học ảo 3D KHTN THCS  
> **Tác giả:** Trịnh Nguyễn Tường Vy & Phan Bùi Giang Ngân  
> **Người hướng dẫn:** Thầy Lê Thanh Liêm  
> **Phiên bản tài liệu:** v2.5.0 (Cập nhật tháng 11/2026)  
> **Mục tiêu:** Nâng cấp độ chân thực của thành phần mô phỏng số đạt độ tiệm cận ngang bằng thực tế tự nhiên dựa trên **Mô hình Carbon** (đa góc nhìn con người thực nghiệm).

---

## MỤC LỤC
1. [Triết lý thiết kế & Mô hình Carbon](#1-triết-lý-thiết-kế--mô-hình-carbon)
2. [Bốn trục cải tiến mô phỏng trọng điểm](#2-bốn-trục-cải-tiến-mô-phỏng-trọng-điểm)
   - [Trục 1: Tính chân thật của Nước & Thủy động lực học vi mô](#trục-1-tính-chân-thật-của-nước--thủy-động-lực-học-vi-mô)
   - [Trục 2: Động lực học tương tác & Quán tính thao tác](#trục-2-động-lực-học-tương-tác--quán-tính-thao-tác)
   - [Trục 3: Đo lường thực nghiệm, Nhiễu tự nhiên & Sự cố vật liệu](#trục-3-đo-lường-thực-nghiệm-nhiễu-tự-nhiên--sự-cố-vật-liệu)
   - [Trục 4: Không gian 3D tinh gọn & Sư phạm trực quan](#trục-4-không-gian-3d-tinh-gọn--sư-phạm-trực-quan)
3. [Lộ trình thực hiện chi tiết 3 giai đoạn (Timeline & Milestones)](#3-lộ-trình-thực-hiện-chi-tiết-3-giai-đoạn)
4. [Ma trận kiểm định kỹ thuật & Tiêu chí nghiệm thu](#4-ma-trận-kiểm-định-kỹ-thuật--tiêu-chí-nghiệm-thu)
5. [Tổ chức thực hiện & Phân công trách nhiệm](#5-tổ-chức-thực-hiện--phân-công-trách-nhiệm)

---

## 1. TRIẾT LÝ THIẾT KẾ & MÔ HÌNH CARBON

Mô phỏng máy tính truyền thống thường rơi vào cái bẫy **"Toán học lý tưởng hóa"** (Idealized Physics): vật chuyển động không ma sát, nước rót như thỏi gel đặc trơn tru, cân điện tử đứng yên bất động ở con số tuyệt đối, và mọi thao tác chuột đều bám dính tức thời không quán tính.

**Mô hình Carbon** tiếp cận từ góc độ các chủ thể thực nghiệm bằng xương bằng thịt để định nghĩa lại sự chân thật:

```
                       ┌────────────────────────────────────────┐
                       │       MÔ HÌNH CARBON ĐA GÓC NHÌN       │
                       └───────────────────┬────────────────────┘
             ┌───────────────────┬─────────┴─────────┬───────────────────┐
             ▼                   ▼                   ▼                   ▼
     [1. Học sinh THCS]   [2. Giáo viên KHTN]  [3. Giám khảo ViSEF] [4. Chuyên gia Lab]
     "Cảm giác nặng nhẹ   "Sư phạm trực quan,  "Tính đúng khoa học, "Hậu quả sự cố &
      & độ linh động"      sai số tự nhiên"     Zero-Fabrication"    an toàn thao tác"
```

1. **Góc nhìn Học sinh THCS:** Cần cảm giác vật thể có trọng lượng ($F = m \cdot a$), nước có độ sóng sánh, có tiếng "tõm", có bọt khí sủi tăm.
2. **Góc nhìn Giáo viên KHTN:** Cần có sai số đo tự nhiên, màng nước bám dính thành cốc, yêu cầu căn chỉnh góc nhìn tránh thị sai đáy mặt khum.
3. **Góc nhìn Giám khảo ViSEF & Nhà Khoa học:** Đòi hỏi tính đúng đắn toán học khắt khe (Zero Fabrication), nghiệm Runge-Kutta bảo toàn năng lượng $\frac{\Delta E}{E} < 10^{-6}$, quang học Beer-Lambert và hiệu ứng tụ quang (Caustics).
4. **Góc nhìn Chuyên gia An toàn Lab:** Cần có hệ quả vật lý nhãn tiền khi làm sai (nứt vỡ khi sốc nhiệt, trào bắn nước khi rót quá cao).

---

## 2. BỐN TRỤC CẢI TIẾN MÔ PHỎNG TRỌNG ĐIỂM

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        4 TRỤC CẢI TIẾN MÔ PHỎNG SỐ OPENLAB 3D                          │
├──────────────────────────┬──────────────────────────┬──────────────────────────────────┤
│ TRỤC 1: NƯỚC CHÂN THỰC   │ TRỤC 2: QUÁN TÍNH THAO TÁC│ TRỤC 3: NHIỄU ĐO & VẬT LIỆU      │
│ • Vệt tụ quang Caustics  │ • Lực cản chuột F = m·a  │ • Nhiễu vi mô nền trên cân số    │
│ • Bọt khí Stokes nổi     │ • Thị sai ngắm Meniscus  │ • Trễ đàn hồi dão lò xo (Hooke)  │
│ • Đứt dòng giọt Pinch-off│ • Bắn tóe khi rót quá cao│ • Sốc nhiệt nứt vỡ thủy tinh     │
├──────────────────────────┴──────────────────────────┴──────────────────────────────────┤
│ TRỤC 4: SƯ PHẠM TRỰC QUAN & KHÔNG GIAN 3D KHÔNG CHE KHUẤT                               │
│ • Triệt tiêu bảng nổi 3D che bàn  • Error Bars (├──●──┤)  • Tua ngược ChronoCausal 60s │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### TRỤC 1: TÍNH CHÂN THẬT CỦA NƯỚC & THỦY ĐỘNG LỰC HỌC VI MÔ

#### 1.1. Vệt Tụ Quang Nước Lấp Lánh (Real-time Dynamic Water Caustics)
* **Nguyên lý:** Tia sáng khi khúc xạ qua mặt thoáng gợn sóng của cốc nước sẽ hội tụ thành các dải cường độ ánh sáng không đều (Caustic patterns) trên mặt bàn gỗ.
* **Mô hình toán:**
  $$I_{\text{caustic}}(x, z, t) = I_0 \cdot \det\left(\mathbf{I} - h \cdot \nabla^2 \eta(x, z, t)\right)$$
  với $\eta(x, z, t)$ là hàm độ cao mặt sóng sloshing và $h$ là độ sâu cột chất lỏng.
* **Giải pháp kỹ thuật:** Sử dụng Dynamic Light Projector Cookie chiếu trực giao xuống mặt bàn ngay dưới đáy cốc. Khi mặt nước dao động, texture sáng trên mặt gỗ uốn lượn nhịp nhàng theo tần số sóng.

#### 1.2. Bọt Khí Nổi Động Lực Học (Buoyant Bubble Particle System)
* **Nguyên lý:** Khi nhúng chìm vật mẫu hoặc khi nước đạt trên $85^\circ\text{C}$, các bọt khí li ti sinh ra và nổi lên mặt thoáng theo định luật Stokes:
  $$v_{\text{nổi}} = \frac{2}{9} \cdot \frac{(\rho_{\text{nước}} - \rho_{\text{khí}}) \cdot g \cdot r^2}{\eta_{\text{nước}}}$$
  với bán kính bọt khí $r \in [0{,}5\text{ mm} .. 1{,}5\text{ mm}]$, độ nhớt động lực học $\eta_{\text{nước}} \approx 1{,}002 \times 10^{-3}\text{ Pa}\cdot\text{s}$.
* **Giải pháp kỹ thuật:** Sinh $20 - 40$ hạt sprite cầu trong lòng nước chuyển động gia tốc hướng lên $Y^+$, lắc lư ngang vi mô (Wobble) và vỡ tan khi chạm mặt thoáng kèm hiệu ứng âm thanh râm ran.

#### 1.3. Đứt Đoạn Dòng Rót Thành Giọt (Pinch-off Droplet Transition)
* **Nguyên lý:** Khi lưu lượng rót $Q < 0{,}5\text{ mL/s}$ (lúc mới nghiêng hoặc sắp trút hết), dòng chảy liên tục bị phá vỡ thành chuỗi giọt rời rạc (Rayleigh-Plateau instability). Bán kính giọt cân bằng:
  $$r_{\text{giọt}} = \sqrt[3]{\frac{3\gamma R_{\text{mỏ}}}{2\rho g}} \approx 2{,}3\text{ mm} \quad (\approx 0{,}05\text{ mL/giọt})$$
  với suất căng bề mặt nước $\gamma = 0{,}0728\text{ N/m}$.
* **Giải pháp kỹ thuật:** Chuyển đổi trạng thái dòng rót (Stream Mesh $\rightarrow$ Droplet Particle Chain). Giọt cuối cùng có xác suất $40\%$ bám lại mỏ cốc trừ khi có tương tác gạt nhẹ mỏ cốc vào thành bình hứng.

#### 1.4. Màng Nước Thấm Ướt Thành Thủy Tinh (Wetting Residual Film)
* **Nguyên lý:** Thủy tinh sạch có tính ưa nước cao (góc tiếp xúc $\theta_c \approx 0^\circ$). Sau khi trút nước ra ngoài, thành trong ống đong đọng lại một màng nước mỏng dày $h \approx 15\ \mu\text{m}$.
* **Giải pháp kỹ thuật:** Áp dụng dynamic roughness decal trên vỏ thủy tinh sau khi trút nước: giảm `roughness` về $0{,}04$ và tăng `clearcoat`, sau đó bay hơi khô dần theo hàm mũ $\exp(-t / \tau_{\text{khô}})$ với $\tau_{\text{khô}} \approx 10\text{ s}$.

---

### TRỤC 2: ĐỘNG LỰC HỌC TƯƠNG TÁC & QUÁN TÍNH THAO TÁC

#### 2.1. Quán Tính Kéo Thả Chuột (Virtual Mass Inertia Damping)
* **Nguyên lý:** Di chuyển vật nhẹ (ống nghiệm rỗng $15\text{ g}$) phải thanh thoát, trong khi di chuyển vật nặng (quả cân $500\text{ g}$ hay bình cấp nước đầy $1\text{ kg}$) phải có độ trễ quán tính tự nhiên.
* **Phương trình điều khiển:**
  $$\ddot{\vec{x}} + 2\zeta\omega_n \dot{\vec{x}} + \omega_n^2 (\vec{x} - \vec{x}_{\text{chuột}}) = 0$$
  với tần số góc $\omega_n = \sqrt{\frac{k_{\text{tay}}}{m_{\text{vật}}}}$. Khi khối lượng $m_{\text{vật}}$ lớn, $\omega_n$ giảm, tạo độ đầm chắc, quán tính kéo nhẹ tay người điều khiển.

#### 2.2. Cơ Chế Căn Chỉnh Góc Nhìn Thị Sai Đáy Mặt Khum (Interactive Parallax Reticle)
* **Nguyên lý:** Học sinh phải đặt mắt ngang bằng với đáy mặt khum lõm ($\theta_{\text{tilt}} < 1{,}5^\circ$) thì vạch chia thể tích mới trùng khớp, triệt tiêu sai số thị sai:
  $$\Delta V_{\text{thị sai}} = \pi R^3 \cdot \tan\theta_{\text{nghiêng}}$$
* **Giải pháp kỹ thuật:** Bổ sung kính lúp ngắm chừng quang học (Parallax Lens Reticle) tự động kích hoạt khi chọn ống đong. Khi góc camera lệch quá $2^\circ$, vạch số bị mờ quầng quang học; khi đưa góc nhìn ngang chuẩn, vạch chia sắc nét và hiện chỉ số chuẩn xác.

#### 2.3. Hiện Tượng Bắn Tóe Giọt Khi Rót Quá Cao (High-Drop Splash Spattering)
* **Nguyên lý:** Vận tốc tiếp xúc của dòng nước tỉ lệ với độ cao rơi tự do: $v_{\text{va chạm}} = \sqrt{2gh}$. Nếu rót từ độ cao $h > 15\text{ cm}$, động năng lấn át sức căng bề mặt (Weber number $\text{We} = \frac{\rho v^2 d}{\gamma} > 80$), nước bắn tóe thành các giọt nhỏ ra mặt bàn.
* **Giải pháp kỹ thuật:** Phát hiện khoảng cách rơi $h$. Nếu $h > 15\text{ cm}$, sinh vũng nước nhỏ xung quanh đáy bình hứng và tự động trừ thể tích thu nhận vào $V_{\text{tràn bàn}}$, nhắc nhở học sinh thao tác chuẩn mực.

---

### TRỤC 3: ĐO LƯỜNG THỰC NGHIỆM, NHIỄU TỰ NHIÊN & SỰ CỐ VẬT LIỆU

#### 3.1. Nhiễu Vi Mô Môi Trường Trên Cân Điện Tử (Ambient Noise Floor)
* **Nguyên lý:** Cân phân tích $0{,}01\text{ g}$ hoặc $0{,}001\text{ g}$ ngoài thực tế luôn chịu tác động của luồng gió quạt phòng học và rung chấn cơ học.
* **Mô hình tín hiệu:**
  $$m_{\text{đọc}}(t) = m_{\text{thực}} + A_{\text{gió}} \cdot \sin(2\pi f_1 t) + \xi_{\text{Gauss}}(t)$$
  với $\xi \sim \mathcal{N}(0, \sigma^2)$, $\sigma \approx 0{,}02\text{ g}$.
* **Trải nghiệm:** Chữ số thập phân cuối cùng nhảy số nhẹ. Học sinh phải đóng lồng kính chắn gió hoặc chờ $2\text{ s}$ để bộ lọc ổn định số đọc.

#### 3.2. Hiện Tượng Dão Đàn Hồi Lực Kế (Plastic Hysteresis on Overload)
* **Nguyên lý:** Lò xo thép tuân theo định luật Hooke $F = k \cdot \Delta l$ trong giới hạn đàn hồi ($F \le 5\text{ N}$). Khi kéo quá tải ($F > 5\text{ N}$), lò xo bị biến dạng dẻo vĩnh viễn (Plastic elongation):
  $$\Delta l_{\text{dư}} = \alpha \cdot (F - F_{\text{giới hạn}})^2$$
* **Trải nghiệm:** Kim lực kế không thể co về vạch $0\text{ N}$ khi tháo tải, bắt buộc học sinh phải dùng núm hiệu chỉnh điểm 0 hoặc thay lò xo mới.

#### 3.3. Sốc Nhiệt Nứt Vỡ Thủy Tinh (Thermal Shock Fracture Physics)
* **Nguyên lý:** Thủy tinh thông thường có hệ số dãn nở nhiệt lớn. Đun nóng tập trung một điểm dưới đáy cốc mà không có lưới thép amiăng tản nhiệt sẽ tạo gradient nhiệt độ nguy hiểm:
  $$\sigma_{\text{nhiệt}} = \frac{E \cdot \alpha_{\text{nhiệt}} \cdot \Delta T}{1 - \nu} > \sigma_{\text{bền kéo}}$$
* **Trải nghiệm:** Đáy cốc xuất hiện vết nứt rạn đồ họa, âm thanh "tách" đanh gọn và chất lỏng rò rỉ, giáo dục sâu sắc bài học an toàn nhiệt học.

---

### TRỤC 4: KHÔNG GIAN 3D TINH GỌN & SƯ PHẠM TRỰC QUAN

#### 4.1. Triệt Tiêu Hoàn Toàn Bảng 3D Che Khuất Mặt Bàn
* **Quy chuẩn:** Không sử dụng thẻ Hologram chữ nhật bay lơ lửng trên đầu thiết bị.
* **Trực quan:** 
  - Số chỉ đo hiển thị trực tiếp trên màn hình LED/LCD của chính dụng cụ 3D.
  - Các thông số chi tiết (công thức, sai số ISO GUM) nằm gọn trong bảng số liệu thanh đáy có thể co giãn (Tabbed Dock).

#### 4.2. Thanh Sai Số Đo Lường Trực Quan (ISO GUM Error Bars)
* **Quy chuẩn:** Cột kết quả đo đính kèm ký hiệu dải sai số chuẩn đồ họa dạng chữ I hoa:
  $$\text{Indicator: } \vdash \!\bullet\! \dashv \quad \text{biểu diễn khoảng tin cậy } [\bar{x} - U_{95\%} \;..\; \bar{x} + U_{95\%}]$$

#### 4.3. Tua Ngược Thời Gian Nhân Quả ChronoCausal 60s
* **Quy chuẩn:** Đệm vòng $3.600\text{ frames}$ lưu trữ liên tục ở tần số $60\text{ FPS} / 120\text{ Hz}$. Nút bấm **`Tua 5s`** cho phép xem lại sai sót thao tác (như lỡ tay rót quá vạch) và phân nhánh thực tại mới mà không cần nạp lại trang từ đầu.

---

## 3. LỘ TRÌNH THỰC HIỆN CHI TIẾT 3 GIAI ĐOẠN

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              TIẾN TRÌNH THỰC HIỆN (ROADMAP)                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ GIAI ĐOẠN 1: QUÁN TÍNH THAO TÁC & VỆT SÁNG NƯỚC (Sprint 1: Tuần 1 - Tuần 2)            │
│ 1. Triển khai Virtual Inertia Damping cho chuột kéo thả (LabViewport3D.tsx).          │
│ 2. Thêm Caustics Shader vệt sáng động đáy cốc nước (ProceduralLabModels.ts).          │
│ 3. Tích hợp kính lúp ngắm chừng thị sai mặt khum Reticle (InSituMicroscopicLens.ts).   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ GIAI ĐOẠN 2: BỌT KHÍ THỦY TĨNH & ĐỨT DÒNG RÓT (Sprint 2: Tuần 3 - Tuần 4)              │
│ 1. Hệ hạt bọt khí nổi Stokes khi chìm vật và đun sôi (FluidThermalSolver.ts).          │
│ 2. Bộ đứt dòng chất lỏng Pinch-off thành giọt khi Q < 0.5 mL/s.                       │
│ 3. Màng nước bám ướt thành cốc Wetting Film sau khi trút nước.                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ GIAI ĐOẠN 3: NHIỄU MÔI TRƯỜNG & SỰ CỐ VẬT LIỆU (Sprint 3: Tuần 5 - Tuần 6)             │
│ 1. Mô phỏng nhiễu gió Gauss trên chữ số lẻ của cân điện tử.                           │
│ 2. Hiện tượng dão biến dạng dẻo lực kế khi kéo quá 5N.                                │
│ 3. Hiệu ứng nứt vỡ cốc thủy tinh do sốc nhiệt khi đun không có lưới tản nhiệt.        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. MA TRẬN KIỂM ĐỊNH KỸ THUẬT & TIÊU CHÍ NGHIỆM THU

Mọi cải tiến phải được kiểm chứng tự động qua bộ test script và không được làm suy giảm hiệu năng:

| Mã kiểm định | Hạng mục kiểm tra | Tiêu chí nghiệm thu (Acceptance Criteria) | Công thức kiểm chứng |
| :--- | :--- | :--- | :--- |
| **VER-F01** | Vệt tụ quang Caustics | Chạy mượt mà $\ge 58\text{ FPS}$, vệt sáng dao động đồng pha với slosh mặt nước | $I_{\text{caustic}} \propto \nabla^2 \eta(x,z,t)$ |
| **VER-F02** | Bọt khí nổi Stokes | Bọt khí nổi hướng lên $Y^+$, vận tốc tỉ lệ thuận với bình phương bán kính | $v \propto r^2$ |
| **VER-F03** | Đứt dòng ngắt giọt | Lưu lượng $Q < 0{,}5\text{ mL/s}$ tách rời thành chuỗi giọt thể tích $\approx 0{,}05\text{ mL}$ | $V_{\text{drop}} = 0{,}05\text{ mL} \pm 10\%$ |
| **VER-M01** | Quán tính kéo chuột | Thời gian đáp ứng của vật $500\text{ g}$ trễ hơn vật $15\text{ g}$ từ $80 - 120\text{ ms}$ | $\tau \propto \sqrt{m}$ |
| **VER-M02** | Thị sai mặt khum | Đọc sai thể tích $> 1\text{ mL}$ nếu góc nhìn nghiêng quá $\pm 5^\circ$ | $\Delta V = \pi R^3 \tan\theta$ |
| **VER-E01** | Nhiễu cân điện tử | Độ lệch chuẩn số chỉ $\sigma \approx 0{,}01 - 0{,}02\text{ g}$ khi chưa ổn định | $\sigma = \sqrt{\frac{1}{N}\sum(x_i - \bar{x})^2}$ |
| **VER-E02** | Bảo toàn khối lượng/thể tích | Sai số tích lũy bảo toàn toàn hệ thống sau 10 lần rót $\le 10^{-5}\text{ mL}$ | $\sum V_{\text{out}} = \sum V_{\text{in}}$ |

---

## 5. TỔ CHỨC THỰC HIỆN & PHÂN CÔNG TRÁCH NHIỆM

* **Trịnh Nguyễn Tường Vy:** 
  - Phụ trách Trục 1 (Quang học Caustics, hệ bọt khí Stokes, ngắt dòng giọt Pinch-off) và Trục 4 (Giao diện bảng đo, đồ thị sai số Error Bars).
  - Phụ trách viết kịch bản kiểm thử tự động `verify-fluid-micro-realism.ts`.
* **Phan Bùi Giang Ngân:**
  - Phụ trách Trục 2 (Quán tính kéo thả chuột $F = m \cdot a$, kính ngắm thị sai mặt khum Reticle) và Trục 3 (Nhiễu cân điện tử Gauss, dão đàn hồi lực kế).
  - Phụ trách kiểm thử tích hợp toàn hệ thống và tối ưu FPS trên các thiết bị máy tính trường học.
* **Thầy Lê Thanh Liêm (Người hướng dẫn khoa học):**
  - Định hướng phương pháp luận, phản biện học thuật chuẩn GDPT 2018 và Thông tư 38/2021/TT-BGDĐT.
  - Nghiệm thu từng giai đoạn của lộ trình và duyệt phát hành các bản build ViSEF chính thức.

---

> **Cam kết chất lượng:** Toàn bộ mã nguồn phát triển theo quy trình TDD (Test-Driven Development), đảm bảo tính trung thực học thuật tuyệt đối (Zero Fabrication), không sử dụng thư viện phụ thuộc đám mây bên ngoài, sẵn sàng chạy ngoại tuyến $100\%$ phục vụ cuộc thi Khoa học Kỹ thuật các cấp.
