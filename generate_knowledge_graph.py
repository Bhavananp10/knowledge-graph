from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_core.documents import Document
from langchain_groq import ChatGroq
from pyvis.network import Network

from dotenv import load_dotenv
import os
import asyncio
import json


# Load the .env file
load_dotenv()
# Get API key from environment variable
api_key = os.getenv("GROQ_API_KEY")

llm = ChatGroq(model_name="openai/gpt-oss-120b", temperature=0)

graph_transformer = LLMGraphTransformer(llm=llm)


# Extract graph data from input text
async def extract_graph_data(text):
    """
    Asynchronously extracts graph data from input text using a graph transformer.

    Args:
        text (str): Input text to be processed into graph format.

    Returns:
        list: A list of GraphDocument objects containing nodes and relationships.
    """
    documents = [Document(page_content=text)]
    graph_documents = await graph_transformer.aconvert_to_graph_documents(documents)
    return graph_documents


def visualize_graph(graph_documents):
    """
    Visualizes a knowledge graph using PyVis based on the extracted graph documents.

    Args:
        graph_documents (list): A list of GraphDocument objects with nodes and relationships.

    Returns:
        pyvis.network.Network: The visualized network graph object.
    """
    # Create network
    net = Network(height="1200px", width="100%", directed=True,
                      notebook=False, bgcolor="#ffffff", font_color="#1a1a1a", filter_menu=True, cdn_resources='remote')

    nodes = graph_documents[0].nodes
    relationships = graph_documents[0].relationships

    # Build lookup for valid nodes
    node_dict = {node.id: node for node in nodes}
    
    # Filter out invalid edges and collect valid node IDs
    valid_edges = []
    valid_node_ids = set()
    for rel in relationships:
        if rel.source.id in node_dict and rel.target.id in node_dict:
            valid_edges.append(rel)
            valid_node_ids.update([rel.source.id, rel.target.id])

    # Track which nodes are part of any relationship
    connected_node_ids = set()
    for rel in relationships:
        connected_node_ids.add(rel.source.id)
        connected_node_ids.add(rel.target.id)

    # Add valid nodes to the graph
    for node_id in valid_node_ids:
        node = node_dict[node_id]
        try:
            net.add_node(node.id, label=node.id, title=node.type, group=node.type)
        except:
            continue  # Skip node if error occurs

    # Add valid edges to the graph
    for rel in valid_edges:
        try:
            net.add_edge(rel.source.id, rel.target.id, label=rel.type.lower())
        except:
            continue  # Skip edge if error occurs

    # Assign a soft, professional pastel color to each distinct node group/type
    pastel_palette = [
        "#AEC6E8", "#FFD8B1", "#B5EAD7", "#FFB7B2", "#C7CEEA",
        "#FFF3B0", "#D5AAFF", "#A0E7E5", "#FFDAC1", "#E2F0CB",
    ]
    node_types = sorted({node.type for node in nodes})
    groups_options = {
        node_type: {
            "color": {
                "background": pastel_palette[i % len(pastel_palette)],
                "border": "#4A4A4A",
                "highlight": {
                    "background": pastel_palette[i % len(pastel_palette)],
                    "border": "#1a1a1a"
                }
            }
        }
        for i, node_type in enumerate(node_types)
    }

    # Configure graph appearance, layout, physics, and interaction
    options = {
        "nodes": {
            "shape": "dot",
            "size": 18,
            "borderWidth": 2,
            "font": {
                "color": "#1a1a1a",
                "size": 15,
                "face": "Arial, Helvetica, sans-serif",
                "strokeWidth": 0
            }
        },
        "edges": {
            "color": {"color": "#9AA5B1", "highlight": "#4A4A4A"},
            "width": 1.5,
            "smooth": {"enabled": True, "type": "continuous", "roundness": 0.15},
            "font": {
                "color": "#555555",
                "size": 11,
                "face": "Arial, Helvetica, sans-serif",
                "strokeWidth": 0,
                "align": "top",
                "background": "rgba(255,255,255,0.7)"
            }
        },
        "groups": groups_options,
        "interaction": {
            "zoomSpeed": 0.2,
            "zoomView": True,
            "dragView": True,
            "dragNodes": True,
            "hideEdgesOnDrag": True,
            "hideEdgesOnZoom": True,
            "navigationButtons": True
        },
        "physics": {
            "forceAtlas2Based": {
                "gravitationalConstant": -300,
                "centralGravity": 0.01,
                "springLength": 250,
                "springConstant": 0.05,
                "damping": 0.4,
                "avoidOverlap": 0.8
            },
            "minVelocity": 0.75,
            "solver": "forceAtlas2Based",
            "stabilization": {
                "enabled": True,
                "iterations": 300,
                "fit": True
            }
        }
    }
    net.set_options(json.dumps(options))

    output_file = "knowledge_graph.html"
    try:
        net.save_graph(output_file)
        print(f"Graph saved to {os.path.abspath(output_file)}")
        return net
    except Exception as e:
        print(f"Error saving graph: {e}")
        return None


def generate_knowledge_graph(text):
    """
    Generates and visualizes a knowledge graph from input text.

    This function runs the graph extraction asynchronously and then visualizes
    the resulting graph using PyVis.

    Args:
        text (str): Input text to convert into a knowledge graph.

    Returns:
        pyvis.network.Network: The visualized network graph object.
    """
    graph_documents = asyncio.run(extract_graph_data(text))
    net = visualize_graph(graph_documents)
    return net