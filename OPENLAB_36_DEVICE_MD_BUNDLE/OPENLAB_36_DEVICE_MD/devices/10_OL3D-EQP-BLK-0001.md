# 10. Vật rắn hình hộp chữ nhật đồng thau

**Device ID:** `OL3D-EQP-BLK-0001`  
**Nhóm chức năng đề xuất:** `G02/G01`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `solid-block`  
**Slug:** `vat-ran-hinh-hop-dong-thau`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `not-verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Mẫu kim loại Đồng (Cu) nguyên chất ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 40 mm, Cao = 15 mm, Sâu = 25 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.04 m, Cao (Y) = 0.015 m, Sâu (Z) = 0.025 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial` * **Kỹ thuật đồ họa nổi bật**: ExtrudeGeometry with Bevel * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `BoxGeometry (Bevel)` | MeshPhysicalMaterial (Pure Copper, color 0xd97706, metalness 0.95) | 1 | Khối hộp chữ nhật góc vát 0.5mm ánh kim cam đỏ | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **127.5 g** (Trạng thái: `illustrative`) - Thể tích chuẩn ($V_{ref}$): **15 cm³** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad V = a \cdot b \cdot c = 3.0 \times 2.0 \times 3.0 = 18.0\text{ cm}^3$$ *Ý nghĩa vật lý*: Thể tích hình hộp chữ nhật đồng đỏ. $$\mathbf{(2)}\quad \rho = \frac{m}{V} = \frac{160.92\text{ g}}{18.0\text{ cm}^3} = 8.94\text{ g/cm}^3$$ *Ý nghĩa vật lý*: Khối lượng riêng đặc trưng của kim loại Đồng nguyên chất (Cu). * **Các tính năng khoa học tích hợp**: - Khối hộp chữ nhật gia công từ đồng đỏ điện phân (Cu ≥ 99.9%) có ánh kim đỏ cam đặc trưng. - Cho phép học sinh xác định thể tích theo cả 2 phương pháp: Đo kích thước a × b × c bằng thước cặp (3 × 2 × 3 = 18 cm³) và thả chìm trong ống đong. - Minh họa trực quan tính chất vật lí của kim loại Đồng (Bài 18 SGK KHTN 9) và đo khối lượng riêng lớn (8.94 g/cm³). ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `IDLE` * **Danh sách trạng thái khả dụng**: `IDLE`, `ON_BALANCE`, `MEASURING_JAWS`, `IN_OVERFLOW_CAN` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `IDLE` | `ON_BALANCE` | Placed on balance | `true` | | `IDLE` | `IN_OVERFLOW_CAN` | Placed in overflow can | `true` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±0.05 mm kích thước phay CNC * **Độ chia nhỏ nhất / Độ phân giải**: 0.02 mm thước cặp * **Độ lặp lại phép đo**: ±0.02 g * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Giãn nở đồng: 1.65 × 10⁻⁵ K⁻¹ ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Thả vào ống đong làm nứt đáy ống** | Khối lượng lớn (161g) rơi tự do trong nước gây xung lực va đập | Vỡ đáy ống đong thủy tinh | `Tốc độ rơi > 1.2 m/s` | Bắt buộc buộc chỉ nghiêng ống đong thả trượt từ từ hoặc dùng Bình tràn | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **VietValue — Bộ mẫu Kim loại KHTN 9** | `vietvalue.edu.vn` | Khối hộp đồng nguyên chất trong bộ mẫu thực hành: Kích thước 30×20×30 mm, khối lượng riêng 8.94 g/cm³. | | **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Mẫu vật hình hộp chữ nhật bằng đồng đỏ dùng thực hành đo khối lượng riêng và khảo sát tính chất kim loại. | | **Innotec Việt Nam** | `innotec.com.vn` | Các mặt bên được phay phẳng vuông góc giúp kẹp thước cặp đo chính xác tới 0.02 mm. | | **VietChem — Hóa chất & Mẫu Kim loại** | `vietchem.com.vn` | Tính chất vật lí chuẩn của Đồng (Cu): Khối lượng riêng 8.94 g/cm³, dẫn điện và dẫn nhiệt tốt. | | **VinaMTSC** | `vinamtsc.com` | Bộ mẫu vật rắn thực hành KHTN THCS theo tiêu chuẩn Bộ GD&ĐT. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Mẫu hình hộp để đo ba kích thước, khối lượng và khối lượng riêng.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 40 mm, Cao = 15 mm, Sâu = 25 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.04 m, Cao (Y) = 0.015 m, Sâu (Z) = 0.025 m
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

