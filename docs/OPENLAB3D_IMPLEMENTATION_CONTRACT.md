# HỢP ĐỒNG TRIỂN KHAI KỸ THUẬT TOÀN DIỆN OPENLAB 3D
## (OPENLAB 3D SYSTEM INTEGRATION & IMPLEMENTATION CONTRACT)

> **Mã tài liệu:** `OL3D-IMPLEMENTATION-CONTRACT-2026`  
> **Phiên bản:** `v3.1.0` (Unified Authoritative Contract)  
> **Cơ quan ban hành:** OpenLab 3D Architecture & Coordination Team  
> **Ngày ban hành:** 04/11/2026  
> **Áp dụng cho:** Điều phối viên (Coordinator) và 5 Nhóm Chuyên môn (A1 — A5)  
> **Căn cứ kỹ thuật:**
> - Master Spec v3.0.0 (`BAO_CAO_TONG_THE_KIEN_TRUC_VA_HE_THONG_OPENLAB3D.md`)
> - Cây hệ thống OpenLab 3D (`CAY_HE_THONG_OPENLAB3D.md`)
> - Mô hình điều phối 6 Agent (`OPENLAB3D_6_AGENT_ORCHESTRATION.md`)
> - 5 Bản đặc tả Mockup (`OPENLAB3D_FIVE_MOCKUPS/01..05`)
> - Kiến trúc nhân quả CIA v1.0 & Chuẩn nghiệm thu RWSS v1.1.1

---

## 1. NGUYÊN TẮC BẢO TOÀN HỆ THỐNG & TRIẾT LÝ NHÂN QUẢ (CIA)

### 1.1. Chu trình nhân quả thống nhất (The 6-Stage Causal Pipeline)
Mọi tương tác trong hệ thống OpenLab 3D bắt buộc tuân thủ đúng thứ tự một chiều:

$$\text{User Action} \longrightarrow \text{Assembly Graph} \longrightarrow \text{Device State} \longrightarrow \text{Scientific Solvers} \longrightarrow \text{3D Rendering} \longrightarrow \text{UI / HUD Feedback}$$

1. **User Action:** Thao tác người dùng từ con trỏ chuột, chạm cảm ứng hoặc phím bấm phát sinh sự kiện điều khiển có định kiểu (`DeviceAction`).
2. **Assembly Graph:** Kiểm tra quan hệ cơ khí, điện, quang học, chất lỏng xem đối tượng có đang liên kết hoặc bị ràng buộc không.
3. **Device State:** Cập nhật trạng thái máy trạng thái cục bộ (`SceneInstance.instanceState`) qua bộ bảo vệ (`Guards`).
4. **Scientific Solvers:** Bộ giải định luật vật lý/hóa học tính toán các đại lượng phát sinh (quang thông, dòng điện, áp suất, độ dãn lò xo, số chỉ đo).
5. **3D Rendering:** Engine Three.js cập nhật trực quan hóa hình học, tia sáng, vật thể biến dạng, chất lỏng, chỉ thị led/màn hình.
6. **UI / HUD Feedback:** Cập nhật bảng kiểm định, thanh tra chi tiết (`Inspector`), HUD đo lường và cảnh báo an toàn.

### 1.2. Mười điều răn bảo toàn hệ thống (Non-Destructive Rules)
1. **Không rewrite toàn bộ:** Giữ nguyên khung ứng dụng React 19, TypeScript strict, Three.js và Tailwind CSS.
2. **Bảo toàn định danh:** Giữ nguyên 36 Asset ID (`OL3D-EQP-...`), archetype slug, catalog key và connector ID.
3. **Không tạo state song song:** `SceneInstance.instanceState` là nguồn chân lý duy nhất cho trạng thái thực tế của thiết bị trên bàn thí nghiệm. UI không được tự ý lưu trữ một bản sao trạng thái vật lý độc lập.
4. **Không làm giả kết quả (Zero Fabrication):** Mọi số đo và hiện tượng hiển thị phải bắt nguồn từ tính toán khoa học hoặc trạng thái thực của mạch/hệ thống. Tuyệt đối không hard-code số đo ảo khi chưa có điều kiện vật lý thực tế.
5. **Đơn vị chuẩn SI:** Toàn bộ tính toán trong các solver sử dụng hệ đơn vị đo lường quốc tế SI (m, kg, s, A, K, N, Pa, V, $\Omega$, W, lux). Việc hiển thị đơn vị thứ cấp (cm, mm, g, ml, kPa) chỉ diễn ra ở tầng giao diện hiển thị.
6. **Tách biệt 3 phạm vi biến môi trường:** Biến cấp phòng toàn cục (Global Room Environment - 13 biến), Biến thuộc tính mẫu vật (Sample-Scoped Properties - 12 biến) và Trường cục bộ phát sinh bởi thiết bị (Device-Generated Local Fields).
7. **Phân quyền module nghiêm ngặt:** Mỗi Agent chỉ thao tác trên thư mục/file thuộc phạm vi phân công; Coordinator điều phối các file dùng chung (`App.tsx`, `types.ts`, `AssemblySystem.ts`, `LabEnvironmentEngine.ts`).
8. **Đánh dấu xuất xứ dữ liệu (Provenance):** Các tham số chưa qua thẩm định thực nghiệm phải giữ cờ `reported`, `illustrative` hoặc `not-verified`.
9. **Bảo đảm tương thích ngược:** Giữ nguyên định dạng `window.OL3D_EQUIPMENT_MODULE` và 7 cổng kiểm định tự động cho các module `.html` độc lập.
10. **Quy tắc thay đổi mã:** Mọi sửa đổi phải tuân theo chu trình: $\text{ADD} \to \text{ADAPT} \to \text{INTEGRATE} \to \text{VERIFY}$.

