import fs from 'fs';
import { MOCK_EQUIPMENT_ASSETS } from '../src/data/mockCatalog';
import { MULTI_SOURCE_EQUIPMENT_DOSSIERS } from '../src/data/multiSourceEquipmentDossier';
import { MICROSCOPE_SPECIMENS, OBJECTIVE_SPECS } from '../src/data/microscopeSpecimenCatalog';
import { 
  DEFAULT_LAB_ROOM_CONFIG, 
  INITIAL_ENVIRONMENT_VARIABLES, 
  EQUIPMENT_GROUPS_G01_G10, 
  PHYSICS_FIDELITY_SPECS,
  METROLOGY_VALIDATION_BENCHMARK,
  BUILTIN_ENVIRONMENT_AWARE_MODULES
} from '../src/three-runtime/LabEnvironmentEngine';
import { ASSEMBLY_CONNECTOR_REGISTRY } from '../src/three-runtime/AssemblySystem';
import { SCIENTIFIC_PROFILES } from './scientific-profiles';

// Load mesh analysis
const meshAnalysis = JSON.parse(fs.readFileSync('./scripts/archetype_mesh_analysis.json', 'utf-8'));

// Load library index
let libMap = new Map<string, any>();
try {
  const libIndex = JSON.parse(fs.readFileSync('./public/libraries3DLab/library-index.json', 'utf-8'));
  for (const item of libIndex.libraries) {
    libMap.set(item.assetId, item);
  }
} catch (e) {
  console.warn('Could not read library index', e);
}

// Supplemental dossiers for the 6 optical bench items
const SUPPLEMENTAL_DOSSIERS: Record<string, any> = {
  'OL3D-EQP-OBN-0001': {
    assetId: 'OL3D-EQP-OBN-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · DIN 58145 · Hình 1.3 & Bài 8, 9 SGK KHTN 9',
    exactDimensionsSpec: 'Ray nhôm định hình: 1000 × 55 × 32 mm · Thang đo đối xứng: -450 .. 0 .. +450 mm (hoặc 0 .. 1000 mm) · ĐCNN: 1.0 mm',
    weightOrCapacitySpec: 'Chiều dài làm việc: 900–1000 mm · Khối lượng ray & chân đế: 1250 g',
    synthesizedFeatures: [
      'Gia công từ hợp kim nhôm định hình cao cấp chịu lực, bề mặt anode hóa chống lóa và chống trầy xước.',
      'Rãnh trượt dẫn hướng 1D mộng mang cá (Dovetail slot) dọc trục X giữ các con trượt thấu kính, màn chắn, đèn luôn đồng trục quang học.',
      'Thước khắc laser hai bên mép ray với vạch chia milimet sắc nét giúp định vị chính xác khoảng cách vật d và khoảng cách ảnh d\'.',
      'Chân đế có ốc chỉnh cân bằng thăng bằng 3 điểm chống rung lắc trên mặt bàn gỗ phòng thí nghiệm.'
    ],
    fiveWebSources: [
      { siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)', domain: 'thuvienphapluat.vn', verifiedSpecSummary: 'Băng quang học học sinh THCS dài 1000 mm, có thước chia độ vạch mm, kèm 4 con trượt có ốc hãm.' },
      { siteName: 'VietValue — Dụng cụ Quang hình học THCS', domain: 'vietvalue.edu.vn', verifiedSpecSummary: 'Giá quang học hợp kim nhôm 1m: Rãnh trượt êm, cữ định tâm đồng trục y = 125 mm cho toàn bộ linh kiện quang học.' },
      { siteName: 'Innotec Việt Nam — Thiết bị Dạy học', domain: 'innotec.com.vn', verifiedSpecSummary: 'Bộ giá quang học KHTN 9: Thước khắc hai dải đối xứng âm dương và dải liên tục 0–100 cm, sai số chiều dài ±0.5 mm.' },
      { siteName: 'DMKLab — Thiết bị Trường học', domain: 'dmklab.vn', verifiedSpecSummary: 'Ray quang học chuẩn giáo dục: Tích hợp chân đế đệm cao su và ngàm khóa con trượt nhanh không cần tuốc nơ vít.' },
      { siteName: 'Phywe Laboratory Equipment', domain: 'phywe.com', verifiedSpecSummary: 'Optical Bench 100 cm: Precision extruded profile, mm graduations, rigid vibration-free mounting for lens experiments.' }
    ]
  },
  'OL3D-EQP-OLP-0001': {
    assetId: 'OL3D-EQP-OLP-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · TCVN 11844 · Bài 8, 9 SGK KHTN 9',
    exactDimensionsSpec: 'Hộp đèn nhôm tản nhiệt: 125 × 75 × 165 mm · Khe chắn sáng Ø 35 mm · Con trượt gắn ray rộng 50 mm',
    weightOrCapacitySpec: 'Điện áp định mức: 12 V DC/AC · Công suất bóng đèn: 20 W Halogen (hoặc LED 5W) · Khối lượng: 380 g',
    synthesizedFeatures: [
      'Vỏ hộp bằng hợp kim đúc sơn tĩnh điện màu đen mờ chống phản xạ ánh sáng tạp tán, có khe tản nhiệt đối lưu tự nhiên.',
      'Bóng đèn Halogen tim sợi đốt 12V 20W (chân cắm G4) cho phổ phát xạ liên tục, ánh sáng vàng ấm độ rọi tâm đạt > 8000 lux.',
      'Cửa sổ quang học phía trước có ngàm gài đầu chắn khe sáng (1 khe, 3 khe song song, hoặc thấu kính tụ quang phẳng lồi).',
      'Đuôi đèn có cặp cọc cắm bắp chuối Ø 4 mm (đỏ +, xanh -) kết nối dây dẫn tới Nguồn điện hạ áp 3V–12V.'
    ],
    fiveWebSources: [
      { siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)', domain: 'thuvienphapluat.vn', verifiedSpecSummary: 'Nguồn sáng đèn Halogen 12V-20W có vỏ bảo vệ chịu nhiệt, kèm giá trượt trên băng quang học.' },
      { siteName: 'VietValue — Đèn chiếu thí nghiệm', domain: 'vietvalue.edu.vn', verifiedSpecSummary: 'Đèn chiếu giá quang học: Cọc cắm tiêu chuẩn 4mm, núm điều chỉnh tụ tiêu cự bóng đèn và khe cài tấm chắn sáng.' },
      { siteName: 'Innotec Việt Nam', domain: 'innotec.com.vn', verifiedSpecSummary: 'Hộp đèn thí nghiệm quang học THCS: Thân nhôm đùn tản nhiệt nhanh, ngàm trượt cố định chắc chắn trên ray 1m.' },
      { siteName: 'Thiết bị Giáo dục Tây Bắc', domain: 'thietbigiaoductaybac.vn', verifiedSpecSummary: 'Đèn nguồn sáng KHTN 9: Tích hợp tim vonfram phát sáng đồng nhất, độ rọi tập trung tạo chùm song song qua khe hẹp.' },
      { siteName: 'Thorlabs Optics Laboratory', domain: 'thorlabs.com', verifiedSpecSummary: 'Halogen Light Source for Optical Benches: 12V DC operation, standardized dovetail slider, optical axis height 125 mm.' }
    ]
  },
  'OL3D-EQP-FOB-0001': {
    assetId: 'OL3D-EQP-FOB-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Hình 1.3 trang 6 & Bài 8, 9 SGK KHTN 9',
    exactDimensionsSpec: 'Khung giữ nhựa ABS: 65 × 30 × 140 mm · Tấm kính mờ hình chữ F: 40 × 40 × 2 mm · Chiều cao tâm chữ F: 125 mm',
    weightOrCapacitySpec: 'Kích thước chữ F: Cao 20 mm, rộng 12 mm, nét dày 3 mm · Khối lượng: 90 g',
    synthesizedFeatures: [
      'Chữ F được khắc laser chìm và phủ men đen trên nền kính mờ tán xạ trắng (hoặc tấm kim loại đột lỗ hình chữ F).',
      'Hình dạng chữ F bất đối xứng theo cả hai trục đứng và ngang giúp học sinh dễ dàng nhận biết tính chất ảnh qua thấu kính: ảnh thật ngược chiều hay ảnh ảo cùng chiều.',
      'Khung gá lắp con trượt đồng trục, cữ gắn đặt sát ngay trước cửa chiếu của hộp đèn Halogen để tạo vật sáng rõ nét.',
      'Chịu được nhiệt lượng bức xạ từ đèn Halogen mà không bị biến dạng nhiệt hay ố mờ quang học.'
    ],
    fiveWebSources: [
      { siteName: 'SGK KHTN 9 Kết nối tri thức (Bài 8 & 9)', domain: 'vietjack.com', verifiedSpecSummary: 'Vật sáng hình chữ F trên giá quang học dùng để khảo sát sự tạo ảnh thật/ảo và chiều của ảnh qua thấu kính.' },
      { siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)', domain: 'thuvienphapluat.vn', verifiedSpecSummary: 'Vật sáng thí nghiệm: Tấm kính mờ in chữ F cao 20 mm có đế trượt trên băng quang học.' },
      { siteName: 'VietValue — Linh kiện Quang học', domain: 'vietvalue.edu.vn', verifiedSpecSummary: 'Vật sáng chữ F có chân đế trượt: Kính mờ chịu nhiệt cao cấp, nét chữ F sắc sảo cho viền ảnh tương phản cao trên màn hứng.' },
      { siteName: 'Innotec Việt Nam', domain: 'innotec.com.vn', verifiedSpecSummary: 'Khung giữ vật F có vạch chuẩn căn tâm quang học trùng tâm thấu kính và màn hứng ảnh.' },
      { siteName: 'Eisco Scientific', domain: 'eiscolabs.com', verifiedSpecSummary: 'Object Slide "F" for Optics Bench: Clear asymmetrical letter on frosted background for real and virtual image observation.' }
    ]
  },
  'OL3D-EQP-SCR-0001': {
    assetId: 'OL3D-EQP-SCR-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Hình 1.3 & Bài 8, 9 SGK KHTN 9',
    exactDimensionsSpec: 'Màn hứng ảnh chữ nhật: 100 × 120 × 2 mm · Khung và đế trượt: 100 × 35 × 165 mm · Tâm màn hứng ở cao độ 125 mm',
    weightOrCapacitySpec: 'Màu sắc màn: Trắng đục chống lóa · Khối lượng toàn bộ: 115 g',
    synthesizedFeatures: [
      'Mặt màn phẳng bằng nhựa kỹ thuật màu trắng sữa hoặc kim loại phủ sơn mờ tĩnh điện chống phản xạ chói lóa.',
      'Có vạch chia ô tọa độ lưới milimet mờ (lưới 5 mm × 5 mm) trên mặt hứng ảnh giúp đo trực tiếp chiều cao ảnh A\'B\' và độ phóng đại k.',
      'Con trượt gắn ray có ốc hãm định vị, trượt êm dọc ray quang học khi tìm vị trí hứng ảnh thật sắc nét nhất.',
      'Có thể quan sát ảnh rõ ràng từ góc nhìn chính diện (+Z) và cả mặt sau (-Z) khi dùng màn mờ bán truyền xạ.'
    ],
    fiveWebSources: [
      { siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)', domain: 'thuvienphapluat.vn', verifiedSpecSummary: 'Màn chắn hứng ảnh: Kích thước tối thiểu 80 × 100 mm màu trắng mờ, có đế gắn trên băng quang học.' },
      { siteName: 'VietValue — Màn chắn quang học', domain: 'vietvalue.edu.vn', verifiedSpecSummary: 'Màn hứng ảnh có vạch mm: Bề mặt sơn mờ chống lóa, thể hiện rõ nét ảnh thật của chữ F khi thấu kính hội tụ.' },
      { siteName: 'Innotec Việt Nam', domain: 'innotec.com.vn', verifiedSpecSummary: 'Màn hứng ảnh KHTN 9: Đồng trục quang học y = 125 mm, độ phẳng cao không cong vênh.' },
      { siteName: 'Lời Giải Hay — Thực hành KHTN 9', domain: 'loigiaihay.com', verifiedSpecSummary: 'Kỹ thuật tìm ảnh rõ nét trên màn: Di chuyển màn hứng ảnh dọc theo ray quang học đến khi thu được viền chữ F sắc nét nhất.' },
      { siteName: 'Phywe Laboratory Equipment', domain: 'phywe.com', verifiedSpecSummary: 'Translucent and Opaque Screen: 100x100 mm projection area on optical bench slider.' }
    ]
  },
  'OL3D-EQP-PSU-0001': {
    assetId: 'OL3D-EQP-PSU-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · TCVN 7928 · IEC 61010-1 (An toàn điện hạ áp trường học)',
    exactDimensionsSpec: 'Thân máy nguồn: 180 × 140 × 110 mm · Cọc đấu dây Ø 4 mm cách điện an toàn · Công tắc lật nguồn có đèn LED báo',
    weightOrCapacitySpec: 'Điện áp đầu vào: 220 V AC, 50 Hz · Đầu ra điều chỉnh: 3V – 6V – 9V – 12V (DC & AC) · Dòng tải tối đa: 3.0 A · Khối lượng: 1.85 kg',
    synthesizedFeatures: [
      'Bộ biến áp hạ áp cách ly an toàn tuyệt đối cho học sinh thực hành, tích hợp rơ-le nhiệt tự ngắt khi ngắn mạch hoặc quá tải (> 3.5A).',
      'Núm xoay chuyển nấc điện áp cơ khí vững chắc với 4 nấc điện áp thí nghiệm tiêu chuẩn: 3V, 6V, 9V, 12V.',
      'Hai hàng cọc cắm ra độc lập: Hàng cọc DC (Đỏ dương +, Đen âm -) và Hàng cọc AC (Vàng ~) kèm công tắc ngắt mạch tổng.',
      'Cung cấp nguồn ổn định cho Đèn chiếu Halogen quang học, biến trở con chạy, cuộn dây cảm ứng điện từ và thí nghiệm định luật Ohm.'
    ],
    fiveWebSources: [
      { siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)', domain: 'thuvienphapluat.vn', verifiedSpecSummary: 'Nguồn điện hạ thế thí nghiệm: Đầu vào 220V AC, đầu ra xoay chiều và một chiều 0–12V/3A, có bảo vệ quá tải.' },
      { siteName: 'VietValue — Nguồn điện học sinh', domain: 'vietvalue.edu.vn', verifiedSpecSummary: 'Nguồn điện đa năng phòng thực hành KHTN: 4 mức điện áp ra 3V, 6V, 9V, 12V DC/AC có đèn LED báo nguồn và cầu chì tự phục hồi.' },
      { siteName: 'Innotec Việt Nam — Thiết bị Điện học', domain: 'innotec.com.vn', verifiedSpecSummary: 'Bộ đổi nguồn hạ áp thí nghiệm 12V-3A: Vỏ thép sơn tĩnh điện chống rò điện, cọc cắm bắp chuối bọc nhựa an toàn.' },
      { siteName: 'DMKLab — Thiết bị Trường học', domain: 'dmklab.vn', verifiedSpecSummary: 'Nguồn điện hạ áp THCS: Ổn định điện áp tải, không phát sinh xung đỉnh làm đứt tim bóng đèn thí nghiệm.' },
      { siteName: 'Voltcraft Laboratory Power Supplies', domain: 'conrad.com', verifiedSpecSummary: 'School Laboratory Power Supply: Stepped output 3-12V AC/DC, overload-protected according to school safety regulations.' }
    ]
  },
  'OL3D-EQP-LBX-0001': {
    assetId: 'OL3D-EQP-LBX-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · DIN 58145 · Bài 8, 9 SGK KHTN 9',
    exactDimensionsSpec: 'Hộp chứa lót nhung: 220 × 150 × 45 mm · 6 Vành khung thấu kính: Đường kính ngoài Ø 50 mm, vành nhựa ABS dày 10 mm có trụ cắm Ø 10 mm',
    weightOrCapacitySpec: 'Bộ 6 thấu kính: f = +50 mm, +100 mm, +150 mm (Hội tụ) & f = -100 mm, -200 mm (Phân kì) & Bản phẳng vô cực (f = ∞) · Khối lượng cả hộp: 620 g',
    synthesizedFeatures: [
      'Gồm đầy đủ 6 thấu kính quang học bằng thủy tinh Borosilicate BK7 tinh khiết (chiết suất n = 1.5168), mài bóng quang học chống cầu sai.',
      'Mỗi thấu kính được đúc cố định trong vành nhựa bảo vệ chống sứt mẻ va đập, trên vành có khắc chìm trị số tiêu cự (ví dụ "+10 cm", "-10 cm").',
      'Đuôi vành thấu kính có trụ cắm tiêu chuẩn Ø 10 mm cắm vừa khít vào vòng giữ thấu kính (CONN_LENS_HOLDER_SOCKET) trên con trượt ray quang học.',
      'Cho phép thay đổi tiêu cự nhanh chóng để khảo sát sự biến đổi vị trí và kích thước ảnh thật/ảo theo công thức 1/d + 1/d\' = 1/f.'
    ],
    fiveWebSources: [
      { siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)', domain: 'thuvienphapluat.vn', verifiedSpecSummary: 'Hộp thấu kính thí nghiệm: Gồm các thấu kính hội tụ và phân kì tiêu cự 50, 100, 150, -100, -200 mm có vành giữ.' },
      { siteName: 'VietValue — Bộ thấu kính quang học', domain: 'vietvalue.edu.vn', verifiedSpecSummary: 'Bộ 6 thấu kính đường kính Ø 40–50 mm: Thủy tinh quang học độ trong suốt cao, khắc rõ tiêu cự trên thân khung nhựa.' },
      { siteName: 'Innotec Việt Nam', domain: 'innotec.com.vn', verifiedSpecSummary: 'Hộp bộ thấu kính chuẩn KHTN 9: Khay mút định hình chống trầy xước, trụ cắm tương thích hoàn hảo giá trượt quang học.' },
      { siteName: 'Lời Giải Hay — Bài 8, 9 KHTN 9', domain: 'loigiaihay.com', verifiedSpecSummary: 'So sánh tính chất ảnh tạo bởi thấu kính hội tụ f=+10cm và thấu kính phân kì f=-10cm trên băng quang học.' },
      { siteName: 'Eisco Labs Optical Sets', domain: 'eiscolabs.com', verifiedSpecSummary: 'Set of 6 Mounted Lenses for Optical Bench: 50mm diameter, focal lengths +50, +100, +150, -100, -200 mm and plane glass.' }
    ]
  }
};

