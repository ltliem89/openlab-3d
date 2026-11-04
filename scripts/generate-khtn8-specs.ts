import * as fs from 'fs';
import * as path from 'path';

interface SpecData {
  stt: string;
  id: string;
  catalogId: string;
  bgdCode: string;
  nameVi: string;
  nameEn: string;
  discipline: string;
  lesson: string;
  scientificFeatures: string;
  principles: string;
  formulas: string;
  dimensionsTable: Array<{ part: string; dimensionMm: string; dimension3d: string; role: string }>;
  proportionsTable: Array<{ ratioName: string; formula: string; value: string; significance: string }>;
  toleranceTable: Array<{ connection: string; nominalSize: string; tolerance: string; fitType: string }>;
  snapPoints: Array<{ name: string; position: string; type: string; direction: string; compatibleWith: string }>;
  dof: string;
  userActions: string;
  hitboxes: string;
  states: Array<{ variable: string; type: string; range: string; defaultVal: string; description: string }>;
  solverLogic: string;
  visualFeedback: string;
  audioFeedback: string;
  operatingLimits: string;
  failureModes: Array<{ errorAction: string; physicalConsequence: string; pedagogicalWarning: string }>;
  sceneGraphHierarchy: string;
  pivotPlacement: string;
  materialsTable: Array<{ meshPart: string; materialType: string; pbrParams: string; visualAppearance: string }>;
}

