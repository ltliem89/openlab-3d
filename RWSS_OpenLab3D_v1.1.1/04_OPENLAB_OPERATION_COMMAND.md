# OPENLAB 3D — RWSS v1.1 OPERATION COMMAND
## Lệnh điều hành AI để rà soát, tích hợp và cải tiến theo 3 lớp

**Dùng sau khi đặt ba file tiêu chuẩn vào** `docs/standards/RWSS/`:

- `01_ENVIRONMENT_LAYER.md`
- `02_OBJECT_LAYER.md`
- `03_INTERACTION_LAYER.md`

**Báo cáo căn cứ:** `BAO_CAO_RA_SOAT_CHUC_NANG_THUC_TE_THIET_BI_OPENLAB3D.md`

---

**Tiêu chí nghiệm thu lắp ráp bổ sung bắt buộc:** `docs/standards/RWSS/05_ASSEMBLY_ACCEPTANCE_CRITERIA.md`.

## 1. Lệnh điều hành chính

Sao chép toàn bộ prompt dưới đây và gửi cho AI coding agent đang mở đúng repository OpenLab 3D.

```text
ROLE: OPENLAB 3D PRINCIPAL SIMULATION ENGINEER
TASK: AUDIT AND INTEGRATE RWSS v1.1 — ENVIRONMENT / OBJECT / INTERACTION

MỤC TIÊU
Nâng cấp OpenLab 3D theo bộ tiêu chuẩn RWSS v1.1 được lưu trong:
- docs/standards/RWSS/01_ENVIRONMENT_LAYER.md
- docs/standards/RWSS/02_OBJECT_LAYER.md
- docs/standards/RWSS/03_INTERACTION_LAYER.md

Tài liệu căn cứ chức năng hiện hữu:
- BAO_CAO_RA_SOAT_CHUC_NANG_THUC_TE_THIET_BI_OPENLAB3D.md

ƯU TIÊN CAO NHẤT
1. Giữ nguyên toàn bộ hành vi đang hoạt động tốt.
2. Không viết lại kiến trúc hoặc thay renderer chỉ vì muốn chuẩn hóa.
3. Không thay mesh, kích thước, tọa độ, connector hoặc thuật toán hiện hữu nếu chưa truy được nguồn và chưa có regression test.
4. Cải tiến dựa trên code đang chạy, không dựa trên mô tả tiếp thị hoặc suy đoán.
5. Phân biệt rõ: đã có trong code / có một phần / chỉ là hình ảnh / chưa có / chưa xác minh.

PHẠM VI CODE CẦN KHẢO SÁT
Đọc tối thiểu các file được báo cáo nêu:
- ProceduralLabModels.ts
- LabViewport3D.tsx
- App.tsx
- HtmlEquipmentModuleRegistry.ts
- mockCatalog.ts

Đồng thời tìm các type, hooks, stores, physics/interaction helpers, asset registry, tests và package scripts thực sự liên quan. Không giới hạn kiểm tra ở năm file trên nếu dependency cho thấy logic nằm nơi khác.

GIAI ĐOẠN 0 — AN TOÀN VÀ BASELINE
- Xác nhận đúng repository và branch.
- Kiểm tra git status; không ghi đè thay đổi chưa commit của người dùng.
- Không xóa file hoặc reset code.
- Xác định lệnh typecheck, build và test từ package.json.
- Chạy baseline hiện tại và lưu log.
- Nếu baseline đang lỗi, phân biệt lỗi có sẵn với lỗi do thay đổi mới.

GIAI ĐOẠN 1 — ĐỌC TIÊU CHUẨN VÀ RÀ SOÁT THỰC TẾ
Đọc đầy đủ ba file RWSS, `05_ASSEMBLY_ACCEPTANCE_CRITERIA.md` và báo cáo rà soát.
Lập bảng cho từng archetype:
- archetypeId / assetId / source file
- mesh/model hiện có
- physical properties có bằng chứng
- ports/anchors/docking points
- runtime state
- interactions đang chạy
- measurement/solver hiện có
- tests hiện có
- evidence status: VERIFIED / PARTIAL / VISUAL_ONLY / MISSING / UNKNOWN

Không kết luận toàn bộ 34 archetype đã được chuẩn hóa nếu chưa liệt kê đủ từ registry/catalog và đối chiếu code.
Không tự tạo asset ID cho đối tượng thiếu ID.

GIAI ĐOẠN 2 — TẠO HỒ SƠ GAP VÀ KẾ HOẠCH
Tạo hoặc cập nhật:
1. docs/standards/RWSS/OPENLAB_RWSS_COMPLIANCE_MATRIX.md
2. docs/standards/RWSS/OPENLAB_RWSS_GAP_REPORT.md
3. docs/standards/RWSS/OPENLAB_RWSS_IMPLEMENTATION_PLAN.md

Mỗi gap phải có:
- bằng chứng file/function/line hoặc test;
- tác động đến hành vi thực tế;
- rủi ro regression;
- đề xuất nhỏ nhất có thể;
- cách kiểm thử trước/sau;
- thứ tự ưu tiên P0/P1/P2.

Không code trước khi có bản đồ hiện trạng và kế hoạch. Không dừng lại ở tài liệu: sau khi hoàn tất đánh giá, tiếp tục triển khai các mục P0/P1 an toàn trong cùng nhiệm vụ nếu không cần quyết định nghiệp vụ từ người dùng.

GIAI ĐOẠN 3 — TÍCH HỢP ENVIRONMENT LAYER
Chuẩn hóa và kiểm tra:
- coordinate system, world scale, units;
- workbench, support surfaces, collision boundaries;
- optical bench và 1D rail constraints;
- liquid/container contexts;
- optical propagation regions;
- thermal regions khi có mô hình nhiệt.

Không tạo môi trường giả chỉ để đạt checklist. Không tự đặt gravity, density, dimensions hoặc tolerance nếu source chưa xác nhận. Giá trị chưa có phải ghi UNKNOWN và không dùng trong kết quả định lượng.

GIAI ĐOẠN 4 — TÍCH HỢP OBJECT LAYER
Đối với từng archetype/asset:
- chuẩn hóa identity và profile;
- tách geometry, physical properties, functional state, measurement state, visual state;
- xác định connector/anchor/interaction handles;
- khai báo đơn vị, nguồn và trạng thái xác minh của dữ liệu;
- giữ nguyên catalog/registry hiện hành hoặc cung cấp adapter có test.

Không nhân bản model hoặc tạo catalog thứ hai không đồng bộ.
Không lấy màu vật liệu thay cho thuộc tính vật lý.
Không gán connector chỉ vì hai mesh ở gần nhau.

GIAI ĐOẠN 5 — TÍCH HỢP INTERACTION LAYER
Ưu tiên các luồng đã có trong báo cáo:
1. Cân điện tử, load-cell raycast, tare và tổng khối lượng.
2. Khối lượng riêng, vật rắn, displacement và bình tràn.
3. Rót chất lỏng và bảo toàn thể tích.
4. Docking bình cấp nước và các dụng cụ.
5. Vernier caliper và spring dynamometer.
6. Optical supply ↔ optical lamp interlock.
7. Optical bench docking và giới hạn 1D.
8. Optical ray ↔ lens/prism/object/screen.
9. Induction coil ↔ magnet ↔ LED/galvanometer/DMM.
10. Microscope/objective/specimen và các hành vi sinh học đã có.
11. Nghiệm thu assembly theo `05_ASSEMBLY_ACCEPTANCE_CRITERIA.md`, tối thiểu ASM-01…ASM-24 cho các luồng áp dụng.

Với chức năng lắp ráp, bắt buộc kiểm tra riêng:
- đúng instance/hit area và connector/anchor;
- compatibility theo loại, kích thước, hướng, cực tính/giao thức khi có căn cứ;
- snap/alignment theo tolerance từng interface, không đặt ngưỡng chung;
- constraint và bậc tự do sau docking;
- va chạm, xuyên lấn, cổng bận và thao tác sai;
- attach/detach, phục hồi sau hủy thao tác, không còn edge/constraint mồ côi;
- trạng thái chức năng sau lắp và regression của luồng hiện hữu.

Mỗi tương tác phải có:
- preconditions;
- input;
- governing model hoặc quy tắc đã công bố;
- authoritative state;
- output;
- invalid state và feedback;
- reset behavior;
- automated/manual test.

Không dùng animation để thay phép tính. Tách physics time và animation time. Renderer phải đọc state đã tính.

GIAI ĐOẠN 6 — KIỂM THỬ KHOA HỌC VÀ HỒI QUY
Bổ sung test theo ba lớp và bộ nghiệm thu lắp ráp:
- Assembly acceptance: chạy ASM-01…ASM-24 theo `05_ASSEMBLY_ACCEPTANCE_CRITERIA.md`; ghi PASS/FAIL/BLOCKED/NOT_APPLICABLE kèm bằng chứng.
- ENV tests: scale, boundary, support, rail, fluid surface, optical medium, thermal context.
- OBJ tests: identity, dimensions, units, mass/material, ports, profile state, catalog mapping.
- INT tests: correct assembly, wrong assembly, docking, measurement, volume transfer, power interlock, optical paths, induction response.

Dùng số liệu trong báo cáo làm regression fixtures khi đúng với code hiện hành, ví dụ:
- Cân: R <= 0.065 m, ĐCNN 0.1 g, giới hạn 2000 g.
- Quả cân: 100/200/500 g; trường hợp 200 g và P xấp xỉ 1.96 N theo g được dùng trong profile báo cáo.
- Khẩu độ ống đong: 28 mm.
- Ống đong: 100 ml, ĐCNN 1 ml.
- Bình tràn: ngưỡng 210 ml.
- Thước cặp: 0–150 mm, ĐCNN 0.05 mm.
- Lực kế: 0–5 N; không tự suy ra k nếu chưa có dữ liệu.
- Ray quang học: 100 cm; trục quang y=0.125 m trong profile hiện được báo cáo mô tả.
- Đèn quang học: 12 V/21 W; nguồn có các nấc 3/6/9/12 V; giữ interlock.
- Prism: A=60°, n=1.517 theo profile được báo cáo; không hardcode góc lệch 39° cho mọi góc tới.
- Vật F: cao 1.8 cm; kiểm thử ảnh thật/ảo theo điều kiện thấu kính.

Các con số trên là fixture theo báo cáo/implementation hiện tại, không tự biến thành hằng số dùng chung cho mọi thiết bị. Kiểm tra nguồn thực tế trước khi dùng làm tiêu chuẩn chung.

Đặc biệt rà soát các điểm có nguy cơ là response hardcode:
- dòng cảm ứng ±35 µA;
- góc lệch lăng kính khoảng 39°;
- gia nhiệt tăng nhiệt nếu chưa có cân bằng năng lượng;
- rót nước 1120 ms nếu thời gian này chỉ là animation.

Nếu chưa có dữ liệu/phương trình để kiểm định, gắn nhãn QUALITATIVE hoặc BLOCKED; không tuyên bố định lượng.

GIAI ĐOẠN 7 — BUILD VÀ BÁO CÁO
- Chạy typecheck và build script thực tế của repository.
- Chạy test suite liên quan.
- Xác minh không mất các hành vi hiện hữu.
- Báo rõ file đã sửa, chức năng đã cải tiến, test đã chạy, kết quả pass/fail và phần còn thiếu.
- Không tuyên bố hoàn thành nếu chỉ thêm Markdown hoặc thay hình ảnh.

ĐIỀU KIỆN HOÀN THÀNH
OpenLab phải có bằng chứng rằng:
- Environment cung cấp điều kiện và boundary thực;
- Object có profile, thuộc tính và interface rõ;
- Interaction tạo ra quan hệ nhân quả có thể kiểm thử;
- Các thiết bị đo đọc cùng state của hệ;
- Lắp ráp sai được phát hiện và giải thích;
- Các tiêu chí ASM-01…ASM-24 có kết quả và bằng chứng phù hợp;
- Những gì chưa được mô phỏng định lượng được đánh dấu trung thực;
- Build/typecheck/test không có regression mới.

BẮT ĐẦU:
Thực hiện Giai đoạn 0 và 1 trước. Sau đó tạo compliance matrix, gap report, implementation plan. Tiếp tục triển khai từng mục an toàn theo thứ tự ưu tiên; không viết lại toàn bộ dự án.
```

