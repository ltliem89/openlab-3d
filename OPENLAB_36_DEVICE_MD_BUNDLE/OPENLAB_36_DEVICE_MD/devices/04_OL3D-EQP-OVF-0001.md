# 04. Bình tràn Eureka 250 ml

**Device ID:** `OL3D-EQP-OVF-0001`  
**Nhóm chức năng đề xuất:** `G02/G04`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `overflow-can`  
**Slug:** `binh-tran-eureka-250ml`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `not-verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Thiết bị Cơ học Archimedes ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 78 mm, Cao = 135 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.115 m, Cao (Y) = 0.135 m, Sâu (Z) = 0.08 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `scale_marks`, `spout_water`, `liquid_surface`, `liquid_body`, `spout_stream`, `stream_outer`, `stream_core`, `measurement_anchor` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `CylinderGeometry` | MeshPhysicalMaterial (Transparent Acrylic) | 4 | Bình trụ trong suốt đường kính 85mm | | `spout_water` | `CylinderGeometry (Tilted 30°)` | MeshPhysicalMaterial (Water stream) | 3 | Dòng nước trong lòng vòi nghiêng xả ra ngoài | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `displacementVolume` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **112 g** (Trạng thái: `illustrative`) - Dung tích định mức ($V_{max}$): **250 ml** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad V_{tràn} = \max\left(0, V_{ban\,đầu} + V_{chiếm\,chỗ} - V_{ngưỡng}\right)$$ *Ý nghĩa vật lý*: Thể tích nước tràn qua vòi nghiêng khi vật rắn chìm vào lòng bình ($V_{ngưỡng} = 210.0\text{ ml}$). $$\mathbf{(2)}\quad v_{spout} = \sqrt{2 \cdot g \cdot h_{crest}}$$ *Ý nghĩa vật lý*: Tốc độ dòng xả tại cổ vòi tràn theo định luật Torricelli. * **Các tính năng khoa học tích hợp**: - Thân hình trụ đứng trong suốt giúp quan sát trực tiếp vật rắn chìm hoàn toàn trong lòng chất lỏng. - Vòi dẫn nước tràn gắn nghiêng 30° ở phần trên thân bình giúp dòng nước chảy gọn vào cốc hứng. - Ứng dụng nguyên lý Archimedes: Thể tích nước tràn qua vòi sang cốc hứng bằng đúng thể tích vật rắn chiếm chỗ. - Dùng cho các vật rắn có kích thước lớn hơn đường kính miệng ống đong 100 ml. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `UNFILLED` * **Danh sách trạng thái khả dụng**: `UNFILLED`, `PRIMED_TO_BRIM`, `OVERFLOWING_ACTIVE`, `DRAINED_TO_BRIM` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `UNFILLED` | `PRIMED_TO_BRIM` | Water filled to spout neck | `V == 210.0 ml` | | `PRIMED_TO_BRIM` | `OVERFLOWING_ACTIVE` | Object submerged | `V_submerged > 0` | | `OVERFLOWING_ACTIVE` | `DRAINED_TO_BRIM` | Overflow stream finished | `V_spout == 0` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±1.0 ml thể tích tràn (phụ thuộc góc đặt bình và bám dính giọt) * **Độ chia nhỏ nhất / Độ phân giải**: 1.0 ml (kết hợp ống đong hứng) * **Độ lặp lại phép đo**: ±0.8 ml * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Nước chưa tới ngưỡng vòi đã thả vật** | Mực nước ban đầu < 210 ml | Thể tích nước hứng được nhỏ hơn thể tích thực của vật | `V_initial < 210.0 ml` | Bắt buộc đổ nước đầy tràn vòi trước khi tiến hành thí nghiệm Archimedes | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **VietValue — Thiết bị Dạy học Tối thiểu** | `vietvalue.edu.vn` | Bình tràn thí nghiệm Vật lí THCS: Dung tích 250–300 ml, thân trụ trong suốt có vòi thoát nước nghiêng chống bám giọt. | | **Innotec Việt Nam** | `innotec.com.vn` | Bình tràn đo thể tích vật rắn và lực đẩy Archimedes: Đường kính Ø 85 mm, chiều cao 150–160 mm. | | **Thư viện Vật lý Việt Nam** | `thuvienvatly.com` | Quy trình đo khối lượng riêng bằng bình tràn: Đổ nước đầy tới miệng vòi tràn trước khi thả chìm vật nặng. | | **VinaMTSC — Công ty Thiết bị Khoa học Kỹ thuật** | `vinamtsc.com` | Bình tràn thủy tinh Borosilicate có vòi: Thành dày 2 mm, miệng bo tròn, vòi nghiêng dài 35–40 mm. | | **DMKLab — Dụng cụ Thí nghiệm Trường học** | `dmklab.vn` | Bình tràn kết hợp cốc hứng và ống đong 100 ml trong bộ thực hành đo khối lượng riêng KHTN. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Đo thể tích vật rắn không thấm nước bằng lượng chất lỏng tràn ra khi nhúng vật.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 78 mm, Cao = 135 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.115 m, Cao (Y) = 0.135 m, Sâu (Z) = 0.08 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `scale_marks`, `spout_water`, `liquid_surface`, `liquid_body`, `spout_stream`, `stream_outer`, `stream_core`, `measurement_anchor`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`, `displacementVolume`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `UNFILLED`, `PRIMED_TO_BRIM`, `OVERFLOWING_ACTIVE`, `DRAINED_TO_BRIM`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body | Thân bình tràn | Đặt đứng, cố định trên bàn; rót nước đến cao độ mép vòi tràn. | Mực nước dừng ở ngưỡng vòi tràn trước khi nhúng vật. |
| liquid_surface / liquid_body | Nước trong bình | Rót đến ngưỡng tràn và chờ dòng tràn hết. | Mặt nước ổn định tại cao độ miệng vòi. |
| spout_water / spout_stream | Vòi và dòng tràn | Đặt cốc/ống đong hứng dưới vòi; nhúng vật vào bình. | Nước tràn qua vòi; thể tích nước thu được bằng thể tích phần vật chìm. |
| measurement_anchor / scale_marks | Điểm đo / vạch (nếu có) | Đọc hoặc lấy mẫu lượng nước thu được ở dụng cụ hứng. | Kết quả đo liên kết lượng nước tràn, không đo trực tiếp bằng cách scale hình ảnh. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt bình ổn định và đưa mực nước tới mép vòi.
2. Chờ nước dư chảy hết.
3. Đặt dụng cụ hứng đúng dưới vòi.
4. Nhúng vật rắn hoàn toàn, tránh bắn tóe.
5. Đo thể tích nước tràn trong dụng cụ hứng.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Nước tràn phát sinh khi thể tích chiếm chỗ vượt ngưỡng bình.
- Dòng chảy phụ thuộc cột áp theo mô hình trong hồ sơ.
- Nếu không có dụng cụ hứng, cảnh báo nước tràn không được thu hồi.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V_{tràn} = \max\left(0, V_{ban\,đầu} + V_{chiếm\,chỗ} - V_{ngưỡng}\right)$$
  *Ý nghĩa vật lý*: Thể tích nước tràn qua vòi nghiêng khi vật rắn chìm vào lòng bình ($V_{ngưỡng} = 210.0\text{ ml}$).
  $$\mathbf{(2)}\quad v_{spout} = \sqrt{2 \cdot g \cdot h_{crest}}$$
  *Ý nghĩa vật lý*: Tốc độ dòng xả tại cổ vòi tràn theo định luật Torricelli.
