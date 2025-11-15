// src/components/Footer.jsx
import { useState } from "react";
import AboutModal from "./modals/AboutModal";
import PolicyModal from "./modals/PolicyModal";  
import TermsModal from "./modals/TermsModal";
import ContactModal from "./modals/ContactModal";

export default function Footer() {
    const [showModal, setShowModal] = useState(false);
    const [showPolicyModal, setShowPolicyModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    return (
    <><footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          {/* Company Info */}
          <div>
            <h5 className="text-3xl font-extrabold mb-3 text-blue-400">SIO</h5>
            <p className="text-sm opacity-80">
              Sistema Integrado de Operadores.<br />Conectamos personas, servicios y oportunidades.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h6 className="font-semibold mb-3 border-b border-blue-600 pb-1">Enlaces útiles</h6>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition" onClick={(e) => {e.preventDefault(); setShowModal(true)}}>Acerca de SIO</a></li>
              <li><a href="#" className="hover:text-blue-400 transition" onClick={(e) => {e.preventDefault(); setShowPolicyModal(true)}}>Políticas de privacidad</a></li>
              <li><a href="#" className="hover:text-blue-400 transition" onClick={(e) => {e.preventDefault(); setShowTermsModal(true)}}>Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-blue-400 transition" onClick={(e) => {e.preventDefault(); setShowContactModal(true)}}>Contacto</a></li>
            </ul>
          </div>

          {/* Services */}
          {/* <div>
      <h6 className="font-semibold mb-3 border-b border-blue-600 pb-1">Nuestros Servicios</h6>
      <ul className="space-y-2 text-sm">
        <li><a href="#" className="hover:text-blue-400 transition">Comparar planes</a></li>
        <li><a href="#" className="hover:text-blue-400 transition">Gestión de facturas</a></li>
        <li><a href="#" className="hover:text-blue-400 transition">Soporte técnico</a></li>
        <li><a href="#" className="hover:text-blue-400 transition">Cobertura</a></li>
      </ul>
    </div> */}

          {/* Copyright & Socials */}
          <div className="flex flex-col justify-between">
            <p className="text-sm opacity-70 md:text-right">
              © {new Date().getFullYear()} SIO. Todos los derechos reservados.
            </p>
            {/* Social Icons Placeholder */}
            <div className="flex gap-4 mt-4 md:justify-end">
              {/* Icons like <Facebook />, <Twitter />, etc. would go here */}
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-500 transition text-white">
                {/* {facebook} */}
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-500 transition text-white">
                {/* {instagram} */}
              </div>
            </div>
          </div>
        </div>
      </footer>
      <AboutModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <PolicyModal isOpen={showPolicyModal} onClose={() => setShowPolicyModal(false)} />
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </> 
  );
}