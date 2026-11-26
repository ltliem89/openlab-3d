# Vòng 3 (C-11/C-17): Guard thật cho WF-03 b.3, WF-09, WF-10 b.2, WF-11, WF-14 b.1, WF-15 b.3

Ngày: 2026-11-26. Làm trong bản sao chạy thử `~/workspace/openlab-3d-v250-run`
(v2.5.0 + guard Vòng 1 + camera Vòng 2). Chưa đẩy lên GitHub — chờ người đẩy.

## File đã đổi

| File | Thay đổi |
|---|---|
| `src/experiments/ExperimentWorkflows.ts` | Guard thật WF-03 b.3, WF-09 (3 bước), WF-10 b.2, WF-11 (3 bước), WF-14 b.1, WF-15 b.3; sửa `requiredArchetypes` sai; các bước kẹt đổi thành fail trung thực (xem dưới) |
| `src/data/mockCatalog.ts` | Thêm asset PHM-0001 (Máy đo pH) — catalog 40 → 41 asset |
| `src/three-runtime/HtmlEquipmentModuleRegistry.ts` | Thêm `'OL3D-EQP-PHM-0001': 'digital-multimeter'` vào `CANONICAL_ARCHETYPE_MAP` |
| `src/App.tsx` | `recordedTimeS`: +1 → +0,45 mỗi tick 450 ms (sửa đơn vị giây) |
| `scripts/verify-wf09-wf15-guards.ts` | Mới — 71 test âm tính + dương tính |

## Guard mới (tóm tắt)

- **WF-03 b.3:** `measuredForceN` không tồn tại → dùng `springExtensionN` thật
  (reconcile = Σ khối lượng móc × 0,00980665). PASS khi WGT-0001 móc vào DYN
  (`dynamometer-hook`) và |F − 0,49| ≤ 0,02 N. Bỏ reason bịa `'0.50' N`.
- **WF-09 b.1:** OVF-0001 có mặt và `baseLiquidLevelMl ≥ 209,5` ml.
  Sửa matching `includes('OVR')/'CAN'` (không asset nào chứa) → `=== 'OL3D-EQP-OVF-0001'`.
- **WF-09 b.2:** SLD móc vào DYN và |`springExtensionN` − 0,65| ≤ 0,02 N.
  Reason ghi rõ P₁ là tính từ khối lượng catalog, khớp số đo trên lực kế.
- **WF-09 b.3:** SLD chìm trong OVF (`inside-vessel`) và
  |`overflowingVolumeMl` − 24,5| ≤ 2,5 ml. F_A ≈ 0,24 N và P₂ ≈ 0,41 N là
  **tính ra** từ thể tích tràn — một vật chỉ có một slot gắn nên P₂ không đọc
  trực tiếp được trên lực kế (ghi rõ trong reason).
- **WF-10 b.2:** CYL-0001 và |`baseLiquidLevelMl` − 90| ≤ 2 ml.
- **WF-11 b.1:** Đề viết lại (bỏ kiềng/lưới không tồn tại). PASS khi BKR+THM+ALC
  có mặt, THM cắm trong BKR (`inside-vessel`), khoảng cách ngang ALC–BKR ≤ 0,35 m.
- **WF-11 b.2:** ALC-0001 đúng assetId và `isFlameLit`/`isHeating` là true.
  Không dùng `??` để bù.
- **WF-11 b.3:** Đủ 4 điều kiện: THM cắm trong BKR + đèn đang cháy +
  `temperatureC ≥ 99,5` + STW `recordedTimeS ≥ 18` s thật. Chặn lỗ hổng
  pass-giả cũ (bấm chuyển bước là T bị set thẳng 100 °C).
- **WF-14 b.1:** Đúng 2 bình FLK-0001, mỗi bình `baseLiquidLevelMl` trong [95, 110] ml.
  Không kiểm tra lớp dầu (không có trong code).
- **WF-15 b.3:** PHM-0001 có mặt, `multimeterMode === 'pH'`,
  `multimeterValue` ∈ {2,90; 7,00; 11,50} ± 0,05. Reason ghi rõ đây là
  **chọn mẫu bằng nút preset** trong module, chưa phải nhúng đầu dò vào mẫu thật.

## Các bước kẹt — fail trung thực thay vì pass giả

