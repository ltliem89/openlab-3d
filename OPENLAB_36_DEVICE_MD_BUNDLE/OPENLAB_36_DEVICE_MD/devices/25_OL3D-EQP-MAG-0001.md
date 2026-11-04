# 25. Kính lúp cầm tay độ bội giác 5x (SGK KHTN 9)

**Device ID:** `OL3D-EQP-MAG-0001`  
**Nhóm chức năng đề xuất:** `G06`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `magnifying-glass`  
**Slug:** `handheld-magnifying-glass-5x`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-MAG-0001_handheld-magnifying-glass-5x` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 10.1 Bài 10 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 10: Kính lúp. Bài tập thấu kính (trang 50–52) * **Hình ảnh đối chiếu SGK**: Hình 10.1, Hình 10.3, Hình 10.4 (**) * **Chức năng chuẩn**: Tạo ảnh ảo cùng chiều, lớn hơn vật khi đặt vật nhỏ trong khoảng từ quang tâm O đến tiêu điểm chính F (d < f), giúp tăng góc trông ảnh của vật. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 80 mm, Cao = 165 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.085 m, Cao (Y) = 0.165 m, Sâu (Z) = 0.072 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `lens_element` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial` * **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `Torus + Cylinder Handle` | MeshPhysicalMaterial (Black Rubberized ABS) | 2 | Vành giữ thấu kính Ø75mm kèm tay cầm chống trượt | | `lens_element` | `Sphere intersection` | MeshPhysicalMaterial (Optical Glass, transmission 0.95) | 4 | Thấu kính hội tụ phóng đại 5x | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **145 g** (Trạng thái: `verified`) - Tiêu cự định danh ($f$): **50 mm** * **Thông số metrology thiết bị đo**: - Đại lượng đo: `magnification` - Giới hạn đo (GHĐ): **5 x (Bội giác G)** đến **5 x (Bội giác G)** - Độ chia nhỏ nhất (ĐCNN): **undefined undefined** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad G = \frac{25\text{ cm}}{f} = \frac{250\text{ mm}}{50\text{ mm}} = 5\times$$ *Ý nghĩa vật lý*: Số bội giác của kính lúp khi ngắm chừng ở vô cực ($f = 50\text{ mm}$). $$\mathbf{(2)}\quad d' = \frac{d \cdot f}{d - f} < 0 \implies \text{Ảnh ảo cùng chiều lớn hơn vật}$$ *Ý nghĩa vật lý*: Vật đặt trong khoảng tiêu cự $0 < d < f$ tạo ảnh ảo phóng đại quan sát bằng mắt thường. * **Các tính năng khoa học tích hợp**: - Cấu tạo gồm một thấu kính hội tụ có tiêu cự ngắn (f = 5 cm) bọc trong khung vành kim loại chắc chắn và tay cầm vừa vặn. - Khi đặt vật nhỏ trong khoảng tiêu cự (d < f), kính lúp tạo ra ảnh ảo cùng chiều và lớn gấp 5 lần vật. - Dùng trong Bài 10 SGK KHTN 9 và các bài quan sát mẫu vật sinh học, chi tiết thực vật, côn trùng, tinh thể muối. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `BENCH_REST` * **Danh sách trạng thái khả dụng**: `BENCH_REST`, `HELD_IN_HAND`, `MAGNIFYING_SPECIMEN` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `BENCH_REST` | `HELD_IN_HAND` | Pointer grab | `true` | | `HELD_IN_HAND` | `MAGNIFYING_SPECIMEN` | Hover over specimen | `d < f` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±0.2x độ bội giác * **Độ chia nhỏ nhất / Độ phân giải**: Tiêu cự 50 mm ± 1 mm * **Độ lặp lại phép đo**: Hình ảnh ảo sắc nét không méo gối * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Méo rìa hình ảnh (Aberration)** | Đưa mắt quá xa trục chính quang học của kính lúp | Viền đối tượng bị cong méo hình gối | `Eye offset > 30 mm` | Căn chỉnh mắt nhìn thẳng đồng trục tâm thấu kính | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **VietJack — SGK KHTN 9 Bài 10 (Kính lúp)** | `vietjack.com` | Cấu tạo kính lúp và công thức tính số bội giác G = 25/f (với f tính bằng cm), cách ngắm chừng để mắt không bị mỏi. | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Kính lúp cầm tay độ bội giác 3x – 5x, đường kính mặt kính ≥ 60 mm thuộc thiết bị dùng chung môn KHTN. | | **VietValue — Kính lúp Thí nghiệm Học sinh** | `vietvalue.edu.vn` | Kính lúp cầm tay Ø 65 mm, thấu kính thủy tinh quang học trong suốt chống trầy xước. | | **Innotec Việt Nam** | `innotec.com.vn` | Chiều dài tổng thể 150–160 mm, vành bảo vệ cao hơn mặt kính 2 mm tránh xước khi đặt trên mặt bàn. | | **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Dụng cụ thực hành bài Kính lúp và bài Thực hành quan sát tiêu bản sinh học. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Quan sát ảnh phóng đại bằng kính lúp cầm tay 5×.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 80 mm, Cao = 165 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.085 m, Cao (Y) = 0.165 m, Sâu (Z) = 0.072 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `lens_element`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `opticalFocus`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `BENCH_REST`, `HELD_IN_HAND`, `MAGNIFYING_SPECIMEN`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body / handle | Tay cầm kính lúp | Cầm, kéo, xoay và đặt trên vật theo góc nhìn. | Vị trí và góc kính thay đổi. |
| lens_element | Thấu kính lúp | Di chuyển kính gần/xa vật; không thay đổi tiêu cự nếu không thay lens. | Kích thước biểu kiến/độ nét thay đổi theo khoảng cách vật. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt mẫu vật trên mặt phẳng.
2. Cầm kính lúp và đưa gần mẫu.
3. Điều chỉnh khoảng cách để ảnh rõ.
4. Quan sát ảnh ảo cùng chiều và lớn hơn khi vật trong tiêu cự.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Bội giác danh định 5× theo hồ sơ khi điều kiện ngắm phù hợp.
- Khoảng cách sai có thể làm ảnh mờ; vật ngoài tiêu cự không giữ cùng tính chất ảnh ảo phóng đại.
- Mô phỏng giới hạn trường nhìn và khoảng cách mắt hợp lý.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad G = \frac{25\text{ cm}}{f} = \frac{250\text{ mm}}{50\text{ mm}} = 5\times$$
  *Ý nghĩa vật lý*: Số bội giác của kính lúp khi ngắm chừng ở vô cực ($f = 50\text{ mm}$).
  $$\mathbf{(2)}\quad d' = \frac{d \cdot f}{d - f} < 0 \implies \text{Ảnh ảo cùng chiều lớn hơn vật}$$
  *Ý nghĩa vật lý*: Vật đặt trong khoảng tiêu cự $0 < d < f$ tạo ảnh ảo phóng đại quan sát bằng mắt thường.
