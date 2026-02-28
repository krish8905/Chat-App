import { useState } from "react";
import { loginUser } from "../../api/authApi";
import { Link } from "react-router-dom";
import AuthCard from "../../components/AuthCard";
import AuthInput from "../../components/AuthInput";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

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

      // Fetch the username immediately following login to store for ChatRoom comparisons
      try {
        const meRes = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
        const user = await meRes.json();
        if (user && user.username) {
          localStorage.setItem("username", user.username);
        }
      } catch (e) {
        console.error("Could not fetch user details", e);
      }

      setMsg("🎉 Welcome back! Let's chat!");
      setTimeout(() => navigate("/chat"), 300);

      setForm({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "Oops! Check your details again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      pill="WELCOME BACK"
      title="Login to Chatify"
      subtitle="Jump right back into your conversations"
      footer={
        <p className={`text-center text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
          New here?{" "}
          <Link className={`font-semibold hover:underline transition-colors ${theme === "dark" ? "text-indigo-400 hover:text-indigo-300" : "text-blue-600 hover:text-blue-700"}`} to="/signup">
            Create an account
          </Link>
        </p>
      }
    >
      {msg && (
        <div className="mb-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-bold text-emerald-500 backdrop-blur-md">
          {msg}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-2xl border-2 border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-bold text-red-500 backdrop-blur-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email Address"
          icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>}
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <AuthInput
          label="Password"
          icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>}
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          right={
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className={`text-[12px] uppercase tracking-wider font-bold transition-colors ${theme === "dark" ? "text-slate-400 hover:text-indigo-400" : "text-slate-500 hover:text-blue-600"}`}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          }
        />

        <button
          disabled={loading}
          className="mt-6 w-full rounded-xl px-4 py-3.5 font-semibold text-white shadow-md shadow-blue-500/10
          bg-gradient-to-br from-indigo-600 to-blue-600
          hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all duration-300
          disabled:opacity-60 disabled:cursor-not-allowed text-base"
        >
          {loading ? "Logging in..." : "Let's Go!"}
        </button>
      </form>
    </AuthCard>
  );
}