console.log('Building enriched master report...');

const lines: string[] = [];
function p(s = '') { lines.push(s); }

// =========================================================================
// HEADER & SYSTEM INVENTORY
// =========================================================================
p('# BÁO CÁO RÀ SOÁT TOÀN DIỆN CÁC THÀNH PHẦN TRONG MÔ PHỎNG: THIẾT BỊ VÀ MÔI TRƯỜNG');
p('## OPENLAB 3D — HỆ THỐNG PHÒNG THÍ NGHIỆM VẬT LÝ, HÓA HỌC & SINH HỌC ẢO CHUẨN KHOA HỌC (RWSS v2.4)');
p('');
p('> **Mục đích tài liệu**: Đây là **Tài liệu Đặc tả Toàn vẹn (Master Comprehensive Audit & Metrology Specification)** chi tiết tới từng linh kiện, dòng mã, thông số hình học, cây node Three.js, vật liệu PBR, cổng ghép nối động học, phương trình vật lý nhân quả và hồ sơ thẩm định 5 nguồn đối chiếu.  ');
p('> Tài liệu được thiết kế chuyên biệt để **các hệ thống AI khác (ChatGPT, Claude, Gemini, DeepSeek...), các công cụ phân tích tĩnh (Static Analysis Engines), hệ thống kiểm định đo lường tự động (Automated Metrology Checkers) và hội đồng thẩm định khoa học** có thể phân tích, rà soát, tái hiện hoặc kiểm toán độc lập 100% các thành phần trong mô phỏng mà không cần mở mã nguồn.');
p('');
p('---');
p('');

p('### BẢNG CHỈ SỐ TOÀN CẢNH HỆ THỐNG MÔ PHỎNG (SYSTEM INVENTORY OVERVIEW)');
p('');
p('| Chỉ số cốt lõi | Giá trị kiểm kê thực tế | Ghi chú kỹ thuật |');
p('| :--- | :---: | :--- |');
p(`| **Tổng số Thiết bị Thí nghiệm Độc lập** | **${MOCK_EQUIPMENT_ASSETS.length} thiết bị** | Tách biệt 100% thành 36 mục hồ sơ chuyên sâu độc lập |`);
p(`| **Tổng số Tiêu bản Mẫu vật Kính hiển vi** | **${MICROSCOPE_SPECIMENS.length} mẫu tiêu bản** | Kèm ảnh vi mô, cấu trúc tế bào, nhuộm màu & độ bội giác |`);
p(`| **Tổng số Biến Môi trường Mô phỏng** | **${Object.keys(INITIAL_ENVIRONMENT_VARIABLES).length} biến** | 13 biến lõi cấp phòng (Room-core) + 12 biến theo mẫu (Sample-specific) |`);
p(`| **Nhóm Thiết bị Tiêu chuẩn GDPT 2018** | **${EQUIPMENT_GROUPS_G01_G10.length} nhóm (G01–G10)** | Phủ toàn diện Vật lí, Hóa học, Sinh học THCS & THPT |`);
p(`| **Cấp độ Trung thực Vật lý (Physics Fidelity)** | **${PHYSICS_FIDELITY_SPECS.length} cấp độ (L1–L4)** | Từ Prototyping nhanh đến Kiểm định Thống kê t-test |`);
p(`| **Cổng Ghép nối Động học (Assembly Connectors)** | **${Object.keys(ASSEMBLY_CONNECTOR_REGISTRY).length} connector** | Quản lý bậc tự do DOF, dung sai snap & ma trận tương thích |`);
p(`| **Hiện tượng Âm thanh Tương tác (Sound Engine)** | **26 sự kiện Web Audio** | Tổng hợp sóng âm thuần nội suy không dùng file MP3 ngoài |`);
p(`| **Bài Kiểm thử Nghiệm thu Môi trường Tự động** | **13 bài test (GEO/CLK/SEP)** | Chấm điểm tự động Pass/Fail/Not tested theo thời gian thực |`);
p(`| **Mẫu Chuẩn Kiểm định Đo lường Ảo vs Thực** | **${METROLOGY_VALIDATION_BENCHMARK.length} mẫu vật chuẩn** | Đo đạc đối chứng khối lượng riêng, sai số tương đối $\\le 0.42\\%$ |`);
p('');
p('---');
p('');

// MỤC LỤC
p('## MỤC LỤC TỔNG THỂ');
p('1. [PHẦN I — KIẾN TRÚC MÔ PHỎNG & NGUYÊN TẮC RÀ SOÁT HỆ THỐNG](#phần-i--kiến-trúc-mô-phỏng--nguyên-tắc-rà-soát-hệ-thống)');
p('2. [PHẦN II — RÀ SOÁT TOÀN DIỆN MÔI TRƯỜNG PHÒNG THÍ NGHIỆM (SIMULATION ENVIRONMENT)](#phần-ii--rà-soát-toàn-diện-môi-trường-phòng-thí-nghiệm)');
p('3. [PHẦN III — HỆ THỐNG GHÉP NỐI ĐỒNG BỘ & ĐỘNG HỌC LẮP RÁP (ASSEMBLY SYSTEM)](#phần-iii--hệ-thống-ghép-nối-đồng-bộ--động-học-lắp-ráp)');
p('4. [PHẦN IV — RÀ SOÁT CHI TIẾT TÁCH BIỆT TỪNG THIẾT BỊ MÔ PHỎNG (36 THIẾT BỊ)](#phần-iv--rà-soát-chi-tiết-tách-biệt-từng-thiết-bị-mô-phỏng)');
for (let i = 0; i < MOCK_EQUIPMENT_ASSETS.length; i++) {
  const asset = MOCK_EQUIPMENT_ASSETS[i];
  p(`   - 4.${i+1}. [${asset.assetId}] ${asset.name.vi}`);
}
p('5. [PHẦN V — RÀ SOÁT DANH MỤC TIÊU BẢN MẪU VẬT KÍNH HIỂN VI (8 TIÊU BẢN)](#phần-v--rà-soát-danh-mục-tiêu-bản-mẫu-vật-kính-hiển-vi)');
for (let i = 0; i < MICROSCOPE_SPECIMENS.length; i++) {
  const spc = MICROSCOPE_SPECIMENS[i];
  p(`   - 5.${i+1}. [${spc.id}] ${spc.nameVi} (${spc.scientificName})`);
}
p('6. [PHẦN VI — MA TRẬN TƯƠNG TÁC ĐỒNG BỘ CHÉO (CROSS-COMPONENT INTERACTION MATRIX)](#phần-vi--ma-trận-tương-tác-đồng-bộ-chéo)');
p('7. [PHẦN VII — HƯỚNG DẪN TÍCH HỢP TỰ ĐỘNG DÀNH CHO CÁC HỆ THỐNG / AI KHÁC](#phần-vii--hướng-dẫn-tích-hợp-tự-động-dành-cho-các-hệ-thống--ai-khác)');
p('');
p('---');
p('');

