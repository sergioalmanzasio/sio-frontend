import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TransversalHeader from '../components/header/TransversalHeader';
import { PrimaryButton, SecondaryButton } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Select from '../components/ui/select';
import { User, Phone, Mail, Lock, Building, CreditCard, MapPin, Home } from 'lucide-react';
import ToastAlert from '../components/alerts/ToastAlert';
import ModalAlertConfirm from '../components/alerts/ModalAlertConfirm';
import OTPInput from '../components/ui/OTPInput';

const ROLES = [
  { id: 'referral', label: 'Plan referido', description: 'Recomienda servicios y gana comisiones.' },
  { id: 'client', label: 'Soy cliente', description: 'Solicita y gestiona tus servicios.' },
  { id: 'advisor', label: 'Soy asesor/a', description: 'Brinda asesoría y gestiona solicitudes.' },
];

const DOCUMENT_TYPES = ["Cédula de ciudadanía", "Cédula de extranjería", "Pasaporte"];
const BANKS = ["Bancolombia", "Davivienda", "Banco de Bogotá", "BBVA", "Nequi", "Daviplata"];
const HOUSING_TYPES = ["Casa", "Apartamento", "Edificio", "Oficina"];

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showBankInfo, setShowBankInfo] = useState(false);

  // Form States - Personal Info
  const [documentType, setDocumentType] = useState("");
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

  // Form States - Client Info (for Referral)
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientHousingType, setClientHousingType] = useState("");
  const [clientObservations, setClientObservations] = useState("");

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

    /*
    
    */
    if (selectedRole === 'referral') {
      ModalAlertConfirm({
        title: 'Términos y Condiciones',
        text: `
          <h2 class="text-xl font-bold text-purple-600 italic">Genera ingreso por tus referidos</h2>
          <h5 class="text-xl font-semibold mt-4 mb-4 text-left">Condiciones</h5>
          <ul class="list-disc pl-4 space-y-2 justify-left mb-4">
            <li class="text-left">Nuestra app SIO te ofrece la posibilidad de generar ingresos adicionales solo refiriendo a posibles clientes que necesiten algunos de nuestros productos fijos o móviles.</li>
            <li class="text-left">La metodología es muy sencilla: solo regístrate con tus datos personales y envíanos los de los posibles clientes; nosotros hacemos el resto.</li>
            <li class="text-left">Una vez enviada la información, te llegará una notificación por mensaje de texto o correo con el estado del proceso de tu venta.</li>
            <li class="text-left">Una vez instalado el servicio, se procederá a la cancelación de tu comisión por venta.</li>
            <li class="text-left">En el siguiente link encontrarás las tablas de comisiones.</li>
            <li class="text-left">Los desembolsos de las comisiones se realizan todos los sábados, teniendo en cuenta el día de instalación del producto.</li>
            <li class="text-left">El desembolso se hará directamente a tu cuenta registrada en nuestra base de datos.</li>
          </ul>
          <p class="text-left text-sm italic">Al continuar como referido, aceptas nuestros términos y condiciones de uso, política de privacidad y tratamiento de datos personales. <span class="font-semibold">¿Deseas continuar?</span></p>
        
        `, 
        icon: 'info',
        confirmText: 'Continuar',
        cancelText: 'Cancelar',
        isText: false,
        confirmCallback: () => setStep(2),
      });
    } else {
      setStep(2);
    }
  };

  const validateStep2 = () => {
    if( showBankInfo ){
      if (!documentType || !firstName || !lastName || !email || !phone || !password || !bank || !accountNumber) {
        ToastAlert({ 
          position: 'top',
          timer: 1800,
          icon: 'error', 
          title: 'Por favor completa todos los campos obligatorios.' 
        });
        return false;
      }
    }else{
      if (!documentType || !firstName || !lastName || !email || !phone || !password) {
        ToastAlert({ 
          position: 'top',
          timer: 1800,
          icon: 'error', 
          title: 'Por favor completa todos los campos obligatorios.' 
        });
        return false;
      }
    }
    setIsShowOTPSection(true);
    // return true;
  };

  const handleNextStep2 = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      if (selectedRole === 'referral') {
        setStep(3);
      } else {
        // Submit for Client/Advisor
        handleFinalSubmit();
      }
    }
  };

  const validateStep3 = () => {
    if (!clientFirstName || !clientLastName || !clientEmail || !clientPhone || !clientAddress || !clientHousingType) {
      ToastAlert({ icon: 'error', title: 'Por favor completa todos los campos del cliente.' });
      return false;
    }
    return true;
  };

  const handleFinalSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (selectedRole === 'referral' && !validateStep3()) {
      return;
    }

    // Simulate API call
    console.log("Registering User:", {
      role: selectedRole,
      personalInfo: { documentType, firstName, secondName, lastName, email, phone, bank, accountNumber },
      clientInfo: selectedRole === 'referral' ? { clientFirstName, clientLastName, clientEmail, clientPhone, clientAddress, clientHousingType, clientObservations } : null
    });

    ModalAlertConfirm({
      title: 'Registro Exitoso',
      text: 'Tu registro se ha realizado correctamente y está en proceso de revisión.',
      icon: 'success',
      confirmText: 'Ir al Inicio',
      isShowCancelButton: false,
      confirmCallback: () => navigate('/'),
    });
  };

  const roleSelectedLabelToShow = () => {
    return ROLES.find(
      role => role.id === selectedRole).label.split(' ')[1]
        .charAt(0).toUpperCase() + ROLES.find(
          role => role.id === selectedRole).label.split(' ')[1].slice(1);
  }

  const clearFormPersonalInfo = () => {
    setDocumentType('');
    setFirstName('');
    setSecondName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setBank('');
    setAccountNumber('');
    setPassword('');
  }

  const clearFormClientInfo = () => {
    setClientFirstName('');
    setClientLastName('');
    setClientEmail('');
    setClientPhone('');
    setClientAddress('');
    setClientHousingType('');
    setClientObservations('');
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      <TransversalHeader
        title="Registro de Usuario"
        description="Completa los pasos para crear tu cuenta en SIO."
      />

      <div className="container mx-auto px-4 mt-8 max-w-3xl">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="flex justify-end pt-4 gap-2">
                <SecondaryButton onClick={() => navigate('/')} className="w-full md:w-auto px-8 cursor-pointer">
                  Volver
                </SecondaryButton>
                <PrimaryButton onClick={handleNextStep1} className="w-full md:w-auto px-8 cursor-pointer">
                  Siguiente
                </PrimaryButton>
                
              </div>
            </div>
          )}

          {/* STEP 2: Personal Information */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-center text-gray-800">Información Personal</h2>
              <p className="text-center text-gray-600">Perfil seleccionado: {roleSelectedLabelToShow()}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Select options={DOCUMENT_TYPES} label="Tipo de documento" value={documentType} onChange={(e) => setDocumentType(e.target.value)} />
                </div>
                <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Primer nombre" icon={User} />
                <Input type="text" value={secondName} onChange={(e) => setSecondName(e.target.value)} placeholder="Segundo nombre (Opcional)" icon={User} />
                <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellidos" icon={User} />
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Teléfono" icon={Phone} />
                <div className="md:col-span-2">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" icon={Mail} />
                </div>
                <div className="md:col-span-2">
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" icon={Lock} />
                </div>
                {/* Solo es visible para role 'referral' o 'advisor' */}
                { console.log('selectedRole', selectedRole) }
                {showBankInfo && (
                <>  
                  <div className="md:col-span-2 border-t border-gray-100 my-2 pt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Datos Bancarios</h3>
                  </div>
                  <Select options={BANKS} label="Banco" value={bank} onChange={(e) => setBank(e.target.value)} />
                  <Input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Número de cuenta" icon={CreditCard} />
                </>
                )}
              </div>

              {/* Section to write OTP code for register confirmation */}
              <div className={`flex flex-col gap-2 items-center justify-center bg-blue-50 p-4 rounded-xl ${isShowOTPSection ? 'block' : 'hidden'}`}>
                <h3 className="text-lg font-semibold text-gray-700">Confirmación de registro</h3>
                <p className="text-sm text-gray-500">Por favor, ingresa el código de confirmación enviado a tu correo electrónico.</p>
                <OTPInput length={6} onComplete={(code) =>{
                  console.log(code);
                  setCodeToResgitration(code);

                }} />
                <p className="text-sm text-gray-500 italic">El código de confirmación es válido por 5 minutos.</p>
                <p className="text-sm text-gray-500">No has recibido el código de confirmación? <span className="text-blue-500 cursor-pointer" onClick={() => {
                  console.log('Solicitar reenvío de código de registro');
                }}>Reenviar</span></p>
                
              </div>

              <div className="flex justify-between pt-4">
                <SecondaryButton onClick={() => {
                  clearFormPersonalInfo();
                  setStep(1);
                }} type="button" className="w-full md:w-auto px-8 cursor-pointer">Atrás</SecondaryButton>
                
                <PrimaryButton type="submit">
                  {selectedRole === 'referral' ? 'Siguiente' : 'Finalizar Registro'}
                </PrimaryButton>
              </div>
            </form>
          )}

          {/* STEP 3: Referral Client Form */}
          {step === 3 && selectedRole === 'referral' && (
            <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-center text-gray-800">Agregar Cliente</h2>
              <p className="text-center text-gray-500 text-sm">Ingresa los datos del cliente que estás refiriendo.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input type="text" value={clientFirstName} onChange={(e) => setClientFirstName(e.target.value)} placeholder="Nombre(s)" icon={User} />
                <Input type="text" value={clientLastName} onChange={(e) => setClientLastName(e.target.value)} placeholder="Apellidos" icon={User} />
                <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="Correo electrónico" icon={Mail} />
                <Input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="Teléfono" icon={Phone} />
                <div className="md:col-span-2">
                  <Input type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Dirección" icon={MapPin} />
                </div>
                <div className="md:col-span-2">
                  <Select options={HOUSING_TYPES} label="Tipo de vivienda" value={clientHousingType} onChange={(e) => setClientHousingType(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    rows="3"
                    value={clientObservations}
                    onChange={(e) => setClientObservations(e.target.value)}
                    placeholder="Información adicional..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <SecondaryButton onClick={() => {
                  clearFormClientInfo();
                  setStep(2)
                }} type="button" className="w-full md:w-auto px-8 cursor-pointer">Atrás</SecondaryButton>
                <PrimaryButton type="submit">Agregar Cliente y Finalizar</PrimaryButton>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
