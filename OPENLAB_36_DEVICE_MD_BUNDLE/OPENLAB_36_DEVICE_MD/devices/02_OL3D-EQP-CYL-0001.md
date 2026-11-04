# 02. Ống đong thủy tinh 100 ml

**Device ID:** `OL3D-EQP-CYL-0001`  
**Nhóm chức năng đề xuất:** `G04`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `graduated-cylinder`  
**Slug:** `ong-dong-thuy-tinh-100ml`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-CYL-0001_ong-dong-thuy-tinh-100ml` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: ISO 4788 · DIN 12680 · Thông tư 38/2021/TT-BGDĐT ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 32 mm, Cao = 255 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.065 m, Cao (Y) = 0.255 m, Sâu (Z) = 0.065 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `pouring_lip`, `scale_marks`, `liquid_surface`, `liquid_body` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `CylinderGeometry (Hollow)` | MeshPhysicalMaterial (Borosilicate, transmission 0.88) | 4 | Thân trụ thành dày 1.8mm kèm mỏ rót | | `scale_marks` | `CylinderGeometry` | MeshBasicMaterial (CanvasTexture) | 5 | Vạch chia 10..100 ml nổi chống z-fighting | | `liquid_surface` | `CylinderGeometry + Ring` | MeshPhysicalMaterial (Water, IOR 1.333) | 2 | Cột nước động kèm vành mặt khum mao dẫn | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `readScale`, `displacementVolume` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **138.5 g** (Trạng thái: `reported`) - Dung tích định mức ($V_{max}$): **100 ml** * **Thông số metrology thiết bị đo**: - Đại lượng đo: `volume` - Giới hạn đo (GHĐ): **10 ml** đến **100 ml** - Độ chia nhỏ nhất (ĐCNN): **1 ml** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad V = \pi \cdot \left(\frac{D_{in}}{2}\right)^2 \cdot h_{liquid}$$ *Ý nghĩa vật lý*: Thể tích hình trụ chất lỏng theo đường kính trong $D_{in} = 28.0\text{ mm}$. $$\mathbf{(2)}\quad \Delta V = V_{sau} - V_{trước} = V_{vật\,rắn}$$ *Ý nghĩa vật lý*: Phương pháp dời chỗ chất lỏng đo thể tích vật rắn không thấm nước. $$\mathbf{(3)}\quad h_{meniscus} = \frac{2\gamma \cos\theta}{\rho g r_{in}}$$ *Ý nghĩa vật lý*: Độ nâng mao dẫn mặt khum lõm của nước tại thành ống thủy tinh ($gamma \approx 0.0728\text{ N/m}$, $\theta \approx 0^\circ$). * **Các tính năng khoa học tích hợp**: - Thủy tinh Borosilicate 3.3 trong suốt, thành dày đều, có mỏ rót chống nhỏ giọt. - Chân đế lục giác chống lăn khi đặt nằm và chống lật trên mặt bàn gỗ thí nghiệm. - Vạch chia ml sắc nét từ 10 ml đến 100 ml (ĐCNN 1 ml), hiệu chuẩn chuẩn In (Ex/TD) ở 20 °C. - Cho phép đọc mặt khum lõm của nước và đo thể tích vật rắn không thấm nước (ΔV = V₂ - V₁). ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `EMPTY` * **Danh sách trạng thái khả dụng**: `EMPTY`, `PARTIALLY_FILLED`, `MENISCUS_STABLE`, `SUBMERGED_OBJECT`, `OVERFLOW` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `EMPTY` | `PARTIALLY_FILLED` | Liquid poured in | `V_liquid > 0` | | `PARTIALLY_FILLED` | `SUBMERGED_OBJECT` | Sample solid dropped | `D_obj <= 28 mm` | | `SUBMERGED_OBJECT` | `OVERFLOW` | Total volume exceeds 100ml | `V_total > 100 ml` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±1.0 ml (ISO 4788 Class B ở 20°C) * **Độ chia nhỏ nhất / Độ phân giải**: 1.0 ml (Vạch chia men trắng) * **Độ lặp lại phép đo**: ±0.5 ml * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Giãn nở thủy tinh Borosilicate 3.3: 3.3 × 10⁻⁶ K⁻¹ (không đáng kể) ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Sai số thị giác (Parallax Error)** | Góc nhìn camera không nằm ngang đáy mặt khum nước | Đọc sai thể tích ±2 đến 3 ml | `Góc lệch trục camera > 5° so với mặt phẳng ngang` | Bấm nút Focus Eye-Level tự động căn camera vuông góc vạch đo | | **Kẹt mẫu vật ngang miệng ống** | Thả mẫu vật có đường kính > 28 mm (như khối đồng 30mm) | Vật không chìm được vào nước, nguy cơ nứt vỡ miệng ống | `Kiểm tra va chạm Box3 Aperture` | Bật cảnh báo APERTURE_OVERSIZE và chuyển mẫu sang Bình tràn Eureka | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **VietChem — Hóa chất & Dụng cụ Thí nghiệm** | `vietchem.com.vn` | Ống đong thủy tinh 100ml Duran/ISO 4788: Đường kính thân Ø 31 mm, chiều cao 250–256 mm, vạch chia nhỏ nhất 1 ml. | | **Lata Việt Nam — Thiết bị Khoa học** | `lata.vn` | Ống đong 100ml đế lục giác: Thủy tinh Borosilicate 3.3 chịu nhiệt, độ dày thành 1.8 mm, mỏ rót tiêu chuẩn DIN. | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Ống đong thủy tinh/nhựa trong suốt 100ml dùng chung cho mạch kiến thức Vật lí (đo thể tích vật rắn) và Hóa học. | | **Visitech — Giải pháp Phòng thí nghiệm** | `visitech.vn` | Ống đong Class B 100 ml: Sai số cho phép ±1.0 ml, vạch in men trắng hoặc xanh bền hóa chất. | | **Nhà sách Giáo dục — Thiết bị Trường học** | `nhasachgiaoduc.vn` | Ống đong thực hành KHTN THCS: Đế rộng vững chắc, đường kính lòng ống 28 mm bỏ lọt các trụ kim loại thực hành. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Đo thể tích chất lỏng và thể tích vật rắn bằng phương pháp dời chỗ.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 32 mm, Cao = 255 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.065 m, Cao (Y) = 0.255 m, Sâu (Z) = 0.065 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `pouring_lip`, `scale_marks`, `liquid_surface`, `liquid_body`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`, `readScale`, `displacementVolume`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `EMPTY`, `PARTIALLY_FILLED`, `MENISCUS_STABLE`, `SUBMERGED_OBJECT`, `OVERFLOW`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body / vessel | Thân ống đong | Kéo, xoay và đặt đứng trên mặt phẳng; không làm biến dạng ống. | Vị trí ống thay đổi; trục thẳng đứng được khuyến nghị khi đọc. |
| liquid_body / liquid_surface | Chất lỏng và mặt khum | Rót từ dụng cụ nguồn hoặc nhấn thao tác rót; kéo vật rắn vào chất lỏng để nhúng. | Mực chất lỏng tăng/giảm; mặt khum lõm; giá trị thể tích thay đổi. |
| scale_marks | Vạch chia | Rê để xem thông tin vạch; đọc tại đáy mặt khum ngang tầm mắt. | Hiển thị số đọc, không cho nhập số thay thế thao tác. |
| pouring_lip | Mỏ rót | Nghiêng ống có kiểm soát để rót sang dụng cụ khác. | Dòng chảy và lượng còn lại cập nhật; không để dòng chảy xuyên thành. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt ống đong thẳng đứng.
2. Rót chất lỏng vào; chờ mặt khum ổn định.
3. Đưa mắt ngang đáy mặt khum và đọc thể tích.
4. Ghi V trước; nhúng vật rắn không thấm nước nếu phù hợp.
5. Đọc V sau và tính thể tích vật bằng độ dời chỗ.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Thể tích tính từ chiều cao chất lỏng và tiết diện trong đã khai báo.
- Vật nhúng làm mực chất lỏng tăng theo thể tích phần chìm.
- Vượt dung tích gây tràn; vật quá lớn miệng ống phải bị từ chối/cảnh báo.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V = \pi \cdot \left(\frac{D_{in}}{2}\right)^2 \cdot h_{liquid}$$
  *Ý nghĩa vật lý*: Thể tích hình trụ chất lỏng theo đường kính trong $D_{in} = 28.0\text{ mm}$.
  $$\mathbf{(2)}\quad \Delta V = V_{sau} - V_{trước} = V_{vật\,rắn}$$
  *Ý nghĩa vật lý*: Phương pháp dời chỗ chất lỏng đo thể tích vật rắn không thấm nước.
  $$\mathbf{(3)}\quad h_{meniscus} = \frac{2\gamma \cos\theta}{\rho g r_{in}}$$
  *Ý nghĩa vật lý*: Độ nâng mao dẫn mặt khum lõm của nước tại thành ống thủy tinh ($gamma \approx 0.0728\text{ N/m}$, $\theta \approx 0^\circ$).
