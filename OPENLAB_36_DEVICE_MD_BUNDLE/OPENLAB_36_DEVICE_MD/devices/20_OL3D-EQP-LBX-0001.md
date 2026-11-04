# 20. Hộp bộ 6 Thấu kính tiêu chuẩn (+5, +10, +15, -10, -20, ∞)

**Device ID:** `OL3D-EQP-LBX-0001`  
**Nhóm chức năng đề xuất:** `G06`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `optical-lens-box`  
**Slug:** `hop-bo-6-thau-kinh-quang-hoc`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · DIN 58145 · Bài 8, 9 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ * **Hình ảnh đối chiếu SGK**: Hình 8.2, Hình 8.3 & Hình 8.12 (**) * **Chức năng chuẩn**: Cung cấp đầy đủ các thấu kính hội tụ (rìa mỏng) và thấu kính phân kì (rìa dày) với tiêu cự khác nhau để học sinh thay thế nhanh vào Giá đỡ thấu kính (3) trên Giá quang học. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 240 mm, Cao = 82 mm, Sâu = 88 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.24 m, Cao (Y) = 0.082 m, Sâu (Z) = 0.088 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `measurement_anchor` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; State Sync via userData; Optical Ray Tracing & Refraction * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `Box with 6 slots + Velvet Tray` | MeshStandardMaterial (Wood / Velvet Blue) | 1 | Hộp gỗ lót nhung chứa 6 thấu kính | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **540 g** (Trạng thái: `verified`) ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad D_{dp} = \frac{1}{f\,(\text{m})} \implies D_{+10} = +10\text{ dp}, \; D_{+5} = +20\text{ dp}, \; D_{-10} = -10\text{ dp}$$ *Ý nghĩa vật lý*: Độ tụ của từng thấu kính trong bộ 6 thấu kính tiêu chuẩn. * **Các tính năng khoa học tích hợp**: - Gồm đầy đủ 6 thấu kính quang học bằng thủy tinh Borosilicate BK7 tinh khiết (chiết suất n = 1.5168), mài bóng quang học chống cầu sai. - Mỗi thấu kính được đúc cố định trong vành nhựa bảo vệ chống sứt mẻ va đập, trên vành có khắc chìm trị số tiêu cự (ví dụ "+10 cm", "-10 cm"). - Đuôi vành thấu kính có trụ cắm tiêu chuẩn Ø 10 mm cắm vừa khít vào vòng giữ thấu kính (CONN_LENS_HOLDER_SOCKET) trên con trượt ray quang học. - Cho phép thay đổi tiêu cự nhanh chóng để khảo sát sự biến đổi vị trí và kích thước ảnh thật/ảo theo công thức 1/d + 1/d' = 1/f. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `BOX_STORED` * **Danh sách trạng thái khả dụng**: `BOX_STORED`, `LENS_EXTRACTED`, `MOUNTED_IN_HOLDER` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `BOX_STORED` | `LENS_EXTRACTED` | Lens picked from box slot | `true` | | `LENS_EXTRACTED` | `MOUNTED_IN_HOLDER` | Inserted into optical lens carriage socket | `dist < 0.15m` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±1.0% tiêu cự định danh * **Độ chia nhỏ nhất / Độ phân giải**: Bộ 6 thấu kính: +5, +10, +15, -10, -20, ∞ cm * **Độ lặp lại phép đo**: 100% tương thích ngàm cắm Ø10mm * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Thủy tinh quang học BK7 tinh khiết ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Lắp nhầm thấu kính phân kì thành hội tụ** | Không đọc ký hiệu khắc trên vành khung nhựa | Không tạo được ảnh thật trên màn chắn | `Kiểm tra thuộc tính lensProfileId` | Đọc kỹ trị số in trên vành nhựa (+ hội tụ, - phân kì) | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Hộp thấu kính thí nghiệm: Gồm các thấu kính hội tụ và phân kì tiêu cự 50, 100, 150, -100, -200 mm có vành giữ. | | **VietValue — Bộ thấu kính quang học** | `vietvalue.edu.vn` | Bộ 6 thấu kính đường kính Ø 40–50 mm: Thủy tinh quang học độ trong suốt cao, khắc rõ tiêu cự trên thân khung nhựa. | | **Innotec Việt Nam** | `innotec.com.vn` | Hộp bộ thấu kính chuẩn KHTN 9: Khay mút định hình chống trầy xước, trụ cắm tương thích hoàn hảo giá trượt quang học. | | **Lời Giải Hay — Bài 8, 9 KHTN 9** | `loigiaihay.com` | So sánh tính chất ảnh tạo bởi thấu kính hội tụ f=+10cm và thấu kính phân kì f=-10cm trên băng quang học. | | **Eisco Labs Optical Sets** | `eiscolabs.com` | Set of 6 Mounted Lenses for Optical Bench: 50mm diameter, focal lengths +50, +100, +150, -100, -200 mm and plane glass. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Chọn và thay thế thấu kính có tiêu cự khác nhau trong thí nghiệm quang học.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 240 mm, Cao = 82 mm, Sâu = 88 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.24 m, Cao (Y) = 0.082 m, Sâu (Z) = 0.088 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `measurement_anchor`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `opticalFocus`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `BOX_STORED`, `LENS_EXTRACTED`, `MOUNTED_IN_HOLDER`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| lens set / lens holder | Các thấu kính trong hộp | Mở hộp, chọn đúng lens ID, nhấc và lắp vào gá tương thích. | Thấu kính được chọn có f và dấu hội tụ/phân kì tương ứng. |
| label / focal-length marking | Nhãn tiêu cự | Rê/nhấn để xem tiêu cự và loại lens. | Thông tin tiêu cự được hiển thị, không thay đổi khi xoay. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Mở hộp và chọn thấu kính theo bài học.
2. Đọc dấu tiêu cự và loại thấu kính.
3. Lắp thấu kính vào giá quang học.
4. Căn trục quang học.
5. Khảo sát vị trí và tính chất ảnh với tiêu cự đã chọn.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Thấu kính hội tụ có f dương; phân kì có f âm; lens vô tiêu/∞ cần hành vi theo mô tả nguồn.
- Thay lens cập nhật mô hình quang học.
- Không cho lắp lens không tương thích với socket.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad D_{dp} = \frac{1}{f\,(\text{m})} \implies D_{+10} = +10\text{ dp}, \; D_{+5} = +20\text{ dp}, \; D_{-10} = -10\text{ dp}$$
  *Ý nghĩa vật lý*: Độ tụ của từng thấu kính trong bộ 6 thấu kính tiêu chuẩn.
