# 29. Bát sứ chịu nhiệt — Cô đặc & Đốt cháy cồn (SGK KHTN 9)

**Device ID:** `OL3D-EQP-DSH-0001`  
**Nhóm chức năng đề xuất:** `G05`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `porcelain-dish`  
**Slug:** `porcelain-evaporating-dish`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-DSH-0001_porcelain-evaporating-dish` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: DIN 12903 · Thông tư 38/2021/TT-BGDĐT · Hình 1.7 trang 7 & Bài 26 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương VIII: Ethylic Alcohol và Acetic Acid · Bài 1 (trang 8) & Bài 26: Ethylic alcohol (trang 119) * **Hình ảnh đối chiếu SGK**: Hình 1.7 (Bát sứ) (**) * **Chức năng chuẩn**: Trộn hoặc đun nóng chảy các chất rắn, cô đặc dung dịch; thực hiện một số phản ứng toả nhiệt mạnh như đốt cháy 1 mL ethylic alcohol bằng que đóm dài. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 95 mm, Cao = 48 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.095 m, Cao (Y) = 0.052 m, Sâu (Z) = 0.095 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `liquid_surface`, `flame_group` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `SphereGeometry (Cut bowl)` | MeshPhysicalMaterial (Glazed Porcelain, color 0xf8fafc, roughness 0.1) | 1 | Bát sứ nung trắng men tráng chịu nhiệt có mỏ rót | | `flame_group` | `ConeGeometry + Particle` | MeshBasicMaterial (Blue/Orange Flame) | 5 | Ngọn lửa cồn cháy bập bùng đồ họa động | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `weighObject` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **85 g** (Trạng thái: `verified`) - Dung tích định mức ($V_{max}$): **60 ml** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad C_2H_5OH + 3O_2 \xrightarrow{t^\circ} 2CO_2 + 3H_2O, \quad \Delta H = -1367\text{ kJ/mol}$$ *Ý nghĩa vật lý*: Phản ứng cháy của cồn ethanol tỏa nhiệt lượng mạnh trong bát sứ. $$\mathbf{(2)}\quad m_{chất\,rắn} = m_{sau\,cô\,cạn} - m_{bát\,không}$$ *Ý nghĩa vật lý*: Xác định hàm lượng muối khoáng hòa tan sau khi cô cạn dung dịch. * **Các tính năng khoa học tích hợp**: - Chế tạo từ sứ kỹ thuật tráng men trắng bóng bên trong và ngoài (trừ vành đáy mộc), chịu được nhiệt độ ngọn lửa trực tiếp mà không nứt vỡ. - Dùng trong Bài 26 SGK KHTN 9 để thực hành phản ứng đốt cháy Ethylic alcohol (C₂H₅OH) với ngọn lửa xanh – vàng ấm và cô cạn dung dịch muối. - Cho phép bật/tắt hiệu ứng ngọn lửa đốt cồn trực tiếp trong lòng bát sứ 3D. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `ROOM_TEMP` * **Danh sách trạng thái khả dụng**: `ROOM_TEMP`, `LIQUID_FILLED`, `BURNING_ALCOHOL`, `EVAPORATING`, `RESIDUE_COOLED` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `ROOM_TEMP` | `BURNING_ALCOHOL` | Alcohol ignited | `hasAlcohol == true` | | `BURNING_ALCOHOL` | `RESIDUE_COOLED` | Fuel exhausted | `alcoholRemaining == 0` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: Chịu nhiệt độ cực đại 1050°C * **Độ chia nhỏ nhất / Độ phân giải**: Dung tích 75 ml * **Độ lặp lại phép đo**: Men sứ phủ tráng nhẵn chống ăn mòn axit/kiềm * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Hệ số giãn nở nhiệt sứ: 4.5 × 10⁻⁶ K⁻¹ ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Nứt vỡ bát sứ do sốc nhiệt đột ngột** | Đang đun nóng ở 400°C đổ ngay nước lạnh vào lòng bát | Nứt toác lòng bát sứ | `dT/dt < -150°C/s` | Để bát nguội tự nhiên trên lưới tản nhiệt trước khi vệ sinh | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **RedLab — Bát sứ Cô đặc Có mỏ Phòng thí nghiệm** | `redlab.com.vn` | Bát sứ nung/cô cạn dung dịch 75–100 ml: Đường kính miệng Ø 80–90 mm, chiều cao 35–40 mm, sứ chịu nhiệt > 1000 °C. | | **VinaMTSC — Dụng cụ Sứ Thí nghiệm** | `vinamtsc.com` | Bát sứ giáo khoa phổ thông Ø 80 mm × cao 40 mm, lòng tráng men kháng axit và kiềm nóng. | | **VietJack — SGK KHTN 9 Hình 1.7 & Bài 26** | `vietjack.com` | Hình 1.7 trang 7 và Bài 26 (Ethylic alcohol): Dùng bát sứ để đốt cháy một lượng nhỏ cồn tuyệt đối an toàn. | | **VietChem — Thiết bị Hóa học** | `vietchem.com.vn` | Hướng dẫn sử dụng kẹp sắt gắp bát sứ đang nóng và đặt trên đế sứ/lưới amiăng sau khi nung. | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Bát sứ chịu nhiệt thuộc danh mục dụng cụ thí nghiệm Hóa học bắt buộc cấp THCS. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Cô cạn dung dịch trong bát sứ bằng gia nhiệt an toàn, quan sát bay hơi và lượng chất rắn còn lại.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 95 mm, Cao = 48 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.095 m, Cao (Y) = 0.052 m, Sâu (Z) = 0.095 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `liquid_surface`, `flame_group`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `weighObject`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `ROOM_TEMP`, `LIQUID_FILLED`, `BURNING_ALCOHOL`, `EVAPORATING`, `RESIDUE_COOLED`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body | Bát sứ | Đặt trên giá/lưới tản nhiệt phù hợp; kéo và xoay để đặt đúng vị trí. | Bát nhận nhiệt từ nguồn gia nhiệt liên kết. |
| liquid_surface / liquid_body | Dung dịch | Cho dung dịch vào; không vượt dung tích an toàn. | Thể tích giảm dần khi bay hơi; chất tan còn lại. |
| flame_group | Ngọn lửa/nguồn nhiệt nếu thuộc cấu hình | Bật/tắt và điều chỉnh theo bộ gia nhiệt mô phỏng riêng; không kích hoạt nếu không có nhiên liệu/nguồn. | Nhiệt lượng truyền sang bát và dung dịch. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt bát sứ lên bộ đỡ chịu nhiệt.
2. Cho dung dịch cần cô cạn vào bát.
3. Kiểm tra nguồn nhiệt, vùng an toàn và thông gió.
4. Gia nhiệt có kiểm soát đến khi dung môi bay hơi.
5. Để nguội rồi xác định khối lượng chất rắn còn lại nếu bài yêu cầu.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Năng lượng nhiệt làm tăng nhiệt độ và thúc đẩy bay hơi.
- Khối lượng dung môi giảm; chất tan không bay hơi còn lại theo giả định mô hình.
- Phản ứng cháy ethanol chỉ được mô phỏng khi đúng thành phần và có nguồn cháy, không tự cháy khi thiếu điều kiện.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad C_2H_5OH + 3O_2 \xrightarrow{t^\circ} 2CO_2 + 3H_2O, \quad \Delta H = -1367\text{ kJ/mol}$$
  *Ý nghĩa vật lý*: Phản ứng cháy của cồn ethanol tỏa nhiệt lượng mạnh trong bát sứ.
  $$\mathbf{(2)}\quad m_{chất\,rắn} = m_{sau\,cô\,cạn} - m_{bát\,không}$$
  *Ý nghĩa vật lý*: Xác định hàm lượng muối khoáng hòa tan sau khi cô cạn dung dịch.
* **Các tính năng khoa học tích hợp**:
  - Chế tạo từ sứ kỹ thuật tráng men trắng bóng bên trong và ngoài (trừ vành đáy mộc), chịu được nhiệt độ ngọn lửa trực tiếp mà không nứt vỡ.
  - Dùng trong Bài 26 SGK KHTN 9 để thực hành phản ứng đốt cháy Ethylic alcohol (C₂H₅OH) với ngọn lửa xanh – vàng ấm và cô cạn dung dịch muối.
  - Cho phép bật/tắt hiệu ứng ngọn lửa đốt cồn trực tiếp trong lòng bát sứ 3D.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `ROOM_TEMP`
* **Danh sách trạng thái khả dụng**: `ROOM_TEMP`, `LIQUID_FILLED`, `BURNING_ALCOHOL`, `EVAPORATING`, `RESIDUE_COOLED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `ROOM_TEMP` | `BURNING_ALCOHOL` | Alcohol ignited | `hasAlcohol == true` |
| `BURNING_ALCOHOL` | `RESIDUE_COOLED` | Fuel exhausted | `alcoholRemaining == 0` |

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
| **Nứt vỡ bát sứ do sốc nhiệt đột ngột** | Đang đun nóng ở 400°C đổ ngay nước lạnh vào lòng bát | Nứt toác lòng bát sứ | `dT/dt < -150°C/s` | Để bát nguội tự nhiên trên lưới tản nhiệt trước khi vệ sinh |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-DSH-0001-T01:** Không có nguồn nhiệt: dung dịch không tự sôi/bay hơi nhanh.
- [ ] **OL3D-EQP-DSH-0001-T02:** Cấp nhiệt: nhiệt độ và thể tích dung dịch biến thiên theo mô hình.
- [ ] **OL3D-EQP-DSH-0001-T03:** Ngắt nguồn: gia nhiệt dừng, hệ còn nguội dần.
- [ ] **OL3D-EQP-DSH-0001-T04:** Hoàn tất cô cạn: lượng chất rắn còn lại nhất quán với lượng chất tan.

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

