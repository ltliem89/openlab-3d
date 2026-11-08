# OPENLAB 3D — NHẬT KÝ CẢI TIẾN CÓ KIỂM SOÁT (`OPENLAB3D_IMPROVEMENT_LOG.md`)

Tài liệu này là nhật ký cải tiến duy nhất theo yêu cầu tại **Mục 14** của `OPENLAB3D_MASTER_IMPROVEMENT_PROMPT.md` và chuẩn hợp đồng `EQUIPMENT_MODULE_STANDARD.md` (v2.3).

---

## Checkpoint 0 — Audit Hiện Trạng Workspace & Lập Kế Hoạch Tương Thích
- **Thời điểm**: Khởi đầu chu trình cải tiến theo `OPENLAB3D_MASTER_IMPROVEMENT_PROMPT.md`.
- **Các file đã khảo sát (`view_file`)**:
  - `/public/assets/aistudio/OPENLAB3D_MASTER_IMPROVEMENT_PROMPT_de314d72.md`
  - `/EQUIPMENT_MODULE_STANDARD.md` (v2.3)
  - `/src/App.tsx`, `/src/domain/types.ts`
  - `/src/components/navigation/TopNavBar.tsx`
  - `/src/components/student/StudentEquipmentSidebar.tsx`
  - `/src/components/student/StudentGuidedStepPanel.tsx`
  - `/src/components/student/StudentBottomPanelsRow.tsx`
  - `/src/components/modals/HtmlModuleImporterModal.tsx`
  - `/src/three-runtime/LabViewport3D.tsx`
  - `/src/three-runtime/HtmlEquipmentModuleRegistry.ts`
  - `/src/three-runtime/LabEnvironmentEngine.ts`
  - `/src/three-runtime/LocalDiskLibraryEngine.ts`
- **Phát hiện xung đột kiến trúc & Quyết định tương thích**:
  1. **Tổng số biến môi trường (`LabEnvironmentEngine.ts`)**: Code hiện có 13 biến lõi toàn phòng (`Room Core Variables`) + 12 biến mẫu/thí nghiệm (`Sample/Specimen Variables`) = **25 biến camelCase**. Theo đúng Mục 6.1 (*"Không xóa một biến đang được dùng chỉ để ép tổng số về 24"*), giữ nguyên toàn bộ 25 biến camelCase đang hoạt động và phân tách rõ biến toàn phòng / biến mẫu / biến đồ họa (`LabGraphicsSettings`).
  2. **Hợp đồng hàm Module HTML (`v2.2` vs `v2.3`)**: `HtmlEquipmentModuleRegistry.ts` đang dùng `buildEquipmentGroup(THREE, asset)` và `applyEquipmentState(THREE, rootObject, instance, asset)` (v2.2), trong khi `EQUIPMENT_MODULE_STANDARD.md` v2.3 quy định `buildEquipmentMesh(THREE)` và `updateEquipmentState(rootGroup, state, dt)`. Giải pháp: Viết **Adapter hai chiều** hỗ trợ đồng thời cả v2.2 và v2.3, kẹp `dt = 0.016` mặc định khi gọi từ luồng cập nhật trạng thái tĩnh.
  3. **Trạng thái xác minh dữ liệu (`verificationStatus`)**: `HtmlEquipmentModuleRegistry.ts` trước đó gán mặc định `'verified'` khi thiếu trường trong manifest. Đã sửa về `'not-verified'` / `'in-review'` để tuân thủ nghiêm ngặt Mục 8 (*"Không tự nâng trạng thái illustrative lên verified"*).

---

