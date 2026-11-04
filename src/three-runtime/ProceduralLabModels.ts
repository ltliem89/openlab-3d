import * as THREE from 'three';
import { AssetDefinition, ProceduralArchetype, SceneInstance } from '../domain/types';
import { htmlEquipmentModuleRegistry } from './HtmlEquipmentModuleRegistry';

/**
 * OPENLAB 3D — PROCEDURAL MULTI-PART PBR EQUIPMENT GENERATOR
 * Tạo mô hình 3D khoa học đa thành phần (3–12 bộ phận mỗi thiết bị) với:
 * - Gốc tọa độ (pivot) tại tâm mặt đáy (y = 0) đặt sát mặt bàn thí nghiệm.
 * - Các node con được đặt tên chuẩn hóa (`body`, `scale_display`, `scale_marks`, `liquid_surface`, `plunger`, `handle`, `measurement_anchor`).
 * - Vật liệu PBR (kim loại phay xước, thủy tinh Borosilicate có vạch chia CanvasTexture, màn hình LCD, đồng thau, nhôm, thép).
 * - Đĩa bóng tiếp xúc mềm (soft radial contact shadow) chống cảm giác vật thể lơ lửng.
 */

let cachedContactShadowTex: THREE.CanvasTexture | null = null;

function getContactShadowTexture(): THREE.CanvasTexture {
  if (cachedContactShadowTex) return cachedContactShadowTex;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 60);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.22)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cachedContactShadowTex = tex;
  return tex;
}

function addContactShadow(group: THREE.Group, radiusX: number, radiusZ: number): void {
  const geo = new THREE.PlaneGeometry(radiusX * 2.3, radiusZ * 2.3);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({
    map: getContactShadowTexture(),
    transparent: true,
    depthWrite: false,
    opacity: 0.65,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const shadowMesh = new THREE.Mesh(geo, mat);
  shadowMesh.position.y = 0.0015;
  shadowMesh.name = 'contact_shadow';
  group.add(shadowMesh);
}

export function createLcdDisplayTexture(textValue: string, unit = 'g'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 220;
  const ctx = canvas.getContext('2d')!;

  // Backlit LCD background with high-contrast metallic bezel
  ctx.fillStyle = '#031814';
  ctx.fillRect(0, 0, 640, 220);
  ctx.strokeStyle = '#2DD4BF';
  ctx.lineWidth = 8;
  ctx.strokeRect(5, 5, 630, 210);

  // Inner high-contrast dark emerald LCD screen
  ctx.fillStyle = '#052922';
  ctx.fillRect(14, 14, 612, 192);

  // Status indicator bar
  ctx.fillStyle = '#5EEAD4';
  ctx.font = 'bold 24px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('● STABLE   NET / TARE', 26, 48);

  // Faint 7-segment ghost background
  ctx.fillStyle = 'rgba(94, 234, 212, 0.08)';
  ctx.font = '900 132px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('888.88', 524, 182);

  // Active glowing numeric readout (extra bright & crisp for all viewing angles)
  ctx.fillStyle = '#A5F3FC';
  ctx.font = '900 132px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(textValue, 524, 182);

  // Unit symbol (g / ml / V / A / Ω)
  ctx.fillStyle = '#34D399';
  ctx.font = '900 60px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(unit, 536, 178);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Tạo mặt bảng điều khiển & màn hình LCD chuẩn thiết kế cân điện tử OHAUS Scout
 * Đã nâng cấp màn hình LCD to hơn, độ phân giải 1280×700 siêu sắc nét để đọc trực tiếp số gram ngay trên thân cân 3D
 */
export function createOhausScoutPanelTexture(textValue: string, unit = 'g'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 700;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 1280, 700);

  // 1. Nền tấm ốp mặt điều khiển màu trắng sứ bo góc mềm
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.roundRect(16, 16, 1248, 668, 52);
  ctx.fill();
  ctx.stroke();

  // Viền chỉ mảnh bên trong
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(32, 32, 1216, 636, 40);
  ctx.stroke();

  // Giọt nước cân bằng (Spirit Level Bubble) bên phải màn hình LCD
  const bx = 1142;
  const by = 180;
  ctx.fillStyle = '#E2E8F0';
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.arc(bx, by, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#DBEAFE';
  ctx.beginPath();
  ctx.arc(bx, by, 27, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(bx, by, 14, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
  ctx.beginPath();
  ctx.arc(bx - 2, by - 2, 10, 0, Math.PI * 2);
  ctx.fill();

  // 5. Khung màn hình LCD MỞ RỘNG TO & RÕ NÉT HƠN (Backlit High-Contrast White/Cyan LCD)
  const lcdX = 248;
  const lcdY = 88;
  const lcdW = 796;
  const lcdH = 292;

  const lcdGrad = ctx.createLinearGradient(lcdX, lcdY, lcdX, lcdY + lcdH);
  lcdGrad.addColorStop(0, '#E0F2FE');
  lcdGrad.addColorStop(0.5, '#F0F9FF');
  lcdGrad.addColorStop(1, '#DBEAFE');
  ctx.fillStyle = lcdGrad;
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.roundRect(lcdX, lcdY, lcdW, lcdH, 14);
  ctx.fill();
  ctx.stroke();

  // 2 đường kẻ ngang màu đỏ đặc trưng ở mép trên và mép dưới màn hình LCD
  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 6.5;
  ctx.beginPath();
  ctx.moveTo(lcdX + 6, lcdY + 6);
  ctx.lineTo(lcdX + lcdW - 6, lcdY + 6);
  ctx.moveTo(lcdX + 6, lcdY + lcdH - 6);
  ctx.lineTo(lcdX + lcdW - 6, lcdY + lcdH - 6);
  ctx.stroke();

  // Ký hiệu ổn định (*) và tâm không (>0<) hoặc cờ trừ bì âm ([-] TARE) bên trái trong màn hình LCD
  ctx.fillStyle = '#0F172A';
  ctx.font = '900 44px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('*', lcdX + 26, lcdY + 114);

  if (textValue.startsWith('-')) {
    ctx.fillStyle = '#DC2626';
    ctx.font = '900 32px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('[-] TARE', lcdX + 16, lcdY + 218);
  } else {
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 30px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('>0<', lcdX + 20, lcdY + 218);
  }

  // Bóng mờ 7-đoạn phía sau
  ctx.fillStyle = 'rgba(15, 23, 42, 0.06)';
  ctx.font = '900 198px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('888.88', lcdX + lcdW - 114, lcdY + 230);

  // Chữ số cân chính SIÊU ĐẬM, SẮC NÉT, CỠ LỚN (198px) kèm viền sáng chống lóa
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 7;
  ctx.font = '900 198px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.strokeText(textValue, lcdX + lcdW - 114, lcdY + 230);
  ctx.fillStyle = '#020617';
  ctx.fillText(textValue, lcdX + lcdW - 114, lcdY + 230);

  // Đơn vị (g) cỡ lớn rõ nét
  ctx.fillStyle = '#020617';
  ctx.font = '900 74px "Inter", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(unit, lcdX + lcdW - 94, lcdY + 228);

  // 6. Hàng 4 phím bấm chữ nhật viền đỏ phía dưới màn hình LCD
  const buttons = [
    { top: 'Zero', mid: '', sub: 'Yes', hasPowerIcon: true },
    { top: 'Print', mid: 'Units', sub: 'No', hasPowerIcon: false },
    { top: 'Function', mid: 'Mode', sub: 'Back', hasPowerIcon: false },
    { top: 'Tare', mid: 'Menu', sub: 'Exit', hasPowerIcon: false },
  ];

  const startBtnX = 204;
  const btnY = 434;
  const btnW = 198;
  const btnH = 132;
  const btnGap = 38;

  buttons.forEach((btn, idx) => {
    const x = startBtnX + idx * (btnW + btnGap);
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(x, btnY, btnW, btnH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#DC2626';
    ctx.textAlign = 'center';
    if (btn.mid) {
      ctx.font = 'bold 28px "Inter", sans-serif';
      ctx.fillText(btn.top, x + btnW / 2, btnY + 52);
      ctx.fillText(btn.mid, x + btnW / 2, btnY + 96);
    } else {
      ctx.font = 'bold 32px "Inter", sans-serif';
      ctx.fillText(btn.top, x + btnW / 2 - (btn.hasPowerIcon ? 14 : 0), btnY + 76);
    }

    if (btn.hasPowerIcon) {
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(x + btnW - 36, btnY + 38, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + btnW - 36, btnY + 27);
      ctx.lineTo(x + btnW - 36, btnY + 49);
      ctx.stroke();
    }

    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillText(btn.sub, x + btnW / 2, btnY + btnH + 34);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

let cachedOhausSideLogoTex: THREE.CanvasTexture | null = null;
function getOhausSideLogoTexture(): THREE.CanvasTexture {
  if (cachedOhausSideLogoTex) return cachedOhausSideLogoTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 256, 96);
  ctx.fillStyle = '#DC2626';
  ctx.font = 'italic 900 44px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OHAUS', 128, 62);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cachedOhausSideLogoTex = tex;
  return tex;
}

const cachedBrushedMetalTexMap = new Map<string, THREE.CanvasTexture>();
function getBrushedMetalReflectionTexture(baseHex: string, highlightHex: string): THREE.CanvasTexture {
  const key = `${baseHex}_${highlightHex}`;
  const existing = cachedBrushedMetalTexMap.get(key);
  if (existing) return existing;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0.0, baseHex);
  grad.addColorStop(0.22, highlightHex);
  grad.addColorStop(0.48, baseHex);
  grad.addColorStop(0.76, highlightHex);
  grad.addColorStop(1.0, baseHex);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  for (let y = 0; y < 256; y += 2) {
    ctx.strokeStyle = y % 4 === 0 ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  cachedBrushedMetalTexMap.set(key, tex);
  return tex;
}

function createReflectiveMetalWeightMaterial(
  colorHex: number,
  baseCss: string,
  highlightCss: string,
  roughness = 0.14,
  metalness = 0.94,
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: colorHex,
    map: getBrushedMetalReflectionTexture(baseCss, highlightCss),
    roughness,
    metalness,
    envMapIntensity: 1.65,
    clearcoat: 0.72,
    clearcoatRoughness: 0.08,
    reflectivity: 0.98,
  });
}

function createGraduationCanvasTexture(
  minVal: number,
  maxVal: number,
  stepVal: number,
  unitLabel: string,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 256, 512);

  ctx.font = '900 27px "JetBrains Mono", "Inter", monospace';

  const totalSteps = Math.max(1, Math.round((maxVal - minVal) / stepVal));
  const topY = 55;
  const bottomY = 455;
  const spanY = bottomY - topY;

  // Unit header
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.lineWidth = 5;
  ctx.strokeText(unitLabel, 86, 36);
  ctx.fillStyle = '#072F6B';
  ctx.fillText(unitLabel, 86, 36);

  for (let i = 0; i <= totalSteps; i++) {
    const val = minVal + i * stepVal;
    const t = i / totalSteps;
    const y = bottomY - t * spanY;
    const isMajor = i % 2 === 0;

    // Subtle white halo for contrast over water and glass
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.lineWidth = isMajor ? 6 : 3.8;
    ctx.beginPath();
    ctx.moveTo(64, y);
    ctx.lineTo(isMajor ? 114 : 94, y);
    ctx.stroke();

    ctx.strokeStyle = '#072F6B';
    ctx.lineWidth = isMajor ? 3.6 : 2.2;
    ctx.beginPath();
    ctx.moveTo(64, y);
    ctx.lineTo(isMajor ? 114 : 94, y);
    ctx.stroke();

    if (isMajor) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.lineWidth = 5;
      ctx.strokeText(String(val), 120, y + 9);
      ctx.fillStyle = '#072F6B';
      ctx.fillText(String(val), 120, y + 9);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createRulerCanvasTexture(maxMm: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  // Brushed stainless steel background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 160);
  bgGrad.addColorStop(0, '#CBD5E1');
  bgGrad.addColorStop(0.25, '#F1F5F9');
  bgGrad.addColorStop(0.65, '#E2E8F0');
  bgGrad.addColorStop(1, '#94A3B8');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 160);

  // Subtle top/bottom recessed track lines
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.lineTo(1024, 18);
  ctx.moveTo(0, 142);
  ctx.lineTo(1024, 142);
  ctx.stroke();

  ctx.strokeStyle = '#0F172A';
  ctx.fillStyle = '#0F172A';
  ctx.textAlign = 'center';

  // Calibrated so 0 mm starts near left jaw (-0.090m) and 150 mm reaches +0.060m on the 220mm scale plane
  const startX = 72;
  const endX = 772;
  const spanX = endX - startX;

  for (let mm = 0; mm <= maxMm; mm += 1) {
    const x = startX + (mm / maxMm) * spanX;
    const isCm = mm % 10 === 0;
    const isHalfCm = mm % 5 === 0 && !isCm;

    ctx.lineWidth = isCm ? 3.2 : isHalfCm ? 2.2 : 1.2;
    ctx.beginPath();
    ctx.moveTo(x, 140);
    ctx.lineTo(x, isCm ? 74 : isHalfCm ? 92 : 108);
    ctx.stroke();

    // Upper inch/secondary reference ticks
    if (mm % 2 === 0) {
      ctx.lineWidth = isCm ? 2.4 : 1.1;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, isCm ? 50 : 36);
      ctx.stroke();
    }

    if (isCm) {
      ctx.font = '900 29px "JetBrains Mono", monospace';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 3.5;
      ctx.strokeText(String(mm), x, 70);
      ctx.fillStyle = '#020617';
      ctx.fillText(String(mm), x, 70);
    }
  }

  ctx.font = '800 18px "Inter", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#1E293B';
  ctx.fillText('150mm · 0.02mm', 996, 88);
  ctx.font = '700 14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#0369A1';
  ctx.fillText('STAINLESS HARDENED', 996, 114);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

class HelixSpringCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    public radius: number,
    public height: number,
    public turns: number,
  ) {
    super();
  }
  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const angle = 2 * Math.PI * this.turns * t;
    const x = this.radius * Math.cos(angle);
    const z = this.radius * Math.sin(angle);
    const y = this.height * t;
    return optionalTarget.set(x, y, z);
  }
}

function createLeverArmRulerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Brushed aluminum finish
  const grad = ctx.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, '#E2E8F0');
  grad.addColorStop(0.3, '#F8FAFC');
  grad.addColorStop(0.7, '#CBD5E1');
  grad.addColorStop(1, '#94A3B8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 128);

  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 1024, 128);

  const cx = 512;
  // Center red axis line
  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(cx, 10);
  ctx.lineTo(cx, 118);
  ctx.stroke();

  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 22px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('0', cx, 38);

  const pxPerCm = 24.5;
  ctx.font = 'bold 15px "Inter", sans-serif';

  for (let cm = 1; cm <= 18; cm++) {
    // Right
    const rx = cx + cm * pxPerCm;
    if (rx < 1010) {
      const isHook = cm % 2 === 0;
      ctx.strokeStyle = isHook ? '#0284C7' : '#334155';
      ctx.lineWidth = isHook ? 2.5 : 1.2;
      ctx.beginPath();
      ctx.moveTo(rx, 118);
      ctx.lineTo(rx, isHook ? 48 : 78);
      ctx.stroke();
      if (isHook) {
        ctx.fillStyle = '#0369A1';
        ctx.fillText(`${cm}`, rx, 40);
      }
    }

    // Left
    const lx = cx - cm * pxPerCm;
    if (lx > 14) {
      const isHook = cm % 2 === 0;
      ctx.strokeStyle = isHook ? '#0284C7' : '#334155';
      ctx.lineWidth = isHook ? 2.5 : 1.2;
      ctx.beginPath();
      ctx.moveTo(lx, 118);
      ctx.lineTo(lx, isHook ? 48 : 78);
      ctx.stroke();
      if (isHook) {
        ctx.fillStyle = '#0369A1';
        ctx.fillText(`-${cm}`, lx, 40);
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function createVernierCarriageDisplayTexture(openingMm: number): THREE.CanvasTexture {
  const clampedMm = THREE.MathUtils.clamp(openingMm, 0, 150);
  // Snap to 0.02 mm Vernier resolution for display clarity
  const quantizedMm = Math.round(clampedMm * 50) / 50;
  const mainScaleMm = Math.floor(quantizedMm + 1e-6);
  const vernierRemMm = Math.max(0, Number((quantizedMm - mainScaleMm).toFixed(2)));
  const vernierTickIndex = Math.round(vernierRemMm / 0.02);

  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  // Dark anodized metallic frame
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(0, 0, 768, 320, 22);
  ctx.fill();

  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(4, 4, 760, 312, 18);
  ctx.stroke();

  // Top Header Bar
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(10, 10, 748, 48);
  ctx.fillStyle = '#38BDF8';
  ctx.font = '800 22px "Inter", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('DU XÍCH 0.02 mm · ĐO NGOÀI / TRONG / SÂU', 24, 41);
  ctx.fillStyle = '#FACC15';
  ctx.font = '900 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`k = ${vernierTickIndex}`, 742, 41);

  // High-contrast LCD Readout Panel
  const lcdX = 20;
  const lcdY = 66;
  const lcdW = 728;
  const lcdH = 148;
  const lcdGrad = ctx.createLinearGradient(0, lcdY, 0, lcdY + lcdH);
  lcdGrad.addColorStop(0, '#ECFDF5');
  lcdGrad.addColorStop(1, '#D1FAE5');
  ctx.fillStyle = lcdGrad;
  ctx.beginPath();
  ctx.roundRect(lcdX, lcdY, lcdW, lcdH, 14);
  ctx.fill();

  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(lcdX, lcdY, lcdW, lcdH, 14);
  ctx.stroke();

  // Left badge: Main + Vernier formula breakdown
  ctx.fillStyle = '#065F46';
  ctx.font = '800 22px "Inter", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Chính: ${mainScaleMm} mm`, lcdX + 20, lcdY + 46);
  ctx.fillStyle = '#047857';
  ctx.font = '800 22px "Inter", sans-serif';
  ctx.fillText(`Du xích: +${vernierRemMm.toFixed(2)} mm`, lcdX + 20, lcdY + 84);
  ctx.fillStyle = '#0F172A';
  ctx.font = '700 18px "JetBrains Mono", monospace';
  ctx.fillText(`d = ${mainScaleMm} + ${vernierTickIndex}×0.02`, lcdX + 20, lcdY + 122);

  // Main Digital Value on Right
  const valStr = quantizedMm.toFixed(2);
  ctx.fillStyle = '#020617';
  ctx.font = '900 110px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(valStr, lcdX + lcdW - 114, lcdY + 118);

  ctx.fillStyle = '#047857';
  ctx.font = '900 48px "Inter", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('mm', lcdX + lcdW - 102, lcdY + 118);

  // Bottom Beveled Nonius Vernier Scale Strip (0..10 divisions, highlighting matching tick)
  const stripY = 224;
  const stripH = 84;
  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(14, stripY, 740, stripH);

  ctx.strokeStyle = '#0F172A';
  ctx.fillStyle = '#0F172A';
  ctx.textAlign = 'center';
  const vStartX = 48;
  const vEndX = 720;
  const vSpan = vEndX - vStartX;

  for (let i = 0; i <= 50; i++) {
    const vx = vStartX + (i / 50) * vSpan;
    const isMajor = i % 5 === 0;
    const isAligned = i === vernierTickIndex;

    if (isAligned) {
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 4.5;
    } else {
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = isMajor ? 2.6 : 1.3;
    }
    ctx.beginPath();
    ctx.moveTo(vx, stripY);
    ctx.lineTo(vx, stripY + (isMajor ? 42 : 26));
    ctx.stroke();

    if (i % 5 === 0) {
      ctx.fillStyle = isAligned ? '#DC2626' : '#0F172A';
      ctx.font = isAligned
        ? '900 22px "JetBrains Mono", monospace'
        : '800 18px "JetBrains Mono", monospace';
      ctx.fillText(String(i / 5), vx, stripY + 68);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

let cachedHartmannProtractorTex: THREE.CanvasTexture | null = null;

export function createHartmannProtractorTexture(): THREE.CanvasTexture {
  if (cachedHartmannProtractorTex) return cachedHartmannProtractorTex;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const cx = 512;
  const cy = 512;
  const rOuter = 486;
  const rScale = 450;

  // 1. Nền đĩa kim loại phủ sơn trắng sứ chống chói (Anti-glare porcelain white)
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
  ctx.fill();

  // Vành ngoài thép mạ titan xám đậm
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Viền chỉ mảnh
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, rOuter - 8, 0, Math.PI * 2);
  ctx.stroke();

  // Vùng nửa trên: Môi trường tới 1 - Thủy tinh quang học Crown BK7 (n₁ = 1.50)
  const glassGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, rOuter - 10);
  glassGrad.addColorStop(0, 'rgba(224, 242, 254, 0.45)');
  glassGrad.addColorStop(1, 'rgba(186, 230, 253, 0.25)');
  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, rOuter - 10, Math.PI, 0, false);
  ctx.fill();

  // Vòng tròn chia độ mờ đồng tâm bên trong
  [140, 260, 360].forEach((r) => {
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // 2. Trục Pháp tuyến thẳng đứng N - N' (0° - 0°)
  ctx.strokeStyle = '#2563EB'; // Xanh dương hoàng gia
  ctx.lineWidth = 3.5;
  ctx.setLineDash([14, 8]);
  ctx.beginPath();
  ctx.moveTo(cx, cy - rOuter + 14);
  ctx.lineTo(cx, cy + rOuter - 14);
  ctx.stroke();
  ctx.setLineDash([]); // Reset nét đứt

  // 3. Mặt phẳng phân cách nằm ngang (90° - 90°)
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx - rOuter + 14, cy);
  ctx.lineTo(cx + rOuter - 14, cy);
  ctx.stroke();

  // 4. Các vạch chia độ 4 góc phần tư (0° đến 90° so với pháp tuyến N-N')
  for (let deg = 0; deg < 360; deg++) {
    let angleToNormal = 0;
    if (deg >= 0 && deg < 90) {
      angleToNormal = 90 - deg;
    } else if (deg >= 90 && deg < 180) {
      angleToNormal = deg - 90;
    } else if (deg >= 180 && deg < 270) {
      angleToNormal = 270 - deg;
    } else {
      angleToNormal = deg - 270;
    }

    const rad = (deg * Math.PI) / 180;
    const cosR = Math.cos(rad);
    const sinR = Math.sin(rad);

    const is10Deg = angleToNormal % 10 === 0;
    const is5Deg = angleToNormal % 5 === 0 && !is10Deg;

    const tickLen = is10Deg ? 28 : is5Deg ? 18 : 10;
    const r1 = rScale;
    const r2 = rScale - tickLen;

    ctx.strokeStyle = is10Deg ? '#0F172A' : is5Deg ? '#334155' : '#64748B';
    ctx.lineWidth = is10Deg ? 3 : is5Deg ? 2 : 1.2;
    ctx.beginPath();
    ctx.moveTo(cx + cosR * r1, cy + sinR * r1);
    ctx.lineTo(cx + cosR * r2, cy + sinR * r2);
    ctx.stroke();

    if (is10Deg && angleToNormal > 0 && angleToNormal < 90) {
      const textR = rScale - 46;
      const tx = cx + cosR * textR;
      const ty = cy + sinR * textR;
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(angleToNormal), tx, ty);
    }
  }

  // 5. Vạch đặc biệt màu đỏ đánh dấu góc tới hạn phản xạ toàn phần (i_gh ≈ 41.8°) ở nửa trên
  [228.2, 311.8].forEach((critDeg) => {
    const rad = (critDeg * Math.PI) / 180;
    const cosR = Math.cos(rad);
    const sinR = Math.sin(rad);

    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx + cosR * rScale, cy + sinR * rScale);
    ctx.lineTo(cx + cosR * (rScale - 38), cy + sinR * (rScale - 38));
    ctx.stroke();

    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.arc(cx + cosR * (rScale - 46), cy + sinR * (rScale - 46), 4.5, 0, Math.PI * 2);
    ctx.fill();

    const lblR = rScale - 78;
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('41.8°', cx + cosR * lblR, cy + sinR * lblR - 10);
    ctx.font = 'bold 13px "Inter", sans-serif';
    ctx.fillText('(i_gh)', cx + cosR * lblR, cy + sinR * lblR + 8);
  });

  // 6. Chữ nhãn trục N, N', 90° và Tên môi trường
  ctx.fillStyle = '#2563EB';
  ctx.font = '900 24px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('N (0°)', cx, cy - rScale + 68);
  ctx.fillText("N' (0°)", cx, cy + rScale - 58);

  ctx.fillStyle = '#0F172A';
  ctx.font = '900 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('90°', cx - rScale + 48, cy - 14);
  ctx.textAlign = 'right';
  ctx.fillText('90°', cx + rScale - 48, cy - 14);

  ctx.fillStyle = '#0284C7';
  ctx.font = 'bold 17px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MÔI TRƯỜNG 1: THỦY TINH BK7 (n₁ = 1.50)', cx, cy - 170);

  ctx.fillStyle = '#475569';
  ctx.fillText('MÔI TRƯỜNG 2: KHÔNG KHÍ (n₂ = 1.00)', cx, cy + 180);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 13px "Inter", sans-serif';
  ctx.fillText('ĐĨA TRÒN QUANG HỌC HARTMANN 360° · ĐCNN 1°', cx, cy + 280);

  // 7. Tâm O định vị quang học (Crosshair & Circle)
  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 20, cy);
  ctx.lineTo(cx + 20, cy);
  ctx.moveTo(cx, cy - 20);
  ctx.lineTo(cx, cy + 20);
  ctx.stroke();

  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillText('O', cx + 18, cy - 12);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  cachedHartmannProtractorTex = tex;
  return tex;
}

function createDirectionalRayMesh(
  length: number,
  colorHex: number,
  directionZ: 1 | -1,
  arrowPointsForward: boolean,
): THREE.Group {
  const group = new THREE.Group();

  // 1. Lõi tia laser sáng rực (Inner intense laser core)
  const coreGeo = new THREE.CylinderGeometry(0.0014, 0.0014, length, 12);
  coreGeo.rotateX(Math.PI / 2);
  coreGeo.translate(0, 0, (directionZ * length) / 2);
  const coreMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.95,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.name = 'ray_core';
  group.add(coreMesh);

  // 2. Vỏ hào quang laser phát quang bán trong suốt (Outer laser glow sheath)
  const glowGeo = new THREE.CylinderGeometry(0.0036, 0.0036, length, 12);
  glowGeo.rotateX(Math.PI / 2);
  glowGeo.translate(0, 0, (directionZ * length) / 2);
  const glowMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  glowMesh.name = 'ray_glow';
  group.add(glowMesh);

  // 3. Mũi tên định hướng quang học 3D đặt tại khoảng giữa của tia sáng (Mid-ray optical cone arrow)
  // Quy chuẩn quang hình học SGK: mũi tên ở giữa tia sáng, không đặt ở cuối tia như vector lực
  const arrowGeo = new THREE.ConeGeometry(0.0042, 0.011, 14);
  arrowGeo.rotateX(arrowPointsForward ? Math.PI / 2 : -Math.PI / 2);
  const arrowMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.95,
  });
  const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
  arrowMesh.position.set(0, 0, (directionZ * length) / 2);
  arrowMesh.name = 'ray_arrow';
  group.add(arrowMesh);

  return group;
}

export const OPTICAL_BENCH_AXIS_Y = 0.095;

export interface OpticalLensSpec {
  id: 'conv_5' | 'conv_10' | 'conv_15' | 'div_10' | 'div_20' | 'flat_inf';
  codeLabel: string;
  shortCode: string;
  nameVi: string;
  focalLengthCm: number;
  diopterLabel: string;
  type: 'converging' | 'diverging' | 'flat';
  centerThicknessCm: number;
  edgeThicknessCm: number;
  descriptionVi: string;
}

export const OPTICAL_LENS_SPECS: Record<OpticalLensSpec['id'], OpticalLensSpec> = {
  conv_5: {
    id: 'conv_5',
    codeLabel: '+5 cm',
    shortCode: '+5',
    nameVi: 'Thấu kính Hội tụ f = +5 cm',
    focalLengthCm: 5,
    diopterLabel: '+20 D',
    type: 'converging',
    centerThicknessCm: 1.9,
    edgeThicknessCm: 0.25,
    descriptionVi: 'Rìa mỏng, phần giữa rất dày (độ tụ lớn, hội tụ mạnh)',
  },
  conv_10: {
    id: 'conv_10',
    codeLabel: '+10 cm',
    shortCode: '+10',
    nameVi: 'Thấu kính Hội tụ f = +10 cm',
    focalLengthCm: 10,
    diopterLabel: '+10 D',
    type: 'converging',
    centerThicknessCm: 1.4,
    edgeThicknessCm: 0.3,
    descriptionVi: 'Chuẩn SGK KHTN 9 (Hình 8.12) — rìa mỏng, giữa dày vừa',
  },
  conv_15: {
    id: 'conv_15',
    codeLabel: '+15 cm',
    shortCode: '+15',
    nameVi: 'Thấu kính Hội tụ f = +15 cm',
    focalLengthCm: 15,
    diopterLabel: '+6.7 D',
    type: 'converging',
    centerThicknessCm: 1.0,
    edgeThicknessCm: 0.35,
    descriptionVi: 'Rìa mỏng, độ cong nhẹ (tiêu cự dài)',
  },
  div_10: {
    id: 'div_10',
    codeLabel: '-10 cm',
    shortCode: '-10',
    nameVi: 'Thấu kính Phân kì f = -10 cm',
    focalLengthCm: -10,
    diopterLabel: '-10 D',
    type: 'diverging',
    centerThicknessCm: 0.28,
    edgeThicknessCm: 1.5,
    descriptionVi: 'Rìa dày, phần giữa lõm sâu (phân kì mạnh)',
  },
  div_20: {
    id: 'div_20',
    codeLabel: '-20 cm',
    shortCode: '-20',
    nameVi: 'Thấu kính Phân kì f = -20 cm',
    focalLengthCm: -20,
    diopterLabel: '-5 D',
    type: 'diverging',
    centerThicknessCm: 0.38,
    edgeThicknessCm: 1.05,
    descriptionVi: 'Rìa dày vừa, phần giữa lõm nhẹ (phân kì yếu)',
  },
  flat_inf: {
    id: 'flat_inf',
    codeLabel: '∞ (0 D)',
    shortCode: '∞',
    nameVi: 'Bản mặt phẳng song song (f = ∞)',
    focalLengthCm: 999999,
    diopterLabel: '0 D',
    type: 'flat',
    centerThicknessCm: 0.9,
    edgeThicknessCm: 0.9,
    descriptionVi: 'Hai mặt phẳng song song — tia sáng khúc xạ ở 2 mặt nhưng tia ló song song tia tới',
  },
};

export interface OpticalTextbookPreset {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  experimentMode: 'f_object' | 'laser_rays';
  lensProfileId: OpticalLensSpec['id'];
  beamMode: 'single' | 'double' | 'triple' | 'bundle' | 'divergent' | 'f_rays';
  objectDistanceCm: number;
  screenDistanceCm: number;
  lampDistanceCm: number;
  rayOffsetYCm: number;
  rayAngleDeg: number;
  cameraPreset: 'overview' | 'lens_macro' | 'eye_view' | 'screen_closeup' | 'top_down';
  observationNote: string;
}

export const OPTICAL_TEXTBOOK_PRESETS: OpticalTextbookPreset[] = [
  {
    id: 'rays_conv_10',
    badge: 'Đường truyền tia sáng · TK Hội tụ',
    title: 'Hội tụ +10cm (3 Tia)',
    subtitle: 'Chùm tia song song khúc xạ hội tụ tại tiêu điểm F\' (10 cm)',
    experimentMode: 'laser_rays',
    lensProfileId: 'conv_10',
    beamMode: 'triple',
    objectDistanceCm: 20,
    screenDistanceCm: 10,
    lampDistanceCm: 26,
    rayOffsetYCm: 0,
    rayAngleDeg: 0,
    cameraPreset: 'overview',
    observationNote:
      'Chùm 3 tia sáng song song với trục chính sau khi đi qua thấu kính hội tụ (+10 cm) bị khúc xạ chụm lại tại đúng tiêu điểm chính F\' cách quang tâm O 10 cm.',
  },
  {
    id: 'rays_div_10',
    badge: 'Đường truyền tia sáng · TK Phân kì',
    title: 'Phân kì -10cm (3 Tia)',
    subtitle: 'Chùm tia song song khúc xạ loe rộng, đường kéo dài qua F (-10 cm)',
    experimentMode: 'laser_rays',
    lensProfileId: 'div_10',
    beamMode: 'triple',
    objectDistanceCm: 20,
    screenDistanceCm: 20,
    lampDistanceCm: 26,
    rayOffsetYCm: 0,
    rayAngleDeg: 0,
    cameraPreset: 'overview',
    observationNote:
      'Chùm tia tới song song với trục chính qua thấu kính phân kì (-10 cm) cho chùm tia ló loe rộng ra; đường kéo dài của các tia ló (nét đứt) cắt nhau tại tiêu điểm F phía trước kính.',
  },
  {
    id: 'rays_flat_inf',
    badge: 'Bản mặt phẳng song song · f = ∞',
    title: 'Kính phẳng ∞',
    subtitle: 'Hai mặt phẳng song song: tia ló song song với tia tới',
    experimentMode: 'laser_rays',
    lensProfileId: 'flat_inf',
    beamMode: 'triple',
    objectDistanceCm: 20,
    screenDistanceCm: 20,
    lampDistanceCm: 26,
    rayOffsetYCm: 0,
    rayAngleDeg: 0,
    cameraPreset: 'lens_macro',
    observationNote:
      'Khi lắp bản thủy tinh phẳng song song (f = ∞), tia sáng vuông góc truyền thẳng không bị hội tụ hay phân kì. Nếu nghiêng góc tia tới α, tia sáng khúc xạ ở 2 mặt và ló ra song song với tia tới.',
  },
  {
    id: 'exp1_real_image',
    badge: 'Hình 8.12 · Thí nghiệm 1 (a, b)',
    title: 'Hình 8.12 · Hội tụ (d > f)',
    subtitle: 'Vật sáng chữ F ở ngoài khoảng tiêu cự (d = 20 cm > f = 10 cm)',
    experimentMode: 'f_object',
    lensProfileId: 'conv_10',
    beamMode: 'f_rays',
    objectDistanceCm: 20,
    screenDistanceCm: 20,
    lampDistanceCm: 32,
    rayOffsetYCm: 0,
    rayAngleDeg: 0,
    cameraPreset: 'overview',
    observationNote:
      'Khi đặt vật chữ F ngoài khoảng tiêu cự (d = 20 cm, f = 10 cm), dịch chuyển màn chắn (4) đến d\' = 20 cm ta hứng được ẢNH THẬT, NGƯỢC CHIỀU với vật và rõ nét trên màn.',
  },
  {
    id: 'exp1_virtual_image',
    badge: 'Hình 8.12 · Thí nghiệm 1 (c)',
    title: 'Hình 8.12 · Hội tụ (d < f)',
    subtitle: 'Vật chữ F trong khoảng tiêu cự (d = 6 cm < f = 10 cm) — Đặt mắt nhìn ảnh ảo',
    experimentMode: 'f_object',
    lensProfileId: 'conv_10',
    beamMode: 'f_rays',
    objectDistanceCm: 6,
    screenDistanceCm: 22,
    lampDistanceCm: 20,
    rayOffsetYCm: 0,
    rayAngleDeg: 0,
    cameraPreset: 'eye_view',
    observationNote:
      'Khi d = 6 cm < f = 10 cm, dịch chuyển màn chắn (4) ở mọi vị trí đều KHÔNG hứng được ảnh. Đặt mắt nhìn qua thấu kính từ phía màn chắn sẽ thấy ẢNH ẢO, CÙNG CHIỀU và LỚN HƠN VẬT (tại d\' = -15 cm).',
  },
  {
    id: 'exp2_diverging_f',
    badge: 'Hình 8.12 · Thí nghiệm 2',
    title: 'Hình 8.12 · Phân kì (-10cm)',
    subtitle: 'Thay bằng thấu kính phân kì f = -10 cm — Đặt mắt quan sát ảnh ảo nhỏ hơn vật',
    experimentMode: 'f_object',
    lensProfileId: 'div_10',
    beamMode: 'f_rays',
    objectDistanceCm: 20,
    screenDistanceCm: 20,
    lampDistanceCm: 32,
    rayOffsetYCm: 0,
    rayAngleDeg: 0,
    cameraPreset: 'eye_view',
    observationNote:
      'Với thấu kính phân kì (f = -10 cm), ở mọi vị trí đặt vật chữ F đều KHÔNG hứng được ảnh trên màn chắn (4). Đặt mắt nhìn qua thấu kính thấy ẢNH ẢO, CÙNG CHIỀU, NHỎ HƠN VẬT nằm trong khoảng tiêu cự.',
  },
];

