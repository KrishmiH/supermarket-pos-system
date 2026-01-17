import { useState } from "react";
import { api } from "../services/api";
import { saveAuth } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.login({ username, password });
      saveAuth(res);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold">POS Login</h1>
        <p className="text-slate-600 mt-1">Sign in to continue</p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form className="mt-5 space-y-3" onSubmit={handleLogin}>
          <div>
            <label className="text-xs text-slate-600">Username</label>
            <input
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Password</label>
            <input
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>

          <button
            className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white font-semibold disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="text-xs text-slate-500">
            Demo accounts:
            <div className="mt-1 font-mono">
              admin / Admin@123
              <br />
              cashier / Cashier@123
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
