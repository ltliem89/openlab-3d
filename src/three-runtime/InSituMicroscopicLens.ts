/**
 * OPENLAB 3D — IN-SITU VOLUMETRIC MULTI-SCALE STENCIL LENS
 * 
 * Thấu kính Khảo sát Đa Thang đo Trực vị Không gian 3D:
 * - Hiển thị thực thể thấu kính 3D (vành đồng thau, tay cầm kỹ thuật, mặt kính quang học).
 * - Chiếu trực tiếp thế giới vi hạt (động học phân tử H₂O hoặc electron trôi dạt)
 *   ngay tại vị trí thực của vật thể vĩ mô trong Viewport 3D 60 FPS.
 */

import * as THREE from 'three';

export type InSituLensMode = 'WATER' | 'ELECTRON' | 'PHOTON';

interface MicroParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: THREE.Color;
  size: number;
}

export class InSituMicroscopicLens {
  private _group: THREE.Group;
  private _isActive: boolean = false;
  private _mode: InSituLensMode = 'WATER';
  private _targetPos: THREE.Vector3 = new THREE.Vector3(0, 0.85, 0);
  private _particles: MicroParticle[] = [];
  private _particleMesh: THREE.InstancedMesh | null = null;
  private readonly _particleCount: number = 80;
  private _dummy: THREE.Object3D = new THREE.Object3D();
  private _labelSprite: THREE.Sprite | null = null;

  constructor() {
    this._group = new THREE.Group();
    this._group.name = 'in_situ_microscopic_lens_group';
    this._group.visible = false;
    this._build3DLensHardware();
    this._buildMicroParticles();
    this._buildHeaderLabel();
  }

  public get group(): THREE.Group {
    return this._group;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public setActive(active: boolean): void {
    this._isActive = active;
    this._group.visible = active;
  }

  public toggle(): boolean {
    this.setActive(!this._isActive);
    return this._isActive;
  }

  public setMode(mode: InSituLensMode): void {
    this._mode = mode;
    this._updateLabelText();
    this._resetParticlesForMode();
  }

  public setTargetPosition(x: number, y: number, z: number): void {
    this._targetPos.set(x, y + 0.22, z);
  }

  /**
   * Tạo hình học Thấu kính Khảo sát 3D (Vành đồng thau + Kính quang học + Tay cầm)
   */
  private _build3DLensHardware(): void {
    // 1. Vành kim loại đồng thau PBR (Brass Bezel)
    const rimGeom = new THREE.TorusGeometry(0.12, 0.007, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x332200,
    });
    const rimMesh = new THREE.Mesh(rimGeom, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    this._group.add(rimMesh);

    // 2. Tay cầm kim loại nghiêng 45 độ (Handle)
    const handleGeom = new THREE.CylinderGeometry(0.006, 0.007, 0.16, 16);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.6,
      roughness: 0.4,
    });
    const handleMesh = new THREE.Mesh(handleGeom, handleMat);
    handleMesh.position.set(0.11, 0, 0.11);
    handleMesh.rotation.z = -Math.PI / 4;
    handleMesh.rotation.x = Math.PI / 4;
    this._group.add(handleMesh);

    // 3. Mặt kính quang học phát quang nhẹ (Optical Stencil Disc)
    const glassGeom = new THREE.CircleGeometry(0.118, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      roughness: 0.1,
      transmission: 0.7,
      thickness: 0.005,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const glassMesh = new THREE.Mesh(glassGeom, glassMat);
    glassMesh.rotation.x = Math.PI / 2;
    this._group.add(glassMesh);

    // 4. Vòng hào quang Stencil phát sáng (Luminous Aura Ring)
    const auraGeom = new THREE.RingGeometry(0.116, 0.122, 64);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const auraMesh = new THREE.Mesh(auraGeom, auraMat);
    auraMesh.rotation.x = Math.PI / 2;
    this._group.add(auraMesh);
  }

