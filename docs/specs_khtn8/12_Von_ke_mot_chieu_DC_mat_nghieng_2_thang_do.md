# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 12: VÔN KẾ MỘT CHIỀU DC MẶT NGHIÊNG 2 THANG ĐO
**Mã định danh hệ thống (Asset ID)**: `dc-analog-voltmeter` | **Mã số Catalog**: `OL3D-EQP-ELE-0005`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-DI-05`  
**Tên tiếng Anh**: *Dual-Scale DC Analog Voltmeter 3V / 15V*  
**Phân môn**: Vật lý - Đo lường điện học | **Bài học SGK KHTN 8**: Bài: Đo hiệu điện thế & Định luật Ohm (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Đo hiệu điện thế một chiều giữa hai điểm mạch mắc song song với điện trở trong cực lớn, 2 thang đo tiện ích ($3\text{ V}$ và $15\text{ V}$) đảm bảo độ chính xác cho toàn bộ các thí nghiệm pin và biến áp.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Cơ cấu từ điện tương tự ampe kế nhưng được mắc nối tiếp với điện trở phụ nội bộ rất lớn ($R_{\text{phụ}} = 3000\,\Omega$ và $15000\,\Omega$). Dòng điện qua vôn kế rất bé ($I_V < 1\text{ mA}$), không làm ảnh hưởng tới phân bố dòng điện và điện áp của toàn mạch.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Điện trở trong của vôn kế:
$$R_V(3\text{ V}) = \frac{U_{\max}}{I_{\text{khung}}} = \frac{3.0}{10^{-3}} = 3000\,\Omega$$
$$R_V(15\text{ V}) = \frac{U_{\max}}{I_{\text{khung}}} = \frac{15.0}{10^{-3}} = 15000\,\Omega$$
Dòng điện rẽ qua vôn kế khi đo điện áp $U$:
$$I_V = \frac{U}{R_V} \approx 0 \implies I_{\text{mạch chính}} \approx I_{\text{tải}}$$
Góc lệch kim tỉ lệ trực tiếp với hiệu điện thế: $\alpha = S_U \cdot U$.

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Vỏ hộp mặt nghiêng** | 100 x 135 x 100 mm | `0.100 x 0.135 x 0.100 m` | Đồng bộ chuẩn thiết bị phòng thí nghiệm |
| **Mặt hiển thị quạt tròn** | Bán kính cung 65 mm, in thang 0-3V và 0-15V | `0.090 x 0.070 m` | Chữ 'V' in đậm ở giữa mặt số |
| **3 cọc cắm bắp chuối** | Cọc (-) Đen, cọc (+3V) Đỏ, cọc (+15V) Đỏ | `phi 0.009 x 0.018 m` | Đấu nối song song vào đoạn mạch |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Tỷ lệ thang đo 15V / 3V** | `Thang 15V / Thang 3V` | **15 / 3 = 5.0** | Độ chia đồng dạng, đọc nhanh giá trị |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Cấp chính xác đo lường cơ học** | Cấp 2.5 | `+/- 2.5% toàn thang` | Tiêu chuẩn giáo dục THCS |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `Terminal_CommonNeg`**: Tọa độ cục bộ `(-0.030, 0.025, 0.055)` | Loại cổng: `electrical_terminal_voltmeter_neg` | Hướng pháp tuyến: `+Z` | Tương thích ghép nối: `ElectricalWire.BananaPlug`
- **Cổng `Terminal_Pos3V`**: Tọa độ cục bộ `(0.000, 0.025, 0.055)` | Loại cổng: `electrical_terminal_voltmeter_pos_3` | Hướng pháp tuyến: `+Z` | Tương thích ghép nối: `ElectricalWire.BananaPlug`
- **Cổng `Terminal_Pos15V`**: Tọa độ cục bộ `(+0.030, 0.025, 0.055)` | Loại cổng: `electrical_terminal_voltmeter_pos_15` | Hướng pháp tuyến: `+Z` | Tương thích ghép nối: `ElectricalWire.BananaPlug`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Kim chỉ thị có 1 DOF xoay quanh trục tâm: Góc quay $\theta \in [0^\circ, 95^\circ]$.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Vặn chỉnh zero kim đồng hồ.
2. Mắc song song 2 dây từ 2 cọc đo vào 2 đầu đoạn mạch cần khảo sát.
3. Đọc chỉ số vôn kế.

### 3.4. Vùng va chạm & Hitbox Raycasting
Khối OBB dốc mặt nghiêng 0.100 x 0.135 x 0.105 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `selectedRange` | `enum` | `'3V' | '15V' | 'unconnected'` | `'unconnected'` | Thang đo đang sử dụng |
| `voltageMeasuredV` | `number` | `[-2.0, 25.0]` | `0.0` | Điện áp thực tế đang đo (V) |
| `needleAngleDeg` | `number` | `[-5, 95]` | `0.0` | Góc quay của kim chỉ thị |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Xử lý tương tự ampe kế nhưng dựa trên ma trận thế nút (Nodal Analysis): $U = V_A - V_B$. Hiển thị kim quay với phản ứng động học giảm chấn lò xo.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Kim chuyển động êm ái; chữ 'V' màu xanh đen sắc nét.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng va kim nhẹ khi kịch thang.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Điện áp tối đa chịu đựng: Thang 3V chịu tối đa $6\text{ V}$; Thang 15V chịu tối đa $30\text{ V}$.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Cắm nguồn 12V vào thang đo 3V** | Kim đập kịch biên cực mạnh làm kẹt hoặc cong kim chỉ thị | Khi chưa biết rõ độ lớn điện áp, luôn bắt đầu đo ở thang lớn (15V) trước. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
Voltmeter_Root (Group)
  ├── Mesh_HousingWedge (Vỏ hộp mặt nghiêng)
  ├── Mesh_FacePlate (Mặt số in 2 thang 0-3V và 0-15V, ký hiệu 'V')
  ├── Group_NeedleAssembly (Cụm kim chỉ thị)
  └── Mesh_FrontTerminals[0..2] (3 cọc cắm bắp chuối)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ đáy vỏ hộp (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Vỏ hộp** | `MeshStandardMaterial` | `color: #f1f5f9, roughness: 0.4, metalness: 0.1` | Nhựa ABS đồng bộ phòng Lab |
| **Kim vôn kế** | `MeshStandardMaterial` | `color: #dc2626, roughness: 0.3` | Kim nhôm sơn đỏ siêu nhẹ |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
