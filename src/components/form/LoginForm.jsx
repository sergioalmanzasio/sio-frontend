import { Input } from "../ui/input";
import { Mail, Lock, Eye } from "lucide-react";
import { PrimaryButton } from "../ui/button";
import ToastAlert from "../alerts/ToastAlert";
import useSignin from "../../hooks/useSignin";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onClickForgotPassword }) => {
  const navigate = useNavigate();
  const { signin, isLogin, loading } = useSignin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    // Capturar el evento enter
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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

    await signin(formData);
  };

  // NUEVA LÓGICA: Reaccionar cuando isLogin cambie a true
  useEffect(() => {
    if (isLogin) {
      console.log("¡LOGIN EXITOSO! El estado AHORA es TRUE.");
      navigate('/offers'); // Redirige a offers
    }
  }, [isLogin]); // El efecto se ejecuta cada vez que isLogin cambia

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
      e.preventDefault();
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-80 md:w-100 bg-white border border-gray-100 rounded-xl shadow-2xl p-6 origin-top-right transform scale-100 transition-all duration-300 ease-out animate-fadeIn">
      <div className="flex flex-col space-y-4">
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
      <a
        href="#"
        className="text-xs text-blue-600 mt-3 block text-center hover:text-blue-700 transition cursor-pointer"
        onClick={() => onClickForgotPassword()}
      >
        ¿Olvidaste tu contraseña?
      </a>
    </div>
  );
};

export default LoginForm;
