# RWSS v1.1.1 — ASSEMBLY ACCEPTANCE CRITERIA
## Tiêu chí nghiệm thu chức năng lắp ráp thiết bị trong OpenLab 3D

- **Mã tài liệu:** `RWSS-OL3D-ASM-001`
- **Phiên bản:** 1.1.1 — Assembly Acceptance Addendum
- **Áp dụng cho:** `Environment Layer`, `Object Layer`, `Interaction Layer` và chức năng lắp ráp thiết bị trong OpenLab 3D.
- **Nguồn căn cứ:** Báo cáo rà soát code OpenLab 3D do người dùng cung cấp; các hành vi được báo cáo gồm đặt vật lên cân, docking dụng cụ vào bình cấp nước, móc vật vào lực kế, kẹp mẫu bằng thước cặp, gắn thiết bị lên ray quang học, lắp thấu kính lên giá và liên động nguồn–đèn quang học.
- **Vai trò:** Đây là tiêu chí nghiệm thu bổ sung. Không thay thế ba lớp RWSS và không khẳng định hành vi nào đang tồn tại nếu chưa kiểm tra lại code trong repository hiện tại.

---

## 1. Mục tiêu nghiệm thu

Chức năng lắp ráp chỉ được coi là đạt khi OpenLab chứng minh được rằng người học có thể chọn, di chuyển, định vị, kết nối, khóa, tháo và vận hành các thiết bị theo đúng interface và điều kiện kỹ thuật của từng thiết bị.

**Không nghiệm thu chỉ dựa trên việc mesh 3D chạm nhau, tự hút vào nhau hoặc phát animation.** Một lần lắp ráp hợp lệ phải tạo ra quan hệ lắp ráp có định danh, kiểm tra được và có ảnh hưởng đúng đến trạng thái chức năng khi phù hợp.

Phạm vi gồm:

1. Đặt thiết bị/vật mẫu lên bề mặt hoặc vùng làm việc.
2. Docking vào khay, giá, móc, ngàm, ray hoặc mặt gá.
3. Kết nối cổng điện, dữ liệu hoặc chất lỏng khi thiết bị có interface tương ứng.
4. Căn chỉnh trục, hướng và bậc tự do.
5. Kiểm tra tương thích, kích thước, cực tính và giới hạn kỹ thuật.
6. Tạo trạng thái hoạt động sau lắp ráp.
7. Tháo lắp, phục hồi và lặp lại mà không để lại liên kết lỗi.

## 2. Mô hình trạng thái lắp ráp bắt buộc

AI phải đối chiếu với state machine hiện có. Nếu code dùng tên trạng thái khác, tạo mapping; không tạo state machine thứ hai không đồng bộ.

| Trạng thái logic | Ý nghĩa | Điều kiện chuyển tiếp |
|---|---|---|
| `FREE` | Thiết bị chưa được gắn vào điểm đích | Instance tồn tại và có thể thao tác |
| `DRAGGING` | Người dùng đang thao tác di chuyển | Input bắt đầu trên hit area hợp lệ |
| `CANDIDATE` | Đang ở gần một interface có thể ghép | Có connector/anchor phù hợp để kiểm tra |
| `ATTACHED` | Đã ghép đúng interface | Tất cả điều kiện tương thích đã đạt |
| `CONSTRAINED` | Đã khóa một hoặc nhiều bậc tự do | Constraint được tạo và gắn với đúng hai participant |
| `REJECTED` | Thao tác không hợp lệ | Không tạo assembly edge/constraint; có lý do từ chối |
| `RELEASED` | Đã tháo lắp | Constraint/edge cũ đã được dọn và instance trở về trạng thái tự do |

Không bắt buộc mọi thao tác phải đi qua đủ mọi trạng thái. Ví dụ, đặt vật lên mặt cân có thể là `ATTACHED` theo quan hệ support/contact nhưng vẫn cho phép nhấc vật ra. Điều quan trọng là chuyển trạng thái phải rõ ràng, không tạo liên kết ngầm.

## 3. Dữ liệu tối thiểu của một quan hệ lắp ráp

Mỗi quan hệ lắp ráp phải có dữ liệu tương đương cấu trúc sau. Tên field có thể adapter với code hiện hữu.

```yaml
assemblyRelation:
  id: unique_relation_id
  status: attached
  source:
    instanceId: source_instance
    connectorId: source_connector
  target:
    instanceId: target_instance
    connectorId: target_connector
  relationType: mechanical_dock
  compatibility:
    result: compatible
    rulesChecked: []
    evidenceStatus: verified_or_unknown
  transform:
    position: resolved_from_connector_frames
    orientation: resolved_from_connector_frames
  constraints:
    allowedDegreesOfFreedom: documented
    lockedDegreesOfFreedom: documented
  lifecycle:
    createdAtState: runtime
    releasePolicy: documented
  validation:
    testIds: []
    evidence: []
```

