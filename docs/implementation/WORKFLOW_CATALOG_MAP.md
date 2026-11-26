# BẢNG ĐỐI CHIẾU WORKFLOW ↔ CATALOG — OPENLAB 3D (C-10)

> **Repo:** `ltliem89/openlab-3d` — React 19 + Vite + Three.js, phiên bản **2.4.0**, nhánh `main`,
> commit `d64c8f1` (2026-11-20).
> **Ngày lập bảng:** 2026-11-25. **Phát hành trong:** v2.5.0 (nhánh `release/v2.5.0`).
> **Tính chất:** TÀI LIỆU (C-10 trong
> `Ke_hoach_cai_tien_OpenLab3D.md`) — không sửa code repo.
> **Nguồn đọc trực tiếp:** `src/experiments/ExperimentWorkflows.ts` (960 dòng, toàn bộ),
> `src/data/mockCatalog.ts` (4.050 dòng — 40 asset đọc qua `assetId`/`slug`/`proceduralArchetype`),
> `src/three-runtime/HtmlEquipmentModuleRegistry.ts` (`CANONICAL_ARCHETYPE_MAP` + hàm suy luận fallback).
> **Mục đích:** Liệt kê MỌI yêu cầu thiết bị của WF-01..WF-15, đối chiếu từng yêu cầu với 40 asset
> trong catalog, và quyết định hướng xử lý cho từng mục lệch.
> **⚠️ Bảng này phải được người dùng DUYỆT trước khi làm C-11 (sửa bước workflow không bao giờ
> pass) và C-17 (viết lại guard WF-07..WF-15).**

---

## 1. CÁCH ĐỌC BẢNG

| Ký hiệu | Nghĩa |
|---|---|
| **KHỚP** | Catalog có asset đúng thiết bị đó (chấp nhận biến thể hậu tố dung lượng như `-100`, `-5n`, `-50g`). Guard tìm được asset bằng mẫu `assetId.includes(...)` hiện tại. |
| **KHÔNG KHỚP** | Không có asset nào trong catalog làm được việc đó. Workflow yêu cầu một thiết bị không tồn tại. |
| **KHỚP SAI VAI TRÒ** | Có asset khớp chuỗi/mẫu, nhưng asset đó được thiết kế cho mục đích khác (dùng tạm sẽ dạy sai hoặc đo sai). |
| **KHỚP MỘT PHẦN** | Asset hiện có làm được một phần việc, phần còn lại vẫn thiếu (ghi rõ phần thiếu). |
| **(a) / (b) / (c)** | Quyết định đề xuất: **(a)** thêm asset mới · **(b)** map sang asset hiện có · **(c)** sửa workflow (đổi mẫu tìm kiếm / bỏ yêu cầu). Mỗi mục lệch chỉ có MỘT quyết định chính. |

**Lưu ý quan trọng về `requiredArchetypes`:** trường này trong `ExperimentWorkflows.ts` chỉ là
khai báo — **guard không hề đọc nó**. Guard chỉ dùng `assetId.includes('XXX')`. Vì vậy một
`requiredArchetypes` có thể ghi đúng tên thiết bị mà guard vẫn tìm sai (ví dụ WF-09 yêu cầu
`overflow-can` nhưng guard tìm `'OVR'`/`'CAN'`, cả hai đều không khớp `OVF-0001`).

**Lưu ý về `CANONICAL_ARCHETYPE_MAP`:** map có **36 mục**, thiếu 4 asset mới v2.4.0
(RUL-0001, STW-0001, TUB-0001, ALC-0001). 4 asset này hiện chỉ được phân giải đúng nhờ các
nơi gọi registry truyền `proceduralArchetype` trong catalog làm tham số `explicit`
(`HtmlEquipmentModuleRegistry.ts:597-603, 816-819, 1331-1334, 1403-1406`). Nếu có đường gọi
nào không truyền `explicit`, cả 4 asset đều rơi về giá trị mặc định cuối hàm suy luận là
`'digital-multimeter'` (dòng cuối của `inferProceduralArchetypeFromIdOrSlug`) — thước thẳng,
bấm giây, ống nghiệm, đèn cồn sẽ hiển thị thành đồng hồ đa năng. Đây là hạng mục C-01.

---

## 2. TÓM TẮT SỐ LIỆU

| Hạng mục | Số liệu (đếm trực tiếp từ file) |
|---|---|
| Workflow | **15** (WF-01..WF-15) |
| Tổng số bước | **47** bước (WF-01: 4, WF-05: 4, còn lại 3 bước mỗi workflow) |
| Yêu cầu `requiredArchetypes` (đếm từng mục trong từng bước) | **76** mục |
| Archetype riêng biệt được yêu cầu | **38** archetype |
| — KHỚP | **19** / 38 |
| — KHỚP SAI VAI TRÒ / KHỚP MỘT PHẦN | **4** / 38 |
| — KHÔNG KHỚP | **15** / 38 |
| Mẫu guard `assetId.includes('XXX')` riêng biệt | **40** mẫu, xuất hiện **60** lần |
| — Mẫu khớp đúng asset | **13** / 40 (trong đó `PSU` sai vai trò ở WF-05) |
| — Mẫu dư thừa vô hại (nhánh OR còn lại khớp) | **5** / 40 (`SPG`, `GRD`, `RAY`, `BRN`, `50G`) |
| — Mẫu không khớp asset nào | **22** / 40 |
| Bước guard trả về `true` vô điều kiện (không đọc `instanceState`) | **25** / 47 bước (WF-07, 08, 09, 10, 12, 13, 14, 15 toàn bộ + WF-11 bước 1) |
| Bước guard có kiểm tra thật (kể cả kiểm tra yếu) | **22** / 47 bước |
| Bước **không bao giờ pass được** với catalog hiện tại | **5** bước: WF-04 bước 1–3, WF-05 bước 2–3 |
| Asset trong catalog | **40** (36 cũ + 4 mới v2.4.0) |
| Asset có trong `CANONICAL_ARCHETYPE_MAP` | **36** / 40 |

