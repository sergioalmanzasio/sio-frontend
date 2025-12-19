import { useState, useCallback } from "react";
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";

const useReferral = () => {

  const [loadingReferralExistCustomer, setLoadingReferralExistCustomer] = useState(false);
  const [errorReferralExistCustomer, setErrorReferralExistCustomer] = useState(null);
  const [loadingMyReferrals, setLoadingMyReferrals] = useState(false);
  const [errorMyReferrals, setErrorMyReferrals] = useState(null);

  const addReferralExistCustomer = useCallback(async (requestData, options = {}) => {
    setLoadingReferralExistCustomer(true);
    setErrorReferralExistCustomer(null);
    try {
      const response = await fetch(`${API_BASE_URL}/referral/create-referred-exist-customer`, {
        ...options,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referral_email: requestData.email_user,
          client_document: requestData.document_client,
        }),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setErrorReferralExistCustomer(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error de red, inténtelo más tarde",
      });
      throw err;
    } finally {
      setLoadingReferralExistCustomer(false);
    }
  }, []);

  const myReferrals = useCallback(async (requestData, options = {}) => {
    setLoadingMyReferrals(true);
    setErrorMyReferrals(null);
    try {
      const response = await fetch(`${API_BASE_URL}/referral/my-referrals`, {
        ...options,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referral_email: requestData.email,
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
      setErrorReferralExistCustomer(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error de red, inténtelo más tarde",
      });
      throw err;
    } finally {
      setLoadingMyReferrals(false);
    }
  }, []);

  return {
    addReferralExistCustomer,
    loadingReferralExistCustomer,
    errorReferralExistCustomer,
    myReferrals,
    loadingMyReferrals,
    errorMyReferrals,
  };
};

export default useReferral; 