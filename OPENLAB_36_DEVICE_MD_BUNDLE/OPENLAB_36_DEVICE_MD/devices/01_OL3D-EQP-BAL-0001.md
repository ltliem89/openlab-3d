# 01. Cân điện tử hiện số 500 g

**Device ID:** `OL3D-EQP-BAL-0001`  
**Nhóm chức năng đề xuất:** `G02`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `electronic-balance`  
**Slug:** `can-dien-tu-hien-so-500g`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `partially-verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-BAL-0001_can-dien-tu-hien-so-500g` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · OIML Class II ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 200 mm, Cao = 85 mm, Sâu = 240 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.2 m, Cao (Y) = 0.085 m, Sâu (Z) = 0.24 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `scale_display`, `tare_button_3d`, `weighing_pan`, `pan_plate`, `measurement_anchor` * **Các lớp vật liệu Three.js sử dụng**: `MeshPhysicalMaterial`, `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: ExtrudeGeometry with Bevel; Torus Chamfered Edge Reflectors; State Sync via userData; Optical Ray Tracing & Refraction * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `ExtrudeGeometry (Bevel)` | MeshPhysicalMaterial (White ABS, roughness 0.25) | 1 | Thân vỏ OHAUS Scout chống hóa chất | | `weighing_pan` | `CylinderGeometry + Torus` | MeshPhysicalMaterial (SUS304 Inox, metalness 0.94) | 2 | Mâm cân Inox lún 2.2mm khi chịu lực | | `scale_display` | `PlaneGeometry (Offset)` | MeshBasicMaterial (CanvasTexture LED) | 3 | Màn hình LCD 7 đoạn nghiêng 20° | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `weighObject`, `readScale` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **1450 g** (Trạng thái: `reported`) * **Thông số metrology thiết bị đo**: - Đại lượng đo: `mass` - Giới hạn đo (GHĐ): **0 g** đến **500 g** - Độ chia nhỏ nhất (ĐCNN): **0.01 g** - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad m_{net} = \max\left(0, m_{gross} - m_{tare}\right)$$ *Ý nghĩa vật lý*: Số chỉ khối lượng tịnh sau khi trừ bì (TARE Offset). $$\mathbf{(2)}\quad m(t) = m_{final} \cdot \left(1 - e^{-t / \tau}\right) + \epsilon_{Gauss}(0, \sigma^2)$$ *Ý nghĩa vật lý*: Động học đáp ứng cảm biến Loadcell và nhiễu vi chấn động không khí ($\tau \approx 0.35\text{ s}$, $\sigma = 0.005\text{ g}$). $$\mathbf{(3)}\quad m_{thermal} = m_0 \cdot \left[1 + \alpha_{loadcell} \cdot (T_{air} - 25^\circ\text{C})\right]$$ *Ý nghĩa vật lý*: Hiệu ứng trôi nhiệt độ độ nhạy cảm biến biến dạng ($\alpha_{loadcell} \approx 1.5 \times 10^{-5}\,\text{K}^{-1}$). * **Các tính năng khoa học tích hợp**: - Cảm biến lực biến dạng (Loadcell) độ nhạy 0.01 g, thời gian ổn định kết quả ≤ 2 giây. - Chức năng trừ bì (Phím TARE/ZERO) đưa màn hình về 0.00 g khi đặt cốc chứa chất lỏng. - Đĩa cân thép không gỉ SUS304 tháo rời vệ sinh được, có chân ren chỉnh thăng bằng và bọt thủy. - Hiển thị trực tiếp số gam trên màn hình LCD 3D và tự động khóa số đo khi vật đứng yên. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `IDLE_ZERO` * **Danh sách trạng thái khả dụng**: `IDLE_ZERO`, `WEIGHING_SETTLING`, `STABLE_LOCKED`, `OVERLOAD_ERROR` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `IDLE_ZERO` | `WEIGHING_SETTLING` | Object placed on pan | `m_gross > 0.05 g` | | `WEIGHING_SETTLING` | `STABLE_LOCKED` | Settling timer elapsed | `|dm/dt| < 0.01 g/s for 1.2s` | | `WEIGHING_SETTLING` | `OVERLOAD_ERROR` | Load exceeds capacity | `m_gross > 550.0 g` | | `STABLE_LOCKED` | `IDLE_ZERO` | TARE button pressed | `true` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±0.02 g (OIML Class II) * **Độ chia nhỏ nhất / Độ phân giải**: 0.01 g (Màn hình 2 số lẻ) * **Độ lặp lại phép đo**: 0.01 g (Độ lệch chuẩn lặp lại s <= 0.01g) * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: ±0.005 g / 10°C ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Số đo trôi dạt liên tục (Drifting)** | Luồng gió phòng v_air > 0.5 m/s thổi lên đĩa cân | Cân không chốt số STABLE_LOCKED | `Cờ isDraftInterference = true` | Bật hộp chắn gió hoặc giảm tốc độ quạt phòng v_air = 0 m/s | | **Báo lỗi quá tải OVERLOAD_ERR** | Đặt tải trọng vượt quá GHĐ 500g | Màn hình nhấp nháy [ - - - - ] | `Loadcell strain > 105% FS` | Nhấc bớt vật nặng khỏi đĩa cân về bàn | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Danh mục thiết bị dạy học tối thiểu KHTN THCS: Cân điện tử hiện số, độ chính xác 0.01g – 0.1g, có chức năng trừ bì. | | **Thiết bị Giáo dục VietValue** | `vietvalue.edu.vn` | Cân kỹ thuật phòng thí nghiệm THCS: Đĩa cân Ø 120–130 mm Inox, màn hình LCD xanh ngọc, phím TARE/MODE/ON-OFF. | | **Thiết bị Điện tử & Đo lường Việt Nam** | `thietbidientu.net.vn` | Kích thước máy chuẩn 190 × 240 × 75 mm, nguồn DC 6V/Pin AA, sai số lặp lại ±0.02 g. | | **DMKLab — Thiết bị Phòng thí nghiệm** | `dmklab.vn` | Cân kỹ thuật 2 số lẻ (0.01 g): Tích hợp chống quá tải cơ học và tự động hiệu chuẩn ngoại bằng quả cân chuẩn. | | **Innotec Việt Nam — Thiết bị Dạy học** | `innotec.com.vn` | Cân điện tử thực hành KHTN: Vỏ nhựa ABS chống hóa chất, mặt hiển thị nghiêng 25° giúp học sinh dễ đọc góc nhìn thẳng. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Đo khối lượng bằng loadcell; hỗ trợ cân vật trực tiếp và cân trừ bì.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 200 mm, Cao = 85 mm, Sâu = 240 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.2 m, Cao (Y) = 0.085 m, Sâu (Z) = 0.24 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `scale_display`, `tare_button_3d`, `weighing_pan`, `pan_plate`, `measurement_anchor`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`, `weighObject`, `readScale`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `IDLE_ZERO`, `WEIGHING_SETTLING`, `STABLE_LOCKED`, `OVERLOAD_ERROR`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| weighing_pan / pan_plate | Bề mặt nhận tải | Kéo vật từ bàn lên đĩa; chỉ chấp nhận vật trong giới hạn tải. | Hiển thị tải tổng; đĩa có độ lún thị giác rất nhỏ nếu mô hình đã hỗ trợ. |
| tare_button_3d | Nút ZERO/TARE | Nhấn khi cân đang bật; ghi tải hiện tại làm tare offset. | Màn hình về 0.00 g; tải tổng vẫn tồn tại, tải tịnh được tính từ tải tổng trừ bì. |
| scale_display | Màn hình số | Không nhập trực tiếp số đo; chỉ đọc kết quả cảm biến. | Hiển thị quá trình settling, STABLE, đơn vị g và OVERLOAD khi vượt ngưỡng. |
| leveling feet / bubble level | Chân chỉnh cân bằng (nếu có mesh) | Xoay chân chỉnh theo cấu tạo thiết bị. | Hiển thị trạng thái cân bằng hoặc cảnh báo chưa cân bằng; không tự bù nếu thiết bị không có cảm biến. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Bật cân và chờ trạng thái zero.
2. Đặt vật/cốc lên đĩa cân.
3. Chờ số đo ổn định rồi ghi khối lượng.
4. Đặt cốc rỗng và nhấn TARE nếu cần cân phần chất bên trong.
5. Thêm mẫu vào cốc và đọc khối lượng tịnh.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Số đo thay đổi theo khối lượng vật, có thời gian ổn định và nhiễu nhỏ theo cấu hình nguồn.
- TARE thay đổi offset chứ không xóa tải vật lý đang đặt trên đĩa.
- Quá tải phải hiển thị trạng thái lỗi và yêu cầu bỏ bớt tải.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad m_{net} = \max\left(0, m_{gross} - m_{tare}\right)$$
  *Ý nghĩa vật lý*: Số chỉ khối lượng tịnh sau khi trừ bì (TARE Offset).
  $$\mathbf{(2)}\quad m(t) = m_{final} \cdot \left(1 - e^{-t / \tau}\right) + \epsilon_{Gauss}(0, \sigma^2)$$
  *Ý nghĩa vật lý*: Động học đáp ứng cảm biến Loadcell và nhiễu vi chấn động không khí ($\tau \approx 0.35\text{ s}$, $\sigma = 0.005\text{ g}$).
  $$\mathbf{(3)}\quad m_{thermal} = m_0 \cdot \left[1 + \alpha_{loadcell} \cdot (T_{air} - 25^\circ\text{C})\right]$$
  *Ý nghĩa vật lý*: Hiệu ứng trôi nhiệt độ độ nhạy cảm biến biến dạng ($\alpha_{loadcell} \approx 1.5 \times 10^{-5}\,\text{K}^{-1}$).
