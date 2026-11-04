# 05. Lực kế lò xo ống trụ 5 N

**Device ID:** `OL3D-EQP-DYN-0001`  
**Nhóm chức năng đề xuất:** `G02`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `spring-dynamometer`  
**Slug:** `luc-ke-lo-xo-5n`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `not-verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-DYN-0001_luc-ke-lo-xo-5n` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Chương I KHTN 9 (Bài 2, 3) ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 28 mm, Cao = 230 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.036 m, Cao (Y) = 0.23 m, Sâu (Z) = 0.036 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `scale_marks`, `scale_marks_cross`, `spring_coil`, `plunger` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `CylinderGeometry (Clear Acrylic)` | MeshPhysicalMaterial (Acrylic, IOR 1.49) | 3 | Vỏ ống trụ bảo vệ trong suốt nhìn rõ lò xo | | `spring_coil` | `TubeGeometry (Helix Curve)` | MeshPhysicalMaterial (Spring Steel, metalness 0.95) | 4 | Lò xo xoắn ốc co giãn thực tế theo tải trọng | | `plunger` | `Cylinder + Torus Hook` | MeshStandardMaterial (Red Indicator) | 4 | Trục kéo kèm đĩa chỉ thị đỏ và móc treo đáy | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `measureForce`, `readScale` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **65 g** (Trạng thái: `illustrative`) * **Thông số metrology thiết bị đo**: - Đại lượng đo: `force` - Giới hạn đo (GHĐ): **0 N** đến **5 N** - Độ chia nhỏ nhất (ĐCNN): **0.1 N** - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad F = k \cdot \Delta x = m \cdot g$$ *Ý nghĩa vật lý*: Định luật Hooke cho lò xo đàn hồi tuyến tính ($k = 25.0\text{ N/m}$, độ giãn cực đại $\Delta x_{max} = 200\text{ mm}$ tại $5.0\text{ N}$). $$\mathbf{(2)}\quad m_{hiển\,thị} = \frac{F}{g} \times 1000\,(\text{g})$$ *Ý nghĩa vật lý*: Vạch chia kép quy đổi tương đương trọng lượng sang khối lượng. $$\mathbf{(3)}\quad A = F \cdot s \cdot \cos\alpha$$ *Ý nghĩa vật lý*: Công cơ học khi dùng lực kế kéo vật trượt trên mặt phẳng nghiêng góc $\alpha$. * **Các tính năng khoa học tích hợp**: - Thân ống nhựa Acrylic trong suốt giúp quan sát trực tiếp độ giãn của lò xo thép theo định luật Hooke. - Vạch chia kép hiển thị đồng thời đơn vị lực Newton (N) và khối lượng quy đổi (gam). - Núm chỉnh điểm 0 (Zero-adjust) ở đỉnh ống cho phép hiệu chuẩn vạch chỉ thị về đúng 0.0 N trước khi đo. - Dùng đo trọng lượng P, lực kéo trên mặt phẳng nghiêng và tính công cơ học A = F·s trong Chương I KHTN 9. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `UNLOADED_ZERO` * **Danh sách trạng thái khả dụng**: `UNLOADED_ZERO`, `STRETCHING`, `OSCILLATING`, `EQUILIBRIUM`, `OVERSTRETCHED` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `UNLOADED_ZERO` | `STRETCHING` | Load applied to bottom hook | `F > 0` | | `STRETCHING` | `EQUILIBRIUM` | Damping settles | `|v_plunger| < 0.001 m/s` | | `STRETCHING` | `OVERSTRETCHED` | Force exceeds limit | `F > 5.5 N` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±0.1 N (±2% toàn thang đo) * **Độ chia nhỏ nhất / Độ phân giải**: 0.1 N (0.05 N ước lượng) * **Độ lặp lại phép đo**: ±0.05 N * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Giãn nở nhiệt lò xo thép: 1.2 × 10⁻⁵ K⁻¹ ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Lệch điểm 0 ban đầu** | Lò xo bị dão nhẹ sau thời gian dài sử dụng | Số đo lực bị cộng sai số hệ thống | `F_no_load != 0.0 N` | Vặn núm ốc Zero-Adjust ở đỉnh ống đưa đĩa chỉ thị về đúng vạch 0 | | **Biến dạng dẻo vĩnh viễn (Plastic Deformation)** | Treo tải trọng > 6N vượt giới hạn đàn hồi Hooke | Lò xo mất tính đàn hồi tuyến tính | `F_applied > 6.0 N` | Báo lỗi quá tải và thay thế cụm lò xo mới | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **HKM Tech — Thiết bị Đo lường Lực** | `hkmtech.com` | Lực kế lò xo 5N ống tròn trong suốt: GHĐ 5N, ĐCNN 0.1N, chiều dài tổng 210 mm, đường kính ống Ø 21–22 mm. | | **VietValue — Dụng cụ Thí nghiệm Vật lí** | `vietvalue.edu.vn` | Bộ lực kế lò xo 1N – 2.5N – 5N dùng trong trường THCS: Có ốc hiệu chỉnh vạch 0 và móc treo thép mạ crôm. | | **Innotec Việt Nam** | `innotec.com.vn` | Lực kế 5N chuẩn Thông tư 38/2021/TT-BGDĐT phục vụ thí nghiệm Công và Công suất, Cơ năng KHTN 9. | | **DMKLab Việt Nam** | `dmklab.vn` | Lực kế ống trụ nhựa trong suốt: Sai số toàn thang ≤ ±2%, lò xo thép đàn hồi đã xử lý nhiệt chống mỏi. | | **Vật tư Bách Khoa (VattuBK)** | `vattubk.com` | Cấu tạo lực kế lò xo thực hành: Khuyên cầm tay phía trên, đĩa chỉ thị màu đỏ nổi bật và móc treo phía dưới. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Đo lực/trọng lượng bằng biến dạng đàn hồi của lò xo.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 28 mm, Cao = 230 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.036 m, Cao (Y) = 0.23 m, Sâu (Z) = 0.036 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `scale_marks`, `scale_marks_cross`, `spring_coil`, `plunger`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`, `measureForce`, `readScale`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `UNLOADED_ZERO`, `STRETCHING`, `OSCILLATING`, `EQUILIBRIUM`, `OVERSTRETCHED`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| plunger / spring_coil | Móc treo và lò xo | Kéo móc hoặc treo vật vào móc; chỉ tác động dọc trục. | Lò xo giãn theo lực; kim/con trượt và số đọc thay đổi. |
| scale_marks / scale_marks_cross | Thang đo | Đọc giá trị N và thang quy đổi khối lượng nếu có. | Vị trí chỉ thị phải tỷ lệ với độ giãn. |
| zero adjustment | Điều chỉnh điểm 0 (nếu node có) | Hiệu chỉnh khi không tải theo thiết kế. | Vạch 0 được căn chỉnh; không tự thay đổi hằng số đàn hồi. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Treo lực kế thẳng đứng và kiểm tra điểm 0.
2. Móc vật vào đầu móc.
3. Chờ dao động lò xo giảm.
4. Đọc lực theo thang N.
5. Không kéo quá GHĐ; tháo tải sau khi đo.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Độ giãn Δx tỷ lệ với lực F theo định luật Hooke trong miền đàn hồi.
- Tải làm lò xo dao động rồi ổn định.
- Quá tải hoặc vượt hành trình phải cảnh báo và chặn biến dạng phi thực tế.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad F = k \cdot \Delta x = m \cdot g$$
  *Ý nghĩa vật lý*: Định luật Hooke cho lò xo đàn hồi tuyến tính ($k = 25.0\text{ N/m}$, độ giãn cực đại $\Delta x_{max} = 200\text{ mm}$ tại $5.0\text{ N}$).
  $$\mathbf{(2)}\quad m_{hiển\,thị} = \frac{F}{g} \times 1000\,(\text{g})$$
  *Ý nghĩa vật lý*: Vạch chia kép quy đổi tương đương trọng lượng sang khối lượng.
  $$\mathbf{(3)}\quad A = F \cdot s \cdot \cos\alpha$$
  *Ý nghĩa vật lý*: Công cơ học khi dùng lực kế kéo vật trượt trên mặt phẳng nghiêng góc $\alpha$.
* **Các tính năng khoa học tích hợp**:
  - Thân ống nhựa Acrylic trong suốt giúp quan sát trực tiếp độ giãn của lò xo thép theo định luật Hooke.
  - Vạch chia kép hiển thị đồng thời đơn vị lực Newton (N) và khối lượng quy đổi (gam).
  - Núm chỉnh điểm 0 (Zero-adjust) ở đỉnh ống cho phép hiệu chuẩn vạch chỉ thị về đúng 0.0 N trước khi đo.
  - Dùng đo trọng lượng P, lực kéo trên mặt phẳng nghiêng và tính công cơ học A = F·s trong Chương I KHTN 9.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `UNLOADED_ZERO`
* **Danh sách trạng thái khả dụng**: `UNLOADED_ZERO`, `STRETCHING`, `OSCILLATING`, `EQUILIBRIUM`, `OVERSTRETCHED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `UNLOADED_ZERO` | `STRETCHING` | Load applied to bottom hook | `F > 0` |
| `STRETCHING` | `EQUILIBRIUM` | Damping settles | `|v_plunger| < 0.001 m/s` |
| `STRETCHING` | `OVERSTRETCHED` | Force exceeds limit | `F > 5.5 N` |

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
| **Lệch điểm 0 ban đầu** | Lò xo bị dão nhẹ sau thời gian dài sử dụng | Số đo lực bị cộng sai số hệ thống | `F_no_load != 0.0 N` | Vặn núm ốc Zero-Adjust ở đỉnh ống đưa đĩa chỉ thị về đúng vạch 0 |
| **Biến dạng dẻo vĩnh viễn (Plastic Deformation)** | Treo tải trọng > 6N vượt giới hạn đàn hồi Hooke | Lò xo mất tính đàn hồi tuyến tính | `F_applied > 6.0 N` | Báo lỗi quá tải và thay thế cụm lò xo mới |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-DYN-0001-T01:** Treo các tải đã biết: F xấp xỉ mg.
- [ ] **OL3D-EQP-DYN-0001-T02:** Tăng tải: độ giãn tăng tuyến tính trong miền hợp lệ.
- [ ] **OL3D-EQP-DYN-0001-T03:** Bỏ tải: lò xo trở về gần điểm 0.
- [ ] **OL3D-EQP-DYN-0001-T04:** Vượt GHĐ: cảnh báo quá tải, không cho lò xo kéo dài vô hạn.

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

