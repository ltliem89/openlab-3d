# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 10: ĐUI ĐÈN & BÓNG ĐÈN PIN THÍ NGHIỆM 2.5V - 3.8V
**Mã định danh hệ thống (Asset ID)**: `miniature-bulb-socket` | **Mã số Catalog**: `OL3D-EQP-ELE-0003`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-DI-03`  
**Tên tiếng Anh**: *Miniature Light Bulb with Screw Base Socket*  
**Phân môn**: Vật lý - Mạch điện & Tác dụng nhiệt, phát sáng | **Bài học SGK KHTN 8**: Bài: Mạch điện đơn giản, Tác dụng phát sáng và tác dụng nhiệt của dòng điện (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Thiết bị tiêu thụ điện trực quan nhất giúp học sinh nhận biết dòng điện trong mạch kín, khảo sát độ sáng của đèn theo hiệu điện thế và công suất tiêu thụ.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Dòng điện chạy qua dây tóc Vonfram có điện trở gây nhiệt lượng theo định luật Joule-Lenz, nung nóng dây tóc lên tới trên $2000^\circ\text{C}$ phát ra quang phổ nhìn thấy được. Độ chói phát sáng tỉ lệ phi tuyến với công suất điện tiêu thụ.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Định luật Joule-Lenz và công suất điện:
$$P = U \cdot I = I^2 \cdot R = \frac{U^2}{R}$$
Điện trở dây tóc Vonfram thay đổi mạnh theo nhiệt độ:
$$R(T) = R_0 [1 + \alpha(T - T_0)]$$
($R_{\text{nóng}} \approx 8 - 10 \times R_{\text{nguội}}$).
Độ rọi phát sáng trực quan (Luminous Flux):
$$\Phi \propto (U / U_{\text{định mức}})^{3.5}$$
(Khi $U$ tăng nhẹ, độ sáng tăng rất mạnh; khi $U > 1.35 \times U_{\text{đm}}$, dây tóc đứt cháy tức thì).

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Đế tròn đui đèn** | phi 60 x 16 mm | `phi 0.060 x 0.016 m` | Đế nhựa giữ ren đui vững trên bàn |
| **Đui xoáy E10 đồng thau** | phi 10 x 14 mm | `phi 0.010 x 0.014 m` | Ngàm ren vặn bóng đèn |
| **Bóng đèn thủy tinh E10** | phi 11 x 24 mm | `phi 0.011 x 0.024 m` | Bóng thủy tinh chứa dây tóc Vonfram trong chân không |
| **2 cọc cắm bắp chuối** | phi 4 mm, cách nhau 38 mm | `phi 0.008 x 0.014 m` | Điểm cắm dây nối |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Đường kính đế / Chiều cao tổng thể** | `\varnothing_{\text{đế}} / H_{\text{tổng}}` | **60 mm / 45 mm = 1.33** | Đế bè rộng chống lật đổ khi cắm dây điện nặng |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Ren xoáy bóng đèn E10** | E10 (DIN 40400) | `Tiêu chuẩn quốc tế` | Ren xoáy ốc trơn tru |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `Terminal_1`**: Tọa độ cục bộ `(-0.019, 0.016, 0)` | Loại cổng: `electrical_terminal_dc` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `ElectricalWire.BananaPlug`
- **Cổng `Terminal_2`**: Tọa độ cục bộ `(+0.019, 0.016, 0)` | Loại cổng: `electrical_terminal_dc` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `ElectricalWire.BananaPlug`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Bóng đèn có thể vặn xoay tháo rời khỏi đui ren (1 DOF xoay).

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Cắm 2 dây dẫn vào 2 cọc cắm.
2. Vặn tháo/lắp bóng đèn kiểm tra hiện tượng hở mạch.
3. Điều chỉnh điện áp nguồn để quan sát độ sáng tăng giảm.

### 3.4. Vùng va chạm & Hitbox Raycasting
Hình trụ tròn phi 0.062 x 0.050 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `isBulbInstalled` | `boolean` | `true / false` | `true` | Bóng đã được vặn chặt vào đui hay chưa |
| `isFilamentBroken` | `boolean` | `true / false` | `false` | Trạng thái dây tóc bị cháy đứt do quá áp |
| `voltageAcrossBulb` | `number` | `[0, 10.0]` | `0.0` | Hiệu điện thế hai đầu bóng (V) |
| `glowIntensity` | `number` | `[0, 1.0]` | `0.0` | Cường độ phát sáng chuẩn hóa |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Khi $U \le 3.8\text{ V}$: Tính $I = U / R_{\text{đèn}}$, `glowIntensity` $= (U / 3.8)^{2.5}$. Nếu $U > 5.0\text{ V}$ trong $> 0.5\text{ s}$: Đứt dây tóc `isFilamentBroken = true`, `glowIntensity = 0`, mạch hở.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
• Dây tóc Vonfram ửng đỏ rồi chuyển sang vàng sáng rực rỡ.
• Nguồn sáng điểm `PointLight` phát quầng sáng ấm lan tỏa mặt bàn phòng thí nghiệm.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng 'tách' vỡ sợi tóc rất nhỏ khi bóng bị cháy do quá áp.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Điện áp định mức: $U_{\text{đm}} = 2.5\text{ V} - 3.8\text{ V}$; Dòng định mức: $0.3\text{ A}$.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Cấp thẳng nguồn 6V vào bóng 2.5V mà không qua biến trở** | Dây tóc Vonfram lóe sáng cực đại rồi đứt cháy lập tức | Luôn kiểm tra hiệu điện thế định mức ghi trên bóng trước khi cấp điện. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
BulbSocket_Root (Group)
  ├── Mesh_CircularBase (Đế nhựa đúc có 2 cọc bắt dây)
  ├── Mesh_BrassSocketE10 (Đui ren đồng E10)
  ├── Group_RemovableBulb (Bóng đèn tháo lắp)
  │     ├── Mesh_BulbGlass (Bóng thủy tinh quả lê)
  │     ├── Mesh_Filament (Dây tóc lò xo Vonfram có emissive material)
  │     └── PointLight_Glow (Nguồn sáng điểm 3D tỏa quang học)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ đáy đế tròn (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Vỏ bóng thủy tinh** | `MeshPhysicalMaterial` | `transmission: 0.98, roughness: 0.02, ior: 1.5` | Thủy tinh trong vắt |
| **Dây tóc lò xo** | `MeshStandardMaterial` | `color: #ffedd5, emissive: #ea580c, roughness: 0.4` | Kim loại phát quang vàng cam rực rỡ |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
