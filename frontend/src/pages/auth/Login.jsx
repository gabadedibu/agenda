import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const role = await login(email, password);

      // redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "department_head") {
        navigate("/head");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Staff Login
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          Login to manage agendas
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mt-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-slate-950 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}