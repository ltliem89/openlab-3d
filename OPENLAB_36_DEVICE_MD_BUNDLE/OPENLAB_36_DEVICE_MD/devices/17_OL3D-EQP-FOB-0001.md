# 17. (2) Vật sáng bằng kính mờ hình chữ F

**Device ID:** `OL3D-EQP-FOB-0001`  
**Nhóm chức năng đề xuất:** `G06`  
**Tên tiếng Anh trong nguồn:** Chưa khai báo trong hồ sơ nguồn.  
**Archetype:** `frosted-f-object`  
**Slug:** `vat-sang-kinh-mo-chu-f`  
**Cấp trung thực ghi trong hồ sơ:** `L2`  
**Trạng thái thẩm định ghi trong hồ sơ:** `published` | Đo lường: `verified` ### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học * **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.3 trang 6 & Bài 8, 9 SGK KHTN 9 * **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ * **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (2): Vật sáng bằng kính mờ hình chữ F (**) * **Chức năng chuẩn**: Đóng vai trò vật sáng phẳng AB có hình dạng bất đối xứng (chữ F) để học sinh dễ dàng so sánh chiều cao, độ rõ nét và tính cùng chiều / ngược chiều của ảnh trên màn chắn (4). ### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js) * **Kích thước thực tế (mm)**: Rộng/Đường kính = 76 mm, Cao = 135 mm * **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.042 m, Cao (Y) = 0.135 m, Sâu (Z) = 0.078 m * **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass * **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$). * **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$). ### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR * **Các sub-mesh node con**: `body`, `scale_display`, `scale_display_rear`, `measurement_anchor` * **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial` * **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData * **Bảng chi tiết các mesh thành phần & shader**: | Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình | | :--- | :--- | :--- | :---: | :--- | | `body` | `Box Frame Slider` | MeshStandardMaterial (Black ABS) | 2 | Khung gắn ray quang học cữ đồng tâm y = 125mm | | `scale_display` | `PlaneGeometry` | MeshBasicMaterial (Frosted F Texture) | 4 | Tấm kính mờ tán xạ in chữ F đen sắc nét | ### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp * Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa. ### 6. Trạng thái Động & Bộ Điều khiển Tương tác * **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus` * **Thuộc tính đo lường / Khoa học**: - Khối lượng chuẩn ($m_{ref}$): **110 g** (Trạng thái: `verified`) ### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả * **Các phương trình vật lý áp dụng (MathType LaTeX)**: $$\mathbf{(1)}\quad h_{vật} = 20.0\text{ mm}, \quad w_{vật} = 12.0\text{ mm}, \quad \text{Nét} = 3.0\text{ mm}$$ *Ý nghĩa vật lý*: Kích thước tiêu chuẩn hình chữ F trên kính mờ. * **Các tính năng khoa học tích hợp**: - Chữ F được khắc laser chìm và phủ men đen trên nền kính mờ tán xạ trắng (hoặc tấm kim loại đột lỗ hình chữ F). - Hình dạng chữ F bất đối xứng theo cả hai trục đứng và ngang giúp học sinh dễ dàng nhận biết tính chất ảnh qua thấu kính: ảnh thật ngược chiều hay ảnh ảo cùng chiều. - Khung gá lắp con trượt đồng trục, cữ gắn đặt sát ngay trước cửa chiếu của hộp đèn Halogen để tạo vật sáng rõ nét. - Chịu được nhiệt lượng bức xạ từ đèn Halogen mà không bị biến dạng nhiệt hay ố mờ quang học. ### 8. Máy Trạng thái Động (Finite State Machine) * **Trạng thái khởi tạo**: `UNLIT` * **Danh sách trạng thái khả dụng**: `UNLIT`, `ILLUMINATED_BY_LAMP` * **Ma trận chuyển trạng thái (State Transitions)**: | Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) | | :--- | :--- | :--- | :--- | | `UNLIT` | `ILLUMINATED_BY_LAMP` | Lamp turned on in front | `lampLit == true` | ### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology * **Sai số dụng cụ (Instrumental Error)**: ±0.1 mm kích thước nét chữ F * **Độ chia nhỏ nhất / Độ phân giải**: Độ tương phản quang học > 90% * **Độ lặp lại phép đo**: 100% đối xứng quang học * **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Kính mờ chịu nhiệt tới 200°C ### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA) | Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động | | :--- | :--- | :--- | :--- | :--- | | **Đặt ngược mặt chữ F** | Gắn tấm kính mờ quay mặt sau ra trước | Chữ F bị lật ngang gương từ góc nhìn đèn | `Góc quay rotation.y != 0` | Xoay khung vật F hướng mặt trước chữ F thẳng về phía thấu kính (+Z) | ### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập | Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu | | :--- | :--- | :--- | | **SGK KHTN 9 Kết nối tri thức (Bài 8 & 9)** | `vietjack.com` | Vật sáng hình chữ F trên giá quang học dùng để khảo sát sự tạo ảnh thật/ảo và chiều của ảnh qua thấu kính. | | **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Vật sáng thí nghiệm: Tấm kính mờ in chữ F cao 20 mm có đế trượt trên băng quang học. | | **VietValue — Linh kiện Quang học** | `vietvalue.edu.vn` | Vật sáng chữ F có chân đế trượt: Kính mờ chịu nhiệt cao cấp, nét chữ F sắc sảo cho viền ảnh tương phản cao trên màn hứng. | | **Innotec Việt Nam** | `innotec.com.vn` | Khung giữ vật F có vạch chuẩn căn tâm quang học trùng tâm thấu kính và màn hứng ảnh. | | **Eisco Scientific** | `eiscolabs.com` | Object Slide "F" for Optics Bench: Clear asymmetrical letter on frosted background for real and virtual image observation. | ---

