import { useState } from "react";
import { loginUser } from "../../api/authApi";
import { Link } from "react-router-dom";
import AuthCard from "../../components/AuthCard";
import AuthInput from "../../components/AuthInput";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
    const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(form);
      localStorage.setItem("token", data.access_token);
      setMsg("✅ Login successful!");
    setTimeout(() => navigate("/chat"), 300);


      setForm({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      pill="WELCOME BACK"
      title="Login to your account"
      subtitle="Continue your chat journey 💬"
      footer={
        <p className="text-center text-sm text-white/70">
          Don’t have an account?{" "}
          <Link className="font-semibold text-indigo-300 hover:underline" to="/signup">
            Sign up
          </Link>
        </p>
      }
    >
      {msg && (
        <div className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {msg}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email"
          icon="📧"
          type="email"
          placeholder="xyz@gmail.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <AuthInput
          label="Password"
          icon="🔒"
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          right={
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="text-xs font-medium text-white/60 hover:text-white transition"
            >
              {showPass ? "HIDE" : "SHOW"}
            </button>
          }
        />

        <button
          disabled={loading}
          className="w-full rounded-2xl px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20
          bg-gradient-to-r from-fuchsia-500 to-indigo-500
          hover:brightness-110 hover:shadow-indigo-500/30 active:scale-[0.98] transition
          disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthCard>
  );
}
