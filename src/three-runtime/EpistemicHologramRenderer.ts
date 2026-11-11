/**
 * OPENLAB 3D — EPISTEMIC HOLOGRAM RENDERER
 * 
 * Lớp Đồ họa 3D Three.js cho Mạng Nơ-ron Tri thức Nhận thức 3 Tầng:
 * 1. Thẻ Hologram 3D Neo-Glass Billboard lơ lửng trên thiết bị mang giá trị thời gian thực và sai số ISO GUM
 * 2. Luồng hạt photon va chạm khi kéo thả hợp nhất hai biến số
 * 3. Vương miện Nơ-ron Eureka phát quang rực rỡ bừng sáng giữa không gian 3D
 */

import * as THREE from 'three';
import {
  cognitiveNeuralEngine,
  EurekaEventDetail
} from '../domain/CognitiveNeuralEngine';
import { EpistemicVariableTag } from '../domain/cognitiveTopology';

export class EpistemicHologramRenderer {
  private _group: THREE.Group;
  private _billboardsMap: Map<string, THREE.Sprite> = new Map();
  private _selectedTagId: string | null = null;
  private _eurekaParticles: Array<{
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
  }> = [];
  private _eurekaCrownGroup: THREE.Group | null = null;
  private _lawCrystalMesh: THREE.Mesh | null = null;
  private _shockwaveRings: Array<{
    mesh: THREE.Mesh;
    radius: number;
    maxRadius: number;
    opacity: number;
  }> = [];
  private _fluxRingsMap: Map<string, THREE.Group> = new Map();

  constructor() {
    this._group = new THREE.Group();
    this._group.name = 'epistemic_hologram_group';
    this._initEventListeners();
  }

  public get group(): THREE.Group {
    return this._group;
  }

  private _initEventListeners() {
    window.addEventListener('openlab:eureka-law-discovered', (e: Event) => {
      const detail = (e as CustomEvent<EurekaEventDetail>).detail;
      this.spawnEurekaExplosion(detail);
    });
  }

