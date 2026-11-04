# EQUIPMENT ACCEPTANCE MASTER — NGHIỆM THU 36 THIẾT BỊ

## 1. Nguyên tắc

Mỗi thiết bị phải có test đặc thù trong file riêng. Checklist dưới đây là cổng nghiệm thu chung; không thay thế phép thử riêng theo khoa học của thiết bị.

## 2. Cổng nghiệm thu chung

| Gate | Kiểm tra | PASS khi |
|---|---|---|
| EQ-G01 | Định danh và nguồn | Đúng Device ID, đúng asset và dữ liệu nguồn có provenance |
| EQ-G02 | Hình học và bộ phận | Đúng bộ phận, node 3D, tỷ lệ và vị trí trục |
| EQ-G03 | Hitbox và tương tác | Mỗi bộ phận điều khiển được độc lập, không bắt nhầm node |
| EQ-G04 | Cơ cấu điều khiển | Hành trình, giới hạn, nấc, hướng thao tác hợp lý |
| EQ-G05 | Trạng thái | State/FSM và transition đúng guard |
| EQ-G06 | Khoa học | Phương trình, điều kiện đầu vào, đơn vị và dấu đúng |
| EQ-G07 | Đo lường | GHĐ, ĐCNN, sai số và hiển thị được kiểm tra |
| EQ-G08 | Phản hồi | Mesh, số đo, ánh sáng/âm thanh cập nhật đồng bộ |
| EQ-G09 | Liên động/an toàn | Tình huống sai bị phát hiện và không gây trạng thái phi vật lý |
| EQ-G10 | Hướng dẫn | Help card đúng bộ phận, ảnh đúng thiết bị, tooltip không bị cắt |
| EQ-G11 | Tương tác chéo | Connector, dây, ống, tải hoặc tia tương tác đúng khi được yêu cầu |
| EQ-G12 | Hồi quy/hiệu năng | Không vỡ tính năng cũ; không rò GPU/listener; FPS đạt mục tiêu dự án |

## 3. Quy tắc báo cáo

- Mỗi test ghi `PASS`, `FAIL`, `BLOCKED`, `NOT TESTED`.
- Không được đánh dấu PASS khi chỉ xác nhận visual render.
- Với FAIL, đính kèm bước tái hiện, giá trị đầu vào, giá trị kỳ vọng, giá trị thực tế, log và ảnh/video minh chứng.
- Với BLOCKED, ghi rõ thiếu dữ liệu, thiếu asset, thiếu connector hay chưa có runtime.
- Mọi thông số giả định phải gắn `SIMULATION_ASSUMPTION`, không trình bày như số liệu kiểm định thực.

## 4. Mẫu báo cáo từng test

```md
### TEST-ID — Tên ca kiểm thử
- Thiết bị:
- Tiền điều kiện:
- Thao tác:
- Dữ liệu đầu vào:
- Kết quả kỳ vọng:
- Kết quả thực tế:
- Trạng thái: PASS | FAIL | BLOCKED | NOT TESTED
- Minh chứng:
- Ghi chú:
```
