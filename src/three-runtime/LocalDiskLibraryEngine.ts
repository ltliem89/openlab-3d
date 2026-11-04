/**
 * OPENLAB 3D — ARDUINO-STYLE LOCAL DISK LIBRARY ENGINE
 * Quản lý thư viện thiết bị 3D (.HTML) trên ổ cứng máy tính tương tự cơ chế Arduino Libraries:
 * Đường dẫn chuẩn mặc định: C:\Users\ltlie\Documents\libraries3DLab
 *
 * Cấu trúc thư mục trên ổ cứng:
 * C:\Users\ltlie\Documents\libraries3DLab\
 * ├── library-index.json
 * ├── README_LIBRARIES_3DLAB.md
 * ├── OL3D-EQP-BAL-0001_can-dien-tu-hien-so-500g\
 * │   ├── library.properties        (Chuẩn thuộc tính giống Arduino library.properties)
 * │   ├── manifest.json             (Hồ sơ thông số 4 lớp & 5 nguồn web)
 * │   └── can-dien-tu-hien-so-500g.html (File .html độc lập chuẩn OL3D-HTML-MODULE v2.2)
 * └── ...
 *
 * Hỗ trợ 4 tầng đồng bộ:
 * 1. Native File System Access API (showDirectoryPicker) -> Ghi/đọc trực tiếp thư mục thật trên ổ cứng.
 * 2. Folder Scanner (webkitdirectory) -> Quét nạp nguyên thư mục C:\Users\ltlie\Documents\libraries3DLab ngay cả trong iFrame.
 * 3. IndexedDB Persistent Virtual Disk -> Lưu bền vững 100% các module đã cập nhật qua mọi lần F5 / khởi động lại trình duyệt.
 * 4. One-Click Windows Installer (.bat / PowerShell) & Auto-Save .HTML -> Đồng bộ tức thì ra đúng C:\Users\ltlie\Documents\libraries3DLab.
 */

import { AssetDefinition } from '../domain/types';

export const DEFAULT_LIBRARY_DISK_PATH = 'C:\\Users\\ltlie\\Documents\\libraries3DLab';
const IDB_DATABASE_NAME = 'OpenLab3D_LibrariesDisk_DB_v1';
const IDB_STORE_MODULES = 'library_modules';
const IDB_STORE_HANDLES = 'directory_handles';
const IDB_STORE_SETTINGS = 'library_settings';

export interface ArduinoStyleLibraryProperties {
  name: string;
  version: string;
  author: string;
  maintainer: string;
  sentence: string;
  paragraph: string;
  category: string;
  url: string;
  architectures: string;
  assetId: string;
  slug: string;
  updatedAt: string;
}

export interface StoredLibraryModuleEntry {
  assetId: string;
  slug: string;
  folderName: string; // VD: OL3D-EQP-BAL-0001_can-dien-tu-hien-so-500g
  virtualPath: string; // VD: C:\Users\ltlie\Documents\libraries3DLab\OL3D-EQP-BAL-0001_can-dien-tu-hien-so-500g\can-dien-tu-hien-so-500g.html
  htmlFileName: string;
  rawHtmlSource: string;
  libraryPropertiesText: string;
  manifestJsonText: string;
  assetSnapshot: AssetDefinition;
  uploadedRealPhotoDataUrl?: string;
  updatedAtIso: string;
  syncedToPhysicalDisk: boolean;
}

export interface LibraryDiskStatus {
  configuredBasePath: string;
  hasConfiguredLibraryPath: boolean;
  isPhysicalFolderConnected: boolean;
  physicalFolderName: string | null;
  autoDownloadOnUpdate: boolean;
  totalStoredModules: number;
  lastSyncTimeIso: string | null;
  lastSyncMessage: string | null;
}

/**
 * Tạo nội dung file `library.properties` chuẩn Arduino IDE cho mỗi thiết bị 3D
 */
export function buildArduinoLibraryProperties(asset: AssetDefinition): string {
  const massStr = asset.scientificProperties.referenceMass
    ? `${asset.scientificProperties.referenceMass.value}${asset.scientificProperties.referenceMass.unit}`
    : 'N/A';
  const dimStr = `${asset.geometry.dimensions.widthOrDiameter.value}x${asset.geometry.dimensions.height.value}mm`;

  const lines = [
    `name=${asset.name.vi} (${asset.assetId})`,
    `version=${asset.assetVersion || '1.0.0'}`,
    `author=${asset.provenance?.createdBy || 'OpenLab 3D Studio'}`,
    `maintainer=${asset.provenance?.organization || 'OpenLab Vietnam <libraries3DLab>'}`,
    `sentence=${asset.summary || asset.name.vi}`,
    `paragraph=Thiet bi KHTN 9 (${asset.name.en}) - Kich thuoc: ${dimStr} - Khoi luong: ${massStr}. Tuong thich chuan OL3D-HTML-MODULE v2.2.`,
    `category=${asset.category || 'Science Equipment'}`,
    `url=https://openlab3d.vn/libraries/${asset.assetId}`,
    `architectures=OL3D-HTML-MODULE-v2.2,ThreeJS-WebGL`,
    `includes=${asset.slug}.html`,
    `assetId=${asset.assetId}`,
    `slug=${asset.slug}`,
    `updatedAt=${new Date().toISOString()}`,
  ];
  return lines.join('\n') + '\n';
}

