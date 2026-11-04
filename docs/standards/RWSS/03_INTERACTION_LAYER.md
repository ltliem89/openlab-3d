# RWSS v1.1 — LAYER 03: INTERACTION
## Tiêu chuẩn tương tác, lắp ráp và hành vi khoa học trong OpenLab 3D

- **Mã tiêu chuẩn:** `RWSS-OL3D-INT-001`
- **Phiên bản:** 1.1
- **Phạm vi ưu tiên:** Kéo thả, docking, lắp ráp, kết nối, đo lường, chất lỏng, nhiệt, điện, quang học, cảm ứng điện từ và quan sát sinh học.
- **Nguồn căn cứ:** Báo cáo rà soát chức năng thực tế OpenLab 3D do người dùng cung cấp.

---

## 1. Mục tiêu

Interaction Layer là lớp điều khiển **quan hệ nhân quả giữa Environment và Object**. Lớp này quyết định một thao tác có hợp lệ không, vật thể nào bị tác động, đại lượng nào thay đổi và kết quả được chuyển tới thiết bị đo/hiển thị như thế nào.

OpenLab cần phân biệt bốn dạng hành vi:

1. **Input/Manipulation:** Người học kéo, xoay, nhấn, đặt, rót, kẹp hoặc điều chỉnh.
2. **Mechanical Interaction:** Tiếp xúc, va chạm, docking, constraint, lực và chuyển động.
3. **Scientific Interaction:** Truyền khối lượng, thể tích, nhiệt, điện, ánh sáng, từ thông hoặc cơ chế sinh học.
4. **Observation/Measurement:** Thiết bị đo đọc trạng thái của hệ và hiển thị kết quả.

Không được coi một animation trông hợp lý là bằng chứng rằng tương tác khoa học đã được mô phỏng.

---

## 2. Quy tắc nền tảng

### 2.1. Một trạng thái có thẩm quyền

Mỗi đại lượng chỉ có một nguồn trạng thái có thẩm quyền. Ví dụ:

- Thể tích chất lỏng thuộc state của hệ chứa/chất lỏng; mesh mực nước chỉ đọc state.
- Khối lượng vật thuộc Object Profile/instance state; LCD cân đọc tổng khối lượng và tare.
- Trạng thái nguồn điện thuộc nguồn; đèn đọc trạng thái cấp điện từ kết nối.
- Góc lệch tia thuộc bộ giải quang học; tia vẽ theo kết quả, không tự quyết định kết quả.
- Nhiệt độ mẫu thuộc mô hình nhiệt; cột nhiệt kế đọc nhiệt độ đó.

Không tạo hai biến độc lập cùng đại diện cho một đại lượng vật lý nếu không có đồng bộ và quy tắc rõ.

### 2.2. Interaction Contract

Mỗi tương tác phải có tối thiểu:

```yaml
interaction:
  id: unique_interaction_id
  kind: mechanical_or_scientific
  participants: []
  preconditions: []
  inputs: []
  governingModel: documented_model
  stateOwner: one_authoritative_state
  outputs: []
  invalidCases: []
  feedback: []
  resetPolicy: defined
  validationTests: []
  evidenceStatus: verified_or_configured_or_unknown
```

Tương tác phải thể hiện được nguyên nhân, điều kiện trước, phép xử lý, kết quả, trường hợp không hợp lệ và cách kiểm thử.

### 2.3. Tách physics time và animation time

Thời gian chuyển động đồ họa không mặc nhiên là thời gian vật lý. Báo cáo ghi nhận hoạt cảnh rót nước 1120 ms và cốc nghiêng -38°. Đây có thể là thời gian trình diễn thao tác; không được coi 1120 ms là thời gian vật lý của dòng chất lỏng nếu chưa có mô hình chứng minh.

### 2.4. Không hardcode kết quả nếu kết quả phải phụ thuộc điều kiện

