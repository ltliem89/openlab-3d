# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 09: KHÓA K / CẦU DAO GẠT ĐƠN CỰC MỘT NGẢ
**Mã định danh hệ thống (Asset ID)**: `spst-switch-knife` | **Mã số Catalog**: `OL3D-EQP-ELE-0002`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-DI-02`  
**Tên tiếng Anh**: *SPST Single-Pole Knife Switch*  
**Phân môn**: Vật lý - Mạch điện DC | **Bài học SGK KHTN 8**: Bài: Mạch điện đơn giản, Mắc nối tiếp & song song (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Đóng ngắt mạch điện cơ học trực quan, cho phép học sinh quan sát rõ ràng trạng thái tiếp xúc kim loại và khoảng cách hở mạch phóng tia lửa khi cắt dòng.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Khi đóng, lưỡi đồng gập sâu vào ngàm đàn hồi tạo tiếp xúc bề mặt tốt với điện trở tiếp xúc $R_{\text{tiếp xúc}} \approx 0.01\,\Omega \approx 0$. Khi mở, không khí giữa lưỡi và ngàm là chất cách điện hoàn hảo ($R = \infty$), dòng điện trong mạch bị triệt tiêu hoàn toàn.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Phương trình chuyển mạch:
$$R_{\text{switch}}(\theta) = \begin{cases} 0.01\,\Omega & \text{nếu } \theta = 0^\circ \text{ (Đóng kín)} \\ \infty & \text{nếu } \theta > 5^\circ \text{ (Hở mạch)} \end{cases}$$
Định luật bảo toàn dòng điện tại nút mạch:
$$I_{\text{vào}} = I_{\text{ra}} = \frac{U_{\text{mạch}}}{R_{\text{tải}} + R_{\text{switch}}}$$

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Đế phíp bakelite cách điện** | 75 x 35 x 10 mm | `0.075 x 0.035 x 0.010 m` | Chân đế cách điện vững chắc |
| **Lưỡi dao gạt đồng thau** | 55 x 8 x 1.5 mm | `0.055 x 0.008 x 0.0015 m` | Thanh dẫn đóng ngắt dòng điện |
| **Cán cầm bọc nhựa** | phi 8 x 22 mm | `phi 0.008 x 0.022 m` | Tay cầm cách điện thao tác gạt an toàn |
| **Ngàm kẹp chữ U đàn hồi** | 10 x 8 x 12 mm | `0.010 x 0.008 x 0.012 m` | Kẹp chặt lưỡi dao khi đóng |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Chiều dài lưỡi dao / Chiều dài đế** | `L_{\text{dao}} / L_{\text{đế}}` | **55 mm / 75 mm = 73.3%** | Bố cục cân xứng, hành trình gạt vừa vặn tầm tay |
| **Khoảng cách 2 cọc / Chiều dài đế** | `D_{\text{cọc}} / L_{\text{đế}}` | **52 mm / 75 mm = 69.3%** | Đảm bảo khoảng cách an toàn chống đánh lửa |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Ngàm kẹp đàn hồi - Lưỡi dao** | 1.5 mm | `-0.2 mm (ngàm ép căng)` | Tiếp xúc ma sát ép chặt |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `Terminal_A`**: Tọa độ cục bộ `(-0.026, 0.010, 0)` | Loại cổng: `electrical_terminal_dc` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `ElectricalWire.BananaPlug`
- **Cổng `Terminal_B`**: Tọa độ cục bộ `(+0.026, 0.010, 0)` | Loại cổng: `electrical_terminal_dc` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `ElectricalWire.BananaPlug`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Lưỡi dao gạt có 1 DOF xoay quanh chốt bản lề: Góc xoay $\theta \in [0^\circ, 65^\circ]$.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Nhấp click vào cán cầm để chuyển đổi nhanh giữa Đóng / Mở.
2. Cắm dây điện vào 2 cọc cắm A và B.

### 3.4. Vùng va chạm & Hitbox Raycasting
OBB đế: 0.075 x 0.020 x 0.035 m; OBB cán gạt: 0.020 x 0.050 x 0.020 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `isClosed` | `boolean` | `true / false` | `false` | Trạng thái đóng mạch hay mở mạch |
| `bladeAngleDeg` | `number` | `[0, 65]` | `45.0` | Góc mở của lưỡi dao (độ) |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Khi `isClosed = true`, cập nhật ma trận dẫn nạp của mạch: $G_{AB} = 100\,\Omega^{-1}$. Khi `isClosed = false`, $G_{AB} = 0$.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Lưỡi dao hạ xuống ngàm kẹp khít; tia lửa điện siêu nhỏ xuất hiện thoáng qua nếu ngắt mạch khi đang có tải cảm kháng.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Âm thanh tanh tách 'tách' sắc bén của lưỡi đồng ngậm vào ngàm đàn hồi.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Dòng điện định mức: $I \le 3.0\text{ A}$; Điện áp tối đa: $U \le 36\text{ V}$ (hạ áp giáo dục).

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Gạt đóng công tắc khi mạch chưa kiểm tra ngắn mạch** | Tia lửa điện lớn và làm hỏng nguồn pin | Luôn kiểm tra sơ đồ dây trước khi đóng khóa K. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
KnifeSwitch_Root (Group)
  ├── Mesh_BakeliteBase (Đế phíp cam nâu)
  ├── Mesh_BindingPosts[0..1] (2 cọc bắt dây đồng thau)
  ├── Mesh_SpringContactU (Ngàm đàn hồi)
  └── Group_KnifeLever (Cụm lưỡi dao xoay quanh chốt)
        ├── Mesh_CopperBlade (Lưỡi dao đồng thau)
        └── Mesh_InsulatedHandle (Cán cầm nhựa đen)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ đáy đế (0, 0, 0). Trục quay của `Group_KnifeLever` đặt tại tâm chốt bản lề.

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Đế phíp Bakelite** | `MeshStandardMaterial` | `color: #451a03, roughness: 0.5, metalness: 0.05` | Nhựa bakelite cổ điển màu cam nâu đánh bóng |
| **Lưỡi và ngàm đồng** | `MeshStandardMaterial` | `color: #eab308, roughness: 0.25, metalness: 0.9` | Đồng thau vàng bóng |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
