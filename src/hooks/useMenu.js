import { useState, useCallback } from "react"; // ⬅️ Importar useCallback
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../shared/constanst";
import { useAuth } from "../context/AuthContext";
import ToastAlert from "../components/alerts/ToastAlert";

const useMenu = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menus, setMenus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = (time) => {
    setTimeout(() => {
      logout();
      navigate('/');
    }, time);
  };

  const getOptionByRole = useCallback(async (roleId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/menu/options/${roleId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMenus(data.data);
      } else {
        if (response.status === 401) {
          ToastAlert({
            position: "top",
            timer: 1800,
            icon: "error",
            title: data.message,
          });
          handleLogout(1800);
        }
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: data.message,
        });
      }
    } catch (error) {
      console.log('error: ', error)
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Error de red al obtener las opciones del menú, inténtelo más tarde",
      });
      handleLogout(1800);
    } finally {
      setLoading(false);
    }
  }, []);

  return { menus, loading, error, getOptionByRole };
};



export default useMenu;