# OPENLAB 3D — PLANETARY COSMOS UI AUDIT & RISK REGISTER (PHASE P0)

- **Audit Date:** 2026-04-20
- **Baseline Repository:** `https://github.com/ltliem89/openlab-3d.git`
- **Baseline Commit SHA:** `e4bb91f92b7582b42b7d46df4c0b83ec469c4bcb` (`release: bump version to v2.4.0`)
- **Active Working Branch:** `ui/planetary-cosmos` (branched cleanly off `main`, `main` remains untouched)
- **Specification Reference:** `docs/PLANETARY_COSMOS_UI_SPEC.md` (v1.0)

---

## 1. Baseline Repository Verification Summary

| Verification Gate | Command | Baseline Status | Details |
| :--- | :--- | :--- | :--- |
| **Typecheck / Lint** | `npm run lint` (`tsc --noEmit`) | **PASS (0 errors)** | Zero TypeScript errors across all domain, solver, 3D runtime, and UI modules |
| **Production Build** | `npm run build` (`vite build`) | **PASS** | Vite bundle compiles cleanly |
| **Scientific Integration Suite** | `npm test` | **PASS (35/35)** | `verify-fluid-simulation-realism.ts` (10/10 PASS) + `verify-full-system-integration.ts` (25/25 PASS) |

---

## 2. Target UI Files Audit (8 Permitted Files)

### 2.1 `src/index.css`
- **Current Role:** Imports Google Fonts (`Plus Jakarta Sans`, `Inter`, `JetBrains Mono`), Tailwind v4 (`@import "tailwindcss";`), base CSS variables, `.lab-glass-panel` / `.lab-glass-pill`, scrollbars, and keyframe animations (`openlab-drop-bounce`).
- **Invariants to Preserve:**
  - Font family definitions (`--font-sans`, `--font-display`, `--font-mono`).
  - Existing `.lab-glass-panel`, `.lab-glass-pill`, `.safe-bottom`, `.no-scrollbar` classes.
  - Keyframes `openlab-drop-bounce`.
- **Planetary Cosmos P1 Upgrade Scope:**
  - Add namespaced `--pc-*` CSS custom properties (`--pc-bg-deep: #050B18`, `--pc-bg-space: #071326`, `--pc-panel-nebula: #0B1930`, `--pc-panel-elevated: #10223D`, `--pc-cyan: #41D9F5`, `--pc-blue: #4D8DFF`, `--pc-violet: #9B83FF`, `--pc-amber: #FFB85C`, `--pc-green: #48D6A0`, `--pc-text-main: #E8F2FF`, `--pc-text-sub: #A8BCD5`, `--pc-border: rgba(130, 180, 230, 0.18)`).
  - Add `.pc-cosmos-shell`, `.pc-nebula-panel`, `.pc-orbital-card`, `.pc-glow-cyan`, `.pc-glow-violet`, `.pc-badge-orbital`, and `@media (prefers-reduced-motion: reduce)` rules.

### 2.2 `src/components/navigation/TopNavBar.tsx`
- **Current Role:** Top navigation command bar containing logo/home button, `Trang chủ` / `Bàn thí nghiệm 3D` mode switcher, global search bar with categorized live dropdown (Lessons, Equipment, Topics, Recent Searches), Student 5-step progress navigator (`Bước 1..5`), `Trợ lý Nơ-ron (Alt+N)` toggle, `Sơ Đồ Nơ-ron` modal launcher, `Làm lại` reset confirmation dialog, theme toggle, and Teacher mode switch.
- **Props & Callbacks (100% Preserved):**
  - `activeTopTab`, `userRole`, `isStudentExploreOnly`, `isDarkMode`, `guidedStep`, `searchQuery`, `recentSearches`, `assets`, `experiments`, `activeExperimentId`, `onChangeTopTab`, `onStartStudentPractice`, `onToggleRole`, `onToggleDarkMode`, `onChangeGuidedStep`, `onSearchChange`, `onCommitSearch`, `onRemoveRecentSearch`, `onClearRecentSearches`, `onSelectAssetFromSearch`, `onSelectExperimentFromSearch`, `onSelectCategoryFromSearch`, `onResetLabTable`, `onOpenHtmlModuleImporter`, `onOpenNeuralNetworkModal`, `isNeuralGuideEnabled`, `onToggleNeuralGuide`.
- **Planetary Cosmos P1 Upgrade Scope:**
  - Restyle header surface into the **Planetary Cosmos Command Deck** (`#050B18`/`#0B1930` deep-space glass, `#41D9F5` cyan orbital accents, `#9B83FF` violet neural accents, `#E8F2FF` high-contrast typography) while keeping all interactive handlers, search dropdown items, and modal dialogs 100% intact.

### 2.3 `src/components/student/StudentHomeView.tsx`
- **Current Role:** Student landing view displaying featured experiments (`Thấu kính - Hình 8.12`, `Đo khối lượng riêng`, `Khúc xạ ánh sáng`, `Cảm ứng điện từ`), quick-start cards, and equipment showcase grid with `EquipmentThumbnailSvg` and real photo triggers.
- **Props & Callbacks (100% Preserved):**
  - `assets`, `experiments`, `activeExperiment`, `isDarkMode`, `onStartPracticeWithExperiment`, `onEnterFreeExplore`, `onInspectAssetDetail`, `onQuickPlaceSet`.
