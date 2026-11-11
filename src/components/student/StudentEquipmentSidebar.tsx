import React, { useState, useEffect } from 'react';
import { AssetDefinition } from '../../domain/types';
import { EquipmentThumbnailSvg } from '../common/EquipmentThumbnailSvg';
import { EquipmentHoverCard, HoverTargetInfo } from '../common/EquipmentHoverCard';
import { htmlEquipmentModuleRegistry } from '../../three-runtime/HtmlEquipmentModuleRegistry';
import {
  equipmentImagePreviewController,
  PREINSTALLED_LIBRARY_REAL_PHOTOS,
} from '../../three-runtime/EquipmentImagePreviewController';
import { labSoundEngine } from '../../three-runtime/LabSoundEngine';
import {
  Search,
  Plus,
  Check,
  ChevronRight,
  ChevronDown,
  Filter,
  Camera,
  Info,
  PanelLeftClose,
  PanelLeftOpen,
  Eye,
  Clock,
  X,
} from 'lucide-react';

export type ReferenceLibraryCategoryId =
  | 'all'
  | 'optical-equipment'
  | 'electrical-equipment'
  | 'chemical-apparatus'
  | 'biology-microscopy'
  | 'mass-measurement'
  | 'volume-measurement'
  | 'force-measurement'
  | 'thermal-equipment'
  | 'specimens';

interface StudentEquipmentSidebarProps {
  assets: AssetDefinition[];
  presentAssetIds: Set<string>;
  selectedAssetId: string | null;
  requiredAssetIds: Set<string>;
  isExploreOnlyMode?: boolean;
  isDarkMode?: boolean;
  isCollapsed: boolean;
  searchQuery?: string;
  recentSearches?: string[];
  onSearchChange?: (q: string) => void;
  onCommitSearch?: (term: string) => void;
  onSelectRecentSearch?: (term: string) => void;
  onRemoveRecentSearch?: (term: string) => void;
  onClearRecentSearches?: () => void;
  onToggleCollapse: () => void;
  onSelectAsset: (assetId: string) => void;
  onAddAssetToTable: (assetId: string) => void;
  onInspectAssetDetail?: (asset: AssetDefinition, initialEditMode?: boolean) => void;
  onOpenPhotoUpdaterForAsset?: (asset: AssetDefinition) => void;
  onSelectCategoryTopic?: (
    categoryId: ReferenceLibraryCategoryId,
    labelVi: string,
  ) => void;
  activeExperimentId?: string;
  onSelectExperiment?: (experimentId: string) => void;
  onAssembleOpticalBench?: () => void;
}

const REFERENCE_CATEGORIES: Array<{
  id: ReferenceLibraryCategoryId;
  label: string;
}> = [
  { id: 'all', label: 'Tất cả (40)' },
  { id: 'optical-equipment', label: 'Quang học' },
  { id: 'electrical-equipment', label: 'Điện & Điện từ' },
  { id: 'chemical-apparatus', label: 'Hoá học' },
  { id: 'biology-microscopy', label: 'Sinh học' },
  { id: 'mass-measurement', label: 'Đo khối lượng' },
  { id: 'volume-measurement', label: 'Đo thể tích' },
  { id: 'force-measurement', label: 'Cơ học' },
  { id: 'thermal-equipment', label: 'Nhiệt học' },
  { id: 'specimens', label: 'Vật mẫu' },
];

