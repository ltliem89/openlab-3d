# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 16: BỘ ỐNG NGHIỆM THỦY TINH CHỊU NHIỆT & KẸP GỖ
**Mã định danh hệ thống (Asset ID)**: `test-tube-with-clamp` | **Mã số Catalog**: `OL3D-EQP-CHE-0002`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-HOA-02`  
**Tên tiếng Anh**: *Borosilicate Test Tube with Wooden Clamp*  
**Phân môn**: Hóa học - Dụng cụ phản ứng nhiệt | **Bài học SGK KHTN 8**: Bài: Phản ứng hóa học, Acid, Base, Muối, Đun nóng chất (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Dụng cụ chứa lượng nhỏ hóa chất ($2 - 5\text{ mL}$) để tiến hành phản ứng thử nghiệm, quan sát đổi màu và đun nóng trực tiếp trên ngọn lửa đèn cồn; kẹp gỗ bảo vệ an toàn cho tay khỏi nhiệt độ cao và hóa chất ăn mòn.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Thủy tinh Borosilicate 3.3 có hệ số giãn nở nhiệt cực thấp ($\alpha = 3.3 \times 10^{-6}\text{ K}^{-1}$), chịu được sốc nhiệt đột ngột lên tới $160^\circ\text{C}$ mà không nứt vỡ. Kẹp gỗ truyền nhiệt rất kém, má kẹp có lót đệm nỉ giữ ống mềm mại không làm vỡ thân ống.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Quy tắc hình học kẹp ống nghiệm an toàn:
$$y_{\text{kẹp}} = \frac{1}{3} L_{\text{ống}} \quad \text{tính từ miệng ống xuống} = \frac{160}{3} \approx 53.3\text{ mm}$$
Góc nghiêng chuẩn khi đun nóng chất lỏng trên ngọn lửa đèn cồn:
$$\theta_{\text{đun}} \approx 45^\circ$$
(Tăng diện tích mặt thoáng chất lỏng, ngăn hiện tượng sôi bùng bắn hóa chất ra ngoài; miệng ống hướng về phía không có người).
Thể tích chất lỏng chứa tối đa khi đun nóng:
$$V_{\text{chất lỏng đun}} \le \frac{1}{3} V_{\text{dung tích}} = \frac{25\text{ mL}}{3} \approx 8.3\text{ mL}$$

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Ống nghiệm Borosilicate** | phi 16 x Dài 160 mm, thành dày 1.2 mm | `phi 0.016 x 0.160 m` | Chứa hóa chất và chịu nhiệt trực tiếp |
| **Miệng loe vành ống** | phi ngoài 19 mm, gờ tròn 1.5 mm | `phi 0.019 m` | Tăng cứng miệng và chống mẻ |
| **Kẹp gỗ gắp ống nghiệm** | Dài 180 x Rộng 20 x Dày 15 mm | `0.180 x 0.020 x 0.015 m` | Tay cầm kẹp cách nhiệt an toàn |
| **Lò xo lá thép kẹp** | Dày 0.8 mm x Rộng 12 mm | `0.012 m` | Tạo lực kẹp ép chặt thân ống |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Chiều dài / Đường kính ống nghiệm** | `L / \varnothing` | **160 mm / 16 mm = 10.0** | Tỷ lệ chuẩn thon dài, dễ gia nhiệt từng phần |
| **Chiều dài kẹp / Chiều dài ống** | `L_{\text{kẹp}} / L_{\text{ống}}` | **180 mm / 160 mm = 1.125** | Khoảng cách cách ly an toàn từ bàn tay tới ngọn lửa |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Má kẹp gỗ - Thân ống nghiệm** | phi 16.0 mm | `Độ mở đàn hồi 14 - 22 mm` | Kẹp ma sát đàn hồi |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `MouthInlet`**: Tọa độ cục bộ `(0, 0.080, 0)` | Loại cổng: `fluid_inlet` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `dropper-pipette.Tip, chemical-spatula.Tip`
- **Cổng `ClampPosition`**: Tọa độ cục bộ `(0, 0.027, 0)` | Loại cổng: `clamp_attachment` | Hướng pháp tuyến: `Ngang` | Tương thích ghép nối: `WoodenClamp.Jaws`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Tự do 6 DOF khi cầm tay kẹp ống nghiệm.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Nhỏ giọt hóa chất vào ống nghiệm bằng pipet.
2. Kẹp ống nghiệm bằng kẹp gỗ.
3. Hơ nóng đều quanh thân ống rồi tập trung đáy trên ngọn lửa đèn cồn ở góc $45^\circ$.

### 3.4. Vùng va chạm & Hitbox Raycasting
Capsule hình trụ phi 0.020 x 0.165 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `liquidVolumeMl` | `number` | `[0, 25]` | `3.0` | Thể tích dung dịch trong ống (ml) |
| `liquidTemperatureC` | `number` | `[20, 100]` | `25.0` | Nhiệt độ chất lỏng (độ C) |
| `isClamped` | `boolean` | `true / false` | `true` | Đang được kẹp bằng kẹp gỗ |
| `isBoiling` | `boolean` | `true / false` | `false` | Trạng thái sôi sùng sục |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Khi đáy ống nằm trong vùng ngọn lửa đèn cồn: $$\frac{dT}{dt} = \frac{k \cdot (T_{\text{lửa}} - T)}{m c}$$. Khi $T \ge 100^\circ\text{C}$: Kích hoạt hạt bọt khí sôi (Boiling Bubble Particles) và hơi nước bốc lên từ miệng ống.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Dung dịch sủi bọt cuồn cuộn; thành thủy tinh phía trên đọng màng sương hơi nước mờ ảo.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng sôi ùng ục 'lục bục' của chất lỏng khi đun nóng.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Nhiệt độ tối đa liên tục: $500^\circ\text{C}$. Không sốc nhiệt nóng lạnh đột ngột vượt quá $\Delta T = 160^\circ\text{C}$.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Đun ống nghiệm chứa chất lỏng nhưng hướng thẳng miệng vào người đối diện** | Dung dịch sôi bùng bắn trực diện gây bỏng hóa chất | Quy tắc an toàn sống còn: Miệng ống nghiệm phải luôn hướng về phía không có người! |
| **Đun nóng tập trung 1 điểm ở đáy khi chất lỏng còn lạnh mà không hơ đều** | Giãn nở nhiệt cục bộ gây nứt vỡ đáy ống nghiệm | Phải hơ đều dọc đáy ống nghiệm trước khi đun tập trung. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
TestTubeAssembly_Root (Group)
  ├── Group_TestTube (Ống nghiệm thủy tinh)
  │     ├── Mesh_GlassBody (Thân thủy tinh borosilicate)
  │     └── Mesh_LiquidContents (Cột chất lỏng có shader meniscus)
  └── Group_WoodenClamp (Kẹp gỗ)
        ├── Mesh_UpperJaw (Thanh kẹp trên)
        ├── Mesh_LowerJaw (Thanh kẹp dưới)
        └── Mesh_SpringSteel (Lò xo thép đàn hồi)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ tâm miệng ống nghiệm (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Thân thủy tinh** | `MeshPhysicalMaterial` | `transmission: 0.98, roughness: 0.02, ior: 1.51` | Thủy tinh trong suốt bóng bẩy |
| **Kẹp gỗ** | `MeshStandardMaterial` | `color: #b45309, roughness: 0.75, metalness: 0.05` | Gỗ mộc sấy khô cách nhiệt |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
