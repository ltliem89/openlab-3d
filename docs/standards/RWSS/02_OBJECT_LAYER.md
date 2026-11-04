# RWSS v1.1 — LAYER 02: OBJECT
## Tiêu chuẩn thiết bị, linh kiện và mẫu vật trong OpenLab 3D

- **Mã tiêu chuẩn:** `RWSS-OL3D-OBJ-001`
- **Phiên bản:** 1.1
- **Phạm vi ưu tiên:** 34 archetype thiết bị/mẫu vật theo phạm vi báo cáo rà soát; chuẩn hóa catalog, hình học, thuộc tính đo lường, cổng kết nối, chức năng và trạng thái.
- **Nguồn căn cứ:** Báo cáo rà soát code OpenLab 3D do người dùng cung cấp; các file nguồn được báo cáo nêu gồm `ProceduralLabModels.ts`, `LabViewport3D.tsx`, `App.tsx`, `HtmlEquipmentModuleRegistry.ts`, `mockCatalog.ts`.

---

## 1. Mục tiêu

Object Layer định nghĩa **mỗi thiết bị là một đối tượng có danh tính, cấu tạo, thuộc tính vật lý, chức năng và interface thực**, không chỉ là một mesh 3D.

Mục tiêu của lớp này:

1. Giữ một hồ sơ chuẩn cho từng archetype/asset.
2. Tách hình học hiển thị khỏi thuộc tính khoa học và trạng thái vận hành.
3. Cho phép cùng một thiết bị được dùng trong nhiều bài thí nghiệm mà không nhân bản logic.
4. Cung cấp dữ liệu cho Environment Layer và Interaction Layer.
5. Hỗ trợ lắp ráp thiết bị bằng các cổng, mặt gá, móc, rãnh hoặc vùng tiếp xúc có định danh.
6. Phân biệt dữ liệu đã có trong code, dữ liệu được suy ra và dữ liệu còn thiếu.

**Không được viết lại catalog hoặc tạo một hệ thiết bị song song trước khi khảo sát catalog hiện tại.**

---

## 2. Danh tính và phân loại đối tượng

Mỗi thiết bị phải có các định danh phù hợp với cấu trúc hiện tại:

- `archetypeId`: loại thiết bị logic, ví dụ `electronic-balance`.
- `assetId`: ID asset trong catalog, nếu có.
- `instanceId`: ID của từng bản thể đang đặt trong scene.
- `modelId`: ID mô hình 3D hoặc procedural model.
- `profileVersion`: phiên bản hồ sơ thiết bị.

Quy tắc:

- Không tạo ID giả nếu báo cáo/code chưa cung cấp.
- Không lấy `instanceId` thay cho `archetypeId`.
- Một archetype có thể có nhiều instance, nhưng dùng chung profile gốc.
- Cấu hình riêng của một bài thực hành phải là override có kiểm soát, không sửa dữ liệu gốc của asset.

---

## 3. Hồ sơ Object bắt buộc

### 3.1. Nhóm dữ liệu nhận dạng

| Trường | Yêu cầu |
|---|---|
| `id` | ID archetype ổn định |
| `name` | Tên tiếng Việt và/hoặc tên chuẩn |
| `category` | Nhóm khoa học/nhóm thiết bị |
| `assetId` | Mã asset hiện có nếu được xác nhận |
| `sourceFiles` | Nơi định nghĩa model, catalog, hành vi |
| `evidenceStatus` | `verified`, `configured`, `derived`, `unknown` |

### 3.2. Nhóm hình học và kích thước

- `geometryType`, model/procedural builder, bounding box.
- Kích thước thực: dài, rộng, cao, đường kính, độ dày, bán kính.
- Tỷ lệ giữa các bộ phận quan trọng.
- Local origin, pivot, transform và trục thao tác.
- Các vùng collision, contact surface, sensor region và interaction handle.
- Những chi tiết nhìn thấy nhưng không có chức năng phải được đánh dấu là visual-only.