const SHORT_VI_NAMES: Record<string, string> = {
  'OL3D-EQP-BAL-0001': 'Cân điện tử',
  'OL3D-EQP-CYL-0001': 'Ống đong 100 ml',
  'OL3D-EQP-OVF-0001': 'Bình tràn',
  'OL3D-EQP-BKR-0001': 'Cốc 250 ml',
  'OL3D-EQP-SLD-0001': 'Trụ kim loại',
  'OL3D-EQP-DYN-0001': 'Lực kế 5 N',
  'OL3D-EQP-CAL-0001': 'Thước cặp',
  'OL3D-EQP-WGT-0001': 'Quả cân 50 g',
  'OL3D-EQP-SPH-0001': 'Bi thép',
  'OL3D-EQP-BLK-0001': 'Khối đồng',
  'OL3D-EQP-HLW-0001': 'Trụ rỗng',
  'OL3D-EQP-FLK-0001': 'Bình tam giác',
  'OL3D-EQP-STD-0001': 'Giá đỡ',
  'OL3D-EQP-OBN-0001': '(5) Giá quang học',
  'OL3D-EQP-OLP-0001': '(1) Đèn chiếu sáng',
  'OL3D-EQP-FOB-0001': '(2) Vật sáng chữ F',
  'OL3D-EQP-OPT-0001': '(3) Thấu kính (+10)',
  'OL3D-EQP-SCR-0001': '(4) Màn chắn ảnh',
  'OL3D-EQP-PSU-0001': '(6) Nguồn điện 12V',
  'OL3D-EQP-LBX-0001': 'Hộp 6 Thấu kính',
  'OL3D-EQP-THM-0001': 'Nhiệt kế',
  'OL3D-EQP-LSR-0001': 'Đèn Laser',
  'OL3D-EQP-SLB-0001': 'Bản bán trụ',
  'OL3D-EQP-PRM-0001': 'Lăng kính',
  'OL3D-EQP-MAG-0001': 'Kính lúp 5x',
  'OL3D-EQP-GLV-0001': 'Điện kế',
  'OL3D-EQP-DMM-0001': 'Đồng hồ đa năng',
  'OL3D-EQP-COIL-0001': 'Cuộn cảm ứng',
  'OL3D-EQP-DSH-0001': 'Bát sứ & Đèn',
  'OL3D-EQP-SEP-0001': 'Phễu chiết',
  'OL3D-EQP-DST-0001': 'Bộ chưng cất',
  'OL3D-EQP-MIC-0001': 'Kính hiển vi',
  'OL3D-EQP-DNA-0001': 'Mô hình DNA',
  'OL3D-EQP-WDP-1000': 'Bình cấp nước',
  'OL3D-EQP-LEV-0001': 'Bộ đòn bẩy',
  'OL3D-EQP-HYD-0001': 'Bình thông nhau',
  'OL3D-EQP-ALC-0001': 'Đèn cồn',
  'OL3D-EQP-STW-0001': 'Đồng hồ bấm giây',
  'OL3D-EQP-RLR-0001': 'Thước dẹt 30 cm',
  'OL3D-EQP-TUB-0001': 'Ống nghiệm',
};

