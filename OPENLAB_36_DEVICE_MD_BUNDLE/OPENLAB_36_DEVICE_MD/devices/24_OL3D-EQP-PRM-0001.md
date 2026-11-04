# 24. Lăng kính tam giác trên giá đỡ — Tán sắc ánh sáng (SGK KHTN 9)

**Device ID:** `OL3D-EQP-PRM-0001`  
**Nhóm chức năng đề xuất:** `G06`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `optical-prism`  
**Slug:** `equilateral-optical-prism-stand`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-PRM-0001_equilateral-optical-prism-stand` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 7.1, 7.2 Bài 7 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 7: Lăng kính (trang 34–38) * **Hình ảnh đối chiếu SGK**: Hình 7.1, Hình 7.4, Hình 7.5 (**) * **Chức năng chuẩn**: Tạo quang phổ của ánh sáng trắng (tán sắc ánh sáng: đỏ, da cam, vàng, lục, lam, chàm, tím) và khảo sát sự lệch của tia sáng về phía đáy lăng kính. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 92 mm, Cao = 140 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.14 m, Sâu (Z) = 0.11 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial` * **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `PrismGeometry (Extruded Equilateral Triangle)` | MeshPhysicalMaterial (Optical Flint Glass, IOR 1.62, transmission 0.90) | 4 | Lăng kính tam giác đều 30x30x30mm trên giá đỡ trụ | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **280 g** (Trạng thái: `reported`) ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad D = i_1 + i_2 - A$$ *Ý nghĩa vật lý*: Góc lệch của tia sáng khi qua lăng kính tam giác đều ($A = 60^\circ$). $$\mathbf{(2)}\quad n(\lambda) = A_{Cauchy} + \frac{B_{Cauchy}}{\lambda^2} + \frac{C_{Cauchy}}{\lambda^4}$$ *Ý nghĩa vật lý*: Phương trình tán sắc Cauchy: Chiết suất ánh sáng đỏ ($n_{đỏ} \approx 1.513$) nhỏ hơn chiết suất ánh sáng tím ($n_{tím} \approx 1.532$), khiến tia tím bị lệch nhiều nhất tạo thành dải 7 màu cầu vồng. * **Các tính năng khoa học tích hợp**: - Khối lăng kính tam giác đều A = 60° bằng thủy tinh quang học tán sắc cao, đặt trên bàn xoay có trụ đỡ. - Tích hợp màn chắn trắng phía sau để hứng trực tiếp dải quang phổ liên tục 7 màu (Đỏ, Da cam, Vàng, Lục, Lam, Chàm, Tím) khi chiếu chùm ánh sáng trắng đi qua. - Minh họa trực quan hiện tượng Tán sắc ánh sáng và đường truyền tia sáng bị lệch về phía đáy lăng kính (Bài 7 SGK KHTN 9). ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `IDLE_MOUNT` * **Danh sách trạng thái khả dụng**: `IDLE_MOUNT`, `MONOCHROMATIC_DEFLECTION`, `POLYCHROMATIC_DISPERSION` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `IDLE_MOUNT` | `MONOCHROMATIC_DEFLECTION` | Red laser applied | `single wavelength` | | `IDLE_MOUNT` | `POLYCHROMATIC_DISPERSION` | White light slit applied | `continuous spectrum` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: Góc lăng kính A = 60° ± 0.05° * **Độ chia nhỏ nhất / Độ phân giải**: 0.1° góc lệch D * **Độ lặp lại phép đo**: ±0.1° * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Góc tới quá lớn gây phản xạ toàn phần trong lăng kính** | Xoay lăng kính góc i > 75° | Không có chùm tia ló ra khỏi mặt bên thứ hai | `sin(r2) >= 1.0` | Xoay lăng kính về góc tới đối xứng i1 ≈ 48° cho góc lệch cực tiểu D_min | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **STEMVN — Lăng kính Tán sắc Ánh sáng KHTN 9** | `stemvn.vn` | Lăng kính tam giác đều thủy tinh quang học BK7/Flint: Cạnh 30–35 mm, chiều cao 50 mm, góc chiết quang chuẩn 60°. | | **VietJack — SGK KHTN 9 Bài 7 (Lăng kính)** | `vietjack.com` | Hình 7.1 & 7.2 SGK KHTN 9: Thí nghiệm Newton chiếu ánh sáng trắng qua lăng kính tách thành dải màu cầu vồng (tia đỏ lệch ít nhất, tia tím lệch nhiều nhất). | | **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Lăng kính gắn đế thí nghiệm quang học lớp 9 theo danh mục Bộ GD&ĐT. | | **VietValue — Thiết bị Giáo dục** | `vietvalue.edu.vn` | Ba mặt bên lăng kính được đánh bóng quang học phẳng tuyệt đối giúp chùm tia ló không bị tán xạ mờ. | | **Thiết bị Dạy học Tối thiểu** | `thietbidayhoctoithieu.vn` | Dụng cụ thực hành Chủ đề Ánh sáng KHTN 9: Quan sát sự tạo thành màu sắc của vật và tán sắc qua lăng kính. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Quan sát khúc xạ, góc lệch và tán sắc ánh sáng qua lăng kính tam giác.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 92 mm, Cao = 140 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.14 m, Sâu (Z) = 0.11 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `opticalFocus`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `IDLE_MOUNT`, `MONOCHROMATIC_DEFLECTION`, `POLYCHROMATIC_DISPERSION`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body / prism mount | Lăng kính và giá đỡ | Nhấc/đặt lên vùng gá, xoay quanh trục đứng để đổi góc tới. | Hướng các mặt lăng kính so với tia tới thay đổi. |
| incident beam alignment | Căn tia tới | Di chuyển nguồn/giá quang học để tia chiếu vào mặt lăng kính. | Tia vào, tia ló và dải phổ cập nhật. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt lăng kính trên giá và xác định góc đỉnh A.
2. Căn tia trắng vào một mặt lăng kính.
3. Xoay lăng kính hoặc thay góc tới.
4. Quan sát tia ló và dải màu.
5. So sánh góc lệch của đỏ và tím.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Mỗi bước sóng có chiết suất tương ứng; tím lệch nhiều hơn đỏ theo dữ liệu hồ sơ.
- Dải phổ chỉ xuất hiện khi nguồn trắng/đa sắc được chọn; nguồn đơn sắc không tạo dải 7 màu.
- Không đổi góc lăng kính mà giữ nguyên đường tia theo kiểu hoạt ảnh cố định.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad D = i_1 + i_2 - A$$
  *Ý nghĩa vật lý*: Góc lệch của tia sáng khi qua lăng kính tam giác đều ($A = 60^\circ$).
  $$\mathbf{(2)}\quad n(\lambda) = A_{Cauchy} + \frac{B_{Cauchy}}{\lambda^2} + \frac{C_{Cauchy}}{\lambda^4}$$
  *Ý nghĩa vật lý*: Phương trình tán sắc Cauchy: Chiết suất ánh sáng đỏ ($n_{đỏ} \approx 1.513$) nhỏ hơn chiết suất ánh sáng tím ($n_{tím} \approx 1.532$), khiến tia tím bị lệch nhiều nhất tạo thành dải 7 màu cầu vồng.
