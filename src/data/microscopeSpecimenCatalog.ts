/**
 * Danh mục mẫu vật tiêu bản kính hiển vi quang học - Chương trình KHTN THCS (Lớp 6, 7, 8, 9)
 * Tuân thủ chuẩn kiến thức Sinh học & KHTN Bộ GD&ĐT (Chương trình GDPT 2018)
 */

export type SpecimenCategory =
  | 'protozoa' // Động vật đơn bào
  | 'plant_cells' // Tế bào thực vật
  | 'animal_cells' // Tế bào động vật
  | 'algae' // Tảo
  | 'microorganisms'; // Vi sinh vật

export interface StructureAnnotation {
  id: string;
  nameVi: string;
  nameScientific?: string;
  xPercent: number; // Tọa độ tương đối trong trường nhìn mẫu vật (-50% đến 50%)
  yPercent: number;
  descriptionVi: string;
  minObjective: number; // Mức vật kính tối thiểu để quan sát rõ cấu trúc này
}

export interface SpecimenDefinition {
  id: string;
  nameVi: string;
  scientificName: string;
  category: SpecimenCategory;
  categoryNameVi: string;
  sizeMinUm: number;
  sizeMaxUm: number;
  lengthUmText: string;
  widthUmText: string;
  recommendedObjectives: number[]; // [4, 10, 40]
  optimalObjective: number; // 10 hoặc 40
  requiresOilImmersion?: boolean;
  // Thông số quang học & khoảng lấy nét riêng cho từng mẫu vật KHTN
  optimalFocusZ: number; // Tiêu cự chuẩn z0 (mm), ví dụ 5.00mm, 5.18mm, 4.85mm
  focalToleranceMm: number; // Chiều sâu trường ảnh dung sai nét DoF (mm)
  optimalBrightness: number; // Độ sáng đèn LED tối ưu (0.0 đến 1.0)
  optimalDiaphragm: number; // Khẩu độ màng chắn sáng Abbe tối ưu (0.1 đến 1.0)
  focusingGuidanceVi: string; // Hướng dẫn thao tác lấy nét cụ thể cho từng mẫu vật
  curriculumLessonVi: string;
  curriculumGrade: 6 | 7 | 8 | 9;
  stainTypeVi: string; // Dung dịch Lugol / Xanh Methylene / Nước cất / Giọt nước ao
  descriptionVi: string;
  morphologyVi: string;
  visibleStructures: string[];
  annotations: StructureAnnotation[];
  preparationSteps: string[];
  scientificNotes: string;
  unsuitableWarning?: {
    mag: number;
    message: string;
  }[];
  // Màu nền và chi tiết đồ họa tế bào cho mô phỏng quang học
  stainTint: string;
  renderType:
    | 'paramecium'
    | 'amoeba'
    | 'euglena'
    | 'onion_epidermis'
    | 'leaf_stomata'
    | 'cheek_epithelium'
    | 'spirogyra'
    | 'lactobacillus';
}