const specs: SpecData[] = [
  // 01: Thanh đòn bẩy
  {
    stt: "01",
    id: "lever-balance-arm",
    catalogId: "OL3D-EQP-LEV-0001",
    bgdCode: "TB-KHTN8-CO-01",
    nameVi: "Thanh đòn bẩy chia vạch đối xứng",
    nameEn: "Symmetrical Calibrated Lever Arm",
    discipline: "Vật lý - Cơ học & Chuyển động quay",
    lesson: "Bài: Tác dụng làm quay của lực - Đòn bẩy (SGK KHTN 8)",
    scientificFeatures: "Thanh đòn bẩy đóng vai trò vật rắn có trục quay cố định, được sử dụng để khảo sát thực nghiệm điều kiện cân bằng mômen lực khi chịu tác dụng của các lực tác động song song cùng phương hoặc ngược phương tại các khoảng cách cánh tay đòn khác nhau.",
    principles: "Thanh nằm cân bằng ngang khi tổng mômen của các lực làm quay theo chiều kim đồng hồ triệt tiêu hoàn toàn tổng mômen của các lực làm quay ngược chiều kim đồng hồ quanh trục quay $O$. Khi có chênh lệch mômen, thanh quay quanh trục $O$ với gia tốc góc $\\beta = \\frac{\\sum M}{I}$ cho tới khi chạm cữ hãm giới hạn góc.",
    formulas: `Điều kiện cân bằng tổng quát:
$$\\sum \\vec{M}_O = \\vec{0} \\iff \\sum M_{\\text{thuận}} = \\sum M_{\\text{nghịch}}$$
Đối với 2 nhóm tải trọng treo thẳng đứng ở hai phía trục quay:
$$F_1 \\cdot d_1 = F_2 \\cdot d_2 \\iff m_1 \\cdot g \\cdot d_1 = m_2 \\cdot g \\cdot d_2 \\iff m_1 \\cdot d_1 = m_2 \\cdot d_2$$
Phương trình động học quay khi mất cân bằng (bỏ qua ma sát trục):
$$I \\cdot \\frac{d^2 \\theta}{dt^2} = \\sum_{i=1}^n F_i \\cdot d_i \\cdot \\cos\\theta - c \\cdot \\frac{d\\theta}{dt}$$
với $I = \\frac{1}{12} M L^2 + \\sum m_i d_i^2$, và $c$ là hệ số cản không khí.`,
    dimensionsTable: [
      { part: "Thân thanh đòn bẩy", dimensionMm: "400 x 18 x 4 mm", dimension3d: "0.400 x 0.018 x 0.004 m", role: "Khung chịu lực chính, phân bổ các lỗ treo" },
      { part: "Lỗ trục quay tâm O", dimensionMm: "Đường kính 6.2 mm", dimension3d: "0.0062 m", role: "Khớp quay ăn khớp với chốt giá đỡ" },
      { part: "Các lỗ treo móc (18 lỗ)", dimensionMm: "Đường kính 2.5 mm", dimension3d: "0.0025 m", role: "Điểm móc quả nặng, cách nhau đúng 20 mm" },
      { part: "Đai ốc ren vi chỉnh 2 đầu (2 bộ)", dimensionMm: "Ren M4 x 25 mm, tán tròn phi 8 x 8 mm", dimension3d: "phi 0.008 x 0.008 m", role: "Cân bằng zero ban đầu trước khi làm thí nghiệm" }
    ],
    proportionsTable: [
      { ratioName: "Tỷ lệ Dài : Rộng : Dày", formula: "L : W : T", value: "100 : 4.5 : 1 (400 : 18 : 4 mm)", significance: "Đảm bảo độ cứng uốn dọc trục, thanh không bị võng khi treo tải trọng tối đa" },
      { ratioName: "Bước chia lỗ / Nửa chiều dài", formula: "\\Delta d / (L/2)", value: "20 mm / 200 mm = 10%", significance: "Mỗi bước nhảy cánh tay đòn chiếm chính xác 10% chiều dài mỗi nhánh" },
      { ratioName: "Đường kính lỗ trục / Chiều rộng thanh", formula: "\\varnothing_{trục} / W", value: "6.2 mm / 18 mm = 34.4%", significance: "Đủ vững chắc tại tâm xoay mà không làm yếu tiết diện chịu cắt" }
    ],
    toleranceTable: [
      { connection: "Lỗ tâm thanh - Chốt xoay giá đỡ", nominalSize: "6.0 mm", tolerance: "+0.2 mm / +0.05 mm", fitType: "Lắp lỏng (Free running fit), ma sát cực thấp" },
      { connection: "Lỗ móc treo - Móc quả nặng 50g", nominalSize: "2.0 mm", tolerance: "+0.5 mm", fitType: "Lắp tự do, móc treo lọt nhẹ nhàng không kẹt" }
    ],
    snapPoints: [
      { name: "PivotCenterPort", position: "(0, 0, 0)", type: "mechanical_pivot", direction: "Trục Z", compatibleWith: "lever-pivot-stand.UpperPin" },
      { name: "LeftHole_1..9", position: "(-0.02 * k, 0, 0)", type: "suspension_hook", direction: "Thẳng đứng xuống -Y", compatibleWith: "hooked-weight-50g.TopHook" },
      { name: "RightHole_1..9", position: "(+0.02 * k, 0, 0)", type: "suspension_hook", direction: "Thẳng đứng xuống -Y", compatibleWith: "hooked-weight-50g.TopHook" }
    ],
    dof: "1 DOF: Quay tự do quanh trục Z tại tâm O. Góc xoay giới hạn [-30 deg, +30 deg] (tương đương [-0.523 rad, +0.523 rad]) do chạm gờ chặn của giá đỡ.",
    userActions: "1. Kéo thả thanh đòn bẩy vào chốt ngàm của giá đỡ để gắn kết.\n2. Vặn ốc vi chỉnh 2 đầu bằng chuột/cảm ứng để đưa thanh về trạng thái thăng bằng ngang ban đầu.\n3. Kéo quả nặng 50g thả vào các lỗ treo từ số 1 đến số 9 ở hai cánh.\n4. Đọc giá trị cân bằng và quan sát góc lệch trực tiếp.",
    hitboxes: "Hộp va chạm OBB (Oriented Bounding Box) kích thước 0.400 x 0.022 x 0.012 m bám theo chuyển động quay của thanh, tối ưu hóa raycasting cho cả 18 lỗ treo.",
    states: [
      { variable: "isMounted", type: "boolean", range: "true / false", defaultVal: "false", description: "Trạng thái đã lắp lên giá đỡ trục quay hay chưa" },
      { variable: "angleRad", type: "number", range: "[-0.523, +0.523]", defaultVal: "0.0", description: "Góc quay của đòn bẩy so với phương ngang (rad)" },
      { variable: "torqueLeft", type: "number", range: "[0, 5.0]", defaultVal: "0.0", description: "Tổng mômen lực nhánh trái (N.m)" },
      { variable: "torqueRight", type: "number", range: "[0, 5.0]", defaultVal: "0.0", description: "Tổng mômen lực nhánh phải (N.m)" },
      { variable: "isBalanced", type: "boolean", range: "true / false", defaultVal: "true", description: "Đạt trạng thái thăng bằng (|torqueLeft - torqueRight| < 0.005 N.m)" }
    ],
    solverLogic: "Khi có quả nặng móc vào các lỗ treo, hệ thống tính toán: $$M_{\\text{trái}} = \\sum m_{L,i} \\cdot g \\cdot d_{L,i}, \\quad M_{\\text{phải}} = \\sum m_{R,i} \\cdot g \\cdot d_{R,i}$$\nNếu $|M_{\\text{trái}} - M_{\\text{phải}}| < 0.005\\text{ N}\\cdot\\text{m}$, kích hoạt giảm chấn dao động đưa `angleRad` về $0.0$. Nếu lệch, thanh quay nghiêng về bên có mômen lớn hơn với tốc độ góc suy giảm theo ma sát nhớt.",
    visualFeedback: "• Vạch số laser phát sáng xanh lục nhẹ khi đạt trạng thái cân bằng hoàn hảo.\n• Hiển thị thước đo độ góc nghiêng ảo dạng HUD khi đang xoay.\n• Mũi tên vector trọng lực $P_i$ hiển thị trực quan tại điểm treo.",
    audioFeedback: "• Tiếng 'tách' kim loại nhẹ khi quả nặng khớp vào lỗ treo.\n• Tiếng gõ chạm nhẹ 'cạch' khi đòn bẩy nghiêng chạm cữ chặn cơ học.",
    operatingLimits: "Tải trọng tối đa mỗi bên: $5.0\\text{ N}$ (tương đương $10$ quả nặng $50\\text{ g} = 500\\text{ g}$). Không cho phép tác dụng lực bẻ vặn theo trục X hoặc Y.",
    failureModes: [
      { errorAction: "Treo quá 500g vào một bên đầu ngoài cùng (lỗ số 9)", physicalConsequence: "Mômen vượt quá 0.9 N.m làm cong vênh thanh nhôm hoặc gãy chốt trục tâm", pedagogicalWarning: "Cảnh báo quá tải: Giới hạn thí nghiệm THCS khuyến nghị tối đa 3-4 quả nặng 50g mỗi bên." },
      { errorAction: "Thực hiện thí nghiệm khi chưa chỉnh thăng bằng zero 2 ốc đối trọng", physicalConsequence: "Sai số hệ thống khiến kết quả F1.d1 != F2.d2", pedagogicalWarning: "Quy tắc bắt buộc: Phải chỉnh thanh thăng bằng tuyệt đối trước khi móc tải." }
    ],
    sceneGraphHierarchy: `LeverArm_Root (Group)
  ├── Mesh_MainBeam (ExtrudeGeometry, Nhôm phay xước)
  │     └── Vạch chia & số khắc laser (DecalGeometry / CanvasTexture)
  ├── Group_LeftTrimNut (Ốc vi chỉnh trái)
  ├── Group_RightTrimNut (Ốc vi chỉnh phải)
  └── Ports_Holes[0..17] (SnapPoint Anchor Objects)`,
    pivotPlacement: "Tâm gốc tọa độ (0, 0, 0) đặt chính xác tại tâm hình học của lỗ trục quay O, đảm bảo ma trận biến đổi quay khớp hoàn toàn với trục giá đỡ.",
    materialsTable: [
      { meshPart: "Thân thanh nhôm", materialType: "MeshStandardMaterial", pbrParams: "color: #d0d7de, metalness: 0.85, roughness: 0.25", visualAppearance: "Hợp kim nhôm xước mờ mạ anode chống xước" },
      { meshPart: "Vạch số khắc", materialType: "MeshBasicMaterial", pbrParams: "color: #0f172a / #dc2626", visualAppearance: "Vạch đen, số đỏ rõ nét chống lóa" },
      { meshPart: "Đai ốc vi chỉnh", materialType: "MeshStandardMaterial", pbrParams: "color: #eab308, metalness: 0.9, roughness: 0.2", visualAppearance: "Đồng thau khía rãnh nhám công thái học" }
    ]
  },

  // 02: Giá đỡ trục quay đòn bẩy
  {
    stt: "02",
    id: "lever-pivot-stand",
    catalogId: "OL3D-EQP-LEV-0002",
    bgdCode: "TB-KHTN8-CO-02",
    nameVi: "Giá đỡ trục quay đòn bẩy",
    nameEn: "Lever Pivot Stand",
    discipline: "Vật lý - Cơ học",
    lesson: "Bài: Tác dụng làm quay của lực - Đòn bẩy (SGK KHTN 8)",
    scientificFeatures: "Cung cấp điểm tựa cố định (fulcrum) có độ cứng vững cao và ma sát quay tối thiểu để thanh đòn bẩy dao động tự do trong mặt phẳng thẳng đứng mà không bị rung lắc hay lật đổ.",
    principles: "Thế năng trọng trường của giá đỡ cực tiểu nhờ khối lượng đế gang lớn tập trung ở sát đáy. Trọng tâm toàn hệ luôn nằm sâu bên trong đa giác chân đế, thỏa mãn điều kiện cân bằng tĩnh học: $\\vec{R} + \\vec{P}_{\\text{đế}} + \\vec{P}_{\\text{tải}} = \\vec{0}$.",
    formulas: `Điều kiện chống lật giá đỡ khi chịu tải trọng lệch cực đại $F_{\\max} = 5\\text{ N}$ ở khoảng cách $d = 0.18\\text{ m}$:
$$M_{\\text{lật}} = F_{\\max} \\cdot d = 5 \\times 0.18 = 0.90\\text{ N}\\cdot\\text{m}$$
Mômen chống lật của chân đế (chiều dài đế $b = 0.14\\text{ m}$, khối lượng $M_{\\text{đế}} = 0.75\\text{ kg}$):
$$M_{\\text{chống lật}} = M_{\\text{đế}} \\cdot g \\cdot \\frac{b}{2} = 0.75 \\times 9.8 \\times 0.07 = 0.5145\\text{ N}\\cdot\\text{m}$$
Hệ số an toàn chống trượt và lật được bổ trợ bởi 4 chân đệm cao su giác mút: $\\mu_{\\text{ma sát}} \\ge 0.6$.`,
    dimensionsTable: [
      { part: "Đế giá đỡ", dimensionMm: "140 x 90 x 18 mm", dimension3d: "0.140 x 0.090 x 0.018 m", role: "Chân đế đối trọng hạ thấp trọng tâm" },
      { part: "Trụ đứng thép", dimensionMm: "phi 10 x 280 mm", dimension3d: "phi 0.010 x 0.280 m", role: "Cột chịu lực thẳng đứng" },
      { part: "Cụm ngàm chữ U", dimensionMm: "22 x 20 x 30 mm", dimension3d: "0.022 x 0.020 x 0.030 m", role: "Khung giữ chốt quay ngang" },
      { part: "Chốt quay ngang", dimensionMm: "phi 6.0 x 24 mm", dimension3d: "phi 0.006 x 0.024 m", role: "Trục quay gá lắp thanh đòn bẩy" }
    ],
    proportionsTable: [
      { ratioName: "Chiều cao trụ / Chiều rộng đế", formula: "H_{trụ} / W_{đế}", value: "280 mm / 90 mm = 3.11", significance: "Tối ưu góc nhìn thao tác mà không gây ngã đổ" },
      { ratioName: "Khối lượng đế / Tổng khối lượng", formula: "m_{đế} / m_{tổng}", value: "750g / 850g = 88.2%", significance: "88% khối lượng dồn vào đế đáy, đảm bảo chống rung tối đa" }
    ],
    toleranceTable: [
      { connection: "Ren cắm trụ vào đế gang", nominalSize: "M10 x 1.5", tolerance: "6H/6g", fitType: "Ren siết chặt không rơ lắc" },
      { connection: "Chốt quay chữ U", nominalSize: "6.0 mm", tolerance: "-0.02 mm / -0.05 mm", fitType: "Đồng tâm tuyệt đối, mạ bóng giảm ma sát" }
    ],
    snapPoints: [
      { name: "TableBottomContact", position: "(0, 0, 0)", type: "surface_rest", direction: "Thẳng đứng lên +Y", compatibleWith: "LabTable.Surface" },
      { name: "UpperPin", position: "(0, 0.265, 0)", type: "mechanical_pivot", direction: "Trục Z", compatibleWith: "lever-balance-arm.PivotCenterPort" }
    ],
    dof: "0 DOF khi đặt trên bàn (cố định tĩnh). Cho phép nhấc di chuyển tự do trên mặt phẳng bàn XZ.",
    userActions: "1. Nhấp và kéo rê trên mặt bàn phòng thí nghiệm.\n2. Căn chỉnh vị trí đặt trước khi đưa thanh đòn bẩy lại gần.",
    hitboxes: "Hộp OBB kết hợp: Hộp đế 0.140 x 0.020 x 0.090 m và hộp trụ 0.025 x 0.280 x 0.025 m.",
    states: [
      { variable: "isRestingOnTable", type: "boolean", range: "true / false", defaultVal: "true", description: "Tiếp xúc vững chắc với mặt bàn" },
      { variable: "hasMountedArm", type: "boolean", range: "true / false", defaultVal: "false", description: "Đang gắn thanh đòn bẩy" }
    ],
    solverLogic: "Giữ vị trí tọa độ Y cố định ở mặt bàn ($Y = 0$). Tính toán phản lực chân đế $\\vec{N} = -\\vec{P}_{\\text{hệ}}$.",
    visualFeedback: "Đổ bóng phẳng mềm (Contact Shadow) ở 4 góc chân cao su.",
    audioFeedback: "Âm thanh trầm 'cộc' khi đặt đế giá đỡ xuống mặt bàn.",
    operatingLimits: "Tải trọng chịu lực dọc trục: $\\le 20\\text{ N}$.",
    failureModes: [
      { errorAction: "Đặt giá đỡ mấp mé mép bàn thí nghiệm", physicalConsequence: "Trọng tâm vượt ra ngoài mép bàn làm đổ thiết bị", pedagogicalWarning: "Luôn đặt giá đỡ ở trung tâm khu vực thực hành." }
    ],
    sceneGraphHierarchy: `PivotStand_Root (Group)
  ├── Mesh_CastIronBase (Đế gang đúc vát 4 góc)
  ├── Mesh_RubberFeet[0..3] (4 chân đệm cao su chống trượt)
  ├── Mesh_SteelPole (Trụ thép mạ Crom)
  ├── Mesh_ForkU (Khung chữ U)
  └── Mesh_PivotPin (Chốt ngang đồng thau)`,
    pivotPlacement: "Tọa độ đáy giữa chân đế (0, 0, 0) tiếp xúc mặt bàn.",
    materialsTable: [
      { meshPart: "Đế gang", materialType: "MeshStandardMaterial", pbrParams: "color: #1e293b, roughness: 0.7, metalness: 0.2", visualAppearance: "Sơn tĩnh điện nhám màu xanh than công nghiệp" },
      { meshPart: "Trụ thép", materialType: "MeshStandardMaterial", pbrParams: "color: #f8fafc, roughness: 0.15, metalness: 0.95", visualAppearance: "Inox sáng bóng loáng phản chiếu môi trường" }
    ]
  },

  // 03: Quả nặng có móc 2 đầu 50g
  {
    stt: "03",
    id: "hooked-weight-50g",
    catalogId: "OL3D-EQP-MEC-0001",
    bgdCode: "TB-KHTN8-CO-03",
    nameVi: "Quả nặng có móc 2 đầu 50g",
    nameEn: "Hooked Cylindrical Weight 50g",
    discipline: "Vật lý - Cơ học & Thủy tĩnh học",
    lesson: "Bài: Lực & Đòn bẩy, Khối lượng riêng, Lực đẩy Archimedes (SGK KHTN 8)",
    scientificFeatures: "Tạo tải trọng chuẩn và trọng lượng xác định trong các bài thí nghiệm cơ học, đồng thời đóng vai trò vật rắn đo thể tích chiếm chỗ chất lỏng và lực đẩy Archimedes khi nhúng chìm trong nước.",
    principles: "Vật thể chịu tác dụng của trọng lực $\\vec{P} = m \\cdot \\vec{g}$. Khi nhúng chìm trong chất lỏng, quả nặng chịu thêm lực đẩy Archimedes hướng thẳng đứng từ dưới lên bằng trọng lượng phần chất lỏng bị chiếm chỗ: $F_A = d_{\\text{lỏng}} \\cdot V_{\\text{vật}}$.",
    formulas: `Trọng lượng trong không khí:
$$P = m \\cdot g = 0.050\\text{ kg} \\times 9.8\\text{ m/s}^2 = 0.490\\text{ N} \\approx 0.5\\text{ N}$$
Thể tích quả nặng bằng đồng thau (khối lượng riêng $\\rho = 8400\\text{ kg/m}^3$):
$$V = \\frac{m}{\\rho} = \\frac{0.050}{8400} \\approx 5.952 \\times 10^{-6}\\text{ m}^3 = 5.95\\text{ cm}^3$$
Lực đẩy Archimedes khi nhúng chìm hoàn toàn trong nước nguyên chất ($\\rho_n = 1000\\text{ kg/m}^3$):
$$F_A = \\rho_n \\cdot g \\cdot V = 1000 \\times 9.8 \\times 5.952 \\times 10^{-6} \\approx 0.0583\\text{ N}$$
Trọng lượng biểu kiến đo được bằng lực kế khi chìm trong nước:
$$P' = P - F_A = 0.490 - 0.058 = 0.432\\text{ N}$$`,
    dimensionsTable: [
      { part: "Thân trụ kim loại", dimensionMm: "phi 20 x 25 mm", dimension3d: "phi 0.020 x 0.025 m", role: "Khối lượng chính 50g chuẩn" },
      { part: "Móc treo phía trên", dimensionMm: "Dây thép phi 1.5 mm, vươn cao 15 mm, uốn R = 4 mm", dimension3d: "0.015 m", role: "Móc vào lỗ đòn bẩy hoặc lực kế" },
      { part: "Rãnh khuyết & chốt đáy", dimensionMm: "Rãnh rộng 4 mm, sâu 5 mm, chốt ngang phi 1.5 mm", dimension3d: "0.005 m", role: "Nhận móc treo nối tiếp của quả nặng kế tiếp" }
    ],
    proportionsTable: [
      { ratioName: "Đường kính / Chiều cao thân trụ", formula: "\\varnothing / H", value: "20 mm / 25 mm = 0.8", significance: "Tỷ lệ chuẩn công nghiệp, hạn chế va đập lắc lư khi treo" },
      { ratioName: "Chiều cao móc treo / Tổng chiều cao", formula: "H_{móc} / H_{tổng}", value: "15 mm / 42 mm = 35.7%", significance: "Đảm bảo dễ thao tác móc dây mà không bị vướng" }
    ],
    toleranceTable: [
      { connection: "Độ chính xác khối lượng gia công", nominalSize: "50.00 g", tolerance: "+/- 0.20 g", fitType: "Cấp chính xác M1 (OIML R111)" }
    ],
    snapPoints: [
      { name: "TopHook", position: "(0, 0.021, 0)", type: "hook_attachment", direction: "Thẳng đứng lên +Y", compatibleWith: "lever-balance-arm.LeftHole / RightHole, spring-dynamometer.Hook" },
      { name: "BottomLoop", position: "(0, -0.018, 0)", type: "daisy_chain_slot", direction: "Thẳng đứng xuống -Y", compatibleWith: "hooked-weight-50g.TopHook" }
    ],
    dof: "Tự do khi cầm nắm. Khi treo: 2 DOF dao động góc hình nón con lắc (Pendulum Swing) quanh điểm móc.",
    userActions: "1. Kéo thả móc vào lỗ đòn bẩy.\n2. Móc nối tiếp quả thứ 2, thứ 3 vào đáy quả trước.\n3. Thả chìm vào cốc nước đo lực đẩy Archimedes.",
    hitboxes: "Hình trụ tròn capsule va chạm đường kính 0.022 m, chiều cao 0.045 m.",
    states: [
      { variable: "isSuspended", type: "boolean", range: "true / false", defaultVal: "false", description: "Đang được treo hay đặt trên bàn" },
      { variable: "isSubmerged", type: "boolean", range: "true / false", defaultVal: "false", description: "Đang chìm trong chất lỏng" },
      { variable: "parentWeightId", type: "string | null", range: "ID string", defaultVal: "null", description: "ID của quả nặng treo phía trên (nếu có)" }
    ],
    solverLogic: "Xây dựng cây xâu chuỗi trọng lực (Gravity Chain). Khi quả dưới cùng nhận lực, truyền ứng suất kéo lên quả trên và đòn bẩy.",
    visualFeedback: "Hiển thị số nổi `50g` sắc nét; hiệu ứng tạo bọt khí bám quanh thành khi thả vào cốc nước.",
    audioFeedback: "Âm vang kim loại leng keng khi hai quả nặng chạm nhau; tiếng 'ùm' nhẹ khi chìm vào nước.",
    operatingLimits: "Tải trọng kéo đứt móc: $\\ge 50\\text{ N}$.",
    failureModes: [
      { errorAction: "Móc quá 6 quả nối tiếp trên 1 nhánh đòn bẩy THCS", physicalConsequence: "Móc dưới cùng chạm mặt bàn thí nghiệm làm sai lệch phép đo", pedagogicalWarning: "Khuyến cáo chỉ móc tối đa 3-4 quả nối tiếp." }
    ],
    sceneGraphHierarchy: `HookedWeight_Root (Group)
  ├── Mesh_CylinderBody (Khối trụ đồng thau vát mép)
  │     └── Khắc chìm laser '50g' (BumpMap / NormalMap)
  ├── Mesh_TopHook (Móc thép uốn cong)
  └── Mesh_BottomPin (Chốt ngang rãnh âm)`,
    pivotPlacement: "Tâm gốc (0, 0, 0) tại tâm đối xứng khối trụ đồng.",
    materialsTable: [
      { meshPart: "Thân đồng thau", materialType: "MeshStandardMaterial", pbrParams: "color: #d4af37, metalness: 0.9, roughness: 0.2", visualAppearance: "Đồng thau vàng óng mạ bảo vệ" },
      { meshPart: "Móc thép", materialType: "MeshStandardMaterial", pbrParams: "color: #cbd5e1, metalness: 0.95, roughness: 0.1", visualAppearance: "Thép lò xo mạ Niken cứng cáp" }
    ]
  },

  // 04: Ống trụ màng cao su khảo sát áp suất chất lỏng
  {
    stt: "04",
    id: "liquid-pressure-tube",
    catalogId: "OL3D-EQP-HYD-0001",
    bgdCode: "TB-KHTN8-CO-04",
    nameVi: "Ống trụ khảo sát áp suất chất lỏng đáy & thành",
    nameEn: "Liquid Pressure Elastic Membrane Tube",
    discipline: "Vật lý - Áp suất chất lỏng",
    lesson: "Bài: Áp suất chất lỏng (SGK KHTN 8)",
    scientificFeatures: "Chứng minh thực nghiệm trực quan: Áp suất chất lỏng tác dụng lên đáy bình, thành bình và các vật đặt trong nó theo mọi hướng, độ lớn áp suất tăng tỷ lệ thuận với độ sâu.",
    principles: "Tại độ sâu $h$, áp suất chất lỏng gây áp lực lên bề mặt màng cao su. Khi áp suất bên trong lớn hơn bên ngoài, màng cao su biến dạng lồi ra; khi áp suất bên ngoài lớn hơn, màng cao su biến dạng lõm vào. Độ võng của màng $\\delta$ tỷ lệ thuận với độ chênh áp $\\Delta p$.",
    formulas: `Áp suất thủy tĩnh tại độ sâu $h$:
$$p = p_0 + d \\cdot h = p_0 + \\rho \\cdot g \\cdot h$$
Độ chênh lệch áp suất giữa mặt trong và mặt ngoài màng cao su:
$$\\Delta p = p_{\\text{trong}} - p_{\\text{ngoài}} = \\rho \\cdot g \\cdot (h_{\\text{trong}} - h_{\\text{ngoài}})$$
Độ phồng/lõm cực đại tại tâm màng tròn bán kính $R$ và độ dày $t$, mô đun đàn hồi $E$:
$$\\delta_{\\max} \\approx \\frac{\\Delta p \\cdot R^4}{64 \\cdot D_{\\text{uốn}}}, \\quad D_{\\text{uốn}} = \\frac{E \\cdot t^3}{12(1 - \\nu^2)}$$`,
    dimensionsTable: [
      { part: "Ống trụ nhựa Mica trong", dimensionMm: "phi ngoài 32 mm, phi trong 28 mm, cao 220 mm", dimension3d: "phi 0.032 x 0.220 m", role: "Thân ống chứa chất lỏng trong suốt" },
      { part: "Cửa sổ màng cao su bên hông", dimensionMm: "phi 18 mm, tâm cách đáy 40 mm", dimension3d: "phi 0.018 m", role: "Khảo sát áp suất tác dụng lên thành bình" },
      { part: "Màng cao su đáy bình", dimensionMm: "phi 32 mm, dày 0.15 mm", dimension3d: "phi 0.032 m", role: "Khảo sát áp suất tác dụng lên đáy bình" },
      { part: "Vành kẹp khóa màng", dimensionMm: "phi 34 x 10 mm", dimension3d: "phi 0.034 x 0.010 m", role: "Giữ kín màng cao su không rò rỉ nước" }
    ],
    proportionsTable: [
      { ratioName: "Chiều cao / Đường kính ngoài", formula: "H / \\varnothing", value: "220 mm / 32 mm = 6.875", significance: "Tạo cột nước đủ cao để màng cao su biến dạng rõ ràng quan sát mắt thường" },
      { ratioName: "Vị trí cửa sổ hông / Chiều cao ống", formula: "H_{hông} / H", value: "40 mm / 220 mm = 18.2%", significance: "Đặt sát đáy nơi áp suất thủy tĩnh lớn nhất" }
    ],
    toleranceTable: [
      { connection: "Vành ren kẹp cao su", nominalSize: "32.0 mm", tolerance: "+/- 0.1 mm", fitType: "Gioăng ép kín nước tuyệt đối (IP67)" }
    ],
    snapPoints: [
      { name: "TopFunnelPort", position: "(0, 0.110, 0)", type: "fluid_inlet", direction: "Thẳng đứng xuống -Y", compatibleWith: "beaker-250.Spout, dropper-pipette.Tip" },
      { name: "ImmersionHandle", position: "(0, 0.090, 0)", type: "clamp_grip", direction: "Ngang", compatibleWith: "UniversalClamp" }
    ],
    dof: "6 DOF tự do khi cầm tay di chuyển nhúng vào bể nước.",
    userActions: "1. Đổ nước vào trong lòng ống $\\rightarrow$ màng đáy và màng hông phồng lồi ra ngoài.\n2. Cầm ống dìm sâu dần vào bể nước lớn $\\rightarrow$ quan sát màng biến dạng lõm ngược vào trong.",
    hitboxes: "Hình trụ tròn 0.036 x 0.220 m bao phủ toàn bộ thân và vành kẹp.",
    states: [
      { variable: "internalWaterLevelMm", type: "number", range: "[0, 200]", defaultVal: "0.0", description: "Mực nước đổ bên trong ống (mm)" },
      { variable: "immersionDepthMm", type: "number", range: "[0, 300]", defaultVal: "0.0", description: "Độ sâu nhúng trong bể nước ngoài (mm)" },
      { variable: "sideBulgeFactor", type: "number", range: "[-1.0, 1.0]", defaultVal: "0.0", description: "Độ phồng màng hông (+ lồi ra, - lõm vào)" },
      { variable: "bottomBulgeFactor", type: "number", range: "[-1.0, 1.0]", defaultVal: "0.0", description: "Độ phồng màng đáy (+ lồi ra, - lõm vào)" }
    ],
    solverLogic: "Tính chênh áp $\\Delta p_{\\text{hông}} = \\rho g (h_{\\text{trong}} - h_{\\text{ngoài, hông}})$. Áp dụng hàm biến dạng đỉnh màng (Vertex Displacement Shader) trên lưới geometry của màng cao su theo thời gian thực.",
    visualFeedback: "• Màng cao su căng tròn lồi/lõm mượt mà theo độ sâu.\n• Mặt thoáng chất lỏng dao động gợn sóng khi nhấp nhô ống.",
    audioFeedback: "Tiếng nước chảy róc rách khi rót vào ống; tiếng ục nước khi dìm ống sâu.",
    operatingLimits: "Độ cao cột nước tối đa: $200\\text{ mm}$. Áp suất tối đa tránh rách màng: $\\Delta p \\le 5000\\text{ Pa}$.",
    failureModes: [
      { errorAction: "Dùng que nhọn hoặc lực kế đâm vào màng", physicalConsequence: "Rách màng cao su, nước tràn ra bàn", pedagogicalWarning: "Màng cao su rất mỏng, không dùng vật sắc nhọn chạm vào." }
    ],
    sceneGraphHierarchy: `LiquidPressureTube_Root (Group)
  ├── Mesh_AcrylicTube (Ống trụ mica trong suốt)
  ├── Mesh_BottomRing (Vòng kẹp ren đáy)
  ├── Mesh_SideRing (Vòng kẹp ren cửa sổ hông)
  ├── Mesh_BottomMembrane (Đĩa màng cao su đáy có morphTarget biến dạng)
  ├── Mesh_SideMembrane (Đĩa màng cao su hông có morphTarget biến dạng)
  └── Mesh_InnerWaterColumn (Cột nước bên trong tăng giảm theo chiều cao)`,
    pivotPlacement: "Tâm gốc (0, 0, 0) tại tâm mặt tròn đáy ống.",
    materialsTable: [
      { meshPart: "Ống mica", materialType: "MeshPhysicalMaterial", pbrParams: "transmission: 0.95, opacity: 1, roughness: 0.05, ior: 1.49, color: #ffffff", visualAppearance: "Nhựa Acrylic trong suốt không bọt khí" },
      { meshPart: "Màng cao su", materialType: "MeshStandardMaterial", pbrParams: "color: #fecdd3, roughness: 0.6, metalness: 0.05", visualAppearance: "Cao su tự nhiên đàn hồi mờ màu hồng nhạt" },
      { meshPart: "Cột nước", materialType: "MeshPhysicalMaterial", pbrParams: "transmission: 0.92, roughness: 0.02, ior: 1.333, color: #38bdf8", visualAppearance: "Nước trong xanh khúc xạ ánh sáng" }
    ]
  },

  // 05: Áp kế chữ U đo áp suất chất lỏng
  {
    stt: "05",
    id: "u-tube-manometer",
    catalogId: "OL3D-EQP-HYD-0002",
    bgdCode: "TB-KHTN8-CO-05",
    nameVi: "Áp kế chữ U đo áp suất chất lỏng",
    nameEn: "U-Tube Liquid Manometer",
    discipline: "Vật lý - Áp suất chất lỏng & Khí quyển",
    lesson: "Bài: Áp suất chất lỏng & Áp suất khí quyển (SGK KHTN 8)",
    scientificFeatures: "Đo độ chênh lệch áp suất chính xác bằng cột chất lỏng chỉ thị, kết hợp cùng hộp cảm ứng màng đàn hồi để đo định lượng áp suất thủy tĩnh tại các độ sâu và phương hướng khác nhau.",
    principles: "Khi một nhánh nối với hộp màng cảm ứng chịu áp suất $p$, áp lực đẩy cột chất lỏng nhánh đó tụt xuống và dâng lên ở nhánh hở đối diện. Độ chênh lệch chiều cao $\\Delta h$ phản ánh chính xác độ chênh áp suất theo nguyên lý áp kế vi sai thủy tĩnh.",
    formulas: `Định luật áp kế chữ U:
$$p_{\\text{cảm ứng}} - p_0 = \\rho_{\\text{chỉ thị}} \\cdot g \\cdot \\Delta h = \\rho_{\\text{chỉ thị}} \\cdot g \\cdot (h_2 - h_1)$$
Khi sử dụng nước pha màu ($\\rho = 1000\\text{ kg/m}^3$) đo áp suất cột nước sâu $h$:
$$\\Delta h = \\frac{\\rho_{\\text{nước}}}{\\rho_{\\text{chỉ thị}}} \\cdot h = h$$
(Độ chênh lệch $\\Delta h$ trên áp kế đúng bằng độ sâu dìm hộp cảm ứng trong nước).`,
    dimensionsTable: [
      { part: "Bảng gắn vạch chia", dimensionMm: "80 x 320 x 15 mm", dimension3d: "0.080 x 0.320 x 0.015 m", role: "Khung gắn đỡ ống và hiển thị thang đo mm" },
      { part: "Ống thủy tinh chữ U", dimensionMm: "phi ngoài 8 mm, phi trong 5 mm, cao 260 mm", dimension3d: "0.050 x 0.260 x 0.008 m", role: "Ống chứa chất lỏng chỉ thị" },
      { part: "Thang đo đối xứng", dimensionMm: "-100 mm .. 0 .. +100 mm", dimension3d: "0.200 m", role: "Đọc trực tiếp chênh lệch mức nước" },
      { part: "Ống dây tiô mềm dẫn khí", dimensionMm: "phi ngoài 6 mm, phi trong 4 mm, dài 600 mm", dimension3d: "phi 0.006 x 0.600 m", role: "Nối kín khí từ nhánh áp kế tới hộp cảm ứng" },
      { part: "Hộp cảm ứng màng cao su", dimensionMm: "phi 35 x 12 mm", dimension3d: "phi 0.035 x 0.012 m", role: "Dìm vào bể nước để tiếp nhận áp lực" }
    ],
    proportionsTable: [
      { ratioName: "Chiều cao bảng / Chiều rộng bảng", formula: "H / W", value: "320 mm / 80 mm = 4.0", significance: "Dáng đứng thon gọn, dễ quan sát thang dọc" },
      { ratioName: "Khoảng cách 2 nhánh / Bán kính uốn", formula: "D_{nhánh} / R", value: "30 mm / 15 mm = 2.0", significance: "Góc uốn trơn láng tránh bọt khí ứ đọng" }
    ],
    toleranceTable: [
      { connection: "Khớp cắm ống tiô vào đầu thủy tinh", nominalSize: "5.0 mm", tolerance: "-0.5 mm (ống cao su ôm mút)", fitType: "Kín khí hoàn toàn không rò rỉ" }
    ],
    snapPoints: [
      { name: "BaseRest", position: "(0, 0, 0)", type: "surface_rest", direction: "+Y", compatibleWith: "LabTable.Surface" },
      { name: "PressureInletTip", position: "(-0.015, 0.250, 0)", type: "air_nozzle", direction: "+Y", compatibleWith: "FlexibleHose.End" }
    ],
    dof: "Giá bảng đo cố định tĩnh (0 DOF). Hộp cảm ứng cầm tay tự do 6 DOF.",
    userActions: "1. Đặt áp kế lên bàn.\n2. Cầm hộp cảm ứng nhúng vào bình chứa nước ở các độ sâu $5\\text{ cm}, 10\\text{ cm}, 15\\text{ cm}$.\n3. Xoay mặt màng cảm ứng hướng lên, hướng xuống, nằm ngang để so sánh $\\Delta h$.",
    hitboxes: "Bảng đo: OBB 0.080 x 0.320 x 0.040 m; Hộp cảm ứng: Bounding Sphere phi 0.040 m.",
    states: [
      { variable: "sensorDepthMm", type: "number", range: "[0, 200]", defaultVal: "0.0", description: "Độ sâu dìm hộp cảm ứng (mm)" },
      { variable: "sensorOrientationDeg", type: "number", range: "[0, 360]", defaultVal: "0.0", description: "Góc quay của mặt màng cảm ứng" },
      { variable: "deltaHMm", type: "number", range: "[-100, 100]", defaultVal: "0.0", description: "Độ chênh 2 mực chất lỏng chỉ thị (mm)" }
    ],
    solverLogic: "Khi hộp cảm ứng ở độ sâu $h$: $p = \\rho g h$. Áp suất này truyền đẳng hướng qua không khí trong ống mềm đến nhánh trái áp kế. $\\Delta h = \\frac{p}{\\rho_{\\text{chỉ thị}} g}$. Mực nước nhánh trái hạ $\\Delta h / 2$, mực nước nhánh phải dâng $\\Delta h / 2$.",
    visualFeedback: "Chất lỏng màu đỏ cánh sen dâng lên hạ xuống mượt mà; hiển thị thước đo số phóng đại khi rê chuột lại gần.",
    audioFeedback: "Tiếng màng cao su đàn hồi căng nhẹ; tiếng bọt nước.",
    operatingLimits: "Áp suất đo tối đa: $2000\\text{ Pa}$ (tương ứng $\\Delta h = 200\\text{ mm}$ cột nước). Tránh để chất lỏng tràn ra khỏi ống.",
    failureModes: [
      { errorAction: "Ống nối tiô bị tuột hoặc thủng hở khí", physicalConsequence: "Mất áp suất truyền, hai nhánh luôn cân bằng ở vạch 0", pedagogicalWarning: "Kiểm tra độ kín khí của hệ thống trước khi đo." }
    ],
    sceneGraphHierarchy: `Manometer_Root (Group)
  ├── Mesh_Backboard (Bảng gỗ/nhựa in vạch chia laser)
  ├── Mesh_GlassUTube (Ống chữ U thủy tinh rỗng)
  ├── Mesh_FluidColumn (Cột chất lỏng chữ U có shader animated level)
  ├── Mesh_MetalClamps[0..3] (Các ngàm kẹp giữ ống)
  └── Group_SensorHose (Dây tiô mềm spline và hộp cảm ứng)`,
    pivotPlacement: "Tọa độ đáy bảng (0, 0, 0) tiếp xúc bàn.",
    materialsTable: [
      { meshPart: "Bảng đo", materialType: "MeshStandardMaterial", pbrParams: "color: #f8fafc, roughness: 0.5, metalness: 0.1", visualAppearance: "Nhựa ABS trắng in số đen chính xác" },
      { meshPart: "Ống chữ U", materialType: "MeshPhysicalMaterial", pbrParams: "transmission: 0.96, roughness: 0.04, ior: 1.52", visualAppearance: "Thủy tinh trong suốt" },
      { meshPart: "Dung dịch chỉ thị", materialType: "MeshStandardMaterial", pbrParams: "color: #e11d48, roughness: 0.2", visualAppearance: "Dung dịch màu đỏ hồng cánh sen rực rỡ" }
    ]
  },

  // 06: Bình thông nhau 3 nhánh dị hình
  {
    stt: "06",
    id: "communicating-vessels-3branch",
    catalogId: "OL3D-EQP-HYD-0003",
    bgdCode: "TB-KHTN8-CO-06",
    nameVi: "Bình thông nhau 3 nhánh dị hình",
    nameEn: "Communicating Vessels 3-Shape Branch",
    discipline: "Vật lý - Áp suất chất lỏng",
    lesson: "Bài: Bình thông nhau (SGK KHTN 8)",
    scientificFeatures: "Minh chứng định luật cơ bản của bình thông nhau: Với cùng một chất lỏng đứng yên, mặt thoáng ở các nhánh có hình dạng và kích thước hoàn toàn khác nhau luôn luôn dừng lại ở cùng một độ cao nằm ngang.",
    principles: "Áp suất tại đáy mỗi nhánh là $p = p_0 + \\rho \\cdot g \\cdot h$. Vì đáy các nhánh thông với nhau và chất lỏng đứng yên, áp suất tại đáy phải bằng nhau: $p_1 = p_2 = p_3 \\implies h_1 = h_2 = h_3$.",
    formulas: `Điều kiện cân bằng tĩnh học:
$$p_A = p_B = p_C \\iff p_0 + d \\cdot h_1 = p_0 + d \\cdot h_2 = p_0 + d \\cdot h_3 \\implies h_1 = h_2 = h_3$$
Khi nghiêng toàn bộ bình một góc $\\alpha$ so với phương ngang:
Mặt thoáng chất lỏng ở cả 3 nhánh tự xoay để duy trì véctơ pháp tuyến mặt thoáng luôn song song với trọng lực:
$$\\vec{n}_{\\text{mặt thoáng}} = (0, 1, 0) \\quad \\forall \\alpha$$`,
    dimensionsTable: [
      { part: "Kích thước bao ngoài", dimensionMm: "160 x 50 x 180 mm", dimension3d: "0.160 x 0.050 x 0.180 m", role: "Khung bình thông nhau" },
      { part: "Ống đáy nằm ngang", dimensionMm: "phi ngoài 14 mm, dài 150 mm", dimension3d: "phi 0.014 x 0.150 m", role: "Ống dẫn thông 3 nhánh" },
      { part: "Nhánh 1 (Hình trụ thẳng)", dimensionMm: "phi 12 x 160 mm", dimension3d: "phi 0.012 x 0.160 m", role: "Nhánh đối chứng hình học chuẩn" },
      { part: "Nhánh 2 (Uốn lượn sóng sin)", dimensionMm: "phi 10 mm, biên độ sóng 15 mm, 2 chu kỳ", dimension3d: "phi 0.010 x 0.160 m", role: "Minh chứng hình dạng uốn éo không ảnh hưởng" },
      { part: "Nhánh 3 (Phình quả trám)", dimensionMm: "Đoạn phình phi 30 mm, cổ thắt phi 12 mm", dimension3d: "phi 0.030 x 0.160 m", role: "Minh chứng tiết diện phình to không ảnh hưởng" }
    ],
    proportionsTable: [
      { ratioName: "Khoảng cách giữa các nhánh", formula: "D_{nhánh}", value: "45 mm (đối xứng qua tâm)", significance: "Bố cục cân đối, góc nhìn không bị che khuất" },
      { ratioName: "Đường kính nhánh phình / nhánh thẳng", formula: "\\varnothing_3 / \\varnothing_1", value: "30 mm / 12 mm = 2.5", significance: "Độ chênh lệch tiết diện 6.25 lần làm nổi bật tính chất khoa học" }
    ],
    toleranceTable: [
      { connection: "Mối hàn thủy tinh ngã ba đáy", nominalSize: "phi 14 mm", tolerance: "+/- 0.2 mm", fitType: "Liền khối thổi thủ công, không thắt hẹp dòng" }
    ],
    snapPoints: [
      { name: "TableStandRest", position: "(0, 0, 0)", type: "surface_rest", direction: "+Y", compatibleWith: "LabTable.Surface" },
      { name: "BranchTopInlet[1..3]", position: "(x_i, 0.170, 0)", type: "fluid_inlet", direction: "-Y", compatibleWith: "beaker-250.Spout" }
    ],
    dof: "Đặt trên bàn hoặc cầm tay nhấc lên nghiêng góc $\\pm 30^\\circ$ quanh trục Z.",
    userActions: "1. Rót nước có màu vào bất kỳ 1 trong 3 nhánh.\n2. Quan sát cả 3 cột nước đồng thời dâng lên cùng mặt phẳng nằm ngang.\n3. Nhấc nghiêng bình để xem mặt thoáng tự cân bằng.",
    hitboxes: "Hộp OBB bao quanh toàn bộ khung bình 0.165 x 0.185 x 0.055 m.",
    states: [
      { variable: "totalWaterVolumeMl", type: "number", range: "[0, 150]", defaultVal: "0.0", description: "Tổng thể tích nước đã rót vào (ml)" },
      { variable: "surfaceHeightMm", type: "number", range: "[0, 140]", defaultVal: "0.0", description: "Chiều cao mực nước tính từ đáy ống (mm)" },
      { variable: "tiltAngleDeg", type: "number", range: "[-30, 30]", defaultVal: "0.0", description: "Góc nghiêng của bình (độ)" }
    ],
    solverLogic: "Thể tích rót $V$ được phân bổ tích phân theo tiết diện $S_i(y)$ của 3 nhánh: $$V = \\int_0^H (S_1(y) + S_2(y) + S_3(y) + S_{\\text{đáy}}) dy$$. Tìm nghiệm $H$ bằng phương pháp Newton-Raphson, gán mặt thoáng đồng mức $H$ cho cả 3 nhánh.",
    visualFeedback: "Mặt nước phẳng lặng phản chiếu ánh sáng môi trường; các tia bọt khí nhỏ nổi lên khi đang rót.",
    audioFeedback: "Tiếng nước chảy vào bình thủy tinh róc rách trong trẻo.",
    operatingLimits: "Dung tích tối đa: $150\\text{ mL}$ (nước dâng cách miệng $20\\text{ mm}$ tránh tràn).",
    failureModes: [
      { errorAction: "Rót quá 160ml nước vào bình", physicalConsequence: "Nước tràn qua miệng nhánh 1 và nhánh 2 ra mặt bàn", pedagogicalWarning: "Dừng rót khi mực nước cách miệng ống 2cm." }
    ],
    sceneGraphHierarchy: `CommunicatingVessels_Root (Group)
  ├── Mesh_BasePlinth (Đế nhựa đỡ khung ống)
  ├── Mesh_GlassManifold (Khối thủy tinh 3 nhánh liền khối)
  └── Mesh_LiquidVolume (Khối chất lỏng có shader mặt cắt ngang theo thế năng)`,
    pivotPlacement: "Tọa độ đáy đế đỡ giữa bình (0, 0, 0).",
    materialsTable: [
      { meshPart: "Thủy tinh bình", materialType: "MeshPhysicalMaterial", pbrParams: "transmission: 0.97, roughness: 0.03, ior: 1.52", visualAppearance: "Thủy tinh phòng thí nghiệm cao cấp" },
      { meshPart: "Dung dịch nước màu", materialType: "MeshPhysicalMaterial", pbrParams: "transmission: 0.88, color: #0284c7, roughness: 0.05, ior: 1.333", visualAppearance: "Nước pha màu xanh coban tương phản cao" }
    ]
  },

  // 07: Bộ khối lập phương đo khối lượng riêng Đồng, Sắt, Nhôm
  {
    stt: "07",
    id: "density-metal-cubes",
    catalogId: "OL3D-EQP-MEC-0002",
    bgdCode: "TB-KHTN8-CO-07",
    nameVi: "Bộ khối lập phương đo khối lượng riêng (Đồng, Sắt, Nhôm)",
    nameEn: "Density Metal Cubes Set (Cu, Fe, Al)",
    discipline: "Vật lý - Khối lượng riêng & Lực đẩy Archimedes",
    lesson: "Bài: Khối lượng riêng & Trọng lượng riêng (SGK KHTN 8)",
    scientificFeatures: "Thực hành đo khối lượng bằng cân điện tử, đo thể tích bằng phương pháp dìm nước bình chia độ, từ đó tính toán và so sánh khối lượng riêng của các kim loại cơ bản trong tự nhiên.",
    principles: "Các chất khác nhau có mật độ nguyên tử và cấu trúc mạng tinh thể khác nhau, dẫn tới khối lượng riêng $D = \\frac{m}{V}$ khác nhau. Mặc dù có kích thước hình học hoàn toàn giống hệt nhau ($V = 8\\text{ cm}^3$), khối lượng của khối đồng lớn hơn sắt, và sắt lớn hơn nhiều so với nhôm.",
    formulas: `Công thức định nghĩa:
$$D = \\frac{m}{V} \\quad (\\text{kg/m}^3 \\text{ hoặc } \\text{g/cm}^3), \\quad d = 10 \\cdot D \\quad (\\text{N/m}^3)$$
Thể tích chuẩn của mỗi khối lập phương cạnh $a = 2.0\\text{ cm}$:
$$V = a^3 = 2.0^3 = 8.0\\text{ cm}^3 = 8.0 \\times 10^{-6}\\text{ m}^3$$
Bảng giá trị lý thuyết chuẩn:
• Khối Đồng ($Cu$): $D_{Cu} = 8900\\text{ kg/m}^3 \\implies m_{Cu} = 8900 \\times 8.0 \\times 10^{-6} = 0.0712\\text{ kg} = 71.2\\text{ g}$
• Khối Sắt ($Fe$): $D_{Fe} = 7800\\text{ kg/m}^3 \\implies m_{Fe} = 7800 \\times 8.0 \\times 10^{-6} = 0.0624\\text{ kg} = 62.4\\text{ g}$
• Khối Nhôm ($Al$): $D_{Al} = 2700\\text{ kg/m}^3 \\implies m_{Al} = 2700 \\times 8.0 \\times 10^{-6} = 0.0216\\text{ kg} = 21.6\\text{ g}$`,
    dimensionsTable: [
      { part: "Khối lập phương", dimensionMm: "20.0 x 20.0 x 20.0 mm", dimension3d: "0.020 x 0.020 x 0.020 m", role: "Vật thể chuẩn thể tích 8.0 cm3" },
      { part: "Móc treo khoen nhỏ đỉnh", dimensionMm: "phi 1.2 mm, vươn cao 3.5 mm", dimension3d: "0.0035 m", role: "Buộc chỉ treo vào lực kế hoặc nhúng nước" },
      { part: "Vát mép bảo vệ", dimensionMm: "C0.5 mm", dimension3d: "0.0005 m", role: "Tránh cấn tay học sinh khi cầm" }
    ],
    proportionsTable: [
      { ratioName: "Tỷ lệ các cạnh", formula: "x : y : z", value: "1 : 1 : 1 (20 x 20 x 20 mm)", significance: "Khối lập phương hoàn hảo, tính thể tích tức thì" },
      { ratioName: "Tỷ lệ khối lượng Cu : Fe : Al", formula: "m_{Cu} : m_{Fe} : m_{Al}", value: "71.2 : 62.4 : 21.6 = 3.30 : 2.89 : 1.00", significance: "Trực quan hóa sự khác biệt mật độ vật chất" }
    ],
    toleranceTable: [
      { connection: "Kích thước cạnh gia công CNC", nominalSize: "20.00 mm", tolerance: "+/- 0.05 mm", fitType: "Sai số thể tích < 0.7%" }
    ],
    snapPoints: [
      { name: "TopRingHook", position: "(0, 0.0135, 0)", type: "string_tie", direction: "+Y", compatibleWith: "spring-dynamometer.Hook" },
      { name: "BottomRest", position: "(0, -0.010, 0)", type: "surface_rest", direction: "-Y", compatibleWith: "electronic-balance.Pan, LabTable.Surface" }
    ],
    dof: "6 DOF tự do khi cầm nắm thả rơi vật lý.",
    userActions: "1. Đặt từng khối lên đĩa cân điện tử để đọc khối lượng $m$.\n2. Thả chìm vào ống đong chứa $50\\text{ mL}$ nước để quan sát nước dâng lên đúng $58\\text{ mL}$.\n3. Treo vào lực kế để đo trọng lượng và lực đẩy Archimedes.",
    hitboxes: "Hộp OBB kích thước 0.020 x 0.024 x 0.020 m.",
    states: [
      { variable: "selectedMaterial", type: "enum", range: "'Cu' | 'Fe' | 'Al'", defaultVal: "'Cu'", description: "Loại kim loại của khối" },
      { variable: "massGram", type: "number", range: "21.6 .. 71.2", defaultVal: "71.2", description: "Khối lượng thực tính toán (g)" },
      { variable: "isWeighed", type: "boolean", range: "true / false", defaultVal: "false", description: "Đang nằm trên đĩa cân" }
    ],
    solverLogic: "Khi đặt lên cân điện tử, kích hoạt sự kiện `onWeightDetected(massGram)`. Khi nhúng vào ống đong, tăng mực nước $\\Delta V = +8\\text{ mL}$.",
    visualFeedback: "Khắc laser chữ chìm sắc nét `Cu`, `Fe`, `Al` trên mặt đỉnh. Ánh kim loại PBR phản chiếu chân thực.",
    audioFeedback: "Âm va chạm 'cách' kim loại đanh chắc khi đặt lên đĩa cân inox.",
    operatingLimits: "Nhiệt độ tối đa: $400^\\circ\\text{C}$.",
    failureModes: [
      { errorAction: "Thả rơi mạnh khối đồng 71g từ độ cao vào đáy ống đong thủy tinh", physicalConsequence: "Làm nứt vỡ đáy ống đong thủy tinh", pedagogicalWarning: "Phải nghiêng ống đong và cho vật trượt nhẹ nhàng xuống đáy." }
    ],
    sceneGraphHierarchy: `DensityCube_Root (Group)
  ├── Mesh_CubeBody (Khối lập phương vát mép, khắc chữ laser)
  └── Mesh_SuspensionLoop (Khoen móc dây trên đỉnh)`,
    pivotPlacement: "Tâm khối (0, 0, 0).",
    materialsTable: [
      { meshPart: "Khối Đồng (Cu)", materialType: "MeshStandardMaterial", pbrParams: "color: #c26a3e, metalness: 0.95, roughness: 0.2", visualAppearance: "Ánh kim đỏ cam đặc trưng của đồng nguyên chất" },
      { meshPart: "Khối Sắt (Fe)", materialType: "MeshStandardMaterial", pbrParams: "color: #71717a, metalness: 0.88, roughness: 0.35", visualAppearance: "Xám thép công nghiệp mờ" },
      { meshPart: "Khối Nhôm (Al)", materialType: "MeshStandardMaterial", pbrParams: "color: #e2e8f0, metalness: 0.9, roughness: 0.25", visualAppearance: "Trắng bạc sáng nhẹ" }
    ]
  },

  // 08: Hộp pin nguồn thí nghiệm 3V - 6V
  {
    stt: "08",
    id: "battery-holder-pack",
    catalogId: "OL3D-EQP-ELE-0001",
    bgdCode: "TB-KHTN8-DI-01",
    nameVi: "Hộp pin nguồn thí nghiệm 3V - 6V",
    nameEn: "Modular Battery Holder Pack with Terminals",
    discipline: "Vật lý - Điện học một chiều DC",
    lesson: "Bài: Mạch điện đơn giản, Cường độ dòng điện, Hiệu điện thế (SGK KHTN 8)",
    scientificFeatures: "Cung cấp nguồn điện một chiều hạ áp an toàn ($1.5\\text{ V}, 3\\text{ V}, 4.5\\text{ V}, 6\\text{ V}$), tích hợp cầu chì/công tắc bảo vệ ngắn mạch và 2 cọc cắm bắp chuối tiêu chuẩn phòng học bộ môn.",
    principles: "Mỗi viên pin hóa học sinh ra suất điện động $\\mathcal{E}_0 = 1.5\\text{ V}$ và điện trở trong $r_0 \\approx 0.15\\,\\Omega$. Khi mắc nối tiếp $n$ pin, suất điện động của bộ nguồn bằng tổng các suất điện động: $\\mathcal{E}_b = n \\cdot \\mathcal{E}_0$, và điện trở trong $r_b = n \\cdot r_0$.",
    formulas: `Định luật Ohm cho toàn mạch:
$$I = \\frac{\\mathcal{E}_b}{R_{\\text{ngoài}} + r_b}$$
Hiệu điện thế giữa hai cực của nguồn điện khi cấp tải:
$$U = \\mathcal{E}_b - I \\cdot r_b$$
Khi hở mạch ($I = 0$): $U = \\mathcal{E}_b$.
Khi ngắn mạch ($R_{\\text{ngoài}} \\approx 0$):
$$I_{\\text{ngắn mạch}} = \\frac{\\mathcal{E}_b}{r_b} = \\frac{6.0}{4 \\times 0.15} = 10\\text{ A} \\implies \\text{Cầu chì nhiệt ngắt mạch bảo vệ!}$$`,
    dimensionsTable: [
      { part: "Vỏ hộp nhựa ABS", dimensionMm: "120 x 75 x 32 mm", dimension3d: "0.120 x 0.075 x 0.032 m", role: "Bảo vệ pin và cách điện an toàn" },
      { part: "Cọc cắm bắp chuối Đỏ (+)", dimensionMm: "phi 4 mm, cao 16 mm, cách cọc âm 50 mm", dimension3d: "phi 0.008 x 0.016 m", role: "Đấu nối cực dương nguồn điện" },
      { part: "Cọc cắm bắp chuối Đen (-)", dimensionMm: "phi 4 mm, cao 16 mm", dimension3d: "phi 0.008 x 0.016 m", role: "Đấu nối cực âm nguồn điện" },
      { part: "Công tắc gạt số nấc pin", dimensionMm: "30 x 10 x 8 mm", dimension3d: "0.030 x 0.010 x 0.008 m", role: "Lựa chọn 2 pin (3V) hoặc 4 pin (6V)" }
    ],
    proportionsTable: [
      { ratioName: "Khoảng cách giữa 2 cọc / Chiều rộng hộp", formula: "D_{\\text{cọc}} / W", value: "50 mm / 75 mm = 66.7%", significance: "Đủ rộng để cắm 2 jack bắp chuối mà không chạm chập" },
      { ratioName: "Chiều cao cọc / Chiều cao hộp", formula: "H_{\\text{cọc}} / H_{\\text{hộp}}", value: "16 mm / 32 mm = 50%", significance: "Dễ cầm ngón tay cắm và rút dây" }
    ],
    toleranceTable: [
      { connection: "Lỗ cắm bắp chuối", nominalSize: "4.0 mm", tolerance: "+0.1 mm / -0.0 mm", fitType: "Khớp tiêu chuẩn phích cắm chuối 4mm phòng Lab" }
    ],
    snapPoints: [
      { name: "PositiveTerminal", position: "(0.025, 0.032, 0.015)", type: "electrical_terminal_dc_pos", direction: "+Y", compatibleWith: "ElectricalWire.BananaPlug" },
      { name: "NegativeTerminal", position: "(-0.025, 0.032, 0.015)", type: "electrical_terminal_dc_neg", direction: "+Y", compatibleWith: "ElectricalWire.BananaPlug" }
    ],
    dof: "Đặt trên bàn phòng thí nghiệm (0 DOF).",
    userActions: "1. Kéo đầu dây điện cắm vào cọc Đỏ (+) hoặc cọc Đen (-).\n2. Gạt công tắc chọn mức điện áp $3\\text{ V}$ hoặc $6\\text{ V}$.\n3. Bật/tắt công tắc cấp nguồn chính.",
    hitboxes: "Hộp OBB kích thước 0.125 x 0.050 x 0.080 m bao quanh vỏ và 2 cọc cắm.",
    states: [
      { variable: "isSwitchOn", type: "boolean", range: "true / false", defaultVal: "true", description: "Bật/tắt nguồn" },
      { variable: "selectedCells", type: "number", range: "2 | 4", defaultVal: "4", description: "Số viên pin đang chọn (2 viên = 3V, 4 viên = 6V)" },
      { variable: "outputVoltage", type: "number", range: "[0, 6.0]", defaultVal: "6.0", description: "Hiệu điện thế đo được giữa 2 cọc (V)" },
      { variable: "isShortCircuited", type: "boolean", range: "true / false", defaultVal: "false", description: "Trạng thái ngắn mạch nguy hiểm" }
    ],
    solverLogic: "Khi mạch ngoài kín: Kết nối với `ElectricalCircuitEngine` tính toán tổng trở $R_{\\text{ngoài}}$. Nếu $R_{\\text{ngoài}} < 0.5\\,\\Omega$, tự động ngắt rơle bảo vệ `isShortCircuited = true` và phát tín hiệu cảnh báo màu đỏ.",
    visualFeedback: "Đèn LED báo nguồn màu xanh lá cây sáng rực khi bật; nhấp nháy đỏ báo động khi bị chập mạch.",
    audioFeedback: "Tiếng 'tách' dứt khoát khi gạt công tắc; tiếng 'bíp' cảnh báo ngắn mạch.",
    operatingLimits: "Dòng xả liên tục an toàn tối đa: $I \\le 2.0\\text{ A}$.",
    failureModes: [
      { errorAction: "Nối trực tiếp 1 sợi dây đồng giữa cọc Đỏ và cọc Đen", physicalConsequence: "Đoản mạch, dòng tăng vọt làm pin nóng ran và tự ngắt rơle", pedagogicalWarning: "Tuyệt đối không nối tắt trực tiếp hai cực của nguồn điện!" }
    ],
    sceneGraphHierarchy: `BatteryPack_Root (Group)
  ├── Mesh_PlasticCasing (Vỏ hộp ABS)
  ├── Mesh_BatteryCell[0..3] (4 viên pin AA có nhãn cực)
  ├── Mesh_RedBindingPost (Cọc cắm cực dương màu đỏ)
  ├── Mesh_BlackBindingPost (Cọc cắm cực âm màu đen)
  ├── Mesh_SlideSwitch (Cần gạt chuyển mạch 3V/6V)
  └── Mesh_IndicatorLed (Đèn LED chỉ báo nguồn)`,
    pivotPlacement: "Tọa độ đáy hộp (0, 0, 0).",
    materialsTable: [
      { meshPart: "Vỏ nhựa ABS", materialType: "MeshStandardMaterial", pbrParams: "color: #27272a, roughness: 0.65, metalness: 0.1", visualAppearance: "Nhựa đen nhám đúc gờ chống va đập" },
      { meshPart: "Cọc Đỏ (+)", materialType: "MeshStandardMaterial", pbrParams: "color: #dc2626, roughness: 0.3, metalness: 0.5", visualAppearance: "Nhựa đỏ bọc lõi đồng" },
      { meshPart: "Cọc Đen (-)", materialType: "MeshStandardMaterial", pbrParams: "color: #18181b, roughness: 0.3, metalness: 0.5", visualAppearance: "Nhựa đen bọc lõi đồng" }
    ]
  },

  // 09: Khóa K / Công tắc dao gạt một cực một ngả
  {
    stt: "09",
    id: "spst-switch-knife",
    catalogId: "OL3D-EQP-ELE-0002",
    bgdCode: "TB-KHTN8-DI-02",
    nameVi: "Khóa K / Cầu dao gạt đơn cực một ngả",
    nameEn: "SPST Single-Pole Knife Switch",
    discipline: "Vật lý - Mạch điện DC",
    lesson: "Bài: Mạch điện đơn giản, Mắc nối tiếp & song song (SGK KHTN 8)",
    scientificFeatures: "Đóng ngắt mạch điện cơ học trực quan, cho phép học sinh quan sát rõ ràng trạng thái tiếp xúc kim loại và khoảng cách hở mạch phóng tia lửa khi cắt dòng.",
    principles: "Khi đóng, lưỡi đồng gập sâu vào ngàm đàn hồi tạo tiếp xúc bề mặt tốt với điện trở tiếp xúc $R_{\\text{tiếp xúc}} \\approx 0.01\\,\\Omega \\approx 0$. Khi mở, không khí giữa lưỡi và ngàm là chất cách điện hoàn hảo ($R = \\infty$), dòng điện trong mạch bị triệt tiêu hoàn toàn.",
    formulas: `Phương trình chuyển mạch:
$$R_{\\text{switch}}(\\theta) = \\begin{cases} 0.01\\,\\Omega & \\text{nếu } \\theta = 0^\\circ \\text{ (Đóng kín)} \\\\ \\infty & \\text{nếu } \\theta > 5^\\circ \\text{ (Hở mạch)} \\end{cases}$$
Định luật bảo toàn dòng điện tại nút mạch:
$$I_{\\text{vào}} = I_{\\text{ra}} = \\frac{U_{\\text{mạch}}}{R_{\\text{tải}} + R_{\\text{switch}}}$$`,
    dimensionsTable: [
      { part: "Đế phíp bakelite cách điện", dimensionMm: "75 x 35 x 10 mm", dimension3d: "0.075 x 0.035 x 0.010 m", role: "Chân đế cách điện vững chắc" },
      { part: "Lưỡi dao gạt đồng thau", dimensionMm: "55 x 8 x 1.5 mm", dimension3d: "0.055 x 0.008 x 0.0015 m", role: "Thanh dẫn đóng ngắt dòng điện" },
      { part: "Cán cầm bọc nhựa", dimensionMm: "phi 8 x 22 mm", dimension3d: "phi 0.008 x 0.022 m", role: "Tay cầm cách điện thao tác gạt an toàn" },
      { part: "Ngàm kẹp chữ U đàn hồi", dimensionMm: "10 x 8 x 12 mm", dimension3d: "0.010 x 0.008 x 0.012 m", role: "Kẹp chặt lưỡi dao khi đóng" }
    ],
    proportionsTable: [
      { ratioName: "Chiều dài lưỡi dao / Chiều dài đế", formula: "L_{\\text{dao}} / L_{\\text{đế}}", value: "55 mm / 75 mm = 73.3%", significance: "Bố cục cân xứng, hành trình gạt vừa vặn tầm tay" },
      { ratioName: "Khoảng cách 2 cọc / Chiều dài đế", formula: "D_{\\text{cọc}} / L_{\\text{đế}}", value: "52 mm / 75 mm = 69.3%", significance: "Đảm bảo khoảng cách an toàn chống đánh lửa" }
    ],
    toleranceTable: [
      { connection: "Ngàm kẹp đàn hồi - Lưỡi dao", nominalSize: "1.5 mm", tolerance: "-0.2 mm (ngàm ép căng)", fitType: "Tiếp xúc ma sát ép chặt" }
    ],
    snapPoints: [
      { name: "Terminal_A", position: "(-0.026, 0.010, 0)", type: "electrical_terminal_dc", direction: "+Y", compatibleWith: "ElectricalWire.BananaPlug" },
      { name: "Terminal_B", position: "(+0.026, 0.010, 0)", type: "electrical_terminal_dc", direction: "+Y", compatibleWith: "ElectricalWire.BananaPlug" }
    ],
    dof: "Lưỡi dao gạt có 1 DOF xoay quanh chốt bản lề: Góc xoay $\\theta \\in [0^\\circ, 65^\\circ]$.",
    userActions: "1. Nhấp click vào cán cầm để chuyển đổi nhanh giữa Đóng / Mở.\n2. Cắm dây điện vào 2 cọc cắm A và B.",
    hitboxes: "OBB đế: 0.075 x 0.020 x 0.035 m; OBB cán gạt: 0.020 x 0.050 x 0.020 m.",
    states: [
      { variable: "isClosed", type: "boolean", range: "true / false", defaultVal: "false", description: "Trạng thái đóng mạch hay mở mạch" },
      { variable: "bladeAngleDeg", type: "number", range: "[0, 65]", defaultVal: "45.0", description: "Góc mở của lưỡi dao (độ)" }
    ],
    solverLogic: "Khi `isClosed = true`, cập nhật ma trận dẫn nạp của mạch: $G_{AB} = 100\\,\\Omega^{-1}$. Khi `isClosed = false`, $G_{AB} = 0$.",
    visualFeedback: "Lưỡi dao hạ xuống ngàm kẹp khít; tia lửa điện siêu nhỏ xuất hiện thoáng qua nếu ngắt mạch khi đang có tải cảm kháng.",
    audioFeedback: "Âm thanh tanh tách 'tách' sắc bén của lưỡi đồng ngậm vào ngàm đàn hồi.",
    operatingLimits: "Dòng điện định mức: $I \\le 3.0\\text{ A}$; Điện áp tối đa: $U \\le 36\\text{ V}$ (hạ áp giáo dục).",
    failureModes: [
      { errorAction: "Gạt đóng công tắc khi mạch chưa kiểm tra ngắn mạch", physicalConsequence: "Tia lửa điện lớn và làm hỏng nguồn pin", pedagogicalWarning: "Luôn kiểm tra sơ đồ dây trước khi đóng khóa K." }
    ],
    sceneGraphHierarchy: `KnifeSwitch_Root (Group)
  ├── Mesh_BakeliteBase (Đế phíp cam nâu)
  ├── Mesh_BindingPosts[0..1] (2 cọc bắt dây đồng thau)
  ├── Mesh_SpringContactU (Ngàm đàn hồi)
  └── Group_KnifeLever (Cụm lưỡi dao xoay quanh chốt)
        ├── Mesh_CopperBlade (Lưỡi dao đồng thau)
        └── Mesh_InsulatedHandle (Cán cầm nhựa đen)`,
    pivotPlacement: "Tọa độ đáy đế (0, 0, 0). Trục quay của `Group_KnifeLever` đặt tại tâm chốt bản lề.",
    materialsTable: [
      { meshPart: "Đế phíp Bakelite", materialType: "MeshStandardMaterial", pbrParams: "color: #451a03, roughness: 0.5, metalness: 0.05", visualAppearance: "Nhựa bakelite cổ điển màu cam nâu đánh bóng" },
      { meshPart: "Lưỡi và ngàm đồng", materialType: "MeshStandardMaterial", pbrParams: "color: #eab308, roughness: 0.25, metalness: 0.9", visualAppearance: "Đồng thau vàng bóng" }
    ]
  },

  // 10: Đui đèn & Bóng đèn pin 2.5V - 3.8V
  {
    stt: "10",
    id: "miniature-bulb-socket",
    catalogId: "OL3D-EQP-ELE-0003",
    bgdCode: "TB-KHTN8-DI-03",
    nameVi: "Đui đèn & Bóng đèn pin thí nghiệm 2.5V - 3.8V",
    nameEn: "Miniature Light Bulb with Screw Base Socket",
    discipline: "Vật lý - Mạch điện & Tác dụng nhiệt, phát sáng",
    lesson: "Bài: Mạch điện đơn giản, Tác dụng phát sáng và tác dụng nhiệt của dòng điện (SGK KHTN 8)",
    scientificFeatures: "Thiết bị tiêu thụ điện trực quan nhất giúp học sinh nhận biết dòng điện trong mạch kín, khảo sát độ sáng của đèn theo hiệu điện thế và công suất tiêu thụ.",
    principles: "Dòng điện chạy qua dây tóc Vonfram có điện trở gây nhiệt lượng theo định luật Joule-Lenz, nung nóng dây tóc lên tới trên $2000^\\circ\\text{C}$ phát ra quang phổ nhìn thấy được. Độ chói phát sáng tỉ lệ phi tuyến với công suất điện tiêu thụ.",
    formulas: `Định luật Joule-Lenz và công suất điện:
$$P = U \\cdot I = I^2 \\cdot R = \\frac{U^2}{R}$$
Điện trở dây tóc Vonfram thay đổi mạnh theo nhiệt độ:
$$R(T) = R_0 [1 + \\alpha(T - T_0)]$$
($R_{\\text{nóng}} \\approx 8 - 10 \\times R_{\\text{nguội}}$).
Độ rọi phát sáng trực quan (Luminous Flux):
$$\\Phi \\propto (U / U_{\\text{định mức}})^{3.5}$$
(Khi $U$ tăng nhẹ, độ sáng tăng rất mạnh; khi $U > 1.35 \\times U_{\\text{đm}}$, dây tóc đứt cháy tức thì).`,
    dimensionsTable: [
      { part: "Đế tròn đui đèn", dimensionMm: "phi 60 x 16 mm", dimension3d: "phi 0.060 x 0.016 m", role: "Đế nhựa giữ ren đui vững trên bàn" },
      { part: "Đui xoáy E10 đồng thau", dimensionMm: "phi 10 x 14 mm", dimension3d: "phi 0.010 x 0.014 m", role: "Ngàm ren vặn bóng đèn" },
      { part: "Bóng đèn thủy tinh E10", dimensionMm: "phi 11 x 24 mm", dimension3d: "phi 0.011 x 0.024 m", role: "Bóng thủy tinh chứa dây tóc Vonfram trong chân không" },
      { part: "2 cọc cắm bắp chuối", dimensionMm: "phi 4 mm, cách nhau 38 mm", dimension3d: "phi 0.008 x 0.014 m", role: "Điểm cắm dây nối" }
    ],
    proportionsTable: [
      { ratioName: "Đường kính đế / Chiều cao tổng thể", formula: "\\varnothing_{\\text{đế}} / H_{\\text{tổng}}", value: "60 mm / 45 mm = 1.33", significance: "Đế bè rộng chống lật đổ khi cắm dây điện nặng" }
    ],
    toleranceTable: [
      { connection: "Ren xoáy bóng đèn E10", nominalSize: "E10 (DIN 40400)", tolerance: "Tiêu chuẩn quốc tế", fitType: "Ren xoáy ốc trơn tru" }
    ],
    snapPoints: [
      { name: "Terminal_1", position: "(-0.019, 0.016, 0)", type: "electrical_terminal_dc", direction: "+Y", compatibleWith: "ElectricalWire.BananaPlug" },
      { name: "Terminal_2", position: "(+0.019, 0.016, 0)", type: "electrical_terminal_dc", direction: "+Y", compatibleWith: "ElectricalWire.BananaPlug" }
    ],
    dof: "Bóng đèn có thể vặn xoay tháo rời khỏi đui ren (1 DOF xoay).",
    userActions: "1. Cắm 2 dây dẫn vào 2 cọc cắm.\n2. Vặn tháo/lắp bóng đèn kiểm tra hiện tượng hở mạch.\n3. Điều chỉnh điện áp nguồn để quan sát độ sáng tăng giảm.",
    hitboxes: "Hình trụ tròn phi 0.062 x 0.050 m.",
    states: [
      { variable: "isBulbInstalled", type: "boolean", range: "true / false", defaultVal: "true", description: "Bóng đã được vặn chặt vào đui hay chưa" },
      { variable: "isFilamentBroken", type: "boolean", range: "true / false", defaultVal: "false", description: "Trạng thái dây tóc bị cháy đứt do quá áp" },
      { variable: "voltageAcrossBulb", type: "number", range: "[0, 10.0]", defaultVal: "0.0", description: "Hiệu điện thế hai đầu bóng (V)" },
      { variable: "glowIntensity", type: "number", range: "[0, 1.0]", defaultVal: "0.0", description: "Cường độ phát sáng chuẩn hóa" }
    ],
    solverLogic: "Khi $U \\le 3.8\\text{ V}$: Tính $I = U / R_{\\text{đèn}}$, `glowIntensity` $= (U / 3.8)^{2.5}$. Nếu $U > 5.0\\text{ V}$ trong $> 0.5\\text{ s}$: Đứt dây tóc `isFilamentBroken = true`, `glowIntensity = 0`, mạch hở.",
    visualFeedback: "• Dây tóc Vonfram ửng đỏ rồi chuyển sang vàng sáng rực rỡ.\n• Nguồn sáng điểm `PointLight` phát quầng sáng ấm lan tỏa mặt bàn phòng thí nghiệm.",
    audioFeedback: "Tiếng 'tách' vỡ sợi tóc rất nhỏ khi bóng bị cháy do quá áp.",
    operatingLimits: "Điện áp định mức: $U_{\\text{đm}} = 2.5\\text{ V} - 3.8\\text{ V}$; Dòng định mức: $0.3\\text{ A}$.",
    failureModes: [
      { errorAction: "Cấp thẳng nguồn 6V vào bóng 2.5V mà không qua biến trở", physicalConsequence: "Dây tóc Vonfram lóe sáng cực đại rồi đứt cháy lập tức", pedagogicalWarning: "Luôn kiểm tra hiệu điện thế định mức ghi trên bóng trước khi cấp điện." }
    ],
    sceneGraphHierarchy: `BulbSocket_Root (Group)
  ├── Mesh_CircularBase (Đế nhựa đúc có 2 cọc bắt dây)
  ├── Mesh_BrassSocketE10 (Đui ren đồng E10)
  ├── Group_RemovableBulb (Bóng đèn tháo lắp)
  │     ├── Mesh_BulbGlass (Bóng thủy tinh quả lê)
  │     ├── Mesh_Filament (Dây tóc lò xo Vonfram có emissive material)
  │     └── PointLight_Glow (Nguồn sáng điểm 3D tỏa quang học)`,
    pivotPlacement: "Tọa độ đáy đế tròn (0, 0, 0).",
    materialsTable: [
      { meshPart: "Vỏ bóng thủy tinh", materialType: "MeshPhysicalMaterial", pbrParams: "transmission: 0.98, roughness: 0.02, ior: 1.5", visualAppearance: "Thủy tinh trong vắt" },
      { meshPart: "Dây tóc lò xo", materialType: "MeshStandardMaterial", pbrParams: "color: #ffedd5, emissive: #ea580c, roughness: 0.4", visualAppearance: "Kim loại phát quang vàng cam rực rỡ" }
    ]
  },

  // 11: Ampe kế một chiều DC mặt nghiêng 2 thang đo
  {
    stt: "11",
    id: "dc-analog-ammeter",
    catalogId: "OL3D-EQP-ELE-0004",
    bgdCode: "TB-KHTN8-DI-04",
    nameVi: "Ampe kế một chiều DC mặt nghiêng 2 thang đo",
    nameEn: "Dual-Scale DC Analog Ammeter 0.6A / 3A",
    discipline: "Vật lý - Đo lường điện học",
    lesson: "Bài: Đo cường độ dòng điện & Định luật Ohm (SGK KHTN 8)",
    scientificFeatures: "Đo cường độ dòng điện một chiều trong mạch mắc nối tiếp với độ chính xác cao, cung cấp 2 thang đo linh hoạt ($0.6\\text{ A}$ và $3\\text{ A}$) phù hợp với mọi bài thực hành THCS.",
    principles: "Cơ cấu đo từ điện: Khung dây dẫn tròn đặt trong từ trường đều của nam châm vĩnh cửu. Khi có dòng điện $I$ chạy qua, lực từ tạo mômen quay làm lệch khung dây chống lại lò xo xoắn cản. Góc lệch của kim tỉ lệ bậc nhất với cường độ dòng điện: $\\alpha = k \\cdot I$.",
    formulas: `Phương trình cân bằng mômen cơ cấu từ điện:
$$M_{\\text{từ}} = M_{\\text{cản}} \\iff B \\cdot I \\cdot S \\cdot N = C_{\\text{xoắn}} \\cdot \\alpha \\implies \\alpha = \\left( \\frac{B \\cdot S \\cdot N}{C_{\\text{xoắn}}} \\right) \\cdot I = S_I \\cdot I$$
Độ nhạy góc quay: Thang $0.6\\text{ A}$ quay tối đa $90^\\circ$ khi $I = 0.6\\text{ A}$ (mỗi vạch $0.02\\text{ A} = 3^\\circ$); Thang $3\\text{ A}$ quay $90^\\circ$ khi $I = 3\\text{ A}$ (mỗi vạch $0.1\\text{ A} = 3^\\circ$).
Điện trở trong của ampe kế:
$$R_A(0.6\\text{ A}) \\approx 0.5\\,\\Omega, \\quad R_A(3\\text{ A}) \\approx 0.1\\,\\Omega$$`,
    dimensionsTable: [
      { part: "Vỏ hộp mặt nghiêng", dimensionMm: "100 x 135 x 100 mm", dimension3d: "0.100 x 0.135 x 0.100 m", role: "Vỏ bảo vệ công thái học góc nhìn 45 độ" },
      { part: "Mặt kính hiển thị quạt tròn", dimensionMm: "Bán kính cung 65 mm, góc mở 90 độ", dimension3d: "0.090 x 0.070 m", role: "Bảo vệ kim và in 2 thang đo" },
      { part: "Kim chỉ thị nhôm đỏ", dimensionMm: "Dài 62 mm, bản rộng 0.8 mm", dimension3d: "0.062 m", role: "Chỉ thị giá trị đo chính xác" },
      { part: "3 cọc cắm bắp chuối mạ đồng", dimensionMm: "Cọc âm Đen (-), cọc dương Đỏ (+0.6A, +3A)", dimension3d: "phi 0.009 x 0.018 m", role: "Đấu nối mạch điện" },
      { part: "Núm xoay chỉnh zero cơ", dimensionMm: "phi 12 x 5 mm", dimension3d: "phi 0.012 x 0.005 m", role: "Chỉnh kim về đúng vạch số 0 ban đầu" }
    ],
    proportionsTable: [
      { ratioName: "Góc nghiêng mặt đồng hồ", formula: "\\alpha_{\\text{nghiêng}}", value: "45 độ", significance: "Góc nhìn tối ưu cho học sinh ngồi trên bàn thí nghiệm" },
      { ratioName: "Tỷ lệ thang đo lớn / thang nhỏ", formula: "Thang 3A / Thang 0.6A", value: "3.0 / 0.6 = 5.0", significance: "Nhân hệ số 5 thuận tiện tính toán số liệu" }
    ],
    toleranceTable: [
      { connection: "Cấp chính xác đo lường cơ học", nominalSize: "Cấp 2.5", tolerance: "+/- 2.5% toàn thang", fitType: "Tiêu chuẩn TCVN thiết bị giáo dục" }
    ],
    snapPoints: [
      { name: "Terminal_CommonNeg", position: "(-0.030, 0.025, 0.055)", type: "electrical_terminal_ammeter_neg", direction: "+Z", compatibleWith: "ElectricalWire.BananaPlug" },
      { name: "Terminal_Pos06A", position: "(0.000, 0.025, 0.055)", type: "electrical_terminal_ammeter_pos_06", direction: "+Z", compatibleWith: "ElectricalWire.BananaPlug" },
      { name: "Terminal_Pos3A", position: "(+0.030, 0.025, 0.055)", type: "electrical_terminal_ammeter_pos_3", direction: "+Z", compatibleWith: "ElectricalWire.BananaPlug" }
    ],
    dof: "Kim chỉ thị có 1 DOF xoay quanh trục tâm: Góc quay $\\theta \\in [0^\\circ, 95^\\circ]$.",
    userActions: "1. Vặn núm xoay chỉnh zero để đưa kim về đúng số 0.\n2. Cắm dây vào cọc (-) và chọn cọc (+0.6A) hoặc (+3A).\n3. Đọc số chỉ kim trên vạch chia tương ứng.",
    hitboxes: "Khối OBB dốc mặt nghiêng 0.100 x 0.135 x 0.105 m.",
    states: [
      { variable: "selectedRange", type: "enum", range: "'0.6A' | '3A' | 'unconnected'", defaultVal: "'unconnected'", description: "Thang đo đang cắm dây" },
      { variable: "currentMeasuredA", type: "number", range: "[-0.5, 5.0]", defaultVal: "0.0", description: "Dòng điện thực tế chạy qua (A)" },
      { variable: "needleAngleDeg", type: "number", range: "[-5, 95]", defaultVal: "0.0", description: "Góc quay thực tế của kim chỉ thị" },
      { variable: "isPeggedOverload", type: "boolean", range: "true / false", defaultVal: "false", description: "Kim kịch biên quá tải" }
    ],
    solverLogic: "Xác định cực đấu dây: Nếu cắm ngược cực (dòng âm), kim quay giật ngược về bên trái vạch 0 (kịch chốt chặn âm $-5^\\circ$). Nếu cắm đúng cực: Tính góc quay $\\theta = (I / I_{\\text{thang}}) \\times 90^\\circ$ với hiệu ứng dao động giảm chấn nhị thức (Underdamped Spring Simulation).",
    visualFeedback: "Kim màu đỏ chuyển động mượt mà có quán tính và rung nhẹ trước khi dừng ở vị trí cân bằng.",
    audioFeedback: "Tiếng 'cạch' nhẹ khi kim chỉ thị va vào chốt hãm kịch kim bên phải.",
    operatingLimits: "Dòng điện tối đa không phá hủy: $1.2 \\times I_{\\text{thang}}$. Quá $5\\text{ A}$ cháy cuộn dây khung quay.",
    failureModes: [
      { errorAction: "Mắc ampe kế song song trực tiếp với nguồn pin 6V", physicalConsequence: "Đoản mạch nguồn, dòng qua ampe kế vọt lên > 10A làm cháy cuộn dây khung quay", pedagogicalWarning: "Tuyệt đối không mắc ampe kế song song vào nguồn điện!" },
      { errorAction: "Cắm nhầm cực (+ vào cọc Đen, - vào cọc Đỏ)", physicalConsequence: "Kim đập mạnh về phía trái gây cong vênh kim chỉ thị", pedagogicalWarning: "Chú ý nối cọc dương ampe kế về phía cực dương của nguồn." }
    ],
    sceneGraphHierarchy: `Ammeter_Root (Group)
  ├── Mesh_HousingWedge (Vỏ hộp mặt nghiêng dốc)
  ├── Mesh_FacePlate (Mặt đĩa in 2 thang số laser và chữ 'A')
  ├── Group_NeedleAssembly (Cụm kim chỉ thị quay)
  │     ├── Mesh_PointerNeedle (Kim nhôm sơn đỏ)
  │     └── Mesh_CounterBalance (Đối trọng kim)
  ├── Mesh_FrontTerminals[0..2] (3 cọc cắm bắp chuối có ren vặn)
  └── Mesh_ZeroAdjustScrew (Núm xoay vít chỉnh zero)`,
    pivotPlacement: "Tọa độ đáy vỏ hộp (0, 0, 0).",
    materialsTable: [
      { meshPart: "Vỏ hộp", materialType: "MeshStandardMaterial", pbrParams: "color: #f1f5f9, roughness: 0.4, metalness: 0.1", visualAppearance: "Nhựa ABS màu xám sữa bền bỉ" },
      { meshPart: "Mặt kính cong", materialType: "MeshPhysicalMaterial", pbrParams: "transmission: 0.95, roughness: 0.05, ior: 1.49", visualAppearance: "Mica quang học chống phản xạ lóa" },
      { meshPart: "Kim chỉ thị", materialType: "MeshStandardMaterial", pbrParams: "color: #dc2626, roughness: 0.3", visualAppearance: "Sơn đỏ nổi bật trên nền thang trắng" }
    ]
  },

  // 12: Vôn kế một chiều DC mặt nghiêng 2 thang đo
  {
    stt: "12",
    id: "dc-analog-voltmeter",
    catalogId: "OL3D-EQP-ELE-0005",
    bgdCode: "TB-KHTN8-DI-05",
    nameVi: "Vôn kế một chiều DC mặt nghiêng 2 thang đo",
    nameEn: "Dual-Scale DC Analog Voltmeter 3V / 15V",
    discipline: "Vật lý - Đo lường điện học",
    lesson: "Bài: Đo hiệu điện thế & Định luật Ohm (SGK KHTN 8)",
    scientificFeatures: "Đo hiệu điện thế một chiều giữa hai điểm mạch mắc song song với điện trở trong cực lớn, 2 thang đo tiện ích ($3\\text{ V}$ và $15\\text{ V}$) đảm bảo độ chính xác cho toàn bộ các thí nghiệm pin và biến áp.",
    principles: "Cơ cấu từ điện tương tự ampe kế nhưng được mắc nối tiếp với điện trở phụ nội bộ rất lớn ($R_{\\text{phụ}} = 3000\\,\\Omega$ và $15000\\,\\Omega$). Dòng điện qua vôn kế rất bé ($I_V < 1\\text{ mA}$), không làm ảnh hưởng tới phân bố dòng điện và điện áp của toàn mạch.",
    formulas: `Điện trở trong của vôn kế:
$$R_V(3\\text{ V}) = \\frac{U_{\\max}}{I_{\\text{khung}}} = \\frac{3.0}{10^{-3}} = 3000\\,\\Omega$$
$$R_V(15\\text{ V}) = \\frac{U_{\\max}}{I_{\\text{khung}}} = \\frac{15.0}{10^{-3}} = 15000\\,\\Omega$$
Dòng điện rẽ qua vôn kế khi đo điện áp $U$:
$$I_V = \\frac{U}{R_V} \\approx 0 \\implies I_{\\text{mạch chính}} \\approx I_{\\text{tải}}$$
Góc lệch kim tỉ lệ trực tiếp với hiệu điện thế: $\\alpha = S_U \\cdot U$.`,
    dimensionsTable: [
      { part: "Vỏ hộp mặt nghiêng", dimensionMm: "100 x 135 x 100 mm", dimension3d: "0.100 x 0.135 x 0.100 m", role: "Đồng bộ chuẩn thiết bị phòng thí nghiệm" },
      { part: "Mặt hiển thị quạt tròn", dimensionMm: "Bán kính cung 65 mm, in thang 0-3V và 0-15V", dimension3d: "0.090 x 0.070 m", role: "Chữ 'V' in đậm ở giữa mặt số" },
      { part: "3 cọc cắm bắp chuối", dimensionMm: "Cọc (-) Đen, cọc (+3V) Đỏ, cọc (+15V) Đỏ", dimension3d: "phi 0.009 x 0.018 m", role: "Đấu nối song song vào đoạn mạch" }
    ],
    proportionsTable: [
      { ratioName: "Tỷ lệ thang đo 15V / 3V", formula: "Thang 15V / Thang 3V", value: "15 / 3 = 5.0", significance: "Độ chia đồng dạng, đọc nhanh giá trị" }
    ],
    toleranceTable: [
      { connection: "Cấp chính xác đo lường cơ học", nominalSize: "Cấp 2.5", tolerance: "+/- 2.5% toàn thang", fitType: "Tiêu chuẩn giáo dục THCS" }
    ],
    snapPoints: [
      { name: "Terminal_CommonNeg", position: "(-0.030, 0.025, 0.055)", type: "electrical_terminal_voltmeter_neg", direction: "+Z", compatibleWith: "ElectricalWire.BananaPlug" },
      { name: "Terminal_Pos3V", position: "(0.000, 0.025, 0.055)", type: "electrical_terminal_voltmeter_pos_3", direction: "+Z", compatibleWith: "ElectricalWire.BananaPlug" },
      { name: "Terminal_Pos15V", position: "(+0.030, 0.025, 0.055)", type: "electrical_terminal_voltmeter_pos_15", direction: "+Z", compatibleWith: "ElectricalWire.BananaPlug" }
    ],
    dof: "Kim chỉ thị có 1 DOF xoay quanh trục tâm: Góc quay $\\theta \\in [0^\\circ, 95^\\circ]$.",
    userActions: "1. Vặn chỉnh zero kim đồng hồ.\n2. Mắc song song 2 dây từ 2 cọc đo vào 2 đầu đoạn mạch cần khảo sát.\n3. Đọc chỉ số vôn kế.",
    hitboxes: "Khối OBB dốc mặt nghiêng 0.100 x 0.135 x 0.105 m.",
    states: [
      { variable: "selectedRange", type: "enum", range: "'3V' | '15V' | 'unconnected'", defaultVal: "'unconnected'", description: "Thang đo đang sử dụng" },
      { variable: "voltageMeasuredV", type: "number", range: "[-2.0, 25.0]", defaultVal: "0.0", description: "Điện áp thực tế đang đo (V)" },
      { variable: "needleAngleDeg", type: "number", range: "[-5, 95]", defaultVal: "0.0", description: "Góc quay của kim chỉ thị" }
    ],
    solverLogic: "Xử lý tương tự ampe kế nhưng dựa trên ma trận thế nút (Nodal Analysis): $U = V_A - V_B$. Hiển thị kim quay với phản ứng động học giảm chấn lò xo.",
    visualFeedback: "Kim chuyển động êm ái; chữ 'V' màu xanh đen sắc nét.",
    audioFeedback: "Tiếng va kim nhẹ khi kịch thang.",
    operatingLimits: "Điện áp tối đa chịu đựng: Thang 3V chịu tối đa $6\\text{ V}$; Thang 15V chịu tối đa $30\\text{ V}$.",
    failureModes: [
      { errorAction: "Cắm nguồn 12V vào thang đo 3V", physicalConsequence: "Kim đập kịch biên cực mạnh làm kẹt hoặc cong kim chỉ thị", pedagogicalWarning: "Khi chưa biết rõ độ lớn điện áp, luôn bắt đầu đo ở thang lớn (15V) trước." }
    ],
    sceneGraphHierarchy: `Voltmeter_Root (Group)
  ├── Mesh_HousingWedge (Vỏ hộp mặt nghiêng)
  ├── Mesh_FacePlate (Mặt số in 2 thang 0-3V và 0-15V, ký hiệu 'V')
  ├── Group_NeedleAssembly (Cụm kim chỉ thị)
  └── Mesh_FrontTerminals[0..2] (3 cọc cắm bắp chuối)`,
    pivotPlacement: "Tọa độ đáy vỏ hộp (0, 0, 0).",
    materialsTable: [
      { meshPart: "Vỏ hộp", materialType: "MeshStandardMaterial", pbrParams: "color: #f1f5f9, roughness: 0.4, metalness: 0.1", visualAppearance: "Nhựa ABS đồng bộ phòng Lab" },
      { meshPart: "Kim vôn kế", materialType: "MeshStandardMaterial", pbrParams: "color: #dc2626, roughness: 0.3", visualAppearance: "Kim nhôm sơn đỏ siêu nhẹ" }
    ]
  },

  // 13: Biến trở con chạy dây quấn ống sứ 20 ohm - 2A
  {
    stt: "13",
    id: "slide-rheostat-20ohm",
    catalogId: "OL3D-EQP-ELE-0006",
    bgdCode: "TB-KHTN8-DI-06",
    nameVi: "Biến trở con chạy dây quấn ống sứ 20 ohm - 2A",
    nameEn: "Slide Wire Rheostat 20 Ohm 2A",
    discipline: "Vật lý - Điện trở & Biến trở",
    lesson: "Bài: Điện trở, Biến trở, Điều chỉnh cường độ dòng điện (SGK KHTN 8)",
    scientificFeatures: "Thay đổi điện trở tham gia vào mạch liên tục và mượt mà bằng cơ chế con chạy tiếp xúc trượt, dùng làm điện trở điều chỉnh dòng điện tải hoặc làm bộ phân áp (chiết áp).",
    principles: "Điện trở của một đoạn dây kim loại tỉ lệ thuận với chiều dài $l$ và tỉ lệ nghịch với tiết diện $S$: $R = \\rho \\cdot \\frac{l}{S}$. Khi trượt con chạy $C$, ta thay đổi chiều dài phần dây có dòng điện chạy qua từ đầu cắm cố định tới tiếp điểm trượt, qua đó làm thay đổi giá trị điện trở $R_{AC}$.",
    formulas: `Công thức biến trở con chạy tuyến tính:
$$R(x) = R_{\\max} \\cdot \\frac{x}{L_{\\text{hành trình}}} = 20.0 \\cdot \\frac{x}{0.100} \\quad (\\Omega)$$
với $x \\in [0, 0.100\\text{ m}]$ là vị trí của con chạy dọc theo thanh dẫn hướng.
Công suất tỏa nhiệt trên biến trở:
$$P = I^2 \\cdot R(x) \\le P_{\\max} = I_{\\max}^2 \\cdot R_{\\max} = 2.0^2 \\times 20.0 = 80\\text{ W}$$
Khi sử dụng làm bộ phân áp (cấp nguồn vào 2 đầu A, B và lấy điện áp ra ở A, C):
$$U_{\\text{ra}}(x) = U_{\\text{vào}} \\cdot \\frac{x}{L_{\\text{hành trình}}}$$`,
    dimensionsTable: [
      { part: "Khung chân đỡ chữ L (2 đầu)", dimensionMm: "Dài 165 x Rộng 45 x Cao 65 mm", dimension3d: "0.165 x 0.045 x 0.065 m", role: "Khung thép chịu lực đỡ ống sứ" },
      { part: "Ống trụ gốm sứ cách điện", dimensionMm: "phi 32 x Dài 120 mm", dimension3d: "phi 0.032 x 0.120 m", role: "Trụ chịu nhiệt quấn dây điện trở" },
      { part: "Dây quấn hợp kim Constantan", dimensionMm: "Dây phi 0.6 mm, quấn 180 vòng sít nhau", dimension3d: "phi 0.033 x 0.110 m", role: "Điện trở tổng 20 Ohm" },
      { part: "Thanh trượt kim loại mạ Crom", dimensionMm: "phi 8 x 145 mm", dimension3d: "phi 0.008 x 0.145 m", role: "Thanh dẫn điện cho con chạy" },
      { part: "Con chạy tiếp xúc trượt", dimensionMm: "25 x 28 x 35 mm", dimension3d: "0.025 x 0.028 x 0.035 m", role: "Mang lá đồng tiếp xúc quệt trên dây" },
      { part: "3 cọc cắm bắp chuối", dimensionMm: "Chốt A, chốt B (cố định), chốt C (con chạy)", dimension3d: "phi 0.008 x 0.016 m", role: "Đấu nối 3 chốt linh hoạt" }
    ],
    proportionsTable: [
      { ratioName: "Chiều dài quấn dây / Chiều dài khung", formula: "L_{\\text{dây}} / L_{\\text{khung}}", value: "110 mm / 165 mm = 66.7%", significance: "Đảm bảo hành trình biến thiên rộng rãi" },
      { ratioName: "Đường kính ống sứ / Chiều cao khung", formula: "\\varnothing_{\\text{sứ}} / H", value: "32 mm / 65 mm = 49.2%", significance: "Ống sứ to tản nhiệt tốt khi chịu dòng 2A" }
    ],
    toleranceTable: [
      { connection: "Lá đồng con chạy quẹt trên dây", nominalSize: "Độ nén 1.5 mm", tolerance: "+/- 0.3 mm", fitType: "Áp lực tiếp xúc đàn hồi liên tục" }
    ],
    snapPoints: [
      { name: "Terminal_A", position: "(-0.065, 0.045, 0.015)", type: "electrical_terminal_rheostat_fixed", direction: "+Y", compatibleWith: "ElectricalWire.BananaPlug" },
      { name: "Terminal_B", position: "(+0.065, 0.045, 0.015)", type: "electrical_terminal_rheostat_fixed", direction: "+Y", compatibleWith: "ElectricalWire.BananaPlug" },
      { name: "Terminal_C", position: "(0.065, 0.060, -0.015)", type: "electrical_terminal_rheostat_slider", direction: "+Y", compatibleWith: "ElectricalWire.BananaPlug" }
    ],
    dof: "Con chạy có 1 DOF tịnh tiến dọc trục X: Vị trí $x \\in [-0.050\\text{ m}, +0.050\\text{ m}]$ (hành trình $100\\text{ mm}$).",
    userActions: "1. Nhấp kéo con chạy trượt dọc thanh kim loại từ trái sang phải.\n2. Cắm dây vào chốt A và chốt C (mắc làm biến trở nối tiếp).\n3. Cắm cả 3 chốt A, B, C (mắc làm bộ chiết áp).",
    hitboxes: "OBB tổng thể: 0.170 x 0.070 x 0.050 m; OBB con chạy: 0.030 x 0.040 x 0.035 m.",
    states: [
      { variable: "sliderNormalizedPos", type: "number", range: "[0.0, 1.0]", defaultVal: "0.5", description: "Vị trí con chạy chuẩn hóa (0 = đầu A, 1 = đầu B)" },
      { variable: "resistanceACOhm", type: "number", range: "[0.1, 20.0]", defaultVal: "10.0", description: "Điện trở giữa cực A và con chạy C" },
      { variable: "currentAmps", type: "number", range: "[0.0, 3.0]", defaultVal: "0.0", description: "Dòng điện đang chạy qua biến trở" }
    ],
    solverLogic: "$$R_{AC} = \\max(0.1, 20.0 \\times \\text{sliderNormalizedPos}), \\quad R_{CB} = \\max(0.1, 20.0 \\times (1.0 - \\text{sliderNormalizedPos}))$$. Cập nhật ngay lập tức vào ma trận nút mạch của `ElectricalCircuitEngine` khi con chạy di chuyển.",
    visualFeedback: "• Lá tiếp điểm bằng đồng thau trượt sáng bóng trên rãnh dây kim loại cạo sạch men cách điện.\n• Hiển thị số đo điện trở tức thời bên cạnh con chạy (Dynamic HUD).",
    audioFeedback: "Âm thanh xào xạc kim loại 'xoẹt... xoẹt' chân thực của lá đồng cọ xát trên các vòng dây quấn.",
    operatingLimits: "Cường độ dòng điện cực đại cho phép: $I_{\\max} = 2.0\\text{ A}$.",
    failureModes: [
      { errorAction: "Kéo con chạy về vị trí 0 ohm khi đang nối thẳng với nguồn 6V", physicalConsequence: "Dòng điện tăng vọt > 5A làm dây quấn quá nhiệt bốc khói hoặc cháy đứt", pedagogicalWarning: "Quy tắc an toàn: Trước khi đóng điện, luôn gạt con chạy về vị trí có điện trở lớn nhất!" }
    ],
    sceneGraphHierarchy: `SlideRheostat_Root (Group)
  ├── Mesh_MetalEndFrames[0..1] (2 giá đỡ chữ L bằng thép dập)
  ├── Mesh_CeramicTube (Ống sứ trắng chịu nhiệt)
  ├── Mesh_WireCoil (Cuộn dây Constantan có bump map vân rãnh tròn)
  ├── Mesh_GuideRail (Thanh kim loại tròn dẫn hướng)
  ├── Group_Slider (Khối con chạy trượt theo trục X)
  │     ├── Mesh_PlasticKnob (Núm cầm tay nhựa đỏ)
  │     ├── Mesh_CopperSpringWiper (Lá quẹt đồng đàn hồi)
  │     └── Mesh_SliderCollet (Vòng trượt ôm thanh ray)
  └── Mesh_Terminals[0..2] (3 cọc cắm bắp chuối A, B, C)`,
    pivotPlacement: "Tọa độ đáy chân giá đỡ (0, 0, 0).",
    materialsTable: [
      { meshPart: "Ống gốm sứ", materialType: "MeshStandardMaterial", pbrParams: "color: #e2e8f0, roughness: 0.8, metalness: 0.05", visualAppearance: "Gốm kỹ thuật trắng chịu nhiệt cao" },
      { meshPart: "Dây Constantan", materialType: "MeshStandardMaterial", pbrParams: "color: #94a3b8, roughness: 0.35, metalness: 0.8", visualAppearance: "Dây hợp kim kim loại phủ men xám ánh đồng" },
      { meshPart: "Con chạy", materialType: "MeshStandardMaterial", pbrParams: "color: #dc2626, roughness: 0.4, metalness: 0.2", visualAppearance: "Nhựa cách điện màu đỏ công nghiệp" }
    ]
  },

  // 14: Cuộn dây nam châm điện có lõi sắt non rút rời
  {
    stt: "14",
    id: "electromagnet-coil",
    catalogId: "OL3D-EQP-MAG-0001",
    bgdCode: "TB-KHTN8-DI-07",
    nameVi: "Cuộn dây nam châm điện có lõi sắt non rút rời",
    nameEn: "Electromagnet Coil with Removable Soft Iron Core",
    discipline: "Vật lý - Từ học & Nam châm điện",
    lesson: "Bài: Tác dụng từ của dòng điện, Nam châm điện (SGK KHTN 8)",
    scientificFeatures: "Khảo sát từ trường sinh ra bởi dòng điện chạy trong ống dây, chứng minh vai trò khuếch đại từ tính mạnh mẽ của lõi sắt non, khảo sát cực từ theo quy tắc nắm tay phải.",
    principles: "Dòng điện chạy trong ống dây hình trụ dài tạo từ trường trong lòng ống dây. Lõi sắt non đặt trong ống dây bị từ hóa mạnh mẽ nhờ độ từ thẩm $\\mu_r \\gg 1$, làm tăng cảm ứng từ lên gấp hàng trăm đến hàng nghìn lần so với lõi không khí. Khi ngắt dòng điện, lõi sắt non mất từ tính gần như hoàn toàn (khác với thép giữ từ tính vĩnh cửu).",
    formulas: `Cảm ứng từ trong lòng ống dây không có lõi sắt (lõi không khí):
$$B_0 = \\mu_0 \\cdot n \\cdot I = \\mu_0 \\cdot \\frac{N}{L} \\cdot I$$
Cảm ứng từ khi lồng lõi sắt non (độ từ thẩm tương đối $\\mu_r$):
$$B = \\mu_r \\cdot B_0 = \\mu_r \\cdot \\mu_0 \\cdot \\frac{N}{L} \\cdot I \\quad (\\mu_r \\approx 500 - 2000)$$
Lực hút tác dụng lên một mạt sắt/đinh sắt ở khoảng cách $r$:
$$F_{\\text{hút}} \\propto B \\cdot \\frac{dB}{dr} \\propto I^2$$
Quy tắc nắm tay phải xác định chiều đường sức từ: Khum 4 ngón tay theo chiều dòng điện qua các vòng dây, ngón cái choãi ra chỉ chiều cực Bắc ($N$) của nam châm điện.`,
    dimensionsTable: [
      { part: "Ống cuộn dây nhựa", dimensionMm: "phi ngoài 32 mm, phi trong 9 mm, dài 60 mm", dimension3d: "phi 0.032 x 0.060 m", role: "Ống chỉ chứa 300 vòng dây đồng cách điện" },
      { part: "Lõi sắt non hình trụ", dimensionMm: "phi 8.0 x dài 85 mm, có núm tiện đầu phi 12 x 10 mm", dimension3d: "phi 0.008 x 0.085 m", role: "Lõi sắt non từ hóa rút rời tự do" },
      { part: "2 cọc cắm bắp chuối", dimensionMm: "phi 4 mm gắn trên vành đĩa cuộn dây", dimension3d: "phi 0.008 x 0.016 m", role: "Đấu nối nguồn điện DC" }
    ],
    proportionsTable: [
      { ratioName: "Chiều dài lõi sắt / Chiều dài cuộn dây", formula: "L_{\\text{lõi}} / L_{\\text{cuộn}}", value: "85 mm / 60 mm = 1.417", significance: "Lõi thò ra 25mm tạo cực từ tập trung hút vật thể" },
      { ratioName: "Khe hở đường kính lõi và lòng ống", formula: "\\varnothing_{\\text{trong}} - \\varnothing_{\\text{lõi}}", value: "9.0 mm - 8.0 mm = 1.0 mm", significance: "Đút lọt nhẹ nhàng không ma sát kẹt dính" }
    ],
    toleranceTable: [
      { connection: "Lõi sắt non cắm vào ống", nominalSize: "8.0 mm", tolerance: "-0.1 mm / -0.2 mm", fitType: "Lắp lỏng tự do (Slide fit)" }
    ],
    snapPoints: [
      { name: "Terminal_1", position: "(-0.012, 0.020, 0.025)", type: "electrical_terminal_dc", direction: "+Y", compatibleWith: "ElectricalWire.BananaPlug" },
      { name: "Terminal_2", position: "(+0.012, 0.020, 0.025)", type: "electrical_terminal_dc", direction: "+Y", compatibleWith: "ElectricalWire.BananaPlug" },
      { name: "IronCoreSlideSlot", position: "(0, 0, 0)", type: "magnetic_core_slot", direction: "Dọc trục X", compatibleWith: "SoftIronCore.Shaft" }
    ],
    dof: "Lõi sắt non có 1 DOF tịnh tiến rút ra cắm vào lòng ống dây dọc trục X.",
    userActions: "1. Kéo rút thanh lõi sắt non ra hoặc đút vào trong cuộn dây.\n2. Cắm dây cấp điện và bật công tắc nguồn.\n3. Đưa đinh sắt hoặc kim nam châm lại gần hai đầu để quan sát từ trường.",
    hitboxes: "Ống cuộn: Capsule phi 0.035 x 0.065 m; Lõi sắt: Trụ tròn phi 0.014 x 0.090 m.",
    states: [
      { variable: "isCoreInserted", type: "boolean", range: "true / false", defaultVal: "true", description: "Lõi sắt non đang nằm trong cuộn dây" },
      { variable: "currentAmps", type: "number", range: "[0, 2.5]", defaultVal: "0.0", description: "Dòng điện chạy qua cuộn dây" },
      { variable: "magneticFieldTesla", type: "number", range: "[0, 0.25]", defaultVal: "0.0", description: "Độ lớn cảm ứng từ tại đầu cực (Tesla)" },
      { variable: "attractedPinsCount", type: "number", range: "[0, 20]", defaultVal: "0", description: "Số lượng đinh sắt hút dính được" }
    ],
    solverLogic: "Khi $I > 0$: Tính $B = \\mu_r \\cdot \\mu_0 \\cdot (N/L) \\cdot I$. Nếu `isCoreInserted = false`, $\\mu_r = 1.0$ (chỉ hút được 1-2 mạt sắt nhẹ). Khi có lõi sắt: $\\mu_r = 800$, hút được chùm đinh sắt lớn $15-20$ cái. Ngắt dòng điện ($I = 0$): $B \\approx 0$, đinh sắt rơi rụng lập tức.",
    visualFeedback: "• Đường sức từ 3D dạng vector cong khép kín hiển thị khi bật chế độ Visualize Magnetic Field.\n• Chùm đinh sắt tự động bay hút dính vào đầu lõi sắt.",
    audioFeedback: "Tiếng 'cạch... cạch' khi các đinh sắt bị hút dính vào đầu cực kim loại; tiếng rò rè điện từ tần số thấp nếu dòng lớn.",
    operatingLimits: "Dòng điện định mức: $1.5\\text{ A}$; Dòng tối đa tức thời: $2.5\\text{ A}$ (cuộn dây ấm lên nhanh chóng).",
    failureModes: [
      { errorAction: "Cấp dòng 3A liên tục không ngắt trong thời gian dài", physicalConsequence: "Cuộn dây nóng trên 80 độ C làm chảy ống chỉ nhựa", pedagogicalWarning: "Chỉ bật nam châm điện trong lúc thực hiện thao tác quan sát rồi ngắt ngay." }
    ],
    sceneGraphHierarchy: `Electromagnet_Root (Group)
  ├── Mesh_Bobbin (Ống chỉ nhựa cách điện có 2 vành giữ)
  ├── Mesh_CopperCoil (Cuộn dây đồng tráng men vecni cánh gián)
  ├── Mesh_Terminals[0..1] (2 cọc bắp chuối mạ đồng)
  └── Group_SoftIronCore (Thanh lõi sắt non rút trượt)
        ├── Mesh_IronRod (Thanh trụ sắt non mạ bóng)
        └── Mesh_GripKnob (Núm cầm tiện rãnh)`,
    pivotPlacement: "Tọa độ tâm đối xứng cuộn dây (0, 0, 0).",
    materialsTable: [
      { meshPart: "Dây đồng tráng men", materialType: "MeshStandardMaterial", pbrParams: "color: #b45309, roughness: 0.3, metalness: 0.8", visualAppearance: "Đồng ánh kim tráng vecni bóng" },
      { meshPart: "Lõi sắt non", materialType: "MeshStandardMaterial", pbrParams: "color: #475569, roughness: 0.25, metalness: 0.92", visualAppearance: "Thép silic từ tính mài nhẵn" }
    ]
  },

  // 15: Giá để ống nghiệm 6 lỗ kèm cọc phơi
  {
    stt: "15",
    id: "test-tube-rack",
    catalogId: "OL3D-EQP-CHE-0001",
    bgdCode: "TB-KHTN8-HOA-01",
    nameVi: "Giá để ống nghiệm 6 lỗ kèm cọc phơi",
    nameEn: "Wooden / Plastic Test Tube Rack with Pins",
    discipline: "Hóa học - Dụng cụ thí nghiệm cơ bản",
    lesson: "Toàn bộ các bài thực hành Hóa học 8 (SGK KHTN 8)",
    scientificFeatures: "Giữ các ống nghiệm đứng thẳng ổn định trong quá trình nhỏ thuốc thử, quan sát phản ứng đổi màu, kết tủa hoặc sủi bọt khí; hàng cọc phơi phía sau dùng để úp ngược ống nghiệm róc khô nước sau khi cọ rửa.",
    principles: "Kết cấu 2 tầng lỗ định vị đồng trục theo phương thẳng đứng giữ cho trọng tâm của ống nghiệm chứa chất lỏng luôn nằm trong phạm vi đế giá đỡ, triệt tiêu nguy cơ đổ vỡ hóa chất ăn mòn ra mặt bàn.",
    formulas: `Khoảng cách an toàn giữa các tâm lỗ để tránh va chạm thành ống:
$$S_{\\text{tâm}} = \\varnothing_{\\text{lỗ}} + d_{\\text{vách}} = 20.0 + 10.0 = 30.0\\text{ mm}$$
Góc nghiêng đổ vỡ tới hạn khi đặt 6 ống nghiệm đầy dung dịch:
$$\\tan\\theta_{\\text{crit}} = \\frac{W_{\\text{đế}} / 2}{H_{\\text{trọng tâm}}} = \\frac{65 / 2}{55} \\approx 0.59 \\implies \\theta_{\\text{crit}} \\approx 30.5^\\circ$$`,
    dimensionsTable: [
      { part: "Kích thước khung giá", dimensionMm: "Dài 210 x Rộng 65 x Cao 90 mm", dimension3d: "0.210 x 0.065 x 0.090 m", role: "Khung gỗ 2 tầng đỡ ống nghiệm" },
      { part: "6 lỗ cắm ống tầng trên", dimensionMm: "phi 20.0 mm, cách đều tâm 30 mm", dimension3d: "phi 0.020 m", role: "Cắm vừa ống nghiệm phi 16 - 18 mm" },
      { part: "6 lỗ đón đáy cầu tầng dưới", dimensionMm: "Rãnh khoét cầu lõm R = 10 mm", dimension3d: "R 0.010 m", role: "Định vị đáy cầu ống nghiệm không xê dịch" },
      { part: "6 cọc phơi ống phía sau", dimensionMm: "phi 8 x Cao 75 mm, tiện đầu côn", dimension3d: "phi 0.008 x 0.075 m", role: "Úp ngược ống nghiệm khô ráo" }
    ],
    proportionsTable: [
      { ratioName: "Chiều cao tầng trên / Tổng chiều cao", formula: "H_{\\text{tầng}} / H_{\\text{tổng}}", value: "65 mm / 90 mm = 72.2%", significance: "Điểm tựa ở 40% chiều cao ống nghiệm 160mm" },
      { ratioName: "Chiều dài cọc phơi / Chiều dài ống", formula: "H_{\\text{cọc}} / H_{\\text{ống}}", value: "75 mm / 160 mm = 46.8%", significance: "Đủ sâu để ống úp đứng vững không rơi" }
    ],
    toleranceTable: [
      { connection: "Lỗ cắm - Thân ống nghiệm", nominalSize: "phi 20.0 mm / phi 16.0 mm", tolerance: "+4.0 mm khe hở", fitType: "Lắp lỏng thao tác 1 tay nhanh" }
    ],
    snapPoints: [
      { name: "RackSlot_1..6", position: "(-0.075 + 0.030 * k, 0.065, -0.012)", type: "test_tube_slot_upright", direction: "-Y", compatibleWith: "test-tube-with-clamp.TubeBody" },
      { name: "DryingPin_1..6", position: "(-0.075 + 0.030 * k, 0.075, +0.015)", type: "test_tube_pin_inverted", direction: "+Y", compatibleWith: "test-tube-with-clamp.TubeMouth" }
    ],
    dof: "Đặt cố định trên bàn phòng thí nghiệm (0 DOF).",
    userActions: "1. Kéo ống nghiệm thả vào 1 trong 6 lỗ cắm đứng.\n2. Kéo ống nghiệm đã rửa úp ngược vào cọc phơi.\n3. Nhấc cả giá di chuyển trên bàn.",
    hitboxes: "Khối OBB bao ngoài: 0.215 x 0.095 x 0.070 m.",
    states: [
      { variable: "occupiedSlotsCount", type: "number", range: "0 .. 6", defaultVal: "0", description: "Số ống nghiệm đang cắm thẳng" },
      { variable: "occupiedPinsCount", type: "number", range: "0 .. 6", defaultVal: "0", description: "Số ống nghiệm đang úp phơi" }
    ],
    solverLogic: "Quản lý mảng `slots[6]` và `pins[6]`. Khi ống nghiệm được kéo thả vào gần vùng Snap ($d < 30\\text{ mm}$), tự động gắn kết và chuyển trạng thái ống thành cố định thẳng đứng.",
    visualFeedback: "Hiệu ứng vòng tròn snap sáng mờ tại lỗ cắm khi cầm ống nghiệm lại gần.",
    audioFeedback: "Tiếng gõ nhẹ của đáy thủy tinh chạm vào rãnh gỗ 'cọc'.",
    operatingLimits: "Tải trọng: 6 ống nghiệm chứa đầy nước (tổng $\\approx 300\\text{ g}$).",
    failureModes: [
      { errorAction: "Úp ống nghiệm đang còn đầy hóa chất vào cọc phơi", physicalConsequence: "Hóa chất chảy tràn xuống chân cọc làm bẩn giá và bàn", pedagogicalWarning: "Chỉ úp ống nghiệm sau khi đã đổ hóa chất và tráng rửa sạch." }
    ],
    sceneGraphHierarchy: `TestTubeRack_Root (Group)
  ├── Mesh_WoodBasePlate (Đế gỗ dưới có rãnh lõm)
  ├── Mesh_WoodTopPlate (Mặt gỗ trên có 6 lỗ khoét tròn)
  ├── Mesh_SideUprights[0..1] (2 cột hồi đỡ 2 đầu)
  └── Mesh_DryingPins[0..5] (6 cọc trụ tiện tròn phơi ống)`,
    pivotPlacement: "Tọa độ đáy giá gỗ (0, 0, 0).",
    materialsTable: [
      { meshPart: "Khung gỗ sồi", materialType: "MeshStandardMaterial", pbrParams: "color: #d97706, roughness: 0.65, metalness: 0.05", visualAppearance: "Gỗ tự nhiên phủ vecni chống thấm hóa chất nhẹ" }
    ]
  },

  // 16: Bộ ống nghiệm thủy tinh chịu nhiệt & Kẹp gỗ
  {
    stt: "16",
    id: "test-tube-with-clamp",
    catalogId: "OL3D-EQP-CHE-0002",
    bgdCode: "TB-KHTN8-HOA-02",
    nameVi: "Bộ ống nghiệm thủy tinh chịu nhiệt & Kẹp gỗ",
    nameEn: "Borosilicate Test Tube with Wooden Clamp",
    discipline: "Hóa học - Dụng cụ phản ứng nhiệt",
    lesson: "Bài: Phản ứng hóa học, Acid, Base, Muối, Đun nóng chất (SGK KHTN 8)",
    scientificFeatures: "Dụng cụ chứa lượng nhỏ hóa chất ($2 - 5\\text{ mL}$) để tiến hành phản ứng thử nghiệm, quan sát đổi màu và đun nóng trực tiếp trên ngọn lửa đèn cồn; kẹp gỗ bảo vệ an toàn cho tay khỏi nhiệt độ cao và hóa chất ăn mòn.",
    principles: "Thủy tinh Borosilicate 3.3 có hệ số giãn nở nhiệt cực thấp ($\\alpha = 3.3 \\times 10^{-6}\\text{ K}^{-1}$), chịu được sốc nhiệt đột ngột lên tới $160^\\circ\\text{C}$ mà không nứt vỡ. Kẹp gỗ truyền nhiệt rất kém, má kẹp có lót đệm nỉ giữ ống mềm mại không làm vỡ thân ống.",
    formulas: `Quy tắc hình học kẹp ống nghiệm an toàn:
$$y_{\\text{kẹp}} = \\frac{1}{3} L_{\\text{ống}} \\quad \\text{tính từ miệng ống xuống} = \\frac{160}{3} \\approx 53.3\\text{ mm}$$
Góc nghiêng chuẩn khi đun nóng chất lỏng trên ngọn lửa đèn cồn:
$$\\theta_{\\text{đun}} \\approx 45^\\circ$$
(Tăng diện tích mặt thoáng chất lỏng, ngăn hiện tượng sôi bùng bắn hóa chất ra ngoài; miệng ống hướng về phía không có người).
Thể tích chất lỏng chứa tối đa khi đun nóng:
$$V_{\\text{chất lỏng đun}} \\le \\frac{1}{3} V_{\\text{dung tích}} = \\frac{25\\text{ mL}}{3} \\approx 8.3\\text{ mL}$$`,
    dimensionsTable: [
      { part: "Ống nghiệm Borosilicate", dimensionMm: "phi 16 x Dài 160 mm, thành dày 1.2 mm", dimension3d: "phi 0.016 x 0.160 m", role: "Chứa hóa chất và chịu nhiệt trực tiếp" },
      { part: "Miệng loe vành ống", dimensionMm: "phi ngoài 19 mm, gờ tròn 1.5 mm", dimension3d: "phi 0.019 m", role: "Tăng cứng miệng và chống mẻ" },
      { part: "Kẹp gỗ gắp ống nghiệm", dimensionMm: "Dài 180 x Rộng 20 x Dày 15 mm", dimension3d: "0.180 x 0.020 x 0.015 m", role: "Tay cầm kẹp cách nhiệt an toàn" },
      { part: "Lò xo lá thép kẹp", dimensionMm: "Dày 0.8 mm x Rộng 12 mm", dimension3d: "0.012 m", role: "Tạo lực kẹp ép chặt thân ống" }
    ],
    proportionsTable: [
      { ratioName: "Chiều dài / Đường kính ống nghiệm", formula: "L / \\varnothing", value: "160 mm / 16 mm = 10.0", significance: "Tỷ lệ chuẩn thon dài, dễ gia nhiệt từng phần" },
      { ratioName: "Chiều dài kẹp / Chiều dài ống", formula: "L_{\\text{kẹp}} / L_{\\text{ống}}", value: "180 mm / 160 mm = 1.125", significance: "Khoảng cách cách ly an toàn từ bàn tay tới ngọn lửa" }
    ],
    toleranceTable: [
      { connection: "Má kẹp gỗ - Thân ống nghiệm", nominalSize: "phi 16.0 mm", tolerance: "Độ mở đàn hồi 14 - 22 mm", fitType: "Kẹp ma sát đàn hồi" }
    ],
    snapPoints: [
      { name: "MouthInlet", position: "(0, 0.080, 0)", type: "fluid_inlet", direction: "+Y", compatibleWith: "dropper-pipette.Tip, chemical-spatula.Tip" },
      { name: "ClampPosition", position: "(0, 0.027, 0)", type: "clamp_attachment", direction: "Ngang", compatibleWith: "WoodenClamp.Jaws" }
    ],
    dof: "Tự do 6 DOF khi cầm tay kẹp ống nghiệm.",
    userActions: "1. Nhỏ giọt hóa chất vào ống nghiệm bằng pipet.\n2. Kẹp ống nghiệm bằng kẹp gỗ.\n3. Hơ nóng đều quanh thân ống rồi tập trung đáy trên ngọn lửa đèn cồn ở góc $45^\\circ$.",
    hitboxes: "Capsule hình trụ phi 0.020 x 0.165 m.",
    states: [
      { variable: "liquidVolumeMl", type: "number", range: "[0, 25]", defaultVal: "3.0", description: "Thể tích dung dịch trong ống (ml)" },
      { variable: "liquidTemperatureC", type: "number", range: "[20, 100]", defaultVal: "25.0", description: "Nhiệt độ chất lỏng (độ C)" },
      { variable: "isClamped", type: "boolean", range: "true / false", defaultVal: "true", description: "Đang được kẹp bằng kẹp gỗ" },
      { variable: "isBoiling", type: "boolean", range: "true / false", defaultVal: "false", description: "Trạng thái sôi sùng sục" }
    ],
    solverLogic: "Khi đáy ống nằm trong vùng ngọn lửa đèn cồn: $$\\frac{dT}{dt} = \\frac{k \\cdot (T_{\\text{lửa}} - T)}{m c}$$. Khi $T \\ge 100^\\circ\\text{C}$: Kích hoạt hạt bọt khí sôi (Boiling Bubble Particles) và hơi nước bốc lên từ miệng ống.",
    visualFeedback: "Dung dịch sủi bọt cuồn cuộn; thành thủy tinh phía trên đọng màng sương hơi nước mờ ảo.",
    audioFeedback: "Tiếng sôi ùng ục 'lục bục' của chất lỏng khi đun nóng.",
    operatingLimits: "Nhiệt độ tối đa liên tục: $500^\\circ\\text{C}$. Không sốc nhiệt nóng lạnh đột ngột vượt quá $\\Delta T = 160^\\circ\\text{C}$.",
    failureModes: [
      { errorAction: "Đun ống nghiệm chứa chất lỏng nhưng hướng thẳng miệng vào người đối diện", physicalConsequence: "Dung dịch sôi bùng bắn trực diện gây bỏng hóa chất", pedagogicalWarning: "Quy tắc an toàn sống còn: Miệng ống nghiệm phải luôn hướng về phía không có người!" },
      { errorAction: "Đun nóng tập trung 1 điểm ở đáy khi chất lỏng còn lạnh mà không hơ đều", physicalConsequence: "Giãn nở nhiệt cục bộ gây nứt vỡ đáy ống nghiệm", pedagogicalWarning: "Phải hơ đều dọc đáy ống nghiệm trước khi đun tập trung." }
    ],
    sceneGraphHierarchy: `TestTubeAssembly_Root (Group)
  ├── Group_TestTube (Ống nghiệm thủy tinh)
  │     ├── Mesh_GlassBody (Thân thủy tinh borosilicate)
  │     └── Mesh_LiquidContents (Cột chất lỏng có shader meniscus)
  └── Group_WoodenClamp (Kẹp gỗ)
        ├── Mesh_UpperJaw (Thanh kẹp trên)
        ├── Mesh_LowerJaw (Thanh kẹp dưới)
        └── Mesh_SpringSteel (Lò xo thép đàn hồi)`,
    pivotPlacement: "Tọa độ tâm miệng ống nghiệm (0, 0, 0).",
    materialsTable: [
      { meshPart: "Thân thủy tinh", materialType: "MeshPhysicalMaterial", pbrParams: "transmission: 0.98, roughness: 0.02, ior: 1.51", visualAppearance: "Thủy tinh trong suốt bóng bẩy" },
      { meshPart: "Kẹp gỗ", materialType: "MeshStandardMaterial", pbrParams: "color: #b45309, roughness: 0.75, metalness: 0.05", visualAppearance: "Gỗ mộc sấy khô cách nhiệt" }
    ]
  },

  // 17: Ống hút nhỏ giọt (Pipet pasteur) kèm búp cao su
  {
    stt: "17",
    id: "dropper-pipette",
    catalogId: "OL3D-EQP-CHE-0003",
    bgdCode: "TB-KHTN8-HOA-03",
    nameVi: "Ống hút nhỏ giọt (Pipet pasteur) kèm búp cao su",
    nameEn: "Pasteur Dropper Pipette with Rubber Teat",
    discipline: "Hóa học - Thao tác định lượng dung dịch",
    lesson: "Bài: Dung dịch, Nồng độ, Phản ứng Acid - Base, Thử quỳ tím (SGK KHTN 8)",
    scientificFeatures: "Hút và định lượng từng giọt dung dịch hóa chất chuẩn xác ($1\\text{ giọt} \\approx 0.04 - 0.05\\text{ mL}$), chuyển dung dịch an toàn vào ống nghiệm hoặc khay thử giọt sứ.",
    principles: "Nguyên lý áp suất chênh lệch: Khi bóp búp cao su, một lượng không khí bị đẩy ra ngoài. Nhúng đầu nhọn vào chất lỏng rồi nhả tay, thể tích khí trong búp giãn nở làm áp suất trong ống giảm thấp hơn áp suất khí quyển: $p_{\\text{ống}} < p_0$. Áp suất khí quyển ép chất lỏng dâng lên trong ống mao quản.",
    formulas: `Điều kiện cân bằng cột chất lỏng trong ống hút:
$$p_0 = p_{\\text{khí trong}} + \\rho \\cdot g \\cdot h_{\\text{cột lỏng}}$$
Thể tích một giọt rơi tự do phụ thuộc vào sức căng bề mặt $\\sigma$ và bán kính đầu mút $r$:
$$m_{\\text{giọt}} \\cdot g = 2\\pi \\cdot r \\cdot \\sigma \\implies V_{\\text{giọt}} = \\frac{2\\pi \\cdot r \\cdot \\sigma}{\\rho \\cdot g}$$
Với nước ở $25^\\circ\\text{C}$ và $r = 1.0\\text{ mm}$:
$$V_{\\text{giọt}} \\approx 0.046\\text{ mL} \\implies 20 - 22\\text{ giọt} \\approx 1.0\\text{ mL}$$`,
    dimensionsTable: [
      { part: "Ống mao quản thủy tinh", dimensionMm: "Dài 160 mm, thân phi 7 mm", dimension3d: "phi 0.007 x 0.160 m", role: "Thân ống chứa dung dịch hút" },
      { part: "Đầu mút vuốt nhọn nhỏ giọt", dimensionMm: "phi 2.0 mm, dài vuốt 25 mm, lỗ thoát phi 1.0 mm", dimension3d: "phi 0.002 x 0.025 m", role: "Tạo giọt hóa chất chuẩn kích thước" },
      { part: "Búp cao su đàn hồi màu đỏ", dimensionMm: "phi 16 x Cao 35 mm", dimension3d: "phi 0.016 x 0.035 m", role: "Bơm nén khí tạo áp suất âm" }
    ],
    proportionsTable: [
      { ratioName: "Chiều dài đầu nhọn / Chiều dài ống", formula: "L_{\\text{nhọn}} / L_{\\text{ống}}", value: "25 mm / 160 mm = 15.6%", significance: "Dễ luồn vào các lọ hóa chất miệng hẹp" },
      { ratioName: "Dung tích búp cao su / Dung tích ống", formula: "V_{\\text{búp}} / V_{\\text{ống}}", value: "3.0 mL / 2.0 mL = 1.5", significance: "Đủ sức hút đầy cột chất lỏng 1.5 - 2 mL" }
    ],
    toleranceTable: [
      { connection: "Miệng búp cao su kẹp vành kính", nominalSize: "phi 7.0 mm", tolerance: "-1.0 mm (cao su ôm chặt)", fitType: "Kín khí áp suất âm" }
    ],
    snapPoints: [
      { name: "SuctionTip", position: "(0, -0.090, 0)", type: "dropper_tip", direction: "-Y", compatibleWith: "ReagentBottle.Neck, test-tube-with-clamp.MouthInlet" }
    ],
    dof: "Cầm tay tự do 6 DOF.",
    userActions: "1. Bóp búp cao su trước khi nhúng vào lọ thuốc thử.\n2. Nhúng đầu mút vào dung dịch rồi nhả tay để hút hóa chất lên.\n3. Đưa ống nghiệm và bóp nhẹ từng lần để nhả từng giọt chính xác.",
    hitboxes: "Capsule thon phi 0.018 x 0.195 m.",
    states: [
      { variable: "isTeatSqueezed", type: "boolean", range: "true / false", defaultVal: "false", description: "Búp cao su đang bị bóp xẹp" },
      { variable: "heldLiquidVolumeMl", type: "number", range: "[0, 2.0]", defaultVal: "0.0", description: "Thể tích chất lỏng đang giữ trong ống (ml)" },
      { variable: "dropsDispensedCount", type: "number", range: "0 .. 50", defaultVal: "0", description: "Số giọt đã nhỏ vào ống nghiệm" }
    ],
    solverLogic: "Khi nhấp chuột: Kích hoạt morphTarget nén búp cao su. Nếu `heldLiquidVolumeMl > 0`: Sinh ra 1 hạt chất lỏng hình giọt (Droplet Mesh) rơi tự do chịu gia tốc trọng trường $g = 9.8\\text{ m/s}^2$ xuống ống nghiệm.",
    visualFeedback: "• Búp cao su bẹp lại đàn hồi chân thực.\n• Giọt chất lỏng treo ở đầu mút phình to dần rồi đứt giọt rơi xuống.",
    audioFeedback: "Tiếng 'tong... tong' trong trẻo khi từng giọt dung dịch rơi xuống đáy chất lỏng trong ống nghiệm.",
    operatingLimits: "Không dùng để hút axit đặc bốc khói hoặc dung môi hòa tan cao su.",
    failureModes: [
      { errorAction: "Cầm chúc ngược đầu búp cao su xuống dưới khi đang có dung dịch", physicalConsequence: "Hóa chất chảy ngược vào trong búp cao su ăn mòn thủng búp và làm bẩn hóa chất", pedagogicalWarning: "Tuyệt đối luôn giữ đầu mút ống nhỏ giọt hướng chúc xuống dưới!" }
    ],
    sceneGraphHierarchy: `DropperPipette_Root (Group)
  ├── Mesh_GlassStem (Thân ống thủy tinh thon nhọn)
  ├── Mesh_LiquidInside (Cột chất lỏng bên trong)
  └── Mesh_RubberTeat (Búp cao su màu đỏ có morphTarget bóp xẹp)`,
    pivotPlacement: "Tọa độ tâm búp cầm tay (0, 0.050, 0).",
    materialsTable: [
      { meshPart: "Thân thủy tinh", materialType: "MeshPhysicalMaterial", pbrParams: "transmission: 0.98, roughness: 0.02, ior: 1.5", visualAppearance: "Thủy tinh trong vắt" },
      { meshPart: "Búp cao su", materialType: "MeshStandardMaterial", pbrParams: "color: #ef4444, roughness: 0.55, metalness: 0.05", visualAppearance: "Cao su lưu hóa màu đỏ tươi đàn hồi" }
    ]
  },

  // 18: Đèn cồn thí nghiệm 150ml có bấc & nắp chụp
  {
    stt: "18",
    id: "spirit-burner-150",
    catalogId: "OL3D-EQP-CHE-0004",
    bgdCode: "TB-KHTN8-HOA-04",
    nameVi: "Đèn cồn thí nghiệm 150ml có bấc & nắp chụp",
    nameEn: "Glass Spirit Burner 150ml with Wick and Snuffer Cap",
    discipline: "Hóa học - Nguồn nhiệt năng phòng Lab",
    lesson: "Bài: Phản ứng nhiệt phân, Đun sôi dung dịch, Tốc độ phản ứng (SGK KHTN 8)",
    scientificFeatures: "Cung cấp nguồn nhiệt sạch, không khói, ngọn lửa đều đặn nhiệt độ vùng ngoài đạt $600 - 800^\\circ\\text{C}$ phục vụ toàn bộ các phản ứng đun nóng hóa học và nhiệt phân THCS.",
    principles: "Cồn ethanol ($C_2H_5OH$) thấm theo hiện tượng mao dẫn qua các sợi bông cotton của bấc đèn lên đỉnh. Tại đây hơi cồn bay hơi gặp nhiệt độ bắt cháy phản ứng mãnh liệt với oxy không khí. Dập tắt ngọn lửa an toàn bằng cách đậy nắp chụp ngắt nguồn cung cấp oxy $O_2$.",
    formulas: `Phương trình nhiệt hóa học cháy hoàn toàn của Ethanol:
$$C_2H_5OH(l) + 3O_2(g) \\xrightarrow{t^\\circ} 2CO_2(g) + 3H_2O(g), \\quad \\Delta H = -1367\\text{ kJ/mol}$$
Cấu trúc nhiệt độ 3 vùng ngọn lửa:
1. Vùng lõi tối sát bấc: $T \\approx 300 - 400^\\circ\\text{C}$ (Hơi cồn chưa kịp hòa trộn oxy).
2. Vùng sáng ở giữa: $T \\approx 500 - 600^\\circ\\text{C}$ (Cháy chưa hoàn toàn, có các hạt carbon vi mô phát sáng).
3. Vùng ngoài cùng đỉnh ngọn lửa: $T \\approx 650 - 800^\\circ\\text{C}$ (Vùng nóng nhất, cháy hoàn toàn - luôn dùng vùng này để gia nhiệt).`,
    dimensionsTable: [
      { part: "Bầu đèn thủy tinh nón cụt", dimensionMm: "phi đáy 85 mm, cao 105 mm, dung tích 150 mL", dimension3d: "phi 0.085 x 0.105 m", role: "Chứa nhiên liệu cồn an toàn, đáy bè chống lật" },
      { part: "Cổ đui gốm sứ giữ bấc", dimensionMm: "phi 20 x 18 mm, lỗ xỏ bấc phi 5.5 mm", dimension3d: "phi 0.020 x 0.018 m", role: "Cách nhiệt ngăn truyền nhiệt xuống bầu cồn" },
      { part: "Sợi bấc bông cotton tròn", dimensionMm: "phi 5.0 mm, nhô cao 8.0 mm", dimension3d: "phi 0.005 x 0.008 m", role: "Dẫn mao dẫn cồn bốc cháy" },
      { part: "Nắp chụp dập lửa thủy tinh", dimensionMm: "phi 32 x Cao 45 mm", dimension3d: "phi 0.032 x 0.045 m", role: "Dập tắt lửa và chống bay hơi cồn khi cất giữ" }
    ],
    proportionsTable: [
      { ratioName: "Đường kính đáy / Chiều cao bầu", formula: "\\varnothing_{\\text{đáy}} / H", value: "85 mm / 105 mm = 0.81", significance: "Đáy bè vững chãi, triệt tiêu nguy cơ xô đổ" },
      { ratioName: "Thể tích cồn tối đa / Dung tích bầu", formula: "V_{\\text{cồn}} / V_{\\text{bầu}}", value: "100 mL / 150 mL = 66.7%", significance: "Quy tắc an toàn: Không đổ quá 2/3 bầu đèn" }
    ],
    toleranceTable: [
      { connection: "Khớp nắp chụp vào cổ đui sứ", nominalSize: "phi 20.0 mm", tolerance: "+1.0 mm", fitType: "Úp chụp trơn tru ngắt oxy" }
    ],
    snapPoints: [
      { name: "FlameHeatingHotspot", position: "(0, 0.145, 0)", type: "thermal_source", direction: "+Y", compatibleWith: "tripod-burner-gauze.BurnerPlacement" },
      { name: "SnufferCapRest", position: "(0, 0.110, 0)", type: "snuffer_cap_port", direction: "+Y", compatibleWith: "GlassCap.Socket" }
    ],
    dof: "Đặt cố định trên bàn hoặc nhấc di chuyển tự do (6 DOF). Nắp chụp có trạng thái Đậy / Mở.",
    userActions: "1. Mở nắp chụp đèn cồn.\n2. Nhấp que diêm/bật lửa châm lửa vào bấc.\n3. Đậy nắp chụp dập tắt lửa tức thì.",
    hitboxes: "Khối nón cụt đáy phi 0.090 x cao 0.150 m.",
    states: [
      { variable: "isLit", type: "boolean", range: "true / false", defaultVal: "false", description: "Trạng thái ngọn lửa đang cháy hay tắt" },
      { variable: "fuelLevelNormalized", type: "number", range: "[0.0, 1.0]", defaultVal: "0.7", description: "Lượng cồn còn lại trong bầu" },
      { variable: "isCapOn", type: "boolean", range: "true / false", defaultVal: "true", description: "Nắp chụp đang đậy hay mở" }
    ],
    solverLogic: "Khi châm lửa: Kích hoạt hệ thống hạt ngọn lửa 3D (Volumetric Flame Shader) và nguồn nhiệt `PointLight` màu vàng cam ấm áp ($T = 750^\\circ\\text{C}$, bán kính tỏa nhiệt $0.2\\text{ m}$). Khi đậy nắp chụp: Hủy hạt lửa sau $0.1\\text{ s}$, `isLit = false`.",
    visualFeedback: "• Ngọn lửa 3D bập bùng sống động với vùng trong màu xanh mờ và chóp vàng cam rực sáng.\n• Tỏa sáng rực rỡ mặt bàn xung quanh.",
    audioFeedback: "Tiếng 'phụt' êm ái khi bén lửa; tiếng 'cạch' thủy tinh khi đậy nắp dập lửa.",
    operatingLimits: "Nhiệt lượng tỏa ra: $\\approx 800\\text{ W}$. Chỉ sử dụng cồn $90^\\circ - 96^\\circ$.",
    failureModes: [
      { errorAction: "Thổi tắt đèn cồn bằng miệng", physicalConsequence: "Làm tạt ngọn lửa hoặc kéo tàn bấc bén ngược vào khe cổ bình gây nổ hơi cồn", pedagogicalWarning: "Tuyệt đối không thổi tắt bằng miệng! Phải đậy nắp chụp để ngắt oxy." },
      { errorAction: "Nghiêng đèn cồn đang cháy để châm lửa sang đèn cồn khác", physicalConsequence: "Cồn lỏng tràn ra ngoài gây bắt lửa cháy lan cả mặt bàn", pedagogicalWarning: "Không bao giờ nghiêng đèn cồn để châm lửa! Luôn dùng que đóm hoặc diêm." }
    ],
    sceneGraphHierarchy: `SpiritBurner_Root (Group)
  ├── Mesh_GlassReservoir (Bầu thủy tinh nón cụt)
  ├── Mesh_AlcoholFluid (Cồn lỏng trong suốt bên trong)
  ├── Mesh_CeramicCollar (Đui sứ trắng cổ bình)
  ├── Mesh_CottonWick (Sợi bấc cotton)
  ├── Group_FlameFX (Cụm hiệu ứng ngọn lửa 3D)
  │     ├── Mesh_FlameCore (Lõi lửa xanh)
  │     ├── Mesh_FlameOuter (Vỏ lửa vàng cam bập bùng)
  │     └── PointLight_Fire (Nguồn sáng điểm phát nhiệt)
  └── Mesh_SnufferCap (Nắp chụp thủy tinh tháo rời)`,
    pivotPlacement: "Tọa độ đáy bình (0, 0, 0).",
    materialsTable: [
      { meshPart: "Bầu thủy tinh", materialType: "MeshPhysicalMaterial", pbrParams: "transmission: 0.92, roughness: 0.08, ior: 1.51", visualAppearance: "Thủy tinh đúc dày chịu lực" },
      { meshPart: "Đui gốm sứ", materialType: "MeshStandardMaterial", pbrParams: "color: #f8fafc, roughness: 0.9, metalness: 0.05", visualAppearance: "Gốm xốp cách nhiệt trắng ngà" }
    ]
  },

  // 19: Kiềng đun sắt 3 chân & Lưới thép lót sứ tản nhiệt
  {
    stt: "19",
    id: "tripod-burner-gauze",
    catalogId: "OL3D-EQP-CHE-0005",
    bgdCode: "TB-KHTN8-HOA-05",
    nameVi: "Kiềng đun sắt 3 chân & Lưới thép lót sứ tản nhiệt",
    nameEn: "Laboratory Tripod Stand with Ceramic Wire Gauze",
    discipline: "Hóa học - Thiết bị gia nhiệt gián tiếp",
    lesson: "Bài: Đun nóng dung dịch, Cô cạn dung dịch (SGK KHTN 8)",
    scientificFeatures: "Nâng đỡ các dụng cụ thủy tinh (cốc đốt, bình tam giác) hoặc bát sứ phía trên ngọn lửa đèn cồn; lưới thép lót sứ phân tán đều nhiệt lượng, chống nứt vỡ do sốc nhiệt cục bộ.",
    principles: "Đĩa gốm chịu nhiệt ở tâm lưới thép hấp thụ nhiệt từ ngọn lửa đèn cồn và bức xạ nhiệt đều ra toàn bộ diện tích tiếp xúc với đáy dụng cụ, triệt tiêu các điểm quá nhiệt đột ngột (hot spots). Ba chân choãi $15^\\circ$ đảm bảo độ ổn định tĩnh học tối đa.",
    formulas: `Khoảng cách chuẩn từ đỉnh bấc đèn cồn tới mặt lưới sứ:
$$h_{\\text{khoảng hở}} = H_{\\text{kiềng}} - H_{\\text{đèn cồn}} = 160 - 120 = 40\\text{ mm}$$
(Đúng vị trí $2/3$ ngọn lửa nơi nhiệt độ đạt cực đại $700 - 800^\\circ\\text{C}$).
Độ dẫn nhiệt của lớp sứ tản nhiệt:
$$q = -k \\cdot \\nabla T = -k_{\\text{gốm}} \\cdot \\frac{T_{\\text{lưới}} - T_{\\text{đáy}}}{t_{\\text{sứ}}}$$
với $k_{\\text{gốm}} \\approx 1.5\\text{ W/(m}\\cdot\\text{K)}$ giúp dòng nhiệt truyền dịu êm vào đáy thủy tinh.`,
    dimensionsTable: [
      { part: "Vòng kiềng tròn bằng sắt", dimensionMm: "phi 100 mm, thanh sắt phi 6 mm", dimension3d: "phi 0.100 x 0.006 m", role: "Vòng đỡ mặt lưới phẳng" },
      { part: "3 chân kiềng thép choãi", dimensionMm: "phi 8 x Cao 160 mm, góc choãi 15 độ", dimension3d: "phi 0.008 x 0.160 m", role: "Chân đứng chịu lực chống rung" },
      { part: "Tấm lưới thép đan ô caro", dimensionMm: "120 x 120 x 1.5 mm", dimension3d: "0.120 x 0.120 x 0.0015 m", role: "Lưới thép chịu nhiệt" },
      { part: "Đĩa sứ chịu nhiệt tròn tâm", dimensionMm: "phi 70 x dày 2.5 mm", dimension3d: "phi 0.070 x 0.0025 m", role: "Tản nhiệt đều chống sốc nứt đáy cốc" }
    ],
    proportionsTable: [
      { ratioName: "Đường kính vòng kiềng / Chiều cao", formula: "\\varnothing_{\\text{vòng}} / H", value: "100 mm / 160 mm = 0.625", significance: "Dáng đứng thanh thoát, đặt lọt đèn cồn bên dưới" },
      { ratioName: "Đường kính đĩa sứ / Kích thước lưới", formula: "\\varnothing_{\\text{sứ}} / L_{\\text{lưới}}", value: "70 mm / 120 mm = 58.3%", significance: "Bao trọn đáy các loại cốc 100ml, 250ml và bát sứ" }
    ],
    toleranceTable: [
      { connection: "Mối hàn 3 chân vào vòng kiềng", nominalSize: "Hàn ngấu liên tục", tolerance: "Chịu tải uốn > 100 N", fitType: "Hàn cứng vững công nghiệp" }
    ],
    snapPoints: [
      { name: "TopGauzeRest", position: "(0, 0.160, 0)", type: "surface_rest_gauze", direction: "+Y", compatibleWith: "CeramicWireGauze.Base" },
      { name: "UnderBurnerSlot", position: "(0, 0, 0)", type: "burner_cavity", direction: "+Y", compatibleWith: "spirit-burner-150.Base" }
    ],
    dof: "Cố định tĩnh trên bàn phòng thí nghiệm.",
    userActions: "1. Đặt kiềng đun trùm lên đèn cồn.\n2. Đặt tấm lưới thép lót sứ lên vòng tròn kiềng sắt.\n3. Đặt cốc thủy tinh hoặc bát cô cạn lên tâm đĩa sứ.",
    hitboxes: "Hình trụ tròn đáy choãi phi 0.140 x cao 0.165 m.",
    states: [
      { variable: "hasGauzeInstalled", type: "boolean", range: "true / false", defaultVal: "true", description: "Đã đặt lưới thép lót sứ lên chưa" },
      { variable: "surfaceTemperatureC", type: "number", range: "[25, 600]", defaultVal: "25.0", description: "Nhiệt độ đĩa sứ khi đang đun" }
    ],
    solverLogic: "Khi đèn cồn bên dưới đang cháy (`isLit = true`), truyền nhiệt dẫn suất lên đĩa sứ làm tăng `surfaceTemperatureC` lên $400 - 550^\\circ\\text{C}$. Vật thể đặt trên đĩa sứ sẽ nhận nhiệt lượng theo định luật Fourier.",
    visualFeedback: "Đĩa sứ ở trung tâm ửng đỏ nhẹ khi đun nóng ở nhiệt độ cao.",
    audioFeedback: "Âm thanh kim loại 'keng' khi đặt tấm lưới thép lên vòng sắt.",
    operatingLimits: "Tải trọng chịu lực: $\\le 2.0\\text{ kg}$ (đỡ cốc chứa $500\\text{ mL}$ an toàn).",
    failureModes: [
      { errorAction: "Đặt cốc đun trực tiếp lên vòng kiềng sắt mà không có lưới thép lót sứ", physicalConsequence: "Cốc thủy tinh bị ngọn lửa chiếu tập trung điểm nứt vỡ đáy làm chảy hóa chất", pedagogicalWarning: "Bắt buộc phải lót tấm lưới thép có tâm sứ khi đun cốc thủy tinh!" }
    ],
    sceneGraphHierarchy: `TripodStand_Root (Group)
  ├── Mesh_IronRing (Vòng kiềng sắt tròn)
  ├── Mesh_TripodLegs[0..2] (3 chân thép choãi 15 độ)
  └── Group_WireGauze (Tấm lưới thép tháo rời)
        ├── Mesh_MetalMeshSquare (Lưới thép đan ô)
        └── Mesh_CeramicDiscCenter (Đĩa gốm trắng chịu lửa tròn tâm)`,
    pivotPlacement: "Tọa độ mặt bàn tâm 3 chân (0, 0, 0).",
    materialsTable: [
      { meshPart: "Kiềng sắt", materialType: "MeshStandardMaterial", pbrParams: "color: #27272a, roughness: 0.7, metalness: 0.4", visualAppearance: "Thép sơn đen chịu nhiệt chống gỉ" },
      { meshPart: "Lưới thép", materialType: "MeshStandardMaterial", pbrParams: "color: #94a3b8, roughness: 0.4, metalness: 0.9", visualAppearance: "Sợi thép mạ bạc đan caro" },
      { meshPart: "Đĩa sứ", materialType: "MeshStandardMaterial", pbrParams: "color: #f4f4f5, roughness: 0.9, metalness: 0.05", visualAppearance: "Gốm chịu lửa sợi silicat trắng ngà" }
    ]
  },

  // 20: Phễu lọc thủy tinh góc 60 độ & Giấy lọc gấp nếp
  {
    stt: "20",
    id: "filter-funnel-paper",
    catalogId: "OL3D-EQP-CHE-0006",
    bgdCode: "TB-KHTN8-HOA-06",
    nameVi: "Phễu lọc thủy tinh góc 60 độ & Giấy lọc gấp nếp",
    nameEn: "Glass Filter Funnel with Conical Filter Paper",
    discipline: "Hóa học - Tách chất & Tinh chế",
    lesson: "Bài: Tách chất ra khỏi hỗn hợp, Muối không tan, Tinh chế dung dịch (SGK KHTN 8)",
    scientificFeatures: "Tách các chất rắn không tan (kết tủa) ra khỏi dung dịch lỏng bằng phương pháp lọc trọng lực cổ điển, thu nước lọc trong suốt vào bình hứng phía dưới.",
    principles: "Hỗn hợp huyền phù đi qua giấy lọc xốp xenluloza: Các lỗ xốp mao quản nhỏ ($5 - 10\\,\\mu\\text{m}$) giữ lại toàn bộ hạt kết tủa rắn trên mặt giấy, chỉ cho phân tử dung môi và ion tan đi qua. Cuống phễu dài vát $45^\\circ$ đặt áp sát thành trong cốc hứng để dòng chất lỏng chảy bám dính mượt mà không bị bắn tóe.",
    formulas: `Định luật Darcy về dòng chảy qua màng xốp:
$$Q = \\frac{dV}{dt} = \\frac{K \\cdot A \\cdot \\Delta p}{\\mu \\cdot L_{\\text{màng}}}$$
trong đó $\\Delta p = \\rho \\cdot g \\cdot h_{\\text{cột chất lỏng}}$ là áp suất thủy tĩnh của lượng chất lỏng chứa trong lòng phễu.
Góc nón phễu chuẩn:
$$\\alpha_{\\text{nón}} = 60^\\circ \\implies \\text{Góc giấy lọc gấp tư: } 360^\\circ / 4 = 90^\\circ \\rightarrow 60^\\circ \\text{ nón tròn khớp hoàn hảo}$$`,
    dimensionsTable: [
      { part: "Miệng phễu nón", dimensionMm: "phi 60 mm, góc mở nón 60 độ", dimension3d: "phi 0.060 x 0.052 m", role: "Hứng dung dịch và ôm trọn giấy lọc" },
      { part: "Cuống phễu hình ống", dimensionMm: "phi ngoài 8 mm, phi trong 5 mm, dài 70 mm", dimension3d: "phi 0.008 x 0.070 m", role: "Dẫn dòng nước lọc chảy xuống cốc" },
      { part: "Đầu vát cuống phễu", dimensionMm: "Vát xiên góc 45 độ sắc nét", dimension3d: "0.010 m", role: "Tạo dòng chảy bám theo thành cốc" },
      { part: "Giấy lọc gấp nón tròn", dimensionMm: "phi 110 mm gấp tư, mép xòe phi 58 mm", dimension3d: "phi 0.058 x 0.048 m", role: "Màng lọc xốp giữ kết tủa" }
    ],
    proportionsTable: [
      { ratioName: "Chiều dài cuống / Chiều cao nón", formula: "L_{\\text{cuống}} / H_{\\text{nón}}", value: "70 mm / 52 mm = 1.346", significance: "Cuống thon dài tạo cột hút mao dẫn tăng tốc độ lọc" },
      { ratioName: "Đường kính giấy lọc / Miệng phễu", formula: "\\varnothing_{\\text{giấy}} / \\varnothing_{\\text{miệng}}", value: "110 mm / 60 mm = 1.83", significance: "Mép giấy lọc thấp hơn miệng phễu 5mm theo chuẩn Lab" }
    ],
    toleranceTable: [
      { connection: "Giấy lọc ôm lòng phễu", nominalSize: "Góc 60 độ", tolerance: "+/- 0.5 độ", fitType: "Miết ướt nước dính sát không lọt bọt khí" }
    ],
    snapPoints: [
      { name: "SupportRingSnap", position: "(0, 0.010, 0)", type: "ring_clamp_support", direction: "-Y", compatibleWith: "UniversalClampRing.Port" },
      { name: "BeakerWallContactTip", position: "(0.003, -0.068, 0)", type: "spout_contact", direction: "+X", compatibleWith: "beaker-250.InnerWall" }
    ],
    dof: "Gá trên giá sắt đỡ phễu hoặc cắm miệng bình tam giác.",
    userActions: "1. Đặt giấy lọc vào lòng phễu và xịt nước làm ướt dính sát thành kính.\n2. Đặt phễu lên vòng đỡ giá sắt, áp cuống phễu vào thành cốc hứng.\n3. Dùng đũa thủy tinh dẫn dòng hỗn hợp rót từ từ vào phễu lọc.",
    hitboxes: "Hình nón cụt kết hợp trụ phi 0.065 x cao 0.125 m.",
    states: [
      { variable: "isPaperWet", type: "boolean", range: "true / false", defaultVal: "false", description: "Giấy lọc đã thấm ướt ôm sát phễu" },
      { variable: "liquidInsideFunnelMl", type: "number", range: "[0, 30]", defaultVal: "0.0", description: "Thể tích chất lỏng đang chờ lọc trong phễu" },
      { variable: "precipitateRetainedGrams", type: "number", range: "[0, 5.0]", defaultVal: "0.0", description: "Khối lượng kết tủa giữ lại trên giấy" }
    ],
    solverLogic: "Tốc độ lọc dòng nước: $$\\frac{dV}{dt} = 0.05 \\times \\text{liquidInsideFunnelMl} \\quad (\\text{mL/s})$$. Từng giọt dịch lọc trong suốt nhỏ từ cuống phễu xuống cốc hứng; lượng kết tủa dày dần trên mặt giấy lọc.",
    visualFeedback: "Giấy lọc chuyển từ trắng đục sang trắng trong mờ khi thấm ướt; từng giọt nước lọc nhỏ xuống cốc hứng đều đặn.",
    audioFeedback: "Tiếng giọt nước chảy tí tách êm dịu bám thành cốc thủy tinh.",
    operatingLimits: "Không đổ hỗn hợp vượt quá mép trên của giấy lọc.",
    failureModes: [
      { errorAction: "Dùng đũa thủy tinh chọc thủng đáy giấy lọc khi khuấy", physicalConsequence: "Toàn bộ cặn kết tủa chảy tuột xuống cốc hứng làm đục nước lọc", pedagogicalWarning: "Không dùng đũa chọc vào đáy phễu; chỉ dùng đũa dẫn dòng chảy." },
      { errorAction: "Để cuống phễu lơ lửng giữa miệng cốc hứng", physicalConsequence: "Dung dịch nhỏ giọt rơi tự do bắn tóe ra bàn", pedagogicalWarning: "Luôn đặt đầu vát cuống phễu áp sát vào thành trong cốc hứng." }
    ],
    sceneGraphHierarchy: `FilterFunnel_Root (Group)
  ├── Mesh_GlassFunnelBody (Thân phễu nón và cuống vát thủy tinh)
  ├── Mesh_ConicalFilterPaper (Giấy lọc nón 4 lớp ôm sát)
  └── Mesh_FiltrateDripDrops (Hạt giọt dung dịch rơi tuần hoàn)`,
    pivotPlacement: "Tọa độ ranh giới giữa đáy nón và cuống phễu (0, 0, 0).",
    materialsTable: [
      { meshPart: "Phễu thủy tinh", materialType: "MeshPhysicalMaterial", pbrParams: "transmission: 0.97, roughness: 0.02, ior: 1.51", visualAppearance: "Thủy tinh trong suốt chịu hóa chất" },
      { meshPart: "Giấy lọc", materialType: "MeshStandardMaterial", pbrParams: "color: #fafafa, roughness: 0.85, metalness: 0.02", visualAppearance: "Sợi xenluloza trắng ngà xốp mờ" }
    ]
  },

  // 21: Bát sứ nung / Bát cô cạn dung dịch 75ml
  {
    stt: "21",
    id: "porcelain-evaporating-basin",
    catalogId: "OL3D-EQP-CHE-0007",
    bgdCode: "TB-KHTN8-HOA-07",
    nameVi: "Bát sứ nung / Bát cô cạn dung dịch 75ml",
    nameEn: "Porcelain Evaporating Dish with Spout 75ml",
    discipline: "Hóa học - Tách chất & Kết tinh",
    lesson: "Bài: Cô cạn dung dịch muối, Tách chất tan (SGK KHTN 8)",
    scientificFeatures: "Chịu nhiệt độ cực cao trực tiếp từ ngọn lửa đèn cồn để làm bay hơi dung môi nước nhanh chóng, thu lấy chất tan kết tinh (muối ăn $NaCl$, đồng sunfat $CuSO_4$) bám ở đáy bát.",
    principles: "Thiết kế miệng rộng nông tối đa hóa diện tích mặt thoáng chất lỏng, giúp tốc độ bốc hơi nước tăng vọt theo định luật Dalton: $\\frac{dm}{dt} \\propto S \\cdot (p_s - p_a)$. Men sứ kỹ thuật trơ hóa học chịu được kiềm, axit và nhiệt độ nung lên tới $1050^\\circ\\text{C}$.",
    formulas: `Tốc độ bay hơi dung môi:
$$\\frac{dm_{\\text{nước}}}{dt} = \\frac{C \\cdot A_{\\text{mặt thoáng}} \\cdot (p_{\\text{bão hòa}}(T) - p_{\\text{kk}})}{H_{\\text{hóa hơi}}}$$
Khi thể tích nước giảm xuống dưới ngưỡng hòa tan bão hòa $C(T) > S(T)$:
$$m_{\\text{kết tinh}} = m_{\\text{muối ban đầu}} - S(T) \\cdot V_{\\text{nước còn lại}}$$
Muối kết tinh dần tụ lại ở đáy thành lớp tinh thể rắn khô ráo.`,
    dimensionsTable: [
      { part: "Thân bát chỏm cầu", dimensionMm: "phi miệng 75 mm, cao 32 mm, thành dày 2.5 mm", dimension3d: "phi 0.075 x 0.032 m", role: "Chứa dung dịch cô cạn, dung tích 75 mL" },
      { part: "Mỏ rót nhọn", dimensionMm: "Rộng 10 mm, vươn dài 8 mm", dimension3d: "0.008 m", role: "Trút dịch lỏng hoặc tinh thể ra ngoài" },
      { part: "Đáy phẳng mài nhám", dimensionMm: "phi tiếp xúc 30 mm", dimension3d: "phi 0.030 m", role: "Tự vững trên mặt lưới sứ của kiềng đun" }
    ],
    proportionsTable: [
      { ratioName: "Đường kính miệng / Chiều cao", formula: "\\varnothing / H", value: "75 mm / 32 mm = 2.34", significance: "Dáng xòe rộng nông, tối ưu tốc độ thoát hơi nước" }
    ],
    toleranceTable: [
      { connection: "Đáy phẳng tiếp xúc lưới sứ", nominalSize: "phi 30 mm", tolerance: "Độ phẳng < 0.2 mm", fitType: "Tiếp xúc nhiệt phẳng không kênh kiệu" }
    ],
    snapPoints: [
      { name: "BottomRest", position: "(0, 0, 0)", type: "surface_rest_crucible", direction: "-Y", compatibleWith: "tripod-burner-gauze.TopGauzeRest" },
      { name: "TongGripZone", position: "(0, 0.020, 0)", type: "crucible_tong_grip", direction: "Ngang", compatibleWith: "CrucibleTongs.Jaws" }
    ],
    dof: "Đặt trên kiềng đun hoặc cầm bằng panh gắp sứ (6 DOF).",
    userActions: "1. Rót $15 - 20\\text{ mL}$ dung dịch muối vào bát sứ.\n2. Đặt bát lên kiềng đun có lưới thép lót sứ.\n3. Đun đèn cồn và dùng đũa thủy tinh khuấy nhẹ cho đến khi nước cạn và muối kết tinh.",
    hitboxes: "Chỏm cầu tròn phi 0.080 x cao 0.035 m.",
    states: [
      { variable: "solutionVolumeMl", type: "number", range: "[0, 50]", defaultVal: "20.0", description: "Thể tích dung dịch muối đang đun (ml)" },
      { variable: "isDryCrystallized", type: "boolean", range: "true / false", defaultVal: "false", description: "Đã cạn khô kết tinh muối hoàn toàn" },
      { variable: "dishTemperatureC", type: "number", range: "[25, 450]", defaultVal: "25.0", description: "Nhiệt độ bát sứ (độ C)" }
    ],
    solverLogic: "Khi đun nóng: Giảm dần `solutionVolumeMl` với tốc độ bay hơi phụ thuộc `dishTemperatureC`. Khi `solutionVolumeMl <= 0.5 mL`: Hiện lớp tinh thể màu trắng tinh (`NaCl`) hoặc xanh lam (`CuSO4`) phủ kín đáy bát.",
    visualFeedback: "• Hơi nước bốc lên cuồn cuộn thành làn khói trắng.\n• Các hạt tinh thể muối bắt đầu lạo xạo xuất hiện ở viền mép rồi lan kín đáy.",
    audioFeedback: "Tiếng 'lách tách... lách tách' giòn giã đặc trưng khi tinh thể muối khan nổ nhẹ do mất nước.",
    operatingLimits: "Nhiệt độ tối đa: $1050^\\circ\\text{C}$. Không dùng tay không cầm trực tiếp bát sứ khi vừa đun xong.",
    failureModes: [
      { errorAction: "Dùng tay không nhấc bát sứ khi vừa đun sôi cạn muối", physicalConsequence: "Gây bỏng nhiệt cấp độ nặng (bát sứ đang ở nhiệt độ > 200 độ C)", pedagogicalWarning: "Phải dùng kẹp gắp chén nung (Crucible tongs) để gắp bát sứ nóng!" }
    ],
    sceneGraphHierarchy: `EvaporatingDish_Root (Group)
  ├── Mesh_PorcelainBasin (Bát sứ tráng men trắng có mỏ rót)
  ├── Mesh_SalineSolution (Mực nước dung dịch giảm dần)
  └── Mesh_SaltCrystalsPuddle (Lớp tinh thể muối kết tinh lóng lánh)`,
    pivotPlacement: "Tọa độ đáy bát (0, 0, 0).",
    materialsTable: [
      { meshPart: "Thân gốm tráng men", materialType: "MeshStandardMaterial", pbrParams: "color: #ffffff, roughness: 0.15, metalness: 0.05, clearcoat: 0.9", visualAppearance: "Sứ kỹ thuật phủ men bóng láng chịu lửa" },
      { meshPart: "Tinh thể muối", materialType: "MeshStandardMaterial", pbrParams: "color: #f8fafc, roughness: 0.45, metalness: 0.2", visualAppearance: "Hạt tinh thể trắng đục lóng lánh" }
    ]
  },

  // 22: Mô hình giải phẫu tim người tách rời 2 mảnh
  {
    stt: "22",
    id: "human-heart-model",
    catalogId: "OL3D-EQP-BIO-0001",
    bgdCode: "TB-KHTN8-SINH-01",
    nameVi: "Mô hình giải phẫu tim người tách rời 2 mảnh",
    nameEn: "Life-Size Anatomical Human Heart Model 2-Part",
    discipline: "Sinh học - Cơ thể người & Giải phẫu",
    lesson: "Bài: Hệ tuần hoàn ở người, Cấu tạo tim và mạch máu (SGK KHTN 8)",
    scientificFeatures: "Mô phỏng chân thực giải phẫu cấu trúc tim người tỷ lệ 1:1, mặt trước có thể tách rời làm 2 nửa ghép nam châm từ tính để khảo sát 4 ngăn tim (tâm nhĩ, tâm thất), các van tim và các cuống mạch máu lớn.",
    principles: "Tim hoạt động như một chiếc máy bơm hút đẩy tự động trong hệ tuần hoàn kép: Tâm nhĩ phải nhận máu nghèo oxy từ tĩnh mạch chủ $\\rightarrow$ qua van ba lá xuống tâm thất phải $\\rightarrow$ bơm lên phổi qua van động mạch phổi. Tâm nhĩ trái nhận máu giàu oxy từ tĩnh mạch phổi $\\rightarrow$ qua van hai lá xuống tâm thất trái $\\rightarrow$ co bóp mạnh bơm vào động mạch chủ nuôi toàn cơ thể.",
    formulas: `Chu kỳ hoạt động của tim người lúc nghỉ ngơi ($T_{\\text{chu kỳ}} = 0.8\\text{ s}$ tương đương $75\\text{ nhịp/phút}$):
1. Pha co tâm nhĩ: $t_1 = 0.1\\text{ s}$
2. Pha co tâm thất: $t_2 = 0.3\\text{ s}$
3. Pha giãn chung: $t_3 = 0.4\\text{ s}$
Áp lực tâm thất trái sinh ra lớn gấp 4-5 lần tâm thất phải:
$$p_{\\text{thất trái}} \\approx 120\\text{ mmHg} \\gg p_{\\text{thất phải}} \\approx 25\\text{ mmHg}$$
(Do đó thành cơ tim tâm thất trái dày gấp 3 lần thành tâm thất phải: $d_{\\text{trái}} \\approx 12 - 15\\text{ mm}$ so với $d_{\\text{phải}} \\approx 3 - 5\\text{ mm}$).`,
    dimensionsTable: [
      { part: "Khối mô hình tim (Tỷ lệ 1:1)", dimensionMm: "Dài 120 x Rộng 110 x Cao 140 mm", dimension3d: "0.120 x 0.110 x 0.140 m", role: "Thể hiện kích thước tim người trưởng thành" },
      { part: "Đế tròn trưng bày", dimensionMm: "phi 120 x Cao 18 mm", dimension3d: "phi 0.120 x 0.018 m", role: "Đế đứng vững chắc trên bàn" },
      { part: "Trục đỡ kim loại nghiêng", dimensionMm: "phi 6 x Cao 90 mm, nghiêng 15 độ", dimension3d: "phi 0.006 x 0.090 m", role: "Định vị tư thế tim tự nhiên trong lồng ngực" }
    ],
    proportionsTable: [
      { ratioName: "Độ dày thành cơ tim Thất trái / Thất phải", formula: "T_{\\text{LV}} / T_{\\text{RV}}", value: "14 mm / 4.5 mm = 3.11", significance: "Trực quan hóa sự khác biệt công năng áp lực bơm" },
      { ratioName: "Tâm nhĩ / Tâm thất", formula: "V_{\\text{nhĩ}} / V_{\\text{thất}}", value: "Cân đối thể tích 70 mL mỗi nhịp bơm", significance: "Chuẩn giải phẫu y học" }
    ],
    toleranceTable: [
      { connection: "Khớp ghép nam châm 2 nửa tim", nominalSize: "phi 5.0 mm nam châm Neodymium", tolerance: "Lực hút 8.0 N", fitType: "Hút khớp khít tự động định vị" }
    ],
    snapPoints: [
      { name: "StandPinSeat", position: "(0, -0.050, 0)", type: "anatomical_stand_socket", direction: "-Y", compatibleWith: "HeartStand.Pin" },
      { name: "FrontHalfMagneticSnap", position: "(0, 0, 0.020)", type: "magnetic_anatomy_split", direction: "+Z", compatibleWith: "HeartFrontHalf.Back" }
    ],
    dof: "Mặt trước của tim có thể tách rời ra xa dọc trục Z (1 DOF tịnh tiến tách mở). Toàn bộ khối tim xoay $360^\\circ$ quanh trục đỡ.",
    userActions: "1. Nhấp click vào nửa trước của tim để tách mở quan sát 4 ngăn bên trong.\n2. Xoay mô hình tim 360 độ ngắm các cuống mạch máu lớn.\n3. Nhấp vào các cấu trúc giải phẫu để hiển thị bảng nhãn chú thích thông tin.",
    hitboxes: "Bounding Sphere phi 0.130 m bao quanh khối tim.",
    states: [
      { variable: "isSplitOpen", type: "boolean", range: "true / false", defaultVal: "false", description: "Trạng thái tách rời 2 mảnh" },
      { variable: "selectedPart", type: "string | null", range: "ID string", defaultVal: "null", description: "Cấu trúc đang được chọn xem thông tin" },
      { variable: "isBeatingAnimated", type: "boolean", range: "true / false", defaultVal: "false", description: "Bật/tắt hoạt ảnh co bóp mô phỏng nhịp tim" }
    ],
    solverLogic: "Khi nhấp chuột: Kích hoạt Tween tịnh tiến nửa trước sang bên phải $80\\text{ mm}$ và xoay hé mở $30^\\circ$ để lộ toàn bộ vách tim, van hai lá, van ba lá và dây chằng tim (chordae tendineae).",
    visualFeedback: "Màu sắc mô học y khoa chuẩn: Động mạch đỏ tươi (`#ef4444`), Tĩnh mạch xanh lam (`#1d4ed8`), Cơ tim hồng đỏ sẫm (`#be123c`), Mô mỡ vàng nhạt (`#fef08a`).",
    audioFeedback: "Âm thanh tiếng tim đập 'bùm... tặc' (Lub-Dub) chân thực theo chu kỳ $0.8\\text{ s}$.",
    operatingLimits: "Mô hình giảng dạy mô phỏng hình thái.",
    failureModes: [
      { errorAction: "Nhầm lẫn giữa vị trí tâm thất trái và tâm thất phải", physicalConsequence: "Hiểu sai chiều tuần hoàn máu đỏ tươi và đỏ thẫm", pedagogicalWarning: "Ghi nhớ: Thành tâm thất trái luôn dày hơn nhiều so với tâm thất phải!" }
    ],
    sceneGraphHierarchy: `HumanHeart_Root (Group)
  ├── Mesh_DisplayBase (Đế tròn nhựa ABS đen)
  ├── Mesh_SupportRod (Thanh trụ kim loại đỡ nghiêng)
  ├── Group_HeartBackHalf (Nửa sau tim gắn cố định trên trục)
  │     ├── Thất trái, nhĩ trái, tĩnh mạch chủ, động mạch chủ
  │     └── Hệ thống van tim và dây chằng
  └── Group_HeartFrontHalf (Nửa trước tim tách mở tháo rời)
        └── Nam châm ngầm định vị`,
    pivotPlacement: "Tọa độ tâm trọng tâm quả tim (0, 0, 0).",
    materialsTable: [
      { meshPart: "Cơ tim", materialType: "MeshStandardMaterial", pbrParams: "color: #be123c, roughness: 0.45, metalness: 0.05", visualAppearance: "Bề mặt mô cơ tim dẻo mềm" },
      { meshPart: "Động mạch", materialType: "MeshStandardMaterial", pbrParams: "color: #ef4444, roughness: 0.3, metalness: 0.1", visualAppearance: "Ống cao su đỏ tươi chứa máu giàu oxy" },
      { meshPart: "Tĩnh mạch", materialType: "MeshStandardMaterial", pbrParams: "color: #1d4ed8, roughness: 0.3, metalness: 0.1", visualAppearance: "Ống cao su xanh dương chứa máu nghèo oxy" }
    ]
  },

  // 23: Kính hiển vi quang học học sinh 3 vật kính
  {
    stt: "23",
    id: "student-optical-microscope",
    catalogId: "OL3D-EQP-BIO-0002",
    bgdCode: "TB-KHTN8-SINH-02",
    nameVi: "Kính hiển vi quang học học sinh 3 vật kính",
    nameEn: "Student Monocular Optical Biological Microscope",
    discipline: "Sinh học - Quan sát vi mô & Tế bào",
    lesson: "Bài: Quan sát tế bào biểu bì, Máu và thành phần tế bào máu (SGK KHTN 8)",
    scientificFeatures: "Thiết bị quang học phóng đại từ $40\\times$ đến $400\\times$ phục vụ quan sát trực quan tế bào thực vật (vảy hành tây), tế bào máu động vật, cấu trúc vi khuẩn và sinh vật đơn bào trong giọt nước ao.",
    principles: "Hệ thống phóng đại 2 cấp bằng thấu kính: Vật kính (Objective) tạo một ảnh thật phóng đại trung gian ngược chiều trong thân ống kính; Thị kính (Eyepiece) đóng vai trò như kính lúp phóng đại tiếp ảnh thật đó thành ảnh ảo cùng chiều rất lớn trước mắt người quan sát.",
    formulas: `Độ phóng đại tổng thể của kính hiển vi:
$$K_{\\text{tổng}} = K_{\\text{thị kính}} \\times K_{\\text{vật kính}}$$
Với thị kính chuẩn $10\\times$ và mâm 3 vật kính xoay:
1. Vật kính $4\\times$: $K_1 = 10 \\times 4 = 40\\times$ (Tìm mẫu thô, trường quan sát rộng)
2. Vật kính $10\\times$: $K_2 = 10 \\times 10 = 100\\times$ (Quan sát mô tế bào trung bình)
3. Vật kính $40\\times$: $K_3 = 10 \\times 40 = 400\\times$ (Quan sát chi tiết nhân và màng tế bào)
Công thức liên hệ quang học thấu kính:
$$\\frac{1}{f} = \\frac{1}{d} + \\frac{1}{d'}, \\quad K = \\frac{d'}{d} = \\frac{\\delta \\cdot D}{f_{\\text{vật}} \\cdot f_{\\text{thị}}}$$
(Khoảng cách làm việc của vật kính $40\\times$ cực ngắn: $d \\approx 0.5 - 1.0\\text{ mm}$).`,
    dimensionsTable: [
      { part: "Khung thân kính hiển vi", dimensionMm: "Cao tổng 310 mm, thân cong chữ C đúc", dimension3d: "0.130 x 0.170 x 0.310 m", role: "Khung hợp kim chịu lực quang học" },
      { part: "Đế đúc hình móng ngựa", dimensionMm: "130 x 170 x 35 mm", dimension3d: "0.130 x 0.170 x 0.035 m", role: "Đế vững chống rung lắc khi lấy nét" },
      { part: "Bàn sa trượt phẳng", dimensionMm: "110 x 120 mm, có lỗ tụ sáng phi 15 mm", dimension3d: "0.110 x 0.120 m", role: "Đặt lam kính tiêu bản và 2 kẹp lá thép" },
      { part: "Mâm xoay 3 vật kính", dimensionMm: "phi 55 mm, 3 ống kính mạ Crom", dimension3d: "phi 0.055 m", role: "Xoay chuyển đổi 4x, 10x, 40x" },
      { part: "Ống thị kính nghiêng 45 độ", dimensionMm: "phi 25 x Dài 130 mm", dimension3d: "phi 0.025 x 0.130 m", role: "Ống ngắm công thái học góc nhìn 45 độ" },
      { part: "Cụm ốc đại cấp & vi cấp", dimensionMm: "Ốc đại phi 35 mm, ốc vi phi 22 mm đồng trục", dimension3d: "phi 0.035 m", role: "Nâng hạ bàn sa trượt lấy nét tiêu cự" },
      { part: "Gương phản chiếu 2 mặt", dimensionMm: "phi 45 mm (mặt phẳng và mặt lõm)", dimension3d: "phi 0.045 m", role: "Hứng ánh sáng tự nhiên hội tụ vào mẫu" }
    ],
    proportionsTable: [
      { ratioName: "Chiều cao kính / Chiều rộng đế", formula: "H / W_{\\text{đế}}", value: "310 mm / 130 mm = 2.38", significance: "Tỷ lệ chuẩn công thái học phòng thí nghiệm trường học" },
      { ratioName: "Bước dịch chuyển ốc vi cấp / ốc đại cấp", formula: "\\Delta y_{\\text{vi}} / \\Delta y_{\\text{đại}}", value: "0.1 mm / 10 mm = 1 : 100", significance: "Ốc vi cấp tinh chỉnh 100 lần mịn hơn, không làm vỡ lam kính" }
    ],
    toleranceTable: [
      { connection: "Khớp xoay mâm vật kính", nominalSize: "3 vị trí snap bi", tolerance: "+/- 0.05 mm đồng trục", fitType: "Khớp bi click định tâm quang học" }
    ],
    snapPoints: [
      { name: "StageSlideClips", position: "(0, 0.140, 0.020)", type: "microscope_slide_stage", direction: "+Y", compatibleWith: "GlassSlideSpecimen.Plate" },
      { name: "EyepieceCameraPort", position: "(0, 0.290, -0.040)", type: "optical_eyepiece_view", direction: "Nghiêng 45 độ", compatibleWith: "VirtualMicroscopeCamera" }
    ],
    dof: "1. Mâm vật kính: 1 DOF xoay bước $120^\\circ$.\n2. Bàn sa trượt: 1 DOF tịnh tiến lên xuống theo trục Y ($0 - 25\\text{ mm}$).\n3. Gương hứng sáng: 2 DOF xoay lật đa hướng.",
    userActions: "1. Kẹp lam kính tiêu bản lên bàn sa trượt.\n2. Xoay mâm chọn vật kính nhỏ ($4\\times$) trước.\n3. Vặn ốc đại cấp nâng hạ bàn kính tìm vùng mẫu.\n4. Vặn ốc vi cấp lấy nét cực kỳ sắc nét.\n5. Chuyển sang góc nhìn thị kính (Microscope Viewport UI).",
    hitboxes: "Khối OBB kết hợp: 0.140 x 0.320 x 0.180 m.",
    states: [
      { variable: "selectedMagnification", type: "enum", range: "'40x' | '100x' | '400x'", defaultVal: "'40x'", description: "Độ phóng đại hiện tại" },
      { variable: "focusOffsetMm", type: "number", range: "[-5.0, 5.0]", defaultVal: "1.5", description: "Độ lệch tiêu cự (0 = nét hoàn hảo)" },
      { variable: "lightIntensity", type: "number", range: "[0.0, 1.0]", defaultVal: "0.8", description: "Cường độ ánh sáng gương hứng sáng" },
      { variable: "hasSlideInstalled", type: "boolean", range: "true / false", defaultVal: "false", description: "Đã kẹp lam kính tiêu bản chưa" }
    ],
    solverLogic: "Xử lý độ mờ nét hình ảnh thị kính (Blur Shader Filter): `blurRadius` $= |focusOffsetMm| \\times 20\\text{ px}$. Khi xoay ốc vi cấp đưa `focusOffsetMm` về $0.0$, hình ảnh tế bào hiển thị siêu nét với các hạt nhân và lục lạp chi tiết.",
    visualFeedback: "• Màn hình góc nhìn thị kính tròn vi mô (Circular Microscope Overlay HUD) phóng to mẫu vật.\n• Tia sáng hội tụ từ gương phản chiếu xuyên qua lỗ bàn kính.",
    audioFeedback: "Tiếng 'tách' êm của khớp bi khi mâm xoay vật kính vào đúng vị trí đồng trục; tiếng xoay ren êm của ốc vi cấp.",
    operatingLimits: "Tránh để đầu thấu kính $40\\times$ chạm đè làm vỡ lam kính.",
    failureModes: [
      { errorAction: "Dùng ốc đại cấp vặn nhanh bàn kính lên khi đang ngắm vật kính 40x", physicalConsequence: "Đầu vật kính đâm thẳng vào lam kính làm nứt vỡ tiêu bản và xước thấu kính", pedagogicalWarning: "Quy tắc an toàn: Với vật kính lớn 40x, chỉ được dùng ốc vi cấp để lấy nét!" },
      { errorAction: "Bắt đầu quan sát ngay ở vật kính lớn 40x", physicalConsequence: "Trường nhìn quá hẹp và tối, không thể tìm thấy mẫu vật", pedagogicalWarning: "Luôn luôn bắt đầu tìm mẫu vật từ vật kính nhỏ nhất (4x)." }
    ],
    sceneGraphHierarchy: `Microscope_Root (Group)
  ├── Mesh_HorseshoeBase (Đế móng ngựa đúc nặng)
  ├── Mesh_ArmFrame (Thân cong chữ C có tay xách)
  ├── Group_StageAssembly (Cụm bàn sa trượt nâng hạ Y)
  │     ├── Mesh_StagePlate (Bàn đặt tiêu bản sơn đen)
  │     ├── Mesh_SlideClips[0..1] (2 lá kẹp giữ tiêu bản)
  │     └── Mesh_CondenserDiaphragm (Đĩa chắn sáng đục lỗ)
  ├── Group_RevolvingNosepiece (Mâm xoay vật kính)
  │     ├── Mesh_Objective_4x (Vật kính 4x viền đỏ)
  │     ├── Mesh_Objective_10x (Vật kính 10x viền vàng)
  │     └── Mesh_Objective_40x (Vật kính 40x viền xanh lam)
  ├── Group_FocusKnobs (Cụm ốc đồng trục hai bên)
  │     ├── Mesh_CoarseKnob (Ốc đại cấp to)
  │     └── Mesh_FineKnob (Ốc vi cấp nhỏ)
  └── Mesh_IlluminationMirror (Gương lật hứng sáng 2 mặt)`,
    pivotPlacement: "Tọa độ đáy đế móng ngựa (0, 0, 0).",
    materialsTable: [
      { meshPart: "Thân kính", materialType: "MeshStandardMaterial", pbrParams: "color: #f8fafc, roughness: 0.25, metalness: 0.1", visualAppearance: "Hợp kim sơn tĩnh điện men trắng bóng cao cấp" },
      { meshPart: "Vật kính & ốc xoay", materialType: "MeshStandardMaterial", pbrParams: "color: #e2e8f0, roughness: 0.1, metalness: 0.95", visualAppearance: "Thép mạ Crom sáng bóng phản chiếu" },
      { meshPart: "Bàn sa trượt", materialType: "MeshStandardMaterial", pbrParams: "color: #0f172a, roughness: 0.8, metalness: 0.2", visualAppearance: "Sơn đen mờ nhám chống lóa ánh sáng" }
    ]
  }
];

