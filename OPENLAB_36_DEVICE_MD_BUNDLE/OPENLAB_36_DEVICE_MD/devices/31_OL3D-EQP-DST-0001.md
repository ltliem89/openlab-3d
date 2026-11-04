# 31. Bình cầu có nhánh 250 mL, Lưới tản nhiệt & Đèn cồn (SGK KHTN 9)

**Device ID:** `OL3D-EQP-DST-0001`  
**Nhóm chức năng đề xuất:** `G05`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `distillation-flask`  
**Slug:** `distillation-flask-wire-gauze-burner`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: DIN 12394 · Thông tư 38/2021 · Hình 1.9 & 1.10 trang 7–8 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương VII: Hydrocarbon · Bài 1 (trang 8: Hình 1.9 Bình cầu, Hình 1.10 Lưới tản nhiệt) & Bài 24: Alkene (trang 112: Hình 24.1 Điều chế ethylene) * **Hình ảnh đối chiếu SGK**: Hình 1.9, Hình 1.10, Hình 24.1 (**) * **Chức năng chuẩn**: Bình cầu dùng để đựng chất lỏng, pha chế dung dịch, đun nóng, chưng cất hoặc điều chế khí; Lưới tản nhiệt giúp phân tán đều nhiệt lượng khi đốt bằng đèn cồn, tránh làm nứt vỡ đáy bình thuỷ tinh. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 105 mm, Cao = 230 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.23 m, Sâu (Z) = 0.11 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `flame_group`, `liquid_surface` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `Sphere + Cylinder Branch` | MeshPhysicalMaterial (Borosilicate Glass, transmission 0.88) | 4 | Bình cầu có nhánh cổ 250ml nối ống sinh hàn | | `flame_group` | `Flame particle mesh` | MeshBasicMaterial (Combustion flame) | 5 | Ngọn lửa đèn cồn sưởi đáy bình qua lưới tản nhiệt | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **380 g** (Trạng thái: `verified`) - Dung tích định mức ($V_{max}$): **250 ml** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad T_{sôi\,ethanol} = 78.37^\circ\text{C} < T_{sôi\,nước} = 100.00^\circ\text{C}$$ *Ý nghĩa vật lý*: Nguyên lý chưng cất phân đoạn: Hợp chất có nhiệt độ sôi thấp hơn (rượu cồn) sẽ bay hơi trước, ngưng tụ trong ống sinh hàn và chảy vào bình hứng. $$\mathbf{(2)}\quad Q_{ngưng\,tụ} = m_{hơi} \cdot L_{v} = \dot{m}_{nước\,làm\,mát} \cdot c_{nước} \cdot \Delta T_{nước}$$ *Ý nghĩa vật lý*: Cân bằng nhiệt lượng trao đổi trong ống sinh hàn Liebig làm mát bằng nước chảy ngược chiều. * **Các tính năng khoa học tích hợp**: - Tổ hợp hoàn chỉnh theo đúng Hình 1.9 và Hình 1.10 trang 7–8 SGK KHTN 9: Đèn cồn thủy tinh → Kiềng & Lưới tản nhiệt → Bình cầu có nhánh dẫn hơi qua ống sinh hàn. - Lưới tản nhiệt thép không gỉ có tâm gốm chịu nhiệt giúp phân bố đều nhiệt lượng lên đáy tròn của bình cầu, chống nứt vỡ thủy tinh. - Dùng tách hỗn hợp chất lỏng có nhiệt độ sôi khác nhau (như chưng cất rượu etylic - nước hoặc điều chế nước cất). ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `COLD_MIXTURE` * **Danh sách trạng thái khả dụng**: `COLD_MIXTURE`, `HEATING_RAMP`, `ETHANOL_BOILING_78C`, `WATER_BOILING_100C` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `COLD_MIXTURE` | `HEATING_RAMP` | Burner flame applied | `T < 78°C` | | `HEATING_RAMP` | `ETHANOL_BOILING_78C` | Temperature plateaus at 78°C | `T == 78.3°C` | | `ETHANOL_BOILING_78C` | `WATER_BOILING_100C` | All ethanol distilled over | `T rises to 100°C` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±0.5 °C nhiệt độ sôi đo tại nhánh cổ bình * **Độ chia nhỏ nhất / Độ phân giải**: 250 ml dung tích bình cầu * **Độ lặp lại phép đo**: Độ tinh khiết sản phẩm ngưng tụ đạt 92 - 95% cồn * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Chịu sốc nhiệt ΔT = 160°C ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Đặt sai vị trí bầu nhiệt kế** | Cắm sâu nhiệt kế xuống tận đáy chất lỏng thay vì đặt ngang miệng nhánh thoát hơi | Đo sai nhiệt độ sôi của hơi ngưng tụ | `Cao độ bầu nhiệt kế != cao độ nhánh bình cầu` | Căn chỉnh bầu nhiệt kế nằm ngang tâm lỗ thoát hơi của nhánh bình cầu | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Nhà sách Giáo dục — Bình cầu có nhánh 250ml** | `nhasachgiaoduc.vn` | Bình cầu có nhánh 250 ml chuẩn KHTN 9: Đường kính bầu Ø 84–85 mm, chiều cao 165–170 mm, cổ Ø 28 mm, nhánh thoát hơi Ø 6–8 mm. | | **Visitech — Bộ Dụng cụ Chưng cất Đơn giản** | `visitech.vn` | Cấu tạo bình cầu có nhánh (Distilling Flask) kết hợp nhiệt kế cắm ở cổ bình và ống sinh hàn nước. | | **Innotec Việt Nam** | `innotec.com.vn` | Lưới tản nhiệt 140×140 mm và đèn cồn thủy tinh 150 ml có chụp dập lửa an toàn theo Thông tư 38/2021. | | **VietChem — Kỹ thuật Chưng cất Phòng thí nghiệm** | `vietchem.com.vn` | Quy tắc lắp ống sinh hàn: Nước làm lạnh luôn đi vào từ vòi thấp và đi ra ở vòi cao (ngược chiều dòng hơi ngưng tụ). | | **VietJack — SGK KHTN 9 Hình 1.9 & 1.10 trang 7–8** | `vietjack.com` | Hình 1.9 (Bình cầu có nhánh) và Hình 1.10 (Lưới tản nhiệt trong bộ dụng cụ đun nóng chất lỏng / chưng cất). | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Mô phỏng bộ chưng cất đơn giản: gia nhiệt hỗn hợp, dẫn hơi qua sinh hàn và thu dịch ngưng tụ.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 105 mm, Cao = 230 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.23 m, Sâu (Z) = 0.11 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `flame_group`, `liquid_surface`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `readScale`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `COLD_MIXTURE`, `HEATING_RAMP`, `ETHANOL_BOILING_78C`, `WATER_BOILING_100C`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body / flask | Bình cầu có nhánh | Cho hỗn hợp vào; lắp kín với đường dẫn hơi và bộ sinh hàn phù hợp. | Dung dịch nhận nhiệt và bay hơi theo thành phần/nhiệt độ. |
| flame_group / burner | Đèn cồn/nguồn nhiệt | Bật/tắt, điều chỉnh nguồn theo cấu hình an toàn. | Nhiệt truyền vào bình cầu; nhiệt độ tăng. |
| wire gauze / support | Lưới tản nhiệt và giá đỡ | Đặt bình cầu ổn định trên lưới/giá. | Đỡ bình, phân bố nhiệt; không cho bình lơ lửng. |
| condenser / water ports (if present) | Ống sinh hàn và nước làm mát | Nối dòng nước làm mát theo chiều quy định, mở và điều chỉnh lưu lượng. | Hơi ngưng tụ thành chất lỏng ở đầu ra. |
| receiver connector | Bình hứng | Đặt bình nhận tại đầu ra. | Chất lỏng ngưng tụ được thu hồi. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Lắp bình cầu, đường dẫn hơi, sinh hàn và bình hứng đúng thứ tự.
2. Kiểm tra các mối nối và dòng nước làm mát trước khi gia nhiệt.
3. Đưa hỗn hợp vào bình với lượng an toàn.
4. Gia nhiệt từ từ và theo dõi nhiệt độ.
5. Dẫn hơi qua sinh hàn, thu dịch ngưng tụ.
6. Tắt nhiệt và chờ hệ nguội trước khi tháo lắp.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Thành phần có nhiệt độ sôi thấp hơn bay hơi ưu tiên trong mô hình hỗn hợp đã định nghĩa.
- Sinh hàn cần có nước làm mát mới cho kết quả ngưng tụ hiệu quả.
- Không gia nhiệt bình kín; hệ phải có đường thoát hơi phù hợp và cảnh báo nguy cơ áp suất.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad T_{sôi\,ethanol} = 78.37^\circ\text{C} < T_{sôi\,nước} = 100.00^\circ\text{C}$$
  *Ý nghĩa vật lý*: Nguyên lý chưng cất phân đoạn: Hợp chất có nhiệt độ sôi thấp hơn (rượu cồn) sẽ bay hơi trước, ngưng tụ trong ống sinh hàn và chảy vào bình hứng.
  $$\mathbf{(2)}\quad Q_{ngưng\,tụ} = m_{hơi} \cdot L_{v} = \dot{m}_{nước\,làm\,mát} \cdot c_{nước} \cdot \Delta T_{nước}$$
  *Ý nghĩa vật lý*: Cân bằng nhiệt lượng trao đổi trong ống sinh hàn Liebig làm mát bằng nước chảy ngược chiều.
