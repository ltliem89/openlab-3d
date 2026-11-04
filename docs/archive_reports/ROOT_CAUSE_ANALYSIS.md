# BÁO CÁO PHÂN TÍCH NGUYÊN NHÂN GỐC RỄ (ROOT CAUSE ANALYSIS)
## HỆ THỐNG TƯƠNG TÁC VẬT LÝ OPENLAB 3D (RWSS v1.1.1)

- **Mã tài liệu:** `RWSS-OL3D-RCA-001`
- **Người thực hiện:** OpenLab 3D Principal Simulation Engineer
- **Mục tiêu:** Phân tích chi tiết nguồn gốc phát sinh lỗi của 8 nhóm vi phạm nguyên lý hoạt động (P01 đến P08) trong mã nguồn thực tế.

---

## 1. TỔNG HỢP NGUYÊN NHÂN GỐC RỄ THEO 8 NHÓM LỖI (P01 – P08)

### P01: Khóa chết tương tác giữa Biến áp nguồn và Đèn chiếu sáng
* **File liên quan:** `src/App.tsx` (dòng 912–922, dòng 1138–1220); `src/three-runtime/LabViewport3D.tsx` (dòng 9360–9375).
* **Nguyên nhân gốc rễ (Root Cause):**
  1. Trong hàm `reconcileCumulativeLabMeasurements`, hệ thống tính toán giá trị gộp `isOpticsPowered` từ trạng thái của PSU và Đèn:
     $$isOpticsPowered = isPsuConnected \land isPsuPoweredOn \land isLampSwitchOn$$
  2. Giá trị này được gán vào `sharedOpticalState = { isPoweredOn: isOpticsPowered }`.
  3. Sau đó, `sharedOpticalState` lại được trải đều (spread operator) vào `instanceState` của **cả Biến áp nguồn (`optical-power-supply`) và Đèn (`optical-lamp`)**.
  4. **Vòng lặp khóa chết (Deadlock Loop):** Khi công tắc đèn đang tắt (`isLampSwitchOn = false`), `isOpticsPowered` luôn bằng `false`. Nếu người dùng bật công tắc trên Biến áp nguồn, ngay trong tick render tiếp theo, `sharedOpticalState.isPoweredOn = false` sẽ đè bẹp công tắc nguồn vừa bật trở về `false`. Người dùng không thể nào bật được nguồn điện.
  5. Đồng thời, nút bấm UI trong `LabViewport3D.tsx` tự động can thiệp ép `psu.isPoweredOn = true` khi bật đèn, vi phạm nguyên lý phân tách điều khiển độc lập.

---

### P02: Đèn tự phát sáng khi chưa có điện hoặc nguồn đang tắt
* **File liên quan:** `src/three-runtime/ProceduralLabModels.ts` (dòng 6171–6195).
* **Nguyên nhân gốc rễ (Root Cause):**
  1. Hàm dựng hình `applyInstanceStateToObject3D` sử dụng biểu thức điều kiện lỏng lẻo:
     ```typescript
     const isPoweredOn = instance.instanceState.isPoweredOn !== false;
     ```
     Khi một chiếc đèn mới được tạo ra từ catalog, thuộc tính `isPoweredOn` là `undefined`, dẫn đến `undefined !== false` luôn trả về `true`.
  2. Hàm này xử lý cục bộ độc lập cho chiếc đèn mà không hề kiểm tra xem có dòng điện thực tế chạy qua bóng đèn hay không ($I > 0$).
  3. Kết quả là nguồn sáng điểm `lamp_point_light` và texture phát quang màu vàng của khe chắn sáng `slitNode` tự động sáng rực rỡ ngay cả khi đèn nằm đơn độc trên bàn, không có dây nối và không có nguồn điện.

---

### P03: Tia sáng bị "bắt cóc" lệch khỏi vị trí thực của đèn
* **File liên quan:** `src/three-runtime/LabViewport3D.tsx` (dòng 6436–6445).
* **Nguyên nhân gốc rễ (Root Cause):**
  1. Tọa độ trục $Z$ và cao độ $Y$ của chùm tia sáng được gán cứng theo vị trí của Ray quang học (`benchInst`) nếu ray quang học tồn tại trong cảnh:
     ```typescript
     const axisZ = benchInst ? benchInst.transform.positionM[2] : lampInst.transform.positionM[2];
     ```
  2. Khi người dùng nhấc Đèn chiếu ra ngoài rãnh ray (ví dụ đặt sang bên trái hoặc lùi về sau bàn), chùm tia sáng vẫn tiếp tục phát ra từ tọa độ của ray quang học, tạo ra chùm tia "ma" lơ lửng trong không khí mà không xuất phát từ thấu kính đèn.

---

