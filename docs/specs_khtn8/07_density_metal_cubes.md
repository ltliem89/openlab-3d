# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 07: BỘ KHỐI LẬP PHƯƠNG ĐO KHỐI LƯỢNG RIÊNG (ĐỒNG, SẮT, NHÔM)
**Mã định danh hệ thống (Asset ID)**: `density-metal-cubes` | **Mã số Catalog**: `OL3D-EQP-MEC-0002`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-CO-07`  
**Tên tiếng Anh**: *Density Metal Cubes Set (Cu, Fe, Al)*  
**Phân môn**: Vật lý - Khối lượng riêng & Lực đẩy Archimedes | **Bài học SGK KHTN 8**: Bài: Khối lượng riêng & Trọng lượng riêng (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Thực hành đo khối lượng bằng cân điện tử, đo thể tích bằng phương pháp dìm nước bình chia độ, từ đó tính toán và so sánh khối lượng riêng của các kim loại cơ bản trong tự nhiên.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Các chất khác nhau có mật độ nguyên tử và cấu trúc mạng tinh thể khác nhau, dẫn tới khối lượng riêng $D = \frac{m}{V}$ khác nhau. Mặc dù có kích thước hình học hoàn toàn giống hệt nhau ($V = 8\text{ cm}^3$), khối lượng của khối đồng lớn hơn sắt, và sắt lớn hơn nhiều so với nhôm.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Công thức định nghĩa:
$$D = \frac{m}{V} \quad (\text{kg/m}^3 \text{ hoặc } \text{g/cm}^3), \quad d = 10 \cdot D \quad (\text{N/m}^3)$$
Thể tích chuẩn của mỗi khối lập phương cạnh $a = 2.0\text{ cm}$:
$$V = a^3 = 2.0^3 = 8.0\text{ cm}^3 = 8.0 \times 10^{-6}\text{ m}^3$$
Bảng giá trị lý thuyết chuẩn:
• Khối Đồng ($Cu$): $D_{Cu} = 8900\text{ kg/m}^3 \implies m_{Cu} = 8900 \times 8.0 \times 10^{-6} = 0.0712\text{ kg} = 71.2\text{ g}$
• Khối Sắt ($Fe$): $D_{Fe} = 7800\text{ kg/m}^3 \implies m_{Fe} = 7800 \times 8.0 \times 10^{-6} = 0.0624\text{ kg} = 62.4\text{ g}$
• Khối Nhôm ($Al$): $D_{Al} = 2700\text{ kg/m}^3 \implies m_{Al} = 2700 \times 8.0 \times 10^{-6} = 0.0216\text{ kg} = 21.6\text{ g}$

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Khối lập phương** | 20.0 x 20.0 x 20.0 mm | `0.020 x 0.020 x 0.020 m` | Vật thể chuẩn thể tích 8.0 cm3 |
| **Móc treo khoen nhỏ đỉnh** | phi 1.2 mm, vươn cao 3.5 mm | `0.0035 m` | Buộc chỉ treo vào lực kế hoặc nhúng nước |
| **Vát mép bảo vệ** | C0.5 mm | `0.0005 m` | Tránh cấn tay học sinh khi cầm |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Tỷ lệ các cạnh** | `x : y : z` | **1 : 1 : 1 (20 x 20 x 20 mm)** | Khối lập phương hoàn hảo, tính thể tích tức thì |
| **Tỷ lệ khối lượng Cu : Fe : Al** | `m_{Cu} : m_{Fe} : m_{Al}` | **71.2 : 62.4 : 21.6 = 3.30 : 2.89 : 1.00** | Trực quan hóa sự khác biệt mật độ vật chất |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Kích thước cạnh gia công CNC** | 20.00 mm | `+/- 0.05 mm` | Sai số thể tích < 0.7% |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `TopRingHook`**: Tọa độ cục bộ `(0, 0.0135, 0)` | Loại cổng: `string_tie` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `spring-dynamometer.Hook`
- **Cổng `BottomRest`**: Tọa độ cục bộ `(0, -0.010, 0)` | Loại cổng: `surface_rest` | Hướng pháp tuyến: `-Y` | Tương thích ghép nối: `electronic-balance.Pan, LabTable.Surface`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
6 DOF tự do khi cầm nắm thả rơi vật lý.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Đặt từng khối lên đĩa cân điện tử để đọc khối lượng $m$.
2. Thả chìm vào ống đong chứa $50\text{ mL}$ nước để quan sát nước dâng lên đúng $58\text{ mL}$.
3. Treo vào lực kế để đo trọng lượng và lực đẩy Archimedes.

### 3.4. Vùng va chạm & Hitbox Raycasting
Hộp OBB kích thước 0.020 x 0.024 x 0.020 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `selectedMaterial` | `enum` | `'Cu' | 'Fe' | 'Al'` | `'Cu'` | Loại kim loại của khối |
| `massGram` | `number` | `21.6 .. 71.2` | `71.2` | Khối lượng thực tính toán (g) |
| `isWeighed` | `boolean` | `true / false` | `false` | Đang nằm trên đĩa cân |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Khi đặt lên cân điện tử, kích hoạt sự kiện `onWeightDetected(massGram)`. Khi nhúng vào ống đong, tăng mực nước $\Delta V = +8\text{ mL}$.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Khắc laser chữ chìm sắc nét `Cu`, `Fe`, `Al` trên mặt đỉnh. Ánh kim loại PBR phản chiếu chân thực.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Âm va chạm 'cách' kim loại đanh chắc khi đặt lên đĩa cân inox.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Nhiệt độ tối đa: $400^\circ\text{C}$.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Thả rơi mạnh khối đồng 71g từ độ cao vào đáy ống đong thủy tinh** | Làm nứt vỡ đáy ống đong thủy tinh | Phải nghiêng ống đong và cho vật trượt nhẹ nhàng xuống đáy. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
DensityCube_Root (Group)
  ├── Mesh_CubeBody (Khối lập phương vát mép, khắc chữ laser)
  └── Mesh_SuspensionLoop (Khoen móc dây trên đỉnh)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tâm khối (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Khối Đồng (Cu)** | `MeshStandardMaterial` | `color: #c26a3e, metalness: 0.95, roughness: 0.2` | Ánh kim đỏ cam đặc trưng của đồng nguyên chất |
| **Khối Sắt (Fe)** | `MeshStandardMaterial` | `color: #71717a, metalness: 0.88, roughness: 0.35` | Xám thép công nghiệp mờ |
| **Khối Nhôm (Al)** | `MeshStandardMaterial` | `color: #e2e8f0, metalness: 0.9, roughness: 0.25` | Trắng bạc sáng nhẹ |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
