# ĐẶC TẢ MÔI TRƯỜNG VẬT LÝ CHÂN THỰC TUYỆT ĐỐI
## (HIGH-FIDELITY LAB ENVIRONMENT SPECIFICATION — MASTER v3.0)

> **Mục tiêu:** Mô hình hóa phòng thí nghiệm ảo không phải là một khoảng chân không vô trùng, mà là một **hệ sinh thái vật lý động lực học đầy đủ** với 24 biến số môi trường tác động qua lại lên từng phép đo của thiết bị.

---

## 1. KHÔNG GIAN HÌNH HỌC VÀ HỆ TỌA ĐỘ PHÒNG THÍ NGHIỆM

* **Kích thước phòng tiêu chuẩn:** Rộng $12.0\text{ m}$ (trục X) $\times$ Dài $8.0\text{ m}$ (trục Z) $\times$ Cao $3.6\text{ m}$ (trục Y). Sàn phòng tại cao độ $y = 0.000\text{ m}$.
* **Bàn thí nghiệm trung tâm:** Dài $2.40\text{ m}$ $\times$ Rộng $0.75\text{ m}$, mặt bàn trên cùng nằm tại cao độ cố định:
  $$\text{BENCH\_SURFACE\_Y} = 0.820\text{ m}$$
* **Hệ tọa độ:** Quy ước bàn tay phải (Right-handed Coordinate System):
  - Trục $+Y$: Hướng thẳng đứng lên trần nhà (ngược chiều vectơ gia tốc trọng trường $\vec{g}$).
  - Trục $+Z$: Hướng ra phía trước (về phía mắt học sinh ngồi trước bàn thí nghiệm).
  - Trục $+X$: Hướng sang bên phải bàn thí nghiệm.

---

## 2. BẢNG 12 BIẾN MÔI TRƯỜNG VĨ MÔ TOÀN PHÒNG (MACRO ENVIRONMENT)

Các biến này chi phối toàn bộ không gian phòng học và ảnh hưởng ngầm định lên mọi thiết bị:

