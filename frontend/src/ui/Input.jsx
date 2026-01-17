export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-orange-300 bg-[#fff7ed] px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 ${className}`}
      {...props}
    />
  );
}
