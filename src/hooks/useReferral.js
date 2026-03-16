import { useState, useCallback } from "react";
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";
import { sessionExpiredToast } from "../shared/utils";
import { useAuth } from "../context/AuthContext";

const useReferral = () => {

  const [loadingReferralExistCustomer, setLoadingReferralExistCustomer] = useState(false);
  const [errorReferralExistCustomer, setErrorReferralExistCustomer] = useState(null);
  const [loadingMyReferrals, setLoadingMyReferrals] = useState(false);
  const [errorMyReferrals, setErrorMyReferrals] = useState(null);
  const [loadingReferralByCoordinatorService, setLoadingReferralByCoordinatorService] = useState(false);
  const [errorReferralByCoordinatorService, setErrorReferralByCoordinatorService] = useState(null);
  const [loadingGetGeneralInfo, setLoadingGetGeneralInfo] = useState(false);
  const [errorGetGeneralInfo, setErrorGetGeneralInfo] = useState(null);
  const [loadingCalculateCommission, setLoadingCalculateCommission] = useState(false);
  const [errorCalculateCommission, setErrorCalculateCommission] = useState(null);
  const [loadingGetCommissionAvailable, setLoadingGetCommissionAvailable] = useState(false);
  const [errorGetCommissionAvailable, setErrorGetCommissionAvailable] = useState(null);
  const [loadingPayCommission, setLoadingPayCommission] = useState(false);
  const [errorPayCommission, setErrorPayCommission] = useState(null);
  const { logout } = useAuth();

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

  const referralByCoordinatorService = useCallback(async (requestData, options = {}) => {
    setLoadingReferralByCoordinatorService(true);
    setErrorReferralByCoordinatorService(null);
    try {
      const response = await fetch(`${API_BASE_URL}/referral/by-coordinator-services`, {
        ...options,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinator_service_email: requestData.email_user,
        }),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setErrorReferralByCoordinatorService(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error de red, inténtelo más tarde",
      });
      throw err;
    } finally {
      setLoadingReferralByCoordinatorService(false);
    }
  }, []);

  const getReferralGeneralInfo = useCallback(async (referralCode, options = {}) => {
    setLoadingGetGeneralInfo(true);
    setErrorGetGeneralInfo(null);
    try {
      const response = await fetch(`${API_BASE_URL}/referral/general-information`, {
        ...options,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referral_code: referralCode,
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
        throw new Error(data.message || "Error en la solicitud", { cause: data.process });
      }
      return data;
    } catch (err) {
      setErrorGetGeneralInfo(err.message);
      ToastAlert({
        position: "center",
        timer: err.cause === 'info' ? 2500 : 1800,
        icon: err.cause ?? "error",
        title: err.message || "Error de red, inténtelo más tarde",
      });
      throw err;
    } finally {
      setLoadingGetGeneralInfo(false);
    }
  }, []);

  const calculateCommission = useCallback(async (referralCode, options = {}) => {
    setLoadingCalculateCommission(true);
    setErrorCalculateCommission(null);
    try {
      const response = await fetch(`${API_BASE_URL}/referral/calculate-commission`, {
        ...options,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referral_code: referralCode,
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
      setErrorCalculateCommission(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error al calcular la comisión",
      });
      throw err;
    } finally {
      setLoadingCalculateCommission(false);
    }
  }, []);

  const getCommissionAvailable = useCallback(async (options = {}) => {
    setLoadingGetCommissionAvailable(true);
    setErrorGetCommissionAvailable(null);
    try {
      const response = await fetch(`${API_BASE_URL}/referral/get-commission-available`, {
        ...options,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
        throw new Error(data.message || "Error en la solicitud", { cause: data.process });
      }
      return data;
    } catch (err) {
      setErrorGetCommissionAvailable(err.message);
      ToastAlert({
        position: "center",
        timer: err.cause === 'error' ? 1800 : 2500,
        icon: err.cause ?? "error",
        title: err.message || "Error al obtener las comisiones",
      });
      throw err;
    } finally {
      setLoadingGetCommissionAvailable(false);
    }
  }, []);

  const [loadingGetTotalCommission, setLoadingGetTotalCommission] = useState(false);
  const [errorGetTotalCommission, setErrorGetTotalCommission] = useState(null);

  const getTotalCommission = useCallback(async (options = {}) => {
    setLoadingGetTotalCommission(true);
    setErrorGetTotalCommission(null);
    try {
      const response = await fetch(`${API_BASE_URL}/referral/get-total-commision`, {
        ...options,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
      setErrorGetTotalCommission(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error al obtener el total de comisiones",
      });
      throw err;
    } finally {
      setLoadingGetTotalCommission(false);
    }
  }, []);

  const [loadingRequestCommissionPayment, setLoadingRequestCommissionPayment] = useState(false);
  const [errorRequestCommissionPayment, setErrorRequestCommissionPayment] = useState(null);

  const requestCommissionPayment = useCallback(async (trackingCode, options = {}) => {
    setLoadingRequestCommissionPayment(true);
    setErrorRequestCommissionPayment(null);
    try {
      const response = await fetch(`${API_BASE_URL}/referral/request-payment-commission`, {
        ...options,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tracking_code: trackingCode }),
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
        return { process: 'error', message: data.message || 'Error en la solicitud' };
      }
      return data;
    } catch (err) {
      setErrorRequestCommissionPayment(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error al solicitar el pago",
      });
      return { process: 'error', message: err.message };
    } finally {
      setLoadingRequestCommissionPayment(false);
    }
  }, []);

  const [loadingGetPaymentRequirements, setLoadingGetPaymentRequirements] = useState(false);
  const [errorGetPaymentRequirements, setErrorGetPaymentRequirements] = useState(null);

  const getPaymentRequirements = useCallback(async (options = {}) => {
    setLoadingGetPaymentRequirements(true);
    setErrorGetPaymentRequirements(null);
    try {
      const response = await fetch(`${API_BASE_URL}/payments/requeriments`, {
        ...options,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
        return { process: 'error', message: data.message || 'Error al obtener pagos requeridos' };
      }
      return data;
    } catch (err) {
      setErrorGetPaymentRequirements(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error al obtener pagos requeridos",
      });
      return { process: 'error', message: err.message };
    } finally {
      setLoadingGetPaymentRequirements(false);
    }
  }, []);

  const payCommission = useCallback(async (commissionToken) => {
    setLoadingPayCommission(true);
    setErrorPayCommission(null);
    try {
      const response = await fetch(`${API_BASE_URL}/payments/paid-commission`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commissionToken }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          sessionExpiredToast(logout, () => window.location.href = '/');
          return { process: 'session-expired' };
        }
        return { process: 'error', message: data.message || 'Error al procesar pago' };
      }
      return data;
    } catch (err) {
      setErrorPayCommission(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error al procesar pago",
      });
      return { process: 'error', message: err.message };
    } finally {
      setLoadingPayCommission(false);
    }
  }, [logout]);

  const [loadingGetCommissionsHistory, setLoadingGetCommissionsHistory] = useState(false);
  const [errorGetCommissionsHistory, setErrorGetCommissionsHistory] = useState(null);

  const getCommissionsHistory = useCallback(async (options = { status_name: "Todas" }) => {
    setLoadingGetCommissionsHistory(true);
    setErrorGetCommissionsHistory(null);
    try {
      const response = await fetch(`${API_BASE_URL}/referral/commissions/history/filter?status_name=${options.status_name}`, {
        ...options,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
      setErrorGetCommissionsHistory(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error al obtener el historial de comisiones",
      });
      throw err;
    } finally {
      setLoadingGetCommissionsHistory(false);
    }
  }, []);

  const [loadingDetailedPaidCommissions, setLoadingDetailedPaidCommissions] = useState(false);
  const [errorDetailedPaidCommissions, setErrorDetailedPaidCommissions] = useState(null);

  const getDetailedPaidCommissions = useCallback(async (options = {}) => {
    setLoadingDetailedPaidCommissions(true);
    setErrorDetailedPaidCommissions(null);
    try {
      const response = await fetch(`${API_BASE_URL}/payments/detailed-paid-commissions`, {
        ...options,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
      setErrorDetailedPaidCommissions(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error al obtener el detalle de comisiones pagadas",
      });
      throw err;
    } finally {
      setLoadingDetailedPaidCommissions(false);
    }
  }, []);

  const [loadingAdminServiceRequests, setLoadingAdminServiceRequests] = useState(false);
  const [errorAdminServiceRequests, setErrorAdminServiceRequests] = useState(null);

  const getAdminServiceRequests = useCallback(async (options = {}) => {
    setLoadingAdminServiceRequests(true);
    setErrorAdminServiceRequests(null);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/service-requests`, {
        ...options,
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
      setErrorAdminServiceRequests(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error al obtener las solicitudes de servicio",
      });
      throw err;
    } finally {
      setLoadingAdminServiceRequests(false);
    }
  }, []);

  return {
    addReferralExistCustomer,
    loadingReferralExistCustomer,
    errorReferralExistCustomer,
    myReferrals,
    loadingMyReferrals,
    errorMyReferrals,
    referralByCoordinatorService,
    loadingReferralByCoordinatorService,
    errorReferralByCoordinatorService,
    getReferralGeneralInfo,
    loadingGetGeneralInfo,
    errorGetGeneralInfo,
    calculateCommission,
    loadingCalculateCommission,
    errorCalculateCommission,
    getCommissionAvailable,
    loadingGetCommissionAvailable,
    errorGetCommissionAvailable,
    getTotalCommission,
    loadingGetTotalCommission,
    errorGetTotalCommission,
    requestCommissionPayment,
    loadingRequestCommissionPayment,
    errorRequestCommissionPayment,
    getPaymentRequirements,
    loadingGetPaymentRequirements,
    errorGetPaymentRequirements,
    payCommission,
    loadingPayCommission,
    errorPayCommission,
    getCommissionsHistory,
    loadingGetCommissionsHistory,
    errorGetCommissionsHistory,
    getDetailedPaidCommissions,
    loadingDetailedPaidCommissions,
    errorDetailedPaidCommissions,
    getAdminServiceRequests,
    loadingAdminServiceRequests,
    errorAdminServiceRequests,
  };
};

export default useReferral; 