# KẾ HOẠCH TRIỂN KHAI CẢI TIẾN SÂU HỆ THỐNG TƯƠNG TÁC KHOA HỌC
## (Deep Scientific Interaction Refactor Plan - OpenLab 3D)

> [!NOTE]
> Tài liệu này vạch rõ lộ trình, phạm vi sửa đổi, danh sách hàm, tiêu chuẩn nghiệm thu và kế hoạch kiểm thử cho 8 nhóm lỗi vi phạm nguyên lý hoạt động vật lý trong OpenLab 3D.

---

## 1. MỤC TIÊU & NGUYÊN TẮC THI CÔNG

1. **Khắc phục triệt để 8 nhóm lỗi (P01 $\to$ P08)** được xác định trong `ROOT_CAUSE_ANALYSIS.md`.
2. **Tuân thủ tuyệt đối kiến trúc nhân quả** đã định nghĩa trong `CAUSAL_INTERACTION_ARCHITECTURE.md`:
   $$\text{USER ACTION} \longrightarrow \text{ASSEMBLY GRAPH} \longrightarrow \text{DEVICE STATE} \longrightarrow \text{SCIENTIFIC SOLVER} \longrightarrow \text{PHYSICAL STATE} \longrightarrow \text{3D RENDERING}$$
3. **Bảo toàn chức năng cũ đang hoạt động tốt:** Không phá vỡ hệ thống lắp ráp RWSS v1.1.1 (ASM-01 $\dots$ ASM-24), giữ nguyên 100/100 điểm nghiệm thu cơ học.
4. **Không dùng mánh lới (No Cheating):** Không dùng animation giả, không tự động bật nguồn khi bấm thiết bị khác, không tự sinh tia sáng trong vật thể thụ động.

---

## 2. MA TRẬN 8 NHÓM LỖI & PHẠM VI ẢNH HƯỞNG

| Mã lỗi | Vấn đề vật lý | File cần sửa | Hàm / Vị trí cụ thể | Giải pháp kỹ thuật |
| :--- | :--- | :--- | :--- | :--- |
| **P01** | Deadlock công tắc nguồn và công tắc đèn | `src/App.tsx`<br>`src/three-runtime/LabViewport3D.tsx` | `reconcileCumulativeLabMeasurements`<br>`toggleOpticalComponentPower` | Tách độc lập `optPsu.instanceState.isPoweredOn` và `optLamp.instanceState.isPoweredOn`. Xóa bỏ việc ghi đè chéo `isPoweredOn` qua `sharedOpticalState`. |
| **P08** | Dây dẫn điện không phụ thuộc kết nối thực | `src/three-runtime/AssemblySystem.ts`<br>`src/three-runtime/LabViewport3D.tsx` | `ASSEMBLY_CONNECTOR_REGISTRY`<br>`solveElectricalCircuit`<br>`renderOpticalPowerCables` | Bổ sung cọc nối `CONN_LAMP_DC_IN_POS` và `CONN_LAMP_DC_IN_NEG`. Thêm trạng thái kết nối dây điện, kiểm tra khoảng cách dây $\le 0.70\text{ m}$. Chỉ vẽ dây khi đã cắm. |
| **P02** | Đèn sáng khi chưa có điện | `src/three-runtime/ProceduralLabModels.ts`<br>`src/App.tsx` | `createOpticalLampMesh`<br>`applyInstanceStateToObject3D` | Đặt mặc định `isPoweredOn = false`. Đèn chỉ sáng (`isLampLit = true`) khi thỏa mãn: Dây cắm nối + Nguồn bật + Đèn bật + Điện áp $\ge 2.5\text{V}$. |
| **P03** | Tia sáng bị cướp tọa độ bởi ray quang học | `src/three-runtime/LabViewport3D.tsx` | Block tính `beamRays` (line 6440–6480) | Tính tọa độ gốc tia $\vec{r}_{\text{origin}}$ trực tiếp từ lỗ phát sáng của thân đèn $(x_L, y_L, z_L)$ và ma trận xoay của đèn. Khi đèn tắt $\implies$ số tia sáng = 0. |
| **P04** | Bản bán nguyệt tự phát ra tia sáng | `src/three-runtime/ProceduralLabModels.ts` | `createSemicircularSlabMesh` | Đặt `ray_paths.visible = false` mặc định. Chỉ hiển thị tia khi có chùm tia laser tới (`isLaserHit === true`). |
| **P05** | LED cuộn cảm ứng tự sáng khi nam châm đứng yên | `src/three-runtime/ProceduralLabModels.ts` | `createInductionCoilMesh`<br>`applyInstanceStateToObject3D` | Đặt mặc định `defl = 0.0`. Khi $|defl| \le 0.15$ (đứng yên), cả 2 LED đều tắt ($0.0$ emissive). Chỉ sáng LED tương ứng khi $|defl| > 0.15$. |
| **P06** | Dụng cụ nhiệt tự nóng $78.5^\circ\text{C}$ giữa không khí | `src/App.tsx`<br>`src/three-runtime/ProceduralLabModels.ts` | `reconcileCumulativeLabMeasurements`<br>`createPorcelainDishMesh` | Mặc định nhiệt độ = $25.0^\circ\text{C}$. Chỉ tăng nhiệt độ khi có đèn cồn đang cháy (`isFlameLit === true`) đặt ngay bên dưới đáy ($\Delta r \le 0.08\text{ m}$). |
| **P07** | Đồng hồ DMM đo điện ảo khi que đo thả nổi | `src/three-runtime/ProceduralLabModels.ts` | `createDigitalMultimeterMesh`<br>`updateMultimeterDisplay` | Khi que đo hở mạch (chưa cắm vào nút mạch thực), hiển thị $0.00\text{ V}$, $0.00\text{ A}$, hoặc `"O.L"`. |