---

## 3. CATALOG 40 ASSET — ĐỐI CHIẾU NHANH

| # | AssetId | Tên (vi) | Archetype trong catalog | Trong map? |
|---|---|---|---|---|
| 1 | BAL-0001 | Cân điện tử hiện số 500 g | electronic-balance | Có |
| 2 | CYL-0001 | Ống đong thủy tinh 100 ml | graduated-cylinder | Có |
| 3 | BKR-0001 | Cốc thủy tinh 250 ml | beaker-250 | Có |
| 4 | OVF-0001 | Bình tràn Eureka 250 ml | overflow-can | Có |
| 5 | DYN-0001 | Lực kế lò xo 5 N | spring-dynamometer | Có |
| 6 | CAL-0001 | Thước cặp du xích 150 mm | vernier-caliper | Có |
| 7 | WGT-0001 | Quả cân chuẩn 50 g | calibration-weight | Có |
| 8 | SLD-0001 | Vật rắn hình trụ nhôm | solid-cylinder | Có |
| 9 | SPH-0001 | Vật rắn hình cầu thép | solid-sphere | Có |
| 10 | BLK-0001 | Vật rắn hình hộp đồng thau | solid-block | Có |
| 11 | HLW-0001 | Vật rắn rỗng có khoang bên trong | hollow-cylinder | Có |
| 12 | FLK-0001 | Bình tam giác Erlenmeyer 250 ml | erlenmeyer-flask | Có |
| 13 | STD-0001 | Giá đỡ thí nghiệm đa năng | retort-stand | Có |
| 14 | OPT-0001 | Thấu kính hội tụ f 100 mm | optical-lens | Có |
| 15 | OBN-0001 | Giá quang học thước chia độ 90 cm | optical-bench | Có |
| 16 | OLP-0001 | Đèn chiếu sáng Halogen khe sáng | optical-lamp | Có |
| 17 | FOB-0001 | Vật sáng kính mờ chữ F | frosted-f-object | Có |
| 18 | SCR-0001 | Màn chắn hứng ảnh quang học | optical-screen | Có |
| 19 | PSU-0001 | Nguồn điện hạ áp thí nghiệm 12 V | optical-power-supply | Có |
| 20 | LBX-0001 | Hộp bộ 6 thấu kính quang học | optical-lens-box | Có |
| 21 | THM-0001 | Nhiệt kế phòng thí nghiệm 110 °C | thermometer | Có |
| 22 | LSR-0001 | Laser ray box 3 tia | laser-source | Có |
| 23 | SLB-0001 | Bản bán trụ thủy tinh + bảng chia độ 360° | semicircular-slab | Có |
| 24 | PRM-0001 | Lăng kính tam giác đều | optical-prism | Có |
| 25 | MAG-0001 | Kính lúp cầm tay 5× | magnifying-glass | Có |
| 26 | GLV-0001 | Điện kế vạch 0 ở giữa | galvanometer | Có |
| 27 | DMM-0001 | Đồng hồ đo điện đa năng AC/DC | digital-multimeter | Có |
| 28 | COIL-0001 | Cuộn dây cảm ứng 2 LED + nam châm | induction-coil-led | Có |
| 29 | DSH-0001 | Bát sứ cô đặc | porcelain-dish | Có |
| 30 | SEP-0001 | Phễu chiết / lọc có giá | separatory-funnel | Có |
| 31 | DST-0001 | Bình cầu 250 ml + lưới + đèn cồn (kit) | distillation-flask | Có |
| 32 | MIC-0001 | Kính hiển vi quang học + tiêu bản NST | optical-microscope | Có |
| 33 | DNA-0001 | Mô hình DNA xoắn kép | dna-double-helix | Có |
| 34 | WDP-1000 | Bình chứa nước có van xả 1000 ml | water-dispenser | Có |
| 35 | LEV-0001 | Bộ đòn bẩy thăng bằng chia vạch + giá đỡ | lever-balance-apparatus | Có |
| 36 | HYD-0001 | Bình thông nhau 3 nhánh | communicating-vessels-3way | Có |
| 37 | RUL-0001 | Thước thẳng dẹp chia độ 30 cm (1 mm) | ruler-30 | **KHÔNG — mới v2.4.0** |
| 38 | STW-0001 | Đồng hồ bấm giây hiện số (0.01 s) | digital-stopwatch | **KHÔNG — mới v2.4.0** |
| 39 | TUB-0001 | Ống nghiệm thủy tinh Ø16 mm | test-tube | **KHÔNG — mới v2.4.0** |
| 40 | ALC-0001 | Đèn cồn thí nghiệm 150 ml | alcohol-burner | **KHÔNG — mới v2.4.0** |

