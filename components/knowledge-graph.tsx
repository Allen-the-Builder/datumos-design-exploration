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
  useReactFlow,
  ReactFlowProvider,
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
  fileName: string;
  fileExtension: string;
  platform: string;
  relevanceScore?: number; // 0-100% search relevance
}

const categoryDefinitions: CategoryData[] = [
  {
    id: "projects",
    label: "Projects",
    color: "#3b82f6",
    icon: <Folder className="w-5 h-5" />,
    files: [
      { id: "proj-1", fileName: "Downtown_Tower_Construction", fileExtension: "mpp", platform: "ACC" },
      { id: "proj-2", fileName: "Harbor_Bridge_Renovation", fileExtension: "mpp", platform: "ACC" },
      { id: "proj-3", fileName: "Medical_Center_Expansion", fileExtension: "mpp", platform: "ACC" },
      { id: "proj-4", fileName: "Transit_Hub_Development", fileExtension: "mpp", platform: "ACC" },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    color: "#8b5cf6",
    icon: <FileText className="w-5 h-5" />,
    files: [
      { id: "doc-1", fileName: "Project_Specifications_v3.2", fileExtension: "docx", platform: "M365" },
      { id: "doc-2", fileName: "Safety_Compliance_Report", fileExtension: "pdf", platform: "M365" },
      { id: "doc-3", fileName: "Meeting_Notes_Week_12", fileExtension: "docx", platform: "M365" },
      { id: "doc-4", fileName: "Budget_Analysis_Q4", fileExtension: "xlsx", platform: "ACC" },
      { id: "doc-5", fileName: "Contract_Amendment_2024", fileExtension: "pdf", platform: "M365" },
    ],
  },
  {
    id: "drawings",
    label: "Drawings",
    color: "#ec4899",
    icon: <Layers className="w-5 h-5" />,
    files: [
      { id: "draw-1", fileName: "A-101_Site_Plan", fileExtension: "dwg", platform: "Bluebeam" },
      { id: "draw-2", fileName: "S-201_Structural_Detail", fileExtension: "dwg", platform: "ACC" },
      { id: "draw-3", fileName: "M-301_HVAC_Layout", fileExtension: "dwg", platform: "Bluebeam" },
    ],
  },
  {
    id: "rfis",
    label: "RFIs",
    color: "#f59e0b",
    icon: <AlertCircle className="w-5 h-5" />,
    files: [
      { id: "rfi-1", fileName: "RFI-024_Foundation_Clarification", fileExtension: "pdf", platform: "Bluebeam" },
      { id: "rfi-2", fileName: "RFI-031_Material_Substitution", fileExtension: "pdf", platform: "ACC" },
      { id: "rfi-3", fileName: "RFI-045_Schedule_Conflict", fileExtension: "pdf", platform: "Bluebeam" },
    ],
  },
  {
    id: "teams",
    label: "Teams",
    color: "#10b981",
    icon: <Users className="w-5 h-5" />,
    files: [
      { id: "team-1", fileName: "Structural_Engineering_Team", fileExtension: "csv", platform: "ACC" },
      { id: "team-2", fileName: "MEP_Coordination_Group", fileExtension: "csv", platform: "ACC" },
      { id: "team-3", fileName: "Site_Management", fileExtension: "csv", platform: "M365" },
    ],
  },
];

// Define custom node types
const nodeTypes: NodeTypes = {
  aggregation: AggregationNode,
  file: FileNode,
};

// Layout constants
const SEARCH_NODE_WIDTH = 120;
const CATEGORY_NODE_WIDTH = 120;
const CATEGORY_NODE_HEIGHT = 120;
const FILE_NODE_WIDTH = 200;
const FILE_NODE_HEIGHT = 120;
const HORIZONTAL_SPACING = 280; // Space between category nodes horizontally
const VERTICAL_SPACING_CATEGORIES = 250; // Space between search and categories
const VERTICAL_SPACING_FILES = 180; // Space between categories and first file
const FILE_VERTICAL_SPACING = 140; // Space between files in vertical stack

// Calculate search relevance score for a file (0-100)
const calculateRelevanceScore = (fileName: string, query: string): number => {
  if (!query || query.length === 0) return 0;

  const nameLower = fileName.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match = 100%
  if (nameLower === queryLower) return 100;

  // Starts with query = 90%
  if (nameLower.startsWith(queryLower)) return 90;

  // Contains query as whole word = 80%
  const words = nameLower.split(/[\s_-]+/);
  if (words.some(word => word === queryLower)) return 80;

  // Contains query anywhere = 60-70% based on position
  const index = nameLower.indexOf(queryLower);
  if (index !== -1) {
    const positionScore = Math.max(60, 70 - (index / nameLower.length) * 10);
    return Math.round(positionScore);
  }

  // Partial word matches = 40-50%
  if (words.some(word => word.includes(queryLower))) return 50;

  // Fuzzy match based on character overlap = 20-30%
  const matchedChars = queryLower.split('').filter(char => nameLower.includes(char)).length;
  const fuzzyScore = (matchedChars / queryLower.length) * 30;

  return Math.round(fuzzyScore);
};

const generateGraphData = (query: string, expandedCategories: Set<string>) => {
  const queryLower = query.toLowerCase();
  const hasQuery = query.length > 0;

  // Calculate relevance scores for all files and filter categories with matches
  const categoriesWithScores = categoryDefinitions.map(cat => {
    const filesWithScores = cat.files.map(file => ({
      ...file,
      relevanceScore: calculateRelevanceScore(file.fileName, query)
    })).filter(file => !hasQuery || file.relevanceScore > 0) // Only show files with relevance if there's a query
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)); // Sort by relevance

    return {
      ...cat,
      files: filesWithScores,
      hasMatches: filesWithScores.length > 0
    };
  }).filter(cat => cat.hasMatches); // Only show categories with matching files

  // Auto-expand categories with matches (unless manually collapsed)
  const autoExpandedCategories = new Set(expandedCategories);
  if (hasQuery) {
    categoriesWithScores.forEach(cat => {
      if (cat.hasMatches && !expandedCategories.has(`collapsed-${cat.id}`)) {
        autoExpandedCategories.add(cat.id);
      }
    });
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Calculate total width needed for categories
  const totalCategoriesWidth = categoriesWithScores.length * HORIZONTAL_SPACING;
  const startX = -totalCategoriesWidth / 2;

  // Search node (root) - centered at top
  const searchX = 0;
  const searchY = 0;

  nodes.push({
    id: "search",
    type: "input",
    data: { label: query || "Search Query" },
    position: { x: searchX - SEARCH_NODE_WIDTH / 2, y: searchY },
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
  });

  // Add category nodes in a horizontal row
  categoriesWithScores.forEach((cat, idx) => {
    const isExpanded = autoExpandedCategories.has(cat.id);
    const categoryX = startX + idx * HORIZONTAL_SPACING;
    const categoryY = searchY + VERTICAL_SPACING_CATEGORIES;

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
      // Vertical directory tree layout - files stacked vertically
      const fileX = categoryX + CATEGORY_NODE_WIDTH / 2 - FILE_NODE_WIDTH / 2;

      cat.files.forEach((file, fileIdx) => {
        const fileY = categoryY + VERTICAL_SPACING_FILES + fileIdx * FILE_VERTICAL_SPACING;

        nodes.push({
          id: file.id,
          type: "file",
          data: {
            label: file.fileName,
            fileName: file.fileName,
            fileExtension: file.fileExtension,
            type: file.fileExtension.toUpperCase(),
            platform: file.platform,
            color: cat.color,
            relevanceScore: file.relevanceScore,
          },
          position: { x: fileX, y: fileY },
        });

        // Add edge from category to file
        edges.push({
          id: `${cat.id}-${file.id}`,
          source: cat.id,
          target: file.id,
          style: { stroke: cat.color, strokeWidth: 1.5, strokeDasharray: "5,5" },
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

function KnowledgeGraphInner({ searchQuery }: KnowledgeGraphProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [previousQuery, setPreviousQuery] = useState(searchQuery);
  const { fitView } = useReactFlow();

  // Reset collapsed states when search query changes
  useEffect(() => {
    if (searchQuery !== previousQuery) {
      setPreviousQuery(searchQuery);
      // Clear manually collapsed markers when query changes
      setExpandedCategories(prev => {
        const next = new Set<string>();
        prev.forEach(item => {
          if (!item.startsWith('collapsed-')) {
            next.add(item);
          }
        });
        return next;
      });
    }
  }, [searchQuery, previousQuery]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);

      // If this category is expanded, mark it as manually collapsed
      if (prev.has(categoryId)) {
        next.delete(categoryId);
        next.add(`collapsed-${categoryId}`);
      } else {
        // Remove collapsed marker and expand
        next.delete(`collapsed-${categoryId}`);
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

    // Trigger fitView after nodes are updated to auto-adjust view
    setTimeout(() => {
      fitView({
        padding: 0.2,
        duration: 400,
        maxZoom: 1,
        minZoom: 0.1
      });
    }, 50);
  }, [graphData, setNodes, setEdges, fitView]);

  return (
    <div className="w-full h-full pointer-events-auto">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1, minZoom: 0.1 }}
        minZoom={0.1}
        maxZoom={2}
        className="bg-transparent"
        proOptions={{ hideAttribution: true }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
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

export function KnowledgeGraph(props: KnowledgeGraphProps) {
  return (
    <ReactFlowProvider>
      <KnowledgeGraphInner {...props} />
    </ReactFlowProvider>
  );
}
