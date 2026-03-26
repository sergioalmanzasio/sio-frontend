import { useState, useCallback } from "react";
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";

const usePerson = () => {

  const [loadingValidatePersonExistByDocument, setLoadingValidatePersonExistByDocument] = useState(false);
  const [errorValidatePersonExistByDocument, setErrorValidatePersonExistByDocument] = useState(null);
  const [loadingAddPerson, setLoadingAddPerson] = useState(false);
  const [errorAddPerson, setErrorAddPerson] = useState(null);
  const [loadingGetPersonInfo, setLoadingGetPersonInfo] = useState(false);
  const [errorGetPersonInfo, setErrorGetPersonInfo] = useState(null);
  const [loadingUpdatePersonInfo, setLoadingUpdatePersonInfo] = useState(false);
  const [errorUpdatePersonInfo, setErrorUpdatePersonInfo] = useState(null);
  const [loadingUpdateBankInfo, setLoadingUpdateBankInfo] = useState(false);
  const [errorUpdateBankInfo, setErrorUpdateBankInfo] = useState(null);
  const [loadingUpdateLocationInfo, setLoadingUpdateLocationInfo] = useState(false);
  const [errorUpdateLocationInfo, setErrorUpdateLocationInfo] = useState(null);
  const token = localStorage.getItem("auth_token");

  const addPerson = useCallback(async (requestData, options = {}) => {
    setLoadingAddPerson(true);
    setErrorAddPerson(null);
    try {
      const response = await fetch(`${API_BASE_URL}/person/create-person-by-referral`, {
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
          department: requestData.department,
          city: requestData.city,
          neighborhood: requestData.neighborhood,
          address: requestData.address,
          type_of_housing: requestData.type_of_housing,
          observations: requestData.observations,
          referral_email: requestData.referral_email
        }),
      });
      const data = await response.json();

      return data;
    } catch (err) {
      setErrorAddPerson(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error de red, inténtelo más tarde",
      });
      throw err;
    } finally {
      setLoadingAddPerson(false);
    }
  }, []);

  const addPersonByReferralCode = useCallback(async (requestData, options = {}) => {
    setLoadingAddPerson(true);
    setErrorAddPerson(null);
    try {
      const response = await fetch(`${API_BASE_URL}/person/create-person-by-referral-code`, {
        ...options,
        method: "POST",
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
          department: requestData.department,
          city: requestData.city,
          neighborhood: requestData.neighborhood,
          address: requestData.address,
          type_of_housing: requestData.type_of_housing,
          observations: requestData.observations,
          referral_code: requestData.referral_code
        }),
      });
      const data = await response.json();

      return data;
    } catch (err) {
      setErrorAddPerson(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error de red, inténtelo más tarde",
      });
      throw err;
    } finally {
      setLoadingAddPerson(false);
    }
  }, []);

  const addClient = useCallback(async (requestData, options = {}) => {
    setLoadingAddPerson(true);
    setErrorAddPerson(null);
    try {
      const response = await fetch(`${API_BASE_URL}/person/create-person`, {
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
          department: requestData.department,
          city: requestData.city,
          neighborhood: requestData.neighborhood,
          address: requestData.address,
          type_of_housing: requestData.type_of_housing,
          observations: requestData.observations
        }),
      });
      const data = await response.json();

      return data;
    } catch (err) {
      setErrorAddPerson(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error de red, inténtelo más tarde",
      });
      throw err;
    } finally {
      setLoadingAddPerson(false);
    }
  }, []);

  const validatePersonByDocument = useCallback(async (requestData, options = {}) => {
    setLoadingValidatePersonExistByDocument(true);
    setErrorValidatePersonExistByDocument(null);
    try {
      const response = await fetch(`${API_BASE_URL}/person/validate-exist-by-document`, {
        ...options,
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document: requestData.document,
        }),
      });
      const data = await response.json();

      return data;
    } catch (err) {
      setErrorValidatePersonExistByDocument(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error de red, inténtelo más tarde",
      });
      throw err;
    } finally {
      setLoadingValidatePersonExistByDocument(false);
    }
  }, []);

  const getPersonInfo = useCallback(async (email, options = {}) => {
    setLoadingGetPersonInfo(true);
    setErrorGetPersonInfo(null);
    try {
      // Assuming GET request with query param based on "recibe como parametro el correo"
      // If it requires POST, I will change method to POST and body to JSON.stringify({ email })
      const response = await fetch(`${API_BASE_URL}/person/info`, {
        ...options,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await response.json();

      return data;
    } catch (err) {
      setErrorGetPersonInfo(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error de red al obtener información del usuario",
      });
      throw err;
    } finally {
      setLoadingGetPersonInfo(false);
    }
  }, []);

  const updatePersonInfo = useCallback(async (requestData, options = {}) => {
    setLoadingUpdatePersonInfo(true);
    setErrorUpdatePersonInfo(null);
    try {
      const response = await fetch(`${API_BASE_URL}/person/info`, {
        ...options,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: requestData.email,
          documentTypeName: requestData.documentTypeName,
          documentNumber: requestData.documentNumber,
          name: requestData.name,
          middleName: requestData.middleName,
          lastName: requestData.lastNameOne + (requestData.lastNameTwo == '' ? '' : ' ' + requestData.lastNameTwo),
          phone: requestData.phone,
        }),
      });
      const data = await response.json();
      return data;
    } catch (err) {
      setErrorUpdatePersonInfo(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error al actualizar información personal",
      });
      throw err;
    } finally {
      setLoadingUpdatePersonInfo(false);
    }
  }, []);

  const updateBankInfo = useCallback(async (requestData, options = {}) => {
    setLoadingUpdateBankInfo(true);
    setErrorUpdateBankInfo(null);
    try {
      const response = await fetch(`${API_BASE_URL}/person/bank-info`, {
        ...options,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: requestData.email,
          bankName: requestData.bankName,
          accountNumber: requestData.accountNumber,
        }),
      });
      const data = await response.json();

      return data;
    } catch (err) {
      setErrorUpdateBankInfo(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error al actualizar información bancaria",
      });
      throw err;
    } finally {
      setLoadingUpdateBankInfo(false);
    }
  }, []);

  const updateLocationInfo = useCallback(async (requestData, options = {}) => {
    setLoadingUpdateLocationInfo(true);
    setErrorUpdateLocationInfo(null);
    try {
      const response = await fetch(`${API_BASE_URL}/person/location-info`, {
        ...options,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: requestData.email,
          department: requestData.department,
          city: requestData.city,
          neighborhood: requestData.neighborhood,
          address: requestData.address,
          type_of_housing: requestData.type_of_housing,
        }),
      });
      const data = await response.json();

      return data;
    } catch (err) {
      setErrorUpdateLocationInfo(err.message);
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "error",
        title: err.message || "Error al actualizar información de ubicación",
      });
      throw err;
    } finally {
      setLoadingUpdateLocationInfo(false);
    }
  }, []);

  return {
    validatePersonByDocument,
    loadingValidatePersonExistByDocument,
    errorValidatePersonExistByDocument,
    addPerson,
    addPersonByReferralCode,
    loadingAddPerson,
    errorAddPerson,
    addClient,
    getPersonInfo,
    loadingGetPersonInfo,
    errorGetPersonInfo,
    updatePersonInfo,
    loadingUpdatePersonInfo,
    errorUpdatePersonInfo,
    updateBankInfo,
    loadingUpdateBankInfo,
    errorUpdateBankInfo,
    updateLocationInfo,
    loadingUpdateLocationInfo,
    errorUpdateLocationInfo,
  };
};

export default usePerson;