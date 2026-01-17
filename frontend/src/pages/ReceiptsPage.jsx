import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

function money(v) {
  return Number(v).toFixed(2);
}

export default function ReceiptsPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function load() {
    try {
      setError("");
      setLoading(true);
      const data = await api.getRecentSales(30);
      setSales(data);
    } catch (e) {
      setError(e.message || "Failed to load receipts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Receipts</h1>
          <p className="text-slate-600">View recent sales receipts</p>
        </div>
        <button className="px-4 py-2 rounded-lg border" onClick={load}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-slate-500">Loading receipts…</div>
        ) : sales.length === 0 ? (
          <div className="p-6 text-slate-500">No receipts found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Receipt</th>
                <th className="px-4 py-3 text-left">Cashier</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Date</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono">{s.receiptNo}</td>
                  <td className="px-4 py-3">{s.cashierName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        s.paymentMethod === "CASH"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {s.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {money(s.grandTotal)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="text-xs px-3 py-1 rounded-full border hover:bg-slate-100"
                      onClick={() => navigate(`/receipts/${s.receiptNo}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