### 3.1. Quy tắc connector/anchor

- Mỗi connector/anchor dùng cho lắp ráp phải có ID ổn định trong profile hoặc được sinh theo quy tắc có thể tái lập.
- Connector phải có `kind`, `subtype`, tọa độ và hướng trong local space, loại mate được chấp nhận và giới hạn có căn cứ.
- Điện có thể cần cực tính, loại AC/DC, điện áp, dòng hoặc giao thức; chỉ khai báo những thông số có nguồn.
- Cơ khí có thể cần kích thước, hướng cắm, vùng kẹp, khả năng chịu tải hoặc bậc tự do.
- Chất lỏng cần phân biệt đầu cấp, đầu nhận, đường dẫn và điều kiện dòng chảy.
- Quang học phải phân biệt **liên kết gá cơ khí** với **quan hệ đồng trục/đường truyền ánh sáng**.
- Không được kết luận tương thích chỉ vì hai mesh ở gần nhau, cùng màu hoặc có tên tương tự.
- Không dùng một ngưỡng snap toàn cục cho mọi thiết bị. Dung sai phải theo interface/profile; thiếu dữ liệu thì ghi `UNKNOWN` và không được nghiệm thu định lượng.

### 3.2. Assembly graph

Quan hệ lắp ráp phải truy vấn được dưới dạng graph hoặc cấu trúc tương đương:

- Node: instance thiết bị/vật thể.
- Edge: quan hệ kết nối giữa hai connector/anchor cụ thể.
- Constraint: giới hạn chuyển động được tạo bởi edge.
- Runtime state: trạng thái lắp, vận hành và đo lường.

Khi tháo một thiết bị, chỉ các edge/constraint liên quan phải bị xóa; những nhánh không liên quan không được bị reset hoặc mất trạng thái.

## 4. Bộ tiêu chí nghiệm thu chức năng lắp ráp

Mỗi tiêu chí phải có bằng chứng từ code, automated test hoặc manual test có thể lặp lại. Kết quả chỉ được ghi `PASS`, `FAIL`, `BLOCKED` hoặc `NOT_APPLICABLE`; không dùng “có vẻ đúng”.