Không được viết sẵn “bật LED”, “kim lệch”, “nước dâng”, “ảnh hiện” như một kết quả không phụ thuộc đầu vào. Kết quả phải được suy ra từ state và mô hình. Trường hợp mô phỏng minh họa cố định phải được gắn nhãn `qualitative` hoặc `scripted-demonstration`.

---

## 3. Nhóm tương tác đã có căn cứ trong báo cáo

### 3.1. Đặt, kéo thả và docking

| Tình huống được báo cáo ghi nhận | Quy tắc phải duy trì |
|---|---|
| Đặt vật lên cân | Raycast phát hiện vật trên đĩa trong bán kính R ≤ 0.065 m; cộng mass và trừ tare |
| Móc quả cân/vật vào lực kế | Vật gắn vào móc; lực được xác định từ tải và trọng trường; lực kế phản hồi theo Hooke |
| Vật rắn vào ống đong | Kiểm tra khẩu độ 28 mm; nếu không lọt phải từ chối và hướng dẫn dùng bình tràn |
| Cốc/ống đong/bình tràn vào bình cấp | Docking đến tâm dưới vòi xả |
| Thiết bị quang học lên ray | Docking và khóa bậc tự do; carriage trượt theo ray 1D |
| Thấu kính từ hộp lên giá | Chọn thấu kính sẽ gắn lên giá đỡ theo profile |

Yêu cầu kỹ thuật:

- Docking phải sử dụng connector/anchor đã định nghĩa, không chỉ dựa vào khoảng cách tâm mesh.
- Phải kiểm tra loại thiết bị, hướng, vùng cho phép và trạng thái bận/rảnh.
- Khi docking thành công, tạo constraint hoặc quan hệ cha-con có quy tắc transform rõ.
- Khi tháo, phục hồi trạng thái tự do và không để lại constraint mồ côi.
- Có thể bật/tắt snap distance theo từng interface; không dùng một ngưỡng toàn cục cho tất cả thiết bị.

### 3.2. Đo khối lượng

Báo cáo ghi nhận cân kỹ thuật 2000 g, ĐCNN 0.1 g, TARE trực tiếp trên nút 3D và phép tính:

`displayedMass = sum(placedObjectMass) - tareOffsetG`

Yêu cầu kiểm thử:

- Một quả cân 200 g đặt đúng vùng đĩa → số cân tăng 200.0 g theo độ chia hiện có.
- Nhiều vật → tổng khối lượng được cộng đúng một lần cho mỗi vật.
- TARE → lưu offset tại thời điểm bấm, không xóa khối lượng vật đang đặt.
- Nhấc vật ra → số hiển thị thay đổi theo khối lượng còn lại và offset.
- Quá tải/âm/ngoài giới hạn → xử lý theo trạng thái thiết bị; không hiển thị kết quả hợp lệ giả.

### 3.3. Mật độ, thể tích và bình tràn

Báo cáo ghi nhận mẫu vật có khối lượng từ mật độ và thể tích; vật rắn làm dâng chất lỏng; bình tràn có ngưỡng 210 ml và cốc hứng nhận thể tích tràn.

Yêu cầu:

- Dùng cùng một thể tích vật trong tính toán displacement và thể tích tràn.
- Kiểm tra khẩu độ và giới hạn bình trước khi cho phép thao tác.
- Cân bằng thể tích giữa nguồn, môi trường và bình nhận.
- Không để mesh mặt nước thay đổi mà state thể tích không đổi.
- Không cho phép vật thể chiếm chỗ trong chất lỏng nếu thao tác bị từ chối.

### 3.4. Rót và chuyển chất lỏng

Báo cáo ghi nhận `computeExactPourPosition`, thao tác nghiêng -38° trong hoạt cảnh 1120 ms, dòng rót và cập nhật thể tích nguồn/nhận.

Yêu cầu:

