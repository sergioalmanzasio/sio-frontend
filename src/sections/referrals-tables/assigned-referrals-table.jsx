import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import ServiceRequestsTableSkeleton from "../service-requests-tables/service-requests-table-skeleton";
import useReferral from "../../hooks/useReferral";
import { useAuth } from "../../context/AuthContext";
import ToastAlert from "../../components/alerts/ToastAlert";
import OfferDetailModal from "../../components/alerts/OfferDetailModal";

const ITEMS_PER_PAGE = 10;

const AssignedReferralsTable = () => {

  const navigate = useNavigate();
  const { loadingReferralByCoordinatorService, referralByCoordinatorService } = useReferral();
  const { isAuthenticated, userData, logout } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewDetail = (referral) => {
    OfferDetailModal({
      title: 'Detalle de referenciación',
      html: `
        <div class="flex flex-col gap-2 text-justify mb-2">

          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">Información del cliente</h4>
            <p class="text-sm"><span class="font-medium">Nombre:</span> ${referral.client_name}</p>
            <p class="text-sm"><span class="font-medium">Teléfono:</span> ${referral.client_phone}</p>
            <p class="text-sm"><span class="font-medium">Correo electrónico:</span> ${referral.client_email}</p>
            <p class="text-sm"><span class="font-medium">Departamento:</span> ${referral.client_department}</p>
            <p class="text-sm"><span class="font-medium">Ciudad/Provincia:</span> ${referral.client_city}</p>
            <p class="text-sm"><span class="font-medium">Barrio:</span> ${referral.client_neighborhood}</p>
            <p class="text-sm"><span class="font-medium">Dirección:</span> ${referral.client_address}</p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">Más información</h4>
            <p class="text-sm"><span class="font-medium">Referido por:</span> ${referral.referral_name || 'N/A'}</p>
            <p class="text-sm"><span class="font-medium">Código de referencia:</span> ${referral.code}</p>
            <p class="text-sm"><span class="font-medium">Fecha:</span> ${referral.created_at}</p>
            <p class="text-sm"><span class="font-medium">Estado:</span> ${referral.is_active ? 'Activo' : 'Inactivo'}</p>
          </div>
        </div>
        <div class="h-1 w-full bg-gray-100"></div>
      `,
      confirmText: 'Cerrar',
      isCancelButtonVisible: false,
      footerText: "",
      confirmCallback: () => {
      },
    });
  };

  const handleAssociateOffer = (referral) => {
    navigate('/associate-offer', {
      state: {
        clientName: referral.client_name,
        trackingCode: referral.code,
        referralId: referral.id
      }
    });
  };

  const buttonDetail = (referral) => (
    <button 
      className="text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600 px-3 py-1 rounded-md text-xs font-semibold transition duration-150 cursor-pointer" 
      onClick={() => handleViewDetail(referral)}
    >
      Ver detalle
    </button>
  );

  const buttonAssociate = (referral) => (
    <button 
      className="text-purple-600 hover:text-white bg-purple-100 hover:bg-purple-600 px-3 py-1 rounded-md text-xs font-semibold transition duration-150 cursor-pointer" 
      onClick={() => handleAssociateOffer(referral)}
    >
      Asociar oferta
    </button>
  );

  const getAssignedReferrals = async () => {
    try {
      if (!userData || !userData.email) {
        ToastAlert({
          position: 'center',
          timer: 3000,
          icon: 'error',
          title: 'Lo siento, no se encontró información de usuario',
          isColored: false
        });
        setTimeout(() => {
          logout();
          window.location.href = '/';
        }, 3000);
        return;
      }
      // Using email_user as per hook definition
      const result = await referralByCoordinatorService({ email_user: userData.email });
      setReferrals(result); 
    } catch (error) {
      console.error('Error fetching assigned referrals:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !userData) {
      return;
    }
    getAssignedReferrals();
  }, [isAuthenticated, userData]);

  // Filter referrals based on search term
  const allReferrals = referrals?.data || [];
  const filteredReferrals = allReferrals.filter((referral) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (referral.client_name || "").toLowerCase().includes(term) ||
      (referral.referral_name || "").toLowerCase().includes(term) ||
      (referral.code || "").toLowerCase().includes(term)
    );
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredReferrals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReferrals = filteredReferrals.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loadingReferralByCoordinatorService) {
    return <ServiceRequestsTableSkeleton message="Cargando referidos asignados..." />;
  }

  return (
    <>
      <div className="w-full md:w-3/4 mt-0 md:mt-4 mx-auto p-4 md:p-0">
        {/* Search Field */}
        <div className="mb-4 md:w-1/2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre de cliente, referido por o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 placeholder-gray-400 transition duration-150"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nombre del Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Referido por</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Código de referencia</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Fecha de registro</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentReferrals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm.trim() ? "No se encontraron resultados para la búsqueda." : "No hay referidos asignados disponibles."}
                  </td>
                </tr>
              ) : (
                currentReferrals.map(
                  (referral) => (
                    <tr key={referral.id || referral.code} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-bold">{referral.client_name}</span>
                          <span className="text-xs text-gray-500 sm:hidden mt-1">
                            <span className="font-semibold">Ref:</span> {referral.referral_name}
                          </span>
                          <span className="text-xs text-gray-500 md:hidden mt-1">
                            <span className="font-semibold">Código:</span> {referral.code}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell"> {referral.referral_name || 'N/A'} </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                        <span className="bg-gray-100 px-2 py-1 rounded font-bold">{referral.code}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell"> {referral.created_at} </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 justify-center">
                          { buttonDetail(referral)}
                          { buttonAssociate(referral)}
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredReferrals.length > 0 && (
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
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(endIndex, filteredReferrals.length)}</span> de <span className="font-medium">{filteredReferrals.length}</span> resultados
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
    </>
  );
};

export default AssignedReferralsTable;
