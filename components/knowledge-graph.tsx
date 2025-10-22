"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { AggregationNode } from "./nodes/aggregation-node";
import { FileNode } from "./nodes/file-node";
import { Folder, FileText, Users, AlertCircle, Layers } from "lucide-react";

interface KnowledgeGraphProps {
  searchQuery: string;
}

// Define the hierarchical data structure
interface CategoryData {
  id: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  files: FileData[];
}

interface FileData {
  id: string;
  label: string;
  type: string;
  platform: string;
}

const categoryDefinitions: CategoryData[] = [
  {
    id: "projects",
    label: "Projects",
    color: "#3b82f6",
    icon: <Folder className="w-4 h-4" />,
    files: [
      { id: "proj-1", label: "Downtown Tower Construction", type: "Project", platform: "ACC" },
      { id: "proj-2", label: "Harbor Bridge Renovation", type: "Project", platform: "ACC" },
      { id: "proj-3", label: "Medical Center Expansion", type: "Project", platform: "ACC" },
      { id: "proj-4", label: "Transit Hub Development", type: "Project", platform: "ACC" },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    color: "#8b5cf6",
    icon: <FileText className="w-4 h-4" />,
    files: [
      { id: "doc-1", label: "Project Specifications v3.2", type: "Document", platform: "M365" },
      { id: "doc-2", label: "Safety Compliance Report", type: "Document", platform: "M365" },
      { id: "doc-3", label: "Meeting Notes - Week 12", type: "Document", platform: "M365" },
      { id: "doc-4", label: "Budget Analysis Q4", type: "Document", platform: "ACC" },
      { id: "doc-5", label: "Contract Amendment 2024", type: "Document", platform: "M365" },
    ],
  },
  {
    id: "drawings",
    label: "Drawings",
    color: "#ec4899",
    icon: <Layers className="w-4 h-4" />,
    files: [
      { id: "draw-1", label: "A-101 Site Plan", type: "Drawing", platform: "Bluebeam" },
      { id: "draw-2", label: "S-201 Structural Detail", type: "Drawing", platform: "ACC" },
      { id: "draw-3", label: "M-301 HVAC Layout", type: "Drawing", platform: "Bluebeam" },
    ],
  },
  {
    id: "rfis",
    label: "RFIs",
    color: "#f59e0b",
    icon: <AlertCircle className="w-4 h-4" />,
    files: [
      { id: "rfi-1", label: "RFI-024 Foundation Clarification", type: "RFI", platform: "Bluebeam" },
      { id: "rfi-2", label: "RFI-031 Material Substitution", type: "RFI", platform: "ACC" },
      { id: "rfi-3", label: "RFI-045 Schedule Conflict", type: "RFI", platform: "Bluebeam" },
    ],
  },
  {
    id: "teams",
    label: "Teams",
    color: "#10b981",
    icon: <Users className="w-4 h-4" />,
    files: [
      { id: "team-1", label: "Structural Engineering Team", type: "Team", platform: "ACC" },
      { id: "team-2", label: "MEP Coordination Group", type: "Team", platform: "ACC" },
      { id: "team-3", label: "Site Management", type: "Team", platform: "M365" },
    ],
  },
];

// Define custom node types
const nodeTypes: NodeTypes = {
  aggregation: AggregationNode,
  file: FileNode,
};

const generateGraphData = (query: string, expandedCategories: Set<string>) => {
  const queryLower = query.toLowerCase();

  // Filter categories based on search query
  const relevantCategories = categoryDefinitions.filter(
    (cat) => cat.label.toLowerCase().includes(queryLower) || query.length > 2
  );

  const nodes: Node[] = [
    // Search node (root)
    {
      id: "search",
      type: "input",
      data: { label: query || "Search Query" },
      position: { x: 400, y: 50 },
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: "600",
        padding: "12px 20px",
        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
      },
    },
  ];

  const edges: Edge[] = [];

  // Add category nodes and their children
  relevantCategories.forEach((cat, idx) => {
    const isExpanded = expandedCategories.has(cat.id);
    const xOffset = idx * 220;
    const categoryX = 100 + xOffset;
    const categoryY = 200;

    // Add aggregation node
    nodes.push({
      id: cat.id,
      type: "aggregation",
      data: {
        label: cat.label,
        count: cat.files.length,
        isExpanded,
        onToggle: () => {}, // Will be set in component
        color: cat.color,
        icon: cat.icon,
      },
      position: { x: categoryX, y: categoryY },
    });

    // Add edge from search to category
    edges.push({
      id: `search-${cat.id}`,
      source: "search",
      target: cat.id,
      animated: !isExpanded,
      style: { stroke: cat.color, strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: cat.color,
      },
    });

    // Add file nodes if category is expanded
    if (isExpanded) {
      cat.files.forEach((file, fileIdx) => {
        const fileY = categoryY + 180 + fileIdx * 100;
        const fileX = categoryX + (fileIdx % 2 === 0 ? -80 : 80);

        nodes.push({
          id: file.id,
          type: "file",
          data: {
            label: file.label,
            type: file.type,
            platform: file.platform,
            color: cat.color,
            icon: cat.icon,
          },
          position: { x: fileX, y: fileY },
        });

        // Add edge from category to file
        edges.push({
          id: `${cat.id}-${file.id}`,
          source: cat.id,
          target: file.id,
          style: { stroke: cat.color, strokeWidth: 1.5 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: cat.color,
            width: 15,
            height: 15,
          },
        });
      });
    }
  });

  return { nodes, edges };
};

export function KnowledgeGraph({ searchQuery }: KnowledgeGraphProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const graphData = useMemo(() => {
    const data = generateGraphData(searchQuery, expandedCategories);

    // Update onToggle callbacks for aggregation nodes
    data.nodes = data.nodes.map((node) => {
      if (node.type === "aggregation") {
        return {
          ...node,
          data: {
            ...node.data,
            onToggle: () => toggleCategory(node.id),
          },
        };
      }
      return node;
    });

    return data;
  }, [searchQuery, expandedCategories, toggleCategory]);

  const [nodes, setNodes, onNodesChange] = useNodesState(graphData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphData.edges);

  useEffect(() => {
    setNodes(graphData.nodes);
    setEdges(graphData.edges);
  }, [graphData, setNodes, setEdges]);

  return (
    <div className="w-full h-full pointer-events-auto">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        minZoom={0.1}
        maxZoom={2}
        className="bg-transparent"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e5e7eb" gap={24} size={1} />
        <Controls
          className="bg-white border border-gray-200 rounded-lg shadow-lg"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}
