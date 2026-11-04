# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 13: BIẾN TRỞ CON CHẠY DÂY QUẤN ỐNG SỨ 20 OHM - 2A
**Mã định danh hệ thống (Asset ID)**: `slide-rheostat-20ohm` | **Mã số Catalog**: `OL3D-EQP-ELE-0006`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-DI-06`  
**Tên tiếng Anh**: *Slide Wire Rheostat 20 Ohm 2A*  
**Phân môn**: Vật lý - Điện trở & Biến trở | **Bài học SGK KHTN 8**: Bài: Điện trở, Biến trở, Điều chỉnh cường độ dòng điện (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Thay đổi điện trở tham gia vào mạch liên tục và mượt mà bằng cơ chế con chạy tiếp xúc trượt, dùng làm điện trở điều chỉnh dòng điện tải hoặc làm bộ phân áp (chiết áp).

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Điện trở của một đoạn dây kim loại tỉ lệ thuận với chiều dài $l$ và tỉ lệ nghịch với tiết diện $S$: $R = \rho \cdot \frac{l}{S}$. Khi trượt con chạy $C$, ta thay đổi chiều dài phần dây có dòng điện chạy qua từ đầu cắm cố định tới tiếp điểm trượt, qua đó làm thay đổi giá trị điện trở $R_{AC}$.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Công thức biến trở con chạy tuyến tính:
$$R(x) = R_{\max} \cdot \frac{x}{L_{\text{hành trình}}} = 20.0 \cdot \frac{x}{0.100} \quad (\Omega)$$
với $x \in [0, 0.100\text{ m}]$ là vị trí của con chạy dọc theo thanh dẫn hướng.
Công suất tỏa nhiệt trên biến trở:
$$P = I^2 \cdot R(x) \le P_{\max} = I_{\max}^2 \cdot R_{\max} = 2.0^2 \times 20.0 = 80\text{ W}$$
Khi sử dụng làm bộ phân áp (cấp nguồn vào 2 đầu A, B và lấy điện áp ra ở A, C):
$$U_{\text{ra}}(x) = U_{\text{vào}} \cdot \frac{x}{L_{\text{hành trình}}}$$

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Khung chân đỡ chữ L (2 đầu)** | Dài 165 x Rộng 45 x Cao 65 mm | `0.165 x 0.045 x 0.065 m` | Khung thép chịu lực đỡ ống sứ |
| **Ống trụ gốm sứ cách điện** | phi 32 x Dài 120 mm | `phi 0.032 x 0.120 m` | Trụ chịu nhiệt quấn dây điện trở |
| **Dây quấn hợp kim Constantan** | Dây phi 0.6 mm, quấn 180 vòng sít nhau | `phi 0.033 x 0.110 m` | Điện trở tổng 20 Ohm |
| **Thanh trượt kim loại mạ Crom** | phi 8 x 145 mm | `phi 0.008 x 0.145 m` | Thanh dẫn điện cho con chạy |
| **Con chạy tiếp xúc trượt** | 25 x 28 x 35 mm | `0.025 x 0.028 x 0.035 m` | Mang lá đồng tiếp xúc quệt trên dây |
| **3 cọc cắm bắp chuối** | Chốt A, chốt B (cố định), chốt C (con chạy) | `phi 0.008 x 0.016 m` | Đấu nối 3 chốt linh hoạt |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Chiều dài quấn dây / Chiều dài khung** | `L_{\text{dây}} / L_{\text{khung}}` | **110 mm / 165 mm = 66.7%** | Đảm bảo hành trình biến thiên rộng rãi |
| **Đường kính ống sứ / Chiều cao khung** | `\varnothing_{\text{sứ}} / H` | **32 mm / 65 mm = 49.2%** | Ống sứ to tản nhiệt tốt khi chịu dòng 2A |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Lá đồng con chạy quẹt trên dây** | Độ nén 1.5 mm | `+/- 0.3 mm` | Áp lực tiếp xúc đàn hồi liên tục |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `Terminal_A`**: Tọa độ cục bộ `(-0.065, 0.045, 0.015)` | Loại cổng: `electrical_terminal_rheostat_fixed` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `ElectricalWire.BananaPlug`
- **Cổng `Terminal_B`**: Tọa độ cục bộ `(+0.065, 0.045, 0.015)` | Loại cổng: `electrical_terminal_rheostat_fixed` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `ElectricalWire.BananaPlug`
- **Cổng `Terminal_C`**: Tọa độ cục bộ `(0.065, 0.060, -0.015)` | Loại cổng: `electrical_terminal_rheostat_slider` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `ElectricalWire.BananaPlug`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Con chạy có 1 DOF tịnh tiến dọc trục X: Vị trí $x \in [-0.050\text{ m}, +0.050\text{ m}]$ (hành trình $100\text{ mm}$).

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Nhấp kéo con chạy trượt dọc thanh kim loại từ trái sang phải.
2. Cắm dây vào chốt A và chốt C (mắc làm biến trở nối tiếp).
3. Cắm cả 3 chốt A, B, C (mắc làm bộ chiết áp).

### 3.4. Vùng va chạm & Hitbox Raycasting
OBB tổng thể: 0.170 x 0.070 x 0.050 m; OBB con chạy: 0.030 x 0.040 x 0.035 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `sliderNormalizedPos` | `number` | `[0.0, 1.0]` | `0.5` | Vị trí con chạy chuẩn hóa (0 = đầu A, 1 = đầu B) |
| `resistanceACOhm` | `number` | `[0.1, 20.0]` | `10.0` | Điện trở giữa cực A và con chạy C |
| `currentAmps` | `number` | `[0.0, 3.0]` | `0.0` | Dòng điện đang chạy qua biến trở |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
$$R_{AC} = \max(0.1, 20.0 \times \text{sliderNormalizedPos}), \quad R_{CB} = \max(0.1, 20.0 \times (1.0 - \text{sliderNormalizedPos}))$$. Cập nhật ngay lập tức vào ma trận nút mạch của `ElectricalCircuitEngine` khi con chạy di chuyển.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
• Lá tiếp điểm bằng đồng thau trượt sáng bóng trên rãnh dây kim loại cạo sạch men cách điện.
• Hiển thị số đo điện trở tức thời bên cạnh con chạy (Dynamic HUD).

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Âm thanh xào xạc kim loại 'xoẹt... xoẹt' chân thực của lá đồng cọ xát trên các vòng dây quấn.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Cường độ dòng điện cực đại cho phép: $I_{\max} = 2.0\text{ A}$.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Kéo con chạy về vị trí 0 ohm khi đang nối thẳng với nguồn 6V** | Dòng điện tăng vọt > 5A làm dây quấn quá nhiệt bốc khói hoặc cháy đứt | Quy tắc an toàn: Trước khi đóng điện, luôn gạt con chạy về vị trí có điện trở lớn nhất! |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
SlideRheostat_Root (Group)
  ├── Mesh_MetalEndFrames[0..1] (2 giá đỡ chữ L bằng thép dập)
  ├── Mesh_CeramicTube (Ống sứ trắng chịu nhiệt)
  ├── Mesh_WireCoil (Cuộn dây Constantan có bump map vân rãnh tròn)
  ├── Mesh_GuideRail (Thanh kim loại tròn dẫn hướng)
  ├── Group_Slider (Khối con chạy trượt theo trục X)
  │     ├── Mesh_PlasticKnob (Núm cầm tay nhựa đỏ)
  │     ├── Mesh_CopperSpringWiper (Lá quẹt đồng đàn hồi)
  │     └── Mesh_SliderCollet (Vòng trượt ôm thanh ray)
  └── Mesh_Terminals[0..2] (3 cọc cắm bắp chuối A, B, C)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ đáy chân giá đỡ (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Ống gốm sứ** | `MeshStandardMaterial` | `color: #e2e8f0, roughness: 0.8, metalness: 0.05` | Gốm kỹ thuật trắng chịu nhiệt cao |
| **Dây Constantan** | `MeshStandardMaterial` | `color: #94a3b8, roughness: 0.35, metalness: 0.8` | Dây hợp kim kim loại phủ men xám ánh đồng |
| **Con chạy** | `MeshStandardMaterial` | `color: #dc2626, roughness: 0.4, metalness: 0.2` | Nhựa cách điện màu đỏ công nghiệp |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
