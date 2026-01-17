export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_6px_18px_rgba(234,88,12,0.35)] hover:brightness-110"
      : variant === "secondary"
      ? "bg-white/70 border border-amber-300 hover:bg-amber-50"
      : variant === "ghost"
      ? "bg-transparent hover:bg-amber-100"
      : variant === "danger"
      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_8px_20px_rgba(220,38,38,0.25)]"
      : "bg-white/70 border border-amber-300 hover:bg-amber-50";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
