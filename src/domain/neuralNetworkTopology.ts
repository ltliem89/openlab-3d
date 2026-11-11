/**
 * OPENLAB 3D - NEURAL DEVICE TOPOLOGY DOMAIN DATA (BẢN TỐI ƯU SƯ PHẠM KHTN THCS)
 * Hệ tri thức topo Mạng Nơ-ron Thần kinh mô phỏng liên kết 36 thiết bị thí nghiệm
 * Bổ sung: Phân lớp THCS (Lớp 6, 7, 8, 9), Diễn giải ngôn ngữ học sinh, 
 * Tiến trình thực hành từng bước (Step-by-Step Guided Flows), Biểu tượng Vector & Mẹo an toàn.
 */

export type ThcsGrade = 'grade6' | 'grade7' | 'grade8' | 'grade9';

export type PhysicalSignalType =
  | 'MASS_VALUE'
  | 'FORCE_NEWTON'
  | 'VOLTAGE_VOLT'
  | 'CURRENT_AMPERE'
  | 'RESISTANCE_OHM'
  | 'VOLUME_DISPLACEMENT'
  | 'TEMPERATURE_C'
  | 'LIGHT_RAY'
  | 'MAGNETIC_FLUX'
  | 'DIMENSION_MM'
  | 'MICROSCOPIC_VIEW';

export interface DeviceIntercomProtocol {
  emits: PhysicalSignalType[];
  consumes: PhysicalSignalType[];
  measurementTarget?: string;
}

export interface NeuralDeviceNode {
  id: string;              // Slug archetype (ví dụ: 'electronic-balance')
  assetId: string;         // Mã chuẩn 'OL3D-EQP-BAL-0001'
  nameVi: string;          // Tên tiếng Việt chính quy
  nameStudent: string;     // Tên gọi thân mật, dễ nhớ cho học sinh
  shortKeyword: string;    // Từ khóa ngắn gọn (6-14 ký tự) hiển thị trên bản đồ không bị che chữ
  nameEn: string;          // Tên tiếng Anh
  category: DeviceCategory;
  subject: 'physics' | 'chemistry' | 'biology' | 'general';
  grades: ThcsGrade[];     // Thuộc chương trình lớp nào (6, 7, 8, 9)
  ports: string[];         // Các cổng connector sở hữu
  studentPorts: string[];  // Tên cổng thuần Việt thân thiện (ví dụ: "Đĩa cân", "Vòi xả")
  description: string;     // Vai trò sư phạm & nguyên lý hoạt động
  studentTip: string;      // Mẹo an toàn & hướng dẫn thao tác đúng
  mathFormula?: string;    // Công thức vật lý chuẩn quốc tế / giáo viên
  sgkFormula?: string;     // Công thức rút gọn quen thuộc trong SGK THCS
  glyphIcon: string;       // Biểu tượng cảm xúc / hình đại diện
  intercomProtocol?: DeviceIntercomProtocol; // Giao thức giao tiếp nhân quả giữa các thiết bị
}

export type DeviceCategory = 
  | 'G01_DIMENSION'     // Đo kích thước, chiều dài, góc
  | 'G02_MASS_FORCE'    // Cân, khối lượng, lực
  | 'G03_TIME_TEMP'     // Thời gian, nhiệt độ, điện môi trường
  | 'G04_VOLUMETRIC'    // Chứa & đo thể tích chất lỏng
  | 'G05_CHEM_HEATING'  // Hóa học, gia nhiệt, biến đổi
  | 'G06_OPTICS'        // Quang học, nguồn sáng, thấu kính
  | 'G07_ELECTRICITY'   // Mạch điện, nguồn điện, cảm ứng
  | 'G08_MECHANICS'     // Cơ học, đòn bẩy, bình thông nhau
  | 'G09_BIOLOGY'       // Sinh học, kính hiển vi, di truyền
  | 'G10_FLUID_SUPPLY'; // Cung cấp lưu chất

export type SynapseKind = 
  | 'mechanical_support'       // Đỡ cơ học (đĩa cân, đợt kệ)
  | 'mechanical_clamp'         // Ngàm kẹp ôm khít (thước cặp)
  | 'mechanical_hook'          // Treo đàn hồi (lực kế lò xo)
  | 'mechanical_rail'          // Ray trượt định hướng 1D (ray quang học)
  | 'optical_carrier'          // Con trượt đế mang linh kiện quang
  | 'optical_alignment'        // Đồng trục truyền tia sáng và tạo ảnh
  | 'optical_refraction'       // Khúc xạ / tán sắc / phản xạ toàn phần
  | 'electrical_terminal'      // Cọc cắm đầu bắp chuối Ø4mm
  | 'electrical_interlock'     // Khóa liên động mạch kín có điều kiện
  | 'fluid_spout'              // Mỏ rót / vòi xả chất lỏng
  | 'fluid_receptacle'         // Miệng hứng / lỗ nhận vật mẫu
  | 'submersion'               // Thả chìm chiếm chỗ đo thể tích
  | 'buoyancy_force'           // Lực đẩy Archimedes ngược chiều trọng lực
  | 'electromagnetic_induction'// Cảm ứng điện từ biến thiên từ thông
  | 'thermal_exchange'         // Truyền nhiệt đối lưu và dẫn nhiệt
  | 'microscopy_dock';         // Gá mẫu soi vi thể trên bàn sa trượt

export interface NeuralSynapseEdge {
  id: string;
  source: string;        // ID node phát tín hiệu / tác nhân
  target: string;        // ID node nhận tín hiệu / đối tượng
  type: SynapseKind;
  connectorId?: string;  // Khớp với RWSS Connector Registry
  weight: number;        // Trọng số nơ-ron (độ bền vững / cường độ tương tác: 0.1 - 1.0)
  signalSpeed: number;   // Tốc độ truyền xung thần kinh mô phỏng
  causalRule: string;    // Quy tắc nhân quả chi phối (chuyên gia)
  studentCausal: string; // Giải thích nhân quả tự nhiên cho học sinh
  experimentContext: string; // Bài thí nghiệm tiêu biểu SGK
}

export interface ExperimentStep {
  stepNumber: number;
  title: string;
  instruction: string;
  activeDeviceIds: string[];
  activeSynapseIds: string[];
  focusNote: string;
}

export interface ExperimentMacroCluster {
  id: string;
  title: string;
  subject: string;
  grade: 'KHTN 6' | 'KHTN 7' | 'KHTN 8' | 'KHTN 9';
  gradeCode: ThcsGrade;
  deviceIds: string[];
  description: string;
  studentGoal: string;   // Mục tiêu bài học dạng hỏi - đáp dễ nhớ
  coreEquation: string;
  sgkFormula: string;
  steps: ExperimentStep[]; // Các bước thực hành theo SGK
}

