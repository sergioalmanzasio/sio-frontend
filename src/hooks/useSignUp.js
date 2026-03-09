import { useState, useCallback } from "react";
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";

const useSignUp = () => {

  const [loadingGenerateOTP, setLoadingGenerateOTP] = useState(false);
  const [errorGenerateOTP, setErrorGenerateOTP] = useState(null);
  const [loadingVerifyOTP, setLoadingVerifyOTP] = useState(false);
  const [errorVerifyOTP, setErrorVerifyOTP] = useState(null);
  const [loadingSignUp, setLoadingSignUp] = useState(false);
  const [errorSignUp, setErrorSignUp] = useState(null);

  const generateOTP = useCallback(async (requestData, options = {}) => {
    setLoadingGenerateOTP(true);
    setErrorGenerateOTP(null);
    try {
      const response = await fetch(`${API_BASE_URL}/signup/generate-code`, {
        ...options,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: requestData.email,
          document: requestData.document,
          name: requestData.name,
          phone: requestData.phone,

        }),
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
      setErrorGenerateOTP(err.message);
      ToastAlert({
        position: "center",
        timer: 4000,
        icon: "error",
        title: (err.message.includes('Failed to fetch') ? "Error de red, inténtelo más tarde" : err.message)
      });
      throw err;
    } finally {
      setLoadingGenerateOTP(false);
    }
  }, []);

  const verifyOTP = useCallback(async (requestData, options = {}) => {
    setLoadingVerifyOTP(true);
    setErrorVerifyOTP(null);
    try {
      const response = await fetch(`${API_BASE_URL}/signup/verify-code`, {
        ...options,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: requestData.email,
          code: requestData.code,

        }),
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
      setErrorVerifyOTP(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error de red, inténtelo más tarde",
      });
      throw err;
    } finally {
      setLoadingVerifyOTP(false);
    }
  }, []);

  const signUp = useCallback(async (requestData, options = {}) => {
    setLoadingSignUp(true);
    setErrorSignUp(null);
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        ...options,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document: requestData.document,
          document_type_acronym: requestData.document_type_acronym,
          name: requestData.name,
          middle_name: requestData.middle_name,
          last_name: requestData.last_name,
          email: requestData.email,
          phone: requestData.phone,
          password: requestData.password,
          roleName: requestData.roleName,
          bankName: requestData.bankName,
          accountNumber: requestData.accountNumber,
        }),
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
      setErrorSignUp(err.message);
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: err.message || "Error de red, inténtelo más tarde",
      });
      throw err;
    } finally {
      setLoadingSignUp(false);
    }
  }, []);

  return {
    generateOTP,
    loadingGenerateOTP,
    errorGenerateOTP,
    verifyOTP,
    loadingVerifyOTP,
    errorVerifyOTP,
    signUp,
    loadingSignUp,
    errorSignUp,
  };

};


export default useSignUp;




