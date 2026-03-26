import { X } from "lucide-react";
import { PrimaryButton } from "../ui/button";
import { CONTACT_EMAIL, CONTACT_PHONE, OPENING_HOURS, WEBSITE_URL } from "../../shared/constanst";


export default function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
       <div className="bg-white rounded-2xl shadow-2xl w-full md:w-full md:max-w-md transform transition-all duration-500 scale-100 opacity-100 animate-slideUp">
         <div className="flex justify-between items-center p-6 border-b border-gray-100">
           <h3 className="text-2xl font-bold text-blue-700">SIO <p className="text-xl text-gray-600">Contacto</p></h3>
           <button
             onClick={onClose}
             className="text-gray-400 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-50"
             aria-label="Cerrar modal"
           >
             <X size={24} />
           </button>
         </div>

         <div className="p-6 space-y-4 text-sm">
           <p>Si tienes dudas sobre nuestros servicios, el programa de referidos o el estado de tus comisiones, puedes comunicarte con nosotros a través de los siguientes canales:</p>
           <h5 className="font-bold mb-1">Atención al cliente</h5>
           <p>Celular/WhatsApp: {CONTACT_PHONE}</p>
           <h5 className="font-bold mb-1">Correo electrónico</h5>
           <p>{CONTACT_EMAIL}</p>
           <h5 className="font-bold mb-1">Horario de atención</h5>
           <p>{OPENING_HOURS}</p>
           <h5 className="font-bold mb-1">Sitio web</h5>
           <p>{WEBSITE_URL}</p>
         </div>

         <div className="p-6 space-y-4 text-sm">
           <PrimaryButton onClick={onClose}>Entendido</PrimaryButton>
         </div>
       </div>
     </div>
   );
}
             