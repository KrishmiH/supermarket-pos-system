import { NavLink } from "react-router-dom";
import { getAuth } from "../services/auth";
import { LayoutDashboard, ShoppingCart, Package, Receipt } from "lucide-react";

const linkBase =
  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition hover:bg-orange-800/60";
const active =
  "bg-orange-800/70 ring-1 ring-orange-400/40";;

export default function Sidebar() {
  const auth = getAuth();
  const role = auth?.role;

  const isAdminOrManager = role === "Admin" || role === "Manager";

  return (
    <div className="w-72 min-h-screen p-5 text-orange-50 bg-[#7c2d12]">
      <div className="flex items-center gap-3 mb-7">
        <div className="h-11 w-11 rounded-2xl bg-orange-800/70 ring-1 ring-orange-400/40 flex items-center justify-center font-extrabold">
          POS
        </div>
        <div>
          <div className="font-extrabold text-white leading-tight">
            Supermarket POS
          </div>
          <div className="text-xs text-orange-200">
            Billing • Inventory • Receipts
          </div>
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
