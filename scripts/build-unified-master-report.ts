import fs from 'fs';
import path from 'path';

console.log('Starting Unified Master Report Builder...');

// Load simulation report lines
const simReportPath = path.resolve(process.cwd(), 'BAO_CAO_RA_SOAT_TOAN_DIEN_THANH_PHAN_MO_PHONG_THIET_BI_VA_MOI_TRUONG.md');
if (!fs.existsSync(simReportPath)) {
  console.error('Simulation report not found at', simReportPath);
  process.exit(1);
}
const simReportRaw = fs.readFileSync(simReportPath, 'utf8');
const simReportLines = simReportRaw.split('\n');
console.log(`simReportLines length: ${simReportLines.length}`);

// Function to safely read text files
function readFileIfExists(relPath: string): string {
  const p = path.resolve(process.cwd(), relPath);
  if (fs.existsSync(p)) {
    return fs.readFileSync(p, 'utf8');
  }
  console.warn(`File not found: ${relPath}`);
  return '';
}

// Find section line indices in simulation report
const idxP1 = simReportLines.findIndex(l => l.startsWith('# PHẦN I'));
const idxP2 = simReportLines.findIndex(l => l.startsWith('# PHẦN II'));
const idxP3 = simReportLines.findIndex(l => l.startsWith('# PHẦN III'));
const idxP4 = simReportLines.findIndex(l => l.startsWith('# PHẦN IV'));
const idxP5 = simReportLines.findIndex(l => l.startsWith('# PHẦN V'));
const idxP6 = simReportLines.findIndex(l => l.startsWith('# PHẦN VI'));
const idxP7 = simReportLines.findIndex(l => l.startsWith('# PHẦN VII'));

console.log('Section indices in simulation report:', { idxP1, idxP2, idxP3, idxP4, idxP5, idxP6, idxP7 });

const envSection = simReportLines.slice(idxP2, idxP3).join('\n');
const assemblyGraphSection = simReportLines.slice(idxP3, idxP4).join('\n');
const equipmentDossiersSection = simReportLines.slice(idxP4, idxP5).join('\n');
const specimensSection = simReportLines.slice(idxP5, idxP6).join('\n');
const crossMatrixSection = simReportLines.slice(idxP6, idxP7).join('\n');
const aiIntegrationSection = simReportLines.slice(idxP7).join('\n');

// Read all other source reports
const overviewRaw = readFileIfExists('OPENLAB_3D_ARCHITECTURE_OVERVIEW.md');
const causalRaw = readFileIfExists('CAUSAL_INTERACTION_ARCHITECTURE.md');
const standardRaw = readFileIfExists('EQUIPMENT_MODULE_STANDARD.md');
const assemblyRaw = readFileIfExists('ASSEMBLY_ACCEPTANCE_REPORT.md');
const microscopeAuditRaw = readFileIfExists('MICROSCOPE_AUDIT_REPORT.md');
const microscopeAcceptanceRaw = readFileIfExists('BAO_CAO_HOAN_THIEN_MO_PHONG_KINH_HIEN_VI_3D_VA_ANH_CHUP.md');
const rootCauseRaw = readFileIfExists('ROOT_CAUSE_ANALYSIS.md');
const refactorPlanRaw = readFileIfExists('DEEP_REFACTOR_PLAN.md');
const scientificTestRaw = readFileIfExists('SCIENTIFIC_INTERACTION_TEST_REPORT.md');
const changelogRaw = readFileIfExists('IMPLEMENTATION_CHANGELOG.md');
const improvementLogRaw = readFileIfExists('OPENLAB3D_IMPROVEMENT_LOG.md');
const physicsGraspRaw = readFileIfExists('docs/NGHIEN_CUU_VAT_LY_CAM_NAM_MO_PHONG_THUC_TE.md');
const opticsResearchRaw = readFileIfExists('docs/NGHIEN_CUU_QUANG_HOC_TUONG_TAC_DOC_LAP.md');

// Clean helper to extract text between sections
function extractSection(content: string, startHeader: string, endHeader?: string): string {
  const startIndex = content.indexOf(startHeader);
  if (startIndex === -1) return '';
  if (!endHeader) {
    return content.substring(startIndex).trim();
  }
  const endIndex = content.indexOf(endHeader, startIndex + startHeader.length);
  if (endIndex === -1) {
    return content.substring(startIndex).trim();
  }
  return content.substring(startIndex, endIndex).trim();
}

console.log('Loaded all source report files successfully.');

// Assemble Master Consolidated Report
const out: string[] = [];

