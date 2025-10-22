"use client";

import { useCallback } from 'react';
import { useStore, getBezierPath, EdgeProps, Position, Node } from 'reactflow';

// Returns the position (x, y) of the center of a node
function getNodeCenter(node: Node) {
  return {
    x: (node.positionAbsolute?.x ?? 0) + (node.width ?? 0) / 2,
    y: (node.positionAbsolute?.y ?? 0) + (node.height ?? 0) / 2,
  };
}

// Returns the coordinates of a handle based on its position on the node
function getHandleCoordsByPosition(node: Node, handlePosition: Position) {
  const x = node.positionAbsolute?.x ?? 0;
  const y = node.positionAbsolute?.y ?? 0;
  const width = node.width ?? 0;
  const height = node.height ?? 0;

  switch (handlePosition) {
    case Position.Top:
      return { x: x + width / 2, y };
    case Position.Right:
      return { x: x + width, y: y + height / 2 };
    case Position.Bottom:
      return { x: x + width / 2, y: y + height };
    case Position.Left:
      return { x, y: y + height / 2 };
    default:
      return { x: x + width / 2, y: y + height / 2 };
  }
}

// Determines which handles to use based on the relative positions of two nodes
function getParams(nodeA: Node, nodeB: Node) {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);

  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);

  let sourcePos: Position;
  let targetPos: Position;

  // Choose handles based on which direction has more distance
  if (horizontalDiff > verticalDiff) {
    // Use left/right handles
    sourcePos = centerA.x > centerB.x ? Position.Left : Position.Right;
    targetPos = centerA.x > centerB.x ? Position.Right : Position.Left;
  } else {
    // Use top/bottom handles
    sourcePos = centerA.y > centerB.y ? Position.Top : Position.Bottom;
    targetPos = centerA.y > centerB.y ? Position.Bottom : Position.Top;
  }

  const sourceHandle = getHandleCoordsByPosition(nodeA, sourcePos);
  const targetHandle = getHandleCoordsByPosition(nodeB, targetPos);

  return {
    sx: sourceHandle.x,
    sy: sourceHandle.y,
    tx: targetHandle.x,
    ty: targetHandle.y,
    sourcePos,
    targetPos,
  };
}

// Main component that renders a floating edge
export function SimpleFloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style,
  animated
}: EdgeProps) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getParams(sourceNode, targetNode);

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetX: tx,
    targetY: ty,
    targetPosition: targetPos,
  });

  return (
    <path
      id={id}
      className={animated ? "react-flow__edge-path animated" : "react-flow__edge-path"}
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  );
}

export default SimpleFloatingEdge;