Không được tự ước lượng kích thước từ ảnh render rồi ghi thành kích thước chuẩn. Ưu tiên tài liệu thiết bị, thông số được mã nguồn khai báo hoặc dữ liệu đo.

### 3.3. Nhóm thuộc tính vật lý/khoa học

Chỉ khai báo thuộc tính liên quan đến chức năng của đối tượng:

- Khối lượng, mật độ, thể tích, trọng tâm, mômen quán tính.
- Vật liệu, độ cứng, đàn hồi, ma sát, hệ số dẫn nhiệt.
- Điện trở, điện áp định mức, dòng định mức, công suất, cực tính.
- Chiết suất, tiêu cự, độ cong, phổ hoặc đặc tính quang học.
- Dung tích, vạch chia, độ chia nhỏ nhất, giới hạn đo.
- Sinh học: cấu tạo, bộ phận, loại mẫu, độ phóng đại hoặc quan hệ cấu trúc.

Mỗi tham số phải có `value`, `unit`, `source`, `uncertainty` hoặc `unknown`. Thuộc tính không liên quan có thể là `not_applicable`.

### 3.4. Nhóm cổng kết nối và điểm thao tác

Mỗi thiết bị có thể khai báo các interface sau, tùy cấu tạo thực:

- `mechanical_ports`: móc, ngàm, lỗ, rãnh, mặt gá, ray trượt, điểm tựa.
- `electrical_ports`: VCC, GND, signal, AC/DC, cực tính, giới hạn điện áp/dòng.
- `data_ports`: I2C, SPI, UART, analog, digital hoặc giao thức có căn cứ.
- `fluid_ports`: vòi rót, vòi xả, miệng nhận, ống dẫn.
- `optical_interfaces`: mặt tới, mặt ló, trục quang, khẩu độ, mặt nhận ảnh.
- `thermal_interfaces`: bề mặt trao đổi nhiệt hoặc vùng nhận nhiệt.

Một cổng phải có vị trí, hướng, loại, giới hạn tương thích và trạng thái. Không được giả định hai đầu nối cùng màu là tương thích.

### 3.5. Nhóm trạng thái và chức năng

Tách rõ:

- `physicalState`: vị trí, hướng, vận tốc, nhiệt độ, trạng thái biến dạng nếu có.
- `functionalState`: bật/tắt, mức nguồn, chế độ đo, chế độ tia, van mở/đóng.
- `measurementState`: số đo, đơn vị, độ chia, giới hạn đo, trạng thái quá thang.
- `connectionState`: chưa kết nối, kết nối, sai kết nối, mất kết nối.
- `visualState`: trạng thái hiển thị được dẫn xuất từ state, không phải nguồn sự thật.

---

## 4. Kiểm kê đối tượng theo báo cáo OpenLab

Báo cáo nêu phạm vi tổng cộng 34 archetype. Bảng dưới đây chuẩn hóa các thiết bị/nhóm thiết bị được mô tả rõ trong báo cáo; các đối tượng khác phải được truy xuất trực tiếp từ catalog và mã nguồn trước khi tạo profile, không suy diễn từ danh sách tổng quan.

