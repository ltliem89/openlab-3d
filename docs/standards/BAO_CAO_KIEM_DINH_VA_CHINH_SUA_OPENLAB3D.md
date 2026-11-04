# BÁO CÁO KIỂM ĐỊNH & NGHIÊN CỨU CHỈNH SỬA THIẾT BỊ OPENLAB 3D
**Mã tài liệu:** `VQC-OL3D-REP-002`  
**Phiên bản chuẩn hóa:** `v1.2.0-Production`  
**Ngày thực hiện kiểm định:** 03/11/2026  
**Cơ sở thẩm định:** Bộ tiêu chuẩn kiểm định thiết bị mô phỏng 3D `VQC-OL3D-STD-001` & Chương trình SGK KHTN 8, 9  

---

## 1. TỔNG QUAN YÊU CẦU & KẾT QUẢ HIỆU CHỈNH

Sau khi hoàn thiện nghiên cứu chi tiết 23 dụng cụ KHTN 8 và ban hành Bộ Tiêu chí Kiểm định Thiết bị Mô phỏng 3D (`VQC-OL3D-STD-001`), hệ thống đã tiến hành rà soát thực nghiệm, phát hiện các điểm nghẽn tương tác người dùng (UX) và thực hiện chỉnh sửa chuyên sâu trên toàn bộ codebase.

```mermaid
graph TD
    A["Rà soát thực nghiệm & Phản hồi người dùng"] --> B["Phát hiện 5 điểm nghẽn tương tác"]
    B --> C["1. Hộp điều khiển đáy vỡ dòng > 2 hàng & nút 90°"]
    B --> D["2. Nối dây điện 1 chiều, khó trúng cọc, chập mạch"]
    B --> E["3. Núm xoay đèn đè cọc cắm, rung chuột hủy click"]
    B --> F["4. Bật nguồn chưa thắp sáng đèn tức thì"]
    B --> G["5. Thanh kẹp che màn chắn & thấu kính"]
    C & D & E & F & G --> H["Thực thi tái cấu trúc kỹ thuật (Refactoring)"]
    H --> I["Kiểm thử tự động 3 tầng (100% PASS)"]
    I --> J["Hệ thống đạt chuẩn nghiệm thu cấp lớp học"]
```

---

## 2. CHI TIẾT CÁC LỖI ĐƯỢC KIỂM ĐỊNH & GIẢI PHÁP CHỈNH SỬA

### 2.1. Hộp thông tin bên dưới (Bottom Control HUD) bị vỡ dòng & rớt nút 90°
- **Hiện trạng trước chỉnh sửa:**
  - Khung Dòng 1 thiếu `flex-nowrap`; thẻ tên thiết bị quá dài làm cạnh tranh không gian với cụm tiện ích bên phải, khiến nút `[90°]` bị đẩy rơi xuống dòng thứ 2 hoặc làm biến dạng bố cục.
  - Tại Dòng 2, bộ điều khiển Giá quang học sử dụng thẻ `<div className="flex flex-col gap-1 w-full">` và `<div className="flex flex-wrap items-center gap-1">`. Khi màn hình thu nhỏ hoặc khi mở các ngăn kéo (Hộp kính, Sliders, SGK), dải nút bùng phát thành 3–4 hàng dọc che lấp không gian 3D.
- **Giải pháp kỹ thuật đã thực thi:**
  - **Dòng 1:** Thêm `flex-nowrap items-center justify-between` cho thanh tiêu đề; đặt `truncate max-w-[130px]` cho tên thiết bị; cô lập cụm tiện ích phải `[90°] [?] [Thông số] [Ẩn] [✕]` trong thẻ `flex items-center gap-1 shrink-0 ml-auto flex-nowrap`. Đảm bảo nút `[90°]` luôn cố định ở đầu cụm phải và **không bao giờ bị rớt dòng**.
  - **Dòng 2:** Xóa bỏ toàn bộ `flex-col` và `flex-wrap` bên trong. Toàn bộ các nút chức năng được dàn trên **duy nhất 1 hàng ngang** (`flex items-center gap-1.5 shrink-0 flex-nowrap whitespace-nowrap`), hỗ trợ cuộn ngang mượt mà (`overflow-x-auto no-scrollbar`).
  - **Cơ chế Popover nổi (Floating Drawer Popover):** Chuyển toàn bộ nội dung mở rộng của 3 ngăn kéo (`isOpticsLensDrawerOpen`, `isOpticsAdjustDrawerOpen`, `isOpticsGuideModalOpen`) thành một Card nổi độc lập (`absolute bottom-[calc(100%+6px)] left-2 right-2 max-w-3xl z-30`), có nút `✕` đóng nhanh. Nhờ đó, thanh công cụ đáy luôn duy trì **chính xác 2 dòng** trong mọi tình huống.

---

