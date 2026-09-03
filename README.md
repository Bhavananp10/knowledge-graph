# Knowledge Graph AI

Turn raw text into an interactive knowledge graph. The app sends your text to an LLM (via [LangChain](https://www.langchain.com/)'s graph transformer), extracts entities and the relationships between them, and renders the result as an explorable graph.

The repository contains two ways to run the project:

| | Stack | Status |
|---|---|---|
| **Web app** ([`backend/`](backend/) + [`frontend/`](frontend/)) | FastAPI + React ([React Flow](https://reactflow.dev/)) | Actively developed |
| **Streamlit MVP** ([`app.py`](app.py)) | Streamlit + [PyVis](https://pyvis.readthedocs.io/) | Original prototype, kept for reference |

Both share the same extraction logic in [`generate_knowledge_graph.py`](generate_knowledge_graph.py).

## Features

- **Two input methods** (Streamlit MVP): upload a `.txt` file or paste text directly
- **LLM-powered extraction**: entities and relationships are pulled from text using LangChain's `LLMGraphTransformer`, backed by Groq's `openai/gpt-oss-120b` model
- **Interactive visualization**:
  - Web app — pan/zoom graph built with React Flow, click a node to inspect its relationships in a side panel
  - Streamlit MVP — physics-based PyVis graph with node/edge filtering
- **Invalid-edge filtering**: relationships whose endpoints aren't both present as nodes are dropped before rendering

## DEMO

https://lnkd.in/p/gDe-Q9zw

## Architecture

<img width="1536" height="1024" alt="ChatGPT Image Sep 2, 2026, 12_57_45 PM" src="https://github.com/user-attachments/assets/50c5c130-9734-459b-bae9-ead2561b94ff" />


```
Text input
   │
   ▼
generate_knowledge_graph.py  (extract_graph_data)
   │  LangChain LLMGraphTransformer + ChatGroq
   ▼
Graph documents (nodes + relationships)
   │
   ├── backend/main.py  ──HTTP──▶  frontend/ (React + React Flow)
   └── app.py (Streamlit)  ──▶  PyVis HTML graph
```

- **`backend/`** — a FastAPI service exposing `POST /api/generate-graph`, which calls `extract_graph_data`, filters out edges with missing endpoints, and returns a plain `{ nodes, relationships }` JSON payload (see [`backend/models.py`](backend/models.py) for the schema).
- **`frontend/`** — a Vite + React app that posts text to the backend, lays the returned graph out with `d3-force`, and renders it with React Flow. Components live under [`frontend/src/components/`](frontend/src/components/).
- **`app.py`** — the original single-file Streamlit prototype that runs extraction and rendering in-process and displays a PyVis graph inline.

## Prerequisites

- Python 3.10+
- Node.js 18+ (for the React frontend)
- A [Groq API key](https://console.groq.com/keys)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd knowledge-graph-llms
   ```

2. Create a Python virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the project root with your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Running the web app (FastAPI + React)

Start the backend from the project root:

```bash
uvicorn backend.main:app --reload
```

This serves the API at `http://localhost:8000` (health check at `/health`).

In a separate terminal, start the frontend:

```bash
cd frontend
npm run dev
```

This opens the app at `http://localhost:5173`. Paste or type text into the input panel and click generate — the frontend calls the backend, which runs extraction and returns the graph to render.

> The backend's CORS policy only allows requests from `http://localhost:5173`. If you serve the frontend elsewhere, update `allow_origins` in [`backend/main.py`](backend/main.py).

## Running the Streamlit MVP

```bash
streamlit run app.py
```

This opens the app in your browser (typically `http://localhost:8501`). Choose an input method from the sidebar, provide text, and click **Generate Knowledge Graph** to render an interactive PyVis graph inline.

## API reference

### `GET /health`
Returns `{ "status": "ok" }` — used by the frontend to show backend connectivity.

### `POST /api/generate-graph`
Request body:
```json
{ "text": "Your input text..." }
```

Response body:
```json
{
  "nodes": [{ "id": "string", "type": "string" }],
  "relationships": [{ "source": "string", "target": "string", "type": "string" }]
}
```

Errors: `422` if no graph could be extracted from the text, `502` if the language model call fails.

## Project structure

```
.
├── app.py                       # Streamlit MVP entry point
├── generate_knowledge_graph.py  # Shared extraction + PyVis visualization logic
├── requirements.txt             # Python dependencies
├── backend/
│   ├── main.py                  # FastAPI app and /api/generate-graph endpoint
│   └── models.py                # Pydantic request/response schemas
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Top-level app state and orchestration
│   │   ├── components/          # UI components (input panel, graph panel, node inspector, ...)
│   │   ├── services/api.js      # Backend API client
│   │   └── utils/graphLayout.js # d3-force layout for the graph
│   └── package.json
└── notebooks/
    └── knowledge_graph.ipynb    # Exploratory notebook
```

## Tech stack

- **LLM orchestration**: LangChain, `langchain-experimental` (`LLMGraphTransformer`), `langchain-groq`
- **Backend**: FastAPI, Pydantic, Uvicorn
- **Frontend**: React, Vite, React Flow (`@xyflow/react`), `d3-force`
- **MVP**: Streamlit, PyVis

## License

Licensed under the [MIT License](LICENSE).