- Tính vị trí vòi rót và vùng nhận.
- Chỉ chuyển chất lỏng khi điều kiện rót hợp lệ.
- Tổng thể tích phải cân bằng theo lượng chuyển (trừ tổn thất được khai báo).
- Không phụ thuộc riêng animation để cập nhật volume.
- Hủy thao tác giữa chừng phải có quy tắc: hoàn tất, dừng và hoàn nguyên, hoặc lưu lượng đã chuyển; không được mất thể tích không kiểm soát.

### 3.5. Phễu chiết và tách pha

Báo cáo ghi nhận hai lớp chất lỏng không đồng tan, dầu màu vàng nổi trên nước màu xanh; xoay khóa van PTFE 90° sẽ xả pha đáy.

Yêu cầu:

- Pha phải có định danh và thuộc tính cần thiết.
- Thứ tự lớp dựa trên thuộc tính vật lý như mật độ trong profile, không chỉ dựa trên màu.
- Vị trí hút/xả của van phải tương ứng với cấu tạo.
- Khi xả, lượng pha đáy giảm và bình nhận tăng theo cùng lượng.
- Màu chỉ là mã trực quan, không phải căn cứ khoa học để quyết định thứ tự pha.

### 3.6. Gia nhiệt và nhiệt kế

Báo cáo ghi nhận đèn cồn có flame group và làm tăng nhiệt độ chất lỏng; nhiệt kế có cột chất lỏng biến đổi theo nhiệt độ.

Yêu cầu:

- Bật nguồn nhiệt phải tạo năng lượng truyền vào mẫu theo mô hình đã khai báo.
- Nhiệt độ phụ thuộc khối lượng, nhiệt dung, công suất/flux, thời gian và tổn thất nếu mô hình có xét.
- Nhiệt kế đọc nhiệt độ mẫu tại vị trí đo; không được tăng cột nhiệt kế độc lập với mẫu.
- Nếu chưa có công suất hoặc hệ số truyền nhiệt, chỉ được gọi là mô hình định tính.

### 3.7. Nguồn điện và đèn quang học

Báo cáo ghi nhận đèn quang học 12 V/21 W, sáu chế độ tia và interlock: đèn chỉ sáng khi có biến áp nguồn và nguồn đang bật. Biến áp có nấc 3/6/9/12 V DC và dây nối đến đèn.

Yêu cầu:

- Đèn phải nhận nguồn thông qua kết nối hợp lệ.
- Tắt nguồn hoặc mất kết nối → đèn tắt.
- Điện áp đặt phải nằm trong profile cho phép.
- Cường độ sáng phải được tính/ánh xạ từ điện áp và profile đèn; nếu chỉ dùng hiệu ứng sáng thì phải gắn nhãn định tính.
- Sáu chế độ tia là các mode nguồn; đường đi tia được giải từ hình học và vật quang học trên đường đi.

### 3.8. Quang học: thấu kính, lăng kính, màn chắn

Báo cáo ghi nhận sáu profile thấu kính, lăng kính góc 60°/chiết suất 1.517, vật chữ F cao 1.8 cm, ảnh thật/ảo và ray quang học 1 m.

Yêu cầu:

- Tia sáng xuất phát từ nguồn, truyền trong môi trường, giao cắt bề mặt và được khúc xạ/phản xạ theo mô hình.
- Nếu không có vật quang học trên đường đi, tia tiếp tục truyền theo môi trường hiện tại.
- Thấu kính phải dùng tiêu cự/profile tương ứng; ảnh thật/ảo và vị trí ảnh được tính từ quan hệ quang học.
- Lăng kính chỉ làm đổi hướng/tán sắc khi tia thực sự giao cắt bề mặt prism.
- Màn chắn nhận ảnh ở vị trí hình học tương ứng; nét/mờ phải phụ thuộc vị trí màn và mô hình tạo ảnh.
- Không đóng cứng góc lệch 39° cho mọi góc tới. Đây là giá trị cụ thể được báo cáo mô tả; phải kiểm tra điều kiện góc tới và chiết suất khi triển khai tổng quát.

