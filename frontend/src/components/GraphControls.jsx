export default function GraphControls({ onFit, onReset }) {
  return (
    <div className="graph-controls">
      <button type="button" className="btn btn--ghost" onClick={onFit}>
        Fit graph
      </button>
      <button type="button" className="btn btn--ghost" onClick={onReset}>
        Reset view
      </button>
    </div>
  );
}
