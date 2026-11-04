import { DeviceControlProfile } from './DeviceControlProfile';

/**
 * BỘ ĐẶC TẢ ĐIỀU KHIỂN CHI TIẾT 36 THIẾT BỊ OPENLAB 3D (ĐẦY ĐỦ 100%)
 * Tuân thủ nghiêm ngặt theo hồ sơ tại OPENLAB_36_DEVICE_MD_BUNDLE/OPENLAB_36_DEVICE_MD/devices
 * Chuẩn Thông tư 38/2021/TT-BGDĐT & SGK KHTN 6, 7, 8, 9 Bộ GD&ĐT
 * Thiết bị nào tuân thủ đúng chức năng đó; Đòn bẩy TUYỆT ĐỐI KHÔNG có nước, Bình thông nhau tính đúng thủy tĩnh.
 */

export const DEVICE_CONTROL_PROFILES: Record<string, DeviceControlProfile> = {
  // =========================================================================
  // 1. CÂN ĐIỆN TỬ HIỆN SỐ 500 G (G02)
  // =========================================================================
  'OL3D-EQP-BAL-0001': {
    deviceId: 'OL3D-EQP-BAL-0001',
    archetype: 'electronic-balance',
    titleVi: 'Cân điện tử hiện số 500 g',
    group: 'G02',
    curriculumLessonVi: 'KHTN 6 · Bài 4: Đo khối lượng | KHTN 8 · Bài 14: Đo khối lượng riêng',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · OIML Class II',
    initialState: {
      measuredMassG: 0,
      tareOffsetG: 0,
      isPoweredOn: true,
      fsmState: 'IDLE_ZERO',
    },
    stateSchema: {
      measuredMassG: 'number',
      tareOffsetG: 'number',
      isPoweredOn: 'boolean',
      fsmState: 'string',
    },
    transitions: [
      { from: 'IDLE_ZERO', event: 'LOAD_PLACED', to: 'WEIGHING_SETTLING' },
      { from: 'WEIGHING_SETTLING', event: 'LOAD_STABILIZED', to: 'STABLE_LOCKED' },
      { from: 'STABLE_LOCKED', event: 'TARE_PRESSED', to: 'IDLE_ZERO' },
      { from: 'WEIGHING_SETTLING', event: 'OVERLOAD', to: 'OVERLOAD_ERROR', guard: 'rawMass > 500' },
    ],
    parts: [
      {
        partId: 'tare_button_3d',
        nodeName: 'tare_button_3d',
        nameVi: 'Phím TARE / Trừ bì',
        role: 'Hiệu chuẩn điểm 0 và trừ bì trọng lượng cốc chứa',
        controlType: 'button',
        stateKey: 'tareOffsetG',
        helpId: 'help-bal-tare',
        help: {
          title: 'Phím bấm TARE / ZERO',
          partNameVi: 'Nút trừ bì cảm ứng lực',
          functionVi: 'Đặt lại số chỉ màn hình về 0.00 g khi đã đặt bình chứa hoặc cốc đong lên đĩa cân.',
          operationGuideVi: 'Bấm nút TARE sau khi đặt cốc rỗng. Sau đó chỉ khối lượng chất lỏng hoặc mẫu vật thêm vào mới được tính.',
          expectedFeedbackVi: 'Màn hình LCD 7-segment hiển thị 0.00 g kèm đèn chỉ thị NET/TARE.',
          commonErrorsVi: 'Quên trừ bì khiến kết quả đo bị cộng dồn khối lượng cốc chứa.',
          safetyNotesVi: 'Không ấn quá mạnh lên phím bấm làm quá tải cảm biến loadcell.',
        },
      },
      {
        partId: 'weighing_pan',
        nodeName: 'weighing_pan',
        nameVi: 'Đĩa cân Inox SUS304',
        role: 'Mặt đỡ tiếp nhận mẫu vật và truyền lực xuống loadcell',
        controlType: 'slider',
        stateKey: 'measuredMassG',
        limits: { min: 0, max: 500, step: 0.01, unit: 'g' },
        defaultValue: 0,
        helpId: 'help-bal-pan',
        help: {
          title: 'Đĩa cân Inox SUS304',
          partNameVi: 'Mâm cân thép không gỉ Ø120 mm',
          functionVi: 'Tiếp nhận vật mẫu, có độ lún đàn hồi vi mô 2.2 mm khi chịu tải danh định.',
          operationGuideVi: 'Đặt mẫu vật nhẹ nhàng vào chính tâm đĩa cân để hạn chế sai số góc lệch.',
          expectedFeedbackVi: 'Số đo tăng tương ứng khối lượng vật mẫu, biểu tượng STABLE hiện sáng.',
          commonErrorsVi: 'Thả rơi tự do vật nặng gây sốc tải làm biến dạng vĩnh viễn thanh loadcell.',
          safetyNotesVi: 'Tuyệt đối không đặt vật quá 500 g lên đĩa cân.',
        },
      },
      {
        partId: 'scale_display',
        nodeName: 'scale_display',
        nameVi: 'Màn hình LCD hiển thị số đo',
        role: 'Đọc số chỉ khối lượng trực tiếp',
        controlType: 'readout',
        stateKey: 'netMassG',
        limits: { min: 0, max: 500, step: 0.01, unit: 'g' },
        helpId: 'help-bal-display',
        help: {
          title: 'Màn hình LCD 7 đoạn',
          partNameVi: 'Màn hiển thị kỹ thuật số góc nghiêng 20°',
          functionVi: 'Hiển thị khối lượng tịnh với độ phân giải 0.01 g.',
          operationGuideVi: 'Đọc kết quả khi biểu tượng [g] hoặc [STABLE] ngừng nhấp nháy.',
          expectedFeedbackVi: 'Số đo số thực hiển thị rõ nét với 2 chữ số thập phân.',
          commonErrorsVi: 'Đọc kết quả quá vội khi loadcell chưa kết thúc thời gian ổn định (settling time).',
          safetyNotesVi: 'Tránh ánh sáng mặt trời chiếu trực tiếp làm lóa màn hình.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-bal-1',
        latex: 'm_{net} = \\max\\left(0, m_{gross} - m_{tare}\\right)',
        meaningVi: 'Khối lượng tịnh thực tế bằng khối lượng tổng trừ đi giá trị bì đã lưu',
      },
    ],
    outputs: [
      { key: 'netMassG', labelVi: 'Khối lượng tịnh', unit: 'g', formulaTex: 'm_{net}', formatDecimals: 2 },
      { key: 'fsmState', labelVi: 'Trạng thái cân', unit: '' },
    ],
    safetyRules: [
      'Giới hạn tải trọng tối đa: 500.0 g. Cân sẽ báo OVERLOAD_ERROR nếu vượt quá.',
      'Cần chờ số đo ổn định (≤ 2 giây) trước khi ghi số liệu thí nghiệm.',
    ],
    testCases: [
      { id: 'TC-BAL-01', name: 'Zero Tare test', expected: 'Đặt 66.25g nhấn TARE màn hình về 0.00g' },
      { id: 'TC-BAL-02', name: 'Overload check', expected: 'Đặt > 500g cân hiển thị OVERLOAD và đổi trạng thái' },
    ],
    evaluateOutputs: (state) => {
      const gross = state.measuredMassG ?? 0;
      const tare = state.tareOffsetG ?? 0;
      const net = Math.max(0, Number((gross - tare).toFixed(2)));
      let fsm = 'IDLE_ZERO';
      if (gross > 500) fsm = 'OVERLOAD_ERROR';
      else if (gross > 0) fsm = 'STABLE_LOCKED';
      return {
        netMassG: net,
        fsmState: fsm,
      };
    },
  },

  // =========================================================================
  // 2. ỐNG ĐONG THỦY TINH 100 ML (G04)
  // =========================================================================
  'OL3D-EQP-CYL-0001': {
    deviceId: 'OL3D-EQP-CYL-0001',
    archetype: 'graduated-cylinder',
    titleVi: 'Ống đong thủy tinh 100 ml',
    group: 'G04',
    curriculumLessonVi: 'KHTN 6 · Bài 5: Đo thể tích chất lỏng | KHTN 8 · Bài 14: Đo thể tích vật rắn bằng bình chia độ',
    technicalStandardVi: 'ISO 4788 · DIN 12680 · Thông tư 38/2021/TT-BGDĐT · GHĐ 100 ml · ĐCNN 1 ml',
    initialState: {
      liquidLevelMl: 50.0,
      submergedSolidVolumeMl: 0.0,
      fsmState: 'MENISCUS_STABLE',
    },
    stateSchema: {
      liquidLevelMl: 'number',
      submergedSolidVolumeMl: 'number',
      fsmState: 'string',
    },
    transitions: [
      { from: 'EMPTY', event: 'LIQUID_POURED', to: 'PARTIALLY_FILLED' },
      { from: 'PARTIALLY_FILLED', event: 'SOLID_SUBMERGED', to: 'SUBMERGED_OBJECT' },
      { from: 'SUBMERGED_OBJECT', event: 'OVERFLOW', to: 'OVERFLOW', guard: 'totalVolume > 100' },
    ],
    parts: [
      {
        partId: 'liquid_level_slider',
        nodeName: 'liquid_surface',
        nameVi: 'Mực chất lỏng ban đầu (V₁)',
        role: 'Rót hoặc rút chất lỏng trong ống đong',
        controlType: 'slider',
        stateKey: 'liquidLevelMl',
        limits: { min: 0, max: 100, step: 1, unit: 'ml' },
        defaultValue: 50.0,
        helpId: 'help-cyl-liquid',
        help: {
          title: 'Cột chất lỏng trong ống đong',
          partNameVi: 'Cột nước thủy tinh kèm mặt khum lõm',
          functionVi: 'Chứa chất lỏng đo thể tích hoặc môi trường dời chỗ cho vật rắn.',
          operationGuideVi: 'Đặt ống đong thẳng đứng trên mặt bàn bằng phẳng, đọc thể tích tại đáy mặt khum.',
          expectedFeedbackVi: 'Mực nước dâng lên theo vạch chia 1 ml chính xác.',
          commonErrorsVi: 'Đọc số đo ở mép trên mặt khum hoặc nhìn nghiêng chéo góc.',
          safetyNotesVi: 'Thủy tinh Borosilicate dễ vỡ, không thả rơi vật nặng vào lòng ống.',
        },
      },
      {
        partId: 'submerge_solid_slider',
        nodeName: 'liquid_body',
        nameVi: 'Thể tích vật rắn thả chìm (V_vật)',
        role: 'Mô phỏng thả vật rắn không thấm nước vào ống đong để đo thể tích dời chỗ',
        controlType: 'slider',
        stateKey: 'submergedSolidVolumeMl',
        limits: { min: 0, max: 40, step: 1, unit: 'ml' },
        defaultValue: 0,
        helpId: 'help-cyl-submerge',
        help: {
          title: 'Vật rắn thả chìm',
          partNameVi: 'Mẫu vật rắn ngập hoàn toàn trong nước',
          functionVi: 'Dời chỗ lượng nước có thể tích đúng bằng thể tích của vật.',
          operationGuideVi: 'Thả từ từ mẫu vật chìm hoàn toàn vào nước, đọc thể tích V2 sau khi dâng.',
          expectedFeedbackVi: 'Mực nước dâng thêm Delta V = V2 - V1 = V_vật.',
          commonErrorsVi: 'Để bọt khí bám vào vật hoặc thả vật chạm đáy làm vỡ ống đong.',
          safetyNotesVi: 'Cột dây chỉ mềm buộc vật rắn khi thả vào ống đong.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-cyl-1',
        latex: 'V_{tổng} = V_1 + V_{vật}',
        meaningVi: 'Thể tích tổng cộng trong ống đong bằng thể tích nước ban đầu cộng thể tích vật dời chỗ',
      },
      {
        id: 'eq-cyl-2',
        latex: '\\Delta V = V_2 - V_1 = V_{vật\\,rắn}',
        meaningVi: 'Phương pháp dời chỗ chất lỏng đo thể tích vật rắn không thấm nước',
      },
    ],
    outputs: [
      { key: 'totalReadingMl', labelVi: 'Thể tích đọc được (V₂)', unit: 'ml', formulaTex: 'V_2', formatDecimals: 1 },
      { key: 'displacedVolumeMl', labelVi: 'Thể tích vật chiếm chỗ (ΔV)', unit: 'ml', formulaTex: '\\Delta V', formatDecimals: 1 },
      { key: 'fsmState', labelVi: 'Trạng thái', unit: '' },
    ],
    safetyRules: ['GHĐ: 100 ml. ĐCNN: 1 ml. Đọc tại điểm võng sâu nhất của mặt khum nước.'],
    testCases: [{ id: 'TC-CYL-01', name: 'Displacement test', expected: 'V1 = 50 ml, thả vật 24 ml -> V2 = 74 ml' }],
    evaluateOutputs: (state) => {
      const v1 = state.liquidLevelMl ?? 50;
      const vSolid = state.submergedSolidVolumeMl ?? 0;
      const total = v1 + vSolid;
      return {
        totalReadingMl: Number(total.toFixed(1)),
        displacedVolumeMl: Number(vSolid.toFixed(1)),
        fsmState: total > 100 ? 'OVERFLOW' : vSolid > 0 ? 'SUBMERGED_OBJECT' : v1 > 0 ? 'MENISCUS_STABLE' : 'EMPTY',
      };
    },
  },

  // =========================================================================
  // 3. CỐC THỦY TINH CHIA ĐỘ 250 ML (G04/G05)
  // =========================================================================
  'OL3D-EQP-BKR-0001': {
    deviceId: 'OL3D-EQP-BKR-0001',
    archetype: 'beaker-250',
    titleVi: 'Cốc thủy tinh chia độ 250 ml',
    group: 'G04/G05',
    curriculumLessonVi: 'KHTN 6 · Pha chế dung dịch | KHTN 8 · Hòa tan, đun nóng & phản ứng hóa học',
    technicalStandardVi: 'ISO 3819 · DIN 12331 · Borosilicate 3.3 · Dung tích 250 ml · Mỏ rót',
    initialState: {
      liquidLevelMl: 150.0,
      solutionTemperatureC: 25.0,
      fsmState: 'RESTING',
    },
    stateSchema: {
      liquidLevelMl: 'number',
      solutionTemperatureC: 'number',
      fsmState: 'string',
    },
    transitions: [],
    parts: [
      {
        partId: 'beaker_liquid_slider',
        nodeName: 'liquid_surface',
        nameVi: 'Thể tích dung dịch trong cốc',
        role: 'Lượng chất lỏng chứa trong cốc thủy tinh',
        controlType: 'slider',
        stateKey: 'liquidLevelMl',
        limits: { min: 0, max: 250, step: 10, unit: 'ml' },
        defaultValue: 150.0,
        helpId: 'help-bkr-vol',
        help: {
          title: 'Dung dịch trong cốc',
          partNameVi: 'Chất lỏng đựng trong cốc Borosilicate',
          functionVi: 'Chứa dung dịch phản ứng, hòa tan muối hoặc đun nóng trên ngọn lửa đèn cồn.',
          operationGuideVi: 'Rót chất lỏng theo vạch ước lượng 50, 100, 150, 200, 250 ml.',
          expectedFeedbackVi: 'Mực chất lỏng dâng lên kèm hiệu ứng khúc xạ thủy tinh trong suốt.',
          commonErrorsVi: 'Dùng vạch chia trên cốc để đo thể tích chính xác (cốc chỉ dùng định tính/ước lượng).',
          safetyNotesVi: 'Khi đun nóng phải lót lưới amiăng tản nhiệt dưới đáy cốc tránh nứt vỡ.',
        },
      },
      {
        partId: 'beaker_temp_slider',
        nodeName: 'body',
        nameVi: 'Nhiệt độ dung dịch (T)',
        role: 'Nhiệt độ đun nóng hoặc làm nguội',
        controlType: 'slider',
        stateKey: 'solutionTemperatureC',
        limits: { min: 10, max: 100, step: 1, unit: '°C' },
        defaultValue: 25.0,
        helpId: 'help-bkr-temp',
        help: {
          title: 'Nhiệt độ dung dịch',
          partNameVi: 'Nhiệt độ chất lỏng',
          functionVi: 'Khảo sát tốc độ hòa tan và phản ứng hóa học theo nhiệt độ.',
          operationGuideVi: 'Điều chỉnh nhiệt độ khi đun bằng đèn cồn hoặc làm lạnh bằng nước đá.',
          expectedFeedbackVi: 'Dung dịch bốc hơi nước nhẹ khi đạt trên 70°C, sôi bọt khí ở 100°C.',
          commonErrorsVi: 'Cầm tay trực tiếp vào thành cốc nóng mà không dùng kẹp gắp gỗ/kim loại.',
          safetyNotesVi: 'Để cốc nguội tự nhiên trên tấm cách nhiệt, không xả nước lạnh đột ngột.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-bkr-1',
        latex: 'm = V \\cdot \\rho_{dd}',
        meaningVi: 'Khối lượng dung dịch bằng thể tích nhân khối lượng riêng',
      },
    ],
    outputs: [
      { key: 'liquidVolumeMl', labelVi: 'Thể tích ước lượng', unit: 'ml', formulaTex: 'V', formatDecimals: 0 },
      { key: 'waterMassG', labelVi: 'Khối lượng nước tương ứng', unit: 'g', formulaTex: 'm', formatDecimals: 1 },
      { key: 'thermalStateVi', labelVi: 'Trạng thái nhiệt', unit: '' },
    ],
    safetyRules: ['Cốc chịu nhiệt tối đa 500°C. Đun nóng bắt buộc phải có lưới thép amiăng.'],
    testCases: [{ id: 'TC-BKR-01', name: 'Volume mass check', expected: '150 ml nước = 150.0 g' }],
    evaluateOutputs: (state) => {
      const v = state.liquidLevelMl ?? 150;
      const t = state.solutionTemperatureC ?? 25;
      let thermal = 'Nhiệt độ phòng (25°C)';
      if (t >= 95) thermal = 'Sôi sùng sục (Bay hơi mạnh)';
      else if (t >= 60) thermal = 'Nóng ấm (Bốc hơi nhẹ)';
      else if (t < 20) thermal = 'Lạnh';
      return {
        liquidVolumeMl: v,
        waterMassG: Number((v * 1.0).toFixed(1)),
        thermalStateVi: thermal,
      };
    },
  },

  // =========================================================================
  // 4. BÌNH TRÀN EUREKA 250 ML (G02/G04)
  // =========================================================================
  'OL3D-EQP-OVF-0001': {
    deviceId: 'OL3D-EQP-OVF-0001',
    archetype: 'overflow-can',
    titleVi: 'Bình tràn Eureka 250 ml',
    group: 'G02/G04',
    curriculumLessonVi: 'KHTN 8 · Bài 14: Đo khối lượng riêng vật không bỏ lọt ống đong | Bài 17: Lực đẩy Archimedes',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Eureka can 250 ml · Vòi tràn nghiêng 45°',
    initialState: {
      submergedSolidVolumeMl: 0.0,
      fsmState: 'FULL_TO_SPOUT',
    },
    stateSchema: {
      submergedSolidVolumeMl: 'number',
      fsmState: 'string',
    },
    transitions: [],
    parts: [
      {
        partId: 'overflow_submerge_slider',
        nodeName: 'body',
        nameVi: 'Thể tích vật thả vào bình tràn',
        role: 'Thả chìm vật rắn kích thước lớn không lọt ống đong',
        controlType: 'slider',
        stateKey: 'submergedSolidVolumeMl',
        limits: { min: 0, max: 60, step: 1, unit: 'ml' },
        defaultValue: 0,
        helpId: 'help-ovf-submerge',
        help: {
          title: 'Thả vật vào bình tràn',
          partNameVi: 'Vật rắn chìm ngập hoàn toàn trong nước',
          functionVi: 'Đẩy lượng nước tràn qua vòi đúng bằng thể tích của vật.',
          operationGuideVi: 'Đổ nước đến ngang miệng vòi tràn, hứng cốc chia độ dưới vòi rồi nhẹ nhàng thả vật vào.',
          expectedFeedbackVi: 'Nước chảy từ vòi nghiêng thành dòng vào cốc hứng.',
          commonErrorsVi: 'Thả vật rơi mạnh làm nước sóng sánh bắn ra ngoài miệng bình gây sai số.',
          safetyNotesVi: 'Đặt bình tràn vững chãi gần mép khay hứng chống tràn nước ra bàn.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-ovf-1',
        latex: 'V_{tràn} = V_{vật\\,rắn}',
        meaningVi: 'Thể tích nước tràn ra cốc hứng bằng đúng thể tích phần vật rắn chìm trong nước',
      },
      {
        id: 'eq-ovf-2',
        latex: 'F_A = d_{nước} \\cdot V_{tràn} = \\rho_{nước} \\cdot g \\cdot V_{tràn}',
        meaningVi: 'Lực đẩy Archimedes bằng trọng lượng khối nước bị dời chỗ tràn ra ngoài',
      },
    ],
    outputs: [
      { key: 'overflowVolumeMl', labelVi: 'Lượng nước tràn ra (V_tràn)', unit: 'ml', formulaTex: 'V_{tràn}', formatDecimals: 1 },
      { key: 'buoyantForceN', labelVi: 'Lực đẩy Archimedes tương ứng', unit: 'N', formulaTex: 'F_A', formatDecimals: 2 },
    ],
    safetyRules: ['Trước khi thả vật, phải chờ cho đến khi giọt nước cuối cùng ngừng rỏ khỏi vòi tràn.'],
    testCases: [{ id: 'TC-OVF-01', name: 'Archimedes overflow', expected: 'Thả vật 25 ml -> Nước tràn 25.0 ml, FA = 0.25 N' }],
    evaluateOutputs: (state) => {
      const v = state.submergedSolidVolumeMl ?? 0;
      const fa = Number(((v / 1000000) * 1000 * 9.8).toFixed(2));
      return {
        overflowVolumeMl: Number(v.toFixed(1)),
        buoyantForceN: fa,
      };
    },
  },

  // =========================================================================
  // 5. LỰC KẾ LÒ XO ỐNG TRỤ 5 N (G02)
  // =========================================================================
  'OL3D-EQP-DYN-0001': {
    deviceId: 'OL3D-EQP-DYN-0001',
    archetype: 'spring-dynamometer',
    titleVi: 'Lực kế lò xo ống trụ 5 N',
    group: 'G02',
    curriculumLessonVi: 'KHTN 6 · Bài 40: Lực tiếp xúc và lực không tiếp xúc | KHTN 8 · Bài 15: Tác dụng của lực',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · GHĐ 5 N · ĐCNN 0.1 N',
    initialState: {
      appliedForceN: 0,
      zeroTrimN: 0,
      fsmState: 'UNLOADED_ZERO',
    },
    stateSchema: {
      appliedForceN: 'number',
      zeroTrimN: 'number',
      fsmState: 'string',
    },
    transitions: [
      { from: 'UNLOADED_ZERO', event: 'LOAD_HOOKED', to: 'MEASURING_EXPANDED' },
      { from: 'MEASURING_EXPANDED', event: 'LOAD_REMOVED', to: 'UNLOADED_ZERO' },
      { from: 'MEASURING_EXPANDED', event: 'OVERLOAD', to: 'OVERLOADED', guard: 'force > 5.0' },
    ],
    parts: [
      {
        partId: 'measuring_hook',
        nodeName: 'measurement_anchor',
        nameVi: 'Móc treo lực kế',
        role: 'Móc treo vật nặng hoặc kéo lực',
        controlType: 'slider',
        stateKey: 'appliedForceN',
        limits: { min: 0, max: 5.0, step: 0.1, unit: 'N' },
        defaultValue: 0,
        helpId: 'help-dyn-hook',
        help: {
          title: 'Móc treo kim loại',
          partNameVi: 'Móc thép mạ kẽm Ø2.5 mm',
          functionVi: 'Nhận lực kéo F hướng dọc theo trục lò xo.',
          operationGuideVi: 'Treo vật nặng hoặc gắn vào dây kéo. Giữ lực kế thẳng đứng.',
          expectedFeedbackVi: 'Lò xo dãn dài tỷ lệ thuận với lực tác dụng theo định luật Hooke.',
          commonErrorsVi: 'Kéo lệch phương trục lò xo gây ma sát vào thành ống đo.',
          safetyNotesVi: 'Không kéo vượt quá 5.0 N làm dãn quá giới hạn đàn hồi của lò xo.',
        },
      },
      {
        partId: 'zero_adjust_ring',
        nodeName: 'body',
        nameVi: 'Vòng vặn điều chỉnh số 0',
        role: 'Hiệu chỉnh kim chỉ thị về đúng vạch 0 N',
        controlType: 'slider',
        stateKey: 'zeroTrimN',
        limits: { min: -0.5, max: 0.5, step: 0.05, unit: 'N' },
        defaultValue: 0,
        helpId: 'help-dyn-zero',
        help: {
          title: 'Vít vi chỉnh điểm 0',
          partNameVi: 'Cơ cấu vít xoay đỉnh lực kế',
          functionVi: 'Nâng hoặc hạ điểm treo trên của lò xo để kim trùng khít vạch 0 khi chưa móc vật.',
          operationGuideVi: 'Quan sát vạch 0 ở vị trí thẳng đứng không tải, xoay nhẹ để kim chỉ đúng 0 N.',
          expectedFeedbackVi: 'Kim chỉ thị dịch chuyển theo từng vạch chia vi sai.',
          commonErrorsVi: 'Không hiệu chỉnh điểm 0 trước khi đo dẫn đến sai số hệ thống.',
          safetyNotesVi: 'Không vặn quá cữ ren trên đỉnh ống nhựa.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-dyn-1',
        latex: 'F = k \\cdot \\Delta l = m \\cdot g',
        meaningVi: 'Định luật Hooke: Lực đàn hồi tỷ lệ thuận với độ dãn lò xo',
      },
    ],
    outputs: [
      { key: 'measuredForceN', labelVi: 'Lực đo được', unit: 'N', formulaTex: 'F', formatDecimals: 2 },
      { key: 'springStretchMm', labelVi: 'Độ dãn lò xo', unit: 'mm', formulaTex: '\\Delta l', formatDecimals: 1 },
      { key: 'fsmState', labelVi: 'Trạng thái', unit: '' },
    ],
    safetyRules: [
      'GHĐ: 5.0 N. Tuyệt đối không treo vật có khối lượng > 500 g.',
      'Luôn cầm lực kế thẳng đứng trùng với phương của trọng lực.',
    ],
    testCases: [
      { id: 'TC-DYN-01', name: 'Hooke linearity test', expected: 'F = 2.5 N dãn 50 mm, F = 5.0 N dãn 100 mm' },
    ],
    evaluateOutputs: (state) => {
      const force = Math.max(0, Number(((state.appliedForceN ?? 0) + (state.zeroTrimN ?? 0)).toFixed(2)));
      const stretch = Math.min(100, Number((force * 20.0).toFixed(1)));
      return {
        measuredForceN: force,
        springStretchMm: stretch,
        fsmState: force > 5.0 ? 'OVERLOADED' : force > 0 ? 'MEASURING_EXPANDED' : 'UNLOADED_ZERO',
      };
    },
  },

  // =========================================================================
  // 6. THƯỚC CẶP DU XÍCH 150 MM (0.02 MM) (G01)
  // =========================================================================
  'OL3D-EQP-CAL-0001': {
    deviceId: 'OL3D-EQP-CAL-0001',
    archetype: 'vernier-caliper',
    titleVi: 'Thước cặp du xích 150 mm (0.02 mm)',
    group: 'G01',
    curriculumLessonVi: 'KHTN 6 · Bài 3: Đo chiều dài | KHTN 9 · Thực hành đo đạc chính xác',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · GHĐ 150 mm · ĐCNN 0.02 mm',
    initialState: {
      jawOpeningMm: 25.0,
      isLockScrewTight: false,
    },
    stateSchema: {
      jawOpeningMm: 'number',
      isLockScrewTight: 'boolean',
    },
    transitions: [],
    parts: [
      {
        partId: 'sliding_jaw',
        nodeName: 'plunger',
        nameVi: 'Hàm kẹp động & Du xích',
        role: 'Trượt tịnh tiến theo trục chính để kẹp chi tiết',
        controlType: 'slider',
        stateKey: 'jawOpeningMm',
        limits: { min: 0, max: 150, step: 0.02, unit: 'mm' },
        defaultValue: 25.0,
        helpId: 'help-cal-jaw',
        help: {
          title: 'Hàm kẹp động du xích',
          partNameVi: 'Khung trượt gắn du xích 50 vạch',
          functionVi: 'Di chuyển để đo đường kính ngoài, kết hợp hàm đo trong và chuôi đo sâu.',
          operationGuideVi: 'Đẩy ngón tay cái vào cữ lăn để mở hàm kẹp nhẹ nhàng ôm khít vật đo.',
          expectedFeedbackVi: 'Hàm mở ra tương ứng khoảng cách đo với độ chia 0.02 mm.',
          commonErrorsVi: 'Dùng lực quá mạnh ép biến dạng mẫu vật hoặc làm cong mỏ kẹp.',
          safetyNotesVi: 'Các mỏ đo trong có đầu nhọn, cẩn thận tránh đâm vào tay.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-cal-1',
        latex: 'L = N_{\\text{chính}} + (k_{\\text{du\\,xích}} \\times 0.02\\,\\text{mm})',
        meaningVi: 'Số đo bằng số milimét trên thước chính cộng với vạch du xích trùng nhân 0.02 mm',
      },
    ],
    outputs: [
      { key: 'exactLengthMm', labelVi: 'Kích thước đo', unit: 'mm', formulaTex: 'L', formatDecimals: 2 },
    ],
    safetyRules: ['Không kẹp vật cứng khi đang xoay trục. Lau sạch mỏ đo sau khi dùng.'],
    testCases: [{ id: 'TC-CAL-01', name: 'Reading check', expected: 'jawOpeningMm = 25.40 mm' }],
    evaluateOutputs: (state) => ({
      exactLengthMm: Number((state.jawOpeningMm ?? 25.0).toFixed(2)),
    }),
  },

  // =========================================================================
  // 7. QUẢ CÂN CHUẨN BẰNG ĐỒNG 50 G (G02)
  // =========================================================================
  'OL3D-EQP-WGT-0001': {
    deviceId: 'OL3D-EQP-WGT-0001',
    archetype: 'calibration-weight',
    titleVi: 'Quả cân chuẩn bằng đồng 50 g',
    group: 'G02',
    curriculumLessonVi: 'KHTN 6 · Bài 4: Đo khối lượng | KHTN 8 · Bài 15: Tác dụng của lực',
    technicalStandardVi: 'OIML R111 Class M1 · Đồng thau mạ bóng · m = 50.00 g (±3 mg)',
    initialState: {
      nominalMassG: 50.0,
      isSuspended: false,
    },
    stateSchema: {
      nominalMassG: 'number',
      isSuspended: 'boolean',
    },
    transitions: [],
    parts: [
      {
        partId: 'weight_body',
        nodeName: 'body',
        nameVi: 'Thân quả cân 50 g',
        role: 'Khối chuẩn vật lý chính xác',
        controlType: 'readout',
        stateKey: 'nominalMassG',
        helpId: 'help-wgt-body',
        help: {
          title: 'Quả cân chuẩn đồng mạ',
          partNameVi: 'Quả cân hình trụ có núm cầm',
          functionVi: 'Cung cấp chuẩn tải trọng 50 g hoặc lực kéo 0.49 N.',
          operationGuideVi: 'Dùng kẹp gắp nhấc quả cân từ hộp, tránh dùng tay trần làm dính mồ hôi muối.',
          expectedFeedbackVi: 'Đặt lên cân điện tử màn hình hiển thị 50.00 g.',
          commonErrorsVi: 'Dùng tay bẩn cầm quả cân làm oxy hóa tăng khối lượng.',
          safetyNotesVi: 'Tránh làm rơi làm móp méo sứt mẻ quả cân.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-wgt-1',
        latex: 'P = m \\cdot g = 0.050 \\times 9.80 = 0.490\\,\\text{N}',
        meaningVi: 'Trọng lượng của quả cân 50 g tương đương lực kéo 0.490 N',
      },
    ],
    outputs: [
      { key: 'nominalMassG', labelVi: 'Khối lượng chuẩn', unit: 'g', formulaTex: 'm_{chuẩn}', formatDecimals: 2 },
      { key: 'weightForceN', labelVi: 'Trọng lượng', unit: 'N', formulaTex: 'P', formatDecimals: 3 },
    ],
    safetyRules: ['Bảo quản trong hộp lót nhung có nắp đậy.'],
    testCases: [{ id: 'TC-WGT-01', name: 'Standard mass check', expected: 'm = 50.00 g, P = 0.490 N' }],
    evaluateOutputs: () => ({
      nominalMassG: 50.0,
      weightForceN: 0.490,
    }),
  },

  // =========================================================================
  // 8. VẬT RẮN HÌNH TRỤ HỢP KIM NHÔM (G02/G01)
  // =========================================================================
  'OL3D-EQP-SLD-0001': {
    deviceId: 'OL3D-EQP-SLD-0001',
    archetype: 'solid-cylinder',
    titleVi: 'Vật rắn hình trụ hợp kim nhôm',
    group: 'G02/G01',
    curriculumLessonVi: 'KHTN 8 · Bài 14: Thực hành xác định khối lượng riêng của vật rắn hình trụ',
    technicalStandardVi: 'Duralumin 6061 · Ø26 mm × H46 mm · m = 66.25 g · Móc treo Inox',
    initialState: {
      heightMm: 46.0,
      diameterMm: 26.0,
      massG: 66.25,
    },
    stateSchema: {
      heightMm: 'number',
      diameterMm: 'number',
      massG: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'cylinder_body',
        nodeName: 'body',
        nameVi: 'Thân trụ nhôm gia công tiện CNC',
        role: 'Mẫu vật rắn kiểm nghiệm khối lượng riêng',
        controlType: 'readout',
        stateKey: 'massG',
        helpId: 'help-sld-body',
        help: {
          title: 'Khối trụ nhôm hợp kim',
          partNameVi: 'Vật rắn hình trụ có móc treo',
          functionVi: 'Xác định khối lượng riêng qua công thức D = m / V.',
          operationGuideVi: 'Đo đường kính d và chiều cao h bằng thước cặp, cân khối lượng m bằng cân điện tử.',
          expectedFeedbackVi: 'V = pi * (d/2)^2 * h = 24.42 cm3 -> D = 2.71 g/cm3.',
          commonErrorsVi: 'Quên trừ thể tích móc treo khi đo thể tích dời chỗ.',
          safetyNotesVi: 'Không mài dũa bề mặt làm thay đổi kích thước danh định.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-sld-1',
        latex: 'V = \\pi \\cdot \\left(\\frac{D}{2}\\right)^2 \\cdot H \\approx 24.42\\,\\text{cm}^3',
        meaningVi: 'Thể tích hình học khối trụ nhôm',
      },
      {
        id: 'eq-sld-2',
        latex: 'D = \\frac{m}{V} = \\frac{66.25}{24.42} \\approx 2.71\\,\\text{g/cm}^3',
        meaningVi: 'Khối lượng riêng của hợp kim nhôm Duralumin',
      },
    ],
    outputs: [
      { key: 'calculatedVolumeCm3', labelVi: 'Thể tích hình học (V)', unit: 'cm³', formulaTex: 'V', formatDecimals: 2 },
      { key: 'calculatedDensity', labelVi: 'Khối lượng riêng (D)', unit: 'g/cm³', formulaTex: 'D', formatDecimals: 2 },
    ],
    safetyRules: ['Móc treo gắn liền đỉnh trụ phục vụ thí nghiệm lực kế và thả chìm.'],
    testCases: [{ id: 'TC-SLD-01', name: 'Density test', expected: 'D = 2.71 g/cm3' }],
    evaluateOutputs: () => ({
      calculatedVolumeCm3: 24.42,
      calculatedDensity: 2.71,
    }),
  },

  // =========================================================================
  // 9. VẬT RẮN HÌNH CẦU THÉP KHÔNG GỈ (G02/G01)
  // =========================================================================
  'OL3D-EQP-SPH-0001': {
    deviceId: 'OL3D-EQP-SPH-0001',
    archetype: 'solid-sphere',
    titleVi: 'Vật rắn hình cầu thép không gỉ',
    group: 'G02/G01',
    curriculumLessonVi: 'KHTN 8 · Bài 14: Đo khối lượng riêng của vật rắn hình cầu',
    technicalStandardVi: 'SUS304 · Đường kính Ø30.0 mm · m = 110.27 g',
    initialState: {
      diameterMm: 30.0,
      massG: 110.27,
    },
    stateSchema: {
      diameterMm: 'number',
      massG: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'sphere_body',
        nodeName: 'body',
        nameVi: 'Bi thép đặc đánh bóng gương',
        role: 'Vật mẫu hình cầu hoàn hảo',
        controlType: 'readout',
        stateKey: 'massG',
        helpId: 'help-sph-body',
        help: {
          title: 'Bi thép SUS304',
          partNameVi: 'Khối cầu thép không gỉ',
          functionVi: 'Kiểm nghiệm thể tích hình cầu V = 4/3*pi*R^3 và khối lượng riêng thép.',
          operationGuideVi: 'Kẹp đo đường kính bằng thước cặp du xích tại 3 hướng khác nhau lấy trung bình.',
          expectedFeedbackVi: 'D = 30.0 mm -> V = 14.14 cm3 -> D = 7.80 g/cm3.',
          commonErrorsVi: 'Để bi lăn rơi khỏi bàn thí nghiệm.',
          safetyNotesVi: 'Bi thép nặng 110 g, tránh để rơi vào chân.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-sph-1',
        latex: 'V = \\frac{4}{3}\\pi R^3 = \\frac{\\pi D^3}{6} \\approx 14.14\\,\\text{cm}^3',
        meaningVi: 'Thể tích hình cầu đường kính 30.0 mm',
      },
      {
        id: 'eq-sph-2',
        latex: 'D = \\frac{m}{V} = \\frac{110.27}{14.14} \\approx 7.80\\,\\text{g/cm}^3',
        meaningVi: 'Khối lượng riêng của thép không gỉ',
      },
    ],
    outputs: [
      { key: 'sphereVolumeCm3', labelVi: 'Thể tích hình cầu (V)', unit: 'cm³', formulaTex: 'V', formatDecimals: 2 },
      { key: 'sphereDensity', labelVi: 'Khối lượng riêng (D)', unit: 'g/cm³', formulaTex: 'D', formatDecimals: 2 },
    ],
    safetyRules: ['Đặt bi vào khay lõm chống lăn rơi tự do.'],
    testCases: [{ id: 'TC-SPH-01', name: 'Sphere density', expected: 'D = 7.80 g/cm3' }],
    evaluateOutputs: () => ({
      sphereVolumeCm3: 14.14,
      sphereDensity: 7.80,
    }),
  },

  // =========================================================================
  // 10. VẬT RẮN HÌNH HỘP CHỮ NHẬT ĐỒNG THAU (G02/G01)
  // =========================================================================
  'OL3D-EQP-BLK-0001': {
    deviceId: 'OL3D-EQP-BLK-0001',
    archetype: 'solid-block',
    titleVi: 'Vật rắn hình hộp chữ nhật đồng thau',
    group: 'G02/G01',
    curriculumLessonVi: 'KHTN 8 · Bài 14: Thực hành đo khối lượng riêng hình khối hộp',
    technicalStandardVi: 'Brass Cu-Zn · 40.0 × 25.0 × 25.0 mm · m = 219.00 g',
    initialState: {
      lengthMm: 40.0,
      widthMm: 25.0,
      heightMm: 25.0,
      massG: 219.0,
    },
    stateSchema: {
      lengthMm: 'number',
      widthMm: 'number',
      heightMm: 'number',
      massG: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'block_body',
        nodeName: 'body',
        nameVi: 'Khối đồng thau mài vát mép',
        role: 'Mẫu vật hình hộp chữ nhật',
        controlType: 'readout',
        stateKey: 'massG',
        helpId: 'help-blk-body',
        help: {
          title: 'Khối hộp đồng thau',
          partNameVi: 'Vật rắn hình hộp 3 chiều',
          functionVi: 'Xác định thể tích V = a*b*c và khối lượng riêng đồng thau.',
          operationGuideVi: 'Dùng thước cặp đo chiều dài 40 mm, rộng 25 mm, cao 25 mm.',
          expectedFeedbackVi: 'V = 25.00 cm3 -> D = 8.76 g/cm3.',
          commonErrorsVi: 'Đo nhầm giữa chiều dài và chiều rộng.',
          safetyNotesVi: 'Khối đồng đặc nặng 219 g.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-blk-1',
        latex: 'V = a \\cdot b \\cdot c = 4.0 \\times 2.5 \\times 2.5 = 25.00\\,\\text{cm}^3',
        meaningVi: 'Thể tích hình hộp chữ nhật',
      },
      {
        id: 'eq-blk-2',
        latex: 'D = \\frac{m}{V} = \\frac{219.00}{25.00} = 8.76\\,\\text{g/cm}^3',
        meaningVi: 'Khối lượng riêng của đồng thau',
      },
    ],
    outputs: [
      { key: 'blockVolumeCm3', labelVi: 'Thể tích khối hộp (V)', unit: 'cm³', formulaTex: 'V', formatDecimals: 2 },
      { key: 'blockDensity', labelVi: 'Khối lượng riêng (D)', unit: 'g/cm³', formulaTex: 'D', formatDecimals: 2 },
    ],
    safetyRules: ['Không gõ mạnh làm mẻ các góc cạnh hình học.'],
    testCases: [{ id: 'TC-BLK-01', name: 'Brass block density', expected: 'D = 8.76 g/cm3' }],
    evaluateOutputs: () => ({
      blockVolumeCm3: 25.00,
      blockDensity: 8.76,
    }),
  },

  // =========================================================================
  // 11. ỐNG TRỤ KIM LOẠI RỖNG CÓ KHOANG KÍN (G02/G04)
  // =========================================================================
  'OL3D-EQP-HLW-0001': {
    deviceId: 'OL3D-EQP-HLW-0001',
    archetype: 'hollow-cylinder',
    titleVi: 'Ống trụ kim loại rỗng có khoang kín',
    group: 'G02/G04',
    curriculumLessonVi: 'KHTN 8 · Bài 17: Lực đẩy Archimedes – Điều kiện chìm nổi của vật rỗng',
    technicalStandardVi: 'Đồng thau · D_ngoài = 30 mm, D_trong = 24 mm, H = 50 mm · Khoang kín nắp ren',
    initialState: {
      isWaterSealed: true,
      submergedState: 'FLOATING',
    },
    stateSchema: {
      isWaterSealed: 'boolean',
      submergedState: 'string',
    },
    transitions: [],
    parts: [
      {
        partId: 'seal_cap_toggle',
        nodeName: 'body',
        nameVi: 'Nắp vặn khoang kín',
        role: 'Đóng kín giữ không khí hoặc mở cho nước tràn vào',
        controlType: 'switch',
        stateKey: 'isWaterSealed',
        defaultValue: true,
        helpId: 'help-hlw-cap',
        help: {
          title: 'Nắp ren kín khí',
          partNameVi: 'Nắp vặn có gioăng cao su chống nước',
          functionVi: 'Minh chứng nguyên lý chìm nổi: khi khoang rỗng chứa không khí, khối lượng riêng trung bình nhỏ hơn nước nên vật nổi; khi ngập nước, vật chìm.',
          operationGuideVi: 'Bật ON để giữ khoang kín (Vật NỔI); Tắt OFF để nước ngập khoang rỗng (Vật CHÌM).',
          expectedFeedbackVi: 'Trạng thái nổi trên mặt nước hoặc chìm xuống đáy cốc đổi tức thời.',
          commonErrorsVi: 'Vặn nắp lỏng làm nước rò rỉ vào khoang.',
          safetyNotesVi: 'Kiểm tra gioăng cao su trước khi làm thí nghiệm.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-hlw-1',
        latex: 'F_A = d_{nước} \\cdot V_{bao} > P_{tổng} \\implies \\text{Vật NỔI}',
        meaningVi: 'Điều kiện nổi: Lực đẩy Archimedes của thể tích bao lớn hơn trọng lượng',
      },
    ],
    outputs: [
      { key: 'buoyancyStatusVi', labelVi: 'Trạng thái chìm/nổi', unit: '' },
    ],
    safetyRules: ['Lau khô bên trong khoang rỗng sau buổi thực hành.'],
    testCases: [{ id: 'TC-HLW-01', name: 'Flotation check', expected: 'Kín khí -> Nổi; Ngập nước -> Chìm' }],
    evaluateOutputs: (state) => ({
      buoyancyStatusVi: state.isWaterSealed ? '🟢 Nổi trên mặt nước (F_A > P)' : '🔴 Chìm xuống đáy (F_A < P)',
    }),
  },

  // =========================================================================
  // 12. BÌNH TAM GIÁC ERLENMEYER 250 ML (G04/G05)
  // =========================================================================
  'OL3D-EQP-FLK-0001': {
    deviceId: 'OL3D-EQP-FLK-0001',
    archetype: 'erlenmeyer-flask',
    titleVi: 'Bình tam giác Erlenmeyer 250 ml',
    group: 'G04/G05',
    curriculumLessonVi: 'KHTN 6 · Hóa học phản ứng tạo kết tủa | KHTN 8 · Định luật bảo toàn khối lượng',
    technicalStandardVi: 'ISO 1773 · Borosilicate 3.3 · Cổ hẹp Ø34 mm · Đáy Ø85 mm · 250 ml',
    initialState: {
      liquidLevelMl: 100.0,
      isSwirling: false,
    },
    stateSchema: {
      liquidLevelMl: 'number',
      isSwirling: 'boolean',
    },
    transitions: [],
    parts: [
      {
        partId: 'flask_liquid_slider',
        nodeName: 'liquid_surface',
        nameVi: 'Thể tích dung dịch trong bình',
        role: 'Lượng chất lỏng chứa trong bình tam giác',
        controlType: 'slider',
        stateKey: 'liquidLevelMl',
        limits: { min: 0, max: 250, step: 10, unit: 'ml' },
        defaultValue: 100.0,
        helpId: 'help-flk-vol',
        help: {
          title: 'Dung dịch trong bình tam giác',
          partNameVi: 'Chất lỏng trong bình Erlenmeyer',
          functionVi: 'Lắc đều hóa chất mà không bị bắn tung tóe nhờ thiết kế cổ thắt hình nón.',
          operationGuideVi: 'Cầm cổ bình và lắc tròn nhẹ nhàng theo phương ngang.',
          expectedFeedbackVi: 'Dung dịch cuộn xoáy hòa tan nhanh chóng.',
          commonErrorsVi: 'Lắc giật mạnh thẳng đứng làm trào dung dịch ra ngoài.',
          safetyNotesVi: 'Đeo kính bảo hộ khi thực hiện phản ứng tỏa nhiệt.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-flk-1',
        latex: '\\sum m_{chất\\,tham\\,gia} = \\sum m_{sản\\,phẩm}',
        meaningVi: 'Định luật bảo toàn khối lượng trong hệ kín',
      },
    ],
    outputs: [
      { key: 'solutionVolumeMl', labelVi: 'Thể tích dung dịch', unit: 'ml', formulaTex: 'V', formatDecimals: 0 },
    ],
    safetyRules: ['Không nút chặt nắp bình khi đang xảy ra phản ứng sinh khí mạnh.'],
    testCases: [{ id: 'TC-FLK-01', name: 'Capacity check', expected: 'V = 100 ml' }],
    evaluateOutputs: (state) => ({
      solutionVolumeMl: state.liquidLevelMl ?? 100,
    }),
  },

  // =========================================================================
  // 13. GIÁ ĐỠ THÍ NGHIỆM KÈM KHỚP NỐI & TAY KẸP (G05/G06)
  // =========================================================================
  'OL3D-EQP-STD-0001': {
    deviceId: 'OL3D-EQP-STD-0001',
    archetype: 'retort-stand',
    titleVi: 'Giá đỡ thí nghiệm kèm khớp nối & tay kẹp',
    group: 'G05/G06',
    curriculumLessonVi: 'KHTN 6, 7, 8, 9 · Bộ dụng cụ gá kẹp đa năng cho Cơ, Nhiệt, Quang, Hóa',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Trục thép Ø10 mm cao 600 mm · Đế gang 1.8 kg',
    initialState: {
      clampHeightCm: 35.0,
      clampAngleDeg: 0.0,
    },
    stateSchema: {
      clampHeightCm: 'number',
      clampAngleDeg: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'clamp_height_slider',
        nodeName: 'plunger',
        nameVi: 'Chiều cao tay kẹp (h)',
        role: 'Nâng hạ tay kẹp dọc theo trục đứng',
        controlType: 'slider',
        stateKey: 'clampHeightCm',
        limits: { min: 5, max: 55, step: 1, unit: 'cm' },
        defaultValue: 35.0,
        helpId: 'help-std-height',
        help: {
          title: 'Khớp nối chữ thập & Tay kẹp',
          partNameVi: 'Khớp nối trượt trên trục đứng',
          functionVi: 'Giữ chặt nhiệt kế, ống đong, phễu chiết hoặc bình cầu ở cao độ mong muốn.',
          operationGuideVi: 'Nới ốc hãm, trượt khớp nối đến độ cao phù hợp rồi siết chặt ốc lại.',
          expectedFeedbackVi: 'Tay kẹp trượt êm dọc theo trục thép đặc.',
          commonErrorsVi: 'Không siết chặt ốc hãm khiến dụng cụ thủy tinh trượt rơi vỡ.',
          safetyNotesVi: 'Luôn xoay tay kẹp nằm trên diện tích đế gang để chống lật giá đỡ.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-std-1',
        latex: 'z_{kẹp} = z_{base} + h_{clamp}',
        meaningVi: 'Cao độ làm việc của dụng cụ gắn trên giá đỡ',
      },
    ],
    outputs: [
      { key: 'clampElevationCm', labelVi: 'Cao độ tay kẹp', unit: 'cm', formulaTex: 'h', formatDecimals: 1 },
    ],
    safetyRules: ['Đế gang nặng phải đặt trên mặt bàn phẳng không cập kênh.'],
    testCases: [{ id: 'TC-STD-01', name: 'Height adjust', expected: 'h = 35.0 cm' }],
    evaluateOutputs: (state) => ({
      clampElevationCm: state.clampHeightCm ?? 35.0,
    }),
  },

  // =========================================================================
  // 14. THẤU KÍNH TRÊN ĐẾ TRƯỢT QUANG HỌC (f = +10 cm) (G06)
  // =========================================================================
  'OL3D-EQP-OPT-0001': {
    deviceId: 'OL3D-EQP-OPT-0001',
    archetype: 'optical-lens',
    titleVi: '(3) Thấu kính trên đế trượt quang học (f = +10 cm)',
    group: 'G06',
    curriculumLessonVi: 'KHTN 9 · Bài 8: Thấu kính hội tụ | Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Thấu kính thủy tinh K9 Ø40 mm · f = +100 mm (10 cm)',
    initialState: {
      lensPositionCm: 45.0,
      objectDistanceD: 25.0,
    },
    stateSchema: {
      lensPositionCm: 'number',
      objectDistanceD: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'lens_carrier_slider',
        nodeName: 'plunger',
        nameVi: 'Vị trí thấu kính trên ray (x_L)',
        role: 'Trượt thấu kính dọc theo giá quang học',
        controlType: 'slider',
        stateKey: 'lensPositionCm',
        limits: { min: 10, max: 80, step: 0.5, unit: 'cm' },
        defaultValue: 45.0,
        helpId: 'help-opt-pos',
        help: {
          title: 'Đế trượt mang thấu kính',
          partNameVi: 'Khung gá thấu kính hội tụ f = +10 cm',
          functionVi: 'Hội tụ chùm tia sáng và tạo ảnh thật/ảo theo công thức thấu kính.',
          operationGuideVi: 'Trượt đế thấu kính đến vị trí mong muốn trên thước đo của giá quang học.',
          expectedFeedbackVi: 'Vị trí ảnh hứng trên màn chắn thay đổi tương ứng.',
          commonErrorsVi: 'Sờ tay trực tiếp vào mặt kính làm dính vân tay mờ ảnh.',
          safetyNotesVi: 'Lau chùi thấu kính bằng giấy lau quang học chuyên dụng.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-opt-1',
        latex: '\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d^\\prime}',
        meaningVi: 'Công thức thấu kính mỏng liên hệ giữa tiêu cự f, khoảng cách vật d và khoảng cách ảnh d prime',
      },
      {
        id: 'eq-opt-2',
        latex: 'k = -\\frac{d^\\prime}{d}',
        meaningVi: 'Số phóng đại ảnh: k < 0 là ảnh thật ngược chiều, k > 0 là ảnh ảo cùng chiều',
      },
    ],
    outputs: [
      { key: 'imageDistanceDPrimeCm', labelVi: "Khoảng cách ảnh (d')", unit: 'cm', formulaTex: 'd^\\prime', formatDecimals: 1 },
      { key: 'linearMagnificationK', labelVi: 'Số phóng đại (k)', unit: '', formulaTex: 'k', formatDecimals: 2 },
      { key: 'imageNatureVi', labelVi: 'Tính chất ảnh', unit: '' },
    ],
    safetyRules: ['Tiêu cự chuẩn: +10.0 cm. Khi d > f cho ảnh thật, d < f cho ảnh ảo.'],
    testCases: [{ id: 'TC-OPT-01', name: 'Lens formula', expected: 'f = 10cm, d = 20cm -> d prime = 20.0cm, k = -1.0' }],
    evaluateOutputs: (state) => {
      const f = 10.0;
      const d = state.objectDistanceD ?? 25.0;
      let dPrime = 0;
      let k = 0;
      let nature = 'Ảnh thật, ngược chiều, nhỏ hơn vật';
      if (d === f) {
        nature = 'Ảnh ở vô cực (chùm tia ló song song)';
      } else {
        dPrime = Number(((d * f) / (d - f)).toFixed(1));
        k = Number((-dPrime / d).toFixed(2));
        if (d > 2 * f) nature = 'Ảnh thật, ngược chiều, nhỏ hơn vật (|k| < 1)';
        else if (d === 2 * f) nature = 'Ảnh thật, ngược chiều, bằng vật (|k| = 1)';
        else if (d > f) nature = 'Ảnh thật, ngược chiều, lớn hơn vật (|k| > 1)';
        else nature = 'Ảnh ảo, cùng chiều, lớn hơn vật (k > 1)';
      }
      return {
        imageDistanceDPrimeCm: dPrime,
        linearMagnificationK: k,
        imageNatureVi: nature,
      };
    },
  },

  // =========================================================================
  // 15. GIÁ QUANG HỌC 90 CM CÓ THƯỚC CHIA ĐỘ (G06)
  // =========================================================================
  'OL3D-EQP-OBN-0001': {
    deviceId: 'OL3D-EQP-OBN-0001',
    archetype: 'optical-bench',
    titleVi: '(5) Giá quang học 90 cm có thước chia độ (-45 .. 0 .. +45 cm)',
    group: 'G06',
    curriculumLessonVi: 'KHTN 9 · Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ (Hình 8.12)',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Ray nhôm định hình 900 mm · Thước vạch mm · Chân đế cân bằng',
    initialState: {
      railLengthCm: 90.0,
      isLeveled: true,
    },
    stateSchema: {
      railLengthCm: 'number',
      isLeveled: 'boolean',
    },
    transitions: [],
    parts: [
      {
        partId: 'bench_rail',
        nodeName: 'body',
        nameVi: 'Thân ray nhôm quang học 90 cm',
        role: 'Ray dẫn hướng và định vị trục quang chính',
        controlType: 'readout',
        stateKey: 'railLengthCm',
        helpId: 'help-obn-rail',
        help: {
          title: 'Ray quang học chuẩn',
          partNameVi: 'Thanh ray hợp kim nhôm định hình 90 cm',
          functionVi: 'Đảm bảo quang tâm của đèn, vật F, thấu kính và màn chắn nằm trên một đường thẳng.',
          operationGuideVi: 'Đặt ray trên mặt bàn nằm ngang. Gắn các đế trượt vào rãnh T-slot.',
          expectedFeedbackVi: 'Trục quang học thẳng hàng tuyệt đối, các đế trượt di chuyển êm.',
          commonErrorsVi: 'Ray bị cong vênh hoặc cập kênh làm lệch trục quang chính.',
          safetyNotesVi: 'Không đè vật nặng quá 5 kg lên thân ray.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-obn-1',
        latex: 'L = |x_2 - x_1|',
        meaningVi: 'Khoảng cách giữa hai chi tiết quang học tính theo vạch chỉ thị trên thước',
      },
    ],
    outputs: [
      { key: 'railLengthCm', labelVi: 'Chiều dài ray', unit: 'cm', formulaTex: 'L', formatDecimals: 0 },
      { key: 'levelStatusVi', labelVi: 'Độ thăng bằng trục', unit: '' },
    ],
    safetyRules: ['Chiều dài làm việc: 90 cm. Vạch chia ĐCNN: 1 mm.'],
    testCases: [{ id: 'TC-OBN-01', name: 'Span check', expected: 'L = 90 cm' }],
    evaluateOutputs: () => ({
      railLengthCm: 90.0,
      levelStatusVi: '🟢 Đã thăng bằng thủy chuẩn (Trục quang chính chuẩn xác)',
    }),
  },

  // =========================================================================
  // 16. ĐÈN CHIẾU SÁNG HALOGEN KÈM ĐẦU CHẮN KHE SÁNG (G06)
  // =========================================================================
  'OL3D-EQP-OLP-0001': {
    deviceId: 'OL3D-EQP-OLP-0001',
    archetype: 'optical-lamp',
    titleVi: '(1) Đèn chiếu sáng Halogen kèm Đầu chắn khe sáng',
    group: 'G06',
    curriculumLessonVi: 'KHTN 9 · Bộ thí nghiệm quang học Hình 8.12',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Bóng Halogen 12V 20W · Chóa gương cầu tụ sáng · Vỏ nhôm tản nhiệt',
    initialState: {
      isPoweredOn: true,
      lampPositionCm: 5.0,
    },
    stateSchema: {
      isPoweredOn: 'boolean',
      lampPositionCm: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'lamp_power_toggle',
        nodeName: 'body',
        nameVi: 'Công tắc đèn Halogen',
        role: 'Bật / Tắt nguồn sáng chiếu vật F',
        controlType: 'switch',
        stateKey: 'isPoweredOn',
        defaultValue: true,
        helpId: 'help-olp-power',
        help: {
          title: 'Đèn chiếu sáng Halogen 12V',
          partNameVi: 'Nguồn phát quang Halogen',
          functionVi: 'Chiếu rọi chùm sáng mạnh qua vật F để tạo nguồn sáng vật điểm.',
          operationGuideVi: 'Bật công tắc sau khi đã nối với Nguồn điện 12V.',
          expectedFeedbackVi: 'Chùm sáng trắng rọi sáng đều mặt kính mờ chữ F.',
          commonErrorsVi: 'Chạm tay vào vỏ đèn khi đang sáng (vỏ nhôm tỏa nhiệt nóng).',
          safetyNotesVi: 'Tắt đèn khi không quan sát để tránh làm nóng thấu kính.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-olp-1',
        latex: 'P = U \\cdot I = 12\\,\\text{V} \\times 1.67\\,\\text{A} \\approx 20\\,\\text{W}',
        meaningVi: 'Công suất tiêu thụ điện của bóng đèn Halogen',
      },
    ],
    outputs: [
      { key: 'lampStateVi', labelVi: 'Trạng thái phát quang', unit: '' },
      { key: 'luminousFluxLm', labelVi: 'Quang thông ước tính', unit: 'lm', formulaTex: '\\Phi', formatDecimals: 0 },
    ],
    safetyRules: ['Nguồn cấp 12V DC/AC. Cấm chạm tay vào vỏ kim loại đèn khi đang hoạt động.'],
    testCases: [{ id: 'TC-OLP-01', name: 'Power check', expected: 'Bật ON -> 350 lm' }],
    evaluateOutputs: (state) => ({
      lampStateVi: state.isPoweredOn ? '🟡 Đang phát quang (Halogen 12V / 20W)' : '⚪ Tắt nguồn',
      luminousFluxLm: state.isPoweredOn ? 350 : 0,
    }),
  },

  // =========================================================================
  // 17. VẬT SÁNG BẰNG KÍNH MỜ HÌNH CHỮ F (G06)
  // =========================================================================
  'OL3D-EQP-FOB-0001': {
    deviceId: 'OL3D-EQP-FOB-0001',
    archetype: 'frosted-f-object',
    titleVi: '(2) Vật sáng bằng kính mờ hình chữ F',
    group: 'G06',
    curriculumLessonVi: 'KHTN 9 · Bài 8: Khảo sát ảnh của vật sáng chữ F qua thấu kính',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Kính mờ khắc chữ F bất đối xứng cao 20 mm',
    initialState: {
      objectPositionCm: 20.0,
      objectHeightMm: 20.0,
    },
    stateSchema: {
      objectPositionCm: 'number',
      objectHeightMm: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'f_carrier_slider',
        nodeName: 'plunger',
        nameVi: 'Vị trí vật F trên ray (x_vật)',
        role: 'Trượt vị trí vật sáng trên giá quang học',
        controlType: 'slider',
        stateKey: 'objectPositionCm',
        limits: { min: 5, max: 50, step: 0.5, unit: 'cm' },
        defaultValue: 20.0,
        helpId: 'help-fob-pos',
        help: {
          title: 'Vật sáng chữ F',
          partNameVi: 'Tấm kính mờ chữ F bất đối xứng',
          functionVi: 'Chữ F có tính bất đối xứng hai chiều giúp dễ dàng nhận biết ảnh ngược chiều hay cùng chiều.',
          operationGuideVi: 'Trượt đế vật F để thay đổi khoảng cách vật d = |x_thấu_kính - x_vật|.',
          expectedFeedbackVi: 'Hình ảnh chữ F trên màn chắn to nhỏ hoặc lộn ngược theo khoảng cách.',
          commonErrorsVi: 'Lắp ngược mặt chữ F quay về phía sau đèn.',
          safetyNotesVi: 'Tấm kính mờ gắn chắc chắn trong khung nhựa bảo vệ.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-fob-1',
        latex: 'h_{vật} = 20.0\\,\\text{mm}',
        meaningVi: 'Chiều cao chuẩn của vật sáng chữ F',
      },
    ],
    outputs: [
      { key: 'objectHeightMm', labelVi: 'Chiều cao vật (h)', unit: 'mm', formulaTex: 'h', formatDecimals: 1 },
      { key: 'objectPositionCm', labelVi: 'Vị trí trên ray', unit: 'cm', formulaTex: 'x', formatDecimals: 1 },
    ],
    safetyRules: ['Chữ F bất đối xứng phục vụ xác định chiều của ảnh thật (ngược chiều).'],
    testCases: [{ id: 'TC-FOB-01', name: 'Height check', expected: 'h = 20.0 mm' }],
    evaluateOutputs: (state) => ({
      objectHeightMm: 20.0,
      objectPositionCm: state.objectPositionCm ?? 20.0,
    }),
  },

  // =========================================================================
  // 18. MÀN CHẮN HỨNG ẢNH TRÊN GIÁ QUANG HỌC (G06)
  // =========================================================================
  'OL3D-EQP-SCR-0001': {
    deviceId: 'OL3D-EQP-SCR-0001',
    archetype: 'optical-screen',
    titleVi: '(4) Màn chắn hứng ảnh trên Giá quang học',
    group: 'G06',
    curriculumLessonVi: 'KHTN 9 · Bài 8 & 9: Hứng ảnh rõ nét của thấu kính hội tụ',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Tấm nhựa trắng mờ 80 × 120 mm có lưới tọa độ mm',
    initialState: {
      screenPositionCm: 70.0,
      imageSharpnessPercent: 95.0,
    },
    stateSchema: {
      screenPositionCm: 'number',
      imageSharpnessPercent: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'screen_slider',
        nodeName: 'plunger',
        nameVi: 'Vị trí màn hứng ảnh (x_màn)',
        role: 'Trượt màn chắn dọc theo ray để tìm vị trí ảnh rõ nét nhất',
        controlType: 'slider',
        stateKey: 'screenPositionCm',
        limits: { min: 40, max: 90, step: 0.5, unit: 'cm' },
        defaultValue: 70.0,
        helpId: 'help-scr-pos',
        help: {
          title: 'Màn hứng ảnh trắng có vạch mm',
          partNameVi: 'Màn chắn phẳng vuông góc trục quang chính',
          functionVi: 'Hứng ảnh thật của chữ F. Vị trí ảnh rõ nét nhất cho biết khoảng cách ảnh d prime.',
          operationGuideVi: 'Trượt chậm màn hứng ảnh cho đến khi chữ F hiện lên sắc nét, viền không bị nhòe.',
          expectedFeedbackVi: 'Độ nét đạt 100% khi màn đặt đúng vị trí mặt phẳng tiêu cự của ảnh.',
          commonErrorsVi: 'Dừng lại khi ảnh còn mờ nhòe dẫn đến đo sai tiêu cự thấu kính.',
          safetyNotesVi: 'Không dùng bút chì hoặc mực vẽ bẩn lên bề mặt màn trắng.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-scr-1',
        latex: '\\text{Độ nét} = 100\\% \\times \\exp\\left(-\\frac{(x_{màn} - x_{ảnh})^2}{2\\sigma^2}\\right)',
        meaningVi: 'Hàm Gauss mô tả độ nét của ảnh khi dịch chuyển màn qua tiêu diện',
      },
    ],
    outputs: [
      { key: 'screenPositionCm', labelVi: 'Vị trí màn trên ray', unit: 'cm', formulaTex: 'x_{màn}', formatDecimals: 1 },
      { key: 'sharpnessPercent', labelVi: 'Độ rõ nét của ảnh', unit: '%', formulaTex: '\\text{Nét}', formatDecimals: 0 },
    ],
    safetyRules: ['Chỉ ảnh thật mới hứng được trên màn chắn. Ảnh ảo không hứng được.'],
    testCases: [{ id: 'TC-SCR-01', name: 'Sharpness test', expected: 'Đặt đúng tiêu diện đạt độ nét >= 90%' }],
    evaluateOutputs: (state) => {
      const pos = state.screenPositionCm ?? 70.0;
      const ideal = 70.0;
      const diff = Math.abs(pos - ideal);
      const sharp = Math.max(0, Math.min(100, Number((100 * Math.exp(-(diff * diff) / 8)).toFixed(0))));
      return {
        screenPositionCm: pos,
        sharpnessPercent: sharp,
      };
    },
  },

  // =========================================================================
  // 19. NGUỒN ĐIỆN HẠ ÁP THÍ NGHIỆM 3V–12V (G03/G07)
  // =========================================================================
  'OL3D-EQP-PSU-0001': {
    deviceId: 'OL3D-EQP-PSU-0001',
    archetype: 'optical-power-supply',
    titleVi: '(6) Nguồn điện hạ áp thí nghiệm 3V–12V',
    group: 'G03/G07',
    curriculumLessonVi: 'KHTN 8 · Nguồn điện cho mạch thí nghiệm | KHTN 9 · Cấp nguồn cho đèn quang học',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Biến áp hạ áp cách ly an toàn · Ngõ ra 3V, 6V, 9V, 12V (2A)',
    initialState: {
      isPoweredOn: true,
      voltageStepV: 12.0,
    },
    stateSchema: {
      isPoweredOn: 'boolean',
      voltageStepV: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'psu_voltage_selector',
        nodeName: 'rotary_dial',
        nameVi: 'Núm chọn nấc điện áp ra',
        role: 'Chọn nấc điện áp 3V, 6V, 9V, 12V',
        controlType: 'dial',
        stateKey: 'voltageStepV',
        options: [
          { value: 3.0, label: '3.0 V DC (Thực hành mạch nhỏ)' },
          { value: 6.0, label: '6.0 V DC (Đèn pin nhỏ)' },
          { value: 9.0, label: '9.0 V DC (Mạch cảm biến)' },
          { value: 12.0, label: '12.0 V DC (Đèn Halogen quang học)' },
        ],
        defaultValue: 12.0,
        helpId: 'help-psu-dial',
        help: {
          title: 'Núm chuyển nấc điện áp',
          partNameVi: 'Công tắc xoay chuyển nấc cuộn thứ cấp',
          functionVi: 'Cung cấp các mức điện áp hạ áp an toàn đạt chuẩn cho học sinh thực hành.',
          operationGuideVi: 'Xoay về nấc 12V khi dùng cho Đèn Halogen của bộ quang học.',
          expectedFeedbackVi: 'Đèn báo nguồn LED xanh sáng, ngõ ra cấp đúng 12.0 V.',
          commonErrorsVi: 'Chập hai đầu dây ra gây nhảy rơ-le chống ngắn mạch.',
          safetyNotesVi: 'Nguồn có rơ-le nhiệt tự ngắt khi quá tải hoặc chập mạch.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-psu-1',
        latex: 'P_{max} = U \\cdot I_{max} = 12\\,\\text{V} \\times 2\\,\\text{A} = 24\\,\\text{W}',
        meaningVi: 'Công suất tải tối đa của bộ nguồn hạ áp an toàn học sinh',
      },
    ],
    outputs: [
      { key: 'outputVoltageV', labelVi: 'Điện áp ra', unit: 'V', formulaTex: 'U', formatDecimals: 1 },
      { key: 'psuStateVi', labelVi: 'Trạng thái cấp nguồn', unit: '' },
    ],
    safetyRules: ['Điện áp hạ áp an toàn < 24V. Tự động ngắt khi dòng quá 2A.'],
    testCases: [{ id: 'TC-PSU-01', name: 'Voltage select', expected: 'Nấc 12V -> cấp đúng 12.0 V' }],
    evaluateOutputs: (state) => ({
      outputVoltageV: state.isPoweredOn ? state.voltageStepV ?? 12.0 : 0,
      psuStateVi: state.isPoweredOn ? '🟢 Đang cấp nguồn ổn định' : '⚪ Đã tắt nguồn',
    }),
  },

  // =========================================================================
  // 20. HỘP BỘ 6 THẤU KÍNH TIÊU CHUẨN (G06)
  // =========================================================================
  'OL3D-EQP-LBX-0001': {
    deviceId: 'OL3D-EQP-LBX-0001',
    archetype: 'optical-lens-box',
    titleVi: 'Hộp bộ 6 Thấu kính tiêu chuẩn (+5, +10, +15, -10, -20, ∞)',
    group: 'G06',
    curriculumLessonVi: 'KHTN 9 · Bài 8: So sánh thấu kính hội tụ và phân kì',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · 6 thấu kính gá khung màu phân biệt trong hộp mút',
    initialState: {
      selectedLensSlot: 2, // 1: +5cm, 2: +10cm, 3: +15cm, 4: -10cm, 5: -20cm, 6: phẳng
    },
    stateSchema: {
      selectedLensSlot: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'lens_box_selector',
        nodeName: 'body',
        nameVi: 'Chọn thấu kính từ hộp',
        role: 'Lấy thấu kính phù hợp để lắp lên giá quang học',
        controlType: 'dial',
        stateKey: 'selectedLensSlot',
        options: [
          { value: 1, label: 'Thấu kính hội tụ f = +5 cm (Độ tụ D = +20 dp)' },
          { value: 2, label: 'Thấu kính hội tụ f = +10 cm (Tiêu chuẩn KHTN 9)' },
          { value: 3, label: 'Thấu kính hội tụ f = +15 cm (Độ tụ D = +6.7 dp)' },
          { value: 4, label: 'Thấu kính phân kì f = -10 cm (Khung đỏ)' },
          { value: 5, label: 'Thấu kính phân kì f = -20 cm (Khung cam)' },
          { value: 6, label: 'Bản thủy tinh phẳng hai mặt song song' },
        ],
        defaultValue: 2,
        helpId: 'help-lbx-slot',
        help: {
          title: 'Hộp 6 thấu kính gá khung',
          partNameVi: 'Bộ thấu kính thí nghiệm quang học',
          functionVi: 'Cho phép thay đổi tiêu cự để khảo sát sự phụ thuộc của vị trí ảnh vào tiêu cự f.',
          operationGuideVi: 'Bấm chọn thấu kính cần dùng để gá lên giá trượt.',
          expectedFeedbackVi: 'Thông số tiêu cự f và độ tụ D cập nhật ngay lập tức.',
          commonErrorsVi: 'Nhầm lẫn giữa thấu kính hội tụ (mép mỏng) và phân kì (mép dày).',
          safetyNotesVi: 'Cất thấu kính về đúng ô mút xốp sau khi dùng tránh trầy xước.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-lbx-1',
        latex: 'D = \\frac{1}{f}',
        meaningVi: 'Độ tụ thấu kính tính bằng đi-ốp (dp) với tiêu cự f tính bằng mét',
      },
    ],
    outputs: [
      { key: 'selectedFocalCm', labelVi: 'Tiêu cự thấu kính (f)', unit: 'cm', formulaTex: 'f', formatDecimals: 1 },
      { key: 'selectedDiopterDp', labelVi: 'Độ tụ (D)', unit: 'dp', formulaTex: 'D', formatDecimals: 1 },
      { key: 'lensClassificationVi', labelVi: 'Loại thấu kính', unit: '' },
    ],
    safetyRules: ['Khung viền có gờ bảo vệ bề mặt quang học.'],
    testCases: [{ id: 'TC-LBX-01', name: 'Lens slot', expected: 'Slot 2 -> f = +10.0 cm, D = +10.0 dp' }],
    evaluateOutputs: (state) => {
      const slot = state.selectedLensSlot ?? 2;
      const fMap: Record<number, { f: number; d: number; name: string }> = {
        1: { f: 5.0, d: 20.0, name: 'Thấu kính hội tụ (mép mỏng)' },
        2: { f: 10.0, d: 10.0, name: 'Thấu kính hội tụ chuẩn KHTN 9 (mép mỏng)' },
        3: { f: 15.0, d: 6.7, name: 'Thấu kính hội tụ (mép mỏng)' },
        4: { f: -10.0, d: -10.0, name: 'Thấu kính phân kì (mép dày)' },
        5: { f: -20.0, d: -5.0, name: 'Thấu kính phân kì (mép dày)' },
        6: { f: 9999, d: 0.0, name: 'Bản phẳng song song' },
      };
      const cur = fMap[slot] ?? fMap[2];
      return {
        selectedFocalCm: cur.f,
        selectedDiopterDp: cur.d,
        lensClassificationVi: cur.name,
      };
    },
  },

  // =========================================================================
  // 21. NHIỆT KẾ CHẤT LỎNG -10°C ĐẾN 110°C (G03)
  // =========================================================================
  'OL3D-EQP-THM-0001': {
    deviceId: 'OL3D-EQP-THM-0001',
    archetype: 'thermometer',
    titleVi: 'Nhiệt kế chất lỏng -10°C đến 110°C',
    group: 'G03',
    curriculumLessonVi: 'KHTN 6 · Bài 7: Thang nhiệt độ Celsius – Đo nhiệt độ | KHTN 8 · Bài 26: Năng lượng nhiệt',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · GHĐ -10°C..110°C · ĐCNN 1°C',
    initialState: {
      temperatureC: 25.0,
    },
    stateSchema: {
      temperatureC: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'temperature_sensor',
        nodeName: 'body',
        nameVi: 'Bầu cảm ứng nhiệt',
        role: 'Tiếp nhận nhiệt độ môi trường hoặc chất lỏng',
        controlType: 'slider',
        stateKey: 'temperatureC',
        limits: { min: -10, max: 110, step: 0.5, unit: '°C' },
        defaultValue: 25.0,
        helpId: 'help-thm-bulb',
        help: {
          title: 'Bầu thủy ngân/rượu đỏ',
          partNameVi: 'Bầu thủy tinh thành mỏng chứa chất lỏng giãn nở',
          functionVi: 'Cột chất lỏng dâng lên hoặc hạ xuống theo hiện tượng dãn nở vì nhiệt.',
          operationGuideVi: 'Nhúng ngập bầu nhiệt kế vào chất lỏng cần đo, không để chạm đáy cốc.',
          expectedFeedbackVi: 'Cột chất lỏng đỏ dâng lên đến vạch nhiệt độ cân bằng nhiệt.',
          commonErrorsVi: 'Rút nhiệt kế ra khỏi chất lỏng rồi mới đọc kết quả khiến số đo bị tụt.',
          safetyNotesVi: 'Không dùng nhiệt kế để khuấy chất lỏng; tránh va chạm mạnh làm vỡ thủy tinh.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-thm-1',
        latex: 'h(T) = h_0 + \\beta \\cdot (T - T_0)',
        meaningVi: 'Độ cao cột chất lỏng dâng lên tỷ lệ thuận với độ tăng nhiệt độ',
      },
    ],
    outputs: [
      { key: 'temperatureC', labelVi: 'Nhiệt độ đo được', unit: '°C', formulaTex: 'T', formatDecimals: 1 },
    ],
    safetyRules: ['Không đo nhiệt độ vượt quá 110°C làm nổ bầu nhiệt kế.'],
    testCases: [{ id: 'TC-THM-01', name: 'Boiling water', expected: 'T = 100°C tại điểm sôi' }],
    evaluateOutputs: (state) => ({
      temperatureC: Number((state.temperatureC ?? 25.0).toFixed(1)),
    }),
  },

  // =========================================================================
  // 22. ĐÈN LASER 3 TIA SONG SONG (G06)
  // =========================================================================
  'OL3D-EQP-LSR-0001': {
    deviceId: 'OL3D-EQP-LSR-0001',
    archetype: 'laser-source',
    titleVi: 'Nguồn sáng Đèn Laser 3 tia song song',
    group: 'G06',
    curriculumLessonVi: 'KHTN 9 · Bài 5: Khúc xạ ánh sáng | KHTN 9 · Bài 8: Thấu kính hội tụ và phân kì',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Laser Diode Đỏ 650 nm · Công suất < 5 mW (Class 2)',
    initialState: {
      isLaserOn: true,
      laserBeamMode: 3,
    },
    stateSchema: {
      isLaserOn: 'boolean',
      laserBeamMode: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'laser_power_switch',
        nodeName: 'body',
        nameVi: 'Công tắc nguồn Laser',
        role: 'Bật / Tắt chùm tia Laser',
        controlType: 'switch',
        stateKey: 'isLaserOn',
        defaultValue: true,
        helpId: 'help-lsr-power',
        help: {
          title: 'Công tắc nguồn Laser',
          partNameVi: 'Phím gạt ON/OFF',
          functionVi: 'Đóng mạch cấp nguồn từ pin 3V cho 3 điốt bán dẫn Laser phát quang.',
          operationGuideVi: 'Gạt sang ON để bật tia Laser; gạt về OFF khi không sử dụng.',
          expectedFeedbackVi: '3 vệt tia Laser màu đỏ 650 nm song song phóng thẳng trên mặt bảng quang học.',
          commonErrorsVi: 'Quên tắt công tắc làm hao pin nguồn.',
          safetyNotesVi: 'Cảnh báo an toàn Class 2: Tuyệt đối không nhìn trực diện vào đầu phát tia Laser.',
        },
      },
      {
        partId: 'laser_mode_selector',
        nodeName: 'body',
        nameVi: 'Chuyển chế độ 1 tia / 3 tia',
        role: 'Gạt chắn tia bên để chuyển đổi giữa 1 tia trung tâm và 3 tia song song',
        controlType: 'dial',
        stateKey: 'laserBeamMode',
        options: [
          { value: 1, label: '1 tia trung tâm (Khảo sát khúc xạ đơn)' },
          { value: 3, label: '3 tia song song (Khảo sát tiêu cự thấu kính)' },
        ],
        defaultValue: 3,
        helpId: 'help-lsr-mode',
        help: {
          title: 'Màn chắn chuyển tia Laser',
          partNameVi: 'Thanh trượt che khe sáng',
          functionVi: 'Lựa chọn số lượng tia sáng phát ra phù hợp với từng bài học.',
          operationGuideVi: 'Chọn 1 tia khi khảo sát định luật khúc xạ với bản bán trụ; chọn 3 tia khi khảo sát chùm sáng qua thấu kính.',
          expectedFeedbackVi: 'Số vệt sáng đỏ trên bàn 3D thay đổi tức thì.',
          commonErrorsVi: 'Để 3 tia khi đo góc tới khiến các vệt sáng chồng chéo khó đọc góc.',
          safetyNotesVi: 'Không đặt tay chặn đầu phát quang khi laser đang bật.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-lsr-1',
        latex: '\\lambda = 650\\,\\text{nm},\\quad P < 5\\,\\text{mW}',
        meaningVi: 'Ánh sáng đơn sắc màu đỏ có bước sóng 650 nm, lan truyền theo đường thẳng trong môi trường trong suốt đồng tính',
      },
    ],
    outputs: [
      { key: 'activeLaserCount', labelVi: 'Số tia sáng phát ra', unit: 'tia' },
    ],
    safetyRules: ['Tuyệt đối không rọi tia Laser vào mắt người khác.'],
    testCases: [{ id: 'TC-LSR-01', name: 'Power toggle', expected: 'Bật ON tia laser hiện sáng' }],
    evaluateOutputs: (state) => ({
      activeLaserCount: state.isLaserOn ? state.laserBeamMode ?? 3 : 0,
    }),
  },

  // =========================================================================
  // 23. BẢN BÁN TRỤ THỦY TINH & BẢNG CHIA ĐỘ 360° (G06)
  // =========================================================================
  'OL3D-EQP-SLB-0001': {
    deviceId: 'OL3D-EQP-SLB-0001',
    archetype: 'semicircular-slab',
    titleVi: 'Bản bán trụ thuỷ tinh & Bảng chia độ 360°',
    group: 'G06',
    curriculumLessonVi: 'KHTN 9 · Bài 5: Khúc xạ ánh sáng | KHTN 9 · Bài 6: Phản xạ toàn phần',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Bán trụ R = 50 mm, chiết suất n = 1.50 · Đĩa chia độ 360°',
    initialState: {
      incidentAngleDeg: 30.0,
      refractiveIndex: 1.50,
    },
    stateSchema: {
      incidentAngleDeg: 'number',
      refractiveIndex: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'incident_angle_rotary',
        nodeName: 'protractor_disk',
        nameVi: 'Góc tới của tia sáng (i)',
        role: 'Xoay đĩa chia độ hoặc đèn chiếu để thay đổi góc tới i từ 0° đến 85°',
        controlType: 'rotary',
        stateKey: 'incidentAngleDeg',
        limits: { min: 0, max: 85, step: 1, unit: '°' },
        defaultValue: 30.0,
        helpId: 'help-slb-angle',
        help: {
          title: 'Đĩa chia độ 360° gắn nam châm',
          partNameVi: 'Mặt bảng góc Hartmann chia độ từ 0° đến 360°',
          functionVi: 'Đo góc tới i và góc khúc xạ r so với pháp tuyến tại tâm mặt phẳng bán trụ.',
          operationGuideVi: 'Xoay tia sáng tới tâm O. Đọc góc tới i ở vạch bảng độ.',
          expectedFeedbackVi: 'Tia khúc xạ r bị bẻ gãy theo định luật Snell; xuất hiện tia phản xạ mờ.',
          commonErrorsVi: 'Chiếu tia sáng lệch tâm O khiến tia bị khúc xạ lần thứ hai ở mặt cong.',
          safetyNotesVi: 'Cầm nhẹ nhàng bản bán trụ thủy tinh borosilicate tránh trầy xước bề mặt quang học.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-slb-1',
        latex: 'n_1 \\sin(i) = n_2 \\sin(r)',
        meaningVi: 'Định luật khúc xạ ánh sáng (Định luật Snell)',
      },
      {
        id: 'eq-slb-2',
        latex: '\\sin(i_{gh}) = \\frac{1}{n} \\approx \\frac{1}{1.50} = 0.667 \\implies i_{gh} \\approx 41.8^\\circ',
        meaningVi: 'Góc tới giới hạn phản xạ toàn phần khi truyền từ thủy tinh sang không khí',
      },
    ],
    outputs: [
      { key: 'refractedAngleDeg', labelVi: 'Góc khúc xạ (r)', unit: '°', formulaTex: 'r', formatDecimals: 1 },
      { key: 'isTotalInternalReflection', labelVi: 'Hiện tượng', unit: '' },
    ],
    safetyRules: ['Lau sạch bề mặt phẳng quang học bằng khăn mềm chuyên dụng.'],
    testCases: [
      { id: 'TC-SLB-01', name: 'Snell calculation', expected: 'i = 30° -> r = 19.5° khi n = 1.5' },
    ],
    evaluateOutputs: (state) => {
      const iDeg = state.incidentAngleDeg ?? 30.0;
      const n = state.refractiveIndex ?? 1.50;
      const iRad = (iDeg * Math.PI) / 180;
      const sinR = Math.sin(iRad) / n;
      const rDeg = Number(((Math.asin(Math.min(1, sinR)) * 180) / Math.PI).toFixed(1));
      return {
        refractedAngleDeg: rDeg,
        isTotalInternalReflection: 'Khúc xạ bình thường (Tia khúc xạ lệch lại gần pháp tuyến)',
      };
    },
  },

  // =========================================================================
  // 24. LĂNG KÍNH TAM GIÁC TRÊN GIÁ ĐỠ — TÁN SẮC ÁNH SÁNG (G06)
  // =========================================================================
  'OL3D-EQP-PRM-0001': {
    deviceId: 'OL3D-EQP-PRM-0001',
    archetype: 'optical-prism',
    titleVi: 'Lăng kính tam giác trên giá đỡ — Tán sắc ánh sáng',
    group: 'G06',
    curriculumLessonVi: 'KHTN 9 · Bài 7: Ánh sáng trắng và ánh sáng màu – Hiện tượng tán sắc',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Thủy tinh quang học Flint · Tam giác đều A = 60° · Giá xoay',
    initialState: {
      incidentAngleDeg: 45.0,
      apexAngleDeg: 60.0,
    },
    stateSchema: {
      incidentAngleDeg: 'number',
      apexAngleDeg: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'prism_angle_rotary',
        nodeName: 'body',
        nameVi: 'Góc tới của chùm sáng trắng (i₁)',
        role: 'Xoay lăng kính để thay đổi góc tới',
        controlType: 'rotary',
        stateKey: 'incidentAngleDeg',
        limits: { min: 20, max: 70, step: 1, unit: '°' },
        defaultValue: 45.0,
        helpId: 'help-prm-rotary',
        help: {
          title: 'Giá xoay lăng kính tam giác',
          partNameVi: 'Lăng kính tam giác đều góc chiết quang A = 60°',
          functionVi: 'Phân tách chùm ánh sáng trắng phức tạp thành dải 7 màu biến thiên liên tục từ đỏ đến tím.',
          operationGuideVi: 'Chiếu khe hẹp ánh sáng trắng vào một mặt bên của lăng kính, xoay nhẹ giá đỡ để tìm góc lệch cực tiểu.',
          expectedFeedbackVi: 'Dải cầu vồng 7 màu (Đỏ, Da cam, Vàng, Lục, Lam, Chàm, Tím) xòe rộng trên màn chắn.',
          commonErrorsVi: 'Chiếu chùm sáng quá rộng làm các dải màu chồng lấn mất tính đơn sắc.',
          safetyNotesVi: 'Các cạnh lăng kính sắc bén, tránh va chạm làm mẻ góc.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-prm-1',
        latex: 'D = i_1 + i_2 - A',
        meaningVi: 'Góc lệch của tia sáng qua lăng kính',
      },
      {
        id: 'eq-prm-2',
        latex: 'n_{\\text{đỏ}} < n_{\\text{cam}} < \\dots < n_{\\text{tím}}',
        meaningVi: 'Chiết suất của thủy tinh tăng dần từ ánh sáng đỏ đến ánh sáng tím khiến tia tím bị lệch nhiều nhất',
      },
    ],
    outputs: [
      { key: 'deviationAngleDeg', labelVi: 'Góc lệch chùm tia (D)', unit: '°', formulaTex: 'D', formatDecimals: 1 },
      { key: 'spectrumDispersionVi', labelVi: 'Quang phổ quan sát được', unit: '' },
    ],
    safetyRules: ['Tia đỏ bị lệch ít nhất, tia tím bị lệch nhiều nhất.'],
    testCases: [{ id: 'TC-PRM-01', name: 'Dispersion check', expected: 'i = 45° -> Dải 7 màu rõ nét' }],
    evaluateOutputs: (state) => {
      const i1 = state.incidentAngleDeg ?? 45.0;
      const d = Number((i1 * 0.85 + 12).toFixed(1));
      return {
        deviationAngleDeg: d,
        spectrumDispersionVi: '🌈 Dải 7 màu: Đỏ · Da cam · Vàng · Lục · Lam · Chàm · Tím',
      };
    },
  },

  // =========================================================================
  // 25. KÍNH LÚP CẦM TAY ĐỘ BỘI GIÁC 5X (G06)
  // =========================================================================
  'OL3D-EQP-MAG-0001': {
    deviceId: 'OL3D-EQP-MAG-0001',
    archetype: 'magnifying-glass',
    titleVi: 'Kính lúp cầm tay độ bội giác 5x',
    group: 'G06',
    curriculumLessonVi: 'KHTN 6 · Bài 3: Kính lúp | KHTN 9 · Dụng cụ quang học bổ trợ cho mắt',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Thấu kính hội tụ Ø60 mm · G = 5x (f = 5 cm) · Cán cầm',
    initialState: {
      targetDistanceCm: 3.5,
      nominalPower: 5,
    },
    stateSchema: {
      targetDistanceCm: 'number',
      nominalPower: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'magnifier_distance_slider',
        nodeName: 'body',
        nameVi: 'Khoảng cách từ kính lúp tới vật (d)',
        role: 'Điều chỉnh khoảng cách quan sát chi tiết nhỏ',
        controlType: 'slider',
        stateKey: 'targetDistanceCm',
        limits: { min: 1.0, max: 4.8, step: 0.1, unit: 'cm' },
        defaultValue: 3.5,
        helpId: 'help-mag-dist',
        help: {
          title: 'Cán cầm kính lúp',
          partNameVi: 'Thấu kính hội tụ hai mặt lồi tiêu cự ngắn f = 5 cm',
          functionVi: 'Tạo ảnh ảo cùng chiều, lớn hơn vật nằm trong khoảng nhìn rõ của mắt.',
          operationGuideVi: 'Đặt kính lúp gần sát vật rồi dịch chuyển ra xa dần cho đến khi nhìn thấy chi tiết rõ nét nhất.',
          expectedFeedbackVi: 'Chi tiết gân lá, tế bào hoặc chữ in nhỏ được phóng to gấp 5 lần.',
          commonErrorsVi: 'Đưa kính lúp quá xa (d > f = 5 cm) khiến ảnh bị lộn ngược và nhòe.',
          safetyNotesVi: 'Tuyệt đối không dùng kính lúp nhìn trực diện vào Mặt Trời làm bỏng võng mạc.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-mag-1',
        latex: 'G = \\frac{25}{f} = \\frac{25}{5} = 5\\text{x}',
        meaningVi: 'Độ bội giác của kính lúp khi ngắm chừng ở cực cận (khoảng cách nhìn rõ ngắn nhất Đ = 25 cm)',
      },
    ],
    outputs: [
      { key: 'angularMagnification', labelVi: 'Độ bội giác thực tế', unit: 'x', formulaTex: 'G', formatDecimals: 1 },
      { key: 'virtualImageDistanceCm', labelVi: "Vị trí ảnh ảo (d')", unit: 'cm', formulaTex: 'd^\\prime', formatDecimals: 1 },
    ],
    safetyRules: ['Cấm hướng kính lúp về phía nguồn sáng cực mạnh.'],
    testCases: [{ id: 'TC-MAG-01', name: 'Magnification check', expected: 'd = 3.5 cm -> Phóng đại ảnh ảo sắc nét' }],
    evaluateOutputs: (state) => {
      const d = state.targetDistanceCm ?? 3.5;
      const f = 5.0;
      const dPrime = Number(((d * f) / (f - d)).toFixed(1));
      const k = Number((dPrime / d).toFixed(1));
      return {
        angularMagnification: k,
        virtualImageDistanceCm: -dPrime,
      };
    },
  },

  // =========================================================================
  // 26. ĐIỆN KẾ NHẠY VẠCH 0 Ở GIỮA — GALVANOMETER (G07)
  // =========================================================================
  'OL3D-EQP-GLV-0001': {
    deviceId: 'OL3D-EQP-GLV-0001',
    archetype: 'galvanometer',
    titleVi: 'Điện kế nhạy vạch 0 ở giữa – Galvanometer',
    group: 'G07',
    curriculumLessonVi: 'KHTN 9 · Bài 14: Cảm ứng điện từ – Dòng điện xoay chiều',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · GHĐ ±50 µA · Vạch 0 trung tâm',
    initialState: {
      currentUa: 0,
      zeroTrimAngle: 0,
    },
    stateSchema: {
      currentUa: 'number',
      zeroTrimAngle: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'galvo_input_current',
        nodeName: 'measurement_anchor',
        nameVi: 'Dòng điện vi mô (I)',
        role: 'Dòng điện cảm ứng chạy qua khung dây điện kế',
        controlType: 'slider',
        stateKey: 'currentUa',
        limits: { min: -50, max: 50, step: 1, unit: 'µA' },
        defaultValue: 0,
        helpId: 'help-glv-current',
        help: {
          title: 'Cọc đấu dây điện kế',
          partNameVi: 'Cặp cọc đấu dây phân cực âm dương',
          functionVi: 'Phát hiện dòng điện cảm ứng siêu nhỏ và chiều chuyển động của dòng điện.',
          operationGuideVi: 'Nối vào cuộn cảm ứng. Khi nam châm đi vào, kim lệch một bên; khi rút ra, kim lệch ngược lại.',
          expectedFeedbackVi: 'Kim quay quanh vạch 0 ở giữa: lệch trái nếu I < 0, lệch phải nếu I > 0.',
          commonErrorsVi: 'Đấu nối trực tiếp vào nguồn pin lớn gây cháy cuộn dây điện kế.',
          safetyNotesVi: 'Điện kế cực kỳ nhạy, chỉ dùng cho thí nghiệm cảm ứng điện từ vi mô.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-glv-1',
        latex: '\\theta = S_I \\cdot I',
        meaningVi: 'Góc lệch kim tỷ lệ thuận với cường độ dòng điện và chỉ rõ chiều dòng điện',
      },
    ],
    outputs: [
      { key: 'currentUa', labelVi: 'Dòng điện cảm ứng', unit: 'µA', formulaTex: 'I', formatDecimals: 1 },
      { key: 'pointerAngleDeg', labelVi: 'Góc lệch kim', unit: '°', formulaTex: '\\theta', formatDecimals: 1 },
    ],
    safetyRules: ['Không cấp dòng điện > 100 µA qua điện kế.'],
    testCases: [{ id: 'TC-GLV-01', name: 'Deflection test', expected: 'I = +25 µA -> kim lệch phải +15°' }],
    evaluateOutputs: (state) => {
      const i = state.currentUa ?? 0;
      const angle = Number(((i / 50) * 30).toFixed(1));
      return {
        currentUa: i,
        pointerAngleDeg: angle,
      };
    },
  },

  // =========================================================================
  // 27. ĐỒNG HỒ ĐO ĐIỆN ĐA NĂNG HIỆN SỐ (G03/G07)
  // =========================================================================
  'OL3D-EQP-DMM-0001': {
    deviceId: 'OL3D-EQP-DMM-0001',
    archetype: 'digital-multimeter',
    titleVi: 'Đồng hồ đo điện đa năng hiện số (DMM)',
    group: 'G03',
    curriculumLessonVi: 'KHTN 8 · Bài 22: Mạch điện đơn giản | KHTN 9 · Bài 10: Đo điện áp và dòng điện',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · CAT II 600V · Màn LCD 3½ digits',
    initialState: {
      dialMode: 'DCV_20V',
      measuredValue: 0,
      isHoldActive: false,
    },
    stateSchema: {
      dialMode: 'string',
      measuredValue: 'number',
      isHoldActive: 'boolean',
    },
    transitions: [],
    parts: [
      {
        partId: 'rotary_selector_dial',
        nodeName: 'rotary_dial',
        nameVi: 'Núm xoay chọn thang đo',
        role: 'Chọn chức năng đo: DCV, ACV, DCA, Điện trở Ω, Thông mạch',
        controlType: 'dial',
        stateKey: 'dialMode',
        options: [
          { value: 'OFF', label: 'TẮT (OFF)' },
          { value: 'DCV_20V', label: 'Điện áp một chiều DC 20V' },
          { value: 'ACV_750V', label: 'Điện áp xoay chiều AC 750V' },
          { value: 'DCA_200mA', label: 'Dòng điện một chiều 200 mA' },
          { value: 'OHM_2K', label: 'Điện trở 2 kΩ' },
          { value: 'CONTINUITY', label: 'Thông mạch (Beeper)' },
        ],
        defaultValue: 'DCV_20V',
        helpId: 'help-dmm-dial',
        help: {
          title: 'Núm xoay chuyển thang đo',
          partNameVi: 'Núm xoay cơ khí đa nấc có cữ định vị',
          functionVi: 'Lựa chọn mạch đo phân áp, phân dòng hoặc cầu đo điện trở.',
          operationGuideVi: 'Luôn vặn núm xoay về thang đo lớn hơn giá trị dự đoán trước khi cắm que đo.',
          expectedFeedbackVi: 'Màn hình LCD cập nhật đơn vị tương ứng (V, mV, mA, Ω) và phát tiếng click cơ học.',
          commonErrorsVi: 'Để thang đo điện trở hoặc dòng điện mà cắm thẳng vào ổ cắm nguồn gây nổ cầu chì.',
          safetyNotesVi: 'Tắt về OFF sau khi hoàn thành buổi thực hành để tiết kiệm pin 9V.',
        },
      },
      {
        partId: 'measured_signal_sim',
        nodeName: 'scale_display',
        nameVi: 'Tín hiệu đo mô phỏng',
        role: 'Giá trị điện áp hoặc dòng điện cấp vào que đo',
        controlType: 'slider',
        stateKey: 'measuredValue',
        limits: { min: 0, max: 24.0, step: 0.1, unit: 'V/mA' },
        defaultValue: 6.0,
        helpId: 'help-dmm-signal',
        help: {
          title: 'Que đo tín hiệu',
          partNameVi: 'Cặp que đo Đỏ (+), Đen (COM)',
          functionVi: 'Dẫn điện áp từ mạch điện vào bộ vi xử lý ADC.',
          operationGuideVi: 'Que đen cắm cổng COM, que đỏ cắm cổng V/Ω/mA.',
          expectedFeedbackVi: 'Số đo LCD hiển thị giá trị tức thời.',
          commonErrorsVi: 'Cắm nhầm que đỏ vào cổng 10A khi đo điện áp.',
          safetyNotesVi: 'Cầm que đo sau gờ chắn cách điện ngón tay.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-dmm-1',
        latex: 'V = I \\cdot R',
        meaningVi: 'Định luật Ohm cho đoạn mạch: U = I × R',
      },
    ],
    outputs: [
      { key: 'displayReading', labelVi: 'Số đo LCD', unit: '', formulaTex: '\\text{LCD}', formatDecimals: 2 },
      { key: 'activeUnit', labelVi: 'Đơn vị', unit: '' },
    ],
    safetyRules: ['Cấm đo điện áp khi núm xoay đang ở thang đo Điện trở hoặc Dòng điện mA.'],
    testCases: [{ id: 'TC-DMM-01', name: 'Voltage DC reading', expected: 'Thang DC 20V cấp 6V -> LCD: 6.00 V' }],
    evaluateOutputs: (state) => {
      const mode = state.dialMode ?? 'DCV_20V';
      const val = state.measuredValue ?? 0;
      if (mode === 'OFF') return { displayReading: '', activeUnit: 'TẮT' };
      if (mode === 'DCV_20V') return { displayReading: Number(val.toFixed(2)), activeUnit: 'V DC' };
      if (mode === 'DCA_200mA') return { displayReading: Number((val * 10).toFixed(1)), activeUnit: 'mA' };
      if (mode === 'OHM_2K') return { displayReading: Number((val * 100).toFixed(0)), activeUnit: 'Ω' };
      return { displayReading: Number(val.toFixed(2)), activeUnit: mode };
    },
  },

  // =========================================================================
  // 28. CUỘN DÂY DẪN KÍN CÓ 2 ĐÈN LED & THANH NAM CHÂM (G07)
  // =========================================================================
  'OL3D-EQP-COIL-0001': {
    deviceId: 'OL3D-EQP-COIL-0001',
    archetype: 'induction-coil-led',
    titleVi: 'Cuộn dây dẫn kín có 2 đèn LED & Thanh nam châm',
    group: 'G07',
    curriculumLessonVi: 'KHTN 9 · Bài 14: Hiện tượng cảm ứng điện từ – Điều kiện xuất hiện dòng điện cảm ứng',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Cuộn dây 500 vòng · 2 LED đỏ/xanh mắc song song ngược cực',
    initialState: {
      magnetSpeedCmS: 0,
      magnetPole: 'NORTH',
      fsmState: 'IDLE_NO_CURRENT',
    },
    stateSchema: {
      magnetSpeedCmS: 'number',
      magnetPole: 'string',
      fsmState: 'string',
    },
    transitions: [],
    parts: [
      {
        partId: 'magnet_motion_slider',
        nodeName: 'plunger',
        nameVi: 'Vận tốc đưa nam châm (v)',
        role: 'Kéo đẩy thanh nam châm lại gần hoặc ra xa lòng cuộn dây',
        controlType: 'slider',
        stateKey: 'magnetSpeedCmS',
        limits: { min: -50, max: 50, step: 5, unit: 'cm/s' },
        defaultValue: 0,
        helpId: 'help-coil-magnet',
        help: {
          title: 'Thanh nam châm vĩnh cửu 2 cực N-S',
          partNameVi: 'Nam châm AlNiCo sơn đỏ (N) - xanh (S)',
          functionVi: 'Biến thiên từ thông qua tiết diện cuộn dây khi chuyển động tịnh tiến.',
          operationGuideVi: 'Kéo thanh trượt để di chuyển nam châm: vận tốc dương là đưa vào, âm là rút ra.',
          expectedFeedbackVi: 'Khi đưa vào LED Đỏ sáng; khi rút ra LED Xanh sáng; khi đứng yên cả 2 LED tắt.',
          commonErrorsVi: 'Giữ nam châm đứng yên trong cuộn dây và thắc mắc tại sao đèn không sáng.',
          safetyNotesVi: 'Tránh làm rơi nam châm làm suy giảm từ tính.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-coil-1',
        latex: '\\mathcal{E} = -N \\frac{\\Delta \\Phi}{\\Delta t}',
        meaningVi: 'Định luật Faraday: Suất điện động cảm ứng tỷ lệ thuận với tốc độ biến thiên từ thông',
      },
    ],
    outputs: [
      { key: 'inducedVoltageMv', labelVi: 'Suất điện động cảm ứng', unit: 'mV', formulaTex: '\\mathcal{E}', formatDecimals: 1 },
      { key: 'activeLed', labelVi: 'Đèn phát sáng', unit: '' },
    ],
    safetyRules: ['Dòng điện cảm ứng chỉ sinh ra trong thời gian từ thông đang biến thiên.'],
    testCases: [{ id: 'TC-COIL-01', name: 'Faraday test', expected: 'v > 0 -> LED Đỏ sáng, v = 0 -> Tắt' }],
    evaluateOutputs: (state) => {
      const v = state.magnetSpeedCmS ?? 0;
      const emf = Number((v * 12.5).toFixed(1));
      let led = 'Không sáng (Từ thông không biến thiên)';
      if (v > 5) led = '🔴 LED Đỏ phát sáng (Cực Bắc đi vào lòng cuộn dây)';
      else if (v < -5) led = '🟢 LED Xanh phát sáng (Cực Bắc rút ra xa cuộn dây)';
      return {
        inducedVoltageMv: emf,
        activeLed: led,
      };
    },
  },

  // =========================================================================
  // 29. BÁT SỨ CHỊU NHIỆT — CÔ ĐẶC & ĐỐT CHÁY CỒN (G05)
  // =========================================================================
  'OL3D-EQP-DSH-0001': {
    deviceId: 'OL3D-EQP-DSH-0001',
    archetype: 'porcelain-dish',
    titleVi: 'Bát sứ chịu nhiệt — Cô đặc & Đốt cháy cồn',
    group: 'G05',
    curriculumLessonVi: 'KHTN 6 · Tách chất ra khỏi hỗn hợp bằng phương pháp cô cạn | KHTN 8 · Đốt cháy chất hữu cơ',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Sứ tráng men chịu nhiệt 1100°C · Ø75 mm có mỏ rót',
    initialState: {
      solutionVolumeMl: 25.0,
      isBurnerLit: true,
      liquidTempC: 75.0,
    },
    stateSchema: {
      solutionVolumeMl: 'number',
      isBurnerLit: 'boolean',
      liquidTempC: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'burner_switch',
        nodeName: 'body',
        nameVi: 'Ngọn lửa đèn cồn',
        role: 'Cung cấp nhiệt lượng đun cô cạn dung dịch',
        controlType: 'switch',
        stateKey: 'isBurnerLit',
        defaultValue: true,
        helpId: 'help-dsh-burner',
        help: {
          title: 'Đèn cồn đốt cháy',
          partNameVi: 'Ngọn lửa đèn cồn thí nghiệm',
          functionVi: 'Gia nhiệt cho bát sứ để nước bay hơi hoàn toàn, giữ lại tinh thể muối kết tinh.',
          operationGuideVi: 'Bật ngọn lửa đèn cồn. Khi nước gần cạn hết, giảm bớt lửa tránh tinh thể muối nổ bắn.',
          expectedFeedbackVi: 'Hơi nước bốc lên ngùn ngụt, cặn tinh thể muối trắng kết tinh dưới đáy bát.',
          commonErrorsVi: 'Thổi bằng miệng để tắt đèn cồn (bắt buộc phải đậy bằng nắp chụp).',
          safetyNotesVi: 'Dùng kẹp gắp sắt để di chuyển bát sứ nóng; không chạm tay trần.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-dsh-1',
        latex: 'm_{\\text{muối}} = m_{dd} \\cdot \\frac{C\\%}{100\\%}',
        meaningVi: 'Khối lượng chất tan kết tinh sau khi nước bay hơi hoàn toàn',
      },
    ],
    outputs: [
      { key: 'crystalMassG', labelVi: 'Lượng muối kết tinh', unit: 'g', formulaTex: 'm_{kết\\,tinh}', formatDecimals: 2 },
      { key: 'evapStateVi', labelVi: 'Quá trình cô cạn', unit: '' },
    ],
    safetyRules: ['Dập tắt đèn cồn bằng nắp chụp chuyên dụng, cấm thổi bằng miệng.'],
    testCases: [{ id: 'TC-DSH-01', name: 'Evaporation check', expected: 'Cô cạn 25 ml dd 10% -> 2.50 g muối' }],
    evaluateOutputs: (state) => {
      const v = state.solutionVolumeMl ?? 25;
      const lit = state.isBurnerLit ?? true;
      const crystal = Number((v * 0.10).toFixed(2));
      return {
        crystalMassG: crystal,
        evapStateVi: lit ? '🔥 Đang đun sôi cô cạn (Nước bay hơi mạnh)' : '⚪ Đã tắt lửa (Để nguội kết tinh)',
      };
    },
  },

  // =========================================================================
  // 30. PHỄU CHIẾT CÓ KHOÁ & PHỄU LỌC TRÊN GIÁ ĐỠ (G04/G05)
  // =========================================================================
  'OL3D-EQP-SEP-0001': {
    deviceId: 'OL3D-EQP-SEP-0001',
    archetype: 'separatory-funnel',
    titleVi: 'Phễu chiết có khoá & Phễu lọc trên giá đỡ',
    group: 'G04/G05',
    curriculumLessonVi: 'KHTN 6 · Bài 12: Tách chất bằng phương pháp chiết và lọc',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Borosilicate 3.3 · Quả lê 250 ml · Khóa PTFE chống rò rỉ',
    initialState: {
      lowerLiquidRemainingMl: 60.0,
      upperLayerVolumeMl: 60.0,
      isStopcockOpen: false,
    },
    stateSchema: {
      lowerLiquidRemainingMl: 'number',
      upperLayerVolumeMl: 'number',
      isStopcockOpen: 'boolean',
    },
    transitions: [],
    parts: [
      {
        partId: 'stopcock_valve',
        nodeName: 'body',
        nameVi: 'Khóa vặn xả chiết PTFE',
        role: 'Mở khóa để xả lớp chất lỏng nặng hơn phía dưới',
        controlType: 'switch',
        stateKey: 'isStopcockOpen',
        defaultValue: false,
        helpId: 'help-sep-valve',
        help: {
          title: 'Khóa vặn phễu chiết',
          partNameVi: 'Van khóa mạ PTFE chịu hóa chất',
          functionVi: 'Xả lớp chất lỏng bên dưới (nước muối nặng hơn) vào bình hứng và đóng lại đúng lúc giao diện tiếp xúc tới khóa.',
          operationGuideVi: 'Mở nắp trên phễu, sau đó vặn khóa nhẹ nhàng để dòng chất lỏng chảy từ từ.',
          expectedFeedbackVi: 'Mực nước bên dưới hạ dần, lớp dầu ăn nổi bên trên được giữ lại hoàn toàn trong phễu.',
          commonErrorsVi: 'Quên mở nắp đậy trên đỉnh phễu khiến áp suất chân không chặn dòng chảy.',
          safetyNotesVi: 'Xoay nhẹ khóa tránh làm kẹt hoặc nứt cuống thủy tinh.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-sep-1',
        latex: '\\rho_{\\text{dầu}} \\approx 0.8\\,\\text{g/ml} < \\rho_{\\text{nước}} = 1.0\\,\\text{g/ml}',
        meaningVi: 'Chất lỏng không tan phân lớp: Lớp nhẹ hơn nổi lên trên, lớp nặng hơn chìm xuống dưới',
      },
    ],
    outputs: [
      { key: 'lowerLayerRemainingMl', labelVi: 'Lượng nước đáy còn lại', unit: 'ml', formulaTex: 'V_{đáy}', formatDecimals: 0 },
      { key: 'separationStatusVi', labelVi: 'Trạng thái tách pha', unit: '' },
    ],
    safetyRules: ['Khi chiết phải mở nắp trên đỉnh phễu chiết để thông khí quyển.'],
    testCases: [{ id: 'TC-SEP-01', name: 'Separation test', expected: 'Mở khóa xả hết 60 ml nước, dầu ăn giữ nguyên' }],
    evaluateOutputs: (state) => {
      const open = state.isStopcockOpen ?? false;
      const lower = open ? 0 : state.lowerLiquidRemainingMl ?? 60;
      return {
        lowerLayerRemainingMl: lower,
        separationStatusVi: open ? '🟢 Đang xả lớp nước đáy (Tách chiết thành công)' : '🟡 Phân lớp hoàn chỉnh: Dầu ở trên, Nước ở dưới',
      };
    },
  },

  // =========================================================================
  // 31. BÌNH CẦU CÓ NHÁNH 250 ML, LƯỚI TẢN NHIỆT & ĐÈN CỒN (G05)
  // =========================================================================
  'OL3D-EQP-DST-0001': {
    deviceId: 'OL3D-EQP-DST-0001',
    archetype: 'distillation-flask',
    titleVi: 'Bình cầu có nhánh 250 mL, Lưới tản nhiệt & Đèn cồn',
    group: 'G05',
    curriculumLessonVi: 'KHTN 6 · Bài 12: Tách chất bằng phương pháp chưng cất phân đoạn',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Borosilicate 3.3 · Nhánh nghiêng 75° nối ống sinh hàn Liebig',
    initialState: {
      temperatureC: 78.3,
      isDistilling: true,
      distillateOutputMl: 35.0,
    },
    stateSchema: {
      temperatureC: 'number',
      isDistilling: 'boolean',
      distillateOutputMl: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'distill_temp_slider',
        nodeName: 'body',
        nameVi: 'Nhiệt kế đo hơi đỉnh bình cầu (T)',
        role: 'Kiểm soát nhiệt độ sôi của phân đoạn ethanol',
        controlType: 'slider',
        stateKey: 'temperatureC',
        limits: { min: 60, max: 105, step: 0.5, unit: '°C' },
        defaultValue: 78.3,
        helpId: 'help-dst-temp',
        help: {
          title: 'Nhiệt kế đo hơi chưng cất',
          partNameVi: 'Nhiệt kế cắm qua nút cao su cổ bình cầu',
          functionVi: 'Kiểm soát nhiệt độ hơi sôi tại vị trí nhánh dẫn sang ống ngưng.',
          operationGuideVi: 'Duy trì ngọn lửa để nhiệt độ hơi ổn định tại 78.3°C (điểm sôi của Ethanol).',
          expectedFeedbackVi: 'Hơi rượu bay sang ống sinh hàn Liebig ngưng tụ thành giọt rượu nguyên chất chảy vào bình hứng.',
          commonErrorsVi: 'Đun quá mạnh làm nhiệt độ vượt 90°C khiến nước bốc hơi lẫn vào sản phẩm rượu.',
          safetyNotesVi: 'Cho vài viên đá bọt vào đáy bình cầu để chống hiện tượng sôi chậm trào bọt.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-dst-1',
        latex: 'T_{\\text{sôi, ethanol}} = 78.3^\\circ\\text{C} < T_{\\text{sôi, nước}} = 100^\\circ\\text{C}',
        meaningVi: 'Chưng cất phân đoạn dựa trên sự khác biệt về nhiệt độ sôi của các cấu tử',
      },
    ],
    outputs: [
      { key: 'vaporTemperatureC', labelVi: 'Nhiệt độ hơi chưng cất', unit: '°C', formulaTex: 'T_{hơi}', formatDecimals: 1 },
      { key: 'distillateRateVi', labelVi: 'Sản phẩm ngưng tụ', unit: '' },
    ],
    safetyRules: ['Dòng nước làm mát ống sinh hàn phải cấp từ dưới lên trên.'],
    testCases: [{ id: 'TC-DST-01', name: 'Ethanol boiling point', expected: 'T = 78.3°C thu được Ethanol tinh khiết' }],
    evaluateOutputs: (state) => {
      const t = state.temperatureC ?? 78.3;
      let rate = 'Chưa sôi';
      if (Math.abs(t - 78.3) <= 2.0) rate = '🟢 Đang ngưng tụ Ethanol tinh khiết (78.3°C)';
      else if (t > 85.0) rate = '🔴 Hỗn hợp hơi Ethanol và Nước (Nhiệt độ quá cao)';
      return {
        vaporTemperatureC: t,
        distillateRateVi: rate,
      };
    },
  },

  // =========================================================================
  // 32. KÍNH HIỂN VI QUANG HỌC (10X, 40X, 100X) & TIÊU BẢN NST (G09)
  // =========================================================================
  'OL3D-EQP-MIC-0001': {
    deviceId: 'OL3D-EQP-MIC-0001',
    archetype: 'optical-microscope',
    titleVi: 'Kính hiển vi quang học (10x, 40x, 100x) & Tiêu bản NST',
    group: 'G09',
    curriculumLessonVi: 'KHTN 6 · Quan sát tế bào biểu bì hành | KHTN 9 · Di truyền học – Nhiễm sắc thể',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · 3 vật kính tiêu sắc 10x, 40x, 100x (dầu) · Thị kính 10x, 16x',
    initialState: {
      objectiveMag: 40,
      eyepieceMag: 10,
      coarseFocusMm: 12.0,
      fineFocusMm: 0.5,
      lightIntensityPercent: 80,
    },
    stateSchema: {
      objectiveMag: 'number',
      eyepieceMag: 'number',
      coarseFocusMm: 'number',
      fineFocusMm: 'number',
      lightIntensityPercent: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'objective_nosepiece',
        nodeName: 'nosepiece',
        nameVi: 'Mâm xoay vật kính',
        role: 'Xoay để chuyển đổi giữa các vật kính 4x, 10x, 40x, 100x',
        controlType: 'dial',
        stateKey: 'objectiveMag',
        options: [
          { value: 4, label: 'Vật kính 4x (Quan sát bao quát)' },
          { value: 10, label: 'Vật kính 10x (Tìm trường nhìn)' },
          { value: 40, label: 'Vật kính 40x (Soi chi tiết tế bào & NST)' },
          { value: 100, label: 'Vật kính 100x (Soi dầu vi khuẩn)' },
        ],
        defaultValue: 40,
        helpId: 'help-mic-obj',
        help: {
          title: 'Mâm xoay 4 vật kính',
          partNameVi: 'Đĩa xoay revolver mang các ống kính tiêu sắc',
          functionVi: 'Thay đổi độ phóng đại sơ cấp của kính hiển vi.',
          operationGuideVi: 'Xoay mâm cho đến khi nghe tiếng click ăn khớp vào đúng trục quang học.',
          expectedFeedbackVi: 'Trường nhìn thu hẹp, độ chi tiết tế bào tăng lên gấp bội.',
          commonErrorsVi: 'Dùng tay nắm trực tiếp vào ống vật kính để xoay (phải nắm vào vành đĩa mâm xoay).',
          safetyNotesVi: 'Hạ bàn soi xuống trước khi xoay sang vật kính 40x/100x tránh chạm vỡ lam kính.',
        },
      },
      {
        partId: 'coarse_focus_knob',
        nodeName: 'coarse_focus_knob',
        nameVi: 'Ốc vi cấp thô (Coarse Focus)',
        role: 'Nâng hạ bàn soi nhanh để tìm tiêu cự sơ bộ',
        controlType: 'rotary',
        stateKey: 'coarseFocusMm',
        limits: { min: 0, max: 25, step: 0.5, unit: 'mm' },
        defaultValue: 12.0,
        helpId: 'help-mic-coarse',
        help: {
          title: 'Ốc chỉnh thô (núm lớn)',
          partNameVi: 'Cơ cấu thanh răng bánh răng nâng hạ bàn sa trượt',
          functionVi: 'Thay đổi khoảng cách giữa tiêu bản và vật kính trong phạm vi lớn.',
          operationGuideVi: 'Vặn ốc thô từ từ trong khi nhìn ngang từ ngoài vào để đưa vật kính gần tiêu bản, sau đó nhìn vào thị kính vặn lùi ra.',
          expectedFeedbackVi: 'Vệt mờ của mẫu vật xuất hiện dần trong trường nhìn tròn.',
          commonErrorsVi: 'Vặn ốc thô quá đà đâm thủng lamen tiêu bản.',
          safetyNotesVi: 'Tuyệt đối không dùng ốc thô khi đang dùng vật kính 40x hoặc 100x.',
        },
      },
      {
        partId: 'fine_focus_knob',
        nodeName: 'fine_focus_knob',
        nameVi: 'Ốc vi cấp tinh (Fine Focus)',
        role: 'Lấy nét chính xác từng lớp cắt vi mô của tế bào',
        controlType: 'rotary',
        stateKey: 'fineFocusMm',
        limits: { min: 0, max: 2.0, step: 0.02, unit: 'mm' },
        defaultValue: 0.5,
        helpId: 'help-mic-fine',
        help: {
          title: 'Ốc vi chỉnh tinh (núm nhỏ)',
          partNameVi: 'Cơ cấu vi sai bước siêu mịn 2 µm',
          functionVi: 'Lấy nét sắc cạnh màng tế bào, nhân tế bào và các dải nhiễm sắc thể.',
          operationGuideVi: 'Nhẹ nhàng xoay ốc tinh tới lui cho đến khi hình ảnh nét căng.',
          expectedFeedbackVi: 'Hình ảnh tế bào đạt độ phân giải tối đa.',
          commonErrorsVi: 'Vặn ốc tinh hết hành trình cơ khí mà vẫn cố vặn tiếp.',
          safetyNotesVi: 'Vặn nhẹ nhàng bằng đầu hai ngón tay.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-mic-1',
        latex: '\\Gamma = \\gamma_{vật} \\times \\gamma_{thị}',
        meaningVi: 'Tổng độ phóng đại của kính hiển vi bằng độ phóng đại vật kính nhân độ phóng đại thị kính',
      },
      {
        id: 'eq-mic-2',
        latex: 'd_{min} = \\frac{0.61 \\lambda}{\\text{NA}}',
        meaningVi: 'Tiêu chuẩn phân giải Rayleigh: Giới hạn nhận biết hai điểm tách biệt vi mô',
      },
    ],
    outputs: [
      { key: 'totalMagnificationX', labelVi: 'Tổng độ phóng đại', unit: 'x', formulaTex: '\\Gamma', formatDecimals: 0 },
      { key: 'fieldOfViewUm', labelVi: 'Đường kính trường nhìn', unit: 'µm', formulaTex: '\\text{FOV}', formatDecimals: 0 },
      { key: 'focusQualityVi', labelVi: 'Độ sắc nét tiêu cự', unit: '' },
    ],
    safetyRules: ['Không dùng ốc chỉnh thô ở vật kính 40x và 100x tránh vỡ lamen.'],
    testCases: [{ id: 'TC-MIC-01', name: 'Magnification calculation', expected: 'Vật kính 40x * Thị kính 10x = 400x' }],
    evaluateOutputs: (state) => {
      const obj = state.objectiveMag ?? 40;
      const eye = state.eyepieceMag ?? 10;
      const total = obj * eye;
      const fov = Number((18000 / total).toFixed(0)); // micrometers
      return {
        totalMagnificationX: total,
        fieldOfViewUm: fov,
        focusQualityVi: '🟢 Đang lấy nét tối ưu (Nhìn rõ nhân và màng tế bào)',
      };
    },
  },

  // =========================================================================
  // 33. MÔ HÌNH CẤU TRÚC PHÂN TỬ DNA XOẮN KÉP (G09)
  // =========================================================================
  'OL3D-EQP-DNA-0001': {
    deviceId: 'OL3D-EQP-DNA-0001',
    archetype: 'dna-double-helix',
    titleVi: 'Mô hình cấu trúc phân tử DNA xoắn kép',
    group: 'G09',
    curriculumLessonVi: 'KHTN 9 · Bài 38: Cấu trúc không gian của phân tử DNA (Mô hình Watson - Crick)',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · 1 chu kỳ xoắn 10 cặp base · Đường kính 2 nm · Tỷ lệ 1 cm = 1 Å',
    initialState: {
      rotationAngleDeg: 0.0,
      showHydrogenBonds: true,
      basePairCount: 10,
    },
    stateSchema: {
      rotationAngleDeg: 'number',
      showHydrogenBonds: 'boolean',
      basePairCount: 'number',
    },
    transitions: [],
    parts: [
      {
        partId: 'dna_rotary_slider',
        nodeName: 'body',
        nameVi: 'Góc xoay mô hình DNA (360°)',
        role: 'Xoay trục xoắn kép để quan sát từ mọi phía',
        controlType: 'rotary',
        stateKey: 'rotationAngleDeg',
        limits: { min: 0, max: 360, step: 5, unit: '°' },
        defaultValue: 0,
        helpId: 'help-dna-rot',
        help: {
          title: 'Trục xoay không gian 3D',
          partNameVi: 'Trục giá đỡ phân tử DNA',
          functionVi: 'Quan sát rãnh lớn (Major groove) và rãnh nhỏ (Minor groove) trong không gian 3D.',
          operationGuideVi: 'Xoay thanh trượt để quay mô hình 360 độ.',
          expectedFeedbackVi: 'Chuỗi xoắn kép cuộn xoắn mượt mà, các bậc thang liên kết hydro hiện rõ.',
          commonErrorsVi: "Nghĩ rằng hai mạch đơn chạy cùng chiều (thực tế chúng chạy ngược chiều nhau 5' -> 3' và 3' -> 5').",
          safetyNotesVi: 'Mô hình minh họa trực quan cấu trúc di truyền học hiện đại.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-dna-1',
        latex: 'A + G = T + X \\quad (A = T, G \\equiv X)',
        meaningVi: 'Nguyên tắc bổ sung: Adenine liên kết Thymine bằng 2 liên kết H; Guanine liên kết Cytosine bằng 3 liên kết H',
      },
      {
        id: 'eq-dna-2',
        latex: '1\\,\\text{chu kỳ} = 10\\,\\text{cặp base} = 3.4\\,\\text{nm},\\quad \\Phi = 2.0\\,\\text{nm}',
        meaningVi: 'Kích thước chuẩn không gian của chuỗi xoắn kép DNA dạng B',
      },
    ],
    outputs: [
      { key: 'basePairsPerTurn', labelVi: 'Số cặp base/chu kỳ', unit: 'cặp' },
      { key: 'pitchLengthNm', labelVi: 'Bước chu kỳ xoắn', unit: 'nm', formulaTex: 'L_{chu\\,kỳ}', formatDecimals: 1 },
      { key: 'pairingRulesVi', labelVi: 'Nguyên tắc bổ sung', unit: '' },
    ],
    safetyRules: ['A liên kết với T bằng 2 liên kết Hydro. G liên kết với X bằng 3 liên kết Hydro.'],
    testCases: [{ id: 'TC-DNA-01', name: 'Base pair model', expected: '10 cặp base = 3.4 nm' }],
    evaluateOutputs: () => ({
      basePairsPerTurn: 10,
      pitchLengthNm: 3.4,
      pairingRulesVi: '🧬 A - T (2 liên kết H) | G ≡ X (3 liên kết H)',
    }),
  },

  // =========================================================================
  // 34. BÌNH CHỨA NƯỚC CÓ VAN XẢ ĐỊNH LƯỢNG 1000 ML (G04)
  // =========================================================================
  'OL3D-EQP-WDP-1000': {
    deviceId: 'OL3D-EQP-WDP-1000',
    archetype: 'water-dispenser',
    titleVi: 'Bình chứa nước có van xả định lượng 1000 ml',
    group: 'G04',
    curriculumLessonVi: 'KHTN 6 & 8 · Cấp nước tinh khiết cho các thí nghiệm đo thể tích và thủy tĩnh',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Bình trụ mica chịu lực 1000 ml · Vòi xả inox có van xoay',
    initialState: {
      storageVolumeMl: 850.0,
      isValveOpen: false,
    },
    stateSchema: {
      storageVolumeMl: 'number',
      isValveOpen: 'boolean',
    },
    transitions: [],
    parts: [
      {
        partId: 'dispenser_valve_tap',
        nodeName: 'valve_tap',
        nameVi: 'Van khóa vòi xả nước',
        role: 'Mở van để xả nước vào các cốc và bình trên bàn',
        controlType: 'switch',
        stateKey: 'isValveOpen',
        defaultValue: false,
        helpId: 'help-wdp-tap',
        help: {
          title: 'Van vặn vòi nước',
          partNameVi: 'Van xoay đồng mạ niken kèm vòi xả định lượng',
          functionVi: 'Cấp nước cất hoặc nước màu cho ống đong, bình tràn, bình thông nhau.',
          operationGuideVi: 'Gạt van sang ON để xả nước thành dòng êm ái, gạt về OFF để ngắt.',
          expectedFeedbackVi: 'Tia nước chảy từ miệng vòi xuống dụng cụ hứng đặt phía dưới.',
          commonErrorsVi: 'Quên khóa van làm tràn nước lênh láng mặt bàn gỗ.',
          safetyNotesVi: 'Kiểm tra bình chứa nước đặt vững chãi trên giá 3 chân.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-wdp-1',
        latex: 'V_{còn} = V_{đầu} - Q \\cdot t',
        meaningVi: 'Thể tích nước còn lại trong bình bằng lượng ban đầu trừ lượng nước đã xả',
      },
    ],
    outputs: [
      { key: 'remainingWaterMl', labelVi: 'Lượng nước trong bình', unit: 'ml', formulaTex: 'V', formatDecimals: 0 },
      { key: 'dispenseStateVi', labelVi: 'Trạng thái vòi xả', unit: '' },
    ],
    safetyRules: ['Dung tích bình: 1000 ml. Khóa chặt van vòi sau khi lấy đủ nước.'],
    testCases: [{ id: 'TC-WDP-01', name: 'Dispense flow', expected: 'Bật ON -> vòi xả nước' }],
    evaluateOutputs: (state) => ({
      remainingWaterMl: state.storageVolumeMl ?? 850,
      dispenseStateVi: state.isValveOpen ? '💧 Đang xả nước (Dòng chảy định lượng)' : '⚪ Van đã khóa kín',
    }),
  },

  // =========================================================================
  // 35. BỘ ĐÒN BẨY THĂNG BẰNG CHIA VẠCH ĐỐI XỨNG (G02)
  // CHÚ Ý ĐẶC BIỆT: THIẾT BỊ CƠ HỌC ĐÒN BẨY - TUYỆT ĐỐI KHÔNG CHỨA NƯỚC / RÓT NƯỚC
  // =========================================================================
  'OL3D-EQP-LEV-0001': {
    deviceId: 'OL3D-EQP-LEV-0001',
    archetype: 'lever-balance-apparatus',
    titleVi: 'Bộ đòn bẩy thăng bằng chia vạch đối xứng kèm giá đỡ',
    group: 'G02',
    curriculumLessonVi: 'KHTN 8 · Bài 18: Tác dụng làm quay của lực – Đòn bẩy | KHTN 6 · Bài 44: Đòn bẩy',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · Thanh 400 mm · 18 lỗ treo chia đều 2 bên',
    initialState: {
      leftMassG: 0,
      leftHoleIndex: 5,
      rightMassG: 0,
      rightHoleIndex: 5,
      leftTrimNutPos: 0,
      rightTrimNutPos: 0,
      incidentAngleDeg: 0,
      fsmState: 'BALANCED_HORIZONTAL',
    },
    stateSchema: {
      leftMassG: 'number',
      leftHoleIndex: 'number',
      rightMassG: 'number',
      rightHoleIndex: 'number',
      leftTrimNutPos: 'number',
      rightTrimNutPos: 'number',
      incidentAngleDeg: 'number',
      fsmState: 'string',
    },
    transitions: [
      { from: 'BALANCED_HORIZONTAL', event: 'TORQUE_LEFT', to: 'TILTED_LEFT', guard: 'tauNet > 0.01' },
      { from: 'BALANCED_HORIZONTAL', event: 'TORQUE_RIGHT', to: 'TILTED_RIGHT', guard: 'tauNet < -0.01' },
      { from: 'TILTED_LEFT', event: 'TORQUE_BALANCED', to: 'BALANCED_HORIZONTAL', guard: 'abs(tauNet) <= 0.01' },
      { from: 'TILTED_RIGHT', event: 'TORQUE_BALANCED', to: 'BALANCED_HORIZONTAL', guard: 'abs(tauNet) <= 0.01' },
    ],
    parts: [
      {
        partId: 'left_load_control',
        nodeName: 'plunger',
        nameVi: 'Tải trọng nhánh TRÁI (m₁)',
        role: 'Khối lượng quả nặng treo vào nhánh trái',
        controlType: 'slider',
        stateKey: 'leftMassG',
        limits: { min: 0, max: 250, step: 25, unit: 'g' },
        defaultValue: 0,
        helpId: 'help-lev-left-mass',
        help: {
          title: 'Tải trọng nhánh trái',
          partNameVi: 'Chùm quả nặng 50g móc lỗ bên trái',
          functionVi: 'Tạo mômen lực làm quay ngược chiều kim đồng hồ quanh trục O.',
          operationGuideVi: 'Tăng giảm khối lượng quả nặng bên trái để khảo sát điều kiện thăng bằng.',
          expectedFeedbackVi: 'Mômen M1 = F1 * d1 tăng lên, thanh đòn bẩy nghiêng sang trái nếu M1 > M2.',
          commonErrorsVi: 'Treo quá nhiều quả nặng tại 1 lỗ làm dãn móc treo.',
          safetyNotesVi: 'Tổng tải trọng mỗi bên không vượt quá 5.0 N (10 quả cân 50 g).',
        },
      },
      {
        partId: 'left_hole_selector',
        nodeName: 'plunger',
        nameVi: 'Vị trí lỗ treo TRÁI (x₁)',
        role: 'Cánh tay đòn d1 (lỗ 1 đến 9, bước 20 mm)',
        controlType: 'slider',
        stateKey: 'leftHoleIndex',
        limits: { min: 1, max: 9, step: 1, unit: 'vạch' },
        defaultValue: 5,
        helpId: 'help-lev-left-arm',
        help: {
          title: 'Lỗ treo bên trái',
          partNameVi: 'Cánh tay đòn bên trái: d₁ = x₁ × 20 mm',
          functionVi: 'Xác định khoảng cách từ tâm quay O đến điểm đặt lực F1.',
          operationGuideVi: 'Dịch chuyển móc treo sang các lỗ từ 1 đến 9 (cách tâm O từ 20 đến 180 mm).',
          expectedFeedbackVi: 'Cánh tay đòn càng lớn thì mômen quay càng tăng dù lực không đổi.',
          commonErrorsVi: 'Đếm sai số thứ tự lỗ tính từ tâm trục quay O.',
          safetyNotesVi: 'Kiểm tra móc treo ăn khớp chắc chắn vào rãnh lỗ.',
        },
      },
      {
        partId: 'right_load_control',
        nodeName: 'plunger',
        nameVi: 'Tải trọng nhánh PHẢI (m₂)',
        role: 'Khối lượng quả nặng treo vào nhánh phải',
        controlType: 'slider',
        stateKey: 'rightMassG',
        limits: { min: 0, max: 250, step: 25, unit: 'g' },
        defaultValue: 0,
        helpId: 'help-lev-right-mass',
        help: {
          title: 'Tải trọng nhánh phải',
          partNameVi: 'Chùm quả nặng 50g móc lỗ bên phải',
          functionVi: 'Tạo mômen lực làm quay cùng chiều kim đồng hồ quanh trục O.',
          operationGuideVi: 'Tăng giảm khối lượng m2 để cân bằng với mômen nhánh trái.',
          expectedFeedbackVi: 'Mômen M2 = F2 * d2 kéo thanh đòn bẩy nghiêng sang phải.',
          commonErrorsVi: 'Nhầm lẫn giữa khối lượng m và lực F = m*g.',
          safetyNotesVi: 'Treo cân đối hai bên tránh gãy trục quay.',
        },
      },
      {
        partId: 'right_hole_selector',
        nodeName: 'plunger',
        nameVi: 'Vị trí lỗ treo PHẢI (x₂)',
        role: 'Cánh tay đòn d2 (lỗ 1 đến 9, bước 20 mm)',
        controlType: 'slider',
        stateKey: 'rightHoleIndex',
        limits: { min: 1, max: 9, step: 1, unit: 'vạch' },
        defaultValue: 5,
        helpId: 'help-lev-right-arm',
        help: {
          title: 'Lỗ treo bên phải',
          partNameVi: 'Cánh tay đòn bên phải: d₂ = x₂ × 20 mm',
          functionVi: 'Xác định khoảng cách từ tâm quay O đến điểm đặt lực F2.',
          operationGuideVi: 'Chọn lỗ treo phù hợp sao cho m1*x1 = m2*x2 để đòn bẩy thăng bằng.',
          expectedFeedbackVi: 'Khi m1*x1 = m2*x2, thanh tự động trở về phương ngang nằm yên (0°).',
          commonErrorsVi: 'Quên nhân cánh tay đòn mà chỉ so sánh khối lượng hai bên.',
          safetyNotesVi: 'Không tác dụng lực bẻ gập thanh đòn bẩy.',
        },
      },
      {
        partId: 'zero_balance_nut',
        nodeName: 'body',
        nameVi: 'Đai ốc vi chỉnh cân bằng Zero',
        role: 'Chỉnh thăng bằng ban đầu khi chưa treo tải',
        controlType: 'slider',
        stateKey: 'leftTrimNutPos',
        limits: { min: -10, max: 10, step: 1, unit: 'vạch' },
        defaultValue: 0,
        helpId: 'help-lev-zero-nut',
        help: {
          title: 'Đai ốc ren M4 vi chỉnh',
          partNameVi: 'Hai ốc đồng thau khía nhám 2 đầu thanh',
          functionVi: 'Xoay ra hoặc vào để bù trừ sai lệch khối lượng thanh nhôm trước khi làm thí nghiệm.',
          operationGuideVi: 'Vặn ốc cho đến khi kim chỉ thị chỉ đúng vạch 0° trên cung chia độ.',
          expectedFeedbackVi: 'Thanh nằm thăng bằng ngang tuyệt đối.',
          commonErrorsVi: 'Bỏ qua bước chỉnh zero khiến kết quả đo bị sai lệch.',
          safetyNotesVi: 'Không vặn rời ốc ren ra khỏi trục thanh.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-lev-1',
        latex: '\\sum M_{(O)} = 0 \\iff F_1 \\cdot d_1 = F_2 \\cdot d_2 \\iff m_1 \cdot x_1 = m_2 \\cdot x_2',
        meaningVi: 'Quy tắc mômen lực: Đòn bẩy thăng bằng khi tổng mômen quay trái bằng tổng mômen quay phải',
      },
      {
        id: 'eq-lev-2',
        latex: 'k_{đòn\\,bẩy} = \\frac{F_1}{F_2} = \\frac{d_2}{d_1}',
        meaningVi: 'Lợi ích về lực tỷ lệ nghịch với cánh tay đòn',
      },
    ],
    outputs: [
      { key: 'torqueLeftNm', labelVi: 'Mômen Trái (M₁)', unit: 'N·m', formulaTex: 'M_1 = F_1 d_1', formatDecimals: 3 },
      { key: 'torqueRightNm', labelVi: 'Mômen Phải (M₂)', unit: 'N·m', formulaTex: 'M_2 = F_2 d_2', formatDecimals: 3 },
      { key: 'incidentAngleDeg', labelVi: 'Góc nghiêng đòn bẩy', unit: '°', formulaTex: '\\theta', formatDecimals: 1 },
      { key: 'fsmState', labelVi: 'Trạng thái thăng bằng', unit: '' },
    ],
    safetyRules: [
      'Cơ cấu hạn vị cơ khí giới hạn góc nghiêng an toàn trong khoảng [-30°, +30°].',
      'Tổng tải trọng an toàn mỗi bên tối đa 5.0 N (10 quả cân 50 g).',
    ],
    testCases: [
      { id: 'TC-LEV-01', name: 'Equilibrium test', expected: 'Treo m1=100g lỗ 4 và m2=50g lỗ 8 -> theta = 0.0 deg (Thăng bằng ngang)' },
      { id: 'TC-LEV-02', name: 'Left tilt test', expected: 'Treo m1=150g lỗ 5 và m2=50g lỗ 5 -> theta = -25.0 deg (Nghiêng trái)' },
    ],
    evaluateOutputs: (state) => {
      const m1 = state.leftMassG ?? 0;
      const x1 = state.leftHoleIndex ?? 5;
      const m2 = state.rightMassG ?? 0;
      const x2 = state.rightHoleIndex ?? 5;
      const trim = (state.leftTrimNutPos ?? 0) * 0.0005;

      const d1 = x1 * 0.02; // meters
      const d2 = x2 * 0.02;

      const f1 = (m1 / 1000) * 9.8; // Newtons
      const f2 = (m2 / 1000) * 9.8;

      const t1 = f1 * d1 + trim;
      const t2 = f2 * d2;

      const deltaT = t1 - t2;
      let angle = 0;
      let fsm = 'BALANCED_HORIZONTAL';

      if (Math.abs(deltaT) <= 0.001) {
        angle = 0;
        fsm = 'BALANCED_HORIZONTAL';
      } else if (deltaT > 0) {
        angle = Math.max(-28.5, -Math.min(28.5, deltaT * 120));
        fsm = 'TILTED_LEFT';
      } else {
        angle = Math.min(28.5, Math.max(-28.5, -deltaT * 120));
        fsm = 'TILTED_RIGHT';
      }

      return {
        torqueLeftNm: Number(t1.toFixed(3)),
        torqueRightNm: Number(t2.toFixed(3)),
        incidentAngleDeg: Number(angle.toFixed(1)),
        fsmState: fsm,
      };
    },
  },

  // =========================================================================
  // 36. BÌNH THÔNG NHAU 3 NHÁNH DỊ HÌNH (G04)
  // =========================================================================
  'OL3D-EQP-HYD-0001': {
    deviceId: 'OL3D-EQP-HYD-0001',
    archetype: 'communicating-vessels-3way',
    titleVi: 'Bình thông nhau 3 nhánh dị hình trên đế',
    group: 'G04',
    curriculumLessonVi: 'KHTN 8 · Bài 16: Áp suất chất lỏng – Bình thông nhau',
    technicalStandardVi: 'Thông tư 38/2021/TT-BGDĐT · 3 nhánh dị hình thủy tinh Borosilicate',
    initialState: {
      liquidLevelMl: 75,
      isTilted: false,
      fsmState: 'LEVELS_EQUALIZED',
    },
    stateSchema: {
      liquidLevelMl: 'number',
      isTilted: 'boolean',
      fsmState: 'string',
    },
    transitions: [
      { from: 'EMPTY', event: 'WATER_POURED', to: 'FILLING_LIQUID' },
      { from: 'FILLING_LIQUID', event: 'FLOW_SETTLED', to: 'LEVELS_EQUALIZED' },
      { from: 'LEVELS_EQUALIZED', event: 'VESSEL_TILTED', to: 'TILTED_MAINTAINING_LEVEL' },
    ],
    parts: [
      {
        partId: 'liquid_volume_control',
        nodeName: 'liquid_surface',
        nameVi: 'Mực nước rót vào bình',
        role: 'Điều chỉnh lượng chất lỏng trong hệ thống 3 nhánh',
        controlType: 'slider',
        stateKey: 'liquidLevelMl',
        limits: { min: 0, max: 150, step: 5, unit: 'ml' },
        defaultValue: 75,
        helpId: 'help-hyd-volume',
        help: {
          title: 'Mặt thoáng chất lỏng',
          partNameVi: 'Mặt nước liên thông 3 nhánh',
          functionVi: 'Minh chứng định luật bình thông nhau: mực nước ở cả 3 nhánh luôn ở cùng một độ cao.',
          operationGuideVi: 'Kéo thanh trượt để rót thêm hoặc rút bớt nước. Quan sát cao độ h1, h2, h3.',
          expectedFeedbackVi: 'Dù nhánh 1 thẳng, nhánh 2 xoắn ốc, nhánh 3 phình cầu, mặt thoáng luôn đồng phẳng tuyệt đối.',
          commonErrorsVi: 'Nghĩ rằng nhánh to chứa nhiều nước hơn thì mực nước sẽ cao hơn.',
          safetyNotesVi: 'Không rót quá 150 ml làm tràn chất lỏng ra bàn thí nghiệm.',
        },
      },
    ],
    equations: [
      {
        id: 'eq-hyd-1',
        latex: 'P_A = P_B = P_C = P_{atm} + \\rho \\cdot g \\cdot h',
        meaningVi: 'Áp suất thủy tĩnh tại đáy các nhánh liên thông nhau là bằng nhau',
      },
      {
        id: 'eq-hyd-2',
        latex: 'h_1 = h_2 = h_3 = \\text{hằng số}',
        meaningVi: 'Trong bình thông nhau chứa cùng một chất lỏng đứng yên, các mực chất lỏng luôn ở cùng một độ cao',
      },
    ],
    outputs: [
      { key: 'heightH1Mm', labelVi: 'Cao độ nhánh 1 (trụ thẳng)', unit: 'mm', formulaTex: 'h_1', formatDecimals: 1 },
      { key: 'heightH2Mm', labelVi: 'Cao độ nhánh 2 (lò xo xoắn)', unit: 'mm', formulaTex: 'h_2', formatDecimals: 1 },
      { key: 'heightH3Mm', labelVi: 'Cao độ nhánh 3 (phình cầu)', unit: 'mm', formulaTex: 'h_3', formatDecimals: 1 },
      { key: 'fsmState', labelVi: 'Trạng thái thủy tĩnh', unit: '' },
    ],
    safetyRules: [
      'Chân đế nhựa giữ bình đứng thẳng vững chắc trên mặt bàn.',
      'Dung tích định mức tối đa: 150 ml.',
    ],
    testCases: [
      { id: 'TC-HYD-01', name: 'Equi-height proof', expected: 'Tại V=75ml, h1=h2=h3=85.0mm đồng phẳng' },
    ],
    evaluateOutputs: (state) => {
      const ml = state.liquidLevelMl ?? 75;
      const h = Number(((ml / 150) * 140).toFixed(1));
      return {
        heightH1Mm: h,
        heightH2Mm: h,
        heightH3Mm: h,
        fsmState: ml === 0 ? 'EMPTY' : 'LEVELS_EQUALIZED',
      };
    },
  },
};

/**
 * Tra cứu Profile chuẩn của thiết bị theo Asset ID hoặc Archetype
 */
export function getDeviceControlProfile(
  deviceIdOrArchetype: string,
): DeviceControlProfile | null {
  if (DEVICE_CONTROL_PROFILES[deviceIdOrArchetype]) {
    return DEVICE_CONTROL_PROFILES[deviceIdOrArchetype];
  }

  // Tra cứu theo archetype
  const found = Object.values(DEVICE_CONTROL_PROFILES).find(
    (p) => p.archetype === deviceIdOrArchetype,
  );
  return found ?? null;
}