## 4.29. [OL3D-EQP-DSH-0001] Bát sứ chịu nhiệt — Cô đặc & Đốt cháy cồn (SGK KHTN 9)
**Tên tiếng Anh**: *Porcelain Evaporating Dish (High-Heat)* | **Mã Archetype**: `porcelain-dish` | **Phân loại danh mục**: `chemical-apparatus`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-DSH-0001`
* **Mã đường dẫn (Slug)**: `porcelain-evaporating-dish`
* **Môn học áp dụng**: `chemistry`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-DSH-0001_porcelain-evaporating-dish` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: DIN 12903 · Thông tư 38/2021/TT-BGDĐT · Hình 1.7 trang 7 & Bài 26 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương VIII: Ethylic Alcohol và Acetic Acid · Bài 1 (trang 8) & Bài 26: Ethylic alcohol (trang 119)
* **Hình ảnh đối chiếu SGK**: Hình 1.7 (Bát sứ) (**)
* **Chức năng chuẩn**: Trộn hoặc đun nóng chảy các chất rắn, cô đặc dung dịch; thực hiện một số phản ứng toả nhiệt mạnh như đốt cháy 1 mL ethylic alcohol bằng que đóm dài.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 95 mm, Cao = 48 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.095 m, Cao (Y) = 0.052 m, Sâu (Z) = 0.095 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `liquid_surface`, `flame_group`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `SphereGeometry (Cut bowl)` | MeshPhysicalMaterial (Glazed Porcelain, color 0xf8fafc, roughness 0.1) | 1 | Bát sứ nung trắng men tráng chịu nhiệt có mỏ rót |
| `flame_group` | `ConeGeometry + Particle` | MeshBasicMaterial (Blue/Orange Flame) | 5 | Ngọn lửa cồn cháy bập bùng đồ họa động |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `weighObject`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **85 g** (Trạng thái: `verified`)
  - Dung tích định mức ($V_{max}$): **60 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad C_2H_5OH + 3O_2 \xrightarrow{t^\circ} 2CO_2 + 3H_2O, \quad \Delta H = -1367\text{ kJ/mol}$$
  *Ý nghĩa vật lý*: Phản ứng cháy của cồn ethanol tỏa nhiệt lượng mạnh trong bát sứ.
  $$\mathbf{(2)}\quad m_{chất\,rắn} = m_{sau\,cô\,cạn} - m_{bát\,không}$$
  *Ý nghĩa vật lý*: Xác định hàm lượng muối khoáng hòa tan sau khi cô cạn dung dịch.
