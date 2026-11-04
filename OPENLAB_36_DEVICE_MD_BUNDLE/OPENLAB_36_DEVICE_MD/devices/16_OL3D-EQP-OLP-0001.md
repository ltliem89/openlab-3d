# 16. (1) Đèn chiếu sáng Halogen kèm Đầu chắn khe sáng

**Device ID:** `OL3D-EQP-OLP-0001`  
**Nhóm chức năng đề xuất:** `G06`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `optical-lamp`  
**Slug:** `den-chieu-sang-halogen-khe-sang`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · TCVN 11844 · Bài 8, 9 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ * **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (1): Đèn chiếu sáng trên giá quang học (**) * **Chức năng chuẩn**: Cung cấp chùm sáng song song cường độ cao chiếu sáng đều Vật sáng kính mờ hình chữ F (2) hoặc tạo 3 tia sáng song song khảo sát tiêu điểm thấu kính. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 98 mm, Cao = 125 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.098 m, Cao (Y) = 0.125 m, Sâu (Z) = 0.056 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `power_cord_socket`, `terminal_pos`, `terminal_neg`, `terminal_pos_hitbox`, `terminal_neg_hitbox`, `beam_mode_knob`, `knob_hitbox_3d`, `scale_display`, `lamp_point_light`, `measurement_anchor` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData; Optical Ray Tracing & Refraction; Electrical Terminal / Wiring * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `BoxGeometry + Cooling fins` | MeshStandardMaterial (Black Anodized Aluminium) | 1 | Hộp đèn tản nhiệt có khe cài tấm chắn sáng | | `lamp_point_light` | `PointLight` | PointLight (Color 0xffedd5, decay 2) | 6 | Nguồn sáng điểm phát xạ ánh sáng thực tế trong cảnh 3D | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **240 g** (Trạng thái: `verified`) ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad P_{điện} = U \cdot I = \frac{U^2}{R_{tim}} = \frac{(12.0\text{ V})^2}{7.2\,\Omega} = 20.0\text{ W}$$ *Ý nghĩa vật lý*: Công suất tiêu thụ định mức của bóng đèn Halogen. $$\mathbf{(2)}\quad E_{quang}(d) = \frac{I_{cường\,độ}}{d^2} \cdot \cos\theta$$ *Ý nghĩa vật lý*: Độ rọi trên mặt vật sáng chữ F suy giảm theo bình phương khoảng cách. * **Các tính năng khoa học tích hợp**: - Vỏ hộp bằng hợp kim đúc sơn tĩnh điện màu đen mờ chống phản xạ ánh sáng tạp tán, có khe tản nhiệt đối lưu tự nhiên. - Bóng đèn Halogen tim sợi đốt 12V 20W (chân cắm G4) cho phổ phát xạ liên tục, ánh sáng vàng ấm độ rọi tâm đạt > 8000 lux. - Cửa sổ quang học phía trước có ngàm gài đầu chắn khe sáng (1 khe, 3 khe song song, hoặc thấu kính tụ quang phẳng lồi). - Đuôi đèn có cặp cọc cắm bắp chuối Ø 4 mm (đỏ +, xanh -) kết nối dây dẫn tới Nguồn điện hạ áp 3V–12V. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `UNPOWERED` * **Danh sách trạng thái khả dụng**: `UNPOWERED`, `CIRCUIT_CONNECTED_LAMP_OFF`, `LAMP_GLOWING`, `OVERVOLTAGE_BURNOUT` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `UNPOWERED` | `LAMP_GLOWING` | Power turned on and circuit closed | `isCircuitClosed && V >= 2.5V` | | `LAMP_GLOWING` | `OVERVOLTAGE_BURNOUT` | Voltage exceeds 14V | `V > 14.0V` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: Độ rọi tâm > 8000 lux ở cự ly 10 cm * **Độ chia nhỏ nhất / Độ phân giải**: Điện áp danh định 12.0 V DC/AC * **Độ lặp lại phép đo**: Nhiệt độ màu tim đèn 3000 K (vàng ấm) * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Vỏ tản nhiệt nhôm đùn duy trì < 55°C ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Cháy bóng đèn Halogen** | Điều chỉnh biến áp lên 15V - 20V vượt quá định mức 12V | Đứt tim sợi đốt vonfram, đèn tắt ngấm | `V_terminal > 14.0 V` | Bấm nút Thay bóng đèn mới và hạ điện áp nguồn về 12V | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Nguồn sáng đèn Halogen 12V-20W có vỏ bảo vệ chịu nhiệt, kèm giá trượt trên băng quang học. | | **VietValue — Đèn chiếu thí nghiệm** | `vietvalue.edu.vn` | Đèn chiếu giá quang học: Cọc cắm tiêu chuẩn 4mm, núm điều chỉnh tụ tiêu cự bóng đèn và khe cài tấm chắn sáng. | | **Innotec Việt Nam** | `innotec.com.vn` | Hộp đèn thí nghiệm quang học THCS: Thân nhôm đùn tản nhiệt nhanh, ngàm trượt cố định chắc chắn trên ray 1m. | | **Thiết bị Giáo dục Tây Bắc** | `thietbigiaoductaybac.vn` | Đèn nguồn sáng KHTN 9: Tích hợp tim vonfram phát sáng đồng nhất, độ rọi tập trung tạo chùm song song qua khe hẹp. | | **Thorlabs Optics Laboratory** | `thorlabs.com` | Halogen Light Source for Optical Benches: 12V DC operation, standardized dovetail slider, optical axis height 125 mm. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Tạo chùm sáng và khe sáng cho thí nghiệm quang học, cấp nguồn qua cọc điện.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 98 mm, Cao = 125 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.098 m, Cao (Y) = 0.125 m, Sâu (Z) = 0.056 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `power_cord_socket`, `terminal_pos`, `terminal_neg`, `terminal_pos_hitbox`, `terminal_neg_hitbox`, `beam_mode_knob`, `knob_hitbox_3d`, `scale_display`, `lamp_point_light`, `measurement_anchor`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `opticalFocus`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `UNPOWERED`, `CIRCUIT_CONNECTED_LAMP_OFF`, `LAMP_GLOWING`, `OVERVOLTAGE_BURNOUT`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| power_cord_socket / terminal_pos / terminal_neg | Ổ nguồn và cọc điện | Nối đúng hai cực với nguồn phù hợp; tháo dây khi ngắt nguồn. | Mạch kín mới cho phép đèn hoạt động. |
| beam_mode_knob | Núm chế độ chùm/khe | Xoay qua các nấc được khai báo. | Hình dạng chùm sáng thay đổi theo chế độ khe. |
| lamp_point_light | Bóng đèn | Bật nguồn và điều chỉnh điện áp theo định mức. | Độ sáng phụ thuộc công suất/điện áp, không sáng nếu chưa cấp điện. |
| scale_display | Hiển thị/thông số | Quan sát trạng thái nguồn và chế độ phát sáng. | Hiển thị chế độ và trạng thái hoạt động. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt nguồn sáng thẳng hàng với trục quang học.
2. Nối cọc dương/âm đúng với nguồn hạ áp.
3. Chọn chế độ khe/chùm phù hợp.
4. Bật nguồn và điều chỉnh ở dải cho phép.
5. Định vị vật sáng và thấu kính/màn theo thí nghiệm.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Nguồn điện và kết nối phải hợp lệ mới phát sáng.
- Độ rọi giảm theo khoảng cách và góc chiếu.
- Ngắt mạch hoặc quá giới hạn nguồn thì đèn tắt/cảnh báo.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad P_{điện} = U \cdot I = \frac{U^2}{R_{tim}} = \frac{(12.0\text{ V})^2}{7.2\,\Omega} = 20.0\text{ W}$$
  *Ý nghĩa vật lý*: Công suất tiêu thụ định mức của bóng đèn Halogen.
  $$\mathbf{(2)}\quad E_{quang}(d) = \frac{I_{cường\,độ}}{d^2} \cdot \cos\theta$$
  *Ý nghĩa vật lý*: Độ rọi trên mặt vật sáng chữ F suy giảm theo bình phương khoảng cách.
