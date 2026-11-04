# BÁO CÁO NGHIỆM THU TƯƠNG TÁC KHOA HỌC CHUYÊN SÂU OPENLAB 3D
## (Scientific Interaction Acceptance Test Report - OpenLab 3D v1.2)

> [!IMPORTANT]
> Báo cáo này tổng hợp kết quả kiểm thử thực nghiệm 24 kịch bản tương tác khoa học (SCI-01 $\dots$ SCI-24) thuộc 8 nhóm lỗi vi phạm nguyên lý hoạt động vật lý trong OpenLab 3D, đối chiếu trực tiếp với mã nguồn và kiểm thử tự động.

---

## 1. TỔNG KẾT NGHIỆM THU KHOA HỌC

| Chỉ số đánh giá | Giá trị đạt được | Tiêu chuẩn nghiệm thu | Đánh giá |
| :--- | :---: | :---: | :---: |
| **Tổng số kịch bản kiểm thử** | **24 / 24 kịch bản** | 24 kịch bản | **PASS (100.0%)** |
| **Số lỗi nghiêm trọng P0** | **0 lỗi** | 0 lỗi P0 | **ĐẠT CHUẨN** |
| **Số lỗi P1 / P2 / P3** | **0 lỗi** | 0 lỗi | **ĐẠT CHUẨN** |
| **Bảo toàn chức năng lắp ráp RWSS v1.1.1** | **100.0 / 100 điểm** | $\ge 85$ điểm, 0 P0 | **XUẤT SẮC** |
| **Biên dịch mã nguồn TypeScript (`tsc`)** | **Exit code 0 (0 lỗi)** | Không có lỗi biên dịch | **ĐẠT CHUẨN** |
| **Đóng gói sản phẩm (`npm run build`)** | **Vite build thành công** | Build thành công | **ĐẠT CHUẨN** |

---

## 2. BẢNG CHI TIẾT 24 KỊCH BẢN KIỂM THỬ KHOA HỌC (SCI-01 .. SCI-24)