// -------------------------------------------------------------
// 1. DANH MỤC 36 THIẾT BỊ NƠ-RON TỐI ƯU CHO HỌC SINH THCS
// -------------------------------------------------------------
export const NEURAL_DEVICE_NODES: NeuralDeviceNode[] = [
  // G01 - Chiều dài & Kích thước
  {
    id: 'vernier-caliper',
    assetId: 'OL3D-EQP-CAL-0001',
    nameVi: 'Thước cặp du xích 150 mm',
    nameStudent: 'Thước kẹp đo chính xác',
    shortKeyword: 'Thước kẹp',
    nameEn: 'Vernier Caliper 150mm',
    category: 'G01_DIMENSION',
    subject: 'physics',
    grades: ['grade6', 'grade8'],
    ports: ['CONN_VERNIER_CALIPER_JAWS'],
    studentPorts: ['Ngàm kẹp ngoài', 'Ngàm đo trong'],
    description: 'Đo đường kính ngoài, đường kính trong và độ sâu với độ chính xác 0.02 mm.',
    studentTip: 'Nhẹ nhàng trượt ngàm kẹp ôm vừa khít vật thể, không siết quá mạnh làm xước dụng cụ!',
    mathFormula: 'd = M + \\frac{V}{n} \\cdot \\Delta x',
    sgkFormula: 'Độ chính xác: 0.02 mm (1/50 mm)',
    glyphIcon: '📏'
  },
  {
    id: 'ruler-30',
    assetId: 'OL3D-EQP-RUL-0001',
    nameVi: 'Thước thẳng chia vạch 30 cm',
    nameStudent: 'Thước kẻ đo chiều dài',
    shortKeyword: 'Thước kẻ',
    nameEn: 'Graduated Ruler 30cm',
    category: 'G01_DIMENSION',
    subject: 'general',
    grades: ['grade6', 'grade7', 'grade8', 'grade9'],
    ports: [],
    studentPorts: ['Thân chia vạch milimet'],
    description: 'Đo kích thước hình học tổng thể, khoảng cách bố trí trên bàn.',
    studentTip: 'Đặt mắt nhìn vuông góc với vạch chia để tránh sai số đo nhé!',
    mathFormula: 'L = x_2 - x_1 \\pm 0.5\\,\\text{mm}',
    sgkFormula: 'ĐCNN = 1 mm',
    glyphIcon: '📐'
  },

  // G02 - Cân, khối lượng, lực
  {
    id: 'electronic-balance',
    assetId: 'OL3D-EQP-BAL-0001',
    nameVi: 'Cân điện tử hiện số 500 g',
    nameStudent: 'Cân điện tử hiện số',
    shortKeyword: 'Cân điện tử',
    nameEn: 'Precision Electronic Balance 500g',
    category: 'G02_MASS_FORCE',
    subject: 'physics',
    grades: ['grade6', 'grade8'],
    ports: ['CONN_BALANCE_PAN'],
    studentPorts: ['Đĩa cân inox', 'Nút trừ bì TARE'],
    description: 'Đo khối lượng tịnh với độ phân giải 0.01 g, tích hợp nút trừ bì TARE.',
    studentTip: 'Nhớ bấm nút TARE để đưa màn hình về 0.00g khi đã đặt cốc lên đĩa cân trước khi rót nước!',
    mathFormula: 'm_{\\text{net}} = \\max(0, m_{\\text{gross}} - m_{\\text{tare}})',
    sgkFormula: 'Khối lượng = Số chỉ trên màn hình (gam)',
    glyphIcon: '⚖️'
  },
  {
    id: 'calibration-weight',
    assetId: 'OL3D-EQP-WGT-0001',
    nameVi: 'Bộ quả cân chuẩn bằng đồng 50 g',
    nameStudent: 'Quả cân chuẩn 50g',
    shortKeyword: 'Quả cân 50g',
    nameEn: '50g Brass Calibration Weight',
    category: 'G02_MASS_FORCE',
    subject: 'physics',
    grades: ['grade6', 'grade8'],
    ports: [],
    studentPorts: ['Khuyên móc đỉnh', 'Đáy phẳng tiếp xúc'],
    description: 'Chuẩn khối lượng đối chứng, dùng kiểm định cân và tạo tải trọng.',
    studentTip: 'Cầm quả cân ở phần núm trên đỉnh, tránh chạm tay vào thân để không dính mồ hôi làm sai số!',
    mathFormula: 'm_{\\text{ref}} = 50.00 \\pm 0.005\\,\\text{g}',
    sgkFormula: 'Khối lượng chuẩn: m = 50 gam',
    glyphIcon: '🥉'
  },
  {
    id: 'solid-cylinder',
    assetId: 'OL3D-EQP-SLD-0001',
    nameVi: 'Khối trụ đặc hợp kim nhôm',
    nameStudent: 'Khối nhôm hình trụ',
    shortKeyword: 'Khối nhôm',
    nameEn: 'Solid Aluminum Cylinder Specimen',
    category: 'G02_MASS_FORCE',
    subject: 'physics',
    grades: ['grade6', 'grade8'],
    ports: [],
    studentPorts: ['Thân trụ kim loại', 'Quai móc treo'],
    description: 'Mẫu vật khảo sát khối lượng riêng và thể tích chiếm chỗ.',
    studentTip: 'Khối nhôm nhẹ hơn đồng thau, chìm trong nước nhưng chịu lực đẩy Ác-si-mét nâng lên.',
    mathFormula: 'D = \\frac{m}{V} \\approx 2.70\\,\\text{g/cm}^3',
    sgkFormula: 'Khối lượng riêng: D = m / V',
    glyphIcon: '🔩'
  },
  {
    id: 'solid-sphere',
    assetId: 'OL3D-EQP-SPH-0001',
    nameVi: 'Khối bi cầu thép không gỉ',
    nameStudent: 'Viên bi thép tròn',
    shortKeyword: 'Bi thép',
    nameEn: 'Stainless Steel Sphere Specimen',
    category: 'G02_MASS_FORCE',
    subject: 'physics',
    grades: ['grade6', 'grade8'],
    ports: [],
    studentPorts: ['Bề mặt cầu trơn'],
    description: 'Mẫu vật đo thể tích qua đường kính d = 2R và thí nghiệm thả chìm.',
    studentTip: 'Thả nhẹ tay vào ống đong nghiêng để bi trượt xuống từ từ, không làm vỡ đáy thủy tinh!',
    mathFormula: 'V = \\frac{4}{3}\\pi R^3',
    sgkFormula: 'Thể tích: V = 4/3 · 3.14 · R³',
    glyphIcon: '⚪'
  },
  {
    id: 'solid-block',
    assetId: 'OL3D-EQP-BLK-0001',
    nameVi: 'Khối hộp chữ nhật đồng thau',
    nameEn: 'Rectangular Brass Block Specimen',
    nameStudent: 'Khối đồng hình hộp',
    shortKeyword: 'Khối đồng',
    category: 'G02_MASS_FORCE',
    subject: 'physics',
    grades: ['grade6', 'grade8'],
    ports: [],
    studentPorts: ['6 mặt phẳng đồng thau'],
    description: 'Mẫu vật khối lượng riêng lớn, kích thước lớn hơn miệng ống đong.',
    studentTip: 'Khối này to hơn miệng ống đong (chiều ngang 30mm > 28mm), các em phải dùng Bình tràn Eureka nhé!',
    mathFormula: 'V = a \\cdot b \\cdot c',
    sgkFormula: 'V = Dài × Rộng × Cao',
    glyphIcon: '📦'
  },
  {
    id: 'hollow-cylinder',
    assetId: 'OL3D-EQP-HLW-0001',
    nameVi: 'Ống trụ kim loại rỗng khoang kín',
    nameStudent: 'Ống kim loại rỗng ruột',
    shortKeyword: 'Ống rỗng',
    nameEn: 'Hollow Metallic Cylinder',
    category: 'G02_MASS_FORCE',
    subject: 'physics',
    grades: ['grade8'],
    ports: [],
    studentPorts: ['Khoang rỗng bên trong'],
    description: 'Mẫu vật khảo sát vật nổi/chìm và lực đẩy Archimedes.',
    studentTip: 'Mặc dù làm bằng kim loại nhưng có ruột rỗng chứa không khí nên vật có thể nổi trên mặt nước!',
    mathFormula: 'F_A = \\rho_{\\text{nước}} \\cdot g \\cdot V_{\\text{chìm}}',
    sgkFormula: 'Lực đẩy Ac-si-met: F_A = d · V_chìm',
    glyphIcon: '🕳️'
  },
  {
    id: 'spring-dynamometer',
    assetId: 'OL3D-EQP-DYN-0001',
    nameVi: 'Lực kế lò xo ống trụ 5 N',
    nameStudent: 'Lực kế đo độ lớn lực',
    shortKeyword: 'Lực kế 5N',
    nameEn: '5N Tubular Spring Dynamometer',
    category: 'G02_MASS_FORCE',
    subject: 'physics',
    grades: ['grade6', 'grade8'],
    ports: ['CONN_SPRING_DYNO_HOOK'],
    studentPorts: ['Móc treo dưới', 'Vòng cầm trên'],
    description: 'Đo lực kéo đàn hồi và trọng lượng vật treo theo định luật Hooke.',
    studentTip: 'Giữ lực kế thẳng đứng và chỉnh kim về đúng vạch 0 trước khi móc vật nặng.',
    mathFormula: 'F = k \\cdot \\Delta l = m \\cdot g',
    sgkFormula: 'Trọng lượng: P = 10 · m (Newton)',
    glyphIcon: '🪝'
  },

  // G03 - Thời gian, nhiệt độ
  {
    id: 'thermometer',
    assetId: 'OL3D-EQP-THM-0001',
    nameVi: 'Nhiệt kế rượu chia độ -10..110°C',
    nameStudent: 'Nhiệt kế đo nhiệt độ',
    shortKeyword: 'Nhiệt kế',
    nameEn: 'Alcohol Thermometer -10..110°C',
    category: 'G03_TIME_TEMP',
    subject: 'general',
    grades: ['grade6', 'grade7', 'grade8'],
    ports: [],
    studentPorts: ['Bầu cảm ứng nhiệt', 'Ống mao dẫn đỏ'],
    description: 'Cảm ứng nhiệt độ chất lỏng và môi trường phòng lab theo dãn nở nhiệt.',
    studentTip: 'Không để bầu nhiệt kế chạm đáy cốc đang đun để tránh đo sai nhiệt độ của ngọn lửa!',
    mathFormula: '\\Delta V = V_0 \\cdot \\beta \\cdot \\Delta T',
    sgkFormula: 'Nhiệt độ đọc theo mực đỏ (°C)',
    glyphIcon: '🌡️'
  },
  {
    id: 'stopwatch',
    assetId: 'OL3D-EQP-STW-0001',
    nameVi: 'Đồng hồ bấm giây hiện số 0.01 s',
    nameStudent: 'Đồng hồ bấm giây',
    shortKeyword: 'Đồng hồ bấm giây',
    nameEn: 'Digital Precision Stopwatch',
    category: 'G03_TIME_TEMP',
    subject: 'general',
    grades: ['grade6', 'grade7'],
    ports: [],
    studentPorts: ['Nút Start/Stop', 'Nút Reset về 0'],
    description: 'Đo chu kỳ dao động, thời gian rơi tự do và tốc độ phản ứng.',
    studentTip: 'Bấm Start ngay khi bắt đầu hiện tượng và bấm Stop ngay khi kết thúc.',
    mathFormula: 't = t_{\\text{stop}} - t_{\\text{start}}',
    sgkFormula: 'Thời gian: giây (s)',
    glyphIcon: '⏱️'
  },

  // G04 - Thể tích & Dụng cụ thủy tinh
  {
    id: 'graduated-cylinder',
    assetId: 'OL3D-EQP-CYL-0001',
    nameVi: 'Ống đong thủy tinh 100 ml',
    nameStudent: 'Ống đong đo thể tích',
    shortKeyword: 'Ống đong',
    nameEn: '100ml Graduated Cylinder',
    category: 'G04_VOLUMETRIC',
    subject: 'physics',
    grades: ['grade6', 'grade8'],
    ports: ['CONN_CYLINDER_APERTURE'],
    studentPorts: ['Miệng rót trên', 'Vạch chia mililit'],
    description: 'Đo thể tích chất lỏng và vật chìm với đường kính miệng trong 28 mm.',
    studentTip: 'Đọc thể tích tại đáy của mặt khum chất lỏng cong lõm nhé các em!',
    mathFormula: 'V = V_2 - V_1',
    sgkFormula: 'Thể tích vật = Nước dâng lên (V2 - V1)',
    glyphIcon: '🧪'
  },
  {
    id: 'beaker-250',
    assetId: 'OL3D-EQP-BKR-0001',
    nameVi: 'Cốc thủy tinh chịu nhiệt 250 ml',
    nameStudent: 'Cốc thủy tinh 250ml',
    shortKeyword: 'Cốc 250ml',
    nameEn: '250ml Low-Form Beaker',
    category: 'G04_VOLUMETRIC',
    subject: 'general',
    grades: ['grade6', 'grade7', 'grade8', 'grade9'],
    ports: ['CONN_BEAKER_RIM'],
    studentPorts: ['Miệng vòi rót', 'Đáy chịu nhiệt'],
    description: 'Cốc hứng nước, pha hóa chất và thực hiện đun nóng đối lưu.',
    studentTip: 'Cốc thủy tinh khi đun phải đặt trên lưới tản nhiệt amiăng để không bị nứt vỡ.',
    mathFormula: 'V \\approx 250\\,\\text{ml}',
    sgkFormula: 'Dung tích chứa: 250 mL',
    glyphIcon: '🥛'
  },
  {
    id: 'overflow-can',
    assetId: 'OL3D-EQP-OVF-0001',
    nameVi: 'Bình tràn Eureka 250 ml',
    nameStudent: 'Bình tràn Eureka có vòi',
    shortKeyword: 'Bình tràn',
    nameEn: 'Eureka Overflow Can 250ml',
    category: 'G04_VOLUMETRIC',
    subject: 'physics',
    grades: ['grade6', 'grade8'],
    ports: ['CONN_OVERFLOW_CAN_APERTURE', 'CONN_OVERFLOW_CAN_SPOUT'],
    studentPorts: ['Miệng bình thả vật', 'Vòi xả tràn nghiêng'],
    description: 'Đo thể tích các vật không lọt ống đong qua vòi xả tràn nghiêng 30°.',
    studentTip: 'Chờ nước chảy hết qua vòi tràn trước khi thả vật vào, để chỉ hứng đúng lượng nước bị chiếm chỗ!',
    mathFormula: 'V_{\\text{vật}} = V_{\\text{nước tràn}}',
    sgkFormula: 'Vật chìm đẩy nước tràn ra cốc hứng',
    glyphIcon: '🫗'
  },
  {
    id: 'erlenmeyer-flask',
    assetId: 'OL3D-EQP-FLK-0001',
    nameVi: 'Bình tam giác Erlenmeyer 250 ml',
    nameStudent: 'Bình tam giác',
    shortKeyword: 'Bình tam giác',
    nameEn: '250ml Erlenmeyer Flask',
    category: 'G04_VOLUMETRIC',
    subject: 'chemistry',
    grades: ['grade8', 'grade9'],
    ports: [],
    studentPorts: ['Cổ bình thon', 'Đáy rộng'],
    description: 'Bình lắc phản ứng hóa học, chuẩn độ và chứa dung dịch.',
    studentTip: 'Cổ thon giúp các em lắc tròn dung dịch mà không bị bắn hóa chất ra ngoài.',
    mathFormula: 'C_1 V_1 = C_2 V_2',
    sgkFormula: 'Bình pha chế & lắc dung dịch',
    glyphIcon: '⚗️'
  },

  // G05 - Hóa học & Gia nhiệt
  {
    id: 'test-tube',
    assetId: 'OL3D-EQP-TUB-0001',
    nameVi: 'Ống nghiệm thủy tinh chịu nhiệt 150 mm',
    nameStudent: 'Ống nghiệm nhỏ',
    shortKeyword: 'Ống nghiệm',
    nameEn: 'Glass Test Tube 150mm',
    category: 'G05_CHEM_HEATING',
    subject: 'chemistry',
    grades: ['grade7', 'grade8', 'grade9'],
    ports: [],
    studentPorts: ['Miệng ống', 'Đáy tròn chịu nhiệt'],
    description: 'Thực hiện phản ứng định tính hóa học với lượng nhỏ hóa chất.',
    studentTip: 'Khi đun ống nghiệm, luôn hướng miệng ống về nơi không có người!',
    mathFormula: 'v = k[A]^a [B]^b',
    sgkFormula: 'Dụng cụ phản ứng lượng nhỏ',
    glyphIcon: '🧪'
  },
  {
    id: 'alcohol-lamp',
    assetId: 'OL3D-EQP-ALC-0001',
    nameVi: 'Đèn cồn thí nghiệm',
    nameStudent: 'Đèn cồn đốt nóng',
    shortKeyword: 'Đèn cồn',
    nameEn: 'Glass Spirit Alcohol Lamp',
    category: 'G05_CHEM_HEATING',
    subject: 'chemistry',
    grades: ['grade6', 'grade8', 'grade9'],
    ports: [],
    studentPorts: ['Tim bấc đèn', 'Nắp đậy dập lửa'],
    description: 'Nguồn gia nhiệt bằng cồn 90°, nhiệt độ ngọn lửa 600 - 800°C.',
    studentTip: 'Tuyệt đối không thổi bằng miệng! Hãy đậy nắp đèn cồn lại để dập tắt ngọn lửa an toàn.',
    mathFormula: 'Q = m_{\\text{cồn}} \\cdot q_{\\text{cháy}}',
    sgkFormula: 'Nguồn nhiệt đun sôi dung dịch',
    glyphIcon: '🔥'
  },
  {
    id: 'porcelain-dish',
    assetId: 'OL3D-EQP-DSH-0001',
    nameVi: 'Bát sứ chịu nhiệt cô cạn',
    nameStudent: 'Bát sứ cô cạn muối',
    shortKeyword: 'Bát sứ',
    nameEn: 'Porcelain Evaporating Dish',
    category: 'G05_CHEM_HEATING',
    subject: 'chemistry',
    grades: ['grade8'],
    ports: [],
    studentPorts: ['Lòng bát chịu lửa', 'Mỏ rót nhỏ'],
    description: 'Cô đặc dung dịch muối và nung chất rắn ở nhiệt độ cao.',
    studentTip: 'Dùng kẹp gắp bát sứ nóng, không dùng tay trần chạm vào bát sứ vừa đun!',
    mathFormula: 'm_{\\text{muối}} = m_{\\text{sau}} - m_{\\text{bát}}',
    sgkFormula: 'Đun cạn nước thu muối ăn kết tinh',
    glyphIcon: '🥣'
  },
  {
    id: 'separatory-funnel',
    assetId: 'OL3D-EQP-SEP-0001',
    nameVi: 'Phễu chiết quả lê có khóa',
    nameStudent: 'Phễu chiết tách chất lỏng',
    shortKeyword: 'Phễu chiết',
    nameEn: 'Pear-shaped Separatory Funnel',
    category: 'G05_CHEM_HEATING',
    subject: 'chemistry',
    grades: ['grade8'],
    ports: [],
    studentPorts: ['Khóa xả đáy', 'Miệng nạp có nút'],
    description: 'Tách hai chất lỏng không hòa tan có khối lượng riêng khác nhau.',
    studentTip: 'Vặn khóa từ từ để chất lỏng nặng ở dưới chảy hết xuống cốc thì khóa ngay lại!',
    mathFormula: '\\rho_{\\text{dưới}} > \\rho_{\\text{trên}}',
    sgkFormula: 'Tách dầu ăn và nước',
    glyphIcon: '⏳'
  },
  {
    id: 'distillation-flask',
    assetId: 'OL3D-EQP-DST-0001',
    nameVi: 'Bình cầu có nhánh chưng cất 250 ml',
    nameStudent: 'Bình cầu chưng cất',
    shortKeyword: 'Bình cầu',
    nameEn: 'Side-Arm Distillation Flask 250ml',
    category: 'G05_CHEM_HEATING',
    subject: 'chemistry',
    grades: ['grade8', 'grade9'],
    ports: [],
    studentPorts: ['Nhánh dẫn hơi', 'Miệng cắm nhiệt kế'],
    description: 'Chưng cất phân đoạn tách các chất có nhiệt độ sôi khác nhau.',
    studentTip: 'Hơi rượu bay lên nhánh nghiêng gặp lạnh sẽ ngưng tụ thành giọt lỏng chảy ra.',
    mathFormula: 'T_{\\text{boil, 1}} < T_{\\text{boil, 2}}',
    sgkFormula: 'Tách rượu ra khỏi nước bằng nhiệt độ sôi',
    glyphIcon: '🍶'
  },

  // G06 - Quang học & Ánh sáng
  {
    id: 'optical-lamp',
    assetId: 'OL3D-EQP-OLP-0001',
    nameVi: 'Đèn chiếu sáng Halogen quang học',
    nameStudent: 'Đèn chiếu tia sáng',
    shortKeyword: 'Đèn chiếu',
    nameEn: 'Halogen Optical Lamp with Apertures',
    category: 'G06_OPTICS',
    subject: 'physics',
    grades: ['grade7', 'grade9'],
    ports: ['CONN_LAMP_DC_IN_POS', 'CONN_LAMP_DC_IN_NEG', 'CONN_OPTICAL_LAMP_CARRIAGE'],
    studentPorts: ['Cọc cắm dây điện đỏ (+)', 'Cọc cắm dây đen (-)', 'Chân gá ray trượt'],
    description: 'Nguồn phát chùm tia 1, 2, 3 tia song song hoặc phân kỳ, liên động nguồn điện.',
    studentTip: 'Đèn này không có pin bên trong! Bắt buộc phải cắm 2 dây vào Hộp Nguồn và bật công tắc thì đèn mới sáng.',
    mathFormula: 'I(V) = I_0 \\left(\\frac{V}{12}\\right)^{3.5}',
    sgkFormula: 'Nguồn phát 1, 2, 3 tia sáng thẳng',
    glyphIcon: '💡'
  },
  {
    id: 'optical-power-supply',
    assetId: 'OL3D-EQP-PSU-0001',
    nameVi: 'Nguồn điện hạ áp thí nghiệm 3V–12V',
    nameStudent: 'Bộ nguồn điện thí nghiệm',
    shortKeyword: 'Nguồn điện DC',
    nameEn: 'Low-Voltage Lab Power Supply',
    category: 'G06_OPTICS',
    subject: 'physics',
    grades: ['grade8', 'grade9'],
    ports: ['CONN_PSU_DC_OUT_POS', 'CONN_PSU_DC_OUT_NEG'],
    studentPorts: ['Cực dương đỏ (+)', 'Cực âm đen (-)'],
    description: 'Cấp điện áp điều chỉnh an toàn cho đèn halogen qua cáp 4mm.',
    studentTip: 'Vặn núm chọn điện áp về 6V hoặc 12V trước khi bật công tắc nguồn.',
    mathFormula: 'P = U \\cdot I',
    sgkFormula: 'Cung cấp dòng điện an toàn 3V - 12V',
    glyphIcon: '🔋'
  },
  {
    id: 'optical-bench',
    assetId: 'OL3D-EQP-OBN-0001',
    nameVi: 'Giá quang học 90 cm chia vạch mm',
    nameStudent: 'Thanh ray quang học 90cm',
    shortKeyword: 'Ray quang học',
    nameEn: '90cm Graduated Optical Bench Rail',
    category: 'G06_OPTICS',
    subject: 'physics',
    grades: ['grade7', 'grade9'],
    ports: ['CONN_OPTICAL_BENCH_RAIL'],
    studentPorts: ['Rãnh trượt dẫn hướng', 'Thước đo milimet hai bên'],
    description: 'Ray trượt nhôm định hướng đồng trục cho đèn, vật F, thấu kính và màn hứng.',
    studentTip: 'Các thiết bị gắn lên thanh ray này sẽ tự động thẳng hàng cùng độ cao với nhau.',
    mathFormula: 'x \\in [-45, +45]\\,\\text{cm}',
    sgkFormula: 'Thanh ray giữ dụng cụ thẳng hàng',
    glyphIcon: '🛤️'
  },
  {
    id: 'frosted-f-object',
    assetId: 'OL3D-EQP-FOB-0001',
    nameVi: 'Vật sáng kính mờ hình chữ F',
    nameStudent: 'Tấm kính chữ F phát sáng',
    shortKeyword: 'Vật chữ F',
    nameEn: 'Frosted Glass Letter-F Luminous Object',
    category: 'G06_OPTICS',
    subject: 'physics',
    grades: ['grade9'],
    ports: [],
    studentPorts: ['Mặt kính chữ F', 'Đế trượt gắn ray'],
    description: 'Vật phát sáng không đối xứng giúp nhận biết chiều ảnh thật/ảo.',
    studentTip: 'Chữ F có nét trên nét dưới không đối xứng, giúp các em dễ dàng thấy ảnh bị lộn ngược!',
    mathFormula: 'h = 20.0\\,\\text{mm}',
    sgkFormula: 'Vật sáng tạo ảnh (Cao 2 cm)',
    glyphIcon: '🅰️'
  },
  {
    id: 'optical-lens',
    assetId: 'OL3D-EQP-OPT-0001',
    nameVi: 'Thấu kính hội tụ/phân kỳ trên đế trượt',
    nameStudent: 'Thấu kính tạo ảnh',
    shortKeyword: 'Thấu kính',
    nameEn: 'Optical Lens on Rider Saddle',
    category: 'G06_OPTICS',
    subject: 'physics',
    grades: ['grade9'],
    ports: ['CONN_LENS_HOLDER_SOCKET'],
    studentPorts: ['Vành giữ kính tròn', 'Đế trượt khóa ốc'],
    description: 'Tạo ảnh thực và ảo theo phương trình thấu kính Gauss.',
    studentTip: 'Thấu kính hội tụ có rìa mỏng, thấu kính phân kỳ có rìa dày hơn phần giữa.',
    mathFormula: '\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}',
    sgkFormula: '1/f = 1/d + 1/d\' (Tiêu cự f = 10 cm)',
    glyphIcon: '🔍'
  },
  {
    id: 'optical-lens-box',
    assetId: 'OL3D-EQP-LBX-0001',
    nameVi: 'Hộp bộ 6 thấu kính tiêu chuẩn',
    nameStudent: 'Hộp chứa các thấu kính',
    shortKeyword: 'Hộp thấu kính',
    nameEn: 'Storage Box of 6 Standard Lenses',
    category: 'G06_OPTICS',
    subject: 'physics',
    grades: ['grade9'],
    ports: [],
    studentPorts: ['6 ngăn chứa lót nhung'],
    description: 'Chứa các thấu kính f = +5, +10, +15, -10, -20 cm và bản mặt song song.',
    studentTip: 'Cầm mép vành nhựa thấu kính, không chạm tay vào mặt thủy tinh trong suốt.',
    mathFormula: 'D = \\frac{1}{f}',
    sgkFormula: 'Gồm các thấu kính +5cm, +10cm, -10cm',
    glyphIcon: '🧰'
  },
  {
    id: 'optical-screen',
    assetId: 'OL3D-EQP-SCR-0001',
    nameVi: 'Màn chắn hứng ảnh trắng mờ',
    nameStudent: 'Màn hứng ảnh trắng',
    shortKeyword: 'Màn hứng ảnh',
    nameEn: 'Matte White Optical Projection Screen',
    category: 'G06_OPTICS',
    subject: 'physics',
    grades: ['grade9'],
    ports: [],
    studentPorts: ['Mặt phẳng màu trắng mờ', 'Đế trượt trên ray'],
    description: 'Hứng ảnh thật của vật sáng F qua thấu kính hội tụ.',
    studentTip: 'Dịch chuyển màn hứng chậm rãi trên ray cho đến khi thấy chữ F hiện lên nét nhất.',
    mathFormula: 'k = -\\frac{d\'}{d}',
    sgkFormula: 'Màn hứng ảnh thật ngược chiều',
    glyphIcon: '🖥️'
  },
  {
    id: 'laser-source',
    assetId: 'OL3D-EQP-LSR-0001',
    nameVi: 'Nguồn sáng Laser 3 tia song song',
    nameStudent: 'Hộp đèn Laser 3 tia',
    shortKeyword: 'Đèn Laser 3 tia',
    nameEn: '3-Beam Optical Laser Ray Box',
    category: 'G06_OPTICS',
    subject: 'physics',
    grades: ['grade7', 'grade9'],
    ports: [],
    studentPorts: ['3 khe phát tia laser đỏ', 'Công tắc gạt'],
    description: 'Chiếu 3 tia laser hẹp kiểm chứng định luật truyền thẳng và khúc xạ.',
    studentTip: 'Tuyệt đối không nhìn thẳng vào lỗ phát laser hoặc chiếu vào mắt bạn bè!',
    mathFormula: '\\lambda = 650\\,\\text{nm}',
    sgkFormula: 'Phát 3 tia sáng laser song song màu đỏ',
    glyphIcon: '🔴'
  },
  {
    id: 'semicircular-slab',
    assetId: 'OL3D-EQP-SLB-0001',
    nameVi: 'Bản bán trụ thủy tinh & Đĩa chia độ 360°',
    nameStudent: 'Khối bán trụ thủy tinh',
    shortKeyword: 'Bán trụ kính',
    nameEn: 'Semicircular Glass Block & Protractor',
    category: 'G06_OPTICS',
    subject: 'physics',
    grades: ['grade9'],
    ports: [],
    studentPorts: ['Mặt phẳng kính', 'Mặt cong bán nguyệt'],
    description: 'Khảo sát định luật khúc xạ ánh sáng và góc tới hạn phản xạ toàn phần.',
    studentTip: 'Chiếu tia laser vào đúng tâm O của đĩa tròn để quan sát góc khúc xạ r bị gãy khúc!',
    mathFormula: 'n_1 \\sin i = n_2 \\sin r',
    sgkFormula: 'Tia sáng bị gãy khúc khi qua thủy tinh',
    glyphIcon: '🌓'
  },
  {
    id: 'prism',
    assetId: 'OL3D-EQP-PRM-0001',
    nameVi: 'Lăng kính tam giác đều tán sắc',
    nameStudent: 'Lăng kính 7 sắc cầu vồng',
    shortKeyword: 'Lăng kính',
    nameEn: 'Equilateral Glass Dispersion Prism',
    category: 'G06_OPTICS',
    subject: 'physics',
    grades: ['grade9'],
    ports: [],
    studentPorts: ['3 mặt kính tam giác đều', 'Trục xoay giá đỡ'],
    description: 'Tán sắc chùm ánh sáng trắng thành dải 7 màu biến thiên liên tục.',
    studentTip: 'Ánh sáng trắng bị lăng kính tách thành dải màu Cầu Vồng: Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím.',
    mathFormula: 'n_{\\text{tím}} > n_{\\text{đỏ}}',
    sgkFormula: 'Tách ánh sáng trắng thành 7 màu cầu vồng',
    glyphIcon: '🌈'
  },
  {
    id: 'magnifying-glass',
    assetId: 'OL3D-EQP-MAG-0001',
    nameVi: 'Kính lúp cầm tay độ bội giác 5x',
    nameStudent: 'Kính lúp cầm tay',
    shortKeyword: 'Kính lúp',
    nameEn: '5x Handheld Magnifying Glass',
    category: 'G06_OPTICS',
    subject: 'general',
    grades: ['grade6', 'grade7'],
    ports: [],
    studentPorts: ['Tròng kính lồi', 'Tay cầm nhựa'],
    description: 'Quan sát mặt khum chất lỏng, vạch chia nhỏ và tiêu bản sinh học.',
    studentTip: 'Đưa kính lúp gần sát mắt rồi dịch chuyển vật mẫu từ từ để nhìn thấy phóng to rõ nhất.',
    mathFormula: 'G = 5\\times',
    sgkFormula: 'Phóng đại hình ảnh gấp 5 lần',
    glyphIcon: '🔎'
  },

  // G07 - Mạch điện & Cảm ứng
  {
    id: 'galvanometer',
    assetId: 'OL3D-EQP-GLV-0001',
    nameVi: 'Điện kế nhạy vạch 0 ở giữa',
    nameStudent: 'Điện kế nhạy (Kim ở giữa)',
    shortKeyword: 'Điện kế nhạy',
    nameEn: 'Center-Zero Sensitive Galvanometer',
    category: 'G07_ELECTRICITY',
    subject: 'physics',
    grades: ['grade9'],
    ports: [],
    studentPorts: ['Cọc nối dây bên trái', 'Cọc nối dây bên phải'],
    description: 'Phát hiện dòng điện cảm ứng siêu nhỏ và xác định chiều dòng điện.',
    studentTip: 'Khi có dòng điện chạy qua, kim sẽ lệch sang trái hoặc sang phải báo hiệu chiều dòng điện.',
    mathFormula: 'I \\propto \\theta',
    sgkFormula: 'Phát hiện dòng điện cảm ứng siêu nhỏ',
    glyphIcon: '🧭'
  },
  {
    id: 'digital-multimeter',
    assetId: 'OL3D-EQP-DMM-0001',
    nameVi: 'Đồng hồ vạn năng hiện số AC/DC',
    nameStudent: 'Đồng hồ đo điện hiện số',
    shortKeyword: 'Đồng hồ DMM',
    nameEn: 'Digital Multimeter (AC/DC)',
    category: 'G07_ELECTRICITY',
    subject: 'physics',
    grades: ['grade8', 'grade9'],
    ports: [],
    studentPorts: ['Que đo đỏ (+)', 'Que đo đen (COM)'],
    description: 'Đo điện áp, dòng điện và điện trở linh kiện chính xác.',
    studentTip: 'Chọn đúng nấc đo V (Vôn) khi đo nguồn điện, không để nhầm nấc đo điện trở Ω kẻo chập!',
    mathFormula: 'U = I \\cdot R',
    sgkFormula: 'Đo Vôn (V), Ampe (A), Ôm (Ω)',
    glyphIcon: '📟'
  },
  {
    id: 'induction-coil',
    assetId: 'OL3D-EQP-COIL-0001',
    nameVi: 'Cuộn dây dẫn kín kèm 2 LED & Nam châm',
    nameStudent: 'Cuộn dây cảm ứng & Nam châm',
    shortKeyword: 'Cuộn dây & Nam châm',
    nameEn: 'Closed Induction Coil with LEDs & Magnet',
    category: 'G07_ELECTRICITY',
    subject: 'physics',
    grades: ['grade9'],
    ports: [],
    studentPorts: ['Lòng ống cuộn dây', '2 đèn LED đỏ & xanh'],
    description: 'Thực nghiệm cảm ứng điện từ Faraday: nam châm dịch chuyển kích hoạt 2 LED.',
    studentTip: 'Đẩy nam châm vào thì đèn đỏ sáng, rút nam châm ra thì đèn xanh sáng! Nam châm đứng yên thì đèn tắt.',
    mathFormula: '\\mathcal{E} = -N \\frac{\\Delta \\Phi}{\\Delta t}',
    sgkFormula: 'Di chuyển nam châm sinh ra dòng điện',
    glyphIcon: '🧲'
  },

  // G08 - Cơ học
  {
    id: 'lever-balance',
    assetId: 'OL3D-EQP-LEV-0001',
    nameVi: 'Bộ đòn bẩy thăng bằng chia vạch đối xứng',
    nameStudent: 'Thước đòn bẩy thăng bằng',
    shortKeyword: 'Đòn bẩy',
    nameEn: 'Calibrated Lever Balance with Stand',
    category: 'G08_MECHANICS',
    subject: 'physics',
    grades: ['grade8'],
    ports: [],
    studentPorts: ['Trục quay ở giữa', 'Các lỗ treo quả nặng 2 bên'],
    description: 'Khảo sát điều kiện cân bằng đòn bẩy theo quy tắc mômen lực.',
    studentTip: 'Treo quả nặng ở xa trục quay thì cần ít lực hơn để bập bênh thăng bằng!',
    mathFormula: 'F_1 \\cdot d_1 = F_2 \\cdot d_2',
    sgkFormula: 'Quy tắc đòn bẩy: Lực × Khoảng cách = Nhau',
    glyphIcon: '⚖️'
  },
  {
    id: 'communicating-vessels',
    assetId: 'OL3D-EQP-HYD-0001',
    nameVi: 'Bình thông nhau 3 nhánh dị hình',
    nameStudent: 'Bình nước thông nhau 3 nhánh',
    shortKeyword: 'Bình thông nhau',
    nameEn: 'Communicating Vessels 3 Branches',
    category: 'G08_MECHANICS',
    subject: 'physics',
    grades: ['grade8'],
    ports: [],
    studentPorts: ['Ống thẳng', 'Ống phình', 'Ống ngoằn ngoèo'],
    description: 'Chứng minh mặt thoáng chất lỏng cùng độ cao bất kể hình dáng nhánh chứa.',
    studentTip: 'Dù ống có hình dáng to, nhỏ hay cong queo thì khi đứng yên, mực nước ở 3 ống luôn cao bằng nhau!',
    mathFormula: 'p = \\rho \\cdot g \\cdot h',
    sgkFormula: 'Mực nước ở các nhánh luôn cao bằng nhau',
    glyphIcon: '🧪'
  },

  // G09 - Sinh học
  {
    id: 'microscope',
    assetId: 'OL3D-EQP-MIC-0001',
    nameVi: 'Kính hiển vi quang học 3 vật kính DIN',
    nameStudent: 'Kính hiển vi quang học',
    shortKeyword: 'Kính hiển vi',
    nameEn: 'Compound Optical Microscope',
    category: 'G09_BIOLOGY',
    subject: 'biology',
    grades: ['grade6', 'grade9'],
    ports: [],
    studentPorts: ['Ống thị kính nhìn', 'Mâm 3 vật kính 10x, 40x', 'Ốc sơ cấp & vi cấp'],
    description: 'Phóng đại 40x..400x quan sát tế bào sinh học, điều khiển vi cấp & sơ cấp.',
    studentTip: 'Dùng ốc to (sơ cấp) để tìm thấy hình mẫu mờ mờ, sau đó vặn ốc nhỏ (vi cấp) thật khẽ để hình ảnh nét căng!',
    mathFormula: 'M = M_{\\text{thị}} \\times M_{\\text{vật}}',
    sgkFormula: 'Độ phóng đại = Thị kính × Vật kính (Ví dụ: 10 × 40 = 400 lần)',
    glyphIcon: '🔬'
  },
  {
    id: 'dna-model',
    assetId: 'OL3D-EQP-DNA-0001',
    nameVi: 'Mô hình cấu trúc phân tử DNA xoắn kép',
    nameStudent: 'Mô hình xoắn kép DNA',
    shortKeyword: 'Mô hình DNA',
    nameEn: 'Watson-Crick DNA Double Helix Model',
    category: 'G09_BIOLOGY',
    subject: 'biology',
    grades: ['grade9'],
    ports: [],
    studentPorts: ['Trục xoắn 3D', 'Các cặp bazơ A-T, G-X'],
    description: 'Mô hình 3D trực quan hóa nguyên tắc bổ sung A-T, G-X.',
    studentTip: 'Ghi nhớ nguyên tắc bổ sung: Nu loại A luôn ghép đôi với T, Nu loại G luôn ghép đôi với X.',
    mathFormula: 'A + G = T + C',
    sgkFormula: 'Nguyên tắc bổ sung: A nối với T, G nối với X',
    glyphIcon: '🧬'
  },

  // G10 - Nguồn cấp lưu chất
  {
    id: 'water-dispenser',
    assetId: 'OL3D-EQP-WDP-1000',
    nameVi: 'Bình chứa nước có van xả định lượng 1000 ml',
    nameStudent: 'Bình cấp nước sạch có van',
    shortKeyword: 'Bình cấp nước',
    nameEn: 'Water Dispenser Carboy 1000ml',
    category: 'G10_FLUID_SUPPLY',
    subject: 'physics',
    grades: ['grade6', 'grade8'],
    ports: ['CONN_WATER_DISPENSER_SPOUT'],
    studentPorts: ['Vòi xả nước có van vặn'],
    description: 'Cấp nước định lượng vào các bình chứa với lưu lượng 15 ml/s.',
    studentTip: 'Mở van vừa phải để nước không bắn tung tóe ra ngoài mặt bàn thí nghiệm.',
    mathFormula: 'Q = 15.0\\,\\text{ml/s}',
    sgkFormula: 'Bình cung cấp nước làm thí nghiệm',
    glyphIcon: '🚰'
  },
  {
    id: 'retort-stand',
    assetId: 'OL3D-EQP-STD-0001',
    nameVi: 'Giá đỡ thí nghiệm kèm khớp nối & kẹp',
    nameStudent: 'Giá sắt đỡ thí nghiệm',
    shortKeyword: 'Giá thí nghiệm',
    nameEn: 'Laboratory Retort Stand & Clamp',
    category: 'G08_MECHANICS',
    subject: 'general',
    grades: ['grade8', 'grade9'],
    ports: [],
    studentPorts: ['Chân đế gang nặng', 'Cột sắt', 'Tay kẹp có ốc siết'],
    description: 'Giá đỡ giữ cố định phễu chiết, bình cầu, nhiệt kế ở các cao độ khác nhau.',
    studentTip: 'Siết chặt ốc giữ ngàm kẹp để dụng cụ thủy tinh không bị trượt rơi vỡ.',
    mathFormula: 'H \\in [0.1, 0.6]\\,\\text{m}',
    sgkFormula: 'Giữ cố định các dụng cụ trên cao',
    glyphIcon: '📐'
  }
];

