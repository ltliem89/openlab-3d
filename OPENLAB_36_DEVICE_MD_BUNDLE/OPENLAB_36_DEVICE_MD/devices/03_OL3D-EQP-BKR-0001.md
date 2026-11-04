# 03. Cốc thủy tinh chia độ 250 ml

**Device ID:** `OL3D-EQP-BKR-0001`  
**Nhóm chức năng đề xuất:** `G04/G05`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `beaker-250`  
**Slug:** `coc-thuy-tinh-250ml`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `not-verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-BKR-0001_coc-thuy-tinh-250ml` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: ISO 3819 · DIN 12331 (Griffin Low-Form) · Thông tư 38/2021 ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 70 mm, Cao = 98 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.075 m, Cao (Y) = 0.098 m, Sâu (Z) = 0.075 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `pouring_lip`, `scale_marks`, `liquid_surface`, `liquid_body` * **Các lớp vật liệu Three.js sử dụng**: `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `CylinderGeometry (Low form)` | MeshPhysicalMaterial (Borosilicate, IOR 1.48) | 4 | Cốc Griffin Low-form đường kính 70mm | | `pouring_lip` | `ShapeGeometry Extrude` | MeshPhysicalMaterial (Glass) | 4 | Mỏ rót vát góc chống tràn chất lỏng | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `readScale` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **96 g** (Trạng thái: `illustrative`) - Dung tích định mức ($V_{max}$): **250 ml** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad Q = m \cdot c \cdot \Delta T = P_{heat} \cdot t \cdot \eta_{thermal}$$ *Ý nghĩa vật lý*: Phương trình truyền nhiệt khi đun nóng dung dịch trong cốc bằng đèn cồn ($eta \approx 65\%$). $$\mathbf{(2)}\quad m_{tổng} = m_{vỏ\,cốc} + V_{lỏng} \cdot \rho_{lỏng}$$ *Ý nghĩa vật lý*: Khối lượng tổng cộng khi đặt cốc chứa chất lỏng lên cân điện tử ($m_{vỏ} = 95.0\text{ g}$). * **Các tính năng khoa học tích hợp**: - Cốc đốt thủy tinh Borosilicate 3.3 dạng thấp thành (Griffin Low-Form), chịu sốc nhiệt tới ΔT = 160 °C. - Đáy phẳng tiếp xúc đều với lưới tản nhiệt khi đun trên đèn cồn hoặc đặt trên đĩa cân điện tử. - Mỏ rót định hình chuẩn giúp nghiêng rót chất lỏng sang ống đong không bị chảy lem dọc thành ngoài. - Vạch chia dung tích định hướng và vùng nhãn mờ để ghi ký hiệu hóa chất. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `EMPTY` * **Danh sách trạng thái khả dụng**: `EMPTY`, `FILLED`, `HEATING`, `BOILING`, `POURING` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `EMPTY` | `FILLED` | Liquid added | `liquidLevelMl > 0` | | `FILLED` | `HEATING` | Burner flame applied | `T_liquid > T_ambient` | | `HEATING` | `BOILING` | Temperature reaches boiling point | `T_liquid >= 100.0 C` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±5% dung tích định hướng (DIN 12331) * **Độ chia nhỏ nhất / Độ phân giải**: 25 ml (Vạch chia thô 50..200 ml) * **Độ lặp lại phép đo**: ±5 ml * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Khả năng chịu sốc nhiệt ΔT = 160°C ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Sôi trào bọt khí (Bumping)** | Đun sôi chất lỏng không có đá bọt điều hòa sôi | Dung dịch bắn tung tóe ra ngoài cốc | `dT/dt > 15°C/s khi T > 95°C` | Thêm bi thủy tinh / đá bọt và giảm công suất đèn cồn | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Cốc thủy tinh 250ml chịu nhiệt, có vạch chia và mỏ rót thuộc danh mục dụng cụ thủy tinh dùng chung môn KHTN. | | **VietChem — Dụng cụ Thủy tinh Duran** | `vietchem.com.vn` | Cốc đốt 250ml Low-form (ISO 3819): Đường kính ngoài Ø 70 mm, chiều cao 95–98 mm, thủy tinh Borosilicate 3.3. | | **Eisco Labs Scientific Catalog** | `eiscolabs.com` | 250ml Borosilicate Glass Beaker, Low Form with Spout: OD 70 mm, Height 97 mm, 25 ml graduations. | | **Foxx Life Sciences Glassware** | `foxxlifesciences.com` | Griffin Beaker 250 mL: Uniform wall thickness for thermal shock resistance on wire gauze. | | **Visitech Việt Nam** | `visitech.vn` | Cốc thủy tinh 250 ml dùng pha chế dung dịch, hứng dịch lọc từ phễu chiết và hứng nước từ bình tràn. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Chứa, pha, rót và quan sát mức chất lỏng; dùng trong thực hành định lượng gần đúng và gia nhiệt khi phù hợp.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 70 mm, Cao = 98 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.075 m, Cao (Y) = 0.098 m, Sâu (Z) = 0.075 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `pouring_lip`, `scale_marks`, `liquid_surface`, `liquid_body`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`, `readScale`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `EMPTY`, `FILLED`, `HEATING`, `BOILING`, `POURING`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body | Thân cốc | Chọn, nâng, kéo và xoay cốc; đặt lên bàn hoặc cân. | Vị trí thay đổi; khi đặt lên cân, khối lượng cốc và chất lỏng được cộng. |
| liquid_body / liquid_surface | Chất lỏng | Rót vào/ra từ nguồn hoặc dụng cụ khác; điều chỉnh lượng rót theo thao tác. | Mực chất lỏng, mặt khum, thể tích và khối lượng cập nhật. |
| scale_marks | Vạch chia | Đọc thể tích ở vị trí ngang tầm mắt. | Hiển thị số đọc gần đúng theo vạch; không coi cốc chia độ là dụng cụ định mức chính xác. |
| pouring_lip | Mỏ rót | Nghiêng cốc để rót. | Dòng chảy, tia chất lỏng và thể tích còn lại thay đổi. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt cốc trên mặt bàn ổn định.
2. Rót chất lỏng vào cốc.
3. Đọc thể tích gần đúng tại mặt khum.
4. Rót sang dụng cụ khác nếu cần.
5. Kết nối với nguồn nhiệt chỉ trong cấu hình thí nghiệm phù hợp và có kiểm soát an toàn.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Mực chất lỏng thay đổi theo lượng rót.
- Khi cân cốc, khối lượng tổng gồm vỏ cốc và chất lỏng.
- Khi gia nhiệt, nhiệt độ thay đổi theo công suất, thời gian, khối lượng và nhiệt dung; chỉ bật mô hình nhiệt khi có bộ gia nhiệt được kết nối.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad Q = m \cdot c \cdot \Delta T = P_{heat} \cdot t \cdot \eta_{thermal}$$
  *Ý nghĩa vật lý*: Phương trình truyền nhiệt khi đun nóng dung dịch trong cốc bằng đèn cồn ($eta \approx 65\%$).
  $$\mathbf{(2)}\quad m_{tổng} = m_{vỏ\,cốc} + V_{lỏng} \cdot \rho_{lỏng}$$
  *Ý nghĩa vật lý*: Khối lượng tổng cộng khi đặt cốc chứa chất lỏng lên cân điện tử ($m_{vỏ} = 95.0\text{ g}$).
