# ĐẶC TẢ TƯƠNG TÁC ĐA TRƯỜNG & CHU TRÌNH NHÂN QUẢ CIA v2.0
## (MULTI-FIELD PHYSICAL INTERACTION & CAUSALITY SPECIFICATION — MASTER v3.0)

> **Mục tiêu:** Mọi tương tác trong phòng thí nghiệm OpenLab 3D phải vận hành theo đúng quy luật tự nhiên: liên kết cơ học vững chắc, phản ứng dây chuyền nhân quả giữa các thiết bị trên bàn và phản hồi âm thanh vật lý chân thực qua Web Audio API.

---

## 1. HỆ THỐNG LẮP RÁP CƠ HỌC ĐỒ THỊ ASSEMBLY GRAPH (RWSS v1.1.1)

Thiết bị trong phòng lab không nằm rời rạc mà được quản lý bằng một **Đồ thị có hướng không chu trình (Directed Acyclic Graph - DAG)**:

```
[BÀN THÍ NGHIỆM: BENCH_SURFACE_Y = 0.820m]
      │
      ├── [Cân điện tử BAL-0001] (Khóa 5 DoF: chỉ dịch chuyển X-Z trên mặt bàn)
      │         │
      │         └── (Khớp 'pan_center' cơ học) ──► [Cốc đong BKR-0001]
      │                                                   │
      │                                                   └── (Khớp 'fluid_receptacle') ──► [Nước cất: V = 150ml]
      │
      └── [Giá thí nghiệm STD-0001]
                │
                └── (Khớp kẹp 'clamp_01') ──► [Lực kế lò xo DYN-0001]
                                                    │
                                                    └── (Khớp 'hook_bottom') ──► [Quả nặng kim loại 100g]
```

### Quy tắc ghép nối cơ học 6 bậc tự do (6 DoF Locking Constraints):
1. **Khớp Đỡ tải cơ học (`mechanical_support`):** Khóa tự do theo trục Y (vật trên không thể lún qua mặt đĩa cân/mặt bàn), khóa góc xoay Roll/Pitch, cho phép xoay tự do quanh trục thẳng đứng Yaw và dịch chuyển trong giới hạn đĩa cân.
2. **Khớp Móc treo đàn hồi (`mechanical_hook`):** Tọa độ Y của quả nặng phụ thuộc vào độ dãn của lò xo:
   $$y_{\text{quả nặng}} = y_{\text{móc treo}} - l_0 - \frac{m \cdot g}{k}$$
3. **Bắt điểm Snap-to-Grid thông minh:** Bán kính hút dính $R_{\text{snap}} \le 0.08\text{ m}$. Khi tâm cổng cắm hoặc chân đế rơi vào vùng hút, một vectơ lực kéo vật thể khớp chính xác vào tâm điểm neo với độ giật cơ học nhẹ (damping oscillation).

---

## 2. BỘ GIẢI VẬT LÝ ĐA TRƯỜNG THỜI GIAN THỰC (SCIENTIFIC SOLVERS)

### 2.1. Động lực học Cơ học (MechanicsSolver)
- **Cân bằng tĩnh học:** $\Sigma \vec{F} = \vec{N} + m\vec{g} = 0 \implies N = mg$.
- **Đòn bẩy có trục quay cố định (Bài WF-08):**
  $$\Sigma M_{/O} = F_1 \cdot d_1 - F_2 \cdot d_2 = 0$$
  Khi treo quả nặng lệch tâm, thanh đòn quay quanh trục O với gia tốc góc:
  $$I \cdot \frac{d^2\theta}{dt^2} = F_1 d_1 \cos\theta - F_2 d_2 \cos\theta - b \frac{d\theta}{dt}$$
  *(Với $b$ là hệ số cản ma sát ổ bi, thanh đòn dao động tắt dần về vị trí cân bằng)*.

