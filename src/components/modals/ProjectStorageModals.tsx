import React, { useState, useEffect, useRef } from 'react';
import { Save, FolderOpen, Trash2, Download, Upload, X, Check, Clock, AlertTriangle, Box } from 'lucide-react';
import { projectStorage, SavedProject } from '../../domain/projectStorage';
import { LabScene } from '../../domain/types';

export interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: LabScene;
  measurements?: {
    measuredMassG?: number | null;
    initialVolumeCm3?: number;
    finalVolumeCm3?: number | null;
    studentGuidedStep?: number;
  };
  onSaveSuccess: (project: SavedProject) => void;
  isDarkMode?: boolean;
}

export const SaveProjectModal: React.FC<SaveProjectModalProps> = ({
  isOpen,
  onClose,
  scene,
  measurements,
  onSaveSuccess,
  isDarkMode = true,
}) => {
  const [projectName, setProjectName] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const defaultName = `Thực hành KHTN - ${new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })}`;
      setProjectName(defaultName);
      setTimeout(() => inputRef.current?.select(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const saved = projectStorage.saveProject(projectName, scene, measurements);
    onSaveSuccess(saved);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-project-title"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-[440px] rounded-[16px] border-[1.5px] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all ${
          isDarkMode
            ? 'bg-[#071326]/95 border-[#41D9F5]/45 text-white'
            : 'bg-white border-[#7FA3CE] text-[#051630]'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-400/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#48D6A0]/20 border border-[#48D6A0]/60 text-[#48D6A0] flex items-center justify-center">
              <Save className="w-4 h-4" />
            </div>
            <div>
              <h2 id="save-project-title" className="text-[15px] font-extrabold leading-snug">
                Lưu Dự Án Hiện Tại
              </h2>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Đang có {scene.instances.length} thiết bị trên bàn thí nghiệm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md hover:bg-slate-500/20 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className={`block text-[12px] font-bold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Tên bài thực hành / dự án:
            </label>
            <input
              ref={inputRef}
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="VD: Bài 14 - Đo KLR Nhôm (Nhóm 1)"
              className={`w-full px-3 py-2 rounded-[9px] border-[1.5px] text-[13.5px] font-semibold focus:outline-none transition-colors ${
                isDarkMode
                  ? 'bg-[#050B18] border-[#41D9F5]/35 text-[#E8F2FF] focus:border-[#41D9F5]'
                  : 'bg-[#F2F6FB] border-[#7FA3CE] text-[#051630] focus:border-[#1D63E8]'
              }`}
            />
          </div>

          <div className={`flex items-center justify-between text-[11.5px] p-2.5 rounded-[8px] border ${
            isDarkMode ? 'text-slate-400 bg-slate-900/40 border-slate-400/15' : 'text-slate-600 bg-slate-100 border-slate-300/60'
          }`}>
            <span className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-[#38BDF8]" />
              Thiết bị: {scene.instances.length} dụng cụ
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Lưu vào máy tính này
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-3.5 py-1.5 rounded-[8px] text-[12.5px] font-bold border cursor-pointer transition-colors ${
                isDarkMode
                  ? 'border-slate-500/30 hover:bg-slate-500/20 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-[8px] text-[12.5px] font-extrabold bg-[#1D63E8] hover:bg-[#1E6BFF] text-white flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Lưu dự án</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export interface OpenProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadProject: (project: SavedProject) => void;
  onProjectsCountChange?: (count: number) => void;
  isDarkMode?: boolean;
}

export const OpenProjectModal: React.FC<OpenProjectModalProps> = ({
  isOpen,
  onClose,
  onLoadProject,
  onProjectsCountChange,
  isDarkMode = true,
}) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const refreshList = () => {
    const list = projectStorage.getAllProjects();
    setProjects(list);
    onProjectsCountChange?.(list.length);
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
      setDeleteConfirmId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    projectStorage.deleteProject(id);
    setDeleteConfirmId(null);
    refreshList();
  };

  const handleExport = (proj: SavedProject, e: React.MouseEvent) => {
    e.stopPropagation();
    projectStorage.exportToFile(proj);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await projectStorage.importFromFile(file);
      refreshList();
      onLoadProject(imported);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi nhập file dự án.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="open-project-title"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-[560px] max-h-[82vh] rounded-[16px] border-[1.5px] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl flex flex-col transition-all ${
          isDarkMode
            ? 'bg-[#071326]/95 border-[#41D9F5]/45 text-white'
            : 'bg-white border-[#7FA3CE] text-[#051630]'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-400/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1D63E8]/25 border border-[#38BDF8]/60 text-[#38BDF8] flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="open-project-title" className="text-[15px] font-extrabold leading-snug">
                Dự Án Đã Lưu ({projects.length})
              </h2>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Chọn một bài đã lưu để khôi phục nguyên trạng lên bàn thí nghiệm 3D
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-md hover:bg-slate-500/20 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Danh sách các bài đã lưu */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 min-h-[160px] max-h-[380px] pr-1">
          {projects.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <FolderOpen className={`w-10 h-10 mx-auto stroke-[1.5] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <p className={`text-[13.5px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Chưa có dự án nào được lưu
              </p>
              <p className={`text-[12px] max-w-sm mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Khi thực hành xong trên bàn 3D, hãy bấm nút <span className={`${isDarkMode ? 'text-[#48D6A0]' : 'text-emerald-600'} font-bold`}>[💾 Lưu]</span> ở góc trên bên trái để lưu lại kết quả bài làm.
              </p>
            </div>
          ) : (
            projects.map((proj) => {
              const formattedDate = new Date(proj.updatedAt).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
              const isConfirmingDelete = deleteConfirmId === proj.id;

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    onLoadProject(proj);
                    onClose();
                  }}
                  className={`p-3 rounded-[10px] border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isDarkMode
                      ? 'bg-[#0B1930] hover:bg-[#10223D] border-[rgba(65,217,245,0.22)] hover:border-[#41D9F5]'
                      : 'bg-[#F2F6FB] hover:bg-[#E2ECF8] border-[#C4D5E8] hover:border-[#1D63E8]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className={`text-[13.5px] font-extrabold truncate ${
                      isDarkMode ? 'text-[#E8F2FF]' : 'text-[#051630]'
                    }`}>
                      {proj.name}
                    </div>
                    <div className={`flex items-center gap-3 mt-1 text-[11px] ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className={`w-3 h-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                        {formattedDate}
                      </span>
                      <span className={`flex items-center gap-1 font-bold ${
                        isDarkMode ? 'text-[#38BDF8]' : 'text-[#0284C7]'
                      }`}>
                        <Box className="w-3 h-3" />
                        {proj.deviceCount} dụng cụ
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => {
                        onLoadProject(proj);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-[6px] bg-[#1D63E8] hover:bg-[#1E6BFF] text-white text-[11.5px] font-extrabold transition-colors cursor-pointer shadow-xs"
                      title="Khôi phục bài thực hành này ra bàn thí nghiệm"
                    >
                      Tải ra bàn ⚡
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleExport(proj, e)}
                      className={`w-7 h-7 rounded-[6px] border flex items-center justify-center transition-colors cursor-pointer ${
                        isDarkMode
                          ? 'border-slate-500/30 hover:bg-slate-500/20 text-slate-300 hover:text-white'
                          : 'border-slate-300 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                      title="Xuất file .openlab để nộp bài hoặc chia sẻ"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleDelete(proj.id, e)}
                          className="px-2 py-1 rounded-[6px] bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-extrabold cursor-pointer"
                          title="Xác nhận xóa bài này"
                        >
                          Xóa
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(null);
                          }}
                          className="px-1.5 py-1 rounded-[6px] bg-slate-700 hover:bg-slate-600 text-white text-[11px] cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(proj.id);
                        }}
                        className={`w-7 h-7 rounded-[6px] border flex items-center justify-center transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'border-slate-500/30 hover:bg-rose-500/20 hover:border-rose-400 hover:text-rose-300 text-slate-400'
                            : 'border-slate-300 hover:bg-rose-100 hover:border-rose-300 hover:text-rose-600 text-slate-500'
                        }`}
                        title="Xóa dự án này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Nhập file & Đóng */}
        <div className="pt-3 border-t border-slate-400/20 flex items-center justify-between shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept=".openlab,.json"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`px-3 py-1.5 rounded-[8px] border text-[11.5px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isDarkMode
                ? 'border-[#38BDF8]/40 hover:border-[#38BDF8] bg-[#10223D] hover:bg-[#163056] text-[#38BDF8]'
                : 'border-[#1D63E8]/40 hover:border-[#1D63E8] bg-[#EBF3FF] hover:bg-[#DCE8F8] text-[#1D63E8]'
            }`}
            title="Nhập file bài làm .openlab từ máy tính"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Nhập file từ máy tính</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`px-3.5 py-1.5 rounded-[8px] border text-[12px] font-bold cursor-pointer transition-colors ${
              isDarkMode
                ? 'border-slate-500/30 hover:bg-slate-500/20 text-slate-300'
                : 'border-slate-300 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
