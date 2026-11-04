# 30. Phễu chiết có khoá & Phễu lọc trên giá đỡ (SGK KHTN 9)

**Device ID:** `OL3D-EQP-SEP-0001`  
**Nhóm chức năng đề xuất:** `G04/G05`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `separatory-funnel`  
**Slug:** `separatory-funnel-stand`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-SEP-0001_separatory-funnel-stand` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: ISO 4800 · DIN 12451 (Squibb Pear-Shape) · Hình 1.8b trang 7 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu, Chương VI & Chương VIII · Bài 1 (trang 8), Bài 21 (Hình 21.1 - Hấp phụ màu bằng than gỗ), Bài 27 (Phản ứng ester hoá) * **Hình ảnh đối chiếu SGK**: Hình 1.8a (Phễu lọc), Hình 1.8b (Phễu chiết), Hình 21.1 (**) * **Chức năng chuẩn**: Phễu thường dùng để rót chất lỏng hoặc lọc/hấp phụ chất màu qua lớp bông và bột than gỗ; Phễu chiết dùng để tách hai chất lỏng phân lớp không hoà tan vào nhau theo phương pháp chiết. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 270 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.27 m, Sâu (Z) = 0.13 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `handle`, `liquid_surface`, `aq_layer`, `org_layer`, `spout_stream`, `stream_outer`, `splash_ring_0` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `LatheGeometry (Pear shape)` | MeshPhysicalMaterial (Borosilicate, transmission 0.88) | 4 | Phễu chiết quả lê thủy tinh 250ml có vòi xả đáy | | `handle` | `CylinderGeometry (T-key)` | MeshStandardMaterial (PTFE White Key) | 2 | Khóa van xoay 90° điều tiết dòng chảy | | `aq_layer` | `Cylinder / Cone` | MeshPhysicalMaterial (Water phase, Blue) | 2 | Lớp dung dịch pha nước nặng chìm phía dưới | | `org_layer` | `Cylinder / Cone` | MeshPhysicalMaterial (Oil phase, Yellowish) | 2 | Lớp dung dịch hữu cơ nhẹ nổi phía trên | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **490 g** (Trạng thái: `verified`) - Dung tích định mức ($V_{max}$): **125 ml** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad v_{chảy} = C_v \cdot \sqrt{2 \cdot g \cdot h_{liquid}}$$ *Ý nghĩa vật lý*: Tốc độ xả chất lỏng qua lỗ khóa van PTFE theo định luật Torricelli. $$\mathbf{(2)}\quad \Delta \rho = \rho_{nước} - \rho_{dầu} = 1.00 - 0.85 = 0.15\text{ g/cm}^3$$ *Ý nghĩa vật lý*: Sự chênh lệch khối lượng riêng tạo ra 2 pha lỏng không tan phân lớp rõ rệt (Pha dưới: Nước màu xanh; Pha trên: Dầu ăn màu vàng nhạt). * **Các tính năng khoa học tích hợp**: - Bầu thủy tinh Borosilicate 3.3 hình quả lê (Squibb) giúp phân tách ranh giới hai lớp chất lỏng không hòa tan vào nhau (như dầu ăn nổi trên nước hoặc este/nước) rõ nét. - Trang bị khóa vòi bằng nhựa PTFE (Teflon) xoay nhẹ không cần bôi mỡ và nút nhám kín khí ở cổ phễu. - Mô hình 3D thể hiện trực quan 2 tầng chất lỏng tách lớp: lớp chất lỏng nhẹ màu vàng hổ phách ở trên và lớp nước trong suốt ở dưới. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `EMPTY_STOPCOCK_CLOSED` * **Danh sách trạng thái khả dụng**: `EMPTY_STOPCOCK_CLOSED`, `TWO_PHASE_SETTLED`, `DRAINING_LOWER_PHASE`, `INTERFACIAL_CUTOFF` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `EMPTY_STOPCOCK_CLOSED` | `TWO_PHASE_SETTLED` | Oil and water mixed & allowed to stand | `t_stand > 5s` | | `TWO_PHASE_SETTLED` | `DRAINING_LOWER_PHASE` | Stopcock turned open 90° | `isOpen == true` | | `DRAINING_LOWER_PHASE` | `INTERFACIAL_CUTOFF` | Boundary reaches stopcock | `v_lower == 0` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±2.0 ml độ chính xác điểm cắt pha * **Độ chia nhỏ nhất / Độ phân giải**: Dung tích 250 ml (ĐCNN 10 ml) * **Độ lặp lại phép đo**: Khóa van PTFE tự bôi trơn kín khít 100% không rò rỉ * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Quên mở nút nhám trên đỉnh khi mở khóa vòi đáy** | Áp suất khí quyển bên trong giảm tạo chân không giữ chất lỏng | Dòng nước ngừng chảy dù van đáy đang mở | `P_internal < P_atm - 5 kPa` | Bắt buộc mở nút đậy trên đỉnh phễu trước khi vặn khóa xả pha dưới | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Labee Việt Nam — Phễu chiết Quả lê Thủy tinh** | `labee.vn` | Phễu chiết 100–125 ml (ISO 4800): Đường kính bầu Ø 60–68 mm, chiều cao 220–245 mm, cổ mài chuẩn NS 19/26, khóa PTFE. | | **VietChem — Dụng cụ Tách chất** | `vietchem.com.vn` | Nguyên tắc chiết lỏng–lỏng bằng phễu chiết: Mở nắp trên trước khi vặn khóa xả lớp chất lỏng nặng ở dưới. | | **VietJack — SGK KHTN 9 Hình 1.8b trang 7** | `vietjack.com` | Hình 1.8b trang 7 SGK KHTN 9: Phễu chiết dùng để tách các chất lỏng không tan vào nhau và tách lớp. | | **Visitech Việt Nam** | `visitech.vn` | Phễu chiết Borosilicate 3.3 lắp trên vòng đỡ sắt của giá thí nghiệm, bên dưới đặt cốc thủy tinh hứng. | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Phễu chiết 100–125 ml có khóa thuộc danh mục dụng cụ Hóa học cấp THCS. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Tách hai chất lỏng không trộn lẫn bằng phễu chiết và lọc hỗn hợp bằng phễu lọc.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 270 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.27 m, Sâu (Z) = 0.13 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `handle`, `liquid_surface`, `aq_layer`, `org_layer`, `spout_stream`, `stream_outer`, `splash_ring_0`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `readScale`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `EMPTY_STOPCOCK_CLOSED`, `TWO_PHASE_SETTLED`, `DRAINING_LOWER_PHASE`, `INTERFACIAL_CUTOFF`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body / handle | Thân phễu và tay giữ | Đặt vào vòng kẹp giá đỡ; xoay để thẳng đứng. | Phễu được giữ chắc, phân lớp theo trọng lực. |
| stopcock / valve | Khóa van | Xoay tay khóa theo góc đóng/mở; điều tiết dòng chảy. | Dòng chảy xuất hiện khi mở; dừng khi đóng. |
| aq_layer / org_layer / liquid_surface | Hai lớp chất lỏng | Đổ hỗn hợp hai pha và chờ phân lớp. | Lớp có khối lượng riêng lớn hơn ở dưới theo dữ liệu mẫu. |
| filter funnel / filter paper | Phễu lọc và giấy lọc | Lắp giấy lọc, làm ướt nếu quy trình yêu cầu, rót huyền phù. | Chất lỏng qua giấy lọc; chất rắn giữ lại. |
| spout_stream | Dòng xả | Đặt bình hứng, mở van từ từ và đóng trước khi pha trên tới vòi. | Thu riêng lớp dưới; tránh lẫn pha. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Cố định phễu trên giá và đóng khóa.
2. Đổ hỗn hợp hai pha vào phễu.
3. Chờ phân lớp rõ.
4. Đặt bình hứng, mở khóa lấy lớp dưới.
5. Đóng van trước mặt phân cách; đổi bình nếu cần lấy lớp trên.
6. Đối với lọc: lắp giấy lọc và rót qua phễu lọc.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Tốc độ dòng phụ thuộc chiều cao cột chất lỏng và độ mở van.
- Hai pha phân lớp theo chênh lệch khối lượng riêng và không trộn lẫn theo giả định.
- Van mở khi không có bình hứng phải cảnh báo tràn.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad v_{chảy} = C_v \cdot \sqrt{2 \cdot g \cdot h_{liquid}}$$
  *Ý nghĩa vật lý*: Tốc độ xả chất lỏng qua lỗ khóa van PTFE theo định luật Torricelli.
  $$\mathbf{(2)}\quad \Delta \rho = \rho_{nước} - \rho_{dầu} = 1.00 - 0.85 = 0.15\text{ g/cm}^3$$
  *Ý nghĩa vật lý*: Sự chênh lệch khối lượng riêng tạo ra 2 pha lỏng không tan phân lớp rõ rệt (Pha dưới: Nước màu xanh; Pha trên: Dầu ăn màu vàng nhạt).
* **Các tính năng khoa học tích hợp**:
  - Bầu thủy tinh Borosilicate 3.3 hình quả lê (Squibb) giúp phân tách ranh giới hai lớp chất lỏng không hòa tan vào nhau (như dầu ăn nổi trên nước hoặc este/nước) rõ nét.
  - Trang bị khóa vòi bằng nhựa PTFE (Teflon) xoay nhẹ không cần bôi mỡ và nút nhám kín khí ở cổ phễu.
  - Mô hình 3D thể hiện trực quan 2 tầng chất lỏng tách lớp: lớp chất lỏng nhẹ màu vàng hổ phách ở trên và lớp nước trong suốt ở dưới.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY_STOPCOCK_CLOSED`
