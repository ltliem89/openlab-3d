# 12. Bình tam giác Erlenmeyer 250 ml

**Device ID:** `OL3D-EQP-FLK-0001`  
**Nhóm chức năng đề xuất:** `G04/G05`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `erlenmeyer-flask`  
**Slug:** `binh-tam-giac-erlenmeyer-250ml`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `not-verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-FLK-0001_binh-tam-giac-erlenmeyer-250ml` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: ISO 1773 · DIN 12380 · Thông tư 38/2021 (Hình 1.10 SGK KHTN 9) ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 85 mm, Cao = 140 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.085 m, Cao (Y) = 0.14 m, Sâu (Z) = 0.085 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `pouring_lip`, `liquid_surface`, `liquid_body` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial` * **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `LatheGeometry (Cone shape)` | MeshPhysicalMaterial (Borosilicate, transmission 0.88) | 4 | Bình nón Erlenmeyer cổ hẹp Ø34mm đáy rộng Ø85mm | | `liquid_surface` | `CylinderGeometry (Cone adapted)` | MeshPhysicalMaterial (Liquid, opacity 0.7) | 2 | Khối dung dịch hình nón cụt | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **105 g** (Trạng thái: `reported`) - Dung tích định mức ($V_{max}$): **250 ml** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad A_{evap} = \pi \cdot r_{neck}^2 \ll A_{beaker}$$ *Ý nghĩa vật lý*: Tiết diện cổ hẹp hạn chế tối đa sự bay hơi và bắn tóe hóa chất khi lắc dung dịch. * **Các tính năng khoa học tích hợp**: - Thân hình nón cụt (Erlenmeyer) với cổ hẹp giúp lắc mạnh dung dịch khi hòa tan hoặc chuẩn độ mà không bị sánh bắn ra ngoài. - Làm bằng thủy tinh Borosilicate 3.3 chịu nhiệt, có thể đun trên lưới tản nhiệt hoặc lắp nút cao su có ống dẫn khí. - Trong Hình 1.10 SGK KHTN 9 (Bài 24), bình tam giác được đặt ở đầu ra ống sinh hàn để hứng chất lỏng tinh khiết sau khi ngưng tụ. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `EMPTY` * **Danh sách trạng thái khả dụng**: `EMPTY`, `FILLED_REAGENT`, `SWIRLING`, `CONDENSATE_COLLECTING` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `EMPTY` | `FILLED_REAGENT` | Liquid added | `V > 0` | | `FILLED_REAGENT` | `SWIRLING` | Manual orbital swirl | `angular velocity > 2 rad/s` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±5% dung tích định mức (ISO 1773) * **Độ chia nhỏ nhất / Độ phân giải**: 50 ml (Vạch chia thô 50..250 ml) * **Độ lặp lại phép đo**: ±10 ml * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Chịu nhiệt tới 250°C ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Nứt vỡ cổ bình khi kẹp sắt quá chặt** | Vặn vít tay kẹp giá sắt kim loại trực tiếp không có đệm bần/cao su | Nứt vỡ thủy tinh | `Lực kẹp giá sắt > 25 N` | Bắt buộc lót đệm cao su chịu nhiệt quanh cổ bình trước khi siết vít | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **DMKLab — Bình tam giác Thủy tinh 250ml** | `dmklab.vn` | Bình tam giác cổ hẹp 250ml (ISO 1773): Đường kính đáy Ø 85 mm, chiều cao 140–145 mm, đường kính cổ Ø 34 mm. | | **VinaMTSC — Dụng cụ Thủy tinh Thí nghiệm** | `vinamtsc.com` | Bình nón Erlenmeyer 250ml Borosilicate 3.3: Chịu nhiệt độ cao, vạch chia men trắng rõ nét 50–250 ml. | | **TechLab Việt Nam** | `techlab.com.vn` | Ứng dụng bình tam giác trong bộ chưng cất đơn giản và phản ứng hóa học hữu cơ lớp 9. | | **Visitech Việt Nam** | `visitech.vn` | Thiết kế thành nghiêng hạn chế bay hơi và chống văng dung dịch axit/kiềm khi lắc trộn. | | **Vật tư Lab Hà Nội** | `vattulabhanoi.com` | Bình tam giác 250ml chuẩn phòng thí nghiệm trường phổ thông theo Thông tư 38/2021/TT-BGDĐT. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Chứa, trộn và rót dung dịch; cổ hẹp hạn chế bay hơi và bắn tóe.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 85 mm, Cao = 140 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.085 m, Cao (Y) = 0.14 m, Sâu (Z) = 0.085 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `pouring_lip`, `liquid_surface`, `liquid_body`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `EMPTY`, `FILLED_REAGENT`, `SWIRLING`, `CONDENSATE_COLLECTING`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body | Bình Erlenmeyer | Nhấc, đặt, xoay và lắc nhẹ theo thao tác thực hành. | Chất lỏng chuyển động trong bình; không làm tràn khi mức thấp và lắc trong giới hạn. |
| liquid_body / liquid_surface | Dung dịch | Rót chất lỏng vào/ra; cập nhật thể tích và mực chất lỏng. | Mặt chất lỏng nghiêng/dao động khi bình chuyển động rồi ổn định. |
| pouring_lip | Miệng bình | Nghiêng để rót sang dụng cụ nhận. | Dòng rót xuất hiện; phần dung dịch trong bình giảm. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt bình trên mặt phẳng ổn định.
2. Rót dung dịch vào bình, không vượt dung tích an toàn.
3. Lắc xoay nhẹ để trộn nếu bài thực hành yêu cầu.
4. Để bình ổn định và rót sang dụng cụ khác khi cần.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Thể tích và khối lượng dung dịch được bảo toàn khi chuyển bình, trừ bay hơi/tràn mô phỏng có chủ đích.
- Miệng cổ hẹp hạn chế bắn tóe; không tự tạo phản ứng hóa học nếu chưa khai báo thành phần.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad A_{evap} = \pi \cdot r_{neck}^2 \ll A_{beaker}$$
  *Ý nghĩa vật lý*: Tiết diện cổ hẹp hạn chế tối đa sự bay hơi và bắn tóe hóa chất khi lắc dung dịch.
* **Các tính năng khoa học tích hợp**:
  - Thân hình nón cụt (Erlenmeyer) với cổ hẹp giúp lắc mạnh dung dịch khi hòa tan hoặc chuẩn độ mà không bị sánh bắn ra ngoài.
  - Làm bằng thủy tinh Borosilicate 3.3 chịu nhiệt, có thể đun trên lưới tản nhiệt hoặc lắp nút cao su có ống dẫn khí.
  - Trong Hình 1.10 SGK KHTN 9 (Bài 24), bình tam giác được đặt ở đầu ra ống sinh hàn để hứng chất lỏng tinh khiết sau khi ngưng tụ.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY`
