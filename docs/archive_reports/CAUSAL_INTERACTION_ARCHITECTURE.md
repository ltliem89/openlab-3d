# KIẾN TRÚC TƯƠNG TÁC NHÂN QUẢ VẬT LÝ OPENLAB 3D
## (Causal Interaction Architecture Specification - CIA v1.0)

> [!IMPORTANT]
> Tài liệu này chuẩn hóa kiến trúc cốt lõi xử lý tương tác vật lý và mô phỏng thực nghiệm trong OpenLab 3D theo nguyên lý nhân quả chặt chẽ:
> $$\text{USER ACTION} \longrightarrow \text{ASSEMBLY GRAPH} \longrightarrow \text{DEVICE STATE} \longrightarrow \text{SCIENTIFIC SOLVER} \longrightarrow \text{PHYSICAL STATE} \longrightarrow \text{3D RENDERING}$$
> Mọi hành vi tự động ghi đè trạng thái chéo, tự bật nguồn điện, tự phát tia sáng khi chưa có nguồn hoặc dùng hoạt họa (animation) giả lập đều bị nghiêm cấm hoàn toàn.

---

## 1. TỔNG QUAN KIẾN TRÚC & ĐỘNG CƠ NHÂN QUẢ (CAUSAL ENGINE)

Trong các phòng thí nghiệm ảo truyền thống, trạng thái hiển thị thường bị gắn chặt vào giao diện người dùng (UI binding) hoặc sử dụng các biến cờ toàn cục (global flag cheat). Điều này dẫn tới các nghịch lý khoa học nghiêm trọng:
1. Đèn tự phát sáng khi chưa có điện hoặc chưa cắm dây nối.
2. Công tắc đèn và công tắc nguồn bị khóa lẫn nhau (circular dependency deadlock).
3. Tia laser tự xuất hiện lơ lửng trong lăng kính dù đèn đặt ở ngoài giá đỡ quang học.
4. Cuộn cảm ứng sáng đèn LED đỏ liên tục khi nam châm đứng yên ($\frac{d\Phi}{dt} = 0$).
5. Dụng cụ đun nóng tự tăng lên $78.5^\circ\text{C}$ khi đặt trong không khí không có đèn cồn đốt.

Để khắc phục triệt để, kiến trúc **OpenLab 3D Causal Interaction Engine** thiết lập đường ống xử lý dữ liệu một chiều (unidirectional data flow) gồm 6 giai đoạn rõ ràng:

```mermaid
flowchart LR
    A["1. USER ACTION\n(Click, Drag, Connect, Switch)"] --> B["2. ASSEMBLY GRAPH\n(Topology, Mates, Cables, Ports)"]
    B --> C["3. DEVICE STATE\n(Decoupled State Machines)"]
    C --> D["4. SCIENTIFIC SOLVER\n(Circuit, Optics, Induction, Heat)"]
    D --> E["5. PHYSICAL STATE\n(Voltage, Flux, Rays, Temperature)"]
    E --> F["6. 3D RENDERING\n(Three.js Meshes, Lights, Canvas Textures)"]
```

---

## 2. CHI TIẾT 6 GIAI ĐOẠN XỬ LÝ NHÂN QUẢ

### Giai đoạn 1: User Action (Hành động người dùng)
Người dùng thao tác trực tiếp trên giao diện 3D hoặc thanh công cụ điều khiển:
- **Tương tác cơ học:** Kéo/thả thiết bị, trượt con chạy trên giá quang học, xoay góc tới lăng kính.
- **Tương tác điện học:** Bấm công tắc nguồn `optical-power-supply`, bấm công tắc đèn `optical-lamp`, xoay núm vặn điện áp $V_{\text{set}}$, cắm/rút dây dẫn giữa hai cọc đấu dây `CONN_LAMP_DC_IN_POS` $\longleftrightarrow$ `CONN_POWER_DC_OUT_POS`.
- **Tương tác nhiệt học:** Bật/tắt bấc đèn cồn `alcohol-burner`, đặt bát sứ hoặc bình cầu lên kiềng đun.
- **Tương tác từ học:** Di chuyển thanh nam châm thẳng ra/vào lòng ống dây cảm ứng.