* **Các tính năng khoa học tích hợp**:
  - Thủy tinh Borosilicate 3.3 trong suốt, thành dày đều, có mỏ rót chống nhỏ giọt.
  - Chân đế lục giác chống lăn khi đặt nằm và chống lật trên mặt bàn gỗ thí nghiệm.
  - Vạch chia ml sắc nét từ 10 ml đến 100 ml (ĐCNN 1 ml), hiệu chuẩn chuẩn In (Ex/TD) ở 20 °C.
  - Cho phép đọc mặt khum lõm của nước và đo thể tích vật rắn không thấm nước (ΔV = V₂ - V₁).

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY`
* **Danh sách trạng thái khả dụng**: `EMPTY`, `PARTIALLY_FILLED`, `MENISCUS_STABLE`, `SUBMERGED_OBJECT`, `OVERFLOW`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY` | `PARTIALLY_FILLED` | Liquid poured in | `V_liquid > 0` |
| `PARTIALLY_FILLED` | `SUBMERGED_OBJECT` | Sample solid dropped | `D_obj <= 28 mm` |
| `SUBMERGED_OBJECT` | `OVERFLOW` | Total volume exceeds 100ml | `V_total > 100 ml` |

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
| **Sai số thị giác (Parallax Error)** | Góc nhìn camera không nằm ngang đáy mặt khum nước | Đọc sai thể tích ±2 đến 3 ml | `Góc lệch trục camera > 5° so với mặt phẳng ngang` | Bấm nút Focus Eye-Level tự động căn camera vuông góc vạch đo |
| **Kẹt mẫu vật ngang miệng ống** | Thả mẫu vật có đường kính > 28 mm (như khối đồng 30mm) | Vật không chìm được vào nước, nguy cơ nứt vỡ miệng ống | `Kiểm tra va chạm Box3 Aperture` | Bật cảnh báo APERTURE_OVERSIZE và chuyển mẫu sang Bình tràn Eureka |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-CYL-0001-T01:** Rót 50 ml: mực chất lỏng và vạch đọc phải tương ứng.
- [ ] **OL3D-EQP-CYL-0001-T02:** Đọc mặt khum ở góc mắt sai: cảnh báo sai số thị sai hoặc hiển thị hướng dẫn.
- [ ] **OL3D-EQP-CYL-0001-T03:** Nhúng vật có thể tích đã biết: ΔV khớp V vật chìm.
- [ ] **OL3D-EQP-CYL-0001-T04:** Vượt dung tích 100 ml: chuyển OVERFLOW.
- [ ] **OL3D-EQP-CYL-0001-T05:** Thả vật quá đường kính miệng: chặn thao tác và báo APERTURE_OVERSIZE.

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

