import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import OfferDetailModal from "../../components/alerts/OfferDetailModal";
import ToastAlert from "../../components/alerts/ToastAlert";
import useReferral from "../../hooks/useReferral";
import { useAuth } from "../../context/AuthContext";

const ITEMS_PER_PAGE = 10;

const ServiceFollowUpTable = () => {
  const { userData } = useAuth();
  const { referralByCoordinatorService, loadingReferralByCoordinatorService } = useReferral();
  const [followUps, setFollowUps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      if (userData?.email) {
        try {
          const response = await referralByCoordinatorService({ email_user: userData.email });
          if (response && Array.isArray(response.data)) {
             setFollowUps(response.data);
          } else {
             setFollowUps([]);
          }
        } catch (error) {
          console.error("Error loading follow-ups:", error);
          setFollowUps([]);
        }
      }
    };
    loadData();
  }, [userData?.email, referralByCoordinatorService]);

  const totalPages = Math.ceil(followUps.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFollowUps = followUps.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const itemModal = (item, description, copyValue = null) => {
    const copyButton = copyValue ? `
      <button onclick="window.copyToClipboard('${copyValue}')" class="ml-2 text-gray-400 hover:text-blue-600 transition-colors" title="Copiar">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      </button>
    ` : '';

    return (
      '<div class="flex items-center">' +
        '<span class="text-md font-semibold mr-2">' + item + ':</span>' +
        '<span class="text-md">' + (description || 'N/A') + '</span>' +
        copyButton +
      '</div>'
    );
  };

  useEffect(() => {
    window.copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        ToastAlert({
          position: 'top-end',
          timer: 1500,
          icon: 'success',
          title: 'Copiado al portapapeles',
          showConfirmButton: false,
        });
      });
    };
    return () => {
      delete window.copyToClipboard;
    };
  }, []);

  const handleShowMore = (item) => {
    OfferDetailModal({
      title: 'Detalles del Cliente',
      html: `
        <div class="flex flex-col gap-2 text-justify mb-2">
          <h4 class="text-lg font-bold text-justify text-blue-600">Información Personal</h4>
          ${itemModal('Nombre', item.client_name)}
          ${itemModal('Teléfono', item.client_phone, item.client_phone)}
          ${itemModal('Correo', item.client_email, item.client_email)}
        </div>
        <div class="h-1 w-full bg-gray-100 my-4"></div>
        <div class="flex flex-col gap-2 text-justify mb-2">
          <h4 class="text-lg font-bold text-justify text-blue-600">Ubicación</h4>
          ${itemModal('Departamento', item.client_department)}
          ${itemModal('Ciudad', item.client_city)}
          ${itemModal('Barrio', item.client_neighborhood)}
          ${itemModal('Dirección', item.client_address)}
        </div>
      `,
      confirmText: 'Cerrar',
      isCancelButtonVisible: false,
      confirmCallback: () => {
      },
    });
  };

  if (loadingReferralByCoordinatorService) return <FullScreenLoader show={loadingReferralByCoordinatorService} message="Cargando seguimiento..." />;

  return (
    <div className="w-full md:w-3/4 mt-0 md:mt-4 mx-auto p-4 md:p-0">
      <div className="overflow-x-auto bg-white shadow-lg rounded-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-400 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Asesor</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Fecha</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentFollowUps.length > 0 ? (
              currentFollowUps.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-bold">{item.client_name}</span>
                      <span className="text-xs text-gray-500 md:hidden mt-1">Asesor: {item.referral_name}</span>
                      <span className="text-xs text-gray-500 lg:hidden mt-1">Código: {item.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">{item.referral_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                    <span className="bg-gray-100 px-2 py-1 rounded font-bold">{item.code}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">{item.created_at}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105"
                      onClick={() => handleShowMore(item)}
                    >
                      Ver más
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {followUps.length > 0 && (
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
                Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(endIndex, followUps.length)}</span> de <span className="font-medium">{followUps.length}</span> resultados
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

export default ServiceFollowUpTable;
