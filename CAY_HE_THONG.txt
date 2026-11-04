# CÂY CẤU TRÚC HỆ THỐNG DỰ ÁN OPENLAB 3D
## (PROJECT DIRECTORY TREE & ARCHITECTURE TOPOLOGY)

> **Mã tài liệu**: `OL3D-SYSTEM-TREE-2026`  
> **Cập nhật lúc**: 04/11/2026  
> **Phiên bản hệ thống**: `OpenLab 3D v3.0.0`

---

## 🌳 SƠ ĐỒ TOÀN CẢNH CÂY THƯ MỤC DỰ ÁN (PROJECT REPOSITORY TREE)

```
openlab-3d/
├── 📄 BAO_CAO_TONG_THE_KIEN_TRUC_VA_HE_THONG_OPENLAB3D.md (508.8 KB)  # 🌟 Báo cáo Tổng thể Kiến trúc & Rà soát Hệ thống (Master Spec v3.0, 5.484 dòng)
├── 📄 README.md (5.3 KB)                                            # Tài liệu giới thiệu dự án, hướng dẫn cài đặt & điều hướng
├── 📄 package.json (0.9 KB)                                         # Cấu hình npm, dependencies (React 19, Three.js, Vite 6, Tailwind)
├── 📄 tsconfig.json (0.6 KB)                                        # Cấu hình TypeScript 5.8+ Strict Mode
├── 📄 vite.config.ts (0.7 KB)                                       # Cấu hình build Vite & plugin React
├── 📄 index.html (1.2 KB)                                           # Điểm vào HTML chính của ứng dụng Web
├── 📄 metadata.json (0.3 KB)                                        # Metadata ứng dụng AI Studio / OpenEduLab
│
├── 📁 src/                                                          # Mã nguồn chính của ứng dụng
│   ├── 📄 App.tsx (185.2 KB)                                        # Bộ điều phối trạng thái trung tâm (State Orchestrator)
│   ├── 📄 main.tsx (0.2 KB)                                         # Điểm khởi tạo React 19 DOM root
│   ├── 📄 index.css (1.6 KB)                                        # Style toàn cục Tailwind CSS & hiệu ứng giao diện
│   │
│   ├── 📁 components/                                               # Các thành phần giao diện người dùng React
│   │   ├── 📁 common/                                               # Component UI dùng chung
│   │   │   ├── 📄 EquipmentHoverCard.tsx (16.2 KB)                  # Thẻ nổi Glassmorphism hướng dẫn khi rê chuột thư viện
│   │   │   ├── 📄 EquipmentPreviewPanel.tsx (13.7 KB)               # Bảng xem trước thông số kỹ thuật & ảnh thực tế
│   │   │   ├── 📄 EquipmentRealPhotoView.tsx (8.4 KB)               # Khung hiển thị ảnh chụp thực tế từ libraries3DLab
│   │   │   └── 📄 EquipmentThumbnailSvg.tsx (12.1 KB)               # Bộ vẽ vector SVG dự phòng chống vỡ ảnh
│   │   │
│   │   ├── 📁 microscope/                                           # Hệ thống mô phỏng Kính hiển vi Quang học 3D
│   │   │   ├── 📄 MicroscopeSimulationModal.tsx (36.7 KB)           # Modal kính hiển vi: Ốc sơ cấp/vi cấp, mâm vật kính DIN, thị kính
│   │   │   └── 📄 MicroscopeSpecimenSvgRenderer.tsx (28.4 KB)       # Bộ dựng thị kính hiển vi & hình ảnh tế bào theo độ phóng đại
│   │   │
│   │   ├── 📁 modals/                                               # Các cửa sổ chức năng pop-up
│   │   │   ├── 📄 HtmlModuleImporterModal.tsx (47.2 KB)             # Modal nạp module .HTML độc lập & kiểm định 7 cổng G1-G7
│   │   │   ├── 📄 GovernanceOverviewModal.tsx (18.9 KB)             # Bảng điều khiển quản trị kiểm định & tiêu chuẩn thiết bị
│   │   │   ├── 📄 LabEnvironmentSpecModal.tsx (14.5 KB)             # Bảng điều khiển 13 biến môi trường phòng thí nghiệm
│   │   │   └── 📄 LabVideoRecorderModal.tsx (11.2 KB)               # Bộ ghi hình video thí nghiệm thực hành
│   │   │
│   │   ├── 📁 navigation/                                           # Thanh điều hướng & tìm kiếm
│   │   │   └── 📄 TopNavBar.tsx (48.9 KB)                           # Thanh công cụ trên cùng: Tìm kiếm gần đây, tiến trình bước, chuyển vai trò
│   │   │
│   │   ├── 📁 panels/                                               # Các bảng điều khiển chuyên gia / kỹ thuật
│   │   │   ├── 📄 AssetExplorerPanel.tsx (29.5 KB)                  # Bảng duyệt cây thiết bị nâng cao
│   │   │   ├── 📄 DeviceControlInspector.tsx (16.7 KB)              # Bảng thanh trượt điều khiển thông số thiết bị
│   │   │   ├── 📄 InspectorPanel.tsx (38.8 KB)                      # Bảng thanh tra thuộc tính đối tượng 3D
│   │   │   ├── 📄 SceneHierarchyPanel.tsx (11.3 KB)                 # Cây cấu trúc phân cấp đối tượng 3D trong cảnh
│   │   │   └── 📄 BottomWorkspaceTray.tsx (23.0 KB)                 # Khay công cụ đáy màn hình
│   │   │
│   │   └── 📁 student/                                              # Giao diện thân thiện dành riêng cho học sinh KHTN
│   │       ├── 📄 StudentHomeView.tsx (11.4 KB)                     # Màn hình trang chủ học sinh chọn bài thực hành
│   │       ├── 📄 StudentEquipmentSidebar.tsx (48.4 KB)             # Thanh thư viện thiết bị học sinh bên trái
│   │       ├── 📄 StudentGuidedStepPanel.tsx (11.8 KB)              # Bảng hướng dẫn thực hành theo từng bước SGK
│   │       ├── 📄 StudentBottomPanelsRow.tsx (37.5 KB)              # Thanh công cụ đo lường và thao tác nhanh phía dưới
│   │       └── 📄 StudentModalsAndSubViews.tsx (55.4 KB)            # Các modal con phụ trợ góc nhìn học sinh
│   │
│   ├── 📁 data/                                                     # Dữ liệu danh mục, catalog & hồ sơ thiết bị
│   │   ├── 📄 mockCatalog.ts (170.0 KB)                             # Catalog 36 thiết bị gốc chuẩn hóa Thông tư 38/2021/TT-BGDĐT
│   │   ├── 📄 multiSourceEquipmentDossier.ts (97.3 KB)              # Hồ sơ kiểm định 5 nguồn đối chiếu kỹ thuật & sư phạm
│   │   └── 📄 microscopeSpecimenCatalog.ts (33.6 KB)                # Catalog 8 tiêu bản mẫu vật hiển vi & thông số vật kính DIN
│   │
│   ├── 📁 domain/                                                   # Định nghĩa kiểu dữ liệu TypeScript (Domain Types)
│   │   └── 📄 types.ts (14.7 KB)                                    # Hệ thống Type chuẩn: AssetDefinition, SceneInstance, Connectors
│   │
│   ├── 📁 device-control/                                           # Hệ thống điều khiển trạng thái thiết bị
│   │   ├── 📄 DeviceControlEngine.ts (2.1 KB)
│   │   ├── 📄 DeviceControlProfile.ts (1.8 KB)
│   │   └── 📄 DeviceControlProfilesData.ts (130.1 KB)
│   │
│   ├── 📁 repositories/                                             # Tầng lưu trữ và truy vấn catalog
│   │   └── 📄 CatalogRepository.ts (6.5 KB)
│   │
│   └── 📁 three-runtime/                                            # Động cơ mô phỏng 3D WebGL Three.js
│       ├── 📄 LabViewport3D.tsx (570.7 KB)                          # Khung nhìn 3D chính, render loop, raycast, động lực học rơi & bám dính
│       ├── 📄 ProceduralLabModels.ts (260.3 KB)                     # Bộ dựng hình học thủ tục 3D PBR cho 36 thiết bị
│       ├── 📄 AssemblySystem.ts (28.6 KB)                           # Động cơ lắp ráp RWSS v1.1.1, connector registry, docking & đồ thị
│       ├── 📄 LabEnvironmentEngine.ts (76.9 KB)                     # Không gian phòng lab, ánh sáng PBR & 13 biến môi trường
│       ├── 📄 HtmlEquipmentModuleRegistry.ts (151.4 KB)             # Bộ nạp & 7 cổng kiểm định tự động module HTML (G1-G7)
│       ├── 📄 LocalDiskLibraryEngine.ts (36.1 KB)                   # Bộ quản lý thư viện thiết bị ổ đĩa kiểu Arduino
│       ├── 📄 EquipmentImagePreviewController.ts (25.2 KB)          # Bộ điều khiển hiển thị ảnh chụp thực tế
│       ├── 📄 LabSoundEngine.ts (27.5 KB)                           # Tổng hợp âm thanh Web Audio API (va chạm, bíp, nước)
│       ├── 📄 LabVideoRecorderEngine.ts (19.6 KB)                   # Động cơ quay video WebM/MP4 từ WebGL Canvas
│       ├── 📄 AssetLoader.ts (6.7 KB)                               # Bộ tải asset 3D
│       └── 📄 BehaviorRegistry.ts (6.5 KB)                          # Đăng ký hành vi động thái thiết bị
│
├── 📁 public/                                                       # Tài nguyên tĩnh công khai
│   └── 📁 libraries3DLab/ (36 thiết bị)                             # Kho ảnh chụp thực tế 36 thiết bị, SVG icons & module .HTML độc lập
│       ├── 📄 library-index.json (19.8 KB)                          # Chỉ mục thư viện thiết bị 3D
│       ├── 📄 *.png / *.webp                                        # Ảnh chụp thực tế độ phân giải cao
│       ├── 📄 *.svg                                                 # Biểu tượng 2D vector
│       └── 📄 *.html                                                # Các module thiết bị 3D chạy độc lập
│
├── 📁 docs/                                                         # Tài liệu nghiên cứu & lưu trữ
│   ├── 📁 archive_reports/ (16 báo cáo lịch sử)                     # 📦 Thư mục lưu trữ 16 báo cáo lịch sử riêng lẻ đã gom gọn
│   │   ├── 📄 ASSEMBLY_ACCEPTANCE_REPORT.md (15.2 KB)
│   │   ├── 📄 BAO_CAO_HOAN_THIEN_MO_PHONG_KINH_HIEN_VI_3D_VA_ANH_CHUP.md (5.1 KB)
│   │   ├── 📄 BAO_CAO_RA_SOAT_CHUC_NANG_THUC_TE_THIET_BI_OPENLAB3D.md (26.1 KB)
│   │   ├── 📄 BAO_CAO_RA_SOAT_LOI_NGUYEN_LY_HOAT_DONG_OPENLAB3D.md (20.4 KB)
│   │   ├── 📄 BAO_CAO_RA_SOAT_TOAN_DIEN_THANH_PHAN_MO_PHONG_THIET_BI_VA_MOI_TRUONG.md (359.8 KB)
│   │   ├── 📄 CAUSAL_INTERACTION_ARCHITECTURE.md (15.5 KB)
│   │   ├── 📄 DEEP_REFACTOR_PLAN.md (13.7 KB)
│   │   ├── 📄 EQUIPMENT_MODULE_STANDARD.md (30.6 KB)
│   │   ├── 📄 IMPLEMENTATION_CHANGELOG.md (10.3 KB)
│   │   ├── 📄 MICROSCOPE_AUDIT_REPORT.md (24.4 KB)
│   │   ├── 📄 NGHIEN_CUU_QUANG_HOC_TUONG_TAC_DOC_LAP.md (6.8 KB)
│   │   ├── 📄 NGHIEN_CUU_VAT_LY_CAM_NAM_MO_PHONG_THUC_TE.md (8.5 KB)
│   │   ├── 📄 OPENLAB3D_IMPROVEMENT_LOG.md (10.7 KB)
│   │   ├── 📄 OPENLAB_3D_ARCHITECTURE_OVERVIEW.md (15.6 KB)
│   │   ├── 📄 ROOT_CAUSE_ANALYSIS.md (8.1 KB)
│   │   └── 📄 SCIENTIFIC_INTERACTION_TEST_REPORT.md (12.3 KB)
│   │
│   ├── 📁 specs_khtn8/ (70 file)                                    # Đặc tả chi tiết các bài thực hành KHTN 8
│   └── 📁 standards/ (Tiêu chuẩn kỹ thuật)                          # Tiêu chuẩn RWSS và tiêu chuẩn kiểm định
│
└── 📁 scripts/                                                      # Kịch bản kiểm thử tự động CI/CD & trình tạo báo cáo
    ├── 📄 build-unified-master-report.ts (24.2 KB)                  # Trình tạo Báo cáo Tổng thể Hợp nhất 5.484 dòng
    ├── 📄 archive-scattered-reports.ts (2.8 KB)                     # Script dọn dẹp & lưu trữ báo cáo rải rác
    ├── 📄 generate-system-tree.ts (8.5 KB)                          # Trình xuất cây hệ thống
    ├── 📄 verify-assembly-acceptance.ts (18.6 KB)                   # Kiểm thử tự động 24 tiêu chí lắp ráp RWSS v1.1.1 (100/100 đ)
    ├── 📄 verify-scientific-interaction.ts (19.4 KB)                # Kiểm thử tự động 24 kịch bản tương tác khoa học (SCI-01..24)
    └── 📄 scientific-profiles.ts (78.3 KB)                          # Hồ sơ phương trình toán học KaTeX, FSM và FMEA 36 thiết bị
```