> **Phạm vi tài liệu:** Đây là đặc tả điều khiển chức năng đề xuất dựa trên hồ sơ thiết bị trong tài liệu Master Audit. Phần “Hồ sơ nguồn” ở cuối giữ nguyên nội dung thiết bị gốc để truy vết. Các điều khiển, quy trình và ca kiểm thử bổ sung là yêu cầu thiết kế để triển khai, không phải xác nhận rằng chức năng đã tồn tại hoặc đã chạy trong ứng dụng.

## 1. Vai trò và mục tiêu mô phỏng

Đóng vai trò vật sáng chuẩn hình chữ F để nhận biết chiều và kích thước ảnh.

## 2. Cấu hình kỹ thuật lấy từ hồ sơ nguồn

### 2.1. Kích thước và hình học

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 76 mm, Cao = 135 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.042 m, Cao (Y) = 0.135 m, Sâu (Z) = 0.078 m
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

- **Các trạng thái:** `UNLIT`, `ILLUMINATED_BY_LAMP`

## 3. Bộ phận và thao tác điều khiển cần triển khai

| Bộ phận / node | Chức năng | Thao tác học sinh | Phản hồi mô phỏng |
|---|---|---|---|
| body / object plate | Tấm vật sáng chữ F | Lắp vào đầu giá đèn; xoay/đổi hướng nếu cơ cấu cho phép. | Vật sáng có hướng xác định và độ cao chuẩn. |
| measurement_anchor | Mốc vật AB | Đo chiều cao vật và xác định hướng trước khi chiếu sáng. | Dùng làm cơ sở tính hệ số phóng đại ảnh. |

### 3.1. Quy tắc điều khiển

- Tương tác trên một bộ phận chỉ thay đổi đúng biến trạng thái mà bộ phận đó phụ trách.
- Phải hỗ trợ thao tác chuột và cảm ứng; vùng hitbox không được che các bộ phận điều khiển lân cận.
- Kéo/xoay liên tục phải có giới hạn hành trình, nấc hoặc góc quay theo cấu tạo thiết bị.
- Không cho người học nhập trực tiếp kết quả đo khi mục tiêu bài học là thực hành thao tác đo; số đo phải được tính từ trạng thái vật lý mô phỏng.
- Phải có nút hoặc thao tác đưa thiết bị về trạng thái ban đầu (Reset/Return to default) khi phù hợp.
- Mỗi bộ phận tương tác cần có hộp hướng dẫn khi hover/focus: ảnh minh họa đúng bộ phận, tên, chức năng, thao tác và lưu ý an toàn.

