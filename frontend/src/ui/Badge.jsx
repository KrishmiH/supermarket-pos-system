export default function Badge({ children, tone = "gray" }) {
  const map = {
    gray: "bg-amber-50 text-amber-900 border-amber-200",
    green: "bg-green-100 text-green-800 border-green-200",
    red: "bg-red-100 text-red-800 border-red-200",
    blue: "bg-sky-100 text-sky-800 border-sky-200",
    amber: "bg-amber-200 text-amber-900 border-amber-300",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${map[tone]}`}
    >
      {children}
    </span>
  );
}
