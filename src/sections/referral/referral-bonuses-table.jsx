import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, CheckCircle, HandCoins } from "lucide-react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import useBonus from "../../hooks/useBonus";
import ToastAlert from "../../components/alerts/ToastAlert";
import ModalAlertConfirm from "../../components/alerts/ModalAlertConfirm";
import InlineAlert from "../../components/alert/InlineAlert";

const ITEMS_PER_PAGE = 10;

const ReferralBonusesTable = () => {
  const { getGeneratedBonuses, requestBonusPayment, loading } = useBonus();
  
  const [bonuses, setBonuses] = useState([]);
  const [totalBonus, setTotalBonus] = useState("$ 0");
  const [selectedIds, setSelectedIds] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const loadData = useCallback(async () => {
    const result = await getGeneratedBonuses();
    if (result && result.process === "success") {
      setBonuses(result.data.data || []);
      setTotalBonus(result.total_bonus || "$ 0");
    }
  }, [getGeneratedBonuses]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtering by date
  const filteredBonuses = bonuses.filter((item) => {
    if (!dateFilter) return true;
    return (item.created_at_formatted || "").toLowerCase().includes(dateFilter.toLowerCase());
  });

  // Sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return <ArrowUpDown className="inline ml-1 h-3.5 w-3.5 opacity-50" />;
    return sortDirection === "asc"
      ? <ArrowUp className="inline ml-1 h-3.5 w-3.5" />
      : <ArrowDown className="inline ml-1 h-3.5 w-3.5" />;
  };

  const sortedBonuses = useMemo(() => {
    if (!sortColumn) return filteredBonuses;
    return [...filteredBonuses].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (sortColumn === 'bonus_amount') {
         valA = Number(valA || 0);
         valB = Number(valB || 0);
      } else {
         valA = (valA ?? "").toString().toLowerCase();
         valB = (valB ?? "").toString().toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredBonuses, sortColumn, sortDirection]);

  // Reset page when filtering
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]); // Clear selections on filter
  }, [dateFilter]);

  const totalPages = Math.ceil(sortedBonuses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBonuses = sortedBonuses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentBonuses.length && currentBonuses.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentBonuses.map(b => b.bonus_transaction_id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleRequestPayment = (ids) => {
    ModalAlertConfirm({
      title: "Solicitar pago de bono",
      text: `¿Estás seguro de solicitar el pago para ${ids.length} bono(s)?`,
      confirmText: "Solicitar",
      cancelText: "Cancelar",
      confirmCallback: async () => {
        const result = await requestBonusPayment(ids);
        if (result && result.process === "success") {
          ToastAlert({ position: "top", timer: 1800, icon: "success", title: "Solicitud de pago enviada correctamente." });
          setTimeout(() => {
            setSelectedIds([]);
            loadData();
          }, 1800);
        }
      }
    });
  };

  if (loading && bonuses.length === 0) {
    return <FullScreenLoader show={true} message="Cargando tus bonos..." />;
  }

  return (
    <div className="w-full md:w-3/4 mt-0 md:mt-4 mx-auto p-4 md:p-0">
      {/* Inline Alert con el total */}
      <InlineAlert
        type="info"
        title="Disponible para cobrar"
        message={`Total disponible para cobrar: ${totalBonus}`}
      />
      

      <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4">
        {/* Actions Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-1/2 md:w-1/3">
            <input
              type="text"
              placeholder="Filtrar por fecha o mes (Ej. Mar de 2026)"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button
            onClick={() => handleRequestPayment(selectedIds)}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm ${
              selectedIds.length > 0 
                ? 'bg-cyan-200 hover:bg-cyan-300 text-cyan-900 shadow-sm cursor-pointer border border-cyan-500' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <HandCoins className="h-5 w-5" />
            Solicitar pago ({selectedIds.length})
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-cyan-500">
              <tr>
                <th className="px-6 py-3 text-left w-12">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 accent-cyan-200 rounded border-gray-300 cursor-pointer"
                    checked={selectedIds.length === currentBonuses.length && currentBonuses.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-cyan-600 transition-colors"
                  onClick={() => handleSort("bonus_amount")}
                >
                  Cantidad <SortIcon column="bonus_amount" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-cyan-600 transition-colors"
                  onClick={() => handleSort("created_at_formatted")}
                >
                  Fecha de Generación <SortIcon column="created_at_formatted" />
                </th>
                {/* <th 
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("apply_type")}
                >
                  Tipo de Aplicación <SortIcon column="apply_type" />
                </th> */}
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-cyan-600 transition-colors"
                  onClick={() => handleSort("bonus_status_translate")}
                >
                  Estado <SortIcon column="bonus_status_translate" />
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBonuses.length > 0 ? (
                currentBonuses.map((bonus) => (
                  <tr key={bonus.bonus_transaction_id} className={`hover:bg-gray-50 ${selectedIds.includes(bonus.bonus_transaction_id) ? 'bg-teal-50' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 accent-cyan-200 rounded border-gray-300 cursor-pointer"
                        checked={selectedIds.includes(bonus.bonus_transaction_id)}
                        onChange={() => toggleSelect(bonus.bonus_transaction_id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold">
                        {bonus.bonus_amount_formatted}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bonus.created_at_formatted}</div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {bonus.apply_type}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {bonus.bonus_status_translate}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleRequestPayment([bonus.bonus_transaction_id])}
                        className="text-white hover:bg-cyan-600 bg-cyan-500 px-3 py-1.5 rounded-md transition-colors inline-flex items-center cursor-pointer shadow-sm text-xs font-medium"
                        title="Solicitar pago"
                      >
                        Cobrar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No hay bonos generados o no coinciden con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sortedBonuses.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, sortedBonuses.length)}</span> de <span className="font-medium">{sortedBonuses.length}</span> resultados
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
    </div>
  );
};

export default ReferralBonusesTable;