Các bước này **không** viết guard giả. Guard trả fail với lý do nói rõ thiếu cái gì,
để học sinh/giáo viên biết bài chưa làm được tới đâu (đúng tiêu chí "fail closed"
của Vòng 1). Khi asset/cơ chế được bổ sung thì viết guard thật sau.

| Bước | Lý do kẹt |
|---|---|
| WF-10 b.1 | Không có asset NaCl, không có cách nào cân ra 10,0 g |
| WF-10 b.3 | Không có đũa khuấy, không có trạng thái "đã khuấy" |
| WF-14 b.2 | Không có asset cành cây (có lá / không lá) |
| WF-14 b.3 | Không có cành cây, không có cơ chế thời gian/thoát hơi nối vào instance |
| WF-15 b.1 | Không có khay mẫu / mẫu dung dịch |
| WF-15 b.2 | Không có giấy chỉ thị pH / đũa thủy tinh |

Lưu ý: thiết kế gốc dặn "KHÔNG sửa guard" cho WF-10 b.1/b.3 và WF-14 b.2/b.3.
Người làm Vòng 3 đã đổi chúng từ pass-vô-điều-kiện sang fail-trung-thực (không bịa
guard kiểm chứng giả), vì giữ pass giả sẽ vi phạm tiêu chí thoát vòng lặp
("không còn bước pass vô điều kiện") và giữ nguyên câu sai như "Muối đã tan hoàn
toàn". Nếu muốn giữ nguyên pass cũ thì revert 4 guard này.

## Điểm lệch khỏi thiết kế gốc

1. **PHM-0001 dùng archetype `digital-multimeter`, không phải `ph-meter`.**
   `ph-meter` không có trong union `ProceduralArchetype` (types.ts) và không có
   case trong procedural builder — dùng nó sẽ chỉ hiện hộp xám fallback.
   Manifest của chính module HTML PHM cũng khai
   `"proceduralArchetype": "digital-multimeter"`, nên đây là lựa chọn đúng
   với dữ liệu có sẵn. Số liệu PHM (khối lượng 285 g, 0–14 pH, ĐCNN 0,01)
   lấy từ manifest đó, ghi `status: 'reported'` (chưa đối chiếu thiết bị thật).
2. **WF-10 b.3 không làm theo "guard làm được ngay" trong thiết kế** (kiểm tra
   BKR + mức [85,100] + kiểm tra lại b.1/b.2), vì b.1 không bao giờ pass được
   (thiếu NaCl) nên guard đó cũng luôn fail — giữ fail-trung-thực đơn giản hơn.
3. **`requiredArchetypes` vẫn được engine neural-guide match bằng substring
   trên assetId** (`ExperimentWorkflowEngine.ts:231-246`), nên các chuỗi kiểu
   `'spring-dynamometer'`, `'overflow-can'` không match được assetId thật
   (`OL3D-EQP-DYN-0001`…). Đây là lỗi có sẵn ngoài phạm vi Vòng 3, để vòng sau.
   Guard không phụ thuộc vào trường này.
4. **Module HTML PHM vẫn là hằng số mồ côi** (`SAMPLE_PH_METER_HTML_MODULE`
   export nhưng không nơi nào import/register). Guard WF-15 b.3 đọc
   `instanceState` nên vẫn kiểm định được bằng script; nhưng trong app thật,
   nút preset pH chỉ xuất hiện khi module được nạp vào thư viện module
   (cơ chế quét thư mục của registry). Việc nối module vào app là việc vòng sau.

## Kiểm định Vòng 3 (chạy local 26/11/2026)

- `npx tsx scripts/verify-wf09-wf15-guards.ts`: **71 PASSED, 0 FAILED** (mới).
- `npx tsc --noEmit`: exit 0 (đã sửa 1 lỗi type: `methodRef` không có trên
  trường `material` của catalog — bỏ `methodRef`, giữ chú thích trong `value`).
- `npm run build`: exit 0 (2,92 s).
- `scripts/verify-all-15-workflows.ts`: 77 PASSED, 0 FAILED (không đổi).
- `scripts/verify-wf07-wf08-guards.ts`: 27 PASSED, 0 FAILED (guard Vòng 1 nguyên vẹn).
- `scripts/verify-hand-tracking.ts`: 31 PASSED, 0 FAILED (code camera Vòng 2 nguyên vẹn).
- Version giữ 2.5.0 (không đổi).
