# 23. Bản bán trụ thuỷ tinh & Bảng chia độ 360° (SGK KHTN 9)

**Device ID:** `OL3D-EQP-SLB-0001`  
**Nhóm chức năng đề xuất:** `G06`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `semicircular-slab`  
**Slug:** `semicircular-glass-slab-protractor`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-SLB-0001_semicircular-glass-slab-protractor` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.2 trang 6 & Bài 5, 6 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 1 (trang 6), Bài 5 Khúc xạ ánh sáng (trang 25–28), Bài 6 Phản xạ toàn phần (trang 30–32) * **Hình ảnh đối chiếu SGK**: Hình 1.2, Hình 5.1, Hình 5.2, Hình 6.1 (**) * **Chức năng chuẩn**: Đọc chính xác giá trị góc tới i, góc khúc xạ r và góc phản xạ i' để nghiệm lại định luật khúc xạ ánh sáng (sin i / sin r = hằng số) và xác định góc tới hạn phản xạ toàn phần (i_th ≈ 41,8°). ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 190 mm, Cao = 32 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.19 m, Cao (Y) = 0.032 m, Sâu (Z) = 0.19 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `handle`, `incident_ray`, `ray_paths`, `reflected_ray`, `refracted_ray`, `measurement_anchor` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: ExtrudeGeometry with Bevel; Optical Ray Tracing & Refraction * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `CylinderGeometry (Half cut)` | MeshPhysicalMaterial (BK7 Optical Glass, IOR 1.50, transmission 0.92) | 4 | Khối bán trụ thủy tinh Ø84mm dày 16mm mài bóng | | `handle` | `CylinderGeometry (Disc)` | MeshStandardMaterial (Hartmann Protractor Texture) | 2 | Mâm tròn chia độ 360° xoay đồng tâm O | | `refracted_ray` | `Line / Cylinder` | MeshBasicMaterial (Red Laser) | 6 | Tia khúc xạ (tự động ẩn khi i >= 41.8°) | | `reflected_ray` | `Line / Cylinder` | MeshBasicMaterial (Red Laser) | 6 | Tia phản xạ đối xứng (sáng cực đại khi phản xạ toàn phần) | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`, `opticalFocus` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **320 g** (Trạng thái: `verified`) * **Thông số metrology thiết bị đo**: - Đại lượng đo: `refraction-angle` - Giới hạn đo (GHĐ): **0 độ (°)** đến **90 độ (°)** - Độ chia nhỏ nhất (ĐCNN): **1 độ (°)** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad n_1 \cdot \sin i = n_2 \cdot \sin r \iff \sin r = \frac{n_1}{n_2} \cdot \sin i$$ *Ý nghĩa vật lý*: Định luật khúc xạ ánh sáng Snell–Descartes ($n_1 = 1.50$ thủy tinh, $n_2 = 1.00$ không khí). $$\mathbf{(2)}\quad \sin i_{gh} = \frac{n_2}{n_1} = \frac{1}{1.50} = \frac{2}{3} \implies i_{gh} \approx 41.81^\circ$$ *Ý nghĩa vật lý*: Góc tới hạn phản xạ toàn phần từ thủy tinh sang không khí (Bài 6 SGK KHTN 9). $$\mathbf{(3)}\quad i \ge 41.81^\circ \implies \text{Refracted Ray disappears}, \; I_{reflected} = 100\%$$ *Ý nghĩa vật lý*: Điều kiện xảy ra Phản xạ toàn phần: Không còn tia khúc xạ ló ra không khí. * **Các tính năng khoa học tích hợp**: - Khối bán trụ bằng thủy tinh quang học BK7 (hoặc Acrylic quang học tinh khiết) đặt đồng tâm trên mâm chia độ tròn 360° (ĐCNN 1°). - Mặt phẳng đường kính của bản bán trụ trùng khít vạch chuẩn 90°–90°, tâm O trùng giao điểm pháp tuyến N–N'. - Khi chiếu tia laser qua mặt cong hướng vào tâm O (từ thủy tinh chiết suất n = 1.50 ra không khí): Góc tới i < 41.8° cho tia khúc xạ; khi i ≥ 42° tia khúc xạ biến mất hoàn toàn và xảy ra Phản xạ toàn phần (Bài 6 SGK KHTN 9). ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `NORMAL_INCIDENCE` * **Danh sách trạng thái khả dụng**: `NORMAL_INCIDENCE`, `REFRACTION_DOMINANT`, `CRITICAL_ANGLE`, `TOTAL_INTERNAL_REFLECTION` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `NORMAL_INCIDENCE` | `REFRACTION_DOMINANT` | Rotated on protractor | `0 < i < 41.8°` | | `REFRACTION_DOMINANT` | `CRITICAL_ANGLE` | Angle reaches 41.8° | `i == 41.8°` | | `REFRACTION_DOMINANT` | `TOTAL_INTERNAL_REFLECTION` | Angle exceeds critical | `i >= 42.0°` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±0.5° góc trên bảng chia độ 360° * **Độ chia nhỏ nhất / Độ phân giải**: 1.0° (Vạch khắc laser trên mâm tròn Ø150mm) * **Độ lặp lại phép đo**: ±0.2° * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Chiết suất n = 1.50 ± 0.005 ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Tia tới không đi qua tâm O của bản bán trụ** | Đèn laser bị lệch trục không đồng tâm với mâm chia độ | Tia bị bẻ cong tại mặt cong trước khi tới mặt phẳng, làm sai định luật Snell | `Khoảng cách tia tới tâm O > 0.5 mm` | Bấm nút Snap Ray to Center O tự động căn chỉnh đồng trục | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Bản bán trụ trong suốt: Đường kính tối thiểu 80 mm, độ dày tối thiểu 15 mm, dùng kèm bảng chia độ 360°. | | **VietJack — SGK KHTN 9 Bài 5 & Bài 6** | `vietjack.com` | Hình 1.2 trang 6, Hình 5.2 (Khúc xạ ánh sáng) và Hình 6.1 (Phản xạ toàn phần): Đọc góc tới i và góc khúc xạ r trên bảng chia độ. | | **Thiết bị Dạy học Tối thiểu** | `thietbidayhoctoithieu.vn` | Bộ thí nghiệm khúc xạ và phản xạ toàn phần KHTN 9: Bảng tròn chia độ 0–90° ở 4 góc phần tư, vạch pháp tuyến rõ nét. | | **VietValue — Thiết bị Vật lí** | `vietvalue.edu.vn` | Bản bán trụ thủy tinh quang học chiết suất n = 1.5, các mặt bên mài bóng quang học không biến dạng tia. | | **Innotec Việt Nam** | `innotec.com.vn` | Mâm chia độ xoay nhẹ nhàng giúp thay đổi góc tới i liên tục từ 0° đến 80° mà không cần dịch chuyển đèn laser. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Đo góc tới, góc khúc xạ và quan sát phản xạ toàn phần trên bản bán trụ.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 190 mm, Cao = 32 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.19 m, Cao (Y) = 0.032 m, Sâu (Z) = 0.19 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `handle`, `incident_ray`, `ray_paths`, `reflected_ray`, `refracted_ray`, `measurement_anchor`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `readScale`, `opticalFocus`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `NORMAL_INCIDENCE`, `REFRACTION_DOMINANT`, `CRITICAL_ANGLE`, `TOTAL_INTERNAL_REFLECTION`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body / handle | Bản bán trụ | Đặt tâm O tại tâm thước và xoay bản quanh trục thẳng đứng. | Hướng mặt cong/mặt phẳng thay đổi theo góc đặt. |
| protractor / angle scale | Bảng chia độ 360° | Xoay đĩa/đọc góc và đặt tia tới theo vạch. | Góc tới i và góc khúc xạ r cập nhật. |
| incident_ray / ray_paths / refracted_ray / reflected_ray | Đường tia sáng | Điều chỉnh hướng tia laser và bản thủy tinh. | Tia phản xạ/khúc xạ hiển thị theo định luật Snell. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt bản bán trụ trùng tâm O của thước.
2. Căn tia laser đi qua tâm theo hướng xác định.
3. Tăng/giảm góc tới theo vạch chia.
4. Đọc góc khúc xạ và góc phản xạ.
5. Khảo sát góc tới hạn khi truyền từ thủy tinh ra không khí.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Tuân theo n1 sin i = n2 sin r.
- Khi i đạt/vượt góc tới hạn ở mặt phân cách thích hợp, tia khúc xạ biến mất và phản xạ toàn phần xuất hiện.
- Phải xác định đúng hướng truyền và mặt phẳng tới.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad n_1 \cdot \sin i = n_2 \cdot \sin r \iff \sin r = \frac{n_1}{n_2} \cdot \sin i$$
  *Ý nghĩa vật lý*: Định luật khúc xạ ánh sáng Snell–Descartes ($n_1 = 1.50$ thủy tinh, $n_2 = 1.00$ không khí).
  $$\mathbf{(2)}\quad \sin i_{gh} = \frac{n_2}{n_1} = \frac{1}{1.50} = \frac{2}{3} \implies i_{gh} \approx 41.81^\circ$$
  *Ý nghĩa vật lý*: Góc tới hạn phản xạ toàn phần từ thủy tinh sang không khí (Bài 6 SGK KHTN 9).
  $$\mathbf{(3)}\quad i \ge 41.81^\circ \implies \text{Refracted Ray disappears}, \; I_{reflected} = 100\%$$
  *Ý nghĩa vật lý*: Điều kiện xảy ra Phản xạ toàn phần: Không còn tia khúc xạ ló ra không khí.
