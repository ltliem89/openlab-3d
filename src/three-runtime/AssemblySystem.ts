/**
 * OPENLAB 3D — REAL-WORLD SCIENTIFIC SIMULATION (RWSS v1.1.1)
 * ASSEMBLY SYSTEM & ASSEMBLY GRAPH ENGINE
 * 
 * Tuân thủ nghiêm ngặt đặc tả:
 * - 05_ASSEMBLY_ACCEPTANCE_CRITERIA.md (RWSS-OL3D-ASM-001)
 * - 01_ENVIRONMENT_LAYER.md
 * - 02_OBJECT_LAYER.md
 * - 03_INTERACTION_LAYER.md
 * 
 * Quản lý Connector/Anchor profile, quy tắc tương thích,
 * Assembly Graph (Node, Edge, Constraint, State) và vòng đời lắp ráp.
 */

import {
  ProceduralArchetype,
  SceneInstance,
  AssetDefinition,
} from '../domain/types';

export type AssemblyConnectorKind =
  | 'mechanical_support'
  | 'mechanical_clamp'
  | 'mechanical_hook'
  | 'mechanical_rail'
  | 'optical_carrier'
  | 'optical_socket'
  | 'electrical_terminal'
  | 'fluid_spout'
  | 'fluid_receptacle';

export type AssemblyRelationType =
  | 'mechanical_dock'
  | 'electrical_interlock'
  | 'fluid_coupling'
  | 'optical_alignment'
  | 'submersion';

export type AssemblyState =
  | 'FREE'
  | 'DRAGGING'
  | 'CANDIDATE'
  | 'ATTACHED'
  | 'CONSTRAINED'
  | 'REJECTED'
  | 'RELEASED';

export interface AssemblyConnectorSpec {
  connectorId: string;
  archetype: ProceduralArchetype;
  kind: AssemblyConnectorKind;
  subtype: string;
  gender?: 'male' | 'female' | 'genderless';
  polarity?: 'positive' | 'negative' | 'neutral';
  nominalVoltageV?: number;
  localCoordinateM: [number, number, number];
  orientationNormal: [number, number, number];
  snapToleranceM: number;
  maxOccupancy: number; // 1 = exclusive single slot, >1 = multi-item, Infinity = unconstrained
  acceptedMates: string[]; // connector IDs or connector kinds
  dofConstraint: {
    allowedTranslation: ('X' | 'Y' | 'Z')[];
    lockedTranslation: ('X' | 'Y' | 'Z')[];
    allowedRotation: ('yaw' | 'pitch' | 'roll')[];
    lockedRotation: ('yaw' | 'pitch' | 'roll')[];
  };
  dimensionLimitMm?: {
    maxDiameterMm?: number;
    maxWidthMm?: number;
    maxDepthMm?: number;
  };
  evidenceStatus: 'VERIFIED' | 'PARTIAL' | 'UNKNOWN';
  descriptionVi: string;
}

export interface AssemblyRelation {
  id: string;
  sourceInstanceId: string;
  sourceConnectorId: string;
  targetInstanceId: string;
  targetConnectorId: string;
  relationType: AssemblyRelationType;
  status: 'attached' | 'constrained' | 'candidate';
  transform: {
    relativePositionM: [number, number, number];
    worldPositionM: [number, number, number];
    worldRotationRad: [number, number, number];
  };
  constraints: {
    allowedDegreesOfFreedom: string[];
    lockedDegreesOfFreedom: string[];
  };
  metadata?: Record<string, any>;
  createdAt: number;
}

export interface AssemblyValidationResult {
  allowed: boolean;
  reasonCode:
    | 'COMPATIBLE'
    | 'APERTURE_OVERSIZE'
    | 'INTERFACE_INCOMPATIBLE'
    | 'SLOT_OCCUPIED'
    | 'OUT_OF_TOLERANCE'
    | 'POLARITY_MISMATCH'
    | 'VOLTAGE_MISMATCH';
  reasonVi: string;
  targetConnector?: AssemblyConnectorSpec;
  sourceConnector?: AssemblyConnectorSpec;
  requiredActionVi?: string;
}

/**
 * BẢNG ĐĂNG KÝ HỒ SƠ CONNECTOR / ANCHOR CHUẨN RWSS CHO 34 ARCHETYPE
 */
