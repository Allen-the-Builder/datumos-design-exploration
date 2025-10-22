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
      {/* Target handles - edges can connect TO this node */}
      <Handle type="target" position={Position.Top} id="top" className="!bg-gray-400 !w-2 !h-2 !opacity-0" />
      <Handle type="target" position={Position.Right} id="right" className="!bg-gray-400 !w-2 !h-2 !opacity-0" />
      <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-gray-400 !w-2 !h-2 !opacity-0" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-gray-400 !w-2 !h-2 !opacity-0" />

      <div
        className="relative flex items-center justify-center cursor-pointer transition-all hover:scale-110"
        style={{ width: "120px", height: "120px" }}
        onClick={onToggle}
      >
        {/* Outer circle border */}
        <div
          className="absolute inset-0 rounded-full border-4 transition-all"
          style={{
            borderColor: "#6b7280",
            backgroundColor: isExpanded ? "#f3f4f6" : "white",
            boxShadow: isExpanded
              ? "0 8px 24px rgba(107, 116, 128, 0.25), 0 0 0 4px rgba(107, 116, 128, 0.15)"
              : "0 4px 12px rgba(107, 116, 128, 0.2)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-3">
          {icon && (
            <div className="mb-1" style={{ color: "#6b7280" }}>
              {icon}
            </div>
          )}
          <div className="text-sm font-semibold tracking-tight" style={{ color: "#6b7280" }}>
            {label}
          </div>
          <div
            className="mt-1 text-xs font-mono px-2 py-0.5 rounded-full font-bold"
            style={{ backgroundColor: "#6b7280", color: "white" }}
          >
            {count}
          </div>
        </div>

        {/* Expand/collapse indicator */}
        <div
          className="absolute bottom-1 right-1 rounded-full p-1"
          style={{ backgroundColor: "#f3f4f6" }}
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3" style={{ color: "#6b7280" }} />
          ) : (
            <ChevronRight className="w-3 h-3" style={{ color: "#6b7280" }} />
          )}
        </div>
      </div>

      {/* Source handles - edges can connect FROM this node */}
      <Handle type="source" position={Position.Top} id="top" className="!bg-gray-400 !w-2 !h-2 !opacity-0" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-gray-400 !w-2 !h-2 !opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-gray-400 !w-2 !h-2 !opacity-0" />
      <Handle type="source" position={Position.Left} id="left" className="!bg-gray-400 !w-2 !h-2 !opacity-0" />
    </div>
  );
});

AggregationNode.displayName = "AggregationNode";
