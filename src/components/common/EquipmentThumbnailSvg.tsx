import React, { useState } from 'react';
import { ProceduralArchetype } from '../../domain/types';
import {
  htmlEquipmentModuleRegistry,
  HtmlEquipmentModulePackage,
} from '../../three-runtime/HtmlEquipmentModuleRegistry';
import { PREINSTALLED_LIBRARY_REAL_PHOTOS } from '../../three-runtime/EquipmentImagePreviewController';
import { getLibraryFolderName } from '../../three-runtime/LocalDiskLibraryEngine';

interface EquipmentThumbnailSvgProps {
  archetype: ProceduralArchetype;
  assetId?: string;
  className?: string;
  preferRealPhoto?: boolean;
}

/**
 * Phát hiện các SVG mẫu tạm (placeholder) có viền đen xám hoặc dòng text mã thiết bị
 * (như DYN-0001, CAL-0001, THM-0001, STD-0001) để loại bỏ, không hiển thị làm hỏng giao diện.
 */
function isPlaceholderSvg(markup?: string | null): boolean {
  if (!markup) return false;
  // Bất kỳ SVG nào in thẳng mã ID thiết bị (như CAL-0001, DYN-0001, THM-0001, STD-0001) đều là placeholder tạm
  if (/[A-Z]{2,4}-\d{4}/.test(markup)) return true;
  // Các khối nền xám chữ monospace mô phỏng terminal placeholder
  if (
    markup.includes('monospace') &&
    (markup.includes('#1E293B') || markup.includes('#0F172A') || markup.includes('#090D16') || markup.includes('#0B1526'))
  ) {
    return true;
  }
  // Nếu chỉ có một thẻ rect đơn điệu không có path/circle/ellipse/line vẽ chi tiết thiết bị
  if (
    !markup.includes('<path') &&
    !markup.includes('<circle') &&
    !markup.includes('<ellipse') &&
    !markup.includes('<line') &&
    !markup.includes('<polygon')
  ) {
    return true;
  }
  return false;
}

/**
 * Truy xuất đường dẫn ảnh chụp thực tế chuẩn xác (240x240) từ thư mục assets hoặc dữ liệu Base64
 */
