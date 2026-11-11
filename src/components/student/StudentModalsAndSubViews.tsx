import React from 'react';
import {
  AssetDefinition,
  EquipmentKit,
  TextbookReferenceMetadata,
} from '../../domain/types';
import {
  MULTI_SOURCE_EQUIPMENT_DOSSIERS,
  EQUIPMENT_FUNCTIONAL_AND_ENV_AUDITS,
} from '../../data/multiSourceEquipmentDossier';
import { EquipmentThumbnailSvg } from '../common/EquipmentThumbnailSvg';
import { EquipmentRealPhotoView } from '../common/EquipmentRealPhotoView';
import { MathFormula, RichMathText } from '../common/MathFormula';
import {
  X,
  ArrowLeft,
  FlaskConical,
  MousePointer,
  RotateCw,
  CheckCircle2,
  Package,
  Scale,
  Ruler,
  PlayCircle,
  BookOpen,
  AlertTriangle,
  Wrench,
  Globe,
  ShieldCheck,
  Camera,
} from 'lucide-react';

interface StudentKitsViewProps {
  kits: EquipmentKit[];
  assetsMap: Map<string, AssetDefinition>;
  onBackHome: () => void;
  onSelectKitAndStartLab: (kit: EquipmentKit) => void;
}

export const StudentKitsView: React.FC<StudentKitsViewProps> = ({
  kits,
  assetsMap,
  onBackHome,
  onSelectKitAndStartLab,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#EAF4FF] text-[#12346B] px-5 py-7 md:px-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#D4E6FF]">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackHome}
              className="px-4 py-2 rounded-[9px] bg-white hover:bg-[#F3F8FF] border border-[#D4E6FF] text-[14.5px] font-bold text-[#12346B] flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#1E6BFF]" />
              <span>Quay lại phòng thí nghiệm</span>
            </button>
            <h1 className="text-2xl font-extrabold text-[#12346B]">
              Bộ dụng cụ thí nghiệm ({kits.length})
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {kits.map((kit) => (
            <div
              key={kit.kitId}
              className="rounded-[14px] bg-white border border-[#D4E6FF] p-5 flex flex-col justify-between space-y-5 shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-bold text-[#1E6BFF]">
                      {kit.items.length} dụng cụ chuẩn
                    </div>
                    <h2 className="text-xl font-extrabold text-[#12346B] mt-0.5">
                      {kit.name.vi}
                    </h2>
                  </div>
                  <div className="w-12 h-12 rounded-[10px] bg-[#EAF4FF] border border-[#D4E6FF] flex items-center justify-center text-[#1E6BFF] shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {kit.items.map((item) => {
                    const asset = assetsMap.get(item.assetId);
                    if (!asset) return null;
                    return (
                      <div
                        key={`${kit.kitId}-${item.assetId}`}
                        className="p-2.5 rounded-[10px] bg-[#F3F8FF] border border-[#D4E6FF] flex flex-col items-center text-center gap-1.5"
                      >
                        <EquipmentThumbnailSvg
                          archetype={asset.geometry.proceduralArchetype}
                          className="w-16 h-16"
                        />
                        <div className="text-[13px] font-semibold text-[#12346B] line-clamp-2">
                          {asset.name.vi}
                        </div>
                        <span className="px-2 py-0.5 rounded bg-white border border-[#D4E6FF] text-[11.5px] font-bold text-[#1E6BFF]">
                          ×{item.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectKitAndStartLab(kit)}
                className="w-full py-3 px-4 rounded-[9px] bg-[#1E6BFF] hover:bg-[#1557D6] text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Đặt bộ này lên bàn thí nghiệm</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface StudentHelpModalProps {
  onClose: () => void;
}

export const StudentHelpModal: React.FC<StudentHelpModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-slate-950/32 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white/65 backdrop-blur-2xl border-2 border-white/85 rounded-[16px] shadow-[0_24px_60px_rgba(5,22,48,0.42)] overflow-hidden text-[#051630]"
      >
        <div className="px-6 py-4 bg-[#072B61]/85 backdrop-blur-xl text-white flex items-center justify-between border-b border-white/25">
          <h2 className="text-xl font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            Hướng dẫn thao tác phòng thí nghiệm OpenLab 3D
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-[12px] bg-white/58 backdrop-blur-md border-[1.5px] border-[#7DA4D9] flex flex-col items-center text-center gap-2.5 shadow-xs">
              <div className="w-14 h-14 rounded-[12px] bg-[#1D63E8] text-white flex items-center justify-center shadow-sm">
                <RotateCw className="w-7 h-7" />
              </div>
              <h3 className="text-[17px] font-extrabold text-[#051630]">
                1. Quan sát & Xoay 3D
              </h3>
              <p className="text-[14px] font-bold text-[#0F294A] leading-relaxed">
                Kéo chuột ở vùng trống để xoay góc nhìn, lăn con lăn chuột để phóng to hoặc thu nhỏ.
              </p>
            </div>

            <div className="p-4 rounded-[12px] bg-white/58 backdrop-blur-md border-[1.5px] border-[#7DA4D9] flex flex-col items-center text-center gap-2.5 shadow-xs">
              <div className="w-14 h-14 rounded-[12px] bg-[#16A34A] text-white flex items-center justify-center shadow-sm">
                <MousePointer className="w-7 h-7" />
              </div>
              <h3 className="text-[17px] font-extrabold text-[#051630]">
                2. Cầm kéo trực tiếp
              </h3>
              <p className="text-[14px] font-bold text-[#0F294A] leading-relaxed">
                Nhấn giữ chuột trái vào <strong>Vật rắn kim loại</strong> rồi kéo thả lên <strong>Cân điện tử</strong> hoặc vào <strong>Ống đong</strong>.
              </p>
            </div>

            <div className="p-4 rounded-[12px] bg-white/58 backdrop-blur-md border-[1.5px] border-[#7DA4D9] flex flex-col items-center text-center gap-2.5 shadow-xs">
              <div className="w-14 h-14 rounded-[12px] bg-[#D97706] text-white flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-[17px] font-extrabold text-[#051630]">
                3. Làm theo 5 bước
              </h3>
              <p className="text-[14px] font-bold text-[#0F294A] leading-relaxed">
                Bấm vào từng bước ở cột <strong>Hướng dẫn thí nghiệm</strong> bên phải và đối chiếu <strong>Bảng kết quả</strong>.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="px-7 py-2.5 rounded-[9px] bg-[#1D63E8] hover:bg-[#1552C7] text-white font-extrabold text-[15px] shadow-md cursor-pointer"
            >
              Đã hiểu, bắt đầu thực hành
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StudentVideoGuideModalProps {
  onClose: () => void;
  onRunAutoDemo: () => void;
}

export const StudentVideoGuideModal: React.FC<StudentVideoGuideModalProps> = ({
  onClose,
  onRunAutoDemo,
}) => {
  return (
    <div
      className="fixed inset-0 bg-slate-950/32 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white/65 backdrop-blur-2xl border-2 border-white/85 rounded-[16px] shadow-[0_24px_60px_rgba(5,22,48,0.42)] overflow-hidden text-[#051630]"
      >
        <div className="px-6 py-4 bg-[#072B61]/85 backdrop-blur-xl text-white flex items-center justify-between border-b border-white/25">
          <div className="flex items-center gap-2.5">
            <PlayCircle className="w-5 h-5 text-[#38BDF8]" />
            <h2 className="text-lg font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              Minh họa trực quan: Đo khối lượng riêng của vật rắn
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="p-4 rounded-[12px] bg-white/52 backdrop-blur-md border-[1.5px] border-[#7DA4D9] grid grid-cols-3 gap-4 items-center text-center">
            {/* Hộp hình ảnh giữ nguyên độ nét (không mờ) */}
            <div className="p-3 rounded-[10px] bg-white border-[1.5px] border-[#88ADD8] flex flex-col items-center gap-1.5 shadow-xs">
              <EquipmentThumbnailSvg
                archetype="electronic-balance"
                className="w-20 h-20"
              />
              <div className="text-[13.5px] font-extrabold text-[#051630]">
                Bước 2: Cân vật rắn
              </div>
              <div className="text-[13px] font-mono font-extrabold text-[#1D63E8]">
                <MathFormula math="m = 66.25\text{ g}" />
              </div>
            </div>

            <div className="p-3 rounded-[10px] bg-white border-[1.5px] border-[#88ADD8] flex flex-col items-center gap-1.5 shadow-xs">
              <EquipmentThumbnailSvg
                archetype="graduated-cylinder"
                className="w-20 h-20"
              />
              <div className="text-[13.5px] font-extrabold text-[#051630]">
                Bước 3: Nhúng ngập nước
              </div>
              <div className="text-[13px] font-mono font-extrabold text-[#0369A1]">
                <MathFormula math="V = 74.5 - 50.0 = 24.5\text{ cm}^3" />
              </div>
            </div>

            <div className="p-3 rounded-[10px] bg-amber-100/80 backdrop-blur-md border-[1.5px] border-amber-500 flex flex-col items-center justify-center gap-1.5 h-full">
              <div className="text-[13.5px] font-extrabold text-[#051630]">
                Bước 4 & 5: Tính toán
              </div>
              <div className="text-[20px] font-mono font-extrabold text-[#051630]">
                <MathFormula math="\rho = \frac{m}{V}" />
              </div>
              <div className="text-[14px] font-mono font-extrabold text-[#15803D]">
                <MathFormula math="\rho = 2.70\text{ g/cm}^3\text{ (Nhom)}" />
              </div>
            </div>
          </div>

          <p className="text-[14px] font-bold text-[#0F294A] leading-relaxed">
            Em có thể tự tay kéo thả <strong>Vật rắn hình trụ bằng kim loại</strong> lên đĩa cân điện tử rồi nhúng vào ống đong 100 ml, hoặc bấm nút bên dưới để xem mô phỏng tự động trên bàn thí nghiệm 3D.
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[9px] bg-white/80 hover:bg-white border border-[#7DA4D9] text-[14px] font-extrabold text-[#051630] cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => {
                onRunAutoDemo();
                onClose();
              }}
              className="px-5 py-2.5 rounded-[9px] bg-[#1D63E8] hover:bg-[#1552C7] text-white font-extrabold text-[14.5px] flex items-center gap-2 shadow-md cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Thực hiện mẫu trên bàn 3D</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BASE_TEXTBOOK_REF_LOOKUP: Record<string, TextbookReferenceMetadata> = {
  'OL3D-EQP-BAL-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Bài 1 & Thực hành Đo khối lượng riêng',
    lesson: 'Đo khối lượng mẫu vật rắn và hóa chất với độ chính xác 0.01 g',
    figureRef: 'Dụng cụ cơ sở phòng thí nghiệm KHTN',
    standardFunction:
      'Đo chính xác khối lượng (m) của các vật rắn kim loại, cốc chứa chất lỏng hoặc hóa chất rắn trên đĩa cân inox, hiển thị số gam trực tiếp trên màn hình LCD.',
    usageGuidelines:
      'Đặt cân trên mặt bàn phẳng, bấm phím TARE (Trừ bì) để màn hình về 0.00 g trước khi đặt vật mẫu vào chính giữa đĩa cân.',
    safetyNote:
      'Không đặt vật vượt quá giới hạn đo (500 g) và không đổ trực tiếp hóa chất ăn mòn lên mặt đĩa cân.',
  },
  'OL3D-EQP-CYL-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Bài 1 & Chương VI–IX: Hoá học',
    lesson: 'Đo thể tích chất lỏng và thể tích vật rắn bằng phương pháp dâng nước',
    figureRef: 'Dụng cụ đo thể tích chuẩn 100 ml',
    standardFunction:
      'Đo thể tích chất lỏng ($V_1$) và xác định thể tích vật rắn không thấm nước ($V = V_2 - V_1$) dựa vào độ dâng mực nước khi thả chìm vật.',
    usageGuidelines:
      'Đặt ống đong thẳng đứng trên mặt bàn, đặt mắt ngang với đáy mặt khum lõm của cột nước để đọc đúng vạch chia (ĐCNN 1 ml).',
    safetyNote:
      'Khi thả vật rắn nặng bằng kim loại vào ống đong thủy tinh, cần nghiêng nhẹ hoặc buộc chỉ thả từ từ để tránh làm vỡ đáy ống.',
  },
  'OL3D-EQP-OVF-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Thực hành Đo thể tích vật rắn kích thước lớn',
    lesson: 'Đo thể tích vật rắn không bỏ lọt ống đong bằng Bình tràn có vòi',
    figureRef: 'Bình tràn thuỷ tinh có vòi nghiêng',
    standardFunction:
      'Xác định thể tích vật rắn bất kỳ bằng cách đổ nước đầy ngang miệng vòi tràn, sau đó thả ngập vật để toàn bộ thể tích nước bị chiếm chỗ chảy qua vòi sang cốc hứng.',
    usageGuidelines:
      'Luôn đặt cốc thủy tinh hoặc ống đong hứng ngay dưới đầu vòi tràn trước khi thả chìm vật mẫu vào bình.',
    safetyNote:
      'Lau khô thành ngoài cốc hứng và tránh làm rung mặt bàn khiến nước tràn sai lệch trước khi thả vật.',
  },
  'OL3D-EQP-BKR-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Bài 1 & Chương VI–X: Hoá học',
    lesson: 'Chứa chất lỏng, pha chế dung dịch, hứng nước từ bình tràn hoặc phễu chiết',
    figureRef: 'Cốc thuỷ tinh chịu nhiệt Borosilicate 250 ml',
    standardFunction:
      'Dùng để chứa nước, pha trộn dung dịch hóa học, hứng dịch lọc từ phễu chiết/bình tràn hoặc đun nóng dung dịch trên lưới tản nhiệt.',
    usageGuidelines:
      'Khi rót chất lỏng từ cốc sang ống đong, nghiêng mỏ cốc áp sát miệng ống đong để dòng nước chảy gọn, không văng ra bàn.',
    safetyNote:
      'Nếu đun nóng cốc thủy tinh bằng đèn cồn, bắt buộc phải đặt cốc trên lưới tản nhiệt để tránh nứt vỡ do sốc nhiệt.',
  },
  'OL3D-EQP-SLD-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Thực hành Khối lượng riêng & Cơ học',
    lesson: 'Xác định khối lượng riêng ρ = m / V của kim loại Nhôm (Al)',
    figureRef: 'Vật mẫu chuẩn hình trụ đặc (m = 66.25 g, V = 24.5 cm³)',
    standardFunction:
      'Làm vật mẫu chuẩn bằng hợp kim nhôm đặc có móc treo để thực hành cân khối lượng trên cân điện tử, nhúng đo thể tích trong ống đong và treo vào lực kế.',
    usageGuidelines:
      'Cân vật khi còn khô ráo để lấy m chính xác trước khi nhúng ngập vào nước trong ống đong hoặc bình tràn.',
    safetyNote:
      'Lau khô vật mẫu sau khi thực hành xong và bảo quản trong hộp dụng cụ.',
  },
  'OL3D-EQP-DYN-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Chương I: Năng lượng cơ học (Bài 2, Bài 3)',
    lesson: 'Bài 2: Động năng. Thế năng · Bài 3: Cơ năng và Công cơ học',
    figureRef: 'Lực kế lò xo ống trong suốt 5 N',
    standardFunction:
      'Đo trọng lượng P = 10m của vật nặng, lực kéo trên mặt phẳng nghiêng và xác định công cơ học A = F·s trong các thí nghiệm Chương I.',
    usageGuidelines:
      'Hiệu chỉnh vạch chỉ thị về đúng vạch 0 N khi treo thẳng đứng trước khi móc vật nặng vào đầu móc thép.',
    safetyNote:
      'Không kéo quá giới hạn đo 5 N để tránh làm biến dạng đàn hồi vĩnh viễn lò xo bên trong.',
  },
  'OL3D-EQP-CAL-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Bài 1: Dụng cụ đo lường cơ khí chính xác',
    lesson: 'Đo đường kính ngoài, đường kính trong và chiều sâu mẫu vật hình trụ',
    figureRef: 'Thước cặp du xích thép không gỉ 0–150 mm',
    standardFunction:
      'Đo chính xác kích thước hình học (đường kính d, chiều cao h) của trụ kim loại đặc/rỗng và viên bi cầu thép với độ chia nhỏ nhất 0.02 mm.',
    usageGuidelines:
      'Kẹp nhẹ hai mỏ đo ôm sát bề mặt mẫu vật, đọc phần nguyên (mm) trên thân thước chính và phần thập phân trên thước phụ (du xích).',
    safetyNote:
      'Không dùng mỏ thước cặp kẹp quá mạnh hoặc đo vật đang quay/đang nóng.',
  },
  'OL3D-EQP-WGT-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Bài 1: Hiệu chuẩn thiết bị đo khối lượng và lực',
    lesson: 'Quả cân chuẩn 50.00 g bằng đồng thau mạ niken',
    figureRef: 'Quả cân chuẩn 50 g có núm cầm',
    standardFunction:
      'Dùng để kiểm tra độ chính xác của cân điện tử (đúng 50.00 g) và làm tải trọng chuẩn 0.49 N khi treo kiểm nghiệm lực kế.',
    usageGuidelines:
      'Cầm vào cổ núm hoặc dùng nhíp gắp quả cân chuẩn đặt nhẹ nhàng lên giữa đĩa cân.',
    safetyNote:
      'Tránh làm rơi hoặc trầy xước bề mặt quả cân chuẩn gây sai lệch khối lượng chuẩn.',
  },
  'OL3D-EQP-SPH-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Chương I: Năng lượng cơ học (Bài 2, 3)',
    lesson: 'Khảo sát động năng và thế năng trọng trường của viên bi thép',
    figureRef: 'Bi cầu thép hợp kim đặc (m = 65.90 g, ρ = 7.85 g/cm³)',
    standardFunction:
      'Dùng làm vật mẫu khảo sát động năng phụ thuộc vào khối lượng và tốc độ (Bài 2) hoặc xác định khối lượng riêng của thép.',
    usageGuidelines:
      'Khi đặt viên bi cầu lên đĩa cân điện tử, đặt nhẹ vào tâm đĩa cân để bi đứng yên trước khi đọc kết quả.',
    safetyNote:
      'Không thả bi thép rơi tự do từ độ cao lớn xuống đáy cốc thủy tinh.',
  },
  'OL3D-EQP-BLK-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Thực hành Đo khối lượng riêng & Tính chất kim loại (Bài 18)',
    lesson: 'Khối hộp chữ nhật bằng đồng đỏ nguyên chất (m = 160.92 g, ρ = 8.94 g/cm³)',
    figureRef: 'Mẫu kim loại Đồng (Cu) nguyên chất',
    standardFunction:
      'Làm mẫu kim loại đồng chuẩn để đo kích thước bằng thước cặp, cân khối lượng và đối chiếu khối lượng riêng ρ = 8.94 g/cm³.',
    usageGuidelines:
      'Có thể đo thể tích bằng cả hai cách: đo kích thước a×b×c bằng thước cặp hoặc thả ngập trong ống đong/bình tràn.',
    safetyNote:
      'Đặt nhẹ nhàng lên mặt bàn hoặc đĩa cân.',
  },
  'OL3D-EQP-HLW-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Thực hành Đo lường nâng cao',
    lesson: 'Phân biệt thể tích toàn phần và thể tích phần kim loại đặc của trụ rỗng',
    figureRef: 'Trụ kim loại rỗng xuyên tâm',
    standardFunction:
      'Giúp học sinh thực hành đo đường kính ngoài D, đường kính lỗ trong d bằng thước cặp và so sánh với thể tích nước dâng lên khi nhúng ngập.',
    usageGuidelines:
      'Khi nhúng vào nước, nghiêng nhẹ trụ rỗng để bọt khí trong lòng ống thoát hết ra ngoài, tránh sai số thể tích.',
    safetyNote:
      'Lau khô lòng ống bên trong sau khi nhúng nước.',
  },
  'OL3D-EQP-FLK-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Chương VII–IX: Hoá học hữu cơ (Bài 24, 26, 27)',
    lesson: 'Bình tam giác Erlenmeyer 250 ml dùng chứa mẫu, lắc phản ứng và hứng chất cất',
    figureRef: 'Hình 1.10 trang 8 (Bình hứng chưng cất)',
    standardFunction:
      'Dùng để chứa dung dịch phản ứng khi cần lắc đều mà không bị sánh ra ngoài, hoặc đặt ở đầu ra ống sinh hàn để hứng chất lỏng ngưng tụ khi chưng cất.',
    usageGuidelines:
      'Cầm ở cổ bình khi lắc tròn nhẹ nhàng hoặc đặt trên mặt bàn phẳng dưới vòi ống sinh hàn / phễu chiết.',
    safetyNote:
      'Không đậy nút kín tuyệt đối khi đang đun nóng chất lỏng bên trong bình tam giác.',
  },
  'OL3D-EQP-STD-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Bài 1 & Chương I, II, VII, VIII',
    lesson: 'Giá sắt thí nghiệm kèm khớp nối chữ thập, tay kẹp và vòng đỡ',
    figureRef: 'Hình 1.3, 1.8b, 1.10 trang 6–8 SGK KHTN 9',
    standardFunction:
      'Dùng để treo lực kế lò xo, kẹp cố định bình cầu có nhánh, ống sinh hàn, phễu chiết tách chất hoặc giữ thấu kính và màn chắn trên trục quang học.',
    usageGuidelines:
      'Đặt đế gang nặng phẳng vững trên mặt bàn gỗ, vặn chặt ốc hãm khớp chữ thập ở độ cao phù hợp trước khi gắn dụng cụ thủy tinh.',
    safetyNote:
      'Khi kẹp bình cầu hoặc ống sinh hàn thủy tinh, vặn vừa đủ chặt nhờ đệm cao su, không siết quá mạnh làm vỡ cổ bình.',
  },
  'OL3D-EQP-OPT-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Chương II: Ánh sáng (Bài 8, Bài 9)',
    lesson: 'Bài 8: Thấu kính · Bài 9: Thực hành đo tiêu cự của thấu kính hội tụ',
    figureRef: 'Hình 1.3 trang 6 & Hình 8.4, 9.1 SGK KHTN 9',
    standardFunction:
      'Khảo sát đường truyền của 3 tia sáng đặc biệt qua thấu kính hội tụ (rìa mỏng, phần giữa dày) và thực hành đo tiêu cự f của thấu kính bằng phương pháp ảnh đối xứng d = d\' = 2f.',
    usageGuidelines:
      'Chiếu chùm 3 tia sáng song song từ đèn laser vuông góc với mặt thấu kính để quan sát chùm tia ló hội tụ tại tiêu điểm chính F.',
    safetyNote:
      'Cầm vào vành khung bảo vệ của thấu kính, không chạm ngón tay trực tiếp vào mặt kính quang học.',
  },
  'OL3D-EQP-THM-0001': {
    bookTitle: 'SGK Khoa học tự nhiên 9 - Kết nối tri thức',
    chapter: 'Bài 1 & Chương VII: Hoá học (Bài 24)',
    lesson: 'Đo nhiệt độ dung dịch và theo dõi nhiệt độ sôi trong bình cầu chưng cất',
    figureRef: 'Hình 1.10 trang 8 (Nhiệt kế lắp trên cổ bình cầu có nhánh)',
    standardFunction:
      'Đo nhiệt độ chất lỏng từ -10 °C đến 110 °C hoặc lắp qua nút cao su ở cổ bình cầu có nhánh để xác định đúng nhiệt độ sôi của cấu tử đang bay hơi.',
    usageGuidelines:
      'Nhúng bầu nhiệt kế ngập trong chất lỏng (không chạm sát đáy bình đang đun) hoặc đặt bầu nhiệt kế ngang vị trí nhánh thoát hơi khi chưng cất.',
    safetyNote:
      'Không dùng nhiệt kế thủy tinh làm đũa khuấy dung dịch.',
  },
};

