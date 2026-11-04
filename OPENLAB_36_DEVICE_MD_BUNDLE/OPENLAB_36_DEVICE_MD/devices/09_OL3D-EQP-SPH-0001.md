# 09. Vật rắn hình cầu thép không gỉ

**Device ID:** `OL3D-EQP-SPH-0001`  
**Nhóm chức năng đề xuất:** `G02/G01`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `solid-sphere`  
**Slug:** `vat-ran-hinh-cau-thep`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `not-verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Chương I KHTN 9 (Bài 2: Động năng, Thế năng) ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 28 mm, Cao = 28 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.028 m, Cao (Y) = 0.028 m, Sâu (Z) = 0.028 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial` * **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `SphereGeometry (Segments 64x64)` | MeshPhysicalMaterial (Chrome Steel, metalness 0.96, roughness 0.06) | 1 | Bi cầu thép đặc mài bóng gương phản chiếu môi trường | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **90.5 g** (Trạng thái: `illustrative`) - Thể tích chuẩn ($V_{ref}$): **11.49 cm³** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad V = \frac{4}{3} \pi R^3 = \frac{\pi d^3}{6} = \frac{\pi (2.52)^3}{6} \approx 8.38\text{ cm}^3$$ *Ý nghĩa vật lý*: Thể tích hình cầu thép đặc ($d = 25.2\text{ mm}$). $$\mathbf{(2)}\quad \rho = \frac{m}{V} = \frac{65.90\text{ g}}{8.38\text{ cm}^3} \approx 7.86\text{ g/cm}^3$$ *Ý nghĩa vật lý*: Khối lượng riêng của thép không gỉ / hợp kim Crom. $$\mathbf{(3)}\quad W_{đ} = \frac{1}{2} m v^2 + \frac{1}{2} I \omega^2$$ *Ý nghĩa vật lý*: Động năng toàn phần khi bi thép lăn trên máng nghiêng (Bài 2 SGK KHTN 9). * **Các tính năng khoa học tích hợp**: - Bi cầu thép hợp kim Crôm (AISI 52100) đặc hoàn toàn, bề mặt mài bóng gương. - Dùng trong Bài 2 SGK KHTN 9 để thả lăn trên máng nghiêng khảo sát Động năng phụ thuộc vào khối lượng và tốc độ. - Dùng làm vật mẫu chuẩn đo khối lượng riêng của Thép (ρ = 7.85 g/cm³) và đo đường kính bằng thước cặp. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `REST_ON_TABLE` * **Danh sách trạng thái khả dụng**: `REST_ON_TABLE`, `ROLLING_INCLINE`, `IMPACTING_BLOCK`, `SUBMERGED_CYLINDER` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `REST_ON_TABLE` | `ROLLING_INCLINE` | Released on inclined plane | `height > 0` | | `ROLLING_INCLINE` | `IMPACTING_BLOCK` | Hits friction block at bottom | `pos == bottom` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: Độ cầu sai lệch <= 0.005 mm (Grade 100) * **Độ chia nhỏ nhất / Độ phân giải**: 0.01 mm * **Độ lặp lại phép đo**: ±0.02 g * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Bi lăn lệch khỏi máng nghiêng** | Góc nghiêng máng bị vặn hoặc vận tốc ban đầu có thành phần ngang | Không đập trúng khúc gỗ ở chân dốc | `Độ lệch ngang > 10 mm` | Cân chỉnh cân bằng máng dẫn và dùng ngón tay thả rơi tự do không vận tốc đầu | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **VietJack — SGK KHTN 9 Kết nối tri thức (Bài 2)** | `vietjack.com` | Thí nghiệm khảo sát động năng (Hình 2.3 SGK KHTN 9): Sử dụng viên bi thép lăn trên máng nghiêng đập vào khúc gỗ. | | **Innotec Việt Nam — Bộ thí nghiệm Cơ năng** | `innotec.com.vn` | Viên bi thép chuẩn Ø 25 mm nặng ~66 g dùng trong bộ thí nghiệm biến đổi thế năng thành động năng. | | **VietValue — Thiết bị Dạy học** | `vietvalue.edu.vn` | Bi thép thực hành Vật lí THCS: Khối lượng riêng chuẩn 7.85 g/cm³, chống gỉ sét trong môi trường ẩm. | | **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Mẫu vật hình cầu bằng thép đặc dùng kết hợp với thước cặp 150 mm và cân điện tử. | | **Thư viện Vật lý** | `thuvienvatly.com` | Tính toán thể tích hình cầu V = (4/3)πR³ đối chiếu với phép đo dâng nước trong ống đong. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Mẫu cầu thép để đo đường kính, thể tích, khối lượng riêng và quan sát chuyển động lăn.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 28 mm, Cao = 28 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.028 m, Cao (Y) = 0.028 m, Sâu (Z) = 0.028 m
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

