# DatumOS Design Exploration

UI mockups demonstrating different interface options for DatumOS - the world's first Operations Intelligence platform for AEC.

## Available UI Schemes

This repository contains multiple UI design schemes, each in its own branch:

### **Scheme 1** (`claude/ui-mockup-design-011CUNUtjLYDnG2LXEGsjhMs`)
- Minimalist grayscale design
- Simple animated graph showing category traversal
- Flat node hierarchy
- Basic visual feedback as search query changes

### **Scheme 2** (`claude/ui-scheme-2-011CUNUtjLYDnG2LXEGsjhMs`) ⭐ Current Branch
- **yFiles-inspired aggregation nodes**
- **Interactive expand/collapse functionality**
- Hierarchical node structure with parent-child relationships
- Colorful, professional node styling with badges
- Click nodes to reveal subcategories and files
- Advanced visual hierarchy with custom node types

## Design Philosophy

This prototype showcases a **search-first** interface that combines:
- Clean, modern, sparse design
- ShadCN components with Tailwind CSS styling
- System fonts optimized for all environments
- Design inspiration from Geist, GitHub, ReactFlow, and yFiles

## Key Features (Scheme 2)

### 1. Infinite Canvas
- Draggable dot grid background
- Provides unlimited workspace for data visualization
- All UI elements float above the canvas

### 2. Search Bar
- Centered at top of screen as primary interaction point
- Placeholder: "search your AEC knowledge base"
- Connects to multiple AEC platforms (ACC, M365, Bluebeam)

### 3. yFiles-Style Knowledge Graph
- **Aggregation Nodes**: Collapsible category nodes with:
  - Color-coded headers
  - Item count badges
  - Expand/collapse chevron icons
  - Icon indicators for category type
  - Professional gradient styling
- **File Nodes**: Individual items revealed when categories expand:
  - Compact card design
  - Platform badges (ACC, M365, Bluebeam)
  - Type indicators
  - Hover effects
- **Interactive Edges**: Animated connections showing relationships
- **Hierarchical Layout**: Root search node → Categories → Files

### 4. Search Results Display
- Floating card-based layout at bottom of screen
- Grid display with hover effects
- Shows results from multiple connected platforms
- Metadata includes platform source, file type, and timestamps

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN (Radix UI primitives)
- **Graph Visualization**: ReactFlow with custom node types
- **Icons**: Lucide React
- **Fonts**: System fonts (cross-platform compatibility)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the mockup.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles & CSS variables
├── components/
│   ├── ui/                 # ShadCN components
│   │   ├── button.tsx
│   │   └── input.tsx
│   ├── nodes/              # Custom ReactFlow nodes (Scheme 2)
│   │   ├── aggregation-node.tsx  # Expandable category nodes
│   │   └── file-node.tsx         # Individual file nodes
│   ├── infinite-canvas.tsx # Draggable dot grid canvas
│   ├── search-bar.tsx      # Floating search input
│   ├── knowledge-graph.tsx # ReactFlow visualization
│   └── search-results.tsx  # Results display grid
└── lib/
    └── utils.ts            # Utility functions
```

## Design System

### Colors (Scheme 2)
- Blue (#3b82f6): Projects
- Purple (#8b5cf6): Documents
- Pink (#ec4899): Drawings
- Amber (#f59e0b): RFIs
- Green (#10b981): Teams
- Gradient accent: Purple-to-violet for search node

### Typography
- **Sans**: System fonts (-apple-system, Segoe UI, Roboto)
- **Mono**: Monospace fonts (SF Mono, Menlo, Consolas)
- Tight letter spacing for headings

### Spacing & Layout
- Tailwind's default spacing scale
- 8px base unit (dot grid: 24px)
- Consistent padding and gaps

## Interactive Features (Scheme 2)

### Node Expansion
1. Start typing in search bar to reveal category nodes
2. Click any category node to expand and view files
3. Files appear below with connecting edges
4. Click again to collapse
5. Multiple categories can be expanded simultaneously

### Node Data Structure
- **Aggregation Nodes**:
  - Projects (4 items)
  - Documents (5 items)
  - Drawings (3 items)
  - RFIs (3 items)
  - Teams (3 items)
- Each category contains mock AEC project files

## Comparing Schemes

| Feature | Scheme 1 | Scheme 2 |
|---------|----------|----------|
| Visual Style | Grayscale, minimal | Colorful, professional |
| Node Interaction | Static display | Click to expand/collapse |
| Hierarchy | Flat | Multi-level (categories → files) |
| Node Design | Simple boxes | Custom components with badges |
| Inspiration | ReactFlow basic | yFiles aggregation demo |
| Complexity | Lower | Higher |
| Data Visualization | Category overview | Detailed drill-down |

## Platform Integrations (Mockup)

Current mockup simulates connections to:
- **Autodesk Construction Cloud (ACC)**: Projects, documents, drawings
- **Microsoft 365 (M365)**: Documents, meeting notes, shared files
- **Bluebeam**: RFIs, markups, submittals

## Future Enhancements

Potential improvements:
- Real API integrations with AEC platforms
- Search filters and advanced operators
- Node drag-and-drop functionality
- Result preview panels
- Keyboard navigation (arrow keys)
- Save/load graph states
- Export capabilities
- Real-time collaboration
- Animation transitions between expand/collapse

---

Built with Next.js and TypeScript for rapid prototyping and iteration.
