import axios from "axios";

const BASE = "http://127.0.0.1:8000";

export async function getChatHistory(roomId, limit = 50, cursor = null) {
  const token = localStorage.getItem("token");

  let url = `http://127.0.0.1:8000/chat/history/${roomId}?limit=${limit}`;
  if (cursor !== null) {
    url += `&cursor=${cursor}`;
  }

  const res = await fetch(url, {
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
  const res = await fetch(`${API}/chat/dm/${friendId}`, {
    method: "POST",
    headers: authHeaders(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Failed to create DM room");
  return data; // expect: { room_id: number }
}

export async function uploadFile(file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API}/chat/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Failed to upload file");
  return data; // expect { url: string, filename: string, type: string }
}
