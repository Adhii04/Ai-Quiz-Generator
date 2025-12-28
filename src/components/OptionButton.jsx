export default function OptionButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="border p-4 rounded hover:bg-blue-100 transition"
    >
      {text}
    </button>
  );
}