---

## 2. HỢP ĐỒNG THỰC THỂ & DỮ LIỆU THIẾT BỊ (ENTITY & ASSET CONTRACT)

### 2.1. Cấu trúc AssetDefinition (Bất biến)
`AssetDefinition` đại diện cho định nghĩa tĩnh trong Catalog:
- `assetId`: Chuỗi bất biến định dạng `OL3D-EQP-[CAT]-[NUM]`.
- `slug`: Tên định danh url thân thiện.
- `name`: Đa ngôn ngữ `{ vi: string, en: string }`.
- `equipmentGroupG`: Phân nhóm từ `G01` đến `G10`.
- `physicsFidelityLevel`: Mức độ trung thực vật lý (`L1` .. `L4`).
- `geometry`: Đặc tả hình học Three.js, bounding box kích thước mét, danh sách namedNodes.
- `scientificProperties`: Thuộc tính vật lý chuẩn (vật liệu, khối lượng chuẩn, thể tích, khối lượng riêng, tiêu cự, nhiệt độ).
- `measurementMetadata`: Thông số đo lường (GHĐ, ĐCNN, phương pháp chuẩn hóa zero, cấp chính xác).
- `capabilities`: Danh sách các năng lực tương tác.
- `provenance`: Nguồn gốc xuất xứ dữ liệu và giấy phép.

### 2.2. Cấu trúc SceneInstance & instanceState (Động)
`SceneInstance` đại diện cho bản thể vật thể được thả vào phòng thí nghiệm 3D:
```ts
export interface SceneInstance {
  instanceId: string;
  assetId: string;
  assetVersion: string;
  customLabel?: string;
  parentZone: 'bench-main' | 'bench-scale' | 'bench-glassware' | 'retort-holder';
  transform: {
    positionM: [number, number, number];
    rotationRad: [number, number, number];
    displayScale: [number, number, number];
  };
  visible: boolean;
  locked: boolean;
  labelVisible: boolean;
  instanceState: Record<string, any>;
}
```

---

## 3. HỢP ĐỒNG BỘ PHẬN & HỒ SƠ ĐIỀU KHIỂN (PART CONTROLS & PROFILE CONTRACT)

### 3.1. Phân loại cơ cấu điều khiển (Control Archetypes)
Mỗi bộ phận trên thiết bị được điều khiển thông qua cấu trúc `DevicePartSpec`:
1. `rotary`: Núm xoay vô cấp hoặc có khấc, góc quay xác định (núm chỉnh điện áp, van khóa buret, núm lấy nét sơ cấp/vi cấp).
2. `linear`: Trượt dọc trục theo khoảng hành trình xác định (hàm động thước cặp, đế trượt giá quang học).
3. `button`: Nút bấm nhấn nhả có đàn hồi (phím TARE cân điện tử, nút bấm nguồn).
4. `switch`: Công tắc lật chuyển trạng thái bật/tắt (công tắc đèn, công tắc đảo chiều dòng điện).
5. `dial`: Bàn xoay chọn chế độ (núm xoay thang đo đồng hồ vạn năng DMM, mâm vật kính kính hiển vi).
6. `clamp`: Cơ cấu kẹp giữ vật lý (kẹp chữ G, kẹp ống nghiệm, kẹp giá quang học).
7. `connector`: Cọc cắm hoặc miệng nối (cọc bắp chuối, vòi rót).
8. `readout`: Bộ phận hiển thị chỉ thị (màn hình LCD 7 đoạn, thước chia vạch).