### 3.9. Cảm ứng điện từ

Báo cáo ghi nhận nam châm di chuyển vào/ra cuộn dây làm LED đỏ/xanh và điện kế lệch hai chiều; khi nam châm đứng yên thì dòng bằng 0. Báo cáo nêu giá trị ±35 µA trong hành vi hiện tại.

Yêu cầu cải tiến:

- Chiều và độ lớn sức điện động phải phụ thuộc tốc độ biến thiên từ thông theo mô hình Faraday-Lenz.
- Để đạt định lượng cần số vòng dây, hình học cuộn dây, từ trường theo vị trí, tốc độ nam châm và đặc tính mạch/tải.
- Nếu code hiện tại trả cố định ±35 µA, phân loại là mapping/response định tính hoặc hiệu ứng hiệu chuẩn; không gọi là bộ giải định lượng đầy đủ.
- LED, điện kế và DMM phải đọc cùng trạng thái mạch, không có ba nguồn số liệu độc lập.

### 3.10. Kính hiển vi và mô hình ADN

Báo cáo ghi nhận kính hiển vi xoay mâm vật kính và quan sát tiêu bản; ADN xoay 3D với cặp bazơ bổ sung.

Yêu cầu:

- Tách thao tác quang học/phóng đại của kính hiển vi khỏi texture ảnh mẫu.
- Mô hình ADN hiện được báo cáo mô tả là mô hình 3D quan sát/xoay; không được tuyên bố có mô phỏng động lực học phân tử nếu chưa có thuật toán tương ứng.

---

## 4. Quy trình xử lý một tương tác

Mọi thao tác phải đi qua chuỗi:

1. Nhận input (pointer, drag, click, rotate, pour, switch, connect).
2. Xác định đối tượng và interface đang được thao tác.
3. Kiểm tra vùng, loại connector, trạng thái và điều kiện môi trường.
4. Kiểm tra điều kiện hợp lệ và giới hạn thiết bị.
5. Gọi mô hình khoa học/cơ học tương ứng.
6. Cập nhật authoritative state.
7. Phát sự kiện cho thiết bị liên quan và thiết bị đo.
8. Render lại mesh/UI từ state.
9. Ghi log/test trace nếu ở chế độ debug hoặc validation.

Không được cập nhật LCD, kim đo, LED hoặc mặt nước trực tiếp từ callback giao diện nếu state khoa học chưa được cập nhật.

---

## 5. Lắp ráp thiết bị: quy tắc compatibility

### 5.1. Các lớp tương thích

- **Geometric compatibility:** Kích thước, vị trí, hướng và kiểu tiếp xúc có khớp không?
- **Mechanical compatibility:** Ngàm, móc, lỗ, ray hoặc giá đỡ có đúng chuẩn không?
- **Electrical compatibility:** Điện áp, dòng, cực tính và loại terminal có phù hợp không?
- **Data compatibility:** Giao thức và chân tín hiệu có tương thích không?
- **Fluid compatibility:** Miệng nối, đường kính, áp suất và chiều dòng có hợp lệ không?
- **Optical compatibility:** Trục quang, khẩu độ, mặt quang và miền truyền có phù hợp không?
- **Functional compatibility:** Sau khi kết nối, tổ hợp có thực hiện được mục tiêu thí nghiệm không?

### 5.2. Trạng thái kết nối

`DISCONNECTED` → `CANDIDATE` → `VALIDATING` → `CONNECTED`

Trường hợp thất bại:

- `REJECTED_INCOMPATIBLE`
- `REJECTED_OUT_OF_RANGE`
- `REJECTED_WRONG_ORIENTATION`
- `REJECTED_OCCUPIED`
- `REJECTED_MISSING_POWER`

Kết nối phải có thể tháo ra và trở về `DISCONNECTED` mà không để lại state mồ côi.

