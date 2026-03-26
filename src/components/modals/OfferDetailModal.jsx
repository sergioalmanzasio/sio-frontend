import { X } from "lucide-react";

const OfferDetailModal = ({ isOpen, onClose, offer }) => {
  if (!isOpen || !offer) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div 
          className="fixed inset-0 bg-black/80 transition-opacity" 
          aria-hidden="true" 
          onClick={onClose}
        ></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full z-50">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-200">
              <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                Detalle de oferta
              </h3>
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                onClick={onClose}
              >
                <span className="sr-only">Cerrar</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="mt-2 text-left space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Nombre de la oferta</h4>
                  <p className="mt-1 text-base font-medium text-gray-900">{offer.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Operador</h4>
                  <p className="mt-1 text-base font-medium text-gray-900">{offer.operator_name}</p>
                </div>
                <div className="sm:col-span-2">
                  <h4 className="text-sm font-semibold text-gray-500">Descripción</h4>
                  <p className="mt-1 text-base text-gray-800">{offer.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Precio</h4>
                  <p className="mt-1 text-lg font-bold text-indigo-600">
                    ${Number(offer.price).toLocaleString("es-CO")}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Estado</h4>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold mt-1 ${offer.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {offer.is_active ? "Activa" : "Inactiva"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <h4 className="text-sm font-semibold text-gray-500">Categoría</h4>
                  <p className="mt-1 text-base text-gray-800">{offer.category_name}</p>
                </div>  
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Fecha Inicio</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(offer.date_start).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Fecha Fin</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(offer.date_end).toLocaleDateString()}</p>
                </div>
              </div>

              {offer.benefits && offer.benefits.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Beneficios incluidos</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {offer.benefits.map((benefit, index) => (
                      <li key={benefit.id || index}>{benefit.description}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer btn-cancel"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailModal;
