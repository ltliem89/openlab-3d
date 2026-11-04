import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Box,
  Plus,
  GraduationCap,
  HelpCircle,
  Home,
  RotateCcw,
  RotateCw,
  Check,
  FlaskConical,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  BookOpen,
  FileCode,
  SlidersHorizontal,
  Download,
  Clock,
  X,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { StudentGuidedStepNumber } from '../student/StudentGuidedStepPanel';
import equipmentStandardMdRaw from '../../../docs/archive_reports/EQUIPMENT_MODULE_STANDARD.md?raw';

const downloadEquipmentStandardMd = () => {
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

export type UserRoleMode = 'student' | 'teacher';

export type StudentScreenId =
  | 'home'
  | 'explore-equipment'
  | 'lab-room'
  | 'my-kits';

export type NavSectionId =
  | 'overview'
  | 'library-3d'
  | 'lab-workspace'
  | 'kits'
  | 'environments'
  | 'governance';

export type HeaderProgressStep = 1 | 2 | 3 | 4;

interface TopNavBarProps {
  userRole: UserRoleMode;
  studentScreen: StudentScreenId;
  activeSection: NavSectionId;
  globalSearch: string;
  recentSearches?: string[];
  headerProgressStep?: HeaderProgressStep;
  studentGuidedStep?: StudentGuidedStepNumber;
  isDarkMode?: boolean;
  isLibraryOpen?: boolean;
  isGuideOpen?: boolean;
  isFullscreen?: boolean;
  onToggleDarkMode?: () => void;
  onToggleLibraryPanel?: () => void;
  onToggleGuidePanel?: () => void;
  onToggleFullscreen?: () => void;
  onChangeHeaderProgressStep?: (step: HeaderProgressStep) => void;
  onChangeGuidedStep?: (step: StudentGuidedStepNumber) => void;
  onResetLab?: () => void;
  onChangeUserRole: (role: UserRoleMode) => void;
  onSelectStudentScreen: (screen: StudentScreenId) => void;
  onOpenStudentHelp: () => void;
  onOpenHtmlModuleImporter?: () => void;
  onSelectSection: (section: NavSectionId) => void;
  onGlobalSearchChange: (value: string) => void;
  onCommitSearch?: (term: string) => void;
  onSelectRecentSearch?: (term: string) => void;
  onRemoveRecentSearch?: (term: string) => void;
  onClearRecentSearches?: () => void;
  onQuickAddSelectedAsset: () => void;
  notificationCount: number;
  recentLogs: Array<{ id: string; text: string; time: string }>;
}

const TEACHER_NAV_ITEMS: Array<{ id: NavSectionId; label: string }> = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'library-3d', label: 'Thư viện' },
  { id: 'lab-workspace', label: 'Phòng 3D' },
  { id: 'kits', label: 'Bộ dụng cụ' },
  { id: 'environments', label: 'Môi trường' },
  { id: 'governance', label: 'Kiểm định' },
];

const HEADER_FOUR_STEPS: Array<{ step: HeaderProgressStep; label: string }> = [
  { step: 1, label: 'Chọn' },
  { step: 2, label: 'Đặt bàn' },
  { step: 3, label: 'Thực hành' },
  { step: 4, label: 'Kết quả' },
];

const SUGGESTED_EQUIPMENT_TERMS = [
  'Cân điện tử',
  'Ống đong 100 ml',
  'Bình cấp nước',
  'Kính hiển vi',
  'Đèn Laser',
];

