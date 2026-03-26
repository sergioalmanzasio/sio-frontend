import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { User, Phone, Mail, MapPin, IdCard, UserSearch, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { Input } from "../components/ui/input";
import Select from "../components/ui/select";
import usePerson from "../hooks/usePerson";
import useReferral from "../hooks/useReferral";
import { PrimaryButton } from "../components/ui/button";
import { getDocumentTypes, getDepartments, getCitiesByDepartmentId, getHousingTypes } from "../shared/utils";
import ToastAlert from "../components/alerts/ToastAlert";
import ModalAlertConfirm from "../components/alerts/ModalAlertConfirm";

const DOCUMENT_TYPES = getDocumentTypes();
const HOUSING_TYPES = getHousingTypes();

export default function CustomerReferencingPage() {
  const { validatePersonByDocument, loadingValidatePersonExistByDocument, addPersonByReferralCode, loadingAddPerson } = usePerson();
  const { addReferralExistCustomerByReferralCode, loadingReferralExistCustomer } = useReferral();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("referral-code");
  const navigate = useNavigate();

  useEffect(() => {
    
  }, [referralCode]);

  const [clientDocumentType, setClientDocumentType] = useState("");
  const [clientDocumentNumber, setClientDocumentNumber] = useState("");
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientHousingType, setClientHousingType] = useState("");
  const [clientObservations, setClientObservations] = useState("");
  const [clientDepartment, setClientDepartment] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientNeighborhood, setClientNeighborhood] = useState("");
  const [isValidateClient, setIsValidateClient] = useState(false);
  const [loadingAssignReferral, setLoadingAssignReferral] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [departmentCodeSelected, setDepartmentCodeSelected] = useState("");

  useEffect(() => {
    const loadDepartments = async () => {
      const depts = await getDepartments();
      setDepartments(depts);
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    if (!departmentCodeSelected) return;
    const loadCities = async () => {
      setCities([]);
      const citiesList = await getCitiesByDepartmentId(departmentCodeSelected);
      setCities(citiesList);
    };
    loadCities();
  }, [departmentCodeSelected]);

  const clearForm = () => {
    setClientDocumentType("");
    setClientDocumentNumber("");
    setClientFirstName("");
    setClientLastName("");
    setClientEmail("");
    setClientPhone("");
    setClientAddress("");
    setClientHousingType("");
    setClientObservations("");
    setClientDepartment("");
    setClientCity("");
    setClientNeighborhood("");
    setIsValidateClient(false);
    setDepartmentCodeSelected("");
    setCities([]);
  };

  const handleValidateDocument = async () => {
    const currentDocNumber = clientDocumentNumber;
    if (!currentDocNumber.trim()) {
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "info",
        title: "Por favor ingresa el número de documento.",
      });
      return;
    }

    const prevDocNumber = currentDocNumber;
    clearForm();
    setClientDocumentNumber(prevDocNumber);

    const response = await validatePersonByDocument({ document: currentDocNumber });

    if (response.process === "person-found") {
      ModalAlertConfirm({
        title: "Cliente encontrado",
        text: "Ya existe una persona registrada con este número de documento. Si deseas referenciarla, comunícate con un referido activo.",
        icon: "info",
        confirmText: "Entendido",
        isShowCancelButton: false,
        confirmCallback: () => {},
      });
      return;
    }

    if (response.process === "person-not-found") {
      setIsValidateClient(true);
    }
  };

  const handleDepartmentChange = (value) => {
    setClientDepartment(value);
    setClientCity("");
    setDepartmentCodeSelected("");
    setTimeout(() => {
      const dept = departments.find((d) => d.name === value);
      if (dept) setDepartmentCodeSelected(dept.id);
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !clientFirstName ||
      !clientLastName ||
      !clientEmail ||
      !clientPhone ||
      !clientDepartment ||
      !clientCity ||
      !clientAddress ||
      !clientHousingType ||
      !clientNeighborhood
    ) {
      ToastAlert({
        position: "center",
        timer: 1800,
        icon: "info",
        title: "Por favor completa todos los campos del cliente.",
      });
      return;
    }

    try {
      setLoadingAssignReferral(true);
      const addPersonResponse = await addPersonByReferralCode({
        document: clientDocumentNumber,
        document_type_acronym: clientDocumentType,
        name: clientFirstName,
        last_name: clientLastName,
        email: clientEmail,
        phone: clientPhone,
        department: clientDepartment,
        city: clientCity,
        neighborhood: clientNeighborhood,
        address: clientAddress,
        type_of_housing: clientHousingType,
        observations: clientObservations || "",
        referral_code: referralCode
      });

      if (addPersonResponse.process !== 'success') {
        setLoadingAssignReferral(false);
        return false;
      }

      const addReferralExistCustomerResponse = await addReferralExistCustomerByReferralCode({
        document_client: clientDocumentNumber,
        referral_code: referralCode,
      });

      if (addReferralExistCustomerResponse.process !== 'success') {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'error',
          title: addReferralExistCustomerResponse.message,
        });
        setLoadingAssignReferral(false);
        return false;
      }

      ToastAlert({
        position: 'center',
        timer: 2000,
        icon: 'success',
        title: 'La referenciación del cliente se ha realizado correctamente.',
      });
      setLoadingAssignReferral(false);
      setTimeout(() => {
        clearFormClientInfo();
        navigate('/');
      }, 1900);
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const clearFormClientInfo = () => {
    setClientDocumentType('');
    setClientDocumentNumber('');
    setClientFirstName('');
    setClientLastName('');
    setClientEmail('');
    setClientPhone('');
    setClientAddress('');
    setClientHousingType('');
    setClientObservations('');
    setClientDepartment('');
    setClientCity('');
    setClientNeighborhood('');
    setIsValidateClient(false);
    setDepartmentCodeSelected('');
    setCities([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Registro de cliente</h1>
          <p className="text-sm text-gray-500 mb-6">
            Completa el formulario y referénciate como un nuevo cliente.
          </p>

          {referralCode && (
            <div className="mb-6 inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-medium px-4 py-2 rounded-lg">
              <span>Código de referido:</span>
              <span className="font-bold tracking-wide">{referralCode}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                  <div className="md:col-span-3">
                    <Input
                      type="number"
                      value={clientDocumentNumber}
                      onChange={(e) =>
                        setClientDocumentNumber(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      placeholder="Número de documento"
                      icon={IdCard}
                      className="w-full h-12"
                    />
                  </div>
                  <div className="col-span-1 mb-2 md:mb-0 w-full md:w-auto">
                    <PrimaryButton
                      disabled={loadingValidatePersonExistByDocument}
                      type="button"
                      className="w-full md:w-auto h-14 flex items-center justify-center gap-2 px-6 text-sm"
                      onClick={handleValidateDocument}
                    >
                      {loadingValidatePersonExistByDocument ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <UserSearch />
                          <span className="inline md:hidden">Consultar</span>
                          <span className="hidden md:inline">Buscar</span>
                        </>
                      )}
                    </PrimaryButton>
                  </div>
                </div>
              </div>

              <Select
                options={DOCUMENT_TYPES.map((dt) => dt.label)}
                label="Tipo de documento"
                value={DOCUMENT_TYPES.find((dt) => dt.acronym === clientDocumentType)?.label || ""}
                onChange={(e) => {
                  const selected = DOCUMENT_TYPES.find((dt) => dt.label === e.target.value);
                  if (selected) setClientDocumentType(selected.acronym);
                }}
                disabled={!isValidateClient}
                className="w-full"
              />

              <Input
                type="text"
                value={clientFirstName}
                onChange={(e) =>
                  setClientFirstName(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))
                }
                placeholder="Nombre(s)"
                icon={User}
                disabled={!isValidateClient}
                className="w-full h-12"
              />

              <Input
                type="text"
                value={clientLastName}
                onChange={(e) =>
                  setClientLastName(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))
                }
                placeholder="Apellidos"
                icon={User}
                disabled={!isValidateClient}
                className="w-full h-12"
              />

              <Input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="Correo electrónico"
                icon={Mail}
                disabled={!isValidateClient}
                className="w-full h-12"
              />

              <Input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Teléfono"
                icon={Phone}
                disabled={!isValidateClient}
                className="w-full h-12"
              />

              <Select
                options={departments.map((d) => d.name)}
                label="Departamento"
                value={clientDepartment}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                disabled={!isValidateClient}
                className="w-full"
              />

              <Select
                options={
                  departmentCodeSelected
                    ? cities.map((c) => c.name)
                    : ["Obteniendo ciudades..."]
                }
                label="Ciudad"
                value={clientCity}
                onChange={(e) => setClientCity(e.target.value)}
                disabled={!isValidateClient || !departmentCodeSelected}
                className="w-full"
              />

              <div className="md:col-span-1">
                <Input
                  type="text"
                  value={clientNeighborhood}
                  onChange={(e) => setClientNeighborhood(e.target.value)}
                  placeholder="Barrio"
                  icon={MapPin}
                  disabled={!isValidateClient}
                  className="w-full h-12"
                />
              </div>

              <div className="md:col-span-1">
                <Input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Dirección"
                  icon={MapPin}
                  disabled={!isValidateClient}
                  className="w-full h-12"
                />
              </div>

              <div className="md:col-span-2">
                <Select
                  options={HOUSING_TYPES.map((ht) => ht.label)}
                  label="Tipo de vivienda"
                  value={clientHousingType}
                  onChange={(e) => setClientHousingType(e.target.value)}
                  disabled={!isValidateClient}
                  className="w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium text-gray-700 mb-1 ${
                    !isValidateClient ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Observaciones
                </label>
                <textarea
                  disabled={!isValidateClient}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base ${
                    !isValidateClient ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  rows="3"
                  value={clientObservations}
                  onChange={(e) => setClientObservations(e.target.value)}
                  placeholder="Información adicional..."
                />
              </div>
            </div>

            <div className="flex pt-4 gap-3">
              <PrimaryButton
                type="submit"
                disabled={!isValidateClient || loadingAddPerson || loadingReferralExistCustomer}
                className="btn-gradient shadow-none text-sm"
              >
                {loadingAddPerson || loadingReferralExistCustomer ? (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                    <span className="italic animate-pulse text-sm">Registrando...</span>
                  </div>
                ) : (
                  "Registrarme"
                )}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
