import { X,ChevronUpCircle } from "lucide-react";

const MenuUser = ({ onClose, onCloseSession }) => {
  return (
    <div className="absolute right-0 mt-4 w-80 md:w-100 bg-white border border-gray-100 rounded-xl shadow-2xl p-6 origin-top-right transform scale-100 transition-all duration-300 ease-out animate-fadeIn">
      <div className="relative">
        <h2 className="text-lg font-semibold mb-1">Menu de usuario</h2>
        <p className="text-sm text-gray-600 mb-4">Selecciona una opción</p>
        <div className="h-px w-full bg-gray-200 my-4"></div>
      </div>
      <button className="text-gray-600 hover:text-blue-600 transition absolute bottom-3 right-3" onClick={onClose}>
        <ChevronUpCircle className="cursor-pointer"/>
      </button>     
      <ul className="space-y-2">
        <li className="flex items-center gap-2 cursor-pointer ">
          <span className="text-gray-600 hover:text-blue-600 transition">Ofertas</span>
        </li>
        <li className="flex items-center gap-2 cursor-pointer ">
          <span className="text-gray-600 hover:text-blue-600 transition">Configuración</span>
        </li>
        <li className="flex items-center gap-2 cursor-pointer ">
          <span className="text-gray-600 hover:text-red-600 transition" onClick={onCloseSession}>Cerrar sesión</span>
        </li>
      </ul>
      
    </div>
  );
};

export default MenuUser;
