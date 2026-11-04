import React, { useState, useRef } from 'react';
import { AssetDefinition } from '../../domain/types';
import {
  htmlEquipmentModuleRegistry,
  RealPhotoAnnotationPin,
} from '../../three-runtime/HtmlEquipmentModuleRegistry';
import {
  PREINSTALLED_LIBRARY_REAL_PHOTOS,
  formatImageToSquare240DataUrl,
  equipmentImagePreviewController,
} from '../../three-runtime/EquipmentImagePreviewController';
import { getLibraryFolderName } from '../../three-runtime/LocalDiskLibraryEngine';
import { EquipmentThumbnailSvg } from './EquipmentThumbnailSvg';
import {
  Camera,
  Upload,
  Ruler,
  Eye,
  Layers,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface EquipmentRealPhotoViewProps {
  asset: AssetDefinition;
  compact?: boolean;
}

const DEFAULT_ANNOTATIONS_BY_ARCHETYPE: Record<string, RealPhotoAnnotationPin[]> = {
  'electronic-balance': [
    {
      xPercent: 45,
      yPercent: 28,
      label: 'Đĩa cân thép không gỉ Inox 304 hình chữ nhật bo tròn góc & vát mép bóng mượt',
    },
    {
      xPercent: 60,
      yPercent: 54,
      label: 'Màn hình tinh thể lỏng LCD nền trắng sáng hiển thị sắc nét tới 0.01 g kèm giọt nước cân bằng',
    },
    {
      xPercent: 62,
      yPercent: 68,
      label: '4 phím điều khiển viền đỏ chuẩn OHAUS Scout: Zero, Print/Units, Function/Mode, Tare/Menu',
    },
    {
      xPercent: 37,
      yPercent: 84,
      label: '4 chân đế xoay chỉnh thăng bằng màu đỏ hồng ở 4 góc thân cân bo tròn',
    },
  ],
  'graduated-cylinder': [
    {
      xPercent: 50,
      yPercent: 16,
      label: 'Miệng ống đong có mỏ rót nghiêng chống chảy tràn dọc thành ống',
    },
    {
      xPercent: 52,
      yPercent: 50,
      label: 'Thang chia vạch men trắng 10–100 ml (ĐCNN 1 ml, chuẩn In 20°C)',
    },
    {
      xPercent: 50,
      yPercent: 86,
      label: 'Chân đế lục giác rộng chống đổ ngã trên mặt bàn thí nghiệm',
    },
  ],
  'overflow-can': [
    {
      xPercent: 50,
      yPercent: 28,
      label: 'Vạch ngưỡng tràn chuẩn 210.0 ml ngang đúng cổ trong của vòi xả',
    },
    {
      xPercent: 76,
      yPercent: 44,
      label: 'Vòi tràn thủy tinh nghiêng 28° dẫn toàn bộ thể tích nước dôi ra ΔV sang cốc hứng',
    },
    {
      xPercent: 44,
      yPercent: 72,
      label: 'Thân trụ thủy tinh Borosilicate 3.3 trong suốt quan sát rõ vật rắn chìm',
    },
  ],
  'water-dispenser': [
    {
      xPercent: 46,
      yPercent: 16,
      label: 'Nắp vặn chuẩn GL45 nhựa PP xanh có lỗ thông áp khi mở van xả',
    },
    {
      xPercent: 46,
      yPercent: 45,
      label: 'Bình trụ Borosilicate 1000 ml khắc vạch 100–1000 ml chứa nước cất',
    },
    {
      xPercent: 74,
      yPercent: 58,
      label: 'Cụm van khóa PTFE kèm đồng hồ lưu lượng LCD định lượng chính xác số ml',
    },
  ],
};

function getDefaultAnnotations(asset: AssetDefinition): RealPhotoAnnotationPin[] {
  const byArch = DEFAULT_ANNOTATIONS_BY_ARCHETYPE[asset.geometry.proceduralArchetype];
  if (byArch) return byArch;

  return [
    {
      xPercent: 50,
      yPercent: 25,
      label: `Bộ phận chính: ${asset.name.vi} (${asset.scientificProperties.material.value})`,
    },
    {
      xPercent: 50,
      yPercent: 58,
      label: asset.measurementMetadata.isMeasuringInstrument
        ? `Cơ cấu đọc số đo — Giới hạn đo: ${asset.measurementMetadata.rangeMax?.value ?? ''} ${asset.measurementMetadata.rangeMax?.unit ?? ''}, ĐCNN: ${asset.measurementMetadata.leastCount?.value ?? ''} ${asset.measurementMetadata.leastCount?.unit ?? ''}`
        : `Kích thước chuẩn: Cao ${asset.geometry.dimensions.height.value} ${asset.geometry.dimensions.height.unit} × Rộng ${asset.geometry.dimensions.widthOrDiameter.value} ${asset.geometry.dimensions.widthOrDiameter.unit}`,
    },
    {
      xPercent: 50,
      yPercent: 84,
      label: `Đế tiếp xúc chuẩn mặt bàn phẳng (Khối lượng thực: ${asset.scientificProperties.referenceMass?.value ?? 100} g)`,
    },
  ];
}

export const EquipmentRealPhotoView: React.FC<EquipmentRealPhotoViewProps> = ({
  asset,
  compact = false,
}) => {
  const [viewTab, setViewTab] = useState<'real-photo' | 'tri-compare'>('real-photo');
  const [showPins, setShowPins] = useState<boolean>(true);
  const [activePinIndex, setActivePinIndex] = useState<number>(0);
  const [, setForceRefresh] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const customModule =
    htmlEquipmentModuleRegistry.getModule(asset.assetId) ??
    htmlEquipmentModuleRegistry.getByArchetypeOrSlug(asset.slug);

  const uploadedPhotoUrl = htmlEquipmentModuleRegistry.getUploadedRealPhoto(asset.assetId);
  const preinstalled = PREINSTALLED_LIBRARY_REAL_PHOTOS[asset.assetId];
  const libraryPhotoUrl = preinstalled
    ? `/libraries3DLab/${getLibraryFolderName(asset.assetId, preinstalled.slug)}/assets/${preinstalled.slug}.${preinstalled.ext}`
    : undefined;
  const realPhotoFromAsset =
    customModule?.realPhotoMeta?.src ??
    libraryPhotoUrl ??
    asset.geometry.realPhotoUris?.[0] ??
    (asset.geometry.proceduralArchetype === 'electronic-balance'
      ? '/assets/aistudio/image_94e51cd3.png'
      : undefined);

  const annotations =
    customModule?.realPhotoMeta?.annotations &&
    customModule.realPhotoMeta.annotations.length > 0
      ? customModule.realPhotoMeta.annotations
      : getDefaultAnnotations(asset);

  const handleUploadRealPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const squareDataUrl = await formatImageToSquare240DataUrl(file, '#ffffff');
      htmlEquipmentModuleRegistry.setUploadedRealPhoto(asset.assetId, squareDataUrl);
      equipmentImagePreviewController.preview(asset.assetId, 'pinned');
      setForceRefresh((n) => n + 1);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          htmlEquipmentModuleRegistry.setUploadedRealPhoto(asset.assetId, reader.result);
          setForceRefresh((n) => n + 1);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="rounded-[12px] bg-[#0F172A] border border-[#1E3A8A] text-white overflow-hidden shadow-md">
      {/* Thanh tiêu đề chuyển đổi giữa Ảnh thật & So sánh 3 lớp (Icon - Vật 3D - Ảnh thật) */}
      <div className="px-3.5 py-2.5 bg-[#090D16] border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11.5px] font-extrabold">
            <Camera className="w-3.5 h-3.5" />
            <span>ẢNH THẬT & ĐỐI CHIẾU THỰC TẾ</span>
          </span>
          <span className="text-[12px] text-slate-300 font-semibold hidden sm:inline">
            {asset.name.vi} ({asset.assetId})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewTab('real-photo')}
            className={`px-2.5 py-1 rounded-[7px] text-[11.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              viewTab === 'real-photo'
                ? 'bg-[#1E6BFF] text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ảnh thật chi tiết</span>
          </button>

          <button
            type="button"
            onClick={() => setViewTab('tri-compare')}
            className={`px-2.5 py-1 rounded-[7px] text-[11.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
              viewTab === 'tri-compare'
                ? 'bg-[#1E6BFF] text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bộ 3: Icon · 3D · Ảnh thật</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPins((v) => !v)}
            className={`px-2 py-1 rounded-[7px] text-[11px] font-bold cursor-pointer ${
              showPins
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}
            title="Bật/tắt điểm chú thích cấu tạo thực tế"
          >
            Chú thích ({annotations.length})
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadRealPhoto}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 rounded-[7px] bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sky-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            title="Tải ảnh chụp thực tế của thiết bị từ máy tính/điện thoại"
          >
            <Upload className="w-3 h-3" />
            <span>Đổi ảnh thật</span>
          </button>
        </div>
      </div>

      {viewTab === 'real-photo' ? (
        <div className="p-3.5 space-y-3">
          {/* Khung hiển thị Ảnh thật Studio / Ảnh chụp tải lên */}
          <div
            className={`relative w-full ${
              compact ? 'h-56' : 'h-72 sm:h-80'
            } rounded-[10px] overflow-hidden border border-slate-700 bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#451A03] flex items-center justify-center`}
          >
            {/* Mặt bàn gỗ thật phía dưới trong trường hợp dùng studio plate */}
            <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-b from-[#78350F] to-[#451A03] border-t-2 border-amber-600/60" />

            {/* Lưới thước đo chuẩn mm ở nền */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/85 border border-slate-700 text-[11px] font-mono text-sky-300 flex items-center gap-1.5 z-10">
              <Ruler className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Kích thước thật: {asset.geometry.dimensions.height.value}{' '}
                {asset.geometry.dimensions.height.unit} (Cao) ×{' '}
                {asset.geometry.dimensions.widthOrDiameter.value}{' '}
                {asset.geometry.dimensions.widthOrDiameter.unit} (Rộng)
              </span>
            </div>

            <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 flex items-center gap-1 z-10">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chuẩn Thông tư 38/2021</span>
            </div>

            {/* Nội dung ảnh: Ưu tiên 1: Ảnh chụp người dùng tải lên -> Ưu tiên 2: Ảnh thật nhúng trong file .html -> Ưu tiên 3: Studio Macro Plate */}
            {uploadedPhotoUrl || realPhotoFromAsset ? (
              <img
                src={uploadedPhotoUrl || realPhotoFromAsset}
                alt={asset.name.vi}
                className="relative z-10 max-h-full max-w-full object-contain drop-shadow-2xl"
              />
            ) : customModule?.realPhotoMarkup ? (
              <div
                className="relative z-10 w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                dangerouslySetInnerHTML={{ __html: customModule.realPhotoMarkup }}
              />
            ) : (
              <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Ánh sáng studio phản chiếu */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-sky-400/10 blur-xl absolute" />
                <div className="relative transform scale-125 drop-shadow-[0_18px_22px_rgba(0,0,0,0.65)]">
                  <EquipmentThumbnailSvg
                    archetype={asset.geometry.proceduralArchetype}
                    assetId={asset.assetId}
                    className="w-40 h-40 sm:w-48 sm:h-48"
                  />
                </div>
                {/* Thước tỉ lệ thực đặt dưới chân thiết bị */}
                <div className="mt-2 px-3 py-1 rounded bg-slate-950/90 border border-amber-500/40 text-[11px] font-mono text-amber-300 flex items-center gap-3">
                  <span>0 mm</span>
                  <div className="w-28 h-2 bg-gradient-to-r from-amber-400 via-white to-amber-400 rounded-xs opacity-80" />
                  <span>
                    {asset.geometry.dimensions.widthOrDiameter.value}{' '}
                    {asset.geometry.dimensions.widthOrDiameter.unit}
                  </span>
                </div>
              </div>
            )}

            {/* Các điểm ghim chú thích cấu tạo thật (Callout Pins) */}
            {showPins &&
              annotations.map((pin, idx) => {
                const isSelected = activePinIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePinIndex(idx)}
                    style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                    className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full font-mono text-[11.5px] font-extrabold flex items-center justify-center transition-transform cursor-pointer shadow-lg ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 scale-125 ring-4 ring-amber-400/40'
                        : 'bg-[#1E6BFF] text-white hover:scale-110 ring-2 ring-white/80'
                    }`}
                    title={pin.label}
                  >
                    {idx + 1}
                  </button>
                );
              })}
          </div>

          {/* Thanh giải thích điểm chú thích đang chọn */}
          {showPins && annotations[activePinIndex] && (
            <div className="p-2.5 rounded-[9px] bg-slate-900 border border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-[12.5px]">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-mono font-extrabold text-[12px] flex items-center justify-center shrink-0">
                  {activePinIndex + 1}
                </span>
                <div>
                  <span className="font-bold text-amber-300">
                    Cấu tạo thực tế #{activePinIndex + 1}:{' '}
                  </span>
                  <span className="text-slate-100">
                    {annotations[activePinIndex].label}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {annotations.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePinIndex(i)}
                    className={`w-6 h-6 rounded text-[11px] font-bold cursor-pointer ${
                      activePinIndex === i
                        ? 'bg-[#1E6BFF] text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Chế độ đối chiếu 3 lớp: ICON 2D <-> MÔ HÌNH 3D <-> ẢNH THẬT */
        <div className="p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Cột 1: ICON 2D */}
          <div className="p-3 rounded-[10px] bg-slate-900 border border-slate-700 flex flex-col items-center text-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-extrabold">
              1. ICON ĐẠI DIỆN (2D SVG)
            </span>
            <div className="w-28 h-28 rounded-[10px] bg-[#F3F8FF] border border-[#D4E6FF] flex items-center justify-center p-2">
              <EquipmentThumbnailSvg
                archetype={asset.geometry.proceduralArchetype}
                assetId={asset.assetId}
                className="w-24 h-24"
              />
            </div>
            <p className="text-[11.5px] text-slate-300 leading-snug">
              Hiển thị trong Danh mục dụng cụ, Bộ thí nghiệm và Thẻ nhận diện nhanh.
            </p>
          </div>

          {/* Cột 2: VẬT 3D TƯƠNG TÁC */}
          <div className="p-3 rounded-[10px] bg-slate-900 border border-emerald-500/40 flex flex-col items-center text-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>2. VẬT 3D TƯƠNG TÁC (PBR)</span>
            </span>
            <div className="w-full py-2.5 px-3 rounded-[10px] bg-slate-950 border border-slate-800 text-left space-y-1 text-[11.5px] font-mono">
              <div className="text-emerald-300 font-bold">
                • Tỷ lệ 1:1 ({asset.geometry.boundingBoxM.width}m ×{' '}
                {asset.geometry.boundingBoxM.height}m)
              </div>
              <div className="text-slate-300">
                • Khối lượng khô: {asset.scientificProperties.referenceMass?.value ?? 100} g
              </div>
              <div className="text-slate-300">
                • Thể tích chiếm chỗ:{' '}
                {asset.scientificProperties.referenceVolume?.value ?? 20} cm³
              </div>
              <div className="text-sky-300">
                • Hiển thị số đo: Đồng bộ 360°
              </div>
            </div>
            <p className="text-[11.5px] text-slate-300 leading-snug">
              Cầm kéo, xoay 360°, đặt lên cân, rót nước và đo đạc trực tiếp trên bàn 3D.
            </p>
          </div>

          {/* Cột 3: ẢNH THẬT PHÒNG THÍ NGHIỆM */}
          <div className="p-3 rounded-[10px] bg-slate-900 border border-amber-500/40 flex flex-col items-center text-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-extrabold">
              3. ẢNH THẬT ĐỐI CHIẾU
            </span>
            <div className="w-28 h-28 rounded-[10px] bg-white border border-amber-500/40 flex items-center justify-center p-1.5 overflow-hidden">
              {uploadedPhotoUrl || realPhotoFromAsset ? (
                <img
                  src={uploadedPhotoUrl || realPhotoFromAsset}
                  alt={asset.name.vi}
                  className="w-full h-full object-contain"
                />
              ) : (
                <EquipmentThumbnailSvg
                  archetype={asset.geometry.proceduralArchetype}
                  assetId={asset.assetId}
                  className="w-24 h-24 drop-shadow-lg"
                />
              )}
            </div>
            <p className="text-[11.5px] text-slate-300 leading-snug">
              Đối chiếu hình dáng thực tế, tem nhãn chuẩn Thông tư 38/2021 và chú thích cấu tạo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
