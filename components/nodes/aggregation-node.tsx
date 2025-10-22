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
      <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-2 !h-2" />

      <div
        className="bg-white rounded-lg shadow-lg border-2 transition-all hover:shadow-xl cursor-pointer"
        style={{ borderColor: color, minWidth: "200px" }}
        onClick={onToggle}
      >
        {/* Header */}
        <div
          className="px-4 py-2 rounded-t-md flex items-center justify-between"
          style={{ backgroundColor: `${color}15` }}
        >
          <div className="flex items-center gap-2 flex-1">
            {icon && <div className="text-gray-700">{icon}</div>}
            <span className="font-semibold text-sm tracking-tight text-gray-800">
              {label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-mono px-2 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: color, color: "white" }}
            >
              {count}
            </span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </div>
        </div>

        {/* Body - shows when collapsed */}
        {!isExpanded && (
          <div className="px-4 py-3 text-xs text-gray-500 font-mono border-t">
            Click to expand and view {count} items
          </div>
        )}

        {/* Expanded preview */}
        {isExpanded && (
          <div className="px-4 py-2 border-t">
            <div className="text-xs text-gray-500 font-mono">
              Showing subcategories and files...
            </div>
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-2 !h-2" />
    </div>
  );
});

AggregationNode.displayName = "AggregationNode";