- **Planetary Cosmos P1 Upgrade Scope:**
  - Upgrade visual presentation to the **Planetary Cosmos Experiment Launch Deck** with deep-space nebula cards, orbital telemetry badges, and crisp scientific contrast (`#E8F2FF` / `#A8BCD5`) without altering experiment IDs or launch callbacks.

### 2.4 `src/components/student/StudentEquipmentSidebar.tsx`
- **Current Role:** Collapsible left equipment catalog sidebar with `Thư viện` (`libraries3DLab`) folder path manager, `.HTML` module importer button, search input + 5 recent searches popover, quick experiment selector (`Soi Kính hiển vi 3D`, `Bài 8–9: Bộ Thấu kính`, `Bài 14: Đo Khối lượng riêng`), 9 reference category filters, 2-column draggable equipment cards with real photo preview button and right-click context menu, plus `EquipmentHoverCard`.
- **Props & Callbacks (100% Preserved):**
  - All props in `StudentEquipmentSidebarProps`, `ReferenceLibraryCategoryId` export, `data-module-id={asset.assetId}`, `application/openlab-asset-id` drag payload, `openlab:open-microscope` CustomEvent.
- **Planetary Cosmos P2 Upgrade Scope:**
  - Restyle sidebar container, category constellation pills, and equipment cards using Planetary Cosmos tokens (`#071326`, `#0B1930`, `#41D9F5` active borders, `#48D6A0` on-table indicators) while preserving all thumbnails, drag-and-drop, context menu actions, and library path tools.

### 2.5 `src/components/student/StudentGuidedStepPanel.tsx`
- **Current Role:** Collapsible right guided-practice panel displaying the active textbook experiment selector, quick-assembly button (`⚡ Lắp ráp Bộ Thấu kính (Hình 8.12)` or `Đặt đủ dụng cụ bài này xuống bàn`), vertical list of 5 practice steps (`StudentGuidedStepNumber = 1 | 2 | 3 | 4 | 5`), and `Tiếp theo` / `Làm lại` footer button.
- **Props & Callbacks (100% Preserved):**
  - `StudentGuidedStepNumber` export and all `StudentGuidedStepPanelProps`.
- **Planetary Cosmos P2 Upgrade Scope:**
  - Style steps as **Orbital Experiment Phases** with glowing phase nodes (`#41D9F5` active, `#48D6A0` completed, `#0B1930` card surfaces) and high-contrast Vietnamese typography.

### 2.6 `src/components/panels/DeviceControlInspector.tsx`
- **Current Role:** Scientific instrument control panel rendering device profile title, curriculum lesson, **Mạng Nơ-ron Nhân Quả** checklist (Dendrites input, Axons output, missing prerequisite hint, `Mở Sơ đồ Nơ-ron Toàn Cảnh` button), **Thông số đo & Kết quả** (live `evaluateOutputs`, FSM state badge, LaTeX equations), **Thao tác điều khiển** (`slider`, `dial`, `switch`, `button`, per-part help popover), and **Lưu ý An toàn Thí nghiệm**.
- **Invariants (100% Preserved):**
  - `deviceControlEngine.getProfile`, `deviceControlEngine.evaluateOutputs`, `neuralConnectionEngine.getCausalChecklist`, `handlePartChange`, `handleResetToDefault`, `openlab:open-neural-modal` and `openlab:neural-guide-toggle` CustomEvents.
- **Planetary Cosmos P2 Upgrade Scope:**
  - Upgrade visual presentation to a **Holographic Scientific Instrument Panel** with `#0B1930`/`#10223D` telemetry readouts, `#41D9F5` digital displays, `#9B83FF` dendrite badges, `#4D8DFF` axon badges, and `#FFB85C` safety callouts.

### 2.7 `src/components/modals/NeuralDeviceNetworkModal.tsx`
- **Current Role:** Interactive 2D HTML5 Canvas modal displaying the 36-device causal network (`NEURAL_DEVICE_NODES`), 47 directed synapses (`NEURAL_SYNAPSE_EDGES`), 10 SGK macro-clusters (`MACRO_EXPERIMENT_CLUSTERS`), dual-mode (`student` / `expert`), grade filter (`ALL`, `grade6..9`), causal challenge mini-game, WebAudio synthesizer (`NeuralSoundEngine`), 3D drag-to-table bridge (`openlab:neural-drag-preview`, `openlab:neural-drag-drop`), PNG export, and right-hand detail drawer.
- **Invariants (100% Preserved):**
  - All 36 `NeuralDeviceNode` definitions, `NEURAL_SYNAPSE_EDGES`, `MACRO_EXPERIMENT_CLUSTERS`, `CATEGORY_META` (`G01`–`G10`), `SYNAPSE_META`, and CustomEvents (`openlab:neural-drag-preview`, `openlab:neural-drag-drop`).
