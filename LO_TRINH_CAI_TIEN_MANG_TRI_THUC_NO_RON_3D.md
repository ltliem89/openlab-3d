# LỘ TRÌNH CHI TIẾT CẢI TIẾN HỆ THỐNG MẠNG LƯỚI TRI THỨC NƠ-RON KẾT HỢP MÔ PHỎNG 3D TRỰC QUAN
## DỰ ÁN: OPENLAB 3D — PHÒNG THÍ NGHIỆM ẢO TƯƠNG TÁC 3D CHUẨN GDPT 2018
**Mục tiêu:** Nâng tầm công trình nghiên cứu Khoa học Kỹ thuật (KHKT) học sinh trung học (ViSEF) đạt giải cao cấp Tỉnh/Thành phố và tiến tới cấp Quốc gia.  
**Thời gian thực hiện dự kiến:** 10 tuần (chia 5 giai đoạn cuốn chiếu).  

---

## I. MỤC TIÊU VÀ BẢN CHẤT CỦA SỰ CẢI TIẾN

### 1.1. Mục đích giáo dục mới lạ & sâu sắc
- **Xóa bỏ hiện tượng "Học vẹt công thức" & "Làm thí nghiệm theo công thức nấu ăn" (Cookbook Lab):** Học sinh không còn thực hành một cách thụ động theo các bước B1 $\to$ B2 $\to$ B3 định sẵn. Thay vào đó, học sinh tự mình kết nối các đại lượng thực nghiệm để **"chứng kiến sự ra đời của một định luật khoa học"**.
- **Hiện thực hóa Thuyết Kiến tạo nhận thức (Constructivism Theory):** Biến tiến trình tư duy trừu tượng trong não bộ học sinh thành một **Mô hình trực quan hữu hình 3D (3D Epistemic Knowledge Model)**. Mỗi thao tác vật lý trên bàn thí nghiệm sẽ kích hoạt tương ứng một liên kết tri thức nơ-ron trong không gian.
- **Hóa giải "Hộp đen nhận thức" (Black Box):** Biến các hiện tượng vĩ mô (nước dâng, đèn sáng, kim quay) thành các dòng chảy nhân quả và logic toán học trong suốt.

---

## II. KIẾN TRÚC MẠNG TRI THỨC NƠ-RON 3 TẦNG (3-TIER EPISTEMIC KNOWLEDGE NETWORK)

```
===================================================================================================
TẦNG 3: NƠ-RON ĐỊNH LUẬT & NGUYÊN LÝ KHOA HỌC (EPISTEMIC LAW LAYER)
        • Nơ-ron Định luật Khối lượng riêng:  ρ = m / V
        • Nơ-ron Định luật Ohm:               I = U / R
        • Nơ-ron Lực đẩy Archimedes:          Fa = d . V = ρ . g . V
        • Nơ-ron Định luật Snell:             n1 . sin(i) = n2 . sin(r)
        (Trạng thái: Ẩn/Mờ ──► Khi đủ điều kiện ──► BÙNG SÁNG "AHA!" & PHÁT XUNG)
===================================================================================================
                                      ▲
                                      │ [Luồng hợp nhất nhân quả / Synaptic Fusion]
                                      │
===================================================================================================
TẦNG 2: NƠ-RON BIẾN SỐ ĐO LƯỜNG THỜI GIAN THỰC (DYNAMIC VARIABLE LAYER)
        • Biến số Khối lượng:       m (g, kg)         ── [Từ Cân điện tử BAL-0001]
        • Biến số Thể tích:         V (ml, cm³)       ── [Từ Ống đong CYL-0001 / Bình tràn]
        • Biến số Hiệu điện thế:    U (V)             ── [Từ Bộ nguồn / Vôn kế DMM]
        • Biến số Dòng điện:        I (A, mA)         ── [Từ Ampe kế]
        • Biến số Lực kéo:          F (N)             ── [Từ Lực kế lò xo DYN-0001]
        (Hiển thị: Thẻ Hologram 3D lơ lửng ngay trên đầu mỗi thiết bị tương ứng)
===================================================================================================
                                      ▲
                                      │ [Cảm biến đo lường & Bộ giải số Solvers Engine]
                                      │
===================================================================================================
TẦNG 1: THIẾT BỊ VẬT LÝ VÀ LIÊN KẾT CƠ HỌC 3D (PHYSICAL EQUIPMENT & ASSEMBLY GRAPH)
        • Bàn thí nghiệm chuẩn SI: y = 0.82 m
        • 36 thiết bị 3D PBR (Cân, Ống đong, Pin, Biến trở, Đèn cồn, Lăng kính...)
        • Khớp nối Dock-point (RWSS v1.1.1), Bắt điểm Snap-to-Grid, Khóa 6 DoF
        • Tia Synapse 3D ánh sáng (Luminescent Beams) nối trực tiếp giữa các thiết bị
===================================================================================================
```