export function getLibraryFolderName(assetId: string, slug: string): string {
  const safeId = assetId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeSlug = (slug || 'thiet-bi').replace(/[^a-zA-Z0-9_-]/g, '-');
  return `${safeId}_${safeSlug}`;
}

class LocalDiskLibraryEngineImpl {
  private configuredBasePath: string = DEFAULT_LIBRARY_DISK_PATH;
  private hasConfiguredLibraryPath: boolean = false;
  private directoryHandle: FileSystemDirectoryHandle | null = null;
  private autoDownloadOnUpdate: boolean = false;
  private cachedEntries = new Map<string, StoredLibraryModuleEntry>();
  private lastSyncTimeIso: string | null = null;
  private lastSyncMessage: string | null = null;
  private listeners = new Set<() => void>();
  private externalDeltaListeners = new Set<
    (delta: {
      upserted: StoredLibraryModuleEntry[];
      removedIds: string[];
    }) => void
  >();
  private liveSyncChannel: BroadcastChannel | null = null;
  private lastPhysicalFingerprint: string = '';
  private lastFocusCheckMs: number = 0;
  private initPromise: Promise<void> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedPath = window.localStorage.getItem('ol3d_library_base_path');
      if (savedPath && savedPath.trim()) {
        this.configuredBasePath = savedPath.trim();
      }
      const savedApplied = window.localStorage.getItem('ol3d_library_path_applied_v1');
      if (savedApplied === 'true') {
        this.hasConfiguredLibraryPath = true;
      }
      const savedAutoDl = window.localStorage.getItem('ol3d_library_auto_dl');
      if (savedAutoDl === 'true') {
        this.autoDownloadOnUpdate = true;
      }

      if ('BroadcastChannel' in window) {
        try {
          this.liveSyncChannel = new BroadcastChannel('ol3d_library_live_sync_v1');
          this.liveSyncChannel.onmessage = (ev) => {
            if (ev.data && ev.data.type === 'LIBRARY_UPDATED_EXTERNAL') {
              void this.reloadDeltaFromIndexedDB();
            }
          };
        } catch {
          // Ignore BroadcastChannel restriction if any
        }
      }

      window.addEventListener('storage', (ev) => {
        if (ev.key === 'ol3d_library_base_path' && ev.newValue) {
          this.configuredBasePath = ev.newValue;
          this.emitChange();
        } else if (ev.key === 'ol3d_library_path_applied_v1') {
          this.hasConfiguredLibraryPath = ev.newValue === 'true';
          this.emitChange();
        } else if (ev.key === 'ol3d_library_sync_pulse_v1') {
          void this.reloadDeltaFromIndexedDB();
        }
      });

      // Tự động kiểm tra thay đổi siêu nhẹ (chỉ đọc metadata size + lastModified, có chống dội 3s) khi quay lại tab
      window.addEventListener('focus', () => {
        const now = Date.now();
        if (now - this.lastFocusCheckMs > 3000) {
          this.lastFocusCheckMs = now;
          void this.reloadDeltaFromIndexedDB();
        }
      });
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onExternalLibraryDelta(
    listener: (delta: {
      upserted: StoredLibraryModuleEntry[];
      removedIds: string[];
    }) => void,
  ): () => void {
    this.externalDeltaListeners.add(listener);
    return () => this.externalDeltaListeners.delete(listener);
  }

  private emitChange(): void {
    this.listeners.forEach((fn) => fn());
  }

  public notifyCrossTabLibraryPulse(): void {
    if (typeof window === 'undefined') return;
    try {
      this.liveSyncChannel?.postMessage({
        type: 'LIBRARY_UPDATED_MAIN',
        timestamp: Date.now(),
      });
      window.localStorage.setItem('ol3d_library_main_pulse_v1', String(Date.now()));
    } catch {
      // Ignore
    }
  }