* **Danh sách trạng thái khả dụng**: `EMPTY_STOPCOCK_CLOSED`, `TWO_PHASE_SETTLED`, `DRAINING_LOWER_PHASE`, `INTERFACIAL_CUTOFF`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY_STOPCOCK_CLOSED` | `TWO_PHASE_SETTLED` | Oil and water mixed & allowed to stand | `t_stand > 5s` |
| `TWO_PHASE_SETTLED` | `DRAINING_LOWER_PHASE` | Stopcock turned open 90° | `isOpen == true` |
| `DRAINING_LOWER_PHASE` | `INTERFACIAL_CUTOFF` | Boundary reaches stopcock | `v_lower == 0` |

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
| **Quên mở nút nhám trên đỉnh khi mở khóa vòi đáy** | Áp suất khí quyển bên trong giảm tạo chân không giữ chất lỏng | Dòng nước ngừng chảy dù van đáy đang mở | `P_internal < P_atm - 5 kPa` | Bắt buộc mở nút đậy trên đỉnh phễu trước khi vặn khóa xả pha dưới |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-SEP-0001-T01:** Đổ nước/dầu: hai lớp tách rõ, đúng thứ tự mật độ.
- [ ] **OL3D-EQP-SEP-0001-T02:** Mở van: lớp dưới chảy ra; đóng van: dòng dừng.
- [ ] **OL3D-EQP-SEP-0001-T03:** Không có bình hứng: cảnh báo hoặc khóa thao tác.
- [ ] **OL3D-EQP-SEP-0001-T04:** Lọc: chất rắn lưu trên giấy lọc, dịch lọc xuống bình nhận.

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

## 4.30. [OL3D-EQP-SEP-0001] Phễu chiết có khoá & Phễu lọc trên giá đỡ (SGK KHTN 9)
**Tên tiếng Anh**: *Glass Separatory Funnel on Ring Stand* | **Mã Archetype**: `separatory-funnel` | **Phân loại danh mục**: `chemical-apparatus`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-SEP-0001`
* **Mã đường dẫn (Slug)**: `separatory-funnel-stand`
* **Môn học áp dụng**: `chemistry`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-SEP-0001_separatory-funnel-stand` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: ISO 4800 · DIN 12451 (Squibb Pear-Shape) · Hình 1.8b trang 7 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu, Chương VI & Chương VIII · Bài 1 (trang 8), Bài 21 (Hình 21.1 - Hấp phụ màu bằng than gỗ), Bài 27 (Phản ứng ester hoá)
* **Hình ảnh đối chiếu SGK**: Hình 1.8a (Phễu lọc), Hình 1.8b (Phễu chiết), Hình 21.1 (**)
* **Chức năng chuẩn**: Phễu thường dùng để rót chất lỏng hoặc lọc/hấp phụ chất màu qua lớp bông và bột than gỗ; Phễu chiết dùng để tách hai chất lỏng phân lớp không hoà tan vào nhau theo phương pháp chiết.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 270 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.27 m, Sâu (Z) = 0.13 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `handle`, `liquid_surface`, `aq_layer`, `org_layer`, `spout_stream`, `stream_outer`, `splash_ring_0`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `LatheGeometry (Pear shape)` | MeshPhysicalMaterial (Borosilicate, transmission 0.88) | 4 | Phễu chiết quả lê thủy tinh 250ml có vòi xả đáy |
| `handle` | `CylinderGeometry (T-key)` | MeshStandardMaterial (PTFE White Key) | 2 | Khóa van xoay 90° điều tiết dòng chảy |
| `aq_layer` | `Cylinder / Cone` | MeshPhysicalMaterial (Water phase, Blue) | 2 | Lớp dung dịch pha nước nặng chìm phía dưới |
| `org_layer` | `Cylinder / Cone` | MeshPhysicalMaterial (Oil phase, Yellowish) | 2 | Lớp dung dịch hữu cơ nhẹ nổi phía trên |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **490 g** (Trạng thái: `verified`)
  - Dung tích định mức ($V_{max}$): **125 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad v_{chảy} = C_v \cdot \sqrt{2 \cdot g \cdot h_{liquid}}$$
  *Ý nghĩa vật lý*: Tốc độ xả chất lỏng qua lỗ khóa van PTFE theo định luật Torricelli.
  $$\mathbf{(2)}\quad \Delta \rho = \rho_{nước} - \rho_{dầu} = 1.00 - 0.85 = 0.15\text{ g/cm}^3$$
  *Ý nghĩa vật lý*: Sự chênh lệch khối lượng riêng tạo ra 2 pha lỏng không tan phân lớp rõ rệt (Pha dưới: Nước màu xanh; Pha trên: Dầu ăn màu vàng nhạt).
* **Các tính năng khoa học tích hợp**:
  - Bầu thủy tinh Borosilicate 3.3 hình quả lê (Squibb) giúp phân tách ranh giới hai lớp chất lỏng không hòa tan vào nhau (như dầu ăn nổi trên nước hoặc este/nước) rõ nét.
  - Trang bị khóa vòi bằng nhựa PTFE (Teflon) xoay nhẹ không cần bôi mỡ và nút nhám kín khí ở cổ phễu.
  - Mô hình 3D thể hiện trực quan 2 tầng chất lỏng tách lớp: lớp chất lỏng nhẹ màu vàng hổ phách ở trên và lớp nước trong suốt ở dưới.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY_STOPCOCK_CLOSED`