* **Các tính năng khoa học tích hợp**:
  - Vỏ hộp bằng hợp kim đúc sơn tĩnh điện màu đen mờ chống phản xạ ánh sáng tạp tán, có khe tản nhiệt đối lưu tự nhiên.
  - Bóng đèn Halogen tim sợi đốt 12V 20W (chân cắm G4) cho phổ phát xạ liên tục, ánh sáng vàng ấm độ rọi tâm đạt > 8000 lux.
  - Cửa sổ quang học phía trước có ngàm gài đầu chắn khe sáng (1 khe, 3 khe song song, hoặc thấu kính tụ quang phẳng lồi).
  - Đuôi đèn có cặp cọc cắm bắp chuối Ø 4 mm (đỏ +, xanh -) kết nối dây dẫn tới Nguồn điện hạ áp 3V–12V.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `UNPOWERED`
* **Danh sách trạng thái khả dụng**: `UNPOWERED`, `CIRCUIT_CONNECTED_LAMP_OFF`, `LAMP_GLOWING`, `OVERVOLTAGE_BURNOUT`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `UNPOWERED` | `LAMP_GLOWING` | Power turned on and circuit closed | `isCircuitClosed && V >= 2.5V` |
| `LAMP_GLOWING` | `OVERVOLTAGE_BURNOUT` | Voltage exceeds 14V | `V > 14.0V` |

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
| **Cháy bóng đèn Halogen** | Điều chỉnh biến áp lên 15V - 20V vượt quá định mức 12V | Đứt tim sợi đốt vonfram, đèn tắt ngấm | `V_terminal > 14.0 V` | Bấm nút Thay bóng đèn mới và hạ điện áp nguồn về 12V |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-OLP-0001-T01:** Chưa nối nguồn: đèn không sáng.
- [ ] **OL3D-EQP-OLP-0001-T02:** Nối đúng và bật nguồn: đèn phát sáng.
- [ ] **OL3D-EQP-OLP-0001-T03:** Xoay núm chế độ: hình dạng chùm sáng đổi đúng nấc.
- [ ] **OL3D-EQP-OLP-0001-T04:** Tăng khoảng cách: độ rọi giảm theo mô hình nguồn.

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

