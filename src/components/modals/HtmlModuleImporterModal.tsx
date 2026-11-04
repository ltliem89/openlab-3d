import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import {
  htmlEquipmentModuleRegistry,
  SAMPLE_PH_METER_HTML_MODULE,
  HtmlEquipmentModulePackage,
} from '../../three-runtime/HtmlEquipmentModuleRegistry';
import {
  localDiskLibraryEngine,
  StoredLibraryModuleEntry,
} from '../../three-runtime/LocalDiskLibraryEngine';
import equipmentStandardMdRaw from '../../../docs/archive_reports/EQUIPMENT_MODULE_STANDARD.md?raw';
import { AssetDefinition } from '../../domain/types';
import {
  X,
  Upload,
  FileCode,
  FileText,
  Download,
  Copy,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Check,
  RefreshCw,
  Trash2,
  Code2,
  Wrench,
  FolderOpen,
  HardDrive,
  Terminal,
} from 'lucide-react';

interface HtmlModuleImporterModalProps {
  targetAsset?: AssetDefinition | null;
  onClose: () => void;
  onModuleImportedAndSpawn: (
    pkg: HtmlEquipmentModulePackage,
    updatedExistingInPlace?: boolean,
  ) => void;
}

export interface ModuleDiagnosticItem {
  id: string;
  sectionName: string;
  targetTag: string;
  status: 'PASS' | 'WARN' | 'ERROR';
  message: string;
  fixHint?: string;
}

/**
 * Phân tích sâu từng phần của file .HTML để chỉ rõ chính xác lỗi ở khối nào và cách sửa
 */