**Asset không workflow nào dùng** (theo `requiredArchetypes` và guard): CAL-0001, SPH-0001,
BLK-0001, HLW-0001, LBX-0001, PRM-0001, MAG-0001, GLV-0001, COIL-0001, DSH-0001, SEP-0001,
MIC-0001, DNA-0001, WDP-1000, RUL-0001, HYD-0001. Trong đó GLV/COIL/DMM thuộc kit điện
KHTN 9 (WF-12 nhắc tới nhưng guard không tìm chúng); PRM-0001 là thiết bị chịu ảnh hưởng
trực tiếp của lỗi tán sắc (C-08) nhưng chưa có workflow nào dùng.

---

## 4. BẢNG ĐỐI CHIẾU THEO TỪNG WORKFLOW

Quy ước cột: **Yêu cầu** = `requiredArchetypes` của bước · **Guard tìm** = mẫu
`assetId.includes(...)` trong `validationGuard` · **Đọc state** = trường `instanceState`
guard đọc (hoặc "—" nếu guard không đọc gì) · **Kết luận** = KHỚP / KHÔNG KHỚP /
KHỚP SAI VAI TRÒ / KHỚP MỘT PHẦN.

### WF-01 — Đo khối lượng và trừ bì bằng cân điện tử (KHTN 6, Bài 4) — 4 bước

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF01-STEP-01 | electronic-balance | `BAL` | `isPoweredOn` | **KHỚP** — BAL-0001. Lưu ý: guard còn chấp nhận BẤT KỲ instance nào có `isPoweredOn !== undefined` (`i.assetId.includes('BAL') \|\| i.instanceState.isPoweredOn !== undefined`), đây là điểm yếu cần sửa ở C-17, không phải lỗi catalog. |
| WF01-STEP-02 | electronic-balance, beaker-250 | `BAL`, `BKR` | `measuredMassG` | **KHỚP** — BAL-0001 + BKR-0001. |
| WF01-STEP-03 | electronic-balance | `BAL` | `tareOffsetG` | **KHỚP** — BAL-0001. |
| WF01-STEP-04 | electronic-balance, beaker-250 | `BKR`, `BAL` | `liquidLevelMl`/`fluidLevelMl`, `measuredMassG` | **KHỚP** — BKR-0001 + BAL-0001. |

**WF-01: 6/6 yêu cầu KHỚP. Workflow mẫu — không cần quyết định gì.**

### WF-02 — Đo thể tích chất lỏng bằng ống đong 100 ml (KHTN 6, Bài 5) — 3 bước

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF02-STEP-01 | graduated-cylinder-100 | `CYL` hoặc `GRD` | — (chỉ kiểm tra có mặt) | **KHỚP** — CYL-0001 (`CYL` khớp; `GRD` không khớp asset nào nhưng là nhánh OR dư thừa vô hại). |
| WF02-STEP-02 | graduated-cylinder-100, beaker-250 | `CYL` hoặc `GRD` | `liquidLevelMl`/`fluidLevelMl` | **KHỚP** — CYL-0001. |
| WF02-STEP-03 | graduated-cylinder-100 | `CYL` hoặc `GRD` | `liquidLevelMl`/`fluidLevelMl` | **KHỚP** — CYL-0001. |

**WF-02: 4/4 yêu cầu KHỚP.** Quyết định: **(c)** xóa mẫu dư thừa `GRD` khi sửa guard ở C-17 (dọn dẹp, không bắt buộc).

### WF-03 — Đo lực kéo và độ dãn lò xo bằng lực kế 5 N (KHTN 6, Bài 40) — 3 bước

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF03-STEP-01 | spring-dynamometer-5n, support-stand | `DYN` hoặc `SPG` | — (chỉ kiểm tra có mặt) | **KHỚP** — DYN-0001 (`DYN` khớp; `SPG` dư thừa). `support-stand` KHỚP STD-0001 nhưng guard **không tìm giá đỡ** — chỉ tìm lực kế. |
| WF03-STEP-02 | spring-dynamometer-5n | `DYN` hoặc `SPG` | — | **KHỚP** — DYN-0001. |
| WF03-STEP-03 | spring-dynamometer-5n, hook-weight-50g | `DYN`/`SPG`, `WGT`/`50G` | `measuredForceN` | **KHỚP** — DYN-0001 + WGT-0001 (`WGT` khớp; `50G` dư thừa). Lưu ý: guard dùng `'0.50'` hard-code khi `measuredForceN` = 0 — xem C-09. |

**WF-03: 5/5 yêu cầu KHỚP.** Quyết định: **(c)** xóa các mẫu dư thừa `SPG`, `50G` ở C-17; bổ sung kiểm tra STD-0001 ở bước 1 nếu muốn guard đúng với `requiredArchetypes`.

### WF-04 — Đo tốc độ bằng đồng hồ hiện số và cổng quang điện (KHTN 7, Bài 9) — 3 bước — ⚠️ KHÔNG BAO GIỜ PASS

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF04-STEP-01 | inclined-track, photogate-sensor | `TRK`/`RAL`, `PHO`/`GAT` | — | **KHÔNG KHỚP** — không asset nào chứa `TRK`, `RAL`, `PHO`, `GAT`. Không có máng nghiêng, không có cổng quang trong catalog. Guard fail (`!track && gates.length < 1` → fail) → **bước này không bao giờ pass**. |
| WF04-STEP-02 | digital-timer, photogate-sensor | `TMR`/`TIM` | — | **KHÔNG KHỚP** — không asset nào chứa `TMR`/`TIM`. Asset gần nhất là STW-0001 (đồng hồ bấm giây) nhưng assetId `OL3D-EQP-STW-0001` không chứa `TIM`. → **không bao giờ pass**. |
| WF04-STEP-03 | digital-timer | `TMR`/`TIM` | `recordedTimeS ?? 0.42` | **KHÔNG KHỚP** — như bước 2; guard fail vì thiếu timer. Giá trị mặc định `0.42` chỉ có tác dụng khi timer đã có mặt (xem C-09). |