## 4. Quy trình thao tác chuẩn

1. Lắp vật chữ F vào gá đúng vị trí.
2. Căn tâm vật với trục quang học.
3. Chiếu sáng từ nguồn phù hợp.
4. Dùng thấu kính tạo ảnh trên màn.
5. So sánh chiều ảnh và chiều vật.

## 5. Chuỗi nhân quả và phản hồi bắt buộc

### 5.1. Phản hồi quan sát được

- Chữ F bất đối xứng giúp phân biệt ảnh thật ngược chiều và ảnh ảo cùng chiều.
- Vật sáng không tự thay đổi kích thước khi di chuyển.
- Ảnh trên màn phụ thuộc hệ quang học, không phụ thuộc hiệu ứng đồ họa độc lập.

### 5.2. Chuỗi xử lý chuẩn

`USER_ACTION → CONTROL_STATE → DEVICE_STATE → SCIENTIFIC_MODEL → VISUAL/READOUT_FEEDBACK → EVENT_LOG`

Mỗi bước phải được cập nhật từ cùng một state store của instance thiết bị. Không tạo hoạt ảnh và số đo độc lập với nhau.

## 6. Mô hình khoa học và giới hạn

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad h_{vật} = 20.0\text{ mm}, \quad w_{vật} = 12.0\text{ mm}, \quad \text{Nét} = 3.0\text{ mm}$$
  *Ý nghĩa vật lý*: Kích thước tiêu chuẩn hình chữ F trên kính mờ.
* **Các tính năng khoa học tích hợp**:
  - Chữ F được khắc laser chìm và phủ men đen trên nền kính mờ tán xạ trắng (hoặc tấm kim loại đột lỗ hình chữ F).
  - Hình dạng chữ F bất đối xứng theo cả hai trục đứng và ngang giúp học sinh dễ dàng nhận biết tính chất ảnh qua thấu kính: ảnh thật ngược chiều hay ảnh ảo cùng chiều.
  - Khung gá lắp con trượt đồng trục, cữ gắn đặt sát ngay trước cửa chiếu của hộp đèn Halogen để tạo vật sáng rõ nét.
  - Chịu được nhiệt lượng bức xạ từ đèn Halogen mà không bị biến dạng nhiệt hay ố mờ quang học.

**Nguyên tắc triển khai:** sử dụng phương trình và tham số nguồn đúng phạm vi đã khai báo. Không tự mở rộng mô hình ra ngoài điều kiện áp dụng. Phân biệt rõ giá trị `verified`, `reported`, `partially-verified` và thông số cần xác minh; không gắn nhãn đã kiểm chứng cho dữ liệu giả lập.

## 7. Máy trạng thái và điều kiện chuyển

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `UNLIT`
* **Danh sách trạng thái khả dụng**: `UNLIT`, `ILLUMINATED_BY_LAMP`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `UNLIT` | `ILLUMINATED_BY_LAMP` | Lamp turned on in front | `lampLit == true` |

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
| **Đặt ngược mặt chữ F** | Gắn tấm kính mờ quay mặt sau ra trước | Chữ F bị lật ngang gương từ góc nhìn đèn | `Góc quay rotation.y != 0` | Xoay khung vật F hướng mặt trước chữ F thẳng về phía thấu kính (+Z) |

Yêu cầu giao diện lỗi:
- Nêu rõ nguyên nhân, bộ phận liên quan và điều kiện đang vi phạm.
- Chỉ dẫn cách khắc phục cụ thể.
- Không tự xóa lỗi nếu điều kiện vật lý chưa được khôi phục.
- Ghi nhận lỗi vào nhật ký phiên thực hành.

## 10. Ca kiểm thử nghiệm thu riêng cho thiết bị

- [ ] **OL3D-EQP-FOB-0001-T01:** Bật nguồn sáng: hình F được chiếu rõ.
- [ ] **OL3D-EQP-FOB-0001-T02:** Đặt lệch trục: ảnh lệch tương ứng.
- [ ] **OL3D-EQP-FOB-0001-T03:** Đảo hướng vật: hướng ảnh thay đổi theo hệ quang học.

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

