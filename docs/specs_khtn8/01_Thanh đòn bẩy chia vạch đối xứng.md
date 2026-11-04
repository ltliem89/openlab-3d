# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ 01: THANH ĐÒN BẨY CHIA VẠCH ĐỐI XỨNG
**Mã định danh hệ thống (Asset ID)**: `lever-balance-arm` | **Mã số Catalog**: `OL3D-EQP-LEV-0001`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: `TB-KHTN8-CO-01`  
**Tên tiếng Anh**: *Symmetrical Calibrated Lever Arm*  
**Phân môn**: Vật lý - Cơ học & Chuyển động quay | **Bài học SGK KHTN 8**: Bài: Tác dụng làm quay của lực - Đòn bẩy (SGK KHTN 8)

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
Thanh đòn bẩy đóng vai trò vật rắn có trục quay cố định, được sử dụng để khảo sát thực nghiệm điều kiện cân bằng mômen lực khi chịu tác dụng của các lực tác động song song cùng phương hoặc ngược phương tại các khoảng cách cánh tay đòn khác nhau.

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
Thanh nằm cân bằng ngang khi tổng mômen của các lực làm quay theo chiều kim đồng hồ triệt tiêu hoàn toàn tổng mômen của các lực làm quay ngược chiều kim đồng hồ quanh trục quay $O$. Khi có chênh lệch mômen, thanh quay quanh trục $O$ với gia tốc góc $\beta = \frac{\sum M}{I}$ cho tới khi chạm cữ hãm giới hạn góc.

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
Điều kiện cân bằng tổng quát:
$$\sum \vec{M}_O = \vec{0} \iff \sum M_{\text{thuận}} = \sum M_{\text{nghịch}}$$
Đối với 2 nhóm tải trọng treo thẳng đứng ở hai phía trục quay:
$$F_1 \cdot d_1 = F_2 \cdot d_2 \iff m_1 \cdot g \cdot d_1 = m_2 \cdot g \cdot d_2 \iff m_1 \cdot d_1 = m_2 \cdot d_2$$
Phương trình động học quay khi mất cân bằng (bỏ qua ma sát trục):
$$I \cdot \frac{d^2 \theta}{dt^2} = \sum_{i=1}^n F_i \cdot d_i \cdot \cos\theta - c \cdot \frac{d\theta}{dt}$$
với $I = \frac{1}{12} M L^2 + \sum m_i d_i^2$, và $c$ là hệ số cản không khí.

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\text{ unit} = 1.0\text{ m} = 1000\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
| **Thân thanh đòn bẩy** | 400 x 18 x 4 mm | `0.400 x 0.018 x 0.004 m` | Khung chịu lực chính, phân bổ các lỗ treo |
| **Lỗ trục quay tâm O** | Đường kính 6.2 mm | `0.0062 m` | Khớp quay ăn khớp với chốt giá đỡ |
| **Các lỗ treo móc (18 lỗ)** | Đường kính 2.5 mm | `0.0025 m` | Điểm móc quả nặng, cách nhau đúng 20 mm |
| **Đai ốc ren vi chỉnh 2 đầu (2 bộ)** | Ren M4 x 25 mm, tán tròn phi 8 x 8 mm | `phi 0.008 x 0.008 m` | Cân bằng zero ban đầu trước khi làm thí nghiệm |

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
| **Tỷ lệ Dài : Rộng : Dày** | `L : W : T` | **100 : 4.5 : 1 (400 : 18 : 4 mm)** | Đảm bảo độ cứng uốn dọc trục, thanh không bị võng khi treo tải trọng tối đa |
| **Bước chia lỗ / Nửa chiều dài** | `\Delta d / (L/2)` | **20 mm / 200 mm = 10%** | Mỗi bước nhảy cánh tay đòn chiếm chính xác 10% chiều dài mỗi nhánh |
| **Đường kính lỗ trục / Chiều rộng thanh** | `\varnothing_{trục} / W` | **6.2 mm / 18 mm = 34.4%** | Đủ vững chắc tại tâm xoay mà không làm yếu tiết diện chịu cắt |

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
| **Lỗ tâm thanh - Chốt xoay giá đỡ** | 6.0 mm | `+0.2 mm / +0.05 mm` | Lắp lỏng (Free running fit), ma sát cực thấp |
| **Lỗ móc treo - Móc quả nặng 50g** | 2.0 mm | `+0.5 mm` | Lắp tự do, móc treo lọt nhẹ nhàng không kẹt |

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
- **Cổng `PivotCenterPort`**: Tọa độ cục bộ `(0, 0, 0)` | Loại cổng: `mechanical_pivot` | Hướng pháp tuyến: `Trục Z` | Tương thích ghép nối: `lever-pivot-stand.UpperPin`
- **Cổng `LeftHole_1..9`**: Tọa độ cục bộ `(-0.02 * k, 0, 0)` | Loại cổng: `suspension_hook` | Hướng pháp tuyến: `Thẳng đứng xuống -Y` | Tương thích ghép nối: `hooked-weight-50g.TopHook`
- **Cổng `RightHole_1..9`**: Tọa độ cục bộ `(+0.02 * k, 0, 0)` | Loại cổng: `suspension_hook` | Hướng pháp tuyến: `Thẳng đứng xuống -Y` | Tương thích ghép nối: `hooked-weight-50g.TopHook`

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
1 DOF: Quay tự do quanh trục Z tại tâm O. Góc xoay giới hạn [-30 deg, +30 deg] (tương đương [-0.523 rad, +0.523 rad]) do chạm gờ chặn của giá đỡ.

