/**
 * OPENLAB 3D — COGNITIVE NEURAL ENGINE
 * 
 * Bộ Điều phối Mạng Nơ-ron Tri thức Nhận thức 3 Tầng thời gian thực
 * Kết nối tương tác vật lý (Tầng 1) -> Biến số nổi Hologram 3D (Tầng 2) -> Định luật bừng sáng Eureka (Tầng 3)
 * Tích hợp Đo lường học ISO GUM, Phản xạ An toàn Socrates và Trình diễn KHKT ViSEF 1-Click
 */

import {
  EpistemicVariableTag,
  EpistemicLawDefinition,
  EPISTEMIC_LAWS_PRESET,
  SocraticMisconception,
  SOCRATIC_MISCONCEPTIONS_PRESET,
} from './cognitiveTopology';
import { SceneInstance, AssetDefinition } from './types';
import { labSoundEngine } from '../three-runtime/LabSoundEngine';

export interface EurekaEventDetail {
  law: EpistemicLawDefinition;
  varA: EpistemicVariableTag;
  varB: EpistemicVariableTag;
  resultValue: number;
  resultUnit: string;
  collisionWorldPos: [number, number, number];
  timestamp: string;
}

export interface SocraticDialogState {
  isOpen: boolean;
  activeMisconception?: SocraticMisconception;
  selectedOptionId?: string;
  hasAnswered: boolean;
  isCorrect?: boolean;
}

export class CognitiveNeuralEngine {
  private _isEpistemicLayerEnabled: boolean = true;
  private _variableTags: Map<string, EpistemicVariableTag> = new Map();
  private _laws: Map<string, EpistemicLawDefinition> = new Map();
  private _discoveredLawsHistory: EurekaEventDetail[] = [];
  private _socraticState: SocraticDialogState = { isOpen: false, hasAnswered: false };
  private _subscribers: Array<() => void> = [];

  constructor() {
    this._loadPreference();
    this._initLaws();
  }

  private _loadPreference() {
    try {
      const stored = localStorage.getItem('openlab_epistemic_layer_enabled');
      if (stored !== null) {
        this._isEpistemicLayerEnabled = stored === 'true';
      }
    } catch {
      this._isEpistemicLayerEnabled = true;
    }
  }

  private _initLaws() {
    for (const law of EPISTEMIC_LAWS_PRESET) {
      this._laws.set(law.id, { ...law });
    }
  }

  public get isEpistemicLayerEnabled(): boolean {
    return this._isEpistemicLayerEnabled;
  }

  public setEpistemicLayerEnabled(enabled: boolean): void {
    this._isEpistemicLayerEnabled = enabled;
    try {
      localStorage.setItem('openlab_epistemic_layer_enabled', enabled ? 'true' : 'false');
    } catch {
      // Ignore in sandbox
    }
    this._notify();
    window.dispatchEvent(new CustomEvent('openlab:epistemic-layer-toggle', { detail: { enabled } }));
  }

  public toggleEpistemicLayer(): boolean {
    this.setEpistemicLayerEnabled(!this._isEpistemicLayerEnabled);
    return this._isEpistemicLayerEnabled;
  }

  public subscribe(callback: () => void): () => void {
    this._subscribers.push(callback);
    return () => {
      this._subscribers = this._subscribers.filter((s) => s !== callback);
    };
  }

