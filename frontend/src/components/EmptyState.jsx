// A small 5x5 pixel glyph suggesting a node-and-edge graph, built from a
// fixed on/off grid — no image asset needed.
const GLYPH = [
  0, 0, 1, 0, 0,
  0, 0, 1, 0, 0,
  1, 1, 1, 1, 1,
  0, 0, 1, 0, 0,
  0, 1, 0, 1, 0,
];

export default function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state__glyph" aria-hidden="true">
        {GLYPH.map((on, index) => (
          <span key={index} className={on ? "on" : ""} />
        ))}
      </div>
      <p className="empty-state__title font-pixel">
        Your knowledge graph will appear here
      </p>
      <p className="empty-state__copy">
        Paste text on the left and generate a graph to explore its entities
        and relationships.
      </p>
    </div>
  );
}