* **Các tính năng khoa học tích hợp**:
  - Gồm đầy đủ 6 thấu kính quang học bằng thủy tinh Borosilicate BK7 tinh khiết (chiết suất n = 1.5168), mài bóng quang học chống cầu sai.
  - Mỗi thấu kính được đúc cố định trong vành nhựa bảo vệ chống sứt mẻ va đập, trên vành có khắc chìm trị số tiêu cự (ví dụ "+10 cm", "-10 cm").
  - Đuôi vành thấu kính có trụ cắm tiêu chuẩn Ø 10 mm cắm vừa khít vào vòng giữ thấu kính (CONN_LENS_HOLDER_SOCKET) trên con trượt ray quang học.
  - Cho phép thay đổi tiêu cự nhanh chóng để khảo sát sự biến đổi vị trí và kích thước ảnh thật/ảo theo công thức 1/d + 1/d' = 1/f.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `BOX_STORED`
* **Danh sách trạng thái khả dụng**: `BOX_STORED`, `LENS_EXTRACTED`, `MOUNTED_IN_HOLDER`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `BOX_STORED` | `LENS_EXTRACTED` | Lens picked from box slot | `true` |
| `LENS_EXTRACTED` | `MOUNTED_IN_HOLDER` | Inserted into optical lens carriage socket | `dist < 0.15m` |

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
| **Lắp nhầm thấu kính phân kì thành hội tụ** | Không đọc ký hiệu khắc trên vành khung nhựa | Không tạo được ảnh thật trên màn chắn | `Kiểm tra thuộc tính lensProfileId` | Đọc kỹ trị số in trên vành nhựa (+ hội tụ, - phân kì) |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-LBX-0001-T01:** Chọn +10 cm: hệ quang học dùng f=+100 mm.
- [ ] **OL3D-EQP-LBX-0001-T02:** Chọn −10 cm: tia ló phân kì và ảnh ảo theo mô hình.
- [ ] **OL3D-EQP-LBX-0001-T03:** Đổi lens: kết quả ảnh thay đổi tương ứng.
- [ ] **OL3D-EQP-LBX-0001-T04:** Lắp sai loại/gá: từ chối hoặc cảnh báo.

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

