const BASE_URL = "/api";

async function handle(res) {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export async function signupUser(payload) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handle(res);
}

export async function loginUser(payload) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handle(res);
}
