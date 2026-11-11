# ĐẶC TẢ HÌNH DÁNG HÌNH HỌC & ĐỒ HỌA PBR CHÂN THỰC CỦA THIẾT BỊ
## (EQUIPMENT PHYSICAL APPEARANCE & PBR GRAPHICS SPECIFICATION — MASTER v3.0)

> **Mục tiêu:** Mọi thiết bị 3D trong OpenLab 3D phải chuẩn hóa chính xác **từng milimét kích thước hình học thực tế**, sử dụng chất liệu quang học vật lý PBR (*Physically Based Rendering*), có vạch chia độ sắc nét 360°, màn hình điện tử chống nhấp nháy (Z-fighting) và cổng kết nối cơ học chuẩn xác theo Thông tư 38/2021/TT-BGDĐT.

---

## 1. QUY CHUẨN TỶ LỆ HÌNH HỌC SI & GỐC TỌA ĐỘ BẮT BUỘC

Mọi hàm dựng mô hình 3D trong `ProceduralLabModels.ts` hoặc các file module `.html` (`buildEquipmentMesh(THREE, asset)`) bắt buộc phải tuân thủ 4 quy tắc hình học bất biến:

1. **Đơn vị Three.js là MÉT (SI):**
   - $1.0\text{ unit} = 1.0\text{ m}$ | $0.1\text{ unit} = 100\text{ mm}$ | $0.01\text{ unit} = 10\text{ mm}$ | $0.001\text{ unit} = 1\text{ mm}$.
   - *Quy tắc an toàn:* Tuyệt đối không truyền số kích thước milimét ($165, 250$) vào Three.js, mà phải chia cho $1000$ ($0.165, 0.250$).
2. **Điểm neo đáy bàn (`anchor: "base-center"`, `upAxis: "Y"`):**
   - Điểm thấp nhất của toàn bộ khối mô hình (`boundingBox.min.y`) **bắt buộc nằm chính xác tại $y = 0.000\text{ m}$** trong hệ tọa độ cục bộ của `THREE.Group` (sai số cho phép $|y_{\text{min}}| \le 0.005\text{ m}$).
   - Khi đặt lên bàn thí nghiệm, hệ thống tự động cộng cao độ bàn $\text{BENCH\_SURFACE\_Y} = 0.820\text{ m}$.
3. **Mặt trước chính diện quay về hướng $+Z$:**
   - Mọi bộ phận hiển thị chính (màn hình LCD, vạch chia độ chính, phím bấm, cổng cắm cọc đo) luôn quay về phía trục $+Z$ ($z > 0$) để đối diện với camera mặc định của học sinh.
4. **Bo cong mép chân thực (Bevel / Fillet):**
   - Không sử dụng các khối đa diện sắc cạnh vuông vức $90^\circ$ giả tạo. Mọi vỏ hộp nhựa ABS, đĩa cân inox đều có bán kính bo mép mềm mại $r = 1.5 - 3.0\text{ mm}$ tạo dải sáng phản chiếu kim loại/nhựa cao cấp.

---

## 2. QUY CHUẨN VẬT LIỆU QUANG HỌC PBR (PHYSICALLY BASED RENDERING)

Để đảm bảo hình ảnh chân thực như ảnh chụp thực tế dưới ánh đèn phòng thí nghiệm, mọi vật liệu đều được cấu hình qua `THREE.MeshPhysicalMaterial`:

| Loại vật liệu | Thuộc tính PBR bắt buộc | Thông số cấu hình Three.js | Hiện tượng thị giác thực tế |
| :--- | :--- | :--- | :--- |
| **Thủy tinh Borosilicate 3.3** *(Ống đong, cốc, bình tam giác, ống nghiệm)* | • `transmission`: $0.90$<br>• `opacity`: $1.0$<br>• `transparent`: $true$<br>• `ior`: $1.474$<br>• `roughness`: $0.05$<br>• `metalness`: $0.0$<br>• `thickness`: $0.0025\text{ m}$ ($2.5\text{ mm}$)<br>• `color`: `#ffffff` | Trong suốt quang học, khúc xạ ánh sáng phía sau, nhìn thấy rõ mức chất lỏng bên trong và mặt khum meniscus. |
| **Thép không gỉ Inox SUS 304** *(Đĩa cân, mỏ cặp, giá đỡ sắt, ròng rọc)* | • `metalness`: $0.92$<br>• `roughness`: $0.22$<br>• `clearcoat`: $0.30$<br>• `color`: `#d8d8d8` | Ánh kim loại sáng bóng, phản chiếu ánh sáng môi trường phòng lab, không bị nhám xỉn. |
| **Nhựa kỹ thuật ABS chống hóa chất** *(Vỏ cân, thân DMM, đế đèn, công tắc)* | • `metalness`: $0.05$<br>• `roughness`: $0.45$<br>• `clearcoat`: $0.10$<br>• `color`: `#2563eb` (Xanh DMM) / `#e2e8f0` (Trắng ngà vỏ cân) | Bề mặt nhám mờ lì, tán xạ ánh sáng mềm, cầm chắc tay, không phản xạ gương giả tạo. |
| **Đồng thau nguyên chất** *(Quả cân chuẩn, cọc cắm điện Ø4mm)* | • `metalness`: $0.95$<br>• `roughness`: $0.28$<br>• `color`: `#eab308` (Vàng kim đồng thau) | Màu vàng kim đặc trưng của quả cân chuẩn phòng thí nghiệm THCS. |
| **Thủy tinh quang học Crown/Flint** *(Lăng kính, thấu kính hội tụ/phân kỳ)* | • `transmission`: $0.96$<br>• `ior`: $1.517$ (Crown) / $1.620$ (Flint)<br>• `roughness`: $0.02$<br>• `dispersion`: $0.04$ | Độ trong suốt cao nhất, tán sắc chùm sáng trắng thành 7 màu cầu vồng khi tia laser chiếu qua. |
| **Chất lỏng Nước cất / Dung dịch** | • `transmission`: $0.95$<br>• `ior`: $1.333$<br>• `roughness`: $0.05$<br>• `color`: `#60a5fa` (pha xanh nhẹ) / đổi màu theo pH | Có mặt thoáng cong meniscus áp sát thành ống thủy tinh, bọt khí nổi khi sôi. |

---

## 3. THÔNG SỐ KÍCH THƯỚC HÌNH HỌC CHI TIẾT CỦA 10 NHÓM THIẾT BỊ (G01 - G10)

Dưới đây là kích thước mm chuẩn mực theo thiết bị thực tế của Bộ GD&ĐT (được tự động quy đổi ra mét trong Three.js):

### G01 — Đo kích thước, chiều dài, góc
1. **Thước cặp du xích 150mm (Caliper):**
   - Kích thước tổng: Dài $235\text{ mm}$ $\times$ Rộng $78\text{ mm}$ $\times$ Dày $8\text{ mm}$ ($0.235 \times 0.078 \times 0.008\text{ m}$).
   - Thân thước: Thép không gỉ sáng bóng, vạch chia milimét khắc laser sâu $0.1\text{ mm}$.
   - Khung trượt du xích: Trượt 1 DoF dọc theo trục X từ $0\text{ mm}$ đến $150\text{ mm}$. Vạch du xích chia 50 vạch (độ chính xác $0.02\text{ mm}$).
   - Điểm gắn mỏ đo: Mỏ kẹp ngoài (dưới) dài $40\text{ mm}$, mỏ kẹp trong (trên) dài $18\text{ mm}$, đuôi đo sâu dài $150\text{ mm}$.
2. **Panme đo ngoài 0–25mm (Micrometer):**
   - Khung chữ C bằng gang đúc sơn sần xanh lam: $130 \times 60 \times 15\text{ mm}$.
   - Trục đo mạ crom sáng bóng đường kính $\varnothing 6.5\text{ mm}$. Ống xoay khắc 50 vạch quanh chu vi (bước ren $0.5\text{ mm}$, mỗi vạch tương ứng $0.01\text{ mm}$).

