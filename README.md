# DatumOS Design Exploration

UI mockups demonstrating different interface options for DatumOS - the world's first Operations Intelligence platform for AEC.

## Design Philosophy

This prototype showcases a **search-first** interface that combines:
- Clean, modern, sparse design with monochromatic (grayscale) palette
- ShadCN components with Tailwind CSS styling
- Typography: Inter font (with tightened letter spacing for headings) and JetBrains Mono for code/captions
- Design inspiration from Geist, GitHub, and ReactFlow

## Key Features

### 1. Infinite Canvas
- Draggable dot grid background
- Provides unlimited workspace for data visualization
- All UI elements float above the canvas

### 2. Search Bar
- Centered at top of screen as primary interaction point
- Expands and activates on user input
- Connects to multiple AEC platforms (ACC, M365, Bluebeam)

### 3. Knowledge Graph Visualization
- Real-time visualization using ReactFlow
- Displays data categories and relationships as user types
- Animated edges showing data traversal
- Categories include: Projects, Documents, Drawings, RFIs, Submittals, Teams

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
- **Graph Visualization**: ReactFlow
- **Icons**: Lucide React
- **Fonts**: Inter, JetBrains Mono

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
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles & CSS variables
├── components/
│   ├── ui/                 # ShadCN components
│   │   ├── button.tsx
│   │   └── input.tsx
│   ├── infinite-canvas.tsx # Draggable dot grid canvas
│   ├── search-bar.tsx      # Floating search input
│   ├── knowledge-graph.tsx # ReactFlow visualization
│   └── search-results.tsx  # Results display grid
└── lib/
    └── utils.ts            # Utility functions
```

## Design System

### Colors
- Grayscale palette using HSL color space
- Customizable via CSS variables in `globals.css`
- Light mode focused (dark mode structure included)

### Typography
- **Headings**: Inter with `-0.05em` letter spacing
- **Body/Captions**: JetBrains Mono
- Font optimization via next/font

### Spacing & Layout
- Tailwind's default spacing scale
- 8px base unit (dot grid: 24px)
- Consistent padding and gaps

## Future Enhancements

Potential improvements for the mockup:
- Advanced search filters and operators
- More interactive graph node types
- Result preview panels
- Keyboard navigation
- Real API integrations
- Drag-and-drop file operations
- Collaborative features

## Platform Integrations (Mockup)

Current mockup simulates connections to:
- **Autodesk Construction Cloud (ACC)**: Projects, documents, drawings
- **Microsoft 365 (M365)**: Documents, meeting notes, shared files
- **Bluebeam**: RFIs, markups, submittals
- **Teams**: Project teams, collaboration groups

---

Built with Next.js and TypeScript for rapid prototyping and iteration.
