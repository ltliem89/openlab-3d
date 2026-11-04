# 19. (6) Nguồn điện hạ áp thí nghiệm 3V–12V

**Device ID:** `OL3D-EQP-PSU-0001`  
**Nhóm chức năng đề xuất:** `G03/G07`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `optical-power-supply`  
**Slug:** `nguon-dien-ha-ap-thi-nghiem-12v`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · TCVN 7928 · IEC 61010-1 (An toàn điện hạ áp trường học) * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ * **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (6): Nguồn điện cấp cho đèn chiếu sáng (**) * **Chức năng chuẩn**: Cung cấp điện áp một chiều an toàn (6V–12V) cho Đèn chiếu sáng Halogen (1) hoạt động ổn định. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 135 mm, Cao = 88 mm, Sâu = 115 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.135 m, Cao (Y) = 0.088 m, Sâu (Z) = 0.115 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `scale_display`, `toggle_switch`, `plunger`, `handle`, `led_indicator`, `terminal_pos`, `terminal_neg`, `terminal_pos_hitbox`, `terminal_neg_hitbox`, `measurement_anchor` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData; Electrical Terminal / Wiring * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `BoxGeometry (Sheet Metal)` | MeshStandardMaterial (Grey Powder Coated Steel) | 1 | Vỏ thép sơn tĩnh điện an toàn cách điện cấp II | | `toggle_switch` | `Box + Cylinder Lever` | MeshStandardMaterial (Red Rocker Switch) | 2 | Công tắc lật nguồn có đèn LED đỏ báo sáng | | `terminal_pos` | `Cylinder (Banana socket)` | MeshStandardMaterial (Red Plastic, +) | 2 | Cọc cắm dương 12V màu đỏ | | `terminal_neg` | `Cylinder (Banana socket)` | MeshStandardMaterial (Black Plastic, -) | 2 | Cọc cắm âm 0V màu đen | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **680 g** (Trạng thái: `verified`) ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad U_{ra} \in \{3.0\text{ V}, 6.0\text{ V}, 9.0\text{ V}, 12.0\text{ V}\} \; (\text{DC & AC})$$ *Ý nghĩa vật lý*: Các nấc điện áp ra định mức của máy biến áp hạ áp thí nghiệm. $$\mathbf{(2)}\quad I_{max} = 3.0\text{ A}, \quad P_{max} = U \cdot I = 12\text{ V} \times 3\text{ A} = 36.0\text{ W}$$ *Ý nghĩa vật lý*: Công suất giới hạn bảo vệ tự động của nguồn điện trường học. * **Các tính năng khoa học tích hợp**: - Bộ biến áp hạ áp cách ly an toàn tuyệt đối cho học sinh thực hành, tích hợp rơ-le nhiệt tự ngắt khi ngắn mạch hoặc quá tải (> 3.5A). - Núm xoay chuyển nấc điện áp cơ khí vững chắc với 4 nấc điện áp thí nghiệm tiêu chuẩn: 3V, 6V, 9V, 12V. - Hai hàng cọc cắm ra độc lập: Hàng cọc DC (Đỏ dương +, Đen âm -) và Hàng cọc AC (Vàng ~) kèm công tắc ngắt mạch tổng. - Cung cấp nguồn ổn định cho Đèn chiếu Halogen quang học, biến trở con chạy, cuộn dây cảm ứng điện từ và thí nghiệm định luật Ohm. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `POWER_OFF` * **Danh sách trạng thái khả dụng**: `POWER_OFF`, `POWER_ON_STANDBY`, `OUTPUT_ACTIVE`, `SHORT_CIRCUIT_TRIPPED` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `POWER_OFF` | `POWER_ON_STANDBY` | Mains toggle switch on | `mainsVoltage == 220V` | | `POWER_ON_STANDBY` | `OUTPUT_ACTIVE` | Load connected | `R_load > 3.0 Ohm` | | `OUTPUT_ACTIVE` | `SHORT_CIRCUIT_TRIPPED` | Short circuit detected | `I_out > 3.5 A` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±2% điện áp ra định danh * **Độ chia nhỏ nhất / Độ phân giải**: Nấc chuyển 3V (3 - 6 - 9 - 12 V) * **Độ lặp lại phép đo**: Ổn áp cao * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Cầu chì nhiệt tự ngắt khi T biến áp > 75°C ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Nhảy rơ-le bảo vệ quá tải (Tripped)** | Nối tắt trực tiếp 2 cực dương và âm bằng dây dẫn (ngắn mạch) | Ngắt điện áp đầu ra bảo vệ thiết bị | `R_load < 0.5 Ohm` | Gỡ bỏ đoản mạch, bấm nút Reset Circuit Breaker trên mặt máy | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Nguồn điện hạ thế thí nghiệm: Đầu vào 220V AC, đầu ra xoay chiều và một chiều 0–12V/3A, có bảo vệ quá tải. | | **VietValue — Nguồn điện học sinh** | `vietvalue.edu.vn` | Nguồn điện đa năng phòng thực hành KHTN: 4 mức điện áp ra 3V, 6V, 9V, 12V DC/AC có đèn LED báo nguồn và cầu chì tự phục hồi. | | **Innotec Việt Nam — Thiết bị Điện học** | `innotec.com.vn` | Bộ đổi nguồn hạ áp thí nghiệm 12V-3A: Vỏ thép sơn tĩnh điện chống rò điện, cọc cắm bắp chuối bọc nhựa an toàn. | | **DMKLab — Thiết bị Trường học** | `dmklab.vn` | Nguồn điện hạ áp THCS: Ổn định điện áp tải, không phát sinh xung đỉnh làm đứt tim bóng đèn thí nghiệm. | | **Voltcraft Laboratory Power Supplies** | `conrad.com` | School Laboratory Power Supply: Stepped output 3-12V AC/DC, overload-protected according to school safety regulations. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Cấp nguồn hạ áp cho các thí nghiệm điện, chiếu sáng và thiết bị phù hợp.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 135 mm, Cao = 88 mm, Sâu = 115 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.135 m, Cao (Y) = 0.088 m, Sâu (Z) = 0.115 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `scale_display`, `toggle_switch`, `plunger`, `handle`, `led_indicator`, `terminal_pos`, `terminal_neg`, `terminal_pos_hitbox`, `terminal_neg_hitbox`, `measurement_anchor`
- **Capabilities:** `selectable`, `translatable`, `rotatable`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `POWER_OFF`, `POWER_ON_STANDBY`, `OUTPUT_ACTIVE`, `SHORT_CIRCUIT_TRIPPED`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| power switch | Công tắc nguồn | Bật/tắt nguồn chính. | Trạng thái output enabled/disabled đổi. |
| voltage selector / voltage dial | Núm chọn mức điện áp | Chọn 3–12 V theo nấc/mức cho phép. | Điện áp đầu ra đổi theo giá trị đặt. |
| AC/DC selector | Chọn AC/DC | Chọn dạng dòng phù hợp thiết bị thí nghiệm. | Đầu ra có dạng AC hoặc DC tương ứng. |
| terminal_pos / terminal_neg | Cọc đầu ra | Nối dây theo cực tính và cổng. | Mạch chỉ cấp điện khi kết nối đúng và tải hợp lệ. |
| current protection / display | Bảo vệ và hiển thị | Theo dõi dòng, reset sau khi loại bỏ sự cố. | Quá tải/ngắn mạch ngắt output và báo lỗi. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Chọn AC hoặc DC đúng yêu cầu bài thí nghiệm.
2. Chọn điện áp đầu ra phù hợp tải.
3. Tắt nguồn trước khi cắm dây nếu quy trình yêu cầu.
4. Nối đúng hai cực vào mạch.
5. Bật nguồn, quan sát tải và dòng; tắt nguồn trước khi tháo.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Tải chỉ nhận nguồn khi mạch khép kín và đầu ra được bật.
- Điện áp/dòng bị giới hạn theo thông số thiết bị.
- Ngắn mạch/quá tải kích hoạt bảo vệ; reset chỉ sau khi loại bỏ nguyên nhân.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad U_{ra} \in \{3.0\text{ V}, 6.0\text{ V}, 9.0\text{ V}, 12.0\text{ V}\} \; (\text{DC & AC})$$
  *Ý nghĩa vật lý*: Các nấc điện áp ra định mức của máy biến áp hạ áp thí nghiệm.
  $$\mathbf{(2)}\quad I_{max} = 3.0\text{ A}, \quad P_{max} = U \cdot I = 12\text{ V} \times 3\text{ A} = 36.0\text{ W}$$
  *Ý nghĩa vật lý*: Công suất giới hạn bảo vệ tự động của nguồn điện trường học.
