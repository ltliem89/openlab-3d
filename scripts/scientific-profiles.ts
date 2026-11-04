export interface EquipmentScientificProfile {
  mathFormulas: { latex: string; explanation: string }[];
  stateMachine: {
    initialState: string;
    states: string[];
    transitions: { from: string; to: string; trigger: string; guard: string }[];
  };
  errorBudget: {
    instrumentalError: string;
    leastCount: string;
    repeatability: string;
    temperatureDrift: string;
  };
  geometryDetails: {
    meshPart: string;
    threeClass: string;
    pbrMaterial: string;
    renderOrder: number;
    specialRole: string;
  }[];
  fmea: {
    failureMode: string;
    rootCause: string;
    systemEffect: string;
    detectionMethod: string;
    recoveryAction: string;
  }[];
}

export const SCIENTIFIC_PROFILES: Record<string, EquipmentScientificProfile> = {
  'OL3D-EQP-BAL-0001': {
    mathFormulas: [
      { latex: 'm_{net} = \\max\\left(0, m_{gross} - m_{tare}\\right)', explanation: 'Số chỉ khối lượng tịnh sau khi trừ bì (TARE Offset).' },
      { latex: 'm(t) = m_{final} \\cdot \\left(1 - e^{-t / \\tau}\\right) + \\epsilon_{Gauss}(0, \\sigma^2)', explanation: 'Động học đáp ứng cảm biến Loadcell và nhiễu vi chấn động không khí ($\\tau \\approx 0.35\\text{ s}$, $\\sigma = 0.005\\text{ g}$).' },
      { latex: 'm_{thermal} = m_0 \\cdot \\left[1 + \\alpha_{loadcell} \\cdot (T_{air} - 25^\\circ\\text{C})\\right]', explanation: 'Hiệu ứng trôi nhiệt độ độ nhạy cảm biến biến dạng ($\\alpha_{loadcell} \\approx 1.5 \\times 10^{-5}\\,\\text{K}^{-1}$).' }
    ],
    stateMachine: {
      initialState: 'IDLE_ZERO',
      states: ['IDLE_ZERO', 'WEIGHING_SETTLING', 'STABLE_LOCKED', 'OVERLOAD_ERROR'],
      transitions: [
        { from: 'IDLE_ZERO', to: 'WEIGHING_SETTLING', trigger: 'Object placed on pan', guard: 'm_gross > 0.05 g' },
        { from: 'WEIGHING_SETTLING', to: 'STABLE_LOCKED', trigger: 'Settling timer elapsed', guard: '|dm/dt| < 0.01 g/s for 1.2s' },
        { from: 'WEIGHING_SETTLING', to: 'OVERLOAD_ERROR', trigger: 'Load exceeds capacity', guard: 'm_gross > 550.0 g' },
        { from: 'STABLE_LOCKED', to: 'IDLE_ZERO', trigger: 'TARE button pressed', guard: 'true' }
      ]
    },
    errorBudget: {
      instrumentalError: '±0.02 g (OIML Class II)',
      leastCount: '0.01 g (Màn hình 2 số lẻ)',
      repeatability: '0.01 g (Độ lệch chuẩn lặp lại s <= 0.01g)',
      temperatureDrift: '±0.005 g / 10°C'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'ExtrudeGeometry (Bevel)', pbrMaterial: 'MeshPhysicalMaterial (White ABS, roughness 0.25)', renderOrder: 1, specialRole: 'Thân vỏ OHAUS Scout chống hóa chất' },
      { meshPart: 'weighing_pan', threeClass: 'CylinderGeometry + Torus', pbrMaterial: 'MeshPhysicalMaterial (SUS304 Inox, metalness 0.94)', renderOrder: 2, specialRole: 'Mâm cân Inox lún 2.2mm khi chịu lực' },
      { meshPart: 'scale_display', threeClass: 'PlaneGeometry (Offset)', pbrMaterial: 'MeshBasicMaterial (CanvasTexture LED)', renderOrder: 3, specialRole: 'Màn hình LCD 7 đoạn nghiêng 20°' }
    ],
    fmea: [
      { failureMode: 'Số đo trôi dạt liên tục (Drifting)', rootCause: 'Luồng gió phòng v_air > 0.5 m/s thổi lên đĩa cân', systemEffect: 'Cân không chốt số STABLE_LOCKED', detectionMethod: 'Cờ isDraftInterference = true', recoveryAction: 'Bật hộp chắn gió hoặc giảm tốc độ quạt phòng v_air = 0 m/s' },
      { failureMode: 'Báo lỗi quá tải OVERLOAD_ERR', rootCause: 'Đặt tải trọng vượt quá GHĐ 500g', systemEffect: 'Màn hình nhấp nháy [ - - - - ]', detectionMethod: 'Loadcell strain > 105% FS', recoveryAction: 'Nhấc bớt vật nặng khỏi đĩa cân về bàn' }
    ]
  },

  'OL3D-EQP-CYL-0001': {
    mathFormulas: [
      { latex: 'V = \\pi \\cdot \\left(\\frac{D_{in}}{2}\\right)^2 \\cdot h_{liquid}', explanation: 'Thể tích hình trụ chất lỏng theo đường kính trong $D_{in} = 28.0\\text{ mm}$.' },
      { latex: '\\Delta V = V_{sau} - V_{trước} = V_{vật\\,rắn}', explanation: 'Phương pháp dời chỗ chất lỏng đo thể tích vật rắn không thấm nước.' },
      { latex: 'h_{meniscus} = \\frac{2\\gamma \\cos\\theta}{\\rho g r_{in}}', explanation: 'Độ nâng mao dẫn mặt khum lõm của nước tại thành ống thủy tinh ($\gamma \\approx 0.0728\\text{ N/m}$, $\\theta \\approx 0^\\circ$).' }
    ],
    stateMachine: {
      initialState: 'EMPTY',
      states: ['EMPTY', 'PARTIALLY_FILLED', 'MENISCUS_STABLE', 'SUBMERGED_OBJECT', 'OVERFLOW'],
      transitions: [
        { from: 'EMPTY', to: 'PARTIALLY_FILLED', trigger: 'Liquid poured in', guard: 'V_liquid > 0' },
        { from: 'PARTIALLY_FILLED', to: 'SUBMERGED_OBJECT', trigger: 'Sample solid dropped', guard: 'D_obj <= 28 mm' },
        { from: 'SUBMERGED_OBJECT', to: 'OVERFLOW', trigger: 'Total volume exceeds 100ml', guard: 'V_total > 100 ml' }
      ]
    },
    errorBudget: {
      instrumentalError: '±1.0 ml (ISO 4788 Class B ở 20°C)',
      leastCount: '1.0 ml (Vạch chia men trắng)',
      repeatability: '±0.5 ml',
      temperatureDrift: 'Giãn nở thủy tinh Borosilicate 3.3: 3.3 × 10⁻⁶ K⁻¹ (không đáng kể)'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'CylinderGeometry (Hollow)', pbrMaterial: 'MeshPhysicalMaterial (Borosilicate, transmission 0.88)', renderOrder: 4, specialRole: 'Thân trụ thành dày 1.8mm kèm mỏ rót' },
      { meshPart: 'scale_marks', threeClass: 'CylinderGeometry', pbrMaterial: 'MeshBasicMaterial (CanvasTexture)', renderOrder: 5, specialRole: 'Vạch chia 10..100 ml nổi chống z-fighting' },
      { meshPart: 'liquid_surface', threeClass: 'CylinderGeometry + Ring', pbrMaterial: 'MeshPhysicalMaterial (Water, IOR 1.333)', renderOrder: 2, specialRole: 'Cột nước động kèm vành mặt khum mao dẫn' }
    ],
    fmea: [
      { failureMode: 'Sai số thị giác (Parallax Error)', rootCause: 'Góc nhìn camera không nằm ngang đáy mặt khum nước', systemEffect: 'Đọc sai thể tích ±2 đến 3 ml', detectionMethod: 'Góc lệch trục camera > 5° so với mặt phẳng ngang', recoveryAction: 'Bấm nút Focus Eye-Level tự động căn camera vuông góc vạch đo' },
      { failureMode: 'Kẹt mẫu vật ngang miệng ống', rootCause: 'Thả mẫu vật có đường kính > 28 mm (như khối đồng 30mm)', systemEffect: 'Vật không chìm được vào nước, nguy cơ nứt vỡ miệng ống', detectionMethod: 'Kiểm tra va chạm Box3 Aperture', recoveryAction: 'Bật cảnh báo APERTURE_OVERSIZE và chuyển mẫu sang Bình tràn Eureka' }
    ]
  },

  'OL3D-EQP-BKR-0001': {
    mathFormulas: [
      { latex: 'Q = m \\cdot c \\cdot \\Delta T = P_{heat} \\cdot t \\cdot \\eta_{thermal}', explanation: 'Phương trình truyền nhiệt khi đun nóng dung dịch trong cốc bằng đèn cồn ($\eta \\approx 65\\%$).' },
      { latex: 'm_{tổng} = m_{vỏ\\,cốc} + V_{lỏng} \\cdot \\rho_{lỏng}', explanation: 'Khối lượng tổng cộng khi đặt cốc chứa chất lỏng lên cân điện tử ($m_{vỏ} = 95.0\\text{ g}$).' }
    ],
    stateMachine: {
      initialState: 'EMPTY',
      states: ['EMPTY', 'FILLED', 'HEATING', 'BOILING', 'POURING'],
      transitions: [
        { from: 'EMPTY', to: 'FILLED', trigger: 'Liquid added', guard: 'liquidLevelMl > 0' },
        { from: 'FILLED', to: 'HEATING', trigger: 'Burner flame applied', guard: 'T_liquid > T_ambient' },
        { from: 'HEATING', to: 'BOILING', trigger: 'Temperature reaches boiling point', guard: 'T_liquid >= 100.0 C' }
      ]
    },
    errorBudget: {
      instrumentalError: '±5% dung tích định hướng (DIN 12331)',
      leastCount: '25 ml (Vạch chia thô 50..200 ml)',
      repeatability: '±5 ml',
      temperatureDrift: 'Khả năng chịu sốc nhiệt ΔT = 160°C'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'CylinderGeometry (Low form)', pbrMaterial: 'MeshPhysicalMaterial (Borosilicate, IOR 1.48)', renderOrder: 4, specialRole: 'Cốc Griffin Low-form đường kính 70mm' },
      { meshPart: 'pouring_lip', threeClass: 'ShapeGeometry Extrude', pbrMaterial: 'MeshPhysicalMaterial (Glass)', renderOrder: 4, specialRole: 'Mỏ rót vát góc chống tràn chất lỏng' }
    ],
    fmea: [
      { failureMode: 'Sôi trào bọt khí (Bumping)', rootCause: 'Đun sôi chất lỏng không có đá bọt điều hòa sôi', systemEffect: 'Dung dịch bắn tung tóe ra ngoài cốc', detectionMethod: 'dT/dt > 15°C/s khi T > 95°C', recoveryAction: 'Thêm bi thủy tinh / đá bọt và giảm công suất đèn cồn' }
    ]
  },

  'OL3D-EQP-OVF-0001': {
    mathFormulas: [
      { latex: 'V_{tràn} = \\max\\left(0, V_{ban\\,đầu} + V_{chiếm\\,chỗ} - V_{ngưỡng}\\right)', explanation: 'Thể tích nước tràn qua vòi nghiêng khi vật rắn chìm vào lòng bình ($V_{ngưỡng} = 210.0\\text{ ml}$).' },
      { latex: 'v_{spout} = \\sqrt{2 \\cdot g \\cdot h_{crest}}', explanation: 'Tốc độ dòng xả tại cổ vòi tràn theo định luật Torricelli.' }
    ],
    stateMachine: {
      initialState: 'UNFILLED',
      states: ['UNFILLED', 'PRIMED_TO_BRIM', 'OVERFLOWING_ACTIVE', 'DRAINED_TO_BRIM'],
      transitions: [
        { from: 'UNFILLED', to: 'PRIMED_TO_BRIM', trigger: 'Water filled to spout neck', guard: 'V == 210.0 ml' },
        { from: 'PRIMED_TO_BRIM', to: 'OVERFLOWING_ACTIVE', trigger: 'Object submerged', guard: 'V_submerged > 0' },
        { from: 'OVERFLOWING_ACTIVE', to: 'DRAINED_TO_BRIM', trigger: 'Overflow stream finished', guard: 'V_spout == 0' }
      ]
    },
    errorBudget: {
      instrumentalError: '±1.0 ml thể tích tràn (phụ thuộc góc đặt bình và bám dính giọt)',
      leastCount: '1.0 ml (kết hợp ống đong hứng)',
      repeatability: '±0.8 ml',
      temperatureDrift: 'Không đáng kể'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'CylinderGeometry', pbrMaterial: 'MeshPhysicalMaterial (Transparent Acrylic)', renderOrder: 4, specialRole: 'Bình trụ trong suốt đường kính 85mm' },
      { meshPart: 'spout_water', threeClass: 'CylinderGeometry (Tilted 30°)', pbrMaterial: 'MeshPhysicalMaterial (Water stream)', renderOrder: 3, specialRole: 'Dòng nước trong lòng vòi nghiêng xả ra ngoài' }
    ],
    fmea: [
      { failureMode: 'Nước chưa tới ngưỡng vòi đã thả vật', rootCause: 'Mực nước ban đầu < 210 ml', systemEffect: 'Thể tích nước hứng được nhỏ hơn thể tích thực của vật', detectionMethod: 'V_initial < 210.0 ml', recoveryAction: 'Bắt buộc đổ nước đầy tràn vòi trước khi tiến hành thí nghiệm Archimedes' }
    ]
  },

  'OL3D-EQP-DYN-0001': {
    mathFormulas: [
      { latex: 'F = k \\cdot \\Delta x = m \\cdot g', explanation: 'Định luật Hooke cho lò xo đàn hồi tuyến tính ($k = 25.0\\text{ N/m}$, độ giãn cực đại $\\Delta x_{max} = 200\\text{ mm}$ tại $5.0\\text{ N}$).' },
      { latex: 'm_{hiển\\,thị} = \\frac{F}{g} \\times 1000\\,(\\text{g})', explanation: 'Vạch chia kép quy đổi tương đương trọng lượng sang khối lượng.' },
      { latex: 'A = F \\cdot s \\cdot \\cos\\alpha', explanation: 'Công cơ học khi dùng lực kế kéo vật trượt trên mặt phẳng nghiêng góc $\\alpha$.' }
    ],
    stateMachine: {
      initialState: 'UNLOADED_ZERO',
      states: ['UNLOADED_ZERO', 'STRETCHING', 'OSCILLATING', 'EQUILIBRIUM', 'OVERSTRETCHED'],
      transitions: [
        { from: 'UNLOADED_ZERO', to: 'STRETCHING', trigger: 'Load applied to bottom hook', guard: 'F > 0' },
        { from: 'STRETCHING', to: 'EQUILIBRIUM', trigger: 'Damping settles', guard: '|v_plunger| < 0.001 m/s' },
        { from: 'STRETCHING', to: 'OVERSTRETCHED', trigger: 'Force exceeds limit', guard: 'F > 5.5 N' }
      ]
    },
    errorBudget: {
      instrumentalError: '±0.1 N (±2% toàn thang đo)',
      leastCount: '0.1 N (0.05 N ước lượng)',
      repeatability: '±0.05 N',
      temperatureDrift: 'Giãn nở nhiệt lò xo thép: 1.2 × 10⁻⁵ K⁻¹'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'CylinderGeometry (Clear Acrylic)', pbrMaterial: 'MeshPhysicalMaterial (Acrylic, IOR 1.49)', renderOrder: 3, specialRole: 'Vỏ ống trụ bảo vệ trong suốt nhìn rõ lò xo' },
      { meshPart: 'spring_coil', threeClass: 'TubeGeometry (Helix Curve)', pbrMaterial: 'MeshPhysicalMaterial (Spring Steel, metalness 0.95)', renderOrder: 4, specialRole: 'Lò xo xoắn ốc co giãn thực tế theo tải trọng' },
      { meshPart: 'plunger', threeClass: 'Cylinder + Torus Hook', pbrMaterial: 'MeshStandardMaterial (Red Indicator)', renderOrder: 4, specialRole: 'Trục kéo kèm đĩa chỉ thị đỏ và móc treo đáy' }
    ],
    fmea: [
      { failureMode: 'Lệch điểm 0 ban đầu', rootCause: 'Lò xo bị dão nhẹ sau thời gian dài sử dụng', systemEffect: 'Số đo lực bị cộng sai số hệ thống', detectionMethod: 'F_no_load != 0.0 N', recoveryAction: 'Vặn núm ốc Zero-Adjust ở đỉnh ống đưa đĩa chỉ thị về đúng vạch 0' },
      { failureMode: 'Biến dạng dẻo vĩnh viễn (Plastic Deformation)', rootCause: 'Treo tải trọng > 6N vượt giới hạn đàn hồi Hooke', systemEffect: 'Lò xo mất tính đàn hồi tuyến tính', detectionMethod: 'F_applied > 6.0 N', recoveryAction: 'Báo lỗi quá tải và thay thế cụm lò xo mới' }
    ]
  },

  'OL3D-EQP-CAL-0001': {
    mathFormulas: [
      { latex: 'd = MSR + \\left(VSR \\times LC\\right)', explanation: 'Công thức đọc kích thước trên thước cặp ($LC = 0.02\\text{ mm}$, $MSR$: vạch mm trên thước chính, $VSR$: vạch du xích trùng).' },
      { latex: 'LC = 1\\text{ mm} - \\frac{49\\text{ mm}}{50} = 0.02\\text{ mm}', explanation: 'Độ chia du xích 50 vạch chia đều trên chiều dài 49 mm của thước chính.' }
    ],
    stateMachine: {
      initialState: 'CLOSED_ZERO',
      states: ['CLOSED_ZERO', 'SLIDING', 'CLAMPED_OBJECT', 'LOCKED_READOUT'],
      transitions: [
        { from: 'CLOSED_ZERO', to: 'SLIDING', trigger: 'Slider moved', guard: 'opening > 0' },
        { from: 'SLIDING', to: 'CLAMPED_OBJECT', trigger: 'Jaws contact object surface', guard: 'opening == object_dim' },
        { from: 'CLAMPED_OBJECT', to: 'LOCKED_READOUT', trigger: 'Locking screw tightened', guard: 'isLocked == true' }
      ]
    },
    errorBudget: {
      instrumentalError: '±0.02 mm (DIN 862 Class 1)',
      leastCount: '0.02 mm (Thước phụ 50 vạch)',
      repeatability: '±0.01 mm',
      temperatureDrift: 'Thép không gỉ mạ crom: 1.1 × 10⁻⁵ K⁻¹'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'BoxGeometry + Bevel Shape', pbrMaterial: 'MeshPhysicalMaterial (Brushed Steel, metalness 0.92)', renderOrder: 1, specialRole: 'Thân thước chính dài 235mm kèm mỏ kẹp cố định' },
      { meshPart: 'plunger', threeClass: 'ShapeGeometry Extrude', pbrMaterial: 'MeshPhysicalMaterial (Hardened Stainless Steel)', renderOrder: 2, specialRole: 'Khối hàm trượt du xích di động dọc trục X' },
      { meshPart: 'scale_display', threeClass: 'PlaneGeometry', pbrMaterial: 'MeshBasicMaterial (CanvasTexture)', renderOrder: 3, specialRole: 'Bảng hiển thị số đo LCD hỗ trợ học sinh đọc nhanh' }
    ],
    fmea: [
      { failureMode: 'Lực kẹp quá mạnh gây biến dạng mẫu mềm', rootCause: 'Siết hàm kẹp quá chặt vào mẫu nhựa POM hoặc chì', systemEffect: 'Kích thước đo được nhỏ hơn thực tế 0.05 mm', detectionMethod: 'Lực kẹp tiếp xúc > 15 N', recoveryAction: 'Sử dụng con lăn ngón cái đẩy nhẹ vừa chạm bề mặt' }
    ]
  },

  'OL3D-EQP-WGT-0001': {
    mathFormulas: [
      { latex: 'm_{true} = m_{apparent} \\cdot \\left(1 + \\frac{\\rho_{air}}{\\rho_{brass}} - \\frac{\\rho_{air}}{\\rho_{balance}}\\right)', explanation: 'Hiệu chỉnh lực đẩy Archimedes của không khí khi cân quả cân chuẩn ($\rho_{brass} = 8.40\\text{ g/cm}^3$, $\\rho_{air} \\approx 1.2\\text{ kg/m}^3$).' }
    ],
    stateMachine: {
      initialState: 'ON_BENCH',
      states: ['ON_BENCH', 'HELD_IN_AIR', 'ON_BALANCE_PAN', 'HANGING_ON_SPRING', 'SUBMERGED'],
      transitions: [
        { from: 'ON_BENCH', to: 'ON_BALANCE_PAN', trigger: 'Placed on balance pan', guard: 'dist < 0.165m' },
        { from: 'ON_BENCH', to: 'HANGING_ON_SPRING', trigger: 'Hung on dyno hook', guard: 'dist < 0.105m' },
        { from: 'ON_BENCH', to: 'SUBMERGED', trigger: 'Dropped into graduated cylinder', guard: 'cylinder aperture clear' }
      ]
    },
    errorBudget: {
      instrumentalError: '±3.0 mg (OIML R111 Class M1)',
      leastCount: 'Chuẩn khối lượng danh định 50.000 g',
      repeatability: '±0.5 mg',
      temperatureDrift: 'Không đáng kể'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'CylinderGeometry + Torus bevel', pbrMaterial: 'MeshPhysicalMaterial (Polished Brass, metalness 0.94)', renderOrder: 1, specialRole: 'Thân quả cân đồng thau mạ niken bóng gương' },
      { meshPart: 'handle', threeClass: 'Cylinder + Sphere', pbrMaterial: 'MeshPhysicalMaterial (Brass)', renderOrder: 1, specialRole: 'Núm cầm thắt eo chuẩn OIML gắp bằng nhíp' }
    ],
    fmea: [
      { failureMode: 'Oxy hóa / Bám dính mồ hôi tay', rootCause: 'Dùng tay trần cầm quả cân chuẩn', systemEffect: 'Khối lượng tăng thêm 0.01 - 0.03 g', detectionMethod: 'Mỡ tay bám dính', recoveryAction: 'Bắt buộc gắp quả cân bằng kẹp gắp gỗ hoặc đeo găng tay vải' }
    ]
  },

  'OL3D-EQP-SLD-0001': {
    mathFormulas: [
      { latex: '\\rho = \\frac{m}{V} = \\frac{66.25\\text{ g}}{24.5\\text{ cm}^3} = 2.70\\text{ g/cm}^3', explanation: 'Khối lượng riêng chuẩn của hợp kim nhôm (Aluminium 6061).' },
      { latex: 'V = \\pi \\cdot \\left(\\frac{d}{2}\\right)^2 \\cdot h = \\pi \\cdot (1.25\\text{ cm})^2 \\cdot 5.0\\text{ cm} \\approx 24.54\\text{ cm}^3', explanation: 'Tính thể tích từ kích thước đo bằng thước cặp du xích.' }
    ],
    stateMachine: {
      initialState: 'IDLE',
      states: ['IDLE', 'ON_PAN', 'SUSPENDED', 'SUBMERGED'],
      transitions: [
        { from: 'IDLE', to: 'ON_PAN', trigger: 'Dock to balance', guard: 'true' },
        { from: 'IDLE', to: 'SUBMERGED', trigger: 'Submerged in water', guard: 'true' }
      ]
    },
    errorBudget: {
      instrumentalError: '±0.2% khối lượng và kích thước gia công CNC',
      leastCount: '0.01 mm kích thước; 0.01 g khối lượng',
      repeatability: '±0.05 g',
      temperatureDrift: 'Giãn nở nhôm: 2.3 × 10⁻⁵ K⁻¹'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'CylinderGeometry + Bevel Torus', pbrMaterial: 'MeshPhysicalMaterial (Anodized Aluminium, metalness 0.90)', renderOrder: 1, specialRole: 'Trụ nhôm đặc tiện CNC chính xác Ø25x50mm' },
      { meshPart: 'handle', threeClass: 'TorusGeometry', pbrMaterial: 'MeshPhysicalMaterial (Stainless Steel)', renderOrder: 1, specialRole: 'Khuyên móc tròn đồng trục để treo vào lực kế' }
    ],
    fmea: [
      { failureMode: 'Bọt khí bám vào bề mặt khi nhúng nước', rootCause: 'Sức căng bề mặt giữ các bọt khí li ti bám quanh thân nhôm', systemEffect: 'Thể tích dâng trong ống đong bị thừa 0.5 - 1 ml', detectionMethod: 'Quan sát thấy bọt khí bám thành', recoveryAction: 'Gõ nhẹ đáy ống đong xuống mặt bàn để bọt khí thoát hết lên trên' }
    ]
  },

  'OL3D-EQP-SPH-0001': {
    mathFormulas: [
      { latex: 'V = \\frac{4}{3} \\pi R^3 = \\frac{\\pi d^3}{6} = \\frac{\\pi (2.52)^3}{6} \\approx 8.38\\text{ cm}^3', explanation: 'Thể tích hình cầu thép đặc ($d = 25.2\\text{ mm}$).' },
      { latex: '\\rho = \\frac{m}{V} = \\frac{65.90\\text{ g}}{8.38\\text{ cm}^3} \\approx 7.86\\text{ g/cm}^3', explanation: 'Khối lượng riêng của thép không gỉ / hợp kim Crom.' },
      { latex: 'W_{đ} = \\frac{1}{2} m v^2 + \\frac{1}{2} I \\omega^2', explanation: 'Động năng toàn phần khi bi thép lăn trên máng nghiêng (Bài 2 SGK KHTN 9).' }
    ],
    stateMachine: {
      initialState: 'REST_ON_TABLE',
      states: ['REST_ON_TABLE', 'ROLLING_INCLINE', 'IMPACTING_BLOCK', 'SUBMERGED_CYLINDER'],
      transitions: [
        { from: 'REST_ON_TABLE', to: 'ROLLING_INCLINE', trigger: 'Released on inclined plane', guard: 'height > 0' },
        { from: 'ROLLING_INCLINE', to: 'IMPACTING_BLOCK', trigger: 'Hits friction block at bottom', guard: 'pos == bottom' }
      ]
    },
    errorBudget: {
      instrumentalError: 'Độ cầu sai lệch <= 0.005 mm (Grade 100)',
      leastCount: '0.01 mm',
      repeatability: '±0.02 g',
      temperatureDrift: 'Không đáng kể'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'SphereGeometry (Segments 64x64)', pbrMaterial: 'MeshPhysicalMaterial (Chrome Steel, metalness 0.96, roughness 0.06)', renderOrder: 1, specialRole: 'Bi cầu thép đặc mài bóng gương phản chiếu môi trường' }
    ],
    fmea: [
      { failureMode: 'Bi lăn lệch khỏi máng nghiêng', rootCause: 'Góc nghiêng máng bị vặn hoặc vận tốc ban đầu có thành phần ngang', systemEffect: 'Không đập trúng khúc gỗ ở chân dốc', detectionMethod: 'Độ lệch ngang > 10 mm', recoveryAction: 'Cân chỉnh cân bằng máng dẫn và dùng ngón tay thả rơi tự do không vận tốc đầu' }
    ]
  },

  'OL3D-EQP-BLK-0001': {
    mathFormulas: [
      { latex: 'V = a \\cdot b \\cdot c = 3.0 \\times 2.0 \\times 3.0 = 18.0\\text{ cm}^3', explanation: 'Thể tích hình hộp chữ nhật đồng đỏ.' },
      { latex: '\\rho = \\frac{m}{V} = \\frac{160.92\\text{ g}}{18.0\\text{ cm}^3} = 8.94\\text{ g/cm}^3', explanation: 'Khối lượng riêng đặc trưng của kim loại Đồng nguyên chất (Cu).' }
    ],
    stateMachine: {
      initialState: 'IDLE',
      states: ['IDLE', 'ON_BALANCE', 'MEASURING_JAWS', 'IN_OVERFLOW_CAN'],
      transitions: [
        { from: 'IDLE', to: 'ON_BALANCE', trigger: 'Placed on balance', guard: 'true' },
        { from: 'IDLE', to: 'IN_OVERFLOW_CAN', trigger: 'Placed in overflow can', guard: 'true' }
      ]
    },
    errorBudget: {
      instrumentalError: '±0.05 mm kích thước phay CNC',
      leastCount: '0.02 mm thước cặp',
      repeatability: '±0.02 g',
      temperatureDrift: 'Giãn nở đồng: 1.65 × 10⁻⁵ K⁻¹'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'BoxGeometry (Bevel)', pbrMaterial: 'MeshPhysicalMaterial (Pure Copper, color 0xd97706, metalness 0.95)', renderOrder: 1, specialRole: 'Khối hộp chữ nhật góc vát 0.5mm ánh kim cam đỏ' }
    ],
    fmea: [
      { failureMode: 'Thả vào ống đong làm nứt đáy ống', rootCause: 'Khối lượng lớn (161g) rơi tự do trong nước gây xung lực va đập', systemEffect: 'Vỡ đáy ống đong thủy tinh', detectionMethod: 'Tốc độ rơi > 1.2 m/s', recoveryAction: 'Bắt buộc buộc chỉ nghiêng ống đong thả trượt từ từ hoặc dùng Bình tràn' }
    ]
  },

  'OL3D-EQP-HLW-0001': {
    mathFormulas: [
      { latex: 'V_{đặc} = \\pi \\cdot \\left(R^2 - r^2\\right) \\cdot h = \\pi \\cdot \\left[(1.6)^2 - (0.9)^2\\right] \\cdot 4.5 \\approx 24.74\\text{ cm}^3', explanation: 'Thể tích phần kim loại đặc chiếm chỗ nước.' },
      { latex: 'V_{bao} = \\pi \\cdot R^2 \\cdot h = \\pi \\cdot (1.6)^2 \\cdot 4.5 \\approx 36.19\\text{ cm}^3', explanation: 'Thể tích hình học bao ngoài toàn phần.' },
      { latex: 'V_{rỗng} = V_{bao} - V_{đặc} = \\pi \\cdot r^2 \\cdot h \\approx 11.45\\text{ cm}^3', explanation: 'Thể tích khoang rỗng bên trong ống trụ.' }
    ],
    stateMachine: {
      initialState: 'IDLE',
      states: ['IDLE', 'MEASURING_INTERNAL_JAWS', 'WEIGHING', 'SUBMERGED_BUBBLES_TRAPPED', 'SUBMERGED_PURGED'],
      transitions: [
        { from: 'IDLE', to: 'SUBMERGED_BUBBLES_TRAPPED', trigger: 'Submerged vertically', guard: 'air trapped inside' },
        { from: 'SUBMERGED_BUBBLES_TRAPPED', to: 'SUBMERGED_PURGED', trigger: 'Tilted 45° under water', guard: 'bubbles released' }
      ]
    },
    errorBudget: {
      instrumentalError: '±0.03 mm',
      leastCount: '0.02 mm thước cặp',
      repeatability: '±0.05 g',
      temperatureDrift: 'Không đáng kể'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'CylinderGeometry (Hollow Path)', pbrMaterial: 'MeshPhysicalMaterial (Alloy Steel, metalness 0.90)', renderOrder: 1, specialRole: 'Ống trụ rỗng hai đầu hở xuyên tâm' }
    ],
    fmea: [
      { failureMode: 'Khí đọng trong khoang rỗng làm nổi hoặc sai thể tích', rootCause: 'Thả trụ thẳng đứng làm bọt khí bị nhốt trong khoang rỗng', systemEffect: 'Nước dâng trong ống đong bị thiếu $11.5\\text{ ml}$', detectionMethod: 'V_measured < V_true', recoveryAction: 'Nghiêng ống trụ $45^\\circ$ dưới mặt nước để bọt khí thoát hoàn toàn' }
    ]
  },

  'OL3D-EQP-FLK-0001': {
    mathFormulas: [
      { latex: 'A_{evap} = \\pi \\cdot r_{neck}^2 \\ll A_{beaker}', explanation: 'Tiết diện cổ hẹp hạn chế tối đa sự bay hơi và bắn tóe hóa chất khi lắc dung dịch.' }
    ],
    stateMachine: {
      initialState: 'EMPTY',
      states: ['EMPTY', 'FILLED_REAGENT', 'SWIRLING', 'CONDENSATE_COLLECTING'],
      transitions: [
        { from: 'EMPTY', to: 'FILLED_REAGENT', trigger: 'Liquid added', guard: 'V > 0' },
        { from: 'FILLED_REAGENT', to: 'SWIRLING', trigger: 'Manual orbital swirl', guard: 'angular velocity > 2 rad/s' }
      ]
    },
    errorBudget: {
      instrumentalError: '±5% dung tích định mức (ISO 1773)',
      leastCount: '50 ml (Vạch chia thô 50..250 ml)',
      repeatability: '±10 ml',
      temperatureDrift: 'Chịu nhiệt tới 250°C'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'LatheGeometry (Cone shape)', pbrMaterial: 'MeshPhysicalMaterial (Borosilicate, transmission 0.88)', renderOrder: 4, specialRole: 'Bình nón Erlenmeyer cổ hẹp Ø34mm đáy rộng Ø85mm' },
      { meshPart: 'liquid_surface', threeClass: 'CylinderGeometry (Cone adapted)', pbrMaterial: 'MeshPhysicalMaterial (Liquid, opacity 0.7)', renderOrder: 2, specialRole: 'Khối dung dịch hình nón cụt' }
    ],
    fmea: [
      { failureMode: 'Nứt vỡ cổ bình khi kẹp sắt quá chặt', rootCause: 'Vặn vít tay kẹp giá sắt kim loại trực tiếp không có đệm bần/cao su', systemEffect: 'Nứt vỡ thủy tinh', detectionMethod: 'Lực kẹp giá sắt > 25 N', recoveryAction: 'Bắt buộc lót đệm cao su chịu nhiệt quanh cổ bình trước khi siết vít' }
    ]
  },

  'OL3D-EQP-STD-0001': {
    mathFormulas: [
      { latex: '\\sum \\vec{M}_{(O)} = \\vec{0} \\iff F_{clamp} \\cdot d_{arm} \\le M_{tự\\,đổ} = m_{đế} \\cdot g \\cdot \\frac{W_{đế}}{2}', explanation: 'Điều kiện cân bằng chống lật đổ giá thí nghiệm khi gá các bình cầu và ống sinh hàn nặng ($m_{đế} = 1.85\\text{ kg}$, $W_{đế} = 135\\text{ mm}$).' }
    ],
    stateMachine: {
      initialState: 'STANDALONE',
      states: ['STANDALONE', 'CLAMP_ATTACHED', 'RING_ATTACHED', 'HOLDING_APPARATUS'],
      transitions: [
        { from: 'STANDALONE', to: 'CLAMP_ATTACHED', trigger: 'Bosshead clamp mounted', guard: 'height <= 0.50m' },
        { from: 'CLAMP_ATTACHED', to: 'HOLDING_APPARATUS', trigger: 'Glassware fastened in clamp', guard: 'true' }
      ]
    },
    errorBudget: {
      instrumentalError: 'Độ vuông góc trục đứng 90° ± 0.2°',
      leastCount: '1 mm chỉnh cao độ khớp nối',
      repeatability: 'Vững chắc tuyệt đối dưới tải trọng 3.5 kg',
      temperatureDrift: 'Không biến dạng ở 300°C'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'BoxGeometry + Cylinder', pbrMaterial: 'MeshStandardMaterial (Cast Iron, color 0x1e293b, roughness 0.7)', renderOrder: 1, specialRole: 'Chân đế gang đúc nặng 1.85kg kèm trụ inox Ø10x500mm' },
      { meshPart: 'handle', threeClass: 'Box + Torus Screw', pbrMaterial: 'MeshStandardMaterial (Aluminium Bosshead)', renderOrder: 2, specialRole: 'Khớp nối chữ thập và tay kẹp bọc cao su chịu nhiệt' }
    ],
    fmea: [
      { failureMode: 'Đổ lật giá thí nghiệm ra phía trước', rootCause: 'Gá phễu chiết chứa đầy dung dịch quá xa tâm đế gang', systemEffect: 'Đổ toàn bộ hệ thống hóa chất xuống bàn', detectionMethod: 'Trọng tâm hệ thống nằm ngoài chu vi đế gang', recoveryAction: 'Luôn xoay tay kẹp hướng về phía diện tích mặt đế gang nặng' }
    ]
  },

  'OL3D-EQP-OPT-0001': {
    mathFormulas: [
      { latex: '\\frac{1}{d} + \\frac{1}{d\'} = \\frac{1}{f} \\iff d\' = \\frac{d \\cdot f}{d - f}', explanation: 'Công thức thấu kính mỏng cho Thấu kính hội tụ ($f = +100\\text{ mm} = +10.0\\text{ cm}$).' },
      { latex: 'k = -\\frac{d\'}{d} = \\frac{\\overline{A\'B\'}}{\\overline{AB}}', explanation: 'Hệ số phóng đại ảnh (k < 0: ảnh thật ngược chiều; k > 0: ảnh ảo cùng chiều).' },
      { latex: 'd = d\' = 2f = 20.0\\text{ cm} \\implies |k| = 1.0', explanation: 'Vị trí đối xứng tạo ảnh thật bằng đúng kích thước vật (Phương pháp đo tiêu cự Bài 9 SGK KHTN 9).' }
    ],
    stateMachine: {
      initialState: 'MOUNTED_ON_RAIL',
      states: ['MOUNTED_ON_RAIL', 'REAL_IMAGE_PROJECTED', 'VIRTUAL_IMAGE_ZONE', 'PARALLEL_BEAM_FOCUS'],
      transitions: [
        { from: 'MOUNTED_ON_RAIL', to: 'REAL_IMAGE_PROJECTED', trigger: 'Object distance d > f', guard: 'd > 10.0 cm' },
        { from: 'MOUNTED_ON_RAIL', to: 'VIRTUAL_IMAGE_ZONE', trigger: 'Object distance d < f', guard: 'd < 10.0 cm' },
        { from: 'MOUNTED_ON_RAIL', to: 'PARALLEL_BEAM_FOCUS', trigger: 'Collimated laser beam input', guard: 'isLaserHit == true' }
      ]
    },
    errorBudget: {
      instrumentalError: '±2.0 mm tiêu cự định danh (DIN 58145)',
      leastCount: '1.0 mm trên thước đo ray quang học',
      repeatability: '±1.0 mm',
      temperatureDrift: 'Thủy tinh quang học BK7: dn/dT = 3.0 × 10⁻⁶ K⁻¹'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'Box + Cylinder Carriage', pbrMaterial: 'MeshStandardMaterial (Black Anodized ABS)', renderOrder: 2, specialRole: 'Con trượt gá ray quang học và vành giữ Ø60mm' },
      { meshPart: 'lens_element', threeClass: 'Sphere intersection (Biconvex)', pbrMaterial: 'MeshPhysicalMaterial (BK7 Glass, IOR 1.5168, transmission 0.95)', renderOrder: 4, specialRole: 'Thấu kính thủy tinh 2 mặt lồi mài bóng quang học' },
      { meshPart: 'scale_display', threeClass: 'PlaneGeometry', pbrMaterial: 'MeshBasicMaterial (CanvasTexture)', renderOrder: 3, specialRole: 'Màn hình số HUD hiển thị tọa độ ray X và trị số f' }
    ],
    fmea: [
      { failureMode: 'Ảnh bị mờ nhòe do cầu sai (Spherical Aberration)', rootCause: 'Chùm sáng tới rìa ngoài thấu kính không hội tụ cùng điểm với chùm trung tâm', systemEffect: 'Viền chữ F trên màn chắn bị viền tán sắc mờ', detectionMethod: 'Khẩu độ mở > Ø 40 mm', recoveryAction: 'Lắp màn chắn lỗ tròn giới hạn chùm tia ở vùng gần trục quang' }
    ]
  },

  'OL3D-EQP-THM-0001': {
    mathFormulas: [
      { latex: 'h_{cột\\,rượu}(T) = h_0 \\cdot \\left[1 + \\beta_{ethanol} \\cdot (T - T_0)\\right]', explanation: 'Sự giãn nở vì nhiệt của thể tích chất lỏng cảm nhiệt trong ống mao quản ($\beta_{ethanol} \\approx 1.1 \\times 10^{-3}\\,\\text{K}^{-1}$).' },
      { latex: 'T = -10 + \\frac{h - h_{-10}}{h_{110} - h_{-10}} \\times 120\\,(^\\circ\\text{C})', explanation: 'Công thức chuyển đổi chiều cao cột chất lỏng sang nhiệt độ hiển thị.' }
    ],
    stateMachine: {
      initialState: 'AMBIENT_AIR',
      states: ['AMBIENT_AIR', 'IMMERSING', 'EQUILIBRIUM_TEMPERATURE', 'BOILING_MONITORING'],
      transitions: [
        { from: 'AMBIENT_AIR', to: 'IMMERSING', trigger: 'Probe dipped into liquid', guard: 'isSubmerged == true' },
        { from: 'IMMERSING', to: 'EQUILIBRIUM_TEMPERATURE', trigger: 'Thermal relaxation elapsed', guard: '|dT/dt| < 0.1°C/s' }
      ]
    },
    errorBudget: {
      instrumentalError: '±1.0 °C (TCVN / ISO 1770)',
      leastCount: '1.0 °C (ĐCNN 1 vạch chia)',
      repeatability: '±0.5 °C',
      temperatureDrift: 'Thời gian đáp ứng nhiệt τ ≈ 3.5 giây'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'CylinderGeometry (Thin glass stem)', pbrMaterial: 'MeshPhysicalMaterial (Borosilicate, IOR 1.47)', renderOrder: 4, specialRole: 'Thân mao quản thủy tinh Ø6.5mm dài 295mm' },
      { meshPart: 'plunger', threeClass: 'CylinderGeometry (Red fluid)', pbrMaterial: 'MeshStandardMaterial (Red alcohol, emissive red)', renderOrder: 2, specialRole: 'Cột rượu màu đỏ dâng hạ theo nhiệt độ' },
      { meshPart: 'scale_marks', threeClass: 'CylinderGeometry', pbrMaterial: 'MeshBasicMaterial (CanvasTexture)', renderOrder: 5, specialRole: 'Thang chia nhiệt độ khắc laser -10 đến +110°C' }
    ],
    fmea: [
      { failureMode: 'Đứt đoạn cột rượu cảm nhiệt', rootCause: 'Bị rung lắc mạnh hoặc làm rơi nhiệt kế', systemEffect: 'Số đo nhiệt độ bị sai lệch lớn', detectionMethod: 'Xuất hiện bọt khí ngăn đôi cột đỏ', recoveryAction: 'Ngâm bầu nhiệt kế vào nước nóng để cột rượu nối liền trở lại' },
      { failureMode: 'Bầu nhiệt kế chạm đáy cốc khi đun', rootCause: 'Cắm nhiệt kế chạm trực tiếp vào đáy cốc thủy tinh tiếp xúc ngọn lửa', systemEffect: 'Đo sai nhiệt độ cục bộ đáy cốc (cao hơn nhiệt độ nước 15°C) và nứt vỡ bầu nhiệt kế', detectionMethod: 'Khoảng cách bầu tới đáy cốc < 3 mm', recoveryAction: 'Kẹp nhiệt kế trên giá sắt cách đáy cốc tối thiểu 15 mm' }
    ]
  },

  'OL3D-EQP-LSR-0001': {
    mathFormulas: [
      { latex: 'E = \\frac{h \\cdot c}{\\lambda} = \\frac{6.626 \\times 10^{-34} \\cdot 3 \\times 10^8}{650 \\times 10^{-9}} \\approx 3.06 \\times 10^{-19}\\text{ J} \\approx 1.91\\text{ eV}', explanation: 'Năng lượng một photon ánh sáng laser màu đỏ ($\lambda = 650\\text{ nm}$).' },
      { latex: '\\vec{v}_{beam} = c \\cdot \\vec{u}_{forward}', explanation: 'Véctơ hướng truyền thẳng của 3 chùm tia laser song song trong môi trường đồng tính.' }
    ],
    stateMachine: {
      initialState: 'POWER_OFF',
      states: ['POWER_OFF', 'SINGLE_BEAM', 'TRIPLE_PARALLEL_BEAMS', 'LOW_BATTERY'],
      transitions: [
        { from: 'POWER_OFF', to: 'TRIPLE_PARALLEL_BEAMS', trigger: 'Power switch turned on', guard: 'true' },
        { from: 'TRIPLE_PARALLEL_BEAMS', to: 'SINGLE_BEAM', trigger: 'Mode switch toggled', guard: 'true' }
      ]
    },
    errorBudget: {
      instrumentalError: 'Độ đơn sắc bước sóng 650 nm ± 5 nm',
      leastCount: 'Khoảng cách giữa các tia 18.0 mm ± 0.2 mm',
      repeatability: 'Độ song song chùm tia sai lệch < 0.1°',
      temperatureDrift: 'Ổn định công suất quang < 1 mW'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'BoxGeometry (Bevel)', pbrMaterial: 'MeshPhysicalMaterial (Matte Black ABS, metalness 0.2)', renderOrder: 1, specialRole: 'Hộp nguồn laser 110x80x22mm có đế nam châm' },
      { meshPart: 'laser_beams', threeClass: 'LineSegments / Cylinder', pbrMaterial: 'MeshBasicMaterial (Red emissive, opacity 0.85)', renderOrder: 6, specialRole: '3 chùm tia laser đỏ song song phát xạ thẳng' }
    ],
    fmea: [
      { failureMode: 'Tia laser chiếu trực diện vào mắt học sinh', rootCause: 'Xoay hướng hộp laser ngược về phía camera / người xem', systemEffect: 'Vi phạm quy chuẩn an toàn quang học trường học', detectionMethod: 'Góc tia laser hướng về camera góc nhìn học sinh', recoveryAction: 'Tự động ngắt phát xạ hoặc hiển thị cảnh báo an toàn Class II Safety Warning' }
    ]
  },

  'OL3D-EQP-SLB-0001': {
    mathFormulas: [
      { latex: 'n_1 \\cdot \\sin i = n_2 \\cdot \\sin r \\iff \\sin r = \\frac{n_1}{n_2} \\cdot \\sin i', explanation: 'Định luật khúc xạ ánh sáng Snell–Descartes ($n_1 = 1.50$ thủy tinh, $n_2 = 1.00$ không khí).' },
      { latex: '\\sin i_{gh} = \\frac{n_2}{n_1} = \\frac{1}{1.50} = \\frac{2}{3} \\implies i_{gh} \\approx 41.81^\\circ', explanation: 'Góc tới hạn phản xạ toàn phần từ thủy tinh sang không khí (Bài 6 SGK KHTN 9).' },
      { latex: 'i \\ge 41.81^\\circ \\implies \\text{Refracted Ray disappears}, \\; I_{reflected} = 100\\%', explanation: 'Điều kiện xảy ra Phản xạ toàn phần: Không còn tia khúc xạ ló ra không khí.' }
    ],
    stateMachine: {
      initialState: 'NORMAL_INCIDENCE',
      states: ['NORMAL_INCIDENCE', 'REFRACTION_DOMINANT', 'CRITICAL_ANGLE', 'TOTAL_INTERNAL_REFLECTION'],
      transitions: [
        { from: 'NORMAL_INCIDENCE', to: 'REFRACTION_DOMINANT', trigger: 'Rotated on protractor', guard: '0 < i < 41.8°' },
        { from: 'REFRACTION_DOMINANT', to: 'CRITICAL_ANGLE', trigger: 'Angle reaches 41.8°', guard: 'i == 41.8°' },
        { from: 'REFRACTION_DOMINANT', to: 'TOTAL_INTERNAL_REFLECTION', trigger: 'Angle exceeds critical', guard: 'i >= 42.0°' }
      ]
    },
    errorBudget: {
      instrumentalError: '±0.5° góc trên bảng chia độ 360°',
      leastCount: '1.0° (Vạch khắc laser trên mâm tròn Ø150mm)',
      repeatability: '±0.2°',
      temperatureDrift: 'Chiết suất n = 1.50 ± 0.005'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'CylinderGeometry (Half cut)', pbrMaterial: 'MeshPhysicalMaterial (BK7 Optical Glass, IOR 1.50, transmission 0.92)', renderOrder: 4, specialRole: 'Khối bán trụ thủy tinh Ø84mm dày 16mm mài bóng' },
      { meshPart: 'handle', threeClass: 'CylinderGeometry (Disc)', pbrMaterial: 'MeshStandardMaterial (Hartmann Protractor Texture)', renderOrder: 2, specialRole: 'Mâm tròn chia độ 360° xoay đồng tâm O' },
      { meshPart: 'refracted_ray', threeClass: 'Line / Cylinder', pbrMaterial: 'MeshBasicMaterial (Red Laser)', renderOrder: 6, specialRole: 'Tia khúc xạ (tự động ẩn khi i >= 41.8°)' },
      { meshPart: 'reflected_ray', threeClass: 'Line / Cylinder', pbrMaterial: 'MeshBasicMaterial (Red Laser)', renderOrder: 6, specialRole: 'Tia phản xạ đối xứng (sáng cực đại khi phản xạ toàn phần)' }
    ],
    fmea: [
      { failureMode: 'Tia tới không đi qua tâm O của bản bán trụ', rootCause: 'Đèn laser bị lệch trục không đồng tâm với mâm chia độ', systemEffect: 'Tia bị bẻ cong tại mặt cong trước khi tới mặt phẳng, làm sai định luật Snell', detectionMethod: 'Khoảng cách tia tới tâm O > 0.5 mm', recoveryAction: 'Bấm nút Snap Ray to Center O tự động căn chỉnh đồng trục' }
    ]
  },

  'OL3D-EQP-PRM-0001': {
    mathFormulas: [
      { latex: 'D = i_1 + i_2 - A', explanation: 'Góc lệch của tia sáng khi qua lăng kính tam giác đều ($A = 60^\\circ$).' },
      { latex: 'n(\\lambda) = A_{Cauchy} + \\frac{B_{Cauchy}}{\\lambda^2} + \\frac{C_{Cauchy}}{\\lambda^4}', explanation: 'Phương trình tán sắc Cauchy: Chiết suất ánh sáng đỏ ($n_{đỏ} \\approx 1.513$) nhỏ hơn chiết suất ánh sáng tím ($n_{tím} \\approx 1.532$), khiến tia tím bị lệch nhiều nhất tạo thành dải 7 màu cầu vồng.' }
    ],
    stateMachine: {
      initialState: 'IDLE_MOUNT',
      states: ['IDLE_MOUNT', 'MONOCHROMATIC_DEFLECTION', 'POLYCHROMATIC_DISPERSION'],
      transitions: [
        { from: 'IDLE_MOUNT', to: 'MONOCHROMATIC_DEFLECTION', trigger: 'Red laser applied', guard: 'single wavelength' },
        { from: 'IDLE_MOUNT', to: 'POLYCHROMATIC_DISPERSION', trigger: 'White light slit applied', guard: 'continuous spectrum' }
      ]
    },
    errorBudget: {
      instrumentalError: 'Góc lăng kính A = 60° ± 0.05°',
      leastCount: '0.1° góc lệch D',
      repeatability: '±0.1°',
      temperatureDrift: 'Không đáng kể'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'PrismGeometry (Extruded Equilateral Triangle)', pbrMaterial: 'MeshPhysicalMaterial (Optical Flint Glass, IOR 1.62, transmission 0.90)', renderOrder: 4, specialRole: 'Lăng kính tam giác đều 30x30x30mm trên giá đỡ trụ' }
    ],
    fmea: [
      { failureMode: 'Góc tới quá lớn gây phản xạ toàn phần trong lăng kính', rootCause: 'Xoay lăng kính góc i > 75°', systemEffect: 'Không có chùm tia ló ra khỏi mặt bên thứ hai', detectionMethod: 'sin(r2) >= 1.0', recoveryAction: 'Xoay lăng kính về góc tới đối xứng i1 ≈ 48° cho góc lệch cực tiểu D_min' }
    ]
  },

  'OL3D-EQP-MAG-0001': {
    mathFormulas: [
      { latex: 'G = \\frac{25\\text{ cm}}{f} = \\frac{250\\text{ mm}}{50\\text{ mm}} = 5\\times', explanation: 'Số bội giác của kính lúp khi ngắm chừng ở vô cực ($f = 50\\text{ mm}$).' },
      { latex: 'd\' = \\frac{d \\cdot f}{d - f} < 0 \\implies \\text{Ảnh ảo cùng chiều lớn hơn vật}', explanation: 'Vật đặt trong khoảng tiêu cự $0 < d < f$ tạo ảnh ảo phóng đại quan sát bằng mắt thường.' }
    ],
    stateMachine: {
      initialState: 'BENCH_REST',
      states: ['BENCH_REST', 'HELD_IN_HAND', 'MAGNIFYING_SPECIMEN'],
      transitions: [
        { from: 'BENCH_REST', to: 'HELD_IN_HAND', trigger: 'Pointer grab', guard: 'true' },
        { from: 'HELD_IN_HAND', to: 'MAGNIFYING_SPECIMEN', trigger: 'Hover over specimen', guard: 'd < f' }
      ]
    },
    errorBudget: {
      instrumentalError: '±0.2x độ bội giác',
      leastCount: 'Tiêu cự 50 mm ± 1 mm',
      repeatability: 'Hình ảnh ảo sắc nét không méo gối',
      temperatureDrift: 'Không đáng kể'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'Torus + Cylinder Handle', pbrMaterial: 'MeshPhysicalMaterial (Black Rubberized ABS)', renderOrder: 2, specialRole: 'Vành giữ thấu kính Ø75mm kèm tay cầm chống trượt' },
      { meshPart: 'lens_element', threeClass: 'Sphere intersection', pbrMaterial: 'MeshPhysicalMaterial (Optical Glass, transmission 0.95)', renderOrder: 4, specialRole: 'Thấu kính hội tụ phóng đại 5x' }
    ],
    fmea: [
      { failureMode: 'Méo rìa hình ảnh (Aberration)', rootCause: 'Đưa mắt quá xa trục chính quang học của kính lúp', systemEffect: 'Viền đối tượng bị cong méo hình gối', detectionMethod: 'Eye offset > 30 mm', recoveryAction: 'Căn chỉnh mắt nhìn thẳng đồng trục tâm thấu kính' }
    ]
  },

  'OL3D-EQP-GLV-0001': {
    mathFormulas: [
      { latex: 'I = \\frac{\\theta}{S_i} = \\frac{\\tau_{restoring}}{N A B} = \\frac{C \\cdot \\theta}{N A B}', explanation: 'Định luật đo dòng điện của điện kế khung quay kim nhạy.' },
      { latex: '\\theta = \\text{sign}(I) \\cdot \\min\\left(45^\\circ, \\frac{|I|}{50\\,\\mu\\text{A}} \\times 45^\\circ\\right)', explanation: 'Góc lệch kim chỉ thị mặt trước và mặt sau đối xứng quanh vạch 0 ở giữa.' }
    ],
    stateMachine: {
      initialState: 'ZERO_CENTER',
      states: ['ZERO_CENTER', 'DEFLECT_POSITIVE', 'DEFLECT_NEGATIVE', 'PINNED_FULL_SCALE'],
      transitions: [
        { from: 'ZERO_CENTER', to: 'DEFLECT_POSITIVE', trigger: 'Positive current flows', guard: 'I > 0.5 uA' },
        { from: 'ZERO_CENTER', to: 'DEFLECT_NEGATIVE', trigger: 'Negative current flows', guard: 'I < -0.5 uA' },
        { from: 'DEFLECT_POSITIVE', to: 'PINNED_FULL_SCALE', trigger: 'Current exceeds 50 uA', guard: 'I > 50 uA' }
      ]
    },
    errorBudget: {
      instrumentalError: 'Cấp chính xác 1.5 (±1.5% toàn thang đo)',
      leastCount: '2 µA (Thang đo -50 .. 0 .. +50 µA)',
      repeatability: '±1 µA',
      temperatureDrift: 'Điện trở nội Rg = 50 Ω ± 2 Ω'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'BoxGeometry (Sloped housing)', pbrMaterial: 'MeshStandardMaterial (Grey Laboratory Housing)', renderOrder: 1, specialRole: 'Vỏ hộp máy đo góc nghiêng 45°' },
      { meshPart: 'plunger', threeClass: 'Cylinder Needle', pbrMaterial: 'MeshBasicMaterial (Red Needle, front)', renderOrder: 3, specialRole: 'Kim chỉ thị mặt trước quay quanh trục Z' },
      { meshPart: 'plunger_rear', threeClass: 'Cylinder Needle', pbrMaterial: 'MeshBasicMaterial (Red Needle, rear)', renderOrder: 3, specialRole: 'Kim chỉ thị mặt sau hiển thị 360°' }
    ],
    fmea: [
      { failureMode: 'Cháy cuộn dây động', rootCause: 'Cắm trực tiếp nguồn điện 12V vào điện kế nhạy không qua điện trở hạn dòng', systemEffect: 'Cháy đứt cuộn dây khung quay siêu mảnh', detectionMethod: 'I_in > 500 uA (gấp 10 lần GHĐ)', recoveryAction: 'Luôn mắc nối tiếp điện trở hạn dòng tối thiểu 10 kΩ khi thử nghiệm mạch' }
    ]
  },

  'OL3D-EQP-DMM-0001': {
    mathFormulas: [
      { latex: 'V_{DC} = \\int_{0}^{T_{int}} V_{in}(t)\\,dt', explanation: 'Nguyên lý chuyển đổi tương tự sang số ADC tích phân hai sườn (Dual-slope integration).' },
      { latex: 'R_x = \\frac{V_{sample}}{I_{constant}}', explanation: 'Đo điện trở theo phương pháp bơm dòng chuẩn và đo sụt áp bốn dây Kelvin.' }
    ],
    stateMachine: {
      initialState: 'OFF',
      states: ['OFF', 'MEASURING_DCV', 'MEASURING_ACV', 'MEASURING_DCA', 'MEASURING_OHM'],
      transitions: [
        { from: 'OFF', to: 'MEASURING_DCV', trigger: 'Rotary switch turned to DCV', guard: 'true' },
        { from: 'MEASURING_DCV', to: 'MEASURING_OHM', trigger: 'Rotary switch turned to OHM', guard: 'true' }
      ]
    },
    errorBudget: {
      instrumentalError: '±0.5% + 2 số hiển thị (CAT II 600V)',
      leastCount: '0.01 V / 0.1 mA / 0.1 Ω (Màn hình 3.5 số lẻ)',
      repeatability: '±0.2%',
      temperatureDrift: 'Trở kháng vào Zin >= 10 MΩ'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'Box + Bevel Extrude', pbrMaterial: 'MeshStandardMaterial (Yellow Holster ABS, color 0xf59e0b)', renderOrder: 1, specialRole: 'Vỏ cao su bọc chống sốc màu vàng công nghiệp' },
      { meshPart: 'scale_display', threeClass: 'PlaneGeometry', pbrMaterial: 'MeshBasicMaterial (CanvasTexture LCD)', renderOrder: 3, specialRole: 'Màn hình LCD 7 đoạn hiển thị số thực 360°' }
    ],
    fmea: [
      { failureMode: 'Đứt cầu chì bảo vệ thang đo dòng điện', rootCause: 'Đo điện áp nguồn điện nhưng cắm que đo ở cổng 10A / mA', systemEffect: 'Đoản mạch và đứt cầu chì bảo vệ nhanh', detectionMethod: 'Dòng điện qua shunt > 10 A', recoveryAction: 'Thay cầu chì bảo vệ gốm 10A và chuyển que đo sang cổng V/Ω' }
    ]
  },

  'OL3D-EQP-COIL-0001': {
    mathFormulas: [
      { latex: '\\mathcal{E} = -N \\cdot \\frac{d\\Phi}{dt} = -N \\cdot S \\cdot \\frac{dB}{dt}', explanation: 'Định luật cảm ứng điện từ Faraday: Suất điện động cảm ứng tỷ lệ với tốc độ biến thiên từ thông qua cuộn dây ($N = 1000\\text{ vòng}$).' },
      { latex: 'I_{cảm\\,ứng} = \\frac{\\mathcal{E}}{R_{cuộn} + R_{LED}}', explanation: 'Dòng điện cảm ứng chạy qua 2 đèn LED đấu song song ngược cực.' },
      { latex: 'V_{LED} \\ge 1.8\\text{ V} \\implies \\text{LED phát sáng}', explanation: 'Đèn LED đỏ sáng khi đưa cực Bắc nam châm vào; LED xanh sáng khi rút nam châm ra (Định luật Lenz).' }
    ],
    stateMachine: {
      initialState: 'QUIESCENT',
      states: ['QUIESCENT', 'MAGNET_APPROACHING', 'MAGNET_RETRACTING', 'MAGNET_STATIONARY'],
      transitions: [
        { from: 'QUIESCENT', to: 'MAGNET_APPROACHING', trigger: 'Magnet moves into core (+v)', guard: 'v > 0.05 m/s' },
        { from: 'QUIESCENT', to: 'MAGNET_RETRACTING', trigger: 'Magnet moves out of core (-v)', guard: 'v < -0.05 m/s' },
        { from: 'MAGNET_APPROACHING', to: 'MAGNET_STATIONARY', trigger: 'Magnet stops moving', guard: 'v == 0' }
      ]
    },
    errorBudget: {
      instrumentalError: 'Số vòng dây N = 1000 ± 5 vòng',
      leastCount: 'Ngưỡng phát hiện vận tốc nam châm 0.05 m/s',
      repeatability: '100% tái hiện định luật Lenz',
      temperatureDrift: 'Điện trở cuộn dây đồng R = 18 Ω ở 25°C'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'CylinderGeometry (Hollow core)', pbrMaterial: 'MeshStandardMaterial (Enamelled Copper Wire, color 0xb45309)', renderOrder: 2, specialRole: 'Cuộn dây đồng tráng men quấn trên lõi nhựa rỗng' },
      { meshPart: 'led_1', threeClass: 'Cylinder + Dome', pbrMaterial: 'MeshBasicMaterial (Red LED, emissive)', renderOrder: 3, specialRole: 'LED đỏ sáng khi từ thông tăng (đưa nam châm vào)' },
      { meshPart: 'led_2', threeClass: 'Cylinder + Dome', pbrMaterial: 'MeshBasicMaterial (Green LED, emissive)', renderOrder: 3, specialRole: 'LED xanh sáng khi từ thông giảm (rút nam châm ra)' }
    ],
    fmea: [
      { failureMode: 'LED không sáng khi đưa nam châm vào', rootCause: 'Di chuyển thanh nam châm quá chậm ($v < 0.02\\text{ m/s}$)', systemEffect: 'Suất điện động cảm ứng sinh ra $< 1.8\\text{ V}$ không đủ ngưỡng mở LED', detectionMethod: 'dPhi/dt < 0.0018 Wb/s', recoveryAction: 'Đưa nam châm chuyển động nhanh, dứt khoát xuyên qua lòng cuộn dây' }
    ]
  },

  'OL3D-EQP-DSH-0001': {
    mathFormulas: [
      { latex: 'C_2H_5OH + 3O_2 \\xrightarrow{t^\\circ} 2CO_2 + 3H_2O, \\quad \\Delta H = -1367\\text{ kJ/mol}', explanation: 'Phản ứng cháy của cồn ethanol tỏa nhiệt lượng mạnh trong bát sứ.' },
      { latex: 'm_{chất\\,rắn} = m_{sau\\,cô\\,cạn} - m_{bát\\,không}', explanation: 'Xác định hàm lượng muối khoáng hòa tan sau khi cô cạn dung dịch.' }
    ],
    stateMachine: {
      initialState: 'ROOM_TEMP',
      states: ['ROOM_TEMP', 'LIQUID_FILLED', 'BURNING_ALCOHOL', 'EVAPORATING', 'RESIDUE_COOLED'],
      transitions: [
        { from: 'ROOM_TEMP', to: 'BURNING_ALCOHOL', trigger: 'Alcohol ignited', guard: 'hasAlcohol == true' },
        { from: 'BURNING_ALCOHOL', to: 'RESIDUE_COOLED', trigger: 'Fuel exhausted', guard: 'alcoholRemaining == 0' }
      ]
    },
    errorBudget: {
      instrumentalError: 'Chịu nhiệt độ cực đại 1050°C',
      leastCount: 'Dung tích 75 ml',
      repeatability: 'Men sứ phủ tráng nhẵn chống ăn mòn axit/kiềm',
      temperatureDrift: 'Hệ số giãn nở nhiệt sứ: 4.5 × 10⁻⁶ K⁻¹'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'SphereGeometry (Cut bowl)', pbrMaterial: 'MeshPhysicalMaterial (Glazed Porcelain, color 0xf8fafc, roughness 0.1)', renderOrder: 1, specialRole: 'Bát sứ nung trắng men tráng chịu nhiệt có mỏ rót' },
      { meshPart: 'flame_group', threeClass: 'ConeGeometry + Particle', pbrMaterial: 'MeshBasicMaterial (Blue/Orange Flame)', renderOrder: 5, specialRole: 'Ngọn lửa cồn cháy bập bùng đồ họa động' }
    ],
    fmea: [
      { failureMode: 'Nứt vỡ bát sứ do sốc nhiệt đột ngột', rootCause: 'Đang đun nóng ở 400°C đổ ngay nước lạnh vào lòng bát', systemEffect: 'Nứt toác lòng bát sứ', detectionMethod: 'dT/dt < -150°C/s', recoveryAction: 'Để bát nguội tự nhiên trên lưới tản nhiệt trước khi vệ sinh' }
    ]
  },

  'OL3D-EQP-SEP-0001': {
    mathFormulas: [
      { latex: 'v_{chảy} = C_v \\cdot \\sqrt{2 \\cdot g \\cdot h_{liquid}}', explanation: 'Tốc độ xả chất lỏng qua lỗ khóa van PTFE theo định luật Torricelli.' },
      { latex: '\\Delta \\rho = \\rho_{nước} - \\rho_{dầu} = 1.00 - 0.85 = 0.15\\text{ g/cm}^3', explanation: 'Sự chênh lệch khối lượng riêng tạo ra 2 pha lỏng không tan phân lớp rõ rệt (Pha dưới: Nước màu xanh; Pha trên: Dầu ăn màu vàng nhạt).' }
    ],
    stateMachine: {
      initialState: 'EMPTY_STOPCOCK_CLOSED',
      states: ['EMPTY_STOPCOCK_CLOSED', 'TWO_PHASE_SETTLED', 'DRAINING_LOWER_PHASE', 'INTERFACIAL_CUTOFF'],
      transitions: [
        { from: 'EMPTY_STOPCOCK_CLOSED', to: 'TWO_PHASE_SETTLED', trigger: 'Oil and water mixed & allowed to stand', guard: 't_stand > 5s' },
        { from: 'TWO_PHASE_SETTLED', to: 'DRAINING_LOWER_PHASE', trigger: 'Stopcock turned open 90°', guard: 'isOpen == true' },
        { from: 'DRAINING_LOWER_PHASE', to: 'INTERFACIAL_CUTOFF', trigger: 'Boundary reaches stopcock', guard: 'v_lower == 0' }
      ]
    },
    errorBudget: {
      instrumentalError: '±2.0 ml độ chính xác điểm cắt pha',
      leastCount: 'Dung tích 250 ml (ĐCNN 10 ml)',
      repeatability: 'Khóa van PTFE tự bôi trơn kín khít 100% không rò rỉ',
      temperatureDrift: 'Không đáng kể'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'LatheGeometry (Pear shape)', pbrMaterial: 'MeshPhysicalMaterial (Borosilicate, transmission 0.88)', renderOrder: 4, specialRole: 'Phễu chiết quả lê thủy tinh 250ml có vòi xả đáy' },
      { meshPart: 'handle', threeClass: 'CylinderGeometry (T-key)', pbrMaterial: 'MeshStandardMaterial (PTFE White Key)', renderOrder: 2, specialRole: 'Khóa van xoay 90° điều tiết dòng chảy' },
      { meshPart: 'aq_layer', threeClass: 'Cylinder / Cone', pbrMaterial: 'MeshPhysicalMaterial (Water phase, Blue)', renderOrder: 2, specialRole: 'Lớp dung dịch pha nước nặng chìm phía dưới' },
      { meshPart: 'org_layer', threeClass: 'Cylinder / Cone', pbrMaterial: 'MeshPhysicalMaterial (Oil phase, Yellowish)', renderOrder: 2, specialRole: 'Lớp dung dịch hữu cơ nhẹ nổi phía trên' }
    ],
    fmea: [
      { failureMode: 'Quên mở nút nhám trên đỉnh khi mở khóa vòi đáy', rootCause: 'Áp suất khí quyển bên trong giảm tạo chân không giữ chất lỏng', systemEffect: 'Dòng nước ngừng chảy dù van đáy đang mở', detectionMethod: 'P_internal < P_atm - 5 kPa', recoveryAction: 'Bắt buộc mở nút đậy trên đỉnh phễu trước khi vặn khóa xả pha dưới' }
    ]
  },

  'OL3D-EQP-DST-0001': {
    mathFormulas: [
      { latex: 'T_{sôi\\,ethanol} = 78.37^\\circ\\text{C} < T_{sôi\\,nước} = 100.00^\\circ\\text{C}', explanation: 'Nguyên lý chưng cất phân đoạn: Hợp chất có nhiệt độ sôi thấp hơn (rượu cồn) sẽ bay hơi trước, ngưng tụ trong ống sinh hàn và chảy vào bình hứng.' },
      { latex: 'Q_{ngưng\\,tụ} = m_{hơi} \\cdot L_{v} = \\dot{m}_{nước\\,làm\\,mát} \\cdot c_{nước} \\cdot \\Delta T_{nước}', explanation: 'Cân bằng nhiệt lượng trao đổi trong ống sinh hàn Liebig làm mát bằng nước chảy ngược chiều.' }
    ],
    stateMachine: {
      initialState: 'COLD_MIXTURE',
      states: ['COLD_MIXTURE', 'HEATING_RAMP', 'ETHANOL_BOILING_78C', 'WATER_BOILING_100C'],
      transitions: [
        { from: 'COLD_MIXTURE', to: 'HEATING_RAMP', trigger: 'Burner flame applied', guard: 'T < 78°C' },
        { from: 'HEATING_RAMP', to: 'ETHANOL_BOILING_78C', trigger: 'Temperature plateaus at 78°C', guard: 'T == 78.3°C' },
        { from: 'ETHANOL_BOILING_78C', to: 'WATER_BOILING_100C', trigger: 'All ethanol distilled over', guard: 'T rises to 100°C' }
      ]
    },
    errorBudget: {
      instrumentalError: '±0.5 °C nhiệt độ sôi đo tại nhánh cổ bình',
      leastCount: '250 ml dung tích bình cầu',
      repeatability: 'Độ tinh khiết sản phẩm ngưng tụ đạt 92 - 95% cồn',
      temperatureDrift: 'Chịu sốc nhiệt ΔT = 160°C'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'Sphere + Cylinder Branch', pbrMaterial: 'MeshPhysicalMaterial (Borosilicate Glass, transmission 0.88)', renderOrder: 4, specialRole: 'Bình cầu có nhánh cổ 250ml nối ống sinh hàn' },
      { meshPart: 'flame_group', threeClass: 'Flame particle mesh', pbrMaterial: 'MeshBasicMaterial (Combustion flame)', renderOrder: 5, specialRole: 'Ngọn lửa đèn cồn sưởi đáy bình qua lưới tản nhiệt' }
    ],
    fmea: [
      { failureMode: 'Đặt sai vị trí bầu nhiệt kế', rootCause: 'Cắm sâu nhiệt kế xuống tận đáy chất lỏng thay vì đặt ngang miệng nhánh thoát hơi', systemEffect: 'Đo sai nhiệt độ sôi của hơi ngưng tụ', detectionMethod: 'Cao độ bầu nhiệt kế != cao độ nhánh bình cầu', recoveryAction: 'Căn chỉnh bầu nhiệt kế nằm ngang tâm lỗ thoát hơi của nhánh bình cầu' }
    ]
  },

  'OL3D-EQP-MIC-0001': {
    mathFormulas: [
      { latex: 'M_{tổng} = M_{vật\\,kính} \\times M_{thị\\,kính} = (4\\times, 10\\times, 40\\times, 100\\times) \\times 10\\times = 40\\times, 100\\times, 400\\times, 1000\\times', explanation: 'Độ phóng đại quang học toàn phần của kính hiển vi quang học hai mắt.' },
      { latex: 'd_{phân\\,giải} = \\frac{\\lambda}{2 \\cdot NA} = \\frac{0.55\\,\\mu\\text{m}}{2 \\times 1.25} \\approx 0.22\\,\\mu\\text{m} = 220\\text{ nm}', explanation: 'Giới hạn phân giải nhiễu xạ quang học theo định luật Abbe (với vật kính dầu soi NA = 1.25).' },
      { latex: 'FOV_{\\mu\\text{m}} = \\frac{FN}{M_{vật\\,kính}} = \\frac{18\\text{ mm}}{M_{vật\\,kính}} \\implies FOV_{10x} = 1.8\\text{ mm} = 1800\\,\\mu\\text{m}', explanation: 'Đường kính trường nhìn hiển vi tương ứng trên lam kính tiêu bản.' }
    ],
    stateMachine: {
      initialState: 'STAGE_LOWERED',
      states: ['STAGE_LOWERED', 'SLIDE_CLAMPED', 'COARSE_FOCUSING', 'FINE_FOCUS_LOCKED', 'OIL_IMMERSION_MODE'],
      transitions: [
        { from: 'STAGE_LOWERED', to: 'SLIDE_CLAMPED', trigger: 'Slide inserted on stage clip', guard: 'hasSlide == true' },
        { from: 'SLIDE_CLAMPED', to: 'COARSE_FOCUSING', trigger: 'Coarse knob rotated', guard: 'stageY changes' },
        { from: 'COARSE_FOCUSING', to: 'FINE_FOCUS_LOCKED', trigger: 'Fine knob adjusted', guard: '|focusOffset| < 0.002 mm' }
      ]
    },
    errorBudget: {
      instrumentalError: 'Ốc vi cấp ĐCNN 0.002 mm (2 µm) hành trình',
      leastCount: 'Thanh đo thị kính 20 µm / 50 µm / 200 µm',
      repeatability: 'Hệ trục quang học đồng trục tuyệt đối 100%',
      temperatureDrift: 'Đèn LED chiếu sáng tiêu bản dịu mắt 6500K không nóng mẫu'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'ExtrudeGeometry Complex Arm', pbrMaterial: 'MeshPhysicalMaterial (Enamelled Cast Iron, white porcelain)', renderOrder: 1, specialRole: 'Thân khung cong chữ C vững chắc kèm mâm xoay vật kính' },
      { meshPart: 'stageGroup', threeClass: 'BoxGeometry + Clips', pbrMaterial: 'MeshStandardMaterial (Black Anodized Table)', renderOrder: 2, specialRole: 'Bàn sa trượt nâng hạ kèm kẹp giữ lam kính' },
      { meshPart: 'plunger', threeClass: 'Cylinder Knobs', pbrMaterial: 'MeshStandardMaterial (Metallic Knobs)', renderOrder: 2, specialRole: 'Ốc sơ cấp (lớn) và ốc vi cấp (nhỏ) lấy nét' }
    ],
    fmea: [
      { failureMode: 'Bể lam kính tiêu bản / Trầy xước thấu kính', rootCause: 'Dùng ốc sơ cấp vặn bàn kính lên quá nhanh khi đang dùng vật kính 40x / 100x', systemEffect: 'Đầu vật kính đâm thẳng vào lam kính làm vỡ lamen', detectionMethod: 'Khoảng cách thấu kính tới lam kính < 0.1 mm', recoveryAction: 'Bắt buộc chỉ dùng ốc vi cấp khi ở vật kính 40x và 100x; tích hợp cữ hãm chống va chạm cơ học' }
    ]
  },

  'OL3D-EQP-DNA-0001': {
    mathFormulas: [
      { latex: 'L_{chu\\,kỳ} = 3.4\\text{ nm} = 34\\text{ Å}, \\quad d = 2.0\\text{ nm} = 20\\text{ Å}', explanation: 'Kích thước một chu kỳ xoắn của phân tử DNA B-form theo mô hình Watson–Crick.' },
      { latex: 'N_{cặp\\,nu} = 10.5\\text{ cặp/chu kỳ}, \\quad \\Delta L_{giữa\\,2\\,nu} = 0.34\\text{ nm}', explanation: 'Khoảng cách giữa hai cặp nucleotide kế tiếp dọc theo trục xoắn kép.' },
      { latex: '\\text{A} = \\text{T} \\; (2\\text{ liên kết hydro}), \\quad \\text{G} \\equiv \\text{X} \\; (3\\text{ liên kết hydro})', explanation: 'Nguyên tắc bổ sung giữa các bazơ nitơ trên hai mạch đối song song ($5\' \\to 3\'$ và $3\' \\to 5\'$).' }
    ],
    stateMachine: {
      initialState: 'INTACT_HELIX',
      states: ['INTACT_HELIX', 'ROTATING_360', 'BASE_PAIRS_HIGHLIGHTED', 'UNZIPPING_DEMO'],
      transitions: [
        { from: 'INTACT_HELIX', to: 'ROTATING_360', trigger: 'Auto rotation enabled', guard: 'true' },
        { from: 'INTACT_HELIX', to: 'BASE_PAIRS_HIGHLIGHTED', trigger: 'Base pair clicked', guard: 'true' }
      ]
    },
    errorBudget: {
      instrumentalError: 'Đúng 100% nguyên tắc bổ sung A-T và G-X',
      leastCount: 'Tỷ lệ mô hình phóng đại 1 : 10,000,000',
      repeatability: 'Khớp mộng cơ học chính xác từng liên kết hydro',
      temperatureDrift: 'Nhựa ABS bền bỉ'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'TubeGeometry (Double Helix Ribbon)', pbrMaterial: 'MeshPhysicalMaterial (Colored Plastics: Blue-A, Red-T, Green-G, Yellow-X)', renderOrder: 1, specialRole: 'Hai dải ruy băng photphat-đường xoắn ốc đối song song' },
      { meshPart: 'handle', threeClass: 'Cylinder Base & Stand', pbrMaterial: 'MeshStandardMaterial (Steel Stand)', renderOrder: 1, specialRole: 'Trụ đỡ và đế tròn xoay 360 độ' }
    ],
    fmea: [
      { failureMode: 'Lắp sai nguyên tắc bổ sung', rootCause: 'Cố tình gắn bazơ A với G hoặc T với X', systemEffect: 'Mô hình bị méo dạng không lắp ghép được', detectionMethod: 'Khóa cơ học mộng âm dương', recoveryAction: 'Chỉ cho phép liên kết mộng A-T (2 chốt) và G-X (3 chốt)' }
    ]
  },

  'OL3D-EQP-WDP-1000': {
    mathFormulas: [
      { latex: '\\frac{dV}{dt} = C_d \\cdot A_{van} \\cdot \\sqrt{2 \\cdot g \\cdot h_{nước}}', explanation: 'Lưu lượng xả nước định lượng qua vòi van mỏ xả.' },
      { latex: 'V_{cấp} = \\int_{0}^{t} \\dot{V}\\,dt = 15.0\\,\\text{ml/s} \\times t\\,(\\text{s})', explanation: 'Thể tích nước tinh khiết định lượng cấp vào cốc đốt hoặc ống đong.' }
    ],
    stateMachine: {
      initialState: 'VALVE_CLOSED',
      states: ['VALVE_CLOSED', 'VALVE_OPEN_POURING', 'OUT_OF_WATER'],
      transitions: [
        { from: 'VALVE_CLOSED', to: 'VALVE_OPEN_POURING', trigger: 'Push dispenser lever', guard: 'V_reservoir > 0' },
        { from: 'VALVE_OPEN_POURING', to: 'VALVE_CLOSED', trigger: 'Release dispenser lever', guard: 'true' },
        { from: 'VALVE_OPEN_POURING', to: 'OUT_OF_WATER', trigger: 'Reservoir depleted', guard: 'V_reservoir <= 0' }
      ]
    },
    errorBudget: {
      instrumentalError: '±1.0 ml độ chính xác ngắt van định lượng',
      leastCount: 'Dung tích chứa 1000 ml (ĐCNN 50 ml)',
      repeatability: '±0.5 ml',
      temperatureDrift: 'Nước cất tinh khiết 25°C'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'CylinderGeometry (Reservoir)', pbrMaterial: 'MeshPhysicalMaterial (Polypropylene, opacity 0.45)', renderOrder: 4, specialRole: 'Bình trụ lớn dung tích 1000ml có vạch chia' },
      { meshPart: 'plunger', threeClass: 'Box Lever Handle', pbrMaterial: 'MeshStandardMaterial (Blue Valve Lever)', renderOrder: 2, specialRole: 'Cần gạt mở van lò xo tự đóng khi nhả tay' },
      { meshPart: 'spout_stream', threeClass: 'Cylinder Stream', pbrMaterial: 'MeshPhysicalMaterial (Water, emissive blue)', renderOrder: 2, specialRole: 'Tia nước thẳng đứng chảy vào miệng cốc bên dưới' }
    ],
    fmea: [
      { failureMode: 'Nước xả rơi ra ngoài mặt bàn', rootCause: 'Không đặt cốc hoặc ống đong dưới khay hứng vòi xả', systemEffect: 'Nước tràn ướt mặt bàn thực hành', detectionMethod: 'Không phát hiện dụng cụ hứng tại CONN_WATER_DISPENSER_SPOUT', recoveryAction: 'Tự động khóa van và hiển thị chỉ dẫn đặt cốc hứng vào khay mâm đỡ' }
    ]
  },

  'OL3D-EQP-OBN-0001': {
    mathFormulas: [
      { latex: 'x_{thấu\\,kính} - x_{vật} = d, \\quad x_{màn} - x_{thấu\\,kính} = d\'', explanation: 'Quan hệ tọa độ một chiều 1D trên thước chia độ của giá quang học.' },
      { latex: 'L_{tổng} = d + d\' = x_{màn} - x_{vật} \\ge 4f', explanation: 'Điều kiện tối thiểu về khoảng cách giữa vật và màn để có thể hứng được ảnh thật trên màn chắn.' }
    ],
    stateMachine: {
      initialState: 'EMPTY_RAIL',
      states: ['EMPTY_RAIL', 'CARRIAGES_MOUNTED', 'OPTICAL_SYSTEM_ALIGNED'],
      transitions: [
        { from: 'EMPTY_RAIL', to: 'CARRIAGES_MOUNTED', trigger: 'Carriages snapped onto rail', guard: 'count > 0' },
        { from: 'CARRIAGES_MOUNTED', to: 'OPTICAL_SYSTEM_ALIGNED', trigger: 'Lamp, Object, Lens, Screen mounted', guard: 'count == 4' }
      ]
    },
    errorBudget: {
      instrumentalError: '±0.5 mm trên chiều dài 1000 mm',
      leastCount: '1.0 mm (Vạch chia milimet hai bên rãnh)',
      repeatability: 'Độ thẳng rãnh trượt sai lệch < 0.05 mm',
      temperatureDrift: 'Nhôm định hình: 2.3 × 10⁻⁵ K⁻¹'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'BoxGeometry with Dovetail slot', pbrMaterial: 'MeshStandardMaterial (Anodized Aluminium, color 0x334155)', renderOrder: 1, specialRole: 'Ray nhôm 1m có rãnh mộng mang cá và thước chia mm' },
      { meshPart: 'optical_axis_line', threeClass: 'LineBasicMaterial', pbrMaterial: 'LineBasicMaterial (Red/Cyan guide)', renderOrder: 5, specialRole: 'Đường trục quang học ảo đồng quy cao độ y = 125mm' }
    ],
    fmea: [
      { failureMode: 'Khoảng cách vật - màn L < 4f không tìm thấy ảnh', rootCause: 'Đặt khoảng cách vật và màn nhỏ hơn 40 cm (với thấu kính f = 10 cm)', systemEffect: 'Di chuyển màn khắp ray vẫn không thu được ảnh rõ nét', detectionMethod: 'L = d + d\' < 4f', recoveryAction: 'Kéo màn chắn ra xa vật tối thiểu L >= 4f = 40.0 cm' }
    ]
  },

  'OL3D-EQP-OLP-0001': {
    mathFormulas: [
      { latex: 'P_{điện} = U \\cdot I = \\frac{U^2}{R_{tim}} = \\frac{(12.0\\text{ V})^2}{7.2\\,\\Omega} = 20.0\\text{ W}', explanation: 'Công suất tiêu thụ định mức của bóng đèn Halogen.' },
      { latex: 'E_{quang}(d) = \\frac{I_{cường\\,độ}}{d^2} \\cdot \\cos\\theta', explanation: 'Độ rọi trên mặt vật sáng chữ F suy giảm theo bình phương khoảng cách.' }
    ],
    stateMachine: {
      initialState: 'UNPOWERED',
      states: ['UNPOWERED', 'CIRCUIT_CONNECTED_LAMP_OFF', 'LAMP_GLOWING', 'OVERVOLTAGE_BURNOUT'],
      transitions: [
        { from: 'UNPOWERED', to: 'LAMP_GLOWING', trigger: 'Power turned on and circuit closed', guard: 'isCircuitClosed && V >= 2.5V' },
        { from: 'LAMP_GLOWING', to: 'OVERVOLTAGE_BURNOUT', trigger: 'Voltage exceeds 14V', guard: 'V > 14.0V' }
      ]
    },
    errorBudget: {
      instrumentalError: 'Độ rọi tâm > 8000 lux ở cự ly 10 cm',
      leastCount: 'Điện áp danh định 12.0 V DC/AC',
      repeatability: 'Nhiệt độ màu tim đèn 3000 K (vàng ấm)',
      temperatureDrift: 'Vỏ tản nhiệt nhôm đùn duy trì < 55°C'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'BoxGeometry + Cooling fins', pbrMaterial: 'MeshStandardMaterial (Black Anodized Aluminium)', renderOrder: 1, specialRole: 'Hộp đèn tản nhiệt có khe cài tấm chắn sáng' },
      { meshPart: 'lamp_point_light', threeClass: 'PointLight', pbrMaterial: 'PointLight (Color 0xffedd5, decay 2)', renderOrder: 6, specialRole: 'Nguồn sáng điểm phát xạ ánh sáng thực tế trong cảnh 3D' }
    ],
    fmea: [
      { failureMode: 'Cháy bóng đèn Halogen', rootCause: 'Điều chỉnh biến áp lên 15V - 20V vượt quá định mức 12V', systemEffect: 'Đứt tim sợi đốt vonfram, đèn tắt ngấm', detectionMethod: 'V_terminal > 14.0 V', recoveryAction: 'Bấm nút Thay bóng đèn mới và hạ điện áp nguồn về 12V' }
    ]
  },

  'OL3D-EQP-FOB-0001': {
    mathFormulas: [
      { latex: 'h_{vật} = 20.0\\text{ mm}, \\quad w_{vật} = 12.0\\text{ mm}, \\quad \\text{Nét} = 3.0\\text{ mm}', explanation: 'Kích thước tiêu chuẩn hình chữ F trên kính mờ.' }
    ],
    stateMachine: {
      initialState: 'UNLIT',
      states: ['UNLIT', 'ILLUMINATED_BY_LAMP'],
      transitions: [
        { from: 'UNLIT', to: 'ILLUMINATED_BY_LAMP', trigger: 'Lamp turned on in front', guard: 'lampLit == true' }
      ]
    },
    errorBudget: {
      instrumentalError: '±0.1 mm kích thước nét chữ F',
      leastCount: 'Độ tương phản quang học > 90%',
      repeatability: '100% đối xứng quang học',
      temperatureDrift: 'Kính mờ chịu nhiệt tới 200°C'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'Box Frame Slider', pbrMaterial: 'MeshStandardMaterial (Black ABS)', renderOrder: 2, specialRole: 'Khung gắn ray quang học cữ đồng tâm y = 125mm' },
      { meshPart: 'scale_display', threeClass: 'PlaneGeometry', pbrMaterial: 'MeshBasicMaterial (Frosted F Texture)', renderOrder: 4, specialRole: 'Tấm kính mờ tán xạ in chữ F đen sắc nét' }
    ],
    fmea: [
      { failureMode: 'Đặt ngược mặt chữ F', rootCause: 'Gắn tấm kính mờ quay mặt sau ra trước', systemEffect: 'Chữ F bị lật ngang gương từ góc nhìn đèn', detectionMethod: 'Góc quay rotation.y != 0', recoveryAction: 'Xoay khung vật F hướng mặt trước chữ F thẳng về phía thấu kính (+Z)' }
    ]
  },

  'OL3D-EQP-SCR-0001': {
    mathFormulas: [
      { latex: 'h_{ảnh} = |k| \\cdot h_{vật} = \\left|\\frac{d\'}{d}\\right| \\cdot 20.0\\text{ mm}', explanation: 'Chiều cao ảnh thật của chữ F thu được trên màn hứng ảnh.' }
    ],
    stateMachine: {
      initialState: 'DIFFUSE_BLURRED',
      states: ['DIFFUSE_BLURRED', 'SHARP_REAL_IMAGE', 'OUT_OF_FOCUS'],
      transitions: [
        { from: 'DIFFUSE_BLURRED', to: 'SHARP_REAL_IMAGE', trigger: 'Screen position matches d\'', guard: '|x_screen - x_expected| < 1 mm' }
      ]
    },
    errorBudget: {
      instrumentalError: 'Độ phẳng bề mặt hứng ảnh < 0.1 mm',
      leastCount: '1.0 mm vạch chia lưới tọa độ',
      repeatability: 'Hình ảnh sắc nét viền rõ',
      temperatureDrift: 'Không đáng kể'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'Box Slider', pbrMaterial: 'MeshStandardMaterial (Black ABS)', renderOrder: 2, specialRole: 'Chân trượt có ốc hãm trên ray quang học' },
      { meshPart: 'scale_display', threeClass: 'PlaneGeometry', pbrMaterial: 'MeshBasicMaterial (White Matte Screen Texture)', renderOrder: 4, specialRole: 'Màn chắn trắng mờ hứng ảnh chữ F ngược chiều' }
    ],
    fmea: [
      { failureMode: 'Ảnh không hiện trên màn do thấu kính phân kì', rootCause: 'Dùng thấu kính phân kì (f < 0) tạo ảnh ảo nằm phía trước thấu kính', systemEffect: 'Màn chắn đặt sau thấu kính không thể hứng được ảnh', detectionMethod: 'focalLength < 0', recoveryAction: 'Giải thích cho học sinh: Ảnh ảo không hứng được trên màn; chỉ quan sát được bằng mắt nhìn qua thấu kính' }
    ]
  },

  'OL3D-EQP-PSU-0001': {
    mathFormulas: [
      { latex: 'U_{ra} \\in \\{3.0\\text{ V}, 6.0\\text{ V}, 9.0\\text{ V}, 12.0\\text{ V}\\} \\; (\\text{DC & AC})', explanation: 'Các nấc điện áp ra định mức của máy biến áp hạ áp thí nghiệm.' },
      { latex: 'I_{max} = 3.0\\text{ A}, \\quad P_{max} = U \\cdot I = 12\\text{ V} \\times 3\\text{ A} = 36.0\\text{ W}', explanation: 'Công suất giới hạn bảo vệ tự động của nguồn điện trường học.' }
    ],
    stateMachine: {
      initialState: 'POWER_OFF',
      states: ['POWER_OFF', 'POWER_ON_STANDBY', 'OUTPUT_ACTIVE', 'SHORT_CIRCUIT_TRIPPED'],
      transitions: [
        { from: 'POWER_OFF', to: 'POWER_ON_STANDBY', trigger: 'Mains toggle switch on', guard: 'mainsVoltage == 220V' },
        { from: 'POWER_ON_STANDBY', to: 'OUTPUT_ACTIVE', trigger: 'Load connected', guard: 'R_load > 3.0 Ohm' },
        { from: 'OUTPUT_ACTIVE', to: 'SHORT_CIRCUIT_TRIPPED', trigger: 'Short circuit detected', guard: 'I_out > 3.5 A' }
      ]
    },
    errorBudget: {
      instrumentalError: '±2% điện áp ra định danh',
      leastCount: 'Nấc chuyển 3V (3 - 6 - 9 - 12 V)',
      repeatability: 'Ổn áp cao',
      temperatureDrift: 'Cầu chì nhiệt tự ngắt khi T biến áp > 75°C'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'BoxGeometry (Sheet Metal)', pbrMaterial: 'MeshStandardMaterial (Grey Powder Coated Steel)', renderOrder: 1, specialRole: 'Vỏ thép sơn tĩnh điện an toàn cách điện cấp II' },
      { meshPart: 'toggle_switch', threeClass: 'Box + Cylinder Lever', pbrMaterial: 'MeshStandardMaterial (Red Rocker Switch)', renderOrder: 2, specialRole: 'Công tắc lật nguồn có đèn LED đỏ báo sáng' },
      { meshPart: 'terminal_pos', threeClass: 'Cylinder (Banana socket)', pbrMaterial: 'MeshStandardMaterial (Red Plastic, +)', renderOrder: 2, specialRole: 'Cọc cắm dương 12V màu đỏ' },
      { meshPart: 'terminal_neg', threeClass: 'Cylinder (Banana socket)', pbrMaterial: 'MeshStandardMaterial (Black Plastic, -)', renderOrder: 2, specialRole: 'Cọc cắm âm 0V màu đen' }
    ],
    fmea: [
      { failureMode: 'Nhảy rơ-le bảo vệ quá tải (Tripped)', rootCause: 'Nối tắt trực tiếp 2 cực dương và âm bằng dây dẫn (ngắn mạch)', systemEffect: 'Ngắt điện áp đầu ra bảo vệ thiết bị', detectionMethod: 'R_load < 0.5 Ohm', recoveryAction: 'Gỡ bỏ đoản mạch, bấm nút Reset Circuit Breaker trên mặt máy' }
    ]
  },

  'OL3D-EQP-LBX-0001': {
    mathFormulas: [
      { latex: 'D_{dp} = \\frac{1}{f\\,(\\text{m})} \\implies D_{+10} = +10\\text{ dp}, \\; D_{+5} = +20\\text{ dp}, \\; D_{-10} = -10\\text{ dp}', explanation: 'Độ tụ của từng thấu kính trong bộ 6 thấu kính tiêu chuẩn.' }
    ],
    stateMachine: {
      initialState: 'BOX_STORED',
      states: ['BOX_STORED', 'LENS_EXTRACTED', 'MOUNTED_IN_HOLDER'],
      transitions: [
        { from: 'BOX_STORED', to: 'LENS_EXTRACTED', trigger: 'Lens picked from box slot', guard: 'true' },
        { from: 'LENS_EXTRACTED', to: 'MOUNTED_IN_HOLDER', trigger: 'Inserted into optical lens carriage socket', guard: 'dist < 0.15m' }
      ]
    },
    errorBudget: {
      instrumentalError: '±1.0% tiêu cự định danh',
      leastCount: 'Bộ 6 thấu kính: +5, +10, +15, -10, -20, ∞ cm',
      repeatability: '100% tương thích ngàm cắm Ø10mm',
      temperatureDrift: 'Thủy tinh quang học BK7 tinh khiết'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'Box with 6 slots + Velvet Tray', pbrMaterial: 'MeshStandardMaterial (Wood / Velvet Blue)', renderOrder: 1, specialRole: 'Hộp gỗ lót nhung chứa 6 thấu kính' }
    ],
    fmea: [
      { failureMode: 'Lắp nhầm thấu kính phân kì thành hội tụ', rootCause: 'Không đọc ký hiệu khắc trên vành khung nhựa', systemEffect: 'Không tạo được ảnh thật trên màn chắn', detectionMethod: 'Kiểm tra thuộc tính lensProfileId', recoveryAction: 'Đọc kỹ trị số in trên vành nhựa (+ hội tụ, - phân kì)' }
    ]
  },

  'OL3D-EQP-LEV-0001': {
    mathFormulas: [
      { latex: '\\sum M_{(O)} = 0 \\iff F_1 \\cdot d_1 = F_2 \\cdot d_2 \\iff m_1 \\cdot x_1 = m_2 \\cdot x_2', explanation: 'Quy tắc mômen lực cho đòn bẩy thăng bằng quanh trục quay O nằm chính giữa.' },
      { latex: 'k_{đòn\\,bẩy} = \\frac{F_1}{F_2} = \\frac{d_2}{d_1}', explanation: 'Lợi ích về lực khi sử dụng đòn bẩy tỷ lệ nghịch với cánh tay đòn.' }
    ],
    stateMachine: {
      initialState: 'BALANCED_HORIZONTAL',
      states: ['BALANCED_HORIZONTAL', 'TILTED_LEFT', 'TILTED_RIGHT', 'DYNAMIC_OSCILLATION'],
      transitions: [
        { from: 'BALANCED_HORIZONTAL', to: 'TILTED_LEFT', trigger: 'Left torque exceeds right', guard: 'm1*d1 > m2*d2' },
        { from: 'BALANCED_HORIZONTAL', to: 'TILTED_RIGHT', trigger: 'Right torque exceeds left', guard: 'm2*d2 > m1*d1' },
        { from: 'DYNAMIC_OSCILLATION', to: 'BALANCED_HORIZONTAL', trigger: 'Torques equalize', guard: 'm1*d1 == m2*d2' }
      ]
    },
    errorBudget: {
      instrumentalError: 'Độ nhạy cân bằng 0.5 g ở cự ly 10 cm',
      leastCount: 'Thước chia vạch đối xứng bước 10 mm',
      repeatability: 'Khớp quay bi thép ma sát cực nhỏ < 0.001 N.m',
      temperatureDrift: 'Không đáng kể'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'Cylinder Column + Box Base', pbrMaterial: 'MeshStandardMaterial (Cast Iron Stand)', renderOrder: 1, specialRole: 'Trụ đỡ và trục quay kim loại trung tâm' },
      { meshPart: 'plunger', threeClass: 'Box Bar with 20 notches', pbrMaterial: 'MeshStandardMaterial (Anodized Aluminium Bar)', renderOrder: 2, specialRole: 'Thanh đòn bẩy chia vạch đối xứng nghiêng góc theta' },
      { meshPart: 'scale_display', threeClass: 'PlaneGeometry', pbrMaterial: 'MeshBasicMaterial (CanvasTexture)', renderOrder: 3, specialRole: 'Đĩa hiển thị góc nghiêng và mômen lực hai bên' }
    ],
    fmea: [
      { failureMode: 'Đòn bẩy bị kẹt không quay mượt mà', rootCause: 'Bụi bẩn bám vào trục quay bi kim loại', systemEffect: 'Mất độ nhạy thăng bằng', detectionMethod: 'Hệ số ma sát trục > 0.01 N.m', recoveryAction: 'Bấm nút Tinh chỉnh bôi trơn trục quay để khôi phục dao động tự do' }
    ]
  },

  'OL3D-EQP-HYD-0001': {
    mathFormulas: [
      { latex: 'P_A = P_B = P_C = P_{atm} + \\rho \\cdot g \\cdot h', explanation: 'Áp suất thủy tĩnh tại đáy các nhánh bình thông nhau bằng nhau.' },
      { latex: 'h_1 = h_2 = h_3', explanation: 'Trong bình thông nhau chứa cùng một chất lỏng đứng yên, các mực chất lỏng ở các nhánh luôn luôn ở cùng một độ cao, bất kể hình dạng và tiết diện các nhánh.' }
    ],
    stateMachine: {
      initialState: 'EMPTY',
      states: ['EMPTY', 'FILLING_LIQUID', 'LEVELS_EQUALIZED', 'TILTED_MAINTAINING_LEVEL'],
      transitions: [
        { from: 'EMPTY', to: 'FILLING_LIQUID', trigger: 'Liquid poured into branch A', guard: 'V > 0' },
        { from: 'FILLING_LIQUID', to: 'LEVELS_EQUALIZED', trigger: 'Fluid relaxation elapsed', guard: '|dh/dt| < 0.1 mm/s' },
        { from: 'LEVELS_EQUALIZED', to: 'TILTED_MAINTAINING_LEVEL', trigger: 'Apparatus base tilted', guard: 'tiltAngle != 0' }
      ]
    },
    errorBudget: {
      instrumentalError: 'Độ đồng đều mực nước giữa 3 nhánh <= 0.5 mm',
      leastCount: 'ĐCNN 1.0 mm trên thước đo chiều cao',
      repeatability: '100% tuân thủ định luật bình thông nhau',
      temperatureDrift: 'Không đáng kể'
    },
    geometryDetails: [
      { meshPart: 'body', threeClass: 'Composite Lathe/Tubes (3 branches)', pbrMaterial: 'MeshPhysicalMaterial (Borosilicate, transmission 0.90)', renderOrder: 4, specialRole: 'Bình thông nhau 3 nhánh dị hình: Nhánh trụ thẳng, Nhánh xoắn lò xo, Nhánh phình cầu' },
      { meshPart: 'liquid_surface', threeClass: 'Composite Water Meshes', pbrMaterial: 'MeshPhysicalMaterial (Colored Water, IOR 1.333)', renderOrder: 2, specialRole: 'Mặt nước đồng phẳng ngang tuyệt đối ở cả 3 nhánh' }
    ],
    fmea: [
      { failureMode: 'Mực nước ở nhánh xoắn bị thấp hơn do bọt khí', rootCause: 'Bọt khí đọng trong khúc uốn lò xo cản trở áp suất thủy tĩnh', systemEffect: 'Vi phạm định luật h1 = h2 = h3', detectionMethod: 'Khí chặn ngang ống', recoveryAction: 'Bấm nút Xả bọt khí để dòng nước lưu thông liền mạch' }
    ]
  }
};
