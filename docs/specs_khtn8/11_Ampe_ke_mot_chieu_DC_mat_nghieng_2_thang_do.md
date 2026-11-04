# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 11: AMPE KẾ MỘT CHIỀU DC MẶT NGHIÊNG 2 THANG ĐO
**Mã định danh hệ thống (Asset ID)**: `dc-analog-ammeter` | **Mã số Catalog**: `OL3D-EQP-ELE-0004`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-DI-04`  
**Tên tiếng Anh**: *Dual-Scale DC Analog Ammeter 0.6A / 3A*  
**Phân môn**: Vật lý - Đo lường điện học | **Bài học SGK KHTN 8**: Bài: Đo cường độ dòng điện & Định luật Ohm (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Đo cường độ dòng điện một chiều trong mạch mắc nối tiếp với độ chính xác cao, cung cấp 2 thang đo linh hoạt ($0.6\text{ A}$ và $3\text{ A}$) phù hợp với mọi bài thực hành THCS.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Cơ cấu đo từ điện: Khung dây dẫn tròn đặt trong từ trường đều của nam châm vĩnh cửu. Khi có dòng điện $I$ chạy qua, lực từ tạo mômen quay làm lệch khung dây chống lại lò xo xoắn cản. Góc lệch của kim tỉ lệ bậc nhất với cường độ dòng điện: $\alpha = k \cdot I$.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Phương trình cân bằng mômen cơ cấu từ điện:
$$M_{\text{từ}} = M_{\text{cản}} \iff B \cdot I \cdot S \cdot N = C_{\text{xoắn}} \cdot \alpha \implies \alpha = \left( \frac{B \cdot S \cdot N}{C_{\text{xoắn}}} \right) \cdot I = S_I \cdot I$$
Độ nhạy góc quay: Thang $0.6\text{ A}$ quay tối đa $90^\circ$ khi $I = 0.6\text{ A}$ (mỗi vạch $0.02\text{ A} = 3^\circ$); Thang $3\text{ A}$ quay $90^\circ$ khi $I = 3\text{ A}$ (mỗi vạch $0.1\text{ A} = 3^\circ$).
Điện trở trong của ampe kế:
$$R_A(0.6\text{ A}) \approx 0.5\,\Omega, \quad R_A(3\text{ A}) \approx 0.1\,\Omega$$

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Vỏ hộp mặt nghiêng** | 100 x 135 x 100 mm | `0.100 x 0.135 x 0.100 m` | Vỏ bảo vệ công thái học góc nhìn 45 độ |
| **Mặt kính hiển thị quạt tròn** | Bán kính cung 65 mm, góc mở 90 độ | `0.090 x 0.070 m` | Bảo vệ kim và in 2 thang đo |
| **Kim chỉ thị nhôm đỏ** | Dài 62 mm, bản rộng 0.8 mm | `0.062 m` | Chỉ thị giá trị đo chính xác |
| **3 cọc cắm bắp chuối mạ đồng** | Cọc âm Đen (-), cọc dương Đỏ (+0.6A, +3A) | `phi 0.009 x 0.018 m` | Đấu nối mạch điện |
| **Núm xoay chỉnh zero cơ** | phi 12 x 5 mm | `phi 0.012 x 0.005 m` | Chỉnh kim về đúng vạch số 0 ban đầu |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Góc nghiêng mặt đồng hồ** | `\alpha_{\text{nghiêng}}` | **45 độ** | Góc nhìn tối ưu cho học sinh ngồi trên bàn thí nghiệm |
| **Tỷ lệ thang đo lớn / thang nhỏ** | `Thang 3A / Thang 0.6A` | **3.0 / 0.6 = 5.0** | Nhân hệ số 5 thuận tiện tính toán số liệu |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Cấp chính xác đo lường cơ học** | Cấp 2.5 | `+/- 2.5% toàn thang` | Tiêu chuẩn TCVN thiết bị giáo dục |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `Terminal_CommonNeg`**: Tọa độ cục bộ `(-0.030, 0.025, 0.055)` | Loại cổng: `electrical_terminal_ammeter_neg` | Hướng pháp tuyến: `+Z` | Tương thích ghép nối: `ElectricalWire.BananaPlug`
- **Cổng `Terminal_Pos06A`**: Tọa độ cục bộ `(0.000, 0.025, 0.055)` | Loại cổng: `electrical_terminal_ammeter_pos_06` | Hướng pháp tuyến: `+Z` | Tương thích ghép nối: `ElectricalWire.BananaPlug`
- **Cổng `Terminal_Pos3A`**: Tọa độ cục bộ `(+0.030, 0.025, 0.055)` | Loại cổng: `electrical_terminal_ammeter_pos_3` | Hướng pháp tuyến: `+Z` | Tương thích ghép nối: `ElectricalWire.BananaPlug`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Kim chỉ thị có 1 DOF xoay quanh trục tâm: Góc quay $\theta \in [0^\circ, 95^\circ]$.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Vặn núm xoay chỉnh zero để đưa kim về đúng số 0.
2. Cắm dây vào cọc (-) và chọn cọc (+0.6A) hoặc (+3A).
3. Đọc số chỉ kim trên vạch chia tương ứng.

### 3.4. Vùng va chạm & Hitbox Raycasting
Khối OBB dốc mặt nghiêng 0.100 x 0.135 x 0.105 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `selectedRange` | `enum` | `'0.6A' | '3A' | 'unconnected'` | `'unconnected'` | Thang đo đang cắm dây |
| `currentMeasuredA` | `number` | `[-0.5, 5.0]` | `0.0` | Dòng điện thực tế chạy qua (A) |
| `needleAngleDeg` | `number` | `[-5, 95]` | `0.0` | Góc quay thực tế của kim chỉ thị |
| `isPeggedOverload` | `boolean` | `true / false` | `false` | Kim kịch biên quá tải |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Xác định cực đấu dây: Nếu cắm ngược cực (dòng âm), kim quay giật ngược về bên trái vạch 0 (kịch chốt chặn âm $-5^\circ$). Nếu cắm đúng cực: Tính góc quay $\theta = (I / I_{\text{thang}}) \times 90^\circ$ với hiệu ứng dao động giảm chấn nhị thức (Underdamped Spring Simulation).

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Kim màu đỏ chuyển động mượt mà có quán tính và rung nhẹ trước khi dừng ở vị trí cân bằng.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng 'cạch' nhẹ khi kim chỉ thị va vào chốt hãm kịch kim bên phải.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Dòng điện tối đa không phá hủy: $1.2 \times I_{\text{thang}}$. Quá $5\text{ A}$ cháy cuộn dây khung quay.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Mắc ampe kế song song trực tiếp với nguồn pin 6V** | Đoản mạch nguồn, dòng qua ampe kế vọt lên > 10A làm cháy cuộn dây khung quay | Tuyệt đối không mắc ampe kế song song vào nguồn điện! |
| **Cắm nhầm cực (+ vào cọc Đen, - vào cọc Đỏ)** | Kim đập mạnh về phía trái gây cong vênh kim chỉ thị | Chú ý nối cọc dương ampe kế về phía cực dương của nguồn. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
Ammeter_Root (Group)
  ├── Mesh_HousingWedge (Vỏ hộp mặt nghiêng dốc)
  ├── Mesh_FacePlate (Mặt đĩa in 2 thang số laser và chữ 'A')
  ├── Group_NeedleAssembly (Cụm kim chỉ thị quay)
  │     ├── Mesh_PointerNeedle (Kim nhôm sơn đỏ)
  │     └── Mesh_CounterBalance (Đối trọng kim)
  ├── Mesh_FrontTerminals[0..2] (3 cọc cắm bắp chuối có ren vặn)
  └── Mesh_ZeroAdjustScrew (Núm xoay vít chỉnh zero)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ đáy vỏ hộp (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Vỏ hộp** | `MeshStandardMaterial` | `color: #f1f5f9, roughness: 0.4, metalness: 0.1` | Nhựa ABS màu xám sữa bền bỉ |
| **Mặt kính cong** | `MeshPhysicalMaterial` | `transmission: 0.95, roughness: 0.05, ior: 1.49` | Mica quang học chống phản xạ lóa |
| **Kim chỉ thị** | `MeshStandardMaterial` | `color: #dc2626, roughness: 0.3` | Sơn đỏ nổi bật trên nền thang trắng |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