### G02 — Cân, khối lượng, lực
3. **Cân điện tử hiện số 500g / 0.01g:**
   - Kích thước đế cân: Dài $200\text{ mm}$ $\times$ Rộng $150\text{ mm}$ $\times$ Cao $50\text{ mm}$ ($0.200 \times 0.150 \times 0.050\text{ m}$).
   - Đĩa cân inox SUS 304: Hình tròn đường kính $\varnothing 120\text{ mm}$, dày $2\text{ mm}$, tâm đĩa cân đặt tại cao độ $y = 0.052\text{ m}$ (trên mặt bàn $0.872\text{ m}$).
   - Màn hình LCD góc nghiêng $30^\circ$: Kích thước $65 \times 25\text{ mm}$, đèn nền xanh lá dịu, hiển thị 5 chữ số cao $12\text{ mm}$.
   - Phím cơ nổi: Nút NGUỒN (Đỏ), Nút TARE (Xanh dương), Nút MODE (Xám).
4. **Lực kế lò xo 5N (Dynamometer):**
   - Thân vỏ trụ nhựa trong suốt: Đường kính $\varnothing 20\text{ mm}$, dài $180\text{ mm}$.
   - Lò xo thép đàn hồi: Đường kính cuộn $\varnothing 12\text{ mm}$, dây thép $\varnothing 1\text{ mm}$, chiều dài tự nhiên $l_0 = 70\text{ mm}$.
   - Bảng chia độ: Dải $0 - 5\text{ N}$, độ chia $0.1\text{ N}$, vạch đỏ chỉ thị di chuyển dọc theo lực kéo.
   - Móc treo trên và móc gá vật dưới bằng thép mạ niken $\varnothing 3\text{ mm}$.

### G03 — Thời gian, nhiệt độ, điện môi trường
5. **Nhiệt kế phòng thí nghiệm (-10°C đến 110°C):**
   - Ống mao dẫn thủy tinh: Dài $300\text{ mm}$, đường kính thân $\varnothing 6.5\text{ mm}$.
   - Bầu chứa chất lỏng đo (thủy ngân hoặc cồn đỏ): Đường kính $\varnothing 8\text{ mm}$, dài $25\text{ mm}$ ở đáy dưới.
   - Vạch chia khắc chìm trên thân thủy tinh: Khoảng chia $1^\circ\text{C}$, số hiển thị mỗi $10^\circ\text{C}$ rõ ràng.
6. **Đồng hồ đo điện vạn năng hiện số (DMM):**
   - Thân máy ABS bọc vỏ cao su chống sốc màu vàng/xanh: Dài $185\text{ mm}$ $\times$ Rộng $90\text{ mm}$ $\times$ Dày $45\text{ mm}$.
   - Màn hình LCD 3.5 chữ số: $60 \times 32\text{ mm}$.
   - Núm xoay chuyển mạch trung tâm: Đường kính $\varnothing 45\text{ mm}$, xoay $360^\circ$ qua 24 vị trí nấc thang đo (DCV, ACV, DCA, $\Omega$).
   - 3 cọc cắm đầu bắp chuối Ø4mm: `COM` (Đen, chung), `V/Ω/mA` (Đỏ), `10A` (Đỏ công suất lớn).

### G04 — Chứa và đo thể tích chất lỏng
7. **Ống đong thủy tinh chia độ 100mL:**
   - Chiều cao tổng: $250\text{ mm}$, đường kính ngoài $\varnothing 32\text{ mm}$, độ dày thành ống $2.0\text{ mm}$.
   - Chân đế hình lục giác vững chắc: Đường kính tiếp xúc $70\text{ mm}$, cao $15\text{ mm}$.
   - Vòi rót chất lỏng (spout): Góc mở cong vát $45^\circ$ ở đỉnh trên cùng.
   - Vạch chia men trắng/xanh: Dải $0 - 100\text{ mL}$, vạch nhỏ $1\text{ mL}$, vạch lớn mỗi $10\text{ mL}$.
8. **Cốc thủy tinh chịu nhiệt Beaker 250mL:**
   - Chiều cao: $95\text{ mm}$, đường kính thân $\varnothing 70\text{ mm}$, vòi rót nhô ra $8\text{ mm}$.
   - Vạch chia xấp xỉ: $50, 100, 150, 200, 250\text{ mL}$.
