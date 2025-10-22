"use client";

import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

interface KnowledgeGraphProps {
  searchQuery: string;
}

// Simulate categories that might be traversed based on search query
const generateGraphData = (query: string) => {
  const categories = [
    { id: "projects", label: "Projects", color: "#000000" },
    { id: "documents", label: "Documents", color: "#1a1a1a" },
    { id: "drawings", label: "Drawings", color: "#2d2d2d" },
    { id: "rfis", label: "RFIs", color: "#404040" },
    { id: "submittals", label: "Submittals", color: "#525252" },
    { id: "teams", label: "Teams", color: "#666666" },
  ];

  const queryLower = query.toLowerCase();
  const relevantCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(queryLower) || query.length > 3
  );

  // Create nodes
  const nodes: Node[] = [
    {
      id: "search",
      type: "input",
      data: { label: "Search Query" },
      position: { x: 250, y: 100 },
      style: {
        background: "#fff",
        border: "2px solid #000",
        borderRadius: "8px",
        fontSize: "12px",
        fontFamily: "var(--font-jetbrains-mono)",
        padding: "10px",
      },
    },
    ...relevantCategories.map((cat, idx) => ({
      id: cat.id,
      data: { label: cat.label },
      position: {
        x: 150 + idx * 120,
        y: 250 + Math.sin(idx) * 50,
      },
      style: {
        background: "#fff",
        border: `2px solid ${cat.color}`,
        borderRadius: "8px",
        fontSize: "11px",
        fontFamily: "var(--font-jetbrains-mono)",
        padding: "8px 12px",
        color: cat.color,
      },
    })),
  ];

  // Create edges
  const edges: Edge[] = relevantCategories.map((cat) => ({
    id: `search-${cat.id}`,
    source: "search",
    target: cat.id,
    animated: true,
    style: { stroke: cat.color, strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: cat.color,
      width: 20,
      height: 20,
    },
  }));

  return { nodes, edges };
};

export function KnowledgeGraph({ searchQuery }: KnowledgeGraphProps) {
  const graphData = useMemo(() => generateGraphData(searchQuery), [searchQuery]);
  const [nodes, setNodes, onNodesChange] = useNodesState(graphData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphData.edges);

  useEffect(() => {
    const newGraphData = generateGraphData(searchQuery);
    setNodes(newGraphData.nodes);
    setEdges(newGraphData.edges);
  }, [searchQuery, setNodes, setEdges]);

  return (
    <div className="w-full h-full pointer-events-auto">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="bg-transparent"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#d4d4d4" gap={24} size={1} />
        <Controls className="bg-white border border-gray-200 rounded-lg shadow-lg" />
      </ReactFlow>
    </div>
  );
}
