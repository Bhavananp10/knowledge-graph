export default function GenerateButton({ onClick, loading, disabled }) {
  return (
    <button
      type="button"
      className="btn btn--primary"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Generating..." : "✦ Generate Knowledge Graph"}
    </button>
  );
}
