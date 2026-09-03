from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.models import GraphRequest, GraphResponse
from generate_knowledge_graph import extract_graph_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/generate-graph", response_model=GraphResponse)
async def generate_graph(request: GraphRequest):
    try:
        graph_documents = await extract_graph_data(request.text)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"The language model failed to process this text: {exc}",
        )

    if not graph_documents:
        raise HTTPException(
            status_code=422,
            detail="No graph could be extracted from this text. Try shortening it or rephrasing.",
        )

    nodes = graph_documents[0].nodes
    relationships = graph_documents[0].relationships

    # Same validity filtering already used by generate_knowledge_graph.py's
    # visualize_graph(): only nodes that participate in at least one
    # relationship where both endpoints exist are included.
    node_dict = {node.id: node for node in nodes}
    valid_edges = [
        rel for rel in relationships
        if rel.source.id in node_dict and rel.target.id in node_dict
    ]
    valid_node_ids = {
        node_id
        for rel in valid_edges
        for node_id in (rel.source.id, rel.target.id)
    }

    return {
        "nodes": [
            {"id": node_dict[node_id].id, "type": node_dict[node_id].type}
            for node_id in valid_node_ids
        ],
        "relationships": [
            {"source": rel.source.id, "target": rel.target.id, "type": rel.type}
            for rel in valid_edges
        ],
    }