- **Các trạng thái:** `IDLE`, `ON_BALANCE`, `MEASURING_JAWS`, `IN_OVERFLOW_CAN`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body | Khối hộp | Nhấc, xoay để chọn các mặt đo, đặt lên cân hoặc dụng cụ đo. | Tư thế thay đổi; kích thước cạnh vẫn cố định. |
| measurement_anchor | Điểm đo | Đặt thước cặp tiếp xúc ba cặp mặt đối diện. | Đọc a, b, c từ thước cặp; kết quả V = abc. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Chọn mặt đo và đo ba kích thước vuông góc.
2. Cân mẫu.
3. Tính thể tích hình hộp.
4. Tính khối lượng riêng và so sánh với vật liệu tham chiếu.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Khi xoay vật, trục kích thước đo thay đổi nhưng kích thước thật không đổi.
- Khối lượng riêng tính từ m/V.
- Cần tránh nhãn vật liệu và công thức không nhất quán với mã vật liệu; kiểm tra dữ liệu nguồn trước khi công bố.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V = a \cdot b \cdot c = 3.0 \times 2.0 \times 3.0 = 18.0\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích hình hộp chữ nhật đồng đỏ.
  $$\mathbf{(2)}\quad \rho = \frac{m}{V} = \frac{160.92\text{ g}}{18.0\text{ cm}^3} = 8.94\text{ g/cm}^3$$
  *Ý nghĩa vật lý*: Khối lượng riêng đặc trưng của kim loại Đồng nguyên chất (Cu).
* **Các tính năng khoa học tích hợp**:
  - Khối hộp chữ nhật gia công từ đồng đỏ điện phân (Cu ≥ 99.9%) có ánh kim đỏ cam đặc trưng.
  - Cho phép học sinh xác định thể tích theo cả 2 phương pháp: Đo kích thước a × b × c bằng thước cặp (3 × 2 × 3 = 18 cm³) và thả chìm trong ống đong.
  - Minh họa trực quan tính chất vật lí của kim loại Đồng (Bài 18 SGK KHTN 9) và đo khối lượng riêng lớn (8.94 g/cm³).

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE`
* **Danh sách trạng thái khả dụng**: `IDLE`, `ON_BALANCE`, `MEASURING_JAWS`, `IN_OVERFLOW_CAN`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE` | `ON_BALANCE` | Placed on balance | `true` |
| `IDLE` | `IN_OVERFLOW_CAN` | Placed in overflow can | `true` |

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
| **Thả vào ống đong làm nứt đáy ống** | Khối lượng lớn (161g) rơi tự do trong nước gây xung lực va đập | Vỡ đáy ống đong thủy tinh | `Tốc độ rơi > 1.2 m/s` | Bắt buộc buộc chỉ nghiêng ống đong thả trượt từ từ hoặc dùng Bình tràn |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-BLK-0001-T01:** Đo đủ ba kích thước: không lấy lặp cùng một cạnh.
- [ ] **OL3D-EQP-BLK-0001-T02:** Tính V = abc.
- [ ] **OL3D-EQP-BLK-0001-T03:** Tính ρ = m/V và kiểm tra đơn vị.
- [ ] **OL3D-EQP-BLK-0001-T04:** Xoay vật rồi đo lại: kết quả cùng giá trị trong dung sai.

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