* **Các tính năng khoa học tích hợp**:
  - Cốc đốt thủy tinh Borosilicate 3.3 dạng thấp thành (Griffin Low-Form), chịu sốc nhiệt tới ΔT = 160 °C.
  - Đáy phẳng tiếp xúc đều với lưới tản nhiệt khi đun trên đèn cồn hoặc đặt trên đĩa cân điện tử.
  - Mỏ rót định hình chuẩn giúp nghiêng rót chất lỏng sang ống đong không bị chảy lem dọc thành ngoài.
  - Vạch chia dung tích định hướng và vùng nhãn mờ để ghi ký hiệu hóa chất.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY`
* **Danh sách trạng thái khả dụng**: `EMPTY`, `FILLED`, `HEATING`, `BOILING`, `POURING`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY` | `FILLED` | Liquid added | `liquidLevelMl > 0` |
| `FILLED` | `HEATING` | Burner flame applied | `T_liquid > T_ambient` |
| `HEATING` | `BOILING` | Temperature reaches boiling point | `T_liquid >= 100.0 C` |

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
| **Sôi trào bọt khí (Bumping)** | Đun sôi chất lỏng không có đá bọt điều hòa sôi | Dung dịch bắn tung tóe ra ngoài cốc | `dT/dt > 15°C/s khi T > 95°C` | Thêm bi thủy tinh / đá bọt và giảm công suất đèn cồn |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-BKR-0001-T01:** Rót thêm chất lỏng: liquid level tăng đúng tỷ lệ.
- [ ] **OL3D-EQP-BKR-0001-T02:** Nghiêng cốc: dòng chảy xuất hiện, lượng trong cốc giảm.
- [ ] **OL3D-EQP-BKR-0001-T03:** Đặt cốc có chất lỏng lên cân: khối lượng tổng thay đổi.
- [ ] **OL3D-EQP-BKR-0001-T04:** Nếu bật mô hình gia nhiệt, nhiệt độ tăng theo năng lượng cấp; không tăng khi chưa có nguồn nhiệt.

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