* **Các tính năng khoa học tích hợp**:
  - Tổ hợp hoàn chỉnh theo đúng Hình 1.9 và Hình 1.10 trang 7–8 SGK KHTN 9: Đèn cồn thủy tinh → Kiềng & Lưới tản nhiệt → Bình cầu có nhánh dẫn hơi qua ống sinh hàn.
  - Lưới tản nhiệt thép không gỉ có tâm gốm chịu nhiệt giúp phân bố đều nhiệt lượng lên đáy tròn của bình cầu, chống nứt vỡ thủy tinh.
  - Dùng tách hỗn hợp chất lỏng có nhiệt độ sôi khác nhau (như chưng cất rượu etylic - nước hoặc điều chế nước cất).

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `COLD_MIXTURE`
* **Danh sách trạng thái khả dụng**: `COLD_MIXTURE`, `HEATING_RAMP`, `ETHANOL_BOILING_78C`, `WATER_BOILING_100C`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `COLD_MIXTURE` | `HEATING_RAMP` | Burner flame applied | `T < 78°C` |
| `HEATING_RAMP` | `ETHANOL_BOILING_78C` | Temperature plateaus at 78°C | `T == 78.3°C` |
| `ETHANOL_BOILING_78C` | `WATER_BOILING_100C` | All ethanol distilled over | `T rises to 100°C` |

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
| **Đặt sai vị trí bầu nhiệt kế** | Cắm sâu nhiệt kế xuống tận đáy chất lỏng thay vì đặt ngang miệng nhánh thoát hơi | Đo sai nhiệt độ sôi của hơi ngưng tụ | `Cao độ bầu nhiệt kế != cao độ nhánh bình cầu` | Căn chỉnh bầu nhiệt kế nằm ngang tâm lỗ thoát hơi của nhánh bình cầu |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-DST-0001-T01:** Không cấp nhiệt: không có dòng hơi đáng kể.
- [ ] **OL3D-EQP-DST-0001-T02:** Cấp nhiệt: nhiệt độ và tốc độ bay hơi thay đổi.
- [ ] **OL3D-EQP-DST-0001-T03:** Không có nước làm mát: hiệu suất ngưng tụ giảm/cảnh báo.
- [ ] **OL3D-EQP-DST-0001-T04:** Có bình hứng và sinh hàn: dịch ngưng tụ được thu đúng.
- [ ] **OL3D-EQP-DST-0001-T05:** Tắt nhiệt: quá trình bay hơi giảm và thiết bị nguội dần.

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