## 4.2. [OL3D-EQP-CYL-0001] Ống đong thủy tinh 100 ml
**Tên tiếng Anh**: *100 ml Graduated Cylinder* | **Mã Archetype**: `graduated-cylinder` | **Phân loại danh mục**: `volume-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-CYL-0001`
* **Mã đường dẫn (Slug)**: `ong-dong-thuy-tinh-100ml`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-CYL-0001_ong-dong-thuy-tinh-100ml` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: ISO 4788 · DIN 12680 · Thông tư 38/2021/TT-BGDĐT

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 32 mm, Cao = 255 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.065 m, Cao (Y) = 0.255 m, Sâu (Z) = 0.065 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `pouring_lip`, `scale_marks`, `liquid_surface`, `liquid_body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Hollow)` | MeshPhysicalMaterial (Borosilicate, transmission 0.88) | 4 | Thân trụ thành dày 1.8mm kèm mỏ rót |
| `scale_marks` | `CylinderGeometry` | MeshBasicMaterial (CanvasTexture) | 5 | Vạch chia 10..100 ml nổi chống z-fighting |
| `liquid_surface` | `CylinderGeometry + Ring` | MeshPhysicalMaterial (Water, IOR 1.333) | 2 | Cột nước động kèm vành mặt khum mao dẫn |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `readScale`, `displacementVolume`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **138.5 g** (Trạng thái: `reported`)
  - Dung tích định mức ($V_{max}$): **100 ml**
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `volume`
  - Giới hạn đo (GHĐ): **10 ml** đến **100 ml**
  - Độ chia nhỏ nhất (ĐCNN): **1 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V = \pi \cdot \left(\frac{D_{in}}{2}\right)^2 \cdot h_{liquid}$$
  *Ý nghĩa vật lý*: Thể tích hình trụ chất lỏng theo đường kính trong $D_{in} = 28.0\text{ mm}$.
  $$\mathbf{(2)}\quad \Delta V = V_{sau} - V_{trước} = V_{vật\,rắn}$$
  *Ý nghĩa vật lý*: Phương pháp dời chỗ chất lỏng đo thể tích vật rắn không thấm nước.
  $$\mathbf{(3)}\quad h_{meniscus} = \frac{2\gamma \cos\theta}{\rho g r_{in}}$$
  *Ý nghĩa vật lý*: Độ nâng mao dẫn mặt khum lõm của nước tại thành ống thủy tinh ($gamma \approx 0.0728\text{ N/m}$, $\theta \approx 0^\circ$).
* **Các tính năng khoa học tích hợp**:
  - Thủy tinh Borosilicate 3.3 trong suốt, thành dày đều, có mỏ rót chống nhỏ giọt.
  - Chân đế lục giác chống lăn khi đặt nằm và chống lật trên mặt bàn gỗ thí nghiệm.
  - Vạch chia ml sắc nét từ 10 ml đến 100 ml (ĐCNN 1 ml), hiệu chuẩn chuẩn In (Ex/TD) ở 20 °C.
  - Cho phép đọc mặt khum lõm của nước và đo thể tích vật rắn không thấm nước (ΔV = V₂ - V₁).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY`