| Nhóm | Archetype / đối tượng | Dữ liệu/hành vi được báo cáo ghi nhận | Mã asset nếu có trong báo cáo |
|---|---|---|---|
| Đo khối lượng | `electronic-balance` | Load-cell raycast, cộng khối lượng, tare, LCD động; R ≤ 0.065 m; 0.1 g; giới hạn 2000 g | `OL3D-EQP-BAL-0001` |
| Đo khối lượng | `calibration-weight` | Quả cân 100/200/500 g; đặt lên cân hoặc móc lực kế | `OL3D-EQP-WGT-0001` |
| Mẫu vật | `solid-cylinder`, `solid-sphere`, `solid-block`, `hollow-cylinder` | Hình học và mật độ vật liệu; móc treo; khối lượng từ mật độ × thể tích | Báo cáo có alias `SLD`, `SPH`, `BLK`, `HLW` |
| Đo thể tích | `graduated-cylinder` | 100 ml; vạch 1 ml; mặt khum; kính lúp; mặt thoáng khi nghiêng | `OL3D-EQP-CYL-0001` |
| Đo thể tích | `overflow-can` | Ngưỡng tràn 210 ml; vòi tràn và cốc hứng | `OL3D-EQP-OVF-0001` |
| Dụng cụ thủy tinh | `beaker-250`, `erlenmeyer-flask` | Rót chuyển tiếp; nguồn giảm, bình nhận tăng; tư thế rót được tính | `OL3D-EQP-BKR-0001` cho cốc |
| Cấp nước | `water-dispenser` | Dung tích 1000 ml; cấp 15/25/50 ml hoặc 210 ml; docking khay | `OL3D-EQP-WDP-1000` |
| Hóa học/gia nhiệt | `separatory-funnel` | Hai pha lỏng không đồng tan; van PTFE; xả pha đáy | `OL3D-EQP-SEP-0001` |
| Hóa học/gia nhiệt | `distillation-flask`, `alcohol-burner` | Có mô hình bình chưng cất; đèn cồn và ngọn lửa có tác động tăng nhiệt chất lỏng | Cần đối chiếu asset ID trong catalog |
| Đo kích thước | `vernier-caliper` | 0–150 mm; ĐCNN 0.05 mm; mỏ đo và thanh đo sâu; kẹp mẫu | `OL3D-EQP-CAL-0001` |
| Lực học | `spring-dynamometer` | Thang 0–5 N; Hooke; lò xo và kim dịch chuyển; móc vật | `OL3D-EQP-DYN-0001` |
| Quan sát | `magnifying-glass` | Kính lúp 5x; cầm soi hoặc gắn giá | Cần đối chiếu asset ID trong catalog |
| Quang học | `optical-lamp` | 12 V, 21 W; sáu chế độ chùm tia; chỉ sáng khi nguồn bật | `OL3D-EQP-OLP-0001` |
| Quang học | `optical-power-supply` | 3/6/9/12 V DC; công tắc; hai cực; dây dẫn đến đèn | `OL3D-EQP-PSU-0001` |
| Quang học | `optical-lens`, `optical-lens-box` | Sáu profile: +5, +10, +15, -10, -20 cm và mặt phẳng | Báo cáo ghi alias `OPT`, `LBX` |
| Quang học | `optical-prism` | Góc đỉnh 60°; n=1.517 trong profile báo cáo; tán sắc khi tia tương tác | `OL3D-EQP-PRM-0001` |
| Quang học | `frosted-f-object`, `optical-screen` | Vật F cao 1.8 cm; ảnh thật/ảo; màn chắn lưới mm | Báo cáo ghi alias `FOB`, `SCR` |
| Quang học | `optical-bench` | Ray 100 cm; vạch mm; carriage trượt 1D; trục quang y=0.125 m trong profile được mô tả | `OL3D-EQP-OBN-0001` |
| Điện từ | `induction-coil-led` | Cuộn dây, nam châm trượt, hai LED; phản ứng theo chiều chuyển động nam châm | `OL3D-EQP-COIL-0001` |
| Đo điện | `galvanometer` | Kim ±50 µA, góc ±42°; phản ánh chiều và độ lớn dòng theo mô hình hiện có | `OL3D-EQP-GLV-0001` |
| Đo điện | `digital-multimeter` | Núm DCV/DCA/OHM, LCD hiển thị số đo mạch | Cần đối chiếu asset ID trong catalog |
| Đo nhiệt | `thermometer` | -10 đến 110°C; ĐCNN 0.5°C; cột chất lỏng thay đổi theo nhiệt độ | Cần đối chiếu asset ID trong catalog |
| Sinh học | `optical-microscope` | Vật kính 10x/40x/100x; thị kính 10x; mâm xoay và tiêu bản | `OL3D-EQP-MIC-0001` |
| Sinh học | `dna-double-helix` | Hai mạch xoắn; cặp A-T và G-X; xoay quan sát 3D | `OL3D-EQP-DNA-0001` |

