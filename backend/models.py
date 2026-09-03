from pydantic import BaseModel


class GraphRequest(BaseModel):
    text: str


class NodeModel(BaseModel):
    id: str
    type: str


class RelationshipModel(BaseModel):
    source: str
    target: str
    type: str


class GraphResponse(BaseModel):
    nodes: list[NodeModel]
    relationships: list[RelationshipModel]
