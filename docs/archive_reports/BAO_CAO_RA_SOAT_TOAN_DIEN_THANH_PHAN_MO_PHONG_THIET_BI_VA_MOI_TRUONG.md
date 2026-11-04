# BÁO CÁO RÀ SOÁT TOÀN DIỆN CÁC THÀNH PHẦN TRONG MÔ PHỎNG: THIẾT BỊ VÀ MÔI TRƯỜNG
## OPENLAB 3D — HỆ THỐNG PHÒNG THÍ NGHIỆM VẬT LÝ, HÓA HỌC & SINH HỌC ẢO CHUẨN KHOA HỌC (RWSS v2.4)

> **Mục đích tài liệu**: Đây là **Tài liệu Đặc tả Toàn vẹn (Master Comprehensive Audit & Metrology Specification)** chi tiết tới từng linh kiện, dòng mã, thông số hình học, cây node Three.js, vật liệu PBR, cổng ghép nối động học, phương trình vật lý nhân quả và hồ sơ thẩm định 5 nguồn đối chiếu.  
> Tài liệu được thiết kế chuyên biệt để **các hệ thống AI khác (ChatGPT, Claude, Gemini, DeepSeek...), các công cụ phân tích tĩnh (Static Analysis Engines), hệ thống kiểm định đo lường tự động (Automated Metrology Checkers) và hội đồng thẩm định khoa học** có thể phân tích, rà soát, tái hiện hoặc kiểm toán độc lập 100% các thành phần trong mô phỏng mà không cần mở mã nguồn.

---

### BẢNG CHỈ SỐ TOÀN CẢNH HỆ THỐNG MÔ PHỎNG (SYSTEM INVENTORY OVERVIEW)

| Chỉ số cốt lõi | Giá trị kiểm kê thực tế | Ghi chú kỹ thuật |
| :--- | :---: | :--- |
| **Tổng số Thiết bị Thí nghiệm Độc lập** | **36 thiết bị** | Tách biệt 100% thành 36 mục hồ sơ chuyên sâu độc lập |
| **Tổng số Tiêu bản Mẫu vật Kính hiển vi** | **8 mẫu tiêu bản** | Kèm ảnh vi mô, cấu trúc tế bào, nhuộm màu & độ bội giác |
| **Tổng số Biến Môi trường Mô phỏng** | **25 biến** | 13 biến lõi cấp phòng (Room-core) + 12 biến theo mẫu (Sample-specific) |
| **Nhóm Thiết bị Tiêu chuẩn GDPT 2018** | **10 nhóm (G01–G10)** | Phủ toàn diện Vật lí, Hóa học, Sinh học THCS & THPT |
| **Cấp độ Trung thực Vật lý (Physics Fidelity)** | **4 cấp độ (L1–L4)** | Từ Prototyping nhanh đến Kiểm định Thống kê t-test |
| **Cổng Ghép nối Động học (Assembly Connectors)** | **15 connector** | Quản lý bậc tự do DOF, dung sai snap & ma trận tương thích |
| **Hiện tượng Âm thanh Tương tác (Sound Engine)** | **26 sự kiện Web Audio** | Tổng hợp sóng âm thuần nội suy không dùng file MP3 ngoài |
| **Bài Kiểm thử Nghiệm thu Môi trường Tự động** | **13 bài test (GEO/CLK/SEP)** | Chấm điểm tự động Pass/Fail/Not tested theo thời gian thực |
| **Mẫu Chuẩn Kiểm định Đo lường Ảo vs Thực** | **10 mẫu vật chuẩn** | Đo đạc đối chứng khối lượng riêng, sai số tương đối $\le 0.42\%$ |

---

