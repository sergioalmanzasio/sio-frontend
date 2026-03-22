import { useState, useEffect } from "react";
import { User, Phone, Mail, MapPin, IdCard, UserSearch, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import Select from "../ui/select";
import { PrimaryButton, SecondaryButton } from "../ui/button";
import usePerson from "../../hooks/usePerson";
import useReferral from "../../hooks/useReferral";
import { useAuth } from "../../context/AuthContext";
import ToastAlert from "../alerts/ToastAlert";
import ModalAlertConfirm from "../alerts/ModalAlertConfirm";
import { getDocumentTypes, getDepartments, getCitiesByDepartmentId, getHousingTypes } from "../../shared/utils";

const DOCUMENT_TYPES = getDocumentTypes();
const HOUSING_TYPES = getHousingTypes();

export default function AddClientForm({ onSuccess, onCancel, hasLegend = true }) {
  const { validatePersonByDocument, loadingValidatePersonExistByDocument, addPerson, loadingAddPerson } = usePerson();
  const { addReferralExistCustomer, loadingReferralExistCustomer } = useReferral();
  const { userData } = useAuth();

  // Form states
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
  const [isValidateClientDocumentNumber, setIsValidateClientDocumentNumber] = useState(false);
  const [loadingAssignReferral, setLoadingAssignReferral] = useState(false);
  
  // Validation state
  const [isValidateClient, setIsValidateClient] = useState(false);
  
  // Department/City management
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [departmentCodeSelected, setDepartmentCodeSelected] = useState("");

  // Load departments
  useEffect(() => {
    const loadDepartments = async () => {
      const depts = await getDepartments();
      setDepartments(depts);
    };
    loadDepartments();
  }, []);

  // Load cities when department changes
  useEffect(() => {
    if (!departmentCodeSelected || departmentCodeSelected === '') return;
    const loadCities = async () => {
      setCities([]);
      const citiesList = await getCitiesByDepartmentId(departmentCodeSelected);
      setCities(citiesList);
    };
    loadCities();
  }, [departmentCodeSelected]);

  // Clear form function
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

  // Handle validate client document number
  const handleValidateClientDocumentNumber = async () => {
    setIsValidateClient(false);
    const currentDocNumber = clientDocumentNumber;
    clearFormClientInfo();
    setClientDocumentNumber(currentDocNumber);
    setIsValidateClientDocumentNumber(true);
    
    if (currentDocNumber === '') {
      ToastAlert({
        position: 'center',
        timer: 1800,
        icon: 'info',
        title: 'Por favor ingresa el número de documento.',
      });
      return false;
    }
    
    const validatePersonByDocumentResponse = await validatePersonByDocument({ document: currentDocNumber });
    
    if (validatePersonByDocumentResponse.process === 'person-found') {
      setIsValidateClient(false);
      ModalAlertConfirm({
        title: 'Cliente encontrado',
        text: 'Hemos encontrado un cliente con el número de documento ingresado. ¿Deseas referenciarlo?',
        icon: 'info',
        confirmText: 'Referenciar',
        cancelText: 'Cancelar',
        isShowCancelButton: true,
        isAllowOutsideClick: false,
        confirmCallback: async () => {
          const result = await addReferralExistCustomer({
            document_client: currentDocNumber,
            email_user: userData.email,
          });
          if (result.process === 'success') {
            ToastAlert({
              position: 'center',
              timer: 2000,
              icon: 'success',
              title: 'Cliente asociado correctamente.',
            });
            clearFormClientInfo();
            onSuccess();
          }else if (result.process === 'error') {
            ToastAlert({
              position: 'center',
              timer: 2000,
              icon: 'error',
              title: result.message,
            });
          }
          
        },
        cancelCallback: () => setIsValidateClient(false),
      });
      return false;
    }
    
    if (validatePersonByDocumentResponse.process === 'person-not-found') {
      setIsValidateClient(true);
      return false;
    }
  };

  // Handle form submission
  const handleSubmitClient = async (e) => {
    e.preventDefault();
    
    if (!clientFirstName || !clientLastName || !clientEmail || !clientPhone || !clientDepartment || !clientCity || !clientAddress || !clientHousingType || !clientNeighborhood) {
      ToastAlert({
        position: 'center',
        timer: 1800,
        icon: 'info',
        title: 'Por favor completa todos los campos del cliente.'
      });
      return;
    }

    try {
      setLoadingAssignReferral(true);
      const addPersonResponse = await addPerson({
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
        observations: clientObservations,
        referral_email: userData.email
      });

      if (addPersonResponse.process !== 'success') {
        setLoadingAssignReferral(false);
        return false;
      }

      const addReferralExistCustomerResponse = await addReferralExistCustomer({
        document_client: clientDocumentNumber,
        email_user: userData.email,
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
      clearFormClientInfo();
      onSuccess();
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  // Handle department change
  const handleDepartmentChange = (value) => {
    setClientDepartment(value);
    setClientCity("");
    setDepartmentCodeSelected("");
    
    setTimeout(() => {
      const dept = departments.find(d => d.name === value);
      if (dept) {
        setDepartmentCodeSelected(dept.id);
      }
    }, 100);
  };

  return (
    <form onSubmit={handleSubmitClient} className="space-y-4 max-h-auto overflow-y-auto px-2 pb-4">
      {hasLegend && (
        <p className="text-justify text-gray-500 text-sm">
          Agrega un nuevo cliente referido completando el siguiente formulario.
        </p>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!hasLegend ? 'mt-4' : ''}`}>
        <div className="md:col-span-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            <div className="md:col-span-3">
              <Input 
                type="number" 
                value={clientDocumentNumber} 
                onChange={(e) => setClientDocumentNumber(e.target.value.replace(/[^0-9]/g, ''))} 
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
                onClick={() => handleValidateClientDocumentNumber()}
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
          options={DOCUMENT_TYPES.map((docType) => docType.label)} 
          label="Tipo de documento" 
          value={DOCUMENT_TYPES.find(dt => dt.acronym === clientDocumentType)?.label || ""}
          onChange={(e) => {
            const selected = DOCUMENT_TYPES.find((docType) => docType.label === e.target.value);
            if (selected) setClientDocumentType(selected.acronym);
          }} 
          disabled={!isValidateClient}
          className="w-full"
        />

        <Input 
          type="text" 
          value={clientFirstName} 
          onChange={(e) => setClientFirstName(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))} 
          placeholder="Nombre(s)" 
          icon={User} 
          disabled={!isValidateClient}
          className="w-full h-12"
        />
        
        <Input 
          type="text" 
          value={clientLastName} 
          onChange={(e) => setClientLastName(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))} 
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
          options={departments.map((department) => department.name)} 
          label="Departamento" 
          value={clientDepartment} 
          onChange={(e) => handleDepartmentChange(e.target.value)} 
          disabled={!isValidateClient}
          className="w-full"
        />
        
        <Select 
          options={departmentCodeSelected ? cities.map((city) => city.name) : ['Obteniendo ciudades...']} 
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
            options={HOUSING_TYPES.map((housingType) => housingType.label)} 
            label="Tipo de vivienda" 
            value={clientHousingType.label} 
            onChange={(e) => setClientHousingType(e.target.value)} 
            disabled={!isValidateClient}
            className="w-full"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className={isValidateClient ? 'block text-sm font-medium text-gray-700 mb-1' : 'block text-sm font-medium text-gray-700 mb-1 opacity-50 cursor-not-allowed'}>
            Observaciones
          </label>
          <textarea 
            disabled={!isValidateClient}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base ${!isValidateClient ? 'opacity-50 cursor-not-allowed' : ''}`}
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
          disabled={!isValidateClient || loadingAssignReferral} 
          className="btn-gradient shadow-none text-sm"
        >
          {loadingAssignReferral ? 
            <div className="flex items-center gap-2 cursor-pointer text-blue-900 justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              <span className="italic transition animate-pulse text-sm">Registrando...</span>
            </div>
          : 'Registrar'}
        </PrimaryButton>
        <SecondaryButton 
          onClick={onCancel} 
          type="button" 
          className="flex-1 cursor-pointer btn-cancel shadow-none"
        >
          Cancelar
        </SecondaryButton>
      </div>
    </form>
  );
}
