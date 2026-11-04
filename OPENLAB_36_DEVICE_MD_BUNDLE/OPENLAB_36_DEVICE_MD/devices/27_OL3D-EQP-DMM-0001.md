# 27. Đồng hồ đo điện đa năng hiện số (SGK KHTN 9)

**Device ID:** `OL3D-EQP-DMM-0001`  
**Nhóm chức năng đề xuất:** `G03/G07`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `digital-multimeter`  
**Slug:** `digital-multimeter-ac-dc`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-DMM-0001_digital-multimeter-ac-dc` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: IEC 61010-1 CAT II · Hình 1.5 trang 6 & Bài 11, 12 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương III: Điện · Bài 1 (trang 7), Bài 11: Điện trở. Định luật Ohm, Bài 12: Đoạn mạch nối tiếp, song song * **Hình ảnh đối chiếu SGK**: Hình 1.5 (Đồng hồ đo điện đa năng) (**) * **Chức năng chuẩn**: Đo các đại lượng điện khác nhau như cường độ dòng điện I (A), hiệu điện thế U (V), điện trở R (Ω) trong mạch điện một chiều cũng như mạch điện xoay chiều. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 92 mm, Cao = 68 mm, Sâu = 155 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.092 m, Cao (Y) = 0.068 m, Sâu (Z) = 0.155 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `scale_display`, `scale_display_rear`, `handle` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: State Sync via userData * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `Box + Bevel Extrude` | MeshStandardMaterial (Yellow Holster ABS, color 0xf59e0b) | 1 | Vỏ cao su bọc chống sốc màu vàng công nghiệp | | `scale_display` | `PlaneGeometry` | MeshBasicMaterial (CanvasTexture LCD) | 3 | Màn hình LCD 7 đoạn hiển thị số thực 360° | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **310 g** (Trạng thái: `verified`) * **Thông số metrology thiết bị đo**: - Đại lượng đo: `voltage-resistance` - Giới hạn đo (GHĐ): **0 V / A / Ω** đến **600 V** - Độ chia nhỏ nhất (ĐCNN): **0.01 V / A** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad V_{DC} = \int_{0}^{T_{int}} V_{in}(t)\,dt$$ *Ý nghĩa vật lý*: Nguyên lý chuyển đổi tương tự sang số ADC tích phân hai sườn (Dual-slope integration). $$\mathbf{(2)}\quad R_x = \frac{V_{sample}}{I_{constant}}$$ *Ý nghĩa vật lý*: Đo điện trở theo phương pháp bơm dòng chuẩn và đo sụt áp bốn dây Kelvin. * **Các tính năng khoa học tích hợp**: - Tích hợp Vôn kế, Ampe kế và Ôm kế trong một thiết bị hiện số duy nhất kèm núm xoay chọn thang đo. - 3 giắc cắm que đo chuyên biệt: COM (Đen chung), V/Ω/mA (Đỏ tiêu chuẩn) và 10A DC (Đỏ dòng lớn). - Dùng trong Bài 11 (Định luật Ohm, điện trở dây dẫn) và Bài 12 (Đoạn mạch nối tiếp, song song) của SGK KHTN 9. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `OFF` * **Danh sách trạng thái khả dụng**: `OFF`, `MEASURING_DCV`, `MEASURING_ACV`, `MEASURING_DCA`, `MEASURING_OHM` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `OFF` | `MEASURING_DCV` | Rotary switch turned to DCV | `true` | | `MEASURING_DCV` | `MEASURING_OHM` | Rotary switch turned to OHM | `true` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±0.5% + 2 số hiển thị (CAT II 600V) * **Độ chia nhỏ nhất / Độ phân giải**: 0.01 V / 0.1 mA / 0.1 Ω (Màn hình 3.5 số lẻ) * **Độ lặp lại phép đo**: ±0.2% * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Trở kháng vào Zin >= 10 MΩ ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Đứt cầu chì bảo vệ thang đo dòng điện** | Đo điện áp nguồn điện nhưng cắm que đo ở cổng 10A / mA | Đoản mạch và đứt cầu chì bảo vệ nhanh | `Dòng điện qua shunt > 10 A` | Thay cầu chì bảo vệ gốm 10A và chuyển que đo sang cổng V/Ω | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **DMKLab — Đồng hồ Đo điện Đa năng Hiện số** | `dmklab.vn` | Đồng hồ vạn năng điện tử dùng trong trường học: Màn hình LCD lớn, đo điện áp DC/AC, dòng điện DC đến 10A và điện trở Ω. | | **LXI Education — Hướng dẫn Thực hành Điện học 9** | `lxi.edu.vn` | Cách chọn thang đo DCV, DCA và Ω trên đồng hồ đo điện đa năng (Hình 1.5 SGK KHTN 9) và quy tắc mắc nối tiếp/song song. | | **Studocu Vietnam — Tài liệu KHTN 9 Kết nối tri thức** | `studocu.vn` | Tổng hợp dụng cụ Bài 1 KHTN 9: Đồng hồ đo điện đa năng giúp đo trực tiếp U, I, R với độ chính xác cao hơn đồng hồ kim. | | **VietValue — Thiết bị Điện học THCS** | `vietvalue.edu.vn` | Vỏ bọc cao su chống va đập màu vàng/xanh, tích hợp cầu chì tự phục hồi chống cháy hỏng khi học sinh cắm nhầm thang đo. | | **Innotec Việt Nam** | `innotec.com.vn` | Đồng hồ đa năng hiện số chuẩn Thông tư 38/2021/TT-BGDĐT kèm bộ dây đo đầu cắm bắp chuối 4 mm. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Đo điện áp, dòng điện, điện trở hoặc đại lượng điện khác theo chế độ được chọn.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 92 mm, Cao = 68 mm, Sâu = 155 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.092 m, Cao (Y) = 0.068 m, Sâu (Z) = 0.155 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `scale_display`, `scale_display_rear`, `handle`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `readScale`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `OFF`, `MEASURING_DCV`, `MEASURING_ACV`, `MEASURING_DCA`, `MEASURING_OHM`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| selector dial | Núm xoay chức năng/thang đo | Xoay tới V, A, Ω hoặc chế độ AC/DC phù hợp. | Chế độ đo và đơn vị màn hình thay đổi. |
| input sockets | Cổng COM/V/Ω/mA/A | Cắm que đen/đỏ vào đúng cổng tùy phép đo. | Thiết lập đường đo; cắm sai cổng phải cảnh báo. |
| test leads / probes | Que đo | Đặt hai đầu que vào hai điểm mạch đúng cách. | Giá trị đo cập nhật từ mạch thực sự kết nối. |
| scale_display | Màn hình số | Đọc số, đơn vị, OL hoặc lỗi. | Hiển thị kết quả, quá thang và trạng thái đo. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Chọn đại lượng và loại AC/DC.
2. Chọn thang đo bắt đầu đủ lớn.
3. Cắm que đúng cổng.
4. Đặt que song song khi đo áp, nối tiếp khi đo dòng, đo Ω khi mạch không cấp nguồn.
5. Đọc kết quả và ngắt que đo.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Giá trị chỉ có khi kết nối đúng cấu hình mạch và chế độ.
- Đo Ω trên mạch đang cấp nguồn phải cảnh báo.
- Quá thang hiển thị OL; sai cổng hoặc sai cách mắc phải hướng dẫn lại.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V_{DC} = \int_{0}^{T_{int}} V_{in}(t)\,dt$$
  *Ý nghĩa vật lý*: Nguyên lý chuyển đổi tương tự sang số ADC tích phân hai sườn (Dual-slope integration).
  $$\mathbf{(2)}\quad R_x = \frac{V_{sample}}{I_{constant}}$$
  *Ý nghĩa vật lý*: Đo điện trở theo phương pháp bơm dòng chuẩn và đo sụt áp bốn dây Kelvin.
* **Các tính năng khoa học tích hợp**:
  - Tích hợp Vôn kế, Ampe kế và Ôm kế trong một thiết bị hiện số duy nhất kèm núm xoay chọn thang đo.
  - 3 giắc cắm que đo chuyên biệt: COM (Đen chung), V/Ω/mA (Đỏ tiêu chuẩn) và 10A DC (Đỏ dòng lớn).
  - Dùng trong Bài 11 (Định luật Ohm, điện trở dây dẫn) và Bài 12 (Đoạn mạch nối tiếp, song song) của SGK KHTN 9.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `OFF`
* **Danh sách trạng thái khả dụng**: `OFF`, `MEASURING_DCV`, `MEASURING_ACV`, `MEASURING_DCA`, `MEASURING_OHM`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `OFF` | `MEASURING_DCV` | Rotary switch turned to DCV | `true` |
| `MEASURING_DCV` | `MEASURING_OHM` | Rotary switch turned to OHM | `true` |

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
| **Đứt cầu chì bảo vệ thang đo dòng điện** | Đo điện áp nguồn điện nhưng cắm que đo ở cổng 10A / mA | Đoản mạch và đứt cầu chì bảo vệ nhanh | `Dòng điện qua shunt > 10 A` | Thay cầu chì bảo vệ gốm 10A và chuyển que đo sang cổng V/Ω |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-DMM-0001-T01:** Đo điện áp song song: đúng điện áp mạch.
- [ ] **OL3D-EQP-DMM-0001-T02:** Đo dòng nối tiếp: đúng dòng mạch.
- [ ] **OL3D-EQP-DMM-0001-T03:** Đo điện trở khi nguồn tắt: đúng R.
- [ ] **OL3D-EQP-DMM-0001-T04:** Chọn sai cổng/thang: cảnh báo hoặc hiển thị lỗi.
- [ ] **OL3D-EQP-DMM-0001-T05:** Mạch hở: không bịa số đo ổn định.

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

## 4.27. [OL3D-EQP-DMM-0001] Đồng hồ đo điện đa năng hiện số (SGK KHTN 9)
**Tên tiếng Anh**: *Digital Multimeter (AC/DC V, A, Ω)* | **Mã Archetype**: `digital-multimeter` | **Phân loại danh mục**: `electrical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-DMM-0001`
* **Mã đường dẫn (Slug)**: `digital-multimeter-ac-dc`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-DMM-0001_digital-multimeter-ac-dc` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: IEC 61010-1 CAT II · Hình 1.5 trang 6 & Bài 11, 12 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương III: Điện · Bài 1 (trang 7), Bài 11: Điện trở. Định luật Ohm, Bài 12: Đoạn mạch nối tiếp, song song
* **Hình ảnh đối chiếu SGK**: Hình 1.5 (Đồng hồ đo điện đa năng) (**)
* **Chức năng chuẩn**: Đo các đại lượng điện khác nhau như cường độ dòng điện I (A), hiệu điện thế U (V), điện trở R (Ω) trong mạch điện một chiều cũng như mạch điện xoay chiều.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 92 mm, Cao = 68 mm, Sâu = 155 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.092 m, Cao (Y) = 0.068 m, Sâu (Z) = 0.155 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `scale_display_rear`, `handle`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: State Sync via userData
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Box + Bevel Extrude` | MeshStandardMaterial (Yellow Holster ABS, color 0xf59e0b) | 1 | Vỏ cao su bọc chống sốc màu vàng công nghiệp |
| `scale_display` | `PlaneGeometry` | MeshBasicMaterial (CanvasTexture LCD) | 3 | Màn hình LCD 7 đoạn hiển thị số thực 360° |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **310 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `voltage-resistance`
  - Giới hạn đo (GHĐ): **0 V / A / Ω** đến **600 V**
  - Độ chia nhỏ nhất (ĐCNN): **0.01 V / A**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V_{DC} = \int_{0}^{T_{int}} V_{in}(t)\,dt$$
  *Ý nghĩa vật lý*: Nguyên lý chuyển đổi tương tự sang số ADC tích phân hai sườn (Dual-slope integration).
  $$\mathbf{(2)}\quad R_x = \frac{V_{sample}}{I_{constant}}$$
  *Ý nghĩa vật lý*: Đo điện trở theo phương pháp bơm dòng chuẩn và đo sụt áp bốn dây Kelvin.
* **Các tính năng khoa học tích hợp**:
  - Tích hợp Vôn kế, Ampe kế và Ôm kế trong một thiết bị hiện số duy nhất kèm núm xoay chọn thang đo.
  - 3 giắc cắm que đo chuyên biệt: COM (Đen chung), V/Ω/mA (Đỏ tiêu chuẩn) và 10A DC (Đỏ dòng lớn).
  - Dùng trong Bài 11 (Định luật Ohm, điện trở dây dẫn) và Bài 12 (Đoạn mạch nối tiếp, song song) của SGK KHTN 9.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `OFF`
* **Danh sách trạng thái khả dụng**: `OFF`, `MEASURING_DCV`, `MEASURING_ACV`, `MEASURING_DCA`, `MEASURING_OHM`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `OFF` | `MEASURING_DCV` | Rotary switch turned to DCV | `true` |
| `MEASURING_DCV` | `MEASURING_OHM` | Rotary switch turned to OHM | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.5% + 2 số hiển thị (CAT II 600V)
* **Độ chia nhỏ nhất / Độ phân giải**: 0.01 V / 0.1 mA / 0.1 Ω (Màn hình 3.5 số lẻ)
* **Độ lặp lại phép đo**: ±0.2%
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Trở kháng vào Zin >= 10 MΩ

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Đứt cầu chì bảo vệ thang đo dòng điện** | Đo điện áp nguồn điện nhưng cắm que đo ở cổng 10A / mA | Đoản mạch và đứt cầu chì bảo vệ nhanh | `Dòng điện qua shunt > 10 A` | Thay cầu chì bảo vệ gốm 10A và chuyển que đo sang cổng V/Ω |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **DMKLab — Đồng hồ Đo điện Đa năng Hiện số** | `dmklab.vn` | Đồng hồ vạn năng điện tử dùng trong trường học: Màn hình LCD lớn, đo điện áp DC/AC, dòng điện DC đến 10A và điện trở Ω. |
| **LXI Education — Hướng dẫn Thực hành Điện học 9** | `lxi.edu.vn` | Cách chọn thang đo DCV, DCA và Ω trên đồng hồ đo điện đa năng (Hình 1.5 SGK KHTN 9) và quy tắc mắc nối tiếp/song song. |
| **Studocu Vietnam — Tài liệu KHTN 9 Kết nối tri thức** | `studocu.vn` | Tổng hợp dụng cụ Bài 1 KHTN 9: Đồng hồ đo điện đa năng giúp đo trực tiếp U, I, R với độ chính xác cao hơn đồng hồ kim. |
| **VietValue — Thiết bị Điện học THCS** | `vietvalue.edu.vn` | Vỏ bọc cao su chống va đập màu vàng/xanh, tích hợp cầu chì tự phục hồi chống cháy hỏng khi học sinh cắm nhầm thang đo. |
| **Innotec Việt Nam** | `innotec.com.vn` | Đồng hồ đa năng hiện số chuẩn Thông tư 38/2021/TT-BGDĐT kèm bộ dây đo đầu cắm bắp chuối 4 mm. |

---
