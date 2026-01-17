export default function Badge({ children, tone = "gray" }) {
  const map = {
    gray: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    amber: "bg-amber-100 text-amber-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${map[tone]}`}>
      {children}
    </span>
  );
}