function generateMarkdown(spec: SpecData): string {
  return `# BÁO CÁO ĐẶC TẢ KỸ THUẬT & NGHIÊN CỨU SÂU MÔ HÌNH HÓA 3D
## THIẾT BỊ SỐ ${spec.stt}: ${spec.nameVi.toUpperCase()}
**Mã định danh hệ thống (Asset ID)**: \`${spec.id}\` | **Mã số Catalog**: \`${spec.catalogId}\`  
**Tiêu chuẩn Bộ GD&ĐT (TT 38/2021/TT-BGDĐT)**: \`${spec.bgdCode}\`  
**Tên tiếng Anh**: *${spec.nameEn}*  
**Phân môn**: ${spec.discipline} | **Bài học SGK KHTN 8**: ${spec.lesson}

---

## 1. TÍNH NĂNG KHOA HỌC & NGUYÊN LÝ HOẠT ĐỘNG THỰC NGHIỆM

### 1.1. Chức năng khoa học & Mục tiêu sư phạm
${spec.scientificFeatures}

### 1.2. Nguyên lý vật lý / Hóa học / Sinh học nền tảng
${spec.principles}

### 1.3. Hệ thống công thức định lượng (Chuẩn MathType LaTeX)
${spec.formulas}

---

## 2. KÍCH THƯỚC THỰC TẾ & TỶ LỆ HÌNH HỌC CHUẨN (GEOMETRIC PROPORTIONS)

### 2.1. Bảng đo kích thước chi tiết các bộ phận thành phần
Kích thước mô phỏng trong không gian ảo OpenLab 3D được thiết lập theo tỷ lệ thực nghiệm $1:1$ (với đơn vị Three.js quy ước $1\\text{ unit} = 1.0\\text{ m} = 1000\\text{ mm}$):

| Bộ phận thành phần | Kích thước thực tế (mm) | Tọa độ không gian 3D (m) | Vai trò kết cấu trong mô phỏng |
| :--- | :--- | :--- | :--- |
${spec.dimensionsTable.map(d => `| **${d.part}** | ${d.dimensionMm} | \`${d.dimension3d}\` | ${d.role} |`).join('\n')}