---

## III. LỘ TRÌNH 5 GIAI ĐOẠN TRIỂN KHAI CHI TIẾT (10 TUẦN)

### GIAI ĐOẠN 1: NÂNG CẤP LÕI DỮ LIỆU VÀ TOPO MẠNG TRI THỨC 3 TẦNG
**Thời gian:** Tuần 1 – Tuần 2 (14 ngày)  
**Trọng tâm:** Tái cấu trúc mô hình dữ liệu trong mã nguồn TypeScript để hỗ trợ đầy đủ 3 tầng tri thức.

* **Nhiệm vụ kỹ thuật 1.1: Mở rộng `src/domain/neuralNetworkTopology.ts`**
  - Khai báo thêm các thực thể tri thức:
    + `EpistemicVariableNode`: `{ id, symbol, nameVi, unit, currentVal, sourceDeviceId, uncertainty }`.
    + `EpistemicLawNode`: `{ id, lawNameVi, formulaLatex, requiredVariables: string[], conditionGuard, status: 'dormant' | 'synthesizing' | 'discovered' }`.
  - Định nghĩa liên kết nhân quả đa cấp: `Device -> Variable` (phép đo) và `Variable + Variable -> Law` (tổng hợp định luật).
* **Nhiệm vụ kỹ thuật 1.2: Xây dựng Bộ điều phối Tri thức Nhận thức (`CognitiveNeuralEngine.ts`)**
  - Đóng vai trò cầu nối thời gian thực: lắng nghe sự kiện từ `AssemblySystem` và dữ liệu từ `ScientificSolverRegistry` $\to$ cập nhật giá trị biến số $\to$ kiểm tra điều kiện kích hoạt định luật.
* **Sản phẩm bàn giao Giai đoạn 1:**
  - File `src/domain/cognitiveTopology.ts` và `src/domain/CognitiveNeuralEngine.ts` biên dịch không lỗi TypeScript.
  - Ma trận liên kết tri thức chuẩn hóa cho 15 bài thí nghiệm KHTN THCS.

---

### GIAI ĐOẠN 2: HIỆN THỰC HÓA HIỆU ỨNG TRỰC QUAN 3D TRÊN BÀN THÍ NGHIỆM
**Thời gian:** Tuần 3 – Tuần 4 (14 ngày)  
**Trọng tâm:** Đưa mạng nơ-ron từ cửa sổ 2D vào không gian 3D Three.js của phòng lab.

* **Nhiệm vụ kỹ thuật 2.1: Tia Synapse Ánh sáng 3D Không gian (3D Luminescent Synapse Beams)**
  - Tận dụng đường cong mềm `THREE.CatmullRomCurve3` nối giữa tọa độ trung tâm của hai thiết bị đang tương tác trên bàn.
  - Sử dụng shader đường truyền xung hạt (Flowing Particle Pulse Shader) hoặc ống ánh sáng phát quang neon:
    + *Màu vàng cam (Dormant/Standby):* Thiết bị đang ở gần nhau nhưng chưa hoàn tất kết nối.
    + *Màu xanh ngọc (Active Synapse):* Kết nối hoàn tất, tín hiệu vật lý/năng lượng đang truyền qua lại.
    + *Tia sét đỏ giật rung (Inhibitory Reflex):* Báo động đoản mạch, xung đột cơ học hoặc sai quy tắc an toàn.
