# 22. Nguồn sáng Đèn Laser 3 tia song song (SGK KHTN 9)

**Device ID:** `OL3D-EQP-LSR-0001`  
**Nhóm chức năng đề xuất:** `G06`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `laser-source`  
**Slug:** `laser-ray-box-3beam`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.1 trang 6 SGK KHTN 9 (Bài 5, 6, 8) * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương II: Ánh sáng · Bài 1 (trang 6), Bài 5, Bài 6, Bài 8, Bài 9 * **Hình ảnh đối chiếu SGK**: Hình 1.1b (Đèn laser) & Hình 8.3 (**) * **Chức năng chuẩn**: Tạo ra chùm sáng hẹp hoặc 3 tia sáng song song đi là là trên mặt bảng để quan sát trực quan đường truyền tia tới, tia khúc xạ, tia phản xạ và tiêu điểm thấu kính. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 40 mm, Sâu = 85 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.04 m, Sâu (Z) = 0.085 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `laser_beams` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `BoxGeometry (Bevel)` | MeshPhysicalMaterial (Matte Black ABS, metalness 0.2) | 1 | Hộp nguồn laser 110x80x22mm có đế nam châm | | `laser_beams` | `LineSegments / Cylinder` | MeshBasicMaterial (Red emissive, opacity 0.85) | 6 | 3 chùm tia laser đỏ song song phát xạ thẳng | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **210 g** (Trạng thái: `reported`) ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad E = \frac{h \cdot c}{\lambda} = \frac{6.626 \times 10^{-34} \cdot 3 \times 10^8}{650 \times 10^{-9}} \approx 3.06 \times 10^{-19}\text{ J} \approx 1.91\text{ eV}$$ *Ý nghĩa vật lý*: Năng lượng một photon ánh sáng laser màu đỏ ($lambda = 650\text{ nm}$). $$\mathbf{(2)}\quad \vec{v}_{beam} = c \cdot \vec{u}_{forward}$$ *Ý nghĩa vật lý*: Véctơ hướng truyền thẳng của 3 chùm tia laser song song trong môi trường đồng tính. * **Các tính năng khoa học tích hợp**: - Phát đồng thời 3 chùm tia laser đỏ song song hoặc chuyển sang 1 tia mảnh nhờ công tắc trên lưng hộp. - Tích hợp thấu kính trụ tán phẳng tạo vệt tia sáng rõ nét trên mặt bảng chia độ hoặc mặt bàn mà không cần phòng tối hoàn toàn. - Đế có gắn đệm từ tính giúp đặt ổn định trên bàn thí nghiệm hoặc gắn lên bảng từ lớp học. - Dùng xuyên suốt Chương II SGK KHTN 9: Khúc xạ (Bài 5), Phản xạ toàn phần (Bài 6) và Đường truyền 3 tia sáng qua thấu kính (Bài 8). ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `POWER_OFF` * **Danh sách trạng thái khả dụng**: `POWER_OFF`, `SINGLE_BEAM`, `TRIPLE_PARALLEL_BEAMS`, `LOW_BATTERY` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `POWER_OFF` | `TRIPLE_PARALLEL_BEAMS` | Power switch turned on | `true` | | `TRIPLE_PARALLEL_BEAMS` | `SINGLE_BEAM` | Mode switch toggled | `true` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: Độ đơn sắc bước sóng 650 nm ± 5 nm * **Độ chia nhỏ nhất / Độ phân giải**: Khoảng cách giữa các tia 18.0 mm ± 0.2 mm * **Độ lặp lại phép đo**: Độ song song chùm tia sai lệch < 0.1° * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Ổn định công suất quang < 1 mW ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Tia laser chiếu trực diện vào mắt học sinh** | Xoay hướng hộp laser ngược về phía camera / người xem | Vi phạm quy chuẩn an toàn quang học trường học | `Góc tia laser hướng về camera góc nhìn học sinh` | Tự động ngắt phát xạ hoặc hiển thị cảnh báo an toàn Class II Safety Warning | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Thiết bị Dạy học Tối thiểu (Bộ GD&ĐT)** | `thietbidayhoctoithieu.vn` | Nguồn sáng laser 3 tia song song dùng cho bộ thí nghiệm quang học KHTN 9 theo Thông tư 38/2021/TT-BGDĐT. | | **Nhà sách Giáo dục — Thiết bị Vật lí 9** | `nhasachgiaoduc.vn` | Đèn laser 3 tia thí nghiệm quang hình: Kích thước 110 × 80 × 20 mm, trọng lượng 90–100 g, bước sóng đỏ 635–650 nm. | | **Thiết bị Giáo dục Tây Bắc** | `thietbigiaoductaybac.vn` | Hộp nguồn sáng 3 tia có đế nam châm và công tắc bật/tắt từng tia, dùng pin sạc hoặc 2 pin AAA. | | **VietValue — Dụng cụ Quang học** | `vietvalue.edu.vn` | Độ đơn sắc và tính định hướng cao, vệt tia rõ trên bảng chia độ bán trụ và qua thấu kính hội tụ. | | **STEMVN — Thiết bị Khoa học Tự nhiên** | `stemvn.vn` | Cấp an toàn Laser Class II (< 1mW) dành cho học sinh phổ thông kèm quy tắc không chiếu trực tiếp vào mắt. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Tạo 1–3 tia laser song song để khảo sát đường truyền, khúc xạ và hội tụ.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 40 mm, Sâu = 85 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.04 m, Sâu (Z) = 0.085 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `laser_beams`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `opticalFocus`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `POWER_OFF`, `SINGLE_BEAM`, `TRIPLE_PARALLEL_BEAMS`, `LOW_BATTERY`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body / power switch | Thân và công tắc | Bật/tắt nguồn laser. | Chỉ phát tia khi bật và trạng thái an toàn cho phép. |
| beam_mode / individual beam switches | Chọn tia | Bật từng tia hoặc tổ hợp tia 1–3 nếu phần cứng nguồn hỗ trợ. | Các chùm tia xuất hiện song song và có khoảng cách xác định. |
| laser_beams | Các tia laser | Quan sát, xoay thân trong phạm vi căn chỉnh; không hướng vào mắt người xem. | Tia hiển thị đúng hướng, tương tác với vật quang học. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt laser lên bàn/ray, căn hướng tia.
2. Chọn số tia cần phát.
3. Bật nguồn.
4. Đưa thấu kính, bản bán trụ hoặc lăng kính vào đường tia.
5. Quan sát và đo đường đi của tia.
6. Tắt laser sau thí nghiệm.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Tia truyền thẳng trong môi trường đồng tính.
- Khi gặp bề mặt quang học, phản xạ/khúc xạ theo thông số vật liệu.
- Hướng tia về phía mắt/người xem phải bị chặn hoặc cảnh báo an toàn.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad E = \frac{h \cdot c}{\lambda} = \frac{6.626 \times 10^{-34} \cdot 3 \times 10^8}{650 \times 10^{-9}} \approx 3.06 \times 10^{-19}\text{ J} \approx 1.91\text{ eV}$$
  *Ý nghĩa vật lý*: Năng lượng một photon ánh sáng laser màu đỏ ($lambda = 650\text{ nm}$).
  $$\mathbf{(2)}\quad \vec{v}_{beam} = c \cdot \vec{u}_{forward}$$
  *Ý nghĩa vật lý*: Véctơ hướng truyền thẳng của 3 chùm tia laser song song trong môi trường đồng tính.
