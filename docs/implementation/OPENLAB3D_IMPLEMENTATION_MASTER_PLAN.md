# KẾ HOẠCH TRIỂN KHAI VÀ TÍCH HỢP TỔNG THỂ OPENLAB 3D
## (OPENLAB 3D UNIFIED IMPLEMENTATION MASTER PLAN)

> **Mã tài liệu:** `OL3D-IMPLEMENTATION-MASTER-PLAN-2026`  
> **Phiên bản:** `v3.1.0` (Coordinator Authoritative Single Plan)  
> **Chủ trì điều phối:** OpenLab 3D Coordinator Agent  
> **Ngày phê duyệt:** 04/11/2026  
> **Dựa trên:** Tổng hợp 5 Báo cáo A1–A5, Master Spec v3.0.0, và Hợp đồng Triển khai v3.1.0

---

## 1. TỔNG HỢP VÀ GIẢI QUYẾT XUNG ĐỘT GIỮA 5 BÁO CÁO AGENT

Qua rà soát và đối chiếu báo cáo của 5 Agent chuyên môn (A1 — A5), Coordinator xác định và xử lý các điểm mấu chốt sau:

| Vấn đề đối chiếu | Đề xuất ban đầu từ Agent | Quyết định cuối cùng của Coordinator | Căn cứ kỹ thuật |
|---|---|---|---|
| **Vị trí của Circuit Solver** | A3 giữ trong `AssemblySystem.ts`, A2 muốn chuyển sang `scientific-solvers/` | Tạo `src/scientific-solvers/CircuitSolver.ts` làm bộ giải chuẩn; `AssemblySystem.ts` tái xuất và chuyển tiếp để bảo toàn 100% tương thích ngược | Nguyên tắc ADD $\to$ ADAPT $\to$ INTEGRATE; không làm gãy các test case hiện hữu |
| **Phạm vi 25 biến môi trường** | Mockup 05 đưa ra danh sách phẳng 25 biến; Master v3.0 quy định 13 biến phòng | Chuẩn hóa phân tầng 3 cấp: 13 biến Core cấp phòng, 12 thuộc tính mẫu vật (Sample-scoped), và Trường cục bộ (Local Fields) | Ngăn ngừa biến môi trường phòng tác động bừa bãi lên thiết bị không liên quan |
| **Nguồn dữ liệu tính toán khoa học** | UI đôi khi tự nội suy công thức; `DeviceControlProfilesData.ts` có logic trùng lặp | Thống nhất `ScientificSolverRegistry` là nguồn duy nhất cung cấp kết quả tính toán derived physical values; UI chỉ hiển thị | Triết lý CIA v1.0 & Zero Fabrication |
| **Độ dài và kết nối dây cáp** | Thao tác 3D và Inspector có thể gây lệch trạng thái cắm dây | `SceneInstance.instanceState.isCablesConnected` là trạng thái chân lý, có kiểm tra giới hạn tầm vươn $L_{max} = 0.70\text{ m}$ | Kịch bản SCI-08 & ASM-11 |
| **Quy trình thực hành** | A3 đề xuất các workflow độc lập | Tạo `src/experiments/ExperimentWorkflows.ts` liên kết trực tiếp với `AssemblyGraphManager` và `ScientificSolverRegistry` | Đảm bảo tính liên thông và sư phạm GDPT 2018 |

---

## 2. MA TRẬN PHÂN CHIA VÙNG SỞ HỮU MÃ NGUỒN

