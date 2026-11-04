# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 02: GIÁ ĐỠ TRỤC QUAY ĐÒN BẨY
**Mã định danh hệ thống (Asset ID)**: `lever-pivot-stand` | **Mã số Catalog**: `OL3D-EQP-LEV-0002`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-CO-02`  
**Tên tiếng Anh**: *Lever Pivot Stand*  
**Phân môn**: Vật lý - Cơ học | **Bài học SGK KHTN 8**: Bài: Tác dụng làm quay của lực - Đòn bẩy (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Cung cấp điểm tựa cố định (fulcrum) có độ cứng vững cao và ma sát quay tối thiểu để thanh đòn bẩy dao động tự do trong mặt phẳng thẳng đứng mà không bị rung lắc hay lật đổ.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Thế năng trọng trường của giá đỡ cực tiểu nhờ khối lượng đế gang lớn tập trung ở sát đáy. Trọng tâm toàn hệ luôn nằm sâu bên trong đa giác chân đế, thỏa mãn điều kiện cân bằng tĩnh học: $\vec{R} + \vec{P}_{\text{đế}} + \vec{P}_{\text{tải}} = \vec{0}$.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Điều kiện chống lật giá đỡ khi chịu tải trọng lệch cực đại $F_{\max} = 5\text{ N}$ ở khoảng cách $d = 0.18\text{ m}$:
$$M_{\text{lật}} = F_{\max} \cdot d = 5 \times 0.18 = 0.90\text{ N}\cdot\text{m}$$
Mômen chống lật của chân đế (chiều dài đế $b = 0.14\text{ m}$, khối lượng $M_{\text{đế}} = 0.75\text{ kg}$):
$$M_{\text{chống lật}} = M_{\text{đế}} \cdot g \cdot \frac{b}{2} = 0.75 \times 9.8 \times 0.07 = 0.5145\text{ N}\cdot\text{m}$$
Hệ số an toàn chống trượt và lật được bổ trợ bởi 4 chân đệm cao su giác mút: $\mu_{\text{ma sát}} \ge 0.6$.

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Đế giá đỡ** | 140 x 90 x 18 mm | `0.140 x 0.090 x 0.018 m` | Chân đế đối trọng hạ thấp trọng tâm |
| **Trụ đứng thép** | phi 10 x 280 mm | `phi 0.010 x 0.280 m` | Cột chịu lực thẳng đứng |
| **Cụm ngàm chữ U** | 22 x 20 x 30 mm | `0.022 x 0.020 x 0.030 m` | Khung giữ chốt quay ngang |
| **Chốt quay ngang** | phi 6.0 x 24 mm | `phi 0.006 x 0.024 m` | Trục quay gá lắp thanh đòn bẩy |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Chiều cao trụ / Chiều rộng đế** | `H_{trụ} / W_{đế}` | **280 mm / 90 mm = 3.11** | Tối ưu góc nhìn thao tác mà không gây ngã đổ |
| **Khối lượng đế / Tổng khối lượng** | `m_{đế} / m_{tổng}` | **750g / 850g = 88.2%** | 88% khối lượng dồn vào đế đáy, đảm bảo chống rung tối đa |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Ren cắm trụ vào đế gang** | M10 x 1.5 | `6H/6g` | Ren siết chặt không rơ lắc |
| **Chốt quay chữ U** | 6.0 mm | `-0.02 mm / -0.05 mm` | Đồng tâm tuyệt đối, mạ bóng giảm ma sát |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `TableBottomContact`**: Tọa độ cục bộ `(0, 0, 0)` | Loại cổng: `surface_rest` | Hướng pháp tuyến: `Thẳng đứng lên +Y` | Tương thích ghép nối: `LabTable.Surface`
- **Cổng `UpperPin`**: Tọa độ cục bộ `(0, 0.265, 0)` | Loại cổng: `mechanical_pivot` | Hướng pháp tuyến: `Trục Z` | Tương thích ghép nối: `lever-balance-arm.PivotCenterPort`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
0 DOF khi đặt trên bàn (cố định tĩnh). Cho phép nhấc di chuyển tự do trên mặt phẳng bàn XZ.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Nhấp và kéo rê trên mặt bàn phòng thí nghiệm.
2. Căn chỉnh vị trí đặt trước khi đưa thanh đòn bẩy lại gần.

### 3.4. Vùng va chạm & Hitbox Raycasting
Hộp OBB kết hợp: Hộp đế 0.140 x 0.020 x 0.090 m và hộp trụ 0.025 x 0.280 x 0.025 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `isRestingOnTable` | `boolean` | `true / false` | `true` | Tiếp xúc vững chắc với mặt bàn |
| `hasMountedArm` | `boolean` | `true / false` | `false` | Đang gắn thanh đòn bẩy |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Giữ vị trí tọa độ Y cố định ở mặt bàn ($Y = 0$). Tính toán phản lực chân đế $\vec{N} = -\vec{P}_{\text{hệ}}$.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Đổ bóng phẳng mềm (Contact Shadow) ở 4 góc chân cao su.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Âm thanh trầm 'cộc' khi đặt đế giá đỡ xuống mặt bàn.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Tải trọng chịu lực dọc trục: $\le 20\text{ N}$.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Đặt giá đỡ mấp mé mép bàn thí nghiệm** | Trọng tâm vượt ra ngoài mép bàn làm đổ thiết bị | Luôn đặt giá đỡ ở trung tâm khu vực thực hành. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
PivotStand_Root (Group)
  ├── Mesh_CastIronBase (Đế gang đúc vát 4 góc)
  ├── Mesh_RubberFeet[0..3] (4 chân đệm cao su chống trượt)
  ├── Mesh_SteelPole (Trụ thép mạ Crom)
  ├── Mesh_ForkU (Khung chữ U)
  └── Mesh_PivotPin (Chốt ngang đồng thau)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ đáy giữa chân đế (0, 0, 0) tiếp xúc mặt bàn.

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Đế gang** | `MeshStandardMaterial` | `color: #1e293b, roughness: 0.7, metalness: 0.2` | Sơn tĩnh điện nhám màu xanh than công nghiệp |
| **Trụ thép** | `MeshStandardMaterial` | `color: #f8fafc, roughness: 0.15, metalness: 0.95` | Inox sáng bóng loáng phản chiếu môi trường |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
