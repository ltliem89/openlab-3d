/**
 * OPENLAB 3D — COGNITIVE EPISTEMIC TOPOLOGY
 * 
 * Kiến trúc Topo Mạng Nơ-ron Tri thức Nhận thức 3 Tầng chuẩn GDPT 2018 & ViSEF
 * Thuyết kiến tạo nhận thức (Constructivism): 
 * Thiết bị vật lý (Tầng 1) -> Biến số thời gian thực (Tầng 2) -> Định luật bừng sáng Eureka (Tầng 3)
 */

export type EpistemicVariableType =
  | 'mass'              // m (g, kg)
  | 'volume'            // V (mL, cm³)
  | 'density'           // ρ (g/cm³, kg/m³)
  | 'voltage'           // U (V)
  | 'current'           // I (A, mA)
  | 'resistance'        // R (Ω)
  | 'force'             // F (N)
  | 'displacement'      // Δl (mm, cm)
  | 'spring_constant'   // k (N/m)
  | 'temperature'       // T (°C)
  | 'heat_quantity'     // Q (J)
  | 'incidence_angle'   // i (độ)
  | 'refraction_angle'  // r (độ)
  | 'refractive_index'; // n

export interface EpistemicVariableTag {
  id: string;                      // Ví dụ: 'VAR_MASS_BAL_0001'
  varType: EpistemicVariableType;
  symbol: string;                  // 'm', 'V', 'U', 'I', 'F', 'ρ'
  symbolLatex: string;             // '$m$', '$V$', '$U$', '$I$'
  nameVi: string;                  // 'Khối lượng', 'Thể tích chất lỏng'
  unitVi: string;                  // 'g', 'mL', 'V', 'A', 'N'
  value: number;                   // Giá trị số học thời gian thực
  formattedValue: string;          // '85.00'
  sourceInstanceId: string;        // ID thiết bị phát sinh biến số
  sourceAssetId: string;
  sourceDeviceNameVi: string;
  
  // Đo lường học ISO GUM
  uncertaintyTypeA: number;        // Sai số ngẫu nhiên
  uncertaintyTypeB: number;        // Sai số dụng cụ (ĐCNN / √3)
  expandedUncertainty: number;     // U (k=2, độ tin cậy 95%)
  isoGumText: string;              // '85.00 ± 0.05 g'
  
  // Trạng thái hiển thị 3D Hologram
  worldPositionM: [number, number, number];
  isActive: boolean;
  isFused: boolean;                // Đã được học sinh kéo thả hợp nhất chưa
}

export type EpistemicLawStatus = 'dormant' | 'synthesizing' | 'discovered';

export interface EpistemicLawDefinition {
  id: string;                      // 'LAW_DENSITY', 'LAW_OHM', 'LAW_ARCHIMEDES', 'LAW_HOOKE', 'LAW_SNELL'
  nameVi: string;                  // 'Định luật Khối lượng riêng'
  formulaLatex: string;            // '$\\rho = \\frac{m}{V}$'
  sgkFormula: string;              // 'D = m / V (Khối lượng riêng = Khối lượng / Thể tích)'
  gradeLevel: 'grade6' | 'grade8' | 'grade9';
  subject: 'physics' | 'chemistry' | 'general';
  requiredVariableTypes: EpistemicVariableType[];
  descriptionVi: string;
  eurekaExplanationVi: string;     // Ý nghĩa bừng sáng Eureka khi học sinh khám phá ra
  audioChimeType: 'eureka_triumph' | 'eureka_magic' | 'circuit_chime';
  status: EpistemicLawStatus;
  discoveredAt?: string;
  calculatedResult?: {
    symbol: string;
    value: number;
    unit: string;
    formatted: string;
  };
}