interface StudentEquipmentDetailModalProps {
  asset: AssetDefinition;
  initialEditMode?: boolean;
  onClose: () => void;
  onAddToLab: (assetId: string) => void;
  onSaveUpdatedAsset?: (updatedAsset: AssetDefinition) => void;
  onOpenHtmlUpdaterForAsset?: (asset: AssetDefinition) => void;
  onOpenPhotoUpdaterForAsset?: (asset: AssetDefinition) => void;
}

export const StudentEquipmentDetailModal: React.FC<StudentEquipmentDetailModalProps> = ({
  asset,
  initialEditMode = false,
  onClose,
  onAddToLab,
  onSaveUpdatedAsset,
  onOpenHtmlUpdaterForAsset,
  onOpenPhotoUpdaterForAsset,
}) => {
  const sgkRef = asset.textbookRef ?? BASE_TEXTBOOK_REF_LOOKUP[asset.assetId];
  const multiSourceDossier = MULTI_SOURCE_EQUIPMENT_DOSSIERS[asset.assetId];
  const functionalEnvAudit = EQUIPMENT_FUNCTIONAL_AND_ENV_AUDITS[asset.assetId];

  const [isEditingProduct, setIsEditingProduct] = React.useState<boolean>(
    initialEditMode,
  );
  const [editNameVi, setEditNameVi] = React.useState<string>(asset.name.vi);
  const [editNameEn, setEditNameEn] = React.useState<string>(asset.name.en);
  const [editMassG, setEditMassG] = React.useState<string>(
    String(asset.scientificProperties.referenceMass?.value ?? 66.25),
  );
  const [editCapacityMl, setEditCapacityMl] = React.useState<string>(
    String(asset.scientificProperties.capacity?.value ?? 0),
  );
  const [editWidthMm, setEditWidthMm] = React.useState<string>(
    String(asset.geometry.dimensions.widthOrDiameter.value),
  );
  const [editHeightMm, setEditHeightMm] = React.useState<string>(
    String(asset.geometry.dimensions.height.value),
  );
  const [editMaterial, setEditMaterial] = React.useState<string>(
    asset.scientificProperties.material.value,
  );
  const [editSummary, setEditSummary] = React.useState<string>(asset.summary);

  const handleSaveProductEdits = () => {
    if (!onSaveUpdatedAsset) return;
    const nextMass = Math.max(0.1, Number(editMassG) || 50);
    const nextCap = Math.max(0, Number(editCapacityMl) || 0);
    const nextW = Math.max(5, Number(editWidthMm) || asset.geometry.dimensions.widthOrDiameter.value);
    const nextH = Math.max(5, Number(editHeightMm) || asset.geometry.dimensions.height.value);

    const updated: AssetDefinition = {
      ...asset,
      name: {
        vi: editNameVi.trim() || asset.name.vi,
        en: editNameEn.trim() || asset.name.en,
      },
      summary: editSummary.trim() || asset.summary,
      geometry: {
        ...asset.geometry,
        boundingBoxM: {
          width: Number((nextW / 1000).toFixed(4)),
          height: Number((nextH / 1000).toFixed(4)),
          depth: Number((nextW / 1000).toFixed(4)),
        },
        dimensions: {
          ...asset.geometry.dimensions,
          widthOrDiameter: {
            ...asset.geometry.dimensions.widthOrDiameter,
            value: nextW,
          },
          height: {
            ...asset.geometry.dimensions.height,
            value: nextH,
          },
        },
      },
      scientificProperties: {
        ...asset.scientificProperties,
        material: {
          ...asset.scientificProperties.material,
          value: editMaterial.trim() || asset.scientificProperties.material.value,
        },
        referenceMass: {
          value: nextMass,
          unit: 'g',
          status: 'verified',
        },
        ...(nextCap > 0
          ? {
              capacity: {
                value: nextCap,
                unit: 'ml',
                status: 'verified' as const,
              },
            }
          : {}),
      },
    };
    onSaveUpdatedAsset(updated);
    setIsEditingProduct(false);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/32 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white/62 backdrop-blur-2xl border-2 border-white/85 rounded-[16px] shadow-[0_24px_64px_rgba(5,22,48,0.45)] overflow-hidden text-[#051630]"
      >
        <div className="px-6 py-4 bg-[#072B61]/85 backdrop-blur-xl text-white flex items-center justify-between gap-3 flex-wrap border-b border-white/25">
          <div>
            <div className="text-[11.5px] font-extrabold text-[#7DD3FC] uppercase tracking-wider">
              THÔNG TIN SẢN PHẨM & CẬP NHẬT TRỰC TIẾP · MÃ {asset.assetId}
            </div>
            <h2 className="text-lg font-extrabold mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
              {asset.name.vi}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {onSaveUpdatedAsset && (
              <button
                type="button"
                onClick={() => setIsEditingProduct((v) => !v)}
                className={`px-3 py-1.5 rounded-[8px] text-[12px] font-extrabold cursor-pointer transition-colors ${
                  isEditingProduct
                    ? 'bg-amber-400 text-[#051630]'
                    : 'bg-white/20 hover:bg-white/30 text-white border border-white/40'
                }`}
              >
                {isEditingProduct ? 'Đóng khung sửa thông số' : 'Sửa thông tin sản phẩm'}
              </button>
            )}
            {onOpenPhotoUpdaterForAsset && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPhotoUpdaterForAsset(asset);
                }}
                className="px-3 py-1.5 rounded-[8px] bg-amber-400 hover:bg-amber-300 text-[#051630] text-[12px] font-extrabold cursor-pointer transition-colors shadow-xs flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Cập nhật ảnh thật</span>
              </button>
            )}
            {onOpenHtmlUpdaterForAsset && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenHtmlUpdaterForAsset(asset);
                }}
                className="px-3 py-1.5 rounded-[8px] bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#051630] text-[12px] font-extrabold cursor-pointer transition-colors shadow-xs"
              >
                Cập nhật bằng .HTML
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Khung Chỉnh sửa & Cập nhật chính sản phẩm hiện tại */}
          {isEditingProduct && (
            <div className="p-4 rounded-[12px] bg-amber-50/75 backdrop-blur-md border-2 border-amber-500 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-2 flex-wrap border-b border-amber-400/60 pb-2">
                <div className="text-[14px] font-extrabold text-[#5C2804]">
                  Cập nhật thông số & hình ảnh cho sản phẩm: {asset.name.vi} ({asset.assetId})
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {onOpenPhotoUpdaterForAsset && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPhotoUpdaterForAsset(asset);
                      }}
                      className="px-2.5 py-1 rounded-[7px] bg-amber-600 hover:bg-amber-700 text-white text-[11.5px] font-extrabold flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Đổi hình ảnh thực tế (240×240) →</span>
                    </button>
                  )}
                  {onOpenHtmlUpdaterForAsset && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenHtmlUpdaterForAsset(asset);
                      }}
                      className="px-2.5 py-1 rounded-[7px] bg-[#0B3A7D] hover:bg-[#12346B] text-white text-[11.5px] font-extrabold cursor-pointer"
                    >
                      Hoặc nạp file .HTML đè lên sản phẩm này →
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px]">
                <div>
                  <label className="block font-extrabold text-[#051630] mb-1">
                    Tên sản phẩm (Tiếng Việt):
                  </label>
                  <input
                    type="text"
                    value={editNameVi}
                    onChange={(e) => setEditNameVi(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[7px] bg-white border border-amber-400 font-extrabold text-[#051630]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#051630] mb-1">
                    Tên quốc tế (Tiếng Anh):
                  </label>
                  <input
                    type="text"
                    value={editNameEn}
                    onChange={(e) => setEditNameEn(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[7px] bg-white border border-amber-400 font-bold text-[#051630]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#051630] mb-1">
                    Khối lượng chuẩn m (g):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editMassG}
                    onChange={(e) => setEditMassG(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[7px] bg-white border border-amber-400 font-mono font-extrabold text-[#1D63E8]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#051630] mb-1">
                    Dung tích chứa chuẩn (ml — để 0 nếu là vật đặc):
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={editCapacityMl}
                    onChange={(e) => setEditCapacityMl(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[7px] bg-white border border-amber-400 font-mono font-extrabold text-[#0369A1]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#051630] mb-1">
                    Đường kính / Chiều rộng (mm):
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={editWidthMm}
                    onChange={(e) => setEditWidthMm(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[7px] bg-white border border-amber-400 font-mono font-extrabold text-[#051630]"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#051630] mb-1">
                    Chiều cao 3D (mm):
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={editHeightMm}
                    onChange={(e) => setEditHeightMm(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[7px] bg-white border border-amber-400 font-mono font-extrabold text-[#051630]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-extrabold text-[#051630] mb-1">
                    Chất liệu chế tạo:
                  </label>
                  <input
                    type="text"
                    value={editMaterial}
                    onChange={(e) => setEditMaterial(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[7px] bg-white border border-amber-400 font-bold text-[#051630]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-extrabold text-[#051630] mb-1">
                    Mô tả tóm tắt chức năng:
                  </label>
                  <textarea
                    rows={2}
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-[7px] bg-white border border-amber-400 font-bold text-[#051630]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(false)}
                  className="px-3.5 py-1.5 rounded-[8px] bg-white border border-amber-400 text-[#5C2804] text-[12.5px] font-extrabold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveProductEdits}
                  className="px-4 py-1.5 rounded-[8px] bg-[#16A34A] hover:bg-[#15803D] text-white text-[13px] font-extrabold cursor-pointer shadow-xs"
                >
                  Lưu Cập Nhật Sản Phẩm Này
                </button>
              </div>
            </div>
          )}

          {/* Hàng trên: Hình minh họa 2D/3D (NỀN ĐẶC RÕ NÉT - KHÔNG MỜ) + Thông tin chương bài SGK (NỀN KÍNH MỜ) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
            <div className="sm:col-span-4 rounded-[12px] bg-white border-[1.5px] border-[#7DA4D9] p-4 flex flex-col items-center justify-center shadow-sm">
              <EquipmentThumbnailSvg
                archetype={asset.geometry.proceduralArchetype}
                assetId={asset.assetId}
                className="w-28 h-28"
              />
              <span className="mt-2 px-2.5 py-0.5 rounded-full bg-[#DCE8F8] border border-[#7DA4D9] text-[11.5px] font-mono font-extrabold text-[#0B3A7D]">
                {asset.assetId}
              </span>
              {multiSourceDossier && (
                <span className="mt-1.5 px-2.5 py-0.5 rounded bg-[#DCFCE7] border border-[#16A34A]/50 text-[#065F46] text-[11px] font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Đã tổng hợp 5 nguồn chuẩn</span>
                </span>
              )}
            </div>

            <div className="sm:col-span-8 rounded-[12px] bg-white/52 backdrop-blur-md border-[1.5px] border-[#7DA4D9] p-4 flex flex-col justify-between space-y-2 shadow-xs">
              {sgkRef && (
                <>
                  <div className="flex items-center gap-2 text-[13px] font-extrabold text-[#0B3A7D]">
                    <BookOpen className="w-4 h-4 shrink-0 text-[#1D63E8]" />
                    <span>{sgkRef.chapter}</span>
                  </div>
                  <div className="text-[15px] font-extrabold text-[#051630] leading-snug">
                    {sgkRef.lesson}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] bg-white/75 border border-[#7DA4D9] text-[12px] font-extrabold text-[#051630]">
                      <span>Tham chiếu SGK:</span>
                      <span className="text-[#1D63E8]">{sgkRef.figureRef}</span>
                    </span>
                    {multiSourceDossier && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[7px] bg-white/75 border border-[#7DA4D9] text-[11.5px] font-extrabold text-[#073B5E]">
                        <span>Tiêu chuẩn: {multiSourceDossier.technicalStandard}</span>
                      </span>
                    )}
                  </div>
                </>
              )}
              <p className="text-[13.5px] font-bold text-[#0F294A] leading-relaxed">
                {asset.summary}
              </p>
            </div>
          </div>

          {/* Thông số kỹ thuật cơ bản (Kính mờ nhìn xuyên thấu mô phỏng 3D + chữ đậm rõ nét) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {asset.measurementMetadata.rangeMax && (
              <div className="p-3 rounded-[10px] bg-white/55 backdrop-blur-md border-[1.5px] border-[#7DA4D9] shadow-xs">
                <div className="flex items-center gap-1 text-[12px] font-extrabold text-[#1E3A5F]">
                  <Scale className="w-3.5 h-3.5 text-[#1D63E8]" />
                  <span>Giới hạn đo</span>
                </div>
                <div className="text-[15.5px] font-extrabold font-mono text-[#051630] mt-0.5">
                  {asset.measurementMetadata.rangeMax.value}{' '}
                  {asset.measurementMetadata.rangeMax.unit}
                </div>
              </div>
            )}

            {asset.measurementMetadata.leastCount && (
              <div className="p-3 rounded-[10px] bg-white/55 backdrop-blur-md border-[1.5px] border-[#7DA4D9] shadow-xs">
                <div className="flex items-center gap-1 text-[12px] font-extrabold text-[#1E3A5F]">
                  <Ruler className="w-3.5 h-3.5 text-[#1D63E8]" />
                  <span>Độ chia nhỏ nhất</span>
                </div>
                <div className="text-[15.5px] font-extrabold font-mono text-[#0B3A7D] mt-0.5">
                  {asset.measurementMetadata.leastCount.value}{' '}
                  {asset.measurementMetadata.leastCount.unit}
                </div>
              </div>
            )}

            <div className="p-3 rounded-[10px] bg-white/55 backdrop-blur-md border-[1.5px] border-[#7DA4D9] shadow-xs">
              <div className="text-[12px] font-extrabold text-[#1E3A5F]">Chất liệu</div>
              <div className="text-[13.5px] font-extrabold text-[#051630] mt-0.5 line-clamp-1">
                {asset.scientificProperties.material.value}
              </div>
            </div>

            <div className="p-3 rounded-[10px] bg-white/55 backdrop-blur-md border-[1.5px] border-[#7DA4D9] shadow-xs">
              <div className="text-[12px] font-extrabold text-[#1E3A5F]">Chiều cao 3D</div>
              <div className="text-[15.5px] font-extrabold font-mono text-[#051630] mt-0.5">
                {asset.geometry.dimensions.height.value}{' '}
                {asset.geometry.dimensions.height.unit}
              </div>
            </div>
          </div>

          {/* Khối Gọi Ảnh Thật Thực Tế & Đối Chiếu 3 Lớp (Icon · Vật 3D · Ảnh Thật — ảnh giữ độ nét 100%) */}
          <EquipmentRealPhotoView asset={asset} />

          {/* Khối Tổng hợp Kích thước & Tính năng Kỹ thuật từ 5 Trang Web (Nền kính mờ + chữ đậm) */}
          {multiSourceDossier && (
            <div className="rounded-[12px] bg-white/52 backdrop-blur-md border-2 border-[#7DA4D9] p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap border-b border-[#7DA4D9]/60 pb-2">
                <div className="flex items-center gap-2 text-[14px] font-extrabold text-[#051630]">
                  <Ruler className="w-4 h-4 text-[#1D63E8]" />
                  <span>
                    Thông số Kích thước & Tính năng Kỹ thuật (Tổng hợp từ 5 trang web thiết bị)
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1D63E8] text-white text-[11px] font-extrabold">
                  5/5 nguồn khớp chuẩn
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-[9px] bg-white/62 backdrop-blur-sm border border-[#7DA4D9]">
                  <div className="text-[11.5px] font-extrabold text-[#1E3A5F] uppercase">
                    Kích thước thực tế chuẩn (mm)
                  </div>
                  <div className="text-[13.5px] font-extrabold font-mono text-[#051630] mt-1 leading-snug">
                    {multiSourceDossier.exactDimensionsSpec}
                  </div>
                </div>
                <div className="p-3 rounded-[9px] bg-white/62 backdrop-blur-sm border border-[#7DA4D9]">
                  <div className="text-[11.5px] font-extrabold text-[#1E3A5F] uppercase">
                    Phạm vi đo / Dung tích / Khối lượng chuẩn
                  </div>
                  <div className="text-[13.5px] font-extrabold font-mono text-[#0B3A7D] mt-1 leading-snug">
                    {multiSourceDossier.weightOrCapacitySpec}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[13px] font-extrabold text-[#051630]">
                  Tính năng vật lý & sư phạm tổng hợp:
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {multiSourceDossier.synthesizedFeatures.map((feat, idx) => (
                    <li
                      key={idx}
                      className="p-2 rounded-[8px] bg-white/62 backdrop-blur-sm border border-[#7DA4D9] text-[12.5px] font-bold text-[#051630] flex items-start gap-2 leading-snug"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Danh sách 5 trang web đối chiếu */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 text-[13px] font-extrabold text-[#051630]">
                  <Globe className="w-4 h-4 text-[#1D63E8]" />
                  <span>5 Nguồn trang web nghiên cứu & đối chiếu thông số chính xác:</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {multiSourceDossier.fiveWebSources.map((src, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-[8px] bg-white/62 backdrop-blur-sm border border-[#7DA4D9] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12.5px]"
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-[#1D63E8] text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-extrabold text-[#051630] flex items-center gap-1.5 flex-wrap">
                            <span>{src.siteName}</span>
                            <span className="px-1.5 py-0.2 rounded bg-[#DCE8F8] border border-[#7DA4D9] font-mono text-[11px] font-extrabold text-[#0B3A7D]">
                              {src.domain}
                            </span>
                          </div>
                          <p className="text-[#0F294A] font-bold text-[12px] mt-0.5 leading-snug">
                            {src.verifiedSpecSummary}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kiểm chứng Hiển thị 360° & Tương tác Môi trường Phòng thí nghiệm */}
              {functionalEnvAudit && (
                <div className="pt-2 border-t border-[#7DA4D9] space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[13px] font-extrabold text-[#051630]">
                      <RotateCw className="w-4 h-4 text-[#1D63E8]" />
                      <span>
                        Kiểm chứng Hiển thị 360° & Tương tác Môi trường Thực tế:
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#DCFCE7] border border-[#16A34A]/50 text-[#065F46] text-[11px] font-extrabold">
                      Đã kiểm tra 360° & Vật lý
                    </span>
                  </div>

                  <div className="p-2.5 rounded-[8px] bg-[#072B61]/90 text-white text-[12.5px] font-bold leading-snug">
                    <span className="font-extrabold text-[#7DD3FC]">
                      Hiển thị kết quả đa hướng (360°):{' '}
                    </span>
                    <span>{functionalEnvAudit.omnidirectionalReadout360}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-[8px] bg-white/62 backdrop-blur-sm border border-[#7DA4D9] space-y-1">
                      <div className="text-[12px] font-extrabold text-[#0B3A7D]">
                        Chức năng điều khiển trực tiếp:
                      </div>
                      <ul className="space-y-1 text-[12px] font-bold text-[#051630]">
                        {functionalEnvAudit.coreInteractiveFunctions.map(
                          (fn, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-[#1D63E8] font-extrabold">•</span>
                              <span>{fn}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-[8px] bg-white/62 backdrop-blur-sm border border-[#7DA4D9] space-y-1">
                      <div className="text-[12px] font-extrabold text-[#065F46]">
                        Tương tác môi trường & liên kết thiết bị:
                      </div>
                      <ul className="space-y-1 text-[12px] font-bold text-[#051630]">
                        {functionalEnvAudit.environmentalAndCrossToolInteractions.map(
                          (env, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-[#16A34A] font-extrabold">•</span>
                              <span>{env}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hồ sơ Chức năng, Cách sử dụng & Lưu ý an toàn chuẩn SGK KHTN 9 */}
          {sgkRef && (
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-[11px] bg-white/55 backdrop-blur-md border-[1.5px] border-[#7DA4D9] space-y-1">
                <div className="flex items-center gap-1.5 text-[13.5px] font-extrabold text-[#0B3A7D]">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>Chức năng chuẩn trong phòng thí nghiệm (Theo SGK KHTN 9)</span>
                </div>
                <p className="text-[13.5px] text-[#051630] leading-relaxed font-bold">
                  <RichMathText text={sgkRef.standardFunction} />
                </p>
              </div>

              <div className="p-3.5 rounded-[11px] bg-white/55 backdrop-blur-md border-[1.5px] border-[#7DA4D9] space-y-1">
                <div className="flex items-center gap-1.5 text-[13.5px] font-extrabold text-[#073B5E]">
                  <Wrench className="w-4 h-4 text-[#0284C7]" />
                  <span>Hướng dẫn thao tác & Cách sử dụng đúng chuẩn</span>
                </div>
                <p className="text-[13.5px] text-[#051630] leading-relaxed font-bold">
                  <RichMathText text={sgkRef.usageGuidelines} />
                </p>
              </div>

              <div className="p-3.5 rounded-[11px] bg-amber-100/75 backdrop-blur-md border-[1.5px] border-amber-500 space-y-1">
                <div className="flex items-center gap-1.5 text-[13.5px] font-extrabold text-[#5C2804]">
                  <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                  <span>Lưu ý an toàn phòng thí nghiệm</span>
                </div>
                <p className="text-[13.5px] text-[#451A03] leading-relaxed font-bold">
                  <RichMathText text={sgkRef.safetyNote} />
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-[9px] bg-white/80 hover:bg-white border border-[#7DA4D9] text-[14px] font-extrabold text-[#051630] cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => {
                onAddToLab(asset.assetId);
                onClose();
              }}
              className="px-5 py-2.5 rounded-[9px] bg-[#1D63E8] hover:bg-[#1552C7] text-white font-extrabold text-[14.5px] shadow-md cursor-pointer"
            >
              Đặt dụng cụ này lên bàn 3D
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


