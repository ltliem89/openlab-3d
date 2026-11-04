import fs from 'fs';
import path from 'path';

interface TreeNode {
  name: string;
  isDir: boolean;
  size?: number;
  children?: TreeNode[];
  desc?: string;
}

const DESCRIPTIONS: Record<string, string> = {
  'BAO_CAO_TONG_THE_KIEN_TRUC_VA_HE_THONG_OPENLAB3D.md': '🌟 Báo cáo Tổng thể Kiến trúc & Rà soát Hệ thống (Master Spec v3.0, 5.484 dòng)',
  'README.md': 'Tài liệu giới thiệu dự án, hướng dẫn cài đặt & điều hướng',
  'package.json': 'Cấu hình npm, dependencies (React 19, Three.js, Vite 6, Tailwind)',
  'tsconfig.json': 'Cấu hình TypeScript 5.8+ Strict Mode',
  'vite.config.ts': 'Cấu hình build Vite & plugin React',
  'index.html': 'Điểm vào HTML chính của ứng dụng Web',
  'src': 'Thư mục mã nguồn chính của ứng dụng',
  'src/App.tsx': 'Bộ điều phối trạng thái trung tâm (State Orchestrator)',
  'src/main.tsx': 'Điểm khởi tạo React 19 DOM root',
  'src/index.css': 'Style toàn cục Tailwind CSS & hiệu ứng giao diện',
  'src/components': 'Các thành phần giao diện người dùng React',
  'src/components/common': 'Các component UI dùng chung (HoverCard, PreviewPanel, Thumbnails)',
  'src/components/common/EquipmentHoverCard.tsx': 'Thẻ nổi Glassmorphism hướng dẫn khi rê chuột thư viện',
  'src/components/common/EquipmentPreviewPanel.tsx': 'Bảng xem trước thông số kỹ thuật & ảnh thực tế',
  'src/components/common/EquipmentRealPhotoView.tsx': 'Khung hiển thị ảnh chụp thực tế từ libraries3DLab',
  'src/components/common/EquipmentThumbnailSvg.tsx': 'Bộ vẽ vector SVG dự phòng chống vỡ ảnh',
  'src/components/microscope': 'Hệ thống mô phỏng Kính hiển vi Quang học 3D',
  'src/components/microscope/MicroscopeSimulationModal.tsx': 'Modal kính hiển vi: Ốc sơ cấp/vi cấp, mâm vật kính DIN, thị kính',
  'src/components/microscope/MicroscopeSpecimenSvgRenderer.tsx': 'Bộ dựng thị kính hiển vi & hình ảnh tế bào theo độ phóng đại',
  'src/components/modals': 'Các cửa sổ chức năng pop-up',
  'src/components/modals/HtmlModuleImporterModal.tsx': 'Modal nạp module .HTML độc lập & kiểm định 7 cổng G1-G7',
  'src/components/modals/GovernanceOverviewModal.tsx': 'Bảng điều khiển quản trị kiểm định & tiêu chuẩn thiết bị',
  'src/components/modals/LabEnvironmentSpecModal.tsx': 'Bảng điều khiển 13 biến môi trường phòng thí nghiệm',
  'src/components/modals/LabVideoRecorderModal.tsx': 'Bộ ghi hình video thí nghiệm thực hành',
  'src/components/navigation': 'Thanh điều hướng & tìm kiếm',
  'src/components/navigation/TopNavBar.tsx': 'Thanh công cụ trên cùng: Tìm kiếm gần đây, tiến trình bước, chuyển vai trò',
  'src/components/panels': 'Các bảng điều khiển chuyên gia / kỹ thuật',
  'src/components/panels/AssetExplorerPanel.tsx': 'Bảng duyệt cây thiết bị nâng cao',
  'src/components/panels/DeviceControlInspector.tsx': 'Bảng thanh trượt điều khiển thông số thiết bị',
  'src/components/panels/SceneHierarchyPanel.tsx': 'Cây cấu trúc phân cấp đối tượng 3D trong cảnh',
  'src/components/panels/BottomWorkspaceTray.tsx': 'Khay công cụ đáy màn hình',
  'src/components/student': 'Giao diện thân thiện dành riêng cho học sinh KHTN',
  'src/components/student/StudentHomeView.tsx': 'Màn hình trang chủ học sinh chọn bài thực hành',
  'src/components/student/StudentEquipmentSidebar.tsx': 'Thanh thư viện thiết bị học sinh bên trái',
  'src/components/student/StudentGuidedStepPanel.tsx': 'Bảng hướng dẫn thực hành theo từng bước SGK',
  'src/components/student/StudentBottomPanelsRow.tsx': 'Thanh công cụ đo lường và thao tác nhanh phía dưới',
  'src/data': 'Dữ liệu danh mục, catalog & hồ sơ thiết bị',
  'src/data/mockCatalog.ts': 'Catalog 36 thiết bị gốc chuẩn hóa Thông tư 38/2021/TT-BGDĐT',
  'src/data/multiSourceEquipmentDossier.ts': 'Hồ sơ kiểm định 5 nguồn đối chiếu kỹ thuật & sư phạm',
  'src/data/microscopeSpecimenCatalog.ts': 'Catalog 8 tiêu bản mẫu vật hiển vi & thông số vật kính DIN',
  'src/device-control': 'Hệ thống điều khiển trạng thái thiết bị',
  'src/domain': 'Định nghĩa kiểu dữ liệu TypeScript (Domain Types)',
  'src/domain/types.ts': 'Hệ thống Type chuẩn: AssetDefinition, SceneInstance, Connectors',
  'src/three-runtime': 'Động cơ mô phỏng 3D WebGL Three.js',
  'src/three-runtime/LabViewport3D.tsx': 'Khung nhìn 3D chính, render loop, raycast, động lực học rơi & bám dính',
  'src/three-runtime/ProceduralLabModels.ts': 'Bộ dựng hình học thủ tục 3D PBR cho 36 thiết bị',
  'src/three-runtime/AssemblySystem.ts': 'Động cơ lắp ráp RWSS v1.1.1, connector registry, docking & đồ thị',
  'src/three-runtime/LabEnvironmentEngine.ts': 'Không gian phòng lab, ánh sáng PBR & 13 biến môi trường',
  'src/three-runtime/HtmlEquipmentModuleRegistry.ts': 'Bộ nạp & 7 cổng kiểm định tự động module HTML (G1-G7)',
  'src/three-runtime/LocalDiskLibraryEngine.ts': 'Bộ quản lý thư viện thiết bị ổ đĩa kiểu Arduino',
  'src/three-runtime/EquipmentImagePreviewController.ts': 'Bộ điều khiển hiển thị ảnh chụp thực tế',
  'src/three-runtime/LabSoundEngine.ts': 'Tổng hợp âm thanh Web Audio API (va chạm, bíp, nước)',
  'src/three-runtime/LabVideoRecorderEngine.ts': 'Động cơ quay video WebM/MP4 từ WebGL Canvas',
  'docs': 'Tài liệu nghiên cứu, đặc tả SGK & kho lưu trữ báo cáo',
  'docs/archive_reports': '📦 Thư mục lưu trữ 16 báo cáo lịch sử riêng lẻ đã được gom',
  'docs/specs_khtn8': 'Đặc tả thiết bị & bài thực hành KHTN 8',
  'public': 'Tài nguyên tĩnh công khai',
  'public/libraries3DLab': 'Thư viện ảnh chụp thực tế 36 thiết bị, SVG icons & module .HTML',
  'scripts': 'Kịch bản kiểm thử tự động CI/CD & trình tạo báo cáo',
  'scripts/build-unified-master-report.ts': 'Script tạo Báo cáo Tổng thể Kiến trúc & Rà soát Hệ thống (5.484 dòng)',
  'scripts/archive-scattered-reports.ts': 'Script gom và dọn dẹp các báo cáo rải rác vào docs/archive_reports',
  'scripts/verify-assembly-acceptance.ts': 'Bộ kiểm thử tự động 24 tiêu chí lắp ráp RWSS v1.1.1 (100/100 đ)',
  'scripts/verify-scientific-interaction.ts': 'Bộ kiểm thử tự động 24 kịch bản tương tác khoa học (SCI-01..24)',
  'scripts/scientific-profiles.ts': 'Hồ sơ phương trình toán học KaTeX, FSM và FMEA cho 36 thiết bị'
};