* **Các tính năng khoa học tích hợp**:
  - Khối bán trụ bằng thủy tinh quang học BK7 (hoặc Acrylic quang học tinh khiết) đặt đồng tâm trên mâm chia độ tròn 360° (ĐCNN 1°).
  - Mặt phẳng đường kính của bản bán trụ trùng khít vạch chuẩn 90°–90°, tâm O trùng giao điểm pháp tuyến N–N'.
  - Khi chiếu tia laser qua mặt cong hướng vào tâm O (từ thủy tinh chiết suất n = 1.50 ra không khí): Góc tới i < 41.8° cho tia khúc xạ; khi i ≥ 42° tia khúc xạ biến mất hoàn toàn và xảy ra Phản xạ toàn phần (Bài 6 SGK KHTN 9).

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `NORMAL_INCIDENCE`
* **Danh sách trạng thái khả dụng**: `NORMAL_INCIDENCE`, `REFRACTION_DOMINANT`, `CRITICAL_ANGLE`, `TOTAL_INTERNAL_REFLECTION`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `NORMAL_INCIDENCE` | `REFRACTION_DOMINANT` | Rotated on protractor | `0 < i < 41.8°` |
| `REFRACTION_DOMINANT` | `CRITICAL_ANGLE` | Angle reaches 41.8° | `i == 41.8°` |
| `REFRACTION_DOMINANT` | `TOTAL_INTERNAL_REFLECTION` | Angle exceeds critical | `i >= 42.0°` |