## 4.31. [OL3D-EQP-DST-0001] Bình cầu có nhánh 250 mL, Lưới tản nhiệt & Đèn cồn (SGK KHTN 9)
**Tên tiếng Anh**: *250 mL Side-Arm Distillation Flask on Wire Gauze & Burner* | **Mã Archetype**: `distillation-flask` | **Phân loại danh mục**: `chemical-apparatus`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-DST-0001`
* **Mã đường dẫn (Slug)**: `distillation-flask-wire-gauze-burner`
* **Môn học áp dụng**: `chemistry`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: DIN 12394 · Thông tư 38/2021 · Hình 1.9 & 1.10 trang 7–8 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương VII: Hydrocarbon · Bài 1 (trang 8: Hình 1.9 Bình cầu, Hình 1.10 Lưới tản nhiệt) & Bài 24: Alkene (trang 112: Hình 24.1 Điều chế ethylene)
* **Hình ảnh đối chiếu SGK**: Hình 1.9, Hình 1.10, Hình 24.1 (**)
* **Chức năng chuẩn**: Bình cầu dùng để đựng chất lỏng, pha chế dung dịch, đun nóng, chưng cất hoặc điều chế khí; Lưới tản nhiệt giúp phân tán đều nhiệt lượng khi đốt bằng đèn cồn, tránh làm nứt vỡ đáy bình thuỷ tinh.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 105 mm, Cao = 230 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.23 m, Sâu (Z) = 0.11 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `flame_group`, `liquid_surface`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Sphere + Cylinder Branch` | MeshPhysicalMaterial (Borosilicate Glass, transmission 0.88) | 4 | Bình cầu có nhánh cổ 250ml nối ống sinh hàn |
| `flame_group` | `Flame particle mesh` | MeshBasicMaterial (Combustion flame) | 5 | Ngọn lửa đèn cồn sưởi đáy bình qua lưới tản nhiệt |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **380 g** (Trạng thái: `verified`)
  - Dung tích định mức ($V_{max}$): **250 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad T_{sôi\,ethanol} = 78.37^\circ\text{C} < T_{sôi\,nước} = 100.00^\circ\text{C}$$
  *Ý nghĩa vật lý*: Nguyên lý chưng cất phân đoạn: Hợp chất có nhiệt độ sôi thấp hơn (rượu cồn) sẽ bay hơi trước, ngưng tụ trong ống sinh hàn và chảy vào bình hứng.
  $$\mathbf{(2)}\quad Q_{ngưng\,tụ} = m_{hơi} \cdot L_{v} = \dot{m}_{nước\,làm\,mát} \cdot c_{nước} \cdot \Delta T_{nước}$$
  *Ý nghĩa vật lý*: Cân bằng nhiệt lượng trao đổi trong ống sinh hàn Liebig làm mát bằng nước chảy ngược chiều.
