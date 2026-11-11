/**
 * OPENLAB 3D — SCIENTIFIC SOLVERS TYPE SYSTEM
 * Architecture: CIA v1.0 (User Action -> Assembly Graph -> Device State -> Solvers -> 3D/UI)
 * Standards: SI units, MathType LaTeX equations, GUM uncertainty propagation
 */

export type ScientificSolverKind =
  | 'circuit'
  | 'optics'
  | 'fluid-thermal'
  | 'induction'
  | 'mechanics'
  | 'metrology'
  | 'solution';

export interface UncertaintyBudget {
  instrumentalError: number;
  leastCount: number;
  repeatabilitySigma: number;
  expandedUncertainty: number; // k = 2 (95% confidence interval)
  unit: string;
}

export interface SolverProvenance {
  solverId: string;
  version: string;
  lawsApplied: string[];
  referenceFormulasLatex: string[];
  computationTimestamp: number;
}

export interface SolverInput<TState = Record<string, any>> {
  instanceId: string;
  archetype?: string;
  state: TState;
  environment?: {
    airTemperatureC?: number;
    relativeHumidityPct?: number;
    atmosphericPressureKPa?: number;
    gravityMps2?: number;
    illuminanceLux?: number;
    airflowMps?: number;
    [key: string]: number | undefined;
  };
  topology?: {
    attachedTo?: string | null;
    connectedPeers?: string[];
    isCircuitClosed?: boolean;
    isOpticallyAligned?: boolean;
    isThermallyCoupled?: boolean;
    cableDistanceM?: number;
    [key: string]: any;
  };
  dtSeconds?: number;
  simulationTimeSeconds?: number;
  noiseSeed?: number;
}

export interface SolverResult<TDerived = Record<string, any>> {
  derived: TDerived;
  valid: boolean;
  warnings: string[];
  errors: string[];
  uncertainty?: UncertaintyBudget;
  provenance: SolverProvenance;
}