- **Planetary Cosmos P3 Upgrade Scope:**
  - Transform the canvas and modal chrome into the **Planetary Cosmos Orbital Knowledge Map**:
    1. Render subtle deep-space starfield, nebula radial glow, and concentric orbital rings with category sector labels (`G01`–`G10`).
    2. Render nodes as **Planetary / Satellite Nodes** with orbital rings, degree-scaled radius (`r = base + k * sqrt(deg)`), and a clear **Node Size & Orbital Legend** overlay on the canvas.
    3. Differentiate `SynapseKind` trajectories (`power_supply`, `mechanical_mount`, `optical_beam`, `fluid_transfer`, `measurement_target`, `thermal_transfer`, `magnetic_flux`) with distinct stroke styles, directional arrows, and animated energy pulses.
    4. Add a **Render Quality Selector** (`Performance` / `Balanced` / `Cinematic`, defaulting to `Balanced`) that controls starfield density, glow blur, and particle count, and respects `prefers-reduced-motion: reduce`.
    5. Add an **Accessible List / Table View Toggle (`Chế độ Danh sách`)** alongside the Canvas view so keyboard-only and screen-reader users can browse, filter, inspect causal inputs/outputs, and place any of the 36 devices onto the 3D bench.

### 2.8 `src/three-runtime/LabViewport3D.tsx`
- **Current Role:** Main Three.js WebGL simulation viewport + React HUD overlays (top-left coordinate/clock pill, top-right compact toolbar, bottom compact 2-row device control dock, water dispenser valve bar, right-click context menu, and modals).
- **Invariants (100% Preserved):**
  - All 3D scene graph logic, physics/docking (`evaluateLabDockingTarget`), optical Snell ray-tracing (`traceOpticalBenchRays`), fluid simulation, custom events, and props/callbacks.
- **Planetary Cosmos P4 Upgrade Scope:**
  - Restyle top-left, top-right, and bottom device dock HUD overlays to match the Planetary Cosmos glass aesthetic (`#050B18`/`#0B1930` translucent HUD, `#41D9F5` cyan borders, `#E8F2FF` crisp typography) while keeping the bottom bar ultra-compact so it never obscures 3D equipment.

---

## 3. Risk Register & Mitigation Matrix

| Risk ID | Description | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **R-01** | Breaking 3D Drag-and-Drop from `NeuralDeviceNetworkModal` to `LabViewport3D` | High | Do not alter the pointer drag threshold, `isDraggingToScene` state transitions, or `openlab:neural-drag-preview` / `openlab:neural-drag-drop` CustomEvent detail payloads. |
| **R-02** | Canvas RAF memory leak or duplicate animation loops in `NeuralDeviceNetworkModal` | Medium | Ensure a single `requestAnimationFrame` ID is tracked and cancelled in the `useEffect` cleanup when `isOpen` is false or component unmounts. |
| **R-03** | Low text contrast on translucent glass panels over bright 3D scenes | Medium | Enforce `--pc-text-main: #E8F2FF` and `--pc-text-sub: #A8BCD5` on `#0B1930`/`#050B18` surfaces with `backdrop-blur-xl` and subtle text drop-shadows where needed (WCAG AA >= 4.5:1). |
| **R-04** | Regressing scientific solver or device control evaluations | High | Zero edits to `src/scientific-solvers/**`, `src/device-control/**`, `src/domain/**`, `src/repositories/**`, or `AssemblySystem.ts`. Run `npm test` after every phase. |
| **R-05** | Excessive GPU load on lower-end student laptops | Medium | Default `NeuralDeviceNetworkModal` quality mode to `Balanced`, cap `devicePixelRatio` to `Math.min(window.devicePixelRatio, 2)`, and provide `Performance` mode + `prefers-reduced-motion` support. |

---

## 4. Phased Implementation Plan (P1 → P4)

1. **Phase P1 (`ui(cosmos): phase 1 design tokens and navigation shell`)**:
   - Update `src/index.css` with `--pc-*` tokens and `.pc-*` utility classes.
   - Upgrade `src/components/navigation/TopNavBar.tsx` and `src/components/student/StudentHomeView.tsx`.
2. **Phase P2 (`ui(cosmos): phase 2 equipment sidebar guided steps and inspector`)**:
   - Upgrade `src/components/student/StudentEquipmentSidebar.tsx`, `src/components/student/StudentGuidedStepPanel.tsx`, and `src/components/panels/DeviceControlInspector.tsx`.
3. **Phase P3 (`ui(cosmos): phase 3 planetary cosmos network modal`)**:
   - Upgrade `src/components/modals/NeuralDeviceNetworkModal.tsx` with Planetary Cosmos orbital rings, degree-based planetary node rendering, quality mode switch (`Performance`/`Balanced`/`Cinematic`), and Accessible List View toggle.
4. **Phase P4 (`ui(cosmos): phase 4 viewport hud polish and acceptance report`)**:
   - Upgrade HUD overlays in `src/three-runtime/LabViewport3D.tsx`, verify raycast precision and optical lamp ray projection, run full test & build verification (`npm run lint`, `npm test`, `npm run build`), and publish `docs/PLANETARY_COSMOS_ACCEPTANCE_REPORT.md`.
