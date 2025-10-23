# Responsive Design Implementation Plan

## Overview
Transform the app into a fully responsive experience across mobile (< 640px), tablet (640px-1024px), and desktop (> 1024px) breakpoints with equal support for portrait and landscape orientations.

**Key Requirements:**
- All breakpoints: Mobile, Tablet, Desktop
- Living graph: Keep all 4 nodes, scale proportionally
- Knowledge graph: Fully interactive with touch gestures
- Orientation: Equal support for portrait and landscape

---

## Current State Analysis

### Issues Found
1. **Search Bar** (`components/search-bar.tsx`): Fixed `w-[600px]` width
2. **Living Graph** (`components/living-knowledge-graph.tsx`): Fixed `900x650px` container with 270px node radius
3. **Knowledge Graph** (`components/knowledge-graph.tsx`): Fixed node dimensions and spacing
4. **No responsive patterns** exist anywhere in the codebase - no Tailwind breakpoints, no media queries

---

## Phase 1: Foundation & Utilities

### 1.1 Create Viewport Detection Hook
**File:** `hooks/use-viewport.ts`

```typescript
export const useViewport = () => {
  // Detect current breakpoint (mobile/tablet/desktop)
  // Provide responsive values for dimensions
  // Handle orientation changes
  // Return: { isMobile, isTablet, isDesktop, orientation }
}
```

### 1.2 Create Responsive Constants
**File:** `lib/responsive-constants.ts`

Define scaled dimensions for each breakpoint:
- Living graph dimensions (container, radius, hub size)
- Knowledge graph spacing and node sizes
- Search bar widths
- Animation scale factors

```typescript
export const RESPONSIVE_CONFIG = {
  searchBar: {
    mobile: { width: '90vw', maxWidth: '340px' },
    tablet: { width: '500px' },
    desktop: { width: '600px' }
  },
  livingGraph: {
    mobile: { width: '100vw', height: '500px', radius: 150, hubSize: 96 },
    tablet: { width: '700px', height: '550px', radius: 210, hubSize: 128 },
    desktop: { width: '900px', height: '650px', radius: 270, hubSize: 144 }
  },
  // ... more configs
}
```

---

## Phase 2: Search Bar Responsiveness

**File:** `components/search-bar.tsx`

### Changes Required:
1. Replace fixed `w-[600px]` with responsive Tailwind classes:
   - Mobile: `w-[90vw] max-w-[340px]`
   - Tablet: `sm:w-[500px]`
   - Desktop: `lg:w-[600px]`

2. Adjust positioning:
   - Top margin: `top-4 sm:top-6 lg:top-8`
   - Maintain horizontal centering

3. Scale font sizes:
   - Input text: `text-sm sm:text-base lg:text-lg`
   - Placeholder: `text-xs sm:text-sm`

4. Adjust button/icon sizes:
   - Clear button: `w-6 h-6 sm:w-8 sm:h-8`
   - Search icon: Scale proportionally

---

## Phase 3: Living Graph Animation

**File:** `components/living-knowledge-graph.tsx`

### Dimension Scaling Strategy
Scale all dimensions proportionally while keeping 4 nodes:

#### Container Dimensions
- Mobile: `w-[100vw] h-[500px]`
- Tablet: `sm:w-[700px] sm:h-[550px]`
- Desktop: `lg:w-[900px] lg:h-[650px]`

#### Node Radius (from center)
- Mobile: 150px (from current 270px)
- Tablet: 210px
- Desktop: 270px

#### Central Hub Size
- Mobile: `w-24 h-24` (96px, from 144px)
- Tablet: `sm:w-32 sm:h-32` (128px)
- Desktop: `lg:w-36 lg:h-36` (144px)

#### Platform Cards
- Scale card dimensions proportionally
- Adjust icon sizes: `w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10`
- Font sizes: `text-xs sm:text-sm lg:text-base`

