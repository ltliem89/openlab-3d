# OPENLAB 3D — PLANETARY COSMOS UI UPGRADE SPEC

**Version:** 1.0  
**Repository:** `ltliem89/openlab-3d`  
**Branch strategy:** Dedicated feature branch from `main`; never edit `main` directly  
**Audit baseline:** `e4bb91f92b7582b42b7d46df4c0b83ec469c4bcb`  
**Date:** 2026-11-07

## 1. Mục tiêu và ranh giới

Nâng cấp lớp giao diện OpenLab 3D theo phong cách **Planetary Cosmos**: bản đồ hành tinh khoa học, trung tâm điều khiển holographic và phòng thí nghiệm tương lai. Giao diện cần hiện đại, trực quan, mượt, dễ dùng cho học sinh và giáo viên.

Đây là nhiệm vụ **UI/UX + presentation + tối ưu hiệu năng hiển thị**, không phải rewrite hoặc tái kiến trúc. Giữ nguyên toàn bộ chức năng, logic, dữ liệu, luồng tương tác và kết quả khoa học. Chỉ thay đổi bố cục, style, cách biểu đạt trực quan, tiện ích điều khiển giao diện và tối ưu render có kiểm chứng.

## 2. Repository đã kiểm tra

Nhánh mặc định: `main`. Baseline tree SHA: `e4bb91f92b7582b42b7d46df4c0b83ec469c4bcb`.

Đã đọc các tài liệu/mã nguồn trọng yếu:
- `README.md`
- `docs/OPENLAB3D_IMPLEMENTATION_CONTRACT.md` (OL3D Implementation Contract v3.1.0)
- `docs/CAY_HE_THONG_OPENLAB3D.md`
- `RWSS_OpenLab3D_v1.1.1/01_ENVIRONMENT_LAYER.md`
- `RWSS_OpenLab3D_v1.1.1/02_OBJECT_LAYER.md`
- `RWSS_OpenLab3D_v1.1.1/03_INTERACTION_LAYER.md`
- `RWSS_OpenLab3D_v1.1.1/04_OPENLAB_OPERATION_COMMAND.md`
- `RWSS_OpenLab3D_v1.1.1/05_ASSEMBLY_ACCEPTANCE_CRITERIA.md`
- `src/App.tsx`
- `src/index.css`
- `src/components/navigation/TopNavBar.tsx`
- `src/components/student/StudentHomeView.tsx`
- `src/components/student/StudentEquipmentSidebar.tsx`
- `src/components/student/StudentGuidedStepPanel.tsx`
- `src/components/panels/DeviceControlInspector.tsx`
- `src/components/modals/NeuralDeviceNetworkModal.tsx`
- `src/domain/types.ts`
- `src/domain/neuralNetworkTopology.ts`
- `src/domain/neuralConnectionEngine.ts`
- `src/three-runtime/LabViewport3D.tsx`
- `src/three-runtime/LabEnvironmentEngine.ts`
- `src/three-runtime/AssemblySystem.ts`
- `package.json`

Các scripts hiện có: `npm run lint`, `npm run build`, `npm test`. Dependencies gồm React 19, TypeScript, Three.js 0.186.x, Vite 8.x, Tailwind 4.x và Motion 12.x. Không cập nhật dependencies cho nhiệm vụ này.

**Giới hạn audit từ xa:** Đọc repository trên GitHub không cho biết `git status` trên máy làm việc, không chạy terminal/browser tại workspace và không xác nhận tình trạng build trên máy người dùng. Antigravity phải kiểm tra Git và chạy baseline tests cục bộ trước khi sửa source.

## 3. Bất biến bắt buộc

1. Không viết lại `src/App.tsx` hoặc state orchestrator.
2. Không thay đổi domain types, schema, repository contracts, IDs, enum, public props, callback signatures, event names hoặc payload.
3. Không sửa solver khoa học, device FSM, Assembly/Connector rules, tính toán môi trường, hằng số vật lý, tọa độ SI, safety rules hoặc measurement outputs.
4. Giữ nguyên pipeline sáu giai đoạn:

   `User Action → Assembly Graph → Device State → Scientific Solvers → 3D Rendering → UI/HUD Feedback`

5. `SceneInstance.instanceState` luôn là nguồn chân lý duy nhất của trạng thái thiết bị. Không tạo shadow physical state trong UI.
6. Bảo toàn toàn bộ 36 Asset ID, archetype slug, catalog key, connector ID, experiment ID, macro-cluster ID, neural node/edge ID và dữ liệu người dùng.
7. Giữ module contract `window.OL3D_EQUIPMENT_MODULE` và bảy validation gates.
8. Neural topology/connection engine là domain data/logic; renderer chỉ đọc, không phát minh hoặc viết lại quan hệ.
9. Không mô tả topology/semantic rule graph là mô hình AI đã huấn luyện. Giữ đúng ý nghĩa hiện có của mạng tri thức/kết nối thiết bị.
10. Giữ nguyên callback props, CustomEvent contracts và payload.
11. Không tạo số đo, trạng thái ghép nối hoặc mô phỏng thành công giả. Không dùng animation làm sai lệch trạng thái vật lý.
12. Không xóa dữ liệu, migration, update package/lockfile, force-push, commit vào `main` hoặc deploy tự động.
13. Tuân thủ `ADD → ADAPT → INTEGRATE → VERIFY`.
14. Bảo đảm accessibility, keyboard/touch, reduced motion và tính dễ đọc của thông tin khoa học.