| STT | Tên biến môi trường | Ký hiệu | Đơn vị | Dải giá trị hợp lý | Giá trị mặc định tiêu chuẩn | Tần số cập nhật | Cơ chế ảnh hưởng vật lý thực tế |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **E01** | **Nhiệt độ không khí phòng** | $T_{\text{air}}$ | $^\circ\text{C}$ | $[15.0, 40.0]$ | **$25.0^\circ\text{C}$** | $1\text{ Hz}$ | Gây dãn nở nhiệt dụng cụ đo, độ trôi nhiệt cảm biến loadcell ($\alpha = 1.5 \times 10^{-5}/^\circ\text{C}$), thay đổi tốc độ truyền âm và khối lượng riêng không khí. |
| **E02** | **Độ ẩm tương đối** | $RH$ | $\%$ | $[20.0, 95.0]$ | **$60.0\%$** | $0.2\text{ Hz}$ | Ảnh hưởng sự bay hơi của nước từ cốc mở, rò rỉ điện tích tĩnh điện trên bề mặt vật liệu cách điện. |
| **E03** | **Áp suất khí quyển** | $P_{\text{atm}}$ | $\text{kPa}$ | $[85.0, 105.0]$ | **$101.325\text{ kPa}$** | $0.1\text{ Hz}$ | Quyết định trực tiếp nhiệt độ sôi của nước theo phương trình Antoine: $T_{\text{sôi}} = f(P_{\text{atm}})$; áp suất khí đẩy cột chất lỏng. |
| **E04** | **Gia tốc trọng trường** | $g$ | $\text{m/s}^2$ | $[9.75, 9.85]$ | **$9.807\text{ m/s}^2$** | Cố định | Trực tiếp quyết định trọng lượng $P = m \cdot g$ trên cân đĩa, độ dãn lò xo lực kế $F = k\Delta l$, và áp suất thủy tĩnh $p = \rho g h$. |
| **E05** | **Cường độ ánh sáng phòng** | $E_v$ | $\text{lux}$ | $[0, 2000]$ | **$500\text{ lux}$** | $10\text{ Hz}$ | Quyết định độ tương phản màn hình LCD/LED, độ sáng nền khi quan sát mẫu vật dưới kính hiển vi quang học và độ nhạy cảm biến quang. |
| **E06** | **Vận tốc luồng gió phòng** | $v_{\text{air}}$ | $\text{m/s}$ | $[0.0, 5.0]$ | **$0.15\text{ m/s}$** | $10\text{ Hz}$ | Tạo lực nhiễu động khí động học làm nhảy số lẻ trên cân phân tích ($\pm 0.02\text{ g}$), làm tạt ngọn lửa đèn cồn, tăng tốc độ bốc hơi làm nguội cốc nước. |
| **E07** | **Tần suất thông gió** | $ACH$ | $1/\text{h}$ | $[0.0, 10.0]$ | **$2.0\text{ lần/h}$** | $0.1\text{ Hz}$ | Tốc độ đào thải khí thải sinh ra từ các phản ứng hóa học ($CO_2, SO_2$), ảnh hưởng nồng độ khí phòng. |
| **E08** | **Nồng độ Oxy không khí** | $\%O_2$ | $\%$ | $[10.0, 25.0]$ | **$20.95\%$** | $1\text{ Hz}$ | Quyết định tốc độ và màu sắc ngọn lửa đèn cồn (cháy xanh khi đủ oxy, vàng muội than khi thiếu oxy, tắt ngấm khi $< 14\%$). |
| **E09** | **Nồng độ khí $CO_2$** | $[CO_2]$ | $\text{ppm}$ | $[350, 2500]$ | **$450\text{ ppm}$** | $0.1\text{ Hz}$ | Phục vụ các thí nghiệm sinh học quang hợp của cây xanh và độ đục của nước vôi trong $Ca(OH)_2$ khi để lâu ngoài không khí. |
| **E10** | **Từ trường Trái Đất** | $B_{\text{earth}}$ | $\mu\text{T}$ | $[30.0, 70.0]$ | **$45.0\ \mu\text{T}$** | Cố định | Xác định hướng chỉ của kim la bàn từ tính, gây nhiễu từ trường thứ cấp lên cuộn dây cảm ứng điện từ khi không che chắn. |
| **E11** | **Nhiệt độ mặt bàn thí nghiệm** | $T_{\text{bench}}$ | $^\circ\text{C}$ | $[18.0, 45.0]$ | **$25.0^\circ\text{C}$** | $0.5\text{ Hz}$ | Truyền nhiệt tiếp xúc dẫn truyền từ đế kiềng đun/đèn cồn xuống mặt bàn composite; dãn nở chân đế thiết bị cơ học. |
| **E12** | **Nguồn điện lưới AC** | $V_{\text{ac}} / f$ | $\text{V / Hz}$ | $[200-240\text{V}]$ | **$220\text{V} / 50\text{Hz}$** | $50\text{ Hz}$ | Cấp nguồn cho biến áp nguồn thí nghiệm THCS, có dao động điện áp ngẫu nhiên $\pm 2\%$ mô phỏng điện lưới thực tế. |

---

## 3. BẢNG 12 BIẾN MÔI TRƯỜNG CHUYÊN BIỆT THEO MẪU CHẤT (SAMPLE ENVIRONMENT)

Các biến này chỉ kích hoạt khi mẫu chất hoặc dung dịch xuất hiện trong ống nghiệm, cốc đong hoặc mạch đo:

| STT | Tên biến mẫu chất | Ký hiệu | Đơn vị | Dải giá trị | Mặc định (Nước cất) | Cơ chế ảnh hưởng thiết bị |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **E13** | **Nhiệt độ mẫu chất** | $T_{\text{sample}}$ | $^\circ\text{C}$ | $[-10, 150]$ | **$25.0^\circ\text{C}$** | Cột thủy ngân/rượu của nhiệt kế dãn nở theo công thức: $H = H_0(1 + \beta \Delta T)$; tỷ trọng mẫu biến thiên. |
| **E14** | **Độ pH dung dịch** | $\text{pH}$ | — | $[0.00, 14.00]$ | **$7.00$** | Màu giấy quỳ, giấy chỉ thị vạn năng đổi màu; điện cực pH kế hiện số đo điện thế tương ứng qua phương trình Nernst. |
| **E15** | **Độ dẫn điện** | $\text{EC}$ | $\mu\text{S/cm}$ | $[0, 50000]$ | **$5.0\ \mu\text{S/cm}$** | Bút đo EC nhảy số; quyết định độ dẫn điện dung dịch khi mắc nối tiếp bóng đèn thử tính dẫn điện. |
| **E16** | **Tổng chất rắn hòa tan** | $\text{TDS}$ | $\text{ppm (mg/L)}$ | $[0, 30000]$ | **$2.5\text{ ppm}$** | Bút đo TDS hiện số theo quan hệ xấp xỉ: $\text{TDS} \approx 0.5 \times \text{EC}$. |
| **E17** | **Độ mặn dung dịch** | $\text{Salinity}$ | $\text{‰ (ppt)}$ | $[0.0, 50.0]$ | **$0.0\text{ ‰}$** | Làm tăng khối lượng riêng của nước theo công thức UNESCO: $\rho(S, T) \approx \rho_0 + 0.8 \cdot S$, tăng lực đẩy Archimedes. |
| **E18** | **Độ đục dung dịch** | $\text{Turbidity}$ | $\text{NTU}$ | $[0, 1000]$ | **$0.2\text{ NTU}$** | Làm tán xạ và suy giảm cường độ chùm tia laser quang học truyền qua cốc nước theo định luật Beer-Lambert. |
| **E19** | **Oxy hòa tan** | $\text{DO}$ | $\text{mg/L}$ | $[0.0, 15.0]$ | **$8.2\text{ mg/L}$** | Phục vụ cảm biến sinh thái và thí nghiệm hô hấp của cá/thủy sinh. |
| **E20** | **Khối lượng riêng mẫu** | $\rho$ | $\text{kg/m}^3$ | $[500, 19300]$ | **$997\text{ kg/m}^3$** | Trực tiếp quyết định khối lượng đo được trên cân $m = \rho \cdot V$ và lực đẩy Archimedes $F_A = \rho \cdot g \cdot V_{\text{chìm}}$. |
| **E21** | **Độ nhớt động học** | $\eta$ | $\text{mPa}\cdot\text{s}$ | $[0.3, 10000]$ | **$0.89\text{ mPa}\cdot\text{s}$** | Quyết định tốc độ rơi của viên bi trong chất lỏng (Định luật Stokes $F_d = 6\pi \eta r v$) và thời gian chảy của chất lỏng qua phễu. |
| **E22** | **Bước sóng chùm sáng** | $\lambda$ | $\text{nm}$ | $[380, 750]$ | **$632.8\text{ nm}$ (Laser đỏ)** | Chiết suất lăng kính biến thiên theo bước sóng theo hệ thức Cauchy: $n(\lambda) = A + \frac{B}{\lambda^2}$, tạo hiện tượng tán sắc ánh sáng thành 7 sắc cầu vồng. |
| **E23** | **Công suất nguồn nhiệt** | $P_{\text{thermal}}$ | $\text{W}$ | $[0, 1500]$ | **$350\text{ W}$ (Đèn cồn)** | Tốc độ truyền nhiệt vào đáy cốc đun theo phương trình truyền nhiệt: $\frac{dQ}{dt} = \eta \cdot P_{\text{thermal}} - k(T - T_{\text{air}})$. |
| **E24** | **Hệ số ma sát bề mặt** | $\mu_s / \mu_k$ | — | $[0.05, 0.80]$ | **$0.30 / 0.25$ (Gỗ - Gỗ)** | Xác định lực ma sát nghỉ cực đại và ma sát trượt trên mặt phẳng nghiêng: $F_{\text{ms}} = \mu \cdot N = \mu \cdot m g \cos\alpha$. |

---

## 4. MA TRẬN ÁNH XẠ TƯƠNG TÁC MÔI TRƯỜNG - THIẾT BỊ (COUPLING MATRIX)

Bảng ma trận chỉ ra chính xác biến môi trường nào kích hoạt tính toán trong thiết bị nào (tránh lãng phí tài nguyên CPU/GPU khi biến đổi không liên quan):