```
openlab-3d/
├── src/
│   ├── scientific-solvers/          # [AGENT A2] Bộ giải khoa học, đo lường & sai số (Mới)
│   │   ├── types.ts
│   │   ├── CircuitSolver.ts
│   │   ├── OpticsSolver.ts
│   │   ├── FluidThermalSolver.ts
│   │   ├── ElectromagneticInductionSolver.ts
│   │   ├── MechanicsSolver.ts
│   │   ├── MetrologyEngine.ts
│   │   ├── ScientificSolverRegistry.ts
│   │   └── index.ts
│   ├── experiments/                 # [AGENT A3] Quy trình thực hành thí nghiệm (Mới)
│   │   ├── ExperimentWorkflows.ts
│   │   └── index.ts
│   ├── device-control/              # [AGENT A1 + COORDINATOR] Cấu tạo & hồ sơ điều khiển
│   │   ├── DeviceControlProfile.ts
│   │   ├── DeviceControlProfilesData.ts
│   │   └── DeviceControlEngine.ts
│   ├── three-runtime/               # [A1, A3, A5 + COORDINATOR] Runtime Three.js
│   │   ├── ProceduralLabModels.ts   # [AGENT A1] Mesh 3D & visual binding
│   │   ├── AssemblySystem.ts        # [AGENT A3] Connectors & Assembly Graph
│   │   ├── LabEnvironmentEngine.ts  # [AGENT A5] 13 biến phòng, coupling map & tọa độ
│   │   └── LabViewport3D.tsx        # [COORDINATOR] Tích hợp viewport & raycast
│   ├── components/
│   │   ├── panels/                  # [AGENT A4] Inspector & khay công cụ
│   │   │   └── DeviceControlInspector.tsx
│   │   ├── common/                  # [AGENT A4] Thẻ nổi & xem trước
│   │   │   └── EquipmentHoverCard.tsx
│   │   └── student/                 # [AGENT A4] Hướng dẫn học sinh
│   │       └── StudentGuidedStepPanel.tsx
│   ├── domain/types.ts              # [COORDINATOR] Shared Types & Hợp đồng toàn cục
│   └── App.tsx                      # [COORDINATOR] Điều phối trạng thái trung tâm
```

---

## 3. LỘ TRÌNH TRIỂN KHAI VÀ THỨ TỰ TÍCH HỢP (7 BƯỚC)

1. **Bước 1 — Freeze Shared Contracts:** Hoàn tất ban hành `docs/OPENLAB3D_IMPLEMENTATION_CONTRACT.md`.
2. **Bước 2 — Triển khai Gói Bộ giải Khoa học (Agent A2):**
   - Tạo thư mục `src/scientific-solvers/`.
   - Viết các bộ giải: `CircuitSolver`, `OpticsSolver`, `FluidThermalSolver`, `ElectromagneticInductionSolver`, `MechanicsSolver`, `MetrologyEngine`.
   - Tạo `ScientificSolverRegistry` và export công khai.
3. **Bước 3 — Triển khai Quy trình Thí nghiệm (Agent A3):**
   - Tạo thư mục `src/experiments/`.
   - Viết `ExperimentWorkflows.ts` cho 6 bài thực hành chuẩn SGK THCS (WF-01 .. WF-06).
   - Tích hợp liên thông với `AssemblySystem.ts`.
4. **Bước 4 — Chuẩn hóa Môi trường & Ma trận Ghép nối (Agent A5):**
   - Nâng cấp `src/three-runtime/LabEnvironmentEngine.ts`.
   - Khẳng định 13 biến toàn cục cấp phòng và phân biệt với 12 thuộc tính mẫu vật.
   - Bổ sung `DeviceEnvironmentCouplingManager`.
5. **Bước 5 — Hoàn thiện Hồ sơ Điều khiển & Cấu tạo Thiết bị (Agent A1):**
   - Liên kết các hàm `evaluateOutputs` trong `DeviceControlProfilesData.ts` sang `ScientificSolverRegistry`.
   - Kiểm tra binding chi tiết trong `ProceduralLabModels.ts`.
6. **Bước 6 — Tích hợp Giao diện Người dùng & Inspector (Agent A4):**
   - Cập nhật `DeviceControlInspector.tsx` hiển thị số đo từ Solver, trạng thái FSM và ngân sách sai số.
   - Hoàn thiện thẻ nổi `EquipmentHoverCard.tsx` và bảng hướng dẫn `StudentGuidedStepPanel.tsx`.
7. **Bước 7 — Kiểm thử Hồi quy Toàn diện & Nghiệm thu (Coordinator):**
   - Chạy TypeScript typecheck (`tsc --noEmit`).
   - Chạy Vite build (`npm run build`).
   - Chạy bộ 24 kịch bản ASM (`verify-assembly-acceptance.ts`).
   - Chạy bộ 24 kịch bản SCI (`verify-scientific-interaction.ts`).
   - Chạy bộ 7 cổng module (`verify-standard-equipment-module.ts`).
   - Chạy bộ UX HUD & Wiring (`verify-ux-wiring-hud-controls.ts`).
   - Xây dựng và chạy bộ kiểm thử tích hợp toàn diện `scripts/verify-full-system-integration.ts`.
   - Lập báo cáo nghiệm thu và hoàn tất hồ sơ bàn giao.

---
*Kế hoạch này là kim chỉ nam điều hành bắt buộc cho mọi bước sửa đổi mã nguồn trong đợt nâng cấp OpenLab 3D.*
