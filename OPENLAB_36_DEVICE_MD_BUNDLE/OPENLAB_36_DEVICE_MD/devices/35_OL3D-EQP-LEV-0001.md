# 35. Bộ đòn bẩy thăng bằng chia vạch đối xứng kèm giá đỡ

**Device ID:** `OL3D-EQP-LEV-0001`  
**Nhóm chức năng đề xuất:** `G02`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `lever-balance-apparatus`  
**Slug:** `thanh-don-bay-thang-bang`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-LEV-0001_thanh-don-bay-thang-bang` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · SGK KHTN 8 (Bài 18: Tác dụng làm quay của lực - Đòn bẩy) ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 400 mm, Cao = 360 mm, Sâu = 120 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.4 m, Cao (Y) = 0.36 m, Sâu (Z) = 0.12 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `scale_display`, `plunger`, `measurement_anchor` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `Cylinder Column + Box Base` | MeshStandardMaterial (Cast Iron Stand) | 1 | Trụ đỡ và trục quay kim loại trung tâm | | `plunger` | `Box Bar with 20 notches` | MeshStandardMaterial (Anodized Aluminium Bar) | 2 | Thanh đòn bẩy chia vạch đối xứng nghiêng góc theta | | `scale_display` | `PlaneGeometry` | MeshBasicMaterial (CanvasTexture) | 3 | Đĩa hiển thị góc nghiêng và mômen lực hai bên | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **680 g** (Trạng thái: `verified`) * **Thông số metrology thiết bị đo**: - Đại lượng đo: `force` - Giới hạn đo (GHĐ): **-30 deg** đến **30 deg** - Độ chia nhỏ nhất (ĐCNN): **1 deg** - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad \sum M_{(O)} = 0 \iff F_1 \cdot d_1 = F_2 \cdot d_2 \iff m_1 \cdot x_1 = m_2 \cdot x_2$$ *Ý nghĩa vật lý*: Quy tắc mômen lực cho đòn bẩy thăng bằng quanh trục quay O nằm chính giữa. $$\mathbf{(2)}\quad k_{đòn\,bẩy} = \frac{F_1}{F_2} = \frac{d_2}{d_1}$$ *Ý nghĩa vật lý*: Lợi ích về lực khi sử dụng đòn bẩy tỷ lệ nghịch với cánh tay đòn. * **Các tính năng khoa học tích hợp**: - Thanh hợp kim nhôm định hình mạ Anode xước mờ, chia vạch đối xứng 18 lỗ treo cách đều tâm quay O đúng 20 mm. - Hai đai ốc ren M4 bằng đồng thau khía nhám ở 2 đầu giúp vi chỉnh cân bằng zero trước khi làm thí nghiệm. - Cung chia độ góc nghiêng tại ổ trục hiển thị trực quan góc lệch và vạch 0° dạ quang khi đạt thăng bằng ngang. - Trục quay ma sát siêu thấp ăn khớp cữ hãm cơ học giới hạn góc nghiêng an toàn trong khoảng [-30°, +30°]. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `BALANCED_HORIZONTAL` * **Danh sách trạng thái khả dụng**: `BALANCED_HORIZONTAL`, `TILTED_LEFT`, `TILTED_RIGHT`, `DYNAMIC_OSCILLATION` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `BALANCED_HORIZONTAL` | `TILTED_LEFT` | Left torque exceeds right | `m1*d1 > m2*d2` | | `BALANCED_HORIZONTAL` | `TILTED_RIGHT` | Right torque exceeds left | `m2*d2 > m1*d1` | | `DYNAMIC_OSCILLATION` | `BALANCED_HORIZONTAL` | Torques equalize | `m1*d1 == m2*d2` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: Độ nhạy cân bằng 0.5 g ở cự ly 10 cm * **Độ chia nhỏ nhất / Độ phân giải**: Thước chia vạch đối xứng bước 10 mm * **Độ lặp lại phép đo**: Khớp quay bi thép ma sát cực nhỏ < 0.001 N.m * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Đòn bẩy bị kẹt không quay mượt mà** | Bụi bẩn bám vào trục quay bi kim loại | Mất độ nhạy thăng bằng | `Hệ số ma sát trục > 0.01 N.m` | Bấm nút Tinh chỉnh bôi trơn trục quay để khôi phục dao động tự do | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Danh mục thiết bị dạy học môn KHTN THCS: Bộ đòn bẩy có giá đỡ, thanh chia vạch đối xứng dài 400mm kèm quả cân có móc. | | **Thiết bị Giáo dục VietValue** | `vietvalue.edu.vn` | Bộ đòn bẩy thực hành Vật lí 8: Thanh hợp kim nhôm đục lỗ 20mm, đĩa chia độ ±30°, giá sắt chân đế gang vững chắc. | | **VietJack — SGK KHTN 8 Kết nối tri thức** | `vietjack.com` | Thí nghiệm khảo sát quy tắc mômen đòn bẩy: Treo quả nặng vào các lỗ và so sánh tích F1.d1 với F2.d2. | | **Innotec Việt Nam — Thiết bị Dạy học** | `innotec.com.vn` | Giá đỡ trục quay đòn bẩy có vít cân bằng, chịu tải 5N mỗi bên, bề mặt mạ kẽm/sơn tĩnh điện cao cấp. | | **Thư viện Vật lý Việt Nam** | `thuvienvatly.com` | Quy tắc mômen lực M = F.d và bài toán thăng bằng thanh chắn đường, bập bênh, cân đòn. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Khảo sát quy tắc mômen lực và điều kiện cân bằng đòn bẩy.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 400 mm, Cao = 360 mm, Sâu = 120 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.4 m, Cao (Y) = 0.36 m, Sâu (Z) = 0.12 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `scale_display`, `plunger`, `measurement_anchor`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `BALANCED_HORIZONTAL`, `TILTED_LEFT`, `TILTED_RIGHT`, `DYNAMIC_OSCILLATION`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| plunger / lever bar | Thanh đòn bẩy chia vạch | Xoay quanh trục giữa; kéo/đặt tải tại các lỗ hoặc vị trí chia vạch. | Góc nghiêng và cánh tay đòn thay đổi. |
| pivot / body stand | Điểm tựa và giá đỡ | Đặt trục tựa cố định; chỉ quay quanh trục. | Mômen trái/phải tác động lên góc thanh. |
| end nuts / adjustment screws | Đai ốc chỉnh zero | Xoay hai đầu để cân bằng thanh khi không tải nếu đúng cơ cấu. | Điều chỉnh cân bằng ban đầu, không thay thế mômen do tải. |
| scale_display / angular scale | Thước góc và hiển thị | Đọc góc lệch và vị trí tải. | Hiển thị trạng thái cân bằng, lệch trái/phải hoặc dao động. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Cân bằng thanh khi chưa đặt tải bằng đai ốc chỉnh zero.
2. Đặt các tải ở hai bên trục tại khoảng cách xác định.
3. Thay đổi khối lượng hoặc cánh tay đòn.
4. Quan sát chiều nghiêng và dao động.
5. Điều chỉnh tải/vị trí đến khi tổng mômen bằng nhau.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- M1g·d1 và M2g·d2 quyết định chiều mômen.
- Khi hai mômen bằng nhau, thanh về cân bằng ngang sau dao động tắt dần.
- Giới hạn góc cơ khí trong khoảng nguồn quy định.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \sum M_{(O)} = 0 \iff F_1 \cdot d_1 = F_2 \cdot d_2 \iff m_1 \cdot x_1 = m_2 \cdot x_2$$
  *Ý nghĩa vật lý*: Quy tắc mômen lực cho đòn bẩy thăng bằng quanh trục quay O nằm chính giữa.
  $$\mathbf{(2)}\quad k_{đòn\,bẩy} = \frac{F_1}{F_2} = \frac{d_2}{d_1}$$
  *Ý nghĩa vật lý*: Lợi ích về lực khi sử dụng đòn bẩy tỷ lệ nghịch với cánh tay đòn.
* **Các tính năng khoa học tích hợp**:
  - Thanh hợp kim nhôm định hình mạ Anode xước mờ, chia vạch đối xứng 18 lỗ treo cách đều tâm quay O đúng 20 mm.
  - Hai đai ốc ren M4 bằng đồng thau khía nhám ở 2 đầu giúp vi chỉnh cân bằng zero trước khi làm thí nghiệm.
  - Cung chia độ góc nghiêng tại ổ trục hiển thị trực quan góc lệch và vạch 0° dạ quang khi đạt thăng bằng ngang.
  - Trục quay ma sát siêu thấp ăn khớp cữ hãm cơ học giới hạn góc nghiêng an toàn trong khoảng [-30°, +30°].

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `BALANCED_HORIZONTAL`
* **Danh sách trạng thái khả dụng**: `BALANCED_HORIZONTAL`, `TILTED_LEFT`, `TILTED_RIGHT`, `DYNAMIC_OSCILLATION`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `BALANCED_HORIZONTAL` | `TILTED_LEFT` | Left torque exceeds right | `m1*d1 > m2*d2` |
| `BALANCED_HORIZONTAL` | `TILTED_RIGHT` | Right torque exceeds left | `m2*d2 > m1*d1` |
| `DYNAMIC_OSCILLATION` | `BALANCED_HORIZONTAL` | Torques equalize | `m1*d1 == m2*d2` |

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
| **Đòn bẩy bị kẹt không quay mượt mà** | Bụi bẩn bám vào trục quay bi kim loại | Mất độ nhạy thăng bằng | `Hệ số ma sát trục > 0.01 N.m` | Bấm nút Tinh chỉnh bôi trơn trục quay để khôi phục dao động tự do |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-LEV-0001-T01:** Tải trái lớn hơn mômen phải: thanh nghiêng về trái.
- [ ] **OL3D-EQP-LEV-0001-T02:** Tăng cánh tay đòn một bên: mômen bên đó tăng.
- [ ] **OL3D-EQP-LEV-0001-T03:** Hai mômen bằng nhau: thanh trở về cân bằng.
- [ ] **OL3D-EQP-LEV-0001-T04:** Cố gắng vượt giới hạn góc: cơ cấu chặn.

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

## 4.35. [OL3D-EQP-LEV-0001] Bộ đòn bẩy thăng bằng chia vạch đối xứng kèm giá đỡ
**Tên tiếng Anh**: *Calibrated Symmetrical Lever Balance with Stand* | **Mã Archetype**: `lever-balance-apparatus` | **Phân loại danh mục**: `force-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-LEV-0001`
* **Mã đường dẫn (Slug)**: `thanh-don-bay-thang-bang`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v2.4.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-LEV-0001_thanh-don-bay-thang-bang` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · SGK KHTN 8 (Bài 18: Tác dụng làm quay của lực - Đòn bẩy)

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 400 mm, Cao = 360 mm, Sâu = 120 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.4 m, Cao (Y) = 0.36 m, Sâu (Z) = 0.12 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `plunger`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Cylinder Column + Box Base` | MeshStandardMaterial (Cast Iron Stand) | 1 | Trụ đỡ và trục quay kim loại trung tâm |
| `plunger` | `Box Bar with 20 notches` | MeshStandardMaterial (Anodized Aluminium Bar) | 2 | Thanh đòn bẩy chia vạch đối xứng nghiêng góc theta |
| `scale_display` | `PlaneGeometry` | MeshBasicMaterial (CanvasTexture) | 3 | Đĩa hiển thị góc nghiêng và mômen lực hai bên |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **680 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `force`
  - Giới hạn đo (GHĐ): **-30 deg** đến **30 deg**
  - Độ chia nhỏ nhất (ĐCNN): **1 deg**
  - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \sum M_{(O)} = 0 \iff F_1 \cdot d_1 = F_2 \cdot d_2 \iff m_1 \cdot x_1 = m_2 \cdot x_2$$
  *Ý nghĩa vật lý*: Quy tắc mômen lực cho đòn bẩy thăng bằng quanh trục quay O nằm chính giữa.
  $$\mathbf{(2)}\quad k_{đòn\,bẩy} = \frac{F_1}{F_2} = \frac{d_2}{d_1}$$
  *Ý nghĩa vật lý*: Lợi ích về lực khi sử dụng đòn bẩy tỷ lệ nghịch với cánh tay đòn.
* **Các tính năng khoa học tích hợp**:
  - Thanh hợp kim nhôm định hình mạ Anode xước mờ, chia vạch đối xứng 18 lỗ treo cách đều tâm quay O đúng 20 mm.
  - Hai đai ốc ren M4 bằng đồng thau khía nhám ở 2 đầu giúp vi chỉnh cân bằng zero trước khi làm thí nghiệm.
  - Cung chia độ góc nghiêng tại ổ trục hiển thị trực quan góc lệch và vạch 0° dạ quang khi đạt thăng bằng ngang.
  - Trục quay ma sát siêu thấp ăn khớp cữ hãm cơ học giới hạn góc nghiêng an toàn trong khoảng [-30°, +30°].

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `BALANCED_HORIZONTAL`
* **Danh sách trạng thái khả dụng**: `BALANCED_HORIZONTAL`, `TILTED_LEFT`, `TILTED_RIGHT`, `DYNAMIC_OSCILLATION`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `BALANCED_HORIZONTAL` | `TILTED_LEFT` | Left torque exceeds right | `m1*d1 > m2*d2` |
| `BALANCED_HORIZONTAL` | `TILTED_RIGHT` | Right torque exceeds left | `m2*d2 > m1*d1` |
| `DYNAMIC_OSCILLATION` | `BALANCED_HORIZONTAL` | Torques equalize | `m1*d1 == m2*d2` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Độ nhạy cân bằng 0.5 g ở cự ly 10 cm
* **Độ chia nhỏ nhất / Độ phân giải**: Thước chia vạch đối xứng bước 10 mm
* **Độ lặp lại phép đo**: Khớp quay bi thép ma sát cực nhỏ < 0.001 N.m
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Đòn bẩy bị kẹt không quay mượt mà** | Bụi bẩn bám vào trục quay bi kim loại | Mất độ nhạy thăng bằng | `Hệ số ma sát trục > 0.01 N.m` | Bấm nút Tinh chỉnh bôi trơn trục quay để khôi phục dao động tự do |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Danh mục thiết bị dạy học môn KHTN THCS: Bộ đòn bẩy có giá đỡ, thanh chia vạch đối xứng dài 400mm kèm quả cân có móc. |
| **Thiết bị Giáo dục VietValue** | `vietvalue.edu.vn` | Bộ đòn bẩy thực hành Vật lí 8: Thanh hợp kim nhôm đục lỗ 20mm, đĩa chia độ ±30°, giá sắt chân đế gang vững chắc. |
| **VietJack — SGK KHTN 8 Kết nối tri thức** | `vietjack.com` | Thí nghiệm khảo sát quy tắc mômen đòn bẩy: Treo quả nặng vào các lỗ và so sánh tích F1.d1 với F2.d2. |
| **Innotec Việt Nam — Thiết bị Dạy học** | `innotec.com.vn` | Giá đỡ trục quay đòn bẩy có vít cân bằng, chịu tải 5N mỗi bên, bề mặt mạ kẽm/sơn tĩnh điện cao cấp. |
| **Thư viện Vật lý Việt Nam** | `thuvienvatly.com` | Quy tắc mômen lực M = F.d và bài toán thăng bằng thanh chắn đường, bập bênh, cân đòn. |

---
