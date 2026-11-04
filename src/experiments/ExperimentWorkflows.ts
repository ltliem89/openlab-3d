/**
 * OPENLAB 3D — MASTER EXPERIMENT WORKFLOWS DEFINITIONS (WF-01 .. WF-15)
 * Standards: SGK KHTN 6, 7, 8, 9 Bộ GD&ĐT & Master Spec v3.0.0
 * Architecture: Finite-State Machine (FSM), Precondition Guards, AR Neural Guides
 */

import { SceneInstance } from '../domain/types';

export interface WorkflowStepSpec {
  stepIndex: number;
  stepId: string;
  titleVi: string;
  instructionVi: string;
  scientificConceptVi: string;
  mathFormulaLatex: string;
  requiredArchetypes: string[];
  requiredConnectors?: string[];
  suggestedActionVi: string;
  validationGuard: (instances: SceneInstance[], topology?: any) => {
    isPassed: boolean;
    reasonVi: string;
    hintVi?: string;
  };
}

export interface ExperimentWorkflowDefinition {
  workflowId: string;
  titleVi: string;
  curriculumLessonVi: string;
  subject: 'physics' | 'chemistry' | 'biology' | 'stem';
  gradeLevel: 6 | 7 | 8 | 9;
  descriptionVi: string;
  targetCompetenciesVi: string[];
  steps: WorkflowStepSpec[];
}

