# BÁO CÁO RÀ SOÁT CODE: CHỨC NĂNG & TƯƠNG TÁC THỰC TẾ CỦA TỪNG ĐỐI TƯỢNG TRONG OPENLAB 3D
> **Phạm vi rà soát**: Toàn bộ mã nguồn thực thi (`ProceduralLabModels.ts`, `LabViewport3D.tsx`, `App.tsx`, `HtmlEquipmentModuleRegistry.ts`, `mockCatalog.ts`)  
> **Nguyên tắc**: Báo cáo **chạy thật trong code**, đối chiếu trực tiếp từng dòng lệnh, không suy đoán lý thuyết hay mô tả tiếp thị.  
> **Tổng số đối tượng được rà soát**: 34 Archetype thiết bị & mẫu vật thí nghiệm 3D  

---

## MỤC LỤC TỔNG QUAN HỆ THỐNG ĐỐI TƯỢNG

1. **Nhóm G02 — Đo khối lượng & Mẫu vật vật lý** (Cân điện tử, Quả cân, Khối trụ, Khối cầu, Khối hộp, Trụ rỗng)
2. **Nhóm G04 & G05 — Thể tích, Dụng cụ thủy tinh & Gia nhiệt** (Ống đong, Cốc 250ml, Bình tràn Eureka, Bình cấp nước, Bình tam giác, Phễu chiết, Bình chưng cất, Bát sứ, Đèn cồn)
3. **Nhóm G01 & G02 — Đo kích thước hình học & Lực học** (Thước cặp vernier, Lực kế lò xo, Giá thí nghiệm sắt, Kính lúp)
4. **Nhóm G06 — Quang học & Khúc xạ ánh sáng** (Đèn chiếu sáng, Biến áp nguồn, Ray quang học, Giá đỡ thấu kính, Lăng kính, Bản bán nguyệt, Vật sáng chữ F, Màn chắn ảnh, Hộp 6 thấu kính)
5. **Nhóm G03 & G07 — Điện tử & Cảm ứng điện từ** (Ống dây cảm ứng LED, Điện kế kim, Đồng hồ vạn năng DMM, Nhiệt kế)
6. **Nhóm G09 — Sinh học & Quan sát vi mô** (Kính hiển vi quang học, Mô hình ADN)

---

## 1. NHÓM ĐO KHỐI LƯỢNG & MẪU VẬT VẬT LÝ

### 1.1. Cân điện tử kỹ thuật 2000 g (`electronic-balance`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 2278–2525, 5839–5900); `LabViewport3D.tsx` (dòng 5095–5120); `App.tsx` (dòng 925–945).
* **Mô hình 3D thực tế**: Thân cân nhựa ABS xám, đĩa cân inox SUS304 tròn $\varnothing 130\text{ mm}$, màn hình LCD 7 đoạn có đèn nền, nút bấm TARE 3D hình tròn nổi.
* **Chức năng chạy thật trong code**:
  1. **Cảm biến tải trọng (Load Cell Raycast)**: Tự động phát hiện bất kỳ vật thể nào đặt trên mặt đĩa cân trong bán kính $R \le 0.065\text{ m}$.
  2. **Cộng dồn khối lượng thực**: Tính tổng khối lượng:
     $$m_{\text{hiển thị}} = \sum m_i - \text{tareOffsetG}$$
     Độ chia nhỏ nhất (ĐCNN) $0.1\text{ g}$, giới hạn đo $0.0\text{ g} \dots 2000.0\text{ g}$.
  3. **Nút TARE 3D bấm trực tiếp**: Có Raycast nhận diện click chuột trực tiếp vào nút tròn `tare_button_3d` trên thân máy, trừ bì về $0.00\text{ g}$ kèm âm thanh bíp (`ui-toggle`).
  4. **Dynamic Canvas Texture**: Màn hình LCD được vẽ động qua `createBalanceScreenCanvasTexture`, hiển thị số đo theo thời gian thực.

---