Bổ sung yêu cầu: sự kiện chuyển trạng thái phải được ghi log; mọi chuyển trạng thái phải có guard condition và đường thoát lỗi phù hợp. Không áp dụng một FSM chung cho thiết bị khác bản chất.

## 8. Liên kết với thiết bị khác

- Chỉ khai báo kết nối khi hồ sơ có connector tương thích hoặc bài thực hành yêu cầu rõ.
- Kiểm tra loại connector, vị trí, hướng, giới hạn dây/ống, phân cực, trạng thái khóa và điều kiện an toàn.
- Khi ngắt kết nối, cập nhật trạng thái cả hai đầu và tính lại mô hình liên quan.
- Không tự snap hai thiết bị chỉ vì chúng ở gần nhau nếu loại cổng không tương thích.

## 9. Lỗi, liên động và hướng khắc phục

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Tia tới không đi qua tâm O của bản bán trụ** | Đèn laser bị lệch trục không đồng tâm với mâm chia độ | Tia bị bẻ cong tại mặt cong trước khi tới mặt phẳng, làm sai định luật Snell | `Khoảng cách tia tới tâm O > 0.5 mm` | Bấm nút Snap Ray to Center O tự động căn chỉnh đồng trục |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-SLB-0001-T01:** Với góc nhỏ, tia khúc xạ lệch đúng phía theo Snell.
- [ ] **OL3D-EQP-SLB-0001-T02:** Thay i: r cập nhật.
- [ ] **OL3D-EQP-SLB-0001-T03:** Qua góc tới hạn: mất tia khúc xạ và có phản xạ toàn phần.
- [ ] **OL3D-EQP-SLB-0001-T04:** Xoay bản nhưng không chỉnh tia: vị trí giao tia cập nhật theo hình học.

