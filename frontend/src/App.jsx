import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PosPage from "./pages/PosPage";
import ProductsPage from "./pages/ProductsPage";
import ReceiptsPage from "./pages/ReceiptsPage";
import ReceiptDetailsPage from "./pages/ReceiptDetailsPage";

// Layout component with Sidebar and Topbar
function LayoutWithSidebar() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="p-6 bg-slate-50 min-h-[calc(100vh-56px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route (no layout) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes (with layout) */}
        <Route element={<LayoutWithSidebar />}>
          <Route
            path="/"
            element={
              <ProtectedRoute roles={["Admin", "Manager"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pos"
            element={
              <ProtectedRoute roles={["Admin", "Manager", "Cashier"]}>
                <PosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute roles={["Admin", "Manager"]}>
                <ProductsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/receipts"
            element={
              <ProtectedRoute roles={["Admin", "Manager", "Cashier"]}>
                <ReceiptsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/receipts/:receiptNo"
            element={
              <ProtectedRoute roles={["Admin", "Manager", "Cashier"]}>
                <ReceiptDetailsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