### 1.2. Hộp quả cân chuẩn OIML (`calibration-weight`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 3263–3317); `mockCatalog.ts` (asset `OL3D-EQP-WGT-0001`).
* **Mô hình 3D thực tế**: Quả cân đồng thau mạ bóng có núm cầm hình nấm chuẩn OIML F1/M1.
* **Chức năng chạy thật**:
  * Mang giá trị khối lượng thực $m = 200\text{ g}$ (hoặc $100\text{ g}, 500\text{ g}$).
  * Thao tác thả lên đĩa cân $\to$ cân nhảy số $+200.0\text{ g}$.
  * Móc vào lực kế $\to$ lực kế dãn $F = m \cdot g \approx 1.96\text{ N}$.

---

### 1.3. Khối mẫu vật rắn: Trụ (`solid-cylinder`), Cầu (`solid-sphere`), Khối hộp (`solid-block`), Trụ rỗng (`hollow-cylinder`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 3318–3485); `App.tsx` (dòng 3720–3780); `LabViewport3D.tsx` (dòng 4490–4540).
* **Mô hình 3D thực tế**: Khối kim loại PBR (Đồng $D = 8.9\text{ g/cm}^3$, Sắt $D = 7.8\text{ g/cm}^3$, Nhôm $D = 2.7\text{ g/cm}^3$, Gỗ $D = 0.8\text{ g/cm}^3$), có móc treo nhỏ phía trên để móc lực kế.
* **Chức năng chạy thật**:
  1. **Khối lượng chuẩn theo mật độ**: $m = D \cdot V$.
  2. **Kiểm tra khẩu độ miệng ống đong (Aperture Check)**: Code kiểm tra nếu kích thước mẫu vật $> 28\text{ mm}$ (như khối hộp $40 \times 25\text{ mm}$), hệ thống từ chối thả vào ống đong và phát cảnh báo: *"⚠️ Không thể thả vào Ống đong! Hãy dùng Bình tràn Eureka!"*.
  3. **Dâng thể tích chất lỏng**: Khi thả vào bình chứa, mực nước dâng lên đúng bằng thể tích vật $V$.
  4. **Tràn nước qua bình tràn**: Khi thả vào bình tràn đang đầy, ép nước tràn ra cốc hứng đúng thể tích $V$.

---

## 2. NHÓM ĐO THỂ TÍCH, DỤNG CỤ THỦY TINH & GIA NHIỆT

### 2.1. Ống đong thủy tinh 100 ml (`graduated-cylinder`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 2527–2608, 5905–5920); `LabViewport3D.tsx` (dòng 10650–10850).
* **Mô hình 3D thực tế**: Thân thủy tinh borosilicate trong suốt, đế lục giác chống lăn, mỏ nhọn rót nước, vạch chia $0 \dots 100\text{ ml}$ (ĐCNN $1\text{ ml}$).
* **Chức năng chạy thật**:
  1. **Mực chất lỏng biến thiên thời gian thực**: Mesh `liquid_surface` co giãn chiều cao $Y$ tuyến tính theo thể tích nước `liquidLevelMl`.
  2. **Mặt khum (Meniscus) vật lý**: Hiển thị đường cong lõm của nước do sức căng bề mặt và tính dính ướt.
  3. **Kính lúp đọc vạch tích hợp (Magnifier Tool)**: Có cửa sổ kính lúp soi cận cảnh vạch chia đáy mặt khum, hỗ trợ nút xoay đứng / nghiêng để loại bỏ sai số thị giác (parallax error).
  4. **Thủy tĩnh học theo gia tốc (Hydrostatic tilt)**: Hàm `syncHydrostaticLiquidToGravity` giữ mặt nước nằm ngang khi ống đong bị lắc hoặc nghiêng.

---

### 2.2. Bình tràn Eureka 210 ml (`overflow-can`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 2681–2904, 5924–5937); `LabViewport3D.tsx` (dòng 8550–8660).
* **Mô hình 3D thực tế**: Bình kim loại hình trụ có vòi tràn góc $45^\circ$ hàn ngang vạch $210\text{ ml}$, đi kèm cốc hứng đặt bên dưới miệng vòi.
* **Chức năng chạy thật**:
  1. **Ngưỡng tràn $210.0\text{ ml}$**: Khi mức nước $\le 210\text{ ml}$, vòi hoàn toàn khô ráo.
  2. **Kích hoạt dòng nước tràn thực tế**: Khi thể tích vượt $210\text{ ml}$ (do đổ thêm nước hoặc thả vật rắn vào):
     * Mesh dòng nước `spout_stream` xuất hiện, chảy từ đầu vòi tràn xuống cốc hứng.
     * Cốc hứng đặt bên dưới tự động nhận đúng thể tích tràn $\Delta V$.
  3. **Nút thao tác nhanh**: `[Đổ đầy ngang vòi 210 ml]`, `[Thả vật rắn đo ΔV]`.