export interface SocraticMisconception {
  id: string;
  hazardTitleVi: string;
  triggerCondition: 'ammeter_parallel' | 'voltmeter_series' | 'heater_no_protection' | 'lamp_no_power' | 'cylinder_drop_heavy' | 'microscope_near_fire';
  socraticQuestionVi: string;
  options: {
    id: string;
    answerTextVi: string;
    isCorrectUnderstanding: boolean;
    socraticFeedbackVi: string;
    correctiveActionVi: string;
  }[];
  scientificInsightVi: string;
}

// -------------------------------------------------------------
// DANH MỤC 5 ĐỊNH LUẬT BỪNG SÁNG CỐT LÕI (EUREKA LAWS)
// -------------------------------------------------------------
export const EPISTEMIC_LAWS_PRESET: EpistemicLawDefinition[] = [
  {
    id: 'LAW_DENSITY',
    nameVi: 'Định luật Khối lượng riêng',
    formulaLatex: '$\\rho = \\frac{m}{V}$',
    sgkFormula: 'D = m / V (KHTN 6 & 8)',
    gradeLevel: 'grade8',
    subject: 'physics',
    requiredVariableTypes: ['mass', 'volume'],
    descriptionVi: 'Khối lượng riêng của một chất là khối lượng của một đơn vị thể tích chất đó.',
    eurekaExplanationVi: 'Tuyệt vời! Em vừa tự tay hợp nhất Khối lượng (m) và Thể tích (V) thành một hằng số đặc trưng cho bản chất vật liệu: Khối lượng riêng (ρ)! Nhờ đó, em có thể nhận biết chính xác chất liệu là Nhôm, Đồng hay Nước!',
    audioChimeType: 'eureka_triumph',
    status: 'dormant'
  },
  {
    id: 'LAW_OHM',
    nameVi: 'Định luật Ohm cho đoạn mạch',
    formulaLatex: '$I = \\frac{U}{R}$',
    sgkFormula: 'I = U / R (KHTN 9)',
    gradeLevel: 'grade9',
    subject: 'physics',
    requiredVariableTypes: ['voltage', 'current'],
    descriptionVi: 'Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây và tỉ lệ nghịch với điện trở của dây.',
    eurekaExplanationVi: 'Aha! Em vừa khám phá ra định luật nền tảng của điện học: Hiệu điện thế (U) đẩy các electron chuyển động tạo thành Dòng điện (I), và tỉ số U/I chính là Điện trở (R) cản trở dòng điện!',
    audioChimeType: 'circuit_chime',
    status: 'dormant'
  },
  {
    id: 'LAW_ARCHIMEDES',
    nameVi: 'Định luật Lực đẩy Archimedes',
    formulaLatex: '$F_A = \\rho \\cdot g \\cdot V$',
    sgkFormula: 'F_A = d · V (KHTN 8)',
    gradeLevel: 'grade8',
    subject: 'physics',
    requiredVariableTypes: ['volume', 'force'],
    descriptionVi: 'Một vật nhúng trong chất lỏng bị chất lỏng tác dụng một lực đẩy hướng thẳng đứng từ dưới lên trên, có độ lớn bằng trọng lượng phần chất lỏng bị vật chiếm chỗ.',
    eurekaExplanationVi: 'Eureka! Lực đẩy nâng vật lên đúng bằng trọng lượng phần nước bị tràn ra ngoài! Khối lượng riêng của chất lỏng càng lớn thì lực đẩy nâng vật càng mạnh!',
    audioChimeType: 'eureka_magic',
    status: 'dormant'
  },
  {
    id: 'LAW_HOOKE',
    nameVi: 'Định luật Hooke về biến dạng lò xo',
    formulaLatex: '$F = k \\cdot \\Delta l$',
    sgkFormula: 'F = k · Δl (KHTN 8)',
    gradeLevel: 'grade8',
    subject: 'physics',
    requiredVariableTypes: ['force', 'displacement'],
    descriptionVi: 'Trong giới hạn đàn hồi, độ lớn của lực đàn hồi của lò xo tỉ lệ thuận với độ biến dạng của lò xo.',
    eurekaExplanationVi: 'Chính xác! Lực đàn hồi tăng đều đặn theo độ dãn của lò xo. Hệ số góc của đường thẳng đồ thị chính là độ cứng k (N/m) của lò xo!',
    audioChimeType: 'eureka_triumph',
    status: 'dormant'
  },
  {
    id: 'LAW_SNELL',
    nameVi: 'Định luật khúc xạ ánh sáng (Snell)',
    formulaLatex: '$n_1 \\sin(i) = n_2 \\sin(r)$',
    sgkFormula: 'sin(i) / sin(r) = n2 / n1 (KHTN 9)',
    gradeLevel: 'grade9',
    subject: 'physics',
    requiredVariableTypes: ['incidence_angle', 'refraction_angle'],
    descriptionVi: 'Tia khúc xạ nằm trong mặt phẳng tới và ở phía bên kia pháp tuyến so với tia tới. Tỉ số giữa sin góc tới và sin góc khúc xạ là hằng số.',
    eurekaExplanationVi: 'Bừng sáng quy luật quang học! Khi ánh sáng đi từ không khí vào thủy tinh, vận tốc pha bị giảm tốc khiến tia sáng bị bẻ gãy khúc về phía pháp tuyến!',
    audioChimeType: 'eureka_magic',
    status: 'dormant'
  }
];