export const ASSEMBLY_CONNECTOR_REGISTRY: Record<string, AssemblyConnectorSpec> = {
  // 1. Cân điện tử kỹ thuật
  CONN_BALANCE_PAN: {
    connectorId: 'CONN_BALANCE_PAN',
    archetype: 'electronic-balance',
    kind: 'mechanical_support',
    subtype: 'pan_surface',
    gender: 'female',
    localCoordinateM: [0, 0.068, -0.020],
    orientationNormal: [0, 1, 0],
    snapToleranceM: 0.165,
    maxOccupancy: Infinity, // Hỗ trợ cộng dồn nhiều vật trên đĩa Ø130 mm
    acceptedMates: [
      'calibration-weight',
      'solid-cylinder',
      'solid-sphere',
      'solid-block',
      'hollow-cylinder',
      'beaker-250',
      'graduated-cylinder',
      'erlenmeyer-flask',
      'porcelain-dish',
    ],
    dofConstraint: {
      allowedTranslation: ['X', 'Z'], // Cho phép dàn đều nhiều vật trên mặt đĩa
      lockedTranslation: ['Y'],       // Khóa cao độ tiếp xúc y = 0.068 m
      allowedRotation: ['yaw'],
      lockedRotation: ['pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Đĩa cân inox SUS304 Ø 130 mm, cảm biến load cell 0.1 g',
  },

  // 2. Ống đong thủy tinh 100 ml
  CONN_CYLINDER_APERTURE: {
    connectorId: 'CONN_CYLINDER_APERTURE',
    archetype: 'graduated-cylinder',
    kind: 'fluid_receptacle',
    subtype: 'aperture_rim',
    gender: 'female',
    localCoordinateM: [0, 0.220, 0],
    orientationNormal: [0, 1, 0],
    snapToleranceM: 0.105,
    maxOccupancy: 3,
    acceptedMates: [
      'calibration-weight',
      'solid-cylinder',
      'solid-sphere',
      'solid-block',
      'hollow-cylinder',
      'thermometer',
    ],
    dimensionLimitMm: {
      maxDiameterMm: 28.0, // Khẩu độ miệng ống đong 100 ml là Ø 28 mm
      maxWidthMm: 28.0,
      maxDepthMm: 28.0,
    },
    dofConstraint: {
      allowedTranslation: [],
      lockedTranslation: ['X', 'Y', 'Z'],
      allowedRotation: [],
      lockedRotation: ['yaw', 'pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Miệng ống đong Ø 28 mm, giới hạn kích thước mẫu vật chìm',
  },

  // 3. Cốc chịu nhiệt 250 ml
  CONN_BEAKER_RIM: {
    connectorId: 'CONN_BEAKER_RIM',
    archetype: 'beaker-250',
    kind: 'fluid_receptacle',
    subtype: 'rim_mouth',
    gender: 'female',
    localCoordinateM: [0, 0.095, 0],
    orientationNormal: [0, 1, 0],
    snapToleranceM: 0.105,
    maxOccupancy: 4,
    acceptedMates: [
      'calibration-weight',
      'solid-cylinder',
      'solid-sphere',
      'solid-block',
      'hollow-cylinder',
      'thermometer',
    ],
    dofConstraint: {
      allowedTranslation: ['X', 'Z'],
      lockedTranslation: ['Y'],
      allowedRotation: ['yaw'],
      lockedRotation: ['pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Miệng cốc thủy tinh 250 ml, đường kính lớn chứa được mọi mẫu vật',
  },

  // 4. Bình tràn Eureka 210 ml
  CONN_OVERFLOW_CAN_APERTURE: {
    connectorId: 'CONN_OVERFLOW_CAN_APERTURE',
    archetype: 'overflow-can',
    kind: 'fluid_receptacle',
    subtype: 'rim_mouth',
    gender: 'female',
    localCoordinateM: [0, 0.160, 0],
    orientationNormal: [0, 1, 0],
    snapToleranceM: 0.105,
    maxOccupancy: 3,
    acceptedMates: [
      'calibration-weight',
      'solid-cylinder',
      'solid-sphere',
      'solid-block',
      'hollow-cylinder',
      'thermometer',
    ],
    dofConstraint: {
      allowedTranslation: [],
      lockedTranslation: ['X', 'Y', 'Z'],
      allowedRotation: [],
      lockedRotation: ['yaw', 'pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Miệng bình tràn Eureka Ø 60 mm',
  },

  CONN_OVERFLOW_CAN_SPOUT: {
    connectorId: 'CONN_OVERFLOW_CAN_SPOUT',
    archetype: 'overflow-can',
    kind: 'fluid_spout',
    subtype: 'angled_overflow_spout',
    gender: 'male',
    localCoordinateM: [0.062, 0.125, 0],
    orientationNormal: [1, -0.707, 0],
    snapToleranceM: 0.125,
    maxOccupancy: 1,
    acceptedMates: ['beaker-250', 'graduated-cylinder'],
    dofConstraint: {
      allowedTranslation: [],
      lockedTranslation: ['X', 'Y', 'Z'],
      allowedRotation: [],
      lockedRotation: ['yaw', 'pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Vòi tràn nghiêng hướng +X, xả lượng nước thừa > 210 ml vào cốc hứng',
  },

  // 5. Bình cấp nước cất 1000 ml
  CONN_WATER_DISPENSER_SPOUT: {
    connectorId: 'CONN_WATER_DISPENSER_SPOUT',
    archetype: 'water-dispenser',
    kind: 'fluid_spout',
    subtype: 'dispenser_valve_nozzle',
    gender: 'male',
    localCoordinateM: [0.095, 0.120, 0],
    orientationNormal: [0, -1, 0],
    snapToleranceM: 0.155,
    maxOccupancy: 1,
    acceptedMates: [
      'graduated-cylinder',
      'beaker-250',
      'overflow-can',
      'erlenmeyer-flask',
      'porcelain-dish',
    ],
    dofConstraint: {
      allowedTranslation: [],
      lockedTranslation: ['X', 'Y', 'Z'],
      allowedRotation: [],
      lockedRotation: ['yaw', 'pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Đầu vòi xả nước van định lượng cấp nước vào tâm dụng cụ hứng',
  },

  // 6. Lực kế lò xo 5 N
  CONN_SPRING_DYNO_HOOK: {
    connectorId: 'CONN_SPRING_DYNO_HOOK',
    archetype: 'spring-dynamometer',
    kind: 'mechanical_hook',
    subtype: 'steel_load_hook',
    gender: 'female',
    localCoordinateM: [0, 0.025, 0.018],
    orientationNormal: [0, -1, 0],
    snapToleranceM: 0.105,
    maxOccupancy: 2,
    acceptedMates: [
      'calibration-weight',
      'solid-cylinder',
      'solid-sphere',
      'solid-block',
      'hollow-cylinder',
    ],
    dofConstraint: {
      allowedTranslation: [],
      lockedTranslation: ['X', 'Y', 'Z'],
      allowedRotation: ['yaw'],
      lockedRotation: ['pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Móc treo thép chịu tải lực kế lò xo dải 0..5 N (k = 25 N/m)',
  },

  // 7. Thước cặp cơ khí 150 mm
  CONN_VERNIER_CALIPER_JAWS: {
    connectorId: 'CONN_VERNIER_CALIPER_JAWS',
    archetype: 'vernier-caliper',
    kind: 'mechanical_clamp',
    subtype: 'external_jaws',
    gender: 'female',
    localCoordinateM: [-0.090, 0.008, 0.028],
    orientationNormal: [1, 0, 0],
    snapToleranceM: 0.135,
    maxOccupancy: 1, // Chỉ kẹp 1 vật tại 1 thời điểm; vật cũ tự thoát ra bàn
    acceptedMates: [
      'calibration-weight',
      'solid-cylinder',
      'solid-sphere',
      'solid-block',
      'hollow-cylinder',
      'graduated-cylinder',
      'beaker-250',
      'erlenmeyer-flask',
      'porcelain-dish',
    ],
    dofConstraint: {
      allowedTranslation: [],
      lockedTranslation: ['X', 'Y', 'Z'],
      allowedRotation: [],
      lockedRotation: ['yaw', 'pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Mỏ kẹp đo ngoài du xích 150 mm (ĐCNN 0.05 mm)',
  },

  // 8. Ray quang học 100 cm
  CONN_OPTICAL_BENCH_RAIL: {
    connectorId: 'CONN_OPTICAL_BENCH_RAIL',
    archetype: 'optical-bench',
    kind: 'mechanical_rail',
    subtype: 'extruded_aluminum_1m',
    gender: 'female',
    localCoordinateM: [0, 0.0295, 0],
    orientationNormal: [0, 1, 0],
    snapToleranceM: 0.140,
    maxOccupancy: 4, // Đèn (1), Vật F (2), Thấu kính (3), Màn chắn (4)
    acceptedMates: [
      'optical-lamp',
      'frosted-f-object',
      'optical-lens',
      'optical-screen',
    ],
    dofConstraint: {
      allowedTranslation: ['X'], // 1D trượt dọc trục ray
      lockedTranslation: ['Y', 'Z'], // Khóa cao độ và độ lệch ngang
      allowedRotation: [],
      lockedRotation: ['yaw', 'pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Rãnh ray quang học dài 1 m định hướng 1D đồng trục y = 0.125 m',
  },

  // 9. Biến áp nguồn thí nghiệm 12 V DC
  CONN_PSU_DC_OUT_POS: {
    connectorId: 'CONN_PSU_DC_OUT_POS',
    archetype: 'optical-power-supply',
    kind: 'electrical_terminal',
    subtype: 'banana_jack_red',
    gender: 'female',
    polarity: 'positive',
    nominalVoltageV: 12.0,
    localCoordinateM: [0.045, 0.038, 0.060],
    orientationNormal: [0, 0, 1],
    snapToleranceM: 0.70,
    maxOccupancy: 1,
    acceptedMates: ['CONN_LAMP_DC_IN_POS', 'optical-lamp'],
    dofConstraint: {
      allowedTranslation: [],
      lockedTranslation: ['X', 'Y', 'Z'],
      allowedRotation: [],
      lockedRotation: ['yaw', 'pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Cực dương DC (+) 12 V giắc bắp chuối đỏ',
  },

  CONN_PSU_DC_OUT_NEG: {
    connectorId: 'CONN_PSU_DC_OUT_NEG',
    archetype: 'optical-power-supply',
    kind: 'electrical_terminal',
    subtype: 'banana_jack_blue',
    gender: 'female',
    polarity: 'negative',
    nominalVoltageV: 0.0,
    localCoordinateM: [-0.045, 0.038, 0.060],
    orientationNormal: [0, 0, 1],
    snapToleranceM: 0.70,
    maxOccupancy: 1,
    acceptedMates: ['CONN_LAMP_DC_IN_NEG', 'optical-lamp'],
    dofConstraint: {
      allowedTranslation: [],
      lockedTranslation: ['X', 'Y', 'Z'],
      allowedRotation: [],
      lockedRotation: ['yaw', 'pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Cực âm DC (-) giắc bắp chuối xanh',
  },

  // 10. Đèn chiếu sáng quang học
  CONN_LAMP_DC_IN_POS: {
    connectorId: 'CONN_LAMP_DC_IN_POS',
    archetype: 'optical-lamp',
    kind: 'electrical_terminal',
    subtype: 'banana_jack_red',
    gender: 'female',
    polarity: 'positive',
    nominalVoltageV: 12.0,
    localCoordinateM: [0.035, 0.025, -0.040],
    orientationNormal: [0, 0, -1],
    snapToleranceM: 0.70,
    maxOccupancy: 1,
    acceptedMates: ['CONN_PSU_DC_OUT_POS', 'optical-power-supply'],
    dofConstraint: {
      allowedTranslation: [],
      lockedTranslation: ['X', 'Y', 'Z'],
      allowedRotation: [],
      lockedRotation: ['yaw', 'pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Cọc cắm nguồn dương (+) DC của đèn',
  },

  CONN_LAMP_DC_IN_NEG: {
    connectorId: 'CONN_LAMP_DC_IN_NEG',
    archetype: 'optical-lamp',
    kind: 'electrical_terminal',
    subtype: 'banana_jack_blue',
    gender: 'female',
    polarity: 'negative',
    nominalVoltageV: 0.0,
    localCoordinateM: [-0.035, 0.025, -0.040],
    orientationNormal: [0, 0, -1],
    snapToleranceM: 0.70,
    maxOccupancy: 1,
    acceptedMates: ['CONN_PSU_DC_OUT_NEG', 'optical-power-supply'],
    dofConstraint: {
      allowedTranslation: [],
      lockedTranslation: ['X', 'Y', 'Z'],
      allowedRotation: [],
      lockedRotation: ['yaw', 'pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Cọc cắm nguồn âm (-) DC của đèn',
  },

  CONN_OPTICAL_LAMP_CARRIAGE: {
    connectorId: 'CONN_OPTICAL_LAMP_CARRIAGE',
    archetype: 'optical-lamp',
    kind: 'optical_carrier',
    subtype: 'slider_carriage',
    gender: 'male',
    localCoordinateM: [0, 0, 0],
    orientationNormal: [0, -1, 0],
    snapToleranceM: 0.140,
    maxOccupancy: 1,
    acceptedMates: ['optical-bench'],
    dofConstraint: {
      allowedTranslation: ['X'],
      lockedTranslation: ['Y', 'Z'],
      allowedRotation: [],
      lockedRotation: ['yaw', 'pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Con trượt gắn ray quang học của Đèn chiếu sáng',
  },

  // 11. Giá đỡ thấu kính quang học
  CONN_LENS_HOLDER_SOCKET: {
    connectorId: 'CONN_LENS_HOLDER_SOCKET',
    archetype: 'optical-lens',
    kind: 'optical_socket',
    subtype: 'ring_holder_clamp',
    gender: 'female',
    localCoordinateM: [0, 0.125, 0],
    orientationNormal: [1, 0, 0],
    snapToleranceM: 0.150,
    maxOccupancy: 1, // Mỗi thời điểm chỉ gắn 1 thấu kính trong vòng kẹp
    acceptedMates: ['optical-lens-box'],
    dofConstraint: {
      allowedTranslation: [],
      lockedTranslation: ['X', 'Y', 'Z'],
      allowedRotation: [],
      lockedRotation: ['yaw', 'pitch', 'roll'],
    },
    evidenceStatus: 'VERIFIED',
    descriptionVi: 'Vòng giữ thấu kính đường kính Ø 40 mm đồng trục y = 0.125 m',
  },
};

/**
 * HỆ THỐNG QUẢN LÝ QUAN HỆ LẮP RÁP (ASSEMBLY GRAPH MANAGER)
 */
export class AssemblyGraphManager {
  private relations: Map<string, AssemblyRelation> = new Map();

  /**
   * Truy vấn danh sách quan hệ hiện có
   */
  public getRelations(): AssemblyRelation[] {
    return Array.from(this.relations.values());
  }

  /**
   * Truy vấn quan hệ liên quan đến một instance
   */
  public getRelationsForInstance(instanceId: string): AssemblyRelation[] {
    return Array.from(this.relations.values()).filter(
      (rel) =>
        rel.sourceInstanceId === instanceId ||
        rel.targetInstanceId === instanceId,
    );
  }

  /**
   * Xóa toàn bộ liên kết (Clear graph)
   */
  public clear(): void {
    this.relations.clear();
  }

  /**
   * Kiểm tra điều kiện tương thích trước khi lắp ráp (Compatibility Validation)
   * Tuân thủ ASM-04, ASM-06, ASM-09, ASM-16
   */
  public validateAssembly(
    sourceInst: SceneInstance,
    sourceAsset: AssetDefinition,
    targetInst: SceneInstance,
    targetAsset: AssetDefinition,
    targetSlot: string,
    currentDistanceM: number,
  ): AssemblyValidationResult {
    const sArch = sourceAsset.geometry.proceduralArchetype;
    const tArch = targetAsset.geometry.proceduralArchetype;

    // Tìm connector tương ứng của target
    let targetConn: AssemblyConnectorSpec | undefined;
    if (targetSlot === 'balance-pan' && tArch === 'electronic-balance') {
      targetConn = ASSEMBLY_CONNECTOR_REGISTRY.CONN_BALANCE_PAN;
    } else if (
      targetSlot === 'inside-vessel' &&
      tArch === 'graduated-cylinder'
    ) {
      targetConn = ASSEMBLY_CONNECTOR_REGISTRY.CONN_CYLINDER_APERTURE;
    } else if (targetSlot === 'inside-vessel' && tArch === 'beaker-250') {
      targetConn = ASSEMBLY_CONNECTOR_REGISTRY.CONN_BEAKER_RIM;
    } else if (targetSlot === 'inside-vessel' && tArch === 'overflow-can') {
      targetConn = ASSEMBLY_CONNECTOR_REGISTRY.CONN_OVERFLOW_CAN_APERTURE;
    } else if (
      targetSlot === 'dispenser-outlet' &&
      tArch === 'water-dispenser'
    ) {
      targetConn = ASSEMBLY_CONNECTOR_REGISTRY.CONN_WATER_DISPENSER_SPOUT;
    } else if (
      targetSlot === 'dynamometer-hook' &&
      tArch === 'spring-dynamometer'
    ) {
      targetConn = ASSEMBLY_CONNECTOR_REGISTRY.CONN_SPRING_DYNO_HOOK;
    } else if (targetSlot === 'caliper-jaws' && tArch === 'vernier-caliper') {
      targetConn = ASSEMBLY_CONNECTOR_REGISTRY.CONN_VERNIER_CALIPER_JAWS;
    } else if (
      targetSlot === 'optical-bench-rail' &&
      tArch === 'optical-bench'
    ) {
      targetConn = ASSEMBLY_CONNECTOR_REGISTRY.CONN_OPTICAL_BENCH_RAIL;
    }

    if (!targetConn) {
      return {
        allowed: false,
        reasonCode: 'INTERFACE_INCOMPATIBLE',
        reasonVi: `Không tìm thấy cổng ghép hợp lệ trên ${targetAsset.name.vi}`,
      };
    }

    // 1. Kiểm tra dung sai khoảng cách (ASM-06)
    if (currentDistanceM > targetConn.snapToleranceM) {
      return {
        allowed: false,
        reasonCode: 'OUT_OF_TOLERANCE',
        reasonVi: `Khoảng cách (${(currentDistanceM * 100).toFixed(1)} cm) nằm ngoài vùng snap của cổng (${(targetConn.snapToleranceM * 100).toFixed(1)} cm)`,
        targetConnector: targetConn,
      };
    }

    // 2. Kiểm tra danh sách thiết bị tương thích (ASM-04)
    const isAccepted = targetConn.acceptedMates.includes(sArch);
    if (!isAccepted) {
      return {
        allowed: false,
        reasonCode: 'INTERFACE_INCOMPATIBLE',
        reasonVi: `Thiết bị "${sourceAsset.name.vi}" (${sArch}) không tương thích với cổng "${targetConn.descriptionVi}"`,
        targetConnector: targetConn,
        requiredActionVi: `Chỉ ghép các thiết bị được hỗ trợ: ${targetConn.acceptedMates.join(', ')}`,
      };
    }

    // 3. Kiểm tra khẩu độ hình học (ASM-16 Aperture Limit Check)
    if (targetConn.dimensionLimitMm) {
      const bW = (sourceAsset.geometry.boundingBoxM.width ?? 0.02) * 1000;
      const bD = (sourceAsset.geometry.boundingBoxM.depth ?? 0.02) * 1000;
      const maxDim = Math.max(bW, bD);
      const minDim = Math.min(bW, bD);
      const limit = targetConn.dimensionLimitMm.maxDiameterMm ?? 28.0;

      if (sArch === 'solid-block' || maxDim > limit + 4 || minDim > limit - 2) {
        return {
          allowed: false,
          reasonCode: 'APERTURE_OVERSIZE',
          reasonVi: `Kích thước mẫu vật "${sourceAsset.name.vi}" (${maxDim.toFixed(0)} mm) vượt quá khẩu độ miệng ống đong (Ø ${limit} mm)`,
          targetConnector: targetConn,
          requiredActionVi: 'Hãy sử dụng Bình tràn Eureka để đo thể tích các mẫu vật lớn!',
        };
      }
    }

    // 4. Kiểm tra sức chứa cổng (ASM-09 Slot Occupancy)
    const currentMates = Array.from(this.relations.values()).filter(
      (rel) =>
        rel.targetInstanceId === targetInst.instanceId &&
        rel.targetConnectorId === targetConn!.connectorId &&
        rel.sourceInstanceId !== sourceInst.instanceId,
    );

    if (currentMates.length >= targetConn.maxOccupancy) {
      // Nếu là slot đơn (như Caliper), chính sách là EVICT / REPLACE (tháo vật cũ về bàn)
      if (targetConn.maxOccupancy === 1) {
        return {
          allowed: true,
          reasonCode: 'SLOT_OCCUPIED',
          reasonVi: `Cổng đang giữ vật thể khác; vật thể cũ sẽ được tự động giải phóng để nhường chỗ`,
          targetConnector: targetConn,
          requiredActionVi: 'Thay thế vật kẹp hiện có',
        };
      } else {
        return {
          allowed: false,
          reasonCode: 'SLOT_OCCUPIED',
          reasonVi: `Cổng đã đạt sức chứa tối đa (${targetConn.maxOccupancy} thiết bị)`,
          targetConnector: targetConn,
        };
      }
    }

    return {
      allowed: true,
      reasonCode: 'COMPATIBLE',
      reasonVi: `Tương thích chuẩn với ${targetConn.descriptionVi}`,
      targetConnector: targetConn,
    };
  }

  /**
   * Tạo liên kết lắp ráp mới và cập nhật graph (ASM-05, ASM-09, ASM-10)
   */
  public attach(
    sourceInstId: string,
    sourceConnId: string,
    targetInstId: string,
    targetConnId: string,
    relationType: AssemblyRelationType,
    worldPos: [number, number, number],
    worldRot: [number, number, number],
    metadata?: Record<string, any>,
  ): AssemblyRelation {
    // 1. Dọn dẹp liên kết cũ của source (tránh duplicate edge)
    this.detach(sourceInstId);

    // 2. Nếu targetConnector có maxOccupancy === 1, giải phóng liên kết cũ của targetConnector
    const targetSpec = ASSEMBLY_CONNECTOR_REGISTRY[targetConnId];
    if (targetSpec && targetSpec.maxOccupancy === 1) {
      for (const [relId, rel] of this.relations.entries()) {
        if (
          rel.targetInstanceId === targetInstId &&
          rel.targetConnectorId === targetConnId
        ) {
          this.relations.delete(relId);
        }
      }
    }

    const relId = `rel_${sourceInstId}_to_${targetInstId}_${Date.now()}`;
    const newRelation: AssemblyRelation = {
      id: relId,
      sourceInstanceId: sourceInstId,
      sourceConnectorId: sourceConnId,
      targetInstanceId: targetInstId,
      targetConnectorId: targetConnId,
      relationType,
      status: 'attached',
      transform: {
        relativePositionM: [0, 0, 0],
        worldPositionM: worldPos,
        worldRotationRad: worldRot,
      },
      constraints: {
        allowedDegreesOfFreedom: targetSpec?.dofConstraint.allowedTranslation ?? ['X', 'Z'],
        lockedDegreesOfFreedom: targetSpec?.dofConstraint.lockedTranslation ?? ['Y'],
      },
      metadata,
      createdAt: Date.now(),
    };

    this.relations.set(relId, newRelation);
    return newRelation;
  }

  /**
   * Tháo gỡ liên kết (ASM-17 Release Lifecycle Cleanup)
   */
  public detach(instanceId: string): string[] {
    const detachedIds: string[] = [];
    for (const [id, rel] of this.relations.entries()) {
      if (
        rel.sourceInstanceId === instanceId ||
        rel.targetInstanceId === instanceId
      ) {
        this.relations.delete(id);
        detachedIds.push(
          rel.sourceInstanceId === instanceId
            ? rel.targetInstanceId
            : rel.sourceInstanceId,
        );
      }
    }
    return detachedIds;
  }
}

/**
 * Singleton instance của Assembly Graph Manager
 */
export const assemblyGraph = new AssemblyGraphManager();

/**
 * =========================================================================
 * SCIENTIFIC INTERACTION ENGINE — ELECTRICAL CIRCUIT SOLVER
 * Tuân thủ định luật mạch điện Ohm và Kirchoff theo kiến trúc CIA v1.0:
 * USER ACTION -> ASSEMBLY GRAPH -> DEVICE STATE -> SOLVER -> PHYSICAL STATE
 * =========================================================================
 */
export interface ElectricalCircuitState {
  isCircuitClosed: boolean;
  isCablesConnected: boolean;
  cableDistanceM: number;
  isWithinMaxReach: boolean;
  psuPoweredOn: boolean;
  lampSwitchOn: boolean;
  voltageSettingV: number;
  voltageAtLampV: number;
  isLampLit: boolean;
  reasonVi: string;
}

export const MAX_ELECTRICAL_CABLE_LENGTH_M = 0.70; // Chiều dài tối đa của cặp dây cắm bắp chuối 12V
export const LAMP_IGNITION_THRESHOLD_VOLTAGE_V = 2.5; // Ngưỡng điện áp tối thiểu để tim đèn vonfram phát xạ nhiệt

export function solveElectricalCircuit(
  psuInstance?: SceneInstance | null,
  lampInstance?: SceneInstance | null,
  options?: {
    cablesManuallyConnected?: boolean;
    maxCableLengthM?: number;
  }
): ElectricalCircuitState {
  const maxReach = options?.maxCableLengthM ?? MAX_ELECTRICAL_CABLE_LENGTH_M;

  if (!psuInstance || !lampInstance) {
    return {
      isCircuitClosed: false,
      isCablesConnected: false,
      cableDistanceM: Infinity,
      isWithinMaxReach: false,
      psuPoweredOn: false,
      lampSwitchOn: false,
      voltageSettingV: 0,
      voltageAtLampV: 0,
      isLampLit: false,
      reasonVi: 'Thiếu nguồn hoặc đèn trong phòng thí nghiệm',
    };
  }

  // 1. Tính khoảng cách 3D thực giữa cọc nguồn và cọc đèn
  const dx = psuInstance.transform.positionM[0] - lampInstance.transform.positionM[0];
  const dy = psuInstance.transform.positionM[1] - lampInstance.transform.positionM[1];
  const dz = psuInstance.transform.positionM[2] - lampInstance.transform.positionM[2];
  const cableDistanceM = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const isWithinMaxReach = cableDistanceM <= maxReach;

  // 2. Trạng thái cắm dây thực tế (chỉ cắm được nếu nằm trong tầm với của dây)
  const isPosPlugged = lampInstance.instanceState.wirePosConnected ?? (lampInstance.instanceState.isCablesConnected !== false);
  const isNegPlugged = lampInstance.instanceState.wireNegConnected ?? (lampInstance.instanceState.isCablesConnected !== false);
  const areBothWiresPlugged = (lampInstance.instanceState.isCablesConnected ?? options?.cablesManuallyConnected ?? true) && isPosPlugged && isNegPlugged;
  const isCablesConnected = areBothWiresPlugged && isWithinMaxReach;

  // 3. Trạng thái máy độc lập của PSU và Đèn (Decoupled Device State)
  const psuPoweredOn = Boolean(psuInstance.instanceState.isPoweredOn);
  const lampSwitchOn = lampInstance.instanceState.isPoweredOn !== false;
  const voltageSettingV = typeof psuInstance.instanceState.voltageSetting === 'number'
    ? psuInstance.instanceState.voltageSetting
    : (typeof psuInstance.instanceState.supplyVoltageV === 'number' ? psuInstance.instanceState.supplyVoltageV : 12.0);

  // 4. Kiểm tra điều kiện đóng mạch
  if (!isCablesConnected) {
    return {
      isCircuitClosed: false,
      isCablesConnected: false,
      cableDistanceM,
      isWithinMaxReach,
      psuPoweredOn,
      lampSwitchOn,
      voltageSettingV,
      voltageAtLampV: 0,
      isLampLit: false,
      reasonVi: !isWithinMaxReach
        ? `Khoảng cách giữa nguồn và đèn (${cableDistanceM.toFixed(2)} m) vượt quá chiều dài dây (${maxReach.toFixed(2)} m)`
        : 'Dây dẫn điện chưa được cắm nối giữa nguồn và đèn',
    };
  }

  // 5. Mạch kín đã cắm dây
  const isCircuitClosed = true;

  if (!psuPoweredOn) {
    return {
      isCircuitClosed,
      isCablesConnected,
      cableDistanceM,
      isWithinMaxReach,
      psuPoweredOn,
      lampSwitchOn,
      voltageSettingV,
      voltageAtLampV: 0,
      isLampLit: false,
      reasonVi: 'Nguồn điện đang tắt (Công tắc nguồn OFF)',
    };
  }

  if (!lampSwitchOn) {
    return {
      isCircuitClosed,
      isCablesConnected,
      cableDistanceM,
      isWithinMaxReach,
      psuPoweredOn,
      lampSwitchOn,
      voltageSettingV,
      voltageAtLampV: 0,
      isLampLit: false,
      reasonVi: 'Công tắc cục bộ trên thân đèn đang tắt',
    };
  }

  if (voltageSettingV < LAMP_IGNITION_THRESHOLD_VOLTAGE_V) {
    return {
      isCircuitClosed,
      isCablesConnected,
      cableDistanceM,
      isWithinMaxReach,
      psuPoweredOn,
      lampSwitchOn,
      voltageSettingV,
      voltageAtLampV: voltageSettingV,
      isLampLit: false,
      reasonVi: `Điện áp ${voltageSettingV.toFixed(1)} V dưới ngưỡng kích sáng (${LAMP_IGNITION_THRESHOLD_VOLTAGE_V} V)`,
    };
  }

  // 6. Đủ mọi điều kiện vật lý: Đèn phát sáng thành công
  return {
    isCircuitClosed,
    isCablesConnected,
    cableDistanceM,
    isWithinMaxReach,
    psuPoweredOn,
    lampSwitchOn,
    voltageSettingV,
    voltageAtLampV: voltageSettingV,
    isLampLit: true,
    reasonVi: `Mạch kín, nguồn cấp ${voltageSettingV.toFixed(1)} V, đèn phát sáng bình thường`,
  };
}