// -------------------------------------------------------------
// 2. KHỚP NỐI NƠ-RON (SYNAPSE EDGES) CÓ DIỄN GIẢI HỌC SINH
// -------------------------------------------------------------
export const NEURAL_SYNAPSE_EDGES: NeuralSynapseEdge[] = [
  // Cân điện tử
  {
    id: 'SYN-WGT-BAL',
    source: 'calibration-weight',
    target: 'electronic-balance',
    type: 'mechanical_support',
    connectorId: 'CONN_BALANCE_PAN',
    weight: 0.95,
    signalSpeed: 1.2,
    causalRule: 'Đặt vật lên đĩa cân làm lún mâm cảm biến loadcell, chốt số đo tịnh m_gross',
    studentCausal: 'Đặt quả cân lên đĩa → Màn hình cân hiện đúng số gam 50.00g',
    experimentContext: 'Đo khối lượng chính xác & hiệu chuẩn cân'
  },
  {
    id: 'SYN-CYL-BAL',
    source: 'solid-cylinder',
    target: 'electronic-balance',
    type: 'mechanical_support',
    connectorId: 'CONN_BALANCE_PAN',
    weight: 0.90,
    signalSpeed: 1.2,
    causalRule: 'Truyền khối lượng vật m_Al lên đĩa cân phục vụ xác định khối lượng riêng',
    studentCausal: 'Cân khối nhôm → Biết khối lượng m để tính D = m / V',
    experimentContext: 'Xác định khối lượng riêng của nhôm'
  },
  {
    id: 'SYN-SPH-BAL',
    source: 'solid-sphere',
    target: 'electronic-balance',
    type: 'mechanical_support',
    connectorId: 'CONN_BALANCE_PAN',
    weight: 0.90,
    signalSpeed: 1.2,
    causalRule: 'Truyền khối lượng vật m_thep lên đĩa cân',
    studentCausal: 'Cân viên bi thép → Biết khối lượng vật đặc',
    experimentContext: 'Đo khối lượng mẫu vật hình cầu'
  },
  {
    id: 'SYN-BLK-BAL',
    source: 'solid-block',
    target: 'electronic-balance',
    type: 'mechanical_support',
    connectorId: 'CONN_BALANCE_PAN',
    weight: 0.90,
    signalSpeed: 1.2,
    causalRule: 'Truyền khối lượng đồng thau lên đĩa cân',
    studentCausal: 'Cân khối đồng thau → Hiện khối lượng m',
    experimentContext: 'Đo khối lượng vật hình hộp chữ nhật'
  },
  {
    id: 'SYN-BKR-BAL',
    source: 'beaker-250',
    target: 'electronic-balance',
    type: 'mechanical_support',
    connectorId: 'CONN_BALANCE_PAN',
    weight: 0.85,
    signalSpeed: 1.0,
    causalRule: 'Đặt cốc lên đĩa cân, kích hoạt phím TARE để trừ bì khối lượng vỏ thủy tinh',
    studentCausal: 'Đặt cốc lên rồi bấm nút TARE → Cân về 0.00g để chỉ cân nước bên trong',
    experimentContext: 'Đo khối lượng chất lỏng bằng cách trừ bì'
  },
  {
    id: 'SYN-GCY-BAL',
    source: 'graduated-cylinder',
    target: 'electronic-balance',
    type: 'mechanical_support',
    connectorId: 'CONN_BALANCE_PAN',
    weight: 0.85,
    signalSpeed: 1.0,
    causalRule: 'Cân trực tiếp ống đong chứa nước để xác minh tỷ trọng ρ = 1.0 g/ml',
    studentCausal: 'Cân ống đong có nước → Thấy 1 ml nước nặng đúng 1 gam',
    experimentContext: 'Kiểm chứng khối lượng riêng của nước'
  },
  {
    id: 'SYN-DSH-BAL',
    source: 'porcelain-dish',
    target: 'electronic-balance',
    type: 'mechanical_support',
    connectorId: 'CONN_BALANCE_PAN',
    weight: 0.80,
    signalSpeed: 1.0,
    causalRule: 'Cân bát sứ trước và sau khi cô cạn để tính lượng muối kết tinh',
    studentCausal: 'Cân bát sứ trước và sau khi đun → Biết khối lượng muối thu được',
    experimentContext: 'Xác định khối lượng muối sau khi cô cạn'
  },

  // Ống đong thể tích
  {
    id: 'SYN-CYL-GCY',
    source: 'solid-cylinder',
    target: 'graduated-cylinder',
    type: 'submersion',
    connectorId: 'CONN_CYLINDER_APERTURE',
    weight: 0.95,
    signalSpeed: 1.5,
    causalRule: 'Vật lọt khẩu độ Ø28mm chìm xuống làm dâng cột chất lỏng đúng thể tích V_vật',
    studentCausal: 'Thả khối nhôm chìm vào nước → Cột nước dâng lên đúng bằng thể tích của nhôm',
    experimentContext: 'Đo thể tích vật rắn bằng ống đong'
  },
  {
    id: 'SYN-SPH-GCY',
    source: 'solid-sphere',
    target: 'graduated-cylinder',
    type: 'submersion',
    connectorId: 'CONN_CYLINDER_APERTURE',
    weight: 0.95,
    signalSpeed: 1.5,
    causalRule: 'Bi cầu thép chìm xuống nước đẩy dâng thể tích ΔV',
    studentCausal: 'Thả bi thép vào ống đong → Nước dâng lên để đọc thể tích',
    experimentContext: 'Đo thể tích viên bi hình cầu'
  },

  // Bình tràn Eureka
  {
    id: 'SYN-BLK-OVF',
    source: 'solid-block',
    target: 'overflow-can',
    type: 'submersion',
    connectorId: 'CONN_OVERFLOW_CAN_APERTURE',
    weight: 0.95,
    signalSpeed: 1.6,
    causalRule: 'Vật kích thước > 28mm thả vào bình tràn kích hoạt xả nước qua vòi tràn',
    studentCausal: 'Khối đồng to không vừa ống đong → Thả vào bình tràn làm nước trào qua vòi',
    experimentContext: 'Đo thể tích vật không bỏ lọt ống đong'
  },
  {
    id: 'SYN-OVF-BKR',
    source: 'overflow-can',
    target: 'beaker-250',
    type: 'fluid_spout',
    connectorId: 'CONN_OVERFLOW_CAN_SPOUT',
    weight: 0.90,
    signalSpeed: 1.4,
    causalRule: 'Nước tràn từ vòi bình Eureka chảy vào cốc hứng',
    studentCausal: 'Nước chảy từ vòi bình tràn → Hứng vào cốc thủy tinh',
    experimentContext: 'Hứng nước tràn'
  },
  {
    id: 'SYN-OVF-GCY',
    source: 'overflow-can',
    target: 'graduated-cylinder',
    type: 'fluid_spout',
    connectorId: 'CONN_OVERFLOW_CAN_SPOUT',
    weight: 0.92,
    signalSpeed: 1.4,
    causalRule: 'Nước tràn chảy trực tiếp vào ống đong để đọc chính xác thể tích nước tràn',
    studentCausal: 'Nước tràn chảy thẳng vào ống đong → Đọc ngay thể tích chất lỏng bị chiếm chỗ',
    experimentContext: 'Kiểm chứng định luật Ác-si-mét'
  },

  // Bình cấp nước
  {
    id: 'SYN-WDP-GCY',
    source: 'water-dispenser',
    target: 'graduated-cylinder',
    type: 'fluid_spout',
    connectorId: 'CONN_WATER_DISPENSER_SPOUT',
    weight: 0.90,
    signalSpeed: 1.3,
    causalRule: 'Van xả cấp nước 15 ml/s làm dâng mực nước ống đong',
    studentCausal: 'Vặn van xả nước → Rót nước vào ống đong chuẩn bị thí nghiệm',
    experimentContext: 'Chuẩn bị nước trong ống đong'
  },
  {
    id: 'SYN-WDP-BKR',
    source: 'water-dispenser',
    target: 'beaker-250',
    type: 'fluid_spout',
    connectorId: 'CONN_WATER_DISPENSER_SPOUT',
    weight: 0.90,
    signalSpeed: 1.3,
    causalRule: 'Cấp nước đầy cốc 250ml phục vụ khảo sát lực đẩy Archimedes',
    studentCausal: 'Rót nước sạch vào cốc thủy tinh',
    experimentContext: 'Chuẩn bị cốc nước'
  },
  {
    id: 'SYN-WDP-OVF',
    source: 'water-dispenser',
    target: 'overflow-can',
    type: 'fluid_spout',
    connectorId: 'CONN_WATER_DISPENSER_SPOUT',
    weight: 0.95,
    signalSpeed: 1.3,
    causalRule: 'Nạp nước chạm vòi bình tràn Eureka đạt trạng thái sẵn sàng thí nghiệm',
    studentCausal: 'Đổ nước vào bình tràn cho tới khi nước vừa chớm mấp mé vòi tràn',
    experimentContext: 'Nạp nước đầy bình tràn Eureka'
  },
  {
    id: 'SYN-WDP-HYD',
    source: 'water-dispenser',
    target: 'communicating-vessels',
    type: 'fluid_spout',
    connectorId: 'CONN_WATER_DISPENSER_SPOUT',
    weight: 0.85,
    signalSpeed: 1.1,
    causalRule: 'Rót nước vào bình thông nhau, áp suất phân phối làm mực nước 3 nhánh dâng ngang nhau',
    studentCausal: 'Rót nước vào một ống → Nước tự tràn qua đáy làm 3 ống dâng cao bằng nhau',
    experimentContext: 'Thí nghiệm bình thông nhau'
  },

  // Lực kế lò xo
  {
    id: 'SYN-WGT-DYN',
    source: 'calibration-weight',
    target: 'spring-dynamometer',
    type: 'mechanical_hook',
    connectorId: 'CONN_SPRING_DYNO_HOOK',
    weight: 0.95,
    signalSpeed: 1.4,
    causalRule: 'Trọng lượng vật kéo lò xo giãn đoạn Δl = P / k, hiển thị lực F = 0.5 N',
    studentCausal: 'Móc quả cân 50g vào móc treo → Lò xo giãn ra chỉ đúng 0.5 Newton',
    experimentContext: 'Đo trọng lượng quả cân'
  },
  {
    id: 'SYN-CYL-DYN',
    source: 'solid-cylinder',
    target: 'spring-dynamometer',
    type: 'mechanical_hook',
    connectorId: 'CONN_SPRING_DYNO_HOOK',
    weight: 0.92,
    signalSpeed: 1.4,
    causalRule: 'Treo mẫu trụ nhôm đo trọng lượng trong không khí P_1',
    studentCausal: 'Treo khối nhôm vào lực kế ngoài không khí → Đọc trọng lượng P1',
    experimentContext: 'Bước 1: Đo trọng lượng vật ngoài không khí'
  },
  {
    id: 'SYN-DYN-BKR',
    source: 'spring-dynamometer',
    target: 'beaker-250',
    type: 'buoyancy_force',
    weight: 0.98,
    signalSpeed: 1.7,
    causalRule: 'Nhúng vật đang treo vào nước, lực đẩy F_A làm giảm số chỉ lực kế còn P_2 = P_1 - F_A',
    studentCausal: 'Nhúng vật đang treo vào cốc nước → Lực đẩy Ác-si-mét nâng lên làm lực kế giảm số chỉ P2',
    experimentContext: 'Bước 2: Đo độ lớn lực đẩy Ác-si-mét'
  },

  // Thước cặp
  {
    id: 'SYN-CYL-CAL',
    source: 'solid-cylinder',
    target: 'vernier-caliper',
    type: 'mechanical_clamp',
    connectorId: 'CONN_VERNIER_CALIPER_JAWS',
    weight: 0.90,
    signalSpeed: 1.1,
    causalRule: 'Ngàm kẹp ôm khít mặt ngoài trụ, cố định khoảng cách và hiển thị đường kính d',
    studentCausal: 'Kẹp 2 ngàm vào thân khối nhôm → Đọc đường kính ngoài chính xác đến 0.02mm',
    experimentContext: 'Đo đường kính hình trụ'
  },
  {
    id: 'SYN-SPH-CAL',
    source: 'solid-sphere',
    target: 'vernier-caliper',
    type: 'mechanical_clamp',
    connectorId: 'CONN_VERNIER_CALIPER_JAWS',
    weight: 0.90,
    signalSpeed: 1.1,
    causalRule: 'Kẹp đo đường kính bi cầu để tính thể tích hình cầu lý thuyết',
    studentCausal: 'Kẹp đo đường kính viên bi tròn → Tính thể tích theo hình học',
    experimentContext: 'Đo đường kính viên bi'
  },

  // Hệ quang học
  {
    id: 'SYN-PSU-OLP',
    source: 'optical-power-supply',
    target: 'optical-lamp',
    type: 'electrical_interlock',
    connectorId: 'CONN_PSU_DC_OUT_POS',
    weight: 1.0,
    signalSpeed: 2.0,
    causalRule: 'Khóa liên động điện: Cáp nối 4mm + bật công tắc PSU + bật đèn → tim halogen phát sáng',
    studentCausal: 'Cắm 2 dây điện từ bộ nguồn sang đèn và bật công tắc → Đèn mới sáng được!',
    experimentContext: 'Cấp nguồn thắp sáng đèn thí nghiệm quang học'
  },
  {
    id: 'SYN-OLP-OBN',
    source: 'optical-lamp',
    target: 'optical-bench',
    type: 'mechanical_rail',
    connectorId: 'CONN_OPTICAL_BENCH_RAIL',
    weight: 0.95,
    signalSpeed: 1.2,
    causalRule: 'Đế trượt khóa cao độ quang trục y = 0.125m, cho phép trượt 1D định vị tại -35cm',
    studentCausal: 'Gắn đèn vào thanh ray quang học tại vạch -35 cm',
    experimentContext: 'Gắn đèn lên giá quang học'
  },
  {
    id: 'SYN-FOB-OBN',
    source: 'frosted-f-object',
    target: 'optical-bench',
    type: 'mechanical_rail',
    connectorId: 'CONN_OPTICAL_BENCH_RAIL',
    weight: 0.95,
    signalSpeed: 1.2,
    causalRule: 'Đế mang vật F định vị đồng trục tại -20cm trên ray',
    studentCausal: 'Gắn tấm kính chữ F vào thanh ray tại vạch -20 cm',
    experimentContext: 'Gắn vật sáng F lên giá quang học'
  },
  {
    id: 'SYN-OPT-OBN',
    source: 'optical-lens',
    target: 'optical-bench',
    type: 'mechanical_rail',
    connectorId: 'CONN_OPTICAL_BENCH_RAIL',
    weight: 0.95,
    signalSpeed: 1.2,
    causalRule: 'Đế mang thấu kính định vị tại mốc 0cm của giá quang học',
    studentCausal: 'Gắn thấu kính vào mốc số 0 ở giữa thanh ray',
    experimentContext: 'Cố định thấu kính tại mốc 0'
  },
  {
    id: 'SYN-SCR-OBN',
    source: 'optical-screen',
    target: 'optical-bench',
    type: 'mechanical_rail',
    connectorId: 'CONN_OPTICAL_BENCH_RAIL',
    weight: 0.95,
    signalSpeed: 1.2,
    causalRule: 'Màn hứng ảnh trượt định vị tại +30cm tìm mặt phẳng hứng ảnh rõ nét',
    studentCausal: 'Gắn màn hứng màu trắng vào ray và trượt để tìm ảnh rõ nét',
    experimentContext: 'Tìm ảnh trên màn hứng'
  },
  {
    id: 'SYN-OLP-FOB',
    source: 'optical-lamp',
    target: 'frosted-f-object',
    type: 'optical_alignment',
    weight: 0.98,
    signalSpeed: 1.9,
    causalRule: 'Chùm tia rọi từ đèn xuyên qua kính mờ tạo vật sáng chữ F truyền theo trục quang',
    studentCausal: 'Đèn chiếu sáng rọi qua tấm kính mờ → Tạo thành chữ F phát sáng rực rỡ',
    experimentContext: 'Tạo vật sáng chữ F'
  },
  {
    id: 'SYN-FOB-OPT',
    source: 'frosted-f-object',
    target: 'optical-lens',
    type: 'optical_alignment',
    weight: 0.98,
    signalSpeed: 1.9,
    causalRule: 'Các tia sáng xuất phát từ vật F tới bề mặt thấu kính, bị khúc xạ hội tụ về tiêu diện',
    studentCausal: 'Ánh sáng từ chữ F bay tới thấu kính → Bị bẻ cong hội tụ lại',
    experimentContext: 'Khúc xạ qua thấu kính'
  },
  {
    id: 'SYN-OPT-SCR',
    source: 'optical-lens',
    target: 'optical-screen',
    type: 'optical_alignment',
    weight: 0.98,
    signalSpeed: 1.9,
    causalRule: 'Tia hội tụ giao cắt tạo ảnh thật ngược chiều chữ F trên màn khi d > f',
    studentCausal: 'Các tia sáng hội tụ gặp màn hứng → Tạo ảnh thật lộn ngược chiều của chữ F!',
    experimentContext: 'Thu được ảnh thật trên màn hứng'
  },

  // Khúc xạ & Tán sắc
  {
    id: 'SYN-LSR-SLB',
    source: 'laser-source',
    target: 'semicircular-slab',
    type: 'optical_refraction',
    weight: 0.96,
    signalSpeed: 1.8,
    causalRule: 'Chiếu tia laser vào mặt cong truyền thẳng vào tâm O, khúc xạ tại mặt phẳng theo Snell',
    studentCausal: 'Chiếu tia laser vào khối thủy tinh → Tia sáng bị bẻ gãy góc khi đi ra không khí',
    experimentContext: 'Thí nghiệm khúc xạ ánh sáng'
  },
  {
    id: 'SYN-OLP-PRM',
    source: 'optical-lamp',
    target: 'prism',
    type: 'optical_refraction',
    weight: 0.94,
    signalSpeed: 1.7,
    causalRule: 'Chiếu chùm ánh sáng trắng qua lăng kính bị lệch về phía đáy và tách thành 7 dải màu',
    studentCausal: 'Chiếu chùm ánh sáng trắng qua lăng kính → Tách thành dải màu Cầu Vồng rực rỡ',
    experimentContext: 'Tán sắc ánh sáng qua lăng kính'
  },

  // Điện từ học
  {
    id: 'SYN-COIL-GLV',
    source: 'induction-coil',
    target: 'galvanometer',
    type: 'electromagnetic_induction',
    weight: 0.98,
    signalSpeed: 2.0,
    causalRule: 'Đẩy nam châm vào/rút ra khỏi cuộn dây kín tạo biến thiên từ thông dΦ/dt làm lệch kim điện kế',
    studentCausal: 'Đẩy nhanh nam châm vào cuộn dây → Kim điện kế lập tức lệch sang một bên!',
    experimentContext: 'Hiện tượng cảm ứng điện từ'
  },
  {
    id: 'SYN-PSU-DMM',
    source: 'optical-power-supply',
    target: 'digital-multimeter',
    type: 'electrical_terminal',
    weight: 0.95,
    signalSpeed: 1.5,
    causalRule: 'Cặp que đo VOM đo điện áp thực tế đầu ra của bộ nguồn hạ áp',
    studentCausal: 'Chạm 2 que đo vào cọc nguồn → Màn hình hiện đúng số Vôn (V)',
    experimentContext: 'Đo điện áp nguồn điện'
  },

  // Nhiệt học & Hóa học
  {
    id: 'SYN-ALC-DSH',
    source: 'alcohol-lamp',
    target: 'porcelain-dish',
    type: 'thermal_exchange',
    weight: 0.92,
    signalSpeed: 1.3,
    causalRule: 'Ngọn lửa đèn cồn truyền nhiệt lượng Q vào bát sứ làm bay hơi nước, cô cạn muối',
    studentCausal: 'Ngọn lửa đèn cồn đun sôi bát nước muối → Nước bay hơi hết, để lại hạt muối trắng',
    experimentContext: 'Thực hành cô cạn dung dịch muối ăn'
  },
  {
    id: 'SYN-ALC-DST',
    source: 'alcohol-lamp',
    target: 'distillation-flask',
    type: 'thermal_exchange',
    weight: 0.92,
    signalSpeed: 1.3,
    causalRule: 'Gia nhiệt bình cầu cất đến nhiệt độ sôi của cấu tử nhẹ để thu hồi cất',
    studentCausal: 'Đun nóng bình cầu cất → Rượu sôi trước ở 78°C bay hơi qua ống sinh hàn ngưng tụ',
    experimentContext: 'Chưng cất rượu'
  },
  {
    id: 'SYN-THM-BKR',
    source: 'thermometer',
    target: 'beaker-250',
    type: 'thermal_exchange',
    weight: 0.88,
    signalSpeed: 0.9,
    causalRule: 'Theo dõi sự tăng nhiệt độ chất lỏng trong cốc trong suốt quá trình đun',
    studentCausal: 'Cắm nhiệt kế vào cốc nước đun → Cột màu đỏ dâng dần lên đến 100°C khi nước sôi',
    experimentContext: 'Theo dõi nhiệt độ khi nước sôi'
  },

  // Cơ học & Sinh học
  {
    id: 'SYN-WGT-LEV',
    source: 'calibration-weight',
    target: 'lever-balance',
    type: 'mechanical_support',
    weight: 0.92,
    signalSpeed: 1.2,
    causalRule: 'Treo các quả cân vào các lỗ chia vạch đối xứng khảo sát điều kiện F1.d1 = F2.d2',
    studentCausal: 'Treo quả cân 2 bên trục quay → Điều chỉnh khoảng cách để đòn bẩy nằm ngang thăng bằng',
    experimentContext: 'Quy tắc đòn bẩy thăng bằng'
  },
  {
    id: 'SYN-MIC-DNA',
    source: 'microscope',
    target: 'dna-model',
    type: 'microscopy_dock',
    weight: 0.85,
    signalSpeed: 1.0,
    causalRule: 'Liên kết nhận thức từ quan sát tiêu bản NST hiển vi đến mô hình phân tử DNA 3D',
    studentCausal: 'Soi tế bào dưới kính hiển vi → Nhìn sâu vào nhân thấy nhiễm sắc thể và phân tử DNA',
    experimentContext: 'Tìm hiểu tế bào và DNA di truyền'
  },
  {
    id: 'SYN-STD-SEP',
    source: 'retort-stand',
    target: 'separatory-funnel',
    type: 'mechanical_clamp',
    weight: 0.88,
    signalSpeed: 1.0,
    causalRule: 'Ngàm kẹp giá sắt giữ cố định phễu chiết quả lê thẳng đứng trên cao để hứng chất lỏng',
    studentCausal: 'Kẹp phễu chiết lên giá sắt → Phễu đứng vững trên cao để chất lỏng tách lớp và xả van đáy',
    experimentContext: 'Tách chất lỏng không hòa tan bằng phễu chiết'
  },

  // Ống trụ kim loại rỗng khoang kín (Hollow Cylinder)
  {
    id: 'SYN-HLW-BAL',
    source: 'hollow-cylinder',
    target: 'electronic-balance',
    type: 'mechanical_support',
    connectorId: 'CONN_BALANCE_PAN',
    weight: 0.90,
    signalSpeed: 1.2,
    causalRule: 'Truyền khối lượng mẫu vật rỗng m lên đĩa cân phục vụ so sánh khối lượng riêng với vật đặc',
    studentCausal: 'Đặt ống rỗng lên đĩa cân → Đọc khối lượng m để chứng minh vật rỗng nhẹ hơn nhôm đặc',
    experimentContext: 'Phân biệt vật đặc và vật rỗng'
  },
  {
    id: 'SYN-HLW-GCY',
    source: 'hollow-cylinder',
    target: 'graduated-cylinder',
    type: 'submersion',
    connectorId: 'CONN_CYLINDER_APERTURE',
    weight: 0.95,
    signalSpeed: 1.5,
    causalRule: 'Vật rỗng có khối lượng riêng trung bình nhỏ hơn nước nên nổi một phần trên mặt nước',
    studentCausal: 'Thả ống rỗng vào ống đong → Vật nổi trên mặt nước do ruột rỗng chứa không khí!',
    experimentContext: 'Khảo sát điều kiện vật nổi vật chìm'
  },
  {
    id: 'SYN-HLW-DYN',
    source: 'hollow-cylinder',
    target: 'spring-dynamometer',
    type: 'buoyancy_force',
    connectorId: 'CONN_SPRING_DYNO_HOOK',
    weight: 0.92,
    signalSpeed: 1.4,
    causalRule: 'Treo vật rỗng vào lực kế và nhúng nước: Lực đẩy Archimedes nâng vật làm giảm số chỉ lực kế',
    studentCausal: 'Móc ống rỗng vào lực kế rồi hạ chìm vào nước → Lực kế giảm số chỉ do lực đẩy nâng lên',
    experimentContext: 'Khảo sát lực đẩy Archimedes tác dụng lên vật rỗng'
  },
  {
    id: 'SYN-HLW-OVF',
    source: 'hollow-cylinder',
    target: 'overflow-can',
    type: 'submersion',
    connectorId: 'CONN_OVERFLOW_CAN_APERTURE',
    weight: 0.90,
    signalSpeed: 1.3,
    causalRule: 'Thả vật rỗng vào bình tràn đầy nước, thể tích nước tràn bằng đúng thể tích phần chìm của vật',
    studentCausal: 'Thả vật nổi vào bình tràn → Nước tràn ra đúng bằng phần ngập trong nước',
    experimentContext: 'Nghiệm chứng định luật Archimedes với vật nổi'
  },

  // Thước thẳng 30 cm (Ruler 30cm)
  {
    id: 'SYN-RUL-BLK',
    source: 'ruler-30',
    target: 'solid-block',
    type: 'mechanical_clamp',
    weight: 0.92,
    signalSpeed: 1.2,
    causalRule: 'Đo trực tiếp 3 kích thước chiều dài a, chiều rộng b, chiều cao c của khối hộp chữ nhật',
    studentCausal: 'Dùng thước kẻ đo 3 cạnh của khối đồng → Tính thể tích hình học V = a × b × c',
    experimentContext: 'Xác định thể tích vật rắn bằng kích thước hình học'
  },
  {
    id: 'SYN-RUL-GCY',
    source: 'ruler-30',
    target: 'graduated-cylinder',
    type: 'mechanical_support',
    weight: 0.88,
    signalSpeed: 1.1,
    causalRule: 'Đối chiếu chiều cao cột chất lỏng h với thang chia mililit trên thân ống đong',
    studentCausal: 'Áp thước kẻ vào ống đong → Kiểm tra chiều cao mực nước dâng lên khi thả vật',
    experimentContext: 'Đo chiều cao cột nước'
  },
  {
    id: 'SYN-RUL-SLD',
    source: 'ruler-30',
    target: 'solid-cylinder',
    type: 'mechanical_clamp',
    weight: 0.90,
    signalSpeed: 1.2,
    causalRule: 'Đo chiều cao h và đường kính đáy d của khối trụ để tính thể tích hình học V = π(d/2)^2 h',
    studentCausal: 'Đo chiều cao khối nhôm bằng thước kẻ → Đối chiếu với thể tích dời chỗ nước',
    experimentContext: 'Đối chiếu hai phương pháp đo thể tích'
  },

  // Đồng hồ bấm giây (Stopwatch)
  {
    id: 'SYN-STW-THM',
    source: 'stopwatch',
    target: 'thermometer',
    type: 'thermal_exchange',
    weight: 0.90,
    signalSpeed: 1.3,
    causalRule: 'Đo khoảng thời gian Δt tương ứng với độ tăng nhiệt độ ΔT của chất lỏng để xác định công suất truyền nhiệt',
    studentCausal: 'Bấm giờ sau mỗi 1 phút → Ghi lại nhiệt độ trên nhiệt kế xem nước nóng lên nhanh hay chậm',
    experimentContext: 'Khảo sát sự truyền nhiệt theo thời gian'
  },
  {
    id: 'SYN-STW-ALC',
    source: 'stopwatch',
    target: 'alcohol-lamp',
    type: 'thermal_exchange',
    weight: 0.88,
    signalSpeed: 1.1,
    causalRule: 'Định thời gian đốt nóng để tính nhiệt lượng cung cấp Q = P · t',
    studentCausal: 'Bấm giờ từ lúc châm đèn cồn đến khi nước bắt đầu sôi',
    experimentContext: 'Đo thời gian đun sôi nước'
  },

  // Bình tam giác Erlenmeyer (Erlenmeyer Flask)
  {
    id: 'SYN-FLK-BAL',
    source: 'erlenmeyer-flask',
    target: 'electronic-balance',
    type: 'mechanical_support',
    connectorId: 'CONN_BALANCE_PAN',
    weight: 0.88,
    signalSpeed: 1.1,
    causalRule: 'Đặt bình tam giác lên đĩa cân, nhấn TARE để trừ bì và cân chính xác chất phản ứng',
    studentCausal: 'Đặt bình tam giác lên cân rồi nhấn TARE về 0.00g để cân hóa chất pha dung dịch',
    experimentContext: 'Pha chế dung dịch theo nồng độ'
  },
  {
    id: 'SYN-WDP-FLK',
    source: 'water-dispenser',
    target: 'erlenmeyer-flask',
    type: 'fluid_spout',
    weight: 0.92,
    signalSpeed: 1.2,
    causalRule: 'Mở van bình cấp nước rót nước cất vào bình tam giác phục vụ hòa tan và lắc dung dịch',
    studentCausal: 'Rót nước sạch từ bình cấp vào bình tam giác để hòa tan muối',
    experimentContext: 'Hòa tan và pha chế dung dịch'
  },
  {
    id: 'SYN-SEP-FLK',
    source: 'separatory-funnel',
    target: 'erlenmeyer-flask',
    type: 'fluid_spout',
    weight: 0.94,
    signalSpeed: 1.3,
    causalRule: 'Đặt bình tam giác dưới vòi xả của phễu chiết để hứng phân đoạn chất lỏng nặng hơn',
    studentCausal: 'Đặt bình tam giác dưới phễu chiết → Hứng lớp nước ở dưới chảy ra',
    experimentContext: 'Tách chiết chất lỏng không hòa tan'
  },

  // Ống nghiệm thủy tinh (Test Tube)
  {
    id: 'SYN-ALC-TUB',
    source: 'alcohol-lamp',
    target: 'test-tube',
    type: 'thermal_exchange',
    weight: 0.94,
    signalSpeed: 1.4,
    causalRule: 'Hơ nóng đều đáy ống nghiệm trên ngọn lửa đèn cồn để kích hoạt phản ứng hóa học',
    studentCausal: 'Hơ đều ống nghiệm trên ngọn lửa đèn cồn để đun nóng hóa chất bên trong',
    experimentContext: 'Đun nóng chất lỏng trong ống nghiệm'
  },
  {
    id: 'SYN-STD-TUB',
    source: 'retort-stand',
    target: 'test-tube',
    type: 'mechanical_clamp',
    weight: 0.90,
    signalSpeed: 1.2,
    causalRule: 'Ngàm kẹp gỗ hoặc kẹp sắt của giá đỡ giữ cố định ống nghiệm nghiêng góc 45 độ an toàn',
    studentCausal: 'Kẹp ống nghiệm lên giá sắt nghiêng góc 45° hướng về phía không có người',
    experimentContext: 'Cố định ống nghiệm khi làm phản ứng'
  },
  {
    id: 'SYN-WDP-TUB',
    source: 'water-dispenser',
    target: 'test-tube',
    type: 'fluid_spout',
    weight: 0.88,
    signalSpeed: 1.0,
    causalRule: 'Nhỏ giọt nước cất từ bình cấp vào ống nghiệm làm dung môi hòa tan lượng nhỏ chất mẫu',
    studentCausal: 'Rót một ít nước sạch vào ống nghiệm để thực hiện phản ứng thử',
    experimentContext: 'Thí nghiệm phản ứng ống nghiệm'
  },

  // Hộp bộ 6 thấu kính tiêu chuẩn (Optical Lens Box)
  {
    id: 'SYN-LBX-OPT',
    source: 'optical-lens-box',
    target: 'optical-lens',
    type: 'optical_carrier',
    weight: 0.96,
    signalSpeed: 1.6,
    causalRule: 'Cung cấp các thấu kính hoán đổi (+5cm, +10cm, +15cm, -10cm, -20cm) gá lên đế mang thấu kính',
    studentCausal: 'Lấy thấu kính từ hộp ra để đổi tiêu cự f hoặc đổi sang thấu kính phân kỳ',
    experimentContext: 'Khảo sát thấu kính các tiêu cự khác nhau'
  },
  {
    id: 'SYN-LBX-OBN',
    source: 'optical-lens-box',
    target: 'optical-bench',
    type: 'mechanical_rail',
    weight: 0.88,
    signalSpeed: 1.1,
    causalRule: 'Bố trí hộp thấu kính cạnh thanh ray quang học để bảo quản các mẫu thấu kính tránh trầy xước',
    studentCausal: 'Đặt hộp thấu kính ngay cạnh ray để tiện thay đổi thấu kính khi thực hành',
    experimentContext: 'Bảo quản và hoán đổi phụ kiện quang học'
  },

  // Kính lúp cầm tay 5x (Magnifying Glass 5x)
  {
    id: 'SYN-MAG-GCY',
    source: 'magnifying-glass',
    target: 'graduated-cylinder',
    type: 'optical_alignment',
    weight: 0.92,
    signalSpeed: 1.4,
    causalRule: 'Phóng đại 5 lần thang chia vạch và đáy mặt khum của cột chất lỏng để đọc chính xác thể tích',
    studentCausal: 'Dùng kính lúp soi vạch ống đong → Nhìn rõ từng mililit và đáy mặt khum cong lõm',
    experimentContext: 'Đọc thể tích chính xác qua kính lúp'
  },
  {
    id: 'SYN-MAG-RUL',
    source: 'magnifying-glass',
    target: 'ruler-30',
    type: 'optical_alignment',
    weight: 0.90,
    signalSpeed: 1.3,
    causalRule: 'Phóng đại vạch chia milimet trên thước thẳng để triệt tiêu sai số thị sai (parallax)',
    studentCausal: 'Cầm kính lúp soi vạch chia thước kẻ → Đọc chính xác đến từng milimet',
    experimentContext: 'Đo chiều dài chính xác với kính lúp'
  },
  {
    id: 'SYN-MAG-CAL',
    source: 'magnifying-glass',
    target: 'vernier-caliper',
    type: 'optical_alignment',
    weight: 0.92,
    signalSpeed: 1.4,
    causalRule: 'Phóng đại vạch chia du xích 0.02mm của thước cặp để nhận biết vạch trùng chính xác',
    studentCausal: 'Dùng kính lúp soi vạch trùng trên thước kẹp → Đọc chuẩn xác 0.02 mm',
    experimentContext: 'Đọc vạch du xích thước cặp'
  }
];

