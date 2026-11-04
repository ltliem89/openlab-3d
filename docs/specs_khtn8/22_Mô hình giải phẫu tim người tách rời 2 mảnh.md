# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 22: MÔ HÌNH GIẢI PHẪU TIM NGƯỜI TÁCH RỜI 2 MẢNH
**Mã định danh hệ thống (Asset ID)**: `human-heart-model` | **Mã số Catalog**: `OL3D-EQP-BIO-0001`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-SINH-01`  
**Tên tiếng Anh**: *Life-Size Anatomical Human Heart Model 2-Part*  
**Phân môn**: Sinh học - Cơ thể người & Giải phẫu | **Bài học SGK KHTN 8**: Bài: Hệ tuần hoàn ở người, Cấu tạo tim và mạch máu (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Mô phỏng chân thực giải phẫu cấu trúc tim người tỷ lệ 1:1, mặt trước có thể tách rời làm 2 nửa ghép nam châm từ tính để khảo sát 4 ngăn tim (tâm nhĩ, tâm thất), các van tim và các cuống mạch máu lớn.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Tim hoạt động như một chiếc máy bơm hút đẩy tự động trong hệ tuần hoàn kép: Tâm nhĩ phải nhận máu nghèo oxy từ tĩnh mạch chủ $\rightarrow$ qua van ba lá xuống tâm thất phải $\rightarrow$ bơm lên phổi qua van động mạch phổi. Tâm nhĩ trái nhận máu giàu oxy từ tĩnh mạch phổi $\rightarrow$ qua van hai lá xuống tâm thất trái $\rightarrow$ co bóp mạnh bơm vào động mạch chủ nuôi toàn cơ thể.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Chu kỳ hoạt động của tim người lúc nghỉ ngơi ($T_{\text{chu kỳ}} = 0.8\text{ s}$ tương đương $75\text{ nhịp/phút}$):
1. Pha co tâm nhĩ: $t_1 = 0.1\text{ s}$
2. Pha co tâm thất: $t_2 = 0.3\text{ s}$
3. Pha giãn chung: $t_3 = 0.4\text{ s}$
Áp lực tâm thất trái sinh ra lớn gấp 4-5 lần tâm thất phải:
$$p_{\text{thất trái}} \approx 120\text{ mmHg} \gg p_{\text{thất phải}} \approx 25\text{ mmHg}$$
(Do đó thành cơ tim tâm thất trái dày gấp 3 lần thành tâm thất phải: $d_{\text{trái}} \approx 12 - 15\text{ mm}$ so với $d_{\text{phải}} \approx 3 - 5\text{ mm}$).

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Khối mô hình tim (Tỷ lệ 1:1)** | Dài 120 x Rộng 110 x Cao 140 mm | `0.120 x 0.110 x 0.140 m` | Thể hiện kích thước tim người trưởng thành |
| **Đế tròn trưng bày** | phi 120 x Cao 18 mm | `phi 0.120 x 0.018 m` | Đế đứng vững chắc trên bàn |
| **Trục đỡ kim loại nghiêng** | phi 6 x Cao 90 mm, nghiêng 15 độ | `phi 0.006 x 0.090 m` | Định vị tư thế tim tự nhiên trong lồng ngực |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Độ dày thành cơ tim Thất trái / Thất phải** | `T_{\text{LV}} / T_{\text{RV}}` | **14 mm / 4.5 mm = 3.11** | Trực quan hóa sự khác biệt công năng áp lực bơm |
| **Tâm nhĩ / Tâm thất** | `V_{\text{nhĩ}} / V_{\text{thất}}` | **Cân đối thể tích 70 mL mỗi nhịp bơm** | Chuẩn giải phẫu y học |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Khớp ghép nam châm 2 nửa tim** | phi 5.0 mm nam châm Neodymium | `Lực hút 8.0 N` | Hút khớp khít tự động định vị |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `StandPinSeat`**: Tọa độ cục bộ `(0, -0.050, 0)` | Loại cổng: `anatomical_stand_socket` | Hướng pháp tuyến: `-Y` | Tương thích ghép nối: `HeartStand.Pin`
- **Cổng `FrontHalfMagneticSnap`**: Tọa độ cục bộ `(0, 0, 0.020)` | Loại cổng: `magnetic_anatomy_split` | Hướng pháp tuyến: `+Z` | Tương thích ghép nối: `HeartFrontHalf.Back`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Mặt trước của tim có thể tách rời ra xa dọc trục Z (1 DOF tịnh tiến tách mở). Toàn bộ khối tim xoay $360^\circ$ quanh trục đỡ.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Nhấp click vào nửa trước của tim để tách mở quan sát 4 ngăn bên trong.
2. Xoay mô hình tim 360 độ ngắm các cuống mạch máu lớn.
3. Nhấp vào các cấu trúc giải phẫu để hiển thị bảng nhãn chú thích thông tin.

### 3.4. Vùng va chạm & Hitbox Raycasting
Bounding Sphere phi 0.130 m bao quanh khối tim.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `isSplitOpen` | `boolean` | `true / false` | `false` | Trạng thái tách rời 2 mảnh |
| `selectedPart` | `string | null` | `ID string` | `null` | Cấu trúc đang được chọn xem thông tin |
| `isBeatingAnimated` | `boolean` | `true / false` | `false` | Bật/tắt hoạt ảnh co bóp mô phỏng nhịp tim |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Khi nhấp chuột: Kích hoạt Tween tịnh tiến nửa trước sang bên phải $80\text{ mm}$ và xoay hé mở $30^\circ$ để lộ toàn bộ vách tim, van hai lá, van ba lá và dây chằng tim (chordae tendineae).

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Màu sắc mô học y khoa chuẩn: Động mạch đỏ tươi (`#ef4444`), Tĩnh mạch xanh lam (`#1d4ed8`), Cơ tim hồng đỏ sẫm (`#be123c`), Mô mỡ vàng nhạt (`#fef08a`).

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Âm thanh tiếng tim đập 'bùm... tặc' (Lub-Dub) chân thực theo chu kỳ $0.8\text{ s}$.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Mô hình giảng dạy mô phỏng hình thái.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Nhầm lẫn giữa vị trí tâm thất trái và tâm thất phải** | Hiểu sai chiều tuần hoàn máu đỏ tươi và đỏ thẫm | Ghi nhớ: Thành tâm thất trái luôn dày hơn nhiều so với tâm thất phải! |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
HumanHeart_Root (Group)
  ├── Mesh_DisplayBase (Đế tròn nhựa ABS đen)
  ├── Mesh_SupportRod (Thanh trụ kim loại đỡ nghiêng)
  ├── Group_HeartBackHalf (Nửa sau tim gắn cố định trên trục)
  │     ├── Thất trái, nhĩ trái, tĩnh mạch chủ, động mạch chủ
  │     └── Hệ thống van tim và dây chằng
  └── Group_HeartFrontHalf (Nửa trước tim tách mở tháo rời)
        └── Nam châm ngầm định vị
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ tâm trọng tâm quả tim (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Cơ tim** | `MeshStandardMaterial` | `color: #be123c, roughness: 0.45, metalness: 0.05` | Bề mặt mô cơ tim dẻo mềm |
| **Động mạch** | `MeshStandardMaterial` | `color: #ef4444, roughness: 0.3, metalness: 0.1` | Ống cao su đỏ tươi chứa máu giàu oxy |
| **Tĩnh mạch** | `MeshStandardMaterial` | `color: #1d4ed8, roughness: 0.3, metalness: 0.1` | Ống cao su xanh dương chứa máu nghèo oxy |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
