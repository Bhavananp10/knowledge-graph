import GraphControls from "./GraphControls";

export default function GraphHeader({ nodeCount, relationshipCount, hasGraph, onFit, onReset }) {
  return (
    <div className="panel__header graph-panel__header">
      <div>
        <h2 className="panel__title font-pixel">Knowledge graph</h2>
        <p className="panel__subtitle">Explore entities and their relationships.</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div className="graph-stats">
          <div className="graph-stat">
            <div className="graph-stat__value">{nodeCount}</div>
            <div className="graph-stat__label">Nodes</div>
          </div>
          <div className="graph-stat">
            <div className="graph-stat__value">{relationshipCount}</div>
            <div className="graph-stat__label">Relationships</div>
          </div>
        </div>

        {hasGraph && <GraphControls onFit={onFit} onReset={onReset} />}
      </div>
    </div>
  );
}