* **Danh sách trạng thái khả dụng**: `EMPTY`, `FILLED_REAGENT`, `SWIRLING`, `CONDENSATE_COLLECTING`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY` | `FILLED_REAGENT` | Liquid added | `V > 0` |
| `FILLED_REAGENT` | `SWIRLING` | Manual orbital swirl | `angular velocity > 2 rad/s` |

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
| **Nứt vỡ cổ bình khi kẹp sắt quá chặt** | Vặn vít tay kẹp giá sắt kim loại trực tiếp không có đệm bần/cao su | Nứt vỡ thủy tinh | `Lực kẹp giá sắt > 25 N` | Bắt buộc lót đệm cao su chịu nhiệt quanh cổ bình trước khi siết vít |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-FLK-0001-T01:** Rót dung dịch: mức chất lỏng và lượng nhận được cập nhật.
- [ ] **OL3D-EQP-FLK-0001-T02:** Lắc bình: bề mặt chất lỏng dao động rồi ổn định.
- [ ] **OL3D-EQP-FLK-0001-T03:** Không vượt dung tích quy định; tràn phải phát hiện nếu mô hình có ngưỡng.

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

## 4.12. [OL3D-EQP-FLK-0001] Bình tam giác Erlenmeyer 250 ml
**Tên tiếng Anh**: *250 ml Erlenmeyer Conical Flask* | **Mã Archetype**: `erlenmeyer-flask` | **Phân loại danh mục**: `laboratory-glassware`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-FLK-0001`
* **Mã đường dẫn (Slug)**: `binh-tam-giac-erlenmeyer-250ml`
* **Môn học áp dụng**: `chemistry`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-FLK-0001_binh-tam-giac-erlenmeyer-250ml` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: ISO 1773 · DIN 12380 · Thông tư 38/2021 (Hình 1.10 SGK KHTN 9)

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 85 mm, Cao = 140 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.085 m, Cao (Y) = 0.14 m, Sâu (Z) = 0.085 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `pouring_lip`, `liquid_surface`, `liquid_body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `LatheGeometry (Cone shape)` | MeshPhysicalMaterial (Borosilicate, transmission 0.88) | 4 | Bình nón Erlenmeyer cổ hẹp Ø34mm đáy rộng Ø85mm |
| `liquid_surface` | `CylinderGeometry (Cone adapted)` | MeshPhysicalMaterial (Liquid, opacity 0.7) | 2 | Khối dung dịch hình nón cụt |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **105 g** (Trạng thái: `reported`)
  - Dung tích định mức ($V_{max}$): **250 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad A_{evap} = \pi \cdot r_{neck}^2 \ll A_{beaker}$$
  *Ý nghĩa vật lý*: Tiết diện cổ hẹp hạn chế tối đa sự bay hơi và bắn tóe hóa chất khi lắc dung dịch.