// Header & Title
out.push(`# BÁO CÁO TỔNG THỂ TOÀN DIỆN KIẾN TRÚC, NGUYÊN LÝ HOẠT ĐỘNG VÀ HỒ SƠ THIẾT BỊ OPENLAB 3D
## HỒ SƠ TỔNG HỢP KIẾN TRÚC HỆ THỐNG, TIÊU CHUẨN KỸ THUẬT, BỘ GIẢI VẬT LÝ, RÀ SOÁT 36 THIẾT BỊ & NGHIỆM THU KIỂM THỬ KHOA HỌC

> **MÃ TÀI LIỆU**: \`OPENLAB3D-MASTER-ARCHITECTURE-AND-SYSTEM-REPORT-2026\`  
> **PHIÊN BẢN TỔNG HỢP**: \`v3.0.0\` (Bản Hợp nhất Toàn diện — Authoritative Single Source of Truth)  
> **DỰ ÁN**: OpenLab 3D — Phòng Thí nghiệm Khoa học Tự nhiên 3D chuẩn GDPT 2018 THCS  
> **NGÀY LẬP & HỢP NHẤT**: 04/11/2026  
> **CĂN CỨ TIÊU CHUẨN**:
> - Chương trình Giáo dục Phổ thông 2018 — Môn Khoa học Tự nhiên (Bộ GD&ĐT).
> - Danh mục Thiết bị Dạy học Tối thiểu ban hành theo Thông tư 38/2021/TT-BGDĐT.
> - Tiêu chuẩn Kiến trúc 4 Lớp \`OL3D-MASTER-SPEC v1.0\`.
> - Đặc tả Kiến trúc Tương tác Nhân quả \`CIA v1.0\`.
> - Tiêu chuẩn Nghiệm thu Ghép nối Thiết bị \`RWSS v1.1.1\` (Assembly Acceptance Criteria).
> - Bộ Tiêu chuẩn Kỹ thuật Module Thiết bị \`.HTML\` Độc lập \`OL3D-HTML-MODULE v2.4\`.
> - Quy chuẩn Kỹ thuật Đo lường Việt Nam TCVN, DIN 58145, IEC 61010-1, ISO/IEC 17025.
> - Báo cáo Nghiệm thu Tương tác Khoa học Chuyên sâu (24 Kịch bản SCI-01 $\\dots$ SCI-24).

---

> [!IMPORTANT]
> **THÔNG BÁO QUẢN TRỊ DỰ ÁN & HỢP NHẤT BÁO CÁO:**  
> Tài liệu này là **văn kiện duy nhất có hiệu lực cao nhất** thay thế toàn bộ 14 báo cáo kỹ thuật và kiểm thử phân tán trước đây trong kho mã nguồn. Mọi bộ phận phát triển, kỹ sư phần mềm, AI lập trình và hệ thống phân tích bên ngoài bắt buộc sử dụng tài liệu này làm cơ sở thiết kế, kiểm tra tính tương thích, nghiệm thu chức năng và mở rộng hệ thống OpenLab 3D.

---

## MỤC LỤC TỔNG QUAN HỆ THỐNG

- **[PHẦN I: TỔNG QUAN KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ LÕI (TECH STACK)](#phan-i-tong-quan-kien-truc-he-thong--cong-nghe-loi-tech-stack)**
  - 1.1. Tầm nhìn Sư phạm & Mục tiêu của OpenLab 3D
  - 1.2. Công nghệ Cốt lõi & Pipeline Đồ họa 3D PBR
  - 1.3. Kiến trúc 4 Lớp Độc lập (\`OL3D-MASTER-SPEC v1.0\`)
  - 1.4. Cấu trúc Thư mục Mã nguồn & Luồng Dữ liệu Toàn cục
- **[PHẦN II: KIẾN TRÚC TƯƠNG TÁC NHÂN QUẢ VẬT LÝ (CAUSAL INTERACTION ARCHITECTURE - CIA v1.0)](#phan-ii-kien-truc-tuong-tac-nhan-qua-vat-ly-causal-interaction-architecture---cia-v10)**
  - 2.1. Triết lý Thiết kế: Tạm biệt Mánh lới (Zero Fabrication & No Cheating)
  - 2.2. Chu trình Nhân quả 6 Giai đoạn (6-Stage Causal Pipeline)
  - 2.3. Các Bộ giải Khoa học Chuyên sâu (Circuit, Raytracing, Fluid/Thermal, Induction Solvers)
  - 2.4. Mô hình Toán học Hình thức của Nhân quả Vật lý
- **[PHẦN III: TIÊU CHUẨN KỸ THUẬT TOÀN DIỆN CHO MODULE THIẾT BỊ .HTML (MASTER SPECIFICATION v2.4)](#phan-iii-tieu-chuan-ky-thuat-toan-dien-cho-module-thiet-bi-html-master-specification-v24)**
  - 3.1. Tiêu chí Cứng (Hard Criteria): 4 Khối DOM cố định theo ID & Hệ quy chiếu SI
  - 3.2. Tiêu chí Đồ họa PBR & Kỹ thuật Zero-Leak CanvasTexture
  - 3.3. Hợp đồng Chức năng Riêng cho 8 Nhóm Thiết bị
  - 3.4. Hệ thống 7 Cổng Kiểm định Tự động (\`validateHtmlModule7Gates\`) & Ranh giới Sandbox
  - 3.5. Bộ Khung Mẫu Chuẩn & Prompt dành cho AI khác
- **[PHẦN IV: HỆ THỐNG MÔI TRƯỜNG PHÒNG LAB & HẠ TẦNG 3D CHUẨN SI](#phan-iv-he-thong-moi-truong-phong-lab--ha-tang-3d-chuan-si)**
  - 4.1. Không gian Phòng Thí nghiệm & Hệ Tọa độ Không gian
  - 4.2. Bàn Thí nghiệm Trung tâm & Các Điểm Mốc Kích thước
  - 4.3. Mô hình 13 Biến Môi trường Vật lý Toàn cầu
  - 4.4. Động lực học Cầm nắm & Bộ lọc Làm mượt Quán tính Bàn tay (Critically Damped Spring Follower)
- **[PHẦN V: HỆ THỐNG GHÉP NỐI ASSEMBLY & CHUẨN NGHIỆM THU RWSS v1.1.1](#phan-v-he-thong-ghep-noi-assembly--chuan-nghiem-thu-rwss-v111)**
  - 5.1. Định dạng Connector: Định danh, Loại, Dung sai Snap & Khóa Bậc Tự do (DoF)
  - 5.2. Đồ thị Ghép nối Động (Assembly Graph Manager) & Thuật toán Giải phóng Slot Đơn
  - 5.3. Bảng Điểm Nghiệm thu 8 Nhóm RWSS v1.1.1 (100.0/100 điểm)
  - 5.4. Bảng Đánh giá 24 Tiêu chí Lắp ráp (ASM-01 đến ASM-24)
- **[PHẦN VI: NGHIÊN CỨU VẬT LÝ QUANG HỌC ĐỘC LẬP & LIÊN ĐỘNG NGUỒN ĐIỆN](#phan-vi-nghien-cuu-vat-ly-quang-hoc-doc-lap--lien-dong-nguon-dien)**
  - 6.1. Nhận diện Các Sai lệch Ngoài đời & Nguyên lý Thực nghiệm
  - 6.2. Điều kiện Liên động Mạch điện Thực
  - 6.3. Khúc xạ Hình học Động qua Thấu kính & Lăng kính (Định luật Snell & Tán sắc)
  - 6.4. Truyền tia trong Không khí & Kiểm tra Giao thoa Thời gian thực (Dynamic Raycaster)
- **[PHẦN VII: HỆ THỐNG MÔ PHỎNG KÍNH HIỂN VI QUANG HỌC 3D & 8 MẪU VẬT THỰC NGHIỆM](#phan-vii-he-thong-mo-phong-kinh-hien-vi-quang-hoc-3d--8-mau-vat-thuc-nghiem)**
  - 7.1. Cấu trúc Cơ học 3D & Hệ Thống Quang học Kính hiển vi
  - 7.2. Mâm Vật kính DIN ($4\\times, 10\\times, 40\\times, 100\\times$) & Tương quan Thị kính ($10\\times, 16\\times$)
  - 7.3. Cơ chế Lấy nét Đôi (Ốc Sơ cấp & Vi cấp), Độ sâu Trường ảnh DoF & Mặt phẳng Tiêu cự Riêng
  - 7.4. Danh mục & Hồ sơ Quang học Chi tiết 8 Mẫu vật Tế bào Sinh học THCS
  - 7.5. Hệ thống Hướng dẫn Thích ứng Thời gian thực (Adaptive Coach) & Thẻ nổi Glassmorphism
- **[PHẦN VIII: DANH MỤC & HỒ SƠ KỸ THUẬT RÀ SOÁT TÁCH BIỆT 36 THIẾT BỊ MÔ PHỎNG](#phan-viii-danh-muc--ho-so-ky-thuat-ra-soat-tach-biet-36-thiet-bi-mo-phong)**
  - 8.0. Bảng Ma trận Đối chiếu Tổng hợp 36 Thiết bị Mô phỏng
  - 8.01 đến 8.36. Hồ sơ Kỹ thuật Chi tiết Từng Thiết bị (Mesh, Connector, Math, FSM, FMEA)
- **[PHẦN IX: PHÂN TÍCH NGUYÊN NHÂN GỐC RỄ 8 NHÓM LỖI NGUYÊN LÝ HOẠT ĐỘNG (ROOT CAUSE ANALYSIS)](#phan-ix-phan-tich-nguyen-nhan-goc-re-8-nhom-loi-nguyen-ly-hoat-dong-root-cause-analysis)**
  - Chi tiết 8 nhóm lỗi vi phạm nguyên lý thực tế (P01 $\\to$ P08) và giải pháp kỹ thuật triệt để
- **[PHẦN X: KẾ HOẠCH TÁI CẤU TRÚC SÂU HỆ THỐNG TƯƠNG TÁC KHOA HỌC (DEEP REFACTOR PLAN)](#phan-x-ke-hoach-tai-cau-truc-sau-he-thong-tuong-tac-khoa-hoc-deep-refactor-plan)**
  - Ma trận ảnh hưởng và 5 giai đoạn thi công chuẩn hóa
- **[PHẦN XI: BÁO CÁO NGHIỆM THU KIỂM THỬ KHOA HỌC THỰC NGHIỆM (24 KỊCH BẢN SCI-01 ĐẾN SCI-24)](#phan-xi-bao-cao-nghiem-thu-kiem-thu-khoa-hoc-thuc-nghiem-24-kich-ban-sci-01-den-sci-24)**
  - 24 Kịch bản kiểm thử khoa học, bảng kết quả thực tế và bảo toàn hồi quy lắp ráp
- **[PHẦN XII: NHẬT KÝ TRIỂN KHAI THAY ĐỔI & TIẾN TRÌNH CẢI TIẾN HỆ THỐNG](#phan-xii-nhat-ky-trien-khai-thay-doi--tien-trinh-cai-tien-he-thong)**
  - Nhật ký chi tiết qua các file mã nguồn và lịch sử các Checkpoint kiểm soát
- **[PHẦN XIII: KẾT LUẬN & HƯỚNG DẪN BẢO TRÌ, PHÁT TRIỂN TIẾP THEO](#phan-xiii-ket-luan--huong-dan-bao-tri-phat-trien-tiep-theo)**

---
`);

