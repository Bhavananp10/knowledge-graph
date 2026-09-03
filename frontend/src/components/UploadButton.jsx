import { useRef } from "react";

export default function UploadButton({ onFileText, disabled }) {
  const inputRef = useRef(null);

  function handleChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onFileText(String(reader.result ?? ""));
    };
    reader.readAsText(file);

    // allow selecting the same file again later
    event.target.value = "";
  }

  return (
    <>
      <button
        type="button"
        className="btn btn--upload"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        + Upload TXT
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".txt"
        className="visually-hidden"
        onChange={handleChange}
        tabIndex={-1}
        aria-hidden="true"
      />
    </>
  );
}
