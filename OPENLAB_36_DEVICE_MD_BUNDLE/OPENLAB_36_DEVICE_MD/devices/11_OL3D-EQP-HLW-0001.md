# 11. Ống trụ kim loại rỗng có khoang kín

**Device ID:** `OL3D-EQP-HLW-0001`  
**Nhóm chức năng đề xuất:** `G02/G04`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `hollow-cylinder`  
**Slug:** `vat-ran-rong-co-khoang-ben-trong`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `in-review` | Đo lường: `not-verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Dụng cụ Đo lường nâng cao · Phân biệt Thể tích đặc & Thể tích khoang rỗng ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 36 mm, Cao = 55 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.036 m, Cao (Y) = 0.055 m, Sâu (Z) = 0.036 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial` * **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `CylinderGeometry (Hollow Path)` | MeshPhysicalMaterial (Alloy Steel, metalness 0.90) | 1 | Ống trụ rỗng hai đầu hở xuyên tâm | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **148 g** (Trạng thái: `illustrative`) - Thể tích chuẩn ($V_{ref}$): **55.98 cm³** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad V_{đặc} = \pi \cdot \left(R^2 - r^2\right) \cdot h = \pi \cdot \left[(1.6)^2 - (0.9)^2\right] \cdot 4.5 \approx 24.74\text{ cm}^3$$ *Ý nghĩa vật lý*: Thể tích phần kim loại đặc chiếm chỗ nước. $$\mathbf{(2)}\quad V_{bao} = \pi \cdot R^2 \cdot h = \pi \cdot (1.6)^2 \cdot 4.5 \approx 36.19\text{ cm}^3$$ *Ý nghĩa vật lý*: Thể tích hình học bao ngoài toàn phần. $$\mathbf{(3)}\quad V_{rỗng} = V_{bao} - V_{đặc} = \pi \cdot r^2 \cdot h \approx 11.45\text{ cm}^3$$ *Ý nghĩa vật lý*: Thể tích khoang rỗng bên trong ống trụ. * **Các tính năng khoa học tích hợp**: - Ống trụ kim loại có lỗ thông xuyên tâm giúp rèn luyện kỹ năng dùng cả 3 bộ phận của thước cặp (mỏ ngoài D, mỏ trong d, thanh chiều sâu h). - Giúp học sinh phân biệt rõ thể tích bao ngoài toàn phần và thể tích phần kim loại đặc thực sự chiếm chỗ nước (V = π(R² - r²)h). - Rèn kỹ năng nghiêng thoát hết bọt khí trong lòng ống khi nhúng vào ống đong hoặc bình tràn. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `IDLE` * **Danh sách trạng thái khả dụng**: `IDLE`, `MEASURING_INTERNAL_JAWS`, `WEIGHING`, `SUBMERGED_BUBBLES_TRAPPED`, `SUBMERGED_PURGED` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `IDLE` | `SUBMERGED_BUBBLES_TRAPPED` | Submerged vertically | `air trapped inside` | | `SUBMERGED_BUBBLES_TRAPPED` | `SUBMERGED_PURGED` | Tilted 45° under water | `bubbles released` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±0.03 mm * **Độ chia nhỏ nhất / Độ phân giải**: 0.02 mm thước cặp * **Độ lặp lại phép đo**: ±0.05 g * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Khí đọng trong khoang rỗng làm nổi hoặc sai thể tích** | Thả trụ thẳng đứng làm bọt khí bị nhốt trong khoang rỗng | Nước dâng trong ống đong bị thiếu $11.5\text{ ml}$ | `V_measured < V_true` | Nghiêng ống trụ $45^\circ$ dưới mặt nước để bọt khí thoát hoàn toàn | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Mitutoyo Việt Nam — Ứng dụng Đo đường kính trong** | `mitutoyo.vn` | Sử dụng mỏ đo trong (Inside Jaws) của thước cặp 150 mm để đo chính xác đường kính lòng ống trụ rỗng. | | **Thư viện Vật lý Việt Nam** | `thuvienvatly.com` | Bài toán thực hành nâng cao: Xác định khối lượng riêng của vật rắn có khoang rỗng và kiểm tra tính đặc/rỗng. | | **VinaTools Việt Nam** | `vinatools.com` | Quy chuẩn đo chi tiết dạng ống trụ: Kết hợp đo đường kính ngoài D, đường kính lỗ d và chiều dài h. | | **VietValue — Thiết bị Thực hành** | `vietvalue.edu.vn` | Mẫu trụ rỗng hợp kim dùng cho bài tập thực nghiệm kiểm tra mật độ vật liệu. | | **DMKLab Việt Nam** | `dmklab.vn` | Hướng dẫn khử bọt khí bám trong khoang rỗng khi đo thể tích bằng phương pháp dâng nước. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Mẫu ống kim loại rỗng có khoang kín để khảo sát thể tích bao, thể tích phần kim loại và thể tích rỗng.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 36 mm, Cao = 55 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.036 m, Cao (Y) = 0.055 m, Sâu (Z) = 0.036 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `IDLE`, `MEASURING_INTERNAL_JAWS`, `WEIGHING`, `SUBMERGED_BUBBLES_TRAPPED`, `SUBMERGED_PURGED`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body | Ống kim loại | Nhấc, xoay, cân và đưa vào dụng cụ đo thể tích theo cách được phép. | Tư thế thay đổi; khoang rỗng được giữ nguyên hình học. |
| measurement_anchor | Điểm đo | Đo đường kính ngoài, đường kính trong/độ dày và chiều cao nếu tiếp cận được. | Tính riêng V bao, V phần vật liệu và V khoang rỗng. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Quan sát và xác định đây là ống rỗng/khoang kín.
2. Đo kích thước hình học ngoài và trong theo khả năng tiếp cận.
3. Cân khối lượng.
4. Tính V kim loại và V khoang.
5. Chỉ dùng phương pháp dời chỗ phù hợp với cấu tạo kín và điều kiện không lọt nước.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Tính V đặc = π(R²−r²)h, V bao = πR²h, V rỗng = πr²h theo dữ liệu hình học nguồn.
- Không nhầm thể tích bao ngoài với thể tích phần kim loại chiếm chỗ.
- Nếu khoang kín không cho nước vào, thể tích dời chỗ theo vật chìm là thể tích bao ngoài.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V_{đặc} = \pi \cdot \left(R^2 - r^2\right) \cdot h = \pi \cdot \left[(1.6)^2 - (0.9)^2\right] \cdot 4.5 \approx 24.74\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích phần kim loại đặc chiếm chỗ nước.
  $$\mathbf{(2)}\quad V_{bao} = \pi \cdot R^2 \cdot h = \pi \cdot (1.6)^2 \cdot 4.5 \approx 36.19\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích hình học bao ngoài toàn phần.
  $$\mathbf{(3)}\quad V_{rỗng} = V_{bao} - V_{đặc} = \pi \cdot r^2 \cdot h \approx 11.45\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích khoang rỗng bên trong ống trụ.
