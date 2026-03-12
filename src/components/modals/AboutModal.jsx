import { PrimaryButton } from "../ui/button";
import { X } from "lucide-react";

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full md:w-full md:max-w-1/2 transform transition-all duration-500 scale-100 opacity-100 animate-slideUp overflow-y-auto max-h-[95vh]">
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
        <div className="px-6 py-4 space-y-4 text-sm">
          <p><b>SIO</b> (Sistema Integrado de Operadores) es una plataforma digital diseñada para conectar usuarios con proveedores de servicios de telecomunicaciones en Colombia.</p>
          <p>Nuestra misión es simplificar el acceso a servicios de conectividad como internet de fibra óptica, planes móviles y soluciones tecnológicas para hogares, empresas y conjuntos residenciales.</p>
          <p>A través de nuestra plataforma, los usuarios pueden descubrir, comparar y gestionar diferentes ofertas de operadores de telecomunicaciones desde un solo lugar, facilitando la toma de decisiones y optimizando el acceso a servicios digitales.</p>
          <p><b>SIO</b> también promueve un modelo colaborativo que permite a aliados comerciales, asesores independientes y administradores de propiedades recomendar servicios y generar ingresos mediante la intermediación comercial. Nuestro objetivo es construir un ecosistema tecnológico que conecte personas, servicios y oportunidades en el sector de las telecomunicaciones.</p>
        </div>

        {/* Modal Footer */}
        <div className="p-6 space-y-4 cursor-pointer text-sm">
          <PrimaryButton onClick={onClose}>Entendido</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
