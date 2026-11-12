/**
 * OPENLAB 3D — SCORM 2004 & xAPI (TIN CAN) PACKAGING ENGINE
 * Chuẩn đóng gói e-Learning bài giảng số & theo dõi tiến trình thực hành khoa học
 */

import { ExperimentWorkflowDefinition } from '../experiments/ExperimentWorkflows';

export interface XApiActor {
  name: string;
  mbox: string;
}

export interface XApiStatement {
  actor: {
    name: string;
    mbox: string;
    objectType?: string;
  };
  verb: {
    id: string;
    display: Record<string, string>;
  };
  object: {
    id: string;
    definition: {
      name: Record<string, string>;
      description?: Record<string, string>;
      type?: string;
    };
    objectType?: string;
  };
  result?: {
    score?: {
      raw?: number;
      min?: number;
      max?: number;
      scaled?: number;
    };
    success?: boolean;
    completion?: boolean;
    duration?: string;
  };
  timestamp: string;
}

export class ScormXapiPackageEngine {
  /**
   * Tạo chuỗi XML imsmanifest.xml chuẩn SCORM 2004 4th Edition
   */
  public generateImsManifestXml(workflow: ExperimentWorkflowDefinition): string {
    const wfId = workflow.workflowId;
    const title = workflow.titleVi;

    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="OPENLAB3D_${wfId}" version="1.3"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
          xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
          xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  <organizations default="OPENLAB3D_ORG">
    <organization identifier="OPENLAB3D_ORG">
      <title>${title}</title>
      <item identifier="ITEM_${wfId}" identifierref="RES_${wfId}">
        <title>${title}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES_${wfId}" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html" />
    </resource>
  </resources>
</manifest>`;
  }

  /**
   * Chuyển đổi số giây thành định dạng ISO 8601 Duration (VD: 125s -> PT2M5S)
   */
  public formatIsoDuration(seconds: number): string {
    const s = Math.max(0, Math.round(seconds));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const remainingSeconds = s % 60;

    let res = 'PT';
    if (hours > 0) res += `${hours}H`;
    if (minutes > 0) res += `${minutes}M`;
    if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
      res += `${remainingSeconds}S`;
    }
    return res;
  }

  /**
   * Tạo xAPI Statement báo cáo kết quả thực hành của học sinh
   */
  public createXApiStatement(
    actor: XApiActor,
    workflow: ExperimentWorkflowDefinition,
    step: any | null,
    scoreRaw: number = 100,
    isSuccess: boolean = true,
    durationSeconds: number = 0
  ): XApiStatement {
    const verbId = isSuccess
      ? 'http://adlnet.gov/expapi/verbs/completed'
      : 'http://adlnet.gov/expapi/verbs/attempted';

    return {
      actor: {
        name: actor.name,
        mbox: actor.mbox.startsWith('mailto:') ? actor.mbox : `mailto:${actor.mbox}`,
        objectType: 'Agent',
      },
      verb: {
        id: verbId,
        display: {
          'vi-VN': isSuccess ? 'hoàn thành' : 'thực hiện',
          'en-US': isSuccess ? 'completed' : 'attempted',
        },
      },
      object: {
        id: `http://openlab.edu.vn/activities/${workflow.workflowId}`,
        definition: {
          name: {
            'vi-VN': workflow.titleVi,
          },
          description: {
            'vi-VN': workflow.descriptionVi || workflow.titleVi,
          },
          type: 'http://adlnet.gov/expapi/activities/assessment',
        },
        objectType: 'Activity',
      },
      result: {
        score: {
          raw: scoreRaw,
          min: 0,
          max: 100,
          scaled: scoreRaw / 100,
        },
        success: isSuccess,
        completion: isSuccess,
        duration: this.formatIsoDuration(durationSeconds),
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export const scormXapiPackageEngine = new ScormXapiPackageEngine();