9. **Bình tràn đo thể tích (Overflow Can):**
   - Thân trụ kim loại/thủy tinh: Đường kính $\varnothing 80\text{ mm}$, cao $140\text{ mm}$.
   - Vòi xả tràn: Ống nghiêng xuống $30^\circ$, đường kính trong $\varnothing 8\text{ mm}$, dài $35\text{ mm}$, miệng xả đặt ở cao độ $110\text{ mm}$ tính từ đáy bình.

### G05 — Hóa học, gia nhiệt
10. **Đèn cồn thí nghiệm 150mL (Alcohol Burner):**
    - Bầu đèn thủy tinh hình cầu dẹt: Đường kính $\varnothing 85\text{ mm}$, cao $100\text{ mm}$.
    - Cổ bọc kim loại và bấc đèn sợi cotton tròn đường kính $\varnothing 6\text{ mm}$, nhô lên $12\text{ mm}$.
    - Nắp đậy thủy tinh bảo quản và dập lửa an toàn.
11. **Kiềng sắt đun & Lưới tản nhiệt amiăng (Tripod & Gauze):**
    - Kiềng sắt 3 chân: Chiều cao $200\text{ mm}$, vòng đỡ trên đường kính trong $\varnothing 90\text{ mm}$.
    - Lưới amiăng vuông: $120 \times 120\text{ mm}$, vòng tròn gốm chịu nhiệt ở tâm đường kính $\varnothing 70\text{ mm}$.

### G06 — Quang học, ánh sáng
12. **Giá quang học và thấu kính hội tụ/phân kỳ (Optical Bench & Lens):**
    - Ray trượt hợp kim nhôm: Dài $1000\text{ mm}$ ($1.0\text{ m}$), rộng $40\text{ mm}$, cao $30\text{ mm}$, khắc vạch mm từ $0$ đến $1000\text{ mm}$.
    - Thấu kính hội tụ: Thủy tinh quang học trong suốt đường kính $\varnothing 50\text{ mm}$, tiêu cự $f = +100\text{ mm}$, lắp trong khung tròn có chuôi cắm đường kính $\varnothing 10\text{ mm}$.
    - Nguồn sáng LED/Laser: Vỏ nhôm đen $120 \times 40 \times 40\text{ mm}$, tạo chùm tia song song hoặc chùm phân kỳ.

### G07 — Điện tử và mạch điện
13. **Biến trở con chạy 20Ω - 2A (Rheostat):**
    - Ống sứ hình trụ quấn dây điện trở constantan: Chiều dài $180\text{ mm}$, đường kính $\varnothing 45\text{ mm}$.
    - Thanh dẫn kim loại vuông phía trên có con chạy trượt 1 DoF bằng đồng đàn hồi mang tiếp điểm quét.
    - 3 cọc cắm dây: 2 cọc cố định hai đầu cuộn dây và 1 cọc nối với con chạy.
14. **Mô hình động cơ điện một chiều DC (Electric Motor):**
    - Khung dây quay hình chữ nhật $40 \times 30\text{ mm}$, gắn trên trục quay ổ bi siêu nhẹ.
    - Nam châm vĩnh cửu chữ U tạo từ trường đều $B \approx 0.2\text{ T}$.
    - Cổ góp gồm hai vành bán khuyên bằng đồng và hai chổi quét than tì sát.

### G08 — Cơ học, năng lượng
15. **Thanh đòn bẩy chia vạch và trục quay (Lever Arm):**
    - Thanh nhôm cứng thẳng: Dài $500\text{ mm}$, rộng $18\text{ mm}$, dày $4\text{ mm}$.
    - Trục quay O nằm chính xác tại tâm đối xứng $250\text{ mm}$.
    - Mỗi bên cánh tay đòn chia 10 khoảng bằng nhau ($25\text{ mm/khoảng}$) có lỗ treo móc quả nặng.
    - Hai ốc đối trọng thăng bằng ở hai đầu thanh có thể vặn ren điều chỉnh thăng bằng.

