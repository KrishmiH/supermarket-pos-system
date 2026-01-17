import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams, Link } from "react-router-dom";

function money(v) {
  return Number(v).toFixed(2);
}

export default function ReceiptDetailsPage() {
  const { receiptNo } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setLoading(true);
      const data = await api.getSaleByReceipt(receiptNo);
      setSale(data);
    } catch (e) {
      setError(e.message || "Failed to load receipt");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [receiptNo]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Receipt Details</h1>
          <p className="text-slate-600 font-mono">{receiptNo}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
            ✓ Completed
          </div>
        </div>
        <Link className="px-4 py-2 rounded-lg border" to="/receipts">
          Back
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-6 text-slate-500 bg-white border rounded-2xl">
          Loading…
        </div>
      ) : !sale ? (
        <div className="p-6 text-slate-500 bg-white border rounded-2xl">
          Not found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b font-semibold">Items</div>
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-4 py-3 text-right">Unit</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">Line</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((i, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium">{i.name}</div>
                      <div className="text-xs text-slate-500 font-mono">
                        {i.barcode}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">{money(i.unitPrice)}</td>
                    <td className="px-4 py-3 text-center">{i.qty}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {money(i.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border rounded-2xl p-4">
            <div className="font-semibold">Summary</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Cashier</span>
                <span>{sale.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment</span>
                <span>{sale.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Sub total</span>
                <span>{money(sale.subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Discount</span>
                <span>{money(sale.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tax</span>
                <span>{money(sale.taxAmount)}</span>
              </div>
              <div className="border-t pt-3 mt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{money(sale.grandTotal)}</span>
              </div>
              <div className="text-xs text-slate-500 pt-2">
                {new Date(sale.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
