# ĐẶC TẢ CHỨC NĂNG ĐO LƯỜNG & ĐO LƯỜNG HỌC (METROLOGY)
## (EQUIPMENT FUNCTIONAL & METROLOGY SPECIFICATION — MASTER v3.0)

> **Mục tiêu:** Mô hình hóa hành vi đo lường và sai số của thiết bị theo chuẩn mực quốc tế **ISO/IEC Guide 98-3 (GUM - Guide to the Expression of Uncertainty in Measurement)**. Thiết bị ảo không trả về những con số "lý tưởng sách giáo khoa", mà phản ánh chính xác độ trễ cảm biến, giới hạn độ phân giải (ĐCNN), độ trôi nhiệt độ và sai số ngẫu nhiên thực tế.

---

## 1. MÔ HÌNH TOÁN HỌC ĐO LƯỜNG CHUẨN ISO GUM

Khi một thiết bị đo ghi nhận một đại lượng vật lý thực tế $X_{\text{true}}$, giá trị hiển thị trên màn hình hoặc vạch chia $X_{\text{display}}$ được xác định qua hàm toán học trong `MetrologyEngine.ts`:

$$X_{\text{display}} = \text{Quantize}\Big( X_{\text{true}} + \Delta_{\text{tare}} + \Delta_{\text{thermal}}(T) + \mathcal{N}(0, \sigma_{\text{noise}}) + \Delta_{\text{hysteresis}},\ \text{LeastCount} \Big)$$

Trong đó:
1. **$\text{Quantize}(V, \text{LC}) = \text{round}(V / \text{LC}) \times \text{LC}$:** Làm tròn số theo bội số của Độ chia nhỏ nhất (Least Count - ĐCNN). Không bao giờ hiển thị chữ số vượt quá giới hạn phân giải của thiết bị.
2. **$\Delta_{\text{tare}}$:** Giá trị độ lệch trừ bì do người dùng thiết lập (nút TARE).
3. **$\Delta_{\text{thermal}}(T) = X_{\text{true}} \cdot \alpha \cdot (T_{\text{air}} - 25.0)$:** Sai số dãn nở/trôi nhiệt độ với hệ số $\alpha$ (/°C).
4. **$\mathcal{N}(0, \sigma_{\text{noise}})$:** Nhiễu ngẫu nhiên lặp lại phân bố chuẩn Gaussian sinh ra từ thuật toán Box-Muller cố định seed.
5. **Độ trễ thời gian bậc nhất (First-Order Response Time Lag):**
   $$\tau \frac{dX_{\text{sensor}}}{dt} + X_{\text{sensor}} = X_{\text{input}} \implies X_{\text{sensor}}(t) = X_{\text{input}} + (X_0 - X_{\text{input}}) e^{-t/\tau}$$
   *(Số đo không nhảy ngay lập tức mà trôi mượt mà về giá trị xác lập theo hằng số thời gian $\tau$)*.

---

## 2. BẢNG THÔNG SỐ ĐO LƯỜNG CHI TIẾT CỦA CÁC THIẾT BỊ CHỦ CHỐT

| Mã thiết bị | Tên thiết bị | Dải đo danh định | Độ chia nhỏ nhất (ĐCNN) | Sai số dụng cụ ($\Delta_{\text{dc}}$) | Hằng số thời gian $\tau$ | Giới hạn quá tải phá hủy |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **BAL-0001** | Cân điện tử hiện số | $0.00 - 500.00\text{ g}$ | **$0.01\text{ g}$** | $\pm 0.02\text{ g}$ | $1.2\text{ s}$ | $550\text{ g}$ (Báo `OVERLOAD`) |
| **DYN-0001** | Lực kế lò xo học sinh | $0.0 - 5.0\text{ N}$ | **$0.1\text{ N}$** | $\pm 0.05\text{ N}$ | $0.3\text{ s}$ | $7.5\text{ N}$ (Hỏng dãn lò xo) |
| **CYL-0001** | Ống đong thủy tinh 100mL | $0 - 100\text{ mL}$ | **$1\text{ mL}$** | $\pm 1.0\text{ mL}$ | $0.0\text{ s}$ | $105\text{ mL}$ (Tràn miệng) |
| **BKR-0001** | Cốc thủy tinh Beaker 250mL | $50 - 250\text{ mL}$ | **$25\text{ mL}$ (ước lượng)**| $\pm 10.0\text{ mL}$ | $0.0\text{ s}$ | $280\text{ mL}$ (Tràn vòi) |
| **CAL-0001** | Thước cặp du xích | $0.00 - 150.00\text{ mm}$ | **$0.02\text{ mm}$** | $\pm 0.02\text{ mm}$ | $0.0\text{ s}$ | $155\text{ mm}$ (Tuột khớp) |
| **MIC-0002** | Panme đo ngoài cơ khí | $0.000 - 25.000\text{ mm}$ | **$0.01\text{ mm}$** | $\pm 0.004\text{ mm}$ | $0.0\text{ s}$ | Siết quá lực trượt bánh cóc |
| **THM-0001** | Nhiệt kế phòng thí nghiệm | $-10.0 - 110.0^\circ\text{C}$| **$1.0^\circ\text{C}$** | $\pm 1.0^\circ\text{C}$ | $4.5\text{ s}$ | $120^\circ\text{C}$ (Vỡ bầu thủy tinh) |
| **DMM-0001** | Đồng hồ vạn năng DMM (DCV) | $0.00 - 20.00\text{ V}$ | **$0.01\text{ V}$** | $\pm(0.5\% + 2\text{ số})$ | $0.4\text{ s}$ | $600\text{ V}$ (Cháy cầu chì) |
| **DMM-0001** | Đồng hồ vạn năng DMM (DCA) | $0.0 - 200.0\text{ mA}$ | **$0.1\text{ mA}$** | $\pm(1.0\% + 2\text{ số})$ | $0.4\text{ s}$ | $500\text{ mA}$ (Đứt cầu chì nhanh)|
| **GLV-0001** | Điện kế số 0 ở giữa | $-50 - +50\ \mu\text{A}$ | **$1.0\ \mu\text{A}$** | $\pm 1.5\ \mu\text{A}$ | $0.2\text{ s}$ | $100\ \mu\text{A}$ (Gãy kim chỉ thị) |
| **PHM-0001** | Bút đo pH điện tử | $0.00 - 14.00\text{ pH}$ | **$0.01\text{ pH}$** | $\pm 0.05\text{ pH}$ | $3.0\text{ s}$ | Khô điện cực hỏng màng thủy tinh|

