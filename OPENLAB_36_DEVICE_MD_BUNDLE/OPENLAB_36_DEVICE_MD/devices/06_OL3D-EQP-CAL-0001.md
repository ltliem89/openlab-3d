# 06. Thước cặp du xích 150 mm (0.02 mm)

**Device ID:** `OL3D-EQP-CAL-0001`  
**Nhóm chức năng đề xuất:** `G01`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `vernier-caliper`  
**Slug:** `thuoc-cap-du-xich-150mm`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-CAL-0001_thuoc-cap-du-xich-150mm` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: DIN 862 · ISO 13385 · Dụng cụ Đo cơ khí chính xác ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 235 mm, Cao = 16 mm, Sâu = 78 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.235 m, Cao (Y) = 0.016 m, Sâu (Z) = 0.078 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `scale_marks`, `plunger`, `scale_display`, `scale_display_front`, `scale_display_rear`, `depth_rod`, `jaw_measure_guide` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `BoxGeometry + Bevel Shape` | MeshPhysicalMaterial (Brushed Steel, metalness 0.92) | 1 | Thân thước chính dài 235mm kèm mỏ kẹp cố định | | `plunger` | `ShapeGeometry Extrude` | MeshPhysicalMaterial (Hardened Stainless Steel) | 2 | Khối hàm trượt du xích di động dọc trục X | | `scale_display` | `PlaneGeometry` | MeshBasicMaterial (CanvasTexture) | 3 | Bảng hiển thị số đo LCD hỗ trợ học sinh đọc nhanh | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `caliperMeasure`, `readScale` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **162 g** (Trạng thái: `measured`) * **Thông số metrology thiết bị đo**: - Đại lượng đo: `length` - Giới hạn đo (GHĐ): **0 mm** đến **150 mm** - Độ chia nhỏ nhất (ĐCNN): **0.02 mm** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad d = MSR + \left(VSR \times LC\right)$$ *Ý nghĩa vật lý*: Công thức đọc kích thước trên thước cặp ($LC = 0.02\text{ mm}$, $MSR$: vạch mm trên thước chính, $VSR$: vạch du xích trùng). $$\mathbf{(2)}\quad LC = 1\text{ mm} - \frac{49\text{ mm}}{50} = 0.02\text{ mm}$$ *Ý nghĩa vật lý*: Độ chia du xích 50 vạch chia đều trên chiều dài 49 mm của thước chính. * **Các tính năng khoa học tích hợp**: - Chế tạo bằng thép không gỉ закаленная (Hardened Stainless Steel) mài phẳng chống chói. - Đo 3 chế độ: Đường kính ngoài (mỏ dưới), đường kính lỗ trong (mỏ trên) và chiều sâu (thanh đo sâu). - Thước phụ (Du xích / Vernier) 50 vạch chia cho phép đọc chính xác tới 0.02 mm kèm vít hãm cố định. - Dùng kiểm tra đường kính d và chiều cao h của trụ kim loại đặc, trụ rỗng và bi cầu thép. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `CLOSED_ZERO` * **Danh sách trạng thái khả dụng**: `CLOSED_ZERO`, `SLIDING`, `CLAMPED_OBJECT`, `LOCKED_READOUT` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `CLOSED_ZERO` | `SLIDING` | Slider moved | `opening > 0` | | `SLIDING` | `CLAMPED_OBJECT` | Jaws contact object surface | `opening == object_dim` | | `CLAMPED_OBJECT` | `LOCKED_READOUT` | Locking screw tightened | `isLocked == true` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±0.02 mm (DIN 862 Class 1) * **Độ chia nhỏ nhất / Độ phân giải**: 0.02 mm (Thước phụ 50 vạch) * **Độ lặp lại phép đo**: ±0.01 mm * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Thép không gỉ mạ crom: 1.1 × 10⁻⁵ K⁻¹ ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Lực kẹp quá mạnh gây biến dạng mẫu mềm** | Siết hàm kẹp quá chặt vào mẫu nhựa POM hoặc chì | Kích thước đo được nhỏ hơn thực tế 0.05 mm | `Lực kẹp tiếp xúc > 15 N` | Sử dụng con lăn ngón cái đẩy nhẹ vừa chạm bề mặt | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Mitutoyo Việt Nam — Thiết bị Đo cơ khí** | `mitutoyo.vn` | Thước cặp cơ khí 150mm (Model 530-101): Dải đo 0–150 mm, độ chia 0.02 mm, tổng chiều dài 229–235 mm. | | **VinaTools — Dụng cụ Đo lường** | `vinatools.com` | Thước kẹp du xích 150mm chuẩn DIN 862: Chiều dài mỏ đo ngoài 40 mm, mỏ đo trong 16.5 mm, sai số ±0.03 mm. | | **THB Việt Nam — Máy đo Chuyên dụng** | `thbvn.com` | Hướng dẫn đọc thước cặp du xích 0.02 mm và ứng dụng đo mẫu hình trụ trong phòng thí nghiệm. | | **UniTools Việt Nam** | `unitools.vn` | Thước cặp thép không gỉ 0–150mm: Có con lăn đẩy ngón cái và vít khóa hàm trượt khi đọc số đo. | | **Máy Đo Chuyên Dụng** | `maydochuyendung.com` | Cấu tạo 3 bộ phận đo của thước cặp: Mỏ đo ngoài, mỏ đo trong (khoang rỗng) và lưỡi đo chiều sâu. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Đo kích thước ngoài, kích thước trong và độ sâu bằng thước cặp du xích.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 235 mm, Cao = 16 mm, Sâu = 78 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.235 m, Cao (Y) = 0.016 m, Sâu (Z) = 0.078 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `scale_marks`, `plunger`, `scale_display`, `scale_display_front`, `scale_display_rear`, `depth_rod`, `jaw_measure_guide`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`, `caliperMeasure`, `readScale`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `CLOSED_ZERO`, `SLIDING`, `CLAMPED_OBJECT`, `LOCKED_READOUT`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| plunger | Con trượt du xích | Kéo/đẩy dọc thước chính; giới hạn 0–150 mm. | Hàm động và du xích di chuyển; trị số đọc cập nhật. |
| jaw_measure_guide | Mỏ đo ngoài/trong | Kẹp hai mặt vật hoặc đưa mỏ đo trong vào lỗ. | Khoảng cách mỏ thay đổi theo kích thước thực. |
| depth_rod | Thanh đo sâu | Tựa đế thước lên mặt chuẩn và trượt thanh sâu vào lỗ. | Độ sâu đo thay đổi theo hành trình thanh. |
| scale_marks / scale_display_front / rear | Thước chính và du xích | Đọc vạch 0 du xích và vạch trùng; dùng khóa nếu có. | Hiển thị MSR, VSR và kết quả d = MSR + VSR×LC. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đóng mỏ đo và kiểm tra zero.
2. Chọn phép đo ngoài, trong hoặc sâu.
3. Mở mỏ, đặt vật đúng bề mặt chuẩn.
4. Đóng nhẹ đến khi tiếp xúc, không ép biến dạng vật.
5. Khóa con trượt nếu cần và đọc thước chính cùng du xích.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Giá trị hiển thị chỉ được hình thành từ vị trí con trượt/vạch chia.
- ĐCNN theo hồ sơ là 0.02 mm.
- Sai điểm zero phải được thể hiện như sai số zero, không âm thầm hiệu chỉnh.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad d = MSR + \left(VSR \times LC\right)$$
  *Ý nghĩa vật lý*: Công thức đọc kích thước trên thước cặp ($LC = 0.02\text{ mm}$, $MSR$: vạch mm trên thước chính, $VSR$: vạch du xích trùng).
  $$\mathbf{(2)}\quad LC = 1\text{ mm} - \frac{49\text{ mm}}{50} = 0.02\text{ mm}$$
  *Ý nghĩa vật lý*: Độ chia du xích 50 vạch chia đều trên chiều dài 49 mm của thước chính.
