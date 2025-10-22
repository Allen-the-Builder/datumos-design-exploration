"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { FileText } from "lucide-react";

export interface FileNodeData {
  label: string;
  type: string;
  platform: string;
  color?: string;
  icon?: React.ReactNode;
}

export const FileNode = memo(({ data }: NodeProps<FileNodeData>) => {
  const { label, type, platform, color = "#64748b", icon } = data;

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-2 !h-2" />

      <div
        className="bg-white rounded-md shadow-md border transition-all hover:shadow-lg hover:scale-105"
        style={{ borderColor: color, minWidth: "160px", maxWidth: "200px" }}
      >
        <div className="px-3 py-2">
          <div className="flex items-start gap-2">
            <div className="mt-0.5" style={{ color }}>
              {icon || <FileText className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-800 truncate leading-tight">
                {label}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${color}20`, color: color }}
                >
                  {platform}
                </span>
                <span className="text-[10px] text-gray-400">•</span>
                <span className="text-[10px] text-gray-500">{type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-2 !h-2" />
    </div>
  );
});

FileNode.displayName = "FileNode";