* **Nhiệm vụ kỹ thuật 2.2: Thẻ Hologram Biến số Lơ lửng 3D (Floating Variable Billboards)**
  - Tạo các nhãn 3D dạng Billboard (luôn quay mặt về camera học sinh) lơ lửng cách đỉnh thiết bị $0.15\text{ m}$.
  - Nhãn hiển thị ký hiệu đại lượng khoa học sắc nét: $m = 85.0\text{ g}$, $V = 100\text{ mL}$, $U = 6.0\text{ V}$, $I = 0.5\text{ A}$.
  - Số liệu nhảy động thời gian thực khi học sinh vặn núm điều khiển hoặc rót chất lỏng.
* **Sản phẩm bàn giao Giai đoạn 2:**
  - Viewport 3D hiển thị mượt mà các tia sáng synapse và thẻ biến số ở tốc độ ổn định $\ge 60$ FPS.
  - Công tắc bật/tắt trên thanh công cụ: *[Bật/Tắt Lớp Mạng Nơ-ron Tri thức 3D]*.

---

### GIAI ĐOẠN 3: CƠ CHẾ "BỪNG SÁNG ĐỊNH LUẬT" (AHA! MOMENT) VÀ PHẢN XẠ SOCRATES
**Thời gian:** Tuần 5 – Tuần 6 (14 ngày)  
**Trọng tâm:** Xây dựng trải nghiệm sư phạm đột phá khi học sinh phát hiện ra quy luật hoặc mắc sai lầm nhận thức.

* **Nhiệm vụ kỹ thuật 3.1: Cơ chế Hợp nhất Nơ-ron & Thắp sáng Định luật (Concept Genesis)**
  - Xây dựng animation "Khoảnh khắc Eureka": Khi học sinh đã đo đủ các biến số đầu vào (ví dụ đã cân được $m$ và đong được thể tích dâng lên $\Delta V$):
    + Học sinh kéo liên kết từ thẻ $m$ thả vào thẻ $V$.
    + Hai thẻ phóng xung hạt ánh sáng về phía nhau, hợp nhất thành một Nơ-ron Vương miện rực rỡ lơ lửng giữa không trung: **$\rho = \frac{m}{\Delta V} = 2.7\text{ g/cm}^3$ (Khối lượng riêng của Nhôm)**.
    + Một âm thanh thành tựu vang lên nhẹ nhàng qua Web Audio API (`labSoundEngine`), tạo sự hưng phấn kích thích học tập.
* **Nhiệm vụ kỹ thuật 3.2: Phản xạ An toàn & Đối thoại Chẩn đoán Ngộ nhận Socrates**
  - Tích hợp cây đồ thị ngộ nhận (Misconception Graph):
    + Khi học sinh đấu Ampe kế song song: Tia sáng chuyển sang màu đỏ rực rung giật, kích hoạt Trợ lý Socrates bật khung đối thoại gợi mở:
      > *"Em có nhận thấy Ampe kế có điện trở cực kỳ bé không? Nếu mắc song song với đèn, toàn bộ dòng điện sẽ chọn con đường nào? Đèn có còn sáng được không?"*
    + Học sinh chọn câu trả lời phản hồi $\to$ Khắc phục xong mạch $\to$ Nơ-ron an toàn xanh trở lại.
* **Triển khai thử nghiệm trên 3 bài đại diện:**
  1. *Bài 1 (Cơ học/Vật chất):* Đo khối lượng riêng ($m, V \to \rho$).
  2. *Bài 2 (Điện học):* Khảo sát định luật Ohm ($U, I, R \to I = U/R$).
  3. *Bài 3 (Thủy tĩnh học):* Lực đẩy Archimedes ($P_1, P_2, V_{\text{tràn}} \to F_A = \rho g V$).
* **Sản phẩm bàn giao Giai đoạn 3:**
  - 3 bài thí nghiệm hoàn chỉnh với cơ chế thắp sáng định luật và đối thoại Socrates chẩn đoán ngộ nhận.

---

### GIAI ĐOẠN 4: BẢN ĐỒ NÃO BỘ TRI THỨC VÀ ĐO LƯỜNG SƯ PHẠM VÒNG 2
**Thời gian:** Tuần 7 – Tuần 8 (14 ngày)  
**Trọng tâm:** Thu thập minh chứng định lượng thực nghiệm để chứng minh giá trị giáo dục trước Ban Giám khảo.