* **Các tính năng khoa học tích hợp**:
  - Chế tạo bằng thép không gỉ закаленная (Hardened Stainless Steel) mài phẳng chống chói.
  - Đo 3 chế độ: Đường kính ngoài (mỏ dưới), đường kính lỗ trong (mỏ trên) và chiều sâu (thanh đo sâu).
  - Thước phụ (Du xích / Vernier) 50 vạch chia cho phép đọc chính xác tới 0.02 mm kèm vít hãm cố định.
  - Dùng kiểm tra đường kính d và chiều cao h của trụ kim loại đặc, trụ rỗng và bi cầu thép.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `CLOSED_ZERO`
* **Danh sách trạng thái khả dụng**: `CLOSED_ZERO`, `SLIDING`, `CLAMPED_OBJECT`, `LOCKED_READOUT`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `CLOSED_ZERO` | `SLIDING` | Slider moved | `opening > 0` |
| `SLIDING` | `CLAMPED_OBJECT` | Jaws contact object surface | `opening == object_dim` |
| `CLAMPED_OBJECT` | `LOCKED_READOUT` | Locking screw tightened | `isLocked == true` |

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
| **Lực kẹp quá mạnh gây biến dạng mẫu mềm** | Siết hàm kẹp quá chặt vào mẫu nhựa POM hoặc chì | Kích thước đo được nhỏ hơn thực tế 0.05 mm | `Lực kẹp tiếp xúc > 15 N` | Sử dụng con lăn ngón cái đẩy nhẹ vừa chạm bề mặt |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-CAL-0001-T01:** Đóng mỏ: kiểm tra sai lệch điểm zero.
- [ ] **OL3D-EQP-CAL-0001-T02:** Đo mẫu chuẩn đã biết: sai số trong ngân sách.
- [ ] **OL3D-EQP-CAL-0001-T03:** Đo ngoài/trong/sâu: đúng bộ phận được sử dụng.
- [ ] **OL3D-EQP-CAL-0001-T04:** Kéo vượt hành trình: cơ cấu dừng tại giới hạn.

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

