# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 08: HỘP PIN NGUỒN THÍ NGHIỆM 3V - 6V
**Mã định danh hệ thống (Asset ID)**: `battery-holder-pack` | **Mã số Catalog**: `OL3D-EQP-ELE-0001`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-DI-01`  
**Tên tiếng Anh**: *Modular Battery Holder Pack with Terminals*  
**Phân môn**: Vật lý - Điện học một chiều DC | **Bài học SGK KHTN 8**: Bài: Mạch điện đơn giản, Cường độ dòng điện, Hiệu điện thế (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Cung cấp nguồn điện một chiều hạ áp an toàn ($1.5\text{ V}, 3\text{ V}, 4.5\text{ V}, 6\text{ V}$), tích hợp cầu chì/công tắc bảo vệ ngắn mạch và 2 cọc cắm bắp chuối tiêu chuẩn phòng học bộ môn.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Mỗi viên pin hóa học sinh ra suất điện động $\mathcal{E}_0 = 1.5\text{ V}$ và điện trở trong $r_0 \approx 0.15\,\Omega$. Khi mắc nối tiếp $n$ pin, suất điện động của bộ nguồn bằng tổng các suất điện động: $\mathcal{E}_b = n \cdot \mathcal{E}_0$, và điện trở trong $r_b = n \cdot r_0$.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Định luật Ohm cho toàn mạch:
$$I = \frac{\mathcal{E}_b}{R_{\text{ngoài}} + r_b}$$
Hiệu điện thế giữa hai cực của nguồn điện khi cấp tải:
$$U = \mathcal{E}_b - I \cdot r_b$$
Khi hở mạch ($I = 0$): $U = \mathcal{E}_b$.
Khi ngắn mạch ($R_{\text{ngoài}} \approx 0$):
$$I_{\text{ngắn mạch}} = \frac{\mathcal{E}_b}{r_b} = \frac{6.0}{4 \times 0.15} = 10\text{ A} \implies \text{Cầu chì nhiệt ngắt mạch bảo vệ!}$$

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Vỏ hộp nhựa ABS** | 120 x 75 x 32 mm | `0.120 x 0.075 x 0.032 m` | Bảo vệ pin và cách điện an toàn |
| **Cọc cắm bắp chuối Đỏ (+)** | phi 4 mm, cao 16 mm, cách cọc âm 50 mm | `phi 0.008 x 0.016 m` | Đấu nối cực dương nguồn điện |
| **Cọc cắm bắp chuối Đen (-)** | phi 4 mm, cao 16 mm | `phi 0.008 x 0.016 m` | Đấu nối cực âm nguồn điện |
| **Công tắc gạt số nấc pin** | 30 x 10 x 8 mm | `0.030 x 0.010 x 0.008 m` | Lựa chọn 2 pin (3V) hoặc 4 pin (6V) |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Khoảng cách giữa 2 cọc / Chiều rộng hộp** | `D_{\text{cọc}} / W` | **50 mm / 75 mm = 66.7%** | Đủ rộng để cắm 2 jack bắp chuối mà không chạm chập |
| **Chiều cao cọc / Chiều cao hộp** | `H_{\text{cọc}} / H_{\text{hộp}}` | **16 mm / 32 mm = 50%** | Dễ cầm ngón tay cắm và rút dây |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Lỗ cắm bắp chuối** | 4.0 mm | `+0.1 mm / -0.0 mm` | Khớp tiêu chuẩn phích cắm chuối 4mm phòng Lab |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `PositiveTerminal`**: Tọa độ cục bộ `(0.025, 0.032, 0.015)` | Loại cổng: `electrical_terminal_dc_pos` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `ElectricalWire.BananaPlug`
- **Cổng `NegativeTerminal`**: Tọa độ cục bộ `(-0.025, 0.032, 0.015)` | Loại cổng: `electrical_terminal_dc_neg` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `ElectricalWire.BananaPlug`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Đặt trên bàn phòng thí nghiệm (0 DOF).

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Kéo đầu dây điện cắm vào cọc Đỏ (+) hoặc cọc Đen (-).
2. Gạt công tắc chọn mức điện áp $3\text{ V}$ hoặc $6\text{ V}$.
3. Bật/tắt công tắc cấp nguồn chính.

### 3.4. Vùng va chạm & Hitbox Raycasting
Hộp OBB kích thước 0.125 x 0.050 x 0.080 m bao quanh vỏ và 2 cọc cắm.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `isSwitchOn` | `boolean` | `true / false` | `true` | Bật/tắt nguồn |
| `selectedCells` | `number` | `2 | 4` | `4` | Số viên pin đang chọn (2 viên = 3V, 4 viên = 6V) |
| `outputVoltage` | `number` | `[0, 6.0]` | `6.0` | Hiệu điện thế đo được giữa 2 cọc (V) |
| `isShortCircuited` | `boolean` | `true / false` | `false` | Trạng thái ngắn mạch nguy hiểm |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Khi mạch ngoài kín: Kết nối với `ElectricalCircuitEngine` tính toán tổng trở $R_{\text{ngoài}}$. Nếu $R_{\text{ngoài}} < 0.5\,\Omega$, tự động ngắt rơle bảo vệ `isShortCircuited = true` và phát tín hiệu cảnh báo màu đỏ.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Đèn LED báo nguồn màu xanh lá cây sáng rực khi bật; nhấp nháy đỏ báo động khi bị chập mạch.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng 'tách' dứt khoát khi gạt công tắc; tiếng 'bíp' cảnh báo ngắn mạch.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Dòng xả liên tục an toàn tối đa: $I \le 2.0\text{ A}$.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Nối trực tiếp 1 sợi dây đồng giữa cọc Đỏ và cọc Đen** | Đoản mạch, dòng tăng vọt làm pin nóng ran và tự ngắt rơle | Tuyệt đối không nối tắt trực tiếp hai cực của nguồn điện! |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
BatteryPack_Root (Group)
  ├── Mesh_PlasticCasing (Vỏ hộp ABS)
  ├── Mesh_BatteryCell[0..3] (4 viên pin AA có nhãn cực)
  ├── Mesh_RedBindingPost (Cọc cắm cực dương màu đỏ)
  ├── Mesh_BlackBindingPost (Cọc cắm cực âm màu đen)
  ├── Mesh_SlideSwitch (Cần gạt chuyển mạch 3V/6V)
  └── Mesh_IndicatorLed (Đèn LED chỉ báo nguồn)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ đáy hộp (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Vỏ nhựa ABS** | `MeshStandardMaterial` | `color: #27272a, roughness: 0.65, metalness: 0.1` | Nhựa đen nhám đúc gờ chống va đập |
| **Cọc Đỏ (+)** | `MeshStandardMaterial` | `color: #dc2626, roughness: 0.3, metalness: 0.5` | Nhựa đỏ bọc lõi đồng |
| **Cọc Đen (-)** | `MeshStandardMaterial` | `color: #18181b, roughness: 0.3, metalness: 0.5` | Nhựa đen bọc lõi đồng |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