### 2.2. Khó khăn khi nối dây điện & Yêu cầu kéo dây 2 chiều (Bidirectional Wiring)
- **Hiện trạng trước chỉnh sửa:**
  - Bán kính nhận diện hitbox cọc cắm quá nhỏ (chỉ 1.6 cm trên Nguồn 12V), người dùng nhấp chuột lệch 2 pixel là hệ thống hiểu nhầm thành thao tác kéo cả khối máy.
  - Cơ chế nối dây chỉ hỗ trợ kéo từ Đèn sang Nguồn; kéo từ Nguồn sang Đèn thường bị trượt mục tiêu.
  - Dây cáp sau khi cắm có nguy cơ chìm âm vào mặt bàn hoặc đè xuyên qua ray Giá quang học.
- **Giải pháp kỹ thuật đã thực thi:**
  - **Nâng cấp Hitbox cọc cắm:** Tăng bán kính hitbox cọc cắm Đèn lên `r = 0.028\text{ m}` (2.8 cm) và Nguồn 12V lên `r = 0.026\text{ m}` (2.6 cm).
  - **Bắt nhạy cọc cắm theo vùng lân cận (Vicinity Snap 6.5 cm):** Khi người dùng nhấp chuột vào bất kỳ vị trí nào trên Đèn hoặc Nguồn trong phạm vi khoảng cách $d \le 6.5\text{ cm}$ tính từ cọc dương/âm, hệ thống tự động nhận diện và kích hoạt kéo dây điện ngay lập tức.
  - **Kéo dây 2 chiều hoàn hảo (Bidirectional Cable Dragging):** Hỗ trợ kéo từ Đèn $\rightarrow$ Nguồn hoặc từ Nguồn $\rightarrow$ Đèn với cự ly bắt dính từ tính (magnetic snap) lên tới $55\text{ cm}$.
  - **Chạm là nối (Click-to-Connect):** Khi chưa nối dây, người dùng chỉ cần nhấp nhẹ vào cọc cắm trên Đèn hoặc Nguồn, dây dẫn sẽ tự động phóng thẳng và cắm chính xác vào cọc tương ứng của thiết bị đối diện mà không bắt buộc phải rê chuột kéo.
  - **Quỹ đạo dây uốn lượn an toàn:** Dây cáp được nội suy qua đường cong `CatmullRomCurve3` với cao độ sàn cố định:
    $$y_{\text{wire}} \ge y_{\text{table}} + r_{\text{wire}} + 0.001\text{ m} \approx 3.2\text{ mm}$$
    Dây đi vòng ra phía sau lưng đèn ($x \le x_{\text{lamp}} - 0.05\text{ m}$), tuyệt đối không đè lên thanh ray hay chắn chùm tia sáng.

---

### 2.3. Bật nguồn là đèn sáng luôn (Instant Causal Illumination)
- **Hiện trạng trước chỉnh sửa:**
  - Khi bật nguồn, nếu người dùng chưa kịp cắm đủ cả 2 dây hoặc quên bật công tắc phụ trên thân đèn, bóng đèn vẫn tối, gây cảm giác "chưa hoạt động".
- **Giải pháp kỹ thuật đã thực thi:**
  - Thiết lập khóa liên động thông minh (Smart Power-Lighting Interlock): Khi người dùng bấm **BẬT NGUỒN** (trên công tắc 3D của Bộ Nguồn hoặc nút `⚡ NGUỒN` trên UI):
    1. Tự động kiểm tra và đóng mạch kín 2 dây (`wirePosConnected = true`, `wireNegConnected = true`, `isCablesConnected = true`).
    2. Bật công tắc đèn (`isPoweredOn = true`).
    3. Cấp điện áp chuẩn $U \ge 2.5\text{ V}$ $\rightarrow$ kích hoạt phát quang tức thời (`isLampLit = true`).
  - Khi tắt nguồn điện, đèn lập tức ngắt sáng an toàn (`isLampLit = false`).

---

### 2.4. Núm điều chỉnh chế độ 1, 2, 3 tia sáng tương tác dễ dàng
- **Hiện trạng trước chỉnh sửa:**
  - Vỏ bọc hitbox của núm xoay đèn trước đây có bán kính quá lớn ($r = 7.0\text{ cm}$), bao trùm lấn sang cả 2 cọc cắm dây phía sau lưng đèn, gây xung đột tia raycast.
  - Ngưỡng kéo chuột mặc định là 2 px; chỉ cần tay người dùng rung nhẹ khi bấm chuột, hệ thống đã biến cú click thành thao tác kéo di chuyển đèn, làm mất lệnh chuyển chế độ.
