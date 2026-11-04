# 33. Mô hình cấu trúc phân tử DNA xoắn kép (SGK KHTN 9)

**Device ID:** `OL3D-EQP-DNA-0001`  
**Nhóm chức năng đề xuất:** `G09`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `dna-double-helix`  
**Slug:** `dna-double-helix-model`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 38.1 Bài 38 SGK KHTN 9 (Nucleic acid & Gen) * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương XI: Di truyền học Mendel. Cơ sở phân tử của hiện tượng di truyền · Bài 38: Nucleic acid và gene (trang 166–167) * **Hình ảnh đối chiếu SGK**: Hình 38.1 (Mô hình cấu trúc một đoạn phân tử DNA) (**) * **Chức năng chuẩn**: Trực quan hoá cấu trúc xoắn kép của phân tử DNA và nguyên tắc bổ sung giữa các nucleotide (A liên kết với T bằng 2 liên kết hydrogen; G liên kết với C bằng 3 liên kết hydrogen). ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 105 mm, Cao = 250 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.105 m, Cao (Y) = 0.25 m, Sâu (Z) = 0.105 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `handle` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial` * **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `TubeGeometry (Double Helix Ribbon)` | MeshPhysicalMaterial (Colored Plastics: Blue-A, Red-T, Green-G, Yellow-X) | 1 | Hai dải ruy băng photphat-đường xoắn ốc đối song song | | `handle` | `Cylinder Base & Stand` | MeshStandardMaterial (Steel Stand) | 1 | Trụ đỡ và đế tròn xoay 360 độ | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **260 g** (Trạng thái: `verified`) ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad L_{chu\,kỳ} = 3.4\text{ nm} = 34\text{ Å}, \quad d = 2.0\text{ nm} = 20\text{ Å}$$ *Ý nghĩa vật lý*: Kích thước một chu kỳ xoắn của phân tử DNA B-form theo mô hình Watson–Crick. $$\mathbf{(2)}\quad N_{cặp\,nu} = 10.5\text{ cặp/chu kỳ}, \quad \Delta L_{giữa\,2\,nu} = 0.34\text{ nm}$$ *Ý nghĩa vật lý*: Khoảng cách giữa hai cặp nucleotide kế tiếp dọc theo trục xoắn kép. $$\mathbf{(3)}\quad \text{A} = \text{T} \; (2\text{ liên kết hydro}), \quad \text{G} \equiv \text{X} \; (3\text{ liên kết hydro})$$ *Ý nghĩa vật lý*: Nguyên tắc bổ sung giữa các bazơ nitơ trên hai mạch đối song song ($5' \to 3'$ và $3' \to 5'$). * **Các tính năng khoa học tích hợp**: - Mô hình không gian 3 chiều của phân tử DNA theo mẫu Watson – Crick với hai dải băng xoắn kép song song ngược chiều (3'→5' và 5'→3'). - Các bậc thang ngang thể hiện các cặp nitrogenous base liên kết theo đúng Nguyên tắc bổ sung (NTBS): Adenine (A - Đỏ) liên kết với Thymine (T - Vàng) bằng 2 liên kết hydrogen; Guanine (G - Xanh lá) liên kết với Cytosine (C - Xanh lam) bằng 3 liên kết hydrogen. - Giúp học sinh quan sát trực quan cấu trúc không gian, chu kì xoắn (10 cặp nucleotide = 34 Å) trong Bài 38 SGK KHTN 9. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `INTACT_HELIX` * **Danh sách trạng thái khả dụng**: `INTACT_HELIX`, `ROTATING_360`, `BASE_PAIRS_HIGHLIGHTED`, `UNZIPPING_DEMO` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `INTACT_HELIX` | `ROTATING_360` | Auto rotation enabled | `true` | | `INTACT_HELIX` | `BASE_PAIRS_HIGHLIGHTED` | Base pair clicked | `true` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: Đúng 100% nguyên tắc bổ sung A-T và G-X * **Độ chia nhỏ nhất / Độ phân giải**: Tỷ lệ mô hình phóng đại 1 : 10,000,000 * **Độ lặp lại phép đo**: Khớp mộng cơ học chính xác từng liên kết hydro * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Nhựa ABS bền bỉ ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Lắp sai nguyên tắc bổ sung** | Cố tình gắn bazơ A với G hoặc T với X | Mô hình bị méo dạng không lắp ghép được | `Khóa cơ học mộng âm dương` | Chỉ cho phép liên kết mộng A-T (2 chốt) và G-X (3 chốt) | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **STB Việt Nam — Mô hình Cấu trúc Phân tử ADN** | `stb.com.vn` | Mô hình cấu trúc không gian phân tử ADN: Đường kính vòng xoắn mô phỏng 20 Å, chiều cao mỗi chu kì xoắn 34 Å gồm 10 cặp nucleotide. | | **Innotec Việt Nam — Thiết bị Sinh học THCS** | `innotec.com.vn` | Mô hình phân tử DNA lắp ghép trên trụ inox và đế nhựa ABS, phân biệt 4 màu sắc chuẩn cho các base A, T, G, C. | | **Thiết bị Y tế & Giáo dục Huê Lợi** | `tbytehueloi.com` | Mô hình chuỗi xoắn kép ADN phục vụ giảng dạy phần Di truyền và Biến dị môn Khoa học tự nhiên lớp 9. | | **Thiết bị Giáo dục Thái Sơn** | `thietbigiaoducthaison.com` | Minh họa trực quan nguyên tắc bổ sung (A–T, G–C) và cấu trúc đa phân của đại phân tử sinh học DNA. | | **VietJack — SGK KHTN 9 Bài 38 (Nucleic acid và ứng dụng)** | `vietjack.com` | Hình 38.1 SGK KHTN 9: Mô hình cấu trúc một đoạn phân tử DNA xoắn kép và khác biệt giữa DNA với RNA. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Khám phá mô hình cấu trúc DNA xoắn kép, nguyên tắc bổ sung và chiều hai mạch.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 105 mm, Cao = 250 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.105 m, Cao (Y) = 0.25 m, Sâu (Z) = 0.105 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `handle`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `INTACT_HELIX`, `ROTATING_360`, `BASE_PAIRS_HIGHLIGHTED`, `UNZIPPING_DEMO`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body / handle | Khung mô hình và tay cầm | Nhấc, xoay 360° quanh trục phù hợp; phóng to/thu nhỏ camera. | Quan sát được hai mạch, các cặp base và hình dạng xoắn. |
| base-pair nodes (if present) | Cặp nucleotide | Chọn một cặp để highlight; tháo/lắp chỉ khi mô hình có node cấu phần. | A–T và G–X/C–G theo quy ước dữ liệu gốc được làm nổi bật với số liên kết hydro tương ứng. |
| strand direction labels | Nhãn chiều mạch | Bật/tắt nhãn 5’→3’ và 3’→5’. | Hiển thị hai mạch đối song song. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Xoay mô hình để quan sát cấu trúc xoắn kép.
2. Chọn một cặp base để xem nguyên tắc bổ sung.
3. Bật nhãn chiều mạch.
4. So sánh khoảng cách giữa các cặp base và chu kỳ xoắn theo mô hình.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Mô hình giữ quan hệ hình học B-DNA theo thông số nguồn.
- A–T có 2 liên kết hydro; G–C có 3 liên kết hydro.
- Nếu mô hình không có node tháo rời, không hiển thị thao tác tháo/lắp giả.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad L_{chu\,kỳ} = 3.4\text{ nm} = 34\text{ Å}, \quad d = 2.0\text{ nm} = 20\text{ Å}$$
  *Ý nghĩa vật lý*: Kích thước một chu kỳ xoắn của phân tử DNA B-form theo mô hình Watson–Crick.
  $$\mathbf{(2)}\quad N_{cặp\,nu} = 10.5\text{ cặp/chu kỳ}, \quad \Delta L_{giữa\,2\,nu} = 0.34\text{ nm}$$
  *Ý nghĩa vật lý*: Khoảng cách giữa hai cặp nucleotide kế tiếp dọc theo trục xoắn kép.
  $$\mathbf{(3)}\quad \text{A} = \text{T} \; (2\text{ liên kết hydro}), \quad \text{G} \equiv \text{X} \; (3\text{ liên kết hydro})$$
  *Ý nghĩa vật lý*: Nguyên tắc bổ sung giữa các bazơ nitơ trên hai mạch đối song song ($5' \to 3'$ và $3' \to 5'$).
* **Các tính năng khoa học tích hợp**:
  - Mô hình không gian 3 chiều của phân tử DNA theo mẫu Watson – Crick với hai dải băng xoắn kép song song ngược chiều (3'→5' và 5'→3').
  - Các bậc thang ngang thể hiện các cặp nitrogenous base liên kết theo đúng Nguyên tắc bổ sung (NTBS): Adenine (A - Đỏ) liên kết với Thymine (T - Vàng) bằng 2 liên kết hydrogen; Guanine (G - Xanh lá) liên kết với Cytosine (C - Xanh lam) bằng 3 liên kết hydrogen.
  - Giúp học sinh quan sát trực quan cấu trúc không gian, chu kì xoắn (10 cặp nucleotide = 34 Å) trong Bài 38 SGK KHTN 9.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `INTACT_HELIX`
* **Danh sách trạng thái khả dụng**: `INTACT_HELIX`, `ROTATING_360`, `BASE_PAIRS_HIGHLIGHTED`, `UNZIPPING_DEMO`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `INTACT_HELIX` | `ROTATING_360` | Auto rotation enabled | `true` |
| `INTACT_HELIX` | `BASE_PAIRS_HIGHLIGHTED` | Base pair clicked | `true` |

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
| **Lắp sai nguyên tắc bổ sung** | Cố tình gắn bazơ A với G hoặc T với X | Mô hình bị méo dạng không lắp ghép được | `Khóa cơ học mộng âm dương` | Chỉ cho phép liên kết mộng A-T (2 chốt) và G-X (3 chốt) |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-DNA-0001-T01:** Xoay mô hình: không thay đổi cấu trúc liên kết.
- [ ] **OL3D-EQP-DNA-0001-T02:** Chọn A–T: highlight đúng cặp và 2 liên kết.
- [ ] **OL3D-EQP-DNA-0001-T03:** Chọn G–C: highlight đúng cặp và 3 liên kết.
- [ ] **OL3D-EQP-DNA-0001-T04:** Bật nhãn: hai mạch hiển thị ngược chiều.

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

## 4.33. [OL3D-EQP-DNA-0001] Mô hình cấu trúc phân tử DNA xoắn kép (SGK KHTN 9)
**Tên tiếng Anh**: *Watson-Crick DNA Double Helix Structural Model* | **Mã Archetype**: `dna-double-helix` | **Phân loại danh mục**: `biology-microscopy`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-DNA-0001`
* **Mã đường dẫn (Slug)**: `dna-double-helix-model`
* **Môn học áp dụng**: `biology`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 38.1 Bài 38 SGK KHTN 9 (Nucleic acid & Gen)
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương XI: Di truyền học Mendel. Cơ sở phân tử của hiện tượng di truyền · Bài 38: Nucleic acid và gene (trang 166–167)
* **Hình ảnh đối chiếu SGK**: Hình 38.1 (Mô hình cấu trúc một đoạn phân tử DNA) (**)
* **Chức năng chuẩn**: Trực quan hoá cấu trúc xoắn kép của phân tử DNA và nguyên tắc bổ sung giữa các nucleotide (A liên kết với T bằng 2 liên kết hydrogen; G liên kết với C bằng 3 liên kết hydrogen).

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 105 mm, Cao = 250 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.105 m, Cao (Y) = 0.25 m, Sâu (Z) = 0.105 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `handle`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `TubeGeometry (Double Helix Ribbon)` | MeshPhysicalMaterial (Colored Plastics: Blue-A, Red-T, Green-G, Yellow-X) | 1 | Hai dải ruy băng photphat-đường xoắn ốc đối song song |
| `handle` | `Cylinder Base & Stand` | MeshStandardMaterial (Steel Stand) | 1 | Trụ đỡ và đế tròn xoay 360 độ |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **260 g** (Trạng thái: `verified`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad L_{chu\,kỳ} = 3.4\text{ nm} = 34\text{ Å}, \quad d = 2.0\text{ nm} = 20\text{ Å}$$
  *Ý nghĩa vật lý*: Kích thước một chu kỳ xoắn của phân tử DNA B-form theo mô hình Watson–Crick.
  $$\mathbf{(2)}\quad N_{cặp\,nu} = 10.5\text{ cặp/chu kỳ}, \quad \Delta L_{giữa\,2\,nu} = 0.34\text{ nm}$$
  *Ý nghĩa vật lý*: Khoảng cách giữa hai cặp nucleotide kế tiếp dọc theo trục xoắn kép.
  $$\mathbf{(3)}\quad \text{A} = \text{T} \; (2\text{ liên kết hydro}), \quad \text{G} \equiv \text{X} \; (3\text{ liên kết hydro})$$
  *Ý nghĩa vật lý*: Nguyên tắc bổ sung giữa các bazơ nitơ trên hai mạch đối song song ($5' \to 3'$ và $3' \to 5'$).
* **Các tính năng khoa học tích hợp**:
  - Mô hình không gian 3 chiều của phân tử DNA theo mẫu Watson – Crick với hai dải băng xoắn kép song song ngược chiều (3'→5' và 5'→3').
  - Các bậc thang ngang thể hiện các cặp nitrogenous base liên kết theo đúng Nguyên tắc bổ sung (NTBS): Adenine (A - Đỏ) liên kết với Thymine (T - Vàng) bằng 2 liên kết hydrogen; Guanine (G - Xanh lá) liên kết với Cytosine (C - Xanh lam) bằng 3 liên kết hydrogen.
  - Giúp học sinh quan sát trực quan cấu trúc không gian, chu kì xoắn (10 cặp nucleotide = 34 Å) trong Bài 38 SGK KHTN 9.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `INTACT_HELIX`
* **Danh sách trạng thái khả dụng**: `INTACT_HELIX`, `ROTATING_360`, `BASE_PAIRS_HIGHLIGHTED`, `UNZIPPING_DEMO`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `INTACT_HELIX` | `ROTATING_360` | Auto rotation enabled | `true` |
| `INTACT_HELIX` | `BASE_PAIRS_HIGHLIGHTED` | Base pair clicked | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Đúng 100% nguyên tắc bổ sung A-T và G-X
* **Độ chia nhỏ nhất / Độ phân giải**: Tỷ lệ mô hình phóng đại 1 : 10,000,000
* **Độ lặp lại phép đo**: Khớp mộng cơ học chính xác từng liên kết hydro
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Nhựa ABS bền bỉ

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Lắp sai nguyên tắc bổ sung** | Cố tình gắn bazơ A với G hoặc T với X | Mô hình bị méo dạng không lắp ghép được | `Khóa cơ học mộng âm dương` | Chỉ cho phép liên kết mộng A-T (2 chốt) và G-X (3 chốt) |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **STB Việt Nam — Mô hình Cấu trúc Phân tử ADN** | `stb.com.vn` | Mô hình cấu trúc không gian phân tử ADN: Đường kính vòng xoắn mô phỏng 20 Å, chiều cao mỗi chu kì xoắn 34 Å gồm 10 cặp nucleotide. |
| **Innotec Việt Nam — Thiết bị Sinh học THCS** | `innotec.com.vn` | Mô hình phân tử DNA lắp ghép trên trụ inox và đế nhựa ABS, phân biệt 4 màu sắc chuẩn cho các base A, T, G, C. |
| **Thiết bị Y tế & Giáo dục Huê Lợi** | `tbytehueloi.com` | Mô hình chuỗi xoắn kép ADN phục vụ giảng dạy phần Di truyền và Biến dị môn Khoa học tự nhiên lớp 9. |
| **Thiết bị Giáo dục Thái Sơn** | `thietbigiaoducthaison.com` | Minh họa trực quan nguyên tắc bổ sung (A–T, G–C) và cấu trúc đa phân của đại phân tử sinh học DNA. |
| **VietJack — SGK KHTN 9 Bài 38 (Nucleic acid và ứng dụng)** | `vietjack.com` | Hình 38.1 SGK KHTN 9: Mô hình cấu trúc một đoạn phân tử DNA xoắn kép và khác biệt giữa DNA với RNA. |

---
