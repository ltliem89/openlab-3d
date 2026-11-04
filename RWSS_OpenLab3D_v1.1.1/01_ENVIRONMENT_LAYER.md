# RWSS v1.1 — LAYER 01: ENVIRONMENT
## Tiêu chuẩn môi trường mô phỏng cho OpenLab 3D

- **Mã tiêu chuẩn:** `RWSS-OL3D-ENV-001`
- **Phiên bản:** 1.1
- **Phạm vi ưu tiên:** Phòng thí nghiệm KHTN 3D, bàn thí nghiệm, ray quang học, vùng đặt dụng cụ, chất lỏng, đường truyền ánh sáng và vùng gia nhiệt.
- **Vai trò:** Mô tả không gian và điều kiện vật lý mà thiết bị trong OpenLab tồn tại, được đặt vào, di chuyển và chịu tác động.
- **Nguồn căn cứ:** `BAO_CAO_RA_SOAT_CHUC_NANG_THUC_TE_THIET_BI_OPENLAB3D.md` do người dùng cung cấp. Báo cáo nêu phạm vi rà soát 34 archetype và các chức năng được ghi nhận trong mã nguồn `ProceduralLabModels.ts`, `LabViewport3D.tsx`, `App.tsx`, `HtmlEquipmentModuleRegistry.ts`, `mockCatalog.ts`.

---

## 1. Mục đích và nguyên tắc thiết kế

Environment Layer không phải là hình nền 3D. Đây là lớp dữ liệu và điều kiện vận hành xác định **vật thể đang ở đâu, trong môi trường nào, chịu điều kiện gì và tương tác với những ranh giới nào**.

OpenLab phải tuân thủ các nguyên tắc sau:

1. Môi trường phải có hệ tọa độ, tỷ lệ, đơn vị và ranh giới xác định.
2. Mặt bàn, ray, giá đỡ, bình chứa, chất lỏng, vùng ánh sáng và vùng gia nhiệt phải được phân biệt theo vai trò; không gộp tất cả thành mesh trang trí.
3. Môi trường cung cấp điều kiện cho Object Layer và Interaction Layer; không tự ý chứa logic riêng trùng với logic của thiết bị.
4. Các thông số chưa có căn cứ phải được đánh dấu `unknown`, `not_configured` hoặc `requires_measurement`; không tự điền số liệu để làm cho mô phỏng có vẻ chân thực.
5. Hiển thị 3D phải phản ánh trạng thái môi trường được tính toán; không dùng animation độc lập để giả lập kết quả vật lý.
6. Chỉ bật mô hình môi trường phù hợp với thí nghiệm. Không bắt buộc một cảnh phải mô phỏng mọi trường vật lý.

### 1.1. Phân biệt bối cảnh, môi trường vật lý và vật chứa

- **Scene / Workspace:** Phòng thí nghiệm, bàn, sàn, kệ, vùng thao tác và hệ tọa độ.
- **Support / Boundary:** Mặt bàn, ray quang học, giá đỡ, mặt tựa, thành bình, miệng bình, rãnh trượt.
- **Medium / Field:** Không khí, nước, chất lỏng, trường hấp dẫn, trường ánh sáng, trường nhiệt hoặc trường điện từ khi bài thí nghiệm yêu cầu.
- **Container Object:** Cốc, ống đong, bình tràn, bình tam giác, phễu chiết. Vật chứa là một vật thể; chất lỏng bên trong có trạng thái môi trường/vật chất riêng.
- **Visual Decoration:** Nhãn, màu nền, tường và trang trí không có tác dụng vật lý. Thành phần này không được tham gia tính toán nếu chưa được định nghĩa rõ.

---

## 2. Mô hình môi trường chuẩn của OpenLab

### 2.1. Laboratory Workspace

Workspace tối thiểu phải khai báo:

| Thuộc tính | Ý nghĩa | Quy tắc |
|---|---|---|
| `workspaceId` | ID không gian | Duy nhất trong scene |
| `coordinateSystem` | Hệ tọa độ | Quy định trục, chiều dương và gốc |
| `unitSystem` | Hệ đơn vị | SI làm hệ chuẩn; cho phép hiển thị cm, mm, ml, g nếu có quy đổi |
| `worldScale` | Quy đổi đơn vị vật lý sang đơn vị scene | Phải thống nhất toàn dự án và có test |
| `gravityVector` | Vector trọng trường | Có thể cấu hình theo thí nghiệm; không được nhầm hướng trục scene với hướng trọng lực |
| `surfaces` | Mặt bàn, sàn, mặt đỡ | Khai báo kích thước, vị trí, va chạm và khả năng đỡ vật |
| `zones` | Vùng thao tác | Ví dụ: vùng cân, vùng rót, vùng quang học, vùng gia nhiệt |
| `bounds` | Ranh giới workspace | Xác định giới hạn đặt/kéo vật và xử lý rơi ra ngoài |

**Không được suy đoán `worldScale` hoặc hướng trục hiện tại.** AI phải đọc cấu hình và mã nguồn hiện có trước khi thay đổi.

### 2.2. Môi trường bàn thí nghiệm và vùng đặt thiết bị

Các vùng thao tác phải có semantic role, không chỉ dựa vào vị trí mesh:

- `workbench_surface`: mặt bàn có thể đỡ vật.
- `storage_zone`: vùng kệ/khay chứa thiết bị.
- `measurement_zone`: vùng cân, đo kích thước hoặc đo lực.
- `fluid_zone`: vùng thao tác với cốc, ống đong, bình tràn.
- `heating_zone`: vùng đặt nguồn nhiệt và vật nhận nhiệt.
- `optical_axis_zone`: vùng ray quang học và đường truyền tia.
- `assembly_zone`: vùng lắp ráp linh kiện hoặc thiết bị.

Zone chỉ được kích hoạt khi có dữ liệu và tương tác tương ứng. Không được tạo collider toàn cục khiến các đối tượng không liên quan bị chặn.

### 2.3. Môi trường ray quang học

Báo cáo ghi nhận ray quang học dài **100 cm**, có vạch milimet, các con trượt đồng trục; hệ thống khóa cao độ quang trục tại `y = 0.125 m` và giới hạn chuyển động dọc ray theo 1 bậc tự do. Đây là cấu hình thiết bị đang được báo cáo ghi nhận, không phải giá trị mặc định cho mọi ray hoặc mọi workspace.

Yêu cầu:

- Ray phải có chiều dài, hệ tọa độ cục bộ, trục trượt và vùng giới hạn.
- Mỗi carriage phải khai báo điểm docking và bậc tự do được phép.
- Đèn, vật F, giá thấu kính và màn chắn chỉ được khóa lên ray nếu đúng loại interface.
- Khi đã docking, chuyển động phải bị giới hạn theo constraint; không được chỉ dùng hiệu ứng hút hình ảnh.
- Đường truyền ánh sáng là miền truyền tia độc lập; tia chỉ tương tác với vật quang học khi giao cắt bề mặt quang học.

### 2.4. Môi trường chất lỏng và vật chứa

OpenLab hiện có các ngữ cảnh chất lỏng gắn với ống đong 100 ml, cốc 250 ml, bình tràn Eureka ngưỡng 210 ml, bình cấp nước 1000 ml và phễu chiết.

Environment Layer phải cung cấp trạng thái chất lỏng tối thiểu:

- `fluidId`, `phase`, `volume`, `temperature` (nếu có), `density` (nếu có căn cứ), `containerId`, `freeSurfaceState`.
- Quan hệ giữa thể tích, hình học lòng bình và cao độ mặt thoáng.
- Thành bình, miệng bình, vòi tràn, vòi rót và vùng nhận chất lỏng.
- Mặt khum và hướng mặt thoáng khi nghiêng phải lấy dữ liệu từ trạng thái chất lỏng và tư thế vật chứa.
- Bảo toàn thể tích trong thao tác rót/tràn, trừ phần thất thoát được mô hình hóa rõ.