### 3.3. Thao tác điều khiển người dùng (User Interactions)
1. Kéo thả thanh đòn bẩy vào chốt ngàm của giá đỡ để gắn kết.
2. Vặn ốc vi chỉnh 2 đầu bằng chuột/cảm ứng để đưa thanh về trạng thái thăng bằng ngang ban đầu.
3. Kéo quả nặng 50g thả vào các lỗ treo từ số 1 đến số 9 ở hai cánh.
4. Đọc giá trị cân bằng và quan sát góc lệch trực tiếp.

### 3.4. Vùng va chạm & Hitbox Raycasting
Hộp va chạm OBB (Oriented Bounding Box) kích thước 0.400 x 0.022 x 0.012 m bám theo chuyển động quay của thanh, tối ưu hóa raycasting cho cả 18 lỗ treo.

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
| `isMounted` | `boolean` | `true / false` | `false` | Trạng thái đã lắp lên giá đỡ trục quay hay chưa |
| `angleRad` | `number` | `[-0.523, +0.523]` | `0.0` | Góc quay của đòn bẩy so với phương ngang (rad) |
| `torqueLeft` | `number` | `[0, 5.0]` | `0.0` | Tổng mômen lực nhánh trái (N.m) |
| `torqueRight` | `number` | `[0, 5.0]` | `0.0` | Tổng mômen lực nhánh phải (N.m) |
| `isBalanced` | `boolean` | `true / false` | `true` | Đạt trạng thái thăng bằng (|torqueLeft - torqueRight| < 0.005 N.m) |

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
Khi có quả nặng móc vào các lỗ treo, hệ thống tính toán: $$M_{\text{trái}} = \sum m_{L,i} \cdot g \cdot d_{L,i}, \quad M_{\text{phải}} = \sum m_{R,i} \cdot g \cdot d_{R,i}$$
Nếu $|M_{\text{trái}} - M_{\text{phải}}| < 0.005\text{ N}\cdot\text{m}$, kích hoạt giảm chấn dao động đưa `angleRad` về $0.0$. Nếu lệch, thanh quay nghiêng về bên có mômen lớn hơn với tốc độ góc suy giảm theo ma sát nhớt.

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
• Vạch số laser phát sáng xanh lục nhẹ khi đạt trạng thái cân bằng hoàn hảo.
• Hiển thị thước đo độ góc nghiêng ảo dạng HUD khi đang xoay.
• Mũi tên vector trọng lực $P_i$ hiển thị trực quan tại điểm treo.

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
• Tiếng 'tách' kim loại nhẹ khi quả nặng khớp vào lỗ treo.
• Tiếng gõ chạm nhẹ 'cạch' khi đòn bẩy nghiêng chạm cữ chặn cơ học.

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
Tải trọng tối đa mỗi bên: $5.0\text{ N}$ (tương đương $10$ quả nặng $50\text{ g} = 500\text{ g}$). Không cho phép tác dụng lực bẻ vặn theo trục X hoặc Y.

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
| **Treo quá 500g vào một bên đầu ngoài cùng (lỗ số 9)** | Mômen vượt quá 0.9 N.m làm cong vênh thanh nhôm hoặc gãy chốt trục tâm | Cảnh báo quá tải: Giới hạn thí nghiệm THCS khuyến nghị tối đa 3-4 quả nặng 50g mỗi bên. |
| **Thực hiện thí nghiệm khi chưa chỉnh thăng bằng zero 2 ốc đối trọng** | Sai số hệ thống khiến kết quả F1.d1 != F2.d2 | Quy tắc bắt buộc: Phải chỉnh thanh thăng bằng tuyệt đối trước khi móc tải. |

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
```text
LeverArm_Root (Group)
  ├── Mesh_MainBeam (ExtrudeGeometry, Nhôm phay xước)
  │     └── Vạch chia & số khắc laser (DecalGeometry / CanvasTexture)
  ├── Group_LeftTrimNut (Ốc vi chỉnh trái)
  ├── Group_RightTrimNut (Ốc vi chỉnh phải)
  └── Ports_Holes[0..17] (SnapPoint Anchor Objects)
```

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
Tâm gốc tọa độ (0, 0, 0) đặt chính xác tại tâm hình học của lỗ trục quay O, đảm bảo ma trận biến đổi quay khớp hoàn toàn với trục giá đỡ.

### 6.3. Bảng tham số vật liệu PBR Three.js (`MeshStandardMaterial` / `MeshPhysicalMaterial`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
| **Thân thanh nhôm** | `MeshStandardMaterial` | `color: #d0d7de, metalness: 0.85, roughness: 0.25` | Hợp kim nhôm xước mờ mạ anode chống xước |
| **Vạch số khắc** | `MeshBasicMaterial` | `color: #0f172a / #dc2626` | Vạch đen, số đỏ rõ nét chống lóa |
| **Đai ốc vi chỉnh** | `MeshStandardMaterial` | `color: #eab308, metalness: 0.9, roughness: 0.2` | Đồng thau khía rãnh nhám công thái học |

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