### 2.2. Thủy lực học & Nhiệt động lực học (FluidThermalSolver)
- **Dâng mực nước và Lực đẩy Archimedes (Bài WF-09):**
  Khi nhúng một khối kim loại thể tích $V_{\text{vật}}$ vào cốc nước:
  $$V_{\text{nước mới}} = V_{\text{nước đầu}} + V_{\text{vật chìm}}$$
  Lực kế lò xo đang treo vật ghi nhận lực kéo giảm đi một lượng đúng bằng lực đẩy Archimedes:
  $$F_{\text{lực kế}} = P - F_A = m g - \rho_{\text{nước}} \cdot g \cdot V_{\text{chìm}}$$
- **Dòng chảy bình tràn (Overflow Dynamics):**
  Khi mực nước vượt quá cao độ mép vòi xả $h_{\text{vòi}}$, chất lỏng bắt đầu chảy qua vòi theo phương trình Torricelli:
  $$Q_{\text{chảy}} = C_d \cdot A_{\text{vòi}} \cdot \sqrt{2g(h - h_{\text{vòi}})} \quad (\text{mL/s})$$
  Nước chảy tạo dòng tia vòng cung Parabol rơi đúng vào cốc hứng đặt phía dưới.
- **Cân bằng nhiệt lượng và Quá trình Đun sôi (Bài WF-11):**
  Nhiệt lượng truyền từ ngọn lửa đèn cồn vào cốc nước:
  $$\frac{dT}{dt} = \frac{\eta \cdot P_{\text{lửa}} - k_{\text{tản nhiệt}}(T - T_{\text{air}})}{m_{\text{nước}} c_{\text{nước}} + m_{\text{cốc}} c_{\text{thủy tinh}}}$$
  - Khi $T < 100.0^\circ\text{C}$: Nhiệt độ tăng đều đặn theo thời gian.
  - Khi $T = 100.0^\circ\text{C}$: Nhiệt độ **giữ nguyên không đổi** (hiện tượng thềm nhiệt độ biến đổi trạng thái). Nhiệt lượng cung cấp chuyển hóa thành nhiệt hóa hơi: $\frac{dm_{\text{hơi}}}{dt} = \frac{P_{\text{lửa}}}{L_{\text{nước}}}$ ($L = 2.26 \times 10^6\text{ J/kg}$).

### 2.3. Mạch điện & Định luật Kirchhoff (CircuitSolver)
Mọi mạng điện được giải bằng phương pháp thế nút (Node Voltage Method) theo định luật Kirchhoff KCL và KVL:
- **Cường độ dòng điện qua mạch thuần trở (Bài WF-12):**
  $$I = \frac{\mathcal{E}}{R_{\text{dây}} + R_{\text{biến trở}} + R_{\text{đèn}} + r_{\text{nguồn}}}$$
- **Hiệu điện thế hai đầu bóng đèn:** $U_{\text{đèn}} = I \cdot R_{\text{đèn}}$.
- **Độ sáng bóng đèn:** Dựng bằng tỷ lệ công suất tiêu thụ thực tế so với định mức $P_{\text{đm}} = 3.0\text{ W}$:
  $$\text{Độ sáng} = \min\left(1.5,\ \frac{I^2 R_{\text{đèn}}}{P_{\text{đm}}}\right)$$
  - Nếu $U < 1.0\text{V}$: Dây tóc chỉ ửng đỏ mờ.
  - Nếu $U \in [2.5\text{V}, 3.5\text{V}]$: Đèn sáng trắng rực rỡ bình thường.
  - Nếu $U > 4.5\text{V}$ (vượt quá 150% định mức): **Dây tóc vonfram lóe sáng chói lòa rồi đứt phụt với âm thanh tách nhỏ, bóng đèn cháy hỏng!**