- **Các trạng thái:** `REST_ON_TABLE`, `ROLLING_INCLINE`, `IMPACTING_BLOCK`, `SUBMERGED_CYLINDER`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body | Quả cầu | Nhấc, kéo, thả và xoay; có thể đặt vào máng nghiêng nếu connector hỗ trợ. | Lăn theo mặt nghiêng, chịu trọng lực và ma sát; không trượt xuyên mặt. |
| measurement_anchor | Điểm đo | Đưa thước cặp tiếp xúc hai phía qua đường kính hoặc cân trên đĩa. | Dụng cụ liên kết ghi đường kính/khối lượng. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đo đường kính quả cầu bằng thước cặp.
2. Cân khối lượng.
3. Tính thể tích V = πd³/6 và khối lượng riêng.
4. Nếu đặt trên máng nghiêng, thả từ độ cao xác định và quan sát lăn.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Khối cầu lăn theo trọng lực; động năng gồm tịnh tiến và quay khi mô hình lăn được bật.
- Đường kính và khối lượng không đổi.
- Ma sát và hình học máng ảnh hưởng chuyển động.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V = \frac{4}{3} \pi R^3 = \frac{\pi d^3}{6} = \frac{\pi (2.52)^3}{6} \approx 8.38\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích hình cầu thép đặc ($d = 25.2\text{ mm}$).
  $$\mathbf{(2)}\quad \rho = \frac{m}{V} = \frac{65.90\text{ g}}{8.38\text{ cm}^3} \approx 7.86\text{ g/cm}^3$$
  *Ý nghĩa vật lý*: Khối lượng riêng của thép không gỉ / hợp kim Crom.
  $$\mathbf{(3)}\quad W_{đ} = \frac{1}{2} m v^2 + \frac{1}{2} I \omega^2$$
  *Ý nghĩa vật lý*: Động năng toàn phần khi bi thép lăn trên máng nghiêng (Bài 2 SGK KHTN 9).
* **Các tính năng khoa học tích hợp**:
  - Bi cầu thép hợp kim Crôm (AISI 52100) đặc hoàn toàn, bề mặt mài bóng gương.
  - Dùng trong Bài 2 SGK KHTN 9 để thả lăn trên máng nghiêng khảo sát Động năng phụ thuộc vào khối lượng và tốc độ.
  - Dùng làm vật mẫu chuẩn đo khối lượng riêng của Thép (ρ = 7.85 g/cm³) và đo đường kính bằng thước cặp.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `REST_ON_TABLE`
* **Danh sách trạng thái khả dụng**: `REST_ON_TABLE`, `ROLLING_INCLINE`, `IMPACTING_BLOCK`, `SUBMERGED_CYLINDER`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `REST_ON_TABLE` | `ROLLING_INCLINE` | Released on inclined plane | `height > 0` |
| `ROLLING_INCLINE` | `IMPACTING_BLOCK` | Hits friction block at bottom | `pos == bottom` |

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
| **Bi lăn lệch khỏi máng nghiêng** | Góc nghiêng máng bị vặn hoặc vận tốc ban đầu có thành phần ngang | Không đập trúng khúc gỗ ở chân dốc | `Độ lệch ngang > 10 mm` | Cân chỉnh cân bằng máng dẫn và dùng ngón tay thả rơi tự do không vận tốc đầu |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-SPH-0001-T01:** Đo đường kính: số đo khớp kích thước mẫu trong sai số.
- [ ] **OL3D-EQP-SPH-0001-T02:** Tính thể tích và khối lượng riêng đúng.
- [ ] **OL3D-EQP-SPH-0001-T03:** Thả trên máng: vật lăn và không xuyên bề mặt.
- [ ] **OL3D-EQP-SPH-0001-T04:** Không có máng/điểm đỡ phù hợp: không tự kích hoạt thí nghiệm lăn.

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