// -------------------------------------------------------------
// CÂY NGỘ NHẬN SOCRATES (MISCONCEPTION GRAPH)
// -------------------------------------------------------------
export const SOCRATIC_MISCONCEPTIONS_PRESET: SocraticMisconception[] = [
  {
    id: 'MISCONCEPTION_AMMETER_PARALLEL',
    hazardTitleVi: 'CẢNH BÁO NGUY HIỂM: Ampe kế mắc song song với nguồn điện!',
    triggerCondition: 'ammeter_parallel',
    socraticQuestionVi: 'Thầy Socrates nhận thấy em đang mắc Ampe kế song song với nguồn điện hoặc bóng đèn. Em có nhớ Ampe kế có điện trở bên trong (R_A) như thế nào so với bóng đèn không?',
    options: [
      {
        id: 'opt1',
        answerTextVi: 'Ampe kế có điện trở rất lớn, cản trở mọi dòng điện.',
        isCorrectUnderstanding: false,
        socraticFeedbackVi: 'Chưa chính xác! Nếu Ampe kế có điện trở rất lớn, khi mắc nối tiếp để đo dòng, nó sẽ làm tắt ngấm cả mạch điện mất rồi!',
        correctiveActionVi: 'Hãy nhớ lại: Ampe kế được thiết kế có điện trở cực tiểu (R_A ≈ 0 Ω) để không làm ảnh hưởng đến mạch.'
      },
      {
        id: 'opt2',
        answerTextVi: 'Ampe kế có điện trở cực kỳ bé (gần bằng 0 Ω), giống như một sợi dây đồng.',
        isCorrectUnderstanding: true,
        socraticFeedbackVi: 'Rất thông minh! Chính vì điện trở cực bé nên nếu mắc song song với nguồn điện, toàn bộ electron sẽ ào qua Ampe kế gây ra hiện tượng ĐOẢN MẠCH (Short-Circuit), có thể làm cháy nổ thiết bị!',
        correctiveActionVi: 'Quy tắc an toàn: Luôn luôn mắc Ampe kế NỐI TIẾP vào mạch điện, tuyệt đối không mắc song song!'
      },
      {
        id: 'opt3',
        answerTextVi: 'Mắc thế nào cũng được vì đồng hồ điện tử tự điều chỉnh.',
        isCorrectUnderstanding: false,
        socraticFeedbackVi: 'Nguy hiểm! Định luật Ohm I = U/R không biến mất. Khi R ≈ 0, dòng điện I sẽ vọt lên vô cực làm nổ cầu chì bảo vệ.',
        correctiveActionVi: 'Ngắt nguồn điện ngay và chuyển que đo sang mắc nối tiếp.'
      }
    ],
    scientificInsightVi: 'Bản chất vật lý: Ampe kế lý tưởng có $R_A = 0\\,\\Omega$. Theo định luật Ohm, khi mắc song song trực tiếp với hiệu điện thế $U$, dòng điện qua đồng hồ $I = U/R_A \\to \\infty$, dẫn đến nguy cơ cháy cuộn dây và phá hủy linh kiện.'
  },
  {
    id: 'MISCONCEPTION_LAMP_NO_POWER',
    hazardTitleVi: 'Đèn chiếu quang học không phát sáng!',
    triggerCondition: 'lamp_no_power',
    socraticQuestionVi: 'Bóng đèn halogen trên ray quang học vẫn chưa sáng. Theo em, để sợi đốt vonfram phát ra chùm tia sáng trắng, đèn cần điều kiện gì?',
    options: [
      {
        id: 'opt1',
        answerTextVi: 'Chỉ cần gạt công tắc trên thân đèn là đèn tự sáng nhờ pin bên trong.',
        isCorrectUnderstanding: false,
        socraticFeedbackVi: 'Đèn chiếu quang học chuẩn thí nghiệm không chứa pin bên trong để tránh rò rỉ axit và đảm bảo công suất quang học lớn.',
        correctiveActionVi: 'Em hãy kéo Hộp Nguồn điện DC (3V-12V) lên bàn và cắm 2 dây dẫn bắp chuối Ø4mm vào đèn nhé!'
      },
      {
        id: 'opt2',
        answerTextVi: 'Cần nối 2 dây cáp vào Hộp Nguồn điện DC (6V-12V) và bật công tắc nguồn.',
        isCorrectUnderstanding: true,
        socraticFeedbackVi: 'Chính xác! Đèn cần dòng điện khép kín từ Hộp nguồn để cấp hiệu điện thế đủ vượt ngưỡng phát quang (U ≥ 2.5V).',
        correctiveActionVi: 'Bật công tắc nguồn điện để chùm tia sáng chiếu qua các thấu kính!'
      }
    ],
    scientificInsightVi: 'Bản chất mạch kín: Đèn halogen là tải tiêu thụ điện. Cần có nguồn cấp điện áp hiệu dụng $U$ thỏa mãn $P = U \\cdot I$ để nung nóng tim vonfram lên $2500^\\circ\\text{C}$ phát quang phổ liên tục.'
  },
  {
    id: 'MISCONCEPTION_MICROSCOPE_NEAR_FIRE',
    hazardTitleVi: 'CẢNH BÁO: Kính hiển vi đặt quá sát ngọn lửa đèn cồn!',
    triggerCondition: 'microscope_near_fire',
    socraticQuestionVi: 'Khoảng cách giữa ngọn lửa đèn cồn và kính hiển vi hiện dưới 35 cm. Em có biết nhiệt độ ngọn lửa đèn cồn là bao nhiêu và tác động thế nào đến thấu kính quang học không?',
    options: [
      {
        id: 'opt1',
        answerTextVi: 'Ngọn lửa đèn cồn chỉ ấm khoảng 40°C nên không ảnh hưởng gì.',
        isCorrectUnderstanding: false,
        socraticFeedbackVi: 'Sai lầm phổ biến! Ngọn lửa cồn cháy với nhiệt độ từ 600°C đến 800°C!',
        correctiveActionVi: 'Hãy kéo ngay đèn cồn ra xa kính hiển vi tối thiểu 50 cm.'
      },
      {
        id: 'opt2',
        answerTextVi: 'Nhiệt độ ngọn lửa 600-800°C sẽ làm nứt vỡ thấu kính quang học DIN và cháy tiêu bản tế bào.',
        isCorrectUnderstanding: true,
        socraticFeedbackVi: 'Rất chính xác! Các hệ thấu kính quang học được gắn bằng keo quang học Canada Balsam chuyên dụng, nhiệt độ cao sẽ làm chảy keo và rạn nứt thấu kính.',
        correctiveActionVi: 'Giữ đèn cồn cách xa các thiết bị quang học và điện tử ít nhất 50 cm.'
      }
    ],
    scientificInsightVi: 'Nhiệt động học & Vật liệu: Bức xạ nhiệt hồng ngoại từ ngọn lửa đèn cồn ($T \\approx 700^\\circ\\text{C}$) gây ứng suất nhiệt không đồng đều trên thủy tinh thấu kính DIN 58145, dẫn đến nứt vỡ giòn do dãn nở nhiệt bất đối xứng.'
  },
  {
    id: 'MISCONCEPTION_VOLTMETER_SERIES',
    hazardTitleVi: 'CẢNH BÁO: Vôn kế đang mắc nối tiếp vào mạch điện!',
    triggerCondition: 'voltmeter_series',
    socraticQuestionVi: 'Thầy Socrates nhận thấy em đang mắc Vôn kế nối tiếp với bóng đèn tải. Em có nhớ Vôn kế lý tưởng có điện trở trong (R_V) như thế nào không?',
    options: [
      {
        id: 'v_opt1',
        answerTextVi: 'Vôn kế có điện trở rất nhỏ (gần bằng 0 Ω) để dòng điện chạy qua dễ dàng.',
        isCorrectUnderstanding: false,
        socraticFeedbackVi: 'Nhầm lẫn với Ampe kế rồi em! Nếu Vôn kế có R ≈ 0 thì khi mắc song song hai cực nguồn sẽ bị đoản mạch ngay!',
        correctiveActionVi: 'Vôn kế có điện trở cực kỳ lớn (hàng triệu Ohm) để không làm suy giảm dòng điện trong mạch.'
      },
      {
        id: 'v_opt2',
        answerTextVi: 'Vôn kế có điện trở vô cùng lớn (R_V → ∞), nên khi mắc nối tiếp sẽ chặn gần như toàn bộ dòng điện khiến đèn không sáng.',
        isCorrectUnderstanding: true,
        socraticFeedbackVi: 'Tuyệt vời! Do R_V vô cùng lớn nên theo định luật Ohm: I = U / (R_tai + R_V) ≈ 0 A, bóng đèn không thể phát sáng.',
        correctiveActionVi: 'Quy tắc chuẩn: Luôn mắc Vôn kế SONG SONG với hai đầu đoạn mạch hoặc linh kiện cần đo hiệu điện thế!'
      }
    ],
    scientificInsightVi: 'Bản chất mạch điện: Vôn kế lý tưởng có $R_V \\to \\infty$. Mắc nối tiếp sẽ biến mạch thành mạch hở ($I \\approx 0\\text{ A}$), toàn bộ hiệu điện thế nguồn rơi trên hai đầu vôn kế ($U_V \\approx U_{\\text{nguon}}$).'
  },
  {
    id: 'MISCONCEPTION_HEATER_NO_PROTECTION',
    hazardTitleVi: 'CẢNH BÁO NGUY HIỂM: Đun cốc thủy tinh không có lưới tản nhiệt!',
    triggerCondition: 'heater_no_protection',
    socraticQuestionVi: 'Cốc thủy tinh chứa nước đang được đặt trực tiếp lên ngọn lửa đèn cồn mà không có lưới amiăng tản nhiệt. Hiện tượng vật lý gì nguy hiểm có thể xảy ra?',
    options: [
      {
        id: 'h_opt1',
        answerTextVi: 'Không có vấn đề gì vì thủy tinh chịu nhiệt Borosilicate không bao giờ vỡ.',
        isCorrectUnderstanding: false,
        socraticFeedbackVi: 'Nguy hiểm! Dù là thủy tinh Borosilicate chịu nhiệt, việc đốt tập trung vào một điểm nhỏ vẫn gây ứng suất nhiệt cục bộ cực lớn!',
        correctiveActionVi: 'Luôn luôn lót tấm lưới amiăng lên trên kiềng sắt trước khi đặt cốc đun.'
      },
      {
        id: 'h_opt2',
        answerTextVi: 'Nhiệt độ tập trung quá mức tại đáy gây sốc nhiệt và dãn nở không đồng đều, làm nứt vỡ cốc thủy tinh và tràn nước sôi.',
        isCorrectUnderstanding: true,
        socraticFeedbackVi: 'Rất chính xác! Lưới amiăng có vai trò phân tán dòng nhiệt đối lưu đều khắp đáy cốc, triệt tiêu gradient nhiệt độ cục bộ.',
        correctiveActionVi: 'Đặt lưới kim loại / amiăng tản nhiệt lên kiềng sắt trước khi bật ngọn lửa đèn cồn.'
      }
    ],
    scientificInsightVi: 'Nhiệt học & Gradient nhiệt: Thủy tinh dẫn nhiệt kém ($k \\approx 1.2\\text{ W/(m}\\cdot\\text{K)}$). Ngọn lửa điểm tạo chênh lệch nhiệt độ lớn $\\nabla T > 200\\text{ K/cm}$, sinh ứng suất kéo nhiệt $\\sigma = \\frac{E \\alpha \\Delta T}{1 - \\nu}$ vượt quá giới hạn bền uốn gây nứt giòn.'
  },
  {
    id: 'MISCONCEPTION_CYLINDER_DROP_HEAVY',
    hazardTitleVi: 'CẢNH BÁO THAO TÁC: Thả rơi tự do vật nặng vào đáy ống đong!',
    triggerCondition: 'cylinder_drop_heavy',
    socraticQuestionVi: 'Thả rơi tự do một khối kim loại đặc từ miệng ống đong thẳng đứng xuống đáy chứa nước có thể dẫn đến hậu quả gì?',
    options: [
      {
        id: 'c_opt1',
        answerTextVi: 'Nước sẽ giảm xóc hoàn toàn nên thả từ độ cao nào cũng an toàn tuyệt đối.',
        isCorrectUnderstanding: false,
        socraticFeedbackVi: 'Sai lầm! Chiều cao cột nước trong ống đong thí nghiệm chỉ vài xentimét, lực cản nhớt không đủ hãm xung lượng va chạm của khối kim loại nặng!',
        correctiveActionVi: 'Nghiêng ống đong và trượt nhẹ nhàng mẫu vật dọc theo thành ống.'
      },
      {
        id: 'c_opt2',
        answerTextVi: 'Xung lượng va chạm cơ học giữa khối kim loại và đáy thủy tinh sẽ làm vỡ thủng đáy ống đong.',
        isCorrectUnderstanding: true,
        socraticFeedbackVi: 'Thao tác chuẩn phòng thí nghiệm! Luôn nghiêng ống đong khoảng 45° rồi thả nhẹ cho vật trượt từ từ dọc theo thành ống chìm vào nước.',
        correctiveActionVi: 'Nghiêng ống đong 45 độ, cho mẫu vật trượt êm dọc theo thành ống xuống đáy.'
      }
    ],
    scientificInsightVi: 'Cơ học va chạm xung lượng: Khối lượng $m$ rơi tự do độ cao $h$ tích lũy động lượng $p = m \\sqrt{2gh}$. Thời gian va chạm tiếp xúc cứng $\\Delta t \\approx 1\\text{ ms}$ tạo xung lực cực đại $F_{\\text{impact}} = \\frac{\\Delta p}{\\Delta t} \\gg 100\\text{ N}$, phá vỡ ứng suất nén của thủy tinh silicat.'
  }
];
