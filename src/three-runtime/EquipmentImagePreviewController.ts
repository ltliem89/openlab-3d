/**
 * OPENLAB 3D — HOST ENVIRONMENT & EQUIPMENT LIBRARY IMAGE BRIDGE CONTROLLER
 * Triển khai theo đúng đặc tả `OPENLAB3D_HOST_IMAGE_BRIDGE_SPEC.md` v1.0 (Bổ sung cho EQUIPMENT_MODULE_STANDARD v2.4)
 *
 * Trách nhiệm:
 * 1. Chuẩn hóa & kiểm định `realPhotoMeta` từ manifest module HTML hoặc thư viện `libraries3DLab`.
 * 2. Giải quyết đường dẫn ảnh an toàn (WebP/PNG/JPEG tương đối trong thư mục module, đường dẫn public, hoặc Base64 hợp lệ).
 * 3. Quản lý trạng thái hiển thị ảnh thực tế duy nhất phía Host (`hover` | `pinned` | `hidden`) với bộ hẹn giờ chống nhấp nháy 140ms.
 * 4. Cung cấp công cụ định dạng ảnh tải lên về khung chuẩn 240 × 240 (1:1, object-fit: contain, nền #ffffff, không cắt xén bộ phận).
 */

import { AssetDefinition } from '../domain/types';
import { getLibraryFolderName } from './LocalDiskLibraryEngine';

export type SupportedRealPhotoMimeType = 'image/webp' | 'image/png' | 'image/jpeg';

export interface RealPhotoDisplaySpec {
  width: 240;
  height: 240;
  ratio: '1:1';
  fit: 'contain';
  background: string;
}

export interface RealPhotoMeta {
  available: boolean;
  src?: string;
  mimeType?: SupportedRealPhotoMimeType;
  alt: string;
  display?: {
    width?: 240;
    height?: 240;
    ratio?: '1:1';
    fit?: 'contain';
    background?: string;
  };
  sourceKind?: 'real-photo' | 'illustration';
  caption?: string;
  sourceCredit?: string;
  thumbnailSrc?: string;
  /** Trường mở rộng tương thích ngược với hồ sơ chú thích v2.3 */
  manufacturerRef?: string;
  realWorldScaleNote?: string;
  annotations?: Array<{
    xPercent: number;
    yPercent: number;
    label: string;
  }>;
  customUploadedDataUrl?: string;
}

export interface EquipmentLibraryEntry {
  moduleId: string;
  slug: string;
  name: string;
  category: string;
  iconTemplate?: string;
  realPhotoMeta: RealPhotoMeta;
  fallbackSvgMarkup?: string;
  moduleVersion?: string;
  isPreinstalledInLibraryDisk?: boolean;
}

export type PreviewMode = 'hover' | 'pinned' | 'hidden';
export type PreviewHideReason = 'pointer-leave' | 'close' | 'escape' | 'viewport-click';

export interface EquipmentImagePreviewState {
  mode: PreviewMode;
  activeModuleId: string | null;
  entry: EquipmentLibraryEntry | null;
  imageLoadError: string | null;
}

export interface EquipmentImageErrorLog {
  timestampIso: string;
  moduleId: string;
  src: string;
  reason: string;
}

export interface EquipmentImagePreviewController {
  preview(moduleId: string, mode: 'hover' | 'pinned'): void;
  hide(reason?: PreviewHideReason): void;
  dispose(): void;
}

const MAX_BASE64_DATA_URI_LENGTH = 8 * 1024 * 1024; // 8 MB giới hạn an toàn cho Data URI
const HOVER_LEAVE_DELAY_MS = 150; // 100-180ms theo Mục 4.1 để chống nhấp nháy khi rê chuột sang panel

/**
 * Danh sách 16 thiết bị đã được tải ảnh thực tế từ mạng và chuẩn hóa 240×240 (1:1 contain)
 * đặt sẵn trong thư mục thư viện `/public/libraries3DLab/<AssetId>_<slug>/assets/<slug>.<ext>`
 * (12 thiết bị còn lại giữ ở chế độ mặc định theo đúng yêu cầu để đối chiếu & cập nhật linh hoạt).
 */