* **Các tính năng khoa học tích hợp**:
  - Bộ biến áp hạ áp cách ly an toàn tuyệt đối cho học sinh thực hành, tích hợp rơ-le nhiệt tự ngắt khi ngắn mạch hoặc quá tải (> 3.5A).
  - Núm xoay chuyển nấc điện áp cơ khí vững chắc với 4 nấc điện áp thí nghiệm tiêu chuẩn: 3V, 6V, 9V, 12V.
  - Hai hàng cọc cắm ra độc lập: Hàng cọc DC (Đỏ dương +, Đen âm -) và Hàng cọc AC (Vàng ~) kèm công tắc ngắt mạch tổng.
  - Cung cấp nguồn ổn định cho Đèn chiếu Halogen quang học, biến trở con chạy, cuộn dây cảm ứng điện từ và thí nghiệm định luật Ohm.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `POWER_OFF`
* **Danh sách trạng thái khả dụng**: `POWER_OFF`, `POWER_ON_STANDBY`, `OUTPUT_ACTIVE`, `SHORT_CIRCUIT_TRIPPED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `POWER_OFF` | `POWER_ON_STANDBY` | Mains toggle switch on | `mainsVoltage == 220V` |
| `POWER_ON_STANDBY` | `OUTPUT_ACTIVE` | Load connected | `R_load > 3.0 Ohm` |
| `OUTPUT_ACTIVE` | `SHORT_CIRCUIT_TRIPPED` | Short circuit detected | `I_out > 3.5 A` |

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
| **Nhảy rơ-le bảo vệ quá tải (Tripped)** | Nối tắt trực tiếp 2 cực dương và âm bằng dây dẫn (ngắn mạch) | Ngắt điện áp đầu ra bảo vệ thiết bị | `R_load < 0.5 Ohm` | Gỡ bỏ đoản mạch, bấm nút Reset Circuit Breaker trên mặt máy |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-PSU-0001-T01:** Nguồn OFF: tải không hoạt động.
- [ ] **OL3D-EQP-PSU-0001-T02:** Chọn 6 V DC và nối tải phù hợp: đo được điện áp tương ứng.
- [ ] **OL3D-EQP-PSU-0001-T03:** Đảo cực DC: phản hồi đúng theo mạch, không âm thầm đảo cực.
- [ ] **OL3D-EQP-PSU-0001-T04:** Ngắn mạch: ngắt đầu ra và báo lỗi.
- [ ] **OL3D-EQP-PSU-0001-T05:** Reset khi còn sự cố: không tự cấp lại nguồn.

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

## 4.19. [OL3D-EQP-PSU-0001] (6) Nguồn điện hạ áp thí nghiệm 3V–12V
**Tên tiếng Anh**: *(6) Low-Voltage Lab Power Supply (DC 3V–12V)* | **Mã Archetype**: `optical-power-supply` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-PSU-0001`
* **Mã đường dẫn (Slug)**: `nguon-dien-ha-ap-thi-nghiem-12v`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · TCVN 7928 · IEC 61010-1 (An toàn điện hạ áp trường học)
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ
* **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (6): Nguồn điện cấp cho đèn chiếu sáng (**)
* **Chức năng chuẩn**: Cung cấp điện áp một chiều an toàn (6V–12V) cho Đèn chiếu sáng Halogen (1) hoạt động ổn định.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 135 mm, Cao = 88 mm, Sâu = 115 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.135 m, Cao (Y) = 0.088 m, Sâu (Z) = 0.115 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `toggle_switch`, `plunger`, `handle`, `led_indicator`, `terminal_pos`, `terminal_neg`, `terminal_pos_hitbox`, `terminal_neg_hitbox`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData; Electrical Terminal / Wiring
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry (Sheet Metal)` | MeshStandardMaterial (Grey Powder Coated Steel) | 1 | Vỏ thép sơn tĩnh điện an toàn cách điện cấp II |
| `toggle_switch` | `Box + Cylinder Lever` | MeshStandardMaterial (Red Rocker Switch) | 2 | Công tắc lật nguồn có đèn LED đỏ báo sáng |
| `terminal_pos` | `Cylinder (Banana socket)` | MeshStandardMaterial (Red Plastic, +) | 2 | Cọc cắm dương 12V màu đỏ |
| `terminal_neg` | `Cylinder (Banana socket)` | MeshStandardMaterial (Black Plastic, -) | 2 | Cọc cắm âm 0V màu đen |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **680 g** (Trạng thái: `verified`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad U_{ra} \in \{3.0\text{ V}, 6.0\text{ V}, 9.0\text{ V}, 12.0\text{ V}\} \; (\text{DC & AC})$$
  *Ý nghĩa vật lý*: Các nấc điện áp ra định mức của máy biến áp hạ áp thí nghiệm.
  $$\mathbf{(2)}\quad I_{max} = 3.0\text{ A}, \quad P_{max} = U \cdot I = 12\text{ V} \times 3\text{ A} = 36.0\text{ W}$$
  *Ý nghĩa vật lý*: Công suất giới hạn bảo vệ tự động của nguồn điện trường học.
* **Các tính năng khoa học tích hợp**:
  - Bộ biến áp hạ áp cách ly an toàn tuyệt đối cho học sinh thực hành, tích hợp rơ-le nhiệt tự ngắt khi ngắn mạch hoặc quá tải (> 3.5A).
  - Núm xoay chuyển nấc điện áp cơ khí vững chắc với 4 nấc điện áp thí nghiệm tiêu chuẩn: 3V, 6V, 9V, 12V.
  - Hai hàng cọc cắm ra độc lập: Hàng cọc DC (Đỏ dương +, Đen âm -) và Hàng cọc AC (Vàng ~) kèm công tắc ngắt mạch tổng.
  - Cung cấp nguồn ổn định cho Đèn chiếu Halogen quang học, biến trở con chạy, cuộn dây cảm ứng điện từ và thí nghiệm định luật Ohm.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `POWER_OFF`
* **Danh sách trạng thái khả dụng**: `POWER_OFF`, `POWER_ON_STANDBY`, `OUTPUT_ACTIVE`, `SHORT_CIRCUIT_TRIPPED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `POWER_OFF` | `POWER_ON_STANDBY` | Mains toggle switch on | `mainsVoltage == 220V` |
| `POWER_ON_STANDBY` | `OUTPUT_ACTIVE` | Load connected | `R_load > 3.0 Ohm` |
| `OUTPUT_ACTIVE` | `SHORT_CIRCUIT_TRIPPED` | Short circuit detected | `I_out > 3.5 A` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±2% điện áp ra định danh
* **Độ chia nhỏ nhất / Độ phân giải**: Nấc chuyển 3V (3 - 6 - 9 - 12 V)
* **Độ lặp lại phép đo**: Ổn áp cao
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Cầu chì nhiệt tự ngắt khi T biến áp > 75°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Nhảy rơ-le bảo vệ quá tải (Tripped)** | Nối tắt trực tiếp 2 cực dương và âm bằng dây dẫn (ngắn mạch) | Ngắt điện áp đầu ra bảo vệ thiết bị | `R_load < 0.5 Ohm` | Gỡ bỏ đoản mạch, bấm nút Reset Circuit Breaker trên mặt máy |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Nguồn điện hạ thế thí nghiệm: Đầu vào 220V AC, đầu ra xoay chiều và một chiều 0–12V/3A, có bảo vệ quá tải. |
| **VietValue — Nguồn điện học sinh** | `vietvalue.edu.vn` | Nguồn điện đa năng phòng thực hành KHTN: 4 mức điện áp ra 3V, 6V, 9V, 12V DC/AC có đèn LED báo nguồn và cầu chì tự phục hồi. |
| **Innotec Việt Nam — Thiết bị Điện học** | `innotec.com.vn` | Bộ đổi nguồn hạ áp thí nghiệm 12V-3A: Vỏ thép sơn tĩnh điện chống rò điện, cọc cắm bắp chuối bọc nhựa an toàn. |
| **DMKLab — Thiết bị Trường học** | `dmklab.vn` | Nguồn điện hạ áp THCS: Ổn định điện áp tải, không phát sinh xung đỉnh làm đứt tim bóng đèn thí nghiệm. |
| **Voltcraft Laboratory Power Supplies** | `conrad.com` | School Laboratory Power Supply: Stepped output 3-12V AC/DC, overload-protected according to school safety regulations. |

---
