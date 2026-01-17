import { useState } from "react";
import { api } from "../services/api";
import { saveAuth } from "../services/auth";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { LogIn } from "lucide-react";

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
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold">POS Login</h1>
        <p className="text-slate-600 mt-1">Sign in to continue</p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form className="mt-5 space-y-3" onSubmit={handleLogin}>
          <div>
            <label className="text-xs text-slate-600 font-medium">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 font-medium">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1"
            />
          </div>

          <Button
            className="w-full"
            disabled={loading}
            type="submit"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Signing in..." : "Login"}
          </Button>

          <div className="text-xs text-slate-500">
            Demo accounts:
            <div className="mt-1 font-mono">
              admin / Admin@123
              <br />
              cashier / Cashier@123
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
