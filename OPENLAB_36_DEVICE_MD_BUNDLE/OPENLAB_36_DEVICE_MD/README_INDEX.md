# OPENLAB 3D — BỘ ĐẶC TẢ ĐIỀU KHIỂN CHI TIẾT 36 THIẾT BỊ

## Mục tiêu

Bộ tài liệu này chuyển danh mục 36 thiết bị trong Master Comprehensive Audit thành các đặc tả chức năng riêng, hướng tới mô phỏng **Functional Digital Twin**: bộ phận 3D tương tác → trạng thái thiết bị → mô hình khoa học → phản hồi trực quan/số đo.

## Nội dung gói

- `devices/`: 36 file Markdown, một file cho mỗi thiết bị.
- `EQUIPMENT_CONTROL_ARCHITECTURE.md`: chuẩn kiến trúc điều khiển dùng chung.
- `EQUIPMENT_ACCEPTANCE_MASTER.md`: khung nghiệm thu chung và ma trận ca test.
- `SOURCE_AND_ASSUMPTIONS.md`: nguồn dữ liệu, giới hạn và cách đọc các trường chưa xác minh.

## Danh mục 36 thiết bị

| STT | Device ID | Thiết bị | Nhóm | Tài liệu |
|---:|---|---|---|---|
| 1 | `OL3D-EQP-BAL-0001` | Cân điện tử hiện số 500 g | `G02` | [Mở đặc tả](devices/01_OL3D-EQP-BAL-0001.md) |
| 2 | `OL3D-EQP-CYL-0001` | Ống đong thủy tinh 100 ml | `G04` | [Mở đặc tả](devices/02_OL3D-EQP-CYL-0001.md) |
| 3 | `OL3D-EQP-BKR-0001` | Cốc thủy tinh chia độ 250 ml | `G04/G05` | [Mở đặc tả](devices/03_OL3D-EQP-BKR-0001.md) |
| 4 | `OL3D-EQP-OVF-0001` | Bình tràn Eureka 250 ml | `G02/G04` | [Mở đặc tả](devices/04_OL3D-EQP-OVF-0001.md) |
| 5 | `OL3D-EQP-DYN-0001` | Lực kế lò xo ống trụ 5 N | `G02` | [Mở đặc tả](devices/05_OL3D-EQP-DYN-0001.md) |
| 6 | `OL3D-EQP-CAL-0001` | Thước cặp du xích 150 mm (0.02 mm) | `G01` | [Mở đặc tả](devices/06_OL3D-EQP-CAL-0001.md) |
| 7 | `OL3D-EQP-WGT-0001` | Quả cân chuẩn bằng đồng 50 g | `G02` | [Mở đặc tả](devices/07_OL3D-EQP-WGT-0001.md) |
| 8 | `OL3D-EQP-SLD-0001` | Vật rắn hình trụ hợp kim nhôm | `G02/G01` | [Mở đặc tả](devices/08_OL3D-EQP-SLD-0001.md) |
| 9 | `OL3D-EQP-SPH-0001` | Vật rắn hình cầu thép không gỉ | `G02/G01` | [Mở đặc tả](devices/09_OL3D-EQP-SPH-0001.md) |
| 10 | `OL3D-EQP-BLK-0001` | Vật rắn hình hộp chữ nhật đồng thau | `G02/G01` | [Mở đặc tả](devices/10_OL3D-EQP-BLK-0001.md) |
| 11 | `OL3D-EQP-HLW-0001` | Ống trụ kim loại rỗng có khoang kín | `G02/G04` | [Mở đặc tả](devices/11_OL3D-EQP-HLW-0001.md) |
| 12 | `OL3D-EQP-FLK-0001` | Bình tam giác Erlenmeyer 250 ml | `G04/G05` | [Mở đặc tả](devices/12_OL3D-EQP-FLK-0001.md) |
| 13 | `OL3D-EQP-STD-0001` | Giá đỡ thí nghiệm kèm khớp nối & tay kẹp | `G05/G06` | [Mở đặc tả](devices/13_OL3D-EQP-STD-0001.md) |
| 14 | `OL3D-EQP-OPT-0001` | (3) Thấu kính trên đế trượt quang học (f = +10 cm) | `G06` | [Mở đặc tả](devices/14_OL3D-EQP-OPT-0001.md) |
| 15 | `OL3D-EQP-OBN-0001` | (5) Giá quang học 90 cm có thước chia độ (-45 .. 0 .. +45 cm) | `G06` | [Mở đặc tả](devices/15_OL3D-EQP-OBN-0001.md) |
| 16 | `OL3D-EQP-OLP-0001` | (1) Đèn chiếu sáng Halogen kèm Đầu chắn khe sáng | `G06` | [Mở đặc tả](devices/16_OL3D-EQP-OLP-0001.md) |
| 17 | `OL3D-EQP-FOB-0001` | (2) Vật sáng bằng kính mờ hình chữ F | `G06` | [Mở đặc tả](devices/17_OL3D-EQP-FOB-0001.md) |
| 18 | `OL3D-EQP-SCR-0001` | (4) Màn chắn hứng ảnh trên Giá quang học | `G06` | [Mở đặc tả](devices/18_OL3D-EQP-SCR-0001.md) |
| 19 | `OL3D-EQP-PSU-0001` | (6) Nguồn điện hạ áp thí nghiệm 3V–12V | `G03/G07` | [Mở đặc tả](devices/19_OL3D-EQP-PSU-0001.md) |
| 20 | `OL3D-EQP-LBX-0001` | Hộp bộ 6 Thấu kính tiêu chuẩn (+5, +10, +15, -10, -20, ∞) | `G06` | [Mở đặc tả](devices/20_OL3D-EQP-LBX-0001.md) |
| 21 | `OL3D-EQP-THM-0001` | Nhiệt kế chất lỏng -10°C đến 110°C | `G03` | [Mở đặc tả](devices/21_OL3D-EQP-THM-0001.md) |
| 22 | `OL3D-EQP-LSR-0001` | Nguồn sáng Đèn Laser 3 tia song song (SGK KHTN 9) | `G06` | [Mở đặc tả](devices/22_OL3D-EQP-LSR-0001.md) |
| 23 | `OL3D-EQP-SLB-0001` | Bản bán trụ thuỷ tinh & Bảng chia độ 360° (SGK KHTN 9) | `G06` | [Mở đặc tả](devices/23_OL3D-EQP-SLB-0001.md) |
| 24 | `OL3D-EQP-PRM-0001` | Lăng kính tam giác trên giá đỡ — Tán sắc ánh sáng (SGK KHTN 9) | `G06` | [Mở đặc tả](devices/24_OL3D-EQP-PRM-0001.md) |
| 25 | `OL3D-EQP-MAG-0001` | Kính lúp cầm tay độ bội giác 5x (SGK KHTN 9) | `G06` | [Mở đặc tả](devices/25_OL3D-EQP-MAG-0001.md) |
| 26 | `OL3D-EQP-GLV-0001` | Điện kế nhạy vạch 0 ở giữa — Galvanometer (SGK KHTN 9) | `G07` | [Mở đặc tả](devices/26_OL3D-EQP-GLV-0001.md) |
| 27 | `OL3D-EQP-DMM-0001` | Đồng hồ đo điện đa năng hiện số (SGK KHTN 9) | `G03/G07` | [Mở đặc tả](devices/27_OL3D-EQP-DMM-0001.md) |
| 28 | `OL3D-EQP-COIL-0001` | Cuộn dây dẫn kín có 2 đèn LED & Thanh nam châm (SGK KHTN 9) | `G07` | [Mở đặc tả](devices/28_OL3D-EQP-COIL-0001.md) |
| 29 | `OL3D-EQP-DSH-0001` | Bát sứ chịu nhiệt — Cô đặc & Đốt cháy cồn (SGK KHTN 9) | `G05` | [Mở đặc tả](devices/29_OL3D-EQP-DSH-0001.md) |
| 30 | `OL3D-EQP-SEP-0001` | Phễu chiết có khoá & Phễu lọc trên giá đỡ (SGK KHTN 9) | `G04/G05` | [Mở đặc tả](devices/30_OL3D-EQP-SEP-0001.md) |
| 31 | `OL3D-EQP-DST-0001` | Bình cầu có nhánh 250 mL, Lưới tản nhiệt & Đèn cồn (SGK KHTN 9) | `G05` | [Mở đặc tả](devices/31_OL3D-EQP-DST-0001.md) |
| 32 | `OL3D-EQP-MIC-0001` | Kính hiển vi quang học (10x, 40x, 100x) & Tiêu bản NST (SGK KHTN 9) | `G09` | [Mở đặc tả](devices/32_OL3D-EQP-MIC-0001.md) |
| 33 | `OL3D-EQP-DNA-0001` | Mô hình cấu trúc phân tử DNA xoắn kép (SGK KHTN 9) | `G09` | [Mở đặc tả](devices/33_OL3D-EQP-DNA-0001.md) |
| 34 | `OL3D-EQP-WDP-1000` | Bình chứa nước có van xả định lượng 1000 ml | `G04` | [Mở đặc tả](devices/34_OL3D-EQP-WDP-1000.md) |
| 35 | `OL3D-EQP-LEV-0001` | Bộ đòn bẩy thăng bằng chia vạch đối xứng kèm giá đỡ | `G02` | [Mở đặc tả](devices/35_OL3D-EQP-LEV-0001.md) |
| 36 | `OL3D-EQP-HYD-0001` | Bình thông nhau 3 nhánh dị hình trên đế | `G04` | [Mở đặc tả](devices/36_OL3D-EQP-HYD-0001.md) |

## Cách đọc tài liệu

- Phần cấu hình, node, năng lực, phương trình, FSM và FMEA ở Phụ lục A là nội dung lấy từ hồ sơ nguồn.
- Các phần “Bộ phận và thao tác điều khiển”, “Quy trình thao tác”, “Chuỗi nhân quả”, “Ca kiểm thử” là đề xuất thiết kế bổ sung dựa trên hồ sơ nguồn.
- Không được coi file đặc tả là bằng chứng chức năng đã được triển khai trong ứng dụng.
- Mọi thông số có trạng thái `reported`, `partially-verified`, `undefined` hoặc không có nguồn rõ ràng phải được xác minh trước khi dùng để đánh giá học sinh.

## Thứ tự triển khai khuyến nghị

1. Dựng nền `Device Control Profile` và state store.
2. Làm một mẫu hoàn chỉnh ở mỗi nhóm G01–G10.
3. Thực hiện tích hợp chéo bằng connector.
4. Sau khi nghiệm thu mẫu, nhân rộng theo archetype tương thích; không sao chép logic sai bản chất giữa các thiết bị.
5. Chạy toàn bộ acceptance tests và hồi quy.