// ----------------------------------------------------
// PHẦN I: TỔNG QUAN KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ LÕI
// ----------------------------------------------------
out.push(`
# PHẦN I: TỔNG QUAN KIẾN TRÚC HỆ THỐNG & CÔNG NGHỆ LÕI (TECH STACK)

## 1.1. Tầm nhìn Sư phạm & Mục tiêu của OpenLab 3D
**OpenLab 3D** là nền tảng phòng thí nghiệm ảo tương tác 3D thế hệ mới dành cho học sinh và giáo viên Trung học Cơ sở (lớp 6, 7, 8, 9) học tập môn **Khoa học Tự nhiên (KHTN)** theo chương trình GDPT 2018.

Khác với các ứng dụng mô phỏng 2D hoặc phần mềm đồ họa truyền thống chỉ hiển thị animation kịch bản dựng sẵn (scripted cartoon animations), OpenLab 3D hướng đến mục tiêu:
1. **Chân thực như phòng thí nghiệm thực tế (Real-World Physical Realism)**: Mọi dụng cụ, thiết bị đều có trọng lượng, kích thước vật lý chuẩn mm, tuân thủ định luật bảo toàn khối lượng, định luật Ác-si-mét, quang hình học Snell, cảm ứng Faraday, và định luật Ohm mạch điện.
2. **Khám phá tự do & Tôn trọng chuỗi nhân quả (Unconstrained Open Exploration & Causality)**: Học sinh được tự do cầm nắm, di chuyển, kết nối dây dẫn, phối trộn dung dịch, bật tắt nguồn. Mọi hiện tượng hiển thị trên màn hình đều là kết quả tính toán tự nhiên của bộ giải khoa học (Scientific Solvers), không có kết quả giả lập hay áp đặt.
3. **An toàn sư phạm tuyệt đối (Fail-Safe Virtual Experimentation)**: Cung cấp môi trường thực hành an toàn cho các thí nghiệm có độ rủi ro (lửa đèn cồn, hóa chất, điện áp, thủy tinh dễ vỡ), giúp học sinh rèn luyện kỹ năng thực hành trước khi vào phòng lab thực.
4. **Hệ thống đánh giá & Dữ liệu mở chuẩn hóa (Open Standards & Auditability)**: Tích hợp đầy đủ hồ sơ thiết bị 5 nguồn, 7 cổng kiểm định tự động, và tiêu chuẩn module độc lập dễ dàng mở rộng.

## 1.2. Công nghệ Cốt lõi & Pipeline Đồ họa 3D PBR
OpenLab 3D được phát triển trên nền tảng Web hiện đại, chạy trực tiếp trên trình duyệt máy tính và máy tính bảng mà không cần cài đặt plugin ngoại vi:
* **Ngôn ngữ lõi**: TypeScript 5.8+ (Strict Type-checking) đảm bảo độ tin cậy tuyệt đối về dữ liệu và luồng thực thi.
* **UI Framework**: React 19 + Tailwind CSS 3.4 mang lại giao diện người dùng mượt mà, phản hồi tức thời.
* **Động cơ Đồ họa 3D**: Three.js r128+ kết hợp WebGL 2.0.
* **Pipeline Kết xuất Vật lý PBR**:
  * Tone Mapping: \`ACESFilmicToneMapping\` chuẩn màu điện ảnh.
  * Không gian màu: \`SRGBColorSpace\`.
  * Ánh sáng Môi trường: \`RoomEnvironment\` tính toán qua \`PMREMGenerator\` tạo phản xạ kim loại và thủy tinh chân thật.
  * Đổ bóng: \`PCFSoftShadowMap\` với bản đồ bóng đổ độ phân giải cao ($2048 \\times 2048$).
* **Động cơ Âm thanh**: Web Audio API nội tại tái tạo âm thanh va chạm cơ học, bíp màn hình, dòng nước róc rách.
* **Công cụ Đóng gói & Phát triển**: Vite 6.0 cho tốc độ nạp nóng dưới $100\\text{ ms}$ và thời gian build tối ưu.

## 1.3. Kiến trúc 4 Lớp Độc lập (\`OL3D-MASTER-SPEC v1.0\`)
OpenLab 3D áp dụng mô hình phân lớp rõ ràng nhằm triệt tiêu hoàn toàn sự phụ thuộc chéo và lỗi rò rỉ dữ liệu giữa đồ họa và logic khoa học:

\`\`\`mermaid
flowchart TD
    subgraph Layer4 ["Lớp 4: Ứng dụng & Dịch tễ Sư phạm (App & Pedagogy Layer)"]
        UI["Giao diện HUD, Bảng điều khiển, Hướng dẫn SGK, Thẻ nổi Glassmorphism"]
    end

    subgraph Layer3 ["Lớp 3: Tương tác & Vật lý Đa trường (Interaction & Physics Layer)"]
        CE["Động cơ Nhân quả (Causal Engine)"]
        AG["Đồ thị Ghép nối (Assembly Graph)"]
        SS["Bộ giải Khoa học: Mạch điện, Quang học, Nhiệt học, Thủy lực"]
    end

    subgraph Layer2 ["Lớp 2: Đối tượng & Thiết bị 3D (Object & Equipment Layer)"]
        Catalog["Catalog 36 Thiết bị Chuẩn & Hồ sơ 5 Nguồn"]
        ProceduralMesh["Bộ dựng Hình học Thủ tục PBR (ProceduralLabModels)"]
        HtmlModule["Bộ nạp Module .HTML Độc lập (HtmlEquipmentModuleRegistry)"]
    end

    subgraph Layer1 ["Lớp 1: Môi trường & Hạ tầng (Environment & Infrastructure Layer)"]
        LabRoom["Không gian Phòng Lab 3D (12m x 8m x 3.6m)"]
        Bench["Bàn Thí nghiệm Trung tâm (y = 0.820m)"]
        Env13["13 Biến Môi trường Vật lý Toàn cầu"]
    end

    Layer1 --> Layer2
    Layer2 --> Layer3
    Layer3 --> Layer4
    Layer4 -. Thao tác người dùng .-> Layer3
\`\`\`

1. **Lớp 1: Môi trường & Hạ tầng Phòng Lab (Environment Layer)**
   - Quản lý không gian thế giới thực $12.0\\text{ m} \\times 8.0\\text{ m} \\times 3.6\\text{ m}$, mặt bàn thí nghiệm tại cao độ $y = 0.820\\text{ m}$.
   - Duy trì **13 Biến Môi trường Vật lý Toàn cầu** (Nhiệt độ phòng, áp suất khí quyển, độ ẩm, trọng trường, nồng độ oxy, gia tốc, v.v.).
2. **Lớp 2: Đối tượng & Thiết bị 3D (Object & Equipment Layer)**
   - Quản lý 36 Archetype thiết bị chuẩn hóa và các module \`.html\` nạp ngoài.
   - Mỗi thiết bị được định nghĩa qua: Thông số kỹ thuật (GHĐ, ĐCNN, kích thước mm, khối lượng g), Hệ thống khớp nối Connector, và Cấu trúc hình học Mesh PBR.
3. **Lớp 3: Tương tác & Vật lý Đa trường (Interaction & Physics Layer)**
   - Quản lý Đồ thị ghép nối (\`AssemblyGraph\`) theo chuẩn RWSS v1.1.1.
   - Chạy các Bộ giải Khoa học chuyên sâu (Scientific Solvers) tính toán dòng điện, độ lệch tia sáng khúc xạ, trao đổi nhiệt lượng, và lực căng lò xo.
4. **Lớp 4: Ứng dụng & Dịch tễ Sư phạm (App & Pedagogy Layer)**
   - Hiển thị HUD thông số đo lường, cảnh báo an toàn thực nghiệm, chỉ dẫn sư phạm SGK KHTN, thẻ nổi Glassmorphism và xuất bản dữ liệu báo cáo thí nghiệm.

## 1.4. Cấu trúc Thư mục Mã nguồn & Luồng Dữ liệu Toàn cục
\`\`\`
openlab-3d/
├── src/
│   ├── components/                 # Các thành phần giao diện người dùng React
│   │   ├── common/                 # Header, HUD, Thẻ nổi (EquipmentPreviewPanel, HoverCard)
│   │   ├── student/                # Thanh công cụ Thư viện thiết bị học sinh (StudentEquipmentSidebar)
│   │   └── microscope/             # Modal mô phỏng Kính hiển vi 3D, Bộ render SVG mẫu vật
│   ├── domain/                     # Định nghĩa kiểu dữ liệu TypeScript (types.ts, labEngineTypes.ts)
│   ├── data/                       # Dữ liệu tĩnh, Catalog thiết bị & mẫu vật
│   │   ├── mockCatalog.ts          # Catalog 36 thiết bị gốc OpenLab 3D
│   │   ├── multiSourceEquipmentDossier.ts # Hồ sơ kiểm định 5 nguồn & TT38/2021
│   │   └── microscopeSpecimenCatalog.ts   # Catalog 8 mẫu vật hiển vi chuẩn THCS
│   ├── three-runtime/              # Động cơ mô phỏng 3D WebGL Three.js
│   │   ├── LabViewport3D.tsx       # Khung nhìn tương tác 3D, raycasting, render loop
│   │   ├── LabEnvironmentEngine.ts # 13 Biến môi trường & cấu hình phòng lab
│   │   ├── ProceduralLabModels.ts  # Bộ dựng mô hình 3D thủ tục PBR cho 36 thiết bị
│   │   ├── AssemblySystem.ts       # Hệ thống lắp ráp RWSS v1.1.1 & đồ thị liên kết
│   │   ├── HtmlEquipmentModuleRegistry.ts # Bộ phân tích & 7 cổng kiểm định module HTML
│   │   └── EquipmentImagePreviewController.ts # Bộ điều khiển hiển thị ảnh thực tế
│   └── App.tsx                     # Bộ điều phối trạng thái gốc (State Orchestrator)
├── public/
│   └── libraries3DLab/             # Kho ảnh thực tế & module HTML thiết bị độc lập
├── scripts/                        # Kịch bản kiểm thử tự động CI/CD & Trình tạo báo cáo
└── docs/                           # Tài liệu nghiên cứu & Lưu trữ báo cáo cũ
\`\`\`
`);