export const MICROSCOPE_SPECIMENS: SpecimenDefinition[] = [
  // 1. ĐỘNG VẬT ĐƠN BÀO: TRÙNG GIÀY
  {
    id: 'spc-paramecium',
    nameVi: 'Trùng giày',
    scientificName: 'Paramecium caudatum',
    category: 'protozoa',
    categoryNameVi: 'Động vật đơn bào',
    sizeMinUm: 180,
    sizeMaxUm: 290,
    lengthUmText: '180 – 290 µm',
    widthUmText: '50 – 80 µm',
    recommendedObjectives: [10, 40],
    optimalObjective: 10,
    optimalFocusZ: 5.0,
    focalToleranceMm: 0.035,
    optimalBrightness: 0.7,
    optimalDiaphragm: 0.45,
    focusingGuidanceVi:
      'Quan sát ở vật kính 10× trước để tìm cá thể trùng giày đang bơi quanh sợi bông. Khép nhỏ màng chắn sáng (0.4–0.5) để tạo tương phản nhìn rõ lông bơi (cilia) và không bào co bóp, sau đó chuyển sang 40× và dùng ốc tinh điều chỉnh nhẹ ±0.03 mm.',
    curriculumLessonVi: 'KHTN 6 · Bài 12: Thực hành quan sát sinh vật đơn bào',
    curriculumGrade: 6,
    stainTypeVi: 'Nước rơm/cỏ ngâm (tiêu bản sống, chặn bằng sợi bông)',
    descriptionVi:
      'Cơ thể hình đế giày, chuyển động xoay quanh trục dọc nhờ hệ thống lông bơi bao quanh. Trong tế bào chất có nhân lớn, nhân nhỏ, rãnh miệng dẫn vào hầu và hai không bào co bóp hình hoa cúc ở hai đầu phập phồng bài tiết.',
    morphologyVi: 'Cơ thể hình thoi dài, đầu trước tròn tù, đầu sau hơi thuôn nhọn giống đế chiếc giày.',
    visibleStructures: [
      'Lông bơi (Cilia)',
      'Màng tế bào (Pellicle)',
      'Rãnh miệng (Oral groove)',
      'Không bào co bóp hình hoa (Contractile vacuoles)',
      'Nhân lớn (Macronucleus)',
      'Không bào tiêu hóa (Food vacuoles)',
    ],
    annotations: [
      {
        id: 'cilia',
        nameVi: 'Lông bơi bao quanh',
        xPercent: -34,
        yPercent: -22,
        descriptionVi: 'Hàng nghìn lông bơi rung động nhịp nhàng giúp trùng giày vừa bơi vừa xoay tròn trong nước.',
        minObjective: 10,
      },
      {
        id: 'oral-groove',
        nameVi: 'Rãnh miệng',
        xPercent: -8,
        yPercent: 2,
        descriptionVi: 'Rãnh lõm xiên chứa các lông rung cuốn vi khuẩn và vụn hữu cơ vào sâu bên trong tế bào.',
        minObjective: 10,
      },
      {
        id: 'macronucleus',
        nameVi: 'Nhân lớn (Macronucleus)',
        xPercent: 12,
        yPercent: -6,
        descriptionVi: 'Điều khiển toàn bộ các hoạt động sống và trao đổi chất của tế bào đơn bào.',
        minObjective: 40,
      },
      {
        id: 'contractile-vacuole',
        nameVi: 'Không bào co bóp',
        xPercent: 28,
        yPercent: -26,
        descriptionVi: 'Thu gom nước thừa và chất bã, co bóp theo chu kỳ hình hoa cúc để thải ra ngoài cơ thể.',
        minObjective: 40,
      },
      {
        id: 'food-vacuole',
        nameVi: 'Không bào tiêu hóa',
        xPercent: -14,
        yPercent: 18,
        descriptionVi: 'Các bọng nhỏ di chuyển dọc cơ thể để tiêu hóa thức ăn nội bào nhờ enzyme.',
        minObjective: 10,
      },
    ],
    preparationSteps: [
      '1. Dùng ống nhỏ giọt hút 1 giọt nước ở tầng mặt lọ nuôi cấy rơm/cỏ ngâm lâu ngày.',
      '2. Nhỏ giọt nước vào chính giữa lam kính sạch.',
      '3. Thêm vài sợi bông gòn y tế mỏng lên giọt nước nhằm giới hạn tốc độ bơi của trùng giày.',
      '4. Đặt lamen nghiêng 45° rồi từ từ hạ xuống để bọt khí thoát hết ra ngoài.',
      '5. Dùng giấy thấm hút nhẹ phần nước tràn ra ngoài mép lamen, đặt lên bàn kính hiển vi.',
    ],
    scientificNotes:
      'Trùng giày bơi rất nhanh (~1.5 mm/s), việc thêm sợi bông tạo thành mạng lưới giữ chân tế bào là kỹ thuật thực hành bắt buộc trong SGK KHTN 6.',
    unsuitableWarning: [
      {
        mag: 1000,
        message: 'Ở độ phóng đại 1000x, trùng giày dài 250 µm sẽ tràn khỏi trường nhìn (180 µm). Nên dùng vật kính 10x hoặc 40x.',
      },
    ],
    stainTint: 'rgba(235, 245, 255, 0.45)',
    renderType: 'paramecium',
  },

  // 2. ĐỘNG VẬT ĐƠN BÀO: TRÙNG BIẾN HÌNH (AMIP)
  {
    id: 'spc-amoeba',
    nameVi: 'Trùng biến hình (Amip)',
    scientificName: 'Amoeba proteus',
    category: 'protozoa',
    categoryNameVi: 'Động vật đơn bào',
    sizeMinUm: 220,
    sizeMaxUm: 550,
    lengthUmText: '220 – 550 µm',
    widthUmText: '120 – 350 µm (thay đổi liên tục)',
    recommendedObjectives: [10, 40],
    optimalObjective: 10,
    optimalFocusZ: 5.02,
    focalToleranceMm: 0.03,
    optimalBrightness: 0.65,
    optimalDiaphragm: 0.4,
    focusingGuidanceVi:
      'Do trùng biến hình trong suốt không màu, hãy khép màng chắn sáng về 0.35–0.45 để nổi rõ viền chân giả (pseudopodia). Điều chỉnh ốc vi cấp chậm rãi để nhận biết màng tế bào đang đẩy chân giả chuyển động.',
    curriculumLessonVi: 'KHTN 6 · Bài 12: Tế bào – Đơn vị cơ sở của sự sống',
    curriculumGrade: 6,
    stainTypeVi: 'Tiêu bản sống ngập nước ao',
    descriptionVi:
      'Cơ thể đơn bào không có hình dạng cố định. Chuyển động và bắt mồi bằng chân giả do dòng chất nguyên sinh liên tục dồn đẩy từ nội chất sang ngoại chất.',
    morphologyVi: 'Hình thù bất định với nhiều thùy chân giả nhô ra co vào liên tục.',
    visibleStructures: [
      'Chân giả (Pseudopodia)',
      'Ngoại chất trong suốt (Ectoplasm)',
      'Nội chất chứa hạt mịn (Endoplasm)',
      'Nhân tròn (Nucleus)',
      'Không bào co bóp (Contractile vacuole)',
      'Bọng thức ăn tiêu hóa',
    ],
    annotations: [
      {
        id: 'pseudopod',
        nameVi: 'Chân giả đang vươn ra',
        xPercent: -32,
        yPercent: -20,
        descriptionVi: 'Chân giả do khối chất nguyên sinh dồn về một hướng giúp trùng bò chậm chạp trên giá thể.',
        minObjective: 10,
      },
      {
        id: 'ectoplasm',
        nameVi: 'Ngoại chất (lớp ngoài trong suốt)',
        xPercent: -18,
        yPercent: -34,
        descriptionVi: 'Lớp màng nguyên sinh chất không hạt bao bọc ngoài cùng của amip.',
        minObjective: 40,
      },
      {
        id: 'nucleus',
        nameVi: 'Nhân tế bào',
        xPercent: 10,
        yPercent: 4,
        descriptionVi: 'Khối nhân hình đĩa hoặc cầu nằm trôi bồng bềnh trong nội chất tế bào.',
        minObjective: 40,
      },
      {
        id: 'contractile-amoeba',
        nameVi: 'Không bào co bóp',
        xPercent: 24,
        yPercent: -16,
        descriptionVi: 'Bọng chứa nước trong suốt thực hiện chức năng điều hòa áp suất thẩm thấu.',
        minObjective: 10,
      },
    ],
    preparationSteps: [
      '1. Hút cặn bùn đáy hoặc váng nổi trong chậu nuôi cỏ nước ao.',
      '2. Nhỏ 1 giọt lên lam kính, đậy lamen nhẹ nhàng tránh làm bẹp tế bào trùng biến hình.',
      '3. Tìm kiếm dưới vật kính 10x với nguồn sáng vừa phải để phát hiện khối nguyên sinh chất trong suốt.',
    ],
    scientificNotes:
      'Do cơ thể trùng biến hình rất trong suốt, cần khép bớt màn chắn sáng (khẩu độ) để tăng độ tương phản chi tiết tế bào.',
    unsuitableWarning: [
      {
        mag: 1000,
        message: 'Trùng biến hình kích thước lớn (trên 300 µm), quan sát tốt nhất ở 100x và 400x.',
      },
    ],
    stainTint: 'rgba(230, 248, 245, 0.4)',
    renderType: 'amoeba',
  },

  // 3. ĐỘNG VẬT ĐƠN BÀO: TRÙNG ROI XANH
  {
    id: 'spc-euglena',
    nameVi: 'Trùng roi xanh',
    scientificName: 'Euglena viridis',
    category: 'protozoa',
    categoryNameVi: 'Động vật đơn bào',
    sizeMinUm: 45,
    sizeMaxUm: 65,
    lengthUmText: '45 – 65 µm',
    widthUmText: '12 – 18 µm',
    recommendedObjectives: [40, 100],
    optimalObjective: 40,
    optimalFocusZ: 4.98,
    focalToleranceMm: 0.025,
    optimalBrightness: 0.75,
    optimalDiaphragm: 0.55,
    focusingGuidanceVi:
      'Tìm kiếm các chấm xanh lục thoi dài ở 10×, chuyển sang 40× và tinh chỉnh tiêu cự để bắt trọn điểm mắt đỏ ở đầu trước và roi bơi mảnh mai đang xoáy.',
    curriculumLessonVi: 'KHTN 6 · Bài 12: Thực hành quan sát trùng roi xanh',
    curriculumGrade: 6,
    stainTypeVi: 'Tiêu bản nước ao có ánh sáng mặt trời',
    descriptionVi:
      'Cơ thể hình thoi thon nhọn ở đuôi. Đầu có một roi dài vận động và điểm mắt màu đỏ cảm nhận ánh sáng. Trong tế bào chất có nhiều hạt diệp lục xanh lục quang hợp tự dưỡng.',
    morphologyVi: 'Hình thoi nhọn, đầu trước tròn có vết lõm sâu mang roi, đuôi nhọn hoắt.',
    visibleStructures: [
      'Roi bơi dài (Flagellum)',
      'Điểm mắt đỏ (Stigma / Eyespot)',
      'Hạt diệp lục hình đĩa (Chloroplasts)',
      'Nhân tròn ở giữa (Nucleus)',
      'Màng sinh chất đàn hồi (Pellicle)',
    ],
    annotations: [
      {
        id: 'flagellum',
        nameVi: 'Roi bơi (Flagellum)',
        xPercent: -36,
        yPercent: -12,
        descriptionVi: 'Roi xoáy theo hình trôn ốc kéo toàn bộ cơ thể trùng roi tiến về phía trước.',
        minObjective: 40,
      },
      {
        id: 'eyespot',
        nameVi: 'Điểm mắt đỏ (Stigma)',
        xPercent: -22,
        yPercent: -8,
        descriptionVi: 'Chứa sắc tố carotenoid màu đỏ cam nhạy cảm giúp trùng roi hướng về nơi có ánh sáng mặt trời.',
        minObjective: 40,
      },
      {
        id: 'chloroplasts-euglena',
        nameVi: 'Hạt diệp lục (Chloroplasts)',
        xPercent: 6,
        yPercent: 12,
        descriptionVi: 'Thực hiện quang hợp tổng hợp tinh bột paramylon khi ở ngoài ánh sáng.',
        minObjective: 10,
      },
      {
        id: 'nucleus-euglena',
        nameVi: 'Nhân tế bào',
        xPercent: 16,
        yPercent: -4,
        descriptionVi: 'Nhân hình tròn nằm hơi lệch về phía sau cơ thể.',
        minObjective: 40,
      },
    ],
    preparationSteps: [
      '1. Lấy mẫu váng nước xanh mặt ao hồ vào ống nghiệm.',
      '2. Nhỏ một giọt mẫu lên lam kính.',
      '3. Đậy lamen và quan sát với vật kính 10x để định vị cá thể, sau đó chuyển sang 40x để thấy rõ điểm mắt và roi.',
    ],
    scientificNotes:
      'Trùng roi xanh có lối dinh dưỡng hỗn dưỡng: quang dưỡng khi có ánh sáng và dị dưỡng khi ở trong bóng tối.',
    stainTint: 'rgba(230, 255, 235, 0.45)',
    renderType: 'euglena',
  },

  // 4. TẾ BÀO THỰC VẬT: BIỂU BÌ VẢY HÀNH
  {
    id: 'spc-onion-epidermis',
    nameVi: 'Tế bào biểu bì vảy hành',
    scientificName: 'Allium cepa epidermis',
    category: 'plant_cells',
    categoryNameVi: 'Tế bào thực vật',
    sizeMinUm: 180,
    sizeMaxUm: 380,
    lengthUmText: '200 – 380 µm',
    widthUmText: '50 – 85 µm',
    recommendedObjectives: [10, 40],
    optimalObjective: 10,
    optimalFocusZ: 5.18,
    focalToleranceMm: 0.02,
    optimalBrightness: 0.85,
    optimalDiaphragm: 0.65,
    focusingGuidanceVi:
      'Biểu bì hành có vách tế bào xenlulôzơ dày hình lục lăng xếp khít. Vặn ốc thô đến khoảng 5.15–5.20 mm, sau đó dùng ốc vi cấp (tinh) lăn nhẹ để làm sắc nét nhân tế bào bắt màu nâu cánh gián của thuốc nhuộm Lugol.',
    curriculumLessonVi: 'KHTN 6 · Bài 12: Thực hành quan sát tế bào thực vật (vảy hành tây)',
    curriculumGrade: 6,
    stainTypeVi: 'Nhuộm dung dịch Lugol (Iodine 1%)',
    descriptionVi:
      'Các tế bào hình hộp đa giác kéo dài xếp sít nhau như bức tường gạch. Có thành tế bào xenlulozo dày dặn rõ nét, không bào trung tâm khổng lồ và nhân tròn bắt màu nâu sẫm của dung dịch Lugol.',
    morphologyVi: 'Mô biểu bì gồm các tế bào hình lăng trụ lục giác ghép khít nhau liên tục.',
    visibleStructures: [
      'Thành tế bào (Cell wall)',
      'Màng sinh chất (Cell membrane)',
      'Tế bào chất (Cytoplasm)',
      'Nhân tế bào nhuộm Lugol (Nucleus)',
      'Không bào trung tâm lớn (Large central vacuole)',
    ],
    annotations: [
      {
        id: 'cell-wall',
        nameVi: 'Thành tế bào xenlulozo',
        xPercent: -22,
        yPercent: -28,
        descriptionVi: 'Vách ngăn bằng cellulose cứng cáp xác định và duy trì hình dạng cố định của tế bào thực vật.',
        minObjective: 4,
      },
      {
        id: 'onion-nucleus',
        nameVi: 'Nhân tế bào bắt màu Lugol',
        xPercent: 12,
        yPercent: 8,
        descriptionVi: 'Nhân hình cầu bị không bào đẩy ép nằm sát về phía thành tế bào, bắt màu nâu vàng đậm với iot.',
        minObjective: 10,
      },
      {
        id: 'central-vacuole',
        nameVi: 'Không bào trung tâm',
        xPercent: -6,
        yPercent: -2,
        descriptionVi: 'Chiếm tới 80% thể tích tế bào, chứa đầy dịch tế bào dự trữ nước và muối khoáng.',
        minObjective: 10,
      },
      {
        id: 'cytoplasm-strand',
        nameVi: 'Dải tế bào chất',
        xPercent: 28,
        yPercent: -14,
        descriptionVi: 'Lớp mỏng nguyên sinh chất bao quanh nhân và áp sát màng tế bào.',
        minObjective: 40,
      },
    ],
    preparationSteps: [
      '1. Tách một vảy củ hành tây hoặc hành tím tươi.',
      '2. Dùng kim mũi mác hoặc nhíp nhọn bóc lấy một màng biểu bì cực mỏng ở mặt trong cong lõm của vảy hành.',
      '3. Đặt màng biểu bì lên lam kính có sẵn một giọt nước cất, trải phẳng tuyệt đối không để bị gấp nếp.',
      '4. Nhỏ 1 giọt dung dịch Lugol (hoặc cồn iot) lên màng mẫu.',
      '5. Đậy lamen nghiêng 45° từ từ hạ xuống, dùng giấy thấm hút sạch dung dịch thừa ở rìa.',
    ],
    scientificNotes:
      'Tế bào vảy hành nằm dưới lòng đất nên không có lục lạp; muốn quan sát lục lạp thực vật cần soi tế bào lá cây thài lài hoặc rong đuôi chó.',
    unsuitableWarning: [
      {
        mag: 1000,
        message: 'Tế bào biểu bì hành rất dài (~300 µm), phóng đại 1000x chỉ thấy một góc nhỏ thành tế bào.',
      },
    ],
    stainTint: 'rgba(254, 240, 205, 0.55)',
    renderType: 'onion_epidermis',
  },

  // 5. TẾ BÀO THỰC VẬT: KHÍ KHỔNG VÀ LỤC LẠP LÁ CÂY
  {
    id: 'spc-leaf-stomata',
    nameVi: 'Khí khổng và Lục lạp lá cây',
    scientificName: 'Tradescantia leaf stomata & chloroplasts',
    category: 'plant_cells',
    categoryNameVi: 'Tế bào thực vật',
    sizeMinUm: 25,
    sizeMaxUm: 45,
    lengthUmText: '30 – 42 µm',
    widthUmText: '18 – 26 µm',
    recommendedObjectives: [10, 40],
    optimalObjective: 40,
    optimalFocusZ: 5.12,
    focalToleranceMm: 0.022,
    optimalBrightness: 0.8,
    optimalDiaphragm: 0.6,
    focusingGuidanceVi:
      'Quan sát 2 tế bào hình hạt đậu quay mặt lõm vào nhau tạo khe khí khổng. Điều chỉnh ốc vi cấp để nhìn rõ các hạt diệp lục màu lục đậm nằm bên trong tế bào hạt đậu.',
    curriculumLessonVi: 'KHTN 7 · Bài 22: Quang hợp và Trao đổi khí qua khí khổng',
    curriculumGrade: 7,
    stainTypeVi: 'Tiêu bản tươi ngâm nước cất (biểu bì lá thài lài tía)',
    descriptionVi:
      'Cặp tế bào hình hạt đậu (tế bào bảo vệ) áp sát nhau tạo thành khe khí khổng. Bên trong tế bào bảo vệ chứa dày đặc các hạt lục lạp màu xanh lục lấp lánh và nhân tế bào.',
    morphologyVi: 'Hai tế bào hình chữ C / hạt đậu úp vào nhau tạo thành khe khí khổng có thể đóng mở.',
    visibleStructures: [
      'Tế bào bảo vệ hình hạt đậu (Guard cells)',
      'Lỗ khí khổng (Stoma pore)',
      'Hạt lục lạp màu xanh lá (Chloroplasts)',
      'Tế bào biểu bì phụ cận (Epidermal cells)',
      'Vách tế bào mép trong dày',
    ],
    annotations: [
      {
        id: 'guard-cell',
        nameVi: 'Tế bào bảo vệ hình hạt đậu',
        xPercent: -18,
        yPercent: -16,
        descriptionVi: 'Cặp tế bào chuyên hóa có mép trong dày và mép ngoài mỏng giúp đóng mở khe khí.',
        minObjective: 10,
      },
      {
        id: 'stoma-pore',
        nameVi: 'Khe khí khổng',
        xPercent: 0,
        yPercent: 0,
        descriptionVi: 'Lỗ hở cho khí CO2 đi vào phục vụ quang hợp và thoát hơi nước ra ngoài môi trường.',
        minObjective: 10,
      },
      {
        id: 'chloroplast-leaf',
        nameVi: 'Hạt lục lạp (Chloroplasts)',
        xPercent: 18,
        yPercent: -14,
        descriptionVi: 'Bào quan chứa chất diệp lục hấp thụ năng lượng ánh sáng mặt trời trong quá trình quang hợp.',
        minObjective: 40,
      },
      {
        id: 'subsidiary-cell',
        nameVi: 'Tế bào biểu bì phụ cận',
        xPercent: 32,
        yPercent: 24,
        descriptionVi: 'Các tế bào bao quanh không chứa hạt lục lạp, có sắc tố tím anthocyanin ở thài lài tía.',
        minObjective: 10,
      },
    ],
    preparationSteps: [
      '1. Chọn lá thài lài tía hoặc lá lẻ bạn tươi.',
      '2. Gập mặt dưới lá và xé nhẹ theo đường xiên để tạo một màng biểu bì mỏng màu tím nhạt.',
      '3. Dùng kéo cắt lấy một mẩu biểu bì nhỏ 3x3 mm đặt lên giọt nước trên lam kính.',
      '4. Đậy lamen, thấm nước thừa và đưa lên kính hiển vi quan sát.',
    ],
    scientificNotes:
      'Khí khổng phân bố tập trung chủ yếu ở mặt dưới của lá giúp hạn chế mất nước do ánh nắng hun nóng trực tiếp.',
    stainTint: 'rgba(235, 255, 240, 0.45)',
    renderType: 'leaf_stomata',
  },

  // 6. TẾ BÀO ĐỘNG VẬT: TẾ BÀO NIÊM MẠC MIỆNG
  {
    id: 'spc-cheek-epithelium',
    nameVi: 'Tế bào niêm mạc miệng người',
    scientificName: 'Human buccal epithelial cells',
    category: 'animal_cells',
    categoryNameVi: 'Tế bào động vật',
    sizeMinUm: 50,
    sizeMaxUm: 75,
    lengthUmText: '50 – 75 µm',
    widthUmText: '40 – 60 µm',
    recommendedObjectives: [10, 40],
    optimalObjective: 40,
    optimalFocusZ: 4.92,
    focalToleranceMm: 0.018,
    optimalBrightness: 0.8,
    optimalDiaphragm: 0.58,
    focusingGuidanceVi:
      'Tế bào biểu mô dẹt hình đa giác đứng rời rạc hoặc từng đám. Dùng ốc vi cấp chỉnh tiêu cự chính xác tại 4.92 mm để thấy rõ màng sinh chất mỏng mảnh và nhân tế bào tròn bắt màu xanh đậm Methylene ở trung tâm.',
    curriculumLessonVi: 'KHTN 6 · Bài 12: Thực hành quan sát tế bào động vật (niêm mạc má)',
    curriculumGrade: 6,
    stainTypeVi: 'Nhuộm dung dịch Xanh Methylene (Methylene blue 1%)',
    descriptionVi:
      'Các tế bào dẹt hình đa giác mép hơi gợn sóng xếp rời rạc hoặc dính cụm vài tế bào. Không có thành tế bào cellulose dày, chỉ có màng tế bào mỏng, tế bào chất hạt mịn và nhân hình cầu tròn bắt màu xanh đậm rực rỡ.',
    morphologyVi: 'Tế bào dẹt mỏng, hình đa giác lượn sóng bất quy tắc, có nhân tròn nằm giữa.',
    visibleStructures: [
      'Màng sinh chất mềm dẻo (Cell membrane)',
      'Tế bào chất mịn có hạt (Cytoplasm)',
      'Nhân tế bào nhuộm xanh (Nucleus)',
      'Hạt nhân (Nucleolus)',
    ],
    annotations: [
      {
        id: 'cheek-membrane',
        nameVi: 'Màng sinh chất (Màng tế bào)',
        xPercent: -26,
        yPercent: -18,
        descriptionVi: 'Màng sinh chất mềm mại linh hoạt, không có thành tế bào bao bọc như ở tế bào thực vật.',
        minObjective: 10,
      },
      {
        id: 'cheek-nucleus',
        nameVi: 'Nhân tế bào bắt màu xanh Metylen',
        xPercent: 2,
        yPercent: -2,
        descriptionVi: 'Nhân hình cầu chứa vật chất di truyền DNA bắt màu kiềm xanh tím rất đậm và rõ ràng.',
        minObjective: 10,
      },
      {
        id: 'cheek-cytoplasm',
        nameVi: 'Tế bào chất hạt mịn',
        xPercent: 18,
        yPercent: 18,
        descriptionVi: 'Chứa các bào quan ty thể, ribosome lơ lửng trong dịch bào keo.',
        minObjective: 40,
      },
    ],
    preparationSteps: [
      '1. Dùng nước lọc súc sạch khoang miệng trước khi lấy mẫu.',
      '2. Dùng que tăm sạch/vô trùng cạo thật nhẹ vào mặt trong của má.',
      '3. Khuấy nhẹ đầu tăm chứa chất cặn vào giọt nước muối sinh lý 0.9% trên lam kính.',
      '4. Nhỏ 1 giọt dung dịch Xanh Methylene 1% vào vùng huyền phù tế bào.',
      '5. Đậy lamen nghiêng 45°, thấm bớt dịch thừa và đặt lên bàn kính hiển vi.',
    ],
    scientificNotes:
      'Thuốc nhuộm Xanh Methylene có tính base ái lực cực mạnh với acid nucleic trong nhân tế bào, giúp nhân hiện rõ màu xanh thẫm.',
    stainTint: 'rgba(230, 240, 255, 0.5)',
    renderType: 'cheek_epithelium',
  },

  // 7. TẢO: TẢO XOẮN (SPIROGYRA)
  {
    id: 'spc-spirogyra',
    nameVi: 'Tảo xoắn',
    scientificName: 'Spirogyra crassa',
    category: 'algae',
    categoryNameVi: 'Tảo nước ngọt',
    sizeMinUm: 20,
    sizeMaxUm: 40,
    lengthUmText: 'Sợi dài nhiều mm (đường kính sợi 25 – 35 µm)',
    widthUmText: 'Đường kính tế bào 25 – 35 µm, dài 60 – 150 µm',
    recommendedObjectives: [10, 40],
    optimalObjective: 40,
    optimalFocusZ: 5.08,
    focalToleranceMm: 0.028,
    optimalBrightness: 0.82,
    optimalDiaphragm: 0.6,
    focusingGuidanceVi:
      'Sợi tảo xoắn hình ống đa bào. Vặn ốc tinh qua lại để quét các lớp phẳng tiêu cự khác nhau, chiêm ngưỡng dải lục lạp xoắn ốc tuyệt đẹp chạy dọc từ đầu này đến đầu kia tế bào.',
    curriculumLessonVi: 'KHTN 6 · Bài 17: Đa dạng nguyên sinh vật – Nhóm Tảo lục',
    curriculumGrade: 6,
    stainTypeVi: 'Tiêu bản tươi sợi tảo nước ngọt ao hồ',
    descriptionVi:
      'Dạng sợi tơ đa bào trơn nhớt màu xanh lục. Mỗi tế bào hình trụ có một hoặc nhiều dải lục lạp hình dải băng xoắn ốc uốn lượn tuyệt đẹp chạy suốt chiều dài tế bào, đính các hạt tạo tinh bột (pyrenoid).',
    morphologyVi: 'Dạng sợi đơn phân nhánh hình ống trụ, vách ngăn ngang vuông góc.',
    visibleStructures: [
      'Dải lục lạp xoắn ốc (Spiral chloroplast ribbon)',
      'Hạt tạo tinh bột (Pyrenoids)',
      'Vách ngăn ngang giữa các tế bào (Septum)',
      'Nhân tế bào treo giữa dây nguyên sinh chất',
      'Thành tế bào phủ màng nhầy pectin',
    ],
    annotations: [
      {
        id: 'spiral-chloroplast',
        nameVi: 'Dải lục lạp xoắn ốc',
        xPercent: -12,
        yPercent: -10,
        descriptionVi: 'Dải băng diệp lục uốn lượn hình xoắn ốc như lò xo chạy dọc theo chu vi mặt trong tế bào.',
        minObjective: 10,
      },
      {
        id: 'pyrenoid',
        nameVi: 'Hạt tạo tinh bột (Pyrenoid)',
        xPercent: 4,
        yPercent: 12,
        descriptionVi: 'Các thể nhỏ hình hạt sáng đính dọc dải lục lạp chuyên hóa tổng hợp tinh bột dự trữ.',
        minObjective: 40,
      },
      {
        id: 'septum',
        nameVi: 'Vách ngăn ngang tế bào',
        xPercent: 32,
        yPercent: 0,
        descriptionVi: 'Vách ngăn đôi vuông góc phân chia sợi tảo thành các tế bào hình trụ liên tiếp.',
        minObjective: 10,
      },
      {
        id: 'spiro-nucleus',
        nameVi: 'Nhân tế bào lơ lửng',
        xPercent: 14,
        yPercent: -4,
        descriptionVi: 'Nhân nằm chính giữa tế bào, được treo bởi các sợi chất nguyên sinh mảnh.',
        minObjective: 40,
      },
    ],
    preparationSteps: [
      '1. Vớt một búi tảo tơ màu xanh mềm nhớt ở ao hồ cho vào cốc nước.',
      '2. Dùng kim mũi mác hoặc nhíp gắp vài sợi tảo đặt dọc lên lam kính.',
      '3. Nhỏ 1 giọt nước cất, tách các sợi rời nhau tránh để bị vón cục.',
      '4. Đậy lamen nhẹ nhàng và quan sát.',
    ],
    scientificNotes:
      'Chất nhầy trơn bao quanh sợi tảo giúp chúng không bị bám cặn bẩn và hạn chế bị các loài ăn cỏ nước ngọt tấn công.',
    stainTint: 'rgba(235, 255, 240, 0.45)',
    renderType: 'spirogyra',
  },

  // 8. VI SINH VẬT: TRỰC KHUẨN LACTOBACILLUS (LÊN MEN SỮA CHUA)
  {
    id: 'spc-lactobacillus',
    nameVi: 'Vi khuẩn lên men Lactic',
    scientificName: 'Lactobacillus bulgaricus',
    category: 'microorganisms',
    categoryNameVi: 'Vi sinh vật (Vi khuẩn)',
    sizeMinUm: 1.5,
    sizeMaxUm: 4.2,
    lengthUmText: '1.5 – 4.2 µm',
    widthUmText: '0.6 – 0.9 µm',
    recommendedObjectives: [40, 100],
    optimalObjective: 100,
    requiresOilImmersion: true,
    optimalFocusZ: 4.85,
    focalToleranceMm: 0.01,
    optimalBrightness: 0.92,
    optimalDiaphragm: 0.75,
    focusingGuidanceVi:
      'Vi khuẩn hình que que kích thước cực nhỏ (1–3 µm). Bắt buộc quan sát ở vật kính 40× hoặc 100× có dầu soi. Tuyệt đối không dùng ốc thô khi đang ở vật kính cao để tránh vỡ lam kính; chỉ dùng ốc vi cấp tinh chỉnh chậm từng vạch.',
    curriculumLessonVi: 'KHTN 6 · Bài 25: Vi khuẩn – Thực hành làm sữa chua và quan sát vi khuẩn',
    curriculumGrade: 6,
    stainTypeVi: 'Nhuộm Gram / Tím Gentian hoặc Đỏ Fuchsin (cần dầu soi)',
    descriptionVi:
      'Các trực khuẩn hình que ngắn bắt màu tím Gram dương xếp thành chuỗi đơn hoặc thành đôi. Kích thước cực kỳ nhỏ bé (1 - 4 µm), ở vật kính 10x chỉ thấy như chấm bụi li ti, cần vật kính 100x dầu soi mới nhìn rõ hình que.',
    morphologyVi: 'Trực khuẩn hình que thẳng hoặc hơi cong nhẹ, đầu tròn, xếp thành chuỗi ngắn.',
    visibleStructures: [
      'Trực khuẩn hình que (Bacillus cells)',
      'Chuỗi vi khuẩn nối tiếp',
      'Thành peptidoglycan bắt màu Gram tím',
      'Vùng nhân sơ (Nucleoid - kích thước siêu hiển vi)',
    ],
    annotations: [
      {
        id: 'lacto-rod',
        nameVi: 'Trực khuẩn hình que đơn lẻ',
        xPercent: -8,
        yPercent: -12,
        descriptionVi: 'Kích thước chỉ khoảng 2 µm, biến đổi đường lactose trong sữa thành acid lactic làm đông tụ sữa chua.',
        minObjective: 40,
      },
      {
        id: 'lacto-chain',
        nameVi: 'Chuỗi trực khuẩn liên kết',
        xPercent: 16,
        yPercent: 14,
        descriptionVi: 'Nhiều cá thể dính liền sau phân đôi tạo thành chuỗi đặc trưng của chi Lactobacillus.',
        minObjective: 100,
      },
    ],
    preparationSteps: [
      '1. Pha loãng 1 giọt sữa chua không đường với 10 giọt nước cất trong ống nghiệm.',
      '2. Dùng que cấy hoặc tăm chấm một giọt nhỏ dàn đều thành màng mỏng trên lam kính.',
      '3. Hơ nhẹ lam kính phía trên ngọn lửa đèn cồn 2 - 3 lần để cố định vi khuẩn (tránh làm cháy mẫu).',
      '4. Nhỏ thuốc nhuộm tím gentian hoặc đỏ Fuchsin lên vết bôi trong 1 - 2 phút.',
      '5. Rửa nhẹ lam kính dưới vòi nước chảy thật nhỏ, thấm khô nhẹ bằng giấy lọc.',
      '6. Nhỏ 1 giọt dầu soi (immersion oil) trực tiếp lên vết bôi và hạ vật kính 100x chạm sát giọt dầu.',
    ],
    scientificNotes:
      'Vi khuẩn có kích thước micrometer nhỏ hơn tế bào sinh vật nhân thực hàng chục đến hàng trăm lần; do đó ở vật kính 4x và 10x hoàn toàn không phân giải được hình dạng tế bào vi khuẩn.',
    unsuitableWarning: [
      {
        mag: 40,
        message: 'Ở vật kính 4x (40x), vi khuẩn kích thước 2 µm hoàn toàn không nhìn thấy (chỉ thấy bóng mờ đồng nhất). Hãy chuyển sang 400x hoặc 1000x dầu soi.',
      },
      {
        mag: 100,
        message: 'Ở vật kính 10x (100x), vi khuẩn chỉ hiện như những hạt bụi cực nhỏ. Cần dùng vật kính 40x hoặc 100x.',
      },
    ],
    stainTint: 'rgba(240, 230, 255, 0.45)',
    renderType: 'lactobacillus',
  },
];

