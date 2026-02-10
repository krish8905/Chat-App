import { useState } from "react";
import { signup, login } from "./api";

export default function AuthPage() {
  const [tab, setTab] = useState("signup"); // "signup" | "login"
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  async function submitSignup(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setError("");

    try {
      const data = await signup(signupForm);
      setMsg(`✅ Account created: ${data.username} (${data.email})`);
      setSignupForm({ username: "", email: "", password: "" });
      setTab("login");
    } catch (err) {
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function submitLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setError("");

    try {
      const data = await login(loginForm);
      localStorage.setItem("token", data.access_token);
      setMsg("✅ Logged in! Token saved in localStorage.");
      setLoginForm({ email: "", password: "" });
    } catch (err) {
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Chat App</h1>
            <p className="text-sm text-gray-500 mt-1">
              {tab === "signup"
                ? "Create an account to get started."
                : "Login to continue."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              onClick={() => {
                setTab("signup");
                setMsg("");
                setError("");
              }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                tab === "signup" ? "bg-white shadow-sm" : "text-gray-600"
              }`}
            >
              Signup
            </button>
            <button
              onClick={() => {
                setTab("login");
                setMsg("");
                setError("");
              }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                tab === "login" ? "bg-white shadow-sm" : "text-gray-600"
              }`}
            >
              Login
            </button>
          </div>

          {/* Alerts */}
          {msg && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {msg}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Forms */}
          {tab === "signup" ? (
            <form onSubmit={submitSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  value={signupForm.username}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, username: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="Enter Your Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="xyz@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, password: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                disabled={loading}
                className="w-full rounded-xl bg-black text-white py-3 text-sm font-semibold hover:bg-black/90 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>
          ) : (
            <form onSubmit={submitLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="xyz@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                disabled={loading}
                className="w-full rounded-xl bg-black text-white py-3 text-sm font-semibold hover:bg-black/90 disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("token");
                  setMsg("Token removed from localStorage.");
                  setError("");
                }}
                className="w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold hover:bg-gray-50"
              >
                Logout (remove token)
              </button>
            </form>
          )}

          <p className="text-xs text-gray-500 text-center mt-6">
            Token stored in <span className="font-medium">localStorage</span>
          </p>
        </div>
      </div>
    </div>
  );
}
