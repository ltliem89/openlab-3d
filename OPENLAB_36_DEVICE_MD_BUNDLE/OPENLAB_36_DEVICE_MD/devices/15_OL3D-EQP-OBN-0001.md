# 15. (5) Giá quang học 90 cm có thước chia độ (-45 .. 0 .. +45 cm)

**Device ID:** `OL3D-EQP-OBN-0001`  
**Nhóm chức năng đề xuất:** `G06`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `optical-bench`  
**Slug:** `gia-quang-hoc-thuoc-chia-do-90cm`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · DIN 58145 · Hình 1.3 & Bài 8, 9 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ * **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (5): Giá quang học đồng trục có thước đo cm/mm (**) * **Chức năng chuẩn**: Giữ cho tâm Đèn chiếu (1), Vật sáng chữ F (2), Quang tâm Thấu kính (3) và tâm Màn chắn (4) luôn thẳng hàng trên trục chính quang học (y = 9,5 cm) và đo trực tiếp khoảng cách vật d, khoảng cách ảnh d'. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 900 mm, Cao = 36 mm, Sâu = 72 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.9 m, Cao (Y) = 0.036 m, Sâu (Z) = 0.072 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `optical_axis_line`, `measurement_anchor` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `BoxGeometry with Dovetail slot` | MeshStandardMaterial (Anodized Aluminium, color 0x334155) | 1 | Ray nhôm 1m có rãnh mộng mang cá và thước chia mm | | `optical_axis_line` | `LineBasicMaterial` | LineBasicMaterial (Red/Cyan guide) | 5 | Đường trục quang học ảo đồng quy cao độ y = 125mm | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **920 g** (Trạng thái: `verified`) * **Thông số metrology thiết bị đo**: - Đại lượng đo: `length` - Giới hạn đo (GHĐ): **-450 mm** đến **450 mm** - Độ chia nhỏ nhất (ĐCNN): **1 mm** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad x_{thấu\,kính} - x_{vật} = d, \quad x_{màn} - x_{thấu\,kính} = d'$$ *Ý nghĩa vật lý*: Quan hệ tọa độ một chiều 1D trên thước chia độ của giá quang học. $$\mathbf{(2)}\quad L_{tổng} = d + d' = x_{màn} - x_{vật} \ge 4f$$ *Ý nghĩa vật lý*: Điều kiện tối thiểu về khoảng cách giữa vật và màn để có thể hứng được ảnh thật trên màn chắn. * **Các tính năng khoa học tích hợp**: - Gia công từ hợp kim nhôm định hình cao cấp chịu lực, bề mặt anode hóa chống lóa và chống trầy xước. - Rãnh trượt dẫn hướng 1D mộng mang cá (Dovetail slot) dọc trục X giữ các con trượt thấu kính, màn chắn, đèn luôn đồng trục quang học. - Thước khắc laser hai bên mép ray với vạch chia milimet sắc nét giúp định vị chính xác khoảng cách vật d và khoảng cách ảnh d'. - Chân đế có ốc chỉnh cân bằng thăng bằng 3 điểm chống rung lắc trên mặt bàn gỗ phòng thí nghiệm. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `EMPTY_RAIL` * **Danh sách trạng thái khả dụng**: `EMPTY_RAIL`, `CARRIAGES_MOUNTED`, `OPTICAL_SYSTEM_ALIGNED` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `EMPTY_RAIL` | `CARRIAGES_MOUNTED` | Carriages snapped onto rail | `count > 0` | | `CARRIAGES_MOUNTED` | `OPTICAL_SYSTEM_ALIGNED` | Lamp, Object, Lens, Screen mounted | `count == 4` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±0.5 mm trên chiều dài 1000 mm * **Độ chia nhỏ nhất / Độ phân giải**: 1.0 mm (Vạch chia milimet hai bên rãnh) * **Độ lặp lại phép đo**: Độ thẳng rãnh trượt sai lệch < 0.05 mm * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Nhôm định hình: 2.3 × 10⁻⁵ K⁻¹ ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Khoảng cách vật - màn L < 4f không tìm thấy ảnh** | Đặt khoảng cách vật và màn nhỏ hơn 40 cm (với thấu kính f = 10 cm) | Di chuyển màn khắp ray vẫn không thu được ảnh rõ nét | `L = d + d' < 4f` | Kéo màn chắn ra xa vật tối thiểu L >= 4f = 40.0 cm | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Băng quang học học sinh THCS dài 1000 mm, có thước chia độ vạch mm, kèm 4 con trượt có ốc hãm. | | **VietValue — Dụng cụ Quang hình học THCS** | `vietvalue.edu.vn` | Giá quang học hợp kim nhôm 1m: Rãnh trượt êm, cữ định tâm đồng trục y = 125 mm cho toàn bộ linh kiện quang học. | | **Innotec Việt Nam — Thiết bị Dạy học** | `innotec.com.vn` | Bộ giá quang học KHTN 9: Thước khắc hai dải đối xứng âm dương và dải liên tục 0–100 cm, sai số chiều dài ±0.5 mm. | | **DMKLab — Thiết bị Trường học** | `dmklab.vn` | Ray quang học chuẩn giáo dục: Tích hợp chân đế đệm cao su và ngàm khóa con trượt nhanh không cần tuốc nơ vít. | | **Phywe Laboratory Equipment** | `phywe.com` | Optical Bench 100 cm: Precision extruded profile, mm graduations, rigid vibration-free mounting for lens experiments. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Làm ray chuẩn cho các phần tử quang học trượt và đo tọa độ trên trục 90 cm.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 900 mm, Cao = 36 mm, Sâu = 72 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.9 m, Cao (Y) = 0.036 m, Sâu (Z) = 0.072 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `optical_axis_line`, `measurement_anchor`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `readScale`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `EMPTY_RAIL`, `CARRIAGES_MOUNTED`, `OPTICAL_SYSTEM_ALIGNED`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body / rail | Thanh ray quang học | Đặt, căn thẳng và làm chuẩn vị trí; không kéo cong ray. | Trục quang học và thang tọa độ được xác lập. |
| optical carrier | Con trượt thiết bị | Di chuyển từng bộ gá dọc trục; khóa/mở khóa nếu có. | Vị trí vật, kính và màn được đọc trên cùng hệ tọa độ. |
| optical_axis_line / measurement_anchor | Trục và mốc đo | Chọn mốc x=0, đọc x của các thiết bị. | Tính d và d’ bằng hiệu tọa độ. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt ray thẳng, xác định mốc tọa độ.
2. Lắp vật sáng, thấu kính và màn vào con trượt tương thích.
3. Di chuyển từng phần tử dọc ray.
4. Đọc x_vật, x_kính, x_màn và tính khoảng cách.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Các khoảng cách được tính từ tọa độ chung: d=x_kính−x_vật, d’=x_màn−x_kính.
- Các bộ gá phải đồng trục và không xuyên/va chạm.
- Khoảng cách vật–màn phải đủ điều kiện để tạo ảnh thật theo cấu hình thấu kính.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad x_{thấu\,kính} - x_{vật} = d, \quad x_{màn} - x_{thấu\,kính} = d'$$
  *Ý nghĩa vật lý*: Quan hệ tọa độ một chiều 1D trên thước chia độ của giá quang học.
  $$\mathbf{(2)}\quad L_{tổng} = d + d' = x_{màn} - x_{vật} \ge 4f$$
  *Ý nghĩa vật lý*: Điều kiện tối thiểu về khoảng cách giữa vật và màn để có thể hứng được ảnh thật trên màn chắn.