### Giai đoạn 2: Assembly Graph & Topology (Đồ thị lắp ráp & Cấu trúc liên kết)
Đồ thị lắp ráp lưu trữ cấu trúc liên kết không gian và liên kết mạch:
- Mỗi thiết bị là một nút `AssemblyNode` với vị trí thực tế $\vec{r} = (x, y, z)$ và ma trận xoay $\mathbf{R}$.
- Các cổng kết nối `AssemblyConnector`:
  - Cơ học: `CONN_OPTICAL_SADDLE`, `CONN_PRISM_TABLE`, `CONN_CYLINDER_APERTURE`, `CONN_BEAKER_BASE`.
  - Điện học: `CONN_POWER_DC_OUT_POS`, `CONN_POWER_DC_OUT_NEG`, `CONN_LAMP_DC_IN_POS`, `CONN_LAMP_DC_IN_NEG`.
- Cạnh kết nối `AssemblyEdge` đại diện cho liên kết vật lý (gá lắp, ngàm kẹp) hoặc dây dẫn điện thực tế.
- **Quy tắc kiểm tra chiều dài dây:** Dây dẫn thực tế có chiều dài giới hạn $L_{\text{max}} = 0.70\text{ m}$. Nếu khoảng cách Euclid giữa hai cọc đấu:
  $$d(\text{terminal}_1, \text{terminal}_2) = \|\vec{r}_1 - \vec{r}_2\| > L_{\text{max}}$$
  thì dây bị căng quá giới hạn $\implies$ tự động tuột kết nối, mạch điện hở.

### Giai đoạn 3: Device State (Máy trạng thái thiết bị độc lập)
Mỗi thiết bị quản lý trạng thái nội tại riêng biệt, không bị ghi đè chéo:
- **Nguồn điện một chiều (`optical-power-supply`):**
  - `isPoweredOn`: boolean (trạng thái công tắc nguồn chính).
  - `voltageSetting`: số thực ($3.0\text{ V} \dots 12.0\text{ V}$).
  - `currentLimitA`: giới hạn dòng tối đa ($2.0\text{ A}$).
- **Đèn nguồn quang học (`optical-lamp`):**
  - `isPoweredOn`: boolean (trạng thái công tắc đóng mở cục bộ trên thân đèn).
  - `slitOrientation`: hướng khe sáng (`slit_1`, `slit_3`, `cross`, `F`).
  - `isLampLit`: boolean (**chỉ đọc**, được tính toán bởi Scientific Solver).
- **Đèn cồn (`alcohol-burner`):**
  - `isFlameLit`: boolean (trạng thái bấc đèn có đang cháy hay không).
  - `fuelRemaining`: mức cồn còn lại ($0.0 \dots 1.0$).
- **Ống dây cảm ứng (`induction-coil-led`):**
  - `turnCount`: số vòng dây $N = 500$.
  - `galvanometerDeflection`: góc lệch kim $-1.0 \dots +1.0$ (phụ thuộc tốc độ biến thiên từ thông).

### Giai đoạn 4: Scientific Solver (Bộ giải mô phỏng khoa học)
Bộ giải tính toán các định luật tự nhiên theo chu kỳ mô phỏng $\Delta t$:

#### 1. Định luật Mạch điện (Circuit Solver)
Kiểm tra tính liên tục của mạch điện cấp cho đèn:
$$\text{isCircuitClosed} = \text{HasEdge}(\text{PSU}_+, \text{Lamp}_+) \land \text{HasEdge}(\text{PSU}_-, \text{Lamp}_-) \land (d_{+}, d_{-} \le L_{\text{max}})$$
Điện áp đặt lên hai đầu bóng đèn:
$$V_{\text{lamp}} = \begin{cases} V_{\text{psu}}, & \text{khi } \text{isCircuitClosed} \land \text{PSU.isPoweredOn} \land \text{Lamp.isPoweredOn} \\ 0, & \text{ngược lại} \end{cases}$$
Đèn chỉ phát sáng khi và chỉ khi:
$$\text{isLampLit} \iff V_{\text{lamp}} \ge V_{\text{threshold}} \quad (V_{\text{threshold}} = 2.5\text{ V})$$