* **Các tính năng khoa học tích hợp**:
  - Cảm biến lực biến dạng (Loadcell) độ nhạy 0.01 g, thời gian ổn định kết quả ≤ 2 giây.
  - Chức năng trừ bì (Phím TARE/ZERO) đưa màn hình về 0.00 g khi đặt cốc chứa chất lỏng.
  - Đĩa cân thép không gỉ SUS304 tháo rời vệ sinh được, có chân ren chỉnh thăng bằng và bọt thủy.
  - Hiển thị trực tiếp số gam trên màn hình LCD 3D và tự động khóa số đo khi vật đứng yên.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE_ZERO`
* **Danh sách trạng thái khả dụng**: `IDLE_ZERO`, `WEIGHING_SETTLING`, `STABLE_LOCKED`, `OVERLOAD_ERROR`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE_ZERO` | `WEIGHING_SETTLING` | Object placed on pan | `m_gross > 0.05 g` |
| `WEIGHING_SETTLING` | `STABLE_LOCKED` | Settling timer elapsed | `|dm/dt| < 0.01 g/s for 1.2s` |
| `WEIGHING_SETTLING` | `OVERLOAD_ERROR` | Load exceeds capacity | `m_gross > 550.0 g` |
| `STABLE_LOCKED` | `IDLE_ZERO` | TARE button pressed | `true` |

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
| **Số đo trôi dạt liên tục (Drifting)** | Luồng gió phòng v_air > 0.5 m/s thổi lên đĩa cân | Cân không chốt số STABLE_LOCKED | `Cờ isDraftInterference = true` | Bật hộp chắn gió hoặc giảm tốc độ quạt phòng v_air = 0 m/s |
| **Báo lỗi quá tải OVERLOAD_ERR** | Đặt tải trọng vượt quá GHĐ 500g | Màn hình nhấp nháy [ - - - - ] | `Loadcell strain > 105% FS` | Nhấc bớt vật nặng khỏi đĩa cân về bàn |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-BAL-0001-T01:** Đặt vật 100 g: số đo tiến tới giá trị tương ứng và ổn định.
- [ ] **OL3D-EQP-BAL-0001-T02:** Đặt cốc rỗng rồi TARE: hiển thị 0; thêm 20 g mẫu: hiển thị khoảng 20 g.
- [ ] **OL3D-EQP-BAL-0001-T03:** Nhấc vật: số đo trở lại zero phù hợp.
- [ ] **OL3D-EQP-BAL-0001-T04:** Vượt GHĐ: chuyển OVERLOAD và không khóa số đo bình thường.
- [ ] **OL3D-EQP-BAL-0001-T05:** Tạo gió/nhiễu theo biến môi trường: số đo dao động hoặc không ổn định theo FMEA.

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