* **Các tính năng khoa học tích hợp**:
  - Khối lăng kính tam giác đều A = 60° bằng thủy tinh quang học tán sắc cao, đặt trên bàn xoay có trụ đỡ.
  - Tích hợp màn chắn trắng phía sau để hứng trực tiếp dải quang phổ liên tục 7 màu (Đỏ, Da cam, Vàng, Lục, Lam, Chàm, Tím) khi chiếu chùm ánh sáng trắng đi qua.
  - Minh họa trực quan hiện tượng Tán sắc ánh sáng và đường truyền tia sáng bị lệch về phía đáy lăng kính (Bài 7 SGK KHTN 9).

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE_MOUNT`
* **Danh sách trạng thái khả dụng**: `IDLE_MOUNT`, `MONOCHROMATIC_DEFLECTION`, `POLYCHROMATIC_DISPERSION`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE_MOUNT` | `MONOCHROMATIC_DEFLECTION` | Red laser applied | `single wavelength` |
| `IDLE_MOUNT` | `POLYCHROMATIC_DISPERSION` | White light slit applied | `continuous spectrum` |

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
| **Góc tới quá lớn gây phản xạ toàn phần trong lăng kính** | Xoay lăng kính góc i > 75° | Không có chùm tia ló ra khỏi mặt bên thứ hai | `sin(r2) >= 1.0` | Xoay lăng kính về góc tới đối xứng i1 ≈ 48° cho góc lệch cực tiểu D_min |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-PRM-0001-T01:** Nguồn trắng: xuất hiện phổ màu liên tục/7 vùng theo thiết kế.
- [ ] **OL3D-EQP-PRM-0001-T02:** Nguồn đơn sắc: chỉ có tia cùng màu.
- [ ] **OL3D-EQP-PRM-0001-T03:** Đổi góc đặt: đường tia và góc lệch thay đổi.
- [ ] **OL3D-EQP-PRM-0001-T04:** Kiểm tra thứ tự lệch tím lớn hơn đỏ theo tham số vật liệu.

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