---

## 3. KẾ HOẠCH TRIỂN KHAI CHI TIẾT THEO 5 GIAI ĐOẠN

### Giai đoạn 1: Chuẩn hóa Type System & Connector Registry
1. **Bổ sung Type:** Cập nhật [`src/domain/types.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/domain/types.ts):
   - Thêm `isLampLit?: boolean`, `supplyVoltageV?: number`, `isCablesConnected?: boolean` vào `LabItemInstanceState`.
2. **Cập nhật Connector Registry:** Trong [`src/three-runtime/AssemblySystem.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/AssemblySystem.ts):
   - Thêm connector `CONN_LAMP_DC_IN_POS` (cọc dương trên đèn) và `CONN_LAMP_DC_IN_NEG` (cọc âm trên đèn).
   - Thiết lập mate compatibility: `CONN_POWER_DC_OUT_POS` $\longleftrightarrow$ `CONN_LAMP_DC_IN_POS`; `CONN_POWER_DC_OUT_NEG` $\longleftrightarrow$ `CONN_LAMP_DC_IN_NEG`.
   - Viết hàm `solveElectricalCircuit(psuInst, lampInst, cablesConnected)` trả về `{ isCircuitClosed, voltageAtLamp, lampShouldLight }`.

### Giai đoạn 2: Tái cấu trúc Bộ điều phối trạng thái (State Orchestrator)
1. **Xử lý triệt để Deadlock trong [`src/App.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/App.tsx):**
   - Loại bỏ việc nhồi nhét `isPoweredOn: isOpticsPowered` vào `sharedOpticalState`.
   - Tách bạch:
     - `optPsu.instanceState.isPoweredOn` giữ nguyên theo thao tác của người dùng trên nguồn.
     - `optLamp.instanceState.isPoweredOn` giữ nguyên theo thao tác của người dùng trên đèn.
     - Tính toán `isLampLit` dựa trên `solveElectricalCircuit`:
       ```typescript
       const isCablesConnected = optLamp.instanceState.isCablesConnected ?? true; // hoặc kiểm tra cạnh đồ thị
       const psuOn = Boolean(optPsu.instanceState.isPoweredOn);
       const lampSwitchOn = Boolean(optLamp.instanceState.isPoweredOn);
       const psuVoltage = typeof optPsu.instanceState.voltageSetting === 'number' ? optPsu.instanceState.voltageSetting : 12.0;
       const isCircuitValid = isCablesConnected && psuOn && lampSwitchOn && psuVoltage >= 2.5;
       ```
     - Gán `optLamp.instanceState.isLampLit = isCircuitValid` và `optLamp.instanceState.supplyVoltageV = isCircuitValid ? psuVoltage : 0`.
   - **Xử lý nhiệt độ:** Kiểm tra khoảng cách đèn cồn và đáy bát sứ/bình cầu, chỉ cấp nhiệt khi ngọn lửa đang cháy và nằm đúng bên dưới.

### Giai đoạn 3: Khắc phục Mô hình 3D & Shader/Material
1. **Mô hình Đèn (`optical-lamp`):**
   - Đặt cờ mặc định tắt: `instance.instanceState.isPoweredOn = false`.
   - Trong `applyInstanceStateToObject3D`:
     - Kiểm tra `instance.instanceState.isLampLit === true`. Nếu `false`, tắt hoàn toàn `PointLight` và không phát sáng khe slit.
     - Cập nhật vật liệu phát quang: nếu $V = 3\text{V} \implies$ ánh sáng vàng dịu (`#ffaa44`, cường độ 0.5); nếu $V = 12\text{V} \implies$ ánh sáng trắng (`#ffffff`, cường độ 2.2).
2. **Bản bán nguyệt (`semicircular-slab`):**
   - Ẩn đối tượng `ray_paths` hoặc kiểm tra `instanceState.isLaserHit`. Tuyệt đối không để tia sáng render khi không có laser.
3. **Cuộn cảm ứng (`induction-coil-led`):**
   - Mặc định `defl = 0.0`.
   - Trong hàm dựng và `applyInstanceStateToObject3D`, nếu `Math.abs(defl) <= 0.15`, cả hai LED xanh và đỏ đều có `emissiveIntensity = 0.0`.
4. **Đồng hồ DMM (`digital-multimeter`):**
   - Nếu que đo không kết nối tới nút điện áp nào, hiển thị mặc định `0.00 V` (hoặc `0.00 A` / `"O.L"`).

### Giai đoạn 4: Khắc phục Raytracing & Giao diện tương tác 3D
1. **Raytracing trong [`src/three-runtime/LabViewport3D.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/LabViewport3D.tsx):**
   - Tọa độ gốc tia: Lấy chính xác tọa độ thế giới của lỗ đèn `lampMesh.getWorldPosition()` và hướng chiếu theo hướng quay thế giới của đèn.
   - Nếu `optLamp.instanceState.isLampLit === false`, mảng tia sáng trả về rỗng (`[]`).
   - Xóa bỏ việc ép trục $Z$ của tia sáng theo `optical-bench` khi đèn nằm ngoài bench.
2. **Thao tác công tắc & cắm dây:**
   - Click vào nút nguồn $\to$ chỉ lật `optPsu.isPoweredOn`. Không lật `optLamp.isPoweredOn`.
   - Click vào nút đèn $\to$ chỉ lật `optLamp.isPoweredOn`. Không lật `optPsu.isPoweredOn`.
   - Thêm nút/hành động cắm/tháo dây nguồn: `[🔌 Cắm dây nguồn 12V]` / `[🔌 Tháo dây nguồn]`.
   - Dây dẫn 3D chỉ vẽ khi `isCablesConnected === true` và khoảng cách giữa nguồn và đèn $\le 0.70\text{ m}$.

### Giai đoạn 5: Tự động hóa kiểm thử & Nghiệm thu 24 kịch bản
1. Xây dựng kịch bản kiểm thử độc lập: `scripts/verify-scientific-interaction.ts`.
2. Kiểm thử 24 kịch bản (SCI-01 $\dots$ SCI-24) thuộc 8 nhóm lỗi P01 $\dots$ P08.
3. Chạy kiểm thử hồi quy lắp ráp: `scripts/verify-assembly-acceptance.ts` (đảm bảo 100/100 điểm ASM).
4. Kiểm tra biên dịch TypeScript `npx tsc --noEmit` và build sản phẩm `npm run build`.

---

## 4. BẢNG 24 KỊCH BẢN KIỂM THỬ KHOA HỌC (SCIENTIFIC TEST SCENARIOS)

| Nhóm | Kịch bản | Tên kịch bản | Điều kiện đầu vào | Kết quả kỳ vọng chuẩn khoa học |
| :--- | :--- | :--- | :--- | :--- |
| **P01** | SCI-01 | PSU On, Lamp Off | PSU = ON, Lamp = OFF, Dây = Cắm | PSU duy trì ON, Lamp duy trì OFF, Đèn không sáng, 0 tia sáng. |
| **P01** | SCI-02 | Lamp On, PSU Off | PSU = OFF, Lamp = ON, Dây = Cắm | Lamp duy trì ON, PSU duy trì OFF, Đèn không sáng, 0 tia sáng. |
| **P01** | SCI-03 | PSU Toggle Persistence | Lamp = OFF $\to$ Bấm bật PSU $\to$ Chờ 3 render | PSU vẫn là ON, không bị ghi đè về OFF. |
| **P02** | SCI-04 | No Power No Light | Đèn đặt độc lập trên bàn, không có dây nối | Đèn tối hoàn toàn, `PointLight` = 0, Slit texture unlit. |
| **P02** | SCI-05 | Lamp Lit on Valid Circuit | PSU = ON (12V), Lamp = ON, Dây = Cắm | Đèn sáng rực rỡ, `isLampLit = true`, `PointLight` > 0. |
| **P02** | SCI-06 | Voltage Dimming | PSU = ON (3V), Lamp = ON, Dây = Cắm | Đèn sáng vàng dịu ($3\text{V}$), quang thông thấp hơn $12\text{V}$. |
| **P08** | SCI-07 | Unplugged Cables | PSU = ON (12V), Lamp = ON, Dây = Rút | Mạch hở, đèn tắt lập tức, 0 tia sáng. |
| **P08** | SCI-08 | Cable Max Length Exceeded | Đèn kéo xa nguồn $d = 1.20\text{ m} > 0.70\text{ m}$ | Dây bị tuột/hở mạch, đèn tắt. |
| **P08** | SCI-09 | Plugged Within Reach | Đèn đặt gần nguồn $d = 0.35\text{ m} \le 0.70\text{ m}$, cắm dây | Dây nối thành công, mạch kín. |
| **P03** | SCI-10 | Lamp Off-Bench Ray Position | Đèn đặt tại $(0.4, 0.8, -0.2)$ ngoài ray | Tia sáng xuất phát từ $(0.4, 0.8, -0.2)$, không bị kéo vào ray $(0, y, z)$. |
| **P03** | SCI-11 | Lamp Rotated 45 Degrees | Đèn xoay góc $45^\circ$ trên bàn | Tia sáng chiếu nghiêng đúng góc $45^\circ$ theo hướng đèn. |
| **P03** | SCI-12 | Lamp Off Ray Extinction | Đèn tắt (`isLampLit = false`) | Số tia sáng chiếu ra bằng 0. |
| **P04** | SCI-13 | Semicircular Slab Standalone | Đặt bản bán nguyệt trên bàn không có laser | Không có tia sáng nào xuất hiện bên trong hoặc xung quanh bản. |
| **P04** | SCI-14 | Semicircular Slab Under Laser | Bật laser chiếu vào tâm bản bán nguyệt | Xuất hiện tia khúc xạ và phản xạ đúng theo định luật Snell. |
| **P05** | SCI-15 | Induction Coil Stationary Magnet | Nam châm đứng yên trong cuộn dây ($v = 0$) | Kim điện kế chỉ 0, LED 1 = OFF (0.0), LED 2 = OFF (0.0). |
| **P05** | SCI-16 | Magnet Inserted (Flux Increasing) | Nam châm tiến nhanh vào cuộn dây ($\frac{d\Phi}{dt} > 0$) | Kim lệch dương, LED 1 (Xanh) sáng, LED 2 (Đỏ) tắt. |
| **P05** | SCI-17 | Magnet Withdrawn (Flux Decreasing) | Nam châm rút nhanh ra ($\frac{d\Phi}{dt} < 0$) | Kim lệch âm, LED 1 (Xanh) tắt, LED 2 (Đỏ) sáng. |
| **P06** | SCI-18 | Dish Ambient Temperature | Bát sứ đặt trên bàn không có đèn cồn | Nhiệt độ đo được bằng đúng nhiệt độ phòng $25.0^\circ\text{C}$. |
| **P06** | SCI-19 | Dish Heating Under Lit Burner | Bát sứ trên kiềng, đèn cồn đốt bên dưới | Nhiệt độ tăng dần theo thời gian: $25^\circ\text{C} \to 45^\circ\text{C} \to 80^\circ\text{C} \dots$ |
| **P06** | SCI-20 | Dish Cooling When Burner Extinguished | Tắt đèn cồn khi bát đang ở $80^\circ\text{C}$ | Nhiệt độ hạ dần về $25.0^\circ\text{C}$ theo quy luật truyền nhiệt. |
| **P07** | SCI-21 | DMM Probes Open Circuit | DMM bật thang đo điện áp DC, que đo thả tự do | Hiển thị $0.00\text{ V}$ (không hiển thị điện áp ảo). |
| **P07** | SCI-22 | DMM Probes on PSU Terminals | Que đo cắm đúng cọc nguồn 12V đang bật | Hiển thị chính xác $12.00\text{ V}$. |
| **P07** | SCI-23 | DMM Resistance Open Circuit | DMM bật thang đo điện trở, que đo hở mạch | Hiển thị `"O.L"` (vô cùng lớn). |
| **P08** | SCI-24 | Reverse Polarity Check | Cắm ngược cực nguồn vào đèn DC phân cực | Mạch nhận diện phân cực đúng/sai theo đặc tính linh kiện. |

---

*Kế hoạch đã sẵn sàng để thực hiện bước Implementation.*
