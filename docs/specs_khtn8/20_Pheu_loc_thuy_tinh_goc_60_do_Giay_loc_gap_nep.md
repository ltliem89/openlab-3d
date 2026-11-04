# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 20: PHỄU LỌC THỦY TINH GÓC 60 ĐỘ & GIẤY LỌC GẤP NẾP
**Mã định danh hệ thống (Asset ID)**: `filter-funnel-paper` | **Mã số Catalog**: `OL3D-EQP-CHE-0006`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-HOA-06`  
**Tên tiếng Anh**: *Glass Filter Funnel with Conical Filter Paper*  
**Phân môn**: Hóa học - Tách chất & Tinh chế | **Bài học SGK KHTN 8**: Bài: Tách chất ra khỏi hỗn hợp, Muối không tan, Tinh chế dung dịch (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Tách các chất rắn không tan (kết tủa) ra khỏi dung dịch lỏng bằng phương pháp lọc trọng lực cổ điển, thu nước lọc trong suốt vào bình hứng phía dưới.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Hỗn hợp huyền phù đi qua giấy lọc xốp xenluloza: Các lỗ xốp mao quản nhỏ ($5 - 10\,\mu\text{m}$) giữ lại toàn bộ hạt kết tủa rắn trên mặt giấy, chỉ cho phân tử dung môi và ion tan đi qua. Cuống phễu dài vát $45^\circ$ đặt áp sát thành trong cốc hứng để dòng chất lỏng chảy bám dính mượt mà không bị bắn tóe.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Định luật Darcy về dòng chảy qua màng xốp:
$$Q = \frac{dV}{dt} = \frac{K \cdot A \cdot \Delta p}{\mu \cdot L_{\text{màng}}}$$
trong đó $\Delta p = \rho \cdot g \cdot h_{\text{cột chất lỏng}}$ là áp suất thủy tĩnh của lượng chất lỏng chứa trong lòng phễu.
Góc nón phễu chuẩn:
$$\alpha_{\text{nón}} = 60^\circ \implies \text{Góc giấy lọc gấp tư: } 360^\circ / 4 = 90^\circ \rightarrow 60^\circ \text{ nón tròn khớp hoàn hảo}$$

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Miệng phễu nón** | phi 60 mm, góc mở nón 60 độ | `phi 0.060 x 0.052 m` | Hứng dung dịch và ôm trọn giấy lọc |
| **Cuống phễu hình ống** | phi ngoài 8 mm, phi trong 5 mm, dài 70 mm | `phi 0.008 x 0.070 m` | Dẫn dòng nước lọc chảy xuống cốc |
| **Đầu vát cuống phễu** | Vát xiên góc 45 độ sắc nét | `0.010 m` | Tạo dòng chảy bám theo thành cốc |
| **Giấy lọc gấp nón tròn** | phi 110 mm gấp tư, mép xòe phi 58 mm | `phi 0.058 x 0.048 m` | Màng lọc xốp giữ kết tủa |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Chiều dài cuống / Chiều cao nón** | `L_{\text{cuống}} / H_{\text{nón}}` | **70 mm / 52 mm = 1.346** | Cuống thon dài tạo cột hút mao dẫn tăng tốc độ lọc |
| **Đường kính giấy lọc / Miệng phễu** | `\varnothing_{\text{giấy}} / \varnothing_{\text{miệng}}` | **110 mm / 60 mm = 1.83** | Mép giấy lọc thấp hơn miệng phễu 5mm theo chuẩn Lab |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Giấy lọc ôm lòng phễu** | Góc 60 độ | `+/- 0.5 độ` | Miết ướt nước dính sát không lọt bọt khí |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `SupportRingSnap`**: Tọa độ cục bộ `(0, 0.010, 0)` | Loại cổng: `ring_clamp_support` | Hướng pháp tuyến: `-Y` | Tương thích ghép nối: `UniversalClampRing.Port`
- **Cổng `BeakerWallContactTip`**: Tọa độ cục bộ `(0.003, -0.068, 0)` | Loại cổng: `spout_contact` | Hướng pháp tuyến: `+X` | Tương thích ghép nối: `beaker-250.InnerWall`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Gá trên giá sắt đỡ phễu hoặc cắm miệng bình tam giác.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Đặt giấy lọc vào lòng phễu và xịt nước làm ướt dính sát thành kính.
2. Đặt phễu lên vòng đỡ giá sắt, áp cuống phễu vào thành cốc hứng.
3. Dùng đũa thủy tinh dẫn dòng hỗn hợp rót từ từ vào phễu lọc.

### 3.4. Vùng va chạm & Hitbox Raycasting
Hình nón cụt kết hợp trụ phi 0.065 x cao 0.125 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `isPaperWet` | `boolean` | `true / false` | `false` | Giấy lọc đã thấm ướt ôm sát phễu |
| `liquidInsideFunnelMl` | `number` | `[0, 30]` | `0.0` | Thể tích chất lỏng đang chờ lọc trong phễu |
| `precipitateRetainedGrams` | `number` | `[0, 5.0]` | `0.0` | Khối lượng kết tủa giữ lại trên giấy |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Tốc độ lọc dòng nước: $$\frac{dV}{dt} = 0.05 \times \text{liquidInsideFunnelMl} \quad (\text{mL/s})$$. Từng giọt dịch lọc trong suốt nhỏ từ cuống phễu xuống cốc hứng; lượng kết tủa dày dần trên mặt giấy lọc.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Giấy lọc chuyển từ trắng đục sang trắng trong mờ khi thấm ướt; từng giọt nước lọc nhỏ xuống cốc hứng đều đặn.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng giọt nước chảy tí tách êm dịu bám thành cốc thủy tinh.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Không đổ hỗn hợp vượt quá mép trên của giấy lọc.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Dùng đũa thủy tinh chọc thủng đáy giấy lọc khi khuấy** | Toàn bộ cặn kết tủa chảy tuột xuống cốc hứng làm đục nước lọc | Không dùng đũa chọc vào đáy phễu; chỉ dùng đũa dẫn dòng chảy. |
| **Để cuống phễu lơ lửng giữa miệng cốc hứng** | Dung dịch nhỏ giọt rơi tự do bắn tóe ra bàn | Luôn đặt đầu vát cuống phễu áp sát vào thành trong cốc hứng. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
FilterFunnel_Root (Group)
  ├── Mesh_GlassFunnelBody (Thân phễu nón và cuống vát thủy tinh)
  ├── Mesh_ConicalFilterPaper (Giấy lọc nón 4 lớp ôm sát)
  └── Mesh_FiltrateDripDrops (Hạt giọt dung dịch rơi tuần hoàn)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ ranh giới giữa đáy nón và cuống phễu (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Phễu thủy tinh** | `MeshPhysicalMaterial` | `transmission: 0.97, roughness: 0.02, ior: 1.51` | Thủy tinh trong suốt chịu hóa chất |
| **Giấy lọc** | `MeshStandardMaterial` | `color: #fafafa, roughness: 0.85, metalness: 0.02` | Sợi xenluloza trắng ngà xốp mờ |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
