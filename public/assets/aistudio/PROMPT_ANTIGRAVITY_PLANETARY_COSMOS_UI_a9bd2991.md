# ANTIGRAVITY EXECUTION PROMPT — OPENLAB PLANETARY COSMOS UI ONLY

Bạn là kỹ sư frontend senior nâng cấp giao diện OpenLab 3D trong repository:
https://github.com/ltliem89/openlab-3d.git

## MỤC TIÊU

Đọc toàn bộ `docs/PLANETARY_COSMOS_UI_SPEC.md` trước khi thao tác. Nâng cấp giao diện sang phong cách **Planetary Cosmos**: mạng lưới hành tinh khoa học, command center và holographic HUD. Giao diện phải hiện đại, gọn, mượt và dễ dùng cho học sinh/giáo viên.

**ĐIỀU KIỆN CAO NHẤT: CHỈ THAY ĐỔI PRESENTATION/UI/UX VÀ TỐI ƯU HIỂN THỊ. GIỮ NGUYÊN TẤT CẢ CHỨC NĂNG, LUỒNG, LOGIC, DỮ LIỆU VÀ KẾT QUẢ KHOA HỌC.**

## 0. PRE-FLIGHT — KHÔNG BỎ QUA

1. Đọc SPEC và:
   - `docs/OPENLAB3D_IMPLEMENTATION_CONTRACT.md`
   - `docs/CAY_HE_THONG_OPENLAB3D.md`
   - `RWSS_OpenLab3D_v1.1.1/01_ENVIRONMENT_LAYER.md`
   - `RWSS_OpenLab3D_v1.1.1/02_OBJECT_LAYER.md`
   - `RWSS_OpenLab3D_v1.1.1/03_INTERACTION_LAYER.md`
   - `RWSS_OpenLab3D_v1.1.1/04_OPENLAB_OPERATION_COMMAND.md`
   - `RWSS_OpenLab3D_v1.1.1/05_ASSEMBLY_ACCEPTANCE_CRITERIA.md`
   - `BAO_CAO_TONG_THE_KIEN_TRUC_VA_HE_THONG_OPENLAB3D.md`
2. Chạy `git status --short`; ghi nhận và bảo toàn mọi thay đổi chưa commit. Không overwrite/revert thay đổi người dùng.
3. Xác nhận branch, HEAD và remote. Tạo branch riêng `ui/planetary-cosmos` từ baseline hiện tại nếu chưa tồn tại; tuyệt đối không làm trên `main`.
4. Đọc `package.json`; không cập nhật package/lockfile.
5. Chạy baseline `npm run lint`, `npm run build`, `npm test`. Ghi nguyên output và trạng thái. Nếu thiếu dependency, báo BLOCKED; không tự ý thay phiên bản.
6. Đọc toàn bộ handlers, event listeners và controls ở các component mục tiêu.
7. **P0 chỉ audit, không sửa application source.** Tạo `docs/PLANETARY_COSMOS_AUDIT.md` ghi component responsibilities, props/callback/events, mọi nút/filter/menus, baseline tests, vùng được sửa và vùng cấm.
8. Kết thúc P0, báo cáo và **CHỜ xác nhận** mới bắt đầu P1.

## 1. VÙNG ĐƯỢC PHÉP SỬA

- `src/index.css` — namespaced theme tokens/UI CSS
- `src/components/navigation/TopNavBar.tsx`
- `src/components/student/StudentHomeView.tsx`
- `src/components/student/StudentEquipmentSidebar.tsx`
- `src/components/student/StudentGuidedStepPanel.tsx`
- `src/components/panels/DeviceControlInspector.tsx` — JSX/style only
- `src/components/modals/NeuralDeviceNetworkModal.tsx` — rendering/style/animation only
- `src/three-runtime/LabViewport3D.tsx` — overlay/HUD/toolbar presentation only

Có thể thêm component UI thuần nếu không tạo logic/state trùng lặp. Tái sử dụng props và handlers hiện có. Muốn sửa file ngoài danh sách phải dừng và trình bày lý do trước.

## 2. TUYỆT ĐỐI KHÔNG SỬA

- `src/App.tsx`
- `src/domain/**`
- `src/repositories/**`
- `src/device-control/**`
- `src/three-runtime/AssemblySystem.ts`
- `src/three-runtime/LabEnvironmentEngine.ts`
- `src/three-runtime/AssetLoader.ts`
- `src/three-runtime/ProceduralLabModels.ts`
- `src/three-runtime/HtmlEquipmentModuleRegistry.ts`
- solver, FSM, physics/chemistry calculations, assembly/connector, environmental state
- asset catalog, equipment IDs, experiment definitions, HTML equipment modules
- `package.json`, lockfiles, Vite/TypeScript/build settings

