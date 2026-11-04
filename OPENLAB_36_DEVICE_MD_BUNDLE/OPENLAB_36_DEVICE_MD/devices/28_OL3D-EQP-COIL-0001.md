# 28. Cuộn dây dẫn kín có 2 đèn LED & Thanh nam châm (SGK KHTN 9)

**Device ID:** `OL3D-EQP-COIL-0001`  
**Nhóm chức năng đề xuất:** `G07`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `induction-coil-led`  
**Slug:** `induction-coil-2led-magnet`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.6 trang 7 & Bài 14, 15 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương IV: Điện từ · Bài 1 (trang 7) & Bài 14: Cảm ứng điện từ. Nguyên tắc tạo ra dòng điện xoay chiều (trang 69–71) * **Hình ảnh đối chiếu SGK**: Hình 1.6 (Cuộn dây dẫn kín có hai đèn LED), Hình 14.4, Hình 14.5 (**) * **Chức năng chuẩn**: Phát hiện dòng điện cảm ứng và chiều dòng điện: Khi số đường sức từ xuyên qua tiết diện cuộn dây tăng thì đèn LED 1 sáng; khi số đường sức từ giảm thì dòng điện cảm ứng đổi chiều làm đèn LED 2 sáng. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 180 mm, Cao = 95 mm, Sâu = 110 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.18 m, Cao (Y) = 0.095 m, Sâu (Z) = 0.11 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `led_1`, `led_2`, `plunger` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial` * **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `CylinderGeometry (Hollow core)` | MeshStandardMaterial (Enamelled Copper Wire, color 0xb45309) | 2 | Cuộn dây đồng tráng men quấn trên lõi nhựa rỗng | | `led_1` | `Cylinder + Dome` | MeshBasicMaterial (Red LED, emissive) | 3 | LED đỏ sáng khi từ thông tăng (đưa nam châm vào) | | `led_2` | `Cylinder + Dome` | MeshBasicMaterial (Green LED, emissive) | 3 | LED xanh sáng khi từ thông giảm (rút nam châm ra) | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **420 g** (Trạng thái: `verified`) ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad \mathcal{E} = -N \cdot \frac{d\Phi}{dt} = -N \cdot S \cdot \frac{dB}{dt}$$ *Ý nghĩa vật lý*: Định luật cảm ứng điện từ Faraday: Suất điện động cảm ứng tỷ lệ với tốc độ biến thiên từ thông qua cuộn dây ($N = 1000\text{ vòng}$). $$\mathbf{(2)}\quad I_{cảm\,ứng} = \frac{\mathcal{E}}{R_{cuộn} + R_{LED}}$$ *Ý nghĩa vật lý*: Dòng điện cảm ứng chạy qua 2 đèn LED đấu song song ngược cực. $$\mathbf{(3)}\quad V_{LED} \ge 1.8\text{ V} \implies \text{LED phát sáng}$$ *Ý nghĩa vật lý*: Đèn LED đỏ sáng khi đưa cực Bắc nam châm vào; LED xanh sáng khi rút nam châm ra (Định luật Lenz). * **Các tính năng khoa học tích hợp**: - Cuộn dây dẫn quấn dây đồng tráng men quanh ống nhựa trong suốt có lòng rỗng rộng để đưa thanh nam châm N–S dịch chuyển ra vào. - Hai bóng đèn LED khác màu được mắc song song nhưng ngược chiều cực tính (Anode của LED 1 nối với Cathode của LED 2). - Khi đưa cực Bắc (N) nam châm lại gần cuộn dây, LED 1 (Đỏ) lóe sáng; khi kéo nam châm ra xa, LED 2 (Xanh) lóe sáng, chứng minh trực quan sự xuất hiện và đổi chiều của dòng điện cảm ứng xoay chiều (Hình 1.6, Hình 14.2 SGK KHTN 9). ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `QUIESCENT` * **Danh sách trạng thái khả dụng**: `QUIESCENT`, `MAGNET_APPROACHING`, `MAGNET_RETRACTING`, `MAGNET_STATIONARY` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `QUIESCENT` | `MAGNET_APPROACHING` | Magnet moves into core (+v) | `v > 0.05 m/s` | | `QUIESCENT` | `MAGNET_RETRACTING` | Magnet moves out of core (-v) | `v < -0.05 m/s` | | `MAGNET_APPROACHING` | `MAGNET_STATIONARY` | Magnet stops moving | `v == 0` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: Số vòng dây N = 1000 ± 5 vòng * **Độ chia nhỏ nhất / Độ phân giải**: Ngưỡng phát hiện vận tốc nam châm 0.05 m/s * **Độ lặp lại phép đo**: 100% tái hiện định luật Lenz * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Điện trở cuộn dây đồng R = 18 Ω ở 25°C ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **LED không sáng khi đưa nam châm vào** | Di chuyển thanh nam châm quá chậm ($v < 0.02\text{ m/s}$) | Suất điện động cảm ứng sinh ra $< 1.8\text{ V}$ không đủ ngưỡng mở LED | `dPhi/dt < 0.0018 Wb/s` | Đưa nam châm chuyển động nhanh, dứt khoát xuyên qua lòng cuộn dây | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **VietJack — SGK KHTN 9 Hình 1.6 & Bài 14** | `vietjack.com` | Hình 1.6 trang 7 & Hình 14.2 trang 70 SGK KHTN 9: Cuộn dây dẫn có hai đèn LED mắc song song, ngược cực dùng phát hiện dòng điện cảm ứng. | | **Thư viện Vật lý Việt Nam** | `thuvienvatly.com` | Nguyên lý mạch 2 LED mắc song song ngược chiều: Mỗi LED chỉ cho dòng điện đi qua theo 1 chiều nên giúp xác định chiều dòng điện cảm ứng. | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Bộ thí nghiệm cảm ứng điện từ và tác dụng của dòng điện xoay chiều gồm cuộn dây gắn 2 đèn LED và nam châm vĩnh cửu. | | **VietValue — Thiết bị Điện từ THCS** | `vietvalue.edu.vn` | Cuộn dây 500–600 vòng dây đồng Ø 0.35 mm, lòng ống Ø 30–35 mm vừa thanh nam châm thẳng N–S. | | **Innotec Việt Nam** | `innotec.com.vn` | Bảng hiển thị 2 LED siêu nhạy gắn ngay trên đỉnh khung cuộn dây giúp cả lớp quan sát rõ ánh sáng khi dịch chuyển nam châm. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Khảo sát cảm ứng điện từ khi nam châm di chuyển tương đối với cuộn dây kín.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 180 mm, Cao = 95 mm, Sâu = 110 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.18 m, Cao (Y) = 0.095 m, Sâu (Z) = 0.11 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `led_1`, `led_2`, `plunger`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `readScale`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `QUIESCENT`, `MAGNET_APPROACHING`, `MAGNET_RETRACTING`, `MAGNET_STATIONARY`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| plunger / magnet | Thanh nam châm | Kéo/đẩy dọc trục cuộn dây; có thể đảo cực bằng cách xoay đầu nam châm nếu hình học cho phép. | Tốc độ và chiều chuyển động thay đổi từ thông. |
| body / coil | Cuộn dây kín | Đặt cố định; kết nối nội bộ tới hai LED. | Từ thông biến thiên sinh suất điện động cảm ứng. |
| led_1 / led_2 | Hai đèn LED | Không bấm trực tiếp; quan sát LED theo chiều dòng cảm ứng. | LED tương ứng sáng theo chiều cảm ứng và ngưỡng điện áp. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt cuộn dây cố định.
2. Đưa nam châm lại gần cuộn dây.
3. Dừng nam châm và quan sát LED tắt/giảm.
4. Rút nam châm ra và quan sát LED đổi chiều.
5. Tăng tốc độ di chuyển để so sánh độ sáng.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Chỉ khi từ thông biến thiên mới có suất điện động cảm ứng.
- Đổi chiều chuyển động hoặc cực nam châm sẽ đổi chiều dòng cảm ứng.
- Độ lớn phản hồi phụ thuộc tốc độ biến thiên từ thông.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \mathcal{E} = -N \cdot \frac{d\Phi}{dt} = -N \cdot S \cdot \frac{dB}{dt}$$
  *Ý nghĩa vật lý*: Định luật cảm ứng điện từ Faraday: Suất điện động cảm ứng tỷ lệ với tốc độ biến thiên từ thông qua cuộn dây ($N = 1000\text{ vòng}$).
  $$\mathbf{(2)}\quad I_{cảm\,ứng} = \frac{\mathcal{E}}{R_{cuộn} + R_{LED}}$$
  *Ý nghĩa vật lý*: Dòng điện cảm ứng chạy qua 2 đèn LED đấu song song ngược cực.
  $$\mathbf{(3)}\quad V_{LED} \ge 1.8\text{ V} \implies \text{LED phát sáng}$$
  *Ý nghĩa vật lý*: Đèn LED đỏ sáng khi đưa cực Bắc nam châm vào; LED xanh sáng khi rút nam châm ra (Định luật Lenz).
* **Các tính năng khoa học tích hợp**:
  - Cuộn dây dẫn quấn dây đồng tráng men quanh ống nhựa trong suốt có lòng rỗng rộng để đưa thanh nam châm N–S dịch chuyển ra vào.
  - Hai bóng đèn LED khác màu được mắc song song nhưng ngược chiều cực tính (Anode của LED 1 nối với Cathode của LED 2).
  - Khi đưa cực Bắc (N) nam châm lại gần cuộn dây, LED 1 (Đỏ) lóe sáng; khi kéo nam châm ra xa, LED 2 (Xanh) lóe sáng, chứng minh trực quan sự xuất hiện và đổi chiều của dòng điện cảm ứng xoay chiều (Hình 1.6, Hình 14.2 SGK KHTN 9).

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `QUIESCENT`
* **Danh sách trạng thái khả dụng**: `QUIESCENT`, `MAGNET_APPROACHING`, `MAGNET_RETRACTING`, `MAGNET_STATIONARY`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `QUIESCENT` | `MAGNET_APPROACHING` | Magnet moves into core (+v) | `v > 0.05 m/s` |
| `QUIESCENT` | `MAGNET_RETRACTING` | Magnet moves out of core (-v) | `v < -0.05 m/s` |
| `MAGNET_APPROACHING` | `MAGNET_STATIONARY` | Magnet stops moving | `v == 0` |

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
| **LED không sáng khi đưa nam châm vào** | Di chuyển thanh nam châm quá chậm ($v < 0.02\text{ m/s}$) | Suất điện động cảm ứng sinh ra $< 1.8\text{ V}$ không đủ ngưỡng mở LED | `dPhi/dt < 0.0018 Wb/s` | Đưa nam châm chuyển động nhanh, dứt khoát xuyên qua lòng cuộn dây |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-COIL-0001-T01:** Nam châm đứng yên: không duy trì dòng cảm ứng.
- [ ] **OL3D-EQP-COIL-0001-T02:** Đưa vào: LED tương ứng sáng.
- [ ] **OL3D-EQP-COIL-0001-T03:** Rút ra: chiều dòng và LED đổi theo Lenz.
- [ ] **OL3D-EQP-COIL-0001-T04:** Di chuyển nhanh hơn: tín hiệu lớn hơn theo mô hình.

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

## 4.28. [OL3D-EQP-COIL-0001] Cuộn dây dẫn kín có 2 đèn LED & Thanh nam châm (SGK KHTN 9)
**Tên tiếng Anh**: *Closed Induction Coil with 2 Anti-Parallel LEDs & Bar Magnet* | **Mã Archetype**: `induction-coil-led` | **Phân loại danh mục**: `electrical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-COIL-0001`
* **Mã đường dẫn (Slug)**: `induction-coil-2led-magnet`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.6 trang 7 & Bài 14, 15 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương IV: Điện từ · Bài 1 (trang 7) & Bài 14: Cảm ứng điện từ. Nguyên tắc tạo ra dòng điện xoay chiều (trang 69–71)
* **Hình ảnh đối chiếu SGK**: Hình 1.6 (Cuộn dây dẫn kín có hai đèn LED), Hình 14.4, Hình 14.5 (**)
* **Chức năng chuẩn**: Phát hiện dòng điện cảm ứng và chiều dòng điện: Khi số đường sức từ xuyên qua tiết diện cuộn dây tăng thì đèn LED 1 sáng; khi số đường sức từ giảm thì dòng điện cảm ứng đổi chiều làm đèn LED 2 sáng.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 180 mm, Cao = 95 mm, Sâu = 110 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.18 m, Cao (Y) = 0.095 m, Sâu (Z) = 0.11 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `led_1`, `led_2`, `plunger`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Hollow core)` | MeshStandardMaterial (Enamelled Copper Wire, color 0xb45309) | 2 | Cuộn dây đồng tráng men quấn trên lõi nhựa rỗng |
| `led_1` | `Cylinder + Dome` | MeshBasicMaterial (Red LED, emissive) | 3 | LED đỏ sáng khi từ thông tăng (đưa nam châm vào) |
| `led_2` | `Cylinder + Dome` | MeshBasicMaterial (Green LED, emissive) | 3 | LED xanh sáng khi từ thông giảm (rút nam châm ra) |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **420 g** (Trạng thái: `verified`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \mathcal{E} = -N \cdot \frac{d\Phi}{dt} = -N \cdot S \cdot \frac{dB}{dt}$$
  *Ý nghĩa vật lý*: Định luật cảm ứng điện từ Faraday: Suất điện động cảm ứng tỷ lệ với tốc độ biến thiên từ thông qua cuộn dây ($N = 1000\text{ vòng}$).
  $$\mathbf{(2)}\quad I_{cảm\,ứng} = \frac{\mathcal{E}}{R_{cuộn} + R_{LED}}$$
  *Ý nghĩa vật lý*: Dòng điện cảm ứng chạy qua 2 đèn LED đấu song song ngược cực.
  $$\mathbf{(3)}\quad V_{LED} \ge 1.8\text{ V} \implies \text{LED phát sáng}$$
  *Ý nghĩa vật lý*: Đèn LED đỏ sáng khi đưa cực Bắc nam châm vào; LED xanh sáng khi rút nam châm ra (Định luật Lenz).
* **Các tính năng khoa học tích hợp**:
  - Cuộn dây dẫn quấn dây đồng tráng men quanh ống nhựa trong suốt có lòng rỗng rộng để đưa thanh nam châm N–S dịch chuyển ra vào.
  - Hai bóng đèn LED khác màu được mắc song song nhưng ngược chiều cực tính (Anode của LED 1 nối với Cathode của LED 2).
  - Khi đưa cực Bắc (N) nam châm lại gần cuộn dây, LED 1 (Đỏ) lóe sáng; khi kéo nam châm ra xa, LED 2 (Xanh) lóe sáng, chứng minh trực quan sự xuất hiện và đổi chiều của dòng điện cảm ứng xoay chiều (Hình 1.6, Hình 14.2 SGK KHTN 9).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `QUIESCENT`
* **Danh sách trạng thái khả dụng**: `QUIESCENT`, `MAGNET_APPROACHING`, `MAGNET_RETRACTING`, `MAGNET_STATIONARY`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `QUIESCENT` | `MAGNET_APPROACHING` | Magnet moves into core (+v) | `v > 0.05 m/s` |
| `QUIESCENT` | `MAGNET_RETRACTING` | Magnet moves out of core (-v) | `v < -0.05 m/s` |
| `MAGNET_APPROACHING` | `MAGNET_STATIONARY` | Magnet stops moving | `v == 0` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Số vòng dây N = 1000 ± 5 vòng
* **Độ chia nhỏ nhất / Độ phân giải**: Ngưỡng phát hiện vận tốc nam châm 0.05 m/s
* **Độ lặp lại phép đo**: 100% tái hiện định luật Lenz
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Điện trở cuộn dây đồng R = 18 Ω ở 25°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **LED không sáng khi đưa nam châm vào** | Di chuyển thanh nam châm quá chậm ($v < 0.02\text{ m/s}$) | Suất điện động cảm ứng sinh ra $< 1.8\text{ V}$ không đủ ngưỡng mở LED | `dPhi/dt < 0.0018 Wb/s` | Đưa nam châm chuyển động nhanh, dứt khoát xuyên qua lòng cuộn dây |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietJack — SGK KHTN 9 Hình 1.6 & Bài 14** | `vietjack.com` | Hình 1.6 trang 7 & Hình 14.2 trang 70 SGK KHTN 9: Cuộn dây dẫn có hai đèn LED mắc song song, ngược cực dùng phát hiện dòng điện cảm ứng. |
| **Thư viện Vật lý Việt Nam** | `thuvienvatly.com` | Nguyên lý mạch 2 LED mắc song song ngược chiều: Mỗi LED chỉ cho dòng điện đi qua theo 1 chiều nên giúp xác định chiều dòng điện cảm ứng. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Bộ thí nghiệm cảm ứng điện từ và tác dụng của dòng điện xoay chiều gồm cuộn dây gắn 2 đèn LED và nam châm vĩnh cửu. |
| **VietValue — Thiết bị Điện từ THCS** | `vietvalue.edu.vn` | Cuộn dây 500–600 vòng dây đồng Ø 0.35 mm, lòng ống Ø 30–35 mm vừa thanh nam châm thẳng N–S. |
| **Innotec Việt Nam** | `innotec.com.vn` | Bảng hiển thị 2 LED siêu nhạy gắn ngay trên đỉnh khung cuộn dây giúp cả lớp quan sát rõ ánh sáng khi dịch chuyển nam châm. |

---