#### 2. Định luật Quang học Hình học & Vị trí thực (Raytracing Solver)
Tia sáng xuất phát từ vị trí lỗ phát sáng thực tế của đèn trong không gian:
$$\vec{r}_{\text{origin}} = \vec{r}_{\text{lamp}} + \mathbf{R}_{\text{lamp}} \cdot \vec{d}_{\text{aperture\_offset}}$$
Hướng truyền sóng ban đầu:
$$\vec{u}_{\text{beam}} = \mathbf{R}_{\text{lamp}} \cdot (0, 0, 1)$$
Không phụ thuộc vào việc đèn có gắn trên giá quang học hay không. Nếu đèn đặt trên mặt bàn lệch trục hoặc đặt ngoài giá đỡ, tia sáng truyền thẳng trong không khí theo đúng vị trí và hướng thực của đèn.
Chỉ khi tia sáng chạm vào mặt phân cách lăng kính hoặc bản bán nguyệt tại tọa độ $\vec{r}_{\text{hit}}$, định luật Snell được kích hoạt:
$$n_1 \sin\theta_1 = n_2 \sin\theta_2$$
Bản bán nguyệt (`semicircular-slab`) là vật thể truyền quang thụ động, **tuyệt đối không tự sinh ra tia sáng** nếu không có chùm tia tới từ nguồn sáng thực (`laser-source` hoặc `optical-lamp`).

#### 3. Định luật Cảm ứng Điện từ Faraday (Electromagnetic Induction Solver)
Từ thông qua cuộn dây có diện tích hiệu dụng $A$ và số vòng dây $N$:
$$\Phi(t) = N \iint_A \vec{B}(\vec{r}, t) \cdot d\vec{A}$$
Suất điện động cảm ứng sinh ra theo định luật Faraday - Lenz:
$$\mathcal{E}(t) = -\frac{d\Phi}{dt} \approx -N \frac{\Phi(t) - \Phi(t - \Delta t)}{\Delta t}$$
Trạng thái phát sáng của 2 đèn LED đấu song song ngược chiều:
- Nếu $\left|\frac{d\Phi}{dt}\right| \le \epsilon_{\text{threshold}}$ (nam châm đứng yên hoặc không có từ trường biến thiên):
  $$I_{\text{induced}} = 0 \implies \text{LED}_1 = \text{OFF} \ (0.0\text{ emissive}), \quad \text{LED}_2 = \text{OFF} \ (0.0\text{ emissive})$$
- Nếu $\frac{d\Phi}{dt} > \epsilon_{\text{threshold}}$ (từ thông tăng):
  $$\mathcal{E} < 0 \implies \text{LED}_1 = \text{ON (Xanh)}, \quad \text{LED}_2 = \text{OFF}$$
- Nếu $\frac{d\Phi}{dt} < -\epsilon_{\text{threshold}}$ (từ thông giảm):
  $$\mathcal{E} > 0 \implies \text{LED}_1 = \text{OFF}, \quad \text{LED}_2 = \text{ON (Đỏ)}$$

#### 4. Định luật Truyền nhiệt & Quán tính nhiệt (Thermodynamic Solver)
Bát sứ (`porcelain-dish`) hoặc bình cầu chỉ nhận nhiệt lượng khi nguồn nhiệt (`alcohol-burner`) thỏa mãn đồng thời 3 điều kiện:
1. `alcoholBurner.instanceState.isFlameLit === true` (ngọn lửa đang cháy).
2. Khoảng cách mặt phẳng ngang giữa đèn cồn và đáy cốc $\Delta r_{xz} = \sqrt{(x_b - x_d)^2 + (z_b - z_d)^2} \le 0.08\text{ m}$.
3. Đèn cồn nằm bên dưới dụng cụ đun: $y_b < y_d$ và khoảng cách thẳng đứng $0.05\text{ m} \le (y_d - y_b) \le 0.22\text{ m}$.