### 5.3. Nguyên tắc phản hồi

Khi lắp sai, OpenLab cần chỉ rõ:

- Đang nối thiết bị nào với thiết bị nào.
- Sai khác nằm ở hình học, cơ khí, điện, dữ liệu hay chức năng.
- Điều kiện nào cần thay đổi.
- Kết nối có gây rủi ro hoặc làm sai thí nghiệm không.

Không chỉ báo “không thể kết nối”.

---

## 6. Bộ kiểm thử tương tác và kiểm thử hồi quy

| ID | Kịch bản | Kết quả mong đợi |
|---|---|---|
| INT-T01 | Đặt quả cân 200 g lên cân | Cân tăng theo profile, trong giới hạn và ĐCNN |
| INT-T02 | Bấm TARE khi vật vẫn ở trên đĩa | Offset được cập nhật; màn hình về 0 mà vật không biến mất |
| INT-T03 | Thả vật có kích thước vượt khẩu độ 28 mm vào ống đong | Từ chối, giữ vật ngoài bình và báo hướng xử lý |
| INT-T04 | Thả vật hợp lệ vào bình chứa | Volume/displacement và mặt nước cập nhật nhất quán |
| INT-T05 | Thả vật vào bình tràn đầy ngang vòi | Cốc hứng nhận đúng lượng tràn theo mô hình |
| INT-T06 | Rót từ cốc sang bình | Nguồn giảm, bình nhận tăng; tổng thể tích được bảo toàn |
| INT-T07 | Xoay van phễu chiết | Pha đáy được xả theo vị trí vòi; pha còn lại vẫn đúng lớp |
| INT-T08 | Tắt biến áp khi đèn đang sáng | Đèn tắt do mất nguồn; không chỉ đổi icon |
| INT-T09 | Đưa lăng kính ra khỏi đường tia | Tia truyền thẳng trong môi trường trước đó |
| INT-T10 | Đưa lăng kính vào đường tia | Tia được khúc xạ theo hình học và chiết suất profile |
| INT-T11 | Đưa vật F vào ngoài/trong tiêu cự | Trạng thái ảnh thật/ảo theo mô hình quang học |
| INT-T12 | Kéo nam châm vào/ra/đứng yên trong cuộn dây | Dấu và độ lớn tín hiệu theo mô hình cảm ứng; đứng yên không có suất điện động do chuyển động |
| INT-T13 | Đưa vật kính khác vào vị trí kính hiển vi | Mâm quay và mức phóng đại cập nhật thống nhất |
| INT-T14 | Kết nối hai cổng sai loại | Reject có lý do; không tạo dây/kết nối giả |
| INT-T15 | Tháo kết nối đã hợp lệ | Quan hệ connector và trạng thái liên quan được dọn sạch |

Mỗi test phải ghi input, initial state, expected state, actual state, tolerance/source và pass/fail. Khi chưa có tolerance khoa học phải đánh dấu `BLOCKED_MISSING_REFERENCE`, không tự đặt ngưỡng.

---

## 7. Những điểm phải phân loại trước khi gọi là mô phỏng định lượng

Báo cáo nguồn ghi nhận nhiều hành vi đang chạy. Tuy nhiên, không phải tất cả hành vi được mô tả đều chứng minh đã có bộ giải vật lý đầy đủ. AI phải phân loại từng tính năng:

| Tính năng | Bằng chứng trong báo cáo | Việc cần kiểm tra tiếp |
|---|---|---|
| Cân điện tử | Cộng khối lượng và tare | Kiểm tra mass source, giới hạn, làm tròn và overload |
| Bình tràn | Thể tích tràn và cốc hứng | Kiểm tra bảo toàn thể tích, trạng thái trung gian và trường hợp tràn một phần |
| Rót chất lỏng | Hàm vị trí rót và animation 1120 ms | Xác nhận volume transfer độc lập với animation |
| Gia nhiệt | Ngọn lửa làm tăng nhiệt độ | Kiểm tra mô hình năng lượng, nhiệt dung và tổn thất; nếu thiếu thì ghi định tính |
| Đèn quang học | Interlock nguồn và sáu chế độ tia | Kiểm tra điện áp/công suất có quyết định độ sáng hay chỉ là mapping |
| Lăng kính/thấu kính | Khúc xạ và tán sắc được mô tả | Kiểm tra thuật toán giao cắt, Snell, bước sóng và điều kiện hình học |
| Cảm ứng điện từ | LED/điện kế đổi chiều; ±35 µA | Kiểm tra giá trị có hardcode hay tính từ dΦ/dt và mạch tải |
| Kính hiển vi | Xoay mâm và soi tiêu bản | Kiểm tra độ phóng đại/độ phân giải có dựa trên profile quang học hay chỉ texture |
| ADN | Mô hình xoắn kép quay 3D | Phân loại là mô hình cấu trúc trực quan, không phải mô phỏng phân tử động |

**Quy tắc:** Tính năng có thể hữu ích về sư phạm dù đang ở mức định tính. Điều cấm là quảng bá/đánh dấu định lượng khi chưa có công thức, dữ liệu và kiểm định tương ứng.

---

## 8. Cấu trúc kỹ thuật và trách nhiệm module

AI phải đọc code hiện tại để xác định module thực tế; tên dưới đây là nhóm trách nhiệm logic, không phải chỉ thị tạo file trùng.

- `Placement/Docking`: xử lý vùng đặt, snap, anchor và constraint.
- `Compatibility`: kiểm tra loại đầu nối, kích thước, hướng và giới hạn.
- `Measurement`: đọc trạng thái thực từ hệ và chuyển thành số đo.
- `Fluid`: rót, nhận, displacement, overflow, phase separation.
- `Thermal`: nguồn nhiệt, truyền nhiệt, trạng thái nhiệt độ.
- `Electrical`: topology mạch, nguồn, tải, dòng/áp và liên động.
- `Optics`: ray propagation, bề mặt, khúc xạ, phản xạ và tạo ảnh.
- `Electromagnetism`: từ thông, suất điện động, dòng và thiết bị đo.
- `Biology/Visualization`: thao tác quan sát và mô hình sinh học phù hợp phạm vi.
- `Validation`: test harness, benchmark, log và regression.

Renderer chỉ đọc state đã tính. UI chỉ phát lệnh thao tác. Interaction/Solver mới là nơi xác định kết quả khoa học.

---

## 9. Điều kiện nghiệm thu Interaction Layer

- Các thao tác hiện hữu được giữ và có regression test.
- Docking dựa trên connector/anchor có định danh và compatibility.
- Tương tác có precondition, input, governing model, authoritative state và kết quả.
- Lượng chất lỏng/khối lượng/nhiệt/điện/ánh sáng được chuyển qua state contract, không chỉ qua animation.
- Sai thao tác được từ chối và giải thích.
- Các thiết bị đo đọc từ cùng trạng thái hệ.
- Các tính năng định tính được gắn nhãn đúng; không tuyên bố mức định lượng/vận hành thực nghiệm khi chưa có kiểm chứng.
- Có kiểm thử INT-T01 đến INT-T15 hoặc trạng thái blocked có lý do.

**Bổ sung nghiệm thu lắp ráp:** Mọi luồng kéo thả, docking, gá, kẹp, móc, nối và tháo thiết bị phải được nghiệm thu theo `05_ASSEMBLY_ACCEPTANCE_CRITERIA.md` (ASM-01 đến ASM-24). Không thay tiêu chí này bằng kiểm tra hình ảnh hoặc việc mesh chạm nhau.

**Nguyên tắc khóa:** Tương tác trong OpenLab phải là một chuỗi nhân quả có thể giải thích và kiểm thử, không phải chuỗi animation độc lập.
