import { forceSimulation, forceManyBody, forceLink, forceCenter, forceCollide } from "d3-force";

// Vivid but tasteful palette, cycled by first-seen entity type — same
// pattern the backend's PyVis version used for pastel colors, just a
// bolder set since this frontend calls for stronger node contrast.
const NODE_PALETTE = [
  "#ff7a59", // Person
  "#4c8dff", // Organization
  "#22b8a0", // Location
  "#ffb627", // Product
  "#b27cff", // Event
  "#ff5c9e", // Concept
  "#8a93a6", // fallback / anything else
];

export function colorForType(entityType, typeOrder) {
  const index = typeOrder.indexOf(entityType);
  if (index === -1) return NODE_PALETTE[NODE_PALETTE.length - 1];
  return NODE_PALETTE[index % NODE_PALETTE.length];
}

/**
 * Runs a one-shot (not continuously animated) force-directed layout over
 * the graph so nodes start spread out and settled, then hands React Flow
 * static positions — deliberately not a live physics simulation, so the
 * graph never drifts after it first renders.
 */
export function layoutNodes(nodes, relationships, width, height) {
  const simNodes = nodes.map((node) => ({ ...node }));
  const simLinks = relationships.map((rel) => ({
    source: rel.source,
    target: rel.target,
  }));

  const simulation = forceSimulation(simNodes)
    .force("charge", forceManyBody().strength(-700))
    .force(
      "link",
      forceLink(simLinks)
        .id((d) => d.id)
        .distance(190)
    )
    .force("center", forceCenter(width / 2, height / 2))
    .force("collide", forceCollide(75))
    .stop();

  for (let i = 0; i < 300; i += 1) {
    simulation.tick();
  }

  return simNodes;
}
