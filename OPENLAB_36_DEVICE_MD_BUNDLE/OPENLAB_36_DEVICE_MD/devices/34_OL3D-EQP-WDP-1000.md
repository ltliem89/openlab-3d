# 34. Bình chứa nước có van xả định lượng 1000 ml

**Device ID:** `OL3D-EQP-WDP-1000`  
**Nhóm chức năng đề xuất:** `G04`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `water-dispenser`  
**Slug:** `volumetric-water-dispenser-1000ml`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: ISO 4796-3 · DIN 12039 · Thông tư 38/2021/TT-BGDĐT (Bình cấp nước cất có vòi khóa định lượng) * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 8 & 9 (Kết nối tri thức) · Mở đầu: Dụng cụ đo thể tích và cấp chất lỏng phòng thí nghiệm · Bài 1: Nhận biết một số dụng cụ, hoá chất. Thuyết trình một vấn đề khoa học * **Hình ảnh đối chiếu SGK**: Bình cấp nước cất định lượng có van khóa PTFE (**) * **Chức năng chuẩn**: Chứa nước cất và mở van xả chính xác theo thể tích ml yêu cầu (nhập trực tiếp số ml trên bảng điều khiển van) vào ống đong, cốc chia độ hoặc bình tràn. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 116 mm, Cao = 435 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.155 m, Cao (Y) = 0.435 m, Sâu (Z) = 0.125 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `dispenser_dock_tray`, `dispenser_dock_ring`, `scale_marks`, `scale_display`, `scale_display_rear`, `plunger`, `liquid_surface`, `spout_stream`, `stream_outer`, `stream_core`, `measurement_anchor` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; State Sync via userData; Dynamic Liquid Level & Meniscus; Optical Ray Tracing & Refraction * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `CylinderGeometry (Reservoir)` | MeshPhysicalMaterial (Polypropylene, opacity 0.45) | 4 | Bình trụ lớn dung tích 1000ml có vạch chia | | `plunger` | `Box Lever Handle` | MeshStandardMaterial (Blue Valve Lever) | 2 | Cần gạt mở van lò xo tự đóng khi nhả tay | | `spout_stream` | `Cylinder Stream` | MeshPhysicalMaterial (Water, emissive blue) | 2 | Tia nước thẳng đứng chảy vào miệng cốc bên dưới | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`, `displacementVolume` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **520 g** (Trạng thái: `verified`) - Dung tích định mức ($V_{max}$): **1000 ml** * **Thông số metrology thiết bị đo**: - Đại lượng đo: `volume` - Giới hạn đo (GHĐ): **0.5 ml** đến **1000 ml** - Độ chia nhỏ nhất (ĐCNN): **0.5 ml** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad \frac{dV}{dt} = C_d \cdot A_{van} \cdot \sqrt{2 \cdot g \cdot h_{nước}}$$ *Ý nghĩa vật lý*: Lưu lượng xả nước định lượng qua vòi van mỏ xả. $$\mathbf{(2)}\quad V_{cấp} = \int_{0}^{t} \dot{V}\,dt = 15.0\,\text{ml/s} \times t\,(\text{s})$$ *Ý nghĩa vật lý*: Thể tích nước tinh khiết định lượng cấp vào cốc đốt hoặc ống đong. * **Các tính năng khoa học tích hợp**: - Bình trụ thủy tinh Borosilicate 3.3 dung tích 1000 ml đặt trên giá đỡ 3 chân cao 110 mm giúp đặt vừa mọi loại Ống đong, Cốc thủy tinh 250 ml, Bình tràn và Bình tam giác ngay dưới vòi xả. - Tích hợp cụm van khóa PTFE có tay gạt xoay 90° và đồng hồ đo thể tích LCD kỹ thuật số ở cả mặt trước và mặt sau (360°). - Cho phép học sinh nhập trực tiếp số ml cần lấy trên bảng điều khiển để mở van xả chính xác thể tích nước mong muốn (ví dụ: 50 ml vào Ống đong hoặc 210 ml vào Bình tràn). ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `VALVE_CLOSED` * **Danh sách trạng thái khả dụng**: `VALVE_CLOSED`, `VALVE_OPEN_POURING`, `OUT_OF_WATER` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `VALVE_CLOSED` | `VALVE_OPEN_POURING` | Push dispenser lever | `V_reservoir > 0` | | `VALVE_OPEN_POURING` | `VALVE_CLOSED` | Release dispenser lever | `true` | | `VALVE_OPEN_POURING` | `OUT_OF_WATER` | Reservoir depleted | `V_reservoir <= 0` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±1.0 ml độ chính xác ngắt van định lượng * **Độ chia nhỏ nhất / Độ phân giải**: Dung tích chứa 1000 ml (ĐCNN 50 ml) * **Độ lặp lại phép đo**: ±0.5 ml * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Nước cất tinh khiết 25°C ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Nước xả rơi ra ngoài mặt bàn** | Không đặt cốc hoặc ống đong dưới khay hứng vòi xả | Nước tràn ướt mặt bàn thực hành | `Không phát hiện dụng cụ hứng tại CONN_WATER_DISPENSER_SPOUT` | Tự động khóa van và hiển thị chỉ dẫn đặt cốc hứng vào khay mâm đỡ | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **DWK Life Sciences (DURAN®) — Aspirator Bottles with Stopcock ISO 4796-3** | `dwk.com` | Bình trữ nước cất có vòi xả đáy (Aspirator bottle) 1000 ml chuẩn ISO 4796-3: Cổ vặn GL45, thủy tinh Borosilicate 3.3, khóa PTFE chống rò rỉ. | | **BrandTech Scientific — Dispensette® & Volumetric Liquid Dispensing** | `brandtech.com` | Cơ chế cấp chất lỏng định lượng chính xác theo thể tích ml đặt trước, giúp chuẩn bị mẫu nhanh và tránh sai số khi đong thủ công. | | **VietChem — Bình Đựng Nước Cất Có Vòi Xả Phòng Thí Nghiệm** | `vietchem.com.vn` | Bình chứa nước cất 1000 ml – 2000 ml có van khóa dưới đáy dùng cấp nước cho ống đong, cốc đốt và bình tràn trong phòng thực hành KHTN. | | **Labee Việt Nam — Dụng Cụ Thủy Tinh & Cấp Lỏng Định Lượng** | `labee.vn` | Vạch chia thể tích in men trắng bền nhiệt từ 100 ml đến 1000 ml, chân đế nâng cao giúp đặt cốc hứng 250 ml thuận tiện. | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Hệ thống cấp nước và dụng cụ đo thể tích phục vụ các bài thực hành Đo khối lượng riêng và Tác dụng của chất lỏng lên vật nhúng chìm. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Cấp nước có kiểm soát, định lượng theo lưu lượng hoặc lượng đặt trước.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 116 mm, Cao = 435 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.155 m, Cao (Y) = 0.435 m, Sâu (Z) = 0.125 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `dispenser_dock_tray`, `dispenser_dock_ring`, `scale_marks`, `scale_display`, `scale_display_rear`, `plunger`, `liquid_surface`, `spout_stream`, `stream_outer`, `stream_core`, `measurement_anchor`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `readScale`, `displacementVolume`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `VALVE_CLOSED`, `VALVE_OPEN_POURING`, `OUT_OF_WATER`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| plunger / lever | Cần nhấn/van xả | Nhấn giữ để mở; thả để đóng hoặc chọn lượng định lượng nếu cơ chế hỗ trợ. | Góc mở van và lưu lượng thay đổi. |
| scale_display / scale_marks | Màn hình và thang dung tích | Chọn lượng cấp mục tiêu hoặc đọc lượng nước còn lại/lượng đã cấp theo cấu hình. | Giá trị hiển thị được cập nhật từ tích phân lưu lượng. |
| spout_stream / dispenser_dock_tray / dock_ring | Vòi xả và khay định vị | Đặt cốc/ống đong đúng khay dưới vòi. | Dòng nước chỉ được xả khi vùng nhận hợp lệ; lượng nhận tăng. |
| liquid_surface | Mực nước bình chứa | Quan sát mực nước giảm khi cấp. | Dung tích còn lại cập nhật và chuyển OUT_OF_WATER khi hết. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt dụng cụ hứng trên khay đúng vị trí.
2. Chọn lượng cần cấp hoặc chế độ nhấn giữ.
3. Mở van/cần xả.
4. Theo dõi lượng đã cấp và mực nước còn lại.
5. Đóng van đúng lượng và kiểm tra thể tích trong dụng cụ nhận.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Lưu lượng phụ thuộc độ mở van và cột áp; thể tích cấp là tích phân lưu lượng theo thời gian.
- Không có cốc hứng: khóa van/cảnh báo tràn mặt bàn.
- Hết nước: chuyển OUT_OF_WATER và dừng dòng.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \frac{dV}{dt} = C_d \cdot A_{van} \cdot \sqrt{2 \cdot g \cdot h_{nước}}$$
  *Ý nghĩa vật lý*: Lưu lượng xả nước định lượng qua vòi van mỏ xả.
  $$\mathbf{(2)}\quad V_{cấp} = \int_{0}^{t} \dot{V}\,dt = 15.0\,\text{ml/s} \times t\,(\text{s})$$
  *Ý nghĩa vật lý*: Thể tích nước tinh khiết định lượng cấp vào cốc đốt hoặc ống đong.
* **Các tính năng khoa học tích hợp**:
  - Bình trụ thủy tinh Borosilicate 3.3 dung tích 1000 ml đặt trên giá đỡ 3 chân cao 110 mm giúp đặt vừa mọi loại Ống đong, Cốc thủy tinh 250 ml, Bình tràn và Bình tam giác ngay dưới vòi xả.
  - Tích hợp cụm van khóa PTFE có tay gạt xoay 90° và đồng hồ đo thể tích LCD kỹ thuật số ở cả mặt trước và mặt sau (360°).
  - Cho phép học sinh nhập trực tiếp số ml cần lấy trên bảng điều khiển để mở van xả chính xác thể tích nước mong muốn (ví dụ: 50 ml vào Ống đong hoặc 210 ml vào Bình tràn).

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `VALVE_CLOSED`
* **Danh sách trạng thái khả dụng**: `VALVE_CLOSED`, `VALVE_OPEN_POURING`, `OUT_OF_WATER`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `VALVE_CLOSED` | `VALVE_OPEN_POURING` | Push dispenser lever | `V_reservoir > 0` |
| `VALVE_OPEN_POURING` | `VALVE_CLOSED` | Release dispenser lever | `true` |
| `VALVE_OPEN_POURING` | `OUT_OF_WATER` | Reservoir depleted | `V_reservoir <= 0` |

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
| **Nước xả rơi ra ngoài mặt bàn** | Không đặt cốc hoặc ống đong dưới khay hứng vòi xả | Nước tràn ướt mặt bàn thực hành | `Không phát hiện dụng cụ hứng tại CONN_WATER_DISPENSER_SPOUT` | Tự động khóa van và hiển thị chỉ dẫn đặt cốc hứng vào khay mâm đỡ |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-WDP-1000-T01:** Đặt cốc đúng khay và xả: nước đi vào cốc.
- [ ] **OL3D-EQP-WDP-1000-T02:** Không có dụng cụ hứng: van không mở hoặc tự khóa.
- [ ] **OL3D-EQP-WDP-1000-T03:** Thả cần: van đóng và dòng dừng.
- [ ] **OL3D-EQP-WDP-1000-T04:** Xả hết bình: trạng thái OUT_OF_WATER.
- [ ] **OL3D-EQP-WDP-1000-T05:** Đặt lượng mục tiêu: hệ dừng gần giá trị mục tiêu trong sai số cho phép.

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

## 4.34. [OL3D-EQP-WDP-1000] Bình chứa nước có van xả định lượng 1000 ml
**Tên tiếng Anh**: *Volumetric Water Dispenser Carboy with Metering Valve (1000 ml)* | **Mã Archetype**: `water-dispenser` | **Phân loại danh mục**: `volume-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-WDP-1000`
* **Mã đường dẫn (Slug)**: `volumetric-water-dispenser-1000ml`
* **Môn học áp dụng**: `general-science`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: ISO 4796-3 · DIN 12039 · Thông tư 38/2021/TT-BGDĐT (Bình cấp nước cất có vòi khóa định lượng)
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 8 & 9 (Kết nối tri thức) · Mở đầu: Dụng cụ đo thể tích và cấp chất lỏng phòng thí nghiệm · Bài 1: Nhận biết một số dụng cụ, hoá chất. Thuyết trình một vấn đề khoa học
* **Hình ảnh đối chiếu SGK**: Bình cấp nước cất định lượng có van khóa PTFE (**)
* **Chức năng chuẩn**: Chứa nước cất và mở van xả chính xác theo thể tích ml yêu cầu (nhập trực tiếp số ml trên bảng điều khiển van) vào ống đong, cốc chia độ hoặc bình tràn.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 116 mm, Cao = 435 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.155 m, Cao (Y) = 0.435 m, Sâu (Z) = 0.125 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `dispenser_dock_tray`, `dispenser_dock_ring`, `scale_marks`, `scale_display`, `scale_display_rear`, `plunger`, `liquid_surface`, `spout_stream`, `stream_outer`, `stream_core`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; State Sync via userData; Dynamic Liquid Level & Meniscus; Optical Ray Tracing & Refraction
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Reservoir)` | MeshPhysicalMaterial (Polypropylene, opacity 0.45) | 4 | Bình trụ lớn dung tích 1000ml có vạch chia |
| `plunger` | `Box Lever Handle` | MeshStandardMaterial (Blue Valve Lever) | 2 | Cần gạt mở van lò xo tự đóng khi nhả tay |
| `spout_stream` | `Cylinder Stream` | MeshPhysicalMaterial (Water, emissive blue) | 2 | Tia nước thẳng đứng chảy vào miệng cốc bên dưới |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`, `displacementVolume`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **520 g** (Trạng thái: `verified`)
  - Dung tích định mức ($V_{max}$): **1000 ml**
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `volume`
  - Giới hạn đo (GHĐ): **0.5 ml** đến **1000 ml**
  - Độ chia nhỏ nhất (ĐCNN): **0.5 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \frac{dV}{dt} = C_d \cdot A_{van} \cdot \sqrt{2 \cdot g \cdot h_{nước}}$$
  *Ý nghĩa vật lý*: Lưu lượng xả nước định lượng qua vòi van mỏ xả.
  $$\mathbf{(2)}\quad V_{cấp} = \int_{0}^{t} \dot{V}\,dt = 15.0\,\text{ml/s} \times t\,(\text{s})$$
  *Ý nghĩa vật lý*: Thể tích nước tinh khiết định lượng cấp vào cốc đốt hoặc ống đong.
* **Các tính năng khoa học tích hợp**:
  - Bình trụ thủy tinh Borosilicate 3.3 dung tích 1000 ml đặt trên giá đỡ 3 chân cao 110 mm giúp đặt vừa mọi loại Ống đong, Cốc thủy tinh 250 ml, Bình tràn và Bình tam giác ngay dưới vòi xả.
  - Tích hợp cụm van khóa PTFE có tay gạt xoay 90° và đồng hồ đo thể tích LCD kỹ thuật số ở cả mặt trước và mặt sau (360°).
  - Cho phép học sinh nhập trực tiếp số ml cần lấy trên bảng điều khiển để mở van xả chính xác thể tích nước mong muốn (ví dụ: 50 ml vào Ống đong hoặc 210 ml vào Bình tràn).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `VALVE_CLOSED`
* **Danh sách trạng thái khả dụng**: `VALVE_CLOSED`, `VALVE_OPEN_POURING`, `OUT_OF_WATER`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `VALVE_CLOSED` | `VALVE_OPEN_POURING` | Push dispenser lever | `V_reservoir > 0` |
| `VALVE_OPEN_POURING` | `VALVE_CLOSED` | Release dispenser lever | `true` |
| `VALVE_OPEN_POURING` | `OUT_OF_WATER` | Reservoir depleted | `V_reservoir <= 0` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±1.0 ml độ chính xác ngắt van định lượng
* **Độ chia nhỏ nhất / Độ phân giải**: Dung tích chứa 1000 ml (ĐCNN 50 ml)
* **Độ lặp lại phép đo**: ±0.5 ml
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Nước cất tinh khiết 25°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Nước xả rơi ra ngoài mặt bàn** | Không đặt cốc hoặc ống đong dưới khay hứng vòi xả | Nước tràn ướt mặt bàn thực hành | `Không phát hiện dụng cụ hứng tại CONN_WATER_DISPENSER_SPOUT` | Tự động khóa van và hiển thị chỉ dẫn đặt cốc hứng vào khay mâm đỡ |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **DWK Life Sciences (DURAN®) — Aspirator Bottles with Stopcock ISO 4796-3** | `dwk.com` | Bình trữ nước cất có vòi xả đáy (Aspirator bottle) 1000 ml chuẩn ISO 4796-3: Cổ vặn GL45, thủy tinh Borosilicate 3.3, khóa PTFE chống rò rỉ. |
| **BrandTech Scientific — Dispensette® & Volumetric Liquid Dispensing** | `brandtech.com` | Cơ chế cấp chất lỏng định lượng chính xác theo thể tích ml đặt trước, giúp chuẩn bị mẫu nhanh và tránh sai số khi đong thủ công. |
| **VietChem — Bình Đựng Nước Cất Có Vòi Xả Phòng Thí Nghiệm** | `vietchem.com.vn` | Bình chứa nước cất 1000 ml – 2000 ml có van khóa dưới đáy dùng cấp nước cho ống đong, cốc đốt và bình tràn trong phòng thực hành KHTN. |
| **Labee Việt Nam — Dụng Cụ Thủy Tinh & Cấp Lỏng Định Lượng** | `labee.vn` | Vạch chia thể tích in men trắng bền nhiệt từ 100 ml đến 1000 ml, chân đế nâng cao giúp đặt cốc hứng 250 ml thuận tiện. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Hệ thống cấp nước và dụng cụ đo thể tích phục vụ các bài thực hành Đo khối lượng riêng và Tác dụng của chất lỏng lên vật nhúng chìm. |

---