## 4. Thiết kế Planetary Cosmos

Định hướng: **premium scientific instrument + orbital knowledge map**, không phải game fantasy.

Bảng màu tham khảo:
- Deep space: `#050B18`, `#071326`
- Nebula panel: `#0B1930`, `#10223D`
- Cyan signal: `#41D9F5`
- Electric blue: `#4D8DFF`
- Violet: `#9B83FF`
- Amber: `#FFB85C` (cảnh báo/hoạt động phù hợp)
- Green: `#48D6A0` (trạng thái an toàn/hợp lệ)
- Main text: `#E8F2FF`
- Secondary text: `#A8BCD5`
- Border: `rgba(130,180,230,.18)`

Quy tắc:
- Nhóm thiết bị G01–G10 có thể hiển thị như các hệ hành tinh/chòm sao.
- Mỗi thiết bị được biểu diễn như hành tinh/vệ tinh nhưng giữ tên, `assetId` và category thật.
- Đường nối phải phân biệt theo `SynapseKind` thật; giữ chiều và ý nghĩa liên kết.
- Kích thước node/glow chỉ mã hóa thuộc tính domain hiện có và cần legend.
- Starfield/nebula/parallax tinh tế; không particle storm.
- Giữ grid, scale, labels, arrows và legend rõ ràng.
- Giữ thumbnails và ảnh thiết bị thật; không thay bằng hình hành tinh giả.
- Phân biệt rõ biểu tượng hành tinh với thiết bị thực tế.
- Chuyển động nền chậm; hover/selection ngắn; tránh animation vô hạn nặng trên mọi node.

## 5. Component scope — chỉ presentation

### `src/index.css`
Thêm namespaced design tokens/classes; giữ global layout, safe-area và canvas rules. Tránh selector làm ảnh hưởng Three.js canvas, form controls hay HTML equipment module. Có reduced-motion và contrast safeguards.

### `src/components/navigation/TopNavBar.tsx`
Restyle thành command deck. Giữ role switch, student navigation, search/recent search, notifications, dark mode, fullscreen, reset confirmation, Neural Guide toggle, open modal, importer, quick-add và progress steps. Giữ nguyên props/callbacks; mobile menu phải có đủ chức năng.

### `src/components/student/StudentHomeView.tsx`
Restyle thành experiment launch deck. Giữ experiment list, kits, direct lab entry, explore equipment, kit view và help. Render dữ liệu từ props; không hardcode lại.

### `src/components/student/StudentEquipmentSidebar.tsx`
Restyle catalog thành các cụm/chòm sao thiết bị. Giữ search, recent searches, filters, real photo preview, hover card, equipment details, import/update, selection và add-to-table. Không cắt giảm catalog hoặc thay asset identity.

### `src/components/student/StudentGuidedStepPanel.tsx`
Cải thiện phase markers và hierarchy hướng dẫn. Giữ step model 1..5, experiment switching, add/select/delete, state updates, reset, details và video help. Không auto-skip/auto-complete do animation.

### `src/components/panels/DeviceControlInspector.tsx`
Restyle holographic instrument panel. Giữ profile lookup, `evaluateOutputs`, `SceneInstance` state, `onUpdateInstanceState`, Neural Guide toggle, safety warnings, help, part controls, FSM labels và scientific outputs. UI không phải nguồn chân lý vật lý.

### `src/components/modals/NeuralDeviceNetworkModal.tsx`
Đây là mục tiêu Planetary Cosmos chính. Giữ `NEURAL_DEVICE_NODES`, `NEURAL_SYNAPSE_EDGES`, `EXPERIMENT_MACRO_CLUSTERS`, ý nghĩa `CATEGORY_META`/`SYNAPSE_META`, filters grade/category/subject, search, selected device, `initialDeviceId`, `activeSceneDeviceIds`, `onSelectDevice`, `onTriggerMacroCluster`, `onClose`, toàn bộ controls và CustomEvents drag preview/drop với exact payload. Giữ export/share/legend/help đang có. Bổ sung text/list accessible alternative.
- Node layout phải deterministic.
- Không tính layout O(N²) mỗi animation frame.
- Nếu Canvas 2D hiện tại đủ tốt, giữ lại và cải tiến; không tự động chuyển sang Three.js.
- Chỉ chấp nhận 3D network replacement khi tách biệt, có số liệu chứng minh không suy giảm performance/accessibility.

