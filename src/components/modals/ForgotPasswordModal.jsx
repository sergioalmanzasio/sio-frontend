import { useState } from "react";
import { PrimaryButton } from "../ui/button";
import { Mail, X, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import ToastAlert from "../alerts/ToastAlert";
import { API_BASE_URL } from "../../shared/constanst";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleForgotPassword = async () => {
    if (!email || email.trim() === '') {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "info",
        title: "Por favor ingresa un correo electrónico."
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();

      ToastAlert({
        position: "top",
        timer: 3000,
        icon: data.process === 'success' ? 'success' : 'error',
        title: data.message || "Se ha procesado la solicitud."
      });

      if (data.process === 'success' || response.ok) {
        setEmail('');
        onClose();
      }

    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 3000,
        icon: "error",
        title: "Error de red al intentar recuperar contraseña."
      });
    } finally {
      setLoading(false);
    }
  };

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
          <Input 
            type="email" 
            placeholder="Correo electrónico" 
            icon={Mail} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-6 space-y-4">
          <PrimaryButton onClick={handleForgotPassword} disabled={loading} className="w-full flex items-center justify-center">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="italic animate-pulse">Enviando...</span>
              </div>
            ) : (
              'Recuperar'
            )}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