Không đổi public props, callback signatures, CustomEvent names/payloads, types, enums, IDs hoặc APIs.

## 3. CÁC PHASE — KHÔNG LÀM GỘP

- P0: audit only; không sửa source; báo cáo và chờ.
- P1: tokens + TopNavBar + StudentHomeView.
- P2: EquipmentSidebar + GuidedStepPanel + DeviceControlInspector.
- P3: NeuralDeviceNetworkModal → Planetary Cosmos graph UI.
- P4: LabViewport HUD/toolbar + performance profiling + full regression.

Mỗi phase chỉ làm sau khi phase trước qua test và người dùng chấp thuận. Mỗi phase một commit riêng trên feature branch. Không commit main.

## 4. VISUAL QUALITY BAR

- Deep space navy, indigo nebula, cyan/blue signal, violet accent; amber chỉ caution/active-energy; green chỉ safe/valid.
- Planetary clusters phải ánh xạ vào category G01–G10 và nodes thật.
- Giữ ảnh thiết bị thật, tên khoa học và asset IDs; không thay bằng hình hành tinh giả.
- Phân biệt edge theo `SynapseKind`; giữ chính xác hướng và bidirectional.
- Node layout deterministic, không random mỗi render.
- Công thức, đơn vị và safety messages phải đọc rõ.
- Glow tinh tế; không game UI lòe loẹt, không bloom/particle quá mức.
- Responsive desktop/tablet/mobile; focus states, keyboard navigation, reduced motion.
- Không làm mất hoặc giấu khó tìm bất kỳ chức năng hiện tại nào.

## 5. PERFORMANCE

- Đo trước khi tối ưu.
- Neural canvas chỉ có một RAF; dừng/cancel khi modal đóng và unmount.
- Không tính layout/physics tốn kém ở mọi frame.
- Ưu tiên transform/opacity; tránh layout thrash.
- Không set React state theo từng frame nếu không cần.
- Dùng renderer/resources Three.js hiện tại; chỉ dispose resource mới do component sở hữu.
- Tôn trọng DPR và reduced motion.
- Nếu an toàn, cung cấp Performance/Balanced/Cinematic; Balanced mặc định.
- Không thêm package, font, remote assets hoặc rendering engine.

## 6. REGRESSION CHECKLIST

Kiểm thử student/teacher switching; mọi navigation; global/recent search; filters; previews; select/add/delete; drag/drop valid/invalid/cancel/pointercancel/load error/modal close; transform/orbit/zoom/grid/ruler/labels/fullscreen; toàn bộ device control/FSM/measurement/SI units; assembly mechanical/electrical/fluid/optical; safety; Neural Guide; category/grade/subject/search; selected node; macro cluster; exact neural drag events; export/share/help/legend; environment editor; recorder; microscope; HTML importer/updater và 7 gates; governance; mobile/touch/keyboard/reduced-motion.

Bất kỳ mục nào fail đều chặn acceptance và phải sửa hoặc rollback.

## 7. VERIFICATION

Sau mỗi phase:
- `npm run lint`
- `npm run build`
- `npm test`
- Browser/manual checks các luồng bị ảnh hưởng và so sánh baseline.

Ghi rõ files changed và lý do chúng chỉ thuộc presentation. Nếu không chạy được test, đánh dấu BLOCKED; không được tự ghi PASS.

Tạo `docs/PLANETARY_COSMOS_ACCEPTANCE_REPORT.md` với commands/output, regression matrix, screenshots, performance before/after và rollback.

## 8. STOP CONDITIONS

Dừng ngay nếu cần sửa domain/solver/assembly/state/event contracts, IDs, module format; nếu cần xóa control; đổi dependencies/build tools; test fail chưa cô lập; thay Canvas 2D bằng WebGL/postprocessing mới; hoặc refactor rộng/App.tsx rewrite. Không lách điều kiện, hãy báo blocker.

## 9. THỰC HIỆN NGAY

Ở lượt này chỉ thực hiện **P0**. Không bắt đầu P1.

Trả về:
1. baseline commit, branch và git status;
2. UI files/contracts đã audit;
3. inventory controls và regression;
4. trạng thái lint/build/test;
5. files dự kiến thay đổi P1–P4;
6. risk register và khuyến nghị.

P0 chỉ được tạo `docs/PLANETARY_COSMOS_AUDIT.md`. Không sửa application source. Kết thúc bằng báo cáo và chờ người dùng xác nhận.
