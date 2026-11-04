# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 04: ỐNG TRỤ KHẢO SÁT ÁP SUẤT CHẤT LỎNG ĐÁY & THÀNH
**Mã định danh hệ thống (Asset ID)**: `liquid-pressure-tube` | **Mã số Catalog**: `OL3D-EQP-HYD-0001`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-CO-04`  
**Tên tiếng Anh**: *Liquid Pressure Elastic Membrane Tube*  
**Phân môn**: Vật lý - Áp suất chất lỏng | **Bài học SGK KHTN 8**: Bài: Áp suất chất lỏng (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Chứng minh thực nghiệm trực quan: Áp suất chất lỏng tác dụng lên đáy bình, thành bình và các vật đặt trong nó theo mọi hướng, độ lớn áp suất tăng tỷ lệ thuận với độ sâu.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Tại độ sâu $h$, áp suất chất lỏng gây áp lực lên bề mặt màng cao su. Khi áp suất bên trong lớn hơn bên ngoài, màng cao su biến dạng lồi ra; khi áp suất bên ngoài lớn hơn, màng cao su biến dạng lõm vào. Độ võng của màng $\delta$ tỷ lệ thuận với độ chênh áp $\Delta p$.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Áp suất thủy tĩnh tại độ sâu $h$:
$$p = p_0 + d \cdot h = p_0 + \rho \cdot g \cdot h$$
Độ chênh lệch áp suất giữa mặt trong và mặt ngoài màng cao su:
$$\Delta p = p_{\text{trong}} - p_{\text{ngoài}} = \rho \cdot g \cdot (h_{\text{trong}} - h_{\text{ngoài}})$$
Độ phồng/lõm cực đại tại tâm màng tròn bán kính $R$ và độ dày $t$, mô đun đàn hồi $E$:
$$\delta_{\max} \approx \frac{\Delta p \cdot R^4}{64 \cdot D_{\text{uốn}}}, \quad D_{\text{uốn}} = \frac{E \cdot t^3}{12(1 - \nu^2)}$$

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Ống trụ nhựa Mica trong** | phi ngoài 32 mm, phi trong 28 mm, cao 220 mm | `phi 0.032 x 0.220 m` | Thân ống chứa chất lỏng trong suốt |
| **Cửa sổ màng cao su bên hông** | phi 18 mm, tâm cách đáy 40 mm | `phi 0.018 m` | Khảo sát áp suất tác dụng lên thành bình |
| **Màng cao su đáy bình** | phi 32 mm, dày 0.15 mm | `phi 0.032 m` | Khảo sát áp suất tác dụng lên đáy bình |
| **Vành kẹp khóa màng** | phi 34 x 10 mm | `phi 0.034 x 0.010 m` | Giữ kín màng cao su không rò rỉ nước |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Chiều cao / Đường kính ngoài** | `H / \varnothing` | **220 mm / 32 mm = 6.875** | Tạo cột nước đủ cao để màng cao su biến dạng rõ ràng quan sát mắt thường |
| **Vị trí cửa sổ hông / Chiều cao ống** | `H_{hông} / H` | **40 mm / 220 mm = 18.2%** | Đặt sát đáy nơi áp suất thủy tĩnh lớn nhất |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Vành ren kẹp cao su** | 32.0 mm | `+/- 0.1 mm` | Gioăng ép kín nước tuyệt đối (IP67) |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `TopFunnelPort`**: Tọa độ cục bộ `(0, 0.110, 0)` | Loại cổng: `fluid_inlet` | Hướng pháp tuyến: `Thẳng đứng xuống -Y` | Tương thích ghép nối: `beaker-250.Spout, dropper-pipette.Tip`
- **Cổng `ImmersionHandle`**: Tọa độ cục bộ `(0, 0.090, 0)` | Loại cổng: `clamp_grip` | Hướng pháp tuyến: `Ngang` | Tương thích ghép nối: `UniversalClamp`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
6 DOF tự do khi cầm tay di chuyển nhúng vào bể nước.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Đổ nước vào trong lòng ống $\rightarrow$ màng đáy và màng hông phồng lồi ra ngoài.
2. Cầm ống dìm sâu dần vào bể nước lớn $\rightarrow$ quan sát màng biến dạng lõm ngược vào trong.

### 3.4. Vùng va chạm & Hitbox Raycasting
Hình trụ tròn 0.036 x 0.220 m bao phủ toàn bộ thân và vành kẹp.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `internalWaterLevelMm` | `number` | `[0, 200]` | `0.0` | Mực nước đổ bên trong ống (mm) |
| `immersionDepthMm` | `number` | `[0, 300]` | `0.0` | Độ sâu nhúng trong bể nước ngoài (mm) |
| `sideBulgeFactor` | `number` | `[-1.0, 1.0]` | `0.0` | Độ phồng màng hông (+ lồi ra, - lõm vào) |
| `bottomBulgeFactor` | `number` | `[-1.0, 1.0]` | `0.0` | Độ phồng màng đáy (+ lồi ra, - lõm vào) |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Tính chênh áp $\Delta p_{\text{hông}} = \rho g (h_{\text{trong}} - h_{\text{ngoài, hông}})$. Áp dụng hàm biến dạng đỉnh màng (Vertex Displacement Shader) trên lưới geometry của màng cao su theo thời gian thực.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
• Màng cao su căng tròn lồi/lõm mượt mà theo độ sâu.
• Mặt thoáng chất lỏng dao động gợn sóng khi nhấp nhô ống.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng nước chảy róc rách khi rót vào ống; tiếng ục nước khi dìm ống sâu.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Độ cao cột nước tối đa: $200\text{ mm}$. Áp suất tối đa tránh rách màng: $\Delta p \le 5000\text{ Pa}$.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Dùng que nhọn hoặc lực kế đâm vào màng** | Rách màng cao su, nước tràn ra bàn | Màng cao su rất mỏng, không dùng vật sắc nhọn chạm vào. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
LiquidPressureTube_Root (Group)
  ├── Mesh_AcrylicTube (Ống trụ mica trong suốt)
  ├── Mesh_BottomRing (Vòng kẹp ren đáy)
  ├── Mesh_SideRing (Vòng kẹp ren cửa sổ hông)
  ├── Mesh_BottomMembrane (Đĩa màng cao su đáy có morphTarget biến dạng)
  ├── Mesh_SideMembrane (Đĩa màng cao su hông có morphTarget biến dạng)
  └── Mesh_InnerWaterColumn (Cột nước bên trong tăng giảm theo chiều cao)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tâm gốc (0, 0, 0) tại tâm mặt tròn đáy ống.

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Ống mica** | `MeshPhysicalMaterial` | `transmission: 0.95, opacity: 1, roughness: 0.05, ior: 1.49, color: #ffffff` | Nhựa Acrylic trong suốt không bọt khí |
| **Màng cao su** | `MeshStandardMaterial` | `color: #fecdd3, roughness: 0.6, metalness: 0.05` | Cao su tự nhiên đàn hồi mờ màu hồng nhạt |
| **Cột nước** | `MeshPhysicalMaterial` | `transmission: 0.92, roughness: 0.02, ior: 1.333, color: #38bdf8` | Nước trong xanh khúc xạ ánh sáng |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