**WF-04: 0/5 yêu cầu KHỚP. Quyết định:**
- **D-01** `inclined-track` → **(a)** thêm asset máng nghiêng (kèm rãnh gá cổng quang).
- **D-02** `photogate-sensor` → **(a)** thêm asset cổng quang điện (2 cổng A/B, nối được với timer).
- **D-03** `digital-timer` → **(b)** map sang **STW-0001** (đồng hồ bấm giây hiện số 0.01 s) + **(c)** sửa guard tìm `'STW'`; học sinh bấm giờ thủ công thay vì đo tự động qua cổng quang, cho tới khi có D-02. Nếu D-01/D-02 được thêm, timer chuyên dụng MC-963 vẫn có thể bổ sung sau, nhưng không chặn WF-04.

### WF-05 — Đo cường độ dòng điện và hiệu điện thế trong mạch đơn giản (KHTN 8, Bài 22) — 4 bước — ⚠️ 2 BƯỚC KHÔNG BAO GIỜ PASS

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF05-STEP-01 | dc-power-supply, switch-spst | `PSU`/`BAT`, `SWT`/`KEY` | — | **KHỚP SAI VAI TRÒ** (nguồn) + **KHÔNG KHỚP** (công tắc). `PSU` khớp PSU-0001, nhưng đó là **nguồn đèn quang học 3–12 V**, không phải nguồn mạch điện; `BAT` không khớp gì. `SWT`/`KEY` không khớp asset nào. Guard chỉ kiểm tra `psu` nên bước này **pass nhờ PSU quang học** — học sinh "có nguồn" mà không có nguồn mạch thật. |
| WF05-STEP-02 | ammeter-dc, incandescent-lamp-socket | `AMM`/`MET`, `LMP`/`SOC` | — | **KHÔNG KHỚP** — không asset nào chứa `AMM`, `MET`, `LMP`, `SOC`. → **không bao giờ pass**. |
| WF05-STEP-03 | voltmeter-dc | `VOL`/`VMT` | — | **KHÔNG KHỚP** — không asset nào chứa `VOL`/`VMT`. → **không bao giờ pass**. |
| WF05-STEP-04 | switch-spst | `SWT`/`KEY`, `LMP`/`SOC` | `isClosed` | **KHÔNG KHỚP** — không có công tắc; guard dùng `sw ? … : true` nên **mặc định pass** khi không có công tắc (xem C-09). |

**WF-05: 0/6 yêu cầu KHỚP đúng vai trò. Quyết định:**
- **D-04** `dc-power-supply` → **(b)** map tạm sang **PSU-0001**, ghi rõ giới hạn "đang mượn nguồn đèn quang học 3–12 V"; hộp pin 3–6 V (spec KHTN 8 số 08) đưa vào danh sách (a) đợt sau nếu giáo viên yêu cầu dạy mạch đúng chuẩn.
- **D-05** `ammeter-dc` → **(b)** map sang **DMM-0001** ở chế độ đo dòng DC + **(c)** sửa guard tìm `'DMM'`; hướng dẫn học sinh chọn thang đo dòng trên đồng hồ đa năng.
- **D-06** `voltmeter-dc` → **(b)** map sang **DMM-0001** ở chế độ đo áp DC + **(c)** sửa guard tìm `'DMM'`.
- **D-07** `incandescent-lamp-socket` → **(a)** thêm asset đui bóng đèn + bóng sợi đốt (không có asset nào thay thế được — OLP-0001 là đèn Halogen chiếu sáng, không phải bóng đèn mạch điện).
- **D-08** `switch-spst` → **(a)** thêm asset công tắc SPST (khóa K).

### WF-06 — Tạo ảnh qua thấu kính hội tụ trên giá quang học (KHTN 9, Bài 6–7) — 3 bước

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF06-STEP-01 | optical-bench, optical-power-supply | `OBN`, `PSU` | — | **KHỚP** — OBN-0001 + PSU-0001 (đúng vai trò nguồn đèn). Mâu thuẫn: bước viết "ray 100 cm" nhưng OBN-0001 dài **90 cm** — xem C-05, không thuộc bảng này. |
| WF06-STEP-02 | optical-power-supply, optical-lamp | `OLP` | `isLampLit` | **KHỚP** — OLP-0001. |
| WF06-STEP-03 | optical-lens, optical-screen | `OPT`, `SCR` | `objectDistanceDCm ?? 20.0`, `focalLengthCm ?? 10.0`, `screenDistanceCm ?? 20.0` | **KHỚP** — OPT-0001 + SCR-0001. Guard kiểm tra độ nét thật (±0.8 cm) — mẫu tốt; chỉ còn lỗi giá trị mặc định (xem C-09). |

**WF-06: 6/6 yêu cầu KHỚP. Workflow mẫu — không cần quyết định gì.**