export const PREINSTALLED_LIBRARY_REAL_PHOTOS: Record<
  string,
  {
    slug: string;
    ext: 'webp' | 'png' | 'jpg';
    mimeType: SupportedRealPhotoMimeType;
    caption: string;
    sourceCredit: string;
  }
> = {
  'OL3D-EQP-BAL-0001': {
    slug: 'can-dien-tu-hien-so-500g',
    ext: 'png',
    mimeType: 'image/png',
    caption: 'Cân điện tử hiện số OHAUS Scout 500g × 0.01g dùng trong phòng thí nghiệm KHTN',
    sourceCredit: 'OHAUS Scout Series Reference Photo',
  },
  'OL3D-EQP-MAG-0001': {
    slug: 'handheld-magnifying-glass-5x',
    ext: 'png',
    mimeType: 'image/png',
    caption: 'Kính lúp cầm tay khung kim loại độ bội giác 5x quan sát mẫu vật nhỏ',
    sourceCredit: 'Wikimedia Commons (CC BY-SA)',
  },
  'OL3D-EQP-CYL-0001': {
    slug: 'ong-dong-thuy-tinh-100ml',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Ống đong thủy tinh Borosilicate 3.3 chia vạch chuẩn đo thể tích chất lỏng',
    sourceCredit: 'Wikimedia Commons (CC BY-SA)',
  },
  'OL3D-EQP-BKR-0001': {
    slug: 'coc-thuy-tinh-250ml',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Cốc thủy tinh chịu nhiệt Borosilicate có mỏ rót và vạch chia dung tích',
    sourceCredit: 'Wikimedia Commons (Public Domain)',
  },
  'OL3D-EQP-FLK-0001': {
    slug: 'binh-tam-giac-erlenmeyer-250ml',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Bình tam giác cổ hẹp Erlenmeyer 250 ml chuẩn độ và lắc phản ứng hóa học',
    sourceCredit: 'Wikimedia Commons (Hannes Grobe)',
  },
  'OL3D-EQP-CAL-0001': {
    slug: 'thuoc-cap-du-xich-150mm',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Thước cặp du xích thép không gỉ 0–150 mm đo đường kính ngoài, trong và chiều sâu',
    sourceCredit: 'Wikimedia Commons (CC BY-SA)',
  },
  'OL3D-EQP-DYN-0001': {
    slug: 'luc-ke-lo-xo-5n',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Lực kế lò xo treo đo trọng lượng và lực kéo cơ học trong phòng thí nghiệm',
    sourceCredit: 'Wikimedia Commons (CC BY-SA)',
  },
  'OL3D-EQP-THM-0001': {
    slug: 'nhiet-ke-phong-thi-nghiem-110c',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Nhiệt kế rượu màu đỏ -10°C đến 110°C đo nhiệt độ dung dịch thí nghiệm',
    sourceCredit: 'Wikimedia Commons (Rama / CNAM)',
  },
  'OL3D-EQP-OPT-0001': {
    slug: 'thau-kinh-hoi-tu-f100mm',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Thấu kính hội tụ rìa mỏng dùng trong thí nghiệm quang học KHTN 9',
    sourceCredit: 'Wikimedia Commons (CC BY-SA)',
  },
  'OL3D-EQP-PRM-0001': {
    slug: 'equilateral-optical-prism-stand',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Lăng kính tam giác thủy tinh quang học khảo sát khúc xạ và tán sắc ánh sáng',
    sourceCredit: 'Wikimedia Commons (CC BY-SA)',
  },
  'OL3D-EQP-DMM-0001': {
    slug: 'digital-multimeter-ac-dc',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Đồng hồ vạn năng hiện số đo hiệu điện thế U, cường độ dòng điện I và điện trở R',
    sourceCredit: 'Wikimedia Commons (André Karwath)',
  },
  'OL3D-EQP-SEP-0001': {
    slug: 'separatory-funnel-stand',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Phễu chiết thủy tinh có khóa PTFE tách hai chất lỏng không tan vào nhau',
    sourceCredit: 'Wikimedia Commons (CC BY-SA)',
  },
  'OL3D-EQP-MIC-0001': {
    slug: 'optical-microscope-chromosome-slide',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Kính hiển vi quang học 3 vật kính quan sát tiêu bản tế bào và nhiễm sắc thể',
    sourceCredit: 'Wikimedia Commons (CC BY-SA)',
  },
  'OL3D-EQP-DSH-0001': {
    slug: 'porcelain-evaporating-dish',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Bát sứ tráng men chịu nhiệt cao dùng cô cạn dung dịch muối và thí nghiệm nhiệt',
    sourceCredit: 'Wikimedia Commons (CC BY-SA)',
  },
  'OL3D-EQP-GLV-0001': {
    slug: 'center-zero-galvanometer',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Điện kế kim chỉ thị vạch 0 ở giữa phát hiện dòng điện cảm ứng điện từ',
    sourceCredit: 'Wellcome Collection (CC BY 4.0)',
  },
  'OL3D-EQP-STD-0001': {
    slug: 'gia-do-thi-nghiem-da-nang',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Giá sắt thí nghiệm đế gang kèm trụ thép và tay kẹp đa năng',
    sourceCredit: 'Wikimedia Commons (CC BY-SA)',
  },
  'OL3D-EQP-SLB-0001': {
    slug: 'semicircular-glass-slab-protractor',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Bản bán trụ thủy tinh quang học Crown BK7 đặt đồng tâm trên đĩa tròn chia độ Hartmann 360°',
    sourceCredit: 'OpenLab 3D Optics Lab / Chuẩn Thông tư 38/2021/TT-BGDĐT',
  },
  'OL3D-EQP-LEV-0001': {
    slug: 'thanh-don-bay-thang-bang',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Bộ thí nghiệm đòn bẩy thăng bằng chia vạch đối xứng kèm giá đỡ trục quay và quả cân KHTN 8',
    sourceCredit: 'Thiết bị trường học Việt Nam (Thông tư 38/2021/TT-BGDĐT)',
  },
  'OL3D-EQP-HYD-0001': {
    slug: 'binh-thong-nhau-3-nhanh',
    ext: 'webp',
    mimeType: 'image/webp',
    caption: 'Bình thông nhau 3 nhánh thủy tinh dị hình (thẳng, lượn sóng, phình) trên đế nhựa phòng thí nghiệm',
    sourceCredit: 'Thiết bị trường học Việt Nam (Thông tư 38/2021/TT-BGDĐT)',
  },
};