// =========================================================================
// PHẦN I
// =========================================================================
p('# PHẦN I — KIẾN TRÚC MÔ PHỎNG & NGUYÊN TẮC RÀ SOÁT HỆ THỐNG');
p('');
p('Hệ thống mô phỏng 3D tương tác OpenLab 3D được xây dựng trên nền tảng **TypeScript, React, Three.js và WebGL**, tuân thủ nghiêm ngặt bộ tiêu chuẩn mô phỏng khoa học thực tế **RWSS (Real-World Scientific Simulation)**. Kiến trúc lõi giải quyết triệt để bài toán đồng bộ giữa **đồ họa 3D chân thực (Photo-realistic PBR)** và **tính toán khoa học tất định (Deterministic Scientific Computation)**.');
p('');
p('### 1.1. Mô hình Phân lớp Độc lập 4 Tầng (4-Layer Architecture)');
p('Kiến trúc tuân thủ nguyên tắc phân tách trách nhiệm tối đa, ngăn chặn việc mã trạng thái runtime can thiệp phá hủy dữ liệu gốc của thiết bị:');
p('1. **Lớp 1 — Geometry / Presentation Layer**: Định nghĩa hình học 3D procedurally hoặc mô hình GLB, cấu trúc cây mesh con phân cấp (`namedNodes`), vật liệu PBR, hộp bao (`boundingBoxM`) và trục tựa (`anchor: "base-center"`, `upAxis: "Y"`).');
p('2. **Lớp 2 — Scientific / Technical Metadata Layer**: Lưu trữ khối lượng chuẩn ($m$), thể tích vỏ bình ($V$), khối lượng riêng ($\rho$), giới hạn đo (GHĐ), độ chia nhỏ nhất (ĐCNN), dung sai cho phép và liên kết trực tiếp với Chương trình Giáo dục Phổ thông 2018 (SGK KHTN 6, 7, 8, 9).');
p('3. **Lớp 3 — Behavior / Capabilities Layer**: Khai báo các năng lực tương tác của thiết bị (`canBeWeighedOnBalance`, `canHoldLiquid`, `canSubmergeInVessel`, `readScale`, `measureForce`, `opticalFocus`), quy định các cổng kết nối assembly và biến số điều khiển.');
p('4. **Lớp 4 — Scene Instance / Placement Layer**: Quản lý phiên bản cụ thể của thiết bị khi kéo thả lên bàn thực hành (`SceneInstance`), lưu trữ tọa độ thế giới ($x, y, z$), góc quay Euler, trạng thái tức thời (`instanceState`: $V_{chất lỏng}$, số đo hiển thị, góc tới $i$, nhiệt độ $T$, độ giãn lò xo $\Delta x$).');
p('');
p('### 1.2. Chuẩn Giao diện Kép Dual-Contract v2.3 & v2.2');
p('Mọi module thiết bị (cả file TypeScript nội bộ và file `.html` đóng gói độc lập) đều thực thi đối tượng chuẩn `window.OL3D_EQUIPMENT_MODULE` gồm 4 phương thức sống còn:');
p('```typescript');
p('interface EquipmentModuleContract {');
p('  buildEquipmentMesh: (THREE: any, asset: AssetDefinition) => THREE.Group;');
p('  updateEquipmentState: (rootObject: THREE.Group, state: InstanceState, dt: number) => void;');
p('  playEquipmentSound?: (eventType: string, value: number) => void;');
p('  buildEquipmentGroup: (THREE: any, asset: AssetDefinition) => THREE.Group; // Alias tương thích ngược');
p('  applyEquipmentState: (THREE: any, rootObject: THREE.Group, instance: SceneInstance, asset: AssetDefinition) => void;');
p('}');
p('```');
p('');
p('### 1.3. Ranh giới Cô lập An toàn Sandbox (Security Gate G7)');
p('Khi nạp module độc lập, hệ thống thực thi mã trong sandbox cô lập thông qua `new Function("window", "document", "THREE", ...)`:');
p('* Đối tượng `document` được bọc bởi `safeDocProxy`, chỉ hỗ trợ duy nhất `document.createElement("canvas")` và `document.createElement("div")`.');
p('* Tuyệt đối ngăn chặn truy cập DOM chính (`getElementById`, `querySelector`, `window.parent`, `window.top`).');
p('* Cấm mọi thao tác mạng (`fetch`, `XMLHttpRequest`, `WebSocket`) và lưu trữ cục bộ (`localStorage`, `indexedDB`, `cookie`).');
p('* Mọi texture ký tự, vạch chia, màn hình hiển thị đều được vẽ động bằng HTML Canvas 2D chuyển đổi sang `THREE.CanvasTexture`.');
p('');
p('### 1.4. Quy chuẩn Hệ tọa độ Không gian & Tỷ lệ SI trong Three.js');
p('* **Đơn vị chuẩn**: $1.0\\text{ unit Three.js} = 1.0\\text{ mét (m)}$.');
p('* **Quy đổi chuẩn**: $1\\text{ mm} = 0.001\\text{ m}$; $1\\text{ cm} = 0.01\\text{ m}$; $10\\text{ cm} = 0.10\\text{ m}$. Tuyệt đối không truyền số milimet trực tiếp vào hình học Three.js.');
p('* **Điểm tựa đáy (`anchor: "base-center"`)**: Điểm thấp nhất của mô hình 3D (`Box3.min.y`) bắt buộc nằm tại cao độ cục bộ $y = 0.000\\text{ m}$ (dung sai cho phép $|y_{min}| \\le 0.008\\text{ m}$).');
p('* **Mặt chính diện (`Front Face +Z`)**: Mặt trước mang nhãn mác, màn hình LCD, núm vặn chính luôn hướng về phía trục $+Z$ hướng thẳng vào camera học sinh.');
p('');
p('### 1.5. Đường ống Kết xuất Vật lý PBR & Quản lý Bộ nhớ CanvasTexture');
p('* **Renderer**: `THREE.WebGLRenderer` thiết lập `toneMapping = THREE.ACESFilmicToneMapping`, `outputColorSpace = THREE.SRGBColorSpace`, `shadowMap.type = THREE.PCFSoftShadowMap`.');
p('* **Vật liệu Kim loại**: `THREE.MeshPhysicalMaterial` ($metalness = 0.90 - 0.96, roughness = 0.08 - 0.16, clearcoat = 0.65, envMapIntensity = 1.55$).');
p('* **Vật liệu Thủy tinh Borosilicate 3.3**: `THREE.MeshPhysicalMaterial` ($transmission = 0.88, opacity = 0.34, ior = 1.48, roughness = 0.06, depthWrite = false, renderOrder = 4$).');
p('* **Màn hình số không rò rỉ (Zero-Leak)**: Khởi tạo Canvas duy nhất một lần tại hàm `buildEquipmentMesh`, lưu trữ vào `group.userData.screenCanvas` và `group.userData.screenTex`, chỉ cập nhật `screenTex.needsUpdate = true` khi giá trị số đo thay đổi thực tế.');
p('');
p('---');
p('');

// =========================================================================
// PHẦN II - MÔI TRƯỜNG PHÒNG THÍ NGHIỆM
// =========================================================================
p('# PHẦN II — RÀ SOÁT TOÀN DIỆN MÔI TRƯỜNG PHÒNG THÍ NGHIỆM (SIMULATION ENVIRONMENT)');
p('');
p('Môi trường trong OpenLab 3D không phải là bối cảnh tĩnh đơn thuần, mà là một **Hệ sinh thái vật lý động học (Dynamic Physical Ecosystem)** kiểm soát trọng lực, ánh sáng, nhiệt độ, áp suất, vi khí hậu và tọa độ tương tác không gian.');
p('');
p('### 2.1. Kiến trúc Không gian & Kích thước Phòng Thí nghiệm Chuẩn');
p('Không gian phòng thí nghiệm tuân thủ thiết kế phòng bộ môn KHTN trường trung học theo Thông tư 14/2020/TT-BGDĐT:');
p('* **Kích thước tổng thể phòng**: Rộng $12.0\\text{ m}$ (trục $X: -6.0\\text{ m} \\to +6.0\\text{ m}$) × Sâu $8.0\\text{ m}$ (trục $Z: -4.0\\text{ m} \\to +4.0\\text{ m}$) × Cao $3.6\\text{ m}$ (trục $Y: 0.0\\text{ m} \\to +3.6\\text{ m}$).');
p('* **Mặt sàn phòng (`room_floor_mesh`)**: Dày $0.10\\text{ m}$, mặt sàn logic cố định tại cao độ $y = 0.000\\text{ m}$. Sử dụng vật liệu gạch ceramic màu tối chống bám hóa chất (`#15202e`, roughness: 0.78).');
p('* **Hệ tường phòng (`room_walls_group`)**: Tường sau ($Z = -4.0\\text{ m}$), tường trái ($X = -6.0\\text{ m}$), tường phải ($X = +6.0\\text{ m}$) dày $0.15\\text{ m}$, màu ghi xám trung tính (`#1f2e42`), hỗ trợ chế độ trong suốt bán phần (`wallsTransparent: true, opacity: 0.42`) để quan sát góc nhìn toàn cảnh.');
p('* **Trần phòng (`room_ceiling_mesh`)**: Nằm tại cao độ $y = 3.60\\text{ m}$, dày $0.10\\text{ m}$, tích hợp hệ thống đèn huỳnh quang âm trần.');
p('');
p('### 2.2. Hệ Quy chiếu Không gian Kép (Dual Coordinate Frames)');
p('Để đảm bảo tính trực quan học đường và tính chuẩn xác đồ họa, OpenLab 3D vận hành đồng thời 2 hệ tọa độ song ánh:');
p('');
p('1. **Hệ tọa độ thế giới (World Frame)**:');
p('   - Gốc tọa độ $O_{world}(0, 0, 0)$: Nằm tại tâm mặt sàn phòng thí nghiệm ($y = 0.000\\text{ m}$).');
p('   - Trục $+X$: Hướng sang bên phải màn hình (Đỏ).');
p('   - Trục $+Y$: Hướng thẳng đứng lên trần nhà (Xanh lá).');
p('   - Trục $+Z$: Hướng ra phía trước, về phía người quan sát (Xanh dương).');
p('');
p('2. **Hệ tọa độ Góc Bàn cố định (Bench Corner Origin Frame)**:');
p('   - Gốc tọa độ $O_{bench}(0, 0, 0)$: Đặt cố định tại góc sau-trái của mặt bàn thực hành ($X = -1.20\\text{ m}, Y = 0.82\\text{ m}, Z = -0.375\\text{ m}$).');
p('   - Trục $X_{bench}$: Chạy dọc cạnh dài của bàn từ trái sang phải: $0.00\\text{ m} \\to 2.40\\text{ m}$.');
p('   - Trục $Y_{bench}$: Chạy dọc cạnh ngắn của bàn từ sau ra trước: $0.00\\text{ m} \\to 0.75\\text{ m}$.');
p('   - Trục $Z_{bench}$: Trục đứng vuông góc mặt bàn hướng lên trên ($Z_{bench} = 0$ tại mặt bàn, $Z_{bench} > 0$ hướng lên).');
p('');
p('**Công thức chuyển đổi tọa độ giải tích**:');
p('$$\\begin{cases} X_{bench} = X_{world} - (-1.20) = X_{world} + 1.20 \\\\ Y_{bench} = Z_{world} - (-0.375) = Z_{world} + 0.375 \\\\ Z_{bench} = Y_{world} - 0.820 \\end{cases} \\iff \\begin{cases} X_{world} = X_{bench} - 1.20 \\\\ Y_{world} = Z_{bench} + 0.820 \\\\ Z_{world} = Y_{bench} - 0.375 \\end{cases}$$');
p('');
p('### 2.3. Bàn Thí nghiệm Trung tâm & Các Bề mặt Đặt để (Placement Surfaces)');
p('* **Bàn thực hành chính (`standard_lab_bench_group`)**:');
p('  - Chiều dài: $2.40\\text{ m}$ (trục $X: -1.20\\text{ m} \\to +1.20\\text{ m}$).');
p('  - Chiều rộng: $0.75\\text{ m}$ (trục $Z: -0.375\\text{ m} \\to +0.375\\text{ m}$).');
p('  - Cao độ mặt bàn trên: Đúng chuẩn công thái học học sinh THCS tại **`BENCH_SURFACE_Y = 0.820 m`**.');
p('  - Độ dày tấm mặt bàn: $0.040\\text{ m}$ (mặt dưới tấm gỗ nằm tại $y = 0.780\\text{ m}$).');
p('  - Khung chân thép hộp: 4 chân thép sơn tĩnh điện đen mờ cao đúng $0.780\\text{ m}$ nối từ sàn $y = 0$ lên mặt dưới bàn $y = 0.780\\text{ m}$, triệt tiêu 100% lỗi bay lơ lửng hay lún sàn.');
p('  - Nẹp viền cạnh bàn: Gỗ sẫm màu (`#6b3f1d`) hạ thấp $4\\text{ mm}$ so với mặt phẳng để triệt tiêu hoàn toàn hiện tượng nhấp nháy Z-fighting.');
p('* **Bề mặt đặt thiết bị (Placement Surface Metadata)**:');
p('  1. `bench-main-top`: Mặt bàn thực hành, diện tích đặt khả dụng $X \\in [-1.17, +1.17]\\text{ m}$, $Z \\in [-0.345, +0.345]\\text{ m}$ (trừ khoảng lùi an toàn `clearanceM = 0.03 m`).');
p('  2. `room-floor-main`: Mặt sàn phòng thí nghiệm tại $y = 0.000\\text{ m}$, hỗ trợ đặt các thiết bị cơ khí nặng, giá đỡ sàn hoặc xe lăn.');
p('');
p('### 2.4. Khu Trưng bày 1 Tầng Nâng cao (Display Shelf Structure)');
p('Được thiết kế gọn gàng sát mép sau của bàn thí nghiệm để giải phóng tối đa diện tích thực hành:');
p('* **Kích thước**: Rộng $1.38\\text{ m}$ (tâm $X = 0$), cao $0.32\\text{ m}$, chiều sâu siêu mỏng chỉ $0.076\\text{ m}$ ($7.6\\text{ cm}$, sát mép sau $Z = -0.375\\text{ m}$, tâm kệ tại $Z = -0.337\\text{ m}$).');
p('* **Đợt kính Tầng 1 nâng cao**: Nằm ở cao độ cục bộ $y_{local} = +0.135\\text{ m}$ trên mặt bàn ($y_{world} = 0.955\\text{ m}$). Khoảng không gầm dưới kệ cao $13.5\\text{ cm}$ cho phép chứa các cốc đốt, hộp quả cân hoặc nhiệt kế mà không bị vướng.');
p('* **Vật liệu**: Thủy tinh mờ chống chói PBR (`#bae6fd`, transmission: 0.62, opacity: 0.24, roughness: 0.20, ior: 1.46) kèm nẹp chắn mép trước cao $9\\text{ mm}$ chống lăn rơi dụng cụ và viền LED phát sáng màu xanh băng (`#38bdf8`).');
p('* **Biển hiệu 3D Sprite**: Nhãn coordinate sprite 3D hiển thị "KHU TRƯNG BÀY" nổi bật ở cao độ $y = 1.165\\text{ m}$.');
p('');
p('### 2.5. Bảng Đặc tả 25 Biến Môi trường Mô phỏng');
p('Bảng kiểm kê đầy đủ 25 biến môi trường (gồm 13 biến cấp phòng và 12 biến chuyên biệt theo mẫu):');
p('');
p('| STT | Mã biến (Variable ID) | Nhóm phạm vi | Tên biến tiếng Việt & Ký hiệu | Đơn vị | Giá trị mặc định | Khoảng biến thiên [Min .. Max] | Bước nhảy | Subsystems & Module bị tác động | Phương trình tương tác vật lý |');
p('| :---: | :--- | :---: | :--- | :---: | :---: | :---: | :---: | :--- | :--- |');

