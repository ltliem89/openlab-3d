# 08. Vật rắn hình trụ hợp kim nhôm

**Device ID:** `OL3D-EQP-SLD-0001`  
**Nhóm chức năng đề xuất:** `G02/G01`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `solid-cylinder`  
**Slug:** `vat-ran-hinh-tru-nhom`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `not-verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Mẫu vật chuẩn Khối lượng riêng ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 25 mm, Cao = 50 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.025 m, Cao (Y) = 0.05 m, Sâu (Z) = 0.025 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `handle` * **Các lớp vật liệu Three.js sử dụng**: `MeshPhysicalMaterial` * **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `CylinderGeometry + Bevel Torus` | MeshPhysicalMaterial (Anodized Aluminium, metalness 0.90) | 1 | Trụ nhôm đặc tiện CNC chính xác Ø25x50mm | | `handle` | `TorusGeometry` | MeshPhysicalMaterial (Stainless Steel) | 1 | Khuyên móc tròn đồng trục để treo vào lực kế | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **66.25 g** (Trạng thái: `illustrative`) - Thể tích chuẩn ($V_{ref}$): **24.54 cm³** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad \rho = \frac{m}{V} = \frac{66.25\text{ g}}{24.5\text{ cm}^3} = 2.70\text{ g/cm}^3$$ *Ý nghĩa vật lý*: Khối lượng riêng chuẩn của hợp kim nhôm (Aluminium 6061). $$\mathbf{(2)}\quad V = \pi \cdot \left(\frac{d}{2}\right)^2 \cdot h = \pi \cdot (1.25\text{ cm})^2 \cdot 5.0\text{ cm} \approx 24.54\text{ cm}^3$$ *Ý nghĩa vật lý*: Tính thể tích từ kích thước đo bằng thước cặp du xích. * **Các tính năng khoa học tích hợp**: - Gia công CNC chính xác từ hợp kim nhôm đặc (Al) không rỗng khí, bề mặt anod hóa chống oxy hóa. - Đường kính Ø 25.0 mm thiết kế nhỏ hơn lòng ống đong 100 ml (Ø 28 mm) để thả chìm dễ dàng. - Có móc treo đồng trục ở mặt trên để buộc chỉ nhúng nước hoặc treo trực tiếp vào lực kế lò xo 5 N. - Tỷ số m / V = 66.25 / 24.5 = 2.70 g/cm³ khớp chính xác bảng khối lượng riêng của Nhôm trong SGK. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `IDLE` * **Danh sách trạng thái khả dụng**: `IDLE`, `ON_PAN`, `SUSPENDED`, `SUBMERGED` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `IDLE` | `ON_PAN` | Dock to balance | `true` | | `IDLE` | `SUBMERGED` | Submerged in water | `true` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±0.2% khối lượng và kích thước gia công CNC * **Độ chia nhỏ nhất / Độ phân giải**: 0.01 mm kích thước; 0.01 g khối lượng * **Độ lặp lại phép đo**: ±0.05 g * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Giãn nở nhôm: 2.3 × 10⁻⁵ K⁻¹ ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Bọt khí bám vào bề mặt khi nhúng nước** | Sức căng bề mặt giữ các bọt khí li ti bám quanh thân nhôm | Thể tích dâng trong ống đong bị thừa 0.5 - 1 ml | `Quan sát thấy bọt khí bám thành` | Gõ nhẹ đáy ống đong xuống mặt bàn để bọt khí thoát hết lên trên | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Nhà sách Giáo dục — Bộ mẫu đo Khối lượng riêng** | `nhasachgiaoduc.vn` | Quả nặng hình trụ nhôm có móc treo: Đường kính 25 mm, chiều cao 50 mm, dùng đo khối lượng riêng và lực đẩy Archimedes. | | **VietValue — Thiết bị Vật lí THCS** | `vietvalue.edu.vn` | Vật mẫu kim loại hình trụ đặc (Nhôm, Đồng, Sắt) đồng bộ kích thước để so sánh khối lượng riêng ρ = m/V. | | **Innotec Việt Nam** | `innotec.com.vn` | Vật trụ kim loại có móc treo dùng chung cho bài Thực hành đo khối lượng riêng và bài Cơ năng. | | **VietJack — Hướng dẫn Thực hành KHTN** | `vietjack.com` | Phương pháp xác định khối lượng riêng của vật rắn hình trụ bằng cân điện tử và ống đong chứa nước. | | **Thiết bị Giáo dục Tây Bắc** | `thietbigiaoductaybac.vn` | Trụ nhôm thực hành KHTN: Khối lượng riêng danh định 2.70 g/cm³ (2700 kg/m³), sai số gia công ±1%. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Mẫu vật hình trụ để đo kích thước, khối lượng và xác định khối lượng riêng.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 25 mm, Cao = 50 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.025 m, Cao (Y) = 0.05 m, Sâu (Z) = 0.025 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `handle`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `IDLE`, `ON_PAN`, `SUSPENDED`, `SUBMERGED`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body / handle | Vật trụ và vị trí cầm | Nhấc, xoay quanh các trục và đặt lên cân/ống đong. | Vị trí và tư thế vật thay đổi; kích thước hình học giữ cố định. |
| measurement_anchor | Điểm neo đo | Đặt thước cặp tiếp xúc đường kính/chiều cao hoặc nhúng vào dụng cụ đo thể tích. | Kết quả đo đến từ dụng cụ đo liên kết, không từ phép đọc tự động không hiển thị. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Chọn vật trụ và kiểm tra mã mẫu.
2. Đo đường kính và chiều cao bằng thước cặp.
3. Cân khối lượng bằng cân điện tử.
4. Tính thể tích hình trụ và khối lượng riêng.
5. Có thể kiểm tra thể tích bằng phương pháp dời chỗ nếu phù hợp.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Xoay vật chỉ thay đổi tư thế, không làm đổi khối lượng/kích thước.
- Số đo phụ thuộc thước cặp/cân hoặc số liệu nhập từ phép đo được thực hiện.
- Hiển thị đơn vị nhất quán g, mm, cm³, g/cm³.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \rho = \frac{m}{V} = \frac{66.25\text{ g}}{24.5\text{ cm}^3} = 2.70\text{ g/cm}^3$$
  *Ý nghĩa vật lý*: Khối lượng riêng chuẩn của hợp kim nhôm (Aluminium 6061).
  $$\mathbf{(2)}\quad V = \pi \cdot \left(\frac{d}{2}\right)^2 \cdot h = \pi \cdot (1.25\text{ cm})^2 \cdot 5.0\text{ cm} \approx 24.54\text{ cm}^3$$
  *Ý nghĩa vật lý*: Tính thể tích từ kích thước đo bằng thước cặp du xích.
* **Các tính năng khoa học tích hợp**:
  - Gia công CNC chính xác từ hợp kim nhôm đặc (Al) không rỗng khí, bề mặt anod hóa chống oxy hóa.
  - Đường kính Ø 25.0 mm thiết kế nhỏ hơn lòng ống đong 100 ml (Ø 28 mm) để thả chìm dễ dàng.
  - Có móc treo đồng trục ở mặt trên để buộc chỉ nhúng nước hoặc treo trực tiếp vào lực kế lò xo 5 N.
  - Tỷ số m / V = 66.25 / 24.5 = 2.70 g/cm³ khớp chính xác bảng khối lượng riêng của Nhôm trong SGK.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE`
