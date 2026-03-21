import { API_BASE_URL } from "../shared/constanst";

const tryRefreshToken = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return res.status === 200;
  } catch {
    return false;
  }
};

export const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    console.warn("Sesión expirada");

    const refreshed = await tryRefreshToken();

    if (refreshed) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    }

    window.location.href = "/login";
    return;
  }

  return response;
};