* **Các tính năng khoa học tích hợp**:
  - Cấu tạo gồm một thấu kính hội tụ có tiêu cự ngắn (f = 5 cm) bọc trong khung vành kim loại chắc chắn và tay cầm vừa vặn.
  - Khi đặt vật nhỏ trong khoảng tiêu cự (d < f), kính lúp tạo ra ảnh ảo cùng chiều và lớn gấp 5 lần vật.
  - Dùng trong Bài 10 SGK KHTN 9 và các bài quan sát mẫu vật sinh học, chi tiết thực vật, côn trùng, tinh thể muối.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `BENCH_REST`
* **Danh sách trạng thái khả dụng**: `BENCH_REST`, `HELD_IN_HAND`, `MAGNIFYING_SPECIMEN`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `BENCH_REST` | `HELD_IN_HAND` | Pointer grab | `true` |
| `HELD_IN_HAND` | `MAGNIFYING_SPECIMEN` | Hover over specimen | `d < f` |

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
| **Méo rìa hình ảnh (Aberration)** | Đưa mắt quá xa trục chính quang học của kính lúp | Viền đối tượng bị cong méo hình gối | `Eye offset > 30 mm` | Căn chỉnh mắt nhìn thẳng đồng trục tâm thấu kính |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-MAG-0001-T01:** Đặt vật trong khoảng tiêu cự: ảnh ảo, cùng chiều, phóng đại.
- [ ] **OL3D-EQP-MAG-0001-T02:** Thay đổi khoảng cách: độ nét và kích thước biểu kiến thay đổi.
- [ ] **OL3D-EQP-MAG-0001-T03:** Kéo kính khỏi vùng quan sát: ảnh không tiếp tục phóng đại giả tạo.

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

