export default function NodeInspector({ selectedNode, relationships }) {
  if (!selectedNode) {
    return (
      <div className="node-inspector">
        <p className="node-inspector__empty">Select a node to inspect its relationships.</p>
      </div>
    );
  }

  const nodeId = selectedNode.id;
  const related = relationships
    .filter((rel) => rel.source === nodeId || rel.target === nodeId)
    .map((rel, index) => ({
      key: `${rel.source}-${rel.type}-${rel.target}-${index}`,
      isOutgoing: rel.source === nodeId,
      type: rel.type,
      other: rel.source === nodeId ? rel.target : rel.source,
    }));

  return (
    <div className="node-inspector">
      <p className="node-inspector__title eyebrow">Selected entity</p>

      <div className="node-inspector__entity">
        <span
          className="node-inspector__swatch"
          style={{ background: selectedNode.data.color }}
          aria-hidden="true"
        />
        <div>
          <div className="node-inspector__name">{selectedNode.data.label}</div>
          <div className="node-inspector__type">{selectedNode.data.entityType}</div>
        </div>
      </div>

      {related.length === 0 ? (
        <p className="node-inspector__empty">No relationships found for this entity.</p>
      ) : (
        <ul className="node-inspector__rels">
          {related.map((rel) => (
            <li key={rel.key} className="node-inspector__rel">
              {rel.isOutgoing ? (
                <>
                  <span className="node-inspector__rel-type">{rel.type}</span>
                  <span aria-hidden="true">→</span>
                  <span className="node-inspector__rel-target">{rel.other}</span>
                </>
              ) : (
                <>
                  <span className="node-inspector__rel-target">{rel.other}</span>
                  <span aria-hidden="true">→</span>
                  <span className="node-inspector__rel-type">{rel.type}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