**Lưu ý kiểm kê:** Báo cáo tổng quan còn nhắc giá thí nghiệm sắt, bản bán nguyệt, bát sứ và một số dụng cụ khác. Không được coi bảng trên là danh mục đầy đủ 34 archetype. AI phải trích xuất đầy đủ registry/catalog thực tế và lập bảng đối chiếu riêng.

---

## 5. Mẫu Object Profile

```yaml
object:
  archetypeId: electronic-balance
  assetId: OL3D-EQP-BAL-0001
  profileVersion: 1.0
  name:
    vi: Can dien tu ky thuat 2000 g
  category: measurement.mass
  evidenceStatus: verified

  geometry:
    modelSource: ProceduralLabModels.ts
    dimensions:
      value: documented_in_source
      unit: mm
    pivot: documented_in_source
    collisionShapes: documented_in_source
    visualOnlyParts: []

  physicalProperties:
    mass: unknown
    material:
      body: ABS
      pan: SUS304
    measurement:
      range: [0, 2000]
      unit: g
      resolution: 0.1

  interfaces:
    mechanical:
      - id: weighing-pan
        type: support_surface
        capacity: documented_or_unknown
    controls:
      - id: tare_button_3d
        type: momentary_button

  capabilities:
    - measure_mass
    - tare

  runtimeState:
    tareOffsetG: 0
    displayedMassG: 0

  validation:
    tests: [OBJ-BAL-001, OBJ-BAL-002]
    limitations: []
```

Đây là mẫu schema định hướng; AI phải giữ tên field tương thích với code hiện hành hoặc tạo adapter. Không đổi thẳng mọi catalog sang schema mới trước khi có kế hoạch migration.

---

## 6. Quy tắc hình học và tỷ lệ

1. Tất cả kích thước vật lý phải dùng đơn vị chuẩn trong data layer; UI có thể hiển thị mm, cm, ml hoặc g theo dụng cụ.
2. Tỷ lệ mesh phải được kiểm tra với kích thước profile.
3. Collision geometry phải đủ chính xác cho thao tác đang hỗ trợ, không cần đồng nhất hoàn toàn với mesh render.
4. Điểm pivot phải phản ánh thao tác: tâm quay của van, trục kim, điểm móc, vị trí chân cắm, điểm trượt.
5. Các chi tiết quan trọng với lắp ráp phải có hit area hoặc connector riêng.
6. Không dùng bounding box quá rộng làm connector; phải có vùng tương tác cụ thể.
7. Mesh chi tiết trang trí không tự động trở thành cổng kết nối.

---

## 7. Quy tắc hồ sơ cổng kết nối

Mỗi connector cần định nghĩa:

```yaml
connector:
  id: PSU_DC_POSITIVE
  kind: electrical
  subtype: dc_terminal
  polarity: positive
  nominalVoltage: 12
  voltageUnit: V
  position: source_local_coordinate
  orientation: source_local_orientation
  acceptedMates: documented_connector_types
  maxCurrent: unknown
  evidenceStatus: verified_or_unknown
```

Các connector khác có thể là:

- Cơ khí: móc, lỗ, kẹp, ray trượt, mặt đỡ.
- Điện: jack, terminal, pin header, socket.
- Chất lỏng: vòi, ống dẫn, miệng rót, đầu nhận.
- Quang học: trục quang, mặt tới, mặt ló, ngàm giữ thấu kính.

**Không suy luận tương thích chỉ từ khoảng cách gần, màu sắc hoặc tên thiết bị.** Compatibility phải dựa trên loại, kích thước, hướng, cực tính, chuẩn giao tiếp và giới hạn kỹ thuật.

---

## 8. Kiểm thử Object Layer

