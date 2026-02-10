export async function getMe() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://127.0.0.1:8000/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }
  return res.json();
}
