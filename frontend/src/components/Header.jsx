export default function Header({ backendStatus }) {
  const statusLabel =
    backendStatus === "online"
      ? "System online"
      : backendStatus === "offline"
      ? "Backend unreachable"
      : "Checking...";

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__logo" aria-hidden="true" />
        <div>
          <h1 className="app-header__title font-pixel">Knowledge Graph AI</h1>
          <p className="app-header__subtitle">
            Turn unstructured text into connected knowledge.
          </p>
        </div>
      </div>

      <div
        className={`status-indicator status-indicator--${backendStatus}`}
        role="status"
      >
        <span className="status-indicator__dot" aria-hidden="true" />
        {statusLabel}
      </div>
    </header>
  );
}