### WF-07 — Khảo sát khúc xạ ánh sáng và định luật Snell (KHTN 9, Bài 4) — 3 bước — ⚠️ GUARD PASS VÔ ĐIỀU KIỆN

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF07-STEP-01 | optical-disk, semicircular-glass-block | `DSK`/`ROT`, `SMC`/`GLS` | — (tính ra `disk`/`glass` rồi **bỏ không dùng**, trả về `true`) | **KHÔNG KHỚP** (mẫu tìm) — không asset nào chứa `DSK`, `ROT`, `SMC`, `GLS`. Nhưng thiết bị THẬT tồn tại: **SLB-0001** gộp cả đĩa chia độ 360° và bản bán trụ trong một asset. |
| WF07-STEP-02 | laser-ray-box | `LSR`/`RAY` | — (trả về `true`) | **KHỚP** — LSR-0001 (`LSR` khớp; `RAY` dư thừa — assetId `OL3D-EQP-LSR-0001` không chứa `RAY`). |
| WF07-STEP-03 | optical-disk | — (không tìm gì, trả về `true`) | — | **KHỚP MỘT PHẦN** — đĩa chia độ nằm trong SLB-0001, nhưng guard không đọc góc nào. |

**WF-07: 2/4 yêu cầu KHỚP đúng nghĩa (qua SLB-0001 gộp). Quyết định:**
- **D-09** `optical-disk` + `semicircular-glass-block` → **(b)** map cả hai sang **SLB-0001** (một asset, hai vai trò: đĩa + bản) + **(c)** sửa guard bước 1 tìm `'SLB'` và kiểm tra `instanceState` thật (góc tới `incidentAngleDeg` nếu module SLB-0001 có trường này — cần xác nhận khi làm C-17). **Không** tách SLB-0001 thành 2 asset.
- **(c)** xóa mẫu dư thừa `RAY` ở bước 2.

### WF-08 — Thí nghiệm đòn bẩy và quy tắc mô-men lực (KHTN 8, Bài 19) — 3 bước — ⚠️ GUARD PASS VÔ ĐIỀU KIỆN

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF08-STEP-01 | lever-arm-balance, support-stand | `LVR`/`BAL` | — (trả về `true`) | **KHỚP SAI VAI TRÒ** — `LVR` không khớp asset nào (LEV-0001 chứa `LEV`, không chứa `LVR`); `BAL` khớp **BAL-0001 (cân điện tử)** — sai thiết bị. Guard tìm ra cân rồi bỏ không dùng. |
| WF08-STEP-02 | lever-arm-balance | — (trả về `true`) | — | **KHỚP** (thiết bị) — LEV-0001 tồn tại, nhưng guard không kiểm tra gì. |
| WF08-STEP-03 | lever-arm-balance, hook-weight-50g | — (trả về `true`) | — | **KHỚP** (thiết bị) — LEV-0001 + WGT-0001 tồn tại, guard không kiểm tra gì. |

**WF-08: 5/5 yêu cầu có thiết bị thật (LEV-0001 + WGT-0001 + STD-0001). Quyết định:**
- **D-10** `lever-arm-balance` → **(c)** sửa guard bước 1 tìm `'LEV'` (khớp LEV-0001), **bỏ nhánh `'BAL'`** (nhánh này tìm nhầm cân điện tử). Không thêm asset.

### WF-09 — Lực đẩy Archimedes bằng bình tràn và lực kế (KHTN 8, Bài 16–17) — 3 bước — ⚠️ GUARD PASS VÔ ĐIỀU KIỆN

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF09-STEP-01 | overflow-can, beaker-250 | `OVR`/`CAN` | — (trả về `true`) | **KHÔNG KHỚP** (mẫu tìm) — `OVR` và `CAN` đều không khớp `OVF-0001` (`OL3D-EQP-OVF-0001` không chứa `OVR` hay `CAN`). Bình tràn thật tồn tại. |
| WF09-STEP-02 | spring-dynamometer-5n, metal-cylinder-block | — (trả về `true`) | — | **KHỚP** (thiết bị) — DYN-0001 + SLD-0001 (trụ nhôm, xem D-13). Guard không kiểm tra gì. |
| WF09-STEP-03 | overflow-can, spring-dynamometer-5n | — (trả về `true`) | — | **KHỚP** (thiết bị) — OVF-0001 + DYN-0001. Guard không kiểm tra gì. |

**WF-09: 6/6 yêu cầu có thiết bị thật. Quyết định:**
- **D-11** `overflow-can` (guard) → **(c)** sửa guard bước 1 tìm `'OVF'`.
- **D-12** `metal-cylinder-block` → **(b)** map sang **SLD-0001** (vật rắn hình trụ nhôm; khối lượng trong docs là minh họa ±2–5% — xem C-12, không đổi số ở đây).

### WF-10 — Pha chế dung dịch muối ăn NaCl và tính nồng độ C% (KHTN 8, Bài 4) — 3 bước — ⚠️ GUARD PASS VÔ ĐIỀU KIỆN

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF10-STEP-01 | electronic-balance, chemical-salt-nacl | — (trả về `true`) | — | **KHỚP** (cân) + **KHÔNG KHỚP** (muối) — BAL-0001 có; không có asset muối NaCl. Muối là vật liệu tiêu hao, không phải thiết bị. |
| WF10-STEP-02 | graduated-cylinder-100, distilled-water | — (trả về `true`) | — | **KHỚP** (ống đong) + **KHÔNG KHỚP** (nước cất) — CYL-0001 có; nước cất là vật liệu tiêu hao. (WDP-1000 là bình chứa nước có van, không phải nước cất đóng chai.) |
| WF10-STEP-03 | beaker-250, stirring-rod | — (trả về `true`) | — | **KHỚP** (cốc) + **KHÔNG KHỚP** (đũa thủy tinh) — BKR-0001 có; không có asset đũa khuấy. |