## Checkpoint 1 — Cải Tiến UX/UI 3D-First, Tách Chế Độ Học Sinh / Kỹ Thuật & Chuẩn Hóa Tiếng Việt KHTN
- **Mục tiêu**: Đảm bảo khung 3D trung tâm chiếm diện tích lớn nhất (65–75%+), tự động thu gọn panel thông minh theo độ rộng màn hình, gom khay đáy thành 1 tab nội dung gọn gàng có nút thu gọn và chuyển đổi đơn vị `CGS ↔ SI`, ẩn chi tiết kỹ thuật `.HTML` khỏi màn hình thực hành học sinh.
- **File đã sửa**:
  - `/src/App.tsx`: Tự động thu gọn thanh `Hướng dẫn` bên phải khi `< 1200px`, tự động thu gọn thanh `Thư viện` bên trái khi `< 768px`, nối callback `onOpenHtmlModuleImporter` lên `TopNavBar`.
  - `/src/components/navigation/TopNavBar.tsx`:
    - Chuẩn hóa nhãn điều hướng: `Trang chủ`, `Phòng thí nghiệm 3D`, `Bộ thí nghiệm`, `Thư viện thiết bị`, `Kiểm định`.
    - Bổ sung nút chuyển nhanh sang chế độ `Kỹ thuật` trên thanh Học sinh và nút `Module .HTML (v2.3)` trên thanh Giáo viên/Kỹ thuật.
  - `/src/components/student/StudentEquipmentSidebar.tsx`:
    - Đổi tiêu đề thành `Thư viện`, thu gọn thanh thông tin phụ thành 1 dòng `Thư viện · N dụng cụ`, ẩn nút kỹ thuật `.HTML` khỏi khu vực chính của học sinh (giữ trong menu chuột phải nâng cao), rút gọn chân thẻ thiết bị còn 2 nút rõ nghĩa (`Chi tiết thiết bị & thông số` và `Thêm vào bàn thí nghiệm`).
  - `/src/components/student/StudentBottomPanelsRow.tsx`:
    - Chuyển từ 3 thẻ nằm ngang cố định sang **Khay đáy 1 vùng nội dung theo 3 tab** (`Bảng kết quả đo`, `Công thức & giải thích`, `Cách đọc mặt khum & ĐCNN`).
    - Tích hợp bộ chuyển đổi đơn vị đo trực tiếp **`CGS (g/cm³, mL)` ↔ `SI (kg/m³, L)`** cho toàn bộ số liệu khối lượng, thể tích, khối lượng riêng và độ không đảm bảo đo mở rộng ($U_\rho$).
    - Bổ sung nút `Thu gọn / Mở bảng` để giải phóng tối đa chiều cao cho bàn thí nghiệm 3D.
  - `/src/three-runtime/LabViewport3D.tsx`:
    - Chuẩn hóa thuật ngữ `"Nút trừ bì (TARE) · 0,00 g"`.
    - Ẩn nút `"Cập nhật .HTML"` trên thanh công cụ ngữ cảnh khi ở chế độ Học sinh (`!isStudentMode`).

---

## Checkpoint 2 — Hợp Đồng Module HTML v2.3, Adapter v2.2, Rào Chắn Bảo Mật & 7 Cổng Kiểm Định (G1–G7)
- **Mục tiêu**: Chuẩn hóa `HtmlEquipmentModuleRegistry.ts` và `HtmlModuleImporterModal.tsx` theo Mục 5, Mục 8, Mục 9, Mục 10 và Mục 12 của `OPENLAB3D_MASTER_IMPROVEMENT_PROMPT.md`.
- **File đã sửa**:
  - `/src/three-runtime/HtmlEquipmentModuleRegistry.ts`:
    - Hỗ trợ đồng thời chuẩn `OL3D-HTML-MODULE-v2.3` (`buildEquipmentMesh`, `updateEquipmentState(rootGroup, state, dt)`) và `v2.2` (`buildEquipmentGroup`, `applyEquipmentState`) thông qua adapter tự động.
    - Tự động duyệt cây `THREE.Object3D` để bật `castShadow = true` và `receiveShadow = true` cho các `THREE.Mesh` con.
    - Thiết lập rào chắn bảo mật tĩnh + proxy `window`/`document` cô lập khi thực thi `#ol3d-module-3d-script`.
    - Cài đặt bộ **7 Cổng Kiểm Định (`validateModule7Gates`)**: `G1_STRUCTURE`, `G2_GEOMETRY`, `G3_PHYSICS_METROLOGY`, `G4_INTERACTION`, `G5_INTEGRATION`, `G6_PERFORMANCE`, `G7_SECURITY_PROVENANCE` với trạng thái `PASS | PARTIAL | FAIL | NOT_RUN`.
    - Loại bỏ việc tự động gán `verified` cho trường dữ liệu thiếu; dùng mặc định trung thực `not-verified` / `in-review`.
  - `/src/components/modals/HtmlModuleImporterModal.tsx`:
    - Hiển thị trực quan kết quả 7 cổng kiểm định (`G1`–`G7`) trước khi cho phép lưu/đưa lên bàn 3D; khóa nút phát hành nếu `overallStatus === 'FAIL'`.
    - Minh bạch hóa trạng thái lưu trữ: phân biệt rõ **Lưu trong trình duyệt (`IndexedDB`)** và **Ghi trực tiếp vào thư mục ổ cứng khi người dùng đã cấp quyền (`File System Access API`)**.
  - `/src/three-runtime/LabEnvironmentEngine.ts`:
    - Bổ sung phân loại nguồn dữ liệu tham chiếu `referenceDataType` (`EMPIRICAL_LAB` | `PUBLISHED_REFERENCE` | `ANALYTICAL_REFERENCE`).
    - Nâng cấp `computeMetrologyTTestStats()` tính thêm `meanSignedBiasGCm3`, `maeGCm3`, `rmseGCm3` và ghi chú giải thích rõ ý nghĩa thống kê cỡ mẫu nhỏ ($n = 10$).