function getRealPhotoUrl(
  assetId?: string,
  customModule?: HtmlEquipmentModulePackage | null,
): string | null {
  if (!assetId) return null;
  const uploaded = htmlEquipmentModuleRegistry.getUploadedRealPhoto(assetId);
  if (uploaded) return uploaded;

  if (customModule?.realPhotoMeta?.customUploadedDataUrl) {
    return customModule.realPhotoMeta.customUploadedDataUrl;
  }
  if (customModule?.realPhotoMeta?.src) {
    const raw = customModule.realPhotoMeta.src.trim();
    if (raw.startsWith('data:') || raw.startsWith('/') || raw.startsWith('http')) {
      return raw;
    }
    if (raw.startsWith('assets/') || raw.startsWith('./assets/')) {
      const clean = raw.replace(/^\.\//, '');
      const folder = getLibraryFolderName(assetId, customModule.asset.slug || '');
      return `/libraries3DLab/${folder}/${clean}`;
    }
  }

  const pre = PREINSTALLED_LIBRARY_REAL_PHOTOS[assetId];
  if (pre) {
    const folder = getLibraryFolderName(assetId, pre.slug);
    return `/libraries3DLab/${folder}/assets/${pre.slug}.${pre.ext}`;
  }

  return null;
}

export const EquipmentThumbnailSvg: React.FC<EquipmentThumbnailSvgProps> = ({
  archetype,
  assetId,
  className = 'w-14 h-14',
  preferRealPhoto = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const customModule = assetId
    ? htmlEquipmentModuleRegistry.getModule(assetId)
    : htmlEquipmentModuleRegistry.getByArchetypeOrSlug(archetype);

  const photoUrl = getRealPhotoUrl(assetId, customModule);

  // 1. Ưu tiên 1: Hiển thị hình ảnh chụp thực tế chất lượng cao từ thư mục libraries3DLab
  if (preferRealPhoto && photoUrl && !imgError) {
    return (
      <div
        className={`${className} flex items-center justify-center p-0.5 relative overflow-hidden rounded-[8px] bg-white/70 shadow-2xs border border-slate-200/80`}
      >
        <img
          src={photoUrl}
          alt={assetId || archetype}
          className="w-full h-full object-contain select-none pointer-events-none drop-shadow-xs"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // 2. Ưu tiên 2: Icon SVG riêng của module nếu là hình vẽ vector chuẩn (không phải ô vuông chữ nhật tạm)
  if (customModule && customModule.iconSvgMarkup && !isPlaceholderSvg(customModule.iconSvgMarkup)) {
    return (
      <div
        className={`${className} flex items-center justify-center [&>svg]:w-full [&>svg]:h-full`}
        dangerouslySetInnerHTML={{ __html: customModule.iconSvgMarkup }}
        aria-hidden="true"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="35%" stopColor="#F8FAFC" />
          <stop offset="70%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="35%" stopColor="#FDE68A" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(186,230,253,0.55)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="75%" stopColor="rgba(224,242,254,0.35)" />
          <stop offset="100%" stopColor="rgba(125,211,252,0.65)" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(56,189,248,0.68)" />
          <stop offset="50%" stopColor="rgba(14,165,233,0.58)" />
          <stop offset="100%" stopColor="rgba(2,132,199,0.75)" />
        </linearGradient>
        <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(18,52,107,0.22)" />
          <stop offset="70%" stopColor="rgba(18,52,107,0.08)" />
          <stop offset="100%" stopColor="rgba(18,52,107,0)" />
        </radialGradient>
      </defs>

      {/* Soft ground contact shadow */}
      <ellipse cx="48" cy="82" rx="32" ry="6" fill="url(#shadowGrad)" />

      {archetype === 'electronic-balance' && (
        <g>
          {/* 4 Chân đế xoay chỉnh thăng bằng màu đỏ hồng OHAUS */}
          <ellipse cx="21" cy="76" rx="6.5" ry="2.6" fill="#E11D48" stroke="#9F1239" strokeWidth="1" />
          <ellipse cx="75" cy="76" rx="6.5" ry="2.6" fill="#E11D48" stroke="#9F1239" strokeWidth="1" />
          <ellipse cx="25" cy="54" rx="5" ry="2" fill="#E11D48" />
          <ellipse cx="71" cy="54" rx="5" ry="2" fill="#E11D48" />

          {/* Đế gầm màu xám bạc bo tròn */}
          <path
            d="M15 68 C15 66 17 65 20 65 H76 C79 65 81 66 81 68 L79 75 C79 76.5 77 77.5 74 77.5 H22 C19 77.5 17 76.5 17 75 Z"
            fill="#CBD5E1"
            stroke="#94A3B8"
            strokeWidth="1.2"
          />

          {/* Thân cân màu trắng sứ bo tròn mềm mại và lượn eo OHAUS Scout */}
          <path
            d="M21 44 C21 41 24 39 28 39 H68 C72 39 75 41 75 44 C73 51 74 58 80 66 C81 68 79 73 75 73 H21 C17 73 15 68 16 66 C22 58 23 51 21 44 Z"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="1.6"
          />

          {/* Màn hình LCD nền trắng xanh sáng có 2 viền đỏ trên/dưới */}
          <rect
            x="29"
            y="49"
            width="36"
            height="12"
            rx="2"
            fill="#DCE7F5"
            stroke="#94A3B8"
            strokeWidth="1"
          />
          <line x1="30" y1="49.8" x2="64" y2="49.8" stroke="#DC2626" strokeWidth="1.4" />
          <line x1="30" y1="60.2" x2="64" y2="60.2" stroke="#DC2626" strokeWidth="1.4" />
          <text
            x="61"
            y="58.2"
            fill="#0F172A"
            fontSize="8.8"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="end"
          >
            0.00g
          </text>

          {/* Logo OHAUS đỏ bên trái & Giọt nước cân bằng bên phải */}
          <polygon points="21,54 25,51 27,55 23,57" fill="#DC2626" />
          <circle cx="70.5" cy="53.5" r="2.8" fill="#DBEAFE" stroke="#DC2626" strokeWidth="1" />

          {/* 4 Phím bấm chữ nhật viền đỏ bên dưới màn hình */}
          {[24, 36.5, 49, 61.5].map((bx, i) => (
            <rect
              key={i}
              x={bx}
              y="63.5"
              width="10"
              height="6"
              rx="1.2"
              fill="#FFFFFF"
              stroke="#DC2626"
              strokeWidth="1"
            />
          ))}

          {/* Đĩa cân Inox hình chữ nhật bo tròn 4 góc và vát mép */}
          <rect
            x="21"
            y="27"
            width="54"
            height="17"
            rx="6"
            fill="url(#metalGrad)"
            stroke="#64748B"
            strokeWidth="1.5"
          />
          <rect
            x="23"
            y="28"
            width="50"
            height="13.5"
            rx="5"
            fill="#F1F5F9"
            stroke="#CBD5E1"
            strokeWidth="1"
          />
        </g>
      )}

      {archetype === 'graduated-cylinder' && (
        <g>
          {/* Hexagonal base */}
          <polygon
            points="27,79 69,79 64,73 32,73"
            fill="url(#glassGrad)"
            stroke="#64748B"
            strokeWidth="1.5"
          />
          {/* Tall slender glass cylinder */}
          <rect
            x="37"
            y="14"
            width="22"
            height="60"
            rx="1.5"
            fill="url(#glassGrad)"
            stroke="#38BDF8"
            strokeWidth="1.6"
          />
          {/* Water column */}
          <rect x="38.2" y="41" width="19.6" height="32" fill="url(#waterGrad)" />
          {/* Meniscus curve */}
          <path
            d="M38.2 41 Q48 44.5 57.8 41"
            stroke="#0284C7"
            strokeWidth="1.8"
            fill="rgba(125,211,252,0.55)"
          />
          {/* Top rim lip */}
          <ellipse
            cx="48"
            cy="14"
            rx="11.5"
            ry="2.5"
            fill="#E0F2FE"
            stroke="#0284C7"
            strokeWidth="1.4"
          />
          {/* Graduation ticks */}
          {[22, 28, 34, 40, 46, 52, 58, 64].map((y, i) => (
            <line
              key={y}
              x1="41"
              y1={y}
              x2={i % 2 === 0 ? '50' : '46'}
              y2={y}
              stroke="#0B3A7D"
              strokeWidth={i % 2 === 0 ? '1.5' : '1'}
            />
          ))}
          {/* Glass specular highlight */}
          <line
            x1="40"
            y1="18"
            x2="40"
            y2="71"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      )}

      {archetype === 'overflow-can' && (
        <g>
          {/* Transparent vessel body */}
          <rect
            x="22"
            y="22"
            width="38"
            height="56"
            rx="3"
            fill="url(#glassGrad)"
            stroke="#0284C7"
            strokeWidth="1.6"
          />
          {/* Water filled up to spout level */}
          <rect x="23.5" y="38" width="35" height="38.5" rx="1.5" fill="url(#waterGrad)" />
          <path
            d="M23.5 38 Q41 40.5 58.5 38"
            stroke="#0284C7"
            strokeWidth="1.6"
            fill="none"
          />
          {/* Top rim */}
          <ellipse
            cx="41"
            cy="22"
            rx="19"
            ry="3"
            fill="#E0F2FE"
            stroke="#0284C7"
            strokeWidth="1.5"
          />
          {/* Angled overflow spout tube */}
          <path
            d="M60 36 L79 49 L77 53 L59 41 Z"
            fill="url(#glassGrad)"
            stroke="#0284C7"
            strokeWidth="1.5"
          />
          {/* Water droplet at spout tip */}
          <circle cx="79" cy="55" r="2.5" fill="#00BCEB" />
          {/* Specular reflection */}
          <line
            x1="26"
            y1="27"
            x2="26"
            y2="73"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      )}

      {archetype === 'beaker-250' && (
        <g>
          {/* Low wide glass beaker body */}
          <path
            d="M23 28 L25 74 Q25 78 29 78 H67 Q71 78 71 74 L73 28 Z"
            fill="url(#glassGrad)"
            stroke="#0284C7"
            strokeWidth="1.6"
          />
          {/* Water inside */}
          <path
            d="M25.5 52 H70.5 L69.5 73.5 Q69.5 76.5 66 76.5 H30 Q26.5 76.5 26.5 73.5 Z"
            fill="url(#waterGrad)"
          />
          <ellipse
            cx="48"
            cy="52"
            rx="22.2"
            ry="2.5"
            fill="rgba(125,211,252,0.55)"
            stroke="#0284C7"
            strokeWidth="1.2"
          />
          {/* Top open mouth rim */}
          <ellipse
            cx="48"
            cy="28"
            rx="25.5"
            ry="3.5"
            fill="#E0F2FE"
            stroke="#0284C7"
            strokeWidth="1.6"
          />
          {/* Graduation lines */}
          {[38, 46, 54, 62, 70].map((y, i) => (
            <line
              key={y}
              x1="33"
              y1={y}
              x2={i % 2 === 0 ? '45' : '40'}
              y2={y}
              stroke="#0B3A7D"
              strokeWidth="1.4"
            />
          ))}
          <line
            x1="29"
            y1="33"
            x2="30"
            y2="72"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      )}

      {archetype === 'solid-cylinder' && (
        <g>
          {/* Top hook ring */}
          <circle
            cx="48"
            cy="20"
            r="4.5"
            stroke="#475569"
            strokeWidth="2.2"
            fill="none"
          />
          {/* Metallic cylinder body */}
          <path
            d="M31 28 V69 C31 73 65 73 65 69 V28 Z"
            fill="url(#metalGrad)"
            stroke="#475569"
            strokeWidth="1.6"
          />
          {/* Top metallic ellipse */}
          <ellipse
            cx="48"
            cy="28"
            rx="17"
            ry="5"
            fill="#F1F5F9"
            stroke="#475569"
            strokeWidth="1.6"
          />
          {/* Metallic sheen */}
          <line
            x1="37"
            y1="33"
            x2="37"
            y2="68"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      )}

      {archetype === 'calibration-weight' && (
        <g>
          <path
            d="M32 38 V72 C32 76 64 76 64 72 V38 Z"
            fill="url(#brassGrad)"
            stroke="#92400E"
            strokeWidth="1.6"
          />
          <ellipse
            cx="48"
            cy="38"
            rx="16"
            ry="4.5"
            fill="#FDE68A"
            stroke="#92400E"
            strokeWidth="1.5"
          />
          <rect
            x="42"
            y="29"
            width="12"
            height="8"
            rx="1.5"
            fill="url(#brassGrad)"
            stroke="#92400E"
            strokeWidth="1.4"
          />
          <ellipse
            cx="48"
            cy="27"
            rx="10"
            ry="3.5"
            fill="#FDE68A"
            stroke="#92400E"
            strokeWidth="1.5"
          />
          <text
            x="48"
            y="59"
            fill="#78350F"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
            textAnchor="middle"
          >
            50g
          </text>
        </g>
      )}

      {archetype === 'spring-dynamometer' && (
        <g>
          <circle cx="48" cy="14" r="4.5" stroke="#475569" strokeWidth="2" />
          <rect
            x="38"
            y="19"
            width="20"
            height="46"
            rx="3"
            fill="url(#glassGrad)"
            stroke="#475569"
            strokeWidth="1.6"
          />
          <path
            d="M48 23 L43 27 L53 31 L43 35 L53 39 L48 44"
            stroke="#D97706"
            strokeWidth="1.8"
            fill="none"
          />
          <rect x="40" y="44" width="16" height="3.5" rx="1" fill="#EF4444" />
          <line x1="48" y1="47" x2="48" y2="71" stroke="#475569" strokeWidth="2.2" />
          <path
            d="M48 71 C48 77 56 77 55 71"
            stroke="#475569"
            strokeWidth="2.2"
            fill="none"
          />
        </g>
      )}

      {archetype === 'vernier-caliper' && (
        <g>
          <rect
            x="12"
            y="34"
            width="72"
            height="10"
            rx="1.5"
            fill="url(#metalGrad)"
            stroke="#475569"
            strokeWidth="1.5"
          />
          <polygon
            points="12,34 22,34 22,68 16,68 12,56"
            fill="url(#metalGrad)"
            stroke="#475569"
            strokeWidth="1.5"
          />
          <polygon
            points="38,31 54,31 54,46 45,46 45,68 38,56"
            fill="#1E6BFF"
            fillOpacity="0.2"
            stroke="#1E6BFF"
            strokeWidth="1.8"
          />
        </g>
      )}

      {archetype === 'solid-sphere' && (
        <g>
          <circle
            cx="48"
            cy="52"
            r="22"
            fill="url(#metalGrad)"
            stroke="#475569"
            strokeWidth="1.6"
          />
          <ellipse
            cx="41"
            cy="43"
            rx="6"
            ry="3.5"
            transform="rotate(-25 41 43)"
            fill="#FFFFFF"
            fillOpacity="0.75"
          />
        </g>
      )}

      {archetype === 'solid-block' && (
        <g>
          <polygon
            points="22,44 48,32 74,44 48,56"
            fill="#FDE68A"
            stroke="#92400E"
            strokeWidth="1.6"
          />
          <polygon
            points="22,44 48,56 48,74 22,62"
            fill="#F59E0B"
            stroke="#92400E"
            strokeWidth="1.6"
          />
          <polygon
            points="74,44 48,56 48,74 74,62"
            fill="#D97706"
            stroke="#92400E"
            strokeWidth="1.6"
          />
        </g>
      )}

      {archetype === 'hollow-cylinder' && (
        <g>
          <path
            d="M29 28 V69 C29 74 67 74 67 69 V28 Z"
            fill="url(#brassGrad)"
            stroke="#9A3412"
            strokeWidth="1.6"
          />
          <ellipse
            cx="48"
            cy="28"
            rx="19"
            ry="5.5"
            fill="#FDBA74"
            stroke="#9A3412"
            strokeWidth="1.6"
          />
          <ellipse cx="48" cy="28" rx="11" ry="3.2" fill="#431407" />
        </g>
      )}

      {archetype === 'erlenmeyer-flask' && (
        <g>
          <path
            d="M41 18 H55 V34 L72 72 Q74 76 69 76 H27 Q22 76 24 72 L41 34 Z"
            fill="url(#glassGrad)"
            stroke="#0284C7"
            strokeWidth="1.6"
          />
          <path
            d="M31 56 H65 L71 71 Q72 74.5 68 74.5 H28 Q24 74.5 25 71 Z"
            fill="url(#waterGrad)"
          />
          <ellipse
            cx="48"
            cy="18"
            rx="7.5"
            ry="2"
            fill="#E0F2FE"
            stroke="#0284C7"
            strokeWidth="1.5"
          />
        </g>
      )}

      {archetype === 'retort-stand' && (
        <g>
          <rect
            x="20"
            y="72"
            width="56"
            height="6"
            rx="2"
            fill="#334155"
            stroke="#1E293B"
            strokeWidth="1.5"
          />
          <line x1="32" y1="16" x2="32" y2="72" stroke="#64748B" strokeWidth="3.5" />
          <rect x="27" y="26" width="11" height="9" rx="1.5" fill="#1E6BFF" />
          <line x1="38" y1="30.5" x2="66" y2="30.5" stroke="#64748B" strokeWidth="3" />
          <circle cx="64" cy="35" r="3.5" stroke="#0284C7" strokeWidth="1.8" />
        </g>
      )}

      {archetype === 'optical-lens' && (
        <g>
          <rect x="30" y="72" width="36" height="6" rx="2" fill="#334155" />
          <line x1="48" y1="54" x2="48" y2="72" stroke="#475569" strokeWidth="3.5" />
          <circle cx="48" cy="35" r="19" stroke="#1E293B" strokeWidth="3" />
          <ellipse
            cx="48"
            cy="35"
            rx="8"
            ry="17"
            fill="url(#glassGrad)"
            stroke="#0284C7"
            strokeWidth="1.6"
          />
        </g>
      )}

      {archetype === 'thermometer' && (
        <g>
          <rect
            x="43"
            y="14"
            width="10"
            height="54"
            rx="5"
            fill="url(#glassGrad)"
            stroke="#0284C7"
            strokeWidth="1.6"
          />
          <circle
            cx="48"
            cy="70"
            r="7.5"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="1.5"
          />
          <line x1="48" y1="32" x2="48" y2="65" stroke="#EF4444" strokeWidth="3.2" />
        </g>
      )}

      {archetype === 'laser-source' && (
        <g>
          <rect
            x="16"
            y="34"
            width="42"
            height="30"
            rx="4"
            fill="#F1F5F9"
            stroke="#475569"
            strokeWidth="1.6"
          />
          <rect x="24" y="39" width="12" height="5" rx="1.5" fill="#EF4444" />
          <rect x="24" y="46.5" width="12" height="5" rx="1.5" fill="#EF4444" />
          <rect x="24" y="54" width="12" height="5" rx="1.5" fill="#EF4444" />
          <line x1="58" y1="41.5" x2="86" y2="41.5" stroke="#FF1E42" strokeWidth="2.4" />
          <line x1="58" y1="49" x2="86" y2="49" stroke="#FF1E42" strokeWidth="2.4" />
          <line x1="58" y1="56.5" x2="86" y2="56.5" stroke="#FF1E42" strokeWidth="2.4" />
        </g>
      )}

      {archetype === 'semicircular-slab' && (
        <g>
          <circle
            cx="48"
            cy="48"
            r="32"
            fill="#F8FAFC"
            stroke="#0B3A7D"
            strokeWidth="1.8"
          />
          <line x1="48" y1="16" x2="48" y2="80" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 2" />
          <line x1="16" y1="48" x2="80" y2="48" stroke="#64748B" strokeWidth="1.4" />
          <path
            d="M26 48 A22 22 0 0 1 70 48 Z"
            fill="url(#glassGrad)"
            stroke="#0284C7"
            strokeWidth="1.8"
          />
          <line x1="25" y1="72" x2="48" y2="48" stroke="#EF4444" strokeWidth="2.2" />
          <line x1="48" y1="48" x2="64" y2="23" stroke="#22C55E" strokeWidth="2.2" />
          <line x1="48" y1="48" x2="71" y2="72" stroke="#F59E0B" strokeWidth="1.6" strokeDasharray="2 2" />
        </g>
      )}

      {archetype === 'optical-prism' && (
        <g>
          <polygon
            points="48,18 22,66 74,66"
            fill="url(#glassGrad)"
            stroke="#0284C7"
            strokeWidth="2"
          />
          <line x1="12" y1="52" x2="35" y2="42" stroke="#FFFFFF" strokeWidth="2.5" />
          <line x1="61" y1="42" x2="86" y2="45" stroke="#EF4444" strokeWidth="2" />
          <line x1="62" y1="45" x2="86" y2="50" stroke="#F59E0B" strokeWidth="2" />
          <line x1="63" y1="48" x2="86" y2="55" stroke="#22C55E" strokeWidth="2" />
          <line x1="64" y1="51" x2="86" y2="60" stroke="#3B82F6" strokeWidth="2" />
          <line x1="65" y1="54" x2="86" y2="65" stroke="#8B5CF6" strokeWidth="2" />
          <rect x="30" y="72" width="36" height="5" rx="2" fill="#334155" />
        </g>
      )}

      {archetype === 'magnifying-glass' && (
        <g>
          <circle
            cx="42"
            cy="38"
            r="21"
            fill="url(#glassGrad)"
            stroke="#1E293B"
            strokeWidth="4.5"
          />
          <line
            x1="57"
            y1="53"
            x2="76"
            y2="74"
            stroke="#1E293B"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <text
            x="42"
            y="42"
            fill="#0B3A7D"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            5x
          </text>
        </g>
      )}

      {archetype === 'galvanometer' && (
        <g>
          <rect
            x="22"
            y="18"
            width="52"
            height="58"
            rx="4"
            fill="#F1F5F9"
            stroke="#334155"
            strokeWidth="2"
          />
          <rect
            x="28"
            y="24"
            width="40"
            height="28"
            rx="2"
            fill="#FFFFFF"
            stroke="#64748B"
            strokeWidth="1.4"
          />
          <path d="M33 46 A18 18 0 0 1 63 46" stroke="#0B3A7D" strokeWidth="1.5" fill="none" />
          <line x1="48" y1="48" x2="48" y2="29" stroke="#EF4444" strokeWidth="2" />
          <text x="48" y="45" fill="#0B3A7D" fontSize="9" fontWeight="bold" textAnchor="middle">
            G
          </text>
          <circle cx="34" cy="64" r="4" fill="#0F172A" />
          <circle cx="48" cy="64" r="4" fill="#EF4444" />
          <circle cx="62" cy="64" r="4" fill="#EF4444" />
        </g>
      )}

      {archetype === 'digital-multimeter' && (
        <g>
          <rect
            x="25"
            y="14"
            width="46"
            height="64"
            rx="6"
            fill="#FACC15"
            stroke="#CA8A04"
            strokeWidth="2"
          />
          <rect x="29" y="18" width="38" height="56" rx="4" fill="#1E293B" />
          <rect x="33" y="22" width="30" height="14" rx="2" fill="#051C18" stroke="#14B8A6" strokeWidth="1" />
          <text x="60" y="32" fill="#5EEAD4" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="end">
            12.0V
          </text>
          <circle cx="48" cy="50" r="10" fill="#334155" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="48" y1="50" x2="54" y2="44" stroke="#FACC15" strokeWidth="2" />
          <circle cx="37" cy="67" r="3" fill="#EF4444" />
          <circle cx="48" cy="67" r="3" fill="#EF4444" />
          <circle cx="59" cy="67" r="3" fill="#0F172A" stroke="#94A3B8" strokeWidth="1" />
        </g>
      )}

      {archetype === 'induction-coil-led' && (
        <g>
          <rect x="14" y="68" width="68" height="7" rx="2" fill="#9A5B25" />
          <rect x="16" y="42" width="24" height="12" rx="1.5" fill="#2563EB" />
          <rect x="28" y="42" width="14" height="12" rx="1.5" fill="#EF4444" />
          <rect
            x="48"
            y="34"
            width="28"
            height="34"
            rx="3"
            fill="url(#brassGrad)"
            stroke="#92400E"
            strokeWidth="1.6"
          />
          <circle cx="55" cy="26" r="4.5" fill="#EF4444" />
          <circle cx="69" cy="26" r="4.5" fill="#22C55E" />
        </g>
      )}

      {archetype === 'porcelain-dish' && (
        <g>
          <path
            d="M18 46 Q20 74 48 74 Q76 74 78 46 Z"
            fill="#F8FAFC"
            stroke="#64748B"
            strokeWidth="2"
          />
          <ellipse
            cx="48"
            cy="46"
            rx="30"
            ry="6"
            fill="#E2E8F0"
            stroke="#64748B"
            strokeWidth="1.6"
          />
          <path
            d="M48 22 Q58 36 53 45 Q48 48 43 45 Q38 36 48 22 Z"
            fill="#38BDF8"
            opacity="0.75"
          />
          <path
            d="M48 29 Q53 38 50 44 Q48 46 46 44 Q43 38 48 29 Z"
            fill="#FBBF24"
          />
        </g>
      )}

      {archetype === 'separatory-funnel' && (
        <g>
          <line x1="26" y1="14" x2="26" y2="76" stroke="#475569" strokeWidth="3.5" />
          <rect x="18" y="74" width="56" height="5" rx="2" fill="#334155" />
          <path
            d="M42 18 H58 L64 34 L50 56 L36 34 Z"
            fill="url(#glassGrad)"
            stroke="#0284C7"
            strokeWidth="1.6"
          />
          <polygon points="39,34 61,34 57,42 43,42" fill="#FBBF24" opacity="0.8" />
          <polygon points="43,42 57,42 50,55" fill="#38BDF8" opacity="0.75" />
          <line x1="50" y1="56" x2="50" y2="72" stroke="#0284C7" strokeWidth="3" />
          <rect x="43" y="59" width="14" height="4" rx="1.5" fill="#EF4444" />
        </g>
      )}

      {archetype === 'distillation-flask' && (
        <g>
          <rect x="26" y="54" width="40" height="3" fill="#94A3B8" />
          <line x1="30" y1="57" x2="26" y2="76" stroke="#475569" strokeWidth="2.5" />
          <line x1="62" y1="57" x2="66" y2="76" stroke="#475569" strokeWidth="2.5" />
          <circle
            cx="46"
            cy="39"
            r="15"
            fill="url(#glassGrad)"
            stroke="#0284C7"
            strokeWidth="1.6"
          />
          <path d="M33 43 A14 14 0 0 0 59 43 Z" fill="url(#waterGrad)" />
          <rect x="42" y="14" width="8" height="12" fill="url(#glassGrad)" stroke="#0284C7" strokeWidth="1.5" />
          <line x1="50" y1="20" x2="76" y2="34" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M46 58 Q51 65 48 70 Q46 72 44 70 Q41 65 46 58 Z" fill="#F59E0B" />
        </g>
      )}

      {archetype === 'optical-microscope' && (
        <g>
          <rect x="24" y="72" width="48" height="6" rx="2" fill="#1E293B" />
          <path
            d="M34 72 V34 Q34 24 46 24 H54"
            stroke="#F1F5F9"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <line x1="56" y1="14" x2="48" y2="30" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
          <rect x="36" y="50" width="30" height="4" rx="1" fill="#1E293B" />
          <rect x="44" y="46" width="16" height="2.5" fill="#38BDF8" />
          <line x1="48" y1="32" x2="48" y2="43" stroke="#EAB308" strokeWidth="3.5" />
          <line x1="54" y1="32" x2="58" y2="42" stroke="#3B82F6" strokeWidth="3.5" />
        </g>
      )}

      {archetype === 'dna-double-helix' && (
        <g>
          <rect x="28" y="74" width="40" height="5" rx="2" fill="#1E293B" />
          <path
            d="M34 16 C62 28, 34 44, 62 56 C34 68, 62 72, 48 74"
            stroke="#0EA5E9"
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d="M62 16 C34 28, 62 44, 34 56 C62 68, 34 72, 48 74"
            stroke="#38BDF8"
            strokeWidth="3.5"
            fill="none"
          />
          {[22, 32, 42, 52, 62].map((y, idx) => (
            <line
              key={y}
              x1="38"
              y1={y}
              x2="58"
              y2={y}
              stroke={idx % 2 === 0 ? '#EF4444' : '#22C55E'}
              strokeWidth="2.5"
            />
          ))}
        </g>
      )}

      {archetype === 'water-dispenser' && (
        <g>
          {/* Tripod stand */}
          <rect x="24" y="58" width="44" height="5" rx="2" fill="#334155" />
          <line x1="28" y1="63" x2="25" y2="79" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="46" y1="63" x2="46" y2="79" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="64" y1="63" x2="67" y2="79" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
          {/* Graduated glass reservoir carboy */}
          <rect
            x="25"
            y="18"
            width="42"
            height="40"
            rx="4"
            fill="url(#glassGrad)"
            stroke="#0284C7"
            strokeWidth="1.6"
          />
          {/* Water column */}
          <rect x="26.5" y="25" width="39" height="31.5" rx="2" fill="url(#waterGrad)" />
          {/* Blue GL45 Screw cap */}
          <rect x="37" y="11" width="18" height="7" rx="2" fill="#1E6BFF" stroke="#0B3A7D" strokeWidth="1" />
          {/* Digital ml badge */}
          <rect x="31" y="57.5" width="30" height="7" rx="1.5" fill="#041E19" stroke="#14B8A6" strokeWidth="0.9" />
          <text x="46" y="63" fill="#67E8F9" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            850 ml
          </text>
          {/* Metering valve & nozzle on right */}
          <rect x="67" y="50" width="12" height="4" rx="1" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
          <rect x="75" y="50" width="4" height="10" rx="1" fill="#94A3B8" />
          <rect x="69" y="45" width="8" height="3.5" rx="1" fill="#00BCEB" />
          <circle cx="77" cy="64" r="2.2" fill="#38BDF8" />
        </g>
      )}

      {archetype === 'optical-bench' && (
        <g>
          {/* (5) Giá quang học 90 cm có thước chia độ */}
          <rect x="10" y="54" width="76" height="14" rx="2.5" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1.5" />
          <rect x="10" y="50" width="76" height="4" rx="1" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
          {/* End caps & brass leveling feet */}
          <rect x="8" y="49" width="5" height="22" rx="1.5" fill="#1E293B" />
          <rect x="83" y="49" width="5" height="22" rx="1.5" fill="#1E293B" />
          <rect x="8" y="71" width="5" height="4" rx="1" fill="url(#brassGrad)" />
          <rect x="83" y="71" width="5" height="4" rx="1" fill="url(#brassGrad)" />
          {/* Ruler ticks */}
          {[18, 25, 32, 39, 48, 57, 64, 71, 78].map((tx) => (
            <line
              key={tx}
              x1={tx}
              y1="55"
              x2={tx}
              y2={tx === 48 ? '65' : '61'}
              stroke={tx === 48 ? '#DC2626' : '#0F172A'}
              strokeWidth={tx === 48 ? '2' : '1.2'}
            />
          ))}
          <text x="48" y="43" fill="#1E6BFF" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            (5) -45..0..+45cm
          </text>
        </g>
      )}

      {archetype === 'optical-lamp' && (
        <g>
          {/* (1) Đèn chiếu sáng Halogen kèm Đầu chắn khe sáng */}
          <rect x="28" y="66" width="26" height="10" rx="2" fill="#1E293B" stroke="#475569" strokeWidth="1.2" />
          <polygon points="41,76 38,71 44,71" fill="#EF4444" />
          <rect x="38" y="46" width="6" height="20" fill="url(#metalGrad)" />
          <rect x="20" y="24" width="38" height="24" rx="3" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          <rect x="58" y="28" width="9" height="16" rx="1.5" fill="#334155" />
          <rect x="67" y="25" width="5" height="22" rx="1" fill="url(#brassGrad)" />
          {/* 3 Golden light beams */}
          <line x1="72" y1="30" x2="90" y2="27" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="72" y1="36" x2="91" y2="36" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="72" y1="42" x2="90" y2="45" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />
          <text x="39" y="39" fill="#FDE047" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            (1)
          </text>
        </g>
      )}

      {archetype === 'frosted-f-object' && (
        <g>
          {/* (2) Vật sáng bằng kính mờ hình chữ F */}
          <rect x="34" y="68" width="28" height="9" rx="2" fill="#1E293B" />
          <polygon points="48,77 45,72 51,72" fill="#EF4444" />
          <rect x="45.5" y="52" width="5" height="16" fill="url(#metalGrad)" />
          <rect x="24" y="14" width="48" height="40" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <circle cx="48" cy="34" r="15" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2" />
          <path d="M43 25 H55 V29 H47 V33 H53 V37 H47 V44 H43 Z" fill="#B45309" />
        </g>
      )}

      {archetype === 'optical-screen' && (
        <g>
          {/* (4) Màn chắn hứng ảnh trên Giá quang học */}
          <rect x="34" y="68" width="28" height="9" rx="2" fill="#1E293B" />
          <polygon points="48,77 45,72 51,72" fill="#EF4444" />
          <rect x="45.5" y="54" width="5" height="14" fill="url(#metalGrad)" />
          <rect x="20" y="12" width="56" height="44" rx="3" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.5" />
          <line x1="48" y1="14" x2="48" y2="54" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="22" y1="34" x2="74" y2="34" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" />
          {/* Inverted F real image on screen */}
          <path d="M53 43 H41 V39 H49 V35 H43 V31 H49 V24 H53 Z" fill="#D97706" opacity="0.9" />
        </g>
      )}

      {archetype === 'optical-power-supply' && (
        <g>
          {/* (6) Nguồn điện hạ áp 3V-12V */}
          <rect x="16" y="30" width="64" height="44" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.8" />
          <rect x="20" y="35" width="56" height="34" rx="2.5" fill="#E2E8F0" />
          <rect x="22" y="37" width="52" height="9" rx="1.5" fill="#0F172A" />
          <text x="48" y="44" fill="#38BDF8" fontSize="6.8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            (6) DC 3V–12V
          </text>
          {/* Prominent raised green ON/OFF switch on top */}
          <rect x="25" y="23" width="16" height="7" rx="2" fill="#22C55E" stroke="#15803D" strokeWidth="1.2" />
          {/* Voltage knob & Red/Blue terminals */}
          <circle cx="46" cy="56" r="7.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.4" />
          <line x1="46" y1="56" x2="50" y2="51" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
          <circle cx="64" cy="58" r="3.5" fill="#DC2626" />
          <circle cx="71" cy="58" r="3.5" fill="#2563EB" />
        </g>
      )}

      {archetype === 'optical-lens-box' && (
        <g>
          {/* Hộp bộ 6 Thấu kính tiêu chuẩn (+5, +10, +15, -10, -20, ∞) */}
          <rect x="10" y="44" width="76" height="28" rx="3" fill="#7C2D12" stroke="#431407" strokeWidth="1.8" />
          <rect x="13" y="46" width="70" height="8" rx="1.5" fill="#991B1B" />
          <rect x="24" y="55" width="48" height="11" rx="1.5" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.2" />
          <text x="48" y="63" fill="#FEF08A" fontSize="6.8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
            HỘP THẤU KÍNH
          </text>
          {/* 6 lenses standing in slots */}
          {[18, 30, 42, 54, 66, 78].map((lx, idx) => (
            <g key={lx}>
              <ellipse
                cx={lx}
                cy="36"
                rx="3.2"
                ry="11"
                fill="url(#glassGrad)"
                stroke={idx < 3 ? '#F59E0B' : idx < 5 ? '#38BDF8' : '#E2E8F0'}
                strokeWidth="1.4"
              />
              <rect
                x={lx - 4.5}
                y="19"
                width="9"
                height="6"
                rx="1"
                fill="#0F172A"
                stroke={idx < 3 ? '#F59E0B' : '#38BDF8'}
                strokeWidth="0.9"
              />
            </g>
          ))}
        </g>
      )}

      {archetype === 'lever-balance-apparatus' && (
        <g>
          {/* Bộ đòn bẩy thăng bằng chia vạch đối xứng KHTN 8 */}
          {/* Chân đế gang xám đúc */}
          <rect x="24" y="70" width="48" height="8" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
          {/* Trụ đứng thép không gỉ */}
          <rect x="45.5" y="26" width="5" height="44" fill="url(#metalGrad)" stroke="#475569" strokeWidth="1" />
          {/* Đĩa chia độ 360° */}
          <circle cx="48" cy="38" r="14" fill="#F8FAFC" stroke="#0B3A7D" strokeWidth="1.5" />
          <line x1="48" y1="26" x2="48" y2="50" stroke="#DC2626" strokeWidth="1.2" strokeDasharray="2 1" />
          <line x1="36" y1="38" x2="60" y2="38" stroke="#0B3A7D" strokeWidth="1.2" />
          {/* Thanh đòn bẩy ngang có vạch chia */}
          <rect x="10" y="35.5" width="76" height="5" rx="1.5" fill="url(#metalGrad)" stroke="#334155" strokeWidth="1.2" />
          {/* Ốc đối trọng 2 đầu */}
          <rect x="10" y="34" width="4" height="8" rx="1" fill="url(#brassGrad)" stroke="#92400E" strokeWidth="1" />
          <rect x="82" y="34" width="4" height="8" rx="1" fill="url(#brassGrad)" stroke="#92400E" strokeWidth="1" />
          {/* Quả cân treo 2 bên */}
          <line x1="28" y1="40" x2="28" y2="52" stroke="#64748B" strokeWidth="1.2" />
          <rect x="24" y="52" width="8" height="10" rx="1" fill="url(#brassGrad)" stroke="#92400E" strokeWidth="1" />
          <line x1="68" y1="40" x2="68" y2="52" stroke="#64748B" strokeWidth="1.2" />
          <rect x="64" y="52" width="8" height="10" rx="1" fill="url(#brassGrad)" stroke="#92400E" strokeWidth="1" />
        </g>
      )}

      {archetype === 'communicating-vessels-3way' && (
        <g>
          {/* Bình thông nhau 3 nhánh dị hình KHTN 8 */}
          {/* Đế nhựa */}
          <rect x="18" y="72" width="60" height="7" rx="2" fill="#0F172A" stroke="#1E293B" strokeWidth="1.5" />
          {/* Ống đáy thông ngang */}
          <rect x="24" y="64" width="48" height="8" rx="1.5" fill="url(#glassGrad)" stroke="#0284C7" strokeWidth="1.4" />
          <rect x="25" y="65.5" width="46" height="5" fill="url(#waterGrad)" />
          {/* Nhánh 1: Ống thẳng đứng */}
          <rect x="26" y="22" width="10" height="44" fill="url(#glassGrad)" stroke="#0284C7" strokeWidth="1.4" />
          <rect x="27.5" y="38" width="7" height="28" fill="url(#waterGrad)" />
          {/* Nhánh 2: Ống lượn sóng */}
          <path d="M 44 65 Q 40 50 48 40 Q 54 30 46 22" fill="none" stroke="#0284C7" strokeWidth="8" strokeLinecap="round" />
          <path d="M 44 65 Q 40 50 48 40" fill="none" stroke="url(#waterGrad)" strokeWidth="5.5" strokeLinecap="round" />
          {/* Nhánh 3: Ống phình quả trám */}
          <rect x="60" y="22" width="10" height="44" fill="url(#glassGrad)" stroke="#0284C7" strokeWidth="1.4" />
          <circle cx="65" cy="40" r="9" fill="url(#glassGrad)" stroke="#0284C7" strokeWidth="1.4" />
          <circle cx="65" cy="40" r="7.5" fill="url(#waterGrad)" />
          <rect x="61.5" y="38" width="7" height="28" fill="url(#waterGrad)" />
          {/* Mặt thoáng nằm ngang đồng mức (h1 = h2 = h3) */}
          <line x1="22" y1="38" x2="74" y2="38" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="2 2" />
        </g>
      )}
    </svg>
  );
};
