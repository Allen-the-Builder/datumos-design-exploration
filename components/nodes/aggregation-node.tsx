"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface AggregationNodeData {
  label: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  color?: string;
  icon?: React.ReactNode;
}

export const AggregationNode = memo(({ data }: NodeProps<AggregationNodeData>) => {
  const { label, count, isExpanded, onToggle, color = "#0ea5e9", icon } = data;

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-2 !h-2 !opacity-0" />

      <div
        className="relative flex items-center justify-center cursor-pointer transition-all hover:scale-110"
        style={{ width: "120px", height: "120px" }}
        onClick={onToggle}
      >
        {/* Outer circle border */}
        <div
          className="absolute inset-0 rounded-full border-4 transition-all"
          style={{
            borderColor: color,
            backgroundColor: isExpanded ? `${color}15` : "white",
            boxShadow: isExpanded
              ? `0 8px 24px ${color}40, 0 0 0 4px ${color}20`
              : `0 4px 12px ${color}30`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-3">
          {icon && (
            <div className="mb-1" style={{ color }}>
              {icon}
            </div>
          )}
          <div className="text-sm font-semibold tracking-tight" style={{ color }}>
            {label}
          </div>
          <div
            className="mt-1 text-xs font-mono px-2 py-0.5 rounded-full font-bold"
            style={{ backgroundColor: color, color: "white" }}
          >
            {count}
          </div>
        </div>

        {/* Expand/collapse indicator */}
        <div
          className="absolute bottom-1 right-1 rounded-full p-1"
          style={{ backgroundColor: `${color}20` }}
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3" style={{ color }} />
          ) : (
            <ChevronRight className="w-3 h-3" style={{ color }} />
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-2 !h-2 !opacity-0" />
    </div>
  );
});

AggregationNode.displayName = "AggregationNode";