### 2.2. Bảng tỷ lệ hình học chuẩn (Proportions & Ratios)
Đảm bảo độ trung thực thị giác tuyệt đối khi zoom cận cảnh:

| Tên tỷ lệ hình học | Công thức tỷ lệ | Giá trị tỷ lệ | Ý nghĩa kỹ thuật & Thị giác mô phỏng |
| :--- | :---: | :---: | :--- |
${spec.proportionsTable.map(p => `| **${p.ratioName}** | \`${p.formula}\` | **${p.value}** | ${p.significance} |`).join('\n')}

### 2.3. Dung sai lắp ghép & Khoảng hở cơ khí (Fit Tolerances & Clearances)
| Điểm ghép nối | Kích thước danh nghĩa | Dung sai cho phép | Kiểu lắp ghép cơ học |
| :--- | :---: | :---: | :--- |
${spec.toleranceTable.map(t => `| **${t.connection}** | ${t.nominalSize} | \`${t.tolerance}\` | ${t.fitType} |`).join('\n')}

---

## 3. CƠ CHẾ TƯƠNG TÁC 3D TRONG MÔI TRƯỜNG MÔ PHỎNG (INTERACTION MODEL)

### 3.1. Các điểm bắt dính thông minh (Smart Snap Points / Mount Ports)
${spec.snapPoints.map(s => `- **Cổng \`${s.name}\`**: Tọa độ cục bộ \`${s.position}\` | Loại cổng: \`${s.type}\` | Hướng pháp tuyến: \`${s.direction}\` | Tương thích ghép nối: \`${s.compatibleWith}\``).join('\n')}