### 3.2. Cấu trúc DeviceControlProfile
Mọi thiết bị phải đăng ký trong `DEVICE_CONTROL_PROFILES`:
- `deviceId`: Mã thiết bị.
- `archetype`: Định danh mô hình thủ tục tương ứng.
- `titleVi`: Tên thiết bị tiếng Việt.
- `group`: Phân nhóm `G01` .. `G10`.
- `parts`: Danh sách các chi tiết tương tác `DevicePartSpec[]`.
- `initialState`: Giá trị khởi tạo chuẩn.
- `stateSchema`: Định kiểu từng trường trong `instanceState`.
- `transitions`: Máy trạng thái FSM (From, Event, To, Guard).
- `equations`: Danh mục công thức khoa học (MathType LaTeX).
- `outputs`: Định nghĩa các đại lượng đầu ra hiển thị.
- `safetyRules`: Cảnh báo thao tác sai hoặc vượt ngưỡng an toàn.
- `testCases`: Các kịch bản kiểm thử đơn vị.
- `evaluateOutputs(state, env?, topology?)`: Hàm đánh giá đầu ra liên kết với Scientific Solver.

---

## 4. HỢP ĐỒNG GHÉP NỐI & ĐỒ THỊ LẮP RÁP (ASSEMBLY GRAPH & CONNECTOR CONTRACT)

### 4.1. Phân loại cổng ghép nối (Connector Kinds)
Hệ thống quản lý 9 loại connector vật lý cơ bản:
- `mechanical_support`: Mặt phẳng đỡ trọng lực (mặt bàn, đĩa cân).
- `mechanical_clamp`: Cơ cấu kẹp (mỏ kẹp thước cặp, kẹp giá thí nghiệm).
- `mechanical_hook`: Móc treo tải trọng lực (móc lực kế lò xo, móc quả cân).
- `mechanical_rail`: Ray trượt dẫn hướng 1D (ray giá quang học 100 cm).
- `optical_carrier`: Con chạy gắn trên ray dẫn hướng.
- `optical_socket`: Ổ lắp thấu kính, màn hứng hoặc khe chắn sáng.
- `electrical_terminal`: Cọc cắm điện phân cực (+/-) chuẩn jack 4mm bắp chuối.
- `fluid_spout`: Vòi xả hoặc vòi rót chất lỏng (vòi bình tràn, vòi bình cấp nước).
- `fluid_receptacle`: Miệng thu nhận chất lỏng (ống đong, cốc đốt, bình tam giác).

### 4.2. Nguyên tắc vận hành Assembly Graph
1. **Dung sai bắt điểm (Snap Tolerance):** Mỗi loại kết nối có ngưỡng snap riêng biệt (điện: 6.5 cm, quang học: 4.0 cm, cơ khí: 5.0 cm, chất lỏng: 6.0 cm).
2. **Khóa bậc tự do (DoF Constraints):** Khi được ghép, vật thể bị giới hạn chuyển động theo đúng cơ cấu (ví dụ: con chạy trên ray quang chỉ được dịch chuyển dọc trục Z của ray).
3. **Chiếm dụng đơn nhất (Exclusive Occupancy):** Các slot đơn nhất (như ổ cắm thấu kính) khi đã có vật thì từ chối vật mới hoặc tự động giải phóng vật cũ về vị trí an toàn.
4. **Không tạo liên kết ma (No Orphan Edges):** Khi tháo dỡ một thiết bị, mọi cạnh liên kết nối với thiết bị đó trong đồ thị lắp ráp phải được thu hồi sạch sẽ.
5. **Dây nối thực (Physical Cabling):** Dây điện có chiều dài tối đa $L_{max} = 0.70\text{ m}$. Nếu khoảng cách giữa nguồn và phụ tải vượt quá $L_{max}$, dây tự động tuột và mạch hở tức thì.

---

## 5. HỢP ĐỒNG BỘ GIẢI KHOA HỌC & ĐO LƯỜNG (SCIENTIFIC SOLVERS & METROLOGY CONTRACT)

### 5.1. Cấu trúc chuẩn SolverInput & SolverResult
```ts
export interface SolverInput<TState = Record<string, any>> {
  instanceId: string;
  state: TState;
  environment: Record<string, number>;
  topology: {
    attachedTo?: string;
    connectedPeers?: string[];
    isCircuitClosed?: boolean;
    isOpticallyAligned?: boolean;
    isThermallyCoupled?: boolean;
  };
  dtSeconds?: number;
  simulationTimeSeconds?: number;
}

export interface SolverResult<TDerived = Record<string, any>> {
  derived: TDerived;
  valid: boolean;
  warnings: string[];
  errors: string[];
  uncertainty?: {
    instrumentalError: number;
    leastCount: number;
    repeatabilitySigma: number;
    expandedUncertainty: number;
    unit: string;
  };
  provenance: {
    solverId: string;
    version: string;
    lawsApplied: string[];
  };
}
```