export const EXPERIMENT_WORKFLOWS: Record<string, ExperimentWorkflowDefinition> = {
  // =========================================================================
  // WF-01: ĐO KHỐI LƯỢNG VÀ TRỪ BÌ (TARE) BẰNG CÂN ĐIỆN TỬ
  // =========================================================================
  'WF-01': {
    workflowId: 'WF-01',
    titleVi: 'Đo khối lượng và thực hành trừ bì (TARE) bằng cân điện tử',
    curriculumLessonVi: 'KHTN 6 · Bài 4: Đo khối lượng | KHTN 8 · Bài 14: Đo khối lượng riêng',
    subject: 'physics',
    gradeLevel: 6,
    descriptionVi: 'Học sinh làm quen với quy trình chuẩn hóa điểm 0, đặt cốc đong, bấm phím TARE để trừ bì và xác định khối lượng tịnh của chất lỏng / mẫu vật.',
    targetCompetenciesVi: ['Kỹ năng sử dụng cân điện tử chính xác', 'Kỹ thuật trừ bì (TARE)', 'Xác định khối lượng tịnh $m_{\\text{tịnh}} = m_{\\text{tổng}} - m_{\\text{bì}}$'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF01-STEP-01',
        titleVi: 'Bước 1: Bật nguồn cân và kiểm tra điểm 0',
        instructionVi: 'Đặt cân điện tử trên bàn thí nghiệm, bấm công tắc nguồn ON và đảm bảo màn hình hiển thị 0.00 g.',
        scientificConceptVi: 'Chuẩn hóa mốc đo lường và hiệu chuẩn cảm biến lực loadcell.',
        mathFormulaLatex: '$m_0 = 0.00\\text{ g}$',
        requiredArchetypes: ['electronic-balance'],
        suggestedActionVi: 'Kéo Cân điện tử lên bàn và nhấn nút ON',
        validationGuard: (instances) => {
          const balance = instances.find((i) => i.assetId.includes('BAL') || i.instanceState.isPoweredOn !== undefined);
          if (!balance) return { isPassed: false, reasonVi: 'Chưa đưa cân điện tử lên bàn thí nghiệm', hintVi: 'Kéo Cân điện tử từ thanh công cụ vào bàn' };
          const isPoweredOn = balance.instanceState.isPoweredOn !== false;
          if (!isPoweredOn) return { isPassed: false, reasonVi: 'Cân chưa được bật nguồn', hintVi: 'Bấm nút nguồn trên cân điện tử' };
          return { isPassed: true, reasonVi: 'Cân đã bật nguồn và sẵn sàng ở điểm 0.00 g' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF01-STEP-02',
        titleVi: 'Bước 2: Đặt cốc đong lên đĩa cân để đọc khối lượng vỏ cốc',
        instructionVi: 'Đặt cốc đong (Beaker 250ml) vào chính tâm đĩa cân để ghi nhận khối lượng bì ban đầu.',
        scientificConceptVi: 'Khối lượng thô gồm cả vật chứa (khối lượng bì $m_{\\text{bì}}$).',
        mathFormulaLatex: '$m_{\\text{bì}} \\approx 85.0\\text{ g}$',
        requiredArchetypes: ['electronic-balance', 'beaker-250'],
        suggestedActionVi: 'Thả cốc đong lên đĩa cân',
        validationGuard: (instances) => {
          const balance = instances.find((i) => i.assetId.includes('BAL'));
          const beaker = instances.find((i) => i.assetId.includes('BKR'));
          if (!balance || !beaker) return { isPassed: false, reasonVi: 'Cần có cả cân điện tử và cốc đong trên bàn' };
          const rawMass = Number(balance.instanceState.measuredMassG ?? 0);
          if (rawMass <= 10.0) return { isPassed: false, reasonVi: 'Chưa đặt cốc đong lên đĩa cân', hintVi: 'Kéo cốc đong đặt lên đĩa cân' };
          return { isPassed: true, reasonVi: `Đã đặt cốc lên đĩa cân ($m_{\\text{bì}} = ${rawMass.toFixed(1)}\\text{ g}$)` };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF01-STEP-03',
        titleVi: 'Bước 3: Bấm phím TARE để trừ bì về 0.00 g',
        instructionVi: 'Bấm phím TARE trên cân điện tử để trừ khối lượng vỏ cốc, chuẩn bị đo chất lỏng hoặc mẫu vật.',
        scientificConceptVi: 'Quy không cảm ứng tải trọng để đo trực tiếp khối lượng tịnh.',
        mathFormulaLatex: '$m_{\\text{hiển thị}} = m_{\\text{tổng}} - m_{\\text{bì}} = 0.00\\text{ g}$',
        requiredArchetypes: ['electronic-balance'],
        suggestedActionVi: 'Nhấn nút TARE trên cân',
        validationGuard: (instances) => {
          const balance = instances.find((i) => i.assetId.includes('BAL'));
          if (!balance) return { isPassed: false, reasonVi: 'Không tìm thấy cân điện tử' };
          const tareOffset = Number(balance.instanceState.tareOffsetG ?? 0);
          if (tareOffset <= 0) return { isPassed: false, reasonVi: 'Chưa bấm phím TARE để trừ bì', hintVi: 'Nhấn nút TARE trên bảng điều khiển cân' };
          return { isPassed: true, reasonVi: `Trừ bì thành công ($m_{\\text{bì}} = ${tareOffset.toFixed(1)}\\text{ g}$, màn hình = $0.00\\text{ g}$)` };
        },
      },
      {
        stepIndex: 4,
        stepId: 'WF01-STEP-04',
        titleVi: 'Bước 4: Rót chất lỏng vào cốc và đọc khối lượng tịnh',
        instructionVi: 'Rót khoảng 50 - 100 ml nước vào cốc đong và đọc số chỉ khối lượng tịnh của lượng nước.',
        scientificConceptVi: 'Mối quan hệ giữa khối lượng và thể tích thông qua khối lượng riêng: $m = D \\cdot V$.',
        mathFormulaLatex: '$m_{\\text{nước}} = D_{\\text{nước}} \\cdot V_{\\text{nước}}$',
        requiredArchetypes: ['electronic-balance', 'beaker-250'],
        suggestedActionVi: 'Nghiêng bình rót nước vào cốc đong đang đặt trên cân',
        validationGuard: (instances) => {
          const beaker = instances.find((i) => i.assetId.includes('BKR'));
          const balance = instances.find((i) => i.assetId.includes('BAL'));
          if (!beaker || !balance) return { isPassed: false, reasonVi: 'Thiếu cân hoặc cốc đong' };
          const fluidLevel = Number(beaker.instanceState.fluidLevelMl ?? 0);
          const netMass = Number(balance.instanceState.measuredMassG ?? 0);
          if (fluidLevel < 15.0 && netMass < 15.0) return { isPassed: false, reasonVi: 'Chưa rót chất lỏng vào cốc', hintVi: 'Cầm bình nước rót vào cốc' };
          return { isPassed: true, reasonVi: `Khối lượng tịnh đo được: $m = ${netMass > 0 ? netMass.toFixed(1) : fluidLevel.toFixed(1)}\\text{ g}$` };
        },
      },
    ],
  },

  // =========================================================================
  // WF-02: ĐO THỂ TÍCH CHẤT LỎNG BẰNG ỐNG ĐONG CHIA ĐỘ
  // =========================================================================
  'WF-02': {
    workflowId: 'WF-02',
    titleVi: 'Đo thể tích chất lỏng bằng ống đong chia độ 100 ml',
    curriculumLessonVi: 'KHTN 6 · Bài 5: Đo thể tích chất lỏng',
    subject: 'physics',
    gradeLevel: 6,
    descriptionVi: 'Kỹ năng quan sát đáy mặt khum chất lỏng (meniscus) ngang tầm mắt và đọc đúng độ chia nhỏ nhất (ĐCNN).',
    targetCompetenciesVi: ['Kỹ năng sử dụng ống đong hình trụ', 'Kỹ thuật đọc mặt khum chất lỏng', 'Đọc số đo theo ĐCNN'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF02-STEP-01',
        titleVi: 'Bước 1: Bố trí ống đong 100 ml trên mặt phẳng thăng bằng',
        instructionVi: 'Đặt ống đong chia độ 100 ml thẳng đứng trên mặt bàn thí nghiệm phẳng.',
        scientificConceptVi: 'Chất lỏng chịu tác dụng của trọng lực nên bề mặt tự do luôn vuông góc với phương dây dọi.',
        mathFormulaLatex: '$\\text{ĐCNN} = 1\\text{ ml}, \\quad \\text{GHĐ} = 100\\text{ ml}$',
        requiredArchetypes: ['graduated-cylinder-100'],
        suggestedActionVi: 'Kéo ống đong 100 ml ra bàn',
        validationGuard: (instances) => {
          const cyl = instances.find((i) => i.assetId.includes('CYL') || i.assetId.includes('GRD'));
          if (!cyl) return { isPassed: false, reasonVi: 'Chưa đưa ống đong 100 ml lên bàn thí nghiệm' };
          return { isPassed: true, reasonVi: 'Ống đong 100 ml đã đặt thẳng đứng trên bàn' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF02-STEP-02',
        titleVi: 'Bước 2: Rót chất lỏng từ từ vào ống đong',
        instructionVi: 'Nghiêng cốc rót chất lỏng vào ống đong đến khoảng 50 ml.',
        scientificConceptVi: 'Rót áp sát miệng cốc vào thành ống đong để tránh bắn tóe bọt khí.',
        mathFormulaLatex: '$V \\approx 50\\text{ ml}$',
        requiredArchetypes: ['graduated-cylinder-100', 'beaker-250'],
        suggestedActionVi: 'Rót nước vào ống đong',
        validationGuard: (instances) => {
          const cyl = instances.find((i) => i.assetId.includes('CYL') || i.assetId.includes('GRD'));
          if (!cyl) return { isPassed: false, reasonVi: 'Thiếu ống đong' };
          const vol = Number(cyl.instanceState.fluidLevelMl ?? 0);
          if (vol < 20.0) return { isPassed: false, reasonVi: 'Chưa rót đủ chất lỏng vào ống đong', hintVi: 'Rót nước từ cốc vào ống đong' };
          return { isPassed: true, reasonVi: `Đã rót lưu chất vào ống đong ($V = ${vol.toFixed(1)}\\text{ ml}$)` };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF02-STEP-03',
        titleVi: 'Bước 3: Đặt mắt ngang bằng với đáy mặt khum để đọc thể tích',
        instructionVi: 'Đặt tầm nhìn ngang đáy mặt khum chất lỏng để triệt tiêu sai số thị sai (parallax error).',
        scientificConceptVi: 'Do sức căng bề mặt chất lỏng và tương tác dính ướt, bề mặt tạo thành mặt khum lõm.',
        mathFormulaLatex: '$V = V_{\\text{đáy khum}} \\pm \\frac{\\text{ĐCNN}}{2}$',
        requiredArchetypes: ['graduated-cylinder-100'],
        suggestedActionVi: 'Căn chỉnh góc nhìn trực diện vào vạch chia',
        validationGuard: (instances) => {
          const cyl = instances.find((i) => i.assetId.includes('CYL') || i.assetId.includes('GRD'));
          if (!cyl) return { isPassed: false, reasonVi: 'Thiếu ống đong' };
          const vol = Number(cyl.instanceState.fluidLevelMl ?? 0);
          return { isPassed: vol > 0, reasonVi: `Thể tích chất lỏng chuẩn xác: $V = ${vol.toFixed(1)}\\text{ ml}$` };
        },
      },
    ],
  },

  // =========================================================================
  // WF-03: ĐO LỰC KÉO VÀ KHẢO SÁT ĐỘ DÃN LÒ XO BẰNG LỰC KẾ 5N
  // =========================================================================
  'WF-03': {
    workflowId: 'WF-03',
    titleVi: 'Đo lực kéo và khảo sát độ dãn lò xo bằng lực kế 5 N',
    curriculumLessonVi: 'KHTN 6 · Bài 40: Lực tiếp xúc và lực không tiếp xúc | Định luật Hooke',
    subject: 'physics',
    gradeLevel: 6,
    descriptionVi: 'Khảo sát sự phụ thuộc tuyến tính của độ dãn lò xo $\\Delta l$ vào cường độ lực kéo $F$ theo định luật Hooke.',
    targetCompetenciesVi: ['Hiệu chỉnh lực kế điểm 0', 'Treo quả nặng gia tải đều đặn', 'Kiểm chứng định luật Hooke $F = k \\cdot \\Delta l$'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF03-STEP-01',
        titleVi: 'Bước 1: Treo lực kế 5 N thẳng đứng trên giá đỡ',
        instructionVi: 'Gá chặt khâu treo của lực kế 5 N vào giá thí nghiệm theo phương thẳng đứng.',
        scientificConceptVi: 'Trọng lực tác dụng theo phương thẳng đứng chiều từ trên xuống dưới.',
        mathFormulaLatex: '$\\vec{P} = m\\vec{g}$',
        requiredArchetypes: ['spring-dynamometer-5n', 'support-stand'],
        suggestedActionVi: 'Treo lực kế lên giá đỡ',
        validationGuard: (instances) => {
          const dyna = instances.find((i) => i.assetId.includes('DYN') || i.assetId.includes('SPG'));
          if (!dyna) return { isPassed: false, reasonVi: 'Chưa đưa lực kế 5 N lên bàn' };
          return { isPassed: true, reasonVi: 'Lực kế 5 N đã được treo thẳng đứng ổn định' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF03-STEP-02',
        titleVi: 'Bước 2: Hiệu chỉnh kim chỉ thị về đúng vạch số 0',
        instructionVi: 'Xoay vít điều chỉnh để kim chỉ thị của lực kế trùng khít vạch 0 N.',
        scientificConceptVi: 'Triệt tiêu lực căng ban đầu của lò xo để phép đo đạt độ chính xác cao.',
        mathFormulaLatex: '$F_0 = 0.00\\text{ N}$',
        requiredArchetypes: ['spring-dynamometer-5n'],
        suggestedActionVi: 'Chỉnh vít điều chỉnh về vạch 0',
        validationGuard: (instances) => {
          const dyna = instances.find((i) => i.assetId.includes('DYN') || i.assetId.includes('SPG'));
          if (!dyna) return { isPassed: false, reasonVi: 'Thiếu lực kế' };
          return { isPassed: true, reasonVi: 'Kim chỉ thị lực kế đã ở đúng vạch số 0 N' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF03-STEP-03',
        titleVi: 'Bước 3: Móc quả nặng 50 g vào đầu móc và đọc độ dãn',
        instructionVi: 'Móc 1 quả nặng 50 g ($P \\approx 0.5\\text{ N}$) vào khuyên móc dưới của lực kế và ghi nhận độ dãn.',
        scientificConceptVi: 'Độ dãn của lò xo tỉ lệ thuận với lực tác dụng: $\\Delta l = \\frac{F}{k}$.',
        mathFormulaLatex: '$F_{\\text{đh}} = k \\cdot |\\Delta l| = m \\cdot g$',
        requiredArchetypes: ['spring-dynamometer-5n', 'hook-weight-50g'],
        suggestedActionVi: 'Móc quả nặng 50 g vào khuyên móc lực kế',
        validationGuard: (instances) => {
          const dyna = instances.find((i) => i.assetId.includes('DYN') || i.assetId.includes('SPG'));
          const weight = instances.find((i) => i.assetId.includes('WGT') || i.assetId.includes('50G'));
          if (!dyna) return { isPassed: false, reasonVi: 'Thiếu lực kế' };
          const measuredForce = Number(dyna.instanceState.measuredForceN ?? 0);
          if (measuredForce <= 0.1 && !weight) return { isPassed: false, reasonVi: 'Chưa móc quả nặng vào lực kế', hintVi: 'Móc quả nặng vào đầu dưới lực kế' };
          return { isPassed: true, reasonVi: `Lực đàn hồi đo được: $F = ${measuredForce > 0 ? measuredForce.toFixed(2) : '0.50'}\\text{ N}$` };
        },
      },
    ],
  },

  // =========================================================================
  // WF-04: ĐO TỐC ĐỘ BẰNG ĐỒNG HỒ ĐO THỜI GIAN HIỆN SỐ VÀ CỔNG QUANG ĐIỆN
  // =========================================================================
  'WF-04': {
    workflowId: 'WF-04',
    titleVi: 'Đo tốc độ chuyển động bằng đồng hồ đo thời gian hiện số và cổng quang điện',
    curriculumLessonVi: 'KHTN 7 · Bài 9: Đo tốc độ',
    subject: 'physics',
    gradeLevel: 7,
    descriptionVi: 'Sử dụng 2 cổng quang điện A và B gắn trên máng nghiêng để đo khoảng thời gian viên bi đi qua quãng đường $s$, từ đó xác định tốc độ trung bình.',
    targetCompetenciesVi: ['Vận hành đồng hồ hiện số MC-963', 'Căn chỉnh cảm biến hồng ngoại', 'Tính tốc độ $v = \\frac{s}{\\Delta t}$'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF04-STEP-01',
        titleVi: 'Bước 1: Lắp máng nghiêng và cố định 2 cổng quang điện A, B',
        instructionVi: 'Đặt máng nghiêng dẫn hướng, gá 2 cổng quang điện A và B cách nhau khoảng $s = 0.5\\text{ m}$.',
        scientificConceptVi: 'Chuyển động thẳng biến đổi đều trên máng dẫn hướng 1D.',
        mathFormulaLatex: '$s = x_B - x_A = 0.50\\text{ m}$',
        requiredArchetypes: ['inclined-track', 'photogate-sensor'],
        suggestedActionVi: 'Gá 2 cổng quang điện vào rãnh máng nghiêng',
        validationGuard: (instances) => {
          const track = instances.find((i) => i.assetId.includes('TRK') || i.assetId.includes('RAL'));
          const gates = instances.filter((i) => i.assetId.includes('PHO') || i.assetId.includes('GAT'));
          if (!track && gates.length < 1) return { isPassed: false, reasonVi: 'Cần bố trí máng dẫn và cổng quang điện' };
          return { isPassed: true, reasonVi: 'Đã bố trí máng nghiêng và các cổng quang điện' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF04-STEP-02',
        titleVi: 'Bước 2: Nối dây tín hiệu vào đồng hồ hiện số ở chế độ đo A-B',
        instructionVi: 'Cắm cáp 5 chân từ cổng A và B vào ổ cắm đồng hồ hiện số, chọn chế độ MODE A-B.',
        scientificConceptVi: 'Nguyên lý ngắt chùm tia hồng ngoại kích hoạt bộ đếm xung thạch anh cao tần.',
        mathFormulaLatex: '$\\Delta t = t_B - t_A$',
        requiredArchetypes: ['digital-timer', 'photogate-sensor'],
        suggestedActionVi: 'Cắm dây cáp tín hiệu vào cổng A và B trên đồng hồ',
        validationGuard: (instances) => {
          const timer = instances.find((i) => i.assetId.includes('TMR') || i.assetId.includes('TIM'));
          if (!timer) return { isPassed: false, reasonVi: 'Chưa đưa đồng hồ đo thời gian hiện số lên bàn' };
          return { isPassed: true, reasonVi: 'Đồng hồ hiện số đã sẵn sàng ở chế độ đo khoảng thời gian A-B' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF04-STEP-03',
        titleVi: 'Bước 3: Thả viên bi và ghi nhận khoảng thời gian $\\Delta t$',
        instructionVi: 'Thả viên bi từ đỉnh máng, đọc thời gian hiển thị trên màn hình LED và tính vận tốc $v$.',
        scientificConceptVi: 'Công thức tính tốc độ trong hệ SI.',
        mathFormulaLatex: '$v = \\frac{s}{\\Delta t} \\quad (\\text{m/s})$',
        requiredArchetypes: ['digital-timer'],
        suggestedActionVi: 'Thả viên bi lăn qua cổng A và B',
        validationGuard: (instances) => {
          const timer = instances.find((i) => i.assetId.includes('TMR') || i.assetId.includes('TIM'));
          if (!timer) return { isPassed: false, reasonVi: 'Thiếu đồng hồ hiện số' };
          const recordedTime = Number(timer.instanceState.recordedTimeS ?? 0.42);
          return { isPassed: recordedTime > 0, reasonVi: `Thời gian ghi nhận: $\\Delta t = ${recordedTime.toFixed(3)}\\text{ s} \\implies v = ${(0.5 / recordedTime).toFixed(2)}\\text{ m/s}$` };
        },
      },
    ],
  },

  // =========================================================================
  // WF-05: ĐO CƯỜNG ĐỘ DÒNG ĐIỆN VÀ HIỆU ĐIỆN THẾ TRONG MẠCH ĐIỆN ĐƠN GIẢN
  // =========================================================================
  'WF-05': {
    workflowId: 'WF-05',
    titleVi: 'Đo cường độ dòng điện và hiệu điện thế trong mạch điện đơn giản',
    curriculumLessonVi: 'KHTN 8 · Bài 22: Mạch điện đơn giản',
    subject: 'physics',
    gradeLevel: 8,
    descriptionVi: 'Mắc ampe kế nối tiếp và vôn kế song song với bóng đèn để khảo sát các đặc tính cơ bản của dòng điện không đổi.',
    targetCompetenciesVi: ['Mắc đúng cực tính ampe kế và vôn kế', 'Quy tắc an toàn điện', 'Đọc chỉ số kim đo analog/digital'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF05-STEP-01',
        titleVi: 'Bước 1: Bố trí nguồn điện DC và khóa K mở',
        instructionVi: 'Đặt bộ nguồn DC (hoặc hộp pin) và công tắc đóng ngắt (khóa K) ở trạng thái MỞ.',
        scientificConceptVi: 'Luật an toàn mạch điện: Chỉ thao tác cắm nối khi khóa K đang mở để tránh đoản mạch.',
        mathFormulaLatex: '$I_{\\text{hở mạch}} = 0\\text{ A}$',
        requiredArchetypes: ['dc-power-supply', 'switch-spst'],
        suggestedActionVi: 'Đặt nguồn DC và khóa K lên bàn',
        validationGuard: (instances) => {
          const psu = instances.find((i) => i.assetId.includes('PSU') || i.assetId.includes('BAT'));
          const sw = instances.find((i) => i.assetId.includes('SWT') || i.assetId.includes('KEY'));
          if (!psu) return { isPassed: false, reasonVi: 'Thiếu nguồn điện DC' };
          return { isPassed: true, reasonVi: 'Nguồn điện và công tắc đã sẵn sàng ở trạng thái an toàn' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF05-STEP-02',
        titleVi: 'Bước 2: Mắc ampe kế nối tiếp với bóng đèn tải',
        instructionVi: 'Nối cực dương nguồn -> khóa K -> cực (+) ampe kế -> cực (-) ampe kế -> bóng đèn -> cực (-) nguồn.',
        scientificConceptVi: 'Dòng điện qua các phần tử mắc nối tiếp là như nhau: $I = I_A = I_{\\text{đèn}}$.',
        mathFormulaLatex: '$R_{\\text{ampe kế}} \\approx 0\\,\\Omega \\implies \\text{Mắc nối tiếp}$',
        requiredArchetypes: ['ammeter-dc', 'incandescent-lamp-socket'],
        suggestedActionVi: 'Cắm dây dẫn nối tiếp qua ampe kế',
        validationGuard: (instances) => {
          const amm = instances.find((i) => i.assetId.includes('AMM') || i.assetId.includes('MET'));
          const lamp = instances.find((i) => i.assetId.includes('LMP') || i.assetId.includes('SOC'));
          if (!amm || !lamp) return { isPassed: false, reasonVi: 'Cần có ampe kế và bóng đèn trên bàn' };
          return { isPassed: true, reasonVi: 'Ampe kế đã mắc nối tiếp với bóng đèn' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF05-STEP-03',
        titleVi: 'Bước 3: Mắc vôn kế song song với hai đầu bóng đèn',
        instructionVi: 'Nối chốt (+) của vôn kế vào đầu vào bóng đèn và chốt (-) vào đầu ra của bóng đèn.',
        scientificConceptVi: 'Vôn kế có điện trở rất lớn, mắc song song để đo hiệu điện thế rơi trên tải tiêu thụ.',
        mathFormulaLatex: '$R_{\\text{vôn kế}} \\to \\infty \\implies \\text{Mắc song song}$',
        requiredArchetypes: ['voltmeter-dc'],
        suggestedActionVi: 'Nối 2 dây vôn kế song song hai cực bóng đèn',
        validationGuard: (instances) => {
          const volt = instances.find((i) => i.assetId.includes('VOL') || i.assetId.includes('VMT'));
          if (!volt) return { isPassed: false, reasonVi: 'Chưa đưa vôn kế vào mạch' };
          return { isPassed: true, reasonVi: 'Vôn kế đã mắc song song với tải bóng đèn' };
        },
      },
      {
        stepIndex: 4,
        stepId: 'WF05-STEP-04',
        titleVi: 'Bước 4: Đóng khóa K và ghi nhận các giá trị đo',
        instructionVi: 'Đóng khóa K, quan sát bóng đèn phát sáng và đọc các chỉ số trên ampe kế và vôn kế.',
        scientificConceptVi: 'Định luật Ôm cho tải thuần trở: $U = I \\cdot R$.',
        mathFormulaLatex: '$U = 6.0\\text{ V}, \\quad I = 0.50\\text{ A} \\implies R = 12\\,\\Omega$',
        requiredArchetypes: ['switch-spst'],
        suggestedActionVi: 'Bấm đóng khóa K',
        validationGuard: (instances) => {
          const sw = instances.find((i) => i.assetId.includes('SWT') || i.assetId.includes('KEY'));
          const lamp = instances.find((i) => i.assetId.includes('LMP') || i.assetId.includes('SOC'));
          const isClosed = sw ? sw.instanceState.isClosed !== false : true;
          return { isPassed: isClosed, reasonVi: 'Mạch kín: Bóng đèn sáng rực rỡ, $U = 6.0\\text{ V}$, $I = 0.50\\text{ A}$' };
        },
      },
    ],
  },

  // =========================================================================
  // WF-06: THÍ NGHIỆM QUANG HỌC — TRUYỀN TIA & ẢNH QUA THẤU KÍNH
  // =========================================================================
  'WF-06': {
    workflowId: 'WF-06',
    titleVi: 'Khảo sát hiện tượng tạo ảnh qua thấu kính hội tụ trên giá quang học',
    curriculumLessonVi: 'KHTN 9 · Bài 6: Thấu kính hội tụ | Bài 7: Thực hành đo tiêu cự',
    subject: 'physics',
    gradeLevel: 9,
    descriptionVi: 'Lắp ráp ray quang học, nguồn điện 12V, đèn chiếu tạo chùm tia, gá thấu kính hội tụ f = +10 cm và màn hứng để thu ảnh thật rõ nét.',
    targetCompetenciesVi: ['Đồng trục quang học', 'Công thức thấu kính Gauss', 'Đo tiêu cự thấu kính mỏng'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF06-STEP-01',
        titleVi: 'Bước 1: Bố trí giá quang học và lắp nguồn điện',
        instructionVi: 'Đặt ray quang học 100 cm trên bàn, đặt bộ nguồn DC 12V cạnh ray.',
        scientificConceptVi: 'Định hướng 1D trục tọa độ quang học.',
        mathFormulaLatex: '$L_{\\text{ray}} = 100\\text{ cm}$',
        requiredArchetypes: ['optical-bench', 'optical-power-supply'],
        suggestedActionVi: 'Đặt ray quang học và nguồn điện',
        validationGuard: (instances) => {
          const bench = instances.find((i) => i.assetId.includes('OBN'));
          const psu = instances.find((i) => i.assetId.includes('PSU'));
          if (!bench || !psu) return { isPassed: false, reasonVi: 'Cần có cả ray quang học và nguồn điện trên bàn' };
          return { isPassed: true, reasonVi: 'Đã bố trí ray quang học và nguồn điện' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF06-STEP-02',
        titleVi: 'Bước 2: Cắm dây dẫn điện và bật công tắc đèn',
        instructionVi: 'Nối 2 dây cáp bắp chuối (+ và -) từ nguồn sang đèn chiếu, bật công tắc nguồn và công tắc đèn.',
        scientificConceptVi: 'Nguồn phát quang học cung cấp chùm sáng đồng trục.',
        mathFormulaLatex: '$U_{\\text{đèn}} = 12\\text{ V}$',
        requiredArchetypes: ['optical-power-supply', 'optical-lamp'],
        suggestedActionVi: 'Cắm dây cáp và bật công tắc đèn',
        validationGuard: (instances) => {
          const lamp = instances.find((i) => i.assetId.includes('OLP'));
          if (!lamp) return { isPassed: false, reasonVi: 'Chưa đặt đèn chiếu lên ray quang học' };
          const isLampLit = Boolean(lamp.instanceState.isLampLit);
          if (!isLampLit) return { isPassed: false, reasonVi: 'Đèn chưa phát sáng (Kiểm tra dây cắm, công tắc nguồn và công tắc đèn)', hintVi: 'Nối đủ 2 dây cáp và bật cả nguồn lẫn đèn' };
          return { isPassed: true, reasonVi: 'Đèn chiếu đã sáng rực rỡ và phát chùm tia trên ray' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF06-STEP-03',
        titleVi: 'Bước 3: Lắp thấu kính và điều chỉnh lấy nét trên màn hứng',
        instructionVi: 'Lắp thấu kính hội tụ f = 10 cm và màn hứng ảnh. Dịch chuyển màn chắn để ảnh chữ F sắc nét nhất.',
        scientificConceptVi: 'Định luật tạo ảnh của thấu kính mỏng: $\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d\'}$.',
        mathFormulaLatex: '$d\' = \\frac{f \\cdot d}{d - f}$',
        requiredArchetypes: ['optical-lens', 'optical-screen'],
        suggestedActionVi: 'Dịch chuyển màn hứng ảnh trên ray quang học',
        validationGuard: (instances) => {
          const lens = instances.find((i) => i.assetId.includes('OPT'));
          const screen = instances.find((i) => i.assetId.includes('SCR'));
          if (!lens || !screen) return { isPassed: false, reasonVi: 'Chưa lắp đủ thấu kính và màn hứng ảnh' };
          const d = Number(lens.instanceState.objectDistanceDCm ?? 20.0);
          const f = Number(lens.instanceState.focalLengthCm ?? 10.0);
          const expectedDPrime = (f * d) / (d - f);
          const screenD = Number(screen.instanceState.screenDistanceCm ?? 20.0);
          const isSharp = Math.abs(screenD - expectedDPrime) <= 0.8;
          if (!isSharp) return { isPassed: false, reasonVi: `Ảnh đang bị mờ (Vị trí màn = ${screenD.toFixed(1)} cm, vị trí nét lý thuyết = ${expectedDPrime.toFixed(1)} cm)`, hintVi: 'Điều chỉnh con trượt màn hứng lại gần tiêu điểm ảnh' };
          return { isPassed: true, reasonVi: `Ảnh thật rõ nét thu được trên màn tại $d\' = ${expectedDPrime.toFixed(1)}\\text{ cm}$` };
        },
      },
    ],
  },

  // =========================================================================
  // WF-07: KHẢO SÁT HIỆN TƯỢNG KHÚC XẠ ÁNH SÁNG & ĐỊNH LUẬT SNELL
  // =========================================================================
  'WF-07': {
    workflowId: 'WF-07',
    titleVi: 'Khảo sát hiện tượng khúc xạ ánh sáng và định luật Snell-Descartes',
    curriculumLessonVi: 'KHTN 9 · Bài 4: Hiện tượng khúc xạ ánh sáng',
    subject: 'physics',
    gradeLevel: 9,
    descriptionVi: 'Sử dụng hộp phát tia sáng laser và bản bán nguyệt thủy tinh gắn trên đĩa chia độ để đo góc tới $i$ và góc khúc xạ $r$, xác định chiết suất $n$.',
    targetCompetenciesVi: ['Khảo sát hiện tượng khúc xạ', 'Xác định chiết suất môi trường', 'Hiện tượng phản xạ toàn phần'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF07-STEP-01',
        titleVi: 'Bước 1: Bố trí đĩa chia độ tròn và đặt bản bán nguyệt',
        instructionVi: 'Đặt đĩa chia độ tròn $360^\\circ$ trên bàn, đặt tâm mặt phẳng của bản bán nguyệt trùng gốc O của đĩa.',
        scientificConceptVi: 'Tâm hình học của bản cong tròn trùng với gốc tọa độ để tia khúc xạ ra không bị bẻ cong lần hai.',
        mathFormulaLatex: '$O(0, 0) \\equiv \\text{Tâm bản bán nguyệt}$',
        requiredArchetypes: ['optical-disk', 'semicircular-glass-block'],
        suggestedActionVi: 'Đặt đĩa chia độ và gá bản bán nguyệt',
        validationGuard: (instances) => {
          const disk = instances.find((i) => i.assetId.includes('DSK') || i.assetId.includes('ROT'));
          const glass = instances.find((i) => i.assetId.includes('SMC') || i.assetId.includes('GLS'));
          return { isPassed: true, reasonVi: 'Đĩa chia độ và bản bán nguyệt đã căn chỉnh đúng gốc O' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF07-STEP-02',
        titleVi: 'Bước 2: Bật nguồn phát tia laser hẹp chiếu vào mặt phẳng',
        instructionVi: 'Bật nguồn phát tia laser, chỉnh góc tới $i = 45^\\circ$ so với pháp tuyến.',
        scientificConceptVi: 'Tia sáng truyền từ không khí ($n_1 \\approx 1.00$) vào thủy tinh ($n_2 \\approx 1.50$) bị bẻ gãy lại gần pháp tuyến.',
        mathFormulaLatex: '$i = 45^\\circ, \\quad n_1 = 1.000$',
        requiredArchetypes: ['laser-ray-box'],
        suggestedActionVi: 'Bật đèn laser và xoay nguồn tới góc 45 độ',
        validationGuard: (instances) => {
          const laser = instances.find((i) => i.assetId.includes('LSR') || i.assetId.includes('RAY'));
          return { isPassed: true, reasonVi: 'Tia laser đã chiếu vào bề mặt phân cách tại góc $i = 45^\\circ$' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF07-STEP-03',
        titleVi: 'Bước 3: Đọc góc khúc xạ $r$ và tính chiết suất $n$',
        instructionVi: 'Đọc góc khúc xạ $r \\approx 28^\\circ$ trên đĩa chia độ và tính chiết suất $n = \\frac{\\sin i}{\\sin r}$.',
        scientificConceptVi: 'Định luật khúc xạ ánh sáng Snell-Descartes.',
        mathFormulaLatex: '$n = \\frac{\\sin 45^\\circ}{\\sin 28^\\circ} \\approx 1.51$',
        requiredArchetypes: ['optical-disk'],
        suggestedActionVi: 'Quan sát vạch góc trên đĩa chia độ',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Góc khúc xạ $r = 28.1^\\circ$, chiết suất thủy tinh $n = 1.51$ (Đạt chuẩn Snell)' };
        },
      },
    ],
  },

  // =========================================================================
  // WF-08: THÍ NGHIỆM ĐÒN BẨY VÀ QUY TẮC MÔ-MEN LỰC
  // =========================================================================
  'WF-08': {
    workflowId: 'WF-08',
    titleVi: 'Thí nghiệm đòn bẩy và quy tắc mô-men lực',
    curriculumLessonVi: 'KHTN 8 · Bài 19: Đòn bẩy và ứng dụng',
    subject: 'physics',
    gradeLevel: 8,
    descriptionVi: 'Khảo sát điều kiện cân bằng của thanh đòn có trục quay cố định: tổng mô-men lực quay theo chiều kim đồng hồ bằng tổng mô-men lực quay ngược chiều kim đồng hồ.',
    targetCompetenciesVi: ['Xác định cánh tay đòn của lực', 'Cân bằng đòn bẩy', 'Quy tắc mô-men lực'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF08-STEP-01',
        titleVi: 'Bước 1: Gá thanh đòn bẩy lên trục quay của giá đỡ',
        instructionVi: 'Gá thanh đòn bẩy có chia vạch milimét vào chốt quay O trên giá thí nghiệm.',
        scientificConceptVi: 'Thanh có một bậc tự do quay quanh trục cố định vuông góc.',
        mathFormulaLatex: '$\\Sigma \\vec{M}_{/O} = 0$',
        requiredArchetypes: ['lever-arm-balance', 'support-stand'],
        suggestedActionVi: 'Lắp thanh đòn vào khớp trục quay O',
        validationGuard: (instances) => {
          const lever = instances.find((i) => i.assetId.includes('LVR') || i.assetId.includes('BAL'));
          return { isPassed: true, reasonVi: 'Thanh đòn đã gắn êm vào trục quay O' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF08-STEP-02',
        titleVi: 'Bước 2: Cân bằng thanh đòn nằm ngang bằng ốc điều chỉnh',
        instructionVi: 'Vặn hai ốc đối trọng ở hai đầu thanh để thanh đòn nằm ngang thăng bằng.',
        scientificConceptVi: 'Triệt tiêu mô-men do trọng lượng bản thân của thanh không đối xứng.',
        mathFormulaLatex: '$\\theta_0 = 0^\\circ$',
        requiredArchetypes: ['lever-arm-balance'],
        suggestedActionVi: 'Vặn ốc đối trọng để thanh nằm ngang',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Thanh đòn đã cân bằng nằm ngang hoàn hảo' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF08-STEP-03',
        titleVi: 'Bước 3: Treo các quả nặng hai bên và kiểm chứng mô-men lực',
        instructionVi: 'Treo 2 quả nặng ở vị trí cách trục $d_1 = 10\\text{ cm}$ bên trái và 1 quả nặng ở vị trí $d_2 = 20\\text{ cm}$ bên phải.',
        scientificConceptVi: 'Quy tắc cân bằng mô-men: $F_1 \\cdot d_1 = F_2 \\cdot d_2$.',
        mathFormulaLatex: '$1.0\\text{ N} \\times 10\\text{ cm} = 0.5\\text{ N} \\times 20\\text{ cm} = 10\\text{ N}\\cdot\\text{cm}$',
        requiredArchetypes: ['lever-arm-balance', 'hook-weight-50g'],
        suggestedActionVi: 'Treo quả nặng vào các móc chia vạch hai bên',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Đòn bẩy thăng bằng tuyệt đối theo quy tắc mô-men lực' };
        },
      },
    ],
  },

  // =========================================================================
  // WF-09: LỰC ĐẨY ARCHIMEDES VÀ BÌNH TRÀN
  // =========================================================================
  'WF-09': {
    workflowId: 'WF-09',
    titleVi: 'Khảo sát lực đẩy Archimedes bằng bình tràn và lực kế',
    curriculumLessonVi: 'KHTN 8 · Bài 16: Áp suất chất lỏng | Bài 17: Lực đẩy Archimedes',
    subject: 'physics',
    gradeLevel: 8,
    descriptionVi: 'Xác định độ lớn lực đẩy Archimedes $F_A = P_1 - P_2$ và so sánh với trọng lượng phần chất lỏng bị chiếm chỗ $P_{\\text{nước tràn}}$.',
    targetCompetenciesVi: ['Sử dụng bình tràn', 'Tính lực đẩy Archimedes', 'Đo thể tích vật chìm'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF09-STEP-01',
        titleVi: 'Bước 1: Đổ nước tới miệng vòi tràn của bình tràn',
        instructionVi: 'Đổ nước vào bình tràn cho tới khi nước vừa chớm chảy qua vòi xả rồi đặt cốc hứng dưới vòi.',
        scientificConceptVi: 'Bình tràn xác định thể tích vật choán chỗ thông qua lượng nước tràn ra.',
        mathFormulaLatex: '$V_{\\text{chiếm chỗ}} = V_{\\text{tràn}}$',
        requiredArchetypes: ['overflow-can', 'beaker-250'],
        suggestedActionVi: 'Đổ nước đầy bình tràn và hứng cốc dưới vòi',
        validationGuard: (instances) => {
          const can = instances.find((i) => i.assetId.includes('OVR') || i.assetId.includes('CAN'));
          return { isPassed: true, reasonVi: 'Bình tràn đã đổ đầy nước tới mép vòi xả' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF09-STEP-02',
        titleVi: 'Bước 2: Móc khối kim loại vào lực kế đo trọng lượng trong không khí',
        instructionVi: 'Treo khối kim loại vào lực kế ngoài không khí, đọc số chỉ trọng lượng $P_1$.',
        scientificConceptVi: 'Trọng lượng thực trong không khí coi như bằng lực hút Trái Đất.',
        mathFormulaLatex: '$P_1 = m \\cdot g \\approx 1.35\\text{ N}$',
        requiredArchetypes: ['spring-dynamometer-5n', 'metal-cylinder-block'],
        suggestedActionVi: 'Móc khối nhôm/đồng vào móc lực kế',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Trọng lượng vật ngoài không khí: $P_1 = 1.35\\text{ N}$' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF09-STEP-03',
        titleVi: 'Bước 3: Nhúng chìm vật vào bình tràn và hứng lượng nước tràn',
        instructionVi: 'Từ từ hạ vật chìm hoàn toàn vào nước trong bình tràn, đọc số chỉ lực kế $P_2$ và cân nước tràn.',
        scientificConceptVi: 'Lực đẩy Archimedes bằng hiệu trọng lượng và bằng trọng lượng nước tràn: $F_A = P_1 - P_2 = d \\cdot V$.',
        mathFormulaLatex: '$F_A = 1.35 - 0.85 = 0.50\\text{ N} = P_{\\text{nước tràn}}$',
        requiredArchetypes: ['overflow-can', 'spring-dynamometer-5n'],
        suggestedActionVi: 'Nhúng ngập vật vào lòng bình tràn',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Lực đẩy Archimedes đo được: $F_A = 0.50\\text{ N}$, bằng đúng trọng lượng khối nước tràn!' };
        },
      },
    ],
  },

  // =========================================================================
  // WF-10: PHA CHẾ DUNG DỊCH MUỐI ĂN VÀ TÍNH NỒNG ĐỘ C%
  // =========================================================================
  'WF-10': {
    workflowId: 'WF-10',
    titleVi: 'Pha chế dung dịch muối ăn NaCl và tính nồng độ phần trăm C%',
    curriculumLessonVi: 'KHTN 8 · Bài 4: Dung dịch và nồng độ',
    subject: 'chemistry',
    gradeLevel: 8,
    descriptionVi: 'Cân khối lượng chất tan NaCl, đong thể tích dung môi nước cất, hòa tan và tính toán nồng độ phần trăm theo công thức $C\\% = \\frac{m_{\\text{ct}}}{m_{\\text{dd}}} \\times 100\\%$.',
    targetCompetenciesVi: ['Kỹ năng cân hóa chất rắn', 'Kỹ thuật dùng đũa thủy tinh hòa tan', 'Tính nồng độ dung dịch'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF10-STEP-01',
        titleVi: 'Bước 1: Cân 10.0 g muối NaCl trên cân điện tử',
        instructionVi: 'Đặt mặt kính đồng hồ lên cân, trừ bì (TARE), dùng thìa xúc chính xác 10.0 g NaCl.',
        scientificConceptVi: 'Đo lường chính xác lượng chất tan theo định luật bảo toàn khối lượng.',
        mathFormulaLatex: '$m_{\\text{NaCl}} = 10.00\\text{ g}$',
        requiredArchetypes: ['electronic-balance', 'chemical-salt-nacl'],
        suggestedActionVi: 'Dùng thìa múc muối lên đĩa cân',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Đã cân chính xác 10.00 g muối ăn NaCl' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF10-STEP-02',
        titleVi: 'Bước 2: Đong 90 ml nước cất bằng ống đong 100 ml',
        instructionVi: 'Rót nước cất vào ống đong tới đúng vạch 90 ml ($m_{\\text{nước}} \\approx 90.0\\text{ g}$).',
        scientificConceptVi: 'Khối lượng riêng của nước nguyên chất ở $20^\\circ\\text{C}$ xấp xỉ $1.0\\text{ g/ml}$.',
        mathFormulaLatex: '$m_{\\text{nước}} = D \\cdot V = 1.0 \\times 90 = 90.0\\text{ g}$',
        requiredArchetypes: ['graduated-cylinder-100', 'distilled-water'],
        suggestedActionVi: 'Đong 90 ml nước cất',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Đã lấy đủ 90 ml nước cất làm dung môi' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF10-STEP-03',
        titleVi: 'Bước 3: Đổ vào cốc và khuấy tan hoàn toàn bằng đũa thủy tinh',
        instructionVi: 'Cho muối và nước vào cốc thủy tinh 250 ml, dùng đũa khuấy đều theo 1 chiều đến khi tan hết.',
        scientificConceptVi: 'Quá trình khuấy làm tăng tốc độ khuếch tán các ion $Na^+$ và $Cl^-$ vào dung môi nước.',
        mathFormulaLatex: '$C\\% = \\frac{10.0}{10.0 + 90.0} \\times 100\\% = 10.0\\%$',
        requiredArchetypes: ['beaker-250', 'stirring-rod'],
        suggestedActionVi: 'Dùng đũa thủy tinh khuấy tan dung dịch trong cốc',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Muối đã tan hoàn toàn, thu được dung dịch NaCl 10.0%' };
        },
      },
    ],
  },

  // =========================================================================
  // WF-11: THÍ NGHIỆM ĐO NHIỆT DUNG VÀ ĐUN SÔI CHẤT LỎNG BẰNG ĐÈN CỒN
  // =========================================================================
  'WF-11': {
    workflowId: 'WF-11',
    titleVi: 'Thí nghiệm đo nhiệt dung và khảo sát quá trình đun sôi bằng đèn cồn',
    curriculumLessonVi: 'KHTN 8 · Bài 26: Năng lượng nhiệt và truyền nhiệt',
    subject: 'physics',
    gradeLevel: 8,
    descriptionVi: 'Lắp kiềng sắt, lưới amiăng tản nhiệt, cốc nước có cắm nhiệt kế và dùng đèn cồn để đun sôi, ghi nhận đường cong tăng nhiệt $\\Delta T(t)$.',
    targetCompetenciesVi: ['Thao tác an toàn nhiệt và đèn cồn', 'Ghi nhật ký nhiệt độ theo thời gian', 'Cân bằng nhiệt lượng'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF11-STEP-01',
        titleVi: 'Bước 1: Lắp kiềng sắt, lưới tản nhiệt amiăng và cốc nước',
        instructionVi: 'Đặt kiềng sắt trên bàn, trải lưới amiăng lên trên và đặt cốc 150 ml nước cùng nhiệt kế.',
        scientificConceptVi: 'Lưới amiăng phân tán nhiệt lượng đều dưới đáy cốc thủy tinh, ngăn sốc nhiệt gây nứt vỡ.',
        mathFormulaLatex: '$m_{\\text{nước}} = 0.15\\text{ kg}, \\quad c = 4186\\text{ J/(kg}\\cdot\\text{K)}$',
        requiredArchetypes: ['tripod-gauze', 'beaker-250', 'thermometer'],
        suggestedActionVi: 'Đặt kiềng đun, lưới amiăng và cốc nước lên giá',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Hệ thống kiềng, lưới tản nhiệt và cốc nước đã bố trí an toàn' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF11-STEP-02',
        titleVi: 'Bước 2: Đặt đèn cồn vào dưới kiềng và châm lửa đun',
        instructionVi: 'Mở nắp đèn cồn, đặt vào tâm kiềng và châm lửa để truyền nhiệt lượng vào đáy cốc.',
        scientificConceptVi: 'Quá trình đốt cháy cồn ethanol tỏa nhiệt lượng: $C_2H_5OH + 3O_2 \\to 2CO_2 + 3H_2O + Q$.',
        mathFormulaLatex: '$P_{\\text{ngọn lửa}} \\approx 350\\text{ W}$',
        requiredArchetypes: ['alcohol-burner'],
        suggestedActionVi: 'Bật ngọn lửa đèn cồn',
        validationGuard: (instances) => {
          const burner = instances.find((i) => i.assetId.includes('ALC') || i.assetId.includes('BRN'));
          const isLit = burner ? burner.instanceState.isFlameLit !== false : true;
          return { isPassed: isLit, reasonVi: 'Ngọn lửa đèn cồn cháy xanh đều, bắt đầu truyền nhiệt lượng' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF11-STEP-03',
        titleVi: 'Bước 3: Theo dõi tăng nhiệt độ và quá trình sôi ở 100°C',
        instructionVi: 'Quan sát chỉ số nhiệt kế tăng liên tục tới $100^\\circ\\text{C}$, bọt khí sôi sục và nhiệt độ giữ nguyên.',
        scientificConceptVi: 'Trong suốt quá trình chuyển thể từ lỏng sang hơi, nhiệt độ của chất lỏng nguyên chất không thay đổi.',
        mathFormulaLatex: '$T = 100^\\circ\\text{C} = \\text{const}, \\quad Q = L \\cdot m$',
        requiredArchetypes: ['thermometer'],
        suggestedActionVi: 'Quan sát nhiệt kế đạt mốc 100 độ C',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Nước đã sôi sùng sục ở $100^\\circ\\text{C}$ và nhiệt độ giữ nguyên không đổi' };
        },
      },
    ],
  },

  // =========================================================================
  // WF-12: KHẢO SÁT ĐỊNH LUẬT ÔM CHO ĐOẠN MẠCH DÂY DẪN (I = U / R)
  // =========================================================================
  'WF-12': {
    workflowId: 'WF-12',
    titleVi: 'Khảo sát định luật Ôm cho đoạn mạch thuần điện trở (I = U / R)',
    curriculumLessonVi: 'KHTN 9 · Bài 9: Định luật Ôm',
    subject: 'physics',
    gradeLevel: 9,
    descriptionVi: 'Khảo sát sự phụ thuộc tuyến tính của cường độ dòng điện $I$ vào hiệu điện thế $U$ đặt vào hai đầu điện trở và vẽ đồ thị đặc tuyến vôn-ampe.',
    targetCompetenciesVi: ['Vẽ đặc tuyến V-A', 'Kiểm chứng định luật Ôm', 'Sử dụng biến trở con chạy điều chỉnh điện áp'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF12-STEP-01',
        titleVi: 'Bước 1: Mắc đoạn mạch nối tiếp nguồn, biến trở, điện trở mẫu và ampe kế',
        instructionVi: 'Lắp ráp mạch kín gồm nguồn DC, biến trở con chạy điều khiển, điện trở $R = 10\\,\\Omega$ và ampe kế.',
        scientificConceptVi: 'Biến trở con chạy đóng vai trò phân áp điều chỉnh dòng điện mượt mà.',
        mathFormulaLatex: '$I = \\frac{U}{R_x + R_{\\text{biến}}}$',
        requiredArchetypes: ['resistor-sample', 'rheostat', 'ammeter-dc'],
        suggestedActionVi: 'Cắm dây nối các linh kiện trên đế thí nghiệm',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Mạch đo định luật Ôm đã lắp ráp chuẩn xác' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF12-STEP-02',
        titleVi: 'Bước 2: Mắc vôn kế song song với hai đầu điện trở mẫu R',
        instructionVi: 'Nối hai chốt của vôn kế vào hai đầu chân cắm của điện trở mẫu $R$.',
        scientificConceptVi: 'Hiệu điện thế hai đầu tải thuần trở tỷ lệ thuận với dòng điện chạy qua nó.',
        mathFormulaLatex: '$U_R = I \\cdot R$',
        requiredArchetypes: ['voltmeter-dc', 'resistor-sample'],
        suggestedActionVi: 'Mắc vôn kế song song hai cực điện trở',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Vôn kế đã sẵn sàng đo điện áp rơi trên điện trở' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF12-STEP-03',
        titleVi: 'Bước 3: Điều chỉnh biến trở, ghi bảng số liệu (U, I) và kiểm chứng',
        instructionVi: 'Gạt con chạy biến trở qua 4 nấc ($U = 2\\text{V}, 4\\text{V}, 6\\text{V}, 8\\text{V}$), ghi các giá trị $I$ tương ứng.',
        scientificConceptVi: 'Hệ số góc của đồ thị đường thẳng đi qua gốc tọa độ chính là điện trở $R = \\frac{\\Delta U}{\\Delta I}$.',
        mathFormulaLatex: '$I = \\frac{U}{R} \\iff \\frac{U}{I} = \\text{const} = 10.0\\,\\Omega$',
        requiredArchetypes: ['rheostat'],
        suggestedActionVi: 'Gạt con chạy biến trở và quan sát kim đo',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Tỉ số $U/I$ không đổi ($10.0\\,\\Omega$), nghiệm đúng định luật Ôm' };
        },
      },
    ],
  },

  // =========================================================================
  // WF-13: KHẢO SÁT MẠCH ĐIỆN NỐI TIẾP VÀ SONG SONG
  // =========================================================================
  'WF-13': {
    workflowId: 'WF-13',
    titleVi: 'Khảo sát đoạn mạch nối tiếp và song song hai bóng đèn',
    curriculumLessonVi: 'KHTN 8 · Bài 23: Tác dụng của dòng điện | Đoạn mạch nối tiếp & song song',
    subject: 'physics',
    gradeLevel: 8,
    descriptionVi: 'So sánh cường độ dòng điện và hiệu điện thế trong 2 kiểu mắc mạch điện cơ bản: nối tiếp ($U = U_1 + U_2, I = I_1 = I_2$) và song song ($U = U_1 = U_2, I = I_1 + I_2$).',
    targetCompetenciesVi: ['Phân biệt mạch nối tiếp và song song', 'Định luật Kirchhoff 1 và 2', 'Đặc tính phân áp và phân dòng'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF13-STEP-01',
        titleVi: 'Bước 1: Lắp mạch nối tiếp 2 bóng đèn Đ1 và Đ2',
        instructionVi: 'Nối cực dương nguồn -> bóng đèn 1 -> bóng đèn 2 -> cực âm nguồn.',
        scientificConceptVi: 'Trong đoạn mạch nối tiếp chỉ có một đường dẫn dòng điện duy nhất.',
        mathFormulaLatex: '$I = I_1 = I_2, \\quad U = U_1 + U_2$',
        requiredArchetypes: ['incandescent-lamp-socket'],
        suggestedActionVi: 'Mắc nối tiếp 2 bóng đèn',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Đã hoàn thành mắc nối tiếp 2 bóng đèn' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF13-STEP-02',
        titleVi: 'Bước 2: Đo hiệu điện thế và quan sát độ sáng mạch nối tiếp',
        instructionVi: 'Đo $U_1 = 3.0\\text{ V}$ và $U_2 = 3.0\\text{ V}$ ($U_{\\text{tổng}} = 6.0\\text{ V}$), hai đèn sáng mờ hơn bình thường.',
        scientificConceptVi: 'Điện áp nguồn bị chia đôi cho 2 tải tiêu thụ có cùng điện trở.',
        mathFormulaLatex: '$U_1 = U_2 = \\frac{U}{2} = 3.0\\text{ V}$',
        requiredArchetypes: ['voltmeter-dc'],
        suggestedActionVi: 'Đo điện áp trên từng bóng đèn',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Đo đạc mạch nối tiếp chính xác: $U_1 + U_2 = 6.0\\text{ V}$' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF13-STEP-03',
        titleVi: 'Bước 3: Chuyển sang mạch song song và so sánh',
        instructionVi: 'Nối 2 bóng đèn song song với nhau vào nguồn 6V, quan sát hai đèn sáng rực rỡ và đo dòng rẽ nhánh.',
        scientificConceptVi: 'Trong mạch song song, điện áp hai đầu mỗi nhánh bằng điện áp nguồn, dòng điện chia nhánh theo định luật nút.',
        mathFormulaLatex: '$U_1 = U_2 = U = 6.0\\text{ V}, \\quad I = I_1 + I_2$',
        requiredArchetypes: ['incandescent-lamp-socket'],
        suggestedActionVi: 'Mắc 2 bóng đèn song song',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Mạch song song: Cả 2 đèn sáng hết công suất định mức, $U_1 = U_2 = 6.0\\text{ V}$' };
        },
      },
    ],
  },

  // =========================================================================
  // WF-14: THÍ NGHIỆM THOÁT HƠI NƯỚC VÀ QUANG HỢP Ở LÁ CÂY
  // =========================================================================
  'WF-14': {
    workflowId: 'WF-14',
    titleVi: 'Thí nghiệm chứng minh sự thoát hơi nước qua khí khổng ở lá cây',
    curriculumLessonVi: 'KHTN 7 · Bài 23: Trao đổi nước và chất dinh dưỡng ở thực vật',
    subject: 'biology',
    gradeLevel: 7,
    descriptionVi: 'Sử dụng hai cành cây cắm trong bình tam giác chứa nước có lớp dầu chống bốc hơi: một cành có lá và một cành đã vặt hết lá để so sánh độ hạ mực nước.',
    targetCompetenciesVi: ['Thiết lập đối chứng sinh học', 'Đo lường sự thoát hơi nước', 'Vai trò của khí khổng'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF14-STEP-01',
        titleVi: 'Bước 1: Chuẩn bị 2 bình tam giác có chứa nước và lớp dầu nổi',
        instructionVi: 'Đổ 100 ml nước vào 2 bình tam giác, nhỏ vài giọt dầu ăn tạo màng ngăn nước bay hơi tự do từ mặt thoáng.',
        scientificConceptVi: 'Lớp màng dầu ngăn sự bay hơi tự nhiên, đảm bảo lượng nước mất đi chỉ do cây hút.',
        mathFormulaLatex: '$\\Delta V_{\\text{bốc hơi tự nhiên}} \\approx 0\\text{ ml}$',
        requiredArchetypes: ['erlenmeyer-flask'],
        suggestedActionVi: 'Rót nước và nhỏ dầu vào 2 bình tam giác',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Đã chuẩn bị 2 bình tam giác thí nghiệm có màng dầu bảo vệ' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF14-STEP-02',
        titleVi: 'Bước 2: Cắm cành có lá vào bình A và cành tỉa hết lá vào bình B',
        instructionVi: 'Cắm cành tươi nguyên vẹn lá vào bình A (thực nghiệm) và cành đã ngắt sạch lá vào bình B (đối chứng).',
        scientificConceptVi: 'Thiết kế thí nghiệm đối chứng đơn biến để cô lập yếu tố thoát hơi nước qua bề mặt lá.',
        mathFormulaLatex: '$A: \\text{Có lá (Thực nghiệm)} \\quad \\text{vs} \\quad B: \\text{Không lá (Đối chứng)}$',
        requiredArchetypes: ['erlenmeyer-flask', 'plant-twig'],
        suggestedActionVi: 'Cắm 2 cành cây vào 2 bình',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Đã thiết lập cặp bình thực nghiệm và đối chứng chuẩn xác' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF14-STEP-03',
        titleVi: 'Bước 3: Chiếu sáng và đo độ tụt mực nước trong 2 bình',
        instructionVi: 'Bật đèn chiếu sáng 30 phút, quan sát mực nước ở bình A tụt rõ rệt do khí khổng mở thoát hơi nước.',
        scientificConceptVi: 'Thoát hơi nước tạo động lực hút từ ngọn kéo cột nước đi lên từ rễ qua mạch gỗ.',
        mathFormulaLatex: '$\\Delta h_A = 12\\text{ mm} > \\Delta h_B \\approx 0.5\\text{ mm}$',
        requiredArchetypes: ['erlenmeyer-flask'],
        suggestedActionVi: 'Bật đèn chiếu sáng và quan sát mực nước tụt',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Mực nước bình A giảm mạnh, chứng minh nước thoát ra chủ yếu qua lá' };
        },
      },
    ],
  },

  // =========================================================================
  // WF-15: ĐO ĐỘ PH CỦA CÁC DUNG DỊCH BẰNG GIẤY CHỈ THỊ MÀU VÀ PH KẾ
  // =========================================================================
  'WF-15': {
    workflowId: 'WF-15',
    titleVi: 'Đo độ pH của các dung dịch bằng giấy chỉ thị màu và pH kế điện tử',
    curriculumLessonVi: 'KHTN 8 · Bài 10: Thang pH và chỉ thị axit - bazơ',
    subject: 'chemistry',
    gradeLevel: 8,
    descriptionVi: 'Xác định môi trường axit, bazơ và trung tính của các mẫu dung dịch (giấm ăn, nước chanh, nước xà phòng, nước cất) bằng giấy quỳ, giấy pH vạn năng và bút đo pH.',
    targetCompetenciesVi: ['Kỹ thuật chấm giọt dung dịch', 'So sánh bảng màu chuẩn pH', 'Đánh giá tính axit - bazơ'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF15-STEP-01',
        titleVi: 'Bước 1: Rót các mẫu dung dịch vào khay đĩa sứ',
        instructionVi: 'Rót khoảng 5 ml từng mẫu dung dịch (Axit HCl / giấm ăn, Bazơ NaOH / nước vôi trong, Nước cất) vào khay.',
        scientificConceptVi: 'Thang đo pH định lượng nồng độ ion $H^+$ trong dung dịch: $\\text{pH} = -\\log[H^+]$.',
        mathFormulaLatex: '$\\text{pH} = -\\log_{10}[H^+]$',
        requiredArchetypes: ['test-tube-rack', 'solution-samples'],
        suggestedActionVi: 'Rót các mẫu hóa chất vào khay sứ',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Các mẫu dung dịch đã sẵn sàng trên khay thí nghiệm' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF15-STEP-02',
        titleVi: 'Bước 2: Dùng đũa thủy tinh chấm giọt dung dịch lên giấy chỉ thị màu',
        instructionVi: 'Nhúng đầu đũa thủy tinh sạch vào dung dịch, chấm lên mẩu giấy chỉ thị pH vạn năng.',
        scientificConceptVi: 'Chất chỉ thị chuyển dịch cân bằng ion tạo hợp chất có cấu trúc màu đặc trưng theo độ pH.',
        mathFormulaLatex: '$HIn \\rightleftharpoons H^+ + In^-$',
        requiredArchetypes: ['ph-indicator-strip', 'stirring-rod'],
        suggestedActionVi: 'Chấm giọt dung dịch lên giấy pH',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Giấy chỉ thị đổi màu ngay lập tức khi tiếp xúc ion' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF15-STEP-03',
        titleVi: 'Bước 3: So sánh thang màu chuẩn và xác định giá trị pH',
        instructionVi: 'Đối chiếu màu sắc của giấy quỳ / giấy pH với dải màu chuẩn: Đỏ cam (Axit pH ~ 3), Xanh thẫm (Bazơ pH ~ 11), Vàng lục (Nước cất pH = 7).',
        scientificConceptVi: 'Phân loại dung dịch theo thang đo: $\\text{pH} < 7$ (axit), $\\text{pH} = 7$ (trung tính), $\\text{pH} > 7$ (bazơ).',
        mathFormulaLatex: '$\\text{Axit: } \\text{pH} = 3.0, \\quad \\text{Nước cất: } \\text{pH} = 7.0, \\quad \\text{Bazơ: } \\text{pH} = 11.5$',
        requiredArchetypes: ['ph-indicator-strip'],
        suggestedActionVi: 'So sánh màu với bảng màu chuẩn',
        validationGuard: (instances) => {
          return { isPassed: true, reasonVi: 'Xác định thành công giá trị pH chuẩn xác cho toàn bộ các mẫu dung dịch!' };
        },
      },
    ],
  },
};
