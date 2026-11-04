export interface WebSourceVerificationItem {
  siteName: string;
  domain: string;
  verifiedSpecSummary: string;
}

export interface EquipmentMultiSourceDossier {
  assetId: string;
  technicalStandard: string;
  exactDimensionsSpec: string;
  weightOrCapacitySpec: string;
  synthesizedFeatures: string[];
  fiveWebSources: [
    WebSourceVerificationItem,
    WebSourceVerificationItem,
    WebSourceVerificationItem,
    WebSourceVerificationItem,
    WebSourceVerificationItem,
  ];
}

export type MultiSourceEquipmentDossier = EquipmentMultiSourceDossier;

export const MULTI_SOURCE_EQUIPMENT_DOSSIERS: Record<
  string,
  EquipmentMultiSourceDossier
> = {
  'OL3D-EQP-BAL-0001': {
    assetId: 'OL3D-EQP-BAL-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · OIML Class II',
    exactDimensionsSpec:
      'Thân cân: 190 × 240 × 72 mm · Đĩa cân Inox 304: Ø 130 mm · Màn hình LCD 7 đoạn có đèn nền',
    weightOrCapacitySpec: 'GHĐ: 500 g (hoặc 600 g) · ĐCNN (Readability): 0.01 g',
    synthesizedFeatures: [
      'Cảm biến lực biến dạng (Loadcell) độ nhạy 0.01 g, thời gian ổn định kết quả ≤ 2 giây.',
      'Chức năng trừ bì (Phím TARE/ZERO) đưa màn hình về 0.00 g khi đặt cốc chứa chất lỏng.',
      'Đĩa cân thép không gỉ SUS304 tháo rời vệ sinh được, có chân ren chỉnh thăng bằng và bọt thủy.',
      'Hiển thị trực tiếp số gam trên màn hình LCD 3D và tự động khóa số đo khi vật đứng yên.',
    ],
    fiveWebSources: [
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Danh mục thiết bị dạy học tối thiểu KHTN THCS: Cân điện tử hiện số, độ chính xác 0.01g – 0.1g, có chức năng trừ bì.',
      },
      {
        siteName: 'Thiết bị Giáo dục VietValue',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Cân kỹ thuật phòng thí nghiệm THCS: Đĩa cân Ø 120–130 mm Inox, màn hình LCD xanh ngọc, phím TARE/MODE/ON-OFF.',
      },
      {
        siteName: 'Thiết bị Điện tử & Đo lường Việt Nam',
        domain: 'thietbidientu.net.vn',
        verifiedSpecSummary:
          'Kích thước máy chuẩn 190 × 240 × 75 mm, nguồn DC 6V/Pin AA, sai số lặp lại ±0.02 g.',
      },
      {
        siteName: 'DMKLab — Thiết bị Phòng thí nghiệm',
        domain: 'dmklab.vn',
        verifiedSpecSummary:
          'Cân kỹ thuật 2 số lẻ (0.01 g): Tích hợp chống quá tải cơ học và tự động hiệu chuẩn ngoại bằng quả cân chuẩn.',
      },
      {
        siteName: 'Innotec Việt Nam — Thiết bị Dạy học',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Cân điện tử thực hành KHTN: Vỏ nhựa ABS chống hóa chất, mặt hiển thị nghiêng 25° giúp học sinh dễ đọc góc nhìn thẳng.',
      },
    ],
  },

  'OL3D-EQP-CYL-0001': {
    assetId: 'OL3D-EQP-CYL-0001',
    technicalStandard: 'ISO 4788 · DIN 12680 · Thông tư 38/2021/TT-BGDĐT',
    exactDimensionsSpec:
      'Đường kính ngoài thân ống: Ø 31.0 mm · Chiều cao tổng thể: 250 mm · Đế lục giác rộng 64 mm',
    weightOrCapacitySpec: 'Dung tích danh định: 100 ml · ĐCNN: 1.0 ml · Sai số dung tích ±1.0 ml (ở 20 °C)',
    synthesizedFeatures: [
      'Thủy tinh Borosilicate 3.3 trong suốt, thành dày đều, có mỏ rót chống nhỏ giọt.',
      'Chân đế lục giác chống lăn khi đặt nằm và chống lật trên mặt bàn gỗ thí nghiệm.',
      'Vạch chia ml sắc nét từ 10 ml đến 100 ml (ĐCNN 1 ml), hiệu chuẩn chuẩn In (Ex/TD) ở 20 °C.',
      'Cho phép đọc mặt khum lõm của nước và đo thể tích vật rắn không thấm nước (ΔV = V₂ - V₁).',
    ],
    fiveWebSources: [
      {
        siteName: 'VietChem — Hóa chất & Dụng cụ Thí nghiệm',
        domain: 'vietchem.com.vn',
        verifiedSpecSummary:
          'Ống đong thủy tinh 100ml Duran/ISO 4788: Đường kính thân Ø 31 mm, chiều cao 250–256 mm, vạch chia nhỏ nhất 1 ml.',
      },
      {
        siteName: 'Lata Việt Nam — Thiết bị Khoa học',
        domain: 'lata.vn',
        verifiedSpecSummary:
          'Ống đong 100ml đế lục giác: Thủy tinh Borosilicate 3.3 chịu nhiệt, độ dày thành 1.8 mm, mỏ rót tiêu chuẩn DIN.',
      },
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Ống đong thủy tinh/nhựa trong suốt 100ml dùng chung cho mạch kiến thức Vật lí (đo thể tích vật rắn) và Hóa học.',
      },
      {
        siteName: 'Visitech — Giải pháp Phòng thí nghiệm',
        domain: 'visitech.vn',
        verifiedSpecSummary:
          'Ống đong Class B 100 ml: Sai số cho phép ±1.0 ml, vạch in men trắng hoặc xanh bền hóa chất.',
      },
      {
        siteName: 'Nhà sách Giáo dục — Thiết bị Trường học',
        domain: 'nhasachgiaoduc.vn',
        verifiedSpecSummary:
          'Ống đong thực hành KHTN THCS: Đế rộng vững chắc, đường kính lòng ống 28 mm bỏ lọt các trụ kim loại thực hành.',
      },
    ],
  },

  'OL3D-EQP-OVF-0001': {
    assetId: 'OL3D-EQP-OVF-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Thiết bị Cơ học Archimedes',
    exactDimensionsSpec:
      'Đường kính thân bình: Ø 85 mm · Chiều cao bình: 155 mm · Vòi tràn nghiêng dài 38 mm (Ø 8 mm) ở độ cao 120 mm',
    weightOrCapacitySpec: 'Dung tích tổng: 250 ml · Mực nước ngang vòi tràn: 210 ml',
    synthesizedFeatures: [
      'Thân hình trụ đứng trong suốt giúp quan sát trực tiếp vật rắn chìm hoàn toàn trong lòng chất lỏng.',
      'Vòi dẫn nước tràn gắn nghiêng 30° ở phần trên thân bình giúp dòng nước chảy gọn vào cốc hứng.',
      'Ứng dụng nguyên lý Archimedes: Thể tích nước tràn qua vòi sang cốc hứng bằng đúng thể tích vật rắn chiếm chỗ.',
      'Dùng cho các vật rắn có kích thước lớn hơn đường kính miệng ống đong 100 ml.',
    ],
    fiveWebSources: [
      {
        siteName: 'VietValue — Thiết bị Dạy học Tối thiểu',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Bình tràn thí nghiệm Vật lí THCS: Dung tích 250–300 ml, thân trụ trong suốt có vòi thoát nước nghiêng chống bám giọt.',
      },
      {
        siteName: 'Innotec Việt Nam',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Bình tràn đo thể tích vật rắn và lực đẩy Archimedes: Đường kính Ø 85 mm, chiều cao 150–160 mm.',
      },
      {
        siteName: 'Thư viện Vật lý Việt Nam',
        domain: 'thuvienvatly.com',
        verifiedSpecSummary:
          'Quy trình đo khối lượng riêng bằng bình tràn: Đổ nước đầy tới miệng vòi tràn trước khi thả chìm vật nặng.',
      },
      {
        siteName: 'VinaMTSC — Công ty Thiết bị Khoa học Kỹ thuật',
        domain: 'vinamtsc.com',
        verifiedSpecSummary:
          'Bình tràn thủy tinh Borosilicate có vòi: Thành dày 2 mm, miệng bo tròn, vòi nghiêng dài 35–40 mm.',
      },
      {
        siteName: 'DMKLab — Dụng cụ Thí nghiệm Trường học',
        domain: 'dmklab.vn',
        verifiedSpecSummary:
          'Bình tràn kết hợp cốc hứng và ống đong 100 ml trong bộ thực hành đo khối lượng riêng KHTN.',
      },
    ],
  },

  'OL3D-EQP-BKR-0001': {
    assetId: 'OL3D-EQP-BKR-0001',
    technicalStandard: 'ISO 3819 · DIN 12331 (Griffin Low-Form) · Thông tư 38/2021',
    exactDimensionsSpec:
      'Đường kính ngoài: Ø 70 mm · Chiều cao tổng thể: 97 mm · Độ dày thành: 1.8 mm · Có mỏ rót',
    weightOrCapacitySpec: 'Dung tích danh định: 250 ml · Vạch chia từ 50 ml đến 200 ml (bước chia 25 ml)',
    synthesizedFeatures: [
      'Cốc đốt thủy tinh Borosilicate 3.3 dạng thấp thành (Griffin Low-Form), chịu sốc nhiệt tới ΔT = 160 °C.',
      'Đáy phẳng tiếp xúc đều với lưới tản nhiệt khi đun trên đèn cồn hoặc đặt trên đĩa cân điện tử.',
      'Mỏ rót định hình chuẩn giúp nghiêng rót chất lỏng sang ống đong không bị chảy lem dọc thành ngoài.',
      'Vạch chia dung tích định hướng và vùng nhãn mờ để ghi ký hiệu hóa chất.',
    ],
    fiveWebSources: [
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Cốc thủy tinh 250ml chịu nhiệt, có vạch chia và mỏ rót thuộc danh mục dụng cụ thủy tinh dùng chung môn KHTN.',
      },
      {
        siteName: 'VietChem — Dụng cụ Thủy tinh Duran',
        domain: 'vietchem.com.vn',
        verifiedSpecSummary:
          'Cốc đốt 250ml Low-form (ISO 3819): Đường kính ngoài Ø 70 mm, chiều cao 95–98 mm, thủy tinh Borosilicate 3.3.',
      },
      {
        siteName: 'Eisco Labs Scientific Catalog',
        domain: 'eiscolabs.com',
        verifiedSpecSummary:
          '250ml Borosilicate Glass Beaker, Low Form with Spout: OD 70 mm, Height 97 mm, 25 ml graduations.',
      },
      {
        siteName: 'Foxx Life Sciences Glassware',
        domain: 'foxxlifesciences.com',
        verifiedSpecSummary:
          'Griffin Beaker 250 mL: Uniform wall thickness for thermal shock resistance on wire gauze.',
      },
      {
        siteName: 'Visitech Việt Nam',
        domain: 'visitech.vn',
        verifiedSpecSummary:
          'Cốc thủy tinh 250 ml dùng pha chế dung dịch, hứng dịch lọc từ phễu chiết và hứng nước từ bình tràn.',
      },
    ],
  },

  'OL3D-EQP-SLD-0001': {
    assetId: 'OL3D-EQP-SLD-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Mẫu vật chuẩn Khối lượng riêng',
    exactDimensionsSpec:
      'Đường kính trụ: Ø 25.0 mm · Chiều cao thân trụ: 50.0 mm · Tổng chiều cao kèm móc treo: 58.0 mm',
    weightOrCapacitySpec: 'Khối lượng chuẩn: m = 66.25 g · Thể tích chuẩn: V = 24.5 cm³ · ρ = 2.70 g/cm³ (Nhôm)',
    synthesizedFeatures: [
      'Gia công CNC chính xác từ hợp kim nhôm đặc (Al) không rỗng khí, bề mặt anod hóa chống oxy hóa.',
      'Đường kính Ø 25.0 mm thiết kế nhỏ hơn lòng ống đong 100 ml (Ø 28 mm) để thả chìm dễ dàng.',
      'Có móc treo đồng trục ở mặt trên để buộc chỉ nhúng nước hoặc treo trực tiếp vào lực kế lò xo 5 N.',
      'Tỷ số m / V = 66.25 / 24.5 = 2.70 g/cm³ khớp chính xác bảng khối lượng riêng của Nhôm trong SGK.',
    ],
    fiveWebSources: [
      {
        siteName: 'Nhà sách Giáo dục — Bộ mẫu đo Khối lượng riêng',
        domain: 'nhasachgiaoduc.vn',
        verifiedSpecSummary:
          'Quả nặng hình trụ nhôm có móc treo: Đường kính 25 mm, chiều cao 50 mm, dùng đo khối lượng riêng và lực đẩy Archimedes.',
      },
      {
        siteName: 'VietValue — Thiết bị Vật lí THCS',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Vật mẫu kim loại hình trụ đặc (Nhôm, Đồng, Sắt) đồng bộ kích thước để so sánh khối lượng riêng ρ = m/V.',
      },
      {
        siteName: 'Innotec Việt Nam',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Vật trụ kim loại có móc treo dùng chung cho bài Thực hành đo khối lượng riêng và bài Cơ năng.',
      },
      {
        siteName: 'VietJack — Hướng dẫn Thực hành KHTN',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Phương pháp xác định khối lượng riêng của vật rắn hình trụ bằng cân điện tử và ống đong chứa nước.',
      },
      {
        siteName: 'Thiết bị Giáo dục Tây Bắc',
        domain: 'thietbigiaoductaybac.vn',
        verifiedSpecSummary:
          'Trụ nhôm thực hành KHTN: Khối lượng riêng danh định 2.70 g/cm³ (2700 kg/m³), sai số gia công ±1%.',
      },
    ],
  },

  'OL3D-EQP-DYN-0001': {
    assetId: 'OL3D-EQP-DYN-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Chương I KHTN 9 (Bài 2, 3)',
    exactDimensionsSpec:
      'Chiều dài toàn thân (kể cả khuyên và móc): 210 mm · Đường kính ống trụ Acrylic: Ø 22 mm',
    weightOrCapacitySpec: 'Giới hạn đo (GHĐ): 5.0 N (tương đương ~500 g) · ĐCNN: 0.1 N',
    synthesizedFeatures: [
      'Thân ống nhựa Acrylic trong suốt giúp quan sát trực tiếp độ giãn của lò xo thép theo định luật Hooke.',
      'Vạch chia kép hiển thị đồng thời đơn vị lực Newton (N) và khối lượng quy đổi (gam).',
      'Núm chỉnh điểm 0 (Zero-adjust) ở đỉnh ống cho phép hiệu chuẩn vạch chỉ thị về đúng 0.0 N trước khi đo.',
      'Dùng đo trọng lượng P, lực kéo trên mặt phẳng nghiêng và tính công cơ học A = F·s trong Chương I KHTN 9.',
    ],
    fiveWebSources: [
      {
        siteName: 'HKM Tech — Thiết bị Đo lường Lực',
        domain: 'hkmtech.com',
        verifiedSpecSummary:
          'Lực kế lò xo 5N ống tròn trong suốt: GHĐ 5N, ĐCNN 0.1N, chiều dài tổng 210 mm, đường kính ống Ø 21–22 mm.',
      },
      {
        siteName: 'VietValue — Dụng cụ Thí nghiệm Vật lí',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Bộ lực kế lò xo 1N – 2.5N – 5N dùng trong trường THCS: Có ốc hiệu chỉnh vạch 0 và móc treo thép mạ crôm.',
      },
      {
        siteName: 'Innotec Việt Nam',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Lực kế 5N chuẩn Thông tư 38/2021/TT-BGDĐT phục vụ thí nghiệm Công và Công suất, Cơ năng KHTN 9.',
      },
      {
        siteName: 'DMKLab Việt Nam',
        domain: 'dmklab.vn',
        verifiedSpecSummary:
          'Lực kế ống trụ nhựa trong suốt: Sai số toàn thang ≤ ±2%, lò xo thép đàn hồi đã xử lý nhiệt chống mỏi.',
      },
      {
        siteName: 'Vật tư Bách Khoa (VattuBK)',
        domain: 'vattubk.com',
        verifiedSpecSummary:
          'Cấu tạo lực kế lò xo thực hành: Khuyên cầm tay phía trên, đĩa chỉ thị màu đỏ nổi bật và móc treo phía dưới.',
      },
    ],
  },

  'OL3D-EQP-CAL-0001': {
    assetId: 'OL3D-EQP-CAL-0001',
    technicalStandard: 'DIN 862 · ISO 13385 · Dụng cụ Đo cơ khí chính xác',
    exactDimensionsSpec:
      'Chiều dài toàn thước: 235 mm · Phạm vi đo: 0 – 150 mm · Chiều dài mỏ kẹp ngoài: 40 mm',
    weightOrCapacitySpec: 'GHĐ: 150 mm (6 inch) · Độ chia du xích (ĐCNN): 0.02 mm · Khối lượng: 165 g',
    synthesizedFeatures: [
      'Chế tạo bằng thép không gỉ закаленная (Hardened Stainless Steel) mài phẳng chống chói.',
      'Đo 3 chế độ: Đường kính ngoài (mỏ dưới), đường kính lỗ trong (mỏ trên) và chiều sâu (thanh đo sâu).',
      'Thước phụ (Du xích / Vernier) 50 vạch chia cho phép đọc chính xác tới 0.02 mm kèm vít hãm cố định.',
      'Dùng kiểm tra đường kính d và chiều cao h của trụ kim loại đặc, trụ rỗng và bi cầu thép.',
    ],
    fiveWebSources: [
      {
        siteName: 'Mitutoyo Việt Nam — Thiết bị Đo cơ khí',
        domain: 'mitutoyo.vn',
        verifiedSpecSummary:
          'Thước cặp cơ khí 150mm (Model 530-101): Dải đo 0–150 mm, độ chia 0.02 mm, tổng chiều dài 229–235 mm.',
      },
      {
        siteName: 'VinaTools — Dụng cụ Đo lường',
        domain: 'vinatools.com',
        verifiedSpecSummary:
          'Thước kẹp du xích 150mm chuẩn DIN 862: Chiều dài mỏ đo ngoài 40 mm, mỏ đo trong 16.5 mm, sai số ±0.03 mm.',
      },
      {
        siteName: 'THB Việt Nam — Máy đo Chuyên dụng',
        domain: 'thbvn.com',
        verifiedSpecSummary:
          'Hướng dẫn đọc thước cặp du xích 0.02 mm và ứng dụng đo mẫu hình trụ trong phòng thí nghiệm.',
      },
      {
        siteName: 'UniTools Việt Nam',
        domain: 'unitools.vn',
        verifiedSpecSummary:
          'Thước cặp thép không gỉ 0–150mm: Có con lăn đẩy ngón cái và vít khóa hàm trượt khi đọc số đo.',
      },
      {
        siteName: 'Máy Đo Chuyên Dụng',
        domain: 'maydochuyendung.com',
        verifiedSpecSummary:
          'Cấu tạo 3 bộ phận đo của thước cặp: Mỏ đo ngoài, mỏ đo trong (khoang rỗng) và lưỡi đo chiều sâu.',
      },
    ],
  },

  'OL3D-EQP-WGT-0001': {
    assetId: 'OL3D-EQP-WGT-0001',
    technicalStandard: 'OIML R111 Class M1 · Thông tư 38/2021/TT-BGDĐT',
    exactDimensionsSpec:
      'Đường kính thân quả cân: Ø 22.0 mm · Chiều cao tổng thể (kèm núm cầm): 34.0 mm',
    weightOrCapacitySpec: 'Khối lượng chuẩn danh định: 50.00 g · Sai số cho phép: ±3.0 mg (Class M1)',
    synthesizedFeatures: [
      'Gia công từ đồng thau nguyên khối mạ Niken-Crôm bóng gương chống ăn mòn và bám bẩn.',
      'Đỉnh quả cân có cổ thắt và núm tròn chuẩn OIML để gắp bằng nhíp hoặc kẹp vào móc lực kế.',
      'Dùng làm chuẩn kiểm tra độ chính xác của cân điện tử (50.00 g) và kiểm định lực kế (0.49 N).',
    ],
    fiveWebSources: [
      {
        siteName: 'Thiết bị Điện tử & Cân chuẩn Việt Nam',
        domain: 'thietbidientu.net.vn',
        verifiedSpecSummary:
          'Quả cân chuẩn 50g chuẩn OIML M1: Đường kính Ø 22 mm, chiều cao 34 mm, chất liệu đồng mạ crôm hoặc inox 304.',
      },
      {
        siteName: 'VietValue — Thiết bị Giáo dục',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Hộp quả cân chuẩn thực hành KHTN: Quả 50g dùng hiệu chuẩn cân kỹ thuật và làm tải trọng chuẩn.',
      },
      {
        siteName: 'DMKLab Việt Nam',
        domain: 'dmklab.vn',
        verifiedSpecSummary:
          'Quả cân chuẩn phòng thí nghiệm: Đáy phẳng mài nhẵn, khắc laser trị số "50 g" rõ nét trên mặt đỉnh.',
      },
      {
        siteName: 'Innotec Việt Nam',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Quả nặng chuẩn 50g dùng trong các thí nghiệm Cơ học (Động năng, Thế năng, Lực đàn hồi) cấp THCS.',
      },
      {
        siteName: 'VinaMTSC',
        domain: 'vinamtsc.com',
        verifiedSpecSummary:
          'Tiêu chuẩn bảo quản quả cân chuẩn: Không chạm tay ướt hoặc hóa chất axit làm thay đổi khối lượng chuẩn.',
      },
    ],
  },

  'OL3D-EQP-SPH-0001': {
    assetId: 'OL3D-EQP-SPH-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Chương I KHTN 9 (Bài 2: Động năng, Thế năng)',
    exactDimensionsSpec:
      'Đường kính danh định: Ø 25.2 mm (1 inch) · Độ cầu sai lệch ≤ 0.01 mm',
    weightOrCapacitySpec: 'Khối lượng: m = 65.90 g · Thể tích: V = 8.4 cm³ · ρ = 7.85 g/cm³ (Thép hợp kim)',
    synthesizedFeatures: [
      'Bi cầu thép hợp kim Crôm (AISI 52100) đặc hoàn toàn, bề mặt mài bóng gương.',
      'Dùng trong Bài 2 SGK KHTN 9 để thả lăn trên máng nghiêng khảo sát Động năng phụ thuộc vào khối lượng và tốc độ.',
      'Dùng làm vật mẫu chuẩn đo khối lượng riêng của Thép (ρ = 7.85 g/cm³) và đo đường kính bằng thước cặp.',
    ],
    fiveWebSources: [
      {
        siteName: 'VietJack — SGK KHTN 9 Kết nối tri thức (Bài 2)',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Thí nghiệm khảo sát động năng (Hình 2.3 SGK KHTN 9): Sử dụng viên bi thép lăn trên máng nghiêng đập vào khúc gỗ.',
      },
      {
        siteName: 'Innotec Việt Nam — Bộ thí nghiệm Cơ năng',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Viên bi thép chuẩn Ø 25 mm nặng ~66 g dùng trong bộ thí nghiệm biến đổi thế năng thành động năng.',
      },
      {
        siteName: 'VietValue — Thiết bị Dạy học',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Bi thép thực hành Vật lí THCS: Khối lượng riêng chuẩn 7.85 g/cm³, chống gỉ sét trong môi trường ẩm.',
      },
      {
        siteName: 'Nhà sách Giáo dục',
        domain: 'nhasachgiaoduc.vn',
        verifiedSpecSummary:
          'Mẫu vật hình cầu bằng thép đặc dùng kết hợp với thước cặp 150 mm và cân điện tử.',
      },
      {
        siteName: 'Thư viện Vật lý',
        domain: 'thuvienvatly.com',
        verifiedSpecSummary:
          'Tính toán thể tích hình cầu V = (4/3)πR³ đối chiếu với phép đo dâng nước trong ống đong.',
      },
    ],
  },

  'OL3D-EQP-BLK-0001': {
    assetId: 'OL3D-EQP-BLK-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Mẫu kim loại Đồng (Cu) nguyên chất',
    exactDimensionsSpec:
      'Kích thước 3 chiều (Dài × Rộng × Cao): 30.0 × 20.0 × 30.0 mm · Các góc vát nhẹ 0.5 mm',
    weightOrCapacitySpec: 'Khối lượng: m = 160.92 g · Thể tích: V = 18.0 cm³ · ρ = 8.94 g/cm³ (Đồng đỏ)',
    synthesizedFeatures: [
      'Khối hộp chữ nhật gia công từ đồng đỏ điện phân (Cu ≥ 99.9%) có ánh kim đỏ cam đặc trưng.',
      'Cho phép học sinh xác định thể tích theo cả 2 phương pháp: Đo kích thước a × b × c bằng thước cặp (3 × 2 × 3 = 18 cm³) và thả chìm trong ống đong.',
      'Minh họa trực quan tính chất vật lí của kim loại Đồng (Bài 18 SGK KHTN 9) và đo khối lượng riêng lớn (8.94 g/cm³).',
    ],
    fiveWebSources: [
      {
        siteName: 'VietValue — Bộ mẫu Kim loại KHTN 9',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Khối hộp đồng nguyên chất trong bộ mẫu thực hành: Kích thước 30×20×30 mm, khối lượng riêng 8.94 g/cm³.',
      },
      {
        siteName: 'Nhà sách Giáo dục',
        domain: 'nhasachgiaoduc.vn',
        verifiedSpecSummary:
          'Mẫu vật hình hộp chữ nhật bằng đồng đỏ dùng thực hành đo khối lượng riêng và khảo sát tính chất kim loại.',
      },
      {
        siteName: 'Innotec Việt Nam',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Các mặt bên được phay phẳng vuông góc giúp kẹp thước cặp đo chính xác tới 0.02 mm.',
      },
      {
        siteName: 'VietChem — Hóa chất & Mẫu Kim loại',
        domain: 'vietchem.com.vn',
        verifiedSpecSummary:
          'Tính chất vật lí chuẩn của Đồng (Cu): Khối lượng riêng 8.94 g/cm³, dẫn điện và dẫn nhiệt tốt.',
      },
      {
        siteName: 'VinaMTSC',
        domain: 'vinamtsc.com',
        verifiedSpecSummary:
          'Bộ mẫu vật rắn thực hành KHTN THCS theo tiêu chuẩn Bộ GD&ĐT.',
      },
    ],
  },

  'OL3D-EQP-HLW-0001': {
    assetId: 'OL3D-EQP-HLW-0001',
    technicalStandard: 'Dụng cụ Đo lường nâng cao · Phân biệt Thể tích đặc & Thể tích khoang rỗng',
    exactDimensionsSpec:
      'Đường kính ngoài: D = 32.0 mm · Đường kính lỗ trong: d = 18.0 mm · Chiều cao: h = 45.0 mm',
    weightOrCapacitySpec: 'Khối lượng phần kim loại: m = 192.80 g · Thể tích kim loại đặc: V_thực = 24.7 cm³',
    synthesizedFeatures: [
      'Ống trụ kim loại có lỗ thông xuyên tâm giúp rèn luyện kỹ năng dùng cả 3 bộ phận của thước cặp (mỏ ngoài D, mỏ trong d, thanh chiều sâu h).',
      'Giúp học sinh phân biệt rõ thể tích bao ngoài toàn phần và thể tích phần kim loại đặc thực sự chiếm chỗ nước (V = π(R² - r²)h).',
      'Rèn kỹ năng nghiêng thoát hết bọt khí trong lòng ống khi nhúng vào ống đong hoặc bình tràn.',
    ],
    fiveWebSources: [
      {
        siteName: 'Mitutoyo Việt Nam — Ứng dụng Đo đường kính trong',
        domain: 'mitutoyo.vn',
        verifiedSpecSummary:
          'Sử dụng mỏ đo trong (Inside Jaws) của thước cặp 150 mm để đo chính xác đường kính lòng ống trụ rỗng.',
      },
      {
        siteName: 'Thư viện Vật lý Việt Nam',
        domain: 'thuvienvatly.com',
        verifiedSpecSummary:
          'Bài toán thực hành nâng cao: Xác định khối lượng riêng của vật rắn có khoang rỗng và kiểm tra tính đặc/rỗng.',
      },
      {
        siteName: 'VinaTools Việt Nam',
        domain: 'vinatools.com',
        verifiedSpecSummary:
          'Quy chuẩn đo chi tiết dạng ống trụ: Kết hợp đo đường kính ngoài D, đường kính lỗ d và chiều dài h.',
      },
      {
        siteName: 'VietValue — Thiết bị Thực hành',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Mẫu trụ rỗng hợp kim dùng cho bài tập thực nghiệm kiểm tra mật độ vật liệu.',
      },
      {
        siteName: 'DMKLab Việt Nam',
        domain: 'dmklab.vn',
        verifiedSpecSummary:
          'Hướng dẫn khử bọt khí bám trong khoang rỗng khi đo thể tích bằng phương pháp dâng nước.',
      },
    ],
  },

  'OL3D-EQP-FLK-0001': {
    assetId: 'OL3D-EQP-FLK-0001',
    technicalStandard: 'ISO 1773 · DIN 12380 · Thông tư 38/2021 (Hình 1.10 SGK KHTN 9)',
    exactDimensionsSpec:
      'Đường kính đáy lớn: Ø 85 mm · Chiều cao tổng thể: 145 mm · Đường kính cổ hẹp: Ø 34 mm',
    weightOrCapacitySpec: 'Dung tích danh định: 250 ml · Vạch chia từ 50 ml đến 250 ml (bước chia 50 ml)',
    synthesizedFeatures: [
      'Thân hình nón cụt (Erlenmeyer) với cổ hẹp giúp lắc mạnh dung dịch khi hòa tan hoặc chuẩn độ mà không bị sánh bắn ra ngoài.',
      'Làm bằng thủy tinh Borosilicate 3.3 chịu nhiệt, có thể đun trên lưới tản nhiệt hoặc lắp nút cao su có ống dẫn khí.',
      'Trong Hình 1.10 SGK KHTN 9 (Bài 24), bình tam giác được đặt ở đầu ra ống sinh hàn để hứng chất lỏng tinh khiết sau khi ngưng tụ.',
    ],
    fiveWebSources: [
      {
        siteName: 'DMKLab — Bình tam giác Thủy tinh 250ml',
        domain: 'dmklab.vn',
        verifiedSpecSummary:
          'Bình tam giác cổ hẹp 250ml (ISO 1773): Đường kính đáy Ø 85 mm, chiều cao 140–145 mm, đường kính cổ Ø 34 mm.',
      },
      {
        siteName: 'VinaMTSC — Dụng cụ Thủy tinh Thí nghiệm',
        domain: 'vinamtsc.com',
        verifiedSpecSummary:
          'Bình nón Erlenmeyer 250ml Borosilicate 3.3: Chịu nhiệt độ cao, vạch chia men trắng rõ nét 50–250 ml.',
      },
      {
        siteName: 'TechLab Việt Nam',
        domain: 'techlab.com.vn',
        verifiedSpecSummary:
          'Ứng dụng bình tam giác trong bộ chưng cất đơn giản và phản ứng hóa học hữu cơ lớp 9.',
      },
      {
        siteName: 'Visitech Việt Nam',
        domain: 'visitech.vn',
        verifiedSpecSummary:
          'Thiết kế thành nghiêng hạn chế bay hơi và chống văng dung dịch axit/kiềm khi lắc trộn.',
      },
      {
        siteName: 'Vật tư Lab Hà Nội',
        domain: 'vattulabhanoi.com',
        verifiedSpecSummary:
          'Bình tam giác 250ml chuẩn phòng thí nghiệm trường phổ thông theo Thông tư 38/2021/TT-BGDĐT.',
      },
    ],
  },

  'OL3D-EQP-STD-0001': {
    assetId: 'OL3D-EQP-STD-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Hình 1.3, 1.8b, 1.10 SGK KHTN 9',
    exactDimensionsSpec:
      'Đế gang đúc: 200 × 135 × 18 mm · Trụ thép không gỉ: Ø 10 mm × cao 500 mm · Kèm khớp chữ thập & vòng đỡ',
    weightOrCapacitySpec: 'Khối lượng chân đế + trụ: 1.85 kg · Tải trọng treo tối đa: 3.5 kg',
    synthesizedFeatures: [
      'Chân đế bằng gang đúc nặng sơn tĩnh điện chống gỉ, có đệm cao su dưới đáy chống trượt trên mặt bàn gỗ.',
      'Trụ đứng bằng thép mạ crôm Ø 10 mm lắp ren vuông góc vững chắc vào chân đế.',
      'Đi kèm khớp nối chữ thập (Bosshead), tay kẹp bọc cao su (kẹp cổ bình cầu, ống sinh hàn) và vòng đỡ sắt (đỡ phễu chiết, lưới tản nhiệt).',
    ],
    fiveWebSources: [
      {
        siteName: 'Visitech — Bộ Giá đỡ Thí nghiệm Đa năng',
        domain: 'visitech.vn',
        verifiedSpecSummary:
          'Giá sắt thí nghiệm chuẩn: Đế gang 135×200 mm hoặc 150×220 mm, trụ inox dài 500 mm, kèm kẹp đôi và vòng đỡ.',
      },
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Giá thí nghiệm dùng chung cho Vật lí (treo lực kế, giữ thấu kính) và Hóa học (gá phễu chiết, bộ chưng cất).',
      },
      {
        siteName: 'VietValue — Thiết bị Trường học',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Bộ giá thí nghiệm KHTN 9: Tay kẹp có lót đệm bần/cao su chịu nhiệt tránh làm nứt vỡ cổ bình cầu thủy tinh.',
      },
      {
        siteName: 'Innotec Việt Nam',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Khớp nối chữ thập hợp kim nhôm đúc có vít tai hồng vặn nhẹ tay cho học sinh THCS.',
      },
      {
        siteName: 'VietChem',
        domain: 'vietchem.com.vn',
        verifiedSpecSummary:
          'Quy tắc an toàn khi lắp bộ chưng cất và chiết lỏng–lỏng trên giá sắt chữ nhật.',
      },
    ],
  },

  'OL3D-EQP-OPT-0001': {
    assetId: 'OL3D-EQP-OPT-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Hình 1.3 trang 6 & Bài 8, 9 SGK KHTN 9',
    exactDimensionsSpec:
      'Đường kính thông quang thấu kính: Ø 60 mm · Tiêu cự chuẩn: f = +100 mm · Chiều cao tâm quang học: 115 mm',
    weightOrCapacitySpec: 'Tiêu cự danh định: f = +100 mm (Độ tụ D = +10 dp) · Khối lượng cả giá: 140 g',
    synthesizedFeatures: [
      'Thấu kính hai mặt lồi (Biconvex) bằng thủy tinh quang học BK7 trong suốt, phần rìa mỏng và phần tâm dày.',
      'Lắp trong vành khung nhựa ABS bảo vệ chống sứt mẻ kèm trụ cắm và đế giữ ổn định trên băng quang học hoặc bàn gỗ.',
      'Khi chiếu chùm 3 tia laser song song vuông góc với mặt thấu kính, chùm tia ló hội tụ đúng tại tiêu điểm chính F cách quang tâm O một khoảng f = 10 cm (Bài 8, 9 SGK KHTN 9).',
    ],
    fiveWebSources: [
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Thấu kính hội tụ và thấu kính phân kì trong Bộ thí nghiệm Quang hình học lớp 9: Đường kính Ø 60 mm, tiêu cự f = 100 mm.',
      },
      {
        siteName: 'VietJack — SGK KHTN 9 Bài 8 & Bài 9',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Hình 1.3 trang 6 và Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ bằng phương pháp ảnh thật đối xứng d = d\' = 2f.',
      },
      {
        siteName: 'VietValue — Thiết bị Quang học THCS',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Thấu kính hội tụ có giá đỡ: Thủy tinh quang học mài nhẵn, tiêu cự chuẩn f = 100 mm ± 2 mm.',
      },
      {
        siteName: 'Innotec Việt Nam',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Bộ dụng cụ tìm hiểu tính chất ảnh qua thấu kính gồm nguồn sáng, thấu kính hội tụ f=100mm, màn hứng ảnh và giá quang học.',
      },
      {
        siteName: 'Nhà sách Giáo dục',
        domain: 'nhasachgiaoduc.vn',
        verifiedSpecSummary:
          'Khung giữ thấu kính có vạch dấu tâm quang học giúp căn đồng trục với đèn laser và màn chắn.',
      },
    ],
  },

  'OL3D-EQP-THM-0001': {
    assetId: 'OL3D-EQP-THM-0001',
    technicalStandard: 'TCVN / ISO 1770 · Thông tư 38/2021/TT-BGDĐT (Hình 1.10 SGK KHTN 9)',
    exactDimensionsSpec:
      'Chiều dài toàn thân: 295 mm · Đường kính ống mao quản thủy tinh: Ø 6.5 mm · Bầu rượu Ø 6.0 mm',
    weightOrCapacitySpec: 'Phạm vi đo (GHĐ): -10 °C đến +110 °C · ĐCNN: 1.0 °C · Khối lượng: 35 g',
    synthesizedFeatures: [
      'Sử dụng chất lỏng cảm nhiệt là rượu hữu cơ pha màu đỏ tươi dễ quan sát, tuyệt đối an toàn (không chứa thủy ngân độc hại).',
      'Thang chia độ khắc laser bền nhiệt từ -10 °C đến 110 °C với độ chia nhỏ nhất 1 °C.',
      'Dùng đo nhiệt độ dung dịch trong cốc đốt hoặc cắm qua nút cao su cổ bình cầu có nhánh (Hình 1.10 Bài 24 SGK KHTN 9) để theo dõi nhiệt độ sôi khi chưng cất.',
    ],
    fiveWebSources: [
      {
        siteName: 'LabVietChem — Nhiệt kế Rượu Phòng thí nghiệm',
        domain: 'labvietchem.com.vn',
        verifiedSpecSummary:
          'Nhiệt kế rượu đỏ -10 đến 110 °C: Chiều dài 300 mm, đường kính thân Ø 6–7 mm, vạch chia 1 °C.',
      },
      {
        siteName: 'Tiêu chuẩn Quốc gia TCVN (Tổng cục TCĐLCL)',
        domain: 'tcvn.gov.vn',
        verifiedSpecSummary:
          'Quy định an toàn trường học: Thay thế nhiệt kế thủy ngân bằng nhiệt kế rượu màu hữu cơ trong thực hành THCS.',
      },
      {
        siteName: 'Lời Giải Hay — Thực hành KHTN',
        domain: 'loigiaihay.com',
        verifiedSpecSummary:
          'Nguyên lý giãn nở vì nhiệt của cột chất lỏng và cách đặt bầu nhiệt kế trong bình cầu có nhánh ngang vòi thoát hơi.',
      },
      {
        siteName: 'VietValue — Dụng cụ Đo nhiệt độ',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Nhiệt kế thí nghiệm KHTN: Có khuyên treo ở đầu trên và ống nhựa bảo vệ khi cất giữ.',
      },
      {
        siteName: 'Thư viện Giáo dục Violet',
        domain: 'violet.vn',
        verifiedSpecSummary:
          'Hướng dẫn xác định GHĐ (110 °C) và ĐCNN (1 °C) của nhiệt kế rượu trong phòng thực hành.',
      },
    ],
  },

  'OL3D-EQP-LSR-0001': {
    assetId: 'OL3D-EQP-LSR-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Hình 1.1 trang 6 SGK KHTN 9 (Bài 5, 6, 8)',
    exactDimensionsSpec:
      'Kích thước hộp nguồn sáng: 110 × 80 × 22 mm · Khoảng cách giữa các khe tia: 18 mm · 3 cửa phát tia song song',
    weightOrCapacitySpec: 'Bước sóng: λ = 650 nm (Đỏ) · Công suất an toàn: < 1 mW (Class II) · Khối lượng: 95 g',
    synthesizedFeatures: [
      'Phát đồng thời 3 chùm tia laser đỏ song song hoặc chuyển sang 1 tia mảnh nhờ công tắc trên lưng hộp.',
      'Tích hợp thấu kính trụ tán phẳng tạo vệt tia sáng rõ nét trên mặt bảng chia độ hoặc mặt bàn mà không cần phòng tối hoàn toàn.',
      'Đế có gắn đệm từ tính giúp đặt ổn định trên bàn thí nghiệm hoặc gắn lên bảng từ lớp học.',
      'Dùng xuyên suốt Chương II SGK KHTN 9: Khúc xạ (Bài 5), Phản xạ toàn phần (Bài 6) và Đường truyền 3 tia sáng qua thấu kính (Bài 8).',
    ],
    fiveWebSources: [
      {
        siteName: 'Thiết bị Dạy học Tối thiểu (Bộ GD&ĐT)',
        domain: 'thietbidayhoctoithieu.vn',
        verifiedSpecSummary:
          'Nguồn sáng laser 3 tia song song dùng cho bộ thí nghiệm quang học KHTN 9 theo Thông tư 38/2021/TT-BGDĐT.',
      },
      {
        siteName: 'Nhà sách Giáo dục — Thiết bị Vật lí 9',
        domain: 'nhasachgiaoduc.vn',
        verifiedSpecSummary:
          'Đèn laser 3 tia thí nghiệm quang hình: Kích thước 110 × 80 × 20 mm, trọng lượng 90–100 g, bước sóng đỏ 635–650 nm.',
      },
      {
        siteName: 'Thiết bị Giáo dục Tây Bắc',
        domain: 'thietbigiaoductaybac.vn',
        verifiedSpecSummary:
          'Hộp nguồn sáng 3 tia có đế nam châm và công tắc bật/tắt từng tia, dùng pin sạc hoặc 2 pin AAA.',
      },
      {
        siteName: 'VietValue — Dụng cụ Quang học',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Độ đơn sắc và tính định hướng cao, vệt tia rõ trên bảng chia độ bán trụ và qua thấu kính hội tụ.',
      },
      {
        siteName: 'STEMVN — Thiết bị Khoa học Tự nhiên',
        domain: 'stemvn.vn',
        verifiedSpecSummary:
          'Cấp an toàn Laser Class II (< 1mW) dành cho học sinh phổ thông kèm quy tắc không chiếu trực tiếp vào mắt.',
      },
    ],
  },

  'OL3D-EQP-SLB-0001': {
    assetId: 'OL3D-EQP-SLB-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Hình 1.2 trang 6 & Bài 5, 6 SGK KHTN 9',
    exactDimensionsSpec:
      'Bản bán trụ thủy tinh BK7: Đường kính Ø 84 mm (Bán kính R = 42 mm), dày 16 mm · Đế bảng chia độ tròn: Ø 150 mm (360°)',
    weightOrCapacitySpec: 'Chiết suất chuẩn: n = 1.50 · Góc tới hạn phản xạ toàn phần: i_th ≈ 41.8° · Khối lượng: 185 g',
    synthesizedFeatures: [
      'Khối bán trụ bằng thủy tinh quang học BK7 (hoặc Acrylic quang học tinh khiết) đặt đồng tâm trên mâm chia độ tròn 360° (ĐCNN 1°).',
      'Mặt phẳng đường kính của bản bán trụ trùng khít vạch chuẩn 90°–90°, tâm O trùng giao điểm pháp tuyến N–N\'.',
      'Khi chiếu tia laser qua mặt cong hướng vào tâm O (từ thủy tinh chiết suất n = 1.50 ra không khí): Góc tới i < 41.8° cho tia khúc xạ; khi i ≥ 42° tia khúc xạ biến mất hoàn toàn và xảy ra Phản xạ toàn phần (Bài 6 SGK KHTN 9).',
    ],
    fiveWebSources: [
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Bản bán trụ trong suốt: Đường kính tối thiểu 80 mm, độ dày tối thiểu 15 mm, dùng kèm bảng chia độ 360°.',
      },
      {
        siteName: 'VietJack — SGK KHTN 9 Bài 5 & Bài 6',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Hình 1.2 trang 6, Hình 5.2 (Khúc xạ ánh sáng) và Hình 6.1 (Phản xạ toàn phần): Đọc góc tới i và góc khúc xạ r trên bảng chia độ.',
      },
      {
        siteName: 'Thiết bị Dạy học Tối thiểu',
        domain: 'thietbidayhoctoithieu.vn',
        verifiedSpecSummary:
          'Bộ thí nghiệm khúc xạ và phản xạ toàn phần KHTN 9: Bảng tròn chia độ 0–90° ở 4 góc phần tư, vạch pháp tuyến rõ nét.',
      },
      {
        siteName: 'VietValue — Thiết bị Vật lí',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Bản bán trụ thủy tinh quang học chiết suất n = 1.5, các mặt bên mài bóng quang học không biến dạng tia.',
      },
      {
        siteName: 'Innotec Việt Nam',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Mâm chia độ xoay nhẹ nhàng giúp thay đổi góc tới i liên tục từ 0° đến 80° mà không cần dịch chuyển đèn laser.',
      },
    ],
  },

  'OL3D-EQP-PRM-0001': {
    assetId: 'OL3D-EQP-PRM-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Hình 7.1, 7.2 Bài 7 SGK KHTN 9',
    exactDimensionsSpec:
      'Lăng kính tam giác đều (Góc chiết quang A = 60°): Cạnh đáy 35 mm × Chiều cao khối 50 mm · Đế kèm màn hứng: 135 × 80 mm',
    weightOrCapacitySpec: 'Chiết suất (với ánh sáng đỏ – tím): n_đỏ = 1.514 → n_tím = 1.532 · Khối lượng: 145 g',
    synthesizedFeatures: [
      'Khối lăng kính tam giác đều A = 60° bằng thủy tinh quang học tán sắc cao, đặt trên bàn xoay có trụ đỡ.',
      'Tích hợp màn chắn trắng phía sau để hứng trực tiếp dải quang phổ liên tục 7 màu (Đỏ, Da cam, Vàng, Lục, Lam, Chàm, Tím) khi chiếu chùm ánh sáng trắng đi qua.',
      'Minh họa trực quan hiện tượng Tán sắc ánh sáng và đường truyền tia sáng bị lệch về phía đáy lăng kính (Bài 7 SGK KHTN 9).',
    ],
    fiveWebSources: [
      {
        siteName: 'STEMVN — Lăng kính Tán sắc Ánh sáng KHTN 9',
        domain: 'stemvn.vn',
        verifiedSpecSummary:
          'Lăng kính tam giác đều thủy tinh quang học BK7/Flint: Cạnh 30–35 mm, chiều cao 50 mm, góc chiết quang chuẩn 60°.',
      },
      {
        siteName: 'VietJack — SGK KHTN 9 Bài 7 (Lăng kính)',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Hình 7.1 & 7.2 SGK KHTN 9: Thí nghiệm Newton chiếu ánh sáng trắng qua lăng kính tách thành dải màu cầu vồng (tia đỏ lệch ít nhất, tia tím lệch nhiều nhất).',
      },
      {
        siteName: 'Nhà sách Giáo dục',
        domain: 'nhasachgiaoduc.vn',
        verifiedSpecSummary:
          'Lăng kính gắn đế thí nghiệm quang học lớp 9 theo danh mục Bộ GD&ĐT.',
      },
      {
        siteName: 'VietValue — Thiết bị Giáo dục',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Ba mặt bên lăng kính được đánh bóng quang học phẳng tuyệt đối giúp chùm tia ló không bị tán xạ mờ.',
      },
      {
        siteName: 'Thiết bị Dạy học Tối thiểu',
        domain: 'thietbidayhoctoithieu.vn',
        verifiedSpecSummary:
          'Dụng cụ thực hành Chủ đề Ánh sáng KHTN 9: Quan sát sự tạo thành màu sắc của vật và tán sắc qua lăng kính.',
      },
    ],
  },

  'OL3D-EQP-MAG-0001': {
    assetId: 'OL3D-EQP-MAG-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Hình 10.1 Bài 10 SGK KHTN 9',
    exactDimensionsSpec:
      'Đường kính mặt kính: Ø 65 mm · Tiêu cự: f = 50 mm · Tổng chiều dài kèm cán cầm: 155 mm × dày 14 mm',
    weightOrCapacitySpec: 'Số bội giác danh định: G = 5x (G = 25 / f_cm = 25 / 5 = 5x) · Khối lượng: 78 g',
    synthesizedFeatures: [
      'Cấu tạo gồm một thấu kính hội tụ có tiêu cự ngắn (f = 5 cm) bọc trong khung vành kim loại chắc chắn và tay cầm vừa vặn.',
      'Khi đặt vật nhỏ trong khoảng tiêu cự (d < f), kính lúp tạo ra ảnh ảo cùng chiều và lớn gấp 5 lần vật.',
      'Dùng trong Bài 10 SGK KHTN 9 và các bài quan sát mẫu vật sinh học, chi tiết thực vật, côn trùng, tinh thể muối.',
    ],
    fiveWebSources: [
      {
        siteName: 'VietJack — SGK KHTN 9 Bài 10 (Kính lúp)',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Cấu tạo kính lúp và công thức tính số bội giác G = 25/f (với f tính bằng cm), cách ngắm chừng để mắt không bị mỏi.',
      },
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Kính lúp cầm tay độ bội giác 3x – 5x, đường kính mặt kính ≥ 60 mm thuộc thiết bị dùng chung môn KHTN.',
      },
      {
        siteName: 'VietValue — Kính lúp Thí nghiệm Học sinh',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Kính lúp cầm tay Ø 65 mm, thấu kính thủy tinh quang học trong suốt chống trầy xước.',
      },
      {
        siteName: 'Innotec Việt Nam',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Chiều dài tổng thể 150–160 mm, vành bảo vệ cao hơn mặt kính 2 mm tránh xước khi đặt trên mặt bàn.',
      },
      {
        siteName: 'Nhà sách Giáo dục',
        domain: 'nhasachgiaoduc.vn',
        verifiedSpecSummary:
          'Dụng cụ thực hành bài Kính lúp và bài Thực hành quan sát tiêu bản sinh học.',
      },
    ],
  },

  'OL3D-EQP-GLV-0001': {
    assetId: 'OL3D-EQP-GLV-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Hình 1.4 trang 6 & Bài 14 SGK KHTN 9',
    exactDimensionsSpec:
      'Kích thước hộp điện kế để bàn: 100 × 95 × 115 mm · Mặt thang đo nghiêng 20° · 2 cọc đấu dây Đỏ (+) / Đen (-)',
    weightOrCapacitySpec: 'Thang đo đối xứng vạch 0 ở giữa: -300 µA ... 0 ... +300 µA (hoặc ±0.5 mA) · ĐCNN: 20 µA',
    synthesizedFeatures: [
      'Kim chỉ thị nằm chính giữa tại vạch số 0 khi chưa có dòng điện, cho phép phát hiện cả độ lớn và chiều của dòng điện cảm ứng rất nhỏ.',
      'Khi đưa cực Bắc nam châm lại gần cuộn dây, kim lệch sang phải (+); khi kéo nam châm ra xa, kim lệch sang trái (-) chứng tỏ dòng điện cảm ứng đổi chiều (Bài 14 SGK KHTN 9).',
      'Có vít chỉnh điểm 0 (Zero-adjust) ngay dưới mặt kính và 2 cọc nối dây bắp chuối 4 mm tiêu chuẩn.',
    ],
    fiveWebSources: [
      {
        siteName: 'VietValue — Điện kế Nhạy Thí nghiệm Vật lí',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Điện kế chứng minh vạch 0 ở giữa dùng khảo sát hiện tượng cảm ứng điện từ (Bài 14 KHTN 9): Độ nhạy cấp µA/mA.',
      },
      {
        siteName: 'STB Việt Nam — Thiết bị Giáo dục',
        domain: 'stb.com.vn',
        verifiedSpecSummary:
          'Điện kế phòng thí nghiệm: Mặt hiển thị chia vạch đối xứng qua điểm 0, có núm cân chỉnh kim chỉ thị và cọc đấu dây an toàn.',
      },
      {
        siteName: 'Innotec Việt Nam',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Điện kế học sinh để bàn: Vỏ nhựa ABS nghiêng dễ quan sát, cơ cấu từ điện chống rung kim.',
      },
      {
        siteName: 'VietJack — SGK KHTN 9 Hình 1.4 & Bài 14',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Hình 1.4 trang 6 SGK KHTN 9: Điện kế là dụng cụ dùng để phát hiện dòng điện cảm ứng nhỏ và nhận biết sự đổi chiều dòng điện.',
      },
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Danh mục thiết bị Chủ đề Điện từ cấp THCS: Điện kế nhạy vạch 0 ở giữa kết nối với cuộn dây dẫn kín.',
      },
    ],
  },

  'OL3D-EQP-DMM-0001': {
    assetId: 'OL3D-EQP-DMM-0001',
    technicalStandard: 'IEC 61010-1 CAT II · Hình 1.5 trang 6 & Bài 11, 12 SGK KHTN 9',
    exactDimensionsSpec:
      'Kích thước thân máy: 145 × 74 × 38 mm (hoặc dòng lớn 183 × 90 × 47 mm) · Màn hình LCD 3½ chữ số (Max 1999)',
    weightOrCapacitySpec: 'Đo DCV: 200mV–600V · DCA: 200µA–10A · Điện trở Ω: 200Ω–2MΩ · Khối lượng: 220 g',
    synthesizedFeatures: [
      'Tích hợp Vôn kế, Ampe kế và Ôm kế trong một thiết bị hiện số duy nhất kèm núm xoay chọn thang đo.',
      '3 giắc cắm que đo chuyên biệt: COM (Đen chung), V/Ω/mA (Đỏ tiêu chuẩn) và 10A DC (Đỏ dòng lớn).',
      'Dùng trong Bài 11 (Định luật Ohm, điện trở dây dẫn) và Bài 12 (Đoạn mạch nối tiếp, song song) của SGK KHTN 9.',
    ],
    fiveWebSources: [
      {
        siteName: 'DMKLab — Đồng hồ Đo điện Đa năng Hiện số',
        domain: 'dmklab.vn',
        verifiedSpecSummary:
          'Đồng hồ vạn năng điện tử dùng trong trường học: Màn hình LCD lớn, đo điện áp DC/AC, dòng điện DC đến 10A và điện trở Ω.',
      },
      {
        siteName: 'LXI Education — Hướng dẫn Thực hành Điện học 9',
        domain: 'lxi.edu.vn',
        verifiedSpecSummary:
          'Cách chọn thang đo DCV, DCA và Ω trên đồng hồ đo điện đa năng (Hình 1.5 SGK KHTN 9) và quy tắc mắc nối tiếp/song song.',
      },
      {
        siteName: 'Studocu Vietnam — Tài liệu KHTN 9 Kết nối tri thức',
        domain: 'studocu.vn',
        verifiedSpecSummary:
          'Tổng hợp dụng cụ Bài 1 KHTN 9: Đồng hồ đo điện đa năng giúp đo trực tiếp U, I, R với độ chính xác cao hơn đồng hồ kim.',
      },
      {
        siteName: 'VietValue — Thiết bị Điện học THCS',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Vỏ bọc cao su chống va đập màu vàng/xanh, tích hợp cầu chì tự phục hồi chống cháy hỏng khi học sinh cắm nhầm thang đo.',
      },
      {
        siteName: 'Innotec Việt Nam',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Đồng hồ đa năng hiện số chuẩn Thông tư 38/2021/TT-BGDĐT kèm bộ dây đo đầu cắm bắp chuối 4 mm.',
      },
    ],
  },

  'OL3D-EQP-COIL-0001': {
    assetId: 'OL3D-EQP-COIL-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Hình 1.6 trang 7 & Bài 14, 15 SGK KHTN 9',
    exactDimensionsSpec:
      'Cuộn dây: Đường kính ngoài Ø 65 mm, lòng rỗng Ø 32 mm, dài 60 mm (600 vòng dây đồng) · Nam châm thẳng N–S: 90 × 18 × 12 mm',
    weightOrCapacitySpec: '2 đèn LED (Đỏ & Xanh/Vàng) mắc song song ngược cực · Điện áp mở LED: ~1.8 V',
    synthesizedFeatures: [
      'Cuộn dây dẫn quấn dây đồng tráng men quanh ống nhựa trong suốt có lòng rỗng rộng để đưa thanh nam châm N–S dịch chuyển ra vào.',
      'Hai bóng đèn LED khác màu được mắc song song nhưng ngược chiều cực tính (Anode của LED 1 nối với Cathode của LED 2).',
      'Khi đưa cực Bắc (N) nam châm lại gần cuộn dây, LED 1 (Đỏ) lóe sáng; khi kéo nam châm ra xa, LED 2 (Xanh) lóe sáng, chứng minh trực quan sự xuất hiện và đổi chiều của dòng điện cảm ứng xoay chiều (Hình 1.6, Hình 14.2 SGK KHTN 9).',
    ],
    fiveWebSources: [
      {
        siteName: 'VietJack — SGK KHTN 9 Hình 1.6 & Bài 14',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Hình 1.6 trang 7 & Hình 14.2 trang 70 SGK KHTN 9: Cuộn dây dẫn có hai đèn LED mắc song song, ngược cực dùng phát hiện dòng điện cảm ứng.',
      },
      {
        siteName: 'Thư viện Vật lý Việt Nam',
        domain: 'thuvienvatly.com',
        verifiedSpecSummary:
          'Nguyên lý mạch 2 LED mắc song song ngược chiều: Mỗi LED chỉ cho dòng điện đi qua theo 1 chiều nên giúp xác định chiều dòng điện cảm ứng.',
      },
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Bộ thí nghiệm cảm ứng điện từ và tác dụng của dòng điện xoay chiều gồm cuộn dây gắn 2 đèn LED và nam châm vĩnh cửu.',
      },
      {
        siteName: 'VietValue — Thiết bị Điện từ THCS',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Cuộn dây 500–600 vòng dây đồng Ø 0.35 mm, lòng ống Ø 30–35 mm vừa thanh nam châm thẳng N–S.',
      },
      {
        siteName: 'Innotec Việt Nam',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Bảng hiển thị 2 LED siêu nhạy gắn ngay trên đỉnh khung cuộn dây giúp cả lớp quan sát rõ ánh sáng khi dịch chuyển nam châm.',
      },
    ],
  },

  'OL3D-EQP-DSH-0001': {
    assetId: 'OL3D-EQP-DSH-0001',
    technicalStandard: 'DIN 12903 · Thông tư 38/2021/TT-BGDĐT · Hình 1.7 trang 7 & Bài 26 SGK KHTN 9',
    exactDimensionsSpec:
      'Đường kính miệng bát sứ: Ø 85 mm · Chiều cao bát: 38 mm · Độ dày thành sứ: 2.8 mm · Có mỏ rót',
    weightOrCapacitySpec: 'Dung tích danh định: 75 ml (hoặc 100 ml) · Chịu nhiệt độ nung tối đa: 1150 °C',
    synthesizedFeatures: [
      'Chế tạo từ sứ kỹ thuật tráng men trắng bóng bên trong và ngoài (trừ vành đáy mộc), chịu được nhiệt độ ngọn lửa trực tiếp mà không nứt vỡ.',
      'Dùng trong Bài 26 SGK KHTN 9 để thực hành phản ứng đốt cháy Ethylic alcohol (C₂H₅OH) với ngọn lửa xanh – vàng ấm và cô cạn dung dịch muối.',
      'Cho phép bật/tắt hiệu ứng ngọn lửa đốt cồn trực tiếp trong lòng bát sứ 3D.',
    ],
    fiveWebSources: [
      {
        siteName: 'RedLab — Bát sứ Cô đặc Có mỏ Phòng thí nghiệm',
        domain: 'redlab.com.vn',
        verifiedSpecSummary:
          'Bát sứ nung/cô cạn dung dịch 75–100 ml: Đường kính miệng Ø 80–90 mm, chiều cao 35–40 mm, sứ chịu nhiệt > 1000 °C.',
      },
      {
        siteName: 'VinaMTSC — Dụng cụ Sứ Thí nghiệm',
        domain: 'vinamtsc.com',
        verifiedSpecSummary:
          'Bát sứ giáo khoa phổ thông Ø 80 mm × cao 40 mm, lòng tráng men kháng axit và kiềm nóng.',
      },
      {
        siteName: 'VietJack — SGK KHTN 9 Hình 1.7 & Bài 26',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Hình 1.7 trang 7 và Bài 26 (Ethylic alcohol): Dùng bát sứ để đốt cháy một lượng nhỏ cồn tuyệt đối an toàn.',
      },
      {
        siteName: 'VietChem — Thiết bị Hóa học',
        domain: 'vietchem.com.vn',
        verifiedSpecSummary:
          'Hướng dẫn sử dụng kẹp sắt gắp bát sứ đang nóng và đặt trên đế sứ/lưới amiăng sau khi nung.',
      },
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Bát sứ chịu nhiệt thuộc danh mục dụng cụ thí nghiệm Hóa học bắt buộc cấp THCS.',
      },
    ],
  },

  'OL3D-EQP-SEP-0001': {
    assetId: 'OL3D-EQP-SEP-0001',
    technicalStandard: 'ISO 4800 · DIN 12451 (Squibb Pear-Shape) · Hình 1.8b trang 7 SGK KHTN 9',
    exactDimensionsSpec:
      'Đường kính lớn nhất bầu quả lê: Ø 68 mm · Chiều cao tổng thể phễu: 235 mm · Cổ mài chuẩn NS 19/26 · Khóa PTFE',
    weightOrCapacitySpec: 'Dung tích danh định: 125 ml (hoặc 100 ml) · Khối lượng cả giá đỡ: 420 g',
    synthesizedFeatures: [
      'Bầu thủy tinh Borosilicate 3.3 hình quả lê (Squibb) giúp phân tách ranh giới hai lớp chất lỏng không hòa tan vào nhau (như dầu ăn nổi trên nước hoặc este/nước) rõ nét.',
      'Trang bị khóa vòi bằng nhựa PTFE (Teflon) xoay nhẹ không cần bôi mỡ và nút nhám kín khí ở cổ phễu.',
      'Mô hình 3D thể hiện trực quan 2 tầng chất lỏng tách lớp: lớp chất lỏng nhẹ màu vàng hổ phách ở trên và lớp nước trong suốt ở dưới.',
    ],
    fiveWebSources: [
      {
        siteName: 'Labee Việt Nam — Phễu chiết Quả lê Thủy tinh',
        domain: 'labee.vn',
        verifiedSpecSummary:
          'Phễu chiết 100–125 ml (ISO 4800): Đường kính bầu Ø 60–68 mm, chiều cao 220–245 mm, cổ mài chuẩn NS 19/26, khóa PTFE.',
      },
      {
        siteName: 'VietChem — Dụng cụ Tách chất',
        domain: 'vietchem.com.vn',
        verifiedSpecSummary:
          'Nguyên tắc chiết lỏng–lỏng bằng phễu chiết: Mở nắp trên trước khi vặn khóa xả lớp chất lỏng nặng ở dưới.',
      },
      {
        siteName: 'VietJack — SGK KHTN 9 Hình 1.8b trang 7',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Hình 1.8b trang 7 SGK KHTN 9: Phễu chiết dùng để tách các chất lỏng không tan vào nhau và tách lớp.',
      },
      {
        siteName: 'Visitech Việt Nam',
        domain: 'visitech.vn',
        verifiedSpecSummary:
          'Phễu chiết Borosilicate 3.3 lắp trên vòng đỡ sắt của giá thí nghiệm, bên dưới đặt cốc thủy tinh hứng.',
      },
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Phễu chiết 100–125 ml có khóa thuộc danh mục dụng cụ Hóa học cấp THCS.',
      },
    ],
  },

  'OL3D-EQP-DST-0001': {
    assetId: 'OL3D-EQP-DST-0001',
    technicalStandard: 'DIN 12394 · Thông tư 38/2021 · Hình 1.9 & 1.10 trang 7–8 SGK KHTN 9',
    exactDimensionsSpec:
      'Bình cầu có nhánh 250 ml: Bầu Ø 85 mm × cao 170 mm, nhánh nghiêng Ø 8 mm · Lưới tản nhiệt: 140 × 140 mm · Đèn cồn: Ø 75 mm',
    weightOrCapacitySpec: 'Dung tích bình cầu: 250 ml · Dung tích đèn cồn: 150 ml · Khối lượng tổ hợp: 540 g',
    synthesizedFeatures: [
      'Tổ hợp hoàn chỉnh theo đúng Hình 1.9 và Hình 1.10 trang 7–8 SGK KHTN 9: Đèn cồn thủy tinh → Kiềng & Lưới tản nhiệt → Bình cầu có nhánh dẫn hơi qua ống sinh hàn.',
      'Lưới tản nhiệt thép không gỉ có tâm gốm chịu nhiệt giúp phân bố đều nhiệt lượng lên đáy tròn của bình cầu, chống nứt vỡ thủy tinh.',
      'Dùng tách hỗn hợp chất lỏng có nhiệt độ sôi khác nhau (như chưng cất rượu etylic - nước hoặc điều chế nước cất).',
    ],
    fiveWebSources: [
      {
        siteName: 'Nhà sách Giáo dục — Bình cầu có nhánh 250ml',
        domain: 'nhasachgiaoduc.vn',
        verifiedSpecSummary:
          'Bình cầu có nhánh 250 ml chuẩn KHTN 9: Đường kính bầu Ø 84–85 mm, chiều cao 165–170 mm, cổ Ø 28 mm, nhánh thoát hơi Ø 6–8 mm.',
      },
      {
        siteName: 'Visitech — Bộ Dụng cụ Chưng cất Đơn giản',
        domain: 'visitech.vn',
        verifiedSpecSummary:
          'Cấu tạo bình cầu có nhánh (Distilling Flask) kết hợp nhiệt kế cắm ở cổ bình và ống sinh hàn nước.',
      },
      {
        siteName: 'Innotec Việt Nam',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Lưới tản nhiệt 140×140 mm và đèn cồn thủy tinh 150 ml có chụp dập lửa an toàn theo Thông tư 38/2021.',
      },
      {
        siteName: 'VietChem — Kỹ thuật Chưng cất Phòng thí nghiệm',
        domain: 'vietchem.com.vn',
        verifiedSpecSummary:
          'Quy tắc lắp ống sinh hàn: Nước làm lạnh luôn đi vào từ vòi thấp và đi ra ở vòi cao (ngược chiều dòng hơi ngưng tụ).',
      },
      {
        siteName: 'VietJack — SGK KHTN 9 Hình 1.9 & 1.10 trang 7–8',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Hình 1.9 (Bình cầu có nhánh) và Hình 1.10 (Lưới tản nhiệt trong bộ dụng cụ đun nóng chất lỏng / chưng cất).',
      },
    ],
  },

  'OL3D-EQP-MIC-0001': {
    assetId: 'OL3D-EQP-MIC-0001',
    technicalStandard: 'ISO 8039 · Thông tư 38/2021/TT-BGDĐT · Hình 1.11 trang 8 & Bài 42 SGK KHTN 9',
    exactDimensionsSpec:
      'Kính hiển vi: 160 × 195 × 295 mm (Chiều dài ống quang học chuẩn 160 mm) · Lam kính tiêu bản NST: 25.4 × 76.2 × 1.1 mm',
    weightOrCapacitySpec: 'Độ phóng đại: 100x – 400x – 1000x (Thị kính 10x · 3 Vật kính 10x, 40x, 100x) · Khối lượng: 2.4 kg',
    synthesizedFeatures: [
      'Kính hiển vi quang học 1 ống ngắm nghiêng 45°, mâm xoay 3 vật kính tiêu sắc (10x vành vàng, 40x vành xanh lam, 100x vành trắng).',
      'Bàn sa trượt cơ khí có kẹp giữ tiêu bản cố định Nhiễm sắc thể (NST), ốc điều chỉnh thô (đại cấp) và ốc vi cấp đồng trục, đèn LED chiếu sáng dưới bàn kính.',
      'Đi kèm hộp tiêu bản cố định Nhiễm sắc thể (Bài 42 SGK KHTN 9) giúp học sinh xoay mâm vật kính 10x → 40x → 100x để quan sát hình thái NST ở kì giữa.',
    ],
    fiveWebSources: [
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Kính hiển vi quang học dùng cho môn KHTN cấp THCS: Thị kính 10x, vật kính 10x, 40x (và 100x), có đèn chiếu sáng và ốc vi cấp.',
      },
      {
        siteName: 'Tín Đức — Kính hiển vi Quang học Giáo dục',
        domain: 'tinduc.vn',
        verifiedSpecSummary:
          'Thông số quang học chuẩn: Chiều dài ống cơ học 160 mm, tiêu bản lam kính chuẩn quốc tế 25.4 × 76.2 mm, lamen dày 0.17 mm.',
      },
      {
        siteName: 'Studocu Vietnam — Thực hành Quan sát Tiêu bản NST (Bài 42 KHTN 9)',
        domain: 'studocu.vn',
        verifiedSpecSummary:
          'Quy trình 2 bước soi tiêu bản NST: Chọn vật kính 10x tìm vùng có tế bào phân chia trước, sau đó xoay sang vật kính 40x để quan sát rõ hình dạng NST.',
      },
      {
        siteName: 'Luật Việt Nam — Tiêu chuẩn Thiết bị Sinh học THCS',
        domain: 'luatvietnam.vn',
        verifiedSpecSummary:
          'Bộ tiêu bản cố định Nhiễm sắc thể (NST người và tế bào rễ hành) đi kèm kính hiển vi trong Chương XII Di truyền NST.',
      },
      {
        siteName: 'MBWS — Thiết bị Khoa học Trường học',
        domain: 'mbws.vn',
        verifiedSpecSummary:
          'Cấu tạo chi tiết kính hiển vi học sinh: Thân chữ C đúc hợp kim, bàn kính 110×120 mm, tụ quang NA 0.65.',
      },
    ],
  },

  'OL3D-EQP-DNA-0001': {
    assetId: 'OL3D-EQP-DNA-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · Hình 38.1 Bài 38 SGK KHTN 9 (Nucleic acid & Gen)',
    exactDimensionsSpec:
      'Kích thước mô hình chuẩn: Ø 110–200 mm × Cao 280–600 mm · Tỷ lệ mô phỏng thực tế: R_xoắn = 10 Å (20 Å đường kính), Chu kì = 34 Å (10 cặp nu)',
    weightOrCapacitySpec: 'Cấu trúc 2 mạch polynucleotide xoắn kép song song ngược chiều · 4 loại nu: A – T, G – C',
    synthesizedFeatures: [
      'Mô hình không gian 3 chiều của phân tử DNA theo mẫu Watson – Crick với hai dải băng xoắn kép song song ngược chiều (3\'→5\' và 5\'→3\').',
      'Các bậc thang ngang thể hiện các cặp nitrogenous base liên kết theo đúng Nguyên tắc bổ sung (NTBS): Adenine (A - Đỏ) liên kết với Thymine (T - Vàng) bằng 2 liên kết hydrogen; Guanine (G - Xanh lá) liên kết với Cytosine (C - Xanh lam) bằng 3 liên kết hydrogen.',
      'Giúp học sinh quan sát trực quan cấu trúc không gian, chu kì xoắn (10 cặp nucleotide = 34 Å) trong Bài 38 SGK KHTN 9.',
    ],
    fiveWebSources: [
      {
        siteName: 'STB Việt Nam — Mô hình Cấu trúc Phân tử ADN',
        domain: 'stb.com.vn',
        verifiedSpecSummary:
          'Mô hình cấu trúc không gian phân tử ADN: Đường kính vòng xoắn mô phỏng 20 Å, chiều cao mỗi chu kì xoắn 34 Å gồm 10 cặp nucleotide.',
      },
      {
        siteName: 'Innotec Việt Nam — Thiết bị Sinh học THCS',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Mô hình phân tử DNA lắp ghép trên trụ inox và đế nhựa ABS, phân biệt 4 màu sắc chuẩn cho các base A, T, G, C.',
      },
      {
        siteName: 'Thiết bị Y tế & Giáo dục Huê Lợi',
        domain: 'tbytehueloi.com',
        verifiedSpecSummary:
          'Mô hình chuỗi xoắn kép ADN phục vụ giảng dạy phần Di truyền và Biến dị môn Khoa học tự nhiên lớp 9.',
      },
      {
        siteName: 'Thiết bị Giáo dục Thái Sơn',
        domain: 'thietbigiaoducthaison.com',
        verifiedSpecSummary:
          'Minh họa trực quan nguyên tắc bổ sung (A–T, G–C) và cấu trúc đa phân của đại phân tử sinh học DNA.',
      },
      {
        siteName: 'VietJack — SGK KHTN 9 Bài 38 (Nucleic acid và ứng dụng)',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Hình 38.1 SGK KHTN 9: Mô hình cấu trúc một đoạn phân tử DNA xoắn kép và khác biệt giữa DNA với RNA.',
      },
    ],
  },

  'OL3D-EQP-WDP-1000': {
    assetId: 'OL3D-EQP-WDP-1000',
    technicalStandard: 'ISO 4796-3 · DIN 12039 · Thông tư 38/2021/TT-BGDĐT (Bình cấp nước cất có vòi khóa định lượng)',
    exactDimensionsSpec:
      'Thân bình trụ Borosilicate 3.3: Ø 136 mm × Cao 210 mm · Chân đế 3 trụ Inox cao 110 mm · Nắp vặn chuẩn GL45 xanh · Cụm van khóa PTFE kèm đồng hồ lưu lượng LCD kép',
    weightOrCapacitySpec: 'Dung tích danh định: 1000 ml (ĐCNN vạch thân: 100 ml · ĐCNN van điện tử: 0.5 ml) · Khối lượng khô: 650 g',
    synthesizedFeatures: [
      'Bình trụ thủy tinh Borosilicate 3.3 dung tích 1000 ml đặt trên giá đỡ 3 chân cao 110 mm giúp đặt vừa mọi loại Ống đong, Cốc thủy tinh 250 ml, Bình tràn và Bình tam giác ngay dưới vòi xả.',
      'Tích hợp cụm van khóa PTFE có tay gạt xoay 90° và đồng hồ đo thể tích LCD kỹ thuật số ở cả mặt trước và mặt sau (360°).',
      'Cho phép học sinh nhập trực tiếp số ml cần lấy trên bảng điều khiển để mở van xả chính xác thể tích nước mong muốn (ví dụ: 50 ml vào Ống đong hoặc 210 ml vào Bình tràn).',
    ],
    fiveWebSources: [
      {
        siteName: 'DWK Life Sciences (DURAN®) — Aspirator Bottles with Stopcock ISO 4796-3',
        domain: 'dwk.com',
        verifiedSpecSummary:
          'Bình trữ nước cất có vòi xả đáy (Aspirator bottle) 1000 ml chuẩn ISO 4796-3: Cổ vặn GL45, thủy tinh Borosilicate 3.3, khóa PTFE chống rò rỉ.',
      },
      {
        siteName: 'BrandTech Scientific — Dispensette® & Volumetric Liquid Dispensing',
        domain: 'brandtech.com',
        verifiedSpecSummary:
          'Cơ chế cấp chất lỏng định lượng chính xác theo thể tích ml đặt trước, giúp chuẩn bị mẫu nhanh và tránh sai số khi đong thủ công.',
      },
      {
        siteName: 'VietChem — Bình Đựng Nước Cất Có Vòi Xả Phòng Thí Nghiệm',
        domain: 'vietchem.com.vn',
        verifiedSpecSummary:
          'Bình chứa nước cất 1000 ml – 2000 ml có van khóa dưới đáy dùng cấp nước cho ống đong, cốc đốt và bình tràn trong phòng thực hành KHTN.',
      },
      {
        siteName: 'Labee Việt Nam — Dụng Cụ Thủy Tinh & Cấp Lỏng Định Lượng',
        domain: 'labee.vn',
        verifiedSpecSummary:
          'Vạch chia thể tích in men trắng bền nhiệt từ 100 ml đến 1000 ml, chân đế nâng cao giúp đặt cốc hứng 250 ml thuận tiện.',
      },
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Hệ thống cấp nước và dụng cụ đo thể tích phục vụ các bài thực hành Đo khối lượng riêng và Tác dụng của chất lỏng lên vật nhúng chìm.',
      },
    ],
  },

  'OL3D-EQP-LEV-0001': {
    assetId: 'OL3D-EQP-LEV-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · SGK KHTN 8 (Bài 18: Tác dụng làm quay của lực - Đòn bẩy)',
    exactDimensionsSpec:
      'Thanh đòn bẩy: 400 × 18 × 4 mm (18 lỗ treo chia đều 2 bên, bước lỗ 20 mm) · Chiều cao giá đỡ: 360 mm · Chân đế gang: 140 × 120 × 22 mm',
    weightOrCapacitySpec: 'Khối lượng toàn bộ: 680 g · Góc quay giới hạn: -30° đến +30° · Tải trọng an toàn mỗi bên: 5.0 N (10 quả cân 50g)',
    synthesizedFeatures: [
      'Thanh hợp kim nhôm định hình mạ Anode xước mờ, chia vạch đối xứng 18 lỗ treo cách đều tâm quay O đúng 20 mm.',
      'Hai đai ốc ren M4 bằng đồng thau khía nhám ở 2 đầu giúp vi chỉnh cân bằng zero trước khi làm thí nghiệm.',
      'Cung chia độ góc nghiêng tại ổ trục hiển thị trực quan góc lệch và vạch 0° dạ quang khi đạt thăng bằng ngang.',
      'Trục quay ma sát siêu thấp ăn khớp cữ hãm cơ học giới hạn góc nghiêng an toàn trong khoảng [-30°, +30°].',
    ],
    fiveWebSources: [
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Danh mục thiết bị dạy học môn KHTN THCS: Bộ đòn bẩy có giá đỡ, thanh chia vạch đối xứng dài 400mm kèm quả cân có móc.',
      },
      {
        siteName: 'Thiết bị Giáo dục VietValue',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Bộ đòn bẩy thực hành Vật lí 8: Thanh hợp kim nhôm đục lỗ 20mm, đĩa chia độ ±30°, giá sắt chân đế gang vững chắc.',
      },
      {
        siteName: 'VietJack — SGK KHTN 8 Kết nối tri thức',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Thí nghiệm khảo sát quy tắc mômen đòn bẩy: Treo quả nặng vào các lỗ và so sánh tích F1.d1 với F2.d2.',
      },
      {
        siteName: 'Innotec Việt Nam — Thiết bị Dạy học',
        domain: 'innotec.com.vn',
        verifiedSpecSummary:
          'Giá đỡ trục quay đòn bẩy có vít cân bằng, chịu tải 5N mỗi bên, bề mặt mạ kẽm/sơn tĩnh điện cao cấp.',
      },
      {
        siteName: 'Thư viện Vật lý Việt Nam',
        domain: 'thuvienvatly.com',
        verifiedSpecSummary:
          'Quy tắc mômen lực M = F.d và bài toán thăng bằng thanh chắn đường, bập bênh, cân đòn.',
      },
    ],
  },

  'OL3D-EQP-HYD-0001': {
    assetId: 'OL3D-EQP-HYD-0001',
    technicalStandard: 'Thông tư 38/2021/TT-BGDĐT · SGK KHTN 8 (Bài 16: Áp suất chất lỏng - Bình thông nhau)',
    exactDimensionsSpec:
      'Kích thước bao: 160 × 180 × 55 mm · Ống đáy ngang: Ø 14 × 130 mm · Nhánh thẳng: Ø 12 × 150 mm · Nhánh sóng: Ø 10 mm · Nhánh phình: Ø 30 mm · Đế: 160 × 55 × 20 mm',
    weightOrCapacitySpec: 'Khối lượng vỏ rỗng: 165 g · Dung tích: 150 ml · Khi đổ đầy nước: 315 g (165g + 150g nước)',
    synthesizedFeatures: [
      'Bộ bình thông nhau 3 nhánh liền khối bằng thủy tinh Borosilicate chịu lực trong suốt.',
      '3 nhánh mang 3 hình dạng điển hình: ống thẳng đối chứng, ống uốn lượn sóng và ống phình quả trám.',
      'Minh chứng định luật tĩnh học chất lỏng p = p0 + d.h: áp suất tại đáy thông nhau bằng nhau dẫn đến mặt thoáng luôn cùng độ cao.',
      'Chân đế nhựa PP đúc rãnh chữ U kẹp giữ bình đứng vững chắc trên mặt bàn không rung lắc.',
    ],
    fiveWebSources: [
      {
        siteName: 'Thư viện Pháp luật (Thông tư 38/2021/TT-BGDĐT)',
        domain: 'thuvienphapluat.vn',
        verifiedSpecSummary:
          'Danh mục thiết bị dạy học tối thiểu THCS môn KHTN: Bộ bình thông nhau có từ 3 nhánh dị hình gắn trên đế nhựa.',
      },
      {
        siteName: 'Thiết bị Giáo dục VietValue',
        domain: 'vietvalue.edu.vn',
        verifiedSpecSummary:
          'Bình thông nhau 3 nhánh thủy tinh thực hành KHTN 8: Dung tích 150ml, có nhánh thẳng, nhánh xoắn và nhánh cầu phình.',
      },
      {
        siteName: 'VietJack — SGK KHTN 8 Kết nối tri thức',
        domain: 'vietjack.com',
        verifiedSpecSummary:
          'Thí nghiệm Hình 16.3: Rót nước màu vào bình thông nhau và nhận xét độ cao mực chất lỏng ở các nhánh.',
      },
      {
        siteName: 'DMKLab — Dụng cụ Khoa học',
        domain: 'dmklab.vn',
        verifiedSpecSummary:
          'Bộ bình thông nhau thủy tinh borosilicate kèm đế nhựa chuyên dụng cho giáo dục phổ thông.',
      },
      {
        siteName: 'Thư viện Vật lý',
        domain: 'thuvienvatly.com',
        verifiedSpecSummary:
          'Ứng dụng bình thông nhau trong đời sống: Ấm trà, ống đo mực nước nồi hơi, hệ thống cấp nước đô thị.',
      },
    ],
  },
};