### 5.2. Năm bộ giải khoa học cốt lõi (Five Core Solvers)
1. **CircuitSolver:**
   - Định luật Ohm: $I = \frac{U}{R + r_{in}}$.
   - Định luật Kirchhoff tại nút và mắt mạng.
   - Ngưỡng kích sáng đèn vonfram: $U \ge 2.5\text{ V}$.
   - Đo lường đồng hồ vạn năng DMM: Chế độ DCV (hở mạch $\to 0.00\text{ V}$, đo cọc $\to U_{source}$), Chế độ OHM (hở mạch $\to \text{"O.L"}$, đo điện trở $\to R$).
2. **OpticsSolver:**
   - Định luật truyền thẳng và phản xạ ánh sáng.
   - Định luật khúc xạ Snell: $n_1 \sin i = n_2 \sin r$.
   - Góc tới hạn phản xạ toàn phần: $\sin i_{gh} = \frac{n_2}{n_1}$.
   - Công thức thấu kính mỏng Gauss: $\frac{1}{f} = \frac{1}{d} + \frac{1}{d'}$, độ phóng đại $k = -\frac{d'}{d}$.
   - Tán sắc qua lăng kính: $n(\lambda) = A + \frac{B}{\lambda^2}$ (Hệ thức Cauchy).
3. **FluidThermalSolver:**
   - Áp suất thủy tĩnh: $p = p_0 + \rho g h$.
   - Bình thông nhau: Các nhánh thông đáy có cùng độ cao mặt thoáng khi chứa cùng một chất lỏng tĩnh.
   - Lực đẩy Archimedes: $F_A = \rho_{fluid} \cdot g \cdot V_{displaced}$.
   - Phương trình cân bằng nhiệt: $Q_{thu} = Q_{toa} = m c \Delta T$.
   - Động học gia nhiệt & làm nguội: $\frac{dT}{dt} = \frac{P_{heat} - h A (T - T_{air})}{m c}$.
4. **ElectromagneticInductionSolver:**
   - Định luật cảm ứng Faraday: $\mathcal{E}_{ci} = -N \frac{\Delta \Phi}{\Delta t} = -N B A \frac{\Delta \cos\theta}{\Delta t}$.
   - Định luật Lenz: Dòng điện cảm ứng có chiều chống lại sự biến thiên từ thông.
   - Khi nam châm đứng yên ($\frac{d\Phi}{dt} = 0$): Dòng điện cảm ứng triệt tiêu hoàn toàn, 2 đèn LED đều tắt.
   - Khi đưa nam châm lại gần hoặc rút ra xa: Đèn LED tương ứng với chiều dòng điện phát sáng.
5. **MechanicsSolver:**
   - Trọng lượng: $P = m \cdot g$.
   - Định luật đàn hồi Hooke: $F_{dh} = k \cdot |\Delta l|$.
   - Điều kiện cân bằng đòn bẩy: $\sum M_O = 0 \iff F_1 \cdot d_1 = F_2 \cdot d_2$.
   - Cân điện tử với trừ bì: $m_{net} = \max(0, m_{gross} - m_{tare})$.
   - Thước cặp cơ khí: Số đo $= \text{Vạch chính (mm)} + \text{Vạch du xích} \times 0.05\text{ mm}$.

---

## 6. HỢP ĐỒNG MÔI TRƯỜNG PHÒNG LAB (LAB ENVIRONMENT CONTRACT)

### 6.1. Ba cấp độ phân tầng môi trường
1. **Global Room Environment (13 Biến Lõi Cấp Phòng):**
   - `airTemperatureC` (25°C), `relativeHumidityPct` (60%), `atmosphericPressureKPa` (101.325 kPa), `gravityMps2` (9.80665 m/s²), `illuminanceLux` (500 lux), `airflowMps` (0 m/s), `ventilationACH` (2 1/h), `oxygenPct` (20.95%), `co2Ppm` (420 ppm), `ambientMagneticFieldMicroT` (50 µT), `benchTemperatureC` (22°C), `mainsVoltageV` (220 V), `mainsFrequencyHz` (50 Hz).