export const OPTICAL_TEXTBOOK_QA = [
  {
    section: 'Chế độ 1 — Khảo sát đường truyền tia sáng & Hộp 6 Thấu kính',
    question: 'Làm thế nào phân biệt thấu kính hội tụ (+5, +10, +15 cm), phân kì (-10, -20 cm) và bản mặt song song (∞)?',
    answer:
      '1. Về hình dạng tiết diện: Thấu kính hội tụ có phần rìa mỏng hơn phần giữa (tiêu cự càng ngắn như +5 cm thì mặt lồi càng dày); thấu kính phân kì có phần rìa dày hơn phần giữa (lõm ở giữa); bản mặt song song (∞) có độ dày bằng nhau ở mọi điểm.\n2. Về đường truyền chùm tia sáng: Chiếu chùm tia tới song song trục chính từ đèn (1): qua thấu kính hội tụ chùm tia ló hội tụ tại tiêu điểm F\'; qua thấu kính phân kì chùm tia ló loe rộng ra; qua bản mặt song song chùm tia ló tiếp tục song song không đổi phương.',
    presetId: 'rays_conv_10',
  },
  {
    section: 'Hình 8.12 · Thí nghiệm 1 (Ý a & b) — Thấu kính hội tụ khi d > f',
    question: 'Đặt vật gần sát thấu kính hội tụ rồi dịch chuyển dần ra xa (d > f), dịch chuyển màn chắn (4) thì quan sát thấy gì?',
    answer:
      'Khi dịch chuyển vật sáng hình chữ F ra ngoài khoảng tiêu cự (d > f) và điều chỉnh vị trí màn chắn (4) đến đúng vị trí hội tụ d\' = df/(d - f), ta thu được một ẢNH THẬT hiện rõ nét trên màn chắn, NGƯỢC CHIỀU với vật sáng chữ F. Khi tăng dần khoảng cách d ra xa hơn nữa, ảnh thật dịch lại gần tiêu điểm F\' và kích thước ảnh nhỏ dần.',
    presetId: 'exp1_real_image',
  },
  {
    section: 'Hình 8.12 · Thí nghiệm 1 (Ý c) — Thấu kính hội tụ khi d < f',
    question: 'Đặt vật trong khoảng tiêu cự của thấu kính hội tụ (d < f), dịch chuyển màn chắn có hứng được ảnh không? Làm sao quan sát ảnh?',
    answer:
      'Khi vật nằm trong khoảng tiêu cự (0 < d < f): Dịch chuyển màn chắn (4) ở mọi vị trí đều KHÔNG hứng được ảnh trên màn vì chùm tia ló là chùm phân kì. Để quan sát được ảnh, ta phải đặt mắt ở phía sau thấu kính (phía màn chắn) nhìn ngược qua thấu kính về phía vật sáng: ta thấy một ẢNH ẢO, CÙNG CHIỀU và LỚN HƠN VẬT.',
    presetId: 'exp1_virtual_image',
  },
  {
    section: 'Hình 8.12 · Thí nghiệm 2 — Thấu kính phân kì',
    question: 'Thay thấu kính hội tụ bằng thấu kính phân kì, đặt vật ở mọi vị trí rồi dịch chuyển màn chắn có hứng được ảnh không?',
    answer:
      'Khi thay bằng thấu kính phân kì (-10 cm hoặc -20 cm), dù đặt vật sáng hình chữ F ở bất kì vị trí nào trước thấu kính và dịch chuyển màn chắn (4) khắp giá quang học, ta đều KHÔNG hứng được ảnh trên màn. Đặt mắt nhìn qua thấu kính về phía vật chữ F, ta luôn nhìn thấy ẢNH ẢO, CÙNG CHIỀU và NHỎ HƠN VẬT (nằm trong khoảng tiêu cự OF).',
    presetId: 'exp2_diverging_f',
  },
];

export function getOpticalLensSurfaceOffsetsM(
  profileId: OpticalLensSpec['id'],
  rM: number,
  lensRadiusM = 0.035,
): { frontOffsetM: number; backOffsetM: number } {
  const spec = OPTICAL_LENS_SPECS[profileId] ?? OPTICAL_LENS_SPECS.conv_10;
  const clampedR = Math.min(Math.abs(rM), lensRadiusM);
  const u = clampedR / lensRadiusM;
  const halfCenterM = (spec.centerThicknessCm * 0.01) / 2;
  const halfEdgeM = (spec.edgeThicknessCm * 0.01) / 2;

  if (spec.type === 'flat') {
    return { frontOffsetM: -halfCenterM, backOffsetM: halfCenterM };
  }
  const halfThicknessAtRM = halfCenterM + (halfEdgeM - halfCenterM) * (u * u);
  return {
    frontOffsetM: -halfThicknessAtRM,
    backOffsetM: halfThicknessAtRM,
  };
}

export interface TracedOpticalRay3D {
  id: string;
  start: THREE.Vector3;
  entryHit: THREE.Vector3;
  exitHit: THREE.Vector3;
  refractedEnd: THREE.Vector3;
  virtualStart?: THREE.Vector3;
  virtualEnd?: THREE.Vector3;
  color: number;
  label?: string;
  isFocused: boolean;
}

export interface TraceOpticalBenchParams {
  experimentMode: 'f_object' | 'laser_rays';
  beamMode: 'single' | 'double' | 'triple' | 'bundle' | 'divergent' | 'f_rays' | 'f-pattern';
  lensProfileId: OpticalLensSpec['id'];
  axisY: number;
  axisZ: number;
  lampSlitX: number;
  fObjectX: number;
  lensX: number;
  screenX: number;
  rayOffsetYCm: number;
  rayAngleDeg: number;
}

export function traceOpticalBenchRays(
  params: TraceOpticalBenchParams,
): TracedOpticalRay3D[] {
  const {
    experimentMode,
    beamMode,
    lensProfileId,
    axisY,
    axisZ,
    lampSlitX,
    fObjectX,
    lensX,
    screenX,
    rayOffsetYCm,
    rayAngleDeg,
  } = params;

  const spec = OPTICAL_LENS_SPECS[lensProfileId] ?? OPTICAL_LENS_SPECS.conv_10;
  const isInfinity = spec.type === 'flat' || Math.abs(spec.focalLengthCm) > 9999;
  const fSignedM = isInfinity ? 9999 : spec.focalLengthCm * 0.01;
  const nGlass = 1.5;
  const lensRadiusM = 0.035;
  const rays: TracedOpticalRay3D[] = [];

  const isLaserMode =
    experimentMode === 'laser_rays' ||
    beamMode === 'single' ||
    beamMode === 'double' ||
    beamMode === 'triple' ||
    beamMode === 'bundle' ||
    beamMode === 'divergent';

  if (isLaserMode) {
    const startX = lampSlitX;
    const endX = Math.max(lensX + 0.02, screenX);
    const offsetYM = rayOffsetYCm * 0.01;

    let yRelOffsetsM: number[] = [0];
    const effectiveBeam =
      beamMode === 'f_rays' || beamMode === 'f-pattern' ? 'triple' : beamMode;
    if (effectiveBeam === 'double') {
      yRelOffsetsM = [-0.014, 0.014];
    } else if (effectiveBeam === 'triple') {
      yRelOffsetsM = [-0.018, 0, 0.018];
    } else if (effectiveBeam === 'bundle') {
      yRelOffsetsM = [-0.022, -0.011, 0, 0.011, 0.022];
    } else if (effectiveBeam === 'divergent') {
      yRelOffsetsM = [-0.008, -0.004, 0, 0.004, 0.008];
    }

    const divergentDeltasDeg =
      effectiveBeam === 'divergent'
        ? [-8.0, -4.0, 0.0, 4.0, 8.0]
        : [0, 0, 0, 0, 0];

    yRelOffsetsM.forEach((relYM, idx) => {
      const extraAngleDeg = divergentDeltasDeg[idx] ?? 0;
      const angleRad = THREE.MathUtils.degToRad(rayAngleDeg + extraAngleDeg);
      const slopeIn = Math.tan(angleRad);
      const focalPlaneSlopeY = !isInfinity ? slopeIn * fSignedM : 0;

      const yStartRel = THREE.MathUtils.clamp(relYM + offsetYM, -0.029, 0.029);
      const yAtLensCenterRel = yStartRel + slopeIn * (lensX - startX);
      const yHit1Rel = THREE.MathUtils.clamp(yAtLensCenterRel, -0.032, 0.032);

      const { frontOffsetM } = getOpticalLensSurfaceOffsetsM(
        lensProfileId,
        yHit1Rel,
        lensRadiusM,
      );
      const xHit1 = lensX + frontOffsetM;

      // Nominal thin lens slope for internal ray estimation
      const approxOutSlope = !isInfinity ? (focalPlaneSlopeY - yHit1Rel) / fSignedM : slopeIn;
      const internalSlope = isInfinity
        ? slopeIn / nGlass
        : (slopeIn + approxOutSlope) * 0.5;

      const approxThickM = Math.abs(frontOffsetM) * 2;
      const yHit2ApproxRel = yHit1Rel + internalSlope * approxThickM;
      const { backOffsetM } = getOpticalLensSurfaceOffsetsM(
        lensProfileId,
        yHit2ApproxRel,
        lensRadiusM,
      );
      const xHit2 = lensX + backOffsetM;
      const yHit2Rel = THREE.MathUtils.clamp(
        yHit1Rel + internalSlope * (xHit2 - xHit1),
        -0.033,
        0.033,
      );

      // Exact physical ray convergence:
      // For converging lens (fSignedM > 0), emergent ray passes through focal point (lensX + fSignedM, focalPlaneSlopeY).
      // For diverging lens (fSignedM < 0), backward virtual ray extends to (lensX + fSignedM, focalPlaneSlopeY).
      // For flat glass (isInfinity), ray emerges undeviated with slopeIn.
      let outSlope = slopeIn;
      if (!isInfinity) {
        const focalX = lensX + fSignedM;
        const focalY = focalPlaneSlopeY; // slopeIn * fSignedM (0 for parallel rays)
        outSlope = (focalY - yHit2Rel) / (focalX - xHit2);
      }

      // Paraxial emergent ray extends cleanly along bench without artificial clipping
      const yEndRel = THREE.MathUtils.clamp(
        yHit2Rel + outSlope * (endX - xHit2),
        -0.25,
        0.25,
      );

      let virtualStart: THREE.Vector3 | undefined;
      let virtualEnd: THREE.Vector3 | undefined;
      if (spec.type === 'diverging' && !isInfinity) {
        const vx = lensX + fSignedM; // front focus F' (negative offset in front of lens)
        const vyRel = focalPlaneSlopeY;
        virtualStart = new THREE.Vector3(xHit2, axisY + yHit2Rel, axisZ);
        virtualEnd = new THREE.Vector3(vx, axisY + vyRel, axisZ);
      }

      const rayColors = [0xf59e0b, 0x38bdf8, 0x34d399, 0xfbbf24, 0xf472b6];
      const color =
        effectiveBeam === 'single'
          ? 0xf59e0b
          : rayColors[idx % rayColors.length];

      rays.push({
        id: `laser_ray_${idx}`,
        start: new THREE.Vector3(startX, axisY + yStartRel, axisZ),
        entryHit: new THREE.Vector3(xHit1, axisY + yHit1Rel, axisZ),
        exitHit: new THREE.Vector3(xHit2, axisY + yHit2Rel, axisZ),
        refractedEnd: new THREE.Vector3(endX, axisY + yEndRel, axisZ),
        virtualStart,
        virtualEnd,
        color,
        isFocused:
          spec.type === 'converging' &&
          Math.abs(screenX - lensX - fSignedM) < 0.008,
      });
    });

    return rays;
  }

  // CHẾ ĐỘ 2: VẬT SÁNG HÌNH CHỮ F (3 TIA ĐẶC TRƯNG SGK HÌNH 8.12)
  const objX = fObjectX;
  const dM = Math.max(0.02, lensX - objX);
  const hObjM = 0.018; // Đỉnh chữ F cao 1.8 cm trên trục chính
  const endX = Math.max(lensX + 0.02, screenX);

  const dCm = dM * 100;
  const fCm = spec.focalLengthCm;
  const isAtFocus = !isInfinity && Math.abs(dCm - fCm) < 0.08;
  const dPrimeM = isInfinity
    ? -dM
    : isAtFocus
      ? 999
      : (dM * fSignedM) / (dM - fSignedM);
  const mag = isInfinity ? 1 : isAtFocus ? 99 : -dPrimeM / dM;
  const hImgM = hObjM * mag;
  const isFocused =
    dPrimeM > 0 && dPrimeM < 50 && Math.abs(screenX - lensX - dPrimeM) < 0.0085;

  const buildFRay = (
    id: string,
    yLensTargetRel: number,
    outSlope: number,
    color: number,
    label: string,
  ): TracedOpticalRay3D => {
    const yHit1Rel = THREE.MathUtils.clamp(yLensTargetRel, -0.032, 0.032);
    const { frontOffsetM, backOffsetM } = getOpticalLensSurfaceOffsetsM(
      lensProfileId,
      yHit1Rel,
      lensRadiusM,
    );
    const xHit1 = lensX + frontOffsetM;
    const xHit2 = lensX + backOffsetM;
    const inSlope = (yHit1Rel - hObjM) / Math.max(0.005, xHit1 - objX);
    const internalSlope = isInfinity
      ? inSlope / nGlass
      : (inSlope + outSlope) * 0.5;
    const yHit2Rel = THREE.MathUtils.clamp(
      yHit1Rel + internalSlope * (xHit2 - xHit1),
      -0.033,
      0.033,
    );
    // Exact emergent slope for Tia 1: guaranteed to pass through image focus F' (lensX + fSignedM, 0)
    const effectiveOutSlope =
      !isInfinity && id === 'f_ray_parallel'
        ? (0 - yHit2Rel) / (lensX + fSignedM - xHit2)
        : outSlope;

    const yEndRel = THREE.MathUtils.clamp(
      yHit2Rel + effectiveOutSlope * (endX - xHit2),
      -0.25,
      0.25,
    );

    let virtualStart: THREE.Vector3 | undefined;
    let virtualEnd: THREE.Vector3 | undefined;
    if (dPrimeM < 0 && !isAtFocus) {
      const vx = lensX + dPrimeM;
      virtualStart = new THREE.Vector3(xHit2, axisY + yHit2Rel, axisZ);
      virtualEnd = new THREE.Vector3(vx, axisY + hImgM, axisZ);
    }

    return {
      id,
      start: new THREE.Vector3(objX, axisY + hObjM, axisZ),
      entryHit: new THREE.Vector3(xHit1, axisY + yHit1Rel, axisZ),
      exitHit: new THREE.Vector3(xHit2, axisY + yHit2Rel, axisZ),
      refractedEnd: new THREE.Vector3(endX, axisY + yEndRel, axisZ),
      virtualStart,
      virtualEnd,
      color,
      label,
      isFocused,
    };
  };

  // Tia 1: Song song trục chính -> Tia ló đi qua (hoặc kéo dài qua) tiêu điểm ảnh F'
  const slope1 = isInfinity ? 0 : -hObjM / fSignedM;
  rays.push(
    buildFRay(
      'f_ray_parallel',
      hObjM,
      slope1,
      0xf59e0b,
      'Tia tới song song trục chính',
    ),
  );

  // Tia 2: Đi qua quang tâm O -> Truyền thẳng không đổi hướng
  const slope2 = -hObjM / dM;
  rays.push(
    buildFRay('f_ray_center', 0, slope2, 0x38bdf8, 'Tia tới qua quang tâm O'),
  );

  // Tia 3: Đi qua tiêu điểm vật F -> Tia ló song song với trục chính
  if (!isInfinity && Math.abs(dM - fSignedM) > 0.015) {
    const yLens3 =
      spec.type === 'converging'
        ? hObjM * (1 - dM / (dM - fSignedM))
        : (hObjM * Math.abs(fSignedM)) / (dM + Math.abs(fSignedM));
    if (Math.abs(yLens3) <= 0.032) {
      rays.push(
        buildFRay(
          'f_ray_focal',
          yLens3,
          0,
          0x34d399,
          'Tia qua tiêu điểm -> ló song song',
        ),
      );
    }
  }

  return rays;
}

function createOpticalBenchRulerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, canvas.width, 8);
  ctx.fillRect(0, canvas.height - 8, canvas.width, 8);

  const totalCm = 90;
  const pxPerCm = canvas.width / totalCm;

  ctx.strokeStyle = '#0f172a';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  for (let cm = -45; cm <= 45; cm++) {
    const x = (cm + 45) * pxPerCm;
    const isZero = cm === 0;
    const isMajor5 = cm % 5 === 0;

    ctx.beginPath();
    ctx.lineWidth = isZero ? 4 : isMajor5 ? 2.5 : 1.5;
    ctx.strokeStyle = isZero ? '#dc2626' : '#1e293b';
    const tickH = isZero ? 52 : isMajor5 ? 40 : 22;
    ctx.moveTo(x, 8);
    ctx.lineTo(x, 8 + tickH);
    ctx.stroke();

    if (isMajor5) {
      ctx.font = isZero
        ? '900 36px "JetBrains Mono", monospace'
        : '900 29px "JetBrains Mono", monospace';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.lineWidth = 4;
      const label = isZero ? '0' : `${Math.abs(cm)}`;
      ctx.strokeText(label, x, 54);
      ctx.fillStyle = isZero ? '#dc2626' : '#020617';
      ctx.fillText(label, x, 54);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function createFrostedFObjectCanvasTexture(
  isVirtualGhost = false,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (isVirtualGhost) {
    ctx.clearRect(0, 0, 512, 512);
    ctx.beginPath();
    ctx.arc(256, 256, 236, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    ctx.save();
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#e0f2fe';
    ctx.translate(256, 256);
    ctx.fillRect(-55, -105, 32, 210);
    ctx.fillRect(-55, -105, 115, 32);
    ctx.fillRect(-55, -15, 85, 28);
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  // Dark housing background
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, 512, 512);

  // Circular frosted glass aperture
  const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 210);
  grad.addColorStop(0, '#fef3c7');
  grad.addColorStop(0.75, '#fde68a');
  grad.addColorStop(1, '#78350f');

  ctx.beginPath();
  ctx.arc(256, 256, 200, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Outer opaque mask ring inside aperture
  ctx.beginPath();
  ctx.arc(256, 256, 185, 0, Math.PI * 2);
  ctx.fillStyle = '#090d16';
  ctx.fill();

  // Glowing translucent F letter cutout
  ctx.save();
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 28;
  ctx.fillStyle = '#fffbeb';

  ctx.translate(256, 256);
  // Vertical stem of F
  ctx.fillRect(-55, -105, 32, 210);
  // Top horizontal bar of F
  ctx.fillRect(-55, -105, 115, 32);
  // Middle horizontal bar of F
  ctx.fillRect(-55, -15, 85, 28);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function createLampSlitCanvasTexture(
  isPoweredOn: boolean,
  beamMode: 'single' | 'double' | 'triple' | 'bundle' | 'divergent' | 'f_rays' | 'f-pattern' = 'triple',
  experimentMode: 'f_object' | 'laser_rays' = 'laser_rays',
  rayOffsetYCm = 0,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 248, 248);

  const glowColor = isPoweredOn ? '#fef08a' : '#334155';
  ctx.fillStyle = glowColor;
  if (isPoweredOn) {
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 18;
  }

  const isLaser =
    experimentMode === 'laser_rays' ||
    beamMode === 'single' ||
    beamMode === 'double' ||
    beamMode === 'triple' ||
    beamMode === 'bundle' ||
    beamMode === 'divergent';

  let modeLabelVi = 'VẬT SÁNG F';

  if (isLaser && beamMode !== 'f_rays' && beamMode !== 'f-pattern') {
    let slitsY = [128];
    if (beamMode === 'single') {
      slitsY = [128];
      modeLabelVi = '1 TIA SÁNG';
    } else if (beamMode === 'double') {
      slitsY = [92, 164];
      modeLabelVi = '2 TIA SÁNG';
    } else if (beamMode === 'triple') {
      slitsY = [76, 128, 180];
      modeLabelVi = '3 TIA SÁNG';
    } else if (beamMode === 'bundle') {
      slitsY = [60, 94, 128, 162, 196];
      modeLabelVi = 'CHÙM SONG SONG';
    } else if (beamMode === 'divergent') {
      slitsY = [128];
      modeLabelVi = 'CHÙM PHÂN KÌ';
    }

    const shiftPx = -(rayOffsetYCm / 2.6) * 44;
    if (beamMode === 'divergent') {
      ctx.beginPath();
      ctx.arc(68, 128 + shiftPx, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = glowColor;
      [-16, -8, 0, 8, 16].forEach((deg) => {
        const rad = (deg * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(68, 128 + shiftPx);
        ctx.lineTo(68 + Math.cos(rad) * 140, 128 + shiftPx + Math.sin(rad) * 140);
        ctx.stroke();
      });
    } else {
      slitsY.forEach((sy) => {
        ctx.fillRect(44, sy + shiftPx - 6, 168, 12);
      });
    }
  } else {
    // Round condenser aperture for illuminating F object
    ctx.beginPath();
    ctx.arc(128, 128, 66, 0, Math.PI * 2);
    ctx.fill();
    modeLabelVi = 'VẬT SÁNG F';
  }

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(modeLabelVi, 128, 234);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createLensHeadTagCanvasTexture(
  codeLabel: string,
  lensType: 'converging' | 'diverging' | 'flat',
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 256, 96);

  const borderColor =
    lensType === 'converging'
      ? '#f59e0b'
      : lensType === 'diverging'
        ? '#38bdf8'
        : '#cbd5e1';
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 248, 88);

  ctx.fillStyle = borderColor;
  ctx.font = 'bold 42px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(codeLabel, 128, 50);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function createPowerSupplyPanelCanvasTexture(
  isPoweredOn: boolean,
  voltageV: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 280;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 280);

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 492, 260);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 22px "Inter", sans-serif';
  ctx.fillText('NGUỒN ĐIỆN THÍ NGHIỆM (6)', 28, 42);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText('DC 0–12V', 395, 42);

  // Switch label + live status
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 16px "Inter", sans-serif';
  ctx.fillText('CÔNG TẮC', 42, 92);

  ctx.fillStyle = isPoweredOn ? '#34d399' : '#f87171';
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillText(isPoweredOn ? `● ON (${voltageV.toFixed(0)}V)` : '○ OFF (0V)', 34, 244);

  // Voltage dial markings around center (256, 155)
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 16px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ĐIỆN ÁP (V)', 256, 82);

  const voltages = ['3V', '6V', '9V', '12V'];
  const angles = [-Math.PI * 0.75, -Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.75];
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  voltages.forEach((v, idx) => {
    const a = angles[idx] - Math.PI / 2;
    const x = 256 + Math.cos(a) * 66;
    const y = 165 + Math.sin(a) * 66;
    ctx.fillStyle =
      isPoweredOn && Math.abs(voltageV - (idx + 1) * 3) < 0.5
        ? '#fbbf24'
        : '#facc15';
    ctx.fillText(v, x, y);
  });

  // Output terminal labels
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ef4444';
  ctx.fillText('+ ĐỎ', 385, 115);
  ctx.fillStyle = '#3b82f6';
  ctx.fillText('- XANH', 380, 210);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function createLensBoxPlaqueCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e1b18';
  ctx.fillRect(0, 0, 512, 96);

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 84);

  ctx.fillStyle = '#fbbf24';
  [
    [20, 48],
    [492, 48],
  ].forEach(([rx, ry]) => {
    ctx.beginPath();
    ctx.arc(rx, ry, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 34px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HỘP THẤU KÍNH', 256, 50);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export interface OpticalScreenRenderParams {
  isPoweredOn: boolean;
  experimentMode?: 'f_object' | 'laser_rays';
  beamMode: 'single' | 'double' | 'triple' | 'bundle' | 'divergent' | 'f_rays' | 'f-pattern';
  lensProfileId?: OpticalLensSpec['id'];
  focalLengthCm: number;
  objectDistanceDCm: number;
  screenDistanceCm: number;
  projectedImageDPrimeCm: number;
  projectedImageMag: number;
  projectedImageType: 'real' | 'virtual' | 'infinity' | 'none';
  rayOffsetYCm?: number;
  rayAngleDeg?: number;
}

export function createOpticalScreenCanvasTexture(
  params: OpticalScreenRenderParams,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // White matte screen surface - Màn hứng ảnh mặc định màu trắng chuẩn phòng thí nghiệm
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle millimeter reference grid on white screen (4)
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 512; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Center crosshair axes
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(256, 0);
  ctx.lineTo(256, 512);
  ctx.moveTo(0, 256);
  ctx.lineTo(512, 256);
  ctx.stroke();

  // Tick marks along millimeter axes
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  for (let t = 32; t < 512; t += 32) {
    if (t === 256) continue;
    ctx.beginPath();
    ctx.moveTo(250, t);
    ctx.lineTo(262, t);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(t, 250);
    ctx.lineTo(t, 262);
    ctx.stroke();
  }

  if (!params.isPoweredOn) {
    // Khi chưa bật nguồn: Màn hứng ảnh giữ nguyên màu trắng mờ tinh tế, hiển thị nhãn nhận diện khoa học ở đáy
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 18px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MÀN CHẮN ẢNH (4) · MẶT HỨNG ẢNH TRẮNG', 256, 484);
    ctx.font = '13.5px "Inter", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('(Bật công tắc Nguồn điện 12V để hứng ảnh vật sáng / tia sáng)', 256, 502);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  const {
    experimentMode,
    beamMode,
    lensProfileId = 'conv_10',
    focalLengthCm,
    objectDistanceDCm,
    screenDistanceCm,
    projectedImageDPrimeCm,
    projectedImageMag,
    projectedImageType,
    rayOffsetYCm = 0,
    rayAngleDeg = 0,
  } = params;

  const isLaserMode =
    experimentMode === 'laser_rays' ||
    beamMode === 'single' ||
    beamMode === 'double' ||
    beamMode === 'triple' ||
    beamMode === 'bundle';

  if (isLaserMode) {
    const traced = traceOpticalBenchRays({
      experimentMode: 'laser_rays',
      beamMode,
      lensProfileId,
      axisY: 0,
      axisZ: 0,
      lampSlitX: -0.26,
      fObjectX: -objectDistanceDCm * 0.01,
      lensX: 0,
      screenX: screenDistanceCm * 0.01,
      rayOffsetYCm,
      rayAngleDeg,
    });

    traced.forEach((r) => {
      const relYCm = r.refractedEnd.y * 100;
      const py = 256 - relYCm * 42;
      const px = 256;
      const hexStr = `#${r.color.toString(16).padStart(6, '0')}`;

      const grad = ctx.createRadialGradient(px, py, 2, px, py, 34);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, hexStr);
      grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, 34, 0, Math.PI * 2);
      ctx.fill();
    });

    const isAtFocus =
      focalLengthCm > 0 &&
      focalLengthCm < 500 &&
      Math.abs(screenDistanceCm - focalLengthCm) < 0.9;
    ctx.fillStyle = isAtFocus ? '#059669' : '#334155';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      isAtFocus
        ? `★ CHÙM TIA HỘI TỤ TẠI TIÊU ĐIỂM F' (f = ${focalLengthCm} cm)`
        : `MÀN CHẮN (4): x₄ = ${screenDistanceCm.toFixed(1)} cm`,
      256,
      482,
    );
  } else if (projectedImageType === 'real' && projectedImageDPrimeCm > 0) {
    const deltaCm = Math.abs(screenDistanceCm - projectedImageDPrimeCm);
    const blurPx = Math.min(28, deltaCm * 2.2);
    const opacity = Math.max(0.18, 1 - deltaCm / 22);
    const scale = Math.min(2.6, Math.max(0.25, Math.abs(projectedImageMag)));

    const glow = ctx.createRadialGradient(256, 256, 10, 256, 256, 180);
    glow.addColorStop(0, `rgba(254, 243, 199, ${0.75 * opacity})`);
    glow.addColorStop(1, 'rgba(254, 243, 199, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(256, 256, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(256, 256);
    // Real image is inverted (rotated 180 deg)
    ctx.rotate(Math.PI);
    ctx.scale(scale, scale);

    if (typeof ctx.filter === 'string') {
      ctx.filter = `blur(${blurPx.toFixed(1)}px)`;
    }
    ctx.fillStyle = `rgba(217, 119, 6, ${opacity})`;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 14 + blurPx;

    ctx.fillRect(-36, -70, 22, 140);
    ctx.fillRect(-36, -70, 76, 22);
    ctx.fillRect(-36, -10, 56, 18);
    ctx.restore();

    if (deltaCm < 0.85) {
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 20px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ẢNH THẬT RÕ NÉT (NGƯỢC CHIỀU)', 256, 482);
    } else {
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 19px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Ảnh nhòe (x₄ = ${screenDistanceCm.toFixed(1)} cm · nét tại d' = ${projectedImageDPrimeCm.toFixed(1)} cm)`,
        256,
        482,
      );
    }
  } else {
    // Virtual image or object at focus: only diffuse glow on screen
    const glow = ctx.createRadialGradient(256, 256, 10, 256, 256, 190);
    glow.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
    glow.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(256, 256, 190, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 19px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KHÔNG HỨNG ĐƯỢC ẢNH TRÊN MÀN', 256, 480);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function createProfileOpticalLensGeometry(
  profileId: OpticalLensSpec['id'],
  radius = 0.035,
): THREE.BufferGeometry {
  const spec = OPTICAL_LENS_SPECS[profileId] ?? OPTICAL_LENS_SPECS.conv_10;
  const segments = 32;
  const points: THREE.Vector2[] = [];

  const halfCenterM = (spec.centerThicknessCm * 0.01) / 2;
  const halfEdgeM = (spec.edgeThicknessCm * 0.01) / 2;

  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const r = u * radius;
    const y =
      spec.type === 'flat'
        ? halfCenterM
        : halfCenterM + (halfEdgeM - halfCenterM) * (u * u);
    points.push(new THREE.Vector2(r, y));
  }
  for (let i = segments; i >= 0; i--) {
    const u = i / segments;
    const r = u * radius;
    const y =
      spec.type === 'flat'
        ? -halfCenterM
        : -(halfCenterM + (halfEdgeM - halfCenterM) * (u * u));
    points.push(new THREE.Vector2(r, y));
  }

  const geo = new THREE.LatheGeometry(points, 48);
  // Rotate so optical axis of the lens is along local X axis (matching the optical bench rail)
  geo.rotateZ(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

function buildOpticalRiderSaddle(
  metalMat: THREE.Material,
  darkMat: THREE.Material,
  brassMat: THREE.Material,
  postTopY: number = 0.0528,
): THREE.Group {
  const rider = new THREE.Group();
  rider.name = 'rider_saddle';

  // Bottom stable foot pads at y = 0.002 so component stands cleanly on shelf/table or straddles rail
  [-0.017, 0.017].forEach((fz) => {
    const footPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.036, 0.012, 0.006),
      darkMat,
    );
    footPad.position.set(0, 0.006, fz);
    footPad.castShadow = true;
    rider.add(footPad);
  });

  // Top saddle block sitting above the rail at y = 0.0295 (height 0.011, top surface at y = 0.035)
  const topBlock = new THREE.Mesh(
    new THREE.BoxGeometry(0.038, 0.011, 0.042),
    darkMat,
  );
  topBlock.position.set(0, 0.0295, 0);
  topBlock.castShadow = true;
  rider.add(topBlock);

  // Side skirts straddling the rail
  [-0.018, 0.018].forEach((sz) => {
    const skirt = new THREE.Mesh(
      new THREE.BoxGeometry(0.038, 0.018, 0.005),
      darkMat,
    );
    skirt.position.set(0, 0.018, sz);
    skirt.castShadow = true;
    rider.add(skirt);
  });

  // Vertical collar & chrome post: Chiều cao trụ đỡ kết thúc CHUẨN XÁC tại mép đáy tiếp xúc của từng thiết bị,
  // TUYỆT ĐỐI không vươn quá cao che vào lòng thấu kính hoặc mặt màn chắn ảnh!
  const saddleTopY = 0.035;
  const collarTopY = Math.min(postTopY, 0.041);
  const collarHeight = Math.max(0.003, collarTopY - saddleTopY);
  const collar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.010, collarHeight, 20),
    brassMat,
  );
  collar.position.set(0, saddleTopY + collarHeight * 0.5, 0);
  rider.add(collar);

  if (postTopY > collarTopY) {
    const postHeight = postTopY - collarTopY;
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0042, 0.0042, postHeight, 16),
      metalMat,
    );
    post.position.set(0, collarTopY + postHeight * 0.5, 0);
    post.castShadow = true;
    rider.add(post);
  }

  // Brass locking thumbscrew on the front (+Z)
  const screwStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0025, 0.0025, 0.012, 12).rotateX(Math.PI / 2),
    metalMat,
  );
  screwStem.position.set(0, 0.019, 0.024);
  rider.add(screwStem);

  const screwHead = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0065, 0.0065, 0.005, 16).rotateX(Math.PI / 2),
    brassMat,
  );
  screwHead.position.set(0, 0.019, 0.030);
  rider.add(screwHead);

  // Red pointer arrow pointing down at the ruler scale
  const redArrow = new THREE.Mesh(
    new THREE.ConeGeometry(0.0038, 0.011, 4).rotateX(Math.PI),
    new THREE.MeshBasicMaterial({ color: 0xef4444 }),
  );
  redArrow.position.set(0, 0.013, 0.0215);
  rider.add(redArrow);

  return rider;
}