* **Danh sách trạng thái khả dụng**: `EMPTY_STOPCOCK_CLOSED`, `TWO_PHASE_SETTLED`, `DRAINING_LOWER_PHASE`, `INTERFACIAL_CUTOFF`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY_STOPCOCK_CLOSED` | `TWO_PHASE_SETTLED` | Oil and water mixed & allowed to stand | `t_stand > 5s` |
| `TWO_PHASE_SETTLED` | `DRAINING_LOWER_PHASE` | Stopcock turned open 90° | `isOpen == true` |
| `DRAINING_LOWER_PHASE` | `INTERFACIAL_CUTOFF` | Boundary reaches stopcock | `v_lower == 0` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±2.0 ml độ chính xác điểm cắt pha
* **Độ chia nhỏ nhất / Độ phân giải**: Dung tích 250 ml (ĐCNN 10 ml)
* **Độ lặp lại phép đo**: Khóa van PTFE tự bôi trơn kín khít 100% không rò rỉ
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Quên mở nút nhám trên đỉnh khi mở khóa vòi đáy** | Áp suất khí quyển bên trong giảm tạo chân không giữ chất lỏng | Dòng nước ngừng chảy dù van đáy đang mở | `P_internal < P_atm - 5 kPa` | Bắt buộc mở nút đậy trên đỉnh phễu trước khi vặn khóa xả pha dưới |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Labee Việt Nam — Phễu chiết Quả lê Thủy tinh** | `labee.vn` | Phễu chiết 100–125 ml (ISO 4800): Đường kính bầu Ø 60–68 mm, chiều cao 220–245 mm, cổ mài chuẩn NS 19/26, khóa PTFE. |
| **VietChem — Dụng cụ Tách chất** | `vietchem.com.vn` | Nguyên tắc chiết lỏng–lỏng bằng phễu chiết: Mở nắp trên trước khi vặn khóa xả lớp chất lỏng nặng ở dưới. |
| **VietJack — SGK KHTN 9 Hình 1.8b trang 7** | `vietjack.com` | Hình 1.8b trang 7 SGK KHTN 9: Phễu chiết dùng để tách các chất lỏng không tan vào nhau và tách lớp. |
| **Visitech Việt Nam** | `visitech.vn` | Phễu chiết Borosilicate 3.3 lắp trên vòng đỡ sắt của giá thí nghiệm, bên dưới đặt cốc thủy tinh hứng. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Phễu chiết 100–125 ml có khóa thuộc danh mục dụng cụ Hóa học cấp THCS. |

---
