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
import { ChemicalSolutionSolver } from './ChemicalSolutionSolver';
import { MultiPhysicsCouplingBus, MultiPhysicsBusSnapshot } from '../core-physics/MultiPhysicsCouplingBus';
import { ChronoCausalRingBuffer } from '../core-physics/ChronoCausalRingBuffer';

export class ScientificSolverRegistry {
  private static instance: ScientificSolverRegistry;
  private readonly _multiPhysicsBus: MultiPhysicsCouplingBus;
  private readonly _chronoBuffer: ChronoCausalRingBuffer;

  private constructor() {
    this._multiPhysicsBus = new MultiPhysicsCouplingBus();
    this._chronoBuffer = new ChronoCausalRingBuffer();
  }

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
    if (key === 'solution' || key.includes('chemical') || key.includes('nacl') || key.includes('salt') || key.includes('sugar') || key.includes('ph') || key.includes('acid') || key.includes('base') || key.includes('titration')) {
      return ChemicalSolutionSolver.solve(input);
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

  public getChemicalSolutionSolver() {
    return ChemicalSolutionSolver;
  }

  /**
   * Trả về Trục Liên thông Đa trường Vật lý Hợp nhất (120 Hz RK4)
   */
  public getMultiPhysicsBus(): MultiPhysicsCouplingBus {
    return this._multiPhysicsBus;
  }

  /**
   * Trả về Bộ đệm vòng nhân quả 3600 khung hình (Time Rewind & Counterfactual Forking)
   */
  public getChronoRingBuffer(): ChronoCausalRingBuffer {
    return this._chronoBuffer;
  }

  /**
   * Tiến một bước vi phân liên thông đa miền (Điện ↔ Nhiệt ↔ Thủy ↔ Từ ↔ Cơ)
   */
  public stepContinuousMultiPhysics(dt: number = 1.0 / 120.0): MultiPhysicsBusSnapshot {
    if (this._chronoBuffer.isRewinding) {
      return this._multiPhysicsBus.getSnapshot();
    }
    const snap = this._multiPhysicsBus.step(dt);
    this._chronoBuffer.push(snap);
    return snap;
  }

  /**
   * Lấy ảnh chụp trạng thái vật lý đa trường mới nhất
   */
  public getMultiPhysicsSnapshot(): MultiPhysicsBusSnapshot {
    return this._multiPhysicsBus.getSnapshot();
  }
}

export const scientificSolverRegistry = ScientificSolverRegistry.getInstance();