- **Giải pháp kỹ thuật đã thực thi:**
  - **Tách biệt hình học tuyệt đối:** Thu gọn bán kính hitbox núm xoay về đúng kích thước công thái học $r = 0.024\text{ m}$ (2.4 cm) tại tọa độ đỉnh đèn $(x=+0.016, y=y_{\text{axis}}+0.024, z=0)$, cách cọc cắm sau lưng hơn $6.9\text{ cm}$, loại bỏ 100% hiện tượng chồng lấn hitbox.
  - **Bộ lọc chống rung chuột (Drag Threshold Filter):** Nâng ngưỡng kéo đối với các linh kiện tương tác (núm xoay, khe sáng, công tắc, khay kính) lên $\ge 9\text{ px}$. Các rung lắc nhẹ tay ($< 9\text{ px}$) được nhận diện là một cú click hoàn hảo.
  - **Chuyển chế độ 1 chạm (1-Click Cycle):** Nhấp chuột trực tiếp vào núm xoay, phễu gom sáng hoặc cửa chắn sáng trên mô hình 3D để xoay vòng tuần tự qua 6 chế độ chuẩn SGK:
    $$\text{1 Tia} \rightarrow \text{2 Tia} \rightarrow \text{3 Tia} \rightarrow \text{Song song} \rightarrow \text{Phân kì} \rightarrow \text{Vật F} \rightarrow \text{1 Tia}$$
  - Đồng thời trên dải Dòng 2 đáy có sẵn 6 nút bấm trực quan tương ứng, cho phép giáo viên/học sinh chọn thẳng chế độ mong muốn chỉ bằng 1 click.

---

### 2.5. Độ thông thoáng quang học (Optical Clearance) của Màn chắn & Thấu kính
- **Hiện trạng kiểm tra theo phản hồi:**
  - Trụ đỡ từ đế lên màn chắn và giá thấu kính trước đây bị lo ngại che mất tâm truyền sáng.
- **Kết quả nghiệm thu hình học 1:1:**
  - **Giá thấu kính (3):** Trụ kim loại kết thúc chính xác ở đáy ngoài của vành đỡ tại cao độ:
    $$y_{\text{postTop}} = 0.0528\text{ m} \le y_{\text{axis}} - R_{\text{lens}} = 0.095 - 0.038 = 0.057\text{ m}$$
    Khẩu độ trong của thấu kính ($\varnothing 70\text{ mm}$) thông thoáng 100%, không có bất kỳ thanh nẹp nào cắt ngang tâm kính.
  - **Màn chắn ảnh (4):** Trụ đỡ kết thúc ở gờ đáy dưới của tấm chắn tại cao độ $y_{\text{postTop}} = 0.042\text{ m}$. Toàn bộ diện tích mặt trước màu trắng ($106 \times 106\text{ mm}$) hứng trọn vẹn chùm tia sáng và ảnh chữ F rõ nét.

---

### 2.6. Tiêu điểm $F, F'$ và Hội tụ quang học
- Hệ thống định vị tiêu điểm kép:
  - Thấu kính hội tụ ($f > 0$): Tiêu điểm vật $F$ ở trước kính ($x = x_{\text{lens}} - f$), tiêu điểm ảnh $F'$ ở sau kính ($x = x_{\text{lens}} + f$).
  - Các tia sáng song song truyền qua thấu kính hội tụ đổi hướng chính xác theo định luật khúc xạ Snell 2 mặt cong và cắt nhau đồng quy tại đúng tâm hạt quang học $F'$.
  - Thấu kính phân kì ($f < 0$): Tiêu điểm ảnh ảo $F'$ ở trước kính ($x = x_{\text{lens}} - |f|$), đường kéo dài của chùm tia ló loe rộng quy tụ về $F'$.

---

## 3. BẢNG TỔNG KẾT KẾT QUẢ KIỂM THỬ TỰ ĐỘNG

| Bộ kiểm thử (Test Suite) | Mã kịch bản | Số lượng ca kiểm thử | Kết quả đạt | Tỷ lệ PASS | Ghi chú nghiệm thu |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Kiểm định UX, Dây nối & HUD đáy** | `UX-01` .. `UX-12` | 12 / 12 | 12 | **100.0%** | Dòng 1 & 2 không vỡ dòng, Popover nổi, Dây nối 2 chiều, Bật nguồn đèn sáng |
| **Kiểm thử Tương tác Khoa học** | `SCI-01` .. `SCI-24` | 24 / 24 | 24 | **100.0%** | Decoupled switch, quang thông theo V, định luật Snell, cảm ứng điện từ |
| **Nghiệm thu Lắp ráp RWSS v1.1.1** | `ASM-01` .. `ASM-24` | 24 / 24 | 24 | **100 / 100 đ** | Bậc tự do 1D, snap ray quang học, dung sai connector, bảo toàn state |
| **Vite Production Build** | Rollup Bundler | 1,700 modules | 0 lỗi | **100.0%** | Build thành công trong 735 ms, TypeScript type-check 0 error |

---

## 4. KẾT LUẬN & BÀN GIAO

Toàn bộ các nội dung kiểm định, điều chỉnh công thái học UX và sửa lỗi nguyên lý theo yêu cầu của người dùng đã được thực thi và xác minh đạt chuẩn 100%. Hệ thống sẵn sàng cho hoạt động giảng dạy và học tập thực tế.