Phương trình truyền nhiệt có quán tính thời gian:
$$\frac{dT}{dt} = \begin{cases} \frac{P_{\text{flame}}}{C_{\text{thermal}}} - k_{\text{loss}}(T - T_{\text{ambient}}), & \text{khi có lửa đốt hợp lệ} \\ -k_{\text{loss}}(T - T_{\text{ambient}}), & \text{khi tắt lửa hoặc cách xa nguồn nhiệt} \end{cases}$$
Trong điều kiện bình thường không đun nấu: $T(t) = T_{\text{ambient}} = 25.0^\circ\text{C}$. Không bao giờ tự động khởi tạo mặc định $78.5^\circ\text{C}$.

#### 5. Định luật Đo lường Thực nghiệm DMM (Metrology Solver)
Đồng hồ đo vạn năng (`digital-multimeter`) chỉ hiển thị kết quả khi 2 đầu que đo (Probe Red, Probe Black) được cắm vào các điểm nút điện học thực:
- Nếu que đo hở mạch (đang thả tự do trong không gian):
  $$V_{\text{measured}} = 0.00\text{ V}, \quad I_{\text{measured}} = 0.00\text{ A}, \quad R_{\text{measured}} = \text{"O.L" (Over Limit / Vô cùng)}$$
- Khi đo hiệu điện thế: Que đỏ nối nút $A$, que đen nối nút $B \implies V_{\text{disp}} = \phi_A - \phi_B$.

### Giai đoạn 5: Physical State (Trạng thái vật lý tổng hợp)
Các đại lượng tính toán được lưu vào cấu trúc trạng thái vật lý chuẩn hóa của từng thực thể:
- `optical-lamp`: `isLampLit: boolean`, `rayIntensity: number`, `beamOrigin: Vector3`, `beamDirection: Vector3`.
- `optical-screen`: `projectedPattern: CanvasImageSource | null`, `illuminanceLux: number`.
- `porcelain-dish`: `temperatureCelsius: number`, `evaporationRate: number`.
- `induction-coil-led`: `inducedCurrentA: number`, `ledRedActive: boolean`, `ledGreenActive: boolean`.

### Giai đoạn 6: 3D Rendering & Material Update (Hiển thị đồ họa)
Hệ thống Three.js cập nhật trực quan dựa trên Physical State:
- Đèn dây tóc sáng: gán `emissiveIntensity` theo độ lớn điện áp ($V = 3\text{V} \implies 0.4$, ánh sáng vàng cam; $V = 12\text{V} \implies 2.2$, ánh sáng trắng rực rỡ).
- Khi đèn tắt (`isLampLit === false`): `emissiveIntensity = 0.0`, tắt `PointLight`, texture khe sáng tối hoàn toàn.
- Vẽ chùm tia quang học: cập nhật `LineSegments` hoặc `TubeGeometry` nối từ điểm gốc thực của đèn đến các điểm va chạm tiếp theo.
- Dây dẫn điện: vẽ đường cong Bézier 3D nối từ cọc nguồn tới cọc đèn khi và chỉ khi trạng thái kết nối dây được thiết lập trong Assembly Graph.

---

## 3. CÁC QUY TẮC BẢO TOÀN NHÂN QUẢ (INVARIANT CAUSAL RULES)

