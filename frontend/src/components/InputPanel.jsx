import TextInput from "./TextInput";
import UploadButton from "./UploadButton";
import GenerateButton from "./GenerateButton";

export default function InputPanel({
  text,
  onTextChange,
  onGenerate,
  loading,
  loadingPhase,
}) {
  return (
    <section className="panel">
      <div className="panel__header">
        <h2 className="panel__title font-pixel">Source text</h2>
      </div>
      <div className="panel__body input-panel__body">
        <TextInput value={text} onChange={onTextChange} disabled={loading} />

        <div className="input-panel__actions">
          <UploadButton onFileText={onTextChange} disabled={loading} />
          <GenerateButton
            onClick={onGenerate}
            loading={loading}
            disabled={!text.trim()}
          />
        </div>

        {loading && (
          <div className="loading-status" role="status">
            <span className="loading-status__cursor" aria-hidden="true" />
            {loadingPhase}
          </div>
        )}
      </div>
    </section>
  );
}