function createGlassMaterial(isSoftwareGl: boolean): THREE.MeshPhysicalMaterial {
  if (isSoftwareGl) {
    return new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.1,
      metalness: 0.05,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }
  return new THREE.MeshPhysicalMaterial({
    color: 0xf0f9ff,
    roughness: 0.02,
    metalness: 0.02,
    transmission: 0.92,
    ior: 1.52,
    thickness: 0.045,
    specularIntensity: 1.0,
    specularColor: 0xffffff,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    transparent: true,
    opacity: 1.0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

export type FluidKind =
  | 'clean-water'
  | 'copper-sulfate'
  | 'permanganate'
  | 'precipitate-cloudy';

export interface FluidPhysicalProfile {
  kind: FluidKind;
  nameVi: string;
  ior: number;
  transmission: number;
  roughness: number;
  metalness: number;
  thickness: number;
  attenuationDistance: number;
  attenuationColor: number;
  baseColor: number;
  specularIntensity: number;
  clearcoat: number;
  clearcoatRoughness: number;
  opacity: number;
  meniscusColor: number;
  meniscusHighlight: number;
  capillaryHeightFactor: number;
}

export const FLUID_PROFILES: Record<FluidKind, FluidPhysicalProfile> = {
  'clean-water': {
    kind: 'clean-water',
    nameVi: 'Nước sạch tinh khiết (Xanh nhạt thủy tinh)',
    ior: 1.333,
    transmission: 0.82,         // Khúc xạ ánh sáng thực tế nhưng vẫn nhìn rõ thể tích nước
    roughness: 0.008,          // Mặt nước cực kỳ phẳng bóng
    metalness: 0.01,
    thickness: 0.08,
    attenuationDistance: 0.12,  // Hấp thụ Beer-Lambert sâu lắng: góc mỏng ánh xanh lơ dịu, khối dày có chiều sâu
    attenuationColor: 0x0284c7, // Xanh biển sâu khi ánh sáng đi qua chiều dày khối nước
    baseColor: 0x7dd3fc,        // Màu xanh nhạt tươi mát tự nhiên đặc trưng của nước trong phòng thí nghiệm
    specularIntensity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    opacity: 0.72,              // Độ mờ đục hoàn hảo: vừa thấy xuyên qua vừa nhận diện rõ mực nước
    meniscusColor: 0x38bdf8,    // Viền căng bề mặt mao dẫn ánh xanh rõ nét
    meniscusHighlight: 0xe0f2fe, // Điểm sáng phản chiếu ánh sáng phòng
    capillaryHeightFactor: 1.15,
  },
  'copper-sulfate': {
    kind: 'copper-sulfate',
    nameVi: 'Dung dịch đồng(II) sunfat CuSO4',
    ior: 1.342,
    transmission: 0.86,
    roughness: 0.018,
    metalness: 0.02,
    thickness: 0.08,
    attenuationDistance: 0.14,
    attenuationColor: 0x0284c7,
    baseColor: 0x0369a1,
    specularIntensity: 0.98,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    opacity: 0.76,
    meniscusColor: 0x38bdf8,
    meniscusHighlight: 0xe0f2fe,
    capillaryHeightFactor: 1.05,
  },
  'permanganate': {
    kind: 'permanganate',
    nameVi: 'Dung dịch thuốc tím KMnO4',
    ior: 1.348,
    transmission: 0.74,
    roughness: 0.022,
    metalness: 0.02,
    thickness: 0.08,
    attenuationDistance: 0.085,
    attenuationColor: 0x701a75,
    baseColor: 0x831843,
    specularIntensity: 0.96,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    opacity: 0.85,
    meniscusColor: 0xa21caf,
    meniscusHighlight: 0xfdf4ff,
    capillaryHeightFactor: 0.95,
  },
  'precipitate-cloudy': {
    kind: 'precipitate-cloudy',
    nameVi: 'Huyền phù đục / Kết tủa trắng BaSO4',
    ior: 1.365,
    transmission: 0.32,
    roughness: 0.22,
    metalness: 0.0,
    thickness: 0.05,
    attenuationDistance: 0.04,
    attenuationColor: 0xf8fafc,
    baseColor: 0xf1f5f9,
    specularIntensity: 0.82,
    clearcoat: 0.35,
    clearcoatRoughness: 0.08,
    opacity: 0.92,
    meniscusColor: 0xe2e8f0,
    meniscusHighlight: 0xffffff,
    capillaryHeightFactor: 0.82,
  },
};

export function createWaterMaterial(
  fluidKindOrColor: FluidKind | number = 'clean-water',
  customOpacity?: number,
): THREE.MeshPhysicalMaterial {
  let profile: FluidPhysicalProfile;
  if (typeof fluidKindOrColor === 'string' && FLUID_PROFILES[fluidKindOrColor]) {
    profile = FLUID_PROFILES[fluidKindOrColor];
  } else {
    profile = { ...FLUID_PROFILES['clean-water'] };
    if (typeof fluidKindOrColor === 'number') {
      profile.attenuationColor = fluidKindOrColor;
    }
  }

  const mat = new THREE.MeshPhysicalMaterial({
    color: profile.baseColor,
    attenuationColor: new THREE.Color(profile.attenuationColor),
    attenuationDistance: profile.attenuationDistance,
    transmission: profile.transmission,
    ior: profile.ior,
    thickness: profile.thickness,
    roughness: profile.roughness,
    metalness: profile.metalness,
    specularIntensity: profile.specularIntensity,
    clearcoat: profile.clearcoat,
    clearcoatRoughness: profile.clearcoatRoughness,
    transparent: true,
    opacity: customOpacity ?? profile.opacity,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  mat.name = `fluid_mat_${profile.kind}`;
  return mat;
}

export function createStreamMaterial(
  fluidKindOrColor: FluidKind | number = 'clean-water',
  opacity = 0.88,
): THREE.MeshPhysicalMaterial {
  let profile: FluidPhysicalProfile = FLUID_PROFILES['clean-water'];
  if (typeof fluidKindOrColor === 'string' && FLUID_PROFILES[fluidKindOrColor]) {
    profile = FLUID_PROFILES[fluidKindOrColor];
  }
  const colorVal =
    typeof fluidKindOrColor === 'number'
      ? fluidKindOrColor
      : profile.attenuationColor;

  return new THREE.MeshPhysicalMaterial({
    color: 0xbae6fd,
    attenuationColor: new THREE.Color(colorVal),
    attenuationDistance: 0.12,
    transmission: 0.84,
    roughness: 0.010,
    metalness: 0.01,
    ior: 1.333,
    specularIntensity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    transparent: true,
    opacity,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

export function addConcaveMeniscusAndRipples(
  liquidGroup: THREE.Group,
  radius: number,
  waterHeight: number,
  fluidKind: FluidKind = 'clean-water',
): void {
  const profile = FLUID_PROFILES[fluidKind] || FLUID_PROFILES['clean-water'];

  // 1. Glossy top water surface cap (radial rings for smooth hydrostatic deformation)
  const surfaceCap = new THREE.Mesh(
    new THREE.RingGeometry(0.0001, radius * 0.992, 48, 6).rotateX(-Math.PI / 2),
    new THREE.MeshPhysicalMaterial({
      color: profile.baseColor,
      attenuationColor: new THREE.Color(profile.attenuationColor),
      attenuationDistance: profile.attenuationDistance * 1.2,
      transmission: 0.92,
      roughness: 0.01,
      metalness: 0.0,
      ior: profile.ior,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      specularIntensity: 1.0,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  surfaceCap.name = 'surface_cap';
  surfaceCap.position.y = waterHeight + 0.0002;
  surfaceCap.renderOrder = 3;
  liquidGroup.add(surfaceCap);

  // 2. 3D Concave Capillary Meniscus Wall (visible from side view for reading bottom of meniscus!)
  const meniscusWallH = Math.min(
    0.0038,
    Math.max(0.0018, radius * 0.095 * profile.capillaryHeightFactor),
  );
  const meniscusWall = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 1.001, radius * 0.968, meniscusWallH, 48, 1, true),
    new THREE.MeshPhysicalMaterial({
      color: profile.baseColor,
      attenuationColor: new THREE.Color(profile.attenuationColor),
      attenuationDistance: profile.attenuationDistance,
      transmission: 0.88,
      roughness: 0.015,
      ior: profile.ior,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  meniscusWall.name = 'meniscus_wall';
  meniscusWall.position.y = waterHeight + meniscusWallH * 0.5;
  meniscusWall.renderOrder = 3;
  liquidGroup.add(meniscusWall);

  // 3. Crisp outer meniscus contact ring highlight (capillary wetting edge)
  const meniscusRing = new THREE.Mesh(
    new THREE.RingGeometry(radius * 0.78, radius * 1.002, 48, 2).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({
      color: profile.meniscusHighlight,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    }),
  );
  meniscusRing.name = 'meniscus_ring';
  meniscusRing.position.y = waterHeight + 0.0005;
  meniscusRing.renderOrder = 3;
  liquidGroup.add(meniscusRing);

  // 4. Inner concentric surface ripple ring (shimmers during pouring/dispensing)
  const rippleRing = new THREE.Mesh(
    new THREE.RingGeometry(radius * 0.22, radius * 0.42, 36, 2).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({
      color: profile.meniscusColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    }),
  );
  rippleRing.name = 'surface_ripple';
  rippleRing.position.y = waterHeight + 0.0006;
  rippleRing.renderOrder = 3;
  liquidGroup.add(rippleRing);
}

/**
 * MÔ PHỎNG VẬT LÝ THỦY TĨNH & TRỌNG LỰC CHẤT LỎNG TRONG BÌNH NGHIÊNG (HYDROSTATIC GRAVITY ENGINE)
 * - Giữ mặt thoáng chất lỏng (`surface_cap`, `meniscus_ring`, `liquid_body`) luôn nằm ngang theo phương trọng lực Trái Đất
 *   bất kể bình nghiêng góc nào quanh trục Z hoặc X, hoàn toàn KHÔNG bao giờ xuyên qua thành bình thủy tinh.
 * - Bảo toàn thể tích nêm chất lỏng (cylindrical ungula): khi nghiêng bình, nước dồn về phía thành thấp và dâng dần
 *   lên sát miệng vòi rót (`pouring_lip`).
 * - Tính chính xác góc bắt đầu tràn khỏi miệng bình và lượng nước tối đa còn giữ lại ở góc nghiêng hiện tại.
 */
export function syncHydrostaticLiquidToGravity(
  instanceRoot: THREE.Object3D,
  overrideScaleY?: number,
  timeMs = 0,
  sloshAngleZ = 0,
): {
  pourThresholdRad: number;
  maxRetainedScaleY: number;
  isReachingLip: boolean;
  lipHeightM: number;
  waterEdgeHeightM: number;
} {
  const liquidGroup = instanceRoot.getObjectByName('liquid_surface') as THREE.Group | undefined;
  if (!liquidGroup) {
    return {
      pourThresholdRad: 0.55,
      maxRetainedScaleY: 2.0,
      isReachingLip: false,
      lipHeightM: 0.1,
      waterEdgeHeightM: 0.05,
    };
  }

  const arch = instanceRoot.userData?.archetype as ProceduralArchetype | undefined;
  if (arch === 'separatory-funnel' || arch === 'distillation-flask') {
    return {
      pourThresholdRad: 0.65,
      maxRetainedScaleY: 2.0,
      isReachingLip: false,
      lipHeightM: 0.12,
      waterEdgeHeightM: 0.05,
    };
  }

  // Lazy snapshot of un-deformed vertex buffers so every vessel instance has independent hydrostatic geometry
  if (!liquidGroup.userData.hydroInit) {
    let baseWaterHeight = 0.045;
    let baseRadiusTop = 0.032;
    let baseRadiusBottom = 0.032;

    liquidGroup.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        child.geometry = child.geometry.clone();
        const posAttr = child.geometry.attributes.position;
        if (posAttr) {
          child.userData.origPos = (posAttr.array as Float32Array).slice();
          child.userData.origMeshY = child.position.y;
          child.geometry.computeBoundingBox();
          const bb = child.geometry.boundingBox;
          if (bb) {
            const h = bb.max.y - bb.min.y;
            const r = Math.max(bb.max.x, -bb.min.x, bb.max.z, -bb.min.z);
            if (h > 0.008 && child.name !== 'meniscus_wall') {
              child.name = 'liquid_body';
              baseWaterHeight = Math.max(0.01, h);
              baseRadiusTop = Math.max(0.01, r);
              baseRadiusBottom = baseRadiusTop;
            }
          }
        }
      }
    });

    let maxChamberHeight = baseWaterHeight * 2.08;
    let isConicalFlask = false;
    if (arch === 'graduated-cylinder') {
      baseWaterHeight = 0.105;
      maxChamberHeight = 0.224;
      baseRadiusTop = 0.0156;
      baseRadiusBottom = 0.0156;
    } else if (arch === 'beaker-250') {
      baseWaterHeight = 0.038;
      maxChamberHeight = 0.091;
      baseRadiusTop = 0.0338;
      baseRadiusBottom = 0.0335;
    } else if (arch === 'overflow-can') {
      baseWaterHeight = 0.045;
      maxChamberHeight = 0.096;
      baseRadiusTop = 0.0384;
      baseRadiusBottom = 0.0384;
    } else if (arch === 'erlenmeyer-flask') {
      baseWaterHeight = 0.036;
      maxChamberHeight = 0.128;
      baseRadiusTop = 0.0162;
      baseRadiusBottom = 0.040;
      isConicalFlask = true;
    } else if (arch === 'porcelain-dish') {
      baseWaterHeight = 0.014;
      maxChamberHeight = 0.038;
      baseRadiusTop = 0.038;
      baseRadiusBottom = 0.022;
    } else if (arch === 'water-dispenser') {
      baseWaterHeight = 0.062;
      maxChamberHeight = 0.132;
      baseRadiusTop = 0.050;
      baseRadiusBottom = 0.050;
    }

    liquidGroup.userData.hydroInit = true;
    liquidGroup.userData.baseWaterHeight = baseWaterHeight;
    liquidGroup.userData.maxChamberHeight = maxChamberHeight;
    liquidGroup.userData.baseRadiusTop = baseRadiusTop;
    liquidGroup.userData.baseRadiusBottom = baseRadiusBottom;
    liquidGroup.userData.isConicalFlask = isConicalFlask;
    if (typeof liquidGroup.userData.targetScaleY !== 'number') {
      liquidGroup.userData.targetScaleY = 1.0;
    }
  }

  const scaleY =
    typeof overrideScaleY === 'number'
      ? overrideScaleY
      : (liquidGroup.userData.targetScaleY as number) ?? 1.0;
  liquidGroup.userData.targetScaleY = scaleY;

  const baseH = (liquidGroup.userData.baseWaterHeight as number) || 0.045;
  const maxH = (liquidGroup.userData.maxChamberHeight as number) || baseH * 2.08;
  const rTop = (liquidGroup.userData.baseRadiusTop as number) || 0.032;
  const rBot = (liquidGroup.userData.baseRadiusBottom as number) || rTop;
  const rMean = (rTop + rBot) * 0.5;
  const isConical = Boolean(liquidGroup.userData.isConicalFlask);

  if (scaleY <= 0.015) {
    liquidGroup.visible = false;
    return {
      pourThresholdRad: 1.2,
      maxRetainedScaleY: 0,
      isReachingLip: false,
      lipHeightM: maxH,
      waterEdgeHeightM: 0,
    };
  }
  liquidGroup.visible = true;

  // Keep liquidGroup transform strictly identity so liquid NEVER swings outside the glass walls or shears!
  liquidGroup.rotation.set(0, 0, 0);
  liquidGroup.scale.set(1, 1, 1);

  // 2nd-Order Damped Harmonic Slosh Oscillator
  // Mô phỏng quán tính dao động sóng và cản nhớt chất lỏng khi bình chứa bị nghiêng/chuyển động
  const curRotZ = instanceRoot.rotation.z;
  const curRotX = instanceRoot.rotation.x;
  if (typeof liquidGroup.userData.lastSloshTimeMs !== 'number') {
    liquidGroup.userData.lastSloshTimeMs = timeMs;
    liquidGroup.userData.prevRotZ = curRotZ;
    liquidGroup.userData.dynSloshAngle = 0;
    liquidGroup.userData.dynSloshVel = 0;
  }
  const dtSlosh = THREE.MathUtils.clamp(
    (timeMs - liquidGroup.userData.lastSloshTimeMs) / 1000,
    0.001,
    0.045,
  );
  liquidGroup.userData.lastSloshTimeMs = timeMs;

  const angVelZ = (curRotZ - (liquidGroup.userData.prevRotZ ?? curRotZ)) / dtSlosh;
  liquidGroup.userData.prevRotZ = curRotZ;

  const omegaSlosh = 13.2; // Tần số dao động riêng sóng dừng ~ 2.1 Hz
  const zetaSlosh = 0.24;  // Hệ số cản nhớt (viscous damping ratio)
  const drivingAccel = -angVelZ * 0.38;
  const kSpring = -omegaSlosh * omegaSlosh * (liquidGroup.userData.dynSloshAngle || 0);
  const kDamp = -2 * zetaSlosh * omegaSlosh * (liquidGroup.userData.dynSloshVel || 0);
  const totalAcc = kSpring + kDamp + drivingAccel;

  liquidGroup.userData.dynSloshVel =
    ((liquidGroup.userData.dynSloshVel || 0) + totalAcc * dtSlosh) * 0.985;
  liquidGroup.userData.dynSloshAngle = THREE.MathUtils.clamp(
    (liquidGroup.userData.dynSloshAngle || 0) +
      liquidGroup.userData.dynSloshVel * dtSlosh,
    -0.28,
    0.28,
  );

  const effectiveSlosh =
    (liquidGroup.userData.dynSloshAngle as number) + sloshAngleZ;
  const rotZ = curRotZ + effectiveSlosh;
  const rotX = curRotX;
  const clampedZ = THREE.MathUtils.clamp(rotZ, -1.43, 1.43);
  const clampedX = THREE.MathUtils.clamp(rotX, -1.43, 1.43);

  // Slope of the horizontal world plane in the tilted vessel's local coordinates:
  // When rotZ < 0 (tilted right +X), kx = -tan(rotZ) > 0, so water rises on the +X (right) side!
  const kx = -Math.tan(clampedZ);
  const kz = Math.tan(clampedX);
  const kMag = Math.hypot(kx, kz);

  const uprightH = THREE.MathUtils.clamp(baseH * scaleY, 0.001, maxH);

  // Hydrostatic volume conservation:
  // 1) Normal regime (uprightH >= rMean * kMag): plane center stays at uprightH, pouring wall rises to uprightH + rMean * kMag
  // 2) Ungula wedge regime (uprightH < rMean * kMag): bottom partially dry, water pools as a wedge on the tilted side
  let waterEdgeHeightM: number;
  let centerPlaneH: number;
  const wedgeThreshold = rMean * kMag;
  if (wedgeThreshold <= 0.0001 || uprightH >= wedgeThreshold) {
    centerPlaneH = uprightH;
    waterEdgeHeightM = uprightH + wedgeThreshold;
  } else {
    waterEdgeHeightM = Math.sqrt(2.85 * uprightH * wedgeThreshold);
    centerPlaneH = waterEdgeHeightM - wedgeThreshold;
  }

  // Exact angle at which the current water volume touches the pouring lip (maxH):
  const pourThresholdRad = Math.atan2(
    Math.max(0.004, maxH - uprightH),
    Math.max(0.012, rMean * 1.15),
  );

  // Maximum water column height (and scaleY) that can remain in the vessel at this tilt angle without spilling over maxH:
  const absTilt = Math.hypot(clampedZ, clampedX);
  let maxRetainedUprightH: number;
  if (wedgeThreshold <= maxH * 0.52) {
    maxRetainedUprightH = Math.max(0, maxH - wedgeThreshold);
  } else {
    const drainTail = THREE.MathUtils.clamp(1 - (absTilt - 0.55) / 0.85, 0, 1);
    maxRetainedUprightH = Math.max(
      0,
      ((maxH * maxH) / Math.max(0.001, 2.85 * wedgeThreshold)) * drainTail,
    );
  }
  const maxRetainedScaleY = maxRetainedUprightH / baseH;
  const isReachingLip = waterEdgeHeightM >= maxH - 0.0015 && absTilt > 0.12;

  // If water is actively reaching/pouring over the lip, clamp the upper water edge right at the lip (maxH)
  if (waterEdgeHeightM > maxH) {
    const excess = waterEdgeHeightM - maxH;
    centerPlaneH -= excess * 0.85;
    waterEdgeHeightM = maxH;
  }

  // Subtle natural capillary surface wave when tilted or sloshing
  const waveAmp =
    timeMs > 0 && (absTilt > 0.015 || Math.abs(sloshAngleZ) > 0.001)
      ? Math.min(0.0016, absTilt * 0.0018 + Math.abs(sloshAngleZ) * 0.04)
      : 0;

  liquidGroup.children.forEach((child) => {
    if (!(child instanceof THREE.Mesh) || !child.geometry) return;
    const origPos = child.userData.origPos as Float32Array | undefined;
    const posAttr = child.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!origPos || !posAttr) return;

    const arr = posAttr.array as Float32Array;
    const origMeshY = (child.userData.origMeshY as number) ?? 0;
    const isBody = child.name === 'liquid_body';

    if (!isBody) {
      child.position.y = 0;
      child.scale.set(1, 1, 1);
      child.rotation.set(0, 0, 0);
    }

    const vertCount = origPos.length / 3;
    for (let i = 0; i < vertCount; i++) {
      const idx = i * 3;
      const x0 = origPos[idx];
      const y0 = origPos[idx + 1];
      const z0 = origPos[idx + 2];

      const wave =
        waveAmp > 0
          ? Math.sin(x0 * 85 - timeMs * 0.011) *
            Math.cos(z0 * 65 + timeMs * 0.008) *
            waveAmp
          : 0;

      // Local height of the horizontal gravity surface at this (x0, z0) coordinate
      const localSurfH = THREE.MathUtils.clamp(
        centerPlaneH + kx * x0 + kz * z0 + wave,
        0.0006,
        maxH,
      );

      let newY: number;
      if (isBody) {
        const normY = THREE.MathUtils.clamp(y0 / baseH, 0, 1);
        newY = normY * localSurfH;
      } else {
        const offsetFromTop = origMeshY + y0 - baseH;
        newY = localSurfH + offsetFromTop;
      }

      // STRICT ZERO-CLIPPING BOUNDARY CONTAINMENT:
      // Giới hạn bán kính đỉnh luôn nằm gọn trong lòng thành thủy tinh, loại bỏ hoàn toàn hiện tượng xuyên thành
      let allowedR = rMean;
      if (isConical) {
        const coneFrac = THREE.MathUtils.clamp(newY / 0.092, 0, 1);
        allowedR = THREE.MathUtils.lerp(rBot, rTop, coneFrac);
      } else if (arch === 'porcelain-dish') {
        const dishFrac = THREE.MathUtils.clamp(newY / 0.038, 0, 1);
        allowedR = THREE.MathUtils.lerp(rBot, rTop, Math.sqrt(dishFrac));
      }

      const origR = Math.hypot(x0, z0);
      const safeRadius = allowedR * 0.992;
      const radialScale =
        origR > safeRadius && origR > 0.0001 ? safeRadius / origR : 1.0;
      arr[idx] = x0 * radialScale;
      arr[idx + 2] = z0 * radialScale;
      arr[idx + 1] = THREE.MathUtils.clamp(newY, 0.0004, maxH);
    }

    posAttr.needsUpdate = true;
    if (isBody) {
      child.geometry.computeVertexNormals();
    }
  });

  return {
    pourThresholdRad,
    maxRetainedScaleY,
    isReachingLip,
    lipHeightM: maxH,
    waterEdgeHeightM,
  };
}

export function buildProceduralEquipmentGroup(
  asset: AssetDefinition,
  isSoftwareGl: boolean,
): THREE.Group {
  const root = new THREE.Group();
  root.name = 'root';
  root.userData = {
    assetId: asset.assetId,
    assetVersion: asset.assetVersion,
    archetype: asset.geometry.proceduralArchetype,
  };

  const customHtmlMod = htmlEquipmentModuleRegistry.getModule(asset.assetId);
  if (customHtmlMod && customHtmlMod.buildEquipmentGroup) {
    try {
      addContactShadow(
        root,
        Math.max(0.05, asset.geometry.boundingBoxM.width * 0.55),
        Math.max(0.05, asset.geometry.boundingBoxM.depth * 0.55),
      );
      const builtGroup = customHtmlMod.buildEquipmentGroup(THREE, asset);
      root.add(builtGroup);
      return root;
    } catch (err) {
      console.warn('Fallback to procedural archetype after HTML module 3D error:', err);
    }
  }

  const arch: ProceduralArchetype = asset.geometry.proceduralArchetype;

  switch (arch) {
    case 'electronic-balance': {
      addContactShadow(root, 0.115, 0.135);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      // Hàm tạo tiết diện 2D bo tròn 4 góc kèm eo lượn cong hai bên hông đúng chuẩn OHAUS Scout
      const createScoutContourShape = (
        halfW: number,
        halfD: number,
        cornerR: number,
        waistIndent: number,
      ): THREE.Shape => {
        const s = new THREE.Shape();
        s.moveTo(-halfW + cornerR, -halfD);
        s.lineTo(halfW - cornerR, -halfD);
        s.quadraticCurveTo(halfW, -halfD, halfW, -halfD + cornerR);
        s.bezierCurveTo(
          halfW - waistIndent,
          -halfD * 0.25,
          halfW - waistIndent,
          halfD * 0.25,
          halfW,
          halfD - cornerR,
        );
        s.quadraticCurveTo(halfW, halfD, halfW - cornerR, halfD);
        s.quadraticCurveTo(0, halfD + 0.008, -halfW + cornerR, halfD);
        s.quadraticCurveTo(-halfW, halfD, -halfW, halfD - cornerR);
        s.bezierCurveTo(
          -halfW + waistIndent,
          halfD * 0.25,
          -halfW + waistIndent,
          -halfD * 0.25,
          -halfW,
          -halfD + cornerR,
        );
        s.quadraticCurveTo(-halfW, -halfD, -halfW + cornerR, -halfD);
        return s;
      };

      // 1. 4 Chân đế xoay chỉnh thăng bằng màu đỏ hồng (OHAUS Red Leveling Feet) ở 4 góc
      const redFootMat = new THREE.MeshPhysicalMaterial({
        color: 0xe11d48,
        roughness: 0.28,
        metalness: 0.12,
        clearcoat: 0.35,
      });
      const footPositions: [number, number, number][] = [
        [-0.073, 0.0045, -0.078],
        [0.073, 0.0045, -0.078],
        [-0.073, 0.0045, 0.080],
        [0.073, 0.0045, 0.080],
      ];
      footPositions.forEach(([fx, fy, fz]) => {
        const fGroup = new THREE.Group();
        fGroup.position.set(fx, fy, fz);
        const fDisc = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0175, 0.016, 0.009, 24),
          redFootMat,
        );
        fDisc.castShadow = true;
        fGroup.add(fDisc);
        const knurlRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.0168, 0.0018, 10, 18),
          redFootMat,
        );
        knurlRing.rotation.x = Math.PI / 2;
        fGroup.add(knurlRing);
        bodyGroup.add(fGroup);
      });

      // 2. Đế gầm màu xám bạc nhạt bo tròn cạnh (Lower Gray Trim Chassis)
      const lowerShape = createScoutContourShape(0.088, 0.094, 0.022, 0.010);
      const lowerExtrude = new THREE.ExtrudeGeometry(lowerShape, {
        depth: 0.012,
        bevelEnabled: true,
        bevelThickness: 0.003,
        bevelSize: 0.003,
        bevelSegments: 6,
        curveSegments: 24,
      });
      lowerExtrude.rotateX(Math.PI / 2);
      const lowerChassisMat = new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        roughness: 0.36,
        metalness: 0.14,
      });
      const lowerChassisMesh = new THREE.Mesh(lowerExtrude, lowerChassisMat);
      lowerChassisMesh.position.set(0, 0.020, 0);
      lowerChassisMesh.castShadow = true;
      lowerChassisMesh.receiveShadow = true;
      bodyGroup.add(lowerChassisMesh);

      // 3. Thân vỏ chính màu trắng sứ bo tròn mềm mại các cạnh (Upper Sculpted White ABS Body)
      const upperMainShape = createScoutContourShape(0.086, 0.092, 0.022, 0.011);
      const upperExtrude = new THREE.ExtrudeGeometry(upperMainShape, {
        depth: 0.022,
        bevelEnabled: true,
        bevelThickness: 0.006,
        bevelSize: 0.005,
        bevelSegments: 8,
        curveSegments: 28,
      });
      upperExtrude.rotateX(Math.PI / 2);
      const whiteBodyMat = new THREE.MeshPhysicalMaterial({
        color: 0xf8fafc,
        roughness: 0.20,
        metalness: 0.04,
        clearcoat: 0.45,
        clearcoatRoughness: 0.14,
      });
      const upperBodyMesh = new THREE.Mesh(upperExtrude, whiteBodyMat);
      upperBodyMesh.position.set(0, 0.041, -0.002);
      upperBodyMesh.castShadow = true;
      upperBodyMesh.receiveShadow = true;
      bodyGroup.add(upperBodyMesh);

      // Phần bệ nâng phía sau nơi đặt đĩa cân (bo tròn mượt)
      const rearDeckShape = createScoutContourShape(0.078, 0.058, 0.020, 0.004);
      const rearDeckGeo = new THREE.ExtrudeGeometry(rearDeckShape, {
        depth: 0.011,
        bevelEnabled: true,
        bevelThickness: 0.0045,
        bevelSize: 0.0045,
        bevelSegments: 8,
        curveSegments: 24,
      });
      rearDeckGeo.rotateX(Math.PI / 2);
      const rearDeckMesh = new THREE.Mesh(rearDeckGeo, whiteBodyMat);
      rearDeckMesh.position.set(0, 0.054, -0.026);
      rearDeckMesh.castShadow = true;
      rearDeckMesh.receiveShadow = true;
      bodyGroup.add(rearDeckMesh);

      // 4. Bảng điều khiển mặt trước nghiêng nhẹ (LCD trắng xanh + 4 phím viền đỏ + giọt nước, không để nhãn hiệu)
      const scoutPanelTex = createOhausScoutPanelTexture('0.00', 'g');
      const scoutPanelMat = new THREE.MeshBasicMaterial({
        map: scoutPanelTex,
        transparent: true,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
      });

      const frontDeckGroup = new THREE.Group();
      frontDeckGroup.position.set(0, 0.048, 0.058);
      frontDeckGroup.rotation.x = -1.12;

      const wedgeSupport = new THREE.Mesh(
        new THREE.BoxGeometry(0.158, 0.084, 0.008),
        whiteBodyMat,
      );
      wedgeSupport.position.set(0, 0, -0.003);
      frontDeckGroup.add(wedgeSupport);

      const lcdMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.156, 0.086),
        scoutPanelMat,
      );
      lcdMesh.name = 'scale_display';
      lcdMesh.userData.lastText = '0.00';
      lcdMesh.position.set(0, 0, 0.002);
      lcdMesh.renderOrder = 3;
      frontDeckGroup.add(lcdMesh);

      // 4B. Nút bấm 3D tương tác TARE trên mặt điều khiển nghiêng (phím ngoài cùng bên phải)
      const tareBtnGeo = new THREE.BoxGeometry(0.024, 0.016, 0.005);
      const tareBtnMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.35,
        metalness: 0.1,
      });
      const tareBtnMesh = new THREE.Mesh(tareBtnGeo, tareBtnMat);
      tareBtnMesh.name = 'tare_button_3d';
      tareBtnMesh.userData = {
        isTareButton: true,
        interactiveButton: 'tare',
        tooltipText: 'Bấm nút trừ bì (TARE) về 0.00 g',
      };
      // Tọa độ tương ứng với phím Tare trên mặt bảng điều khiển nghiêng
      tareBtnMesh.position.set(0.046, -0.019, 0.004);
      tareBtnMesh.castShadow = true;
      frontDeckGroup.add(tareBtnMesh);

      root.add(frontDeckGroup);

      // 5. Đĩa cân Inox hình chữ nhật bo tròn 4 góc & vát mép bóng mượt (`weighing_pan`) đúng chuẩn ảnh OHAUS Scout
      const panGroup = new THREE.Group();
      panGroup.name = 'weighing_pan';

      const subPlatterMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.044, 0.048, 0.008, 32),
        lowerChassisMat,
      );
      subPlatterMesh.position.set(0, 0.058, -0.026);
      panGroup.add(subPlatterMesh);

      const createRoundedRectShape = (w: number, d: number, r: number): THREE.Shape => {
        const hw = w / 2;
        const hd = d / 2;
        const sh = new THREE.Shape();
        sh.moveTo(-hw + r, -hd);
        sh.lineTo(hw - r, -hd);
        sh.quadraticCurveTo(hw, -hd, hw, -hd + r);
        sh.lineTo(hw, hd - r);
        sh.quadraticCurveTo(hw, hd, hw - r, hd);
        sh.lineTo(-hw + r, hd);
        sh.quadraticCurveTo(-hw, hd, -hw, hd - r);
        sh.lineTo(-hw, -hd + r);
        sh.quadraticCurveTo(-hw, -hd, -hw + r, -hd);
        return sh;
      };

      const panShape = createRoundedRectShape(0.142, 0.122, 0.020);
      const panGeo = new THREE.ExtrudeGeometry(panShape, {
        depth: 0.0055,
        bevelEnabled: true,
        bevelThickness: 0.0024,
        bevelSize: 0.0024,
        bevelSegments: 6,
        curveSegments: 24,
      });
      panGeo.rotateX(Math.PI / 2);

      const stainlessPanMat = createReflectiveMetalWeightMaterial(
        0xe2e8f0,
        '#cbd5e1',
        '#f8fafc',
        0.15,
        0.90,
      );

      const panMesh = new THREE.Mesh(panGeo, stainlessPanMat);
      panMesh.name = 'pan_plate';
      panMesh.position.set(0, 0.0665, -0.026);
      panMesh.castShadow = true;
      panMesh.receiveShadow = true;
      panGroup.add(panMesh);
      root.add(panGroup);

      // 7. Measurement Anchor trên mặt đĩa cân
      const anchor = new THREE.Object3D();
      anchor.name = 'measurement_anchor';
      anchor.position.set(0, 0.068, -0.026);
      root.add(anchor);

      root.add(bodyGroup);
      break;
    }

    case 'graduated-cylinder': {
      addContactShadow(root, 0.042, 0.042);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const glassMat = createGlassMaterial(isSoftwareGl);

      // 1. Hexagonal stable base
      const baseGeo = new THREE.CylinderGeometry(0.032, 0.036, 0.012, 6);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        roughness: 0.25,
        metalness: 0.1,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.006;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      bodyGroup.add(baseMesh);

      // 2. Main cylinder glass wall
      const tubeGeo = new THREE.CylinderGeometry(0.017, 0.017, 0.23, 32, 1, true);
      const tubeMesh = new THREE.Mesh(tubeGeo, glassMat);
      tubeMesh.position.y = 0.127;
      tubeMesh.renderOrder = 4;
      bodyGroup.add(tubeMesh);

      // 3. Top pouring lip rim + sculpted V-spout on +X side (`pouring_lip`)
      const rimGeo = new THREE.TorusGeometry(0.017, 0.0022, 12, 32);
      rimGeo.rotateX(Math.PI / 2);
      const rimMesh = new THREE.Mesh(rimGeo, glassMat);
      rimMesh.position.y = 0.242;
      rimMesh.renderOrder = 4;
      bodyGroup.add(rimMesh);

      const lipMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0038, 0.0055, 0.012, 14, 1, true, -Math.PI * 0.5, Math.PI),
        glassMat,
      );
      lipMesh.name = 'pouring_lip';
      lipMesh.position.set(0.0185, 0.241, 0);
      lipMesh.rotation.z = -0.52;
      lipMesh.renderOrder = 4;
      bodyGroup.add(lipMesh);

      // 4. Graduation marks overlay cylinder (`scale_marks`)
      const scaleTex = createGraduationCanvasTexture(10, 100, 10, '100 ml : 1 ml');
      const scaleGeo = new THREE.CylinderGeometry(0.0173, 0.0173, 0.20, 32, 1, true);
      const scaleMat = new THREE.MeshBasicMaterial({
        map: scaleTex,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const scaleMesh = new THREE.Mesh(scaleGeo, scaleMat);
      scaleMesh.name = 'scale_marks';
      scaleMesh.position.y = 0.125;
      // Căn chỉnh vạch chia và số đo (10..100 ml) quay thẳng góc chính diện đối diện mắt quan sát (+Z)
      scaleMesh.rotation.y = -Math.PI * 0.242;
      scaleMesh.renderOrder = 5;
      root.add(scaleMesh);

      // 5. Internal water column & 3D concave capillary meniscus (`liquid_surface`)
      const liquidGroup = new THREE.Group();
      liquidGroup.name = 'liquid_surface';
      const waterMat = createWaterMaterial('clean-water');
      const waterHeight = 0.105; // ~50 ml default
      const waterGeo = new THREE.CylinderGeometry(0.0156, 0.0156, waterHeight, 36, 12);
      waterGeo.translate(0, waterHeight / 2, 0);
      const waterMesh = new THREE.Mesh(waterGeo, waterMat);
      waterMesh.name = 'liquid_body';
      waterMesh.renderOrder = 2;
      liquidGroup.add(waterMesh);

      addConcaveMeniscusAndRipples(liquidGroup, 0.0156, waterHeight, 'clean-water');

      liquidGroup.position.y = 0.015;
      root.add(liquidGroup);
      root.add(bodyGroup);
      break;
    }

    case 'beaker-250': {
      addContactShadow(root, 0.048, 0.048);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';
      const glassMat = createGlassMaterial(isSoftwareGl);

      // 1. Glass bottom disc
      const bottomGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.004, 32);
      const bottomMesh = new THREE.Mesh(bottomGeo, glassMat);
      bottomMesh.position.y = 0.002;
      bottomMesh.renderOrder = 3;
      bodyGroup.add(bottomMesh);

      // 2. Beaker wall
      const wallGeo = new THREE.CylinderGeometry(0.036, 0.035, 0.095, 32, 1, true);
      const wallMesh = new THREE.Mesh(wallGeo, glassMat);
      wallMesh.position.y = 0.0495;
      wallMesh.renderOrder = 4;
      bodyGroup.add(wallMesh);

      // 3. Rim torus + V-shaped pouring spout lip on +X side (`pouring_lip`)
      const rimGeo = new THREE.TorusGeometry(0.036, 0.002, 12, 32);
      rimGeo.rotateX(Math.PI / 2);
      const rimMesh = new THREE.Mesh(rimGeo, glassMat);
      rimMesh.position.y = 0.097;
      rimMesh.renderOrder = 4;
      bodyGroup.add(rimMesh);

      const beakerLip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0055, 0.0085, 0.015, 16, 1, true, -Math.PI * 0.5, Math.PI),
        glassMat,
      );
      beakerLip.name = 'pouring_lip';
      beakerLip.position.set(0.038, 0.096, 0);
      beakerLip.rotation.z = -0.58;
      beakerLip.renderOrder = 4;
      bodyGroup.add(beakerLip);

      // 4. Scale markings (`scale_marks`)
      const scaleTex = createGraduationCanvasTexture(50, 250, 50, '250 ml ±5%');
      const scaleGeo = new THREE.CylinderGeometry(0.0363, 0.0353, 0.08, 32, 1, true);
      const scaleMat = new THREE.MeshBasicMaterial({
        map: scaleTex,
        transparent: true,
        depthWrite: false,
      });
      const scaleMesh = new THREE.Mesh(scaleGeo, scaleMat);
      scaleMesh.name = 'scale_marks';
      scaleMesh.position.y = 0.048;
      scaleMesh.renderOrder = 5;
      root.add(scaleMesh);

      // 5. Liquid inside (`liquid_surface`) with glossy surface cap, 3D meniscus & ripple ring
      const liquidGroup = new THREE.Group();
      liquidGroup.name = 'liquid_surface';
      const liquidGeo = new THREE.CylinderGeometry(0.0338, 0.0335, 0.038, 36, 12);
      liquidGeo.translate(0, 0.019, 0);
      const liquidMat = createWaterMaterial('clean-water');
      const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
      liquidMesh.name = 'liquid_body';
      liquidMesh.renderOrder = 2;
      liquidGroup.add(liquidMesh);

      addConcaveMeniscusAndRipples(liquidGroup, 0.0338, 0.038, 'clean-water');

      liquidGroup.position.y = 0.004;

      root.add(liquidGroup);
      root.add(bodyGroup);
      break;
    }

    case 'overflow-can': {
      addContactShadow(root, 0.058, 0.058);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';
      const glassMat = createGlassMaterial(isSoftwareGl);

      // 0. Integrated Laboratory Elevation Pedestal (h = 0.058 m) so the angled overflow spout tip (y = 0.125 m)
      // sits cleanly ABOVE the 0.098 m rim of the 250 ml catch beaker!
      const pedMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.36,
        metalness: 0.65,
      });
      const pedBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.046, 0.050, 0.010, 36),
        pedMat,
      );
      pedBase.position.y = 0.005;
      pedBase.castShadow = true;
      pedBase.receiveShadow = true;
      bodyGroup.add(pedBase);

      const pedTop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.044, 0.044, 0.008, 36),
        pedMat,
      );
      pedTop.position.y = 0.054;
      pedTop.castShadow = true;
      pedTop.receiveShadow = true;
      bodyGroup.add(pedTop);

      [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].forEach((ang) => {
        const pillar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0045, 0.0045, 0.044, 14),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.85 }),
        );
        pillar.position.set(Math.cos(ang) * 0.036, 0.031, Math.sin(ang) * 0.036);
        pillar.castShadow = true;
        bodyGroup.add(pillar);
      });

      const elevY = 0.058; // Elevation offset of the overflow can floor

      // 1. Heavy molded Borosilicate glass base disc with stability ring
      const baseRingGeo = new THREE.CylinderGeometry(0.041, 0.043, 0.006, 36);
      const baseRingMat = new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        roughness: 0.22,
        metalness: 0.12,
      });
      const baseRingMesh = new THREE.Mesh(baseRingGeo, baseRingMat);
      baseRingMesh.position.y = elevY + 0.003;
      baseRingMesh.castShadow = true;
      baseRingMesh.receiveShadow = true;
      bodyGroup.add(baseRingMesh);

      // 2. Main cylindrical glass vessel wall (height 130 mm, Ø 80 mm)
      const canGeo = new THREE.CylinderGeometry(0.040, 0.040, 0.130, 36, 1, true);
      const canMesh = new THREE.Mesh(canGeo, glassMat);
      canMesh.position.y = elevY + 0.071;
      canMesh.renderOrder = 4;
      bodyGroup.add(canMesh);

      // 3. Top beaded glass rim torus (at y = 0.194 m)
      const rimGeo = new THREE.TorusGeometry(0.040, 0.0022, 12, 36);
      rimGeo.rotateX(Math.PI / 2);
      const rimMesh = new THREE.Mesh(rimGeo, glassMat);
      rimMesh.position.y = elevY + 0.136;
      rimMesh.renderOrder = 4;
      bodyGroup.add(rimMesh);

      // 4. Printed Graduation Scale (50 - 210 ml) & Cyan Overflow Threshold Line at y = elevY + 0.096 m (`scale_marks`)
      const scaleTex = createGraduationCanvasTexture(50, 210, 40, 'BÌNH TRÀN 210 ml');
      const scaleGeo = new THREE.CylinderGeometry(0.0404, 0.0404, 0.096, 36, 1, true);
      const scaleMat = new THREE.MeshBasicMaterial({
        map: scaleTex,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const scaleMesh = new THREE.Mesh(scaleGeo, scaleMat);
      scaleMesh.name = 'scale_marks';
      scaleMesh.position.y = elevY + 0.056;
      scaleMesh.renderOrder = 5;
      root.add(scaleMesh);

      // Overflow level indicator ring right at the spout mouth (210.0 ml -> y = 0.154 m)
      const overflowLevelRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.0405, 0.0009, 8, 36),
        new THREE.MeshBasicMaterial({ color: 0x00bceb }),
      );
      overflowLevelRing.rotation.x = Math.PI / 2;
      overflowLevelRing.position.y = elevY + 0.096;
      bodyGroup.add(overflowLevelRing);

      // 5. Flared glass spout collar + angled overflow spout tube on +X side
      // Inner mouth at (0.040, 0.154, 0), sloping down at -32 deg to tip at (0.086, 0.125, 0) — ABOVE the 0.098 m beaker rim!
      const collarGeo = new THREE.CylinderGeometry(0.0068, 0.0095, 0.010, 20, 1, true);
      const collarMesh = new THREE.Mesh(collarGeo, glassMat);
      collarMesh.position.set(0.042, elevY + 0.095, 0);
      collarMesh.rotation.z = -Math.PI / 2 - 0.56;
      collarMesh.renderOrder = 4;
      bodyGroup.add(collarMesh);

      const spoutGeo = new THREE.CylinderGeometry(0.0048, 0.0058, 0.056, 20, 1, true);
      const spoutMesh = new THREE.Mesh(spoutGeo, glassMat);
      spoutMesh.position.set(0.063, elevY + 0.0815, 0);
      spoutMesh.rotation.z = -Math.PI / 2 - 0.56;
      spoutMesh.renderOrder = 4;
      bodyGroup.add(spoutMesh);

      // Spout tip beaded lip at (0.086, 0.125, 0)
      const spoutRim = new THREE.Mesh(
        new THREE.TorusGeometry(0.0048, 0.0008, 8, 16),
        glassMat,
      );
      spoutRim.position.set(0.086, elevY + 0.067, 0);
      spoutRim.rotation.y = Math.PI / 2;
      spoutRim.rotation.x = 0.56;
      bodyGroup.add(spoutRim);

      // Water inside the angled spout tube (`spout_water` — strictly hidden when idle; ONLY visible during active overflow!)
      const spoutWaterGeo = new THREE.CylinderGeometry(0.0033, 0.0041, 0.054, 18);
      const spoutWaterMat = createStreamMaterial(0x0ea5e9, 0.88);
      const spoutWater = new THREE.Mesh(spoutWaterGeo, spoutWaterMat);
      spoutWater.name = 'spout_water';
      spoutWater.position.set(0.063, elevY + 0.0815, 0);
      spoutWater.rotation.z = -Math.PI / 2 - 0.56;
      spoutWater.visible = false;
      spoutWater.renderOrder = 3;
      root.add(spoutWater);

      // 6. Calibrated water column (`liquid_surface`)
      const liquidGroup = new THREE.Group();
      liquidGroup.name = 'liquid_surface';
      const waterHeight = 0.045;
      const waterGeo = new THREE.CylinderGeometry(0.0384, 0.0384, waterHeight, 36, 12);
      waterGeo.translate(0, waterHeight / 2, 0);
      const waterMat = createWaterMaterial('clean-water');
      const waterMesh = new THREE.Mesh(waterGeo, waterMat);
      waterMesh.name = 'liquid_body';
      waterMesh.renderOrder = 2;
      liquidGroup.add(waterMesh);

      addConcaveMeniscusAndRipples(liquidGroup, 0.0384, waterHeight, 'clean-water');

      liquidGroup.position.y = elevY + 0.006;
      root.add(liquidGroup);

      // 7. Parabolic Gravity-Curved Water Jet (`spout_stream` arcing from spout tip (0.086, 0.125, 0) into catch beaker)
      // Strictly hidden (`visible = false`) unless actively overflowing!
      const streamGroup = new THREE.Group();
      streamGroup.name = 'spout_stream';
      const jetCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.085, elevY + 0.067, 0),
        new THREE.Vector3(0.100, elevY + 0.048, 0),
        new THREE.Vector3(0.112, elevY + 0.012, 0),
        new THREE.Vector3(0.122, 0.024, 0),
      ]);
      const streamOuter = new THREE.Mesh(
        new THREE.TubeGeometry(jetCurve, 28, 0.0028, 14, false),
        createStreamMaterial(0x38bdf8, 0.86),
      );
      streamOuter.name = 'stream_outer';
      streamOuter.renderOrder = 5;
      streamGroup.add(streamOuter);

      const streamCore = new THREE.Mesh(
        new THREE.TubeGeometry(jetCurve, 24, 0.0014, 10, false),
        new THREE.MeshBasicMaterial({
          color: 0xe0f2fe,
          transparent: true,
          opacity: 0.92,
          depthWrite: false,
        }),
      );
      streamCore.name = 'stream_core';
      streamCore.renderOrder = 6;
      streamGroup.add(streamCore);

      // 5 Cascading water droplets along the parabolic trajectory
      const dropMat = createStreamMaterial(0x7dd3fc, 0.92);
      const dropGeo = new THREE.SphereGeometry(0.0026, 12, 12);
      for (let d = 0; d < 5; d++) {
        const drop = new THREE.Mesh(dropGeo, dropMat);
        drop.name = `droplet_${d}`;
        const pt = jetCurve.getPoint(d / 5);
        drop.position.copy(pt);
        drop.scale.set(0.85, 1.35, 0.85);
        drop.renderOrder = 6;
        streamGroup.add(drop);
      }

      // 2 Concentric impact splash rings inside the catch beaker
      for (let r = 0; r < 2; r++) {
        const splashRing = new THREE.Mesh(
          new THREE.RingGeometry(0.004 + r * 0.005, 0.008 + r * 0.007, 24).rotateX(-Math.PI / 2),
          new THREE.MeshBasicMaterial({
            color: r === 0 ? 0xe0f2fe : 0x7dd3fc,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.88 - r * 0.25,
            depthWrite: false,
          }),
        );
        splashRing.name = `splash_ring_${r}`;
        splashRing.position.set(0.122, 0.026 + r * 0.001, 0);
        splashRing.renderOrder = 6;
        streamGroup.add(splashRing);
      }

      streamGroup.visible = false;
      root.add(streamGroup);

      // 8. Spout tip anchor
      const anchor = new THREE.Object3D();
      anchor.name = 'measurement_anchor';
      anchor.position.set(0.086, elevY + 0.067, 0);
      root.add(anchor);

      root.add(bodyGroup);
      break;
    }

    case 'spring-dynamometer': {
      addContactShadow(root, 0.035, 0.035);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      // 1. Small display stand base so it sits upright on bench when not hung
      const standBaseGeo = new THREE.CylinderGeometry(0.026, 0.03, 0.006, 24);
      const darkMetalMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.4,
        metalness: 0.7,
      });
      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.15,
        metalness: 0.92,
      });
      const standBase = new THREE.Mesh(standBaseGeo, darkMetalMat);
      standBase.position.y = 0.003;
      bodyGroup.add(standBase);

      // 2. Outer Acrylic Tube
      const tubeGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.16, 24, 1, true);
      const glassMat = createGlassMaterial(isSoftwareGl);
      const tubeMesh = new THREE.Mesh(tubeGeo, glassMat);
      tubeMesh.position.y = 0.12;
      tubeMesh.renderOrder = 4;
      bodyGroup.add(tubeMesh);

      // 3. Scale plates inside (`scale_marks` at 0° and 90° so readable from 360° around tube)
      const scaleTex = createGraduationCanvasTexture(0, 5, 1, '5.0 N : 0.1 N');
      const plateGeo = new THREE.PlaneGeometry(0.022, 0.145);
      const plateMat = new THREE.MeshBasicMaterial({
        map: scaleTex,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const plateMesh = new THREE.Mesh(plateGeo, plateMat);
      plateMesh.name = 'scale_marks';
      plateMesh.position.set(0, 0.12, 0.002);
      root.add(plateMesh);

      const plateMeshCross = new THREE.Mesh(plateGeo, plateMat);
      plateMeshCross.name = 'scale_marks_cross';
      plateMeshCross.position.set(0, 0.12, 0);
      plateMeshCross.rotation.y = Math.PI / 2;
      root.add(plateMeshCross);

      // 4. Top cap & suspension ring
      const capGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.014, 24);
      const capMesh = new THREE.Mesh(capGeo, darkMetalMat);
      capMesh.position.y = 0.205;
      bodyGroup.add(capMesh);

      const topRingGeo = new THREE.TorusGeometry(0.01, 0.0022, 12, 24);
      const topRing = new THREE.Mesh(topRingGeo, chromeMat);
      topRing.position.y = 0.222;
      bodyGroup.add(topRing);

      // 4b. Helical Steel Spring Coil inside the tube (`spring_coil`, anchored at top y = 0.196 m, stretches downward with load)
      const springGroup = new THREE.Group();
      springGroup.name = 'spring_coil';
      springGroup.position.set(0, 0.196, 0);
      const turns = 12;
      const coilPoints: THREE.Vector3[] = [];
      for (let i = 0; i <= turns * 12; i++) {
        const t = i / (turns * 12);
        const angle = t * turns * Math.PI * 2;
        coilPoints.push(
          new THREE.Vector3(
            Math.cos(angle) * 0.0062,
            -t * 0.044,
            Math.sin(angle) * 0.0062,
          ),
        );
      }
      const coilCurve = new THREE.CatmullRomCurve3(coilPoints);
      const coilGeo = new THREE.TubeGeometry(coilCurve, 96, 0.0011, 8, false);
      const coilMesh = new THREE.Mesh(coilGeo, chromeMat);
      springGroup.add(coilMesh);
      root.add(springGroup);

      // 5. Internal plunger, red indicator disc & bottom hook (`plunger`)
      const plungerGroup = new THREE.Group();
      plungerGroup.name = 'plunger';

      const rodGeo = new THREE.CylinderGeometry(0.0025, 0.0025, 0.16, 12);
      const rodMesh = new THREE.Mesh(rodGeo, chromeMat);
      rodMesh.position.y = 0.095;
      plungerGroup.add(rodMesh);

      const indicatorGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.005, 20);
      const indicatorMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      const indicatorMesh = new THREE.Mesh(indicatorGeo, indicatorMat);
      indicatorMesh.position.y = 0.155;
      plungerGroup.add(indicatorMesh);

      const hookGeo = new THREE.TorusGeometry(0.008, 0.002, 10, 20, Math.PI * 1.35);
      const hookMesh = new THREE.Mesh(hookGeo, chromeMat);
      hookMesh.position.y = 0.015;
      plungerGroup.add(hookMesh);

      root.add(plungerGroup);
      root.add(bodyGroup);
      break;
    }

    case 'vernier-caliper': {
      addContactShadow(root, 0.13, 0.048);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const satinSteelMat = createReflectiveMetalWeightMaterial(
        0xe2e8f0,
        '#cbd5e1',
        '#f8fafc',
        0.2,
        0.88,
      );
      const darkSteelMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.32,
        metalness: 0.78,
      });
      const brassScrewMat = createReflectiveMetalWeightMaterial(
        0xfbbf24,
        '#d97706',
        '#fef08a',
        0.22,
        0.9,
      );

      // Exact 1:1 metric reference:
      // Fixed jaw inner clamping face is at X_FIXED_FACE = -0.090 m (-90 mm).
      // When jawOpeningMm = d, movable jaw inner face (`plunger.position.x`) is at -0.090 + d * 0.001 m.
      const X_FIXED_FACE = -0.09;

      // 1. Main hardened stainless steel beam (`230 mm` long: from x = -0.106 to x = +0.124)
      const beamGeo = new THREE.BoxGeometry(0.23, 0.006, 0.017);
      const beamMesh = new THREE.Mesh(beamGeo, satinSteelMat);
      beamMesh.position.set(0.009, 0.0065, 0);
      beamMesh.castShadow = true;
      beamMesh.receiveShadow = true;
      bodyGroup.add(beamMesh);

      // Rear depth-rod guide groove along the beam
      const grooveGeo = new THREE.BoxGeometry(0.228, 0.0022, 0.0036);
      const grooveMesh = new THREE.Mesh(grooveGeo, darkSteelMat);
      grooveMesh.position.set(0.009, 0.0065, -0.0076);
      bodyGroup.add(grooveMesh);

      // Laser-etched 0..150 mm Main Scale on top, front, and back
      const rulerTex = createRulerCanvasTexture(150);
      const scalePlaneMat = new THREE.MeshBasicMaterial({
        map: rulerTex,
        side: THREE.DoubleSide,
      });
      const scalePlaneGeo = new THREE.PlaneGeometry(0.214, 0.0155);
      scalePlaneGeo.rotateX(-Math.PI / 2);
      const scalePlane = new THREE.Mesh(scalePlaneGeo, scalePlaneMat);
      scalePlane.name = 'scale_marks';
      scalePlane.position.set(0.009, 0.0097, 0);
      root.add(scalePlane);

      const scaleSideFront = new THREE.Mesh(
        new THREE.PlaneGeometry(0.214, 0.0056),
        scalePlaneMat,
      );
      scaleSideFront.position.set(0.009, 0.0065, 0.0087);
      root.add(scaleSideFront);

      const scaleSideBack = new THREE.Mesh(
        new THREE.PlaneGeometry(0.214, 0.0056),
        scalePlaneMat,
      );
      scaleSideBack.position.set(0.009, 0.0065, -0.0087);
      scaleSideBack.rotation.y = Math.PI;
      root.add(scaleSideBack);

      // 2A. Fixed Outside Measuring Jaw (+Z side, inner measuring plane strictly at x = X_FIXED_FACE = -0.090)
      // Main upper shank of fixed jaw: x from -0.106 to -0.090 (width 0.016, centered at -0.098)
      const fixedJawShank = new THREE.Mesh(
        new THREE.BoxGeometry(0.016, 0.006, 0.032),
        satinSteelMat,
      );
      fixedJawShank.position.set(X_FIXED_FACE - 0.008, 0.0065, 0.024);
      fixedJawShank.castShadow = true;
      bodyGroup.add(fixedJawShank);

      // Tapered knife-edge tip of fixed outside jaw: inner face still at X_FIXED_FACE (-0.090)
      const fixedJawTip = new THREE.Mesh(
        new THREE.BoxGeometry(0.009, 0.0052, 0.016),
        satinSteelMat,
      );
      fixedJawTip.position.set(X_FIXED_FACE - 0.0045, 0.0065, 0.046);
      fixedJawTip.castShadow = true;
      bodyGroup.add(fixedJawTip);

      // Dark precision ground inner edge highlight on fixed jaw
      const fixedFaceHighlight = new THREE.Mesh(
        new THREE.BoxGeometry(0.0008, 0.0064, 0.044),
        darkSteelMat,
      );
      fixedFaceHighlight.position.set(X_FIXED_FACE - 0.0004, 0.0065, 0.03);
      bodyGroup.add(fixedFaceHighlight);

      // 2B. Fixed Inside-Diameter Measuring Horn (-Z side)
      const fixedInsideHorn = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 0.0052, 0.022),
        satinSteelMat,
      );
      fixedInsideHorn.position.set(X_FIXED_FACE - 0.004, 0.0065, -0.019);
      fixedInsideHorn.castShadow = true;
      bodyGroup.add(fixedInsideHorn);

      // 3. Sliding Vernier Carriage + Movable Jaws (`plunger`)
      // Local x = 0 of `sliderGroup` is the exact inner measuring face of the movable outside jaw!
      const sliderGroup = new THREE.Group();
      sliderGroup.name = 'plunger';

      // Movable Outside Jaw Shank (x from 0 to +0.016 -> center at +0.008)
      const movableJawShank = new THREE.Mesh(
        new THREE.BoxGeometry(0.016, 0.006, 0.032),
        satinSteelMat,
      );
      movableJawShank.position.set(0.008, 0.0065, 0.024);
      movableJawShank.castShadow = true;
      sliderGroup.add(movableJawShank);

      // Movable Outside Jaw Tip (x from 0 to +0.009 -> center at +0.0045)
      const movableJawTip = new THREE.Mesh(
        new THREE.BoxGeometry(0.009, 0.0052, 0.016),
        satinSteelMat,
      );
      movableJawTip.position.set(0.0045, 0.0065, 0.046);
      movableJawTip.castShadow = true;
      sliderGroup.add(movableJawTip);

      const movableFaceHighlight = new THREE.Mesh(
        new THREE.BoxGeometry(0.0008, 0.0064, 0.044),
        darkSteelMat,
      );
      movableFaceHighlight.position.set(0.0004, 0.0065, 0.03);
      sliderGroup.add(movableFaceHighlight);

      // Movable Inside-Diameter Horn (-Z side)
      const movableInsideHorn = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 0.0052, 0.022),
        satinSteelMat,
      );
      movableInsideHorn.position.set(0.004, 0.0065, -0.019);
      movableInsideHorn.castShadow = true;
      sliderGroup.add(movableInsideHorn);

      // Main Vernier Carriage Sleeve wrapping around the beam (x from 0 to +0.056 -> center at +0.028)
      const carriageBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.056, 0.0105, 0.024),
        darkSteelMat,
      );
      carriageBody.position.set(0.028, 0.0072, 0);
      carriageBody.castShadow = true;
      sliderGroup.add(carriageBody);

      // Knurled Locking Thumbscrew (`vít hãm`) on top-rear of carriage
      const lockStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0024, 0.0024, 0.006, 12),
        satinSteelMat,
      );
      lockStem.position.set(0.026, 0.014, -0.006);
      sliderGroup.add(lockStem);

      const lockHead = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0052, 0.0052, 0.0035, 20),
        brassScrewMat,
      );
      lockHead.position.set(0.026, 0.0175, -0.006);
      sliderGroup.add(lockHead);

      // Knurled Thumb Roller (`con lăn tinh chỉnh`) on front-right of carriage
      const thumbRoller = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0058, 0.0058, 0.0048, 24),
        brassScrewMat,
      );
      thumbRoller.rotation.x = Math.PI / 2;
      thumbRoller.position.set(0.051, 0.0065, 0.0125);
      sliderGroup.add(thumbRoller);

      // Live Vernier + Digital Readout Display (`scale_display` on top & `scale_display_rear` on back)
      const defaultOpeningMm = 26;
      const readoutTex = createVernierCarriageDisplayTexture(defaultOpeningMm);
      const readoutMat = new THREE.MeshBasicMaterial({
        map: readoutTex,
        side: THREE.DoubleSide,
      });

      const topDisplayGeo = new THREE.PlaneGeometry(0.054, 0.0225);
      topDisplayGeo.rotateX(-Math.PI / 2);
      const topDisplayMesh = new THREE.Mesh(topDisplayGeo, readoutMat);
      topDisplayMesh.name = 'scale_display';
      topDisplayMesh.position.set(0.028, 0.0128, 0);
      topDisplayMesh.userData.lastJawOpeningMm = defaultOpeningMm;
      sliderGroup.add(topDisplayMesh);

      const frontDisplayMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.054, 0.0095),
        readoutMat,
      );
      frontDisplayMesh.name = 'scale_display_front';
      frontDisplayMesh.position.set(0.028, 0.0074, 0.0123);
      sliderGroup.add(frontDisplayMesh);

      const rearDisplayMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.054, 0.0095),
        readoutMat,
      );
      rearDisplayMesh.name = 'scale_display_rear';
      rearDisplayMesh.position.set(0.028, 0.0074, -0.0123);
      rearDisplayMesh.rotation.y = Math.PI;
      sliderGroup.add(rearDisplayMesh);

      // 4. Depth Probe Rod (`depth_rod`) extending from the right end of the beam as jaw opens
      // When jawOpeningMm = 0, depth rod sits flush inside the beam (-0.016 to +0.124).
      // As slider moves +d, depth_rod moves +d so it protrudes past x = +0.124 by exact d mm!
      const depthRod = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.0018, 0.0028),
        satinSteelMat,
      );
      depthRod.name = 'depth_rod';
      depthRod.position.set(0.139, 0.0065, -0.0076);
      sliderGroup.add(depthRod);

      // 5. Dynamic Jaw Dimension Span Indicator (`jaw_measure_guide`) between fixed jaw and movable jaw
      const measureGuideMat = new THREE.MeshBasicMaterial({
        color: 0x00bceb,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      });
      const measureGuideGeo = new THREE.PlaneGeometry(1, 0.0022);
      measureGuideGeo.rotateX(-Math.PI / 2);
      const measureGuide = new THREE.Mesh(measureGuideGeo, measureGuideMat);
      measureGuide.name = 'jaw_measure_guide';
      const defaultSpanM = defaultOpeningMm * 0.001;
      measureGuide.scale.set(Math.max(0.0001, defaultSpanM), 1, 1);
      measureGuide.position.set(
        X_FIXED_FACE + defaultSpanM * 0.5,
        0.009,
        0.032,
      );
      root.add(measureGuide);

      // Default 26 mm opening
      sliderGroup.position.x = X_FIXED_FACE + defaultSpanM;
      root.add(sliderGroup);
      root.add(bodyGroup);
      break;
    }

    case 'calibration-weight': {
      addContactShadow(root, 0.02, 0.02);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const brassMat = createReflectiveMetalWeightMaterial(
        0xfbbf24,
        '#d97706',
        '#fef08a',
        0.12,
        0.95,
      );
      const highlightRimMat = new THREE.MeshPhysicalMaterial({
        color: 0xfef08a,
        roughness: 0.06,
        metalness: 0.98,
        envMapIntensity: 1.9,
        clearcoat: 0.9,
      });

      const cylGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.024, 36);
      const cylMesh = new THREE.Mesh(cylGeo, brassMat);
      cylMesh.position.y = 0.012;
      cylMesh.castShadow = true;
      cylMesh.receiveShadow = true;
      bodyGroup.add(cylMesh);

      const topBevelRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.0118, 0.0008, 12, 36).rotateX(Math.PI / 2),
        highlightRimMat,
      );
      topBevelRing.position.y = 0.024;
      bodyGroup.add(topBevelRing);

      const bottomBevelRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.0118, 0.0007, 10, 36).rotateX(Math.PI / 2),
        highlightRimMat,
      );
      bottomBevelRing.position.y = 0.001;
      bodyGroup.add(bottomBevelRing);

      const neckGeo = new THREE.CylinderGeometry(0.005, 0.007, 0.005, 24);
      const neckMesh = new THREE.Mesh(neckGeo, brassMat);
      neckMesh.position.y = 0.0265;
      bodyGroup.add(neckMesh);

      const knobGeo = new THREE.CylinderGeometry(0.0085, 0.006, 0.005, 28);
      const knobMesh = new THREE.Mesh(knobGeo, highlightRimMat);
      knobMesh.name = 'handle';
      knobMesh.position.y = 0.0315;
      root.add(knobMesh);
      root.add(bodyGroup);
      break;
    }

    case 'solid-cylinder': {
      addContactShadow(root, 0.022, 0.022);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const alumMat = createReflectiveMetalWeightMaterial(
        0xe2e8f0,
        '#94a3b8',
        '#ffffff',
        0.13,
        0.94,
      );
      const specularEdgeMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.06,
        metalness: 0.98,
        envMapIntensity: 1.85,
        clearcoat: 0.85,
      });

      const cylGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.050, 40);
      const cylMesh = new THREE.Mesh(cylGeo, alumMat);
      cylMesh.position.y = 0.025;
      cylMesh.castShadow = true;
      cylMesh.receiveShadow = true;
      bodyGroup.add(cylMesh);

      const topChamfer = new THREE.Mesh(
        new THREE.TorusGeometry(0.0128, 0.0008, 12, 36).rotateX(Math.PI / 2),
        specularEdgeMat,
      );
      topChamfer.position.y = 0.0498;
      bodyGroup.add(topChamfer);

      const bottomChamfer = new THREE.Mesh(
        new THREE.TorusGeometry(0.0128, 0.0007, 10, 36).rotateX(Math.PI / 2),
        specularEdgeMat,
      );
      bottomChamfer.position.y = 0.0008;
      bodyGroup.add(bottomChamfer);

      const hookGeo = new THREE.TorusGeometry(0.0045, 0.0013, 12, 24);
      const hookMesh = new THREE.Mesh(hookGeo, specularEdgeMat);
      hookMesh.name = 'handle';
      hookMesh.position.y = 0.0535;
      root.add(hookMesh);
      root.add(bodyGroup);
      break;
    }

    case 'solid-sphere': {
      addContactShadow(root, 0.022, 0.022);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const ringGeo = new THREE.TorusGeometry(0.009, 0.002, 12, 24);
      ringGeo.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = 0.002;
      bodyGroup.add(ringMesh);

      const sphereGeo = new THREE.SphereGeometry(0.015, 40, 32);
      const steelMat = createReflectiveMetalWeightMaterial(
        0xf1f5f9,
        '#cbd5e1',
        '#ffffff',
        0.08,
        0.97,
      );
      const sphereMesh = new THREE.Mesh(sphereGeo, steelMat);
      sphereMesh.position.y = 0.016;
      sphereMesh.castShadow = true;
      sphereMesh.receiveShadow = true;
      bodyGroup.add(sphereMesh);

      root.add(bodyGroup);
      break;
    }

    case 'solid-block': {
      addContactShadow(root, 0.028, 0.020);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const brassMat = createReflectiveMetalWeightMaterial(
        0xf59e0b,
        '#b45309',
        '#fde68a',
        0.15,
        0.93,
      );

      const blockShape = new THREE.Shape();
      const bw = 0.040;
      const bd = 0.024;
      const br = 0.003;
      blockShape.moveTo(-bw / 2 + br, -bd / 2);
      blockShape.lineTo(bw / 2 - br, -bd / 2);
      blockShape.quadraticCurveTo(bw / 2, -bd / 2, bw / 2, -bd / 2 + br);
      blockShape.lineTo(bw / 2, bd / 2 - br);
      blockShape.quadraticCurveTo(bw / 2, bd / 2, bw / 2 - br, bd / 2);
      blockShape.lineTo(-bw / 2 + br, bd / 2);
      blockShape.quadraticCurveTo(-bw / 2, bd / 2, -bw / 2, bd / 2 - br);
      blockShape.lineTo(-bw / 2, -bd / 2 + br);
      blockShape.quadraticCurveTo(-bw / 2, -bd / 2, -bw / 2 + br, -bd / 2);

      const boxGeo = new THREE.ExtrudeGeometry(blockShape, {
        depth: 0.016,
        bevelEnabled: true,
        bevelThickness: 0.0012,
        bevelSize: 0.0012,
        bevelSegments: 4,
      });
      boxGeo.rotateX(Math.PI / 2);
      const boxMesh = new THREE.Mesh(boxGeo, brassMat);
      boxMesh.position.y = 0.0172;
      boxMesh.castShadow = true;
      boxMesh.receiveShadow = true;
      bodyGroup.add(boxMesh);

      const bossGeo = new THREE.BoxGeometry(0.034, 0.002, 0.018);
      const bossMesh = new THREE.Mesh(bossGeo, brassMat);
      bossMesh.position.y = 0.019;
      bodyGroup.add(bossMesh);

      root.add(bodyGroup);
      break;
    }

    case 'hollow-cylinder': {
      addContactShadow(root, 0.026, 0.026);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const copperMat = new THREE.MeshStandardMaterial({
        color: 0xea580c,
        roughness: 0.28,
        metalness: 0.82,
      });
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0x431407,
        roughness: 0.7,
        metalness: 0.4,
        side: THREE.DoubleSide,
      });

      const outerGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.055, 32, 1, true);
      const outerMesh = new THREE.Mesh(outerGeo, copperMat);
      outerMesh.position.y = 0.0275;
      outerMesh.castShadow = true;
      bodyGroup.add(outerMesh);

      const innerGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.055, 28, 1, true);
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      innerMesh.position.y = 0.0275;
      bodyGroup.add(innerMesh);

      const capRingGeo = new THREE.RingGeometry(0.011, 0.018, 32);
      capRingGeo.rotateX(-Math.PI / 2);
      const topRing = new THREE.Mesh(capRingGeo, copperMat);
      topRing.position.y = 0.055;
      bodyGroup.add(topRing);

      root.add(bodyGroup);
      break;
    }

    case 'erlenmeyer-flask': {
      addContactShadow(root, 0.05, 0.05);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';
      const glassMat = createGlassMaterial(isSoftwareGl);

      // 1. Conical lower body
      const coneGeo = new THREE.CylinderGeometry(0.017, 0.042, 0.095, 32, 1, true);
      const coneMesh = new THREE.Mesh(coneGeo, glassMat);
      coneMesh.position.y = 0.048;
      coneMesh.renderOrder = 4;
      bodyGroup.add(coneMesh);

      // 2. Cylindrical neck
      const neckGeo = new THREE.CylinderGeometry(0.017, 0.017, 0.042, 28, 1, true);
      const neckMesh = new THREE.Mesh(neckGeo, glassMat);
      neckMesh.position.y = 0.116;
      neckMesh.renderOrder = 4;
      bodyGroup.add(neckMesh);

      // 3. Rim + Pouring Lip (`pouring_lip`)
      const rimGeo = new THREE.TorusGeometry(0.018, 0.0022, 12, 28);
      rimGeo.rotateX(Math.PI / 2);
      const rimMesh = new THREE.Mesh(rimGeo, glassMat);
      rimMesh.position.y = 0.137;
      rimMesh.renderOrder = 4;
      bodyGroup.add(rimMesh);

      const flaskLip = new THREE.Object3D();
      flaskLip.name = 'pouring_lip';
      flaskLip.position.set(0.018, 0.137, 0);
      bodyGroup.add(flaskLip);

      // 4. Liquid inside (`liquid_surface`)
      const liquidGroup = new THREE.Group();
      liquidGroup.name = 'liquid_surface';
      const solGeo = new THREE.CylinderGeometry(0.031, 0.040, 0.036, 32, 12);
      solGeo.translate(0, 0.018, 0);
      const solMat = createWaterMaterial('copper-sulfate');
      const solMesh = new THREE.Mesh(solGeo, solMat);
      solMesh.name = 'liquid_body';
      solMesh.renderOrder = 2;
      liquidGroup.add(solMesh);
      addConcaveMeniscusAndRipples(liquidGroup, 0.031, 0.036, 'copper-sulfate');
      liquidGroup.position.y = 0.003;

      root.add(liquidGroup);
      root.add(bodyGroup);
      break;
    }

    case 'retort-stand': {
      addContactShadow(root, 0.09, 0.12);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const castIronMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.65,
        metalness: 0.55,
      });
      const chromeRodMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.16,
        metalness: 0.92,
      });

      // 1. Heavy rectangular base
      const baseGeo = new THREE.BoxGeometry(0.14, 0.016, 0.21);
      const baseMesh = new THREE.Mesh(baseGeo, castIronMat);
      baseMesh.position.y = 0.008;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      bodyGroup.add(baseMesh);

      // 2. Vertical steel rod
      const rodGeo = new THREE.CylinderGeometry(0.0055, 0.0055, 0.44, 20);
      const rodMesh = new THREE.Mesh(rodGeo, chromeRodMat);
      rodMesh.position.set(0, 0.23, -0.075);
      rodMesh.castShadow = true;
      bodyGroup.add(rodMesh);

      // 3. Bosshead & Clamp arm (`handle`)
      const clampGroup = new THREE.Group();
      clampGroup.name = 'handle';

      const bossGeo = new THREE.BoxGeometry(0.024, 0.028, 0.032);
      const bossMesh = new THREE.Mesh(bossGeo, castIronMat);
      bossMesh.position.set(0, 0.38, -0.075);
      clampGroup.add(bossMesh);

      const armGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.15, 16);
      armGeo.rotateX(Math.PI / 2);
      const armMesh = new THREE.Mesh(armGeo, chromeRodMat);
      armMesh.position.set(0, 0.38, 0.0);
      clampGroup.add(armMesh);

      const hookGeo = new THREE.TorusGeometry(0.009, 0.002, 10, 20);
      const hookMesh = new THREE.Mesh(hookGeo, chromeRodMat);
      hookMesh.position.set(0, 0.368, 0.068);
      clampGroup.add(hookMesh);

      const anchor = new THREE.Object3D();
      anchor.name = 'measurement_anchor';
      anchor.position.set(0, 0.36, 0.068);
      root.add(anchor);

      root.add(clampGroup);
      root.add(bodyGroup);
      break;
    }

    case 'optical-lens': {
      addContactShadow(root, 0.045, 0.045);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const darkAnodizedMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.36,
        metalness: 0.68,
      });
      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.18,
        metalness: 0.90,
      });
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85,
      });

      // 1. Rider saddle straddling the optical bench rail: Trụ kim loại kết thúc chính xác ở đáy vành kính (y = 0.0528 m)
      bodyGroup.add(buildOpticalRiderSaddle(chromeMat, darkAnodizedMat, brassMat, 0.0528));

      // Khớp gá / chân đế kẹp ôm lấy đáy vành thấu kính (Tuyệt đối không đâm thanh kẹp vào trong lòng kính)
      const ringCradle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0065, 0.0065, 0.005, 16),
        brassMat,
      );
      ringCradle.position.set(0, 0.0528, 0);
      ringCradle.castShadow = true;
      bodyGroup.add(ringCradle);

      // 2. Outer dark anodized lens holder ring + inner brass bezel at OPTICAL_BENCH_AXIS_Y (0.095 m)
      // Oriented perpendicular to X axis (normal along X) so it sits directly on the optical bench rail
      const ringGeo = new THREE.TorusGeometry(0.038, 0.0042, 18, 40);
      ringGeo.rotateY(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, darkAnodizedMat);
      ringMesh.position.y = OPTICAL_BENCH_AXIS_Y;
      ringMesh.castShadow = true;
      bodyGroup.add(ringMesh);

      const bezelGeo = new THREE.TorusGeometry(0.0352, 0.0018, 14, 36);
      bezelGeo.rotateY(Math.PI / 2);
      const bezelMesh = new THREE.Mesh(bezelGeo, brassMat);
      bezelMesh.position.y = OPTICAL_BENCH_AXIS_Y;
      bodyGroup.add(bezelMesh);

      // 3. Top parameter head tag (+10 cm default, dynamically updated via lensProfileId)
      const headPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0022, 0.0022, 0.012, 12),
        brassMat,
      );
      headPost.position.set(0, OPTICAL_BENCH_AXIS_Y + 0.043, 0);
      bodyGroup.add(headPost);

      const tagBacking = new THREE.Mesh(
        new THREE.BoxGeometry(0.032, 0.013, 0.003),
        darkAnodizedMat,
      );
      tagBacking.position.set(0, OPTICAL_BENCH_AXIS_Y + 0.052, 0);
      tagBacking.userData.opticalInteractiveAction = 'cycle-lens-profile';
      bodyGroup.add(tagBacking);

      const tagTex = createLensHeadTagCanvasTexture('+10 cm', 'converging');
      const tagMat = new THREE.MeshBasicMaterial({ map: tagTex });
      const tagFront = new THREE.Mesh(new THREE.PlaneGeometry(0.030, 0.0115), tagMat);
      tagFront.name = 'scale_display';
      tagFront.userData.lastProfileId = 'conv_10';
      tagFront.userData.opticalInteractiveAction = 'cycle-lens-profile';
      tagFront.position.set(0, OPTICAL_BENCH_AXIS_Y + 0.052, 0.0018);
      bodyGroup.add(tagFront);

      const tagRear = new THREE.Mesh(
        new THREE.PlaneGeometry(0.030, 0.0115).rotateY(Math.PI),
        tagMat,
      );
      tagRear.name = 'scale_display_rear';
      tagRear.userData.opticalInteractiveAction = 'cycle-lens-profile';
      tagRear.position.set(0, OPTICAL_BENCH_AXIS_Y + 0.052, -0.0018);
      bodyGroup.add(tagRear);

      // 4. Lathe-profile optical glass lens element (`lens_element`)
      const lensGeo = createProfileOpticalLensGeometry('conv_10', 0.035);
      const lensMat = createGlassMaterial(isSoftwareGl);
      const lensMesh = new THREE.Mesh(lensGeo, lensMat);
      lensMesh.name = 'lens_element';
      lensMesh.userData.lastProfileId = 'conv_10';
      lensMesh.position.y = OPTICAL_BENCH_AXIS_Y;
      lensMesh.renderOrder = 4;
      root.add(lensMesh);

      const anchor = new THREE.Object3D();
      anchor.name = 'measurement_anchor';
      anchor.position.set(0, OPTICAL_BENCH_AXIS_Y, 0);
      root.add(anchor);

      root.add(bodyGroup);
      break;
    }

    case 'laser-source': {
      addContactShadow(root, 0.065, 0.055);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      // 1. White/grey ABS housing (Hình 1.1b SGK KHTN 9 - Đèn laser 3 tia)
      const boxGeo = new THREE.BoxGeometry(0.11, 0.036, 0.082);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.35,
        metalness: 0.12,
      });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      boxMesh.position.y = 0.018;
      boxMesh.castShadow = true;
      boxMesh.receiveShadow = true;
      bodyGroup.add(boxMesh);

      // 2. 3 Red rocker switches on top (mỗi tia sáng điều khiển bằng 1 công tắc)
      const swGeo = new THREE.BoxGeometry(0.018, 0.006, 0.012);
      const swMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      [-0.022, 0, 0.022].forEach((sz, idx) => {
        const sw = new THREE.Mesh(swGeo, swMat);
        sw.name = `switch_${idx + 1}`;
        sw.position.set(-0.01, 0.038, sz);
        bodyGroup.add(sw);
      });

      // 3. Front dark aperture bezel + 3 laser diodes
      const bezelGeo = new THREE.BoxGeometry(0.004, 0.026, 0.072);
      const bezelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
      const bezel = new THREE.Mesh(bezelGeo, bezelMat);
      bezel.position.set(0.055, 0.018, 0);
      bodyGroup.add(bezel);

      // 4. 3 Parallel Red Laser Beams (`laser_beams`)
      const beamsGroup = new THREE.Group();
      beamsGroup.name = 'laser_beams';
      const beamGeo = new THREE.CylinderGeometry(0.0018, 0.0018, 0.32, 12);
      beamGeo.rotateZ(-Math.PI / 2);
      beamGeo.translate(0.16, 0, 0);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xff1e42,
        transparent: true,
        opacity: 0.9,
      });
      [-0.022, 0, 0.022].forEach((bz) => {
        const b = new THREE.Mesh(beamGeo, beamMat);
        b.position.set(0.056, 0.018, bz);
        beamsGroup.add(b);
      });
      root.add(beamsGroup);
      root.add(bodyGroup);
      break;
    }

    case 'semicircular-slab': {
      addContactShadow(root, 0.12, 0.12);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      // 0. Vật liệu cơ khí chuẩn PBR
      const standMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.65,
        metalness: 0.55,
      });
      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.15,
        metalness: 0.92,
      });
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.25,
        metalness: 0.88,
      });
      const anodizedMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.35,
        metalness: 0.7,
      });

      // 1. Chân đế chữ nhật vát góc kim loại nặng chống rung lật (Heavy Cast Baseplate)
      const baseGeo = new THREE.BoxGeometry(0.14, 0.008, 0.12);
      const baseMesh = new THREE.Mesh(baseGeo, standMat);
      baseMesh.position.y = 0.004;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      bodyGroup.add(baseMesh);

      // 4 đệm chân cao su chống trượt
      const footGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.003, 16);
      const footMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 });
      [
        [-0.058, -0.048],
        [0.058, -0.048],
        [-0.058, 0.048],
        [0.058, 0.048],
      ].forEach(([fx, fz]) => {
        const foot = new THREE.Mesh(footGeo, footMat);
        foot.position.set(fx, 0.0015, fz);
        bodyGroup.add(foot);
      });

      // Trụ đứng mạ crom (Vertical Chrome Column)
      const colGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.026, 24);
      const colMesh = new THREE.Mesh(colGeo, chromeMat);
      colMesh.position.y = 0.021;
      bodyGroup.add(colMesh);

      // Khớp đỡ mâm đĩa và vành bezel kim loại ngoài
      const discElevationY = 0.034;
      const flangeMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.004, 32),
        standMat,
      );
      flangeMesh.position.y = discElevationY - 0.002;
      bodyGroup.add(flangeMesh);

      const bezelGeo = new THREE.CylinderGeometry(0.098, 0.098, 0.006, 64);
      const bezelMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.3,
        metalness: 0.75,
      });
      const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
      bezelMesh.position.y = discElevationY;
      bezelMesh.castShadow = true;
      bodyGroup.add(bezelMesh);

      // 2. Mâm đĩa chia độ quang học Hartmann 360° (Hartmann Optical Protractor Disc)
      // Vạch chia 4 góc phần tư đối xứng qua pháp tuyến N-N' (0°..90°), vạch i_gh = 41.8°
      const discMat = new THREE.MeshStandardMaterial({
        map: createHartmannProtractorTexture(),
        roughness: 0.35,
        metalness: 0.08,
      });
      const discGeo = new THREE.CircleGeometry(0.095, 64);
      discGeo.rotateX(-Math.PI / 2);
      const discMesh = new THREE.Mesh(discGeo, discMat);
      discMesh.position.y = discElevationY + 0.0031;
      discMesh.receiveShadow = true;
      bodyGroup.add(discMesh);

      // 3. Bản bán trụ thủy tinh quang học Crown BK7 (Semicircular Glass Slab n = 1.50)
      // Kích thước chuẩn thí nghiệm: Bán kính R = 48 mm, chiều cao H = 20 mm
      // Mặt phẳng đường kính tiếp xúc khít trục phân cách ngang Z = 0, phần cong nằm ở nửa trên Z <= 0
      const slabRadius = 0.048;
      const slabHeight = 0.020;
      const slabBaseY = discElevationY + 0.0035;
      const opticalAxisY = slabBaseY + slabHeight / 2;

      const slabShape = new THREE.Shape();
      slabShape.absarc(0, 0, slabRadius, 0, Math.PI, false);
      slabShape.lineTo(slabRadius, 0);
      const slabGeo = new THREE.ExtrudeGeometry(slabShape, {
        depth: slabHeight,
        bevelEnabled: true,
        bevelThickness: 0.0012,
        bevelSize: 0.0012,
        bevelSegments: 3,
      });
      slabGeo.rotateX(Math.PI / 2);
      const glassMat = createGlassMaterial(isSoftwareGl);
      const slabMesh = new THREE.Mesh(slabGeo, glassMat);
      slabMesh.position.set(0, slabBaseY, 0);
      slabMesh.renderOrder = 5;
      bodyGroup.add(slabMesh);

      // Núm định vị tâm O bằng đồng thau
      const centerPin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.002, 0.002, 0.003, 16),
        brassMat,
      );
      centerPin.position.set(0, slabBaseY + 0.0015, 0);
      bodyGroup.add(centerPin);

      // 4. Cần xoay dẫn hướng & Hộp đèn Laser bán dẫn (Rotating Swivel Laser Arm)
      // Cần xoay đồng tâm tại O, mang đèn laser hướng thẳng vào tâm O và kim chỉ góc
      const laserArm = new THREE.Group();
      laserArm.name = 'handle';
      laserArm.position.set(0, opticalAxisY, 0);

      // Khớp xoay trung tâm bằng đồng thau có núm vặn khía nhám
      const pivotBoss = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, 0.012, 20),
        brassMat,
      );
      laserArm.add(pivotBoss);

      // Thanh cần xoay bằng nhôm phay rãnh chữ U
      const armRail = new THREE.Mesh(
        new THREE.BoxGeometry(0.007, 0.004, 0.062),
        anodizedMat,
      );
      armRail.position.set(0, -0.004, -0.068);
      laserArm.add(armRail);

      // Kim chỉ vạch góc tới (Index Vernier Pointer) vuốt nhọn vươn tới vạch chia độ của đĩa Hartmann
      const pointerGeo = new THREE.ConeGeometry(0.003, 0.014, 12);
      pointerGeo.rotateX(Math.PI / 2);
      const pointerMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.3,
        metalness: 0.5,
      });
      const pointer = new THREE.Mesh(pointerGeo, pointerMat);
      pointer.position.set(0, -0.009, -0.095);
      laserArm.add(pointer);

      // Thân Hộp đèn Laser bán dẫn quang học (Semiconductor Laser Ray Box)
      const laserHousing = new THREE.Mesh(
        new THREE.BoxGeometry(0.022, 0.018, 0.046),
        anodizedMat,
      );
      laserHousing.position.set(0, 0, -0.068);
      laserHousing.castShadow = true;
      laserArm.add(laserHousing);

      // Rãnh tản nhiệt 2 bên hộp laser
      [-0.0115, 0.0115].forEach((gx) => {
        const finGeo = new THREE.BoxGeometry(0.0015, 0.012, 0.038);
        const finMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
        const fin = new THREE.Mesh(finGeo, finMat);
        fin.position.set(gx, 0, -0.068);
        laserArm.add(fin);
      });

      // Ống kính chuẩn trực hội tụ (Collimator Nozzle) bằng đồng thau mạ vàng hướng thẳng vào tâm O
      const nozzleGeo = new THREE.CylinderGeometry(0.0038, 0.0055, 0.012, 20);
      nozzleGeo.rotateX(Math.PI / 2);
      const nozzleMesh = new THREE.Mesh(nozzleGeo, brassMat);
      nozzleMesh.position.set(0, 0, -0.042);
      laserArm.add(nozzleMesh);

      // Công tắc nguồn rocker switch màu đỏ
      const swMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 0.005, 0.010),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 }),
      );
      swMesh.position.set(0, 0.011, -0.082);
      laserArm.add(swMesh);

      // Tem cảnh báo an toàn tia laser vàng đen (Laser Warning Caution Decal)
      const decalMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.016, 0.008),
        new THREE.MeshBasicMaterial({ color: 0xfacc15 }),
      );
      decalMesh.rotation.x = -Math.PI / 2;
      decalMesh.position.set(0, 0.0092, -0.062);
      laserArm.add(decalMesh);

      // Đèn LED báo nguồn laser
      const ledPwr = new THREE.Mesh(
        new THREE.SphereGeometry(0.0018, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x22c55e }),
      );
      ledPwr.position.set(0, 0.010, -0.052);
      laserArm.add(ledPwr);

      // Tia tới laser SI (Incident Ray) - con của laserArm để tự động quay đồng bộ!
      const incRayGroup = createDirectionalRayMesh(0.042, 0xff1e42, -1, true);
      incRayGroup.name = 'incident_ray';
      incRayGroup.visible = false;
      laserArm.add(incRayGroup);

      // 5. Hệ thống chùm tia sáng 3D quang học thể tích động (`ray_paths`)
      const rayGroup = new THREE.Group();
      rayGroup.name = 'ray_paths';
      rayGroup.position.set(0, opticalAxisY, 0);
      rayGroup.visible = false;

      // Tia phản xạ IS' (Reflected Ray): từ O phản xạ ngược vào lòng khối thủy tinh (Z <= 0)
      const rflRayGroup = createDirectionalRayMesh(0.095, 0xff1e42, -1, false);
      rflRayGroup.name = 'reflected_ray';
      rflRayGroup.visible = false;
      rayGroup.add(rflRayGroup);

      // Tia khúc xạ IR (Refracted Ray): từ O khúc xạ sang không khí (Z >= 0)
      const refRayGroup = createDirectionalRayMesh(0.095, 0x10b981, 1, true);
      refRayGroup.name = 'refracted_ray';
      refRayGroup.visible = false;
      rayGroup.add(refRayGroup);

      // Điểm sáng tương tác tại tâm O trên mặt phân cách (Optical Hit Spot)
      const hitSpot = new THREE.Mesh(
        new THREE.SphereGeometry(0.0028, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xff3b30 }),
      );
      hitSpot.name = 'measurement_anchor';
      hitSpot.visible = false;
      rayGroup.add(hitSpot);

      root.add(laserArm);
      root.add(rayGroup);
      root.add(bodyGroup);
      break;
    }

    case 'optical-prism': {
      addContactShadow(root, 0.06, 0.06);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      // 1. Stand base & post (Hình 7.1 & 7.4 SGK KHTN 9 - Lăng kính gắn trên giá)
      const standMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.45,
        metalness: 0.6,
      });
      const baseMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.046, 0.01, 28),
        standMat,
      );
      baseMesh.position.y = 0.005;
      bodyGroup.add(baseMesh);

      const postMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, 0.055, 16),
        standMat,
      );
      postMesh.position.y = 0.035;
      bodyGroup.add(postMesh);

      const tableMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.038, 0.006, 28),
        standMat,
      );
      tableMesh.position.y = 0.064;
      bodyGroup.add(tableMesh);

      // 2. Equilateral Triangular Glass Prism (Góc chiết quang A = 60°, chiết suất n = 1.517)
      const prismGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.068, 3);
      const glassMat = createGlassMaterial(isSoftwareGl);
      const prismMesh = new THREE.Mesh(prismGeo, glassMat);
      prismMesh.position.y = 0.101;
      prismMesh.renderOrder = 4;
      bodyGroup.add(prismMesh);

      root.add(bodyGroup);
      break;
    }

    case 'magnifying-glass': {
      addContactShadow(root, 0.048, 0.048);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      // 1. Ergonomic handle & brass collar (Hình 10.1 SGK KHTN 9 - Kính lúp G = 5x)
      const handleMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.55,
        metalness: 0.2,
      });
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.25,
        metalness: 0.85,
      });

      const standBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.032, 0.036, 0.008, 24),
        handleMat,
      );
      standBase.position.y = 0.004;
      bodyGroup.add(standBase);

      const handleMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.007, 0.0085, 0.075, 20),
        handleMat,
      );
      handleMesh.position.y = 0.042;
      bodyGroup.add(handleMesh);

      const collarMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.012, 20),
        brassMat,
      );
      collarMesh.position.y = 0.082;
      bodyGroup.add(collarMesh);

      // 2. Protective Lens Frame (Khung bảo vệ ghi 5x)
      const frameMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.038, 0.0045, 16, 36),
        handleMat,
      );
      frameMesh.position.y = 0.124;
      bodyGroup.add(frameMesh);

      // 3. Biconvex Converging Lens (Thấu kính hội tụ tiêu cự ngắn f = 5 cm)
      const lensGeo = new THREE.SphereGeometry(0.036, 28, 20);
      lensGeo.scale(1, 1, 0.28);
      const lensMesh = new THREE.Mesh(lensGeo, createGlassMaterial(isSoftwareGl));
      lensMesh.name = 'lens_element';
      lensMesh.position.y = 0.124;
      lensMesh.renderOrder = 4;
      root.add(lensMesh);

      root.add(bodyGroup);
      break;
    }

    case 'galvanometer': {
      addContactShadow(root, 0.065, 0.065);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      // 1. Meter housing (Hình 1.4 & Bài 14 SGK KHTN 9 - Điện kế vạch 0 ở giữa)
      const caseMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.42,
        metalness: 0.25,
      });
      const baseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.032, 0.095),
        caseMat,
      );
      baseMesh.position.y = 0.016;
      bodyGroup.add(baseMesh);

      const towerMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.104, 0.115, 0.052),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35 }),
      );
      towerMesh.position.set(0, 0.086, -0.012);
      bodyGroup.add(towerMesh);

      // 2. Dial face with 0 at center (`scale_marks`)
      const dCanvas = document.createElement('canvas');
      dCanvas.width = 256;
      dCanvas.height = 192;
      const dCtx = dCanvas.getContext('2d')!;
      dCtx.fillStyle = '#FFFFFF';
      dCtx.fillRect(0, 0, 256, 192);
      dCtx.strokeStyle = '#0F172A';
      dCtx.lineWidth = 4;
      dCtx.strokeRect(4, 4, 248, 184);

      dCtx.beginPath();
      dCtx.arc(128, 152, 96, Math.PI * 1.18, Math.PI * 1.82);
      dCtx.stroke();

      dCtx.fillStyle = '#0B3A7D';
      dCtx.font = 'bold 28px "Inter", sans-serif';
      dCtx.textAlign = 'center';
      dCtx.fillText('G', 128, 118);
      dCtx.font = 'bold 18px "JetBrains Mono", monospace';
      dCtx.fillText('0', 128, 42);
      dCtx.fillStyle = '#EF4444';
      dCtx.fillText('-50', 54, 68);
      dCtx.fillStyle = '#16A34A';
      dCtx.fillText('+50', 202, 68);

      const dialTex = new THREE.CanvasTexture(dCanvas);
      dialTex.colorSpace = THREE.SRGBColorSpace;
      const dialMat = new THREE.MeshBasicMaterial({ map: dialTex });
      const dialMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.092, 0.072),
        dialMat,
      );
      dialMesh.name = 'scale_marks';
      dialMesh.position.set(0, 0.098, 0.015);
      root.add(dialMesh);

      // Rear dial face so rotating the Galvanometer 180° still shows the scale clearly
      const dialRearMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.092, 0.072),
        dialMat,
      );
      dialRearMesh.name = 'scale_marks_rear';
      dialRearMesh.position.set(0, 0.098, -0.039);
      dialRearMesh.rotation.y = Math.PI;
      root.add(dialRearMesh);

      // 3. Pivoting Pointer Needles (`plunger` front & `plunger_rear` back)
      const needleGroup = new THREE.Group();
      needleGroup.name = 'plunger';
      needleGroup.position.set(0, 0.068, 0.016);
      const needleGeo = new THREE.BoxGeometry(0.0028, 0.052, 0.002);
      needleGeo.translate(0, 0.026, 0);
      const needleMesh = new THREE.Mesh(
        needleGeo,
        new THREE.MeshBasicMaterial({ color: 0xef4444 }),
      );
      needleGroup.add(needleMesh);
      root.add(needleGroup);

      const needleRearGroup = new THREE.Group();
      needleRearGroup.name = 'plunger_rear';
      needleRearGroup.position.set(0, 0.068, -0.040);
      const needleRearMesh = new THREE.Mesh(
        needleGeo,
        new THREE.MeshBasicMaterial({ color: 0xef4444 }),
      );
      needleRearGroup.add(needleRearMesh);
      root.add(needleRearGroup);

      // 4. 3 Front Binding Posts: (-) Black, (G0) Red, (G1) Red
      const postGeo = new THREE.CylinderGeometry(0.0055, 0.0055, 0.012, 16);
      const blkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
      [
        { x: -0.03, m: blkMat },
        { x: 0, m: redMat },
        { x: 0.03, m: redMat },
      ].forEach(({ x, m }) => {
        const p = new THREE.Mesh(postGeo, m);
        p.position.set(x, 0.036, 0.028);
        bodyGroup.add(p);
      });

      root.add(bodyGroup);
      break;
    }

    case 'digital-multimeter': {
      addContactShadow(root, 0.058, 0.075);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      // 1. Yellow protective rubber holster + dark face (Hình 1.5 SGK KHTN 9 - Đồng hồ đo điện đa năng)
      const holsterGeo = new THREE.BoxGeometry(0.092, 0.036, 0.155);
      const holsterMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.55,
        metalness: 0.08,
      });
      const holsterMesh = new THREE.Mesh(holsterGeo, holsterMat);
      holsterMesh.position.set(0, 0.032, 0);
      holsterMesh.rotation.x = -0.22;
      holsterMesh.castShadow = true;
      bodyGroup.add(holsterMesh);

      const faceGeo = new THREE.BoxGeometry(0.082, 0.006, 0.142);
      const faceMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45 });
      const faceMesh = new THREE.Mesh(faceGeo, faceMat);
      faceMesh.position.set(0, 0.049, 0.002);
      faceMesh.rotation.x = -0.22;
      bodyGroup.add(faceMesh);

      // 2. Digital LCD Screen (`scale_display` on top/front + `scale_display_rear` on back)
      const mmTex = createLcdDisplayTexture('0.00', 'V');
      const mmLcdMat = new THREE.MeshBasicMaterial({
        map: mmTex,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      });
      const mmLcd = new THREE.Mesh(
        new THREE.PlaneGeometry(0.068, 0.028),
        mmLcdMat,
      );
      mmLcd.name = 'scale_display';
      mmLcd.userData.lastText = '0.00:V';
      mmLcd.position.set(0, 0.061, -0.038);
      mmLcd.rotation.x = -Math.PI / 2 - 0.22;
      root.add(mmLcd);

      const mmLcdRear = new THREE.Mesh(
        new THREE.PlaneGeometry(0.068, 0.028),
        mmLcdMat,
      );
      mmLcdRear.name = 'scale_display_rear';
      mmLcdRear.position.set(0, 0.038, -0.079);
      mmLcdRear.rotation.y = Math.PI;
      mmLcdRear.rotation.x = 0.22;
      root.add(mmLcdRear);

      // 3. Rotary Range Selector Dial (`handle`)
      const dialKnob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.024, 0.01, 24),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.35 }),
      );
      dialKnob.name = 'handle';
      dialKnob.position.set(0, 0.052, 0.008);
      dialKnob.rotation.x = -0.22;
      root.add(dialKnob);

      // 4. 3 Probe Banana Jacks (10A, VΩmA, COM)
      const jackGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.008, 16);
      const redJack = new THREE.MeshStandardMaterial({ color: 0xef4444 });
      const blkJack = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      [-0.024, 0, 0.024].forEach((jx, idx) => {
        const j = new THREE.Mesh(jackGeo, idx === 2 ? blkJack : redJack);
        j.position.set(jx, 0.042, 0.052);
        j.rotation.x = -0.22;
        bodyGroup.add(j);
      });

      root.add(bodyGroup);
      break;
    }

    case 'induction-coil-led': {
      addContactShadow(root, 0.095, 0.065);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      // 1. Wooden base board (Hình 1.6 & Hình 14.4 SGK KHTN 9 - Cuộn dây dẫn có 2 đèn LED + Nam châm)
      const baseWood = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.014, 0.11),
        new THREE.MeshStandardMaterial({ color: 0x9a5b25, roughness: 0.55 }),
      );
      baseWood.position.y = 0.007;
      bodyGroup.add(baseWood);

      // 2. Copper Wire Induction Coil Bobbin
      const coilGeo = new THREE.CylinderGeometry(0.034, 0.034, 0.058, 32);
      coilGeo.rotateZ(Math.PI / 2);
      const copperWireMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85,
      });
      const coilMesh = new THREE.Mesh(coilGeo, copperWireMat);
      coilMesh.position.set(0.032, 0.048, 0);
      coilMesh.castShadow = true;
      bodyGroup.add(coilMesh);

      // 3. 2 Anti-parallel Indicator LEDs (`led_1` Red, `led_2` Yellow-Green) on top of coil
      const ledGeo = new THREE.SphereGeometry(0.0065, 16, 16);
      const led1Mat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xef4444,
        emissiveIntensity: 0.0, // Ban đầu nam châm đứng yên -> LED tắt hoàn toàn (P05)
      });
      const led2Mat = new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        emissive: 0x22c55e,
        emissiveIntensity: 0.0, // Ban đầu nam châm đứng yên -> LED tắt hoàn toàn (P05)
      });
      const led1 = new THREE.Mesh(ledGeo, led1Mat);
      led1.name = 'led_1';
      led1.position.set(0.02, 0.086, -0.014);
      root.add(led1);

      const led2 = new THREE.Mesh(ledGeo, led2Mat);
      led2.name = 'led_2';
      led2.position.set(0.044, 0.086, 0.014);
      root.add(led2);

      // 4. Permanent Bar Magnet (N Red / S Blue) on pivot (`plunger`)
      const magnetGroup = new THREE.Group();
      magnetGroup.name = 'plunger';
      magnetGroup.position.set(-0.042, 0.048, 0);

      const northHalf = new THREE.Mesh(
        new THREE.BoxGeometry(0.034, 0.016, 0.016),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 }),
      );
      northHalf.position.x = 0.017;
      magnetGroup.add(northHalf);

      const southHalf = new THREE.Mesh(
        new THREE.BoxGeometry(0.034, 0.016, 0.016),
        new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35 }),
      );
      southHalf.position.x = -0.017;
      magnetGroup.add(southHalf);

      root.add(magnetGroup);
      root.add(bodyGroup);
      break;
    }

    case 'porcelain-dish': {
      addContactShadow(root, 0.052, 0.052);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      // 1. White glazed porcelain evaporating dish (Hình 1.7 & Bài 26 SGK KHTN 9 - Bát sứ)
      const porcelainMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.14,
        metalness: 0.04,
        side: THREE.DoubleSide,
      });
      const footRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.026, 0.006, 28),
        porcelainMat,
      );
      footRing.position.y = 0.003;
      bodyGroup.add(footRing);

      const bowlGeo = new THREE.SphereGeometry(
        0.046,
        32,
        18,
        0,
        Math.PI * 2,
        Math.PI * 0.52,
        Math.PI * 0.48,
      );
      const bowlMesh = new THREE.Mesh(bowlGeo, porcelainMat);
      bowlMesh.position.y = 0.048;
      bowlMesh.castShadow = true;
      bodyGroup.add(bowlMesh);

      const rimMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.045, 0.0025, 12, 32).rotateX(Math.PI / 2),
        porcelainMat,
      );
      rimMesh.position.y = 0.045;
      bodyGroup.add(rimMesh);

      // 2. Ethylic alcohol inside (`liquid_surface`)
      const ethGroup = new THREE.Group();
      ethGroup.name = 'liquid_surface';
      const ethMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.036, 0.022, 0.014, 24),
        new THREE.MeshStandardMaterial({
          color: 0xbae6fd,
          transparent: true,
          opacity: 0.55,
          roughness: 0.1,
        }),
      );
      ethMesh.position.y = 0.016;
      ethGroup.add(ethMesh);
      root.add(ethGroup);

      // 3. Alcohol Combustion Flame (`flame_group` for Bài 26: Đốt cháy ethylic alcohol trong bát sứ)
      const flameGroup = new THREE.Group();
      flameGroup.name = 'flame_group';
      flameGroup.visible = false;
      const outerFlame = new THREE.Mesh(
        new THREE.ConeGeometry(0.022, 0.055, 16),
        new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.72,
        }),
      );
      outerFlame.position.y = 0.052;
      flameGroup.add(outerFlame);

      const innerFlame = new THREE.Mesh(
        new THREE.ConeGeometry(0.012, 0.036, 16),
        new THREE.MeshBasicMaterial({
          color: 0xfbbf24,
          transparent: true,
          opacity: 0.85,
        }),
      );
      innerFlame.position.y = 0.045;
      flameGroup.add(innerFlame);
      root.add(flameGroup);

      root.add(bodyGroup);
      break;
    }

    case 'separatory-funnel': {
      addContactShadow(root, 0.065, 0.065);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';
      const glassMat = createGlassMaterial(isSoftwareGl);
      const standMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.45,
        metalness: 0.65,
      });

      // 1. Tall Support Stand & Ring Clamp (stem tip at y = 0.118 m — above 0.098 m rim of 250 ml catch beaker!)
      const baseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.012, 0.13),
        standMat,
      );
      baseMesh.position.y = 0.006;
      bodyGroup.add(baseMesh);

      const rodMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0045, 0.0045, 0.32, 16),
        standMat,
      );
      rodMesh.position.set(-0.042, 0.165, 0);
      bodyGroup.add(rodMesh);

      const ringClamp = new THREE.Mesh(
        new THREE.TorusGeometry(0.031, 0.003, 12, 28).rotateX(Math.PI / 2),
        standMat,
      );
      ringClamp.position.set(0, 0.215, 0);
      bodyGroup.add(ringClamp);

      // 2. Pear-shaped Separatory Funnel Body + Stem + Red Stopcock (`handle`)
      const upperCone = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.032, 0.055, 28, 1, true),
        glassMat,
      );
      upperCone.position.y = 0.245;
      upperCone.renderOrder = 4;
      bodyGroup.add(upperCone);

      const lowerCone = new THREE.Mesh(
        new THREE.CylinderGeometry(0.032, 0.006, 0.065, 28, 1, true),
        glassMat,
      );
      lowerCone.position.y = 0.185;
      lowerCone.renderOrder = 4;
      bodyGroup.add(lowerCone);

      const stemTube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0045, 0.0035, 0.065, 20, 1, true),
        glassMat,
      );
      stemTube.position.y = 0.120;
      stemTube.renderOrder = 4;
      bodyGroup.add(stemTube);

      const stopcock = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.028, 16).rotateX(Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 }),
      );
      stopcock.name = 'handle';
      stopcock.position.y = 0.142;
      root.add(stopcock);

      // 3. Two immiscible liquid layers inside (`liquid_surface`: aqueous bottom + ester/oil top)
      const liqGroup = new THREE.Group();
      liqGroup.name = 'liquid_surface';
      const aqLayer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.026, 0.006, 0.042, 24),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.65,
        }),
      );
      aqLayer.name = 'aq_layer';
      aqLayer.position.y = 0.178;
      liqGroup.add(aqLayer);

      const orgLayer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.026, 0.024, 24),
        new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          transparent: true,
          opacity: 0.72,
        }),
      );
      orgLayer.name = 'org_layer';
      orgLayer.position.y = 0.211;
      liqGroup.add(orgLayer);
      root.add(liqGroup);

      // 4. Extraction Liquid Stream from Bottom Stem (`spout_stream` — strictly hidden unless stopcock is opened!)
      const sepStreamGroup = new THREE.Group();
      sepStreamGroup.name = 'spout_stream';
      const sepStreamMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0020, 0.0028, 0.068, 14),
        createStreamMaterial(0x38bdf8, 0.88),
      );
      sepStreamMesh.name = 'stream_outer';
      sepStreamMesh.position.set(0, 0.054, 0);
      sepStreamMesh.renderOrder = 5;
      sepStreamGroup.add(sepStreamMesh);

      const sepDropGeo = new THREE.SphereGeometry(0.0022, 10, 10);
      const sepDropMat = createStreamMaterial(0x7dd3fc, 0.92);
      for (let d = 0; d < 4; d++) {
        const drop = new THREE.Mesh(sepDropGeo, sepDropMat);
        drop.name = `droplet_${d}`;
        drop.position.set(0, 0.084 - d * 0.016, 0);
        drop.scale.set(0.85, 1.35, 0.85);
        sepStreamGroup.add(drop);
      }

      const sepSplash = new THREE.Mesh(
        new THREE.RingGeometry(0.003, 0.010, 20).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({
          color: 0xbae6fd,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        }),
      );
      sepSplash.name = 'splash_ring_0';
      sepSplash.position.set(0, 0.020, 0);
      sepStreamGroup.add(sepSplash);

      sepStreamGroup.visible = false;
      root.add(sepStreamGroup);

      root.add(bodyGroup);
      break;
    }

    case 'distillation-flask': {
      addContactShadow(root, 0.065, 0.065);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';
      const glassMat = createGlassMaterial(isSoftwareGl);
      const steelMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.4,
        metalness: 0.75,
      });

      // 1. Tripod Heating Stand + Wire Gauze with Ceramic Center (Hình 1.9, 1.10 & Hình 24.1 SGK KHTN 9)
      const tripodRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.044, 0.0035, 12, 28).rotateX(Math.PI / 2),
        steelMat,
      );
      tripodRing.position.y = 0.088;
      bodyGroup.add(tripodRing);

      [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].forEach((ang) => {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0035, 0.0035, 0.09, 12),
          steelMat,
        );
        leg.position.set(Math.cos(ang) * 0.042, 0.044, Math.sin(ang) * 0.042);
        bodyGroup.add(leg);
      });

      // Lưới tản nhiệt (Hình 1.10 - dùng để phân tán nhiệt khi đốt)
      const gauzeMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.096, 0.0025, 0.096),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6, metalness: 0.5 }),
      );
      gauzeMesh.position.y = 0.091;
      bodyGroup.add(gauzeMesh);

      const ceramicCenter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.032, 0.032, 0.0032, 24),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85 }),
      );
      ceramicCenter.position.y = 0.0915;
      bodyGroup.add(ceramicCenter);

      // 2. Alcohol Burner Lamp underneath
      const burnerBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.028, 0.038, 24),
        glassMat,
      );
      burnerBody.position.y = 0.019;
      bodyGroup.add(burnerBody);

      const flameGroup = new THREE.Group();
      flameGroup.name = 'flame_group';
      const burnerFlame = new THREE.Mesh(
        new THREE.ConeGeometry(0.012, 0.034, 16),
        new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.88,
        }),
      );
      burnerFlame.position.y = 0.062;
      flameGroup.add(burnerFlame);
      root.add(flameGroup);

      // 3. Round-Bottom Side-Arm Distillation Flask (Hình 1.9 - Bình cầu có nhánh 250 mL)
      const bulbMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.038, 28, 24),
        glassMat,
      );
      bulbMesh.position.y = 0.13;
      bulbMesh.renderOrder = 4;
      bodyGroup.add(bulbMesh);

      const neckMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.068, 24, 1, true),
        glassMat,
      );
      neckMesh.position.y = 0.192;
      neckMesh.renderOrder = 4;
      bodyGroup.add(neckMesh);

      const sideArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.004, 0.004, 0.075, 16),
        glassMat,
      );
      sideArm.position.set(0.034, 0.185, 0);
      sideArm.rotation.z = -1.05;
      sideArm.renderOrder = 4;
      bodyGroup.add(sideArm);

      // Reaction mixture inside (`liquid_surface`)
      const liqGroup = new THREE.Group();
      liqGroup.name = 'liquid_surface';
      const liqSphere = new THREE.Mesh(
        new THREE.SphereGeometry(
          0.035,
          24,
          16,
          0,
          Math.PI * 2,
          Math.PI * 0.45,
          Math.PI * 0.55,
        ),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.68,
        }),
      );
      liqSphere.position.y = 0.13;
      liqGroup.add(liqSphere);
      root.add(liqGroup);

      root.add(bodyGroup);
      break;
    }

    case 'optical-microscope': {
      addContactShadow(root, 0.085, 0.095);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const enamelMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.22,
        metalness: 0.15,
      });
      const darkStageMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.35,
        metalness: 0.75,
      });
      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.12,
        metalness: 0.95,
      });
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85,
      });

      // 1. Đế móng ngựa/chữ U nặng đúc nguyên khối sơn tĩnh điện trắng
      const baseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.115, 0.022, 0.150),
        enamelMat,
      );
      baseMesh.position.y = 0.011;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      bodyGroup.add(baseMesh);

      // Đèn nguồn LED / Hộp gương lấy sáng gắn ở đế
      const lampHousing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.018, 0.018, 24),
        darkStageMat,
      );
      lampHousing.position.set(0, 0.028, 0.015);
      bodyGroup.add(lampHousing);

      const lampLens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.003, 24),
        new THREE.MeshBasicMaterial({ color: 0xbae6fd }),
      );
      lampLens.position.set(0, 0.038, 0.015);
      bodyGroup.add(lampLens);

      // 2. Thân cong chữ C (Curved Pillar) hợp kim nhôm đúc
      const pillarMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.030, 0.180, 0.034),
        enamelMat,
      );
      pillarMesh.position.set(0, 0.110, -0.048);
      bodyGroup.add(pillarMesh);

      // Núm vi chỉnh kép đồng trục (Ốc sơ cấp to + Ốc vi cấp nhỏ) ở 2 bên thân
      [-0.026, 0.026].forEach((kx) => {
        // Ốc sơ cấp (Coarse focus - to)
        const coarseKnob = new THREE.Mesh(
          new THREE.CylinderGeometry(0.016, 0.016, 0.012, 24).rotateZ(Math.PI / 2),
          darkStageMat,
        );
        coarseKnob.position.set(kx, 0.072, -0.046);
        bodyGroup.add(coarseKnob);

        // Ốc vi cấp (Fine focus - nhỏ, vươn ra ngoài)
        const fineKnob = new THREE.Mesh(
          new THREE.CylinderGeometry(0.009, 0.009, 0.010, 20).rotateZ(Math.PI / 2),
          chromeMat,
        );
        fineKnob.position.set(kx > 0 ? kx + 0.008 : kx - 0.008, 0.072, -0.046);
        bodyGroup.add(fineKnob);
      });

      // 3. Bàn sa trượt phẳng (Mechanical Stage) di chuyển theo ốc lấy nét Z
      const stageGroup = new THREE.Group();
      stageGroup.name = 'stageGroup';

      const stageMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.090, 0.008, 0.090),
        darkStageMat,
      );
      stageMesh.position.set(0, 0.098, 0.005);
      stageMesh.castShadow = true;
      stageGroup.add(stageMesh);

      // Lỗ tụ quang xuyên tâm bàn
      const stageHole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.009, 0.009, 0.0085, 20),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
      );
      stageHole.position.set(0, 0.098, 0.005);
      stageGroup.add(stageHole);

      // Kẹp giữ tiêu bản lò xo mạ crom (2 kẹp 2 bên)
      [-0.028, 0.028].forEach((cx) => {
        const clipBase = new THREE.Mesh(
          new THREE.CylinderGeometry(0.002, 0.002, 0.006, 12),
          chromeMat,
        );
        clipBase.position.set(cx, 0.104, -0.012);
        stageGroup.add(clipBase);

        const clipArm = new THREE.Mesh(
          new THREE.BoxGeometry(0.003, 0.0012, 0.028),
          chromeMat,
        );
        clipArm.position.set(cx, 0.106, 0.002);
        stageGroup.add(clipArm);
      });

      // Lam kính tiêu bản cố định (KHTN THCS)
      const slideMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.056, 0.002, 0.024),
        createGlassMaterial(isSoftwareGl),
      );
      slideMesh.position.set(0, 0.103, 0.005);
      stageGroup.add(slideMesh);

      // Giọt nhuộm mẫu tiêu bản tế bào
      const stainedSample = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, 0.0026, 20),
        new THREE.MeshBasicMaterial({ color: 0x0284c7 }),
      );
      stainedSample.position.set(0, 0.1036, 0.005);
      stageGroup.add(stainedSample);

      bodyGroup.add(stageGroup);

      // 4. Mâm xoay vật kính (Revolving Nosepiece - `plunger`) 4 vật kính chuẩn quốc tế DIN
      const turretGroup = new THREE.Group();
      turretGroup.name = 'plunger';
      turretGroup.position.set(0, 0.155, 0.005);

      const turretDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.026, 0.021, 0.012, 32),
        chromeMat,
      );
      turretGroup.add(turretDisc);

      // 4 Vật kính: 4x (Đỏ), 10x (Vàng), 40x (Xanh lam), 100x (Trắng soi dầu)
      const objSpecs = [
        { col: 0xef4444, label: '4x', len: 0.016 },
        { col: 0xeab308, label: '10x', len: 0.022 },
        { col: 0x0284c7, label: '40x', len: 0.030 },
        { col: 0xf8fafc, label: '100x', len: 0.036 },
      ];
      objSpecs.forEach((spec, idx) => {
        const ang = (idx * Math.PI * 2) / 4;
        const objGroup = new THREE.Group();
        objGroup.position.set(Math.sin(ang) * 0.014, -0.005, Math.cos(ang) * 0.014);

        // Cổ ren đồng
        const collar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0048, 0.0048, 0.005, 16),
          brassMat,
        );
        collar.position.y = -0.0025;
        objGroup.add(collar);

        // Ống vật kính mạ crom
        const barrel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0045, 0.0036, spec.len, 18),
          chromeMat,
        );
        barrel.position.y = -0.005 - spec.len / 2;
        objGroup.add(barrel);

        // Vòng đai mã màu quốc tế
        const ring = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0046, 0.0046, 0.004, 18),
          new THREE.MeshStandardMaterial({ color: spec.col, roughness: 0.3 }),
        );
        ring.position.y = -0.008;
        objGroup.add(ring);

        // Thấu kính trước (front optical lens)
        const frontLens = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0028, 0.0028, 0.001, 16),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
        );
        frontLens.position.y = -0.005 - spec.len;
        objGroup.add(frontLens);

        turretGroup.add(objGroup);
      });
      root.add(turretGroup);

      // 5. Thân đầu trên (Head) & Ống thị kính nghiêng 45°
      const headMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.036, 0.032, 0.072),
        enamelMat,
      );
      headMesh.position.set(0, 0.180, -0.018);
      bodyGroup.add(headMesh);

      const eyepieceTube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.011, 0.011, 0.070, 24),
        darkStageMat,
      );
      eyepieceTube.position.set(0, 0.218, 0.018);
      eyepieceTube.rotation.x = 0.55;
      bodyGroup.add(eyepieceTube);

      // Vành đệm cao su thị kính êm ái
      const eyeCup = new THREE.Mesh(
        new THREE.TorusGeometry(0.0115, 0.0022, 12, 24).rotateX(Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 }),
      );
      eyeCup.position.set(0, 0.248, 0.038);
      eyeCup.rotation.x = 0.55;
      bodyGroup.add(eyeCup);

      root.add(bodyGroup);
      break;
    }

    case 'dna-double-helix': {
      addContactShadow(root, 0.055, 0.055);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      // 1. Display Pedestal & Central Axis Rod (Hình 38.1 SGK KHTN 9 - Mô hình phân tử DNA)
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.4,
        metalness: 0.5,
      });
      const baseMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.048, 0.054, 0.014, 32),
        baseMat,
      );
      baseMesh.position.y = 0.007;
      bodyGroup.add(baseMesh);

      const rodMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0025, 0.0025, 0.24, 12),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 }),
      );
      rodMesh.position.y = 0.128;
      bodyGroup.add(rodMesh);

      // 2. Helical Sugar-Phosphate Backbones & Complementary Base Pairs (A-T, G-C)
      const helixGroup = new THREE.Group();
      helixGroup.name = 'handle';
      const rungCount = 12;
      const backboneMat1 = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        roughness: 0.25,
      });
      const backboneMat2 = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.25,
      });
      const baseColors = [
        [0xef4444, 0x3b82f6], // A - T
        [0x22c55e, 0xeab308], // G - C
      ];

      for (let i = 0; i < rungCount; i++) {
        const y = 0.028 + i * 0.018;
        const theta = i * 0.58;
        const r = 0.032;
        const x1 = Math.cos(theta) * r;
        const z1 = Math.sin(theta) * r;
        const x2 = -x1;
        const z2 = -z1;

        const node1 = new THREE.Mesh(
          new THREE.SphereGeometry(0.0065, 14, 14),
          backboneMat1,
        );
        node1.position.set(x1, y, z1);
        helixGroup.add(node1);

        const node2 = new THREE.Mesh(
          new THREE.SphereGeometry(0.0065, 14, 14),
          backboneMat2,
        );
        node2.position.set(x2, y, z2);
        helixGroup.add(node2);

        const [c1, c2] = baseColors[i % 2];
        const halfRungGeo = new THREE.CylinderGeometry(0.0028, 0.0028, r, 10);
        halfRungGeo.rotateZ(Math.PI / 2);

        const rungA = new THREE.Mesh(
          halfRungGeo,
          new THREE.MeshStandardMaterial({ color: c1, roughness: 0.3 }),
        );
        rungA.position.set(x1 * 0.5, y, z1 * 0.5);
        rungA.rotation.y = -theta;
        helixGroup.add(rungA);

        const rungB = new THREE.Mesh(
          halfRungGeo,
          new THREE.MeshStandardMaterial({ color: c2, roughness: 0.3 }),
        );
        rungB.position.set(x2 * 0.5, y, z2 * 0.5);
        rungB.rotation.y = -theta;
        helixGroup.add(rungB);
      }

      root.add(helixGroup);
      root.add(bodyGroup);
      break;
    }

    case 'thermometer':
    default: {
      addContactShadow(root, 0.025, 0.025);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      // Holder stand
      const standGeo = new THREE.CylinderGeometry(0.02, 0.024, 0.008, 20);
      const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
      const standMesh = new THREE.Mesh(standGeo, standMat);
      standMesh.position.y = 0.004;
      bodyGroup.add(standMesh);

      // Red alcohol sensing bulb
      const bulbGeo = new THREE.SphereGeometry(0.006, 20, 16);
      const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2 });
      const bulbMesh = new THREE.Mesh(bulbGeo, redMat);
      bulbMesh.position.y = 0.016;
      bodyGroup.add(bulbMesh);

      // Red alcohol capillary column (`plunger` scales height dynamically with temperatureC)
      const colGroup = new THREE.Group();
      colGroup.name = 'plunger';
      colGroup.position.y = 0.018;
      const colGeo = new THREE.CylinderGeometry(0.0020, 0.0020, 0.14, 12);
      colGeo.translate(0, 0.07, 0);
      const colMesh = new THREE.Mesh(colGeo, redMat);
      colGroup.add(colMesh);
      root.add(colGroup);

      // 360° Dual-sided temperature graduation scale (-10°C to 110°C)
      const tempScaleTex = createGraduationCanvasTexture(0, 100, 20, '100 °C : 1 °C');
      const tempScaleMat = new THREE.MeshBasicMaterial({
        map: tempScaleTex,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const tempPlate1 = new THREE.Mesh(
        new THREE.PlaneGeometry(0.016, 0.16),
        tempScaleMat,
      );
      tempPlate1.name = 'scale_marks';
      tempPlate1.position.set(0, 0.112, 0);
      root.add(tempPlate1);

      const tempPlate2 = new THREE.Mesh(
        new THREE.PlaneGeometry(0.016, 0.16),
        tempScaleMat,
      );
      tempPlate2.position.set(0, 0.112, 0);
      tempPlate2.rotation.y = Math.PI / 2;
      root.add(tempPlate2);

      // Outer glass stem
      const stemGeo = new THREE.CylinderGeometry(0.0052, 0.0052, 0.19, 20);
      const glassMat = createGlassMaterial(isSoftwareGl);
      const stemMesh = new THREE.Mesh(stemGeo, glassMat);
      stemMesh.position.y = 0.112;
      stemMesh.renderOrder = 4;
      bodyGroup.add(stemMesh);

      root.add(bodyGroup);
      break;
    }

    case 'water-dispenser': {
      // BÌNH CHỨA NƯỚC CẤT CÓ VAN XẢ ĐỊNH LƯỢNG 1000 ML ĐẶT TRÊN GIÁ ĐỠ CAO + KHAY HỨNG ĐỊNH VỊ DƯỚI VÒI
      // Chân giá đỡ nâng cao y = 0.264 m, đầu vòi xả ở (0.095, 0.252, 0) cao hơn cả miệng Ống đong 100 ml (0.242 m),
      // Bình tràn (0.194 m) và Cốc 250 ml (0.097 m)! Ngay dưới vòi tại (0.095, 0, 0) có Khay Hứng Từ Tính để đặt cốc/ống đong lấy nước!
      addContactShadow(root, 0.088, 0.076);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';
      const glassMat = createGlassMaterial(isSoftwareGl);

      const standElevationY = 0.264; // Height of the upper tank platform (clears 0.242 m graduated cylinder!)

      // 1. Tall Stainless Steel 3-Legged Laboratory Stand (h = 0.264 m) + Integrated Drip Tray Docking Station at x = +0.095 m
      const standMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.30,
        metalness: 0.78,
      });
      const chromeLegMat = new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        roughness: 0.22,
        metalness: 0.88,
      });

      const ringPlat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.057, 0.060, 0.012, 36),
        standMat,
      );
      ringPlat.position.y = standElevationY;
      ringPlat.castShadow = true;
      ringPlat.receiveShadow = true;
      bodyGroup.add(ringPlat);

      const midBraceRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.056, 0.0032, 12, 36),
        standMat,
      );
      midBraceRing.rotation.x = Math.PI / 2;
      midBraceRing.position.y = 0.132;
      bodyGroup.add(midBraceRing);

      const baseRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.060, 0.0042, 12, 36),
        standMat,
      );
      baseRing.rotation.x = Math.PI / 2;
      baseRing.position.y = 0.005;
      bodyGroup.add(baseRing);

      [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].forEach((ang) => {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0048, 0.0052, standElevationY - 0.004, 14),
          chromeLegMat,
        );
        leg.position.set(
          Math.cos(ang) * 0.055,
          standElevationY * 0.5,
          Math.sin(ang) * 0.055,
        );
        leg.castShadow = true;
        bodyGroup.add(leg);

        const foot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.009, 0.006, 14),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 }),
        );
        foot.position.set(Math.cos(ang) * 0.055, 0.003, Math.sin(ang) * 0.055);
        bodyGroup.add(foot);
      });

      // 1B. Integrated Stainless Steel Drip Tray & Glowing Cyan Docking Coaster (`dispenser_dock_tray`) at (0.095, 0, 0)
      const dockBridge = new THREE.Mesh(
        new THREE.BoxGeometry(0.058, 0.004, 0.036),
        standMat,
      );
      dockBridge.position.set(0.064, 0.002, 0);
      dockBridge.receiveShadow = true;
      bodyGroup.add(dockBridge);

      const dripTrayBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.047, 0.0045, 36),
        standMat,
      );
      dripTrayBase.name = 'dispenser_dock_tray';
      dripTrayBase.position.set(0.095, 0.0023, 0);
      dripTrayBase.receiveShadow = true;
      bodyGroup.add(dripTrayBase);

      const dripGrate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.038, 0.0012, 32),
        chromeLegMat,
      );
      dripGrate.position.set(0.095, 0.0048, 0);
      dripGrate.receiveShadow = true;
      bodyGroup.add(dripGrate);

      const dockTargetRing = new THREE.Mesh(
        new THREE.RingGeometry(0.036, 0.043, 36).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({
          color: 0x00bceb,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.88,
        }),
      );
      dockTargetRing.name = 'dispenser_dock_ring';
      dockTargetRing.position.set(0.095, 0.0056, 0);
      bodyGroup.add(dockTargetRing);

      // 2. Graduated Borosilicate Glass Reservoir Carboy (1000 ml, Ø 104 mm)
      const tankGeo = new THREE.CylinderGeometry(0.052, 0.052, 0.142, 36, 1, true);
      const tankMesh = new THREE.Mesh(tankGeo, glassMat);
      tankMesh.position.y = standElevationY + 0.076;
      tankMesh.renderOrder = 4;
      bodyGroup.add(tankMesh);

      const shoulderGeo = new THREE.CylinderGeometry(0.026, 0.052, 0.020, 36);
      const shoulderMesh = new THREE.Mesh(shoulderGeo, glassMat);
      shoulderMesh.position.y = standElevationY + 0.157;
      shoulderMesh.renderOrder = 4;
      bodyGroup.add(shoulderMesh);

      // Blue GL45 Laboratory Screw Cap with air vent
      const capMat = new THREE.MeshStandardMaterial({
        color: 0x1e6bff,
        roughness: 0.28,
        metalness: 0.15,
      });
      const capMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.028, 0.018, 28),
        capMat,
      );
      capMesh.position.y = standElevationY + 0.174;
      capMesh.castShadow = true;
      bodyGroup.add(capMesh);

      // 3. 360° Printed Graduation Scale (`scale_marks`: 100 - 1000 ml)
      const scaleTex = createGraduationCanvasTexture(100, 1000, 100, 'BÌNH CẤP NƯỚC 1000 ml');
      const scaleGeo = new THREE.CylinderGeometry(0.0524, 0.0524, 0.125, 36, 1, true);
      const scaleMat = new THREE.MeshBasicMaterial({
        map: scaleTex,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const scaleMesh = new THREE.Mesh(scaleGeo, scaleMat);
      scaleMesh.name = 'scale_marks';
      scaleMesh.position.y = standElevationY + 0.076;
      scaleMesh.renderOrder = 5;
      root.add(scaleMesh);

      // 4. Dual Front & Rear Digital Flow/Volume Readout LCDs (`scale_display`, `scale_display_rear`)
      const lcdTex = createLcdDisplayTexture('850.0', 'ml');
      const lcdMat = new THREE.MeshBasicMaterial({
        map: lcdTex,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4,
      });
      const lcdFront = new THREE.Mesh(new THREE.PlaneGeometry(0.070, 0.022), lcdMat);
      lcdFront.name = 'scale_display';
      lcdFront.userData.lastText = '850.0';
      lcdFront.position.set(0, standElevationY, 0.061);
      lcdFront.renderOrder = 2;
      root.add(lcdFront);

      const lcdRear = new THREE.Mesh(new THREE.PlaneGeometry(0.070, 0.022), lcdMat);
      lcdRear.name = 'scale_display_rear';
      lcdRear.position.set(0, standElevationY, -0.061);
      lcdRear.rotation.y = Math.PI;
      lcdRear.renderOrder = 2;
      root.add(lcdRear);

      // 5. Elevated Metering Stopcock Valve & Spout Assembly on +X side (nozzle tip at x = 0.095, y = 0.252 m!)
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.22,
        metalness: 0.85,
      });
      const pipeHoriz = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0055, 0.0055, 0.047, 16),
        brassMat,
      );
      pipeHoriz.rotation.z = Math.PI / 2;
      pipeHoriz.position.set(0.0735, standElevationY + 0.016, 0);
      bodyGroup.add(pipeHoriz);

      const nozzleDown = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0050, 0.0036, 0.032, 16),
        brassMat,
      );
      nozzleDown.position.set(0.095, standElevationY + 0.002, 0);
      bodyGroup.add(nozzleDown);

      // Glowing nozzle tip collar
      const nozzleTipRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.0038, 0.0009, 10, 20).rotateX(Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x00bceb }),
      );
      nozzleTipRing.position.set(0.095, standElevationY - 0.014, 0);
      bodyGroup.add(nozzleTipRing);

      // Rotating PTFE/Cyan Metering Valve Handle (`plunger`)
      const valveGroup = new THREE.Group();
      valveGroup.name = 'plunger';
      valveGroup.position.set(0.0735, standElevationY + 0.024, 0);
      const valveStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.004, 0.004, 0.012, 12),
        brassMat,
      );
      valveGroup.add(valveStem);
      const valveLever = new THREE.Mesh(
        new THREE.BoxGeometry(0.030, 0.0055, 0.009),
        new THREE.MeshStandardMaterial({ color: 0x00bceb, roughness: 0.22, metalness: 0.25 }),
      );
      valveLever.position.y = 0.007;
      valveGroup.add(valveLever);
      root.add(valveGroup);

      // 6. Water Column inside 1000 ml Reservoir (`liquid_surface`, base height = 0.062 m at 500 ml)
      const liquidGroup = new THREE.Group();
      liquidGroup.name = 'liquid_surface';
      const waterHeight = 0.062;
      const waterGeo = new THREE.CylinderGeometry(0.050, 0.050, waterHeight, 36);
      waterGeo.translate(0, waterHeight / 2, 0);
      const waterMat = createWaterMaterial('clean-water');
      const waterMesh = new THREE.Mesh(waterGeo, waterMat);
      waterMesh.renderOrder = 2;
      liquidGroup.add(waterMesh);

      addConcaveMeniscusAndRipples(liquidGroup, 0.050, waterHeight, 'clean-water');

      liquidGroup.position.y = standElevationY + 0.006;
      root.add(liquidGroup);

      // 7. Multi-Layer Laminar Water Stream from Elevated Valve Nozzle (`spout_stream` from y = 0.250 m down into receiving vessel)
      // Strictly hidden (`visible = false`) unless valve is actively open!
      const streamGroup = new THREE.Group();
      streamGroup.name = 'spout_stream';
      const streamLen = 0.212;
      const streamMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0028, 0.0040, streamLen, 18),
        createStreamMaterial(0x38bdf8, 0.90),
      );
      streamMesh.name = 'stream_outer';
      streamMesh.position.set(0.095, standElevationY - 0.014 - streamLen * 0.5, 0);
      streamMesh.renderOrder = 5;
      streamGroup.add(streamMesh);

      const streamCore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0014, 0.0020, streamLen, 12),
        new THREE.MeshBasicMaterial({
          color: 0xe0f2fe,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
        }),
      );
      streamCore.name = 'stream_core';
      streamCore.position.set(0.095, standElevationY - 0.014 - streamLen * 0.5, 0);
      streamCore.renderOrder = 6;
      streamGroup.add(streamCore);

      const dispDropGeo = new THREE.SphereGeometry(0.0028, 12, 12);
      const dispDropMat = createStreamMaterial(0x7dd3fc, 0.94);
      for (let d = 0; d < 6; d++) {
        const drop = new THREE.Mesh(dispDropGeo, dispDropMat);
        drop.name = `droplet_${d}`;
        drop.position.set(0.095, standElevationY - 0.024 - d * 0.034, 0);
        drop.scale.set(0.85, 1.45, 0.85);
        drop.renderOrder = 6;
        streamGroup.add(drop);
      }

      for (let r = 0; r < 2; r++) {
        const splashDisc = new THREE.Mesh(
          new THREE.RingGeometry(0.004 + r * 0.005, 0.009 + r * 0.007, 24).rotateX(-Math.PI / 2),
          new THREE.MeshBasicMaterial({
            color: r === 0 ? 0xe0f2fe : 0x7dd3fc,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.90 - r * 0.25,
            depthWrite: false,
          }),
        );
        splashDisc.name = `splash_ring_${r}`;
        splashDisc.position.set(0.095, 0.038 + r * 0.001, 0);
        splashDisc.renderOrder = 6;
        streamGroup.add(splashDisc);
      }

      streamGroup.visible = false;
      root.add(streamGroup);

      const anchor = new THREE.Object3D();
      anchor.name = 'measurement_anchor';
      anchor.position.set(0.095, standElevationY - 0.014, 0);
      root.add(anchor);

      root.add(bodyGroup);
      break;
    }

    case 'optical-bench': {
      addContactShadow(root, 0.46, 0.055);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const aluminumMat = new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        roughness: 0.28,
        metalness: 0.78,
      });
      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.16,
        metalness: 0.92,
      });
      const darkAnodizedMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.42,
        metalness: 0.62,
      });
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85,
      });

      const railLengthM = 0.90;
      // 1. Extruded Aluminum Rail Beam
      const railBeam = new THREE.Mesh(
        new THREE.BoxGeometry(railLengthM, 0.016, 0.034),
        aluminumMat,
      );
      railBeam.position.set(0, 0.017, 0);
      railBeam.castShadow = true;
      railBeam.receiveShadow = true;
      bodyGroup.add(railBeam);

      // 2. Top Chrome Guide Ridge
      const guideRidge = new THREE.Mesh(
        new THREE.BoxGeometry(railLengthM, 0.004, 0.014),
        chromeMat,
      );
      guideRidge.position.set(0, 0.027, 0);
      bodyGroup.add(guideRidge);

      // 3. Front & Rear Metric Ruler Strips (-45 cm .. 0 .. +45 cm)
      const rulerTex = createOpticalBenchRulerTexture();
      const rulerMat = new THREE.MeshBasicMaterial({ map: rulerTex });
      const frontRuler = new THREE.Mesh(
        new THREE.PlaneGeometry(railLengthM, 0.013),
        rulerMat,
      );
      frontRuler.position.set(0, 0.017, 0.0173);
      bodyGroup.add(frontRuler);

      const rearRuler = new THREE.Mesh(
        new THREE.PlaneGeometry(railLengthM, 0.013).rotateY(Math.PI),
        rulerMat,
      );
      rearRuler.position.set(0, 0.017, -0.0173);
      bodyGroup.add(rearRuler);

      // 4. Center O = 0 cm fiducial marker on top of rail
      const zeroMarker = new THREE.Mesh(
        new THREE.BoxGeometry(0.0025, 0.0048, 0.035),
        new THREE.MeshBasicMaterial({ color: 0xdc2626 }),
      );
      zeroMarker.position.set(0, 0.0272, 0);
      bodyGroup.add(zeroMarker);

      // 5. Left & Right End-Support Pillars + Brass Leveling Feet
      [-railLengthM / 2 + 0.018, railLengthM / 2 - 0.018].forEach((endX) => {
        const pillar = new THREE.Mesh(
          new THREE.BoxGeometry(0.032, 0.028, 0.068),
          darkAnodizedMat,
        );
        pillar.position.set(endX, 0.014, 0);
        pillar.castShadow = true;
        bodyGroup.add(pillar);

        [-0.028, 0.028].forEach((fz) => {
          const brassFoot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.0085, 0.010, 0.006, 16),
            brassMat,
          );
          brassFoot.position.set(endX, 0.003, fz);
          bodyGroup.add(brassFoot);
        });
      });

      // 6. Dashed 3D Optical Axis reference line along y = OPTICAL_BENCH_AXIS_Y (-0.44 m .. +0.44 m)
      const axisGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.44, OPTICAL_BENCH_AXIS_Y, 0),
        new THREE.Vector3(0.44, OPTICAL_BENCH_AXIS_Y, 0),
      ]);
      const axisLine = new THREE.Line(
        axisGeom,
        new THREE.LineDashedMaterial({
          color: 0x94a3b8,
          dashSize: 0.008,
          gapSize: 0.006,
          transparent: true,
          opacity: 0.45,
        }),
      );
      axisLine.computeLineDistances();
      axisLine.name = 'optical_axis_line';
      bodyGroup.add(axisLine);

      const anchor = new THREE.Object3D();
      anchor.name = 'measurement_anchor';
      anchor.position.set(0, OPTICAL_BENCH_AXIS_Y, 0);
      root.add(anchor);

      root.add(bodyGroup);
      break;
    }

    case 'optical-lamp': {
      addContactShadow(root, 0.055, 0.048);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const darkAnodizedMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.38,
        metalness: 0.65,
      });
      const lampHousingMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.48,
        metalness: 0.55,
      });
      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.18,
        metalness: 0.90,
      });
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85,
      });

      // 1. Rider saddle: Trụ kim loại kết thúc chính xác ở đáy thân đèn (y = 0.071 m)
      bodyGroup.add(buildOpticalRiderSaddle(chromeMat, darkAnodizedMat, brassMat, 0.071));

      // 2. Cylindrical Halogen Lamp Housing centered at OPTICAL_BENCH_AXIS_Y (0.095 m)
      const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.024, 0.072, 24).rotateZ(Math.PI / 2),
        lampHousingMat,
      );
      barrel.position.set(-0.010, OPTICAL_BENCH_AXIS_Y, 0);
      barrel.castShadow = true;
      bodyGroup.add(barrel);

      // Rear cooling fins + power cord entry (-X side)
      [-0.040, -0.034, -0.028].forEach((fx) => {
        const fin = new THREE.Mesh(
          new THREE.CylinderGeometry(0.026, 0.026, 0.0025, 24).rotateZ(Math.PI / 2),
          darkAnodizedMat,
        );
        fin.position.set(fx, OPTICAL_BENCH_AXIS_Y, 0);
        bodyGroup.add(fin);
      });

      const cordSocket = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.006, 0.012, 12).rotateZ(Math.PI / 2),
        brassMat,
      );
      cordSocket.position.set(-0.049, OPTICAL_BENCH_AXIS_Y - 0.008, 0);
      cordSocket.name = 'power_cord_socket';
      bodyGroup.add(cordSocket);

      // 2B. Red (+) and Black (-) Banana Binding Posts on Lamp Housing (-X side)
      const redPostMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.35,
        metalness: 0.3,
      });
      const blackPostMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.35,
        metalness: 0.4,
      });

      const lampPosPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0055, 0.0055, 0.014, 16).rotateZ(Math.PI / 2),
        redPostMat,
      );
      lampPosPost.position.set(-0.046, OPTICAL_BENCH_AXIS_Y - 0.008, 0.018);
      lampPosPost.name = 'terminal_pos';
      lampPosPost.userData.interactiveTerminal = true;
      lampPosPost.userData.terminalPolarity = 'pos';
      lampPosPost.userData.terminalLabel = 'Chốt Đỏ (+) Đèn Chiếu Sáng';
      bodyGroup.add(lampPosPost);

      const lampNegPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0055, 0.0055, 0.014, 16).rotateZ(Math.PI / 2),
        blackPostMat,
      );
      lampNegPost.position.set(-0.046, OPTICAL_BENCH_AXIS_Y - 0.008, -0.018);
      lampNegPost.name = 'terminal_neg';
      lampNegPost.userData.interactiveTerminal = true;
      lampNegPost.userData.terminalPolarity = 'neg';
      lampNegPost.userData.terminalLabel = 'Chốt Đen (-) Đèn Chiếu Sáng';
      bodyGroup.add(lampNegPost);

      // Large interactive collision hitboxes (radius 2.8 cm) for effortless mouse targeting without overlapping
      const lampPosHitbox = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 14, 14),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      );
      lampPosHitbox.position.set(-0.046, OPTICAL_BENCH_AXIS_Y - 0.008, 0.018);
      lampPosHitbox.name = 'terminal_pos_hitbox';
      lampPosHitbox.userData.interactiveTerminal = true;
      lampPosHitbox.userData.terminalPolarity = 'pos';
      lampPosHitbox.userData.terminalLabel = 'Chốt Đỏ (+) Đèn Chiếu Sáng';
      bodyGroup.add(lampPosHitbox);

      const lampNegHitbox = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 14, 14),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      );
      lampNegHitbox.position.set(-0.046, OPTICAL_BENCH_AXIS_Y - 0.008, -0.018);
      lampNegHitbox.name = 'terminal_neg_hitbox';
      lampNegHitbox.userData.interactiveTerminal = true;
      lampNegHitbox.userData.terminalPolarity = 'neg';
      lampNegHitbox.userData.terminalLabel = 'Chốt Đen (-) Đèn Chiếu Sáng';
      bodyGroup.add(lampNegHitbox);

      // Brass terminal core sockets
      [0.018, -0.018].forEach((pz) => {
        const brassHole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.0022, 0.0022, 0.004, 12).rotateZ(Math.PI / 2),
          brassMat,
        );
        brassHole.position.set(-0.0535, OPTICAL_BENCH_AXIS_Y - 0.008, pz);
        bodyGroup.add(brassHole);
      });

      // 2C. Rotary Beam Mode Selector Knob on Top of Lamp (Núm chọn 1, 2, 3 tia sáng & F)
      const knobGroup = new THREE.Group();
      knobGroup.name = 'beam_mode_knob';
      knobGroup.position.set(0.016, OPTICAL_BENCH_AXIS_Y + 0.024, 0);
      knobGroup.userData.opticalInteractiveAction = 'cycle-lamp-beam-mode';
      knobGroup.userData.interactiveKnob = true;

      const knobCyl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.011, 0.012, 0.012, 20),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.35, metalness: 0.65 }),
      );
      knobCyl.userData.opticalInteractiveAction = 'cycle-lamp-beam-mode';
      knobGroup.add(knobCyl);

      const knobPointer = new THREE.Mesh(
        new THREE.BoxGeometry(0.003, 0.003, 0.009),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
      );
      knobPointer.position.set(0, 0.006, 0.006);
      knobPointer.userData.opticalInteractiveAction = 'cycle-lamp-beam-mode';
      knobGroup.add(knobPointer);

      // Dedicated ergonomic hitbox (radius 2.4 cm) for the rotary knob, perfectly avoiding rear terminals
      const knobHitbox = new THREE.Mesh(
        new THREE.SphereGeometry(0.024, 12, 12),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      );
      knobHitbox.name = 'knob_hitbox_3d';
      knobHitbox.userData.opticalInteractiveAction = 'cycle-lamp-beam-mode';
      knobGroup.add(knobHitbox);

      bodyGroup.add(knobGroup);

      // 3. Front Condenser Snout + Slit Aperture Holder (+X side, clickable to cycle beam mode)
      const snout = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.022, 0.020, 20).rotateZ(Math.PI / 2),
        darkAnodizedMat,
      );
      snout.position.set(0.034, OPTICAL_BENCH_AXIS_Y, 0);
      snout.userData.opticalInteractiveAction = 'cycle-lamp-beam-mode';
      bodyGroup.add(snout);

      const slitHolder = new THREE.Mesh(
        new THREE.BoxGeometry(0.005, 0.044, 0.044),
        brassMat,
      );
      slitHolder.position.set(0.045, OPTICAL_BENCH_AXIS_Y, 0);
      slitHolder.userData.opticalInteractiveAction = 'cycle-lamp-beam-mode';
      bodyGroup.add(slitHolder);

      const slitTex = createLampSlitCanvasTexture(false, 'triple', 'laser_rays');
      const slitPlate = new THREE.Mesh(
        new THREE.PlaneGeometry(0.040, 0.040).rotateY(Math.PI / 2),
        new THREE.MeshBasicMaterial({ map: slitTex }),
      );
      slitPlate.name = 'scale_display';
      slitPlate.userData.lastKey = '0:laser_rays:triple:0.0';
      slitPlate.userData.opticalInteractiveAction = 'cycle-lamp-beam-mode';
      slitPlate.position.set(0.048, OPTICAL_BENCH_AXIS_Y, 0);
      bodyGroup.add(slitPlate);

      // 4. Warm halogen PointLight at the lamp aperture (ban đầu 0 khi chưa có điện - P02)
      const lampLight = new THREE.PointLight(0xffedd5, 0.0, 0.45, 1.8);
      lampLight.name = 'lamp_point_light';
      lampLight.position.set(0.055, OPTICAL_BENCH_AXIS_Y, 0);
      root.add(lampLight);

      const anchor = new THREE.Object3D();
      anchor.name = 'measurement_anchor';
      anchor.position.set(0.048, OPTICAL_BENCH_AXIS_Y, 0);
      root.add(anchor);

      root.add(bodyGroup);
      break;
    }

    case 'frosted-f-object': {
      addContactShadow(root, 0.042, 0.045);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const darkAnodizedMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.38,
        metalness: 0.65,
      });
      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.18,
        metalness: 0.90,
      });
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85,
      });

      // 1. Rider saddle: Trụ kim loại kết thúc chính xác ở đáy khung vuông (y = 0.057 m)
      bodyGroup.add(buildOpticalRiderSaddle(chromeMat, darkAnodizedMat, brassMat, 0.057));

      const frameCradle = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 0.006, 0.024),
        darkAnodizedMat,
      );
      frameCradle.position.set(0, 0.057, 0);
      frameCradle.castShadow = true;
      bodyGroup.add(frameCradle);

      // 2. Matte black square frame at OPTICAL_BENCH_AXIS_Y (0.095 m)
      const plateFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.0045, 0.076, 0.076),
        darkAnodizedMat,
      );
      plateFrame.position.set(0, OPTICAL_BENCH_AXIS_Y, 0);
      plateFrame.castShadow = true;
      bodyGroup.add(plateFrame);

      // 3. Dual-sided Frosted Glass Letter F Disc (mặc định mờ unlit khi chưa có đèn chiếu - P02)
      const fTex = createFrostedFObjectCanvasTexture(false);
      const fMat = new THREE.MeshBasicMaterial({
        map: fTex,
        transparent: true,
      });

      const frontDisc = new THREE.Mesh(
        new THREE.CircleGeometry(0.032, 36).rotateY(Math.PI / 2),
        fMat,
      );
      frontDisc.name = 'scale_display';
      frontDisc.userData.lastPowered = true;
      frontDisc.position.set(0.0026, OPTICAL_BENCH_AXIS_Y, 0);
      bodyGroup.add(frontDisc);

      const rearDisc = new THREE.Mesh(
        new THREE.CircleGeometry(0.032, 36).rotateY(-Math.PI / 2),
        fMat,
      );
      rearDisc.name = 'scale_display_rear';
      rearDisc.position.set(-0.0026, OPTICAL_BENCH_AXIS_Y, 0);
      bodyGroup.add(rearDisc);

      const anchor = new THREE.Object3D();
      anchor.name = 'measurement_anchor';
      anchor.position.set(0, OPTICAL_BENCH_AXIS_Y, 0);
      root.add(anchor);

      root.add(bodyGroup);
      break;
    }

    case 'optical-screen': {
      addContactShadow(root, 0.045, 0.055);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const darkAnodizedMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.38,
        metalness: 0.65,
      });
      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.18,
        metalness: 0.90,
      });
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85,
      });

      // 1. Rider saddle: Trụ đỡ từ đế kết thúc ở mép đáy dưới của màn (y = 0.042 m)
      // TUYỆT ĐỐI không vươn cao che mất phần giữa của màn hứng ảnh!
      bodyGroup.add(buildOpticalRiderSaddle(chromeMat, darkAnodizedMat, brassMat, 0.042));

      // Ngàm kẹp giữ mép đáy màn chắn (ở đáy và sau lưng, không lồi ra trước mặt màn)
      const bottomClamp = new THREE.Mesh(
        new THREE.BoxGeometry(0.008, 0.006, 0.038),
        darkAnodizedMat,
      );
      bottomClamp.position.set(0.001, 0.042, 0);
      bottomClamp.castShadow = true;
      bodyGroup.add(bottomClamp);

      // Gân tăng cứng phía sau màn chắn (+X) để màn đứng vững, không che mặt trước hứng ảnh
      const rearRib = new THREE.Mesh(
        new THREE.BoxGeometry(0.0035, 0.055, 0.008),
        darkAnodizedMat,
      );
      rearRib.position.set(0.004, 0.070, 0);
      bodyGroup.add(rearRib);

      // 2. Dark anodized backing plate at OPTICAL_BENCH_AXIS_Y (0.095 m)
      const backing = new THREE.Mesh(
        new THREE.BoxGeometry(0.0045, 0.106, 0.106),
        darkAnodizedMat,
      );
      backing.position.set(0, OPTICAL_BENCH_AXIS_Y, 0);
      backing.castShadow = true;
      bodyGroup.add(backing);

      // 3. Dynamic Projection Screen Canvas on -X side (facing lens) and +X side
      const screenTex = createOpticalScreenCanvasTexture({
        isPoweredOn: true,
        experimentMode: 'f_object',
        beamMode: 'f_rays',
        lensProfileId: 'conv_10',
        focalLengthCm: 10,
        objectDistanceDCm: 20,
        screenDistanceCm: 20,
        projectedImageDPrimeCm: 20,
        projectedImageMag: -1,
        projectedImageType: 'real',
        rayOffsetYCm: 0,
        rayAngleDeg: 0,
      });
      const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });

      const screenFront = new THREE.Mesh(
        new THREE.PlaneGeometry(0.102, 0.102).rotateY(-Math.PI / 2),
        screenMat,
      );
      screenFront.name = 'scale_display';
      screenFront.userData.lastScreenKey = 'init';
      screenFront.position.set(-0.0026, OPTICAL_BENCH_AXIS_Y, 0);
      bodyGroup.add(screenFront);

      const screenRear = new THREE.Mesh(
        new THREE.PlaneGeometry(0.102, 0.102).rotateY(Math.PI / 2),
        screenMat,
      );
      screenRear.name = 'scale_display_rear';
      screenRear.position.set(0.0026, OPTICAL_BENCH_AXIS_Y, 0);
      bodyGroup.add(screenRear);

      const anchor = new THREE.Object3D();
      anchor.name = 'measurement_anchor';
      anchor.position.set(0, OPTICAL_BENCH_AXIS_Y, 0);
      root.add(anchor);

      root.add(bodyGroup);
      break;
    }

    case 'optical-power-supply': {
      addContactShadow(root, 0.075, 0.062);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const caseMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.42,
        metalness: 0.45,
      });
      const darkHoodMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.55,
        metalness: 0.4,
      });
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85,
      });

      // 1. Main chassis box (13.5 cm × 7.6 cm × 10.5 cm) + dark top hood
      const chassis = new THREE.Mesh(
        new THREE.BoxGeometry(0.135, 0.076, 0.105),
        caseMat,
      );
      chassis.position.set(0, 0.040, 0);
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      bodyGroup.add(chassis);

      const topHood = new THREE.Mesh(
        new THREE.BoxGeometry(0.139, 0.008, 0.109),
        darkHoodMat,
      );
      topHood.position.set(0, 0.080, 0);
      bodyGroup.add(topHood);

      // 4 rubber feet
      [
        [-0.056, -0.040],
        [0.056, -0.040],
        [-0.056, 0.040],
        [0.056, 0.040],
      ].forEach(([fx, fz]) => {
        const foot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.007, 0.008, 0.005, 14),
          darkHoodMat,
        );
        foot.position.set(fx, 0.0025, fz);
        bodyGroup.add(foot);
      });

      // 2. Front Panel Label & Digital Readout (`scale_display`)
      const panelTex = createPowerSupplyPanelCanvasTexture(true, 6.0);
      const panelMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.128, 0.070),
        new THREE.MeshBasicMaterial({ map: panelTex }),
      );
      panelMesh.name = 'scale_display';
      panelMesh.userData.lastKey = '1:6.0';
      panelMesh.position.set(0, 0.040, 0.0532);
      bodyGroup.add(panelMesh);

      // 3. Front Red Rocker Switch (`toggle_switch`) + Top Illuminated ON/OFF Push Switch (`plunger`)
      const frontSwitchHousing = new THREE.Mesh(
        new THREE.BoxGeometry(0.015, 0.022, 0.008),
        darkHoodMat,
      );
      frontSwitchHousing.position.set(-0.042, 0.025, 0.055);
      frontSwitchHousing.userData.opticalInteractiveAction = 'toggle-psu-power';
      bodyGroup.add(frontSwitchHousing);

      const frontRocker = new THREE.Mesh(
        new THREE.BoxGeometry(0.011, 0.015, 0.011),
        new THREE.MeshStandardMaterial({
          color: 0xef4444,
          emissive: 0xef4444,
          emissiveIntensity: 0.45,
          roughness: 0.3,
        }),
      );
      frontRocker.name = 'toggle_switch';
      frontRocker.position.set(-0.042, 0.025, 0.059);
      frontRocker.rotation.x = -0.25;
      frontRocker.userData.opticalInteractiveAction = 'toggle-psu-power';
      bodyGroup.add(frontRocker);

      const switchBezel = new THREE.Mesh(
        new THREE.BoxGeometry(0.046, 0.006, 0.030),
        darkHoodMat,
      );
      switchBezel.position.set(-0.032, 0.085, 0.012);
      switchBezel.userData.opticalInteractiveAction = 'toggle-psu-power';
      bodyGroup.add(switchBezel);

      const switchCap = new THREE.Mesh(
        new THREE.BoxGeometry(0.038, 0.011, 0.022),
        new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          emissiveIntensity: 0.55,
          roughness: 0.25,
        }),
      );
      switchCap.name = 'plunger';
      switchCap.position.set(-0.032, 0.090, 0.012);
      switchCap.userData.opticalInteractiveAction = 'toggle-psu-power';
      bodyGroup.add(switchCap);

      // 4. Rotary Voltage Selector Knob (`handle`) + yellow pointer + LED status light (`led_indicator`)
      const knobGroup = new THREE.Group();
      knobGroup.name = 'handle';
      knobGroup.position.set(0.002, 0.025, 0.058);
      knobGroup.userData.opticalInteractiveAction = 'cycle-psu-voltage';

      const knobCylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.014, 0.014, 24).rotateX(Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.6 }),
      );
      knobCylinder.userData.opticalInteractiveAction = 'cycle-psu-voltage';
      knobGroup.add(knobCylinder);

      const knobPointer = new THREE.Mesh(
        new THREE.BoxGeometry(0.0025, 0.009, 0.004),
        new THREE.MeshBasicMaterial({ color: 0xfacc15 }),
      );
      knobPointer.position.set(0, 0.006, 0.007);
      knobPointer.userData.opticalInteractiveAction = 'cycle-psu-voltage';
      knobGroup.add(knobPointer);

      bodyGroup.add(knobGroup);

      const ledIndicator = new THREE.Mesh(
        new THREE.SphereGeometry(0.0038, 14, 14),
        new THREE.MeshStandardMaterial({
          color: 0x22c55e,
          emissive: 0x22c55e,
          emissiveIntensity: 1.1,
        }),
      );
      ledIndicator.name = 'led_indicator';
      ledIndicator.position.set(-0.042, 0.048, 0.055);
      bodyGroup.add(ledIndicator);

      // 5. Red (+) and Black (-) Output Binding Posts
      const redPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.014, 16).rotateX(Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 }),
      );
      redPost.name = 'terminal_pos';
      redPost.userData.interactiveTerminal = true;
      redPost.userData.terminalPolarity = 'pos';
      redPost.userData.terminalLabel = 'Chốt Đỏ (+) Nguồn Điện 12V';
      redPost.position.set(0.036, 0.020, 0.059);
      bodyGroup.add(redPost);

      const bluePost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.014, 16).rotateX(Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.3 }),
      );
      bluePost.name = 'terminal_neg';
      bluePost.userData.interactiveTerminal = true;
      bluePost.userData.terminalPolarity = 'neg';
      bluePost.userData.terminalLabel = 'Chốt Đen (-) Nguồn Điện 12V';
      bluePost.position.set(0.053, 0.020, 0.059);
      bodyGroup.add(bluePost);

      // Large interactive collision hitboxes (radius 2.6 cm) for effortless mouse targeting without overlapping
      const psuPosHitbox = new THREE.Mesh(
        new THREE.SphereGeometry(0.026, 14, 14),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      );
      psuPosHitbox.position.set(0.036, 0.020, 0.059);
      psuPosHitbox.name = 'terminal_pos_hitbox';
      psuPosHitbox.userData.interactiveTerminal = true;
      psuPosHitbox.userData.terminalPolarity = 'pos';
      psuPosHitbox.userData.terminalLabel = 'Chốt Đỏ (+) Nguồn Điện 12V';
      bodyGroup.add(psuPosHitbox);

      const psuNegHitbox = new THREE.Mesh(
        new THREE.SphereGeometry(0.026, 14, 14),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      );
      psuNegHitbox.position.set(0.053, 0.020, 0.059);
      psuNegHitbox.name = 'terminal_neg_hitbox';
      psuNegHitbox.userData.interactiveTerminal = true;
      psuNegHitbox.userData.terminalPolarity = 'neg';
      psuNegHitbox.userData.terminalLabel = 'Chốt Đen (-) Nguồn Điện 12V';
      bodyGroup.add(psuNegHitbox);

      const brassTipPos = new THREE.Mesh(
        new THREE.CylinderGeometry(0.002, 0.002, 0.004, 12).rotateX(Math.PI / 2),
        brassMat,
      );
      brassTipPos.position.set(0.036, 0.020, 0.067);
      bodyGroup.add(brassTipPos);

      const brassTipNeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.002, 0.002, 0.004, 12).rotateX(Math.PI / 2),
        brassMat,
      );
      brassTipNeg.position.set(0.053, 0.020, 0.067);
      bodyGroup.add(brassTipNeg);

      const anchor = new THREE.Object3D();
      anchor.name = 'measurement_anchor';
      anchor.position.set(0, 0.090, 0);
      root.add(anchor);

      root.add(bodyGroup);
      break;
    }

    case 'optical-lens-box': {
      addContactShadow(root, 0.125, 0.050);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const woodMat = new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.45,
        metalness: 0.10,
      });
      const velvetMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.9,
        metalness: 0.02,
      });
      const darkRimMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.38,
        metalness: 0.65,
      });
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85,
      });
      const glassMat = createGlassMaterial(isSoftwareGl);

      // 1. Wooden Case Base + Velvet Liner (24 cm × 2.8 cm × 8.8 cm) + 2 Front Brass Clasps
      const woodBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.026, 0.088),
        woodMat,
      );
      woodBase.position.set(0, 0.013, 0);
      woodBase.castShadow = true;
      woodBase.receiveShadow = true;
      bodyGroup.add(woodBase);

      const velvetTray = new THREE.Mesh(
        new THREE.BoxGeometry(0.228, 0.006, 0.076),
        velvetMat,
      );
      velvetTray.position.set(0, 0.025, 0);
      bodyGroup.add(velvetTray);

      [-0.072, 0.072].forEach((cx) => {
        const clasp = new THREE.Mesh(
          new THREE.BoxGeometry(0.014, 0.009, 0.003),
          brassMat,
        );
        clasp.position.set(cx, 0.013, 0.045);
        bodyGroup.add(clasp);
      });

      // Front Brass Plaque
      const plaqueTex = createLensBoxPlaqueCanvasTexture();
      const plaqueMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.130, 0.017),
        new THREE.MeshBasicMaterial({ map: plaqueTex }),
      );
      plaqueMesh.position.set(0, 0.013, 0.0446);
      bodyGroup.add(plaqueMesh);

      // 2. 6 Slotted Lenses (+5, +10, +15, -10, -20, ∞) standing in velvet grooves with brass slot holders
      const slotProfiles: OpticalLensSpec['id'][] = [
        'conv_5',
        'conv_10',
        'conv_15',
        'div_10',
        'div_20',
        'flat_inf',
      ];
      slotProfiles.forEach((pid, idx) => {
        const spec = OPTICAL_LENS_SPECS[pid];
        const slotX = -0.088 + idx * 0.0352;

        // Groove slot in velvet + brass slot cradle
        const groove = new THREE.Mesh(
          new THREE.BoxGeometry(0.008, 0.005, 0.062),
          new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.95 }),
        );
        groove.position.set(slotX, 0.027, 0);
        groove.userData.opticalLensSlotId = pid;
        bodyGroup.add(groove);

        const brassCradle = new THREE.Mesh(
          new THREE.BoxGeometry(0.012, 0.005, 0.056),
          brassMat,
        );
        brassCradle.position.set(slotX, 0.0285, 0);
        brassCradle.userData.opticalLensSlotId = pid;
        bodyGroup.add(brassCradle);

        const slotLensGroup = new THREE.Group();
        slotLensGroup.name = `slot_${pid}`;
        slotLensGroup.position.set(slotX, 0.052, 0);
        slotLensGroup.userData.opticalLensSlotId = pid;

        const rim = new THREE.Mesh(
          new THREE.TorusGeometry(0.024, 0.0028, 14, 28).rotateY(Math.PI / 2),
          darkRimMat,
        );
        rim.userData.opticalLensSlotId = pid;
        slotLensGroup.add(rim);

        const glass = new THREE.Mesh(
          createProfileOpticalLensGeometry(pid, 0.022),
          glassMat,
        );
        glass.userData.opticalLensSlotId = pid;
        slotLensGroup.add(glass);

        const tagTex = createLensHeadTagCanvasTexture(spec.codeLabel, spec.type);
        const tag = new THREE.Mesh(
          new THREE.BoxGeometry(0.004, 0.010, 0.024),
          new THREE.MeshBasicMaterial({ map: tagTex }),
        );
        tag.position.set(0, 0.029, 0);
        tag.userData.opticalLensSlotId = pid;
        slotLensGroup.add(tag);

        // Default conv_10 is mounted on the optical bench holder, so hide its slot when active
        slotLensGroup.visible = pid !== 'conv_10';
        bodyGroup.add(slotLensGroup);
      });

      const anchor = new THREE.Object3D();
      anchor.name = 'measurement_anchor';
      anchor.position.set(0, 0.065, 0);
      root.add(anchor);

      root.add(bodyGroup);
      break;
    }

    case 'lever-balance-apparatus': {
      addContactShadow(root, 0.18, 0.11);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.75,
        metalness: 0.35,
      });
      const steelMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.25,
        metalness: 0.85,
      });
      const aluMat = new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        roughness: 0.30,
        metalness: 0.65,
      });
      const brassMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.30,
        metalness: 0.85,
      });

      // 1. Đế gang đúc nặng 2 tầng bo góc vát mép chuẩn cơ khí KHTN 8 đặt bàn y = 0
      const baseLower = new THREE.Mesh(
        new THREE.BoxGeometry(0.170, 0.010, 0.120),
        baseMat,
      );
      baseLower.position.set(0, 0.005, 0);
      baseLower.castShadow = true;
      baseLower.receiveShadow = true;
      bodyGroup.add(baseLower);

      const baseUpper = new THREE.Mesh(
        new THREE.BoxGeometry(0.140, 0.008, 0.090),
        baseMat,
      );
      baseUpper.position.set(0, 0.014, 0);
      baseUpper.castShadow = true;
      bodyGroup.add(baseUpper);

      // 4 Đệm cao su cân bằng chống trượt ở 4 góc đế
      const footGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.004, 16);
      const rubberMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 });
      [
        [-0.070, -0.048],
        [0.070, -0.048],
        [-0.070, 0.048],
        [0.070, 0.048],
      ].forEach(([fx, fz]) => {
        const foot = new THREE.Mesh(footGeo, rubberMat);
        foot.position.set(fx, 0.002, fz);
        bodyGroup.add(foot);
      });

      // 2. Trụ đứng thép không gỉ Ø14 mm cao 280 mm
      const colMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.007, 0.007, 0.280, 32),
        steelMat,
      );
      colMesh.position.set(0, 0.150, 0);
      colMesh.castShadow = true;
      bodyGroup.add(colMesh);

      // 3. Trục quay trung tâm & Đĩa chia độ 360° Hartmann
      const hubCenterY = 0.260;
      const hubMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.024, 0.012, 32).rotateX(Math.PI / 2),
        baseMat,
      );
      hubMesh.position.set(0, hubCenterY, 0);
      bodyGroup.add(hubMesh);

      const protractorTex = createHartmannProtractorTexture();
      const dialMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.042, 0.002, 48).rotateX(Math.PI / 2),
        new THREE.MeshStandardMaterial({
          map: protractorTex,
          roughness: 0.25,
          metalness: 0.15,
        }),
      );
      dialMesh.name = 'scale_display';
      dialMesh.position.set(0, hubCenterY, 0.007);
      bodyGroup.add(dialMesh);

      // 4. Thanh đòn bẩy quay quanh trục Z (plunger)
      const leverGroup = new THREE.Group();
      leverGroup.name = 'plunger';
      leverGroup.position.set(0, hubCenterY, 0.014);

      const armMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.380, 0.014, 0.006),
        aluMat,
      );
      armMesh.castShadow = true;
      leverGroup.add(armMesh);

      // Thước chia vạch laser đối xứng (-18..0..+18 cm) ép mặt trước thanh đòn bẩy
      const leverRulerTex = createLeverArmRulerTexture();
      const leverRulerMat = new THREE.MeshBasicMaterial({
        map: leverRulerTex,
        side: THREE.DoubleSide,
      });
      const rulerPlate = new THREE.Mesh(
        new THREE.PlaneGeometry(0.368, 0.0135),
        leverRulerMat,
      );
      rulerPlate.position.set(0, 0, 0.0035);
      leverGroup.add(rulerPlate);

      // Ốc vi chỉnh cân bằng đối trọng đồng thau có khía nhám 2 đầu thanh
      [-0.185, 0.185].forEach((tx) => {
        const nutMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 0.014, 24).rotateZ(Math.PI / 2),
          brassMat,
        );
        nutMesh.position.set(tx, 0, 0);
        leverGroup.add(nutMesh);

        // Vòng khía nhám chống trượt
        const knurlGeo = new THREE.TorusGeometry(0.0082, 0.0009, 8, 24);
        knurlGeo.rotateY(Math.PI / 2);
        const knurl1 = new THREE.Mesh(knurlGeo, brassMat);
        knurl1.position.set(tx - 0.003, 0, 0);
        leverGroup.add(knurl1);
        const knurl2 = new THREE.Mesh(knurlGeo, brassMat);
        knurl2.position.set(tx + 0.003, 0, 0);
        leverGroup.add(knurl2);
      });

      // 18 Móc treo đối xứng (9 móc mỗi bên) cách nhau 20 mm có khuyên móc đồng thau
      const pinGeo = new THREE.CylinderGeometry(0.0012, 0.0012, 0.007, 12);
      const hookLoopGeo = new THREE.TorusGeometry(0.0028, 0.0008, 8, 16, Math.PI * 1.35);
      hookLoopGeo.rotateZ(Math.PI / 2);

      for (let i = 1; i <= 9; i++) {
        const dx = i * 0.020;
        // Trái
        const pinL = new THREE.Mesh(pinGeo, brassMat);
        pinL.position.set(-dx, -0.010, 0);
        leverGroup.add(pinL);
        const loopL = new THREE.Mesh(hookLoopGeo, brassMat);
        loopL.position.set(-dx, -0.014, 0);
        leverGroup.add(loopL);

        // Phải
        const pinR = new THREE.Mesh(pinGeo, brassMat);
        pinR.position.set(dx, -0.010, 0);
        leverGroup.add(pinR);
        const loopR = new THREE.Mesh(hookLoopGeo, brassMat);
        loopR.position.set(dx, -0.014, 0);
        leverGroup.add(loopR);
      }

      bodyGroup.add(leverGroup);

      const anchor = new THREE.Object3D();
      anchor.name = 'measurement_anchor';
      anchor.position.set(0, hubCenterY, 0);
      root.add(anchor);

      root.add(bodyGroup);
      break;
    }

    case 'communicating-vessels-3way': {
      addContactShadow(root, 0.16, 0.08);
      const bodyGroup = new THREE.Group();
      bodyGroup.name = 'body';

      const plasticMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.65,
        metalness: 0.25,
      });
      const glassMat = createGlassMaterial(isSoftwareGl);
      const waterMat = createWaterMaterial('clean-water');

      // 1. Đế nhựa đúc ABS phòng thí nghiệm chống lật (vát mép chamfer chuẩn)
      const baseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.165, 0.014, 0.055),
        plasticMat,
      );
      baseMesh.position.set(0, 0.007, 0);
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      bodyGroup.add(baseMesh);

      // Logo/Nhãn chuẩn dập chìm trên đế
      const labelPlate = new THREE.Mesh(
        new THREE.PlaneGeometry(0.065, 0.007).rotateX(-Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 }),
      );
      labelPlate.position.set(0, 0.0142, 0.020);
      bodyGroup.add(labelPlate);

      // 2. Ống đáy thông ngang thủy tinh borosilicate
      const manifold = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0062, 0.0062, 0.125, 32).rotateZ(Math.PI / 2),
        glassMat,
      );
      manifold.position.set(0, 0.024, 0);
      bodyGroup.add(manifold);

      // 3. Nhánh 1: Ống thẳng đứng tiêu chuẩn
      const tube1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0065, 0.0065, 0.145, 32),
        glassMat,
      );
      tube1.position.set(-0.048, 0.096, 0);
      bodyGroup.add(tube1);

      // Vành loe miệng nhánh 1
      const rim1 = new THREE.Mesh(
        new THREE.TorusGeometry(0.0070, 0.0012, 12, 24).rotateX(Math.PI / 2),
        glassMat,
      );
      rim1.position.set(-0.048, 0.168, 0);
      bodyGroup.add(rim1);

      // 4. Nhánh 2: Ống lượn sóng hình sin thực thụ (Sinusoidal S-Curve)
      const wavePoints: THREE.Vector3[] = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        const wy = 0.024 + t * 0.144;
        const wx = Math.sin(t * Math.PI * 4) * 0.009;
        wavePoints.push(new THREE.Vector3(wx, wy, 0));
      }
      const waveCurve = new THREE.CatmullRomCurve3(wavePoints);
      const tube2 = new THREE.Mesh(
        new THREE.TubeGeometry(waveCurve, 48, 0.0055, 24, false),
        glassMat,
      );
      bodyGroup.add(tube2);

      const rim2 = new THREE.Mesh(
        new THREE.TorusGeometry(0.0060, 0.0012, 12, 24).rotateX(Math.PI / 2),
        glassMat,
      );
      rim2.position.set(0, 0.168, 0);
      bodyGroup.add(rim2);

      // 5. Nhánh 3: Ống phình quả trám (3 bầu cầu thủy tinh tròn nối tiếp)
      const tube3 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0055, 0.0055, 0.145, 32),
        glassMat,
      );
      tube3.position.set(0.048, 0.096, 0);
      bodyGroup.add(tube3);

      [0.055, 0.095, 0.135].forEach((by) => {
        const b = new THREE.Mesh(
          new THREE.SphereGeometry(0.0135, 24, 24),
          glassMat,
        );
        b.position.set(0.048, by, 0);
        bodyGroup.add(b);
      });

      const rim3 = new THREE.Mesh(
        new THREE.TorusGeometry(0.0065, 0.0012, 12, 24).rotateX(Math.PI / 2),
        glassMat,
      );
      rim3.position.set(0.048, 0.168, 0);
      bodyGroup.add(rim3);

      // 6. Cột chất lỏng tự cân bằng đồng mức ở cả 3 nhánh (h1 = h2 = h3)
      const liquidGroup = new THREE.Group();
      liquidGroup.name = 'liquid_surface';

      // Nước ống ngang đáy
      const manifoldWater = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0052, 0.0052, 0.122, 24).rotateZ(Math.PI / 2),
        waterMat,
      );
      manifoldWater.position.set(0, 0.024, 0);
      liquidGroup.add(manifoldWater);

      // Nước nhánh 1 (thẳng)
      const waterCol1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0055, 0.0055, 0.082, 24),
        waterMat,
      );
      waterCol1.position.set(-0.048, 0.065, 0);
      liquidGroup.add(waterCol1);

      // Nước nhánh 2 (lượn sóng theo đường cong S)
      const waterWavePoints: THREE.Vector3[] = [];
      for (let i = 0; i <= 14; i++) {
        const t = i / 24;
        const wy = 0.024 + t * 0.144;
        const wx = Math.sin(t * Math.PI * 4) * 0.009;
        waterWavePoints.push(new THREE.Vector3(wx, wy, 0));
      }
      const waterWaveCurve = new THREE.CatmullRomCurve3(waterWavePoints);
      const waterCol2 = new THREE.Mesh(
        new THREE.TubeGeometry(waterWaveCurve, 28, 0.0046, 16, false),
        waterMat,
      );
      liquidGroup.add(waterCol2);

      // Nước nhánh 3 (thẳng + bầu cầu)
      const waterCol3 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0048, 0.0048, 0.082, 24),
        waterMat,
      );
      waterCol3.position.set(0.048, 0.065, 0);
      liquidGroup.add(waterCol3);

      [0.055, 0.095].forEach((by) => {
        const wb = new THREE.Mesh(
          new THREE.SphereGeometry(0.0125, 20, 20),
          waterMat,
        );
        wb.position.set(0.048, by, 0);
        liquidGroup.add(wb);
      });

      // Mặt thoáng phẳng cân bằng nằm ngang (vạch laser đứt nét mốc cân bằng)
      const eqLineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.065, 0.106, 0.008),
        new THREE.Vector3(0.065, 0.106, 0.008),
      ]);
      const eqLine = new THREE.Line(
        eqLineGeo,
        new THREE.LineDashedMaterial({ color: 0x38bdf8, dashSize: 0.005, gapSize: 0.003 }),
      );
      eqLine.computeLineDistances();
      bodyGroup.add(eqLine);

      bodyGroup.add(liquidGroup);

      const anchor = new THREE.Object3D();
      anchor.name = 'measurement_anchor';
      anchor.position.set(0, 0.150, 0);
      root.add(anchor);

      root.add(bodyGroup);
      break;
    }
  }

  return root;
}