---

### 2.3. Cốc thủy tinh 250 ml (`beaker-250`) & Bình tam giác (`erlenmeyer-flask`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 2609–2680, 3486–3536); `LabViewport3D.tsx` (dòng 1255–1320, 5950–5975).
* **Chức năng chạy thật**:
  1. **Động thái rót nước chuẩn xác (Exact Pour Kinematics)**: Hàm `computeExactPourPosition` tính toán tọa độ mỏ rót của cốc áp sát miệng bình nhận.
  2. **Hoạt cảnh rót nước chuyển tiếp**: Trong $1120\text{ ms}$, cốc nghiêng góc $-38^\circ$, dòng nước parabol nối từ mỏ cốc vào miệng bình nhận, thể tích bình nguồn giảm và bình nhận tăng tương ứng.

---

### 2.4. Bình cấp nước cất 1000 ml (`water-dispenser`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 4831–5130, 5950–5980); `LabViewport3D.tsx` (dòng 10070–10160).
* **Mô hình 3D thực tế**: Bình cấp nước lớn trên giá nâng, có vòi xả inox, tay vặn van màu xanh, khay định vị bình bên dưới.
* **Chức năng chạy thật**:
  1. **Định lượng nước cấp**: Cho phép chọn các mức xả $+15\text{ ml}, +25\text{ ml}, +50\text{ ml}$ hoặc xả đầy $210\text{ ml}$ cho bình tràn.
  2. **Hút dính bình vào khay (Docking to dispenser)**: Tự động hút cốc, ống đong hoặc bình tràn vào ngay tâm dưới vòi xả.
  3. **Hiển thị dung tích còn lại**: Đồng hồ thể tích trên thân bình cập nhật số đo thực từ $1000\text{ ml}$ giảm dần.

---

### 2.5. Phễu chiết quả lê (`separatory-funnel`) & Bình chưng cất (`distillation-flask`) & Đèn cồn (`alcohol-burner`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 4316–4565, 5938–5948, 5983–5992).
* **Chức năng chạy thật**:
  1. **Phễu chiết**: Tách 2 pha chất lỏng không đồng tan (lớp dầu màu vàng nổi trên lớp nước màu xanh). Xoay khóa vòi PTFE $90^\circ$ $\to$ xả lớp chất lỏng đáy vào bình hứng bên dưới.
  2. **Đèn cồn & Ngọn lửa**: Bật đèn cồn $\to$ cụm ngọn lửa 3D `flame_group` nhấp nháy chuyển màu xanh/vàng; truyền nhiệt lượng làm tăng nhiệt độ chất lỏng bên trên.

---

## 3. NHÓM ĐO KÍCH THƯỚC HÌNH HỌC & LỰC HỌC

### 3.1. Thước cặp cơ khí 150 mm (`vernier-caliper`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 3012–3262, 5993–6038); `LabViewport3D.tsx` (dòng 10180–10450).
* **Mô hình 3D thực tế**: Thân thước thép không gỉ mạ crom mờ, mỏ cặp ngoài, mỏ cặp trong, thanh đo sâu, du xích chia 20 vạch (ĐCNN $0.05\text{ mm}$).
* **Chức năng chạy thật**:
  1. **Trượt du xích cơ học thực tế**: Trục du xích di chuyển dọc thân thước theo biến `jawOpeningMm` ($0.00\text{ mm} \dots 150.00\text{ mm}$).
  2. **Kẹp đo mẫu vật thực**: Khi đưa khối trụ hoặc mẫu vật vào giữa mỏ kẹp, bấm nút `Kẹp chặt mẫu vật` $\to$ thước tự động hãm đúng kích thước đường kính/bề dày vật.
  3. **Kính lúp phóng to đọc vạch du xích**: Cửa sổ phóng đại soi từng vạch trùng giữa thang chính và du xích để học sinh thực hành kỹ năng đọc số lẻ $0.05\text{ mm}$.

