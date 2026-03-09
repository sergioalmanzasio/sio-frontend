import { useState, useCallback } from "react";
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";

const useBonus = () => {
 const [loading, setLoading] = useState(false);

 const getBonusHistory = useCallback(async () => {
  setLoading(true);
  try {
   const response = await fetch(`${API_BASE_URL}/bonus/history`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
   });
   const data = await response.json();
   if (response.ok) {
    return { process: "success", data: data.data || data };
   } else {
    ToastAlert({ position: "top", timer: 1800, icon: "error", title: data.message || "Error al obtener bonos" });
    return { process: "error" };
   }
  } catch (error) {
   ToastAlert({ position: "top", timer: 1800, icon: "error", title: "Error de red" });
   return { process: "error" };
  } finally {
   setLoading(false);
  }
 }, []);

 const createBonus = useCallback(async (bonusData) => {
  setLoading(true);
  try {
   const response = await fetch(`${API_BASE_URL}/bonus`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(bonusData),
   });
   const data = await response.json();
   if (response.ok) {
    ToastAlert({ position: "top", timer: 1800, icon: "success", title: "Bono creado exitosamente" });
    return { process: "success", data };
   } else {
    ToastAlert({ position: "top", timer: 1800, icon: "error", title: data.message || "Error al crear bono" });
    return { process: "error" };
   }
  } catch (error) {
   ToastAlert({ position: "top", timer: 1800, icon: "error", title: "Error de red" });
   return { process: "error" };
  } finally {
   setLoading(false);
  }
 }, []);

 const updateBonus = useCallback(async (id, bonusData) => {
  setLoading(true);
  try {
   const response = await fetch(`${API_BASE_URL}/bonus/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(bonusData),
   });
   const data = await response.json();
   if (response.ok) {
    ToastAlert({ position: "top", timer: 1800, icon: "success", title: "Bono actualizado exitosamente" });
    return { process: "success", data };
   } else {
    ToastAlert({ position: "bottom", timer: 2000, icon: data.process, title: data.message || "Error al actualizar bono" });
    return { process: "error" };
   }
  } catch (error) {
   ToastAlert({ position: "top", timer: 2000, icon: "error", title: "Error de red" });
   return { process: "error" };
  } finally {
   setLoading(false);
  }
 }, []);

 return { loading, getBonusHistory, createBonus, updateBonus };
};

export default useBonus;
