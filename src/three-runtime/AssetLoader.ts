import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AssetDefinition } from '../domain/types';
import { buildProceduralEquipmentGroup } from './ProceduralLabModels';
import { htmlEquipmentModuleRegistry } from './HtmlEquipmentModuleRegistry';

export interface AssetLoadResult {
  assetId: string;
  assetVersion: string;
  root: THREE.Group;
  sourceMode: 'glb-loaded' | 'procedural-pbr';
  warnings: string[];
}

export interface AssetValidationReport {
  isValid: boolean;
  hasValidAnchor: boolean;
  hasValidScale: boolean;
  namedNodesFound: string[];
  warnings: string[];
}

/**
 * OPENLAB 3D — ASSET LOADER & PROTOTYPE CACHE
 * Đảm bảo mỗi phiên bản tài sản (`assetId@assetVersion`) chỉ được khởi tạo/tải một lần
 * và tạo bản sao độc lập (instance clone) cho từng đối tượng trong cảnh 3D.
 */
export class OpenLabAssetLoader {
  private prototypeCache = new Map<string, AssetLoadResult>();
  private gltfLoader = new GLTFLoader();
  private isSoftwareGl = false;

  setSoftwareGlMode(isSoftwareGl: boolean): void {
    this.isSoftwareGl = isSoftwareGl;
  }

  private getCacheKey(assetId: string, assetVersion: string): string {
    return `${assetId}@${assetVersion}`;
  }

  async loadInstanceMesh(asset: AssetDefinition): Promise<AssetLoadResult> {
    const key = this.getCacheKey(asset.assetId, asset.assetVersion);
    let cached = this.prototypeCache.get(key);

    if (!cached) {
      const warnings: string[] = [];
      let prototypeGroup: THREE.Group;
      let sourceMode: 'glb-loaded' | 'procedural-pbr' = 'procedural-pbr';

      // 0. Nếu thiết bị có Module HTML chuẩn trong thư viện (HTML Equipment Module), ưu tiên dùng hàm dựng 3D của module
      const customPkg = htmlEquipmentModuleRegistry.getModule(asset.assetId);
      if (customPkg?.buildEquipmentGroup) {
        try {
          prototypeGroup = customPkg.buildEquipmentGroup(THREE, asset);
          sourceMode = 'procedural-pbr';
        } catch (pkgErr) {
          warnings.push(
            `Lỗi khi dựng mô hình từ HTML module của "${asset.name.vi}": ${pkgErr}. Đang dùng mô hình dự phòng.`,
          );
          prototypeGroup = buildProceduralEquipmentGroup(asset, this.isSoftwareGl);
        }
      } else if (
        asset.geometry.modelUri.startsWith('http://') ||
        asset.geometry.modelUri.startsWith('https://') ||
        asset.geometry.modelUri.startsWith('blob:')
      ) {
        try {
          const gltf = await this.gltfLoader.loadAsync(asset.geometry.modelUri);
          prototypeGroup = gltf.scene;
          sourceMode = 'glb-loaded';
        } catch {
          warnings.push(
            `Không thể tải tệp GLB từ "${asset.geometry.modelUri}". Đã chuyển sang mô hình PBR đa thành phần chuẩn hóa.`,
          );
          prototypeGroup = buildProceduralEquipmentGroup(asset, this.isSoftwareGl);
        }
      } else {
        // Trong giai đoạn Prototype, dựng trực tiếp mô hình 3D PBR đa thành phần theo quy ước không gian mét (m)
        prototypeGroup = buildProceduralEquipmentGroup(asset, this.isSoftwareGl);
      }

      cached = {
        assetId: asset.assetId,
        assetVersion: asset.assetVersion,
        root: prototypeGroup,
        sourceMode,
        warnings,
      };
      this.prototypeCache.set(key, cached);
    }

    // Sao chép (clone) độc lập cả Geometry và Material cho từng SceneInstance để khi xóa hoặc cập nhật
    // một thiết bị trên bàn không bao giờ giải phóng nhầm bộ nhớ GPU của nguyên mẫu trong cache.
    const clonedRoot = cached.root.clone(true);
    const clonedMaterialMap = new Map<THREE.Material, THREE.Material>();
    clonedRoot.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
        if (child.geometry) {
          child.geometry = child.geometry.clone();
        }
        if (Array.isArray(child.material)) {
          child.material = child.material.map((origMat: THREE.Material) => {
            const cachedMat = clonedMaterialMap.get(origMat);
            if (cachedMat) return cachedMat;
            const freshMat = origMat.clone();
            clonedMaterialMap.set(origMat, freshMat);
            return freshMat;
          });
        } else if (child.material) {
          const origMat = child.material as THREE.Material;
          let nextMat = clonedMaterialMap.get(origMat);
          if (!nextMat) {
            nextMat = origMat.clone();
            clonedMaterialMap.set(origMat, nextMat);
          }
          child.material = nextMat;
        }
      }
    });

    return {
      assetId: cached.assetId,
      assetVersion: cached.assetVersion,
      root: clonedRoot,
      sourceMode: cached.sourceMode,
      warnings: [...cached.warnings],
    };
  }

  validateAssetGeometry(asset: AssetDefinition, group: THREE.Object3D): AssetValidationReport {
    const namedNodesFound: string[] = [];
    group.traverse((obj) => {
      if (obj.name) {
        namedNodesFound.push(obj.name);
      }
    });

    const warnings: string[] = [];
    if (asset.geometry.scaleValidation === 'not-verified') {
      warnings.push('Tỷ lệ kích thước chưa được đối chiếu thực nghiệm.');
    }

    return {
      isValid: true,
      hasValidAnchor: asset.geometry.anchor === 'base-center',
      hasValidScale: asset.geometry.upAxis === 'Y',
      namedNodesFound,
      warnings,
    };
  }

  static disposeObject3D(object: THREE.Object3D): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => {
            if (m.map && m.userData?.ownsTexture) {
              m.map.dispose();
            }
            m.dispose();
          });
        } else if (child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          if (mat.map && mat.userData?.ownsTexture) {
            mat.map.dispose();
          }
          mat.dispose();
        }
      }
    });
  }

  invalidateAssetCache(assetId: string): void {
    for (const [key, entry] of this.prototypeCache.entries()) {
      if (entry.assetId === assetId || key.startsWith(`${assetId}@`)) {
        OpenLabAssetLoader.disposeObject3D(entry.root);
        this.prototypeCache.delete(key);
      }
    }
  }

  clearAllCache(): void {
    this.disposeAll();
  }

  disposeAll(): void {
    for (const entry of this.prototypeCache.values()) {
      OpenLabAssetLoader.disposeObject3D(entry.root);
    }
    this.prototypeCache.clear();
  }
}

export const openLabAssetLoader = new OpenLabAssetLoader();
