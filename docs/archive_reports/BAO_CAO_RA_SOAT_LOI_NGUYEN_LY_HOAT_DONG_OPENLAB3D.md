# BÁO CÁO RÀ SOÁT CÁC LỖI NGUYÊN LÝ HOẠT ĐỘNG & TƯƠNG TÁC THỰC TẾ TRONG OPENLAB 3D
> **Phạm vi rà soát:** Toàn bộ logic tương tác vật lý và hiển thị trạng thái (`ProceduralLabModels.ts`, `LabViewport3D.tsx`, `App.tsx`, `AssemblySystem.ts`, `domain/types.ts`).  
> **Mục tiêu:** Chỉ rõ từng dòng mã nguồn đang gây ra hiện tượng tương tác phi vật lý, giả lập kết quả, đè trạng thái luẩn quẩn và mất tính chân thật khoa học.  
> **Nguyên tắc thực hiện:** **Chỉ rà soát và báo cáo, không sửa code.**  

---

## MỤC LỤC BÁO CÁO

1. **Nhóm 1 — Khóa chết tương tác giữa Nguồn điện & Đèn chiếu sáng (Deadlock & State Overwrite)**
2. **Nhóm 2 — Đèn tự phát sáng khi chưa có điện / nguồn đang tắt**
3. **Nhóm 3 — Tia sáng bị "bắt cóc" lệch khỏi vị trí thực của đèn**
4. **Nhóm 4 — Bản bán nguyệt tự phát ra 3 tia laser khi không có nguồn phát**
5. **Nhóm 5 — Cuộn cảm ứng tự sáng đèn LED đỏ khi nam châm đứng yên ($\frac{d\Phi}{dt} = 0$)**
6. **Nhóm 6 — Bát sứ & Bình chưng cất tự sôi $78.5^\circ\text{C}$ khi không có lửa**
7. **Nhóm 7 — Đồng hồ vạn năng DMM đo ra điện áp $12\text{V}$ giữa không khí**
8. **Nhóm 8 — Dây điện 3D tự nối "ma thuật" không cần thao tác cắm giắc**
9. **Bảng tổng hợp lỗi, nguyên nhân gốc rễ và đề xuất giải pháp vật lý**

---

## 1. KHÓA CHẾT TƯƠNG TÁC NGUỒN ĐIỆN & ĐÈN (CIRCULAR STATE DEADLOCK)

### 1.1. Hiện tượng thực tế mà người dùng gặp phải
* Học sinh bấm bật công tắc nguồn điện $\to$ nguồn không bật được hoặc vừa bật lên lập tức bị nhảy về TẮT.
* Bấm tắt đèn $\to$ công tắc nguồn điện bị tự động tắt theo.
* Đèn chưa bật công tắc mà nguồn bật là đèn đã sáng; hoặc nguồn chưa bật mà bấm đèn thì nguồn tự động nhảy sang BẬT.

### 1.2. Vị trí mã nguồn gây lỗi
* [`src/App.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/App.tsx): Dòng 912–922 và Dòng 1138–1220.
* [`src/three-runtime/LabViewport3D.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/LabViewport3D.tsx): Dòng 9360–9375.

### 1.3. Bằng chứng mã nguồn & Cơ chế lỗi

