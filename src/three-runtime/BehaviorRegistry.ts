import { BehaviorDefinition, CapabilityState, EquipmentCapability } from '../domain/types';

/**
 * OPENLAB 3D — CONTROLLED BEHAVIOR REGISTRY
 * Mọi hành vi tương tác của thiết bị phải được đăng ký trước tại đây.
 * Manifest của tài sản chỉ được phép tham chiếu `behaviorModuleId` nằm trong danh sách an toàn này,
 * tuyệt đối không thực thi mã JavaScript/WebAssembly tùy ý từ tệp tải lên.
 */

export const BEHAVIOR_DEFINITIONS: Record<string, BehaviorDefinition> = {
  'bhv-core-spatial': {
    id: 'bhv-core-spatial',
    name: 'Điều khiển không gian cơ bản (Spatial Transform)',
    version: '1.2.0',
    moduleApiVersion: '1.0.0',
    supportedAssetKinds: ['equipment', 'specimen'],
    supportedCapabilities: ['selectable', 'translatable', 'rotatable', 'scalableViewOnly', 'showDimensions'],
    safetyLevel: 'interactive',
    implementationState: 'implemented',
    description: 'Cho phép chọn đối tượng, di chuyển trên mặt bàn thí nghiệm, xoay quanh trục Y và hiển thị kích thước bao 3D.',
    allowedParameters: ['snapToBench', 'rotationStepDeg', 'showBoundingBox'],
  },
  'bhv-electronic-balance': {
    id: 'bhv-electronic-balance',
    name: 'Mô-đun Cân điện tử hiện số (Electronic Balance Readout)',
    version: '1.0.0',
    moduleApiVersion: '1.0.0',
    supportedAssetKinds: ['equipment'],
    supportedCapabilities: ['weighObject', 'readScale'],
    safetyLevel: 'measurement',
    implementationState: 'ui-demo',
    description: 'Hiển thị giá trị khối lượng minh họa trên màn hình LCD, hỗ trợ thao tác Trừ bì (Tare / Zero) ở chế độ demo giao diện.',
    allowedParameters: ['maxCapacityG', 'leastCountG', 'tareEnabled'],
  },
  'bhv-graduated-cylinder': {
    id: 'bhv-graduated-cylinder',
    name: 'Mô-đun Đọc vạch chia & Mực chất lỏng (Meniscus Volume Reader)',
    version: '1.0.0',
    moduleApiVersion: '1.0.0',
    supportedAssetKinds: ['equipment'],
    supportedCapabilities: ['readScale', 'displacementVolume'],
    safetyLevel: 'measurement',
    implementationState: 'ui-demo',
    description: 'Điều chỉnh và quan sát mặt khum chất lỏng (meniscus) trong ống đong/cốc chia độ để đọc thể tích V1, V2 minh họa.',
    allowedParameters: ['capacityMl', 'leastCountMl', 'defaultLiquidLevelMl'],
  },
  'bhv-overflow-displacement': {
    id: 'bhv-overflow-displacement',
    name: 'Mô-đun Dời chỗ chất lỏng Bình tràn (Eureka Overflow)',
    version: '0.9.0',
    moduleApiVersion: '1.0.0',
    supportedAssetKinds: ['equipment'],
    supportedCapabilities: ['displacementVolume'],
    safetyLevel: 'measurement',
    implementationState: 'ui-demo',
    description: 'Mô phỏng quy trình thả vật rắn ngập trong bình tràn để dẫn phần nước dời chỗ sang ống đong đo thể tích.',
    allowedParameters: ['spoutHeightMm', 'overflowVolumeMl'],
  },
  'bhv-spring-dynamometer': {
    id: 'bhv-spring-dynamometer',
    name: 'Mô-đun Lực kế lò xo (Spring Force Indicator)',
    version: '1.0.0',
    moduleApiVersion: '1.0.0',
    supportedAssetKinds: ['equipment'],
    supportedCapabilities: ['measureForce', 'readScale'],
    safetyLevel: 'measurement',
    implementationState: 'ui-demo',
    description: 'Biểu diễn độ giãn lò xo và vị trí kim chỉ thị lực kéo/trọng lượng P (N) theo định luật Hooke ở mức minh họa.',
    allowedParameters: ['maxForceN', 'leastCountN', 'springConstant'],
  },
  'bhv-vernier-caliper': {
    id: 'bhv-vernier-caliper',
    name: 'Mô-đun Thước cặp du xích (Vernier Caliper Jaw & Scale)',
    version: '1.0.0',
    moduleApiVersion: '1.0.0',
    supportedAssetKinds: ['equipment'],
    supportedCapabilities: ['caliperMeasure', 'readScale'],
    safetyLevel: 'measurement',
    implementationState: 'ui-demo',
    description: 'Trượt mỏ kẹp động để đo đường kính ngoài, đường kính trong hoặc chiều sâu vật mẫu với độ chia du xích 0.02 mm.',
    allowedParameters: ['maxRangeMm', 'vernierPrecisionMm'],
  },
  'bhv-optical-focal': {
    id: 'bhv-optical-focal',
    name: 'Mô-đun Tiêu cự Thấu kính hội tụ (Optical Focal Bench)',
    version: '0.8.0',
    moduleApiVersion: '1.0.0',
    supportedAssetKinds: ['equipment'],
    supportedCapabilities: ['opticalFocus'],
    safetyLevel: 'measurement',
    implementationState: 'not-implemented',
    description: 'Dự kiến tính toán đường truyền tia sáng và vị trí ảnh thật trên màn hứng ảnh (sẽ triển khai ở Giai đoạn 5).',
    allowedParameters: ['focalLengthMm', 'lensDiameterMm'],
  },
};