export const StudentEquipmentSidebar: React.FC<StudentEquipmentSidebarProps> = ({
  assets,
  presentAssetIds,
  selectedAssetId,
  isDarkMode = false,
  isCollapsed,
  searchQuery,
  recentSearches = [],
  onSearchChange,
  onCommitSearch,
  onSelectRecentSearch,
  onRemoveRecentSearch,
  onClearRecentSearches,
  onToggleCollapse,
  onSelectAsset,
  onAddAssetToTable,
  onInspectAssetDetail,
  onOpenPhotoUpdaterForAsset,
  onSelectCategoryTopic,
  activeExperimentId,
  onSelectExperiment,
  onAssembleOpticalBench,
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const search = searchQuery !== undefined ? searchQuery : localSearch;
  const setSearch = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    else setLocalSearch(val);
  };

  const [activeCategory, setActiveCategory] =
    useState<ReferenceLibraryCategoryId>('all');
  const [isQuickExperimentsOpen, setIsQuickExperimentsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    asset: AssetDefinition;
    x: number;
    y: number;
  } | null>(null);

  const [hoverTarget, setHoverTarget] = useState<HoverTargetInfo | null>(null);
  const hoverTimeoutRef = React.useRef<number | null>(null);

  const handleCardMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    asset: AssetDefinition,
  ) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoverTarget({ asset, rect });
    }, 90);
  };

  const handleCardMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoverTarget(null);
    }, 110);
  };



  useEffect(() => {
    if (!contextMenu) return;
    const handleGlobalClick = () => setContextMenu(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [contextMenu]);

  const priorityOrder = [
    'OL3D-EQP-OBN-0001',
    'OL3D-EQP-OLP-0001',
    'OL3D-EQP-FOB-0001',
    'OL3D-EQP-OPT-0001',
    'OL3D-EQP-SCR-0001',
    'OL3D-EQP-PSU-0001',
    'OL3D-EQP-LBX-0001',
    'OL3D-EQP-BAL-0001',
    'OL3D-EQP-CYL-0001',
    'OL3D-EQP-OVF-0001',
    'OL3D-EQP-WDP-1000',
    'OL3D-EQP-BKR-0001',
    'OL3D-EQP-SLD-0001',
    'OL3D-EQP-LSR-0001',
    'OL3D-EQP-SLB-0001',
    'OL3D-EQP-PRM-0001',
    'OL3D-EQP-MAG-0001',
    'OL3D-EQP-GLV-0001',
    'OL3D-EQP-DMM-0001',
    'OL3D-EQP-COIL-0001',
    'OL3D-EQP-DSH-0001',
    'OL3D-EQP-SEP-0001',
    'OL3D-EQP-DST-0001',
    'OL3D-EQP-MIC-0001',
    'OL3D-EQP-DNA-0001',
  ];

  const sortedAssets = [...assets].sort((a, b) => {
    const idxA = priorityOrder.indexOf(a.assetId);
    const idxB = priorityOrder.indexOf(b.assetId);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });

  const filtered = sortedAssets.filter((asset) => {
    if (search.trim() !== '') {
      const q = search.trim().toLowerCase();
      const shortName = (SHORT_VI_NAMES[asset.assetId] || '').toLowerCase();
      const inTextbook =
        asset.textbookRef?.lesson.toLowerCase().includes(q) ||
        asset.textbookRef?.chapter.toLowerCase().includes(q) ||
        asset.textbookRef?.standardFunction.toLowerCase().includes(q);
      if (
        !asset.name.vi.toLowerCase().includes(q) &&
        !shortName.includes(q) &&
        !inTextbook &&
        !asset.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
    }

    if (activeCategory === 'all') return true;
    if (activeCategory === 'specimens') {
      return (
        asset.kind === 'specimen' ||
        asset.category === 'solid-specimens' ||
        asset.category === 'hollow-specimens'
      );
    }
    if (activeCategory === 'volume-measurement') {
      return (
        asset.category === 'volume-measurement' ||
        asset.category === 'laboratory-glassware' ||
        asset.categoryIds.includes('volume-measurement') ||
        asset.categoryIds.includes('laboratory-glassware')
      );
    }
    if (activeCategory === 'force-measurement') {
      return (
        asset.category === 'force-measurement' ||
        asset.category === 'length-measurement' ||
        asset.category === 'thermal-equipment' ||
        asset.category === 'support-hardware' ||
        asset.categoryIds.includes('force-measurement') ||
        asset.categoryIds.includes('length-measurement') ||
        asset.categoryIds.includes('thermal-equipment')
      );
    }
    return (
      asset.category === activeCategory ||
      asset.categoryIds.includes(activeCategory)
    );
  });

  const effectiveSelectedId =
    selectedAssetId || filtered[0]?.assetId || 'OL3D-EQP-BAL-0001';

  const handlePlaceAssetOnTable = (assetId: string) => {
    onAddAssetToTable(assetId);
    if (typeof window !== 'undefined' && window.innerWidth < 768 && !isCollapsed) {
      onToggleCollapse();
    }
  };

  if (isCollapsed) {
    return (
      <aside
        className={`hidden md:flex w-10 border rounded-[10px] py-2 flex-col items-center justify-between h-full shrink-0 select-none transition-colors z-20 ${
          isDarkMode
            ? 'bg-[#071326] border-[#41D9F5]/25 text-[#E8F2FF] shadow-[0_6px_20px_rgba(3,8,20,0.45)]'
            : 'bg-[#F2F6FB] border-[#C4D5E8] text-[#123059] shadow-[0_2px_10px_rgba(18,52,107,0.06)]'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded-[7px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white flex flex-col items-center justify-center transition-colors cursor-pointer shadow-xs"
            title={`Mở thanh công cụ danh mục thiết bị (${assets.length})`}
            aria-label="Mở danh mục thiết bị"
          >
            <PanelLeftOpen className="w-3.5 h-3.5" />
            <span className="text-[9px] font-extrabold leading-none mt-0.5">
              {assets.length}
            </span>
          </button>
        </div>


      </aside>
    );
  }

  return (
    <aside
      aria-label="Danh mục thiết bị thí nghiệm"
      className={`fixed inset-0 z-40 w-full md:static md:z-20 md:w-[274px] lg:w-[292px] md:border md:rounded-[12px] p-3.5 safe-bottom flex flex-col h-full shrink-0 select-none transition-colors ${
        isDarkMode
          ? 'bg-[#071326] md:border-[#41D9F5]/25 text-[#E8F2FF] shadow-[0_8px_28px_rgba(3,8,20,0.5)]'
          : 'bg-[#F2F6FB] md:border-[#C4D5E8] text-[#123059] shadow-[0_2px_10px_rgba(18,52,107,0.06)]'
      }`}
    >
      {/* 1. Tiêu đề Kho thiết bị KHTN & Nút Ẩn */}
      <div className="flex items-center justify-between mb-2.5 gap-1.5 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base shrink-0">🧪</span>
          <span className="text-[13.5px] font-black tracking-tight truncate">
            Kho thiết bị KHTN
          </span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#1E6BFF]/20 border border-[#38BDF8]/40 text-[#38BDF8] shrink-0">
            {assets.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="h-7 px-2 rounded-[6px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[12px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer shrink-0 shadow-xs"
          title="Thu gọn danh mục thiết bị"
          aria-label="Thu gọn danh mục thiết bị"
        >
          <PanelLeftClose className="w-3.5 h-3.5 text-white shrink-0" />
          <span>Ẩn</span>
        </button>
      </div>

      {/* 2. Ô tìm kiếm ngắn gọn, chữ đậm + Recent Searches (5 từ khóa gần đây) */}
      <div className="relative mb-2 shrink-0">
        <Search
          className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
            isDarkMode ? 'text-[#41D9F5]' : 'text-[#1E3A5F]'
          }`}
        />
        <input
          type="text"
          value={search}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setIsSearchFocused(false), 180);
          }}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && search.trim()) {
              onCommitSearch?.(search.trim());
              setIsSearchFocused(false);
            }
          }}
          placeholder="Tìm dụng cụ, bài học..."
          className={`w-full border-[1.5px] rounded-[9px] pl-9 pr-8 py-2 md:py-1.5 text-[15px] md:text-[14.5px] font-extrabold focus:outline-none focus:border-[#1D63E8] transition-colors ${
            isDarkMode
              ? 'bg-[#050B18] border-[#41D9F5]/35 focus:border-[#41D9F5] text-[#E8F2FF] placeholder:text-[#A8BCD5]/75'
              : 'bg-[#E2ECF8] border-[#7FA3CE] text-[#051630] placeholder:text-[#2B4C73]'
          }`}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer ${
              isDarkMode
                ? 'bg-[#10223D] text-[#E8F2FF] hover:bg-[#4D8DFF]'
                : 'bg-[#C4D7EE] text-[#051630] hover:bg-[#A6C2E5]'
            }`}
            title="Xóa tìm kiếm"
          >
            <X className="w-3 h-3 stroke-[2.6]" />
          </button>
        )}

        {/* Popover Glassmorphism: 5 Tìm kiếm gần đây khi focus ô tìm kiếm sidebar */}
        {isSearchFocused && recentSearches.length > 0 && (
          <div
            className={`absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-[11px] border-[1.5px] p-2 shadow-xl backdrop-blur-2xl ${
              isDarkMode
                ? 'bg-[#0B1930]/95 border-[#41D9F5]/75 text-[#E8F2FF]'
                : 'bg-white/90 border-[#1D63E8]/55 text-[#051630]'
            }`}
          >
            <div className="flex items-center justify-between px-1.5 pb-1.5 mb-1 border-b border-slate-400/25">
              <span className="text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#1E6BFF]" />
                Tìm kiếm gần đây ({recentSearches.slice(0, 5).length})
              </span>
              {onClearRecentSearches && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onClearRecentSearches();
                  }}
                  className="text-[11px] font-extrabold text-rose-500 hover:underline cursor-pointer"
                >
                  Xóa hết
                </button>
              )}
            </div>
            <div className="space-y-1">
              {recentSearches.slice(0, 5).map((term) => (
                <div
                  key={term}
                  className={`flex items-center justify-between rounded-[7px] px-2 py-1 text-[13px] font-extrabold transition-colors ${
                    isDarkMode
                      ? 'hover:bg-[#4D8DFF]/35 text-[#E8F2FF]'
                      : 'hover:bg-[#DCE8F8] text-[#051630]'
                  }`}
                >
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (onSelectRecentSearch) onSelectRecentSearch(term);
                      else setSearch(term);
                      setIsSearchFocused(false);
                    }}
                    className="flex-1 text-left truncate cursor-pointer flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 shrink-0 text-[#1E6BFF]" />
                    <span className="truncate">{term}</span>
                  </button>
                  {onRemoveRecentSearch && (
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveRecentSearch(term);
                      }}
                      className="p-0.5 rounded hover:bg-rose-500/20 text-rose-500 cursor-pointer ml-1"
                      title="Xóa từ khóa này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2B. Chọn nhanh Bài thí nghiệm (Thu gọn mặc định để dành không gian rà tìm thiết bị) */}
      {onSelectExperiment && (
        <div
          className={`mb-2 rounded-[9px] border-[1.5px] p-1.5 shrink-0 ${
            isDarkMode
              ? 'bg-[#050B18]/90 border-[#41D9F5]/35'
              : 'bg-[#DCE8F8] border-[#88ADD8]'
          }`}
        >
          <div className="flex items-center justify-between gap-1 px-0.5">
            <button
              type="button"
              onClick={() => setIsQuickExperimentsOpen((v) => !v)}
              className={`flex-1 flex items-center justify-between gap-1 py-0.5 text-left cursor-pointer text-[11px] font-extrabold tracking-tight ${
                isDarkMode ? 'text-[#41D9F5]' : 'text-[#0B3A7D]'
              }`}
              title={
                isQuickExperimentsOpen
                  ? 'Thu gọn danh sách bài thực hành xếp sẵn'
                  : 'Mở chọn nhanh các bài thực hành SGK (Hiển vi, Thấu kính, KLR, Bình tràn, Nhiệt)'
              }
            >
              <span className="truncate">
                📖 Bài thực hành (Xếp sẵn)
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                  isQuickExperimentsOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {activeExperimentId === 'OL3D-EXP-OPTICS-LENS-0001' &&
              onAssembleOpticalBench && (
                <button
                  type="button"
                  onClick={onAssembleOpticalBench}
                  className="px-2 py-0.5 rounded-[5px] bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10.5px] font-extrabold shadow-2xs transition-colors cursor-pointer shrink-0"
                  title="Tự động lắp ráp 7 chi tiết thành Bộ thí nghiệm Thấu kính hoàn chỉnh trên bàn"
                >
                  ⚡ Lắp bộ 8.12
                </button>
              )}
          </div>
          {isQuickExperimentsOpen && (
            <div className="grid grid-cols-2 gap-1 mt-1.5">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('biology-microscopy');
                  window.dispatchEvent(new CustomEvent('openlab:open-microscope'));
                }}
                className="col-span-2 px-2.5 py-1.5 rounded-[7px] text-[12px] font-black text-left leading-tight border transition-all cursor-pointer flex items-center justify-between shadow-xs bg-gradient-to-r from-[#0B1930] via-[#10223D] to-[#1E1B4B] border-[#9B83FF]/75 text-[#E8F2FF] hover:border-[#41D9F5]"
                title="Mở buồng quan sát Kính hiển vi quang học 3D với 8 tiêu bản chuẩn KHTN THCS"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">🔬</span>
                  <span>Soi Kính hiển vi 3D (8 Mẫu vật KHTN)</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#41D9F5]" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('optical-equipment');
                  onSelectExperiment('OL3D-EXP-OPTICS-LENS-0001');
                }}
                className={`px-2 py-1.5 rounded-[7px] text-[11.5px] font-extrabold text-left leading-tight border transition-colors cursor-pointer ${
                  activeExperimentId === 'OL3D-EXP-OPTICS-LENS-0001'
                    ? 'bg-[#1D63E8] text-white border-[#41D9F5] shadow-xs'
                    : isDarkMode
                      ? 'bg-[#10223D] hover:bg-[#19335A] text-[#E8F2FF] border-[#41D9F5]/25'
                      : 'bg-white hover:bg-[#EBF2FA] text-[#051630] border-[#9BBBE0]'
                }`}
                title="Chọn bài Lắp ráp & Khảo sát Thấu kính (Hình 8.12): 7 chi tiết bộ thí nghiệm sẽ có sẵn trên Kệ trưng bày"
              >
                🔬 Bài 8–9: Bộ Thấu kính (Hình 8.12)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  onSelectExperiment('OL3D-EXP-DENSITY-SOLID-0001');
                }}
                className={`px-2 py-1.5 rounded-[7px] text-[11.5px] font-extrabold text-left leading-tight border transition-colors cursor-pointer ${
                  activeExperimentId === 'OL3D-EXP-DENSITY-SOLID-0001' ||
                  activeExperimentId === 'OL3D-EXP-DENSITY-0001'
                    ? 'bg-[#1D63E8] text-white border-[#41D9F5] shadow-xs'
                    : isDarkMode
                      ? 'bg-[#10223D] hover:bg-[#19335A] text-[#E8F2FF] border-[#41D9F5]/25'
                      : 'bg-white hover:bg-[#EBF2FA] text-[#051630] border-[#9BBBE0]'
                }`}
                title="Chọn bài Đo khối lượng riêng của vật rắn"
              >
                ⚖️ Bài 14: Đo Khối lượng riêng
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  onSelectExperiment('OL3D-EXP-DISPLACEMENT-0001');
                }}
                className={`px-2 py-1.5 rounded-[7px] text-[11.5px] font-extrabold text-left leading-tight border transition-colors cursor-pointer ${
                  activeExperimentId === 'OL3D-EXP-DISPLACEMENT-0001'
                    ? 'bg-[#1D63E8] text-white border-[#41D9F5] shadow-xs'
                    : isDarkMode
                      ? 'bg-[#10223D] hover:bg-[#19335A] text-[#E8F2FF] border-[#41D9F5]/25'
                      : 'bg-white hover:bg-[#EBF2FA] text-[#051630] border-[#9BBBE0]'
                }`}
                title="Chọn bài Đo thể tích vật rắn bằng Bình tràn & Lực đẩy Archimedes"
              >
                ⚓ Bài 15: Bình tràn & Ác-si-mét
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('thermal-equipment');
                  onSelectExperiment('OL3D-EXP-THERMAL-BOIL-0001');
                }}
                className={`px-2 py-1.5 rounded-[7px] text-[11.5px] font-extrabold text-left leading-tight border transition-colors cursor-pointer ${
                  activeExperimentId === 'OL3D-EXP-THERMAL-BOIL-0001'
                    ? 'bg-[#1D63E8] text-white border-[#41D9F5] shadow-xs'
                    : isDarkMode
                      ? 'bg-[#10223D] hover:bg-[#19335A] text-[#E8F2FF] border-[#41D9F5]/25'
                      : 'bg-white hover:bg-[#EBF2FA] text-[#051630] border-[#9BBBE0]'
                }`}
                title="Chọn bài Khảo sát Truyền nhiệt, Đo nhiệt độ sôi & Bảo toàn năng lượng"
              >
                🔥 Bài 27: Đo Nhiệt độ sôi & Q
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Bộ lọc Lĩnh vực thu gọn 1 dòng — Tối đa hóa không gian cuộn rà tìm thiết bị */}
      <div className="flex items-center gap-1.5 mb-2 shrink-0">
        <div className="relative flex-1 min-w-0">
          <Filter
            className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
              isDarkMode ? 'text-[#41D9F5]' : 'text-[#1D63E8]'
            }`}
          />
          <select
            value={activeCategory}
            onChange={(e) => {
              const catId = e.target.value as ReferenceLibraryCategoryId;
              setActiveCategory(catId);
              const cat = REFERENCE_CATEGORIES.find((c) => c.id === catId);
              if (cat && onSelectCategoryTopic) {
                onSelectCategoryTopic(cat.id, cat.label);
              }
            }}
            aria-label="Lọc theo lĩnh vực KHTN"
            className={`w-full pl-8 pr-7 py-1.5 rounded-[8px] text-[12.5px] font-extrabold border-[1.5px] cursor-pointer focus:outline-none appearance-none transition-colors ${
              isDarkMode
                ? 'bg-[#0B1930] border-[#41D9F5]/35 text-[#E8F2FF] focus:border-[#41D9F5]'
                : 'bg-white border-[#7FA3CE] text-[#051630] focus:border-[#1D63E8]'
            }`}
          >
            {REFERENCE_CATEGORIES.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
                className={
                  isDarkMode
                    ? 'bg-[#0B1930] text-[#E8F2FF]'
                    : 'bg-white text-[#051630]'
                }
              >
                {`Lĩnh vực: ${cat.label}`}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-75 ${
              isDarkMode ? 'text-[#41D9F5]' : 'text-[#1D63E8]'
            }`}
          />
        </div>

        {activeCategory !== 'all' && (
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              if (onSelectCategoryTopic) {
                onSelectCategoryTopic('all', 'Tất cả (40)');
              }
            }}
            className="px-2 py-1.5 rounded-[8px] bg-[#1E6BFF]/20 hover:bg-[#1E6BFF]/35 border border-[#38BDF8]/40 text-[#38BDF8] text-[11px] font-extrabold cursor-pointer shrink-0 transition-colors"
            title="Xóa bộ lọc để hiện tất cả thiết bị"
          >
            ✕ Tất cả
          </button>
        )}
      </div>

      {/* 4. Lưới thẻ thiết bị cảm ứng (2 cột trên Desktop) */}
      <div className="flex-1 overflow-y-auto pr-0.5 min-h-0">
        {filtered.length === 0 ? (
          <div className="py-8 px-3 text-center space-y-2">
            <p
              className={`text-[15px] font-medium ${
                isDarkMode ? 'text-[#A8BCD5]' : 'text-[#4B6280]'
              }`}
            >
              Không tìm thấy dụng cụ.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setActiveCategory('all');
              }}
              className={`min-h-[42px] px-4 py-1.5 rounded-[8px] text-[14px] font-bold ${
                isDarkMode
                  ? 'bg-[#10223D] text-[#41D9F5] border border-[#41D9F5]/40 hover:bg-[#19335A]'
                  : 'bg-[#DCE8F8] text-[#1D63E8] hover:bg-[#C4D5E8]'
              }`}
            >
              Xem tất cả
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
            {filtered.map((asset) => {
              const isSelected = asset.assetId === effectiveSelectedId;
              const isOnTable = presentAssetIds.has(asset.assetId);
              const isOverridden = Boolean(
                htmlEquipmentModuleRegistry.getAssetOverride(asset.assetId),
              );
              const hasRealPhotoInLibrary = Boolean(
                htmlEquipmentModuleRegistry.getUploadedRealPhoto(asset.assetId) ||
                  PREINSTALLED_LIBRARY_REAL_PHOTOS[asset.assetId],
              );
              const displayName = isOverridden
                ? asset.name.vi
                : SHORT_VI_NAMES[asset.assetId] || asset.name.vi;

              return (
                <div
                  key={asset.assetId}
                  data-module-id={asset.assetId}
                  draggable
                  onDragStart={(e) => {
                    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    setHoverTarget(null);
                    labSoundEngine.play('grab-pickup', 0.8);
                    equipmentImagePreviewController.hide('viewport-click');
                    e.dataTransfer.setData(
                      'application/openlab-asset-id',
                      asset.assetId,
                    );
                  }}
                  onClick={() => {
                    labSoundEngine.play('ui-toggle', 0.65);
                    onSelectAsset(asset.assetId);
                  }}
                  onDoubleClick={() => {
                    setHoverTarget(null);
                    handlePlaceAssetOnTable(asset.assetId);
                  }}
                  onMouseEnter={(e) => handleCardMouseEnter(e, asset)}
                  onMouseLeave={handleCardMouseLeave}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    setHoverTarget(null);
                    labSoundEngine.play('ui-toggle', 0.85);
                    onSelectAsset(asset.assetId);
                    setContextMenu({
                      asset,
                      x: Math.min(e.clientX, window.innerWidth - 265),
                      y: Math.min(e.clientY, window.innerHeight - 265),
                    });
                  }}
                  className={`p-2.5 rounded-[10px] transition-all cursor-pointer flex flex-col items-center justify-between text-center relative border ${
                    isSelected
                      ? isDarkMode
                        ? 'border-2 border-[#41D9F5] bg-[#4D8DFF]/22 shadow-[0_0_16px_rgba(65,217,245,0.25)]'
                        : 'border-2 border-[#1D63E8] bg-[#DCE8F8] shadow-xs'
                      : isDarkMode
                        ? 'bg-[#10223D]/90 border-[#41D9F5]/20 hover:border-[#41D9F5]/75 hover:bg-[#152C4F]'
                        : 'bg-[#E6EEF8] border-[#C4D5E8] hover:border-[#00BCEB]'
                  }`}
                >
                  {/* Nút gọi Ảnh thật & Cài đặt hình ảnh góc trái trên */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      labSoundEngine.play('ui-toggle', 0.75);
                      onSelectAsset(asset.assetId);
                      equipmentImagePreviewController.preview(
                        asset.assetId,
                        'pinned',
                      );
                    }}
                    title={
                      hasRealPhotoInLibrary
                        ? `Có ảnh thực tế 240×240 trong thư viện: ${asset.name.vi}`
                        : `Mặc định (Chưa có ảnh thật) — Bấm để xem / cập nhật: ${asset.name.vi}`
                    }
                    className={`absolute top-1.5 left-1.5 w-7 h-7 md:w-5.5 md:h-5.5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      hasRealPhotoInLibrary
                        ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-400/50 hover:bg-emerald-500 hover:text-slate-950'
                        : isDarkMode
                          ? 'bg-[#050B18]/90 text-[#A8BCD5] border border-[#41D9F5]/25 hover:bg-[#FFB85C] hover:text-[#050B18]'
                          : 'bg-white/95 text-[#4B6280] hover:bg-[#1D63E8] hover:text-white border border-[#C4D5E8]'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>

                  {isOnTable && (
                    <span
                      className="absolute top-1.5 right-1.5 w-5 h-5 md:w-4.5 md:h-4.5 rounded-full bg-[#22C55E] text-white flex items-center justify-center shadow-xs"
                      title="Đã đặt trên bàn"
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}

                  <div className="w-full h-[62px] flex items-center justify-center mt-1">
                    <EquipmentThumbnailSvg
                      archetype={asset.geometry.proceduralArchetype}
                      assetId={asset.assetId}
                      className="w-[56px] h-[56px]"
                    />
                  </div>

                  <span
                    className={`text-[13.5px] font-extrabold leading-snug line-clamp-2 mt-1.5 ${
                      isDarkMode ? 'text-[#E8F2FF]' : 'text-[#051630]'
                    }`}
                  >
                    {displayName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Menu Chuột Phải (Right-Click Context Menu) — Planetary Cosmos Glassmorphism */}
      {contextMenu && (
        <div
          style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-[264px] rounded-[13px] bg-[#0B1930]/92 backdrop-blur-2xl border-[1.5px] border-[#41D9F5] shadow-[0_18px_42px_rgba(3,8,20,0.75)] text-[#E8F2FF] p-2 space-y-1"
        >
          <div className="px-2.5 py-2 border-b border-[#41D9F5]/25 flex items-center gap-2.5 bg-[#050B18]/75 rounded-[9px]">
            <div className="w-10 h-10 rounded-[8px] bg-[#0B1930] border border-[#41D9F5]/60 flex items-center justify-center shrink-0 shadow-inner">
              <EquipmentThumbnailSvg
                archetype={contextMenu.asset.geometry.proceduralArchetype}
                assetId={contextMenu.asset.assetId}
                className="w-8 h-8"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-extrabold text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {contextMenu.asset.name.vi}
              </div>
              <div className="text-[11.5px] font-mono font-bold text-[#7DD3FC]">
                {contextMenu.asset.assetId}
              </div>
            </div>
          </div>

          {(contextMenu.asset.assetId === 'OL3D-EQP-MIC-0001' ||
            contextMenu.asset.geometry.proceduralArchetype ===
              'optical-microscope') && (
            <button
              type="button"
              onClick={() => {
                const target = contextMenu.asset;
                setContextMenu(null);
                onAddAssetToTable(target.assetId);
                window.dispatchEvent(
                  new CustomEvent('openlab:open-microscope'),
                );
              }}
              className="w-full px-2.5 py-2 rounded-[8px] bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-left text-[13px] font-black text-white flex items-center gap-2 cursor-pointer transition-all shadow-md border border-sky-400/50"
            >
              <Eye className="w-4 h-4 text-amber-300 shrink-0" />
              <span>🔬 Soi thị kính (KHTN THCS)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const target = contextMenu.asset;
              setContextMenu(null);
              equipmentImagePreviewController.preview(target.assetId, 'pinned');
            }}
            className="w-full px-2.5 py-2 rounded-[8px] hover:bg-[#1E6BFF]/75 text-left text-[13px] font-extrabold text-white flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Eye className="w-4 h-4 text-[#38BDF8] shrink-0" />
            <span>Xem ảnh thực tế (240×240)</span>
          </button>

          {onOpenPhotoUpdaterForAsset && (
            <button
              type="button"
              onClick={() => {
                const target = contextMenu.asset;
                setContextMenu(null);
                onOpenPhotoUpdaterForAsset(target);
              }}
              className="w-full px-2.5 py-2 rounded-[8px] bg-amber-500/25 hover:bg-amber-500/40 border border-amber-300/75 text-left text-[13px] font-extrabold text-[#FDE047] flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Camera className="w-4 h-4 text-[#FDE047] shrink-0" />
              <span>Cập nhật hình ảnh thật</span>
            </button>
          )}



          {onInspectAssetDetail && (
            <button
              type="button"
              onClick={() => {
                const target = contextMenu.asset;
                setContextMenu(null);
                onInspectAssetDetail(target, false);
              }}
              className="w-full px-2.5 py-1.5 rounded-[8px] hover:bg-white/15 text-left text-[13px] font-extrabold text-white flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Info className="w-4 h-4 text-[#7DD3FC] shrink-0" />
              <span>Hồ sơ chi tiết 5 nguồn</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const target = contextMenu.asset;
              setContextMenu(null);
              handlePlaceAssetOnTable(target.assetId);
            }}
            className="w-full px-2.5 py-1.5 rounded-[8px] hover:bg-white/15 text-left text-[13px] font-extrabold text-white flex items-center gap-2 cursor-pointer transition-colors border-t border-white/20 pt-2"
          >
            <Plus className="w-4 h-4 text-[#4ADE80] shrink-0" />
            <span>Đặt lên bàn</span>
          </button>
        </div>
      )}

      {/* Thẻ nổi Hướng dẫn & Thông số Glassmorphism khi rê chuột vào thiết bị */}
      <EquipmentHoverCard
        hoverTarget={hoverTarget}
        onAddAssetToTable={handlePlaceAssetOnTable}
        onPreviewPhoto={(id) => {
          equipmentImagePreviewController.preview(id, 'pinned');
          setHoverTarget(null);
        }}
        isDarkMode={isDarkMode}
      />
    </aside>
  );
};