Trong [`src/App.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/App.tsx), hàm `reconcileCumulativeLabMeasurements` tính toán:
```typescript
// App.tsx dòng 912-920:
const isPsuConnectedOnBench = Boolean(
  optPsu && optPsu.instanceState.attachmentSlot !== 'shelf',
);
const isPsuPoweredOn = Boolean(
  optPsu && optPsu.instanceState.isPoweredOn === true,
);
const isLampSwitchOn =
  Boolean(optLamp && optLamp.instanceState.isPoweredOn !== false);

const isOpticsPowered =
  isPsuConnectedOnBench && isPsuPoweredOn && isLampSwitchOn;
```
Sau đó, tại dòng 1138–1145:
```typescript
// App.tsx dòng 1138-1142:
const sharedOpticalState = {
  isPoweredOn: isOpticsPowered, // <-- BIẾN NÀY ĐÈ TRẠNG THÁI CỦA TẤT CẢ THIẾT BỊ!
  supplyVoltageV: activeSupplyVoltageV,
  ...
};
```
Và tại dòng 1215–1222:
```typescript
// App.tsx dòng 1215-1222:
if (arch === 'optical-power-supply') {
  return {
    ...inst,
    instanceState: {
      ...inst.instanceState,
      ...sharedOpticalState, // <-- ĐÈ isPoweredOn CỦA CHÍNH BIẾN ÁP NGUỒN!
    },
  };
}
```

### 1.4. Phân tích nguyên lý vật lý bị vi phạm
1. **Đè trạng thái luẩn quẩn (Deadlock Loop):**
   * Giả sử đèn đang có công tắc tắt (`isLampSwitchOn = false`).
   * Khi đó, dù Biến áp nguồn có được người dùng bấm BẬT (`isPsuPoweredOn = true`), công thức tính ra `isOpticsPowered = false`.
   * Đối tượng `sharedOpticalState.isPoweredOn = false` được **spread đè ngược trở lại** vào `optical-power-supply`!
   * Kết quả: Công tắc nguồn vừa được bấm BẬT lập tức bị hàm reconcile đè lại thành `false`. Người dùng **không thể nào bật được nguồn điện**!
2. **Vi phạm tính độc lập của thiết bị:**
   * Trong thực tế, Biến áp nguồn (Power Supply) và Đèn chiếu (Lamp) là **hai thiết bị độc lập có hai công tắc vật lý riêng biệt**.
   * Biến áp nguồn bật thì ở hai cọc đầu ra có điện thế $12\text{ V}$. Nếu công tắc ở đuôi đèn đang tắt thì đèn không sáng, nhưng **biến áp nguồn vẫn phải đang BẬT**.
   * Gán chung một cờ `isPoweredOn` qua biến `sharedOpticalState` là lỗi nghiêm trọng làm mất ranh giới giữa nguồn cấp (Power Source) và tải tiêu thụ (Electrical Load).
3. **"Gian lận" bật nguồn từ xa:**
   * Trong [`LabViewport3D.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/LabViewport3D.tsx) (dòng 9360–9370), khi người dùng bấm nút `[🔦 BẬT / TẮT]` của đèn:
   ```typescript
   if (nextPower && !isPsuOn && psuInst) {
     onUpdateInstanceState?.(psuInst.instanceId, { isPoweredOn: true }); // Tự động bật nguồn hộ!
   }
   ```
   * Thao tác này vi phạm quan hệ nhân quả: Bấm công tắc ở đuôi đèn không thể tự phát sóng kích hoạt công tắc cơ khí của biến áp nguồn đặt cách đó một khoảng.

---

## 2. ĐÈN TỰ PHÁT SÁNG KHI CHƯA CÓ ĐIỆN HOẶC NGUỒN ĐANG TẮT

### 2.1. Hiện tượng thực tế
* Khi đặt Đèn chiếu sáng lẻ loi trên mặt bàn, trong phòng hoàn toàn chưa có Biến áp nguồn: bóng đèn halogen bên trong và khe chắn sáng phía trước đã tự động phát quang sáng rực.
* Đèn mới lôi từ kệ xuống bàn đã ở trạng thái sáng trước khi người dùng chạm vào công tắc.