| ID | Nhóm | Tiêu chí nghiệm thu | Phép thử tối thiểu | Điều kiện PASS |
|---|---|---|---|---|
| ASM-01 | Định danh | Chọn đúng instance và hit area | Chọn/drag trên thân, nút và chi tiết lắp ráp | Đúng đối tượng/handle; không bắt nhầm mesh trang trí hoặc thiết bị phía sau |
| ASM-02 | Tỷ lệ | Kích thước lắp khớp profile | Đo kích thước model và vị trí interface | Đơn vị, world scale và transform nhất quán; không tự đổi tỷ lệ để ép khớp |
| ASM-03 | Connector | Connector có định danh, loại, vị trí và hướng | Truy vấn profile của hai phía ghép | Có thể xác định rõ điểm ghép; dữ liệu thiếu được đánh dấu `UNKNOWN` |
| ASM-04 | Tương thích | Kiểm tra đúng loại interface | Ghép đúng loại và thử ghép sai loại | Đúng loại được chấp nhận; sai loại bị từ chối và không tạo edge |
| ASM-05 | Snap/docking | Căn chỉnh vị trí và hướng | Đưa connector vào vùng docking | Ghép tại anchor đúng; không chỉ hút theo tâm bounding box; sai hướng bị xử lý theo rule |
| ASM-06 | Dung sai | Snap tolerance theo từng interface | Thử ở ngoài/trong ngưỡng được cấu hình | Biên ngưỡng có đơn vị, nguồn hoặc cấu hình được ghi nhận; không có tolerance giả định dùng chung |
| ASM-07 | Hình học | Không xuyên lấn hoặc lơ lửng bất hợp lý | Lắp, xoay và thả thiết bị | Không có penetration nghiêm trọng, khe hở sai hoặc vật thể trôi khỏi điểm gá; ngoại lệ phải được khai báo |
| ASM-08 | Constraint | Bậc tự do sau lắp đúng cơ cấu | Thử di chuyển theo các trục sau docking | Chỉ các bậc tự do được cho phép mới còn hoạt động; constraint không làm khóa nhầm |
| ASM-09 | Chiếm dụng | Xử lý connector/slot đã bận | Ghép hai instance vào cùng một cổng có giới hạn một thiết bị | Từ chối hoặc thay thế theo policy rõ; không tạo chồng lắp và edge trùng |
| ASM-10 | Chức năng | Lắp ráp làm thay đổi đúng trạng thái hệ | Hoàn tất lắp rồi kích hoạt chức năng | Thiết bị phản hồi từ authoritative state; không chỉ đổi animation/UI |
| ASM-11 | Kết nối điện | Điều kiện nguồn và cực tính được kiểm tra | Kiểm tra nguồn/đèn theo interlock có trong báo cáo | Đèn chỉ hoạt động khi điều kiện nguồn được thỏa; ngắt nguồn thì tắt; không suy ra khả năng chịu dòng chưa có dữ liệu |
| ASM-12 | Gá quang học | Thiết bị vào đúng ray/giá và căn trục | Gắn đèn, vật F, lens, màn vào optical bench | Giữ profile ray 100 cm và trục y=0.125 m nếu đó là giá trị đang được code xác nhận; carriage tuân thủ 1D constraint |
| ASM-13 | Giá thấu kính | Chọn và lắp đúng profile lens | Chọn từng profile trong hộp và gắn lên holder | Holder nhận đúng lens ID/tiêu cự; không chỉ thay hình ảnh; thao tác tháo/lắp không làm mất profile |
| ASM-14 | Móc/kẹp | Cơ cấu giữ tải/mẫu đúng cách | Móc quả cân vào lực kế; kẹp mẫu bằng thước cặp | Vật gắn vào đúng hook/jaw; tải/mẫu tác động đúng lên state đo; thả ra phục hồi cơ cấu |
| ASM-15 | Docking dụng cụ chứa | Bình/cốc vào đúng vị trí cấp/nhận | Dock cốc, ống đong, bình tràn vào khay cấp nước | Miệng nhận nằm đúng dưới vòi; chỉ dụng cụ được chấp nhận mới docking |
| ASM-16 | Giới hạn hình học | Không cho phép lắp vật không lọt/không phù hợp | Thử vật vượt khẩu độ ống đong | Theo báo cáo, trường hợp kích thước vượt 28 mm phải bị từ chối; chỉ áp dụng fixture này cho đúng thiết bị/profile đã xác nhận |
| ASM-17 | Tháo lắp | Release dọn sạch quan hệ | Attach → detach → attach lại | Không còn constraint/edge mồ côi; instance trở về trạng thái tự do và có thể lắp lại |
| ASM-18 | Phục hồi lỗi | Lỗi giữa thao tác không làm hỏng state | Hủy drag, thả sai vị trí hoặc reset trong lúc thao tác | Thiết bị không biến mất, không bị khóa hoặc nhân bản; state được hoàn nguyên hoặc hoàn tất theo policy |
| ASM-19 | Nhiều instance | Không chia sẻ nhầm state | Tạo hai thiết bị cùng archetype và lắp độc lập | ID instance, connector occupancy, transform và trạng thái riêng biệt |
| ASM-20 | Tính lặp lại | Cùng điều kiện cho kết quả nhất quán | Lặp thao tác lắp/tháo tối thiểu nhiều lần | Kết quả ghép, vị trí và state ổn định trong tolerance được định nghĩa; không tăng edge/constraint theo số lần lặp |
| ASM-21 | Lắp ráp theo cụm | Preset lắp cụm thỏa điều kiện | Chạy thao tác “Lắp 8.12” theo báo cáo | Đúng thiết bị, đúng thứ tự/vị trí, không sinh bản sao; báo rõ thành phần thiếu hoặc không tương thích |
| ASM-22 | Phản hồi | Người học hiểu vì sao thành công/thất bại | Thử sai loại, sai hướng, cổng bận hoặc vượt giới hạn | Có thông báo nêu nguyên nhân và cách sửa; không chỉ im lặng hoặc phát âm thanh |
| ASM-23 | Regression | Lắp ráp không phá hành vi hiện có | Chạy lại các luồng đo, chất lỏng, quang học và điện từ liên quan | Tất cả regression test baseline tiếp tục PASS hoặc có thay đổi được phê duyệt và giải thích |
| ASM-24 | Bằng chứng | Kết quả nghiệm thu truy xuất được | Mở test report và trace | Có test ID, setup, input, expected/actual, trạng thái, code/test reference và bằng chứng |

## 5. Các kịch bản lắp ráp bắt buộc theo thiết bị đã có trong báo cáo

Các kịch bản dưới đây là regression fixtures dựa trên báo cáo nguồn; cần kiểm tra lại code hiện tại trước khi chốt PASS.

