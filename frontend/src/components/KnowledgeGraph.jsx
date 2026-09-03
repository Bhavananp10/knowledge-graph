import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  MarkerType,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import KnowledgeGraphNode from "./KnowledgeGraphNode";
import { colorForType, layoutNodes } from "../utils/graphLayout";

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2;
const LAYOUT_WIDTH = 900;
const LAYOUT_HEIGHT = 640;

const nodeTypes = { knowledgeNode: KnowledgeGraphNode };

function buildFlowElements(data) {
  const typeOrder = [...new Set(data.nodes.map((node) => node.type))];
  const positioned = layoutNodes(data.nodes, data.relationships, LAYOUT_WIDTH, LAYOUT_HEIGHT);

  const nodes = positioned.map((node) => ({
    id: node.id,
    type: "knowledgeNode",
    position: { x: node.x, y: node.y },
    data: {
      label: node.id,
      entityType: node.type,
      color: colorForType(node.type, typeOrder),
    },
  }));

  const edges = data.relationships.map((rel, index) => ({
    id: `${rel.source}-${rel.type}-${rel.target}-${index}`,
    source: rel.source,
    target: rel.target,
    label: rel.type,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#16181d", width: 16, height: 16 },
    style: { stroke: "#16181d" },
    labelBgPadding: [4, 2],
    labelBgStyle: { fill: "#f5f1e6" },
  }));

  return { nodes, edges };
}

const GraphCanvas = forwardRef(function GraphCanvas({ data, onNodeSelect }, ref) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView, setViewport, zoomTo, getZoom } = useReactFlow();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const { nodes: nextNodes, edges: nextEdges } = buildFlowElements(data);
    setNodes(nextNodes);
    setEdges(nextEdges);
    // let layout settle into the DOM, then frame it
    const id = requestAnimationFrame(() => fitView({ padding: 0.2, duration: 0 }));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useImperativeHandle(ref, () => ({
    fit: () => fitView({ padding: 0.2, duration: 300 }),
    reset: () => setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 }),
  }));

  // React Flow's native wheel-zoom is disabled (zoomOnScroll=false below);
  // this replaces it with a small, fixed step per wheel tick so a tiny
  // scroll produces a tiny zoom, never a huge jump. Attached as a native,
  // non-passive listener — React's synthetic onWheel is passive by default,
  // which silently breaks preventDefault() and lets the page scroll too.
  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return undefined;

    function handleWheel(event) {
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1.02 : 1 / 1.02;
      const next = Math.min(Math.max(getZoom() * factor, MIN_ZOOM), MAX_ZOOM);
      zoomTo(next);
    }

    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, [getZoom, zoomTo]);

  return (
    <div className="rf-wrapper" ref={wrapperRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onNodeSelect(node)}
        onPaneClick={() => onNodeSelect(null)}
        nodesDraggable
        nodesConnectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
        zoomOnPinch
        zoomOnDoubleClick={false}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant="dots" gap={22} size={1} color="#d8d2c0" />
      </ReactFlow>
    </div>
  );
});

const KnowledgeGraph = forwardRef(function KnowledgeGraph({ data, onNodeSelect }, ref) {
  const innerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    fit: () => innerRef.current?.fit(),
    reset: () => innerRef.current?.reset(),
  }));

  // useReactFlow() (used inside GraphCanvas) requires a ReactFlowProvider
  // ancestor — kept local to this component so callers never need to know.
  return (
    <ReactFlowProvider>
      <GraphCanvas ref={innerRef} data={data} onNodeSelect={onNodeSelect} />
    </ReactFlowProvider>
  );
});

export default KnowledgeGraph;
