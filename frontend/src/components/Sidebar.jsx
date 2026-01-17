import { NavLink } from "react-router-dom";

const linkClass = "block px-3 py-2 rounded hover:bg-slate-800 transition";
const activeClass = "bg-slate-800";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">POS System</h2>
      <ul className="space-y-3">
        <li>Dashboard</li>
        <li>POS Billing</li>
        <li>Products</li>
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
