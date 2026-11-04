# SOURCE AND ASSUMPTIONS

## Nguồn chính

`BAO_CAO_RA_SOAT_TOAN_DIEN_THANH_PHAN_MO_PHONG_THIET_BI_VA_MOI_TRUONG.md` do người dùng cung cấp trong cuộc trò chuyện. Tài liệu nguồn liệt kê 36 thiết bị, 8 tiêu bản mẫu vật, 25 biến môi trường, các connector, 10 nhóm G01–G10 và hồ sơ kỹ thuật riêng cho từng thiết bị.

## Phân biệt nội dung

1. **Source-derived:** tên thiết bị, Device ID, kích thước, node 3D, capability, phương trình, FSM, FMEA, connector và thông số được chép từ hồ sơ gốc.
2. **Design proposal:** các thao tác người học, quy trình, phản hồi và ca nghiệm thu bổ sung trong tài liệu này. Đây là yêu cầu thiết kế rút ra từ cấu tạo và logic nguồn.
3. **Needs verification:** thông số có trạng thái reported/partially verified, ngưỡng giả lập, giả định về node chưa xác nhận trong runtime, và bất cứ phần nào hồ sơ gốc không cung cấp đầy đủ.

## Cảnh báo

- Không thể kết luận 36 thiết bị đang chạy đúng chỉ từ tài liệu đặc tả; cần kiểm tra mã nguồn và runtime thật.
- Không tự xem các tên node trong tài liệu là bằng chứng node đang tồn tại trong asset GLB/Three.js hiện hành.
- Một số cấu hình có thể mô tả một thiết bị tổng hợp nhiều bộ phận; cần kiểm tra assembly và khả năng thao tác thực tế.
- Vật kính 100× dầu soi chỉ nên hoạt động như dầu soi khi đúng cấu hình, môi trường và quy trình tương ứng.
- Các phép đo, ngưỡng, vật liệu, chuẩn kỹ thuật và nguồn dẫn trong tài liệu gốc cần được kiểm định trước khi dùng làm thước chấm điểm chính thức.
