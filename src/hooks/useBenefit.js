import { useState, useCallback } from "react";
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";

const useBenefit = () => {
  const [benefits, setBenefits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("auth_token");

  const getBenefits = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/benefit/all-by-offer/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setBenefits(data.data);
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
        title: "Error de red al obtener los beneficios, inténtelo más tarde",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const getAdminBenefits = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/benefits`, {
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
          title: data.message || "Error al obtener beneficios",
        });
        return null;
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red al obtener los beneficios, inténtelo más tarde",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createBenefit = useCallback(async (benefitData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/benefits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(benefitData),
      });
      const data = await response.json();
      if (response.ok || data.process === "success") {
        return { process: "success", data };
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message || "Error al crear el beneficio",
        });
        return { process: "error", message: data.message };
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red al crear el beneficio",
      });
      return { process: "error" };
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateBenefit = useCallback(async (id, benefitData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/benefits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(benefitData),
      });
      const data = await response.json();
      if (response.ok || data.process === "success") {
        return { process: "success", data };
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message || "Error al actualizar el beneficio",
        });
        return { process: "error", message: data.message };
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red al actualizar el beneficio",
      });
      return { process: "error" };
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { benefits, loading, error, getBenefits, getAdminBenefits, createBenefit, updateBenefit };
};

export default useBenefit;
