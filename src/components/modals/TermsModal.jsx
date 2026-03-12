import { PrimaryButton } from "../ui/button";
import { X } from "lucide-react";

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full md:w-full md:max-w-2/3 transform transition-all duration-500 scale-100 opacity-100 animate-slideUp overflow-y-auto max-h-[95vh]">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-blue-700">
            SIO
            <p className="text-xl text-gray-600">Términos y Condiciones</p>
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
        <div className="p-6 space-y-4 text-sm">
          <p>Al acceder y utilizar la plataforma de <b>SIO</b> (Sistema Integrado de Operadores), el usuario acepta los presentes términos y condiciones.</p>
          <p>SIO es una plataforma de intermediación que facilita la conexión entre usuarios y proveedores de servicios de telecomunicaciones.</p>
          <p>Los servicios que pueden gestionarse a través de la plataforma incluyen:</p>
          <ul className="list-disc space-y-2 ml-4">
            <li>Internet de fibra óptica</li>
            <li>Internet para hogares</li>
            <li>Internet para empresas</li>
            <li>Planes móviles</li>
            <li>Servicios tecnológicos asociados</li>
          </ul>
          <p>SIO no es proveedor directo de los servicios de telecomunicaciones, salvo que se indique expresamente lo contrario. La prestación del servicio, instalación, facturación y soporte técnico corresponden directamente al operador proveedor.</p>
          <p>Las ofertas publicadas en la plataforma pueden estar sujetas a disponibilidad de cobertura, validación técnica y condiciones comerciales de cada operador.</p>
          <p>El usuario se compromete a utilizar la plataforma de manera responsable y a proporcionar información veraz al momento de registrarse o enviar solicitudes.</p>
          <p>SIO podrá actualizar o modificar estos términos y condiciones en cualquier momento con el fin de mejorar el funcionamiento de la plataforma.</p>
          <p>El uso indebido de la plataforma o el suministro de información falsa podrá resultar en la suspensión o cancelación del acceso del usuario.</p>
        </div>

        {/* Modal Footer */}
        <div className="p-6 space-y-4 cursor-pointer text-sm">
          <PrimaryButton onClick={onClose}>Entendido</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