* **Các tính năng khoa học tích hợp**:
  - Thân hình trụ đứng trong suốt giúp quan sát trực tiếp vật rắn chìm hoàn toàn trong lòng chất lỏng.
  - Vòi dẫn nước tràn gắn nghiêng 30° ở phần trên thân bình giúp dòng nước chảy gọn vào cốc hứng.
  - Ứng dụng nguyên lý Archimedes: Thể tích nước tràn qua vòi sang cốc hứng bằng đúng thể tích vật rắn chiếm chỗ.
  - Dùng cho các vật rắn có kích thước lớn hơn đường kính miệng ống đong 100 ml.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `UNFILLED`
* **Danh sách trạng thái khả dụng**: `UNFILLED`, `PRIMED_TO_BRIM`, `OVERFLOWING_ACTIVE`, `DRAINED_TO_BRIM`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `UNFILLED` | `PRIMED_TO_BRIM` | Water filled to spout neck | `V == 210.0 ml` |
| `PRIMED_TO_BRIM` | `OVERFLOWING_ACTIVE` | Object submerged | `V_submerged > 0` |
| `OVERFLOWING_ACTIVE` | `DRAINED_TO_BRIM` | Overflow stream finished | `V_spout == 0` |

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
| **Nước chưa tới ngưỡng vòi đã thả vật** | Mực nước ban đầu < 210 ml | Thể tích nước hứng được nhỏ hơn thể tích thực của vật | `V_initial < 210.0 ml` | Bắt buộc đổ nước đầy tràn vòi trước khi tiến hành thí nghiệm Archimedes |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-OVF-0001-T01:** Đưa nước đến ngưỡng: dòng tràn ngừng sau ổn định.
- [ ] **OL3D-EQP-OVF-0001-T02:** Nhúng vật: thể tích tràn bằng thể tích phần chìm.
- [ ] **OL3D-EQP-OVF-0001-T03:** Không đặt dụng cụ hứng: phát cảnh báo.
- [ ] **OL3D-EQP-OVF-0001-T04:** Nhúng vật một phần: chỉ thể tích phần chìm gây tràn.

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

