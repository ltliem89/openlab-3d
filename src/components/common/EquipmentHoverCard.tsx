import React, { useMemo } from 'react';
import { AssetDefinition } from '../../domain/types';
import { EquipmentThumbnailSvg } from './EquipmentThumbnailSvg';
import {
  PREINSTALLED_LIBRARY_REAL_PHOTOS,
} from '../../three-runtime/EquipmentImagePreviewController';
import { htmlEquipmentModuleRegistry } from '../../three-runtime/HtmlEquipmentModuleRegistry';
import { getLibraryFolderName } from '../../three-runtime/LocalDiskLibraryEngine';
import {
  Plus,
  BookOpen,
  Info,
  ShieldAlert,
  Sparkles,
  Camera,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';

export interface HoverTargetInfo {
  asset: AssetDefinition;
  rect: DOMRect;
}

interface EquipmentHoverCardProps {
  hoverTarget: HoverTargetInfo | null;
  onAddAssetToTable?: (assetId: string) => void;
  onPreviewPhoto?: (assetId: string) => void;
  isDarkMode?: boolean;
}

export const EquipmentHoverCard: React.FC<EquipmentHoverCardProps> = ({
  hoverTarget,
  onAddAssetToTable,
  onPreviewPhoto,
  isDarkMode = true,
}) => {
  if (!hoverTarget) return null;

  const { asset, rect } = hoverTarget;

  // Tính toán tọa độ hiển thị thông minh (Smart positioning & Edge clamp)
  // Chiều rộng thẻ hover: 340px, chiều cao ước tính: 360px
  const CARD_WIDTH = 340;
  const CARD_HEIGHT = 380;
  const GAP = 12;

  // Mặc định: hiện bên phải của thẻ thiết bị
  let left = rect.right + GAP;
  // Nếu sát mép phải màn hình: tự động lật sang bên trái của thẻ
  if (left + CARD_WIDTH > window.innerWidth - 10) {
    left = Math.max(10, rect.left - CARD_WIDTH - GAP);
  }

  // Tọa độ Y: căn theo cạnh trên của thẻ, clamp không để vượt mép trên/dưới
  let top = rect.top;
  if (top + CARD_HEIGHT > window.innerHeight - 10) {
    top = Math.max(10, window.innerHeight - CARD_HEIGHT - 10);
  }

  // Lấy ảnh thực tế chất lượng cao từ libraries3DLab hoặc Registry
  const photoSrc = useMemo(() => {
    const uploaded = htmlEquipmentModuleRegistry.getUploadedRealPhoto(asset.assetId);
    if (uploaded) return uploaded;

    const customModule = htmlEquipmentModuleRegistry.getModule(asset.assetId);
    if (customModule?.realPhotoMeta?.src) {
      const raw = customModule.realPhotoMeta.src.trim();
      if (raw.startsWith('data:') || raw.startsWith('/') || raw.startsWith('http')) {
        return raw;
      }
      if (raw.startsWith('assets/') || raw.startsWith('./assets/')) {
        const clean = raw.replace(/^\.\//, '');
        const folder = getLibraryFolderName(asset.assetId, customModule.asset.slug || '');
        return `/libraries3DLab/${folder}/${clean}`;
      }
    }

    const pre = PREINSTALLED_LIBRARY_REAL_PHOTOS[asset.assetId];
    if (pre) {
      const folder = getLibraryFolderName(asset.assetId, pre.slug);
      return `/libraries3DLab/${folder}/assets/${pre.slug}.${pre.ext}`;
    }

    return null;
  }, [asset.assetId, asset.slug]);

  // Thông số đo lường & vật lý chuẩn xác từ domain schema
  const mm = asset.measurementMetadata;
  const sp = asset.scientificProperties;

  const capOrRange = mm?.rangeMax
    ? `${mm.rangeMin?.value ?? 0} – ${mm.rangeMax.value} ${mm.rangeMax.unit}`
    : sp?.capacity
      ? `${sp.capacity.value} ${sp.capacity.unit}`
      : null;

  const leastCount = mm?.leastCount
    ? `${mm.leastCount.value} ${mm.leastCount.unit}`
    : null;

  const nominalMass = sp?.referenceMass
    ? `${sp.referenceMass.value} ${sp.referenceMass.unit}`
    : null;

  const dims = asset.geometry.boundingBoxM;
  const dimsText = dims
    ? `${Math.round(dims.width * 1000)} × ${Math.round(dims.height * 1000)} × ${Math.round(dims.depth * 1000)} mm`
    : null;

  return (
    <div
      style={{ left: `${left}px`, top: `${top}px` }}
      className="fixed z-[70] w-[340px] pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="rounded-[16px] bg-[#0b1b36]/45 backdrop-blur-2xl border border-sky-400/30 shadow-[0_16px_48px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] text-white p-3.5 space-y-2.5">
        {/* HEADER: TÊN THIẾT BỊ + MÃ + HUY HIỆU */}
        <div className="flex items-start justify-between gap-2 border-b border-white/15 pb-2">
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-black text-white leading-snug drop-shadow-sm">
              {asset.name.vi}
            </div>
            <div className="text-[11px] font-mono font-bold text-[#7DD3FC] flex items-center gap-1.5 mt-0.5">
              <span>{asset.assetId}</span>
              <span className="text-slate-400/60">·</span>
              <span className="text-slate-300">v{asset.assetVersion}</span>
            </div>
          </div>
          {photoSrc ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-black shrink-0 backdrop-blur-sm">
              <CheckCircle2 className="w-3 h-3 stroke-[2.8]" />
              <span>Ảnh thật 1:1</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-[10px] font-bold shrink-0 backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              <span>Vector 3D</span>
            </span>
          )}
        </div>

        {/* HÀNG TRUNG TÂM: ẢNH CHỤP 1:1 + THÔNG SỐ KỸ THUẬT */}
        <div className="flex items-center gap-3">
          {/* Khung ảnh 1:1 (105 × 105 px) */}
          <div className="w-[105px] h-[105px] rounded-[10px] bg-white/90 border border-white/40 p-1 flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden group">
            {photoSrc ? (
              <img
                src={photoSrc}
                alt={asset.name.vi}
                className="w-full h-full object-contain select-none"
                loading="eager"
              />
            ) : (
              <EquipmentThumbnailSvg
                archetype={asset.geometry.proceduralArchetype}
                assetId={asset.assetId}
                className="w-[90px] h-[90px]"
              />
            )}
            {photoSrc && onPreviewPhoto && (
              <button
                type="button"
                onClick={() => onPreviewPhoto(asset.assetId)}
                className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                title="Phóng to ảnh"
              >
                <Maximize2 className="w-5 h-5 text-white drop-shadow" />
              </button>
            )}
          </div>

          {/* Cụm thông số đo lường chính */}
          <div className="min-w-0 flex-1 space-y-1.5 text-[11px]">
            {capOrRange && (
              <div className="flex justify-between items-center bg-white/[0.08] backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/15">
                <span className="text-slate-300 font-semibold">Giới hạn đo:</span>
                <span className="font-mono font-black text-[#38BDF8]">
                  {capOrRange}
                </span>
              </div>
            )}

            {leastCount && (
              <div className="flex justify-between items-center bg-white/[0.08] backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/15">
                <span className="text-slate-300 font-semibold">ĐCNN:</span>
                <span className="font-mono font-black text-amber-300">
                  {leastCount}
                </span>
              </div>
            )}

            {dimsText && (
              <div className="flex justify-between items-center bg-white/[0.08] backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/15">
                <span className="text-slate-300 font-semibold">Kích thước:</span>
                <span className="font-mono font-bold text-slate-100 text-[10px] truncate max-w-[125px]">
                  {dimsText}
                </span>
              </div>
            )}

            {nominalMass && (
              <div className="flex justify-between items-center bg-white/[0.08] backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/15">
                <span className="text-slate-300 font-semibold">Khối lượng:</span>
                <span className="font-mono font-bold text-[#5EEAD4]">
                  {nominalMass}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* MÔ TẢ TÓM TẮT & BÀI HỌC SGK */}
        <div className="space-y-1 text-[11.5px] leading-relaxed">
          <div className="text-slate-200 line-clamp-2">
            {asset.summary || `${asset.name.vi} phục vụ các bài thực hành môn Khoa học tự nhiên.`}
          </div>

          <div className="flex items-center gap-1.5 text-[10.5px] text-amber-200 font-medium bg-amber-400/[0.08] backdrop-blur-md px-2 py-1 rounded-[8px] border border-amber-400/30">
            <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">Chuẩn Thông tư 38/2021/TT-BGDĐT · KHTN THCS</span>
          </div>
        </div>

        {/* THANH THAO TÁC NHANH DƯỚI ĐÁY THẺ */}
        <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
          <span className="text-[10px] text-slate-300 italic">
            Bấm đúp để đưa lên bàn
          </span>

          <div className="flex items-center gap-1.5">
            {onPreviewPhoto && (
              <button
                type="button"
                onClick={() => onPreviewPhoto(asset.assetId)}
                className="px-2.5 py-1 rounded-[7px] bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors border border-white/20 backdrop-blur-md"
                title="Xem ảnh thực tế chi tiết"
              >
                <Camera className="w-3 h-3 text-amber-300" />
                <span>Ảnh thật</span>
              </button>
            )}

            {onAddAssetToTable && (
              <button
                type="button"
                onClick={() => onAddAssetToTable(asset.assetId)}
                className="px-2.5 py-1 rounded-[7px] bg-gradient-to-r from-sky-500/90 to-teal-500/90 hover:from-sky-400 hover:to-teal-400 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer transition-all shadow-md border border-sky-300/30 backdrop-blur-sm"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>+ Lên bàn 3D</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
