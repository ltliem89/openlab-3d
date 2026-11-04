# NHẬT KÝ THAY ĐỔI TRIỂN KHAI CẢI TIẾN SÂU HỆ THỐNG TƯƠNG TÁC KHOA HỌC
## (Implementation Changelog - Deep Scientific Interaction Refactor)

> [!NOTE]
> Báo cáo này ghi nhận toàn bộ các sửa đổi mã nguồn thực tế đã hoàn thành trong OpenLab 3D để khắc phục triệt để 8 nhóm lỗi vi phạm nguyên lý hoạt động vật lý (P01 $\to$ P08).

---

## 1. TỔNG HỢP CÁC FILE ĐÃ SỬA ĐỔI

| STT | File thay đổi | Lớp kiến trúc | Nội dung sửa đổi chính |
| :---: | :--- | :--- | :--- |
| 1 | [`src/domain/types.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/domain/types.ts) | Domain & Type Contracts | Bổ sung các trường trạng thái vật lý chuẩn hóa: `isLampLit?: boolean;`, `isCablesConnected?: boolean;`, `isLaserHit?: boolean;`, `isFlameLit?: boolean;`, `voltageSetting?: number;` vào `SceneInstance['instanceState']`. |
| 2 | [`src/three-runtime/AssemblySystem.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/AssemblySystem.ts) | Assembly Graph & Circuit Solver | Thêm cổng cắm điện `CONN_LAMP_DC_IN_POS` và `CONN_LAMP_DC_IN_NEG` vào `ASSEMBLY_CONNECTOR_REGISTRY`. Viết bộ giải mạch điện khoa học `solveElectricalCircuit()` kiểm tra liên tục mạch, khoảng cách dây dẫn giới hạn ($L_{\text{max}} = 0.70\text{ m}$) và ngưỡng điện áp tối thiểu ($V_{\text{min}} = 2.5\text{ V}$). |
| 3 | [`src/App.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/App.tsx) | Pipeline Orchestration & Solvers | Xóa bỏ triệt để deadlock ghi đè chéo giữa PSU và Lamp; tách bạch hoàn toàn `isPoweredOn` của nguồn và đèn; chuẩn hóa giá trị trạng thái nền (Zero Ground State); tích hợp bộ giải nhiệt động học cho bát sứ và bình cầu; sửa `toggle-laser` và chế độ DMM. |
| 4 | [`src/three-runtime/ProceduralLabModels.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/ProceduralLabModels.ts) | 3D Presentation & Shaders | Đèn `optical-lamp` và vật chữ F `frosted-f-object` mặc định không phát sáng; bản bán nguyệt `semicircular-slab` ẩn hoàn toàn các tia laser khi chưa có chùm tia tới; cuộn cảm ứng `induction-coil-led` tắt cả 2 LED ($0.0$) khi nam châm đứng yên; đồng hồ `digital-multimeter` hiển thị $0.00\text{ V}$ khi que đo hở mạch. |
| 5 | [`src/three-runtime/LabViewport3D.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/LabViewport3D.tsx) | Raytracer & 3D Interaction | Khắc phục lỗi cướp tọa độ tia sáng: tia sáng xuất phát đúng từ lỗ đèn $(x_L + 0.048, y_L, z_L)$; triệt tiêu chùm tia khi đèn tắt; bổ sung 3 nút điều khiển vật lý độc lập `[⚡ NGUỒN 12V]`, `[🔌 CÁP ĐIỆN]`, `[💡 CÔNG TẮC ĐÈN]`; chỉ vẽ dây dẫn 3D khi đã cắm và trong tầm với $\le 0.70\text{ m}$. |
| 6 | [`scripts/verify-scientific-interaction.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/scripts/verify-scientific-interaction.ts) | Automated Verification Harness | Xây dựng bộ kịch bản kiểm thử độc lập đánh giá 24/24 kịch bản khoa học SCI-01 $\dots$ SCI-24 thuộc 8 nhóm lỗi P01 $\dots$ P08. |

---

## 2. CHI TIẾT SỬA ĐỔI THEO TỪNG NHÓM LỖI (P01 $\to$ P08)

