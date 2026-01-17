export default function Table({ columns, rows, emptyText = "No data", rowKey }) {
  return (
    <div className="overflow-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-900 border-b border-orange-300">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wide text-orange-900 ${
                  c.align === "right"
                    ? "text-right"
                    : c.align === "center"
                    ? "text-center"
                    : "text-left"
                }`}
              >
                {c.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-5 py-10 text-slate-500" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((r, idx) => (
              <tr
                key={rowKey(r, idx)}
                className={`border-b border-orange-200 odd:bg-[#fffaf0] even:bg-[#fff3e0] hover:bg-orange-100 transition ${
                  idx % 2 === 0 ? "bg-[#fffaf0]" : "bg-[#fff3e0]"
                }`}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-5 py-4 ${
                      c.align === "right"
                        ? "text-right"
                        : c.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
