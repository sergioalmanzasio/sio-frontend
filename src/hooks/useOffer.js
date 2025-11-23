import { useState, useCallback } from "react"; // ⬅️ Importar useCallback
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";


const useOffer = () => {
  const [offers, setOffers] = useState(null); // ******** 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getOffers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/offer/All`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setOffers(data.data);
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
        title: "Error de red al obtener las ofertas, inténtelo más tarde",
      });
    } finally {
      setLoading(false);
    }
  }, []); // ⬅️ Array de dependencias vacío, ya que no depende de props o estados internos
  // (solo usa setters y constantes, que son estables).

  const getOffersByOperator = useCallback(async (operatorId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/offer/operator/${operatorId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setOffers(data.data);
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
        title: "Error de red al obtener las ofertas, inténtelo más tarde",
      });
    } finally {
      setLoading(false);
    }
  }, []); // ⬅️ Array de dependencias vacío, ya que no depende de props o estados internos
  // (solo usa setters y constantes, que son estables).

  const getOffersByService = useCallback(async (serviceId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/offer/service/${serviceId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setOffers(data.data);
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
        title: "Error de red al obtener las ofertas, inténtelo más tarde",
      });
    } finally {
      setLoading(false);
    }
  }, []); // ⬅️ Array de dependencias vacío, ya que no depende de props o estados internos
  // (solo usa setters y constantes, que son estables).

  const getOffersByOperatorAndService = useCallback(async (operatorId, serviceId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/offer/operator-service/${operatorId}/${serviceId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setOffers(data.data);
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
        title: "Error de red al obtener las ofertas, inténtelo más tarde",
      });
    } finally {
      setLoading(false);
    }
  }, []); // ⬅️ Array de dependencias vacío, ya que no depende de props o estados internos
  // (solo usa setters y constantes, que son estables).

  return { offers, loading, error, getOffers, getOffersByOperator, getOffersByService, getOffersByOperatorAndService };
};

export default useOffer;
