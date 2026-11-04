# EQUIPMENT CONTROL ARCHITECTURE — SHARED SPECIFICATION

## 1. Nguyên tắc

Thiết bị không phải mô hình 3D tĩnh. Từng part điều khiển phải gắn với một biến trạng thái và luật vật lý cụ thể. Hệ thống cần phân biệt: (a) thao tác người dùng, (b) trạng thái cơ cấu, (c) trạng thái khoa học, (d) kết quả hiển thị.

## 2. Phân lớp

1. **Geometry/Presentation:** mesh, named nodes, vật liệu, anchor, hitbox.
2. **Technical Metadata:** kích thước, vật liệu, dải đo, ĐCNN, dung sai, đơn vị, trạng thái xác minh.
3. **Behavior/Capabilities:** điều khiển, hành vi, công thức, FSM, guards, lỗi.
4. **Scene Instance:** vị trí, góc, kết nối, trạng thái riêng của instance.
5. **Feedback & Learning UI:** số đo, tooltip, hướng dẫn, log, đánh giá thao tác.

Bốn lớp đầu kế thừa cấu trúc hiện hành; lớp thứ năm là lớp trình bày/đánh giá phụ trợ, không phá hợp đồng module hiện có.

## 3. Chu trình nhân quả bắt buộc

`Pointer/Touch → Part Handler → Control Value → Device State → Scientific Model → Mesh/Readout Update → Event Log`

- Không có đường tắt “nút bấm → đổi số hiển thị” nếu không đi qua mô hình khoa học.
- Cập nhật 3D và số đo phải đọc cùng một state snapshot.
- Mỗi lần thay đổi cần xác định `sourceEvent`, `partId`, `oldValue`, `newValue`, `timestamp`, `simulationTime`.

## 4. Các loại điều khiển chuẩn

| Control type | Hành vi | Tham số bắt buộc |
|---|---|---|
| `button` | Sự kiện nhấn tức thời | action, guard, feedback |
| `switch` | Bật/tắt hai trạng thái | on/off, interlock |
| `dial` | Xoay theo nấc | min/max, detents, currentIndex |
| `rotary` | Xoay liên tục | axis, min/max angle, sensitivity |
| `slider` | Trượt liên tục hoặc theo bước | min/max, step, unit |
| `linear` | Trượt cơ học theo trục | axis, travel, hard stops |
| `drag` | Cầm/nâng/đặt vật | grab anchor, collision, snap rules |
| `readout` | Hiển thị, không nhận nhập số đo | data binding, unit, formatting |

## 5. Device Control Profile

```ts
interface DeviceControlProfile {
  deviceId: string;
  archetype: string;
  parts: Array<{
    partId: string;
    nodeName: string;
    role: string;
    controlType?: 'button'|'switch'|'dial'|'rotary'|'slider'|'linear'|'drag'|'readout';
    limits?: { min?: number; max?: number; step?: number; unit?: string };
    axis?: 'x'|'y'|'z';
    defaultValue?: number|boolean|string;
    guards?: string[];
    helpId: string;
  }>;
  stateSchema: Record<string, unknown>;
  transitions: Array<{ from: string; event: string; to: string; guard?: string }>;
  equations: string[];
  outputs: string[];
  safetyRules: string[];
  tests: string[];
}
```

## 6. Cơ chế tương tác thực tế

- **Cơ học:** trục quay, ray trượt, giới hạn cứng, va chạm, lực cản/ma sát khi có căn cứ.
- **Đo lường:** đo từ vị trí/đầu dò/loadcell/điện áp; không nhập đáp số trực tiếp.
- **Chất lỏng:** bảo toàn thể tích, dòng chảy, mặt thoáng, mặt khum, phân lớp khi có mô hình.
- **Quang học:** tia theo định luật phản xạ/khúc xạ, tiêu cự, khoảng cách, trường nhìn, defocus.
- **Điện:** mạch kín, phân cực, giá trị nguồn/tải, quá tải và ngắn mạch.
- **Nhiệt:** năng lượng truyền, nhiệt dung, độ trễ, bay hơi/ngưng tụ theo điều kiện mô hình.
- **Sinh học:** mẫu vật có kích thước/cấu trúc, giới hạn phân giải, chuyển động chỉ khi có dữ liệu phù hợp.

## 7. State và FSM

Mỗi thiết bị có FSM riêng. Thiết bị thụ động không cần ép vào các trạng thái `ON/OFF`. Ví dụ vật rắn có `AVAILABLE/HELD/PLACED/MEASURED`; cân có `IDLE/SETTLING/STABLE/OVERLOAD`; buret có `CLOSED/OPEN/EMPTY`.

Mọi transition phải có trigger và guard condition; thao tác không hợp lệ phải phản hồi rõ và không được silently ignored.

## 8. Tooltip/Help Card

Mỗi part có `helpId` ánh xạ tới nội dung:
- Ảnh/crop chính xác bộ phận.
- Tên và chức năng.
- Cách thao tác.
- Phản hồi dự kiến.
- Sai lầm thường gặp.
- Cảnh báo an toàn.

Desktop: hover/focus. Touch: tap. Card phải xử lý z-index, overflow, viewport edge và keyboard Escape. Giữ phong cách Glassmorphism theo UI gốc của OpenLab; không thay bằng một dòng text.

## 9. Interlocks và an toàn

- Các ngưỡng phải đến từ thông số thiết bị đã xác minh hoặc được đánh dấu là giả định mô phỏng.
- Không tự phục hồi lỗi khi nguyên nhân còn tồn tại.
- Mọi sự cố phải có mã lỗi, điều kiện kích hoạt, phản hồi và quy trình reset.
- Thí nghiệm quang học/điện/nhiệt/hóa học cần cảnh báo an toàn theo bối cảnh.

## 10. Kiểm thử kỹ thuật

- Unit tests cho phương trình và guard.
- Component tests cho từng part handler.
- Integration tests cho các thiết bị nối nhau.
- Visual tests cho mesh, tooltip, readout.
- Regression tests cho các chức năng cũ.
- Performance tests cho FPS, GPU memory, listener disposal.

## 11. Tương thích kiến trúc hiện hành

Giữ `window.OL3D_EQUIPMENT_MODULE`, `buildEquipmentMesh`, `updateEquipmentState`, `playEquipmentSound`, `buildEquipmentGroup` (alias) và `applyEquipmentState`. Không tạo thêm Scene/Renderer cho từng thiết bị. Mọi texture động cần tái sử dụng và dispose đúng vòng đời.
