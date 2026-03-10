import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";

export default function ChatPage() {
  const { theme } = useTheme();
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [statusText, setStatusText] = useState("Connecting...");

  const wsRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const roomId = 1; // ✅ global room

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/chat/${roomId}?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setStatusText("Connected");
      console.log("WS OPEN:", wsUrl);
    };

    ws.onclose = (event) => {
      setConnected(false);
      console.log("WS CLOSED:", event.code, event.reason);

      if (event.code === 1008) {
        setStatusText("Auth Failed — Login again");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setStatusText("Disconnected");
      }
    };

    ws.onerror = (e) => {
      console.log("WS ERROR:", e);
      setStatusText("Connection error");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch { }
    };

    return () => ws.close();
  }, [navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setStatusText("Not connected");
      console.log("Cannot send. readyState:", ws?.readyState);
      return;
    }

    const trimmed = text.trim();
    if (!trimmed) return;

    // ✅ backend expects "text"
    ws.send(JSON.stringify({ text: trimmed }));
    setText("");
  }

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-[#f8fafc] text-slate-900"}`}>

      <div className={`px-6 py-4 flex items-center justify-between relative z-10 transition-colors ${theme === "dark" ? "bg-slate-900/80 border-b border-slate-800" : "bg-white/80 border-b border-slate-200"}`}>
        <h1 className="font-bold text-xl tracking-tight flex items-center gap-2">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={theme === "dark" ? "text-indigo-400" : "text-blue-600"}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          Global Chat
        </h1>
        <span
          className={`text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-md ${connected
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
            : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
            }`}
        >
          {statusText}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex w-full ${m.sender === localStorage.getItem("username") ? "justify-end" : "justify-start"}`}>
            {m.type === "system" ? (
              <div className="w-full text-center">
                <span className={`text-[11px] font-medium tracking-wider px-3 py-1 rounded-md ${theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-600"}`}>
                  {m.text}
                </span>
              </div>
            ) : (
              <div className={`rounded-xl p-3.5 w-fit max-w-[80%] shadow-sm ${m.sender === localStorage.getItem("username")
                ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-tr-sm shadow-blue-500/10"
                : theme === "dark"
                  ? "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700"
                  : "bg-white text-slate-800 rounded-tl-sm border border-slate-200 shadow-sm"
                }`}>
                {m.sender !== localStorage.getItem("username") && (
                  <div className={`text-xs font-semibold tracking-wide mb-1 ${theme === "dark" ? "text-indigo-300" : "text-blue-600"}`}>{m.sender}</div>
                )}
                <div className="text-[14px] leading-relaxed">{m.text}</div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={`p-4 flex gap-3 relative z-10 transition-colors ${theme === "dark" ? "bg-slate-900 border-t border-slate-800" : "bg-white border-t border-slate-200"}`}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className={`flex-1 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 transition-all text-[15px] ${theme === "dark"
            ? "bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:bg-slate-800/80"
            : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white"
            }`}
          disabled={!connected}
        />
        <button
          onClick={sendMessage}
          disabled={!connected}
          className="rounded-xl px-6 py-3 font-semibold text-white shadow-md shadow-blue-500/10
          bg-gradient-to-br from-indigo-600 to-blue-600
          hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}