### 3.2. Bậc tự do chuyển động (Degrees of Freedom - DOF)
${spec.dof}

### 3.3. Thao tác điều khiển người dùng (User Interactions)
${spec.userActions}

### 3.4. Vùng va chạm & Hitbox Raycasting
${spec.hitboxes}

---

## 4. BỘ ĐIỀU KHIỂN NỘI TẠI, BIẾN TRẠNG THÁI & PHẢN HỒI ĐA GIÁC QUAN

### 4.1. Bảng danh mục biến trạng thái (State Machine Model)
| Tên biến trạng thái | Kiểu dữ liệu | Miền giá trị | Mặc định | Mô tả ý nghĩa vật lý |
| :--- | :---: | :---: | :---: | :--- |
${spec.states.map(st => `| \`${st.variable}\` | \`${st.type}\` | \`${st.range}\` | \`${st.defaultVal}\` | ${st.description} |`).join('\n')}

### 4.2. Logic tính toán & Bộ giải mô phỏng (Internal Physics Solver Logic)
${spec.solverLogic}

### 4.3. Phản hồi trực quan thị giác (Visual Feedback)
${spec.visualFeedback}

### 4.4. Phản hồi thính giác & Âm thanh thực tế (Audio Feedback Cues)
${spec.audioFeedback}

