# 13. Giá đỡ thí nghiệm kèm khớp nối & tay kẹp

**Device ID:** `OL3D-EQP-STD-0001`  
**Nhóm chức năng đề xuất:** `G05/G06`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `retort-stand`  
**Slug:** `gia-do-thi-nghiem-da-nang`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `not-verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-STD-0001_gia-do-thi-nghiem-da-nang` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.3, 1.8b, 1.10 SGK KHTN 9 ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 140 mm, Cao = 460 mm, Sâu = 210 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.14 m, Cao (Y) = 0.46 m, Sâu (Z) = 0.21 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `handle`, `measurement_anchor` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial` * **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `BoxGeometry + Cylinder` | MeshStandardMaterial (Cast Iron, color 0x1e293b, roughness 0.7) | 1 | Chân đế gang đúc nặng 1.85kg kèm trụ inox Ø10x500mm | | `handle` | `Box + Torus Screw` | MeshStandardMaterial (Aluminium Bosshead) | 2 | Khớp nối chữ thập và tay kẹp bọc cao su chịu nhiệt | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **1850 g** (Trạng thái: `reported`) ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad \sum \vec{M}_{(O)} = \vec{0} \iff F_{clamp} \cdot d_{arm} \le M_{tự\,đổ} = m_{đế} \cdot g \cdot \frac{W_{đế}}{2}$$ *Ý nghĩa vật lý*: Điều kiện cân bằng chống lật đổ giá thí nghiệm khi gá các bình cầu và ống sinh hàn nặng ($m_{đế} = 1.85\text{ kg}$, $W_{đế} = 135\text{ mm}$). * **Các tính năng khoa học tích hợp**: - Chân đế bằng gang đúc nặng sơn tĩnh điện chống gỉ, có đệm cao su dưới đáy chống trượt trên mặt bàn gỗ. - Trụ đứng bằng thép mạ crôm Ø 10 mm lắp ren vuông góc vững chắc vào chân đế. - Đi kèm khớp nối chữ thập (Bosshead), tay kẹp bọc cao su (kẹp cổ bình cầu, ống sinh hàn) và vòng đỡ sắt (đỡ phễu chiết, lưới tản nhiệt). ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `STANDALONE` * **Danh sách trạng thái khả dụng**: `STANDALONE`, `CLAMP_ATTACHED`, `RING_ATTACHED`, `HOLDING_APPARATUS` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `STANDALONE` | `CLAMP_ATTACHED` | Bosshead clamp mounted | `height <= 0.50m` | | `CLAMP_ATTACHED` | `HOLDING_APPARATUS` | Glassware fastened in clamp | `true` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: Độ vuông góc trục đứng 90° ± 0.2° * **Độ chia nhỏ nhất / Độ phân giải**: 1 mm chỉnh cao độ khớp nối * **Độ lặp lại phép đo**: Vững chắc tuyệt đối dưới tải trọng 3.5 kg * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không biến dạng ở 300°C ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Đổ lật giá thí nghiệm ra phía trước** | Gá phễu chiết chứa đầy dung dịch quá xa tâm đế gang | Đổ toàn bộ hệ thống hóa chất xuống bàn | `Trọng tâm hệ thống nằm ngoài chu vi đế gang` | Luôn xoay tay kẹp hướng về phía diện tích mặt đế gang nặng | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Visitech — Bộ Giá đỡ Thí nghiệm Đa năng** | `visitech.vn` | Giá sắt thí nghiệm chuẩn: Đế gang 135×200 mm hoặc 150×220 mm, trụ inox dài 500 mm, kèm kẹp đôi và vòng đỡ. | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Giá thí nghiệm dùng chung cho Vật lí (treo lực kế, giữ thấu kính) và Hóa học (gá phễu chiết, bộ chưng cất). | | **VietValue — Thiết bị Trường học** | `vietvalue.edu.vn` | Bộ giá thí nghiệm KHTN 9: Tay kẹp có lót đệm bần/cao su chịu nhiệt tránh làm nứt vỡ cổ bình cầu thủy tinh. | | **Innotec Việt Nam** | `innotec.com.vn` | Khớp nối chữ thập hợp kim nhôm đúc có vít tai hồng vặn nhẹ tay cho học sinh THCS. | | **VietChem** | `vietchem.com.vn` | Quy tắc an toàn khi lắp bộ chưng cất và chiết lỏng–lỏng trên giá sắt chữ nhật. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Giữ và định vị dụng cụ thí nghiệm bằng chân đế, trụ, khớp nối và tay kẹp.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 140 mm, Cao = 460 mm, Sâu = 210 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.14 m, Cao (Y) = 0.46 m, Sâu (Z) = 0.21 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `handle`, `measurement_anchor`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `STANDALONE`, `CLAMP_ATTACHED`, `RING_ATTACHED`, `HOLDING_APPARATUS`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body / base | Chân đế và trụ | Đặt chân đế trên bàn; xoay/đặt trụ theo hướng thiết kế. | Vị trí và độ ổn định thay đổi theo tải và vị trí kẹp. |
| handle / clamp joint | Tay kẹp và khớp nối | Nới khóa, trượt khớp dọc trụ, xoay tay kẹp, siết khóa. | Khớp được giữ ở vị trí mới; thiết bị kẹp được hỗ trợ. |
| measurement_anchor | Điểm gá | Gá buret, bình cầu, nhiệt kế hoặc ống theo connector tương thích. | Liên kết cơ học giữ dụng cụ và truyền tải lên giá đỡ. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt chân đế trên mặt phẳng.
2. Lắp trụ/khớp nối và điều chỉnh cao độ.
3. Nới tay kẹp, đưa dụng cụ vào vị trí.
4. Siết vừa đủ để giữ chắc mà không làm vỡ dụng cụ thủy tinh.
5. Kiểm tra nguy cơ lật trước khi thao tác.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Kẹp và chân đế giữ dụng cụ; lực/tải và cánh tay đòn ảnh hưởng ổn định chống lật.
- Không cho phép khớp trượt tự do sau khi khóa.
- Cảnh báo khi mômen tải vượt khả năng chống lật trong mô hình.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \sum \vec{M}_{(O)} = \vec{0} \iff F_{clamp} \cdot d_{arm} \le M_{tự\,đổ} = m_{đế} \cdot g \cdot \frac{W_{đế}}{2}$$
  *Ý nghĩa vật lý*: Điều kiện cân bằng chống lật đổ giá thí nghiệm khi gá các bình cầu và ống sinh hàn nặng ($m_{đế} = 1.85\text{ kg}$, $W_{đế} = 135\text{ mm}$).
* **Các tính năng khoa học tích hợp**:
  - Chân đế bằng gang đúc nặng sơn tĩnh điện chống gỉ, có đệm cao su dưới đáy chống trượt trên mặt bàn gỗ.
  - Trụ đứng bằng thép mạ crôm Ø 10 mm lắp ren vuông góc vững chắc vào chân đế.
  - Đi kèm khớp nối chữ thập (Bosshead), tay kẹp bọc cao su (kẹp cổ bình cầu, ống sinh hàn) và vòng đỡ sắt (đỡ phễu chiết, lưới tản nhiệt).

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `STANDALONE`
* **Danh sách trạng thái khả dụng**: `STANDALONE`, `CLAMP_ATTACHED`, `RING_ATTACHED`, `HOLDING_APPARATUS`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `STANDALONE` | `CLAMP_ATTACHED` | Bosshead clamp mounted | `height <= 0.50m` |
| `CLAMP_ATTACHED` | `HOLDING_APPARATUS` | Glassware fastened in clamp | `true` |

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
| **Đổ lật giá thí nghiệm ra phía trước** | Gá phễu chiết chứa đầy dung dịch quá xa tâm đế gang | Đổ toàn bộ hệ thống hóa chất xuống bàn | `Trọng tâm hệ thống nằm ngoài chu vi đế gang` | Luôn xoay tay kẹp hướng về phía diện tích mặt đế gang nặng |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-STD-0001-T01:** Nới khóa: khớp di chuyển dọc trụ.
- [ ] **OL3D-EQP-STD-0001-T02:** Siết khóa: khớp giữ vị trí dưới tải được phép.
- [ ] **OL3D-EQP-STD-0001-T03:** Gá dụng cụ tương thích: connector snap đúng.
- [ ] **OL3D-EQP-STD-0001-T04:** Tải vượt giới hạn chống lật: cảnh báo hoặc ngăn tiếp tục.

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

## 4.13. [OL3D-EQP-STD-0001] Giá đỡ thí nghiệm kèm khớp nối & tay kẹp
**Tên tiếng Anh**: *Laboratory Retort Stand with Bosshead & Clamp* | **Mã Archetype**: `retort-stand` | **Phân loại danh mục**: `support-hardware`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-STD-0001`
* **Mã đường dẫn (Slug)**: `gia-do-thi-nghiem-da-nang`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-STD-0001_gia-do-thi-nghiem-da-nang` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.3, 1.8b, 1.10 SGK KHTN 9

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 140 mm, Cao = 460 mm, Sâu = 210 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.14 m, Cao (Y) = 0.46 m, Sâu (Z) = 0.21 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `handle`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry + Cylinder` | MeshStandardMaterial (Cast Iron, color 0x1e293b, roughness 0.7) | 1 | Chân đế gang đúc nặng 1.85kg kèm trụ inox Ø10x500mm |
| `handle` | `Box + Torus Screw` | MeshStandardMaterial (Aluminium Bosshead) | 2 | Khớp nối chữ thập và tay kẹp bọc cao su chịu nhiệt |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **1850 g** (Trạng thái: `reported`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \sum \vec{M}_{(O)} = \vec{0} \iff F_{clamp} \cdot d_{arm} \le M_{tự\,đổ} = m_{đế} \cdot g \cdot \frac{W_{đế}}{2}$$
  *Ý nghĩa vật lý*: Điều kiện cân bằng chống lật đổ giá thí nghiệm khi gá các bình cầu và ống sinh hàn nặng ($m_{đế} = 1.85\text{ kg}$, $W_{đế} = 135\text{ mm}$).
* **Các tính năng khoa học tích hợp**:
  - Chân đế bằng gang đúc nặng sơn tĩnh điện chống gỉ, có đệm cao su dưới đáy chống trượt trên mặt bàn gỗ.
  - Trụ đứng bằng thép mạ crôm Ø 10 mm lắp ren vuông góc vững chắc vào chân đế.
  - Đi kèm khớp nối chữ thập (Bosshead), tay kẹp bọc cao su (kẹp cổ bình cầu, ống sinh hàn) và vòng đỡ sắt (đỡ phễu chiết, lưới tản nhiệt).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `STANDALONE`
* **Danh sách trạng thái khả dụng**: `STANDALONE`, `CLAMP_ATTACHED`, `RING_ATTACHED`, `HOLDING_APPARATUS`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `STANDALONE` | `CLAMP_ATTACHED` | Bosshead clamp mounted | `height <= 0.50m` |
| `CLAMP_ATTACHED` | `HOLDING_APPARATUS` | Glassware fastened in clamp | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Độ vuông góc trục đứng 90° ± 0.2°
* **Độ chia nhỏ nhất / Độ phân giải**: 1 mm chỉnh cao độ khớp nối
* **Độ lặp lại phép đo**: Vững chắc tuyệt đối dưới tải trọng 3.5 kg
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không biến dạng ở 300°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Đổ lật giá thí nghiệm ra phía trước** | Gá phễu chiết chứa đầy dung dịch quá xa tâm đế gang | Đổ toàn bộ hệ thống hóa chất xuống bàn | `Trọng tâm hệ thống nằm ngoài chu vi đế gang` | Luôn xoay tay kẹp hướng về phía diện tích mặt đế gang nặng |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Visitech — Bộ Giá đỡ Thí nghiệm Đa năng** | `visitech.vn` | Giá sắt thí nghiệm chuẩn: Đế gang 135×200 mm hoặc 150×220 mm, trụ inox dài 500 mm, kèm kẹp đôi và vòng đỡ. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Giá thí nghiệm dùng chung cho Vật lí (treo lực kế, giữ thấu kính) và Hóa học (gá phễu chiết, bộ chưng cất). |
| **VietValue — Thiết bị Trường học** | `vietvalue.edu.vn` | Bộ giá thí nghiệm KHTN 9: Tay kẹp có lót đệm bần/cao su chịu nhiệt tránh làm nứt vỡ cổ bình cầu thủy tinh. |
| **Innotec Việt Nam** | `innotec.com.vn` | Khớp nối chữ thập hợp kim nhôm đúc có vít tai hồng vặn nhẹ tay cho học sinh THCS. |
| **VietChem** | `vietchem.com.vn` | Quy tắc an toàn khi lắp bộ chưng cất và chiết lỏng–lỏng trên giá sắt chữ nhật. |

---
