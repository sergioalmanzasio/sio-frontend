// src/components/Navbar.jsx

import { useState } from "react";
import { GradientButton } from "./ui/button";
import ForgotPasswordModal from "./modals/ForgotPasswordModal";
import LoginForm from "./form/LoginForm";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalAlertConfirm from "./alerts/ModalAlertConfirm";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import MenuUser from "./menu/MenuUser";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showMenuUser, setShowMenuUser] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { isAuthenticated, userData, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    ModalAlertConfirm({
      title: "¿Estás seguro(a) de cerrar sesión?",
      text: "Esto cerrará tu sesión y te redirigirá al inicio.",
      icon: "warning",
      confirmText: "Sí, cerrar sesión",
      cancelText: "Cancelar",
      confirmCallback: () => {
        logout(); // Llama a la función global de logout
        navigate('/');
      },
      cancelCallback: () => {
        // Do nothing
      }
    });
  };


  return (
    <><header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-3xl font-extrabold text-blue-600 tracking-wider cursor-pointer" onClick={() => navigate('/')}>
          <img src="/src/assets/SIO-logo.png" className="w-24 h-16" alt="" />
        </div>
        {/* Icono de menu */}

        {
          isAuthenticated ? 
          (
            <div className="flex items-center gap-4">
              
              <span className="text-gray-600"> {userData.firstName}</span>
               {
                showMenuUser ? (
                  <X className="cursor-pointer text-blue-600" onClick={() => setShowMenuUser(!showMenuUser)} />
                ) : (
                  <Menu className="cursor-pointer text-blue-600" onClick={() => setShowMenuUser(!showMenuUser)} />
                )
              }
              {/* <button className="text-gray-600 hover:text-gray-800 transition" onClick={handleLogout}>
                <LogOut className="cursor-pointer"/>
              </button> */}
              <div className="relative">
                {showMenuUser && (
                  <MenuUser onClose={() => setShowMenuUser(false)} onCloseSession={handleLogout} />
                )}
              </div>
            </div>  
          
          ) : (
            <div className="relative">
              <GradientButton
                className="hidden md:flex cursor-pointer" // Hide on small screens for cleaner look
                onClick={() => setShowLogin(!showLogin)}
              >
                {showLogin ? "Cancelar" : "Iniciar sesión"}
              </GradientButton>

              {showLogin && (
                <LoginForm onClickForgotPassword={() => {
                  setShowLogin(false);
                  setShowForgotPassword(true);
                }}
                onClickRegister={() => {
                  setShowLogin(false);
                  navigate('/signup');
                }}
                onClose={() => setShowLogin(false)}
                />
              )}

             
            </div>  
          )
        }  
      </div>
    </header>
    
    <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    
    </>
  );  
}