**WF-10: 4/6 yêu cầu KHỚP. Quyết định:**
- **D-13** `chemical-salt-nacl` → **(c)** chuyển thành vật liệu tiêu hao: bỏ khỏi `requiredArchetypes`, ghi vào `instructionVi`; guard C-17 kiểm tra `BAL-0001.measuredMassG ≈ 10 g` thay vì tìm asset muối.
- **D-14** `distilled-water` → **(c)** như trên; guard C-17 kiểm tra `CYL-0001.liquidLevelMl ≈ 90 ml`.
- **D-15** `stirring-rod` → **(a)** thêm asset đũa thủy tinh (dùng chung WF-10 và WF-15).

### WF-11 — Đo nhiệt dung và đun sôi bằng đèn cồn (KHTN 8, Bài 26) — 3 bước

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF11-STEP-01 | tripod-gauze, beaker-250, thermometer | — (trả về `true`) | — | **KHỚP** (cốc, nhiệt kế) + **KHÔNG KHỚP** (kiềng/lưới) — BKR-0001 + THM-0001 có; không có asset kiềng sắt riêng. Kit DST-0001 có kèm lưới tản nhiệt + đèn cồn nhưng không có kiềng. |
| WF11-STEP-02 | alcohol-burner | `ALC`/`BRN` | `isFlameLit`/`isHeating` | **KHỚP** — ALC-0001 (`ALC` khớp; `BRN` dư thừa). Guard thật. |
| WF11-STEP-03 | thermometer | `THM` | `temperatureC ?? 25` | **KHỚP** — THM-0001. Guard thật (`temp >= 99.5`). Lưu ý: mặc định `25` khi chưa có nhiệt kế — guard fail đúng vì 25 < 99.5, không che lỗi đo. |

**WF-11: 4/5 yêu cầu KHỚP. Quyết định:**
- **D-16** `tripod-gauze` → **(b)** lưới tản nhiệt: dùng lưới trong kit **DST-0001** + **(a)** kiềng sắt: thêm asset kiềng ba chân riêng. (Một yêu cầu tách thành 2 quyết định vì kit DST-0001 chỉ phủ được một nửa.)

### WF-12 — Định luật Ôm cho đoạn mạch thuần điện trở (KHTN 9, Bài 9) — 3 bước — ⚠️ GUARD PASS VÔ ĐIỀU KIỆN

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF12-STEP-01 | resistor-sample, rheostat, ammeter-dc | — (trả về `true`) | — | **KHÔNG KHỚP** — cả 3 đều không có asset: không có điện trở mẫu, không có biến trở, không có ampe kế (chỉ có DMM-0001 số). |
| WF12-STEP-02 | voltmeter-dc, resistor-sample | — (trả về `true`) | — | **KHÔNG KHỚP** — như trên (xem D-06, D-18). |
| WF12-STEP-03 | rheostat | — (trả về `true`) | — | **KHÔNG KHỚP** — không có biến trở (xem D-17). |

**WF-12: 0/6 yêu cầu KHỚP. Quyết định:**
- **D-17** `rheostat` → **(a)** thêm asset biến trở con chạy 20 Ω (theo spec KHTN 8 số 13).
- **D-18** `resistor-sample` → **(a)** thêm asset điện trở mẫu 10 Ω.
- **D-05/D-06** (đã quyết ở WF-05): `ammeter-dc`/`voltmeter-dc` → **(b)** DMM-0001.

### WF-13 — Mạch điện nối tiếp và song song hai bóng đèn (KHTN 8, Bài 23) — 3 bước — ⚠️ GUARD PASS VÔ ĐIỀU KIỆN

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF13-STEP-01 | incandescent-lamp-socket | — (trả về `true`) | — | **KHÔNG KHỚP** — xem D-07. |
| WF13-STEP-02 | voltmeter-dc | — (trả về `true`) | — | **KHÔNG KHỚP** — xem D-06 → (b) DMM-0001. |
| WF13-STEP-03 | incandescent-lamp-socket | — (trả về `true`) | — | **KHÔNG KHỚP** — xem D-07. |

**WF-13: 0/3 yêu cầu KHỚP.** Không quyết định mới — dùng D-06, D-07.

### WF-14 — Thoát hơi nước và quang hợp ở lá cây (KHTN 7, Bài 23) — 3 bước — ⚠️ GUARD PASS VÔ ĐIỀU KIỆN

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF14-STEP-01 | erlenmeyer-flask | — (trả về `true`) | — | **KHỚP** — FLK-0001 (cần 2 bình; catalog có 1 asset loại, dùng 2 instance — chấp nhận được). |
| WF14-STEP-02 | erlenmeyer-flask, plant-twig | — (trả về `true`) | — | **KHỚP** (bình) + **KHÔNG KHỚP** (cành cây) — không có asset cành cây. |
| WF14-STEP-03 | erlenmeyer-flask | — (trả về `true`) | — | **KHỚP** — FLK-0001. |

**WF-14: 3/4 yêu cầu KHỚP. Quyết định:**
- **D-19** `plant-twig` → **(a)** thêm asset cành cây — 2 biến thể (cành có lá / cành đã tỉa hết lá) phục vụ thiết kế đối chứng của bài.

### WF-15 — Đo độ pH bằng giấy chỉ thị màu và pH kế (KHTN 8, Bài 10) — 3 bước — ⚠️ GUARD PASS VÔ ĐIỀU KIỆN

