export default function TextInput({ value, onChange, disabled }) {
  return (
    <textarea
      className="text-input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Paste a paragraph, article, notes, or other text here..."
      disabled={disabled}
      aria-label="Source text"
    />
  );
}