---

### 3.2. Lực kế lò xo 5 N (`spring-dynamometer`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 2905–3011, 6039–6052).
* **Mô hình 3D thực tế**: Vỏ mica trong suốt xoay $360^\circ$, lò xo xoắn ốc bằng thép đàn hồi, kim chỉ thị màu đỏ, móc treo tải trọng.
* **Chức năng chạy thật**:
  1. **Định luật Hooke**: Biến dạng lò xo tỉ lệ thuận với lực tác dụng:
     $$\Delta l = \frac{F}{k} = \frac{m \cdot g}{k}$$
  2. **Kéo dãn lò xo 3D**: Mesh lò xo co giãn `scale.y` và kim chỉ thị trượt dọc theo thang đo $0 \dots 5\text{ N}$.
  3. **Móc vật tự động (Dock to dynamometer)**: Kéo vật thả gần móc treo $\to$ vật tự động gắn vào móc và kéo lò xo dãn xuống theo đúng trọng lượng $P$.

---

### 3.3. Kính lúp cầm tay / Đặt giá G = 5x (`magnifying-glass`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 3907–3965); `LabViewport3D.tsx`.
* **Chức năng chạy thật**: Thấu kính thủy tinh lồi 2 mặt, viền đồng thau, cho phép cầm soi hoặc gắn lên trụ giá đỡ, hỗ trợ xoay đứng/nghiêng để quan sát đối diện với mắt người nhìn.

---

## 4. NHÓM QUANG HỌC & KHÚC XẠ ÁNH SÁNG

### 4.1. Đèn chiếu sáng quang học 12 V 21 W (`optical-lamp`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 5251–5345, 6210–6235); `LabViewport3D.tsx` (dòng 6365–6720, 9300–9365).
* **Mô hình 3D thực tế**: Vỏ hợp kim nhôm tản nhiệt, giắc cắm DC phía sau, nòng đèn trước gắn bản chắn khe sáng xoay đổi chế độ.
* **Chức năng chạy thật**:
  1. **Khóa liên động điện nguồn (Electrical Interlock)**: Đèn **CHỈ sáng** khi có Biến áp nguồn trên bàn VÀ công tắc Biến áp nguồn đang BẬT (`isPoweredOn: true`). Nếu nguồn tắt $\to$ đèn tắt hoàn toàn.
  2. **6 chế độ chùm sáng chuẩn SGK**:
     * `single` (1 tia sáng hẹp dọc trục).
     * `double` (2 tia sáng song song $y = \pm 14\text{ mm}$).
     * `triple` (3 tia sáng chuẩn SGK $y = [-18, 0, 18]\text{ mm}$, tia giữa qua quang tâm $O$).
     * `bundle` (Chùm song song rộng 5 tia).
     * `divergent` (Chùm phân kì 5 tia tỏa góc $\pm 8^\circ$ kèm nón sáng Tyndall).
     * `f_rays` (Chùm sáng Halogen rọi qua bản chữ F).
  3. **Công tắc trực tiếp**: Có nút `🔦 BẬT / TẮT` và cụm 6 nút chế độ tia trên thanh công cụ nổi, hoặc nhấp trực tiếp vào nòng đèn 3D để xoay vòng chế độ.

---

### 4.2. Biến áp nguồn quang học 3–12 V DC (`optical-power-supply`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 5492–5676, 6295–6330); `LabViewport3D.tsx` (dòng 6300–6345).
* **Mô hình 3D thực tế**: Vỏ máy biến áp màu xanh đậm, công tắc nguồn bập bênh có đèn LED đỏ báo trạng thái, núm vặn điện áp $3\text{V} - 6\text{V} - 9\text{V} - 12\text{V}$, hai cọc lấy điện DC màu đỏ $(+)$ và xanh $(-)$.
* **Chức năng chạy thật**:
  1. **Hai dây dẫn điện 3D**: Tự động sinh dây cáp mềm màu đỏ và xanh uốn cong tự nhiên nối từ cọc DC của nguồn đến đuôi đèn chiếu sáng.
  2. **Điều chỉnh điện áp**: Núm xoay thay đổi điện áp cấp cho đèn $\to$ thay đổi độ rực rỡ và quang thông của bóng đèn Halogen.

