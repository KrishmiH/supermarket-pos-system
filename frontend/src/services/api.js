const API_BASE_URL = "http://localhost:5105";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // Try to read error message from backend
  if (!res.ok) {
    let msg = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch (_) {}
    throw new Error(msg);
  }

  // Some endpoints return no content
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getProductByBarcode(barcode) {
    return request(`/api/products/barcode/${encodeURIComponent(barcode)}`);
  },

  checkoutSale(payload) {
    return request(`/api/sales/checkout`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getProducts() {
    return request("/api/products");
  },

  createProduct(payload) {
    return request("/api/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateProduct(id, payload) {
    return request(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteProduct(id) {
    return request(`/api/products/${id}`, {
      method: "DELETE",
    });
  },

  getTodayRevenue() {
    return request("/api/sales/today-revenue");
  },

  getRecentSales(limit = 10) {
    return request(`/api/sales/recent?limit=${limit}`);
  },
};