  private _notify(): void {
    this._subscribers.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('CognitiveNeuralEngine subscriber error:', err);
      }
    });
  }

  public getAllVariableTags(): EpistemicVariableTag[] {
    return Array.from(this._variableTags.values());
  }

  public getActiveVariableTags(): EpistemicVariableTag[] {
    return Array.from(this._variableTags.values()).filter((tag) => tag.isActive);
  }

  public getAllLaws(): EpistemicLawDefinition[] {
    return Array.from(this._laws.values());
  }

  public getDiscoveredLaws(): EpistemicLawDefinition[] {
    return Array.from(this._laws.values()).filter((l) => l.status === 'discovered');
  }

  public getDiscoveredHistory(): EurekaEventDetail[] {
    return [...this._discoveredLawsHistory];
  }

  public getSocraticState(): SocraticDialogState {
    return { ...this._socraticState };
  }

  /**
   * Cập nhật động danh sách các thẻ biến số nổi Hologram 3D dựa trên trạng thái các thiết bị trên bàn
   */
  public syncSceneInstances(
    instances: SceneInstance[],
    assetsMap: Map<string, AssetDefinition>,
    solverMeasurements?: Record<string, { value: number; unit: string; symbol: string; formatted: string }>
  ): void {
    const currentActiveIds = new Set<string>();

    for (const inst of instances) {
      if (!inst.visible || inst.instanceState?.attachmentSlot === 'shelf') continue;
      const asset = assetsMap.get(inst.assetId);
      const nameVi = asset?.name.vi || 'Thiết bị';
      const pos = inst.transform.positionM;
      // Hologram lơ lửng ngay trên đầu thiết bị (offset Y + 0.22m)
      const holoPos: [number, number, number] = [pos[0], pos[1] + 0.22, pos[2]];

      // 1. Cân điện tử -> Biến số Khối lượng m (g)
      if (inst.assetId.includes('BAL') || inst.assetId.includes('balance')) {
        const tagId = `TAG_MASS_${inst.instanceId}`;
        currentActiveIds.add(tagId);
        const netMass = solverMeasurements?.[inst.instanceId]?.value ?? (inst.instanceState?.measuredMassG ?? 66.25);
        const safeMass = Number.isFinite(netMass) ? Math.max(0, netMass) : 0;
        
        // Đo lường ISO GUM: ĐCNN = 0.01g -> u_B = 0.01 / √3 ≈ 0.0058g, u_A ≈ 0.015g -> U = 2 * √(uA² + uB²) ≈ 0.032g
        const uB = 0.01 / Math.sqrt(3);
        const uA = 0.015;
        const U = 2 * Math.sqrt(uA * uA + uB * uB);

        this._variableTags.set(tagId, {
          id: tagId,
          varType: 'mass',
          symbol: 'm',
          symbolLatex: '$m$',
          nameVi: 'Khối lượng mẫu',
          unitVi: 'g',
          value: Number(safeMass.toFixed(2)),
          formattedValue: safeMass.toFixed(2),
          sourceInstanceId: inst.instanceId,
          sourceAssetId: inst.assetId,
          sourceDeviceNameVi: nameVi,
          uncertaintyTypeA: Number(uA.toFixed(4)),
          uncertaintyTypeB: Number(uB.toFixed(4)),
          expandedUncertainty: Number(U.toFixed(3)),
          isoGumText: `${safeMass.toFixed(2)} ± ${U.toFixed(2)} g`,
          worldPositionM: holoPos,
          isActive: true,
          isFused: this._variableTags.get(tagId)?.isFused || false,
        });
      }

      // 2. Ống đong / Bình tràn -> Biến số Thể tích chiếm chỗ V (mL) = V2 - V1
      if (inst.assetId.includes('CYL') || inst.assetId.includes('cylinder') || inst.assetId.includes('OVF')) {
        const tagId = `TAG_VOL_${inst.instanceId}`;
        currentActiveIds.add(tagId);
        const currentLevel = inst.instanceState?.liquidLevelMl ?? 74.5;
        const baseLevel = inst.instanceState?.baseLiquidLevelMl ?? 50.0;
        const deltaV = Math.max(0, currentLevel - baseLevel);
        const volVal = solverMeasurements?.[inst.instanceId]?.value ?? (deltaV > 0 ? deltaV : 24.5);
        const safeVol = Number.isFinite(volVal) ? Math.max(0, volVal) : 0;
        
        // ĐCNN = 1 mL -> u_B = 1 / √3 ≈ 0.58 mL, U ≈ 1.2 mL
        const uB = 1.0 / Math.sqrt(3);
        const uA = 0.3;
        const U = 2 * Math.sqrt(uA * uA + uB * uB);

        this._variableTags.set(tagId, {
          id: tagId,
          varType: 'volume',
          symbol: 'V',
          symbolLatex: '$V$',
          nameVi: 'Thể tích chiếm chỗ',
          unitVi: 'mL',
          value: Number(safeVol.toFixed(1)),
          formattedValue: safeVol.toFixed(1),
          sourceInstanceId: inst.instanceId,
          sourceAssetId: inst.assetId,
          sourceDeviceNameVi: nameVi,
          uncertaintyTypeA: Number(uA.toFixed(3)),
          uncertaintyTypeB: Number(uB.toFixed(3)),
          expandedUncertainty: Number(U.toFixed(2)),
          isoGumText: `${safeVol.toFixed(1)} ± ${U.toFixed(1)} mL`,
          worldPositionM: holoPos,
          isActive: true,
          isFused: this._variableTags.get(tagId)?.isFused || false,
        });
      }

      // 3. Hộp nguồn điện DC -> Hiệu điện thế U (V)
      if (inst.assetId.includes('PSU') || inst.assetId.includes('power-supply')) {
        const tagId = `TAG_VOLT_${inst.instanceId}`;
        currentActiveIds.add(tagId);
        const voltVal = solverMeasurements?.[inst.instanceId]?.value ?? 6.0;
        const uB = 0.05;
        const U = 0.12;

        this._variableTags.set(tagId, {
          id: tagId,
          varType: 'voltage',
          symbol: 'U',
          symbolLatex: '$U$',
          nameVi: 'Hiệu điện thế nguồn',
          unitVi: 'V',
          value: Number(voltVal.toFixed(2)),
          formattedValue: voltVal.toFixed(2),
          sourceInstanceId: inst.instanceId,
          sourceAssetId: inst.assetId,
          sourceDeviceNameVi: nameVi,
          uncertaintyTypeA: 0.02,
          uncertaintyTypeB: uB,
          expandedUncertainty: U,
          isoGumText: `${voltVal.toFixed(2)} ± ${U.toFixed(2)} V`,
          worldPositionM: holoPos,
          isActive: true,
          isFused: this._variableTags.get(tagId)?.isFused || false,
        });
      }

      // 4. Đồng hồ vạn năng DMM / Đèn halogen -> Cường độ dòng điện I (A)
      if (inst.assetId.includes('DMM') || inst.assetId.includes('OLP') || inst.assetId.includes('lamp')) {
        const tagId = `TAG_CURR_${inst.instanceId}`;
        currentActiveIds.add(tagId);
        const currVal = solverMeasurements?.[inst.instanceId]?.value ?? 0.50;
        const uB = 0.005;
        const U = 0.015;

        this._variableTags.set(tagId, {
          id: tagId,
          varType: 'current',
          symbol: 'I',
          symbolLatex: '$I$',
          nameVi: 'Cường độ dòng điện',
          unitVi: 'A',
          value: Number(currVal.toFixed(2)),
          formattedValue: currVal.toFixed(2),
          sourceInstanceId: inst.instanceId,
          sourceAssetId: inst.assetId,
          sourceDeviceNameVi: nameVi,
          uncertaintyTypeA: 0.003,
          uncertaintyTypeB: uB,
          expandedUncertainty: U,
          isoGumText: `${currVal.toFixed(2)} ± ${U.toFixed(2)} A`,
          worldPositionM: holoPos,
          isActive: true,
          isFused: this._variableTags.get(tagId)?.isFused || false,
        });
      }

      // 5. Lực kế lò xo -> Lực kéo F (N) & Độ dãn Δl (cm)
      if (inst.assetId.includes('DYN') || inst.assetId.includes('dynamometer')) {
        const tagId = `TAG_FORCE_${inst.instanceId}`;
        currentActiveIds.add(tagId);
        const forceVal = solverMeasurements?.[inst.instanceId]?.value ?? (inst.instanceState?.measuredForceN ?? 0.65);
        const U = 0.05;

        this._variableTags.set(tagId, {
          id: tagId,
          varType: 'force',
          symbol: 'F',
          symbolLatex: '$F$',
          nameVi: 'Lực đàn hồi',
          unitVi: 'N',
          value: Number(forceVal.toFixed(2)),
          formattedValue: forceVal.toFixed(2),
          sourceInstanceId: inst.instanceId,
          sourceAssetId: inst.assetId,
          sourceDeviceNameVi: nameVi,
          uncertaintyTypeA: 0.01,
          uncertaintyTypeB: 0.02,
          expandedUncertainty: U,
          isoGumText: `${forceVal.toFixed(2)} ± ${U.toFixed(2)} N`,
          worldPositionM: holoPos,
          isActive: true,
          isFused: this._variableTags.get(tagId)?.isFused || false,
        });

        // Thẻ độ dãn lò xo Δl
        const tagDlId = `TAG_DL_${inst.instanceId}`;
        currentActiveIds.add(tagDlId);
        const springK = 50.0; // N/m
        const dlCm = (forceVal / springK) * 100.0;
        this._variableTags.set(tagDlId, {
          id: tagDlId,
          varType: 'displacement',
          symbol: 'Δl',
          symbolLatex: '$\\Delta l$',
          nameVi: 'Độ dãn lò xo',
          unitVi: 'cm',
          value: Number(dlCm.toFixed(1)),
          formattedValue: dlCm.toFixed(1),
          sourceInstanceId: inst.instanceId,
          sourceAssetId: inst.assetId,
          sourceDeviceNameVi: nameVi,
          uncertaintyTypeA: 0.05,
          uncertaintyTypeB: 0.05,
          expandedUncertainty: 0.1,
          isoGumText: `${dlCm.toFixed(1)} ± 0.1 cm`,
          worldPositionM: [holoPos[0] + 0.15, holoPos[1], holoPos[2]],
          isActive: true,
          isFused: this._variableTags.get(tagDlId)?.isFused || false,
        });
      }

      // 6. Nhiệt kế -> Nhiệt độ T (°C)
      if (inst.assetId.includes('THM') || inst.assetId.includes('thermometer')) {
        const tagId = `TAG_TEMP_${inst.instanceId}`;
        currentActiveIds.add(tagId);
        const tempVal = solverMeasurements?.[inst.instanceId]?.value ?? (inst.instanceState?.temperatureC ?? 25.0);
        this._variableTags.set(tagId, {
          id: tagId,
          varType: 'temperature',
          symbol: 'T',
          symbolLatex: '$T$',
          nameVi: 'Nhiệt độ chất lỏng',
          unitVi: '°C',
          value: Number(tempVal.toFixed(1)),
          formattedValue: tempVal.toFixed(1),
          sourceInstanceId: inst.instanceId,
          sourceAssetId: inst.assetId,
          sourceDeviceNameVi: nameVi,
          uncertaintyTypeA: 0.2,
          uncertaintyTypeB: 0.29,
          expandedUncertainty: 0.5,
          isoGumText: `${tempVal.toFixed(1)} ± 0.5 °C`,
          worldPositionM: holoPos,
          isActive: true,
          isFused: this._variableTags.get(tagId)?.isFused || false,
        });
      }

      // 7. Quang học (Đĩa quay / Nguồn laser) -> Góc tới i và Góc khúc xạ r
      if (inst.assetId.includes('DSK') || inst.assetId.includes('LSR') || inst.assetId.includes('OPT')) {
        const tagIncId = `TAG_INC_${inst.instanceId}`;
        const tagRefId = `TAG_REF_${inst.instanceId}`;
        currentActiveIds.add(tagIncId);
        currentActiveIds.add(tagRefId);

        const incAngle = inst.instanceState?.incidentAngleDeg ?? 45.0;
        const refAngle = Math.asin(Math.sin((incAngle * Math.PI) / 180) / 1.50) * (180 / Math.PI);

        this._variableTags.set(tagIncId, {
          id: tagIncId,
          varType: 'incidence_angle',
          symbol: 'i',
          symbolLatex: '$i$',
          nameVi: 'Góc tới',
          unitVi: '°',
          value: Number(incAngle.toFixed(1)),
          formattedValue: `${incAngle.toFixed(1)}°`,
          sourceInstanceId: inst.instanceId,
          sourceAssetId: inst.assetId,
          sourceDeviceNameVi: nameVi,
          uncertaintyTypeA: 0.2,
          uncertaintyTypeB: 0.29,
          expandedUncertainty: 0.5,
          isoGumText: `${incAngle.toFixed(1)}° ± 0.5°`,
          worldPositionM: holoPos,
          isActive: true,
          isFused: this._variableTags.get(tagIncId)?.isFused || false,
        });

        this._variableTags.set(tagRefId, {
          id: tagRefId,
          varType: 'refraction_angle',
          symbol: 'r',
          symbolLatex: '$r$',
          nameVi: 'Góc khúc xạ',
          unitVi: '°',
          value: Number(refAngle.toFixed(1)),
          formattedValue: `${refAngle.toFixed(1)}°`,
          sourceInstanceId: inst.instanceId,
          sourceAssetId: inst.assetId,
          sourceDeviceNameVi: nameVi,
          uncertaintyTypeA: 0.2,
          uncertaintyTypeB: 0.29,
          expandedUncertainty: 0.5,
          isoGumText: `${refAngle.toFixed(1)}° ± 0.5°`,
          worldPositionM: [holoPos[0] + 0.15, holoPos[1], holoPos[2]],
          isActive: true,
          isFused: this._variableTags.get(tagRefId)?.isFused || false,
        });
      }
    }

    // Đánh dấu inactive cho các tag không còn thiết bị trên bàn
    for (const [tagId, tag] of this._variableTags.entries()) {
      if (!currentActiveIds.has(tagId)) {
        tag.isActive = false;
      }
    }

    this._notify();
  }

  /**
   * KÍCH HOẠT HỢP NHẤT HAI BIẾN SỐ (VARIABLE FUSION -> AHA! EUREKA LAW MOMENT)
   * Học sinh kéo thả một thẻ biến số vào một thẻ biến số khác trong không gian 3D
   */
  public fuseVariables(tagIdA: string, tagIdB: string): { success: boolean; lawDiscovered?: EpistemicLawDefinition; messageVi: string } {
    if (tagIdA === tagIdB) {
      return { success: false, messageVi: 'Không thể hợp nhất cùng một biến số.' };
    }

    const varA = this._variableTags.get(tagIdA);
    const varB = this._variableTags.get(tagIdB);

    if (!varA || !varB || !varA.isActive || !varB.isActive) {
      return { success: false, messageVi: 'Một trong hai biến số không khả dụng trên bàn thí nghiệm.' };
    }

    const types = new Set([varA.varType, varB.varType]);

    // 1. Kiểm tra cặp biến số Khối lượng m & Thể tích V -> Định luật Khối lượng riêng ρ = m / V
    if (types.has('mass') && types.has('volume')) {
      const massVar = varA.varType === 'mass' ? varA : varB;
      const volVar = varA.varType === 'volume' ? varA : varB;

      if (volVar.value <= 0) {
        return { success: false, messageVi: 'Thể tích V bằng 0, không thể thực hiện phép chia cho 0!' };
      }

      // ρ = m / V (g/cm³ hoặc g/mL)
      const density = massVar.value / volVar.value;
      const law = this._laws.get('LAW_DENSITY')!;
      law.status = 'discovered';
      law.discoveredAt = new Date().toLocaleTimeString('vi-VN');
      law.calculatedResult = {
        symbol: 'ρ',
        value: Number(density.toFixed(2)),
        unit: 'g/cm³',
        formatted: `${density.toFixed(2)} g/cm³`,
      };

      varA.isFused = true;
      varB.isFused = true;

      // Tính vị trí va chạm giữa hai thẻ
      const colPos: [number, number, number] = [
        (varA.worldPositionM[0] + varB.worldPositionM[0]) / 2,
        (varA.worldPositionM[1] + varB.worldPositionM[1]) / 2 + 0.15,
        (varA.worldPositionM[2] + varB.worldPositionM[2]) / 2,
      ];

      const eurekaDetail: EurekaEventDetail = {
        law,
        varA: massVar,
        varB: volVar,
        resultValue: Number(density.toFixed(2)),
        resultUnit: 'g/cm³',
        collisionWorldPos: colPos,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      };

      this._discoveredLawsHistory.push(eurekaDetail);

      // Âm thanh Web Audio vinh danh thành tựu
      labSoundEngine.playTriumphChime();

      // Phát sự kiện toàn cục để Three.js hiển thị hiệu ứng hạt photon & vương miện Eureka
      window.dispatchEvent(new CustomEvent('openlab:eureka-law-discovered', { detail: eurekaDetail }));

      this._notify();
      return {
        success: true,
        lawDiscovered: law,
        messageVi: `KHOẢNH KHẮC EUREKA! Định luật Khối lượng riêng đã bừng sáng: ρ = m / V = ${density.toFixed(2)} g/cm³!`,
      };
    }

    // 2. Kiểm tra cặp Hiệu điện thế U & Cường độ I -> Định luật Ohm R = U / I
    if (types.has('voltage') && types.has('current')) {
      const voltVar = varA.varType === 'voltage' ? varA : varB;
      const currVar = varA.varType === 'current' ? varA : varB;

      if (currVar.value <= 0) {
        return { success: false, messageVi: 'Dòng điện I bằng 0 (mạch hở), chưa thể xác định điện trở!' };
      }

      const resistance = voltVar.value / currVar.value;
      const law = this._laws.get('LAW_OHM')!;
      law.status = 'discovered';
      law.discoveredAt = new Date().toLocaleTimeString('vi-VN');
      law.calculatedResult = {
        symbol: 'R',
        value: Number(resistance.toFixed(1)),
        unit: 'Ω',
        formatted: `${resistance.toFixed(1)} Ω`,
      };

      varA.isFused = true;
      varB.isFused = true;

      const colPos: [number, number, number] = [
        (varA.worldPositionM[0] + varB.worldPositionM[0]) / 2,
        (varA.worldPositionM[1] + varB.worldPositionM[1]) / 2 + 0.15,
        (varA.worldPositionM[2] + varB.worldPositionM[2]) / 2,
      ];

      const eurekaDetail: EurekaEventDetail = {
        law,
        varA: voltVar,
        varB: currVar,
        resultValue: Number(resistance.toFixed(1)),
        resultUnit: 'Ω',
        collisionWorldPos: colPos,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      };

      this._discoveredLawsHistory.push(eurekaDetail);
      labSoundEngine.playTriumphChime();
      window.dispatchEvent(new CustomEvent('openlab:eureka-law-discovered', { detail: eurekaDetail }));

      this._notify();
      return {
        success: true,
        lawDiscovered: law,
        messageVi: `KHOẢNH KHẮC EUREKA! Định luật Ohm đã bừng sáng: R = U / I = ${resistance.toFixed(1)} Ω!`,
      };
    }

    // 3. Kiểm tra cặp Thể tích V & Lực F -> Định luật Lực đẩy Archimedes FA = ρ * g * V
    if (types.has('volume') && types.has('force')) {
      const volVar = varA.varType === 'volume' ? varA : varB;
      const forceVar = varA.varType === 'force' ? varA : varB;

      // F_A = ρ_water * g * V = 1000 * 9.80665 * (V * 1e-6) (N)
      const buoyancy = 1000.0 * 9.80665 * (volVar.value * 1e-6);
      const law = this._laws.get('LAW_ARCHIMEDES')!;
      law.status = 'discovered';
      law.discoveredAt = new Date().toLocaleTimeString('vi-VN');
      law.calculatedResult = {
        symbol: 'F_A',
        value: Number(buoyancy.toFixed(2)),
        unit: 'N',
        formatted: `${buoyancy.toFixed(2)} N`,
      };

      varA.isFused = true;
      varB.isFused = true;

      const colPos: [number, number, number] = [
        (varA.worldPositionM[0] + varB.worldPositionM[0]) / 2,
        (varA.worldPositionM[1] + varB.worldPositionM[1]) / 2 + 0.15,
        (varA.worldPositionM[2] + varB.worldPositionM[2]) / 2,
      ];

      const eurekaDetail: EurekaEventDetail = {
        law,
        varA: volVar,
        varB: forceVar,
        resultValue: Number(buoyancy.toFixed(2)),
        resultUnit: 'N',
        collisionWorldPos: colPos,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      };

      this._discoveredLawsHistory.push(eurekaDetail);
      labSoundEngine.playTriumphChime();
      window.dispatchEvent(new CustomEvent('openlab:eureka-law-discovered', { detail: eurekaDetail }));

      this._notify();
      return {
        success: true,
        lawDiscovered: law,
        messageVi: `KHOẢNH KHẮC EUREKA! Định luật Lực đẩy Archimedes đã bừng sáng: F_A = d · V = ${buoyancy.toFixed(2)} N!`,
      };
    }

    // 4. Kiểm tra cặp Lực F & Độ dãn Δl -> Định luật Hooke k = F / Δl
    if (types.has('force') && types.has('displacement')) {
      const forceVar = varA.varType === 'force' ? varA : varB;
      const dlVar = varA.varType === 'displacement' ? varA : varB;

      if (dlVar.value <= 0) {
        return { success: false, messageVi: 'Độ dãn lò xo bằng 0, lò xo chưa biến dạng!' };
      }

      // k = F / (Δl in meters)
      const k = forceVar.value / (dlVar.value * 0.01);
      const law = this._laws.get('LAW_HOOKE')!;
      law.status = 'discovered';
      law.discoveredAt = new Date().toLocaleTimeString('vi-VN');
      law.calculatedResult = {
        symbol: 'k',
        value: Number(k.toFixed(1)),
        unit: 'N/m',
        formatted: `${k.toFixed(1)} N/m`,
      };

      varA.isFused = true;
      varB.isFused = true;

      const colPos: [number, number, number] = [
        (varA.worldPositionM[0] + varB.worldPositionM[0]) / 2,
        (varA.worldPositionM[1] + varB.worldPositionM[1]) / 2 + 0.15,
        (varA.worldPositionM[2] + varB.worldPositionM[2]) / 2,
      ];

      const eurekaDetail: EurekaEventDetail = {
        law,
        varA: forceVar,
        varB: dlVar,
        resultValue: Number(k.toFixed(1)),
        resultUnit: 'N/m',
        collisionWorldPos: colPos,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      };

      this._discoveredLawsHistory.push(eurekaDetail);
      labSoundEngine.playTriumphChime();
      window.dispatchEvent(new CustomEvent('openlab:eureka-law-discovered', { detail: eurekaDetail }));

      this._notify();
      return {
        success: true,
        lawDiscovered: law,
        messageVi: `KHOẢNH KHẮC EUREKA! Định luật Hooke đã bừng sáng: k = F / Δl = ${k.toFixed(1)} N/m!`,
      };
    }

    // 5. Kiểm tra cặp Góc tới i & Góc khúc xạ r -> Định luật Khúc xạ ánh sáng (Snell)
    if (types.has('incidence_angle') && types.has('refraction_angle')) {
      const incVar = varA.varType === 'incidence_angle' ? varA : varB;
      const refVar = varA.varType === 'refraction_angle' ? varA : varB;

      if (refVar.value <= 0) {
        return { success: false, messageVi: 'Góc khúc xạ r = 0, tia sáng truyền thẳng!' };
      }

      const sinI = Math.sin((incVar.value * Math.PI) / 180);
      const sinR = Math.sin((refVar.value * Math.PI) / 180);
      const n = sinI / sinR;
      const law = this._laws.get('LAW_SNELL')!;
      law.status = 'discovered';
      law.discoveredAt = new Date().toLocaleTimeString('vi-VN');
      law.calculatedResult = {
        symbol: 'n',
        value: Number(n.toFixed(2)),
        unit: '',
        formatted: `${n.toFixed(2)}`,
      };

      varA.isFused = true;
      varB.isFused = true;

      const colPos: [number, number, number] = [
        (varA.worldPositionM[0] + varB.worldPositionM[0]) / 2,
        (varA.worldPositionM[1] + varB.worldPositionM[1]) / 2 + 0.15,
        (varA.worldPositionM[2] + varB.worldPositionM[2]) / 2,
      ];

      const eurekaDetail: EurekaEventDetail = {
        law,
        varA: incVar,
        varB: refVar,
        resultValue: Number(n.toFixed(2)),
        resultUnit: '',
        collisionWorldPos: colPos,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      };

      this._discoveredLawsHistory.push(eurekaDetail);
      labSoundEngine.playTriumphChime();
      window.dispatchEvent(new CustomEvent('openlab:eureka-law-discovered', { detail: eurekaDetail }));

      this._notify();
      return {
        success: true,
        lawDiscovered: law,
        messageVi: `KHOẢNH KHẮC EUREKA! Định luật Snell đã bừng sáng: n = sin(i) / sin(r) = ${n.toFixed(2)}!`,
      };
    }

    return {
      success: false,
      messageVi: `Hai biến số "${varA.symbol}" và "${varB.symbol}" chưa tạo thành cặp tương tác định luật trực tiếp. Hãy thử kết hợp m & V (KLR), U & I (Ohm), V & F (Archimedes), F & Δl (Hooke), hoặc i & r (Snell)!`,
    };
  }

  /**
   * KÍCH HOẠT HỘI THOẠI SOCRATES CHẨN ĐOÁN NGỘ NHẬN (MISCONCEPTION DIAGNOSIS)
   */
  public triggerSocraticMisconception(condition: SocraticMisconception['triggerCondition']): void {
    const item = SOCRATIC_MISCONCEPTIONS_PRESET.find((m) => m.triggerCondition === condition);
    if (!item) return;

    this._socraticState = {
      isOpen: true,
      activeMisconception: item,
      selectedOptionId: undefined,
      hasAnswered: false,
    };

    // Âm thanh cảnh báo phản xạ an toàn
    labSoundEngine.playBeep(320, 0.25);

    this._notify();
    window.dispatchEvent(new CustomEvent('openlab:socratic-dialog-open', { detail: item }));
  }

  public answerSocraticQuestion(optionId: string): { isCorrect: boolean; feedbackVi: string; actionVi: string } {
    if (!this._socraticState.activeMisconception) {
      return { isCorrect: false, feedbackVi: '', actionVi: '' };
    }

    const opt = this._socraticState.activeMisconception.options.find((o) => o.id === optionId);
    if (!opt) {
      return { isCorrect: false, feedbackVi: '', actionVi: '' };
    }

    this._socraticState.selectedOptionId = optionId;
    this._socraticState.hasAnswered = true;
    this._socraticState.isCorrect = opt.isCorrectUnderstanding;

    if (opt.isCorrectUnderstanding) {
      labSoundEngine.playChime(660);
    } else {
      labSoundEngine.playBeep(240, 0.2);
    }

    this._notify();
    return {
      isCorrect: opt.isCorrectUnderstanding,
      feedbackVi: opt.socraticFeedbackVi,
      actionVi: opt.correctiveActionVi,
    };
  }

  public closeSocraticDialog(): void {
    this._socraticState = { isOpen: false, hasAnswered: false };
    this._notify();
  }

  /**
   * 🌟 KỊCH BẢN VÀNG VISEF 1-CLICK (GOLDEN DEMO RUN)
   * Tự động thiết lập cấu hình hoàn hảo cho bài thí nghiệm đo khối lượng riêng (m = 66.25g, V = 24.5mL -> ρ = 2.70 g/cm³)
   * và kích hoạt khoảnh khắc Eureka để học sinh tự tin trình diễn trước Ban Giám khảo KHKT!
   */
  public triggerGoldenViSEFDemo(): void {
    // 1. Giả lập 2 thẻ biến số vàng
    const tagMass: EpistemicVariableTag = {
      id: 'TAG_MASS_GOLDEN',
      varType: 'mass',
      symbol: 'm',
      symbolLatex: '$m$',
      nameVi: 'Khối lượng mẫu nhôm',
      unitVi: 'g',
      value: 66.25,
      formattedValue: '66.25',
      sourceInstanceId: 'inst_golden_balance',
      sourceAssetId: 'OL3D-EQP-BAL-0001',
      sourceDeviceNameVi: 'Cân điện tử hiện số 500g',
      uncertaintyTypeA: 0.015,
      uncertaintyTypeB: 0.0058,
      expandedUncertainty: 0.032,
      isoGumText: '66.25 ± 0.03 g',
      worldPositionM: [-0.25, 0.28, 0.0],
      isActive: true,
      isFused: false,
    };

    const tagVol: EpistemicVariableTag = {
      id: 'TAG_VOL_GOLDEN',
      varType: 'volume',
      symbol: 'V',
      symbolLatex: '$V$',
      nameVi: 'Thể tích nước dâng lên (V₂ - V₁)',
      unitVi: 'mL',
      value: 24.5,
      formattedValue: '24.5',
      sourceInstanceId: 'inst_golden_cylinder',
      sourceAssetId: 'OL3D-EQP-CYL-0001',
      sourceDeviceNameVi: 'Ống đong thủy tinh 100ml',
      uncertaintyTypeA: 0.25,
      uncertaintyTypeB: 0.58,
      expandedUncertainty: 1.26,
      isoGumText: '24.5 ± 1.3 mL',
      worldPositionM: [0.25, 0.28, 0.0],
      isActive: true,
      isFused: false,
    };

    this._variableTags.set(tagMass.id, tagMass);
    this._variableTags.set(tagVol.id, tagVol);
    this.setEpistemicLayerEnabled(true);

    // Kích hoạt hợp nhất sau 600ms mô phỏng luồng kéo thả của học sinh
    setTimeout(() => {
      this.fuseVariables(tagMass.id, tagVol.id);
    }, 600);
  }
}

export const cognitiveNeuralEngine = new CognitiveNeuralEngine();