// ----------------------------------------------------
// PHẦN II: KIẾN TRÚC TƯƠNG TÁC NHÂN QUẢ VẬT LÝ
// ----------------------------------------------------
out.push(`
# PHẦN II: KIẾN TRÚC TƯƠNG TÁC NHÂN QUẢ VẬT LÝ (CAUSAL INTERACTION ARCHITECTURE - CIA v1.0)

## 2.1. Triết lý Thiết kế: Tạm biệt Mánh lới (Zero Fabrication & No Cheating)
Trong các phiên bản thử nghiệm ban đầu của OpenLab 3D, một số tính năng đã mắc phải phản mẫu (anti-pattern) phổ biến của phần mềm đồ họa: **sử dụng cờ trạng thái dùng chung và animation giả lập để ép hiển thị giao diện**. Điều này dẫn đến các hiện tượng phi thực tế:
- Đèn tự phát sáng khi đặt ra bàn dù chưa có nguồn điện hoặc nguồn đang tắt.
- Bản bán nguyệt thủy tinh tự phát ra 3 tia sáng màu dù không có đèn laser chiếu vào.
- Bát sứ tự động báo nhiệt độ $78.5^\\circ\\text{C}$ khi chưa có đèn cồn đang đốt.
- Đồng hồ vạn năng DMM đo ra $12.00\\text{ V}$ khi hai que đo đang nằm hở mạch trong không khí.

Kiến trúc **CIA v1.0 (Causal Interaction Architecture)** được thiết lập nhằm xóa bỏ hoàn toàn các mánh lới này, áp dụng nguyên lý:
> **BẤT BIẾN NHÂN QUẢ TOÀN CỤC**:  
> *Một hiện tượng vật lý chỉ được phép xuất hiện trong không gian 3D khi và chỉ khi có đầy đủ chuỗi nguyên nhân cơ học, mạch điện hoặc trường năng lượng thực tế sinh ra nó.*

## 2.2. Chu trình Nhân quả 6 Giai đoạn (6-Stage Causal Pipeline)
Mọi tương tác trong OpenLab 3D được xử lý tuần tự qua chu trình khép kín 6 giai đoạn:

\`\`\`mermaid
flowchart LR
    G1["Giai đoạn 1:<br>User Action"] --> G2["Giai đoạn 2:<br>Assembly Graph"]
    G2 --> G3["Giai đoạn 3:<br>Device State"]
    G3 --> G4["Giai đoạn 4:<br>Scientific Solvers"]
    G4 --> G5["Giai đoạn 5:<br>3D Rendering"]
    G5 --> G6["Giai đoạn 6:<br>HUD & Haptics"]
\`\`\`

### Giai đoạn 1: User Action (Hành động người dùng)
- Người dùng thực hiện thao tác tương tác qua chuột/cảm ứng: Kéo rê (Drag), Thả (Drop), Nhấp công tắc (Click Switch), Vặn núm (Rotate Knob), hoặc Cắm giắc nối dây (Wire Plug).
- Sự kiện được chuyển đổi thành lệnh có ngữ nghĩa: \`ToggleSwitchAction\`, \`AttachConnectorAction\`, \`ChangeKnobValueAction\`.

### Giai đoạn 2: Assembly Graph & Topology (Đồ thị lắp ráp & Cấu trúc liên kết)
- Hệ thống cập nhật \`AssemblyGraph\`: Thêm cạnh (Edge) khi hai connector tương thích khớp vào nhau; Xóa cạnh khi tháo rời.
- Xác định cấu trúc liên kết: Mạch điện hở hay kín; Dụng cụ có đặt trên mặt đĩa cân không; Tia sáng có bị chắn bởi thấu kính hay lăng kính không.

### Giai đoạn 3: Device State (Máy trạng thái thiết bị độc lập)
- Mỗi thiết bị sở hữu máy trạng thái hữu hạn (FSM) độc lập của riêng mình trong \`SceneInstance.instanceState\`.
- **Tuyệt đối không có cờ dùng chung** kiểu \`sharedOpticalState\` ghi đè chéo làm khóa chết công tắc thiết bị.

### Giai đoạn 4: Scientific Solvers (Bộ giải Khoa học chuyên sâu)
Hệ thống kích hoạt 4 bộ giải vật lý chuyên biệt:
1. **Circuit Solver (Bộ giải Mạch điện)**:
   - Áp dụng Định luật Ohm và Định luật Kirchhoff:
     $$I = \\frac{\\mathcal{E}}{R_{\\text{total}} + r}, \\quad U = I \\cdot R$$
   - Xác định điện áp thực tế rơi trên từng phụ tải ($V_{\\text{lamp}}$). Đèn sợi đốt chỉ phát sáng khi $V \\ge 2.5\\text{V}$.
2. **Raytracing Solver (Bộ giải Quang học Hình học Thực)**:
   - Gốc tia sáng $\\vec{r}_{\\text{origin}}$ gắn chặt vào tọa độ thực của lỗ đèn trong thế giới thực.
   - Chiếu tia sáng qua không gian. Nếu trúng mặt phân cách lăng kính hoặc thấu kính, tính toán góc khúc xạ theo định luật Snell:
     $$n_1 \\sin i = n_2 \\sin r$$
3. **Fluid & Thermal Solver (Bộ giải Thủy lực & Truyền nhiệt)**:
   - Tính toán thể tích chất lỏng chiếm chỗ theo Định luật Ác-si-mét: $\\Delta V = \\frac{m}{D}$.
   - Tính toán công suất truyền nhiệt từ ngọn lửa đèn cồn lên đáy dụng cụ dựa trên khoảng cách không gian $\\Delta r_{xz} \\le 0.08\\text{ m}$.
4. **Electromagnetic Induction Solver (Bộ giải Cảm ứng Điện từ)**:
   - Tính toán suất điện động cảm ứng theo Định luật Faraday:
     $$\\mathcal{E}_{\\text{ind}} = -N \\frac{d\\Phi}{dt}$$
   - Đèn LED chỉ phát sáng khi nam châm chuyển động ($|\\frac{d\\Phi}{dt}| > 0$). Khi nam châm đứng yên, dòng cảm ứng $i = 0$, LED tắt hoàn toàn.

### Giai đoạn 5: 3D Rendering (Kết xuất Đồ họa Vật lý)
- Cập nhật các node 3D: Cường độ nguồn sáng điểm \`PointLight.intensity\`, độ phát quang \`emissiveIntensity\`, vạch chia màn hình \`CanvasTexture\`, độ xoắn lò xo \`scale.y\`, góc quay kim đồng hồ.

### Giai đoạn 6: HUD & Phản hồi Giác quan
- Hiển thị số đo chính xác trên màn hình kỹ thuật số, phát âm thanh click/rơi tự do/dòng nước, và đưa ra gợi ý sư phạm khi người dùng thao tác sai.

## 2.3. Mô hình Toán học Tổng quát của Nhân quả Vật lý
Toàn bộ trạng thái thế giới tại thời điểm $t + \\Delta t$ là ánh xạ tất định từ trạng thái hiện tại, đồ thị liên kết, thao tác người dùng và môi trường:
$$\\mathcal{S}_{t+\\Delta t} = \\mathcal{F}_{\\text{causal}}\\left(\\mathcal{S}_t, \\mathcal{G}_{\\text{assembly}}, \\mathcal{A}_{\\text{user}}, \\mathcal{E}_{\\text{env}}\\right)$$
Trong đó:
- $\\mathcal{S}_t$: Vector trạng thái của 36 thiết bị trong cảnh.
- $\\mathcal{G}_{\\text{assembly}} = (\\mathcal{V}, \\mathcal{E}_{\\text{connectors}})$: Đồ thị lắp ráp với các đỉnh là thiết bị và các cạnh là khớp nối cơ khí/điện/thủy lực.
- $\\mathcal{A}_{\\text{user}}$: Vector hành động của học sinh trong khung thời gian $\\Delta t$.
- $\\mathcal{E}_{\\text{env}}$: Vector 13 biến môi trường vật lý toàn cầu.
`);