* **Các tính năng khoa học tích hợp**:
  - Gia công từ hợp kim nhôm định hình cao cấp chịu lực, bề mặt anode hóa chống lóa và chống trầy xước.
  - Rãnh trượt dẫn hướng 1D mộng mang cá (Dovetail slot) dọc trục X giữ các con trượt thấu kính, màn chắn, đèn luôn đồng trục quang học.
  - Thước khắc laser hai bên mép ray với vạch chia milimet sắc nét giúp định vị chính xác khoảng cách vật d và khoảng cách ảnh d'.
  - Chân đế có ốc chỉnh cân bằng thăng bằng 3 điểm chống rung lắc trên mặt bàn gỗ phòng thí nghiệm.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY_RAIL`
* **Danh sách trạng thái khả dụng**: `EMPTY_RAIL`, `CARRIAGES_MOUNTED`, `OPTICAL_SYSTEM_ALIGNED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY_RAIL` | `CARRIAGES_MOUNTED` | Carriages snapped onto rail | `count > 0` |
| `CARRIAGES_MOUNTED` | `OPTICAL_SYSTEM_ALIGNED` | Lamp, Object, Lens, Screen mounted | `count == 4` |

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
| **Khoảng cách vật - màn L < 4f không tìm thấy ảnh** | Đặt khoảng cách vật và màn nhỏ hơn 40 cm (với thấu kính f = 10 cm) | Di chuyển màn khắp ray vẫn không thu được ảnh rõ nét | `L = d + d' < 4f` | Kéo màn chắn ra xa vật tối thiểu L >= 4f = 40.0 cm |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-OBN-0001-T01:** Di chuyển con trượt 10 cm: tọa độ thang đổi 10 cm.
- [ ] **OL3D-EQP-OBN-0001-T02:** Đo d và d’ bằng hiệu tọa độ đúng.
- [ ] **OL3D-EQP-OBN-0001-T03:** Thiết bị lệch trục: phát cảnh báo căn chỉnh.

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

