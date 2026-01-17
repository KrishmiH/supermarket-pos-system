import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../services/api";
import { useToast } from "../components/ToastProvider";
import { money } from "../utils/money";

import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Badge from "../ui/Badge";

import { Barcode, Plus, Trash2, Minus, CreditCard, Banknote, X } from "lucide-react";

export default function PosPage() {
  const barcodeRef = useRef(null);
  const toast = useToast();

  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0.05);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [cashierName, setCashierName] = useState("Cashier");
  const [isAdding, setIsAdding] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const [lastReceipt, setLastReceipt] = useState(null);

  // Auto-focus barcode input on load
  useEffect(() => {
    barcodeRef.current?.focus();
  }, []);

  // Keyboard shortcuts: ESC to clear, Ctrl+L to focus
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        setBarcode("");
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
        e.preventDefault();
        barcodeRef.current?.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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

  async function handleAddByBarcode() {
    const code = barcode.trim();
    if (!code) return;

    setError("");
    setLastReceipt(null);
    setIsAdding(true);

    try {
      const product = await api.getProductByBarcode(code);

      setCart((prev) => {
        const existing = prev.find((x) => x.barcode === product.barcode);
        if (existing) {
          return prev.map((x) =>
            x.barcode === product.barcode ? { ...x, qty: x.qty + 1 } : x
          );
        }
        return [
          ...prev,
          {
            id: product.id || product._id || product.barcode,
            productId: product.id || product._id || "",
            barcode: product.barcode,
            name: product.name,
            unitPrice: product.price,
            qty: 1,
          },
        ];
      });

      setBarcode("");
      toast.success(`Added: ${product.name}`);
    } catch (e) {
      setError(e.message || "Failed to add item");
      toast.error(e.message || "Failed to add item");
    } finally {
      setIsAdding(false);
    }
  }

  async function handleCheckout() {
    if (cart.length === 0) return;

    setError("");
    setIsCheckingOut(true);

    try {
      const payload = {
        cashierName: cashierName || "Cashier",
        paymentMethod,
        discount: Number(discount) || 0,
        taxRate: Number(taxRate) || 0,
        items: cart.map((i) => ({
          barcode: i.barcode,
          qty: i.qty,
        })),
      };

      const sale = await api.checkoutSale(payload);
      setLastReceipt(sale);
      setCart([]);
      setDiscount(0);
      toast.success(`Sale completed. Receipt: ${sale.receiptNo}`);
    } catch (e) {
      setError(e.message || "Checkout failed");
      toast.error(e.message || "Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">POS Billing</h1>
          <p className="text-slate-600">
            Scan barcode, manage cart, and checkout.{" "}
            <span className="text-slate-500">(Ctrl+L focus, Esc clear)</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <Input
              value={cashierName}
              onChange={(e) => setCashierName(e.target.value)}
              placeholder="Cashier name"
              className="sm:w-56"
            />
            <div className="flex items-center gap-2">
              <Button
                variant={paymentMethod === "CASH" ? "primary" : "secondary"}
                type="button"
                onClick={() => setPaymentMethod("CASH")}
              >
                <Banknote size={16} />
                Cash
              </Button>
              <Button
                variant={paymentMethod === "CARD" ? "primary" : "secondary"}
                type="button"
                onClick={() => setPaymentMethod("CARD")}
              >
                <CreditCard size={16} />
                Card
              </Button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {lastReceipt && (
        <Card
          className="p-0 border-emerald-200"
          title="Sale Completed"
          right={<Badge tone="green">✓ Completed</Badge>}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm text-slate-700">
              Receipt: <span className="font-mono font-semibold">{lastReceipt.receiptNo}</span>
            </div>
            <div className="text-sm font-semibold">
              Total: <span className="text-emerald-700">LKR {money(lastReceipt.grandTotal)}</span>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left (2 cols): Scan + Cart */}
        <div className="xl:col-span-2 space-y-4">
          <Card title="Scan Barcode" right={<Badge tone="blue"><Barcode size={14} className="inline" /> Scanner</Badge>}>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                ref={barcodeRef}
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Scan or type barcode…"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddByBarcode();
                }}
              />
              <Button onClick={handleAddByBarcode} disabled={isAdding} type="button">
                <Plus size={16} />
                {isAdding ? "Adding..." : "Add"}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setBarcode("")}
              >
                <X size={16} />
                Clear
              </Button>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Tip: barcode scanners act like keyboard input.
            </div>
          </Card>

          <Card
            title={`Cart (${cart.length})`}
            right={
              <Button
                variant="secondary"
                type="button"
                onClick={() => setCart([])}
                disabled={cart.length === 0}
              >
                <Trash2 size={16} />
                Clear cart
              </Button>
            }
            className="p-0 overflow-hidden"
          >
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left">Item</th>
                    <th className="px-4 py-3 text-right">Unit</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Line</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr>
                      <td className="px-4 py-10 text-slate-500" colSpan={5}>
                        Cart is empty. Scan an item to begin.
                      </td>
                    </tr>
                  ) : (
                    cart.map((i) => (
                      <tr key={i.id} className="border-t hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-semibold">{i.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{i.barcode}</div>
                        </td>
                        <td className="px-4 py-3 text-right">LKR {money(i.unitPrice)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="secondary" className="px-2 py-2" onClick={() => decQty(i.id)} type="button">
                              <Minus size={16} />
                            </Button>
                            <div className="w-10 text-center font-semibold">{i.qty}</div>
                            <Button variant="secondary" className="px-2 py-2" onClick={() => incQty(i.id)} type="button">
                              <Plus size={16} />
                            </Button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          LKR {money(i.unitPrice * i.qty)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="secondary" onClick={() => removeItem(i.id)} type="button">
                            <Trash2 size={16} />
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right: Summary */}
        <div className="space-y-4">
          <Card title="Payment Summary">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Sub total</span>
                <span className="font-semibold">LKR {money(subTotal)}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">Discount</span>
                <Input
                  className="w-32 text-right"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  type="number"
                  min="0"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">Tax rate</span>
                <Input
                  className="w-32 text-right"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Tax</span>
                <span className="font-semibold">LKR {money(taxAmount)}</span>
              </div>

              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-emerald-700">LKR {money(grandTotal)}</span>
              </div>

              <Button
                className="w-full py-3"
                type="button"
                disabled={cart.length === 0 || isCheckingOut}
                onClick={handleCheckout}
              >
                {paymentMethod === "CASH" ? <Banknote size={16} /> : <CreditCard size={16} />}
                {isCheckingOut ? "Processing..." : "Checkout"}
              </Button>

              <div className="text-xs text-slate-500">
                Checkout creates a Sale and auto-deducts stock.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