---

## 5. ĐIỀU KIỆN BIÊN VẬT LÝ, RÀNG BUỘC AN TOÀN & CẢNH BÁO SƯ PHẠM

### 5.1. Giới hạn hoạt động định mức an toàn
${spec.operatingLimits}

### 5.2. Các kịch bản lỗi thao tác thực hành (Common User Error Modes)
| Thao tác sai lầm của người học | Hậu quả vật lý mô phỏng trực quan | Cảnh báo sư phạm & Biện pháp khắc phục |
| :--- | :--- | :--- |
${spec.failureModes.map(f => `| **${f.errorAction}** | ${f.physicalConsequence} | ${f.pedagogicalWarning} |`).join('\n')}

---

## 6. KIẾN TRÚC MÔ HÌNH HÓA THREE.JS & ĐẶC TẢ VẬT LIỆU PBR

### 6.1. Cây phân cấp đối tượng 3D (Object3D Scene Graph Hierarchy)
\`\`\`text
${spec.sceneGraphHierarchy}
\`\`\`

### 6.2. Vị trí điểm gốc quay (Pivot Point Placement)
${spec.pivotPlacement}

### 6.3. Bảng tham số vật liệu PBR Three.js (\`MeshStandardMaterial\` / \`MeshPhysicalMaterial\`)
| Bộ phận mesh | Loại vật liệu Three.js | Tham số PBR cấu hình | Hiệu ứng thị giác hiển thị |
| :--- | :---: | :--- | :--- |
${spec.materialsTable.map(m => `| **${m.meshPart}** | \`${m.materialType}\` | \`${m.pbrParams}\` | ${m.visualAppearance} |`).join('\n')}