## 4.20. [OL3D-EQP-LBX-0001] Hộp bộ 6 Thấu kính tiêu chuẩn (+5, +10, +15, -10, -20, ∞)
**Tên tiếng Anh**: *Wooden Storage Box of 6 Standard Optical Lenses* | **Mã Archetype**: `optical-lens-box` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-LBX-0001`
* **Mã đường dẫn (Slug)**: `hop-bo-6-thau-kinh-quang-hoc`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · DIN 58145 · Bài 8, 9 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ
* **Hình ảnh đối chiếu SGK**: Hình 8.2, Hình 8.3 & Hình 8.12 (**)
* **Chức năng chuẩn**: Cung cấp đầy đủ các thấu kính hội tụ (rìa mỏng) và thấu kính phân kì (rìa dày) với tiêu cự khác nhau để học sinh thay thế nhanh vào Giá đỡ thấu kính (3) trên Giá quang học.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 240 mm, Cao = 82 mm, Sâu = 88 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.24 m, Cao (Y) = 0.082 m, Sâu (Z) = 0.088 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; State Sync via userData; Optical Ray Tracing & Refraction
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Box with 6 slots + Velvet Tray` | MeshStandardMaterial (Wood / Velvet Blue) | 1 | Hộp gỗ lót nhung chứa 6 thấu kính |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **540 g** (Trạng thái: `verified`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad D_{dp} = \frac{1}{f\,(\text{m})} \implies D_{+10} = +10\text{ dp}, \; D_{+5} = +20\text{ dp}, \; D_{-10} = -10\text{ dp}$$
  *Ý nghĩa vật lý*: Độ tụ của từng thấu kính trong bộ 6 thấu kính tiêu chuẩn.
* **Các tính năng khoa học tích hợp**:
  - Gồm đầy đủ 6 thấu kính quang học bằng thủy tinh Borosilicate BK7 tinh khiết (chiết suất n = 1.5168), mài bóng quang học chống cầu sai.
  - Mỗi thấu kính được đúc cố định trong vành nhựa bảo vệ chống sứt mẻ va đập, trên vành có khắc chìm trị số tiêu cự (ví dụ "+10 cm", "-10 cm").
  - Đuôi vành thấu kính có trụ cắm tiêu chuẩn Ø 10 mm cắm vừa khít vào vòng giữ thấu kính (CONN_LENS_HOLDER_SOCKET) trên con trượt ray quang học.
  - Cho phép thay đổi tiêu cự nhanh chóng để khảo sát sự biến đổi vị trí và kích thước ảnh thật/ảo theo công thức 1/d + 1/d' = 1/f.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `BOX_STORED`
* **Danh sách trạng thái khả dụng**: `BOX_STORED`, `LENS_EXTRACTED`, `MOUNTED_IN_HOLDER`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `BOX_STORED` | `LENS_EXTRACTED` | Lens picked from box slot | `true` |
| `LENS_EXTRACTED` | `MOUNTED_IN_HOLDER` | Inserted into optical lens carriage socket | `dist < 0.15m` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±1.0% tiêu cự định danh
* **Độ chia nhỏ nhất / Độ phân giải**: Bộ 6 thấu kính: +5, +10, +15, -10, -20, ∞ cm
* **Độ lặp lại phép đo**: 100% tương thích ngàm cắm Ø10mm
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Thủy tinh quang học BK7 tinh khiết

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Lắp nhầm thấu kính phân kì thành hội tụ** | Không đọc ký hiệu khắc trên vành khung nhựa | Không tạo được ảnh thật trên màn chắn | `Kiểm tra thuộc tính lensProfileId` | Đọc kỹ trị số in trên vành nhựa (+ hội tụ, - phân kì) |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Hộp thấu kính thí nghiệm: Gồm các thấu kính hội tụ và phân kì tiêu cự 50, 100, 150, -100, -200 mm có vành giữ. |
| **VietValue — Bộ thấu kính quang học** | `vietvalue.edu.vn` | Bộ 6 thấu kính đường kính Ø 40–50 mm: Thủy tinh quang học độ trong suốt cao, khắc rõ tiêu cự trên thân khung nhựa. |
| **Innotec Việt Nam** | `innotec.com.vn` | Hộp bộ thấu kính chuẩn KHTN 9: Khay mút định hình chống trầy xước, trụ cắm tương thích hoàn hảo giá trượt quang học. |
| **Lời Giải Hay — Bài 8, 9 KHTN 9** | `loigiaihay.com` | So sánh tính chất ảnh tạo bởi thấu kính hội tụ f=+10cm và thấu kính phân kì f=-10cm trên băng quang học. |
| **Eisco Labs Optical Sets** | `eiscolabs.com` | Set of 6 Mounted Lenses for Optical Bench: 50mm diameter, focal lengths +50, +100, +150, -100, -200 mm and plane glass. |

---
