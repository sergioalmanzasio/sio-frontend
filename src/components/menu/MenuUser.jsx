import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X,ChevronUpCircle } from "lucide-react";
import useMenu from "../../hooks/useMenu";
import { useAuth } from "../../context/AuthContext";



const MenuUser = ({ onClose, onCloseSession }) => {
  const { isAuthenticated, userData } = useAuth();
  const { getOptionByRole, loading, menus } = useMenu();
  const roleID = userData?.roleId;
  const navigate = useNavigate();
  
  const getMenu = async () => {
    if (roleID) {
      const options = await getOptionByRole(roleID);
      return options;
    }
    return [];
  };

  useEffect(() => {
    getMenu();
  }, [roleID]);
  
  const displayMenus = menus ? [...menus] : [];

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
        {displayMenus && displayMenus.length > 0 ? (
          <>
            {displayMenus.map((menu) => (
              <li key={menu.id} className="flex items-center gap-2 cursor-pointer">
                <span
                  className="text-gray-600 hover:text-blue-600 transition"
                  onClick={() => navigate(menu.url)}
                >
                  {menu.name}
                </span>
              </li>
            ))}

            <div className="h-px w-full bg-gray-200 my-2"></div>

            <li className="flex items-center gap-2 cursor-pointer">
              <span
                className="text-gray-600 hover:text-blue-600 transition"
                onClick={() => navigate("/config")}
              >
                Configuración
              </span>
            </li>

            <li className="flex items-center gap-2 cursor-pointer">
              <span
                className="text-gray-600 hover:text-red-600 transition"
                onClick={onCloseSession}
              >
                Cerrar sesión
              </span>
            </li>
          </>
        ) : (
          <li className="text-gray-500">No hay opciones disponibles</li>
        )}
      </ul>
    </div>
  );
};

export default MenuUser;