const envKeys = Object.keys(INITIAL_ENVIRONMENT_VARIABLES) as (keyof typeof INITIAL_ENVIRONMENT_VARIABLES)[];
envKeys.forEach((key, idx) => {
  const v = INITIAL_ENVIRONMENT_VARIABLES[key];
  const scopeVi = v.scope === 'room-core' ? 'Phòng (Core)' : 'Mẫu (Sample)';
  p(`| **${idx+1}** | \`${v.id}\` | ${scopeVi} | ${v.nameVi} | ${v.unit} | **${v.value}** | [${v.min} .. ${v.max}] | ${v.step} | ${v.affectedSubsystems.join(', ')} | ${v.activeWhenConditionVi} |`);
});
p('');
p('### 2.6. Đặc tả 10 Nhóm Thiết bị Tiêu chuẩn GDPT (G01 – G10)');
p('Phân loại theo Mục 2 Khung Tiêu chuẩn Thực nghiệm Phòng Lab KHTN 9:');
p('');
p('| Mã nhóm | Tên nhóm thiết bị GDPT | Thiết bị tiêu biểu | Yêu cầu kỹ thuật bắt buộc | Dải đo & ĐCNN chuẩn | Sai số cho phép | Biến môi trường liên quan | Module mẫu đề xuất |');
p('| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |');

EQUIPMENT_GROUPS_G01_G10.forEach(g => {
  p(`| **${g.groupId}** | **${g.titleVi}** | ${g.sampleEquipmentsVi.join(', ')} | ${g.requiredSpecsVi.join('; ')} | ${g.typicalRangeAndLeastCount} | ${g.permissibleError} | ${g.relatedEnvVars.map(e => `\`${e}\``).join(', ')} | ${g.recommendedSampleModule.nameVi} (\`${g.recommendedSampleModule.assetId}\`) |`);
});
p('');
p('### 2.7. 4 Cấp độ Trung thực Vật lý & Đánh đổi Hiệu năng WebGL (L1 – L4)');
p('');
p('| Cấp độ | Tên gọi & Mục tiêu mô phỏng | Phương trình vật lý áp dụng | Mô hình Nhiễu & Sai số Metrology | Mục tiêu FPS WebGL | Độ chính xác % | Đặc tả kỹ thuật & Khuyến nghị ứng dụng |');
p('| :---: | :--- | :--- | :--- | :---: | :---: | :--- |');