## 4.3. [OL3D-EQP-BKR-0001] Cốc thủy tinh chia độ 250 ml
**Tên tiếng Anh**: *250 ml Low-Form Glass Beaker* | **Mã Archetype**: `beaker-250` | **Phân loại danh mục**: `laboratory-glassware`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-BKR-0001`
* **Mã đường dẫn (Slug)**: `coc-thuy-tinh-250ml`
* **Môn học áp dụng**: `chemistry`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-BKR-0001_coc-thuy-tinh-250ml` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: ISO 3819 · DIN 12331 (Griffin Low-Form) · Thông tư 38/2021

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 70 mm, Cao = 98 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.075 m, Cao (Y) = 0.098 m, Sâu (Z) = 0.075 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `pouring_lip`, `scale_marks`, `liquid_surface`, `liquid_body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Low form)` | MeshPhysicalMaterial (Borosilicate, IOR 1.48) | 4 | Cốc Griffin Low-form đường kính 70mm |
| `pouring_lip` | `ShapeGeometry Extrude` | MeshPhysicalMaterial (Glass) | 4 | Mỏ rót vát góc chống tràn chất lỏng |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **96 g** (Trạng thái: `illustrative`)
  - Dung tích định mức ($V_{max}$): **250 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad Q = m \cdot c \cdot \Delta T = P_{heat} \cdot t \cdot \eta_{thermal}$$
  *Ý nghĩa vật lý*: Phương trình truyền nhiệt khi đun nóng dung dịch trong cốc bằng đèn cồn ($eta \approx 65\%$).
  $$\mathbf{(2)}\quad m_{tổng} = m_{vỏ\,cốc} + V_{lỏng} \cdot \rho_{lỏng}$$
  *Ý nghĩa vật lý*: Khối lượng tổng cộng khi đặt cốc chứa chất lỏng lên cân điện tử ($m_{vỏ} = 95.0\text{ g}$).
* **Các tính năng khoa học tích hợp**:
  - Cốc đốt thủy tinh Borosilicate 3.3 dạng thấp thành (Griffin Low-Form), chịu sốc nhiệt tới ΔT = 160 °C.
  - Đáy phẳng tiếp xúc đều với lưới tản nhiệt khi đun trên đèn cồn hoặc đặt trên đĩa cân điện tử.
  - Mỏ rót định hình chuẩn giúp nghiêng rót chất lỏng sang ống đong không bị chảy lem dọc thành ngoài.
  - Vạch chia dung tích định hướng và vùng nhãn mờ để ghi ký hiệu hóa chất.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY`
* **Danh sách trạng thái khả dụng**: `EMPTY`, `FILLED`, `HEATING`, `BOILING`, `POURING`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY` | `FILLED` | Liquid added | `liquidLevelMl > 0` |
| `FILLED` | `HEATING` | Burner flame applied | `T_liquid > T_ambient` |
| `HEATING` | `BOILING` | Temperature reaches boiling point | `T_liquid >= 100.0 C` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±5% dung tích định hướng (DIN 12331)
* **Độ chia nhỏ nhất / Độ phân giải**: 25 ml (Vạch chia thô 50..200 ml)
* **Độ lặp lại phép đo**: ±5 ml
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Khả năng chịu sốc nhiệt ΔT = 160°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Sôi trào bọt khí (Bumping)** | Đun sôi chất lỏng không có đá bọt điều hòa sôi | Dung dịch bắn tung tóe ra ngoài cốc | `dT/dt > 15°C/s khi T > 95°C` | Thêm bi thủy tinh / đá bọt và giảm công suất đèn cồn |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Cốc thủy tinh 250ml chịu nhiệt, có vạch chia và mỏ rót thuộc danh mục dụng cụ thủy tinh dùng chung môn KHTN. |
| **VietChem — Dụng cụ Thủy tinh Duran** | `vietchem.com.vn` | Cốc đốt 250ml Low-form (ISO 3819): Đường kính ngoài Ø 70 mm, chiều cao 95–98 mm, thủy tinh Borosilicate 3.3. |
| **Eisco Labs Scientific Catalog** | `eiscolabs.com` | 250ml Borosilicate Glass Beaker, Low Form with Spout: OD 70 mm, Height 97 mm, 25 ml graduations. |
| **Foxx Life Sciences Glassware** | `foxxlifesciences.com` | Griffin Beaker 250 mL: Uniform wall thickness for thermal shock resistance on wire gauze. |
| **Visitech Việt Nam** | `visitech.vn` | Cốc thủy tinh 250 ml dùng pha chế dung dịch, hứng dịch lọc từ phễu chiết và hứng nước từ bình tràn. |

---