* **Các tính năng khoa học tích hợp**:
  - Thân hình nón cụt (Erlenmeyer) với cổ hẹp giúp lắc mạnh dung dịch khi hòa tan hoặc chuẩn độ mà không bị sánh bắn ra ngoài.
  - Làm bằng thủy tinh Borosilicate 3.3 chịu nhiệt, có thể đun trên lưới tản nhiệt hoặc lắp nút cao su có ống dẫn khí.
  - Trong Hình 1.10 SGK KHTN 9 (Bài 24), bình tam giác được đặt ở đầu ra ống sinh hàn để hứng chất lỏng tinh khiết sau khi ngưng tụ.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY`
* **Danh sách trạng thái khả dụng**: `EMPTY`, `FILLED_REAGENT`, `SWIRLING`, `CONDENSATE_COLLECTING`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY` | `FILLED_REAGENT` | Liquid added | `V > 0` |
| `FILLED_REAGENT` | `SWIRLING` | Manual orbital swirl | `angular velocity > 2 rad/s` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±5% dung tích định mức (ISO 1773)
* **Độ chia nhỏ nhất / Độ phân giải**: 50 ml (Vạch chia thô 50..250 ml)
* **Độ lặp lại phép đo**: ±10 ml
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Chịu nhiệt tới 250°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Nứt vỡ cổ bình khi kẹp sắt quá chặt** | Vặn vít tay kẹp giá sắt kim loại trực tiếp không có đệm bần/cao su | Nứt vỡ thủy tinh | `Lực kẹp giá sắt > 25 N` | Bắt buộc lót đệm cao su chịu nhiệt quanh cổ bình trước khi siết vít |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **DMKLab — Bình tam giác Thủy tinh 250ml** | `dmklab.vn` | Bình tam giác cổ hẹp 250ml (ISO 1773): Đường kính đáy Ø 85 mm, chiều cao 140–145 mm, đường kính cổ Ø 34 mm. |
| **VinaMTSC — Dụng cụ Thủy tinh Thí nghiệm** | `vinamtsc.com` | Bình nón Erlenmeyer 250ml Borosilicate 3.3: Chịu nhiệt độ cao, vạch chia men trắng rõ nét 50–250 ml. |
| **TechLab Việt Nam** | `techlab.com.vn` | Ứng dụng bình tam giác trong bộ chưng cất đơn giản và phản ứng hóa học hữu cơ lớp 9. |
| **Visitech Việt Nam** | `visitech.vn` | Thiết kế thành nghiêng hạn chế bay hơi và chống văng dung dịch axit/kiềm khi lắc trộn. |
| **Vật tư Lab Hà Nội** | `vattulabhanoi.com` | Bình tam giác 250ml chuẩn phòng thí nghiệm trường phổ thông theo Thông tư 38/2021/TT-BGDĐT. |

---
