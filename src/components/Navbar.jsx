// src/components/Navbar.jsx

import { useState } from "react";
import { Mail, Lock, Menu } from "lucide-react";
import { GradientButton, PrimaryButton } from "./ui/button";
import { Input } from "./ui/input";
import ForgotPasswordModal from "./modals/ForgotPasswordModal";
import LoginForm from "./form/LoginForm";


const clearInput = () => {
  document.querySelector('input').value = '';
}

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <><header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-3xl font-extrabold text-blue-600 tracking-wider">
          <img src="/src/assets/SIO-logo.png" className="w-24 h-16" alt="" />
        </div>

        {/* Login Button & Dropdown */}
        <div className="relative">
          <GradientButton
            className="hidden md:flex" // Hide on small screens for cleaner look
            onClick={() => setShowLogin(!showLogin)}
          >
            {showLogin ? "Cancelar" : "Iniciar sesión"}
          </GradientButton>

          {showLogin && (
            <LoginForm onClickForgotPassword={() => {
              setShowLogin(false);
              setShowForgotPassword(true);
              clearInput();
            }} />
          )}
        </div>
      </div>

    </header>
    
    <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    
    </>
  );

  
}