```
                        E01(T)   E03(P)   E04(g)   E05(Lux) E06(Gió) E08(O2)  E12(AC)  E13(Tm)  E20(ρ)   E22(λ)
Cân điện tử (BAL)        [ X ]     [ ]     [ X ]     [ ]     [ X ]     [ ]      [ ]      [ ]      [ ]      [ ]
Lực kế lò xo (DYN)       [ ]       [ ]     [ X ]     [ ]     [ ]       [ ]      [ ]      [ ]      [ ]      [ ]
Ống đong/Cốc (CYL/BKR)   [ X ]     [ ]     [ ]       [ ]     [ X ]     [ ]      [ ]      [ X ]    [ X ]    [ ]
Đèn cồn/Gia nhiệt (BRN)  [ X ]     [ X ]   [ ]       [ ]     [ X ]     [ X ]    [ ]      [ ]      [ ]      [ ]
Nhiệt kế (THM)           [ ]       [ ]     [ ]       [ ]     [ ]       [ ]      [ ]      [ X ]    [ ]      [ ]
Lăng kính/Thấu kính (OPT)[ ]       [ ]     [ ]       [ X ]   [ ]       [ ]      [ ]      [ ]      [ ]      [ X ]
Mạch điện/DMM (DMM/PWR)  [ X ]     [ ]     [ ]       [ ]     [ ]       [ ]      [ X ]    [ ]      [ ]      [ ]
Kính hiển vi (MIC)       [ ]       [ ]     [ ]       [ X ]   [ ]       [ ]      [ ]      [ ]      [ ]      [ ]
Bình tràn/Archimedes(OVR)[ ]       [ ]     [ X ]     [ ]     [ ]       [ ]      [ ]      [ X ]    [ X ]    [ ]
```

---

## 5. CÔNG THỨC TOÁN - LÝ MÔ TẢ ĐỘNG HỌC MÔI TRƯỜNG CHÂN THỰC

### 5.1. Hiệu chỉnh lực đẩy Ac-si-mét của không khí lên cân phân tích
Khi cân một vật có khối lượng danh định $m$ và khối lượng riêng $\rho_{\text{vật}}$, không khí phòng tác dụng một lực đẩy Ac-si-mét làm số chỉ của cân bị giảm nhẹ:
$$m_{\text{hiển thị}} = m \cdot \left(1 - \frac{\rho_{\text{không khí}}}{\rho_{\text{vật}}}\right)$$
Trong đó khối lượng riêng không khí phụ thuộc nhiệt độ $T_{\text{air}}$ và áp suất $P_{\text{atm}}$:
$$\rho_{\text{không khí}} = \frac{P_{\text{atm}}}{R_{\text{specific}} \cdot (T_{\text{air}} + 273.15)} \approx 1.184\text{ kg/m}^3 \quad (\text{tại } 25^\circ\text{C}, 101.325\text{ kPa})$$

### 5.2. Sự phụ thuộc của nhiệt độ sôi vào áp suất khí quyển
Nhiệt độ sôi của nước cất trong cốc đun tuân theo phương trình thực nghiệm Clausius-Clapeyron:
$$T_{\text{sôi}}(P_{\text{atm}}) = \left( \frac{1}{373.15} - \frac{R}{L_{\text{vap}}} \ln\frac{P_{\text{atm}}}{101.325} \right)^{-1} - 273.15$$
*(Tại Hà Nội/Cần Thơ $P_{\text{atm}} \approx 101.3\text{ kPa} \implies T_{\text{sôi}} = 100.0^\circ\text{C}$; Tại Sa Pa/Đà Lạt cao $1500\text{m}$, $P_{\text{atm}} \approx 85\text{ kPa} \implies T_{\text{sôi}} \approx 95.2^\circ\text{C}$)*.

### 5.3. Độ trôi nhiệt của cảm biến đo lường (Thermal Drift)
Mọi cảm biến điện tử (Loadcell cân, Vôn kế DMM) đều có hệ số trôi nhiệt $\alpha$:
$$\text{Reading}(T) = \text{Reading}_{\text{chuẩn}} \cdot \left[ 1 + \alpha \cdot (T_{\text{air}} - 25.0) \right] + \mathcal{N}(0, \sigma_{\text{noise}})$$
*(Với $\mathcal{N}(0, \sigma_{\text{noise}})$ là hàm phân bố chuẩn Gaussian sinh ra từ thuật toán Box-Muller trong `MetrologyEngine.ts`)*.