2. **Sample-Scoped Properties (12 Thuộc tính riêng của mẫu vật/dung dịch):**
   - `sampleTemperatureC`, `samplePh`, `sampleConductivityUScm`, `sampleTdsMgL`, `sampleSalinityPsu`, `sampleTurbidityNtu`, `sampleDissolvedO2MgL`, `sampleDensityKgM3`, `sampleViscosityPaS`, `opticalWavelengthNm`, `thermalHeatPowerW`, `surfaceFrictionCoef`.
3. **Device-Generated Local Fields (Trường cục bộ do thiết bị phát ra):**
   - Ngọn lửa đèn cồn tạo vùng nhiệt độ cao $T_{local} \approx 400^\circ\text{C}$ bán kính 10 cm.
   - Chùm tia laser tạo chùm quang thông cục bộ định hướng.
   - Nam châm vĩnh cửu tạo từ trường cục bộ $B_{local}$ suy giảm theo $1/r^3$.

### 6.2. Ma trận khớp nối phụ thuộc (Device-Environment Coupling Matrix)
Biến môi trường toàn cục chỉ được tác động đến thiết bị có đăng ký phụ thuộc hợp lệ:
- Thay đổi `gravityMps2` $\to$ chỉ tác động lực kế lò xo, áp suất thủy tĩnh, cân thăng bằng.
- Thay đổi `airflowMps` $\to$ chỉ gây nhiễu dao động mặt thoáng chất lỏng và trôi số đo cân điện tử nhạy cảm khi chưa có lồng chắn gió.
- Thay đổi `airTemperatureC` $\to$ chỉ tác động nhiệt kế, tốc độ làm nguội nhiệt học, giãn nở kim loại.
- Tuyệt đối không cho biến môi trường tác động bừa bãi lên các thiết bị không liên quan vật lý.

---

## 7. HỢP ĐỒNG GIAO DIỆN & THANH TRA (UI, INSPECTOR & GUIDANCE CONTRACT)

### 7.1. Bảng thanh tra điều khiển (DeviceControlInspector)
- Khi người dùng chọn thiết bị: Hiển thị đúng ảnh thực, thông số danh định, trạng thái FSM tiếng Việt, và các bộ phận điều khiển theo profile.
- Mọi thanh trượt hoặc nút bấm trong Inspector phải gọi hàm dispatch `onUpdateInstanceState` cập nhật vào `SceneInstance.instanceState` để đồng bộ hoàn toàn với 3D viewport.

### 7.2. Thẻ nổi thông tin (EquipmentHoverCard)
- Thiết kế Glassmorphism nổi cạnh con trỏ chuột khi rê qua thiết bị trong thư viện.
- Hiển thị đầy đủ: Ảnh chụp thực tế (hoặc SVG dự phòng), Tên thiết bị, Mã nhóm G, GHĐ, ĐCNN, Bài học SGK KHTN, Cảnh báo an toàn.

### 7.3. Hướng dẫn thí nghiệm thích ứng (Adaptive Guidance)
- Bảng `StudentGuidedStepPanel` đọc trạng thái đồ thị lắp ráp và trạng thái thiết bị thực tế để phát hiện:
  - Chưa cắm nguồn / chưa bật công tắc.
  - Cắm thiếu cực âm hoặc cực dương.
  - Thấu kính chưa đồng trục với đèn.
  - Vượt quá thang đo lực kế hoặc cân điện tử.
  - Cung cấp hành động khắc phục cụ thể cho học sinh.

---

## 8. HỢP ĐỒNG KIỂM ĐỊNH & NGHIỆM THU (TEST & ACCEPTANCE CONTRACT)

Mọi bản build trước khi phát hành phải vượt qua 5 bộ kiểm định nghiêm ngặt:
1. `npm run lint` (`tsc --noEmit`): 0 lỗi type.
2. `npm run build`: Vite build thành công không có lỗi bundle.
3. `scripts/verify-assembly-acceptance.ts`: 24/24 kịch bản ASM đạt 100/100 điểm.
4. `scripts/verify-scientific-interaction.ts`: 24/24 kịch bản SCI đạt 100% PASS.
5. `scripts/verify-standard-equipment-module.ts`: 59/59 tiêu chí 7 cổng đạt PASS.
6. `scripts/verify-ux-wiring-hud-controls.ts`: 12/12 tiêu chí UX & wiring đạt PASS.
7. `scripts/verify-full-system-integration.ts`: Kiểm tra tích hợp toàn diện 5 nhóm solver, 6 workflow, ma trận môi trường và luồng nhân quả.

---
**XÁC NHẬN CHẤP THUẬN HỢP ĐỒNG:**  
*Bản hợp đồng này có hiệu lực tức thì và ràng buộc toàn bộ mã nguồn triển khai trong dự án OpenLab 3D.*