const IGNORED = new Set(['node_modules', '.git', 'dist', '.aistudio']);

function buildTree(dir: string, prefix = ''): string {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  // Sort: directories first, then files
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  const filtered = entries.filter(e => !IGNORED.has(e.name));
  const lines: string[] = [];

  filtered.forEach((entry, idx) => {
    const isLast = idx === filtered.length - 1;
    const branch = isLast ? '└── ' : '├── ';
    const nextPrefix = prefix + (isLast ? '    ' : '│   ');
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');

    const desc = DESCRIPTIONS[relPath] ? `  # ${DESCRIPTIONS[relPath]}` : '';

    if (entry.isDirectory()) {
      // Don't expand inside public/libraries3DLab or docs/specs_khtn8 too deeply
      if (relPath === 'public/libraries3DLab') {
        const subFiles = fs.readdirSync(fullPath);
        lines.push(`${prefix}${branch}📁 ${entry.name}/ (${subFiles.length} tệp tài nguyên: ảnh thực tế .png, svg, module .html)${desc}`);
      } else if (relPath === 'docs/specs_khtn8') {
        const subFiles = fs.readdirSync(fullPath);
        lines.push(`${prefix}${branch}📁 ${entry.name}/ (${subFiles.length} tài liệu đặc tả KHTN 8)${desc}`);
      } else if (relPath === 'docs/archive_reports') {
        const subFiles = fs.readdirSync(fullPath);
        lines.push(`${prefix}${branch}📁 ${entry.name}/ (${subFiles.length} báo cáo lịch sử đã gom)${desc}`);
        // List key archived reports
        subFiles.slice(0, 8).forEach((sf, sIdx) => {
          const sIsLast = sIdx === Math.min(subFiles.length, 8) - 1 && subFiles.length <= 8;
          const sBranch = sIsLast ? '└── ' : '├── ';
          lines.push(`${nextPrefix}${sBranch}📄 ${sf}`);
        });
        if (subFiles.length > 8) {
          lines.push(`${nextPrefix}└── ... (+${subFiles.length - 8} báo cáo khác)`);
        }
      } else {
        lines.push(`${prefix}${branch}📁 ${entry.name}/${desc}`);
        lines.push(buildTree(fullPath, nextPrefix));
      }
    } else {
      const stats = fs.statSync(fullPath);
      const sizeKb = (stats.size / 1024).toFixed(1);
      lines.push(`${prefix}${branch}📄 ${entry.name} (${sizeKb} KB)${desc}`);
    }
  } );

  return lines.filter(Boolean).join('\n');
}

const rootTree = buildTree(process.cwd());
console.log('openlab-3d/\n' + rootTree);
