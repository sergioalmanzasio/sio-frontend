import { useState } from "react";
import AboutModal from "./modals/AboutModal";
import PolicyModal from "./modals/PolicyModal";  
import TermsModal from "./modals/TermsModal";
import ContactModal from "./modals/ContactModal";
import { FACEBOOK_URL, INSTAGRAM_URL } from "../shared/constanst";

export default function Footer() {
    const [showModal, setShowModal] = useState(false);
    const [showPolicyModal, setShowPolicyModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    
    return (
    <><footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          <div>
            <h5 className="text-3xl font-extrabold mb-3 text-blue-400">SIO</h5>
            <p className="text-sm opacity-80">
              Sistema Integrado de Operadores.<br />Conectamos personas, servicios y oportunidades.
            </p>
          </div>

          <div>
            <h6 className="font-semibold mb-3 border-b border-blue-600 pb-1">Enlaces útiles</h6>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition" onClick={(e) => {e.preventDefault(); setShowModal(true)}}>Acerca de SIO</a></li>
              <li><a href="#" className="hover:text-blue-400 transition" onClick={(e) => {e.preventDefault(); setShowPolicyModal(true)}}>Políticas de privacidad</a></li>
              <li><a href="#" className="hover:text-blue-400 transition" onClick={(e) => {e.preventDefault(); setShowTermsModal(true)}}>Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-blue-400 transition" onClick={(e) => {e.preventDefault(); setShowContactModal(true)}}>Contacto</a></li>
            </ul>
          </div>

          <div className="flex flex-col justify-between">
            <p className="text-sm opacity-70 md:text-right">
              © {new Date().getFullYear()} SIO. Todos los derechos reservados.
            </p>
            <div className="flex gap-4 mt-4 md:justify-end">
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                <div className="w-8 h-8 rounded-sm bg-blue-900 flex items-center justify-center cursor-pointer hover:bg-blue-500 transition text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" 
                      width="24" height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="white" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round">

                    <path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>

                  </svg>
                </div>
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <div className="w-8 h-8 rounded-sm bg-blue-900 flex items-center justify-center cursor-pointer hover:bg-blue-500 transition text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" 
                    width="24" height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="white" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round">

                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
              </a>
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