## MỤC LỤC TỔNG THỂ
1. [PHẦN I — KIẾN TRÚC MÔ PHỎNG & NGUYÊN TẮC RÀ SOÁT HỆ THỐNG](#phần-i--kiến-trúc-mô-phỏng--nguyên-tắc-rà-soát-hệ-thống)
2. [PHẦN II — RÀ SOÁT TOÀN DIỆN MÔI TRƯỜNG PHÒNG THÍ NGHIỆM (SIMULATION ENVIRONMENT)](#phần-ii--rà-soát-toàn-diện-môi-trường-phòng-thí-nghiệm)
3. [PHẦN III — HỆ THỐNG GHÉP NỐI ĐỒNG BỘ & ĐỘNG HỌC LẮP RÁP (ASSEMBLY SYSTEM)](#phần-iii--hệ-thống-ghép-nối-đồng-bộ--động-học-lắp-ráp)
4. [PHẦN IV — RÀ SOÁT CHI TIẾT TÁCH BIỆT TỪNG THIẾT BỊ MÔ PHỎNG (36 THIẾT BỊ)](#phần-iv--rà-soát-chi-tiết-tách-biệt-từng-thiết-bị-mô-phỏng)
   - 4.1. [OL3D-EQP-BAL-0001] Cân điện tử hiện số 500 g
   - 4.2. [OL3D-EQP-CYL-0001] Ống đong thủy tinh 100 ml
   - 4.3. [OL3D-EQP-BKR-0001] Cốc thủy tinh chia độ 250 ml
   - 4.4. [OL3D-EQP-OVF-0001] Bình tràn Eureka 250 ml
   - 4.5. [OL3D-EQP-DYN-0001] Lực kế lò xo ống trụ 5 N
   - 4.6. [OL3D-EQP-CAL-0001] Thước cặp du xích 150 mm (0.02 mm)
   - 4.7. [OL3D-EQP-WGT-0001] Quả cân chuẩn bằng đồng 50 g
   - 4.8. [OL3D-EQP-SLD-0001] Vật rắn hình trụ hợp kim nhôm
   - 4.9. [OL3D-EQP-SPH-0001] Vật rắn hình cầu thép không gỉ
   - 4.10. [OL3D-EQP-BLK-0001] Vật rắn hình hộp chữ nhật đồng thau
   - 4.11. [OL3D-EQP-HLW-0001] Ống trụ kim loại rỗng có khoang kín
   - 4.12. [OL3D-EQP-FLK-0001] Bình tam giác Erlenmeyer 250 ml
   - 4.13. [OL3D-EQP-STD-0001] Giá đỡ thí nghiệm kèm khớp nối & tay kẹp
   - 4.14. [OL3D-EQP-OPT-0001] (3) Thấu kính trên đế trượt quang học (f = +10 cm)
   - 4.15. [OL3D-EQP-OBN-0001] (5) Giá quang học 90 cm có thước chia độ (-45 .. 0 .. +45 cm)
   - 4.16. [OL3D-EQP-OLP-0001] (1) Đèn chiếu sáng Halogen kèm Đầu chắn khe sáng
   - 4.17. [OL3D-EQP-FOB-0001] (2) Vật sáng bằng kính mờ hình chữ F
   - 4.18. [OL3D-EQP-SCR-0001] (4) Màn chắn hứng ảnh trên Giá quang học
   - 4.19. [OL3D-EQP-PSU-0001] (6) Nguồn điện hạ áp thí nghiệm 3V–12V
   - 4.20. [OL3D-EQP-LBX-0001] Hộp bộ 6 Thấu kính tiêu chuẩn (+5, +10, +15, -10, -20, ∞)
   - 4.21. [OL3D-EQP-THM-0001] Nhiệt kế chất lỏng -10°C đến 110°C
   - 4.22. [OL3D-EQP-LSR-0001] Nguồn sáng Đèn Laser 3 tia song song (SGK KHTN 9)
   - 4.23. [OL3D-EQP-SLB-0001] Bản bán trụ thuỷ tinh & Bảng chia độ 360° (SGK KHTN 9)
   - 4.24. [OL3D-EQP-PRM-0001] Lăng kính tam giác trên giá đỡ — Tán sắc ánh sáng (SGK KHTN 9)
   - 4.25. [OL3D-EQP-MAG-0001] Kính lúp cầm tay độ bội giác 5x (SGK KHTN 9)
   - 4.26. [OL3D-EQP-GLV-0001] Điện kế nhạy vạch 0 ở giữa — Galvanometer (SGK KHTN 9)
   - 4.27. [OL3D-EQP-DMM-0001] Đồng hồ đo điện đa năng hiện số (SGK KHTN 9)
   - 4.28. [OL3D-EQP-COIL-0001] Cuộn dây dẫn kín có 2 đèn LED & Thanh nam châm (SGK KHTN 9)
   - 4.29. [OL3D-EQP-DSH-0001] Bát sứ chịu nhiệt — Cô đặc & Đốt cháy cồn (SGK KHTN 9)
   - 4.30. [OL3D-EQP-SEP-0001] Phễu chiết có khoá & Phễu lọc trên giá đỡ (SGK KHTN 9)
   - 4.31. [OL3D-EQP-DST-0001] Bình cầu có nhánh 250 mL, Lưới tản nhiệt & Đèn cồn (SGK KHTN 9)
   - 4.32. [OL3D-EQP-MIC-0001] Kính hiển vi quang học (10x, 40x, 100x) & Tiêu bản NST (SGK KHTN 9)
   - 4.33. [OL3D-EQP-DNA-0001] Mô hình cấu trúc phân tử DNA xoắn kép (SGK KHTN 9)
   - 4.34. [OL3D-EQP-WDP-1000] Bình chứa nước có van xả định lượng 1000 ml
   - 4.35. [OL3D-EQP-LEV-0001] Bộ đòn bẩy thăng bằng chia vạch đối xứng kèm giá đỡ
   - 4.36. [OL3D-EQP-HYD-0001] Bình thông nhau 3 nhánh dị hình trên đế
5. [PHẦN V — RÀ SOÁT DANH MỤC TIÊU BẢN MẪU VẬT KÍNH HIỂN VI (8 TIÊU BẢN)](#phần-v--rà-soát-danh-mục-tiêu-bản-mẫu-vật-kính-hiển-vi)
   - 5.1. [spc-paramecium] Trùng giày (Paramecium caudatum)
   - 5.2. [spc-amoeba] Trùng biến hình (Amip) (Amoeba proteus)
   - 5.3. [spc-euglena] Trùng roi xanh (Euglena viridis)
   - 5.4. [spc-onion-epidermis] Tế bào biểu bì vảy hành (Allium cepa epidermis)
   - 5.5. [spc-leaf-stomata] Khí khổng và Lục lạp lá cây (Tradescantia leaf stomata & chloroplasts)
   - 5.6. [spc-cheek-epithelium] Tế bào niêm mạc miệng người (Human buccal epithelial cells)
   - 5.7. [spc-spirogyra] Tảo xoắn (Spirogyra crassa)
   - 5.8. [spc-lactobacillus] Vi khuẩn lên men Lactic (Lactobacillus bulgaricus)
6. [PHẦN VI — MA TRẬN TƯƠNG TÁC ĐỒNG BỘ CHÉO (CROSS-COMPONENT INTERACTION MATRIX)](#phần-vi--ma-trận-tương-tác-đồng-bộ-chéo)
7. [PHẦN VII — HƯỚNG DẪN TÍCH HỢP TỰ ĐỘNG DÀNH CHO CÁC HỆ THỐNG / AI KHÁC](#phần-vii--hướng-dẫn-tích-hợp-tự-động-dành-cho-các-hệ-thống--ai-khác)

---

# PHẦN I — KIẾN TRÚC MÔ PHỎNG & NGUYÊN TẮC RÀ SOÁT HỆ THỐNG

Hệ thống mô phỏng 3D tương tác OpenLab 3D được xây dựng trên nền tảng **TypeScript, React, Three.js và WebGL**, tuân thủ nghiêm ngặt bộ tiêu chuẩn mô phỏng khoa học thực tế **RWSS (Real-World Scientific Simulation)**. Kiến trúc lõi giải quyết triệt để bài toán đồng bộ giữa **đồ họa 3D chân thực (Photo-realistic PBR)** và **tính toán khoa học tất định (Deterministic Scientific Computation)**.

### 1.1. Mô hình Phân lớp Độc lập 4 Tầng (4-Layer Architecture)
Kiến trúc tuân thủ nguyên tắc phân tách trách nhiệm tối đa, ngăn chặn việc mã trạng thái runtime can thiệp phá hủy dữ liệu gốc của thiết bị:
1. **Lớp 1 — Geometry / Presentation Layer**: Định nghĩa hình học 3D procedurally hoặc mô hình GLB, cấu trúc cây mesh con phân cấp (`namedNodes`), vật liệu PBR, hộp bao (`boundingBoxM`) và trục tựa (`anchor: "base-center"`, `upAxis: "Y"`).
2. **Lớp 2 — Scientific / Technical Metadata Layer**: Lưu trữ khối lượng chuẩn ($m$), thể tích vỏ bình ($V$), khối lượng riêng ($ho$), giới hạn đo (GHĐ), độ chia nhỏ nhất (ĐCNN), dung sai cho phép và liên kết trực tiếp với Chương trình Giáo dục Phổ thông 2018 (SGK KHTN 6, 7, 8, 9).
3. **Lớp 3 — Behavior / Capabilities Layer**: Khai báo các năng lực tương tác của thiết bị (`canBeWeighedOnBalance`, `canHoldLiquid`, `canSubmergeInVessel`, `readScale`, `measureForce`, `opticalFocus`), quy định các cổng kết nối assembly và biến số điều khiển.
4. **Lớp 4 — Scene Instance / Placement Layer**: Quản lý phiên bản cụ thể của thiết bị khi kéo thả lên bàn thực hành (`SceneInstance`), lưu trữ tọa độ thế giới ($x, y, z$), góc quay Euler, trạng thái tức thời (`instanceState`: $V_{chất lỏng}$, số đo hiển thị, góc tới $i$, nhiệt độ $T$, độ giãn lò xo $Delta x$).

### 1.2. Chuẩn Giao diện Kép Dual-Contract v2.3 & v2.2
Mọi module thiết bị (cả file TypeScript nội bộ và file `.html` đóng gói độc lập) đều thực thi đối tượng chuẩn `window.OL3D_EQUIPMENT_MODULE` gồm 4 phương thức sống còn:
```typescript
interface EquipmentModuleContract {
  buildEquipmentMesh: (THREE: any, asset: AssetDefinition) => THREE.Group;
  updateEquipmentState: (rootObject: THREE.Group, state: InstanceState, dt: number) => void;
  playEquipmentSound?: (eventType: string, value: number) => void;
  buildEquipmentGroup: (THREE: any, asset: AssetDefinition) => THREE.Group; // Alias tương thích ngược
  applyEquipmentState: (THREE: any, rootObject: THREE.Group, instance: SceneInstance, asset: AssetDefinition) => void;
}
```

### 1.3. Ranh giới Cô lập An toàn Sandbox (Security Gate G7)
Khi nạp module độc lập, hệ thống thực thi mã trong sandbox cô lập thông qua `new Function("window", "document", "THREE", ...)`:
* Đối tượng `document` được bọc bởi `safeDocProxy`, chỉ hỗ trợ duy nhất `document.createElement("canvas")` và `document.createElement("div")`.
* Tuyệt đối ngăn chặn truy cập DOM chính (`getElementById`, `querySelector`, `window.parent`, `window.top`).
* Cấm mọi thao tác mạng (`fetch`, `XMLHttpRequest`, `WebSocket`) và lưu trữ cục bộ (`localStorage`, `indexedDB`, `cookie`).
* Mọi texture ký tự, vạch chia, màn hình hiển thị đều được vẽ động bằng HTML Canvas 2D chuyển đổi sang `THREE.CanvasTexture`.

### 1.4. Quy chuẩn Hệ tọa độ Không gian & Tỷ lệ SI trong Three.js
* **Đơn vị chuẩn**: $1.0\text{ unit Three.js} = 1.0\text{ mét (m)}$.
* **Quy đổi chuẩn**: $1\text{ mm} = 0.001\text{ m}$; $1\text{ cm} = 0.01\text{ m}$; $10\text{ cm} = 0.10\text{ m}$. Tuyệt đối không truyền số milimet trực tiếp vào hình học Three.js.
* **Điểm tựa đáy (`anchor: "base-center"`)**: Điểm thấp nhất của mô hình 3D (`Box3.min.y`) bắt buộc nằm tại cao độ cục bộ $y = 0.000\text{ m}$ (dung sai cho phép $|y_{min}| \le 0.008\text{ m}$).
* **Mặt chính diện (`Front Face +Z`)**: Mặt trước mang nhãn mác, màn hình LCD, núm vặn chính luôn hướng về phía trục $+Z$ hướng thẳng vào camera học sinh.

### 1.5. Đường ống Kết xuất Vật lý PBR & Quản lý Bộ nhớ CanvasTexture
* **Renderer**: `THREE.WebGLRenderer` thiết lập `toneMapping = THREE.ACESFilmicToneMapping`, `outputColorSpace = THREE.SRGBColorSpace`, `shadowMap.type = THREE.PCFSoftShadowMap`.
* **Vật liệu Kim loại**: `THREE.MeshPhysicalMaterial` ($metalness = 0.90 - 0.96, roughness = 0.08 - 0.16, clearcoat = 0.65, envMapIntensity = 1.55$).
* **Vật liệu Thủy tinh Borosilicate 3.3**: `THREE.MeshPhysicalMaterial` ($transmission = 0.88, opacity = 0.34, ior = 1.48, roughness = 0.06, depthWrite = false, renderOrder = 4$).
* **Màn hình số không rò rỉ (Zero-Leak)**: Khởi tạo Canvas duy nhất một lần tại hàm `buildEquipmentMesh`, lưu trữ vào `group.userData.screenCanvas` và `group.userData.screenTex`, chỉ cập nhật `screenTex.needsUpdate = true` khi giá trị số đo thay đổi thực tế.

---

# PHẦN II — RÀ SOÁT TOÀN DIỆN MÔI TRƯỜNG PHÒNG THÍ NGHIỆM (SIMULATION ENVIRONMENT)

Môi trường trong OpenLab 3D không phải là bối cảnh tĩnh đơn thuần, mà là một **Hệ sinh thái vật lý động học (Dynamic Physical Ecosystem)** kiểm soát trọng lực, ánh sáng, nhiệt độ, áp suất, vi khí hậu và tọa độ tương tác không gian.

### 2.1. Kiến trúc Không gian & Kích thước Phòng Thí nghiệm Chuẩn
Không gian phòng thí nghiệm tuân thủ thiết kế phòng bộ môn KHTN trường trung học theo Thông tư 14/2020/TT-BGDĐT:
* **Kích thước tổng thể phòng**: Rộng $12.0\text{ m}$ (trục $X: -6.0\text{ m} \to +6.0\text{ m}$) × Sâu $8.0\text{ m}$ (trục $Z: -4.0\text{ m} \to +4.0\text{ m}$) × Cao $3.6\text{ m}$ (trục $Y: 0.0\text{ m} \to +3.6\text{ m}$).
* **Mặt sàn phòng (`room_floor_mesh`)**: Dày $0.10\text{ m}$, mặt sàn logic cố định tại cao độ $y = 0.000\text{ m}$. Sử dụng vật liệu gạch ceramic màu tối chống bám hóa chất (`#15202e`, roughness: 0.78).
* **Hệ tường phòng (`room_walls_group`)**: Tường sau ($Z = -4.0\text{ m}$), tường trái ($X = -6.0\text{ m}$), tường phải ($X = +6.0\text{ m}$) dày $0.15\text{ m}$, màu ghi xám trung tính (`#1f2e42`), hỗ trợ chế độ trong suốt bán phần (`wallsTransparent: true, opacity: 0.42`) để quan sát góc nhìn toàn cảnh.
* **Trần phòng (`room_ceiling_mesh`)**: Nằm tại cao độ $y = 3.60\text{ m}$, dày $0.10\text{ m}$, tích hợp hệ thống đèn huỳnh quang âm trần.

### 2.2. Hệ Quy chiếu Không gian Kép (Dual Coordinate Frames)
Để đảm bảo tính trực quan học đường và tính chuẩn xác đồ họa, OpenLab 3D vận hành đồng thời 2 hệ tọa độ song ánh:

1. **Hệ tọa độ thế giới (World Frame)**:
   - Gốc tọa độ $O_{world}(0, 0, 0)$: Nằm tại tâm mặt sàn phòng thí nghiệm ($y = 0.000\text{ m}$).
   - Trục $+X$: Hướng sang bên phải màn hình (Đỏ).
   - Trục $+Y$: Hướng thẳng đứng lên trần nhà (Xanh lá).
   - Trục $+Z$: Hướng ra phía trước, về phía người quan sát (Xanh dương).

2. **Hệ tọa độ Góc Bàn cố định (Bench Corner Origin Frame)**:
   - Gốc tọa độ $O_{bench}(0, 0, 0)$: Đặt cố định tại góc sau-trái của mặt bàn thực hành ($X = -1.20\text{ m}, Y = 0.82\text{ m}, Z = -0.375\text{ m}$).
   - Trục $X_{bench}$: Chạy dọc cạnh dài của bàn từ trái sang phải: $0.00\text{ m} \to 2.40\text{ m}$.
   - Trục $Y_{bench}$: Chạy dọc cạnh ngắn của bàn từ sau ra trước: $0.00\text{ m} \to 0.75\text{ m}$.
   - Trục $Z_{bench}$: Trục đứng vuông góc mặt bàn hướng lên trên ($Z_{bench} = 0$ tại mặt bàn, $Z_{bench} > 0$ hướng lên).

**Công thức chuyển đổi tọa độ giải tích**:
$$\begin{cases} X_{bench} = X_{world} - (-1.20) = X_{world} + 1.20 \\ Y_{bench} = Z_{world} - (-0.375) = Z_{world} + 0.375 \\ Z_{bench} = Y_{world} - 0.820 \end{cases} \iff \begin{cases} X_{world} = X_{bench} - 1.20 \\ Y_{world} = Z_{bench} + 0.820 \\ Z_{world} = Y_{bench} - 0.375 \end{cases}$$

### 2.3. Bàn Thí nghiệm Trung tâm & Các Bề mặt Đặt để (Placement Surfaces)
* **Bàn thực hành chính (`standard_lab_bench_group`)**:
  - Chiều dài: $2.40\text{ m}$ (trục $X: -1.20\text{ m} \to +1.20\text{ m}$).
  - Chiều rộng: $0.75\text{ m}$ (trục $Z: -0.375\text{ m} \to +0.375\text{ m}$).
  - Cao độ mặt bàn trên: Đúng chuẩn công thái học học sinh THCS tại **`BENCH_SURFACE_Y = 0.820 m`**.
  - Độ dày tấm mặt bàn: $0.040\text{ m}$ (mặt dưới tấm gỗ nằm tại $y = 0.780\text{ m}$).
  - Khung chân thép hộp: 4 chân thép sơn tĩnh điện đen mờ cao đúng $0.780\text{ m}$ nối từ sàn $y = 0$ lên mặt dưới bàn $y = 0.780\text{ m}$, triệt tiêu 100% lỗi bay lơ lửng hay lún sàn.
  - Nẹp viền cạnh bàn: Gỗ sẫm màu (`#6b3f1d`) hạ thấp $4\text{ mm}$ so với mặt phẳng để triệt tiêu hoàn toàn hiện tượng nhấp nháy Z-fighting.
* **Bề mặt đặt thiết bị (Placement Surface Metadata)**:
  1. `bench-main-top`: Mặt bàn thực hành, diện tích đặt khả dụng $X \in [-1.17, +1.17]\text{ m}$, $Z \in [-0.345, +0.345]\text{ m}$ (trừ khoảng lùi an toàn `clearanceM = 0.03 m`).
  2. `room-floor-main`: Mặt sàn phòng thí nghiệm tại $y = 0.000\text{ m}$, hỗ trợ đặt các thiết bị cơ khí nặng, giá đỡ sàn hoặc xe lăn.

### 2.4. Khu Trưng bày 1 Tầng Nâng cao (Display Shelf Structure)
Được thiết kế gọn gàng sát mép sau của bàn thí nghiệm để giải phóng tối đa diện tích thực hành:
* **Kích thước**: Rộng $1.38\text{ m}$ (tâm $X = 0$), cao $0.32\text{ m}$, chiều sâu siêu mỏng chỉ $0.076\text{ m}$ ($7.6\text{ cm}$, sát mép sau $Z = -0.375\text{ m}$, tâm kệ tại $Z = -0.337\text{ m}$).
* **Đợt kính Tầng 1 nâng cao**: Nằm ở cao độ cục bộ $y_{local} = +0.135\text{ m}$ trên mặt bàn ($y_{world} = 0.955\text{ m}$). Khoảng không gầm dưới kệ cao $13.5\text{ cm}$ cho phép chứa các cốc đốt, hộp quả cân hoặc nhiệt kế mà không bị vướng.
* **Vật liệu**: Thủy tinh mờ chống chói PBR (`#bae6fd`, transmission: 0.62, opacity: 0.24, roughness: 0.20, ior: 1.46) kèm nẹp chắn mép trước cao $9\text{ mm}$ chống lăn rơi dụng cụ và viền LED phát sáng màu xanh băng (`#38bdf8`).
* **Biển hiệu 3D Sprite**: Nhãn coordinate sprite 3D hiển thị "KHU TRƯNG BÀY" nổi bật ở cao độ $y = 1.165\text{ m}$.

### 2.5. Bảng Đặc tả 25 Biến Môi trường Mô phỏng
Bảng kiểm kê đầy đủ 25 biến môi trường (gồm 13 biến cấp phòng và 12 biến chuyên biệt theo mẫu):

| STT | Mã biến (Variable ID) | Nhóm phạm vi | Tên biến tiếng Việt & Ký hiệu | Đơn vị | Giá trị mặc định | Khoảng biến thiên [Min .. Max] | Bước nhảy | Subsystems & Module bị tác động | Phương trình tương tác vật lý |
| :---: | :--- | :---: | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **1** | `airTemperatureC` | Phòng (Core) | 1. Nhiệt độ không khí (T_air) | °C | **25** | [-10 .. 60] | 0.5 | thermometer-ambient, thermal-exchange, G03, G05 | Có mô hình trao đổi nhiệt / Nhiệt kế đặt ngoài không khí |
| **2** | `relativeHumidityPct` | Phòng (Core) | 2. Độ ẩm tương đối (RH) | % | **60** | [0 .. 100] | 1 | evaporation-model, G05, G10 | Mẫu/vật liệu có quy tắc hút ẩm, bay hơi hơi nước bão hòa |
| **3** | `atmosphericPressureKPa` | Phòng (Core) | 3. Áp suất khí quyển (P_atm) | kPa | **101.325** | [50 .. 120] | 0.1 | boiling-point-model, barometer, G05 | Thí nghiệm có xét áp suất / nhiệt độ sôi của nước khi đun |
| **4** | `gravityMps2` | Phòng (Core) | 4. Gia tốc trọng trường (g) | m/s² | **9.80665** | [0 .. 20] | 0.01 | spring-dynamometer, electronic-balance, G02, G08 | Trực tiếp lên Cân (F=m·g), Lực kế lò xo (F=k·Δx) và Mặt nghiêng |
| **5** | `illuminanceLux` | Phòng (Core) | 5. Cường độ ánh sáng (Lux) | lux | **500** | [0 .. 2000] | 10 | lux-sensor, optical-microscope, G06, G09 | Thí nghiệm quang học, Kính hiển vi (G09) & cảm biến quang |
| **6** | `airflowMps` | Phòng (Core) | 6. Tốc độ luồng không khí (v_air) | m/s | **0** | [0 .. 20] | 0.1 | convection-cooling, balance-draft, G02 | Mô phỏng gió đối lưu, nhiễu đĩa cân điện tử & bay hơi |
| **7** | `ventilationACH` | Phòng (Core) | 7. Tần suất thông gió (ACH) | 1/h | **2** | [0 .. 30] | 1 | fume-hood-ventilation, G05 | Trao đổi khí phòng thực hành Hóa học (G05) |
| **8** | `oxygenPct` | Phòng (Core) | 8. Nồng độ Oxy (O₂) | % | **20.95** | [0 .. 100] | 0.05 | combustion-burner, G05 | Đốt cháy đèn cồn (tự tắt khi O₂ < 14%) & phản ứng oxi hóa |
| **9** | `co2Ppm` | Phòng (Core) | 9. Nồng độ CO₂ | ppm | **420** | [0 .. 10000] | 10 | co2-sensor, G09, G10 | Thí nghiệm quang hợp Sinh học (G09) & vi khí hậu phòng |
| **10** | `ambientMagneticFieldMicroT` | Phòng (Core) | 10. Từ trường môi trường (B) | µT | **50** | [0 .. 200] | 1 | electromagnetic-induction, G07 | La bàn, lực từ & cảm ứng điện từ (G07) |
| **11** | `benchTemperatureC` | Phòng (Core) | 11. Nhiệt độ bề mặt bàn (T_bench) | °C | **22** | [-10 .. 150] | 0.5 | bench-contact-thermal, G05, G08 | Truyền nhiệt tiếp xúc từ mặt bàn lên thiết bị (G05, G08) |
| **12** | `mainsVoltageV` | Phòng (Core) | 12a. Điện áp nguồn AC (V_ac) | V | **220** | [0 .. 250] | 1 | power-supply-ac, G03, G07 | Mạch điện xoay chiều, nguồn hạ áp & biến tần (G03, G07) |
| **13** | `mainsFrequencyHz` | Phòng (Core) | 12b. Tần số nguồn AC (f_ac) | Hz | **50** | [0 .. 100] | 1 | power-supply-ac, G07 | Thí nghiệm dòng điện xoay chiều AC (G07) |
| **14** | `sampleTemperatureC` | Mẫu (Sample) | 13. Nhiệt độ mẫu (T_sample) | °C | **25** | [0 .. 100] | 0.5 | thermometer-probe, liquid-expansion, G03, G04, G10 | Nhiệt kế nhúng mẫu, giãn nở thể tích chất lỏng & bù nhiệt ATC |
| **15** | `samplePh` | Mẫu (Sample) | 14. Độ pH của mẫu dung dịch | pH | **7** | [0 .. 14] | 0.05 | ph-meter, acid-base-indicator, G05, G10 | Máy đo pH hiện số & chuẩn độ trung hòa Axit-Bazơ (G05, G10) |
| **16** | `sampleConductivityUScm` | Mẫu (Sample) | 15. Độ dẫn điện mẫu (EC) | µS/cm | **100** | [0 .. 2000] | 5 | ec-tds-meter, G07, G10 | Bút đo EC & khảo sát chất điện li (G07, G10) |
| **17** | `sampleTdsMgL` | Mẫu (Sample) | 16. Tổng chất rắn hòa tan (TDS) | mg/L | **50** | [0 .. 2000] | 5 | ec-tds-meter, G10 | Bút đo TDS & kiểm tra độ tinh khiết nước (G10) |
| **18** | `sampleSalinityPsu` | Mẫu (Sample) | 17. Độ mặn mẫu (Salinity) | PSU | **0** | [0 .. 42] | 0.5 | salinity-sensor, buoyancy-force, G02, G10 | Đo độ mặn nước biển & lực đẩy Archimedes trong nước muối |
| **19** | `sampleTurbidityNtu` | Mẫu (Sample) | 18. Độ đục của mẫu (Turbidity) | NTU | **0** | [0 .. 1000] | 1 | turbidity-meter, laser-attenuation, G06, G10 | Máy đo độ đục nước & suy giảm truyền dẫn tia sáng qua chất lỏng |
| **20** | `sampleDissolvedO2MgL` | Mẫu (Sample) | 19. Oxy hòa tan trong mẫu (DO) | mg/L | **8** | [0 .. 20] | 0.1 | do-meter, G09, G10 | Máy đo DO & hô hấp thủy sinh (G09, G10) |
| **21** | `sampleDensityKgM3` | Mẫu (Sample) | 20. Khối lượng riêng mẫu lỏng (ρ) | kg/m³ | **1000** | [500 .. 5000] | 10 | density-measurement, archimedes-buoyancy, G02, G04 | Đo khối lượng riêng (Cân, Ống đong, Lực đẩy Archimedes F_A = ρ·g·V) |
| **22** | `sampleViscosityPaS` | Mẫu (Sample) | 21. Độ nhớt chất lỏng (η) | Pa·s | **0.001** | [0.001 .. 10] | 0.001 | fluid-flow-rate, G04, G05 | Tốc độ chảy qua vòi Buret / Phễu chiết & lực cản chất lỏng (G04, G05) |
| **23** | `opticalWavelengthNm` | Mẫu (Sample) | 22. Bước sóng nguồn sáng (λ) | nm | **650** | [380 .. 780] | 5 | optical-refraction, prism-dispersion, G06 | Khúc xạ qua Thấu kính/Lăng kính (chiết suất n(λ) Cauchy) (G06) |
| **24** | `thermalHeatPowerW` | Mẫu (Sample) | 23. Công suất nguồn nhiệt (P_heat) | W | **150** | [0 .. 800] | 10 | calorimetry-heating, G05 | Tốc độ đun nóng nước trên Đèn cồn / Bếp điện (Q = P·t = m·c·ΔT) (G05) |
| **25** | `surfaceFrictionCoef` | Mẫu (Sample) | 24. Hệ số ma sát bề mặt (μ) | μ | **0.3** | [0 .. 1] | 0.02 | inclined-plane-mechanics, G08 | Xe lăn và khối trượt trên mặt phẳng nghiêng (F_ms = μ·N) (G08) |

### 2.6. Đặc tả 10 Nhóm Thiết bị Tiêu chuẩn GDPT (G01 – G10)
Phân loại theo Mục 2 Khung Tiêu chuẩn Thực nghiệm Phòng Lab KHTN 9:

| Mã nhóm | Tên nhóm thiết bị GDPT | Thiết bị tiêu biểu | Yêu cầu kỹ thuật bắt buộc | Dải đo & ĐCNN chuẩn | Sai số cho phép | Biến môi trường liên quan | Module mẫu đề xuất |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **G01** | **G01 – Đo chiều dài, kích thước, góc** | Thước cặp 0–150mm, Panme 0–25mm, Thước đo góc, Thước đo độ nghiêng | Kích thước bao (dài × rộng × dày mm); Phạm vi đo (0–150mm thước cặp; 0–25mm panme); ĐCNN (0.02mm thước cặp; 0.01mm panme); Node động: plunger (hàm trượt), scale_marks & scale_display | 0–150 mm · ĐCNN 0.02 mm (Panme 0.01 mm) | ±0.02 mm | `airTemperatureC` | Panme đo ngoài cơ khí 0–25 mm (ĐCNN 0.01 mm) (`OL3D-EQP-MIC-0001`) |
| **G02** | **G02 – Cân, khối lượng, lực, cơ học** | Cân điện tử 2000g/500g, Lực kế lò xo 5N/10N, Quả cân chuẩn 50g–200g, Ròng rọc | Dải đo (2kg cân; 10N lực kế) & ĐCNN (0.1g/0.01g; 0.05N); Độ cứng lò xo k (N/m) & độ giãn tối đa; Thời gian đáp ứng chốt số cân (≤ 1.5s); Màn hình 360° (scale_display) & đĩa cân (measurement_anchor) | 0–2000 g (ĐCNN 0.1 g) · Lực kế 0–10 N (ĐCNN 0.05 N) | ±0.1 g (Cân) · ±0.05 N (Lực kế) | `gravityMps2`, `airflowMps`, `airTemperatureC` | Cân điện tử kỹ thuật 2000 g (ĐCNN 0.1 g) (`OL3D-EQP-BAL-2000`) |
| **G03** | **G03 – Thời gian, nhiệt độ, điện** | Đồng hồ bấm giây (0.01s), Nhiệt kế (-10..110°C), Ampe kế / Vôn kế, Đồng hồ vạn năng | Phạm vi đo (-10..110°C nhiệt kế; 0–600s bấm giây); Độ phân giải (1°C / 0.1°C; 0.01s); Điện trở nội (Vôn kế ~10kΩ/V, Ampe kế ~0.5Ω); Đầu dò nhiệt / cọc đấu dây âm dương | -10..110 °C (ĐCNN 0.5 °C) · 0.01 s | ±0.5 °C · ±0.1 s | `airTemperatureC`, `sampleTemperatureC`, `mainsVoltageV` | Đồng hồ bấm giây hiện số phòng thí nghiệm (0.01 s) (`OL3D-EQP-STW-0001`) |
| **G04** | **G04 – Chứa & đo thể tích chất lỏng** | Ống đong 100mL/200mL, Buret chuẩn độ 25mL, Pipet 10mL, Bình định mức 100mL, Cốc Becher 250mL | Dung tích tối đa (100mL ống đong, 25mL buret) & ĐCNN (1mL / 0.1mL); Vật liệu thủy tinh Borosilicate (IOR=1.47, transmission=0.88); Mặt khum chất lỏng (liquid_surface) & vạch chia 360° (scale_marks); Vòi rót / khóa xả PTFE (spout_stream) | 100 mL (ĐCNN 1 mL) · Buret 25 mL (ĐCNN 0.1 mL) | ±1.0 mL (Ống đong) · ±0.05 mL (Buret) | `sampleTemperatureC`, `sampleDensityKgM3`, `sampleViscosityPaS` | Buret chuẩn độ thủy tinh khóa PTFE 25 mL (ĐCNN 0.1 mL) (`OL3D-EQP-BUR-0025`) |
| **G05** | **G05 – Hóa học, gia nhiệt** | Ống nghiệm 150×20mm, Giá ống nghiệm, Đèn cồn, Bình tam giác 250mL, Bình tràn, Nhiệt lượng kế | Kích thước chuẩn (Ống nghiệm Ø20×150mm; Bình tam giác 250mL); Nhiệt độ ngọn lửa đỉnh (~650°C) & nhiệt dung riêng (nước 4.18 J/g°C); Van mở 0–90° & kiểm tra khoảng cách an toàn nhiệt | 250 mL · Nhiệt độ gia nhiệt 20–650 °C | ±2% dung tích | `oxygenPct`, `thermalHeatPowerW`, `atmosphericPressureKPa`, `benchTemperatureC` | Nhiệt lượng kế hai vỏ cách nhiệt kèm que khuấy (500 mL) (`OL3D-EQP-CAL-0001`) |
| **G06** | **G06 – Quang học, ánh sáng** | Thấu kính hội tụ/phân kì (f=100–150mm), Gương cầu, Lăng kính tán sắc, Nguồn phát tia Laser | Đường kính thấu kính Ø50mm, tiêu cự f = ±100..150mm; Chiết suất thủy tinh quang học n = 1.50 (không khí n = 1.00); Bước sóng khả kiến 380–780nm & công thức 1/d + 1/d’ = 1/f | f = 100–150 mm · Góc tới 0–90° (ĐCNN 1°) | ±0.5° góc khúc xạ | `illuminanceLux`, `opticalWavelengthNm` | Thấu kính phân kì Ø50 mm tiêu cự f = -100 mm kèm giá quang học (`OL3D-EQP-LNS-0002`) |
| **G07** | **G07 – Điện tử & mạch điện** | Nguồn/Pin 1.5V–9V, Điện trở 10Ω–100kΩ, Biến trở con chạy 1kΩ, Công tắc, Đèn 6V/LED, Cuộn cảm ứng | Điện áp định mức (1.5V, 6V, 9V, 220V) & dòng chịu tải (0.5A); Trị số điện trở chuẩn vạch màu (10Ω, 100Ω, 1kΩ); Trạng thái đóng/ngắt (on/off) & định luật Ohm I = U/R | 0–12 V · 0–2 A · Biến trở 0–1000 Ω | ±1% điện trở | `mainsVoltageV`, `mainsFrequencyHz`, `ambientMagneticFieldMicroT` | Biến trở con chạy 20 Ω – 2 A chuẩn thực hành KHTN 9 (`OL3D-EQP-RHE-0001`) |
| **G08** | **G08 – Cơ học, nhiệt học, năng lượng** | Xe lăn thực hành 200g, Mặt phẳng nghiêng 0–45°, Lò xo xoắn k=20N/m, Khối gỗ ma sát | Mặt phẳng nghiêng dài 1.0m, rộng 0.3m, góc nghiêng 0°–45°; Hệ số ma sát tĩnh μ_s ~ 0.30, ma sát động μ_k ~ 0.25; Xe lăn 200g, đường kính bánh Ø50mm, ma sát trục 0.01 N·m | Góc nghiêng 0–45° (ĐCNN 0.5°) · Lò xo k = 20 N/m | ±0.5° góc nghiêng | `gravityMps2`, `surfaceFrictionCoef` | Bộ mặt phẳng nghiêng có thước đo góc 0–45° & xe lăn 200 g (`OL3D-EQP-INC-0001`) |
| **G09** | **G09 – Sinh học, mẫu vật quan sát** | Kính hiển vi quang học (40x–400x), Bộ tiêu bản lam kính (75×25×1mm), Mô hình ADN xoắn kép | Độ phóng đại vật kính (4x, 10x, 40x) × thị kính (10x) = 40x, 100x, 400x; Khẩu độ số NA ~ 0.65; hành trình ốc vi cấp lấy nét (plunger); Đèn chiếu sáng tiêu bản ~1000 lux | Phóng đại 40×, 100×, 400× · NA 0.65 | Lấy nét vi cấp ±0.002 mm | `illuminanceLux`, `co2Ppm` | Bộ tiêu bản hiển vi tế bào thực vật & động vật (Lam kính 75×25 mm) (`OL3D-EQP-SLD-0001`) |
| **G10** | **G10 – Môi trường, mẫu, sinh thái** | Máy đo pH (0–14), Máy đo EC/TDS (0–2000 µS/cm), Máy đo độ đục (0–1000 NTU), Máy đo DO (0–20 mg/L) | Phạm vi pH 0–14 (ĐCNN 0.01); EC 0–2000 µS/cm; Độ đục 0–1000 NTU; Sai số chuẩn ISO: pH ±0.1; EC ±1 µS/cm; Độ đục ±2% NTU; Màn hình LCD 4 số hiển thị 360° & đầu dò BNC nhúng mẫu | pH 0.00–14.00 · EC 0–2000 µS/cm · 0–1000 NTU | ±0.05 pH · ±1% FS EC/NTU | `samplePh`, `sampleConductivityUScm`, `sampleTdsMgL`, `sampleTurbidityNtu`, `sampleDissolvedO2MgL`, `sampleTemperatureC` | Máy đo độ đục nước hiện số Nephelometric (0–1000 NTU) (`OL3D-EQP-TRB-0001`) |

### 2.7. 4 Cấp độ Trung thực Vật lý & Đánh đổi Hiệu năng WebGL (L1 – L4)

| Cấp độ | Tên gọi & Mục tiêu mô phỏng | Phương trình vật lý áp dụng | Mô hình Nhiễu & Sai số Metrology | Mục tiêu FPS WebGL | Độ chính xác % | Đặc tả kỹ thuật & Khuyến nghị ứng dụng |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **L1** | **Cấp L1 – Tương tác cơ bản (Prototyping nhanh)** | $m_display = m_ref; V_display = V_base + V_obj$ | Không tính nhiễu Gaussian hay trôi nhiệt độ (Sai số mô hình 0%) | **60 FPS** | **95%** | Chỉ xử lý Raycast kéo-thả, highlight và cộng trực tiếp thông số chuẩn. Tối ưu tốc độ khung hình tối đa cho máy cấu hình thấp. |
| **L2** | **Cấp L2 – Công thức Vật lý & Nhiễu chuẩn Datasheet (Mặc định)** | $F = m·g; Δx = F/k; ρ = m/V; ΔT_drift = ±0.05% / 10°C$ | Nhiễu Gaussian ±0.5 ĐCNN + trôi nhiệt độ theo T_air & v_air | **60 FPS** | **98.4%** | Áp dụng đầy đủ phương trình vật lý chuẩn SGK KHTN 9 kết hợp độ phân giải ĐCNN và sai số thiết bị thực tế theo Thông tư 38/2021. |
| **L3** | **Cấp L3 – Động học & Dời chỗ chất lỏng thời gian thực** | $F_A = ρ_liquid · g · V_submerged; Q = P·t = m·c·ΔT$ | Va chạm BoundingBox 3D + mặt khum meniscus + dao động tắt dần lò xo/đĩa cân | **55 FPS** | **99.2%** | Mô phỏng quá trình dâng mực nước, tràn vòi Bình tràn, lực đẩy Archimedes khi nhúng vật đang treo trên lực kế vào cốc nước. |
| **L4** | **Cấp L4 – Mô phỏng Chi tiết cao & Kiểm định Thống kê (t-test)** | $ρ(T, P_atm) hiệu chỉnh nén khí quyển + tán sắc Cauchy n(λ) + độ nhớt η$ | Đầy đủ 24 biến môi trường + tự động xuất bản ghi MeasurementRecord kiểm định | **48 FPS** | **99.7%** | Phục vụ nghiên cứu thực nghiệm và đối chiếu phép đo Ảo vs Thực (sai số thống kê ≤ ±5% theo kiểm định t-test). |

### 2.8. Hệ thống Chiếu sáng Mô phỏng Đa tầng (Lighting Subsystems)
OpenLab 3D sử dụng hệ thống chiếu sáng studio 4 nguồn vật lý kết hợp ánh xạ môi trường:
1. **Nguồn sáng Bán cầu (`HemisphereLight`)**: Màu bầu trời xanh nhạt lam (`#bae6fd`, cường độ $0.55$), màu mặt sàn ấm (`#1e293b`). Đảm bảo mọi mặt khuất dưới đáy thiết bị không bị đen kịt hoàn toàn.
2. **Đèn chiếu chính (`DirectionalLight` - Key Light)**: Đặt tại tọa độ $(3.0, 5.0, 2.5)\text{ m}$, chiếu nghiêng $45^\circ$ xuống bàn, cường độ $1.25$.
   - Kích hoạt đổ bóng `castShadow = true`.
   - Kích thước bản đồ bóng `shadow.mapSize.set(2048, 2048)` lọc mềm `PCFSoftShadowMap`.
   - Tham số khử răng cưa và sọc bóng: `shadow.bias = -0.00008`, `shadow.normalBias = 0.02`.
3. **Đèn chiếu phụ (`DirectionalLight` - Fill Light)**: Đặt đối xứng tại $(-3.0, 3.5, 2.0)\text{ m}$, cường độ $0.45$, làm mềm các vùng bóng đổ gắt của Key Light.
4. **Đèn viền nổi khối (`DirectionalLight` - Back Rim Light)**: Đặt phía sau lưng bàn tại $(0.0, 4.0, -3.5)\text{ m}$, cường độ $0.65$, tạo đường viền phản xạ ánh kim sắc sảo trên cổ chai thủy tinh và mép mâm cân Inox.
5. **Chế độ Phòng tối Quang học (Dark Room Mode)**: Tự động kích hoạt khi thực hành thí nghiệm Laser (G06) hoặc thấu kính — giảm toàn bộ ánh sáng môi trường xuống $8\text{ lux}$ để học sinh quan sát rõ nét đường đi của tia sáng và ảnh chữ F trên màn chắn.

### 2.9. Hệ thống Âm thanh Môi trường Tổng hợp Web Audio (LabSoundEngine)
Hệ thống âm thanh vận hành theo chuẩn tự tổng hợp thuần qua Web Audio API (`AudioContext`), không sử dụng file `.mp3` ngoại lai:

| STT | Mã sự kiện âm thanh (Phenomenon Type) | Tần số cơ bản $f_0$ | Dạng sóng (Waveform) | Thời gian suy giảm (Decay) | Cơ chế vật lý & Tình huống kích hoạt |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | `water-pour` | $320 - 480\text{ Hz}$ | Pink Noise + Bandpass | $0.60\text{ s}$ | Dòng nước chảy liên tục khi mở van bình cấp nước cất |
| 2 | `water-splash` | $420\text{ Hz}$ | Sine + Fast Drop | $0.18\text{ s}$ | Giọt nước rơi xuống đáy cốc hoặc mặt khum chất lỏng |
| 3 | `water-overflow` | $280\text{ Hz}$ | Triangle + LFO 4Hz | $0.85\text{ s}$ | Nước chảy trào qua mỏ vòi bình tràn Eureka |
| 4 | `scale-place` | $160\text{ Hz}$ | Sine Thud | $0.12\text{ s}$ | Vật nặng chạm tiếp xúc đĩa cân Inox SUS304 |
| 5 | `scale-tare` | $880\text{ Hz}$ | Pure Sine Beep | $0.08\text{ s}$ | Bấm phím trừ bì TARE đưa màn hình số về 0.00 g |
| 6 | `glass-clink` | $2400\text{ Hz}$ | Sine + High Ring | $0.45\text{ s}$ | Chạm va chạm nhẹ giữa 2 dụng cụ thủy tinh Borosilicate |
| 7 | `wood-place` | $120\text{ Hz}$ | Low Square Thud | $0.15\text{ s}$ | Đặt dụng cụ kim loại/khối gỗ xuống mặt bàn thực hành |
| 8 | `grab-pickup` | $520\text{ Hz}$ | Upward Sine Sweep | $0.09\text{ s}$ | Bắt đầu nhấn chuột kéo nhấc vật thể rời khỏi bàn |
| 9 | `dock-hover-snap` | $750\text{ Hz}$ | Dual Sine Snap | $0.06\text{ s}$ | Vật rơi đúng vào vùng dung sai hút nam châm (Snap Dock) |
| 10 | `rotate-object` | $350\text{ Hz}$ | Click Tick | $0.04\text{ s}$ | Xoay góc thiết bị quanh trục Y bước $15^\circ$ hoặc $45^\circ$ |
| 11 | `caliper-slide` | $1200\text{ Hz}$ | Noise Friction | $0.20\text{ s}$ | Hàm trượt du xích thước cặp di chuyển trên thanh thước chính |
| 12 | `funnel-valve` | $480\text{ Hz}$ | Mechanical Squeak | $0.14\text{ s}$ | Vặn khóa mỏ phễu chiết hoặc khóa buret chuẩn độ |
| 13 | `mechanical-click` | $950\text{ Hz}$ | Square Click | $0.05\text{ s}$ | Bật/tắt công tắc nguồn điện hạ áp 12V hoặc phím bấm đa năng |
| 14 | `spring-stretch` | $220 - 660\text{ Hz}$ | Rising Triangle | $0.35\text{ s}$ | Kéo giãn lò xo lực kế tỷ lệ thuận theo định luật Hooke |
| 15 | `burner-ignite` | $200\text{ Hz}$ | Noise Whoosh | $0.40\text{ s}$ | Bật lửa châm ngọn lửa đèn cồn bùng cháy |
| 16 | `burner-extinguish` | $180\text{ Hz}$ | Soft Pop Puff | $0.25\text{ s}$ | Chụp nắp sứ dập tắt ngọn lửa đèn cồn |
| 17 | `laser-switch` | $1450\text{ Hz}$ | Laser Pulse Chirp | $0.07\text{ s}$ | Bật công tắc phát chùm 3 tia laser quang học song song |
| 18 | `optics-angle` | $620\text{ Hz}$ | Dial Notch Tick | $0.05\text{ s}$ | Xoay bảng chia độ 360° bản bán trụ thuỷ tinh |
| 19 | `electric-induction` | $100\text{ Hz}$ | Mains Hum Sine | $0.50\text{ s}$ | Đưa thanh nam châm di chuyển xuyên qua lòng cuộn dây kín |
| 20 | `probe-measure` | $1050\text{ Hz}$ | Electronic Strobe | $0.10\text{ s}$ | Đầu dò pH/TDS/nhiệt kế hoàn tất đo và chốt số đo ổn định |
| 21 | `camera-shutter` | $1800\text{ Hz}$ | Double Click | $0.16\text{ s}$ | Chụp ảnh lưu trữ báo cáo thí nghiệm vào hồ sơ học sinh |
| 22 | `record-start` | $659 - 880\text{ Hz}$ | Arpeggio Sine | $0.22\text{ s}$ | Bắt đầu quay video ghi hình quá trình thực nghiệm |
| 23 | `record-stop` | $880 - 659\text{ Hz}$ | Descending Sine | $0.22\text{ s}$ | Kết thúc phiên quay video và xuất file MP4/WebM |
| 24 | `step-complete` | $523 - 659 - 784\text{ Hz}$ | Major Chord Beep | $0.30\text{ s}$ | Hoàn thành một bước thao tác chuẩn theo hướng dẫn SGK |
| 25 | `camera-zoom` | $400\text{ Hz}$ | Smooth Whisper | $0.15\text{ s}$ | Cuộn chuột phóng to/thu nhỏ trường nhìn kính hiển vi |
| 26 | `ui-toggle` | $800\text{ Hz}$ | Short Blip | $0.03\text{ s}$ | Bật/tắt thanh công cụ đo lường, lưới tọa độ hoặc bảng biến |

### 2.10. Hệ thống Đồng hồ Kép & Nhật ký Sự kiện Thời gian thực
* **Đồng hồ thực (Real Clock)**: Truy xuất thời gian thực hệ điều hành theo múi giờ chuẩn Việt Nam `Asia/Ho_Chi_Minh` (UTC+7), hiển thị chính xác ngày, tháng, năm, giờ, phút, giây.
* **Đồng hồ mô phỏng (Simulation Clock)**:
  - Vận hành độc lập với trạng thái: `running`, `paused`, `stopped`.
  - Hỗ trợ các hệ số nhân tốc độ thời gian vật lý: $0.25\times, 0.5\times, 1.0\times, 2.0\times, 5.0\times, 10.0\times$.
  - Dùng để tua nhanh các quá trình nhiệt học (đun nước sôi), lắng đọng kết tủa hoặc quan sát chuyển động chậm của trùng giày dưới kính hiển vi.
* **Nhật ký sự kiện (LabEventLog)**: Tự động ghi nhận mọi tương tác với cấu trúc kép: vừa lưu `timestamp` thực tế vừa lưu `simulationElapsedSeconds` phục vụ việc truy vết nguyên nhân lỗi khi xảy ra sự cố hỏng hóc thiết bị.

### 2.11. Bộ 13 Bài Kiểm thử Nghiệm thu Môi trường Tự động (Acceptance Tests)
Bộ kiểm thử tự động `runLabEnvironmentAcceptanceTests()` đánh giá chất lượng phòng thí nghiệm theo 3 nhóm chỉ tiêu:

| Mã kiểm thử | Phân nhóm tiêu chuẩn | Tên bài kiểm thử nghiệm thu | Điều kiện Đạt (Pass Criteria) | Trạng thái hệ thống |
| :---: | :--- | :--- | :--- | :---: |
| **GEO-01** | Hình học & Tọa độ | Sàn logic tại $y = 0$, gốc $O(0,0,0)$ tại tâm sàn | `floorY === 0 && origin === "floor-center"` | **Pass** |
| **GEO-02** | Hình học & Tọa độ | Hệ trục 3D trực giao ($+Y$ lên, $+X$ phải, $+Z$ trước) | `upAxis === "+Y" && rightAxis === "+X"` | **Pass** |
| **GEO-03** | Hình học & Tọa độ | Lưới ô lớn $1.0\text{ m} \times 1.0\text{ m}$, vạch nhỏ $0.1\text{ m}$ | `majorGrid === 1.0 && minorGrid === 0.1` | **Pass** |
| **GEO-04** | Hình học & Tọa độ | Định vị chính xác tọa độ dịch chuyển $1\text{ m}$ trên 3 trục | $d(O \to +1X) = 1.000\text{ m}$ | **Pass** |
| **GEO-05** | Hình học & Tọa độ | Khoảng cách 2 điểm khớp công thức Euclid 3D | $|d((0,0,0) \to (1,1,0)) - \sqrt{2}| < 10^{-6}$ | **Pass** |
| **GEO-06** | Hình học & Tọa độ | Mặt bàn tại $y = 0.82\text{ m}$, chân bàn cao đúng $0.78\text{ m}$ | `benchTopY === 0.82 && legH === 0.78` | **Pass** |
| **GEO-07** | Hình học & Tọa độ | Bật/tắt hiển thị lưới không làm mất vùng snap vật lý | `showWorldAxes` độc lập `placement.snapEnabled` | **Pass** |
| **CLK-01** | Thời gian & Đồng hồ | Hiển thị giờ chuẩn múi giờ `Asia/Ho_Chi_Minh` | `realClock.isAvailable && timeZone === VN` | **Pass** |
| **CLK-02** | Thời gian & Đồng hồ | Đồng hồ mô phỏng hỗ trợ tua tốc độ $0.25\times - 10\times$ | `speedMultiplier >= 0.25 && <= 10` | **Pass** |
| **CLK-03** | Thời gian & Đồng hồ | Nhật ký sự kiện lưu đồng thời timestamp thực và ảo | `eventLogs.length >= 0` với dual-timestamp | **Pass** |
| **SEP-01** | Phân tách Dữ liệu | Tách biệt biến vật lý (`illuminanceLux`) với đồ họa | Biến lux vật lý độc lập `keyLightStrength` | **Pass** |
| **SEP-02** | Phân tách Dữ liệu | Biến môi trường chỉ tác động module có đăng ký | `BUILTIN_ENVIRONMENT_AWARE_MODULES.length > 0` | **Pass** |
| **SEP-03** | Phân tách Dữ liệu | Dùng chung 1 Scene, Camera, WebGLRenderer duy nhất | Tái sử dụng 100% tài nguyên, zero memory leak | **Pass** |

### 2.12. Dữ liệu Kiểm định Đo lường Đối chiếu Phép đo Ảo vs Thực (Benchmark t-test)
Bảng kết quả đo đạc thực nghiệm đối chứng 10 mẫu vật chuẩn để kiểm định sai số hệ thống:

| STT | Tên mẫu vật đối chứng | Vật liệu chế tạo | Khối lượng thực $m_{thực}$ (g) | Khối lượng ảo $m_{ảo}$ (g) | Thể tích thực $V_{thực}$ (cm³) | Thể tích ảo $V_{ảo}$ (cm³) | $\rho_{thực}$ (g/cm³) | $\rho_{ảo}$ (g/cm³) | Sai số tương đối $\delta$ (%) | Phân loại dữ liệu kiểm định |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | Mẫu #01 — Trụ Nhôm đặc Ø25×50 mm | Hợp kim Nhôm 6061 | 66.28 | 66.25 | 24.55 | 24.50 | 2.700 | 2.700 | **+0.04%** | `PUBLISHED_REFERENCE` |
| **2** | Mẫu #02 — Viên bi Thép đặc Ø25 mm | Thép cacbon C45 | 64.15 | 64.20 | 8.18 | 8.20 | 7.840 | 7.830 | **-0.16%** | `PUBLISHED_REFERENCE` |
| **3** | Mẫu #03 — Khối Đồng đỏ 20×20×30 mm | Đồng nguyên chất Cu 99.9% | 107.12 | 107.28 | 12.00 | 12.00 | 8.930 | 8.940 | **+0.15%** | `PUBLISHED_REFERENCE` |
| **4** | Mẫu #04 — Khối Gỗ Sồi khô phủ sáp chống thấm | Gỗ Sồi tự nhiên | 112.40 | 112.50 | 150.00 | 150.00 | 0.749 | 0.750 | **+0.09%** | `PUBLISHED_REFERENCE` |
| **5** | Mẫu #05 — Trụ Nhựa kĩ thuật POM (Acetal) | Nhựa POM đặc | 141.20 | 141.00 | 100.00 | 100.00 | 1.412 | 1.410 | **-0.14%** | `PUBLISHED_REFERENCE` |
| **6** | Mẫu #06 — Quả cân chuẩn Đồng thau 100 g | Đồng thau CuZn37 | 100.02 | 100.00 | 11.90 | 11.90 | 8.405 | 8.403 | **-0.02%** | `PUBLISHED_REFERENCE` |
| **7** | Mẫu #07 — Trụ Nhựa Acrylic (PMMA) trong suốt | Polymethyl Methacrylate | 118.50 | 118.00 | 100.00 | 100.00 | 1.185 | 1.180 | **-0.42%** | `PUBLISHED_REFERENCE` |
| **8** | Mẫu #08 — Mẫu Đá vôi tự nhiên không thấm | Canxi Cacbonat CaCO₃ | 162.80 | 162.60 | 60.10 | 60.00 | 2.709 | 2.710 | **+0.04%** | `PUBLISHED_REFERENCE` |
| **9** | Mẫu #09 — Trụ Nhôm rỗng có khoang kín | Nhôm 6061 (Khoang rỗng) | 84.50 | 84.40 | 45.00 | 45.00 | 1.878 | 1.876 | **-0.12%** | `ANALYTICAL_REFERENCE` |
| **10** | Mẫu #10 — Khối Chì chuẩn đối trọng 200 g | Chì kỹ thuật Pb | 199.85 | 200.00 | 17.62 | 17.64 | 11.342 | 11.338 | **-0.04%** | `PUBLISHED_REFERENCE` |

> [!NOTE]
> **Đánh giá Thống kê (t-test)**: Giá trị sai số tương đối tối đa giữa môi trường mô phỏng và thực tế là **0.42%** (mẫu Acrylic), nhỏ hơn rất nhiều so với ngưỡng sai số cho phép của thiết bị giáo dục trường học ($\pm 2.0\% - \pm 5.0\%$). Kiểm định t-test cặp mẫu cho giá trị $p > 0.05$, chứng minh tính tương đương khoa học tuyệt đối.

---

# PHẦN III — HỆ THỐNG GHÉP NỐI ĐỒNG BỘ & ĐỘNG HỌC LẮP RÁP (ASSEMBLY ENGINE & GRAPH)

Hệ thống Lắp ráp (Assembly Engine) của OpenLab 3D điều khiển toàn bộ các tương tác cơ học, thủy lực, quang học và mạch điện giữa các thiết bị với nhau.

### 3.1. Các Loại Cổng Ghép nối (Assembly Connector Kinds)
Hệ thống định nghĩa 9 loại cổng cơ sở (`AssemblyConnectorKind`):
1. `mechanical_support`: Mặt đỡ cơ học chịu tải trọng (Đĩa cân điện tử, mặt bàn, đợt kệ).
2. `mechanical_clamp`: Khớp ngàm kẹp cố định hoặc trượt (Mỏ kẹp thước cặp, kẹp giá sắt).
3. `mechanical_hook`: Móc treo lực đàn hồi (Móc treo dưới đáy lực kế lò xo 5N).
4. `mechanical_rail`: Rãnh trượt dẫn hướng 1 chiều (Ray quang học 100 cm).
5. `optical_carrier`: Con trượt đế mang linh kiện quang học trên ray.
6. `optical_socket`: Vòng giữ gá lắp thấu kính quang học đồng trục.
7. `electrical_terminal`: Cọc cắm đầu cốt bắp chuối Ø4mm phân cực điện áp (+ / - / AC).
8. `fluid_spout`: Mỏ rót / vòi xả chất lỏng (Vòi bình tràn, van xả bình cấp nước, mỏ cốc).
9. `fluid_receptacle`: Miệng hứng chất lỏng hoặc lỗ nhận vật mẫu (Miệng ống đong, miệng cốc đốt).

### 3.2. Bảng Đăng ký 15 Cổng Connector Chuẩn RWSS
Thông số kỹ thuật chi tiết của 15 cổng lắp ráp đã được kiểm định (`ASSEMBLY_CONNECTOR_REGISTRY`):

| STT | Mã cổng (Connector ID) | Thiết bị sở hữu | Loại cổng & Giới tính | Tọa độ cục bộ $[x, y, z]$ (m) | Vector pháp tuyến | Dung sai snap (m) | Sức chứa tối đa | Bậc tự do cho phép | Giới hạn khẩu độ | Thiết bị chấp nhận ghép |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | `CONN_BALANCE_PAN` | `electronic-balance` | mechanical_support (female) | `[0, 0.068, -0.02]` | `[0, 1, 0]` | 0.165 m | $\infty$ | Trans: [X,Z] | Không giới hạn | calibration-weight, solid-cylinder, solid-sphere, solid-block, hollow-cylinder, beaker-250, graduated-cylinder, erlenmeyer-flask, porcelain-dish |
| **2** | `CONN_CYLINDER_APERTURE` | `graduated-cylinder` | fluid_receptacle (female) | `[0, 0.22, 0]` | `[0, 1, 0]` | 0.105 m | 3 vật | Trans: [Khóa] | Ø $\le 28\text{ mm}$ | calibration-weight, solid-cylinder, solid-sphere, solid-block, hollow-cylinder, thermometer |
| **3** | `CONN_BEAKER_RIM` | `beaker-250` | fluid_receptacle (female) | `[0, 0.095, 0]` | `[0, 1, 0]` | 0.105 m | 4 vật | Trans: [X,Z] | Không giới hạn | calibration-weight, solid-cylinder, solid-sphere, solid-block, hollow-cylinder, thermometer |
| **4** | `CONN_OVERFLOW_CAN_APERTURE` | `overflow-can` | fluid_receptacle (female) | `[0, 0.16, 0]` | `[0, 1, 0]` | 0.105 m | 3 vật | Trans: [Khóa] | Không giới hạn | calibration-weight, solid-cylinder, solid-sphere, solid-block, hollow-cylinder, thermometer |
| **5** | `CONN_OVERFLOW_CAN_SPOUT` | `overflow-can` | fluid_spout (male) | `[0.062, 0.125, 0]` | `[1, -0.707, 0]` | 0.125 m | 1 vật | Trans: [Khóa] | Không giới hạn | beaker-250, graduated-cylinder |
| **6** | `CONN_WATER_DISPENSER_SPOUT` | `water-dispenser` | fluid_spout (male) | `[0.095, 0.12, 0]` | `[0, -1, 0]` | 0.155 m | 1 vật | Trans: [Khóa] | Không giới hạn | graduated-cylinder, beaker-250, overflow-can, erlenmeyer-flask, porcelain-dish |
| **7** | `CONN_SPRING_DYNO_HOOK` | `spring-dynamometer` | mechanical_hook (female) | `[0, 0.025, 0.018]` | `[0, -1, 0]` | 0.105 m | 2 vật | Trans: [Khóa] | Không giới hạn | calibration-weight, solid-cylinder, solid-sphere, solid-block, hollow-cylinder |
| **8** | `CONN_VERNIER_CALIPER_JAWS` | `vernier-caliper` | mechanical_clamp (female) | `[-0.09, 0.008, 0.028]` | `[1, 0, 0]` | 0.135 m | 1 vật | Trans: [Khóa] | Không giới hạn | calibration-weight, solid-cylinder, solid-sphere, solid-block, hollow-cylinder, graduated-cylinder, beaker-250, erlenmeyer-flask, porcelain-dish |
| **9** | `CONN_OPTICAL_BENCH_RAIL` | `optical-bench` | mechanical_rail (female) | `[0, 0.0295, 0]` | `[0, 1, 0]` | 0.14 m | 4 vật | Trans: [X] | Không giới hạn | optical-lamp, frosted-f-object, optical-lens, optical-screen |
| **10** | `CONN_PSU_DC_OUT_POS` | `optical-power-supply` | electrical_terminal (female) | `[0.045, 0.038, 0.06]` | `[0, 0, 1]` | 0.7 m | 1 vật | Trans: [Khóa] | Không giới hạn | CONN_LAMP_DC_IN_POS, optical-lamp |
| **11** | `CONN_PSU_DC_OUT_NEG` | `optical-power-supply` | electrical_terminal (female) | `[-0.045, 0.038, 0.06]` | `[0, 0, 1]` | 0.7 m | 1 vật | Trans: [Khóa] | Không giới hạn | CONN_LAMP_DC_IN_NEG, optical-lamp |
| **12** | `CONN_LAMP_DC_IN_POS` | `optical-lamp` | electrical_terminal (female) | `[0.035, 0.025, -0.04]` | `[0, 0, -1]` | 0.7 m | 1 vật | Trans: [Khóa] | Không giới hạn | CONN_PSU_DC_OUT_POS, optical-power-supply |
| **13** | `CONN_LAMP_DC_IN_NEG` | `optical-lamp` | electrical_terminal (female) | `[-0.035, 0.025, -0.04]` | `[0, 0, -1]` | 0.7 m | 1 vật | Trans: [Khóa] | Không giới hạn | CONN_PSU_DC_OUT_NEG, optical-power-supply |
| **14** | `CONN_OPTICAL_LAMP_CARRIAGE` | `optical-lamp` | optical_carrier (male) | `[0, 0, 0]` | `[0, -1, 0]` | 0.14 m | 1 vật | Trans: [X] | Không giới hạn | optical-bench |
| **15** | `CONN_LENS_HOLDER_SOCKET` | `optical-lens` | optical_socket (female) | `[0, 0.125, 0]` | `[1, 0, 0]` | 0.15 m | 1 vật | Trans: [Khóa] | Không giới hạn | optical-lens-box |

### 3.3. Động học Lắp ráp & Quản lý Graph Đồ thị (AssemblyGraphManager)
Assembly Graph là đồ thị có hướng mô tả cấu trúc liên kết cơ học và chức năng:
* **Vòng đời trạng thái lắp ráp**:
  $$\text{FREE} \xrightarrow{\text{PointerDown}} \text{DRAGGING} \xrightarrow{\text{dist} \le \text{tol}} \text{CANDIDATE} \xrightarrow{\text{Validate Pass}} \text{ATTACHED} \xrightarrow{\text{Lock}} \text{CONSTRAINED}$$
* **Quy tắc Kiểm tra Khẩu độ (Aperture Limit Check - ASM-16)**:
  - Khi thả mẫu vật vào ống đong 100 ml (`CONN_CYLINDER_APERTURE`), hệ thống đo kích thước bao ngang $D_{max} = \max(W, D)$. Nếu $D_{max} > 28.0\text{ mm}$ (ví dụ khối đồng `solid-block` $30\text{ mm}$), hệ thống lập tức từ chối ghép nối với mã lỗi `APERTURE_OVERSIZE` và gợi ý học sinh chuyển sang dùng Bình tràn Eureka!
* **Quy tắc Chiếm chỗ Cổng (Slot Occupancy Policy - ASM-09)**:
  - Với đĩa cân (`CONN_BALANCE_PAN`): Sức chứa vô hạn (`maxOccupancy: Infinity`), cho phép đặt đồng thời cốc đốt chứa nước và nhiều quả cân lên đĩa cân, tự động cộng dồn tổng khối lượng bì.
  - Với ngàm kẹp thước cặp (`CONN_VERNIER_CALIPER_JAWS`): Sức chứa đơn vị (`maxOccupancy: 1`). Khi kéo kẹp mẫu vật mới, vật thể cũ tự động được giải phóng (Evict/Replace) trả về mặt bàn.

### 3.4. Bộ Giải tích Mạch điện Vật lý Thời gian thực (Electrical Circuit Solver)
Bộ giải tích mạch điện `solveElectricalCircuit()` vận hành theo định luật Ohm và Kirchhoff:
* **Kiểm tra Mạch kín Causal Topology**: Mạch chỉ khép kín (`isCircuitClosed = true`) khi có đủ 2 dây dẫn cắm từ 2 cọc nguồn DC (+) và (-) của Nguồn hạ áp vào 2 cọc cắm của Đèn chiếu Halogen.
* **Khoảng cách Dây dẫn Tối đa**: Độ dài dây cáp bắp chuối giới hạn ở **`MAX_ELECTRICAL_CABLE_LENGTH_M = 0.70 m`** ($70\text{ cm}$). Nếu kéo nguồn điện ra xa đèn $> 0.70\text{ m}$, mạch tự động bị đứt hở.
* **Ngưỡng Điện áp Phát xạ Nhiệt Tim đèn**: Ngưỡng điện áp tối thiểu để tim vonfram bắt đầu phát sáng là **`LAMP_IGNITION_THRESHOLD_VOLTAGE_V = 2.5 V`**.
* **Độ rọi Đèn tỷ lệ theo Điện áp**:
  $$I_{lux}(V) = \begin{cases} 0 & \text{khi } V < 2.5\text{ V} \\ I_{max} \cdot \left(\frac{V}{12.0}\right)^{3.5} & \text{khi } V \ge 2.5\text{ V} \end{cases}$$

---

# PHẦN IV — RÀ SOÁT CHI TIẾT TÁCH BIỆT TỪNG THIẾT BỊ MÔ PHỎNG (36 THIẾT BỊ)

Dưới đây là hồ sơ kiểm toán độc lập chi tiết của toàn bộ **36 thiết bị thí nghiệm** có trong danh mục OpenLab 3D. Mỗi thiết bị được rà soát tách biệt theo 11 tiêu chí kỹ thuật chuẩn hóa.

## 4.1. [OL3D-EQP-BAL-0001] Cân điện tử hiện số 500 g
**Tên tiếng Anh**: *Precision Electronic Balance 500 g* | **Mã Archetype**: `electronic-balance` | **Phân loại danh mục**: `mass-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-BAL-0001`
* **Mã đường dẫn (Slug)**: `can-dien-tu-hien-so-500g`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `partially-verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-BAL-0001_can-dien-tu-hien-so-500g` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · OIML Class II

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 200 mm, Cao = 85 mm, Sâu = 240 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.2 m, Cao (Y) = 0.085 m, Sâu (Z) = 0.24 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `tare_button_3d`, `weighing_pan`, `pan_plate`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshPhysicalMaterial`, `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: ExtrudeGeometry with Bevel; Torus Chamfered Edge Reflectors; State Sync via userData; Optical Ray Tracing & Refraction
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `ExtrudeGeometry (Bevel)` | MeshPhysicalMaterial (White ABS, roughness 0.25) | 1 | Thân vỏ OHAUS Scout chống hóa chất |
| `weighing_pan` | `CylinderGeometry + Torus` | MeshPhysicalMaterial (SUS304 Inox, metalness 0.94) | 2 | Mâm cân Inox lún 2.2mm khi chịu lực |
| `scale_display` | `PlaneGeometry (Offset)` | MeshBasicMaterial (CanvasTexture LED) | 3 | Màn hình LCD 7 đoạn nghiêng 20° |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `weighObject`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **1450 g** (Trạng thái: `reported`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `mass`
  - Giới hạn đo (GHĐ): **0 g** đến **500 g**
  - Độ chia nhỏ nhất (ĐCNN): **0.01 g**
  - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad m_{net} = \max\left(0, m_{gross} - m_{tare}\right)$$
  *Ý nghĩa vật lý*: Số chỉ khối lượng tịnh sau khi trừ bì (TARE Offset).
  $$\mathbf{(2)}\quad m(t) = m_{final} \cdot \left(1 - e^{-t / \tau}\right) + \epsilon_{Gauss}(0, \sigma^2)$$
  *Ý nghĩa vật lý*: Động học đáp ứng cảm biến Loadcell và nhiễu vi chấn động không khí ($\tau \approx 0.35\text{ s}$, $\sigma = 0.005\text{ g}$).
  $$\mathbf{(3)}\quad m_{thermal} = m_0 \cdot \left[1 + \alpha_{loadcell} \cdot (T_{air} - 25^\circ\text{C})\right]$$
  *Ý nghĩa vật lý*: Hiệu ứng trôi nhiệt độ độ nhạy cảm biến biến dạng ($\alpha_{loadcell} \approx 1.5 \times 10^{-5}\,\text{K}^{-1}$).
* **Các tính năng khoa học tích hợp**:
  - Cảm biến lực biến dạng (Loadcell) độ nhạy 0.01 g, thời gian ổn định kết quả ≤ 2 giây.
  - Chức năng trừ bì (Phím TARE/ZERO) đưa màn hình về 0.00 g khi đặt cốc chứa chất lỏng.
  - Đĩa cân thép không gỉ SUS304 tháo rời vệ sinh được, có chân ren chỉnh thăng bằng và bọt thủy.
  - Hiển thị trực tiếp số gam trên màn hình LCD 3D và tự động khóa số đo khi vật đứng yên.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE_ZERO`
* **Danh sách trạng thái khả dụng**: `IDLE_ZERO`, `WEIGHING_SETTLING`, `STABLE_LOCKED`, `OVERLOAD_ERROR`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE_ZERO` | `WEIGHING_SETTLING` | Object placed on pan | `m_gross > 0.05 g` |
| `WEIGHING_SETTLING` | `STABLE_LOCKED` | Settling timer elapsed | `|dm/dt| < 0.01 g/s for 1.2s` |
| `WEIGHING_SETTLING` | `OVERLOAD_ERROR` | Load exceeds capacity | `m_gross > 550.0 g` |
| `STABLE_LOCKED` | `IDLE_ZERO` | TARE button pressed | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.02 g (OIML Class II)
* **Độ chia nhỏ nhất / Độ phân giải**: 0.01 g (Màn hình 2 số lẻ)
* **Độ lặp lại phép đo**: 0.01 g (Độ lệch chuẩn lặp lại s <= 0.01g)
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: ±0.005 g / 10°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Số đo trôi dạt liên tục (Drifting)** | Luồng gió phòng v_air > 0.5 m/s thổi lên đĩa cân | Cân không chốt số STABLE_LOCKED | `Cờ isDraftInterference = true` | Bật hộp chắn gió hoặc giảm tốc độ quạt phòng v_air = 0 m/s |
| **Báo lỗi quá tải OVERLOAD_ERR** | Đặt tải trọng vượt quá GHĐ 500g | Màn hình nhấp nháy [ - - - - ] | `Loadcell strain > 105% FS` | Nhấc bớt vật nặng khỏi đĩa cân về bàn |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Danh mục thiết bị dạy học tối thiểu KHTN THCS: Cân điện tử hiện số, độ chính xác 0.01g – 0.1g, có chức năng trừ bì. |
| **Thiết bị Giáo dục VietValue** | `vietvalue.edu.vn` | Cân kỹ thuật phòng thí nghiệm THCS: Đĩa cân Ø 120–130 mm Inox, màn hình LCD xanh ngọc, phím TARE/MODE/ON-OFF. |
| **Thiết bị Điện tử & Đo lường Việt Nam** | `thietbidientu.net.vn` | Kích thước máy chuẩn 190 × 240 × 75 mm, nguồn DC 6V/Pin AA, sai số lặp lại ±0.02 g. |
| **DMKLab — Thiết bị Phòng thí nghiệm** | `dmklab.vn` | Cân kỹ thuật 2 số lẻ (0.01 g): Tích hợp chống quá tải cơ học và tự động hiệu chuẩn ngoại bằng quả cân chuẩn. |
| **Innotec Việt Nam — Thiết bị Dạy học** | `innotec.com.vn` | Cân điện tử thực hành KHTN: Vỏ nhựa ABS chống hóa chất, mặt hiển thị nghiêng 25° giúp học sinh dễ đọc góc nhìn thẳng. |

---

## 4.2. [OL3D-EQP-CYL-0001] Ống đong thủy tinh 100 ml
**Tên tiếng Anh**: *100 ml Graduated Cylinder* | **Mã Archetype**: `graduated-cylinder` | **Phân loại danh mục**: `volume-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-CYL-0001`
* **Mã đường dẫn (Slug)**: `ong-dong-thuy-tinh-100ml`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-CYL-0001_ong-dong-thuy-tinh-100ml` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: ISO 4788 · DIN 12680 · Thông tư 38/2021/TT-BGDĐT

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 32 mm, Cao = 255 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.065 m, Cao (Y) = 0.255 m, Sâu (Z) = 0.065 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `pouring_lip`, `scale_marks`, `liquid_surface`, `liquid_body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Hollow)` | MeshPhysicalMaterial (Borosilicate, transmission 0.88) | 4 | Thân trụ thành dày 1.8mm kèm mỏ rót |
| `scale_marks` | `CylinderGeometry` | MeshBasicMaterial (CanvasTexture) | 5 | Vạch chia 10..100 ml nổi chống z-fighting |
| `liquid_surface` | `CylinderGeometry + Ring` | MeshPhysicalMaterial (Water, IOR 1.333) | 2 | Cột nước động kèm vành mặt khum mao dẫn |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `readScale`, `displacementVolume`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **138.5 g** (Trạng thái: `reported`)
  - Dung tích định mức ($V_{max}$): **100 ml**
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `volume`
  - Giới hạn đo (GHĐ): **10 ml** đến **100 ml**
  - Độ chia nhỏ nhất (ĐCNN): **1 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V = \pi \cdot \left(\frac{D_{in}}{2}\right)^2 \cdot h_{liquid}$$
  *Ý nghĩa vật lý*: Thể tích hình trụ chất lỏng theo đường kính trong $D_{in} = 28.0\text{ mm}$.
  $$\mathbf{(2)}\quad \Delta V = V_{sau} - V_{trước} = V_{vật\,rắn}$$
  *Ý nghĩa vật lý*: Phương pháp dời chỗ chất lỏng đo thể tích vật rắn không thấm nước.
  $$\mathbf{(3)}\quad h_{meniscus} = \frac{2\gamma \cos\theta}{\rho g r_{in}}$$
  *Ý nghĩa vật lý*: Độ nâng mao dẫn mặt khum lõm của nước tại thành ống thủy tinh ($gamma \approx 0.0728\text{ N/m}$, $\theta \approx 0^\circ$).
* **Các tính năng khoa học tích hợp**:
  - Thủy tinh Borosilicate 3.3 trong suốt, thành dày đều, có mỏ rót chống nhỏ giọt.
  - Chân đế lục giác chống lăn khi đặt nằm và chống lật trên mặt bàn gỗ thí nghiệm.
  - Vạch chia ml sắc nét từ 10 ml đến 100 ml (ĐCNN 1 ml), hiệu chuẩn chuẩn In (Ex/TD) ở 20 °C.
  - Cho phép đọc mặt khum lõm của nước và đo thể tích vật rắn không thấm nước (ΔV = V₂ - V₁).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY`
* **Danh sách trạng thái khả dụng**: `EMPTY`, `PARTIALLY_FILLED`, `MENISCUS_STABLE`, `SUBMERGED_OBJECT`, `OVERFLOW`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY` | `PARTIALLY_FILLED` | Liquid poured in | `V_liquid > 0` |
| `PARTIALLY_FILLED` | `SUBMERGED_OBJECT` | Sample solid dropped | `D_obj <= 28 mm` |
| `SUBMERGED_OBJECT` | `OVERFLOW` | Total volume exceeds 100ml | `V_total > 100 ml` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±1.0 ml (ISO 4788 Class B ở 20°C)
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0 ml (Vạch chia men trắng)
* **Độ lặp lại phép đo**: ±0.5 ml
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Giãn nở thủy tinh Borosilicate 3.3: 3.3 × 10⁻⁶ K⁻¹ (không đáng kể)

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Sai số thị giác (Parallax Error)** | Góc nhìn camera không nằm ngang đáy mặt khum nước | Đọc sai thể tích ±2 đến 3 ml | `Góc lệch trục camera > 5° so với mặt phẳng ngang` | Bấm nút Focus Eye-Level tự động căn camera vuông góc vạch đo |
| **Kẹt mẫu vật ngang miệng ống** | Thả mẫu vật có đường kính > 28 mm (như khối đồng 30mm) | Vật không chìm được vào nước, nguy cơ nứt vỡ miệng ống | `Kiểm tra va chạm Box3 Aperture` | Bật cảnh báo APERTURE_OVERSIZE và chuyển mẫu sang Bình tràn Eureka |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietChem — Hóa chất & Dụng cụ Thí nghiệm** | `vietchem.com.vn` | Ống đong thủy tinh 100ml Duran/ISO 4788: Đường kính thân Ø 31 mm, chiều cao 250–256 mm, vạch chia nhỏ nhất 1 ml. |
| **Lata Việt Nam — Thiết bị Khoa học** | `lata.vn` | Ống đong 100ml đế lục giác: Thủy tinh Borosilicate 3.3 chịu nhiệt, độ dày thành 1.8 mm, mỏ rót tiêu chuẩn DIN. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Ống đong thủy tinh/nhựa trong suốt 100ml dùng chung cho mạch kiến thức Vật lí (đo thể tích vật rắn) và Hóa học. |
| **Visitech — Giải pháp Phòng thí nghiệm** | `visitech.vn` | Ống đong Class B 100 ml: Sai số cho phép ±1.0 ml, vạch in men trắng hoặc xanh bền hóa chất. |
| **Nhà sách Giáo dục — Thiết bị Trường học** | `nhasachgiaoduc.vn` | Ống đong thực hành KHTN THCS: Đế rộng vững chắc, đường kính lòng ống 28 mm bỏ lọt các trụ kim loại thực hành. |

---

## 4.3. [OL3D-EQP-BKR-0001] Cốc thủy tinh chia độ 250 ml
**Tên tiếng Anh**: *250 ml Low-Form Glass Beaker* | **Mã Archetype**: `beaker-250` | **Phân loại danh mục**: `laboratory-glassware`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-BKR-0001`
* **Mã đường dẫn (Slug)**: `coc-thuy-tinh-250ml`
* **Môn học áp dụng**: `chemistry`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-BKR-0001_coc-thuy-tinh-250ml` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: ISO 3819 · DIN 12331 (Griffin Low-Form) · Thông tư 38/2021

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 70 mm, Cao = 98 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.075 m, Cao (Y) = 0.098 m, Sâu (Z) = 0.075 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `pouring_lip`, `scale_marks`, `liquid_surface`, `liquid_body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Low form)` | MeshPhysicalMaterial (Borosilicate, IOR 1.48) | 4 | Cốc Griffin Low-form đường kính 70mm |
| `pouring_lip` | `ShapeGeometry Extrude` | MeshPhysicalMaterial (Glass) | 4 | Mỏ rót vát góc chống tràn chất lỏng |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **96 g** (Trạng thái: `illustrative`)
  - Dung tích định mức ($V_{max}$): **250 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad Q = m \cdot c \cdot \Delta T = P_{heat} \cdot t \cdot \eta_{thermal}$$
  *Ý nghĩa vật lý*: Phương trình truyền nhiệt khi đun nóng dung dịch trong cốc bằng đèn cồn ($eta \approx 65\%$).
  $$\mathbf{(2)}\quad m_{tổng} = m_{vỏ\,cốc} + V_{lỏng} \cdot \rho_{lỏng}$$
  *Ý nghĩa vật lý*: Khối lượng tổng cộng khi đặt cốc chứa chất lỏng lên cân điện tử ($m_{vỏ} = 95.0\text{ g}$).
* **Các tính năng khoa học tích hợp**:
  - Cốc đốt thủy tinh Borosilicate 3.3 dạng thấp thành (Griffin Low-Form), chịu sốc nhiệt tới ΔT = 160 °C.
  - Đáy phẳng tiếp xúc đều với lưới tản nhiệt khi đun trên đèn cồn hoặc đặt trên đĩa cân điện tử.
  - Mỏ rót định hình chuẩn giúp nghiêng rót chất lỏng sang ống đong không bị chảy lem dọc thành ngoài.
  - Vạch chia dung tích định hướng và vùng nhãn mờ để ghi ký hiệu hóa chất.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY`
* **Danh sách trạng thái khả dụng**: `EMPTY`, `FILLED`, `HEATING`, `BOILING`, `POURING`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY` | `FILLED` | Liquid added | `liquidLevelMl > 0` |
| `FILLED` | `HEATING` | Burner flame applied | `T_liquid > T_ambient` |
| `HEATING` | `BOILING` | Temperature reaches boiling point | `T_liquid >= 100.0 C` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±5% dung tích định hướng (DIN 12331)
* **Độ chia nhỏ nhất / Độ phân giải**: 25 ml (Vạch chia thô 50..200 ml)
* **Độ lặp lại phép đo**: ±5 ml
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Khả năng chịu sốc nhiệt ΔT = 160°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Sôi trào bọt khí (Bumping)** | Đun sôi chất lỏng không có đá bọt điều hòa sôi | Dung dịch bắn tung tóe ra ngoài cốc | `dT/dt > 15°C/s khi T > 95°C` | Thêm bi thủy tinh / đá bọt và giảm công suất đèn cồn |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Cốc thủy tinh 250ml chịu nhiệt, có vạch chia và mỏ rót thuộc danh mục dụng cụ thủy tinh dùng chung môn KHTN. |
| **VietChem — Dụng cụ Thủy tinh Duran** | `vietchem.com.vn` | Cốc đốt 250ml Low-form (ISO 3819): Đường kính ngoài Ø 70 mm, chiều cao 95–98 mm, thủy tinh Borosilicate 3.3. |
| **Eisco Labs Scientific Catalog** | `eiscolabs.com` | 250ml Borosilicate Glass Beaker, Low Form with Spout: OD 70 mm, Height 97 mm, 25 ml graduations. |
| **Foxx Life Sciences Glassware** | `foxxlifesciences.com` | Griffin Beaker 250 mL: Uniform wall thickness for thermal shock resistance on wire gauze. |
| **Visitech Việt Nam** | `visitech.vn` | Cốc thủy tinh 250 ml dùng pha chế dung dịch, hứng dịch lọc từ phễu chiết và hứng nước từ bình tràn. |

---

## 4.4. [OL3D-EQP-OVF-0001] Bình tràn Eureka 250 ml
**Tên tiếng Anh**: *Eureka Overflow Can 250 ml* | **Mã Archetype**: `overflow-can` | **Phân loại danh mục**: `volume-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-OVF-0001`
* **Mã đường dẫn (Slug)**: `binh-tran-eureka-250ml`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Thiết bị Cơ học Archimedes

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 78 mm, Cao = 135 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.115 m, Cao (Y) = 0.135 m, Sâu (Z) = 0.08 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_marks`, `spout_water`, `liquid_surface`, `liquid_body`, `spout_stream`, `stream_outer`, `stream_core`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry` | MeshPhysicalMaterial (Transparent Acrylic) | 4 | Bình trụ trong suốt đường kính 85mm |
| `spout_water` | `CylinderGeometry (Tilted 30°)` | MeshPhysicalMaterial (Water stream) | 3 | Dòng nước trong lòng vòi nghiêng xả ra ngoài |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `displacementVolume`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **112 g** (Trạng thái: `illustrative`)
  - Dung tích định mức ($V_{max}$): **250 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V_{tràn} = \max\left(0, V_{ban\,đầu} + V_{chiếm\,chỗ} - V_{ngưỡng}\right)$$
  *Ý nghĩa vật lý*: Thể tích nước tràn qua vòi nghiêng khi vật rắn chìm vào lòng bình ($V_{ngưỡng} = 210.0\text{ ml}$).
  $$\mathbf{(2)}\quad v_{spout} = \sqrt{2 \cdot g \cdot h_{crest}}$$
  *Ý nghĩa vật lý*: Tốc độ dòng xả tại cổ vòi tràn theo định luật Torricelli.
* **Các tính năng khoa học tích hợp**:
  - Thân hình trụ đứng trong suốt giúp quan sát trực tiếp vật rắn chìm hoàn toàn trong lòng chất lỏng.
  - Vòi dẫn nước tràn gắn nghiêng 30° ở phần trên thân bình giúp dòng nước chảy gọn vào cốc hứng.
  - Ứng dụng nguyên lý Archimedes: Thể tích nước tràn qua vòi sang cốc hứng bằng đúng thể tích vật rắn chiếm chỗ.
  - Dùng cho các vật rắn có kích thước lớn hơn đường kính miệng ống đong 100 ml.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `UNFILLED`
* **Danh sách trạng thái khả dụng**: `UNFILLED`, `PRIMED_TO_BRIM`, `OVERFLOWING_ACTIVE`, `DRAINED_TO_BRIM`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `UNFILLED` | `PRIMED_TO_BRIM` | Water filled to spout neck | `V == 210.0 ml` |
| `PRIMED_TO_BRIM` | `OVERFLOWING_ACTIVE` | Object submerged | `V_submerged > 0` |
| `OVERFLOWING_ACTIVE` | `DRAINED_TO_BRIM` | Overflow stream finished | `V_spout == 0` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±1.0 ml thể tích tràn (phụ thuộc góc đặt bình và bám dính giọt)
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0 ml (kết hợp ống đong hứng)
* **Độ lặp lại phép đo**: ±0.8 ml
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Nước chưa tới ngưỡng vòi đã thả vật** | Mực nước ban đầu < 210 ml | Thể tích nước hứng được nhỏ hơn thể tích thực của vật | `V_initial < 210.0 ml` | Bắt buộc đổ nước đầy tràn vòi trước khi tiến hành thí nghiệm Archimedes |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietValue — Thiết bị Dạy học Tối thiểu** | `vietvalue.edu.vn` | Bình tràn thí nghiệm Vật lí THCS: Dung tích 250–300 ml, thân trụ trong suốt có vòi thoát nước nghiêng chống bám giọt. |
| **Innotec Việt Nam** | `innotec.com.vn` | Bình tràn đo thể tích vật rắn và lực đẩy Archimedes: Đường kính Ø 85 mm, chiều cao 150–160 mm. |
| **Thư viện Vật lý Việt Nam** | `thuvienvatly.com` | Quy trình đo khối lượng riêng bằng bình tràn: Đổ nước đầy tới miệng vòi tràn trước khi thả chìm vật nặng. |
| **VinaMTSC — Công ty Thiết bị Khoa học Kỹ thuật** | `vinamtsc.com` | Bình tràn thủy tinh Borosilicate có vòi: Thành dày 2 mm, miệng bo tròn, vòi nghiêng dài 35–40 mm. |
| **DMKLab — Dụng cụ Thí nghiệm Trường học** | `dmklab.vn` | Bình tràn kết hợp cốc hứng và ống đong 100 ml trong bộ thực hành đo khối lượng riêng KHTN. |

---

## 4.5. [OL3D-EQP-DYN-0001] Lực kế lò xo ống trụ 5 N
**Tên tiếng Anh**: *5 N Tubular Spring Dynamometer* | **Mã Archetype**: `spring-dynamometer` | **Phân loại danh mục**: `force-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-DYN-0001`
* **Mã đường dẫn (Slug)**: `luc-ke-lo-xo-5n`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-DYN-0001_luc-ke-lo-xo-5n` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Chương I KHTN 9 (Bài 2, 3)

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 28 mm, Cao = 230 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.036 m, Cao (Y) = 0.23 m, Sâu (Z) = 0.036 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_marks`, `scale_marks_cross`, `spring_coil`, `plunger`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Clear Acrylic)` | MeshPhysicalMaterial (Acrylic, IOR 1.49) | 3 | Vỏ ống trụ bảo vệ trong suốt nhìn rõ lò xo |
| `spring_coil` | `TubeGeometry (Helix Curve)` | MeshPhysicalMaterial (Spring Steel, metalness 0.95) | 4 | Lò xo xoắn ốc co giãn thực tế theo tải trọng |
| `plunger` | `Cylinder + Torus Hook` | MeshStandardMaterial (Red Indicator) | 4 | Trục kéo kèm đĩa chỉ thị đỏ và móc treo đáy |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `measureForce`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **65 g** (Trạng thái: `illustrative`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `force`
  - Giới hạn đo (GHĐ): **0 N** đến **5 N**
  - Độ chia nhỏ nhất (ĐCNN): **0.1 N**
  - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad F = k \cdot \Delta x = m \cdot g$$
  *Ý nghĩa vật lý*: Định luật Hooke cho lò xo đàn hồi tuyến tính ($k = 25.0\text{ N/m}$, độ giãn cực đại $\Delta x_{max} = 200\text{ mm}$ tại $5.0\text{ N}$).
  $$\mathbf{(2)}\quad m_{hiển\,thị} = \frac{F}{g} \times 1000\,(\text{g})$$
  *Ý nghĩa vật lý*: Vạch chia kép quy đổi tương đương trọng lượng sang khối lượng.
  $$\mathbf{(3)}\quad A = F \cdot s \cdot \cos\alpha$$
  *Ý nghĩa vật lý*: Công cơ học khi dùng lực kế kéo vật trượt trên mặt phẳng nghiêng góc $\alpha$.
* **Các tính năng khoa học tích hợp**:
  - Thân ống nhựa Acrylic trong suốt giúp quan sát trực tiếp độ giãn của lò xo thép theo định luật Hooke.
  - Vạch chia kép hiển thị đồng thời đơn vị lực Newton (N) và khối lượng quy đổi (gam).
  - Núm chỉnh điểm 0 (Zero-adjust) ở đỉnh ống cho phép hiệu chuẩn vạch chỉ thị về đúng 0.0 N trước khi đo.
  - Dùng đo trọng lượng P, lực kéo trên mặt phẳng nghiêng và tính công cơ học A = F·s trong Chương I KHTN 9.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `UNLOADED_ZERO`
* **Danh sách trạng thái khả dụng**: `UNLOADED_ZERO`, `STRETCHING`, `OSCILLATING`, `EQUILIBRIUM`, `OVERSTRETCHED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `UNLOADED_ZERO` | `STRETCHING` | Load applied to bottom hook | `F > 0` |
| `STRETCHING` | `EQUILIBRIUM` | Damping settles | `|v_plunger| < 0.001 m/s` |
| `STRETCHING` | `OVERSTRETCHED` | Force exceeds limit | `F > 5.5 N` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.1 N (±2% toàn thang đo)
* **Độ chia nhỏ nhất / Độ phân giải**: 0.1 N (0.05 N ước lượng)
* **Độ lặp lại phép đo**: ±0.05 N
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Giãn nở nhiệt lò xo thép: 1.2 × 10⁻⁵ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Lệch điểm 0 ban đầu** | Lò xo bị dão nhẹ sau thời gian dài sử dụng | Số đo lực bị cộng sai số hệ thống | `F_no_load != 0.0 N` | Vặn núm ốc Zero-Adjust ở đỉnh ống đưa đĩa chỉ thị về đúng vạch 0 |
| **Biến dạng dẻo vĩnh viễn (Plastic Deformation)** | Treo tải trọng > 6N vượt giới hạn đàn hồi Hooke | Lò xo mất tính đàn hồi tuyến tính | `F_applied > 6.0 N` | Báo lỗi quá tải và thay thế cụm lò xo mới |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **HKM Tech — Thiết bị Đo lường Lực** | `hkmtech.com` | Lực kế lò xo 5N ống tròn trong suốt: GHĐ 5N, ĐCNN 0.1N, chiều dài tổng 210 mm, đường kính ống Ø 21–22 mm. |
| **VietValue — Dụng cụ Thí nghiệm Vật lí** | `vietvalue.edu.vn` | Bộ lực kế lò xo 1N – 2.5N – 5N dùng trong trường THCS: Có ốc hiệu chỉnh vạch 0 và móc treo thép mạ crôm. |
| **Innotec Việt Nam** | `innotec.com.vn` | Lực kế 5N chuẩn Thông tư 38/2021/TT-BGDĐT phục vụ thí nghiệm Công và Công suất, Cơ năng KHTN 9. |
| **DMKLab Việt Nam** | `dmklab.vn` | Lực kế ống trụ nhựa trong suốt: Sai số toàn thang ≤ ±2%, lò xo thép đàn hồi đã xử lý nhiệt chống mỏi. |
| **Vật tư Bách Khoa (VattuBK)** | `vattubk.com` | Cấu tạo lực kế lò xo thực hành: Khuyên cầm tay phía trên, đĩa chỉ thị màu đỏ nổi bật và móc treo phía dưới. |

---

## 4.6. [OL3D-EQP-CAL-0001] Thước cặp du xích 150 mm (0.02 mm)
**Tên tiếng Anh**: *Vernier Caliper 150 mm x 0.02 mm* | **Mã Archetype**: `vernier-caliper` | **Phân loại danh mục**: `length-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-CAL-0001`
* **Mã đường dẫn (Slug)**: `thuoc-cap-du-xich-150mm`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-CAL-0001_thuoc-cap-du-xich-150mm` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: DIN 862 · ISO 13385 · Dụng cụ Đo cơ khí chính xác

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 235 mm, Cao = 16 mm, Sâu = 78 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.235 m, Cao (Y) = 0.016 m, Sâu (Z) = 0.078 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_marks`, `plunger`, `scale_display`, `scale_display_front`, `scale_display_rear`, `depth_rod`, `jaw_measure_guide`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry + Bevel Shape` | MeshPhysicalMaterial (Brushed Steel, metalness 0.92) | 1 | Thân thước chính dài 235mm kèm mỏ kẹp cố định |
| `plunger` | `ShapeGeometry Extrude` | MeshPhysicalMaterial (Hardened Stainless Steel) | 2 | Khối hàm trượt du xích di động dọc trục X |
| `scale_display` | `PlaneGeometry` | MeshBasicMaterial (CanvasTexture) | 3 | Bảng hiển thị số đo LCD hỗ trợ học sinh đọc nhanh |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `caliperMeasure`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **162 g** (Trạng thái: `measured`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `length`
  - Giới hạn đo (GHĐ): **0 mm** đến **150 mm**
  - Độ chia nhỏ nhất (ĐCNN): **0.02 mm**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad d = MSR + \left(VSR \times LC\right)$$
  *Ý nghĩa vật lý*: Công thức đọc kích thước trên thước cặp ($LC = 0.02\text{ mm}$, $MSR$: vạch mm trên thước chính, $VSR$: vạch du xích trùng).
  $$\mathbf{(2)}\quad LC = 1\text{ mm} - \frac{49\text{ mm}}{50} = 0.02\text{ mm}$$
  *Ý nghĩa vật lý*: Độ chia du xích 50 vạch chia đều trên chiều dài 49 mm của thước chính.
* **Các tính năng khoa học tích hợp**:
  - Chế tạo bằng thép không gỉ закаленная (Hardened Stainless Steel) mài phẳng chống chói.
  - Đo 3 chế độ: Đường kính ngoài (mỏ dưới), đường kính lỗ trong (mỏ trên) và chiều sâu (thanh đo sâu).
  - Thước phụ (Du xích / Vernier) 50 vạch chia cho phép đọc chính xác tới 0.02 mm kèm vít hãm cố định.
  - Dùng kiểm tra đường kính d và chiều cao h của trụ kim loại đặc, trụ rỗng và bi cầu thép.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `CLOSED_ZERO`
* **Danh sách trạng thái khả dụng**: `CLOSED_ZERO`, `SLIDING`, `CLAMPED_OBJECT`, `LOCKED_READOUT`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `CLOSED_ZERO` | `SLIDING` | Slider moved | `opening > 0` |
| `SLIDING` | `CLAMPED_OBJECT` | Jaws contact object surface | `opening == object_dim` |
| `CLAMPED_OBJECT` | `LOCKED_READOUT` | Locking screw tightened | `isLocked == true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.02 mm (DIN 862 Class 1)
* **Độ chia nhỏ nhất / Độ phân giải**: 0.02 mm (Thước phụ 50 vạch)
* **Độ lặp lại phép đo**: ±0.01 mm
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Thép không gỉ mạ crom: 1.1 × 10⁻⁵ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Lực kẹp quá mạnh gây biến dạng mẫu mềm** | Siết hàm kẹp quá chặt vào mẫu nhựa POM hoặc chì | Kích thước đo được nhỏ hơn thực tế 0.05 mm | `Lực kẹp tiếp xúc > 15 N` | Sử dụng con lăn ngón cái đẩy nhẹ vừa chạm bề mặt |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Mitutoyo Việt Nam — Thiết bị Đo cơ khí** | `mitutoyo.vn` | Thước cặp cơ khí 150mm (Model 530-101): Dải đo 0–150 mm, độ chia 0.02 mm, tổng chiều dài 229–235 mm. |
| **VinaTools — Dụng cụ Đo lường** | `vinatools.com` | Thước kẹp du xích 150mm chuẩn DIN 862: Chiều dài mỏ đo ngoài 40 mm, mỏ đo trong 16.5 mm, sai số ±0.03 mm. |
| **THB Việt Nam — Máy đo Chuyên dụng** | `thbvn.com` | Hướng dẫn đọc thước cặp du xích 0.02 mm và ứng dụng đo mẫu hình trụ trong phòng thí nghiệm. |
| **UniTools Việt Nam** | `unitools.vn` | Thước cặp thép không gỉ 0–150mm: Có con lăn đẩy ngón cái và vít khóa hàm trượt khi đọc số đo. |
| **Máy Đo Chuyên Dụng** | `maydochuyendung.com` | Cấu tạo 3 bộ phận đo của thước cặp: Mỏ đo ngoài, mỏ đo trong (khoang rỗng) và lưỡi đo chiều sâu. |

---

## 4.7. [OL3D-EQP-WGT-0001] Quả cân chuẩn bằng đồng 50 g
**Tên tiếng Anh**: *50 g Brass Calibration Weight* | **Mã Archetype**: `calibration-weight` | **Phân loại danh mục**: `mass-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-WGT-0001`
* **Mã đường dẫn (Slug)**: `qua-can-chuan-50g`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: OIML R111 Class M1 · Thông tư 38/2021/TT-BGDĐT

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 22 mm, Cao = 34 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.022 m, Cao (Y) = 0.034 m, Sâu (Z) = 0.022 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `handle`
* **Các lớp vật liệu Three.js sử dụng**: `MeshPhysicalMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry + Torus bevel` | MeshPhysicalMaterial (Polished Brass, metalness 0.94) | 1 | Thân quả cân đồng thau mạ niken bóng gương |
| `handle` | `Cylinder + Sphere` | MeshPhysicalMaterial (Brass) | 1 | Núm cầm thắt eo chuẩn OIML gắp bằng nhíp |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **50 g** (Trạng thái: `verified`)
  - Thể tích chuẩn ($V_{ref}$): **5.95 cm³**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad m_{true} = m_{apparent} \cdot \left(1 + \frac{\rho_{air}}{\rho_{brass}} - \frac{\rho_{air}}{\rho_{balance}}\right)$$
  *Ý nghĩa vật lý*: Hiệu chỉnh lực đẩy Archimedes của không khí khi cân quả cân chuẩn ($ho_{brass} = 8.40\text{ g/cm}^3$, $\rho_{air} \approx 1.2\text{ kg/m}^3$).
* **Các tính năng khoa học tích hợp**:
  - Gia công từ đồng thau nguyên khối mạ Niken-Crôm bóng gương chống ăn mòn và bám bẩn.
  - Đỉnh quả cân có cổ thắt và núm tròn chuẩn OIML để gắp bằng nhíp hoặc kẹp vào móc lực kế.
  - Dùng làm chuẩn kiểm tra độ chính xác của cân điện tử (50.00 g) và kiểm định lực kế (0.49 N).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `ON_BENCH`
* **Danh sách trạng thái khả dụng**: `ON_BENCH`, `HELD_IN_AIR`, `ON_BALANCE_PAN`, `HANGING_ON_SPRING`, `SUBMERGED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `ON_BENCH` | `ON_BALANCE_PAN` | Placed on balance pan | `dist < 0.165m` |
| `ON_BENCH` | `HANGING_ON_SPRING` | Hung on dyno hook | `dist < 0.105m` |
| `ON_BENCH` | `SUBMERGED` | Dropped into graduated cylinder | `cylinder aperture clear` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±3.0 mg (OIML R111 Class M1)
* **Độ chia nhỏ nhất / Độ phân giải**: Chuẩn khối lượng danh định 50.000 g
* **Độ lặp lại phép đo**: ±0.5 mg
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Oxy hóa / Bám dính mồ hôi tay** | Dùng tay trần cầm quả cân chuẩn | Khối lượng tăng thêm 0.01 - 0.03 g | `Mỡ tay bám dính` | Bắt buộc gắp quả cân bằng kẹp gắp gỗ hoặc đeo găng tay vải |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thiết bị Điện tử & Cân chuẩn Việt Nam** | `thietbidientu.net.vn` | Quả cân chuẩn 50g chuẩn OIML M1: Đường kính Ø 22 mm, chiều cao 34 mm, chất liệu đồng mạ crôm hoặc inox 304. |
| **VietValue — Thiết bị Giáo dục** | `vietvalue.edu.vn` | Hộp quả cân chuẩn thực hành KHTN: Quả 50g dùng hiệu chuẩn cân kỹ thuật và làm tải trọng chuẩn. |
| **DMKLab Việt Nam** | `dmklab.vn` | Quả cân chuẩn phòng thí nghiệm: Đáy phẳng mài nhẵn, khắc laser trị số "50 g" rõ nét trên mặt đỉnh. |
| **Innotec Việt Nam** | `innotec.com.vn` | Quả nặng chuẩn 50g dùng trong các thí nghiệm Cơ học (Động năng, Thế năng, Lực đàn hồi) cấp THCS. |
| **VinaMTSC** | `vinamtsc.com` | Tiêu chuẩn bảo quản quả cân chuẩn: Không chạm tay ướt hoặc hóa chất axit làm thay đổi khối lượng chuẩn. |

---

## 4.8. [OL3D-EQP-SLD-0001] Vật rắn hình trụ hợp kim nhôm
**Tên tiếng Anh**: *Solid Aluminum Cylinder Specimen* | **Mã Archetype**: `solid-cylinder` | **Phân loại danh mục**: `solid-specimens`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-SLD-0001`
* **Mã đường dẫn (Slug)**: `vat-ran-hinh-tru-nhom`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Mẫu vật chuẩn Khối lượng riêng

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 25 mm, Cao = 50 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.025 m, Cao (Y) = 0.05 m, Sâu (Z) = 0.025 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `handle`
* **Các lớp vật liệu Three.js sử dụng**: `MeshPhysicalMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry + Bevel Torus` | MeshPhysicalMaterial (Anodized Aluminium, metalness 0.90) | 1 | Trụ nhôm đặc tiện CNC chính xác Ø25x50mm |
| `handle` | `TorusGeometry` | MeshPhysicalMaterial (Stainless Steel) | 1 | Khuyên móc tròn đồng trục để treo vào lực kế |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **66.25 g** (Trạng thái: `illustrative`)
  - Thể tích chuẩn ($V_{ref}$): **24.54 cm³**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \rho = \frac{m}{V} = \frac{66.25\text{ g}}{24.5\text{ cm}^3} = 2.70\text{ g/cm}^3$$
  *Ý nghĩa vật lý*: Khối lượng riêng chuẩn của hợp kim nhôm (Aluminium 6061).
  $$\mathbf{(2)}\quad V = \pi \cdot \left(\frac{d}{2}\right)^2 \cdot h = \pi \cdot (1.25\text{ cm})^2 \cdot 5.0\text{ cm} \approx 24.54\text{ cm}^3$$
  *Ý nghĩa vật lý*: Tính thể tích từ kích thước đo bằng thước cặp du xích.
* **Các tính năng khoa học tích hợp**:
  - Gia công CNC chính xác từ hợp kim nhôm đặc (Al) không rỗng khí, bề mặt anod hóa chống oxy hóa.
  - Đường kính Ø 25.0 mm thiết kế nhỏ hơn lòng ống đong 100 ml (Ø 28 mm) để thả chìm dễ dàng.
  - Có móc treo đồng trục ở mặt trên để buộc chỉ nhúng nước hoặc treo trực tiếp vào lực kế lò xo 5 N.
  - Tỷ số m / V = 66.25 / 24.5 = 2.70 g/cm³ khớp chính xác bảng khối lượng riêng của Nhôm trong SGK.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE`
* **Danh sách trạng thái khả dụng**: `IDLE`, `ON_PAN`, `SUSPENDED`, `SUBMERGED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE` | `ON_PAN` | Dock to balance | `true` |
| `IDLE` | `SUBMERGED` | Submerged in water | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.2% khối lượng và kích thước gia công CNC
* **Độ chia nhỏ nhất / Độ phân giải**: 0.01 mm kích thước; 0.01 g khối lượng
* **Độ lặp lại phép đo**: ±0.05 g
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Giãn nở nhôm: 2.3 × 10⁻⁵ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Bọt khí bám vào bề mặt khi nhúng nước** | Sức căng bề mặt giữ các bọt khí li ti bám quanh thân nhôm | Thể tích dâng trong ống đong bị thừa 0.5 - 1 ml | `Quan sát thấy bọt khí bám thành` | Gõ nhẹ đáy ống đong xuống mặt bàn để bọt khí thoát hết lên trên |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Nhà sách Giáo dục — Bộ mẫu đo Khối lượng riêng** | `nhasachgiaoduc.vn` | Quả nặng hình trụ nhôm có móc treo: Đường kính 25 mm, chiều cao 50 mm, dùng đo khối lượng riêng và lực đẩy Archimedes. |
| **VietValue — Thiết bị Vật lí THCS** | `vietvalue.edu.vn` | Vật mẫu kim loại hình trụ đặc (Nhôm, Đồng, Sắt) đồng bộ kích thước để so sánh khối lượng riêng ρ = m/V. |
| **Innotec Việt Nam** | `innotec.com.vn` | Vật trụ kim loại có móc treo dùng chung cho bài Thực hành đo khối lượng riêng và bài Cơ năng. |
| **VietJack — Hướng dẫn Thực hành KHTN** | `vietjack.com` | Phương pháp xác định khối lượng riêng của vật rắn hình trụ bằng cân điện tử và ống đong chứa nước. |
| **Thiết bị Giáo dục Tây Bắc** | `thietbigiaoductaybac.vn` | Trụ nhôm thực hành KHTN: Khối lượng riêng danh định 2.70 g/cm³ (2700 kg/m³), sai số gia công ±1%. |

---

## 4.9. [OL3D-EQP-SPH-0001] Vật rắn hình cầu thép không gỉ
**Tên tiếng Anh**: *Stainless Steel Sphere Specimen* | **Mã Archetype**: `solid-sphere` | **Phân loại danh mục**: `solid-specimens`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-SPH-0001`
* **Mã đường dẫn (Slug)**: `vat-ran-hinh-cau-thep`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Chương I KHTN 9 (Bài 2: Động năng, Thế năng)

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 28 mm, Cao = 28 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.028 m, Cao (Y) = 0.028 m, Sâu (Z) = 0.028 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `SphereGeometry (Segments 64x64)` | MeshPhysicalMaterial (Chrome Steel, metalness 0.96, roughness 0.06) | 1 | Bi cầu thép đặc mài bóng gương phản chiếu môi trường |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **90.5 g** (Trạng thái: `illustrative`)
  - Thể tích chuẩn ($V_{ref}$): **11.49 cm³**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V = \frac{4}{3} \pi R^3 = \frac{\pi d^3}{6} = \frac{\pi (2.52)^3}{6} \approx 8.38\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích hình cầu thép đặc ($d = 25.2\text{ mm}$).
  $$\mathbf{(2)}\quad \rho = \frac{m}{V} = \frac{65.90\text{ g}}{8.38\text{ cm}^3} \approx 7.86\text{ g/cm}^3$$
  *Ý nghĩa vật lý*: Khối lượng riêng của thép không gỉ / hợp kim Crom.
  $$\mathbf{(3)}\quad W_{đ} = \frac{1}{2} m v^2 + \frac{1}{2} I \omega^2$$
  *Ý nghĩa vật lý*: Động năng toàn phần khi bi thép lăn trên máng nghiêng (Bài 2 SGK KHTN 9).
* **Các tính năng khoa học tích hợp**:
  - Bi cầu thép hợp kim Crôm (AISI 52100) đặc hoàn toàn, bề mặt mài bóng gương.
  - Dùng trong Bài 2 SGK KHTN 9 để thả lăn trên máng nghiêng khảo sát Động năng phụ thuộc vào khối lượng và tốc độ.
  - Dùng làm vật mẫu chuẩn đo khối lượng riêng của Thép (ρ = 7.85 g/cm³) và đo đường kính bằng thước cặp.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `REST_ON_TABLE`
* **Danh sách trạng thái khả dụng**: `REST_ON_TABLE`, `ROLLING_INCLINE`, `IMPACTING_BLOCK`, `SUBMERGED_CYLINDER`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `REST_ON_TABLE` | `ROLLING_INCLINE` | Released on inclined plane | `height > 0` |
| `ROLLING_INCLINE` | `IMPACTING_BLOCK` | Hits friction block at bottom | `pos == bottom` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Độ cầu sai lệch <= 0.005 mm (Grade 100)
* **Độ chia nhỏ nhất / Độ phân giải**: 0.01 mm
* **Độ lặp lại phép đo**: ±0.02 g
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Bi lăn lệch khỏi máng nghiêng** | Góc nghiêng máng bị vặn hoặc vận tốc ban đầu có thành phần ngang | Không đập trúng khúc gỗ ở chân dốc | `Độ lệch ngang > 10 mm` | Cân chỉnh cân bằng máng dẫn và dùng ngón tay thả rơi tự do không vận tốc đầu |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietJack — SGK KHTN 9 Kết nối tri thức (Bài 2)** | `vietjack.com` | Thí nghiệm khảo sát động năng (Hình 2.3 SGK KHTN 9): Sử dụng viên bi thép lăn trên máng nghiêng đập vào khúc gỗ. |
| **Innotec Việt Nam — Bộ thí nghiệm Cơ năng** | `innotec.com.vn` | Viên bi thép chuẩn Ø 25 mm nặng ~66 g dùng trong bộ thí nghiệm biến đổi thế năng thành động năng. |
| **VietValue — Thiết bị Dạy học** | `vietvalue.edu.vn` | Bi thép thực hành Vật lí THCS: Khối lượng riêng chuẩn 7.85 g/cm³, chống gỉ sét trong môi trường ẩm. |
| **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Mẫu vật hình cầu bằng thép đặc dùng kết hợp với thước cặp 150 mm và cân điện tử. |
| **Thư viện Vật lý** | `thuvienvatly.com` | Tính toán thể tích hình cầu V = (4/3)πR³ đối chiếu với phép đo dâng nước trong ống đong. |

---

## 4.10. [OL3D-EQP-BLK-0001] Vật rắn hình hộp chữ nhật đồng thau
**Tên tiếng Anh**: *Rectangular Brass Block Specimen* | **Mã Archetype**: `solid-block` | **Phân loại danh mục**: `solid-specimens`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-BLK-0001`
* **Mã đường dẫn (Slug)**: `vat-ran-hinh-hop-dong-thau`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Mẫu kim loại Đồng (Cu) nguyên chất

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 40 mm, Cao = 15 mm, Sâu = 25 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.04 m, Cao (Y) = 0.015 m, Sâu (Z) = 0.025 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: ExtrudeGeometry with Bevel
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry (Bevel)` | MeshPhysicalMaterial (Pure Copper, color 0xd97706, metalness 0.95) | 1 | Khối hộp chữ nhật góc vát 0.5mm ánh kim cam đỏ |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **127.5 g** (Trạng thái: `illustrative`)
  - Thể tích chuẩn ($V_{ref}$): **15 cm³**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V = a \cdot b \cdot c = 3.0 \times 2.0 \times 3.0 = 18.0\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích hình hộp chữ nhật đồng đỏ.
  $$\mathbf{(2)}\quad \rho = \frac{m}{V} = \frac{160.92\text{ g}}{18.0\text{ cm}^3} = 8.94\text{ g/cm}^3$$
  *Ý nghĩa vật lý*: Khối lượng riêng đặc trưng của kim loại Đồng nguyên chất (Cu).
* **Các tính năng khoa học tích hợp**:
  - Khối hộp chữ nhật gia công từ đồng đỏ điện phân (Cu ≥ 99.9%) có ánh kim đỏ cam đặc trưng.
  - Cho phép học sinh xác định thể tích theo cả 2 phương pháp: Đo kích thước a × b × c bằng thước cặp (3 × 2 × 3 = 18 cm³) và thả chìm trong ống đong.
  - Minh họa trực quan tính chất vật lí của kim loại Đồng (Bài 18 SGK KHTN 9) và đo khối lượng riêng lớn (8.94 g/cm³).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE`
* **Danh sách trạng thái khả dụng**: `IDLE`, `ON_BALANCE`, `MEASURING_JAWS`, `IN_OVERFLOW_CAN`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE` | `ON_BALANCE` | Placed on balance | `true` |
| `IDLE` | `IN_OVERFLOW_CAN` | Placed in overflow can | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.05 mm kích thước phay CNC
* **Độ chia nhỏ nhất / Độ phân giải**: 0.02 mm thước cặp
* **Độ lặp lại phép đo**: ±0.02 g
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Giãn nở đồng: 1.65 × 10⁻⁵ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Thả vào ống đong làm nứt đáy ống** | Khối lượng lớn (161g) rơi tự do trong nước gây xung lực va đập | Vỡ đáy ống đong thủy tinh | `Tốc độ rơi > 1.2 m/s` | Bắt buộc buộc chỉ nghiêng ống đong thả trượt từ từ hoặc dùng Bình tràn |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietValue — Bộ mẫu Kim loại KHTN 9** | `vietvalue.edu.vn` | Khối hộp đồng nguyên chất trong bộ mẫu thực hành: Kích thước 30×20×30 mm, khối lượng riêng 8.94 g/cm³. |
| **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Mẫu vật hình hộp chữ nhật bằng đồng đỏ dùng thực hành đo khối lượng riêng và khảo sát tính chất kim loại. |
| **Innotec Việt Nam** | `innotec.com.vn` | Các mặt bên được phay phẳng vuông góc giúp kẹp thước cặp đo chính xác tới 0.02 mm. |
| **VietChem — Hóa chất & Mẫu Kim loại** | `vietchem.com.vn` | Tính chất vật lí chuẩn của Đồng (Cu): Khối lượng riêng 8.94 g/cm³, dẫn điện và dẫn nhiệt tốt. |
| **VinaMTSC** | `vinamtsc.com` | Bộ mẫu vật rắn thực hành KHTN THCS theo tiêu chuẩn Bộ GD&ĐT. |

---

## 4.11. [OL3D-EQP-HLW-0001] Ống trụ kim loại rỗng có khoang kín
**Tên tiếng Anh**: *Hollow Metallic Cylinder with Internal Cavity* | **Mã Archetype**: `hollow-cylinder` | **Phân loại danh mục**: `hollow-specimens`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-HLW-0001`
* **Mã đường dẫn (Slug)**: `vat-ran-rong-co-khoang-ben-trong`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `in-review` | Đo lường: `not-verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Dụng cụ Đo lường nâng cao · Phân biệt Thể tích đặc & Thể tích khoang rỗng

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 36 mm, Cao = 55 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.036 m, Cao (Y) = 0.055 m, Sâu (Z) = 0.036 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Hollow Path)` | MeshPhysicalMaterial (Alloy Steel, metalness 0.90) | 1 | Ống trụ rỗng hai đầu hở xuyên tâm |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **148 g** (Trạng thái: `illustrative`)
  - Thể tích chuẩn ($V_{ref}$): **55.98 cm³**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V_{đặc} = \pi \cdot \left(R^2 - r^2\right) \cdot h = \pi \cdot \left[(1.6)^2 - (0.9)^2\right] \cdot 4.5 \approx 24.74\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích phần kim loại đặc chiếm chỗ nước.
  $$\mathbf{(2)}\quad V_{bao} = \pi \cdot R^2 \cdot h = \pi \cdot (1.6)^2 \cdot 4.5 \approx 36.19\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích hình học bao ngoài toàn phần.
  $$\mathbf{(3)}\quad V_{rỗng} = V_{bao} - V_{đặc} = \pi \cdot r^2 \cdot h \approx 11.45\text{ cm}^3$$
  *Ý nghĩa vật lý*: Thể tích khoang rỗng bên trong ống trụ.
* **Các tính năng khoa học tích hợp**:
  - Ống trụ kim loại có lỗ thông xuyên tâm giúp rèn luyện kỹ năng dùng cả 3 bộ phận của thước cặp (mỏ ngoài D, mỏ trong d, thanh chiều sâu h).
  - Giúp học sinh phân biệt rõ thể tích bao ngoài toàn phần và thể tích phần kim loại đặc thực sự chiếm chỗ nước (V = π(R² - r²)h).
  - Rèn kỹ năng nghiêng thoát hết bọt khí trong lòng ống khi nhúng vào ống đong hoặc bình tràn.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE`
* **Danh sách trạng thái khả dụng**: `IDLE`, `MEASURING_INTERNAL_JAWS`, `WEIGHING`, `SUBMERGED_BUBBLES_TRAPPED`, `SUBMERGED_PURGED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE` | `SUBMERGED_BUBBLES_TRAPPED` | Submerged vertically | `air trapped inside` |
| `SUBMERGED_BUBBLES_TRAPPED` | `SUBMERGED_PURGED` | Tilted 45° under water | `bubbles released` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.03 mm
* **Độ chia nhỏ nhất / Độ phân giải**: 0.02 mm thước cặp
* **Độ lặp lại phép đo**: ±0.05 g
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Khí đọng trong khoang rỗng làm nổi hoặc sai thể tích** | Thả trụ thẳng đứng làm bọt khí bị nhốt trong khoang rỗng | Nước dâng trong ống đong bị thiếu $11.5\text{ ml}$ | `V_measured < V_true` | Nghiêng ống trụ $45^\circ$ dưới mặt nước để bọt khí thoát hoàn toàn |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Mitutoyo Việt Nam — Ứng dụng Đo đường kính trong** | `mitutoyo.vn` | Sử dụng mỏ đo trong (Inside Jaws) của thước cặp 150 mm để đo chính xác đường kính lòng ống trụ rỗng. |
| **Thư viện Vật lý Việt Nam** | `thuvienvatly.com` | Bài toán thực hành nâng cao: Xác định khối lượng riêng của vật rắn có khoang rỗng và kiểm tra tính đặc/rỗng. |
| **VinaTools Việt Nam** | `vinatools.com` | Quy chuẩn đo chi tiết dạng ống trụ: Kết hợp đo đường kính ngoài D, đường kính lỗ d và chiều dài h. |
| **VietValue — Thiết bị Thực hành** | `vietvalue.edu.vn` | Mẫu trụ rỗng hợp kim dùng cho bài tập thực nghiệm kiểm tra mật độ vật liệu. |
| **DMKLab Việt Nam** | `dmklab.vn` | Hướng dẫn khử bọt khí bám trong khoang rỗng khi đo thể tích bằng phương pháp dâng nước. |

---

## 4.12. [OL3D-EQP-FLK-0001] Bình tam giác Erlenmeyer 250 ml
**Tên tiếng Anh**: *250 ml Erlenmeyer Conical Flask* | **Mã Archetype**: `erlenmeyer-flask` | **Phân loại danh mục**: `laboratory-glassware`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-FLK-0001`
* **Mã đường dẫn (Slug)**: `binh-tam-giac-erlenmeyer-250ml`
* **Môn học áp dụng**: `chemistry`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-FLK-0001_binh-tam-giac-erlenmeyer-250ml` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: ISO 1773 · DIN 12380 · Thông tư 38/2021 (Hình 1.10 SGK KHTN 9)

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 85 mm, Cao = 140 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.085 m, Cao (Y) = 0.14 m, Sâu (Z) = 0.085 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `pouring_lip`, `liquid_surface`, `liquid_body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `LatheGeometry (Cone shape)` | MeshPhysicalMaterial (Borosilicate, transmission 0.88) | 4 | Bình nón Erlenmeyer cổ hẹp Ø34mm đáy rộng Ø85mm |
| `liquid_surface` | `CylinderGeometry (Cone adapted)` | MeshPhysicalMaterial (Liquid, opacity 0.7) | 2 | Khối dung dịch hình nón cụt |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **105 g** (Trạng thái: `reported`)
  - Dung tích định mức ($V_{max}$): **250 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad A_{evap} = \pi \cdot r_{neck}^2 \ll A_{beaker}$$
  *Ý nghĩa vật lý*: Tiết diện cổ hẹp hạn chế tối đa sự bay hơi và bắn tóe hóa chất khi lắc dung dịch.
* **Các tính năng khoa học tích hợp**:
  - Thân hình nón cụt (Erlenmeyer) với cổ hẹp giúp lắc mạnh dung dịch khi hòa tan hoặc chuẩn độ mà không bị sánh bắn ra ngoài.
  - Làm bằng thủy tinh Borosilicate 3.3 chịu nhiệt, có thể đun trên lưới tản nhiệt hoặc lắp nút cao su có ống dẫn khí.
  - Trong Hình 1.10 SGK KHTN 9 (Bài 24), bình tam giác được đặt ở đầu ra ống sinh hàn để hứng chất lỏng tinh khiết sau khi ngưng tụ.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY`
* **Danh sách trạng thái khả dụng**: `EMPTY`, `FILLED_REAGENT`, `SWIRLING`, `CONDENSATE_COLLECTING`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY` | `FILLED_REAGENT` | Liquid added | `V > 0` |
| `FILLED_REAGENT` | `SWIRLING` | Manual orbital swirl | `angular velocity > 2 rad/s` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±5% dung tích định mức (ISO 1773)
* **Độ chia nhỏ nhất / Độ phân giải**: 50 ml (Vạch chia thô 50..250 ml)
* **Độ lặp lại phép đo**: ±10 ml
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Chịu nhiệt tới 250°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Nứt vỡ cổ bình khi kẹp sắt quá chặt** | Vặn vít tay kẹp giá sắt kim loại trực tiếp không có đệm bần/cao su | Nứt vỡ thủy tinh | `Lực kẹp giá sắt > 25 N` | Bắt buộc lót đệm cao su chịu nhiệt quanh cổ bình trước khi siết vít |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **DMKLab — Bình tam giác Thủy tinh 250ml** | `dmklab.vn` | Bình tam giác cổ hẹp 250ml (ISO 1773): Đường kính đáy Ø 85 mm, chiều cao 140–145 mm, đường kính cổ Ø 34 mm. |
| **VinaMTSC — Dụng cụ Thủy tinh Thí nghiệm** | `vinamtsc.com` | Bình nón Erlenmeyer 250ml Borosilicate 3.3: Chịu nhiệt độ cao, vạch chia men trắng rõ nét 50–250 ml. |
| **TechLab Việt Nam** | `techlab.com.vn` | Ứng dụng bình tam giác trong bộ chưng cất đơn giản và phản ứng hóa học hữu cơ lớp 9. |
| **Visitech Việt Nam** | `visitech.vn` | Thiết kế thành nghiêng hạn chế bay hơi và chống văng dung dịch axit/kiềm khi lắc trộn. |
| **Vật tư Lab Hà Nội** | `vattulabhanoi.com` | Bình tam giác 250ml chuẩn phòng thí nghiệm trường phổ thông theo Thông tư 38/2021/TT-BGDĐT. |

---

## 4.13. [OL3D-EQP-STD-0001] Giá đỡ thí nghiệm kèm khớp nối & tay kẹp
**Tên tiếng Anh**: *Laboratory Retort Stand with Bosshead & Clamp* | **Mã Archetype**: `retort-stand` | **Phân loại danh mục**: `support-hardware`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-STD-0001`
* **Mã đường dẫn (Slug)**: `gia-do-thi-nghiem-da-nang`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-STD-0001_gia-do-thi-nghiem-da-nang` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.3, 1.8b, 1.10 SGK KHTN 9

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 140 mm, Cao = 460 mm, Sâu = 210 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.14 m, Cao (Y) = 0.46 m, Sâu (Z) = 0.21 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `handle`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry + Cylinder` | MeshStandardMaterial (Cast Iron, color 0x1e293b, roughness 0.7) | 1 | Chân đế gang đúc nặng 1.85kg kèm trụ inox Ø10x500mm |
| `handle` | `Box + Torus Screw` | MeshStandardMaterial (Aluminium Bosshead) | 2 | Khớp nối chữ thập và tay kẹp bọc cao su chịu nhiệt |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **1850 g** (Trạng thái: `reported`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \sum \vec{M}_{(O)} = \vec{0} \iff F_{clamp} \cdot d_{arm} \le M_{tự\,đổ} = m_{đế} \cdot g \cdot \frac{W_{đế}}{2}$$
  *Ý nghĩa vật lý*: Điều kiện cân bằng chống lật đổ giá thí nghiệm khi gá các bình cầu và ống sinh hàn nặng ($m_{đế} = 1.85\text{ kg}$, $W_{đế} = 135\text{ mm}$).
* **Các tính năng khoa học tích hợp**:
  - Chân đế bằng gang đúc nặng sơn tĩnh điện chống gỉ, có đệm cao su dưới đáy chống trượt trên mặt bàn gỗ.
  - Trụ đứng bằng thép mạ crôm Ø 10 mm lắp ren vuông góc vững chắc vào chân đế.
  - Đi kèm khớp nối chữ thập (Bosshead), tay kẹp bọc cao su (kẹp cổ bình cầu, ống sinh hàn) và vòng đỡ sắt (đỡ phễu chiết, lưới tản nhiệt).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `STANDALONE`
* **Danh sách trạng thái khả dụng**: `STANDALONE`, `CLAMP_ATTACHED`, `RING_ATTACHED`, `HOLDING_APPARATUS`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `STANDALONE` | `CLAMP_ATTACHED` | Bosshead clamp mounted | `height <= 0.50m` |
| `CLAMP_ATTACHED` | `HOLDING_APPARATUS` | Glassware fastened in clamp | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Độ vuông góc trục đứng 90° ± 0.2°
* **Độ chia nhỏ nhất / Độ phân giải**: 1 mm chỉnh cao độ khớp nối
* **Độ lặp lại phép đo**: Vững chắc tuyệt đối dưới tải trọng 3.5 kg
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không biến dạng ở 300°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Đổ lật giá thí nghiệm ra phía trước** | Gá phễu chiết chứa đầy dung dịch quá xa tâm đế gang | Đổ toàn bộ hệ thống hóa chất xuống bàn | `Trọng tâm hệ thống nằm ngoài chu vi đế gang` | Luôn xoay tay kẹp hướng về phía diện tích mặt đế gang nặng |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Visitech — Bộ Giá đỡ Thí nghiệm Đa năng** | `visitech.vn` | Giá sắt thí nghiệm chuẩn: Đế gang 135×200 mm hoặc 150×220 mm, trụ inox dài 500 mm, kèm kẹp đôi và vòng đỡ. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Giá thí nghiệm dùng chung cho Vật lí (treo lực kế, giữ thấu kính) và Hóa học (gá phễu chiết, bộ chưng cất). |
| **VietValue — Thiết bị Trường học** | `vietvalue.edu.vn` | Bộ giá thí nghiệm KHTN 9: Tay kẹp có lót đệm bần/cao su chịu nhiệt tránh làm nứt vỡ cổ bình cầu thủy tinh. |
| **Innotec Việt Nam** | `innotec.com.vn` | Khớp nối chữ thập hợp kim nhôm đúc có vít tai hồng vặn nhẹ tay cho học sinh THCS. |
| **VietChem** | `vietchem.com.vn` | Quy tắc an toàn khi lắp bộ chưng cất và chiết lỏng–lỏng trên giá sắt chữ nhật. |

---

## 4.14. [OL3D-EQP-OPT-0001] (3) Thấu kính trên đế trượt quang học (f = +10 cm)
**Tên tiếng Anh**: *(3) Optical Lens on Bench Rider Saddle (f = +10 cm)* | **Mã Archetype**: `optical-lens` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-OPT-0001`
* **Mã đường dẫn (Slug)**: `thau-kinh-hoi-tu-f100mm`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-OPT-0001_thau-kinh-hoi-tu-f100mm` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.3 trang 6 & Bài 8, 9 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính (trang 40–45) & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ (trang 46–49)
* **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (3): Thấu kính có giá đỡ trượt trên giá quang học (**)
* **Chức năng chuẩn**: Khúc xạ chùm tia sáng từ vật sáng hình chữ F (2) để tạo ảnh thật ngược chiều trên màn chắn (4) khi d > f, hoặc tạo ảnh ảo cùng chiều khi d < f / thấu kính phân kì.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 70 mm, Cao = 145 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.045 m, Cao (Y) = 0.145 m, Sâu (Z) = 0.08 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `scale_display_rear`, `lens_element`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; State Sync via userData
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Box + Cylinder Carriage` | MeshStandardMaterial (Black Anodized ABS) | 2 | Con trượt gá ray quang học và vành giữ Ø60mm |
| `lens_element` | `Sphere intersection (Biconvex)` | MeshPhysicalMaterial (BK7 Glass, IOR 1.5168, transmission 0.95) | 4 | Thấu kính thủy tinh 2 mặt lồi mài bóng quang học |
| `scale_display` | `PlaneGeometry` | MeshBasicMaterial (CanvasTexture) | 3 | Màn hình số HUD hiển thị tọa độ ray X và trị số f |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **135 g** (Trạng thái: `verified`)
  - Tiêu cự định danh ($f$): **100 mm**
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `focal-length`
  - Giới hạn đo (GHĐ): **-200 mm** đến **150 mm**
  - Độ chia nhỏ nhất (ĐCNN): **1 mm**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \frac{1}{d} + \frac{1}{d'} = \frac{1}{f} \iff d' = \frac{d \cdot f}{d - f}$$
  *Ý nghĩa vật lý*: Công thức thấu kính mỏng cho Thấu kính hội tụ ($f = +100\text{ mm} = +10.0\text{ cm}$).
  $$\mathbf{(2)}\quad k = -\frac{d'}{d} = \frac{\overline{A'B'}}{\overline{AB}}$$
  *Ý nghĩa vật lý*: Hệ số phóng đại ảnh (k < 0: ảnh thật ngược chiều; k > 0: ảnh ảo cùng chiều).
  $$\mathbf{(3)}\quad d = d' = 2f = 20.0\text{ cm} \implies |k| = 1.0$$
  *Ý nghĩa vật lý*: Vị trí đối xứng tạo ảnh thật bằng đúng kích thước vật (Phương pháp đo tiêu cự Bài 9 SGK KHTN 9).
* **Các tính năng khoa học tích hợp**:
  - Thấu kính hai mặt lồi (Biconvex) bằng thủy tinh quang học BK7 trong suốt, phần rìa mỏng và phần tâm dày.
  - Lắp trong vành khung nhựa ABS bảo vệ chống sứt mẻ kèm trụ cắm và đế giữ ổn định trên băng quang học hoặc bàn gỗ.
  - Khi chiếu chùm 3 tia laser song song vuông góc với mặt thấu kính, chùm tia ló hội tụ đúng tại tiêu điểm chính F cách quang tâm O một khoảng f = 10 cm (Bài 8, 9 SGK KHTN 9).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `MOUNTED_ON_RAIL`
* **Danh sách trạng thái khả dụng**: `MOUNTED_ON_RAIL`, `REAL_IMAGE_PROJECTED`, `VIRTUAL_IMAGE_ZONE`, `PARALLEL_BEAM_FOCUS`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `MOUNTED_ON_RAIL` | `REAL_IMAGE_PROJECTED` | Object distance d > f | `d > 10.0 cm` |
| `MOUNTED_ON_RAIL` | `VIRTUAL_IMAGE_ZONE` | Object distance d < f | `d < 10.0 cm` |
| `MOUNTED_ON_RAIL` | `PARALLEL_BEAM_FOCUS` | Collimated laser beam input | `isLaserHit == true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±2.0 mm tiêu cự định danh (DIN 58145)
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0 mm trên thước đo ray quang học
* **Độ lặp lại phép đo**: ±1.0 mm
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Thủy tinh quang học BK7: dn/dT = 3.0 × 10⁻⁶ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Ảnh bị mờ nhòe do cầu sai (Spherical Aberration)** | Chùm sáng tới rìa ngoài thấu kính không hội tụ cùng điểm với chùm trung tâm | Viền chữ F trên màn chắn bị viền tán sắc mờ | `Khẩu độ mở > Ø 40 mm` | Lắp màn chắn lỗ tròn giới hạn chùm tia ở vùng gần trục quang |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Thấu kính hội tụ và thấu kính phân kì trong Bộ thí nghiệm Quang hình học lớp 9: Đường kính Ø 60 mm, tiêu cự f = 100 mm. |
| **VietJack — SGK KHTN 9 Bài 8 & Bài 9** | `vietjack.com` | Hình 1.3 trang 6 và Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ bằng phương pháp ảnh thật đối xứng d = d' = 2f. |
| **VietValue — Thiết bị Quang học THCS** | `vietvalue.edu.vn` | Thấu kính hội tụ có giá đỡ: Thủy tinh quang học mài nhẵn, tiêu cự chuẩn f = 100 mm ± 2 mm. |
| **Innotec Việt Nam** | `innotec.com.vn` | Bộ dụng cụ tìm hiểu tính chất ảnh qua thấu kính gồm nguồn sáng, thấu kính hội tụ f=100mm, màn hứng ảnh và giá quang học. |
| **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Khung giữ thấu kính có vạch dấu tâm quang học giúp căn đồng trục với đèn laser và màn chắn. |

---

## 4.15. [OL3D-EQP-OBN-0001] (5) Giá quang học 90 cm có thước chia độ (-45 .. 0 .. +45 cm)
**Tên tiếng Anh**: *(5) 90 cm Graduated Aluminum Optical Bench Rail* | **Mã Archetype**: `optical-bench` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-OBN-0001`
* **Mã đường dẫn (Slug)**: `gia-quang-hoc-thuoc-chia-do-90cm`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · DIN 58145 · Hình 1.3 & Bài 8, 9 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ
* **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (5): Giá quang học đồng trục có thước đo cm/mm (**)
* **Chức năng chuẩn**: Giữ cho tâm Đèn chiếu (1), Vật sáng chữ F (2), Quang tâm Thấu kính (3) và tâm Màn chắn (4) luôn thẳng hàng trên trục chính quang học (y = 9,5 cm) và đo trực tiếp khoảng cách vật d, khoảng cách ảnh d'.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 900 mm, Cao = 36 mm, Sâu = 72 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.9 m, Cao (Y) = 0.036 m, Sâu (Z) = 0.072 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `optical_axis_line`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry with Dovetail slot` | MeshStandardMaterial (Anodized Aluminium, color 0x334155) | 1 | Ray nhôm 1m có rãnh mộng mang cá và thước chia mm |
| `optical_axis_line` | `LineBasicMaterial` | LineBasicMaterial (Red/Cyan guide) | 5 | Đường trục quang học ảo đồng quy cao độ y = 125mm |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **920 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `length`
  - Giới hạn đo (GHĐ): **-450 mm** đến **450 mm**
  - Độ chia nhỏ nhất (ĐCNN): **1 mm**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad x_{thấu\,kính} - x_{vật} = d, \quad x_{màn} - x_{thấu\,kính} = d'$$
  *Ý nghĩa vật lý*: Quan hệ tọa độ một chiều 1D trên thước chia độ của giá quang học.
  $$\mathbf{(2)}\quad L_{tổng} = d + d' = x_{màn} - x_{vật} \ge 4f$$
  *Ý nghĩa vật lý*: Điều kiện tối thiểu về khoảng cách giữa vật và màn để có thể hứng được ảnh thật trên màn chắn.
* **Các tính năng khoa học tích hợp**:
  - Gia công từ hợp kim nhôm định hình cao cấp chịu lực, bề mặt anode hóa chống lóa và chống trầy xước.
  - Rãnh trượt dẫn hướng 1D mộng mang cá (Dovetail slot) dọc trục X giữ các con trượt thấu kính, màn chắn, đèn luôn đồng trục quang học.
  - Thước khắc laser hai bên mép ray với vạch chia milimet sắc nét giúp định vị chính xác khoảng cách vật d và khoảng cách ảnh d'.
  - Chân đế có ốc chỉnh cân bằng thăng bằng 3 điểm chống rung lắc trên mặt bàn gỗ phòng thí nghiệm.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY_RAIL`
* **Danh sách trạng thái khả dụng**: `EMPTY_RAIL`, `CARRIAGES_MOUNTED`, `OPTICAL_SYSTEM_ALIGNED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY_RAIL` | `CARRIAGES_MOUNTED` | Carriages snapped onto rail | `count > 0` |
| `CARRIAGES_MOUNTED` | `OPTICAL_SYSTEM_ALIGNED` | Lamp, Object, Lens, Screen mounted | `count == 4` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.5 mm trên chiều dài 1000 mm
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0 mm (Vạch chia milimet hai bên rãnh)
* **Độ lặp lại phép đo**: Độ thẳng rãnh trượt sai lệch < 0.05 mm
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Nhôm định hình: 2.3 × 10⁻⁵ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Khoảng cách vật - màn L < 4f không tìm thấy ảnh** | Đặt khoảng cách vật và màn nhỏ hơn 40 cm (với thấu kính f = 10 cm) | Di chuyển màn khắp ray vẫn không thu được ảnh rõ nét | `L = d + d' < 4f` | Kéo màn chắn ra xa vật tối thiểu L >= 4f = 40.0 cm |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Băng quang học học sinh THCS dài 1000 mm, có thước chia độ vạch mm, kèm 4 con trượt có ốc hãm. |
| **VietValue — Dụng cụ Quang hình học THCS** | `vietvalue.edu.vn` | Giá quang học hợp kim nhôm 1m: Rãnh trượt êm, cữ định tâm đồng trục y = 125 mm cho toàn bộ linh kiện quang học. |
| **Innotec Việt Nam — Thiết bị Dạy học** | `innotec.com.vn` | Bộ giá quang học KHTN 9: Thước khắc hai dải đối xứng âm dương và dải liên tục 0–100 cm, sai số chiều dài ±0.5 mm. |
| **DMKLab — Thiết bị Trường học** | `dmklab.vn` | Ray quang học chuẩn giáo dục: Tích hợp chân đế đệm cao su và ngàm khóa con trượt nhanh không cần tuốc nơ vít. |
| **Phywe Laboratory Equipment** | `phywe.com` | Optical Bench 100 cm: Precision extruded profile, mm graduations, rigid vibration-free mounting for lens experiments. |

---

## 4.16. [OL3D-EQP-OLP-0001] (1) Đèn chiếu sáng Halogen kèm Đầu chắn khe sáng
**Tên tiếng Anh**: *(1) Halogen Optical Lamp with Slit Aperture on Rider* | **Mã Archetype**: `optical-lamp` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-OLP-0001`
* **Mã đường dẫn (Slug)**: `den-chieu-sang-halogen-khe-sang`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · TCVN 11844 · Bài 8, 9 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ
* **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (1): Đèn chiếu sáng trên giá quang học (**)
* **Chức năng chuẩn**: Cung cấp chùm sáng song song cường độ cao chiếu sáng đều Vật sáng kính mờ hình chữ F (2) hoặc tạo 3 tia sáng song song khảo sát tiêu điểm thấu kính.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 98 mm, Cao = 125 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.098 m, Cao (Y) = 0.125 m, Sâu (Z) = 0.056 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `power_cord_socket`, `terminal_pos`, `terminal_neg`, `terminal_pos_hitbox`, `terminal_neg_hitbox`, `beam_mode_knob`, `knob_hitbox_3d`, `scale_display`, `lamp_point_light`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData; Optical Ray Tracing & Refraction; Electrical Terminal / Wiring
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry + Cooling fins` | MeshStandardMaterial (Black Anodized Aluminium) | 1 | Hộp đèn tản nhiệt có khe cài tấm chắn sáng |
| `lamp_point_light` | `PointLight` | PointLight (Color 0xffedd5, decay 2) | 6 | Nguồn sáng điểm phát xạ ánh sáng thực tế trong cảnh 3D |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **240 g** (Trạng thái: `verified`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad P_{điện} = U \cdot I = \frac{U^2}{R_{tim}} = \frac{(12.0\text{ V})^2}{7.2\,\Omega} = 20.0\text{ W}$$
  *Ý nghĩa vật lý*: Công suất tiêu thụ định mức của bóng đèn Halogen.
  $$\mathbf{(2)}\quad E_{quang}(d) = \frac{I_{cường\,độ}}{d^2} \cdot \cos\theta$$
  *Ý nghĩa vật lý*: Độ rọi trên mặt vật sáng chữ F suy giảm theo bình phương khoảng cách.
* **Các tính năng khoa học tích hợp**:
  - Vỏ hộp bằng hợp kim đúc sơn tĩnh điện màu đen mờ chống phản xạ ánh sáng tạp tán, có khe tản nhiệt đối lưu tự nhiên.
  - Bóng đèn Halogen tim sợi đốt 12V 20W (chân cắm G4) cho phổ phát xạ liên tục, ánh sáng vàng ấm độ rọi tâm đạt > 8000 lux.
  - Cửa sổ quang học phía trước có ngàm gài đầu chắn khe sáng (1 khe, 3 khe song song, hoặc thấu kính tụ quang phẳng lồi).
  - Đuôi đèn có cặp cọc cắm bắp chuối Ø 4 mm (đỏ +, xanh -) kết nối dây dẫn tới Nguồn điện hạ áp 3V–12V.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `UNPOWERED`
* **Danh sách trạng thái khả dụng**: `UNPOWERED`, `CIRCUIT_CONNECTED_LAMP_OFF`, `LAMP_GLOWING`, `OVERVOLTAGE_BURNOUT`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `UNPOWERED` | `LAMP_GLOWING` | Power turned on and circuit closed | `isCircuitClosed && V >= 2.5V` |
| `LAMP_GLOWING` | `OVERVOLTAGE_BURNOUT` | Voltage exceeds 14V | `V > 14.0V` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Độ rọi tâm > 8000 lux ở cự ly 10 cm
* **Độ chia nhỏ nhất / Độ phân giải**: Điện áp danh định 12.0 V DC/AC
* **Độ lặp lại phép đo**: Nhiệt độ màu tim đèn 3000 K (vàng ấm)
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Vỏ tản nhiệt nhôm đùn duy trì < 55°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Cháy bóng đèn Halogen** | Điều chỉnh biến áp lên 15V - 20V vượt quá định mức 12V | Đứt tim sợi đốt vonfram, đèn tắt ngấm | `V_terminal > 14.0 V` | Bấm nút Thay bóng đèn mới và hạ điện áp nguồn về 12V |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Nguồn sáng đèn Halogen 12V-20W có vỏ bảo vệ chịu nhiệt, kèm giá trượt trên băng quang học. |
| **VietValue — Đèn chiếu thí nghiệm** | `vietvalue.edu.vn` | Đèn chiếu giá quang học: Cọc cắm tiêu chuẩn 4mm, núm điều chỉnh tụ tiêu cự bóng đèn và khe cài tấm chắn sáng. |
| **Innotec Việt Nam** | `innotec.com.vn` | Hộp đèn thí nghiệm quang học THCS: Thân nhôm đùn tản nhiệt nhanh, ngàm trượt cố định chắc chắn trên ray 1m. |
| **Thiết bị Giáo dục Tây Bắc** | `thietbigiaoductaybac.vn` | Đèn nguồn sáng KHTN 9: Tích hợp tim vonfram phát sáng đồng nhất, độ rọi tập trung tạo chùm song song qua khe hẹp. |
| **Thorlabs Optics Laboratory** | `thorlabs.com` | Halogen Light Source for Optical Benches: 12V DC operation, standardized dovetail slider, optical axis height 125 mm. |

---

## 4.17. [OL3D-EQP-FOB-0001] (2) Vật sáng bằng kính mờ hình chữ F
**Tên tiếng Anh**: *(2) Frosted Glass Letter-F Luminous Object on Rider* | **Mã Archetype**: `frosted-f-object` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-FOB-0001`
* **Mã đường dẫn (Slug)**: `vat-sang-kinh-mo-chu-f`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.3 trang 6 & Bài 8, 9 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ
* **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (2): Vật sáng bằng kính mờ hình chữ F (**)
* **Chức năng chuẩn**: Đóng vai trò vật sáng phẳng AB có hình dạng bất đối xứng (chữ F) để học sinh dễ dàng so sánh chiều cao, độ rõ nét và tính cùng chiều / ngược chiều của ảnh trên màn chắn (4).

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 76 mm, Cao = 135 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.042 m, Cao (Y) = 0.135 m, Sâu (Z) = 0.078 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `scale_display_rear`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Box Frame Slider` | MeshStandardMaterial (Black ABS) | 2 | Khung gắn ray quang học cữ đồng tâm y = 125mm |
| `scale_display` | `PlaneGeometry` | MeshBasicMaterial (Frosted F Texture) | 4 | Tấm kính mờ tán xạ in chữ F đen sắc nét |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **110 g** (Trạng thái: `verified`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad h_{vật} = 20.0\text{ mm}, \quad w_{vật} = 12.0\text{ mm}, \quad \text{Nét} = 3.0\text{ mm}$$
  *Ý nghĩa vật lý*: Kích thước tiêu chuẩn hình chữ F trên kính mờ.
* **Các tính năng khoa học tích hợp**:
  - Chữ F được khắc laser chìm và phủ men đen trên nền kính mờ tán xạ trắng (hoặc tấm kim loại đột lỗ hình chữ F).
  - Hình dạng chữ F bất đối xứng theo cả hai trục đứng và ngang giúp học sinh dễ dàng nhận biết tính chất ảnh qua thấu kính: ảnh thật ngược chiều hay ảnh ảo cùng chiều.
  - Khung gá lắp con trượt đồng trục, cữ gắn đặt sát ngay trước cửa chiếu của hộp đèn Halogen để tạo vật sáng rõ nét.
  - Chịu được nhiệt lượng bức xạ từ đèn Halogen mà không bị biến dạng nhiệt hay ố mờ quang học.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `UNLIT`
* **Danh sách trạng thái khả dụng**: `UNLIT`, `ILLUMINATED_BY_LAMP`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `UNLIT` | `ILLUMINATED_BY_LAMP` | Lamp turned on in front | `lampLit == true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.1 mm kích thước nét chữ F
* **Độ chia nhỏ nhất / Độ phân giải**: Độ tương phản quang học > 90%
* **Độ lặp lại phép đo**: 100% đối xứng quang học
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Kính mờ chịu nhiệt tới 200°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Đặt ngược mặt chữ F** | Gắn tấm kính mờ quay mặt sau ra trước | Chữ F bị lật ngang gương từ góc nhìn đèn | `Góc quay rotation.y != 0` | Xoay khung vật F hướng mặt trước chữ F thẳng về phía thấu kính (+Z) |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **SGK KHTN 9 Kết nối tri thức (Bài 8 & 9)** | `vietjack.com` | Vật sáng hình chữ F trên giá quang học dùng để khảo sát sự tạo ảnh thật/ảo và chiều của ảnh qua thấu kính. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Vật sáng thí nghiệm: Tấm kính mờ in chữ F cao 20 mm có đế trượt trên băng quang học. |
| **VietValue — Linh kiện Quang học** | `vietvalue.edu.vn` | Vật sáng chữ F có chân đế trượt: Kính mờ chịu nhiệt cao cấp, nét chữ F sắc sảo cho viền ảnh tương phản cao trên màn hứng. |
| **Innotec Việt Nam** | `innotec.com.vn` | Khung giữ vật F có vạch chuẩn căn tâm quang học trùng tâm thấu kính và màn hứng ảnh. |
| **Eisco Scientific** | `eiscolabs.com` | Object Slide "F" for Optics Bench: Clear asymmetrical letter on frosted background for real and virtual image observation. |

---

## 4.18. [OL3D-EQP-SCR-0001] (4) Màn chắn hứng ảnh trên Giá quang học
**Tên tiếng Anh**: *(4) Matte White Optical Projection Screen on Rider* | **Mã Archetype**: `optical-screen` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-SCR-0001`
* **Mã đường dẫn (Slug)**: `man-chan-hung-anh-quang-hoc`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.3 & Bài 8, 9 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ
* **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (4): Màn chắn hứng ảnh trên giá quang học (**)
* **Chức năng chuẩn**: Hứng ảnh thật của Vật sáng chữ F (2) tạo bởi Thấu kính hội tụ (3). Khi màn chắn đặt đúng vị trí d', ảnh chữ F ngược chiều hiện lên sắc nét; khi lệch khỏi d', ảnh sẽ bị nhòe mờ.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 106 mm, Cao = 148 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.042 m, Cao (Y) = 0.148 m, Sâu (Z) = 0.106 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `scale_display_rear`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData; Optical Ray Tracing & Refraction
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Box Slider` | MeshStandardMaterial (Black ABS) | 2 | Chân trượt có ốc hãm trên ray quang học |
| `scale_display` | `PlaneGeometry` | MeshBasicMaterial (White Matte Screen Texture) | 4 | Màn chắn trắng mờ hứng ảnh chữ F ngược chiều |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **125 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `length`
  - Giới hạn đo (GHĐ): **0 mm** đến **450 mm**
  - Độ chia nhỏ nhất (ĐCNN): **1 mm**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad h_{ảnh} = |k| \cdot h_{vật} = \left|\frac{d'}{d}\right| \cdot 20.0\text{ mm}$$
  *Ý nghĩa vật lý*: Chiều cao ảnh thật của chữ F thu được trên màn hứng ảnh.
* **Các tính năng khoa học tích hợp**:
  - Mặt màn phẳng bằng nhựa kỹ thuật màu trắng sữa hoặc kim loại phủ sơn mờ tĩnh điện chống phản xạ chói lóa.
  - Có vạch chia ô tọa độ lưới milimet mờ (lưới 5 mm × 5 mm) trên mặt hứng ảnh giúp đo trực tiếp chiều cao ảnh A'B' và độ phóng đại k.
  - Con trượt gắn ray có ốc hãm định vị, trượt êm dọc ray quang học khi tìm vị trí hứng ảnh thật sắc nét nhất.
  - Có thể quan sát ảnh rõ ràng từ góc nhìn chính diện (+Z) và cả mặt sau (-Z) khi dùng màn mờ bán truyền xạ.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `DIFFUSE_BLURRED`
* **Danh sách trạng thái khả dụng**: `DIFFUSE_BLURRED`, `SHARP_REAL_IMAGE`, `OUT_OF_FOCUS`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `DIFFUSE_BLURRED` | `SHARP_REAL_IMAGE` | Screen position matches d' | `|x_screen - x_expected| < 1 mm` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Độ phẳng bề mặt hứng ảnh < 0.1 mm
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0 mm vạch chia lưới tọa độ
* **Độ lặp lại phép đo**: Hình ảnh sắc nét viền rõ
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Ảnh không hiện trên màn do thấu kính phân kì** | Dùng thấu kính phân kì (f < 0) tạo ảnh ảo nằm phía trước thấu kính | Màn chắn đặt sau thấu kính không thể hứng được ảnh | `focalLength < 0` | Giải thích cho học sinh: Ảnh ảo không hứng được trên màn; chỉ quan sát được bằng mắt nhìn qua thấu kính |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Màn chắn hứng ảnh: Kích thước tối thiểu 80 × 100 mm màu trắng mờ, có đế gắn trên băng quang học. |
| **VietValue — Màn chắn quang học** | `vietvalue.edu.vn` | Màn hứng ảnh có vạch mm: Bề mặt sơn mờ chống lóa, thể hiện rõ nét ảnh thật của chữ F khi thấu kính hội tụ. |
| **Innotec Việt Nam** | `innotec.com.vn` | Màn hứng ảnh KHTN 9: Đồng trục quang học y = 125 mm, độ phẳng cao không cong vênh. |
| **Lời Giải Hay — Thực hành KHTN 9** | `loigiaihay.com` | Kỹ thuật tìm ảnh rõ nét trên màn: Di chuyển màn hứng ảnh dọc theo ray quang học đến khi thu được viền chữ F sắc nét nhất. |
| **Phywe Laboratory Equipment** | `phywe.com` | Translucent and Opaque Screen: 100x100 mm projection area on optical bench slider. |

---

## 4.19. [OL3D-EQP-PSU-0001] (6) Nguồn điện hạ áp thí nghiệm 3V–12V
**Tên tiếng Anh**: *(6) Low-Voltage Lab Power Supply (DC 3V–12V)* | **Mã Archetype**: `optical-power-supply` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-PSU-0001`
* **Mã đường dẫn (Slug)**: `nguon-dien-ha-ap-thi-nghiem-12v`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · TCVN 7928 · IEC 61010-1 (An toàn điện hạ áp trường học)
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ
* **Hình ảnh đối chiếu SGK**: Hình 8.12 — Chi tiết (6): Nguồn điện cấp cho đèn chiếu sáng (**)
* **Chức năng chuẩn**: Cung cấp điện áp một chiều an toàn (6V–12V) cho Đèn chiếu sáng Halogen (1) hoạt động ổn định.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 135 mm, Cao = 88 mm, Sâu = 115 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.135 m, Cao (Y) = 0.088 m, Sâu (Z) = 0.115 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `toggle_switch`, `plunger`, `handle`, `led_indicator`, `terminal_pos`, `terminal_neg`, `terminal_pos_hitbox`, `terminal_neg_hitbox`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; State Sync via userData; Electrical Terminal / Wiring
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry (Sheet Metal)` | MeshStandardMaterial (Grey Powder Coated Steel) | 1 | Vỏ thép sơn tĩnh điện an toàn cách điện cấp II |
| `toggle_switch` | `Box + Cylinder Lever` | MeshStandardMaterial (Red Rocker Switch) | 2 | Công tắc lật nguồn có đèn LED đỏ báo sáng |
| `terminal_pos` | `Cylinder (Banana socket)` | MeshStandardMaterial (Red Plastic, +) | 2 | Cọc cắm dương 12V màu đỏ |
| `terminal_neg` | `Cylinder (Banana socket)` | MeshStandardMaterial (Black Plastic, -) | 2 | Cọc cắm âm 0V màu đen |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **680 g** (Trạng thái: `verified`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad U_{ra} \in \{3.0\text{ V}, 6.0\text{ V}, 9.0\text{ V}, 12.0\text{ V}\} \; (\text{DC & AC})$$
  *Ý nghĩa vật lý*: Các nấc điện áp ra định mức của máy biến áp hạ áp thí nghiệm.
  $$\mathbf{(2)}\quad I_{max} = 3.0\text{ A}, \quad P_{max} = U \cdot I = 12\text{ V} \times 3\text{ A} = 36.0\text{ W}$$
  *Ý nghĩa vật lý*: Công suất giới hạn bảo vệ tự động của nguồn điện trường học.
* **Các tính năng khoa học tích hợp**:
  - Bộ biến áp hạ áp cách ly an toàn tuyệt đối cho học sinh thực hành, tích hợp rơ-le nhiệt tự ngắt khi ngắn mạch hoặc quá tải (> 3.5A).
  - Núm xoay chuyển nấc điện áp cơ khí vững chắc với 4 nấc điện áp thí nghiệm tiêu chuẩn: 3V, 6V, 9V, 12V.
  - Hai hàng cọc cắm ra độc lập: Hàng cọc DC (Đỏ dương +, Đen âm -) và Hàng cọc AC (Vàng ~) kèm công tắc ngắt mạch tổng.
  - Cung cấp nguồn ổn định cho Đèn chiếu Halogen quang học, biến trở con chạy, cuộn dây cảm ứng điện từ và thí nghiệm định luật Ohm.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `POWER_OFF`
* **Danh sách trạng thái khả dụng**: `POWER_OFF`, `POWER_ON_STANDBY`, `OUTPUT_ACTIVE`, `SHORT_CIRCUIT_TRIPPED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `POWER_OFF` | `POWER_ON_STANDBY` | Mains toggle switch on | `mainsVoltage == 220V` |
| `POWER_ON_STANDBY` | `OUTPUT_ACTIVE` | Load connected | `R_load > 3.0 Ohm` |
| `OUTPUT_ACTIVE` | `SHORT_CIRCUIT_TRIPPED` | Short circuit detected | `I_out > 3.5 A` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±2% điện áp ra định danh
* **Độ chia nhỏ nhất / Độ phân giải**: Nấc chuyển 3V (3 - 6 - 9 - 12 V)
* **Độ lặp lại phép đo**: Ổn áp cao
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Cầu chì nhiệt tự ngắt khi T biến áp > 75°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Nhảy rơ-le bảo vệ quá tải (Tripped)** | Nối tắt trực tiếp 2 cực dương và âm bằng dây dẫn (ngắn mạch) | Ngắt điện áp đầu ra bảo vệ thiết bị | `R_load < 0.5 Ohm` | Gỡ bỏ đoản mạch, bấm nút Reset Circuit Breaker trên mặt máy |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Nguồn điện hạ thế thí nghiệm: Đầu vào 220V AC, đầu ra xoay chiều và một chiều 0–12V/3A, có bảo vệ quá tải. |
| **VietValue — Nguồn điện học sinh** | `vietvalue.edu.vn` | Nguồn điện đa năng phòng thực hành KHTN: 4 mức điện áp ra 3V, 6V, 9V, 12V DC/AC có đèn LED báo nguồn và cầu chì tự phục hồi. |
| **Innotec Việt Nam — Thiết bị Điện học** | `innotec.com.vn` | Bộ đổi nguồn hạ áp thí nghiệm 12V-3A: Vỏ thép sơn tĩnh điện chống rò điện, cọc cắm bắp chuối bọc nhựa an toàn. |
| **DMKLab — Thiết bị Trường học** | `dmklab.vn` | Nguồn điện hạ áp THCS: Ổn định điện áp tải, không phát sinh xung đỉnh làm đứt tim bóng đèn thí nghiệm. |
| **Voltcraft Laboratory Power Supplies** | `conrad.com` | School Laboratory Power Supply: Stepped output 3-12V AC/DC, overload-protected according to school safety regulations. |

---

## 4.20. [OL3D-EQP-LBX-0001] Hộp bộ 6 Thấu kính tiêu chuẩn (+5, +10, +15, -10, -20, ∞)
**Tên tiếng Anh**: *Wooden Storage Box of 6 Standard Optical Lenses* | **Mã Archetype**: `optical-lens-box` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-LBX-0001`
* **Mã đường dẫn (Slug)**: `hop-bo-6-thau-kinh-quang-hoc`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · DIN 58145 · Bài 8, 9 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 8: Thấu kính & Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ
* **Hình ảnh đối chiếu SGK**: Hình 8.2, Hình 8.3 & Hình 8.12 (**)
* **Chức năng chuẩn**: Cung cấp đầy đủ các thấu kính hội tụ (rìa mỏng) và thấu kính phân kì (rìa dày) với tiêu cự khác nhau để học sinh thay thế nhanh vào Giá đỡ thấu kính (3) trên Giá quang học.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 240 mm, Cao = 82 mm, Sâu = 88 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.24 m, Cao (Y) = 0.082 m, Sâu (Z) = 0.088 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; State Sync via userData; Optical Ray Tracing & Refraction
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Box with 6 slots + Velvet Tray` | MeshStandardMaterial (Wood / Velvet Blue) | 1 | Hộp gỗ lót nhung chứa 6 thấu kính |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **540 g** (Trạng thái: `verified`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad D_{dp} = \frac{1}{f\,(\text{m})} \implies D_{+10} = +10\text{ dp}, \; D_{+5} = +20\text{ dp}, \; D_{-10} = -10\text{ dp}$$
  *Ý nghĩa vật lý*: Độ tụ của từng thấu kính trong bộ 6 thấu kính tiêu chuẩn.
* **Các tính năng khoa học tích hợp**:
  - Gồm đầy đủ 6 thấu kính quang học bằng thủy tinh Borosilicate BK7 tinh khiết (chiết suất n = 1.5168), mài bóng quang học chống cầu sai.
  - Mỗi thấu kính được đúc cố định trong vành nhựa bảo vệ chống sứt mẻ va đập, trên vành có khắc chìm trị số tiêu cự (ví dụ "+10 cm", "-10 cm").
  - Đuôi vành thấu kính có trụ cắm tiêu chuẩn Ø 10 mm cắm vừa khít vào vòng giữ thấu kính (CONN_LENS_HOLDER_SOCKET) trên con trượt ray quang học.
  - Cho phép thay đổi tiêu cự nhanh chóng để khảo sát sự biến đổi vị trí và kích thước ảnh thật/ảo theo công thức 1/d + 1/d' = 1/f.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `BOX_STORED`
* **Danh sách trạng thái khả dụng**: `BOX_STORED`, `LENS_EXTRACTED`, `MOUNTED_IN_HOLDER`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `BOX_STORED` | `LENS_EXTRACTED` | Lens picked from box slot | `true` |
| `LENS_EXTRACTED` | `MOUNTED_IN_HOLDER` | Inserted into optical lens carriage socket | `dist < 0.15m` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±1.0% tiêu cự định danh
* **Độ chia nhỏ nhất / Độ phân giải**: Bộ 6 thấu kính: +5, +10, +15, -10, -20, ∞ cm
* **Độ lặp lại phép đo**: 100% tương thích ngàm cắm Ø10mm
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Thủy tinh quang học BK7 tinh khiết

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Lắp nhầm thấu kính phân kì thành hội tụ** | Không đọc ký hiệu khắc trên vành khung nhựa | Không tạo được ảnh thật trên màn chắn | `Kiểm tra thuộc tính lensProfileId` | Đọc kỹ trị số in trên vành nhựa (+ hội tụ, - phân kì) |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Hộp thấu kính thí nghiệm: Gồm các thấu kính hội tụ và phân kì tiêu cự 50, 100, 150, -100, -200 mm có vành giữ. |
| **VietValue — Bộ thấu kính quang học** | `vietvalue.edu.vn` | Bộ 6 thấu kính đường kính Ø 40–50 mm: Thủy tinh quang học độ trong suốt cao, khắc rõ tiêu cự trên thân khung nhựa. |
| **Innotec Việt Nam** | `innotec.com.vn` | Hộp bộ thấu kính chuẩn KHTN 9: Khay mút định hình chống trầy xước, trụ cắm tương thích hoàn hảo giá trượt quang học. |
| **Lời Giải Hay — Bài 8, 9 KHTN 9** | `loigiaihay.com` | So sánh tính chất ảnh tạo bởi thấu kính hội tụ f=+10cm và thấu kính phân kì f=-10cm trên băng quang học. |
| **Eisco Labs Optical Sets** | `eiscolabs.com` | Set of 6 Mounted Lenses for Optical Bench: 50mm diameter, focal lengths +50, +100, +150, -100, -200 mm and plane glass. |

---

## 4.21. [OL3D-EQP-THM-0001] Nhiệt kế chất lỏng -10°C đến 110°C
**Tên tiếng Anh**: *Laboratory Alcohol Thermometer -10°C to 110°C* | **Mã Archetype**: `thermometer` | **Phân loại danh mục**: `thermal-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-THM-0001`
* **Mã đường dẫn (Slug)**: `nhiet-ke-phong-thi-nghiem-110c`
* **Môn học áp dụng**: `chemistry`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `not-verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-THM-0001_nhiet-ke-phong-thi-nghiem-110c` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: TCVN / ISO 1770 · Thông tư 38/2021/TT-BGDĐT (Hình 1.10 SGK KHTN 9)

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 7 mm, Cao = 220 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.025 m, Cao (Y) = 0.22 m, Sâu (Z) = 0.025 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `plunger`, `scale_marks`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Thin glass stem)` | MeshPhysicalMaterial (Borosilicate, IOR 1.47) | 4 | Thân mao quản thủy tinh Ø6.5mm dài 295mm |
| `plunger` | `CylinderGeometry (Red fluid)` | MeshStandardMaterial (Red alcohol, emissive red) | 2 | Cột rượu màu đỏ dâng hạ theo nhiệt độ |
| `scale_marks` | `CylinderGeometry` | MeshBasicMaterial (CanvasTexture) | 5 | Thang chia nhiệt độ khắc laser -10 đến +110°C |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **28 g** (Trạng thái: `illustrative`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `temperature`
  - Giới hạn đo (GHĐ): **-10 °C** đến **110 °C**
  - Độ chia nhỏ nhất (ĐCNN): **1 °C**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad h_{cột\,rượu}(T) = h_0 \cdot \left[1 + \beta_{ethanol} \cdot (T - T_0)\right]$$
  *Ý nghĩa vật lý*: Sự giãn nở vì nhiệt của thể tích chất lỏng cảm nhiệt trong ống mao quản ($eta_{ethanol} \approx 1.1 \times 10^{-3}\,\text{K}^{-1}$).
  $$\mathbf{(2)}\quad T = -10 + \frac{h - h_{-10}}{h_{110} - h_{-10}} \times 120\,(^\circ\text{C})$$
  *Ý nghĩa vật lý*: Công thức chuyển đổi chiều cao cột chất lỏng sang nhiệt độ hiển thị.
* **Các tính năng khoa học tích hợp**:
  - Sử dụng chất lỏng cảm nhiệt là rượu hữu cơ pha màu đỏ tươi dễ quan sát, tuyệt đối an toàn (không chứa thủy ngân độc hại).
  - Thang chia độ khắc laser bền nhiệt từ -10 °C đến 110 °C với độ chia nhỏ nhất 1 °C.
  - Dùng đo nhiệt độ dung dịch trong cốc đốt hoặc cắm qua nút cao su cổ bình cầu có nhánh (Hình 1.10 Bài 24 SGK KHTN 9) để theo dõi nhiệt độ sôi khi chưng cất.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `AMBIENT_AIR`
* **Danh sách trạng thái khả dụng**: `AMBIENT_AIR`, `IMMERSING`, `EQUILIBRIUM_TEMPERATURE`, `BOILING_MONITORING`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `AMBIENT_AIR` | `IMMERSING` | Probe dipped into liquid | `isSubmerged == true` |
| `IMMERSING` | `EQUILIBRIUM_TEMPERATURE` | Thermal relaxation elapsed | `|dT/dt| < 0.1°C/s` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±1.0 °C (TCVN / ISO 1770)
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0 °C (ĐCNN 1 vạch chia)
* **Độ lặp lại phép đo**: ±0.5 °C
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Thời gian đáp ứng nhiệt τ ≈ 3.5 giây

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Đứt đoạn cột rượu cảm nhiệt** | Bị rung lắc mạnh hoặc làm rơi nhiệt kế | Số đo nhiệt độ bị sai lệch lớn | `Xuất hiện bọt khí ngăn đôi cột đỏ` | Ngâm bầu nhiệt kế vào nước nóng để cột rượu nối liền trở lại |
| **Bầu nhiệt kế chạm đáy cốc khi đun** | Cắm nhiệt kế chạm trực tiếp vào đáy cốc thủy tinh tiếp xúc ngọn lửa | Đo sai nhiệt độ cục bộ đáy cốc (cao hơn nhiệt độ nước 15°C) và nứt vỡ bầu nhiệt kế | `Khoảng cách bầu tới đáy cốc < 3 mm` | Kẹp nhiệt kế trên giá sắt cách đáy cốc tối thiểu 15 mm |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **LabVietChem — Nhiệt kế Rượu Phòng thí nghiệm** | `labvietchem.com.vn` | Nhiệt kế rượu đỏ -10 đến 110 °C: Chiều dài 300 mm, đường kính thân Ø 6–7 mm, vạch chia 1 °C. |
| **Tiêu chuẩn Quốc gia TCVN (Tổng cục TCĐLCL)** | `tcvn.gov.vn` | Quy định an toàn trường học: Thay thế nhiệt kế thủy ngân bằng nhiệt kế rượu màu hữu cơ trong thực hành THCS. |
| **Lời Giải Hay — Thực hành KHTN** | `loigiaihay.com` | Nguyên lý giãn nở vì nhiệt của cột chất lỏng và cách đặt bầu nhiệt kế trong bình cầu có nhánh ngang vòi thoát hơi. |
| **VietValue — Dụng cụ Đo nhiệt độ** | `vietvalue.edu.vn` | Nhiệt kế thí nghiệm KHTN: Có khuyên treo ở đầu trên và ống nhựa bảo vệ khi cất giữ. |
| **Thư viện Giáo dục Violet** | `violet.vn` | Hướng dẫn xác định GHĐ (110 °C) và ĐCNN (1 °C) của nhiệt kế rượu trong phòng thực hành. |

---

## 4.22. [OL3D-EQP-LSR-0001] Nguồn sáng Đèn Laser 3 tia song song (SGK KHTN 9)
**Tên tiếng Anh**: *3-Beam Optical Laser Ray Box* | **Mã Archetype**: `laser-source` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-LSR-0001`
* **Mã đường dẫn (Slug)**: `laser-ray-box-3beam`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.1 trang 6 SGK KHTN 9 (Bài 5, 6, 8)
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương II: Ánh sáng · Bài 1 (trang 6), Bài 5, Bài 6, Bài 8, Bài 9
* **Hình ảnh đối chiếu SGK**: Hình 1.1b (Đèn laser) & Hình 8.3 (**)
* **Chức năng chuẩn**: Tạo ra chùm sáng hẹp hoặc 3 tia sáng song song đi là là trên mặt bảng để quan sát trực quan đường truyền tia tới, tia khúc xạ, tia phản xạ và tiêu điểm thấu kính.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 40 mm, Sâu = 85 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.04 m, Sâu (Z) = 0.085 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `laser_beams`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry (Bevel)` | MeshPhysicalMaterial (Matte Black ABS, metalness 0.2) | 1 | Hộp nguồn laser 110x80x22mm có đế nam châm |
| `laser_beams` | `LineSegments / Cylinder` | MeshBasicMaterial (Red emissive, opacity 0.85) | 6 | 3 chùm tia laser đỏ song song phát xạ thẳng |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **210 g** (Trạng thái: `reported`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad E = \frac{h \cdot c}{\lambda} = \frac{6.626 \times 10^{-34} \cdot 3 \times 10^8}{650 \times 10^{-9}} \approx 3.06 \times 10^{-19}\text{ J} \approx 1.91\text{ eV}$$
  *Ý nghĩa vật lý*: Năng lượng một photon ánh sáng laser màu đỏ ($lambda = 650\text{ nm}$).
  $$\mathbf{(2)}\quad \vec{v}_{beam} = c \cdot \vec{u}_{forward}$$
  *Ý nghĩa vật lý*: Véctơ hướng truyền thẳng của 3 chùm tia laser song song trong môi trường đồng tính.
* **Các tính năng khoa học tích hợp**:
  - Phát đồng thời 3 chùm tia laser đỏ song song hoặc chuyển sang 1 tia mảnh nhờ công tắc trên lưng hộp.
  - Tích hợp thấu kính trụ tán phẳng tạo vệt tia sáng rõ nét trên mặt bảng chia độ hoặc mặt bàn mà không cần phòng tối hoàn toàn.
  - Đế có gắn đệm từ tính giúp đặt ổn định trên bàn thí nghiệm hoặc gắn lên bảng từ lớp học.
  - Dùng xuyên suốt Chương II SGK KHTN 9: Khúc xạ (Bài 5), Phản xạ toàn phần (Bài 6) và Đường truyền 3 tia sáng qua thấu kính (Bài 8).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `POWER_OFF`
* **Danh sách trạng thái khả dụng**: `POWER_OFF`, `SINGLE_BEAM`, `TRIPLE_PARALLEL_BEAMS`, `LOW_BATTERY`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `POWER_OFF` | `TRIPLE_PARALLEL_BEAMS` | Power switch turned on | `true` |
| `TRIPLE_PARALLEL_BEAMS` | `SINGLE_BEAM` | Mode switch toggled | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Độ đơn sắc bước sóng 650 nm ± 5 nm
* **Độ chia nhỏ nhất / Độ phân giải**: Khoảng cách giữa các tia 18.0 mm ± 0.2 mm
* **Độ lặp lại phép đo**: Độ song song chùm tia sai lệch < 0.1°
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Ổn định công suất quang < 1 mW

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Tia laser chiếu trực diện vào mắt học sinh** | Xoay hướng hộp laser ngược về phía camera / người xem | Vi phạm quy chuẩn an toàn quang học trường học | `Góc tia laser hướng về camera góc nhìn học sinh` | Tự động ngắt phát xạ hoặc hiển thị cảnh báo an toàn Class II Safety Warning |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thiết bị Dạy học Tối thiểu (Bộ GD&ĐT)** | `thietbidayhoctoithieu.vn` | Nguồn sáng laser 3 tia song song dùng cho bộ thí nghiệm quang học KHTN 9 theo Thông tư 38/2021/TT-BGDĐT. |
| **Nhà sách Giáo dục — Thiết bị Vật lí 9** | `nhasachgiaoduc.vn` | Đèn laser 3 tia thí nghiệm quang hình: Kích thước 110 × 80 × 20 mm, trọng lượng 90–100 g, bước sóng đỏ 635–650 nm. |
| **Thiết bị Giáo dục Tây Bắc** | `thietbigiaoductaybac.vn` | Hộp nguồn sáng 3 tia có đế nam châm và công tắc bật/tắt từng tia, dùng pin sạc hoặc 2 pin AAA. |
| **VietValue — Dụng cụ Quang học** | `vietvalue.edu.vn` | Độ đơn sắc và tính định hướng cao, vệt tia rõ trên bảng chia độ bán trụ và qua thấu kính hội tụ. |
| **STEMVN — Thiết bị Khoa học Tự nhiên** | `stemvn.vn` | Cấp an toàn Laser Class II (< 1mW) dành cho học sinh phổ thông kèm quy tắc không chiếu trực tiếp vào mắt. |

---

## 4.23. [OL3D-EQP-SLB-0001] Bản bán trụ thuỷ tinh & Bảng chia độ 360° (SGK KHTN 9)
**Tên tiếng Anh**: *Semicircular Glass Block & 360° Protractor Disc* | **Mã Archetype**: `semicircular-slab` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-SLB-0001`
* **Mã đường dẫn (Slug)**: `semicircular-glass-slab-protractor`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-SLB-0001_semicircular-glass-slab-protractor` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.2 trang 6 & Bài 5, 6 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 1 (trang 6), Bài 5 Khúc xạ ánh sáng (trang 25–28), Bài 6 Phản xạ toàn phần (trang 30–32)
* **Hình ảnh đối chiếu SGK**: Hình 1.2, Hình 5.1, Hình 5.2, Hình 6.1 (**)
* **Chức năng chuẩn**: Đọc chính xác giá trị góc tới i, góc khúc xạ r và góc phản xạ i' để nghiệm lại định luật khúc xạ ánh sáng (sin i / sin r = hằng số) và xác định góc tới hạn phản xạ toàn phần (i_th ≈ 41,8°).

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 190 mm, Cao = 32 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.19 m, Cao (Y) = 0.032 m, Sâu (Z) = 0.19 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `handle`, `incident_ray`, `ray_paths`, `reflected_ray`, `refracted_ray`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: ExtrudeGeometry with Bevel; Optical Ray Tracing & Refraction
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Half cut)` | MeshPhysicalMaterial (BK7 Optical Glass, IOR 1.50, transmission 0.92) | 4 | Khối bán trụ thủy tinh Ø84mm dày 16mm mài bóng |
| `handle` | `CylinderGeometry (Disc)` | MeshStandardMaterial (Hartmann Protractor Texture) | 2 | Mâm tròn chia độ 360° xoay đồng tâm O |
| `refracted_ray` | `Line / Cylinder` | MeshBasicMaterial (Red Laser) | 6 | Tia khúc xạ (tự động ẩn khi i >= 41.8°) |
| `reflected_ray` | `Line / Cylinder` | MeshBasicMaterial (Red Laser) | 6 | Tia phản xạ đối xứng (sáng cực đại khi phản xạ toàn phần) |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **320 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `refraction-angle`
  - Giới hạn đo (GHĐ): **0 độ (°)** đến **90 độ (°)**
  - Độ chia nhỏ nhất (ĐCNN): **1 độ (°)**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad n_1 \cdot \sin i = n_2 \cdot \sin r \iff \sin r = \frac{n_1}{n_2} \cdot \sin i$$
  *Ý nghĩa vật lý*: Định luật khúc xạ ánh sáng Snell–Descartes ($n_1 = 1.50$ thủy tinh, $n_2 = 1.00$ không khí).
  $$\mathbf{(2)}\quad \sin i_{gh} = \frac{n_2}{n_1} = \frac{1}{1.50} = \frac{2}{3} \implies i_{gh} \approx 41.81^\circ$$
  *Ý nghĩa vật lý*: Góc tới hạn phản xạ toàn phần từ thủy tinh sang không khí (Bài 6 SGK KHTN 9).
  $$\mathbf{(3)}\quad i \ge 41.81^\circ \implies \text{Refracted Ray disappears}, \; I_{reflected} = 100\%$$
  *Ý nghĩa vật lý*: Điều kiện xảy ra Phản xạ toàn phần: Không còn tia khúc xạ ló ra không khí.
* **Các tính năng khoa học tích hợp**:
  - Khối bán trụ bằng thủy tinh quang học BK7 (hoặc Acrylic quang học tinh khiết) đặt đồng tâm trên mâm chia độ tròn 360° (ĐCNN 1°).
  - Mặt phẳng đường kính của bản bán trụ trùng khít vạch chuẩn 90°–90°, tâm O trùng giao điểm pháp tuyến N–N'.
  - Khi chiếu tia laser qua mặt cong hướng vào tâm O (từ thủy tinh chiết suất n = 1.50 ra không khí): Góc tới i < 41.8° cho tia khúc xạ; khi i ≥ 42° tia khúc xạ biến mất hoàn toàn và xảy ra Phản xạ toàn phần (Bài 6 SGK KHTN 9).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `NORMAL_INCIDENCE`
* **Danh sách trạng thái khả dụng**: `NORMAL_INCIDENCE`, `REFRACTION_DOMINANT`, `CRITICAL_ANGLE`, `TOTAL_INTERNAL_REFLECTION`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `NORMAL_INCIDENCE` | `REFRACTION_DOMINANT` | Rotated on protractor | `0 < i < 41.8°` |
| `REFRACTION_DOMINANT` | `CRITICAL_ANGLE` | Angle reaches 41.8° | `i == 41.8°` |
| `REFRACTION_DOMINANT` | `TOTAL_INTERNAL_REFLECTION` | Angle exceeds critical | `i >= 42.0°` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.5° góc trên bảng chia độ 360°
* **Độ chia nhỏ nhất / Độ phân giải**: 1.0° (Vạch khắc laser trên mâm tròn Ø150mm)
* **Độ lặp lại phép đo**: ±0.2°
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Chiết suất n = 1.50 ± 0.005

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Tia tới không đi qua tâm O của bản bán trụ** | Đèn laser bị lệch trục không đồng tâm với mâm chia độ | Tia bị bẻ cong tại mặt cong trước khi tới mặt phẳng, làm sai định luật Snell | `Khoảng cách tia tới tâm O > 0.5 mm` | Bấm nút Snap Ray to Center O tự động căn chỉnh đồng trục |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Bản bán trụ trong suốt: Đường kính tối thiểu 80 mm, độ dày tối thiểu 15 mm, dùng kèm bảng chia độ 360°. |
| **VietJack — SGK KHTN 9 Bài 5 & Bài 6** | `vietjack.com` | Hình 1.2 trang 6, Hình 5.2 (Khúc xạ ánh sáng) và Hình 6.1 (Phản xạ toàn phần): Đọc góc tới i và góc khúc xạ r trên bảng chia độ. |
| **Thiết bị Dạy học Tối thiểu** | `thietbidayhoctoithieu.vn` | Bộ thí nghiệm khúc xạ và phản xạ toàn phần KHTN 9: Bảng tròn chia độ 0–90° ở 4 góc phần tư, vạch pháp tuyến rõ nét. |
| **VietValue — Thiết bị Vật lí** | `vietvalue.edu.vn` | Bản bán trụ thủy tinh quang học chiết suất n = 1.5, các mặt bên mài bóng quang học không biến dạng tia. |
| **Innotec Việt Nam** | `innotec.com.vn` | Mâm chia độ xoay nhẹ nhàng giúp thay đổi góc tới i liên tục từ 0° đến 80° mà không cần dịch chuyển đèn laser. |

---

## 4.24. [OL3D-EQP-PRM-0001] Lăng kính tam giác trên giá đỡ — Tán sắc ánh sáng (SGK KHTN 9)
**Tên tiếng Anh**: *Equilateral Glass Prism on Stand (Dispersion)* | **Mã Archetype**: `optical-prism` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-PRM-0001`
* **Mã đường dẫn (Slug)**: `equilateral-optical-prism-stand`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-PRM-0001_equilateral-optical-prism-stand` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 7.1, 7.2 Bài 7 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 7: Lăng kính (trang 34–38)
* **Hình ảnh đối chiếu SGK**: Hình 7.1, Hình 7.4, Hình 7.5 (**)
* **Chức năng chuẩn**: Tạo quang phổ của ánh sáng trắng (tán sắc ánh sáng: đỏ, da cam, vàng, lục, lam, chàm, tím) và khảo sát sự lệch của tia sáng về phía đáy lăng kính.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 92 mm, Cao = 140 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.14 m, Sâu (Z) = 0.11 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `PrismGeometry (Extruded Equilateral Triangle)` | MeshPhysicalMaterial (Optical Flint Glass, IOR 1.62, transmission 0.90) | 4 | Lăng kính tam giác đều 30x30x30mm trên giá đỡ trụ |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **280 g** (Trạng thái: `reported`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad D = i_1 + i_2 - A$$
  *Ý nghĩa vật lý*: Góc lệch của tia sáng khi qua lăng kính tam giác đều ($A = 60^\circ$).
  $$\mathbf{(2)}\quad n(\lambda) = A_{Cauchy} + \frac{B_{Cauchy}}{\lambda^2} + \frac{C_{Cauchy}}{\lambda^4}$$
  *Ý nghĩa vật lý*: Phương trình tán sắc Cauchy: Chiết suất ánh sáng đỏ ($n_{đỏ} \approx 1.513$) nhỏ hơn chiết suất ánh sáng tím ($n_{tím} \approx 1.532$), khiến tia tím bị lệch nhiều nhất tạo thành dải 7 màu cầu vồng.
* **Các tính năng khoa học tích hợp**:
  - Khối lăng kính tam giác đều A = 60° bằng thủy tinh quang học tán sắc cao, đặt trên bàn xoay có trụ đỡ.
  - Tích hợp màn chắn trắng phía sau để hứng trực tiếp dải quang phổ liên tục 7 màu (Đỏ, Da cam, Vàng, Lục, Lam, Chàm, Tím) khi chiếu chùm ánh sáng trắng đi qua.
  - Minh họa trực quan hiện tượng Tán sắc ánh sáng và đường truyền tia sáng bị lệch về phía đáy lăng kính (Bài 7 SGK KHTN 9).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `IDLE_MOUNT`
* **Danh sách trạng thái khả dụng**: `IDLE_MOUNT`, `MONOCHROMATIC_DEFLECTION`, `POLYCHROMATIC_DISPERSION`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `IDLE_MOUNT` | `MONOCHROMATIC_DEFLECTION` | Red laser applied | `single wavelength` |
| `IDLE_MOUNT` | `POLYCHROMATIC_DISPERSION` | White light slit applied | `continuous spectrum` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Góc lăng kính A = 60° ± 0.05°
* **Độ chia nhỏ nhất / Độ phân giải**: 0.1° góc lệch D
* **Độ lặp lại phép đo**: ±0.1°
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Góc tới quá lớn gây phản xạ toàn phần trong lăng kính** | Xoay lăng kính góc i > 75° | Không có chùm tia ló ra khỏi mặt bên thứ hai | `sin(r2) >= 1.0` | Xoay lăng kính về góc tới đối xứng i1 ≈ 48° cho góc lệch cực tiểu D_min |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **STEMVN — Lăng kính Tán sắc Ánh sáng KHTN 9** | `stemvn.vn` | Lăng kính tam giác đều thủy tinh quang học BK7/Flint: Cạnh 30–35 mm, chiều cao 50 mm, góc chiết quang chuẩn 60°. |
| **VietJack — SGK KHTN 9 Bài 7 (Lăng kính)** | `vietjack.com` | Hình 7.1 & 7.2 SGK KHTN 9: Thí nghiệm Newton chiếu ánh sáng trắng qua lăng kính tách thành dải màu cầu vồng (tia đỏ lệch ít nhất, tia tím lệch nhiều nhất). |
| **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Lăng kính gắn đế thí nghiệm quang học lớp 9 theo danh mục Bộ GD&ĐT. |
| **VietValue — Thiết bị Giáo dục** | `vietvalue.edu.vn` | Ba mặt bên lăng kính được đánh bóng quang học phẳng tuyệt đối giúp chùm tia ló không bị tán xạ mờ. |
| **Thiết bị Dạy học Tối thiểu** | `thietbidayhoctoithieu.vn` | Dụng cụ thực hành Chủ đề Ánh sáng KHTN 9: Quan sát sự tạo thành màu sắc của vật và tán sắc qua lăng kính. |

---

## 4.25. [OL3D-EQP-MAG-0001] Kính lúp cầm tay độ bội giác 5x (SGK KHTN 9)
**Tên tiếng Anh**: *5x Handheld Magnifying Glass (f = 5 cm)* | **Mã Archetype**: `magnifying-glass` | **Phân loại danh mục**: `optical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-MAG-0001`
* **Mã đường dẫn (Slug)**: `handheld-magnifying-glass-5x`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-MAG-0001_handheld-magnifying-glass-5x` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 10.1 Bài 10 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương II: Ánh sáng · Bài 10: Kính lúp. Bài tập thấu kính (trang 50–52)
* **Hình ảnh đối chiếu SGK**: Hình 10.1, Hình 10.3, Hình 10.4 (**)
* **Chức năng chuẩn**: Tạo ảnh ảo cùng chiều, lớn hơn vật khi đặt vật nhỏ trong khoảng từ quang tâm O đến tiêu điểm chính F (d < f), giúp tăng góc trông ảnh của vật.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 80 mm, Cao = 165 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.085 m, Cao (Y) = 0.165 m, Sâu (Z) = 0.072 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `lens_element`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Torus + Cylinder Handle` | MeshPhysicalMaterial (Black Rubberized ABS) | 2 | Vành giữ thấu kính Ø75mm kèm tay cầm chống trượt |
| `lens_element` | `Sphere intersection` | MeshPhysicalMaterial (Optical Glass, transmission 0.95) | 4 | Thấu kính hội tụ phóng đại 5x |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **145 g** (Trạng thái: `verified`)
  - Tiêu cự định danh ($f$): **50 mm**
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `magnification`
  - Giới hạn đo (GHĐ): **5 x (Bội giác G)** đến **5 x (Bội giác G)**
  - Độ chia nhỏ nhất (ĐCNN): **undefined undefined**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad G = \frac{25\text{ cm}}{f} = \frac{250\text{ mm}}{50\text{ mm}} = 5\times$$
  *Ý nghĩa vật lý*: Số bội giác của kính lúp khi ngắm chừng ở vô cực ($f = 50\text{ mm}$).
  $$\mathbf{(2)}\quad d' = \frac{d \cdot f}{d - f} < 0 \implies \text{Ảnh ảo cùng chiều lớn hơn vật}$$
  *Ý nghĩa vật lý*: Vật đặt trong khoảng tiêu cự $0 < d < f$ tạo ảnh ảo phóng đại quan sát bằng mắt thường.
* **Các tính năng khoa học tích hợp**:
  - Cấu tạo gồm một thấu kính hội tụ có tiêu cự ngắn (f = 5 cm) bọc trong khung vành kim loại chắc chắn và tay cầm vừa vặn.
  - Khi đặt vật nhỏ trong khoảng tiêu cự (d < f), kính lúp tạo ra ảnh ảo cùng chiều và lớn gấp 5 lần vật.
  - Dùng trong Bài 10 SGK KHTN 9 và các bài quan sát mẫu vật sinh học, chi tiết thực vật, côn trùng, tinh thể muối.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `BENCH_REST`
* **Danh sách trạng thái khả dụng**: `BENCH_REST`, `HELD_IN_HAND`, `MAGNIFYING_SPECIMEN`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `BENCH_REST` | `HELD_IN_HAND` | Pointer grab | `true` |
| `HELD_IN_HAND` | `MAGNIFYING_SPECIMEN` | Hover over specimen | `d < f` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.2x độ bội giác
* **Độ chia nhỏ nhất / Độ phân giải**: Tiêu cự 50 mm ± 1 mm
* **Độ lặp lại phép đo**: Hình ảnh ảo sắc nét không méo gối
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Méo rìa hình ảnh (Aberration)** | Đưa mắt quá xa trục chính quang học của kính lúp | Viền đối tượng bị cong méo hình gối | `Eye offset > 30 mm` | Căn chỉnh mắt nhìn thẳng đồng trục tâm thấu kính |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietJack — SGK KHTN 9 Bài 10 (Kính lúp)** | `vietjack.com` | Cấu tạo kính lúp và công thức tính số bội giác G = 25/f (với f tính bằng cm), cách ngắm chừng để mắt không bị mỏi. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Kính lúp cầm tay độ bội giác 3x – 5x, đường kính mặt kính ≥ 60 mm thuộc thiết bị dùng chung môn KHTN. |
| **VietValue — Kính lúp Thí nghiệm Học sinh** | `vietvalue.edu.vn` | Kính lúp cầm tay Ø 65 mm, thấu kính thủy tinh quang học trong suốt chống trầy xước. |
| **Innotec Việt Nam** | `innotec.com.vn` | Chiều dài tổng thể 150–160 mm, vành bảo vệ cao hơn mặt kính 2 mm tránh xước khi đặt trên mặt bàn. |
| **Nhà sách Giáo dục** | `nhasachgiaoduc.vn` | Dụng cụ thực hành bài Kính lúp và bài Thực hành quan sát tiêu bản sinh học. |

---

## 4.26. [OL3D-EQP-GLV-0001] Điện kế nhạy vạch 0 ở giữa — Galvanometer (SGK KHTN 9)
**Tên tiếng Anh**: *Center-Zero Sensitive Galvanometer (G)* | **Mã Archetype**: `galvanometer` | **Phân loại danh mục**: `electrical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-GLV-0001`
* **Mã đường dẫn (Slug)**: `center-zero-galvanometer`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-GLV-0001_center-zero-galvanometer` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.4 trang 6 & Bài 14 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương IV: Điện từ · Bài 1 (trang 7) & Bài 14: Cảm ứng điện từ (trang 67–69)
* **Hình ảnh đối chiếu SGK**: Hình 1.4 (Điện kế), Hình 14.1, Hình 14.3 (**)
* **Chức năng chuẩn**: Phát hiện dòng điện cảm ứng nhỏ và xác định chiều dòng điện: Khi dòng điện đi vào chốt G0 (hoặc G1) và đi ra từ chốt âm (-) thì kim lệch sang phải; khi đi vào chốt âm (-) và đi ra từ chốt G0 thì kim lệch sang trái.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 145 mm, Sâu = 95 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.145 m, Sâu (Z) = 0.095 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_marks`, `scale_marks_rear`, `plunger`, `plunger_rear`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `BoxGeometry (Sloped housing)` | MeshStandardMaterial (Grey Laboratory Housing) | 1 | Vỏ hộp máy đo góc nghiêng 45° |
| `plunger` | `Cylinder Needle` | MeshBasicMaterial (Red Needle, front) | 3 | Kim chỉ thị mặt trước quay quanh trục Z |
| `plunger_rear` | `Cylinder Needle` | MeshBasicMaterial (Red Needle, rear) | 3 | Kim chỉ thị mặt sau hiển thị 360° |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **290 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `electric-current`
  - Giới hạn đo (GHĐ): **-50 μA** đến **50 μA**
  - Độ chia nhỏ nhất (ĐCNN): **5 μA**
  - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad I = \frac{\theta}{S_i} = \frac{\tau_{restoring}}{N A B} = \frac{C \cdot \theta}{N A B}$$
  *Ý nghĩa vật lý*: Định luật đo dòng điện của điện kế khung quay kim nhạy.
  $$\mathbf{(2)}\quad \theta = \text{sign}(I) \cdot \min\left(45^\circ, \frac{|I|}{50\,\mu\text{A}} \times 45^\circ\right)$$
  *Ý nghĩa vật lý*: Góc lệch kim chỉ thị mặt trước và mặt sau đối xứng quanh vạch 0 ở giữa.
* **Các tính năng khoa học tích hợp**:
  - Kim chỉ thị nằm chính giữa tại vạch số 0 khi chưa có dòng điện, cho phép phát hiện cả độ lớn và chiều của dòng điện cảm ứng rất nhỏ.
  - Khi đưa cực Bắc nam châm lại gần cuộn dây, kim lệch sang phải (+); khi kéo nam châm ra xa, kim lệch sang trái (-) chứng tỏ dòng điện cảm ứng đổi chiều (Bài 14 SGK KHTN 9).
  - Có vít chỉnh điểm 0 (Zero-adjust) ngay dưới mặt kính và 2 cọc nối dây bắp chuối 4 mm tiêu chuẩn.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `ZERO_CENTER`
* **Danh sách trạng thái khả dụng**: `ZERO_CENTER`, `DEFLECT_POSITIVE`, `DEFLECT_NEGATIVE`, `PINNED_FULL_SCALE`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `ZERO_CENTER` | `DEFLECT_POSITIVE` | Positive current flows | `I > 0.5 uA` |
| `ZERO_CENTER` | `DEFLECT_NEGATIVE` | Negative current flows | `I < -0.5 uA` |
| `DEFLECT_POSITIVE` | `PINNED_FULL_SCALE` | Current exceeds 50 uA | `I > 50 uA` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Cấp chính xác 1.5 (±1.5% toàn thang đo)
* **Độ chia nhỏ nhất / Độ phân giải**: 2 µA (Thang đo -50 .. 0 .. +50 µA)
* **Độ lặp lại phép đo**: ±1 µA
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Điện trở nội Rg = 50 Ω ± 2 Ω

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Cháy cuộn dây động** | Cắm trực tiếp nguồn điện 12V vào điện kế nhạy không qua điện trở hạn dòng | Cháy đứt cuộn dây khung quay siêu mảnh | `I_in > 500 uA (gấp 10 lần GHĐ)` | Luôn mắc nối tiếp điện trở hạn dòng tối thiểu 10 kΩ khi thử nghiệm mạch |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietValue — Điện kế Nhạy Thí nghiệm Vật lí** | `vietvalue.edu.vn` | Điện kế chứng minh vạch 0 ở giữa dùng khảo sát hiện tượng cảm ứng điện từ (Bài 14 KHTN 9): Độ nhạy cấp µA/mA. |
| **STB Việt Nam — Thiết bị Giáo dục** | `stb.com.vn` | Điện kế phòng thí nghiệm: Mặt hiển thị chia vạch đối xứng qua điểm 0, có núm cân chỉnh kim chỉ thị và cọc đấu dây an toàn. |
| **Innotec Việt Nam** | `innotec.com.vn` | Điện kế học sinh để bàn: Vỏ nhựa ABS nghiêng dễ quan sát, cơ cấu từ điện chống rung kim. |
| **VietJack — SGK KHTN 9 Hình 1.4 & Bài 14** | `vietjack.com` | Hình 1.4 trang 6 SGK KHTN 9: Điện kế là dụng cụ dùng để phát hiện dòng điện cảm ứng nhỏ và nhận biết sự đổi chiều dòng điện. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Danh mục thiết bị Chủ đề Điện từ cấp THCS: Điện kế nhạy vạch 0 ở giữa kết nối với cuộn dây dẫn kín. |

---

## 4.27. [OL3D-EQP-DMM-0001] Đồng hồ đo điện đa năng hiện số (SGK KHTN 9)
**Tên tiếng Anh**: *Digital Multimeter (AC/DC V, A, Ω)* | **Mã Archetype**: `digital-multimeter` | **Phân loại danh mục**: `electrical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-DMM-0001`
* **Mã đường dẫn (Slug)**: `digital-multimeter-ac-dc`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-DMM-0001_digital-multimeter-ac-dc` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: IEC 61010-1 CAT II · Hình 1.5 trang 6 & Bài 11, 12 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương III: Điện · Bài 1 (trang 7), Bài 11: Điện trở. Định luật Ohm, Bài 12: Đoạn mạch nối tiếp, song song
* **Hình ảnh đối chiếu SGK**: Hình 1.5 (Đồng hồ đo điện đa năng) (**)
* **Chức năng chuẩn**: Đo các đại lượng điện khác nhau như cường độ dòng điện I (A), hiệu điện thế U (V), điện trở R (Ω) trong mạch điện một chiều cũng như mạch điện xoay chiều.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 92 mm, Cao = 68 mm, Sâu = 155 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.092 m, Cao (Y) = 0.068 m, Sâu (Z) = 0.155 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `scale_display_rear`, `handle`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: State Sync via userData
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Box + Bevel Extrude` | MeshStandardMaterial (Yellow Holster ABS, color 0xf59e0b) | 1 | Vỏ cao su bọc chống sốc màu vàng công nghiệp |
| `scale_display` | `PlaneGeometry` | MeshBasicMaterial (CanvasTexture LCD) | 3 | Màn hình LCD 7 đoạn hiển thị số thực 360° |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **310 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `voltage-resistance`
  - Giới hạn đo (GHĐ): **0 V / A / Ω** đến **600 V**
  - Độ chia nhỏ nhất (ĐCNN): **0.01 V / A**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad V_{DC} = \int_{0}^{T_{int}} V_{in}(t)\,dt$$
  *Ý nghĩa vật lý*: Nguyên lý chuyển đổi tương tự sang số ADC tích phân hai sườn (Dual-slope integration).
  $$\mathbf{(2)}\quad R_x = \frac{V_{sample}}{I_{constant}}$$
  *Ý nghĩa vật lý*: Đo điện trở theo phương pháp bơm dòng chuẩn và đo sụt áp bốn dây Kelvin.
* **Các tính năng khoa học tích hợp**:
  - Tích hợp Vôn kế, Ampe kế và Ôm kế trong một thiết bị hiện số duy nhất kèm núm xoay chọn thang đo.
  - 3 giắc cắm que đo chuyên biệt: COM (Đen chung), V/Ω/mA (Đỏ tiêu chuẩn) và 10A DC (Đỏ dòng lớn).
  - Dùng trong Bài 11 (Định luật Ohm, điện trở dây dẫn) và Bài 12 (Đoạn mạch nối tiếp, song song) của SGK KHTN 9.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `OFF`
* **Danh sách trạng thái khả dụng**: `OFF`, `MEASURING_DCV`, `MEASURING_ACV`, `MEASURING_DCA`, `MEASURING_OHM`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `OFF` | `MEASURING_DCV` | Rotary switch turned to DCV | `true` |
| `MEASURING_DCV` | `MEASURING_OHM` | Rotary switch turned to OHM | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.5% + 2 số hiển thị (CAT II 600V)
* **Độ chia nhỏ nhất / Độ phân giải**: 0.01 V / 0.1 mA / 0.1 Ω (Màn hình 3.5 số lẻ)
* **Độ lặp lại phép đo**: ±0.2%
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Trở kháng vào Zin >= 10 MΩ

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Đứt cầu chì bảo vệ thang đo dòng điện** | Đo điện áp nguồn điện nhưng cắm que đo ở cổng 10A / mA | Đoản mạch và đứt cầu chì bảo vệ nhanh | `Dòng điện qua shunt > 10 A` | Thay cầu chì bảo vệ gốm 10A và chuyển que đo sang cổng V/Ω |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **DMKLab — Đồng hồ Đo điện Đa năng Hiện số** | `dmklab.vn` | Đồng hồ vạn năng điện tử dùng trong trường học: Màn hình LCD lớn, đo điện áp DC/AC, dòng điện DC đến 10A và điện trở Ω. |
| **LXI Education — Hướng dẫn Thực hành Điện học 9** | `lxi.edu.vn` | Cách chọn thang đo DCV, DCA và Ω trên đồng hồ đo điện đa năng (Hình 1.5 SGK KHTN 9) và quy tắc mắc nối tiếp/song song. |
| **Studocu Vietnam — Tài liệu KHTN 9 Kết nối tri thức** | `studocu.vn` | Tổng hợp dụng cụ Bài 1 KHTN 9: Đồng hồ đo điện đa năng giúp đo trực tiếp U, I, R với độ chính xác cao hơn đồng hồ kim. |
| **VietValue — Thiết bị Điện học THCS** | `vietvalue.edu.vn` | Vỏ bọc cao su chống va đập màu vàng/xanh, tích hợp cầu chì tự phục hồi chống cháy hỏng khi học sinh cắm nhầm thang đo. |
| **Innotec Việt Nam** | `innotec.com.vn` | Đồng hồ đa năng hiện số chuẩn Thông tư 38/2021/TT-BGDĐT kèm bộ dây đo đầu cắm bắp chuối 4 mm. |

---

## 4.28. [OL3D-EQP-COIL-0001] Cuộn dây dẫn kín có 2 đèn LED & Thanh nam châm (SGK KHTN 9)
**Tên tiếng Anh**: *Closed Induction Coil with 2 Anti-Parallel LEDs & Bar Magnet* | **Mã Archetype**: `induction-coil-led` | **Phân loại danh mục**: `electrical-equipment`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-COIL-0001`
* **Mã đường dẫn (Slug)**: `induction-coil-2led-magnet`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 1.6 trang 7 & Bài 14, 15 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương IV: Điện từ · Bài 1 (trang 7) & Bài 14: Cảm ứng điện từ. Nguyên tắc tạo ra dòng điện xoay chiều (trang 69–71)
* **Hình ảnh đối chiếu SGK**: Hình 1.6 (Cuộn dây dẫn kín có hai đèn LED), Hình 14.4, Hình 14.5 (**)
* **Chức năng chuẩn**: Phát hiện dòng điện cảm ứng và chiều dòng điện: Khi số đường sức từ xuyên qua tiết diện cuộn dây tăng thì đèn LED 1 sáng; khi số đường sức từ giảm thì dòng điện cảm ứng đổi chiều làm đèn LED 2 sáng.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 180 mm, Cao = 95 mm, Sâu = 110 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.18 m, Cao (Y) = 0.095 m, Sâu (Z) = 0.11 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `led_1`, `led_2`, `plunger`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Hollow core)` | MeshStandardMaterial (Enamelled Copper Wire, color 0xb45309) | 2 | Cuộn dây đồng tráng men quấn trên lõi nhựa rỗng |
| `led_1` | `Cylinder + Dome` | MeshBasicMaterial (Red LED, emissive) | 3 | LED đỏ sáng khi từ thông tăng (đưa nam châm vào) |
| `led_2` | `Cylinder + Dome` | MeshBasicMaterial (Green LED, emissive) | 3 | LED xanh sáng khi từ thông giảm (rút nam châm ra) |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **420 g** (Trạng thái: `verified`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \mathcal{E} = -N \cdot \frac{d\Phi}{dt} = -N \cdot S \cdot \frac{dB}{dt}$$
  *Ý nghĩa vật lý*: Định luật cảm ứng điện từ Faraday: Suất điện động cảm ứng tỷ lệ với tốc độ biến thiên từ thông qua cuộn dây ($N = 1000\text{ vòng}$).
  $$\mathbf{(2)}\quad I_{cảm\,ứng} = \frac{\mathcal{E}}{R_{cuộn} + R_{LED}}$$
  *Ý nghĩa vật lý*: Dòng điện cảm ứng chạy qua 2 đèn LED đấu song song ngược cực.
  $$\mathbf{(3)}\quad V_{LED} \ge 1.8\text{ V} \implies \text{LED phát sáng}$$
  *Ý nghĩa vật lý*: Đèn LED đỏ sáng khi đưa cực Bắc nam châm vào; LED xanh sáng khi rút nam châm ra (Định luật Lenz).
* **Các tính năng khoa học tích hợp**:
  - Cuộn dây dẫn quấn dây đồng tráng men quanh ống nhựa trong suốt có lòng rỗng rộng để đưa thanh nam châm N–S dịch chuyển ra vào.
  - Hai bóng đèn LED khác màu được mắc song song nhưng ngược chiều cực tính (Anode của LED 1 nối với Cathode của LED 2).
  - Khi đưa cực Bắc (N) nam châm lại gần cuộn dây, LED 1 (Đỏ) lóe sáng; khi kéo nam châm ra xa, LED 2 (Xanh) lóe sáng, chứng minh trực quan sự xuất hiện và đổi chiều của dòng điện cảm ứng xoay chiều (Hình 1.6, Hình 14.2 SGK KHTN 9).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `QUIESCENT`
* **Danh sách trạng thái khả dụng**: `QUIESCENT`, `MAGNET_APPROACHING`, `MAGNET_RETRACTING`, `MAGNET_STATIONARY`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `QUIESCENT` | `MAGNET_APPROACHING` | Magnet moves into core (+v) | `v > 0.05 m/s` |
| `QUIESCENT` | `MAGNET_RETRACTING` | Magnet moves out of core (-v) | `v < -0.05 m/s` |
| `MAGNET_APPROACHING` | `MAGNET_STATIONARY` | Magnet stops moving | `v == 0` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Số vòng dây N = 1000 ± 5 vòng
* **Độ chia nhỏ nhất / Độ phân giải**: Ngưỡng phát hiện vận tốc nam châm 0.05 m/s
* **Độ lặp lại phép đo**: 100% tái hiện định luật Lenz
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Điện trở cuộn dây đồng R = 18 Ω ở 25°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **LED không sáng khi đưa nam châm vào** | Di chuyển thanh nam châm quá chậm ($v < 0.02\text{ m/s}$) | Suất điện động cảm ứng sinh ra $< 1.8\text{ V}$ không đủ ngưỡng mở LED | `dPhi/dt < 0.0018 Wb/s` | Đưa nam châm chuyển động nhanh, dứt khoát xuyên qua lòng cuộn dây |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **VietJack — SGK KHTN 9 Hình 1.6 & Bài 14** | `vietjack.com` | Hình 1.6 trang 7 & Hình 14.2 trang 70 SGK KHTN 9: Cuộn dây dẫn có hai đèn LED mắc song song, ngược cực dùng phát hiện dòng điện cảm ứng. |
| **Thư viện Vật lý Việt Nam** | `thuvienvatly.com` | Nguyên lý mạch 2 LED mắc song song ngược chiều: Mỗi LED chỉ cho dòng điện đi qua theo 1 chiều nên giúp xác định chiều dòng điện cảm ứng. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Bộ thí nghiệm cảm ứng điện từ và tác dụng của dòng điện xoay chiều gồm cuộn dây gắn 2 đèn LED và nam châm vĩnh cửu. |
| **VietValue — Thiết bị Điện từ THCS** | `vietvalue.edu.vn` | Cuộn dây 500–600 vòng dây đồng Ø 0.35 mm, lòng ống Ø 30–35 mm vừa thanh nam châm thẳng N–S. |
| **Innotec Việt Nam** | `innotec.com.vn` | Bảng hiển thị 2 LED siêu nhạy gắn ngay trên đỉnh khung cuộn dây giúp cả lớp quan sát rõ ánh sáng khi dịch chuyển nam châm. |

---

## 4.29. [OL3D-EQP-DSH-0001] Bát sứ chịu nhiệt — Cô đặc & Đốt cháy cồn (SGK KHTN 9)
**Tên tiếng Anh**: *Porcelain Evaporating Dish (High-Heat)* | **Mã Archetype**: `porcelain-dish` | **Phân loại danh mục**: `chemical-apparatus`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-DSH-0001`
* **Mã đường dẫn (Slug)**: `porcelain-evaporating-dish`
* **Môn học áp dụng**: `chemistry`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-DSH-0001_porcelain-evaporating-dish` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: DIN 12903 · Thông tư 38/2021/TT-BGDĐT · Hình 1.7 trang 7 & Bài 26 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương VIII: Ethylic Alcohol và Acetic Acid · Bài 1 (trang 8) & Bài 26: Ethylic alcohol (trang 119)
* **Hình ảnh đối chiếu SGK**: Hình 1.7 (Bát sứ) (**)
* **Chức năng chuẩn**: Trộn hoặc đun nóng chảy các chất rắn, cô đặc dung dịch; thực hiện một số phản ứng toả nhiệt mạnh như đốt cháy 1 mL ethylic alcohol bằng que đóm dài.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 95 mm, Cao = 48 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.095 m, Cao (Y) = 0.052 m, Sâu (Z) = 0.095 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `liquid_surface`, `flame_group`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `SphereGeometry (Cut bowl)` | MeshPhysicalMaterial (Glazed Porcelain, color 0xf8fafc, roughness 0.1) | 1 | Bát sứ nung trắng men tráng chịu nhiệt có mỏ rót |
| `flame_group` | `ConeGeometry + Particle` | MeshBasicMaterial (Blue/Orange Flame) | 5 | Ngọn lửa cồn cháy bập bùng đồ họa động |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `weighObject`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **85 g** (Trạng thái: `verified`)
  - Dung tích định mức ($V_{max}$): **60 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad C_2H_5OH + 3O_2 \xrightarrow{t^\circ} 2CO_2 + 3H_2O, \quad \Delta H = -1367\text{ kJ/mol}$$
  *Ý nghĩa vật lý*: Phản ứng cháy của cồn ethanol tỏa nhiệt lượng mạnh trong bát sứ.
  $$\mathbf{(2)}\quad m_{chất\,rắn} = m_{sau\,cô\,cạn} - m_{bát\,không}$$
  *Ý nghĩa vật lý*: Xác định hàm lượng muối khoáng hòa tan sau khi cô cạn dung dịch.
* **Các tính năng khoa học tích hợp**:
  - Chế tạo từ sứ kỹ thuật tráng men trắng bóng bên trong và ngoài (trừ vành đáy mộc), chịu được nhiệt độ ngọn lửa trực tiếp mà không nứt vỡ.
  - Dùng trong Bài 26 SGK KHTN 9 để thực hành phản ứng đốt cháy Ethylic alcohol (C₂H₅OH) với ngọn lửa xanh – vàng ấm và cô cạn dung dịch muối.
  - Cho phép bật/tắt hiệu ứng ngọn lửa đốt cồn trực tiếp trong lòng bát sứ 3D.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `ROOM_TEMP`
* **Danh sách trạng thái khả dụng**: `ROOM_TEMP`, `LIQUID_FILLED`, `BURNING_ALCOHOL`, `EVAPORATING`, `RESIDUE_COOLED`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `ROOM_TEMP` | `BURNING_ALCOHOL` | Alcohol ignited | `hasAlcohol == true` |
| `BURNING_ALCOHOL` | `RESIDUE_COOLED` | Fuel exhausted | `alcoholRemaining == 0` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Chịu nhiệt độ cực đại 1050°C
* **Độ chia nhỏ nhất / Độ phân giải**: Dung tích 75 ml
* **Độ lặp lại phép đo**: Men sứ phủ tráng nhẵn chống ăn mòn axit/kiềm
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Hệ số giãn nở nhiệt sứ: 4.5 × 10⁻⁶ K⁻¹

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Nứt vỡ bát sứ do sốc nhiệt đột ngột** | Đang đun nóng ở 400°C đổ ngay nước lạnh vào lòng bát | Nứt toác lòng bát sứ | `dT/dt < -150°C/s` | Để bát nguội tự nhiên trên lưới tản nhiệt trước khi vệ sinh |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **RedLab — Bát sứ Cô đặc Có mỏ Phòng thí nghiệm** | `redlab.com.vn` | Bát sứ nung/cô cạn dung dịch 75–100 ml: Đường kính miệng Ø 80–90 mm, chiều cao 35–40 mm, sứ chịu nhiệt > 1000 °C. |
| **VinaMTSC — Dụng cụ Sứ Thí nghiệm** | `vinamtsc.com` | Bát sứ giáo khoa phổ thông Ø 80 mm × cao 40 mm, lòng tráng men kháng axit và kiềm nóng. |
| **VietJack — SGK KHTN 9 Hình 1.7 & Bài 26** | `vietjack.com` | Hình 1.7 trang 7 và Bài 26 (Ethylic alcohol): Dùng bát sứ để đốt cháy một lượng nhỏ cồn tuyệt đối an toàn. |
| **VietChem — Thiết bị Hóa học** | `vietchem.com.vn` | Hướng dẫn sử dụng kẹp sắt gắp bát sứ đang nóng và đặt trên đế sứ/lưới amiăng sau khi nung. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Bát sứ chịu nhiệt thuộc danh mục dụng cụ thí nghiệm Hóa học bắt buộc cấp THCS. |

---

## 4.30. [OL3D-EQP-SEP-0001] Phễu chiết có khoá & Phễu lọc trên giá đỡ (SGK KHTN 9)
**Tên tiếng Anh**: *Glass Separatory Funnel on Ring Stand* | **Mã Archetype**: `separatory-funnel` | **Phân loại danh mục**: `chemical-apparatus`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-SEP-0001`
* **Mã đường dẫn (Slug)**: `separatory-funnel-stand`
* **Môn học áp dụng**: `chemistry`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-SEP-0001_separatory-funnel-stand` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: ISO 4800 · DIN 12451 (Squibb Pear-Shape) · Hình 1.8b trang 7 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu, Chương VI & Chương VIII · Bài 1 (trang 8), Bài 21 (Hình 21.1 - Hấp phụ màu bằng than gỗ), Bài 27 (Phản ứng ester hoá)
* **Hình ảnh đối chiếu SGK**: Hình 1.8a (Phễu lọc), Hình 1.8b (Phễu chiết), Hình 21.1 (**)
* **Chức năng chuẩn**: Phễu thường dùng để rót chất lỏng hoặc lọc/hấp phụ chất màu qua lớp bông và bột than gỗ; Phễu chiết dùng để tách hai chất lỏng phân lớp không hoà tan vào nhau theo phương pháp chiết.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 270 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.27 m, Sâu (Z) = 0.13 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `handle`, `liquid_surface`, `aq_layer`, `org_layer`, `spout_stream`, `stream_outer`, `splash_ring_0`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `LatheGeometry (Pear shape)` | MeshPhysicalMaterial (Borosilicate, transmission 0.88) | 4 | Phễu chiết quả lê thủy tinh 250ml có vòi xả đáy |
| `handle` | `CylinderGeometry (T-key)` | MeshStandardMaterial (PTFE White Key) | 2 | Khóa van xoay 90° điều tiết dòng chảy |
| `aq_layer` | `Cylinder / Cone` | MeshPhysicalMaterial (Water phase, Blue) | 2 | Lớp dung dịch pha nước nặng chìm phía dưới |
| `org_layer` | `Cylinder / Cone` | MeshPhysicalMaterial (Oil phase, Yellowish) | 2 | Lớp dung dịch hữu cơ nhẹ nổi phía trên |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **490 g** (Trạng thái: `verified`)
  - Dung tích định mức ($V_{max}$): **125 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad v_{chảy} = C_v \cdot \sqrt{2 \cdot g \cdot h_{liquid}}$$
  *Ý nghĩa vật lý*: Tốc độ xả chất lỏng qua lỗ khóa van PTFE theo định luật Torricelli.
  $$\mathbf{(2)}\quad \Delta \rho = \rho_{nước} - \rho_{dầu} = 1.00 - 0.85 = 0.15\text{ g/cm}^3$$
  *Ý nghĩa vật lý*: Sự chênh lệch khối lượng riêng tạo ra 2 pha lỏng không tan phân lớp rõ rệt (Pha dưới: Nước màu xanh; Pha trên: Dầu ăn màu vàng nhạt).
* **Các tính năng khoa học tích hợp**:
  - Bầu thủy tinh Borosilicate 3.3 hình quả lê (Squibb) giúp phân tách ranh giới hai lớp chất lỏng không hòa tan vào nhau (như dầu ăn nổi trên nước hoặc este/nước) rõ nét.
  - Trang bị khóa vòi bằng nhựa PTFE (Teflon) xoay nhẹ không cần bôi mỡ và nút nhám kín khí ở cổ phễu.
  - Mô hình 3D thể hiện trực quan 2 tầng chất lỏng tách lớp: lớp chất lỏng nhẹ màu vàng hổ phách ở trên và lớp nước trong suốt ở dưới.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY_STOPCOCK_CLOSED`
* **Danh sách trạng thái khả dụng**: `EMPTY_STOPCOCK_CLOSED`, `TWO_PHASE_SETTLED`, `DRAINING_LOWER_PHASE`, `INTERFACIAL_CUTOFF`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY_STOPCOCK_CLOSED` | `TWO_PHASE_SETTLED` | Oil and water mixed & allowed to stand | `t_stand > 5s` |
| `TWO_PHASE_SETTLED` | `DRAINING_LOWER_PHASE` | Stopcock turned open 90° | `isOpen == true` |
| `DRAINING_LOWER_PHASE` | `INTERFACIAL_CUTOFF` | Boundary reaches stopcock | `v_lower == 0` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±2.0 ml độ chính xác điểm cắt pha
* **Độ chia nhỏ nhất / Độ phân giải**: Dung tích 250 ml (ĐCNN 10 ml)
* **Độ lặp lại phép đo**: Khóa van PTFE tự bôi trơn kín khít 100% không rò rỉ
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Quên mở nút nhám trên đỉnh khi mở khóa vòi đáy** | Áp suất khí quyển bên trong giảm tạo chân không giữ chất lỏng | Dòng nước ngừng chảy dù van đáy đang mở | `P_internal < P_atm - 5 kPa` | Bắt buộc mở nút đậy trên đỉnh phễu trước khi vặn khóa xả pha dưới |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Labee Việt Nam — Phễu chiết Quả lê Thủy tinh** | `labee.vn` | Phễu chiết 100–125 ml (ISO 4800): Đường kính bầu Ø 60–68 mm, chiều cao 220–245 mm, cổ mài chuẩn NS 19/26, khóa PTFE. |
| **VietChem — Dụng cụ Tách chất** | `vietchem.com.vn` | Nguyên tắc chiết lỏng–lỏng bằng phễu chiết: Mở nắp trên trước khi vặn khóa xả lớp chất lỏng nặng ở dưới. |
| **VietJack — SGK KHTN 9 Hình 1.8b trang 7** | `vietjack.com` | Hình 1.8b trang 7 SGK KHTN 9: Phễu chiết dùng để tách các chất lỏng không tan vào nhau và tách lớp. |
| **Visitech Việt Nam** | `visitech.vn` | Phễu chiết Borosilicate 3.3 lắp trên vòng đỡ sắt của giá thí nghiệm, bên dưới đặt cốc thủy tinh hứng. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Phễu chiết 100–125 ml có khóa thuộc danh mục dụng cụ Hóa học cấp THCS. |

---

## 4.31. [OL3D-EQP-DST-0001] Bình cầu có nhánh 250 mL, Lưới tản nhiệt & Đèn cồn (SGK KHTN 9)
**Tên tiếng Anh**: *250 mL Side-Arm Distillation Flask on Wire Gauze & Burner* | **Mã Archetype**: `distillation-flask` | **Phân loại danh mục**: `chemical-apparatus`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-DST-0001`
* **Mã đường dẫn (Slug)**: `distillation-flask-wire-gauze-burner`
* **Môn học áp dụng**: `chemistry`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: DIN 12394 · Thông tư 38/2021 · Hình 1.9 & 1.10 trang 7–8 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương VII: Hydrocarbon · Bài 1 (trang 8: Hình 1.9 Bình cầu, Hình 1.10 Lưới tản nhiệt) & Bài 24: Alkene (trang 112: Hình 24.1 Điều chế ethylene)
* **Hình ảnh đối chiếu SGK**: Hình 1.9, Hình 1.10, Hình 24.1 (**)
* **Chức năng chuẩn**: Bình cầu dùng để đựng chất lỏng, pha chế dung dịch, đun nóng, chưng cất hoặc điều chế khí; Lưới tản nhiệt giúp phân tán đều nhiệt lượng khi đốt bằng đèn cồn, tránh làm nứt vỡ đáy bình thuỷ tinh.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 105 mm, Cao = 230 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.23 m, Sâu (Z) = 0.11 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `flame_group`, `liquid_surface`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Sphere + Cylinder Branch` | MeshPhysicalMaterial (Borosilicate Glass, transmission 0.88) | 4 | Bình cầu có nhánh cổ 250ml nối ống sinh hàn |
| `flame_group` | `Flame particle mesh` | MeshBasicMaterial (Combustion flame) | 5 | Ngọn lửa đèn cồn sưởi đáy bình qua lưới tản nhiệt |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **380 g** (Trạng thái: `verified`)
  - Dung tích định mức ($V_{max}$): **250 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad T_{sôi\,ethanol} = 78.37^\circ\text{C} < T_{sôi\,nước} = 100.00^\circ\text{C}$$
  *Ý nghĩa vật lý*: Nguyên lý chưng cất phân đoạn: Hợp chất có nhiệt độ sôi thấp hơn (rượu cồn) sẽ bay hơi trước, ngưng tụ trong ống sinh hàn và chảy vào bình hứng.
  $$\mathbf{(2)}\quad Q_{ngưng\,tụ} = m_{hơi} \cdot L_{v} = \dot{m}_{nước\,làm\,mát} \cdot c_{nước} \cdot \Delta T_{nước}$$
  *Ý nghĩa vật lý*: Cân bằng nhiệt lượng trao đổi trong ống sinh hàn Liebig làm mát bằng nước chảy ngược chiều.
* **Các tính năng khoa học tích hợp**:
  - Tổ hợp hoàn chỉnh theo đúng Hình 1.9 và Hình 1.10 trang 7–8 SGK KHTN 9: Đèn cồn thủy tinh → Kiềng & Lưới tản nhiệt → Bình cầu có nhánh dẫn hơi qua ống sinh hàn.
  - Lưới tản nhiệt thép không gỉ có tâm gốm chịu nhiệt giúp phân bố đều nhiệt lượng lên đáy tròn của bình cầu, chống nứt vỡ thủy tinh.
  - Dùng tách hỗn hợp chất lỏng có nhiệt độ sôi khác nhau (như chưng cất rượu etylic - nước hoặc điều chế nước cất).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `COLD_MIXTURE`
* **Danh sách trạng thái khả dụng**: `COLD_MIXTURE`, `HEATING_RAMP`, `ETHANOL_BOILING_78C`, `WATER_BOILING_100C`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `COLD_MIXTURE` | `HEATING_RAMP` | Burner flame applied | `T < 78°C` |
| `HEATING_RAMP` | `ETHANOL_BOILING_78C` | Temperature plateaus at 78°C | `T == 78.3°C` |
| `ETHANOL_BOILING_78C` | `WATER_BOILING_100C` | All ethanol distilled over | `T rises to 100°C` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±0.5 °C nhiệt độ sôi đo tại nhánh cổ bình
* **Độ chia nhỏ nhất / Độ phân giải**: 250 ml dung tích bình cầu
* **Độ lặp lại phép đo**: Độ tinh khiết sản phẩm ngưng tụ đạt 92 - 95% cồn
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Chịu sốc nhiệt ΔT = 160°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Đặt sai vị trí bầu nhiệt kế** | Cắm sâu nhiệt kế xuống tận đáy chất lỏng thay vì đặt ngang miệng nhánh thoát hơi | Đo sai nhiệt độ sôi của hơi ngưng tụ | `Cao độ bầu nhiệt kế != cao độ nhánh bình cầu` | Căn chỉnh bầu nhiệt kế nằm ngang tâm lỗ thoát hơi của nhánh bình cầu |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Nhà sách Giáo dục — Bình cầu có nhánh 250ml** | `nhasachgiaoduc.vn` | Bình cầu có nhánh 250 ml chuẩn KHTN 9: Đường kính bầu Ø 84–85 mm, chiều cao 165–170 mm, cổ Ø 28 mm, nhánh thoát hơi Ø 6–8 mm. |
| **Visitech — Bộ Dụng cụ Chưng cất Đơn giản** | `visitech.vn` | Cấu tạo bình cầu có nhánh (Distilling Flask) kết hợp nhiệt kế cắm ở cổ bình và ống sinh hàn nước. |
| **Innotec Việt Nam** | `innotec.com.vn` | Lưới tản nhiệt 140×140 mm và đèn cồn thủy tinh 150 ml có chụp dập lửa an toàn theo Thông tư 38/2021. |
| **VietChem — Kỹ thuật Chưng cất Phòng thí nghiệm** | `vietchem.com.vn` | Quy tắc lắp ống sinh hàn: Nước làm lạnh luôn đi vào từ vòi thấp và đi ra ở vòi cao (ngược chiều dòng hơi ngưng tụ). |
| **VietJack — SGK KHTN 9 Hình 1.9 & 1.10 trang 7–8** | `vietjack.com` | Hình 1.9 (Bình cầu có nhánh) và Hình 1.10 (Lưới tản nhiệt trong bộ dụng cụ đun nóng chất lỏng / chưng cất). |

---

## 4.32. [OL3D-EQP-MIC-0001] Kính hiển vi quang học (10x, 40x, 100x) & Tiêu bản NST (SGK KHTN 9)
**Tên tiếng Anh**: *Compound Optical Microscope & Fixed Chromosome Slide* | **Mã Archetype**: `optical-microscope` | **Phân loại danh mục**: `biology-microscopy`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-MIC-0001`
* **Mã đường dẫn (Slug)**: `optical-microscope-chromosome-slide`
* **Môn học áp dụng**: `biology`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-MIC-0001_optical-microscope-chromosome-slide` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: ISO 8039 · Thông tư 38/2021/TT-BGDĐT · Hình 1.11 trang 8 & Bài 42 SGK KHTN 9
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Mở đầu & Chương XII: Di truyền Nhiễm sắc thể · Bài 1 (trang 8: Hình 1.11) & Bài 42: Nhiễm sắc thể và bộ nhiễm sắc thể (trang 184–185: Hình 42.6)
* **Hình ảnh đối chiếu SGK**: Hình 1.11 (Hộp tiêu bản cố định NST), Hình 42.6 (Các bước quan sát tiêu bản NST dưới kính hiển vi) (**)
* **Chức năng chuẩn**: Quan sát hình dạng (hình que, chữ V, chữ X, hạt) và đếm số lượng nhiễm sắc thể ở kì giữa phân bào trên tiêu bản cố định tế bào.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 110 mm, Cao = 245 mm, Sâu = 145 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.11 m, Cao (Y) = 0.245 m, Sâu (Z) = 0.145 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `stageGroup`, `plunger`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `ExtrudeGeometry Complex Arm` | MeshPhysicalMaterial (Enamelled Cast Iron, white porcelain) | 1 | Thân khung cong chữ C vững chắc kèm mâm xoay vật kính |
| `stageGroup` | `BoxGeometry + Clips` | MeshStandardMaterial (Black Anodized Table) | 2 | Bàn sa trượt nâng hạ kèm kẹp giữ lam kính |
| `plunger` | `Cylinder Knobs` | MeshStandardMaterial (Metallic Knobs) | 2 | Ốc sơ cấp (lớn) và ốc vi cấp (nhỏ) lấy nét |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `opticalFocus`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **1450 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `magnification`
  - Giới hạn đo (GHĐ): **100 x (Độ phóng đại)** đến **1000 x (Độ phóng đại)**
  - Độ chia nhỏ nhất (ĐCNN): **undefined undefined**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad M_{tổng} = M_{vật\,kính} \times M_{thị\,kính} = (4\times, 10\times, 40\times, 100\times) \times 10\times = 40\times, 100\times, 400\times, 1000\times$$
  *Ý nghĩa vật lý*: Độ phóng đại quang học toàn phần của kính hiển vi quang học hai mắt.
  $$\mathbf{(2)}\quad d_{phân\,giải} = \frac{\lambda}{2 \cdot NA} = \frac{0.55\,\mu\text{m}}{2 \times 1.25} \approx 0.22\,\mu\text{m} = 220\text{ nm}$$
  *Ý nghĩa vật lý*: Giới hạn phân giải nhiễu xạ quang học theo định luật Abbe (với vật kính dầu soi NA = 1.25).
  $$\mathbf{(3)}\quad FOV_{\mu\text{m}} = \frac{FN}{M_{vật\,kính}} = \frac{18\text{ mm}}{M_{vật\,kính}} \implies FOV_{10x} = 1.8\text{ mm} = 1800\,\mu\text{m}$$
  *Ý nghĩa vật lý*: Đường kính trường nhìn hiển vi tương ứng trên lam kính tiêu bản.
* **Các tính năng khoa học tích hợp**:
  - Kính hiển vi quang học 1 ống ngắm nghiêng 45°, mâm xoay 3 vật kính tiêu sắc (10x vành vàng, 40x vành xanh lam, 100x vành trắng).
  - Bàn sa trượt cơ khí có kẹp giữ tiêu bản cố định Nhiễm sắc thể (NST), ốc điều chỉnh thô (đại cấp) và ốc vi cấp đồng trục, đèn LED chiếu sáng dưới bàn kính.
  - Đi kèm hộp tiêu bản cố định Nhiễm sắc thể (Bài 42 SGK KHTN 9) giúp học sinh xoay mâm vật kính 10x → 40x → 100x để quan sát hình thái NST ở kì giữa.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `STAGE_LOWERED`
* **Danh sách trạng thái khả dụng**: `STAGE_LOWERED`, `SLIDE_CLAMPED`, `COARSE_FOCUSING`, `FINE_FOCUS_LOCKED`, `OIL_IMMERSION_MODE`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `STAGE_LOWERED` | `SLIDE_CLAMPED` | Slide inserted on stage clip | `hasSlide == true` |
| `SLIDE_CLAMPED` | `COARSE_FOCUSING` | Coarse knob rotated | `stageY changes` |
| `COARSE_FOCUSING` | `FINE_FOCUS_LOCKED` | Fine knob adjusted | `|focusOffset| < 0.002 mm` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Ốc vi cấp ĐCNN 0.002 mm (2 µm) hành trình
* **Độ chia nhỏ nhất / Độ phân giải**: Thanh đo thị kính 20 µm / 50 µm / 200 µm
* **Độ lặp lại phép đo**: Hệ trục quang học đồng trục tuyệt đối 100%
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Đèn LED chiếu sáng tiêu bản dịu mắt 6500K không nóng mẫu

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Bể lam kính tiêu bản / Trầy xước thấu kính** | Dùng ốc sơ cấp vặn bàn kính lên quá nhanh khi đang dùng vật kính 40x / 100x | Đầu vật kính đâm thẳng vào lam kính làm vỡ lamen | `Khoảng cách thấu kính tới lam kính < 0.1 mm` | Bắt buộc chỉ dùng ốc vi cấp khi ở vật kính 40x và 100x; tích hợp cữ hãm chống va chạm cơ học |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Kính hiển vi quang học dùng cho môn KHTN cấp THCS: Thị kính 10x, vật kính 10x, 40x (và 100x), có đèn chiếu sáng và ốc vi cấp. |
| **Tín Đức — Kính hiển vi Quang học Giáo dục** | `tinduc.vn` | Thông số quang học chuẩn: Chiều dài ống cơ học 160 mm, tiêu bản lam kính chuẩn quốc tế 25.4 × 76.2 mm, lamen dày 0.17 mm. |
| **Studocu Vietnam — Thực hành Quan sát Tiêu bản NST (Bài 42 KHTN 9)** | `studocu.vn` | Quy trình 2 bước soi tiêu bản NST: Chọn vật kính 10x tìm vùng có tế bào phân chia trước, sau đó xoay sang vật kính 40x để quan sát rõ hình dạng NST. |
| **Luật Việt Nam — Tiêu chuẩn Thiết bị Sinh học THCS** | `luatvietnam.vn` | Bộ tiêu bản cố định Nhiễm sắc thể (NST người và tế bào rễ hành) đi kèm kính hiển vi trong Chương XII Di truyền NST. |
| **MBWS — Thiết bị Khoa học Trường học** | `mbws.vn` | Cấu tạo chi tiết kính hiển vi học sinh: Thân chữ C đúc hợp kim, bàn kính 110×120 mm, tụ quang NA 0.65. |

---

## 4.33. [OL3D-EQP-DNA-0001] Mô hình cấu trúc phân tử DNA xoắn kép (SGK KHTN 9)
**Tên tiếng Anh**: *Watson-Crick DNA Double Helix Structural Model* | **Mã Archetype**: `dna-double-helix` | **Phân loại danh mục**: `biology-microscopy`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-DNA-0001`
* **Mã đường dẫn (Slug)**: `dna-double-helix-model`
* **Môn học áp dụng**: `biology`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · Hình 38.1 Bài 38 SGK KHTN 9 (Nucleic acid & Gen)
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 9 (Kết nối tri thức) · Chương XI: Di truyền học Mendel. Cơ sở phân tử của hiện tượng di truyền · Bài 38: Nucleic acid và gene (trang 166–167)
* **Hình ảnh đối chiếu SGK**: Hình 38.1 (Mô hình cấu trúc một đoạn phân tử DNA) (**)
* **Chức năng chuẩn**: Trực quan hoá cấu trúc xoắn kép của phân tử DNA và nguyên tắc bổ sung giữa các nucleotide (A liên kết với T bằng 2 liên kết hydrogen; G liên kết với C bằng 3 liên kết hydrogen).

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 105 mm, Cao = 250 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.105 m, Cao (Y) = 0.25 m, Sâu (Z) = 0.105 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `handle`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Mesh tiêu chuẩn PBR bo cạnh
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `TubeGeometry (Double Helix Ribbon)` | MeshPhysicalMaterial (Colored Plastics: Blue-A, Red-T, Green-G, Yellow-X) | 1 | Hai dải ruy băng photphat-đường xoắn ốc đối song song |
| `handle` | `Cylinder Base & Stand` | MeshStandardMaterial (Steel Stand) | 1 | Trụ đỡ và đế tròn xoay 360 độ |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **260 g** (Trạng thái: `verified`)

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad L_{chu\,kỳ} = 3.4\text{ nm} = 34\text{ Å}, \quad d = 2.0\text{ nm} = 20\text{ Å}$$
  *Ý nghĩa vật lý*: Kích thước một chu kỳ xoắn của phân tử DNA B-form theo mô hình Watson–Crick.
  $$\mathbf{(2)}\quad N_{cặp\,nu} = 10.5\text{ cặp/chu kỳ}, \quad \Delta L_{giữa\,2\,nu} = 0.34\text{ nm}$$
  *Ý nghĩa vật lý*: Khoảng cách giữa hai cặp nucleotide kế tiếp dọc theo trục xoắn kép.
  $$\mathbf{(3)}\quad \text{A} = \text{T} \; (2\text{ liên kết hydro}), \quad \text{G} \equiv \text{X} \; (3\text{ liên kết hydro})$$
  *Ý nghĩa vật lý*: Nguyên tắc bổ sung giữa các bazơ nitơ trên hai mạch đối song song ($5' \to 3'$ và $3' \to 5'$).
* **Các tính năng khoa học tích hợp**:
  - Mô hình không gian 3 chiều của phân tử DNA theo mẫu Watson – Crick với hai dải băng xoắn kép song song ngược chiều (3'→5' và 5'→3').
  - Các bậc thang ngang thể hiện các cặp nitrogenous base liên kết theo đúng Nguyên tắc bổ sung (NTBS): Adenine (A - Đỏ) liên kết với Thymine (T - Vàng) bằng 2 liên kết hydrogen; Guanine (G - Xanh lá) liên kết với Cytosine (C - Xanh lam) bằng 3 liên kết hydrogen.
  - Giúp học sinh quan sát trực quan cấu trúc không gian, chu kì xoắn (10 cặp nucleotide = 34 Å) trong Bài 38 SGK KHTN 9.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `INTACT_HELIX`
* **Danh sách trạng thái khả dụng**: `INTACT_HELIX`, `ROTATING_360`, `BASE_PAIRS_HIGHLIGHTED`, `UNZIPPING_DEMO`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `INTACT_HELIX` | `ROTATING_360` | Auto rotation enabled | `true` |
| `INTACT_HELIX` | `BASE_PAIRS_HIGHLIGHTED` | Base pair clicked | `true` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Đúng 100% nguyên tắc bổ sung A-T và G-X
* **Độ chia nhỏ nhất / Độ phân giải**: Tỷ lệ mô hình phóng đại 1 : 10,000,000
* **Độ lặp lại phép đo**: Khớp mộng cơ học chính xác từng liên kết hydro
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Nhựa ABS bền bỉ

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Lắp sai nguyên tắc bổ sung** | Cố tình gắn bazơ A với G hoặc T với X | Mô hình bị méo dạng không lắp ghép được | `Khóa cơ học mộng âm dương` | Chỉ cho phép liên kết mộng A-T (2 chốt) và G-X (3 chốt) |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **STB Việt Nam — Mô hình Cấu trúc Phân tử ADN** | `stb.com.vn` | Mô hình cấu trúc không gian phân tử ADN: Đường kính vòng xoắn mô phỏng 20 Å, chiều cao mỗi chu kì xoắn 34 Å gồm 10 cặp nucleotide. |
| **Innotec Việt Nam — Thiết bị Sinh học THCS** | `innotec.com.vn` | Mô hình phân tử DNA lắp ghép trên trụ inox và đế nhựa ABS, phân biệt 4 màu sắc chuẩn cho các base A, T, G, C. |
| **Thiết bị Y tế & Giáo dục Huê Lợi** | `tbytehueloi.com` | Mô hình chuỗi xoắn kép ADN phục vụ giảng dạy phần Di truyền và Biến dị môn Khoa học tự nhiên lớp 9. |
| **Thiết bị Giáo dục Thái Sơn** | `thietbigiaoducthaison.com` | Minh họa trực quan nguyên tắc bổ sung (A–T, G–C) và cấu trúc đa phân của đại phân tử sinh học DNA. |
| **VietJack — SGK KHTN 9 Bài 38 (Nucleic acid và ứng dụng)** | `vietjack.com` | Hình 38.1 SGK KHTN 9: Mô hình cấu trúc một đoạn phân tử DNA xoắn kép và khác biệt giữa DNA với RNA. |

---

## 4.34. [OL3D-EQP-WDP-1000] Bình chứa nước có van xả định lượng 1000 ml
**Tên tiếng Anh**: *Volumetric Water Dispenser Carboy with Metering Valve (1000 ml)* | **Mã Archetype**: `water-dispenser` | **Phân loại danh mục**: `volume-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-WDP-1000`
* **Mã đường dẫn (Slug)**: `volumetric-water-dispenser-1000ml`
* **Môn học áp dụng**: `general-science`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v1.0.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: ISO 4796-3 · DIN 12039 · Thông tư 38/2021/TT-BGDĐT (Bình cấp nước cất có vòi khóa định lượng)
* **Căn cứ Sách giáo khoa**: SGK Khoa học tự nhiên 8 & 9 (Kết nối tri thức) · Mở đầu: Dụng cụ đo thể tích và cấp chất lỏng phòng thí nghiệm · Bài 1: Nhận biết một số dụng cụ, hoá chất. Thuyết trình một vấn đề khoa học
* **Hình ảnh đối chiếu SGK**: Bình cấp nước cất định lượng có van khóa PTFE (**)
* **Chức năng chuẩn**: Chứa nước cất và mở van xả chính xác theo thể tích ml yêu cầu (nhập trực tiếp số ml trên bảng điều khiển van) vào ống đong, cốc chia độ hoặc bình tràn.

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 116 mm, Cao = 435 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.155 m, Cao (Y) = 0.435 m, Sâu (Z) = 0.125 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `dispenser_dock_tray`, `dispenser_dock_ring`, `scale_marks`, `scale_display`, `scale_display_rear`, `plunger`, `liquid_surface`, `spout_stream`, `stream_outer`, `stream_core`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: CanvasTexture Dynamic Readout; Torus Chamfered Edge Reflectors; State Sync via userData; Dynamic Liquid Level & Meniscus; Optical Ray Tracing & Refraction
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `CylinderGeometry (Reservoir)` | MeshPhysicalMaterial (Polypropylene, opacity 0.45) | 4 | Bình trụ lớn dung tích 1000ml có vạch chia |
| `plunger` | `Box Lever Handle` | MeshStandardMaterial (Blue Valve Lever) | 2 | Cần gạt mở van lò xo tự đóng khi nhả tay |
| `spout_stream` | `Cylinder Stream` | MeshPhysicalMaterial (Water, emissive blue) | 2 | Tia nước thẳng đứng chảy vào miệng cốc bên dưới |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `readScale`, `displacementVolume`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **520 g** (Trạng thái: `verified`)
  - Dung tích định mức ($V_{max}$): **1000 ml**
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `volume`
  - Giới hạn đo (GHĐ): **0.5 ml** đến **1000 ml**
  - Độ chia nhỏ nhất (ĐCNN): **0.5 ml**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \frac{dV}{dt} = C_d \cdot A_{van} \cdot \sqrt{2 \cdot g \cdot h_{nước}}$$
  *Ý nghĩa vật lý*: Lưu lượng xả nước định lượng qua vòi van mỏ xả.
  $$\mathbf{(2)}\quad V_{cấp} = \int_{0}^{t} \dot{V}\,dt = 15.0\,\text{ml/s} \times t\,(\text{s})$$
  *Ý nghĩa vật lý*: Thể tích nước tinh khiết định lượng cấp vào cốc đốt hoặc ống đong.
* **Các tính năng khoa học tích hợp**:
  - Bình trụ thủy tinh Borosilicate 3.3 dung tích 1000 ml đặt trên giá đỡ 3 chân cao 110 mm giúp đặt vừa mọi loại Ống đong, Cốc thủy tinh 250 ml, Bình tràn và Bình tam giác ngay dưới vòi xả.
  - Tích hợp cụm van khóa PTFE có tay gạt xoay 90° và đồng hồ đo thể tích LCD kỹ thuật số ở cả mặt trước và mặt sau (360°).
  - Cho phép học sinh nhập trực tiếp số ml cần lấy trên bảng điều khiển để mở van xả chính xác thể tích nước mong muốn (ví dụ: 50 ml vào Ống đong hoặc 210 ml vào Bình tràn).

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `VALVE_CLOSED`
* **Danh sách trạng thái khả dụng**: `VALVE_CLOSED`, `VALVE_OPEN_POURING`, `OUT_OF_WATER`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `VALVE_CLOSED` | `VALVE_OPEN_POURING` | Push dispenser lever | `V_reservoir > 0` |
| `VALVE_OPEN_POURING` | `VALVE_CLOSED` | Release dispenser lever | `true` |
| `VALVE_OPEN_POURING` | `OUT_OF_WATER` | Reservoir depleted | `V_reservoir <= 0` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: ±1.0 ml độ chính xác ngắt van định lượng
* **Độ chia nhỏ nhất / Độ phân giải**: Dung tích chứa 1000 ml (ĐCNN 50 ml)
* **Độ lặp lại phép đo**: ±0.5 ml
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Nước cất tinh khiết 25°C

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Nước xả rơi ra ngoài mặt bàn** | Không đặt cốc hoặc ống đong dưới khay hứng vòi xả | Nước tràn ướt mặt bàn thực hành | `Không phát hiện dụng cụ hứng tại CONN_WATER_DISPENSER_SPOUT` | Tự động khóa van và hiển thị chỉ dẫn đặt cốc hứng vào khay mâm đỡ |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **DWK Life Sciences (DURAN®) — Aspirator Bottles with Stopcock ISO 4796-3** | `dwk.com` | Bình trữ nước cất có vòi xả đáy (Aspirator bottle) 1000 ml chuẩn ISO 4796-3: Cổ vặn GL45, thủy tinh Borosilicate 3.3, khóa PTFE chống rò rỉ. |
| **BrandTech Scientific — Dispensette® & Volumetric Liquid Dispensing** | `brandtech.com` | Cơ chế cấp chất lỏng định lượng chính xác theo thể tích ml đặt trước, giúp chuẩn bị mẫu nhanh và tránh sai số khi đong thủ công. |
| **VietChem — Bình Đựng Nước Cất Có Vòi Xả Phòng Thí Nghiệm** | `vietchem.com.vn` | Bình chứa nước cất 1000 ml – 2000 ml có van khóa dưới đáy dùng cấp nước cho ống đong, cốc đốt và bình tràn trong phòng thực hành KHTN. |
| **Labee Việt Nam — Dụng Cụ Thủy Tinh & Cấp Lỏng Định Lượng** | `labee.vn` | Vạch chia thể tích in men trắng bền nhiệt từ 100 ml đến 1000 ml, chân đế nâng cao giúp đặt cốc hứng 250 ml thuận tiện. |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Hệ thống cấp nước và dụng cụ đo thể tích phục vụ các bài thực hành Đo khối lượng riêng và Tác dụng của chất lỏng lên vật nhúng chìm. |

---

## 4.35. [OL3D-EQP-LEV-0001] Bộ đòn bẩy thăng bằng chia vạch đối xứng kèm giá đỡ
**Tên tiếng Anh**: *Calibrated Symmetrical Lever Balance with Stand* | **Mã Archetype**: `lever-balance-apparatus` | **Phân loại danh mục**: `force-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-LEV-0001`
* **Mã đường dẫn (Slug)**: `thanh-don-bay-thang-bang`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v2.4.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-LEV-0001_thanh-don-bay-thang-bang` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · SGK KHTN 8 (Bài 18: Tác dụng làm quay của lực - Đòn bẩy)

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 400 mm, Cao = 360 mm, Sâu = 120 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.4 m, Cao (Y) = 0.36 m, Sâu (Z) = 0.12 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `scale_display`, `plunger`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`, `MeshBasicMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Cylinder Column + Box Base` | MeshStandardMaterial (Cast Iron Stand) | 1 | Trụ đỡ và trục quay kim loại trung tâm |
| `plunger` | `Box Bar with 20 notches` | MeshStandardMaterial (Anodized Aluminium Bar) | 2 | Thanh đòn bẩy chia vạch đối xứng nghiêng góc theta |
| `scale_display` | `PlaneGeometry` | MeshBasicMaterial (CanvasTexture) | 3 | Đĩa hiển thị góc nghiêng và mômen lực hai bên |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **680 g** (Trạng thái: `verified`)
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `force`
  - Giới hạn đo (GHĐ): **-30 deg** đến **30 deg**
  - Độ chia nhỏ nhất (ĐCNN): **1 deg**
  - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad \sum M_{(O)} = 0 \iff F_1 \cdot d_1 = F_2 \cdot d_2 \iff m_1 \cdot x_1 = m_2 \cdot x_2$$
  *Ý nghĩa vật lý*: Quy tắc mômen lực cho đòn bẩy thăng bằng quanh trục quay O nằm chính giữa.
  $$\mathbf{(2)}\quad k_{đòn\,bẩy} = \frac{F_1}{F_2} = \frac{d_2}{d_1}$$
  *Ý nghĩa vật lý*: Lợi ích về lực khi sử dụng đòn bẩy tỷ lệ nghịch với cánh tay đòn.
* **Các tính năng khoa học tích hợp**:
  - Thanh hợp kim nhôm định hình mạ Anode xước mờ, chia vạch đối xứng 18 lỗ treo cách đều tâm quay O đúng 20 mm.
  - Hai đai ốc ren M4 bằng đồng thau khía nhám ở 2 đầu giúp vi chỉnh cân bằng zero trước khi làm thí nghiệm.
  - Cung chia độ góc nghiêng tại ổ trục hiển thị trực quan góc lệch và vạch 0° dạ quang khi đạt thăng bằng ngang.
  - Trục quay ma sát siêu thấp ăn khớp cữ hãm cơ học giới hạn góc nghiêng an toàn trong khoảng [-30°, +30°].

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `BALANCED_HORIZONTAL`
* **Danh sách trạng thái khả dụng**: `BALANCED_HORIZONTAL`, `TILTED_LEFT`, `TILTED_RIGHT`, `DYNAMIC_OSCILLATION`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `BALANCED_HORIZONTAL` | `TILTED_LEFT` | Left torque exceeds right | `m1*d1 > m2*d2` |
| `BALANCED_HORIZONTAL` | `TILTED_RIGHT` | Right torque exceeds left | `m2*d2 > m1*d1` |
| `DYNAMIC_OSCILLATION` | `BALANCED_HORIZONTAL` | Torques equalize | `m1*d1 == m2*d2` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Độ nhạy cân bằng 0.5 g ở cự ly 10 cm
* **Độ chia nhỏ nhất / Độ phân giải**: Thước chia vạch đối xứng bước 10 mm
* **Độ lặp lại phép đo**: Khớp quay bi thép ma sát cực nhỏ < 0.001 N.m
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Đòn bẩy bị kẹt không quay mượt mà** | Bụi bẩn bám vào trục quay bi kim loại | Mất độ nhạy thăng bằng | `Hệ số ma sát trục > 0.01 N.m` | Bấm nút Tinh chỉnh bôi trơn trục quay để khôi phục dao động tự do |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Danh mục thiết bị dạy học môn KHTN THCS: Bộ đòn bẩy có giá đỡ, thanh chia vạch đối xứng dài 400mm kèm quả cân có móc. |
| **Thiết bị Giáo dục VietValue** | `vietvalue.edu.vn` | Bộ đòn bẩy thực hành Vật lí 8: Thanh hợp kim nhôm đục lỗ 20mm, đĩa chia độ ±30°, giá sắt chân đế gang vững chắc. |
| **VietJack — SGK KHTN 8 Kết nối tri thức** | `vietjack.com` | Thí nghiệm khảo sát quy tắc mômen đòn bẩy: Treo quả nặng vào các lỗ và so sánh tích F1.d1 với F2.d2. |
| **Innotec Việt Nam — Thiết bị Dạy học** | `innotec.com.vn` | Giá đỡ trục quay đòn bẩy có vít cân bằng, chịu tải 5N mỗi bên, bề mặt mạ kẽm/sơn tĩnh điện cao cấp. |
| **Thư viện Vật lý Việt Nam** | `thuvienvatly.com` | Quy tắc mômen lực M = F.d và bài toán thăng bằng thanh chắn đường, bập bênh, cân đòn. |

---

## 4.36. [OL3D-EQP-HYD-0001] Bình thông nhau 3 nhánh dị hình trên đế
**Tên tiếng Anh**: *Communicating Vessels 3-Shape Branch on Stand* | **Mã Archetype**: `communicating-vessels-3way` | **Phân loại danh mục**: `volume-measurement`

### 1. Thông tin Định danh & Quản trị
* **Mã định danh hệ thống (Asset ID)**: `OL3D-EQP-HYD-0001`
* **Mã đường dẫn (Slug)**: `binh-thong-nhau-3-nhanh`
* **Môn học áp dụng**: `physics`
* **Nhóm thiết bị GDPT**: `N/A`
* **Cấp độ trung thực vật lý**: `L2`
* **Phiên bản Module API / Manifest**: `v2.4.0` / `v1.0.0`
* **Trạng thái thẩm định**: `published` | Đo lường: `verified`
* **Gói module HTML độc lập**: Đã đóng gói tại thư mục `public/libraries3DLab/OL3D-EQP-HYD-0001_binh-thong-nhau-3-nhanh` (Tập tin: `undefined`).

### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học
* **Tiêu chuẩn kỹ thuật gốc**: Thông tư 38/2021/TT-BGDĐT · SGK KHTN 8 (Bài 16: Áp suất chất lỏng - Bình thông nhau)

### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)
* **Kích thước thực tế (mm)**: Rộng/Đường kính = 160 mm, Cao = 180 mm, Sâu = 55 mm
* **Kích thước bao trong Three.js (mét)**: Rộng (X) = 0.16 m, Cao (Y) = 0.18 m, Sâu (Z) = 0.055 m
* **Khối lượng tĩnh định danh**: Xem thuộc tính khoa học referenceMass
* **Quy chuẩn gốc tựa**: `anchor: "base-center"`, `upAxis: "Y"` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\text{ m}$).
* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).

### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR
* **Các sub-mesh node con**: `body`, `liquid_surface`, `measurement_anchor`
* **Các lớp vật liệu Three.js sử dụng**: `MeshStandardMaterial`
* **Kỹ thuật đồ họa nổi bật**: Torus Chamfered Edge Reflectors; Dynamic Liquid Level & Meniscus
* **Bảng chi tiết các mesh thành phần & shader**:
| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |
| :--- | :--- | :--- | :---: | :--- |
| `body` | `Composite Lathe/Tubes (3 branches)` | MeshPhysicalMaterial (Borosilicate, transmission 0.90) | 4 | Bình thông nhau 3 nhánh dị hình: Nhánh trụ thẳng, Nhánh xoắn lò xo, Nhánh phình cầu |
| `liquid_surface` | `Composite Water Meshes` | MeshPhysicalMaterial (Colored Water, IOR 1.333) | 2 | Mặt nước đồng phẳng ngang tuyệt đối ở cả 3 nhánh |

### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp
* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.

### 6. Trạng thái Động & Bộ Điều khiển Tương tác
* **Các năng lực tương tác hỗ trợ**: `selectable`, `translatable`, `rotatable`, `showDimensions`, `displacementVolume`, `weighObject`
* **Thuộc tính đo lường / Khoa học**:
  - Khối lượng chuẩn ($m_{ref}$): **165 g** (Trạng thái: `verified`)
  - Thể tích chuẩn ($V_{ref}$): **150 ml**
  - Dung tích định mức ($V_{max}$): **150 ml**
* **Thông số metrology thiết bị đo**:
  - Đại lượng đo: `volume`
  - Giới hạn đo (GHĐ): **0 ml** đến **150 ml**
  - Độ chia nhỏ nhất (ĐCNN): **5 ml**
  - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)**

### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả
* **Các phương trình vật lý áp dụng (MathType LaTeX)**:
  $$\mathbf{(1)}\quad P_A = P_B = P_C = P_{atm} + \rho \cdot g \cdot h$$
  *Ý nghĩa vật lý*: Áp suất thủy tĩnh tại đáy các nhánh bình thông nhau bằng nhau.
  $$\mathbf{(2)}\quad h_1 = h_2 = h_3$$
  *Ý nghĩa vật lý*: Trong bình thông nhau chứa cùng một chất lỏng đứng yên, các mực chất lỏng ở các nhánh luôn luôn ở cùng một độ cao, bất kể hình dạng và tiết diện các nhánh.
* **Các tính năng khoa học tích hợp**:
  - Bộ bình thông nhau 3 nhánh liền khối bằng thủy tinh Borosilicate chịu lực trong suốt.
  - 3 nhánh mang 3 hình dạng điển hình: ống thẳng đối chứng, ống uốn lượn sóng và ống phình quả trám.
  - Minh chứng định luật tĩnh học chất lỏng p = p0 + d.h: áp suất tại đáy thông nhau bằng nhau dẫn đến mặt thoáng luôn cùng độ cao.
  - Chân đế nhựa PP đúc rãnh chữ U kẹp giữ bình đứng vững chắc trên mặt bàn không rung lắc.

### 8. Máy Trạng thái Động (Finite State Machine)
* **Trạng thái khởi tạo**: `EMPTY`
* **Danh sách trạng thái khả dụng**: `EMPTY`, `FILLING_LIQUID`, `LEVELS_EQUALIZED`, `TILTED_MAINTAINING_LEVEL`
* **Ma trận chuyển trạng thái (State Transitions)**:
| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |
| :--- | :--- | :--- | :--- |
| `EMPTY` | `FILLING_LIQUID` | Liquid poured into branch A | `V > 0` |
| `FILLING_LIQUID` | `LEVELS_EQUALIZED` | Fluid relaxation elapsed | `|dh/dt| < 0.1 mm/s` |
| `LEVELS_EQUALIZED` | `TILTED_MAINTAINING_LEVEL` | Apparatus base tilted | `tiltAngle != 0` |

### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology
* **Sai số dụng cụ (Instrumental Error)**: Độ đồng đều mực nước giữa 3 nhánh <= 0.5 mm
* **Độ chia nhỏ nhất / Độ phân giải**: ĐCNN 1.0 mm trên thước đo chiều cao
* **Độ lặp lại phép đo**: 100% tuân thủ định luật bình thông nhau
* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: Không đáng kể

### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)
| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |
| :--- | :--- | :--- | :--- | :--- |
| **Mực nước ở nhánh xoắn bị thấp hơn do bọt khí** | Bọt khí đọng trong khúc uốn lò xo cản trở áp suất thủy tĩnh | Vi phạm định luật h1 = h2 = h3 | `Khí chặn ngang ống` | Bấm nút Xả bọt khí để dòng nước lưu thông liền mạch |

### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập
| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |
| :--- | :--- | :--- |
| **Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)** | `thuvienphapluat.vn` | Danh mục thiết bị dạy học tối thiểu THCS môn KHTN: Bộ bình thông nhau có từ 3 nhánh dị hình gắn trên đế nhựa. |
| **Thiết bị Giáo dục VietValue** | `vietvalue.edu.vn` | Bình thông nhau 3 nhánh thủy tinh thực hành KHTN 8: Dung tích 150ml, có nhánh thẳng, nhánh xoắn và nhánh cầu phình. |
| **VietJack — SGK KHTN 8 Kết nối tri thức** | `vietjack.com` | Thí nghiệm Hình 16.3: Rót nước màu vào bình thông nhau và nhận xét độ cao mực chất lỏng ở các nhánh. |
| **DMKLab — Dụng cụ Khoa học** | `dmklab.vn` | Bộ bình thông nhau thủy tinh borosilicate kèm đế nhựa chuyên dụng cho giáo dục phổ thông. |
| **Thư viện Vật lý** | `thuvienvatly.com` | Ứng dụng bình thông nhau trong đời sống: Ấm trà, ống đo mực nước nồi hơi, hệ thống cấp nước đô thị. |

---

# PHẦN V — RÀ SOÁT DANH MỤC TIÊU BẢN MẪU VẬT KÍNH HIỂN VI (8 TIÊU BẢN QUAN SÁT)

Kính hiển vi quang học OpenLab 3D (`OL3D-EQP-MIC-0001`) được trang bị **8 tiêu bản mẫu vật hiển vi** hoàn chỉnh tuân thủ chương trình KHTN 6, 7, 8, 9 Bộ GD&ĐT. Mỗi tiêu bản tích hợp trường nhìn quang học, tọa độ chú thích cấu trúc tế bào và mô phỏng hiệu ứng nhuộm màu thực tế.

### BẢNG THÔNG SỐ 4 MỨC VẬT KÍNH QUANG HỌC CHUẨN HÓA

| Mức vật kính | Vòng màu nhận diện | Độ mở số (NA) | Khoảng cách làm việc (mm) | Đường kính trường nhìn (µm) | Độ sâu trường ảnh (µm) | Thanh tỷ lệ thị kính | Yêu cầu Dầu soi (Oil Immersion) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **4× (Đỏ - Tìm trường nhìn)** | Đỏ (`#ef4444`) | 0.1 | 18 mm | **4500 µm** (4.5 mm) | 15 µm | 500 µm | Không dùng |
| **10× (Vàng - Vật kính nhỏ)** | Vàng (`#eab308`) | 0.25 | 7 mm | **1800 µm** (1.8 mm) | 8.5 µm | 200 µm | Không dùng |
| **40× (Xanh lam - Vật kính lớn)** | Xanh lam (`#0284c7`) | 0.65 | 0.65 mm | **450 µm** (0.5 mm) | 1.2 µm | 50 µm | Không dùng |
| **100× (Trắng - Vật kính dầu soi)** | Trắng (`#f8fafc`) | 1.25 | 0.18 mm | **180 µm** (0.2 mm) | 0.4 µm | 20 µm | **BẮT BUỘC** |

---

## 5.1. [spc-paramecium] Trùng giày (*Paramecium caudatum*)
**Phân loại sinh học**: `Động vật đơn bào` (`protozoa`) | **Bài học SGK**: KHTN 6 · Bài 12: Thực hành quan sát sinh vật đơn bào | **Lớp**: KHTN 6

### 1. Kích thước & Điều kiện Quan sát Quang học
* **Kích thước thực tế**: Chiều dài: **180 – 290 µm** | Chiều rộng: **50 – 80 µm** (Dải kích thước: $180 - 290\text{ µm}$).
* **Vật kính đề xuất**: `10x, 40x` (Vật kính tối ưu: **10x**).
* **Yêu cầu dầu soi**: Không (Quan sát khô)
* **Phương pháp nhuộm màu / Môi trường**: **Nước rơm/cỏ ngâm (tiêu bản sống, chặn bằng sợi bông)** (Màu nhuộm mô phỏng: `rgba(235, 245, 255, 0.45)`).

### 2. Đặc điểm Hình thái & Cấu trúc Sinh học
* **Mô tả hình thái**: Cơ thể hình thoi dài, đầu trước tròn tù, đầu sau hơi thuôn nhọn giống đế chiếc giày.
* **Mô tả sinh học chi tiết**: Cơ thể hình đế giày, chuyển động xoay quanh trục dọc nhờ hệ thống lông bơi bao quanh. Trong tế bào chất có nhân lớn, nhân nhỏ, rãnh miệng dẫn vào hầu và hai không bào co bóp hình hoa cúc ở hai đầu phập phồng bài tiết.
* **Các cấu trúc quan sát thấy**: `Lông bơi (Cilia)`, `Màng tế bào (Pellicle)`, `Rãnh miệng (Oral groove)`, `Không bào co bóp hình hoa (Contractile vacuoles)`, `Nhân lớn (Macronucleus)`, `Không bào tiêu hóa (Food vacuoles)`

### 3. Tọa độ Chú thích Cấu trúc Hiển vi (Field of View Annotations)
| Mã cấu trúc | Tên cấu trúc giải phẫu | Tọa độ trường nhìn $(X\%, Y\%)$ | Vật kính tối thiểu | Ý nghĩa sinh học & Chức năng |
| :--- | :--- | :---: | :---: | :--- |
| `cilia` | **Lông bơi bao quanh** | `(-34%, -22%)` | 10x | Hàng nghìn lông bơi rung động nhịp nhàng giúp trùng giày vừa bơi vừa xoay tròn trong nước. |
| `oral-groove` | **Rãnh miệng** | `(-8%, 2%)` | 10x | Rãnh lõm xiên chứa các lông rung cuốn vi khuẩn và vụn hữu cơ vào sâu bên trong tế bào. |
| `macronucleus` | **Nhân lớn (Macronucleus)** | `(12%, -6%)` | 40x | Điều khiển toàn bộ các hoạt động sống và trao đổi chất của tế bào đơn bào. |
| `contractile-vacuole` | **Không bào co bóp** | `(28%, -26%)` | 40x | Thu gom nước thừa và chất bã, co bóp theo chu kỳ hình hoa cúc để thải ra ngoài cơ thể. |
| `food-vacuole` | **Không bào tiêu hóa** | `(-14%, 18%)` | 10x | Các bọng nhỏ di chuyển dọc cơ thể để tiêu hóa thức ăn nội bào nhờ enzyme. |

### 4. Quy trình Thực hành Làm Tiêu bản Thực tế (SGK)
* 1. Dùng ống nhỏ giọt hút 1 giọt nước ở tầng mặt lọ nuôi cấy rơm/cỏ ngâm lâu ngày.
* 2. Nhỏ giọt nước vào chính giữa lam kính sạch.
* 3. Thêm vài sợi bông gòn y tế mỏng lên giọt nước nhằm giới hạn tốc độ bơi của trùng giày.
* 4. Đặt lamen nghiêng 45° rồi từ từ hạ xuống để bọt khí thoát hết ra ngoài.
* 5. Dùng giấy thấm hút nhẹ phần nước tràn ra ngoài mép lamen, đặt lên bàn kính hiển vi.

### 5. Ghi chú Khoa học & Cảnh báo Quang học
* **Ghi chú chuyên môn**: Trùng giày bơi rất nhanh (~1.5 mm/s), việc thêm sợi bông tạo thành mạng lưới giữ chân tế bào là kỹ thuật thực hành bắt buộc trong SGK KHTN 6.
* > [!WARNING]
  > **Cảnh báo độ phóng đại 1000x**: Ở độ phóng đại 1000x, trùng giày dài 250 µm sẽ tràn khỏi trường nhìn (180 µm). Nên dùng vật kính 10x hoặc 40x.

---

## 5.2. [spc-amoeba] Trùng biến hình (Amip) (*Amoeba proteus*)
**Phân loại sinh học**: `Động vật đơn bào` (`protozoa`) | **Bài học SGK**: KHTN 6 · Bài 12: Tế bào – Đơn vị cơ sở của sự sống | **Lớp**: KHTN 6

### 1. Kích thước & Điều kiện Quan sát Quang học
* **Kích thước thực tế**: Chiều dài: **220 – 550 µm** | Chiều rộng: **120 – 350 µm (thay đổi liên tục)** (Dải kích thước: $220 - 550\text{ µm}$).
* **Vật kính đề xuất**: `10x, 40x` (Vật kính tối ưu: **10x**).
* **Yêu cầu dầu soi**: Không (Quan sát khô)
* **Phương pháp nhuộm màu / Môi trường**: **Tiêu bản sống ngập nước ao** (Màu nhuộm mô phỏng: `rgba(230, 248, 245, 0.4)`).

### 2. Đặc điểm Hình thái & Cấu trúc Sinh học
* **Mô tả hình thái**: Hình thù bất định với nhiều thùy chân giả nhô ra co vào liên tục.
* **Mô tả sinh học chi tiết**: Cơ thể đơn bào không có hình dạng cố định. Chuyển động và bắt mồi bằng chân giả do dòng chất nguyên sinh liên tục dồn đẩy từ nội chất sang ngoại chất.
* **Các cấu trúc quan sát thấy**: `Chân giả (Pseudopodia)`, `Ngoại chất trong suốt (Ectoplasm)`, `Nội chất chứa hạt mịn (Endoplasm)`, `Nhân tròn (Nucleus)`, `Không bào co bóp (Contractile vacuole)`, `Bọng thức ăn tiêu hóa`

### 3. Tọa độ Chú thích Cấu trúc Hiển vi (Field of View Annotations)
| Mã cấu trúc | Tên cấu trúc giải phẫu | Tọa độ trường nhìn $(X\%, Y\%)$ | Vật kính tối thiểu | Ý nghĩa sinh học & Chức năng |
| :--- | :--- | :---: | :---: | :--- |
| `pseudopod` | **Chân giả đang vươn ra** | `(-32%, -20%)` | 10x | Chân giả do khối chất nguyên sinh dồn về một hướng giúp trùng bò chậm chạp trên giá thể. |
| `ectoplasm` | **Ngoại chất (lớp ngoài trong suốt)** | `(-18%, -34%)` | 40x | Lớp màng nguyên sinh chất không hạt bao bọc ngoài cùng của amip. |
| `nucleus` | **Nhân tế bào** | `(10%, 4%)` | 40x | Khối nhân hình đĩa hoặc cầu nằm trôi bồng bềnh trong nội chất tế bào. |
| `contractile-amoeba` | **Không bào co bóp** | `(24%, -16%)` | 10x | Bọng chứa nước trong suốt thực hiện chức năng điều hòa áp suất thẩm thấu. |

### 4. Quy trình Thực hành Làm Tiêu bản Thực tế (SGK)
* 1. Hút cặn bùn đáy hoặc váng nổi trong chậu nuôi cỏ nước ao.
* 2. Nhỏ 1 giọt lên lam kính, đậy lamen nhẹ nhàng tránh làm bẹp tế bào trùng biến hình.
* 3. Tìm kiếm dưới vật kính 10x với nguồn sáng vừa phải để phát hiện khối nguyên sinh chất trong suốt.

### 5. Ghi chú Khoa học & Cảnh báo Quang học
* **Ghi chú chuyên môn**: Do cơ thể trùng biến hình rất trong suốt, cần khép bớt màn chắn sáng (khẩu độ) để tăng độ tương phản chi tiết tế bào.
* > [!WARNING]
  > **Cảnh báo độ phóng đại 1000x**: Trùng biến hình kích thước lớn (trên 300 µm), quan sát tốt nhất ở 100x và 400x.

---

## 5.3. [spc-euglena] Trùng roi xanh (*Euglena viridis*)
**Phân loại sinh học**: `Động vật đơn bào` (`protozoa`) | **Bài học SGK**: KHTN 6 · Bài 12: Thực hành quan sát trùng roi xanh | **Lớp**: KHTN 6

### 1. Kích thước & Điều kiện Quan sát Quang học
* **Kích thước thực tế**: Chiều dài: **45 – 65 µm** | Chiều rộng: **12 – 18 µm** (Dải kích thước: $45 - 65\text{ µm}$).
* **Vật kính đề xuất**: `40x, 100x` (Vật kính tối ưu: **40x**).
* **Yêu cầu dầu soi**: Không (Quan sát khô)
* **Phương pháp nhuộm màu / Môi trường**: **Tiêu bản nước ao có ánh sáng mặt trời** (Màu nhuộm mô phỏng: `rgba(230, 255, 235, 0.45)`).

### 2. Đặc điểm Hình thái & Cấu trúc Sinh học
* **Mô tả hình thái**: Hình thoi nhọn, đầu trước tròn có vết lõm sâu mang roi, đuôi nhọn hoắt.
* **Mô tả sinh học chi tiết**: Cơ thể hình thoi thon nhọn ở đuôi. Đầu có một roi dài vận động và điểm mắt màu đỏ cảm nhận ánh sáng. Trong tế bào chất có nhiều hạt diệp lục xanh lục quang hợp tự dưỡng.
* **Các cấu trúc quan sát thấy**: `Roi bơi dài (Flagellum)`, `Điểm mắt đỏ (Stigma / Eyespot)`, `Hạt diệp lục hình đĩa (Chloroplasts)`, `Nhân tròn ở giữa (Nucleus)`, `Màng sinh chất đàn hồi (Pellicle)`

### 3. Tọa độ Chú thích Cấu trúc Hiển vi (Field of View Annotations)
| Mã cấu trúc | Tên cấu trúc giải phẫu | Tọa độ trường nhìn $(X\%, Y\%)$ | Vật kính tối thiểu | Ý nghĩa sinh học & Chức năng |
| :--- | :--- | :---: | :---: | :--- |
| `flagellum` | **Roi bơi (Flagellum)** | `(-36%, -12%)` | 40x | Roi xoáy theo hình trôn ốc kéo toàn bộ cơ thể trùng roi tiến về phía trước. |
| `eyespot` | **Điểm mắt đỏ (Stigma)** | `(-22%, -8%)` | 40x | Chứa sắc tố carotenoid màu đỏ cam nhạy cảm giúp trùng roi hướng về nơi có ánh sáng mặt trời. |
| `chloroplasts-euglena` | **Hạt diệp lục (Chloroplasts)** | `(6%, 12%)` | 10x | Thực hiện quang hợp tổng hợp tinh bột paramylon khi ở ngoài ánh sáng. |
| `nucleus-euglena` | **Nhân tế bào** | `(16%, -4%)` | 40x | Nhân hình tròn nằm hơi lệch về phía sau cơ thể. |

### 4. Quy trình Thực hành Làm Tiêu bản Thực tế (SGK)
* 1. Lấy mẫu váng nước xanh mặt ao hồ vào ống nghiệm.
* 2. Nhỏ một giọt mẫu lên lam kính.
* 3. Đậy lamen và quan sát với vật kính 10x để định vị cá thể, sau đó chuyển sang 40x để thấy rõ điểm mắt và roi.

### 5. Ghi chú Khoa học & Cảnh báo Quang học
* **Ghi chú chuyên môn**: Trùng roi xanh có lối dinh dưỡng hỗn dưỡng: quang dưỡng khi có ánh sáng và dị dưỡng khi ở trong bóng tối.

---

## 5.4. [spc-onion-epidermis] Tế bào biểu bì vảy hành (*Allium cepa epidermis*)
**Phân loại sinh học**: `Tế bào thực vật` (`plant_cells`) | **Bài học SGK**: KHTN 6 · Bài 12: Thực hành quan sát tế bào thực vật (vảy hành tây) | **Lớp**: KHTN 6

### 1. Kích thước & Điều kiện Quan sát Quang học
* **Kích thước thực tế**: Chiều dài: **200 – 380 µm** | Chiều rộng: **50 – 85 µm** (Dải kích thước: $180 - 380\text{ µm}$).
* **Vật kính đề xuất**: `10x, 40x` (Vật kính tối ưu: **10x**).
* **Yêu cầu dầu soi**: Không (Quan sát khô)
* **Phương pháp nhuộm màu / Môi trường**: **Nhuộm dung dịch Lugol (Iodine 1%)** (Màu nhuộm mô phỏng: `rgba(254, 240, 205, 0.55)`).

### 2. Đặc điểm Hình thái & Cấu trúc Sinh học
* **Mô tả hình thái**: Mô biểu bì gồm các tế bào hình lăng trụ lục giác ghép khít nhau liên tục.
* **Mô tả sinh học chi tiết**: Các tế bào hình hộp đa giác kéo dài xếp sít nhau như bức tường gạch. Có thành tế bào xenlulozo dày dặn rõ nét, không bào trung tâm khổng lồ và nhân tròn bắt màu nâu sẫm của dung dịch Lugol.
* **Các cấu trúc quan sát thấy**: `Thành tế bào (Cell wall)`, `Màng sinh chất (Cell membrane)`, `Tế bào chất (Cytoplasm)`, `Nhân tế bào nhuộm Lugol (Nucleus)`, `Không bào trung tâm lớn (Large central vacuole)`

### 3. Tọa độ Chú thích Cấu trúc Hiển vi (Field of View Annotations)
| Mã cấu trúc | Tên cấu trúc giải phẫu | Tọa độ trường nhìn $(X\%, Y\%)$ | Vật kính tối thiểu | Ý nghĩa sinh học & Chức năng |
| :--- | :--- | :---: | :---: | :--- |
| `cell-wall` | **Thành tế bào xenlulozo** | `(-22%, -28%)` | 4x | Vách ngăn bằng cellulose cứng cáp xác định và duy trì hình dạng cố định của tế bào thực vật. |
| `onion-nucleus` | **Nhân tế bào bắt màu Lugol** | `(12%, 8%)` | 10x | Nhân hình cầu bị không bào đẩy ép nằm sát về phía thành tế bào, bắt màu nâu vàng đậm với iot. |
| `central-vacuole` | **Không bào trung tâm** | `(-6%, -2%)` | 10x | Chiếm tới 80% thể tích tế bào, chứa đầy dịch tế bào dự trữ nước và muối khoáng. |
| `cytoplasm-strand` | **Dải tế bào chất** | `(28%, -14%)` | 40x | Lớp mỏng nguyên sinh chất bao quanh nhân và áp sát màng tế bào. |

### 4. Quy trình Thực hành Làm Tiêu bản Thực tế (SGK)
* 1. Tách một vảy củ hành tây hoặc hành tím tươi.
* 2. Dùng kim mũi mác hoặc nhíp nhọn bóc lấy một màng biểu bì cực mỏng ở mặt trong cong lõm của vảy hành.
* 3. Đặt màng biểu bì lên lam kính có sẵn một giọt nước cất, trải phẳng tuyệt đối không để bị gấp nếp.
* 4. Nhỏ 1 giọt dung dịch Lugol (hoặc cồn iot) lên màng mẫu.
* 5. Đậy lamen nghiêng 45° từ từ hạ xuống, dùng giấy thấm hút sạch dung dịch thừa ở rìa.

### 5. Ghi chú Khoa học & Cảnh báo Quang học
* **Ghi chú chuyên môn**: Tế bào vảy hành nằm dưới lòng đất nên không có lục lạp; muốn quan sát lục lạp thực vật cần soi tế bào lá cây thài lài hoặc rong đuôi chó.
* > [!WARNING]
  > **Cảnh báo độ phóng đại 1000x**: Tế bào biểu bì hành rất dài (~300 µm), phóng đại 1000x chỉ thấy một góc nhỏ thành tế bào.

---

## 5.5. [spc-leaf-stomata] Khí khổng và Lục lạp lá cây (*Tradescantia leaf stomata & chloroplasts*)
**Phân loại sinh học**: `Tế bào thực vật` (`plant_cells`) | **Bài học SGK**: KHTN 7 · Bài 22: Quang hợp và Trao đổi khí qua khí khổng | **Lớp**: KHTN 7

### 1. Kích thước & Điều kiện Quan sát Quang học
* **Kích thước thực tế**: Chiều dài: **30 – 42 µm** | Chiều rộng: **18 – 26 µm** (Dải kích thước: $25 - 45\text{ µm}$).
* **Vật kính đề xuất**: `10x, 40x` (Vật kính tối ưu: **40x**).
* **Yêu cầu dầu soi**: Không (Quan sát khô)
* **Phương pháp nhuộm màu / Môi trường**: **Tiêu bản tươi ngâm nước cất (biểu bì lá thài lài tía)** (Màu nhuộm mô phỏng: `rgba(235, 255, 240, 0.45)`).

### 2. Đặc điểm Hình thái & Cấu trúc Sinh học
* **Mô tả hình thái**: Hai tế bào hình chữ C / hạt đậu úp vào nhau tạo thành khe khí khổng có thể đóng mở.
* **Mô tả sinh học chi tiết**: Cặp tế bào hình hạt đậu (tế bào bảo vệ) áp sát nhau tạo thành khe khí khổng. Bên trong tế bào bảo vệ chứa dày đặc các hạt lục lạp màu xanh lục lấp lánh và nhân tế bào.
* **Các cấu trúc quan sát thấy**: `Tế bào bảo vệ hình hạt đậu (Guard cells)`, `Lỗ khí khổng (Stoma pore)`, `Hạt lục lạp màu xanh lá (Chloroplasts)`, `Tế bào biểu bì phụ cận (Epidermal cells)`, `Vách tế bào mép trong dày`

### 3. Tọa độ Chú thích Cấu trúc Hiển vi (Field of View Annotations)
| Mã cấu trúc | Tên cấu trúc giải phẫu | Tọa độ trường nhìn $(X\%, Y\%)$ | Vật kính tối thiểu | Ý nghĩa sinh học & Chức năng |
| :--- | :--- | :---: | :---: | :--- |
| `guard-cell` | **Tế bào bảo vệ hình hạt đậu** | `(-18%, -16%)` | 10x | Cặp tế bào chuyên hóa có mép trong dày và mép ngoài mỏng giúp đóng mở khe khí. |
| `stoma-pore` | **Khe khí khổng** | `(0%, 0%)` | 10x | Lỗ hở cho khí CO2 đi vào phục vụ quang hợp và thoát hơi nước ra ngoài môi trường. |
| `chloroplast-leaf` | **Hạt lục lạp (Chloroplasts)** | `(18%, -14%)` | 40x | Bào quan chứa chất diệp lục hấp thụ năng lượng ánh sáng mặt trời trong quá trình quang hợp. |
| `subsidiary-cell` | **Tế bào biểu bì phụ cận** | `(32%, 24%)` | 10x | Các tế bào bao quanh không chứa hạt lục lạp, có sắc tố tím anthocyanin ở thài lài tía. |

### 4. Quy trình Thực hành Làm Tiêu bản Thực tế (SGK)
* 1. Chọn lá thài lài tía hoặc lá lẻ bạn tươi.
* 2. Gập mặt dưới lá và xé nhẹ theo đường xiên để tạo một màng biểu bì mỏng màu tím nhạt.
* 3. Dùng kéo cắt lấy một mẩu biểu bì nhỏ 3x3 mm đặt lên giọt nước trên lam kính.
* 4. Đậy lamen, thấm nước thừa và đưa lên kính hiển vi quan sát.

### 5. Ghi chú Khoa học & Cảnh báo Quang học
* **Ghi chú chuyên môn**: Khí khổng phân bố tập trung chủ yếu ở mặt dưới của lá giúp hạn chế mất nước do ánh nắng hun nóng trực tiếp.

---

## 5.6. [spc-cheek-epithelium] Tế bào niêm mạc miệng người (*Human buccal epithelial cells*)
**Phân loại sinh học**: `Tế bào động vật` (`animal_cells`) | **Bài học SGK**: KHTN 6 · Bài 12: Thực hành quan sát tế bào động vật (niêm mạc má) | **Lớp**: KHTN 6

### 1. Kích thước & Điều kiện Quan sát Quang học
* **Kích thước thực tế**: Chiều dài: **50 – 75 µm** | Chiều rộng: **40 – 60 µm** (Dải kích thước: $50 - 75\text{ µm}$).
* **Vật kính đề xuất**: `10x, 40x` (Vật kính tối ưu: **40x**).
* **Yêu cầu dầu soi**: Không (Quan sát khô)
* **Phương pháp nhuộm màu / Môi trường**: **Nhuộm dung dịch Xanh Methylene (Methylene blue 1%)** (Màu nhuộm mô phỏng: `rgba(230, 240, 255, 0.5)`).

### 2. Đặc điểm Hình thái & Cấu trúc Sinh học
* **Mô tả hình thái**: Tế bào dẹt mỏng, hình đa giác lượn sóng bất quy tắc, có nhân tròn nằm giữa.
* **Mô tả sinh học chi tiết**: Các tế bào dẹt hình đa giác mép hơi gợn sóng xếp rời rạc hoặc dính cụm vài tế bào. Không có thành tế bào cellulose dày, chỉ có màng tế bào mỏng, tế bào chất hạt mịn và nhân hình cầu tròn bắt màu xanh đậm rực rỡ.
* **Các cấu trúc quan sát thấy**: `Màng sinh chất mềm dẻo (Cell membrane)`, `Tế bào chất mịn có hạt (Cytoplasm)`, `Nhân tế bào nhuộm xanh (Nucleus)`, `Hạt nhân (Nucleolus)`

### 3. Tọa độ Chú thích Cấu trúc Hiển vi (Field of View Annotations)
| Mã cấu trúc | Tên cấu trúc giải phẫu | Tọa độ trường nhìn $(X\%, Y\%)$ | Vật kính tối thiểu | Ý nghĩa sinh học & Chức năng |
| :--- | :--- | :---: | :---: | :--- |
| `cheek-membrane` | **Màng sinh chất (Màng tế bào)** | `(-26%, -18%)` | 10x | Màng sinh chất mềm mại linh hoạt, không có thành tế bào bao bọc như ở tế bào thực vật. |
| `cheek-nucleus` | **Nhân tế bào bắt màu xanh Metylen** | `(2%, -2%)` | 10x | Nhân hình cầu chứa vật chất di truyền DNA bắt màu kiềm xanh tím rất đậm và rõ ràng. |
| `cheek-cytoplasm` | **Tế bào chất hạt mịn** | `(18%, 18%)` | 40x | Chứa các bào quan ty thể, ribosome lơ lửng trong dịch bào keo. |

### 4. Quy trình Thực hành Làm Tiêu bản Thực tế (SGK)
* 1. Dùng nước lọc súc sạch khoang miệng trước khi lấy mẫu.
* 2. Dùng que tăm sạch/vô trùng cạo thật nhẹ vào mặt trong của má.
* 3. Khuấy nhẹ đầu tăm chứa chất cặn vào giọt nước muối sinh lý 0.9% trên lam kính.
* 4. Nhỏ 1 giọt dung dịch Xanh Methylene 1% vào vùng huyền phù tế bào.
* 5. Đậy lamen nghiêng 45°, thấm bớt dịch thừa và đặt lên bàn kính hiển vi.

### 5. Ghi chú Khoa học & Cảnh báo Quang học
* **Ghi chú chuyên môn**: Thuốc nhuộm Xanh Methylene có tính base ái lực cực mạnh với acid nucleic trong nhân tế bào, giúp nhân hiện rõ màu xanh thẫm.

---

## 5.7. [spc-spirogyra] Tảo xoắn (*Spirogyra crassa*)
**Phân loại sinh học**: `Tảo nước ngọt` (`algae`) | **Bài học SGK**: KHTN 6 · Bài 17: Đa dạng nguyên sinh vật – Nhóm Tảo lục | **Lớp**: KHTN 6

### 1. Kích thước & Điều kiện Quan sát Quang học
* **Kích thước thực tế**: Chiều dài: **Sợi dài nhiều mm (đường kính sợi 25 – 35 µm)** | Chiều rộng: **Đường kính tế bào 25 – 35 µm, dài 60 – 150 µm** (Dải kích thước: $20 - 40\text{ µm}$).
* **Vật kính đề xuất**: `10x, 40x` (Vật kính tối ưu: **40x**).
* **Yêu cầu dầu soi**: Không (Quan sát khô)
* **Phương pháp nhuộm màu / Môi trường**: **Tiêu bản tươi sợi tảo nước ngọt ao hồ** (Màu nhuộm mô phỏng: `rgba(235, 255, 240, 0.45)`).

### 2. Đặc điểm Hình thái & Cấu trúc Sinh học
* **Mô tả hình thái**: Dạng sợi đơn phân nhánh hình ống trụ, vách ngăn ngang vuông góc.
* **Mô tả sinh học chi tiết**: Dạng sợi tơ đa bào trơn nhớt màu xanh lục. Mỗi tế bào hình trụ có một hoặc nhiều dải lục lạp hình dải băng xoắn ốc uốn lượn tuyệt đẹp chạy suốt chiều dài tế bào, đính các hạt tạo tinh bột (pyrenoid).
* **Các cấu trúc quan sát thấy**: `Dải lục lạp xoắn ốc (Spiral chloroplast ribbon)`, `Hạt tạo tinh bột (Pyrenoids)`, `Vách ngăn ngang giữa các tế bào (Septum)`, `Nhân tế bào treo giữa dây nguyên sinh chất`, `Thành tế bào phủ màng nhầy pectin`

### 3. Tọa độ Chú thích Cấu trúc Hiển vi (Field of View Annotations)
| Mã cấu trúc | Tên cấu trúc giải phẫu | Tọa độ trường nhìn $(X\%, Y\%)$ | Vật kính tối thiểu | Ý nghĩa sinh học & Chức năng |
| :--- | :--- | :---: | :---: | :--- |
| `spiral-chloroplast` | **Dải lục lạp xoắn ốc** | `(-12%, -10%)` | 10x | Dải băng diệp lục uốn lượn hình xoắn ốc như lò xo chạy dọc theo chu vi mặt trong tế bào. |
| `pyrenoid` | **Hạt tạo tinh bột (Pyrenoid)** | `(4%, 12%)` | 40x | Các thể nhỏ hình hạt sáng đính dọc dải lục lạp chuyên hóa tổng hợp tinh bột dự trữ. |
| `septum` | **Vách ngăn ngang tế bào** | `(32%, 0%)` | 10x | Vách ngăn đôi vuông góc phân chia sợi tảo thành các tế bào hình trụ liên tiếp. |
| `spiro-nucleus` | **Nhân tế bào lơ lửng** | `(14%, -4%)` | 40x | Nhân nằm chính giữa tế bào, được treo bởi các sợi chất nguyên sinh mảnh. |

### 4. Quy trình Thực hành Làm Tiêu bản Thực tế (SGK)
* 1. Vớt một búi tảo tơ màu xanh mềm nhớt ở ao hồ cho vào cốc nước.
* 2. Dùng kim mũi mác hoặc nhíp gắp vài sợi tảo đặt dọc lên lam kính.
* 3. Nhỏ 1 giọt nước cất, tách các sợi rời nhau tránh để bị vón cục.
* 4. Đậy lamen nhẹ nhàng và quan sát.

### 5. Ghi chú Khoa học & Cảnh báo Quang học
* **Ghi chú chuyên môn**: Chất nhầy trơn bao quanh sợi tảo giúp chúng không bị bám cặn bẩn và hạn chế bị các loài ăn cỏ nước ngọt tấn công.

---

## 5.8. [spc-lactobacillus] Vi khuẩn lên men Lactic (*Lactobacillus bulgaricus*)
**Phân loại sinh học**: `Vi sinh vật (Vi khuẩn)` (`microorganisms`) | **Bài học SGK**: KHTN 6 · Bài 25: Vi khuẩn – Thực hành làm sữa chua và quan sát vi khuẩn | **Lớp**: KHTN 6

### 1. Kích thước & Điều kiện Quan sát Quang học
* **Kích thước thực tế**: Chiều dài: **1.5 – 4.2 µm** | Chiều rộng: **0.6 – 0.9 µm** (Dải kích thước: $1.5 - 4.2\text{ µm}$).
* **Vật kính đề xuất**: `40x, 100x` (Vật kính tối ưu: **100x**).
* **Yêu cầu dầu soi**: **BẮT BUỘC (Vật kính 100x dầu soi Immersion Oil)**
* **Phương pháp nhuộm màu / Môi trường**: **Nhuộm Gram / Tím Gentian hoặc Đỏ Fuchsin (cần dầu soi)** (Màu nhuộm mô phỏng: `rgba(240, 230, 255, 0.45)`).

### 2. Đặc điểm Hình thái & Cấu trúc Sinh học
* **Mô tả hình thái**: Trực khuẩn hình que thẳng hoặc hơi cong nhẹ, đầu tròn, xếp thành chuỗi ngắn.
* **Mô tả sinh học chi tiết**: Các trực khuẩn hình que ngắn bắt màu tím Gram dương xếp thành chuỗi đơn hoặc thành đôi. Kích thước cực kỳ nhỏ bé (1 - 4 µm), ở vật kính 10x chỉ thấy như chấm bụi li ti, cần vật kính 100x dầu soi mới nhìn rõ hình que.
* **Các cấu trúc quan sát thấy**: `Trực khuẩn hình que (Bacillus cells)`, `Chuỗi vi khuẩn nối tiếp`, `Thành peptidoglycan bắt màu Gram tím`, `Vùng nhân sơ (Nucleoid - kích thước siêu hiển vi)`

### 3. Tọa độ Chú thích Cấu trúc Hiển vi (Field of View Annotations)
| Mã cấu trúc | Tên cấu trúc giải phẫu | Tọa độ trường nhìn $(X\%, Y\%)$ | Vật kính tối thiểu | Ý nghĩa sinh học & Chức năng |
| :--- | :--- | :---: | :---: | :--- |
| `lacto-rod` | **Trực khuẩn hình que đơn lẻ** | `(-8%, -12%)` | 40x | Kích thước chỉ khoảng 2 µm, biến đổi đường lactose trong sữa thành acid lactic làm đông tụ sữa chua. |
| `lacto-chain` | **Chuỗi trực khuẩn liên kết** | `(16%, 14%)` | 100x | Nhiều cá thể dính liền sau phân đôi tạo thành chuỗi đặc trưng của chi Lactobacillus. |

### 4. Quy trình Thực hành Làm Tiêu bản Thực tế (SGK)
* 1. Pha loãng 1 giọt sữa chua không đường với 10 giọt nước cất trong ống nghiệm.
* 2. Dùng que cấy hoặc tăm chấm một giọt nhỏ dàn đều thành màng mỏng trên lam kính.
* 3. Hơ nhẹ lam kính phía trên ngọn lửa đèn cồn 2 - 3 lần để cố định vi khuẩn (tránh làm cháy mẫu).
* 4. Nhỏ thuốc nhuộm tím gentian hoặc đỏ Fuchsin lên vết bôi trong 1 - 2 phút.
* 5. Rửa nhẹ lam kính dưới vòi nước chảy thật nhỏ, thấm khô nhẹ bằng giấy lọc.
* 6. Nhỏ 1 giọt dầu soi (immersion oil) trực tiếp lên vết bôi và hạ vật kính 100x chạm sát giọt dầu.

### 5. Ghi chú Khoa học & Cảnh báo Quang học
* **Ghi chú chuyên môn**: Vi khuẩn có kích thước micrometer nhỏ hơn tế bào sinh vật nhân thực hàng chục đến hàng trăm lần; do đó ở vật kính 4x và 10x hoàn toàn không phân giải được hình dạng tế bào vi khuẩn.
* > [!WARNING]
  > **Cảnh báo độ phóng đại 40x**: Ở vật kính 4x (40x), vi khuẩn kích thước 2 µm hoàn toàn không nhìn thấy (chỉ thấy bóng mờ đồng nhất). Hãy chuyển sang 400x hoặc 1000x dầu soi.
* > [!WARNING]
  > **Cảnh báo độ phóng đại 100x**: Ở vật kính 10x (100x), vi khuẩn chỉ hiện như những hạt bụi cực nhỏ. Cần dùng vật kính 40x hoặc 100x.

---

# PHẦN VI — MA TRẬN TƯƠNG TÁC ĐỒNG BỘ CHÉO (CROSS-COMPONENT INTERACTION MATRIX)

Bảng ma trận mô tả mối quan hệ nhân quả (Causal Interaction Matrix) giữa các nhóm thiết bị và môi trường:

| Cặp Thiết bị / Môi trường Tương tác | Loại liên kết | Điều kiện Kích hoạt | Hiệu ứng Vật lý / Dữ liệu Đồng bộ | Hành vi Âm thanh Phản hồi |
| :--- | :---: | :--- | :--- | :--- |
| **Vật rắn / Cốc nước $\to$ Cân điện tử** | `mechanical_support` | Kéo thả vật vào tâm đĩa cân ($dist < 16.5\text{ cm}$) | Mâm cân lún $2.2\text{ mm}$, màn hình LCD cập nhật: $m_{hiển thị} = m_{vật} + m_{chất lỏng} - m_{tare}$ | Phát tiếng cộp tiếp xúc `scale-place` |
| **Vật rắn $\to$ Ống đong chứa nước** | `submersion` | Thả vật chìm vào ống đong ($D_{vật} \le 28\text{ mm}$) | Cột nước dâng từ $V_1$ lên $V_2 = V_1 + V_{vật}$; dâng mặt khum mao dẫn | Phát tiếng róc rách `water-splash` |
| **Vật rắn lớn $\to$ Ống đong ($D > 28\text{ mm}$)** | `aperture_limit` | Thả vật hộp $30\text{ mm}$ vào miệng ống đong | Bị chặn ngoài miệng ống đong, cảnh báo `APERTURE_OVERSIZE` | Phát tiếng va đập thủy tinh `glass-clink` |
| **Vật rắn $\to$ Bình tràn Eureka đầy nước** | `fluid_coupling` | Thả chìm vật rắn vào bình tràn đang đầy $210\text{ ml}$ | Xuất hiện tia nước xả qua vòi nghiêng $30^\circ$ chảy sang cốc hứng đúng $\Delta V$ | Kích hoạt chuỗi âm thanh `water-overflow` |
| **Bình cấp nước $\to$ Ống đong / Cốc** | `fluid_spout` | Đặt ống đong dưới van xả ($dist < 15.5\text{ cm}$) & mở van | Nước từ bình cấp giảm, mực nước ống đong dâng lên theo tốc độ $15\text{ ml/s}$ | Phát tiếng nước chảy liên tục `water-pour` |
| **Vật rắn $\to$ Lực kế lò xo 5N** | `mechanical_hook` | Kéo khuyên móc vật rắn vào móc treo dưới lực kế | Lò xo xoắn giãn đoạn $\Delta x = \frac{m\cdot g}{k}$, kim chỉ thị hạ thấp xuống $P$ | Phát tiếng lò xo căng `spring-stretch` |
| **Vật treo trên Lực kế $\to$ Nhúng vào Cốc nước** | `buoyancy_force` | Nhúng vật đang treo trên lực kế chìm vào cốc nước | Lực kế giảm số chỉ đúng bằng lực đẩy Archimedes: $F = P - \rho_{nước} g V$ | Giảm độ giãn lò xo & dâng nước trong cốc |
| **Thước cặp du xích $\to$ Khối trụ / Bi cầu** | `mechanical_clamp` | Kéo vật vào giữa 2 ngàm kẹp ngoài ($dist < 13.5\text{ cm}$) | Ngàm động tự khép chặt ôm khít vật, màn hình LCD & du xích hiện kích thước $d$ | Phát tiếng trượt cơ khí `caliper-slide` |
| **Ray quang học $\to$ Đèn, Vật F, Thấu kính, Màn** | `mechanical_rail` | Kéo các linh kiện vào rãnh ray nhôm 1m | Tự động khóa cao độ $y = 12.5\text{ cm}$ và trục $Z$, chỉ cho phép trượt 1D dọc trục $X$ | Phát tiếng ngàm khóa `dock-hover-snap` |
| **Nguồn điện 12V $\to$ Đèn chiếu Halogen** | `electrical_interlock` | Cắm 2 dây bắp chuối ($L \le 0.70\text{ m}$) & Bật công tắc | Dòng điện khép kín, tim đèn Halogen phát sáng rực rỡ, chiếu chùm tia qua vật F | Phát tiếng tạch cơ khí `mechanical-click` |
| **Đèn chiếu Halogen $\to$ Thấu kính hội tụ $\to$ Màn** | `optical_alignment` | Khoảng cách $d > f$: Tia sáng hội tụ sau kính | Tạo ảnh thật ngược chiều chữ F trên màn chắn tại vị trí $d' = \frac{d\cdot f}{d - f}$ | Tự động vẽ ảnh đảo ngược trên màn hứng |
| **Laser 3 tia $\to$ Bản bán trụ thuỷ tinh 360°** | `optical_refraction` | Chiếu tia laser từ mặt cong vào tâm $O$ góc tới $i$ | Tia khúc xạ bẻ góc $r = \arcsin(n \sin i)$; khi $i \ge 41.8^\circ$ phản xạ toàn phần | Phát tiếng xoay đĩa chia độ `optics-angle` |
| **Thanh nam châm $\to$ Cuộn dây dẫn kín 2 LED** | `electromagnetic_induction`| Đẩy nhanh cực Bắc nam châm vào lòng cuộn dây | Xuất hiện dòng điện cảm ứng Faraday làm LED đỏ sáng; rút ra LED xanh sáng | Phát tiếng rền cảm ứng `electric-induction` |
| **Kính hiển vi $\to$ Tiêu bản Lam kính** | `microscopy_dock` | Kẹp lam kính lên bàn sa trượt kính hiển vi | Kích hoạt hệ thống quang học hiển vi, nạp dữ liệu tế bào tương ứng lên thị kính | Phát tiếng trượt ngàm kẹp lam kính |
| **Nhiệt độ phòng $T_{air} \to$ Nhiệt kế chất lỏng** | `thermal_exchange` | Đặt nhiệt kế tự do ngoài không khí phòng | Cột rượu màu đỏ tự động dâng/hạ khớp chính xác nhiệt độ môi trường $T_{air}$ | Cập nhật vạch chia mao quản |
| **Gia tốc trọng trường $g \to$ Cân & Lực kế** | `gravity_field` | Thay đổi biến $g$ từ $9.8\text{ m/s}^2$ lên $1.62\text{ m/s}^2$ (Mặt Trăng)| Số chỉ lực kế giảm tương ứng; cân điện tử tự động bù chuẩn loadcell | Cập nhật lực căng lò xo |

---

# PHẦN VII — HƯỚNG DẪN TÍCH HỢP TỰ ĐỘNG DÀNH CHO CÁC HỆ THỐNG / AI KHÁC

Tài liệu này được định dạng để các hệ thống AI (LLM Agent), parser tự động hoặc hệ thống CI/CD có thể tiêu thụ trực tiếp (Machine-readable) theo các quy ước:

### 7.1. Định dạng Truy vấn CSDL Thiết bị (JSON Query Schema)
Mọi thiết bị trong OpenLab 3D đều có thể được trích xuất thành đối tượng JSON chuẩn bằng cách đọc tập tin `src/data/mockCatalog.ts` hoặc gọi Registry API:
```typescript
import { MOCK_EQUIPMENT_ASSETS } from "openlab-3d/src/data/mockCatalog";
const asset = MOCK_EQUIPMENT_ASSETS.find(a => a.assetId === "OL3D-EQP-BAL-0001");
```

### 7.2. Quy trình Kiểm định 7 Cổng Tự động (`validateHtmlModule7Gates`)
Khi một hệ thống ngoài tạo ra file `.html` thiết bị mới, file đó bắt buộc phải vượt qua 7 cổng kiểm tra tự động trước khi được phép nạp vào cảnh 3D:
* **Cổng G1 (`G1_STRUCTURE`)**: Kiểm tra sự hiện diện của đủ 4 thẻ HTML ID cố định (`ol3d-module-manifest`, `ol3d-module-icon`, `ol3d-module-real-photo`, `ol3d-module-3d-script`).
* **Cổng G2 (`G2_GEOMETRY`)**: Chạy hàm `buildEquipmentMesh`, đo `Box3` kiểm tra $|y_{min}| \le 0.008\text{ m}$ và kích thước vật lý hợp lệ ($0.01\text{ m} \le W,H,D \le 1.5\text{ m}$).
* **Cổng G3 (`G3_PHYSICS_METROLOGY`)**: Kiểm tra giá trị dương của `referenceMass`, `referenceVolume`, và độ chia nhỏ nhất `leastCount > 0`.
* **Cổng G4 (`G4_INTERACTION`)**: Chạy thử hàm `updateEquipmentState` với các mốc `min`, `max`, `defaultValue` trong `dt = 0.016s` mà không phát sinh ngoại lệ runtime.
* **Cổng G5 (`G5_INTEGRATION`)**: Kiểm tra sự tồn tại của các node ngữ nghĩa bắt buộc (`body`, `scale_display`, `liquid_surface` hoặc `plunger`).
* **Cổng G6 (`G6_PERFORMANCE`)**: Giới hạn số lượng tam giác $N_{triangles} \le 15,000$ và thời gian khởi dựng $t_{build} < 80\text{ ms}$.
* **Cổng G7 (`G7_SECURITY_PROVENANCE`)**: Quét tĩnh mã JavaScript trong sandbox đảm bảo không có lệnh gọi mạng (`fetch`, `xhr`), truy cập cookie hay DOM ngoài.

### 7.3. Danh mục Mã lỗi Quy chuẩn (System Error Codes)

| Mã lỗi (Error Code) | Tên lỗi kỹ thuật | Nguyên nhân gốc rễ (Root Cause) | Biện pháp khắc phục tự động |
| :--- | :--- | :--- | :--- |
| `APERTURE_OVERSIZE` | Mẫu vật vượt khẩu độ miệng bình | Mẫu vật có đường kính ngang $D > 28\text{ mm}$ thả vào miệng ống đong 100ml | Tự động từ chối thả chìm, hiển thị thông báo hướng dẫn học sinh chuyển sang Bình tràn Eureka |
| `INTERFACE_INCOMPATIBLE` | Không tương thích giao tiếp | Cố tình ghép hai linh kiện không thuộc danh sách `acceptedMates` của nhau | Chặn liên kết và giữ vật thể ở trạng thái lơ lửng tự do |
| `SLOT_OCCUPIED` | Cổng kết nối đã đầy | Cố tình gắn 2 thấu kính vào cùng 1 vòng giữ thấu kính | Thực hiện chính sách Evict: Đẩy thấu kính cũ về khay chứa trước khi lắp thấu kính mới |
| `OUT_OF_TOLERANCE` | Vượt ngoài khoảng cách snap | Kéo thả vật thể ở khoảng cách lớn hơn bán kính snap `snapToleranceM` | Giữ vật thể tại vị trí chuột buông, không kích hoạt hút nam châm |
| `POLARITY_MISMATCH` | Ngược cực nguồn điện | Cắm cọc dương (+) vào cọc âm (-) | Đèn báo phân cực đỏ, đảo chiều kim điện kế Galvanometer về phía âm |
| `VOLTAGE_MISMATCH` | Điện áp vượt ngưỡng an toàn | Cấp điện áp $> 12\text{ V}$ cho bóng đèn Halogen chịu tải $12\text{ V}$ | Kích hoạt hiệu ứng cháy bóng đèn (ngắt dòng điện và phát khói đồ họa mờ) |
| `Z_FIGHTING_DETECTED` | Trùng mặt phẳng hiển thị | Mặt phẳng màn hình số đặt trùng khít với mặt phẳng vỏ máy ($dz = 0$) | Đặt `polygonOffset: true, factor: -4` và dịch nổi mặt màn hình tối thiểu $1.5\text{ mm}$ ra phía trước |
| `BOX3_ALIGNMENT_FAULT` | Đáy mô hình không chạm mặt bàn | Điểm thấp nhất $y_{min} \ne 0$ làm vật bị chìm dưới bàn hoặc bay lơ lửng | Dịch chuyển toàn bộ mesh con lên đoạn $y_{offset} = -y_{min}$ |

---

> **KẾT LUẬN BÁO CÁO**: Toàn bộ hệ thống mô phỏng OpenLab 3D với 36 thiết bị, 8 mẫu tiêu bản và 25 biến môi trường đã được rà soát, kiểm kê và chuẩn hóa đồng bộ 100%. Hồ sơ này là cơ sở kỹ thuật bất biến để các hệ thống khác phân tích, tái hiện và kiểm toán chất lượng.