// -------------------------------------------------------------
// 3. BÀI THỰC HÀNH CÓ TIẾN TRÌNH TỪNG BƯỚC (STEP-BY-STEP FLOWS)
// -------------------------------------------------------------
export const EXPERIMENT_MACRO_CLUSTERS: ExperimentMacroCluster[] = [
  {
    id: 'EXP-OPTICS-812',
    title: 'Tạo ảnh qua Thấu kính hội tụ (Bài 8.12)',
    subject: 'Quang học',
    grade: 'KHTN 9',
    gradeCode: 'grade9',
    deviceIds: ['optical-power-supply', 'optical-lamp', 'frosted-f-object', 'optical-lens', 'optical-screen', 'optical-bench'],
    description: 'Bố trí các dụng cụ đồng trục trên giá quang học 90cm. Khi d > f, thu được ảnh thật ngược chiều chữ F rõ nét trên màn hứng ảnh.',
    studentGoal: 'Tìm xem ảnh của chữ F khi đi qua kính lồi (thấu kính hội tụ) có đặc điểm gì?',
    coreEquation: '\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}',
    sgkFormula: 'Ảnh thật, ngược chiều với vật khi để vật xa hơn tiêu cự f',
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Lắp thanh ray và cố định thấu kính',
        instruction: 'Đặt thanh ray quang học 90cm lên bàn và gá thấu kính hội tụ (f = 10cm) tại đúng mốc số 0 ở giữa.',
        activeDeviceIds: ['optical-bench', 'optical-lens'],
        activeSynapseIds: ['SYN-OPT-OBN'],
        focusNote: 'Thấu kính nằm chính giữa mốc 0 làm gốc đo khoảng cách.'
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Cấp điện thắp sáng đèn Halogen',
        instruction: 'Gá đèn tại mốc -35cm, cắm 2 dây điện đỏ/đen vào bộ nguồn 12V và bật công tắc nguồn.',
        activeDeviceIds: ['optical-power-supply', 'optical-lamp', 'optical-bench'],
        activeSynapseIds: ['SYN-PSU-OLP', 'SYN-OLP-OBN'],
        focusNote: 'Nhớ kiểm tra cả 2 công tắc: công tắc nguồn và công tắc đèn!'
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Đặt vật sáng chữ F trước thấu kính',
        instruction: 'Gá tấm kính chữ F tại mốc -20cm (cách thấu kính d = 20cm, lớn hơn tiêu cự f = 10cm).',
        activeDeviceIds: ['optical-lamp', 'frosted-f-object', 'optical-lens'],
        activeSynapseIds: ['SYN-OLP-FOB', 'SYN-FOB-OPT'],
        focusNote: 'Khoảng cách d = 20cm > f nên chắc chắn sẽ tạo ra ảnh thật.'
      },
      {
        stepNumber: 4,
        title: 'Bước 4: Trượt màn hứng tìm ảnh rõ nét',
        instruction: 'Gá màn hứng màu trắng phía sau thấu kính và trượt chậm xung quanh mốc +20cm đến +30cm cho đến khi ảnh chữ F nét căng.',
        activeDeviceIds: ['optical-lens', 'optical-screen', 'optical-bench'],
        activeSynapseIds: ['SYN-OPT-SCR', 'SYN-SCR-OBN'],
        focusNote: 'Quan sát thấy ảnh chữ F bị lộn ngược đầu so với vật chữ F ban đầu!'
      }
    ]
  },
  {
    id: 'EXP-ARCHIMEDES',
    title: 'Nghiệm chứng Lực đẩy Ác-si-mét',
    subject: 'Cơ học',
    grade: 'KHTN 8',
    gradeCode: 'grade8',
    deviceIds: ['electronic-balance', 'graduated-cylinder', 'overflow-can', 'spring-dynamometer', 'solid-cylinder', 'beaker-250', 'water-dispenser'],
    description: 'Đo trọng lượng vật trong không khí và khi nhúng chìm trong nước. Chứng minh độ lớn lực đẩy Ác-si-mét đúng bằng trọng lượng phần nước bị vật chiếm chỗ.',
    studentGoal: 'Tại sao khi nhúng một vật vào nước ta lại cảm thấy vật nhẹ hơn?',
    coreEquation: 'F_A = P_{\\text{khí}} - P_{\\text{nước}} = \\rho \\cdot g \\cdot V',
    sgkFormula: 'Độ giảm trọng lượng = Trọng lượng nước tràn ra (F_A = P1 - P2)',
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Đo trọng lượng vật ngoài không khí (P1)',
        instruction: 'Dùng lực kế lò xo móc vào mẫu vật hình trụ nhôm và đọc số chỉ P1 ngoài không khí.',
        activeDeviceIds: ['solid-cylinder', 'spring-dynamometer'],
        activeSynapseIds: ['SYN-CYL-DYN'],
        focusNote: 'Ví dụ số chỉ P1 = 2.0 Newton.'
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Nạp nước đầy bình tràn Eureka',
        instruction: 'Mở van bình cấp nước rót vào bình tràn cho tới khi nước vừa chớm tràn qua vòi xả nghiêng.',
        activeDeviceIds: ['water-dispenser', 'overflow-can'],
        activeSynapseIds: ['SYN-WDP-OVF'],
        focusNote: 'Chờ cho giọt nước cuối cùng ngừng chảy thì đặt cốc hứng dưới miệng vòi.'
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Nhúng vật chìm vào nước và hứng nước tràn',
        instruction: 'Nhúng từ từ vật đang treo trên lực kế vào bình tràn. Đọc số chỉ P2 trên lực kế và hứng toàn bộ nước tràn vào cốc.',
        activeDeviceIds: ['spring-dynamometer', 'solid-cylinder', 'overflow-can', 'beaker-250'],
        activeSynapseIds: ['SYN-DYN-BKR', 'SYN-OVF-BKR'],
        focusNote: 'Số chỉ lực kế giảm xuống còn P2 = 1.3 N (Nhẹ hơn 0.7 N!).'
      },
      {
        stepNumber: 4,
        title: 'Bước 4: Cân lượng nước tràn để đối chiếu',
        instruction: 'Đem cốc nước tràn đặt lên cân điện tử. Khối lượng nước tràn ra có trọng lượng đúng bằng 0.7 N!',
        activeDeviceIds: ['beaker-250', 'electronic-balance'],
        activeSynapseIds: ['SYN-BKR-BAL'],
        focusNote: 'Kết luận: Lực đẩy Ác-si-mét đúng bằng trọng lượng nước bị chiếm chỗ!'
      }
    ]
  },
  {
    id: 'EXP-FARADAY-INDUCTION',
    title: 'Hiện tượng Cảm ứng Điện từ',
    subject: 'Điện từ học',
    grade: 'KHTN 9',
    gradeCode: 'grade9',
    deviceIds: ['induction-coil', 'galvanometer', 'digital-multimeter'],
    description: 'Chuyển động tương đối giữa thanh nam châm và cuộn dây dẫn kín làm biến thiên từ thông, sinh ra dòng điện cảm ứng làm sáng 2 đèn LED đổi màu.',
    studentGoal: 'Làm thế nào để tạo ra dòng điện mà không cần đến pin hay ắc-quy?',
    coreEquation: '\\mathcal{E}_c = -N \\frac{\\Delta \\Phi}{\\Delta t}',
    sgkFormula: 'Di chuyển nam châm gần hoặc xa cuộn dây làm kim điện kế lệch',
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Nối cuộn dây với điện kế nhạy',
        instruction: 'Cắm 2 đầu dây của cuộn cảm vào 2 cọc đo của điện kế vạch 0 ở giữa.',
        activeDeviceIds: ['induction-coil', 'galvanometer'],
        activeSynapseIds: ['SYN-COIL-GLV'],
        focusNote: 'Khi nam châm đứng yên, kim điện kế chỉ số 0 (không có dòng điện).'
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Đẩy nhanh cực Bắc nam châm vào lòng cuộn dây',
        instruction: 'Cầm thanh nam châm đưa nhanh vào trong lòng cuộn dây.',
        activeDeviceIds: ['induction-coil', 'galvanometer'],
        activeSynapseIds: ['SYN-COIL-GLV'],
        focusNote: 'Kim điện kế lập tức lệch sang phải và đèn LED đỏ lóe sáng!'
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Rút thanh nam châm ra khỏi cuộn dây',
        instruction: 'Rút nhanh thanh nam châm ra khỏi cuộn dây theo chiều ngược lại.',
        activeDeviceIds: ['induction-coil', 'galvanometer'],
        activeSynapseIds: ['SYN-COIL-GLV'],
        focusNote: 'Kim điện kế đổi chiều lệch sang trái và đèn LED xanh lóe sáng!'
      }
    ]
  },
  {
    id: 'EXP-CELL-MICROSCOPY',
    title: 'Quan sát Tế bào Kính hiển vi 3D',
    subject: 'Sinh học',
    grade: 'KHTN 6',
    gradeCode: 'grade6',
    deviceIds: ['microscope', 'dna-model', 'magnifying-glass'],
    description: 'Điều chỉnh ốc sơ cấp và vi cấp để hội tụ trường nhìn vào lớp tế bào biểu bì hoặc nhiễm sắc thể, liên hệ cấu trúc vi thể với mô hình DNA.',
    studentGoal: 'Tế bào sinh vật có hình dạng như thế nào dưới độ phóng đại hàng trăm lần?',
    coreEquation: 'M_{\\text{tổng}} = M_{\\text{thị}} \\times M_{\\text{vật}}',
    sgkFormula: 'Độ phóng đại = Thị kính 10x × Vật kính 40x = 400 lần',
    steps: [
      {
        stepNumber: 1,
        title: 'Bước 1: Đặt lam kính tiêu bản lên bàn sa trượt',
        instruction: 'Kẹp lam kính tiêu bản tế bào vào giữa ngàm giữ trên bàn kính hiển vi.',
        activeDeviceIds: ['microscope'],
        activeSynapseIds: [],
        focusNote: 'Căn cho mẫu vật nằm ngay tâm lỗ tròn chiếu sáng bên dưới.'
      },
      {
        stepNumber: 2,
        title: 'Bước 2: Chỉnh ốc sơ cấp (ốc to) lấy nét sơ bộ',
        instruction: 'Vặn ốc sơ cấp từ từ nâng bàn kính lên cho đến khi nhìn thấy hình dạng tế bào mờ mờ.',
        activeDeviceIds: ['microscope'],
        activeSynapseIds: [],
        focusNote: 'Quan sát từ bên ngoài để vật kính không chạm vào vỡ lam kính!'
      },
      {
        stepNumber: 3,
        title: 'Bước 3: Chỉnh ốc vi cấp (ốc nhỏ) làm sắc nét tế bào',
        instruction: 'Vặn nhẹ ốc vi cấp tinh chỉnh để thấy rõ màng tế bào, tế bào chất và nhân tế bào.',
        activeDeviceIds: ['microscope', 'dna-model'],
        activeSynapseIds: ['SYN-MIC-DNA'],
        focusNote: 'Bên trong nhân tế bào chứa nhiễm sắc thể và các chuỗi xoắn kép DNA di truyền!'
      }
    ]
  }
];

