import { useState, useCallback } from "react";
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";

const useBonus = () => {
 const [loading, setLoading] = useState(false);
 const token = localStorage.getItem("auth_token");

 const getBonusHistory = useCallback(async () => {
  setLoading(true);
  try {
   const response = await fetch(`${API_BASE_URL}/bonus/history`, {
    method: "GET",
    headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`,
    },
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
    headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`,
    },
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
    headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(bonusData),
   });
   const data = await response.json();
   if (response.ok) {
    ToastAlert({ position: "center", timer: 1800, icon: "success", title: "Bono actualizado exitosamente" });
    return { process: "success", data };
   } else {
    ToastAlert({ position: "center", timer: 2500, icon: data.process, title: data.message || "Error al actualizar bono" });
    return { process: "error" };
   }
  } catch (error) {
   ToastAlert({ position: "center", timer: 2500, icon: "error", title: "Error de red" });
   return { process: "error" };
  } finally {
   setLoading(false);
  }
 }, []);

 const getGeneratedBonuses = useCallback(async () => {
  setLoading(true);
  try {
   const response = await fetch(`${API_BASE_URL}/referral/get-bonus-generated`, {
    method: "GET",
    headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`,
    },
   });
   const data = await response.json();
   if (response.ok || data.process === "success") {
    return { process: "success", data, total_bonus: data.total_bonus };
   } else {
    if (data.process === "error") {
     ToastAlert({ position: "top", timer: 1800, icon: data.process, title: data.message || "Error al obtener bonos generados" });
    }
    return { process: "success", data };
   }
  } catch (error) {
   ToastAlert({ position: "top", timer: 1800, icon: "error", title: "Error de red" });
   return { process: "error" };
  } finally {
   setLoading(false);
  }
 }, []);

 const requestBonusPayment = useCallback(async (bonusTransactionTokens) => {
  setLoading(true);
  try {
   const response = await fetch(`${API_BASE_URL}/referral/request-payment-bonus`, {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ bonusTransactionTokens }),
   });
   const data = await response.json();
   if (response.ok || data.process === "success") {
    return { process: "success", data };
   } else {
    ToastAlert({ position: "top", timer: 1800, icon: "error", title: data.message || "Error al solicitar el pago de bono(s)" });
    return { process: "error" };
   }
  } catch (error) {
   ToastAlert({ position: "top", timer: 1800, icon: "error", title: "Error de red" });
   return { process: "error" };
  } finally {
   setLoading(false);
  }
 }, []);

 const getRequestedBonuses = useCallback(async () => {
  setLoading(true);
  try {
   const response = await fetch(`${API_BASE_URL}/bonus/requested-payment`, {
    method: "GET",
    headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`,
    },
   });
   const data = await response.json();
   if (response.ok || data.process === "success") {
    return { process: "success", data: data.data || [], totalBonus: data.totalBonus };
   } else {
    ToastAlert({ position: "top", timer: 1800, icon: "error", title: data.message || "Error al obtener solicitudes de bonos" });
    return { process: "error" };
   }
  } catch (error) {
   ToastAlert({ position: "top", timer: 1800, icon: "error", title: "Error de red" });
   return { process: "error" };
  } finally {
   setLoading(false);
  }
 }, []);

 const payBonuses = useCallback(async (bonusTransactionTokens) => {
  setLoading(true);
  try {

   const response = await fetch(`${API_BASE_URL}/bonus/paid`, {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
     bonusTransactionTokens
    }),
   });
   const data = await response.json();
   if (response.ok || data.process === "success") {
    return { process: "success", data };
   } else {
    ToastAlert({ position: "top", timer: 1800, icon: "error", title: data.message || "Error al registrar el pago de bono(s)" });
    return { process: "error" };
   }
  } catch (error) {
   ToastAlert({ position: "top", timer: 1800, icon: "error", title: "Error de red" });
   return { process: "error" };
  } finally {
   setLoading(false);
  }
 }, []);

 const getBonusesHistory = useCallback(async ({ status_name } = {}) => {
  setLoading(true);
  try {
   const params = new URLSearchParams();
   if (status_name && status_name !== "Todas") params.append("status_name", status_name);
   const response = await fetch(`${API_BASE_URL}/referral/bonuses/history/filter?${params.toString()}`, {
    method: "GET",
    headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`,
    },
   });
   const data = await response.json();
   if (response.ok || data.process === "success") {
    return { process: "success", data: data.data };
   } else {
    ToastAlert({ position: "top", timer: 1800, icon: "error", title: data.message || "Error al obtener historial de bonos" });
    return { process: "error" };
   }
  } catch (error) {
   ToastAlert({ position: "top", timer: 1800, icon: "error", title: "Error de red" });
   return { process: "error" };
  } finally {
   setLoading(false);
  }
 }, []);

 const getDetailedPaidBonuses = useCallback(async () => {
  setLoading(true);
  try {
   const response = await fetch(`${API_BASE_URL}/payments/detailed-paid-bonuses`, {
    method: "GET",
    headers: {
     "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`,
    },
   });
   const data = await response.json();
   if (response.ok || data.process === "success") {
    return { process: "success", data: data.data || [], total_amount: data.total_amount };
   } else {
    ToastAlert({ position: "top", timer: 1800, icon: "error", title: data.message || "Error al obtener bonos pagados" });
    return { process: "error" };
   }
  } catch (error) {
   ToastAlert({ position: "top", timer: 1800, icon: "error", title: "Error de red" });
   return { process: "error" };
  } finally {
   setLoading(false);
  }
 }, []);

 return { loading, getBonusHistory, createBonus, updateBonus, getGeneratedBonuses, requestBonusPayment, getRequestedBonuses, payBonuses, getBonusesHistory, getDetailedPaidBonuses };
};

export default useBonus;