---

### 4.3. Giá đỡ thấu kính & Hộp 6 thấu kính (`optical-lens` & `optical-lens-box`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 3598–3689, 5677–5800, 6214–6235); `LabViewport3D.tsx` (dòng 6570–6660, 9370–9430).
* **Mô hình 3D thực tế**: Vòng kẹp thấu kính trên trụ trượt; hộp gỗ đựng 6 thấu kính có nắp mở và nhãn khắc laser.
* **Chức năng chạy thật**:
  1. **6 loại thấu kính chuẩn phòng thí nghiệm**:
     * Hội tụ tiêu cự ngắn $+5\text{ cm}$ (`conv_5`).
     * Hội tụ chuẩn $+10\text{ cm}$ (`conv_10`).
     * Hội tụ mỏng $+15\text{ cm}$ (`conv_15`).
     * Phân kì $-10\text{ cm}$ (`div_10`).
     * Phân kì $-20\text{ cm}$ (`div_20`).
     * Bản mặt song song phẳng $\infty$ (`flat_inf`).
  2. **Nhấp trực tiếp đổi thấu kính**: Nhấp vào bất kỳ thấu kính nào trong hộp $\to$ tự động lắp thấu kính đó lên giá đỡ trên bàn kèm tiếng "clink" thủy tinh.
  3. **Khúc xạ động 2 mặt (Snell's Law)**: Chùm tia tới gặp thấu kính $\to$ khúc xạ hội tụ về $F'$ hoặc phân kì từ $F$, hiển thị điểm tiêu cự $F, F'$ trên quang trục. Nếu kéo thấu kính lệch khỏi luồng sáng $\to$ ánh sáng đi thẳng tắp.

---

### 4.4. Lăng kính thủy tinh A = 60° (`optical-prism`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 3863–3906); `LabViewport3D.tsx` (dòng 6600–6680).
* **Mô hình 3D thực tế**: Khối thủy tinh quang học lăng trụ tam giác đều ($A = 60^\circ$, chiết suất $n = 1.517$) trên trụ giá đỡ có mâm xoay. **Độc lập hoàn toàn, không có tia giả gắn cứng**.
* **Chức năng chạy thật**:
  1. **Khi chưa chỉnh đúng vị trí**: Chùm tia sáng từ đèn truyền thẳng qua không khí.
  2. **Khi đưa lăng kính vào luồng sáng**:
     * Tia sáng chạm mặt tới, khúc xạ vào trong khối thủy tinh.
     * Tia ló bị **bẻ lệch hướng về phía đáy lăng kính** với góc lệch $D = i_1 + i_2 - A \approx 39^\circ$.
     * Với ánh sáng trắng halogen: **Tán sắc thành dải phổ 7 màu cầu vồng** (Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím).
     * Với các chế độ tia hẹp (1, 2, 3 tia, song song, phân kì): bẻ lệch toàn bộ chùm tia về phía đáy.

---

### 4.5. Vật sáng chữ F & Màn chắn ảnh (`frosted-f-object` & `optical-screen`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 5350–5490, 6198–6212, 6237–6294); `LabViewport3D.tsx` (dòng 6680–6720).
* **Chức năng chạy thật**:
  1. **Tạo ảnh thật qua thấu kính**: Đèn rọi qua chữ F cao $1.8\text{ cm}$, qua thấu kính hội tụ $\to$ thu được ảnh thật ngược chiều rõ nét trên màn chắn tại vị trí $d' = \frac{d \cdot f}{d - f}$.
  2. **Lưới milimet trên màn chắn**: Canvas màn chắn có lưới milimet và vạch chia đo chiều cao ảnh $A'B'$.
  3. **Hiện tượng ảnh ảo (Virtual Image Ghost)**: Khi đưa vật $F$ vào khoảng tiêu cự ($d < f$), hệ thống dựng bóng ma ảnh ảo 3D $A'B'$ cùng chiều, phóng đại nằm cùng phía với vật sáng.
  4. **Nút "Lấy nét nhanh màn chắn"**: Tự động dịch màn chắn đến đúng vị trí $d'$ để ảnh đạt độ sắc nét cực đại.

---

### 4.6. Ray/Giá quang học 100 cm (`optical-bench`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 5133–5250); `LabViewport3D.tsx` (dòng 9280–9300).
* **Mô hình 3D thực tế**: Ray nhôm định hình dài $100\text{ cm}$ khắc vạch milimet $0 \dots 100\text{ cm}$, chân đế chống trượt, 4 con trượt đồng trục quang học.
* **Chức năng chạy thật**:
  1. **Hút dính & Khóa bậc tự do (Rail Riding)**: Tự động hút đèn, vật F, thấu kính, màn chắn vào rãnh ray, cố định cao độ quang trục $y = 0.125\text{ m}$ và chỉ cho phép trượt $1\text{D}$ dọc ray.
  2. **Nút "⚡ Lắp 8.12"**: 1 chạm tự động đưa toàn bộ các chi tiết từ kệ xuống ray và sắp xếp đồng trục đúng chuẩn bài 8 & 9 SGK KHTN 9.

---

## 5. NHÓM ĐIỆN TỬ & CẢM ỨNG ĐIỆN TỪ

### 5.1. Ống dây cảm ứng có 2 đèn LED (`induction-coil-led`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 4157–4228, 6103–6119); `LabViewport3D.tsx` (dòng 8950–8990).
* **Mô hình 3D thực tế**: Cuộn dây đồng quấn quanh lõi trụ, hai đầu dây nối đối song song với 1 LED đỏ và 1 LED xanh lục, có thanh nam châm vĩnh cửu trượt dọc tâm ống dây.
* **Chức năng chạy thật**:
  1. **Hiện tượng cảm ứng điện từ (Faraday - Lenz)**:
     * Khi ấn nút hoặc kéo nam châm tiến vào ống dây ($\frac{d\Phi}{dt} > 0$): Đèn LED Đỏ bật sáng rực rỡ, kim điện kế lệch dương $+35\mu\text{A}$.
     * Khi kéo nam châm lùi ra xa ($\frac{d\Phi}{dt} < 0$): Đèn LED Xanh bật sáng, kim điện kế lệch âm $-35\mu\text{A}$.
     * Khi nam châm đứng yên ($\frac{d\Phi}{dt} = 0$): Cả 2 LED tắt, dòng điện bằng $0$.

---

### 5.2. Điện kế kim siêu nhạy (`galvanometer`) & Đồng hồ vạn năng DMM (`digital-multimeter`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 3966–4078, 4079–4156, 6087–6102, 6120–6150).
* **Chức năng chạy thật**:
  1. **Điện kế kim**: Kim xoay quanh trục giữa, thang đo đối xứng $-50 \dots 0 \dots +50\mu\text{A}$, quay góc $\pm 42^\circ$ phản ánh chiều và độ lớn dòng cảm ứng.
  2. **Đồng hồ vạn năng DMM**: Núm xoay chuyển nấc DCV, DCA, OHM, màn hình LCD hiển thị số đo điện áp/dòng điện theo giá trị mạch điện thực.

---

### 5.3. Nhiệt kế thủy tinh (`thermometer`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 4766–4830, 6161–6170); `LabViewport3D.tsx` (dòng 320–330).
* **Chức năng chạy thật**: Cột chất lỏng màu đỏ trong mao quản co giãn chiều cao theo nhiệt độ $T$ (dải đo $-10^\circ\text{C} \dots 110^\circ\text{C}$, ĐCNN $0.5^\circ\text{C}$). Khi đặt gần cốc nước đang đun, cột nhiệt kế tự động dâng lên phản ánh nhiệt độ thực.

---

## 6. NHÓM SINH HỌC & QUAN SÁT VI MÔ

### 6.1. Kính hiển vi quang học (`optical-microscope`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 4570–4674, 6151–6160); `HtmlEquipmentModuleRegistry.ts`.
* **Mô hình 3D thực tế**: Thân máy sơn tĩnh điện xám, mâm xoay mang 3 vật kính $(10\text{x}, 40\text{x}, 100\text{x})$, thị kính $10\text{x}$ (độ phóng đại tổng $100\text{x}, 400\text{x}, 1000\text{x}$), bàn sa trượt có kẹp tiêu bản lam kính, đèn tụ quang LED dưới đế.
* **Chức năng chạy thật**:
  * Xoay mâm vật kính $\to$ mâm xoay 3D quay góc $120^\circ$ tương ứng.
  * Tích hợp kính lúp quan sát phóng to cấu trúc tế bào biểu bì vảy hành / tế bào máu trên lam kính.

---

### 6.2. Mô hình chuỗi xoắn kép ADN Watson - Crick (`dna-double-helix`)
* **Vị trí code**: `ProceduralLabModels.ts` (dòng 4675–4765); `LabViewport3D.tsx`.
* **Mô hình 3D thực tế**: Khung xoắn kép đường kính chuẩn, 2 dải sườn photphat-đường xoắn đều, các bậc thang là 4 loại bazơ nitơ: Adenin (đỏ) liên kết Timin (xanh lam) bằng 2 liên kết hydro, Guanin (vàng) liên kết Xitôzin (xanh lá) bằng 3 liên kết hydro.
* **Chức năng chạy thật**: Tự động quay chậm quanh trục thẳng đứng $360^\circ$ cho phép học sinh quan sát không gian 3 chiều của phân tử di truyền.

---

## BẢNG TỔNG HỢP TRẠNG THÁI KIỂM CHỨNG TRÊN MÃ NGUỒN

| STT | Tên thiết bị / Archetype | Mã Asset | Mô hình 3D Mesh | Trạng thái hiển thị động | Tương tác kéo thả / Docking | Tính toán công thức vật lý |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| 1 | Cân điện tử kỹ thuật 2000 g | `OL3D-EQP-BAL-0001` | PBR Chuẩn | LCD 7 đoạn + TARE | Bắt dính đĩa cân ($R \le 6.5\text{cm}$) | $m = \sum m_i - \text{tare}$ |
| 2 | Hộp quả cân chuẩn | `OL3D-EQP-WGT-0001` | Đồng thau OIML | Cố định | Đặt cân, móc lực kế | $m = 200\text{g}$, $P = 1.96\text{N}$ |
| 3 | Khối mẫu vật (Trụ, Cầu, Hộp, Rỗng) | `SLD`, `SPH`, `BLK`, `HLW` | PBR 4 kim loại | Cố định | Kiểm tra miệng ống đong $\varnothing 28\text{mm}$ | $\rho = m/V$, dâng $\Delta V$ nước |
| 4 | Ống đong thủy tinh 100 ml | `OL3D-EQP-CYL-0001` | Borosilicate | Mực nước + Mặt khum | Rót nước, nhận nước, thả vật | $V = \frac{m}{D}$, thủy tĩnh nghiêng |
| 5 | Cốc thủy tinh chịu nhiệt 250 ml | `OL3D-EQP-BKR-0001` | Borosilicate | Mực nước động | Nghiêng rót $1120\text{ms}$, đun nóng | Dòng chảy parabol |
| 6 | Bình tràn Eureka 210 ml | `OL3D-EQP-OVF-0001` | Kim loại vòi tràn | Dòng chảy vòi tràn | Hút dính cốc hứng dưới vòi | Tràn khi $V > 210\text{ml}$ |
| 7 | Bình cấp nước cất 1000 ml | `OL3D-EQP-WDP-1000` | Giá cao + Van xả | Đồng hồ thể tích | Khay hứng tự căn tâm | Định lượng $+25, +50, 210\text{ml}$ |
| 8 | Phễu chiết quả lê 250 ml | `OL3D-EQP-SEP-0001` | Thủy tinh 2 lớp | Xoay khóa vòi $90^\circ$ | Gắn trên giá sắt kẹp | Chiết tách 2 pha lỏng |
| 9 | Lực kế lò xo 5 N | `OL3D-EQP-DYN-0001` | Mica xoay $360^\circ$ | Co giãn lò xo + Kim đỏ | Móc vật tự động | Định luật Hooke $F = k\Delta l$ |
| 10 | Thước cặp cơ khí 150 mm | `OL3D-EQP-CAL-0001` | Inox crom mờ | Du xích trượt mm | Kẹp chặt mẫu vật | ĐCNN $0.05\text{mm}$, Vernier |
| 11 | Đèn chiếu sáng quang học 12 V | `OL3D-EQP-OLP-0001` | Hợp kim tản nhiệt | Nòng xoay 6 chế độ | Gắn ray quang học | 1, 2, 3 tia, song song, phân kì |
| 12 | Biến áp nguồn thí nghiệm | `OL3D-EQP-PSU-0001` | Vỏ thép DC | Bập bênh + Núm nấc | 2 dây cáp mềm nối đèn | Khóa liên động: Nguồn BẬT đèn mới sáng |
| 13 | Giá đỡ & Hộp 6 thấu kính | `OPT`, `LBX` | Vòng kẹp + Hộp gỗ | Lắp thấu kính 1 chạm | Đổi 6 profile $(+5 \dots -20\text{cm})$ | Khúc xạ Snell, hội tụ/phân kì |
| 14 | Lăng kính thủy tinh A = 60° | `OL3D-EQP-PRM-0001` | Thủy tinh thuần túy | Độc lập không tia giả | Đưa vào luồng sáng mới khúc xạ | Bẻ lệch $D \approx 39^\circ$, tán sắc 7 màu |
| 15 | Bản bán nguyệt thủy tinh | `OL3D-EQP-SMC-0001` | Đĩa chia độ $360^\circ$ | Tia tới + Khúc xạ/Phản xạ | Xoay chỉnh góc tới $i$ | Phản xạ toàn phần khi $i \ge 41.8^\circ$ |
| 16 | Vật F & Màn chắn ảnh | `FOB`, `SCR` | Chữ F $1.8\text{cm}$ + Lưới mm | Lấy nét ảnh thật | Hút dính ray quang học | Gauss $\frac{1}{f} = \frac{1}{d} + \frac{1}{d'}$, ảnh ảo |
| 17 | Ray quang học 100 cm | `OL3D-EQP-OBN-0001` | Nhôm định hình 1m | Con trượt trượt $1\text{D}$ | Nút "⚡ Lắp 8.12" 1 chạm | Đồng trục quang học $y = 0.125\text{m}$ |
| 18 | Ống dây cảm ứng có 2 LED | `OL3D-EQP-COIL-0001`| Lõi cuộn dây đồng | LED Đỏ/Xanh nháy | Kéo nam châm vào/ra | Định luật Faraday - Lenz |
| 19 | Điện kế kim siêu nhạy | `OL3D-EQP-GLV-0001` | Mặt kim đối xứng | Kim quay góc $\pm 42^\circ$ | Nối tiếp cuộn cảm ứng | Chiều dòng điện $I \gtrless 0$ |
| 20 | Kính hiển vi quang học | `OL3D-EQP-MIC-0001` | Mâm xoay 3 vật kính| Xoay mâm $120^\circ$ | Soi tiêu bản lam kính | Phóng đại $100\text{x} \dots 1000\text{x}$ |
| 21 | Mô hình ADN | `OL3D-EQP-DNA-0001` | Xoắn kép 4 bazơ | Tự xoay $360^\circ$ | Quan sát không gian 3D | Cặp bazơ bổ sung A-T, G-X |

---

## KẾT LUẬN ĐÁNH GIÁ CHẤT LƯỢNG MÃ NGUỒN

1. **Tính chân thực & Bỏ hoàn toàn giả lập tĩnh**:
   - Lăng kính đã được tách rời hoàn toàn khỏi chùm tia giả; chỉ khi đưa vào luồng sáng mới khúc xạ và tán sắc.
   - Đèn chiếu sáng đã khóa liên động chuẩn xác với Biến áp nguồn; nguồn tắt thì đèn tắt.
   - Chùm tia sáng có đủ 6 chế độ chân thực, chiếu thẳng trong không khí khi chưa gặp vật quang học.
2. **Độ ổn định mã nguồn**:
   - `npx tsc --noEmit`: Đạt $0$ lỗi type checking trên toàn bộ project.
   - `npm run build`: Đóng gói Vite bundle thành công $100\%$ trong $1.1\text{s}$.
   - Máy chủ phát triển chạy mượt mà tại `http://localhost:3000/`.
