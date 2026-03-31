import { useState, useCallback } from "react";
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";

const useCategoryAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("auth_token");

  const getAllCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
          title: data.message || "Error al obtener las categorías",
        });
        return null;
      }
    } catch (err) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red al obtener las categorías, inténtelo más tarde",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getCategoryByToken = useCallback(
    async (categoryToken) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/admin/categories/${categoryToken}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          return data.data;
        } else {
          ToastAlert({
            position: "top",
            timer: 1800,
            icon: "error",
            title: data.message || "Error al obtener la categoría",
          });
          return null;
        }
      } catch (err) {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: "Error de red al obtener la categoría, inténtelo más tarde",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const createCategory = useCallback(
    async (categoryData) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/admin/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryData),
        });
        const data = await response.json();
        if (response.ok || data.process === "success") {
          return { process: "success", data };
        } else {
          ToastAlert({
            position: "top",
            timer: 1800,
            icon: "error",
            title: data.message || "Error al crear la categoría",
          });
          return { process: "error", message: data.message };
        }
      } catch (err) {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: "Error de red al crear la categoría",
        });
        return { process: "error" };
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const updateCategory = useCallback(
    async (categoryToken, categoryData) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/admin/categories/${categoryToken}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(categoryData),
          }
        );
        const data = await response.json();
        if (response.ok || data.process === "success") {
          return { process: "success", data };
        } else {
          ToastAlert({
            position: "top",
            timer: 1800,
            icon: "error",
            title: data.message || "Error al actualizar la categoría",
          });
          return { process: "error", message: data.message };
        }
      } catch (err) {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: "Error de red al actualizar la categoría",
        });
        return { process: "error" };
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return {
    loading,
    error,
    getAllCategories,
    getCategoryByToken,
    createCategory,
    updateCategory,
  };
};

export default useCategoryAdmin;
