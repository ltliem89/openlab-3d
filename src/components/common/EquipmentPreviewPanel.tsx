import React, { useEffect, useState, useRef } from 'react';
import { AssetDefinition } from '../../domain/types';
import {
  equipmentImagePreviewController,
  EquipmentImagePreviewState,
  formatImageToSquare240DataUrl,
  PREINSTALLED_LIBRARY_REAL_PHOTOS,
  validateAndResolveImageSrc,
} from '../../three-runtime/EquipmentImagePreviewController';
import { htmlEquipmentModuleRegistry } from '../../three-runtime/HtmlEquipmentModuleRegistry';
import { getLibraryFolderName } from '../../three-runtime/LocalDiskLibraryEngine';
import {
  X,
  Pin,
  Camera,
  Upload,
  Wrench,
  FileCode,
  Plus,
  AlertCircle,
  ImageOff,
  CheckCircle2,
  RotateCcw,
  Link2,
  FolderCheck,
} from 'lucide-react';

interface EquipmentPreviewPanelProps {
  assetsMap: Map<string, AssetDefinition>;
  isSidebarCollapsed: boolean;
  isDarkMode?: boolean;
  onAddAssetToTable: (assetId: string) => void;
  onInspectAssetDetail?: (asset: AssetDefinition, initialEditMode?: boolean) => void;
  onOpenHtmlUpdaterForAsset?: (asset: AssetDefinition) => void;
  onOpenPhotoUpdaterForAsset?: (asset: AssetDefinition) => void;
}

