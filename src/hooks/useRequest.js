import { useState, useCallback } from "react"; // ⬅️ Importar useCallback
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";
import { useAuth } from "../context/AuthContext";
import { sessionExpiredToast } from "../shared/utils";


const useRequest = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingAddRequest, setLoadingAddRequest] = useState(false);
  const [loadingServiceRequestClient, setLoadingServiceRequestClient] = useState(false);
  const [loadingServiceRequestsByServiceCoordinator, setLoadingServiceRequestsByServiceCoordinator] = useState(false);
  const [loadingServiceRequestDetail, setLoadingServiceRequestDetail] = useState(false);
  const [loadingCancelServiceRequestClient, setLoadingCancelServiceRequestClient] = useState(false);
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
          sessionExpiredToast(
            logout, 
            () => {
              window.location.href = '/';
            }
          );
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
         sessionExpiredToast(
            logout, 
            () => {
              window.location.href = '/';
            }
          );
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

  const getServiceRequestByClient = useCallback(async (email, options = {}) => {
    setLoadingServiceRequestClient(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/request/client`, {
        ...options,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          sessionExpiredToast(
            logout, 
            () => {
              window.location.href = '/';
            }
          );
          return { process: 'session-expired' };
        }
        throw new Error(data.message || "Error en la solicitud");
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
      setLoadingServiceRequestClient(false);
    }
  }, []);

  const getServiceRequestDetailByID = useCallback(async (id) => {
    setLoadingServiceRequestDetail(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/request/details`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ service_request_id: id })
      });
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Tiempo de espera agotado, intente nuevamente o contáctese con soporte técnico.')), 5000);
      });
      
      const data = await Promise.race([
        response.json(),
        timeoutPromise
      ]);
      
      if (!response.ok) {
        if (response.status === 401) {
          sessionExpiredToast(
            logout, 
            () => {
              window.location.href = '/';
            }
          );
          return { process: 'session-expired' };
        }
        throw new Error(data.message || "Error en la solicitud");
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
      setLoadingServiceRequestDetail(false);
    }
  }, []);

  const cancelServiceRequestByClient = useCallback(async (id, email) => {
    setLoadingCancelServiceRequestClient(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/request/cancel-by-client`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          service_request_id: id,
          email
        })
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          sessionExpiredToast(
            logout, 
            () => {
              window.location.href = '/';
            }
          );
          return { process: 'session-expired' };
        }
        throw new Error(data.message || "Error en la solicitud");
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
      setLoadingCancelServiceRequestClient(false);
    }
  }, []);

  const getServiceRequestsByServiceCoordinator = useCallback(async (email, options = {}) => {
    setLoadingServiceRequestsByServiceCoordinator(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/request/service-coordinator`, {
        ...options,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          sessionExpiredToast(
            logout, 
            () => {
              window.location.href = '/';
            }
          );
          return { process: 'session-expired' };
        }
        throw new Error(data.message || "Error en la solicitud");
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
      setLoadingServiceRequestsByServiceCoordinator(false);
    }
  }, []);

  return { loading, loadingAddRequest, loadingServiceRequestClient, loadingServiceRequestsByServiceCoordinator, loadingServiceRequestDetail, loadingCancelServiceRequestClient, error, addServiceRequest, validateClienteRequestPending, getServiceRequestByClient, getServiceRequestDetailByID, cancelServiceRequestByClient, getServiceRequestsByServiceCoordinator };
};

export default useRequest;