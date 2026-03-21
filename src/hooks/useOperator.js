// src/hooks/useOperator.js (Modificado)
import { useState, useCallback } from "react"; // ⬅️ Importar useCallback
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";

const useOperator = () => {
  const [operators, setOperators] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("auth_token");

  // 🔑 Envuelve la función con useCallback
  const getOperators = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/operator/All`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setOperators(data.data);
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message,
        });
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red al obtener los operadores, inténtelo más tarde",
      });
    } finally {
      setLoading(false);
    }
  }, []); // ⬅️ Array de dependencias vacío, ya que no depende de props o estados internos
  // (solo usa setters y constantes, que son estables).

  const getAdminOperators = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/operators`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        return data.data;
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message || "Error al obtener operadores",
        });
        return null;
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red al obtener los operadores, inténtelo más tarde",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOperator = useCallback(async (operatorData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/operators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(operatorData),
      });
      const data = await response.json();
      if (response.ok || data.process === "success") {
        return { process: "success", data };
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message || "Error al crear el operador",
        });
        return { process: "error", message: data.message };
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red al crear el operador",
      });
      return { process: "error" };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateOperator = useCallback(async (id, operatorData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/operators/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(operatorData),
      });
      const data = await response.json();
      if (response.ok || data.process === "success") {
        return { process: "success", data };
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message || "Error al actualizar el operador",
        });
        return { process: "error", message: data.message };
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red al actualizar el operador",
      });
      return { process: "error" };
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { operators, loading, error, getOperators, getAdminOperators, createOperator, updateOperator };
};

export default useOperator;