* **Nhiệm vụ kỹ thuật 4.1: Bảng điều khiển "Tiến hóa Não bộ Tri thức" (Student's Mind Map Dashboard)**
  - Cung cấp một bảng tổng kết cuối buổi:
    + Thống kê số lượng nơ-ron định luật học sinh đã tự tay "thắp sáng".
    + Bản đồ nhiệt các ngộ nhận đã được nhận diện và tự sửa chữa.
    + Xuất tệp "Chứng chỉ Khám phá Tri thức Số" dưới dạng file PDF/hình ảnh để học sinh lưu giữ.
* **Nhiệm vụ thực nghiệm sư phạm 4.2: Tổ chức Đo kiểm Đối chứng Vòng 2**
  - Tổ chức cho 2 nhóm học sinh thực hiện:
    + *Nhóm A (Thực nghiệm mới):* Học KHTN với OpenLab 3D có Mạng tri thức nơ-ron 3D & Socrates.
    + *Nhóm B (Thực nghiệm cũ):* Học với phần mềm mô phỏng thông thường (chỉ làm theo hướng dẫn tĩnh).
  - Sử dụng **Thang đo Năng lực Tư duy Khoa học Rubric 5 mức độ** (Adams & Wieman):
    1. Khả năng dự đoán hiện tượng.
    2. Khả năng giải thích bản chất nhân quả.
    3. Mức độ ghi nhớ bền vững công thức và định luật.
    4. Kỹ năng phát hiện và tự sửa sai lầm.
  - Phân tích thống kê suy luận: Tính giá trị trung bình, độ lệch chuẩn, $t$-test độc lập, mức tăng trưởng Gain và kích thước ảnh hưởng Cohen's $d$.
* **Sản phẩm bàn giao Giai đoạn 4:**
  - Tệp dữ liệu Excel bổ sung minh chứng thực nghiệm đối chứng vòng 2.
  - Báo cáo số liệu kiểm định chứng minh tính vượt trội của phương pháp mạng tri thức.

---

### GIAI ĐOẠN 5: CHUẨN HÓA BÁO CÁO, POSTER VÀ TẬP DƯỢT BẢO VỆ VISEF
**Thời gian:** Tuần 9 – Tuần 10 (14 ngày)  
**Trọng tâm:** Hoàn thiện toàn bộ hồ sơ dự thi và rèn luyện kỹ năng phỏng vấn của học sinh.

* **Nhiệm vụ 5.1: Cập nhật Hồ sơ Báo cáo Khoa học (`PLII.4` & `PLIIIa`)**
  - Bổ sung chương mục: *"Thiết kế Kiến trúc Mạng Nơ-ron Tri thức Nhận thức 3 Tầng kết hợp Mô phỏng Không gian 3D"*.
  - Chèn 3 sơ đồ kỹ thuật mới độ nét cao: Sơ đồ phân tầng tri thức, Sơ đồ luồng hợp nhất nơ-ron (Synaptic Fusion), và Biểu đồ so sánh năng lực tư duy khoa học.
  - Đảm bảo 100% công thức định dạng MathType LaTeX (`Alt + \`), không lỗi dãn dòng.
* **Nhiệm vụ 5.2: Thiết kế lại Poster Trưng bày (`PLVII_POSTER_THUYET_MINH_4_TRANG.pptx`)**
  - Dành trọn vẹn 1 trang poster làm nổi bật: **"Đột phá: Mạng Nơ-ron Tri thức 3D & Trợ lý Chẩn đoán Ngộ nhận Socrates"** với hình ảnh minh họa hiệu ứng bừng sáng trực quan lôi cuốn ánh nhìn của Giám khảo ngay từ xa.
* **Nhiệm vụ 5.3: Tập dượt Phỏng vấn Thực chiến (Mock Interview)**
  - Luyện tập cho 2 bạn học sinh (Tường Vy & Giang Ngân) làm chủ kịch bản demo:
    + Thao tác trực tiếp trên máy tính: Đặt thiết bị $\to$ Tia sáng nơ-ron phóng ra $\to$ Tạo biến số $\to$ Hợp nhất thành định luật.
    + Trả lời dõng dạc câu hỏi về liêm chính học thuật, bản chất nơ-ron tri thức và phương pháp nghiên cứu sư phạm.
* **Sản phẩm bàn giao Giai đoạn 5:**
  - Bộ hồ sơ dự thi in ấn hoàn chỉnh (Báo cáo, Tóm tắt, Nhật ký, Minh chứng, Bản kê khai AI, Poster).
  - Nhóm học sinh tự tin 100% trước mọi câu hỏi phản biện của Ban Giám khảo.

---

## IV. PHÂN CÔNG TRÁCH NHIỆM & BẢO ĐẢM LIÊM CHÍNH KHOA HỌC

Để đảm bảo tuân thủ nghiêm ngặt quy định của Cuộc thi KHKT Bộ GD&ĐT (Thông tư 84/2026/TT-BGDĐT) và tránh tuyệt đối việc bị nghi ngờ "giáo viên làm thay", trách nhiệm được phân định minh bạch như sau:

| Thành viên | Trách nhiệm cụ thể | Dấu ấn đóng góp khoa học |
| :--- | :--- | :--- |
| **Trịnh Nguyễn Tường Vy (Trưởng nhóm - Lớp 9A13)** | • Trực tiếp thiết kế sơ đồ liên kết giữa các khái niệm trong SGK KHTN.<br>• Viết kịch bản đối thoại Socrates cho các tình huống học sinh làm sai.<br>• Thử nghiệm, ghi nhật ký lỗi (Bug Log) và kiểm thử giao diện 3D. | Tác giả của Bộ kịch bản Socratic Inquiry & Cây đồ thị ngộ nhận nhận thức. |
| **Phan Bùi Giang Ngân (Thành viên - Lớp 9A3)** | • Thu thập số liệu, khảo sát các bạn học sinh trong trường.<br>• Hỗ trợ nhập liệu bảng thông số thiết bị và chuẩn bị bộ câu hỏi đánh giá.<br>• Phân tích số liệu thực nghiệm Pre/Post-test trên Excel. | Tác giả của Hồ sơ Thực nghiệm Sư phạm và Bảng đối chứng năng lực người học. |
| **Thầy Lê Thanh Liêm (Giáo viên hướng dẫn)** | • Định hướng phương pháp luận nghiên cứu và kiến trúc phần mềm.<br>• Giám sát tính an toàn, bảo mật và liêm chính học thuật.<br>• Hướng dẫn học sinh sử dụng công cụ AI minh bạch (kê khai Phụ lục VI). | Người bảo trợ khoa học, cố vấn phương pháp và kiểm soát chất lượng hồ sơ. |

---

## V. MA TRẬN QUẢN TRỊ RỦI RO (RISK MANAGEMENT)

| Rủi ro tiềm ẩn | Mức độ | Biện pháp phòng ngừa & Xử lý |
| :--- | :---: | :--- |
| **1. Đồ họa 3D bị giật lag trên máy tính cấu hình yếu của trường học** | Trung bình | Tối ưu hóa Three.js: Dùng `InstancedMesh` cho hạt ánh sáng, kẹp bước thời gian $dt \le 0.05\text{s}$, cung cấp tùy chọn giảm nhẹ hiệu ứng đồ họa nếu máy yếu. |
| **2. Giám khảo cho rằng dùng từ "Nơ-ron" là lạm dụng từ ngữ AI** | Cao | Học sinh chuẩn bị sẵn câu trả lời khoa học: Định nghĩa rõ đây là **"Mạng nơ-ron tri thức nhận thức (Cognitive Knowledge Graph)"** mô phỏng quá trình tạo liên kết thần kinh sinh học trong não bộ khi học tập kiến tạo, không phải mạng nơ-ron nhân tạo đen (Black-box ANN). |
| **3. Học sinh lúng túng khi thao tác demo trực tiếp trước Giám khảo** | Trung bình | Thiết kế chế độ "Demo Kịch bản Vàng (Golden Run)" 1-Click: một phím tắt giúp tự động bố trí các thiết bị chuẩn để học sinh chỉ tập trung vào việc kéo thả tạo nơ-ron và thuyết trình logic khoa học. |

---

*Lộ trình này đảm bảo dự án phát triển đúng trọng tâm, kế thừa 100% nền tảng công phu đã có trong `openlab-3d` và `12.KHKT`, đồng thời tạo ra một điểm tựa học thuật vững chắc để tự tin chinh phục các giải thưởng cao nhất tại Cuộc thi KHKT.*