* **Các tính năng khoa học tích hợp**:
  - Ống trụ kim loại có lỗ thông xuyên tâm giúp rèn luyện kỹ năng dùng cả 3 bộ phận của thước cặp (mỏ ngoài D, mỏ trong d, thanh chiều sâu h).
  - Giúp học sinh phân biệt rõ thể tích bao ngoài toàn phần và thể tích phần kim loại đặc thực sự chiếm chỗ nước (V = π(R² - r²)h).
  - Rèn kỹ năng nghiêng thoát hết bọt khí trong lòng ống khi nhúng vào ống đong hoặc bình tràn.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE`
* **Danh sách trạng thái khả dụng**: `IDLE`, `MEASURING_INTERNAL_JAWS`, `WEIGHING`, `SUBMERGED_BUBBLES_TRAPPED`, `SUBMERGED_PURGED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE` | `SUBMERGED_BUBBLES_TRAPPED` | Submerged vertically | `air trapped inside` |
| `SUBMERGED_BUBBLES_TRAPPED` | `SUBMERGED_PURGED` | Tilted 45° under water | `bubbles released` |

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
| **Khí đọng trong khoang rỗng làm nổi hoặc sai thể tích** | Thả trụ thẳng đứng làm bọt khí bị nhốt trong khoang rỗng | Nước dâng trong ống đong bị thiếu $11.5\text{ ml}$ | `V_measured < V_true` | Nghiêng ống trụ $45^\circ$ dưới mặt nước để bọt khí thoát hoàn toàn |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-HLW-0001-T01:** Tính ba thể tích, kiểm tra V bao = V đặc + V rỗng.
- [ ] **OL3D-EQP-HLW-0001-T02:** Cân mẫu và tính khối lượng riêng vật liệu bằng V đặc.
- [ ] **OL3D-EQP-HLW-0001-T03:** Nhúng vật kín: độ dời chỗ phải theo thể tích bao ngoài.

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

## 4.11. [OL3D-EQP-HLW-0001] Ống trụ kim loại rỗng có khoang kín
**Tên tiếng Anh**: *Hollow Metallic Cylinder with Internal Cavity* | **Mã Archetype**: `hollow-cylinder` | **Phân loại danh mục**: `hollow-specimens`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-HLW-0001`
* **Mã đường dẫn (Slug)**: `vat-ran-rong-co-khoang-ben-trong`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `in-review` | Đo lường: `not-verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Dụng cụ Đo lường nâng cao · Phân biệt Thể tích đặc & Thể tích khoang rỗng

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 36 mm, Cao = 55 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.036 m, Cao (Y) = 0.055 m, Sâu (Z) = 0.036 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Hollow Path)` | MeshPhysicalMaterial (Alloy Steel, metalness 0.90) | 1 | Ống trụ rỗng hai đầu hở xuyên tâm |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **148 g** (Trạng thái: `illustrative`)
  - Thể tích chuẩn ($V_{ref}$): **55.98 cm³**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V_{đặc} = \pi \cdot \left(R^2 - r^2\right) \cdot h = \pi \cdot \left[(1.6)^2 - (0.9)^2\right] \cdot 4.5 \approx 24.74\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích phần kim loại đặc chiếm chỗ nước.
  $$\mathbf{(2)}\quad V_{bao} = \pi \cdot R^2 \cdot h = \pi \cdot (1.6)^2 \cdot 4.5 \approx 36.19\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích hình học bao ngoài toàn phần.
  $$\mathbf{(3)}\quad V_{rỗng} = V_{bao} - V_{đặc} = \pi \cdot r^2 \cdot h \approx 11.45\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích khoang rỗng bên trong ống trụ.
