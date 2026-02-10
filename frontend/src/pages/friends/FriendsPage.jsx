// src/pages/friends/FriendsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "../../components/AuthCard";
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

  const [tab, setTab] = useState("friends");
  const [loading, setLoading] = useState(false);

  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const activeTab =
    "bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white border-transparent shadow-lg shadow-indigo-500/30";

  const idleTab =
    "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white";

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
    if (tab === "friends") return "No friends yet. Add someone 🙂";
    if (tab === "requests") return "No incoming requests.";
    return "";
  }, [tab]);

  async function onSendRequest(e) {
    e.preventDefault();

    try {
      await sendFriendRequest(email.trim());
      setMsg("✅ Friend request sent!");
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
      setMsg("✅ Request accepted!");
      await refreshAll();
      setTab("friends");
    } catch (e) {
      setError(e.message || "Failed to accept");
    }
  }

  async function onReject(id) {
    try {
      await rejectFriendRequest(id);
      setMsg("✅ Request rejected");
      await refreshAll();
    } catch (e) {
      setError(e.message || "Failed to reject");
    }
  }

  // ⭐ CLEAN CHAT NAVIGATION
  function openChat(friend) {
    navigate(`/chat/${friend.id}`, {
      state: {
        friendName: friend.username,
        friendEmail: friend.email,
      },
    });
  }
  <button
  onClick={() => openChat(f)}
  className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/15 active:scale-[0.98] transition"
>
  Message
</button>


  return (
    <AuthCard
      pill="FRIENDS"
      title="Your connections"
      subtitle="Add friends and start private chats 💬"
      footer={
        <div className="flex justify-between text-sm text-white/70">
          <Link to="/chat" className="text-indigo-300 hover:underline">
            ← Back to chat
          </Link>
          <button
            onClick={refreshAll}
            className="border border-white/10 bg-white/5 px-3 py-2 rounded-xl text-xs"
          >
            Refresh
          </button>
        </div>
      }
    >
      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <button
          onClick={() => setTab("friends")}
          className={cx(
            "rounded-2xl border px-3 py-2 text-sm font-semibold",
            tab === "friends" ? activeTab : idleTab
          )}
        >
          Friends ({countFriends})
        </button>

        <button
          onClick={() => setTab("requests")}
          className={cx(
            "rounded-2xl border px-3 py-2 text-sm font-semibold",
            tab === "requests" ? activeTab : idleTab
          )}
        >
          Requests ({countIncoming})
        </button>

        <button
          onClick={() => setTab("add")}
          className={cx(
            "rounded-2xl border px-3 py-2 text-sm font-semibold",
            tab === "add" ? activeTab : idleTab
          )}
        >
          Add
        </button>
      </div>

      {/* ADD FRIEND */}
      {tab === "add" && (
        <form onSubmit={onSendRequest} className="space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@gmail.com"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3"
            required
          />

          <button className="w-full rounded-2xl py-3 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white font-semibold">
            Send request
          </button>
        </form>
      )}

      {/* FRIEND LIST */}
      {tab === "friends" && (
        <div className="space-y-3">
          {countFriends === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white/70">
              {emptyText}
            </div>
          ) : (
            friends.map((f) => (
              <div
                key={f.id}
                className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <div>
                  <div className="text-white font-semibold">
                    {f.username}
                  </div>
                  <div className="text-xs text-white/60">{f.email}</div>
                </div>

                <button
                  onClick={() => openChat(f)}
                  className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 rounded-xl text-sm font-semibold text-white"
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
        <div className="space-y-3">
          {countIncoming === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white/70">
              {emptyText}
            </div>
          ) : (
            incoming.map((r) => (
              <div
                key={r.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="text-white font-semibold">
                      {r.from_username || r.from_email}
                    </div>
                    <div className="text-xs text-white/60">
                      {r.from_email}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onReject(r.id)}
                      className="px-3 py-2 rounded-xl border border-white/10 text-xs"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => onAccept(r.id)}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-xs text-white"
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
