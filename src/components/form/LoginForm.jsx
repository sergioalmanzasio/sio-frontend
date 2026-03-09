import { Input } from "../ui/input";
import { Mail, Lock } from "lucide-react";
import { PrimaryButton } from "../ui/button";
import ToastAlert from "../alerts/ToastAlert";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginForm = ({ onClickForgotPassword, onClickRegister, onClose }) => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, userData } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const clearInput = () => {
    document.querySelector('input').value = '';
  }

  const handleInputChange = (e) => {
    // Capturar el evento enter
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // NUEVA LÓGICA: Reaccionar cuando isLogin cambie a true
  useEffect(() => {
    if (isAuthenticated) {
      // 1. Notificar al Navbar para que cierre el dropdown y actualice isAuthenticated
      if (onClose) {
        onClose(); 
      }

         navigate('/offers');
    }
  }, [isAuthenticated, navigate, onClose]);

  const handleSubmit = async () => {
    const requiredFields = ["email", "password"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        ToastAlert({
          position: "top",
          timer: 1800,
          icon: "error",
          title: "Todos los campos son obligatorios para iniciar sesión.",
        });
        return;
      }
    }
    const loginSuccess = await login(formData);
    if (loginSuccess) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "success",
        title: "Bienvenido(a) de vuelta a tu cuenta.",
        isColored: false
      });

      onClose();
      navigate('/auth-redirect');
    }
  };

    

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
      e.preventDefault();
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-80 md:w-100 bg-white border border-gray-100 rounded-xl shadow-2xl p-6 origin-top-right transform scale-100 transition-all duration-300 ease-out animate-fadeIn">
      <div className="flex flex-col space-y-4">
        <h2 className="text-lg font-semibold mb-1">Iniciar sesión</h2>
        <p className="text-sm text-gray-600 mb-4">Ingresa tus datos para iniciar sesión</p>
        <Input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          icon={Mail}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} 
          value={formData.email}
        />
        <Input
          type="password"
          name="password"
          placeholder="Contraseña"
          icon={Lock}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={formData.password}
           isPasswordToggle={true} 
        />
        <PrimaryButton
          type="submit"
          className="w-full cursor-pointer"
          onClick={handleSubmit}
        >
          Acceder
        </PrimaryButton>
      </div>
      <div className="flex flex-row space-x-4 justify-center">
          <a href="#" className="text-xs text-blue-600 mt-3 block text-center hover:text-blue-700 transition cursor-pointer"
          onClick={() => {
            clearInput();
            onClickForgotPassword();
          }}
        >
          ¿Olvidaste tu contraseña?
        </a>
        <a
          href="#"className="text-xs text-purple-600 mt-3 block text-center hover:text-purple-700 transition cursor-pointer"
          onClick={() => {
            clearInput();
            onClickRegister();
          }}
        >
          Registrate
        </a>
      </div>
    </div> 
  );
};

export default LoginForm;
