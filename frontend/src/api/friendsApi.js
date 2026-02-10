// src/api/friendsApi.js
const BASE_URL = "http://127.0.0.1:8000";

function authHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Missing token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function handle(res) {
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: text };
  }

  if (!res.ok) {
    const msg =
      data?.detail ||
      data?.message ||
      (Array.isArray(data) ? JSON.stringify(data) : "Request failed");
    throw new Error(msg);
  }
  return data;
}

// ✅ Get friends list
export async function getFriends() {
  const res = await fetch(`${BASE_URL}/friends`, {
    headers: authHeaders(),
  });
  return handle(res);
}

// ✅ Incoming requests
export async function getIncomingRequests() {
  const res = await fetch(`${BASE_URL}/friends/requests/incoming`, {
    headers: authHeaders(),
  });
  return handle(res);
}

// ✅ Outgoing requests (optional - if your backend has it)
export async function getOutgoingRequests() {
  const res = await fetch(`${BASE_URL}/friends/requests/outgoing`, {
    headers: authHeaders(),
  });
  return handle(res);
}

// ✅ Send request by email
export async function sendFriendRequest(email) {
  const res = await fetch(`${BASE_URL}/friends/request`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email }),
  });
  return handle(res);
}

// ✅ Accept request
export async function acceptFriendRequest(requestId) {
  const res = await fetch(`${BASE_URL}/friends/requests/${requestId}/accept`, {
    method: "POST",
    headers: authHeaders(),
  });
  return handle(res);
}

// ✅ Reject request
export async function rejectFriendRequest(requestId) {
  const res = await fetch(`${BASE_URL}/friends/requests/${requestId}/reject`, {
    method: "POST",
    headers: authHeaders(),
  });
  return handle(res);
}