* **Danh sách trạng thái khả dụng**: `IDLE`, `ON_PAN`, `SUSPENDED`, `SUBMERGED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE` | `ON_PAN` | Dock to balance | `true` |
| `IDLE` | `SUBMERGED` | Submerged in water | `true` |

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
| **Bọt khí bám vào bề mặt khi nhúng nước** | Sức căng bề mặt giữ các bọt khí li ti bám quanh thân nhôm | Thể tích dâng trong ống đong bị thừa 0.5 - 1 ml | `Quan sát thấy bọt khí bám thành` | Gõ nhẹ đáy ống đong xuống mặt bàn để bọt khí thoát hết lên trên |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-SLD-0001-T01:** Đo đường kính/chiều cao: công thức thể tích đúng.
- [ ] **OL3D-EQP-SLD-0001-T02:** Cân vật: khối lượng trả về dữ liệu mẫu chuẩn.
- [ ] **OL3D-EQP-SLD-0001-T03:** Tính ρ = m/V: khớp giá trị tham chiếu trong sai số nguồn.
- [ ] **OL3D-EQP-SLD-0001-T04:** Đặt/nhấc vật khỏi dụng cụ đo: cập nhật kết quả tương ứng.

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

## 4.8. [OL3D-EQP-SLD-0001] Vật rắn hình trụ hợp kim nhôm
**Tên tiếng Anh**: *Solid Aluminum Cylinder Specimen* | **Mã Archetype**: `solid-cylinder` | **Phân loại danh mục**: `solid-specimens`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-SLD-0001`
* **Mã đường dẫn (Slug)**: `vat-ran-hinh-tru-nhom`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Mẫu vật chuẩn Khối lượng riêng

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 25 mm, Cao = 50 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.025 m, Cao (Y) = 0.05 m, Sâu (Z) = 0.025 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `handle`
* **Các lớp vật liệu Three.js sử dụng**: `MeshPhysicalMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry + Bevel Torus` | MeshPhysicalMaterial (Anodized Aluminium, metalness 0.90) | 1 | Trụ nhôm đặc tiện CNC chính xác Ø25x50mm |
| `handle` | `TorusGeometry` | MeshPhysicalMaterial (Stainless Steel) | 1 | Khuyên móc tròn đồng trục để treo vào lực kế |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **66.25 g** (Trạng thái: `illustrative`)
  - Thể tích chuẩn ($V_{ref}$): **24.54 cm³**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \rho = \frac{m}{V} = \frac{66.25\text{ g}}{24.5\text{ cm}^3} = 2.70\text{ g/cm}^3$$
  *Ý nghĩa vật lý*: Khối lượng riêng chuẩn của hợp kim nhôm (Aluminium 6061).
  $$\mathbf{(2)}\quad V = \pi \cdot \left(\frac{d}{2}\right)^2 \cdot h = \pi \cdot (1.25\text{ cm})^2 \cdot 5.0\text{ cm} \approx 24.54\text{ cm}^3$$
  *Ý nghĩa vật lý*: Tính thể tích từ kích thước đo bằng thước cặp du xích.
* **Các tính năng khoa học tích hợp**:
  - Gia công CNC chính xác từ hợp kim nhôm đặc (Al) không rỗng khí, bề mặt anod hóa chống oxy hóa.
  - Đường kính Ø 25.0 mm thiết kế nhỏ hơn lòng ống đong 100 ml (Ø 28 mm) để thả chìm dễ dàng.
  - Có móc treo đồng trục ở mặt trên để buộc chỉ nhúng nước hoặc treo trực tiếp vào lực kế lò xo 5 N.
  - Tỷ số m / V = 66.25 / 24.5 = 2.70 g/cm³ khớp chính xác bảng khối lượng riêng của Nhôm trong SGK.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE`
