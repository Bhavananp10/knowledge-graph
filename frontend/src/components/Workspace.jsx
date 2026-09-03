import InputPanel from "./InputPanel";
import GraphPanel from "./GraphPanel";

export default function Workspace({
  text,
  onTextChange,
  onGenerate,
  loading,
  loadingPhase,
  graphData,
  selectedNode,
  onNodeSelect,
}) {
  return (
    <div className="workspace">
      <InputPanel
        text={text}
        onTextChange={onTextChange}
        onGenerate={onGenerate}
        loading={loading}
        loadingPhase={loadingPhase}
      />
      <GraphPanel
        graphData={graphData}
        selectedNode={selectedNode}
        onNodeSelect={onNodeSelect}
      />
    </div>
  );
}