/**
 * Kiểm tra và giải quyết an toàn đường dẫn ảnh theo Mục 3.1 & Mục 6 của OPENLAB3D_HOST_IMAGE_BRIDGE_SPEC.md
 */
export function validateAndResolveImageSrc(
  rawSrc: string | undefined,
  moduleId: string,
  slug: string,
): {
  valid: boolean;
  resolvedSrc?: string;
  inferredMimeType?: SupportedRealPhotoMimeType;
  rejectReason?: string;
} {
  if (!rawSrc || typeof rawSrc !== 'string') {
    return { valid: false, rejectReason: 'Thiếu đường dẫn src' };
  }

  const trimmed = rawSrc.trim();
  if (!trimmed) {
    return { valid: false, rejectReason: 'Đường dẫn src rỗng' };
  }

  // Chặn tuyệt đối javascript:, vbscript:, data:text/html
  if (/^(javascript|vbscript|file):/i.test(trimmed)) {
    return {
      valid: false,
      rejectReason: `URL không an toàn bị chặn theo chính sách bảo mật: ${trimmed.slice(0, 32)}`,
    };
  }

  // Trường hợp 1: Data URI Base64
  if (trimmed.startsWith('data:')) {
    if (trimmed.length > MAX_BASE64_DATA_URI_LENGTH) {
      return {
        valid: false,
        rejectReason: `Ảnh Base64 vượt quá giới hạn kích thước cho phép (${Math.round(
          trimmed.length / 1024,
        )} KB)`,
      };
    }
    const match = trimmed.match(/^data:(image\/(webp|png|jpeg|jpg));base64,[A-Za-z0-9+/=\s]+$/i);
    if (!match) {
      return {
        valid: false,
        rejectReason: 'Data URI không đúng định dạng image/webp, image/png hoặc image/jpeg base64',
      };
    }
    const rawMime = match[1].toLowerCase();
    const normalizedMime: SupportedRealPhotoMimeType =
      rawMime === 'image/jpg' ? 'image/jpeg' : (rawMime as SupportedRealPhotoMimeType);
    return {
      valid: true,
      resolvedSrc: trimmed,
      inferredMimeType: normalizedMime,
    };
  }

  // Suy luận MIME từ đuôi file
  const lower = trimmed.split('?')[0].toLowerCase();
  let inferredMimeType: SupportedRealPhotoMimeType = 'image/webp';
  if (lower.endsWith('.png')) inferredMimeType = 'image/png';
  else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) inferredMimeType = 'image/jpeg';
  else if (lower.endsWith('.webp')) inferredMimeType = 'image/webp';
  else if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith('blob:')) {
    return {
      valid: false,
      rejectReason: `Định dạng file ảnh không nằm trong danh sách hỗ trợ (webp/png/jpeg): ${trimmed}`,
    };
  }

  // Trường hợp 2: Đường dẫn tương đối ./assets/... hoặc assets/... bên trong gói module libraries3DLab
  if (trimmed.startsWith('./') || trimmed.startsWith('assets/')) {
    const cleanRel = trimmed.replace(/^\.\//, '');
    if (cleanRel.includes('..')) {
      return {
        valid: false,
        rejectReason: 'Không cho phép đường dẫn leo thư mục (..)',
      };
    }
    const folderName = getLibraryFolderName(moduleId, slug);
    return {
      valid: true,
      resolvedSrc: `/libraries3DLab/${folderName}/${cleanRel}`,
      inferredMimeType,
    };
  }

  // Trường hợp 3: Đường dẫn tuyệt đối trong public (/libraries3DLab/... hoặc /assets/...) hoặc HTTPS/blob
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('blob:') ||
    /^https?:\/\//i.test(trimmed)
  ) {
    return {
      valid: true,
      resolvedSrc: trimmed,
      inferredMimeType,
    };
  }

  return {
    valid: false,
    rejectReason: `Đường dẫn ảnh không hợp lệ: ${trimmed}`,
  };
}

