export default function Card({ title, right, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-orange-200 bg-[#fffaf0] shadow-[0_8px_24px_rgba(124,45,18,0.12)] ${className}`}
    >
      {(title || right) && (
        <div className="px-5 py-4 border-b border-amber-200/60 flex items-center justify-between">
          <div className="font-semibold text-amber-900">{title}</div>
          <div>{right}</div>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
