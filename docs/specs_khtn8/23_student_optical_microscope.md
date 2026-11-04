# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 23: KÍNH HIỂN VI QUANG HỌC HỌC SINH 3 VẬT KÍNH
**Mã định danh hệ thống (Asset ID)**: `student-optical-microscope` | **Mã số Catalog**: `OL3D-EQP-BIO-0002`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-SINH-02`  
**Tên tiếng Anh**: *Student Monocular Optical Biological Microscope*  
**Phân môn**: Sinh học - Quan sát vi mô & Tế bào | **Bài học SGK KHTN 8**: Bài: Quan sát tế bào biểu bì, Máu và thành phần tế bào máu (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Thiết bị quang học phóng đại từ $40\times$ đến $400\times$ phục vụ quan sát trực quan tế bào thực vật (vảy hành tây), tế bào máu động vật, cấu trúc vi khuẩn và sinh vật đơn bào trong giọt nước ao.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Hệ thống phóng đại 2 cấp bằng thấu kính: Vật kính (Objective) tạo một ảnh thật phóng đại trung gian ngược chiều trong thân ống kính; Thị kính (Eyepiece) đóng vai trò như kính lúp phóng đại tiếp ảnh thật đó thành ảnh ảo cùng chiều rất lớn trước mắt người quan sát.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Độ phóng đại tổng thể của kính hiển vi:
$$K_{\text{tổng}} = K_{\text{thị kính}} \times K_{\text{vật kính}}$$
Với thị kính chuẩn $10\times$ và mâm 3 vật kính xoay:
1. Vật kính $4\times$: $K_1 = 10 \times 4 = 40\times$ (Tìm mẫu thô, trường quan sát rộng)
2. Vật kính $10\times$: $K_2 = 10 \times 10 = 100\times$ (Quan sát mô tế bào trung bình)
3. Vật kính $40\times$: $K_3 = 10 \times 40 = 400\times$ (Quan sát chi tiết nhân và màng tế bào)
Công thức liên hệ quang học thấu kính:
$$\frac{1}{f} = \frac{1}{d} + \frac{1}{d'}, \quad K = \frac{d'}{d} = \frac{\delta \cdot D}{f_{\text{vật}} \cdot f_{\text{thị}}}$$
(Khoảng cách làm việc của vật kính $40\times$ cực ngắn: $d \approx 0.5 - 1.0\text{ mm}$).

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Khung thân kính hiển vi** | Cao tổng 310 mm, thân cong chữ C đúc | `0.130 x 0.170 x 0.310 m` | Khung hợp kim chịu lực quang học |
| **Đế đúc hình móng ngựa** | 130 x 170 x 35 mm | `0.130 x 0.170 x 0.035 m` | Đế vững chống rung lắc khi lấy nét |
| **Bàn sa trượt phẳng** | 110 x 120 mm, có lỗ tụ sáng phi 15 mm | `0.110 x 0.120 m` | Đặt lam kính tiêu bản và 2 kẹp lá thép |
| **Mâm xoay 3 vật kính** | phi 55 mm, 3 ống kính mạ Crom | `phi 0.055 m` | Xoay chuyển đổi 4x, 10x, 40x |
| **Ống thị kính nghiêng 45 độ** | phi 25 x Dài 130 mm | `phi 0.025 x 0.130 m` | Ống ngắm công thái học góc nhìn 45 độ |
| **Cụm ốc đại cấp & vi cấp** | Ốc đại phi 35 mm, ốc vi phi 22 mm đồng trục | `phi 0.035 m` | Nâng hạ bàn sa trượt lấy nét tiêu cự |
| **Gương phản chiếu 2 mặt** | phi 45 mm (mặt phẳng và mặt lõm) | `phi 0.045 m` | Hứng ánh sáng tự nhiên hội tụ vào mẫu |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Chiều cao kính / Chiều rộng đế** | `H / W_{\text{đế}}` | **310 mm / 130 mm = 2.38** | Tỷ lệ chuẩn công thái học phòng thí nghiệm trường học |
| **Bước dịch chuyển ốc vi cấp / ốc đại cấp** | `\Delta y_{\text{vi}} / \Delta y_{\text{đại}}` | **0.1 mm / 10 mm = 1 : 100** | Ốc vi cấp tinh chỉnh 100 lần mịn hơn, không làm vỡ lam kính |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Khớp xoay mâm vật kính** | 3 vị trí snap bi | `+/- 0.05 mm đồng trục` | Khớp bi click định tâm quang học |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `StageSlideClips`**: Tọa độ cục bộ `(0, 0.140, 0.020)` | Loại cổng: `microscope_slide_stage` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `GlassSlideSpecimen.Plate`
- **Cổng `EyepieceCameraPort`**: Tọa độ cục bộ `(0, 0.290, -0.040)` | Loại cổng: `optical_eyepiece_view` | Hướng pháp tuyến: `Nghiêng 45 độ` | Tương thích ghép nối: `VirtualMicroscopeCamera`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
1. Mâm vật kính: 1 DOF xoay bước $120^\circ$.
2. Bàn sa trượt: 1 DOF tịnh tiến lên xuống theo trục Y ($0 - 25\text{ mm}$).
3. Gương hứng sáng: 2 DOF xoay lật đa hướng.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Kẹp lam kính tiêu bản lên bàn sa trượt.
2. Xoay mâm chọn vật kính nhỏ ($4\times$) trước.
3. Vặn ốc đại cấp nâng hạ bàn kính tìm vùng mẫu.
4. Vặn ốc vi cấp lấy nét cực kỳ sắc nét.
5. Chuyển sang góc nhìn thị kính (Microscope Viewport UI).

### 3.4. Vùng va chạm & Hitbox Raycasting
Khối OBB kết hợp: 0.140 x 0.320 x 0.180 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `selectedMagnification` | `enum` | `'40x' | '100x' | '400x'` | `'40x'` | Độ phóng đại hiện tại |
| `focusOffsetMm` | `number` | `[-5.0, 5.0]` | `1.5` | Độ lệch tiêu cự (0 = nét hoàn hảo) |
| `lightIntensity` | `number` | `[0.0, 1.0]` | `0.8` | Cường độ ánh sáng gương hứng sáng |
| `hasSlideInstalled` | `boolean` | `true / false` | `false` | Đã kẹp lam kính tiêu bản chưa |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Xử lý độ mờ nét hình ảnh thị kính (Blur Shader Filter): `blurRadius` $= |focusOffsetMm| \times 20\text{ px}$. Khi xoay ốc vi cấp đưa `focusOffsetMm` về $0.0$, hình ảnh tế bào hiển thị siêu nét với các hạt nhân và lục lạp chi tiết.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
• Màn hình góc nhìn thị kính tròn vi mô (Circular Microscope Overlay HUD) phóng to mẫu vật.
• Tia sáng hội tụ từ gương phản chiếu xuyên qua lỗ bàn kính.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng 'tách' êm của khớp bi khi mâm xoay vật kính vào đúng vị trí đồng trục; tiếng xoay ren êm của ốc vi cấp.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Tránh để đầu thấu kính $40\times$ chạm đè làm vỡ lam kính.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Dùng ốc đại cấp vặn nhanh bàn kính lên khi đang ngắm vật kính 40x** | Đầu vật kính đâm thẳng vào lam kính làm nứt vỡ tiêu bản và xước thấu kính | Quy tắc an toàn: Với vật kính lớn 40x, chỉ được dùng ốc vi cấp để lấy nét! |
| **Bắt đầu quan sát ngay ở vật kính lớn 40x** | Trường nhìn quá hẹp và tối, không thể tìm thấy mẫu vật | Luôn luôn bắt đầu tìm mẫu vật từ vật kính nhỏ nhất (4x). |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
Microscope_Root (Group)
  ├── Mesh_HorseshoeBase (Đế móng ngựa đúc nặng)
  ├── Mesh_ArmFrame (Thân cong chữ C có tay xách)
  ├── Group_StageAssembly (Cụm bàn sa trượt nâng hạ Y)
  │     ├── Mesh_StagePlate (Bàn đặt tiêu bản sơn đen)
  │     ├── Mesh_SlideClips[0..1] (2 lá kẹp giữ tiêu bản)
  │     └── Mesh_CondenserDiaphragm (Đĩa chắn sáng đục lỗ)
  ├── Group_RevolvingNosepiece (Mâm xoay vật kính)
  │     ├── Mesh_Objective_4x (Vật kính 4x viền đỏ)
  │     ├── Mesh_Objective_10x (Vật kính 10x viền vàng)
  │     └── Mesh_Objective_40x (Vật kính 40x viền xanh lam)
  ├── Group_FocusKnobs (Cụm ốc đồng trục hai bên)
  │     ├── Mesh_CoarseKnob (Ốc đại cấp to)
  │     └── Mesh_FineKnob (Ốc vi cấp nhỏ)
  └── Mesh_IlluminationMirror (Gương lật hứng sáng 2 mặt)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ đáy đế móng ngựa (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Thân kính** | `MeshStandardMaterial` | `color: #f8fafc, roughness: 0.25, metalness: 0.1` | Hợp kim sơn tĩnh điện men trắng bóng cao cấp |
| **Vật kính & ốc xoay** | `MeshStandardMaterial` | `color: #e2e8f0, roughness: 0.1, metalness: 0.95` | Thép mạ Crom sáng bóng phản chiếu |
| **Bàn sa trượt** | `MeshStandardMaterial` | `color: #0f172a, roughness: 0.8, metalness: 0.2` | Sơn đen mờ nhám chống lóa ánh sáng |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