/**
 * Chuẩn hóa đối tượng `realPhotoMeta` từ manifest hoặc từ dữ liệu thiết bị
 */
export function normalizeRealPhotoMeta(
  rawMeta: Partial<RealPhotoMeta> | undefined,
  params: {
    moduleId: string;
    slug: string;
    nameVi: string;
    uploadedDataUrl?: string;
    assetRealPhotoUri?: string;
    hasFallbackSvg?: boolean;
  },
): RealPhotoMeta {
  const {
    moduleId,
    slug,
    nameVi,
    uploadedDataUrl,
    assetRealPhotoUri,
    hasFallbackSvg = false,
  } = params;

  const defaultDisplay: RealPhotoDisplaySpec = {
    width: 240,
    height: 240,
    ratio: '1:1',
    fit: 'contain',
    background: rawMeta?.display?.background || '#ffffff',
  };

  // Không bao giờ cho phép sourceKind === 'icon' giả làm ảnh thực tế (Mục 2 & Mục 3.1)
  const rawSourceKind = (rawMeta as { sourceKind?: string } | undefined)?.sourceKind;
  if (rawSourceKind === 'icon') {
    return {
      available: false,
      alt: `Chưa có ảnh thực tế cho ${nameVi}`,
      display: defaultDisplay,
      sourceKind: 'illustration',
      caption: rawMeta?.caption,
    };
  }

  // Ưu tiên 1: Ảnh thực tế do người dùng vừa tải lên / cập nhật trực tiếp
  if (uploadedDataUrl) {
    const check = validateAndResolveImageSrc(uploadedDataUrl, moduleId, slug);
    if (check.valid && check.resolvedSrc) {
      return {
        available: true,
        src: check.resolvedSrc,
        mimeType: check.inferredMimeType || 'image/png',
        alt: rawMeta?.alt || `Ảnh thực tế của ${nameVi}`,
        display: defaultDisplay,
        sourceKind: 'real-photo',
        caption: rawMeta?.caption || `${nameVi} (Ảnh thực tế đã cập nhật)`,
        sourceCredit: rawMeta?.sourceCredit || 'Người dùng cập nhật trong Studio',
        manufacturerRef: rawMeta?.manufacturerRef,
        realWorldScaleNote: rawMeta?.realWorldScaleNote,
        annotations: rawMeta?.annotations,
        customUploadedDataUrl: uploadedDataUrl,
      };
    }
  }

  // Ưu tiên 2: `realPhotoMeta.src` hoặc `customUploadedDataUrl` khai báo trong manifest của module .HTML
  const candidateManifestSrc = rawMeta?.src || rawMeta?.customUploadedDataUrl;
  if (candidateManifestSrc && rawMeta?.available !== false) {
    const check = validateAndResolveImageSrc(candidateManifestSrc, moduleId, slug);
    if (check.valid && check.resolvedSrc) {
      return {
        available: true,
        src: check.resolvedSrc,
        mimeType: rawMeta?.mimeType || check.inferredMimeType || 'image/webp',
        alt: rawMeta?.alt || `Ảnh thực tế của ${nameVi}`,
        display: defaultDisplay,
        sourceKind: 'real-photo',
        caption: rawMeta?.caption || `Ảnh thực tế của ${nameVi}`,
        sourceCredit: rawMeta?.sourceCredit,
        manufacturerRef: rawMeta?.manufacturerRef,
        realWorldScaleNote: rawMeta?.realWorldScaleNote,
        annotations: rawMeta?.annotations,
      };
    }
  }

  // Ưu tiên 3: Thiết bị nằm trong thư mục `libraries3DLab` đã được cài đặt sẵn ảnh thực tế
  const preinstalled = PREINSTALLED_LIBRARY_REAL_PHOTOS[moduleId];
  if (preinstalled && rawMeta?.available !== false) {
    const folderName = getLibraryFolderName(moduleId, preinstalled.slug);
    const resolvedSrc = `/libraries3DLab/${folderName}/assets/${preinstalled.slug}.${preinstalled.ext}`;
    return {
      available: true,
      src: resolvedSrc,
      mimeType: preinstalled.mimeType,
      alt: rawMeta?.alt || `Ảnh thực tế của ${nameVi}`,
      display: defaultDisplay,
      sourceKind: 'real-photo',
      caption: rawMeta?.caption || preinstalled.caption,
      sourceCredit: rawMeta?.sourceCredit || preinstalled.sourceCredit,
      manufacturerRef: rawMeta?.manufacturerRef,
      realWorldScaleNote: rawMeta?.realWorldScaleNote,
      annotations: rawMeta?.annotations,
    };
  }

  // Ưu tiên 4: `asset.geometry.realPhotoUris[0]` nếu có
  if (assetRealPhotoUri && rawMeta?.available !== false) {
    const check = validateAndResolveImageSrc(assetRealPhotoUri, moduleId, slug);
    if (check.valid && check.resolvedSrc) {
      return {
        available: true,
        src: check.resolvedSrc,
        mimeType: check.inferredMimeType || 'image/webp',
        alt: rawMeta?.alt || `Ảnh thực tế của ${nameVi}`,
        display: defaultDisplay,
        sourceKind: 'real-photo',
        caption: rawMeta?.caption || `Ảnh thực tế của ${nameVi}`,
        sourceCredit: rawMeta?.sourceCredit,
        manufacturerRef: rawMeta?.manufacturerRef,
        realWorldScaleNote: rawMeta?.realWorldScaleNote,
        annotations: rawMeta?.annotations,
      };
    }
  }

  // Trường hợp không có ảnh thật hợp lệ (Mục 2 & Mục 3.1):
  // Nếu module cũ có SVG trong `template#ol3d-module-real-photo`, gắn rõ sourceKind = 'illustration'
  return {
    available: false,
    alt: `Chưa có ảnh thực tế của ${nameVi}`,
    display: defaultDisplay,
    sourceKind: hasFallbackSvg ? 'illustration' : undefined,
    caption: rawMeta?.caption || `${nameVi} — Chưa nạp ảnh chụp thực tế`,
    manufacturerRef: rawMeta?.manufacturerRef,
    realWorldScaleNote: rawMeta?.realWorldScaleNote,
    annotations: rawMeta?.annotations,
  };
}

