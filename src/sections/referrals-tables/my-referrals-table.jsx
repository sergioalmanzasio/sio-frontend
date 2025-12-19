import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const { myReferrals, loadingMyReferrals } = useReferral();
  const { isAuthenticated, userData, logout } = useAuth();
  const [referrals, setReferrals] = useState([]);
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

  // Pagination calculations
  const totalPages = Math.ceil(referrals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReferrals = referrals.slice(startIndex, endIndex);

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
        <div class="flex flex-col gap-2 text-justify mb-2">
          <h4 class="text-lg font-bold text-justify text-blue-600">Información del cliente</h4>
          ${itemModal('Nombre', referral.full_name)}
          ${itemModal('Código de seguimiento', referral.code)}
          ${itemModal('Fecha de registro', referral.created_at_formatted)}
          ${itemModal('Estado', referral.is_active ? 'Activo' : 'Inactivo')}
        </div>
        <div class="h-1 w-full bg-gray-100 my-4"></div>
        <div class="flex flex-col gap-2 text-justify mb-2">
          <h4 class="text-lg font-bold text-justify text-blue-600">Información de contacto</h4>
          ${itemModal('Teléfono', '300' + referral.phone)}
          ${itemModal('Correo', referral.email)}
          
        </div>
        <div class="h-1 w-full bg-gray-100 my-4"></div>
        <div class="flex flex-col gap-2 text-justify mb-2">
          <h4 class="text-lg font-bold text-justify text-blue-600">Información de localización</h4>
          ${itemModal('Departamento', referral.department)}
          ${itemModal('Ciudad', referral.city)}
          ${itemModal('Barrio', referral.neighborhood)}
          ${itemModal('Dirección', referral.address)}
        </div>
        <div class="h-1 w-full bg-gray-100 my-4"></div>
        <div class="flex flex-col gap-2 text-justify mb-2">
          <h4 class="text-lg font-bold text-justify text-blue-600">Información de compras</h4>
          ${itemModal('Compras realizadas', 'PENDIENTE DE REALIZAR')}
        </div>
      `,
      confirmText: 'Cerrar',
      isCancelButtonVisible: false,
      confirmCallback: () => {
        console.log('Modal cerrado');
      },
    });
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
      Ver más
    </button>
  );

  if (loadingMyReferrals) {
    return <FullScreenLoader show={loadingMyReferrals} message="Cargando referidos..." />;
  }

  return (
    <>
      <div className="w-full md:w-3/4 mt-0 md:mt-4 mx-auto p-4 md:p-0">
        <GradientButton
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 cursor-pointer transform hover:scale-105 transition-transform mb-4"
        >
          Agregar referido
        </GradientButton>
        <div className="overflow-x-auto bg-white shadow-lg rounded-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-400 text-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nombre del Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Código de Seguimiento</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {buttonDetails(referral)}
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
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                  <span className="font-medium">{Math.min(endIndex, referrals.length)}</span> de{' '}
                  <span className="font-medium">{referrals.length}</span> resultados
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
        title="Agregar Cliente Referido"
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
