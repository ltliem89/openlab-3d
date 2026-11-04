# OPENLAB 3D — FIVE NON-DESTRUCTIVE IMPROVEMENT MOCKUPS

**Bộ tài liệu thiết kế cải tiến, không phải thay thế kiến trúc hiện tại.** Căn cứ hai tài liệu OpenLab 3D v3.0.0 đã cung cấp.

Nguyên tắc xuyên suốt: giữ nguyên Asset ID, slug, state key, node legacy, connector ID, `EquipmentModuleContract`, kiến trúc 4 lớp và CIA 6 giai đoạn. Chỉ mở rộng bằng adapter/profile/solver/test có version và regression.

| File | Nội dung | Dòng |
|---|---|---:|
| `01_MOCKUP_CAU_TAO_3D_VA_DIEU_KHIEN_TUNG_CHI_TIET.md` | Cấu tạo, mesh, điều khiển từng chi tiết và kiểm thử cho 36 thiết bị | 4246 |
| `02_MOCKUP_BO_GIAI_KHOA_HOC_DINH_LUAT_VA_DO_LUONG.md` | Định luật, scientific solvers, state, đo lường, sai số, hiệu chuẩn và dữ liệu nguồn | 3466 |
| `03_MOCKUP_GHEP_NOI_THIET_BI_VA_QUY_TRINH_THI_NGHIEM.md` | AssemblyGraph, connector registry, 15 workflow và tương tác liên thiết bị | 2207 |
| `04_MOCKUP_GIAO_DIEN_HUONG_DAN_VA_KIEM_DINH.md` | UI giữ nguyên, HoverCard/Glassmorphism, Inspector, Adaptive Coach, diagnostics và regression | 2867 |
| `05_MOCKUP_MOI_TRUONG_PHONG_LAB_VAT_LY_TUONG_TAC.md` | Môi trường, 25 biến, local fields, 36 device couplings, preset và nghiệm thu | 2736 |

## Trình tự đọc và triển khai

1. Mockup 01: mapping từng chi tiết 3D thành điều khiển và thao tác thực.
2. Mockup 02: mô hình hóa các định luật và phép đo, tách giá trị nguồn/giả định.
3. Mockup 03: kết nối thiết bị, topology và workflow thực nghiệm.
4. Mockup 04: giữ UI hiện tại và làm giàu hướng dẫn/kiểm định.
5. Mockup 05: bảo đảm điều kiện môi trường phù hợp với thiết bị và solver.

**Không triển khai đồng loạt:** audit baseline → chọn vertical slice đại diện → thêm adapter → test → review → rollout theo nhóm → regression toàn hệ thống.