/**
 * Định dạng mọi ảnh bất kỳ (dọc, ngang, vuông) về đúng khung chuẩn 240 × 240 (tỷ lệ 1:1),
 * `object-fit: contain` trên nền `#ffffff` trung tính mà KHÔNG cắt mất bộ phận thiết bị (Mục 2).
 */
export async function formatImageToSquare240DataUrl(
  sourceFileOrUrl: File | string,
  background: string = '#ffffff',
): Promise<string> {
  const imgUrl =
    typeof sourceFileOrUrl === 'string'
      ? sourceFileOrUrl
      : await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Không thể đọc file ảnh đã chọn.'));
          reader.readAsDataURL(sourceFileOrUrl);
        });

  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const targetSize = 240;
      const padding = 10;
      const innerMax = targetSize - padding * 2;

      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imgUrl);
        return;
      }

      // Đổ nền trung tính (#ffffff)
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, targetSize, targetSize);

      // Tính tỷ lệ contain giữ nguyên 100% nội dung thiết bị, không kéo méo, không crop
      const scale = Math.min(
        innerMax / Math.max(1, img.naturalWidth || img.width),
        innerMax / Math.max(1, img.naturalHeight || img.height),
      );
      const drawW = Math.round((img.naturalWidth || img.width) * scale);
      const drawH = Math.round((img.naturalHeight || img.height) * scale);
      const offsetX = Math.round((targetSize - drawW) / 2);
      const offsetY = Math.round((targetSize - drawH) / 2);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

      resolve(canvas.toDataURL('image/webp', 0.92));
    };
    img.onerror = () => {
      reject(new Error('Không thể tải hoặc giải mã hình ảnh để định dạng 240×240.'));
    };
    img.src = imgUrl;
  });
}

