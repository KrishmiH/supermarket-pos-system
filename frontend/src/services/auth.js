const KEY = "pos_auth";

export function saveAuth(data) {
  // data: { token, username, role, expiresAtUtc }
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}

export function isLoggedIn() {
  const a = getAuth();
  return Boolean(a?.token);
}
