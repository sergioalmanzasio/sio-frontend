import React, { useEffect } from "react";

import Swal from "sweetalert2";
import useRequest from "../../hooks/useRequest";

export default function OfferBuyBottomModal({ isOpen, onClose, children, title, code, offerID, email, onLoadingChange }) {
  if (!isOpen) return null;
  
  const { request, addServiceRequest, loadingAddRequest } = useRequest();

  const showModalTerms = () => {
    return Swal.fire({
      title: 'Términos y Condiciones',
      html: `
        <div class="max-h-96 overflow-y-auto flex flex-col gap-2 items-left">
          <p class="text-left">Al continuar con este proceso, declaras que has leído y aceptado los siguientes términos:</p>
          <ul class="list-disc list-inside">
            
            <li class="text-left py-1">La información suministrada debe ser verídica, completa y actualizada.</li>
            <li class="text-left py-1">La solicitud será revisada y validada por un asesor o mercaderista antes de su aprobación final.</li>
            <li class="text-left py-1">La disponibilidad, precios y características de las ofertas pueden variar según tu ubicación y verificación de datos.</li>
            <li class="text-left py-1">Aceptas que SIO podrá comunicarte contigo para confirmar información, coordinar la instalación o resolver cualquier novedad del proceso.</li>
            <li class="text-left py-1">La aprobación de la solicitud no garantiza la activación inmediata del servicio; dependerá de la validación técnica y comercial del operador correspondiente.</li>
            <li class="text-left py-1">El uso de tus datos se realizará conforme a las políticas de privacidad de la plataforma.</li>
          </ul>
        </div>
      `, 
      confirmButtonText: 'Entendido',
      showCancelButton: false,
    });
  };

  const showModalConfirmBuy = () => {
    
    return Swal.fire({
      title: 'Confirmar solicitud de compra',
      text: '¿Estás seguro(a) de que deseas solicitar la compra de esta oferta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      onConfirm: () => {},
    });
  };

  const showSuccessMessageForBuy = async () => {
    const codeText = code ? ' Código de asesor: ' + code : 'NO-CODE';
    // onClose();
    const is_assisted = !!code;
    
    // TODO: Implement actual API call to register the purchase
    const response = await addServiceRequest({
      email, 
      offer_id: offerID, 
      is_assisted: is_assisted, 
      assistant_code: code ? code : 'NO-CODE'
    });
    if (!response || response.process !== 'success') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar la solicitud de compra. Por favor, inténtalo de nuevo.',
      });
      return;
    }
    
  
    Swal.fire({
      icon: 'success',
      title: '¡Realizado!',
      html: `Solicitud de compra realizada exitosamente. En breve recibirás un correo con los detalles.<br>
      Código de solicitud: <strong><span class="text-blue-600 font-bold text-lg">${response?.code || 'N/A'}</span></strong>`,
      timer: 3000,
      showTimerProgressBar: true,
      timerProgressBar: true,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      willClose: () => onClose()
    });
  };

  const [termsAccepted, setTermsAccepted] = React.useState(false);

  useEffect(() => {
    if (typeof onLoadingChange === "function") {
      onLoadingChange(loadingAddRequest);
      
    }
  }, [loadingAddRequest, onLoadingChange]);

  return (
    <>
      <div className="fixed inset-0 flex items-end justify-center z-50 bg-black/40 backdrop-blur-sm animate-fadeIn">
        <div className="w-full md:w-1/3 bg-white rounded-t-3xl p-6 shadow-xl animate-slideUp">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
            {title}
          </h2>
          <div className="text-gray-700">{children}</div>
          <div className="flex flex-row items-center gap-1 mt-4">
            <input 
              className="w-5 h-5 border border-gray-200 rounded-md p-0 cursor-pointer" 
              type="checkbox" 
              id="terms" 
              name="terms" 
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label for="terms" className="text-md text-gray-600 font-normal text-left font-size-12 w-full cursor-pointer">Acepto los términos y condiciones</label>
          </div>
          <div className="h-px w-full mt-2 mb-8">
            <p className="text-sm italic text-amber-600 font-normal">
              Es requerido aceptar los términos y condiciones. 
              <span className="font-bold text-amber-700 underline cursor-pointer" onClick={showModalTerms}>Leer aquí</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:gap-2 mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full disabled:opacity-50 disabled:bg-gray-500 cursor-pointer disabled:cursor-not-allowed"  disabled={!termsAccepted} onClick={async () => {
              const result = await showModalConfirmBuy();
              if (result.isConfirmed) {
                showSuccessMessageForBuy();
              }
            }}>Continuar</button>
            <button
              onClick={onClose}
              className="mt-2 md:mt-0 w-full btn-gradient-secondary text-white py-3 rounded-xl hover:bg-gray-900 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
