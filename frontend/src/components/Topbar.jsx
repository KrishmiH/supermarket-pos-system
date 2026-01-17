import { clearAuth, getAuth } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const auth = getAuth();
  const navigate = useNavigate();

  function logout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <div className="h-14 bg-white border-b flex items-center justify-end px-4 gap-3">
      <div className="text-sm text-slate-700">
        {auth ? (
          <>
            <span className="font-medium">{auth.username}</span>
            <span className="text-slate-400"> · </span>
            <span className="text-slate-600">{auth.role}</span>
          </>
        ) : (
          <span className="text-slate-500">Not signed in</span>
        )}
      </div>

      <button
        className="px-3 py-1.5 rounded-lg border text-sm hover:bg-slate-50"
        onClick={logout}
        type="button"
      >
        Logout
      </button>
    </div>
  );
}
