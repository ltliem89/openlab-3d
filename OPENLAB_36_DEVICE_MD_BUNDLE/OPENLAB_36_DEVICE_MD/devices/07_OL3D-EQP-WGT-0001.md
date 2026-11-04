# 07. Quả cân chuẩn bằng đồng 50 g

**Device ID:** `OL3D-EQP-WGT-0001`  
**Nhóm chức năng đề xuất:** `G02`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `calibration-weight`  
**Slug:** `qua-can-chuan-50g`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: OIML R111 Class M1 · Thông tư 38/2021/TT-BGDĐT ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 22 mm, Cao = 34 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.022 m, Cao (Y) = 0.034 m, Sâu (Z) = 0.022 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `handle` * **Các lớp vật liệu Three.js sử dụng**: `MeshPhysicalMaterial` * **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `CylinderGeometry + Torus bevel` | MeshPhysicalMaterial (Polished Brass, metalness 0.94) | 1 | Thân quả cân đồng thau mạ niken bóng gương | | `handle` | `Cylinder + Sphere` | MeshPhysicalMaterial (Brass) | 1 | Núm cầm thắt eo chuẩn OIML gắp bằng nhíp | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **50 g** (Trạng thái: `verified`) - Thể tích chuẩn ($V_{ref}$): **5.95 cm³** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad m_{true} = m_{apparent} \cdot \left(1 + \frac{\rho_{air}}{\rho_{brass}} - \frac{\rho_{air}}{\rho_{balance}}\right)$$ *Ý nghĩa vật lý*: Hiệu chỉnh lực đẩy Archimedes của không khí khi cân quả cân chuẩn ($ ho_{brass} = 8.40\text{ g/cm}^3$, $\rho_{air} \approx 1.2\text{ kg/m}^3$). * **Các tính năng khoa học tích hợp**: - Gia công từ đồng thau nguyên khối mạ Niken-Crôm bóng gương chống ăn mòn và bám bẩn. - Đỉnh quả cân có cổ thắt và núm tròn chuẩn OIML để gắp bằng nhíp hoặc kẹp vào móc lực kế. - Dùng làm chuẩn kiểm tra độ chính xác của cân điện tử (50.00 g) và kiểm định lực kế (0.49 N). ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `ON_BENCH` * **Danh sách trạng thái khả dụng**: `ON_BENCH`, `HELD_IN_AIR`, `ON_BALANCE_PAN`, `HANGING_ON_SPRING`, `SUBMERGED` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `ON_BENCH` | `ON_BALANCE_PAN` | Placed on balance pan | `dist < 0.165m` | | `ON_BENCH` | `HANGING_ON_SPRING` | Hung on dyno hook | `dist < 0.105m` | | `ON_BENCH` | `SUBMERGED` | Dropped into graduated cylinder | `cylinder aperture clear` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±3.0 mg (OIML R111 Class M1) * **Độ chia nhỏ nhất / Độ phân giải**: Chuẩn khối lượng danh định 50.000 g * **Độ lặp lại phép đo**: ±0.5 mg * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Oxy hóa / Bám dính mồ hôi tay** | Dùng tay trần cầm quả cân chuẩn | Khối lượng tăng thêm 0.01 - 0.03 g | `Mỡ tay bám dính` | Bắt buộc gắp quả cân bằng kẹp gắp gỗ hoặc đeo găng tay vải | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Thiết bị Điện tử & Cân chuẩn Việt Nam** | `thietbidientu.net.vn` | Quả cân chuẩn 50g chuẩn OIML M1: Đường kính Ø 22 mm, chiều cao 34 mm, chất liệu đồng mạ crôm hoặc inox 304. | | **VietValue — Thiết bị Giáo dục** | `vietvalue.edu.vn` | Hộp quả cân chuẩn thực hành KHTN: Quả 50g dùng hiệu chuẩn cân kỹ thuật và làm tải trọng chuẩn. | | **DMKLab Việt Nam** | `dmklab.vn` | Quả cân chuẩn phòng thí nghiệm: Đáy phẳng mài nhẵn, khắc laser trị số "50 g" rõ nét trên mặt đỉnh. | | **Innotec Việt Nam** | `innotec.com.vn` | Quả nặng chuẩn 50g dùng trong các thí nghiệm Cơ học (Động năng, Thế năng, Lực đàn hồi) cấp THCS. | | **VinaMTSC** | `vinamtsc.com` | Tiêu chuẩn bảo quản quả cân chuẩn: Không chạm tay ướt hoặc hóa chất axit làm thay đổi khối lượng chuẩn. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Làm quả cân chuẩn có thể nhấc, đặt và ghép tải để hiệu chuẩn hoặc so sánh khối lượng.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 22 mm, Cao = 34 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.022 m, Cao (Y) = 0.034 m, Sâu (Z) = 0.022 m
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