### G09 — Sinh học, hiển vi
16. **Kính hiển vi quang học sinh học chuẩn DIN 58145:**
    - Khung thân chữ C bằng gang đúc sơn tĩnh điện trắng chống gỉ: Cao $380\text{ mm}$, chân đế hình móng ngựa $210 \times 160\text{ mm}$.
    - Ống thị kính nghiêng $45^\circ$, xoay $360^\circ$, thị kính chuẩn WF10x (trường nhìn $18\text{ mm}$).
    - Mâm xoay mang 4 vật kính tiêu sắc chuẩn DIN: 4x (đỏ), 10x (vàng), 40x (xanh lam), 100x dầu (trắng).
    - Bàn sa trượt cơ học 2 tầng $125 \times 115\text{ mm}$, có kẹp giữ lam kính và núm đồng trục điều khiển di chuyển mẫu theo trục X-Y dải $70 \times 30\text{ mm}$.
    - Ống tụ quang Abbe $N.A = 1.25$ có màng chắn sáng dạng mống mắt (iris diaphragm) và khay lọc sáng.
    - Núm điều chỉnh thô (coarse focus) hành trình $20\text{ mm}$ và núm vi chỉnh (fine focus) vạch chia $0.002\text{ mm}$.

---

## 4. QUY CHUẨN VẠCH CHIA ĐỘ 360° VÀ MÀN HÌNH HIỂN THỊ CHỐNG NHẤP NHÁY (ANTI-Z-FIGHTING)

1. **Vạch chia độ 360° (Double-Sided Scale Marks):**
   - Vạch chia trên ống đong, nhiệt kế, thước cặp được dựng bằng kỹ thuật tạo lưới hình học (Mesh Lines) hoặc `CanvasTexture` độ phân giải cao ($1024 \times 2048\text{ px}$).
   - Bắt buộc bật `side: THREE.DoubleSide` và `transparent: true` để học sinh quan sát từ bất kỳ góc độ nào qua thành thủy tinh trong suốt đều đọc được vạch chia chính xác mà không bị lộn ngược chữ số.
2. **Khử triệt để lỗi nhấp nháy chữ (Z-Fighting Mitigation):**
   - Mặt phẳng hiển thị decal nhãn mác hoặc vạch đo tuyệt đối không đặt trùng tọa độ với bề mặt vật thể chủ ($d = 0.000$).
   - Bắt buộc nâng offset bề mặt lên tối thiểu $0.001\text{ m}$ ($1\text{ mm}$) hoặc áp dụng thuộc tính OpenGL:
     ```javascript
     material.polygonOffset = true;
     material.polygonOffsetFactor = -1.0;
     material.polygonOffsetUnits = -4.0;
     ```

---

## 5. HỘP VA CHẠM (COLLISION BOXES) VÀ ĐIỂM NEO CƠ HỌC (DOCK-PORTS)

Mỗi thiết bị khai báo danh sách các điểm neo vật lý (`dockPorts`) trong JSON Manifest để phục vụ hệ thống lắp ráp Assembly Graph:

```json
"dockPorts": [
  {
    "portId": "pan_center",
    "nameVi": "Tâm đĩa cân",
    "kind": "mechanical_support",
    "localPosition": [0.0, 0.052, 0.0],
    "normalVector": [0.0, 1.0, 0.0],
    "allowedArchetypes": ["beaker-250", "graduated-cylinder", "weight-solid", "evaporating-dish"],
    "snapRadiusM": 0.06
  },
  {
    "portId": "terminal_red_pos",
    "nameVi": "Cọc dương nguồn điện (+)",
    "kind": "electrical_terminal",
    "localPosition": [0.045, 0.080, 0.060],
    "normalVector": [0.0, 0.0, 1.0],
    "allowedArchetypes": ["connecting-wire-red"],
    "snapRadiusM": 0.03
  }
]
```
- Khi đưa vật thể đến gần trong bán kính `snapRadiusM` ($\le 0.08\text{ m}$), hệ thống tự động hút dính tâm khớp nối với âm thanh click cơ học và khóa các bậc tự do không hợp lệ.