| Mã test | Nhóm | Tên kịch bản | Điều kiện đầu vào | Kết quả kỳ vọng khoa học | Kết quả thực tế kiểm thử | Đánh giá |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| **SCI-01** | P01 | PSU On, Lamp Off | PSU = ON, Lamp = OFF, Dây = Cắm | PSU duy trì ON, Lamp duy trì OFF, Đèn không sáng | `psu=true, lamp=false, isLampLit=false` | **PASS** |
| **SCI-02** | P01 | Lamp On, PSU Off | PSU = OFF, Lamp = ON, Dây = Cắm | Lamp duy trì ON, PSU duy trì OFF, Đèn không sáng | `psu=false, lamp=true, isLampLit=false` | **PASS** |
| **SCI-03** | P01 | PSU Toggle Persistence | Lamp = OFF $\to$ Bật PSU $\to$ 3 render cycle | PSU vẫn ON, không bị ghi đè về OFF | `psu=true, lamp=false` | **PASS** |
| **SCI-04** | P02 | No Power No Light | Đèn độc lập trên bàn, không có điện | `PointLight.intensity = 0`, texture unlit | `pointLight.intensity = 0` | **PASS** |
| **SCI-05** | P02 | Lamp Lit on Valid Circuit | PSU = ON (12V), Lamp = ON, Dây = Cắm | Đèn sáng rực rỡ, `PointLight.intensity > 0.5` | `pointLight.intensity = 1.10` | **PASS** |
| **SCI-06** | P02 | Voltage Dimming | PSU = ON (3V), Lamp = ON, Dây = Cắm | Đèn sáng vàng dịu, quang thông thấp hơn 12V | `0 < 0.54 < 1.10` | **PASS** |
| **SCI-07** | P08 | Unplugged Cables | PSU = ON (12V), Lamp = ON, Dây = Rút | Mạch hở tức thời, đèn tắt hoàn toàn | `isCircuitClosed=false, isLampLit=false` | **PASS** |
| **SCI-08** | P08 | Cable Max Length Exceeded | Kéo đèn cách nguồn $d = 0.85\text{ m} > 0.70\text{ m}$ | Dây tuột/quá căng, hở mạch, đèn tắt | `isWithinMaxReach=false, cableDist=0.85m` | **PASS** |
| **SCI-09** | P08 | Plugged Within Reach | Đặt gần nguồn $d = 0.35\text{ m} \le 0.70\text{ m}$, cắm dây | Dây nối thành công, mạch kín, đèn sáng | `isWithinMaxReach=true, isLampLit=true` | **PASS** |
| **SCI-10** | P03 | Lamp Off-Bench Ray Position | Đèn đặt tại $(0.4, 0.8, -0.2)$, ngoài ray | Gốc tia sáng tại $z = -0.2\text{ m}$, không bị kéo vào ray $z = 0.04\text{ m}$ | `rayOriginZ = -0.2m, benchZ = 0.04m` | **PASS** |
| **SCI-11** | P03 | Lamp Rotated 45 Degrees | Đèn xoay góc $45^\circ$ trên bàn | Vector truyền tia sáng quay đúng $45^\circ$ | `angle = 45.0 deg` | **PASS** |
| **SCI-12** | P03 | Lamp Off Ray Extinction | Đèn tắt (`isLampLit = false`) | Số lượng tia sáng vẽ ra bằng đúng 0 | `beamRaysCount = 0` | **PASS** |
| **SCI-13** | P04 | Semicircular Slab Standalone | Đặt bản bán nguyệt trên bàn không có laser | Cụm `ray_paths` ẩn hoàn toàn (`visible = false`) | `ray_paths.visible = false` | **PASS** |
| **SCI-14** | P04 | Semicircular Slab Under Laser | Bật laser chiếu vào tâm bản bán nguyệt ($i = 30^\circ$) | Tia tới và tia khúc xạ xuất hiện theo định luật Snell | `ray_paths.visible = true, refRay = true` | **PASS** |
| **SCI-15** | P05 | Stationary Magnet | Nam châm đứng yên ($v = 0$, $\frac{d\Phi}{dt} = 0$) | Kim chỉ 0, LED 1 = OFF ($0.0$), LED 2 = OFF ($0.0$) | `led1=0.0, led2=0.0` | **PASS** |
| **SCI-16** | P05 | Magnet Inserted Fast | Nam châm tiến nhanh vào ($\frac{d\Phi}{dt} > 0$) | Kim lệch dương, LED 1 (đỏ) sáng ($1.4$), LED 2 tắt ($0.0$) | `led1=1.4, led2=0.0` | **PASS** |
| **SCI-17** | P05 | Magnet Withdrawn Fast | Nam châm rút nhanh ra ($\frac{d\Phi}{dt} < 0$) | Kim lệch âm, LED 1 tắt ($0.0$), LED 2 (xanh) sáng ($1.4$) | `led1=0.0, led2=1.4` | **PASS** |
| **SCI-18** | P06 | Dish Ambient Temperature | Bát sứ đặt trên bàn không có đèn cồn | Nhiệt độ bằng nhiệt độ phòng $25.0^\circ\text{C}$ | `temp = 25.0 °C` | **PASS** |
| **SCI-19** | P06 | Dish Heating Under Lit Burner | Bát sứ trên kiềng, đèn cồn đốt bên dưới | Nhận nhiệt lượng $\implies$ Nhiệt độ tăng lên $78.5^\circ\text{C}$ | `isDirectlyHeated=true, temp=78.5 °C` | **PASS** |
| **SCI-20** | P06 | Burner Extinguished / Removed | Dịch chuyển đèn cồn ra xa ($d = 0.50\text{ m} > 0.10\text{ m}$) | Mất nguồn nhiệt $\implies$ Hạ nhiệt về $25.0^\circ\text{C}$ | `isDirectlyHeated=false, temp=25.0 °C` | **PASS** |
| **SCI-21** | P07 | DMM Probes Open Circuit DCV | DMM thang DCV khi que đo thả nổi | Hiển thị $0.00\text{ V}$ (không hiển thị điện áp ảo) | `display = "0.00:V"` | **PASS** |
| **SCI-22** | P07 | DMM Probes on 12V Terminals | Que đo cắm cọc nguồn 12V đang bật | Hiển thị chính xác $12.00\text{ V}$ theo nguồn cấp | `display = "12.00:V"` | **PASS** |
| **SCI-23** | P07 | DMM Resistance Open Circuit | DMM thang OHM khi que đo hở mạch | Hiển thị `"O.L"` (điện trở vô cùng lớn) | `display = "O.L:Ω"` | **PASS** |
| **SCI-24** | P02 | Threshold Ignition Voltage | Nguồn cấp $1.5\text{V} < V_{\text{threshold}} = 2.5\text{V}$ | Mạch kín nhưng tim đèn chưa đủ nóng để phát quang | `circuitClosed=true, V=1.5V, isLampLit=false` | **PASS** |

