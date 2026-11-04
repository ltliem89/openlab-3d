# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 06: BÌNH THÔNG NHAU 3 NHÁNH DỊ HÌNH
**Mã định danh hệ thống (Asset ID)**: `communicating-vessels-3branch` | **Mã số Catalog**: `OL3D-EQP-HYD-0003`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-CO-06`  
**Tên tiếng Anh**: *Communicating Vessels 3-Shape Branch*  
**Phân môn**: Vật lý - Áp suất chất lỏng | **Bài học SGK KHTN 8**: Bài: Bình thông nhau (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Minh chứng định luật cơ bản của bình thông nhau: Với cùng một chất lỏng đứng yên, mặt thoáng ở các nhánh có hình dạng và kích thước hoàn toàn khác nhau luôn luôn dừng lại ở cùng một độ cao nằm ngang.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Áp suất tại đáy mỗi nhánh là $p = p_0 + \rho \cdot g \cdot h$. Vì đáy các nhánh thông với nhau và chất lỏng đứng yên, áp suất tại đáy phải bằng nhau: $p_1 = p_2 = p_3 \implies h_1 = h_2 = h_3$.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Điều kiện cân bằng tĩnh học:
$$p_A = p_B = p_C \iff p_0 + d \cdot h_1 = p_0 + d \cdot h_2 = p_0 + d \cdot h_3 \implies h_1 = h_2 = h_3$$
Khi nghiêng toàn bộ bình một góc $\alpha$ so với phương ngang:
Mặt thoáng chất lỏng ở cả 3 nhánh tự xoay để duy trì véctơ pháp tuyến mặt thoáng luôn song song với trọng lực:
$$\vec{n}_{\text{mặt thoáng}} = (0, 1, 0) \quad \forall \alpha$$

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Kích thước bao ngoài** | 160 x 50 x 180 mm | `0.160 x 0.050 x 0.180 m` | Khung bình thông nhau |
| **Ống đáy nằm ngang** | phi ngoài 14 mm, dài 150 mm | `phi 0.014 x 0.150 m` | Ống dẫn thông 3 nhánh |
| **Nhánh 1 (Hình trụ thẳng)** | phi 12 x 160 mm | `phi 0.012 x 0.160 m` | Nhánh đối chứng hình học chuẩn |
| **Nhánh 2 (Uốn lượn sóng sin)** | phi 10 mm, biên độ sóng 15 mm, 2 chu kỳ | `phi 0.010 x 0.160 m` | Minh chứng hình dạng uốn éo không ảnh hưởng |
| **Nhánh 3 (Phình quả trám)** | Đoạn phình phi 30 mm, cổ thắt phi 12 mm | `phi 0.030 x 0.160 m` | Minh chứng tiết diện phình to không ảnh hưởng |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Khoảng cách giữa các nhánh** | `D_{nhánh}` | **45 mm (đối xứng qua tâm)** | Bố cục cân đối, góc nhìn không bị che khuất |
| **Đường kính nhánh phình / nhánh thẳng** | `\varnothing_3 / \varnothing_1` | **30 mm / 12 mm = 2.5** | Độ chênh lệch tiết diện 6.25 lần làm nổi bật tính chất khoa học |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Mối hàn thủy tinh ngã ba đáy** | phi 14 mm | `+/- 0.2 mm` | Liền khối thổi thủ công, không thắt hẹp dòng |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `TableStandRest`**: Tọa độ cục bộ `(0, 0, 0)` | Loại cổng: `surface_rest` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `LabTable.Surface`
- **Cổng `BranchTopInlet[1..3]`**: Tọa độ cục bộ `(x_i, 0.170, 0)` | Loại cổng: `fluid_inlet` | Hướng pháp tuyến: `-Y` | Tương thích ghép nối: `beaker-250.Spout`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Đặt trên bàn hoặc cầm tay nhấc lên nghiêng góc $\pm 30^\circ$ quanh trục Z.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Rót nước có màu vào bất kỳ 1 trong 3 nhánh.
2. Quan sát cả 3 cột nước đồng thời dâng lên cùng mặt phẳng nằm ngang.
3. Nhấc nghiêng bình để xem mặt thoáng tự cân bằng.

### 3.4. Vùng va chạm & Hitbox Raycasting
Hộp OBB bao quanh toàn bộ khung bình 0.165 x 0.185 x 0.055 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `totalWaterVolumeMl` | `number` | `[0, 150]` | `0.0` | Tổng thể tích nước đã rót vào (ml) |
| `surfaceHeightMm` | `number` | `[0, 140]` | `0.0` | Chiều cao mực nước tính từ đáy ống (mm) |
| `tiltAngleDeg` | `number` | `[-30, 30]` | `0.0` | Góc nghiêng của bình (độ) |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Thể tích rót $V$ được phân bổ tích phân theo tiết diện $S_i(y)$ của 3 nhánh: $$V = \int_0^H (S_1(y) + S_2(y) + S_3(y) + S_{\text{đáy}}) dy$$. Tìm nghiệm $H$ bằng phương pháp Newton-Raphson, gán mặt thoáng đồng mức $H$ cho cả 3 nhánh.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Mặt nước phẳng lặng phản chiếu ánh sáng môi trường; các tia bọt khí nhỏ nổi lên khi đang rót.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng nước chảy vào bình thủy tinh róc rách trong trẻo.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Dung tích tối đa: $150\text{ mL}$ (nước dâng cách miệng $20\text{ mm}$ tránh tràn).

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Rót quá 160ml nước vào bình** | Nước tràn qua miệng nhánh 1 và nhánh 2 ra mặt bàn | Dừng rót khi mực nước cách miệng ống 2cm. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
CommunicatingVessels_Root (Group)
  ├── Mesh_BasePlinth (Đế nhựa đỡ khung ống)
  ├── Mesh_GlassManifold (Khối thủy tinh 3 nhánh liền khối)
  └── Mesh_LiquidVolume (Khối chất lỏng có shader mặt cắt ngang theo thế năng)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ đáy đế đỡ giữa bình (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Thủy tinh bình** | `MeshPhysicalMaterial` | `transmission: 0.97, roughness: 0.03, ior: 1.52` | Thủy tinh phòng thí nghiệm cao cấp |
| **Dung dịch nước màu** | `MeshPhysicalMaterial` | `transmission: 0.88, color: #0284c7, roughness: 0.05, ior: 1.333` | Nước pha màu xanh coban tương phản cao |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
