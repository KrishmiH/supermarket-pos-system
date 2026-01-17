import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import DashboardPage from "./pages/DashboardPage";
import PosPage from "./pages/PosPage";
import ProductsPage from "./pages/ProductsPage";

import ReceiptsPage from "./pages/ReceiptsPage";
import ReceiptDetailsPage from "./pages/ReceiptDetailsPage";

function App() {
  return (
    <BrowserRouter>
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
          <div className="p-6 bg-slate-50 min-h-[calc(100vh-56px)]">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/pos" element={<PosPage />} />
              <Route path="/products" element={<ProductsPage />} />

              <Route path="/receipts" element={<ReceiptsPage />} />
              <Route path="/receipts/:receiptNo" element={<ReceiptDetailsPage />} />
            </Routes>
          </div>
      </div>
    </div>
  </BrowserRouter>
  );
}

export default App;