## 4.9. [OL3D-EQP-SPH-0001] Vật rắn hình cầu thép không gỉ
**Tên tiếng Anh**: *Stainless Steel Sphere Specimen* | **Mã Archetype**: `solid-sphere` | **Phân loại danh mục**: `solid-specimens`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-SPH-0001`
* **Mã đường dẫn (Slug)**: `vat-ran-hinh-cau-thep`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Chương I KHTN 9 (Bài 2: Động năng, Thế năng)

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 28 mm, Cao = 28 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.028 m, Cao (Y) = 0.028 m, Sâu (Z) = 0.028 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `SphereGeometry (Segments 64x64)` | MeshPhysicalMaterial (Chrome Steel, metalness 0.96, roughness 0.06) | 1 | Bi cầu thép đặc mài bóng gương phản chiếu môi trường |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **90.5 g** (Trạng thái: `illustrative`)
  - Thể tích chuẩn ($V_{ref}$): **11.49 cm³**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V = \frac{4}{3} \pi R^3 = \frac{\pi d^3}{6} = \frac{\pi (2.52)^3}{6} \approx 8.38\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích hình cầu thép đặc ($d = 25.2\text{ mm}$).
  $$\mathbf{(2)}\quad \rho = \frac{m}{V} = \frac{65.90\text{ g}}{8.38\text{ cm}^3} \approx 7.86\text{ g/cm}^3$$
  *Ý nghĩa vật lý*: Khối lượng riêng của thép không gỉ / hợp kim Crom.
  $$\mathbf{(3)}\quad W_{đ} = \frac{1}{2} m v^2 + \frac{1}{2} I \omega^2$$
  *Ý nghĩa vật lý*: Động năng toàn phần khi bi thép lăn trên máng nghiêng (Bài 2 SGK KHTN 9).
* **Các tính năng khoa học tích hợp**:
  - Bi cầu thép hợp kim Crôm (AISI 52100) đặc hoàn toàn, bề mặt mài bóng gương.
  - Dùng trong Bài 2 SGK KHTN 9 để thả lăn trên máng nghiêng khảo sát Động năng phụ thuộc vào khối lượng và tốc độ.
  - Dùng làm vật mẫu chuẩn đo khối lượng riêng của Thép (ρ = 7.85 g/cm³) và đo đường kính bằng thước cặp.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `REST_ON_TABLE`
* **Danh sách trạng thái khả dụng**: `REST_ON_TABLE`, `ROLLING_INCLINE`, `IMPACTING_BLOCK`, `SUBMERGED_CYLINDER`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `REST_ON_TABLE` | `ROLLING_INCLINE` | Released on inclined plane | `height > 0` |
| `ROLLING_INCLINE` | `IMPACTING_BLOCK` | Hits friction block at bottom | `pos == bottom` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Độ cầu sai lệch <= 0.005 mm (Grade 100)
* **Độ chia nhỏ nhất / Độ phân giải**: 0.01 mm
* **Độ lặp lại phép đo**: ±0.02 g
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Bi lăn lệch khỏi máng nghiêng** | Góc nghiêng máng bị vặn hoặc vận tốc ban đầu có thành phần ngang | Không đập trúng khúc gỗ ở chân dốc | `Độ lệch ngang > 10 mm` | Cân chỉnh cân bằng máng dẫn và dùng ngón tay thả rơi tự do không vận tốc đầu |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietJack — SGK KHTN 9 Kết nối tri thức (Bài 2)** | `vietjack.com` | Thí nghiệm khảo sát động năng (Hình 2.3 SGK KHTN 9): Sử dụng viên bi thép lăn trên máng nghiêng đập vào khúc gỗ. |
| **Innotec Việt Nam — Bộ thí nghiệm Cơ năng** | `innotec.com.vn` | Viên bi thép chuẩn Ø 25 mm nặng ~66 g dùng trong bộ thí nghiệm biến đổi thế năng thành động năng. |
| **VietValue — Thiết bị Dạy học** | `vietvalue.edu.vn` | Bi thép thực hành Vật lí THCS: Khối lượng riêng chuẩn 7.85 g/cm³, chống gỉ sét trong môi trường ẩm. |
| **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Mẫu vật hình cầu bằng thép đặc dùng kết hợp với thước cặp 150 mm và cân điện tử. |
| **Thư viện Vật lý** | `thuvienvatly.com` | Tính toán thể tích hình cầu V = (4/3)πR³ đối chiếu với phép đo dâng nước trong ống đong. |

---
