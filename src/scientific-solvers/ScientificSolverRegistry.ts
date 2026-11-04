/**
 * OPENLAB 3D — SCIENTIFIC SOLVER REGISTRY
 * Central Authoritative Dispatcher for all physical and chemical solvers.
 * Enforces: User Action -> Assembly Graph -> Device State -> Solvers -> 3D/UI
 */

import { SolverInput, SolverResult, ScientificSolverKind } from './types';
import { CircuitSolver } from './CircuitSolver';
import { OpticsSolver } from './OpticsSolver';
import { FluidThermalSolver } from './FluidThermalSolver';
import { ElectromagneticInductionSolver } from './ElectromagneticInductionSolver';
import { MechanicsSolver } from './MechanicsSolver';

export class ScientificSolverRegistry {
  private static instance: ScientificSolverRegistry;

  private constructor() {}

  public static getInstance(): ScientificSolverRegistry {
    if (!ScientificSolverRegistry.instance) {
      ScientificSolverRegistry.instance = new ScientificSolverRegistry();
    }
    return ScientificSolverRegistry.instance;
  }

  /**
   * Tự động điều phối đến solver phù hợp nhất dựa trên Archetype hoặc SolverKind
   */
  public solve(kindOrArchetype: string, input: SolverInput): SolverResult<any> {
    const key = kindOrArchetype.toLowerCase();

    // 1. Phân loại theo SolverKind trực tiếp
    if (key === 'circuit' || key.includes('electrical') || key.includes('multimeter') || key.includes('lamp') || key.includes('power-supply')) {
      return CircuitSolver.solve(input);
    }
    if (key === 'optics' || key.includes('lens') || key.includes('prism') || key.includes('laser') || key.includes('slab') || key.includes('microscope')) {
      return OpticsSolver.solve(input);
    }
    if (key === 'fluid-thermal' || key.includes('cylinder') || key.includes('beaker') || key.includes('overflow') || key.includes('burner') || key.includes('vessels') || key.includes('dish') || key.includes('flask')) {
      return FluidThermalSolver.solve(input);
    }
    if (key === 'induction' || key.includes('coil') || key.includes('galvanometer') || key.includes('magnet')) {
      return ElectromagneticInductionSolver.solve(input);
    }
    if (key === 'mechanics' || key.includes('balance') || key.includes('dynamometer') || key.includes('lever') || key.includes('caliper') || key.includes('weight') || key.includes('solid')) {
      return MechanicsSolver.solve(input);
    }

    // 2. Mặc định rơi vào Mechanics hoặc trả về kết quả rỗng có cảnh báo
    return MechanicsSolver.solve(input);
  }

  public getCircuitSolver() {
    return CircuitSolver;
  }

  public getOpticsSolver() {
    return OpticsSolver;
  }

  public getFluidThermalSolver() {
    return FluidThermalSolver;
  }

  public getInductionSolver() {
    return ElectromagneticInductionSolver;
  }

  public getMechanicsSolver() {
    return MechanicsSolver;
  }
}

export const scientificSolverRegistry = ScientificSolverRegistry.getInstance();