class EquipmentImagePreviewControllerImpl implements EquipmentImagePreviewController {
  private mode: PreviewMode = 'hidden';
  private activeModuleId: string | null = null;
  private imageLoadError: string | null = null;
  private entries = new Map<string, EquipmentLibraryEntry>();
  private errorLogs: EquipmentImageErrorLog[] = [];
  private listeners = new Set<() => void>();
  private hideTimerId: ReturnType<typeof setTimeout> | null = null;
  private isPointerInsidePanel: boolean = false;

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emitChange(): void {
    this.listeners.forEach((fn) => fn());
  }

  private clearHideTimer(): void {
    if (this.hideTimerId !== null) {
      clearTimeout(this.hideTimerId);
      this.hideTimerId = null;
    }
  }

  /**
   * Đồng bộ danh mục thiết bị đã parse vào bộ điều khiển xem trước ảnh
   */
  syncLibraryEntries(
    assets: AssetDefinition[],
    resolveEntryExtras: (asset: AssetDefinition) => {
      uploadedDataUrl?: string;
      rawRealPhotoMeta?: Partial<RealPhotoMeta>;
      fallbackSvgMarkup?: string;
    },
  ): void {
    for (const asset of assets) {
      const extras = resolveEntryExtras(asset);
      const normalizedMeta = normalizeRealPhotoMeta(extras.rawRealPhotoMeta, {
        moduleId: asset.assetId,
        slug: asset.slug,
        nameVi: asset.name.vi,
        uploadedDataUrl: extras.uploadedDataUrl,
        assetRealPhotoUri: asset.geometry.realPhotoUris?.[0],
        hasFallbackSvg: Boolean(extras.fallbackSvgMarkup),
      });

      this.entries.set(asset.assetId, {
        moduleId: asset.assetId,
        slug: asset.slug,
        name: asset.name.vi,
        category: asset.category,
        realPhotoMeta: normalizedMeta,
        fallbackSvgMarkup: extras.fallbackSvgMarkup,
        moduleVersion: asset.assetVersion,
        isPreinstalledInLibraryDisk: Boolean(
          PREINSTALLED_LIBRARY_REAL_PHOTOS[asset.assetId] || extras.uploadedDataUrl,
        ),
      });
    }
    this.emitChange();
  }

