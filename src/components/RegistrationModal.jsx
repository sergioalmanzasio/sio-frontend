// src/components/RegistrationModal.jsx

import { useState } from "react";
import { X, User, Phone, Briefcase, ChevronDown, Mail, Lock } from "lucide-react";
import { PrimaryButton } from "./ui/button";
import { Input } from "./ui/input"; 
import ToastAlert from "./alerts/ToastAlert"; // Asegúrate de que esta librería funcione
import Select from "./ui/select";

const DOCUMENT_TYPES = ["Cédula de ciudadanía", "Cédula de extranjería", "Pasaporte"];

export default function RegistrationModal({ isOpen, onClose }) {
  // 1. Estados para todos los campos del formulario
  const [isSeller, setIsSeller] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;
  
  // 2. Mover la lógica de manejo dentro del componente para acceder a los estados
  const clearInput = () => {
    setDocumentType("");
    setFirstName("");
    setSecondName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPhone("");
  }

  const validateAndSubmitForm = (e) => {
    e.preventDefault();
    
    // 3. Validación usando los estados de React
    if (!documentType || !firstName || !lastName || !email || !phone || !password) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Por favor, completa todos los campos requeridos."
      });
      return false; // Detiene el envío
    }

    
    // Simulación de envío exitoso
    ToastAlert({
        position: "top",
        timer: 1800,
        icon: "success",
        title: "Registro exitoso."
    });
    
    clearInput();
    onClose();
    return true;
  }


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 scale-100 opacity-100 animate-slideUp">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-blue-700">🚀 ¡Únete a SIO!</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-50"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body/Form */}
        {/* 4. Usar la nueva función de manejo */}
        <form onSubmit={validateAndSubmitForm} className="p-6 space-y-4"> 
          
          {/* Checkbox: Vendedor/a */}
          <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
            <input 
              id="is-seller" 
              type="checkbox" 
              checked={isSeller}
              onChange={(e) => setIsSeller(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is-seller" className="text-sm font-medium text-gray-700">
              Soy Vendedor/a 
            </label>
          </div>
          
          {/* 5. SELECT - Campo controlado */}
          <Select
            options={DOCUMENT_TYPES}
            label="tipo de documento"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          />
          
          
          {/* 6. INPUTS - Campos controlados: Aseguramos value y onChange */}
          <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Primer nombre" icon={User} />
          {/* Si quieres que el segundo nombre sea opcional, no lo incluyas en la validación principal */}
          <Input type="text" value={secondName} onChange={(e) => setSecondName(e.target.value)} placeholder="Segundo nombre (Opcional)" icon={User} />
          <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellidos" icon={User} />
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" icon={Mail} />
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Número de teléfono" icon={Phone} />
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Crear contraseña" icon={Lock} />
          
          

          <p className="text-xs text-gray-500 pt-2">
              Al registrarte, aceptas nuestros <a href="#" className="text-blue-600 hover:underline">Términos y Condiciones</a>.
          </p>
          
          <PrimaryButton type="submit" className="w-full py-3">
            Completar Registro
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}