### 5.1. Cân điện tử và quả cân

1. Kéo quả cân chuẩn vào đĩa cân.
2. Chỉ khi vật nằm trong vùng nhận của đĩa (báo cáo mô tả bán kính `R ≤ 0.065 m`) mới được tính vào cân.
3. Mỗi instance chỉ được cộng một lần dù có nhiều mesh con hoặc nhiều collider.
4. TARE cập nhật offset nhưng không xóa quan hệ đặt vật.
5. Nhấc vật ra phải cập nhật khối lượng theo state mới.

### 5.2. Vật mẫu và ống đong/bình tràn

1. Thử vật phù hợp với khẩu độ ống đong.
2. Thử mẫu vượt khẩu độ 28 mm: phải từ chối thả vào ống đong, giữ vật ở trạng thái an toàn và đưa hướng dẫn phù hợp.
3. Khi thả mẫu vào bình hợp lệ, displacement phải dựa trên cùng thể tích vật được dùng trong profile.
4. Với bình tràn, lượng tràn và lượng nhận phải cân bằng theo mô hình thể tích.

### 5.3. Hook lực kế và clamp thước cặp

1. Kéo móc của vật vào hook lực kế.
2. Vật phải gắn ở đúng điểm móc và tạo tải cho lực kế.
3. Thử kéo vật vào vị trí không phải hook: không được tự gắn ngoài ý muốn.
4. Đặt mẫu vào giữa hai mỏ thước cặp và kẹp.
5. Mỏ kẹp phải dừng tại kích thước mẫu; không được dịch chuyển mẫu hoặc đọc số từ animation cố định.

### 5.4. Bình/cốc vào bình cấp nước

1. Chỉ các dụng cụ được hỗ trợ mới được docking vào khay.
2. Sau docking, tâm vùng nhận phải nằm dưới vòi xả theo geometry/anchor của profile.
3. Không được xuyên thân hoặc lơ lửng.
4. Khi xả, lượng nước nguồn giảm và dụng cụ nhận tăng cùng lượng theo mô hình hiện hành.

### 5.5. Ray quang học và giá đỡ

1. Gắn đèn, vật F, holder/lens và màn chắn lên ray.
2. Kiểm tra đúng carriage/anchor, chiều đặt và cao độ quang trục.
3. Sau lắp, thiết bị chỉ được trượt theo bậc tự do 1D mà báo cáo mô tả.
4. Thử dịch chuyển ngang/nâng lên/xoay: nếu profile không cho phép thì phải bị constraint chặn.
5. Tháo từng thiết bị không được làm rơi hoặc dịch chuyển các thiết bị còn lại.
6. Chạy preset lắp cụm; xác minh đủ asset, đúng vị trí và không tạo duplicate.

### 5.6. Nguồn điện và đèn quang học

1. Kiểm tra trạng thái chưa có nguồn: đèn tắt.
2. Có nguồn nhưng công tắc OFF: đèn tắt.
3. Có nguồn và công tắc ON: đèn được phép hoạt động theo điều kiện interlock đã báo cáo.
4. Tắt nguồn trong lúc đèn đang sáng: đèn tắt và state được cập nhật.
5. Không kết luận đã có mô phỏng topology mạch hoàn chỉnh nếu code chỉ đang thực hiện interlock nguồn.

## 6. Phân loại mức độ lỗi

| Mức | Định nghĩa | Ví dụ | Xử lý |
|---|---|---|---|
| `P0 — BLOCKER` | Có thể tạo kết quả sai nghiêm trọng, kết nối sai vẫn được chấp nhận hoặc phá hỏng state | Nối sai cực vẫn chạy; thiết bị không tương thích vẫn attach; duplicate edge làm nhân đôi tác động | Không nghiệm thu; phải sửa trước |
| `P1 — MAJOR` | Luồng lắp ráp chính không ổn định hoặc sai hình học/chức năng | Snap sai anchor; rail mất giới hạn; tháo ra còn constraint | Không nghiệm thu luồng liên quan |
| `P2 — MINOR` | Lỗi phụ không làm sai quan hệ khoa học cốt lõi | Thông báo chưa rõ; hiệu ứng snap chưa mượt | Có thể phát hành có điều kiện nếu được ghi nhận và không ảnh hưởng an toàn/chính xác |
| `P3 — COSMETIC` | Chỉ ảnh hưởng thẩm mỹ | Âm thanh, highlight, easing | Không chặn nghiệm thu khoa học nếu không gây hiểu nhầm |

## 7. Thang điểm nghiệm thu lắp ráp — 100 điểm