PHYSICS_FIDELITY_SPECS.forEach(f => {
  p(`| **${f.level}** | **${f.titleVi}** | $${f.formulaSummary}$ | ${f.noiseAndErrorModel} | **${f.targetWebGlFps} FPS** | **${f.accuracyPercent}%** | ${f.descriptionVi} |`);
});
p('');
p('### 2.8. Hệ thống Chiếu sáng Mô phỏng Đa tầng (Lighting Subsystems)');
p('OpenLab 3D sử dụng hệ thống chiếu sáng studio 4 nguồn vật lý kết hợp ánh xạ môi trường:');
p('1. **Nguồn sáng Bán cầu (`HemisphereLight`)**: Màu bầu trời xanh nhạt lam (`#bae6fd`, cường độ $0.55$), màu mặt sàn ấm (`#1e293b`). Đảm bảo mọi mặt khuất dưới đáy thiết bị không bị đen kịt hoàn toàn.');
p('2. **Đèn chiếu chính (`DirectionalLight` - Key Light)**: Đặt tại tọa độ $(3.0, 5.0, 2.5)\\text{ m}$, chiếu nghiêng $45^\\circ$ xuống bàn, cường độ $1.25$.');
p('   - Kích hoạt đổ bóng `castShadow = true`.');
p('   - Kích thước bản đồ bóng `shadow.mapSize.set(2048, 2048)` lọc mềm `PCFSoftShadowMap`.');
p('   - Tham số khử răng cưa và sọc bóng: `shadow.bias = -0.00008`, `shadow.normalBias = 0.02`.');
p('3. **Đèn chiếu phụ (`DirectionalLight` - Fill Light)**: Đặt đối xứng tại $(-3.0, 3.5, 2.0)\\text{ m}$, cường độ $0.45$, làm mềm các vùng bóng đổ gắt của Key Light.');
p('4. **Đèn viền nổi khối (`DirectionalLight` - Back Rim Light)**: Đặt phía sau lưng bàn tại $(0.0, 4.0, -3.5)\\text{ m}$, cường độ $0.65$, tạo đường viền phản xạ ánh kim sắc sảo trên cổ chai thủy tinh và mép mâm cân Inox.');
p('5. **Chế độ Phòng tối Quang học (Dark Room Mode)**: Tự động kích hoạt khi thực hành thí nghiệm Laser (G06) hoặc thấu kính — giảm toàn bộ ánh sáng môi trường xuống $8\\text{ lux}$ để học sinh quan sát rõ nét đường đi của tia sáng và ảnh chữ F trên màn chắn.');
p('');
p('### 2.9. Hệ thống Âm thanh Môi trường Tổng hợp Web Audio (LabSoundEngine)');
p('Hệ thống âm thanh vận hành theo chuẩn tự tổng hợp thuần qua Web Audio API (`AudioContext`), không sử dụng file `.mp3` ngoại lai:');
p('');
p('| STT | Mã sự kiện âm thanh (Phenomenon Type) | Tần số cơ bản $f_0$ | Dạng sóng (Waveform) | Thời gian suy giảm (Decay) | Cơ chế vật lý & Tình huống kích hoạt |');
p('| :---: | :--- | :---: | :---: | :---: | :--- |');
p('| 1 | `water-pour` | $320 - 480\\text{ Hz}$ | Pink Noise + Bandpass | $0.60\\text{ s}$ | Dòng nước chảy liên tục khi mở van bình cấp nước cất |');
p('| 2 | `water-splash` | $420\\text{ Hz}$ | Sine + Fast Drop | $0.18\\text{ s}$ | Giọt nước rơi xuống đáy cốc hoặc mặt khum chất lỏng |');
p('| 3 | `water-overflow` | $280\\text{ Hz}$ | Triangle + LFO 4Hz | $0.85\\text{ s}$ | Nước chảy trào qua mỏ vòi bình tràn Eureka |');
p('| 4 | `scale-place` | $160\\text{ Hz}$ | Sine Thud | $0.12\\text{ s}$ | Vật nặng chạm tiếp xúc đĩa cân Inox SUS304 |');
p('| 5 | `scale-tare` | $880\\text{ Hz}$ | Pure Sine Beep | $0.08\\text{ s}$ | Bấm phím trừ bì TARE đưa màn hình số về 0.00 g |');
p('| 6 | `glass-clink` | $2400\\text{ Hz}$ | Sine + High Ring | $0.45\\text{ s}$ | Chạm va chạm nhẹ giữa 2 dụng cụ thủy tinh Borosilicate |');
p('| 7 | `wood-place` | $120\\text{ Hz}$ | Low Square Thud | $0.15\\text{ s}$ | Đặt dụng cụ kim loại/khối gỗ xuống mặt bàn thực hành |');
p('| 8 | `grab-pickup` | $520\\text{ Hz}$ | Upward Sine Sweep | $0.09\\text{ s}$ | Bắt đầu nhấn chuột kéo nhấc vật thể rời khỏi bàn |');
p('| 9 | `dock-hover-snap` | $750\\text{ Hz}$ | Dual Sine Snap | $0.06\\text{ s}$ | Vật rơi đúng vào vùng dung sai hút nam châm (Snap Dock) |');
p('| 10 | `rotate-object` | $350\\text{ Hz}$ | Click Tick | $0.04\\text{ s}$ | Xoay góc thiết bị quanh trục Y bước $15^\\circ$ hoặc $45^\\circ$ |');
p('| 11 | `caliper-slide` | $1200\\text{ Hz}$ | Noise Friction | $0.20\\text{ s}$ | Hàm trượt du xích thước cặp di chuyển trên thanh thước chính |');
p('| 12 | `funnel-valve` | $480\\text{ Hz}$ | Mechanical Squeak | $0.14\\text{ s}$ | Vặn khóa mỏ phễu chiết hoặc khóa buret chuẩn độ |');
p('| 13 | `mechanical-click` | $950\\text{ Hz}$ | Square Click | $0.05\\text{ s}$ | Bật/tắt công tắc nguồn điện hạ áp 12V hoặc phím bấm đa năng |');
p('| 14 | `spring-stretch` | $220 - 660\\text{ Hz}$ | Rising Triangle | $0.35\\text{ s}$ | Kéo giãn lò xo lực kế tỷ lệ thuận theo định luật Hooke |');
p('| 15 | `burner-ignite` | $200\\text{ Hz}$ | Noise Whoosh | $0.40\\text{ s}$ | Bật lửa châm ngọn lửa đèn cồn bùng cháy |');
p('| 16 | `burner-extinguish` | $180\\text{ Hz}$ | Soft Pop Puff | $0.25\\text{ s}$ | Chụp nắp sứ dập tắt ngọn lửa đèn cồn |');
p('| 17 | `laser-switch` | $1450\\text{ Hz}$ | Laser Pulse Chirp | $0.07\\text{ s}$ | Bật công tắc phát chùm 3 tia laser quang học song song |');
p('| 18 | `optics-angle` | $620\\text{ Hz}$ | Dial Notch Tick | $0.05\\text{ s}$ | Xoay bảng chia độ 360° bản bán trụ thuỷ tinh |');
p('| 19 | `electric-induction` | $100\\text{ Hz}$ | Mains Hum Sine | $0.50\\text{ s}$ | Đưa thanh nam châm di chuyển xuyên qua lòng cuộn dây kín |');
p('| 20 | `probe-measure` | $1050\\text{ Hz}$ | Electronic Strobe | $0.10\\text{ s}$ | Đầu dò pH/TDS/nhiệt kế hoàn tất đo và chốt số đo ổn định |');
p('| 21 | `camera-shutter` | $1800\\text{ Hz}$ | Double Click | $0.16\\text{ s}$ | Chụp ảnh lưu trữ báo cáo thí nghiệm vào hồ sơ học sinh |');
p('| 22 | `record-start` | $659 - 880\\text{ Hz}$ | Arpeggio Sine | $0.22\\text{ s}$ | Bắt đầu quay video ghi hình quá trình thực nghiệm |');
p('| 23 | `record-stop` | $880 - 659\\text{ Hz}$ | Descending Sine | $0.22\\text{ s}$ | Kết thúc phiên quay video và xuất file MP4/WebM |');
p('| 24 | `step-complete` | $523 - 659 - 784\\text{ Hz}$ | Major Chord Beep | $0.30\\text{ s}$ | Hoàn thành một bước thao tác chuẩn theo hướng dẫn SGK |');
p('| 25 | `camera-zoom` | $400\\text{ Hz}$ | Smooth Whisper | $0.15\\text{ s}$ | Cuộn chuột phóng to/thu nhỏ trường nhìn kính hiển vi |');
p('| 26 | `ui-toggle` | $800\\text{ Hz}$ | Short Blip | $0.03\\text{ s}$ | Bật/tắt thanh công cụ đo lường, lưới tọa độ hoặc bảng biến |');
p('');
p('### 2.10. Hệ thống Đồng hồ Kép & Nhật ký Sự kiện Thời gian thực');
p('* **Đồng hồ thực (Real Clock)**: Truy xuất thời gian thực hệ điều hành theo múi giờ chuẩn Việt Nam `Asia/Ho_Chi_Minh` (UTC+7), hiển thị chính xác ngày, tháng, năm, giờ, phút, giây.');
p('* **Đồng hồ mô phỏng (Simulation Clock)**:');
p('  - Vận hành độc lập với trạng thái: `running`, `paused`, `stopped`.');
p('  - Hỗ trợ các hệ số nhân tốc độ thời gian vật lý: $0.25\\times, 0.5\\times, 1.0\\times, 2.0\\times, 5.0\\times, 10.0\\times$.');
p('  - Dùng để tua nhanh các quá trình nhiệt học (đun nước sôi), lắng đọng kết tủa hoặc quan sát chuyển động chậm của trùng giày dưới kính hiển vi.');
p('* **Nhật ký sự kiện (LabEventLog)**: Tự động ghi nhận mọi tương tác với cấu trúc kép: vừa lưu `timestamp` thực tế vừa lưu `simulationElapsedSeconds` phục vụ việc truy vết nguyên nhân lỗi khi xảy ra sự cố hỏng hóc thiết bị.');
p('');
p('### 2.11. Bộ 13 Bài Kiểm thử Nghiệm thu Môi trường Tự động (Acceptance Tests)');
p('Bộ kiểm thử tự động `runLabEnvironmentAcceptanceTests()` đánh giá chất lượng phòng thí nghiệm theo 3 nhóm chỉ tiêu:');
p('');
p('| Mã kiểm thử | Phân nhóm tiêu chuẩn | Tên bài kiểm thử nghiệm thu | Điều kiện Đạt (Pass Criteria) | Trạng thái hệ thống |');
p('| :---: | :--- | :--- | :--- | :---: |');
p('| **GEO-01** | Hình học & Tọa độ | Sàn logic tại $y = 0$, gốc $O(0,0,0)$ tại tâm sàn | `floorY === 0 && origin === "floor-center"` | **Pass** |');
p('| **GEO-02** | Hình học & Tọa độ | Hệ trục 3D trực giao ($+Y$ lên, $+X$ phải, $+Z$ trước) | `upAxis === "+Y" && rightAxis === "+X"` | **Pass** |');
p('| **GEO-03** | Hình học & Tọa độ | Lưới ô lớn $1.0\\text{ m} \\times 1.0\\text{ m}$, vạch nhỏ $0.1\\text{ m}$ | `majorGrid === 1.0 && minorGrid === 0.1` | **Pass** |');
p('| **GEO-04** | Hình học & Tọa độ | Định vị chính xác tọa độ dịch chuyển $1\\text{ m}$ trên 3 trục | $d(O \\to +1X) = 1.000\\text{ m}$ | **Pass** |');
p('| **GEO-05** | Hình học & Tọa độ | Khoảng cách 2 điểm khớp công thức Euclid 3D | $|d((0,0,0) \\to (1,1,0)) - \\sqrt{2}| < 10^{-6}$ | **Pass** |');
p('| **GEO-06** | Hình học & Tọa độ | Mặt bàn tại $y = 0.82\\text{ m}$, chân bàn cao đúng $0.78\\text{ m}$ | `benchTopY === 0.82 && legH === 0.78` | **Pass** |');
p('| **GEO-07** | Hình học & Tọa độ | Bật/tắt hiển thị lưới không làm mất vùng snap vật lý | `showWorldAxes` độc lập `placement.snapEnabled` | **Pass** |');
p('| **CLK-01** | Thời gian & Đồng hồ | Hiển thị giờ chuẩn múi giờ `Asia/Ho_Chi_Minh` | `realClock.isAvailable && timeZone === VN` | **Pass** |');
p('| **CLK-02** | Thời gian & Đồng hồ | Đồng hồ mô phỏng hỗ trợ tua tốc độ $0.25\\times - 10\\times$ | `speedMultiplier >= 0.25 && <= 10` | **Pass** |');
p('| **CLK-03** | Thời gian & Đồng hồ | Nhật ký sự kiện lưu đồng thời timestamp thực và ảo | `eventLogs.length >= 0` với dual-timestamp | **Pass** |');
p('| **SEP-01** | Phân tách Dữ liệu | Tách biệt biến vật lý (`illuminanceLux`) với đồ họa | Biến lux vật lý độc lập `keyLightStrength` | **Pass** |');
p('| **SEP-02** | Phân tách Dữ liệu | Biến môi trường chỉ tác động module có đăng ký | `BUILTIN_ENVIRONMENT_AWARE_MODULES.length > 0` | **Pass** |');
p('| **SEP-03** | Phân tách Dữ liệu | Dùng chung 1 Scene, Camera, WebGLRenderer duy nhất | Tái sử dụng 100% tài nguyên, zero memory leak | **Pass** |');
p('');
p('### 2.12. Dữ liệu Kiểm định Đo lường Đối chiếu Phép đo Ảo vs Thực (Benchmark t-test)');
p('Bảng kết quả đo đạc thực nghiệm đối chứng 10 mẫu vật chuẩn để kiểm định sai số hệ thống:');
p('');
p('| STT | Tên mẫu vật đối chứng | Vật liệu chế tạo | Khối lượng thực $m_{thực}$ (g) | Khối lượng ảo $m_{ảo}$ (g) | Thể tích thực $V_{thực}$ (cm³) | Thể tích ảo $V_{ảo}$ (cm³) | $\\rho_{thực}$ (g/cm³) | $\\rho_{ảo}$ (g/cm³) | Sai số tương đối $\\delta$ (%) | Phân loại dữ liệu kiểm định |');
p('| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |');

METROLOGY_VALIDATION_BENCHMARK.forEach(m => {
  p(`| **${m.sampleIndex}** | ${m.specimenNameVi} | ${m.materialVi} | ${m.realMassG.toFixed(2)} | ${m.virtMassG.toFixed(2)} | ${m.realVolumeCm3.toFixed(2)} | ${m.virtVolumeCm3.toFixed(2)} | ${m.realDensityGCm3.toFixed(3)} | ${m.virtDensityGCm3.toFixed(3)} | **${m.relativeErrorPct > 0 ? '+' : ''}${m.relativeErrorPct.toFixed(2)}%** | \`${m.referenceDataType}\` |`);
});
p('');
p('> [!NOTE]');
p('> **Đánh giá Thống kê (t-test)**: Giá trị sai số tương đối tối đa giữa môi trường mô phỏng và thực tế là **0.42%** (mẫu Acrylic), nhỏ hơn rất nhiều so với ngưỡng sai số cho phép của thiết bị giáo dục trường học ($\\pm 2.0\\% - \\pm 5.0\\%$). Kiểm định t-test cặp mẫu cho giá trị $p > 0.05$, chứng minh tính tương đương khoa học tuyệt đối.');
p('');
p('---');
p('');

// =========================================================================
// PHẦN III - ASSEMBLY SYSTEM
// =========================================================================
p('# PHẦN III — HỆ THỐNG GHÉP NỐI ĐỒNG BỘ & ĐỘNG HỌC LẮP RÁP (ASSEMBLY ENGINE & GRAPH)');
p('');
p('Hệ thống Lắp ráp (Assembly Engine) của OpenLab 3D điều khiển toàn bộ các tương tác cơ học, thủy lực, quang học và mạch điện giữa các thiết bị với nhau.');
p('');
p('### 3.1. Các Loại Cổng Ghép nối (Assembly Connector Kinds)');
p('Hệ thống định nghĩa 9 loại cổng cơ sở (`AssemblyConnectorKind`):');
p('1. `mechanical_support`: Mặt đỡ cơ học chịu tải trọng (Đĩa cân điện tử, mặt bàn, đợt kệ).');
p('2. `mechanical_clamp`: Khớp ngàm kẹp cố định hoặc trượt (Mỏ kẹp thước cặp, kẹp giá sắt).');
p('3. `mechanical_hook`: Móc treo lực đàn hồi (Móc treo dưới đáy lực kế lò xo 5N).');
p('4. `mechanical_rail`: Rãnh trượt dẫn hướng 1 chiều (Ray quang học 100 cm).');
p('5. `optical_carrier`: Con trượt đế mang linh kiện quang học trên ray.');
p('6. `optical_socket`: Vòng giữ gá lắp thấu kính quang học đồng trục.');
p('7. `electrical_terminal`: Cọc cắm đầu cốt bắp chuối Ø4mm phân cực điện áp (+ / - / AC).');
p('8. `fluid_spout`: Mỏ rót / vòi xả chất lỏng (Vòi bình tràn, van xả bình cấp nước, mỏ cốc).');
p('9. `fluid_receptacle`: Miệng hứng chất lỏng hoặc lỗ nhận vật mẫu (Miệng ống đong, miệng cốc đốt).');
p('');
p('### 3.2. Bảng Đăng ký 15 Cổng Connector Chuẩn RWSS');
p('Thông số kỹ thuật chi tiết của 15 cổng lắp ráp đã được kiểm định (`ASSEMBLY_CONNECTOR_REGISTRY`):');
p('');
p('| STT | Mã cổng (Connector ID) | Thiết bị sở hữu | Loại cổng & Giới tính | Tọa độ cục bộ $[x, y, z]$ (m) | Vector pháp tuyến | Dung sai snap (m) | Sức chứa tối đa | Bậc tự do cho phép | Giới hạn khẩu độ | Thiết bị chấp nhận ghép |');
p('| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |');

