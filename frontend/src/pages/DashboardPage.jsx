import { useEffect, useState } from "react";
import { api } from "../services/api";
import { money } from "../utils/money";

function StatCard({ label, value }) {
  return (
    <div className="bg-white border rounded-2xl p-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setLoading(true);

      const revenueRes = await api.getTodayRevenue();
      const salesRes = await api.getRecentSales(10);

      setTodayRevenue(revenueRes.todayRevenue ?? 0);
      setRecentSales(salesRes);
    } catch (e) {
      setError(e.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-slate-600">Sales overview and recent transactions</p>
        </div>

        <button
          className="px-4 py-2 rounded-lg border"
          onClick={load}
          type="button"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Today's Revenue"
          value={loading ? "Loading..." : money(todayRevenue)}
        />
        <StatCard
          label="Recent Transactions"
          value={loading ? "Loading..." : recentSales.length}
        />
        <StatCard
          label="System Status"
          value={loading ? "Loading..." : "Online"}
        />
      </div>

      {/* Recent sales */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h2 className="font-semibold">Recent Sales</h2>
          <span className="text-xs text-slate-500">Latest 10</span>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500">Loading recent sales…</div>
        ) : recentSales.length === 0 ? (
          <div className="p-6 text-slate-500">No sales found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Receipt</th>
                <th className="px-4 py-3 text-left">Cashier</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((s) => (
                <tr key={s.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono">{s.receiptNo}</td>
                  <td className="px-4 py-3">{s.cashierName}</td>
                  <td className="px-4 py-3">{s.paymentMethod}</td>
                  <td className="px-4 py-3 text-right">{money(s.grandTotal)}</td>
                  <td className="px-4 py-3 text-right">
                    {new Date(s.createdAt).toLocaleString()}
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
