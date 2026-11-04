# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 18: ĐÈN CỒN THÍ NGHIỆM 150ML CÓ BẤC & NẮP CHỤP
**Mã định danh hệ thống (Asset ID)**: `spirit-burner-150` | **Mã số Catalog**: `OL3D-EQP-CHE-0004`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-HOA-04`  
**Tên tiếng Anh**: *Glass Spirit Burner 150ml with Wick and Snuffer Cap*  
**Phân môn**: Hóa học - Nguồn nhiệt năng phòng Lab | **Bài học SGK KHTN 8**: Bài: Phản ứng nhiệt phân, Đun sôi dung dịch, Tốc độ phản ứng (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Cung cấp nguồn nhiệt sạch, không khói, ngọn lửa đều đặn nhiệt độ vùng ngoài đạt $600 - 800^\circ\text{C}$ phục vụ toàn bộ các phản ứng đun nóng hóa học và nhiệt phân THCS.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Cồn ethanol ($C_2H_5OH$) thấm theo hiện tượng mao dẫn qua các sợi bông cotton của bấc đèn lên đỉnh. Tại đây hơi cồn bay hơi gặp nhiệt độ bắt cháy phản ứng mãnh liệt với oxy không khí. Dập tắt ngọn lửa an toàn bằng cách đậy nắp chụp ngắt nguồn cung cấp oxy $O_2$.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Phương trình nhiệt hóa học cháy hoàn toàn của Ethanol:
$$C_2H_5OH(l) + 3O_2(g) \xrightarrow{t^\circ} 2CO_2(g) + 3H_2O(g), \quad \Delta H = -1367\text{ kJ/mol}$$
Cấu trúc nhiệt độ 3 vùng ngọn lửa:
1. Vùng lõi tối sát bấc: $T \approx 300 - 400^\circ\text{C}$ (Hơi cồn chưa kịp hòa trộn oxy).
2. Vùng sáng ở giữa: $T \approx 500 - 600^\circ\text{C}$ (Cháy chưa hoàn toàn, có các hạt carbon vi mô phát sáng).
3. Vùng ngoài cùng đỉnh ngọn lửa: $T \approx 650 - 800^\circ\text{C}$ (Vùng nóng nhất, cháy hoàn toàn - luôn dùng vùng này để gia nhiệt).

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Bầu đèn thủy tinh nón cụt** | phi đáy 85 mm, cao 105 mm, dung tích 150 mL | `phi 0.085 x 0.105 m` | Chứa nhiên liệu cồn an toàn, đáy bè chống lật |
| **Cổ đui gốm sứ giữ bấc** | phi 20 x 18 mm, lỗ xỏ bấc phi 5.5 mm | `phi 0.020 x 0.018 m` | Cách nhiệt ngăn truyền nhiệt xuống bầu cồn |
| **Sợi bấc bông cotton tròn** | phi 5.0 mm, nhô cao 8.0 mm | `phi 0.005 x 0.008 m` | Dẫn mao dẫn cồn bốc cháy |
| **Nắp chụp dập lửa thủy tinh** | phi 32 x Cao 45 mm | `phi 0.032 x 0.045 m` | Dập tắt lửa và chống bay hơi cồn khi cất giữ |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Đường kính đáy / Chiều cao bầu** | `\varnothing_{\text{đáy}} / H` | **85 mm / 105 mm = 0.81** | Đáy bè vững chãi, triệt tiêu nguy cơ xô đổ |
| **Thể tích cồn tối đa / Dung tích bầu** | `V_{\text{cồn}} / V_{\text{bầu}}` | **100 mL / 150 mL = 66.7%** | Quy tắc an toàn: Không đổ quá 2/3 bầu đèn |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Khớp nắp chụp vào cổ đui sứ** | phi 20.0 mm | `+1.0 mm` | Úp chụp trơn tru ngắt oxy |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `FlameHeatingHotspot`**: Tọa độ cục bộ `(0, 0.145, 0)` | Loại cổng: `thermal_source` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `tripod-burner-gauze.BurnerPlacement`
- **Cổng `SnufferCapRest`**: Tọa độ cục bộ `(0, 0.110, 0)` | Loại cổng: `snuffer_cap_port` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `GlassCap.Socket`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Đặt cố định trên bàn hoặc nhấc di chuyển tự do (6 DOF). Nắp chụp có trạng thái Đậy / Mở.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Mở nắp chụp đèn cồn.
2. Nhấp que diêm/bật lửa châm lửa vào bấc.
3. Đậy nắp chụp dập tắt lửa tức thì.

### 3.4. Vùng va chạm & Hitbox Raycasting
Khối nón cụt đáy phi 0.090 x cao 0.150 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `isLit` | `boolean` | `true / false` | `false` | Trạng thái ngọn lửa đang cháy hay tắt |
| `fuelLevelNormalized` | `number` | `[0.0, 1.0]` | `0.7` | Lượng cồn còn lại trong bầu |
| `isCapOn` | `boolean` | `true / false` | `true` | Nắp chụp đang đậy hay mở |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Khi châm lửa: Kích hoạt hệ thống hạt ngọn lửa 3D (Volumetric Flame Shader) và nguồn nhiệt `PointLight` màu vàng cam ấm áp ($T = 750^\circ\text{C}$, bán kính tỏa nhiệt $0.2\text{ m}$). Khi đậy nắp chụp: Hủy hạt lửa sau $0.1\text{ s}$, `isLit = false`.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
• Ngọn lửa 3D bập bùng sống động với vùng trong màu xanh mờ và chóp vàng cam rực sáng.
• Tỏa sáng rực rỡ mặt bàn xung quanh.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng 'phụt' êm ái khi bén lửa; tiếng 'cạch' thủy tinh khi đậy nắp dập lửa.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Nhiệt lượng tỏa ra: $\approx 800\text{ W}$. Chỉ sử dụng cồn $90^\circ - 96^\circ$.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Thổi tắt đèn cồn bằng miệng** | Làm tạt ngọn lửa hoặc kéo tàn bấc bén ngược vào khe cổ bình gây nổ hơi cồn | Tuyệt đối không thổi tắt bằng miệng! Phải đậy nắp chụp để ngắt oxy. |
| **Nghiêng đèn cồn đang cháy để châm lửa sang đèn cồn khác** | Cồn lỏng tràn ra ngoài gây bắt lửa cháy lan cả mặt bàn | Không bao giờ nghiêng đèn cồn để châm lửa! Luôn dùng que đóm hoặc diêm. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
SpiritBurner_Root (Group)
  ├── Mesh_GlassReservoir (Bầu thủy tinh nón cụt)
  ├── Mesh_AlcoholFluid (Cồn lỏng trong suốt bên trong)
  ├── Mesh_CeramicCollar (Đui sứ trắng cổ bình)
  ├── Mesh_CottonWick (Sợi bấc cotton)
  ├── Group_FlameFX (Cụm hiệu ứng ngọn lửa 3D)
  │     ├── Mesh_FlameCore (Lõi lửa xanh)
  │     ├── Mesh_FlameOuter (Vỏ lửa vàng cam bập bùng)
  │     └── PointLight_Fire (Nguồn sáng điểm phát nhiệt)
  └── Mesh_SnufferCap (Nắp chụp thủy tinh tháo rời)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ đáy bình (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Bầu thủy tinh** | `MeshPhysicalMaterial` | `transmission: 0.92, roughness: 0.08, ior: 1.51` | Thủy tinh đúc dày chịu lực |
| **Đui gốm sứ** | `MeshStandardMaterial` | `color: #f8fafc, roughness: 0.9, metalness: 0.05` | Gốm xốp cách nhiệt trắng ngà |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