| ID | Kiểm thử | Điều kiện đạt |
|---|---|---|
| OBJ-T01 | Định danh | Mỗi archetype/asset/instance có ID đúng vai trò, không trùng |
| OBJ-T02 | Tỷ lệ hình học | Kích thước hiển thị khớp profile và phép đo đối chiếu |
| OBJ-T03 | Connector | Vị trí, hướng, loại và giới hạn đầu nối có thể truy vấn |
| OBJ-T04 | Thuộc tính vật lý | Các thuộc tính dùng trong phép tính có đơn vị và nguồn |
| OBJ-T05 | Runtime state | Trạng thái đo, bật/tắt, van, núm và vị trí được lưu tách khỏi visual state |
| OBJ-T06 | Reuse | Một archetype có thể tạo nhiều instance mà không chia sẻ nhầm runtime state |
| OBJ-T07 | Catalog | Asset được registry và catalog hiện hành phân giải đúng |
| OBJ-T08 | Regression | Các model và thao tác cũ không bị mất sau chuẩn hóa |

---

## 9. Các điểm phải kiểm tra kỹ trước khi nâng cấp

### 9.1. Cân điện tử

Báo cáo ghi nhận:

- Load Cell Raycast trong bán kính `R ≤ 0.065 m`.
- Khối lượng hiển thị `Σm_i - tareOffsetG`.
- ĐCNN `0.1 g`, giới hạn `0–2000 g`.
- Nút `tare_button_3d` và LCD Canvas texture động.

AI phải xác nhận mass của từng vật thể được lấy từ profile nào và đơn vị có nhất quán không.

### 9.2. Mẫu vật rắn

Báo cáo ghi nhận mật độ đồng 8.9, sắt 7.8, nhôm 2.7, gỗ 0.8 g/cm³ và kiểm tra khẩu độ ống đong 28 mm. Không được gán mật độ theo màu vật liệu; phải gắn theo profile vật liệu.

### 9.3. Dụng cụ đo

- Lực kế phải có hằng số lò xo `k` hoặc profile hiệu chuẩn; không suy ra k chỉ từ thang đo 5 N.
- Thước cặp phải duy trì ĐCNN 0.05 mm theo profile hiện có.
- Nhiệt kế phải phân biệt giá trị nhiệt độ thực của mẫu với trạng thái hiển thị cột chất lỏng.
- DMM phải đọc từ mạch điện được tính, không tự sinh số đo độc lập.

### 9.4. Quang học

- Lens profiles phải giữ dấu của tiêu cự và thông số đã khai báo.
- Prism profile có `A = 60°`, `n = 1.517` trong báo cáo; góc lệch thực phải phụ thuộc hình học tia tới và mô hình khúc xạ, không đóng cứng 39° cho mọi trường hợp.
- Đèn 12 V/21 W và nguồn 3/6/9/12 V cần giữ điều kiện liên động đã có.

### 9.5. Sinh học

- Kính hiển vi: phân biệt độ phóng đại quang học với ảnh texture minh họa.
- ADN: báo cáo mô tả mô hình xoay quan sát 3D; không được tuyên bố đã mô phỏng động lực học phân tử nếu chưa có mô hình và dữ liệu tương ứng.

---

## 10. Điều kiện nghiệm thu Object Layer

Object Layer chỉ được nghiệm thu khi:

- Catalog/registry và hồ sơ object ánh xạ được với nhau.
- Các thiết bị quan trọng có kích thước, thuộc tính, trạng thái và connector cần thiết.
- Dữ liệu đã xác minh được phân biệt với dữ liệu chưa biết.
- Các runtime state không bị trộn với mesh/material/animation.
- Có kiểm thử tỷ lệ, connector, profile và regression.
- Không phá vỡ hành vi đang chạy được ghi nhận trong báo cáo.

**Nguyên tắc khóa:** Thiết bị trong OpenLab phải là đối tượng có hồ sơ khoa học và interface thực, không phải một mô hình 3D chỉ có thể kéo thả.