### 2.4. Quang hình học & Tán sắc (OpticsSolver)
- **Định luật Snell-Descartes:** $n_1 \sin i = n_2 \sin r$.
- **Góc giới hạn phản xạ toàn phần:** $i_{\text{gh}} = \arcsin\left(\frac{n_2}{n_1}\right)$ (khi truyền từ thủy tinh ra không khí, $i_{\text{gh}} \approx 42.8^\circ$). Nếu góc tới $i > 42.8^\circ$, tia sáng bị phản xạ toàn phần $100\%$ không ló ra ngoài.
- **Tạo ảnh qua thấu kính mỏng:**
  $$\frac{1}{f} = \frac{1}{d} + \frac{1}{d'} \implies d' = \frac{d \cdot f}{d - f}; \quad k = -\frac{d'}{d}$$
  Hệ thống chiếu các tia sáng thực (tia qua quang tâm O, tia song song trục chính qua tiêu điểm F') tạo thành ảnh thật ngược chiều hoặc ảnh ảo cùng chiều rõ nét trên màn hứng ảnh.

### 2.5. Cảm ứng Điện từ Faraday (ElectromagneticInductionSolver)
- **Biến thiên từ thông:** $\Phi = B \cdot S \cdot \cos\alpha$. Khi kéo nam châm lại gần cuộn dây với vận tốc $v = \frac{dz}{dt}$:
  $$\mathcal{E}_{\text{ind}} = -N \frac{d\Phi}{dt} = -N \cdot S \cdot \frac{\partial B}{\partial z} \cdot \frac{dz}{dt}$$
- **Dòng điện cảm ứng:** $i_{\text{ind}} = \frac{\mathcal{E}_{\text{ind}}}{R_{\text{cuộn}} + R_{\text{điện kế}}}$.
- **Góc lệch kim điện kế số 0 ở giữa:**
  $$\theta(t) = C_{\text{galvo}} \cdot i_{\text{ind}}(t)$$
  Nam châm đưa vào thì kim lệch sang phải; kéo ra xa thì kim lệch ngược chiều sang trái; để yên nam châm thì kim lập tức về số 0!

---

## 3. ĐỘNG CƠ ÂM THANH VẬT LÝ TƯƠNG TÁC (LAB SOUND ENGINE)

OpenLab 3D không dùng tệp âm thanh MP3 nặng nề ghi sẵn, mà sử dụng **Web Audio API nguyên bản (Zero External Assets)** để tổng hợp sóng âm vật lý thời gian thực:

| Tên hiệu ứng âm thanh | Cơ chế tổng hợp sóng âm Web Audio | Thời điểm kích hoạt |
| :--- | :--- | :--- |
| **`click_switch`** | Xung sóng vuông (Square Wave) $800\text{ Hz}$ dập tắt sau $0.05\text{ s}$ + bộ lọc Low-pass filter. | Bật/tắt công tắc điện, công tắc nguồn cân. |
| **`snap_dock`** | Xung xoắn (Sine Sweep) từ $300\text{ Hz} \to 120\text{ Hz}$ kèm độ nảy damped decay $0.08\text{ s}$. | Thiết bị bắt điểm hút dính vào nhau. |
| **`water_pour`** | Tiếng ồn trắng (White Noise) qua bộ lọc băng thông Band-pass filter quét từ $400\text{ Hz}$ lên $1200\text{ Hz}$. | Rót chất lỏng từ cốc sang ống đong (tần số tăng dần khi mực nước dâng cao). |
| **`boiling_bubble`** | Dao động sóng sin ngẫu nhiên với tần số $150 - 350\text{ Hz}$ kích hoạt từng hạt bọt khí vỡ. | Nước đun sôi sùng sục trên đèn cồn. |
| **`fuse_blow`** | Tiếng nổ lách tách tần số cao kèm suy giảm biên độ nhanh chóng. | Cầu chì cháy khi đoản mạch điện. |
| **`glass_clink`** | Tần số cộng hưởng cao $2800\text{ Hz}$ ngân dài $0.4\text{ s}$. | Hai dụng cụ thủy tinh va chạm nhẹ vào nhau. |
