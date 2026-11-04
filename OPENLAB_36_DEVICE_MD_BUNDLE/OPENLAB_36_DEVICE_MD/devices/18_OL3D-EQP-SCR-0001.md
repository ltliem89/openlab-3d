# 18. (4) Màn chắn hứng ảnh trên Giá quang học

**Device ID:** `OL3D-EQP-SCR-0001`  
**Nhóm chức năng đề xuất:** `G06`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `optical-screen`  
**Slug:** `man-chan-hung-anh-quang-hoc`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.3 & Bài 8, 9 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ * **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (4): Màn chắn hứng ảnh trên giá quang học (**) * **Chức năng chuẩn**: Hứng ảnh thật của Vật sáng chữ F (2) tạo bởi Thấu kính hội tụ (3). Khi màn chắn đặt đúng vị trí d', ảnh chữ F ngược chiều hiện lên sắc nét; khi lệch khỏi d', ảnh sẽ bị nhòe mờ. ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 106 mm, Cao = 148 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.042 m, Cao (Y) = 0.148 m, Sâu (Z) = 0.106 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `scale_display`, `scale_display_rear`, `measurement_anchor` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData; Optical Ray Tracing & Refraction * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `Box Slider` | MeshStandardMaterial (Black ABS) | 2 | Chân trượt có ốc hãm trên ray quang học | | `scale_display` | `PlaneGeometry` | MeshBasicMaterial (White Matte Screen Texture) | 4 | Màn chắn trắng mờ hứng ảnh chữ F ngược chiều | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **125 g** (Trạng thái: `verified`) * **Thông số metrology thiết bị đo**: - Đại lượng đo: `length` - Giới hạn đo (GHĐ): **0 mm** đến **450 mm** - Độ chia nhỏ nhất (ĐCNN): **1 mm** ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad h_{ảnh} = |k| \cdot h_{vật} = \left|\frac{d'}{d}\right| \cdot 20.0\text{ mm}$$ *Ý nghĩa vật lý*: Chiều cao ảnh thật của chữ F thu được trên màn hứng ảnh. * **Các tính năng khoa học tích hợp**: - Mặt màn phẳng bằng nhựa kỹ thuật màu trắng sữa hoặc kim loại phủ sơn mờ tĩnh điện chống phản xạ chói lóa. - Có vạch chia ô tọa độ lưới milimet mờ (lưới 5 mm × 5 mm) trên mặt hứng ảnh giúp đo trực tiếp chiều cao ảnh A'B' và độ phóng đại k. - Con trượt gắn ray có ốc hãm định vị, trượt êm dọc ray quang học khi tìm vị trí hứng ảnh thật sắc nét nhất. - Có thể quan sát ảnh rõ ràng từ góc nhìn chính diện (+Z) và cả mặt sau (-Z) khi dùng màn mờ bán truyền xạ. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `DIFFUSE_BLURRED` * **Danh sách trạng thái khả dụng**: `DIFFUSE_BLURRED`, `SHARP_REAL_IMAGE`, `OUT_OF_FOCUS` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `DIFFUSE_BLURRED` | `SHARP_REAL_IMAGE` | Screen position matches d' | `|x_screen - x_expected| < 1 mm` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: Độ phẳng bề mặt hứng ảnh < 0.1 mm * **Độ chia nhỏ nhất / Độ phân giải**: 1.0 mm vạch chia lưới tọa độ * **Độ lặp lại phép đo**: Hình ảnh sắc nét viền rõ * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Ảnh không hiện trên màn do thấu kính phân kì** | Dùng thấu kính phân kì (f < 0) tạo ảnh ảo nằm phía trước thấu kính | Màn chắn đặt sau thấu kính không thể hứng được ảnh | `focalLength < 0` | Giải thích cho học sinh: Ảnh ảo không hứng được trên màn; chỉ quan sát được bằng mắt nhìn qua thấu kính | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Màn chắn hứng ảnh: Kích thước tối thiểu 80 × 100 mm màu trắng mờ, có đế gắn trên băng quang học. | | **VietValue — Màn chắn quang học** | `vietvalue.edu.vn` | Màn hứng ảnh có vạch mm: Bề mặt sơn mờ chống lóa, thể hiện rõ nét ảnh thật của chữ F khi thấu kính hội tụ. | | **Innotec Việt Nam** | `innotec.com.vn` | Màn hứng ảnh KHTN 9: Đồng trục quang học y = 125 mm, độ phẳng cao không cong vênh. | | **Lời Giải Hay — Thực hành KHTN 9** | `loigiaihay.com` | Kỹ thuật tìm ảnh rõ nét trên màn: Di chuyển màn hứng ảnh dọc theo ray quang học đến khi thu được viền chữ F sắc nét nhất. | | **Phywe Laboratory Equipment** | `phywe.com` | Translucent and Opaque Screen: 100x100 mm projection area on optical bench slider. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Hứng ảnh thật và di chuyển màn để tìm mặt phẳng ảnh rõ.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 106 mm, Cao = 148 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.042 m, Cao (Y) = 0.148 m, Sâu (Z) = 0.106 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 2.2. Các node 3D và năng lực tương tác được khai báo

- **Sub-mesh nodes:** `body`, `scale_display`, `scale_display_rear`, `measurement_anchor`
- **Capabilities:** `selectable`, `translatable`, `rotatable`, `opticalFocus`
- **Đại lượng đo:** Không có/không áp dụng theo hồ sơ.
- **Giới hạn đo:** Chưa khai báo trong hồ sơ nguồn.
- **ĐCNN:** Chưa khai báo trong hồ sơ nguồn.

### 2.3. Trạng thái thiết bị trong hồ sơ nguồn

- **Các trạng thái:** `DIFFUSE_BLURRED`, `SHARP_REAL_IMAGE`, `OUT_OF_FOCUS`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| screen plate | Mặt màn chắn | Trượt dọc ray và giữ vuông góc với trục quang học. | Vị trí màn thay đổi; ảnh nét khi màn trùng mặt phẳng ảnh. |
| measurement_anchor | Mốc vị trí màn | Đọc tọa độ trên ray. | Giá trị d’ tính từ vị trí vật và thấu kính. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Đặt màn trên ray sau thấu kính.
2. Di chuyển màn từ gần đến xa.
3. Quan sát độ nét và kích thước ảnh.
4. Dừng tại vị trí ảnh rõ nhất và đọc d’.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Độ nét tăng khi màn tiến gần mặt phẳng ảnh; lệch khỏi đó ảnh mờ.
- Ảnh thật có hướng ngược chiều so với vật.
- Nếu vật ở trong tiêu cự, không được tạo ảnh thật trên màn.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad h_{ảnh} = |k| \cdot h_{vật} = \left|\frac{d'}{d}\right| \cdot 20.0\text{ mm}$$
  *Ý nghĩa vật lý*: Chiều cao ảnh thật của chữ F thu được trên màn hứng ảnh.
* **Các tính năng khoa học tích hợp**:
  - Mặt màn phẳng bằng nhựa kỹ thuật màu trắng sữa hoặc kim loại phủ sơn mờ tĩnh điện chống phản xạ chói lóa.
  - Có vạch chia ô tọa độ lưới milimet mờ (lưới 5 mm × 5 mm) trên mặt hứng ảnh giúp đo trực tiếp chiều cao ảnh A'B' và độ phóng đại k.
  - Con trượt gắn ray có ốc hãm định vị, trượt êm dọc ray quang học khi tìm vị trí hứng ảnh thật sắc nét nhất.
  - Có thể quan sát ảnh rõ ràng từ góc nhìn chính diện (+Z) và cả mặt sau (-Z) khi dùng màn mờ bán truyền xạ.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `DIFFUSE_BLURRED`
* **Danh sách trạng thái khả dụng**: `DIFFUSE_BLURRED`, `SHARP_REAL_IMAGE`, `OUT_OF_FOCUS`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `DIFFUSE_BLURRED` | `SHARP_REAL_IMAGE` | Screen position matches d' | `|x_screen - x_expected| < 1 mm` |

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
| **Ảnh không hiện trên màn do thấu kính phân kì** | Dùng thấu kính phân kì (f < 0) tạo ảnh ảo nằm phía trước thấu kính | Màn chắn đặt sau thấu kính không thể hứng được ảnh | `focalLength < 0` | Giải thích cho học sinh: Ảnh ảo không hứng được trên màn; chỉ quan sát được bằng mắt nhìn qua thấu kính |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-SCR-0001-T01:** Di chuyển màn qua vị trí ảnh: độ nét có cực đại tại d’.
- [ ] **OL3D-EQP-SCR-0001-T02:** Đặt màn sai vị trí: ảnh mờ.
- [ ] **OL3D-EQP-SCR-0001-T03:** Khi d≤f: cảnh báo không có ảnh thật để hứng.

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

## 4.18. [OL3D-EQP-SCR-0001] (4) Màn chắn hứng ảnh trên Giá quang học
**Tên tiếng Anh**: *(4) Matte White Optical Projection Screen on Rider* | **Mã Archetype**: `optical-screen` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-SCR-0001`
* **Mã đường dẫn (Slug)**: `man-chan-hung-anh-quang-hoc`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.3 & Bài 8, 9 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ
* **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (4): Màn chắn hứng ảnh trên giá quang học (**)
* **Chức năng chuẩn**: Hứng ảnh thật của Vật sáng chữ F (2) tạo bởi Thấu kính hội tụ (3). Khi màn chắn đặt đúng vị trí d', ảnh chữ F ngược chiều hiện lên sắc nét; khi lệch khỏi d', ảnh sẽ bị nhòe mờ.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 106 mm, Cao = 148 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.042 m, Cao (Y) = 0.148 m, Sâu (Z) = 0.106 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `scale_display_rear`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData; Optical Ray Tracing & Refraction
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Box Slider` | MeshStandardMaterial (Black ABS) | 2 | Chân trượt có ốc hãm trên ray quang học |
| `scale_display` | `PlaneGeometry` | MeshBasicMaterial (White Matte Screen Texture) | 4 | Màn chắn trắng mờ hứng ảnh chữ F ngược chiều |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **125 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `length`
  - Giới hạn đo (GHĐ): **0 mm** đến **450 mm**
  - Độ chia nhỏ nhất (ĐCNN): **1 mm**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad h_{ảnh} = |k| \cdot h_{vật} = \left|\frac{d'}{d}\right| \cdot 20.0\text{ mm}$$
  *Ý nghĩa vật lý*: Chiều cao ảnh thật của chữ F thu được trên màn hứng ảnh.
* **Các tính năng khoa học tích hợp**:
  - Mặt màn phẳng bằng nhựa kỹ thuật màu trắng sữa hoặc kim loại phủ sơn mờ tĩnh điện chống phản xạ chói lóa.
  - Có vạch chia ô tọa độ lưới milimet mờ (lưới 5 mm × 5 mm) trên mặt hứng ảnh giúp đo trực tiếp chiều cao ảnh A'B' và độ phóng đại k.
  - Con trượt gắn ray có ốc hãm định vị, trượt êm dọc ray quang học khi tìm vị trí hứng ảnh thật sắc nét nhất.
  - Có thể quan sát ảnh rõ ràng từ góc nhìn chính diện (+Z) và cả mặt sau (-Z) khi dùng màn mờ bán truyền xạ.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `DIFFUSE_BLURRED`
* **Danh sách trạng thái khả dụng**: `DIFFUSE_BLURRED`, `SHARP_REAL_IMAGE`, `OUT_OF_FOCUS`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `DIFFUSE_BLURRED` | `SHARP_REAL_IMAGE` | Screen position matches d' | `|x_screen - x_expected| < 1 mm` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Độ phẳng bề mặt hứng ảnh < 0.1 mm
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0 mm vạch chia lưới tọa độ
* **Độ lặp lại phép đo**: Hình ảnh sắc nét viền rõ
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Ảnh không hiện trên màn do thấu kính phân kì** | Dùng thấu kính phân kì (f < 0) tạo ảnh ảo nằm phía trước thấu kính | Màn chắn đặt sau thấu kính không thể hứng được ảnh | `focalLength < 0` | Giải thích cho học sinh: Ảnh ảo không hứng được trên màn; chỉ quan sát được bằng mắt nhìn qua thấu kính |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Màn chắn hứng ảnh: Kích thước tối thiểu 80 × 100 mm màu trắng mờ, có đế gắn trên băng quang học. |
| **VietValue — Màn chắn quang học** | `vietvalue.edu.vn` | Màn hứng ảnh có vạch mm: Bề mặt sơn mờ chống lóa, thể hiện rõ nét ảnh thật của chữ F khi thấu kính hội tụ. |
| **Innotec Việt Nam** | `innotec.com.vn` | Màn hứng ảnh KHTN 9: Đồng trục quang học y = 125 mm, độ phẳng cao không cong vênh. |
| **Lời Giải Hay — Thực hành KHTN 9** | `loigiaihay.com` | Kỹ thuật tìm ảnh rõ nét trên màn: Di chuyển màn hứng ảnh dọc theo ray quang học đến khi thu được viền chữ F sắc nét nhất. |
| **Phywe Laboratory Equipment** | `phywe.com` | Translucent and Opaque Screen: 100x100 mm projection area on optical bench slider. |

---
