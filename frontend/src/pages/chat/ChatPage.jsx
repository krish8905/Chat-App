import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
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

    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${roomId}?token=${token}`;
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
      } catch {}
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h1 className="font-semibold">Global Chat</h1>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            connected
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-red-500/15 text-red-300"
          }`}
        >
          {statusText}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i}>
            {m.type === "system" ? (
              <div className="text-center text-xs text-white/60">{m.text}</div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">{m.sender}</div>
                <div className="mt-1">{m.text}</div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-white/10 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <button
          onClick={sendMessage}
          disabled={!connected}
          className="rounded-2xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-indigo-500
          hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