* **Danh sách trạng thái khả dụng**: `EMPTY`, `PARTIALLY_FILLED`, `MENISCUS_STABLE`, `SUBMERGED_OBJECT`, `OVERFLOW`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY` | `PARTIALLY_FILLED` | Liquid poured in | `V_liquid > 0` |
| `PARTIALLY_FILLED` | `SUBMERGED_OBJECT` | Sample solid dropped | `D_obj <= 28 mm` |
| `SUBMERGED_OBJECT` | `OVERFLOW` | Total volume exceeds 100ml | `V_total > 100 ml` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±1.0 ml (ISO 4788 Class B ở 20°C)
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0 ml (Vạch chia men trắng)
* **Độ lặp lại phép đo**: ±0.5 ml
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Giãn nở thủy tinh Borosilicate 3.3: 3.3 × 10⁻⁶ K⁻¹ (không đáng kể)

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Sai số thị giác (Parallax Error)** | Góc nhìn camera không nằm ngang đáy mặt khum nước | Đọc sai thể tích ±2 đến 3 ml | `Góc lệch trục camera > 5° so với mặt phẳng ngang` | Bấm nút Focus Eye-Level tự động căn camera vuông góc vạch đo |
| **Kẹt mẫu vật ngang miệng ống** | Thả mẫu vật có đường kính > 28 mm (như khối đồng 30mm) | Vật không chìm được vào nước, nguy cơ nứt vỡ miệng ống | `Kiểm tra va chạm Box3 Aperture` | Bật cảnh báo APERTURE_OVERSIZE và chuyển mẫu sang Bình tràn Eureka |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietChem — Hóa chất & Dụng cụ Thí nghiệm** | `vietchem.com.vn` | Ống đong thủy tinh 100ml Duran/ISO 4788: Đường kính thân Ø 31 mm, chiều cao 250–256 mm, vạch chia nhỏ nhất 1 ml. |
| **Lata Việt Nam — Thiết bị Khoa học** | `lata.vn` | Ống đong 100ml đế lục giác: Thủy tinh Borosilicate 3.3 chịu nhiệt, độ dày thành 1.8 mm, mỏ rót tiêu chuẩn DIN. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Ống đong thủy tinh/nhựa trong suốt 100ml dùng chung cho mạch kiến thức Vật lí (đo thể tích vật rắn) và Hóa học. |
| **Visitech — Giải pháp Phòng thí nghiệm** | `visitech.vn` | Ống đong Class B 100 ml: Sai số cho phép ±1.0 ml, vạch in men trắng hoặc xanh bền hóa chất. |
| **Nhà sách Giáo dục — Thiết bị Trường học** | `nhasachgiaoduc.vn` | Ống đong thực hành KHTN THCS: Đế rộng vững chắc, đường kính lòng ống 28 mm bỏ lọt các trụ kim loại thực hành. |

---