  /**
   * Khởi tạo hệ thống hạt vi mô InstancedMesh (H2O / Electron)
   */
  private _buildMicroParticles(): void {
    const sphereGeom = new THREE.SphereGeometry(0.006, 8, 8);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });

    this._particleMesh = new THREE.InstancedMesh(sphereGeom, sphereMat, this._particleCount);
    this._particleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this._group.add(this._particleMesh);

    this._resetParticlesForMode();
  }

  private _resetParticlesForMode(): void {
    this._particles = [];
    const rLimit = 0.095;

    for (let i = 0; i < this._particleCount; i++) {
      const radius = Math.random() * rLimit;
      const angle = Math.random() * Math.PI * 2;
      const px = Math.cos(angle) * radius;
      const pz = Math.sin(angle) * radius;
      const py = (Math.random() - 0.5) * 0.04;

      let vel = new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.05
      );
      let color = new THREE.Color(0x38bdf8);

      if (this._mode === 'WATER') {
        // Đỏ (Oxy) hoặc Trắng (Hydro)
        color = Math.random() > 0.33 ? new THREE.Color(0xef4444) : new THREE.Color(0xf8fafc);
      } else if (this._mode === 'ELECTRON') {
        // Xanh dương phát quang electron
        color = new THREE.Color(0x60a5fa);
        vel.set((Math.random() * 0.1) + 0.05, 0, (Math.random() - 0.5) * 0.02);
      } else {
        // Photon vàng
        color = new THREE.Color(0xfacc15);
      }

      this._particles.push({
        pos: new THREE.Vector3(px, py, pz),
        vel,
        color,
        size: 0.005 + Math.random() * 0.003,
      });

      if (this._particleMesh) {
        this._particleMesh.setColorAt(i, color);
      }
    }

    if (this._particleMesh && this._particleMesh.instanceColor) {
      this._particleMesh.instanceColor.needsUpdate = true;
    }
  }

  /**
   * Tạo nhãn định danh khoa học gắn ngay trên đầu thấu kính
   */
  private _buildHeaderLabel(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.roundRect(10, 10, 492, 108, 16);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.roundRect(10, 10, 492, 108, 16);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🔍 KHẢO SÁT VI MÔ TRỰC VỊ 3D', 256, 50);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('Động học Phân tử H₂O & Liên kết Hydro', 256, 90);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    this._labelSprite = new THREE.Sprite(spriteMat);
    this._labelSprite.scale.set(0.36, 0.09, 1.0);
    this._labelSprite.position.set(0, 0.16, 0);
    this._group.add(this._labelSprite);
  }

  private _updateLabelText(): void {
    if (!this._labelSprite || !this._labelSprite.material.map) return;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.roundRect(10, 10, 492, 108, 16);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.roundRect(10, 10, 492, 108, 16);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🔍 KHẢO SÁT VI MÔ TRỰC VỊ 3D', 256, 50);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 22px sans-serif';

    if (this._mode === 'WATER') {
      ctx.fillText('Động học Phân tử H₂O (Maxwell-Boltzmann)', 256, 90);
    } else if (this._mode === 'ELECTRON') {
      ctx.fillText('Dòng Electron trôi dạt (I = n·q·A·v_d)', 256, 90);
    } else {
      ctx.fillText('Photon khúc xạ quang học (v = c/n)', 256, 90);
    }

    this._labelSprite.material.map.dispose();
    const texture = new THREE.CanvasTexture(canvas);
    this._labelSprite.material.map = texture;
    this._labelSprite.material.needsUpdate = true;
  }

  /**
   * Cập nhật chuyển động 60 FPS trong Viewport Loop
   */
  public animate(deltaTime: number): void {
    if (!this._isActive) return;

    // 1. Trôi êm dịu theo vị trí mục tiêu
    this._group.position.lerp(this._targetPos, Math.min(1.0, deltaTime * 6.0));

    // 2. Cập nhật vị trí các hạt vi mô bên trong thấu kính
    const rLimit = 0.095;
    for (let i = 0; i < this._particles.length; i++) {
      const p = this._particles[i];
      p.pos.addScaledVector(p.vel, deltaTime);

      const dist = Math.sqrt(p.pos.x * p.pos.x + p.pos.z * p.pos.z);
      if (dist > rLimit) {
        // Phản xạ đàn hồi kẹp biên trong vành thấu kính
        p.vel.x = -p.vel.x;
        p.vel.z = -p.vel.z;
        p.pos.x = (p.pos.x / dist) * (rLimit - 0.002);
        p.pos.z = (p.pos.z / dist) * (rLimit - 0.002);
      }

      this._dummy.position.copy(p.pos);
      this._dummy.scale.setScalar(p.size / 0.006);
      this._dummy.updateMatrix();

      if (this._particleMesh) {
        this._particleMesh.setMatrixAt(i, this._dummy.matrix);
      }
    }

    if (this._particleMesh) {
      this._particleMesh.instanceMatrix.needsUpdate = true;
    }
  }

  /**
   * Tính toán và phát hiện sai số thị sai góc nhìn (Parallax Error)
   * khi quan sát mặt khum ống đong từ góc nghiêng
   */
  public checkParallaxAngle(cameraLookDir: THREE.Vector3): { hasParallaxWarning: boolean; tiltAngleDeg: number; adviceVi: string } {
    const dotVertical = Math.abs(cameraLookDir.y);
    const tiltAngleDeg = Math.asin(Math.min(1.0, dotVertical)) * (180 / Math.PI);
    const hasParallaxWarning = tiltAngleDeg > 12.0;

    let adviceVi = 'Tầm mắt chuẩn ngang đáy mặt khum (Chuẩn ISO GUM)';
    if (hasParallaxWarning) {
      adviceVi = cameraLookDir.y > 0
        ? `Thị sai: Góc ngắm xiên trên ${tiltAngleDeg.toFixed(1)}° làm số đo dâng cao giả tạo! Hãy hạ tầm mắt ngang bằng đáy mặt khum!`
        : `Thị sai: Góc ngắm xiên dưới ${tiltAngleDeg.toFixed(1)}° làm số đo sụt giảm giả tạo! Hãy nâng tầm mắt ngang bằng đáy mặt khum!`;
    }

    return { hasParallaxWarning, tiltAngleDeg, adviceVi };
  }

  public dispose(): void {
    if (this._particleMesh) {
      this._particleMesh.geometry.dispose();
      (this._particleMesh.material as THREE.Material).dispose();
    }
    if (this._labelSprite && this._labelSprite.material.map) {
      this._labelSprite.material.map.dispose();
      this._labelSprite.material.dispose();
    }
  }
}

export const inSituMicroscopicLens = new InSituMicroscopicLens();
