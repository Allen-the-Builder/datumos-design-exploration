"use client";

import { memo, useState, useEffect, useRef } from "react";
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
  summary?: string;
}

export const FileNode = memo(({ data }: NodeProps<FileNodeData>) => {
  const { fileName, fileExtension, platform, color = "#64748b", relevanceScore, summary } = data;
  const [isHovered, setIsHovered] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Update tooltip position when hovering
  useEffect(() => {
    if (isHovered && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.right + 16, // 16px gap (ml-4)
        y: rect.top,
      });
    }
  }, [isHovered]);

  // Streaming text effect
  useEffect(() => {
    if (isHovered && summary) {
      // Reset and start streaming
      setDisplayedText("");
      setIsStreaming(true);

      let streamInterval: NodeJS.Timeout | null = null;

      // Small delay to let tooltip fade in first
      const startDelay = setTimeout(() => {
        let currentIndex = 0;
        streamInterval = setInterval(() => {
          if (currentIndex < summary.length) {
            currentIndex++;
            setDisplayedText(summary.substring(0, currentIndex));
          } else {
            if (streamInterval) clearInterval(streamInterval);
            setIsStreaming(false);
          }
        }, 15); // 15ms per character for smooth streaming
      }, 200); // Wait for tooltip animation to complete

      return () => {
        clearTimeout(startDelay);
        if (streamInterval) clearInterval(streamInterval);
      };
    } else if (!isHovered) {
      setDisplayedText("");
      setIsStreaming(false);
    }
  }, [isHovered, summary]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-2 !h-2 !opacity-0" />

      <div
        ref={cardRef}
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

      {/* AI Summary Tooltip - Fixed positioning to always render on top */}
      {isHovered && summary && (
        <div
          className="fixed bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-2xl p-4 w-80 z-[9999] border border-gray-700"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            animation: "fadeInSlide 200ms ease-out",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">AI Summary</span>
          </div>

          {/* Streaming Text */}
          <div className="text-sm leading-relaxed text-gray-200 font-mono">
            {displayedText}
            {isStreaming && <span className="inline-block w-1 h-4 ml-0.5 bg-blue-400 animate-pulse" />}
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-2 !h-2 !opacity-0" />

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
});

FileNode.displayName = "FileNode";