| Bước | Yêu cầu | Guard tìm | Đọc state | Kết luận |
|---|---|---|---|---|
| WF15-STEP-01 | test-tube-rack, solution-samples | — (trả về `true`) | — | **KHÔNG KHỚP** — không có giá ống nghiệm, không có bộ mẫu dung dịch. (TUB-0001 mới chỉ là ống nghiệm rời, chưa có giá; DSH-0001 là bát sứ, không phải khay mẫu.) |
| WF15-STEP-02 | ph-indicator-strip, stirring-rod | — (trả về `true`) | — | **KHÔNG KHỚP** — không có giấy pH, không có đũa thủy tinh (xem D-15). |
| WF15-STEP-03 | ph-indicator-strip | — (trả về `true`) | — | **KHÔNG KHỚP** — xem D-20. |

**WF-15: 0/5 yêu cầu KHỚP. Quyết định:**
- **D-20** `ph-indicator-strip` → **(a)** thêm asset giấy pH vạn năng kèm bảng màu chuẩn (trạng thái màu theo pH gắn với `ChemicalSolutionSolver.ts` — kiểm tra solver đã hỗ trợ pH chưa trước khi viết thêm, xem C-19).
- **D-21** `test-tube-rack` → **(a)** thêm asset giá ống nghiệm (đi kèm TUB-0001 đã có).
- **D-22** `solution-samples` → **(a)** thêm asset bộ mẫu dung dịch (giấm ăn, nước chanh, nước xà phòng, nước cất); vật chứa tái dùng FLK-0001/BKR-0001 nếu được.

---

## 5. BẢNG TỔNG HỢP QUYẾT ĐỊNH (23 QUYẾT ĐỊNH)

| # | Archetype / mẫu guard | Kết luận | Quyết định | Chi tiết |
|---|---|---|---|---|
| D-01 | inclined-track | KHÔNG KHỚP | **(a)** thêm asset | Máng nghiêng có rãnh gá cổng quang (WF-04). |
| D-02 | photogate-sensor | KHÔNG KHỚP | **(a)** thêm asset | Cổng quang điện A/B (WF-04). |
| D-03 | digital-timer | KHÔNG KHỚP | **(b)** STW-0001 + **(c)** sửa guard `'STW'` | Bấm giờ thủ công; mất đo tự động tới khi có D-02. |
| D-04 | dc-power-supply | KHỚP SAI VAI TRÒ | **(b)** PSU-0001 (tạm) | Đang mượn nguồn đèn quang học 3–12 V; hộp pin 3–6 V để đợt sau. |
| D-05 | ammeter-dc | KHÔNG KHỚP | **(b)** DMM-0001 (chế độ đo dòng) + **(c)** guard `'DMM'` | WF-05, WF-12. |
| D-06 | voltmeter-dc | KHÔNG KHỚP | **(b)** DMM-0001 (chế độ đo áp) + **(c)** guard `'DMM'` | WF-05, WF-12, WF-13. |
| D-07 | incandescent-lamp-socket | KHÔNG KHỚP | **(a)** thêm asset | Đui + bóng sợi đốt (WF-05, WF-13). |
| D-08 | switch-spst | KHÔNG KHỚP | **(a)** thêm asset | Công tắc SPST / khóa K (WF-05). |
| D-09 | optical-disk + semicircular-glass-block | KHỚP MỘT PHẦN | **(b)** SLB-0001 + **(c)** guard `'SLB'` | Một asset gộp đĩa + bản; không tách. |
| D-10 | lever-arm-balance (guard) | KHỚP SAI VAI TRÒ | **(c)** guard `'LEV'`, bỏ nhánh `'BAL'` | WF-08 bước 1. |
| D-11 | overflow-can (guard) | KHÔNG KHỚP (mẫu) | **(c)** guard `'OVF'` | WF-09 bước 1. |
| D-12 | metal-cylinder-block | KHỚP | **(b)** SLD-0001 | Trụ nhôm; khối lượng minh họa ±2–5% (C-12). |
| D-13 | chemical-salt-nacl | KHÔNG KHỚP | **(c)** vật liệu tiêu hao | Bỏ khỏi `requiredArchetypes`; guard kiểm tra BAL-0001 ≈ 10 g. |
| D-14 | distilled-water | KHÔNG KHỚP | **(c)** vật liệu tiêu hao | Bỏ khỏi `requiredArchetypes`; guard kiểm tra CYL-0001 ≈ 90 ml. |
| D-15 | stirring-rod | KHÔNG KHỚP | **(a)** thêm asset | Đũa thủy tinh (WF-10, WF-15). |
| D-16 | tripod-gauze | KHÔNG KHỚP | **(b)** lưới trong DST-0001 + **(a)** kiềng sắt | Lưới có trong kit; kiềng phải thêm mới. |
| D-17 | rheostat | KHÔNG KHỚP | **(a)** thêm asset | Biến trở con chạy 20 Ω (WF-12). |
| D-18 | resistor-sample | KHÔNG KHỚP | **(a)** thêm asset | Điện trở mẫu 10 Ω (WF-12). |
| D-19 | plant-twig | KHÔNG KHỚP | **(a)** thêm asset | Cành cây 2 biến thể có lá / không lá (WF-14). |
| D-20 | ph-indicator-strip | KHÔNG KHỚP | **(a)** thêm asset | Giấy pH vạn năng + bảng màu chuẩn (WF-15). |
| D-21 | test-tube-rack | KHÔNG KHỚP | **(a)** thêm asset | Giá ống nghiệm, đi kèm TUB-0001 (WF-15). |
| D-22 | solution-samples | KHÔNG KHỚP | **(a)** thêm asset | Bộ 4 mẫu dung dịch; vật chứa tái dùng FLK/BKR (WF-15). |
| D-23 | Mẫu guard dư thừa `SPG`, `GRD`, `RAY`, `BRN`, `50G` | KHÔNG KHỚP (dư thừa) | **(c)** xóa khi làm C-17 | Nhánh OR còn lại đã khớp; xóa cho sạch, không đổi hành vi. |

