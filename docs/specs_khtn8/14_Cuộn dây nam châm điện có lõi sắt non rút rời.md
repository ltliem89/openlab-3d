# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 14: CUỘN DÂY NAM CHÂM ĐIỆN CÓ LÕI SẮT NON RÚT RỜI
**Mã định danh hệ thống (Asset ID)**: `electromagnet-coil` | **Mã số Catalog**: `OL3D-EQP-MAG-0001`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-DI-07`  
**Tên tiếng Anh**: *Electromagnet Coil with Removable Soft Iron Core*  
**Phân môn**: Vật lý - Từ học & Nam châm điện | **Bài học SGK KHTN 8**: Bài: Tác dụng từ của dòng điện, Nam châm điện (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Khảo sát từ trường sinh ra bởi dòng điện chạy trong ống dây, chứng minh vai trò khuếch đại từ tính mạnh mẽ của lõi sắt non, khảo sát cực từ theo quy tắc nắm tay phải.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Dòng điện chạy trong ống dây hình trụ dài tạo từ trường trong lòng ống dây. Lõi sắt non đặt trong ống dây bị từ hóa mạnh mẽ nhờ độ từ thẩm $\mu_r \gg 1$, làm tăng cảm ứng từ lên gấp hàng trăm đến hàng nghìn lần so với lõi không khí. Khi ngắt dòng điện, lõi sắt non mất từ tính gần như hoàn toàn (khác với thép giữ từ tính vĩnh cửu).

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Cảm ứng từ trong lòng ống dây không có lõi sắt (lõi không khí):
$$B_0 = \mu_0 \cdot n \cdot I = \mu_0 \cdot \frac{N}{L} \cdot I$$
Cảm ứng từ khi lồng lõi sắt non (độ từ thẩm tương đối $\mu_r$):
$$B = \mu_r \cdot B_0 = \mu_r \cdot \mu_0 \cdot \frac{N}{L} \cdot I \quad (\mu_r \approx 500 - 2000)$$
Lực hút tác dụng lên một mạt sắt/đinh sắt ở khoảng cách $r$:
$$F_{\text{hút}} \propto B \cdot \frac{dB}{dr} \propto I^2$$
Quy tắc nắm tay phải xác định chiều đường sức từ: Khum 4 ngón tay theo chiều dòng điện qua các vòng dây, ngón cái choãi ra chỉ chiều cực Bắc ($N$) của nam châm điện.

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Ống cuộn dây nhựa** | phi ngoài 32 mm, phi trong 9 mm, dài 60 mm | `phi 0.032 x 0.060 m` | Ống chỉ chứa 300 vòng dây đồng cách điện |
| **Lõi sắt non hình trụ** | phi 8.0 x dài 85 mm, có núm tiện đầu phi 12 x 10 mm | `phi 0.008 x 0.085 m` | Lõi sắt non từ hóa rút rời tự do |
| **2 cọc cắm bắp chuối** | phi 4 mm gắn trên vành đĩa cuộn dây | `phi 0.008 x 0.016 m` | Đấu nối nguồn điện DC |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Chiều dài lõi sắt / Chiều dài cuộn dây** | `L_{\text{lõi}} / L_{\text{cuộn}}` | **85 mm / 60 mm = 1.417** | Lõi thò ra 25mm tạo cực từ tập trung hút vật thể |
| **Khe hở đường kính lõi và lòng ống** | `\varnothing_{\text{trong}} - \varnothing_{\text{lõi}}` | **9.0 mm - 8.0 mm = 1.0 mm** | Đút lọt nhẹ nhàng không ma sát kẹt dính |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Lõi sắt non cắm vào ống** | 8.0 mm | `-0.1 mm / -0.2 mm` | Lắp lỏng tự do (Slide fit) |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `Terminal_1`**: Tọa độ cục bộ `(-0.012, 0.020, 0.025)` | Loại cổng: `electrical_terminal_dc` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `ElectricalWire.BananaPlug`
- **Cổng `Terminal_2`**: Tọa độ cục bộ `(+0.012, 0.020, 0.025)` | Loại cổng: `electrical_terminal_dc` | Hướng pháp tuyến: `+Y` | Tương thích ghép nối: `ElectricalWire.BananaPlug`
- **Cổng `IronCoreSlideSlot`**: Tọa độ cục bộ `(0, 0, 0)` | Loại cổng: `magnetic_core_slot` | Hướng pháp tuyến: `Dọc trục X` | Tương thích ghép nối: `SoftIronCore.Shaft`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
Lõi sắt non có 1 DOF tịnh tiến rút ra cắm vào lòng ống dây dọc trục X.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Kéo rút thanh lõi sắt non ra hoặc đút vào trong cuộn dây.
2. Cắm dây cấp điện và bật công tắc nguồn.
3. Đưa đinh sắt hoặc kim nam châm lại gần hai đầu để quan sát từ trường.

### 3.4. Vùng va chạm & Hitbox Raycasting
Ống cuộn: Capsule phi 0.035 x 0.065 m; Lõi sắt: Trụ tròn phi 0.014 x 0.090 m.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `isCoreInserted` | `boolean` | `true / false` | `true` | Lõi sắt non đang nằm trong cuộn dây |
| `currentAmps` | `number` | `[0, 2.5]` | `0.0` | Dòng điện chạy qua cuộn dây |
| `magneticFieldTesla` | `number` | `[0, 0.25]` | `0.0` | Độ lớn cảm ứng từ tại đầu cực (Tesla) |
| `attractedPinsCount` | `number` | `[0, 20]` | `0` | Số lượng đinh sắt hút dính được |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Khi $I > 0$: Tính $B = \mu_r \cdot \mu_0 \cdot (N/L) \cdot I$. Nếu `isCoreInserted = false`, $\mu_r = 1.0$ (chỉ hút được 1-2 mạt sắt nhẹ). Khi có lõi sắt: $\mu_r = 800$, hút được chùm đinh sắt lớn $15-20$ cái. Ngắt dòng điện ($I = 0$): $B \approx 0$, đinh sắt rơi rụng lập tức.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
• Đường sức từ 3D dạng vector cong khép kín hiển thị khi bật chế độ Visualize Magnetic Field.
• Chùm đinh sắt tự động bay hút dính vào đầu lõi sắt.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
Tiếng 'cạch... cạch' khi các đinh sắt bị hút dính vào đầu cực kim loại; tiếng rò rè điện từ tần số thấp nếu dòng lớn.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Dòng điện định mức: $1.5\text{ A}$; Dòng tối đa tức thời: $2.5\text{ A}$ (cuộn dây ấm lên nhanh chóng).

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Cấp dòng 3A liên tục không ngắt trong thời gian dài** | Cuộn dây nóng trên 80 độ C làm chảy ống chỉ nhựa | Chỉ bật nam châm điện trong lúc thực hiện thao tác quan sát rồi ngắt ngay. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
Electromagnet_Root (Group)
  ├── Mesh_Bobbin (Ống chỉ nhựa cách điện có 2 vành giữ)
  ├── Mesh_CopperCoil (Cuộn dây đồng tráng men vecni cánh gián)
  ├── Mesh_Terminals[0..1] (2 cọc bắp chuối mạ đồng)
  └── Group_SoftIronCore (Thanh lõi sắt non rút trượt)
        ├── Mesh_IronRod (Thanh trụ sắt non mạ bóng)
        └── Mesh_GripKnob (Núm cầm tiện rãnh)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tọa độ tâm đối xứng cuộn dây (0, 0, 0).

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Dây đồng tráng men** | `MeshStandardMaterial` | `color: #b45309, roughness: 0.3, metalness: 0.8` | Đồng ánh kim tráng vecni bóng |
| **Lõi sắt non** | `MeshStandardMaterial` | `color: #475569, roughness: 0.25, metalness: 0.92` | Thép silic từ tính mài nhẵn |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
