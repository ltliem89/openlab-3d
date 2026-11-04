# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 05: ÁP KẾ CHỮ U ĐO ÁP SUẤT CHẤT LỎNG
**Mã định danh hệ thống (Asset ID)**: `u-tube-manometer` | **Mã số Catalog**: `OL3D-EQP-HYD-0002`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-CO-05`  
**Tên tiếng Anh**: *U-Tube Liquid Manometer*  
**Phân môn**: Vật lý - Áp suất chất lỏng & Khí quyển | **Bài học SGK KHTN 8**: Bài: Áp suất chất lỏng & Áp suất khí quyển (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Đo độ chênh lệch áp suất chính xác bằng cột chất lỏng chỉ thị, kết hợp cùng hộp cảm ứng màng đàn hồi để đo định lượng áp suất thủy tĩnh tại các độ sâu và phương hướng khác nhau.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Khi một nhánh nối với hộp màng cảm ứng chịu áp suất $p$, áp lực đẩy cột chất lỏng nhánh đó tụt xuống và dâng lên ở nhánh hở đối diện. Độ chênh lệch chiều cao $\Delta h$ phản ánh chính xác độ chênh áp suất theo nguyên lý áp kế vi sai thủy tĩnh.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Định luật áp kế chữ U:
$$p_{\text{cảm ứng}} - p_0 = \rho_{\text{chỉ thị}} \cdot g \cdot \Delta h = \rho_{\text{chỉ thị}} \cdot g \cdot (h_2 - h_1)$$
Khi sử dụng nước pha màu ($\rho = 1000\text{ kg/m}^3$) đo áp suất cột nước sâu $h$:
$$\Delta h = \frac{\rho_{\text{nước}}}{\rho_{\text{chỉ thị}}} \cdot h = h$$
(Độ chênh lệch $\Delta h$ trên áp kế đúng bằng độ sâu dìm hộp cảm ứng trong nước).

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Bảng gắn vạch chia** | 80 x 320 x 15 mm | `0.080 x 0.320 x 0.015 m` | Khung gắn đỡ ống và hiển thị thang đo mm |
| **Ống thủy tinh chữ U** | phi ngoài 8 mm, phi trong 5 mm, cao 260 mm | `0.050 x 0.260 x 0.008 m` | Ống chứa chất lỏng chỉ thị |
| **Thang đo đối xứng** | -100 mm .. 0 .. +100 mm | `0.200 m` | Đọc trực tiếp chênh lệch mức nước |
| **Ống dây tiô mềm dẫn khí** | phi ngoài 6 mm, phi trong 4 mm, dài 600 mm | `phi 0.006 x 0.600 m` | Nối kín khí từ nhánh áp kế tới hộp cảm ứng |
| **Hộp cảm ứng màng cao su** | phi 35 x 12 mm | `phi 0.035 x 0.012 m` | Dìm vào bể nước để tiếp nhận áp lực |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Chiều cao bảng / Chiều rộng bảng** | `H / W` | **320 mm / 80 mm = 4.0** | Dáng đứng thon gọn, dễ quan sát thang dọc |
| **Khoảng cách 2 nhánh / Bán kính uốn** | `D_{nhánh} / R` | **30 mm / 15 mm = 2.0** | Góc uốn trơn láng tránh bọt khí ứ đọng |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Khớp cắm ống tiô vào đầu thủy tinh** | 5.0 mm | `-0.5 mm (ống cao su ôm mút)` | Kín khí hoàn toàn không rò rỉ |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `BaseRest`**: Tọa độ cục bộ `(0, 0, 0)` | Loại cổng: `surface_rest` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `LabTable.Surface`
- **Cổng `PressureInletTip`**: Tọa độ cục bộ `(-0.015, 0.250, 0)` | Loại cổng: `air_nozzle` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `FlexibleHose.End`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Giá bảng đo cố định tĩnh (0 DOF). Hộp cảm ứng cầm tay tự do 6 DOF.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Đặt áp kế lên bàn.
2. Cầm hộp cảm ứng nhúng vào bình chứa nước ở các độ sâu $5\text{ cm}, 10\text{ cm}, 15\text{ cm}$.
3. Xoay mặt màng cảm ứng hướng lên, hướng xuống, nằm ngang để so sánh $\Delta h$.

### 3.4. Vùng va chạm & Hitbox Raycasting
Bảng đo: OBB 0.080 x 0.320 x 0.040 m; Hộp cảm ứng: Bounding Sphere phi 0.040 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `sensorDepthMm` | `number` | `[0, 200]` | `0.0` | Độ sâu dìm hộp cảm ứng (mm) |
| `sensorOrientationDeg` | `number` | `[0, 360]` | `0.0` | Góc quay của mặt màng cảm ứng |
| `deltaHMm` | `number` | `[-100, 100]` | `0.0` | Độ chênh 2 mực chất lỏng chỉ thị (mm) |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Khi hộp cảm ứng ở độ sâu $h$: $p = \rho g h$. Áp suất này truyền đẳng hướng qua không khí trong ống mềm đến nhánh trái áp kế. $\Delta h = \frac{p}{\rho_{\text{chỉ thị}} g}$. Mực nước nhánh trái hạ $\Delta h / 2$, mực nước nhánh phải dâng $\Delta h / 2$.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Chất lỏng màu đỏ cánh sen dâng lên hạ xuống mượt mà; hiển thị thước đo số phóng đại khi rê chuột lại gần.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng màng cao su đàn hồi căng nhẹ; tiếng bọt nước.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Áp suất đo tối đa: $2000\text{ Pa}$ (tương ứng $\Delta h = 200\text{ mm}$ cột nước). Tránh để chất lỏng tràn ra khỏi ống.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Ống nối tiô bị tuột hoặc thủng hở khí** | Mất áp suất truyền, hai nhánh luôn cân bằng ở vạch 0 | Kiểm tra độ kín khí của hệ thống trước khi đo. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
Manometer_Root (Group)
  ├── Mesh_Backboard (Bảng gỗ/nhựa in vạch chia laser)
  ├── Mesh_GlassUTube (Ống chữ U thủy tinh rỗng)
  ├── Mesh_FluidColumn (Cột chất lỏng chữ U có shader animated level)
  ├── Mesh_MetalClamps[0..3] (Các ngàm kẹp giữ ống)
  └── Group_SensorHose (Dây tiô mềm spline và hộp cảm ứng)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ đáy bảng (0, 0, 0) tiếp xúc bàn.

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Bảng đo** | `MeshStandardMaterial` | `color: #f8fafc, roughness: 0.5, metalness: 0.1` | Nhựa ABS trắng in số đen chính xác |
| **Ống chữ U** | `MeshPhysicalMaterial` | `transmission: 0.96, roughness: 0.04, ior: 1.52` | Thủy tinh trong suốt |
| **Dung dịch chỉ thị** | `MeshStandardMaterial` | `color: #e11d48, roughness: 0.2` | Dung dịch màu đỏ hồng cánh sen rực rỡ |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
