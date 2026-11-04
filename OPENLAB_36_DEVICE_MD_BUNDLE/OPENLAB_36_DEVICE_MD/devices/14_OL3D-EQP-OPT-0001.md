# 14. (3) Thấu kính trên đế trượt quang học (f = +10 cm)

**Device ID:** `OL3D-EQP-OPT-0001`  
**Nhóm chức năng đề xuất:** `G06`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `optical-lens`  
**Slug:** `thau-kinh-hoi-tu-f100mm`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-OPT-0001_thau-kinh-hoi-tu-f100mm` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.3 trang 6 & Bài 8, 9 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính (trang 40–45) & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ (trang 46–49) * **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (3): Thấu kính có giá đỡ trượt trên giá quang học (**) * **Chức năng chuẩn**: Khúc xạ chùm tia sáng từ vật sáng hình chữ F (2) để tạo ảnh thật ngược chiều trên màn chắn (4) khi d > f, hoặc tạo ảnh ảo cùng chiều khi d < f / thấu kính phân kì. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 70 mm, Cao = 145 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.045 m, Cao (Y) = 0.145 m, Sâu (Z) = 0.08 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `scale_display`, `scale_display_rear`, `lens_element`, `measurement_anchor` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; State Sync via userData * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `Box + Cylinder Carriage` | MeshStandardMaterial (Black Anodized ABS) | 2 | Con trượt gá ray quang học và vành giữ Ø60mm | | `lens_element` | `Sphere intersection (Biconvex)` | MeshPhysicalMaterial (BK7 Glass, IOR 1.5168, transmission 0.95) | 4 | Thấu kính thủy tinh 2 mặt lồi mài bóng quang học | | `scale_display` | `PlaneGeometry` | MeshBasicMaterial (CanvasTexture) | 3 | Màn hình số HUD hiển thị tọa độ ray X và trị số f | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `opticalFocus` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **135 g** (Trạng thái: `verified`) - Tiêu cự định danh ($f$): **100 mm** * **Thông số metrology thiết bị đo**: - Đại lượng đo: `focal-length` - Giới hạn đo (GHĐ): **-200 mm** đến **150 mm** - Độ chia nhỏ nhất (ĐCNN): **1 mm** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad \frac{1}{d} + \frac{1}{d'} = \frac{1}{f} \iff d' = \frac{d \cdot f}{d - f}$$ *Ý nghĩa vật lý*: Công thức thấu kính mỏng cho Thấu kính hội tụ ($f = +100\text{ mm} = +10.0\text{ cm}$). $$\mathbf{(2)}\quad k = -\frac{d'}{d} = \frac{\overline{A'B'}}{\overline{AB}}$$ *Ý nghĩa vật lý*: Hệ số phóng đại ảnh (k < 0: ảnh thật ngược chiều; k > 0: ảnh ảo cùng chiều). $$\mathbf{(3)}\quad d = d' = 2f = 20.0\text{ cm} \implies |k| = 1.0$$ *Ý nghĩa vật lý*: Vị trí đối xứng tạo ảnh thật bằng đúng kích thước vật (Phương pháp đo tiêu cự Bài 9 SGK KHTN 9). * **Các tính năng khoa học tích hợp**: - Thấu kính hai mặt lồi (Biconvex) bằng thủy tinh quang học BK7 trong suốt, phần rìa mỏng và phần tâm dày. - Lắp trong vành khung nhựa ABS bảo vệ chống sứt mẻ kèm trụ cắm và đế giữ ổn định trên băng quang học hoặc bàn gỗ. - Khi chiếu chùm 3 tia laser song song vuông góc với mặt thấu kính, chùm tia ló hội tụ đúng tại tiêu điểm chính F cách quang tâm O một khoảng f = 10 cm (Bài 8, 9 SGK KHTN 9). ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `MOUNTED_ON_RAIL` * **Danh sách trạng thái khả dụng**: `MOUNTED_ON_RAIL`, `REAL_IMAGE_PROJECTED`, `VIRTUAL_IMAGE_ZONE`, `PARALLEL_BEAM_FOCUS` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `MOUNTED_ON_RAIL` | `REAL_IMAGE_PROJECTED` | Object distance d > f | `d > 10.0 cm` | | `MOUNTED_ON_RAIL` | `VIRTUAL_IMAGE_ZONE` | Object distance d < f | `d < 10.0 cm` | | `MOUNTED_ON_RAIL` | `PARALLEL_BEAM_FOCUS` | Collimated laser beam input | `isLaserHit == true` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±2.0 mm tiêu cự định danh (DIN 58145) * **Độ chia nhỏ nhất / Độ phân giải**: 1.0 mm trên thước đo ray quang học * **Độ lặp lại phép đo**: ±1.0 mm * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Thủy tinh quang học BK7: dn/dT = 3.0 × 10⁻⁶ K⁻¹ ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Ảnh bị mờ nhòe do cầu sai (Spherical Aberration)** | Chùm sáng tới rìa ngoài thấu kính không hội tụ cùng điểm với chùm trung tâm | Viền chữ F trên màn chắn bị viền tán sắc mờ | `Khẩu độ mở > Ø 40 mm` | Lắp màn chắn lỗ tròn giới hạn chùm tia ở vùng gần trục quang | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Thấu kính hội tụ và thấu kính phân kì trong Bộ thí nghiệm Quang hình học lớp 9: Đường kính Ø 60 mm, tiêu cự f = 100 mm. | | **VietJack — SGK KHTN 9 Bài 8 & Bài 9** | `vietjack.com` | Hình 1.3 trang 6 và Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ bằng phương pháp ảnh thật đối xứng d = d' = 2f. | | **VietValue — Thiết bị Quang học THCS** | `vietvalue.edu.vn` | Thấu kính hội tụ có giá đỡ: Thủy tinh quang học mài nhẵn, tiêu cự chuẩn f = 100 mm ± 2 mm. | | **Innotec Việt Nam** | `innotec.com.vn` | Bộ dụng cụ tìm hiểu tính chất ảnh qua thấu kính gồm nguồn sáng, thấu kính hội tụ f=100mm, màn hứng ảnh và giá quang học. | | **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Khung giữ thấu kính có vạch dấu tâm quang học giúp căn đồng trục với đèn laser và màn chắn. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Thí nghiệm ảnh qua thấu kính hội tụ có tiêu cự +10 cm trên ray quang học.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 70 mm, Cao = 145 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.045 m, Cao (Y) = 0.145 m, Sâu (Z) = 0.08 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `scale_display`, `scale_display_rear`, `lens_element`, `measurement_anchor`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`, `opticalFocus`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `MOUNTED_ON_RAIL`, `REAL_IMAGE_PROJECTED`, `VIRTUAL_IMAGE_ZONE`, `PARALLEL_BEAM_FOCUS`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| lens_element | Phần tử thấu kính | Chỉ tương tác thay đổi vị trí/định hướng theo gá; không bóp méo quang học. | Thấu kính dịch chuyển trên trục quang học. |
| scale_display / scale_display_rear | Thang đọc vị trí | Đọc vị trí x của thấu kính hoặc điểm neo. | Tọa độ được cập nhật theo con trượt và thước. |
| optical carrier / connector | Đế trượt | Kéo dọc ray, khóa tại vị trí mong muốn. | Khoảng cách vật–kính và kính–màn thay đổi. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Căn vật sáng, thấu kính và màn cùng trục quang học.
2. Đo tiêu cự hoặc xác nhận f = +10 cm theo hồ sơ.
3. Di chuyển thấu kính để tạo ảnh rõ trên màn.
4. Đo d và d’; so sánh với công thức thấu kính.
5. Thử vị trí 2f để quan sát ảnh thật ngược chiều, bằng kích thước vật.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Ảnh thật hiện trên màn khi điều kiện hình học cho phép.
- Kích thước và chiều ảnh theo k = −d’/d.
- Khi d gần f, d’ tăng mạnh; không cho ảnh hiện sai phía.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \frac{1}{d} + \frac{1}{d'} = \frac{1}{f} \iff d' = \frac{d \cdot f}{d - f}$$
  *Ý nghĩa vật lý*: Công thức thấu kính mỏng cho Thấu kính hội tụ ($f = +100\text{ mm} = +10.0\text{ cm}$).
  $$\mathbf{(2)}\quad k = -\frac{d'}{d} = \frac{\overline{A'B'}}{\overline{AB}}$$
  *Ý nghĩa vật lý*: Hệ số phóng đại ảnh (k < 0: ảnh thật ngược chiều; k > 0: ảnh ảo cùng chiều).
  $$\mathbf{(3)}\quad d = d' = 2f = 20.0\text{ cm} \implies |k| = 1.0$$
  *Ý nghĩa vật lý*: Vị trí đối xứng tạo ảnh thật bằng đúng kích thước vật (Phương pháp đo tiêu cự Bài 9 SGK KHTN 9).
* **Các tính năng khoa học tích hợp**:
  - Thấu kính hai mặt lồi (Biconvex) bằng thủy tinh quang học BK7 trong suốt, phần rìa mỏng và phần tâm dày.
  - Lắp trong vành khung nhựa ABS bảo vệ chống sứt mẻ kèm trụ cắm và đế giữ ổn định trên băng quang học hoặc bàn gỗ.
  - Khi chiếu chùm 3 tia laser song song vuông góc với mặt thấu kính, chùm tia ló hội tụ đúng tại tiêu điểm chính F cách quang tâm O một khoảng f = 10 cm (Bài 8, 9 SGK KHTN 9).

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `MOUNTED_ON_RAIL`
* **Danh sách trạng thái khả dụng**: `MOUNTED_ON_RAIL`, `REAL_IMAGE_PROJECTED`, `VIRTUAL_IMAGE_ZONE`, `PARALLEL_BEAM_FOCUS`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `MOUNTED_ON_RAIL` | `REAL_IMAGE_PROJECTED` | Object distance d > f | `d > 10.0 cm` |
| `MOUNTED_ON_RAIL` | `VIRTUAL_IMAGE_ZONE` | Object distance d < f | `d < 10.0 cm` |
| `MOUNTED_ON_RAIL` | `PARALLEL_BEAM_FOCUS` | Collimated laser beam input | `isLaserHit == true` |

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
| **Ảnh bị mờ nhòe do cầu sai (Spherical Aberration)** | Chùm sáng tới rìa ngoài thấu kính không hội tụ cùng điểm với chùm trung tâm | Viền chữ F trên màn chắn bị viền tán sắc mờ | `Khẩu độ mở > Ø 40 mm` | Lắp màn chắn lỗ tròn giới hạn chùm tia ở vùng gần trục quang |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-OPT-0001-T01:** Căn trục: không lệch trục giữa vật, kính, màn.
- [ ] **OL3D-EQP-OPT-0001-T02:** Chọn d = 2f: d’ = 2f và |k| = 1.
- [ ] **OL3D-EQP-OPT-0001-T03:** Chọn d > f: ảnh thật ngược chiều trên màn.
- [ ] **OL3D-EQP-OPT-0001-T04:** Đặt d < f: không có ảnh thật hứng trên màn; hướng dẫn ảnh ảo nếu quan sát qua mắt.

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

## 4.14. [OL3D-EQP-OPT-0001] (3) Thấu kính trên đế trượt quang học (f = +10 cm)
**Tên tiếng Anh**: *(3) Optical Lens on Bench Rider Saddle (f = +10 cm)* | **Mã Archetype**: `optical-lens` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-OPT-0001`
* **Mã đường dẫn (Slug)**: `thau-kinh-hoi-tu-f100mm`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-OPT-0001_thau-kinh-hoi-tu-f100mm` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.3 trang 6 & Bài 8, 9 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính (trang 40–45) & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ (trang 46–49)
* **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (3): Thấu kính có giá đỡ trượt trên giá quang học (**)
* **Chức năng chuẩn**: Khúc xạ chùm tia sáng từ vật sáng hình chữ F (2) để tạo ảnh thật ngược chiều trên màn chắn (4) khi d > f, hoặc tạo ảnh ảo cùng chiều khi d < f / thấu kính phân kì.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 70 mm, Cao = 145 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.045 m, Cao (Y) = 0.145 m, Sâu (Z) = 0.08 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `scale_display_rear`, `lens_element`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; State Sync via userData
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Box + Cylinder Carriage` | MeshStandardMaterial (Black Anodized ABS) | 2 | Con trượt gá ray quang học và vành giữ Ø60mm |
| `lens_element` | `Sphere intersection (Biconvex)` | MeshPhysicalMaterial (BK7 Glass, IOR 1.5168, transmission 0.95) | 4 | Thấu kính thủy tinh 2 mặt lồi mài bóng quang học |
| `scale_display` | `PlaneGeometry` | MeshBasicMaterial (CanvasTexture) | 3 | Màn hình số HUD hiển thị tọa độ ray X và trị số f |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **135 g** (Trạng thái: `verified`)
  - Tiêu cự định danh ($f$): **100 mm**
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `focal-length`
  - Giới hạn đo (GHĐ): **-200 mm** đến **150 mm**
  - Độ chia nhỏ nhất (ĐCNN): **1 mm**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \frac{1}{d} + \frac{1}{d'} = \frac{1}{f} \iff d' = \frac{d \cdot f}{d - f}$$
  *Ý nghĩa vật lý*: Công thức thấu kính mỏng cho Thấu kính hội tụ ($f = +100\text{ mm} = +10.0\text{ cm}$).
  $$\mathbf{(2)}\quad k = -\frac{d'}{d} = \frac{\overline{A'B'}}{\overline{AB}}$$
  *Ý nghĩa vật lý*: Hệ số phóng đại ảnh (k < 0: ảnh thật ngược chiều; k > 0: ảnh ảo cùng chiều).
  $$\mathbf{(3)}\quad d = d' = 2f = 20.0\text{ cm} \implies |k| = 1.0$$
  *Ý nghĩa vật lý*: Vị trí đối xứng tạo ảnh thật bằng đúng kích thước vật (Phương pháp đo tiêu cự Bài 9 SGK KHTN 9).
* **Các tính năng khoa học tích hợp**:
  - Thấu kính hai mặt lồi (Biconvex) bằng thủy tinh quang học BK7 trong suốt, phần rìa mỏng và phần tâm dày.
  - Lắp trong vành khung nhựa ABS bảo vệ chống sứt mẻ kèm trụ cắm và đế giữ ổn định trên băng quang học hoặc bàn gỗ.
  - Khi chiếu chùm 3 tia laser song song vuông góc với mặt thấu kính, chùm tia ló hội tụ đúng tại tiêu điểm chính F cách quang tâm O một khoảng f = 10 cm (Bài 8, 9 SGK KHTN 9).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `MOUNTED_ON_RAIL`
* **Danh sách trạng thái khả dụng**: `MOUNTED_ON_RAIL`, `REAL_IMAGE_PROJECTED`, `VIRTUAL_IMAGE_ZONE`, `PARALLEL_BEAM_FOCUS`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `MOUNTED_ON_RAIL` | `REAL_IMAGE_PROJECTED` | Object distance d > f | `d > 10.0 cm` |
| `MOUNTED_ON_RAIL` | `VIRTUAL_IMAGE_ZONE` | Object distance d < f | `d < 10.0 cm` |
| `MOUNTED_ON_RAIL` | `PARALLEL_BEAM_FOCUS` | Collimated laser beam input | `isLaserHit == true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±2.0 mm tiêu cự định danh (DIN 58145)
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0 mm trên thước đo ray quang học
* **Độ lặp lại phép đo**: ±1.0 mm
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Thủy tinh quang học BK7: dn/dT = 3.0 × 10⁻⁶ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Ảnh bị mờ nhòe do cầu sai (Spherical Aberration)** | Chùm sáng tới rìa ngoài thấu kính không hội tụ cùng điểm với chùm trung tâm | Viền chữ F trên màn chắn bị viền tán sắc mờ | `Khẩu độ mở > Ø 40 mm` | Lắp màn chắn lỗ tròn giới hạn chùm tia ở vùng gần trục quang |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Thấu kính hội tụ và thấu kính phân kì trong Bộ thí nghiệm Quang hình học lớp 9: Đường kính Ø 60 mm, tiêu cự f = 100 mm. |
| **VietJack — SGK KHTN 9 Bài 8 & Bài 9** | `vietjack.com` | Hình 1.3 trang 6 và Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ bằng phương pháp ảnh thật đối xứng d = d' = 2f. |
| **VietValue — Thiết bị Quang học THCS** | `vietvalue.edu.vn` | Thấu kính hội tụ có giá đỡ: Thủy tinh quang học mài nhẵn, tiêu cự chuẩn f = 100 mm ± 2 mm. |
| **Innotec Việt Nam** | `innotec.com.vn` | Bộ dụng cụ tìm hiểu tính chất ảnh qua thấu kính gồm nguồn sáng, thấu kính hội tụ f=100mm, màn hứng ảnh và giá quang học. |
| **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Khung giữ thấu kính có vạch dấu tâm quang học giúp căn đồng trục với đèn laser và màn chắn. |

---