---
*(Báo cáo nghiên cứu sâu được chuẩn hóa cho OpenLab 3D - Hệ thống phòng thí nghiệm ảo chuẩn giáo dục phổ thông Việt Nam)*
`;
}

function toSlugVi(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

async function main() {
  const targetDirDocs = path.resolve('docs/specs_khtn8');
  const targetDirArtifacts = path.resolve('C:/Users/ltlie/.gemini/antigravity/brain/3dc5990b-b632-49e3-8514-1c23f148451a/specs_khtn8');

  if (!fs.existsSync(targetDirDocs)) {
    fs.mkdirSync(targetDirDocs, { recursive: true });
  }
  if (!fs.existsSync(targetDirArtifacts)) {
    fs.mkdirSync(targetDirArtifacts, { recursive: true });
  }

  let indexContent = `# MỤC LỤC TỔNG HỢP: 23 BÁO CÁO NGHIÊN CỨU SÂU THIẾT BỊ KHTN 8\n\n`;
  indexContent += `*Chuẩn thiết bị dạy học tối thiểu THCS (Thông tư 38/2021/TT-BGDĐT) - Hệ thống phòng thí nghiệm ảo OpenLab 3D*\n\n`;
  indexContent += `| STT | Tên dụng cụ | Phân môn | Tệp đặc tả chi tiết | Kích thước thực tế | Điểm tương tác chính |\n`;
  indexContent += `| :---: | :--- | :--- | :--- | :--- | :--- |\n`;

  for (const spec of specs) {
    const mdContent = generateMarkdown(spec);
    
    // Naming variations to guarantee 100% exact match
    const fileIdName = `${spec.stt}_${spec.id.replace(/-/g, '_')}.md`;
    const fileViSlug = `${spec.stt}_${toSlugVi(spec.nameVi)}.md`;
    const fileViFull = `${spec.stt}_${spec.nameVi.replace(/[\/\\?%*:|"<>]/g, '_')}.md`;

    const allFileNames = [fileIdName, fileViSlug, fileViFull];

    for (const fName of allFileNames) {
      fs.writeFileSync(path.join(targetDirDocs, fName), mdContent, 'utf-8');
      fs.writeFileSync(path.join(targetDirArtifacts, fName), mdContent, 'utf-8');
    }

    const primaryDocLink = path.join(targetDirDocs, fileViSlug).replace(/\\/g, '/');
    indexContent += `| **${spec.stt}** | **${spec.nameVi}** | ${spec.discipline.split('-')[0].trim()} | [${fileViSlug}](file:///${primaryDocLink}) | \`${spec.dimensionsTable[0]?.dimensionMm || 'N/A'}\` | ${spec.snapPoints.length} cổng snap, ${spec.states.length} biến |\n`;
    console.log(`Generated: ${fileViSlug} & ${fileViFull}`);
  }

  fs.writeFileSync(path.join(targetDirDocs, '00_INDEX_KHTN8_SPECS.md'), indexContent, 'utf-8');
  fs.writeFileSync(path.join(targetDirArtifacts, '00_INDEX_KHTN8_SPECS.md'), indexContent, 'utf-8');
  console.log(`Successfully generated all 23 equipment deep specification reports with full naming variations!`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
