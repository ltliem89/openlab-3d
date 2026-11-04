# BÁO CÁO NGHIÊN CỨU TƯƠNG TÁC QUANG HỌC ĐỘC LẬP & LIÊN ĐỘNG NGUỒN ĐIỆN
> **Dự án**: OpenLab 3D — Mô phỏng Quang học Vật lý chuẩn SGK KHTN 9 (Chương II)  
> **Nội dung nghiên cứu**: Tương tác thực tế giữa Nguồn điện 12V — Đèn chiếu sáng — Chùm tia sáng — Lăng kính & Thấu kính  

---

## 1. PHÂN TÍCH YÊU CẦU & NHẬN DIỆN CÁC ĐIỂM CHƯA ĐÚNG NGOÀI ĐỜI

Qua phản ánh của bạn, trong mô phỏng quang học có 3 điểm chưa phản ánh đúng thực tế phòng thí nghiệm:

1. **Về Nguồn điện & Đèn chiếu sáng**:
   - *Ngoài đời*: Đèn chiếu sáng quang học (bóng Halogen/Sợi đốt 6V - 12V 21W) không có pin bên trong. Đèn bắt buộc phải được cắm dây vào **Biến áp nguồn (Optical Power Supply)** và **Biến áp nguồn phải được BẬT công tắc** thì đèn mới sáng.
   - *Trước đây*: Đèn tự phát sáng khi được lấy ra bàn dù chưa kết nối nguồn điện hoặc nguồn chưa bật.

2. **Về Lăng kính & Chùm tia sáng**:
   - *Ngoài đời*: Lăng kính là một khối thủy tinh trong suốt hình lăng trụ tam giác đứng ($A = 60^\circ$ hoặc vuông cân $45^\circ - 90^\circ - 45^\circ$). Lăng kính hoàn toàn **độc lập** với ánh sáng. Bản thân nó không tự phát ra tia sáng nào.
   - *Trước đây*: Trong mô hình 3D của lăng kính bị gắn cứng sẵn một chùm tia màu (`dispersion_spectrum`), dẫn đến việc đặt lăng kính ở bất kỳ đâu cũng thấy có tia sáng phát ra từ nó!

3. **Về Đường truyền tia sáng & Khúc xạ động**:
   - *Ngoài đời*: 
     - Khi đèn chiếu sáng bật mà phía trước chưa có thấu kính hay lăng kính (hoặc để lệch ra ngoài), **chùm tia sáng truyền thẳng tắp qua không khí** theo định luật truyền thẳng của ánh sáng ($n_{\text{air}} \approx 1.0003$).
     - Chỉ khi người làm thí nghiệm di chuyển lăng kính hoặc thấu kính **vào đúng vị trí cắt ngang chùm tia sáng**, tia sáng mới đi vào mặt kính và bị khúc xạ (bẻ lệch hướng hoặc hội tụ/phân kì).
     - Khi dịch chuyển lăng kính lệch sang bên, chùm tia sáng lại tiếp tục đi thẳng.

---

## 2. BỘ THÔNG SỐ VẬT LÝ & NGUYÊN LÝ KHÚC XẠ ĐỘC LẬP

### 2.1. Điều kiện liên động Mạch điện (Electrical Interlocking)

Đèn chiếu sáng chỉ phát sáng khi thỏa mãn đồng thời cả 3 điều kiện vật lý:
1. Có Biến áp nguồn (`optical-power-supply`) trên bàn thí nghiệm (không nằm trên kệ trưng bày).
2. Hai dây dẫn điện 3D (Đỏ cực dương $+$ và Xanh cực âm $-$) nối từ cọc lấy điện DC của nguồn đến giắc cắm đuôi đèn.
3. Công tắc Biến áp nguồn ở trạng thái **BẬT** (`psuInst.isPoweredOn === true`).

$$\text{isLampOn} = (\text{psuInst} \neq \text{null}) \land (\text{psuInst.isPoweredOn} === \text{true}) \land (\text{lampInst.isPoweredOn} !== \text{false})$$

Nếu nguồn tắt hoặc chưa cắm dây:
- Đèn tắt hoàn toàn (cả bóng đèn, vùng sáng lẫn chùm tia).
- Hiển thị hướng dẫn trực quan: `"⚡ Cần nối dây & Bật công tắc Biến áp nguồn để thắp sáng đèn"`.

---

### 2.2. Đường truyền tia sáng trong không khí (Unobstructed Light Ray)

