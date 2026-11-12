import { LabScene } from './types';

export interface SavedProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deviceCount: number;
  scene: LabScene;
  measurements?: {
    measuredMassG?: number | null;
    initialVolumeCm3?: number;
    finalVolumeCm3?: number | null;
    studentGuidedStep?: number;
  };
}

const STORAGE_KEY = 'openlab_saved_projects_v1';

export const projectStorage = {
  /**
   * Lấy danh sách tất cả các dự án đã lưu trong LocalStorage
   */
  getAllProjects(): SavedProject[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }
      return [];
    } catch (e) {
      console.warn('Lỗi khi đọc dự án đã lưu từ localStorage:', e);
      return [];
    }
  },

  /**
   * Lưu dự án hiện tại
   */
  saveProject(
    name: string,
    scene: LabScene,
    measurements?: SavedProject['measurements']
  ): SavedProject {
    const projects = this.getAllProjects();
    const now = new Date().toISOString();
    const cleanName = name.trim() || `Dự án ngày ${new Date().toLocaleDateString('vi-VN')}`;

    const newProject: SavedProject = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      createdAt: now,
      updatedAt: now,
      deviceCount: scene.instances.length,
      scene: JSON.parse(JSON.stringify(scene)),
      measurements: measurements ? JSON.parse(JSON.stringify(measurements)) : undefined,
    };

    const updated = [newProject, ...projects];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Không thể lưu dự án vào localStorage:', e);
    }

    return newProject;
  },

  /**
   * Xóa một dự án theo id
   */
  deleteProject(id: string): boolean {
    const projects = this.getAllProjects();
    const filtered = projects.filter((p) => p.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Lỗi khi xóa dự án:', e);
      return false;
    }
  },

  /**
   * Xuất file .openlab (JSON) để tải về máy nộp cho giáo viên
   */
  exportToFile(project: SavedProject): void {
    if (typeof window === 'undefined') return;
    try {
      const json = JSON.stringify(project, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeFileName = project.name.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9 -]/g, '_');
      a.href = url;
      a.download = `${safeFileName}.openlab`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Lỗi khi xuất file dự án:', e);
    }
  },

  /**
   * Nhập file .openlab từ máy tính
   */
  async importFromFile(file: File): Promise<SavedProject> {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed || !parsed.scene || !Array.isArray(parsed.scene.instances)) {
      throw new Error('Định dạng file .openlab không hợp lệ hoặc bị lỗi cấu trúc.');
    }

    const now = new Date().toISOString();
    const imported: SavedProject = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: parsed.name ? `${parsed.name} (Nhập)` : `Dự án nhập ${new Date().toLocaleDateString('vi-VN')}`,
      createdAt: parsed.createdAt || now,
      updatedAt: now,
      deviceCount: parsed.scene.instances.length,
      scene: parsed.scene,
      measurements: parsed.measurements,
    };

    const projects = this.getAllProjects();
    const updated = [imported, ...projects];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return imported;
  },

  /**
   * Đếm số lượng dự án đã lưu
   */
  getCount(): number {
    return this.getAllProjects().length;
  },
};