// ----------------------------------------------------
// PHẦN III: TIÊU CHUẨN KỸ THUẬT MODULE THIẾT BỊ .HTML (v2.4)
// ----------------------------------------------------
const standardBody = extractSection(standardRaw, '### 1.1. Cấu trúc 4 khối DOM cố định theo `id`');
out.push(`
# PHẦN III: TIÊU CHUẨN KỸ THUẬT TOÀN DIỆN CHO MODULE THIẾT BỊ .HTML (MASTER SPECIFICATION v2.4)

> **Cơ sở Chuẩn hóa Gốc (Single Source of Truth)**: Bộ tiêu chuẩn này quy định các tiêu chí cứng, đồ họa PBR, hợp đồng chức năng và 7 cổng kiểm định tự động cho mọi module thiết bị \`.html\` nạp vào OpenLab 3D.

${standardBody}
`);

// ----------------------------------------------------
// PHẦN IV: HỆ THỐNG MÔI TRƯỜNG PHÒNG LAB & HẠ TẦNG 3D CHUẨN SI
// ----------------------------------------------------
const graspDynamics = extractSection(physicsGraspRaw, '## 2. BẢNG THÔNG SỐ VẬT LÝ ĐỊNH LƯỢNG (PHYSICAL PARAMETERS SPECIFICATION)');
out.push(`
# PHẦN IV: HỆ THỐNG MÔI TRƯỜNG PHÒNG LAB & HẠ TẦNG 3D CHUẨN SI

${envSection}

---

## 4.5. Nghiên cứu Động lực học Cầm nắm & Tiếp xúc Bàn thí nghiệm
${graspDynamics}
`);

