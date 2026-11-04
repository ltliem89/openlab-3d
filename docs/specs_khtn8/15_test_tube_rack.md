# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 15: GIÁ ĐỂ ỐNG NGHIỆM 6 LỖ KÈM CỌC PHƠI
**Mã định danh hệ thống (Asset ID)**: `test-tube-rack` | **Mã số Catalog**: `OL3D-EQP-CHE-0001`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-HOA-01`  
**Tên tiếng Anh**: *Wooden / Plastic Test Tube Rack with Pins*  
**Phân môn**: Hóa học - Dụng cụ thí nghiệm cơ bản | **Bài học SGK KHTN 8**: Toàn bộ các bài thực hành Hóa học 8 (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Giữ các ống nghiệm đứng thẳng ổn định trong quá trình nhỏ thuốc thử, quan sát phản ứng đổi màu, kết tủa hoặc sủi bọt khí; hàng cọc phơi phía sau dùng để úp ngược ống nghiệm róc khô nước sau khi cọ rửa.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Kết cấu 2 tầng lỗ định vị đồng trục theo phương thẳng đứng giữ cho trọng tâm của ống nghiệm chứa chất lỏng luôn nằm trong phạm vi đế giá đỡ, triệt tiêu nguy cơ đổ vỡ hóa chất ăn mòn ra mặt bàn.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Khoảng cách an toàn giữa các tâm lỗ để tránh va chạm thành ống:
$$S_{\text{tâm}} = \varnothing_{\text{lỗ}} + d_{\text{vách}} = 20.0 + 10.0 = 30.0\text{ mm}$$
Góc nghiêng đổ vỡ tới hạn khi đặt 6 ống nghiệm đầy dung dịch:
$$\tan\theta_{\text{crit}} = \frac{W_{\text{đế}} / 2}{H_{\text{trọng tâm}}} = \frac{65 / 2}{55} \approx 0.59 \implies \theta_{\text{crit}} \approx 30.5^\circ$$

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Kích thước khung giá** | Dài 210 x Rộng 65 x Cao 90 mm | `0.210 x 0.065 x 0.090 m` | Khung gỗ 2 tầng đỡ ống nghiệm |
| **6 lỗ cắm ống tầng trên** | phi 20.0 mm, cách đều tâm 30 mm | `phi 0.020 m` | Cắm vừa ống nghiệm phi 16 - 18 mm |
| **6 lỗ đón đáy cầu tầng dưới** | Rãnh khoét cầu lõm R = 10 mm | `R 0.010 m` | Định vị đáy cầu ống nghiệm không xê dịch |
| **6 cọc phơi ống phía sau** | phi 8 x Cao 75 mm, tiện đầu côn | `phi 0.008 x 0.075 m` | Úp ngược ống nghiệm khô ráo |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Chiều cao tầng trên / Tổng chiều cao** | `H_{\text{tầng}} / H_{\text{tổng}}` | **65 mm / 90 mm = 72.2%** | Điểm tựa ở 40% chiều cao ống nghiệm 160mm |
| **Chiều dài cọc phơi / Chiều dài ống** | `H_{\text{cọc}} / H_{\text{ống}}` | **75 mm / 160 mm = 46.8%** | Đủ sâu để ống úp đứng vững không rơi |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Lỗ cắm - Thân ống nghiệm** | phi 20.0 mm / phi 16.0 mm | `+4.0 mm khe hở` | Lắp lỏng thao tác 1 tay nhanh |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `RackSlot_1..6`**: Tọa độ cục bộ `(-0.075 + 0.030 * k, 0.065, -0.012)` | Loại cổng: `test_tube_slot_upright` | Hướng pháp tuyến: `-Y` | Tương thích ghép nối: `test-tube-with-clamp.TubeBody`
- **Cổng `DryingPin_1..6`**: Tọa độ cục bộ `(-0.075 + 0.030 * k, 0.075, +0.015)` | Loại cổng: `test_tube_pin_inverted` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `test-tube-with-clamp.TubeMouth`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Đặt cố định trên bàn phòng thí nghiệm (0 DOF).

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Kéo ống nghiệm thả vào 1 trong 6 lỗ cắm đứng.
2. Kéo ống nghiệm đã rửa úp ngược vào cọc phơi.
3. Nhấc cả giá di chuyển trên bàn.

### 3.4. Vùng va chạm & Hitbox Raycasting
Khối OBB bao ngoài: 0.215 x 0.095 x 0.070 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `occupiedSlotsCount` | `number` | `0 .. 6` | `0` | Số ống nghiệm đang cắm thẳng |
| `occupiedPinsCount` | `number` | `0 .. 6` | `0` | Số ống nghiệm đang úp phơi |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Quản lý mảng `slots[6]` và `pins[6]`. Khi ống nghiệm được kéo thả vào gần vùng Snap ($d < 30\text{ mm}$), tự động gắn kết và chuyển trạng thái ống thành cố định thẳng đứng.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Hiệu ứng vòng tròn snap sáng mờ tại lỗ cắm khi cầm ống nghiệm lại gần.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng gõ nhẹ của đáy thủy tinh chạm vào rãnh gỗ 'cọc'.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Tải trọng: 6 ống nghiệm chứa đầy nước (tổng $\approx 300\text{ g}$).

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Úp ống nghiệm đang còn đầy hóa chất vào cọc phơi** | Hóa chất chảy tràn xuống chân cọc làm bẩn giá và bàn | Chỉ úp ống nghiệm sau khi đã đổ hóa chất và tráng rửa sạch. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
TestTubeRack_Root (Group)
  ├── Mesh_WoodBasePlate (Đế gỗ dưới có rãnh lõm)
  ├── Mesh_WoodTopPlate (Mặt gỗ trên có 6 lỗ khoét tròn)
  ├── Mesh_SideUprights[0..1] (2 cột hồi đỡ 2 đầu)
  └── Mesh_DryingPins[0..5] (6 cọc trụ tiện tròn phơi ống)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ đáy giá gỗ (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Khung gỗ sồi** | `MeshStandardMaterial` | `color: #d97706, roughness: 0.65, metalness: 0.05` | Gỗ tự nhiên phủ vecni chống thấm hóa chất nhẹ |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
