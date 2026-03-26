import { PrimaryButton } from "../ui/button";
import { X } from "lucide-react";

export default function PolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full md:w-full md:max-w-1/2 transform transition-all duration-500 scale-100 opacity-100 animate-slideUp overflow-y-auto max-h-[95vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-blue-700">Políticas de Privacidad</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-50 cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm">
          <p>En <b>SIO</b> (Sistema Integrado de Operadores) respetamos y protegemos la privacidad de nuestros usuarios. La plataforma puede recopilar información personal necesaria para la gestión de solicitudes de servicios, incluyendo:</p>
          <ul className="list-disc space-y-2 ml-4">
            <li>Nombre.</li>
            <li>Correo electrónico.</li>
            <li>Número de teléfono.</li>
            <li>Dirección del servicio.</li>
            <li>Información relacionada con solicitudes de conectividad.</li>
          </ul>
          <p>Esta información es utilizada exclusivamente para:</p>
          <ul className="list-disc space-y-2 ml-4">
            <li>Gestionar solicitudes de servicios.</li>
            <li>Conectar a los usuarios con operadores de telecomunicaciones.</li>
            <li>Brindar soporte o información relacionada con los servicios solicitados.</li>
            <li>Mejorar la experiencia dentro de la plataforma.</li>
          </ul>
          <p>SIO no vende ni comparte información personal con terceros no autorizados. Los datos podrán ser compartidos únicamente con operadores o aliados comerciales cuando sea necesario para gestionar una solicitud realizada por el usuario.</p>
          <p>Los usuarios pueden solicitar la actualización o eliminación de su información personal mediante los canales de contacto disponibles en la plataforma.</p>
        </div>

        <div className="p-6 space-y-4 cursor-pointer text-sm">
          <PrimaryButton onClick={onClose}>Entendido</PrimaryButton>
        </div>
      </div>
    </div>
  );
}