| Nhóm đánh giá | Trọng số |
|---|---:|
| A. Định danh, profile và kích thước | 10 |
| B. Connector/anchor và dữ liệu giao diện | 15 |
| C. Kiểm tra tương thích và điều kiện ghép | 15 |
| D. Snap, docking, alignment và dung sai | 15 |
| E. Constraint, bậc tự do, va chạm và hình học | 10 |
| F. Đồng bộ state và chức năng sau lắp | 15 |
| G. Từ chối thao tác sai, feedback và phục hồi | 10 |
| H. Regression, tính lặp lại và bằng chứng | 10 |
| **Tổng** | **100** |

Cách chấm mỗi nhóm: `0 = không có/sai`; `1 = chỉ hiển thị`; `2 = có tương tác nhưng thiếu kiểm tra`; `3 = có rule và test`; `4 = có test lặp lại, bằng chứng và dữ liệu tham chiếu`. Điểm nhóm = trọng số × mức/4.

### Điều kiện kết luận

- **Đạt:** từ 85/100 trở lên, không có lỗi P0, các test cốt lõi ASM-03/04/05/10/17/23/24 đạt.
- **Đạt có điều kiện:** 75–84/100, không có P0; các lỗi P1/P2 còn lại phải có owner và kế hoạch xử lý rõ. Không được tuyên bố toàn bộ chức năng lắp ráp đã hoàn thiện.
- **Không đạt:** dưới 75/100 hoặc có bất kỳ lỗi P0 nào.
- `BLOCKED` do thiếu dữ liệu/khu vực code không thể kiểm chứng không được tính là PASS; phải ghi rõ ảnh hưởng tới kết luận.

Ngưỡng điểm là quy tắc nghiệm thu nội bộ đề xuất cho OpenLab, không phải ngưỡng tiêu chuẩn quốc tế.

## 8. Biểu mẫu ghi bằng chứng cho mỗi test

```yaml
assemblyTest:
  testId: ASM-05
  title: Dock compatible connector
  severity: P1
  setup:
    sourceInstance: documented_instance
    targetInstance: documented_instance
    initialState: documented
  action: documented_user_action
  expected:
    status: attached
    transform: according_to_connector_frames
    relationCount: 1
  actual:
    status: pending
    transform: pending
    relationCount: pending
  tolerance:
    value: source_defined_or_unknown
    unit: documented_or_na
    source: code_or_reference
  evidence:
    sourceFiles: []
    automatedTests: []
    runtimeCapture: []
  result: BLOCKED
  notes: explain_missing_evidence_or_failure
```

Mỗi test report phải lưu actual values, không chỉ ghi `PASS`. Bằng chứng hình ảnh/video hỗ trợ quan sát nhưng không thay thế log state hoặc phép đo cần thiết.

## 9. Bảng nghiệm thu tổng hợp

| Test ID | Trạng thái | Bằng chứng | Ghi chú |
|---|---|---|---|
| ASM-01…ASM-24 | `NOT_RUN` | Chưa có | Cập nhật theo từng lần chạy |

Không tự chuyển `NOT_RUN`/`BLOCKED` thành PASS. Chỉ cập nhật sau khi AI coding agent chạy test hoặc người kiểm thử ghi nhận thao tác thực tế.

## 10. Lệnh ngắn nghiệm thu lắp ráp

```text
Thực hiện ASSEMBLY ACCEPTANCE AUDIT theo
 docs/standards/RWSS/05_ASSEMBLY_ACCEPTANCE_CRITERIA.md.
Rà soát đúng code và chạy ASM-01 đến ASM-24 cho các thiết bị/luồng hiện có.
Ưu tiên docking, connector compatibility, alignment, constraint/DOF,
collision, attach/detach, invalid assembly, state propagation và regression.
Dùng báo cáo rà soát OpenLab làm regression fixture; không tự đặt connector,
tolerance hoặc thông số chưa có nguồn. Ghi PASS/FAIL/BLOCKED/NOT_APPLICABLE,
đính kèm test ID, file/function/line, expected/actual và bằng chứng.
Tạo hoặc cập nhật ASSEMBLY_ACCEPTANCE_REPORT.md. Không tuyên bố đạt nếu
còn lỗi P0 hoặc thiếu bằng chứng ở tiêu chí cốt lõi.
```

---

## 11. Nguyên tắc khóa

**Một thiết bị chỉ được xem là đã lắp ráp khi một quan hệ kết nối hợp lệ được tạo ra giữa đúng hai interface, transform và constraint được giải quyết, trạng thái hệ được cập nhật, và thao tác có thể kiểm thử cả chiều lắp lẫn chiều tháo.**