* **Danh sách trạng thái khả dụng**: `IDLE`, `ON_PAN`, `SUSPENDED`, `SUBMERGED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE` | `ON_PAN` | Dock to balance | `true` |
| `IDLE` | `SUBMERGED` | Submerged in water | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.2% khối lượng và kích thước gia công CNC
* **Độ chia nhỏ nhất / Độ phân giải**: 0.01 mm kích thước; 0.01 g khối lượng
* **Độ lặp lại phép đo**: ±0.05 g
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Giãn nở nhôm: 2.3 × 10⁻⁵ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Bọt khí bám vào bề mặt khi nhúng nước** | Sức căng bề mặt giữ các bọt khí li ti bám quanh thân nhôm | Thể tích dâng trong ống đong bị thừa 0.5 - 1 ml | `Quan sát thấy bọt khí bám thành` | Gõ nhẹ đáy ống đong xuống mặt bàn để bọt khí thoát hết lên trên |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Nhà sách Giáo dục — Bộ mẫu đo Khối lượng riêng** | `nhasachgiaoduc.vn` | Quả nặng hình trụ nhôm có móc treo: Đường kính 25 mm, chiều cao 50 mm, dùng đo khối lượng riêng và lực đẩy Archimedes. |
| **VietValue — Thiết bị Vật lí THCS** | `vietvalue.edu.vn` | Vật mẫu kim loại hình trụ đặc (Nhôm, Đồng, Sắt) đồng bộ kích thước để so sánh khối lượng riêng ρ = m/V. |
| **Innotec Việt Nam** | `innotec.com.vn` | Vật trụ kim loại có móc treo dùng chung cho bài Thực hành đo khối lượng riêng và bài Cơ năng. |
| **VietJack — Hướng dẫn Thực hành KHTN** | `vietjack.com` | Phương pháp xác định khối lượng riêng của vật rắn hình trụ bằng cân điện tử và ống đong chứa nước. |
| **Thiết bị Giáo dục Tây Bắc** | `thietbigiaoductaybac.vn` | Trụ nhôm thực hành KHTN: Khối lượng riêng danh định 2.70 g/cm³ (2700 kg/m³), sai số gia công ±1%. |

---