export class BehaviorRegistry {
  static getBehavior(behaviorId: string): BehaviorDefinition | null {
    return BEHAVIOR_DEFINITIONS[behaviorId] ?? null;
  }

  static listAll(): BehaviorDefinition[] {
    return Object.values(BEHAVIOR_DEFINITIONS);
  }

  static isAllowedBehavior(behaviorId: string): boolean {
    return Boolean(BEHAVIOR_DEFINITIONS[behaviorId]);
  }

  static getCapabilityBadgeMeta(state: CapabilityState): {
    label: string;
    toneClass: string;
  } {
    switch (state) {
      case 'validated':
        return { label: 'Đã kiểm chứng', toneClass: 'text-emerald-400' };
      case 'implemented':
        return { label: 'Hoạt động 3D', toneClass: 'text-cyan-400' };
      case 'ui-demo':
        return { label: 'Mô phỏng UI Demo', toneClass: 'text-amber-400' };
      case 'not-implemented':
      default:
        return { label: 'Chờ Giai đoạn 5', toneClass: 'text-slate-400' };
    }
  }

  static describeCapabilityName(id: EquipmentCapability['id']): string {
    const names: Record<EquipmentCapability['id'], string> = {
      selectable: 'Chọn đối tượng trong cảnh 3D',
      translatable: 'Di chuyển vị trí (Translate Gizmo)',
      rotatable: 'Xoay hướng đặt (Rotate Gizmo)',
      scalableViewOnly: 'Phóng đại quan sát (Không đổi kích thước vật lý)',
      showDimensions: 'Hiển thị kích thước bao 3D (Bounding Box)',
      readScale: 'Đọc vạch chia / màn hình đo',
      weighObject: 'Cân khối lượng & Trừ bì (Tare)',
      displacementVolume: 'Đo thể tích dời chỗ chất lỏng',
      measureForce: 'Đo lực kéo / trọng lượng (N)',
      caliperMeasure: 'Kẹp đo kích thước hình học (mm)',
      opticalFocus: 'Mô phỏng hội tụ tia sáng quang học',
    };
    return names[id] || id;
  }
}
