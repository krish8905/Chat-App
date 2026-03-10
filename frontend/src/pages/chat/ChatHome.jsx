// src/pages/chat/ChatHome.jsx
import { useEffect, useState, useMemo } from "react";
import { getFriends } from "../../api/friendsApi";
import ChatRoom from "./ChatRoom";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeSwitch from "../../theme/ThemeSwitch";
import { useTheme } from "../../theme/ThemeContext";
import { getOrCreateDmRoom } from "../../api/chatApi"; // Added this import back

export default function ChatHome() {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false); // Added loading state back
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadFriends();

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/chat/0?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "status") {
          setOnlineUsers((prev) => {
            const next = new Set(prev);
            if (data.status === "online") next.add(data.user_id);
            else next.delete(data.user_id);
            return next;
          });
        }
      } catch (e) {
        console.error("Parse error", e);
      }
    };

    return () => {
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run once on mount

  useEffect(() => {
    // If we came from FriendsPage via "Message" button, auto-select that friend
    if (location.state?.autoOpenFriend) {
      openChat(location.state.autoOpenFriend); // Use openChat to get room_id
      // clean up history state so a refresh doesn't auto-open again unless intended
      window.history.replaceState({}, document.title);
    }
  }, [location, friends]); // Added friends to dependency array to ensure it runs after friends are loaded

  async function loadFriends() {
    setLoading(true);
    try {
      const data = await getFriends();
      let list = Array.isArray(data) ? data : data?.items || [];
      setFriends(list);
    } catch (e) {
      console.error("Could not load friends:", e);
    } finally {
      setLoading(false);
    }
  }

  async function openChat(friend) {
    try {
      const { room_id } = await getOrCreateDmRoom(friend.id);
      setSelectedFriend({ ...friend, room_id });
    } catch (e) {
      alert(e.message || "Could not open chat");
    }
  }

  const filteredItems = useMemo(() => {
    if (!search.trim()) return friends;
    const lower = search.toLowerCase();
    return friends.filter(
      (f) =>
        (f.username || "").toLowerCase().includes(lower) ||
        (f.email || "").toLowerCase().includes(lower)
    );
  }, [friends, search]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  }

  return (
    <div className={`h-screen flex transition-colors duration-500 ${theme === "dark" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}>
      {/* Sidebar */}
      <aside className={`w-full max-w-[320px] flex flex-col border-r transition-colors ${theme === "dark" ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
        {/* Header */}
        <div className={`p-5 flex items-center justify-between border-b transition-colors ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`}>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/20 font-bold text-lg`}>
              C
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Chatify</h1>
              <p className={`text-xs font-medium ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                @{localStorage.getItem("username") || "user"}
              </p>
            </div>
          </div>
          <ThemeSwitch />
        </div>

        {/* Global/Friends nav */}
        <div className={`p-4 border-b flex gap-2 transition-colors ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`}>
          <button
            onClick={() => navigate("/chat-global")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${theme === "dark"
              ? "bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
              : "bg-slate-100/50 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
          >
            Global
          </button>
          <button
            onClick={() => navigate("/friends")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${theme === "dark"
              ? "bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
              : "bg-slate-100/50 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
          >
            Friends
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className={`flex items-center gap-2 rounded-lg px-4 py-2.5 transition-colors border ${theme === "dark" ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 focus-within:border-indigo-500/50 focus-within:bg-slate-800" : "bg-white border-slate-200 hover:bg-slate-50 focus-within:border-blue-500/30"}`}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className={`w-full bg-transparent outline-none text-sm font-medium ${theme === "dark" ? "placeholder:text-slate-500 text-slate-200" : "placeholder:text-slate-400 text-slate-800"}`}
              placeholder="Find friends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-2 scrollbar-hide">
          {loading && (
            <div className={`text-center py-8 text-sm font-medium ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
              Loading friends...
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className={`text-center py-8 text-sm font-medium ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
              {search ? "No friends found matching search." : "No friends yet. Add some!"}
            </div>
          )}

          {!loading && filteredItems.map((f) => {
            const isSelected = selectedFriend?.id === f.id;
            return (
              <button
                key={f.id}
                onClick={() => openChat(f)}
                className={`w-full flex items-center gap-4 rounded-xl p-3 text-left transition-all ${isSelected
                  ? theme === "dark" ? "bg-indigo-500/10 border border-indigo-500/20" : "bg-blue-50 border border-blue-100"
                  : theme === "dark" ? "hover:bg-slate-800/50 text-slate-300 border border-transparent" : "hover:bg-slate-50 text-slate-600 border border-transparent"
                  }`}
              >
                <div className="relative">
                  <div className={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${isSelected ? 'bg-gradient-to-br from-indigo-500 to-blue-500' : theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-slate-200 text-slate-600'}`}>
                    {(f.username?.[0] || "U").toUpperCase()}
                  </div>
                  {onlineUsers.has(f.id) && (
                    <span className={`absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 ${theme === 'dark' ? 'border-slate-900' : 'border-white'}`}></span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`font-semibold text-[15px] truncate ${isSelected ? (theme === 'dark' ? 'text-indigo-400' : 'text-blue-600') : ''}`}>
                    {f.username}
                  </div>
                  <div className={`text-xs truncate ${isSelected ? (theme === 'dark' ? 'text-indigo-400/70' : 'text-blue-500/70') : (theme === 'dark' ? 'text-slate-500' : 'text-slate-400')}`}>
                    {f.email}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer/Logout */}
        <div className={`p-4 border-t transition-colors ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`}>
          <button
            onClick={handleLogout}
            className={`w-full rounded-lg py-2.5 text-sm font-medium tracking-wide transition-all ${theme === "dark"
              ? "bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-600 hover:border-red-200"
              }`}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Chat panel */}
      <main className={`flex-1 flex flex-col relative overflow-hidden ${theme === "dark" ? "bg-[#0B0F19]" : "bg-white"}`}>
        {!selectedFriend ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 relative z-10 transition-colors">
            <div className={`h-16 w-16 mb-2 rounded-2xl flex items-center justify-center shadow-sm border ${theme === "dark" ? "bg-slate-800/50 border-slate-700 text-indigo-400" : "bg-white border-slate-200 text-blue-500"}`}>
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className={`font-semibold text-xl tracking-tight ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>Welcome to Chatify</div>
            <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>Select a conversation from the sidebar</div>
          </div>
        ) : (
          <ChatRoom friend={selectedFriend} />
        )}
      </main>
    </div>
  );
}
