# HỆ THỐNG ĐẶC TẢ MASTER CHÂN THỰC HÓA TOÀN DIỆN PHÒNG THÍ NGHIỆM ẢO OPENLAB 3D
## (OPENLAB 3D MASTER HIGH-FIDELITY TWIN SPECIFICATION SYSTEM — v3.0)

> **Mục tiêu tối thượng:** Đảm bảo mọi chi tiết trong OpenLab 3D đạt mức **Chân thực tuyệt đối (High-Fidelity Cyber-Physical Twin)**:
> 1. **Môi trường:** Đầy đủ 24+ biến số vật lý/hóa học chi phối không gian như phòng lab thực tế.
> 2. **Thiết bị:** Chuẩn hóa 100% từ hình dạng hình học 3D, vật liệu PBR quang học, đến thông số kỹ thuật, dải đo, độ chia nhỏ nhất và sai số theo datasheet và Thông tư 38/2021/TT-BGDĐT.
> 3. **Tương tác:** Vận hành theo định luật tự nhiên, chu trình bất biến nhân quả CIA v2.0, động lực học vật lý, âm thanh phản hồi và mạng nơ-ron tri thức nhận thức 3 tầng bừng sáng quy luật khoa học.

---

## MỤC LỤC ĐIỀU HƯỚNG TOÀN BỘ HỆ THỐNG MASTER

Hệ thống tài liệu được phân tách thành 6 bản đặc tả chuyên sâu, độc lập nhưng liên kết chặt chẽ:

| Tên tệp tin | Tên tài liệu đặc tả | Nội dung cốt lõi |
| :--- | :--- | :--- |
| **`01_ENVIRONMENT_HIGH_FIDELITY_SPEC.md`** | **Đặc tả Môi trường Vật lý Chân thực Tuyệt đối** | 12 biến môi trường vĩ mô toàn phòng lab + 12 biến môi trường mẫu chất chuyên biệt; Bảng ma trận ánh xạ tương tác môi trường - thiết bị; Mô hình suy giảm và chuyển giao năng lượng. |
| **`02_EQUIPMENT_PHYSICAL_APPEARANCE_AND_PBR_SPEC.md`** | **Đặc tả Hình dáng & Đồ họa PBR Chân thực** | Hệ quy chiếu mét SI; Kích thước mm thực tế của 10 nhóm thiết bị (G01–G10, 36 thiết bị); Vật liệu PBR (Roughness, Metalness, IOR Borosilicate 1.474); Vạch chia độ 360°; Màn hình LCD/LED; Bounding Box & Dock-ports. |
| **`03_EQUIPMENT_FUNCTIONAL_METROLOGY_SPEC.md`** | **Đặc tả Chức năng Đo lường & Đo lường học (Metrology)** | Tích hợp chuẩn quốc tế ISO/IEC Guide 98-3 (GUM); Dải đo, ĐCNN, Sai số dụng cụ; Độ trôi nhiệt độ ($\alpha$), nhiễu ngẫu nhiên Gaussian; Logic phím bấm TARE, núm vặn DMM, vi chỉnh kính hiển vi DIN 58145. |
| **`04_INTERACTION_CAUSAL_AND_ASSEMBLY_SPEC.md`** | **Đặc tả Tương tác Đa trường & Chu trình Nhân quả CIA v2.0** | Đồ thị lắp ráp Assembly Graph (RWSS v1.1.1, Snap $\le 0.08\text{m}$, 6 DoF); Tương tác cơ học, thủy lực Archimedes, nhiệt lượng $Q = mc\Delta T$, điện học Kirchhoff/Ohm, quang học Snell; Động cơ âm thanh Web Audio chân thực. |
| **`05_COGNITIVE_NEURAL_KNOWLEDGE_NETWORK_SPEC.md`** | **Đặc tả Mạng lưới Tri thức Nơ-ron Nhận thức 3 Tầng** | Mô hình 3 tầng: *Thiết bị 3D $\to$ Biến số đo lường $\to$ Định luật tự nhiên*; Tia sáng Synapse phát quang 3D; Khoảnh khắc "Aha/Eureka" bừng sáng định luật; Phản xạ ức chế an toàn & Trợ lý Socrates chẩn đoán ngộ nhận. |
| **`06_SCIENTIFIC_VERIFICATION_AND_VISEF_GUIDE.md`** | **Hướng dẫn Kiểm định Khoa học & Dự thi ViSEF** | Ma trận kiểm thử 24 kịch bản SCI & 24 tiêu chí ASM; Kế hoạch đối chiếu thực nghiệm đo lường ảo vs thật ($t$-test, ANOVA, sai số $< 1\%$); Kịch bản thuyết trình bảo vệ bản quyền và liêm chính trước Ban Giám khảo KHKT. |

---

## NGUYÊN TẮC CỐT LÕI (CORE TENETS)

1. **Nguyên tắc "Zero Fabrication" (Bất biến nhân quả):** Không có bất kỳ hiện tượng khoa học nào được tạo ra từ hoạt họa dựng sẵn hay "chiếu phim". Mọi giá trị đo, góc bẻ tia sáng hay sự đổi màu dung dịch đều phải là nghiệm của các phương trình vi phân/đại số vật lý thực tế.
2. **Nguyên tắc "Chuẩn hóa SI & Công nghiệp":** Mọi kích thước trong mã nguồn 3D đều dùng đơn vị mét ($1.0\text{ = 1m}$), mọi thông số kỹ thuật đều tham chiếu từ datasheet nhà sản xuất thiết bị trường học và văn bản quy phạm pháp luật của Bộ GD&ĐT Việt Nam.
3. **Nguyên tắc "Hữu hình hóa Nhận thức":** Khoa học không phải là hộp đen. Mọi quá trình đo đạc và biến đổi đều được trực quan hóa qua lăng kính nơ-ron tri thức để học sinh hiểu sâu bản chất, kích thích tư duy nghiên cứu sáng tạo.