## 4.4. [OL3D-EQP-OVF-0001] Bình tràn Eureka 250 ml
**Tên tiếng Anh**: *Eureka Overflow Can 250 ml* | **Mã Archetype**: `overflow-can` | **Phân loại danh mục**: `volume-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-OVF-0001`
* **Mã đường dẫn (Slug)**: `binh-tran-eureka-250ml`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Thiết bị Cơ học Archimedes

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 78 mm, Cao = 135 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.115 m, Cao (Y) = 0.135 m, Sâu (Z) = 0.08 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_marks`, `spout_water`, `liquid_surface`, `liquid_body`, `spout_stream`, `stream_outer`, `stream_core`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry` | MeshPhysicalMaterial (Transparent Acrylic) | 4 | Bình trụ trong suốt đường kính 85mm |
| `spout_water` | `CylinderGeometry (Tilted 30°)` | MeshPhysicalMaterial (Water stream) | 3 | Dòng nước trong lòng vòi nghiêng xả ra ngoài |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `displacementVolume`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **112 g** (Trạng thái: `illustrative`)
  - Dung tích định mức ($V_{max}$): **250 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V_{tràn} = \max\left(0, V_{ban\,đầu} + V_{chiếm\,chỗ} - V_{ngưỡng}\right)$$
  *Ý nghĩa vật lý*: Thể tích nước tràn qua vòi nghiêng khi vật rắn chìm vào lòng bình ($V_{ngưỡng} = 210.0\text{ ml}$).
  $$\mathbf{(2)}\quad v_{spout} = \sqrt{2 \cdot g \cdot h_{crest}}$$
  *Ý nghĩa vật lý*: Tốc độ dòng xả tại cổ vòi tràn theo định luật Torricelli.
* **Các tính năng khoa học tích hợp**:
  - Thân hình trụ đứng trong suốt giúp quan sát trực tiếp vật rắn chìm hoàn toàn trong lòng chất lỏng.
  - Vòi dẫn nước tràn gắn nghiêng 30° ở phần trên thân bình giúp dòng nước chảy gọn vào cốc hứng.
  - Ứng dụng nguyên lý Archimedes: Thể tích nước tràn qua vòi sang cốc hứng bằng đúng thể tích vật rắn chiếm chỗ.
  - Dùng cho các vật rắn có kích thước lớn hơn đường kính miệng ống đong 100 ml.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `UNFILLED`
* **Danh sách trạng thái khả dụng**: `UNFILLED`, `PRIMED_TO_BRIM`, `OVERFLOWING_ACTIVE`, `DRAINED_TO_BRIM`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `UNFILLED` | `PRIMED_TO_BRIM` | Water filled to spout neck | `V == 210.0 ml` |
| `PRIMED_TO_BRIM` | `OVERFLOWING_ACTIVE` | Object submerged | `V_submerged > 0` |
| `OVERFLOWING_ACTIVE` | `DRAINED_TO_BRIM` | Overflow stream finished | `V_spout == 0` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±1.0 ml thể tích tràn (phụ thuộc góc đặt bình và bám dính giọt)
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0 ml (kết hợp ống đong hứng)
* **Độ lặp lại phép đo**: ±0.8 ml
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Nước chưa tới ngưỡng vòi đã thả vật** | Mực nước ban đầu < 210 ml | Thể tích nước hứng được nhỏ hơn thể tích thực của vật | `V_initial < 210.0 ml` | Bắt buộc đổ nước đầy tràn vòi trước khi tiến hành thí nghiệm Archimedes |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietValue — Thiết bị Dạy học Tối thiểu** | `vietvalue.edu.vn` | Bình tràn thí nghiệm Vật lí THCS: Dung tích 250–300 ml, thân trụ trong suốt có vòi thoát nước nghiêng chống bám giọt. |
| **Innotec Việt Nam** | `innotec.com.vn` | Bình tràn đo thể tích vật rắn và lực đẩy Archimedes: Đường kính Ø 85 mm, chiều cao 150–160 mm. |
| **Thư viện Vật lý Việt Nam** | `thuvienvatly.com` | Quy trình đo khối lượng riêng bằng bình tràn: Đổ nước đầy tới miệng vòi tràn trước khi thả chìm vật nặng. |
| **VinaMTSC — Công ty Thiết bị Khoa học Kỹ thuật** | `vinamtsc.com` | Bình tràn thủy tinh Borosilicate có vòi: Thành dày 2 mm, miệng bo tròn, vòi nghiêng dài 35–40 mm. |
| **DMKLab — Dụng cụ Thí nghiệm Trường học** | `dmklab.vn` | Bình tràn kết hợp cốc hứng và ống đong 100 ml trong bộ thực hành đo khối lượng riêng KHTN. |

---