#### Descriptive Text
- Position: `bottom-12 sm:bottom-16 lg:bottom-20`
- Font size: `text-sm sm:text-base lg:text-lg`

#### Animation Adjustments
- Scale transforms adjusted per breakpoint
- Exit animation: Mobile `scale(2)`, Tablet `scale(2.2)`, Desktop `scale(2.5)`
- Enter animation: Mobile `scale(0.7)`, Tablet `scale(0.6)`, Desktop `scale(0.5)`
- Adjust rotation speeds if needed for smaller screens

---

## Phase 4: Knowledge Graph Responsiveness

**File:** `components/knowledge-graph.tsx`

### Node Size Scaling

#### Search Node (center)
- Mobile: 80px (from 120px)
- Tablet: 100px
- Desktop: 120px

#### Category Nodes
- Mobile: `80x80px`
- Tablet: `100x100px`
- Desktop: `120x120px`

#### File Nodes
- Mobile: `160x90px` (width×height)
- Tablet: `180x105px`
- Desktop: `200x120px`

### Spacing Adjustments

#### Horizontal Spacing (between columns)
- Mobile: 200px (from 350px)
- Tablet: 280px
- Desktop: 350px

#### Vertical Spacing
- Level 1 (search → categories):
  - Mobile: 150px (from 250px)
  - Tablet: 200px
  - Desktop: 250px

- Level 2 (categories → files):
  - Mobile: 110px (from 180px)
  - Tablet: 145px
  - Desktop: 180px

- Within category groups:
  - Mobile: 85px (from 140px)
  - Tablet: 110px
  - Desktop: 140px

### ReactFlow Configuration
- Add touch gesture handlers for pan/zoom
- Adjust minimum/maximum zoom levels per breakpoint
- Configure fitView parameters for mobile
- Optimize edge rendering for smaller screens

---

## Phase 5: File Node & Tooltip Adjustments

**File:** `components/nodes/file-node.tsx`

### Tooltip Responsive Sizing
- Mobile: `w-[280px] max-w-[90vw]`
- Tablet: `sm:w-[300px]`
- Desktop: `lg:w-[320px]`

### Positioning Strategy
- Calculate viewport bounds
- Position tooltip to stay within screen
- Fallback positions if primary position overflows

### Mobile Touch Interactions
- Change from hover to tap for showing tooltips
- Add touch event handlers
- Consider adding close button for mobile
- Prevent tooltip conflicts with pan gestures

### Content Scaling
- Font sizes: `text-xs sm:text-sm`
- Icon sizes: `w-4 h-4 sm:w-5 sm:h-5`
- Padding: Reduce on mobile for compact display

---

## Phase 6: Infinite Canvas Mobile UX

**File:** `components/infinite-canvas.tsx`

### ReactFlow Mobile Optimization
1. Configure viewport for touch devices
2. Optimize default zoom level per breakpoint
3. Set appropriate zoom limits (min/max)
4. Enable smooth pan/zoom animations

### Mobile-Specific Controls
- Add zoom in/out buttons for accessibility
- Position controls in accessible location (bottom-right)
- Style buttons for touch (larger hit areas)

### Gesture Handling
- Prevent conflicts with browser scrolling
- Distinguish between pan and node selection
- Support pinch-to-zoom gesture
- Handle orientation changes gracefully

### Performance Considerations
- Reduce edge complexity on mobile if needed
- Optimize rendering for smaller viewports
- Consider lazy loading for large graphs

---

## Phase 7: Global Responsive Adjustments

### Page Layout Updates
- Ensure proper spacing on all screen sizes
- Check overflow handling
- Verify scroll behavior on mobile
- Test keyboard on mobile (input focus, viewport shift)

### Animation Verification
- Test all CSS animations at different scales
- Verify timing feels natural on mobile
- Check performance on lower-end devices
- Ensure no layout shift during animations