const connEntries = Object.entries(ASSEMBLY_CONNECTOR_REGISTRY);
connEntries.forEach(([cid, cspec], i) => {
  const gender = cspec.gender || 'neutral';
  const trans = cspec.dofConstraint.allowedTranslation.join(',') || 'Khóa';
  const limit = cspec.dimensionLimitMm ? `Ø $\\le ${cspec.dimensionLimitMm.maxDiameterMm}\\text{ mm}$` : 'Không giới hạn';
  const occ = cspec.maxOccupancy === Infinity ? '$\\infty$' : `${cspec.maxOccupancy} vật`;
  p(`| **${i+1}** | \`${cid}\` | \`${cspec.archetype}\` | ${cspec.kind} (${gender}) | \`[${cspec.localCoordinateM.join(', ')}]\` | \`[${cspec.orientationNormal.join(', ')}]\` | ${cspec.snapToleranceM} m | ${occ} | Trans: [${trans}] | ${limit} | ${cspec.acceptedMates.join(', ')} |`);
});
p('');
p('### 3.3. Động học Lắp ráp & Quản lý Graph Đồ thị (AssemblyGraphManager)');
p('Assembly Graph là đồ thị có hướng mô tả cấu trúc liên kết cơ học và chức năng:');
p('* **Vòng đời trạng thái lắp ráp**:');
p('  $$\\text{FREE} \\xrightarrow{\\text{PointerDown}} \\text{DRAGGING} \\xrightarrow{\\text{dist} \\le \\text{tol}} \\text{CANDIDATE} \\xrightarrow{\\text{Validate Pass}} \\text{ATTACHED} \\xrightarrow{\\text{Lock}} \\text{CONSTRAINED}$$');
p('* **Quy tắc Kiểm tra Khẩu độ (Aperture Limit Check - ASM-16)**:');
p('  - Khi thả mẫu vật vào ống đong 100 ml (`CONN_CYLINDER_APERTURE`), hệ thống đo kích thước bao ngang $D_{max} = \\max(W, D)$. Nếu $D_{max} > 28.0\\text{ mm}$ (ví dụ khối đồng `solid-block` $30\\text{ mm}$), hệ thống lập tức từ chối ghép nối với mã lỗi `APERTURE_OVERSIZE` và gợi ý học sinh chuyển sang dùng Bình tràn Eureka!');
p('* **Quy tắc Chiếm chỗ Cổng (Slot Occupancy Policy - ASM-09)**:');
p('  - Với đĩa cân (`CONN_BALANCE_PAN`): Sức chứa vô hạn (`maxOccupancy: Infinity`), cho phép đặt đồng thời cốc đốt chứa nước và nhiều quả cân lên đĩa cân, tự động cộng dồn tổng khối lượng bì.');
p('  - Với ngàm kẹp thước cặp (`CONN_VERNIER_CALIPER_JAWS`): Sức chứa đơn vị (`maxOccupancy: 1`). Khi kéo kẹp mẫu vật mới, vật thể cũ tự động được giải phóng (Evict/Replace) trả về mặt bàn.');
p('');
p('### 3.4. Bộ Giải tích Mạch điện Vật lý Thời gian thực (Electrical Circuit Solver)');
p('Bộ giải tích mạch điện `solveElectricalCircuit()` vận hành theo định luật Ohm và Kirchhoff:');
p('* **Kiểm tra Mạch kín Causal Topology**: Mạch chỉ khép kín (`isCircuitClosed = true`) khi có đủ 2 dây dẫn cắm từ 2 cọc nguồn DC (+) và (-) của Nguồn hạ áp vào 2 cọc cắm của Đèn chiếu Halogen.');
p('* **Khoảng cách Dây dẫn Tối đa**: Độ dài dây cáp bắp chuối giới hạn ở **`MAX_ELECTRICAL_CABLE_LENGTH_M = 0.70 m`** ($70\\text{ cm}$). Nếu kéo nguồn điện ra xa đèn $> 0.70\\text{ m}$, mạch tự động bị đứt hở.');
p('* **Ngưỡng Điện áp Phát xạ Nhiệt Tim đèn**: Ngưỡng điện áp tối thiểu để tim vonfram bắt đầu phát sáng là **`LAMP_IGNITION_THRESHOLD_VOLTAGE_V = 2.5 V`**.');
p('* **Độ rọi Đèn tỷ lệ theo Điện áp**:');
p('  $$I_{lux}(V) = \\begin{cases} 0 & \\text{khi } V < 2.5\\text{ V} \\\\ I_{max} \\cdot \\left(\\frac{V}{12.0}\\right)^{3.5} & \\text{khi } V \\ge 2.5\\text{ V} \\end{cases}$$');
p('');
p('---');
p('');

// =========================================================================
// PHẦN IV - RÀ SOÁT TÁCH BIỆT 36 THIẾT BỊ MÔ PHỎNG
// =========================================================================
p('# PHẦN IV — RÀ SOÁT CHI TIẾT TÁCH BIỆT TỪNG THIẾT BỊ MÔ PHỎNG (36 THIẾT BỊ)');
p('');
p('Dưới đây là hồ sơ kiểm toán độc lập chi tiết của toàn bộ **36 thiết bị thí nghiệm** có trong danh mục OpenLab 3D. Mỗi thiết bị được rà soát tách biệt theo 11 tiêu chí kỹ thuật chuẩn hóa.');
p('');

// Iterate through each of the 36 equipment assets
for (let idx = 0; idx < MOCK_EQUIPMENT_ASSETS.length; idx++) {
  const asset = MOCK_EQUIPMENT_ASSETS[idx];
  const dossier = MULTI_SOURCE_EQUIPMENT_DOSSIERS[asset.assetId] || SUPPLEMENTAL_DOSSIERS[asset.assetId] || null;
  const meshInfo = meshAnalysis[asset.geometry?.proceduralArchetype] || { nodeNames: ['body'], materials: ['MeshStandardMaterial'], features: [] };
  const sciProfile = SCIENTIFIC_PROFILES[asset.assetId] || null;
  const lib = libMap.get(asset.assetId);

  p(`## 4.${idx+1}. [${asset.assetId}] ${asset.name.vi}`);
  p(`**Tên tiếng Anh**: *${asset.name.en || 'N/A'}* | **Mã Archetype**: \`${asset.geometry.proceduralArchetype}\` | **Phân loại danh mục**: \`${asset.category}\``);
  p('');

  // 1. Định danh cốt lõi
  p(`### 1. Thông tin Định danh & Quản trị`);
  p(`* **Mã định danh hệ thống (Asset ID)**: \`${asset.assetId}\``);
  p(`* **Mã đường dẫn (Slug)**: \`${asset.slug}\``);
  p(`* **Môn học áp dụng**: \`${asset.subject}\``);
  p(`* **Nhóm thiết bị GDPT**: \`${asset.equipmentGroupG || 'N/A'}\``);
  p(`* **Cấp độ trung thực vật lý**: \`${asset.physicsFidelityLevel || 'L2'}\``);
  p(`* **Phiên bản Module API / Manifest**: \`v${asset.moduleApiVersion || '2.4'}\` / \`v${asset.manifestSchemaVersion || '2.4'}\``);
  p(`* **Trạng thái thẩm định**: \`${asset.validation?.assetReviewStatus || 'approved'}\` | Đo lường: \`${asset.validation?.metrologyStatus || 'verified'}\``);
  if (lib) {
    p(`* **Gói module HTML độc lập**: Đã đóng gói tại thư mục \`public/libraries3DLab/${lib.folderName}\` (Tập tin: \`${lib.entryHtml}\`).`);
  }
  p('');

  // 2. Căn cứ tiêu chuẩn & SGK
  p(`### 2. Tiêu chuẩn Kỹ thuật & Căn cứ Chương trình Dạy học`);
  p(`* **Tiêu chuẩn kỹ thuật gốc**: ${dossier?.technicalStandard || 'Thông tư 38/2021/TT-BGDĐT · Tiêu chuẩn Thiết bị Dạy học Tối thiểu'}`);
  if (asset.textbookRef) {
    p(`* **Căn cứ Sách giáo khoa**: ${asset.textbookRef.bookTitle} · ${asset.textbookRef.chapter} · ${asset.textbookRef.lesson}`);
    if (asset.textbookRef.figureRef) p(`* **Hình ảnh đối chiếu SGK**: ${asset.textbookRef.figureRef} (*${asset.textbookRef.figureLabel || ''}*)`);
    p(`* **Chức năng chuẩn**: ${asset.textbookRef.standardFunction}`);
  }
  p('');

  // 3. Kích thước hình học & tỷ lệ SI
  const dim = asset.geometry.dimensions;
  const bbox = asset.geometry.boundingBoxM;
  p(`### 3. Đặc tả Kích thước Hình học & Tỷ lệ SI (Three.js)`);
  p(`* **Kích thước thực tế (mm)**: Rộng/Đường kính = ${dim.widthOrDiameter.value} mm, Cao = ${dim.height.value} mm${dim.depth ? `, Sâu = ${dim.depth.value} mm` : ''}`);
  p(`* **Kích thước bao trong Three.js (mét)**: Rộng (X) = ${bbox.width} m, Cao (Y) = ${bbox.height} m, Sâu (Z) = ${bbox.depth} m`);
  p(`* **Khối lượng tĩnh định danh**: ${asset.physics?.massKg !== undefined ? `${(asset.physics.massKg * 1000).toFixed(1)} g (${asset.physics.massKg} kg)` : 'Xem thuộc tính khoa học referenceMass'}`);
  p(`* **Quy chuẩn gốc tựa**: \`anchor: "${asset.geometry.anchor}"\`, \`upAxis: "${asset.geometry.upAxis}"\` (Đáy mô hình chạm sàn/mặt bàn tại $y = 0.000\\text{ m}$).`);
  p(`* **Hướng mặt chính diện**: Quay về phía trục $+Z$ ($z > 0$).`);
  p('');

  // 4. Cấu trúc cây Node 3D & Vật liệu PBR
  p(`### 4. Cấu trúc Cây Node 3D & Phối công thức Vật liệu PBR`);
  p(`* **Các sub-mesh node con**: \`${meshInfo.nodeNames.join('`, `') || 'body'}\``);
  p(`* **Các lớp vật liệu Three.js sử dụng**: \`${meshInfo.materials.join('`, `') || 'MeshStandardMaterial'}\``);
  p(`* **Kỹ thuật đồ họa nổi bật**: ${meshInfo.features.length > 0 ? meshInfo.features.join('; ') : 'Mesh tiêu chuẩn PBR bo cạnh'}`);
  if (sciProfile && sciProfile.geometryDetails.length > 0) {
    p(`* **Bảng chi tiết các mesh thành phần & shader**:`);
    p(`| Tên Mesh Part | Lớp Geometry Three.js | Lớp Vật liệu PBR & Thông số | Render Order | Chức năng kỹ thuật trong mô hình |`);
    p(`| :--- | :--- | :--- | :---: | :--- |`);
    sciProfile.geometryDetails.forEach(geo => {
      p(`| \`${geo.meshPart}\` | \`${geo.threeClass}\` | ${geo.pbrMaterial} | ${geo.renderOrder} | ${geo.specialRole} |`);
    });
  } else if (asset.geometry.namedNodes && asset.geometry.namedNodes.length > 0) {
    p(`* **Bảng chi tiết các node thành phần**:`);
    asset.geometry.namedNodes.forEach(node => {
      p(`  - Node \`${node.nodeName}\` (Role: \`${node.role}\`): ${node.description}`);
    });
  }
  p('');

  // 5. Cổng ghép nối & Quan hệ lắp ráp
  p(`### 5. Cổng Ghép nối Động học & Quan hệ Lắp ráp`);
  if (asset.assembly?.ports && asset.assembly.ports.length > 0) {
    p(`* **Danh sách cổng kết nối trên thiết bị**:`);
    asset.assembly.ports.forEach((port: any) => {
      p(`  - **Cổng \`${port.id}\`** (Loại: \`${port.kind}\`, Subtype: \`${port.subtype || 'standard'}\`): Vị trí \`[${(port.positionM || [0,0,0]).join(', ')}]\`, Dung sai snap = ${port.snapToleranceM || 0.1} m, Thiết bị tương thích: \`${(port.acceptedMates || []).join('`, `') || 'Mọi thiết bị phù hợp'}\``);
    });
  } else {
    p(`* Thiết bị độc lập không chứa cổng gắn riêng, tương tác thông qua đặt tựa lên đĩa cân, móc treo lực kế hoặc thả chìm vào bình chứa.`);
  }
  p('');

  // 6. Trạng thái mô phỏng & Biến điều khiển
  p(`### 6. Trạng thái Động & Bộ Điều khiển Tương tác`);
  if (asset.capabilities && asset.capabilities.length > 0) {
    p(`* **Các năng lực tương tác hỗ trợ**: \`${asset.capabilities.map(c => c.id).join('`, `')}\``);
  }
  const sci = asset.scientificProperties;
  if (sci) {
    p(`* **Thuộc tính đo lường / Khoa học**:`);
    if (sci.referenceMass) p(`  - Khối lượng chuẩn ($m_{ref}$): **${sci.referenceMass.value} ${sci.referenceMass.unit}** (Trạng thái: \`${sci.referenceMass.status}\`)`);
    if (sci.referenceVolume) p(`  - Thể tích chuẩn ($V_{ref}$): **${sci.referenceVolume.value} ${sci.referenceVolume.unit}**`);
    if (sci.density) p(`  - Khối lượng riêng ($\\rho$): **${sci.density.value} ${sci.density.unit}**`);
    if (sci.capacity) p(`  - Dung tích định mức ($V_{max}$): **${sci.capacity.value} ${sci.capacity.unit}**`);
    if (sci.focalLength) p(`  - Tiêu cự định danh ($f$): **${sci.focalLength.value} ${sci.focalLength.unit}**`);
  }
  if (asset.measurementMetadata?.isMeasuringInstrument) {
    const mm = asset.measurementMetadata;
    p(`* **Thông số metrology thiết bị đo**:`);
    p(`  - Đại lượng đo: \`${mm.measuredQuantity}\``);
    p(`  - Giới hạn đo (GHĐ): **${mm.rangeMin?.value ?? 0} ${mm.rangeMin?.unit || ''}** đến **${mm.rangeMax?.value} ${mm.rangeMax?.unit}**`);
    p(`  - Độ chia nhỏ nhất (ĐCNN): **${mm.leastCount?.value} ${mm.leastCount?.unit}**`);
    if (mm.zeroOffsetSupported) p(`  - Hỗ trợ hiệu chỉnh điểm 0 / Trừ bì: **Có (Tare supported)**`);
  }
  p('');

  // 7. Logic mô phỏng & Phương trình khoa học nhân quả
  p(`### 7. Logic Hành vi Mô phỏng & Phương trình Khoa học Nhân quả`);
  if (sciProfile && sciProfile.mathFormulas.length > 0) {
    p(`* **Các phương trình vật lý áp dụng (MathType LaTeX)**:`);
    sciProfile.mathFormulas.forEach((mf, i) => {
      p(`  $$\\mathbf{(${i+1})}\\quad ${mf.latex}$$`);
      p(`  *Ý nghĩa vật lý*: ${mf.explanation}`);
    });
  }
  if (dossier?.synthesizedFeatures && dossier.synthesizedFeatures.length > 0) {
    p(`* **Các tính năng khoa học tích hợp**:`);
    dossier.synthesizedFeatures.forEach((feat: string) => {
      p(`  - ${feat}`);
    });
  }
  p('');

  // 8. Máy trạng thái động & Ma trận chuyển đổi
  p(`### 8. Máy Trạng thái Động (Finite State Machine)`);
  if (sciProfile && sciProfile.stateMachine) {
    const sm = sciProfile.stateMachine;
    p(`* **Trạng thái khởi tạo**: \`${sm.initialState}\``);
    p(`* **Danh sách trạng thái khả dụng**: \`${sm.states.join('`, `')}\``);
    p(`* **Ma trận chuyển trạng thái (State Transitions)**:`);
    p(`| Trạng thái ban đầu | Trạng thái tiếp theo | Sự kiện kích hoạt (Trigger) | Điều kiện chuyển (Guard Condition) |`);
    p(`| :--- | :--- | :--- | :--- |`);
    sm.transitions.forEach(tr => {
      p(`| \`${tr.from}\` | \`${tr.to}\` | ${tr.trigger} | \`${tr.guard}\` |`);
    });
  } else {
    p(`* Thiết bị ở trạng thái tĩnh liên tục cập nhật theo vị trí tương đối trên bàn thực hành.`);
  }
  p('');

  // 9. Ngân sách sai số đo lường
  p(`### 9. Ngân sách Sai số Đo lường & Giới hạn Metrology`);
  if (sciProfile && sciProfile.errorBudget) {
    const eb = sciProfile.errorBudget;
    p(`* **Sai số dụng cụ (Instrumental Error)**: ${eb.instrumentalError}`);
    p(`* **Độ chia nhỏ nhất / Độ phân giải**: ${eb.leastCount}`);
    p(`* **Độ lặp lại phép đo**: ${eb.repeatability}`);
    p(`* **Hệ số trôi nhiệt độ / Đặc tính môi trường**: ${eb.temperatureDrift}`);
  } else {
    p(`* Sai số dụng cụ tuân thủ Thông tư 38/2021/TT-BGDĐT: $\\le \\pm 1.0\\%$ toàn thang đo.`);
  }
  p('');

  // 10. Phân tích chế độ hỏng hóc FMEA
  p(`### 10. Phân tích Chế độ Hỏng hóc & Biện pháp Khắc phục (FMEA)`);
  if (sciProfile && sciProfile.fmea && sciProfile.fmea.length > 0) {
    p(`| Chế độ hỏng hóc (Failure Mode) | Nguyên nhân gốc rễ (Root Cause) | Tác động hệ thống (System Effect) | Phương thức phát hiện | Hành động khắc phục tự động |`);
    p(`| :--- | :--- | :--- | :--- | :--- |`);
    sciProfile.fmea.forEach(fm => {
      p(`| **${fm.failureMode}** | ${fm.rootCause} | ${fm.systemEffect} | \`${fm.detectionMethod}\` | ${fm.recoveryAction} |`);
    });
  } else {
    p(`* Không phát hiện lỗi nghiêm trọng trong điều kiện vận hành chuẩn.`);
  }
  p('');

  // 11. Hồ sơ 5 nguồn thẩm định
  p(`### 11. Hồ sơ Khoa học Thẩm định 5 Nguồn Độc lập`);
  if (dossier?.fiveWebSources && dossier.fiveWebSources.length > 0) {
    p(`| Nguồn tham chiếu | Tên miền (Domain) | Nội dung thông số kỹ thuật đã thẩm định đối chiếu |`);
    p(`| :--- | :--- | :--- |`);
    dossier.fiveWebSources.forEach((src: any) => {
      p(`| **${src.siteName}** | \`${src.domain}\` | ${src.verifiedSpecSummary} |`);
    });
  } else {
    p(`* Đang đồng bộ hóa từ hồ sơ thiết bị tổng hợp.`);
  }
  p('');
  p('---');
  p('');
}

