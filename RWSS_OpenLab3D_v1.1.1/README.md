# RWSS OpenLab 3D v1.1.1 — Assembly Acceptance Addendum

Bộ tiêu chuẩn RWSS v1.1 cho OpenLab 3D được bổ sung tiêu chí nghiệm thu chuyên biệt cho chức năng lắp ráp thiết bị.

## Nội dung gói

1. `01_ENVIRONMENT_LAYER.md` — môi trường mô phỏng, không gian, bề mặt, ray, chất lỏng, ánh sáng, nhiệt và điều kiện biên.
2. `02_OBJECT_LAYER.md` — hồ sơ thiết bị, mẫu vật, hình học, thuộc tính, cổng kết nối và registry.
3. `03_INTERACTION_LAYER.md` — docking, đo lường, chất lỏng, nhiệt, điện, quang học, cảm ứng và quan hệ nhân quả.
4. `04_OPENLAB_OPERATION_COMMAND.md` — lệnh điều hành AI coding agent, quy trình audit, tích hợp và release.
5. `05_ASSEMBLY_ACCEPTANCE_CRITERIA.md` — **tiêu chí nghiệm thu lắp ráp ASM-01…ASM-24**, thang điểm 100, lỗi P0–P3, kịch bản kiểm thử và lệnh audit lắp ráp.

## Cách sử dụng

- Đặt năm file tiêu chuẩn/lệnh vào `docs/standards/RWSS/` trong repository OpenLab.
- Đặt báo cáo rà soát code gốc ở vị trí AI coding agent có thể đọc.
- Chạy lệnh điều hành chính trong `04_OPENLAB_OPERATION_COMMAND.md`.
- Khi đánh giá chức năng lắp ráp, chạy riêng lệnh trong `05_ASSEMBLY_ACCEPTANCE_CRITERIA.md`.
- Yêu cầu AI lập compliance matrix và evidence trước khi chỉnh sửa code.
- Triển khai từng gap, chạy test và regression; không viết lại phần đang hoạt động tốt.

## Quy tắc nghiệm thu lắp ráp

Một thao tác chỉ được xem là lắp ráp thành công khi kết nối đúng interface, thỏa compatibility, transform/constraint hợp lệ, cập nhật state và có thể tháo ra sạch sẽ. Mesh chạm nhau hoặc animation snap không đủ làm bằng chứng.

Mức `PASS` phải có test ID, expected/actual và bằng chứng. `BLOCKED` hoặc thiếu dữ liệu không được đổi thành `PASS`. Bất kỳ lỗi P0 nào đều chặn nghiệm thu.

## Phạm vi và giới hạn

Bộ tiêu chuẩn dựa trên báo cáo rà soát chức năng OpenLab 3D do người dùng cung cấp. Đây không phải xác nhận độc lập rằng mọi hành vi vẫn tồn tại trong repository hiện tại. AI coding agent phải kiểm tra code đang chạy, nguồn thông số và test thực tế trước khi kết luận. Các tolerance, connector hoặc thông số không có nguồn phải giữ trạng thái `UNKNOWN`.
