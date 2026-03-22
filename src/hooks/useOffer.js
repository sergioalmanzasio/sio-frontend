import { useState, useCallback } from "react";
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";


const useOffer = () => {
  const [offers, setOffers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("auth_token");

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

  const getAdminOffers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/offers/get-all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOffers(data.offers);
        return data.offers;
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message || "Error al obtener las ofertas",
        });
        return [];
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red al obtener las ofertas, inténtelo más tarde",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllBenefits = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/offers/get-all-benefits`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        return data.benefits || data.data || [];
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message || "Error al obtener los beneficios",
        });
        return [];
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/offers/get-all-categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        return data.categories || data.data || [];
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message || "Error al obtener las categorías",
        });
        return [];
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createOffer = useCallback(async (offerData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/offers/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(offerData),
      });
      const data = await response.json();
      if (response.ok || data.process === "success") {
        return { process: "success", data };
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message || "Error al crear la oferta",
        });
        return { process: "error", message: data.message };
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red",
      });
      return { process: "error" };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOffer = useCallback(async (id, offerData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/offers/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(offerData),
      });
      const data = await response.json();
      if (response.ok || data.process === "success") {
        return { process: "success", data };
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message || "Error al actualizar la oferta",
        });
        return { process: "error", message: data.message };
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red",
      });
      return { process: "error" };
    } finally {
      setLoading(false);
    }
  }, []);

  const getCompensationPlan = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/offer/compensation-offers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok || data.process === "success") {
        return data.data || [];
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message || "Error al obtener el plan de compensación",
        });
        return [];
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getOfferCommissionConfig = useCallback(async (offerId) => {
    setLoadingConfig(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/offers/commission-config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ offer_id: offerId }),
      });
      const data = await response.json();
      if (response.ok || data.process === "success") {
        return data.data || [];
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message || "Error al obtener la configuración de comisiones",
        });
        return null;
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red al obtener configuración",
      });
      return null;
    } finally {
      setLoadingConfig(false);
    }
  }, []);

  const updateOfferCommissionConfig = useCallback(async (configData) => {
    setLoadingConfig(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/offers/commission-config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(configData),
      });
      const data = await response.json();

      ToastAlert({
        position: "top",
        timer: 2500,
        icon: data.process === 'success' ? 'success' : (data.process === 'info' ? 'info' : 'error'),
        title: data.message || "Operación procesada",
      });
      return data;
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 2000,
        icon: "error",
        title: "Error de red al actualizar configuración",
      });
      return { process: "error" };
    } finally {
      setLoading(false);
    }
  }, []);

  return { offers, loading, loadingConfig, error, getOffers, getOffersByOperator, getOffersByService, getOffersByOperatorAndService, getAdminOffers, getAllBenefits, getAllCategories, createOffer, updateOffer, getCompensationPlan, getOfferCommissionConfig, updateOfferCommissionConfig };
};

export default useOffer;