### `src/three-runtime/LabViewport3D.tsx`
Chỉ sửa overlay/HUD/toolbar presentation và CSS hooks. Không thay scene construction, solver, renderer setup, event handlers hoặc controls. Giữ OrbitControls/TransformControls, coordinates, grid, ruler, labels, camera, selection, drag/drop, transform modes, recording, environment, sound, warnings, shelf, quick actions và neural cues. Không thay tọa độ hoặc transforms. Không thêm bloom/particle nặng trên toàn scene vì hiện tại đã có lighting, animations, water, optics và neural particles.

## 6. Regression matrix

Baseline và hậu kiểm phải bao gồm:
1. Student/teacher role switching.
2. Student home → equipment explorer → lab room → kits → help.
3. Teacher navigation: overview, library, lab workspace, kits, environments, governance.
4. Global search, recent search, commit/clear.
5. Tất cả category filters, thumbnails và real photo previews.
6. Select/add/delete equipment, instance handling, remove/reset.
7. Drag/drop valid snap, invalid drop, cancel, pointercancel, modal close, asset load failure.
8. Translate/rotate/select, orbit, zoom, fullscreen, grid, ruler, labels.
9. Tất cả device controls, FSM, live measurements, SI conversions.
10. Assembly mechanical/electrical/fluid/optical, connector compatibility, safety.
11. Neural Guide toggle, contextual synapse, category/grade/subject/search.
12. Neural modal selection và macro-cluster callbacks.
13. Existing export/share và exact event payload.
14. Environment variables và reset.
15. Recorder, captured frames, milestones, downloaded output.
16. Microscope modal and controls.
17. HTML module import/update và 7 gates.
18. Governance/verification UI và notifications.
19. Keyboard, touch và reduced motion.
20. Resize và mobile viewport.

## 7. Performance requirements

- Tối ưu DOM/layout/render scheduling trước khi thêm effects.
- Ưu tiên `transform`/`opacity`; tránh layout-triggering animations.
- Chỉ debounce search nếu không đổi semantics.
- Chỉ memoize khi có căn cứ đo.
- Neural modal: một RAF; stop/cancel khi đóng/unmount; không animate hidden modal.
- Cleanup listeners, observers, timers, object URLs, textures, geometry/material do component sửa đổi sở hữu.
- Chỉ dispose resource mới do component UI tạo; không dispose shared AssetLoader resources.
- Tôn trọng DPR; giới hạn canvas resolution và particles theo thiết bị.
- Có thể cung cấp Performance / Balanced / Cinematic; Balanced mặc định, Performance phù hợp máy GPU tích hợp.
- Có reduced-motion.
- Không thêm package, external font, remote asset hoặc renderer mới.
- Đo before/after: startup/build, neural modal open responsiveness, interaction latency, frame time, memory khi mở/đóng lặp. Không khai đạt mục tiêu nếu chưa đo.

## 8. Phased delivery

**P0 — Audit, không sửa source**
- Audit đầy đủ components, imports, props, event listeners và controls.
- Ghi nhận baseline.
- Phân loại file thuần presentation và file trộn logic.
- Tạo `docs/PLANETARY_COSMOS_AUDIT.md`.
- Dừng và báo cáo; không sửa application source.

**P1 — Design tokens và shell**
- Thêm namespaced tokens/classes.
- Restyle TopNavBar và StudentHomeView.
- Test navigation, build, lint, test.

**P2 — Equipment và learning UI**
- Restyle sidebar, guided panel, inspector.
- Giữ callback/state paths.
- Test equipment và các control profile.

**P3 — Planetary network**
- Restyle NeuralDeviceNetworkModal.
- Giữ graph semantics; ưu tiên Canvas 2D hiện tại.
- Test filters, selection, drag/drop, macro cluster, accessibility, cleanup.

**P4 — Viewport HUD và performance**
- Restyle HUD/toolbar only.
- Không sửa scene/solver/coordinates.
- Profile và full regression.

Mỗi phase một commit trên feature branch sau khi test qua. Nếu connector không chạy được test thì đánh dấu BLOCKED để chạy tại terminal local.

## 9. Stop conditions

Dừng nếu phải sửa domain logic, solver, assembly constraints, asset schemas, state orchestrator, event contracts, IDs hoặc module format; nếu phải xóa control, update dependencies, thay renderer mới, rewrite rộng hoặc nếu có test lỗi chưa cô lập.

## 10. Acceptance report và rollback

Tạo `docs/PLANETARY_COSMOS_ACCEPTANCE_REPORT.md` gồm baseline commit/branch, file changes, xác nhận domain/solver/assembly/data contract không thay đổi, checklist PASS/FAIL/BLOCKED, command output, performance before/after, screenshots, known issues và rollback.

Không tuyên bố bảo toàn 100% khi chưa chạy regression matrix. Chỉ làm trên feature branch; một phase một commit; revert commit phase khi regression; không force-push, không reset user changes, không merge main/deploy tự động.
