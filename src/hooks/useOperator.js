// src/hooks/useOperator.js (Modificado)
import { useState, useCallback } from "react"; // ⬅️ Importar useCallback
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";

const useOperator = () => {
  const [operators, setOperators] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return { operators, loading, error, getOperators };
};

export default useOperator;