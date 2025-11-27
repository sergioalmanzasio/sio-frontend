// src/sections/HeroSection.jsx

import { useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import { PrimaryButton, SecondaryButton } from "../components/ui/button";
import RegistrationModal from "../components/RegistrationModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleRegister = () => {
    navigate('/signup');
  };

  return (
    <>
      <section className="relative h-[90vh] flex flex-col items-center justify-center overflow-hidden text-center text-gray-900 pt-20">
        <AnimatedBackground />
        
        {/* Content Wrapper */}
        <div className="relative z-10 px-6 max-w-4xl">
          
          {/* Animated Hero Title */}
          <h2 className="text-3xl md:text-7xl font-extrabold mb-8 leading-tight animate-slideInUp text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-cyan-500">
            Tu Conexión Inteligente con servicios de Fibra y Móvil.
          </h2>
          
          {/* Subtitle with Blur Effect */}
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light p-3 rounded-xl">
            Descubre, compara y gestiona los servicios que realmente necesitas desde una sola plataforma.
          </p>
          
          {/* Action Buttons with Magic UI style */}
          <div className="flex flex-row md:flex-row justify-center gap-6">
            <PrimaryButton className="px-10 py-3 text-md cursor-pointer bg-gradient-to-b from-[#06b6d4] via-[#2563eb] to-[#6366f1]" onClick={() => navigate('/offers')}>
                Ver Ofertas
            </PrimaryButton>
            
            { !isAuthenticated && (
              <SecondaryButton 
                className="bg-white text-blue-600 px-10 py-3 text-md cursor-pointer "
                onClick={() => handleRegister()}
              >
                Registrarse
              </SecondaryButton>
            ) }  


            {/* The enhanced button component is used here
            <SecondaryButton 
                className="bg-white text-blue-600 px-10 py-3 text-md cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
              Registrarse
            </SecondaryButton> */}
          </div>
        </div>
        
        {/* Decorative Gradient Overlay (moved inside AnimatedBackground for clarity) */}
      </section>

      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}