export const TopNavBar: React.FC<TopNavBarProps> = ({
  userRole,
  studentScreen,
  activeSection,
  globalSearch,
  recentSearches = [],
  headerProgressStep = 1,
  studentGuidedStep,
  isDarkMode = false,
  isLibraryOpen = true,
  isGuideOpen = true,
  isFullscreen = false,
  onToggleDarkMode,
  onToggleLibraryPanel,
  onToggleGuidePanel,
  onToggleFullscreen,
  onChangeHeaderProgressStep,
  onChangeGuidedStep,
  onResetLab,
  onChangeUserRole,
  onSelectStudentScreen,
  onOpenStudentHelp,
  onOpenHtmlModuleImporter,
  onSelectSection,
  onGlobalSearchChange,
  onCommitSearch,
  onSelectRecentSearch,
  onRemoveRecentSearch,
  onClearRecentSearches,
  onQuickAddSelectedAsset,
  notificationCount,
  recentLogs,
}) => {
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showMobileMenuPopover, setShowMobileMenuPopover] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const displayedRecentSearches = recentSearches.slice(0, 5);

  useEffect(() => {
    if (!showResetConfirmModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowResetConfirmModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResetConfirmModal]);

  const renderResetConfirmationModal = () => {
    if (!showResetConfirmModal) return null;
    return (
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={() => setShowResetConfirmModal(false)}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-workbench-dialog-title"
          aria-describedby="reset-workbench-dialog-desc"
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-[430px] rounded-[16px] border-[1.5px] backdrop-blur-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.65)] transition-all ${
            isDarkMode
              ? 'bg-[#081528]/82 border-[#38BDF8]/80 text-white'
              : 'bg-white/88 border-white ring-1 ring-[#1D63E8]/45 text-[#051630]'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-[12px] border flex items-center justify-center shrink-0 ${
                  isDarkMode
                    ? 'bg-amber-500/25 border-amber-400/80 text-amber-300'
                    : 'bg-amber-100 border-amber-500/70 text-amber-700'
                }`}
              >
                <AlertTriangle className="w-6 h-6 stroke-[2.4]" />
              </div>
              <div>
                <span
                  className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1 ${
                    isDarkMode
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                      : 'bg-amber-100/90 border-amber-500/60 text-amber-900'
                  }`}
                >
                  Xác nhận thao tác
                </span>
                <h2
                  id="reset-workbench-dialog-title"
                  className={`text-[17px] font-extrabold leading-snug ${
                    isDarkMode
                      ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                      : 'text-[#051630]'
                  }`}
                >
                  Đặt lại toàn bộ bàn thí nghiệm?
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowResetConfirmModal(false)}
              className={`w-8 h-8 rounded-[8px] border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-rose-600 border-white/25 text-white'
                  : 'bg-slate-100 hover:bg-rose-600 hover:text-white border-slate-300 text-[#051630]'
              }`}
              title="Đóng hộp thoại"
              aria-label="Đóng"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <p
            id="reset-workbench-dialog-desc"
            className={`mt-3.5 text-[13.5px] font-bold leading-relaxed ${
              isDarkMode ? 'text-slate-100' : 'text-[#1E3A5F]'
            }`}
          >
            Bạn có chắc chắn muốn xóa và đặt lại toàn bộ bàn thí nghiệm không? Tất cả dụng cụ vừa thêm, vị trí sắp xếp, lượng nước và kết quả đo hiện tại sẽ trở về trạng thái ban đầu.
          </p>

          <div
            className={`mt-4 pt-3.5 border-t flex items-center justify-end gap-2.5 ${
              isDarkMode ? 'border-white/20' : 'border-slate-300/80'
            }`}
          >
            <button
              type="button"
              onClick={() => setShowResetConfirmModal(false)}
              className={`px-4 py-2 rounded-[10px] border text-[13.5px] font-extrabold cursor-pointer transition-colors ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/20 border-white/30 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-[#051630]'
              }`}
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={() => {
                setShowResetConfirmModal(false);
                onResetLab?.();
              }}
              className="px-4 py-2 rounded-[10px] bg-rose-600 hover:bg-rose-700 border border-rose-300/80 text-white text-[13.5px] font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>Đồng ý đặt lại</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!isSearchDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isSearchDropdownOpen]);

  const handleApplyTerm = (term: string) => {
    const cleaned = term.trim();
    if (!cleaned) return;
    if (onSelectRecentSearch) {
      onSelectRecentSearch(cleaned);
    } else {
      onGlobalSearchChange(cleaned);
      onCommitSearch?.(cleaned);
    }
    setIsSearchDropdownOpen(false);
  };

  const renderTopSearchBarWithRecent = (compactMode: boolean) => (
    <div
      ref={searchContainerRef}
      className={`relative ${
        compactMode
          ? 'w-[148px] sm:w-[196px] xl:w-[236px] shrink-0'
          : 'w-full max-w-xs'
      }`}
    >
      <Search className="w-4 h-4 text-[#7DD3FC] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={globalSearch}
        onFocus={() => setIsSearchDropdownOpen(true)}
        onClick={() => setIsSearchDropdownOpen(true)}
        onChange={(e) => {
          onGlobalSearchChange(e.target.value);
          if (!isSearchDropdownOpen) setIsSearchDropdownOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (globalSearch.trim()) {
              onCommitSearch?.(globalSearch.trim());
            }
            setIsSearchDropdownOpen(false);
          } else if (e.key === 'Escape') {
            setIsSearchDropdownOpen(false);
          }
        }}
        onBlur={() => {
          if (globalSearch.trim().length >= 2) {
            onCommitSearch?.(globalSearch.trim());
          }
        }}
        placeholder={compactMode ? 'Tìm dụng cụ...' : 'Tìm dụng cụ, thiết bị...'}
        aria-label="Tìm kiếm thiết bị thí nghiệm"
        className={`w-full bg-[#103870] border-[1.5px] border-[#38BDF8]/70 focus:border-[#00BCEB] rounded-[9px] pl-8 pr-7 text-white font-bold placeholder:text-[#B8D4FF] placeholder:font-semibold focus:outline-none transition-colors shadow-inner ${
          compactMode ? 'h-9 text-[13.5px]' : 'py-1.5 text-[14px]'
        }`}
      />
      {globalSearch ? (
        <button
          type="button"
          onClick={() => {
            onGlobalSearchChange('');
            setIsSearchDropdownOpen(true);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/15 hover:bg-rose-500 text-white flex items-center justify-center cursor-pointer transition-colors"
          title="Xóa từ khóa đang nhập"
          aria-label="Xóa từ khóa"
        >
          <X className="w-3 h-3 stroke-[2.8]" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsSearchDropdownOpen((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full hover:bg-white/15 text-[#7DD3FC] flex items-center justify-center cursor-pointer transition-colors"
          title="Xem 5 tìm kiếm gần đây (Recent Searches)"
          aria-label="Lịch sử tìm kiếm gần đây"
        >
          <Clock className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Cửa sổ Pop-up 'Tìm kiếm gần đây' (5 từ khóa gần nhất) — Glassmorphism nhìn xuyên thấu + Chữ đậm rõ */}
      {isSearchDropdownOpen && (
        <div
          role="listbox"
          aria-label="Tìm kiếm gần đây (Recent Searches)"
          className={`absolute left-0 right-0 sm:w-[300px] mt-1.5 rounded-[13px] border-[1.5px] backdrop-blur-2xl p-2.5 z-50 select-none ${
            isDarkMode
              ? 'bg-[#081528]/65 border-[#38BDF8]/85 text-white shadow-[0_16px_42px_rgba(0,0,0,0.68)]'
              : 'bg-white/68 border-white/90 ring-1 ring-[#1D63E8]/45 text-[#051630] shadow-[0_16px_42px_rgba(9,30,58,0.32)]'
          }`}
        >
          <div
            className={`flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b ${
              isDarkMode ? 'border-white/25' : 'border-[#7DA4D9]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Clock
                className={`w-3.5 h-3.5 shrink-0 ${
                  isDarkMode ? 'text-[#38BDF8]' : 'text-[#1557D6]'
                }`}
              />
              <span
                className={`text-[11.5px] font-extrabold uppercase tracking-wider ${
                  isDarkMode
                    ? 'text-[#7DD3FC] drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]'
                    : 'text-[#07224D]'
                }`}
              >
                Tìm kiếm gần đây ({displayedRecentSearches.length}/5)
              </span>
            </div>

            {displayedRecentSearches.length > 0 && onClearRecentSearches && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onClearRecentSearches()}
                className={`px-2 py-0.5 rounded-[6px] text-[11px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors border ${
                  isDarkMode
                    ? 'bg-rose-500/25 hover:bg-rose-500/45 border-rose-400/70 text-rose-100'
                    : 'bg-rose-100/85 hover:bg-rose-200 border-rose-600/60 text-[#881337]'
                }`}
                title="Xóa toàn bộ lịch sử tìm kiếm gần đây"
              >
                <Trash2 className="w-3 h-3" />
                <span>Xóa hết</span>
              </button>
            )}
          </div>

          {displayedRecentSearches.length > 0 ? (
            <div className="space-y-1">
              {displayedRecentSearches.map((term, idx) => (
                <div
                  key={`${term}-${idx}`}
                  className={`group flex items-center justify-between gap-1.5 rounded-[8px] px-2.5 py-1.5 border transition-colors ${
                    isDarkMode
                      ? 'bg-slate-950/45 hover:bg-[#1E6BFF]/55 border-white/20 hover:border-[#38BDF8]'
                      : 'bg-white/60 hover:bg-[#DCE8F8]/90 border-[#9BB8DC] hover:border-[#1D63E8]'
                  }`}
                >
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleApplyTerm(term)}
                    className="flex-1 flex items-center gap-2 text-left min-w-0 cursor-pointer"
                  >
                    <Clock
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isDarkMode ? 'text-[#38BDF8]' : 'text-[#1557D6]'
                      }`}
                    />
                    <span
                      className={`text-[13.5px] font-extrabold truncate ${
                        isDarkMode
                          ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]'
                          : 'text-[#051630]'
                      }`}
                    >
                      {term}
                    </span>
                  </button>

                  {onRemoveRecentSearch && (
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveRecentSearch(term);
                      }}
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                        isDarkMode
                          ? 'text-slate-200 hover:bg-rose-600 hover:text-white'
                          : 'text-[#1E3A5F] hover:bg-rose-600 hover:text-white'
                      }`}
                      title={`Xóa "${term}" khỏi lịch sử`}
                      aria-label={`Xóa ${term}`}
                    >
                      <X className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-1.5 space-y-2">
              <p
                className={`text-[12px] font-bold ${
                  isDarkMode ? 'text-slate-200' : 'text-[#1E3A5F]'
                }`}
              >
                Chưa có từ khóa gần đây. Chọn nhanh thiết bị mẫu:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_EQUIPMENT_TERMS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleApplyTerm(item)}
                    className={`px-2 py-1 rounded-[7px] text-[12px] font-extrabold border cursor-pointer transition-colors ${
                      isDarkMode
                        ? 'bg-slate-900/60 hover:bg-[#1E6BFF] border-white/30 text-white'
                        : 'bg-white/75 hover:bg-[#1D63E8] hover:text-white border-[#7DA4D9] text-[#051630]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const currentGuidedStep = studentGuidedStep ?? (headerProgressStep as any) ?? 1;
  const maxGuidedSteps = 5;

  const handleStepBack = () => {
    if (onChangeGuidedStep) {
      const prev = Math.max(1, currentGuidedStep - 1) as StudentGuidedStepNumber;
      onChangeGuidedStep(prev);
    } else if (onChangeHeaderProgressStep) {
      const prev = Math.max(1, Math.min(4, currentGuidedStep - 1)) as HeaderProgressStep;
      onChangeHeaderProgressStep(prev);
    }
  };

  const handleStepForward = () => {
    if (onChangeGuidedStep) {
      const next = Math.min(maxGuidedSteps, currentGuidedStep + 1) as StudentGuidedStepNumber;
      onChangeGuidedStep(next);
    } else if (onChangeHeaderProgressStep) {
      const next = Math.min(4, currentGuidedStep + 1) as HeaderProgressStep;
      onChangeHeaderProgressStep(next);
    }
  };

  const STEP_TITLES: Record<number, string> = {
    1: '1. Chuẩn bị',
    2: '2. Cân khối lượng m',
    3: '3. Đo thể tích V₁',
    4: '4. Thả chìm đo V₂',
    5: '5. Tính khối lượng riêng D',
  };

  // STUDENT MODE HEADER — Sleek, compact icon-driven top bar to maximize 3D simulation viewport
  if (userRole === 'student') {
    return (
      <header
        className={`h-[50px] md:h-[54px] px-2.5 sm:px-4 border-b flex items-center justify-between gap-2 shrink-0 z-30 shadow-xs select-none transition-colors min-w-0 ${
          isDarkMode
            ? 'bg-[#081224] border-[#1E3252]'
            : 'bg-[#092B5E] border-[#164384]'
        }`}
      >
        {/* Left: Compact Logo OpenLab 3D + Top Quick Equipment Search Bar */}
        <div className="flex items-center gap-2.5 min-w-0 shrink-0">
          <button
            type="button"
            onClick={() => onSelectStudentScreen('lab-room')}
            className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 focus:outline-none cursor-pointer min-w-0"
            title="Về bàn thí nghiệm 3D"
          >
            <div className="w-8 h-8 md:w-8.5 md:h-8.5 rounded-[8px] bg-[#1E6BFF] border border-[#00BCEB] text-white flex items-center justify-center shadow-xs shrink-0">
              <FlaskConical className="w-4 h-4 md:w-4.5 md:h-4.5" />
            </div>
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-[17px] sm:text-[19px] leading-none font-extrabold tracking-tight text-white truncate">
                OpenLab <span className="text-[#00BCEB]">3D</span>
              </span>
              <span className="hidden 2xl:inline text-[12.5px] font-semibold text-[#B8D4FF]">
                KHTN 9
              </span>
            </div>
          </button>

          {/* Top Search Bar with 5 Recent Searches (Visible on sm+ in Student Mode) */}
          <div className="hidden sm:block">
            {renderTopSearchBarWithRecent(true)}
          </div>
        </div>

        {/* CỤM NÚT ĐIỀU HƯỚNG BƯỚC THỰC HÀNH 3/4 HÌNH TRÒN CÓ MŨI TÊN (RotateCcw & RotateCw) */}
        <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-[10px] bg-[#0c244b]/80 border border-[#275AA3] shadow-inner shrink-0">
          <button
            type="button"
            onClick={handleStepBack}
            disabled={currentGuidedStep <= 1}
            className={`w-7 h-7 rounded-[6px] flex items-center justify-center transition-all ${
              currentGuidedStep <= 1
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'hover:bg-[#1E6BFF] text-[#00BCEB] hover:text-white cursor-pointer active:scale-95 shadow-xs'
            }`}
            title="Quay về bước trước (⟲)"
            aria-label="Quay về bước trước"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.4]" />
          </button>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[5px] bg-[#071936] text-[12px] font-extrabold border border-[#1E4D8C]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#00BCEB] font-mono whitespace-nowrap">
              BƯỚC {currentGuidedStep}/{maxGuidedSteps}
            </span>
            <span className="hidden xl:inline text-[#B8D4FF] font-semibold text-[11.5px] border-l border-white/20 pl-1.5 whitespace-nowrap">
              {STEP_TITLES[currentGuidedStep] ?? ''}
            </span>
          </div>

          <button
            type="button"
            onClick={handleStepForward}
            disabled={currentGuidedStep >= maxGuidedSteps}
            className={`w-7 h-7 rounded-[6px] flex items-center justify-center transition-all ${
              currentGuidedStep >= maxGuidedSteps
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'hover:bg-[#1E6BFF] text-[#00BCEB] hover:text-white cursor-pointer active:scale-95 shadow-xs'
            }`}
            title="Tiến tới bước tiếp theo (⟳)"
            aria-label="Tiến tới bước tiếp theo"
          >
            <RotateCw className="w-4 h-4 stroke-[2.4]" />
          </button>
        </div>

        {/* MOBILE ACTION BAR (< 768px): Các nút mở/ẩn danh mục, hướng dẫn và menu công cụ màu đỏ thu gọn */}
        <div className="flex md:hidden items-center gap-1 shrink-0 relative">
          <button
            type="button"
            onClick={() => {
              if (studentScreen !== 'lab-room' && studentScreen !== 'explore-equipment') {
                onSelectStudentScreen('lab-room');
              }
              if (onToggleLibraryPanel) {
                onToggleLibraryPanel();
              } else {
                onOpenHtmlModuleImporter?.();
              }
            }}
            className="px-2.5 h-8 rounded-[7px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[12px] font-extrabold flex items-center gap-1 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            title={isLibraryOpen ? 'Ẩn danh mục thiết bị' : 'Mở danh mục thiết bị'}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
            <span>{isLibraryOpen ? 'Ẩn' : 'Thêm thiết bị'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (
                (studentScreen === 'lab-room' ||
                  studentScreen === 'explore-equipment') &&
                onToggleGuidePanel
              ) {
                onToggleGuidePanel();
              } else {
                onOpenStudentHelp();
              }
            }}
            className="px-2 h-8 rounded-[7px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[12px] font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
            title={isGuideOpen ? 'Ẩn Hướng dẫn' : 'Mở Hướng dẫn'}
            aria-label={isGuideOpen ? 'Ẩn Hướng dẫn' : 'Mở Hướng dẫn'}
          >
            <BookOpen className="w-3.5 h-3.5 text-white" />
            <span>{isGuideOpen ? 'Ẩn' : 'HD'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMobileMenuPopover((v) => !v)}
            className="w-8 h-8 rounded-[7px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            title={showMobileMenuPopover ? 'Ẩn Menu công cụ' : 'Mở Menu công cụ'}
            aria-label="Menu công cụ"
          >
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </button>

          {showMobileMenuPopover && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMobileMenuPopover(false)}
              />
              <div
                className={`fixed right-2 top-[54px] z-50 w-[268px] rounded-[13px] border-[1.5px] backdrop-blur-2xl p-2.5 shadow-[0_16px_42px_rgba(0,0,0,0.58)] space-y-1 ${
                  isDarkMode
                    ? 'bg-[#081528]/68 border-[#38BDF8]/80 text-white'
                    : 'bg-white/68 border-white/90 ring-1 ring-[#1D63E8]/40 text-[#051630]'
                }`}
              >
                <div
                  className={`px-2.5 py-1.5 border-b text-[12px] font-extrabold uppercase tracking-wider flex items-center justify-between ${
                    isDarkMode
                      ? 'border-white/25 text-[#7DD3FC]'
                      : 'border-[#7DA4D9] text-[#0B3A7D]'
                  }`}
                >
                  <span>Menu Công Cụ & Hệ Thống</span>
                  <button
                    type="button"
                    onClick={() => setShowMobileMenuPopover(false)}
                    className="h-6 px-2 rounded-[5px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[11px] font-extrabold flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Ẩn</span>
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {onOpenHtmlModuleImporter && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMenuPopover(false);
                      onOpenHtmlModuleImporter();
                    }}
                    className="w-full min-h-[44px] px-3 py-2 rounded-[9px] bg-[#059669] hover:bg-[#047857] text-white text-[14px] font-extrabold flex items-center gap-2.5 cursor-pointer"
                  >
                    <FileCode className="w-4 h-4 shrink-0" />
                    <span>Nạp Module Thiết Bị (.HTML)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenuPopover(false);
                    downloadEquipmentStandardMd();
                  }}
                  className="w-full min-h-[44px] px-3 py-2 rounded-[9px] bg-[#D97706] hover:bg-[#B45309] text-white text-[14px] font-extrabold flex items-center gap-2.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>.MD</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenuPopover(false);
                    setShowResetConfirmModal(true);
                  }}
                  className={`w-full min-h-[44px] px-3 py-2 rounded-[9px] text-left text-[14px] font-extrabold flex items-center gap-2.5 cursor-pointer ${
                    isDarkMode ? 'hover:bg-white/15 text-white' : 'hover:bg-white/80 text-[#051630]'
                  }`}
                >
                  <RotateCcw className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>Đặt lại bàn thí nghiệm</span>
                </button>

                {onToggleDarkMode && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMenuPopover(false);
                      onToggleDarkMode();
                    }}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-[9px] text-left text-[14px] font-extrabold flex items-center gap-2.5 cursor-pointer ${
                      isDarkMode ? 'hover:bg-white/15 text-white' : 'hover:bg-white/80 text-[#051630]'
                    }`}
                  >
                    {isDarkMode ? (
                      <Sun className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    ) : (
                      <Moon className="w-4 h-4 text-[#1557D6] shrink-0" />
                    )}
                    <span>{isDarkMode ? 'Chuyển Giao diện Sáng' : 'Chuyển Giao diện Tối'}</span>
                  </button>
                )}

                {onToggleFullscreen && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobileMenuPopover(false);
                      onToggleFullscreen();
                    }}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-[9px] text-left text-[14px] font-extrabold flex items-center gap-2.5 cursor-pointer ${
                      isDarkMode ? 'hover:bg-white/15 text-white' : 'hover:bg-white/80 text-[#051630]'
                    }`}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4 text-[#1557D6] shrink-0" />
                    ) : (
                      <Maximize2 className="w-4 h-4 text-[#1557D6] shrink-0" />
                    )}
                    <span>{isFullscreen ? 'Thu nhỏ màn hình' : 'Phóng to toàn màn hình'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenuPopover(false);
                    onOpenStudentHelp();
                  }}
                  className={`w-full min-h-[44px] px-3 py-2 rounded-[9px] text-left text-[14px] font-extrabold flex items-center gap-2.5 cursor-pointer ${
                    isDarkMode ? 'hover:bg-white/15 text-white' : 'hover:bg-white/80 text-[#051630]'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-[#1557D6] shrink-0" />
                  <span>Trợ giúp thao tác</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenuPopover(false);
                    onSelectStudentScreen(
                      studentScreen === 'home' ? 'lab-room' : 'home',
                    );
                  }}
                  className={`w-full min-h-[44px] px-3 py-2 rounded-[9px] text-left text-[14px] font-extrabold flex items-center gap-2.5 cursor-pointer ${
                    isDarkMode ? 'hover:bg-white/15 text-white' : 'hover:bg-white/80 text-[#051630]'
                  }`}
                >
                  <Home className="w-4 h-4 text-[#1E6BFF] shrink-0" />
                  <span>{studentScreen === 'home' ? 'Vào phòng 3D' : 'Về Trang chủ'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenuPopover(false);
                    onChangeUserRole('teacher');
                  }}
                  className={`w-full min-h-[44px] px-3 py-2 rounded-[9px] text-left text-[14px] font-extrabold flex items-center gap-2.5 border-t pt-2.5 cursor-pointer ${
                    isDarkMode
                      ? 'border-white/25 text-[#7DD3FC] hover:bg-white/15'
                      : 'border-[#7DA4D9] text-[#0B3A7D] hover:bg-white/80'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#1557D6] shrink-0" />
                  <span>Chế độ Kỹ thuật & Quản trị</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* DESKTOP ACTION BAR (md+ >= 768px) */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          {/* Nút Tải ngay file chuẩn EQUIPMENT_MODULE_STANDARD.md (v2.4) — Chỉ hiển thị '.MD' */}
          <button
            type="button"
            onClick={downloadEquipmentStandardMd}
            className="px-2.5 h-8 rounded-[7px] bg-[#D97706] hover:bg-[#B45309] border border-[#FBBF24] text-white text-[13px] font-extrabold flex items-center justify-center shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            title="Tải file chuẩn EQUIPMENT_MODULE_STANDARD.md (v2.4) về máy tính"
          >
            <span>.MD</span>
          </button>

          {/* Nút mở/ẩn bảng Hướng dẫn thí nghiệm — Nền đỏ thu gọn */}
          <button
            type="button"
            onClick={() => {
              if (
                (studentScreen === 'lab-room' ||
                  studentScreen === 'explore-equipment') &&
                onToggleGuidePanel
              ) {
                onToggleGuidePanel();
              } else {
                onOpenStudentHelp();
              }
            }}
            className="px-2 h-8 rounded-[7px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white flex items-center gap-1 text-[12.5px] font-extrabold transition-colors cursor-pointer shadow-xs"
            title={isGuideOpen ? 'Ẩn Hướng dẫn' : 'Mở Hướng dẫn'}
            aria-label={isGuideOpen ? 'Ẩn Hướng dẫn' : 'Mở Hướng dẫn'}
          >
            <BookOpen className="w-3.5 h-3.5 text-white shrink-0" />
            <span>{isGuideOpen ? 'Ẩn HD' : 'Mở HD'}</span>
          </button>

          {/* Icon phóng to toàn màn hình vùng thí nghiệm */}
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className={`w-9 h-9 rounded-[8px] border flex items-center justify-center transition-colors cursor-pointer ${
                isFullscreen
                  ? 'bg-[#00BCEB] text-[#081224] border-white font-bold'
                  : 'bg-[#133F7E] hover:bg-[#1952A3] border-[#275AA3] text-white'
              }`}
              title={isFullscreen ? 'Thu nhỏ (Esc)' : 'Toàn màn hình'}
              aria-label={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4 text-[#00BCEB]" />
              )}
            </button>
          )}

          {/* Icon chuyển đổi Giao diện Tối / Sáng */}
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className={`w-9 h-9 rounded-[8px] border flex items-center justify-center transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1E293B] hover:bg-[#334155] border-[#00BCEB] text-[#FFC83D]'
                  : 'bg-[#133F7E] hover:bg-[#1952A3] border-[#275AA3] text-white'
              }`}
              title={isDarkMode ? 'Giao diện Sáng' : 'Giao diện Tối'}
              aria-label="Sáng / Tối"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#FFC83D]" />
              ) : (
                <Moon className="w-4 h-4 text-[#00BCEB]" />
              )}
            </button>
          )}

          {/* Icon Trợ giúp nhanh */}
          <button
            type="button"
            onClick={onOpenStudentHelp}
            className="w-9 h-9 rounded-[8px] bg-[#133F7E] hover:bg-[#1952A3] border border-[#275AA3] text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Trợ giúp"
            aria-label="Trợ giúp"
          >
            <HelpCircle className="w-4 h-4 text-[#00BCEB]" />
          </button>

          {/* Icon Làm lại bàn thí nghiệm (Có hộp thoại xác nhận chống mất tiến trình) */}
          <button
            type="button"
            onClick={() => setShowResetConfirmModal(true)}
            className="w-9 h-9 rounded-[8px] bg-[#133F7E] hover:bg-[#1952A3] border border-[#275AA3] text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Đặt lại bàn thí nghiệm"
            aria-label="Đặt lại bàn thí nghiệm"
          >
            <RotateCcw className="w-4 h-4 text-[#FFC83D]" />
          </button>

          {/* Icon Trang chủ */}
          <button
            type="button"
            onClick={() =>
              onSelectStudentScreen(
                studentScreen === 'home' ? 'lab-room' : 'home',
              )
            }
            className={`w-9 h-9 rounded-[8px] flex items-center justify-center transition-colors border cursor-pointer ${
              studentScreen === 'home'
                ? 'bg-[#1E6BFF] text-white border-[#00BCEB]'
                : isDarkMode
                  ? 'bg-[#1A273D] text-white border-[#2E476B] hover:bg-[#243552]'
                  : 'bg-[#F2F6FB] text-[#092B5E] border-[#C4D5E8] hover:bg-white'
            }`}
            title={studentScreen === 'home' ? 'Vào phòng 3D' : 'Trang chủ'}
            aria-label="Trang chủ"
          >
            <Home className="w-4 h-4 text-[#1E6BFF]" />
          </button>

          {/* Chuyển sang Chế độ Giáo viên / Kỹ thuật */}
          <button
            type="button"
            onClick={() => onChangeUserRole('teacher')}
            className="hidden sm:flex px-2.5 h-9 rounded-[8px] bg-[#10366E] hover:bg-[#1952A3] border border-[#275AA3] text-[#B8D4FF] hover:text-white text-[13.5px] font-bold items-center gap-1.5 transition-colors cursor-pointer"
            title="Chế độ Kỹ thuật & Quản trị"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#00BCEB]" />
            <span className="hidden md:inline">Kỹ thuật</span>
          </button>
        </div>
        {renderResetConfirmationModal()}
      </header>
    );
  }

  // TEACHER / ADMIN MODE HEADER
  return (
    <header className="h-[60px] px-5 bg-[#092B5E] border-b border-[#164384] flex items-center justify-between gap-5 shrink-0 z-30">
      <button
        type="button"
        onClick={() => onSelectSection('lab-workspace')}
        className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus:outline-none"
      >
        <div className="w-9 h-9 rounded-lg bg-[#1E6BFF] border border-[#00BCEB] flex items-center justify-center text-white">
          <Box className="w-5 h-5" />
        </div>
        <span className="text-[20px] font-extrabold tracking-tight text-white">
          OpenLab 3D <span className="text-[13px] font-semibold text-[#B8D4FF]">Quản trị</span>
        </span>
      </button>

      <div className="flex items-center gap-5 flex-1 justify-center min-w-0">
        <nav className="hidden xl:flex items-center gap-5 text-[15px] font-bold">
          {TEACHER_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={`py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                  isActive
                    ? 'text-[#00BCEB] border-[#00BCEB] font-extrabold'
                    : 'text-[#C8DFFF] border-transparent hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Top Search Bar with 5 Recent Searches in Teacher Mode */}
        {renderTopSearchBarWithRecent(false)}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={downloadEquipmentStandardMd}
          className="px-3 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] border border-[#FBBF24] text-[14px] font-extrabold text-white flex items-center justify-center transition-colors whitespace-nowrap cursor-pointer"
          title="Tải file chuẩn EQUIPMENT_MODULE_STANDARD.md (v2.4) về máy tính"
        >
          <span>.MD</span>
        </button>

        {onOpenHtmlModuleImporter && (
          <button
            type="button"
            onClick={onOpenHtmlModuleImporter}
            className="px-3.5 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] border border-[#34D399] text-[14px] font-extrabold text-white flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            title="Thêm thiết bị mới hoặc nạp file .HTML"
          >
            <Plus className="w-4 h-4 stroke-[2.8]" />
            <span>Thêm thiết bị (.HTML)</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onChangeUserRole('student')}
          className="px-3.5 py-2 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] text-[14px] font-extrabold text-white flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Học sinh</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifPopover((v) => !v)}
            className="px-3 py-2 rounded-lg bg-[#133F7E] hover:bg-[#1952A3] border border-[#275AA3] text-[14px] text-white font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Bell className="w-4 h-4 text-[#00BCEB]" />
            <span className="font-mono tabular-nums">{notificationCount}</span>
          </button>

          {showNotifPopover && (
            <div className="absolute right-0 mt-2 w-84 bg-white/72 backdrop-blur-2xl border-[1.5px] border-white/90 ring-1 ring-[#1D63E8]/45 rounded-[13px] shadow-[0_16px_42px_rgba(9,30,58,0.35)] p-3.5 z-50 text-[#051630]">
              <div className="flex items-center justify-between pb-2 border-b border-[#7DA4D9]">
                <span className="text-[15px] font-extrabold text-[#051630]">
                  Nhật ký hoạt động ({recentLogs.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowNotifPopover(false)}
                  className="px-2 py-0.5 rounded bg-white/80 hover:bg-rose-600 hover:text-white border border-[#7DA4D9] text-[12.5px] font-extrabold text-[#051630] cursor-pointer transition-colors"
                >
                  Đóng
                </button>
              </div>
              <div className="mt-2 max-h-60 overflow-y-auto space-y-2">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="text-[13px] font-bold text-[#051630] bg-white/60 rounded-[8px] border border-[#9BB8DC] p-2"
                  >
                    <p>{log.text}</p>
                    <p className="text-[11.5px] font-mono font-extrabold text-[#1557D6] mt-0.5">
                      {log.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowResetConfirmModal(true)}
          className="px-3 py-2 rounded-lg bg-[#133F7E] hover:bg-[#1952A3] border border-[#275AA3] text-[14px] font-extrabold text-white flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
          title="Đặt lại bàn thí nghiệm"
          aria-label="Đặt lại bàn thí nghiệm"
        >
          <RotateCcw className="w-4 h-4 text-[#FFC83D]" />
          <span className="hidden 2xl:inline">Đặt lại</span>
        </button>

        <button
          type="button"
          onClick={onQuickAddSelectedAsset}
          className="px-3.5 py-2 text-[14px] font-extrabold text-white bg-[#1E6BFF] hover:bg-[#1557D6] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Đặt lên bàn</span>
        </button>
      </div>
      {renderResetConfirmationModal()}
    </header>
  );
};
