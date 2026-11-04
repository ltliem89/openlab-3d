import { ProceduralArchetype } from '../domain/types';

export type DeviceControlType =
  | 'button'
  | 'switch'
  | 'dial'
  | 'rotary'
  | 'slider'
  | 'linear'
  | 'drag'
  | 'readout';

export interface DevicePartHelpMeta {
  title: string;
  partNameVi: string;
  functionVi: string;
  operationGuideVi: string;
  expectedFeedbackVi: string;
  commonErrorsVi: string;
  safetyNotesVi: string;
}

export interface DevicePartSpec {
  partId: string;
  nodeName: string;
  nameVi: string;
  role: string;
  controlType: DeviceControlType;
  stateKey: string;
  limits?: {
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  };
  options?: Array<{
    value: string | number;
    label: string;
  }>;
  axis?: 'x' | 'y' | 'z';
  defaultValue?: number | boolean | string;
  guards?: string[];
  helpId: string;
  help: DevicePartHelpMeta;
}

export interface DeviceScientificEquation {
  id: string;
  latex: string;
  meaningVi: string;
}

export interface DeviceStateTransition {
  from: string;
  event: string;
  to: string;
  guard?: string;
}

export interface DeviceOutputSpec {
  key: string;
  labelVi: string;
  unit: string;
  formulaTex?: string;
  formatDecimals?: number;
}

export interface DeviceControlProfile {
  deviceId: string;
  archetype: ProceduralArchetype;
  titleVi: string;
  group: string; // 'G01' .. 'G10'
  curriculumLessonVi: string;
  technicalStandardVi: string;
  parts: DevicePartSpec[];
  initialState: Record<string, any>;
  stateSchema: Record<string, 'number' | 'boolean' | 'string' | 'object'>;
  transitions: DeviceStateTransition[];
  equations: DeviceScientificEquation[];
  outputs: DeviceOutputSpec[];
  safetyRules: string[];
  testCases: Array<{
    id: string;
    name: string;
    expected: string;
  }>;
  evaluateOutputs?: (state: Record<string, any>) => Record<string, any>;
}