- **Các trạng thái:** `ON_BENCH`, `HELD_IN_AIR`, `ON_BALANCE_PAN`, `HANGING_ON_SPRING`, `SUBMERGED`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| handle | Tay cầm | Nhấn giữ và kéo để nhấc; đặt xuống đĩa cân hoặc móc/khay theo thí nghiệm. | Vật có vị trí và tải trọng thực; không tự đổi khối lượng khi xoay. |
| body | Quả cân 50 g | Kéo thả vào vùng đặt hợp lệ; có thể xoay để xem nhãn. | Cân/đòn bẩy nhận khối lượng chuẩn 50 g theo dữ liệu hồ sơ. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Nhấc quả cân bằng tay cầm.
2. Đặt lên cân hoặc điểm treo đã chỉ định.
3. Đợi thiết bị đo ổn định.
4. Ghi kết quả và nhấc quả cân về vị trí bảo quản.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Khi đặt lên cân/đòn bẩy, tải và mômen được cập nhật.
- Khối lượng chuẩn không thay đổi theo góc xoay hoặc vị trí.
- Có thể mô phỏng hiệu chỉnh lực đẩy không khí chỉ khi tham số môi trường và mật độ đã được khai báo.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad m_{true} = m_{apparent} \cdot \left(1 + \frac{\rho_{air}}{\rho_{brass}} - \frac{\rho_{air}}{\rho_{balance}}\right)$$
  *Ý nghĩa vật lý*: Hiệu chỉnh lực đẩy Archimedes của không khí khi cân quả cân chuẩn ($
ho_{brass} = 8.40\text{ g/cm}^3$, $\rho_{air} \approx 1.2\text{ kg/m}^3$).
* **Các tính năng khoa học tích hợp**:
  - Gia công từ đồng thau nguyên khối mạ Niken-Crôm bóng gương chống ăn mòn và bám bẩn.
  - Đỉnh quả cân có cổ thắt và núm tròn chuẩn OIML để gắp bằng nhíp hoặc kẹp vào móc lực kế.
  - Dùng làm chuẩn kiểm tra độ chính xác của cân điện tử (50.00 g) và kiểm định lực kế (0.49 N).

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `ON_BENCH`
* **Danh sách trạng thái khả dụng**: `ON_BENCH`, `HELD_IN_AIR`, `ON_BALANCE_PAN`, `HANGING_ON_SPRING`, `SUBMERGED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `ON_BENCH` | `ON_BALANCE_PAN` | Placed on balance pan | `dist < 0.165m` |
| `ON_BENCH` | `HANGING_ON_SPRING` | Hung on dyno hook | `dist < 0.105m` |
| `ON_BENCH` | `SUBMERGED` | Dropped into graduated cylinder | `cylinder aperture clear` |

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
| **Oxy hóa / Bám dính mồ hôi tay** | Dùng tay trần cầm quả cân chuẩn | Khối lượng tăng thêm 0.01 - 0.03 g | `Mỡ tay bám dính` | Bắt buộc gắp quả cân bằng kẹp gắp gỗ hoặc đeo găng tay vải |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-WGT-0001-T01:** Đặt lên cân: tăng tải tương ứng 50 g.
- [ ] **OL3D-EQP-WGT-0001-T02:** Treo lên đòn bẩy: mômen thay đổi theo khoảng cách tới trục.
- [ ] **OL3D-EQP-WGT-0001-T03:** Nhấc ra: tải trở về trạng thái ban đầu.

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

## 4.7. [OL3D-EQP-WGT-0001] Quả cân chuẩn bằng đồng 50 g
**Tên tiếng Anh**: *50 g Brass Calibration Weight* | **Mã Archetype**: `calibration-weight` | **Phân loại danh mục**: `mass-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-WGT-0001`
* **Mã đường dẫn (Slug)**: `qua-can-chuan-50g`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: OIML R111 Class M1 · Thông tư 38/2021/TT-BGDĐT

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 22 mm, Cao = 34 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.022 m, Cao (Y) = 0.034 m, Sâu (Z) = 0.022 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `handle`
* **Các lớp vật liệu Three.js sử dụng**: `MeshPhysicalMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry + Torus bevel` | MeshPhysicalMaterial (Polished Brass, metalness 0.94) | 1 | Thân quả cân đồng thau mạ niken bóng gương |
| `handle` | `Cylinder + Sphere` | MeshPhysicalMaterial (Brass) | 1 | Núm cầm thắt eo chuẩn OIML gắp bằng nhíp |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **50 g** (Trạng thái: `verified`)
  - Thể tích chuẩn ($V_{ref}$): **5.95 cm³**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad m_{true} = m_{apparent} \cdot \left(1 + \frac{\rho_{air}}{\rho_{brass}} - \frac{\rho_{air}}{\rho_{balance}}\right)$$
  *Ý nghĩa vật lý*: Hiệu chỉnh lực đẩy Archimedes của không khí khi cân quả cân chuẩn ($
ho_{brass} = 8.40\text{ g/cm}^3$, $\rho_{air} \approx 1.2\text{ kg/m}^3$).
* **Các tính năng khoa học tích hợp**:
  - Gia công từ đồng thau nguyên khối mạ Niken-Crôm bóng gương chống ăn mòn và bám bẩn.
  - Đỉnh quả cân có cổ thắt và núm tròn chuẩn OIML để gắp bằng nhíp hoặc kẹp vào móc lực kế.
  - Dùng làm chuẩn kiểm tra độ chính xác của cân điện tử (50.00 g) và kiểm định lực kế (0.49 N).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `ON_BENCH`
* **Danh sách trạng thái khả dụng**: `ON_BENCH`, `HELD_IN_AIR`, `ON_BALANCE_PAN`, `HANGING_ON_SPRING`, `SUBMERGED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `ON_BENCH` | `ON_BALANCE_PAN` | Placed on balance pan | `dist < 0.165m` |
| `ON_BENCH` | `HANGING_ON_SPRING` | Hung on dyno hook | `dist < 0.105m` |
| `ON_BENCH` | `SUBMERGED` | Dropped into graduated cylinder | `cylinder aperture clear` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±3.0 mg (OIML R111 Class M1)
* **Độ chia nhỏ nhất / Độ phân giải**: Chuẩn khối lượng danh định 50.000 g
* **Độ lặp lại phép đo**: ±0.5 mg
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Oxy hóa / Bám dính mồ hôi tay** | Dùng tay trần cầm quả cân chuẩn | Khối lượng tăng thêm 0.01 - 0.03 g | `Mỡ tay bám dính` | Bắt buộc gắp quả cân bằng kẹp gắp gỗ hoặc đeo găng tay vải |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thiết bị Điện tử & Cân chuẩn Việt Nam** | `thietbidientu.net.vn` | Quả cân chuẩn 50g chuẩn OIML M1: Đường kính Ø 22 mm, chiều cao 34 mm, chất liệu đồng mạ crôm hoặc inox 304. |
| **VietValue — Thiết bị Giáo dục** | `vietvalue.edu.vn` | Hộp quả cân chuẩn thực hành KHTN: Quả 50g dùng hiệu chuẩn cân kỹ thuật và làm tải trọng chuẩn. |
| **DMKLab Việt Nam** | `dmklab.vn` | Quả cân chuẩn phòng thí nghiệm: Đáy phẳng mài nhẵn, khắc laser trị số "50 g" rõ nét trên mặt đỉnh. |
| **Innotec Việt Nam** | `innotec.com.vn` | Quả nặng chuẩn 50g dùng trong các thí nghiệm Cơ học (Động năng, Thế năng, Lực đàn hồi) cấp THCS. |
| **VinaMTSC** | `vinamtsc.com` | Tiêu chuẩn bảo quản quả cân chuẩn: Không chạm tay ướt hoặc hóa chất axit làm thay đổi khối lượng chuẩn. |

---
