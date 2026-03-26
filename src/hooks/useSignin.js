import { useState } from "react";
import ToastAlert from "../components/alerts/ToastAlert";
import { saveUserData, clearUserData } from "../shared/auth";
import { API_BASE_URL } from "../shared/constanst";

const useSignin = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const getDataForSession = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}/auth/session-data`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        }
      });
      const data = await response.json();

      if (response.ok) {
        saveUserData(data);
        return { success: true, data: data };
      } else {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: data.process,
          title: data.message,
        });
        clearUserData();
        return { success: false };
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "info",
        title: "Error al obtener la sesión, inténtelo más tarde",
      });
      clearUserData();
      return { success: false };
    }
  };


  const signin = async (formData) => {
    clearUserData();
    setLoading(true);
    let loginSuccessful = false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
        method: "POST",
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
          setIsLogin(true);
          loginSuccessful = true;
        } else {
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
      return loginSuccessful;
    }
  };

  return { loading, isLogin, signin };
};

export default useSignin;