import axios from "axios";

const BASE = "http://127.0.0.1:8000";

export async function getChatHistory(roomId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://127.0.0.1:8000/chat/history/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Failed to load chat history");
  }

  return res.json();
}


// src/api/chatApi.js
const API = "http://127.0.0.1:8000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ✅ backend should create/find a DM room for (me + friend_id)
export async function getOrCreateDmRoom(friendId) {
  const res = await fetch(`${API}/dm/rooms/${friendId}`, {
    method: "POST",
    headers: authHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Failed to create DM room");
  return data; // expect: { room_id: number }
}
