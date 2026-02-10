// src/pages/chat/ChatHome.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFriends } from "../../api/friendsApi";
import ChatRoom from "./ChatRoom"; // we will create below
import { getOrCreateDmRoom } from "../../api/chatApi";

export default function ChatHome() {
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadFriends() {
    setLoading(true);
    try {
      const data = await getFriends();
      const list = Array.isArray(data) ? data : data?.items ?? [];
      setFriends(list);
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  }
  async function openChat(friend) {
  try {
    const { room_id } = await getOrCreateDmRoom(friend.id);
    setSelectedFriend({ ...friend, room_id });
  } catch (e) {
    alert(e?.response?.data?.detail || "Could not open chat");
  }
}

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(
      (f) =>
        (f.username || "").toLowerCase().includes(q) ||
        (f.email || "").toLowerCase().includes(q)
    );
  }, [friends, search]);

  return (
    <div className="h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-full max-w-sm border-r border-white/10 flex flex-col">
        {/* Top bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-sm text-white/60">Welcome</div>
            <div className="font-semibold">Chats</div>
          </div>

          <button
            onClick={() => navigate("/friends")}
            className="rounded-xl px-3 py-2 text-xs font-semibold text-white
            bg-gradient-to-r from-fuchsia-500 to-indigo-500
            hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-indigo-500/20"
          >
            + Add Friend
          </button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <span className="text-white/50">🔎</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search friends..."
              className="w-full bg-transparent text-white placeholder:text-white/40 outline-none"
            />
          </div>
        </div>

        {/* Friends list */}
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {loading && (
            <div className="p-3 text-sm text-white/60">Loading friends…</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="p-3 text-sm text-white/60">
              No friends found. Click <b>Add Friend</b> to send request.
            </div>
          )}

          {filtered.map((f) => {
            const active = selectedFriend?.id === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFriend(f)}
                className={`w-full text-left rounded-2xl px-3 py-3 mb-1 border transition ${
                  active
                    ? "border-indigo-400/40 bg-white/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-fuchsia-500/40 to-indigo-500/40 border border-white/10 flex items-center justify-center text-sm font-semibold">
                    {(f.username?.[0] || "U").toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold truncate">
                      {f.username || "User"}
                    </div>
                    <div className="text-xs text-white/60 truncate">
                      {f.email}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="p-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="text-xs text-white/60 hover:text-white"
          >
            Logout
          </button>

          <button
            onClick={loadFriends}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
          >
            Refresh
          </button>
        </div>
      </aside>

      {/* Chat panel */}
      <main className="flex-1 flex flex-col">
        {!selectedFriend ? (
          <div className="flex-1 flex items-center justify-center text-white/60">
            Select a friend to start chatting 💬
          </div>
        ) : (
          <ChatRoom friend={selectedFriend} />
        )}
      </main>
    </div>
  );
}
