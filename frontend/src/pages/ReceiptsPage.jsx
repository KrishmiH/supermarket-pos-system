import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { money } from "../utils/money";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Table from "../ui/Table";
import { RefreshCcw } from "lucide-react";

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
        <Button onClick={load} variant="secondary" size="sm">
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <Card>
        {loading ? (
          <div className="p-6 text-slate-500">Loading receipts…</div>
        ) : (
          <Table
            columns={[
              { key: "receiptNo", title: "Receipt" },
              { key: "cashierName", title: "Cashier" },
              {
                key: "paymentMethod",
                title: "Payment",
                render: (r) => (
                  <Badge tone={r.paymentMethod === "CASH" ? "blue" : "purple"}>
                    {r.paymentMethod}
                  </Badge>
                ),
              },
              {
                key: "grandTotal",
                title: "Total",
                align: "right",
                render: (r) => <>LKR {money(r.grandTotal)}</>,
              },
              {
                key: "createdAt",
                title: "Date",
                align: "right",
                render: (r) => new Date(r.createdAt).toLocaleString(),
              },
              {
                key: "action",
                title: "Action",
                align: "right",
                render: (r) => (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/receipts/${r.receiptNo}`)}
                  >
                    View
                  </Button>
                ),
              },
            ]}
            rows={sales}
            rowKey={(r) => r.id}
            emptyText="No receipts found."
          />
        )}
      </Card>
    </div>
  );
}