export const EquipmentPreviewPanel: React.FC<EquipmentPreviewPanelProps> = ({
  assetsMap,
  isSidebarCollapsed,
  isDarkMode = true,
  onAddAssetToTable,
  onInspectAssetDetail,
  onOpenHtmlUpdaterForAsset,
  onOpenPhotoUpdaterForAsset,
}) => {
  const [previewState, setPreviewState] = useState<EquipmentImagePreviewState>(() =>
    equipmentImagePreviewController.getState(),
  );

  useEffect(() => {
    const unsub = equipmentImagePreviewController.subscribe(() => {
      setPreviewState(equipmentImagePreviewController.getState());
    });
    return unsub;
  }, []);

  // Đóng panel khi nhấn phím Escape (Mục 4.2 & Mục 7 #11)
  useEffect(() => {
    if (previewState.mode === 'hidden') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        equipmentImagePreviewController.hide('escape');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewState.mode]);

  if (previewState.mode === 'hidden' || !previewState.entry) {
    return null;
  }

  const { entry, mode, imageLoadError } = previewState;
  const { realPhotoMeta } = entry;
  const asset = assetsMap.get(entry.moduleId);
  const bgStyle = realPhotoMeta.display?.background || '#ffffff';

  const hasValidRealPhoto =
    realPhotoMeta.available &&
    Boolean(realPhotoMeta.src) &&
    realPhotoMeta.sourceKind === 'real-photo' &&
    !imageLoadError;

  const isLegacyIllustrationFallback =
    !hasValidRealPhoto &&
    !imageLoadError &&
    realPhotoMeta.sourceKind === 'illustration' &&
    Boolean(entry.fallbackSvgMarkup);

  // Vị trí gọn bên dưới cùng cạnh thanh Thư viện thiết bị, chiều cao thấp để không che khuất các thành phần trên bàn 3D
  const positionClass = isSidebarCollapsed
    ? 'left-3 md:left-[56px] bottom-2'
    : 'left-3 md:left-[284px] lg:left-[302px] bottom-2';

  const dims = asset?.geometry.boundingBoxM;
  const dimsText = dims
    ? `${Math.round(dims.width * 1000)}×${Math.round(dims.height * 1000)}×${Math.round(dims.depth * 1000)} mm`
    : null;
  const capOrRange =
    asset?.scientificProperties.capacity || asset?.measurementMetadata?.rangeMax;
  const leastCount = asset?.measurementMetadata?.leastCount;
  const refMass = asset?.scientificProperties.referenceMass;

  return (
    <aside
      role="region"
      aria-label={`Xem trước ảnh thực tế: ${entry.name}`}
      data-preview-module-id={entry.moduleId}
      data-preview-mode={mode}
      onPointerEnter={() => equipmentImagePreviewController.onPanelPointerEnter()}
      onPointerLeave={() => equipmentImagePreviewController.onPanelPointerLeave()}
      onClick={(e) => e.stopPropagation()}
      className={`absolute ${positionClass} z-30 w-[440px] max-w-[calc(100vw-24px)] rounded-[14px] border backdrop-blur-2xl p-2.5 select-none transition-all ${
        isDarkMode
          ? 'bg-[#0b1b36]/45 border-sky-400/30 text-white shadow-[0_16px_48px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]'
          : 'bg-white/60 border-white/60 ring-1 ring-sky-500/20 text-[#051630] shadow-[0_16px_48px_rgba(9,30,58,0.2),inset_0_1px_1px_rgba(255,255,255,0.6)]'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {/* Cột trái: Khung ảnh vuông 1:1 object-fit: contain thu gọn 116×116 px sắc nét */}
        <div
          style={{ backgroundColor: bgStyle }}
          className="w-[116px] h-[116px] shrink-0 aspect-square rounded-[9px] border-[1.5px] border-slate-400/90 overflow-hidden flex items-center justify-center relative shadow-sm"
        >
          {hasValidRealPhoto && realPhotoMeta.src ? (
            <img
              key={`${entry.moduleId}-${realPhotoMeta.src}`}
              src={realPhotoMeta.src}
              alt={realPhotoMeta.alt || `Ảnh thực tế của ${entry.name}`}
              width={240}
              height={240}
              onError={() => {
                equipmentImagePreviewController.reportImageLoadError(
                  entry.moduleId,
                  realPhotoMeta.src || '',
                  'Không thể tải tệp hình ảnh từ đường dẫn đã khai báo',
                );
              }}
              className="w-full h-full object-contain select-none"
            />
          ) : imageLoadError ? (
            <div className="w-full h-full bg-[#0B1528] text-white p-2 flex flex-col items-center justify-center text-center gap-1">
              <AlertCircle className="w-5 h-5 text-amber-400 stroke-[2.2]" />
              <div className="text-[10.5px] font-extrabold text-amber-300">
                Lỗi tải ảnh
              </div>
            </div>
          ) : isLegacyIllustrationFallback && entry.fallbackSvgMarkup ? (
            <div className="w-full h-full bg-[#0B1528] p-1.5 flex flex-col items-center justify-center text-center">
              <div
                className="w-[88px] h-[88px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                dangerouslySetInnerHTML={{ __html: entry.fallbackSvgMarkup }}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-[#0A1324] text-white p-2 flex flex-col items-center justify-center text-center gap-1">
              <ImageOff className="w-5 h-5 text-slate-300" />
              <div className="text-[10.5px] font-extrabold text-white">
                Chưa có ảnh thật
              </div>
            </div>
          )}

          <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-slate-950/85 border border-white/20 text-white font-mono text-[9px] font-extrabold pointer-events-none">
            1:1
          </span>
        </div>

        {/* Cột phải: Tiêu đề + Thông số gọn + Các nút thao tác */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <h3
                  className={`text-[13px] font-extrabold leading-tight truncate ${
                    isDarkMode ? 'text-white' : 'text-[#051630]'
                  }`}
                >
                  {entry.name}
                </h3>
                {hasValidRealPhoto && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-500/30 border border-emerald-300/70 text-emerald-100 text-[9.5px] font-extrabold">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Ảnh thật</span>
                  </span>
                )}
              </div>
              <div
                className={`text-[10.5px] font-mono font-bold truncate ${
                  isDarkMode ? 'text-[#7DD3FC]' : 'text-[#0B2D5C]'
                }`}
              >
                {entry.moduleId}
                {dimsText ? ` · ${dimsText}` : ''}
              </div>
            </div>

            <button
              type="button"
              onClick={() => equipmentImagePreviewController.hide('close')}
              className="h-6 px-1.5 rounded-[5px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[10.5px] font-extrabold flex items-center justify-center gap-0.5 shrink-0 cursor-pointer transition-colors"
              title="Ẩn xem ảnh (Esc)"
              aria-label="Ẩn xem ảnh"
            >
              <span>Ẩn</span>
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>

          {/* Thông số kỹ thuật thu gọn 1 hàng */}
          {asset && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              {capOrRange && (
                <span className="px-1.5 py-0.5 rounded bg-slate-900/55 border border-white/20 text-[10.5px] font-mono font-extrabold text-[#38BDF8]">
                  GHĐ: {capOrRange.value} {capOrRange.unit}
                </span>
              )}
              {leastCount && (
                <span className="px-1.5 py-0.5 rounded bg-slate-900/55 border border-white/20 text-[10.5px] font-mono font-extrabold text-amber-300">
                  ĐCNN: {leastCount.value} {leastCount.unit}
                </span>
              )}
              {refMass && (
                <span className="px-1.5 py-0.5 rounded bg-slate-900/55 border border-white/20 text-[10.5px] font-mono font-extrabold text-[#5EEAD4]">
                  KL: {refMass.value} {refMass.unit}
                </span>
              )}
            </div>
          )}

          {/* Thanh thao tác nhanh thu gọn */}
          {asset && (
            <div className="mt-2 pt-1.5 border-t border-white/20 flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  onAddAssetToTable(asset.assetId);
                  equipmentImagePreviewController.hide('close');
                }}
                className="px-2.5 py-1 rounded-[6px] bg-[#1E6BFF] hover:bg-[#1552C7] border border-white/35 text-white text-[11px] font-extrabold flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
                <span>Đặt lên bàn</span>
              </button>

              {onOpenPhotoUpdaterForAsset && (
                <button
                  type="button"
                  onClick={() => onOpenPhotoUpdaterForAsset(asset)}
                  className="px-2 py-1 rounded-[6px] bg-amber-500/25 hover:bg-amber-500/45 border border-amber-300/80 text-amber-100 text-[11px] font-extrabold flex items-center gap-1 cursor-pointer"
                  title="Đổi hoặc cập nhật hình ảnh thực tế 240×240"
                >
                  <Camera className="w-3 h-3 shrink-0" />
                  <span>Đổi ảnh</span>
                </button>
              )}

              {onInspectAssetDetail && (
                <button
                  type="button"
                  onClick={() => onInspectAssetDetail(asset, true)}
                  className="px-2 py-1 rounded-[6px] bg-sky-500/25 hover:bg-sky-500/45 border border-sky-300/80 text-sky-100 text-[11px] font-extrabold flex items-center gap-1 cursor-pointer"
                  title="Sửa thông số kỹ thuật"
                >
                  <Wrench className="w-3 h-3 shrink-0" />
                  <span>Thông số</span>
                </button>
              )}

              {onOpenHtmlUpdaterForAsset && (
                <button
                  type="button"
                  onClick={() => onOpenHtmlUpdaterForAsset(asset)}
                  className="px-2 py-1 rounded-[6px] bg-teal-500/25 hover:bg-teal-500/45 border border-teal-300/80 text-teal-100 text-[11px] font-extrabold flex items-center gap-1 cursor-pointer"
                  title="Cập nhật mã nguồn module .HTML"
                >
                  <FileCode className="w-3 h-3 shrink-0" />
                  <span>.HTML</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

/**
 * MODAL CẬP NHẬT HÌNH ẢNH THỰC TẾ (240×240, 1:1, object-fit: contain) CHO TỪNG THIẾT BỊ
 * Sử dụng Glassmorphism xuyên thấu mô phỏng 3D phía sau; giữ nguyên độ nét 100% cho khung ảnh 240×240.
 */
interface EquipmentRealPhotoUpdaterModalProps {
  asset: AssetDefinition;
  onClose: () => void;
  onPhotoUpdated: (assetId: string, dataUrlOrPath: string, caption: string) => void;
  onSwitchToEditParams?: (asset: AssetDefinition) => void;
  onSwitchToHtmlUpdater?: (asset: AssetDefinition) => void;
}

export const EquipmentRealPhotoUpdaterModal: React.FC<
  EquipmentRealPhotoUpdaterModalProps
> = ({
  asset,
  onClose,
  onPhotoUpdated,
  onSwitchToEditParams,
  onSwitchToHtmlUpdater,
}) => {
  const existingEntry = equipmentImagePreviewController.getEntry(asset.assetId);
  const preinstalled = PREINSTALLED_LIBRARY_REAL_PHOTOS[asset.assetId];
  const folderName = getLibraryFolderName(asset.assetId, asset.slug);
  const defaultLibraryUrl = preinstalled
    ? `/libraries3DLab/${folderName}/assets/${preinstalled.slug}.${preinstalled.ext}`
    : '';

  const [previewSrc, setPreviewSrc] = useState<string>(
    () =>
      htmlEquipmentModuleRegistry.getUploadedRealPhoto(asset.assetId) ||
      existingEntry?.realPhotoMeta.src ||
      defaultLibraryUrl ||
      '',
  );
  const [urlInput, setUrlInput] = useState<string>('');
  const [caption, setCaption] = useState<string>(
    () =>
      existingEntry?.realPhotoMeta.caption ||
      `Ảnh thực tế của ${asset.name.vi} (${asset.assetId})`,
  );
  const [bgColor, setBgColor] = useState<string>(
    () => existingEntry?.realPhotoMeta.display?.background || '#ffffff',
  );
  const [isFormatting, setIsFormatting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    setIsFormatting(true);
    try {
      const formattedDataUrl = await formatImageToSquare240DataUrl(file, bgColor);
      setPreviewSrc(formattedDataUrl);
      setStatusMessage(
        `Đã tự động chuẩn hóa ảnh "${file.name}" về đúng khung vuông 240 × 240 px (tỷ lệ 1:1, giữ nguyên 100% chi tiết thiết bị, nền ${bgColor}).`,
      );
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Không thể xử lý tệp ảnh đã chọn.',
      );
    } finally {
      setIsFormatting(false);
      e.target.value = '';
    }
  };

  const handleApplyUrl = async () => {
    setErrorMessage(null);
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setErrorMessage('Vui lòng nhập đường dẫn URL ảnh hoặc đường dẫn tương đối ./assets/...');
      return;
    }
    const check = validateAndResolveImageSrc(trimmed, asset.assetId, asset.slug);
    if (!check.valid || !check.resolvedSrc) {
      setErrorMessage(check.rejectReason || 'Đường dẫn ảnh không hợp lệ.');
      return;
    }

    setIsFormatting(true);
    try {
      const formatted = await formatImageToSquare240DataUrl(
        check.resolvedSrc,
        bgColor,
      );
      setPreviewSrc(formatted);
      setStatusMessage(
        'Đã tải ảnh từ đường dẫn và tự động đóng khung chuẩn 240 × 240 px (1:1 contain).',
      );
    } catch {
      setPreviewSrc(check.resolvedSrc);
      setStatusMessage(
        'Đã áp dụng đường dẫn ảnh vào khung chuẩn 240 × 240 px (object-fit: contain).',
      );
    } finally {
      setIsFormatting(false);
    }
  };

  const handleRestoreLibraryDefault = () => {
    setErrorMessage(null);
    if (defaultLibraryUrl) {
      setPreviewSrc(defaultLibraryUrl);
      setStatusMessage(
        `Đã khôi phục về ảnh thực tế gốc trong thư mục libraries3DLab/${folderName}.`,
      );
    } else {
      setPreviewSrc('');
      setStatusMessage(
        'Đã đặt lại về trạng thái mặc định (Chưa có ảnh thực tế).',
      );
    }
  };

  const handleSave = () => {
    htmlEquipmentModuleRegistry.setUploadedRealPhoto(
      asset.assetId,
      previewSrc,
      caption.trim() || `Ảnh thực tế của ${asset.name.vi}`,
    );
    onPhotoUpdated(
      asset.assetId,
      previewSrc,
      caption.trim() || `Ảnh thực tế của ${asset.name.vi}`,
    );
    equipmentImagePreviewController.preview(asset.assetId, 'pinned');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-[16px] bg-[#0B172A]/68 backdrop-blur-2xl border-2 border-[#00BCEB]/85 text-white shadow-[0_20px_56px_rgba(0,0,0,0.68)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#081222]/65 border-b border-white/20 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-extrabold text-[#38BDF8] uppercase tracking-wider">
              CẬP NHẬT ẢNH THỰC TẾ 240×240 (CHUẨN HOST IMAGE BRIDGE v1.0)
            </div>
            <h2 className="text-[17px] font-extrabold text-white mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {asset.name.vi} ({asset.assetId})
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {onSwitchToEditParams && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToEditParams(asset);
                }}
                className="px-2.5 py-1.5 rounded-[8px] bg-slate-900/65 hover:bg-slate-800 border border-amber-400/75 text-amber-200 text-[12px] font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Sửa thông số</span>
              </button>
            )}
            {onSwitchToHtmlUpdater && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToHtmlUpdater(asset);
                }}
                className="px-2.5 py-1.5 rounded-[8px] bg-teal-950/75 hover:bg-teal-900 border border-teal-400/80 text-teal-200 text-[12px] font-extrabold flex items-center gap-1 cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Cập nhật .HTML</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[8px] bg-slate-900/75 hover:bg-rose-600 border border-white/25 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Cột trái: Khung xem trước đúng chuẩn 240 × 240 CSS px, tỷ lệ 1:1, object-fit: contain (Không làm mờ ảnh) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="text-[12.5px] font-extrabold text-white mb-2">
              Khung hiển thị chuẩn (240 × 240 px · 1:1)
            </div>
            <div
              style={{ backgroundColor: bgColor }}
              className="w-[240px] h-[240px] aspect-square rounded-[12px] border-2 border-[#00BCEB] overflow-hidden flex items-center justify-center relative shadow-lg"
            >
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt={`Ảnh thực tế của ${asset.name.vi}`}
                  width={240}
                  height={240}
                  className="w-[240px] h-[240px] object-contain"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 text-slate-200 p-4 flex flex-col items-center justify-center text-center gap-2">
                  <ImageOff className="w-8 h-8 text-slate-300" />
                  <span className="text-[13px] font-extrabold text-white">
                    Chưa có ảnh thực tế
                  </span>
                </div>
              )}
              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-slate-950/85 text-white font-mono text-[10px] font-extrabold">
                240×240 contain
              </span>
            </div>

            <div className="mt-2.5 text-[11px] font-mono font-bold text-emerald-200 bg-emerald-950/60 border border-emerald-400/50 rounded px-2.5 py-1 text-center w-full truncate">
              libraries3DLab/{folderName}
            </div>
          </div>

          {/* Cột phải: Công cụ tải ảnh từ máy, nhập URL, tự động định dạng 240×240 (Nền kính mờ) */}
          <div className="md:col-span-7 space-y-3.5">
            {/* 1. Tải file từ máy tính */}
            <div className="p-3.5 rounded-[10px] bg-slate-950/45 backdrop-blur-md border border-white/25 space-y-2">
              <div className="text-[13px] font-extrabold text-white flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#38BDF8]" />
                <span>1. Tải ảnh từ máy tính / điện thoại (Tự động chuẩn hóa 240×240)</span>
              </div>
              <p className="text-[12px] font-medium text-slate-100 leading-snug">
                Ảnh dọc, ngang hay vuông đều được tự động đặt vừa khít vào canvas vuông 240 × 240 px với nền trung tính, giữ nguyên tỷ lệ và không cắt mất bộ phận thiết bị.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isFormatting}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-[8px] bg-[#1E6BFF] hover:bg-[#1552C7] text-white text-[13px] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isFormatting ? 'Đang định dạng 240×240...' : 'Chọn tệp ảnh từ máy...'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestoreLibraryDefault}
                  className="px-3 py-2 rounded-[8px] bg-slate-900/70 hover:bg-slate-800 border border-white/30 text-white text-[12px] font-extrabold flex items-center gap-1 cursor-pointer"
                  title="Khôi phục ảnh mặc định trong thư viện"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Mặc định</span>
                </button>
              </div>
            </div>

            {/* 2. Dán đường dẫn URL hoặc đường dẫn tương đối ./assets/... */}
            <div className="p-3.5 rounded-[10px] bg-slate-950/45 backdrop-blur-md border border-white/25 space-y-2">
              <div className="text-[13px] font-extrabold text-white flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-amber-300" />
                <span>2. Hoặc dùng URL ảnh / đường dẫn tương đối trong module</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="VD: ./assets/thiet-bi.webp hoặc https://..."
                  className="flex-1 px-3 py-1.5 rounded-[8px] bg-slate-950/70 border border-white/30 text-[12.5px] font-medium text-white placeholder:text-slate-300 focus:outline-none focus:border-[#00BCEB]"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-1.5 rounded-[8px] bg-amber-400 hover:bg-amber-300 text-slate-950 text-[12.5px] font-extrabold cursor-pointer shrink-0"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* 3. Chú thích & màu nền */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div className="sm:col-span-3">
                <label className="block text-[12px] font-extrabold text-white mb-1">
                  Chú thích hiển thị dưới ảnh (caption):
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-[8px] bg-slate-950/70 border border-white/30 text-[12.5px] font-semibold text-white"
                />
              </div>
              <div>
                <label className="block text-[12px] font-extrabold text-white mb-1">
                  Màu nền 1:1:
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-[34px] rounded-[8px] bg-slate-950/70 border border-white/30 cursor-pointer p-0.5"
                />
              </div>
            </div>

            {statusMessage && (
              <div className="p-2.5 rounded-[8px] bg-emerald-950/75 border border-emerald-400/70 text-emerald-100 text-[12px] font-bold">
                {statusMessage}
              </div>
            )}

            {errorMessage && (
              <div className="p-2.5 rounded-[8px] bg-rose-950/75 border border-rose-400/70 text-rose-100 text-[12px] font-bold">
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#081222]/65 border-t border-white/20 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setPreviewSrc('');
              setStatusMessage('Đã xóa ảnh để chuyển về trạng thái "Chưa có ảnh thực tế".');
            }}
            className="px-3 py-1.5 rounded-[8px] bg-slate-900/75 hover:bg-rose-950 border border-rose-400/60 text-rose-200 text-[12px] font-extrabold cursor-pointer"
          >
            Để trạng thái "Chưa có ảnh"
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[8px] bg-slate-900/75 hover:bg-slate-800 border border-white/25 text-white text-[13px] font-extrabold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-[8px] bg-[#16A34A] hover:bg-[#15803D] border border-emerald-300/50 text-white text-[13.5px] font-extrabold cursor-pointer shadow-sm"
            >
              Lưu Ảnh Thực Tế Vào Thư Viện
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
