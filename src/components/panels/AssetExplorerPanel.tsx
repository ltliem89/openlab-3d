import React, { useState } from 'react';
import {
  AssetDefinition,
  EquipmentCategoryId,
  EquipmentKit,
  LabEnvironment,
  ScienceSubject,
  VerificationStatus,
} from '../../domain/types';
import { CategoryMeta } from '../../repositories/CatalogRepository';
import { EquipmentThumbnailSvg } from '../common/EquipmentThumbnailSvg';
import { equipmentImagePreviewController } from '../../three-runtime/EquipmentImagePreviewController';
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Package,
  Globe,
  SlidersHorizontal,
  Clock,
  X,
} from 'lucide-react';

export type ExplorerTabId = 'equipment' | 'kits' | 'environments';

interface AssetExplorerPanelProps {
  activeTab: ExplorerTabId;
  onTabChange: (tab: ExplorerTabId) => void;
  assets: AssetDefinition[];
  categories: CategoryMeta[];
  kits: EquipmentKit[];
  environments: LabEnvironment[];
  selectedCatalogAssetId: string | null;
  activeEnvironmentId: string;
  searchQuery: string;
  recentSearches?: string[];
  selectedSubject: ScienceSubject | 'all';
  selectedCategory: EquipmentCategoryId | 'all';
  selectedVerification: VerificationStatus | 'all';
  selectedFormat: 'all' | 'GLB' | 'glTF' | 'PROCEDURAL_PBR';
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSearchChange: (q: string) => void;
  onCommitSearch?: (term: string) => void;
  onSelectRecentSearch?: (term: string) => void;
  onRemoveRecentSearch?: (term: string) => void;
  onClearRecentSearches?: () => void;
  onSubjectChange: (s: ScienceSubject | 'all') => void;
  onCategoryChange: (c: EquipmentCategoryId | 'all') => void;
  onVerificationChange: (v: VerificationStatus | 'all') => void;
  onFormatChange: (f: 'all' | 'GLB' | 'glTF' | 'PROCEDURAL_PBR') => void;
  onSelectCatalogAsset: (assetId: string) => void;
  onAddAssetToScene: (assetId: string) => void;
  onBatchAddAssetsToScene: (assetIds: string[]) => void;
  onLoadKitToScene: (kit: EquipmentKit) => void;
  onSelectEnvironment: (envId: string) => void;
}

