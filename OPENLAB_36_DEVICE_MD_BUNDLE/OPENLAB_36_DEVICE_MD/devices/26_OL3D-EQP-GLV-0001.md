# 26. Điện kế nhạy vạch 0 ở giữa — Galvanometer (SGK KHTN 9)

**Device ID:** `OL3D-EQP-GLV-0001`  
**Nhóm chức năng đề xuất:** `G07`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `galvanometer`  
**Slug:** `center-zero-galvanometer`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-GLV-0001_center-zero-galvanometer` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.4 trang 6 & Bài 14 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương IV: Điện từ · Bài 1 (trang 7) & Bài 14: Cảm ứng điện từ (trang 67–69) * **Hình ảnh đối chiếu SGK**: Hình 1.4 (Điện kế), Hình 14.1, Hình 14.3 (**) * **Chức năng chuẩn**: Phát hiện dòng điện cảm ứng nhỏ và xác định chiều dòng điện: Khi dòng điện đi vào chốt G0 (hoặc G1) và đi ra từ chốt âm (-) thì kim lệch sang phải; khi đi vào chốt âm (-) và đi ra từ chốt G0 thì kim lệch sang trái. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 145 mm, Sâu = 95 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.145 m, Sâu (Z) = 0.095 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `scale_marks`, `scale_marks_rear`, `plunger`, `plunger_rear` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `BoxGeometry (Sloped housing)` | MeshStandardMaterial (Grey Laboratory Housing) | 1 | Vỏ hộp máy đo góc nghiêng 45° | | `plunger` | `Cylinder Needle` | MeshBasicMaterial (Red Needle, front) | 3 | Kim chỉ thị mặt trước quay quanh trục Z | | `plunger_rear` | `Cylinder Needle` | MeshBasicMaterial (Red Needle, rear) | 3 | Kim chỉ thị mặt sau hiển thị 360° | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **290 g** (Trạng thái: `verified`) * **Thông số metrology thiết bị đo**: - Đại lượng đo: `electric-current` - Giới hạn đo (GHĐ): **-50 μA** đến **50 μA** - Độ chia nhỏ nhất (ĐCNN): **5 μA** - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad I = \frac{\theta}{S_i} = \frac{\tau_{restoring}}{N A B} = \frac{C \cdot \theta}{N A B}$$ *Ý nghĩa vật lý*: Định luật đo dòng điện của điện kế khung quay kim nhạy. $$\mathbf{(2)}\quad \theta = \text{sign}(I) \cdot \min\left(45^\circ, \frac{|I|}{50\,\mu\text{A}} \times 45^\circ\right)$$ *Ý nghĩa vật lý*: Góc lệch kim chỉ thị mặt trước và mặt sau đối xứng quanh vạch 0 ở giữa. * **Các tính năng khoa học tích hợp**: - Kim chỉ thị nằm chính giữa tại vạch số 0 khi chưa có dòng điện, cho phép phát hiện cả độ lớn và chiều của dòng điện cảm ứng rất nhỏ. - Khi đưa cực Bắc nam châm lại gần cuộn dây, kim lệch sang phải (+); khi kéo nam châm ra xa, kim lệch sang trái (-) chứng tỏ dòng điện cảm ứng đổi chiều (Bài 14 SGK KHTN 9). - Có vít chỉnh điểm 0 (Zero-adjust) ngay dưới mặt kính và 2 cọc nối dây bắp chuối 4 mm tiêu chuẩn. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `ZERO_CENTER` * **Danh sách trạng thái khả dụng**: `ZERO_CENTER`, `DEFLECT_POSITIVE`, `DEFLECT_NEGATIVE`, `PINNED_FULL_SCALE` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `ZERO_CENTER` | `DEFLECT_POSITIVE` | Positive current flows | `I > 0.5 uA` | | `ZERO_CENTER` | `DEFLECT_NEGATIVE` | Negative current flows | `I < -0.5 uA` | | `DEFLECT_POSITIVE` | `PINNED_FULL_SCALE` | Current exceeds 50 uA | `I > 50 uA` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: Cấp chính xác 1.5 (±1.5% toàn thang đo) * **Độ chia nhỏ nhất / Độ phân giải**: 2 µA (Thang đo -50 .. 0 .. +50 µA) * **Độ lặp lại phép đo**: ±1 µA * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Điện trở nội Rg = 50 Ω ± 2 Ω ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Cháy cuộn dây động** | Cắm trực tiếp nguồn điện 12V vào điện kế nhạy không qua điện trở hạn dòng | Cháy đứt cuộn dây khung quay siêu mảnh | `I_in > 500 uA (gấp 10 lần GHĐ)` | Luôn mắc nối tiếp điện trở hạn dòng tối thiểu 10 kΩ khi thử nghiệm mạch | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **VietValue — Điện kế Nhạy Thí nghiệm Vật lí** | `vietvalue.edu.vn` | Điện kế chứng minh vạch 0 ở giữa dùng khảo sát hiện tượng cảm ứng điện từ (Bài 14 KHTN 9): Độ nhạy cấp µA/mA. | | **STB Việt Nam — Thiết bị Giáo dục** | `stb.com.vn` | Điện kế phòng thí nghiệm: Mặt hiển thị chia vạch đối xứng qua điểm 0, có núm cân chỉnh kim chỉ thị và cọc đấu dây an toàn. | | **Innotec Việt Nam** | `innotec.com.vn` | Điện kế học sinh để bàn: Vỏ nhựa ABS nghiêng dễ quan sát, cơ cấu từ điện chống rung kim. | | **VietJack — SGK KHTN 9 Hình 1.4 & Bài 14** | `vietjack.com` | Hình 1.4 trang 6 SGK KHTN 9: Điện kế là dụng cụ dùng để phát hiện dòng điện cảm ứng nhỏ và nhận biết sự đổi chiều dòng điện. | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Danh mục thiết bị Chủ đề Điện từ cấp THCS: Điện kế nhạy vạch 0 ở giữa kết nối với cuộn dây dẫn kín. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Phát hiện chiều và độ lớn tương đối của dòng điện nhỏ bằng kim lệch hai phía vạch 0.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 145 mm, Sâu = 95 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.145 m, Sâu (Z) = 0.095 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `scale_marks`, `scale_marks_rear`, `plunger`, `plunger_rear`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `readScale`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `ZERO_CENTER`, `DEFLECT_POSITIVE`, `DEFLECT_NEGATIVE`, `PINNED_FULL_SCALE`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| terminals | Cọc đấu điện | Nối điện kế vào mạch theo chiều cực tính. | Mạch kín có dòng thì kim lệch; đảo chiều dòng đổi chiều lệch. |
| plunger / needle | Kim chỉ thị | Kim quay quanh trục theo dòng điện; học sinh chỉ đọc, không kéo trực tiếp kim để tạo số đo. | Góc lệch tỷ lệ dòng trong giới hạn. |
| scale_marks / scale_marks_rear | Thang chia vạch 0 giữa | Đọc độ lệch trái/phải so với zero. | Giá trị và chiều dòng được biểu diễn. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Kiểm tra kim về vạch 0 khi chưa có dòng.
2. Nối điện kế vào mạch đúng cực.
3. Đóng mạch và quan sát chiều lệch.
4. Đổi chiều dòng và so sánh hướng lệch.
5. Ngắt mạch sau khi quan sát.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Dòng theo chiều quy ước tạo lệch một phía; đảo chiều dòng làm kim lệch phía đối diện.
- Dòng quá dải phải giới hạn góc kim và báo quá thang.
- Không được mô phỏng kim lệch nếu mạch hở.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad I = \frac{\theta}{S_i} = \frac{\tau_{restoring}}{N A B} = \frac{C \cdot \theta}{N A B}$$
  *Ý nghĩa vật lý*: Định luật đo dòng điện của điện kế khung quay kim nhạy.
  $$\mathbf{(2)}\quad \theta = \text{sign}(I) \cdot \min\left(45^\circ, \frac{|I|}{50\,\mu\text{A}} \times 45^\circ\right)$$
  *Ý nghĩa vật lý*: Góc lệch kim chỉ thị mặt trước và mặt sau đối xứng quanh vạch 0 ở giữa.
* **Các tính năng khoa học tích hợp**:
  - Kim chỉ thị nằm chính giữa tại vạch số 0 khi chưa có dòng điện, cho phép phát hiện cả độ lớn và chiều của dòng điện cảm ứng rất nhỏ.
  - Khi đưa cực Bắc nam châm lại gần cuộn dây, kim lệch sang phải (+); khi kéo nam châm ra xa, kim lệch sang trái (-) chứng tỏ dòng điện cảm ứng đổi chiều (Bài 14 SGK KHTN 9).
  - Có vít chỉnh điểm 0 (Zero-adjust) ngay dưới mặt kính và 2 cọc nối dây bắp chuối 4 mm tiêu chuẩn.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `ZERO_CENTER`
* **Danh sách trạng thái khả dụng**: `ZERO_CENTER`, `DEFLECT_POSITIVE`, `DEFLECT_NEGATIVE`, `PINNED_FULL_SCALE`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `ZERO_CENTER` | `DEFLECT_POSITIVE` | Positive current flows | `I > 0.5 uA` |
| `ZERO_CENTER` | `DEFLECT_NEGATIVE` | Negative current flows | `I < -0.5 uA` |
| `DEFLECT_POSITIVE` | `PINNED_FULL_SCALE` | Current exceeds 50 uA | `I > 50 uA` |

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
| **Cháy cuộn dây động** | Cắm trực tiếp nguồn điện 12V vào điện kế nhạy không qua điện trở hạn dòng | Cháy đứt cuộn dây khung quay siêu mảnh | `I_in > 500 uA (gấp 10 lần GHĐ)` | Luôn mắc nối tiếp điện trở hạn dòng tối thiểu 10 kΩ khi thử nghiệm mạch |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-GLV-0001-T01:** Mạch hở: kim ở zero.
- [ ] **OL3D-EQP-GLV-0001-T02:** Dòng dương: kim lệch về một phía.
- [ ] **OL3D-EQP-GLV-0001-T03:** Đảo cực: kim lệch phía đối diện.
- [ ] **OL3D-EQP-GLV-0001-T04:** Tăng dòng: góc lệch tăng tới giới hạn.

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

## 4.26. [OL3D-EQP-GLV-0001] Điện kế nhạy vạch 0 ở giữa — Galvanometer (SGK KHTN 9)
**Tên tiếng Anh**: *Center-Zero Sensitive Galvanometer (G)* | **Mã Archetype**: `galvanometer` | **Phân loại danh mục**: `electrical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-GLV-0001`
* **Mã đường dẫn (Slug)**: `center-zero-galvanometer`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-GLV-0001_center-zero-galvanometer` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.4 trang 6 & Bài 14 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương IV: Điện từ · Bài 1 (trang 7) & Bài 14: Cảm ứng điện từ (trang 67–69)
* **Hình ảnh đối chiếu SGK**: Hình 1.4 (Điện kế), Hình 14.1, Hình 14.3 (**)
* **Chức năng chuẩn**: Phát hiện dòng điện cảm ứng nhỏ và xác định chiều dòng điện: Khi dòng điện đi vào chốt G0 (hoặc G1) và đi ra từ chốt âm (-) thì kim lệch sang phải; khi đi vào chốt âm (-) và đi ra từ chốt G0 thì kim lệch sang trái.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 145 mm, Sâu = 95 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.145 m, Sâu (Z) = 0.095 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_marks`, `scale_marks_rear`, `plunger`, `plunger_rear`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry (Sloped housing)` | MeshStandardMaterial (Grey Laboratory Housing) | 1 | Vỏ hộp máy đo góc nghiêng 45° |
| `plunger` | `Cylinder Needle` | MeshBasicMaterial (Red Needle, front) | 3 | Kim chỉ thị mặt trước quay quanh trục Z |
| `plunger_rear` | `Cylinder Needle` | MeshBasicMaterial (Red Needle, rear) | 3 | Kim chỉ thị mặt sau hiển thị 360° |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **290 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `electric-current`
  - Giới hạn đo (GHĐ): **-50 μA** đến **50 μA**
  - Độ chia nhỏ nhất (ĐCNN): **5 μA**
  - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad I = \frac{\theta}{S_i} = \frac{\tau_{restoring}}{N A B} = \frac{C \cdot \theta}{N A B}$$
  *Ý nghĩa vật lý*: Định luật đo dòng điện của điện kế khung quay kim nhạy.
  $$\mathbf{(2)}\quad \theta = \text{sign}(I) \cdot \min\left(45^\circ, \frac{|I|}{50\,\mu\text{A}} \times 45^\circ\right)$$
  *Ý nghĩa vật lý*: Góc lệch kim chỉ thị mặt trước và mặt sau đối xứng quanh vạch 0 ở giữa.
