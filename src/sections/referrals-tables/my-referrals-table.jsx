import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Ellipsis, Info, ShieldCheck } from "lucide-react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import OfferDetailModal from "../../components/alerts/OfferDetailModal";
import BottomModal from "../../components/modals/BottomModal";
import AddClientForm from "../../components/forms/AddClientForm";
import {GradientButton} from "../../components/ui/button";
import useReferral from "../../hooks/useReferral";
import { useAuth } from "../../context/AuthContext";
import ToastAlert from "../../components/alerts/ToastAlert";


// Mock data - 22 referrals (kept for testing purposes)
const MOCK_REFERRALS = [
  { id: "REF001", clientName: "María González Pérez", trackingCode: "TRK-2024-001", registrationDate: "2024-01-15", status: true},
  { id: "REF002", clientName: "Carlos Rodríguez López", trackingCode: "TRK-2024-002", registrationDate: "2024-01-18", status: true},
  { id: "REF003", clientName: "Ana Martínez Silva", trackingCode: "TRK-2024-003", registrationDate: "2024-01-22", status: false},
  { id: "REF004", clientName: "Luis Hernández Castro", trackingCode: "TRK-2024-004", registrationDate: "2024-02-05", status: true},
  { id: "REF005", clientName: "Patricia Ramírez Gómez", trackingCode: "TRK-2024-005", registrationDate: "2024-02-10", status: true},
  { id: "REF006", clientName: "Jorge Díaz Morales", trackingCode: "TRK-2024-006", registrationDate: "2024-02-15", status: true},
  { id: "REF007", clientName: "Carmen Torres Ruiz", trackingCode: "TRK-2024-007", registrationDate: "2024-02-20", status: false},
  { id: "REF008", clientName: "Roberto Flores Vargas", trackingCode: "TRK-2024-008", registrationDate: "2024-03-01", status: true},
  { id: "REF009", clientName: "Laura Sánchez Ortiz", trackingCode: "TRK-2024-009", registrationDate: "2024-03-05", status: true},
  { id: "REF010", clientName: "Miguel Ángel Reyes", trackingCode: "TRK-2024-010", registrationDate: "2024-03-10", status: true},
  { id: "REF011", clientName: "Sofía Jiménez Navarro", trackingCode: "TRK-2024-011", registrationDate: "2024-03-15", status: false},
  { id: "REF012", clientName: "Diego Moreno Cruz", trackingCode: "TRK-2024-012", registrationDate: "2024-03-20", status: true},
  { id: "REF013", clientName: "Valentina Castro Méndez", trackingCode: "TRK-2024-013", registrationDate: "2024-04-01", status: true},
  { id: "REF014", clientName: "Andrés Romero Gutiérrez", trackingCode: "TRK-2024-014", registrationDate: "2024-04-05", status: true},
  { id: "REF015", clientName: "Isabella Herrera Vega", trackingCode: "TRK-2024-015", registrationDate: "2024-04-10", status: false},
  { id: "REF016", clientName: "Santiago Medina Rojas", trackingCode: "TRK-2024-016", registrationDate: "2024-04-15", status: true},
  { id: "REF017", clientName: "Camila Aguilar Soto", trackingCode: "TRK-2024-017", registrationDate: "2024-04-20", status: true},
  { id: "REF018", clientName: "Mateo Vargas Peña", trackingCode: "TRK-2024-018", registrationDate: "2024-05-01", status: true},
  { id: "REF019", clientName: "Lucía Mendoza Ríos", trackingCode: "TRK-2024-019", registrationDate: "2024-05-05", status: false},
  { id: "REF020", clientName: "Sebastián Núñez Paredes", trackingCode: "TRK-2024-020", registrationDate: "2024-05-10", status: true},
  { id: "REF021", clientName: "Mariana Campos Delgado", trackingCode: "TRK-2024-021", registrationDate: "2024-05-15", status: true},
  { id: "REF022", clientName: "Emilio Salazar Fuentes", trackingCode: "TRK-2024-022", registrationDate: "2024-05-20", status: true},
];

const ITEMS_PER_PAGE = 10;