Khi đèn sáng, chùm tia (1 tia, 2 tia, 3 tia, song song, hoặc phân kì) xuất phát từ khẩu độ đèn ($x_0, y_0, z_0$) truyền thẳng theo vector hướng $\vec{u}$:
$$\vec{r}(t) = \vec{r}_0 + t \cdot \vec{u}, \quad t \ge 0$$
Tia sáng truyền thẳng liên tục qua không gian với chiều dài khảo sát $L = 0.60\text{ m}$ nếu không gặp bất kỳ vật cản quang học nào.

---

### 2.3. Tương tác Hình học thời gian thực với Thấu kính (Optical Lens Interaction)

- Vị trí quang tâm thấu kính: $\vec{C}_L = (x_L, y_L, z_L)$, bán kính mở của thấu kính $R_L = 0.035\text{ m}$.
- Khoảng cách vuông góc từ tia sáng tới quang trục thấu kính:
  $$d_{\perp} = \sqrt{(y_{\text{ray}} - y_L)^2 + (z_{\text{ray}} - z_L)^2}$$
- **Điều kiện khúc xạ qua thấu kính**:
  $$x_L > x_{\text{lamp}} \quad \text{và} \quad d_{\perp} \le R_L$$
  - Nếu thỏa mãn: Tia sáng đi vào mặt trước thấu kính, khúc xạ theo định luật Snell qua 2 mặt cầu, hội tụ tại tiêu điểm $F'$ (thấu kính hội tụ) hoặc phân kì từ tiêu điểm ảo $F$ (thấu kính phân kì).
  - Nếu KHÔNG thỏa mãn (thấu kính lệch ra ngoài, đặt lệch trục $z$, hoặc để quá cao $y$): Tia sáng tiếp tục truyền thẳng.

---

### 2.4. Tương tác Hình học thời gian thực với Lăng kính (Optical Prism Interaction)

- Lăng kính tam giác đều có góc chiết quang $A = 60^\circ$, chiết suất thủy tinh $n \approx 1.517$.
- Bounding Box vùng bắt sáng của khối lăng kính:
  $$x_P - 0.020 \le x \le x_P + 0.020$$
  $$z_P - 0.022 \le z \le z_P + 0.022$$
  $$y_P + 0.065 \le y \le y_P + 0.135$$
- **Khi tia sáng đi trúng mặt lăng kính**:
  1. Khúc xạ tại mặt tới thứ nhất với góc tới $i_1$:
     $$\sin i_1 = n \cdot \sin r_1$$
  2. Góc tới mặt thứ hai bên trong lăng kính:
     $$r_2 = A - r_1$$
  3. Khúc xạ ló ra không khí ở mặt thứ hai:
     $$n \cdot \sin r_2 = \sin i_2$$
  4. Góc lệch toàn phần của tia sáng qua lăng kính:
     $$D = i_1 + i_2 - A$$
     Tia sáng bị **bẻ lệch hướng về phía đáy của lăng kính**!
  5. Đối với ánh sáng trắng: Xảy ra hiện tượng **tán sắc ánh sáng** (Dispersion) do chiết suất phụ thuộc bước sóng $n(\lambda)$, tách thành dải màu biến thiên liên tục từ Đỏ ($D_{\text{đỏ}}$ nhỏ nhất) đến Tím ($D_{\text{tím}}$ lớn nhất).

---

## 3. KẾ HOẠCH TRIỂN KHAI

1. **Tách bỏ chùm tia giả**: Xóa bỏ `dispersion_spectrum` gắn cứng trong file `ProceduralLabModels.ts` của `optical-prism`. Lăng kính trở thành khối thủy tinh quang học thuần túy.
2. **Khóa liên động điện**: Sửa logic cấp nguồn trong `LabViewport3D.tsx` để đèn chỉ sáng khi Biến áp nguồn đang trên bàn và đang BẬT.
3. **Bộ kiểm tra tương giao quang học thời gian thực (Dynamic Raycaster)**:
   - Trong vòng lặp render, mỗi tia sáng từ đèn quét kiểm tra xem phía trước có `optical-prism` hoặc `optical-lens` nằm chắn ngang luồng sáng không.
   - Nếu trúng lăng kính $\to$ bẻ tia theo góc lệch $D$ và vẽ dải tán sắc.
   - Nếu trúng thấu kính $\to$ khúc xạ hội tụ/phân kì.
   - Nếu để lệch hoặc không có gì $\to$ tia sáng đi thẳng tắp trong không khí.
