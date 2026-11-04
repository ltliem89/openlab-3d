# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 21: BÁT SỨ NUNG / BÁT CÔ CẠN DUNG DỊCH 75ML
**Mã định danh hệ thống (Asset ID)**: `porcelain-evaporating-basin` | **Mã số Catalog**: `OL3D-EQP-CHE-0007`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-HOA-07`  
**Tên tiếng Anh**: *Porcelain Evaporating Dish with Spout 75ml*  
**Phân môn**: Hóa học - Tách chất & Kết tinh | **Bài học SGK KHTN 8**: Bài: Cô cạn dung dịch muối, Tách chất tan (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Chịu nhiệt độ cực cao trực tiếp từ ngọn lửa đèn cồn để làm bay hơi dung môi nước nhanh chóng, thu lấy chất tan kết tinh (muối ăn $NaCl$, đồng sunfat $CuSO_4$) bám ở đáy bát.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Thiết kế miệng rộng nông tối đa hóa diện tích mặt thoáng chất lỏng, giúp tốc độ bốc hơi nước tăng vọt theo định luật Dalton: $\frac{dm}{dt} \propto S \cdot (p_s - p_a)$. Men sứ kỹ thuật trơ hóa học chịu được kiềm, axit và nhiệt độ nung lên tới $1050^\circ\text{C}$.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Tốc độ bay hơi dung môi:
$$\frac{dm_{\text{nước}}}{dt} = \frac{C \cdot A_{\text{mặt thoáng}} \cdot (p_{\text{bão hòa}}(T) - p_{\text{kk}})}{H_{\text{hóa hơi}}}$$
Khi thể tích nước giảm xuống dưới ngưỡng hòa tan bão hòa $C(T) > S(T)$:
$$m_{\text{kết tinh}} = m_{\text{muối ban đầu}} - S(T) \cdot V_{\text{nước còn lại}}$$
Muối kết tinh dần tụ lại ở đáy thành lớp tinh thể rắn khô ráo.

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Thân bát chỏm cầu** | phi miệng 75 mm, cao 32 mm, thành dày 2.5 mm | `phi 0.075 x 0.032 m` | Chứa dung dịch cô cạn, dung tích 75 mL |
| **Mỏ rót nhọn** | Rộng 10 mm, vươn dài 8 mm | `0.008 m` | Trút dịch lỏng hoặc tinh thể ra ngoài |
| **Đáy phẳng mài nhám** | phi tiếp xúc 30 mm | `phi 0.030 m` | Tự vững trên mặt lưới sứ của kiềng đun |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Đường kính miệng / Chiều cao** | `\varnothing / H` | **75 mm / 32 mm = 2.34** | Dáng xòe rộng nông, tối ưu tốc độ thoát hơi nước |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Đáy phẳng tiếp xúc lưới sứ** | phi 30 mm | `Độ phẳng < 0.2 mm` | Tiếp xúc nhiệt phẳng không kênh kiệu |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `BottomRest`**: Tọa độ cục bộ `(0, 0, 0)` | Loại cổng: `surface_rest_crucible` | Hướng pháp tuyến: `-Y` | Tương thích ghép nối: `tripod-burner-gauze.TopGauzeRest`
- **Cổng `TongGripZone`**: Tọa độ cục bộ `(0, 0.020, 0)` | Loại cổng: `crucible_tong_grip` | Hướng pháp tuyến: `Ngang` | Tương thích ghép nối: `CrucibleTongs.Jaws`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Đặt trên kiềng đun hoặc cầm bằng panh gắp sứ (6 DOF).

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Rót $15 - 20\text{ mL}$ dung dịch muối vào bát sứ.
2. Đặt bát lên kiềng đun có lưới thép lót sứ.
3. Đun đèn cồn và dùng đũa thủy tinh khuấy nhẹ cho đến khi nước cạn và muối kết tinh.

### 3.4. Vùng va chạm & Hitbox Raycasting
Chỏm cầu tròn phi 0.080 x cao 0.035 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `solutionVolumeMl` | `number` | `[0, 50]` | `20.0` | Thể tích dung dịch muối đang đun (ml) |
| `isDryCrystallized` | `boolean` | `true / false` | `false` | Đã cạn khô kết tinh muối hoàn toàn |
| `dishTemperatureC` | `number` | `[25, 450]` | `25.0` | Nhiệt độ bát sứ (độ C) |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Khi đun nóng: Giảm dần `solutionVolumeMl` với tốc độ bay hơi phụ thuộc `dishTemperatureC`. Khi `solutionVolumeMl <= 0.5 mL`: Hiện lớp tinh thể màu trắng tinh (`NaCl`) hoặc xanh lam (`CuSO4`) phủ kín đáy bát.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
• Hơi nước bốc lên cuồn cuộn thành làn khói trắng.
• Các hạt tinh thể muối bắt đầu lạo xạo xuất hiện ở viền mép rồi lan kín đáy.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng 'lách tách... lách tách' giòn giã đặc trưng khi tinh thể muối khan nổ nhẹ do mất nước.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Nhiệt độ tối đa: $1050^\circ\text{C}$. Không dùng tay không cầm trực tiếp bát sứ khi vừa đun xong.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Dùng tay không nhấc bát sứ khi vừa đun sôi cạn muối** | Gây bỏng nhiệt cấp độ nặng (bát sứ đang ở nhiệt độ > 200 độ C) | Phải dùng kẹp gắp chén nung (Crucible tongs) để gắp bát sứ nóng! |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
EvaporatingDish_Root (Group)
  ├── Mesh_PorcelainBasin (Bát sứ tráng men trắng có mỏ rót)
  ├── Mesh_SalineSolution (Mực nước dung dịch giảm dần)
  └── Mesh_SaltCrystalsPuddle (Lớp tinh thể muối kết tinh lóng lánh)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ đáy bát (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Thân gốm tráng men** | `MeshStandardMaterial` | `color: #ffffff, roughness: 0.15, metalness: 0.05, clearcoat: 0.9` | Sứ kỹ thuật phủ men bóng láng chịu lửa |
| **Tinh thể muối** | `MeshStandardMaterial` | `color: #f8fafc, roughness: 0.45, metalness: 0.2` | Hạt tinh thể trắng đục lóng lánh |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
