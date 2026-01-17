import { NavLink } from "react-router-dom";
import { getAuth } from "../services/auth";

const linkClass = "block px-3 py-2 rounded hover:bg-slate-800 transition";
const activeClass = "bg-slate-800";

export default function Sidebar() {
  const auth = getAuth();
  const role = auth?.role;
  const isAdminOrManager = role === "Admin" || role === "Manager";

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">POS System</h2>
      <ul className="space-y-3">
        {isAdminOrManager && (
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
            >
              Dashboard
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/pos"
            className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
          >
            POS Billing
          </NavLink>
        </li>
        {isAdminOrManager && (
          <li>
            <NavLink
              to="/products"
              className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
            >
              Products
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/receipts"
            className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
          >
            Receipts
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