* **Các tính năng khoa học tích hợp**:
  - Ống trụ kim loại có lỗ thông xuyên tâm giúp rèn luyện kỹ năng dùng cả 3 bộ phận của thước cặp (mỏ ngoài D, mỏ trong d, thanh chiều sâu h).
  - Giúp học sinh phân biệt rõ thể tích bao ngoài toàn phần và thể tích phần kim loại đặc thực sự chiếm chỗ nước (V = π(R² - r²)h).
  - Rèn kỹ năng nghiêng thoát hết bọt khí trong lòng ống khi nhúng vào ống đong hoặc bình tràn.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE`
* **Danh sách trạng thái khả dụng**: `IDLE`, `MEASURING_INTERNAL_JAWS`, `WEIGHING`, `SUBMERGED_BUBBLES_TRAPPED`, `SUBMERGED_PURGED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE` | `SUBMERGED_BUBBLES_TRAPPED` | Submerged vertically | `air trapped inside` |
| `SUBMERGED_BUBBLES_TRAPPED` | `SUBMERGED_PURGED` | Tilted 45° under water | `bubbles released` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.03 mm
* **Độ chia nhỏ nhất / Độ phân giải**: 0.02 mm thước cặp
* **Độ lặp lại phép đo**: ±0.05 g
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Khí đọng trong khoang rỗng làm nổi hoặc sai thể tích** | Thả trụ thẳng đứng làm bọt khí bị nhốt trong khoang rỗng | Nước dâng trong ống đong bị thiếu $11.5\text{ ml}$ | `V_measured < V_true` | Nghiêng ống trụ $45^\circ$ dưới mặt nước để bọt khí thoát hoàn toàn |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Mitutoyo Việt Nam — Ứng dụng Đo đường kính trong** | `mitutoyo.vn` | Sử dụng mỏ đo trong (Inside Jaws) của thước cặp 150 mm để đo chính xác đường kính lòng ống trụ rỗng. |
| **Thư viện Vật lý Việt Nam** | `thuvienvatly.com` | Bài toán thực hành nâng cao: Xác định khối lượng riêng của vật rắn có khoang rỗng và kiểm tra tính đặc/rỗng. |
| **VinaTools Việt Nam** | `vinatools.com` | Quy chuẩn đo chi tiết dạng ống trụ: Kết hợp đo đường kính ngoài D, đường kính lỗ d và chiều dài h. |
| **VietValue — Thiết bị Thực hành** | `vietvalue.edu.vn` | Mẫu trụ rỗng hợp kim dùng cho bài tập thực nghiệm kiểm tra mật độ vật liệu. |
| **DMKLab Việt Nam** | `dmklab.vn` | Hướng dẫn khử bọt khí bám trong khoang rỗng khi đo thể tích bằng phương pháp dâng nước. |

---
