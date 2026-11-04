import {
  AssetDefinition,
  EquipmentCategoryId,
  EquipmentKit,
  ExperimentDefinition,
  LabEnvironment,
  LabScene,
  ScienceSubject,
  VerificationStatus,
} from '../domain/types';
import {
  INITIAL_DEMO_SCENE,
  MOCK_EQUIPMENT_ASSETS,
  MOCK_EQUIPMENT_KITS,
  MOCK_EXPERIMENTS,
  MOCK_LAB_ENVIRONMENTS,
} from '../data/mockCatalog';
import { htmlEquipmentModuleRegistry } from '../three-runtime/HtmlEquipmentModuleRegistry';

export interface EquipmentQuery {
  search?: string;
  subject?: ScienceSubject | 'all';
  category?: EquipmentCategoryId | 'all';
  verificationStatus?: VerificationStatus | 'all';
  format?: 'all' | 'GLB' | 'glTF' | 'PROCEDURAL_PBR';
}

export interface CategoryMeta {
  id: EquipmentCategoryId | 'all';
  label: string;
}

export interface EquipmentRepository {
  list(query?: EquipmentQuery): AssetDefinition[];
  getById(assetId: string, version?: string): AssetDefinition | null;
  listCategories(): CategoryMeta[];
}

export interface KitRepository {
  list(): EquipmentKit[];
  getById(kitId: string): EquipmentKit | null;
}

export interface EnvironmentRepository {
  list(): LabEnvironment[];
  getById(environmentId: string): LabEnvironment | null;
}

export interface ExperimentRepository {
  list(): ExperimentDefinition[];
  getById(experimentId: string): ExperimentDefinition | null;
}

export interface SceneRepository {
  getInitialScene(): LabScene;
  cloneInitialScene(): LabScene;
}

const CATEGORIES: CategoryMeta[] = [
  { id: 'all', label: 'Tất cả danh mục (28+)' },
  { id: 'optical-equipment', label: 'Quang học — Khúc xạ & Thấu kính (Chương II)' },
  { id: 'electrical-equipment', label: 'Điện & Cảm ứng điện từ (Chương III–IV)' },
  { id: 'chemical-apparatus', label: 'Hoá học — Đun nóng, Chiết & Chưng cất (Chương VI–IX)' },
  { id: 'biology-microscopy', label: 'Sinh học — Kính hiển vi NST & DNA (Chương XI–XII)' },
  { id: 'mass-measurement', label: 'Đo khối lượng (Cân điện tử & Quả cân)' },
  { id: 'volume-measurement', label: 'Đo thể tích chất lỏng & Vật rắn' },
  { id: 'force-measurement', label: 'Đo lực & Trọng lượng' },
  { id: 'length-measurement', label: 'Đo kích thước hình học' },
  { id: 'laboratory-glassware', label: 'Dụng cụ thủy tinh thí nghiệm' },
  { id: 'thermal-equipment', label: 'Thiết bị nhiệt học' },
  { id: 'solid-specimens', label: 'Vật mẫu đặc' },
  { id: 'hollow-specimens', label: 'Vật rắn rỗng (Khoang)' },
  { id: 'support-hardware', label: 'Giá đỡ & Phụ kiện' },
];

class MockEquipmentRepositoryImpl implements EquipmentRepository {
  private getAllAssets(): AssetDefinition[] {
    const customAssets = htmlEquipmentModuleRegistry.listRegisteredAssets();
    const customIds = new Set(customAssets.map((a) => a.assetId));
    const baseAssets = MOCK_EQUIPMENT_ASSETS.filter(
      (a) => !customIds.has(a.assetId),
    ).map((a) => htmlEquipmentModuleRegistry.getAssetOverride(a.assetId) ?? a);
    return [...customAssets, ...baseAssets];
  }

  list(query?: EquipmentQuery): AssetDefinition[] {
    const allAssets = this.getAllAssets();
    if (!query) return [...allAssets];

    return allAssets.filter((asset) => {
      if (query.subject && query.subject !== 'all' && asset.subject !== query.subject) {
        return false;
      }
      if (
        query.category &&
        query.category !== 'all' &&
        asset.category !== query.category &&
        !asset.categoryIds.includes(query.category)
      ) {
        return false;
      }
      if (
        query.verificationStatus &&
        query.verificationStatus !== 'all' &&
        asset.validation.metrologyStatus !== query.verificationStatus &&
        asset.validation.geometryStatus !== query.verificationStatus
      ) {
        return false;
      }
      if (
        query.format &&
        query.format !== 'all' &&
        asset.geometry.modelFormat !== query.format
      ) {
        return false;
      }
      if (query.search && query.search.trim() !== '') {
        const q = query.search.trim().toLowerCase();
        const inNameVi = asset.name.vi.toLowerCase().includes(q);
        const inNameEn = asset.name.en.toLowerCase().includes(q);
        const inId = asset.assetId.toLowerCase().includes(q);
        const inTags = asset.tags.some((t) => t.toLowerCase().includes(q));
        const inTextbook =
          asset.textbookRef?.lesson.toLowerCase().includes(q) ||
          asset.textbookRef?.chapter.toLowerCase().includes(q) ||
          asset.textbookRef?.standardFunction.toLowerCase().includes(q);
        if (!inNameVi && !inNameEn && !inId && !inTags && !inTextbook) {
          return false;
        }
      }
      return true;
    });
  }

  getById(assetId: string, version?: string): AssetDefinition | null {
    const allAssets = this.getAllAssets();
    const found = allAssets.find(
      (a) => a.assetId === assetId && (!version || a.assetVersion === version),
    );
    return found ?? allAssets.find((a) => a.assetId === assetId) ?? null;
  }

  listCategories(): CategoryMeta[] {
    return CATEGORIES;
  }
}

class MockKitRepositoryImpl implements KitRepository {
  list(): EquipmentKit[] {
    return [...MOCK_EQUIPMENT_KITS];
  }
  getById(kitId: string): EquipmentKit | null {
    return MOCK_EQUIPMENT_KITS.find((k) => k.kitId === kitId) ?? null;
  }
}

class MockEnvironmentRepositoryImpl implements EnvironmentRepository {
  list(): LabEnvironment[] {
    return [...MOCK_LAB_ENVIRONMENTS];
  }
  getById(environmentId: string): LabEnvironment | null {
    return MOCK_LAB_ENVIRONMENTS.find((e) => e.environmentId === environmentId) ?? null;
  }
}

class MockExperimentRepositoryImpl implements ExperimentRepository {
  list(): ExperimentDefinition[] {
    return [...MOCK_EXPERIMENTS];
  }
  getById(experimentId: string): ExperimentDefinition | null {
    return MOCK_EXPERIMENTS.find((e) => e.experimentId === experimentId) ?? null;
  }
}

class MockSceneRepositoryImpl implements SceneRepository {
  getInitialScene(): LabScene {
    return this.cloneInitialScene();
  }
  cloneInitialScene(): LabScene {
    return JSON.parse(JSON.stringify(INITIAL_DEMO_SCENE)) as LabScene;
  }
}

export const equipmentRepository: EquipmentRepository = new MockEquipmentRepositoryImpl();
export const kitRepository: KitRepository = new MockKitRepositoryImpl();
export const environmentRepository: EnvironmentRepository = new MockEnvironmentRepositoryImpl();
export const experimentRepository: ExperimentRepository = new MockExperimentRepositoryImpl();
export const sceneRepository: SceneRepository = new MockSceneRepositoryImpl();
