/**
 * OPENLAB 3D — EXPERIMENT WORKFLOWS ENGINE (WF-01 .. WF-06)
 * Standards: SGK KHTN 6, 7, 8, 9 Bộ GD&ĐT & Master Spec v3.0.0
 * Architecture: FSM-based step progression, topology verification, pre-condition guards.
 */

import { SceneInstance } from '../domain/types';

export interface WorkflowStepSpec {
  stepIndex: number;
  stepId: string;
  titleVi: string;
  instructionVi: string;
  requiredArchetypes: string[];
  requiredConnectors?: string[];
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
  steps: WorkflowStepSpec[];
}

export const EXPERIMENT_WORKFLOWS: Record<string, ExperimentWorkflowDefinition> = {
  // =========================================================================
  // WF-01: ĐO KHỐI LƯỢNG VÀ TRỪ BÌ BẰNG CÂN ĐIỆN TỬ 500 G
  // =========================================================================
  'WF-01': {
    workflowId: 'WF-01',
    titleVi: 'Đo khối lượng và thực hành trừ bì (TARE) bằng cân điện tử',
    curriculumLessonVi: 'KHTN 6 · Bài 4: Đo khối lượng | KHTN 8 · Bài 14: Đo khối lượng riêng',
    subject: 'physics',
    gradeLevel: 6,
    descriptionVi: 'Học sinh làm quen với quy trình chuẩn hóa điểm 0, đặt cốc đong, bấm phím TARE để trừ bì và xác định khối lượng tịnh của chất lỏng/mẫu vật.',
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF01-STEP-01',
        titleVi: 'Bước 1: Bật nguồn cân và kiểm tra điểm 0',
        instructionVi: 'Đặt cân điện tử trên bàn thí nghiệm, bấm công tắc nguồn ON và đảm bảo màn hình hiển thị 0.00 g.',
        requiredArchetypes: ['electronic-balance'],
        validationGuard: (instances) => {
          const balance = instances.find((i) => i.assetId.includes('BAL') || i.instanceState.isPoweredOn !== undefined);
          if (!balance) return { isPassed: false, reasonVi: 'Chưa đưa cân điện tử lên bàn thí nghiệm', hintVi: 'Kéo Cân điện tử từ thư viện vào bàn' };
          const isPoweredOn = balance.instanceState.isPoweredOn !== false;
          if (!isPoweredOn) return { isPassed: false, reasonVi: 'Cân chưa được bật nguồn', hintVi: 'Bấm nút nguồn trên cân' };
          return { isPassed: true, reasonVi: 'Cân đã bật nguồn và sẵn sàng ở điểm 0.00 g' };
        },
      },
      {
        stepIndex: 2,
        stepId: 'WF01-STEP-02',
        titleVi: 'Bước 2: Đặt cốc đong lên đĩa cân',
        instructionVi: 'Đặt cốc đong (Beaker 250ml) lên tâm đĩa cân để đọc khối lượng vỏ cốc thô.',
        requiredArchetypes: ['electronic-balance', 'beaker-250'],
        validationGuard: (instances) => {
          const balance = instances.find((i) => i.assetId.includes('BAL'));
          const beaker = instances.find((i) => i.assetId.includes('BKR'));
          if (!balance || !beaker) return { isPassed: false, reasonVi: 'Thiếu cân hoặc cốc đong trên bàn' };
          const rawMass = Number(balance.instanceState.measuredMassG ?? 0);
          if (rawMass <= 10.0) return { isPassed: false, reasonVi: 'Chưa đặt cốc đong lên đĩa cân', hintVi: 'Kéo cốc đong thả vào đĩa cân' };
          return { isPassed: true, reasonVi: `Đã đặt cốc lên đĩa cân (m_gross = ${rawMass.toFixed(1)} g)` };
        },
      },
      {
        stepIndex: 3,
        stepId: 'WF01-STEP-03',
        titleVi: 'Bước 3: Bấm phím TARE để trừ bì',
        instructionVi: 'Bấm phím TARE trên cân để màn hình trở về 0.00 g, sẵn sàng đo chất lỏng rót vào.',
        requiredArchetypes: ['electronic-balance'],
        validationGuard: (instances) => {
          const balance = instances.find((i) => i.assetId.includes('BAL'));
          if (!balance) return { isPassed: false, reasonVi: 'Không tìm thấy cân điện tử' };
          const tareOffset = Number(balance.instanceState.tareOffsetG ?? 0);
          if (tareOffset <= 0) return { isPassed: false, reasonVi: 'Chưa bấm phím TARE để trừ bì', hintVi: 'Nhấn nút TARE trên bảng điều khiển cân' };
          return { isPassed: true, reasonVi: `Trừ bì thành công (m_tare = ${tareOffset.toFixed(1)} g, m_net = 0.00 g)` };
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
    steps: [
      {
        stepIndex: 1,
        stepId: 'WF06-STEP-01',
        titleVi: 'Bước 1: Bố trí giá quang học và lắp nguồn điện',
        instructionVi: 'Đặt ray quang học 100 cm trên bàn, đặt bộ nguồn DC 12V cạnh ray.',
        requiredArchetypes: ['optical-bench', 'optical-power-supply'],
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
        requiredArchetypes: ['optical-power-supply', 'optical-lamp'],
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
        requiredArchetypes: ['optical-lens', 'optical-screen'],
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
          return { isPassed: true, reasonVi: `Ảnh thật rõ nét thu được trên màn tại d' = ${expectedDPrime.toFixed(1)} cm` };
        },
      },
    ],
  },
};

export class ExperimentWorkflowEngine {
  private static instance: ExperimentWorkflowEngine;

  private constructor() {}

  public static getInstance(): ExperimentWorkflowEngine {
    if (!ExperimentWorkflowEngine.instance) {
      ExperimentWorkflowEngine.instance = new ExperimentWorkflowEngine();
    }
    return ExperimentWorkflowEngine.instance;
  }

  public getWorkflow(workflowId: string): ExperimentWorkflowDefinition | null {
    return EXPERIMENT_WORKFLOWS[workflowId] ?? null;
  }

  public listWorkflows(): ExperimentWorkflowDefinition[] {
    return Object.values(EXPERIMENT_WORKFLOWS);
  }

  public validateStep(
    workflowId: string,
    stepIndex: number,
    instances: SceneInstance[],
    topology?: any
  ): { isPassed: boolean; reasonVi: string; hintVi?: string } {
    const wf = this.getWorkflow(workflowId);
    if (!wf) return { isPassed: false, reasonVi: 'Không tìm thấy quy trình thí nghiệm' };
    const step = wf.steps.find((s) => s.stepIndex === stepIndex);
    if (!step) return { isPassed: false, reasonVi: 'Không tìm thấy bước thí nghiệm' };
    return step.validationGuard(instances, topology);
  }
}

export const experimentWorkflowEngine = ExperimentWorkflowEngine.getInstance();