* **Các tính năng khoa học tích hợp**:
  - Chế tạo từ sứ kỹ thuật tráng men trắng bóng bên trong và ngoài (trừ vành đáy mộc), chịu được nhiệt độ ngọn lửa trực tiếp mà không nứt vỡ.
  - Dùng trong Bài 26 SGK KHTN 9 để thực hành phản ứng đốt cháy Ethylic alcohol (C₂H₅OH) với ngọn lửa xanh – vàng ấm và cô cạn dung dịch muối.
  - Cho phép bật/tắt hiệu ứng ngọn lửa đốt cồn trực tiếp trong lòng bát sứ 3D.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `ROOM_TEMP`
* **Danh sách trạng thái khả dụng**: `ROOM_TEMP`, `LIQUID_FILLED`, `BURNING_ALCOHOL`, `EVAPORATING`, `RESIDUE_COOLED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `ROOM_TEMP` | `BURNING_ALCOHOL` | Alcohol ignited | `hasAlcohol == true` |
| `BURNING_ALCOHOL` | `RESIDUE_COOLED` | Fuel exhausted | `alcoholRemaining == 0` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Chịu nhiệt độ cực đại 1050°C
* **Độ chia nhỏ nhất / Độ phân giải**: Dung tích 75 ml
* **Độ lặp lại phép đo**: Men sứ phủ tráng nhẵn chống ăn mòn axit/kiềm
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Hệ số giãn nở nhiệt sứ: 4.5 × 10⁻⁶ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Nứt vỡ bát sứ do sốc nhiệt đột ngột** | Đang đun nóng ở 400°C đổ ngay nước lạnh vào lòng bát | Nứt toác lòng bát sứ | `dT/dt < -150°C/s` | Để bát nguội tự nhiên trên lưới tản nhiệt trước khi vệ sinh |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **RedLab — Bát sứ Cô đặc Có mỏ Phòng thí nghiệm** | `redlab.com.vn` | Bát sứ nung/cô cạn dung dịch 75–100 ml: Đường kính miệng Ø 80–90 mm, chiều cao 35–40 mm, sứ chịu nhiệt > 1000 °C. |
| **VinaMTSC — Dụng cụ Sứ Thí nghiệm** | `vinamtsc.com` | Bát sứ giáo khoa phổ thông Ø 80 mm × cao 40 mm, lòng tráng men kháng axit và kiềm nóng. |
| **VietJack — SGK KHTN 9 Hình 1.7 & Bài 26** | `vietjack.com` | Hình 1.7 trang 7 và Bài 26 (Ethylic alcohol): Dùng bát sứ để đốt cháy một lượng nhỏ cồn tuyệt đối an toàn. |
| **VietChem — Thiết bị Hóa học** | `vietchem.com.vn` | Hướng dẫn sử dụng kẹp sắt gắp bát sứ đang nóng và đặt trên đế sứ/lưới amiăng sau khi nung. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Bát sứ chịu nhiệt thuộc danh mục dụng cụ thí nghiệm Hóa học bắt buộc cấp THCS. |

---