## 4.1. [OL3D-EQP-BAL-0001] Cân điện tử hiện số 500 g
**Tên tiếng Anh**: *Precision Electronic Balance 500 g* | **Mã Archetype**: `electronic-balance` | **Phân loại danh mục**: `mass-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-BAL-0001`
* **Mã đường dẫn (Slug)**: `can-dien-tu-hien-so-500g`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `partially-verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-BAL-0001_can-dien-tu-hien-so-500g` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · OIML Class II

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 200 mm, Cao = 85 mm, Sâu = 240 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.2 m, Cao (Y) = 0.085 m, Sâu (Z) = 0.24 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `tare_button_3d`, `weighing_pan`, `pan_plate`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshPhysicalMaterial`, `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: ExtrudeGeometry with Bevel; Torus Chamfered Edge Reflectors; State Sync via userData; Optical Ray Tracing & Refraction
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `ExtrudeGeometry (Bevel)` | MeshPhysicalMaterial (White ABS, roughness 0.25) | 1 | Thân vỏ OHAUS Scout chống hóa chất |
| `weighing_pan` | `CylinderGeometry + Torus` | MeshPhysicalMaterial (SUS304 Inox, metalness 0.94) | 2 | Mâm cân Inox lún 2.2mm khi chịu lực |
| `scale_display` | `PlaneGeometry (Offset)` | MeshBasicMaterial (CanvasTexture LED) | 3 | Màn hình LCD 7 đoạn nghiêng 20° |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `weighObject`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **1450 g** (Trạng thái: `reported`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `mass`
  - Giới hạn đo (GHĐ): **0 g** đến **500 g**
  - Độ chia nhỏ nhất (ĐCNN): **0.01 g**
  - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad m_{net} = \max\left(0, m_{gross} - m_{tare}\right)$$
  *Ý nghĩa vật lý*: Số chỉ khối lượng tịnh sau khi trừ bì (TARE Offset).
  $$\mathbf{(2)}\quad m(t) = m_{final} \cdot \left(1 - e^{-t / \tau}\right) + \epsilon_{Gauss}(0, \sigma^2)$$
  *Ý nghĩa vật lý*: Động học đáp ứng cảm biến Loadcell và nhiễu vi chấn động không khí ($\tau \approx 0.35\text{ s}$, $\sigma = 0.005\text{ g}$).
  $$\mathbf{(3)}\quad m_{thermal} = m_0 \cdot \left[1 + \alpha_{loadcell} \cdot (T_{air} - 25^\circ\text{C})\right]$$
  *Ý nghĩa vật lý*: Hiệu ứng trôi nhiệt độ độ nhạy cảm biến biến dạng ($\alpha_{loadcell} \approx 1.5 \times 10^{-5}\,\text{K}^{-1}$).
* **Các tính năng khoa học tích hợp**:
  - Cảm biến lực biến dạng (Loadcell) độ nhạy 0.01 g, thời gian ổn định kết quả ≤ 2 giây.
  - Chức năng trừ bì (Phím TARE/ZERO) đưa màn hình về 0.00 g khi đặt cốc chứa chất lỏng.
  - Đĩa cân thép không gỉ SUS304 tháo rời vệ sinh được, có chân ren chỉnh thăng bằng và bọt thủy.
  - Hiển thị trực tiếp số gam trên màn hình LCD 3D và tự động khóa số đo khi vật đứng yên.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE_ZERO`
* **Danh sách trạng thái khả dụng**: `IDLE_ZERO`, `WEIGHING_SETTLING`, `STABLE_LOCKED`, `OVERLOAD_ERROR`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE_ZERO` | `WEIGHING_SETTLING` | Object placed on pan | `m_gross > 0.05 g` |
| `WEIGHING_SETTLING` | `STABLE_LOCKED` | Settling timer elapsed | `|dm/dt| < 0.01 g/s for 1.2s` |
| `WEIGHING_SETTLING` | `OVERLOAD_ERROR` | Load exceeds capacity | `m_gross > 550.0 g` |
| `STABLE_LOCKED` | `IDLE_ZERO` | TARE button pressed | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.02 g (OIML Class II)
* **Độ chia nhỏ nhất / Độ phân giải**: 0.01 g (Màn hình 2 số lẻ)
* **Độ lặp lại phép đo**: 0.01 g (Độ lệch chuẩn lặp lại s <= 0.01g)
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: ±0.005 g / 10°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Số đo trôi dạt liên tục (Drifting)** | Luồng gió phòng v_air > 0.5 m/s thổi lên đĩa cân | Cân không chốt số STABLE_LOCKED | `Cờ isDraftInterference = true` | Bật hộp chắn gió hoặc giảm tốc độ quạt phòng v_air = 0 m/s |
| **Báo lỗi quá tải OVERLOAD_ERR** | Đặt tải trọng vượt quá GHĐ 500g | Màn hình nhấp nháy [ - - - - ] | `Loadcell strain > 105% FS` | Nhấc bớt vật nặng khỏi đĩa cân về bàn |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Danh mục thiết bị dạy học tối thiểu KHTN THCS: Cân điện tử hiện số, độ chính xác 0.01g – 0.1g, có chức năng trừ bì. |
| **Thiết bị Giáo dục VietValue** | `vietvalue.edu.vn` | Cân kỹ thuật phòng thí nghiệm THCS: Đĩa cân Ø 120–130 mm Inox, màn hình LCD xanh ngọc, phím TARE/MODE/ON-OFF. |
| **Thiết bị Điện tử & Đo lường Việt Nam** | `thietbidientu.net.vn` | Kích thước máy chuẩn 190 × 240 × 75 mm, nguồn DC 6V/Pin AA, sai số lặp lại ±0.02 g. |
| **DMKLab — Thiết bị Phòng thí nghiệm** | `dmklab.vn` | Cân kỹ thuật 2 số lẻ (0.01 g): Tích hợp chống quá tải cơ học và tự động hiệu chuẩn ngoại bằng quả cân chuẩn. |
| **Innotec Việt Nam — Thiết bị Dạy học** | `innotec.com.vn` | Cân điện tử thực hành KHTN: Vỏ nhựa ABS chống hóa chất, mặt hiển thị nghiêng 25° giúp học sinh dễ đọc góc nhìn thẳng. |

---
