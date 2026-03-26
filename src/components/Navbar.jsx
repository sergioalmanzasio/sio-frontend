import sioLogo from "../assets/SIO-logo.png";
import { useState } from "react";
import { GradientButton } from "./ui/button";
import ForgotPasswordModal from "./modals/ForgotPasswordModal";
import LoginForm from "./form/LoginForm";
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
      title: "¿Quieres cerrar sesión?",
      text: "Se cerrará tu sesión y volverás al inicio.",
      icon: "",
      confirmText: "Sí, cerrar sesión",
      cancelText: "Cancelar",
      confirmCallback: () => {
        logout();
        navigate('/');
      },
      cancelCallback: () => {
      }
    });
  };


  return (
    <><header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="text-3xl font-extrabold text-blue-600 tracking-wider cursor-pointer" onClick={() => navigate('/')}>
          <img src={sioLogo} className="w-24 h-16" alt="" />
        </div>
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
              <div className="relative">
                {showMenuUser && (
                  <MenuUser onClose={() => setShowMenuUser(false)} onCloseSession={handleLogout} />
                )}
              </div>
            </div>  
          
          ) : (
            <div className="relative">
              <GradientButton
                className="hidden md:flex cursor-pointer" 
                onClick={() => setShowLogin(!showLogin)}
              >
                {showLogin ? "Cancelar" : "Acceso"}
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