* **Các tính năng khoa học tích hợp**:
  - Phát đồng thời 3 chùm tia laser đỏ song song hoặc chuyển sang 1 tia mảnh nhờ công tắc trên lưng hộp.
  - Tích hợp thấu kính trụ tán phẳng tạo vệt tia sáng rõ nét trên mặt bảng chia độ hoặc mặt bàn mà không cần phòng tối hoàn toàn.
  - Đế có gắn đệm từ tính giúp đặt ổn định trên bàn thí nghiệm hoặc gắn lên bảng từ lớp học.
  - Dùng xuyên suốt Chương II SGK KHTN 9: Khúc xạ (Bài 5), Phản xạ toàn phần (Bài 6) và Đường truyền 3 tia sáng qua thấu kính (Bài 8).

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `POWER_OFF`
* **Danh sách trạng thái khả dụng**: `POWER_OFF`, `SINGLE_BEAM`, `TRIPLE_PARALLEL_BEAMS`, `LOW_BATTERY`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `POWER_OFF` | `TRIPLE_PARALLEL_BEAMS` | Power switch turned on | `true` |
| `TRIPLE_PARALLEL_BEAMS` | `SINGLE_BEAM` | Mode switch toggled | `true` |

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
| **Tia laser chiếu trực diện vào mắt học sinh** | Xoay hướng hộp laser ngược về phía camera / người xem | Vi phạm quy chuẩn an toàn quang học trường học | `Góc tia laser hướng về camera góc nhìn học sinh` | Tự động ngắt phát xạ hoặc hiển thị cảnh báo an toàn Class II Safety Warning |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-LSR-0001-T01:** Nguồn OFF: không có tia.
- [ ] **OL3D-EQP-LSR-0001-T02:** Bật 1/2/3 tia: đúng số tia và song song.
- [ ] **OL3D-EQP-LSR-0001-T03:** Đưa vật quang học vào đường tia: ray path cập nhật.
- [ ] **OL3D-EQP-LSR-0001-T04:** Hướng tia về camera/vùng mắt: cảnh báo hoặc tự ngắt phát xạ.

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

