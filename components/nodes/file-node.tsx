"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { FileIcon, defaultStyles } from "react-file-icon";

export interface FileNodeData {
  label: string;
  fileName: string;
  fileExtension: string;
  type: string;
  platform: string;
  color?: string;
  relevanceScore?: number;
}

export const FileNode = memo(({ data }: NodeProps<FileNodeData>) => {
  const { fileName, fileExtension, platform, color = "#64748b", relevanceScore } = data;

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-2 !h-2 !opacity-0" />

      <div
        className="bg-white rounded-lg shadow-lg border-2 transition-all hover:shadow-xl hover:scale-105 cursor-pointer"
        style={{ borderColor: color, width: "200px" }}
      >
        {/* Header with file icon */}
        <div className="p-3 flex items-start gap-3">
          <div className="w-8 h-10 flex-shrink-0">
            <FileIcon extension={fileExtension} {...defaultStyles[fileExtension as keyof typeof defaultStyles]} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate leading-tight">
              {fileName}
            </div>
            <div className="text-xs text-gray-500 mt-1 font-mono">.{fileExtension}</div>
          </div>
        </div>

        {/* Footer with platform badge and relevance score */}
        <div
          className="px-3 py-2 border-t flex items-center justify-between"
          style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
        >
          <span
            className="text-xs font-mono px-2 py-0.5 rounded font-semibold"
            style={{ backgroundColor: color, color: "white" }}
          >
            {platform}
          </span>
          {relevanceScore !== undefined && relevanceScore > 0 && (
            <span
              className="text-xs font-mono font-bold px-2 py-0.5 rounded"
              style={{
                backgroundColor: relevanceScore >= 80 ? '#10b981' : relevanceScore >= 50 ? '#f59e0b' : '#64748b',
                color: 'white'
              }}
            >
              {relevanceScore}%
            </span>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-2 !h-2 !opacity-0" />
    </div>
  );
});

FileNode.displayName = "FileNode";
