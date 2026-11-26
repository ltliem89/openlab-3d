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
    targetCompetenciesVi: ['Kỹ năng sử dụng cân điện tử chính xác', 'Kỹ thuật trừ bì (TARE)', 'Xác định khối lượng tịnh $m_{\\text{tinh}} = m_{\\text{tong}} - m_{\\text{bi}}$'],
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
        scientificConceptVi: 'Khối lượng thô gồm cả vật chứa (khối lượng bì $m_{\\text{bi}}$).',
        mathFormulaLatex: '$m_{\\text{bi}} \\approx 85.0\\text{ g}$',
        requiredArchetypes: ['electronic-balance', 'beaker-250'],
        suggestedActionVi: 'Thả cốc đong lên đĩa cân',
        validationGuard: (instances) => {
          const balance = instances.find((i) => i.assetId.includes('BAL'));
          const beaker = instances.find((i) => i.assetId.includes('BKR'));
          if (!balance || !beaker) return { isPassed: false, reasonVi: 'Cần có cả cân điện tử và cốc đong trên bàn' };
          const rawMass = Number(balance.instanceState.measuredMassG ?? 0);
          if (rawMass <= 10.0) return { isPassed: false, reasonVi: 'Chưa đặt cốc đong lên đĩa cân', hintVi: 'Kéo cốc đong đặt lên đĩa cân' };
          return { isPassed: true, reasonVi: `Đã đặt cốc lên đĩa cân ($m_{\\text{bi}} = ${rawMass.toFixed(1)}\\text{ g}$)` };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF01-STEP-03',
        titleVi: 'Bước 3: Bấm phím TARE để trừ bì về 0.00 g',
        instructionVi: 'Bấm phím TARE trên cân điện tử để trừ khối lượng vỏ cốc, chuẩn bị đo chất lỏng hoặc mẫu vật.',
        scientificConceptVi: 'Quy không cảm ứng tải trọng để đo trực tiếp khối lượng tịnh.',
        mathFormulaLatex: '$m_{\\text{hien thi}} = m_{\\text{tong}} - m_{\\text{bi}} = 0.00\\text{ g}$',
        requiredArchetypes: ['electronic-balance'],
        suggestedActionVi: 'Nhấn nút TARE trên cân',
        validationGuard: (instances) => {
          const balance = instances.find((i) => i.assetId.includes('BAL'));
          if (!balance) return { isPassed: false, reasonVi: 'Không tìm thấy cân điện tử' };
          const tareOffset = Number(balance.instanceState.tareOffsetG ?? 0);
          if (tareOffset <= 0) return { isPassed: false, reasonVi: 'Chưa bấm phím TARE để trừ bì', hintVi: 'Nhấn nút TARE trên bảng điều khiển cân' };
          return { isPassed: true, reasonVi: `Trừ bì thành công ($m_{\\text{bi}} = ${tareOffset.toFixed(1)}\\text{ g}$, màn hình = $0.00\\text{ g}$)` };
        },
      },
      {
        stepIndex: 4,
        stepId: 'WF01-STEP-04',
        titleVi: 'Bước 4: Rót chất lỏng vào cốc và đọc khối lượng tịnh',
        instructionVi: 'Rót khoảng 50 - 100 ml nước vào cốc đong và đọc số chỉ khối lượng tịnh của lượng nước.',
        scientificConceptVi: 'Mối quan hệ giữa khối lượng và thể tích thông qua khối lượng riêng: $m = D \\cdot V$.',
        mathFormulaLatex: '$m_{\\text{nuoc}} = D_{\\text{nuoc}} \\cdot V_{\\text{nuoc}}$',
        requiredArchetypes: ['electronic-balance', 'beaker-250'],
        suggestedActionVi: 'Nghiêng bình rót nước vào cốc đong đang đặt trên cân',
        validationGuard: (instances) => {
          const beaker = instances.find((i) => i.assetId.includes('BKR'));
          const balance = instances.find((i) => i.assetId.includes('BAL'));
          if (!beaker || !balance) return { isPassed: false, reasonVi: 'Thiếu cân hoặc cốc đong' };
          const fluidLevel = Number(beaker.instanceState.liquidLevelMl ?? beaker.instanceState.fluidLevelMl ?? 0);
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
        mathFormulaLatex: '$\\text{DCNN} = 1\\text{ ml}, \\quad \\text{GHD} = 100\\text{ ml}$',
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
          const vol = Number(cyl.instanceState.liquidLevelMl ?? cyl.instanceState.fluidLevelMl ?? 0);
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
        mathFormulaLatex: '$V = V_{\\text{day khum}} \\pm \\frac{\\text{DCNN}}{2}$',
        requiredArchetypes: ['graduated-cylinder-100'],
        suggestedActionVi: 'Căn chỉnh góc nhìn trực diện vào vạch chia',
        validationGuard: (instances) => {
          const cyl = instances.find((i) => i.assetId.includes('CYL') || i.assetId.includes('GRD'));
          if (!cyl) return { isPassed: false, reasonVi: 'Thiếu ống đong' };
          const vol = Number(cyl.instanceState.liquidLevelMl ?? cyl.instanceState.fluidLevelMl ?? 0);
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
        requiredArchetypes: ['spring-dynamometer', 'support-stand'],
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
        requiredArchetypes: ['spring-dynamometer'],
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
        mathFormulaLatex: '$F_{\\text{dh}} = k \\cdot |\\Delta l| = m \\cdot g$',
        requiredArchetypes: ['spring-dynamometer', 'calibration-weight'],
        suggestedActionVi: 'Móc quả nặng 50 g vào khuyên móc lực kế',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): measuredForceN không tồn tại (chỉ xuất hiện ở guard cũ → luôn 0,
          // reason cũ bịa '0.50' N). Trường thật là springExtensionN = Σ khối lượng móc × 0,00980665
          // (reconcile App.tsx). Quả WGT-0001 50 g → 0,49 N.
          const dyna = instances.find((i) => i.assetId === 'OL3D-EQP-DYN-0001');
          if (!dyna) return { isPassed: false, reasonVi: 'Thiếu lực kế', hintVi: 'Đặt lực kế lò xo 5 N lên bàn' };
          const weight = instances.find((i) => i.assetId === 'OL3D-EQP-WGT-0001');
          if (!weight) return { isPassed: false, reasonVi: 'Chưa đặt quả nặng 50 g lên bàn', hintVi: 'Đặt quả nặng chuẩn 50 g lên bàn rồi móc vào lực kế' };
          if (weight.instanceState.attachedToInstanceId !== dyna.instanceId || weight.instanceState.attachmentSlot !== 'dynamometer-hook') {
            return { isPassed: false, reasonVi: 'Quả nặng chưa móc vào lực kế', hintVi: 'Móc quả nặng 50 g vào đầu dưới lực kế' };
          }
          const f = dyna.instanceState.springExtensionN;
          if (typeof f !== 'number' || !Number.isFinite(f)) return { isPassed: false, reasonVi: 'Lực kế chưa đọc được lực', hintVi: 'Móc quả nặng vào lực kế rồi đọc lại' };
          if (Math.abs(f - 0.49) > 0.02) return { isPassed: false, reasonVi: `Lực kế đang chỉ F = ${f.toFixed(2)} N, chưa phải 0,49 N của quả 50 g`, hintVi: 'Kiểm tra quả đang móc có đúng quả nặng chuẩn 50 g không' };
          return { isPassed: true, reasonVi: `Lực đàn hồi đo được: $F = ${f.toFixed(2)}\\text{ N}$ (quả 50 g móc trên lực kế; $P = m \\cdot g = 0,05 \\times 9,81$)` };
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
          // C-09 (v2.5.0): không dùng giá trị mặc định 0.42 s — chưa có số đo thật thì guard phải fail.
          const recordedTimeRaw = timer.instanceState.recordedTimeS;
          if (recordedTimeRaw === null || recordedTimeRaw === undefined || Number.isNaN(Number(recordedTimeRaw))) {
            return { isPassed: false, reasonVi: 'Chưa có thời gian đo — đồng hồ chưa ghi nhận Δt', hintVi: 'Thả viên bi từ đỉnh máng để cổng quang ghi nhận thời gian qua A và B' };
          }
          const recordedTime = Number(recordedTimeRaw);
          if (!(recordedTime > 0)) return { isPassed: false, reasonVi: 'Thời gian đo không hợp lệ (Δt phải lớn hơn 0)', hintVi: 'Thả lại viên bi qua cổng quang' };
          return { isPassed: true, reasonVi: `Thời gian ghi nhận: $\\Delta t = ${recordedTime.toFixed(3)}\\text{ s} \\implies v = ${(0.5 / recordedTime).toFixed(2)}\\text{ m/s}$` };
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
        mathFormulaLatex: '$I_{\\text{ho mach}} = 0\\text{ A}$',
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
        scientificConceptVi: 'Dòng điện qua các phần tử mắc nối tiếp là như nhau: $I = I_A = I_{\\text{den}}$.',
        mathFormulaLatex: '$R_A \\approx 0\\,\\Omega \\implies \\text{Mac noi tiep}$',
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
        mathFormulaLatex: '$R_V \\to \\infty \\implies \\text{Mac song song}$',
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
          // C-09 (v2.5.0): không mặc định "đã đóng" khi chưa có công tắc trên bàn.
          if (!sw) return { isPassed: false, reasonVi: 'Chưa có công tắc trên bàn', hintVi: 'Đặt công tắc (khóa K) lên bàn rồi đóng khóa' };
          const isClosed = sw.instanceState.isClosed === true;
          if (!isClosed) return { isPassed: false, reasonVi: 'Khóa K đang mở — mạch chưa kín', hintVi: 'Bấm đóng khóa K để mạch kín và bóng đèn sáng' };
          return { isPassed: true, reasonVi: 'Mạch kín: Bóng đèn sáng rực rỡ, $U = 6.0\\text{ V}$, $I = 0.50\\text{ A}$' };
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
        mathFormulaLatex: '$U_{\\text{den}} = 12\\text{ V}$',
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
          // C-09 (v2.5.0): không dùng giá trị mặc định 20.0/10.0/20.0 — đúng bằng đáp án lý thuyết nên guard tự pass khi chưa đo.
          const dRaw = lens.instanceState.objectDistanceDCm;
          const fRaw = lens.instanceState.focalLengthCm;
          const screenDRaw = screen.instanceState.screenDistanceCm;
          if (dRaw === null || dRaw === undefined || fRaw === null || fRaw === undefined || screenDRaw === null || screenDRaw === undefined) {
            return { isPassed: false, reasonVi: 'Chưa có số đo vị trí — thấu kính hoặc màn chưa được đặt/đo', hintVi: 'Đặt thấu kính và màn lên ray rồi dịch chuyển màn tới vị trí ảnh nét' };
          }
          const d = Number(dRaw);
          const f = Number(fRaw);
          const expectedDPrime = (f * d) / (d - f);
          const screenD = Number(screenDRaw);
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
        instructionVi: 'Đặt bản bán trụ thủy tinh kèm đĩa chia độ tròn $360^\\circ$ (một thiết bị SLB-0001) lên bàn, đặt tâm mặt phẳng của bản bán nguyệt trùng gốc O của đĩa.',
        scientificConceptVi: 'Tâm hình học của bản cong tròn trùng với gốc tọa độ để tia khúc xạ ra không bị bẻ cong lần hai.',
        mathFormulaLatex: '$O(0, 0) \\equiv \\text{Tam ban ban nguyet}$',
        requiredArchetypes: ['semicircular-slab'],
        suggestedActionVi: 'Đặt bản bán trụ thủy tinh kèm đĩa chia độ lên bàn',
        validationGuard: (instances) => {
          // C-17 (Vòng 1): đĩa chia độ không phải asset riêng — nó là một phần của SLB-0001.
          // Tìm đúng assetId, không dùng includes('DSK'/'SMC') vì không asset nào chứa các chuỗi đó.
          const slab = instances.find((i) => i.assetId === 'OL3D-EQP-SLB-0001');
          if (!slab) return { isPassed: false, reasonVi: 'Chưa đặt bản bán trụ thủy tinh lên bàn', hintVi: 'Mở kệ Quang học và đặt “Bản bán trụ thủy tinh & Bảng chia độ 360°” lên bàn' };
          return { isPassed: true, reasonVi: 'Đã đặt bản bán trụ thủy tinh kèm đĩa chia độ lên bàn' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF07-STEP-02',
        titleVi: 'Bước 2: Bật nguồn phát tia laser hẹp chiếu vào mặt phẳng',
        instructionVi: 'Bật nguồn phát tia laser, chỉnh góc tới $i = 45^\\circ$ so với pháp tuyến.',
        scientificConceptVi: 'Tia sáng truyền từ không khí ($n_1 \\approx 1.00$) vào thủy tinh ($n_2 \\approx 1.50$) bị bẻ gãy lại gần pháp tuyến.',
        mathFormulaLatex: '$i = 45^\\circ, \\quad n_1 = 1.000$',
        requiredArchetypes: ['laser-source'],
        suggestedActionVi: 'Bật đèn laser và xoay nguồn tới góc 45 độ',
        validationGuard: (instances) => {
          // C-17 (Vòng 1): chỉ isPoweredOn (nút ON/OFF trên đèn) mới chứng minh tia đang bật.
          // Cờ isLaserOn trong bảng điều khiển là cờ chết, không bật được tia 3D — không dùng.
          const laser = instances.find((i) => i.assetId === 'OL3D-EQP-LSR-0001');
          if (!laser) return { isPassed: false, reasonVi: 'Chưa đặt đèn laser lên bàn', hintVi: 'Mở kệ Quang học và đặt “Đèn Laser” lên bàn' };
          if (laser.instanceState.isPoweredOn !== true) return { isPassed: false, reasonVi: 'Đèn laser đang tắt', hintVi: 'Bấm nút “🔦 ON (650 nm)” trên đèn laser — công tắc trong bảng điều khiển không bật được tia' };
          const slab = instances.find((i) => i.assetId === 'OL3D-EQP-SLB-0001');
          if (!slab) return { isPassed: false, reasonVi: 'Chưa đặt bản bán trụ thủy tinh lên bàn', hintVi: 'Đặt bản bán trụ lên bàn rồi chiếu tia laser vào tâm O' };
          const i = slab.instanceState.incidentAngleDeg;
          if (typeof i !== 'number' || !Number.isFinite(i)) return { isPassed: false, reasonVi: 'Chưa đặt góc tới i', hintVi: 'Kéo thanh trượt góc tới trên bản bán trụ tới 45°' };
          if (Math.abs(i - 45) > 2) return { isPassed: false, reasonVi: `Góc tới hiện tại i = ${i.toFixed(0)}°, chưa phải 45°`, hintVi: 'Kéo thanh trượt góc tới (hoặc xoay trong bảng điều khiển) tới 45° — các nút preset không có 45°' };
          return { isPassed: true, reasonVi: `Tia laser đang chiếu vào tâm O, góc tới i = ${i.toFixed(0)}° (đọc trên đĩa chia độ)` };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF07-STEP-03',
        titleVi: 'Bước 3: Đọc góc khúc xạ $r$ và tính chiết suất $n$',
        instructionVi: 'Đọc góc khúc xạ $r \\approx 28^\\circ$ trên đĩa chia độ và tính chiết suất $n = \\frac{\\sin i}{\\sin r}$.',
        scientificConceptVi: 'Định luật khúc xạ ánh sáng Snell-Descartes.',
        mathFormulaLatex: '$n = \\frac{\\sin 45^\\circ}{\\sin 28^\\circ} \\approx 1.51$',
        requiredArchetypes: ['semicircular-slab'],
        suggestedActionVi: 'Quan sát vạch góc trên đĩa chia độ',
        validationGuard: (instances) => {
          // C-17 (Vòng 1): không có cảm biến/đọc số nào cho r trong code (refractedAngleDeg
          // chỉ là output tính sẵn và hay bị cũ khi đổi góc ngoài bảng điều khiển), nên r và n
          // ở đây là TÍNH RA từ i theo định luật Snell, không phải đo trực tiếp — ghi rõ trong reason.
          const laser = instances.find((i) => i.assetId === 'OL3D-EQP-LSR-0001');
          if (!laser || laser.instanceState.isPoweredOn !== true) return { isPassed: false, reasonVi: 'Đèn laser đang tắt, không có tia để đo', hintVi: 'Bật đèn laser rồi chỉnh lại góc tới 45°' };
          const slab = instances.find((i) => i.assetId === 'OL3D-EQP-SLB-0001');
          if (!slab) return { isPassed: false, reasonVi: 'Chưa đặt bản bán trụ thủy tinh lên bàn', hintVi: 'Đặt bản bán trụ lên bàn' };
          const i = slab.instanceState.incidentAngleDeg;
          if (typeof i !== 'number' || !Number.isFinite(i) || Math.abs(i - 45) > 2) return { isPassed: false, reasonVi: `Góc tới i = ${typeof i === 'number' ? i.toFixed(0) + '°' : 'chưa đặt'}, chưa phải 45°`, hintVi: 'Chỉnh góc tới về 45° rồi đọc lại' };
          const r = (Math.asin(Math.sin((i * Math.PI) / 180) / 1.5) * 180) / Math.PI;
          const n = Math.sin((i * Math.PI) / 180) / Math.sin((r * Math.PI) / 180);
          if (!Number.isFinite(r) || !Number.isFinite(n) || Math.abs(n - 1.5) > 0.05) return { isPassed: false, reasonVi: 'Số liệu không nhất quán với định luật Snell', hintVi: 'Kiểm tra lại góc tới i' };
          return { isPassed: true, reasonVi: `Góc khúc xạ r = ${r.toFixed(1)}° (tính từ i theo định luật Snell, KHÔNG phải đọc trực tiếp trên đĩa), chiết suất n = ${n.toFixed(2)} (tính ra)` };
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
        requiredArchetypes: ['lever-balance-apparatus'],
        suggestedActionVi: 'Lắp thanh đòn vào khớp trục quay O',
        validationGuard: (instances) => {
          // C-17 (Vòng 1): tìm đúng LEV-0001. Tìm 'BAL' cũ sẽ bắt nhầm BAL-0001 (cân điện tử).
          const lever = instances.find((i) => i.assetId === 'OL3D-EQP-LEV-0001');
          if (!lever) return { isPassed: false, reasonVi: 'Chưa đặt bộ đòn bẩy lên bàn', hintVi: 'Mở kệ Đo lực và đặt “Bộ đòn bẩy thăng bằng” lên bàn' };
          return { isPassed: true, reasonVi: 'Đã đặt bộ đòn bẩy lên bàn' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF08-STEP-02',
        titleVi: 'Bước 2: Cân bằng thanh đòn nằm ngang bằng ốc điều chỉnh',
        instructionVi: 'Vặn ốc vi chỉnh cân bằng để thanh đòn nằm ngang thăng bằng khi chưa treo quả cân.',
        scientificConceptVi: 'Triệt tiêu mô-men do trọng lượng bản thân của thanh không đối xứng.',
        mathFormulaLatex: '$\\theta_0 = 0^\\circ$',
        requiredArchetypes: ['lever-balance-apparatus'],
        suggestedActionVi: 'Vặn ốc vi chỉnh để thanh nằm ngang',
        validationGuard: (instances) => {
          // C-17 (Vòng 1): không có trường nào ghi "đã vặn ốc" (panel không có nút trim),
          // nên bước này chỉ kiểm tra trạng thái không tải — ghi rõ, không bịa "đã vặn ốc".
          const lever = instances.find((i) => i.assetId === 'OL3D-EQP-LEV-0001');
          if (!lever) return { isPassed: false, reasonVi: 'Chưa đặt bộ đòn bẩy lên bàn', hintVi: 'Đặt bộ đòn bẩy lên bàn trước' };
          const m1 = Number(lever.instanceState.leftMassG ?? 0);
          const m2 = Number(lever.instanceState.rightMassG ?? 0);
          if (m1 > 0 || m2 > 0) return { isPassed: false, reasonVi: 'Đang còn quả cân treo trên đòn bẩy', hintVi: 'Bấm “Tháo quả cân” rồi mới chỉnh thăng bằng không tải' };
          const theta = Number(lever.instanceState.incidentAngleDeg ?? 0);
          if (Math.abs(theta) > 1) return { isPassed: false, reasonVi: `Thanh đang nghiêng ${theta.toFixed(1)}°`, hintVi: 'Vặn ốc vi chỉnh cân bằng tới khi kim về 0°' };
          return { isPassed: true, reasonVi: `Thanh đòn đang nằm ngang, không tải (θ = ${theta.toFixed(1)}°) — bước kiểm tra trạng thái ban đầu` };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF08-STEP-03',
        titleVi: 'Bước 3: Treo các quả nặng hai bên và kiểm chứng mô-men lực',
        instructionVi: 'Treo 2 quả nặng (100 g) ở lỗ 4 bên trái (d1 = 8 cm) và 1 quả nặng (50 g) ở lỗ 8 bên phải (d2 = 16 cm).',
        scientificConceptVi: 'Quy tắc cân bằng mô-men: $F_1 \\cdot d_1 = F_2 \\cdot d_2$.',
        mathFormulaLatex: '$100\\text{ g} \\times 8\\text{ cm} = 50\\text{ g} \\times 16\\text{ cm} = 800\\text{ g}\\cdot\\text{cm}$',
        requiredArchetypes: ['lever-balance-apparatus'],
        suggestedActionVi: 'Treo quả nặng vào các móc chia vạch hai bên',
        validationGuard: (instances) => {
          // C-17 (Vòng 1): đề bài cũ (d2 = 20 cm) không làm được — lỗ treo 1–9 × 20 mm = tối đa 18 cm.
          // Guard chấp nhận BẤT KỲ cặp cân bằng nào (m1·x1 = m2·x2, dung sai 5%), không ép một đáp án.
          // Khối lượng chỉ đổi qua nút/slider của LEV; không đếm instance WGT (không có cơ chế treo WGT).
          // Trường vắng = chưa thao tác → FAIL, không dùng ?? giá trị mặc định.
          const lever = instances.find((i) => i.assetId === 'OL3D-EQP-LEV-0001');
          if (!lever) return { isPassed: false, reasonVi: 'Chưa đặt bộ đòn bẩy lên bàn', hintVi: 'Đặt bộ đòn bẩy lên bàn trước' };
          const m1 = lever.instanceState.leftMassG;
          const m2 = lever.instanceState.rightMassG;
          const x1 = lever.instanceState.leftHoleIndex;
          const x2 = lever.instanceState.rightHoleIndex;
          if (typeof m1 !== 'number' || m1 <= 0) return { isPassed: false, reasonVi: 'Chưa treo quả cân bên trái', hintVi: 'Bấm “+50g” bên trái để treo quả cân' };
          if (typeof m2 !== 'number' || m2 <= 0) return { isPassed: false, reasonVi: 'Chưa treo quả cân bên phải', hintVi: 'Bấm “+50g” bên phải để treo quả cân' };
          if (typeof x1 !== 'number' || x1 < 1 || x1 > 9) return { isPassed: false, reasonVi: 'Chưa chọn lỗ treo bên trái', hintVi: 'Chọn lỗ treo 1–9 bên trái' };
          if (typeof x2 !== 'number' || x2 < 1 || x2 > 9) return { isPassed: false, reasonVi: 'Chưa chọn lỗ treo bên phải', hintVi: 'Chọn lỗ treo 1–9 bên phải' };
          const d1 = x1 * 2; // cm
          const d2 = x2 * 2; // cm
          const M1 = m1 * d1; // g·cm, g triệt tiêu nên không cần g = 9.8/9.81
          const M2 = m2 * d2;
          const maxM = Math.max(M1, M2);
          if (Math.abs(M1 - M2) > 0.05 * maxM) {
            const pct = ((Math.abs(M1 - M2) / maxM) * 100).toFixed(0);
            return { isPassed: false, reasonVi: `Mô-men chưa cân bằng: M₁ = ${M1} g·cm, M₂ = ${M2} g·cm, lệch ${pct}%`, hintVi: 'Dời móc treo hoặc thêm/bớt quả cân sao cho m₁·x₁ = m₂·x₂' };
          }
          const theta = Number(lever.instanceState.incidentAngleDeg ?? 0);
          if (Math.abs(theta) > 1) return { isPassed: false, reasonVi: `Mô-men đã bằng nhau nhưng thanh còn nghiêng ${theta.toFixed(1)}°`, hintVi: 'Kiểm tra lại ốc vi chỉnh cân bằng' };
          const F1 = ((m1 / 1000) * 9.8).toFixed(2);
          const F2 = ((m2 / 1000) * 9.8).toFixed(2);
          return { isPassed: true, reasonVi: `Thăng bằng: M₁ = ${F1} N × ${d1} cm = M₂ = ${F2} N × ${d2} cm = ${M1} g·cm (tính từ khối lượng và lỗ treo đã chọn; góc nghiêng θ = ${theta.toFixed(1)}° đọc trên đĩa chia độ)` };
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
    descriptionVi: 'Xác định độ lớn lực đẩy Archimedes $F_A = P_1 - P_2$ và so sánh với trọng lượng phần chất lỏng bị chiếm chỗ $P_{\\text{tran}}$.',
    targetCompetenciesVi: ['Sử dụng bình tràn', 'Tính lực đẩy Archimedes', 'Đo thể tích vật chìm'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF09-STEP-01',
        titleVi: 'Bước 1: Đổ nước tới miệng vòi tràn của bình tràn',
        instructionVi: 'Đổ nước vào bình tràn cho tới khi nước vừa chớm chảy qua vòi xả rồi đặt cốc hứng dưới vòi.',
        scientificConceptVi: 'Bình tràn xác định thể tích vật choán chỗ thông qua lượng nước tràn ra.',
        mathFormulaLatex: '$V_{\\text{chiem cho}} = V_{\\text{tran}}$',
        requiredArchetypes: ['overflow-can', 'beaker-250'],
        suggestedActionVi: 'Đổ nước đầy bình tràn và hứng cốc dưới vòi',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): code cũ tìm includes('OVR')/'CAN' — không asset nào chứa
          // hai chuỗi đó (id thật OL3D-EQP-OVF-0001) — rồi vẫn pass vô điều kiện.
          const can = instances.find((i) => i.assetId === 'OL3D-EQP-OVF-0001');
          if (!can) return { isPassed: false, reasonVi: 'Chưa đặt bình tràn Eureka lên bàn', hintVi: 'Mở kệ Đo thể tích và đặt “Bình tràn Eureka 250 ml” lên bàn' };
          const level = can.instanceState.baseLiquidLevelMl;
          if (typeof level !== 'number' || !Number.isFinite(level)) return { isPassed: false, reasonVi: 'Chưa đọc được mực nước trong bình tràn', hintVi: 'Đặt bình tràn lên bàn rồi đọc lại' };
          if (level < 209.5) return { isPassed: false, reasonVi: `Bình tràn mới có ${level.toFixed(1)} ml, chưa đầy tới miệng vòi (210 ml)`, hintVi: 'Kéo bình tràn vào vòi bình cấp nước để châm đầy tới miệng vòi (210 ml)' };
          return { isPassed: true, reasonVi: `Bình tràn đã đầy nước tới miệng vòi ($V = ${level.toFixed(1)}\\text{ ml}$, đo được)` };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF09-STEP-02',
        titleVi: 'Bước 2: Móc khối kim loại vào lực kế đo trọng lượng trong không khí',
        instructionVi: 'Treo khối kim loại ($m = 66.25\\,\\text{g}$) vào lực kế ngoài không khí, đọc số chỉ trọng lượng $P_1$.',
        scientificConceptVi: 'Trọng lượng thực trong không khí coi như bằng lực hút Trái Đất.',
        mathFormulaLatex: '$P_1 = m \\cdot g \\approx 0.65\\text{ N}$',
        requiredArchetypes: ['spring-dynamometer', 'solid-cylinder'],
        suggestedActionVi: 'Móc khối nhôm vào móc lực kế',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): P1 là TÍNH từ khối lượng mẫu trong catalog (m × g), không phải
          // lực kế đo trực tiếp — ghi rõ trong reason (mẫu WF-07 b.3, Vòng 1).
          const dyna = instances.find((i) => i.assetId === 'OL3D-EQP-DYN-0001');
          if (!dyna) return { isPassed: false, reasonVi: 'Chưa đặt lực kế lên bàn', hintVi: 'Đặt lực kế lò xo 5 N lên bàn' };
          const cyl = instances.find((i) => i.assetId === 'OL3D-EQP-SLD-0001');
          if (!cyl) return { isPassed: false, reasonVi: 'Chưa đặt trụ nhôm lên bàn', hintVi: 'Đặt trụ nhôm SLD-0001 lên bàn rồi móc vào lực kế' };
          if (cyl.instanceState.attachedToInstanceId !== dyna.instanceId || cyl.instanceState.attachmentSlot !== 'dynamometer-hook') {
            return { isPassed: false, reasonVi: 'Trụ nhôm chưa móc vào lực kế', hintVi: 'Móc trụ nhôm vào móc lực kế (hoặc bấm “Cân bằng lực kế”)' };
          }
          const f = dyna.instanceState.springExtensionN;
          if (typeof f !== 'number' || !Number.isFinite(f)) return { isPassed: false, reasonVi: 'Lực kế chưa đọc được lực', hintVi: 'Móc trụ nhôm vào lực kế rồi đọc lại' };
          if (Math.abs(f - 0.65) > 0.02) return { isPassed: false, reasonVi: `Lực kế đang chỉ $P = ${f.toFixed(2)}\\text{ N}$, chưa phải 0,65 N của trụ nhôm 66,25 g`, hintVi: 'Đang treo vật khác — cần trụ nhôm SLD-0001 (66,25 g)' };
          return { isPassed: true, reasonVi: `Trọng lượng vật ngoài không khí: $P_1 = ${f.toFixed(2)}\\text{ N}$ (đo được trên lực kế; $P_1 = m \\cdot g = 66,25\\text{ g} \\times 9,81$ tính ra khớp số đo)` };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF09-STEP-03',
        titleVi: 'Bước 3: Nhúng chìm vật vào bình tràn và hứng lượng nước tràn',
        instructionVi: 'Từ từ hạ vật chìm hoàn toàn vào nước trong bình tràn, đọc thể tích nước tràn ra rồi tính $F_A$ (lưu ý: vật đang chìm thì không còn móc trên lực kế nên $P_2 = 0.41\\,\\text{N}$ là tính ra, không phải đọc trên lực kế).',
        scientificConceptVi: 'Lực đẩy Archimedes bằng hiệu trọng lượng và bằng trọng lượng nước tràn: $F_A = P_1 - P_2 = d \\cdot V$.',
        mathFormulaLatex: '$F_A = 0.65 - 0.41 = 0.24\\text{ N} = P_{\\text{tran}}$',
        requiredArchetypes: ['overflow-can', 'spring-dynamometer'],
        suggestedActionVi: 'Nhúng ngập vật vào lòng bình tràn',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): một vật chỉ có MỘT attachmentSlot — đang móc trên lực kế thì
          // không thể đồng thời ở trong bình, nên P2 = 0,41 N không đọc trực tiếp được trên lực
          // kế. Guard kiểm tra thể tích tràn đo được; F_A và P2 là TÍNH RA, ghi rõ trong reason.
          const can = instances.find((i) => i.assetId === 'OL3D-EQP-OVF-0001');
          if (!can) return { isPassed: false, reasonVi: 'Chưa đặt bình tràn Eureka lên bàn', hintVi: 'Đặt bình tràn lên bàn trước' };
          const cyl = instances.find((i) => i.assetId === 'OL3D-EQP-SLD-0001');
          if (!cyl) return { isPassed: false, reasonVi: 'Chưa đặt trụ nhôm lên bàn', hintVi: 'Đặt trụ nhôm SLD-0001 lên bàn' };
          if (cyl.instanceState.attachedToInstanceId !== can.instanceId || cyl.instanceState.attachmentSlot !== 'inside-vessel') {
            return { isPassed: false, reasonVi: 'Trụ nhôm chưa chìm trong bình tràn', hintVi: 'Hạ trụ nhôm chìm hẳn vào bình tràn đã đầy nước' };
          }
          const spilled = can.instanceState.overflowingVolumeMl;
          if (typeof spilled !== 'number' || !Number.isFinite(spilled)) return { isPassed: false, reasonVi: 'Chưa đọc được thể tích nước tràn', hintVi: 'Nhúng trụ nhôm vào bình tràn đã đầy nước rồi đọc lại' };
          if (Math.abs(spilled - 24.5) > 2.5) {
            return { isPassed: false, reasonVi: `Nước tràn mới ${spilled.toFixed(1)} ml, chưa phải 24,5 ml của trụ nhôm`, hintVi: 'Bình tràn chưa đầy tới miệng vòi nên chưa tràn đủ — quay lại bước 1 châm đầy 210 ml rồi nhúng lại' };
          }
          const fa = spilled * 0.00980665;
          const p2 = 0.65 - fa;
          return { isPassed: true, reasonVi: `Nước tràn đo được $V = ${spilled.toFixed(1)}\\text{ ml}$ → $F_A = ${fa.toFixed(2)}\\text{ N}$ (tính ra từ thể tích tràn), $P_2 = P_1 - F_A \\approx ${p2.toFixed(2)}\\text{ N}$ (tính ra, KHÔNG phải đọc trên lực kế vì vật đang chìm thì không còn móc trên lực kế)` };
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
        requiredArchetypes: ['electronic-balance'],
        suggestedActionVi: 'Dùng thìa múc muối lên đĩa cân',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): KHÔNG viết guard giả cho bước này — asset NaCl và cơ chế
          // múc mẫu 10,0 g chưa tồn tại trong code (không vật nào trên đĩa cân ra đúng 10,0 g).
          // Guard giữ fail cho tới khi có asset NaCl; xem docs/implementation/GUARDS_VONG3_WF09_WF15.md.
          return { isPassed: false, reasonVi: 'Chưa thể cân 10,0 g NaCl — thiết bị muối ăn chưa có trong phòng thí nghiệm', hintVi: 'Bước này cần asset NaCl (đang chờ bổ sung) — làm tiếp bước 2 để đong nước' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF10-STEP-02',
        titleVi: 'Bước 2: Đong 90 ml nước cất bằng ống đong 100 ml',
        instructionVi: 'Rót nước cất vào ống đong tới đúng vạch 90 ml ($m_{\\text{nuoc}} \\approx 90.0\\text{ g}$).',
        scientificConceptVi: 'Khối lượng riêng của nước nguyên chất ở $20^\\circ\\text{C}$ xấp xỉ $1.0\\text{ g/ml}$.',
        mathFormulaLatex: '$m_{\\text{nuoc}} = D \\cdot V = 1.0 \\times 90 = 90.0\\text{ g}$',
        requiredArchetypes: ['graduated-cylinder', 'water-dispenser'],
        suggestedActionVi: 'Đong 90 ml nước cất',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): đọc baseLiquidLevelMl (sau reconcile bằng liquidLevelMl khi ống rỗng).
          // Ống ban đầu 50 ml, rót từ cốc 2 lần × 20 ml = 90 ml; vòi bình cấp +25 ml/lần sẽ vượt.
          const cyl = instances.find((i) => i.assetId === 'OL3D-EQP-CYL-0001');
          if (!cyl) return { isPassed: false, reasonVi: 'Chưa đặt ống đong 100 ml lên bàn', hintVi: 'Đặt ống đong 100 ml lên bàn' };
          const v = cyl.instanceState.baseLiquidLevelMl;
          if (typeof v !== 'number' || !Number.isFinite(v)) return { isPassed: false, reasonVi: 'Chưa đọc được mực nước trong ống đong', hintVi: 'Đặt ống đong lên bàn rồi đọc lại' };
          if (v < 88) return { isPassed: false, reasonVi: `Ống đong mới có ${v.toFixed(1)} ml, chưa đủ 90 ml`, hintVi: 'Rót thêm nước từ cốc (mỗi lần rót 20 ml)' };
          if (v > 92) return { isPassed: false, reasonVi: `Ống đong đang có ${v.toFixed(1)} ml, thừa quá 90 ml`, hintVi: 'Đổ bớt nước ra rồi đong lại tới 90 ml' };
          return { isPassed: true, reasonVi: `Đã đong đủ nước cất: $V = ${v.toFixed(1)}\\text{ ml}$ (đo được trong ống đong, $m \\approx ${v.toFixed(1)}\\text{ g}$)` };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF10-STEP-03',
        titleVi: 'Bước 3: Đổ vào cốc và khuấy tan hoàn toàn bằng đũa thủy tinh',
        instructionVi: 'Cho muối và nước vào cốc thủy tinh 250 ml, dùng đũa khuấy đều theo 1 chiều đến khi tan hết.',
        scientificConceptVi: 'Quá trình khuấy làm tăng tốc độ khuếch tán các ion $Na^+$ và $Cl^-$ vào dung môi nước.',
        mathFormulaLatex: '$C\\% = \\frac{10.0}{10.0 + 90.0} \\times 100\\% = 10.0\\%$',
        requiredArchetypes: ['beaker-250'],
        suggestedActionVi: 'Dùng đũa thủy tinh khuấy tan dung dịch trong cốc',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): KHÔNG viết guard pass giả — đũa khuấy và trạng thái "đã khuấy"
          // chưa tồn tại. Ghi rõ: C% chỉ là tính từ khối lượng đã cân và thể tích đã đong,
          // việc tan hoàn toàn chưa có cảm biến nào xác nhận.
          return { isPassed: false, reasonVi: 'Chưa thể xác nhận muối tan hoàn toàn — đũa khuấy và cảm biến hòa tan chưa có trong phòng thí nghiệm', hintVi: 'Bước này cần asset đũa khuấy + thao tác khuấy (đang chờ bổ sung). C% = 10,0/(10,0+90,0) × 100% = 10,0% mới chỉ là tính từ khối lượng đã cân và thể tích đã đong' };
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
    descriptionVi: 'Đặt cốc nước có cắm nhiệt kế và dùng đèn cồn đặt sát cốc để đun sôi, ghi nhận đường cong tăng nhiệt $\\Delta T(t)$. (Kiềng sắt và lưới amiăng chưa có trong phòng thí nghiệm nên không dùng trong bài này.)',
    targetCompetenciesVi: ['Thao tác an toàn nhiệt và đèn cồn', 'Ghi nhật ký nhiệt độ theo thời gian', 'Cân bằng nhiệt lượng'],
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF11-STEP-01',
        titleVi: 'Bước 1: Đặt cốc nước, cắm nhiệt kế và đặt đèn cồn cạnh cốc',
        instructionVi: 'Đặt cốc nước lên bàn, cắm nhiệt kế vào trong cốc và đặt đèn cồn sát cạnh cốc (trong 35 cm) để chuẩn bị đun.',
        scientificConceptVi: 'Nhiệt lượng từ ngọn lửa đèn cồn truyền vào đáy cốc rồi vào nước; nhiệt kế cắm trong cốc đo đúng nhiệt độ nước.',
        mathFormulaLatex: '$m_{\\text{nuoc}} = 0.10\\text{ kg}, \\quad c = 4184\\text{ J/(kg}\\cdot\\text{K)}$',
        requiredArchetypes: ['beaker-250', 'thermometer', 'alcohol-burner'],
        suggestedActionVi: 'Đặt cốc nước, cắm nhiệt kế vào cốc, đặt đèn cồn sát cốc',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): kiềng sắt và lưới amiăng không có trong catalog nên đề cũ
          // không làm được — viết lại đề theo đúng thiết bị có thật (BKR + THM + ALC).
          // Khoảng cách đèn–cốc ≤ 0,35 m là ngưỡng isDirectlyHeated trong reconcile (App.tsx).
          const bkr = instances.find((i) => i.assetId === 'OL3D-EQP-BKR-0001');
          if (!bkr) return { isPassed: false, reasonVi: 'Chưa đặt cốc nước lên bàn', hintVi: 'Đặt cốc đong 250 ml chứa nước lên bàn' };
          const thm = instances.find((i) => i.assetId === 'OL3D-EQP-THM-0001');
          if (!thm) return { isPassed: false, reasonVi: 'Chưa đặt nhiệt kế lên bàn', hintVi: 'Đặt nhiệt kế lên bàn rồi cắm vào trong cốc nước' };
          if (thm.instanceState.attachedToInstanceId !== bkr.instanceId || thm.instanceState.attachmentSlot !== 'inside-vessel') {
            return { isPassed: false, reasonVi: 'Nhiệt kế chưa cắm vào trong cốc nước', hintVi: 'Kéo nhiệt kế thả vào trong cốc nước' };
          }
          const alc = instances.find((i) => i.assetId === 'OL3D-EQP-ALC-0001');
          if (!alc) return { isPassed: false, reasonVi: 'Chưa đặt đèn cồn lên bàn', hintVi: 'Đặt đèn cồn lên bàn, sát cạnh cốc nước' };
          const dx = alc.transform.positionM[0] - bkr.transform.positionM[0];
          const dz = alc.transform.positionM[2] - bkr.transform.positionM[2];
          const dist = Math.hypot(dx, dz);
          if (dist > 0.35) return { isPassed: false, reasonVi: `Đèn cồn đang cách cốc ${(dist * 100).toFixed(0)} cm, quá xa để đun`, hintVi: 'Đặt đèn cồn sát dưới đáy cốc (trong 35 cm)' };
          return { isPassed: true, reasonVi: `Cốc nước đã đặt, nhiệt kế cắm trong cốc, đèn cồn cách cốc ${(dist * 100).toFixed(0)} cm — sẵn sàng đun` };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF11-STEP-02',
        titleVi: 'Bước 2: Đặt đèn cồn sát cốc và châm lửa đun',
        instructionVi: 'Mở nắp đèn cồn, đặt đèn sát dưới đáy cốc và châm lửa để truyền nhiệt lượng vào đáy cốc.',
        scientificConceptVi: 'Quá trình đốt cháy cồn ethanol tỏa nhiệt lượng: $C_2H_5OH + 3O_2 \\to 2CO_2 + 3H_2O + Q$.',
        mathFormulaLatex: '$P_{\\text{lua}} \\approx 350\\text{ W}$',
        requiredArchetypes: ['alcohol-burner'],
        suggestedActionVi: 'Bật ngọn lửa đèn cồn',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): tìm đúng ALC-0001 (không includes 'BRN' — không asset nào
          // chứa 'BRN'); không dùng ?? để bù — thiếu trường = chưa châm lửa = FAIL.
          const burner = instances.find((i) => i.assetId === 'OL3D-EQP-ALC-0001');
          if (!burner) return { isPassed: false, reasonVi: 'Chưa đặt đèn cồn lên bàn thí nghiệm', hintVi: 'Đặt đèn cồn lên bàn trước' };
          const isLit = burner.instanceState.isFlameLit === true || burner.instanceState.isHeating === true;
          return { isPassed: isLit, reasonVi: isLit ? 'Ngọn lửa đèn cồn cháy xanh đều, bắt đầu truyền nhiệt lượng' : 'Đèn cồn chưa được châm lửa', hintVi: isLit ? undefined : 'Bấm nút châm lửa trên đèn cồn' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF11-STEP-03',
        titleVi: 'Bước 3: Theo dõi tăng nhiệt độ và quá trình sôi ở 100°C',
        instructionVi: 'Quan sát chỉ số nhiệt kế tăng liên tục tới $100^\\circ\\text{C}$, bọt khí sôi sục và nhiệt độ giữ nguyên.',
        scientificConceptVi: 'Trong suốt quá trình chuyển thể từ lỏng sang hơi, nhiệt độ của chất lỏng nguyên chất không thay đổi.',
        mathFormulaLatex: '$T = 100^\\circ\\text{C} = \\text{const}, \\quad Q = L \\cdot m$',
        requiredArchetypes: ['thermometer', 'alcohol-burner', 'digital-stopwatch'],
        suggestedActionVi: 'Quan sát nhiệt kế đạt mốc 100 độ C',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): guard cũ chỉ đọc temperatureC ≥ 99,5 — bấm sang bước 4 trong
          // luồng hướng dẫn là T bị set thẳng 100 °C (placeThermalBenchIfOnShelf 'boiling'),
          // preset nhiệt kế cũng set trực tiếp → pass giả. Guard mới đòi đủ 4 điều kiện:
          // nhiệt kế cắm trong cốc + đèn đang cháy + T ≥ 99,5 + bấm giờ đã chạy ≥ 18 s thật
          // (vòng đun 450 ms/tick, +1,5 °C/tick, 25→100 °C cần 50 tick ≈ 22,5 s).
          const thm = instances.find((i) => i.assetId === 'OL3D-EQP-THM-0001');
          if (!thm) return { isPassed: false, reasonVi: 'Chưa đặt nhiệt kế lên bàn', hintVi: 'Đặt nhiệt kế lên bàn rồi cắm vào trong cốc nước' };
          const bkr = instances.find((i) => i.assetId === 'OL3D-EQP-BKR-0001');
          if (!bkr) return { isPassed: false, reasonVi: 'Chưa đặt cốc nước lên bàn', hintVi: 'Đặt cốc nước lên bàn trước' };
          if (thm.instanceState.attachedToInstanceId !== bkr.instanceId || thm.instanceState.attachmentSlot !== 'inside-vessel') {
            return { isPassed: false, reasonVi: 'Nhiệt kế chưa cắm vào trong cốc nước', hintVi: 'Kéo nhiệt kế thả vào trong cốc nước rồi đun lại' };
          }
          const alc = instances.find((i) => i.assetId === 'OL3D-EQP-ALC-0001');
          if (!alc || (alc.instanceState.isFlameLit !== true && alc.instanceState.isHeating !== true)) {
            return { isPassed: false, reasonVi: 'Đèn cồn đang tắt — nước không thể sôi khi không đun', hintVi: 'Châm lửa đèn cồn rồi theo dõi nhiệt kế tăng dần' };
          }
          const temp = thm.instanceState.temperatureC;
          if (typeof temp !== 'number' || !Number.isFinite(temp)) return { isPassed: false, reasonVi: 'Chưa đọc được nhiệt độ', hintVi: 'Đun tiếp và theo dõi nhiệt kế' };
          if (temp < 99.5) return { isPassed: false, reasonVi: `Nhiệt độ hiện tại đang là $T = ${temp.toFixed(1)}^\\circ\\text{C}$, tiếp tục đun tới $100^\\circ\\text{C}$`, hintVi: 'Để đèn cháy và theo dõi nhiệt kế tăng ~1,5 °C mỗi nhịp' };
          const stw = instances.find((i) => i.assetId === 'OL3D-EQP-STW-0001');
          const t = stw ? Number(stw.instanceState.recordedTimeS) : NaN;
          if (!stw || !Number.isFinite(t) || t < 18) {
            return { isPassed: false, reasonVi: `Nhiệt độ đã ${temp.toFixed(1)} °C nhưng thời gian đun ghi nhận chỉ ${Number.isFinite(t) ? t.toFixed(1) : '0'} s — con số này có thể do bấm nút preset hoặc bấm chuyển bước, chưa phải đun thật`, hintVi: 'Để đèn cháy và theo dõi nhiệt kế tăng dần từ 25 °C lên 100 °C (mất khoảng 22 s)' };
          }
          return { isPassed: true, reasonVi: `Nước đã sôi ở $T = ${temp.toFixed(1)}^\\circ\\text{C}$ sau ${t.toFixed(1)} s đun (nhiệt kế cắm trong cốc, đèn đang cháy — số liệu đo được, không phải preset)` };
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
        mathFormulaLatex: '$I = \\frac{U}{R_x + R_b}$',
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
        instructionVi: 'Đo $U_1 = 3.0\\text{ V}$ và $U_2 = 3.0\\text{ V}$ ($U_{\\text{tong}} = 6.0\\text{ V}$), hai đèn sáng mờ hơn bình thường.',
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
        mathFormulaLatex: '$\\Delta V_{\\text{boc hoi}} \\approx 0\\text{ ml}$',
        requiredArchetypes: ['erlenmeyer-flask'],
        suggestedActionVi: 'Rót nước và nhỏ dầu vào 2 bình tam giác',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): cần đúng 2 bình FLK-0001, mỗi bình ~100 ml (khoảng 95–110 ml:
          // ban đầu 125 ml, rót ra 1 lần 20 ml = 105 ml). Lớp dầu không có trong code nên
          // không kiểm tra dầu — đề ghi "giả định đã có màng dầu".
          const flasks = instances.filter((i) => i.assetId === 'OL3D-EQP-FLK-0001');
          if (flasks.length < 2) return { isPassed: false, reasonVi: `Mới có ${flasks.length} bình tam giác, cần 2 bình (thực nghiệm + đối chứng)`, hintVi: 'Đặt thêm một bình tam giác thứ hai để làm đối chứng' };
          for (const [idx, f] of flasks.slice(0, 2).entries()) {
            const v = f.instanceState.baseLiquidLevelMl;
            if (typeof v !== 'number' || !Number.isFinite(v)) return { isPassed: false, reasonVi: `Chưa đọc được mực nước bình ${idx + 1}`, hintVi: 'Đặt bình lên bàn rồi đọc lại' };
            if (v < 95 || v > 110) return { isPassed: false, reasonVi: `Bình ${idx + 1} đang có ${v.toFixed(1)} ml nước, chưa phải khoảng 100 ml`, hintVi: 'Rót bớt/thêm nước tới khoảng 100 ml mỗi bình' };
          }
          const v1 = flasks[0].instanceState.baseLiquidLevelMl as number;
          const v2 = flasks[1].instanceState.baseLiquidLevelMl as number;
          return { isPassed: true, reasonVi: `Đã chuẩn bị 2 bình tam giác: ${v1.toFixed(1)} ml và ${v2.toFixed(1)} ml nước (đo được; lớp dầu giả định đã có)` };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF14-STEP-02',
        titleVi: 'Bước 2: Cắm cành có lá vào bình A và cành tỉa hết lá vào bình B',
        instructionVi: 'Cắm cành tươi nguyên vẹn lá vào bình A (thực nghiệm) và cành đã ngắt sạch lá vào bình B (đối chứng).',
        scientificConceptVi: 'Thiết kế thí nghiệm đối chứng đơn biến để cô lập yếu tố thoát hơi nước qua bề mặt lá.',
        mathFormulaLatex: '$A: \\text{Co la} \\quad \\text{vs} \\quad B: \\text{Khong la}$',
        requiredArchetypes: ['erlenmeyer-flask'],
        suggestedActionVi: 'Cắm 2 cành cây vào 2 bình',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): KHÔNG viết guard pass giả — asset cành cây chưa tồn tại,
          // không có trường nào phân biệt "có lá/không lá". Guard chặn cho tới khi có asset.
          return { isPassed: false, reasonVi: 'Chưa thể cắm cành cây — asset cành cây (có lá / không lá) chưa có trong phòng thí nghiệm', hintVi: 'Bước này cần asset plant-twig (đang chờ bổ sung)' };
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
          // C-11/C-17 (Vòng 3): KHÔNG viết guard pass giả — chưa có cành cây, chưa có cơ chế
          // thời gian/thoát hơi nối vào instance (evaporationRate chỉ nội bộ trong bus),
          // và đề bài đo Δh bằng mm trong khi bình đo bằng ml.
          return { isPassed: false, reasonVi: 'Chưa thể đo độ tụt mực nước — cần cành cây và cơ chế mô phỏng thoát hơi theo thời gian (đang chờ bổ sung)', hintVi: 'Làm xong bước 1 rồi chờ asset cành cây và cơ chế thời gian' };
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
        requiredArchetypes: [],
        suggestedActionVi: 'Rót các mẫu hóa chất vào khay sứ',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): KHÔNG viết guard pass giả — khay mẫu và các mẫu dung dịch
          // chưa có trong phòng thí nghiệm. Guard chặn cho tới khi có asset mẫu + khay.
          return { isPassed: false, reasonVi: 'Chưa thể chuẩn bị mẫu dung dịch — khay mẫu và các mẫu (axit / bazơ / nước cất) chưa có trong phòng thí nghiệm', hintVi: 'Bước này cần asset khay mẫu + mẫu dung dịch (đang chờ bổ sung)' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF15-STEP-02',
        titleVi: 'Bước 2: Dùng đũa thủy tinh chấm giọt dung dịch lên giấy chỉ thị màu',
        instructionVi: 'Nhúng đầu đũa thủy tinh sạch vào dung dịch, chấm lên mẩu giấy chỉ thị pH vạn năng.',
        scientificConceptVi: 'Chất chỉ thị chuyển dịch cân bằng ion tạo hợp chất có cấu trúc màu đặc trưng theo độ pH.',
        mathFormulaLatex: '$HIn \\rightleftharpoons H^+ + In^-$',
        requiredArchetypes: [],
        suggestedActionVi: 'Chấm giọt dung dịch lên giấy pH',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): KHÔNG viết guard pass giả — giấy chỉ thị và đũa thủy tinh
          // chưa có trong phòng thí nghiệm. Guard chặn cho tới khi có asset.
          return { isPassed: false, reasonVi: 'Chưa thể chấm giấy chỉ thị — giấy pH và đũa thủy tinh chưa có trong phòng thí nghiệm', hintVi: 'Bước này cần asset giấy chỉ thị pH + đũa khuấy (đang chờ bổ sung)' };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF15-STEP-03',
        titleVi: 'Bước 3: So sánh thang màu chuẩn và xác định giá trị pH',
        instructionVi: 'Đối chiếu màu sắc của giấy quỳ / giấy pH với dải màu chuẩn: Đỏ cam (Axit pH ~ 3), Xanh thẫm (Bazơ pH ~ 11), Vàng lục (Nước cất pH = 7).',
        scientificConceptVi: 'Phân loại dung dịch theo thang đo: $\\text{pH} < 7$ (axit), $\\text{pH} = 7$ (trung tính), $\\text{pH} > 7$ (bazơ).',
        mathFormulaLatex: '$\\text{pH}_{\\text{axit}} = 3.0, \\quad \\text{pH}_{\\text{nuoc}} = 7.0, \\quad \\text{pH}_{\\text{bazo}} = 11.5$',
        requiredArchetypes: ['digital-multimeter'],
        suggestedActionVi: 'So sánh màu với bảng màu chuẩn',
        validationGuard: (instances) => {
          // C-11/C-17 (Vòng 3): máy đo pH PHM-0001 (Vòng 3) dùng thân máy digital-multimeter
          // (theo đúng manifest của module HTML PHM: "proceduralArchetype": "digital-multimeter").
          // Guard chỉ kiểm tra "đã chọn đúng mẫu đo bằng nút preset trong module" — CHƯA phải
          // nhúng đầu dò vào mẫu thật, ghi rõ trong reason.
          const phm = instances.find((i) => i.assetId === 'OL3D-EQP-PHM-0001');
          if (!phm) return { isPassed: false, reasonVi: 'Chưa đặt máy đo pH lên bàn', hintVi: 'Đặt máy đo pH hiện số PHM-0001 lên bàn' };
          const mode = phm.instanceState.multimeterMode as unknown as string;
          if (mode !== 'pH') return { isPassed: false, reasonVi: 'Máy đo pH chưa ở chế độ đo pH', hintVi: 'Bấm nút chọn mẫu đo trong module máy đo pH (Axit / Nước cất / Kiềm)' };
          const v = phm.instanceState.multimeterValue;
          if (typeof v !== 'number' || !Number.isFinite(v)) return { isPassed: false, reasonVi: 'Máy đo pH chưa có số đọc', hintVi: 'Bấm nút chọn mẫu đo trong module máy đo pH' };
          const presets = [2.9, 7.0, 11.5];
          const match = presets.find((p) => Math.abs(v - p) <= 0.05);
          if (match === undefined) return { isPassed: false, reasonVi: `Số đọc pH = ${v.toFixed(2)} không khớp mẫu nào (Axit 2,90 / Nước cất 7,00 / Kiềm 11,50)`, hintVi: 'Bấm nút chọn mẫu đo trong module máy đo pH' };
          const label = match === 2.9 ? 'Axit CH₃COOH' : match === 7.0 ? 'Nước cất (trung tính)' : 'Dung dịch Kiềm';
          return { isPassed: true, reasonVi: `Đã chọn mẫu đo: ${label} — pH = ${v.toFixed(2)} (CHỌN BẰNG NÚT PRESET trong module máy đo pH, chưa phải nhúng đầu dò vào mẫu thật; muốn đo thật cần thêm cơ chế nhúng đầu dò vào ống mẫu)` };
        },
      },
    ],
  },
};
