import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import useReferral from "../../hooks/useReferral";
import { useAuth } from "../../context/AuthContext";
import InlineAlert from "../../components/alert/InlineAlert";

const ITEMS_PER_PAGE = 10;

const STATUS_COLORS = {
  "Generada": "bg-gray-100 text-gray-700 border border-gray-300",
  "Disponible para cobrar": "bg-blue-100 text-blue-700 border border-blue-300",
  "Pago solicitado": "bg-yellow-100 text-yellow-700 border border-yellow-300",
  "Pagada": "bg-green-100 text-green-700 border border-green-300",
  "Rechazada": "bg-red-100 text-red-700 border border-red-300",
};

const CommissionsHistoryTable = () => {
  const { userData } = useAuth();
  const { getCommissionsHistory, loadingGetCommissionsHistory } = useReferral();
  const [commissions, setCommissions] = useState([]);
  const [totalCommission, setTotalCommission] = useState("$ 0");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("Todas");

  const STATUS_OPTIONS = ["Todas", "Generada", "Disponible para cobrar", "Pago solicitado", "Pagada", "Rechazada"];

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    setCurrentPage(1);
    loadData(status);
  };

  const loadData = useCallback(async (status = "Todas") => {
    if (userData?.email) {
      try {
        const response = await getCommissionsHistory({ status_name: status });
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
        console.error("Error loading commissions history:", error);
        setCommissions([]);
      }
    }
  }, [userData?.email, getCommissionsHistory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const getStatusBadge = (status) => {
    const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-700 border border-gray-300";
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
        {status}
      </span>
    );
  };

  

  return (
    <div className="w-full md:w-3/4 mt-0 md:mt-4 mx-auto p-4 md:p-0 max-w-6xl">
      {loadingGetCommissionsHistory && <FullScreenLoader show={loadingGetCommissionsHistory} message="Cargando historial de comisiones..." />}
      <InlineAlert
        title="Total de comisiones cobradas"
        message={<span>El total de tus comisiones cobradas es <span className="font-bold text-cyan-700 text-lg">{totalCommission}</span></span>}
        type="info"
      />

      <div className="mt-4 flex items-center gap-3">
        <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
        <select
          id="statusFilter"
          value={selectedStatus}
          onChange={handleStatusChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-sm mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-400 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Comisión</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Fecha de generación</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Código de seguimiento</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentCommissions.length > 0 ? (
              currentCommissions.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-bold">{item.commission_amount_formmated}</span>
                      <span className="text-xs text-gray-500 sm:hidden mt-1">{item.generated_at}</span>
                      <span className="text-xs text-gray-500 md:hidden mt-1">{item.client_name}</span>
                      <span className="text-xs text-gray-400 lg:hidden mt-1">{item.tracking_code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                    <div className="flex flex-col">
                      <span>{item.generated_at}</span>
                      <span className="text-xs text-orange-500">Disponible: {item.available_payment_date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">{item.client_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">{item.tracking_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    {getStatusBadge(item.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron comisiones en el historial.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
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

export default CommissionsHistoryTable;