### Điều kiện PASS

- Bộ phận điều khiển có tương tác thật, không chỉ đổi màu hoặc phát animation.
- Kết quả quan sát/số đo được suy ra từ trạng thái thiết bị và phương trình tương ứng.
- Giới hạn và liên động được kiểm tra bằng tình huống hợp lệ lẫn không hợp lệ.
- Không làm hỏng chức năng chung, dữ liệu hoặc thiết bị khác.
- Có thể lặp lại cùng một kịch bản và nhận kết quả nhất quán trong phạm vi mô hình xác định.

## 11. Yêu cầu UI/UX cho thư viện và hướng dẫn tại chỗ

- Card thư viện hiển thị ảnh thật/ảnh mô hình của chính thiết bị, tên, mã, mô tả ngắn và chức năng chính.
- Khi hover từng bộ phận 3D, hiện tooltip Glassmorphism có ảnh/crop bộ phận, tên, mục đích, thao tác và gợi ý lỗi thường gặp.
- Tooltip không bị cắt bởi `overflow`, không nằm dưới canvas/overlay, xử lý đúng `z-index` và tự đổi vị trí gần mép màn hình.
- Trên touch: tap để mở, tap ngoài để đóng; trên keyboard: focus và Escape.
- Không thay hộp hướng dẫn giàu thông tin bằng một dòng chữ đơn lẻ.

## 12. Ghi chú triển khai cho Three.js/React

- Giữ tương thích với `EquipmentModuleContract` hiện hữu.
- Tách `geometry/presentation`, `technical metadata`, `behavior/capabilities`, `scene instance state`.
- Gắn event handler theo `deviceId + partId`, tránh dùng tên node chung không duy nhất.
- Mọi node điều khiển cần metadata: `partId`, `controlType`, `axis`, `min`, `max`, `step`, `defaultValue`, `unit`, `helpId`.
- Dùng một state update path để `updateEquipmentState` và `applyEquipmentState` phản ánh cùng trạng thái.
- Dọn listener, texture, geometry, material khi instance bị dispose; không tạo CanvasTexture mới mỗi frame.
- Đo FPS và kiểm tra rò rỉ GPU khi thao tác lặp lại.

### 12.1. Metadata điều khiển tối thiểu đề xuất

```ts
interface DeviceControlDefinition {
  partId: string;
  controlType: 'button' | 'switch' | 'dial' | 'slider' | 'rotary' | 'linear' | 'drag' | 'readout';
  axis?: 'x' | 'y' | 'z';
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | boolean | string;
  unit?: string;
  helpId: string;
  guards?: string[];
}
```

Đây là interface đề xuất, cần được đối chiếu với cấu trúc TypeScript thực tế trước khi tích hợp.

## 13. Các điểm cần xác minh trước khi phát triển

