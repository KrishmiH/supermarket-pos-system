import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-slate-600">Manage supermarket products</p>
        </div>

        <button
          className="px-4 py-2 rounded-lg bg-slate-900 text-white"
          onClick={() => alert("Add Product modal in next commit")}
        >
          + Add Product
        </button>
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
                  <tr
                    key={p.id}
                    className="border-t hover:bg-slate-50"
                  >
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
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.isActive ? (
                        <span className="text-emerald-600 text-xs font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        className="text-xs text-blue-600"
                        onClick={() => alert("Edit modal in next commit")}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs text-red-600"
                        onClick={() => alert("Delete in next commit")}
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
    </div>
  );
}