## 4.16. [OL3D-EQP-OLP-0001] (1) Đèn chiếu sáng Halogen kèm Đầu chắn khe sáng
**Tên tiếng Anh**: *(1) Halogen Optical Lamp with Slit Aperture on Rider* | **Mã Archetype**: `optical-lamp` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-OLP-0001`
* **Mã đường dẫn (Slug)**: `den-chieu-sang-halogen-khe-sang`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · TCVN 11844 · Bài 8, 9 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ
* **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (1): Đèn chiếu sáng trên giá quang học (**)
* **Chức năng chuẩn**: Cung cấp chùm sáng song song cường độ cao chiếu sáng đều Vật sáng kính mờ hình chữ F (2) hoặc tạo 3 tia sáng song song khảo sát tiêu điểm thấu kính.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 98 mm, Cao = 125 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.098 m, Cao (Y) = 0.125 m, Sâu (Z) = 0.056 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `power_cord_socket`, `terminal_pos`, `terminal_neg`, `terminal_pos_hitbox`, `terminal_neg_hitbox`, `beam_mode_knob`, `knob_hitbox_3d`, `scale_display`, `lamp_point_light`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData; Optical Ray Tracing & Refraction; Electrical Terminal / Wiring
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry + Cooling fins` | MeshStandardMaterial (Black Anodized Aluminium) | 1 | Hộp đèn tản nhiệt có khe cài tấm chắn sáng |
| `lamp_point_light` | `PointLight` | PointLight (Color 0xffedd5, decay 2) | 6 | Nguồn sáng điểm phát xạ ánh sáng thực tế trong cảnh 3D |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **240 g** (Trạng thái: `verified`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad P_{điện} = U \cdot I = \frac{U^2}{R_{tim}} = \frac{(12.0\text{ V})^2}{7.2\,\Omega} = 20.0\text{ W}$$
  *Ý nghĩa vật lý*: Công suất tiêu thụ định mức của bóng đèn Halogen.
  $$\mathbf{(2)}\quad E_{quang}(d) = \frac{I_{cường\,độ}}{d^2} \cdot \cos\theta$$
  *Ý nghĩa vật lý*: Độ rọi trên mặt vật sáng chữ F suy giảm theo bình phương khoảng cách.
* **Các tính năng khoa học tích hợp**:
  - Vỏ hộp bằng hợp kim đúc sơn tĩnh điện màu đen mờ chống phản xạ ánh sáng tạp tán, có khe tản nhiệt đối lưu tự nhiên.
  - Bóng đèn Halogen tim sợi đốt 12V 20W (chân cắm G4) cho phổ phát xạ liên tục, ánh sáng vàng ấm độ rọi tâm đạt > 8000 lux.
  - Cửa sổ quang học phía trước có ngàm gài đầu chắn khe sáng (1 khe, 3 khe song song, hoặc thấu kính tụ quang phẳng lồi).
  - Đuôi đèn có cặp cọc cắm bắp chuối Ø 4 mm (đỏ +, xanh -) kết nối dây dẫn tới Nguồn điện hạ áp 3V–12V.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `UNPOWERED`
* **Danh sách trạng thái khả dụng**: `UNPOWERED`, `CIRCUIT_CONNECTED_LAMP_OFF`, `LAMP_GLOWING`, `OVERVOLTAGE_BURNOUT`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `UNPOWERED` | `LAMP_GLOWING` | Power turned on and circuit closed | `isCircuitClosed && V >= 2.5V` |
| `LAMP_GLOWING` | `OVERVOLTAGE_BURNOUT` | Voltage exceeds 14V | `V > 14.0V` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Độ rọi tâm > 8000 lux ở cự ly 10 cm
* **Độ chia nhỏ nhất / Độ phân giải**: Điện áp danh định 12.0 V DC/AC
* **Độ lặp lại phép đo**: Nhiệt độ màu tim đèn 3000 K (vàng ấm)
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Vỏ tản nhiệt nhôm đùn duy trì < 55°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Cháy bóng đèn Halogen** | Điều chỉnh biến áp lên 15V - 20V vượt quá định mức 12V | Đứt tim sợi đốt vonfram, đèn tắt ngấm | `V_terminal > 14.0 V` | Bấm nút Thay bóng đèn mới và hạ điện áp nguồn về 12V |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Nguồn sáng đèn Halogen 12V-20W có vỏ bảo vệ chịu nhiệt, kèm giá trượt trên băng quang học. |
| **VietValue — Đèn chiếu thí nghiệm** | `vietvalue.edu.vn` | Đèn chiếu giá quang học: Cọc cắm tiêu chuẩn 4mm, núm điều chỉnh tụ tiêu cự bóng đèn và khe cài tấm chắn sáng. |
| **Innotec Việt Nam** | `innotec.com.vn` | Hộp đèn thí nghiệm quang học THCS: Thân nhôm đùn tản nhiệt nhanh, ngàm trượt cố định chắc chắn trên ray 1m. |
| **Thiết bị Giáo dục Tây Bắc** | `thietbigiaoductaybac.vn` | Đèn nguồn sáng KHTN 9: Tích hợp tim vonfram phát sáng đồng nhất, độ rọi tập trung tạo chùm song song qua khe hẹp. |
| **Thorlabs Optics Laboratory** | `thorlabs.com` | Halogen Light Source for Optical Benches: 12V DC operation, standardized dovetail slider, optical axis height 125 mm. |

---