---

## 3. ĐÁNH GIÁ CHI TIẾT THEO 8 NHÓM LỖI NGUYÊN LÝ

### 1. Nhóm P01: Quản lý trạng thái nguồn và thiết bị (3/3 PASS)
- **Tình trạng trước cải tiến:** Đèn và nguồn bị khóa trạng thái lẫn nhau. Tắt công tắc đèn làm nguồn bị cưỡng bức tắt; bật nguồn không thể duy trì nếu đèn đang tắt.
- **Sau cải tiến:** Tách bạch 100% hai máy trạng thái nội tại. Nguồn điện có công tắc riêng; đèn có công tắc riêng. Trạng thái phát sáng của đèn `isLampLit` là kết quả tính toán độc lập của `solveElectricalCircuit`, không ghi đè ngược vào công tắc của thiết bị nào.

### 2. Nhóm P02: Điều kiện cấp điện và phát sáng (4/4 PASS)
- **Tình trạng trước cải tiến:** Đèn tự phát sáng khi đặt ra bàn dù chưa cắm điện, chưa bật nguồn.
- **Sau cải tiến:** Đèn tuân thủ nghiêm ngặt điều kiện phát xạ quang học:
  $$\text{isLampLit} \iff (\text{isCablesConnected} \land \text{PSU.isPoweredOn} \land \text{Lamp.isPoweredOn} \land V_{\text{psu}} \ge 2.5\text{V})$$
  Cường độ và màu sắc ánh sáng phản ánh chính xác hiệu điện thế ($3\text{V}$ ánh sáng vàng dịu, $12\text{V}$ ánh sáng trắng halogen).

### 3. Nhóm P08: Hệ thống dây dẫn và kết nối điện thực (3/3 PASS)
- **Tình trạng trước cải tiến:** Dây dẫn tự động vẽ trong cảnh 3D không qua thao tác cắm dây của người dùng và không giới hạn khoảng cách vật lý.
- **Sau cải tiến:** Cặp dây cắm bắp chuối 12V (Dương đỏ, Âm xanh) được quản lý qua `AssemblyConnectorSpec` (`CONN_LAMP_DC_IN_POS` / `NEG` $\longleftrightarrow$ `CONN_PSU_DC_OUT_POS` / `NEG`). Dây chỉ nối khi người dùng cắm và khoảng cách $d \le 0.70\text{ m}$. Kéo thiết bị quá xa sẽ tự động hở mạch và ngắt dòng điện.

### 4. Nhóm P03: Quang học hình học & Tọa độ gốc thực tế (3/3 PASS)
- **Tình trạng trước cải tiến:** Tia sáng luôn bị ép trục $Z$ theo thanh ray quang học `optical-bench`, dẫn đến việc đèn đặt ngoài bàn vẫn phát tia sáng từ trong ray.
- **Sau cải tiến:** Gốc tia sáng $\vec{r}_{\text{origin}}$ gắn chặt vào lỗ đèn thế giới thực $(x_L + 0.048, y_L + \text{OPTICAL\_BENCH\_AXIS\_Y}, z_L)$. Khi đèn xoay góc $45^\circ$, vector chùm tia quay chính xác $45^\circ$. Khi đèn tắt, số tia sáng bằng 0.

### 5. Nhóm P04: Bản bán nguyệt không tự phát sinh tia sáng (2/2 PASS)
- **Tình trạng trước cải tiến:** Cụm tia khúc xạ và phản xạ được nướng sẵn vào mô hình `semicircular-slab`, tự sáng ngay cả khi đứng trơ trọi một mình.
- **Sau cải tiến:** Bản bán nguyệt là quang cụ thụ động thuần túy. Cụm tia sáng ẩn hoàn toàn (`visible = false`) cho tới khi có chùm tia laser thực sự chiếu vào mặt phân cách.