## 4.25. [OL3D-EQP-MAG-0001] Kính lúp cầm tay độ bội giác 5x (SGK KHTN 9)
**Tên tiếng Anh**: *5x Handheld Magnifying Glass (f = 5 cm)* | **Mã Archetype**: `magnifying-glass` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-MAG-0001`
* **Mã đường dẫn (Slug)**: `handheld-magnifying-glass-5x`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-MAG-0001_handheld-magnifying-glass-5x` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 10.1 Bài 10 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 10: Kính lúp. Bài tập thấu kính (trang 50–52)
* **Hình ảnh đối chiếu SGK**: Hình 10.1, Hình 10.3, Hình 10.4 (**)
* **Chức năng chuẩn**: Tạo ảnh ảo cùng chiều, lớn hơn vật khi đặt vật nhỏ trong khoảng từ quang tâm O đến tiêu điểm chính F (d < f), giúp tăng góc trông ảnh của vật.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 80 mm, Cao = 165 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.085 m, Cao (Y) = 0.165 m, Sâu (Z) = 0.072 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `lens_element`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Torus + Cylinder Handle` | MeshPhysicalMaterial (Black Rubberized ABS) | 2 | Vành giữ thấu kính Ø75mm kèm tay cầm chống trượt |
| `lens_element` | `Sphere intersection` | MeshPhysicalMaterial (Optical Glass, transmission 0.95) | 4 | Thấu kính hội tụ phóng đại 5x |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **145 g** (Trạng thái: `verified`)
  - Tiêu cự định danh ($f$): **50 mm**
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `magnification`
  - Giới hạn đo (GHĐ): **5 x (Bội giác G)** đến **5 x (Bội giác G)**
  - Độ chia nhỏ nhất (ĐCNN): **undefined undefined**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad G = \frac{25\text{ cm}}{f} = \frac{250\text{ mm}}{50\text{ mm}} = 5\times$$
  *Ý nghĩa vật lý*: Số bội giác của kính lúp khi ngắm chừng ở vô cực ($f = 50\text{ mm}$).
  $$\mathbf{(2)}\quad d' = \frac{d \cdot f}{d - f} < 0 \implies \text{Ảnh ảo cùng chiều lớn hơn vật}$$
  *Ý nghĩa vật lý*: Vật đặt trong khoảng tiêu cự $0 < d < f$ tạo ảnh ảo phóng đại quan sát bằng mắt thường.
* **Các tính năng khoa học tích hợp**:
  - Cấu tạo gồm một thấu kính hội tụ có tiêu cự ngắn (f = 5 cm) bọc trong khung vành kim loại chắc chắn và tay cầm vừa vặn.
  - Khi đặt vật nhỏ trong khoảng tiêu cự (d < f), kính lúp tạo ra ảnh ảo cùng chiều và lớn gấp 5 lần vật.
  - Dùng trong Bài 10 SGK KHTN 9 và các bài quan sát mẫu vật sinh học, chi tiết thực vật, côn trùng, tinh thể muối.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `BENCH_REST`
* **Danh sách trạng thái khả dụng**: `BENCH_REST`, `HELD_IN_HAND`, `MAGNIFYING_SPECIMEN`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `BENCH_REST` | `HELD_IN_HAND` | Pointer grab | `true` |
| `HELD_IN_HAND` | `MAGNIFYING_SPECIMEN` | Hover over specimen | `d < f` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.2x độ bội giác
* **Độ chia nhỏ nhất / Độ phân giải**: Tiêu cự 50 mm ± 1 mm
* **Độ lặp lại phép đo**: Hình ảnh ảo sắc nét không méo gối
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Méo rìa hình ảnh (Aberration)** | Đưa mắt quá xa trục chính quang học của kính lúp | Viền đối tượng bị cong méo hình gối | `Eye offset > 30 mm` | Căn chỉnh mắt nhìn thẳng đồng trục tâm thấu kính |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietJack — SGK KHTN 9 Bài 10 (Kính lúp)** | `vietjack.com` | Cấu tạo kính lúp và công thức tính số bội giác G = 25/f (với f tính bằng cm), cách ngắm chừng để mắt không bị mỏi. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Kính lúp cầm tay độ bội giác 3x – 5x, đường kính mặt kính ≥ 60 mm thuộc thiết bị dùng chung môn KHTN. |
| **VietValue — Kính lúp Thí nghiệm Học sinh** | `vietvalue.edu.vn` | Kính lúp cầm tay Ø 65 mm, thấu kính thủy tinh quang học trong suốt chống trầy xước. |
| **Innotec Việt Nam** | `innotec.com.vn` | Chiều dài tổng thể 150–160 mm, vành bảo vệ cao hơn mặt kính 2 mm tránh xước khi đặt trên mặt bàn. |
| **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Dụng cụ thực hành bài Kính lúp và bài Thực hành quan sát tiêu bản sinh học. |

---
