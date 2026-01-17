import { NavLink } from "react-router-dom";
import { getAuth } from "../services/auth";
import { LayoutDashboard, ShoppingCart, Package, Receipt } from "lucide-react";

const linkBase =
  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition hover:bg-slate-800";
const active = "bg-slate-800";

export default function Sidebar() {
  const auth = getAuth();
  const role = auth?.role;

  const isAdminOrManager = role === "Admin" || role === "Manager";

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold">
          POS
        </div>
        <div>
          <div className="font-bold leading-tight">Supermarket POS</div>
          <div className="text-xs text-white/60">Inventory & Billing</div>
        </div>
      </div>

      <nav className="space-y-2">
        {isAdminOrManager && (
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
        )}

        <NavLink
          to="/pos"
          className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
        >
          <ShoppingCart size={18} />
          POS Billing
        </NavLink>

        {isAdminOrManager && (
          <NavLink
            to="/products"
            className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
          >
            <Package size={18} />
            Products
          </NavLink>
        )}

        <NavLink
          to="/receipts"
          className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
        >
          <Receipt size={18} />
          Receipts
        </NavLink>
      </nav>

      <div className="mt-6 pt-4 border-t border-white/10 text-xs text-white/60">
        Logged in as{" "}
        <span className="text-white/90 font-semibold">{auth?.username}</span>
        <span className="text-white/50"> · </span>
        <span className="text-white/80">{auth?.role}</span>
      </div>
    </div>
  );
}