// ----------------------------------------------------
// PHẦN V: HỆ THỐNG GHÉP NỐI ASSEMBLY & CHUẨN NGHIỆM THU RWSS v1.1.1
// ----------------------------------------------------
const assemblySection = extractSection(assemblyRaw, '## 1. TỔNG QUAN KẾT QUẢ NGHIỆM THU');
out.push(`
# PHẦN V: HỆ THỐNG GHÉP NỐI ASSEMBLY & CHUẨN NGHIỆM THU RWSS v1.1.1

> Tiêu chuẩn nghiệm thu ghép nối cơ học và liên kết thiết bị theo **RWSS v1.1.1 — Assembly Acceptance Specification**.

${assemblyGraphSection}

---

${assemblySection}
`);

// ----------------------------------------------------
// PHẦN VI: NGHIÊN CỨU VẬT LÝ QUANG HỌC ĐỘC LẬP & LIÊN ĐỘNG NGUỒN ĐIỆN
// ----------------------------------------------------
const opticsSection = extractSection(opticsResearchRaw, '## 1. PHÂN TÍCH YÊU CẦU & NHẬN DIỆN CÁC ĐIỂM CHƯA ĐÚNG NGOÀI ĐỜI');
out.push(`
# PHẦN VI: NGHIÊN CỨU VẬT LÝ QUANG HỌC ĐỘC LẬP & LIÊN ĐỘNG NGUỒN ĐIỆN

${opticsSection}
`);