### 2.2. Vị trí mã nguồn gây lỗi
* [`src/three-runtime/ProceduralLabModels.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/ProceduralLabModels.ts): Dòng 6171–6195.

### 2.3. Bằng chứng mã nguồn
```typescript
// ProceduralLabModels.ts dòng 6171-6192:
if (arch === 'optical-lamp') {
  const isPoweredOn = instance.instanceState.isPoweredOn !== false; // <-- undefined tự động thành TRUE!
  const beamMode = instance.instanceState.beamMode ?? 'triple';
  ...
  const slitNode = instanceRoot.getObjectByName('scale_display') as THREE.Mesh | undefined;
  if (slitNode && slitNode.material instanceof THREE.MeshBasicMaterial) {
    // Vẽ texture phát sáng màu vàng cho khe chắn sáng:
    const nextTex = createLampSlitCanvasTexture(isPoweredOn, beamMode, experimentMode, rayOffsetYCm);
    slitNode.material.map = nextTex;
  }
  const lampLight = instanceRoot.getObjectByName('lamp_point_light') as THREE.PointLight | undefined;
  if (lampLight) {
    // Bật nguồn sáng điểm 3D bên trong chao đèn:
    lampLight.intensity = isPoweredOn ? 0.35 + (voltageV / 12) * 0.55 : 0;
  }
}
```

### 2.4. Phân tích nguyên lý vật lý bị vi phạm
1. **Giá trị mặc định sai:** Cú pháp `instance.instanceState.isPoweredOn !== false` khiến cho mọi đối tượng đèn mới sinh ra (`isPoweredOn === undefined`) đều bị coi là **ĐANG BẬT**.
2. **Thiếu kiểm tra mạch kín:** Hàm `applyInstanceStateToObject3D` chỉ nhìn vào bản thân chiếc đèn. Nó không kiểm tra xem đèn có được cắm vào nguồn điện hay không, điện áp cấp có $> 0$ hay không.
3. Đèn halogen phòng thí nghiệm là tải thuần trở, không có pin tích điện bên trong. Khi chưa có dòng điện $I > 0$, dây tóc vonfram không thể phát xạ nhiệt và không thể phát ra bất kỳ photon ánh sáng nào.

---

## 3. CHÙM TIA SÁNG BỊ "BẮT CÓC" LỆCH KHỎI VỊ TRÍ ĐÈN

### 3.1. Hiện tượng thực tế
* Khi nhấc Đèn chiếu ra khỏi Ray quang học đặt ở vị trí khác trên bàn (ví dụ kéo ra mép bàn phía trước), chùm tia sáng không xuất phát từ đèn mà xuất hiện lơ lửng giữa không trung dọc theo ray quang học.

### 3.2. Vị trí mã nguồn gây lỗi
* [`src/three-runtime/LabViewport3D.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/LabViewport3D.tsx): Dòng 6436–6445.

### 3.3. Bằng chứng mã nguồn
```typescript
// LabViewport3D.tsx dòng 6436-6444:
const axisY = benchInst
  ? BENCH_SURFACE_Y + (benchInst.transform.positionM[1] ?? 0) + OPTICAL_BENCH_AXIS_Y
  : lampInst.transform.positionM[1] + BENCH_SURFACE_Y + OPTICAL_BENCH_AXIS_Y;

const axisZ = benchInst
  ? benchInst.transform.positionM[2] // <-- NẾU CÓ RAY, TRỤC Z BỊ ÉP THEO RAY!
  : lampInst.transform.positionM[2];

const lampApertureX = lampInst.transform.positionM[0] + 0.048;
```

### 3.4. Phân tích nguyên lý vật lý bị vi phạm
* Nếu trong cảnh có `benchInst`, code lấy luôn tọa độ $Z$ của thanh ray làm trục truyền sáng (`axisZ = benchInst.transform.positionM[2]`), thay vì lấy tọa độ $Z$ thực tế của chiếc đèn (`lampInst.transform.positionM[2]`).
* Khi đèn nằm ngoài ray, $Z_{\text{đèn}} \ne Z_{\text{ray}}$. Kết quả là đầu phát của đèn ở một nơi, còn chùm tia sáng lại bắn ra từ một điểm vô hình trên không trung cách đèn hàng chục centimet!
* Đúng nguyên lý: Tia sáng phải xuất phát từ đúng tâm thấu kính tụ sáng ở mặt trước của đèn:
  $$P_0 = (x_{\text{đèn}} + \Delta x, y_{\text{đèn}}, z_{\text{đèn}})$$
  và truyền theo vector hướng của đèn.

---

## 4. BẢN BÁN NGUYỆT TỰ PHÁT 3 TIA LASER KHI KHÔNG CÓ NGUỒN PHÁT

### 4.1. Hiện tượng thực tế
* Vừa lấy Bản bán nguyệt thủy tinh đặt lên bàn, chưa hề lôi Nguồn Laser ra, trên mặt đĩa đo góc $360^\circ$ đã xuất hiện sẵn 3 tia laser (đỏ, xanh lục, vàng) tự phát quang.