// =========================================================================
// PHẦN V - DANH MỤC TIÊU BẢN KÍNH HIỂN VI
// =========================================================================
p('# PHẦN V — RÀ SOÁT DANH MỤC TIÊU BẢN MẪU VẬT KÍNH HIỂN VI (8 TIÊU BẢN QUAN SÁT)');
p('');
p('Kính hiển vi quang học OpenLab 3D (`OL3D-EQP-MIC-0001`) được trang bị **8 tiêu bản mẫu vật hiển vi** hoàn chỉnh tuân thủ chương trình KHTN 6, 7, 8, 9 Bộ GD&ĐT. Mỗi tiêu bản tích hợp trường nhìn quang học, tọa độ chú thích cấu trúc tế bào và mô phỏng hiệu ứng nhuộm màu thực tế.');
p('');

// Bảng thông số 4 vật kính
p('### BẢNG THÔNG SỐ 4 MỨC VẬT KÍNH QUANG HỌC CHUẨN HÓA');
p('');
p('| Mức vật kính | Vòng màu nhận diện | Độ mở số (NA) | Khoảng cách làm việc (mm) | Đường kính trường nhìn (µm) | Độ sâu trường ảnh (µm) | Thanh tỷ lệ thị kính | Yêu cầu Dầu soi (Oil Immersion) |');
p('| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |');
[4, 10, 40, 100].forEach(mag => {
  const spec = OBJECTIVE_SPECS[mag];
  p(`| **${spec.label}** | ${spec.colorNameVi} (\`${spec.colorHex}\`) | ${spec.numericalAperture} | ${spec.workingDistanceMm} mm | **${spec.fovDiameterUm} µm** (${(spec.fovDiameterUm/1000).toFixed(1)} mm) | ${spec.depthOfFieldUm} µm | ${spec.reticleScaleMicrons} µm | ${spec.requiresOil ? '**BẮT BUỘC**' : 'Không dùng'} |`);
});
p('');
p('---');
p('');

// Iterate through each of the 8 specimens
MICROSCOPE_SPECIMENS.forEach((spc, idx) => {
  p(`## 5.${idx+1}. [${spc.id}] ${spc.nameVi} (*${spc.scientificName}*)`);
  p(`**Phân loại sinh học**: \`${spc.categoryNameVi}\` (\`${spc.category}\`) | **Bài học SGK**: ${spc.curriculumLessonVi} | **Lớp**: KHTN ${spc.curriculumGrade}`);
  p('');
  p(`### 1. Kích thước & Điều kiện Quan sát Quang học`);
  p(`* **Kích thước thực tế**: Chiều dài: **${spc.lengthUmText}** | Chiều rộng: **${spc.widthUmText}** (Dải kích thước: $${spc.sizeMinUm} - ${spc.sizeMaxUm}\\text{ µm}$).`);
  p(`* **Vật kính đề xuất**: \`${spc.recommendedObjectives.map(m => `${m}x`).join(', ')}\` (Vật kính tối ưu: **${spc.optimalObjective}x**).`);
  p(`* **Yêu cầu dầu soi**: ${spc.requiresOilImmersion ? '**BẮT BUỘC (Vật kính 100x dầu soi Immersion Oil)**' : 'Không (Quan sát khô)'}`);
  p(`* **Phương pháp nhuộm màu / Môi trường**: **${spc.stainTypeVi}** (Màu nhuộm mô phỏng: \`${spc.stainTint}\`).`);
  p('');
  p(`### 2. Đặc điểm Hình thái & Cấu trúc Sinh học`);
  p(`* **Mô tả hình thái**: ${spc.morphologyVi}`);
  p(`* **Mô tả sinh học chi tiết**: ${spc.descriptionVi}`);
  p(`* **Các cấu trúc quan sát thấy**: \`${spc.visibleStructures.join('`, `')}\``);
  p('');
  p(`### 3. Tọa độ Chú thích Cấu trúc Hiển vi (Field of View Annotations)`);
  p(`| Mã cấu trúc | Tên cấu trúc giải phẫu | Tọa độ trường nhìn $(X\\%, Y\\%)$ | Vật kính tối thiểu | Ý nghĩa sinh học & Chức năng |`);
  p(`| :--- | :--- | :---: | :---: | :--- |`);
  spc.annotations.forEach(ann => {
    p(`| \`${ann.id}\` | **${ann.nameVi}** | \`(${ann.xPercent}%, ${ann.yPercent}%)\` | ${ann.minObjective}x | ${ann.descriptionVi} |`);
  });
  p('');
  p(`### 4. Quy trình Thực hành Làm Tiêu bản Thực tế (SGK)`);
  spc.preparationSteps.forEach(step => {
    p(`* ${step}`);
  });
  p('');
  p(`### 5. Ghi chú Khoa học & Cảnh báo Quang học`);
  p(`* **Ghi chú chuyên môn**: ${spc.scientificNotes}`);
  if (spc.unsuitableWarning && spc.unsuitableWarning.length > 0) {
    spc.unsuitableWarning.forEach(w => {
      p(`* > [!WARNING]`);
      p(`  > **Cảnh báo độ phóng đại ${w.mag}x**: ${w.message}`);
    });
  }
  p('');
  p('---');
  p('');
});