  /**
   * Đồng bộ thông minh phần thay đổi (Delta) từ IndexedDB mà chỉ parse các module mới/thay đổi
   */
  async reloadDeltaFromIndexedDB(): Promise<{
    upserted: StoredLibraryModuleEntry[];
    removedIds: string[];
  }> {
    try {
      const db = await this.openDatabase();
      const entries = await new Promise<StoredLibraryModuleEntry[]>(
        (resolve, reject) => {
          const tx = db.transaction(IDB_STORE_MODULES, 'readonly');
          const store = tx.objectStore(IDB_STORE_MODULES);
          const getAllReq = store.getAll();
          getAllReq.onsuccess = () =>
            resolve((getAllReq.result as StoredLibraryModuleEntry[]) || []);
          getAllReq.onerror = () => reject(getAllReq.error);
        },
      );

      const upserted: StoredLibraryModuleEntry[] = [];
      const incomingIds = new Set<string>();

      for (const entry of entries) {
        incomingIds.add(entry.assetId);
        const prev = this.cachedEntries.get(entry.assetId);
        const isChanged =
          !prev ||
          prev.updatedAtIso !== entry.updatedAtIso ||
          (prev.rawHtmlSource || '').length !== (entry.rawHtmlSource || '').length ||
          prev.uploadedRealPhotoDataUrl !== entry.uploadedRealPhotoDataUrl;

        if (isChanged) {
          this.cachedEntries.set(entry.assetId, entry);
          upserted.push(entry);
        }
      }

      const removedIds: string[] = [];
      for (const existingId of Array.from(this.cachedEntries.keys())) {
        if (!incomingIds.has(existingId)) {
          this.cachedEntries.delete(existingId);
          removedIds.push(existingId);
        }
      }

      if (upserted.length > 0 || removedIds.length > 0) {
        this.lastSyncTimeIso = new Date().toISOString();
        this.lastSyncMessage = `Đã tự động cập nhật ${upserted.length} module từ thư viện libraries3DLab`;
        this.externalDeltaListeners.forEach((fn) =>
          fn({ upserted, removedIds }),
        );
        this.emitChange();
      }

      return { upserted, removedIds };
    } catch {
      return { upserted: [], removedIds: [] };
    }
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB không khả dụng trên môi trường này.'));
        return;
      }
      const req = window.indexedDB.open(IDB_DATABASE_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE_MODULES)) {
          db.createObjectStore(IDB_STORE_MODULES, { keyPath: 'assetId' });
        }
        if (!db.objectStoreNames.contains(IDB_STORE_HANDLES)) {
          db.createObjectStore(IDB_STORE_HANDLES);
        }
        if (!db.objectStoreNames.contains(IDB_STORE_SETTINGS)) {
          db.createObjectStore(IDB_STORE_SETTINGS);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Khởi tạo và nạp lại toàn bộ các module đã lưu trong ổ đĩa thư viện bền vững
   */
  async initialize(
    onRestoreModuleCallback?: (entry: StoredLibraryModuleEntry) => void,
  ): Promise<StoredLibraryModuleEntry[]> {
    if (this.initPromise) {
      await this.initPromise;
      return Array.from(this.cachedEntries.values());
    }

    this.initPromise = (async () => {
      try {
        const db = await this.openDatabase();
        // 1. Nạp danh sách các module đã lưu
        const entries = await new Promise<StoredLibraryModuleEntry[]>(
          (resolve, reject) => {
            const tx = db.transaction(IDB_STORE_MODULES, 'readonly');
            const store = tx.objectStore(IDB_STORE_MODULES);
            const getAllReq = store.getAll();
            getAllReq.onsuccess = () =>
              resolve((getAllReq.result as StoredLibraryModuleEntry[]) || []);
            getAllReq.onerror = () => reject(getAllReq.error);
          },
        );

        for (const entry of entries) {
          this.cachedEntries.set(entry.assetId, entry);
          if (onRestoreModuleCallback) {
            try {
              onRestoreModuleCallback(entry);
            } catch (err) {
              console.warn('Không thể khôi phục module từ thư viện:', entry.assetId, err);
            }
          }
        }

        // 2. Thử khôi phục FileSystemDirectoryHandle nếu đã từng chọn thư mục trên ổ cứng
        const savedHandle = await new Promise<FileSystemDirectoryHandle | null>(
          (resolve) => {
            const tx = db.transaction(IDB_STORE_HANDLES, 'readonly');
            const store = tx.objectStore(IDB_STORE_HANDLES);
            const getReq = store.get('root_libraries3DLab');
            getReq.onsuccess = () => resolve(getReq.result || null);
            getReq.onerror = () => resolve(null);
          },
        );

        if (savedHandle) {
          this.directoryHandle = savedHandle;
          this.hasConfiguredLibraryPath = true;
        }

        if (entries.length > 0) {
          this.lastSyncTimeIso = entries[0].updatedAtIso;
          this.lastSyncMessage = `Đã tự động nạp ${entries.length} module thiết bị từ thư viện ${this.configuredBasePath}`;
        }
        this.emitChange();
      } catch (err) {
        console.warn('Khởi tạo LocalDiskLibraryEngine cảnh báo:', err);
      }
    })();

    await this.initPromise;
    return Array.from(this.cachedEntries.values());
  }

  getStatus(): LibraryDiskStatus {
    return {
      configuredBasePath: this.configuredBasePath,
      hasConfiguredLibraryPath:
        this.hasConfiguredLibraryPath || Boolean(this.directoryHandle),
      isPhysicalFolderConnected: Boolean(this.directoryHandle),
      physicalFolderName: this.directoryHandle ? this.directoryHandle.name : null,
      autoDownloadOnUpdate: this.autoDownloadOnUpdate,
      totalStoredModules: this.cachedEntries.size,
      lastSyncTimeIso: this.lastSyncTimeIso,
      lastSyncMessage: this.lastSyncMessage,
    };
  }

  /**
   * Tự động quét lại thư mục ổ cứng đã kết nối một cách thông minh (chỉ đọc file khi fingerprint size/lastModified thay đổi)
   */
  async tryAutoScanSavedDirectoryHandle(): Promise<string[]> {
    if (!this.directoryHandle) return [];
    try {
      const handleWithPerm = this.directoryHandle as unknown as {
        queryPermission?: (desc: { mode: 'read' }) => Promise<PermissionState>;
      };
      if (handleWithPerm.queryPermission) {
        const perm = await handleWithPerm.queryPermission({ mode: 'read' });
        if (perm !== 'granted') return [];
      }

      // Tính fingerprint siêu nhẹ từ metadata trước khi đọc nội dung
      const dirWithEntries = this.directoryHandle as unknown as {
        values?: () => AsyncIterable<FileSystemHandle>;
      };
      if (!dirWithEntries.values) return [];

      const metaParts: string[] = [];
      const changedFileHandles: FileSystemFileHandle[] = [];

      for await (const entry of dirWithEntries.values()) {
        if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.html')) {
          const fh = entry as FileSystemFileHandle;
          const file = await fh.getFile();
          metaParts.push(`${entry.name}:${file.size}:${file.lastModified}`);
          changedFileHandles.push(fh);
        } else if (entry.kind === 'directory') {
          const subDir = entry as FileSystemDirectoryHandle;
          const subWithValues = subDir as unknown as {
            values?: () => AsyncIterable<FileSystemHandle>;
          };
          if (subWithValues.values) {
            for await (const subEntry of subWithValues.values()) {
              if (
                subEntry.kind === 'file' &&
                subEntry.name.toLowerCase().endsWith('.html')
              ) {
                const fh = subEntry as FileSystemFileHandle;
                const file = await fh.getFile();
                metaParts.push(
                  `${entry.name}/${subEntry.name}:${file.size}:${file.lastModified}`,
                );
                changedFileHandles.push(fh);
              }
            }
          }
        }
      }

      const nextFingerprint = metaParts.sort().join('|');
      if (nextFingerprint === this.lastPhysicalFingerprint) {
        return []; // Không có bất kỳ thay đổi nào trên ổ cứng -> Tốn 0 CPU đọc/parse file!
      }
      this.lastPhysicalFingerprint = nextFingerprint;

      const htmlList: string[] = [];
      for (const fh of changedFileHandles) {
        const file = await fh.getFile();
        htmlList.push(await file.text());
      }

      if (htmlList.length > 0) {
        this.lastSyncTimeIso = new Date().toISOString();
        this.lastSyncMessage = `Đã tự động nạp ${htmlList.length} module từ thư mục ổ cứng "${this.directoryHandle.name}"`;
        this.emitChange();
      }
      return htmlList;
    } catch {
      return [];
    }
  }

  setConfiguredBasePath(newPath: string): void {
    const clean = newPath.trim() || DEFAULT_LIBRARY_DISK_PATH;
    this.configuredBasePath = clean;
    this.hasConfiguredLibraryPath = true;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ol3d_library_base_path', clean);
      window.localStorage.setItem('ol3d_library_path_applied_v1', 'true');
    }
    // Cập nhật lại đường dẫn ảo cho các entry hiện có
    for (const [id, entry] of this.cachedEntries.entries()) {
      this.cachedEntries.set(id, {
        ...entry,
        virtualPath: `${clean}\\${entry.folderName}\\${entry.htmlFileName}`,
      });
    }
    this.emitChange();
  }

  resetLibraryPathConfiguration(): void {
    this.hasConfiguredLibraryPath = false;
    this.directoryHandle = null;
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('ol3d_library_path_applied_v1');
    }
    this.emitChange();
  }

  setAutoDownloadOnUpdate(enabled: boolean): void {
    this.autoDownloadOnUpdate = enabled;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ol3d_library_auto_dl', enabled ? 'true' : 'false');
    }
    this.emitChange();
  }

  listStoredModules(): StoredLibraryModuleEntry[] {
    return Array.from(this.cachedEntries.values()).sort((a, b) =>
      b.updatedAtIso.localeCompare(a.updatedAtIso),
    );
  }

  getStoredModule(assetId: string): StoredLibraryModuleEntry | undefined {
    return this.cachedEntries.get(assetId);
  }

  /**
   * Kết nối trực tiếp tới thư mục C:\Users\ltlie\Documents\libraries3DLab trên ổ cứng
   * bằng File System Access API (window.showDirectoryPicker)
   */
  async connectPhysicalLibraryDirectory(): Promise<{
    connected: boolean;
    folderName?: string;
    importedCount: number;
    message: string;
    importedHtmlStrings: string[];
  }> {
    const win = window as unknown as {
      showDirectoryPicker?: (options?: {
        id?: string;
        mode?: 'read' | 'readwrite';
        startIn?: 'documents' | 'desktop' | 'downloads';
      }) => Promise<FileSystemDirectoryHandle>;
    };

    if (!win.showDirectoryPicker) {
      return {
        connected: false,
        importedCount: 0,
        importedHtmlStrings: [],
        message:
          'Trình duyệt hiện tại hoặc khung nhúng iFrame không cho phép mở showDirectoryPicker trực tiếp. Bạn có thể bấm "Quét thư mục libraries3DLab từ ổ cứng" bên cạnh hoặc mở ứng dụng ở tab trình duyệt riêng!',
      };
    }

    try {
      const handle = await win.showDirectoryPicker({
        id: 'libraries3DLab',
        mode: 'readwrite',
        startIn: 'documents',
      });

      this.directoryHandle = handle;
      this.hasConfiguredLibraryPath = true;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('ol3d_library_path_applied_v1', 'true');
      }

      // Lưu handle vào IndexedDB để nhớ cho lần mở sau
      try {
        const db = await this.openDatabase();
        const tx = db.transaction(IDB_STORE_HANDLES, 'readwrite');
        tx.objectStore(IDB_STORE_HANDLES).put(handle, 'root_libraries3DLab');
      } catch {
        // Ignore handle persistence error if any
      }

      // Đồng bộ hai chiều:
      // 1) Đọc mọi thư mục con có chứa file .html trong thư mục vừa chọn
      const importedHtmlStrings = await this.scanPhysicalDirectoryHandle(handle);

      // 2) Ghi tất cả các module đang có trong bộ nhớ xuống thư mục ổ cứng vừa kết nối
      for (const entry of this.cachedEntries.values()) {
        await this.writeEntryToPhysicalDirectory(handle, entry);
      }
      await this.writeLibraryIndexToPhysicalDirectory(handle);

      this.lastSyncTimeIso = new Date().toISOString();
      this.lastSyncMessage = `Đã kết nối trực tiếp ổ cứng "${handle.name}" (${this.configuredBasePath}) — Đồng bộ ${this.cachedEntries.size} thiết bị.`;
      this.emitChange();

      return {
        connected: true,
        folderName: handle.name,
        importedCount: importedHtmlStrings.length,
        importedHtmlStrings,
        message: `Đã gắn kết thành công thư mục ổ cứng "${handle.name}"! Mọi cập nhật module .HTML từ nay sẽ tự động ghi thẳng vào ${this.configuredBasePath}.`,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('security') || msg.toLowerCase().includes('sub frame')) {
        return {
          connected: false,
          importedCount: 0,
          importedHtmlStrings: [],
          message:
            'Khung xem trước (iFrame) chặn cửa sổ ghi ổ cứng trực tiếp của Chrome. Hãy dùng nút "Quét thư mục libraries3DLab" kế bên hoặc mở ứng dụng ra Tab mới để ghi trực tiếp!',
        };
      }
      return {
        connected: false,
        importedCount: 0,
        importedHtmlStrings: [],
        message: `Đã hủy hoặc chưa chọn thư mục: ${msg}`,
      };
    }
  }

  /**
   * Đọc toàn bộ các file .html nằm trong thư mục ổ cứng (cả ở thư mục gốc lẫn các thư mục con kiểu Arduino)
   */
  private async scanPhysicalDirectoryHandle(
    rootHandle: FileSystemDirectoryHandle,
  ): Promise<string[]> {
    const htmlContents: string[] = [];
    const dirWithEntries = rootHandle as unknown as {
      values: () => AsyncIterable<FileSystemHandle>;
    };
    if (!dirWithEntries.values) return htmlContents;

    for await (const entry of dirWithEntries.values()) {
      if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.html')) {
        const file = await (entry as FileSystemFileHandle).getFile();
        const text = await file.text();
        if (text.includes('ol3d-module-manifest') || text.includes('OL3D_EQUIPMENT_MODULE')) {
          htmlContents.push(text);
        }
      } else if (entry.kind === 'directory') {
        const subDir = entry as FileSystemDirectoryHandle;
        const subDirWithValues = subDir as unknown as {
          values: () => AsyncIterable<FileSystemHandle>;
        };
        if (subDirWithValues.values) {
          for await (const subEntry of subDirWithValues.values()) {
            if (
              subEntry.kind === 'file' &&
              subEntry.name.toLowerCase().endsWith('.html')
            ) {
              const file = await (subEntry as FileSystemFileHandle).getFile();
              const text = await file.text();
              htmlContents.push(text);
            }
          }
        }
      }
    }
    return htmlContents;
  }

  /**
   * Ghi 1 gói module thiết bị vào đúng cấu trúc thư mục kiểu Arduino trên ổ cứng thật:
   * C:\Users\ltlie\Documents\libraries3DLab\<AssetId>_<slug>\
   *   ├── <slug>.html
   *   ├── library.properties
   *   └── manifest.json
   */
  private async writeEntryToPhysicalDirectory(
    rootHandle: FileSystemDirectoryHandle,
    entry: StoredLibraryModuleEntry,
  ): Promise<boolean> {
    try {
      // Kiểm tra / xin quyền ghi
      const handleWithPerm = rootHandle as unknown as {
        queryPermission?: (desc: { mode: 'readwrite' }) => Promise<PermissionState>;
        requestPermission?: (desc: { mode: 'readwrite' }) => Promise<PermissionState>;
      };
      if (handleWithPerm.queryPermission && handleWithPerm.requestPermission) {
        const perm = await handleWithPerm.queryPermission({ mode: 'readwrite' });
        if (perm !== 'granted') {
          const reqPerm = await handleWithPerm.requestPermission({ mode: 'readwrite' });
          if (reqPerm !== 'granted') return false;
        }
      }

      const subFolderHandle = await rootHandle.getDirectoryHandle(entry.folderName, {
        create: true,
      });

      // 1. Ghi file .html chính
      const htmlFileHandle = await subFolderHandle.getFileHandle(entry.htmlFileName, {
        create: true,
      });
      const htmlWritable = await htmlFileHandle.createWritable();
      await htmlWritable.write(entry.rawHtmlSource);
      await htmlWritable.close();

      // 2. Ghi file library.properties (chuẩn Arduino)
      const propFileHandle = await subFolderHandle.getFileHandle('library.properties', {
        create: true,
      });
      const propWritable = await propFileHandle.createWritable();
      await propWritable.write(entry.libraryPropertiesText);
      await propWritable.close();

      // 3. Ghi file manifest.json
      const manifestFileHandle = await subFolderHandle.getFileHandle('manifest.json', {
        create: true,
      });
      const manifestWritable = await manifestFileHandle.createWritable();
      await manifestWritable.write(entry.manifestJsonText);
      await manifestWritable.close();

      return true;
    } catch (err) {
      console.warn('Không thể ghi trực tiếp xuống FileSystemDirectoryHandle:', err);
      return false;
    }
  }

  private async writeLibraryIndexToPhysicalDirectory(
    rootHandle: FileSystemDirectoryHandle,
  ): Promise<void> {
    try {
      const indexObj = {
        librarySpec: 'OL3D-ARDUINO-STYLE-LIBRARY-v2.2',
        basePath: this.configuredBasePath,
        updatedAt: new Date().toISOString(),
        totalLibraries: this.cachedEntries.size,
        libraries: Array.from(this.cachedEntries.values()).map((e) => ({
          assetId: e.assetId,
          nameVi: e.assetSnapshot.name.vi,
          nameEn: e.assetSnapshot.name.en,
          version: e.assetSnapshot.assetVersion,
          category: e.assetSnapshot.category,
          folderName: e.folderName,
          htmlFileName: e.htmlFileName,
          virtualPath: e.virtualPath,
          updatedAtIso: e.updatedAtIso,
        })),
      };

      const indexHandle = await rootHandle.getFileHandle('library-index.json', {
        create: true,
      });
      const writable = await indexHandle.createWritable();
      await writable.write(JSON.stringify(indexObj, null, 2));
      await writable.close();

      const readmeHandle = await rootHandle.getFileHandle(
        'README_LIBRARIES_3DLAB.md',
        { create: true },
      );
      const readmeWritable = await readmeHandle.createWritable();
      await readmeWritable.write(
        `# THƯ VIỆN THIẾT BỊ 3D OPENLAB (libraries3DLab)\n\n` +
          `- Đường dẫn chuẩn: \`${this.configuredBasePath}\`\n` +
          `- Cơ chế hoạt động tương tự thư mục \`Documents\\Arduino\\libraries\` của Arduino IDE.\n` +
          `- Mỗi thư mục con đại diện cho 1 thiết bị KHTN 3D độc lập, bao gồm:\n` +
          `  1. \`<slug>.html\`: File module 3D độc lập tự chạy trên trình duyệt & nạp vào OpenLab 3D.\n` +
          `  2. \`library.properties\`: Thông tin định danh thiết bị chuẩn Arduino library.\n` +
          `  3. \`manifest.json\`: Hồ sơ thông số kỹ thuật 4 lớp & 5 nguồn web đối chiếu.\n`,
      );
      await readmeWritable.close();
    } catch {
      // Ignore if permission not granted yet
    }
  }

  /**
   * Lưu hoặc Cập nhật 1 module thiết bị vào thư viện `C:\Users\ltlie\Documents\libraries3DLab`
   * (Ghi đồng thời vào IndexedDB bền vững + Thư mục ổ cứng thật nếu đã kết nối + Tự động tải về nếu bật)
   */
  async saveModuleToLibraryDisk(params: {
    asset: AssetDefinition;
    rawHtmlSource: string;
    manifestObject: Record<string, unknown>;
    uploadedRealPhotoDataUrl?: string;
    triggerDownloadIfConfigured?: boolean;
  }): Promise<StoredLibraryModuleEntry> {
    const {
      asset,
      rawHtmlSource,
      manifestObject,
      uploadedRealPhotoDataUrl,
      triggerDownloadIfConfigured = true,
    } = params;

    const folderName = getLibraryFolderName(asset.assetId, asset.slug);
    const htmlFileName = `${asset.slug || asset.assetId.toLowerCase()}.html`;
    const virtualPath = `${this.configuredBasePath}\\${folderName}\\${htmlFileName}`;
    const libraryPropertiesText = buildArduinoLibraryProperties(asset);
    const manifestJsonText = JSON.stringify(manifestObject, null, 2);

    let syncedToPhysicalDisk = false;

    const entry: StoredLibraryModuleEntry = {
      assetId: asset.assetId,
      slug: asset.slug,
      folderName,
      virtualPath,
      htmlFileName,
      rawHtmlSource,
      libraryPropertiesText,
      manifestJsonText,
      assetSnapshot: asset,
      uploadedRealPhotoDataUrl,
      updatedAtIso: new Date().toISOString(),
      syncedToPhysicalDisk: false,
    };

    // 1. Nếu đã gắn kết thư mục ổ cứng thật qua File System Access API -> Ghi trực tiếp vào C:\Users\ltlie\Documents\libraries3DLab
    if (this.directoryHandle) {
      syncedToPhysicalDisk = await this.writeEntryToPhysicalDirectory(
        this.directoryHandle,
        entry,
      );
      if (syncedToPhysicalDisk) {
        await this.writeLibraryIndexToPhysicalDirectory(this.directoryHandle);
      }
    }

    entry.syncedToPhysicalDisk = syncedToPhysicalDisk;
    this.cachedEntries.set(asset.assetId, entry);

    // 2. Lưu bền vững vào IndexedDB để F5 / tắt máy mở lại vẫn còn nguyên 100%
    try {
      const db = await this.openDatabase();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(IDB_STORE_MODULES, 'readwrite');
        const store = tx.objectStore(IDB_STORE_MODULES);
        const putReq = store.put(entry);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      });
    } catch (err) {
      console.warn('Lưu module vào IndexedDB cảnh báo:', err);
    }

    // 3. Nếu người dùng bật "Tự động xuất file .HTML khi cập nhật" và chưa nối trực tiếp showDirectoryPicker
    if (
      triggerDownloadIfConfigured &&
      this.autoDownloadOnUpdate &&
      !syncedToPhysicalDisk &&
      typeof document !== 'undefined'
    ) {
      this.downloadSingleLibraryHtml(entry);
    }

    this.lastSyncTimeIso = entry.updatedAtIso;
    this.lastSyncMessage = syncedToPhysicalDisk
      ? `Đã ghi trực tiếp vào ổ cứng: ${virtualPath}`
      : `Đã lưu bền vững vào Thư viện 3D (${virtualPath})`;

    this.notifyCrossTabLibraryPulse();
    this.emitChange();
    return entry;
  }

  /**
   * Xóa 1 module khỏi thư viện đã lưu (trả thiết bị về nguyên bản gốc nếu là override)
   */
  async removeModuleFromLibraryDisk(assetId: string): Promise<void> {
    const existing = this.cachedEntries.get(assetId);
    this.cachedEntries.delete(assetId);

    try {
      const db = await this.openDatabase();
      await new Promise<void>((resolve) => {
        const tx = db.transaction(IDB_STORE_MODULES, 'readwrite');
        tx.objectStore(IDB_STORE_MODULES).delete(assetId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
      // Ignore
    }

    if (this.directoryHandle && existing) {
      try {
        await this.directoryHandle.removeEntry(existing.folderName, {
          recursive: true,
        });
        await this.writeLibraryIndexToPhysicalDirectory(this.directoryHandle);
      } catch {
        // Ignore if physical folder removal not permitted
      }
    }

    this.lastSyncTimeIso = new Date().toISOString();
    this.lastSyncMessage = `Đã gỡ module ${assetId} khỏi thư viện ${this.configuredBasePath}`;
    this.notifyCrossTabLibraryPulse();
    this.emitChange();
  }

  /**
   * Tải xuống file .html độc lập của 1 module thiết bị
   */
  downloadSingleLibraryHtml(entry: StoredLibraryModuleEntry): void {
    const blob = new Blob([entry.rawHtmlSource], {
      type: 'text/html;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entry.folderName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Xuất kịch bản cài đặt tự động (.ps1 PowerShell cho Windows) để tạo đúng cấu trúc thư mục
   * C:\Users\ltlie\Documents\libraries3DLab\<AssetId>_<slug>\ giống hệt Arduino Libraries!
   */
  downloadWindowsArduinoStyleSyncScript(): void {
    const entries = this.listStoredModules();
    const targetRoot = this.configuredBasePath;

    const psLines: string[] = [
      `# ============================================================================`,
      `# OPENLAB 3D — TRÌNH ĐỒNG BỘ THƯ VIỆN THIẾT BỊ 3D KIỂU ARDUINO (libraries3DLab)`,
      `# Tự động khởi tạo cấu trúc thư mục tại: ${targetRoot}`,
      `# Cách chạy: Nhấp chuột phải vào file này -> Chọn "Run with PowerShell"`,
      `# ============================================================================`,
      `$ErrorActionPreference = "Stop"`,
      `$BaseDir = "${targetRoot}"`,
      `if (!(Test-Path -Path $BaseDir)) {`,
      `    New-Item -ItemType Directory -Path $BaseDir -Force | Out-Null`,
      `}`,
      `Write-Host "Dang dong bo ${entries.length} thiet bi 3D vao thu vien: $BaseDir..." -ForegroundColor Cyan`,
      ``,
    ];

    for (const entry of entries) {
      const b64Html = btoa(unescape(encodeURIComponent(entry.rawHtmlSource)));
      const b64Prop = btoa(unescape(encodeURIComponent(entry.libraryPropertiesText)));
      const b64Manifest = btoa(unescape(encodeURIComponent(entry.manifestJsonText)));

      psLines.push(
        `# --- Thiết bị: ${entry.assetSnapshot.name.vi} (${entry.assetId}) ---`,
        `$ModDir = Join-Path $BaseDir "${entry.folderName}"`,
        `if (!(Test-Path -Path $ModDir)) { New-Item -ItemType Directory -Path $ModDir -Force | Out-Null }`,
        `[System.IO.File]::WriteAllBytes((Join-Path $ModDir "${entry.htmlFileName}"), [System.Convert]::FromBase64String("${b64Html}"))`,
        `[System.IO.File]::WriteAllBytes((Join-Path $ModDir "library.properties"), [System.Convert]::FromBase64String("${b64Prop}"))`,
        `[System.IO.File]::WriteAllBytes((Join-Path $ModDir "manifest.json"), [System.Convert]::FromBase64String("${b64Manifest}"))`,
        `Write-Host "  [OK] Da luu: ${entry.folderName}\\${entry.htmlFileName}" -ForegroundColor Green`,
        ``,
      );
    }

    const indexObj = {
      librarySpec: 'OL3D-ARDUINO-STYLE-LIBRARY-v2.2',
      basePath: targetRoot,
      updatedAt: new Date().toISOString(),
      totalLibraries: entries.length,
      libraries: entries.map((e) => ({
        assetId: e.assetId,
        nameVi: e.assetSnapshot.name.vi,
        version: e.assetSnapshot.assetVersion,
        folderName: e.folderName,
        htmlFileName: e.htmlFileName,
        virtualPath: e.virtualPath,
      })),
    };
    const b64Index = btoa(
      unescape(encodeURIComponent(JSON.stringify(indexObj, null, 2))),
    );

    psLines.push(
      `[System.IO.File]::WriteAllBytes((Join-Path $BaseDir "library-index.json"), [System.Convert]::FromBase64String("${b64Index}"))`,
      `Write-Host "HOAN TAT! Da dong bo ${entries.length} module vao $BaseDir" -ForegroundColor Yellow`,
      `Start-Process explorer.exe $BaseDir`,
    );

    const blob = new Blob([psLines.join('\r\n')], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sync_OpenLab3D_To_libraries3DLab.ps1';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const localDiskLibraryEngine = new LocalDiskLibraryEngineImpl();