  registerSingleEntry(entry: EquipmentLibraryEntry): void {
    this.entries.set(entry.moduleId, entry);
    this.emitChange();
  }

  getEntry(moduleId: string): EquipmentLibraryEntry | undefined {
    return this.entries.get(moduleId);
  }

  getState(): EquipmentImagePreviewState {
    return {
      mode: this.mode,
      activeModuleId: this.activeModuleId,
      entry: this.activeModuleId ? this.entries.get(this.activeModuleId) ?? null : null,
      imageLoadError: this.imageLoadError,
    };
  }

  /**
   * Hiển thị ảnh thực tế của thiết bị ở chế độ `hover` hoặc `pinned` (Mục 4.1, 4.2, 5)
   */
  preview(moduleId: string, requestedMode: 'hover' | 'pinned'): void {
    this.clearHideTimer();

    if (requestedMode === 'pinned') {
      const changedModule = this.activeModuleId !== moduleId;
      this.mode = 'pinned';
      this.activeModuleId = moduleId;
      if (changedModule) {
        this.imageLoadError = null;
      }
      this.emitChange();
      return;
    }

    // Nếu đang ở trạng thái `pinned` (đã click ghim), rê chuột ngang qua mục khác không làm mất ghim
    // cho tới khi người dùng click chọn thiết bị khác hoặc đóng ghim (Mục 4.2 Kiểm thử #9 & #10)
    if (this.mode === 'pinned') {
      return;
    }

    const changedModule = this.activeModuleId !== moduleId;
    this.mode = 'hover';
    this.activeModuleId = moduleId;
    if (changedModule) {
      this.imageLoadError = null;
    }
    this.emitChange();
  }

  /**
   * Lên lịch ẩn ngắn 150ms khi con trỏ rời mục thiết bị trong thư viện (Mục 4.1)
   * Nếu con trỏ đi vào panel ảnh thực tế, bộ hẹn giờ sẽ bị hủy.
   */
  scheduleHoverLeave(): void {
    if (this.mode !== 'hover') return;
    this.clearHideTimer();
    this.hideTimerId = setTimeout(() => {
      if (!this.isPointerInsidePanel && this.mode === 'hover') {
        this.hide('pointer-leave');
      }
    }, HOVER_LEAVE_DELAY_MS);
  }

  onPanelPointerEnter(): void {
    this.isPointerInsidePanel = true;
    this.clearHideTimer();
  }

  onPanelPointerLeave(): void {
    this.isPointerInsidePanel = false;
    if (this.mode === 'hover') {
      this.scheduleHoverLeave();
    }
  }

  /**
   * Ẩn bộ xem ảnh theo lý do (`pointer-leave` | `close` | `escape` | `viewport-click`)
   */
  hide(reason: PreviewHideReason = 'close'): void {
    this.clearHideTimer();
    if (reason === 'pointer-leave' && this.mode === 'pinned') {
      return;
    }
    this.mode = 'hidden';
    this.activeModuleId = null;
    this.imageLoadError = null;
    this.isPointerInsidePanel = false;
    this.emitChange();
  }

  /**
   * Ghi log lỗi khi ảnh bị hỏng URL và chuyển sang placeholder an toàn (Mục 6 & Mục 7 #14)
   */
  reportImageLoadError(moduleId: string, src: string, reason: string): void {
    const logEntry: EquipmentImageErrorLog = {
      timestampIso: new Date().toISOString(),
      moduleId,
      src,
      reason,
    };
    this.errorLogs.push(logEntry);
    console.warn(
      `[EquipmentImagePreviewController] Lỗi tải ảnh thực tế — moduleId="${moduleId}", src="${src}", nguyên nhân="${reason}"`,
    );
    if (this.activeModuleId === moduleId) {
      this.imageLoadError = reason;
      this.emitChange();
    }
  }

  getErrorLogs(): EquipmentImageErrorLog[] {
    return [...this.errorLogs];
  }

  dispose(): void {
    this.clearHideTimer();
    this.listeners.clear();
  }
}

export const equipmentImagePreviewController =
  new EquipmentImagePreviewControllerImpl();
