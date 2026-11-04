# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 19: KIỀNG ĐUN SẮT 3 CHÂN & LƯỚI THÉP LÓT SỨ TẢN NHIỆT
**Mã định danh hệ thống (Asset ID)**: `tripod-burner-gauze` | **Mã số Catalog**: `OL3D-EQP-CHE-0005`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-HOA-05`  
**Tên tiếng Anh**: *Laboratory Tripod Stand with Ceramic Wire Gauze*  
**Phân môn**: Hóa học - Thiết bị gia nhiệt gián tiếp | **Bài học SGK KHTN 8**: Bài: Đun nóng dung dịch, Cô cạn dung dịch (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Nâng đỡ các dụng cụ thủy tinh (cốc đốt, bình tam giác) hoặc bát sứ phía trên ngọn lửa đèn cồn; lưới thép lót sứ phân tán đều nhiệt lượng, chống nứt vỡ do sốc nhiệt cục bộ.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Đĩa gốm chịu nhiệt ở tâm lưới thép hấp thụ nhiệt từ ngọn lửa đèn cồn và bức xạ nhiệt đều ra toàn bộ diện tích tiếp xúc với đáy dụng cụ, triệt tiêu các điểm quá nhiệt đột ngột (hot spots). Ba chân choãi $15^\circ$ đảm bảo độ ổn định tĩnh học tối đa.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Khoảng cách chuẩn từ đỉnh bấc đèn cồn tới mặt lưới sứ:
$$h_{\text{khoảng hở}} = H_{\text{kiềng}} - H_{\text{đèn cồn}} = 160 - 120 = 40\text{ mm}$$
(Đúng vị trí $2/3$ ngọn lửa nơi nhiệt độ đạt cực đại $700 - 800^\circ\text{C}$).
Độ dẫn nhiệt của lớp sứ tản nhiệt:
$$q = -k \cdot \nabla T = -k_{\text{gốm}} \cdot \frac{T_{\text{lưới}} - T_{\text{đáy}}}{t_{\text{sứ}}}$$
với $k_{\text{gốm}} \approx 1.5\text{ W/(m}\cdot\text{K)}$ giúp dòng nhiệt truyền dịu êm vào đáy thủy tinh.

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Vòng kiềng tròn bằng sắt** | phi 100 mm, thanh sắt phi 6 mm | `phi 0.100 x 0.006 m` | Vòng đỡ mặt lưới phẳng |
| **3 chân kiềng thép choãi** | phi 8 x Cao 160 mm, góc choãi 15 độ | `phi 0.008 x 0.160 m` | Chân đứng chịu lực chống rung |
| **Tấm lưới thép đan ô caro** | 120 x 120 x 1.5 mm | `0.120 x 0.120 x 0.0015 m` | Lưới thép chịu nhiệt |
| **Đĩa sứ chịu nhiệt tròn tâm** | phi 70 x dày 2.5 mm | `phi 0.070 x 0.0025 m` | Tản nhiệt đều chống sốc nứt đáy cốc |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Đường kính vòng kiềng / Chiều cao** | `\varnothing_{\text{vòng}} / H` | **100 mm / 160 mm = 0.625** | Dáng đứng thanh thoát, đặt lọt đèn cồn bên dưới |
| **Đường kính đĩa sứ / Kích thước lưới** | `\varnothing_{\text{sứ}} / L_{\text{lưới}}` | **70 mm / 120 mm = 58.3%** | Bao trọn đáy các loại cốc 100ml, 250ml và bát sứ |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Mối hàn 3 chân vào vòng kiềng** | Hàn ngấu liên tục | `Chịu tải uốn > 100 N` | Hàn cứng vững công nghiệp |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `TopGauzeRest`**: Tọa độ cục bộ `(0, 0.160, 0)` | Loại cổng: `surface_rest_gauze` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `CeramicWireGauze.Base`
- **Cổng `UnderBurnerSlot`**: Tọa độ cục bộ `(0, 0, 0)` | Loại cổng: `burner_cavity` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `spirit-burner-150.Base`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Cố định tĩnh trên bàn phòng thí nghiệm.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Đặt kiềng đun trùm lên đèn cồn.
2. Đặt tấm lưới thép lót sứ lên vòng tròn kiềng sắt.
3. Đặt cốc thủy tinh hoặc bát cô cạn lên tâm đĩa sứ.

### 3.4. Vùng va chạm & Hitbox Raycasting
Hình trụ tròn đáy choãi phi 0.140 x cao 0.165 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `hasGauzeInstalled` | `boolean` | `true / false` | `true` | Đã đặt lưới thép lót sứ lên chưa |
| `surfaceTemperatureC` | `number` | `[25, 600]` | `25.0` | Nhiệt độ đĩa sứ khi đang đun |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Khi đèn cồn bên dưới đang cháy (`isLit = true`), truyền nhiệt dẫn suất lên đĩa sứ làm tăng `surfaceTemperatureC` lên $400 - 550^\circ\text{C}$. Vật thể đặt trên đĩa sứ sẽ nhận nhiệt lượng theo định luật Fourier.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Đĩa sứ ở trung tâm ửng đỏ nhẹ khi đun nóng ở nhiệt độ cao.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Âm thanh kim loại 'keng' khi đặt tấm lưới thép lên vòng sắt.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Tải trọng chịu lực: $\le 2.0\text{ kg}$ (đỡ cốc chứa $500\text{ mL}$ an toàn).

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Đặt cốc đun trực tiếp lên vòng kiềng sắt mà không có lưới thép lót sứ** | Cốc thủy tinh bị ngọn lửa chiếu tập trung điểm nứt vỡ đáy làm chảy hóa chất | Bắt buộc phải lót tấm lưới thép có tâm sứ khi đun cốc thủy tinh! |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
TripodStand_Root (Group)
  ├── Mesh_IronRing (Vòng kiềng sắt tròn)
  ├── Mesh_TripodLegs[0..2] (3 chân thép choãi 15 độ)
  └── Group_WireGauze (Tấm lưới thép tháo rời)
        ├── Mesh_MetalMeshSquare (Lưới thép đan ô)
        └── Mesh_CeramicDiscCenter (Đĩa gốm trắng chịu lửa tròn tâm)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ mặt bàn tâm 3 chân (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Kiềng sắt** | `MeshStandardMaterial` | `color: #27272a, roughness: 0.7, metalness: 0.4` | Thép sơn đen chịu nhiệt chống gỉ |
| **Lưới thép** | `MeshStandardMaterial` | `color: #94a3b8, roughness: 0.4, metalness: 0.9` | Sợi thép mạ bạc đan caro |
| **Đĩa sứ** | `MeshStandardMaterial` | `color: #f4f4f5, roughness: 0.9, metalness: 0.05` | Gốm chịu lửa sợi silicat trắng ngà |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