## 4.17. [OL3D-EQP-FOB-0001] (2) Vật sáng bằng kính mờ hình chữ F
**Tên tiếng Anh**: *(2) Frosted Glass Letter-F Luminous Object on Rider* | **Mã Archetype**: `frosted-f-object` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-FOB-0001`
* **Mã đường dẫn (Slug)**: `vat-sang-kinh-mo-chu-f`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.3 trang 6 & Bài 8, 9 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ
* **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (2): Vật sáng bằng kính mờ hình chữ F (**)
* **Chức năng chuẩn**: Đóng vai trò vật sáng phẳng AB có hình dạng bất đối xứng (chữ F) để học sinh dễ dàng so sánh chiều cao, độ rõ nét và tính cùng chiều / ngược chiều của ảnh trên màn chắn (4).

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 76 mm, Cao = 135 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.042 m, Cao (Y) = 0.135 m, Sâu (Z) = 0.078 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `scale_display_rear`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Box Frame Slider` | MeshStandardMaterial (Black ABS) | 2 | Khung gắn ray quang học cữ đồng tâm y = 125mm |
| `scale_display` | `PlaneGeometry` | MeshBasicMaterial (Frosted F Texture) | 4 | Tấm kính mờ tán xạ in chữ F đen sắc nét |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **110 g** (Trạng thái: `verified`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad h_{vật} = 20.0\text{ mm}, \quad w_{vật} = 12.0\text{ mm}, \quad \text{Nét} = 3.0\text{ mm}$$
  *Ý nghĩa vật lý*: Kích thước tiêu chuẩn hình chữ F trên kính mờ.
* **Các tính năng khoa học tích hợp**:
  - Chữ F được khắc laser chìm và phủ men đen trên nền kính mờ tán xạ trắng (hoặc tấm kim loại đột lỗ hình chữ F).
  - Hình dạng chữ F bất đối xứng theo cả hai trục đứng và ngang giúp học sinh dễ dàng nhận biết tính chất ảnh qua thấu kính: ảnh thật ngược chiều hay ảnh ảo cùng chiều.
  - Khung gá lắp con trượt đồng trục, cữ gắn đặt sát ngay trước cửa chiếu của hộp đèn Halogen để tạo vật sáng rõ nét.
  - Chịu được nhiệt lượng bức xạ từ đèn Halogen mà không bị biến dạng nhiệt hay ố mờ quang học.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `UNLIT`
* **Danh sách trạng thái khả dụng**: `UNLIT`, `ILLUMINATED_BY_LAMP`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `UNLIT` | `ILLUMINATED_BY_LAMP` | Lamp turned on in front | `lampLit == true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.1 mm kích thước nét chữ F
* **Độ chia nhỏ nhất / Độ phân giải**: Độ tương phản quang học > 90%
* **Độ lặp lại phép đo**: 100% đối xứng quang học
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Kính mờ chịu nhiệt tới 200°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Đặt ngược mặt chữ F** | Gắn tấm kính mờ quay mặt sau ra trước | Chữ F bị lật ngang gương từ góc nhìn đèn | `Góc quay rotation.y != 0` | Xoay khung vật F hướng mặt trước chữ F thẳng về phía thấu kính (+Z) |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **SGK KHTN 9 Kết nối tri thức (Bài 8 & 9)** | `vietjack.com` | Vật sáng hình chữ F trên giá quang học dùng để khảo sát sự tạo ảnh thật/ảo và chiều của ảnh qua thấu kính. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Vật sáng thí nghiệm: Tấm kính mờ in chữ F cao 20 mm có đế trượt trên băng quang học. |
| **VietValue — Linh kiện Quang học** | `vietvalue.edu.vn` | Vật sáng chữ F có chân đế trượt: Kính mờ chịu nhiệt cao cấp, nét chữ F sắc sảo cho viền ảnh tương phản cao trên màn hứng. |
| **Innotec Việt Nam** | `innotec.com.vn` | Khung giữ vật F có vạch chuẩn căn tâm quang học trùng tâm thấu kính và màn hứng ảnh. |
| **Eisco Scientific** | `eiscolabs.com` | Object Slide "F" for Optics Bench: Clear asymmetrical letter on frosted background for real and virtual image observation. |

---
