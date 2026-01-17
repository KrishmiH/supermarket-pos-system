export default function Card({ title, right, children, className = "" }) {
  return (
    <div className={`bg-white border rounded-2xl ${className}`}>
      {(title || right) && (
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <div>{right}</div>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