// ----------------------------------------------------
// PHẦN VII: HỆ THỐNG MÔ PHỎNG KÍNH HIỂN VI QUANG HỌC 3D & 8 MẪU VẬT THỰC NGHIỆM
// ----------------------------------------------------
const microscopeSection = extractSection(microscopeAuditRaw, '## 2. KIỂM TRA HỆ THỐNG QUANG HỌC KÍNH HIỂN VI');
const microscopeAcceptanceDetails = extractSection(microscopeAcceptanceRaw, '## 2. Chi tiết 5 khu vực chức năng đã triển khai');
out.push(`
# PHẦN VII: HỆ THỐNG MÔ PHỎNG KÍNH HIỂN VI QUANG HỌC 3D & 8 MẪU VẬT THỰC NGHIỆM

${specimensSection}

---

${microscopeSection}

---

## 7.6. Báo cáo Hoàn thiện Triển khai & Bộ Ảnh chụp Kiểm định Thực tế
${microscopeAcceptanceDetails}
`);

// ----------------------------------------------------
// PHẦN VIII: DANH MỤC & HỒ SƠ KỸ THUẬT RÀ SOÁT TÁCH BIỆT 36 THIẾT BỊ MÔ PHỎNG
// ----------------------------------------------------
out.push(`
# PHẦN VIII: DANH MỤC & HỒ SƠ KỸ THUẬT RÀ SOÁT TÁCH BIỆT 36 THIẾT BỊ MÔ PHỎNG

${equipmentDossiersSection}

---

${crossMatrixSection}

---

${aiIntegrationSection}
`);

// ----------------------------------------------------
// PHẦN IX: PHÂN TÍCH NGUYÊN NHÂN GỐC RỄ 8 NHÓM LỖI NGUYÊN LÝ HOẠT ĐỘNG
// ----------------------------------------------------
const rcaSection = extractSection(rootCauseRaw, '## 1. TỔNG HỢP NGUYÊN NHÂN GỐC RỄ THEO 8 NHÓM LỖI (P01 – P08)');
out.push(`
# PHẦN IX: PHÂN TÍCH NGUYÊN NHÂN GỐC RỄ 8 NHÓM LỖI NGUYÊN LÝ HOẠT ĐỘNG (ROOT CAUSE ANALYSIS)

${rcaSection}
`);

// ----------------------------------------------------
// PHẦN X: KẾ HOẠCH TÁI CẤU TRÚC SÂU HỆ THỐNG TƯƠNG TÁC KHOA HỌC
// ----------------------------------------------------
const refactorSection = extractSection(refactorPlanRaw, '## 1. MỤC TIÊU & NGUYÊN TẮC THI CÔNG');
out.push(`
# PHẦN X: KẾ HOẠCH TÁI CẤU TRÚC SÂU HỆ THỐNG TƯƠNG TÁC KHOA HỌC (DEEP REFACTOR PLAN)

${refactorSection}
`);

