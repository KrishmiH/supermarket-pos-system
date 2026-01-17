import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import Modal from "../components/Modal";

const emptyForm = {
  barcode: "",
  name: "",
  category: "General",
  price: 0,
  stock: 0,
  reorderLevel: 10,
  isActive: true,
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("add"); // add | edit
  const [selected, setSelected] = useState(null);

  // Form state
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const modalTitle = useMemo(
    () => (mode === "add" ? "Add Product" : "Edit Product"),
    [mode]
  );

  async function loadProducts() {
    try {
      setError("");
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (e) {
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openAdd() {
    setMode("add");
    setSelected(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(product) {
    setMode("edit");
    setSelected(product);
    setForm({
      barcode: product.barcode ?? "",
      name: product.name ?? "",
      category: product.category ?? "General",
      price: Number(product.price ?? 0),
      stock: Number(product.stock ?? 0),
      reorderLevel: Number(product.reorderLevel ?? 10),
      isActive: Boolean(product.isActive),
    });
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
  }

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateForm() {
    if (!form.barcode.trim()) return "Barcode is required";
    if (!form.name.trim()) return "Name is required";
    if (Number(form.price) < 0) return "Price cannot be negative";
    if (Number(form.stock) < 0) return "Stock cannot be negative";
    if (Number(form.reorderLevel) < 0) return "Reorder level cannot be negative";
    return "";
  }

  async function handleSave() {
    const msg = validateForm();
    if (msg) {
      setError(msg);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        barcode: form.barcode.trim(),
        name: form.name.trim(),
        category: (form.category || "General").trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        reorderLevel: Number(form.reorderLevel),
        isActive: Boolean(form.isActive),
      };

      if (mode === "add") {
        await api.createProduct(payload);
      } else {
        await api.updateProduct(selected.id, payload);
      }

      setModalOpen(false);
      await loadProducts();
    } catch (e) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    const ok = window.confirm(
      `Delete product "${product.name}" (barcode: ${product.barcode})?`
    );
    if (!ok) return;

    try {
      setError("");
      await api.deleteProduct(product.id);
      await loadProducts();
    } catch (e) {
      setError(e.message || "Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-slate-600">Manage supermarket products</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 rounded-lg border"
            onClick={loadProducts}
            type="button"
          >
            Refresh
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-slate-900 text-white"
            onClick={openAdd}
            type="button"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-slate-500">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="p-6 text-slate-500">No products found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Barcode</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => {
                const lowStock = p.stock <= p.reorderLevel;

                return (
                  <tr key={p.id} className="border-t hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono">{p.barcode}</td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3 text-right">{p.price}</td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lowStock
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {p.stock}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Reorder ≤ {p.reorderLevel}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      {p.isActive ? (
                        <span className="text-emerald-600 text-xs font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Inactive</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        className="text-xs text-blue-600"
                        onClick={() => openEdit(p)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs text-red-600"
                        onClick={() => handleDelete(p)}
                        type="button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Modal title={modalTitle} open={modalOpen} onClose={closeModal}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600">Barcode *</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.barcode}
                onChange={(e) => setField("barcode", e.target.value)}
                placeholder="e.g., 123456"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">Category</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                placeholder="e.g., Beverages"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-slate-600">Name *</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g., Apple Juice"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">Price</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-right"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                type="number"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">Stock</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-right"
                value={form.stock}
                onChange={(e) => setField("stock", e.target.value)}
                type="number"
                min="0"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">Reorder level</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-right"
                value={form.reorderLevel}
                onChange={(e) => setField("reorderLevel", e.target.value)}
                type="number"
                min="0"
              />
            </div>

            <div className="flex items-center gap-2 mt-5">
              <input
                id="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setField("isActive", e.target.checked)}
              />
              <label htmlFor="isActive" className="text-sm">
                Active
              </label>
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded-lg border"
              onClick={closeModal}
              disabled={saving}
              type="button"
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 rounded-lg bg-slate-900 text-white disabled:opacity-50"
              onClick={handleSave}
              disabled={saving}
              type="button"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
