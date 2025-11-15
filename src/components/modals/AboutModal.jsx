import { PrimaryButton } from "../ui/button";
import { X } from "lucide-react";

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 scale-100 opacity-100 animate-slideUp">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-blue-700">
            SIO
            <p className="text-xl text-gray-600">Acerca de nosotros</p>
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
            En SIO, nos comprometemos a brindarte la mejor experiencia en
            servicios de fibra y móvil. Somos tu aliado en la búsqueda de la
            conectividad que necesitas.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="p-6 space-y-4 cursor-pointer">
          <PrimaryButton onClick={onClose}>Entendido</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
