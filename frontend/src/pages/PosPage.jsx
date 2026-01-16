import { useMemo, useState } from "react";

export default function PosPage() {
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0.05);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [cashierName, setCashierName] = useState("Cashier");

  const subTotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),
    [cart]
  );

  const safeDiscount = Math.min(Math.max(Number(discount) || 0, 0), subTotal);
  const taxable = subTotal - safeDiscount;
  const taxAmount = Math.round(taxable * (Number(taxRate) || 0) * 100) / 100;
  const grandTotal = taxable + taxAmount;

  function incQty(id) {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );
  }

  function decQty(id) {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function removeItem(id) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">POS Billing</h1>
          <p className="text-slate-600">Scan barcode, add items, checkout.</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            className="border rounded-lg px-3 py-2 text-sm"
            value={cashierName}
            onChange={(e) => setCashierName(e.target.value)}
            placeholder="Cashier name"
          />
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Scan + Cart */}
        <div className="lg:col-span-2 space-y-4">
          {/* Scan bar */}
          <div className="bg-white border rounded-2xl p-4">
            <label className="text-sm font-medium">Barcode</label>
            <div className="flex gap-2 mt-2">
              <input
                className="flex-1 border rounded-lg px-3 py-2"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Scan or type barcode..."
              />
              <button
                className="px-4 py-2 rounded-lg bg-slate-900 text-white"
                type="button"
                onClick={() => alert("Next commit: connect barcode lookup API")}
              >
                Add
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Tip: barcode scanners act like keyboard input.
            </p>
          </div>

          {/* Cart table */}
          <div className="bg-white border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Cart</h2>
              <button
                className="text-sm text-red-600"
                type="button"
                onClick={() => setCart([])}
              >
                Clear
              </button>
            </div>

            <div className="overflow-auto mt-3">
              <table className="w-full text-sm">
                <thead className="text-slate-600">
                  <tr className="border-b">
                    <th className="py-2 text-left">Item</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Total</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr>
                      <td className="py-6 text-slate-500" colSpan={5}>
                        Cart is empty.
                      </td>
                    </tr>
                  ) : (
                    cart.map((i) => (
                      <tr key={i.id} className="border-b">
                        <td className="py-3">
                          <div className="font-medium">{i.name}</div>
                          <div className="text-xs text-slate-500">
                            {i.barcode}
                          </div>
                        </td>
                        <td className="py-3 text-right">{i.unitPrice}</td>
                        <td className="py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="px-2 py-1 border rounded"
                              onClick={() => decQty(i.id)}
                              type="button"
                            >
                              -
                            </button>
                            <span className="w-6 text-center">{i.qty}</span>
                            <button
                              className="px-2 py-1 border rounded"
                              onClick={() => incQty(i.id)}
                              type="button"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          {Math.round(i.unitPrice * i.qty * 100) / 100}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            className="text-xs text-red-600"
                            onClick={() => removeItem(i.id)}
                            type="button"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="space-y-4">
          <div className="bg-white border rounded-2xl p-4">
            <h2 className="font-semibold">Summary</h2>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Sub total</span>
                <span>{Math.round(subTotal * 100) / 100}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600">Discount</span>
                <input
                  className="w-28 border rounded px-2 py-1 text-right"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  type="number"
                  min="0"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600">Tax rate</span>
                <input
                  className="w-28 border rounded px-2 py-1 text-right"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Tax</span>
                <span>{taxAmount}</span>
              </div>

              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Grand total</span>
                <span>{Math.round(grandTotal * 100) / 100}</span>
              </div>
            </div>

            <button
              className="mt-4 w-full px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50"
              type="button"
              disabled={cart.length === 0}
              onClick={() => alert("Next commit: connect checkout API")}
            >
              Checkout
            </button>

            <p className="text-xs text-slate-500 mt-2">
              Checkout will create a Sale and auto-deduct stock.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
