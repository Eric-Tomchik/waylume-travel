export async function hasAdminSession() {
  try {
    const response = await fetch("/api/admin/session", { cache: "no-store", credentials: "same-origin" });
    if (!response.ok) return false;
    const data = await response.json();
    return data.authenticated === true;
  } catch {
    return false;
  }
}

export async function logoutAdminSession() {
  await fetch("/api/admin/session", { method: "DELETE", credentials: "same-origin" });
}