- Đối chiếu model 3D thực tế với danh sách node nguồn; node nào chưa tồn tại phải được ghi là TODO, không giả định đã có.
- Xác minh thông số thiết bị, GHĐ, ĐCNN, dung sai và tiêu chuẩn trước khi dùng làm chuẩn chấm điểm.
- Xác minh connector/assembly có thật trong runtime và tương thích với thiết bị này.
- Kiểm tra toàn bộ FMEA và xác nhận ngưỡng cảnh báo không trái thông số thiết bị được chọn.
- Kiểm tra nội dung hồ sơ nguồn bên dưới để phát hiện thông tin thiếu, xung đột hoặc cần cập nhật.

---

# PHỤ LỤC A — HỒ SƠ THIẾT BỊ NGUYÊN GỐC

Phần dưới đây được trích nguyên văn từ chương thiết bị tương ứng trong `BAO_CAO_RA_SOAT_TOAN_DIEN_THANH_PHAN_MO_PHONG_THIET_BI_VA_MOI_TRUONG.md` để giữ nguyên dấu vết nguồn.

## 4.23. [OL3D-EQP-SLB-0001] Bản bán trụ thuỷ tinh & Bảng chia độ 360° (SGK KHTN 9)
**Tên tiếng Anh**: *Semicircular Glass Block & 360° Protractor Disc* | **Mã Archetype**: `semicircular-slab` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-SLB-0001`
* **Mã đường dẫn (Slug)**: `semicircular-glass-slab-protractor`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-SLB-0001_semicircular-glass-slab-protractor` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.2 trang 6 & Bài 5, 6 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 1 (trang 6), Bài 5 Khúc xạ ánh sáng (trang 25–28), Bài 6 Phản xạ toàn phần (trang 30–32)
* **Hình ảnh đối chiếu SGK**: Hình 1.2, Hình 5.1, Hình 5.2, Hình 6.1 (**)
* **Chức năng chuẩn**: Đọc chính xác giá trị góc tới i, góc khúc xạ r và góc phản xạ i' để nghiệm lại định luật khúc xạ ánh sáng (sin i / sin r = hằng số) và xác định góc tới hạn phản xạ toàn phần (i_th ≈ 41,8°).

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 190 mm, Cao = 32 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.19 m, Cao (Y) = 0.032 m, Sâu (Z) = 0.19 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `handle`, `incident_ray`, `ray_paths`, `reflected_ray`, `refracted_ray`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: ExtrudeGeometry with Bevel; Optical Ray Tracing & Refraction
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Half cut)` | MeshPhysicalMaterial (BK7 Optical Glass, IOR 1.50, transmission 0.92) | 4 | Khối bán trụ thủy tinh Ø84mm dày 16mm mài bóng |
| `handle` | `CylinderGeometry (Disc)` | MeshStandardMaterial (Hartmann Protractor Texture) | 2 | Mâm tròn chia độ 360° xoay đồng tâm O |
| `refracted_ray` | `Line / Cylinder` | MeshBasicMaterial (Red Laser) | 6 | Tia khúc xạ (tự động ẩn khi i >= 41.8°) |
| `reflected_ray` | `Line / Cylinder` | MeshBasicMaterial (Red Laser) | 6 | Tia phản xạ đối xứng (sáng cực đại khi phản xạ toàn phần) |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **320 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `refraction-angle`
  - Giới hạn đo (GHĐ): **0 độ (°)** đến **90 độ (°)**
  - Độ chia nhỏ nhất (ĐCNN): **1 độ (°)**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad n_1 \cdot \sin i = n_2 \cdot \sin r \iff \sin r = \frac{n_1}{n_2} \cdot \sin i$$
  *Ý nghĩa vật lý*: Định luật khúc xạ ánh sáng Snell–Descartes ($n_1 = 1.50$ thủy tinh, $n_2 = 1.00$ không khí).
  $$\mathbf{(2)}\quad \sin i_{gh} = \frac{n_2}{n_1} = \frac{1}{1.50} = \frac{2}{3} \implies i_{gh} \approx 41.81^\circ$$
  *Ý nghĩa vật lý*: Góc tới hạn phản xạ toàn phần từ thủy tinh sang không khí (Bài 6 SGK KHTN 9).
  $$\mathbf{(3)}\quad i \ge 41.81^\circ \implies \text{Refracted Ray disappears}, \; I_{reflected} = 100\%$$
  *Ý nghĩa vật lý*: Điều kiện xảy ra Phản xạ toàn phần: Không còn tia khúc xạ ló ra không khí.
* **Các tính năng khoa học tích hợp**:
  - Khối bán trụ bằng thủy tinh quang học BK7 (hoặc Acrylic quang học tinh khiết) đặt đồng tâm trên mâm chia độ tròn 360° (ĐCNN 1°).
  - Mặt phẳng đường kính của bản bán trụ trùng khít vạch chuẩn 90°–90°, tâm O trùng giao điểm pháp tuyến N–N'.
  - Khi chiếu tia laser qua mặt cong hướng vào tâm O (từ thủy tinh chiết suất n = 1.50 ra không khí): Góc tới i < 41.8° cho tia khúc xạ; khi i ≥ 42° tia khúc xạ biến mất hoàn toàn và xảy ra Phản xạ toàn phần (Bài 6 SGK KHTN 9).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `NORMAL_INCIDENCE`
* **Danh sách trạng thái khả dụng**: `NORMAL_INCIDENCE`, `REFRACTION_DOMINANT`, `CRITICAL_ANGLE`, `TOTAL_INTERNAL_REFLECTION`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `NORMAL_INCIDENCE` | `REFRACTION_DOMINANT` | Rotated on protractor | `0 < i < 41.8°` |
| `REFRACTION_DOMINANT` | `CRITICAL_ANGLE` | Angle reaches 41.8° | `i == 41.8°` |
| `REFRACTION_DOMINANT` | `TOTAL_INTERNAL_REFLECTION` | Angle exceeds critical | `i >= 42.0°` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.5° góc trên bảng chia độ 360°
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0° (Vạch khắc laser trên mâm tròn Ø150mm)
* **Độ lặp lại phép đo**: ±0.2°
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Chiết suất n = 1.50 ± 0.005

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Tia tới không đi qua tâm O của bản bán trụ** | Đèn laser bị lệch trục không đồng tâm với mâm chia độ | Tia bị bẻ cong tại mặt cong trước khi tới mặt phẳng, làm sai định luật Snell | `Khoảng cách tia tới tâm O > 0.5 mm` | Bấm nút Snap Ray to Center O tự động căn chỉnh đồng trục |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Bản bán trụ trong suốt: Đường kính tối thiểu 80 mm, độ dày tối thiểu 15 mm, dùng kèm bảng chia độ 360°. |
| **VietJack — SGK KHTN 9 Bài 5 & Bài 6** | `vietjack.com` | Hình 1.2 trang 6, Hình 5.2 (Khúc xạ ánh sáng) và Hình 6.1 (Phản xạ toàn phần): Đọc góc tới i và góc khúc xạ r trên bảng chia độ. |
| **Thiết bị Dạy học Tối thiểu** | `thietbidayhoctoithieu.vn` | Bộ thí nghiệm khúc xạ và phản xạ toàn phần KHTN 9: Bảng tròn chia độ 0–90° ở 4 góc phần tư, vạch pháp tuyến rõ nét. |
| **VietValue — Thiết bị Vật lí** | `vietvalue.edu.vn` | Bản bán trụ thủy tinh quang học chiết suất n = 1.5, các mặt bên mài bóng quang học không biến dạng tia. |
| **Innotec Việt Nam** | `innotec.com.vn` | Mâm chia độ xoay nhẹ nhàng giúp thay đổi góc tới i liên tục từ 0° đến 80° mà không cần dịch chuyển đèn laser. |

---
