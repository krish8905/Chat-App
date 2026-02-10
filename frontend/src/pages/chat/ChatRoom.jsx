// src/pages/chat/ChatRoom.jsx
export default function ChatRoom({ friend }) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-fuchsia-500/40 to-indigo-500/40 border border-white/10 flex items-center justify-center text-sm font-semibold">
          {(friend.username?.[0] || "U").toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="font-semibold truncate">{friend.username}</div>
          <div className="text-xs text-white/60 truncate">{friend.email}</div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 text-white/60">
        (Next) Here we will open a private chat room with {friend.username}.
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 flex gap-2">
        <input
          placeholder="Type a message..."
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <button
          className="rounded-2xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-indigo-500
          hover:brightness-110 active:scale-[0.98] transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
