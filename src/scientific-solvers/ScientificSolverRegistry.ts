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
   * Tự động điều phối đến solver phù hợp nhất dựa trên SolverKind hoặc Archetype (tránh va chạm chuỗi con)
   */
  public solve(kindOrArchetype: string, input: SolverInput): SolverResult<any> {
    const key = kindOrArchetype.toLowerCase().trim();
    const arch = (input.archetype ?? key).toLowerCase().trim();

    // 1. Phân loại theo SolverKind trực tiếp
    if (key === 'circuit') return CircuitSolver.solve(input);
    if (key === 'optics') return OpticsSolver.solve(input);
    if (key === 'fluid-thermal') return FluidThermalSolver.solve(input);
    if (key === 'induction') return ElectromagneticInductionSolver.solve(input);
    if (key === 'solution') return ChemicalSolutionSolver.solve(input);
    if (key === 'mechanics') return MechanicsSolver.solve(input);

    // 2. Điều phối chính xác theo Archetype / Specimen tránh nhầm 'solid-cylinder' hay 'hollow-cylinder' sang FluidThermal!
    if (
      arch === 'solid-cylinder' ||
      arch === 'hollow-cylinder' ||
      arch === 'solid-sphere' ||
      arch === 'solid-block' ||
      arch === 'calibration-weight' ||
      arch.includes('balance') ||
      arch.includes('dynamometer') ||
      arch.includes('lever') ||
      arch.includes('caliper') ||
      arch.includes('ruler') ||
      arch.includes('weight') ||
      arch.includes('solid-')
    ) {
      return MechanicsSolver.solve(input);
    }

    if (
      arch.includes('optical') ||
      arch.includes('lens') ||
      arch.includes('prism') ||
      arch.includes('laser') ||
      arch.includes('slab') ||
      arch.includes('microscope') ||
      arch.includes('magnifying') ||
      arch.includes('frosted-f') ||
      arch.includes('screen')
    ) {
      // optical-power-supply & optical-lamp là nguồn DC và phụ tải bóng đèn thuộc miền Điện học -> CircuitSolver
      if (arch.includes('power-supply') || arch.includes('lamp')) {
        return CircuitSolver.solve(input);
      }
      return OpticsSolver.solve(input);
    }

    if (
      arch.includes('electrical') ||
      arch.includes('multimeter') ||
      arch.includes('power-supply') ||
      arch === 'lamp'
    ) {
      return CircuitSolver.solve(input);
    }

    if (
      arch.includes('thermometer') ||
      arch.includes('alcohol') ||
      arch.includes('burner') ||
      arch.includes('graduated-cylinder') ||
      arch.includes('beaker') ||
      arch.includes('overflow') ||
      arch.includes('vessels') ||
      arch.includes('dish') ||
      arch.includes('flask') ||
      arch.includes('separatory') ||
      arch.includes('distillation') ||
      arch.includes('water-dispenser') ||
      arch.includes('test-tube')
    ) {
      return FluidThermalSolver.solve(input);
    }

    if (arch.includes('coil') || arch.includes('galvanometer') || arch.includes('magnet')) {
      return ElectromagneticInductionSolver.solve(input);
    }

    if (
      arch.includes('chemical') ||
      arch.includes('nacl') ||
      arch.includes('salt') ||
      arch.includes('sugar') ||
      arch.includes('ph') ||
      arch.includes('acid') ||
      arch.includes('base') ||
      arch.includes('titration')
    ) {
      return ChemicalSolutionSolver.solve(input);
    }

    // 3. Mặc định rơi vào MechanicsSolver
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

if (typeof window !== 'undefined') {
  (window as any).scientificSolverRegistry = scientificSolverRegistry;
}