---

## 3. LOGIC MÁY TRẠNG THÁI VẬN HÀNH (OPERATIONAL FINITE STATE MACHINES)

### 3.1. Máy trạng thái Cân điện tử (BAL-0001)
Cân điện tử vận hành theo 5 trạng thái hữu hạn chuẩn công nghiệp:

```
[POWER_OFF] ──(Bấm ON)──► [CALIBRATION/ZERO] ──(Ổn định)──► [READY_MEASURING]
                                                                  │
                           ┌──────────────────────────────────────┴─────────────────────────────────────┐
                           │ (Bấm TARE)                                                                 │ (Khối lượng > 520g)
                           ▼                                                                            ▼
                   [TARE_OFFSET_SET]                                                             [OVERLOAD_ERROR]
             (Màn hình về 0.00 g, lưu offset)                                                (Màn hình nhấp nháy 'O-Ld')
```

- **Hành vi nút TARE:**
  Khi đang có cốc đong $m_{\text{cốc}} = 85.20\text{ g}$ trên đĩa:
  $$\text{tareOffsetG} = 85.20\text{ g}; \quad m_{\text{display}} = 85.20 - 85.20 = 0.00\text{ g}$$
  Khi rót thêm $50.00\text{ g}$ nước vào cốc:
  $$m_{\text{display}} = (85.20 + 50.00) - 85.20 = 50.00\text{ g}$$
  Khi nhấc cốc ra khỏi đĩa cân:
  $$m_{\text{display}} = 0.00 - 85.20 = -85.20\text{ g} \quad (\text{Màn hình báo dấu âm chính xác như cân thật!})$$

### 3.2. Máy trạng thái Núm vặn Đồng hồ Vạn năng DMM (DMM-0001)
Núm xoay trung tâm có 24 nấc chia chuyển mạch:
- **`OFF`:** Tắt nguồn, màn hình tắt hoàn toàn.
- **Thang `DCV 20V`:** Trở kháng vào $R_{\text{in}} = 10\text{ M}\Omega$. Khi mắc song song với đoạn mạch, vôn kế hầu như không làm sụt áp mạch chính. Màn hình hiện định dạng `0.00 V`.
- **Thang `DCA 200mA`:** Điện trở shunt nội cực nhỏ $R_{\text{shunt}} = 1.0\ \Omega$.
  - *Cảnh báo nguy hiểm (Safety Reflex):* Nếu học sinh mắc thang đo Ampe này **song song** trực tiếp vào hai cực nguồn điện $6\text{V}$, dòng điện ngắn mạch vọt lên $I = \frac{6\text{V}}{1.0\ \Omega + 0.5\ \Omega} = 4.0\text{ A} > 500\text{ mA}$ $\implies$ **Cầu chì bảo vệ nổ tung, màn hình hiện `0.0 mA` và bốc khói cảnh báo!**
- **Thang `RES 20kΩ`:** Phát điện áp thử nghiệm $0.3\text{V}$ qua que đo để đo điện trở. Nếu đo khi mạch đang có điện $\implies$ Báo lỗi đoản mạch.

### 3.3. Máy trạng thái Lấy nét Kính hiển vi Quang học (MIC-0001 DIN 58145)
Kính hiển vi mô phỏng cơ chế quang học sâu trường ảnh (Depth of Field - DOF) song tiêu cự thực tế:
- **Độ phóng đại tổng:** $M = M_{\text{thị kính}} \times M_{\text{vật kính}}$ (ví dụ: $10\text{x} \times 40\text{x} = 400\text{x}$).
- **Vật kính 40x:** Khẩu độ số $N.A = 0.65$, khoảng cách làm việc danh định $WD = 0.6\text{ mm}$, độ sâu trường ảnh cực mỏng $\text{DOF} \approx \frac{\lambda}{2(N.A)^2} \approx 0.8\ \mu\text{m}$.
- **Hành vi vi chỉnh/thô chỉnh:**
  - Khoảng cách từ vật kính đến lam kính: $d = d_0 + \Delta_{\text{thô}} \times 1.0\text{ mm} + \Delta_{\text{vi}} \times 0.002\text{ mm}$.
  - Độ nét hình ảnh tế bào (Blur Radius):
    $$\text{Blur}(d) = \min\left(20\text{ px},\ 25000 \times |d - d_{\text{tiêu cự}}|^2\right)$$
  - Khi $|d - d_{\text{tiêu cự}}| \le 0.002\text{ mm}$, hình ảnh tế bào thực vật (màng tế bào, lục lạp, nhân tế bào) hiện lên sắc nét $100\%$. Nếu tiếp tục vặn núm thô quá đà đi xuống, vật kính chạm đè vỡ lam kính với tiếng kính rạn vỡ cảnh báo!
