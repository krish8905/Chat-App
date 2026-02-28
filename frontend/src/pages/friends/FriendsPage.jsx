// src/pages/friends/FriendsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "../../components/AuthCard";
import { useTheme } from "../../theme/ThemeContext";
import {
  acceptFriendRequest,
  getFriends,
  getIncomingRequests,
  rejectFriendRequest,
  sendFriendRequest,
} from "../../api/friendsApi";

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function FriendsPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [tab, setTab] = useState("friends");
  const [loading, setLoading] = useState(false);

  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const isDark = theme === "dark";

  const textPrimary = isDark ? "text-white" : "text-slate-900";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const textFaint = isDark ? "text-slate-500" : "text-slate-400";
  const boxBg = isDark ? "bg-slate-800 border-slate-700 shadow-md" : "bg-white border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] text-slate-900";
  const inputBg = isDark ? "bg-slate-900/50 border border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500" : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500";

  const activeTab =
    "bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-transparent shadow-md shadow-blue-500/10";

  const idleTab = isDark
    ? "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900";

  async function refreshAll() {
    setLoading(true);
    setMsg("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const [f, inc] = await Promise.all([
        getFriends(),
        getIncomingRequests(),
      ]);

      setFriends(Array.isArray(f) ? f : f?.items ?? []);
      setIncoming(Array.isArray(inc) ? inc : inc?.items ?? []);
    } catch (e) {
      setError(e.message || "Failed to load friends");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();
  }, []);

  const countFriends = friends.length;
  const countIncoming = incoming.length;

  const emptyText = useMemo(() => {
    if (tab === "friends") return "No friends here yet. Send some requests.";
    if (tab === "requests") return "You're all caught up! No new requests.";
    return "";
  }, [tab]);

  async function onSendRequest(e) {
    e.preventDefault();

    try {
      await sendFriendRequest(email.trim());
      setMsg("🎉 Request sent successfully!");
      setEmail("");
      await refreshAll();
      setTab("requests");
    } catch (e) {
      setError(e.message || "Failed to send request");
    }
  }

  async function onAccept(id) {
    try {
      await acceptFriendRequest(id);
      setMsg("🥳 New friend added!");
      await refreshAll();
      setTab("friends");
    } catch (e) {
      setError(e.message || "Failed to accept request");
    }
  }

  async function onReject(id) {
    try {
      await rejectFriendRequest(id);
      setMsg("Okay, request ignored. ✌️");
      await refreshAll();
    } catch (e) {
      setError(e.message || "Failed to reject request");
    }
  }

  // ⭐ CLEAN CHAT NAVIGATION
  function openChat(friend) {
    navigate("/chat", {
      state: {
        autoOpenFriend: friend,
      },
    });
  }
  return (
    <AuthCard
      pill="FRIEND ZONE"
      title="Your Crew"
      subtitle="Connect with friends and start chatting"
      footer={
        <div className={`flex justify-between items-center text-sm ${textMuted}`}>
          <Link to="/chat" className={`${isDark ? "text-indigo-400" : "text-blue-600"} font-semibold transition-colors hover:underline`}>
            ← Back to Chat
          </Link>
          <button
            onClick={refreshAll}
            className={`border px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${isDark ? "border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"}`}
          >
            Refresh
          </button>
        </div>
      }
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("friends")}
          className={cx(
            "flex-1 rounded-lg border px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300",
            tab === "friends" ? activeTab : idleTab
          )}
        >
          Friends ({countFriends})
        </button>

        <button
          onClick={() => setTab("requests")}
          className={cx(
            "flex-1 rounded-lg border px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300",
            tab === "requests" ? activeTab : idleTab
          )}
        >
          Requests ({countIncoming})
        </button>

        <button
          onClick={() => setTab("add")}
          className={cx(
            "flex-1 rounded-lg border px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300",
            tab === "add" ? activeTab : idleTab
          )}
        >
          Add New
        </button>
      </div>

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

      {/* ADD FRIEND */}
      {tab === "add" && (
        <form onSubmit={onSendRequest} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@email.com"
            className={`w-full rounded-xl px-4 py-3 outline-none transition-all font-medium text-base ${inputBg}`}
            required
          />

          <button className="w-full rounded-xl py-3.5 bg-gradient-to-br from-indigo-600 to-blue-600 text-white font-semibold shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 text-[15px]">
            Send Request
          </button>
        </form>
      )}

      {/* FRIEND LIST */}
      {tab === "friends" && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
          {countFriends === 0 ? (
            <div className={`border rounded-xl p-8 text-center font-medium text-[15px] ${boxBg} ${textMuted}`}>
              {emptyText}
            </div>
          ) : (
            friends.map((f) => (
              <div
                key={f.id}
                className={`flex justify-between items-center border rounded-xl p-3 px-4 transition-all duration-300 hover:scale-[1.01] ${boxBg}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${isDark ? 'bg-gradient-to-br from-indigo-500 to-blue-500' : 'bg-slate-200 text-slate-500'}`}>
                    {(f.username?.[0] || "U").toUpperCase()}
                  </div>
                  <div>
                    <div className={`font-semibold text-[15px] transition-colors ${textPrimary}`}>
                      {f.username}
                    </div>
                    <div className={`text-xs font-medium mt-0.5 ${textFaint}`}>{f.email}</div>
                  </div>
                </div>

                <button
                  onClick={() => openChat(f)}
                  className="bg-gradient-to-br from-indigo-600 to-blue-600 px-4 py-2 rounded-lg text-[13px] font-semibold text-white shadow-sm shadow-blue-500/10 hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.98] transition-all"
                >
                  Message
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* REQUESTS */}
      {tab === "requests" && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
          {countIncoming === 0 ? (
            <div className={`border rounded-xl p-8 text-center font-medium text-[15px] ${boxBg} ${textMuted}`}>
              {emptyText}
            </div>
          ) : (
            incoming.map((r) => (
              <div
                key={r.id}
                className={`border rounded-xl p-4 transition-all duration-300 ${boxBg}`}
              >
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${isDark ? 'bg-gradient-to-br from-indigo-500 to-blue-500' : 'bg-slate-200 text-slate-500'}`}>
                      {((r.from_username || r.from_email)?.[0] || "?").toUpperCase()}
                    </div>
                    <div>
                      <div className={`font-semibold text-[15px] transition-colors ${textPrimary}`}>
                        {r.from_username || r.from_email}
                      </div>
                      <div className={`text-xs font-medium mt-0.5 ${textFaint}`}>
                        {r.from_email}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onReject(r.id)}
                      className={`px-4 py-2 rounded-lg border text-[13px] font-semibold transition-all ${isDark ? "border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                    >
                      Ignore
                    </button>

                    <button
                      onClick={() => onAccept(r.id)}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-[13px] font-semibold text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-500 active:scale-[0.98] transition-all"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </AuthCard>
  );
}