---

## 2. Lệnh ngắn để tiếp tục các phiên làm việc sau

Dùng khi AI đã đọc tiêu chuẩn và đã có compliance matrix:

```text
Tiếp tục triển khai OpenLab theo RWSS v1.1.
Đọc 3 lớp Environment/Object/Interaction, 05_ASSEMBLY_ACCEPTANCE_CRITERIA.md và compliance matrix mới nhất.
Chọn đúng một gap P0 hoặc P1 chưa hoàn tất, kiểm tra code hiện tại,
đưa ra thay đổi nhỏ nhất, thực hiện, chạy test/build và cập nhật trạng thái.
Không sửa phần ngoài phạm vi gap. Không phá vỡ hành vi đã pass.
Báo cáo file thay đổi, test, kết quả và gap tiếp theo. Với assembly, cập nhật ASM test status và ASSEMBLY_ACCEPTANCE_REPORT.md.
```

## 3. Lệnh kiểm tra trước khi merge

```text
Thực hiện RWSS RELEASE AUDIT cho OpenLab 3D.
Kiểm tra Environment, Object, Interaction theo 3 tiêu chuẩn v1.1 và nghiệm thu lắp ráp theo 05_ASSEMBLY_ACCEPTANCE_CRITERIA.md.
Đối chiếu compliance matrix với code thực tế, chạy typecheck/build/test,
kiểm tra regression các luồng cân, thể tích, rót, gia nhiệt, quang học,
điện từ và chạy ASM-01…ASM-24 cho các luồng lắp ráp áp dụng. Phân loại VERIFIED/PARTIAL/VISUAL_ONLY/MISSING.
Không tự đánh dấu PASS khi thiếu bằng chứng. Xuất báo cáo RELEASE_AUDIT.md
và danh sách lỗi còn tồn tại. Xuất ASSEMBLY_ACCEPTANCE_REPORT.md với evidence cụ thể. Không tự merge hoặc deploy.
```

---

## 4. Quy tắc điều hành dành cho người quản lý dự án

- Chạy **lệnh chính** một lần khi bắt đầu tích hợp RWSS.
- Sau đó dùng **lệnh ngắn** để xử lý từng gap, mỗi lượt một phạm vi nhỏ.
- Trước khi phát hành, dùng **lệnh kiểm tra**.
- Không yêu cầu AI “nâng cấp toàn bộ cho chân thực” nếu chưa chỉ định module và tiêu chí test.
- Không chấp nhận báo cáo “đã hoàn thành” chỉ dựa trên ảnh chụp hoặc animation.
- Mọi thay đổi ảnh hưởng thiết bị đang hoạt động phải có regression test.

**Nguyên tắc điều hành:** Audit trước — lập gap — sửa từng phần — kiểm thử — mới nghiệm thu.