### Nhóm P01: Tách độc lập công tắc nguồn và công tắc đèn
- **Nguyên nhân gốc:** `App.tsx` tính toán biến gộp `isOpticsPowered` rồi nhồi nhét `isPoweredOn: isOpticsPowered` vào `sharedOpticalState`, sau đó ghi đè trực tiếp lên cả `optical-power-supply` lẫn `optical-lamp`. Khi tắt một trong hai thiết bị, thiết bị kia bị ép tắt theo ngay ở render tiếp theo, tạo thành deadlock.
- **Sửa đổi thực tế:**
  - Trong [`src/App.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/App.tsx), loại bỏ hoàn toàn thuộc tính `isPoweredOn` ra khỏi `sharedOpticalState`.
  - Giữ nguyên `inst.instanceState.isPoweredOn === true` riêng cho từng thiết bị.
  - Sửa hàm `action === 'toggle-laser'`: chỉ đảo trạng thái `isPoweredOn` của chính instance được click, không lật chéo sang thiết bị kia.
  - Trong [`src/three-runtime/LabViewport3D.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/LabViewport3D.tsx), tách nút bấm UI thành 2 nút riêng: `[⚡ NGUỒN: BẬT/TẮT]` và `[💡 ĐÈN: BẬT/TẮT]`.

### Nhóm P02: Đèn không được sáng khi chưa có điện
- **Nguyên nhân gốc:** `ProceduralLabModels.ts` khởi tạo `lampLight.intensity = 0.55` và `createLampSlitCanvasTexture(true)`. Trong `applyInstanceStateToObject3D`, điều kiện kiểm tra là `instance.instanceState.isPoweredOn !== false`, làm đèn phát sáng dù chưa cắm điện.
- **Sửa đổi thực tế:**
  - Khởi tạo ban đầu: `lampLight.intensity = 0.0`, `slitTex = createLampSlitCanvasTexture(false)`.
  - Trong `applyInstanceStateToObject3D`: chỉ bật sáng khi `instance.instanceState.isLampLit === true`.
  - Đèn thay đổi độ sáng và nhiệt độ màu theo điện áp cấp: $3\text{V} \implies$ vàng dịu (`#ffb74d`), $12\text{V} \implies$ trắng halogen rực rỡ (`#ffedd5`).

### Nhóm P08: Hệ thống dây dẫn và kết nối điện thực
- **Nguyên nhân gốc:** Dây dẫn 3D được vẽ tự động mỗi khi có cả nguồn và đèn trong cảnh, không cần người dùng cắm và không quan tâm khoảng cách.
- **Sửa đổi thực tế:**
  - Đăng ký 2 connector mới: `CONN_LAMP_DC_IN_POS` và `CONN_LAMP_DC_IN_NEG` trong [`src/three-runtime/AssemblySystem.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/AssemblySystem.ts).
  - Triển khai `solveElectricalCircuit`: kiểm tra khoảng cách $d = \|\vec{r}_{\text{psu}} - \vec{r}_{\text{lamp}}\| \le 0.70\text{ m}$. Nếu $d > 0.70\text{ m}$, dây bị căng đứt $\implies$ mạch hở.
  - Trong [`src/three-runtime/LabViewport3D.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/LabViewport3D.tsx), bổ sung nút `[🔌 CÁP: CẮM / RÚT]` và chỉ render ống dây dẫn khi `isCablesConnected === true && d <= 0.70m`.

### Nhóm P03: Tia sáng phải xuất phát đúng vị trí thực của đèn
- **Nguyên nhân gốc:** `LabViewport3D.tsx` dòng 6441 gán cứng `axisZ = benchInst ? benchInst.transform.positionM[2] : lampInst.transform.positionM[2]`. Khi đèn đặt lệch ra ngoài bàn, tia sáng vẫn bị ép vẽ dọc theo rãnh ray quang học.
- **Sửa đổi thực tế:**
  - Gốc tọa độ tia sáng được tính toán trực tiếp từ vị trí 3D thực của đèn:
    $$\vec{r}_{\text{aperture}} = (x_L + 0.048, y_L + \text{OPTICAL\_BENCH\_AXIS\_Y}, z_L)$$
  - Khi đèn bị tắt (`isLampLit === false`), toàn bộ mảng tia sáng bị triệt tiêu rỗng (`[]`).