* **Các tính năng khoa học tích hợp**:
  - Tổ hợp hoàn chỉnh theo đúng Hình 1.9 và Hình 1.10 trang 7–8 SGK KHTN 9: Đèn cồn thủy tinh → Kiềng & Lưới tản nhiệt → Bình cầu có nhánh dẫn hơi qua ống sinh hàn.
  - Lưới tản nhiệt thép không gỉ có tâm gốm chịu nhiệt giúp phân bố đều nhiệt lượng lên đáy tròn của bình cầu, chống nứt vỡ thủy tinh.
  - Dùng tách hỗn hợp chất lỏng có nhiệt độ sôi khác nhau (như chưng cất rượu etylic - nước hoặc điều chế nước cất).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `COLD_MIXTURE`
* **Danh sách trạng thái khả dụng**: `COLD_MIXTURE`, `HEATING_RAMP`, `ETHANOL_BOILING_78C`, `WATER_BOILING_100C`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `COLD_MIXTURE` | `HEATING_RAMP` | Burner flame applied | `T < 78°C` |
| `HEATING_RAMP` | `ETHANOL_BOILING_78C` | Temperature plateaus at 78°C | `T == 78.3°C` |
| `ETHANOL_BOILING_78C` | `WATER_BOILING_100C` | All ethanol distilled over | `T rises to 100°C` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.5 °C nhiệt độ sôi đo tại nhánh cổ bình
* **Độ chia nhỏ nhất / Độ phân giải**: 250 ml dung tích bình cầu
* **Độ lặp lại phép đo**: Độ tinh khiết sản phẩm ngưng tụ đạt 92 - 95% cồn
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Chịu sốc nhiệt ΔT = 160°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Đặt sai vị trí bầu nhiệt kế** | Cắm sâu nhiệt kế xuống tận đáy chất lỏng thay vì đặt ngang miệng nhánh thoát hơi | Đo sai nhiệt độ sôi của hơi ngưng tụ | `Cao độ bầu nhiệt kế != cao độ nhánh bình cầu` | Căn chỉnh bầu nhiệt kế nằm ngang tâm lỗ thoát hơi của nhánh bình cầu |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Nhà sách Giáo dục — Bình cầu có nhánh 250ml** | `nhasachgiaoduc.vn` | Bình cầu có nhánh 250 ml chuẩn KHTN 9: Đường kính bầu Ø 84–85 mm, chiều cao 165–170 mm, cổ Ø 28 mm, nhánh thoát hơi Ø 6–8 mm. |
| **Visitech — Bộ Dụng cụ Chưng cất Đơn giản** | `visitech.vn` | Cấu tạo bình cầu có nhánh (Distilling Flask) kết hợp nhiệt kế cắm ở cổ bình và ống sinh hàn nước. |
| **Innotec Việt Nam** | `innotec.com.vn` | Lưới tản nhiệt 140×140 mm và đèn cồn thủy tinh 150 ml có chụp dập lửa an toàn theo Thông tư 38/2021. |
| **VietChem — Kỹ thuật Chưng cất Phòng thí nghiệm** | `vietchem.com.vn` | Quy tắc lắp ống sinh hàn: Nước làm lạnh luôn đi vào từ vòi thấp và đi ra ở vòi cao (ngược chiều dòng hơi ngưng tụ). |
| **VietJack — SGK KHTN 9 Hình 1.9 & 1.10 trang 7–8** | `vietjack.com` | Hình 1.9 (Bình cầu có nhánh) và Hình 1.10 (Lưới tản nhiệt trong bộ dụng cụ đun nóng chất lỏng / chưng cất). |

---