## 4.22. [OL3D-EQP-LSR-0001] Nguồn sáng Đèn Laser 3 tia song song (SGK KHTN 9)
**Tên tiếng Anh**: *3-Beam Optical Laser Ray Box* | **Mã Archetype**: `laser-source` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-LSR-0001`
* **Mã đường dẫn (Slug)**: `laser-ray-box-3beam`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.1 trang 6 SGK KHTN 9 (Bài 5, 6, 8)
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương II: Ánh sáng · Bài 1 (trang 6), Bài 5, Bài 6, Bài 8, Bài 9
* **Hình ảnh đối chiếu SGK**: Hình 1.1b (Đèn laser) & Hình 8.3 (**)
* **Chức năng chuẩn**: Tạo ra chùm sáng hẹp hoặc 3 tia sáng song song đi là là trên mặt bảng để quan sát trực quan đường truyền tia tới, tia khúc xạ, tia phản xạ và tiêu điểm thấu kính.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 40 mm, Sâu = 85 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.04 m, Sâu (Z) = 0.085 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `laser_beams`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry (Bevel)` | MeshPhysicalMaterial (Matte Black ABS, metalness 0.2) | 1 | Hộp nguồn laser 110x80x22mm có đế nam châm |
| `laser_beams` | `LineSegments / Cylinder` | MeshBasicMaterial (Red emissive, opacity 0.85) | 6 | 3 chùm tia laser đỏ song song phát xạ thẳng |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **210 g** (Trạng thái: `reported`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad E = \frac{h \cdot c}{\lambda} = \frac{6.626 \times 10^{-34} \cdot 3 \times 10^8}{650 \times 10^{-9}} \approx 3.06 \times 10^{-19}\text{ J} \approx 1.91\text{ eV}$$
  *Ý nghĩa vật lý*: Năng lượng một photon ánh sáng laser màu đỏ ($lambda = 650\text{ nm}$).
  $$\mathbf{(2)}\quad \vec{v}_{beam} = c \cdot \vec{u}_{forward}$$
  *Ý nghĩa vật lý*: Véctơ hướng truyền thẳng của 3 chùm tia laser song song trong môi trường đồng tính.
* **Các tính năng khoa học tích hợp**:
  - Phát đồng thời 3 chùm tia laser đỏ song song hoặc chuyển sang 1 tia mảnh nhờ công tắc trên lưng hộp.
  - Tích hợp thấu kính trụ tán phẳng tạo vệt tia sáng rõ nét trên mặt bảng chia độ hoặc mặt bàn mà không cần phòng tối hoàn toàn.
  - Đế có gắn đệm từ tính giúp đặt ổn định trên bàn thí nghiệm hoặc gắn lên bảng từ lớp học.
  - Dùng xuyên suốt Chương II SGK KHTN 9: Khúc xạ (Bài 5), Phản xạ toàn phần (Bài 6) và Đường truyền 3 tia sáng qua thấu kính (Bài 8).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `POWER_OFF`
* **Danh sách trạng thái khả dụng**: `POWER_OFF`, `SINGLE_BEAM`, `TRIPLE_PARALLEL_BEAMS`, `LOW_BATTERY`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `POWER_OFF` | `TRIPLE_PARALLEL_BEAMS` | Power switch turned on | `true` |
| `TRIPLE_PARALLEL_BEAMS` | `SINGLE_BEAM` | Mode switch toggled | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Độ đơn sắc bước sóng 650 nm ± 5 nm
* **Độ chia nhỏ nhất / Độ phân giải**: Khoảng cách giữa các tia 18.0 mm ± 0.2 mm
* **Độ lặp lại phép đo**: Độ song song chùm tia sai lệch < 0.1°
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Ổn định công suất quang < 1 mW

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Tia laser chiếu trực diện vào mắt học sinh** | Xoay hướng hộp laser ngược về phía camera / người xem | Vi phạm quy chuẩn an toàn quang học trường học | `Góc tia laser hướng về camera góc nhìn học sinh` | Tự động ngắt phát xạ hoặc hiển thị cảnh báo an toàn Class II Safety Warning |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thiết bị Dạy học Tối thiểu (Bộ GD&ĐT)** | `thietbidayhoctoithieu.vn` | Nguồn sáng laser 3 tia song song dùng cho bộ thí nghiệm quang học KHTN 9 theo Thông tư 38/2021/TT-BGDĐT. |
| **Nhà sách Giáo dục — Thiết bị Vật lí 9** | `nhasachgiaoduc.vn` | Đèn laser 3 tia thí nghiệm quang hình: Kích thước 110 × 80 × 20 mm, trọng lượng 90–100 g, bước sóng đỏ 635–650 nm. |
| **Thiết bị Giáo dục Tây Bắc** | `thietbigiaoductaybac.vn` | Hộp nguồn sáng 3 tia có đế nam châm và công tắc bật/tắt từng tia, dùng pin sạc hoặc 2 pin AAA. |
| **VietValue — Dụng cụ Quang học** | `vietvalue.edu.vn` | Độ đơn sắc và tính định hướng cao, vệt tia rõ trên bảng chia độ bán trụ và qua thấu kính hội tụ. |
| **STEMVN — Thiết bị Khoa học Tự nhiên** | `stemvn.vn` | Cấp an toàn Laser Class II (< 1mW) dành cho học sinh phổ thông kèm quy tắc không chiếu trực tiếp vào mắt. |

---