| Mã quy tắc | Tên quy tắc | Mô tả chi tiết | Vi phạm cấm |
| :--- | :--- | :--- | :--- |
| **ICR-01** | **No Backward State Bleed** | Trạng thái máy của thiết bị là đầu vào của Solver, không bao giờ để Solver hoặc thiết bị khác ghi đè ngược lại làm thay đổi logic công tắc người dùng. | Cấm gán đè `psu.isPoweredOn` dựa trên trạng thái bật tắt của `lamp.isPoweredOn`. |
| **ICR-02** | **Physical Topology Prerequisite** | Dòng năng lượng (điện năng, nhiệt năng, quang năng) bắt buộc phải truyền qua các cấu trúc liên kết vật lý thực (dây dẫn, tiếp xúc gá lắp, chùm tia không gian). | Cấm đèn tự sáng khi chưa có dây cắm nối giữa nguồn và đèn ($R_{\text{wire}} = \infty$). |
| **ICR-03** | **Zero Ground State Guarantee** | Mọi thiết bị khi không có năng lượng kích thích bên ngoài phải nằm ở trạng thái nền tĩnh (Zero State). | Cấm LED cảm ứng sáng khi nam châm đứng yên; cấm DMM hiển thị điện áp khác 0 khi que đo thả lỏng. |
| **ICR-04** | **Spatial Coordinate Grounding** | Mọi hiện tượng phát xạ (ánh sáng, khói nhiệt, tia laser) phải lấy gốc tọa độ từ bề mặt phát xạ của chính thiết bị đó trong không gian 3D. | Cấm mượn tọa độ của ray trượt (`optical-bench`) gán cho tia sáng khi đèn nằm ngoài giá đỡ. |
| **ICR-05** | **Passive Optical Object Purity** | Các dụng cụ quang học thụ động (lăng kính, bản bán nguyệt, thấu kính, màn ảnh) không lưu trữ nguồn sáng nội tại. | Cấm vẽ sẵn tia laser bên trong bản bán nguyệt khi chưa có chùm tia laser chiếu vào. |
| **ICR-06** | **Thermodynamic Continuity** | Nhiệt độ của vật thể biến thiên liên tục theo phương trình truyền nhiệt và quán tính khối lượng $m c_p \frac{dT}{dt}$. | Cấm gán nhiệt độ nhảy vọt tức thời hoặc mặc định nóng sẵn khi không có nguồn nhiệt. |

---

## 4. MA TRẬN PHÂN ĐỊNH TRÁCH NHIỆM FILE TRONG HỆ THỐNG

| Tên File | Vai trò kiến trúc | Trách nhiệm chính |
| :--- | :--- | :--- |
| [`AssemblySystem.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/AssemblySystem.ts) | **Assembly Graph & Topology** | Quản lý cổng kết nối `ASSEMBLY_CONNECTOR_REGISTRY`, kiểm tra tương thích ngàm/cọc điện, tính khoảng cách dây dẫn và giải mạch điện cơ bản `solveElectricalCircuit`. |
| [`types.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/domain/types.ts) | **Type System & Contracts** | Khai báo các thuộc tính trạng thái vật lý chuẩn hóa (`isLampLit`, `supplyVoltageV`, `temperatureCelsius`, `inducedCurrentA`, v.v.). |
| [`App.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/App.tsx) | **Causal Pipeline Orchestrator** | Điều phối vòng lặp mô phỏng, xóa bỏ hoàn toàn deadlock ghi đè chéo giữa PSU và Lamp, chuyển giao trạng thái độc lập vào Scientific Solvers. |
| [`ProceduralLabModels.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/ProceduralLabModels.ts) | **3D Rendering & Visual Meshes** | Xây dựng hình học 3D, cọc nối điện thực, vật liệu phản xạ/phát xạ theo đúng `instanceState` và `PhysicalState` (tắt đèn khi không có điện, tắt tia sáng thụ động). |
| [`LabViewport3D.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/LabViewport3D.tsx) | **Raytracer & Interaction Handler** | Xử lý click công tắc riêng rẽ, raytracing từ tọa độ phát sáng thực của đèn, kết nối/tháo dây dẫn 3D, kiểm tra vùng nhiệt học thực tế. |

---

*Tài liệu được ban hành và tuân thủ bắt buộc trong toàn bộ quá trình tái cấu trúc sâu (Deep Refactor) của OpenLab 3D.*