### Z-Index & Layering
- Verify tooltip layers work across breakpoints
- Check modal/overlay stacking
- Ensure hover states work on touch devices

### Typography & Readability
- Font sizes readable on small screens
- Line heights appropriate for mobile
- Button text doesn't wrap unexpectedly
- Icon sizes sufficient for touch targets

---

## Implementation Sequence

### Step 1: Foundation (Do First)
1. Create `hooks/use-viewport.ts`
2. Create `lib/responsive-constants.ts`
3. Test viewport detection

### Step 2: Top-Down Component Updates
1. Update `components/search-bar.tsx`
2. Update `components/living-knowledge-graph.tsx`
3. Update `components/knowledge-graph.tsx`
4. Update `components/nodes/file-node.tsx`
5. Update `components/infinite-canvas.tsx`

### Step 3: Testing at Each Stage
- Test component at all breakpoints before moving to next
- Verify animations work correctly
- Check touch interactions on actual device
- Test both portrait and landscape

### Step 4: Integration Testing
- Test complete user flow on all devices
- Verify transitions between screens
- Check performance metrics
- Test on real mobile devices (not just browser emulation)

---

## Testing Checklist

### Mobile (< 640px)
- [ ] Search bar fits and is usable
- [ ] Living graph displays all 4 nodes
- [ ] Living graph animations don't break
- [ ] Knowledge graph is navigable with touch
- [ ] Tooltips display correctly
- [ ] No horizontal scrolling
- [ ] Portrait mode works
- [ ] Landscape mode works

### Tablet (640px - 1024px)
- [ ] Intermediate scaling looks natural
- [ ] All interactions work smoothly
- [ ] Text is readable
- [ ] Spacing feels balanced

### Desktop (> 1024px)
- [ ] Original design preserved
- [ ] No regressions in functionality
- [ ] Performance maintained

### Cross-Device
- [ ] Orientation changes handled gracefully
- [ ] Animations scale appropriately
- [ ] Touch and mouse inputs both work
- [ ] No layout shifts during interactions

---

## Technical Notes

### Tailwind Breakpoints (Default)
```
sm: 640px   // Tablet and above
md: 768px   // Medium tablets and above
lg: 1024px  // Desktop and above
xl: 1280px  // Large desktop
2xl: 1536px // Extra large desktop
```

### Recommended Breakpoint Usage
- Mobile: No prefix (default)
- Tablet: `sm:` prefix (640px+)
- Desktop: `lg:` prefix (1024px+)

### ReactFlow Mobile Best Practices
- Use `panOnDrag` for better mobile experience
- Set `panOnScroll={false}` to prevent scroll conflicts
- Configure `zoomOnPinch={true}` for pinch gestures
- Use `preventScrolling={true}` in mobile views

---

## Implementation Strategy

**Context Preservation:**
Given the instruction to preserve context by using parallel specialized subagents:

1. **Phase 1**: Single agent for utilities (foundation work)
2. **Phase 2-6**: Parallel agents per component:
   - Agent 1: SearchBar
   - Agent 2: LivingKnowledgeGraph
   - Agent 3: KnowledgeGraph
   - Agent 4: FileNode
   - Agent 5: InfiniteCanvas
3. **Phase 7**: Single agent for integration testing

Each agent will focus on one component, implementing responsive classes and testing at all breakpoints before reporting completion.

---

## Success Criteria

✅ **Functional Requirements Met:**
- All UI elements scale appropriately across breakpoints
- Living graph maintains 4 nodes at all screen sizes
- Knowledge graph is fully interactive on mobile
- Both orientations supported equally

✅ **Quality Standards:**
- No horizontal scrolling on mobile
- Animations scale smoothly without breaking
- Touch interactions feel natural
- Text remains readable at all sizes
- No performance degradation

✅ **User Experience:**
- App feels native on mobile devices
- Transitions between screens are smooth
- Graph navigation is intuitive with touch
- Layout adapts gracefully to screen rotations
