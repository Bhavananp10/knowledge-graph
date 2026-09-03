import { useRef } from "react";
import GraphHeader from "./GraphHeader";
import KnowledgeGraph from "./KnowledgeGraph";
import EmptyState from "./EmptyState";
import NodeInspector from "./NodeInspector";

export default function GraphPanel({ graphData, selectedNode, onNodeSelect }) {
  const graphRef = useRef(null);
  const hasGraph = Boolean(graphData);

  return (
    <section className="panel graph-panel">
      <GraphHeader
        nodeCount={graphData?.nodes.length ?? 0}
        relationshipCount={graphData?.relationships.length ?? 0}
        hasGraph={hasGraph}
        onFit={() => graphRef.current?.fit()}
        onReset={() => graphRef.current?.reset()}
      />

      <div className="graph-panel__canvas">
        {hasGraph ? (
          <KnowledgeGraph ref={graphRef} data={graphData} onNodeSelect={onNodeSelect} />
        ) : (
          <EmptyState />
        )}
      </div>

      <NodeInspector
        selectedNode={selectedNode}
        relationships={graphData?.relationships ?? []}
      />
    </section>
  );
}