## 4.24. [OL3D-EQP-PRM-0001] Lăng kính tam giác trên giá đỡ — Tán sắc ánh sáng (SGK KHTN 9)
**Tên tiếng Anh**: *Equilateral Glass Prism on Stand (Dispersion)* | **Mã Archetype**: `optical-prism` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-PRM-0001`
* **Mã đường dẫn (Slug)**: `equilateral-optical-prism-stand`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-PRM-0001_equilateral-optical-prism-stand` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 7.1, 7.2 Bài 7 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 7: Lăng kính (trang 34–38)
* **Hình ảnh đối chiếu SGK**: Hình 7.1, Hình 7.4, Hình 7.5 (**)
* **Chức năng chuẩn**: Tạo quang phổ của ánh sáng trắng (tán sắc ánh sáng: đỏ, da cam, vàng, lục, lam, chàm, tím) và khảo sát sự lệch của tia sáng về phía đáy lăng kính.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 92 mm, Cao = 140 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.14 m, Sâu (Z) = 0.11 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `PrismGeometry (Extruded Equilateral Triangle)` | MeshPhysicalMaterial (Optical Flint Glass, IOR 1.62, transmission 0.90) | 4 | Lăng kính tam giác đều 30x30x30mm trên giá đỡ trụ |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **280 g** (Trạng thái: `reported`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad D = i_1 + i_2 - A$$
  *Ý nghĩa vật lý*: Góc lệch của tia sáng khi qua lăng kính tam giác đều ($A = 60^\circ$).
  $$\mathbf{(2)}\quad n(\lambda) = A_{Cauchy} + \frac{B_{Cauchy}}{\lambda^2} + \frac{C_{Cauchy}}{\lambda^4}$$
  *Ý nghĩa vật lý*: Phương trình tán sắc Cauchy: Chiết suất ánh sáng đỏ ($n_{đỏ} \approx 1.513$) nhỏ hơn chiết suất ánh sáng tím ($n_{tím} \approx 1.532$), khiến tia tím bị lệch nhiều nhất tạo thành dải 7 màu cầu vồng.
* **Các tính năng khoa học tích hợp**:
  - Khối lăng kính tam giác đều A = 60° bằng thủy tinh quang học tán sắc cao, đặt trên bàn xoay có trụ đỡ.
  - Tích hợp màn chắn trắng phía sau để hứng trực tiếp dải quang phổ liên tục 7 màu (Đỏ, Da cam, Vàng, Lục, Lam, Chàm, Tím) khi chiếu chùm ánh sáng trắng đi qua.
  - Minh họa trực quan hiện tượng Tán sắc ánh sáng và đường truyền tia sáng bị lệch về phía đáy lăng kính (Bài 7 SGK KHTN 9).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE_MOUNT`
* **Danh sách trạng thái khả dụng**: `IDLE_MOUNT`, `MONOCHROMATIC_DEFLECTION`, `POLYCHROMATIC_DISPERSION`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE_MOUNT` | `MONOCHROMATIC_DEFLECTION` | Red laser applied | `single wavelength` |
| `IDLE_MOUNT` | `POLYCHROMATIC_DISPERSION` | White light slit applied | `continuous spectrum` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Góc lăng kính A = 60° ± 0.05°
* **Độ chia nhỏ nhất / Độ phân giải**: 0.1° góc lệch D
* **Độ lặp lại phép đo**: ±0.1°
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Góc tới quá lớn gây phản xạ toàn phần trong lăng kính** | Xoay lăng kính góc i > 75° | Không có chùm tia ló ra khỏi mặt bên thứ hai | `sin(r2) >= 1.0` | Xoay lăng kính về góc tới đối xứng i1 ≈ 48° cho góc lệch cực tiểu D_min |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **STEMVN — Lăng kính Tán sắc Ánh sáng KHTN 9** | `stemvn.vn` | Lăng kính tam giác đều thủy tinh quang học BK7/Flint: Cạnh 30–35 mm, chiều cao 50 mm, góc chiết quang chuẩn 60°. |
| **VietJack — SGK KHTN 9 Bài 7 (Lăng kính)** | `vietjack.com` | Hình 7.1 & 7.2 SGK KHTN 9: Thí nghiệm Newton chiếu ánh sáng trắng qua lăng kính tách thành dải màu cầu vồng (tia đỏ lệch ít nhất, tia tím lệch nhiều nhất). |
| **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Lăng kính gắn đế thí nghiệm quang học lớp 9 theo danh mục Bộ GD&ĐT. |
| **VietValue — Thiết bị Giáo dục** | `vietvalue.edu.vn` | Ba mặt bên lăng kính được đánh bóng quang học phẳng tuyệt đối giúp chùm tia ló không bị tán xạ mờ. |
| **Thiết bị Dạy học Tối thiểu** | `thietbidayhoctoithieu.vn` | Dụng cụ thực hành Chủ đề Ánh sáng KHTN 9: Quan sát sự tạo thành màu sắc của vật và tán sắc qua lăng kính. |

---