### Nhóm P04: Bản bán nguyệt không tự phát sinh tia sáng
- **Nguyên nhân gốc:** `createSemicircularSlabMesh` tạo sẵn cụm `ray_paths` với `incident_ray`, `refracted_ray`, `reflected_ray` luôn luôn hiển thị (`visible = true`).
- **Sửa đổi thực tế:**
  - Đặt `rayGroup.visible = false`, `incRay.visible = false`, `refRay.visible = false`, `rflRay.visible = false` làm trạng thái mặc định.
  - Trong `applyInstanceStateToObject3D`, chỉ kích hoạt hiển thị khi có nguồn laser thực sự đang chiếu tới (`isLaserHit === true`).

### Nhóm P05: Cuộn cảm ứng chỉ sáng LED khi từ thông biến thiên
- **Nguyên nhân gốc:** `galvanometerDeflection` được khởi tạo mặc định bằng $0.6$; vật liệu 2 đèn LED có `emissiveIntensity = 0.85`; `applyInstanceStateToObject3D` gán `led1 = defl >= 0 ? 1.2 : 0.1`, khiến LED đỏ luôn sáng khi đứng yên.
- **Sửa đổi thực tế:**
  - Đặt giá trị mặc định khi đứng yên: `galvanometerDeflection = 0.0`.
  - Khởi tạo vật liệu LED: `emissiveIntensity = 0.0`.
  - Trong `applyInstanceStateToObject3D`: nếu $|defl| \le 0.15$ (đứng yên, $\frac{d\Phi}{dt} = 0$), cả 2 LED đều tắt ($0.0$). Chỉ khi $defl > 0.15$ thì LED 1 mới sáng ($1.4$); khi $defl < -0.15$ thì LED 2 mới sáng ($1.4$).

### Nhóm P06: Thiết bị gia nhiệt phải phụ thuộc nguồn nhiệt và thời gian
- **Nguyên nhân gốc:** `baseState` khởi tạo `isHeating: true`; khi cắm nhiệt kế vào bát sứ hoặc bình cầu, code mặc định gán $78.5^\circ\text{C}$ mà không kiểm tra xem có đèn cồn hay không.
- **Sửa đổi thực tế:**
  - Khởi tạo mặc định: `isHeating: false`, `temperatureC: 25.0`.
  - Trong `reconcileCumulativeLabMeasurements`: kiểm tra sự tồn tại của `alcohol-burner` đang cháy (`isHeating === true || isFlameLit === true`), kiểm tra khoảng cách mặt phẳng ngang $\Delta r_{xz} \le 0.10\text{ m}$ và vị trí thẳng đứng $y_b < y_d$.
  - Nếu thỏa mãn: cấp nhiệt $T = 78.5^\circ\text{C}$. Nếu không có lửa hoặc ở xa: duy trì nhiệt độ phòng $25.0^\circ\text{C}$.

### Nhóm P07: Đồng hồ DMM đo theo kết nối và mạch điện thực
- **Nguyên nhân gốc:** `ProceduralLabModels.ts` in sẵn chữ `'12.00 V'` lên màn hình LCD; khi bấm đổi thang đo, code tự động gán $12.0\text{V}$, $0.75\text{A}$ dù que đo đang thả nổi trong không khí.
- **Sửa đổi thực tế:**
  - Khởi tạo LCD ban đầu: `0.00 V`.
  - Khi que đo hở mạch: điện áp đo được là $0.00\text{ V}$, dòng điện là $0.00\text{ A}$, điện trở là `"O.L"`.
  - Chỉ khi cắm vào cọc nguồn đang bật thì DMM mới hiển thị đúng điện áp nguồn $12.00\text{ V}$ hoặc dòng tải tương ứng.

---

## 3. KẾT QUẢ XÁC MINH & REGRESSION

- `npx tsc --noEmit`: **0 lỗi biên dịch (Exit code 0)**.
- `npm run build`: **Build thành công (Exit code 0)**.
- `npx tsx scripts/verify-assembly-acceptance.ts`: **24/24 tiêu chí ASM đạt 100/100 điểm (0 lỗi P0-P3)**.
- `npx tsx scripts/verify-scientific-interaction.ts`: **24/24 kịch bản SCI đạt chuẩn PASS 100% (0 lỗi P0)**.