export interface FunctionalEnvironmentalAuditSpec {
  assetId: string;
  omnidirectionalReadout360: string;
  coreInteractiveFunctions: string[];
  environmentalAndCrossToolInteractions: string[];
}

export const EQUIPMENT_FUNCTIONAL_AND_ENV_AUDITS: Record<
  string,
  FunctionalEnvironmentalAuditSpec
> = {
  'OL3D-EQP-BAL-0001': {
    assetId: 'OL3D-EQP-BAL-0001',
    omnidirectionalReadout360:
      '4 màn hình LCD kỹ thuật số đồng bộ (Mặt trước nghiêng, Mặt sau đối diện 180°, Hai bên hông 90°/270°) + Nhãn nổi 3D và Tooltip con trỏ hiển thị tổng khối lượng (g) ở mọi góc quay.',
    coreInteractiveFunctions: [
      'Cân cộng dồn chính xác nhiều vật cùng lúc trên đĩa cân (m_tổng = m₁ + m₂ + ... + m_n) với độ chia 0.01 g; khi nhấc bớt 1 vật ra chỉ trừ đúng khối lượng vật đó.',
      'Nút TARE (Trừ bì) đưa màn hình về 0.00 g hoặc nút "Dọn đĩa cân" nhấc toàn bộ các vật xuống bàn.',
      'Đĩa cân Inox Ø 130 mm tự động sắp xếp nhiều vật theo vòng tròn không chồng lấn, đàn hồi lún nhẹ 2.5 mm khi chịu tải và tự cập nhật toạ độ theo góc xoay Y (360°).',
    ],
    environmentalAndCrossToolInteractions: [
      'Tự động giữ tất cả các vật mẫu đang đặt trên đĩa cân di chuyển/xoay theo thân cân khi người dùng xoay hoặc kéo cân.',
      'Tính tổng khối lượng thực tế liên hoàn = ∑(Khối lượng khô dụng cụ + Khối lượng nước bên trong 1 ml = 1.00 g + Khối lượng vật rắn thả chìm bên trong bình đang đặt trên cân).',
      'Khi rót thêm nước hoặc thả thêm vật vào cốc/ống đong đang đặt trên đĩa cân, số chỉ trên 4 màn hình LCD của cân lập tức cộng dồn theo thời gian thực.',
    ],
  },
  'OL3D-EQP-CYL-0100': {
    assetId: 'OL3D-EQP-CYL-0100',
    omnidirectionalReadout360:
      'Vạch chia ml in bao quanh ống trụ thủy tinh 360° (DoubleSide) kết hợp vòng mặt khum (meniscus) nổi bật và nhãn số đo thể tích trực tiếp.',
    coreInteractiveFunctions: [
      'Đo thể tích chất lỏng từ 0 – 100 ml (ĐCNN 1 ml) với mặt thoáng cong tự nhiên.',
      'Nghiêng rót chất lỏng có tia nước 3D chảy sang cốc thủy tinh hoặc bình tam giác.',
      'Điều chỉnh nhanh mực nước chuẩn 50.0 ml hoặc thêm nước trực tiếp.',
    ],
    environmentalAndCrossToolInteractions: [
      'Nhận một hoặc nhiều mẫu vật rắn thả chìm vào lòng ống: mực nước tự động cộng dồn đúng bằng tổng thể tích các vật chiếm chỗ V₂ = V₁ + ∑ΔV_i.',
      'Cho phép đặt nguyên ống đong chứa nước (kèm các vật chìm bên trong) lên đĩa Cân điện tử để cân tổng khối lượng cộng dồn.',
      'Cho phép nhúng Nhiệt kế rượu vào lòng ống để đo nhiệt độ cột nước.',
    ],
  },
  'OL3D-EQP-CAN-0250': {
    assetId: 'OL3D-EQP-CAN-0250',
    omnidirectionalReadout360:
      'Thân thủy tinh Borosilicate trong suốt 360° thấy rõ mực nước ngang miệng vòi tràn và tia nước chảy qua vòi ở mọi hướng nhìn.',
    coreInteractiveFunctions: [
      'Đổ đầy nước ngang đúng miệng vòi tràn chuẩn (210.0 ml).',
      'Mô phỏng dòng nước tràn qua vòi nghiêng khi thả ngập vật rắn có kích thước lớn.',
    ],
    environmentalAndCrossToolInteractions: [
      'Tương tác ghép cặp với Cốc thủy tinh 250 ml đặt dưới vòi: khi thả vật rắn vào Bình tràn, lượng nước tràn ra chảy trực tiếp sang Cốc hứng đúng bằng ΔV.',
      'Hỗ trợ nhúng Nhiệt kế rượu kiểm tra nhiệt độ nước trong bình.',
    ],
  },
  'OL3D-EQP-BKR-0250': {
    assetId: 'OL3D-EQP-BKR-0250',
    omnidirectionalReadout360:
      'Vạch chia dung tích 50–250 ml hiển thị xuyên thấu 360° quanh thành cốc cùng nhãn thể tích (ml) theo thời gian thực.',
    coreInteractiveFunctions: [
      'Chứa, pha trộn dung dịch và hứng chất lỏng từ Bình tràn hoặc Phễu chiết.',
      'Kéo nghiêng thành cốc để rót 20 ml nước sang Ống đong, Bình tràn, Bát sứ hoặc Bình cầu.',
    ],
    environmentalAndCrossToolInteractions: [
      'Đặt lên đĩa Cân điện tử để cân khối lượng cốc rỗng hoặc cốc chứa nước (phối hợp phím TARE để cân riêng khối lượng nước).',
      'Hứng nước tự động từ vòi Bình tràn và nhận lớp chất lỏng chiết từ Phễu chiết.',
      'Tương tác với Nhiệt kế rượu khi nhúng bầu nhiệt kế vào cốc.',
    ],
  },
  'OL3D-EQP-DYN-0005': {
    assetId: 'OL3D-EQP-DYN-0005',
    omnidirectionalReadout360:
      'Hai bản thang đo Newton (0 – 5.0 N) đặt vuông góc chữ thập (0° và 90°, DoubleSide) bên trong ống trụ trong suốt + đĩa chỉ thị đỏ 360° giúp đọc lực ở mọi góc xoay.',
    coreInteractiveFunctions: [
      'Đo trọng lượng P = m·g và lực kéo đàn hồi với độ dãn lò xo tỷ lệ tuyến tính theo định luật Hooke.',
      'Nút hiệu chỉnh vạch 0 (0.00 N) đưa trục lò xo về vị trí cân bằng.',
    ],
    environmentalAndCrossToolInteractions: [
      'Tự động bắt dính các mẫu vật rắn hoặc quả cân vào móc treo dưới đáy và tính trọng lượng P = m × 9.81 m/s².',
      'Có thể treo lên kẹp của Giá thí nghiệm sắt để đo lực theo phương thẳng đứng.',
    ],
  },
  'OL3D-EQP-CAL-0150': {
    assetId: 'OL3D-EQP-CAL-0150',
    omnidirectionalReadout360:
      'Thang chia milimét (0 – 150 mm) hiển thị trên cả mặt trên, mặt trước và mặt sau thân thước thép + nhãn số đo điện tử 360°.',
    coreInteractiveFunctions: [
      'Trượt con chạy du xích để kẹp đo đường kính ngoài, chiều rộng và độ dày mẫu vật (ĐCNN 0.05 mm).',
      'Nút đóng hàm kẹp về vị trí chuẩn 0.0 mm.',
    ],
    environmentalAndCrossToolInteractions: [
      'Khi kéo bất kỳ vật mẫu rắn nào vào giữa hai mỏ kẹp, con chạy tự động khép sát kích thước thực của mẫu vật (mm) và báo kết quả đo.',
    ],
  },
  'OL3D-EQP-THM-0100': {
    assetId: 'OL3D-EQP-THM-0100',
    omnidirectionalReadout360:
      'Thang đo nhiệt độ (-10 °C đến 110 °C) ghép chữ thập 360° quanh ống mao quản thủy tinh + cột rượu màu đỏ co giãn chiều cao theo nhiệt độ thực.',
    coreInteractiveFunctions: [
      'Đo nhiệt độ môi trường phòng (25.0 °C), nhiệt độ sôi của cồn (78.5 °C) và nhiệt độ nước sôi (100.0 °C).',
      'Cột chất lỏng màu đỏ trong ống mao quản tự động dâng cao hoặc hạ thấp mượt mà theo số chỉ nhiệt độ.',
    ],
    environmentalAndCrossToolInteractions: [
      'Kéo thả Nhiệt kế vào Cốc nước, Ống đong, Bát sứ hoặc Bình cầu chưng cất để đo trực tiếp nhiệt độ chất lỏng trong bình (25.0 °C khi tắt lửa, 78.5 °C khi đang đun nóng).',
    ],
  },
  'OL3D-EQP-WGT-0100': {
    assetId: 'OL3D-EQP-WGT-0100',
    omnidirectionalReadout360:
      'Thân trụ đồng thau đối xứng xoay tròn 360° kèm nhãn hiển thị khối lượng chuẩn 100.0 g và thể tích 11.8 cm³.',
    coreInteractiveFunctions: [
      'Quả cân chuẩn OIML M1 (100.00 g) dùng để kiểm định độ chính xác của Cân điện tử và Lực kế lò xo.',
    ],
    environmentalAndCrossToolInteractions: [
      'Đặt lên đĩa Cân điện tử hiển thị đúng 100.00 g; móc vào Lực kế lò xo hiển thị P = 0.98 N; thả vào Ống đong dâng thêm 11.8 cm³.',
    ],
  },
  'OL3D-EQP-SPC-0001': {
    assetId: 'OL3D-EQP-SPC-0001',
    omnidirectionalReadout360:
      'Hình trụ nhôm đối xứng trục 360° có khuyên móc trên đỉnh kèm nhãn thông số m = 66.25 g · V = 24.5 cm³.',
    coreInteractiveFunctions: [
      'Mẫu vật chuẩn xác định khối lượng riêng của Nhôm (ρ = 2.70 g/cm³).',
    ],
    environmentalAndCrossToolInteractions: [
      'Tương tác đầy đủ với 5 thiết bị đo: Cân điện tử (66.25 g), Ống đong (+24.5 ml), Bình tràn (tràn 24.5 ml sang cốc), Lực kế (0.65 N), Thước cặp (d = 25.0 mm).',
    ],
  },
  'OL3D-EQP-SPC-0002': {
    assetId: 'OL3D-EQP-SPC-0002',
    omnidirectionalReadout360:
      'Khối hộp chữ nhật đồng thau vát cạnh sắc nét 360° kèm nhãn thông số m = 168.0 g · V = 20.0 cm³.',
    coreInteractiveFunctions: [
      'Mẫu vật chuẩn xác định khối lượng riêng của Đồng thau (ρ = 8.40 g/cm³) bằng phương pháp đo kích thước hình học hoặc bình chia độ.',
    ],
    environmentalAndCrossToolInteractions: [
      'Đặt lên Cân điện tử (168.00 g), nhúng vào Ống đong/Bình tràn (+20.0 cm³), móc vào Lực kế (1.65 N) và kẹp Thước cặp (40.0 mm).',
    ],
  },
  'OL3D-EQP-SPC-0003': {
    assetId: 'OL3D-EQP-SPC-0003',
    omnidirectionalReadout360:
      'Viên bi cầu thép hợp kim phản xạ PBR 360° đặt trên vòng đệm cao su chống lăn kèm nhãn m = 110.5 g · V = 14.1 cm³.',
    coreInteractiveFunctions: [
      'Mẫu vật hình cầu xác định khối lượng riêng của Thép (ρ = 7.84 g/cm³) và công thức thể tích V = (4/3)πR³.',
    ],
    environmentalAndCrossToolInteractions: [
      'Kẹp Thước cặp đo đường kính d = 30.0 mm, cân trên Cân điện tử (110.50 g), thả vào Ống đong/Bình tràn (+14.1 cm³).',
    ],
  },
  'OL3D-EQP-SPC-0004': {
    assetId: 'OL3D-EQP-SPC-0004',
    omnidirectionalReadout360:
      'Ống trụ rỗng bằng đồng đỏ nhìn xuyên lòng ống 360° kèm nhãn m = 129.5 g · V = 14.5 cm³.',
    coreInteractiveFunctions: [
      'Mẫu vật nâng cao dùng để phân biệt thể tích phần đặc kim loại và thể tích hình học bao ngoài (ρ_Cu = 8.93 g/cm³).',
    ],
    environmentalAndCrossToolInteractions: [
      'Tương tác với Cân điện tử (129.50 g), Ống đong (+14.5 cm³), Bình tràn, Lực kế (1.27 N) và Thước cặp (đo đường kính ngoài 36.0 mm).',
    ],
  },
  'OL3D-EQP-FLK-0250': {
    assetId: 'OL3D-EQP-FLK-0250',
    omnidirectionalReadout360:
      'Thân bình tam giác thủy tinh trong suốt 360° chứa dung dịch chỉ thị màu xanh ngọc dễ quan sát từ mọi góc độ.',
    coreInteractiveFunctions: [
      'Chứa dung dịch chuẩn độ, lắc trộn phản ứng hóa học không văng bắn và nghiêng rót chất lỏng.',
    ],
    environmentalAndCrossToolInteractions: [
      'Rót chất lỏng qua lại với Cốc thủy tinh và Ống đong; đặt lên Cân điện tử để cân tổng khối lượng bình + dung dịch; đo nhiệt độ bằng Nhiệt kế.',
    ],
  },
  'OL3D-EQP-STD-0500': {
    assetId: 'OL3D-EQP-STD-0500',
    omnidirectionalReadout360:
      'Trụ thép mạ crôm cao 500 mm và khớp kẹp xoay 360° quan sát rõ từ mọi hướng trên bàn thí nghiệm.',
    coreInteractiveFunctions: [
      'Cố định lực kế lò xo, ống nghiệm, phễu chiết và bình cầu ở độ cao chuẩn xác.',
    ],
    environmentalAndCrossToolInteractions: [
      'Đóng vai trò trụ đỡ cơ học cho Lực kế lò xo, Phễu chiết và hệ thống đun nóng chưng cất.',
    ],
  },
  'OL3D-EQP-LNS-0100': {
    assetId: 'OL3D-EQP-LNS-0100',
    omnidirectionalReadout360:
      'Thấu kính thủy tinh hai mặt lồi trong suốt 360° gắn trên vành khung kim loại sơn tĩnh điện kèm nhãn tiêu cự f = +100 mm.',
    coreInteractiveFunctions: [
      'Hội tụ chùm tia sáng song song tại tiêu điểm chính F cách quang tâm O đúng 100 mm (Độ tụ D = +10 dp).',
    ],
    environmentalAndCrossToolInteractions: [
      'Phối hợp trực tiếp với Đèn phát tia laser 3 tia trên mặt bàn để khảo sát đường truyền của 3 tia sáng đặc biệt qua thấu kính hội tụ (Bài 8 & Bài 9 SGK KHTN 9).',
    ],
  },
  'OL3D-EQP-LSR-0001': {
    assetId: 'OL3D-EQP-LSR-0001',
    omnidirectionalReadout360:
      'Chùm 3 tia laser đỏ (650 nm) dạng khối trụ phát sáng 360° nổi bật trên mặt bàn gỗ ở mọi góc nhìn camera.',
    coreInteractiveFunctions: [
      'Bật/tắt nguồn phát 3 chùm tia sáng laser đỏ song song hoặc 1 tia đơn lẻ bằng công tắc trên thân đèn.',
    ],
    environmentalAndCrossToolInteractions: [
      'Chiếu chùm tia sáng xuyên qua Bản bán trụ thủy tinh, Lăng kính tam giác và Thấu kính hội tụ đặt phía trước đèn.',
    ],
  },
  'OL3D-EQP-SLB-0001': {
    assetId: 'OL3D-EQP-SLB-0001',
    omnidirectionalReadout360:
      'Bàn chia độ tròn 360° (vạch chia mỗi 10°) kết hợp bản bán trụ trong suốt và các tia tới (đỏ), tia khúc xạ (lục), tia phản xạ (vàng) hiển thị 360°.',
    coreInteractiveFunctions: [
      'Thay đổi góc tới i (20°, 40°, 60°) để kiểm chứng Định luật khúc xạ ánh sáng (n₁·sin i = n₂·sin r) và tìm góc tới hạn phản xạ toàn phần i_th ≈ 41.8°.',
    ],
    environmentalAndCrossToolInteractions: [
      'Khi góc tới i = 60° > 41.8°, tia khúc xạ biến mất hoàn toàn và toàn bộ ánh sáng bị phản xạ toàn phần ngay tại mặt phân cách bán trụ – không khí (Bài 5 & Bài 6 SGK KHTN 9).',
    ],
  },
  'OL3D-EQP-PRM-0001': {
    assetId: 'OL3D-EQP-PRM-0001',
    omnidirectionalReadout360:
      'Lăng kính tam giác đều (A = 60°) trong suốt cùng dải 7 tia màu quang phổ (Đỏ, Da cam, Vàng, Lục, Lam, Chàm, Tím) phát sáng 360°.',
    coreInteractiveFunctions: [
      'Bật/tắt chùm sáng trắng chiếu qua mặt bên lăng kính để quan sát hiện tượng tán sắc ánh sáng và góc lệch của từng tia đơn sắc.',
    ],
    environmentalAndCrossToolInteractions: [
      'Kết hợp với nguồn sáng trên bàn quang học minh họa tia đỏ lệch ít nhất và tia tím lệch nhiều nhất (Bài 7 SGK KHTN 9).',
    ],
  },
  'OL3D-EQP-MAG-0005': {
    assetId: 'OL3D-EQP-MAG-0005',
    omnidirectionalReadout360:
      'Thấu kính hội tụ tiêu cự ngắn (f = 50 mm, G = 5x) trong suốt 2 mặt 360° gắn khung bảo vệ có tay cầm.',
    coreInteractiveFunctions: [
      'Kính lúp cầm tay độ bội giác G = 5x dùng để phóng đại mẫu vật nhỏ, chi tiết thực vật và côn trùng.',
    ],
    environmentalAndCrossToolInteractions: [
      'Đặt gần các mẫu vật trên bàn thí nghiệm để quan sát ảnh ảo cùng chiều, lớn hơn vật (Bài 10 SGK KHTN 9).',
    ],
  },
  'OL3D-EQP-GAL-0001': {
    assetId: 'OL3D-EQP-GAL-0001',
    omnidirectionalReadout360:
      'Mặt chia độ vạch 0 ở giữa (-50..0..+50 µA) và kim chỉ thị màu đỏ được trang bị ở CẢ MẶT TRƯỚC VÀ MẶT SAU (180°) kèm nhãn số đo mA 360°.',
    coreInteractiveFunctions: [
      'Phát hiện dòng điện cảm ứng nhỏ và xác định chiều dòng điện dựa vào chiều lệch trái/phải của kim điện kế.',
    ],
    environmentalAndCrossToolInteractions: [
      'Đồng bộ tức thời với Cuộn dây dẫn có 2 đèn LED: khi đưa nam châm lại gần cuộn dây, kim điện kế lệch phải (+0.60 mA); khi kéo nam châm ra xa, kim lệch trái (-0.60 mA); khi nam châm đứng yên, kim chỉ đúng vạch 0 (Bài 14 SGK KHTN 9).',
    ],
  },
  'OL3D-EQP-DMM-0001': {
    assetId: 'OL3D-EQP-DMM-0001',
    omnidirectionalReadout360:
      'Màn hình LCD kỹ thuật số kép ở cả mặt trước và mặt lưng máy (360°) hiển thị rõ giá trị U (V), I (A), R (Ω) dù xoay máy theo hướng nào.',
    coreInteractiveFunctions: [
      'Chuyển đổi 3 chế độ đo: Hiệu điện thế một chiều (12.00 V), Cường độ dòng điện (0.75 A) và Điện trở dây dẫn (16.00 Ω).',
    ],
    environmentalAndCrossToolInteractions: [
      'Khảo sát sự phụ thuộc của cường độ dòng điện vào hiệu điện thế và xác định điện trở R = U / I = 12.00 / 0.75 = 16.0 Ω (Bài 11 SGK KHTN 9).',
    ],
  },
  'OL3D-EQP-IND-0001': {
    assetId: 'OL3D-EQP-IND-0001',
    omnidirectionalReadout360:
      '2 bóng đèn LED phát sáng 360° (LED 1 Đỏ và LED 2 Xanh) gắn trên đỉnh cuộn dây đồng cùng thanh nam châm vĩnh cửu hai cực Đỏ (N) – Xanh (S).',
    coreInteractiveFunctions: [
      'Điều khiển thanh nam châm dịch chuyển lại gần, ra xa hoặc đứng yên trước lòng cuộn dây dẫn kín.',
    ],
    environmentalAndCrossToolInteractions: [
      'Tự động phát tín hiệu cảm ứng điện từ sang Điện kế (Galvanometer) đặt trên bàn thí nghiệm và làm sáng luân phiên LED 1 / LED 2 theo chiều biến thiên từ thông (Bài 14 & Bài 15 SGK KHTN 9).',
    ],
  },
  'OL3D-EQP-evp-0001': {
    assetId: 'OL3D-EQP-evp-0001',
    omnidirectionalReadout360:
      'Bát sứ tráng men trắng đối xứng tròn 360° chứa cồn ethylic trong suốt và ngọn lửa cháy xanh – vàng nhìn rõ từ mọi hướng.',
    coreInteractiveFunctions: [
      'Châm lửa đốt cháy ethylic alcohol (C₂H₅OH) hoặc đậy nắp dập tắt ngọn lửa; cô cạn dung dịch muối.',
    ],
    environmentalAndCrossToolInteractions: [
      'Tương tác nhiệt với Nhiệt kế rượu (khi đun nóng nhiệt độ tăng lên 78.5 °C); nhận chất lỏng rót từ Cốc thủy tinh/Ống đong; có thể đặt lên Cân điện tử để cân khối lượng.',
    ],
  },
  'OL3D-EQP-SEP-0001': {
    assetId: 'OL3D-EQP-SEP-0001',
    omnidirectionalReadout360:
      'Bầu thủy tinh quả lê trong suốt 360° hiển thị rõ ranh giới phân lớp giữa chất lỏng nhẹ màu vàng (dầu/ester) ở trên và nước màu xanh ở dưới.',
    coreInteractiveFunctions: [
      'Mở khóa PTFE màu đỏ để chiết tách riêng lớp chất lỏng nặng phía dưới (-30 ml mỗi lần chiết) hoặc nạp thêm hỗn hợp lỏng.',
    ],
    environmentalAndCrossToolInteractions: [
      'Khi mở khóa chiết, lớp chất lỏng phía dưới chảy trực tiếp vào Cốc thủy tinh 250 ml đặt trên bàn làm tăng mực nước trong cốc.',
    ],
  },
  'OL3D-EQP-DST-0250': {
    assetId: 'OL3D-EQP-DST-0250',
    omnidirectionalReadout360:
      'Bình cầu có nhánh thủy tinh Borosilicate trong suốt 360° đặt trên kiềng đun 3 chân, lưới tản nhiệt và đèn cồn phát sáng toàn hướng.',
    coreInteractiveFunctions: [
      'Bật/tắt ngọn lửa đèn cồn dưới lưới tản nhiệt để đun sôi và chưng cất hỗn hợp chất lỏng qua nhánh dẫn khí.',
    ],
    environmentalAndCrossToolInteractions: [
      'Tương tác nhiệt với Nhiệt kế rượu (đo điểm sôi 78.5 °C / 100.0 °C) và nhận thêm dung dịch rót từ Cốc thủy tinh.',
    ],
  },
  'OL3D-EQP-MIC-0001': {
    assetId: 'OL3D-EQP-MIC-0001',
    omnidirectionalReadout360:
      'Thân kính hiển vi sơn tĩnh điện kết hợp mâm xoay 3 vật kính (10x Vàng, 40x Xanh, 100x Trắng) và nhãn độ phóng đại hiển thị 360°.',
    coreInteractiveFunctions: [
      'Xoay mâm vật kính chuyển đổi giữa 3 mức phóng đại 10x, 40x và 100x để soi tiêu bản cố định Nhiễm sắc thể trên bàn kính.',
    ],
    environmentalAndCrossToolInteractions: [
      'Tích hợp sẵn lam kính tiêu bản Nhiễm sắc thể nhuộm tím trên bàn sa trượt cơ học phục vụ thực hành Bài 42 SGK KHTN 9.',
    ],
  },
  'OL3D-EQP-DNA-0001': {
    assetId: 'OL3D-EQP-DNA-0001',
    omnidirectionalReadout360:
      'Cấu trúc xoắn kép không gian 3 chiều đối xứng trục 360° hiển thị rõ 2 mạch đường – phosphate và các cặp base A–T, G–C ở mọi góc nhìn.',
    coreInteractiveFunctions: [
      'Xoay 360° quanh trục đứng để đếm số cặp nucleotide trong một chu kì xoắn (10 cặp = 34 Å, đường kính 20 Å).',
    ],
    environmentalAndCrossToolInteractions: [
      'Phối hợp trực quan với Kính hiển vi quang học trong chủ đề Di truyền học (Bài 38 & Bài 42 SGK KHTN 9).',
    ],
  },
  'OL3D-EQP-WDP-1000': {
    assetId: 'OL3D-EQP-WDP-1000',
    omnidirectionalReadout360:
      'Thân bình thủy tinh trong suốt có vạch chia 100–1000 ml nhìn xuyên 360° + 2 màn hình LCD lưu lượng ở cả mặt trước và mặt sau cụm van.',
    coreInteractiveFunctions: [
      'Bảng điều khiển nhập trực tiếp số ml cần lấy (ô nhập số + nút chọn nhanh 10, 20, 25, 50, 100, 210 ml) để mở van xả thêm (+ml) hoặc đặt chuẩn (=ml).',
      'Tự động xoay tay gạt van PTFE và hiển thị dòng nước 3D chảy từ vòi xuống bình hứng khi mở van; nút nạp đầy lại bình chứa 1000 ml.',
    ],
    environmentalAndCrossToolInteractions: [
      'Tự động di chuyển Ống đong, Cốc thủy tinh, Bình tràn hoặc Bình tam giác vào đúng vị trí dưới vòi xả và cập nhật mực nước thực tế trong bình nhận.',
      'Nếu xả vượt mức vòi của Bình tràn (210.0 ml), phần nước dư tự động chảy tràn qua vòi Bình tràn sang Cốc hứng bên cạnh.',
    ],
  },
  'OL3D-EQP-LEV-0001': {
    assetId: 'OL3D-EQP-LEV-0001',
    omnidirectionalReadout360:
      'Góc nghiêng đòn bẩy và trạng thái thăng bằng đọc trực tiếp trên cung độ 2 mặt trước và sau đồng bộ thời gian thực.',
    coreInteractiveFunctions: [
      'Vặn đai ốc vi chỉnh 2 đầu để lấy thăng bằng ban đầu (kim về vạch 0° màu xanh lục).',
      'Treo quả nặng vào các lỗ từ 1 đến 9 để kiểm chứng quy tắc mômen F1.d1 = F2.d2.',
      'Điều chỉnh góc nghiêng khảo sát dao động giảm chấn quanh vị trí cân bằng bền.',
    ],
    environmentalAndCrossToolInteractions: [
      'Có thể đặt toàn bộ giá đòn bẩy lên cân điện tử để đo khối lượng tổng 680.00 g.',
      'Treo kết hợp với Lực kế lò xo 5N để đo lực kéo thực tế tác dụng tại từng cánh tay đòn.',
    ],
  },
  'OL3D-EQP-HYD-0001': {
    assetId: 'OL3D-EQP-HYD-0001',
    omnidirectionalReadout360:
      'Mặt thoáng chất lỏng và vạch cao độ nhìn rõ 360° xuyên qua thành thủy tinh trong suốt, đảm bảo đọc mực nước chính xác từ mọi hướng.',
    coreInteractiveFunctions: [
      'Rót nước vào bất kỳ nhánh nào và quan sát cả 3 nhánh đồng thời dâng lên cùng mặt phẳng nằm ngang.',
      'Chuyển đổi các mức thể tích nước từ 0 ml đến 150 ml bằng thanh trượt điều khiển.',
      'Đặt lên cân điện tử để cân tổng khối lượng vỏ bình cộng nước (165g + V*1.0 g/ml).',
    ],
    environmentalAndCrossToolInteractions: [
      'Đặt lên Cân điện tử OHAUS Scout: Khối lượng tự động nhảy từ 165.00 g (khi rỗng) lên 240.00 g (75 ml) và 315.00 g (150 ml).',
      'Nhận nước rót từ Cốc thủy tinh 250 ml hoặc Bình cấp nước.',
    ],
  },
};

