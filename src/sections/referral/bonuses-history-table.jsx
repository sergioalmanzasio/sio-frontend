import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import useBonus from "../../hooks/useBonus";
import InlineAlert from "../../components/alert/InlineAlert";

const ITEMS_PER_PAGE = 10;

const STATUS_COLORS = {
  "Generado": "bg-yellow-100 text-yellow-700 border border-yellow-300",
  "Solicitado": "bg-orange-100 text-orange-700 border border-orange-300",
  "Pagado": "bg-green-100 text-green-700 border border-green-300",
};

const STATUS_OPTIONS = ["Todos", "Generado", "Solicitado", "Pagado"];

const BonusesHistoryTable = () => {
  const { getBonusesHistory, loading } = useBonus();
  const [bonuses, setBonuses] = useState([]);
  const [totalBonus, setTotalBonus] = useState("$ 0");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    setCurrentPage(1);
    loadData(status);
  };

  const loadData = useCallback(async (status = "Todos") => {
    try {
      const response = await getBonusesHistory({ status_name: status });
      if (response && response.data) {
        setTotalBonus(response.data.total_bonus || "$ 0");
        if (Array.isArray(response.data.bonuses)) {
          setBonuses(response.data.bonuses);
        } else {
          setBonuses([]);
        }
      } else {
        setBonuses([]);
      }
    } catch (error) {
      console.error("Error loading bonuses history:", error);
      setBonuses([]);
    }
  }, [getBonusesHistory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalPages = Math.ceil(bonuses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBonuses = bonuses.slice(startIndex, endIndex);

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
      {loading && bonuses.length === 0 && <FullScreenLoader show={true} message="Cargando historial de bonos..." />}
      <InlineAlert
        title="Total de bonos cobrados"
        message={<span>El total de tus bonos cobrados es <span className="font-bold text-cyan-700 text-lg">{totalBonus}</span></span>}
        type="info"
      />

      
      <div className={`mt-4 flex items-center gap-3 ${bonuses.length === 0 ? "hidden" : ""}`}>
        <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
        <select
          id="statusFilter"
          value={selectedStatus}
          onChange={handleStatusChange}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-sm mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-teal-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Bono</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Generado</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Solicitado</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Pagado</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentBonuses.length > 0 ? (
              currentBonuses.map((item, index) => (
                <tr key={item.bonus_transaction_id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-bold text-teal-600">{item.bonus_amount_formatted}</span>
                      <span className="text-xs text-gray-500 sm:hidden mt-1">{item.generated_at}</span>
                      <span className="text-xs text-gray-500 md:hidden mt-1">Sol: {item.requested_at || "—"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                    {item.generated_at}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                    {item.requested_at || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                    {item.paid_at || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    {getStatusBadge(item.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    No se encontraron bonos en el historial.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {bonuses.length > 0 && (
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
                Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(endIndex, bonuses.length)}</span> de <span className="font-medium">{bonuses.length}</span> resultados
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

export default BonusesHistoryTable;