Không mặc định mọi chất lỏng là nước. Không mặc định mọi bình có cùng tiết diện. Không dùng một hàm tuyến tính chung cho mọi vật chứa nếu hình học không chứng minh được quan hệ tuyến tính.

### 2.5. Môi trường ánh sáng và quang học

Môi trường quang học cần khai báo:

- Miền truyền tia và hệ tọa độ quang học.
- Môi trường truyền trước/sau bề mặt: không khí, thủy tinh hoặc môi trường khác được định nghĩa.
- Nguồn sáng: trạng thái nguồn, chế độ tia, hướng, phổ/bước sóng nếu có dữ liệu.
- Bề mặt quang học: vị trí, pháp tuyến, hình dạng, chiết suất hoặc profile vật liệu.
- Các vùng quan sát: màn chắn, mặt nhận ảnh và thước đo.

Báo cáo ghi nhận đèn quang học có sáu chế độ chùm tia; lăng kính độc lập với tia sáng và chỉ khúc xạ/tán sắc khi tia tương tác với nó. Vì vậy, không được gắn tia giả cố định vào lăng kính hoặc thấu kính.

### 2.6. Môi trường nhiệt

Khu vực gia nhiệt phải mô hình hóa nguồn nhiệt, vật nhận nhiệt và đường truyền năng lượng. Báo cáo ghi nhận đèn cồn có ngọn lửa 3D và tác động làm tăng nhiệt độ chất lỏng.

Yêu cầu:

- Nguồn nhiệt có trạng thái bật/tắt và thông số công suất/nhiệt truyền nếu được xác định.
- Vật nhận nhiệt có khối lượng, nhiệt dung riêng hoặc một mô hình nhiệt tương ứng khi cần tính định lượng.
- Nhiệt độ vật nhận phải được tính từ mô hình năng lượng; không chỉ thay đổi màu hoặc tăng số theo timer.
- Nếu chỉ mô phỏng định tính, phải gắn nhãn rõ `qualitative_model` và không công bố kết quả định lượng.

---

## 3. Mẫu cấu trúc dữ liệu Environment

Đây là schema định hướng. AI phải ánh xạ vào cấu trúc hiện có trước khi tạo schema mới.

```yaml
environment:
  id: ENV_LAB_MAIN
  type: laboratory_workspace
  coordinate_system:
    handedness: defined_in_project
    up_axis: defined_in_project
    unit: meter
    world_scale: verified_from_source
  gravity:
    enabled: true
    vector: configurable
    source: experiment_profile
  boundaries:
    surfaces: []
    zones: []
    collision_policy: explicit
  media:
    fluids: []
    optical_media: []
    thermal_regions: []
  initial_conditions: {}
  boundary_conditions: {}
  uncertainty: documented_or_unknown
  provenance:
    source: project_or_reference
    verified: false
```

### 3.1. Trạng thái dữ liệu hợp lệ

Mọi tham số quan trọng phải thuộc một trong các trạng thái:

- `verified`: có căn cứ từ mã nguồn, tài liệu thiết bị hoặc phép đo.
- `configured`: do bài thí nghiệm hoặc người dùng khai báo.
- `derived`: được tính từ tham số đã xác định, có ghi công thức.
- `unknown`: chưa có căn cứ.
- `not_applicable`: không áp dụng cho môi trường này.

Không cho phép AI tự chuyển `unknown` thành giá trị số mà không nêu nguồn và lý do.

---

## 4. Ràng buộc và tương tác do Environment Layer cung cấp

Environment Layer sở hữu:

1. Hệ tọa độ, scale, ranh giới scene.
2. Các mặt đỡ, mặt tiếp xúc, ray, vùng lắp ráp và vùng thao tác.
3. Các miền môi trường như chất lỏng, môi trường quang học, vùng nhiệt khi được cấu hình.
4. Điều kiện ban đầu và điều kiện biên.
5. Trạng thái môi trường có thể thay đổi theo thời gian.

Environment Layer **không sở hữu**:

- Khối lượng, vật liệu hoặc cổng kết nối của thiết bị (Object Layer sở hữu).
- Công thức đo của cân, lực kế, ống đong hoặc quy tắc nối dây cụ thể (Interaction Layer sở hữu hoặc gọi module chuyên ngành).
- Canvas texture, màu sắc và animation hiển thị (Presentation layer sở hữu).

---

## 5. Kiểm thử môi trường bắt buộc

| ID | Kiểm thử | Kết quả cần đạt |
|---|---|---|
| ENV-T01 | Kiểm tra quy đổi scene/physical unit | Vật có kích thước khai báo phải hiển thị đúng tỷ lệ; sai lệch được đo và ghi nhận |
| ENV-T02 | Đặt vật lên mặt bàn | Vật tiếp xúc mặt bàn, không xuyên qua hoặc nổi không có lý do |
| ENV-T03 | Docking lên ray quang học | Chỉ chuyển động theo bậc tự do ray cho phép; giữ trục quang học theo profile ray |
| ENV-T04 | Nghiêng ống đong | Mặt thoáng phản ánh hướng trọng lực; không chỉ xoay cùng thân bình |
| ENV-T05 | Đổ/thả vật vào bình | Mực chất lỏng và thể tích thay đổi theo hình học và thể tích được chuyển |
| ENV-T06 | Bình tràn | Chỉ phát sinh tràn khi điều kiện ngưỡng tràn được thỏa mãn |
| ENV-T07 | Đường truyền quang | Tia truyền qua môi trường; chỉ đổi hướng khi gặp bề mặt/môi trường có tương tác |
| ENV-T08 | Gia nhiệt | Môi trường/vật nhận nhiệt chỉ thay đổi theo mô hình nhiệt đang bật |

Mỗi test phải lưu đầu vào, trạng thái ban đầu, kết quả mong đợi, kết quả chạy thực tế và sai lệch. Không đặt tolerance tùy ý; tolerance phải lấy từ độ chia dụng cụ, tài liệu thiết bị hoặc quy ước kiểm định có ghi nguồn.

---

## 6. Thứ tự ưu tiên triển khai trong OpenLab

### P0 — Không phá vỡ nền tảng hiện tại

- Đọc hệ tọa độ, scale và cơ chế collision đang có.
- Ánh xạ mặt bàn, ray quang học, vùng cân, vùng chất lỏng và vùng gia nhiệt.
- Giữ nguyên các hành vi đã chạy trong báo cáo.

### P1 — Chuẩn hóa môi trường hiện hữu

- Đưa các tham số môi trường về profile có ID.
- Tách mặt nền, miền chất lỏng, miền ánh sáng và vùng nhiệt khỏi mesh trang trí.
- Bổ sung provenance và trạng thái dữ liệu.

### P2 — Mở rộng có kiểm chứng

- Cho phép tái sử dụng một profile môi trường ở nhiều bài thực hành.
- Thêm kiểm thử môi trường và kiểm thử hồi quy.
- Chỉ mở rộng sang môi trường ngoài phòng thí nghiệm khi có use case và dữ liệu cụ thể.

---

## 7. Điều kiện nghiệm thu Environment Layer

Environment Layer chỉ được coi là tích hợp đạt khi:

- Không làm sai hệ tọa độ, scale hoặc vị trí thiết bị hiện hữu.
- Các vùng thao tác và bề mặt có semantic role rõ.
- Các môi trường chất lỏng, quang học, nhiệt có trạng thái độc lập với phần hiển thị.
- Môi trường tác động lên vật thể qua API hoặc state contract có thể kiểm thử.
- Không có giá trị quan trọng tự bịa; nguồn và trạng thái dữ liệu được thể hiện.
- Các kiểm thử ENV-T01 đến ENV-T08 được chạy hoặc được đánh dấu `blocked` kèm nguyên nhân.

**Nguyên tắc khóa:** Môi trường không phải phông nền. Nó là điều kiện vật lý và ranh giới mà thiết bị OpenLab phải tuân theo.
