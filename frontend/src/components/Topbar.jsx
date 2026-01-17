import { clearAuth, getAuth } from "../services/auth";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { LogOut } from "lucide-react";

export default function Topbar() {
  const auth = getAuth();
  const navigate = useNavigate();

  function logout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
  <div className="h-14 px-5 border-b border-orange-200 bg-gradient-to-r from-[#fff7ed] to-[#ffedd5] flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-sm font-bold text-amber-950">Point of Sale</span>
        <span className="text-xs px-2 py-1 rounded-full bg-amber-200/60 text-amber-950 font-semibold border border-amber-300/60">
          Retail
        </span>
      </div>
    </div>

    <div className="flex items-center gap-3">
      {auth ? (
        <div className="text-sm text-orange-900">
          <span className="font-bold text-orange-900">{auth.username}</span>
          <span className="text-orange-700/60"> · </span>
          <span className="font-semibold text-orange-800">{auth.role}</span>
        </div>
      ) : (
        <div className="text-sm text-amber-900/70">Not signed in</div>
      )}

      <Button variant="secondary" onClick={logout} type="button">
        <LogOut size={16} />
        Logout
      </Button>
    </div>
  </div>
);
}
