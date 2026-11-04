import {
  DeviceControlProfile,
  DevicePartSpec,
  DevicePartHelpMeta,
} from './DeviceControlProfile';
import {
  DEVICE_CONTROL_PROFILES,
  getDeviceControlProfile,
} from './DeviceControlProfilesData';
import { scientificSolverRegistry } from '../scientific-solvers/ScientificSolverRegistry';
import { SolverResult } from '../scientific-solvers/types';

export class DeviceControlEngine {
  private static instance: DeviceControlEngine;

  private profiles: Map<string, DeviceControlProfile> = new Map();

  private constructor() {
    // Nạp sẵn toàn bộ profiles đã định nghĩa
    Object.values(DEVICE_CONTROL_PROFILES).forEach((profile) => {
      this.profiles.set(profile.deviceId, profile);
      this.profiles.set(profile.archetype, profile);
    });
  }

  public static getInstance(): DeviceControlEngine {
    if (!DeviceControlEngine.instance) {
      DeviceControlEngine.instance = new DeviceControlEngine();
    }
    return DeviceControlEngine.instance;
  }

  public getProfile(deviceIdOrArchetype: string): DeviceControlProfile | null {
    return this.profiles.get(deviceIdOrArchetype) ?? getDeviceControlProfile(deviceIdOrArchetype);
  }

  public listProfiles(): DeviceControlProfile[] {
    const unique = new Map<string, DeviceControlProfile>();
    this.profiles.forEach((p) => unique.set(p.deviceId, p));
    return Array.from(unique.values());
  }

  public getPartSpec(deviceId: string, partId: string): DevicePartSpec | null {
    const profile = this.getProfile(deviceId);
    if (!profile) return null;
    return profile.parts.find((p) => p.partId === partId || p.nodeName === partId) ?? null;
  }

  public getPartHelp(deviceId: string, partId: string): DevicePartHelpMeta | null {
    const part = this.getPartSpec(deviceId, partId);
    return part ? part.help : null;
  }

  /**
   * Tính toán kết quả đầu ra khoa học theo chu trình nhân quả chuẩn:
   * USER_ACTION -> CONTROL_STATE -> SCIENTIFIC_MODEL -> OUTPUTS
   */
  public evaluateOutputs(
    deviceIdOrArchetype: string,
    state: Record<string, any>,
    env?: Record<string, number>,
    topology?: any,
  ): Record<string, any> {
    const profile = this.getProfile(deviceIdOrArchetype);
    const baseOutputs = profile && profile.evaluateOutputs ? profile.evaluateOutputs(state) : {};

    // Kết hợp tính toán chuyên sâu từ Scientific Solver Registry
    const key = profile ? profile.archetype : deviceIdOrArchetype;
    const solverRes = scientificSolverRegistry.solve(key, {
      instanceId: profile ? profile.deviceId : 'inst-0',
      state,
      environment: env,
      topology,
    });

    return {
      ...baseOutputs,
      ...solverRes.derived,
      _uncertainty: solverRes.uncertainty,
      _provenance: solverRes.provenance,
    };
  }

  /**
   * Đánh giá trực tiếp kết quả khoa học và ngân sách sai số đo lường
   */
  public evaluateScientificResult(
    deviceIdOrArchetype: string,
    state: Record<string, any>,
    env?: Record<string, number>,
    topology?: any,
  ): SolverResult<any> {
    const profile = this.getProfile(deviceIdOrArchetype);
    const key = profile ? profile.archetype : deviceIdOrArchetype;
    return scientificSolverRegistry.solve(key, {
      instanceId: profile ? profile.deviceId : 'unknown',
      state,
      environment: env,
      topology,
    });
  }
}

export const deviceControlEngine = DeviceControlEngine.getInstance();