/**
 * Bảng thông số quang học chuẩn hóa cho kính hiển vi học sinh KHTN THCS
 */
export interface ObjectiveLensSpec {
  mag: number;
  label: string;
  colorNameVi: string;
  colorHex: string;
  numericalAperture: number; // NA (Độ mở số)
  workingDistanceMm: number; // Khoảng cách làm việc (mm)
  fovDiameterUm: number; // Đường kính trường nhìn trên lam kính (µm)
  reticleScaleMicrons: number; // Chuẩn vạch chia thước đo thị kính (µm)
  depthOfFieldUm: number; // Độ sâu trường ảnh
  requiresOil: boolean;
}

export const OBJECTIVE_SPECS: Record<number, ObjectiveLensSpec> = {
  4: {
    mag: 4,
    label: '4× (Đỏ - Tìm trường nhìn)',
    colorNameVi: 'Đỏ',
    colorHex: '#ef4444',
    numericalAperture: 0.1,
    workingDistanceMm: 18.0,
    fovDiameterUm: 4500, // 4.5 mm
    reticleScaleMicrons: 500, // Thanh tỷ lệ 500 µm
    depthOfFieldUm: 15.0,
    requiresOil: false,
  },
  10: {
    mag: 10,
    label: '10× (Vàng - Vật kính nhỏ)',
    colorNameVi: 'Vàng',
    colorHex: '#eab308',
    numericalAperture: 0.25,
    workingDistanceMm: 7.0,
    fovDiameterUm: 1800, // 1.8 mm
    reticleScaleMicrons: 200, // Thanh tỷ lệ 200 µm
    depthOfFieldUm: 8.5,
    requiresOil: false,
  },
  40: {
    mag: 40,
    label: '40× (Xanh lam - Vật kính lớn)',
    colorNameVi: 'Xanh lam',
    colorHex: '#0284c7',
    numericalAperture: 0.65,
    workingDistanceMm: 0.65,
    fovDiameterUm: 450, // 450 µm
    reticleScaleMicrons: 50, // Thanh tỷ lệ 50 µm
    depthOfFieldUm: 1.2,
    requiresOil: false,
  },
  100: {
    mag: 100,
    label: '100× (Trắng - Vật kính dầu soi)',
    colorNameVi: 'Trắng',
    colorHex: '#f8fafc',
    numericalAperture: 1.25,
    workingDistanceMm: 0.18,
    fovDiameterUm: 180, // 180 µm
    reticleScaleMicrons: 20, // Thanh tỷ lệ 20 µm
    depthOfFieldUm: 0.4,
    requiresOil: true,
  },
};
