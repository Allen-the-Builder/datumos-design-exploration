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
  EdgeTypes,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { AggregationNode } from "./nodes/aggregation-node";
import { FileNode } from "./nodes/file-node";
import { SimpleFloatingEdge } from "./edges/simple-floating-edge";
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
  summary?: string; // AI-generated summary
}

const categoryDefinitions: CategoryData[] = [
  {
    id: "projects",
    label: "Projects",
    color: "#6b7280",
    icon: <Folder className="w-5 h-5" />,
    files: [
      {
        id: "proj-1",
        fileName: "Downtown_Tower_Construction",
        fileExtension: "mpp",
        platform: "ACC",
        summary: "42-story mixed-use tower project currently in foundation phase. Schedule shows 18-month timeline with steel erection beginning Q2 2025."
      },
      {
        id: "proj-2",
        fileName: "Harbor_Bridge_Renovation",
        fileExtension: "mpp",
        platform: "ACC",
        summary: "Historic bridge restoration involving structural reinforcement and seismic retrofitting. Critical path includes night work during low traffic periods."
      },
      {
        id: "proj-3",
        fileName: "Medical_Center_Expansion",
        fileExtension: "mpp",
        platform: "ACC",
        summary: "Three-phase hospital expansion adding 200 beds and surgical facilities. Coordination with active medical operations requires detailed sequencing."
      },
      {
        id: "proj-4",
        fileName: "Transit_Hub_Development",
        fileExtension: "mpp",
        platform: "ACC",
        summary: "Multi-modal transportation facility integrating bus, rail, and pedestrian infrastructure. Fast-tracked delivery using design-build methodology."
      },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    color: "#6b7280",
    icon: <FileText className="w-5 h-5" />,
    files: [
      {
        id: "doc-1",
        fileName: "Project_Specifications_v3.2",
        fileExtension: "docx",
        platform: "M365",
        summary: "Updated technical specifications including revised concrete mix designs and waterproofing requirements. Incorporates feedback from structural engineer review."
      },
      {
        id: "doc-2",
        fileName: "Safety_Compliance_Report",
        fileExtension: "pdf",
        platform: "M365",
        summary: "Monthly OSHA compliance audit showing zero recordable incidents. Highlights improved fall protection procedures and crane operator certification updates."
      },
      {
        id: "doc-3",
        fileName: "Meeting_Notes_Week_12",
        fileExtension: "docx",
        platform: "M365",
        summary: "OAC meeting covering MEP coordination conflicts and schedule acceleration strategies. Action items assigned to subcontractor leads with two-week deadline."
      },
      {
        id: "doc-4",
        fileName: "Budget_Analysis_Q4",
        fileExtension: "xlsx",
        platform: "ACC",
        summary: "Financial tracking report showing 3% cost savings in structural steel procurement. Forecasts minor overrun in sitework due to unexpected soil conditions."
      },
      {
        id: "doc-5",
        fileName: "Contract_Amendment_2024",
        fileExtension: "pdf",
        platform: "M365",
        summary: "Change order package covering scope additions and extended project duration. Includes approved value engineering proposals and updated payment schedule."
      },
    ],
  },
  {
    id: "drawings",
    label: "Drawings",
    color: "#6b7280",
    icon: <Layers className="w-5 h-5" />,
    files: [
      {
        id: "draw-1",
        fileName: "A-101_Site_Plan",
        fileExtension: "dwg",
        platform: "Bluebeam",
        summary: "Overall site layout showing building footprint, parking areas, and utility connections. Latest revision incorporates fire department access requirements and landscape buffer zones."
      },
      {
        id: "draw-2",
        fileName: "S-201_Structural_Detail",
        fileExtension: "dwg",
        platform: "ACC",
        summary: "Foundation connection details for seismic zone compliance. Includes post-tensioned slab specifications and column base plate anchor configurations."
      },
      {
        id: "draw-3",
        fileName: "M-301_HVAC_Layout",
        fileExtension: "dwg",
        platform: "Bluebeam",
        summary: "Mechanical system routing for floors 3-8 showing ductwork, equipment locations, and coordination with structural beams. Reflects recent value engineering changes."
      },
    ],
  },
  {
    id: "rfis",
    label: "RFIs",
    color: "#6b7280",
    icon: <AlertCircle className="w-5 h-5" />,
    files: [
      {
        id: "rfi-1",
        fileName: "RFI-024_Foundation_Clarification",
        fileExtension: "pdf",
        platform: "Bluebeam",
        summary: "Request for clarification on pile cap reinforcement spacing due to conflicting details between structural drawings. Response received approving alternate bar configuration."
      },
      {
        id: "rfi-2",
        fileName: "RFI-031_Material_Substitution",
        fileExtension: "pdf",
        platform: "ACC",
        summary: "Proposal to substitute specified curtain wall system with alternative manufacturer due to delivery delays. Architect approved with modifications to glazing specifications."
      },
      {
        id: "rfi-3",
        fileName: "RFI-045_Schedule_Conflict",
        fileExtension: "pdf",
        platform: "Bluebeam",
        summary: "Coordination issue between electrical rough-in and drywall installation sequences. Resolution requires two-week schedule adjustment to avoid rework."
      },
    ],
  },
  {
    id: "teams",
    label: "Teams",
    color: "#6b7280",
    icon: <Users className="w-5 h-5" />,
    files: [
      {
        id: "team-1",
        fileName: "Structural_Engineering_Team",
        fileExtension: "csv",
        platform: "ACC",
        summary: "Six licensed engineers specializing in high-rise concrete design and seismic analysis. Lead by principal with 25 years experience in complex urban projects."
      },
      {
        id: "team-2",
        fileName: "MEP_Coordination_Group",
        fileExtension: "csv",
        platform: "ACC",
        summary: "Cross-functional coordination team managing mechanical, electrical, and plumbing system integration. Conducts weekly BIM clash detection reviews and resolution workshops."
      },
      {
        id: "team-3",
        fileName: "Site_Management",
        fileExtension: "csv",
        platform: "M365",
        summary: "On-site leadership including project superintendent, safety manager, and quality control inspector. Responsible for daily field operations and subcontractor coordination."
      },
    ],
  },
];

// Define custom node types
const nodeTypes: NodeTypes = {
  aggregation: AggregationNode,
  file: FileNode,
};

// Define custom edge types
const edgeTypes: EdgeTypes = {
  floating: SimpleFloatingEdge,
};

// Layout constants
const SEARCH_NODE_WIDTH = 120;
const CATEGORY_NODE_WIDTH = 120;
const CATEGORY_NODE_HEIGHT = 120;
const FILE_NODE_WIDTH = 200;
const FILE_NODE_HEIGHT = 120;
const HORIZONTAL_SPACING = 350; // Space between category nodes horizontally (increased to prevent overlap)
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

// Determine max results based on query length
const getMaxResults = (queryLength: number): number => {
  if (queryLength === 0) return 100; // Show all when no query
  if (queryLength <= 2) return 8;
  if (queryLength <= 4) return 5;
  return 3;
};

// Determine minimum relevance threshold based on query length
const getMinRelevanceThreshold = (queryLength: number): number => {
  if (queryLength === 0) return 0;    // No threshold when no query
  if (queryLength <= 2) return 40;    // 40% minimum for short queries
  if (queryLength <= 4) return 50;    // 50% minimum for medium queries
  return 60;                          // 60% minimum for longer queries
};

const generateGraphData = (query: string, expandedCategories: Set<string>) => {
  const queryLower = query.toLowerCase();
  const hasQuery = query.length > 0;

  // Calculate relevance scores for all files
  const categoriesWithScores = categoryDefinitions.map(cat => {
    const filesWithScores = cat.files.map(file => ({
      ...file,
      relevanceScore: calculateRelevanceScore(file.fileName, query),
      categoryId: cat.id,
      categoryColor: cat.color,
      categoryIcon: cat.icon,
      categoryLabel: cat.label
    }));
    return { ...cat, files: filesWithScores };
  });

  // Get filtering parameters
  const maxResults = getMaxResults(query.length);
  const minThreshold = getMinRelevanceThreshold(query.length);

  // Flatten all files, filter by threshold, sort by relevance, and take top N
  const allFiles = categoriesWithScores
    .flatMap(cat => cat.files)
    .filter(file => !hasQuery || (file.relevanceScore > 0 && file.relevanceScore >= minThreshold))  // Apply threshold
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    .slice(0, maxResults);

  // Group filtered files back into categories
  const categoriesWithFilteredFiles = categoryDefinitions.map(cat => {
    const filteredFiles = allFiles.filter(file => file.categoryId === cat.id);
    return {
      ...cat,
      files: filteredFiles,
      hasMatches: filteredFiles.length > 0
    };
  }).filter(cat => cat.hasMatches);

  // Auto-expand categories with matches (unless manually collapsed)
  const autoExpandedCategories = new Set(expandedCategories);
  if (hasQuery) {
    categoriesWithFilteredFiles.forEach(cat => {
      if (cat.hasMatches && !expandedCategories.has(`collapsed-${cat.id}`)) {
        autoExpandedCategories.add(cat.id);
      }
    });
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Calculate total width needed for categories
  const totalCategoriesWidth = categoriesWithFilteredFiles.length * HORIZONTAL_SPACING;
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
      background: "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "600",
      padding: "12px 20px",
      boxShadow: "0 4px 12px rgba(107, 116, 128, 0.4)",
    },
  });

  // Add category nodes in a horizontal row
  categoriesWithFilteredFiles.forEach((cat, idx) => {
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
      type: "floating",
      animated: !isExpanded,
      style: { stroke: "#6b7280", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#6b7280",
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
            summary: file.summary,
          },
          position: { x: fileX, y: fileY },
        });

        // Add edge from category to file
        edges.push({
          id: `${cat.id}-${file.id}`,
          source: cat.id,
          target: file.id,
          type: "floating",
          style: { stroke: "#6b7280", strokeWidth: 1.5, strokeDasharray: "5,5" },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#6b7280",
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
        padding: 0.3,      // Increased padding for better vertical spacing
        duration: 400,
        maxZoom: 1.0,      // Slightly higher max zoom
        minZoom: 0.1
      });
    }, 100);              // Slightly longer delay to ensure layout is ready
  }, [graphData, setNodes, setEdges, fitView]);

  return (
    <div className="w-full h-full pointer-events-auto">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3, maxZoom: 1.0, minZoom: 0.1 }}
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
