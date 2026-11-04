/**
 * OPENLAB 3D — SCORM 2004 & xAPI (TIN CAN) E-LEARNING PACKAGING ENGINE
 * Standard: SCORM 2004 4th Edition & Experience API (xAPI / ADL Tin Can)
 * Compliance: K12Online, VnEdu, Canvas LMS, Moodle, Blackboard
 */

import { ExperimentWorkflowDefinition, WorkflowStepSpec } from '../experiments/ExperimentWorkflows';

export interface XApiActor {
  name: string;
  mbox?: string;
  account?: {
    homePage: string;
    name: string;
  };
}

export interface XApiVerb {
  id: string;
  display: Record<string, string>;
}

export interface XApiStatement {
  actor: XApiActor;
  verb: XApiVerb;
  object: {
    id: string;
    definition: {
      name: Record<string, string>;
      description: Record<string, string>;
      type: string;
    };
  };
  result?: {
    score?: {
      scaled: number;
      raw: number;
      min: number;
      max: number;
    };
    success?: boolean;
    completion?: boolean;
    duration?: string;
    response?: string;
  };
  timestamp: string;
}

export class ScormXapiPackageEngine {
  private static instance: ScormXapiPackageEngine;

  private constructor() {}

  public static getInstance(): ScormXapiPackageEngine {
    if (!ScormXapiPackageEngine.instance) {
      ScormXapiPackageEngine.instance = new ScormXapiPackageEngine();
    }
    return ScormXapiPackageEngine.instance;
  }

  /**
   * Tạo bản khai XML chuẩn imsmanifest.xml của gói SCORM 2004 4th Edition
   */
  public generateImsManifestXml(workflow: ExperimentWorkflowDefinition): string {
    const identifier = `OPENLAB3D_${workflow.workflowId}_${Date.now()}`;
    const titleEscaped = this._escapeXml(workflow.titleVi);
    const descEscaped = this._escapeXml(workflow.descriptionVi);

    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${identifier}" version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
          xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
          xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd
                              http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  <organizations default="OPENLAB3D_ORG">
    <organization identifier="OPENLAB3D_ORG">
      <title>${titleEscaped}</title>
      <item identifier="ITEM_${workflow.workflowId}" identifierref="RES_${workflow.workflowId}">
        <title>${titleEscaped}</title>
        <imsss:sequencing>
          <imsss:deliveryControls completionSetByContent="true" objectiveSetByContent="true"/>
        </imsss:sequencing>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES_${workflow.workflowId}" type="webcontent" adlcp:scormType="sco" href="index.html?wf=${workflow.workflowId}">
      <file href="index.html"/>
      <file href="assets/app.js"/>
      <file href="assets/app.css"/>
    </resource>
  </resources>
</manifest>`;
  }

  /**
   * Sinh xAPI Statement chuẩn khi học sinh hoàn thành hoặc vượt qua một bước thực hành
   */
  public createXApiStatement(
    actor: XApiActor,
    workflow: ExperimentWorkflowDefinition,
    step: WorkflowStepSpec | null,
    scoreRaw: number,
    isPassed: boolean,
    durationSeconds: number
  ): XApiStatement {
    const isFullWorkflow = step === null;
    const objectId = isFullWorkflow
      ? `https://openedulab.vn/openlab3d/workflows/${workflow.workflowId.toLowerCase()}`
      : `https://openedulab.vn/openlab3d/workflows/${workflow.workflowId.toLowerCase()}/steps/${step.stepIndex}`;

    const verbId = isPassed
      ? 'http://adlnet.gov/expapi/verbs/completed'
      : 'http://adlnet.gov/expapi/verbs/attempted';

    const verbDisplay = isPassed
      ? { 'vi-VN': 'đã hoàn thành', 'en-US': 'completed' }
      : { 'vi-VN': 'đã thử nghiệm', 'en-US': 'attempted' };

    const nameVi = isFullWorkflow ? workflow.titleVi : step.titleVi;
    const descVi = isFullWorkflow ? workflow.descriptionVi : step.instructionVi;

    return {
      actor,
      verb: {
        id: verbId,
        display: verbDisplay,
      },
      object: {
        id: objectId,
        definition: {
          name: { 'vi-VN': nameVi, 'en-US': workflow.workflowId },
          description: { 'vi-VN': descVi },
          type: 'http://adlnet.gov/expapi/activities/simulation',
        },
      },
      result: {
        score: {
          scaled: Math.max(0, Math.min(1.0, scoreRaw / 100)),
          raw: scoreRaw,
          min: 0,
          max: 100,
        },
        success: isPassed,
        completion: isPassed,
        duration: this._formatIsoDuration(durationSeconds),
      },
      timestamp: new Date().toISOString(),
    };
  }

  private _escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  private _formatIsoDuration(seconds: number): string {
    const totalSec = Math.floor(seconds);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `PT${m}M${s}S`;
  }
}

export const scormXapiPackageEngine = ScormXapiPackageEngine.getInstance();