### 4.2. Vị trí mã nguồn gây lỗi
* [`src/three-runtime/ProceduralLabModels.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/ProceduralLabModels.ts): Dòng 3820–3860 và Dòng 6061–6083.

### 4.3. Bằng chứng mã nguồn
```typescript
// ProceduralLabModels.ts dòng 3820-3855 (Mesh dựng sẵn trong bản bán nguyệt):
const rayGroup = new THREE.Group();
rayGroup.name = 'ray_paths';

const incRay = new THREE.Mesh(rayGeo, new THREE.MeshBasicMaterial({ color: 0xff1e42 }));
incRay.name = 'incident_ray'; // Tia tới gắn cứng trong mesh
rayGroup.add(incRay);

const refRay = new THREE.Mesh(rayGeo, new THREE.MeshBasicMaterial({ color: 0x22c55e }));
refRay.name = 'refracted_ray'; // Tia khúc xạ gắn cứng trong mesh
rayGroup.add(refRay);

const rflRay = new THREE.Mesh(rayGeo, new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
rflRay.name = 'reflected_ray'; // Tia phản xạ gắn cứng trong mesh
rayGroup.add(rflRay);
```
Và tại dòng 6062–6082:
```typescript
// ProceduralLabModels.ts dòng 6062-6082:
if (arch === 'semicircular-slab') {
  const incDeg = instance.instanceState.incidentAngleDeg ?? 40;
  // Tự động xoay 3 tia mà không cần biết có nguồn laser hay không!
}
```

### 4.4. Phân tích nguyên lý vật lý bị vi phạm
* Tương tự như lỗi chùm tia tán sắc giả trước đây của Lăng kính, Bản bán nguyệt đã bị "nhồi" sẵn các mesh tia laser bên trong mô hình 3D.
* Khối thủy tinh bán nguyệt là một môi trường truyền quang thụ động ($n = 1.50$), bản thân nó không phải là nguồn phát quang. Tia sáng chỉ được hình thành khi có Nguồn Laser chiếu vào tâm đĩa $O$.

---

## 5. CUỘN CẢM ỨNG TỰ SÁNG ĐÈN LED ĐỎ KHI NAM CHÂM ĐỨNG YÊN

### 5.1. Hiện tượng thực tế
* Khi đặt Ống dây cảm ứng có 2 đèn LED lên bàn, chưa tác động gì vào thanh nam châm, đèn LED đỏ đã sáng rực rỡ.

### 5.2. Vị trí mã nguồn gây lỗi
* [`src/three-runtime/LabViewport3D.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/LabViewport3D.tsx): Dòng 470–476.
* [`src/three-runtime/ProceduralLabModels.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/ProceduralLabModels.ts): Dòng 6106–6116.

### 5.3. Bằng chứng mã nguồn
```typescript
// LabViewport3D.tsx dòng 470-476:
if (arch === 'induction-coil-led') {
  const defl = inst.instanceState.galvanometerDeflection ?? 0.6; // <-- Mặc định là 0.6!
  const badge =
    defl > 0.05
      ? 'LED 1 ĐỎ SÁNG' // <-- Luôn luôn nhảy vào nhánh này khi mới tạo!
      : defl < -0.05
        ? 'LED 2 XANH SÁNG'
        : '2 LED TẮT';
```
Và trong [`ProceduralLabModels.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/ProceduralLabModels.ts) dòng 6112–6116:
```typescript
if (led1 && led1.material instanceof THREE.MeshStandardMaterial) {
  led1.material.emissiveIntensity = defl >= 0 ? 1.2 : 0.1; // <-- defl >= 0 thì SÁNG RỰC (1.2)!
}
```

### 5.4. Phân tích nguyên lý vật lý bị vi phạm
* **Định luật cảm ứng điện từ Faraday:**
  $$\mathcal{E} = -\frac{d\Phi}{dt}$$
  Suất điện động cảm ứng chỉ xuất hiện khi có sự biến thiên của từ thông qua ống dây theo thời gian ($\frac{d\Phi}{dt} \ne 0$).
* Khi nam châm nằm yên hoặc khi chưa có thao tác đẩy/kéo ($\frac{d\Phi}{dt} = 0$), suất điện động cảm ứng bằng $0$, dòng điện $i = 0$, cả 2 đèn LED **bắt buộc phải tắt hoàn toàn** (`emissiveIntensity = 0.0`).
* Đặt mặc định `galvanometerDeflection = 0.6` và kiểm tra `defl >= 0` khiến cho ngay cả khi độ lệch bằng $0$, LED đỏ vẫn bị thắp sáng vô lý!

---

## 6. BÁT SỨ VÀ BÌNH CHƯNG CẤT TỰ SÔI $78.5^\circ\text{C}$ KHÔNG CẦN LỬA

### 6.1. Hiện tượng thực tế
* Bát sứ đựng cồn hoặc Bình chưng cất vừa đưa lên bàn, chưa có Đèn cồn nào ở dưới, đã hiển thị trạng thái "ĐANG ĐUN ($78.5^\circ\text{C}$)".
* Cầm nhiệt kế nhúng vào đo được ngay $78.5^\circ\text{C}$ của chất lỏng đang sôi, trong khi nhiệt độ phòng là $25^\circ\text{C}$!

### 6.2. Vị trí mã nguồn gây lỗi
* [`src/three-runtime/LabViewport3D.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/LabViewport3D.tsx): Dòng 484 và Dòng 4505–4508.

### 6.3. Bằng chứng mã nguồn
```typescript
// LabViewport3D.tsx dòng 484:
if (arch === 'porcelain-dish' || arch === 'distillation-flask') {
  const heating = inst.instanceState.isHeating !== false; // <-- undefined tự biến thành TRUE!
  return {
    readoutBadge: heating ? 'ĐANG ĐUN (78.5 °C)' : 'ĐÃ TẮT LỬA (25 °C)',
  };
}
```
Và tại dòng 4505–4508 khi nhúng nhiệt kế:
```typescript
if (draggedArch === 'thermometer') {
  const isHeated =
    (arch === 'porcelain-dish' || arch === 'distillation-flask') &&
    other.instanceState.isHeating !== false; // <-- Không có đèn cồn vẫn tính là heated!
  const targetTemp = isHeated ? 78.5 : 25.0;
  return {
    hint: `Nhúng Nhiệt kế đo nhiệt độ ${otherAsset.name.vi} (T = ${targetTemp.toFixed(1)} °C)`,
  };
}
```

### 6.4. Phân tích nguyên lý vật lý bị vi phạm
* Không kiểm tra nguồn nhiệt: Bát sứ chỉ có thể nóng lên khi có một Đèn cồn (`alcohol-burner`) đang cháy (`isHeating === true`) được đặt ngay bên dưới giá đỡ của bát sứ.
* Không có quán tính nhiệt: Nhiệt độ nhảy bậc từ $25^\circ\text{C} \to 78.5^\circ\text{C}$ tức thời, vi phạm định luật truyền nhiệt Fourier và phương trình cân bằng nhiệt:
  $$Q = m \cdot c \cdot \Delta T$$

---

## 7. ĐỒNG HỒ VẠN NĂNG DMM ĐO RA ĐIỆN ÁP TRONG KHÔNG KHÍ

### 7.1. Hiện tượng thực tế
* Đặt Đồng hồ vạn năng số (DMM) lên bàn, 2 que đo để lơ lửng trong không khí, màn hình LCD hiển thị ngay $12.00\text{ V}$ hoặc $0.75\text{ A}$.

### 7.2. Vị trí mã nguồn gây lỗi
* [`src/three-runtime/ProceduralLabModels.ts`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/ProceduralLabModels.ts): Dòng 6125–6135.

### 7.3. Bằng chứng mã nguồn
```typescript
// ProceduralLabModels.ts dòng 6125-6130:
if (arch === 'digital-multimeter') {
  const mode = instance.instanceState.multimeterMode ?? 'DCV';
  const val =
    instance.instanceState.multimeterValue ??
    (mode === 'DCV' ? 12.0 : mode === 'DCA' ? 0.75 : 16.0); // <-- Que đo lơ lửng vẫn có số đo!
```

### 7.4. Phân tích nguyên lý vật lý bị vi phạm
* Khi que đo hở mạch (Open Circuit):
  * Thang đo điện áp DCV phải hiển thị xấp xỉ $0.00\text{ V}$.
  * Thang đo dòng điện DCA phải hiển thị $0.00\text{ A}$.
  * Thang đo điện trở OHM phải hiển thị biểu tượng tràn thang/vô cực `O.L` ($R = \infty$).

---

## 8. DÂY ĐIỆN 3D TỰ NỐI "MA THUẬT" KHÔNG CẦN THAO TÁC CẮM GIẮC

### 8.1. Hiện tượng thực tế
* Chỉ cần lôi Biến áp nguồn và Đèn chiếu ra đặt ở bất kỳ đâu trên bàn, hai sợi dây điện đỏ/xanh tự động mọc ra và nối vào nhau, học sinh không cần cắm dây.
* Di chuyển Biến áp ra xa bao nhiêu, dây điện tự giãn dài bấy nhiêu mà không bị tuột giắc cắm.

### 8.2. Vị trí mã nguồn gây lỗi
* [`src/three-runtime/LabViewport3D.tsx`](file:///c:/Users/ltlie/Documents/GIT-DA/21.OpenEduLab/openlab-3d/src/three-runtime/LabViewport3D.tsx): Dòng 6352–6415.

### 8.3. Bằng chứng mã nguồn
```typescript
// LabViewport3D.tsx dòng 6352-6355:
if (psuInst && lampInst) {
  // Tự động tạo CatmullRomCurve3 nối giữa 2 máy bất chấp khoảng cách và tương tác!
```

---

## 9. BẢNG TỔNG HỢP NGUYÊN NHÂN GỐC RỄ & HƯỚNG KHẮC PHỤC

| STT | Hiện tượng lỗi | Nguyên nhân cốt lõi trong code | Hướng khắc phục chuẩn khoa học |
|:---:|:---|:---|:---|
| **1** | Bật/tắt nguồn không được; bấm tắt đèn thì nguồn tắt theo | `sharedOpticalState.isPoweredOn` trong `App.tsx` (dòng 1140, 1218) đè ngược vào `optical-power-supply` | Tách độc lập `psu.isPoweredOn` (công tắc nguồn) và `lamp.isPoweredOn` (công tắc đèn). Đèn chỉ sáng khi cả hai cùng ON. |
| **2** | Đèn chưa có điện đã phát sáng trong mô hình 3D | `ProceduralLabModels.ts` (dòng 6171) dùng `isPoweredOn !== false` và không kiểm tra nguồn điện cấp | Đèn mặc định `isPoweredOn: false`. Chỉ bật `lampLight` và texture sáng khi nhận được điện thế từ Biến áp nguồn. |
| **3** | Chùm tia sáng bị lệch khỏi đèn khi đèn ở ngoài ray | `LabViewport3D.tsx` (dòng 6441) ép `axisZ = benchInst.position.z` | Luôn lấy gốc tọa độ tia sáng theo vị trí thực của thấu kính hội tụ trên đèn $P_0 = (x_L, y_L, z_L)$. |
| **4** | Bản bán nguyệt tự sáng tia laser khi không có nguồn | Mesh 3D trong `ProceduralLabModels.ts` (dòng 3820) chứa sẵn 3 ống tia laser | Xóa bỏ các mesh tia cứng bên trong bản bán nguyệt; chỉ render tia khi Nguồn Laser chiếu vào. |
| **5** | Cuộn cảm ứng tự sáng LED đỏ khi nam châm đứng yên | `LabViewport3D.tsx` (dòng 470) gán `defl ?? 0.6`; `ProceduralLabModels.ts` so sánh `defl >= 0` | Đặt mặc định `defl = 0`. Chỉ sáng LED khi $|defl| > 0.15$ (đang có chuyển động tương đối $\frac{d\Phi}{dt} \ne 0$). |
| **6** | Bát sứ tự sôi $78.5^\circ\text{C}$ khi chưa đốt lửa | `LabViewport3D.tsx` (dòng 484) dùng `isHeating !== false` | Bát sứ mặc định $25^\circ\text{C}$ (`isHeating: false`). Chỉ nóng lên khi có Đèn cồn đang cháy đặt ngay dưới giá đỡ. |
| **7** | Đồng hồ DMM đo ra $12\text{V}$ giữa không khí | `ProceduralLabModels.ts` (dòng 6128) gán số đo mặc định $12\text{V}$ khi hở mạch | Khi que đo chưa cắm vào mạch kín, hiển thị $0.00\text{V}$, $0.00\text{A}$ và `O.L` cho thang đo điện trở. |
| **8** | Dây điện tự động nối ma thuật | `LabViewport3D.tsx` (dòng 6352) tự vẽ dây khi cả 2 thiết bị xuất hiện | Quản lý trạng thái cắm dây qua `AssemblySystem`: chỉ nối dây khi học sinh kéo giắc cắm vào cọc đấu nối. |
