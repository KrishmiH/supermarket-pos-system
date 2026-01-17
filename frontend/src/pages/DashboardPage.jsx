import { useEffect, useState } from "react";
import { api } from "../services/api";
import { money } from "../utils/money";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { RefreshCcw, TrendingUp, Receipt, ShieldCheck } from "lucide-react";

function Stat({ icon, label, value, sub, tone = "gray" }) {
  return (
    <Card className="p-0">
      <div className="p-4 flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-600">{label}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
          {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
        </div>
        <div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="px-4 pb-4">
        <Badge tone={tone}>{tone === "green" ? "Good" : tone === "blue" ? "Info" : "Status"}</Badge>
      </div>
    </Card>
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-slate-600">Sales overview and recent transactions</p>
        </div>

        <Button variant="secondary" onClick={load} type="button">
          <RefreshCcw size={16} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat
          icon={<TrendingUp size={18} className="text-slate-700" />}
          label="Today's Revenue"
          value={loading ? "Loading..." : `LKR ${money(todayRevenue)}`}
          sub="All completed sales today"
          tone="green"
        />
        <Stat
          icon={<Receipt size={18} className="text-slate-700" />}
          label="Recent Transactions"
          value={loading ? "Loading..." : recentSales.length}
          sub="Latest 10 receipts"
          tone="blue"
        />
        <Stat
          icon={<ShieldCheck size={18} className="text-slate-700" />}
          label="System Status"
          value={loading ? "Loading..." : "Online"}
          sub="API + DB reachable"
          tone="green"
        />
      </div>

      {/* Recent sales */}
      <Card
        title="Recent Sales"
        right={<span className="text-xs text-slate-500">Latest 10</span>}
        className="p-0 overflow-hidden"
      >
        {loading ? (
          <div className="p-6 text-slate-500">Loading recent sales…</div>
        ) : recentSales.length === 0 ? (
          <div className="p-6 text-slate-500">No sales found.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
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
                    <td className="px-4 py-3">
                      <Badge tone={s.paymentMethod === "CASH" ? "blue" : "purple"}>
                        {s.paymentMethod}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      LKR {money(s.grandTotal)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
