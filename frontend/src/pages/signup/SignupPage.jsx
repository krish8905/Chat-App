import { useState } from "react";
import { signupUser } from "../../api/authApi";
import { Link } from "react-router-dom";
import ThemeSwitch from "../../theme/ThemeSwitch";
import { useTheme } from "../../theme/ThemeContext";

export default function SignupPage() {
  const { theme } = useTheme(); // ✅ this makes UI react to theme switch

  const [form, setForm] = useState({ username: "", email: "", password: "" });
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
      await signupUser(form);
      setMsg("✅ Account created successfully!");
      setForm({ username: "", email: "", password: "" });
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Theme based styles
  const styles =
    theme === "dark"
      ? {
          page: "bg-slate-950 text-white",
          card: "border-white/10 bg-white/5 backdrop-blur-xl",
          inputBox: "border-white/10 bg-white/5",
          label: "text-white/70",
          textMuted: "text-white/70",
          placeholder: "placeholder:text-white/40",
          icon: "text-white/60",
          inactiveBtn: "bg-white/5 text-white/70 border-white/10 hover:bg-white/10",
          blobs: true,
        }
      : theme === "light"
      ? {
          page: "bg-gradient-to-br from-slate-50 to-indigo-50 text-slate-900",
          card: "border-black/10 bg-white shadow-xl",
          inputBox: "border-slate-200 bg-slate-50",
          label: "text-slate-600",
          textMuted: "text-slate-600",
          placeholder: "placeholder:text-slate-400",
          icon: "text-slate-500",
          inactiveBtn: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
          blobs: false,
        }
      : {
          page: "bg-gradient-to-br from-emerald-50 to-slate-50 text-slate-900",
          card: "border-black/10 bg-white shadow-xl",
          inputBox: "border-slate-200 bg-slate-50",
          label: "text-slate-600",
          textMuted: "text-slate-600",
          placeholder: "placeholder:text-slate-400",
          icon: "text-slate-500",
          inactiveBtn: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
          blobs: false,
        };

  return (
    <div className={`min-h-screen relative flex items-center justify-center overflow-hidden px-4 ${styles.page}`}>
      {/* Blobs only for dark */}
      {styles.blobs && (
        <>
          <div className="pointer-events-none absolute -top-28 -left-28 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <div className="pointer-events-none absolute top-20 -right-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        </>
      )}

      <div className="w-full max-w-md">
        <div className={`relative rounded-3xl border p-8 overflow-hidden ${styles.card}`}>
          {/* Top pill */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <div className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-1 text-xs font-semibold text-white shadow-lg">
              NEW ACCOUNT
            </div>
          </div>

          {/* Theme buttons */}
          <div className="mt-6 flex justify-center">
            <ThemeSwitch />
          </div>

          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight">
            Create your account
          </h2>
          <p className={`mt-2 text-center text-sm ${styles.textMuted}`}>
            Join now and start chatting 💬
          </p>

          {msg && (
            <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
              {msg}
            </div>
          )}
          {error && (
            <div className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Username */}
            <div>
              <label className={`mb-1 block text-xs font-medium ${styles.label}`}>Username</label>
              <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3 transition ${styles.inputBox}`}>
                <span className={styles.icon}>👤</span>
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter Your Name"
                  className={`w-full bg-transparent outline-none ${styles.placeholder}`}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={`mb-1 block text-xs font-medium ${styles.label}`}>Email</label>
              <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3 transition ${styles.inputBox}`}>
                <span className={styles.icon}>📧</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="xyz@gmail.com"
                  className={`w-full bg-transparent outline-none ${styles.placeholder}`}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`mb-1 block text-xs font-medium ${styles.label}`}>Password</label>
              <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3 transition ${styles.inputBox}`}>
                <span className={styles.icon}>🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full bg-transparent outline-none ${styles.placeholder}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className={`${theme === "dark" ? "text-white/60 hover:text-white" : "text-slate-500 hover:text-slate-800"} text-xs font-medium transition`}
                >
                  {showPass ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Create button */}
            <button
              disabled={loading}
              className="mt-2 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20
              hover:brightness-110 hover:shadow-indigo-500/30 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create account"}
            </button>

            <p className={`pt-2 text-center text-sm ${styles.textMuted}`}>
              Already have an account?{" "}
              <Link className="font-semibold text-indigo-500 hover:underline" to="/login">
                Login
              </Link>
            </p>
          </form>
        </div>

        <p className={`mt-6 text-center text-xs ${theme === "dark" ? "text-white/40" : "text-slate-500"}`}>
          By signing up, you agree to our terms & privacy policy.
        </p>
      </div>
    </div>
  );
}
