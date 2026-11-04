/**
 * OPENLAB 3D — EXPERIMENT WORKFLOW ENGINE & AR NEURAL STEP RUNTIME
 * Integrates with NeuralConnectionEngine, FSM Workflow Execution, and Pedagogical Guidance.
 */

import { SceneInstance } from '../domain/types';
import { EXPERIMENT_WORKFLOWS, ExperimentWorkflowDefinition, WorkflowStepSpec } from './ExperimentWorkflows';
import { neuralConnectionEngine } from '../domain/neuralConnectionEngine';

export interface WorkflowProgressState {
  workflowId: string | null;
  stepIndex: number;
  totalSteps: number;
  isCompleted: boolean;
  scorePercent: number;
  elapsedSeconds: number;
  currentStep: WorkflowStepSpec | null;
}

export interface ARNeuralRecommendation {
  hasRecommendation: boolean;
  stepIndex: number;
  titleVi: string;
  instructionVi: string;
  actionVerbVi: string;
  scientificConceptVi: string;
  mathFormulaLatex: string;
  sourceAssetId?: string;
  targetAssetId?: string;
  hintVi?: string;
}

export class ExperimentWorkflowEngine {
  private static instance: ExperimentWorkflowEngine;

  private _activeWorkflowId: string | null = null;
  private _currentStepIndex: number = 1;
  private _completedStepIndices: Set<number> = new Set();
  private _workflowStartTime: number = 0;
  private _isCompleted: boolean = false;
  private _stepDwellTimeSeconds: number = 0;

  private constructor() {}

  public static getInstance(): ExperimentWorkflowEngine {
    if (!ExperimentWorkflowEngine.instance) {
      ExperimentWorkflowEngine.instance = new ExperimentWorkflowEngine();
    }
    return ExperimentWorkflowEngine.instance;
  }

  public listWorkflows(): ExperimentWorkflowDefinition[] {
    return Object.values(EXPERIMENT_WORKFLOWS);
  }

