import { Handle, Position } from "@xyflow/react";

// Visually-hidden handles: edges still attach to them correctly, but this
// graph is read-only (no drawing new connections), so they carry no
// interactive affordance of their own.
export default function KnowledgeGraphNode({ data, selected }) {
  return (
    <div
      className={`rf-node${selected ? " selected" : ""}`}
      style={{ background: data.color, borderColor: "var(--border)" }}
    >
      <Handle type="target" position={Position.Top} />
      {data.label}
      <span className="rf-node__type">{data.entityType}</span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