export const CATEGORY_META: Record<DeviceCategory, { name: string; studentName: string; color: string; icon: string }> = {
  G01_DIMENSION:    { name: 'G01 · Kích thước & Góc', studentName: 'Dụng cụ Đo chiều dài', color: '#f97316', icon: '📏' },
  G02_MASS_FORCE:   { name: 'G02 · Khối lượng & Lực', studentName: 'Cân & Đo lực', color: '#ef4444', icon: '⚖️' },
  G03_TIME_TEMP:    { name: 'G03 · Thời gian & Nhiệt', studentName: 'Nhiệt kế & Bấm giờ', color: '#eab308', icon: '🌡️' },
  G04_VOLUMETRIC:   { name: 'G04 · Đo Thể tích', studentName: 'Ống đong & Bình chứa', color: '#06b6d4', icon: '🧪' },
  G05_CHEM_HEATING: { name: 'G05 · Hóa học & Gia nhiệt', studentName: 'Đèn cồn & Đun nóng', color: '#ec4899', icon: '🔥' },
  G06_OPTICS:       { name: 'G06 · Quang học', studentName: 'Đèn chiếu & Thấu kính', color: '#8b5cf6', icon: '🔦' },
  G07_ELECTRICITY:  { name: 'G07 · Điện & Cảm ứng', studentName: 'Nguồn điện & Nam châm', color: '#10b981', icon: '⚡' },
  G08_MECHANICS:    { name: 'G08 · Cơ học & Cân bằng', studentName: 'Đòn bẩy & Bình nước', color: '#f59e0b', icon: '⚙️' },
  G09_BIOLOGY:      { name: 'G09 · Sinh học & Vi mô', studentName: 'Kính hiển vi & Tế bào', color: '#22c55e', icon: '🔬' },
  G10_FLUID_SUPPLY: { name: 'G10 · Nguồn Lưu chất', studentName: 'Bình cấp nước sạch', color: '#3b82f6', icon: '🚰' },
};