## 4.5. [OL3D-EQP-DYN-0001] Lực kế lò xo ống trụ 5 N
**Tên tiếng Anh**: *5 N Tubular Spring Dynamometer* | **Mã Archetype**: `spring-dynamometer` | **Phân loại danh mục**: `force-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-DYN-0001`
* **Mã đường dẫn (Slug)**: `luc-ke-lo-xo-5n`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-DYN-0001_luc-ke-lo-xo-5n` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Chương I KHTN 9 (Bài 2, 3)

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 28 mm, Cao = 230 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.036 m, Cao (Y) = 0.23 m, Sâu (Z) = 0.036 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_marks`, `scale_marks_cross`, `spring_coil`, `plunger`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Clear Acrylic)` | MeshPhysicalMaterial (Acrylic, IOR 1.49) | 3 | Vỏ ống trụ bảo vệ trong suốt nhìn rõ lò xo |
| `spring_coil` | `TubeGeometry (Helix Curve)` | MeshPhysicalMaterial (Spring Steel, metalness 0.95) | 4 | Lò xo xoắn ốc co giãn thực tế theo tải trọng |
| `plunger` | `Cylinder + Torus Hook` | MeshStandardMaterial (Red Indicator) | 4 | Trục kéo kèm đĩa chỉ thị đỏ và móc treo đáy |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `measureForce`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **65 g** (Trạng thái: `illustrative`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `force`
  - Giới hạn đo (GHĐ): **0 N** đến **5 N**
  - Độ chia nhỏ nhất (ĐCNN): **0.1 N**
  - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad F = k \cdot \Delta x = m \cdot g$$
  *Ý nghĩa vật lý*: Định luật Hooke cho lò xo đàn hồi tuyến tính ($k = 25.0\text{ N/m}$, độ giãn cực đại $\Delta x_{max} = 200\text{ mm}$ tại $5.0\text{ N}$).
  $$\mathbf{(2)}\quad m_{hiển\,thị} = \frac{F}{g} \times 1000\,(\text{g})$$
  *Ý nghĩa vật lý*: Vạch chia kép quy đổi tương đương trọng lượng sang khối lượng.
  $$\mathbf{(3)}\quad A = F \cdot s \cdot \cos\alpha$$
  *Ý nghĩa vật lý*: Công cơ học khi dùng lực kế kéo vật trượt trên mặt phẳng nghiêng góc $\alpha$.
* **Các tính năng khoa học tích hợp**:
  - Thân ống nhựa Acrylic trong suốt giúp quan sát trực tiếp độ giãn của lò xo thép theo định luật Hooke.
  - Vạch chia kép hiển thị đồng thời đơn vị lực Newton (N) và khối lượng quy đổi (gam).
  - Núm chỉnh điểm 0 (Zero-adjust) ở đỉnh ống cho phép hiệu chuẩn vạch chỉ thị về đúng 0.0 N trước khi đo.
  - Dùng đo trọng lượng P, lực kéo trên mặt phẳng nghiêng và tính công cơ học A = F·s trong Chương I KHTN 9.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `UNLOADED_ZERO`
* **Danh sách trạng thái khả dụng**: `UNLOADED_ZERO`, `STRETCHING`, `OSCILLATING`, `EQUILIBRIUM`, `OVERSTRETCHED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `UNLOADED_ZERO` | `STRETCHING` | Load applied to bottom hook | `F > 0` |
| `STRETCHING` | `EQUILIBRIUM` | Damping settles | `|v_plunger| < 0.001 m/s` |
| `STRETCHING` | `OVERSTRETCHED` | Force exceeds limit | `F > 5.5 N` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.1 N (±2% toàn thang đo)
* **Độ chia nhỏ nhất / Độ phân giải**: 0.1 N (0.05 N ước lượng)
* **Độ lặp lại phép đo**: ±0.05 N
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Giãn nở nhiệt lò xo thép: 1.2 × 10⁻⁵ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Lệch điểm 0 ban đầu** | Lò xo bị dão nhẹ sau thời gian dài sử dụng | Số đo lực bị cộng sai số hệ thống | `F_no_load != 0.0 N` | Vặn núm ốc Zero-Adjust ở đỉnh ống đưa đĩa chỉ thị về đúng vạch 0 |
| **Biến dạng dẻo vĩnh viễn (Plastic Deformation)** | Treo tải trọng > 6N vượt giới hạn đàn hồi Hooke | Lò xo mất tính đàn hồi tuyến tính | `F_applied > 6.0 N` | Báo lỗi quá tải và thay thế cụm lò xo mới |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **HKM Tech — Thiết bị Đo lường Lực** | `hkmtech.com` | Lực kế lò xo 5N ống tròn trong suốt: GHĐ 5N, ĐCNN 0.1N, chiều dài tổng 210 mm, đường kính ống Ø 21–22 mm. |
| **VietValue — Dụng cụ Thí nghiệm Vật lí** | `vietvalue.edu.vn` | Bộ lực kế lò xo 1N – 2.5N – 5N dùng trong trường THCS: Có ốc hiệu chỉnh vạch 0 và móc treo thép mạ crôm. |
| **Innotec Việt Nam** | `innotec.com.vn` | Lực kế 5N chuẩn Thông tư 38/2021/TT-BGDĐT phục vụ thí nghiệm Công và Công suất, Cơ năng KHTN 9. |
| **DMKLab Việt Nam** | `dmklab.vn` | Lực kế ống trụ nhựa trong suốt: Sai số toàn thang ≤ ±2%, lò xo thép đàn hồi đã xử lý nhiệt chống mỏi. |
| **Vật tư Bách Khoa (VattuBK)** | `vattubk.com` | Cấu tạo lực kế lò xo thực hành: Khuyên cầm tay phía trên, đĩa chỉ thị màu đỏ nổi bật và móc treo phía dưới. |

---
