# OpenLab 3D — Phòng Thí nghiệm Khoa học Tự nhiên 3D Chuẩn GDPT 2018 THCS

Nền tảng phòng thí nghiệm ảo tương tác 3D WebGL thế hệ mới dành cho học sinh và giáo viên Trung học Cơ sở theo chương trình Giáo dục Phổ thông 2018 và danh mục thiết bị tối thiểu ban hành theo **Thông tư 38/2021/TT-BGDĐT**.

---

## 📘 TÀI LIỆU KIẾN TRÚC & HỆ THỐNG GỐC (SINGLE SOURCE OF TRUTH)

Toàn bộ các báo cáo kiến trúc, phân tích nguyên lý hoạt động, hồ sơ 36 thiết bị mô phỏng, hệ thống lắp ráp RWSS v1.1.1, mô phỏng kính hiển vi quang học và kết quả nghiệm thu kiểm thử khoa học đã được **hợp nhất hoàn toàn vào một file báo cáo duy nhất trong thư mục gốc**:

👉 **[BAO_CAO_TONG_THE_KIEN_TRUC_VA_HE_THONG_OPENLAB3D.md](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/BAO_CAO_TONG_THE_KIEN_TRUC_VA_HE_THONG_OPENLAB3D.md)**  
*(Quy mô: 5.484 dòng, ~521 KB, tích hợp đầy đủ công thức toán học MathType LaTeX, sơ đồ Mermaid và ma trận đối chiếu)*

### Bố cục 13 Phần của Báo cáo Tổng thể:
1. **Phần I**: Tổng quan Kiến trúc Hệ thống & Công nghệ Lõi (Tech Stack & 4-Layer Model `OL3D-MASTER-SPEC v1.0`).
2. **Phần II**: Kiến trúc Tương tác Nhân quả Vật lý (`CIA v1.0` & Chu trình 6 giai đoạn).
3. **Phần III**: Bộ Tiêu chuẩn Kỹ thuật Module Thiết bị `.HTML` Độc lập (`OL3D-HTML-MODULE v2.4` & 7 Cổng Kiểm định).
4. **Phần IV**: Hệ thống Môi trường Phòng Lab & Hạ tầng 3D Chuẩn SI (13 biến môi trường & Động lực học cầm nắm).
5. **Phần V**: Hệ thống Ghép nối Assembly & Chuẩn Nghiệm thu RWSS v1.1.1 (100/100 điểm, 24 tiêu chí ASM-01 .. ASM-24).
6. **Phần VI**: Nghiên cứu Vật lý Quang học Độc lập & Liên động Nguồn điện (Khúc xạ động Snell & Tán sắc lăng kính).
7. **Phần VII**: Hệ thống Mô phỏng Kính hiển vi Quang học 3D & 8 Mẫu vật Thực nghiệm (4 vật kính DIN, 2 thị kính, lấy nét đôi).
8. **Phần VIII**: Danh mục & Hồ sơ Kỹ thuật Rà soát Tách biệt 36 Thiết bị Mô phỏng (Mesh, Connector, Math, FSM, FMEA).
9. **Phần IX**: Phân tích Nguyên nhân Gốc rễ 8 Nhóm Lỗi Nguyên lý Hoạt động (RCA: P01 đến P08).
10. **Phần X**: Kế hoạch Tái cấu trúc Sâu Hệ thống Tương tác Khoa học (Deep Refactor Plan).
11. **Phần XI**: Báo cáo Nghiệm thu Kiểm thử Khoa học Thực nghiệm (24 kịch bản SCI-01 đến SCI-24).
12. **Phần XII**: Nhật ký Triển khai Thay đổi & Tiến trình Cải tiến Hệ thống (Changelog & Checkpoint 0–4).
13. **Phần XIII**: Kết luận & Hướng dẫn Vận hành, Mở rộng.

---

## 🗄️ CẤU TRÚC THƯ MỤC DỰ ÁN ĐÃ QUY HOẠCH GỌN GÀNG

Thư mục dự án đã được sắp xếp tinh gọn, loại bỏ tình trạng tản mát báo cáo ở thư mục gốc:

```
openlab-3d/
├── BAO_CAO_TONG_THE_KIEN_TRUC_VA_HE_THONG_OPENLAB3D.md  # 🌟 Báo cáo Kiến trúc & Rà soát Toàn diện Hợp nhất
├── README.md                                            # Tài liệu giới thiệu & hướng dẫn cài đặt này
├── src/                                                 # Mã nguồn chính (React 19 + TypeScript + Three.js)
│   ├── components/                                      # Thành phần UI (Viewport, Toolbars, HUD, Modal kính hiển vi)
│   ├── domain/                                          # Type definitions (types.ts, labEngineTypes.ts)
│   ├── data/                                            # Catalogs thiết bị & 8 mẫu vật sinh học
│   ├── three-runtime/                                   # Động cơ mô phỏng 3D WebGL (Procedural models, Assembly, HTML loader)
│   └── App.tsx                                          # State Orchestrator trung tâm
├── public/
│   └── libraries3DLab/                                  # Thư viện ảnh thực tế & module thiết bị .html độc lập
├── docs/
│   └── archive_reports/                                 # 📦 Nơi lưu trữ 16 báo cáo lịch sử riêng lẻ đã gom
└── scripts/                                             # Bộ kịch bản kiểm thử tự động & tạo báo cáo
```

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY ỨNG DỤNG

### 1. Yêu cầu Môi trường
- **Node.js**: Phiên bản 18.x trở lên.
- **Trình duyệt**: Chrome, Edge, Safari hoặc Firefox hỗ trợ WebGL 2.0.

### 2. Cài đặt Phụ thuộc
```bash
npm install
```

### 3. Chạy Môi trường Phát triển (Local Dev)
```bash
npm run dev
```
Ứng dụng sẽ khởi chạy tại: `http://localhost:5173`.

### 4. Kiểm thử Tự động & Nghiệm thu Khoa học
- **Kiểm thử nghiệm thu lắp ráp RWSS v1.1.1 (24/24 tiêu chí ASM)**:
  ```bash
  npx tsx scripts/verify-assembly-acceptance.ts
  ```
- **Kiểm thử tương tác khoa học chuyên sâu (24/24 kịch bản SCI)**:
  ```bash
  npx tsx scripts/verify-scientific-interaction.ts
  ```
- **Kiểm tra biên dịch Type-checking**:
  ```bash
  npx tsc --noEmit
  ```
- **Đóng gói sản phẩm (Production Build)**:
  ```bash
  npm run build
  ```
