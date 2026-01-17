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
    <div className="h-14 bg-white border-b flex items-center justify-between px-4">
      <div className="text-sm text-slate-600">
        {auth ? (
          <>
            <span className="font-semibold text-slate-800">{auth.username}</span>
            <span className="text-slate-400"> · </span>
            <span>{auth.role}</span>
          </>
        ) : (
          "Not signed in"
        )}
      </div>

      <Button variant="secondary" onClick={logout} type="button">
        <LogOut size={16} />
        Logout
      </Button>
    </div>
  );
}
