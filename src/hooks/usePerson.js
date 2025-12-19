import { useState, useCallback } from "react";
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";

const usePerson = () => {

  const [loadingValidatePersonExistByDocument, setLoadingValidatePersonExistByDocument] = useState(false);
  const [errorValidatePersonExistByDocument, setErrorValidatePersonExistByDocument] = useState(null);
  const [loadingAddPerson, setLoadingAddPerson] = useState(false);
  const [errorAddPerson, setErrorAddPerson] = useState(null);

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

  return {
    validatePersonByDocument,
    loadingValidatePersonExistByDocument,
    errorValidatePersonExistByDocument,
    addPerson,
    loadingAddPerson,
    errorAddPerson,
  };
};

export default usePerson;