---

## Checkpoint 3 — Kiểm Thử Biên Dịch & Linter (`lint_applet` & `compile_applet`)
- **Công cụ kiểm chứng**:
  - Chạy `lint_applet` (`npm run lint` / `tsc --noEmit`) kiểm tra toàn bộ kiểu dữ liệu TypeScript và cú pháp.
  - Chạy `compile_applet` (`npm run build`) kiểm tra đóng gói Vite + React + Three.js production bundle.
- **Điểm chưa xác minh thực nghiệm**:
  - Bộ 10 mẫu đối chiếu trong `METROLOGY_VALIDATION_BENCHMARK` được gắn nhãn trung thực là `PUBLISHED_REFERENCE` và `ANALYTICAL_REFERENCE` (chưa phải số liệu đo thực nghiệm vật lý tại phòng lab trường học `EMPIRICAL_LAB`).
  - Ghi file trực tiếp xuống `C:\Users\ltlie\Documents\libraries3DLab` trên trình duyệt phụ thuộc vào việc người dùng bấm cấp quyền qua hộp thoại `showDirectoryPicker()` (Web File System Access API); nếu chưa cấp quyền, dữ liệu được lưu bền vững trong `IndexedDB` của trình duyệt.

---

## Checkpoint 4 — Bản Phát Hành Gọn Nhẹ, Kính Mờ Frosted Glassmorphism & Chạy Thử Thực Nghiệm
- **Thời điểm**: 2026-11-08.
- **Mục tiêu**:
  1. Tinh giản triệt để kho mã nguồn, loại bỏ toàn bộ các file nén rác zip/bundle cồng kềnh (> 250MB), đưa dự án về trạng thái 332 tệp nguồn siêu nhẹ.
  2. Đồng bộ bảng điều khiển trong suốt mờ Frosted Glassmorphism (g-[#061122]/65 backdrop-blur-2xl) tại DeviceControlInspector.tsx và LabViewport3D.tsx, loại bỏ các thông số kích thước cơ khí CAD và mã kỹ thuật nội bộ gây rối mắt cho học sinh THCS.
  3. Cập nhật 36 profile thiết bị chuẩn hóa không bị nhiễm chéo thuộc tính (Đòn bẩy $\sum M = 0$, Bình thông nhau đẳng mức thủy tĩnh, Kính hiển vi quang học có tiêu cự & hiệu ứng Bokeh riêng cho từng mẫu vật).
  4. Khởi chạy máy chủ Vite Dev Server trên cổng http://localhost:3000/ (thời gian khởi động 904ms).
  5. Kiểm tra chạy thử thực nghiệm trực tiếp qua giao diện:
     - Kính hiển vi quang học 3D quan sát mẫu Trùng giày (*Paramecium caudatum*) ở độ phóng đại \times$, trạng thái lấy nét $\Delta z = 0.00\,\text{mm}$ (Nét hoàn hảo).
     - Mạng Nơ-ron Tri thức Vũ trụ (Planetary Cosmos) phân tầng đồng tâm, liên kết nhân quả và công thức toán học chuẩn LaTeX $m_{\text{net}} = \max(0, m_{\text{gross}} - m_{\text{tare}})$.
     - Tương tác cân điện tử: đặt quả cân chuẩn .00\,\text{g}$, màn hình LCD và nhãn 3D cập nhật .00\,\text{g}$, hạ thiết bị xuống mặt bàn gỗ 3D thao tác tự do.
- **Kết quả kiểm thử**:
  - 
pm run lint (	sc --noEmit): 0 lỗi.
  - 
pm run build: Hoàn thành trong 767ms.
  - 
pm test: 10/10 kịch bản chất lỏng & 25/25 kịch bản tích hợp hệ thống PASS (100%).
