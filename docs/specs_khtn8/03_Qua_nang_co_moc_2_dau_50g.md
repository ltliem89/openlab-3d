# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 03: QUẢ NẶNG CÓ MÓC 2 ĐẦU 50G
**Mã định danh hệ thống (Asset ID)**: `hooked-weight-50g` | **Mã số Catalog**: `OL3D-EQP-MEC-0001`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-CO-03`  
**Tên tiếng Anh**: *Hooked Cylindrical Weight 50g*  
**Phân môn**: Vật lý - Cơ học & Thủy tĩnh học | **Bài học SGK KHTN 8**: Bài: Lực & Đòn bẩy, Khối lượng riêng, Lực đẩy Archimedes (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Tạo tải trọng chuẩn và trọng lượng xác định trong các bài thí nghiệm cơ học, đồng thời đóng vai trò vật rắn đo thể tích chiếm chỗ chất lỏng và lực đẩy Archimedes khi nhúng chìm trong nước.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Vật thể chịu tác dụng của trọng lực $\vec{P} = m \cdot \vec{g}$. Khi nhúng chìm trong chất lỏng, quả nặng chịu thêm lực đẩy Archimedes hướng thẳng đứng từ dưới lên bằng trọng lượng phần chất lỏng bị chiếm chỗ: $F_A = d_{\text{lỏng}} \cdot V_{\text{vật}}$.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Trọng lượng trong không khí:
$$P = m \cdot g = 0.050\text{ kg} \times 9.8\text{ m/s}^2 = 0.490\text{ N} \approx 0.5\text{ N}$$
Thể tích quả nặng bằng đồng thau (khối lượng riêng $\rho = 8400\text{ kg/m}^3$):
$$V = \frac{m}{\rho} = \frac{0.050}{8400} \approx 5.952 \times 10^{-6}\text{ m}^3 = 5.95\text{ cm}^3$$
Lực đẩy Archimedes khi nhúng chìm hoàn toàn trong nước nguyên chất ($\rho_n = 1000\text{ kg/m}^3$):
$$F_A = \rho_n \cdot g \cdot V = 1000 \times 9.8 \times 5.952 \times 10^{-6} \approx 0.0583\text{ N}$$
Trọng lượng biểu kiến đo được bằng lực kế khi chìm trong nước:
$$P' = P - F_A = 0.490 - 0.058 = 0.432\text{ N}$$

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Thân trụ kim loại** | phi 20 x 25 mm | `phi 0.020 x 0.025 m` | Khối lượng chính 50g chuẩn |
| **Móc treo phía trên** | Dây thép phi 1.5 mm, vươn cao 15 mm, uốn R = 4 mm | `0.015 m` | Móc vào lỗ đòn bẩy hoặc lực kế |
| **Rãnh khuyết & chốt đáy** | Rãnh rộng 4 mm, sâu 5 mm, chốt ngang phi 1.5 mm | `0.005 m` | Nhận móc treo nối tiếp của quả nặng kế tiếp |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Đường kính / Chiều cao thân trụ** | `\varnothing / H` | **20 mm / 25 mm = 0.8** | Tỷ lệ chuẩn công nghiệp, hạn chế va đập lắc lư khi treo |
| **Chiều cao móc treo / Tổng chiều cao** | `H_{móc} / H_{tổng}` | **15 mm / 42 mm = 35.7%** | Đảm bảo dễ thao tác móc dây mà không bị vướng |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Độ chính xác khối lượng gia công** | 50.00 g | `+/- 0.20 g` | Cấp chính xác M1 (OIML R111) |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `TopHook`**: Tọa độ cục bộ `(0, 0.021, 0)` | Loại cổng: `hook_attachment` | Hướng pháp tuyến: `Thẳng đứng lên +Y` | Tương thích ghép nối: `lever-balance-arm.LeftHole / RightHole, spring-dynamometer.Hook`
- **Cổng `BottomLoop`**: Tọa độ cục bộ `(0, -0.018, 0)` | Loại cổng: `daisy_chain_slot` | Hướng pháp tuyến: `Thẳng đứng xuống -Y` | Tương thích ghép nối: `hooked-weight-50g.TopHook`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Tự do khi cầm nắm. Khi treo: 2 DOF dao động góc hình nón con lắc (Pendulum Swing) quanh điểm móc.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Kéo thả móc vào lỗ đòn bẩy.
2. Móc nối tiếp quả thứ 2, thứ 3 vào đáy quả trước.
3. Thả chìm vào cốc nước đo lực đẩy Archimedes.

### 3.4. Vùng va chạm & Hitbox Raycasting
Hình trụ tròn capsule va chạm đường kính 0.022 m, chiều cao 0.045 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `isSuspended` | `boolean` | `true / false` | `false` | Đang được treo hay đặt trên bàn |
| `isSubmerged` | `boolean` | `true / false` | `false` | Đang chìm trong chất lỏng |
| `parentWeightId` | `string | null` | `ID string` | `null` | ID của quả nặng treo phía trên (nếu có) |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Xây dựng cây xâu chuỗi trọng lực (Gravity Chain). Khi quả dưới cùng nhận lực, truyền ứng suất kéo lên quả trên và đòn bẩy.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
Hiển thị số nổi `50g` sắc nét; hiệu ứng tạo bọt khí bám quanh thành khi thả vào cốc nước.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Âm vang kim loại leng keng khi hai quả nặng chạm nhau; tiếng 'ùm' nhẹ khi chìm vào nước.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Tải trọng kéo đứt móc: $\ge 50\text{ N}$.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Móc quá 6 quả nối tiếp trên 1 nhánh đòn bẩy THCS** | Móc dưới cùng chạm mặt bàn thí nghiệm làm sai lệch phép đo | Khuyến cáo chỉ móc tối đa 3-4 quả nối tiếp. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
HookedWeight_Root (Group)
  ├── Mesh_CylinderBody (Khối trụ đồng thau vát mép)
  │     └── Khắc chìm laser '50g' (BumpMap / NormalMap)
  ├── Mesh_TopHook (Móc thép uốn cong)
  └── Mesh_BottomPin (Chốt ngang rãnh âm)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tâm gốc (0, 0, 0) tại tâm đối xứng khối trụ đồng.

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Thân đồng thau** | `MeshStandardMaterial` | `color: #d4af37, metalness: 0.9, roughness: 0.2` | Đồng thau vàng óng mạ bảo vệ |
| **Móc thép** | `MeshStandardMaterial` | `color: #cbd5e1, metalness: 0.95, roughness: 0.1` | Thép lò xo mạ Niken cứng cáp |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