function runDetailedHtmlDiagnostics(rawHtml: string): {
  diagnostics: ModuleDiagnosticItem[];
  parsedPkg: HtmlEquipmentModulePackage | null;
  hasBlockingError: boolean;
} {
  const diagnostics: ModuleDiagnosticItem[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // 1. Kiểm tra Khối 1: <script id="ol3d-module-manifest" type="application/json">
  const manifestEl = doc.getElementById('ol3d-module-manifest');
  let parsedManifestJson: Record<string, unknown> | null = null;

  if (!manifestEl) {
    diagnostics.push({
      id: 'manifest-tag',
      sectionName: '1. Khối thông số JSON Manifest',
      targetTag: '<script id="ol3d-module-manifest" type="application/json">',
      status: 'ERROR',
      message: 'Không tìm thấy thẻ <script id="ol3d-module-manifest" type="application/json">.',
      fixHint:
        'Thêm thẻ <script id="ol3d-module-manifest" type="application/json">{ ... }</script> chứa thông tin asset và moduleControls như trong file .HTML mẫu.',
    });
  } else {
    const rawJsonText = (manifestEl.textContent || '').trim();
    if (!rawJsonText) {
      diagnostics.push({
        id: 'manifest-empty',
        sectionName: '1. Khối thông số JSON Manifest',
        targetTag: '#ol3d-module-manifest',
        status: 'ERROR',
        message: 'Thẻ #ol3d-module-manifest đang trống, không có dữ liệu JSON.',
        fixHint: 'Điền đối tượng JSON khai báo "asset" và "moduleControls" vào bên trong thẻ.',
      });
    } else {
      try {
        parsedManifestJson = JSON.parse(rawJsonText) as Record<string, unknown>;
        const assetObj = (parsedManifestJson.asset || parsedManifestJson) as Record<
          string,
          unknown
        >;
        const missingFields: string[] = [];
        if (!assetObj.assetId) missingFields.push('asset.assetId');
        if (!assetObj.name) missingFields.push('asset.name.vi');
        if (!assetObj.geometry) missingFields.push('asset.geometry');

        if (missingFields.length > 0) {
          diagnostics.push({
            id: 'manifest-fields',
            sectionName: '1. Khối thông số JSON Manifest',
            targetTag: '#ol3d-module-manifest',
            status: 'WARN',
            message: `Cú pháp JSON hợp lệ nhưng thiếu trường khuyến nghị: ${missingFields.join(', ')}.`,
            fixHint:
              'Bổ sung đầy đủ assetId (VD: "OL3D-EQP-..."), name.vi và geometry.boundingBoxM để hiển thị đúng tên và kích thước.',
          });
        } else {
          diagnostics.push({
            id: 'manifest-ok',
            sectionName: '1. Khối thông số JSON Manifest',
            targetTag: '#ol3d-module-manifest',
            status: 'PASS',
            message: `Đạt chuẩn JSON (${String(assetObj.assetId)} — ${
              typeof assetObj.name === 'object' && assetObj.name
                ? String((assetObj.name as Record<string, unknown>).vi || '')
                : String(assetObj.name || '')
            }).`,
          });
        }
      } catch (jsonErr) {
        const errMsg = jsonErr instanceof Error ? jsonErr.message : String(jsonErr);
        const hasTrailingComma = /,\s*([\]}])/g.test(rawJsonText);
        const hasLineComments = /^\s*\/\//m.test(rawJsonText);
        diagnostics.push({
          id: 'manifest-syntax',
          sectionName: '1. Khối thông số JSON Manifest',
          targetTag: '#ol3d-module-manifest',
          status: 'ERROR',
          message: `Lỗi cú pháp JSON: ${errMsg}`,
          fixHint: hasTrailingComma
            ? 'Phát hiện dấu phẩy thừa (trailing comma) trước dấu } hoặc ]. Hãy xóa dấu phẩy thừa ở phần tử cuối cùng trong JSON.'
            : hasLineComments
              ? 'JSON chuẩn không cho phép viết chú thích // bên trong #ol3d-module-manifest. Hãy xóa các dòng //.'
              : 'Kiểm tra dấu ngoặc kép "" quanh tên thuộc tính và dấu phẩy ngăn cách các dòng trong #ol3d-module-manifest.',
        });
      }
    }
  }

  // 2. Kiểm tra Khối 2: <template id="ol3d-module-icon"> & <template id="ol3d-module-real-photo">
  const iconEl = doc.getElementById('ol3d-module-icon');
  const photoEl = doc.getElementById('ol3d-module-real-photo');
  if (!iconEl || !iconEl.innerHTML.includes('<svg')) {
    diagnostics.push({
      id: 'icon-check',
      sectionName: '2. Khối Icon 2D & Hình đối chiếu',
      targetTag: '<template id="ol3d-module-icon">',
      status: 'WARN',
      message: 'Thiếu thẻ <template id="ol3d-module-icon"> chứa biểu tượng <svg>.',
      fixHint:
        'Thêm <template id="ol3d-module-icon"><svg viewBox="0 0 80 80">...</svg></template> để thiết bị có icon riêng trên thanh Thư viện.',
    });
  } else if (!photoEl) {
    diagnostics.push({
      id: 'photo-check',
      sectionName: '2. Khối Icon 2D & Hình đối chiếu',
      targetTag: '<template id="ol3d-module-real-photo">',
      status: 'WARN',
      message: 'Đã có Icon 2D nhưng thiếu <template id="ol3d-module-real-photo">.',
      fixHint:
        'Thêm <template id="ol3d-module-real-photo"> để hiển thị hình cấu tạo thực tế khi bấm xem thông số.',
    });
  } else {
    diagnostics.push({
      id: 'icon-photo-ok',
      sectionName: '2. Khối Icon 2D & Hình đối chiếu',
      targetTag: '#ol3d-module-icon & #ol3d-module-real-photo',
      status: 'PASS',
      message: 'Đầy đủ biểu tượng SVG 2D và hình đối chiếu thực tế.',
    });
  }

  // 3. Kiểm tra Khối 3: <script id="ol3d-module-3d-script"> (Biên dịch JS & Dựng hình Three.js)
  const script3dEl =
    doc.getElementById('ol3d-module-3d-script') ||
    doc.getElementById('openlab-module-3d-script');

  if (!script3dEl || !script3dEl.textContent?.trim()) {
    diagnostics.push({
      id: 'script3d-missing',
      sectionName: '3. Khối Script 3D Three.js',
      targetTag: '<script id="ol3d-module-3d-script">',
      status: 'ERROR',
      message: 'Không tìm thấy thẻ <script id="ol3d-module-3d-script"> chứa mã dựng 3D.',
      fixHint:
        'Thêm <script id="ol3d-module-3d-script"> gán window.OL3D_EQUIPMENT_MODULE = { buildEquipmentMesh(THREE, asset) { ... }, updateEquipmentState(root, state, dt) { ... } }.',
    });
  } else {
    const code = script3dEl.textContent;
    // Kiểm tra xem trong script 3D có gọi nhầm DOM của trang HTML lẻ không
    if (/\bdocument\.(getElementById|querySelector|body)\b/.test(code)) {
      diagnostics.push({
        id: 'script3d-dom-leak',
        sectionName: '3. Khối Script 3D Three.js (Ranh giới Sandbox)',
        targetTag: '#ol3d-module-3d-script',
        status: 'WARN',
        message:
          'Phát hiện lệnh document.getElementById / querySelector bên trong #ol3d-module-3d-script.',
        fixHint:
          'Trong #ol3d-module-3d-script chỉ được phép gọi document.createElement("canvas") để vẽ texture. Code giao diện xem trước độc lập phải tách sang thẻ <script> riêng ở cuối file.',
      });
    }

    // Thử biên dịch cú pháp JS trực tiếp để bắt lỗi SyntaxError hoặc ReferenceError rõ ràng
    try {
      const testWin: Record<string, unknown> = {};
      const safeDoc = {
        createElement: (tag: string) =>
          tag.toLowerCase() === 'canvas'
            ? document.createElement('canvas')
            : document.createElement('div'),
        getElementById: () => null,
      };
      const fn = new Function(
        'window',
        'document',
        'THREE',
        `${code}\n;return window.OL3D_EQUIPMENT_MODULE || window.OPENLAB_EQUIPMENT_MODULE;`,
      );
      const exportedMod = fn(testWin, safeDoc, THREE) as
        | {
            buildEquipmentMesh?: (t: typeof THREE, a?: unknown) => THREE.Group;
            buildEquipmentGroup?: (t: typeof THREE, a?: unknown) => THREE.Group;
            updateEquipmentState?: (...args: unknown[]) => void;
            applyEquipmentState?: (...args: unknown[]) => void;
          }
        | undefined;

      if (
        !exportedMod ||
        (typeof exportedMod.buildEquipmentMesh !== 'function' &&
          typeof exportedMod.buildEquipmentGroup !== 'function')
      ) {
        diagnostics.push({
          id: 'script3d-no-builder',
          sectionName: '3. Khối Script 3D Three.js',
          targetTag: 'window.OL3D_EQUIPMENT_MODULE',
          status: 'ERROR',
          message:
            'Script chạy không lỗi cú pháp nhưng thiếu hàm buildEquipmentMesh(THREE, asset) hoặc buildEquipmentGroup(THREE, asset).',
          fixHint:
            'Đảm bảo gán window.OL3D_EQUIPMENT_MODULE = { buildEquipmentMesh: function(THREE, asset) { var group = new THREE.Group(); ... return group; } }.',
        });
      } else {
        diagnostics.push({
          id: 'script3d-syntax-ok',
          sectionName: '3. Khối Script 3D Three.js',
          targetTag: 'window.OL3D_EQUIPMENT_MODULE',
          status: 'PASS',
          message: 'Biên dịch JavaScript 3D thành công, đầy đủ hàm tạo mô hình.',
        });
      }
    } catch (jsErr) {
      const errMsg = jsErr instanceof Error ? jsErr.message : String(jsErr);
      diagnostics.push({
        id: 'script3d-runtime-err',
        sectionName: '3. Khối Script 3D Three.js',
        targetTag: '#ol3d-module-3d-script',
        status: 'ERROR',
        message: `Lỗi JavaScript trong #ol3d-module-3d-script: ${errMsg}`,
        fixHint:
          'Kiểm tra lại tên biến, dấu ngoặc nhọn {} hoặc lệnh gọi hàm Three.js bên trong thẻ <script id="ol3d-module-3d-script">.',
      });
    }
  }

  // 4. Chạy bộ phân tích tổng hợp và kiểm tra hình học 3D thực tế (Kích thước mét & Đáy y = 0)
  let parsedPkg: HtmlEquipmentModulePackage | null = null;
  try {
    parsedPkg = htmlEquipmentModuleRegistry.parseHtmlModule(rawHtml);
    const rep = parsedPkg.validationReport;
    if (rep) {
      const g2 = rep.gates.find((g) => g.gateId === 'G2_GEOMETRY');
      const g5 = rep.gates.find((g) => g.gateId === 'G5_INTEGRATION');
      const bb = parsedPkg.asset.geometry.boundingBoxM;

      if (g5 && g5.status === 'FAIL') {
        diagnostics.push({
          id: 'geo-integration-fail',
          sectionName: '4. Kiểm tra Dựng hình 3D & Tỷ lệ mặt bàn',
          targetTag: 'buildEquipmentMesh(THREE, asset)',
          status: 'ERROR',
          message: g5.summaryVi,
          fixHint:
            'Hàm buildEquipmentMesh phải trả về đối tượng new THREE.Group() có ít nhất 1 THREE.Mesh hợp lệ.',
        });
      } else if (bb.width > 2.4 || bb.height > 2.4 || bb.depth > 2.4) {
        diagnostics.push({
          id: 'geo-scale-mm-mistake',
          sectionName: '4. Kiểm tra Dựng hình 3D & Tỷ lệ mặt bàn',
          targetTag: 'geometry.boundingBoxM',
          status: 'ERROR',
          message: `Kích thước bao quá lớn (${bb.width} × ${bb.height} × ${bb.depth} m) — vượt quá mặt bàn thí nghiệm (2.4m).`,
          fixHint:
            'Trong Three.js đơn vị là MÉT (1 mm = 0.001 m). Hãy chia kích thước mm cho 1000 (VD: 150 mm -> viết 0.15).',
        });
      } else if (Math.abs(rep.measuredYMinM) > 0.025) {
        diagnostics.push({
          id: 'geo-ymin-offset',
          sectionName: '4. Kiểm tra Dựng hình 3D & Tỷ lệ mặt bàn',
          targetTag: 'Điểm tựa đáy (y = 0)',
          status: 'WARN',
          message: `Đáy mô hình đang nằm tại y = ${rep.measuredYMinM} m (Lệch khỏi mặt bàn y = 0).`,
          fixHint: `Cộng thêm ${(-rep.measuredYMinM).toFixed(3)} m vào position.y của các mesh để đáy thiết bị chạm khít mặt bàn (y = 0.000 m).`,
        });
      } else if (g2) {
        diagnostics.push({
          id: 'geo-ok',
          sectionName: '4. Kiểm tra Dựng hình 3D & Tỷ lệ mặt bàn',
          targetTag: 'THREE.Group (y = 0)',
          status: 'PASS',
          message: `Dựng thành công ${rep.measuredMeshCount} mesh (${rep.measuredTriangleCount} tam giác) · Kích thước ${(bb.width * 1000).toFixed(0)}×${(bb.height * 1000).toFixed(0)}×${(bb.depth * 1000).toFixed(0)} mm · Đáy y_min = ${rep.measuredYMinM} m.`,
        });
      }
    }
  } catch (parseErr) {
    diagnostics.push({
      id: 'parse-fatal',
      sectionName: '4. Kiểm tra Dựng hình 3D & Tích hợp',
      targetTag: 'parseHtmlModule',
      status: 'ERROR',
      message: parseErr instanceof Error ? parseErr.message : String(parseErr),
      fixHint: 'Kiểm tra lại cấu trúc HTML theo đúng file mẫu.',
    });
  }

  const hasBlockingError =
    diagnostics.some((d) => d.status === 'ERROR') &&
    (!parsedPkg || parsedPkg.validationReport?.overallStatus === 'FAIL');

  return { diagnostics, parsedPkg, hasBlockingError };
}

