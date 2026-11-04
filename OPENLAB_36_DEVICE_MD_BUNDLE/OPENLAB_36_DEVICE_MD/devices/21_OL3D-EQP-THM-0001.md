# 21. Nhiệt kế chất lỏng -10°C đến 110°C

**Device ID:** `OL3D-EQP-THM-0001`  
**Nhóm chức năng đề xuất:** `G03`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `thermometer`  
**Slug:** `nhiet-ke-phong-thi-nghiem-110c`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `not-verified` * **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-THM-0001_nhiet-ke-phong-thi-nghiem-110c` (Tập tin: `undefined`). ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: TCVN / ISO 1770 · Thông tư 38/2021/TT-BGDĐT (Hình 1.10 SGK KHTN 9) ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 7 mm, Cao = 220 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.025 m, Cao (Y) = 0.22 m, Sâu (Z) = 0.025 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `plunger`, `scale_marks` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `CylinderGeometry (Thin glass stem)` | MeshPhysicalMaterial (Borosilicate, IOR 1.47) | 4 | Thân mao quản thủy tinh Ø6.5mm dài 295mm | | `plunger` | `CylinderGeometry (Red fluid)` | MeshStandardMaterial (Red alcohol, emissive red) | 2 | Cột rượu màu đỏ dâng hạ theo nhiệt độ | | `scale_marks` | `CylinderGeometry` | MeshBasicMaterial (CanvasTexture) | 5 | Thang chia nhiệt độ khắc laser -10 đến +110°C | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `readScale` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **28 g** (Trạng thái: `illustrative`) * **Thông số metrology thiết bị đo**: - Đại lượng đo: `temperature` - Giới hạn đo (GHĐ): **-10 °C** đến **110 °C** - Độ chia nhỏ nhất (ĐCNN): **1 °C** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad h_{cột\,rượu}(T) = h_0 \cdot \left[1 + \beta_{ethanol} \cdot (T - T_0)\right]$$ *Ý nghĩa vật lý*: Sự giãn nở vì nhiệt của thể tích chất lỏng cảm nhiệt trong ống mao quản ($eta_{ethanol} \approx 1.1 \times 10^{-3}\,\text{K}^{-1}$). $$\mathbf{(2)}\quad T = -10 + \frac{h - h_{-10}}{h_{110} - h_{-10}} \times 120\,(^\circ\text{C})$$ *Ý nghĩa vật lý*: Công thức chuyển đổi chiều cao cột chất lỏng sang nhiệt độ hiển thị. * **Các tính năng khoa học tích hợp**: - Sử dụng chất lỏng cảm nhiệt là rượu hữu cơ pha màu đỏ tươi dễ quan sát, tuyệt đối an toàn (không chứa thủy ngân độc hại). - Thang chia độ khắc laser bền nhiệt từ -10 °C đến 110 °C với độ chia nhỏ nhất 1 °C. - Dùng đo nhiệt độ dung dịch trong cốc đốt hoặc cắm qua nút cao su cổ bình cầu có nhánh (Hình 1.10 Bài 24 SGK KHTN 9) để theo dõi nhiệt độ sôi khi chưng cất. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `AMBIENT_AIR` * **Danh sách trạng thái khả dụng**: `AMBIENT_AIR`, `IMMERSING`, `EQUILIBRIUM_TEMPERATURE`, `BOILING_MONITORING` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `AMBIENT_AIR` | `IMMERSING` | Probe dipped into liquid | `isSubmerged == true` | | `IMMERSING` | `EQUILIBRIUM_TEMPERATURE` | Thermal relaxation elapsed | `|dT/dt| < 0.1°C/s` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±1.0 °C (TCVN / ISO 1770) * **Độ chia nhỏ nhất / Độ phân giải**: 1.0 °C (ĐCNN 1 vạch chia) * **Độ lặp lại phép đo**: ±0.5 °C * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Thời gian đáp ứng nhiệt τ ≈ 3.5 giây ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Đứt đoạn cột rượu cảm nhiệt** | Bị rung lắc mạnh hoặc làm rơi nhiệt kế | Số đo nhiệt độ bị sai lệch lớn | `Xuất hiện bọt khí ngăn đôi cột đỏ` | Ngâm bầu nhiệt kế vào nước nóng để cột rượu nối liền trở lại | | **Bầu nhiệt kế chạm đáy cốc khi đun** | Cắm nhiệt kế chạm trực tiếp vào đáy cốc thủy tinh tiếp xúc ngọn lửa | Đo sai nhiệt độ cục bộ đáy cốc (cao hơn nhiệt độ nước 15°C) và nứt vỡ bầu nhiệt kế | `Khoảng cách bầu tới đáy cốc < 3 mm` | Kẹp nhiệt kế trên giá sắt cách đáy cốc tối thiểu 15 mm | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **LabVietChem — Nhiệt kế Rượu Phòng thí nghiệm** | `labvietchem.com.vn` | Nhiệt kế rượu đỏ -10 đến 110 °C: Chiều dài 300 mm, đường kính thân Ø 6–7 mm, vạch chia 1 °C. | | **Tiêu chuẩn Quốc gia TCVN (Tổng cục TCĐLCL)** | `tcvn.gov.vn` | Quy định an toàn trường học: Thay thế nhiệt kế thủy ngân bằng nhiệt kế rượu màu hữu cơ trong thực hành THCS. | | **Lời Giải Hay — Thực hành KHTN** | `loigiaihay.com` | Nguyên lý giãn nở vì nhiệt của cột chất lỏng và cách đặt bầu nhiệt kế trong bình cầu có nhánh ngang vòi thoát hơi. | | **VietValue — Dụng cụ Đo nhiệt độ** | `vietvalue.edu.vn` | Nhiệt kế thí nghiệm KHTN: Có khuyên treo ở đầu trên và ống nhựa bảo vệ khi cất giữ. | | **Thư viện Giáo dục Violet** | `violet.vn` | Hướng dẫn xác định GHĐ (110 °C) và ĐCNN (1 °C) của nhiệt kế rượu trong phòng thực hành. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Đo nhiệt độ chất lỏng hoặc môi trường bằng nhiệt kế chất lỏng.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 7 mm, Cao = 220 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.025 m, Cao (Y) = 0.22 m, Sâu (Z) = 0.025 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `plunger`, `scale_marks`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `showDimensions`, `readScale`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `AMBIENT_AIR`, `IMMERSING`, `EQUILIBRIUM_TEMPERATURE`, `BOILING_MONITORING`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| bulb / thermometer stem | Bầu và thân nhiệt kế | Nhúng bầu vào mẫu; tránh chạm đáy/thành khi đo chất lỏng. | Cột chất lỏng thay đổi từ từ theo nhiệt độ mẫu. |
| scale_marks | Thang °C | Đưa góc nhìn vuông góc thang và đọc điểm cột chất lỏng. | Hiển thị nhiệt độ trong dải −10 đến 110 °C. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Kiểm tra nhiệt kế nguyên vẹn và đọc dải đo.
2. Nhúng bầu vào mẫu theo đúng cách.
3. Chờ cân bằng nhiệt.
4. Đọc nhiệt độ ngang tầm mắt.
5. Lấy nhiệt kế ra và vệ sinh theo quy trình mô phỏng.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Nhiệt kế phản hồi có độ trễ nhiệt, không nhảy tức thời theo nhiệt độ mẫu.
- Ngoài dải đo phải báo vượt dải.
- Giá trị hiển thị phụ thuộc nhiệt độ mẫu hoặc môi trường, không nhập số tùy ý.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad h_{cột\,rượu}(T) = h_0 \cdot \left[1 + \beta_{ethanol} \cdot (T - T_0)\right]$$
  *Ý nghĩa vật lý*: Sự giãn nở vì nhiệt của thể tích chất lỏng cảm nhiệt trong ống mao quản ($eta_{ethanol} \approx 1.1 \times 10^{-3}\,\text{K}^{-1}$).
  $$\mathbf{(2)}\quad T = -10 + \frac{h - h_{-10}}{h_{110} - h_{-10}} \times 120\,(^\circ\text{C})$$
  *Ý nghĩa vật lý*: Công thức chuyển đổi chiều cao cột chất lỏng sang nhiệt độ hiển thị.
* **Các tính năng khoa học tích hợp**:
  - Sử dụng chất lỏng cảm nhiệt là rượu hữu cơ pha màu đỏ tươi dễ quan sát, tuyệt đối an toàn (không chứa thủy ngân độc hại).
  - Thang chia độ khắc laser bền nhiệt từ -10 °C đến 110 °C với độ chia nhỏ nhất 1 °C.
  - Dùng đo nhiệt độ dung dịch trong cốc đốt hoặc cắm qua nút cao su cổ bình cầu có nhánh (Hình 1.10 Bài 24 SGK KHTN 9) để theo dõi nhiệt độ sôi khi chưng cất.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `AMBIENT_AIR`
* **Danh sách trạng thái khả dụng**: `AMBIENT_AIR`, `IMMERSING`, `EQUILIBRIUM_TEMPERATURE`, `BOILING_MONITORING`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `AMBIENT_AIR` | `IMMERSING` | Probe dipped into liquid | `isSubmerged == true` |
| `IMMERSING` | `EQUILIBRIUM_TEMPERATURE` | Thermal relaxation elapsed | `|dT/dt| < 0.1°C/s` |

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
| **Đứt đoạn cột rượu cảm nhiệt** | Bị rung lắc mạnh hoặc làm rơi nhiệt kế | Số đo nhiệt độ bị sai lệch lớn | `Xuất hiện bọt khí ngăn đôi cột đỏ` | Ngâm bầu nhiệt kế vào nước nóng để cột rượu nối liền trở lại |
| **Bầu nhiệt kế chạm đáy cốc khi đun** | Cắm nhiệt kế chạm trực tiếp vào đáy cốc thủy tinh tiếp xúc ngọn lửa | Đo sai nhiệt độ cục bộ đáy cốc (cao hơn nhiệt độ nước 15°C) và nứt vỡ bầu nhiệt kế | `Khoảng cách bầu tới đáy cốc < 3 mm` | Kẹp nhiệt kế trên giá sắt cách đáy cốc tối thiểu 15 mm |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-THM-0001-T01:** Nhúng vào hai mẫu nhiệt độ khác nhau: cột thay đổi và ổn định khác nhau.
- [ ] **OL3D-EQP-THM-0001-T02:** Thay đổi nhiệt độ mẫu: đáp ứng có độ trễ hợp lý.
- [ ] **OL3D-EQP-THM-0001-T03:** Vượt −10..110 °C: cảnh báo ngoài dải.

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

## 4.21. [OL3D-EQP-THM-0001] Nhiệt kế chất lỏng -10°C đến 110°C
**Tên tiếng Anh**: *Laboratory Alcohol Thermometer -10°C to 110°C* | **Mã Archetype**: `thermometer` | **Phân loại danh mục**: `thermal-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-THM-0001`
* **Mã đường dẫn (Slug)**: `nhiet-ke-phong-thi-nghiem-110c`
* **Môn học áp dụng**: `chemistry`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-THM-0001_nhiet-ke-phong-thi-nghiem-110c` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: TCVN / ISO 1770 · Thông tư 38/2021/TT-BGDĐT (Hình 1.10 SGK KHTN 9)

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 7 mm, Cao = 220 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.025 m, Cao (Y) = 0.22 m, Sâu (Z) = 0.025 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `plunger`, `scale_marks`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Thin glass stem)` | MeshPhysicalMaterial (Borosilicate, IOR 1.47) | 4 | Thân mao quản thủy tinh Ø6.5mm dài 295mm |
| `plunger` | `CylinderGeometry (Red fluid)` | MeshStandardMaterial (Red alcohol, emissive red) | 2 | Cột rượu màu đỏ dâng hạ theo nhiệt độ |
| `scale_marks` | `CylinderGeometry` | MeshBasicMaterial (CanvasTexture) | 5 | Thang chia nhiệt độ khắc laser -10 đến +110°C |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **28 g** (Trạng thái: `illustrative`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `temperature`
  - Giới hạn đo (GHĐ): **-10 °C** đến **110 °C**
  - Độ chia nhỏ nhất (ĐCNN): **1 °C**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad h_{cột\,rượu}(T) = h_0 \cdot \left[1 + \beta_{ethanol} \cdot (T - T_0)\right]$$
  *Ý nghĩa vật lý*: Sự giãn nở vì nhiệt của thể tích chất lỏng cảm nhiệt trong ống mao quản ($eta_{ethanol} \approx 1.1 \times 10^{-3}\,\text{K}^{-1}$).
  $$\mathbf{(2)}\quad T = -10 + \frac{h - h_{-10}}{h_{110} - h_{-10}} \times 120\,(^\circ\text{C})$$
  *Ý nghĩa vật lý*: Công thức chuyển đổi chiều cao cột chất lỏng sang nhiệt độ hiển thị.
* **Các tính năng khoa học tích hợp**:
  - Sử dụng chất lỏng cảm nhiệt là rượu hữu cơ pha màu đỏ tươi dễ quan sát, tuyệt đối an toàn (không chứa thủy ngân độc hại).
  - Thang chia độ khắc laser bền nhiệt từ -10 °C đến 110 °C với độ chia nhỏ nhất 1 °C.
  - Dùng đo nhiệt độ dung dịch trong cốc đốt hoặc cắm qua nút cao su cổ bình cầu có nhánh (Hình 1.10 Bài 24 SGK KHTN 9) để theo dõi nhiệt độ sôi khi chưng cất.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `AMBIENT_AIR`
* **Danh sách trạng thái khả dụng**: `AMBIENT_AIR`, `IMMERSING`, `EQUILIBRIUM_TEMPERATURE`, `BOILING_MONITORING`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `AMBIENT_AIR` | `IMMERSING` | Probe dipped into liquid | `isSubmerged == true` |
| `IMMERSING` | `EQUILIBRIUM_TEMPERATURE` | Thermal relaxation elapsed | `|dT/dt| < 0.1°C/s` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±1.0 °C (TCVN / ISO 1770)
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0 °C (ĐCNN 1 vạch chia)
* **Độ lặp lại phép đo**: ±0.5 °C
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Thời gian đáp ứng nhiệt τ ≈ 3.5 giây

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Đứt đoạn cột rượu cảm nhiệt** | Bị rung lắc mạnh hoặc làm rơi nhiệt kế | Số đo nhiệt độ bị sai lệch lớn | `Xuất hiện bọt khí ngăn đôi cột đỏ` | Ngâm bầu nhiệt kế vào nước nóng để cột rượu nối liền trở lại |
| **Bầu nhiệt kế chạm đáy cốc khi đun** | Cắm nhiệt kế chạm trực tiếp vào đáy cốc thủy tinh tiếp xúc ngọn lửa | Đo sai nhiệt độ cục bộ đáy cốc (cao hơn nhiệt độ nước 15°C) và nứt vỡ bầu nhiệt kế | `Khoảng cách bầu tới đáy cốc < 3 mm` | Kẹp nhiệt kế trên giá sắt cách đáy cốc tối thiểu 15 mm |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **LabVietChem — Nhiệt kế Rượu Phòng thí nghiệm** | `labvietchem.com.vn` | Nhiệt kế rượu đỏ -10 đến 110 °C: Chiều dài 300 mm, đường kính thân Ø 6–7 mm, vạch chia 1 °C. |
| **Tiêu chuẩn Quốc gia TCVN (Tổng cục TCĐLCL)** | `tcvn.gov.vn` | Quy định an toàn trường học: Thay thế nhiệt kế thủy ngân bằng nhiệt kế rượu màu hữu cơ trong thực hành THCS. |
| **Lời Giải Hay — Thực hành KHTN** | `loigiaihay.com` | Nguyên lý giãn nở vì nhiệt của cột chất lỏng và cách đặt bầu nhiệt kế trong bình cầu có nhánh ngang vòi thoát hơi. |
| **VietValue — Dụng cụ Đo nhiệt độ** | `vietvalue.edu.vn` | Nhiệt kế thí nghiệm KHTN: Có khuyên treo ở đầu trên và ống nhựa bảo vệ khi cất giữ. |
| **Thư viện Giáo dục Violet** | `violet.vn` | Hướng dẫn xác định GHĐ (110 °C) và ĐCNN (1 °C) của nhiệt kế rượu trong phòng thực hành. |

---