* **Các tính năng khoa học tích hợp**:
  - Kim chỉ thị nằm chính giữa tại vạch số 0 khi chưa có dòng điện, cho phép phát hiện cả độ lớn và chiều của dòng điện cảm ứng rất nhỏ.
  - Khi đưa cực Bắc nam châm lại gần cuộn dây, kim lệch sang phải (+); khi kéo nam châm ra xa, kim lệch sang trái (-) chứng tỏ dòng điện cảm ứng đổi chiều (Bài 14 SGK KHTN 9).
  - Có vít chỉnh điểm 0 (Zero-adjust) ngay dưới mặt kính và 2 cọc nối dây bắp chuối 4 mm tiêu chuẩn.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `ZERO_CENTER`
* **Danh sách trạng thái khả dụng**: `ZERO_CENTER`, `DEFLECT_POSITIVE`, `DEFLECT_NEGATIVE`, `PINNED_FULL_SCALE`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `ZERO_CENTER` | `DEFLECT_POSITIVE` | Positive current flows | `I > 0.5 uA` |
| `ZERO_CENTER` | `DEFLECT_NEGATIVE` | Negative current flows | `I < -0.5 uA` |
| `DEFLECT_POSITIVE` | `PINNED_FULL_SCALE` | Current exceeds 50 uA | `I > 50 uA` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Cấp chính xác 1.5 (±1.5% toàn thang đo)
* **Độ chia nhỏ nhất / Độ phân giải**: 2 µA (Thang đo -50 .. 0 .. +50 µA)
* **Độ lặp lại phép đo**: ±1 µA
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Điện trở nội Rg = 50 Ω ± 2 Ω

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Cháy cuộn dây động** | Cắm trực tiếp nguồn điện 12V vào điện kế nhạy không qua điện trở hạn dòng | Cháy đứt cuộn dây khung quay siêu mảnh | `I_in > 500 uA (gấp 10 lần GHĐ)` | Luôn mắc nối tiếp điện trở hạn dòng tối thiểu 10 kΩ khi thử nghiệm mạch |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietValue — Điện kế Nhạy Thí nghiệm Vật lí** | `vietvalue.edu.vn` | Điện kế chứng minh vạch 0 ở giữa dùng khảo sát hiện tượng cảm ứng điện từ (Bài 14 KHTN 9): Độ nhạy cấp µA/mA. |
| **STB Việt Nam — Thiết bị Giáo dục** | `stb.com.vn` | Điện kế phòng thí nghiệm: Mặt hiển thị chia vạch đối xứng qua điểm 0, có núm cân chỉnh kim chỉ thị và cọc đấu dây an toàn. |
| **Innotec Việt Nam** | `innotec.com.vn` | Điện kế học sinh để bàn: Vỏ nhựa ABS nghiêng dễ quan sát, cơ cấu từ điện chống rung kim. |
| **VietJack — SGK KHTN 9 Hình 1.4 & Bài 14** | `vietjack.com` | Hình 1.4 trang 6 SGK KHTN 9: Điện kế là dụng cụ dùng để phát hiện dòng điện cảm ứng nhỏ và nhận biết sự đổi chiều dòng điện. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Danh mục thiết bị Chủ đề Điện từ cấp THCS: Điện kế nhạy vạch 0 ở giữa kết nối với cuộn dây dẫn kín. |

---
