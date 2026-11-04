# 32. Kính hiển vi quang học (10x, 40x, 100x) & Tiêu bản NST (SGK KHTN 9)

**Device ID:** `OL3D-EQP-MIC-0001`  
**Nhóm chức năng đề xuất:** `G09`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `optical-microscope`  
**Slug:** `optical-microscope-chromosome-slide`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-MIC-0001_optical-microscope-chromosome-slide` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: ISO 8039 · Thông tư 38/2021/TT-BGDĐT · Hình 1.11 trang 8 & Bài 42 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương XII: Di truyền Nhiễm sắc thể · Bài 1 (trang 8: Hình 1.11) & Bài 42: Nhiễm sắc thể và bộ nhiễm sắc thể (trang 184–185: Hình 42.6) * **Hình ảnh đối chiếu SGK**: Hình 1.11 (Hộp tiêu bản cố định NST), Hình 42.6 (Các bước quan sát tiêu bản NST dưới kính hiển vi) (**) * **Chức năng chuẩn**: Quan sát hình dạng (hình que, chữ V, chữ X, hạt) và đếm số lượng nhiễm sắc thể ở kì giữa phân bào trên tiêu bản cố định tế bào. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 245 mm, Sâu = 145 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.245 m, Sâu (Z) = 0.145 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `stageGroup`, `plunger` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `ExtrudeGeometry Complex Arm` | MeshPhysicalMaterial (Enamelled Cast Iron, white porcelain) | 1 | Thân khung cong chữ C vững chắc kèm mâm xoay vật kính | | `stageGroup` | `BoxGeometry + Clips` | MeshStandardMaterial (Black Anodized Table) | 2 | Bàn sa trượt nâng hạ kèm kẹp giữ lam kính | | `plunger` | `Cylinder Knobs` | MeshStandardMaterial (Metallic Knobs) | 2 | Ốc sơ cấp (lớn) và ốc vi cấp (nhỏ) lấy nét | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **1450 g** (Trạng thái: `verified`) * **Thông số metrology thiết bị đo**: - Đại lượng đo: `magnification` - Giới hạn đo (GHĐ): **100 x (Độ phóng đại)** đến **1000 x (Độ phóng đại)** - Độ chia nhỏ nhất (ĐCNN): **undefined undefined** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad M_{tổng} = M_{vật\,kính} \times M_{thị\,kính} = (4\times, 10\times, 40\times, 100\times) \times 10\times = 40\times, 100\times, 400\times, 1000\times$$ *Ý nghĩa vật lý*: Độ phóng đại quang học toàn phần của kính hiển vi quang học hai mắt. $$\mathbf{(2)}\quad d_{phân\,giải} = \frac{\lambda}{2 \cdot NA} = \frac{0.55\,\mu\text{m}}{2 \times 1.25} \approx 0.22\,\mu\text{m} = 220\text{ nm}$$ *Ý nghĩa vật lý*: Giới hạn phân giải nhiễu xạ quang học theo định luật Abbe (với vật kính dầu soi NA = 1.25). $$\mathbf{(3)}\quad FOV_{\mu\text{m}} = \frac{FN}{M_{vật\,kính}} = \frac{18\text{ mm}}{M_{vật\,kính}} \implies FOV_{10x} = 1.8\text{ mm} = 1800\,\mu\text{m}$$ *Ý nghĩa vật lý*: Đường kính trường nhìn hiển vi tương ứng trên lam kính tiêu bản. * **Các tính năng khoa học tích hợp**: - Kính hiển vi quang học 1 ống ngắm nghiêng 45°, mâm xoay 3 vật kính tiêu sắc (10x vành vàng, 40x vành xanh lam, 100x vành trắng). - Bàn sa trượt cơ khí có kẹp giữ tiêu bản cố định Nhiễm sắc thể (NST), ốc điều chỉnh thô (đại cấp) và ốc vi cấp đồng trục, đèn LED chiếu sáng dưới bàn kính. - Đi kèm hộp tiêu bản cố định Nhiễm sắc thể (Bài 42 SGK KHTN 9) giúp học sinh xoay mâm vật kính 10x → 40x → 100x để quan sát hình thái NST ở kì giữa. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `STAGE_LOWERED` * **Danh sách trạng thái khả dụng**: `STAGE_LOWERED`, `SLIDE_CLAMPED`, `COARSE_FOCUSING`, `FINE_FOCUS_LOCKED`, `OIL_IMMERSION_MODE` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `STAGE_LOWERED` | `SLIDE_CLAMPED` | Slide inserted on stage clip | `hasSlide == true` | | `SLIDE_CLAMPED` | `COARSE_FOCUSING` | Coarse knob rotated | `stageY changes` | | `COARSE_FOCUSING` | `FINE_FOCUS_LOCKED` | Fine knob adjusted | `|focusOffset| < 0.002 mm` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: Ốc vi cấp ĐCNN 0.002 mm (2 µm) hành trình * **Độ chia nhỏ nhất / Độ phân giải**: Thanh đo thị kính 20 µm / 50 µm / 200 µm * **Độ lặp lại phép đo**: Hệ trục quang học đồng trục tuyệt đối 100% * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Đèn LED chiếu sáng tiêu bản dịu mắt 6500K không nóng mẫu ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Bể lam kính tiêu bản / Trầy xước thấu kính** | Dùng ốc sơ cấp vặn bàn kính lên quá nhanh khi đang dùng vật kính 40x / 100x | Đầu vật kính đâm thẳng vào lam kính làm vỡ lamen | `Khoảng cách thấu kính tới lam kính < 0.1 mm` | Bắt buộc chỉ dùng ốc vi cấp khi ở vật kính 40x và 100x; tích hợp cữ hãm chống va chạm cơ học | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Kính hiển vi quang học dùng cho môn KHTN cấp THCS: Thị kính 10x, vật kính 10x, 40x (và 100x), có đèn chiếu sáng và ốc vi cấp. | | **Tín Đức — Kính hiển vi Quang học Giáo dục** | `tinduc.vn` | Thông số quang học chuẩn: Chiều dài ống cơ học 160 mm, tiêu bản lam kính chuẩn quốc tế 25.4 × 76.2 mm, lamen dày 0.17 mm. | | **Studocu Vietnam — Thực hành Quan sát Tiêu bản NST (Bài 42 KHTN 9)** | `studocu.vn` | Quy trình 2 bước soi tiêu bản NST: Chọn vật kính 10x tìm vùng có tế bào phân chia trước, sau đó xoay sang vật kính 40x để quan sát rõ hình dạng NST. | | **Luật Việt Nam — Tiêu chuẩn Thiết bị Sinh học THCS** | `luatvietnam.vn` | Bộ tiêu bản cố định Nhiễm sắc thể (NST người và tế bào rễ hành) đi kèm kính hiển vi trong Chương XII Di truyền NST. | | **MBWS — Thiết bị Khoa học Trường học** | `mbws.vn` | Cấu tạo chi tiết kính hiển vi học sinh: Thân chữ C đúc hợp kim, bàn kính 110×120 mm, tụ quang NA 0.65. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Quan sát tiêu bản qua kính hiển vi với các vật kính, điều chỉnh nét, ánh sáng và vị trí mẫu.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 245 mm, Sâu = 145 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.245 m, Sâu (Z) = 0.145 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `stageGroup`, `plunger`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `opticalFocus`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `STAGE_LOWERED`, `SLIDE_CLAMPED`, `COARSE_FOCUSING`, `FINE_FOCUS_LOCKED`, `OIL_IMMERSION_MODE`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| nosepiece / objective turret | Mâm xoay vật kính | Xoay đến nấc 4×, 10×, 40× hoặc 100× khi kính có trang bị; khóa đúng khấc. | Tổng phóng đại = vật kính × thị kính; trường nhìn thay đổi tương ứng. |
| stageGroup / slide clips | Bàn kính và kẹp lam | Đặt lam, kẹp cố định, di chuyển X/Y nếu có bàn sa trượt. | Mẫu dịch chuyển trong thị kính ngược chiều thao tác bàn kính. |
| plunger / coarse knob | Ốc chỉnh thô | Xoay hai chiều với hành trình lớn; ưu tiên vật kính thấp. | Mặt phẳng lấy nét thay đổi; ảnh mờ/rõ theo độ lệch focus. |
| fine focus knob | Ốc chỉnh tinh | Xoay bước nhỏ; ưu tiên khi dùng vật kính lớn. | Lấy nét chính xác; tránh va chạm vật kính–lam. |
| illumination / condenser / iris | Đèn, tụ quang, màn chắn sáng | Bật/tắt, điều chỉnh độ sáng và khẩu độ. | Độ sáng, tương phản và chất lượng hình ảnh thay đổi. |
| eyepiece view | Cửa sổ thị kính | Quan sát hình tròn, bật/tắt thước và chú thích, chụp ảnh. | Ảnh phụ thuộc đúng mẫu, vật kính, vị trí, tiêu cự và ánh sáng. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Chọn tiêu bản và đặt lam đúng chiều, kẹp cố định.
2. Bật đèn và chỉnh ánh sáng vừa đủ.
3. Bắt đầu bằng vật kính nhỏ để tìm vùng mẫu.
4. Dùng ốc chỉnh thô để tìm nét; chuyển sang ốc tinh để làm rõ.
5. Chuyển vật kính lớn khi vùng quan sát đã được định vị; chỉ chỉnh tinh nếu cấu hình quang học yêu cầu.
6. Đọc cấu trúc, đo bằng thước đã hiệu chuẩn và ghi kết quả.
7. Vật kính dầu 100× chỉ dùng khi có dầu soi và quy trình tương thích.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Khi tăng vật kính: tổng phóng đại tăng, FOV giảm, độ sâu trường ảnh giảm.
- Lệch mặt phẳng lấy nét làm ảnh nhòe; chỉnh focus về mặt phẳng mẫu làm ảnh rõ.
- Đèn tắt làm trường nhìn tối; khẩu độ ảnh hưởng độ sáng/độ tương phản.
- Vật kính lớn có khoảng cách làm việc nhỏ; liên động chống va chạm lam là bắt buộc.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad M_{tổng} = M_{vật\,kính} \times M_{thị\,kính} = (4\times, 10\times, 40\times, 100\times) \times 10\times = 40\times, 100\times, 400\times, 1000\times$$
  *Ý nghĩa vật lý*: Độ phóng đại quang học toàn phần của kính hiển vi quang học hai mắt.
  $$\mathbf{(2)}\quad d_{phân\,giải} = \frac{\lambda}{2 \cdot NA} = \frac{0.55\,\mu\text{m}}{2 \times 1.25} \approx 0.22\,\mu\text{m} = 220\text{ nm}$$
  *Ý nghĩa vật lý*: Giới hạn phân giải nhiễu xạ quang học theo định luật Abbe (với vật kính dầu soi NA = 1.25).
  $$\mathbf{(3)}\quad FOV_{\mu\text{m}} = \frac{FN}{M_{vật\,kính}} = \frac{18\text{ mm}}{M_{vật\,kính}} \implies FOV_{10x} = 1.8\text{ mm} = 1800\,\mu\text{m}$$
  *Ý nghĩa vật lý*: Đường kính trường nhìn hiển vi tương ứng trên lam kính tiêu bản.
* **Các tính năng khoa học tích hợp**:
  - Kính hiển vi quang học 1 ống ngắm nghiêng 45°, mâm xoay 3 vật kính tiêu sắc (10x vành vàng, 40x vành xanh lam, 100x vành trắng).
  - Bàn sa trượt cơ khí có kẹp giữ tiêu bản cố định Nhiễm sắc thể (NST), ốc điều chỉnh thô (đại cấp) và ốc vi cấp đồng trục, đèn LED chiếu sáng dưới bàn kính.
  - Đi kèm hộp tiêu bản cố định Nhiễm sắc thể (Bài 42 SGK KHTN 9) giúp học sinh xoay mâm vật kính 10x → 40x → 100x để quan sát hình thái NST ở kì giữa.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `STAGE_LOWERED`
* **Danh sách trạng thái khả dụng**: `STAGE_LOWERED`, `SLIDE_CLAMPED`, `COARSE_FOCUSING`, `FINE_FOCUS_LOCKED`, `OIL_IMMERSION_MODE`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `STAGE_LOWERED` | `SLIDE_CLAMPED` | Slide inserted on stage clip | `hasSlide == true` |
| `SLIDE_CLAMPED` | `COARSE_FOCUSING` | Coarse knob rotated | `stageY changes` |
| `COARSE_FOCUSING` | `FINE_FOCUS_LOCKED` | Fine knob adjusted | `|focusOffset| < 0.002 mm` |

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
| **Bể lam kính tiêu bản / Trầy xước thấu kính** | Dùng ốc sơ cấp vặn bàn kính lên quá nhanh khi đang dùng vật kính 40x / 100x | Đầu vật kính đâm thẳng vào lam kính làm vỡ lamen | `Khoảng cách thấu kính tới lam kính < 0.1 mm` | Bắt buộc chỉ dùng ốc vi cấp khi ở vật kính 40x và 100x; tích hợp cữ hãm chống va chạm cơ học |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-MIC-0001-T01:** Chọn 4×/10×/40×: tổng phóng đại và FOV cập nhật đúng.
- [ ] **OL3D-EQP-MIC-0001-T02:** Di chuyển bàn X/Y: mẫu trong thị kính dịch ngược chiều.
- [ ] **OL3D-EQP-MIC-0001-T03:** Vặn ốc thô: thay đổi focus lớn; ốc tinh: thay đổi focus nhỏ.
- [ ] **OL3D-EQP-MIC-0001-T04:** Lệch focus: ảnh mờ liên tục; lấy nét lại: ảnh rõ.
- [ ] **OL3D-EQP-MIC-0001-T05:** Tắt đèn: ảnh tối; bật đèn: ảnh sáng theo cường độ.
- [ ] **OL3D-EQP-MIC-0001-T06:** 100× dầu: yêu cầu dầu soi và cảnh báo khoảng cách làm việc; không giả định 100× khô.

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

## 4.32. [OL3D-EQP-MIC-0001] Kính hiển vi quang học (10x, 40x, 100x) & Tiêu bản NST (SGK KHTN 9)
**Tên tiếng Anh**: *Compound Optical Microscope & Fixed Chromosome Slide* | **Mã Archetype**: `optical-microscope` | **Phân loại danh mục**: `biology-microscopy`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-MIC-0001`
* **Mã đường dẫn (Slug)**: `optical-microscope-chromosome-slide`
* **Môn học áp dụng**: `biology`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-MIC-0001_optical-microscope-chromosome-slide` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: ISO 8039 · Thông tư 38/2021/TT-BGDĐT · Hình 1.11 trang 8 & Bài 42 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương XII: Di truyền Nhiễm sắc thể · Bài 1 (trang 8: Hình 1.11) & Bài 42: Nhiễm sắc thể và bộ nhiễm sắc thể (trang 184–185: Hình 42.6)
* **Hình ảnh đối chiếu SGK**: Hình 1.11 (Hộp tiêu bản cố định NST), Hình 42.6 (Các bước quan sát tiêu bản NST dưới kính hiển vi) (**)
* **Chức năng chuẩn**: Quan sát hình dạng (hình que, chữ V, chữ X, hạt) và đếm số lượng nhiễm sắc thể ở kì giữa phân bào trên tiêu bản cố định tế bào.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 245 mm, Sâu = 145 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.245 m, Sâu (Z) = 0.145 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `stageGroup`, `plunger`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `ExtrudeGeometry Complex Arm` | MeshPhysicalMaterial (Enamelled Cast Iron, white porcelain) | 1 | Thân khung cong chữ C vững chắc kèm mâm xoay vật kính |
| `stageGroup` | `BoxGeometry + Clips` | MeshStandardMaterial (Black Anodized Table) | 2 | Bàn sa trượt nâng hạ kèm kẹp giữ lam kính |
| `plunger` | `Cylinder Knobs` | MeshStandardMaterial (Metallic Knobs) | 2 | Ốc sơ cấp (lớn) và ốc vi cấp (nhỏ) lấy nét |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **1450 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `magnification`
  - Giới hạn đo (GHĐ): **100 x (Độ phóng đại)** đến **1000 x (Độ phóng đại)**
  - Độ chia nhỏ nhất (ĐCNN): **undefined undefined**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad M_{tổng} = M_{vật\,kính} \times M_{thị\,kính} = (4\times, 10\times, 40\times, 100\times) \times 10\times = 40\times, 100\times, 400\times, 1000\times$$
  *Ý nghĩa vật lý*: Độ phóng đại quang học toàn phần của kính hiển vi quang học hai mắt.
  $$\mathbf{(2)}\quad d_{phân\,giải} = \frac{\lambda}{2 \cdot NA} = \frac{0.55\,\mu\text{m}}{2 \times 1.25} \approx 0.22\,\mu\text{m} = 220\text{ nm}$$
  *Ý nghĩa vật lý*: Giới hạn phân giải nhiễu xạ quang học theo định luật Abbe (với vật kính dầu soi NA = 1.25).
  $$\mathbf{(3)}\quad FOV_{\mu\text{m}} = \frac{FN}{M_{vật\,kính}} = \frac{18\text{ mm}}{M_{vật\,kính}} \implies FOV_{10x} = 1.8\text{ mm} = 1800\,\mu\text{m}$$
  *Ý nghĩa vật lý*: Đường kính trường nhìn hiển vi tương ứng trên lam kính tiêu bản.
* **Các tính năng khoa học tích hợp**:
  - Kính hiển vi quang học 1 ống ngắm nghiêng 45°, mâm xoay 3 vật kính tiêu sắc (10x vành vàng, 40x vành xanh lam, 100x vành trắng).
  - Bàn sa trượt cơ khí có kẹp giữ tiêu bản cố định Nhiễm sắc thể (NST), ốc điều chỉnh thô (đại cấp) và ốc vi cấp đồng trục, đèn LED chiếu sáng dưới bàn kính.
  - Đi kèm hộp tiêu bản cố định Nhiễm sắc thể (Bài 42 SGK KHTN 9) giúp học sinh xoay mâm vật kính 10x → 40x → 100x để quan sát hình thái NST ở kì giữa.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `STAGE_LOWERED`
* **Danh sách trạng thái khả dụng**: `STAGE_LOWERED`, `SLIDE_CLAMPED`, `COARSE_FOCUSING`, `FINE_FOCUS_LOCKED`, `OIL_IMMERSION_MODE`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `STAGE_LOWERED` | `SLIDE_CLAMPED` | Slide inserted on stage clip | `hasSlide == true` |
| `SLIDE_CLAMPED` | `COARSE_FOCUSING` | Coarse knob rotated | `stageY changes` |
| `COARSE_FOCUSING` | `FINE_FOCUS_LOCKED` | Fine knob adjusted | `|focusOffset| < 0.002 mm` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Ốc vi cấp ĐCNN 0.002 mm (2 µm) hành trình
* **Độ chia nhỏ nhất / Độ phân giải**: Thanh đo thị kính 20 µm / 50 µm / 200 µm
* **Độ lặp lại phép đo**: Hệ trục quang học đồng trục tuyệt đối 100%
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Đèn LED chiếu sáng tiêu bản dịu mắt 6500K không nóng mẫu

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Bể lam kính tiêu bản / Trầy xước thấu kính** | Dùng ốc sơ cấp vặn bàn kính lên quá nhanh khi đang dùng vật kính 40x / 100x | Đầu vật kính đâm thẳng vào lam kính làm vỡ lamen | `Khoảng cách thấu kính tới lam kính < 0.1 mm` | Bắt buộc chỉ dùng ốc vi cấp khi ở vật kính 40x và 100x; tích hợp cữ hãm chống va chạm cơ học |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Kính hiển vi quang học dùng cho môn KHTN cấp THCS: Thị kính 10x, vật kính 10x, 40x (và 100x), có đèn chiếu sáng và ốc vi cấp. |
| **Tín Đức — Kính hiển vi Quang học Giáo dục** | `tinduc.vn` | Thông số quang học chuẩn: Chiều dài ống cơ học 160 mm, tiêu bản lam kính chuẩn quốc tế 25.4 × 76.2 mm, lamen dày 0.17 mm. |
| **Studocu Vietnam — Thực hành Quan sát Tiêu bản NST (Bài 42 KHTN 9)** | `studocu.vn` | Quy trình 2 bước soi tiêu bản NST: Chọn vật kính 10x tìm vùng có tế bào phân chia trước, sau đó xoay sang vật kính 40x để quan sát rõ hình dạng NST. |
| **Luật Việt Nam — Tiêu chuẩn Thiết bị Sinh học THCS** | `luatvietnam.vn` | Bộ tiêu bản cố định Nhiễm sắc thể (NST người và tế bào rễ hành) đi kèm kính hiển vi trong Chương XII Di truyền NST. |
| **MBWS — Thiết bị Khoa học Trường học** | `mbws.vn` | Cấu tạo chi tiết kính hiển vi học sinh: Thân chữ C đúc hợp kim, bàn kính 110×120 mm, tụ quang NA 0.65. |

---
