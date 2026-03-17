// useSignin.js 

import { useState } from "react";
import ToastAlert from "../components/alerts/ToastAlert";
import { saveUserData, clearUserData } from "../shared/auth";
import { API_BASE_URL } from "../shared/constanst";

const useSignin = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  // Mover getDataForSession dentro de signin para mejor flujo
  const getDataForSession = async () => {
    // Eliminamos el setLoading(false) de aquí, lo dejamos en el bloque finally de signin
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/auth/session-data`, {
        method: "GET",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        }
      });
      const data = await response.json();

      if (response.ok) {
        saveUserData(data);
        return { success: true, data: data }; // Devuelve un objeto para indicar éxito
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message,
        });
        clearUserData();
        return { success: false }; // Devuelve fracaso
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error al obtener la sesión, inténtelo más tarde",
      });
      clearUserData();
      return { success: false }; // Devuelve fracaso
    }
  };


  const signin = async (formData) => {
    clearUserData();
    setLoading(true);
    let loginSuccessful = false; // Variable local para controlar el resultado del login

    try {
      const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("auth_token", data.token);
        const sessionResult = await getDataForSession();

        if (sessionResult.success) {
          setIsLogin(true); // <--- Este cambio de estado forzará la re-renderización.
          loginSuccessful = true;
        } else {
          // El error ya fue notificado dentro de getDataForSession
          clearUserData();
        }
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "info",
          title: data.message,
        });
        clearUserData();
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red al iniciar sesión, inténtelo más tarde",
      });
    } finally {
      setLoading(false);
      return loginSuccessful; // Devuelve un booleano
    }
  };

  return { loading, isLogin, signin };
};

export default useSignin;