const MyReferralsTable = () => {
  const { myReferrals, loadingMyReferrals, getReferralGeneralInfo, loadingGetGeneralInfo } = useReferral();
  const { isAuthenticated, userData, logout } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch referrals data
  const getReferrals = async () => {
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
      const result = await myReferrals({ email: userData.email });
      
      
      // If API returns data, use it; otherwise use mock data for testing
      if (result && result.data) {
        setReferrals(result.data);
      } else {
        // Fallback to mock data for testing
        setReferrals(MOCK_REFERRALS);
      }
      return result;
    } catch (error) {
      console.error('Error fetching referrals:', error);
      // Fallback to mock data on error for testing
      setReferrals(MOCK_REFERRALS);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !userData) {
      return;
    }
    getReferrals();
  }, [isAuthenticated, userData]);

  // Pagination and filtering calculations
  const filteredReferrals = referrals.filter(referral => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const name = (referral.full_name || "").toLowerCase();
    const code = (referral.code || "").toLowerCase();
    return name.includes(term) || code.includes(term);
  });

  const totalPages = Math.max(1, Math.ceil(filteredReferrals.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReferrals = filteredReferrals.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const itemModal = (item, description) => {
    return (
      '<div>' +
        '<span class="text-md font-semibold">' + item + '</span> : ' +
        '<span class="text-md">' + description + '</span>' +
      '</div>' 
    );
  };

  const handleShowMore = (referral) => {
    OfferDetailModal({
      title: 'Detalles del referido',
      html: `
        <div class="flex flex-col gap-2 text-justify">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">Información del referido</h4>
            <p class="text-sm"><span class="font-medium">Nombre:</span> ${referral.full_name}</p>
            <p class="text-sm"><span class="font-medium">Código de referencia:</span> ${referral.code}</p>
            <p class="text-sm"><span class="font-medium">Fecha de registro:</span> ${referral.created_at_formatted}</p>
            <p class="text-sm"><span class="font-medium">Estado:</span> ${referral.is_active ? 'Activo' : 'Inactivo'}</p>
          </div>  
        </div>

        <div class="h-1 w-full bg-gray-100"></div>
        <div class="flex flex-col gap-2 text-justify">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">Información de contacto</h4>
            <p class="text-sm"><span class="font-medium">Teléfono:</span> ${referral.phone}</p>
            <p class="text-sm"><span class="font-medium">Correo:</span> ${referral.email}</p>
          </div>
        </div>
        <div class="h-1 w-full bg-gray-100"></div>
        <div class="flex flex-col gap-2 text-justify">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">Información de localización</h4>
            <p class="text-sm"><span class="font-medium">Departamento:</span> ${referral.department}</p>
            <p class="text-sm"><span class="font-medium">Ciudad:</span> ${referral.city}</p>
            <p class="text-sm"><span class="font-medium">Barrio:</span> ${referral.neighborhood}</p>
            <p class="text-sm"><span class="font-medium">Dirección:</span> ${referral.address}</p>
          </div>
        </div>
        <div class="h-1 w-full bg-gray-100 hidden"></div>
        <div class="flex flex-col gap-2 text-justify hidden">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">Gestión del referido</h4>
            <p class="text-sm"><span class="font-medium"><a href="#" class="text-blue-500 hover:underline">Ver historial de solicitudes</a></span></p>
          </div>
        </div> 
      `,
      confirmText: 'Cerrar',
      isCancelButtonVisible: false,
      confirmCallback: () => {
        console.log('Modal cerrado');
      },
    });
  };

  const handleShowGeneralInfo = async (referral) => {
    try {
      const response = await getReferralGeneralInfo(referral.code);
      
      if (response && response.process === 'success' && response.data) {
        const data = response.data;
        const comments = response.comments || [];

        const commentsHtml = comments.length > 0 ? comments.map(comment => `
          <div class="border-b border-gray-200 pb-2 last:border-0 last:pb-0 mb-3">
            <p class="text-xs text-gray-500 flex justify-between">
              <span>${comment.created_at_formatted}</span>
              <span class="font-medium">${comment.registered_by}</span>
            </p>
            <p class="text-sm text-gray-700 mt-1">${comment.comment}</p>
          </div>
        `).join('') : '<p class="text-sm text-gray-500 text-center py-4">No hay comentarios registrados.</p>';

        OfferDetailModal({
          title: 'Detalle de la solicitud activa',
          html: `
            <div class="flex flex-col gap-2 text-justify">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-800 mb-2">Detalles de la solicitud</h4>
                <p class="text-sm"><span class="font-medium">Radicado:</span> ${data.filing_number}</p>
                <p class="text-sm"><span class="font-medium">Estado:</span> 
                  <span class="
                    ${data.description.toLowerCase() === 'terminada' ? 'bg-green-100 text-green-800' :
                        data.description.toLowerCase() === 'aprobada' ? 'bg-cyan-100 text-cyan-800' :
                        data.description.toLowerCase() === 'en proceso' ? 'bg-pink-100 text-pink-800' :
                        data.description.toLowerCase() === 'no aprobada' ? 'bg-red-100 text-red-800' :
                        data.description.toLowerCase() === 'suspendida' ? 'bg-violet-100 text-violet-800' :
                      'text-gray-500'}
                  font-semibold px-2 py-1/2 rounded-lg">${data.description}</span></p>
                <p class="text-sm"><span class="font-medium">Fecha de registro:</span> ${data.created_at_formatted}</p>
              </div>  
            </div> 
            <div class="h-1 w-full bg-gray-100"></div>
            <div class="flex flex-col gap-2 text-justify">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-800 mb-2">Información de la oferta</h4>
                <p class="text-sm"><span class="font-medium">Nombre:</span> ${data.offer_name}</p>
                <p class="text-sm"><span class="font-medium">Descripción:</span> ${data.offer_description}</p>
                <p class="text-sm"><span class="font-medium">Operador:</span> ${data.operator_name}</p>
                <p class="text-sm"><span class="font-medium">Precio:</span> $ ${parseInt(data.offer_price).toLocaleString('es-CO')}</p>
              </div>
            </div>
            <div class="h-1 w-full bg-gray-100 mb-2"></div>
            <div class="flex flex-col gap-2 text-justify">
              <h4 class="text-lg font-bold text-justify text-black">Seguimiento del servicio</h4>
              <div class="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto w-full">
                ${commentsHtml}
              </div>
            </div>
          `,
          confirmText: 'Cerrar',
          isCancelButtonVisible: false,
          confirmCallback: () => {
            console.log('Modal cerrado');
          },
        });
      }
    } catch (error) {
      console.error('Error fetching general info:', error);
      // ToastAlert handled in hook
    }
  };

  const tagStatus = (status) => {
    if (status) {
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Activo</span>;
    } else {
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactivo</span>;
    }
  };

  const buttonDetails = (referral) => (
    <button 
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105" 
      onClick={() => handleShowMore(referral)}
    >
      <Ellipsis className="w-4 h-4" />
    </button>
  );

  const buttonHistory = (referral) => (
    <button 
      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 ml-2" 
      onClick={() => handleShowGeneralInfo(referral)}
    >
      <ShieldCheck className="w-4 h-4" />
    </button>
  );

  if (loadingMyReferrals) {
    return <FullScreenLoader show={loadingMyReferrals} message="Cargando referidos..." />;
  }

  return (
    <>
      <div className="w-full md:w-3/4 mt-0 md:mt-4 mx-auto p-4 md:p-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <GradientButton
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 cursor-pointer transform hover:scale-105 transition-transform w-full md:w-auto"
          >
            Agregar cliente
          </GradientButton>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por nombre o código de referencia..."
            className="w-full md:w-2/4 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="overflow-x-auto bg-white shadow-lg rounded-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-400 text-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Código de referencia</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Fecha de Registro</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Estado</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentReferrals.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay referidos disponibles.
                  </td>
                </tr>
              ) : (
                currentReferrals.map((referral) => (
                  <tr key={referral.code} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span className="font-bold">{referral.full_name}</span>
                        <span className="text-xs text-gray-500 md:hidden mt-1">
                          <span className="font-semibold">Código:</span> {referral.code}
                        </span>
                        <span className="text-xs text-gray-500 lg:hidden mt-1">
                          <span className="font-semibold">Fecha:</span> {referral.created_at_formatted}
                        </span>
                        <span className="text-xs text-gray-500 sm:hidden mt-1">
                          <span className="font-semibold">Estado:</span> {tagStatus(referral.is_active)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                      <span className="bg-gray-100 px-2 py-1 rounded font-bold">{referral.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">{referral.created_at_formatted}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">{tagStatus(referral.is_active)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium ">
                      {buttonDetails(referral)}
                      {buttonHistory(referral)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {referrals.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-md">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                Anterior
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{filteredReferrals.length > 0 ? startIndex + 1 : 0}</span> a{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredReferrals.length)}</span> de{' '}
                  <span className="font-medium">{filteredReferrals.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50 cursor-pointer'
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
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50 cursor-pointer'
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

      {/* Add Client Modal */}
      <BottomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar cliente"
        sizeContentMD="md:w-2/3"
      >
        <AddClientForm
          onSuccess={() => {
            setIsModalOpen(false);
            getReferrals();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </BottomModal>
    </>
  );
};

export default MyReferralsTable;