**Đếm quyết định:** (a) thêm asset mới: **11** (D-01, D-02, D-07, D-08, D-15, D-16-kiềng, D-17, D-18, D-19, D-20, D-21, D-22 — tức 12 asset nếu đếm kiềng riêng) · (b) map sang asset hiện có: **7** (D-03, D-04, D-05, D-06, D-09, D-12, D-16-lưới) · (c) sửa workflow: **7** (D-03-guard, D-05/D-06-guard, D-09-guard, D-10, D-11, D-13, D-14, D-23 — trong đó D-03/D-05/D-06/D-09 là (b)+(c) kết hợp).

**Thứ tự triển khai đề xuất (sau khi bảng này được duyệt):**
1. **(c) trước** — sửa các mẫu guard tìm sai (D-03, D-09, D-10, D-11, D-23) và chuyển vật liệu tiêu hao (D-13, D-14): chỉ sửa `ExperimentWorkflows.ts`, không thêm asset, rủi ro thấp.
2. **(b) tiếp** — map DMM/PSU/STW (D-04, D-05, D-06) kèm hướng dẫn sử dụng trên UI: WF-05 và WF-12 bắt đầu chạy được ở mức cơ bản.
3. **(a) sau** — thêm asset mới, mỗi asset một commit theo chuẩn module v2.3 + 7 cổng (xem C-18/C-19): ưu tiên D-07 + D-08 (mở khóa WF-05/WF-13), rồi D-01 + D-02 (mở khóa WF-04), rồi D-15/D-20/D-21/D-22 (WF-10/WF-15), rồi D-17/D-18 (WF-12), D-19 (WF-14), kiềng D-16 (WF-11).

---

## 6. CÁC VẤN ĐỀ KHÁC PHÁT HIỆN KHI ĐỐI CHIẾU (KHÔNG PHẢI LỆCH CATALOG, GHI LẠI CHO C-17)

1. **WF-01 bước 1 — guard yếu:** `instances.find((i) => i.assetId.includes('BAL') || i.instanceState.isPoweredOn !== undefined)` — vế thứ hai khớp BẤT KỲ instance nào có trường `isPoweredOn`, kể cả không phải cân. Sửa ở C-17: chỉ chấp nhận `BAL`.
2. **WF-04 bước 3 / WF-05 bước 4 / WF-06 bước 3 — giá trị mặc định che lỗi đo:** `recordedTimeS ?? 0.42`, `isClosed` mặc định `true`, `?? 20.0 / ?? 10.0 / ?? 20.0` — xem C-09, không lặp lại ở đây.
3. **WF-07 bước 1 — code chết:** tính `disk`/`glass` rồi bỏ không dùng, trả về `true`. Xóa khi viết lại guard ở C-17.
4. **WF-06 bước 1 — mâu thuẫn 90 cm vs 100 cm:** OBN-0001 dài 90 cm nhưng bước viết "ray 100 cm" — xem C-05.
5. **WF-03 bước 1 — `requiredArchetypes` có `support-stand` nhưng guard không tìm giá đỡ:** guard chỉ tìm lực kế. Bổ sung kiểm tra STD-0001 ở C-17 nếu muốn guard đúng khai báo.
6. **WF-14 bước 1 — cần 2 bình tam giác nhưng catalog chỉ có 1 loại asset:** dùng 2 instance của FLK-0001 là đủ, không cần thêm asset.
7. **DMM-0001 chưa được workflow nào dùng:** sau khi áp dụng D-05/D-06, DMM-0001 trở thành thiết bị đo điện chính của WF-05/WF-12/WF-13 — cần hướng dẫn chọn thang đo trên UI (tránh học sinh đọc nhầm thang).

---

## 7. PHÊ DUYỆT

Bảng này là đầu vào bắt buộc cho C-11 và C-17. Trước khi triển khai, người dùng xác nhận:

- [ ] Đồng ý hướng (a)/(b)/(c) cho từng quyết định D-01..D-23 (ghi chú sửa đổi nếu có).
- [ ] Đồng ý dùng **DMM-0001 thay ampe/vôn kế analog** (D-05/D-06), hay yêu cầu thêm asset analog mới.
- [ ] Đồng ý **mượn PSU-0001 làm nguồn mạch tạm** (D-04), hay yêu cầu thêm hộp pin 3–6 V ngay.
- [ ] Đồng ý **đo WF-04 bằng bấm giây thủ công** (D-03) cho tới khi có cổng quang, hay hoãn WF-04 tới khi đủ asset.
- [ ] Đồng ý **không tách SLB-0001** thành đĩa + bản riêng (D-09).

*Hết bảng. Tổng cộng: 15 workflow, 47 bước, 76 yêu cầu archetype (19 KHỚP / 4 KHỚP SAI VAI TRÒ-MỘT PHẦN / 15 KHÔNG KHỚP), 40 mẫu guard (13 khớp / 5 dư thừa / 22 không khớp), 23 quyết định D-01..D-23.*