## 4.10. [OL3D-EQP-BLK-0001] Vật rắn hình hộp chữ nhật đồng thau
**Tên tiếng Anh**: *Rectangular Brass Block Specimen* | **Mã Archetype**: `solid-block` | **Phân loại danh mục**: `solid-specimens`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-BLK-0001`
* **Mã đường dẫn (Slug)**: `vat-ran-hinh-hop-dong-thau`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Mẫu kim loại Đồng (Cu) nguyên chất

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 40 mm, Cao = 15 mm, Sâu = 25 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.04 m, Cao (Y) = 0.015 m, Sâu (Z) = 0.025 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: ExtrudeGeometry with Bevel
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry (Bevel)` | MeshPhysicalMaterial (Pure Copper, color 0xd97706, metalness 0.95) | 1 | Khối hộp chữ nhật góc vát 0.5mm ánh kim cam đỏ |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **127.5 g** (Trạng thái: `illustrative`)
  - Thể tích chuẩn ($V_{ref}$): **15 cm³**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V = a \cdot b \cdot c = 3.0 \times 2.0 \times 3.0 = 18.0\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích hình hộp chữ nhật đồng đỏ.
  $$\mathbf{(2)}\quad \rho = \frac{m}{V} = \frac{160.92\text{ g}}{18.0\text{ cm}^3} = 8.94\text{ g/cm}^3$$
  *Ý nghĩa vật lý*: Khối lượng riêng đặc trưng của kim loại Đồng nguyên chất (Cu).
* **Các tính năng khoa học tích hợp**:
  - Khối hộp chữ nhật gia công từ đồng đỏ điện phân (Cu ≥ 99.9%) có ánh kim đỏ cam đặc trưng.
  - Cho phép học sinh xác định thể tích theo cả 2 phương pháp: Đo kích thước a × b × c bằng thước cặp (3 × 2 × 3 = 18 cm³) và thả chìm trong ống đong.
  - Minh họa trực quan tính chất vật lí của kim loại Đồng (Bài 18 SGK KHTN 9) và đo khối lượng riêng lớn (8.94 g/cm³).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE`
* **Danh sách trạng thái khả dụng**: `IDLE`, `ON_BALANCE`, `MEASURING_JAWS`, `IN_OVERFLOW_CAN`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE` | `ON_BALANCE` | Placed on balance | `true` |
| `IDLE` | `IN_OVERFLOW_CAN` | Placed in overflow can | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.05 mm kích thước phay CNC
* **Độ chia nhỏ nhất / Độ phân giải**: 0.02 mm thước cặp
* **Độ lặp lại phép đo**: ±0.02 g
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Giãn nở đồng: 1.65 × 10⁻⁵ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Thả vào ống đong làm nứt đáy ống** | Khối lượng lớn (161g) rơi tự do trong nước gây xung lực va đập | Vỡ đáy ống đong thủy tinh | `Tốc độ rơi > 1.2 m/s` | Bắt buộc buộc chỉ nghiêng ống đong thả trượt từ từ hoặc dùng Bình tràn |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietValue — Bộ mẫu Kim loại KHTN 9** | `vietvalue.edu.vn` | Khối hộp đồng nguyên chất trong bộ mẫu thực hành: Kích thước 30×20×30 mm, khối lượng riêng 8.94 g/cm³. |
| **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Mẫu vật hình hộp chữ nhật bằng đồng đỏ dùng thực hành đo khối lượng riêng và khảo sát tính chất kim loại. |
| **Innotec Việt Nam** | `innotec.com.vn` | Các mặt bên được phay phẳng vuông góc giúp kẹp thước cặp đo chính xác tới 0.02 mm. |
| **VietChem — Hóa chất & Mẫu Kim loại** | `vietchem.com.vn` | Tính chất vật lí chuẩn của Đồng (Cu): Khối lượng riêng 8.94 g/cm³, dẫn điện và dẫn nhiệt tốt. |
| **VinaMTSC** | `vinamtsc.com` | Bộ mẫu vật rắn thực hành KHTN THCS theo tiêu chuẩn Bộ GD&ĐT. |

---
