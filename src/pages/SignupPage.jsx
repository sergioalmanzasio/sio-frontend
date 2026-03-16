import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Lock, Building, CreditCard, MapPin, Home, IdCard, UserSearch, ScanSearch, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import TransversalHeader from '../components/header/TransversalHeader';
import { PrimaryButton, SecondaryButton } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Select from '../components/ui/select';
import ToastAlert from '../components/alerts/ToastAlert';
import ModalAlertConfirm from '../components/alerts/ModalAlertConfirm';
import InlineAlert from '../components/alert/InlineAlert';
import BottomModal from '../components/modals/BottomModal';
import OTPInput from '../components/ui/OTPInput';
import { getRolesToSignUp, getDocumentTypes } from '../shared/utils';
import useSignUp  from '../hooks/useSignUp';
import usePerson from '../hooks/usePerson';
import useReferral from '../hooks/useReferral';
import FullScreenLoader from '../components/ui/FullScreenLoader';
import { getDepartments, getCitiesByDepartmentId, getBanks } from '../shared/utils';

const ROLES = getRolesToSignUp();
const DOCUMENT_TYPES = getDocumentTypes();

const BANKS = getBanks();
const HOUSING_TYPES = ["Casa", "Apartamento", "Edificio", "Oficina"];

export default function SignupPage() {
  const navigate = useNavigate();
  const { generateOTP, loadingGenerateOTP, errorGenerateOTP,
    verifyOTP, loadingVerifyOTP, errorVerifyOTP, signUp, loadingSignUp, errorSignUp
  } = useSignUp();
  const { validatePersonByDocument, loadingValidatePersonExistByDocument, errorValidatePersonExistByDocument,
    addPerson, loadingAddPerson, errorAddPerson, addClient
   } = usePerson();
  const { addReferralExistCustomer, loadingReferralExistCustomer, errorReferralExistCustomer } = useReferral();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [isValidateClient, setIsValidateClient] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [departamentCodeSelected, setDepartamentCodeSelected] = useState("");
  
  
  // Ref to track previous loading state for OTP generation
  const prevLoadingGenerateOTP = useRef(false);

  // Form States - Personal Info
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [codeToResgitration, setCodeToResgitration] = useState("");
  const [isShowOTPSection, setIsShowOTPSection] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Form States - Client Info (for Referral)
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

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setShowBankInfo(roleId === 'referral' || roleId === 'advisor');
  };

  const handleNextStep1 = () => {
    if (!selectedRole) {
      ToastAlert({ 
        position: 'center',
        timer: 1800,
        icon: 'info', title: 'Por favor selecciona un perfil.' });
      return;
    }

    if (selectedRole === 'referral') {
      ModalAlertConfirm({
        title: 'Términos y condiciones de uso',
        text: `
          <h2 class="text-xl font-bold text-purple-600 italic">Genera ingreso por tus referidos</h2>
          <h3 class="font-bold mt-4 mb-2 text-left">Condiciones de uso</h3>
          <ul class="list-disc space-y-2 ml-4 text-left text-sm">
            <li>Nuestra plataforma <b>SIO</b> te ofrece la posibilidad de generar ingresos adicionales recomendando a posibles clientes interesados en nuestros servicios de conectividad, tanto <b>fijos como móviles</b>.</li>
            <li>La metodología es muy sencilla: regístrate con tus datos personales y envíanos la información de los posibles clientes interesados. Nuestro equipo se encargará de gestionar el proceso comercial.</li>
            <li>Una vez enviada la información, recibirás una notificación por <b>mensaje de texto o correo electrónico</b> informándote sobre el estado del proceso de tu referido.</li>
            <li>Cuando el servicio haya sido <b>instalado y activado correctamente</b>, se procederá al pago de la <b>comisión correspondiente por la venta realizada</b>.</li>
            <li>En el siguiente enlace podrás consultar las <b>tablas de comisiones vigentes</b>. <a href="#" class="text-blue-600 hover:text-blue-800 underline cursor-pointer">aquí</a></li>
            <li>Los desembolsos de las comisiones se realizan <b>todos los sábados</b>, teniendo en cuenta la fecha de instalación y activación del servicio.</li>
            <li>El pago de la comisión se realizará directamente a la <b>cuenta registrada en nuestra base de datos</b>.</li>
            <li>Al continuar con el registro como referido, aceptas nuestros <b>Términos y Condiciones de uso</b>, la <b>Política de Privacidad</b> y el <b>tratamiento de datos personales</b>.</li>
          </ul>
          <p class="text-left text-sm italic mt-4"><span class="font-semibold">¿Deseas continuar con el proceso de registro?</span></p>
        
        `, 
        // icon: 'info',
        confirmText: 'Si, continuar',
        cancelText: 'No, cancelar',
        isText: false,
        confirmCallback: () => setStep(2),
      });
    } else {
      if (selectedRole === 'client'){
        setStep(3);
      }else{
        setStep(2);
      }
    }
  };

  const validateStep2 = () => {
    if( showBankInfo ){
      if (!documentType || !documentNumber || !firstName || !lastName || !email || !phone || !password || !bank || !accountNumber) {
        ToastAlert({ 
          position: 'center',
          timer: 1800,
          icon: 'info', 
          title: 'Por favor completa todos los campos obligatorios.' 
        });
        return false;
      }
    }else{
      if (!documentType || !documentNumber || !firstName || !lastName || !email || !phone) {
        ToastAlert({ 
          position: 'center',
          timer: 1800,
          icon: 'info', 
          title: 'Por favor completa todos los campos obligatorios.' 
        });
        return false;
      }
    }
    
    generateOTP({
      email,
      document: documentNumber,
      name: firstName + ' ' + lastName,
      phone,
    });
  };

  const handleNextStep2 = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      if (selectedRole === 'referral' || selectedRole === 'client') {
        setStep(3);
      } else {
        handleFinalSubmit();
      }
    }
  };

  const validateStep3 = () => {
    if (!clientFirstName || !clientLastName || !clientEmail || !clientPhone || !clientDepartment || !clientCity || !clientAddress || !clientHousingType || !clientNeighborhood) {
      ToastAlert({ 
        position: 'center',
        timer: 1800,
        icon: 'error', 
        title: 'Por favor completa todos los campos del cliente.' 
      });
      return false;
    }
    return true;
  };

  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if ((selectedRole === 'referral' || selectedRole === 'client') && !validateStep3()) {
      return;
    }

    if (selectedRole === 'client') {
      setIsRegistering(true);
      try {
        const addClientResponse = await addClient({
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
        });
        
        if (addClientResponse.process !== 'success') {
          setIsRegistering(false);
          return false;
        }
        
        setIsRegistering(false);
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'success',
          title: 'Datos del cliente registrados correctamente.',
        });
        setTimeout(() => navigate('/'), 2000);
      } catch (error) {
        setIsRegistering(false);
        console.error('Error during client registration:', error);
      }
    }

    if (selectedRole === 'referral') {
      setIsRegistering(true);
      
      try {
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
          referral_email: email
        });
        
        if (addPersonResponse.process !== 'success') {
          setIsRegistering(false);
          return false;
        }
        
        const addReferralExistCustomerResponse = await addReferralExistCustomer({
          document_client: clientDocumentNumber,
          email_user: email,
        });
        
        if (addReferralExistCustomerResponse.process !== 'success') {
          setIsRegistering(false);
          ToastAlert({
            position: 'center',
            timer: 2000,
            icon: 'error',
            title: addReferralExistCustomerResponse.message,
          });
          return false;
        }
        
        setIsRegistering(false);
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'success',
          title: 'La referenciación del cliente se ha realizado correctamente.',
        });
        setTimeout(() => navigate('/'), 2000);
      } catch (error) {
        setIsRegistering(false);
        console.error('Error during registration:', error);
      }
    }
  };

  const roleSelectedLabelToShow = () => {
    return ROLES.find(
      role => role.id === selectedRole).label.split(' ')[1]
        .charAt(0).toUpperCase() + ROLES.find(
          role => role.id === selectedRole).label.split(' ')[1].slice(1);
  }

  const handleVerifyCode = () => {
    if (!codeToResgitration || codeToResgitration.length !== 6) {
      ToastAlert({ 
        icon: 'error', 
        position: 'center',
        timer: 1800,
        title: 'Por favor ingresa el código de confirmación.' });
      return;
    }
    
    verifyOTP({ email, code: codeToResgitration });
  } 

  const clearFormPersonalInfo = () => {
    setDocumentType('');
    setDocumentNumber('');
    setFirstName('');
    setSecondName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setBank('');
    setAccountNumber('');
    setPassword('');
    setIsShowOTPSection(false);
  }

  const clearFormClientInfo = () => {
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
  }

  // useEffect(() => {
  //   if (errorGenerateOTP) {
  //     ToastAlert({
  //       position: 'top',
  //       timer: 1800,
  //       icon: 'error',
  //       title: 'Error al generar OTP',
  //       description: errorGenerateOTP,
  //     });
  //   }
  // }, [errorGenerateOTP]);

  const handleValidateClientDocumentNumber = async () => {
    setIsValidateClient(false);
    clearFormClientInfo();
    if (clientDocumentNumber === '') {
      ToastAlert({
        position: 'center',
        timer: 1800,
        icon: 'error',
        title: 'Por favor ingresa el número de documento.',
      });
      return false;
    }
    const validatePersonByDocumentResponse = await validatePersonByDocument({ document: clientDocumentNumber });
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
        confirmCallback: () => {
          // setIsValidateClient(true);
          addReferralExistCustomer({
            document_client: clientDocumentNumber,
            email_user: email,
          });
        },
        cancelCallback: () => setIsValidateClient(false),
      });
      return false;
    }
    if (validatePersonByDocumentResponse.process === 'person-not-found') {
      setIsValidateClient(true);
      return false;
    }
    // return true;
  } 

  const handleCancelAddClient = () => {
    const title = selectedRole === 'client' 
      ? 'Cancelar registro' 
      : 'Cancelar referenciación';
    const text = selectedRole === 'client' 
      ? '¿Estás seguro(a) que deseas cancelar el registro?' 
      : '¿Estás seguro(a) que desea realizar la referenciación del cliente más tarde?';  
    ModalAlertConfirm({
      title: title,
      text: text,
      icon: '',
      confirmText: 'Si',
      cancelText: 'No',
      isShowCancelButton: true,
      isAllowOutsideClick: false,
      confirmCallback: () => {
        clearFormClientInfo();
        setIsValidateClient(false);
        navigate('/');
      },
      cancelCallback: () => setIsValidateClient(false),
    });
    return false;
  }

  useEffect(() => {
    // Show modal only when loading transitions from true to false (OTP generation completed)
    if (prevLoadingGenerateOTP.current && !loadingGenerateOTP && !errorGenerateOTP) {
      ModalAlertConfirm({
        title: 'Generación de código',
        text: 'Se ha generado un código de confirmación, revise su correo electrónico y confirme el código a continuación.',
        icon: 'info',
        confirmText: 'Continuar',
        isShowCancelButton: false,
        isAllowOutsideClick: false,
        confirmCallback: () => setIsShowOTPSection(true),
      });
    }
    
    // Update the ref with current loading state
    prevLoadingGenerateOTP.current = loadingGenerateOTP;
  }, [loadingGenerateOTP, errorGenerateOTP]);

  useEffect(() => {
    if (loadingVerifyOTP && !errorVerifyOTP) {
      // Do nothing while loading
    } else if (!loadingVerifyOTP && !errorVerifyOTP && codeToResgitration) {       
      if (selectedRole === 'client') {
        ToastAlert({
          position: 'center',
          timer: 3000,
          icon: 'success',
          title: 'Código verificado correctamente. Por favor completa tus datos...',
        });
        setIsShowOTPSection(false);
        setStep(3);
      } else {
        ToastAlert({
          position: 'center',
          timer: 3000,
          icon: 'success',
          title: 'Código verificado correctamente, procederé al registro, espere por favor...',
        });

        signUp({
          document: documentNumber,
          document_type_acronym: documentType,
          name: firstName,
          middle_name: secondName,
          last_name: lastName,
          email: email,
          phone: phone,
          password: password,
          roleName: selectedRole,
          bankName: bank,
          accountNumber: accountNumber,
        });
      }
    } else if (errorVerifyOTP) {
       // Stop process if error
       return;
    }
  }, [loadingVerifyOTP, errorVerifyOTP]);


  useEffect(() => {
    if (loadingSignUp) {
      ToastAlert({
        position: 'center',
        timer: 2000,
        icon: 'success',
        title: 'Usuario registrado.',
      });
      if (selectedRole === 'referral' || selectedRole === 'client') {
        setStep(3);
      } else {
        handleFinalSubmit();
      }
    }
    
  }, [loadingSignUp]);

  useEffect(() => {
    if (loadingValidatePersonExistByDocument) {
      
    }
    
  }, [loadingValidatePersonExistByDocument]);

  useEffect(() => {
    if (loadingReferralExistCustomer) {
      // Redirect to home
      ToastAlert({
        position: 'center',
        timer: 2000,
        icon: 'success',
        title: 'Cliente asociado correctamente.',
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }else {
     
    }
    
  }, [loadingReferralExistCustomer]);

  useEffect(() => {
    const getColombianDepartments = async () => {
      const departments = await getDepartments();
      setDepartments(departments);
    };
    getColombianDepartments();
  }, []);

  useEffect(() => {
    if (!departamentCodeSelected || departamentCodeSelected === '') return;
    const getCitiesByDepartment = async () => {
      setCities([]);
      const cities = await getCitiesByDepartmentId(departamentCodeSelected);
      setCities(cities);
    };
    getCitiesByDepartment();
  }, [departamentCodeSelected]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <TransversalHeader
        title="Registro de Usuario"
        description="Completa los pasos para crear tu cuenta en SIO."
      />

      <div className="container mx-auto px-4 mt-8 max-w-6xl">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            {selectedRole === 'referral' && (
              <>
                <div className={`h-1 w-16 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          
          {/* STEP 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-center text-gray-800">Selecciona tu perfil</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ROLES.map((role) => (
                  <div 
                    key={role.id}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${selectedRole === role.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <h3 className={`font-bold text-lg mb-2 ${selectedRole === role.id ? 'text-blue-700' : 'text-gray-700'}`}>{role.label}</h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 bg-cyan-50 border border-cyan-200 border-l-4 border-l-cyan-400 rounded-lg p-4">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-cyan-700">Próximamente</p>
                  <p className="text-sm text-cyan-600 mt-0.5">¡Muy pronto podrás registrarte como <b>asesor/a</b> y comenzar a crecer con nosotros!</p>
                </div>
              </div>
              <div className="flex justify-center md:justify-end pt-4 gap-2">
                <SecondaryButton onClick={() => navigate('/')} className="w-full md:w-auto px-8 cursor-pointer btn-cancel shadow-none">
                  Volver
                </SecondaryButton>
                <PrimaryButton onClick={handleNextStep1} className="w-full md:w-auto px-8 cursor-pointer btn-primary shadow-none">
                  Siguiente
                </PrimaryButton>
                
              </div>
            </div>
          )}

          {/* STEP 2: Personal Information */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-center text-gray-800">Información Personal</h2>
              <InlineAlert title="Perfil seleccionado" message={`Te registrarás como ${roleSelectedLabelToShow()}`} type="info" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <Select options={DOCUMENT_TYPES.map((docType) => docType.label)} label="Tipo de documento" value={documentType} onChange={(e) => {
                    // setDocumentType(e.target.value.acronym);
                    setDocumentType(DOCUMENT_TYPES.find((docType) => docType.label === e.target.value).acronym);
                  }} />
                </div>
                <div className="md:col-span-1">
                  <Input type="text" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Número de documento" icon={IdCard} className="md:col-span-1"/>
                  <span className="offset-1 text-xs text-purple-500 italic">Digita número de documento sin puntos</span>
                </div>
                <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))} placeholder="Primer nombre" icon={User} />
                <Input type="text" value={secondName} onChange={(e) => setSecondName(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))} placeholder="Segundo nombre (Opcional)" icon={User} />
                <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))} placeholder="Apellidos" icon={User} />
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Teléfono" icon={Phone} />
                <div className="md:col-span-1">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" icon={Mail} />
                </div>
                
                {/* Solo es visible para role 'referral' o 'advisor' */}
                {showBankInfo && (
                <>
                  <div className="md:col-span-1">
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" icon={Lock} />
                  </div>       
                  <div className="md:col-span-2 border-t border-gray-100 my-2 pt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Datos Bancarios</h3>
                    <p className='text-sm text-gray-500 italic'>Aquí se acreditarán tus comisiones por referidos cuando una compra sea completada.</p>
                  </div>
                  <Select options={BANKS} label="Banco" value={bank} onChange={(e) => setBank(e.target.value)} />
                  <Input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Número de cuenta" icon={CreditCard} />
                </>
                )}
              </div>

              <BottomModal
                isOpen={!errorGenerateOTP && isShowOTPSection}
                onClose={() => setIsShowOTPSection(false)}
                title="Confirmación de registro"
                description="Por favor, ingresa el código de confirmación enviado a tu correo electrónico."
              >
                <div className="flex flex-col gap-4 items-center">
                  <OTPInput length={6} onComplete={(code) =>{
                    setCodeToResgitration(code);
                  }} />
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-500 italic">El código de confirmación es válido por 10 minutos.</p>
                    <p className="text-sm text-gray-500">
                      ¿No has recibido el código?{' '}
                      <span 
                        className="text-blue-600 font-semibold cursor-pointer hover:underline" 
                        onClick={() => {
                          console.log('Solicitar reenvío de código de registro');
                          // Add resend logic here
                        }}
                      >
                        Reenviar
                      </span>
                    </p>
                  </div>

                  <PrimaryButton 
                    type="button" 
                    className="w-full mt-4"
                    disabled={loadingVerifyOTP}
                    onClick={ () => handleVerifyCode() }
                  >
                    {loadingVerifyOTP ? 
                      <div className="flex items-center gap-2 cursor-pointer text-black justify-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                        <span className="italic transition animate-pulse text-sm">Verificando...</span>
                      </div>
                      : 'Verificar código'
                    }
                  </PrimaryButton>
                </div>
              </BottomModal>

              <div className="flex justify-between pt-4">
                <SecondaryButton onClick={() => {
                  clearFormPersonalInfo();
                  setStep(1);
                }} type="button" className="w-full md:w-auto px-8 cursor-pointer btn-cancel shadow-none">Volver</SecondaryButton>
                
                <PrimaryButton type="submit" className="w-full md:w-auto px-8 cursor-pointer btn-primary shadow-none">
                  {selectedRole === 'referral' ? 'Siguiente' : 'Finalizar Registro'}
                </PrimaryButton>
              </div>
            </form>
          )}

          {/* STEP 3: Client Data Form */}
          {step === 3 && (selectedRole === 'referral' || selectedRole === 'client') && (
            <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-center text-gray-800">
                {selectedRole === 'client' ? 'Completa tus datos' : 'Agregar Cliente'}
              </h2>
              {/* Si roleClient show inline alert informando que se registrara como cliente */}
              {selectedRole === 'client' && (
                <InlineAlert type="info" title="Información" message="Estás a punto de registrarte como cliente. Completa tu información personal para activar tus servicios." />
              )}
              <p className="text-justify text-gray-500 text-sm">
                {selectedRole !== 'client' 
                  ? 'Tienes la opción de referir un cliente de inmediato o realizarlo más tarde desde tu panel de control cuando de autentiques.'
                  : ''}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <div className="flex flex-col md:flex-row gap-2 w-full md:items-start">
                    <div className="md:flex-[8] w-full mb-2 md:mb-0">
                      <Input type="text" value={clientDocumentNumber} onChange={(e) => setClientDocumentNumber(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Número de documento" icon={IdCard} className="w-full h-12" inputClassName="h-12" />
                     
                    </div>

                    <div className="md:flex-1 w-full mb-2 md:mb-0 md:-mt-1">
                      <PrimaryButton type="button" className="w-full h-14 mx-auto flex items-center justify-center" onClick={() => handleValidateClientDocumentNumber()}>
                        <Search />
                        <span className="ml-2">Consultar</span>
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
                <Select options={DOCUMENT_TYPES.map((docType) => docType.label)} label="Tipo de documento" value={clientDocumentType} onChange={(e) => {
                  setClientDocumentType(DOCUMENT_TYPES.find((docType) => docType.label === e.target.value).acronym);
                }} disabled={!isValidateClient} />
                
                <Input type="text" value={clientFirstName} onChange={(e) => setClientFirstName(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))} placeholder="Nombre(s)" icon={User} disabled={!isValidateClient} className={`${isValidateClient ? 'bg-gray-100' : ''}`}/>
                <Input type="text" value={clientLastName} onChange={(e) => setClientLastName(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))} placeholder="Apellidos" icon={User} disabled={!isValidateClient}/>
                <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="Correo electrónico" icon={Mail} disabled={!isValidateClient}/>
                <Input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="Teléfono" icon={Phone} disabled={!isValidateClient}/>
                <Select options={departments.map((department) => department.name )} label="Departamento" value={clientDepartment} onChange={(e) => { 
                  setClientDepartment(e.target.value);
                  setDepartamentCodeSelected('');
                  // setCities([]);
                  setTimeout(() => {
                    setDepartamentCodeSelected(departments.find((department) => department.name === e.target.value).id);
                  }, 1500);
                }} disabled={!isValidateClient}/>
                <Select options={ departamentCodeSelected ? cities.map((city) => city.name ) : ['Obteniendo ciudades...'] } label="Ciudad" value={clientCity} onChange={(e) => setClientCity(e.target.value)} disabled={!isValidateClient || !departamentCodeSelected}/>
                <div className="md:col-span-1"> 
                  <Input type="text" value={clientNeighborhood} onChange={(e) => setClientNeighborhood(e.target.value)} placeholder="Barrio" icon={MapPin} disabled={!isValidateClient}/>
                </div>  
                <div className="md:col-span-1">
                  <Input type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Dirección" icon={MapPin} disabled={!isValidateClient}/>
                </div>
                <div className="md:col-span-2">
                  <Select options={HOUSING_TYPES} label="Tipo de vivienda" value={clientHousingType} onChange={(e) => setClientHousingType(e.target.value)} disabled={!isValidateClient}/>
                </div>
                <div className="md:col-span-2">
                  <label className={isValidateClient ? 'block text-sm font-medium text-gray-700 mb-1' : 'block text-sm font-medium text-gray-700 mb-1 opacity-50 cursor-not-allowed'}>Observaciones</label>
                  <textarea 
                    disabled={!isValidateClient}
                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${!isValidateClient ? 'opacity-50 cursor-not-allowed' : ''}`}
                    rows="3"
                    value={clientObservations}
                    onChange={(e) => setClientObservations(e.target.value)}
                    placeholder="Información adicional..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-center pt-4 gap-4">
                {/* <SecondaryButton onClick={() => {
                  clearFormClientInfo();
                  setStep(2)
                }} type="button" className="w-full md:w-auto px-8 cursor-pointer">Atrás</SecondaryButton> */}
                <SecondaryButton onClick={() => handleCancelAddClient()} type="button" className="w-full md:w-auto px-8 cursor-pointer btn-cancel shadow-none">
                  {
                    selectedRole === 'client' ? (
                      <span>Cancelar</span>
                    ) : (
                      <span>Más tarde</span>
                    )
                  }
                </SecondaryButton>
                {selectedRole === 'client' ? (
                  <PrimaryButton type="submit" className="w-full btn-primary shadow-none cursor-pointer">Registrarme</PrimaryButton>
                ) : (
                  <PrimaryButton type="submit" className="w-full btn-primary shadow-none cursor-pointer">Agregar cliente y finalizar</PrimaryButton>
                )}
                
              </div>
            </form>
          )}

        </div>
      </div>
      <FullScreenLoader show={loadingGenerateOTP || isRegistering} 
        message={isRegistering ? "Procesando registro, espere un momento..." : "Validando información, espere un momento."} />
    </div>
  );
}
