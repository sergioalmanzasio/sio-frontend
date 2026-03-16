import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import ToastAlert from "../../components/alerts/ToastAlert";
import useReferral from "../../hooks/useReferral";
import { useAuth } from "../../context/AuthContext";
import OfferDetailModal from "../../components/alerts/OfferDetailModal";
import InlineAlert from "../../components/alert/InlineAlert";


const ITEMS_PER_PAGE = 10;

const CommissionsTable = () => {
  const { userData } = useAuth();
  const { getCommissionAvailable, loadingGetCommissionAvailable, requestCommissionPayment } = useReferral();
  const [commissions, setCommissions] = useState([]);
  const [totalCommission, setTotalCommission] = useState("$ 0");
  const [currentPage, setCurrentPage] = useState(1);
  const [processingIndex, setProcessingIndex] = useState(null);
  const textForAvailablePaymentDate = "Vence: "; 

  const loadData = useCallback(async () => {
    if (userData?.email) {
      try {
        const response = await getCommissionAvailable();
        if (response && response.data) {
          setTotalCommission(response.data.total_commission || "$ 0");
          if (Array.isArray(response.data.commissions)) {
            setCommissions(response.data.commissions);
          } else {
            setCommissions([]);
          }
        } else {
          setCommissions([]);
        }
      } catch (error) {
        console.error("Error loading commissions:", error);
        setCommissions([]);
      }
    }
  }, [userData?.email, getCommissionAvailable]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Pagination calculations
  const totalPages = Math.ceil(commissions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCommissions = commissions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleRequestPayment = async (commission, index) => {
    OfferDetailModal({
      title: 'Confirmar solicitud de pago',
      html: `
        <p>¿Estás seguro de que deseas solicitar el pago de esta comisión?</p>
        <div class="bg-gray-50 p-4 rounded-lg text-sm mt-2">
          <p>Fecha de generación: ${commission.created_at_formatted}</p>
          <p>Comisión disponible: <span class="font-semibold text-indigo-600 text-lg">${commission.commission_amount_formmated}</span></p>
        </div>
      `,
      confirmText: 'Solicitar pago',
      cancelText: 'Cancelar',
      footerText: "",
      confirmCallback: async () => {
        setProcessingIndex(index);
        try {
          const result = await requestCommissionPayment(commission.tracking_code);
          if (result && result.process === 'success') {
            ToastAlert({
              position: 'center',
              timer: 2000,
              icon: 'success',
              title: result.message || 'Solicitud de pago realizada exitosamente',
            });
            await loadData();
          } else {
            ToastAlert({
              position: 'center',
              timer: 2000,
              icon: 'error',
              title: result?.message || 'Error al solicitar el pago',
            });
          }
        } catch (error) {
          console.error('Error requesting payment:', error);
        } finally {
          setProcessingIndex(null);
        }
      },
      cancelCallback: () => {
        console.log('Cancelar solicitud de pago');
      },
    })
  };

  

  return (
    <div className="w-full md:w-3/4 mt-0 md:mt-4 mx-auto p-4 md:p-0">
      {loadingGetCommissionAvailable && <FullScreenLoader show={loadingGetCommissionAvailable} message="Cargando información, espere un momento..." />}
      <InlineAlert
        title="Comisión disponible"
        message={<span>Total comisión disponible para retirar <span class="font-bold text-cyan-700 text-lg">{totalCommission}</span></span>}
        type="info"
      />

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-sm mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-400 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Comisión disponible</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Fecha de generación</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Oferta</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Cliente</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentCommissions.length > 0 ? (
              currentCommissions.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-bold text-indigo-600">{item.commission_amount_formmated}</span>
                      <span className="text-xs text-gray-500 sm:hidden mt-1">{item.created_at_formatted}</span>
                      <span className="text-xs text-gray-500 sm:hidden mt-1">{textForAvailablePaymentDate} {item.available_payment_date}</span>
                      <span className="text-xs text-gray-500 md:hidden mt-1">{item.offer_name}</span>
                      <span className="text-xs text-gray-400 lg:hidden mt-1">{item.client_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                    <div className="flex flex-col">
                      <span>{item.created_at_formatted}</span>
                      <span className="text-xs text-orange-500">{textForAvailablePaymentDate} {item.available_payment_date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 hidden md:table-cell">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{item.offer_name}</span>
                      <span className="text-xs text-gray-500 mt-0.5">{item.offer_description}</span>
                      <span className="text-xs font-medium mt-0.5">Operador: {item.operator_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">{item.client_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <div className="flex flex-col w-1/2 mx-auto text-center items-center gap-2">
                      <button 
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 shadow-md ${
                          processingIndex !== null
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer hover:shadow-lg transform hover:scale-105'
                        }`}
                        onClick={() => handleRequestPayment(item, index)}
                        disabled={processingIndex !== null}
                      >
                        {processingIndex === index ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Validando...
                          </span>
                        ) : 'Solicitar Pago'}
                      </button>
                      
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron comisiones disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {commissions.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-md">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Anterior
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(endIndex, commissions.length)}</span> de <span className="font-medium">{commissions.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionsTable;