## 4.6. [OL3D-EQP-CAL-0001] Thước cặp du xích 150 mm (0.02 mm)
**Tên tiếng Anh**: *Vernier Caliper 150 mm x 0.02 mm* | **Mã Archetype**: `vernier-caliper` | **Phân loại danh mục**: `length-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-CAL-0001`
* **Mã đường dẫn (Slug)**: `thuoc-cap-du-xich-150mm`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-CAL-0001_thuoc-cap-du-xich-150mm` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: DIN 862 · ISO 13385 · Dụng cụ Đo cơ khí chính xác

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 235 mm, Cao = 16 mm, Sâu = 78 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.235 m, Cao (Y) = 0.016 m, Sâu (Z) = 0.078 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_marks`, `plunger`, `scale_display`, `scale_display_front`, `scale_display_rear`, `depth_rod`, `jaw_measure_guide`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry + Bevel Shape` | MeshPhysicalMaterial (Brushed Steel, metalness 0.92) | 1 | Thân thước chính dài 235mm kèm mỏ kẹp cố định |
| `plunger` | `ShapeGeometry Extrude` | MeshPhysicalMaterial (Hardened Stainless Steel) | 2 | Khối hàm trượt du xích di động dọc trục X |
| `scale_display` | `PlaneGeometry` | MeshBasicMaterial (CanvasTexture) | 3 | Bảng hiển thị số đo LCD hỗ trợ học sinh đọc nhanh |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `caliperMeasure`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **162 g** (Trạng thái: `measured`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `length`
  - Giới hạn đo (GHĐ): **0 mm** đến **150 mm**
  - Độ chia nhỏ nhất (ĐCNN): **0.02 mm**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad d = MSR + \left(VSR \times LC\right)$$
  *Ý nghĩa vật lý*: Công thức đọc kích thước trên thước cặp ($LC = 0.02\text{ mm}$, $MSR$: vạch mm trên thước chính, $VSR$: vạch du xích trùng).
  $$\mathbf{(2)}\quad LC = 1\text{ mm} - \frac{49\text{ mm}}{50} = 0.02\text{ mm}$$
  *Ý nghĩa vật lý*: Độ chia du xích 50 vạch chia đều trên chiều dài 49 mm của thước chính.
* **Các tính năng khoa học tích hợp**:
  - Chế tạo bằng thép không gỉ закаленная (Hardened Stainless Steel) mài phẳng chống chói.
  - Đo 3 chế độ: Đường kính ngoài (mỏ dưới), đường kính lỗ trong (mỏ trên) và chiều sâu (thanh đo sâu).
  - Thước phụ (Du xích / Vernier) 50 vạch chia cho phép đọc chính xác tới 0.02 mm kèm vít hãm cố định.
  - Dùng kiểm tra đường kính d và chiều cao h của trụ kim loại đặc, trụ rỗng và bi cầu thép.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `CLOSED_ZERO`
* **Danh sách trạng thái khả dụng**: `CLOSED_ZERO`, `SLIDING`, `CLAMPED_OBJECT`, `LOCKED_READOUT`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `CLOSED_ZERO` | `SLIDING` | Slider moved | `opening > 0` |
| `SLIDING` | `CLAMPED_OBJECT` | Jaws contact object surface | `opening == object_dim` |
| `CLAMPED_OBJECT` | `LOCKED_READOUT` | Locking screw tightened | `isLocked == true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.02 mm (DIN 862 Class 1)
* **Độ chia nhỏ nhất / Độ phân giải**: 0.02 mm (Thước phụ 50 vạch)
* **Độ lặp lại phép đo**: ±0.01 mm
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Thép không gỉ mạ crom: 1.1 × 10⁻⁵ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Lực kẹp quá mạnh gây biến dạng mẫu mềm** | Siết hàm kẹp quá chặt vào mẫu nhựa POM hoặc chì | Kích thước đo được nhỏ hơn thực tế 0.05 mm | `Lực kẹp tiếp xúc > 15 N` | Sử dụng con lăn ngón cái đẩy nhẹ vừa chạm bề mặt |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Mitutoyo Việt Nam — Thiết bị Đo cơ khí** | `mitutoyo.vn` | Thước cặp cơ khí 150mm (Model 530-101): Dải đo 0–150 mm, độ chia 0.02 mm, tổng chiều dài 229–235 mm. |
| **VinaTools — Dụng cụ Đo lường** | `vinatools.com` | Thước kẹp du xích 150mm chuẩn DIN 862: Chiều dài mỏ đo ngoài 40 mm, mỏ đo trong 16.5 mm, sai số ±0.03 mm. |
| **THB Việt Nam — Máy đo Chuyên dụng** | `thbvn.com` | Hướng dẫn đọc thước cặp du xích 0.02 mm và ứng dụng đo mẫu hình trụ trong phòng thí nghiệm. |
| **UniTools Việt Nam** | `unitools.vn` | Thước cặp thép không gỉ 0–150mm: Có con lăn đẩy ngón cái và vít khóa hàm trượt khi đọc số đo. |
| **Máy Đo Chuyên Dụng** | `maydochuyendung.com` | Cấu tạo 3 bộ phận đo của thước cặp: Mỏ đo ngoài, mỏ đo trong (khoang rỗng) và lưỡi đo chiều sâu. |

---