export const SYNAPSE_META: Record<SynapseKind, { name: string; studentName: string; color: string; dash?: number[] }> = {
  mechanical_support:        { name: 'Đỡ tải cơ học', studentName: 'Đặt lên đĩa cân', color: '#ef4444' },
  mechanical_clamp:          { name: 'Kẹp ôm khít', studentName: 'Kẹp đo kích thước', color: '#f97316' },
  mechanical_hook:           { name: 'Móc treo đàn hồi', studentName: 'Móc treo lực kế', color: '#fb923c', dash: [6, 4] },
  mechanical_rail:           { name: 'Ray trượt 1D', studentName: 'Gắn trượt trên ray', color: '#eab308' },
  optical_carrier:           { name: 'Đế mang quang', studentName: 'Đế trượt quang học', color: '#a78bfa' },
  optical_alignment:         { name: 'Đồng trục truyền quang', studentName: 'Chiếu tia sáng qua', color: '#c084fc', dash: [5, 5] },
  optical_refraction:        { name: 'Khúc xạ & Tán sắc', studentName: 'Bẻ cong tia sáng / Cầu vồng', color: '#e879f9', dash: [4, 4] },
  electrical_terminal:       { name: 'Cọc cắm điện 4mm', studentName: 'Dây cắm nguồn điện', color: '#10b981' },
  electrical_interlock:      { name: 'Liên động nguồn điện', studentName: 'Cắm điện mới sáng đèn', color: '#06b6d4', dash: [8, 3] },
  fluid_spout:               { name: 'Rót / Xả chất lỏng', studentName: 'Nước chảy từ vòi', color: '#3b82f6' },
  fluid_receptacle:          { name: 'Miệng hứng chất lỏng', studentName: 'Hứng nước chảy vào', color: '#60a5fa', dash: [4, 4] },
  submersion:                { name: 'Thả chìm chiếm chỗ', studentName: 'Thả chìm làm dâng nước', color: '#14b8a6', dash: [8, 4] },
  buoyancy_force:            { name: 'Lực đẩy Archimedes', studentName: 'Lực đẩy nước nâng lên', color: '#2dd4bf', dash: [3, 5] },
  electromagnetic_induction: { name: 'Cảm ứng điện từ', studentName: 'Nam châm tạo ra điện', color: '#facc15', dash: [6, 4] },
  thermal_exchange:          { name: 'Truyền nhiệt đối lưu', studentName: 'Đun nóng truyền nhiệt', color: '#f43f5e', dash: [5, 5] },
  microscopy_dock:           { name: 'Gá vi thể hiển vi', studentName: 'Soi mẫu vật tế bào', color: '#4ade80' }
};

