import React, { useState } from 'react';
import {
  AssetDefinition,
  LabEnvironment,
  SceneInstance,
} from '../../domain/types';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ChevronRight,
  ChevronDown,
  FolderTree,
  Box,
  Cpu,
  Copy,
} from 'lucide-react';

interface SceneHierarchyPanelProps {
  environment: LabEnvironment;
  instances: SceneInstance[];
  assetsMap: Map<string, AssetDefinition>;
  selectedInstanceId: string | null;
  onSelectInstance: (instanceId: string | null) => void;
  onToggleInstanceVisibility: (instanceId: string) => void;
  onToggleInstanceLock: (instanceId: string) => void;
  onDuplicateInstance: (instanceId: string) => void;
  onDeleteInstance: (instanceId: string) => void;
}

export const SceneHierarchyPanel: React.FC<SceneHierarchyPanelProps> = ({
  environment,
  instances,
  assetsMap,
  selectedInstanceId,
  onSelectInstance,
  onToggleInstanceVisibility,
  onToggleInstanceLock,
  onDuplicateInstance,
  onDeleteInstance,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root-env': true,
    'group-bench': true,
    'group-equipment': true,
    'group-specimens': true,
  });
  const [expandedInstances, setExpandedInstances] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setExpandedNodes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleInstanceSubtree = (instanceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedInstances((prev) => ({ ...prev, [instanceId]: !prev[instanceId] }));
  };

  const equipmentInstances = instances.filter((inst) => {
    const a = assetsMap.get(inst.assetId);
    return !a || a.kind === 'equipment';
  });

  const specimenInstances = instances.filter((inst) => {
    const a = assetsMap.get(inst.assetId);
    return a?.kind === 'specimen';
  });

  const renderInstanceNode = (inst: SceneInstance) => {
    const asset = assetsMap.get(inst.assetId);
    const isSelected = inst.instanceId === selectedInstanceId;
    const isSubtreeOpen = Boolean(expandedInstances[inst.instanceId]);
    const childNodes = asset?.geometry.namedNodes ?? [];

    return (
      <div key={inst.instanceId} className="select-none">
        <div
          onClick={() => onSelectInstance(inst.instanceId)}
          className={`group flex items-center justify-between gap-1 px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
            isSelected
              ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
              : 'text-slate-300 hover:bg-slate-800/70 border border-transparent'
          }`}
        >
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <button
              type="button"
              onClick={(e) => toggleInstanceSubtree(inst.instanceId, e)}
              className="p-0.5 text-slate-500 hover:text-slate-300 shrink-0"
              title="Xem các node thành phần con trong mô hình 3D"
            >
              {isSubtreeOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
            <Box
              className={`w-3.5 h-3.5 shrink-0 ${
                isSelected ? 'text-cyan-400' : 'text-slate-400'
              }`}
            />
            <span
              className={`truncate ${
                !inst.visible ? 'line-through text-slate-500' : ''
              }`}
            >
              {inst.customLabel || asset?.name.vi || inst.assetId}
            </span>
          </div>

          {/* Instance Quick Controls: Visibility, Lock, Duplicate, Delete */}
          <div className="flex items-center gap-0.5 shrink-0 opacity-85 group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleInstanceVisibility(inst.instanceId);
              }}
              className={`p-1 rounded hover:bg-slate-700/70 ${
                inst.visible ? 'text-slate-400 hover:text-slate-200' : 'text-amber-400'
              }`}
              title={inst.visible ? 'Ẩn đối tượng trong cảnh' : 'Hiện đối tượng trong cảnh'}
            >
              {inst.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleInstanceLock(inst.instanceId);
              }}
              className={`p-1 rounded hover:bg-slate-700/70 ${
                inst.locked ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title={inst.locked ? 'Mở khóa chọn/di chuyển' : 'Khóa vị trí đối tượng'}
            >
              {inst.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateInstance(inst.instanceId);
              }}
              className="p-1 rounded hover:bg-slate-700/70 text-slate-400 hover:text-cyan-300"
              title="Nhân bản thêm một instance cùng loại"
            >
              <Copy className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteInstance(inst.instanceId);
              }}
              className="p-1 rounded hover:bg-rose-950/80 text-slate-400 hover:text-rose-400"
              title="Xóa instance khỏi cảnh (Không xóa tài sản gốc)"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Sub-nodes of the 3D Equipment Mesh */}
        {isSubtreeOpen && childNodes.length > 0 && (
          <div className="pl-6 pr-2 py-1 space-y-1 border-l border-slate-800 ml-3.5 my-0.5">
            {childNodes.map((node) => (
              <div
                key={`${inst.instanceId}-${node.nodeName}`}
                className="flex items-center justify-between text-[11px] text-slate-400 font-mono py-0.5"
                title={node.description}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Cpu className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="text-slate-300">{node.nodeName}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{node.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border-b border-slate-800/90 bg-[#0E1420] flex flex-col max-h-64 shrink-0">
      <div className="h-9 px-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-100">
            Scene Hierarchy (Cây đối tượng)
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 tabular-nums">
          {instances.length} instances
        </span>
      </div>

      <div className="p-2 overflow-y-auto space-y-1 text-xs">
        {/* Level 1: Laboratory Environment */}
        <div>
          <button
            type="button"
            onClick={() => toggleGroup('root-env')}
            className="w-full flex items-center gap-1.5 px-1.5 py-1 text-left font-semibold text-slate-200 hover:bg-slate-800/50 rounded"
          >
            {expandedNodes['root-env'] ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="truncate">{environment.name.vi}</span>
          </button>

          {expandedNodes['root-env'] && (
            <div className="pl-3 mt-1 space-y-1 border-l border-slate-800/90 ml-2">
              {/* Workbench node */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleGroup('group-bench')}
                  className="w-full flex items-center justify-between px-1.5 py-1 text-left text-slate-300 hover:bg-slate-800/50 rounded"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {expandedNodes['group-bench'] ? (
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    )}
                    <span className="font-medium">Bàn thí nghiệm chuẩn (1.4m × 0.75m)</span>
                  </div>
                </button>

                {expandedNodes['group-bench'] && (
                  <div className="pl-3 mt-1 space-y-1.5 border-l border-slate-800/80 ml-2">
                    {/* Group A: Measuring Instruments & Glassware */}
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleGroup('group-equipment')}
                        className="w-full flex items-center justify-between px-1.5 py-0.5 text-[11px] font-semibold text-slate-400 hover:text-slate-200"
                      >
                        <div className="flex items-center gap-1">
                          {expandedNodes['group-equipment'] ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                          <span>Thiết bị & Dụng cụ ({equipmentInstances.length})</span>
                        </div>
                      </button>
                      {expandedNodes['group-equipment'] && (
                        <div className="mt-0.5 space-y-0.5">
                          {equipmentInstances.map(renderInstanceNode)}
                        </div>
                      )}
                    </div>

                    {/* Group B: Specimens */}
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleGroup('group-specimens')}
                        className="w-full flex items-center justify-between px-1.5 py-0.5 text-[11px] font-semibold text-slate-400 hover:text-slate-200"
                      >
                        <div className="flex items-center gap-1">
                          {expandedNodes['group-specimens'] ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                          <span>Vật mẫu thực nghiệm ({specimenInstances.length})</span>
                        </div>
                      </button>
                      {expandedNodes['group-specimens'] && (
                        <div className="mt-0.5 space-y-0.5">
                          {specimenInstances.map(renderInstanceNode)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