  public getWorkflow(workflowId: string): ExperimentWorkflowDefinition | null {
    return EXPERIMENT_WORKFLOWS[workflowId] ?? null;
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

  public startWorkflow(workflowId: string): boolean {
    const wf = this.getWorkflow(workflowId);
    if (!wf) return false;

    this._activeWorkflowId = workflowId;
    this._currentStepIndex = 1;
    this._completedStepIndices.clear();
    this._workflowStartTime = Date.now();
    this._isCompleted = false;
    this._stepDwellTimeSeconds = 0;

    this._dispatchEngineEvent('openlab:workflow-started', {
      workflowId,
      firstStep: wf.steps[0] ?? null,
    });

    return true;
  }

  public stopWorkflow(): void {
    const prevWfId = this._activeWorkflowId;
    this._activeWorkflowId = null;
    this._currentStepIndex = 1;
    this._completedStepIndices.clear();
    this._isCompleted = false;

    if (prevWfId) {
      this._dispatchEngineEvent('openlab:workflow-stopped', { workflowId: prevWfId });
    }
  }

  public getActiveWorkflow(): ExperimentWorkflowDefinition | null {
    if (!this._activeWorkflowId) return null;
    return this.getWorkflow(this._activeWorkflowId);
  }

  public getCurrentStep(): WorkflowStepSpec | null {
    const wf = this.getActiveWorkflow();
    if (!wf) return null;
    return wf.steps.find((s) => s.stepIndex === this._currentStepIndex) ?? null;
  }

  public getProgressState(): WorkflowProgressState {
    const wf = this.getActiveWorkflow();
    if (!wf) {
      return {
        workflowId: null,
        stepIndex: 0,
        totalSteps: 0,
        isCompleted: false,
        scorePercent: 0,
        elapsedSeconds: 0,
        currentStep: null,
      };
    }

    const totalSteps = wf.steps.length;
    const completedCount = this._completedStepIndices.size;
    const scorePercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
    const elapsedSeconds = this._workflowStartTime > 0 ? (Date.now() - this._workflowStartTime) / 1000 : 0;

    return {
      workflowId: wf.workflowId,
      stepIndex: this._currentStepIndex,
      totalSteps,
      isCompleted: this._isCompleted,
      scorePercent,
      elapsedSeconds,
      currentStep: this.getCurrentStep(),
    };
  }

  /**
   * Đánh giá bước thí nghiệm hiện tại theo thời gian thực (Precondition Guard Validation)
   */
  public evaluateCurrentStep(
    instances: SceneInstance[],
    topology?: any
  ): { isPassed: boolean; reasonVi: string; hintVi?: string } {
    const step = this.getCurrentStep();
    if (!step) {
      return { isPassed: false, reasonVi: 'Không có bài thí nghiệm nào đang diễn ra' };
    }
    return step.validationGuard(instances, topology);
  }

  /**
   * Tiến bước thí nghiệm (FSM Transition) nếu điều kiện thỏa mãn
   */
  public advanceStep(
    instances: SceneInstance[],
    topology?: any
  ): { success: boolean; reasonVi: string; isWorkflowFinished: boolean } {
    const wf = this.getActiveWorkflow();
    const step = this.getCurrentStep();
    if (!wf || !step) {
      return { success: false, reasonVi: 'Không có bài thí nghiệm', isWorkflowFinished: false };
    }

    const evalResult = step.validationGuard(instances, topology);
    if (!evalResult.isPassed) {
      return {
        success: false,
        reasonVi: evalResult.reasonVi,
        isWorkflowFinished: false,
      };
    }

    this._completedStepIndices.add(step.stepIndex);
    this._stepDwellTimeSeconds = 0;

    const nextStep = wf.steps.find((s) => s.stepIndex === step.stepIndex + 1);
    if (nextStep) {
      this._currentStepIndex = nextStep.stepIndex;
      this._dispatchEngineEvent('openlab:workflow-step-advanced', {
        workflowId: wf.workflowId,
        previousStepIndex: step.stepIndex,
        currentStepIndex: this._currentStepIndex,
        step: nextStep,
      });
      return {
        success: true,
        reasonVi: `Hoàn thành ${step.titleVi}. Chuyển sang ${nextStep.titleVi}`,
        isWorkflowFinished: false,
      };
    } else {
      this._isCompleted = true;
      this._dispatchEngineEvent('openlab:workflow-completed', {
        workflowId: wf.workflowId,
        totalSteps: wf.steps.length,
        elapsedSeconds: (Date.now() - this._workflowStartTime) / 1000,
      });
      return {
        success: true,
        reasonVi: `Chúc mừng bạn đã xuất sắc hoàn thành toàn bộ thí nghiệm: "${wf.titleVi}"!`,
        isWorkflowFinished: true,
      };
    }
  }

  /**
   * Cung cấp chỉ dẫn nơ-ron AR thời gian thực cho người học
   */
  public getARNeuralRecommendation(instances: SceneInstance[]): ARNeuralRecommendation {
    const step = this.getCurrentStep();
    if (!step) {
      return {
        hasRecommendation: false,
        stepIndex: 0,
        titleVi: '',
        instructionVi: '',
        actionVerbVi: '',
        scientificConceptVi: '',
        mathFormulaLatex: '',
      };
    }

    const evalResult = step.validationGuard(instances);
    const requiredArchetypes = step.requiredArchetypes;
    let sourceAssetId: string | undefined = undefined;
    let targetAssetId: string | undefined = undefined;

    if (requiredArchetypes.length > 0) {
      const matchInstA = instances.find((i) =>
        requiredArchetypes.some((req) => i.assetId.toLowerCase().includes(req.toLowerCase()))
      );
      if (matchInstA) sourceAssetId = matchInstA.assetId;
    }

    if (requiredArchetypes.length > 1) {
      const matchInstB = instances.find(
        (i) =>
          i.assetId !== sourceAssetId &&
          requiredArchetypes.some((req) => i.assetId.toLowerCase().includes(req.toLowerCase()))
      );
      if (matchInstB) targetAssetId = matchInstB.assetId;
    }

    return {
      hasRecommendation: true,
      stepIndex: step.stepIndex,
      titleVi: step.titleVi,
      instructionVi: step.instructionVi,
      actionVerbVi: step.suggestedActionVi,
      scientificConceptVi: step.scientificConceptVi,
      mathFormulaLatex: step.mathFormulaLatex,
      sourceAssetId,
      targetAssetId,
      hintVi: !evalResult.isPassed ? evalResult.hintVi || evalResult.reasonVi : 'Thao tác chuẩn xác!',
    };
  }

  /**
   * Tích hợp kiểm thử bước thí nghiệm liên tục theo bước thời gian dt
   */
  public solveContinuousStepVerification(
    instances: SceneInstance[],
    dtSeconds: number,
    topology?: any
  ): { stepAdvanced: boolean; progressPercent: number } {
    if (!this._activeWorkflowId || this._isCompleted) {
      return { stepAdvanced: false, progressPercent: 100 };
    }

    this._stepDwellTimeSeconds += dtSeconds;
    const wf = this.getActiveWorkflow();
    if (!wf) return { stepAdvanced: false, progressPercent: 0 };

    const evalResult = this.evaluateCurrentStep(instances, topology);
    let stepAdvanced = false;

    // Nếu bước thí nghiệm đạt yêu cầu và giữ ổn định >= 0.8 giây, tự động tiến bước
    if (evalResult.isPassed && this._stepDwellTimeSeconds >= 0.8) {
      const adv = this.advanceStep(instances, topology);
      stepAdvanced = adv.success;
    }

    const totalSteps = wf.steps.length;
    const progressPercent = totalSteps > 0
      ? Math.min(100, Math.round(((this._currentStepIndex - 1) / totalSteps) * 100))
      : 0;

    return { stepAdvanced, progressPercent };
  }

  private _dispatchEngineEvent(eventName: string, detail: any) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(eventName, { detail }));
    }
  }
}

export const experimentWorkflowEngine = ExperimentWorkflowEngine.getInstance();