// ----------------------------------------------------
// PHẦN XI: BÁO CÁO NGHIỆM THU KIỂM THỬ KHOA HỌC THỰC NGHIỆM
// ----------------------------------------------------
const sciSection = extractSection(scientificTestRaw, '## 1. TỔNG KẾT NGHIỆM THU KHOA HỌC');
out.push(`
# PHẦN XI: BÁO CÁO NGHIỆM THU KIỂM THỬ KHOA HỌC THỰC NGHIỆM (24 KỊCH BẢN SCI-01 ĐẾN SCI-24)

${sciSection}
`);

// ----------------------------------------------------
// PHẦN XII: NHẬT KÝ TRIỂN KHAI THAY ĐỔI & TIẾN TRÌNH CẢI TIẾN HỆ THỐNG
// ----------------------------------------------------
const changelogSection = extractSection(changelogRaw, '## 1. TỔNG HỢP CÁC FILE ĐÃ SỬA ĐỔI');
const improvementSection = extractSection(improvementLogRaw, '## Checkpoint 0 — Audit Hiện Trạng Workspace & Lập Kế Hoạch Tương Thích');
out.push(`
# PHẦN XII: NHẬT KÝ TRIỂN KHAI THAY ĐỔI & TIẾN TRÌNH CẢI TIẾN HỆ THỐNG

${changelogSection}

---

## 12.3. Lịch sử Cải tiến theo từng Checkpoint Kiểm soát
${improvementSection}
`);

// ----------------------------------------------------
// PHẦN XIII: KẾT LUẬN & HƯỚNG DẪN BẢO TRÌ, PHÁT TRIỂN TIẾP THEO
// ----------------------------------------------------
out.push(`
# PHẦN XIII: KẾT LUẬN & HƯỚNG DẪN BẢO TRÌ, PHÁT TRIỂN TIẾP THEO

## 13.1. Đánh giá Tổng thể Hiện trạng Nền tảng OpenLab 3D
1. **Kiến trúc Vững chắc**: Hệ thống đã được tái cấu trúc thành công theo mô hình 4 lớp (\`OL3D-MASTER-SPEC v1.0\`) và Động cơ Nhân quả (\`CIA v1.0\`), triệt tiêu hoàn toàn các lỗi khóa chết trạng thái, lỗi gán giá trị mặc định tùy tiện và hiện tượng phát sáng/tỏa nhiệt hư cấu.
2. **Hệ thống Lắp ráp Hoàn thiện Tuyệt đối**: Engine lắp ráp \`AssemblySystem.ts\` đạt điểm số tối đa $100.0 / 100$ điểm theo chuẩn RWSS v1.1.1, quản lý 24 tiêu chí lắp ráp cơ học, snap dung sai, và tự động dọn sạch quan hệ mồ côi.
3. **Mô hình Hóa 36 Thiết bị Chuẩn Xác**: 36 thiết bị chuẩn Thông tư 38/2021/TT-BGDĐT đã được lập hồ sơ toán học, ngân sách sai số, cấu trúc hình học PBR và ma trận tương tác chéo hoàn chỉnh.
4. **Kính hiển vi Quang học Sắc nét**: Hệ thống kính hiển vi 3D hỗ trợ 4 cấp vật kính DIN, 2 cấp thị kính, 8 mẫu vật sinh học chuẩn mực và các lớp ảnh thực tế sắc nét thay thế thumbnail tạm.
5. **Đảm bảo Chất lượng Nghiêm ngặt**: 24 kịch bản kiểm thử tương tác khoa học chuyên sâu (SCI-01 đến SCI-24) đạt 100% PASS, mã nguồn sạch hoàn toàn với $0$ lỗi biên dịch TypeScript (\`tsc --noEmit\`) và build Vite thành công trong $783\\text{ ms}$.

## 13.2. Quy chuẩn Vận hành Thư mục Dự án
Nhằm tránh tình trạng tài liệu nằm rải rác lộn xộn trong thư mục gốc gây khó khăn cho việc tra cứu và phát triển:
- Toàn bộ các báo cáo kỹ thuật, kiến trúc, kiểm định và nghiên cứu trước đây đã được lưu trữ an toàn trong thư mục:
  \`docs/archive_reports/\`.
- Thư mục gốc chỉ duy trì duy nhất **File Báo cáo Tổng thể này** (\`BAO_CAO_TONG_THE_KIEN_TRUC_VA_HE_THONG_OPENLAB3D.md\`) và tệp hướng dẫn dự án (\`README.md\`).
- Khi phát triển thêm thiết bị mới hoặc mở rộng bài thực hành, kỹ sư chỉ cần tra cứu trực tiếp tài liệu này để tuân thủ đúng chuẩn giao tiếp.

---
*Báo cáo kết thúc tại đây. Tài liệu được phê duyệt làm Master Specification của dự án OpenLab 3D.*
`);

// Write to project root
const consolidatedContent = out.join('\n');
const targetFile = path.resolve(process.cwd(), 'BAO_CAO_TONG_THE_KIEN_TRUC_VA_HE_THONG_OPENLAB3D.md');
fs.writeFileSync(targetFile, consolidatedContent, 'utf8');

console.log(`Successfully generated Master Consolidated Report: ${targetFile}`);
console.log(`Total lines: ${consolidatedContent.split('\n').length}`);
console.log(`Total bytes: ${Buffer.byteLength(consolidatedContent, 'utf8')} bytes`);

// Copy to artifact directory
const artifactDir = 'C:\\Users\\ltlie\\.gemini\\antigravity\\brain\\bd724de8-b193-41d1-9969-d7302691bc6b';
if (fs.existsSync(artifactDir)) {
  const artifactTarget = path.join(artifactDir, 'BAO_CAO_TONG_THE_KIEN_TRUC_VA_HE_THONG_OPENLAB3D.md');
  fs.writeFileSync(artifactTarget, consolidatedContent, 'utf8');
  console.log(`Successfully copied to artifact directory: ${artifactTarget}`);
}
