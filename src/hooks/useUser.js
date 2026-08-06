import { useState, useCallback } from "react";
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";

const useUser = () => {

  const [userLoading, setUserLoading] = useState(false);
  const token = localStorage.getItem("auth_token");

  const getUsers = useCallback(async (page = 1, limit = 10, search = "") => {
    setUserLoading(true);
    try {
      const queryParams = new URLSearchParams({ page, limit, search }).toString();
      const response = await fetch(`${API_BASE_URL}/users?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok || data.process === "success") {
        return { process: "success", data: data.data || [], pagination: data.pagination };
      } else {
        ToastAlert({ position: "top", timer: 1800, icon: data.process, title: data.message || "Error al obtener usuarios" });
        return { process: "error" };
      }
    } catch (error) {
      ToastAlert({ position: "top", timer: 1800, icon: "error", title: "Error de red" });
      return { process: "error" };
    } finally {
      setUserLoading(false);
    }
  }, [token]);

  const updateUserStatus = useCallback(async (username, is_active) => {
    setUserLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ username, is_active }),
      });
      const data = await response.json();
      if (response.ok || data.process === "success") {
        return { process: "success", data };
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message || "Error al actualizar el estado del usuario",
        });
        return { process: "error", message: data.message };
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red al actualizar el estado del usuario",
      });
      return { process: "error" };
    } finally {
      setUserLoading(false);
    }
  }, [token]);

  return {
    getUsers,
    updateUserStatus,
    userLoading,
  };
};

export default useUser;