/**
 * Cập nhật trạng thái hiển thị trực quan của một instance trong cảnh 3D
 * (ví dụ: số chỉ màn hình LCD cân điện tử, chiều cao cột nước ống đong, độ mở thước cặp,
 *  góc khúc xạ ánh sáng, kim điện kế cảm ứng, thang đo đồng hồ vạn năng, ngọn lửa đun nóng)
 * mà hoàn toàn không làm thay đổi mô hình gốc.
 */
export function applyInstanceStateToObject3D(
  instanceRoot: THREE.Object3D,
  instance: SceneInstance,
  asset: AssetDefinition,
): void {
  const customHtmlMod = htmlEquipmentModuleRegistry.getModule(asset.assetId);
  if (customHtmlMod && customHtmlMod.applyEquipmentState) {
    try {
      customHtmlMod.applyEquipmentState(THREE, instanceRoot, instance, asset);
      return;
    } catch (err) {
      console.warn('Error in HTML module applyEquipmentState:', err);
    }
  }

  const arch = asset.geometry.proceduralArchetype;

  // 1. Electronic balance front LCD readout (OHAUS Scout front display only) & pan depression
  if (arch === 'electronic-balance') {
    const tare = instance.instanceState.tareOffsetG ?? 0;
    const rawMass = instance.instanceState.measuredMassG ?? 0;
    const netMass = rawMass - tare;
    const displayed = (Math.abs(netMass) < 0.005 ? 0 : netMass).toFixed(2);

    const lcdNode = instanceRoot.getObjectByName('scale_display') as THREE.Mesh | undefined;
    if (lcdNode && lcdNode.material instanceof THREE.MeshBasicMaterial) {
      if (lcdNode.userData.lastText !== displayed) {
        lcdNode.userData.lastText = displayed;
        const newTex = createOhausScoutPanelTexture(displayed, 'g');
        if (
          lcdNode.material.map &&
          lcdNode.material.map !== newTex &&
          lcdNode.material.userData?.ownsTexture
        ) {
          lcdNode.material.map.dispose();
        }
        lcdNode.material.map = newTex;
        lcdNode.material.userData = {
          ...lcdNode.material.userData,
          ownsTexture: true,
        };
        lcdNode.material.needsUpdate = true;
      }
    }

    const panGroup = instanceRoot.getObjectByName('weighing_pan');
    if (panGroup) {
      panGroup.position.y = rawMass > 0.1 ? -0.0022 : 0;
    }
  }

  // 2. Graduated cylinder / beaker / overflow can / water dispenser / flask / porcelain dish liquid level update
  if (
    arch === 'graduated-cylinder' ||
    arch === 'beaker-250' ||
    arch === 'overflow-can' ||
    arch === 'water-dispenser' ||
    arch === 'erlenmeyer-flask' ||
    arch === 'porcelain-dish' ||
    arch === 'distillation-flask' ||
    arch === 'separatory-funnel'
  ) {
    const liquidGroup = instanceRoot.getObjectByName('liquid_surface');
    if (liquidGroup) {
      // For overflow-can, the spout mouth is at 210.0 ml; water inside can never exceed the spout level!
      const maxCap =
        arch === 'overflow-can'
          ? 210
          : asset.scientificProperties.capacity?.value ?? 100;
      const defaultMl =
        arch === 'overflow-can'
          ? 210
          : arch === 'water-dispenser'
            ? 850
            : maxCap * 0.5;
      const rawLevelMl = instance.instanceState.liquidLevelMl ?? defaultMl;
      const clampedLevelMl =
        arch === 'overflow-can' ? Math.min(210, rawLevelMl) : rawLevelMl;

      if (clampedLevelMl <= 0.2) {
        liquidGroup.visible = false;
      } else {
        liquidGroup.visible = true;
        const ratio = THREE.MathUtils.clamp(
          clampedLevelMl / maxCap,
          0.04,
          arch === 'overflow-can' ? 1.0 : 1.04,
        );
        if (arch === 'separatory-funnel') {
          const aqLayer = liquidGroup.getObjectByName('aq_layer');
          if (aqLayer) {
            aqLayer.scale.set(1, THREE.MathUtils.clamp(ratio * 1.2, 0.05, 1.1), 1);
          }
        } else if (arch === 'distillation-flask') {
          const scaleY = ratio / 0.5;
          liquidGroup.scale.set(1, scaleY, 1);
        } else {
          const scaleY = ratio / 0.5;
          syncHydrostaticLiquidToGravity(instanceRoot, scaleY, 0, 0);
        }
      }
    }

    if (arch === 'overflow-can') {
      // CHỈ hiển thị dòng chảy ở vòi tràn khi đang thực sự xảy ra hiện tượng tràn (isValveOpen === true)!
      // Khi chưa rót hoặc chưa thả vật làm tràn, tuyệt đối KHÔNG hiển thị spout_water hay spout_stream.
      const isActivelyOverflowing = Boolean(instance.instanceState.isValveOpen);
      const spoutStream = instanceRoot.getObjectByName('spout_stream');
      if (spoutStream) {
        spoutStream.visible = isActivelyOverflowing;
      }
      const spoutWater = instanceRoot.getObjectByName('spout_water');
      if (spoutWater) {
        spoutWater.visible = isActivelyOverflowing;
      }
    }

    if (arch === 'separatory-funnel') {
      const isExtracting = Boolean(instance.instanceState.isValveOpen);
      const stopcock = instanceRoot.getObjectByName('handle');
      if (stopcock) {
        stopcock.rotation.z = isExtracting ? Math.PI / 2 : 0;
      }
      const spoutStream = instanceRoot.getObjectByName('spout_stream');
      if (spoutStream) {
        spoutStream.visible = isExtracting;
      }
    }

    if (arch === 'water-dispenser') {
      const curVolMl = instance.instanceState.liquidLevelMl ?? 850;
      const displayed = curVolMl.toFixed(1);
      const lcdNode = instanceRoot.getObjectByName('scale_display') as THREE.Mesh | undefined;
      if (lcdNode && lcdNode.material instanceof THREE.MeshBasicMaterial) {
        if (lcdNode.userData.lastText !== displayed) {
          lcdNode.userData.lastText = displayed;
          const newTex = createLcdDisplayTexture(displayed, 'ml');
          instanceRoot.traverse((child) => {
            if (
              child instanceof THREE.Mesh &&
              child.name.startsWith('scale_display') &&
              child.material instanceof THREE.MeshBasicMaterial
            ) {
              if (child.material.map && child.material.map !== newTex) {
                child.material.map.dispose();
              }
              child.material.map = newTex;
              child.material.needsUpdate = true;
            }
          });
        }
      }
      const valvePlunger = instanceRoot.getObjectByName('plunger');
      if (valvePlunger) {
        valvePlunger.rotation.y = instance.instanceState.isValveOpen ? Math.PI / 2 : 0;
      }
      const spoutStream = instanceRoot.getObjectByName('spout_stream');
      if (spoutStream) {
        spoutStream.visible = Boolean(instance.instanceState.isValveOpen);
      }
    }

    if (arch === 'porcelain-dish' || arch === 'distillation-flask') {
      const flameGroup = instanceRoot.getObjectByName('flame_group');
      if (flameGroup) {
        // Chỉ hiện ngọn lửa khi có cờ gia nhiệt thực sự (P06)
        flameGroup.visible = Boolean(instance.instanceState.isHeating === true);
      }
    }
  }

  // 3. Vernier caliper jaw opening & live carriage display update (strictly 1:1 metric: 1 mm = 0.001 m)
  if (arch === 'vernier-caliper') {
    const openingMm = THREE.MathUtils.clamp(
      instance.instanceState.jawOpeningMm ?? 26,
      0,
      150,
    );
    const spanM = openingMm * 0.001;
    const X_FIXED_FACE = -0.09;
    const plunger = instanceRoot.getObjectByName('plunger');
    if (plunger) {
      plunger.position.x = X_FIXED_FACE + spanM;
    }
    const measureGuide = instanceRoot.getObjectByName(
      'jaw_measure_guide',
    ) as THREE.Mesh | null;
    if (measureGuide) {
      measureGuide.visible = openingMm > 0.2;
      measureGuide.scale.set(Math.max(0.0002, spanM), 1, 1);
      measureGuide.position.set(X_FIXED_FACE + spanM * 0.5, 0.009, 0.032);
    }
    const topDisplay = instanceRoot.getObjectByName(
      'scale_display',
    ) as THREE.Mesh | null;
    if (
      topDisplay &&
      Math.abs((topDisplay.userData.lastJawOpeningMm ?? -1) - openingMm) > 0.005
    ) {
      topDisplay.userData.lastJawOpeningMm = openingMm;
      const nextTex = createVernierCarriageDisplayTexture(openingMm);
      const updateMeshTex = (meshName: string, disposeOld: boolean) => {
        const m = instanceRoot.getObjectByName(meshName) as THREE.Mesh | null;
        if (m && m.material instanceof THREE.MeshBasicMaterial) {
          if (disposeOld && m.material.map) {
            m.material.map.dispose();
          }
          m.material.map = nextTex;
          m.material.needsUpdate = true;
        }
      };
      updateMeshTex('scale_display', true);
      updateMeshTex('scale_display_front', false);
      updateMeshTex('scale_display_rear', false);
    }
  }

  // 4. Spring dynamometer plunger & helical steel spring coil extension update
  if (arch === 'spring-dynamometer') {
    const forceN = instance.instanceState.springExtensionN ?? 0;
    const ratio = THREE.MathUtils.clamp(forceN / 5.0, 0, 1);
    const extensionM = ratio * 0.045;
    const plunger = instanceRoot.getObjectByName('plunger');
    if (plunger) {
      plunger.position.y = -extensionM;
    }
    const springCoil = instanceRoot.getObjectByName('spring_coil');
    if (springCoil) {
      springCoil.scale.set(1, 1 + ratio * 1.02, 1);
    }
  }

  // 5. Laser source & Optical prism beam toggle
  if (arch === 'laser-source') {
    const beams = instanceRoot.getObjectByName('laser_beams');
    if (beams) {
      beams.visible = instance.instanceState.isPoweredOn !== false;
    }
  }

  // 6. Semicircular glass slab Snell's Law refraction & Total Internal Reflection (Bài 5 & Bài 6)
  if (arch === 'semicircular-slab') {
    // P04: Bản bán nguyệt kèm cần xoay laser: tự động phát sáng tia laser khi nguồn mở (mặc định bật) hoặc có chùm laser tới
    const isLaserActive = Boolean(
      instance.instanceState.isLaserHit === true ||
      instance.instanceState.isPoweredOn !== false,
    );
    const rayGroup = instanceRoot.getObjectByName('ray_paths');
    if (rayGroup) {
      rayGroup.visible = isLaserActive;
    }
    const incRay = instanceRoot.getObjectByName('incident_ray');
    const refRay = instanceRoot.getObjectByName('refracted_ray');
    const rflRay = instanceRoot.getObjectByName('reflected_ray');
    const laserArm = instanceRoot.getObjectByName('handle');
    const hitPoint = instanceRoot.getObjectByName('measurement_anchor');

    const incDeg = instance.instanceState.incidentAngleDeg ?? 30;
    const incRad = THREE.MathUtils.degToRad(incDeg);

    // Cần xoay cơ khí & kim chỉ vạch quay đến đúng góc tới i trên đĩa Hartmann
    if (laserArm) {
      laserArm.rotation.y = incRad;
    }

    if (hitPoint) {
      hitPoint.visible = isLaserActive;
    }

    if (!isLaserActive) {
      if (incRay) incRay.visible = false;
      if (refRay) refRay.visible = false;
      if (rflRay) rflRay.visible = false;
    } else {
      if (incRay) incRay.visible = true;

      // Định luật Snell: n1·sin(i) = n2·sin(r) -> sin(r) = (1.50 / 1.00)·sin(i)
      const sinR = Math.sin(incRad) * 1.5;

      // Tia phản xạ luôn tồn tại theo định luật phản xạ: i' = i
      if (rflRay) {
        rflRay.visible = true;
        rflRay.rotation.y = -incRad;
        const isTir = sinR >= 1.0;
        // Phản xạ toàn phần: 100% cường độ ánh sáng phản xạ, tia phản xạ rực sáng
        rflRay.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
            child.material.opacity = isTir ? 0.98 : 0.42;
          }
        });
      }

      // Tia khúc xạ: biến mất hoàn toàn khi xảy ra Phản xạ toàn phần (i >= i_gh ≈ 41.81°)
      if (refRay) {
        if (sinR >= 1.0) {
          refRay.visible = false;
        } else {
          refRay.visible = true;
          const rRad = Math.asin(sinR);
          refRay.rotation.y = rRad;
          // Độ mờ giảm dần khi tia khúc xạ là là mặt phân cách (r -> 90°)
          const fadeOpacity = Math.max(0.2, 1.0 - sinR * 0.7);
          refRay.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
              child.material.opacity = fadeOpacity;
            }
          });
        }
      }
    }
  }

  // 7. Galvanometer center-zero needle deflection (both front & rear needles) & Electromagnetic induction coil
  if (arch === 'galvanometer') {
    const defl = THREE.MathUtils.clamp(
      instance.instanceState.galvanometerDeflection ?? 0,
      -1,
      1,
    );
    const needle = instanceRoot.getObjectByName('plunger');
    if (needle) {
      needle.rotation.z = -defl * 0.65;
    }
    const needleRear = instanceRoot.getObjectByName('plunger_rear');
    if (needleRear) {
      needleRear.rotation.z = defl * 0.65;
    }
  }

  if (arch === 'induction-coil-led') {
    const magnet = instanceRoot.getObjectByName('plunger');
    const led1 = instanceRoot.getObjectByName('led_1') as THREE.Mesh | undefined;
    const led2 = instanceRoot.getObjectByName('led_2') as THREE.Mesh | undefined;
    // P05: Mặc định defl = 0.0 (nam châm đứng yên, từ thông không đổi dPhi/dt = 0)
    const defl = instance.instanceState.galvanometerDeflection ?? 0.0;
    if (magnet) {
      magnet.position.x = -0.042 + defl * 0.018;
    }
    const isStationary = Math.abs(defl) <= 0.15;
    if (led1 && led1.material instanceof THREE.MeshStandardMaterial) {
      // LED 1 (đỏ) chỉ sáng khi từ thông biến thiên tăng
      led1.material.emissiveIntensity = !isStationary && defl > 0.15 ? 1.4 : 0.0;
    }
    if (led2 && led2.material instanceof THREE.MeshStandardMaterial) {
      // LED 2 (xanh) chỉ sáng khi từ thông biến thiên giảm
      led2.material.emissiveIntensity = !isStationary && defl < -0.15 ? 1.4 : 0.0;
    }
  }

  // 8. Digital Multimeter LCD update (updates both front and rear LCDs)
  if (arch === 'digital-multimeter') {
    const mode = instance.instanceState.multimeterMode ?? 'DCV';
    const unit = mode === 'DCV' ? 'V' : mode === 'DCA' ? 'A' : 'Ω';
    const rawVal = instance.instanceState.multimeterValue;
    // P07: Khi que đo hở mạch, không hiển thị điện áp ảo; hiển thị 0.00 V / 0.00 A hoặc O.L
    let text = '0.00';
    if (rawVal === 999999 || (rawVal === undefined && (mode === 'OHM' || unit === 'Ω'))) {
      text = 'O.L';
    } else if (typeof rawVal === 'number') {
      text = rawVal.toFixed(2);
    }
    const key = `${text}:${unit}`;
    const lcdNode = instanceRoot.getObjectByName('scale_display') as THREE.Mesh | undefined;
    if (lcdNode && lcdNode.material instanceof THREE.MeshBasicMaterial) {
      if (lcdNode.userData.lastText !== key) {
        lcdNode.userData.lastText = key;
        const newTex = createLcdDisplayTexture(text, unit);
        instanceRoot.traverse((child) => {
          if (
            child instanceof THREE.Mesh &&
            child.name.startsWith('scale_display') &&
            child.material instanceof THREE.MeshBasicMaterial
          ) {
            if (child.material.map && child.material.map !== newTex) {
              child.material.map.dispose();
            }
            child.material.map = newTex;
            child.material.needsUpdate = true;
          }
        });
      }
    }
  }

  // 9. Optical Microscope objective turret rotation (4x, 10x, 40x, 100x) & Stage Z-focus
  if (arch === 'optical-microscope') {
    const turret = instanceRoot.getObjectByName('plunger');
    if (turret) {
      const mag = instance.instanceState.magnification ?? 10;
      // 4 Vị trí góc dừng khớp chính xác cho 4 vật kính DIN
      turret.rotation.y =
        mag === 4
          ? 0
          : mag === 10
            ? Math.PI / 2
            : mag === 40
              ? Math.PI
              : (Math.PI * 3) / 2;
    }

    // Bàn sa trượt phẳng dịch chuyển theo ốc lấy nét Z
    const stageGroup = instanceRoot.getObjectByName('stageGroup');
    if (stageGroup) {
      const stateObj = instance.instanceState as Record<string, unknown>;
      const focusZ = (stateObj.focusZ as number) ?? 5.0;
      // Delta lấy nét chuyển dịch mm sang m
      stageGroup.position.y = (focusZ - 5.0) * 0.0018;
    }
  }

  // 10. Alcohol Thermometer dynamic capillary height based on temperatureC
  if (arch === 'thermometer') {
    const colGroup = instanceRoot.getObjectByName('plunger');
    if (colGroup) {
      const tempC = instance.instanceState.temperatureC ?? 25.0;
      const ratio = THREE.MathUtils.clamp((tempC + 10) / 120, 0.08, 1.0);
      colGroup.scale.set(1, ratio, 1);
    }
  }

  // 11. Optical Bench Components (Lamp, Frosted F Object, Lens, Screen, Power Supply, Lens Box)
  if (arch === 'optical-lamp') {
    // P02: Đèn CHỈ phát sáng khi isLampLit === true
    const areWiresClosed = Boolean(
      (instance.instanceState.isCablesConnected !== false &&
        instance.instanceState.wirePosConnected !== false &&
        instance.instanceState.wireNegConnected !== false) ||
      (instance.instanceState.wirePosConnected === true &&
        instance.instanceState.wireNegConnected === true)
    );
    const isLit = Boolean(
      instance.instanceState.isLampLit === true ||
      (instance.instanceState.isLampLit === undefined &&
        instance.instanceState.isPoweredOn === true &&
        (instance.instanceState.supplyVoltageV ?? 12.0) >= 2.5 &&
        areWiresClosed)
    );
    const beamMode = instance.instanceState.beamMode ?? 'triple';
    const experimentMode: 'f_object' | 'laser_rays' =
      instance.instanceState.experimentMode ??
      (beamMode === 'f_rays' || beamMode === 'f-pattern' ? 'f_object' : 'laser_rays');
    const voltageV = instance.instanceState.supplyVoltageV ?? 12.0;
    const rayOffsetYCm = instance.instanceState.rayOffsetYCm ?? 0;

    // Rotate beam selector knob (0: 1 ray, 45°: 2 rays, 90°: 3 rays, 135°: F rays)
    const knobNode = instanceRoot.getObjectByName('beam_mode_knob');
    if (knobNode) {
      const knobAngle =
        beamMode === 'single'
          ? 0
          : beamMode === 'double'
            ? Math.PI * 0.25
            : beamMode === 'triple'
              ? Math.PI * 0.5
              : Math.PI * 0.75;
      knobNode.rotation.y = knobAngle;
    }

    const key = `${isLit ? 1 : 0}:${experimentMode}:${beamMode}:${rayOffsetYCm.toFixed(1)}`;
    const slitNode = instanceRoot.getObjectByName('scale_display') as THREE.Mesh | undefined;
    if (
      slitNode &&
      slitNode.material instanceof THREE.MeshBasicMaterial &&
      slitNode.userData.lastKey !== key
    ) {
      slitNode.userData.lastKey = key;
      const nextTex = createLampSlitCanvasTexture(isLit, beamMode, experimentMode, rayOffsetYCm);
      if (slitNode.material.map) slitNode.material.map.dispose();
      slitNode.material.map = nextTex;
      slitNode.material.needsUpdate = true;
    }
    const lampLight = instanceRoot.getObjectByName('lamp_point_light') as THREE.PointLight | undefined;
    if (lampLight) {
      lampLight.intensity = isLit ? 0.35 + (voltageV / 12) * 0.75 : 0;
      lampLight.color.setHex(voltageV < 5.0 ? 0xffb74d : 0xffedd5);
    }
  }

  if (arch === 'frosted-f-object') {
    // Frosted F Object chỉ phát sáng rực rỡ khi đèn chiếu sáng thành công vào nó
    const isLit = Boolean(
      instance.instanceState.isLampLit ?? (instance.instanceState.isPoweredOn === true)
    );
    const frontDisc = instanceRoot.getObjectByName('scale_display') as THREE.Mesh | undefined;
    if (
      frontDisc &&
      frontDisc.material instanceof THREE.MeshBasicMaterial &&
      frontDisc.userData.lastPowered !== isLit
    ) {
      frontDisc.userData.lastPowered = isLit;
      const nextTex = createFrostedFObjectCanvasTexture(isLit);
      if (frontDisc.material.map) frontDisc.material.map.dispose();
      frontDisc.material.map = nextTex;
      frontDisc.material.needsUpdate = true;
    }
  }

  if (arch === 'optical-lens') {
    const profileId = instance.instanceState.lensProfileId ?? 'conv_10';
    const spec = OPTICAL_LENS_SPECS[profileId] ?? OPTICAL_LENS_SPECS.conv_10;
    const lensMesh = instanceRoot.getObjectByName('lens_element') as THREE.Mesh | undefined;
    if (lensMesh && lensMesh.userData.lastProfileId !== profileId) {
      lensMesh.userData.lastProfileId = profileId;
      lensMesh.geometry.dispose();
      lensMesh.geometry = createProfileOpticalLensGeometry(profileId, 0.035);
    }
    const tagFront = instanceRoot.getObjectByName('scale_display') as THREE.Mesh | undefined;
    if (
      tagFront &&
      tagFront.material instanceof THREE.MeshBasicMaterial &&
      tagFront.userData.lastProfileId !== profileId
    ) {
      tagFront.userData.lastProfileId = profileId;
      const nextTex = createLensHeadTagCanvasTexture(spec.codeLabel, spec.type);
      if (tagFront.material.map) tagFront.material.map.dispose();
      tagFront.material.map = nextTex;
      tagFront.material.needsUpdate = true;
    }
  }

  if (arch === 'optical-screen') {
    const isPoweredOn = instance.instanceState.isPoweredOn !== false;
    const beamMode = instance.instanceState.beamMode ?? 'f_rays';
    const experimentMode: 'f_object' | 'laser_rays' =
      instance.instanceState.experimentMode ??
      (beamMode === 'f_rays' || beamMode === 'f-pattern' ? 'f_object' : 'laser_rays');
    const lensProfileId = instance.instanceState.lensProfileId ?? 'conv_10';
    const focalLengthCm = instance.instanceState.focalLengthCm ?? 10;
    const objectDistanceDCm = instance.instanceState.objectDistanceDCm ?? 20;
    const screenDistanceCm = instance.instanceState.screenDistanceCm ?? 20;
    const projectedImageDPrimeCm = instance.instanceState.projectedImageDPrimeCm ?? 20;
    const projectedImageMag = instance.instanceState.projectedImageMag ?? -1;
    const projectedImageType = instance.instanceState.projectedImageType ?? 'real';
    const rayOffsetYCm = instance.instanceState.rayOffsetYCm ?? 0;
    const rayAngleDeg = instance.instanceState.rayAngleDeg ?? 0;

    const screenKey = [
      isPoweredOn ? 1 : 0,
      experimentMode,
      beamMode,
      lensProfileId,
      focalLengthCm.toFixed(1),
      objectDistanceDCm.toFixed(1),
      screenDistanceCm.toFixed(1),
      projectedImageDPrimeCm.toFixed(1),
      projectedImageMag.toFixed(2),
      projectedImageType,
      rayOffsetYCm.toFixed(1),
      rayAngleDeg.toFixed(1),
    ].join(':');

    const screenFront = instanceRoot.getObjectByName('scale_display') as THREE.Mesh | undefined;
    if (
      screenFront &&
      screenFront.material instanceof THREE.MeshBasicMaterial &&
      screenFront.userData.lastScreenKey !== screenKey
    ) {
      screenFront.userData.lastScreenKey = screenKey;
      const nextTex = createOpticalScreenCanvasTexture({
        isPoweredOn,
        experimentMode,
        beamMode,
        lensProfileId,
        focalLengthCm,
        objectDistanceDCm,
        screenDistanceCm,
        projectedImageDPrimeCm,
        projectedImageMag,
        projectedImageType,
        rayOffsetYCm,
        rayAngleDeg,
      });
      if (screenFront.material.map) screenFront.material.map.dispose();
      screenFront.material.map = nextTex;
      screenFront.material.needsUpdate = true;
    }
  }

  if (arch === 'optical-power-supply') {
    const isPoweredOn = instance.instanceState.isPoweredOn !== false;
    const voltageV = instance.instanceState.supplyVoltageV ?? 6.0;
    const key = `${isPoweredOn ? 1 : 0}:${voltageV.toFixed(1)}`;
    const panelMesh = instanceRoot.getObjectByName('scale_display') as THREE.Mesh | undefined;
    if (
      panelMesh &&
      panelMesh.material instanceof THREE.MeshBasicMaterial &&
      panelMesh.userData.lastKey !== key
    ) {
      panelMesh.userData.lastKey = key;
      const nextTex = createPowerSupplyPanelCanvasTexture(isPoweredOn, voltageV);
      if (panelMesh.material.map) panelMesh.material.map.dispose();
      panelMesh.material.map = nextTex;
      panelMesh.material.needsUpdate = true;
    }
    const switchCap = instanceRoot.getObjectByName('plunger') as THREE.Mesh | undefined;
    if (switchCap && switchCap.material instanceof THREE.MeshStandardMaterial) {
      switchCap.position.y = isPoweredOn ? 0.088 : 0.091;
      switchCap.material.color.setHex(isPoweredOn ? 0x10b981 : 0xef4444);
      switchCap.material.emissive.setHex(isPoweredOn ? 0x059669 : 0x991b1b);
    }
    const frontRocker = instanceRoot.getObjectByName('toggle_switch') as THREE.Mesh | undefined;
    if (frontRocker && frontRocker.material instanceof THREE.MeshStandardMaterial) {
      frontRocker.rotation.x = isPoweredOn ? -0.25 : 0.25;
      frontRocker.material.color.setHex(isPoweredOn ? 0xef4444 : 0x7f1d1d);
      frontRocker.material.emissiveIntensity = isPoweredOn ? 0.45 : 0;
    }
    const ledIndicator = instanceRoot.getObjectByName('led_indicator') as THREE.Mesh | undefined;
    if (ledIndicator && ledIndicator.material instanceof THREE.MeshStandardMaterial) {
      ledIndicator.material.color.setHex(isPoweredOn ? 0x22c55e : 0x1e293b);
      ledIndicator.material.emissiveIntensity = isPoweredOn ? 1.1 : 0;
    }
    const knob = instanceRoot.getObjectByName('handle');
    if (knob) {
      knob.rotation.z = -((voltageV - 3) / 9) * Math.PI * 1.2;
    }
  }

  if (arch === 'optical-lens-box') {
    const activeProfileId = instance.instanceState.lensProfileId ?? 'conv_10';
    (['conv_5', 'conv_10', 'conv_15', 'div_10', 'div_20', 'flat_inf'] as const).forEach((pid) => {
      const slotNode = instanceRoot.getObjectByName(`slot_${pid}`);
      if (slotNode) {
        slotNode.visible = pid !== activeProfileId;
      }
    });
  }

  // 13. Lever Balance apparatus: rotate symmetrical arm around Z axis according to incidentAngleDeg
  if (arch === 'lever-balance-apparatus') {
    const deg = Math.max(-30, Math.min(30, instance.instanceState.incidentAngleDeg ?? 0));
    const armNode = instanceRoot.getObjectByName('plunger');
    if (armNode) {
      armNode.rotation.z = -(deg * Math.PI) / 180;
    }
  }

  // 14. Communicating vessels 3-branch: level columns
  if (arch === 'communicating-vessels-3way') {
    const ml = instance.instanceState.liquidLevelMl ?? 75;
    const scaleY = THREE.MathUtils.clamp(ml / 150, 0.1, 1.8);
    const liqGrp = instanceRoot.getObjectByName('liquid_surface');
    if (liqGrp) {
      liqGrp.scale.set(1, scaleY, 1);
    }
  }
}

