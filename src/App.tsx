import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  AssetDefinition,
  EquipmentCategoryId,
  EquipmentKit,
  LabScene,
  SceneInstance,
  ScienceSubject,
  VerificationStatus,
} from './domain/types';
import {
  equipmentRepository,
  kitRepository,
  environmentRepository,
  experimentRepository,
  sceneRepository,
} from './repositories/CatalogRepository';
import {
  TopNavBar,
  NavSectionId,
  UserRoleMode,
  StudentScreenId,
  HeaderProgressStep,
} from './components/navigation/TopNavBar';
import {
  AssetExplorerPanel,
  ExplorerTabId,
} from './components/panels/AssetExplorerPanel';
import { SceneHierarchyPanel } from './components/panels/SceneHierarchyPanel';
import { InspectorPanel } from './components/panels/InspectorPanel';
import { BottomWorkspaceTray } from './components/panels/BottomWorkspaceTray';
import {
  LabViewport3D,
  PhysicalDockTargetSlot,
  QuickLabActionType,
  TransformToolMode,
  ViewportDisplayMode,
} from './three-runtime/LabViewport3D';
import { StudentHomeView } from './components/student/StudentHomeView';
import { StudentEquipmentSidebar } from './components/student/StudentEquipmentSidebar';
import {
  StudentGuidedStepPanel,
  StudentGuidedStepNumber,
} from './components/student/StudentGuidedStepPanel';
import { StudentBottomPanelsRow } from './components/student/StudentBottomPanelsRow';
import { RichMathText } from './components/common/MathFormula';
import {
  StudentKitsView,
  StudentHelpModal,
  StudentVideoGuideModal,
  StudentEquipmentDetailModal,
} from './components/student/StudentModalsAndSubViews';
import { MicroscopeSimulationModal } from './components/microscope/MicroscopeSimulationModal';
import { NeuralDeviceNetworkModal } from './components/modals/NeuralDeviceNetworkModal';
import {
  SocraticTutorModal,
  MicroMacroLensModal,
  SaveProjectModal,
  OpenProjectModal,
} from './components/modals';
import { projectStorage, SavedProject } from './domain/projectStorage';
import { neuralConnectionEngine } from './domain/neuralConnectionEngine';
import {
  EquipmentPreviewPanel,
  EquipmentRealPhotoUpdaterModal,
} from './components/common/EquipmentPreviewPanel';
import { equipmentImagePreviewController } from './three-runtime/EquipmentImagePreviewController';
import { htmlEquipmentModuleRegistry } from './three-runtime/HtmlEquipmentModuleRegistry';
import { openLabAssetLoader } from './three-runtime/AssetLoader';
import { labSoundEngine } from './three-runtime/LabSoundEngine';
import {
  assemblyGraph,
  AssemblyRelationType,
  solveElectricalCircuit,
} from './three-runtime/AssemblySystem';
import { ChevronRight, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface ToastNotification {
  id: string;
  message: string;
  tone: 'info' | 'success' | 'warning' | 'error';
}

export default function App() {
  // 0. User Role, Theme, Guide Visibility & Student Screen State
  const [userRole, setUserRole] = useState<UserRoleMode>('student');
  const [studentScreen, setStudentScreen] = useState<StudentScreenId>('lab-room');
  const [studentGuidedStep, setStudentGuidedStep] =
    useState<StudentGuidedStepNumber>(1);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isStudentGuideOpen, setIsStudentGuideOpen] = useState<boolean>(false);
  const [showStudentHelpModal, setShowStudentHelpModal] = useState<boolean>(false);
  const [showVideoGuideModal, setShowVideoGuideModal] = useState<boolean>(false);
  const [moduleRegistryRevision, setModuleRegistryRevision] = useState<number>(0);
  const [studentDetailModalAsset, setStudentDetailModalAsset] =
    useState<AssetDefinition | null>(null);
  const [detailModalEditMode, setDetailModalEditMode] = useState<boolean>(false);
  const [photoUpdaterTargetAsset, setPhotoUpdaterTargetAsset] =
    useState<AssetDefinition | null>(null);
  const [showMicroscopeModal, setShowMicroscopeModal] = useState<boolean>(false);

  // Trạng thái Trợ lý Nơ-ron Thần kinh (Bật/Tắt hướng dẫn thao tác & tia liên kết 3D)
  const [isNeuralGuideEnabled, setIsNeuralGuideEnabled] = useState<boolean>(
    () => neuralConnectionEngine.isGuideEnabled,
  );
  const [showNeuralNetworkModal, setShowNeuralNetworkModal] = useState<boolean>(false);
  const [neuralModalTargetDeviceId, setNeuralModalTargetDeviceId] = useState<string | null>(null);
  const [showMicroMacroModal, setShowMicroMacroModal] = useState<boolean>(false);
  const [showSaveProjectModal, setShowSaveProjectModal] = useState<boolean>(false);
  const [showOpenProjectModal, setShowOpenProjectModal] = useState<boolean>(false);
  const [savedProjectsCount, setSavedProjectsCount] = useState<number>(() => projectStorage.getCount());

  useEffect(() => {
    const handleOpenMic = () => setShowMicroscopeModal(true);
    window.addEventListener('openlab:open-microscope', handleOpenMic);
    return () =>
      window.removeEventListener('openlab:open-microscope', handleOpenMic);
  }, []);

  useEffect(() => {
    const handleOpenNeural = (e?: any) => {
      if (e?.detail?.deviceId) {
        setNeuralModalTargetDeviceId(e.detail.deviceId);
      } else {
        setNeuralModalTargetDeviceId(null);
      }
      setShowNeuralNetworkModal(true);
    };
    const handleGuideToggle = (e: any) => {
      if (typeof e?.detail?.enabled === 'boolean') {
        setIsNeuralGuideEnabled(e.detail.enabled);
      }
    };
    window.addEventListener('openlab:open-neural-modal', handleOpenNeural);
    window.addEventListener('openlab:neural-guide-toggle', handleGuideToggle);
    return () => {
      window.removeEventListener('openlab:open-neural-modal', handleOpenNeural);
      window.removeEventListener('openlab:neural-guide-toggle', handleGuideToggle);
    };
  }, []);

  // Tự động đồng bộ khi các module từ thư viện ổ cứng C:\Users\ltlie\Documents\libraries3DLab được nạp/cập nhật
  useEffect(() => {
    const unsub = htmlEquipmentModuleRegistry.subscribe(() => {
      openLabAssetLoader.clearAllCache();
      setModuleRegistryRevision((r) => r + 1);
      setScene((prev) => ({
        ...prev,
        sceneRevision: prev.sceneRevision + 1,
      }));
    });
    return unsub;
  }, []);

  // Student Experiment Measurement Data for "Bảng kết quả"
  const [measuredMassG, setMeasuredMassG] = useState<number | null>(null);
  const [initialVolumeCm3, setInitialVolumeCm3] = useState<number>(50.0);
  const [finalVolumeCm3, setFinalVolumeCm3] = useState<number | null>(null);

  const objectVolumeCm3 = useMemo(() => {
    if (finalVolumeCm3 === null) return null;
    return Number((finalVolumeCm3 - initialVolumeCm3).toFixed(1));
  }, [finalVolumeCm3, initialVolumeCm3]);

  const densityGCm3 = useMemo(() => {
    if (
      measuredMassG !== null &&
      objectVolumeCm3 !== null &&
      objectVolumeCm3 > 0 &&
      studentGuidedStep >= 4
    ) {
      return Number((measuredMassG / objectVolumeCm3).toFixed(2));
    }
    if (measuredMassG !== null && objectVolumeCm3 !== null && objectVolumeCm3 > 0) {
      return Number((measuredMassG / objectVolumeCm3).toFixed(2));
    }
    return null;
  }, [measuredMassG, objectVolumeCm3, studentGuidedStep]);

  // Map 5 right-panel steps to the 4 header progress steps
  const headerProgressStep: HeaderProgressStep = useMemo(() => {
    if (studentGuidedStep === 1) return 1;
    if (studentGuidedStep === 2) return 2;
    if (studentGuidedStep === 3 || studentGuidedStep === 4) return 3;
    return 4;
  }, [studentGuidedStep]);

  // 1. Catalog Filter & Selection State + Recent Searches (5 most recent queries)
  const [activeNavSection, setActiveNavSection] =
    useState<NavSectionId>('lab-workspace');
  const [explorerTab, setExplorerTab] = useState<ExplorerTabId>('equipment');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const defaultRecent = [
      'Bình cấp nước',
      'Cân điện tử',
      'Ống đong 100 ml',
      'Kính hiển vi',
      'Đèn Laser',
    ];
    if (typeof window === 'undefined') return defaultRecent;
    try {
      const saved = window.localStorage.getItem(
        'ol3d_recent_equipment_searches_v1',
      );
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            .slice(0, 5);
        }
      }
    } catch {
      // Ignore storage errors
    }
    return defaultRecent;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        'ol3d_recent_equipment_searches_v1',
        JSON.stringify(recentSearches.slice(0, 5)),
      );
    } catch {
      // Ignore storage errors
    }
  }, [recentSearches]);

  const handleRecordRecentSearch = useCallback((rawTerm: string) => {
    const term = rawTerm.trim();
    if (!term) return;
    setRecentSearches((prev) => {
      const deduplicated = prev.filter(
        (existing) => existing.toLowerCase() !== term.toLowerCase(),
      );
      return [term, ...deduplicated].slice(0, 5);
    });
  }, []);

  const handleSelectRecentSearch = useCallback(
    (term: string) => {
      setSearchQuery(term);
      handleRecordRecentSearch(term);
      setExplorerTab('equipment');
      setIsExplorerCollapsed(false);
      // Nếu khớp chính xác với một thiết bị, ghim luôn thẻ preview để người dùng thấy ảnh & thông số ngay
      const q = term.trim().toLowerCase();
      const matched = equipmentRepository
        .list()
        .find(
          (a) =>
            a.name.vi.toLowerCase().includes(q) ||
            a.assetId.toLowerCase() === q,
        );
      if (matched) {
        setSelectedCatalogAssetId(matched.assetId);
        equipmentImagePreviewController.preview(matched.assetId, 'pinned');
      }
    },
    [handleRecordRecentSearch],
  );

  const handleRemoveRecentSearch = useCallback((termToRemove: string) => {
    setRecentSearches((prev) =>
      prev.filter(
        (item) => item.toLowerCase() !== termToRemove.trim().toLowerCase(),
      ),
    );
  }, []);

  const handleClearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const [selectedSubject, setSelectedSubject] = useState<ScienceSubject | 'all'>(
    'all',
  );
  const [selectedCategory, setSelectedCategory] = useState<
    EquipmentCategoryId | 'all'
  >('all');
  const [selectedVerification, setSelectedVerification] = useState<
    VerificationStatus | 'all'
  >('all');
  const [selectedFormat, setSelectedFormat] = useState<
    'all' | 'GLB' | 'glTF' | 'PROCEDURAL_PBR'
  >('all');
  const [selectedCatalogAssetId, setSelectedCatalogAssetId] = useState<
    string | null
  >('OL3D-EQP-BAL-0001');

  // 2. Scene Workspace State
  const [scene, setScene] = useState<LabScene>(() =>
    sceneRepository.getInitialScene(),
  );
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // 3. 3D Viewport Tool & Layer State
  const [toolMode, setToolMode] = useState<TransformToolMode>('translate');
  const [viewMode, setViewMode] = useState<ViewportDisplayMode>('lab-scene');
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showAxes, setShowAxes] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(false);
  const [showDetailedGuides, setShowDetailedGuides] = useState<boolean>(false);
  const [isExplorerCollapsed, setIsExplorerCollapsed] = useState<boolean>(true);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState<boolean>(true);
  const [isViewportFullscreen, setIsViewportFullscreen] =
    useState<boolean>(false);

  // Mặc định màn hình khu vực mô phỏng khi mới mở như ảnh chụp:
  // Thu gọn cả Thư viện bên trái và Inspector bên phải để mở trọn vẹn 100% không gian bàn thực hành 3D
  useEffect(() => {
    const getBand = (w: number): 'phone' | 'narrow' | 'wide' => {
      if (w < 768) return 'phone';
      if (w < 1200) return 'narrow';
      return 'wide';
    };

    let lastBand = getBand(window.innerWidth);

    const applyResponsivePanels = (_band: 'phone' | 'narrow' | 'wide') => {
      // Mặc định khởi động: Giữ khu vực mô phỏng toàn bàn thoáng đãng, người dùng có thể nhấp mở thanh bên bất cứ lúc nào
      setIsStudentGuideOpen(false);
      setIsRightPanelCollapsed(true);
      setIsExplorerCollapsed(true);
    };

    // Đảm bảo áp dụng ngay lần đầu mount
    applyResponsivePanels(lastBand);

    const handleResize = () => {
      const nextBand = getBand(window.innerWidth);
      if (nextBand !== lastBand) {
        lastBand = nextBand;
        applyResponsivePanels(nextBand);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Broadcast resize event whenever sidebars or fullscreen toggle so 3D viewport smoothly updates projection
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [isExplorerCollapsed, isRightPanelCollapsed, isViewportFullscreen]);

  const handleToggleLibrarySidebar = useCallback(() => {
    setIsExplorerCollapsed((prev) => {
      const nextCollapsed = !prev;
      if (
        !nextCollapsed &&
        typeof window !== 'undefined' &&
        window.innerWidth < 768
      ) {
        setIsStudentGuideOpen(false);
      }
      return nextCollapsed;
    });
  }, []);

  const handleToggleStudentGuide = useCallback(() => {
    setIsStudentGuideOpen((prev) => {
      const nextOpen = !prev;
      if (
        nextOpen &&
        typeof window !== 'undefined' &&
        window.innerWidth < 768
      ) {
        setIsExplorerCollapsed(true);
      }
      return nextOpen;
    });
  }, []);

  // 4. Toast Feedback & Activity Logs State
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [recentLogs, setRecentLogs] = useState<
    Array<{ id: string; text: string; time: string }>
  >([
    {
      id: 'log-init',
      text: 'Khởi tạo bàn gỗ thí nghiệm: Đo khối lượng riêng của vật rắn (5 thiết bị chuẩn).',
      time: 'Phiên hiện tại',
    },
  ]);

  const notify = useCallback(
    (message: string, tone: ToastNotification['tone'] = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToast({ id, message, tone });
      setRecentLogs((prev) => [
        {
          id,
          text: message,
          time: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        },
        ...prev.slice(0, 19),
      ]);
    },
    [],
  );

  // Tự động đóng thông báo sau 8 giây nếu người dùng không bấm Đóng
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 8000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Lắng nghe sự kiện Tua ngược thời gian ChronoCausal (Improvement #7)
  useEffect(() => {
    const handleChronoRewind = (e: Event) => {
      const customEvt = e as CustomEvent<{ seconds?: number; snapshot?: any }>;
      const secs = customEvt.detail?.seconds ?? 5;
      notify(`Đã tua ngược ${secs} giây mô phỏng (ChronoCausal Rewind).`, 'success');
    };
    window.addEventListener('openlab:chrono-rewind', handleChronoRewind);
    return () => window.removeEventListener('openlab:chrono-rewind', handleChronoRewind);
  }, [notify]);

  // Lắng nghe các sự kiện Mạng nơ-ron nhận thức 3 tầng (Lăng kính Vi mô)
  useEffect(() => {
    const handleOpenLens = () => setShowMicroMacroModal(true);
    window.addEventListener('openlab:open-micro-macro-lens', handleOpenLens);

    return () => {
      window.removeEventListener('openlab:open-micro-macro-lens', handleOpenLens);
    };
  }, []);

  // Phím tắt toàn cục: Alt + N (Trợ lý Nơ-ron), Ctrl + S (Lưu dự án), Ctrl + O (Mở dự án)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.altKey && (e.key === 'n' || e.key === 'N')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'n' || e.key === 'N'))
      ) {
        e.preventDefault();
        const next = neuralConnectionEngine.toggleGuideEnabled();
        setIsNeuralGuideEnabled(next);
        notify(
          next
            ? '🧠 Trợ lý Nơ-ron: ĐÃ BẬT (Hiện tia liên kết 3D & hướng dẫn thao tác)'
            : '🧠 Trợ lý Nơ-ron: ĐÃ TẮT (Chế độ tự do / Đánh giá thi)',
          next ? 'success' : 'info',
        );
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setShowSaveProjectModal(true);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'o' || e.key === 'O')) {
        e.preventDefault();
        setShowOpenProjectModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [notify]);

  const handleLoadSavedProject = useCallback((proj: SavedProject) => {
    setScene(proj.scene);
    setSelectedInstanceId(null);
    if (proj.measurements) {
      if (proj.measurements.measuredMassG !== undefined) setMeasuredMassG(proj.measurements.measuredMassG);
      if (proj.measurements.initialVolumeCm3 !== undefined) setInitialVolumeCm3(proj.measurements.initialVolumeCm3);
      if (proj.measurements.finalVolumeCm3 !== undefined) setFinalVolumeCm3(proj.measurements.finalVolumeCm3);
      if (proj.measurements.studentGuidedStep !== undefined) setStudentGuidedStep(proj.measurements.studentGuidedStep as any);
    }
    notify(`Đã khôi phục bài thực hành: "${proj.name}" (${proj.deviceCount} dụng cụ)`, 'success');
  }, [notify]);

  // Toggle Fullscreen for 3D Experiment Viewport (combines workspace expansion + browser fullscreen if permitted)
  const handleToggleViewportFullscreen = useCallback(() => {
    setIsViewportFullscreen((prev) => {
      const next = !prev;
      if (next) {
        setIsStudentGuideOpen(false);
        try {
          if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        } catch {
          // Ignore iframe fullscreen restrictions
        }
      } else {
        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        } catch {
          // Ignore
        }
      }
      return next;
    });
  }, []);

  // Repository queries (refreshes automatically when new .html modules are registered)
  const allAssets = useMemo(
    () => equipmentRepository.list(),
    [moduleRegistryRevision],
  );
  const assetsMap = useMemo(() => {
    const map = new Map<string, AssetDefinition>();
    allAssets.forEach((a) => map.set(a.assetId, a));
    return map;
  }, [allAssets]);

  const liveWaterTempC = useMemo(() => {
    const bkr = scene.instances.find(
      (i) => i.visible && assetsMap.get(i.assetId)?.geometry.proceduralArchetype === 'beaker-250',
    );
    const thm = scene.instances.find(
      (i) => i.visible && assetsMap.get(i.assetId)?.geometry.proceduralArchetype === 'thermometer',
    );
    return thm?.instanceState.temperatureC ?? bkr?.instanceState.temperatureC ?? 25.0;
  }, [scene.instances, assetsMap]);

  const isLiveFlameLit = useMemo(() => {
    const burner = scene.instances.find(
      (i) =>
        i.visible &&
        assetsMap.get(i.assetId)?.geometry.proceduralArchetype === 'alcohol-burner',
    );
    return Boolean(burner?.instanceState.isFlameLit || burner?.instanceState.isHeating);
  }, [scene.instances, assetsMap]);

  const liveOpticsParams = useMemo(() => {
    const lens = scene.instances.find(
      (i) => i.visible && assetsMap.get(i.assetId)?.geometry.proceduralArchetype === 'optical-lens',
    );
    return {
      dCm: lens?.instanceState.objectDistanceDCm ?? 20.0,
      dPrimeCm: lens?.instanceState.projectedImageDPrimeCm ?? 20.0,
      fCm: lens?.instanceState.focalLengthCm ?? 10.0,
    };
  }, [scene.instances, assetsMap]);

  const liveArchimedesParams = useMemo(() => {
    const dyn = scene.instances.find(
      (i) => i.visible && assetsMap.get(i.assetId)?.geometry.proceduralArchetype === 'spring-dynamometer',
    );
    const ovf = scene.instances.find(
      (i) => i.visible && assetsMap.get(i.assetId)?.geometry.proceduralArchetype === 'overflow-can',
    );
    const hooked = dyn
      ? scene.instances.find(
          (i) =>
            i.visible &&
            i.instanceState.attachedToInstanceId === dyn.instanceId &&
            i.instanceState.attachmentSlot === 'dynamometer-hook',
        )
      : undefined;
    const isSubmerged = scene.instances.some(
      (i) =>
        i.visible &&
        assetsMap.get(i.assetId)?.kind === 'specimen' &&
        i.instanceState.attachmentSlot === 'inside-vessel',
    );
    const rawAirN = hooked
      ? Number(((assetsMap.get(hooked.assetId)?.scientificProperties.referenceMass?.value ?? 66.25) * 0.00980665).toFixed(2))
      : dyn?.instanceState.springExtensionN ?? null;
    const spilledMl = ovf?.instanceState.overflowingVolumeMl ?? 0;
    const displacedMl = spilledMl > 0 ? spilledMl : isSubmerged ? 24.5 : null;
    const forceAir = rawAirN && rawAirN > 0 ? rawAirN : studentGuidedStep >= 2 ? 0.65 : null;
    const forceSub = isSubmerged && forceAir
      ? Number(Math.max(0, forceAir - (displacedMl ?? 24.5) * 0.00980665).toFixed(2))
      : studentGuidedStep >= 3
        ? 0.41
        : null;
    return {
      measuredForceAirN: forceAir,
      measuredForceSubN: forceSub,
      displacedVolumeMl: displacedMl ?? (studentGuidedStep >= 3 ? 24.5 : null),
    };
  }, [scene.instances, assetsMap, studentGuidedStep]);

  // Đồng bộ metadata ảnh thực tế của toàn bộ thiết bị vào EquipmentImagePreviewController (Mục 5.1)
  useEffect(() => {
    equipmentImagePreviewController.syncLibraryEntries(allAssets, (asset) => {
      const mod = htmlEquipmentModuleRegistry.getModule(asset.assetId);
      const uploadedDataUrl = htmlEquipmentModuleRegistry.getUploadedRealPhoto(
        asset.assetId,
      );
      const customCaption = htmlEquipmentModuleRegistry.getCustomPhotoCaption(
        asset.assetId,
      );
      return {
        uploadedDataUrl,
        rawRealPhotoMeta: mod?.realPhotoMeta
          ? {
              ...mod.realPhotoMeta,
              caption: customCaption || mod.realPhotoMeta.caption,
            }
          : customCaption
            ? { caption: customCaption }
            : undefined,
        fallbackSvgMarkup: mod?.realPhotoMarkup,
      };
    });
  }, [allAssets, moduleRegistryRevision]);

  const filteredAssets = useMemo(
    () =>
      equipmentRepository.list({
        search: searchQuery,
        subject: selectedSubject,
        category: selectedCategory,
        verificationStatus: selectedVerification,
        format: selectedFormat,
      }),
    [
      searchQuery,
      selectedSubject,
      selectedCategory,
      selectedVerification,
      selectedFormat,
      moduleRegistryRevision,
    ],
  );

  const categories = useMemo(() => equipmentRepository.listCategories(), []);
  const kits = useMemo(() => kitRepository.list(), []);
  const environments = useMemo(() => environmentRepository.list(), []);
  const experiments = useMemo(() => experimentRepository.list(), []);

  const activeEnvironment = useMemo(
    () => environmentRepository.getById(scene.environmentId) ?? environments[0],
    [scene.environmentId, environments],
  );

  const activeExperiment = useMemo(
    () => experimentRepository.getById(scene.experimentId) ?? experiments[0],
    [scene.experimentId, experiments],
  );

  const selectedInstance = useMemo(
    () =>
      scene.instances.find((i) => i.instanceId === selectedInstanceId) ?? null,
    [scene.instances, selectedInstanceId],
  );

  const activeInspectedAsset = useMemo(() => {
    if (selectedInstance) {
      return assetsMap.get(selectedInstance.assetId) ?? null;
    }
    if (selectedCatalogAssetId) {
      return assetsMap.get(selectedCatalogAssetId) ?? null;
    }
    return allAssets[0] ?? null;
  }, [selectedInstance, selectedCatalogAssetId, assetsMap, allAssets]);

  const presentAssetIdsSet = useMemo(
    () =>
      new Set(
        scene.instances
          .filter((i) => i.visible && i.instanceState.attachmentSlot !== 'shelf')
          .map((i) => i.assetId),
      ),
    [scene.instances],
  );

  const requiredExperimentAssetIdsSet = useMemo(
    () =>
      new Set(activeExperiment.steps.flatMap((s) => s.requiredAssetIds)),
    [activeExperiment],
  );

  // Synchronized Selection Handlers
  const handleSelectCatalogAsset = useCallback(
    (assetId: string) => {
      setSelectedCatalogAssetId(assetId);
      const matchingInst = scene.instances.find((i) => i.assetId === assetId);
      if (matchingInst) {
        setSelectedInstanceId(matchingInst.instanceId);
      } else {
        setSelectedInstanceId(null);
      }
    },
    [scene.instances],
  );

  const handleSelectSceneInstance = useCallback(
    (instanceId: string | null) => {
      setSelectedInstanceId(instanceId);
      equipmentImagePreviewController.hide('viewport-click');
      if (instanceId) {
        const inst = scene.instances.find((i) => i.instanceId === instanceId);
        if (inst) {
          setSelectedCatalogAssetId(inst.assetId);
        }
      }
    },
    [scene.instances],
  );

  // Add Single Asset to 3D Scene
  const handleAddAssetToScene = useCallback(
    (
      assetId: string,
      customPosM?: [number, number, number],
      directAssetOverride?: AssetDefinition,
    ) => {
      const asset =
        directAssetOverride ??
        assetsMap.get(assetId) ??
        htmlEquipmentModuleRegistry.getModule(assetId)?.asset;
      if (!asset) return;

      setScene((prev) => {
        const idx = prev.instances.length;
        const angle = (idx * 1.15) % (Math.PI * 2);
        const radius = 0.16 + (idx % 4) * 0.09;
        const rawPosX = customPosM
          ? customPosM[0]
          : Number((Math.cos(angle) * radius).toFixed(3));
        const rawPosZ = customPosM
          ? customPosM[2]
          : Number((Math.sin(angle) * radius * 0.65).toFixed(3));
        const posX = Math.max(-1.15, Math.min(1.15, rawPosX));
        const posZ = Math.max(-0.435, Math.min(0.435, rawPosZ));

        // Nếu thiết bị này đang nằm trên Khu trưng bày ('shelf'), lấy trực tiếp từ Khu trưng bày xuống mặt bàn!
        const storedOnShelf = prev.instances.find(
          (i) =>
            i.visible &&
            i.assetId === asset.assetId &&
            i.instanceState.attachmentSlot === 'shelf',
        );
        if (storedOnShelf) {
          setSelectedInstanceId(storedOnShelf.instanceId);
          setSelectedCatalogAssetId(asset.assetId);
          return {
            ...prev,
            sceneRevision: prev.sceneRevision + 1,
            updatedAt: new Date().toISOString(),
            instances: prev.instances.map((item) =>
              item.instanceId === storedOnShelf.instanceId
                ? {
                    ...item,
                    transform: {
                      ...item.transform,
                      positionM: [posX, 0, posZ],
                      displayScale: [1, 1, 1],
                    },
                    instanceState: {
                      ...item.instanceState,
                      attachedToInstanceId: null,
                      attachmentSlot: 'bench',
                    },
                  }
                : item,
            ),
          };
        }

        const existingCount = prev.instances.filter(
          (i) => i.assetId === asset.assetId,
        ).length;

        const defaultCap = asset.scientificProperties.capacity
          ? asset.scientificProperties.capacity.value * 0.5
          : undefined;

        const newInstance: SceneInstance = {
          instanceId: `inst-${asset.slug.slice(0, 10)}-${Date.now()
            .toString(36)
            .slice(-4)}`,
          assetId: asset.assetId,
          assetVersion: asset.assetVersion || '1.0.0',
          customLabel:
            existingCount === 0
              ? asset.name.vi
              : `${asset.name.vi} (#${existingCount + 1})`,
          parentZone: 'bench-main',
          transform: {
            positionM: [posX, 0, posZ],
            rotationRad: [0, 0, 0],
            displayScale: [1, 1, 1],
          },
          visible: true,
          locked: false,
          labelVisible: true,
          instanceState: (() => {
            const customMod = htmlEquipmentModuleRegistry.getModule(
              asset.assetId,
            );
            const baseState: SceneInstance['instanceState'] = {
              liquidLevelMl: defaultCap,
              baseLiquidLevelMl: defaultCap,
              measuredMassG: 0,
              tareOffsetG: 0,
              jawOpeningMm: 25,
              isPoweredOn: false, // Mặc định tắt nguồn khi mới đưa thiết bị ra bàn (ICR-03)
              incidentAngleDeg: 0,
              galvanometerDeflection: 0.0, // Nam châm đứng yên, từ thông không biến thiên -> I = 0 (P05)
              multimeterMode: 'V',
              multimeterValue: 0.0, // Que đo hở mạch hiển thị 0.00 V (P07)
              magnification: 40,
              isHeating: false, // Không tự động đun nóng khi chưa có lửa (P06)
              temperatureC: 25.0, // Nhiệt độ phòng tiêu chuẩn
            };
            if (customMod) {
              const ctrl = customMod.moduleControls;
              return {
                ...baseState,
                [ctrl.stateKey]: ctrl.defaultValue,
              };
            }
            return baseState;
          })(),
        };

        setSelectedInstanceId(newInstance.instanceId);
        setSelectedCatalogAssetId(asset.assetId);

        return {
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          updatedAt: new Date().toISOString(),
          instances: [...prev.instances, newInstance],
        };
      });

      setViewMode('lab-scene');
      labSoundEngine.play(
        asset.materialCategory === 'borosilicate-glass' ? 'glass-clink' : 'wood-place',
        { intensity: 0.9 },
      );
      notify(`Đã đặt "${asset.name.vi}" vào bàn gỗ thí nghiệm.`, 'success');
    },
    [assetsMap, notify],
  );

  // Batch Add Multiple Selected Assets
  const handleBatchAddAssetsToScene = useCallback(
    (assetIds: string[]) => {
      if (assetIds.length === 0) return;
      assetIds.forEach((id, i) => {
        const offsetX = Number((-0.35 + (i % 5) * 0.17).toFixed(3));
        const offsetZ = Number((0.12 + Math.floor(i / 5) * 0.12).toFixed(3));
        handleAddAssetToScene(id, [offsetX, 0, offsetZ]);
      });
      notify(`Đã thêm ${assetIds.length} thiết bị vào bàn thí nghiệm.`, 'success');
    },
    [handleAddAssetToScene, notify],
  );

  // Place all missing required equipment for the active experiment
  const handlePlaceAllRequiredForExperiment = useCallback(() => {
    const reqIds = Array.from(
      new Set(activeExperiment.steps.flatMap((s) => s.requiredAssetIds)),
    );
    const missing = reqIds.filter((id) => !presentAssetIdsSet.has(id));
    if (missing.length === 0) {
      notify('Bàn thí nghiệm đã có đầy đủ dụng cụ cho bài học này.', 'info');
      return;
    }
    missing.forEach((id, idx) => {
      const offsetX = Number((-0.32 + (idx % 4) * 0.22).toFixed(3));
      const offsetZ = Number((0.08 + Math.floor(idx / 4) * 0.14).toFixed(3));
      handleAddAssetToScene(id, [offsetX, 0, offsetZ]);
    });
    notify(`Đã đặt bổ sung ${missing.length} dụng cụ còn thiếu lên bàn.`, 'success');
  }, [activeExperiment, presentAssetIdsSet, handleAddAssetToScene, notify]);

  // Helper: Pre-populate suggested equipment onto Khu trưng bày 2 tầng ('shelf') for a topic, kit, or experiment
  const populateShelfWithSuggestedAssets = useCallback(
    (
      suggestedAssetIds: string[],
      topicLabelVi: string,
      clearActiveBench = false,
    ) => {
      setScene((prev) => {
        const keptBenchInstances = clearActiveBench
          ? []
          : prev.instances.filter(
              (inst) =>
                inst.visible && inst.instanceState.attachmentSlot !== 'shelf',
            );
        const benchAssetIds = new Set(keptBenchInstances.map((i) => i.assetId));
        const uniqueShelfIds = Array.from(new Set(suggestedAssetIds)).filter(
          (id) => !benchAssetIds.has(id) && assetsMap.has(id),
        );

        const slotY = 0.138;
        const totalCount = uniqueShelfIds.length;
        const stepX = Math.min(0.16, 1.24 / Math.max(1, totalCount));

        const shelfInstances: SceneInstance[] = uniqueShelfIds.map(
          (assetId, idx) => {
            const asset = assetsMap.get(assetId)!;
            const arch = asset.geometry.proceduralArchetype;
            const defaultCap =
              arch === 'overflow-can'
                ? 210
                : arch === 'water-dispenser'
                  ? 850
                  : asset.scientificProperties.capacity
                    ? asset.scientificProperties.capacity.value * 0.5
                    : undefined;
            const slotX = Number(
              ((idx - (totalCount - 1) / 2) * stepX).toFixed(3),
            );
            const bboxH = asset.geometry.boundingBoxM.height ?? 0.14;
            const symbolicScale = Number(
              Math.min(0.52, Math.max(0.28, 0.125 / Math.max(0.05, bboxH))).toFixed(3),
            );

            return {
              instanceId: `inst-shelf-${idx + 1}-${Date.now().toString(36).slice(-3)}`,
              assetId: asset.assetId,
              assetVersion: asset.assetVersion,
              customLabel: asset.name.vi,
              parentZone: 'bench-main',
              transform: {
                positionM: [slotX, slotY, -0.45],
                rotationRad: [0, 0, 0],
                displayScale: [symbolicScale, symbolicScale, symbolicScale],
              },
              visible: true,
              locked: false,
              labelVisible: true,
              instanceState: {
                attachmentSlot: 'shelf',
                liquidLevelMl: defaultCap,
                baseLiquidLevelMl: defaultCap,
                measuredMassG: 0,
                tareOffsetG: 0,
                jawOpeningMm: 25,
                isPoweredOn: false,
                incidentAngleDeg: 0,
                galvanometerDeflection: 0.0,
                multimeterMode: 'V',
                multimeterValue: 0.0,
                magnification: 40,
                isHeating: false,
                temperatureC: 25.0,
                lensProfileId: 'conv_10',
                focalLengthCm: 10,
                beamMode: 'f-pattern',
                supplyVoltageV: 12.0,
                objectDistanceDCm: 20,
                screenDistanceCm: 20,
                projectedImageDPrimeCm: 20,
                projectedImageMag: -1,
                projectedImageType: 'real',
              },
            };
          },
        );

        return {
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          updatedAt: new Date().toISOString(),
          instances: [...keptBenchInstances, ...shelfInstances],
        };
      });

      notify(
        `Đã xếp bộ thiết bị gợi ý của "${topicLabelVi}" lên Kệ trưng bày — Hãy kéo từng chi tiết xuống bàn để lắp ráp hoặc bấm "⚡ Lắp bộ Thấu kính".`,
        'info',
      );
    },
    [assetsMap, notify],
  );

  // Load an Entire Equipment Kit onto Khu trưng bày (Clean Workbench)
  const handleLoadKitToScene = useCallback(
    (kit: EquipmentKit) => {
      const kitAssetIds = kit.items
        .map((item) => item.assetId)
        .filter((id) => assetsMap.has(id));
      if (kitAssetIds.length > 0) {
        const matchingExp = experiments.find(
          (e) => e.recommendedKitId === kit.kitId,
        );
        populateShelfWithSuggestedAssets(kitAssetIds, kit.name.vi, true);
        if (matchingExp) {
          setScene((prev) => ({
            ...prev,
            name: `Cảnh theo bộ: ${kit.name.vi}`,
            experimentId: matchingExp.experimentId,
          }));
        }
        setSelectedInstanceId(null);
        setViewMode('lab-scene');
        setStudentGuidedStep(1);
      }
    },
    [assetsMap, experiments, populateShelfWithSuggestedAssets],
  );

  // Pure solver: Reconciles cumulative multi-object mass on Electronic Balance,
  // cumulative volume displacement in Graduated Cylinder / Beaker, cumulative force on Spring Dynamometer,
  // and real-time Thin-Lens Optical Bench assembly & ray-projection state (Hình 8.12 SGK KHTN 9)
  const reconcileCumulativeLabMeasurements = useCallback(
    (rawInstances: SceneInstance[]): SceneInstance[] => {
      const computeItemTotalMassG = (item: SceneInstance): number => {
        const itemAsset = assetsMap.get(item.assetId);
        const itemArch = itemAsset?.geometry.proceduralArchetype;
        const dryMass =
          itemAsset?.scientificProperties.referenceMass?.value ?? 66.25;
        const isVessel =
          itemArch === 'beaker-250' ||
          itemArch === 'graduated-cylinder' ||
          itemArch === 'erlenmeyer-flask' ||
          itemArch === 'porcelain-dish' ||
          itemArch === 'overflow-can';
        const waterMass = isVessel
          ? item.instanceState.baseLiquidLevelMl ??
            item.instanceState.liquidLevelMl ??
            0
          : 0;
        // Also include any specimens submerged inside this vessel if the vessel itself is on the balance!
        let submergedMass = 0;
        if (isVessel) {
          for (const sub of rawInstances) {
            if (
              sub.visible &&
              sub.instanceState.attachedToInstanceId === item.instanceId &&
              sub.instanceState.attachmentSlot === 'inside-vessel'
            ) {
              const subAsset = assetsMap.get(sub.assetId);
              if (subAsset?.geometry.proceduralArchetype !== 'thermometer') {
                submergedMass +=
                  subAsset?.scientificProperties.referenceMass?.value ?? 66.25;
              }
            }
          }
        }
        return dryMass + waterMass + submergedMass;
      };

      // Map balanceId -> list of attached items on pan so we can arrange them without overlap
      const panItemsByBalance = new Map<string, SceneInstance[]>();
      for (const inst of rawInstances) {
        if (
          inst.visible &&
          inst.instanceState.attachedToInstanceId &&
          inst.instanceState.attachmentSlot === 'balance-pan'
        ) {
          const bId = inst.instanceState.attachedToInstanceId;
          const list = panItemsByBalance.get(bId) ?? [];
          list.push(inst);
          panItemsByBalance.set(bId, list);
        }
      }

      const shelfItems = rawInstances.filter(
        (inst) => inst.visible && inst.instanceState.attachmentSlot === 'shelf',
      );
      const shelfRaisedTierLocalY = 0.138;

      // Pre-scan active workbench Optical Bench components (Hình 8.12 SGK KHTN 9)
      const activeBenchItem = (archTarget: string) =>
        rawInstances.find(
          (i) =>
            i.visible &&
            i.instanceState.attachmentSlot !== 'shelf' &&
            assetsMap.get(i.assetId)?.geometry.proceduralArchetype === archTarget,
        );
      const optBench = activeBenchItem('optical-bench');
      const optLamp = activeBenchItem('optical-lamp');
      const optFObj = activeBenchItem('frosted-f-object');
      const optLens = activeBenchItem('optical-lens');
      const optScreen = activeBenchItem('optical-screen');
      const optPsu = activeBenchItem('optical-power-supply');
      const optBox = activeBenchItem('optical-lens-box');

      // Giải mạch điện vật lý theo CIA v1.0 & định luật Ohm (P01, P02, P08)
      const circuitState = solveElectricalCircuit(optPsu, optLamp);
      const hasPsuOnBench = Boolean(optPsu);
      const isLampSwitchOn = optLamp?.instanceState.isPoweredOn !== false;
      const isLampLit = hasPsuOnBench ? circuitState.isLampLit : isLampSwitchOn;
      const activeSupplyVoltageV =
        circuitState.voltageAtLampV > 0
          ? circuitState.voltageAtLampV
          : circuitState.voltageSettingV > 0
            ? circuitState.voltageSettingV
            : 12.0;

      // Synchronize active lens profile & focal length between Lens Holder and Lens Box
      const selectedLensProfileId =
        optLens?.instanceState.lensProfileId ??
        optBox?.instanceState.lensProfileId ??
        'conv_10';
      // Physical law: if (3) Thấu kính is NOT on the workbench/rail yet, rays travel straight through air (flat_inf)
      const effectiveLensProfileId = optLens ? selectedLensProfileId : 'flat_inf';
      const LENS_FOCAL_LOOKUP: Record<string, number> = {
        conv_5: 5,
        conv_10: 10,
        conv_15: 15,
        div_10: -10,
        div_20: -20,
        flat_inf: 999999,
      };
      const activeFocalCm =
        LENS_FOCAL_LOOKUP[effectiveLensProfileId] ??
        optLens?.instanceState.focalLengthCm ??
        10;
      const storedFocalCm =
        LENS_FOCAL_LOOKUP[selectedLensProfileId] ??
        optLens?.instanceState.focalLengthCm ??
        10;

      const rawBeamMode =
        optLamp?.instanceState.beamMode ??
        optLens?.instanceState.beamMode ??
        optScreen?.instanceState.beamMode ??
        'f_rays';
      // Physical law: letter F projection ('f_object') requires (2) Vật sáng chữ F on the workbench;
      // if (2) is still on the shelf, the lamp emits slit rays ('laser_rays') directly.
      const requestedExperimentMode: 'f_object' | 'laser_rays' =
        optLamp?.instanceState.experimentMode ??
        optLens?.instanceState.experimentMode ??
        optScreen?.instanceState.experimentMode ??
        (rawBeamMode === 'f_rays' || rawBeamMode === 'f-pattern'
          ? 'f_object'
          : 'laser_rays');
      const activeExperimentMode: 'f_object' | 'laser_rays' =
        requestedExperimentMode === 'f_object' && !optFObj
          ? 'laser_rays'
          : requestedExperimentMode;
      const activeBeamMode:
        | 'single'
        | 'double'
        | 'triple'
        | 'bundle'
        | 'divergent'
        | 'f_rays'
        | 'f-pattern' =
        activeExperimentMode === 'f_object'
          ? 'f_rays'
          : rawBeamMode === 'f_rays' || rawBeamMode === 'f-pattern'
            ? 'triple'
            : rawBeamMode;

      const activeRayOffsetYCm =
        optLamp?.instanceState.rayOffsetYCm ??
        optLens?.instanceState.rayOffsetYCm ??
        0;
      const activeRayAngleDeg =
        optLamp?.instanceState.rayAngleDeg ??
        optLens?.instanceState.rayAngleDeg ??
        0;
      const activeShowPhotons =
        optLamp?.instanceState.showPhotons ??
        optLens?.instanceState.showPhotons ??
        true;
      const activeShowVirtualRays =
        optLamp?.instanceState.showVirtualRays ??
        optLens?.instanceState.showVirtualRays ??
        true;
      const activeAmbientLightLevel =
        optLamp?.instanceState.ambientLightLevel ??
        optLens?.instanceState.ambientLightLevel ??
        45;
      const activePresetId =
        optLens?.instanceState.activePresetId ??
        optLamp?.instanceState.activePresetId ??
        'real_equal';

      const benchOriginX = optBench ? optBench.transform.positionM[0] : 0;
      const lensWorldX = optLens ? optLens.transform.positionM[0] : benchOriginX;
      const fObjWorldX =
        activeExperimentMode === 'f_object' && optFObj
          ? Math.min(lensWorldX - 0.03, optFObj.transform.positionM[0])
          : optLamp
            ? Math.min(lensWorldX - 0.08, optLamp.transform.positionM[0])
            : lensWorldX - 0.2;
      const screenWorldX = optScreen
        ? Math.max(lensWorldX + 0.05, optScreen.transform.positionM[0])
        : lensWorldX + 0.2;

      const computedDCm = Number(
        Math.max(3, (lensWorldX - fObjWorldX) * 100).toFixed(1),
      );
      const computedScreenLCm = Number(
        Math.max(5, (screenWorldX - lensWorldX) * 100).toFixed(1),
      );

      let computedDPrimeCm = 20;
      let computedMag = -1;
      let computedImgType: 'real' | 'virtual' | 'infinity' = 'real';
      if (Math.abs(activeFocalCm) > 9999) {
        computedDPrimeCm = -computedDCm;
        computedMag = 1;
        computedImgType = 'virtual';
      } else if (Math.abs(computedDCm - activeFocalCm) < 0.08) {
        computedDPrimeCm = 9999;
        computedMag = 99;
        computedImgType = 'infinity';
      } else {
        computedDPrimeCm = Number(
          ((computedDCm * activeFocalCm) / (computedDCm - activeFocalCm)).toFixed(2),
        );
        computedMag = Number((-computedDPrimeCm / computedDCm).toFixed(2));
        computedImgType = computedDPrimeCm > 0 ? 'real' : 'virtual';
      }

      return rawInstances.map((inst) => {
        const instAsset = assetsMap.get(inst.assetId);
        const arch = instAsset?.geometry.proceduralArchetype;

        // 0. Nếu thiết bị đang nằm trong Khu trưng bày 1 tầng nâng cao ('shelf'), tự động xếp gọn trên tầng 1 (Y = 0.138m) sát mép sau bàn (Z = -0.450m)
        if (inst.instanceState.attachmentSlot === 'shelf') {
          const inShelfIdx = Math.max(
            0,
            shelfItems.findIndex((s) => s.instanceId === inst.instanceId),
          );
          const shelfCount = shelfItems.length;
          const stepX = Math.min(0.16, 1.24 / Math.max(1, shelfCount));
          const slotX = Number(
            ((inShelfIdx - (shelfCount - 1) / 2) * stepX).toFixed(3),
          );
          const slotY = shelfRaisedTierLocalY;
          const bboxH = instAsset?.geometry.boundingBoxM.height ?? 0.14;
          const symbolicScale = Number(
            Math.min(0.52, Math.max(0.28, 0.125 / Math.max(0.05, bboxH))).toFixed(3),
          );
          return {
            ...inst,
            transform: {
              ...inst.transform,
              positionM: [slotX, slotY, -0.45],
              rotationRad: [0, inst.transform.rotationRad[1] ?? 0, 0],
              displayScale: [symbolicScale, symbolicScale, symbolicScale],
            },
            instanceState: {
              ...inst.instanceState,
              attachedToInstanceId: null,
              attachmentSlot: 'shelf',
            },
          };
        }

        // Khôi phục tỷ lệ 1:1 chuẩn khi thiết bị được lấy từ Khu trưng bày xuống mặt bàn thực hành
        if (
          inst.transform.displayScale[0] !== 1 ||
          inst.transform.displayScale[1] !== 1 ||
          inst.transform.displayScale[2] !== 1
        ) {
          inst = {
            ...inst,
            transform: {
              ...inst.transform,
              displayScale: [1, 1, 1],
            },
          };
        }

        // 0B. Optical Bench Rail Riders: keep aligned to Optical Bench Z axis, enforce physical ordering, and update thin-lens physics state
        const isOpticalRider =
          arch === 'optical-lamp' ||
          arch === 'frosted-f-object' ||
          arch === 'optical-lens' ||
          arch === 'optical-screen';
        if (
          isOpticalRider &&
          optBench &&
          inst.instanceState.attachedToInstanceId === optBench.instanceId &&
          inst.instanceState.attachmentSlot === 'optical-bench-rail'
        ) {
          let targetX = inst.transform.positionM[0];
          // Physical non-interpenetration constraint along the rail:
          // Lamp stays at least 7.5 cm to the left of Frosted F Object (when F object is on rail)
          if (arch === 'optical-lamp' && optFObj) {
            const maxLampX = Math.min(lensWorldX - 0.11, fObjWorldX - 0.075);
            if (targetX > maxLampX) {
              targetX = maxLampX;
            }
          } else if (arch === 'frosted-f-object') {
            targetX = Math.min(lensWorldX - 0.03, targetX);
          } else if (arch === 'optical-screen') {
            targetX = Math.max(lensWorldX + 0.05, targetX);
          }

          const clampedX = Number(
            Math.max(
              optBench.transform.positionM[0] - 0.435,
              Math.min(
                optBench.transform.positionM[0] + 0.435,
                targetX,
              ),
            ).toFixed(3),
          );
          const alignedZ = Number(optBench.transform.positionM[2].toFixed(3));
          inst = {
            ...inst,
            transform: {
              ...inst.transform,
              positionM: [clampedX, 0, alignedZ],
              rotationRad: [0, 0, 0],
            },
          };
        }

        const sharedOpticalState = {
          isLampLit,
          supplyVoltageV: activeSupplyVoltageV,
          experimentMode: activeExperimentMode,
          beamMode: activeBeamMode,
          lensProfileId: selectedLensProfileId,
          focalLengthCm: storedFocalCm,
          objectDistanceDCm: computedDCm,
          screenDistanceCm: computedScreenLCm,
          projectedImageDPrimeCm: computedDPrimeCm,
          projectedImageMag: computedMag,
          projectedImageType: computedImgType,
          rayOffsetYCm: activeRayOffsetYCm,
          rayAngleDeg: activeRayAngleDeg,
          showPhotons: activeShowPhotons,
          showVirtualRays: activeShowVirtualRays,
          ambientLightLevel: activeAmbientLightLevel,
          activePresetId,
        };

        if (arch === 'optical-lamp') {
          const railCm = Number(
            ((inst.transform.positionM[0] - benchOriginX) * 100).toFixed(1),
          );
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              ...sharedOpticalState,
              isLampLit,
              isCablesConnected: circuitState.isCablesConnected,
              supplyVoltageV: activeSupplyVoltageV,
              // P01: Giữ nguyên trạng thái công tắc riêng của đèn, không ghi đè chéo
              isPoweredOn: inst.instanceState.isPoweredOn !== false,
              railCoordCm: railCm,
            },
          };
        }

        if (arch === 'frosted-f-object') {
          const railCm = Number(
            ((inst.transform.positionM[0] - benchOriginX) * 100).toFixed(1),
          );
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              ...sharedOpticalState,
              isPoweredOn: isLampLit,
              isLampLit,
              railCoordCm: railCm,
            },
          };
        }

        if (arch === 'optical-lens') {
          const railCm = Number(
            ((inst.transform.positionM[0] - benchOriginX) * 100).toFixed(1),
          );
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              ...sharedOpticalState,
              railCoordCm: railCm,
            },
          };
        }

        if (arch === 'optical-screen') {
          const railCm = Number(
            ((inst.transform.positionM[0] - benchOriginX) * 100).toFixed(1),
          );
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              ...sharedOpticalState,
              lensProfileId: effectiveLensProfileId,
              focalLengthCm: activeFocalCm,
              railCoordCm: railCm,
            },
          };
        }

        if (arch === 'optical-power-supply') {
          const effectivePsuV =
            typeof inst.instanceState.voltageStepV === 'number' && inst.instanceState.voltageStepV > 0
              ? inst.instanceState.voltageStepV
              : typeof inst.instanceState.voltageSetting === 'number' && inst.instanceState.voltageSetting > 0
                ? inst.instanceState.voltageSetting
                : typeof inst.instanceState.supplyVoltageV === 'number' && inst.instanceState.supplyVoltageV > 0
                  ? inst.instanceState.supplyVoltageV
                  : (circuitState.voltageSettingV > 0 ? circuitState.voltageSettingV : 12.0);
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              // P01: Giữ nguyên trạng thái công tắc nguồn riêng của PSU
              isPoweredOn: inst.instanceState.isPoweredOn !== false,
              supplyVoltageV: effectivePsuV,
              voltageStepV: effectivePsuV,
              voltageSetting: effectivePsuV,
            },
          };
        }

        if (arch === 'optical-lens-box') {
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              ...sharedOpticalState,
            },
          };
        }

        // If this item is sitting on a balance pan, keep its position synced to its radial slot on the rotated pan
        if (
          inst.instanceState.attachedToInstanceId &&
          inst.instanceState.attachmentSlot === 'balance-pan'
        ) {
          const parentBalance = rawInstances.find(
            (b) => b.instanceId === inst.instanceState.attachedToInstanceId,
          );
          if (parentBalance) {
            const rotY = parentBalance.transform.rotationRad[1] ?? 0;
            const panX =
              parentBalance.transform.positionM[0] - Math.sin(rotY) * 0.02;
            const panZ =
              parentBalance.transform.positionM[2] - Math.cos(rotY) * 0.02;
            const siblings =
              panItemsByBalance.get(parentBalance.instanceId) ?? [inst];
            const count = siblings.length;
            const idx = Math.max(
              0,
              siblings.findIndex((s) => s.instanceId === inst.instanceId),
            );
            const radius = count <= 1 ? 0 : 0.026;
            const angle = rotY + (idx * Math.PI * 2) / Math.max(1, count);
            const slotX = Number((panX + Math.cos(angle) * radius).toFixed(3));
            const slotZ = Number((panZ + Math.sin(angle) * radius).toFixed(3));
            inst = {
              ...inst,
              transform: {
                ...inst.transform,
                positionM: [slotX, 0.068, slotZ],
              },
            };
          }
        }

        // If this item is clamped in a Vernier Caliper's jaws ('caliper-jaws'), keep its position centered between the fixed jaw (-0.090m) and movable jaw (-0.090m + d/1000)
        if (
          inst.instanceState.attachedToInstanceId &&
          inst.instanceState.attachmentSlot === 'caliper-jaws'
        ) {
          const parentCaliper = rawInstances.find(
            (c) => c.instanceId === inst.instanceState.attachedToInstanceId,
          );
          if (parentCaliper) {
            const rawWidthMm =
              instAsset?.geometry.dimensions?.widthOrDiameter?.value ??
              (instAsset?.geometry.boundingBoxM.width ?? 0.026) * 1000;
            const widthMm = Number(
              Math.min(150, Math.max(1, rawWidthMm)).toFixed(2),
            );
            const rotY = parentCaliper.transform.rotationRad[1] ?? 0;
            const localCenterX = -0.09 + widthMm * 0.0005;
            const localCenterZ = 0.028;
            const slotX = Number(
              (
                parentCaliper.transform.positionM[0] +
                localCenterX * Math.cos(rotY) +
                localCenterZ * Math.sin(rotY)
              ).toFixed(3),
            );
            const slotZ = Number(
              (
                parentCaliper.transform.positionM[2] -
                localCenterX * Math.sin(rotY) +
                localCenterZ * Math.cos(rotY)
              ).toFixed(3),
            );
            inst = {
              ...inst,
              transform: {
                ...inst.transform,
                positionM: [slotX, 0.002, slotZ],
              },
            };
          }
        }

        // Sync 3D position of items submerged inside a vessel ('inside-vessel') or hooked onto a dynamometer ('dynamometer-hook')
        if (
          inst.instanceState.attachedToInstanceId &&
          inst.instanceState.attachmentSlot === 'inside-vessel'
        ) {
          const parentVessel = rawInstances.find(
            (v) => v.instanceId === inst.instanceState.attachedToInstanceId,
          );
          if (parentVessel) {
            const vRotY = parentVessel.transform.rotationRad[1] ?? 0;
            const vX = parentVessel.transform.positionM[0];
            const vZ = parentVessel.transform.positionM[2];
            const vY =
              parentVessel.instanceState.attachmentSlot === 'shelf'
                ? shelfRaisedTierLocalY
                : 0;
            const subY = arch === 'thermometer' ? 0.035 : 0.016;
            inst = {
              ...inst,
              transform: {
                ...inst.transform,
                positionM: [vX, Number((vY + subY).toFixed(3)), vZ],
                rotationRad: [0, vRotY, 0],
              },
            };
          }
        }

        if (
          inst.instanceState.attachedToInstanceId &&
          inst.instanceState.attachmentSlot === 'dynamometer-hook'
        ) {
          const parentDyn = rawInstances.find(
            (d) => d.instanceId === inst.instanceState.attachedToInstanceId,
          );
          if (parentDyn) {
            const dY =
              parentDyn.instanceState.attachmentSlot === 'shelf'
                ? shelfRaisedTierLocalY
                : 0;
            inst = {
              ...inst,
              transform: {
                ...inst.transform,
                positionM: [
                  parentDyn.transform.positionM[0],
                  Number((dY + 0.02).toFixed(3)),
                  parentDyn.transform.positionM[2],
                ],
              },
            };
          }
        }

        // 1. Electronic Balance: sum the masses of ALL items on its pan
        if (arch === 'electronic-balance') {
          const itemsOnPan = panItemsByBalance.get(inst.instanceId) ?? [];
          const totalPanMassG = Number(
            itemsOnPan
              .reduce((acc, item) => acc + computeItemTotalMassG(item), 0)
              .toFixed(2),
          );
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              measuredMassG: totalPanMassG,
              tareOffsetG: inst.instanceState.tareOffsetG ?? 0,
            },
          };
        }

        // 2. Graduated Cylinder / Beaker: base liquid volume + sum of ALL submerged specimens' volumes
        if (arch === 'graduated-cylinder' || arch === 'beaker-250') {
          const baseMl =
            inst.instanceState.baseLiquidLevelMl ??
            inst.instanceState.liquidLevelMl ??
            (arch === 'graduated-cylinder' ? 50 : 40);
          let displacedVolCm3 = 0;
          for (const sub of rawInstances) {
            if (
              sub.visible &&
              sub.instanceState.attachedToInstanceId === inst.instanceId &&
              sub.instanceState.attachmentSlot === 'inside-vessel'
            ) {
              const subAsset = assetsMap.get(sub.assetId);
              if (subAsset?.geometry.proceduralArchetype !== 'thermometer') {
                displacedVolCm3 +=
                  subAsset?.scientificProperties.referenceVolume?.value ?? 24.5;
              }
            }
          }
          let isDirectlyHeated = false;
          if (arch === 'beaker-250') {
            const activeBurner = rawInstances.find((b) => {
              if (!b.visible) return false;
              const bArch = assetsMap.get(b.assetId)?.geometry.proceduralArchetype;
              return (
                (bArch === 'alcohol-burner' || bArch === 'distillation-flask') &&
                Boolean(b.instanceState.isHeating || b.instanceState.isFlameLit)
              );
            });
            if (activeBurner) {
              const dx = activeBurner.transform.positionM[0] - inst.transform.positionM[0];
              const dz = activeBurner.transform.positionM[2] - inst.transform.positionM[2];
              const distHorizontalM = Math.sqrt(dx * dx + dz * dz);
              isDirectlyHeated = distHorizontalM <= 0.35;
            }
          }
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              baseLiquidLevelMl: baseMl,
              liquidLevelMl: Number((baseMl + displacedVolCm3).toFixed(1)),
              isHeating: arch === 'beaker-250' ? isDirectlyHeated : inst.instanceState.isHeating,
            },
          };
        }

        // 3. Overflow Can (Bình tràn Eureka chuẩn 210.0 ml):
        // Mực nước + thể tích vật chìm vượt quá 210.0 ml sẽ chảy tràn qua vòi; nước trong bình không bao giờ dâng vượt 210.0 ml.
        if (arch === 'overflow-can') {
          const curWaterMl = inst.instanceState.baseLiquidLevelMl ?? 210;
          let submergedVolCm3 = 0;
          for (const sub of rawInstances) {
            if (
              sub.visible &&
              sub.instanceState.attachedToInstanceId === inst.instanceId &&
              sub.instanceState.attachmentSlot === 'inside-vessel' &&
              assetsMap.get(sub.assetId)?.geometry.proceduralArchetype !==
                'thermometer'
            ) {
              const subAsset = assetsMap.get(sub.assetId);
              submergedVolCm3 +=
                subAsset?.scientificProperties.referenceVolume?.value ?? 24.5;
            }
          }
          const combinedMl = curWaterMl + submergedVolCm3;
          const spilledMl = Math.max(0, Number((combinedMl - 210).toFixed(1)));
          const remainingWaterMl = Math.max(
            0,
            Number((curWaterMl - spilledMl).toFixed(1)),
          );
          const displayedLevelMl = Number(
            Math.min(210, remainingWaterMl + submergedVolCm3).toFixed(1),
          );
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              baseLiquidLevelMl: remainingWaterMl,
              liquidLevelMl: displayedLevelMl,
              overflowingVolumeMl:
                spilledMl > 0
                  ? spilledMl
                  : submergedVolCm3 > 0
                    ? inst.instanceState.overflowingVolumeMl ?? 0
                    : 0,
              isValveOpen: inst.instanceState.isValveOpen ?? false,
            },
          };
        }

        // 4. Spring Dynamometer: sum of forces P = m * g of ALL items hooked onto it
        if (arch === 'spring-dynamometer') {
          let totalHookedMassG = 0;
          for (const sub of rawInstances) {
            if (
              sub.visible &&
              sub.instanceState.attachedToInstanceId === inst.instanceId &&
              sub.instanceState.attachmentSlot === 'dynamometer-hook'
            ) {
              totalHookedMassG += computeItemTotalMassG(sub);
            }
          }
          const totalForceN = Number((totalHookedMassG * 0.00980665).toFixed(2));
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              springExtensionN: totalForceN,
            },
          };
        }

        // 5. Vernier Caliper: if an object is currently attached to its jaws, sync jawOpeningMm to that object's exact diameter/width
        if (arch === 'vernier-caliper') {
          const clampedSub = rawInstances.find(
            (sub) =>
              sub.visible &&
              sub.instanceState.attachedToInstanceId === inst.instanceId &&
              sub.instanceState.attachmentSlot === 'caliper-jaws',
          );
          if (clampedSub) {
            const subAsset = assetsMap.get(clampedSub.assetId);
            const rawWidthMm =
              subAsset?.geometry.dimensions?.widthOrDiameter?.value ??
              (subAsset?.geometry.boundingBoxM.width ?? 0.026) * 1000;
            const widthMm = Number(
              Math.min(150, Math.max(1, rawWidthMm)).toFixed(2),
            );
            return {
              ...inst,
              instanceState: {
                ...inst.instanceState,
                jawOpeningMm: widthMm,
              },
            };
          }
        }

        // 6. Thermal Heating & Heat Transfer Solver (P06):
        // Bát sứ hoặc bình cầu chỉ nóng lên khi có ngọn lửa thực sự đang cháy bên dưới
        if (arch === 'porcelain-dish' || arch === 'distillation-flask') {
          let isDirectlyHeated = false;
          if (arch === 'distillation-flask') {
            isDirectlyHeated = Boolean(inst.instanceState.isHeating === true || inst.instanceState.isFlameLit === true);
          } else {
            const activeBurner = rawInstances.find((b) => {
              if (!b.visible) return false;
              const bArch = assetsMap.get(b.assetId)?.geometry.proceduralArchetype;
              return (
                (bArch === 'alcohol-burner' || bArch === 'distillation-flask') &&
                Boolean(b.instanceState.isHeating || b.instanceState.isFlameLit)
              );
            });
            if (activeBurner) {
              const dx = activeBurner.transform.positionM[0] - inst.transform.positionM[0];
              const dz = activeBurner.transform.positionM[2] - inst.transform.positionM[2];
              const distHorizontalM = Math.sqrt(dx * dx + dz * dz);
              const dy = inst.transform.positionM[1] - activeBurner.transform.positionM[1];
              isDirectlyHeated = distHorizontalM <= 0.35 && dy >= -0.05 && dy <= 0.35;
            }
          }
          const curTemp = inst.instanceState.temperatureC ?? 25.0;
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              isHeating: isDirectlyHeated,
              temperatureC: curTemp,
            },
          };
        }

        // Nhiệt kế đồng bộ nhiệt độ với bình chứa đang nhúng bên trong
        if (arch === 'thermometer') {
          if (inst.instanceState.attachedToInstanceId && inst.instanceState.attachmentSlot === 'inside-vessel') {
            const parentVessel = rawInstances.find((v) => v.instanceId === inst.instanceState.attachedToInstanceId);
            if (parentVessel) {
              return {
                ...inst,
                instanceState: {
                  ...inst.instanceState,
                  temperatureC: parentVessel.instanceState.temperatureC ?? 25.0,
                },
              };
            }
          }
        }

        // 7. Electromagnetic Induction & Galvanometer (P05):
        if (arch === 'induction-coil-led') {
          const defl = inst.instanceState.galvanometerDeflection ?? 0.0;
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              galvanometerDeflection: defl,
            },
          };
        }

        // 8. Digital Multimeter Real Circuit Measurement (P07):
        if (arch === 'digital-multimeter') {
          const mode = inst.instanceState.multimeterMode ?? 'DCV';
          const val = inst.instanceState.multimeterValue ?? 0.0;
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              multimeterMode: mode,
              multimeterValue: val,
            },
          };
        }

        // 9. Passive Optical Elements (P04):
        if (arch === 'semicircular-slab') {
          const activeLaser = rawInstances.find((src) => {
            if (!src.visible) return false;
            const sArch = assetsMap.get(src.assetId)?.geometry.proceduralArchetype;
            return sArch === 'laser-source' && src.instanceState.isPoweredOn === true;
          });
          return {
            ...inst,
            instanceState: {
              ...inst.instanceState,
              isLaserHit: Boolean(activeLaser || inst.instanceState.isLaserHit),
            },
          };
        }

        return inst;
      });
    },
    [assetsMap],
  );

  // Update Instance Transform (Preserves attached items on Electronic Balance pan when balance is rotated or moved)
  const handleUpdateInstanceTransform = useCallback(
    (
      instanceId: string,
      positionM: [number, number, number],
      rotationRad: [number, number, number],
      displayScale?: [number, number, number],
    ) => {
      setScene((prev) => {
        const updated = prev.instances.map((inst) =>
          inst.instanceId === instanceId
            ? {
                ...inst,
                transform: {
                  positionM,
                  rotationRad,
                  displayScale: displayScale ?? inst.transform.displayScale,
                },
              }
            : inst,
        );
        return {
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          updatedAt: new Date().toISOString(),
          instances: reconcileCumulativeLabMeasurements(updated),
        };
      });
    },
    [reconcileCumulativeLabMeasurements],
  );

  // Real-Life Physical Lab Docking Handler (Cumulative Multi-Object Balance Weighing, Liquid Pouring, Submersion, Dynamometer & Caliper)
  const handlePhysicalDockInteraction = useCallback(
    (
      draggedInstanceId: string,
      targetInstanceId: string | null,
      slot: PhysicalDockTargetSlot,
      finalPositionM: [number, number, number],
    ) => {
      const draggedInst = scene.instances.find(
        (i) => i.instanceId === draggedInstanceId,
      );
      if (!draggedInst) return;
      const draggedAsset = assetsMap.get(draggedInst.assetId);
      const dryMassG =
        draggedAsset?.scientificProperties.referenceMass?.value ?? 66.25;
      const draggedArch = draggedAsset?.geometry.proceduralArchetype;
      const isLiquidVessel =
        draggedArch === 'beaker-250' ||
        draggedArch === 'graduated-cylinder' ||
        draggedArch === 'erlenmeyer-flask' ||
        draggedArch === 'porcelain-dish';
      const waterMassG = isLiquidVessel
        ? draggedInst.instanceState.baseLiquidLevelMl ??
          draggedInst.instanceState.liquidLevelMl ??
          0
        : 0;
      const singleItemMassG = Number((dryMassG + waterMassG).toFixed(2));
      const specimenVolumeCm3 =
        draggedArch === 'thermometer'
          ? 0
          : draggedAsset?.scientificProperties.referenceVolume?.value ?? 24.5;
      const specimenWidthMm = Number(
        ((draggedAsset?.geometry.boundingBoxM.width ?? 0.025) * 1000).toFixed(1),
      );

      const targetInst = targetInstanceId
        ? scene.instances.find((i) => i.instanceId === targetInstanceId)
        : null;
      const targetAsset = targetInst ? assetsMap.get(targetInst.assetId) : null;
      const targetArch = targetAsset?.geometry.proceduralArchetype;

      // Calculate liquid transfer amount if slot === 'pour-liquid'
      const sourceAvailMl =
        draggedInst.instanceState.baseLiquidLevelMl ??
        draggedInst.instanceState.liquidLevelMl ??
        40;
      const targetCapMl =
        targetArch === 'overflow-can'
          ? 210
          : targetAsset?.scientificProperties.capacity?.value ?? 100;
      const targetCurBaseMl =
        targetInst?.instanceState.baseLiquidLevelMl ??
        targetInst?.instanceState.liquidLevelMl ??
        targetCapMl * 0.5;
      const defaultPourAmt =
        targetArch === 'overflow-can' && targetCurBaseMl < 210
          ? Math.min(50, 210 - targetCurBaseMl)
          : 20;
      const pourAmountMl =
        slot === 'pour-liquid'
          ? Math.max(
              0,
              Math.min(defaultPourAmt, sourceAvailMl, targetCapMl - targetCurBaseMl),
            )
          : 0;

      // Calculate automatic water dispensing when docking a vessel with the Water Dispenser ('dispenser-outlet')
      const isDraggingDispenser = draggedArch === 'water-dispenser';
      const dispenserPeer =
        slot === 'dispenser-outlet'
          ? isDraggingDispenser
            ? draggedInst
            : targetInst
          : null;
      const vesselPeer =
        slot === 'dispenser-outlet'
          ? isDraggingDispenser
            ? targetInst
            : draggedInst
          : null;
      const vesselPeerAsset = vesselPeer
        ? assetsMap.get(vesselPeer.assetId)
        : null;
      const vesselPeerArch = vesselPeerAsset?.geometry.proceduralArchetype;
      const vesselPeerCapMl =
        vesselPeerArch === 'overflow-can'
          ? 210
          : vesselPeerAsset?.scientificProperties.capacity?.value ?? 100;
      const vesselPeerCurBaseMl =
        vesselPeer?.instanceState.baseLiquidLevelMl ??
        vesselPeer?.instanceState.liquidLevelMl ??
        vesselPeerCapMl * 0.5;
      const dispenserAvailMl =
        dispenserPeer?.instanceState.liquidLevelMl ?? 850;
      const desiredAutoDispenseMl =
        vesselPeerArch === 'overflow-can' && vesselPeerCurBaseMl < 210
          ? Math.max(0, 210 - vesselPeerCurBaseMl)
          : Math.max(0, Math.min(25, vesselPeerCapMl - vesselPeerCurBaseMl));
      const autoDispenseMl =
        slot === 'dispenser-outlet'
          ? Math.max(0, Math.min(desiredAutoDispenseMl, dispenserAvailMl))
          : 0;

      // Thermal reading if dragging thermometer into a vessel (P06)
      const measuredTempC =
        draggedArch === 'thermometer' && slot === 'inside-vessel'
          ? (targetArch === 'porcelain-dish' ||
              targetArch === 'distillation-flask') &&
            Boolean(targetInst?.instanceState.isHeating === true)
            ? (targetInst?.instanceState.temperatureC ?? 78.5)
            : 25.0
          : draggedInst.instanceState.temperatureC;

      const isOverflowCan = targetArch === 'overflow-can';

      // Bidirectional Vernier Caliper Measurement Docking ('caliper-jaws'):
      // Either an object is dragged into the caliper OR the caliper itself is dragged onto an object!
      const isDraggingCaliper = draggedArch === 'vernier-caliper';
      const caliperPeer =
        slot === 'caliper-jaws'
          ? isDraggingCaliper
            ? draggedInst
            : targetInst
          : null;
      const measuredPeer =
        slot === 'caliper-jaws'
          ? isDraggingCaliper
            ? targetInst
            : draggedInst
          : null;
      const measuredPeerAsset = measuredPeer
        ? assetsMap.get(measuredPeer.assetId)
        : null;
      const measuredPeerWidthMm = Number(
        Math.min(
          150,
          Math.max(
            1,
            measuredPeerAsset?.geometry.dimensions?.widthOrDiameter?.value ??
              (measuredPeerAsset?.geometry.boundingBoxM.width ?? 0.026) * 1000,
          ),
        ).toFixed(2),
      );

      const targetWasOnShelf =
        Boolean(targetInst) &&
        targetInst?.instanceState.attachmentSlot === 'shelf' &&
        slot !== 'shelf' &&
        slot !== 'bench';
      const targetBenchOrigin: [number, number, number] | null = targetInst
        ? targetWasOnShelf
          ? [
              targetArch === 'electronic-balance'
                ? -0.22
                : targetArch === 'graduated-cylinder'
                  ? 0.06
                  : targetArch === 'overflow-can'
                    ? 0.10
                    : targetArch === 'beaker-250'
                      ? 0.24
                      : targetArch === 'spring-dynamometer'
                        ? -0.14
                        : targetArch === 'alcohol-burner'
                          ? 0.00
                          : Number(
                              Math.max(
                                -0.55,
                                Math.min(0.55, targetInst.transform.positionM[0]),
                              ).toFixed(3),
                            ),
              0,
              0.08,
            ]
          : targetInst.transform.positionM
        : null;

      let effectiveFinalPosM = finalPositionM;
      if (targetWasOnShelf && targetBenchOrigin) {
        if (slot === 'balance-pan') {
          const rotY = targetInst?.transform.rotationRad[1] ?? 0;
          effectiveFinalPosM = [
            Number((targetBenchOrigin[0] - Math.sin(rotY) * 0.02).toFixed(3)),
            0.068,
            Number((targetBenchOrigin[2] - Math.cos(rotY) * 0.02).toFixed(3)),
          ];
        } else if (slot === 'inside-vessel') {
          effectiveFinalPosM = [
            targetBenchOrigin[0],
            0.016,
            targetBenchOrigin[2],
          ];
        } else if (slot === 'dynamometer-hook') {
          effectiveFinalPosM = [
            targetBenchOrigin[0],
            0.02,
            targetBenchOrigin[2],
          ];
        }
      }

      const unitScale: [number, number, number] = [1, 1, 1];
      const draftInstances: SceneInstance[] = scene.instances.map(
        (inst): SceneInstance => {
        // Case A0: Bidirectional Vernier Caliper Measurement ('caliper-jaws')
        if (slot === 'caliper-jaws' && caliperPeer && measuredPeer) {
          if (inst.instanceId === caliperPeer.instanceId) {
            const isCalOnShelf = inst.instanceState.attachmentSlot === 'shelf';
            return {
              ...inst,
              transform:
                inst.instanceId === draggedInstanceId
                  ? {
                      ...inst.transform,
                      positionM: effectiveFinalPosM,
                      displayScale: [1, 1, 1],
                    }
                  : isCalOnShelf
                    ? {
                        ...inst.transform,
                        positionM: [-0.08, 0, 0.16] as [number, number, number],
                        displayScale: [1, 1, 1],
                      }
                    : inst.transform,
              instanceState: {
                ...inst.instanceState,
                ...(isCalOnShelf
                  ? { attachedToInstanceId: null, attachmentSlot: 'bench' as const }
                  : {}),
                jawOpeningMm: measuredPeerWidthMm,
              },
            };
          }
          if (inst.instanceId === measuredPeer.instanceId) {
            return {
              ...inst,
              transform:
                inst.instanceId === draggedInstanceId
                  ? {
                      ...inst.transform,
                      positionM: effectiveFinalPosM,
                      displayScale: [1, 1, 1],
                    }
                  : { ...inst.transform, displayScale: [1, 1, 1] },
              instanceState: {
                ...inst.instanceState,
                attachedToInstanceId: caliperPeer.instanceId,
                attachmentSlot: 'caliper-jaws' as const,
              },
            };
          }
          // Release any previous item that was clamped in this caliper's jaws so only 1 object is clamped at a time
          if (
            inst.instanceState.attachedToInstanceId === caliperPeer.instanceId &&
            inst.instanceState.attachmentSlot === 'caliper-jaws'
          ) {
            return {
              ...inst,
              transform: {
                ...inst.transform,
                positionM: [
                  Number((caliperPeer.transform.positionM[0] - 0.145).toFixed(3)),
                  0,
                  Number((caliperPeer.transform.positionM[2] + 0.055).toFixed(3)),
                ] as [number, number, number],
              },
              instanceState: {
                ...inst.instanceState,
                attachedToInstanceId: null,
                attachmentSlot: 'bench' as const,
              },
            };
          }
        }

        // Case A: Dispenser-Outlet Docking (either vessel dragged to dispenser OR dispenser dragged to vessel)
        if (slot === 'dispenser-outlet' && dispenserPeer && vesselPeer) {
          if (inst.instanceId === dispenserPeer.instanceId) {
            const nextDispMl = Math.max(
              0,
              Number((dispenserAvailMl - autoDispenseMl).toFixed(1)),
            );
            const isDispOnShelf = inst.instanceState.attachmentSlot === 'shelf';
            return {
              ...inst,
              transform:
                inst.instanceId === draggedInstanceId
                  ? {
                      ...inst.transform,
                      positionM: effectiveFinalPosM,
                      displayScale: [1, 1, 1],
                    }
                  : isDispOnShelf
                    ? {
                        ...inst.transform,
                        positionM: [0.35, 0, 0.08] as [number, number, number],
                        displayScale: [1, 1, 1],
                      }
                    : inst.transform,
              instanceState: {
                ...inst.instanceState,
                ...(isDispOnShelf
                  ? { attachedToInstanceId: null, attachmentSlot: 'bench' as const }
                  : {}),
                baseLiquidLevelMl: nextDispMl,
                liquidLevelMl: nextDispMl,
                isValveOpen: autoDispenseMl > 0.1,
              },
            };
          }
          if (inst.instanceId === vesselPeer.instanceId) {
            const nextVesselMl = Number(
              (vesselPeerCurBaseMl + autoDispenseMl).toFixed(1),
            );
            const dispRotY = dispenserPeer.transform.rotationRad[1] ?? 0;
            const dispPos = isDraggingDispenser
              ? effectiveFinalPosM
              : dispenserPeer.instanceState.attachmentSlot === 'shelf'
                ? [0.35, 0, 0.08]
                : dispenserPeer.transform.positionM;
            const dockSpoutPos: [number, number, number] = [
              Number((dispPos[0] + Math.cos(dispRotY) * 0.095).toFixed(3)),
              0,
              Number((dispPos[2] - Math.sin(dispRotY) * 0.095).toFixed(3)),
            ];
            return {
              ...inst,
              transform: {
                ...inst.transform,
                positionM: isDraggingDispenser ? dockSpoutPos : effectiveFinalPosM,
                displayScale: [1, 1, 1],
              },
              instanceState: {
                ...inst.instanceState,
                baseLiquidLevelMl: nextVesselMl,
                liquidLevelMl: nextVesselMl,
                overflowingVolumeMl: 0,
                attachedToInstanceId: dispenserPeer.instanceId,
                attachmentSlot: 'dispenser-outlet' as const,
              },
            };
          }
        }

        // Nếu dụng cụ cha được thảy lên Khu trưng bày ('shelf'), tách các vật con đang gắn vào nó về lại mặt bàn
        if (
          slot === 'shelf' &&
          inst.instanceState.attachedToInstanceId === draggedInstanceId
        ) {
          return {
            ...inst,
            transform: {
              ...inst.transform,
              positionM: [
                inst.transform.positionM[0],
                0,
                Math.max(-0.22, inst.transform.positionM[2]),
              ] as [number, number, number],
            },
            instanceState: {
              ...inst.instanceState,
              attachedToInstanceId: null,
              attachmentSlot: 'bench' as const,
            },
          };
        }

        if (inst.instanceId === draggedInstanceId) {
          const curBaseMl =
            inst.instanceState.baseLiquidLevelMl ??
            inst.instanceState.liquidLevelMl ??
            40;
          const nextLiquidMl =
            slot === 'pour-liquid'
              ? Math.max(0, curBaseMl - pourAmountMl)
              : inst.instanceState.liquidLevelMl;
          return {
            ...inst,
            transform: {
              ...inst.transform,
              positionM: effectiveFinalPosM,
              displayScale: slot === 'shelf' ? inst.transform.displayScale : [1, 1, 1],
            },
            instanceState: {
              ...inst.instanceState,
              temperatureC: measuredTempC,
              liquidLevelMl: nextLiquidMl,
              baseLiquidLevelMl:
                slot === 'pour-liquid'
                  ? nextLiquidMl
                  : inst.instanceState.baseLiquidLevelMl,
              // If pouring liquid, on bench, or placed onto Khu trưng bày ('shelf'), clear parent attachment
              attachedToInstanceId:
                slot === 'pour-liquid' || slot === 'bench' || slot === 'shelf'
                  ? null
                  : targetInstanceId,
              attachmentSlot:
                slot === 'pour-liquid' ? 'bench' : slot,
            },
          };
        }

        const instAsset = assetsMap.get(inst.assetId);
        const arch = instAsset?.geometry.proceduralArchetype;

        // Pouring target vessel receives water (updates its baseLiquidLevelMl)
        if (slot === 'pour-liquid' && inst.instanceId === targetInstanceId) {
          const nextMl = Number((targetCurBaseMl + pourAmountMl).toFixed(1));
          return {
            ...inst,
            ...(targetWasOnShelf && targetBenchOrigin
              ? {
                  transform: {
                    ...inst.transform,
                    positionM: targetBenchOrigin,
                    displayScale: [1, 1, 1] as [number, number, number],
                  },
                }
              : {}),
            instanceState: {
              ...inst.instanceState,
              ...(targetWasOnShelf
                ? { attachedToInstanceId: null, attachmentSlot: 'bench' as const }
                : {}),
              liquidLevelMl: nextMl,
              baseLiquidLevelMl: nextMl,
            },
          };
        }

        // Overflow Can activates transient spout stream ONLY while excess water (> 210.0 ml) is actively spilling
        if (
          arch === 'overflow-can' &&
          slot === 'inside-vessel' &&
          inst.instanceId === targetInstanceId &&
          draggedArch !== 'thermometer' &&
          draggedInst.instanceState.attachedToInstanceId !== targetInstanceId
        ) {
          const canCurLevelMl = inst.instanceState.liquidLevelMl ?? 210;
          const actualSpillMl = Math.max(
            0,
            Number((canCurLevelMl + specimenVolumeCm3 - 210).toFixed(1)),
          );
          return {
            ...inst,
            ...(targetWasOnShelf && targetBenchOrigin
              ? {
                  transform: {
                    ...inst.transform,
                    positionM: targetBenchOrigin,
                    displayScale: [1, 1, 1] as [number, number, number],
                  },
                }
              : {}),
            instanceState: {
              ...inst.instanceState,
              ...(targetWasOnShelf
                ? { attachedToInstanceId: null, attachmentSlot: 'bench' as const }
                : {}),
              isValveOpen: actualSpillMl > 0.05,
            },
          };
        }

        // Beaker catches actual overflow water exceeding 210.0 ml when a specimen is newly dropped into Overflow Can
        if (
          arch === 'beaker-250' &&
          slot === 'inside-vessel' &&
          isOverflowCan &&
          targetInst &&
          draggedArch !== 'thermometer' &&
          draggedInst.instanceState.attachedToInstanceId !== targetInstanceId
        ) {
          const ovfPos = targetBenchOrigin ?? targetInst.transform.positionM;
          const canCurLevelMl = targetInst.instanceState.liquidLevelMl ?? 210;
          const actualSpillMl = Math.max(
            0,
            Number((canCurLevelMl + specimenVolumeCm3 - 210).toFixed(1)),
          );
          const curBeakerBase =
            inst.instanceState.baseLiquidLevelMl ??
            inst.instanceState.liquidLevelMl ??
            40;
          const nextBeakerMl = Number(
            (curBeakerBase + actualSpillMl).toFixed(1),
          );
          // Automatically position beaker right under the overflow spout (+X side of overflow can)
          const nextBeakerPos: [number, number, number] =
            inst.instanceState.attachmentSlot === 'balance-pan'
              ? inst.transform.positionM
              : [
                  Number(Math.min(1.15, ovfPos[0] + 0.122).toFixed(3)),
                  0,
                  Number(ovfPos[2].toFixed(3)),
                ];
          return {
            ...inst,
            transform: {
              ...inst.transform,
              positionM: nextBeakerPos,
              displayScale: [1, 1, 1],
            },
            instanceState: {
              ...inst.instanceState,
              attachedToInstanceId:
                inst.instanceState.attachmentSlot === 'shelf'
                  ? null
                  : inst.instanceState.attachedToInstanceId,
              attachmentSlot:
                inst.instanceState.attachmentSlot === 'shelf'
                  ? ('bench' as const)
                  : inst.instanceState.attachmentSlot,
              baseLiquidLevelMl: nextBeakerMl,
              liquidLevelMl: nextBeakerMl,
            },
          };
        }

        // Vernier Caliper jaw measurement
        if (arch === 'vernier-caliper') {
          if (slot === 'caliper-jaws' && inst.instanceId === targetInstanceId) {
            return {
              ...inst,
              ...(targetWasOnShelf && targetBenchOrigin
                ? {
                    transform: {
                      ...inst.transform,
                      positionM: targetBenchOrigin,
                      displayScale: [1, 1, 1] as [number, number, number],
                    },
                  }
                : {}),
              instanceState: {
                ...inst.instanceState,
                ...(targetWasOnShelf
                  ? { attachedToInstanceId: null, attachmentSlot: 'bench' as const }
                  : {}),
                jawOpeningMm: specimenWidthMm,
              },
            };
          }
        }

        // Bring any other target apparatus (e.g. Electronic Balance, Graduated Cylinder, Dynamometer) down from shelf to bench
        if (targetWasOnShelf && inst.instanceId === targetInstanceId && targetBenchOrigin) {
          return {
            ...inst,
            transform: {
              ...inst.transform,
              positionM: targetBenchOrigin,
              displayScale: [1, 1, 1],
            },
            instanceState: {
              ...inst.instanceState,
              attachedToInstanceId: null,
              attachmentSlot: 'bench' as const,
            },
          };
        }

        return inst;
      });

      const reconciledInstances =
        reconcileCumulativeLabMeasurements(draftInstances);

      setScene((prev) => ({
        ...prev,
        sceneRevision: prev.sceneRevision + 1,
        updatedAt: new Date().toISOString(),
        instances: reconciledInstances,
      }));

      // Cập nhật Assembly Graph theo chuẩn RWSS v1.1.1 (ASM-03, ASM-09, ASM-10, ASM-17)
      if (slot === 'bench' || slot === 'shelf' || slot === 'pour-liquid') {
        assemblyGraph.detach(draggedInstanceId);
      } else if (targetInstanceId) {
        let targetConnId = 'CONN_BALANCE_PAN';
        let relType: AssemblyRelationType = 'mechanical_dock';
        if (slot === 'balance-pan') {
          targetConnId = 'CONN_BALANCE_PAN';
          relType = 'mechanical_dock';
        } else if (slot === 'inside-vessel') {
          relType = 'submersion';
          if (targetArch === 'graduated-cylinder') targetConnId = 'CONN_CYLINDER_APERTURE';
          else if (targetArch === 'overflow-can') targetConnId = 'CONN_OVERFLOW_CAN_APERTURE';
          else targetConnId = 'CONN_BEAKER_RIM';
        } else if (slot === 'dispenser-outlet') {
          targetConnId = 'CONN_WATER_DISPENSER_SPOUT';
          relType = 'fluid_coupling';
        } else if (slot === 'dynamometer-hook') {
          targetConnId = 'CONN_SPRING_DYNO_HOOK';
          relType = 'mechanical_dock';
        } else if (slot === 'caliper-jaws') {
          targetConnId = 'CONN_VERNIER_CALIPER_JAWS';
          relType = 'mechanical_dock';
        } else if (slot === 'optical-bench-rail') {
          targetConnId = 'CONN_OPTICAL_BENCH_RAIL';
          relType = 'optical_alignment';
        }
        assemblyGraph.attach(
          draggedInstanceId,
          `CONN_${(draggedArch || 'SPECIMEN').toUpperCase().replace(/-/g, '_')}_MATE`,
          targetInstanceId,
          targetConnId,
          relType,
          finalPositionM,
          [0, 0, 0],
          { slot },
        );
      }

      // Sync student data table & toast notifications with the reconciled cumulative values
      const activeBalance = reconciledInstances.find(
        (i) =>
          assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
          'electronic-balance',
      );
      if (activeBalance) {
        const netMassG = Math.max(
          0,
          (activeBalance.instanceState.measuredMassG ?? 0) -
            (activeBalance.instanceState.tareOffsetG ?? 0),
        );
        if (netMassG > 0) {
          setMeasuredMassG(Number(netMassG.toFixed(2)));
        }
      }

      if (slot === 'balance-pan' && targetInstanceId) {
        const updatedBalance = reconciledInstances.find(
          (i) => i.instanceId === targetInstanceId,
        );
        const itemsOnPanCount = reconciledInstances.filter(
          (i) =>
            i.visible &&
            i.instanceState.attachedToInstanceId === targetInstanceId &&
            i.instanceState.attachmentSlot === 'balance-pan',
        ).length;
        const rawTotalG = updatedBalance?.instanceState.measuredMassG ?? singleItemMassG;
        const tareG = updatedBalance?.instanceState.tareOffsetG ?? 0;
        const netDisplayG = Math.max(0, rawTotalG - tareG);

        if (studentGuidedStep < 2) setStudentGuidedStep(2);
        labSoundEngine.play('scale-place', {
          value: netDisplayG,
          fillRatio: Math.min(1, netDisplayG / 500),
        });
        notify(
          itemsOnPanCount > 1
            ? `Đã đặt thêm "${draggedInst.customLabel || draggedAsset?.name.vi}" (+${singleItemMassG.toFixed(2)} g) lên Cân điện tử → Tổng ${itemsOnPanCount} vật: m = ${netDisplayG.toFixed(2)} g`
            : `Đã đặt "${draggedInst.customLabel || draggedAsset?.name.vi}" lên Cân điện tử: m = ${netDisplayG.toFixed(2)} g`,
          'success',
        );
      } else if (
        draggedInst.instanceState.attachmentSlot === 'balance-pan' &&
        slot !== 'balance-pan'
      ) {
        const prevBalanceId = draggedInst.instanceState.attachedToInstanceId;
        const updatedBalance = reconciledInstances.find(
          (i) => i.instanceId === prevBalanceId,
        );
        const remainingG = Math.max(
          0,
          (updatedBalance?.instanceState.measuredMassG ?? 0) -
            (updatedBalance?.instanceState.tareOffsetG ?? 0),
        );
        labSoundEngine.play('wood-place', { intensity: 0.85 });
        notify(
          `Đã lấy "${draggedInst.customLabel || draggedAsset?.name.vi}" (-${singleItemMassG.toFixed(2)} g) khỏi đĩa cân → Khối lượng còn lại trên cân: ${remainingG.toFixed(2)} g`,
          'info',
        );
      } else if (slot === 'dispenser-outlet' && dispenserPeer && vesselPeer) {
        const newVesselMl = Number(
          (vesselPeerCurBaseMl + autoDispenseMl).toFixed(1),
        );
        if (vesselPeerArch === 'graduated-cylinder') {
          setInitialVolumeCm3(newVesselMl);
        }
        if (autoDispenseMl > 0.1) {
          const dispId = dispenserPeer.instanceId;
          window.setTimeout(() => {
            setScene((prev) => ({
              ...prev,
              instances: prev.instances.map((item) =>
                item.instanceId === dispId
                  ? {
                      ...item,
                      instanceState: {
                        ...item.instanceState,
                        isValveOpen: false,
                      },
                    }
                  : item,
              ),
            }));
          }, 1150);
          labSoundEngine.play('water-pour', {
            fillRatio: Math.min(1, newVesselMl / Math.max(10, vesselPeerCapMl)),
            intensity: 1,
          });
          notify(
            `Đã đặt "${vesselPeer.customLabel || vesselPeerAsset?.name.vi}" vào khay hứng vòi Bình cấp nước và xả +${autoDispenseMl.toFixed(1)} ml (Mực nước: ${newVesselMl.toFixed(1)} / ${vesselPeerCapMl} ml).`,
            'success',
          );
        } else {
          labSoundEngine.play('glass-clink', { intensity: 0.7 });
          notify(
            `Đã đặt "${vesselPeer.customLabel || vesselPeerAsset?.name.vi}" dưới vòi Bình cấp nước (Hiện tại: ${newVesselMl.toFixed(1)} / ${vesselPeerCapMl} ml).`,
            'info',
          );
        }
      } else if (slot === 'pour-liquid') {
        if (pourAmountMl > 0) {
          const updatedTarget = reconciledInstances.find(
            (i) => i.instanceId === targetInstanceId,
          );
          const newTargetMl =
            updatedTarget?.instanceState.liquidLevelMl ??
            targetCurBaseMl + pourAmountMl;
          if (targetArch === 'graduated-cylinder') {
            setInitialVolumeCm3(Number(newTargetMl.toFixed(1)));
          }
          const capVal =
            targetArch === 'overflow-can'
              ? 210
              : targetAsset?.scientificProperties.capacity?.value ?? 100;
          labSoundEngine.play('water-pour', {
            fillRatio: Math.min(1, newTargetMl / Math.max(10, capVal)),
            intensity: 1,
          });
          notify(
            `Đã nghiêng rót +${pourAmountMl.toFixed(1)} ml nước từ ${draggedAsset?.name.vi} sang ${targetAsset?.name.vi} (Mực nước mới: ${newTargetMl.toFixed(1)} ml).`,
            'success',
          );
        } else {
          labSoundEngine.play('glass-clink', { intensity: 0.7 });
          notify(
            `${targetAsset?.name.vi} đã đầy hoặc bình nguồn đã hết nước.`,
            'warning',
          );
        }
      } else if (slot === 'inside-vessel') {
        if (draggedArch === 'thermometer') {
          labSoundEngine.play('probe-measure', {
            value: measuredTempC ?? 25,
          });
          notify(
            `Nhiệt kế rượu đo nhiệt độ tại ${targetAsset?.name.vi}: T = ${(measuredTempC ?? 25).toFixed(1)} °C`,
            'success',
          );
        } else {
          const updatedVessel = reconciledInstances.find(
            (i) => i.instanceId === targetInstanceId,
          );
          const nextV2 =
            updatedVessel?.instanceState.liquidLevelMl ??
            initialVolumeCm3 + specimenVolumeCm3;
          const baseV1 =
            updatedVessel?.instanceState.baseLiquidLevelMl ?? initialVolumeCm3;
          setFinalVolumeCm3(Number(nextV2.toFixed(1)));
          if (studentGuidedStep < 3) setStudentGuidedStep(3);
          const isOverflowCan =
            targetAsset?.geometry.proceduralArchetype === 'overflow-can';
          if (isOverflowCan && targetInstanceId) {
            window.setTimeout(() => {
              setScene((prev) => ({
                ...prev,
                instances: prev.instances.map((item) =>
                  item.instanceId === targetInstanceId
                    ? {
                        ...item,
                        instanceState: {
                          ...item.instanceState,
                          isValveOpen: false,
                        },
                      }
                    : item,
                ),
              }));
            }, 1350);
          }
          labSoundEngine.play(
            isOverflowCan ? 'water-overflow' : 'water-splash',
            {
              fillRatio: Math.min(1, nextV2 / 100),
              intensity: 1,
            },
          );
          notify(
            isOverflowCan
              ? `Đã thả ngập vật vào Bình tràn: ${specimenVolumeCm3.toFixed(1)} ml nước tràn qua vòi chảy sang Cốc thủy tinh!`
              : `Đã nhúng ngập vật rắn: Mực nước dâng lên V₂ = ${nextV2.toFixed(1)} cm³ (Tổng ΔV = +${(nextV2 - baseV1).toFixed(1)} cm³)`,
            'success',
          );
        }
      } else if (slot === 'dynamometer-hook') {
        const updatedDyn = reconciledInstances.find(
          (i) => i.instanceId === targetInstanceId,
        );
        const totalForceN = updatedDyn?.instanceState.springExtensionN ?? 0;
        labSoundEngine.play('spring-stretch', { value: totalForceN });
        notify(
          `Đã treo vật vào Lực kế lò xo: Tổng trọng lượng P = ${totalForceN.toFixed(2)} N`,
          'success',
        );
      } else if (slot === 'caliper-jaws') {
        const finalWidthMm = measuredPeer ? measuredPeerWidthMm : specimenWidthMm;
        const mainMm = Math.floor(finalWidthMm + 1e-6);
        const vernierMm = Math.max(0, Number((finalWidthMm - mainMm).toFixed(2)));
        const kTick = Math.round(vernierMm / 0.02);
        const itemLabel =
          measuredPeer?.customLabel ||
          measuredPeerAsset?.name.vi ||
          draggedInst.customLabel ||
          draggedAsset?.name.vi ||
          'vật mẫu';
        labSoundEngine.play('caliper-slide', { value: finalWidthMm });
        notify(
          `📏 Thước cặp du xích kẹp đo "${itemLabel}": d = ${finalWidthMm.toFixed(2)} mm (Thước chính ${mainMm} mm + Du xích ${vernierMm.toFixed(2)} mm, vạch trùng k = ${kTick})`,
          'success',
        );
      } else if (slot === 'optical-bench-rail') {
        const updatedRider = reconciledInstances.find(
          (i) => i.instanceId === draggedInstanceId,
        );
        const railCm = updatedRider?.instanceState.railCoordCm ?? 0;
        const dCm = updatedRider?.instanceState.objectDistanceDCm ?? 20;
        const dPrimeCm = updatedRider?.instanceState.projectedImageDPrimeCm ?? 20;
        labSoundEngine.play('mechanical-click', { value: Math.abs(railCm) });
        notify(
          `🔬 Đã lắp "${draggedInst.customLabel || draggedAsset?.name.vi}" lên ray Giá quang học tại vạch x = ${railCm >= 0 ? '+' : ''}${railCm.toFixed(1)} cm (d = ${dCm.toFixed(1)} cm, d' = ${Math.abs(dPrimeCm) > 900 ? '∞' : `${dPrimeCm.toFixed(1)} cm`}).`,
          'success',
        );
      } else if (slot === 'shelf') {
        labSoundEngine.play('wood-place', { intensity: 0.7 });
        notify(
          `✨ Đã đưa "${draggedInst.customLabel || draggedAsset?.name.vi}" vào Khu trưng bày (Cất khỏi mặt bàn thực hành).`,
          'info',
        );
      } else {
        labSoundEngine.play(
          draggedAsset?.materialCategory === 'borosilicate-glass'
            ? 'glass-clink'
            : 'wood-place',
          { intensity: 0.75 },
        );
        if (draggedInst.instanceState.attachmentSlot === 'shelf') {
          notify(
            `Đã lấy "${draggedInst.customLabel || draggedAsset?.name.vi}" từ Khu trưng bày xuống mặt bàn thực hành.`,
            'success',
          );
        }
      }
    },
    [
      scene.instances,
      assetsMap,
      initialVolumeCm3,
      studentGuidedStep,
      reconcileCumulativeLabMeasurements,
      notify,
    ],
  );

  // Quick helper: automatically place specimen onto Electronic Balance pan (respects 360° balance rotation)
  const handleQuickWeighSpecimen = useCallback(() => {
    const specimen = scene.instances.find((i) => {
      const a = assetsMap.get(i.assetId);
      return (
        a?.geometry.proceduralArchetype === 'solid-cylinder' ||
        a?.geometry.proceduralArchetype === 'solid-block' ||
        a?.geometry.proceduralArchetype === 'solid-sphere'
      );
    });
    const balance = scene.instances.find(
      (i) =>
        assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
        'electronic-balance',
    );
    if (!specimen || !balance) return;

    const balanceBenchPos: [number, number, number] =
      balance.instanceState.attachmentSlot === 'shelf'
        ? [-0.22, 0, 0.08]
        : balance.transform.positionM;
    const rotY = balance.transform.rotationRad[1] ?? 0;
    const targetPos: [number, number, number] = [
      Number((balanceBenchPos[0] - Math.sin(rotY) * 0.02).toFixed(3)),
      0.068,
      Number((balanceBenchPos[2] - Math.cos(rotY) * 0.02).toFixed(3)),
    ];
    setSelectedInstanceId(specimen.instanceId);
    handlePhysicalDockInteraction(
      specimen.instanceId,
      balance.instanceId,
      'balance-pan',
      targetPos,
    );
  }, [scene.instances, assetsMap, handlePhysicalDockInteraction]);

  // Quick helper: automatically submerge specimen into the 100 ml Graduated Cylinder
  const handleQuickSubmergeSpecimen = useCallback(() => {
    const specimen = scene.instances.find((i) => {
      const a = assetsMap.get(i.assetId);
      return (
        a?.geometry.proceduralArchetype === 'solid-cylinder' ||
        a?.geometry.proceduralArchetype === 'solid-block' ||
        a?.geometry.proceduralArchetype === 'solid-sphere'
      );
    });
    const cylinder = scene.instances.find(
      (i) =>
        assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
        'graduated-cylinder',
    );
    if (!specimen || !cylinder) return;

    const cylBenchPos: [number, number, number] =
      cylinder.instanceState.attachmentSlot === 'shelf'
        ? [0.06, 0, 0.08]
        : cylinder.transform.positionM;
    const targetPos: [number, number, number] = [
      cylBenchPos[0],
      0.016,
      cylBenchPos[2],
    ];
    setSelectedInstanceId(specimen.instanceId);
    handlePhysicalDockInteraction(
      specimen.instanceId,
      cylinder.instanceId,
      'inside-vessel',
      targetPos,
    );
  }, [scene.instances, assetsMap, handlePhysicalDockInteraction]);

  const handleQuickLabActionRef = useRef<(action: QuickLabActionType, instanceId: string) => void>(() => {});

  // Guided Step Change Handler
  const handleChangeStudentGuidedStep = useCallback(
    (nextStep: StudentGuidedStepNumber) => {
      setStudentGuidedStep(nextStep);
      labSoundEngine.play('step-complete', 0.85);

      const expId = activeExperiment.experimentId;
      const isDensity =
        expId === 'OL3D-EXP-DENSITY-SOLID-0001' ||
        expId === 'OL3D-EXP-DENSITY-0001';
      const isOptics = expId === 'OL3D-EXP-OPTICS-LENS-0001';
      const isDisplacement = expId === 'OL3D-EXP-DISPLACEMENT-0001';
      const isThermal = expId === 'OL3D-EXP-THERMAL-BOIL-0001';

      if (isDensity) {
        if (nextStep === 1) {
          handlePlaceAllRequiredForExperiment();
        } else if (nextStep === 2) {
          handleQuickWeighSpecimen();
        } else if (nextStep === 3) {
          handleQuickSubmergeSpecimen();
        } else if (nextStep === 4 || nextStep === 5) {
          if (measuredMassG !== null && finalVolumeCm3 !== null) {
            const v = finalVolumeCm3 - initialVolumeCm3;
            const rho = (measuredMassG / Math.max(0.1, v)).toFixed(2);
            notify(
              `Khối lượng riêng thực nghiệm: $\\rho = \\frac{m}{V} = \\frac{${measuredMassG}}{${v.toFixed(1)}} = ${rho}\\,\\text{g/cm}^3$.`,
              'success',
            );
          }
        }
      } else if (isOptics) {
        if (nextStep === 1) {
          handlePlaceAllRequiredForExperiment();
        } else if (nextStep === 2) {
          handleQuickLabActionRef.current('assemble-optical-bench', selectedInstanceId ?? '');
        } else if (nextStep === 3) {
          notify(
            'Ảnh thật chữ F trên màn đạt độ sắc nét cao nhất ($d\' = 20.0\\,\\text{cm},\\ d = 20.0\\,\\text{cm},\\ f = 10.0\\,\\text{cm}$).',
            'success',
          );
        } else if (nextStep === 4) {
          notify(
            'Khảo sát ảnh ảo: Khi dịch vật vào trong khoảng tiêu cự ($d < f = 10\\,\\text{cm}$), ảnh chữ F cùng chiều, lớn hơn vật ($k > 0$).',
            'info',
          );
        }
      } else if (isDisplacement) {
        if (nextStep === 1) {
          handlePlaceAllRequiredForExperiment();
        } else if (nextStep === 2) {
          const dyn = scene.instances.find(
            (i) => assetsMap.get(i.assetId)?.geometry.proceduralArchetype === 'spring-dynamometer',
          );
          const sp = scene.instances.find((i) => {
            const a = assetsMap.get(i.assetId);
            return a?.geometry.proceduralArchetype === 'solid-cylinder' || a?.kind === 'specimen';
          });
          if (dyn && sp) {
            const dynPos: [number, number, number] =
              dyn.instanceState.attachmentSlot === 'shelf' ? [-0.14, 0, 0.08] : dyn.transform.positionM;
            handlePhysicalDockInteraction(
              sp.instanceId,
              dyn.instanceId,
              'dynamometer-hook',
              [dynPos[0], 0.02, dynPos[2]],
            );
          }
          notify('Lực kế lò xo 5 N đo trọng lượng vật trong không khí: $P = 0.65\\,\\text{N}$.', 'info');
        } else if (nextStep === 3) {
          const ovf = scene.instances.find(
            (i) => assetsMap.get(i.assetId)?.geometry.proceduralArchetype === 'overflow-can',
          );
          const sp = scene.instances.find((i) => {
            const a = assetsMap.get(i.assetId);
            return a?.geometry.proceduralArchetype === 'solid-cylinder' || a?.kind === 'specimen';
          });
          if (ovf && sp) {
            const ovfPos: [number, number, number] =
              ovf.instanceState.attachmentSlot === 'shelf' ? [0.10, 0, 0.08] : ovf.transform.positionM;
            handlePhysicalDockInteraction(
              sp.instanceId,
              ovf.instanceId,
              'inside-vessel',
              [ovfPos[0], 0.016, ovfPos[2]],
            );
          }
          notify('Lực đẩy Archimedes: $F_A = P - F = 0.65 - 0.41 = 0.24\\,\\text{N}$ ($V = 24.5\\,\\text{mL}$).', 'success');
        }
      } else if (isThermal) {
        const placeThermalBenchIfOnShelf = (
          list: SceneInstance[],
          mode: 'ambient' | 'heating' | 'boiling',
        ): SceneInstance[] => {
          const beakerInst = list.find(
            (x) => assetsMap.get(x.assetId)?.geometry.proceduralArchetype === 'beaker-250',
          );
          return reconcileCumulativeLabMeasurements(
            list.map((i) => {
              const a = assetsMap.get(i.assetId)?.geometry.proceduralArchetype;
              const offShelf = i.instanceState.attachmentSlot === 'shelf';
              if (a === 'alcohol-burner') {
                return {
                  ...i,
                  transform: offShelf
                    ? { ...i.transform, positionM: [0.0, 0, 0.08] as [number, number, number], displayScale: [1, 1, 1] as [number, number, number] }
                    : i.transform,
                  instanceState: {
                    ...i.instanceState,
                    ...(offShelf ? { attachedToInstanceId: null, attachmentSlot: 'bench' as const } : {}),
                    isFlameLit: mode !== 'ambient',
                    isHeating: mode !== 'ambient',
                  },
                };
              }
              if (a === 'beaker-250') {
                return {
                  ...i,
                  transform: offShelf
                    ? { ...i.transform, positionM: [0.13, 0, 0.08] as [number, number, number], displayScale: [1, 1, 1] as [number, number, number] }
                    : i.transform,
                  instanceState: {
                    ...i.instanceState,
                    ...(offShelf ? { attachedToInstanceId: null, attachmentSlot: 'bench' as const } : {}),
                    liquidLevelMl: i.instanceState.liquidLevelMl ?? 100,
                    baseLiquidLevelMl: i.instanceState.baseLiquidLevelMl ?? 100,
                    temperatureC:
                      mode === 'ambient'
                        ? 25.0
                        : mode === 'boiling'
                          ? 100.0
                          : i.instanceState.temperatureC ?? 25.0,
                  },
                };
              }
              if (a === 'thermometer') {
                const bx = beakerInst
                  ? beakerInst.instanceState.attachmentSlot === 'shelf'
                    ? 0.13
                    : beakerInst.transform.positionM[0]
                  : 0.13;
                const bz = beakerInst
                  ? beakerInst.instanceState.attachmentSlot === 'shelf'
                    ? 0.08
                    : beakerInst.transform.positionM[2]
                  : 0.08;
                return {
                  ...i,
                  transform: offShelf
                    ? { ...i.transform, positionM: [bx, 0.035, bz] as [number, number, number], displayScale: [1, 1, 1] as [number, number, number] }
                    : i.transform,
                  instanceState: {
                    ...i.instanceState,
                    ...(beakerInst
                      ? { attachedToInstanceId: beakerInst.instanceId, attachmentSlot: 'inside-vessel' as const }
                      : offShelf
                        ? { attachedToInstanceId: null, attachmentSlot: 'bench' as const }
                        : {}),
                    temperatureC:
                      mode === 'ambient'
                        ? 25.0
                        : mode === 'boiling'
                          ? 100.0
                          : i.instanceState.temperatureC ?? 25.0,
                  },
                };
              }
              if (a === 'digital-stopwatch' && offShelf) {
                return {
                  ...i,
                  transform: {
                    ...i.transform,
                    positionM: [0.28, 0, 0.08] as [number, number, number],
                    displayScale: [1, 1, 1] as [number, number, number],
                  },
                  instanceState: {
                    ...i.instanceState,
                    attachedToInstanceId: null,
                    attachmentSlot: 'bench' as const,
                    isTimerRunning: mode === 'heating',
                  },
                };
              }
              return i;
            }),
          );
        };

        if (nextStep === 1) {
          handlePlaceAllRequiredForExperiment();
        } else if (nextStep === 2) {
          setScene((prev) => ({
            ...prev,
            sceneRevision: prev.sceneRevision + 1,
            instances: placeThermalBenchIfOnShelf(prev.instances, 'ambient'),
          }));
          labSoundEngine.play('probe-measure', { value: 25 });
          notify(
            'Nhiệt độ ban đầu của 100 mL nước: $T_1 = 25{,}0^\\circ\\text{C}$ (ĐCNN nhiệt kế: $1{,}0^\\circ\\text{C}$).',
            'info',
          );
        } else if (nextStep === 3) {
          setScene((prev) => ({
            ...prev,
            sceneRevision: prev.sceneRevision + 1,
            instances: placeThermalBenchIfOnShelf(prev.instances, 'heating'),
          }));
          labSoundEngine.play('burner-ignite');
          notify(
            'Đã châm lửa đèn cồn: Công suất nhiệt truyền vào nước $P_{\\text{toa}} \\approx 250\\text{ W}$, nhiệt độ đang tăng dần.',
            'warning',
          );
        } else if (nextStep === 4) {
          setScene((prev) => ({
            ...prev,
            sceneRevision: prev.sceneRevision + 1,
            instances: placeThermalBenchIfOnShelf(prev.instances, 'boiling'),
          }));
          labSoundEngine.play('water-boil-rumble');
          notify(
            'Nước đạt nhiệt độ sôi ổn định tại $T_{\\text{soi}} = 100{,}0^\\circ\\text{C}$ (ở 1 atm). Nhiệt lượng thu vào: $Q = m \\cdot c \\cdot \\Delta T = 0{,}10 \\cdot 4184 \\cdot (100 - 25) = 31380\\text{ J}$.',
            'success',
          );
        }
      }
    },
    [
      activeExperiment.experimentId,
      assetsMap,
      scene.instances,
      handlePhysicalDockInteraction,
      handleQuickWeighSpecimen,
      handleQuickSubmergeSpecimen,
      handlePlaceAllRequiredForExperiment,
      reconcileCumulativeLabMeasurements,
      selectedInstanceId,
      measuredMassG,
      finalVolumeCm3,
      initialVolumeCm3,
      notify,
    ],
  );

  // Quick Thermal Actions (Burner Toggle & Cool Water)
  const handleQuickToggleBurnerFlame = useCallback(() => {
    const curBurner = scene.instances.find(
      (i) => assetsMap.get(i.assetId)?.geometry.proceduralArchetype === 'alcohol-burner',
    );
    const nextLit = !Boolean(curBurner?.instanceState.isFlameLit || curBurner?.instanceState.isHeating);
    setScene((prev) => {
      const beakerInst = prev.instances.find(
        (x) => assetsMap.get(x.assetId)?.geometry.proceduralArchetype === 'beaker-250',
      );
      const nextList = prev.instances.map((item) => {
        const a = assetsMap.get(item.assetId)?.geometry.proceduralArchetype;
        const offShelf = item.instanceState.attachmentSlot === 'shelf';
        if (a === 'alcohol-burner') {
          return {
            ...item,
            transform: offShelf
              ? { ...item.transform, positionM: [0.0, 0, 0.08] as [number, number, number], displayScale: [1, 1, 1] as [number, number, number] }
              : item.transform,
            instanceState: {
              ...item.instanceState,
              ...(offShelf ? { attachedToInstanceId: null, attachmentSlot: 'bench' as const } : {}),
              isFlameLit: nextLit,
              isHeating: nextLit,
            },
          };
        }
        if (nextLit && a === 'beaker-250' && offShelf) {
          return {
            ...item,
            transform: { ...item.transform, positionM: [0.13, 0, 0.08] as [number, number, number], displayScale: [1, 1, 1] as [number, number, number] },
            instanceState: {
              ...item.instanceState,
              attachedToInstanceId: null,
              attachmentSlot: 'bench' as const,
              liquidLevelMl: item.instanceState.liquidLevelMl ?? 100,
              baseLiquidLevelMl: item.instanceState.baseLiquidLevelMl ?? 100,
            },
          };
        }
        if (nextLit && a === 'thermometer' && offShelf) {
          return {
            ...item,
            transform: { ...item.transform, positionM: [0.13, 0.035, 0.08] as [number, number, number], displayScale: [1, 1, 1] as [number, number, number] },
            instanceState: {
              ...item.instanceState,
              attachedToInstanceId: beakerInst?.instanceId ?? null,
              attachmentSlot: beakerInst ? ('inside-vessel' as const) : ('bench' as const),
            },
          };
        }
        return item;
      });
      return {
        ...prev,
        sceneRevision: prev.sceneRevision + 1,
        instances: reconcileCumulativeLabMeasurements(nextList),
      };
    });
    labSoundEngine.play(nextLit ? 'burner-ignite' : 'burner-extinguish');
    notify(
      nextLit
        ? '🔥 Đã châm lửa đèn cồn: Ngọn lửa tỏa nhiệt đun sôi nước.'
        : '🛑 Đã đậy nắp dập tắt ngọn lửa đèn cồn an toàn.',
      nextLit ? 'warning' : 'info',
    );
  }, [scene.instances, assetsMap, reconcileCumulativeLabMeasurements, notify]);

  const handleQuickCoolWater = useCallback(() => {
    setScene((prev) => ({
      ...prev,
      sceneRevision: prev.sceneRevision + 1,
      instances: reconcileCumulativeLabMeasurements(
        prev.instances.map((item) => {
          const a = assetsMap.get(item.assetId)?.geometry.proceduralArchetype;
          if (a === 'beaker-250' || a === 'thermometer' || a === 'porcelain-dish') {
            return {
              ...item,
              instanceState: {
                ...item.instanceState,
                temperatureC: 25.0,
                isHeating: false,
              },
            };
          }
          if (a === 'alcohol-burner') {
            return {
              ...item,
              instanceState: {
                ...item.instanceState,
                isFlameLit: false,
                isHeating: false,
              },
            };
          }
          if (a === 'digital-stopwatch') {
            return {
              ...item,
              instanceState: {
                ...item.instanceState,
                isTimerRunning: false,
              },
            };
          }
          return item;
        }),
      ),
    }));
    labSoundEngine.play('water-splash');
    notify('❄️ Đã tắt đèn cồn và làm nguội nước về nhiệt độ phòng $T = 25{,}0^\\circ\\text{C}$.', 'info');
  }, [assetsMap, reconcileCumulativeLabMeasurements, notify]);

  // Continuous Thermal Boiling Loop when Burner is Lit
  useEffect(() => {
    const hasLitBurner = scene.instances.some((i) => {
      if (!i.visible) return false;
      const arch = assetsMap.get(i.assetId)?.geometry.proceduralArchetype;
      return (
        (arch === 'alcohol-burner' || arch === 'distillation-flask') &&
        Boolean(i.instanceState.isHeating || i.instanceState.isFlameLit)
      );
    });
    if (!hasLitBurner) return;

    const timer = window.setInterval(() => {
      setScene((prev) => {
        let changed = false;
        let peakTemp = 25.0;
        const nextInstances = prev.instances.map((item) => {
          const arch = assetsMap.get(item.assetId)?.geometry.proceduralArchetype;
          if (arch === 'beaker-250' || arch === 'thermometer' || arch === 'porcelain-dish') {
            const curT = item.instanceState.temperatureC ?? 25.0;
            if (curT < 100.0) {
              const nextT = Math.min(100.0, Number((curT + 1.5).toFixed(1)));
              changed = true;
              peakTemp = Math.max(peakTemp, nextT);
              return {
                ...item,
                instanceState: {
                  ...item.instanceState,
                  temperatureC: nextT,
                },
              };
            }
            peakTemp = Math.max(peakTemp, curT);
          }
          if (arch === 'digital-stopwatch') {
            changed = true;
            return {
              ...item,
              instanceState: {
                ...item.instanceState,
                recordedTimeS: (item.instanceState.recordedTimeS ?? 0) + 1,
                isTimerRunning: true,
              },
            };
          }
          return item;
        });

        if (peakTemp >= 75.0 && peakTemp < 77.0) {
          labSoundEngine.play('water-simmer', { intensity: 0.7 });
        } else if (peakTemp >= 99.0 && peakTemp <= 100.0 && changed) {
          labSoundEngine.play('water-boil-rumble', { intensity: 0.9 });
        }

        if (!changed) return prev;
        return {
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: nextInstances,
        };
      });
    }, 450);

    return () => window.clearInterval(timer);
  }, [scene.instances, assetsMap]);

  // Header 4-step bar click handler
  const handleChangeHeaderProgressStep = useCallback(
    (hStep: HeaderProgressStep) => {
      const totalSteps = activeExperiment.steps.length || 5;
      if (hStep === 1) handleChangeStudentGuidedStep(1);
      else if (hStep === 2) handleChangeStudentGuidedStep(Math.min(2, totalSteps) as StudentGuidedStepNumber);
      else if (hStep === 3) handleChangeStudentGuidedStep(Math.min(3, totalSteps) as StudentGuidedStepNumber);
      else handleChangeStudentGuidedStep(Math.min(5, totalSteps) as StudentGuidedStepNumber);
    },
    [activeExperiment.steps.length, handleChangeStudentGuidedStep],
  );

  // Quick Physical Lab Action Handler (Triggered from the contextual 3D bottom bar)
  const handleQuickLabAction = useCallback(
    (action: QuickLabActionType, instanceId: string) => {
      const inst = scene.instances.find((i) => i.instanceId === instanceId);
      const asset = inst ? assetsMap.get(inst.assetId) : null;
      const balance = scene.instances.find(
        (i) =>
          assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
          'electronic-balance',
      );
      const cylinder = scene.instances.find(
        (i) =>
          assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
          'graduated-cylinder',
      );
      const overflowCan = scene.instances.find(
        (i) =>
          assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
          'overflow-can',
      );
      const beaker = scene.instances.find(
        (i) =>
          assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
          'beaker-250',
      );
      const specimen = scene.instances.find((i) => {
        const a = assetsMap.get(i.assetId);
        return (
          a?.geometry.proceduralArchetype === 'solid-cylinder' ||
          a?.geometry.proceduralArchetype === 'solid-block' ||
          a?.geometry.proceduralArchetype === 'solid-sphere' ||
          a?.geometry.proceduralArchetype === 'calibration-weight'
        );
      });

      if (action === 'tare-balance' && balance) {
        const currentRaw = balance.instanceState.measuredMassG ?? 0;
        const currentTare = balance.instanceState.tareOffsetG ?? 0;
        // Nếu đĩa cân trống (currentRaw === 0) mà đang có trừ bì âm (currentTare > 0), bấm TARE sẽ reset trừ bì về 0 (Re-zero)
        const nextTare = currentRaw === 0 && currentTare > 0 ? 0 : currentRaw;
        setScene((prev) => ({
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: prev.instances.map((item) =>
            item.instanceId === balance.instanceId
              ? {
                  ...item,
                  instanceState: {
                    ...item.instanceState,
                    tareOffsetG: nextTare,
                  },
                }
              : item,
          ),
        }));
        labSoundEngine.play('scale-tare');
        notify(
          nextTare > 0
            ? `Đã bấm TARE (Trừ bì ${nextTare.toFixed(2)} g): Màn hình cân điện tử về 0.00 g.`
            : 'Đã hiệu chuẩn (Re-zero): Đặt lại độ lệch trừ bì về 0.00 g.',
          'info',
        );
        return;
      }

      if (action === 'clear-balance-pan' && balance) {
        let clearedCount = 0;
        setScene((prev) => {
          const draft = prev.instances.map((item, idx) => {
            if (
              item.instanceState.attachedToInstanceId === balance.instanceId &&
              item.instanceState.attachmentSlot === 'balance-pan'
            ) {
              clearedCount++;
              const benchX = Number(
                Math.min(1.15, balance.transform.positionM[0] + 0.16 + (idx % 3) * 0.06).toFixed(3),
              );
              const benchZ = Number(
                Math.min(0.435, balance.transform.positionM[2] + 0.04 + (clearedCount - 1) * 0.06).toFixed(3),
              );
              return {
                ...item,
                transform: {
                  ...item.transform,
                  positionM: [benchX, 0, benchZ] as [number, number, number],
                },
                instanceState: {
                  ...item.instanceState,
                  attachedToInstanceId: null,
                  attachmentSlot: 'bench' as const,
                },
              };
            }
            return item;
          });
          return {
            ...prev,
            sceneRevision: prev.sceneRevision + 1,
            instances: reconcileCumulativeLabMeasurements(draft),
          };
        });
        labSoundEngine.play('wood-place', { intensity: 0.9 });
        notify(
          `Đã dọn các vật khỏi đĩa Cân điện tử về mặt bàn gỗ (Màn hình cân về 0.00 g).`,
          'info',
        );
        return;
      }

      if (action === 'weigh-selected') {
        // When clicking "Đặt thêm vật mẫu (+m)" from the balance, pick the next unweighed specimen/weight on the bench!
        const nextUnweighedSpecimen = scene.instances.find((i) => {
          if (
            !i.visible ||
            (balance &&
              i.instanceState.attachedToInstanceId === balance.instanceId &&
              i.instanceState.attachmentSlot === 'balance-pan')
          ) {
            return false;
          }
          const a = assetsMap.get(i.assetId);
          const arch = a?.geometry.proceduralArchetype;
          return (
            a?.kind === 'specimen' ||
            arch === 'solid-cylinder' ||
            arch === 'solid-block' ||
            arch === 'solid-sphere' ||
            arch === 'hollow-cylinder' ||
            arch === 'calibration-weight'
          );
        });

        const itemToWeigh =
          asset?.geometry.proceduralArchetype === 'electronic-balance'
            ? nextUnweighedSpecimen ?? specimen
            : inst ?? nextUnweighedSpecimen ?? specimen;
        if (!itemToWeigh || !balance) return;
        const balancePos: [number, number, number] =
          balance.instanceState.attachmentSlot === 'shelf'
            ? [-0.22, 0, 0.08]
            : balance.transform.positionM;
        const rotY = balance.transform.rotationRad[1] ?? 0;
        const targetPos: [number, number, number] = [
          Number((balancePos[0] - Math.sin(rotY) * 0.02).toFixed(3)),
          0.068,
          Number((balancePos[2] - Math.cos(rotY) * 0.02).toFixed(3)),
        ];
        setSelectedInstanceId(itemToWeigh.instanceId);
        handlePhysicalDockInteraction(
          itemToWeigh.instanceId,
          balance.instanceId,
          'balance-pan',
          targetPos,
        );
        return;
      }

      if (action === 'submerge-cylinder') {
        const nextUnsubmergedSpecimen = scene.instances.find((i) => {
          if (
            !i.visible ||
            (cylinder &&
              i.instanceState.attachedToInstanceId === cylinder.instanceId &&
              i.instanceState.attachmentSlot === 'inside-vessel')
          ) {
            return false;
          }
          const a = assetsMap.get(i.assetId);
          const arch = a?.geometry.proceduralArchetype;
          return (
            a?.kind === 'specimen' ||
            arch === 'solid-cylinder' ||
            arch === 'solid-block' ||
            arch === 'solid-sphere' ||
            arch === 'hollow-cylinder' ||
            arch === 'calibration-weight'
          );
        });
        const itemToSubmerge =
          asset?.geometry.proceduralArchetype === 'graduated-cylinder'
            ? nextUnsubmergedSpecimen ?? specimen
            : inst ?? nextUnsubmergedSpecimen ?? specimen;
        if (!itemToSubmerge || !cylinder) return;

        // KIỂM TRA KHẨU ĐỘ MIỆNG ỐNG ĐONG (Aperture Check):
        // Miệng ống đong 100 ml có đường kính Ø 28 mm. Mẫu vật quá lớn (như khối đồng thau 40x25 mm) không chui lọt
        const targetSubAsset = assetsMap.get(itemToSubmerge.assetId);
        const subArch = targetSubAsset?.geometry.proceduralArchetype;
        const bWidthMm = (targetSubAsset?.geometry.boundingBoxM.width ?? 0.02) * 1000;
        const bDepthMm = (targetSubAsset?.geometry.boundingBoxM.depth ?? 0.02) * 1000;
        const maxDimMm = Math.max(bWidthMm, bDepthMm);
        const minDimMm = Math.min(bWidthMm, bDepthMm);
        if (subArch === 'solid-block' || maxDimMm > 32 || minDimMm > 26) {
          labSoundEngine.play('wood-place', { intensity: 0.75 });
          notify(
            `⚠️ Mẫu vật "${targetSubAsset?.name.vi || 'Khối đồng'}" (${maxDimMm.toFixed(0)} mm) lớn hơn miệng Ống đong (Ø 28 mm)! Theo SGK KHTN 8, hãy dùng Bình tràn Eureka để đo thể tích dời chỗ.`,
            'warning',
          );
          return;
        }

        const cylPos: [number, number, number] =
          cylinder.instanceState.attachmentSlot === 'shelf'
            ? [0.06, 0, 0.08]
            : cylinder.transform.positionM;
        const targetPos: [number, number, number] = [
          cylPos[0],
          0.016,
          cylPos[2],
        ];
        setSelectedInstanceId(itemToSubmerge.instanceId);
        handlePhysicalDockInteraction(
          itemToSubmerge.instanceId,
          cylinder.instanceId,
          'inside-vessel',
          targetPos,
        );
        return;
      }

      if (action === 'retrieve-from-vessel') {
        const targetVessel = inst ?? cylinder ?? beaker;
        if (!targetVessel) return;
        let retrievedCount = 0;
        setScene((prev) => {
          const draft = prev.instances.map((item) => {
            if (
              item.instanceState.attachedToInstanceId === targetVessel.instanceId &&
              item.instanceState.attachmentSlot === 'inside-vessel'
            ) {
              retrievedCount++;
              const benchX = Number(
                Math.min(1.15, targetVessel.transform.positionM[0] + 0.12 + (retrievedCount - 1) * 0.06).toFixed(3),
              );
              const benchZ = Number(
                Math.min(0.435, targetVessel.transform.positionM[2] + 0.04).toFixed(3),
              );
              return {
                ...item,
                transform: {
                  ...item.transform,
                  positionM: [benchX, 0, benchZ] as [number, number, number],
                },
                instanceState: {
                  ...item.instanceState,
                  attachedToInstanceId: null,
                  attachmentSlot: 'bench' as const,
                },
              };
            }
            return item;
          });
          return {
            ...prev,
            sceneRevision: prev.sceneRevision + 1,
            instances: reconcileCumulativeLabMeasurements(draft),
          };
        });
        labSoundEngine.play('water-splash');
        notify(
          `Đã gắp vật mẫu ra khỏi ${asset?.name.vi ?? 'ống đong'} đặt lại trên bàn thí nghiệm. Mực nước trở về V₁ ban đầu.`,
          'info',
        );
        return;
      }

      if (action === 'submerge-overflow') {
        const itemToSubmerge =
          asset?.geometry.proceduralArchetype === 'overflow-can'
            ? specimen
            : inst ?? specimen;
        if (!itemToSubmerge || !overflowCan) return;
        const targetPos: [number, number, number] = [
          overflowCan.transform.positionM[0],
          0.016,
          overflowCan.transform.positionM[2],
        ];
        setSelectedInstanceId(itemToSubmerge.instanceId);
        handlePhysicalDockInteraction(
          itemToSubmerge.instanceId,
          overflowCan.instanceId,
          'inside-vessel',
          targetPos,
        );
        return;
      }

      if (action === 'pour-to-cylinder' && inst && cylinder) {
        const settlePos: [number, number, number] = [
          Number(Math.max(-1.15, cylinder.transform.positionM[0] - 0.105).toFixed(3)),
          0,
          Number(Math.min(0.435, cylinder.transform.positionM[2] + 0.025).toFixed(3)),
        ];
        handlePhysicalDockInteraction(
          inst.instanceId,
          cylinder.instanceId,
          'pour-liquid',
          settlePos,
        );
        return;
      }

      if (action === 'pour-to-beaker' && inst && beaker) {
        const settlePos: [number, number, number] = [
          Number(Math.max(-1.15, beaker.transform.positionM[0] - 0.105).toFixed(3)),
          0,
          Number(Math.min(0.435, beaker.transform.positionM[2] + 0.025).toFixed(3)),
        ];
        handlePhysicalDockInteraction(
          inst.instanceId,
          beaker.instanceId,
          'pour-liquid',
          settlePos,
        );
        return;
      }

      if (action === 'pour-to-overflow' && inst && overflowCan) {
        const settlePos: [number, number, number] = [
          Number(Math.max(-1.15, overflowCan.transform.positionM[0] - 0.115).toFixed(3)),
          0,
          Number(Math.min(0.435, overflowCan.transform.positionM[2] + 0.025).toFixed(3)),
        ];
        handlePhysicalDockInteraction(
          inst.instanceId,
          overflowCan.instanceId,
          'pour-liquid',
          settlePos,
        );
        return;
      }

      if (action === 'dock-to-dispenser' && inst) {
        const dispenser = scene.instances.find(
          (i) =>
            i.visible &&
            assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
              'water-dispenser',
        );
        if (dispenser) {
          const dispRotY = dispenser.transform.rotationRad[1] ?? 0;
          const spoutPos: [number, number, number] = [
            Number(
              (
                dispenser.transform.positionM[0] +
                Math.cos(dispRotY) * 0.095
              ).toFixed(3),
            ),
            0,
            Number(
              (
                dispenser.transform.positionM[2] -
                Math.sin(dispRotY) * 0.095
              ).toFixed(3),
            ),
          ];
          handlePhysicalDockInteraction(
            inst.instanceId,
            dispenser.instanceId,
            'dispenser-outlet',
            spoutPos,
          );
        }
        return;
      }

      if (action === 'refill-water' && inst && asset) {
        const arch = asset.geometry.proceduralArchetype;
        const cap = asset.scientificProperties.capacity?.value ?? 100;
        const nextMl =
          arch === 'graduated-cylinder'
            ? 50
            : arch === 'overflow-can'
              ? 210
              : Math.min(cap, (inst.instanceState.liquidLevelMl ?? 40) + 25);
        setScene((prev) => {
          const draft = prev.instances.map((item) =>
            item.instanceId === inst.instanceId
              ? {
                  ...item,
                  instanceState: {
                    ...item.instanceState,
                    liquidLevelMl: nextMl,
                    baseLiquidLevelMl: nextMl,
                  },
                }
              : item,
          );
          return {
            ...prev,
            sceneRevision: prev.sceneRevision + 1,
            instances: reconcileCumulativeLabMeasurements(draft),
          };
        });
        labSoundEngine.play('water-pour', {
          fillRatio: Math.min(1, nextMl / Math.max(10, cap)),
        });
        notify(
          `Đã cập nhật lượng nước trong ${asset.name.vi}: ${nextMl.toFixed(1)} ml.`,
          'success',
        );
        return;
      }

      if (action === 'assemble-optical-bench') {
        const OPTICAL_ASSEMBLY_BLUEPRINT: Array<{
          assetId: string;
          posM: [number, number, number];
          dockToBench: boolean;
        }> = [
          {
            assetId: 'OL3D-EQP-OBN-0001',
            posM: [0.0, 0, 0.04],
            dockToBench: false,
          },
          {
            assetId: 'OL3D-EQP-OLP-0001',
            posM: [-0.32, 0, 0.04],
            dockToBench: true,
          },
          {
            assetId: 'OL3D-EQP-FOB-0001',
            posM: [-0.2, 0, 0.04],
            dockToBench: true,
          },
          {
            assetId: 'OL3D-EQP-OPT-0001',
            posM: [0.0, 0, 0.04],
            dockToBench: true,
          },
          {
            assetId: 'OL3D-EQP-SCR-0001',
            posM: [0.2, 0, 0.04],
            dockToBench: true,
          },
          {
            assetId: 'OL3D-EQP-PSU-0001',
            posM: [-0.56, 0, -0.05],
            dockToBench: false,
          },
          {
            assetId: 'OL3D-EQP-LBX-0001',
            posM: [0.58, 0, -0.05],
            dockToBench: false,
          },
        ];

        setScene((prev) => {
          const workingInstances = [...prev.instances];
          let benchInstanceId =
            workingInstances.find(
              (i) => i.visible && i.assetId === 'OL3D-EQP-OBN-0001',
            )?.instanceId ?? '';

          for (const spec of OPTICAL_ASSEMBLY_BLUEPRINT) {
            const catalogAsset = assetsMap.get(spec.assetId);
            if (!catalogAsset) continue;
            const existingIdx = workingInstances.findIndex(
              (i) => i.visible && i.assetId === spec.assetId,
            );
            if (existingIdx >= 0) {
              const existing = workingInstances[existingIdx];
              if (spec.assetId === 'OL3D-EQP-OBN-0001') {
                benchInstanceId = existing.instanceId;
              }
              workingInstances[existingIdx] = {
                ...existing,
                transform: {
                  positionM: spec.posM,
                  rotationRad: [0, 0, 0],
                  displayScale: [1, 1, 1],
                },
                instanceState: {
                  ...existing.instanceState,
                  isPoweredOn: true,
                  experimentMode:
                    existing.instanceState.experimentMode ?? 'f_object',
                  lensProfileId:
                    existing.instanceState.lensProfileId ?? 'conv_10',
                  focalLengthCm:
                    existing.instanceState.focalLengthCm ?? 10,
                  beamMode: existing.instanceState.beamMode ?? 'f_rays',
                  supplyVoltageV:
                    existing.instanceState.supplyVoltageV ?? 6,
                  showPhotons: existing.instanceState.showPhotons ?? true,
                  showVirtualRays:
                    existing.instanceState.showVirtualRays ?? true,
                  ambientLightLevel:
                    existing.instanceState.ambientLightLevel ?? 45,
                  attachedToInstanceId: spec.dockToBench
                    ? benchInstanceId || null
                    : null,
                  attachmentSlot: spec.dockToBench
                    ? 'optical-bench-rail'
                    : 'bench',
                },
              };
            } else {
              const newId = `inst-${catalogAsset.slug.slice(0, 10)}-${Date.now()
                .toString(36)
                .slice(-3)}-${Math.random().toString(36).slice(2, 4)}`;
              if (spec.assetId === 'OL3D-EQP-OBN-0001') {
                benchInstanceId = newId;
              }
              workingInstances.push({
                instanceId: newId,
                assetId: catalogAsset.assetId,
                assetVersion: catalogAsset.assetVersion || '1.0.0',
                customLabel: catalogAsset.name.vi,
                parentZone: 'bench-main',
                transform: {
                  positionM: spec.posM,
                  rotationRad: [0, 0, 0],
                  displayScale: [1, 1, 1],
                },
                visible: true,
                locked: false,
                labelVisible: true,
                instanceState: {
                  isPoweredOn: true,
                  experimentMode: 'f_object',
                  lensProfileId: 'conv_10',
                  focalLengthCm: 10,
                  beamMode: 'f_rays',
                  supplyVoltageV: 6,
                  showPhotons: true,
                  showVirtualRays: true,
                  ambientLightLevel: 45,
                  attachedToInstanceId: spec.dockToBench
                    ? benchInstanceId || null
                    : null,
                  attachmentSlot: spec.dockToBench
                    ? 'optical-bench-rail'
                    : 'bench',
                },
              });
            }
          }

          // Ensure all riders reference the resolved benchInstanceId
          const linkedInstances = workingInstances.map((item) => {
            const isRider =
              item.assetId === 'OL3D-EQP-OLP-0001' ||
              item.assetId === 'OL3D-EQP-FOB-0001' ||
              item.assetId === 'OL3D-EQP-OPT-0001' ||
              item.assetId === 'OL3D-EQP-SCR-0001';
            if (isRider && item.instanceState.attachmentSlot === 'optical-bench-rail') {
              return {
                ...item,
                instanceState: {
                  ...item.instanceState,
                  attachedToInstanceId: benchInstanceId || null,
                },
              };
            }
            return item;
          });

          const lensInst = linkedInstances.find(
            (i) => i.assetId === 'OL3D-EQP-OPT-0001',
          );
          if (lensInst) {
            setSelectedInstanceId(lensInst.instanceId);
            setSelectedCatalogAssetId(lensInst.assetId);
          }

          return {
            ...prev,
            experimentId: 'OL3D-EXP-OPTICS-LENS-0001',
            sceneRevision: prev.sceneRevision + 1,
            updatedAt: new Date().toISOString(),
            instances: reconcileCumulativeLabMeasurements(linkedInstances),
          };
        });

        labSoundEngine.play('step-complete', 0.95);
        notify(
          '⚡ Đã lắp ráp hoàn chỉnh Bộ thí nghiệm Thấu kính trên Giá quang học (Hình 8.12 SGK KHTN 9): (1) Đèn chiếu → (2) Vật F (d=20cm) → (3) Thấu kính (f=+10cm) → (4) Màn chắn (L=20cm) + (6) Nguồn điện 6V!',
          'success',
        );
        return;
      }

      if (action === 'toggle-laser' && inst && asset) {
        const nextOn = inst.instanceState.isPoweredOn === false;
        setScene((prev) => {
          const draft = prev.instances.map((item) =>
            item.instanceId === inst.instanceId
              ? {
                  ...item,
                  instanceState: {
                    ...item.instanceState,
                    isPoweredOn: nextOn,
                  },
                }
              : item,
          );
          return {
            ...prev,
            sceneRevision: prev.sceneRevision + 1,
            instances: reconcileCumulativeLabMeasurements(draft),
          };
        });
        labSoundEngine.play('laser-switch', { value: nextOn ? 1 : 0 });
        notify(
          nextOn
            ? `Đã bật công tắc trên ${asset.name.vi}.`
            : `Đã tắt công tắc trên ${asset.name.vi}.`,
          'info',
        );
        return;
      }

      if (
        (action === 'refraction-angle-0' ||
          action === 'refraction-angle-20' ||
          action === 'refraction-angle-40' ||
          action === 'refraction-angle-42' ||
          action === 'refraction-angle-60') &&
        inst
      ) {
        const angle =
          action === 'refraction-angle-0'
            ? 0
            : action === 'refraction-angle-20'
              ? 20
              : action === 'refraction-angle-40'
                ? 40
                : action === 'refraction-angle-42'
                  ? 41.8
                  : 60;
        setScene((prev) => ({
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: prev.instances.map((item) =>
            item.instanceId === inst.instanceId
              ? {
                  ...item,
                  instanceState: {
                    ...item.instanceState,
                    incidentAngleDeg: angle,
                    isLaserHit: true,
                    isPoweredOn: true,
                  },
                }
              : item,
          ),
        }));
        labSoundEngine.play('optics-angle', { value: angle });
        notify(
          angle >= 41.8
            ? `Góc tới i = ${angle}° ≥ i_gh ≈ 41,8°: Toàn bộ ánh sáng bị PHẢN XẠ TOÀN PHẦN (Bài 6 SGK KHTN 9)!`
            : angle === 0
              ? `Góc tới i = 0°: Tia sáng truyền vuông góc qua tâm O truyền thẳng không đổi phương (Bài 5 SGK KHTN 9).`
              : `Góc tới i = ${angle}°: Tia sáng khúc xạ ra không khí với sin r = 1,5·sin i (Bài 5 SGK KHTN 9).`,
          angle >= 41.8 ? 'warning' : 'success',
        );
        return;
      }

      if (
        (action === 'induce-current-pos' ||
          action === 'induce-current-neg' ||
          action === 'induce-current-zero') &&
        inst
      ) {
        const defl =
          action === 'induce-current-pos'
            ? 0.75
            : action === 'induce-current-neg'
              ? -0.75
              : 0;
        setScene((prev) => ({
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: prev.instances.map((item) => {
            const itemArch = assetsMap.get(item.assetId)?.geometry
              .proceduralArchetype;
            if (
              item.instanceId === inst.instanceId ||
              itemArch === 'galvanometer' ||
              itemArch === 'induction-coil-led'
            ) {
              return {
                ...item,
                instanceState: {
                  ...item.instanceState,
                  galvanometerDeflection: defl,
                },
              };
            }
            return item;
          }),
        }));
        labSoundEngine.play('electric-induction', { value: defl });
        notify(
          defl > 0
            ? 'Đưa nam châm lại gần cuộn dây: Số đường sức từ tăng → Xuất hiện dòng điện cảm ứng làm kim điện kế lệch phải / Đèn LED 1 đỏ sáng (Bài 14 SGK KHTN 9)!'
            : defl < 0
              ? 'Kéo nam châm ra xa cuộn dây: Dòng điện cảm ứng đổi chiều làm kim điện kế lệch trái / Đèn LED 2 xanh sáng (Bài 14 SGK KHTN 9)!'
              : 'Nam châm đứng yên: Số đường sức từ xuyên qua tiết diện cuộn dây không đổi → Không có dòng điện cảm ứng (I = 0).',
          defl === 0 ? 'info' : 'success',
        );
        return;
      }

      if (
        (action === 'multimeter-mode-v' ||
          action === 'multimeter-mode-a' ||
          action === 'multimeter-mode-ohm') &&
        inst
      ) {
        const mode =
          action === 'multimeter-mode-v'
            ? 'V'
            : action === 'multimeter-mode-a'
              ? 'A'
              : 'Ω';
        // P07: Kiểm tra xem que đo có đang kết nối với nguồn điện thực tế hay không
        const psu = scene.instances.find(
          (i) =>
            i.visible &&
            assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
              'optical-power-supply',
        );
        const psuOn = Boolean(psu && psu.instanceState.isPoweredOn === true);
        const psuV =
          typeof psu?.instanceState.voltageSetting === 'number'
            ? psu.instanceState.voltageSetting
            : typeof psu?.instanceState.supplyVoltageV === 'number'
              ? psu.instanceState.supplyVoltageV
              : 12.0;

        let val = 0.0;
        if (psuOn) {
          val =
            mode === 'V'
              ? psuV
              : mode === 'A'
                ? Number((psuV / 16.0).toFixed(2))
                : 16.0;
        } else {
          val = mode === 'Ω' ? 999999 : 0.0;
        }

        setScene((prev) => ({
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: prev.instances.map((item) =>
            item.instanceId === inst.instanceId
              ? {
                  ...item,
                  instanceState: {
                    ...item.instanceState,
                    multimeterMode: mode,
                    multimeterValue: val,
                  },
                }
              : item,
          ),
        }));
        labSoundEngine.play('mechanical-click', { value: val });
        notify(
          psuOn
            ? mode === 'V'
              ? `Đồng hồ DMM (Thang DCV): Hiệu điện thế nguồn U = ${val.toFixed(2)} V (Bài 11 SGK KHTN 9).`
              : mode === 'A'
                ? `Đồng hồ DMM (Thang DCA): Dòng điện đo được I = ${val.toFixed(2)} A (Bài 11 SGK KHTN 9).`
                : 'Đồng hồ DMM (Thang Ω): Điện trở phụ tải R = 16.00 Ω.'
            : mode === 'Ω'
              ? 'Đồng hồ DMM: Que đo hở mạch → Điện trở vô cùng lớn (O.L).'
              : `Đồng hồ DMM: Mạch hở/Nguồn tắt → ${mode === 'V' ? 'U = 0.00 V' : 'I = 0.00 A'}.`,
          psuOn ? 'success' : 'info',
        );
        return;
      }

      if (action === 'toggle-burner-flame' && inst && asset) {
        const nextHeat = !(inst.instanceState.isHeating || inst.instanceState.isFlameLit);
        setScene((prev) => ({
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: prev.instances.map((item) =>
            item.instanceId === inst.instanceId
              ? {
                  ...item,
                  instanceState: {
                    ...item.instanceState,
                    isHeating: nextHeat,
                    isFlameLit: nextHeat,
                  },
                }
              : item,
          ),
        }));
        labSoundEngine.play(nextHeat ? 'burner-ignite' : 'burner-extinguish');
        notify(
          nextHeat
            ? `Đã châm ngọn lửa đun nóng trên ${asset.name.vi} (Chương VII–VIII SGK KHTN 9).`
            : `Đã đậy nắp dập tắt ngọn lửa đèn cồn an toàn trên ${asset.name.vi}.`,
          nextHeat ? 'warning' : 'info',
        );
        return;
      }

      if (action === 'open-microscope-viewport') {
        setShowMicroscopeModal(true);
        labSoundEngine.play('ui-toggle', 0.85);
        notify(
          'Đã mở phòng quan sát hiển vi quang học 3D (KHTN THCS) với 8 tiêu bản chuẩn.',
          'info',
        );
        return;
      }

      if (
        (action === 'microscope-4x' ||
          action === 'microscope-10x' ||
          action === 'microscope-40x' ||
          action === 'microscope-100x') &&
        inst
      ) {
        const mag =
          action === 'microscope-4x'
            ? 4
            : action === 'microscope-10x'
              ? 10
              : action === 'microscope-40x'
                ? 40
                : 100;
        setScene((prev) => ({
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: prev.instances.map((item) =>
            item.instanceId === inst.instanceId
              ? {
                  ...item,
                  instanceState: {
                    ...item.instanceState,
                    magnification: mag,
                  },
                }
              : item,
          ),
        }));
        labSoundEngine.play('mechanical-click', { value: mag });
        notify(
          `Đã xoay mâm vật kính kính hiển vi sang độ phóng đại ${mag}×. Bạn có thể bấm "Soi thị kính" để quan sát chi tiết tiêu bản.`,
          'success',
        );
        return;
      }

      if (
        (action === 'temp-room-25' ||
          action === 'temp-warm-78' ||
          action === 'temp-boil-100') &&
        inst
      ) {
        const tempC =
          action === 'temp-room-25'
            ? 25.0
            : action === 'temp-warm-78'
              ? 78.5
              : 100.0;
        setScene((prev) => ({
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: prev.instances.map((item) =>
            item.instanceId === inst.instanceId
              ? {
                  ...item,
                  instanceState: {
                    ...item.instanceState,
                    temperatureC: tempC,
                  },
                }
              : item,
          ),
        }));
        labSoundEngine.play('probe-measure', { value: tempC });
        notify(
          `Nhiệt kế rượu hiển thị: T = ${tempC.toFixed(1)} °C (Cột chất lỏng dâng theo nhiệt độ thực tế).`,
          'success',
        );
        return;
      }

      if (action === 'dynamometer-weigh' && inst && specimen) {
        const targetPos: [number, number, number] = [
          inst.transform.positionM[0],
          0.025,
          inst.transform.positionM[2] + 0.018,
        ];
        handlePhysicalDockInteraction(
          specimen.instanceId,
          inst.instanceId,
          'dynamometer-hook',
          targetPos,
        );
        return;
      }

      if (action === 'dynamometer-zero' && inst) {
        setScene((prev) => ({
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: prev.instances.map((item) =>
            item.instanceId === inst.instanceId
              ? {
                  ...item,
                  instanceState: {
                    ...item.instanceState,
                    springExtensionN: 0,
                  },
                }
              : item,
          ),
        }));
        labSoundEngine.play('spring-stretch', { value: 0 });
        notify('Đã hiệu chỉnh vạch 0 cho Lực kế lò xo (F = 0.00 N).', 'info');
        return;
      }

      if (action === 'caliper-measure' && inst) {
        const instArch = asset?.geometry.proceduralArchetype;
        const caliperInst =
          instArch === 'vernier-caliper'
            ? inst
            : scene.instances.find(
                (i) =>
                  i.visible &&
                  i.instanceState.attachmentSlot !== 'shelf' &&
                  assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
                    'vernier-caliper',
              );

        // Candidate measurable objects on the bench
        const measurableCandidates = scene.instances.filter((i) => {
          if (!i.visible || i.instanceState.attachmentSlot === 'shelf') {
            return false;
          }
          const a = assetsMap.get(i.assetId);
          const ar = a?.geometry.proceduralArchetype;
          return (
            a?.kind === 'specimen' ||
            ar === 'solid-cylinder' ||
            ar === 'solid-block' ||
            ar === 'solid-sphere' ||
            ar === 'hollow-cylinder' ||
            ar === 'calibration-weight'
          );
        });

        // If user clicked 'caliper-measure' on a specific specimen, measure that specimen;
        // if clicked on the caliper itself, cycle through measurable specimens on the bench!
        let targetSpec =
          instArch !== 'vernier-caliper' ? inst : undefined;
        if (!targetSpec && measurableCandidates.length > 0 && caliperInst) {
          const curClampedIdx = measurableCandidates.findIndex(
            (c) =>
              c.instanceState.attachedToInstanceId === caliperInst.instanceId &&
              c.instanceState.attachmentSlot === 'caliper-jaws',
          );
          const nextIdx = (curClampedIdx + 1) % measurableCandidates.length;
          targetSpec = measurableCandidates[nextIdx];
        }
        if (!targetSpec) {
          targetSpec = specimen;
        }

        if (caliperInst && targetSpec) {
          const specAsset = assetsMap.get(targetSpec.assetId);
          const rawWidthMm =
            specAsset?.geometry.dimensions?.widthOrDiameter?.value ??
            (specAsset?.geometry.boundingBoxM.width ?? 0.026) * 1000;
          const widthMm = Number(
            Math.min(150, Math.max(1, rawWidthMm)).toFixed(2),
          );
          const rotY = caliperInst.transform.rotationRad[1] ?? 0;
          const localCenterX = -0.09 + widthMm * 0.0005;
          const localCenterZ = 0.028;
          const targetPos: [number, number, number] = [
            Number(
              (
                caliperInst.transform.positionM[0] +
                localCenterX * Math.cos(rotY) +
                localCenterZ * Math.sin(rotY)
              ).toFixed(3),
            ),
            0.002,
            Number(
              (
                caliperInst.transform.positionM[2] -
                localCenterX * Math.sin(rotY) +
                localCenterZ * Math.cos(rotY)
              ).toFixed(3),
            ),
          ];
          handlePhysicalDockInteraction(
            targetSpec.instanceId,
            caliperInst.instanceId,
            'caliper-jaws',
            targetPos,
          );
        } else if (instArch === 'vernier-caliper') {
          notify(
            'Chưa có mẫu vật trên bàn thực hành. Hãy kéo vật mẫu từ Khu trưng bày xuống bàn hoặc dùng nút mức chuẩn (24 mm, 26 mm, 30 mm, 40 mm).',
            'info',
          );
        }
        return;
      }

      if (action === 'caliper-zero' && inst) {
        setScene((prev) => ({
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: prev.instances.map((item) => {
            if (item.instanceId === inst.instanceId) {
              return {
                ...item,
                instanceState: {
                  ...item.instanceState,
                  jawOpeningMm: 0,
                },
              };
            }
            if (
              item.instanceState.attachedToInstanceId === inst.instanceId &&
              item.instanceState.attachmentSlot === 'caliper-jaws'
            ) {
              return {
                ...item,
                transform: {
                  ...item.transform,
                  positionM: [
                    Number((inst.transform.positionM[0] - 0.14).toFixed(3)),
                    0,
                    Number((inst.transform.positionM[2] + 0.05).toFixed(3)),
                  ] as [number, number, number],
                },
                instanceState: {
                  ...item.instanceState,
                  attachedToInstanceId: null,
                  attachmentSlot: 'bench' as const,
                },
              };
            }
            return item;
          }),
        }));
        labSoundEngine.play('caliper-slide', { value: 0 });
        notify(
          'Đã tháo mẫu vật và đóng kín hai mỏ đo Thước cặp du xích về vạch chuẩn 0.00 mm (Vạch 0 du xích trùng vạch 0 thước chính).',
          'info',
        );
        return;
      }

      if (action === 'funnel-extract' && inst) {
        const curMl = inst.instanceState.liquidLevelMl ?? 125;
        const extracted = Math.min(30, Math.max(0, curMl - 20));
        const nextMl = Number((curMl - extracted).toFixed(1));
        setScene((prev) => ({
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: prev.instances.map((item) => {
            if (item.instanceId === inst.instanceId) {
              return {
                ...item,
                instanceState: {
                  ...item.instanceState,
                  liquidLevelMl: nextMl,
                  baseLiquidLevelMl: nextMl,
                  isValveOpen: extracted > 0,
                },
              };
            }
            if (beaker && item.instanceId === beaker.instanceId && extracted > 0) {
              const bMl = (item.instanceState.liquidLevelMl ?? 40) + extracted;
              const nextBeakerPos: [number, number, number] =
                item.instanceState.attachmentSlot === 'balance-pan'
                  ? item.transform.positionM
                  : [
                      Number(inst.transform.positionM[0].toFixed(3)),
                      0,
                      Number(inst.transform.positionM[2].toFixed(3)),
                    ];
              return {
                ...item,
                transform: {
                  ...item.transform,
                  positionM: nextBeakerPos,
                },
                instanceState: {
                  ...item.instanceState,
                  liquidLevelMl: bMl,
                  baseLiquidLevelMl: bMl,
                },
              };
            }
            return item;
          }),
        }));
        if (extracted > 0) {
          const funnelId = inst.instanceId;
          window.setTimeout(() => {
            setScene((prev) => ({
              ...prev,
              instances: prev.instances.map((item) =>
                item.instanceId === funnelId
                  ? {
                      ...item,
                      instanceState: {
                        ...item.instanceState,
                        isValveOpen: false,
                      },
                    }
                  : item,
              ),
            }));
          }, 1250);
        }
        labSoundEngine.play('funnel-valve', {
          fillRatio: Math.min(1, nextMl / 150),
        });
        notify(
          extracted > 0
            ? `Đã mở khóa Phễu chiết tách ${extracted.toFixed(0)} ml lớp chất lỏng dưới sang Cốc thủy tinh.`
            : 'Đã chiết hết lớp chất lỏng phía dưới trong Phễu chiết.',
          'success',
        );
        return;
      }

      if (action === 'rotate-90' && inst) {
        const nextRotY = Number(
          ((inst.transform.rotationRad[1] ?? 0) + Math.PI / 2).toFixed(3),
        );
        handleUpdateInstanceTransform(
          inst.instanceId,
          inst.transform.positionM,
          [inst.transform.rotationRad[0], nextRotY, inst.transform.rotationRad[2]],
        );
        labSoundEngine.play('rotate-object', { intensity: 0.85 });
        notify(
          `Đã xoay "${inst.customLabel || asset?.name.vi}" 90° — Màn hình/vạch chia hiển thị đa hướng 360°.`,
          'info',
        );
        return;
      }

      if (action === 'open-sgk-profile' && asset) {
        labSoundEngine.play('ui-toggle', 0.8);
        setDetailModalEditMode(false);
        setStudentDetailModalAsset(asset);
        return;
      }

      if (action === 'edit-product-info' && asset) {
        labSoundEngine.play('ui-toggle', 0.85);
        setDetailModalEditMode(true);
        setStudentDetailModalAsset(asset);
        return;
      }

      if (action === 'delete-instance') {
        const target = scene.instances.find((i) => i.instanceId === instanceId);
        const isAlreadyOnShelf =
          target?.instanceState.attachmentSlot === 'shelf';

        const autoTierY = 0.138;

        setScene((prev) => {
          const updated = prev.instances.map((item) => {
            if (item.instanceId === instanceId) {
              return isAlreadyOnShelf
                ? {
                    ...item,
                    transform: {
                      ...item.transform,
                      positionM: [0, 0, 0.08] as [number, number, number],
                      displayScale: [1, 1, 1] as [number, number, number],
                    },
                    instanceState: {
                      ...item.instanceState,
                      attachedToInstanceId: null,
                      attachmentSlot: 'bench' as const,
                    },
                  }
                : {
                    ...item,
                    transform: {
                      ...item.transform,
                      positionM: [0, autoTierY, -0.45] as [number, number, number],
                    },
                    instanceState: {
                      ...item.instanceState,
                      attachedToInstanceId: null,
                      attachmentSlot: 'shelf' as const,
                    },
                  };
            }
            if (
              !isAlreadyOnShelf &&
              item.instanceState.attachedToInstanceId === instanceId
            ) {
              return {
                ...item,
                transform: {
                  ...item.transform,
                  positionM: [
                    item.transform.positionM[0],
                    0,
                    Math.max(-0.22, item.transform.positionM[2]),
                  ] as [number, number, number],
                },
                instanceState: {
                  ...item.instanceState,
                  attachedToInstanceId: null,
                  attachmentSlot: 'bench' as const,
                },
              };
            }
            return item;
          });
          return {
            ...prev,
            sceneRevision: prev.sceneRevision + 1,
            instances: reconcileCumulativeLabMeasurements(updated),
          };
        });
        if (!isAlreadyOnShelf && selectedInstanceId === instanceId) {
          setSelectedInstanceId(null);
        }
        labSoundEngine.play('wood-place', { intensity: 0.75 });
        if (target) {
          notify(
            isAlreadyOnShelf
              ? `Đã lấy "${target.customLabel || asset?.name.vi || target.assetId}" từ Khu trưng bày xuống bàn thực hành.`
              : `✨ Đã đưa "${target.customLabel || asset?.name.vi || target.assetId}" vào Khu trưng bày phía sau bàn.`,
            isAlreadyOnShelf ? 'success' : 'info',
          );
        }
        return;
      }
    },
    [
      scene.instances,
      assetsMap,
      selectedInstanceId,
      handlePhysicalDockInteraction,
      handleUpdateInstanceTransform,
      reconcileCumulativeLabMeasurements,
      notify,
    ],
  );

  // Volumetric Water Dispenser Valve Handler (Mở van lấy nước chính xác theo số ml nhập vào)
  const handleDispenseWaterVolume = useCallback(
    (
      targetInstanceId: string,
      volumeMl: number,
      mode: 'add' | 'set' | 'refill-dispenser',
    ) => {
      if (mode === 'refill-dispenser') {
        setScene((prev) => ({
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: prev.instances.map((inst) =>
            inst.instanceId === targetInstanceId
              ? {
                  ...inst,
                  instanceState: {
                    ...inst.instanceState,
                    baseLiquidLevelMl: 1000,
                    liquidLevelMl: 1000,
                    isValveOpen: false,
                  },
                }
              : inst,
          ),
        }));
        notify(
          'Đã châm đầy 1000.0 ml nước cất vào Bình cấp nước định lượng.',
          'success',
        );
        return;
      }

      const targetInst = scene.instances.find(
        (i) => i.instanceId === targetInstanceId,
      );
      if (!targetInst) return;
      const targetAsset = assetsMap.get(targetInst.assetId);
      const targetArch = targetAsset?.geometry.proceduralArchetype;
      const maxCap =
        targetArch === 'overflow-can'
          ? 210
          : targetAsset?.scientificProperties.capacity?.value ?? 100;
      const curBaseMl =
        targetInst.instanceState.baseLiquidLevelMl ??
        targetInst.instanceState.liquidLevelMl ??
        maxCap * 0.5;

      const dispenserInst = scene.instances.find(
        (i) =>
          i.visible &&
          assetsMap.get(i.assetId)?.geometry.proceduralArchetype ===
            'water-dispenser',
      );
      const availDispenserMl =
        dispenserInst?.instanceState.liquidLevelMl ?? 850;

      const desiredBaseMl =
        mode === 'set'
          ? Math.max(0, Math.min(maxCap, volumeMl))
          : Math.max(0, Math.min(maxCap, curBaseMl + volumeMl));
      const deltaAddedMl = Math.max(0, desiredBaseMl - curBaseMl);

      if (mode === 'add' && availDispenserMl <= 0.5) {
        notify(
          'Bình cấp nước đã cạn! Hãy nhấn "Đổ đầy 1L" để tiếp thêm nước cất.',
          'warning',
        );
        return;
      }

      const actualAddedMl =
        mode === 'add' ? Math.min(deltaAddedMl, availDispenserMl) : 0;
      const finalBaseMl =
        mode === 'add'
          ? Number((curBaseMl + actualAddedMl).toFixed(1))
          : Number(desiredBaseMl.toFixed(1));

      if (targetArch === 'graduated-cylinder') {
        setInitialVolumeCm3(finalBaseMl);
      }

      setScene((prev) => {
        const draft = prev.instances.map((inst) => {
          if (dispenserInst && inst.instanceId === dispenserInst.instanceId) {
            const nextDispMl = Math.max(
              0,
              Number((availDispenserMl - actualAddedMl).toFixed(1)),
            );
            return {
              ...inst,
              instanceState: {
                ...inst.instanceState,
                baseLiquidLevelMl: nextDispMl,
                liquidLevelMl: nextDispMl,
                isValveOpen: true,
              },
            };
          }
          if (inst.instanceId === targetInstanceId) {
            const dispRotY = dispenserInst?.transform.rotationRad[1] ?? 0;
            const nextPosM: [number, number, number] =
              dispenserInst &&
              inst.instanceState.attachmentSlot !== 'balance-pan'
                ? [
                    Number(
                      Math.min(
                        1.15,
                        Math.max(
                          -1.15,
                          dispenserInst.transform.positionM[0] +
                            Math.cos(dispRotY) * 0.095,
                        ),
                      ).toFixed(3),
                    ),
                    0,
                    Number(
                      Math.min(
                        0.435,
                        Math.max(
                          -0.435,
                          dispenserInst.transform.positionM[2] -
                            Math.sin(dispRotY) * 0.095,
                        ),
                      ).toFixed(3),
                    ),
                  ]
                : inst.transform.positionM;
            return {
              ...inst,
              transform: {
                ...inst.transform,
                positionM: nextPosM,
              },
              instanceState: {
                ...inst.instanceState,
                baseLiquidLevelMl: finalBaseMl,
                liquidLevelMl: finalBaseMl,
                overflowingVolumeMl: 0,
                attachedToInstanceId:
                  dispenserInst &&
                  inst.instanceState.attachmentSlot !== 'balance-pan'
                    ? dispenserInst.instanceId
                    : inst.instanceState.attachedToInstanceId,
                attachmentSlot:
                  dispenserInst &&
                  inst.instanceState.attachmentSlot !== 'balance-pan'
                    ? ('dispenser-outlet' as const)
                    : inst.instanceState.attachmentSlot,
              },
            };
          }
          return inst;
        });
        return {
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: reconcileCumulativeLabMeasurements(draft),
        };
      });

      // Tự động đóng van 3D sau khi xả xong (1.1 giây)
      if (dispenserInst) {
        window.setTimeout(() => {
          setScene((prev) => ({
            ...prev,
            instances: prev.instances.map((inst) =>
              inst.instanceId === dispenserInst.instanceId
                ? {
                    ...inst,
                    instanceState: {
                      ...inst.instanceState,
                      isValveOpen: false,
                    },
                  }
                : inst,
            ),
          }));
        }, 1100);
      }

      labSoundEngine.play('water-pour', {
        fillRatio: Math.min(1, finalBaseMl / Math.max(10, maxCap)),
        intensity: 1,
      });

      notify(
        mode === 'add'
          ? `Đã mở van xả +${actualAddedMl.toFixed(1)} ml nước vào "${targetInst.customLabel || targetAsset?.name.vi}" → Mực nước hiện tại: ${finalBaseMl.toFixed(1)} ml.`
          : `Đã điều chỉnh chuẩn lượng nước trong "${targetInst.customLabel || targetAsset?.name.vi}" = ${finalBaseMl.toFixed(1)} ml.`,
        'success',
      );
    },
    [
      scene.instances,
      assetsMap,
      reconcileCumulativeLabMeasurements,
      notify,
    ],
  );

  // Continuous Tilt-Pour Transfer Handler (from Tinkercad-style circular rotation handle on liquid vessels)
  const handleContinuousPourTransfer = useCallback(
    (
      sourceInstanceId: string,
      targetInstanceId: string | null,
      nextSourceMl: number,
      nextTargetMl: number | null,
      pouredMl: number,
    ) => {
      if (pouredMl <= 0.05) return;
      const srcInst = scene.instances.find(
        (i) => i.instanceId === sourceInstanceId,
      );
      const dstInst = targetInstanceId
        ? scene.instances.find((i) => i.instanceId === targetInstanceId)
        : null;
      const srcAsset = srcInst ? assetsMap.get(srcInst.assetId) : null;
      const dstAsset = dstInst ? assetsMap.get(dstInst.assetId) : null;
      const dstArch = dstAsset?.geometry.proceduralArchetype;

      const cleanSrcMl = Number(Math.max(0, nextSourceMl).toFixed(1));
      const cleanDstMl =
        nextTargetMl !== null
          ? Number(Math.max(0, nextTargetMl).toFixed(1))
          : null;

      if (dstArch === 'graduated-cylinder' && cleanDstMl !== null) {
        setInitialVolumeCm3(cleanDstMl);
      }

      setScene((prev) => {
        const updated = prev.instances.map((inst) => {
          if (inst.instanceId === sourceInstanceId) {
            return {
              ...inst,
              instanceState: {
                ...inst.instanceState,
                baseLiquidLevelMl: cleanSrcMl,
                liquidLevelMl: cleanSrcMl,
              },
            };
          }
          if (
            targetInstanceId &&
            inst.instanceId === targetInstanceId &&
            cleanDstMl !== null
          ) {
            return {
              ...inst,
              instanceState: {
                ...inst.instanceState,
                baseLiquidLevelMl: cleanDstMl,
                liquidLevelMl: cleanDstMl,
              },
            };
          }
          return inst;
        });
        return {
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          updatedAt: new Date().toISOString(),
          instances: reconcileCumulativeLabMeasurements(updated),
        };
      });

      labSoundEngine.play('water-pour', {
        fillRatio:
          cleanDstMl !== null
            ? Math.min(1, cleanDstMl / 100)
            : Math.min(1, cleanSrcMl / 100),
        intensity: 0.9,
      });

      if (dstInst && dstAsset && cleanDstMl !== null) {
        notify(
          `Đã nghiêng rót +${pouredMl.toFixed(1)} ml từ "${srcInst?.customLabel || srcAsset?.name.vi}" sang "${dstInst.customLabel || dstAsset.name.vi}" (Còn ${cleanSrcMl.toFixed(1)} ml → Bình nhận: ${cleanDstMl.toFixed(1)} ml).`,
          'success',
        );
      } else {
        notify(
          `Đã nghiêng đổ bớt ${pouredMl.toFixed(1)} ml nước khỏi "${srcInst?.customLabel || srcAsset?.name.vi}" (Mực nước còn lại: ${cleanSrcMl.toFixed(1)} ml).`,
          'info',
        );
      }
    },
    [scene.instances, assetsMap, reconcileCumulativeLabMeasurements, notify],
  );
  handleQuickLabActionRef.current = handleQuickLabAction;

  const handleUpdateInstanceState = useCallback(
    (
      instanceId: string,
      patch: Partial<SceneInstance['instanceState']>,
      notificationMsg?: string,
    ) => {
      const targetInst = scene.instances.find((i) => i.instanceId === instanceId);
      if (targetInst) {
        const customMod = htmlEquipmentModuleRegistry.getModule(targetInst.assetId);
        if (customMod) {
          const ctrl = customMod.moduleControls;
          const nextVal = Number(
            (patch as Record<string, unknown>)[ctrl.stateKey] ?? ctrl.defaultValue,
          );
          if (customMod.playEquipmentSound && !labSoundEngine.isMuted()) {
            try {
              customMod.playEquipmentSound('change-state', nextVal);
            } catch {
              labSoundEngine.play(ctrl.soundPhenomenon ?? 'probe-measure', {
                value: nextVal,
              });
            }
          } else {
            labSoundEngine.play(ctrl.soundPhenomenon ?? 'probe-measure', {
              value: nextVal,
            });
          }
        }
      }

      setScene((prev) => {
        const draft = prev.instances.map((inst) =>
          inst.instanceId === instanceId
            ? {
                ...inst,
                instanceState: {
                  ...inst.instanceState,
                  ...patch,
                },
              }
            : inst,
        );
        return {
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: reconcileCumulativeLabMeasurements(draft),
        };
      });
      if (notificationMsg) {
        notify(notificationMsg, 'info');
      }
    },
    [scene.instances, reconcileCumulativeLabMeasurements, notify],
  );

  const handleToggleInstanceVisibility = useCallback((instanceId: string) => {
    setScene((prev) => ({
      ...prev,
      instances: prev.instances.map((inst) =>
        inst.instanceId === instanceId ? { ...inst, visible: !inst.visible } : inst,
      ),
    }));
  }, []);

  const handleToggleInstanceLock = useCallback((instanceId: string) => {
    setScene((prev) => ({
      ...prev,
      instances: prev.instances.map((inst) =>
        inst.instanceId === instanceId ? { ...inst, locked: !inst.locked } : inst,
      ),
    }));
  }, []);

  const handleDuplicateInstance = useCallback(
    (instanceId: string) => {
      const source = scene.instances.find((i) => i.instanceId === instanceId);
      if (!source) return;
      handleAddAssetToScene(source.assetId, [
        Number(Math.min(1.15, source.transform.positionM[0] + 0.09).toFixed(3)),
        0,
        Number(Math.min(0.435, source.transform.positionM[2] + 0.06).toFixed(3)),
      ]);
    },
    [scene.instances, handleAddAssetToScene],
  );

  const handleDeleteInstance = useCallback(
    (instanceId: string) => {
      const target = scene.instances.find((i) => i.instanceId === instanceId);
      setScene((prev) => {
        const remaining = prev.instances
          .filter((i) => i.instanceId !== instanceId)
          .map((item) =>
            item.instanceState.attachedToInstanceId === instanceId
              ? {
                  ...item,
                  transform: {
                    ...item.transform,
                    positionM: [
                      item.transform.positionM[0],
                      0,
                      item.transform.positionM[2],
                    ] as [number, number, number],
                  },
                  instanceState: {
                    ...item.instanceState,
                    attachedToInstanceId: null,
                    attachmentSlot: 'bench' as const,
                  },
                }
              : item,
          );
        return {
          ...prev,
          sceneRevision: prev.sceneRevision + 1,
          instances: reconcileCumulativeLabMeasurements(remaining),
        };
      });
      if (selectedInstanceId === instanceId) {
        setSelectedInstanceId(null);
      }
      labSoundEngine.play('wood-place', { intensity: 0.75 });
      if (target) {
        notify(
          `Đã xóa "${target.customLabel || target.assetId}" khỏi khu vực mô phỏng.`,
          'warning',
        );
      }
    },
    [
      scene.instances,
      selectedInstanceId,
      reconcileCumulativeLabMeasurements,
      notify,
    ],
  );

  // Reset Scene to Initial Layout
  const handleResetScene = useCallback(() => {
    const fresh = sceneRepository.cloneInitialScene();
    setScene(fresh);
    setSelectedInstanceId(null);
    setViewMode('lab-scene');
    setStudentGuidedStep(1);
    setMeasuredMassG(null);
    setFinalVolumeCm3(null);
    notify('Đã đặt lại bàn gỗ thí nghiệm và bảng kết quả về trạng thái ban đầu.', 'info');
  }, [notify]);

  // Switch Environment
  const handleSelectEnvironment = useCallback(
    (environmentId: string) => {
      const env = environmentRepository.getById(environmentId);
      if (!env) return;
      setScene((prev) => ({
        ...prev,
        sceneRevision: prev.sceneRevision + 1,
        environmentId,
      }));
      notify(`Đã đổi không gian sang "${env.name.vi}".`, 'success');
    },
    [notify],
  );

  // Switch Active Experiment (Pre-populates required equipment onto Khu trưng bày 2-tier shelf)
  const handleSelectExperiment = useCallback(
    (experimentId: string, clearWorkbenchForNewLesson = true) => {
      const canonicalId =
        experimentId === 'OL3D-EXP-DENSITY-0001'
          ? 'OL3D-EXP-DENSITY-SOLID-0001'
          : experimentId;
      const exp = experimentRepository.getById(canonicalId);
      if (!exp) return;

      const kit = kitRepository.getById(exp.recommendedKitId);
      const stepAssetIds = Array.from(
        new Set(exp.steps.flatMap((s) => s.requiredAssetIds)),
      );
      const kitAssetIds = kit ? kit.items.map((i) => i.assetId) : [];
      const suggestedIds = Array.from(
        new Set([...kitAssetIds, ...stepAssetIds]),
      );

      if (suggestedIds.length > 0) {
        populateShelfWithSuggestedAssets(
          suggestedIds,
          exp.title,
          clearWorkbenchForNewLesson,
        );
      }

      setScene((prev) => ({
        ...prev,
        experimentId: exp.experimentId,
        environmentId: exp.recommendedEnvironmentId || prev.environmentId,
      }));
      if (clearWorkbenchForNewLesson) {
        setMeasuredMassG(null);
        setFinalVolumeCm3(null);
        setInitialVolumeCm3(50);
      }
      setSelectedInstanceId(null);
      setCurrentStepIndex(0);
      setStudentGuidedStep(1);
    },
    [populateShelfWithSuggestedAssets],
  );

  // Pre-populate Khu trưng bày when user selects a Topic / Category in the Equipment Sidebar
  const handleSelectTopicCategory = useCallback(
    (categoryId: string, labelVi: string) => {
      const TOPIC_SHELF_MAP: Record<string, string[]> = {
        all: [
          'OL3D-EQP-BAL-0001',
          'OL3D-EQP-SLD-0001',
          'OL3D-EQP-CYL-0001',
          'OL3D-EQP-OVF-0001',
          'OL3D-EQP-BKR-0001',
          'OL3D-EQP-WDP-1000',
        ],
        'optical-equipment': [
          'OL3D-EQP-OBN-0001',
          'OL3D-EQP-OLP-0001',
          'OL3D-EQP-FOB-0001',
          'OL3D-EQP-OPT-0001',
          'OL3D-EQP-SCR-0001',
          'OL3D-EQP-PSU-0001',
          'OL3D-EQP-LBX-0001',
        ],
        'electrical-equipment': [
          'OL3D-EQP-PSU-0001',
          'OL3D-EQP-GLV-0001',
          'OL3D-EQP-DMM-0001',
          'OL3D-EQP-COIL-0001',
          'OL3D-EQP-STD-0001',
        ],
        'chemical-apparatus': [
          'OL3D-EQP-BKR-0001',
          'OL3D-EQP-FLK-0001',
          'OL3D-EQP-SEP-0001',
          'OL3D-EQP-DSH-0001',
          'OL3D-EQP-DST-0001',
          'OL3D-EQP-WDP-1000',
        ],
        'biology-microscopy': [
          'OL3D-EQP-MIC-0001',
          'OL3D-EQP-DNA-0001',
          'OL3D-EQP-MAG-0001',
          'OL3D-EQP-DSH-0001',
          'OL3D-EQP-BKR-0001',
        ],
        'mass-measurement': [
          'OL3D-EQP-BAL-0001',
          'OL3D-EQP-WGT-0001',
          'OL3D-EQP-SLD-0001',
          'OL3D-EQP-SPH-0001',
          'OL3D-EQP-BLK-0001',
          'OL3D-EQP-BKR-0001',
        ],
        'volume-measurement': [
          'OL3D-EQP-CYL-0001',
          'OL3D-EQP-OVF-0001',
          'OL3D-EQP-BKR-0001',
          'OL3D-EQP-WDP-1000',
          'OL3D-EQP-SLD-0001',
          'OL3D-EQP-BAL-0001',
        ],
        'force-measurement': [
          'OL3D-EQP-DYN-0001',
          'OL3D-EQP-CAL-0001',
          'OL3D-EQP-THM-0001',
          'OL3D-EQP-STD-0001',
          'OL3D-EQP-SLD-0001',
          'OL3D-EQP-WGT-0001',
        ],
        'thermal-equipment': [
          'OL3D-EQP-STD-0001',
          'OL3D-EQP-BKR-0001',
          'OL3D-EQP-ALC-0001',
          'OL3D-EQP-THM-0001',
          'OL3D-EQP-STW-0001',
        ],
        specimens: [
          'OL3D-EQP-SLD-0001',
          'OL3D-EQP-SPH-0001',
          'OL3D-EQP-BLK-0001',
          'OL3D-EQP-HLW-0001',
          'OL3D-EQP-WGT-0001',
          'OL3D-EQP-BAL-0001',
        ],
      };

      const suggested =
        TOPIC_SHELF_MAP[categoryId] ??
        allAssets
          .filter(
            (a) =>
              a.categoryIds?.includes(categoryId as EquipmentCategoryId) ||
              a.category === categoryId,
          )
          .slice(0, 6)
          .map((a) => a.assetId);

      if (suggested.length > 0) {
        populateShelfWithSuggestedAssets(suggested, labelVi, false);
      }
      if (categoryId === 'optical-equipment') {
        setScene((prev) => ({
          ...prev,
          experimentId: 'OL3D-EXP-OPTICS-LENS-0001',
        }));
      } else if (categoryId === 'thermal-equipment') {
        setScene((prev) => ({
          ...prev,
          experimentId: 'OL3D-EXP-THERMAL-BOIL-0001',
        }));
      }
    },
    [allAssets, populateShelfWithSuggestedAssets],
  );

  // Student Screen Navigation Handler
  const handleSelectStudentScreen = useCallback((screen: StudentScreenId) => {
    setStudentScreen(screen);
    if (screen === 'explore-equipment') {
      setViewMode('single-asset');
    } else if (screen === 'lab-room') {
      setViewMode('lab-scene');
    }
  }, []);

  // Teacher Section Navigation Handler
  const handleSelectNavSection = (section: NavSectionId) => {
    setActiveNavSection(section);
    if (section === 'overview' || section === 'governance') {
      setShowNeuralNetworkModal(true);
    } else if (section === 'library-3d') {
      setExplorerTab('equipment');
      setIsExplorerCollapsed(false);
    } else if (section === 'kits') {
      setExplorerTab('kits');
      setIsExplorerCollapsed(false);
    } else if (section === 'environments') {
      setExplorerTab('environments');
      setIsExplorerCollapsed(false);
    }
  };

  // Switch between Student and Teacher Roles
  const handleChangeUserRole = (nextRole: UserRoleMode) => {
    setUserRole(nextRole);
    if (nextRole === 'teacher') {
      setViewMode('lab-scene');
      setShowAxes(true);
    } else {
      setShowAxes(false);
      setShowDimensions(false);
    }
  };

  return (
    <div
      className={`ol3d-app-shell w-full overflow-hidden flex flex-col transition-colors ${
        isDarkMode
          ? 'bg-[#0B121E] text-slate-100'
          : 'bg-[#D5E0ED] text-[#123059]'
      }`}
    >
      {/* A. Top Header Bar (~70px) with Library Toggle, Guide Toggle, Fullscreen Toggle & Dark Theme Toggle */}
      <TopNavBar
        userRole={userRole}
        studentScreen={studentScreen}
        activeSection={activeNavSection}
        globalSearch={searchQuery}
        headerProgressStep={headerProgressStep}
        studentGuidedStep={studentGuidedStep}
        guidedStepTitle={(activeExperiment.steps[studentGuidedStep - 1]?.title ?? '').replace(/^Bước\s+\d+:\s*/i, '')}
        maxGuidedSteps={activeExperiment.steps.length || 5}
        isDarkMode={isDarkMode}
        isLibraryOpen={!isExplorerCollapsed}
        isGuideOpen={isStudentGuideOpen}
        isFullscreen={isViewportFullscreen}
        isNeuralGuideEnabled={isNeuralGuideEnabled}
        onToggleNeuralGuide={() => {
          const next = neuralConnectionEngine.toggleGuideEnabled();
          setIsNeuralGuideEnabled(next);
          notify(
            next
              ? '🧠 Trợ lý Nơ-ron: ĐÃ BẬT (Hiện tia liên kết & chỉ dẫn thao tác)'
              : '🧠 Trợ lý Nơ-ron: ĐÃ TẮT (Chế độ tự do / Đánh giá thi)',
            next ? 'success' : 'info',
          );
        }}
        onOpenNeuralModal={() => {
          setNeuralModalTargetDeviceId(null);
          setShowNeuralNetworkModal(true);
        }}
        onOpenMicroMacroLens={() => setShowMicroMacroModal(true)}
        onOpenSaveProject={() => setShowSaveProjectModal(true)}
        onOpenProjectList={() => setShowOpenProjectModal(true)}
        savedProjectsCount={savedProjectsCount}
        onToggleDarkMode={() => setIsDarkMode((v) => !v)}
        onToggleLibraryPanel={handleToggleLibrarySidebar}
        onToggleGuidePanel={handleToggleStudentGuide}
        onToggleFullscreen={handleToggleViewportFullscreen}
        onChangeHeaderProgressStep={handleChangeHeaderProgressStep}
        onChangeGuidedStep={handleChangeStudentGuidedStep}
        onResetLab={handleResetScene}
        onChangeUserRole={handleChangeUserRole}
        onSelectStudentScreen={handleSelectStudentScreen}
        onOpenStudentHelp={() => setShowStudentHelpModal(true)}
        onSelectSection={handleSelectNavSection}
        onGlobalSearchChange={(val) => {
          setSearchQuery(val);
          if (explorerTab !== 'equipment') setExplorerTab('equipment');
          if (isExplorerCollapsed) setIsExplorerCollapsed(false);
        }}
        recentSearches={recentSearches}
        onCommitSearch={handleRecordRecentSearch}
        onSelectRecentSearch={handleSelectRecentSearch}
        onRemoveRecentSearch={handleRemoveRecentSearch}
        onClearRecentSearches={handleClearRecentSearches}
        onQuickAddSelectedAsset={() => {
          const targetId = activeInspectedAsset?.assetId ?? 'OL3D-EQP-BAL-0001';
          handleAddAssetToScene(targetId);
        }}
        notificationCount={recentLogs.length}
        recentLogs={recentLogs}
      />

      {/* =====================================================================
          MODE 1: STUDENT MODE — Official Reference 6-Region Desktop Layout
         ===================================================================== */}
      {userRole === 'student' ? (
        <div
          className={`flex-1 flex min-h-0 overflow-hidden relative transition-colors ${
            isDarkMode ? 'bg-[#0B121E]' : 'bg-[#D5E0ED]'
          }`}
        >
          {/* SCREEN 1: STUDENT HOME SCREEN */}
          {studentScreen === 'home' && (
            <StudentHomeView
              experiments={experiments}
              kits={kits}
              assetsMap={assetsMap}
              onStartExperiment={(expId) => {
                handleSelectExperiment(expId, true);
                handleSelectStudentScreen('lab-room');
              }}
              onEnterLabDirectly={() => {
                handleSelectStudentScreen('lab-room');
              }}
              onOpenExploreEquipment={() => {
                handleSelectStudentScreen('explore-equipment');
              }}
              onOpenMyKits={() => {
                handleSelectStudentScreen('my-kits');
              }}
              onOpenHelp={() => setShowStudentHelpModal(true)}
            />
          )}

          {/* SCREEN 2: STUDENT MY KITS SCREEN */}
          {studentScreen === 'my-kits' && (
            <StudentKitsView
              kits={kits}
              assetsMap={assetsMap}
              onBackHome={() => handleSelectStudentScreen('lab-room')}
              onSelectKitAndStartLab={(kit) => {
                handleLoadKitToScene(kit);
                handleSelectStudentScreen('lab-room');
              }}
            />
          )}

          {/* SCREEN 3 & 4: REFERENCE 6-REGION LABORATORY WORKSPACE */}
          {(studentScreen === 'lab-room' ||
            studentScreen === 'explore-equipment') && (
            <div className="flex-1 flex gap-1.5 md:gap-2.5 p-1.5 md:p-2.5 min-w-0 min-h-0 overflow-hidden relative">
              {/* B. Left Column: Thư viện (290 px, thu gọn tự động trên điện thoại) */}
              {!isViewportFullscreen && (
                <StudentEquipmentSidebar
                  assets={allAssets}
                  presentAssetIds={presentAssetIdsSet}
                  selectedAssetId={activeInspectedAsset?.assetId ?? null}
                  requiredAssetIds={requiredExperimentAssetIdsSet}
                  isExploreOnlyMode={studentScreen === 'explore-equipment'}
                  isDarkMode={isDarkMode}
                  isCollapsed={isExplorerCollapsed}
                  searchQuery={searchQuery}
                  recentSearches={recentSearches}
                  onSearchChange={setSearchQuery}
                  onCommitSearch={handleRecordRecentSearch}
                  onSelectRecentSearch={handleSelectRecentSearch}
                  onRemoveRecentSearch={handleRemoveRecentSearch}
                  onClearRecentSearches={handleClearRecentSearches}
                  onToggleCollapse={handleToggleLibrarySidebar}
                  onSelectAsset={handleSelectCatalogAsset}
                  onAddAssetToTable={(assetId) => handleAddAssetToScene(assetId)}
                  onInspectAssetDetail={(asset) => {
                    setDetailModalEditMode(false);
                    setStudentDetailModalAsset(asset);
                  }}
                  onSelectCategoryTopic={(catId, labelVi) => {
                    handleSelectTopicCategory(catId, labelVi);
                  }}
                  activeExperimentId={scene.experimentId}
                  onSelectExperiment={(expId) =>
                    handleSelectExperiment(expId, true)
                  }
                  onAssembleOpticalBench={() =>
                    handleQuickLabAction(
                      'assemble-optical-bench',
                      selectedInstanceId ?? '',
                    )
                  }
                />
              )}

              {/* Host Equipment Real Photo Preview Panel (240 × 240, 1:1 contain — Tinh gọn học sinh) */}
              {!isViewportFullscreen && (
                <EquipmentPreviewPanel
                  assetsMap={assetsMap}
                  isSidebarCollapsed={isExplorerCollapsed}
                  isDarkMode={isDarkMode}
                  readOnlySpecs={true}
                  onAddAssetToTable={(assetId) => handleAddAssetToScene(assetId)}
                  onInspectAssetDetail={(asset) => {
                    setDetailModalEditMode(false);
                    setStudentDetailModalAsset(asset);
                  }}
                />
              )}

              {/* Right Main Workspace: Upper Row (3D Viewport + Optional Right Instruction Panel) + Bottom Row (3 Panels) */}
              <div className="flex-1 flex flex-col gap-1.5 md:gap-2.5 min-w-0 min-h-0 overflow-hidden">
                {/* Upper Row: C. Center 3D Viewport + D. Vertical 3D Toolbar + E. Toggleable Right Instruction Panel */}
                <div className="flex-1 flex gap-1.5 md:gap-2.5 min-w-0 min-h-0 overflow-hidden relative">
                  <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
                    <LabViewport3D
                      instances={scene.instances}
                      assetsMap={assetsMap}
                      selectedInstanceId={selectedInstanceId}
                      selectedCatalogAsset={activeInspectedAsset}
                      environment={activeEnvironment}
                      environments={environments}
                      isStudentMode={true}
                      isNeuralGuideEnabled={isNeuralGuideEnabled}
                      toolMode={toolMode}
                      viewMode={
                        studentScreen === 'explore-equipment'
                          ? 'single-asset'
                          : viewMode
                      }
                      showGrid={showGrid}
                      showAxes={showAxes}
                      showLabels={showLabels}
                      showDimensions={showDimensions}
                      showDetailedGuides={showDetailedGuides}
                      onToggleDetailedGuides={() =>
                        setShowDetailedGuides((v) => !v)
                      }
                      studentGuidedStep={studentGuidedStep}
                      onChangeGuidedStep={handleChangeStudentGuidedStep}
                      isFullscreen={isViewportFullscreen}
                      isDarkMode={isDarkMode}
                      isGuideOpen={isStudentGuideOpen}
                      onToggleGuide={handleToggleStudentGuide}
                      onSelectInstance={handleSelectSceneInstance}
                      onUpdateInstanceTransform={(id, pos, rot) =>
                        handleUpdateInstanceTransform(id, pos, rot)
                      }
                      onPhysicalDockInteraction={handlePhysicalDockInteraction}
                      onQuickLabAction={handleQuickLabAction}
                      onDeleteInstance={handleDeleteInstance}
                      onUpdateInstanceState={handleUpdateInstanceState}
                      onDispenseWaterVolume={handleDispenseWaterVolume}
                      onContinuousPourTransfer={handleContinuousPourTransfer}
                      onDropAssetIntoScene={(assetId, posM) =>
                        handleAddAssetToScene(assetId, posM)
                      }
                      onToolModeChange={setToolMode}
                      onViewModeChange={setViewMode}
                      onToggleGrid={() => setShowGrid((v) => !v)}
                      onToggleAxes={() => setShowAxes((v) => !v)}
                      onToggleLabels={() => setShowLabels((v) => !v)}
                      onToggleDimensions={() => setShowDimensions((v) => !v)}
                      onToggleFullscreen={handleToggleViewportFullscreen}
                      onResetScene={handleResetScene}
                      onSelectEnvironment={handleSelectEnvironment}
                      onNotify={notify}
                    />
                  </main>

                  {/* E. Right Panel: Hướng dẫn thí nghiệm (310 px) — Mặc định ẩn, có mũi tên nhỏ để hiện khi cần */}
                  {!isViewportFullscreen && (
                    <StudentGuidedStepPanel
                      experiments={experiments}
                      activeExperiment={activeExperiment}
                      guidedStep={studentGuidedStep}
                      selectedAsset={activeInspectedAsset}
                      selectedInstance={selectedInstance}
                      sceneInstances={scene.instances}
                      assetsMap={assetsMap}
                      isExploreOnlyMode={studentScreen === 'explore-equipment'}
                      isDarkMode={isDarkMode}
                      isCollapsed={!isStudentGuideOpen}
                      onShowGuide={() => setIsStudentGuideOpen(true)}
                      onHideGuide={() => setIsStudentGuideOpen(false)}
                      onSelectExperiment={(expId) =>
                        handleSelectExperiment(expId, true)
                      }
                      onChangeGuidedStep={handleChangeStudentGuidedStep}
                      onSelectAssetById={handleSelectCatalogAsset}
                      onAddAssetToTable={(assetId) =>
                        handleAddAssetToScene(assetId)
                      }
                      onPlaceAllRequiredForExperiment={
                        handlePlaceAllRequiredForExperiment
                      }
                      onAssembleOpticalBench={() =>
                        handleQuickLabAction(
                          'assemble-optical-bench',
                          selectedInstanceId ?? '',
                        )
                      }
                      onUpdateInstanceState={handleUpdateInstanceState}
                      onDeleteInstance={handleDeleteInstance}
                      onResetLabTable={handleResetScene}
                      onOpenAssetDetailModal={(asset) =>
                        setStudentDetailModalAsset(asset)
                      }
                      onSwitchFromExploreToLab={() =>
                        handleSelectStudentScreen('lab-room')
                      }
                      onOpenVideoGuide={() => setShowVideoGuideModal(true)}
                    />
                  )}
                </div>

                {/* F. Bottom Row: 4 Unified Tabs (Kết quả đo, Công thức, Cách đọc & ĐCNN, Hướng dẫn) */}
                {!isViewportFullscreen && (
                  <StudentBottomPanelsRow
                    measuredMassG={measuredMassG}
                    initialVolumeCm3={initialVolumeCm3}
                    finalVolumeCm3={finalVolumeCm3}
                    objectVolumeCm3={objectVolumeCm3}
                    densityGCm3={densityGCm3}
                    isDarkMode={isDarkMode}
                    showDetailedGuides={showDetailedGuides}
                    onToggleDetailedGuides={() =>
                      setShowDetailedGuides((v) => !v)
                    }
                    guidedStep={studentGuidedStep}
                    onChangeGuidedStep={handleChangeStudentGuidedStep}
                    onQuickWeighSpecimen={() => handleChangeStudentGuidedStep(2)}
                    onQuickSubmergeSpecimen={() =>
                      handleChangeStudentGuidedStep(3)
                    }
                    activeExperiment={activeExperiment}
                    onAssembleOpticalBench={() =>
                      handleQuickLabAction(
                        'assemble-optical-bench',
                        selectedInstanceId ?? '',
                      )
                    }
                    waterTemperatureC={liveWaterTempC}
                    isFlameLit={isLiveFlameLit}
                    onQuickIgniteBurner={handleQuickToggleBurnerFlame}
                    onQuickCoolWater={handleQuickCoolWater}
                    measuredForceAirN={liveArchimedesParams.measuredForceAirN}
                    measuredForceSubN={liveArchimedesParams.measuredForceSubN}
                    displacedVolumeMl={liveArchimedesParams.displacedVolumeMl}
                    opticalDCm={liveOpticsParams.dCm}
                    opticalDPrimeCm={liveOpticsParams.dPrimeCm}
                    opticalFCm={liveOpticsParams.fCm}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* =====================================================================
           MODE 2: TEACHER / ADMIN MODE
           ===================================================================== */
        <div className="flex-1 flex min-h-0 overflow-hidden relative bg-[#0B0F17] text-slate-100">
          {!isViewportFullscreen && (
            <AssetExplorerPanel
              activeTab={explorerTab}
              onTabChange={setExplorerTab}
              assets={filteredAssets}
              categories={categories}
              kits={kits}
              environments={environments}
              selectedCatalogAssetId={activeInspectedAsset?.assetId ?? null}
              activeEnvironmentId={scene.environmentId}
              searchQuery={searchQuery}
              recentSearches={recentSearches}
              selectedSubject={selectedSubject}
              selectedCategory={selectedCategory}
              selectedVerification={selectedVerification}
              selectedFormat={selectedFormat}
              isCollapsed={isExplorerCollapsed}
              onToggleCollapse={() => setIsExplorerCollapsed((v) => !v)}
              onSearchChange={setSearchQuery}
              onCommitSearch={handleRecordRecentSearch}
              onSelectRecentSearch={handleSelectRecentSearch}
              onRemoveRecentSearch={handleRemoveRecentSearch}
              onClearRecentSearches={handleClearRecentSearches}
              onSubjectChange={(subj) => {
                setSelectedSubject(subj);
                if (subj !== 'all') {
                  const subjAssets = allAssets
                    .filter((a) => a.subject === subj)
                    .slice(0, 6)
                    .map((a) => a.assetId);
                  if (subjAssets.length > 0) {
                    populateShelfWithSuggestedAssets(
                      subjAssets,
                      `Phân môn ${subj}`,
                      false,
                    );
                  }
                }
              }}
              onCategoryChange={(catId) => {
                setSelectedCategory(catId);
                const catObj = categories.find((c) => c.id === catId);
                handleSelectTopicCategory(
                  catId,
                  catObj ? catObj.label : catId,
                );
              }}
              onVerificationChange={setSelectedVerification}
              onFormatChange={setSelectedFormat}
              onSelectCatalogAsset={handleSelectCatalogAsset}
              onAddAssetToScene={(assetId) => handleAddAssetToScene(assetId)}
              onBatchAddAssetsToScene={handleBatchAddAssetsToScene}
              onLoadKitToScene={handleLoadKitToScene}
              onSelectEnvironment={handleSelectEnvironment}
            />
          )}

          {!isViewportFullscreen && (
            <EquipmentPreviewPanel
              assetsMap={assetsMap}
              isSidebarCollapsed={isExplorerCollapsed}
              isDarkMode={true}
              onAddAssetToTable={(assetId) => handleAddAssetToScene(assetId)}
              onInspectAssetDetail={(asset, editMode = false) => {
                setDetailModalEditMode(editMode);
                setStudentDetailModalAsset(asset);
              }}
              onOpenPhotoUpdaterForAsset={(asset) => {
                setPhotoUpdaterTargetAsset(asset);
              }}
            />
          )}

          <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
            <LabViewport3D
              instances={scene.instances}
              assetsMap={assetsMap}
              selectedInstanceId={selectedInstanceId}
              selectedCatalogAsset={activeInspectedAsset}
              environment={activeEnvironment}
              environments={environments}
              isStudentMode={false}
              isNeuralGuideEnabled={isNeuralGuideEnabled}
              toolMode={toolMode}
              viewMode={viewMode}
              showGrid={showGrid}
              showAxes={showAxes}
              showLabels={showLabels}
              showDimensions={showDimensions}
              showDetailedGuides={showDetailedGuides}
              onToggleDetailedGuides={() => setShowDetailedGuides((v) => !v)}
              isFullscreen={isViewportFullscreen}
              isDarkMode={true}
              onSelectInstance={handleSelectSceneInstance}
              onUpdateInstanceTransform={(id, pos, rot) =>
                handleUpdateInstanceTransform(id, pos, rot)
              }
              onPhysicalDockInteraction={handlePhysicalDockInteraction}
              onQuickLabAction={handleQuickLabAction}
              onDeleteInstance={handleDeleteInstance}
              onUpdateInstanceState={handleUpdateInstanceState}
              onDispenseWaterVolume={handleDispenseWaterVolume}
              onContinuousPourTransfer={handleContinuousPourTransfer}
              onDropAssetIntoScene={(assetId, posM) =>
                handleAddAssetToScene(assetId, posM)
              }
              onToolModeChange={setToolMode}
              onViewModeChange={setViewMode}
              onToggleGrid={() => setShowGrid((v) => !v)}
              onToggleAxes={() => setShowAxes((v) => !v)}
              onToggleLabels={() => setShowLabels((v) => !v)}
              onToggleDimensions={() => setShowDimensions((v) => !v)}
              onToggleFullscreen={handleToggleViewportFullscreen}
              onResetScene={handleResetScene}
              onSelectEnvironment={handleSelectEnvironment}
              onNotify={notify}
            />

            {!isViewportFullscreen && (
              <BottomWorkspaceTray
                experiments={experiments}
                activeExperiment={activeExperiment}
                currentStepIndex={currentStepIndex}
                environments={environments}
                activeEnvironmentId={scene.environmentId}
                sceneInstances={scene.instances}
                assetsMap={assetsMap}
                onSelectExperiment={(expId) =>
                  handleSelectExperiment(expId, false)
                }
                onStepChange={setCurrentStepIndex}
                onSelectEnvironment={handleSelectEnvironment}
                onAddAssetToScene={(assetId) => handleAddAssetToScene(assetId)}
              />
            )}
          </main>

          {!isViewportFullscreen &&
            (isRightPanelCollapsed ? (
              <aside className="w-10 bg-[#0E1420] border-l border-slate-800/90 flex flex-col items-center py-2.5 gap-3 shrink-0 z-20">
                <button
                  type="button"
                  onClick={() => setIsRightPanelCollapsed(false)}
                  className="w-8 h-8 rounded-[6px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white flex items-center justify-center cursor-pointer shadow-xs"
                  title="Mở rộng Scene Hierarchy & Inspector"
                >
                  <ChevronRight className="w-4 h-4 rotate-180 text-white" />
                </button>
              </aside>
            ) : (
              <aside className="w-84 xl:w-92 bg-[#0E1420] border-l border-slate-800/90 flex flex-col h-full shrink-0 z-20">
                <div className="h-8 px-3 bg-[#090D16] border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
                  <span className="font-mono">
                    Scene Rev #{scene.sceneRevision}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsRightPanelCollapsed(true)}
                    className="h-6 px-2 rounded-[6px] bg-[#DC2626] hover:bg-[#B91C1C] border border-[#F87171] text-white text-[11px] font-extrabold flex items-center gap-0.5 cursor-pointer shadow-xs"
                  >
                    <span>Ẩn</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>

                <SceneHierarchyPanel
                  environment={activeEnvironment}
                  instances={scene.instances}
                  assetsMap={assetsMap}
                  selectedInstanceId={selectedInstanceId}
                  onSelectInstance={handleSelectSceneInstance}
                  onToggleInstanceVisibility={handleToggleInstanceVisibility}
                  onToggleInstanceLock={handleToggleInstanceLock}
                  onDuplicateInstance={handleDuplicateInstance}
                  onDeleteInstance={handleDeleteInstance}
                />

                <InspectorPanel
                  selectedInstance={selectedInstance}
                  selectedAsset={activeInspectedAsset}
                  instances={scene.instances}
                  assetsMap={assetsMap}
                  onUpdateInstanceTransform={handleUpdateInstanceTransform}
                  onUpdateInstanceState={handleUpdateInstanceState}
                  onAddAssetToScene={(assetId) => handleAddAssetToScene(assetId)}
                  onDeleteInstance={handleDeleteInstance}
                />
              </aside>
            ))}
        </div>
      )}

      {/* Toast Feedback Notification — Nền trong suốt glassmorphism & Tự tắt sau 10s */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 max-w-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-4 py-3 flex items-center gap-3 text-sm backdrop-blur-2xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
            toast.tone === 'success'
              ? 'bg-slate-950/45 border-emerald-500/40 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
              : toast.tone === 'warning'
              ? 'bg-slate-950/45 border-amber-500/40 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
              : toast.tone === 'error'
              ? 'bg-slate-950/45 border-rose-500/40 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
              : 'bg-slate-950/45 border-cyan-500/40 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
          }`}
        >
          {toast.tone === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          {toast.tone === 'warning' && (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          {toast.tone === 'error' && (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          {toast.tone === 'info' && (
            <Info className="w-5 h-5 text-cyan-400 shrink-0" />
          )}
          <span className="font-semibold text-slate-100 flex-1 leading-snug"><RichMathText text={toast.message} /></span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer shrink-0"
          >
            Đóng
          </button>
          {/* Thanh đếm ngược 8 giây tự tắt */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 overflow-hidden rounded-b-2xl">
            <div
              key={toast.id}
              className={`h-full ${
                toast.tone === 'success'
                  ? 'bg-emerald-400/80'
                  : toast.tone === 'warning'
                  ? 'bg-amber-400/80'
                  : toast.tone === 'error'
                  ? 'bg-rose-400/80'
                  : 'bg-cyan-400/80'
              }`}
              style={{
                animation: 'toastCountdown 8s linear forwards',
              }}
            />
          </div>
        </div>
      )}

      {/* Save & Open Project Modals (Kiểu 1) */}
      <SaveProjectModal
        isOpen={showSaveProjectModal}
        onClose={() => setShowSaveProjectModal(false)}
        scene={scene}
        measurements={{
          measuredMassG,
          initialVolumeCm3,
          finalVolumeCm3,
          studentGuidedStep,
        }}
        onSaveSuccess={(saved) => {
          setSavedProjectsCount(projectStorage.getCount());
          notify(`Đã lưu bài thực hành "${saved.name}" thành công!`, 'success');
        }}
        isDarkMode={isDarkMode}
      />

      <OpenProjectModal
        isOpen={showOpenProjectModal}
        onClose={() => setShowOpenProjectModal(false)}
        onLoadProject={handleLoadSavedProject}
        onProjectsCountChange={(cnt) => setSavedProjectsCount(cnt)}
        isDarkMode={isDarkMode}
      />

      {/* Student Help Modal */}
      {showStudentHelpModal && (
        <StudentHelpModal onClose={() => setShowStudentHelpModal(false)} />
      )}

      {/* Student Video Guide Modal */}
      {showVideoGuideModal && (
        <StudentVideoGuideModal
          onClose={() => setShowVideoGuideModal(false)}
          onRunAutoDemo={() => handleChangeStudentGuidedStep(3)}
        />
      )}

      {/* Student Equipment Detail Modal (Includes Real Photo, 3-Way Icon/3D/Photo View & Direct Product Parameter Editor) */}
      {studentDetailModalAsset && (
        <StudentEquipmentDetailModal
          asset={studentDetailModalAsset}
          initialEditMode={detailModalEditMode}
          onClose={() => {
            setStudentDetailModalAsset(null);
            setDetailModalEditMode(false);
          }}
          onAddToLab={(assetId) => {
            handleAddAssetToScene(assetId);
            if (studentScreen !== 'lab-room') {
              handleSelectStudentScreen('lab-room');
            }
          }}
          onSaveUpdatedAsset={(updatedAsset) => {
            const saved = htmlEquipmentModuleRegistry.updateAssetDefinition(
              updatedAsset.assetId,
              updatedAsset,
            );
            openLabAssetLoader.invalidateAssetCache(saved.assetId);
            setModuleRegistryRevision((r) => r + 1);
            setStudentDetailModalAsset(saved);
            setScene((prev) => {
              const draft = prev.instances.map((inst) =>
                inst.assetId === saved.assetId
                  ? {
                      ...inst,
                      assetVersion: saved.assetVersion,
                      customLabel: saved.name.vi,
                    }
                  : inst,
              );
              return {
                ...prev,
                sceneRevision: prev.sceneRevision + 1,
                updatedAt: new Date().toISOString(),
                instances: reconcileCumulativeLabMeasurements(draft),
              };
            });
            labSoundEngine.play('step-complete', 0.9);
            notify(
              `Đã cập nhật trực tiếp thông số sản phẩm "${saved.name.vi}" (${saved.assetId}) trên cả thư viện và bàn 3D!`,
              'success',
            );
          }}
          onOpenPhotoUpdaterForAsset={(targetAsset) => {
            setPhotoUpdaterTargetAsset(targetAsset);
          }}
        />
      )}

      {/* Modal Cập nhật Hình ảnh Thực tế (240×240, 1:1 contain) cho từng Thiết bị */}
      {photoUpdaterTargetAsset && (
        <EquipmentRealPhotoUpdaterModal
          asset={photoUpdaterTargetAsset}
          onClose={() => setPhotoUpdaterTargetAsset(null)}
          onPhotoUpdated={(assetId, _dataUrlOrPath, caption) => {
            setModuleRegistryRevision((r) => r + 1);
            labSoundEngine.play('step-complete', 0.9);
            notify(
              `Đã cập nhật ảnh thực tế 240×240 cho "${caption}" (${assetId}) trong thư viện libraries3DLab!`,
              'success',
            );
          }}
          onSwitchToEditParams={(asset) => {
            setDetailModalEditMode(true);
            setStudentDetailModalAsset(asset);
          }}
        />
      )}

      {/* 3D Optical Microscope Simulation Modal (KHTN THCS) */}
      <MicroscopeSimulationModal
        isOpen={showMicroscopeModal}
        onClose={() => setShowMicroscopeModal(false)}
        initialObjectiveMag={
          (scene.instances.find(
            (i) => i.assetId === 'OL3D-EQP-MIC-0001',
          )?.instanceState.magnification as number) || 10
        }
        onSyncWith3DScene={(state) => {
          const micInst = scene.instances.find(
            (i) => i.assetId === 'OL3D-EQP-MIC-0001',
          );
          if (micInst) {
            setScene((prev) => ({
              ...prev,
              sceneRevision: prev.sceneRevision + 1,
              instances: prev.instances.map((item) =>
                item.instanceId === micInst.instanceId
                  ? {
                      ...item,
                      instanceState: {
                        ...item.instanceState,
                        magnification: state.magnification,
                        focusZ: state.focusZ,
                        specimenId: state.specimenId,
                        isLightOn: state.isLightOn,
                      },
                    }
                  : item,
              ),
            }));
          }
        }}
      />

      {/* Sơ đồ Mạng Nơ-ron Thần kinh Thiết bị KHTN THCS & Causal Studio Modal */}
      <NeuralDeviceNetworkModal
        isOpen={showNeuralNetworkModal}
        initialDeviceId={neuralModalTargetDeviceId}
        onClose={() => {
          setShowNeuralNetworkModal(false);
          setNeuralModalTargetDeviceId(null);
        }}
        onSelectDevice={(deviceId, targetPos) => {
          const node = neuralConnectionEngine.getNode(deviceId);
          const targetAssetId = node?.assetId || deviceId;
          handleAddAssetToScene(targetAssetId, targetPos);
          setShowNeuralNetworkModal(false);
          notify(`Đã nạp "${node?.nameVi || targetAssetId}" vào bàn thí nghiệm 3D`, 'success');
        }}
        onTriggerMacroCluster={(cluster) => {
          cluster.deviceIds.forEach((devSlug, idx) => {
            const node = neuralConnectionEngine.getNode(devSlug);
            if (node) {
              const xPos = -0.35 + idx * 0.18;
              handleAddAssetToScene(node.assetId, [xPos, 0, 0.08]);
            }
          });
          setShowNeuralNetworkModal(false);
          notify(`⚡ Đã đưa toàn bộ ${cluster.deviceIds.length} thiết bị bài "${cluster.title}" ra bàn 3D!`, 'success');
        }}
        activeSceneDeviceIds={scene.instances.map((i) => i.assetId)}
      />

      {/* Mạng Nơ-ron Nhận thức 3 Tầng: Trợ lý Socratic chẩn đoán ngộ nhận tư duy */}
      <SocraticTutorModal />

      {/* Lăng kính Đa thang đo Vi mô (Micro-Macro Lens Modal) */}
      <MicroMacroLensModal
        isOpen={showMicroMacroModal}
        onClose={() => setShowMicroMacroModal(false)}
      />
    </div>
  );
}