### P04: Bản bán nguyệt tự phát ra 3 tia laser khi không có nguồn phát
* **File liên quan:** `src/three-runtime/ProceduralLabModels.ts` (dòng 3820–3860, dòng 6061–6083).
* **Nguyên nhân gốc rễ (Root Cause):**
  1. Mô hình 3D của Bản bán nguyệt thủy tinh được tạo sẵn 3 khối mesh hình trụ đại diện cho tia tới (`incident_ray`), tia khúc xạ (`refracted_ray`) và tia phản xạ (`reflected_ray`) ngay trong nhóm `ray_paths`.
  2. Trong hàm cập nhật trạng thái `applyInstanceStateToObject3D`, 3 tia này luôn được xoay góc và hiển thị mà không hề kiểm tra xem có Nguồn Laser (`laser-source`) đang bật và chiếu vào mặt phẳng bản bán nguyệt hay không.

---

### P05: Cuộn cảm ứng tự sáng đèn LED đỏ khi nam châm đứng yên
* **File liên quan:** `src/three-runtime/LabViewport3D.tsx` (dòng 470–476); `src/three-runtime/ProceduralLabModels.ts` (dòng 6106–6116).
* **Nguyên nhân gốc rễ (Root Cause):**
  1. Giá trị độ lệch kim / vị trí nam châm được gán mặc định là $0.6$:
     ```typescript
     const defl = inst.instanceState.galvanometerDeflection ?? 0.6;
     ```
  2. Điều kiện kích hoạt LED đỏ được viết là `defl >= 0`:
     ```typescript
     led1.material.emissiveIntensity = defl >= 0 ? 1.2 : 0.1;
     ```
  3. Theo Định luật cảm ứng điện từ Faraday $\mathcal{E} = -\frac{d\Phi}{dt}$, khi nam châm đứng yên ($\frac{d\Phi}{dt} = 0$), từ thông không biến thiên thì dòng điện cảm ứng $i = 0$. Việc gán giá trị mặc định $0.6$ và điều kiện so sánh $\ge 0$ khiến cho LED đỏ luôn sáng rực khi nam châm đứng yên.

---

### P06: Thiết bị gia nhiệt tự sôi $78.5^\circ\text{C}$ khi không có lửa
* **File liên quan:** `src/three-runtime/LabViewport3D.tsx` (dòng 484, dòng 4505–4508).
* **Nguyên nhân gốc rễ (Root Cause):**
  1. Thuộc tính gia nhiệt của Bát sứ và Bình chưng cất mặc định được đánh giá bằng `isHeating !== false`, khiến trạng thái ban đầu (`undefined`) tự động biến thành `true`.
  2. Khi người dùng nhúng nhiệt kế vào bát sứ, hệ thống gán ngay nhiệt độ cố định $78.5^\circ\text{C}$ mà không kiểm tra xem phía dưới đáy bát sứ có Đèn cồn (`alcohol-burner`) đang cháy hay không.

---

### P07: Đồng hồ vạn năng DMM đo ra điện áp giữa không khí
* **File liên quan:** `src/three-runtime/ProceduralLabModels.ts` (dòng 6125–6135).
* **Nguyên nhân gốc rễ (Root Cause):**
  1. Khi chưa có mạch điện kết nối với que đo, màn hình LCD của DMM lấy giá trị fallback:
     ```typescript
     const val = instance.instanceState.multimeterValue ?? (mode === 'DCV' ? 12.0 : mode === 'DCA' ? 0.75 : 16.0);
     ```
  2. Điều này làm cho đồng hồ hiển thị $12.00\text{ V}$ hoặc $0.75\text{ A}$ khi hai que đo đang nằm hở mạch trong không khí, thay vì hiển thị $0.00\text{ V}$, $0.00\text{ A}$ hoặc `O.L`.

---

### P08: Dây điện 3D tự nối "ma thuật" không cần thao tác cắm giắc
* **File liên quan:** `src/three-runtime/LabViewport3D.tsx` (dòng 6352–6415).
* **Nguyên nhân gốc rễ (Root Cause):**
  1. Dây điện được vẽ tự động bằng đường cong `CatmullRomCurve3` chỉ dựa trên điều kiện `if (psuInst && lampInst)`.
  2. Không có cấu trúc dữ liệu theo dõi việc cắm dây vào cọc đấu nối (Terminals) trong `AssemblyGraph`.
  3. Dây điện tự động dãn dài không giới hạn khi kéo hai thiết bị ra xa, không tuân theo chiều dài vật lý tối đa của dây dẫn thí nghiệm ($L_{\text{max}} = 0.70\text{ m}$).

---

## 2. KẾT LUẬN

Tất cả 8 lỗi trên đều bắt nguồn từ một mẫu hình chung (Anti-Pattern): **Bỏ qua chuỗi quan hệ nhân quả (Causality Chain), gán giá trị mặc định tùy tiện và lạm dụng cờ trạng thái dùng chung (`sharedOpticalState`) để ép hiển thị giao diện**.

Giải pháp triệt để là thiết lập kiến trúc tương tác chuẩn:
$$\text{User Action} \longrightarrow \text{Assembly Graph} \longrightarrow \text{Circuit / Thermal Solver} \longrightarrow \text{Device Physical State} \longrightarrow \text{3D Rendering}$$