### 6. Nhóm P05: Cảm ứng điện từ & Đèn LED hiển thị (3/3 PASS)
- **Tình trạng trước cải tiến:** Khi mở cuộn dây ra bàn, kim lệch sẵn $0.6$ và LED 1 đỏ phát sáng liên tục dù nam châm không chuyển động.
- **Sau cải tiến:** Khi nam châm đứng yên ($\frac{d\Phi}{dt} = 0$), kim điện kế chỉ vạch 0 và cả 2 LED đều tắt ($0.0\text{ emissive}$). Đưa nam châm lại gần làm LED 1 đỏ sáng; rút nam châm ra xa làm LED 2 xanh sáng.

### 7. Nhóm P06: Nhiệt học & Nguồn nhiệt thực tế (3/3 PASS)
- **Tình trạng trước cải tiến:** Bát sứ tự động nóng sẵn $78.5^\circ\text{C}$ giữa không khí; cắm nhiệt kế vào lập tức đọc $78.5^\circ\text{C}$ mà không cần đèn cồn.
- **Sau cải tiến:** Nhiệt độ mặc định là nhiệt độ phòng $25.0^\circ\text{C}$. Bát sứ chỉ tăng nhiệt độ khi có đèn cồn đang cháy đặt ngay bên dưới đáy ($\Delta r_{xz} \le 0.10\text{ m}$). Khi tắt lửa hoặc kéo đèn cồn ra xa, nhiệt độ tự động hạ dần về $25.0^\circ\text{C}$.

### 8. Nhóm P07: Đo lường đồng hồ vạn năng DMM (3/3 PASS)
- **Tình trạng trước cải tiến:** Màn hình LCD in sẵn số $12.00\text{ V}$; chuyển thang đo tự động nhảy số ảo dù que đo không cắm vào mạch.
- **Sau cải tiến:** Màn hình khởi tạo $0.00\text{ V}$. Khi que đo hở mạch, DMM đo được $0.00\text{ V}$, $0.00\text{ A}$, hoặc `"O.L"` (Over Limit) ở thang đo điện trở. Chỉ khi kết nối với cọc nguồn thực tế đang cấp điện thì DMM mới hiển thị giá trị tương ứng.

---

## 4. BẢO TOÀN HỆ THỐNG LẮP RÁP (RWSS v1.1.1 REGRESSION VERIFICATION)

Chạy kiểm thử hồi quy lắp ráp tự động bằng lệnh:
```bash
npx tsx scripts/verify-assembly-acceptance.ts
```
**Kết quả ghi nhận:**
- Điểm đánh giá: **100.0 / 100 điểm** (Đạt tuyệt đối).
- Số lỗi: **P0 = 0, P1 = 0, P2 = 0, P3 = 0**.
- 24/24 tiêu chí ASM-01 đến ASM-24 đều PASS trọn vẹn, không xảy ra bất kỳ hiện tượng hồi quy nào trên hệ thống cơ học, snap, docking, và khóa bậc tự do.

---

## 5. KẾT LUẬN NGHIỆM THU

1. **Chuỗi nguyên nhân - kết quả được thiết lập toàn diện:**
   $$\text{USER ACTION} \longrightarrow \text{ASSEMBLY GRAPH} \longrightarrow \text{DEVICE STATE} \longrightarrow \text{SCIENTIFIC SOLVER} \longrightarrow \text{PHYSICAL STATE} \longrightarrow \text{3D RENDERING}$$
2. **Không còn bất kỳ hành vi giả lập bằng animation hoặc mánh lới hardcode:**
   - Đèn chỉ sáng khi có mạch kín và nguồn bật.
   - Bản bán nguyệt không tự sinh tia.
   - Cuộn dây cảm ứng tuân thủ định luật Faraday.
   - Thiết bị nhiệt tuân thủ truyền nhiệt thực nghiệm.
   - Đồng hồ đo phản ánh đúng cấu trúc mạch.
3. **Mã nguồn hoàn toàn sạch sẽ, đạt chuẩn build production.**