  /**
   * Tạo Texture Canvas độ nét cao cho Thẻ Hologram 3D Billboard
   */
  private _createHologramCanvas(tag: EpistemicVariableTag, isSelected: boolean): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Nền Neo-Glassmorphism trong suốt với gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    if (isSelected) {
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.85)');
      grad.addColorStop(1, 'rgba(6, 78, 59, 0.90)');
    } else {
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.82)');
      grad.addColorStop(1, 'rgba(8, 47, 73, 0.88)');
    }

    ctx.fillStyle = grad;
    this._roundRect(ctx, 16, 16, 480, 224, 28);
    ctx.fill();

    // Viền Neon phát quang
    ctx.strokeStyle = isSelected ? '#10b981' : tag.isFused ? '#eab308' : '#38bdf8';
    ctx.lineWidth = isSelected ? 8 : 4;
    ctx.shadowColor = isSelected ? '#10b981' : '#38bdf8';
    ctx.shadowBlur = 18;
    this._roundRect(ctx, 16, 16, 480, 224, 28);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 1. Ký hiệu biến số nổi bật (Circle Badge)
    ctx.fillStyle = isSelected ? '#047857' : '#0369a1';
    ctx.beginPath();
    ctx.arc(80, 90, 48, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tag.symbol, 80, 92);

    // 2. Tên biến số khoa học
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(tag.nameVi.toUpperCase(), 145, 62);

    // 3. Giá trị đo thời gian thực
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px monospace';
    ctx.fillText(`${tag.formattedValue} ${tag.unitVi}`, 145, 114);

    // 4. Thanh phân định
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(35, 155);
    ctx.lineTo(477, 155);
    ctx.stroke();

    // 5. Chuẩn đo lường ISO GUM (Type A + Type B)
    ctx.fillStyle = isSelected ? '#a7f3d0' : '#38bdf8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`ISO GUM: ${tag.isoGumText} (k=2)`, 45, 192);

    // 6. Nhãn trạng thái hợp nhất
    if (tag.isFused) {
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('⚡ ĐÃ HỢP NHẤT EUREKA', 475, 192);
    } else {
      ctx.fillStyle = isSelected ? '#ffffff' : '#64748b';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(isSelected ? 'ĐANG CHỌN (Nhấp thẻ khác để hợp nhất)' : 'Nhấp để hợp nhất nơ-ron', 475, 192);
    }

    return canvas;
  }


  /**
   * Tạo Texture Vành Trường Biểu Diễn Toán Học Đồng Quy (Concentric Epistemic Flux Rings)
   */
  private _createFluxRingCanvas(symbol: string): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const cx = 256;
    const cy = 256;

    // Vành ngoài
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 240, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0, Math.PI * 2);
    ctx.stroke();

    // Vạch chia độ hướng tâm (Ticks)
    const tickCount = 36;
    for (let i = 0; i < tickCount; i++) {
      const angle = (i / tickCount) * Math.PI * 2;
      const rInner = i % 3 === 0 ? 170 : 175;
      const rOuter = 180;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
      ctx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
      ctx.stroke();
    }

    // Công thức vi tích phân toán lý xoay vòng
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const formulas = [
      '∇·E = ρ/ε₀',
      '∇×E = -∂B/∂t',
      '∮B·dℓ = μ₀I',
      'P = m·g',
      'F = -k·Δl',
      'ρ = m/V',
      'I = U/R',
      'Q = I²Rt',
    ];

    for (let i = 0; i < formulas.length; i++) {
      const angle = (i / formulas.length) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx + Math.cos(angle) * 210, cy + Math.sin(angle) * 210);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(formulas[i], 0, 0);
      ctx.restore();
    }

    return canvas;
  }

  private _roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /**
   * Cập nhật danh sách các thẻ Hologram trong Scene Three.js
   */
  public updateHolograms(tags: EpistemicVariableTag[], isEnabled: boolean): void {
    if (!isEnabled) {
      this._group.visible = false;
      return;
    }
    this._group.visible = true;

    const currentIds = new Set<string>();

    for (const tag of tags) {
      if (!tag.isActive) continue;
      currentIds.add(tag.id);

      let sprite = this._billboardsMap.get(tag.id);
      const isSelected = this._selectedTagId === tag.id;

      if (!sprite) {
        const canvas = this._createHologramCanvas(tag, isSelected);
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.96,
          depthTest: false,
        });

        sprite = new THREE.Sprite(material);
        sprite.name = `epistemic_billboard_${tag.id}`;
        // Kích thước thế giới thực: rộng 0.24m, cao 0.12m
        sprite.scale.set(0.24, 0.12, 1.0);
        sprite.userData = { tagId: tag.id, tag };

        this._group.add(sprite);
        this._billboardsMap.set(tag.id, sprite);
      } else {
        // Cập nhật lại texture khi giá trị thay đổi
        const canvas = this._createHologramCanvas(tag, isSelected);
        if (sprite.material.map) {
          sprite.material.map.dispose();
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        sprite.material.map = texture;
        sprite.material.needsUpdate = true;
      }

      // Đặt tọa độ thế giới
      sprite.position.set(tag.worldPositionM[0], tag.worldPositionM[1], tag.worldPositionM[2]);

      // Cập nhật Vành Trường Biểu Diễn Toán Học Đồng Quy trên mặt bàn
      let ringGroup = this._fluxRingsMap.get(tag.id);
      if (!ringGroup) {
        ringGroup = new THREE.Group();
        ringGroup.name = `flux_ring_${tag.id}`;

        const ringGeom = new THREE.PlaneGeometry(0.38, 0.38);
        ringGeom.rotateX(-Math.PI / 2);

        const canvas = this._createFluxRingCanvas(tag.symbol);
        const texture = new THREE.CanvasTexture(canvas);
        const ringMat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.65,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.position.y = 0.003;
        ringGroup.add(ringMesh);

        this._group.add(ringGroup);
        this._fluxRingsMap.set(tag.id, ringGroup);
      }

      ringGroup.position.set(tag.worldPositionM[0], 0.003, tag.worldPositionM[2]);
    }

    // Xóa các thẻ cũ không còn active
    for (const [id, sprite] of this._billboardsMap.entries()) {
      if (!currentIds.has(id)) {
        this._group.remove(sprite);
        if (sprite.material.map) sprite.material.map.dispose();
        sprite.material.dispose();
        this._billboardsMap.delete(id);
      }
    }

    for (const [id, ringGroup] of this._fluxRingsMap.entries()) {
      if (!currentIds.has(id)) {
        this._group.remove(ringGroup);
        ringGroup.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.geometry.dispose();
            if ((mesh.material as any).map) (mesh.material as any).map.dispose();
            (mesh.material as THREE.Material).dispose();
          }
        });
        this._fluxRingsMap.delete(id);
      }
    }
  }

  /**
   * Xử lý click/raycast vào Thẻ Hologram 3D để hợp nhất 2 biến số
   */
  public handlePointerRaycast(raycaster: THREE.Raycaster): boolean {
    const sprites = Array.from(this._billboardsMap.values());
    const intersects = raycaster.intersectObjects(sprites, false);

    if (intersects.length > 0) {
      const clickedSprite = intersects[0].object as THREE.Sprite;
      const tagId = clickedSprite.userData?.tagId;

      if (!tagId) return false;

      if (!this._selectedTagId) {
        // Chọn biến số đầu tiên
        this._selectedTagId = tagId;
      } else if (this._selectedTagId === tagId) {
        // Hủy chọn nếu click lại chính nó
        this._selectedTagId = null;
      } else {
        // Hợp nhất biến số 1 và biến số 2!
        const varA = this._selectedTagId;
        const varB = tagId;
        this._selectedTagId = null;

        cognitiveNeuralEngine.fuseVariables(varA, varB);
      }
      return true;
    }

    return false;
  }

  /**
   * KÍCH HOẠT HIỆU ỨNG BÙNG NỔ HẠT PHOTON & VƯƠNG MIỆN EUREKA
   */
  public spawnEurekaExplosion(detail: EurekaEventDetail): void {
    const [cx, cy, cz] = detail.collisionWorldPos;

    // 1. Tạo 40 hạt photon ánh sáng vàng/xanh mở rộng hình cầu
    const pGeom = new THREE.SphereGeometry(0.008, 8, 8);
    const pMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

    for (let i = 0; i < 40; i++) {
      const mesh = new THREE.Mesh(pGeom, pMat);
      mesh.position.set(cx, cy, cz);

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 0.4 + Math.random() * 0.8;

      const vx = speed * Math.sin(phi) * Math.cos(theta);
      const vy = speed * Math.sin(phi) * Math.sin(theta);
      const vz = speed * Math.cos(phi);

      this._group.add(mesh);
      this._eurekaParticles.push({
        mesh,
        velocity: new THREE.Vector3(vx, vy, vz),
        life: 0,
        maxLife: 1.5,
      });
    }

    // 2. Tạo Vương miện Nơ-ron Định luật Eureka lơ lửng phát sáng
    if (this._eurekaCrownGroup) {
      this._group.remove(this._eurekaCrownGroup);
    }

    const crownGroup = new THREE.Group();
    crownGroup.position.set(cx, cy + 0.18, cz);

    // Vòng xuyến phát quang Pulsating Torus
    const torusGeom = new THREE.TorusGeometry(0.14, 0.006, 16, 64);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const torus = new THREE.Mesh(torusGeom, torusMat);
    torus.rotation.x = Math.PI / 2;
    crownGroup.add(torus);

    // Billboard vinh danh định luật
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(8, 47, 73, 0.95)';
      this._roundRect(ctx, 10, 10, 492, 180, 24);
      ctx.fill();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 20;
      this._roundRect(ctx, 10, 10, 492, 180, 24);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ KHOẢNH KHẮC EUREKA! BỪNG SÁNG ĐỊNH LUẬT ✨', 256, 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px monospace';
      ctx.fillText(detail.law.sgkFormula, 256, 105);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 26px monospace';
      ctx.fillText(`Kết quả: ${detail.resultValue} ${detail.resultUnit}`, 256, 150);
    }

    const tex = new THREE.CanvasTexture(canvas);
    const crownSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
    crownSprite.scale.set(0.48, 0.19, 1.0);
    crownSprite.position.set(0, 0.12, 0);
    crownGroup.add(crownSprite);

    // 3. Khối Đa Diện Tinh Thể Định Luật (Polyhedral Emergence Crystal)
    const crystalGeom = new THREE.OctahedronGeometry(0.055, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: true,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
    });
    const crystalMesh = new THREE.Mesh(crystalGeom, crystalMat);
    crystalMesh.position.set(0, 0.0, 0);
    crownGroup.add(crystalMesh);
    this._lawCrystalMesh = crystalMesh;

    // 4. Sóng Xung Kích Quang Học Lan Tỏa Mặt Bàn (Photon Shockwave Wavefront)
    const shockGeom = new THREE.RingGeometry(0.04, 0.07, 64);
    shockGeom.rotateX(-Math.PI / 2);
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const shockMesh = new THREE.Mesh(shockGeom, shockMat);
    shockMesh.position.set(cx, 0.005, cz);
    this._group.add(shockMesh);
    this._shockwaveRings.push({
      mesh: shockMesh,
      radius: 0.05,
      maxRadius: 1.6,
      opacity: 0.9,
    });

    this._group.add(crownGroup);
    this._eurekaCrownGroup = crownGroup;

    // Tự động mờ dần vương miện sau 15 giây
    setTimeout(() => {
      if (this._eurekaCrownGroup === crownGroup) {
        this._group.remove(crownGroup);
        this._eurekaCrownGroup = null;
      }
    }, 15000);
  }

  /**
   * Cập nhật hoạt họa 60 FPS trong Three.js Loop
   */
  public animate(deltaTime: number): void {
    // 1. Cập nhật các hạt photon Eureka
    for (let i = this._eurekaParticles.length - 1; i >= 0; i--) {
      const p = this._eurekaParticles[i];
      p.life += deltaTime;

      p.mesh.position.addScaledVector(p.velocity, deltaTime);
      p.velocity.y -= 0.25 * deltaTime; // Trọng lực nhẹ rơi hạt

      const alpha = Math.max(0, 1 - p.life / p.maxLife);
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = alpha;

      if (p.life >= p.maxLife) {
        this._group.remove(p.mesh);
        p.mesh.geometry.dispose();
        this._eurekaParticles.splice(i, 1);
      }
    }

    // 2. Xoay nhẹ vòng xuyến vương miện Eureka & Khối Tinh Thể Định Luật
    if (this._eurekaCrownGroup) {
      this._eurekaCrownGroup.rotation.y += deltaTime * 0.8;
      if (this._lawCrystalMesh) {
        this._lawCrystalMesh.rotation.x += deltaTime * 1.2;
        this._lawCrystalMesh.rotation.y += deltaTime * 1.6;
      }
    }

    // 3. Lan tỏa Sóng Xung Kích Quang Học Photon
    for (let i = this._shockwaveRings.length - 1; i >= 0; i--) {
      const sw = this._shockwaveRings[i];
      sw.radius += deltaTime * 1.5;
      const progress = sw.radius / sw.maxRadius;
      sw.opacity = Math.max(0, 0.9 * (1.0 - progress));

      const scale = sw.radius / 0.05;
      sw.mesh.scale.set(scale, scale, 1);
      (sw.mesh.material as THREE.MeshBasicMaterial).opacity = sw.opacity;

      if (progress >= 1.0) {
        this._group.remove(sw.mesh);
        sw.mesh.geometry.dispose();
        (sw.mesh.material as THREE.Material).dispose();
        this._shockwaveRings.splice(i, 1);
      }
    }

    // 4. Xoay nhẹ Vành Trường Biểu Diễn Toán Học Đồng Quy
    let ringIdx = 0;
    for (const ringGroup of this._fluxRingsMap.values()) {
      ringIdx++;
      const dir = ringIdx % 2 === 0 ? 1 : -1;
      ringGroup.rotation.y += deltaTime * 0.35 * dir;
    }
  }

  public dispose(): void {
    for (const sprite of this._billboardsMap.values()) {
      this._group.remove(sprite);
      if (sprite.material.map) sprite.material.map.dispose();
      sprite.material.dispose();
    }
    this._billboardsMap.clear();

    for (const p of this._eurekaParticles) {
      this._group.remove(p.mesh);
      p.mesh.geometry.dispose();
      (p.mesh.material as THREE.Material).dispose();
    }
    this._eurekaParticles = [];

    if (this._eurekaCrownGroup) {
      this._group.remove(this._eurekaCrownGroup);
      this._eurekaCrownGroup = null;
    }
  }
}

export const epistemicHologramRenderer = new EpistemicHologramRenderer();
