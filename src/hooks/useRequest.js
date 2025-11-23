import { useState, useCallback } from "react"; // ⬅️ Importar useCallback
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";
import { useAuth } from "../context/AuthContext";

const useRequest = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingAddRequest, setLoadingAddRequest] = useState(false);
  const [error, setError] = useState(null);

  const addServiceRequest = useCallback(async (requestData, options = {}) => {
    setLoadingAddRequest(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/request/add`, {
        ...options,
        method: "POST",
        credentials: "include",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
         if (response.status === 401) {
          // Manejar el caso de sesión expirada
          ToastAlert({
            position: "top",
            timer: 2000,
            icon: "warning",
            title: "Su sesión ha expirado. Por favor, inicie sesión de nuevo.",
          });
          // Redirigir al login o manejar la expiración de sesión
          setTimeout(() => {
            logout();
            window.location.href = '/';
          }, 2000);
          return { process: 'session-expired' };
        }
        // throw new Error(data.message || "Error en la solicitud");
      }
      return data;
    } catch (err) {
      setError(err.message);
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: err.message || "Error de red, inténtelo más tarde",
      });
      throw err;
    } finally {
      setLoadingAddRequest(false);
    }
  }, []);

  const validateClienteRequestPending = useCallback(async (requestData, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/request/validate-pending-request`, {
        ...options,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: requestData.email,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          // Manejar el caso de sesión expirada
          ToastAlert({
            position: "top",
            timer: 2000,
            icon: "warning",
            title: "Su sesión ha expirado. Por favor, inicie sesión de nuevo.",
          });
          // Redirigir al login o manejar la expiración de sesión
          setTimeout(() => {
            logout();
            window.location.href = '/';
          }, 2000);
          return { process: 'session-expired' };
        }
        throw new Error(data.message || "Error en la solicitud");
      }
      return data;  
    } catch (err) {
      setError(err.message);
      ToastAlert({
        position: "center",
        timer: 5000,
        icon: "info",
        title: err.message || "Ya tiene una solicitud en proceso. No puede adquirir otra oferta hasta que se complete la actual.",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, loadingAddRequest, error, addServiceRequest, validateClienteRequestPending };
};

export default useRequest;