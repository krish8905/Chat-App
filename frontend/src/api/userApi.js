export async function getMe() {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://${window.location.hostname}:8000/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }
  return res.json();
}