function buildStarterHtmlForTargetAsset(asset: AssetDefinition): string {
  const existingMod = htmlEquipmentModuleRegistry.getModule(asset.assetId);
  if (existingMod?.rawHtmlSource) {
    return existingMod.rawHtmlSource;
  }
  const storedEntry = localDiskLibraryEngine.getStoredModule(asset.assetId);
  if (storedEntry?.rawHtmlSource) {
    return storedEntry.rawHtmlSource;
  }

  const massVal = asset.scientificProperties.referenceMass?.value ?? 100;
  const capVal = asset.scientificProperties.capacity?.value ?? 100;
  const wMm = asset.geometry.dimensions.widthOrDiameter.value;
  const hMm = asset.geometry.dimensions.height.value;
  const dMm = asset.geometry.dimensions.depth?.value ?? wMm;

  const manifestObj = {
    moduleSpecVersion: 'OL3D-HTML-MODULE-v2.4',
    asset: {
      ...asset,
      equipmentGroupG: asset.equipmentGroupG || 'G02',
      physicsFidelityLevel: asset.physicsFidelityLevel || 'L2',
      assetVersion: `${asset.assetVersion.split('-')[0]}-html`,
    },
    moduleControls: {
      stateKey: asset.scientificProperties.capacity ? 'liquidLevelMl' : 'multimeterValue',
      label: asset.scientificProperties.capacity
        ? 'Mực chất lỏng (ml)'
        : 'Thông số hiển thị',
      unit: asset.scientificProperties.capacity ? 'ml' : 'g',
      min: 0,
      max: asset.scientificProperties.capacity ? capVal : 500,
      step: 1,
      defaultValue: asset.scientificProperties.capacity ? Math.round(capVal * 0.5) : massVal,
      canBeWeighedOnBalance: asset.geometry.proceduralArchetype !== 'electronic-balance',
      canHoldLiquid: Boolean(asset.scientificProperties.capacity),
      canSubmergeInVessel: asset.kind === 'specimen',
    },
    realPhotoMeta: {
      caption: `Ảnh đối chiếu chuẩn: ${asset.name.vi} (${asset.assetId})`,
      manufacturerRef: 'Chuẩn Thông tư 38/2021/TT-BGDĐT · SGK KHTN 9',
      realWorldScaleNote: `Kích thước: ${wMm} × ${hMm} × ${dMm} mm · Khối lượng: ${massVal} g`,
      annotations: [
        { xPercent: 50, yPercent: 25, label: `Phần thân trên (${asset.name.vi})` },
        { xPercent: 50, yPercent: 78, label: `Đế chuẩn đặt bàn (y = 0)` },
      ],
    },
  };

  return SAMPLE_PH_METER_HTML_MODULE.replace(
    /Máy đo pH hiện số cầm tay \(OL3D-EQP-PHM-0001\)/g,
    `${asset.name.vi} (${asset.assetId})`,
  ).replace(
    /<script[^>]*id=["']ol3d-module-manifest["'][^>]*>[\s\S]*?<\/script>/i,
    `<script id="ol3d-module-manifest" type="application/json">\n${JSON.stringify(
      manifestObj,
      null,
      2,
    )}\n  </script>`,
  );
}

const buildQuickCreationPrompt = (targetAsset?: AssetDefinition | null) => {
  const targetDesc = targetAsset
    ? `cập nhật thiết bị "${targetAsset.name.vi}" (giữ nguyên mã assetId: "${targetAsset.assetId}")`
    : 'tạo 1 module thiết bị thí nghiệm 3D mới';
  return `Dựa theo đúng cấu trúc trong file hướng dẫn EQUIPMENT_MODULE_STANDARD.md và file mẫu .HTML đính kèm, hãy xuất cho tôi 1 file .html độc lập duy nhất để ${targetDesc}.
Yêu cầu bắt buộc:
1. Có đủ 4 khối chuẩn:
   - <script id="ol3d-module-manifest" type="application/json"> (JSON hợp lệ, không dấu phẩy thừa, đơn vị kích thước boundingBoxM tính bằng mét).
   - <template id="ol3d-module-icon"> (SVG 80x80).
   - <template id="ol3d-module-real-photo"> (SVG 680x420).
   - <script id="ol3d-module-3d-script"> (window.OL3D_EQUIPMENT_MODULE có buildEquipmentMesh và updateEquipmentState, đáy thiết bị chạm y = 0).
2. Khi mở file .html trực tiếp trên trình duyệt sẽ hiển thị ngay khung xem trước 3D xoay 360° và thanh trượt kiểm tra thông số.`;
};

export const HtmlModuleImporterModal: React.FC<HtmlModuleImporterModalProps> = ({
  targetAsset = null,
  onClose,
  onModuleImportedAndSpawn,
}) => {
  const [htmlInput, setHtmlInput] = useState<string>(() =>
    targetAsset ? buildStarterHtmlForTargetAsset(targetAsset) : '',
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(() =>
    targetAsset ? `${targetAsset.slug || targetAsset.assetId}.html` : null,
  );
  const [isUpdatingTargetAsset, setIsUpdatingTargetAsset] = useState<boolean>(
    Boolean(targetAsset),
  );
  const [showCodeEditor, setShowCodeEditor] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // Kết quả kiểm tra lỗi & gói thiết bị đã phân tích
  const [diagnostics, setDiagnostics] = useState<ModuleDiagnosticItem[]>([]);
  const [inspectedPkg, setInspectedPkg] = useState<HtmlEquipmentModulePackage | null>(
    null,
  );
  const [hasBlockingError, setHasBlockingError] = useState<boolean>(false);

  // Danh sách các module người dùng đã lưu trong thư viện & trạng thái ổ đĩa kiểu Arduino
  const [storedModules, setStoredModules] = useState<StoredLibraryModuleEntry[]>(() =>
    localDiskLibraryEngine.listStoredModules(),
  );
  const [diskStatus, setDiskStatus] = useState(() =>
    localDiskLibraryEngine.getStatus(),
  );
  const [customPathInput, setCustomPathInput] = useState<string>(() =>
    localDiskLibraryEngine.getStatus().configuredBasePath,
  );
  const [librarySyncBanner, setLibrarySyncBanner] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderScannerInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsub = localDiskLibraryEngine.subscribe(() => {
      setStoredModules(localDiskLibraryEngine.listStoredModules());
      setDiskStatus(localDiskLibraryEngine.getStatus());
    });
    return unsub;
  }, []);

  const handleSaveCustomBasePath = () => {
    localDiskLibraryEngine.setConfiguredBasePath(customPathInput);
    const nextStatus = localDiskLibraryEngine.getStatus();
    setCustomPathInput(nextStatus.configuredBasePath);
    setLibrarySyncBanner(
      `Đã đặt vị trí thư viện chuẩn Arduino tại: ${nextStatus.configuredBasePath}`,
    );
  };

  const handleConnectPhysicalDirectory = async () => {
    const res = await localDiskLibraryEngine.connectPhysicalLibraryDirectory();
    if (res.importedHtmlStrings.length > 0) {
      await htmlEquipmentModuleRegistry.importMultipleHtmlStringsFromLibraryFolder(
        res.importedHtmlStrings,
      );
    }
    setLibrarySyncBanner(res.message);
  };

  const handleFolderScannerUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const htmlStrings: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.name.toLowerCase().endsWith('.html') || f.name.toLowerCase().endsWith('.htm')) {
        try {
          const text = await f.text();
          htmlStrings.push(text);
        } catch {
          // Ignore unreadable file
        }
      }
    }
    e.target.value = '';
    if (htmlStrings.length === 0) {
      setLibrarySyncBanner(
        'Không tìm thấy file .html nào trong thư mục bạn vừa chọn.',
      );
      return;
    }
    const imported =
      await htmlEquipmentModuleRegistry.importMultipleHtmlStringsFromLibraryFolder(
        htmlStrings,
      );
    setLibrarySyncBanner(
      `Đã quét và tự động nạp ${imported.length} module thiết bị (.HTML) từ thư mục vào phòng thí nghiệm!`,
    );
    if (imported.length > 0 && imported[0].rawHtmlSource) {
      handleAnalyzeHtml(
        imported[0].rawHtmlSource,
        `${imported[0].asset.slug || imported[0].asset.assetId}.html`,
      );
    }
  };

  // Nếu mở modal ở chế độ sửa 1 thiết bị cụ thể, tự động chạy kiểm tra ngay
  useEffect(() => {
    if (targetAsset) {
      const starter = buildStarterHtmlForTargetAsset(targetAsset);
      const res = runDetailedHtmlDiagnostics(starter);
      setDiagnostics(res.diagnostics);
      setInspectedPkg(res.parsedPkg);
      setHasBlockingError(res.hasBlockingError);
    }
  }, [targetAsset]);

  const handleAnalyzeHtml = (rawHtml: string, fileNameLabel?: string) => {
    setHtmlInput(rawHtml);
    if (fileNameLabel) {
      setUploadedFileName(fileNameLabel);
    }
    if (!rawHtml.trim()) {
      setDiagnostics([
        {
          id: 'empty-input',
          sectionName: 'Đầu vào File .HTML',
          targetTag: 'File / Mã nguồn',
          status: 'ERROR',
          message: 'Chưa có nội dung file .HTML để kiểm tra.',
          fixHint: 'Hãy tải lên 1 file .html từ máy tính hoặc dán mã nguồn vào ô bên dưới.',
        },
      ]);
      setInspectedPkg(null);
      setHasBlockingError(true);
      return;
    }

    const result = runDetailedHtmlDiagnostics(rawHtml);
    setDiagnostics(result.diagnostics);
    setInspectedPkg(result.parsedPkg);
    setHasBlockingError(result.hasBlockingError);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleAnalyzeHtml(reader.result, file.name);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmAddModule = () => {
    if (!inspectedPkg || hasBlockingError) return;
    const shouldOverrideTarget = Boolean(targetAsset && isUpdatingTargetAsset);
    const registeredPkg = htmlEquipmentModuleRegistry.registerModule(
      inspectedPkg,
      shouldOverrideTarget ? targetAsset : null,
    );
    onModuleImportedAndSpawn(registeredPkg, shouldOverrideTarget);
    onClose();
  };

  const handleDownloadStandardMd = () => {
    const blob = new Blob([equipmentStandardMdRaw], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EQUIPMENT_MODULE_STANDARD.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTemplateHtml = () => {
    const content = targetAsset
      ? buildStarterHtmlForTargetAsset(targetAsset)
      : SAMPLE_PH_METER_HTML_MODULE;
    const filename = targetAsset
      ? `mau-module-${targetAsset.slug || targetAsset.assetId.toLowerCase()}.html`
      : 'file-mau-module-thiet-bi-3d.html';
    const blob = new Blob([content], {
      type: 'text/html;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(buildQuickCreationPrompt(targetAsset));
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  const errorCount = diagnostics.filter((d) => d.status === 'ERROR').length;
  const warnCount = diagnostics.filter((d) => d.status === 'WARN').length;
  const passCount = diagnostics.filter((d) => d.status === 'PASS').length;

  return (
    <div
      className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 flex flex-col max-h-[92vh]"
      >
        {/* HEADER GỌN GÀNG */}
        <div className="px-6 py-4 bg-[#072B61] text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <FileCode className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-extrabold truncate">
                {targetAsset
                  ? `Cập Nhật & Kiểm Tra Module: ${targetAsset.name.vi}`
                  : 'Kiến Tạo, Tải Lên & Kiểm Tra Module Thiết Bị 3D (.HTML)'}
              </h2>
              <p className="text-xs text-sky-200 truncate">
                Tải khuôn mẫu chuẩn (.MD + .HTML) · Tải lên sản phẩm để xem trước 3D & kiểm tra lỗi chi tiết
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NỘI DUNG CHÍNH: 3 PHẦN RÕ RÀNG */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 bg-slate-50/70">
          {/* Thanh thông báo khi đang cập nhật đè lên 1 thiết bị có sẵn */}
          {targetAsset && (
            <div className="px-4 py-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-800">
                <RefreshCw className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  Đang chọn cập nhật cho:{' '}
                  <strong className="font-bold text-slate-900">
                    {targetAsset.name.vi}
                  </strong>{' '}
                  <code className="px-1.5 py-0.5 rounded bg-white border border-sky-200 font-mono text-xs text-sky-700">
                    {targetAsset.assetId}
                  </code>
                </span>
              </div>
              <label className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUpdatingTargetAsset}
                  onChange={(e) => setIsUpdatingTargetAsset(e.target.checked)}
                  className="accent-sky-600"
                />
                <span>Cập nhật đè vào mã {targetAsset.assetId}</span>
              </label>
            </div>
          )}

          {/* =====================================================================
              PHẦN 1: KIẾN TẠO MODULE (1 FILE .MD HƯỚNG DẪN + 1 FILE MẪU .HTML)
          ===================================================================== */}
          <section className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  1. Bộ Khuôn Mẫu Kiến Tạo Module Thiết Bị
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sử dụng 1 file hướng dẫn chuẩn <code className="font-mono font-bold text-slate-800">.md</code> và 1 file mẫu <code className="font-mono font-bold text-slate-800">.html</code> dưới đây để tự viết hoặc gửi cho AI tạo ra sản phẩm module thiết bị mới.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Copy câu lệnh mẫu để dán kèm 2 file khi nhờ AI tạo thiết bị"
              >
                {copiedPrompt ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Đã Copy Prompt!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy Prompt mẫu</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Nút 1: Tải 1 file .MD hướng dẫn làm module thiết bị */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Tài liệu hướng dẫn chuẩn (.MD)</span>
                  </div>
                  <p className="text-[11.5px] text-amber-800/90 mt-0.5 leading-snug">
                    Quy định 4 thẻ ID bắt buộc, tỷ lệ mét (1m = 1.0) và cấu trúc hàm Three.js.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadStandardMd}
                  className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Tải file .MD</span>
                </button>
              </div>

              {/* Nút 2: Tải 1 file mẫu .HTML */}
              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-sky-900 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>File mẫu thiết bị chuẩn (.HTML)</span>
                  </div>
                  <p className="text-[11.5px] text-sky-800/90 mt-0.5 leading-snug">
                    1 file .HTML mẫu hoàn chỉnh có sẵn mô hình 3D, thông số và khung xem độc lập.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplateHtml}
                  className="px-3.5 py-2 rounded-lg bg-[#1E6BFF] hover:bg-[#1557DB] text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Tải file mẫu .HTML</span>
                </button>
              </div>
            </div>
          </section>

          {/* =====================================================================
              PHẦN 2: TẢI LÊN SẢN PHẨM (.HTML) & XEM TRƯỚC
          ===================================================================== */}
          <section className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  2. Tải Lên Sản Phẩm (.HTML) & Xem Trước
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Chọn file <code className="font-mono font-bold text-slate-800">.html</code> bạn vừa tạo để hệ thống kiểm tra lỗi và hiển thị bản xem trước 3D.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCodeEditor((v) => !v)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{showCodeEditor ? 'Ẩn ô dán mã .HTML' : 'Dán/Sửa mã .HTML trực tiếp'}</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 p-4 rounded-xl bg-sky-50/70 hover:bg-sky-100/70 border-2 border-dashed border-[#1E6BFF] flex items-center justify-center gap-3 cursor-pointer transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1E6BFF] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold text-slate-900 truncate">
                    {uploadedFileName
                      ? `Đã nạp file: ${uploadedFileName} (Nhấn để chọn file khác)`
                      : 'Chọn file sản phẩm (.HTML) từ máy tính để tải lên & kiểm tra'}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Hỗ trợ mọi file .html thiết kế theo chuẩn OL3D-HTML-MODULE
                  </div>
                </div>
              </button>
            </div>

            {/* Ô dán / sửa trực tiếp mã nguồn HTML nếu người dùng cần sửa nhanh lỗi */}
            {showCodeEditor && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Mã nguồn sản phẩm (.HTML) — Có thể sửa trực tiếp tại đây rồi bấm Kiểm tra lại:
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAnalyzeHtml(htmlInput, uploadedFileName || 'ma-dan-truc-tiep.html')}
                    className="px-3 py-1 rounded-lg bg-[#1E6BFF] hover:bg-[#1557DB] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Kiểm tra lại mã vừa sửa
                  </button>
                </div>
                <textarea
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  rows={6}
                  placeholder="Dán mã nguồn <!DOCTYPE html>... vào đây rồi nhấn 'Kiểm tra lại mã vừa sửa'"
                  className="w-full p-3 rounded-xl bg-slate-900 text-slate-100 border border-slate-700 font-mono text-xs focus:outline-none focus:border-sky-400"
                />
              </div>
            )}
          </section>

          {/* =====================================================================
              PHẦN 3: KẾT QUẢ KIỂM TRA LỖI CHI TIẾT & KHUNG XEM TRƯỚC SẢN PHẨM
          ===================================================================== */}
          {diagnostics.length > 0 && (
            <section className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#1E6BFF]" />
                    <span>3. Chẩn Đoán Lỗi & Xem Trước Sản Phẩm</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Kiểm tra từng phần trong file .HTML để biết chính xác vị trí lỗi cần sửa trước khi đưa vào phòng thí nghiệm.
                  </p>
                </div>

                {/* Tổng kết nhanh số mục Đạt / Cảnh báo / Lỗi */}
                <div className="flex items-center gap-2 text-xs font-bold">
                  {errorCount > 0 && (
                    <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 border border-rose-300">
                      {errorCount} Lỗi cần sửa
                    </span>
                  )}
                  {warnCount > 0 && (
                    <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                      {warnCount} Cảnh báo
                    </span>
                  )}
                  {errorCount === 0 && (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Đạt {passCount}/{diagnostics.length} mục kiểm tra
                    </span>
                  )}
                </div>
              </div>

              {/* Danh sách chẩn đoán từng phần */}
              <div className="space-y-2">
                {diagnostics.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border text-xs flex flex-col gap-1 ${
                      item.status === 'ERROR'
                        ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                        : item.status === 'WARN'
                          ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                          : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 font-extrabold">
                        {item.status === 'ERROR' ? (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : item.status === 'WARN' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <span>{item.sectionName}</span>
                      </div>
                      <code className="px-2 py-0.5 rounded bg-white/80 border border-black/10 font-mono text-[11px]">
                        {item.targetTag}
                      </code>
                    </div>

                    <div className="pl-5.5 font-medium leading-relaxed">
                      {item.message}
                    </div>

                    {item.fixHint && (
                      <div className="pl-5.5 text-[11.5px] font-bold text-slate-800 bg-white/75 px-2.5 py-1.5 rounded-lg border border-black/10 mt-0.5">
                        Cách sửa: {item.fixHint}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Khung Xem Trước Sản Phẩm Trực Tiếp (Live Preview) */}
              {inspectedPkg && htmlInput.trim() && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-[#1E6BFF]" />
                      <span>
                        Xem trước sản phẩm: {inspectedPkg.asset.name.vi} (
                        {inspectedPkg.asset.assetId})
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Kích thước: {inspectedPkg.asset.geometry.dimensions.widthOrDiameter.value} ×{' '}
                      {inspectedPkg.asset.geometry.dimensions.height.value} mm · Khối lượng:{' '}
                      {inspectedPkg.asset.scientificProperties.referenceMass?.value ?? 100} g
                    </span>
                  </div>

                  <div className="w-full h-[360px] rounded-xl overflow-hidden border border-slate-300 bg-[#0B1324]">
                    <iframe
                      title={`Xem trước — ${inspectedPkg.asset.name.vi}`}
                      srcDoc={inspectedPkg.rawHtmlSource || htmlInput}
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>
              )}
            </section>
          )}

          {/* =====================================================================
              PHẦN 4: THƯ VIỆN MODULE KIỂU ARDUINO TRONG DOCUMENTS (libraries3DLab)
          ===================================================================== */}
          <section className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#1E6BFF]" />
                  <span>
                    Thư Viện Module Kiểu Arduino (Documents\libraries3DLab)
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tất cả module <code className="font-mono font-bold text-slate-800">.html</code> được lưu trữ bền vững theo từng thư mục con kèm <code className="font-mono text-slate-700">library.properties</code> và tự động nạp lên mỗi khi web chạy.
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                  diskStatus.isPhysicalFolderConnected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-sky-50 text-sky-800 border-sky-200'
                }`}
              >
                {diskStatus.isPhysicalFolderConnected
                  ? `Đã gắn kết ổ cứng: ${diskStatus.physicalFolderName}`
                  : `Đang lưu bền vững (${storedModules.length} module)`}
              </span>
            </div>

            {/* Tùy chọn vị trí thư mục lưu trữ giống Arduino Sketchbook Location */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300">
                <span className="text-[11px] font-bold text-slate-500 shrink-0">
                  Vị trí Thư viện:
                </span>
                <input
                  type="text"
                  value={customPathInput}
                  onChange={(e) => setCustomPathInput(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-xs text-slate-900 focus:outline-none"
                  placeholder="C:\Users\ltlie\Documents\libraries3DLab"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveCustomBasePath}
                className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer shrink-0"
              >
                Đặt vị trí
              </button>
            </div>

            {/* 3 nút thao tác với thư mục Documents\libraries3DLab */}
            <input
              ref={folderScannerInputRef}
              type="file"
              {...({
                webkitdirectory: '',
                directory: '',
              } as React.InputHTMLAttributes<HTMLInputElement>)}
              multiple
              onChange={handleFolderScannerUpload}
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => folderScannerInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-950 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                title="Chọn nguyên thư mục libraries3DLab trong Documents để nạp hàng loạt tất cả module .HTML bên trong"
              >
                <FolderOpen className="w-4 h-4 text-[#1E6BFF] shrink-0" />
                <span>Quét nạp Thư mục (Documents)</span>
              </button>

              <button
                type="button"
                onClick={handleConnectPhysicalDirectory}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                title="Gắn kết trực tiếp thư mục trên ổ cứng (Yêu cầu mở ở Tab trình duyệt riêng)"
              >
                <HardDrive className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kết nối Ổ cứng trực tiếp</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  localDiskLibraryEngine.downloadWindowsArduinoStyleSyncScript()
                }
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                title="Tải script PowerShell tự động tạo cây thư mục chuẩn Arduino trong Documents"
              >
                <Terminal className="w-4 h-4 text-slate-700 shrink-0" />
                <span>Xuất Thư mục ra Documents (.ps1)</span>
              </button>
            </div>

            {librarySyncBanner && (
              <div className="px-3 py-2 rounded-lg bg-sky-50 border border-sky-200 text-xs font-medium text-sky-900">
                {librarySyncBanner}
              </div>
            )}

            {storedModules.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
                {storedModules.map((entry) => (
                  <div
                    key={entry.assetId}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-bold text-slate-800">
                        {entry.assetSnapshot.name.vi}{' '}
                        <span className="font-mono text-[11px] text-slate-500">
                          ({entry.assetId})
                        </span>
                      </div>
                      <div className="truncate font-mono text-[10.5px] text-slate-500">
                        {entry.virtualPath}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {entry.rawHtmlSource && (
                        <button
                          type="button"
                          onClick={() =>
                            handleAnalyzeHtml(
                              entry.rawHtmlSource,
                              entry.htmlFileName,
                            )
                          }
                          className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold cursor-pointer"
                        >
                          Xem & Kiểm tra
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={async () => {
                          await htmlEquipmentModuleRegistry.removeModuleAndRestoreDefault(
                            entry.assetId,
                          );
                        }}
                        className="p-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 cursor-pointer"
                        title="Xóa module này khỏi thư viện"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* FOOTER HÀNH ĐỘNG */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold cursor-pointer"
          >
            Đóng
          </button>

          <div className="flex items-center gap-2.5">
            {htmlInput.trim() && !inspectedPkg && (
              <button
                type="button"
                onClick={() => handleAnalyzeHtml(htmlInput)}
                className="px-4 py-2 rounded-lg bg-[#1E6BFF] hover:bg-[#1557DB] text-white text-xs sm:text-sm font-extrabold cursor-pointer"
              >
                Kiểm Tra Lỗi Ngay
              </button>
            )}

            <button
              type="button"
              onClick={handleConfirmAddModule}
              disabled={!inspectedPkg || hasBlockingError}
              className={`px-5 py-2 rounded-lg text-white text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-colors ${
                !inspectedPkg || hasBlockingError
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-xs'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>
                {targetAsset && isUpdatingTargetAsset
                  ? `Cập Nhật "${targetAsset.name.vi}"`
                  : 'Đưa Sản Phẩm Vào Bàn Thí Nghiệm 3D'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