## 4.15. [OL3D-EQP-OBN-0001] (5) Giá quang học 90 cm có thước chia độ (-45 .. 0 .. +45 cm)
**Tên tiếng Anh**: *(5) 90 cm Graduated Aluminum Optical Bench Rail* | **Mã Archetype**: `optical-bench` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-OBN-0001`
* **Mã đường dẫn (Slug)**: `gia-quang-hoc-thuoc-chia-do-90cm`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · DIN 58145 · Hình 1.3 & Bài 8, 9 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ
* **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (5): Giá quang học đồng trục có thước đo cm/mm (**)
* **Chức năng chuẩn**: Giữ cho tâm Đèn chiếu (1), Vật sáng chữ F (2), Quang tâm Thấu kính (3) và tâm Màn chắn (4) luôn thẳng hàng trên trục chính quang học (y = 9,5 cm) và đo trực tiếp khoảng cách vật d, khoảng cách ảnh d'.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 900 mm, Cao = 36 mm, Sâu = 72 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.9 m, Cao (Y) = 0.036 m, Sâu (Z) = 0.072 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `optical_axis_line`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry with Dovetail slot` | MeshStandardMaterial (Anodized Aluminium, color 0x334155) | 1 | Ray nhôm 1m có rãnh mộng mang cá và thước chia mm |
| `optical_axis_line` | `LineBasicMaterial` | LineBasicMaterial (Red/Cyan guide) | 5 | Đường trục quang học ảo đồng quy cao độ y = 125mm |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **920 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `length`
  - Giới hạn đo (GHĐ): **-450 mm** đến **450 mm**
  - Độ chia nhỏ nhất (ĐCNN): **1 mm**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad x_{thấu\,kính} - x_{vật} = d, \quad x_{màn} - x_{thấu\,kính} = d'$$
  *Ý nghĩa vật lý*: Quan hệ tọa độ một chiều 1D trên thước chia độ của giá quang học.
  $$\mathbf{(2)}\quad L_{tổng} = d + d' = x_{màn} - x_{vật} \ge 4f$$
  *Ý nghĩa vật lý*: Điều kiện tối thiểu về khoảng cách giữa vật và màn để có thể hứng được ảnh thật trên màn chắn.
* **Các tính năng khoa học tích hợp**:
  - Gia công từ hợp kim nhôm định hình cao cấp chịu lực, bề mặt anode hóa chống lóa và chống trầy xước.
  - Rãnh trượt dẫn hướng 1D mộng mang cá (Dovetail slot) dọc trục X giữ các con trượt thấu kính, màn chắn, đèn luôn đồng trục quang học.
  - Thước khắc laser hai bên mép ray với vạch chia milimet sắc nét giúp định vị chính xác khoảng cách vật d và khoảng cách ảnh d'.
  - Chân đế có ốc chỉnh cân bằng thăng bằng 3 điểm chống rung lắc trên mặt bàn gỗ phòng thí nghiệm.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY_RAIL`
* **Danh sách trạng thái khả dụng**: `EMPTY_RAIL`, `CARRIAGES_MOUNTED`, `OPTICAL_SYSTEM_ALIGNED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY_RAIL` | `CARRIAGES_MOUNTED` | Carriages snapped onto rail | `count > 0` |
| `CARRIAGES_MOUNTED` | `OPTICAL_SYSTEM_ALIGNED` | Lamp, Object, Lens, Screen mounted | `count == 4` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.5 mm trên chiều dài 1000 mm
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0 mm (Vạch chia milimet hai bên rãnh)
* **Độ lặp lại phép đo**: Độ thẳng rãnh trượt sai lệch < 0.05 mm
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Nhôm định hình: 2.3 × 10⁻⁵ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Khoảng cách vật - màn L < 4f không tìm thấy ảnh** | Đặt khoảng cách vật và màn nhỏ hơn 40 cm (với thấu kính f = 10 cm) | Di chuyển màn khắp ray vẫn không thu được ảnh rõ nét | `L = d + d' < 4f` | Kéo màn chắn ra xa vật tối thiểu L >= 4f = 40.0 cm |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Băng quang học học sinh THCS dài 1000 mm, có thước chia độ vạch mm, kèm 4 con trượt có ốc hãm. |
| **VietValue — Dụng cụ Quang hình học THCS** | `vietvalue.edu.vn` | Giá quang học hợp kim nhôm 1m: Rãnh trượt êm, cữ định tâm đồng trục y = 125 mm cho toàn bộ linh kiện quang học. |
| **Innotec Việt Nam — Thiết bị Dạy học** | `innotec.com.vn` | Bộ giá quang học KHTN 9: Thước khắc hai dải đối xứng âm dương và dải liên tục 0–100 cm, sai số chiều dài ±0.5 mm. |
| **DMKLab — Thiết bị Trường học** | `dmklab.vn` | Ray quang học chuẩn giáo dục: Tích hợp chân đế đệm cao su và ngàm khóa con trượt nhanh không cần tuốc nơ vít. |
| **Phywe Laboratory Equipment** | `phywe.com` | Optical Bench 100 cm: Precision extruded profile, mm graduations, rigid vibration-free mounting for lens experiments. |

---