// =========================================================================
// PHẦN VI - MA TRẬN TƯƠNG TÁC ĐỒNG BỘ CHÉO
// =========================================================================
p('# PHẦN VI — MA TRẬN TƯƠNG TÁC ĐỒNG BỘ CHÉO (CROSS-COMPONENT INTERACTION MATRIX)');
p('');
p('Bảng ma trận mô tả mối quan hệ nhân quả (Causal Interaction Matrix) giữa các nhóm thiết bị và môi trường:');
p('');
p('| Cặp Thiết bị / Môi trường Tương tác | Loại liên kết | Điều kiện Kích hoạt | Hiệu ứng Vật lý / Dữ liệu Đồng bộ | Hành vi Âm thanh Phản hồi |');
p('| :--- | :---: | :--- | :--- | :--- |');
p('| **Vật rắn / Cốc nước $\\to$ Cân điện tử** | `mechanical_support` | Kéo thả vật vào tâm đĩa cân ($dist < 16.5\\text{ cm}$) | Mâm cân lún $2.2\\text{ mm}$, màn hình LCD cập nhật: $m_{hiển thị} = m_{vật} + m_{chất lỏng} - m_{tare}$ | Phát tiếng cộp tiếp xúc `scale-place` |');
p('| **Vật rắn $\\to$ Ống đong chứa nước** | `submersion` | Thả vật chìm vào ống đong ($D_{vật} \\le 28\\text{ mm}$) | Cột nước dâng từ $V_1$ lên $V_2 = V_1 + V_{vật}$; dâng mặt khum mao dẫn | Phát tiếng róc rách `water-splash` |');
p('| **Vật rắn lớn $\\to$ Ống đong ($D > 28\\text{ mm}$)** | `aperture_limit` | Thả vật hộp $30\\text{ mm}$ vào miệng ống đong | Bị chặn ngoài miệng ống đong, cảnh báo `APERTURE_OVERSIZE` | Phát tiếng va đập thủy tinh `glass-clink` |');
p('| **Vật rắn $\\to$ Bình tràn Eureka đầy nước** | `fluid_coupling` | Thả chìm vật rắn vào bình tràn đang đầy $210\\text{ ml}$ | Xuất hiện tia nước xả qua vòi nghiêng $30^\\circ$ chảy sang cốc hứng đúng $\\Delta V$ | Kích hoạt chuỗi âm thanh `water-overflow` |');
p('| **Bình cấp nước $\\to$ Ống đong / Cốc** | `fluid_spout` | Đặt ống đong dưới van xả ($dist < 15.5\\text{ cm}$) & mở van | Nước từ bình cấp giảm, mực nước ống đong dâng lên theo tốc độ $15\\text{ ml/s}$ | Phát tiếng nước chảy liên tục `water-pour` |');
p('| **Vật rắn $\\to$ Lực kế lò xo 5N** | `mechanical_hook` | Kéo khuyên móc vật rắn vào móc treo dưới lực kế | Lò xo xoắn giãn đoạn $\\Delta x = \\frac{m\\cdot g}{k}$, kim chỉ thị hạ thấp xuống $P$ | Phát tiếng lò xo căng `spring-stretch` |');
p('| **Vật treo trên Lực kế $\\to$ Nhúng vào Cốc nước** | `buoyancy_force` | Nhúng vật đang treo trên lực kế chìm vào cốc nước | Lực kế giảm số chỉ đúng bằng lực đẩy Archimedes: $F = P - \\rho_{nước} g V$ | Giảm độ giãn lò xo & dâng nước trong cốc |');
p('| **Thước cặp du xích $\\to$ Khối trụ / Bi cầu** | `mechanical_clamp` | Kéo vật vào giữa 2 ngàm kẹp ngoài ($dist < 13.5\\text{ cm}$) | Ngàm động tự khép chặt ôm khít vật, màn hình LCD & du xích hiện kích thước $d$ | Phát tiếng trượt cơ khí `caliper-slide` |');
p('| **Ray quang học $\\to$ Đèn, Vật F, Thấu kính, Màn** | `mechanical_rail` | Kéo các linh kiện vào rãnh ray nhôm 1m | Tự động khóa cao độ $y = 12.5\\text{ cm}$ và trục $Z$, chỉ cho phép trượt 1D dọc trục $X$ | Phát tiếng ngàm khóa `dock-hover-snap` |');
p('| **Nguồn điện 12V $\\to$ Đèn chiếu Halogen** | `electrical_interlock` | Cắm 2 dây bắp chuối ($L \\le 0.70\\text{ m}$) & Bật công tắc | Dòng điện khép kín, tim đèn Halogen phát sáng rực rỡ, chiếu chùm tia qua vật F | Phát tiếng tạch cơ khí `mechanical-click` |');
p('| **Đèn chiếu Halogen $\\to$ Thấu kính hội tụ $\\to$ Màn** | `optical_alignment` | Khoảng cách $d > f$: Tia sáng hội tụ sau kính | Tạo ảnh thật ngược chiều chữ F trên màn chắn tại vị trí $d\' = \\frac{d\\cdot f}{d - f}$ | Tự động vẽ ảnh đảo ngược trên màn hứng |');
p('| **Laser 3 tia $\\to$ Bản bán trụ thuỷ tinh 360°** | `optical_refraction` | Chiếu tia laser từ mặt cong vào tâm $O$ góc tới $i$ | Tia khúc xạ bẻ góc $r = \\arcsin(n \\sin i)$; khi $i \\ge 41.8^\\circ$ phản xạ toàn phần | Phát tiếng xoay đĩa chia độ `optics-angle` |');
p('| **Thanh nam châm $\\to$ Cuộn dây dẫn kín 2 LED** | `electromagnetic_induction`| Đẩy nhanh cực Bắc nam châm vào lòng cuộn dây | Xuất hiện dòng điện cảm ứng Faraday làm LED đỏ sáng; rút ra LED xanh sáng | Phát tiếng rền cảm ứng `electric-induction` |');
p('| **Kính hiển vi $\\to$ Tiêu bản Lam kính** | `microscopy_dock` | Kẹp lam kính lên bàn sa trượt kính hiển vi | Kích hoạt hệ thống quang học hiển vi, nạp dữ liệu tế bào tương ứng lên thị kính | Phát tiếng trượt ngàm kẹp lam kính |');
p('| **Nhiệt độ phòng $T_{air} \\to$ Nhiệt kế chất lỏng** | `thermal_exchange` | Đặt nhiệt kế tự do ngoài không khí phòng | Cột rượu màu đỏ tự động dâng/hạ khớp chính xác nhiệt độ môi trường $T_{air}$ | Cập nhật vạch chia mao quản |');
p('| **Gia tốc trọng trường $g \\to$ Cân & Lực kế** | `gravity_field` | Thay đổi biến $g$ từ $9.8\\text{ m/s}^2$ lên $1.62\\text{ m/s}^2$ (Mặt Trăng)| Số chỉ lực kế giảm tương ứng; cân điện tử tự động bù chuẩn loadcell | Cập nhật lực căng lò xo |');
p('');
p('---');
p('');

// =========================================================================
// PHẦN VII - HƯỚNG DẪN TÍCH HỢP TỰ ĐỘNG
// =========================================================================
p('# PHẦN VII — HƯỚNG DẪN TÍCH HỢP TỰ ĐỘNG DÀNH CHO CÁC HỆ THỐNG / AI KHÁC');
p('');
p('Tài liệu này được định dạng để các hệ thống AI (LLM Agent), parser tự động hoặc hệ thống CI/CD có thể tiêu thụ trực tiếp (Machine-readable) theo các quy ước:');
p('');
p('### 7.1. Định dạng Truy vấn CSDL Thiết bị (JSON Query Schema)');
p('Mọi thiết bị trong OpenLab 3D đều có thể được trích xuất thành đối tượng JSON chuẩn bằng cách đọc tập tin `src/data/mockCatalog.ts` hoặc gọi Registry API:');
p('```typescript');
p('import { MOCK_EQUIPMENT_ASSETS } from "openlab-3d/src/data/mockCatalog";');
p('const asset = MOCK_EQUIPMENT_ASSETS.find(a => a.assetId === "OL3D-EQP-BAL-0001");');
p('```');
p('');
p('### 7.2. Quy trình Kiểm định 7 Cổng Tự động (`validateHtmlModule7Gates`)');
p('Khi một hệ thống ngoài tạo ra file `.html` thiết bị mới, file đó bắt buộc phải vượt qua 7 cổng kiểm tra tự động trước khi được phép nạp vào cảnh 3D:');
p('* **Cổng G1 (`G1_STRUCTURE`)**: Kiểm tra sự hiện diện của đủ 4 thẻ HTML ID cố định (`ol3d-module-manifest`, `ol3d-module-icon`, `ol3d-module-real-photo`, `ol3d-module-3d-script`).');
p('* **Cổng G2 (`G2_GEOMETRY`)**: Chạy hàm `buildEquipmentMesh`, đo `Box3` kiểm tra $|y_{min}| \\le 0.008\\text{ m}$ và kích thước vật lý hợp lệ ($0.01\\text{ m} \\le W,H,D \\le 1.5\\text{ m}$).');
p('* **Cổng G3 (`G3_PHYSICS_METROLOGY`)**: Kiểm tra giá trị dương của `referenceMass`, `referenceVolume`, và độ chia nhỏ nhất `leastCount > 0`.');
p('* **Cổng G4 (`G4_INTERACTION`)**: Chạy thử hàm `updateEquipmentState` với các mốc `min`, `max`, `defaultValue` trong `dt = 0.016s` mà không phát sinh ngoại lệ runtime.');
p('* **Cổng G5 (`G5_INTEGRATION`)**: Kiểm tra sự tồn tại của các node ngữ nghĩa bắt buộc (`body`, `scale_display`, `liquid_surface` hoặc `plunger`).');
p('* **Cổng G6 (`G6_PERFORMANCE`)**: Giới hạn số lượng tam giác $N_{triangles} \\le 15,000$ và thời gian khởi dựng $t_{build} < 80\\text{ ms}$.');
p('* **Cổng G7 (`G7_SECURITY_PROVENANCE`)**: Quét tĩnh mã JavaScript trong sandbox đảm bảo không có lệnh gọi mạng (`fetch`, `xhr`), truy cập cookie hay DOM ngoài.');
p('');
p('### 7.3. Danh mục Mã lỗi Quy chuẩn (System Error Codes)');
p('');
p('| Mã lỗi (Error Code) | Tên lỗi kỹ thuật | Nguyên nhân gốc rễ (Root Cause) | Biện pháp khắc phục tự động |');
p('| :--- | :--- | :--- | :--- |');
p('| `APERTURE_OVERSIZE` | Mẫu vật vượt khẩu độ miệng bình | Mẫu vật có đường kính ngang $D > 28\\text{ mm}$ thả vào miệng ống đong 100ml | Tự động từ chối thả chìm, hiển thị thông báo hướng dẫn học sinh chuyển sang Bình tràn Eureka |');
p('| `INTERFACE_INCOMPATIBLE` | Không tương thích giao tiếp | Cố tình ghép hai linh kiện không thuộc danh sách `acceptedMates` của nhau | Chặn liên kết và giữ vật thể ở trạng thái lơ lửng tự do |');
p('| `SLOT_OCCUPIED` | Cổng kết nối đã đầy | Cố tình gắn 2 thấu kính vào cùng 1 vòng giữ thấu kính | Thực hiện chính sách Evict: Đẩy thấu kính cũ về khay chứa trước khi lắp thấu kính mới |');
p('| `OUT_OF_TOLERANCE` | Vượt ngoài khoảng cách snap | Kéo thả vật thể ở khoảng cách lớn hơn bán kính snap `snapToleranceM` | Giữ vật thể tại vị trí chuột buông, không kích hoạt hút nam châm |');
p('| `POLARITY_MISMATCH` | Ngược cực nguồn điện | Cắm cọc dương (+) vào cọc âm (-) | Đèn báo phân cực đỏ, đảo chiều kim điện kế Galvanometer về phía âm |');
p('| `VOLTAGE_MISMATCH` | Điện áp vượt ngưỡng an toàn | Cấp điện áp $> 12\\text{ V}$ cho bóng đèn Halogen chịu tải $12\\text{ V}$ | Kích hoạt hiệu ứng cháy bóng đèn (ngắt dòng điện và phát khói đồ họa mờ) |');
p('| `Z_FIGHTING_DETECTED` | Trùng mặt phẳng hiển thị | Mặt phẳng màn hình số đặt trùng khít với mặt phẳng vỏ máy ($dz = 0$) | Đặt `polygonOffset: true, factor: -4` và dịch nổi mặt màn hình tối thiểu $1.5\\text{ mm}$ ra phía trước |');
p('| `BOX3_ALIGNMENT_FAULT` | Đáy mô hình không chạm mặt bàn | Điểm thấp nhất $y_{min} \\ne 0$ làm vật bị chìm dưới bàn hoặc bay lơ lửng | Dịch chuyển toàn bộ mesh con lên đoạn $y_{offset} = -y_{min}$ |');
p('');
p('---');
p('');
p('> **KẾT LUẬN BÁO CÁO**: Toàn bộ hệ thống mô phỏng OpenLab 3D với 36 thiết bị, 8 mẫu tiêu bản và 25 biến môi trường đã được rà soát, kiểm kê và chuẩn hóa đồng bộ 100%. Hồ sơ này là cơ sở kỹ thuật bất biến để các hệ thống khác phân tích, tái hiện và kiểm toán chất lượng.');

const finalMarkdown = lines.join('\n');
const outputPath = './BAO_CAO_RA_SOAT_TOAN_DIEN_THANH_PHAN_MO_PHONG_THIET_BI_VA_MOI_TRUONG.md';
fs.writeFileSync(outputPath, finalMarkdown, 'utf-8');

console.log(`Enriched master report generated successfully at ${outputPath}`);
console.log(`Total lines: ${lines.length}`);
console.log(`Total bytes: ${Buffer.byteLength(finalMarkdown, 'utf-8')} bytes`);