export const AssetExplorerPanel: React.FC<AssetExplorerPanelProps> = ({
  activeTab,
  onTabChange,
  assets,
  categories,
  kits,
  environments,
  selectedCatalogAssetId,
  activeEnvironmentId,
  searchQuery,
  recentSearches = [],
  selectedSubject,
  selectedCategory,
  selectedVerification,
  selectedFormat,
  isCollapsed,
  onToggleCollapse,
  onSearchChange,
  onCommitSearch,
  onSelectRecentSearch,
  onRemoveRecentSearch,
  onClearRecentSearches,
  onSubjectChange,
  onCategoryChange,
  onVerificationChange,
  onFormatChange,
  onSelectCatalogAsset,
  onAddAssetToScene,
  onBatchAddAssetsToScene,
  onLoadKitToScene,
  onSelectEnvironment,
}) => {
  const [viewLayout, setViewLayout] = useState<'list' | 'grid'>('list');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [checkedAssetIds, setCheckedAssetIds] = useState<Set<string>>(new Set());
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const toggleChecked = (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedAssetIds((prev) => {
      const next = new Set(prev);
      if (next.has(assetId)) next.delete(assetId);
      else next.add(assetId);
      return next;
    });
  };

  const handleBatchAdd = () => {
    if (checkedAssetIds.size === 0) return;
    onBatchAddAssetsToScene(Array.from(checkedAssetIds));
    setCheckedAssetIds(new Set());
  };

  const formatVerificationLabel = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return { text: 'Đã kiểm chứng', color: 'text-emerald-400' };
      case 'partially-verified':
        return { text: 'Kiểm chứng một phần', color: 'text-amber-400' };
      case 'not-verified':
      default:
        return { text: 'Dữ liệu minh họa', color: 'text-slate-400' };
    }
  };

  if (isCollapsed) {
    return (
      <aside className="w-10 bg-[#0E1420] border-r border-slate-800/90 flex flex-col items-center py-2.5 gap-3 shrink-0 z-20">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-[6px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white flex items-center justify-center cursor-pointer shadow-xs"
          title="Mở thanh công cụ Asset Explorer"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-80 xl:w-86 bg-[#0E1420] border-r border-slate-800/90 flex flex-col h-full shrink-0 select-none z-20">
      {/* Panel Header */}
      <div className="h-10 px-3 border-b border-slate-800/90 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-100">
            Asset Explorer
          </span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span className="text-[11px] font-mono text-slate-400 tabular-nums">
            {assets.length} mục
          </span>
        </div>

        <div className="flex items-center gap-1">
          {activeTab === 'equipment' && (
            <>
              <button
                type="button"
                onClick={() => setViewLayout('list')}
                className={`p-1 rounded transition-colors ${
                  viewLayout === 'list'
                    ? 'bg-slate-800 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Chế độ danh sách chi tiết"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('grid')}
                className={`p-1 rounded transition-colors ${
                  viewLayout === 'grid'
                    ? 'bg-slate-800 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Chế độ lưới Thumbnail"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowAdvancedFilters((v) => !v)}
                className={`p-1 rounded transition-colors ${
                  showAdvancedFilters
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Bộ lọc nâng cao (Môn học, Kiểm chứng, Định dạng)"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="h-6.5 px-2 rounded-[6px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[11px] font-extrabold flex items-center gap-0.5 cursor-pointer shadow-xs"
            title="Ẩn Asset Explorer"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white" />
            <span>Ẩn</span>
          </button>
        </div>
      </div>

      {/* 3 Segmented Tabs: Thiết bị | Bộ thiết bị | Môi trường */}
      <div className="p-2 border-b border-slate-800/80 bg-[#0B0F17]/60 shrink-0">
        <div className="grid grid-cols-3 gap-1 p-0.5 bg-[#090D16] rounded border border-slate-800">
          <button
            type="button"
            onClick={() => onTabChange('equipment')}
            className={`py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'equipment'
                ? 'bg-slate-800 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Thiết bị ({assets.length})
          </button>
          <button
            type="button"
            onClick={() => onTabChange('kits')}
            className={`py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'kits'
                ? 'bg-slate-800 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bộ thiết bị ({kits.length})
          </button>
          <button
            type="button"
            onClick={() => onTabChange('environments')}
            className={`py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'environments'
                ? 'bg-slate-800 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Môi trường ({environments.length})
          </button>
        </div>
      </div>

      {/* TAB 1: EQUIPMENT & SPECIMENS */}
      {activeTab === 'equipment' && (
        <>
          {/* Search & Category Filter Controls */}
          <div className="p-2.5 border-b border-slate-800/80 space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  window.setTimeout(() => setIsSearchFocused(false), 180);
                }}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    onCommitSearch?.(searchQuery.trim());
                    setIsSearchFocused(false);
                  }
                }}
                placeholder="Tìm tên thiết bị, mã OL3D-EQP..."
                className="w-full bg-[#090D16] border border-slate-700 focus:border-cyan-400 rounded pl-8 pr-7 py-1.5 text-xs font-bold text-white placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Popover Glassmorphism: 5 Tìm kiếm gần đây */}
              {isSearchFocused && recentSearches.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-lg border border-cyan-400/70 bg-[#081528]/82 backdrop-blur-2xl p-2 shadow-[0_14px_34px_rgba(0,0,0,0.65)] text-white">
                  <div className="flex items-center justify-between px-1.5 pb-1 mb-1 border-b border-white/15">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Tìm kiếm gần đây ({recentSearches.slice(0, 5).length})
                    </span>
                    {onClearRecentSearches && (
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onClearRecentSearches();
                        }}
                        className="text-[10.5px] font-extrabold text-rose-400 hover:underline cursor-pointer"
                      >
                        Xóa hết
                      </button>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    {recentSearches.slice(0, 5).map((term) => (
                      <div
                        key={term}
                        className="flex items-center justify-between rounded px-2 py-1 text-xs font-bold text-white hover:bg-cyan-500/25 transition-colors"
                      >
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            if (onSelectRecentSearch) onSelectRecentSearch(term);
                            else onSearchChange(term);
                            setIsSearchFocused(false);
                          }}
                          className="flex-1 text-left truncate cursor-pointer flex items-center gap-1.5"
                        >
                          <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
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
                            className="p-0.5 rounded hover:bg-rose-500/20 text-rose-400 cursor-pointer ml-1"
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

            {/* Category selector */}
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as EquipmentCategoryId | 'all')}
              className="w-full bg-[#090D16] border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Collapsible Advanced Filters */}
            {showAdvancedFilters && (
              <div className="pt-1.5 border-t border-slate-800/80 grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Môn học</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => onSubjectChange(e.target.value as ScienceSubject | 'all')}
                    className="w-full bg-[#090D16] border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
                  >
                    <option value="all">Tất cả môn</option>
                    <option value="physics">Vật lí</option>
                    <option value="chemistry">Hóa học</option>
                    <option value="biology">Sinh học</option>
                    <option value="stem">STEM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Kiểm chứng</label>
                  <select
                    value={selectedVerification}
                    onChange={(e) =>
                      onVerificationChange(e.target.value as VerificationStatus | 'all')
                    }
                    className="w-full bg-[#090D16] border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
                  >
                    <option value="all">Mọi trạng thái</option>
                    <option value="verified">Đã kiểm chứng</option>
                    <option value="partially-verified">Kiểm chứng 1 phần</option>
                    <option value="not-verified">Dữ liệu minh họa</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] text-slate-400 mb-0.5">Định dạng 3D</label>
                  <select
                    value={selectedFormat}
                    onChange={(e) =>
                      onFormatChange(
                        e.target.value as 'all' | 'GLB' | 'glTF' | 'PROCEDURAL_PBR',
                      )
                    }
                    className="w-full bg-[#090D16] border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
                  >
                    <option value="all">Tất cả định dạng (GLB / Procedural PBR)</option>
                    <option value="GLB">GLB Chuẩn hóa (.glb)</option>
                    <option value="PROCEDURAL_PBR">Procedural PBR 3D</option>
                  </select>
                </div>
              </div>
            )}

            {/* Multi-select batch action bar */}
            {checkedAssetIds.size > 0 && (
              <div className="bg-cyan-950/60 border border-cyan-500/40 rounded px-2.5 py-1.5 flex items-center justify-between gap-2">
                <span className="text-[11px] text-cyan-200 font-medium">
                  Đã chọn {checkedAssetIds.size} tài sản
                </span>
                <button
                  type="button"
                  onClick={handleBatchAdd}
                  className="px-2 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-[11px] rounded whitespace-nowrap"
                >
                  + Thêm cả {checkedAssetIds.size} vào cảnh
                </button>
              </div>
            )}
          </div>

          {/* Equipment List or Grid */}
          <div className="flex-1 overflow-y-auto p-2.5">
            {assets.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <p className="text-xs font-semibold text-slate-300">
                  Không tìm thấy thiết bị phù hợp
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Hãy thử xóa từ khóa tìm kiếm hoặc chọn "Tất cả danh mục".
                </p>
              </div>
            ) : viewLayout === 'list' ? (
              <div className="space-y-1.5">
                {assets.map((asset) => {
                  const isSelected = asset.assetId === selectedCatalogAssetId;
                  const isChecked = checkedAssetIds.has(asset.assetId);
                  const verif = formatVerificationLabel(asset.validation.geometryStatus);

                  return (
                    <div
                      key={asset.assetId}
                      data-module-id={asset.assetId}
                      draggable
                      onDragStart={(e) => {
                        equipmentImagePreviewController.hide('viewport-click');
                        e.dataTransfer.setData('application/openlab-asset-id', asset.assetId);
                      }}
                      onClick={() => {
                        onSelectCatalogAsset(asset.assetId);
                      }}
                      className={`group p-2 rounded border transition-colors cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-slate-800/90 border-cyan-500/60'
                          : 'bg-[#0B0F17]/90 border-slate-800/90 hover:border-slate-700'
                      }`}
                    >
                      {/* Multi-select checkbox */}
                      <button
                        type="button"
                        onClick={(e) => toggleChecked(asset.assetId, e)}
                        className="mt-1 text-slate-500 hover:text-cyan-400 shrink-0"
                        title="Chọn nhiều tài sản"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <Square className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Technical Schematic Preview */}
                      <div className="w-12 h-12 rounded bg-[#090D16] border border-slate-800 flex items-center justify-center shrink-0">
                        <EquipmentThumbnailSvg
                          archetype={asset.geometry.proceduralArchetype}
                          className="w-11 h-11"
                        />
                      </div>

                      {/* Clean Unboxed Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-100 truncate">
                          {asset.name.vi}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                          <span>{asset.assetId}</span>
                          <span aria-hidden="true">·</span>
                          <span>v{asset.assetVersion}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-1.5">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className={verif.color}>{verif.text}</span>
                            <span className="text-slate-600" aria-hidden="true">·</span>
                            <span className="text-slate-500 font-mono">
                              {asset.geometry.modelFormat}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddAssetToScene(asset.assetId);
                            }}
                            className="px-2 py-0.5 text-[11px] font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/30 rounded transition-colors whitespace-nowrap"
                          >
                            + Cảnh
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Grid Thumbnail Mode */
              <div className="grid grid-cols-2 gap-2">
                {assets.map((asset) => {
                  const isSelected = asset.assetId === selectedCatalogAssetId;
                  const verif = formatVerificationLabel(asset.validation.geometryStatus);

                  return (
                    <div
                      key={asset.assetId}
                      data-module-id={asset.assetId}
                      draggable
                      onDragStart={(e) => {
                        equipmentImagePreviewController.hide('viewport-click');
                        e.dataTransfer.setData('application/openlab-asset-id', asset.assetId);
                      }}
                      onClick={() => {
                        onSelectCatalogAsset(asset.assetId);
                      }}
                      className={`p-2 rounded border transition-colors cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800/90 border-cyan-500/60'
                          : 'bg-[#0B0F17]/90 border-slate-800/90 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="w-full h-20 rounded bg-[#090D16] border border-slate-800/80 flex items-center justify-center mb-2">
                          <EquipmentThumbnailSvg
                            archetype={asset.geometry.proceduralArchetype}
                            className="w-16 h-16"
                          />
                        </div>
                        <div className="text-xs font-semibold text-slate-100 line-clamp-1">
                          {asset.name.vi}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                          {asset.assetId} · v{asset.assetVersion}
                        </div>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between gap-1">
                        <span className={`text-[10px] truncate ${verif.color}`}>
                          {verif.text}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddAssetToScene(asset.assetId);
                          }}
                          className="p-1 text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/30 rounded"
                          title="Thêm vào cảnh 3D"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: EQUIPMENT KITS */}
      {activeTab === 'kits' && (
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
          {kits.map((kit) => (
            <div
              key={kit.kitId}
              className="p-3 rounded border border-slate-800 bg-[#0B0F17]/90 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-semibold text-slate-100">
                    {kit.name.vi}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {kit.kitId} · Phiên bản v{kit.kitVersion} · {kit.items.length} thiết bị
                  </p>
                </div>
                <Package className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {kit.purpose}
              </p>

              <div className="pt-1 border-t border-slate-800/80 space-y-1">
                <div className="text-[11px] font-medium text-slate-400">
                  Danh mục phiên bản thiết bị tham chiếu:
                </div>
                {kit.items.map((item) => (
                  <div
                    key={`${kit.kitId}-${item.assetId}`}
                    className="flex items-center justify-between text-[11px] text-slate-300 font-mono"
                  >
                    <span className="truncate">
                      {item.assetId}@v{item.assetVersion}
                    </span>
                    <span className="text-slate-400 shrink-0">
                      ×{item.quantity} {item.optional ? '(Tùy chọn)' : ''}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onLoadKitToScene(kit)}
                className="w-full py-1.5 px-3 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-semibold rounded transition-colors"
              >
                Nạp toàn bộ Bộ thiết bị vào bàn Lab
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: 3D ENVIRONMENTS */}
      {activeTab === 'environments' && (
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
          {environments.map((env) => {
            const isCurrent = env.environmentId === activeEnvironmentId;
            return (
              <div
                key={env.environmentId}
                onClick={() => onSelectEnvironment(env.environmentId)}
                className={`p-3 rounded border transition-colors cursor-pointer space-y-1.5 ${
                  isCurrent
                    ? 'bg-slate-800/90 border-cyan-500/60'
                    : 'bg-[#0B0F17]/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-100">
                    {env.name.vi}
                  </span>
                  <Globe
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isCurrent ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  />
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {env.environmentId} · v{env.environmentVersion}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {env.description}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-sm border border-slate-600 inline-block"
                      style={{ backgroundColor: env.visualPreset.benchTopColorHex }}
                    />
                    <span className="text-slate-400">
                      Bàn {env.benchDimensionsM.width}m × {env.benchDimensionsM.depth}m
                    </span>
                  </div>
                  <span
                    className={
                      isCurrent
                        ? 'text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }
                  >
                    {isCurrent ? 'Đang kích hoạt' : 'Áp dụng môi trường'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
};
