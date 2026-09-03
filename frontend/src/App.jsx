import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Workspace from "./components/Workspace";
import ErrorBanner from "./components/ErrorBanner";
import { checkHealth, generateGraph } from "./services/api";

const LOADING_PHASES = [
  "Analyzing text...",
  "Extracting entities...",
  "Building relationships...",
];

export default function App() {
  const [inputText, setInputText] = useState("");
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [loadingPhase, setLoadingPhase] = useState(LOADING_PHASES[0]);

  const requestInFlight = useRef(false);

  useEffect(() => {
    let cancelled = false;
    checkHealth().then((ok) => {
      if (!cancelled) setBackendStatus(ok ? "online" : "offline");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loading) return undefined;
    let index = 0;
    setLoadingPhase(LOADING_PHASES[0]);
    const id = setInterval(() => {
      index = (index + 1) % LOADING_PHASES.length;
      setLoadingPhase(LOADING_PHASES[index]);
    }, 1200);
    return () => clearInterval(id);
  }, [loading]);

  async function handleGenerate() {
    if (!inputText.trim() || requestInFlight.current) return;

    requestInFlight.current = true;
    setLoading(true);
    setError(null);
    setSelectedNode(null);

    try {
      const data = await generateGraph(inputText);
      setGraphData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      requestInFlight.current = false;
    }
  }

  return (
    <div className="app">
      <Header backendStatus={backendStatus} />
      <ErrorBanner message={error} />
      <Workspace
        text={inputText}
        onTextChange={setInputText}
        onGenerate={handleGenerate}
        loading={loading}
        loadingPhase={loadingPhase}
        graphData={graphData}
        selectedNode={selectedNode}
        onNodeSelect={setSelectedNode}
      />
    </div>
  );
}
