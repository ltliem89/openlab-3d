# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 17: ỐNG HÚT NHỎ GIỌT (PIPET PASTEUR) KÈM BÚP CAO SU
**Mã định danh hệ thống (Asset ID)**: `dropper-pipette` | **Mã số Catalog**: `OL3D-EQP-CHE-0003`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-HOA-03`  
**Tên tiếng Anh**: *Pasteur Dropper Pipette with Rubber Teat*  
**Phân môn**: Hóa học - Thao tác định lượng dung dịch | **Bài học SGK KHTN 8**: Bài: Dung dịch, Nồng độ, Phản ứng Acid - Base, Thử quỳ tím (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Hút và định lượng từng giọt dung dịch hóa chất chuẩn xác ($1\text{ giọt} \approx 0.04 - 0.05\text{ mL}$), chuyển dung dịch an toàn vào ống nghiệm hoặc khay thử giọt sứ.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Nguyên lý áp suất chênh lệch: Khi bóp búp cao su, một lượng không khí bị đẩy ra ngoài. Nhúng đầu nhọn vào chất lỏng rồi nhả tay, thể tích khí trong búp giãn nở làm áp suất trong ống giảm thấp hơn áp suất khí quyển: $p_{\text{ống}} < p_0$. Áp suất khí quyển ép chất lỏng dâng lên trong ống mao quản.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Điều kiện cân bằng cột chất lỏng trong ống hút:
$$p_0 = p_{\text{khí trong}} + \rho \cdot g \cdot h_{\text{cột lỏng}}$$
Thể tích một giọt rơi tự do phụ thuộc vào sức căng bề mặt $\sigma$ và bán kính đầu mút $r$:
$$m_{\text{giọt}} \cdot g = 2\pi \cdot r \cdot \sigma \implies V_{\text{giọt}} = \frac{2\pi \cdot r \cdot \sigma}{\rho \cdot g}$$
Với nước ở $25^\circ\text{C}$ và $r = 1.0\text{ mm}$:
$$V_{\text{giọt}} \approx 0.046\text{ mL} \implies 20 - 22\text{ giọt} \approx 1.0\text{ mL}$$

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Ống mao quản thủy tinh** | Dài 160 mm, thân phi 7 mm | `phi 0.007 x 0.160 m` | Thân ống chứa dung dịch hút |
| **Đầu mút vuốt nhọn nhỏ giọt** | phi 2.0 mm, dài vuốt 25 mm, lỗ thoát phi 1.0 mm | `phi 0.002 x 0.025 m` | Tạo giọt hóa chất chuẩn kích thước |
| **Búp cao su đàn hồi màu đỏ** | phi 16 x Cao 35 mm | `phi 0.016 x 0.035 m` | Bơm nén khí tạo áp suất âm |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Chiều dài đầu nhọn / Chiều dài ống** | `L_{\text{nhọn}} / L_{\text{ống}}` | **25 mm / 160 mm = 15.6%** | Dễ luồn vào các lọ hóa chất miệng hẹp |
| **Dung tích búp cao su / Dung tích ống** | `V_{\text{búp}} / V_{\text{ống}}` | **3.0 mL / 2.0 mL = 1.5** | Đủ sức hút đầy cột chất lỏng 1.5 - 2 mL |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Miệng búp cao su kẹp vành kính** | phi 7.0 mm | `-1.0 mm (cao su ôm chặt)` | Kín khí áp suất âm |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `SuctionTip`**: Tọa độ cục bộ `(0, -0.090, 0)` | Loại cổng: `dropper_tip` | Hướng pháp tuyến: `-Y` | Tương thích ghép nối: `ReagentBottle.Neck, test-tube-with-clamp.MouthInlet`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Cầm tay tự do 6 DOF.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Bóp búp cao su trước khi nhúng vào lọ thuốc thử.
2. Nhúng đầu mút vào dung dịch rồi nhả tay để hút hóa chất lên.
3. Đưa ống nghiệm và bóp nhẹ từng lần để nhả từng giọt chính xác.

### 3.4. Vùng va chạm & Hitbox Raycasting
Capsule thon phi 0.018 x 0.195 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `isTeatSqueezed` | `boolean` | `true / false` | `false` | Búp cao su đang bị bóp xẹp |
| `heldLiquidVolumeMl` | `number` | `[0, 2.0]` | `0.0` | Thể tích chất lỏng đang giữ trong ống (ml) |
| `dropsDispensedCount` | `number` | `0 .. 50` | `0` | Số giọt đã nhỏ vào ống nghiệm |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Khi nhấp chuột: Kích hoạt morphTarget nén búp cao su. Nếu `heldLiquidVolumeMl > 0`: Sinh ra 1 hạt chất lỏng hình giọt (Droplet Mesh) rơi tự do chịu gia tốc trọng trường $g = 9.8\text{ m/s}^2$ xuống ống nghiệm.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
• Búp cao su bẹp lại đàn hồi chân thực.
• Giọt chất lỏng treo ở đầu mút phình to dần rồi đứt giọt rơi xuống.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng 'tong... tong' trong trẻo khi từng giọt dung dịch rơi xuống đáy chất lỏng trong ống nghiệm.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Không dùng để hút axit đặc bốc khói hoặc dung môi hòa tan cao su.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Cầm chúc ngược đầu búp cao su xuống dưới khi đang có dung dịch** | Hóa chất chảy ngược vào trong búp cao su ăn mòn thủng búp và làm bẩn hóa chất | Tuyệt đối luôn giữ đầu mút ống nhỏ giọt hướng chúc xuống dưới! |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
DropperPipette_Root (Group)
  ├── Mesh_GlassStem (Thân ống thủy tinh thon nhọn)
  ├── Mesh_LiquidInside (Cột chất lỏng bên trong)
  └── Mesh_RubberTeat (Búp cao su màu đỏ có morphTarget bóp xẹp)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ tâm búp cầm tay (0, 0.050, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Thân thủy tinh** | `MeshPhysicalMaterial` | `transmission: 0.98, roughness: 0.02, ior: 1.5` | Thủy tinh trong vắt |
| **Búp cao su** | `MeshStandardMaterial` | `color: #ef4444, roughness: 0.55, metalness: 0.05` | Cao su lưu hóa màu đỏ tươi đàn hồi |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
