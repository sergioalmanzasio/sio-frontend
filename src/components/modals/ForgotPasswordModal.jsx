import { PrimaryButton } from "../ui/button";
import { Mail } from "lucide-react";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import Swal from "sweetalert2";
import ToastAlert from "../alerts/ToastAlert";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const validateEmailIsEmpty = () => {
    const email = document.querySelector('input').value;
    if (email === '') {
      ToastAlert({
        position: "top",
        timer: 1500,
        icon: "error",
        title: "Por favor ingresa un correo electrónico."
      });
    }
    return false;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 scale-100 opacity-100 animate-slideUp">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-blue-700">
            SIO
            <p className="text-xl text-gray-600">Recuperar contraseña</p>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-50 cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p>
            Para recuperar tu contraseña, por favor ingresa tu correo
            electrónico.
          </p>
          <Input type="email" placeholder="Correo electrónico" icon={Mail} />
        </div>

        {/* Modal Footer */}
        <div className="p-6 space-y-4 cursor-pointer">
          <PrimaryButton onClick={validateEmailIsEmpty}>Recuperar</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
