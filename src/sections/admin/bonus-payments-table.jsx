import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import useBonus from "../../hooks/useBonus";
import InlineAlert from "../../components/alert/InlineAlert";

const ITEMS_PER_PAGE = 10;

const BonusPaymentsTable = () => {
  const { getDetailedPaidBonuses, loading } = useBonus();
  const [bonuses, setBonuses] = useState([]);
  const [totalAmount, setTotalAmount] = useState("$ 0");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const loadData = useCallback(async () => {
    try {
      const response = await getDetailedPaidBonuses();
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          setBonuses(response.data);
          setTotalAmount(response.total_amount || "$ 0");
        } else {
          setBonuses([]);
        }
      } else {
        setBonuses([]);
      }
    } catch (error) {
      console.error("Error loading paid bonuses:", error);
      setBonuses([]);
    }
  }, [getDetailedPaidBonuses]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtering by referral name or account number
  const filteredBonuses = bonuses.filter(bonus => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const name = (bonus.referral_name || "").toLowerCase();
    const account = (bonus.account_number || "").toLowerCase();
    return name.includes(term) || account.includes(term);
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
      if (sortColumn === "bonus_amount") {
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

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedBonuses.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBonuses = sortedBonuses.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="w-full mt-0 md:mt-4 mx-auto p-4 md:p-0 max-w-6xl">
      {loading && bonuses.length === 0 && (
        <FullScreenLoader show={true} message="Cargando bonos pagados..." />
      )}
      <div className="mb-4">
        <InlineAlert
          title="Total pagado"
          message={<span>Total pagado en bonos a la fecha: <span className="font-bold text-cyan-600 text-xl">{totalAmount}</span></span>}
          icon="check"
        />
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Buscar por nombre del referido o número de cuenta..."
          className="w-full md:w-2/4 pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-emerald-500 text-white">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none hover:bg-emerald-600 transition-colors"
                onClick={() => handleSort("referral_name")}
              >
                Referido <SortIcon column="referral_name" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell cursor-pointer select-none hover:bg-emerald-600 transition-colors"
                onClick={() => handleSort("bonus_amount")}
              >
                Monto <SortIcon column="bonus_amount" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell cursor-pointer select-none hover:bg-emerald-600 transition-colors"
                onClick={() => handleSort("requested_at")}
              >
                Fecha solicitud <SortIcon column="requested_at" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell cursor-pointer select-none hover:bg-emerald-600 transition-colors"
                onClick={() => handleSort("paid_at")}
              >
                Fecha pago <SortIcon column="paid_at" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell cursor-pointer select-none hover:bg-emerald-600 transition-colors"
                onClick={() => handleSort("bank_name")}
              >
                Datos bancarios <SortIcon column="bank_name" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentBonuses.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    No hay bonos pagados disponibles.
                  </div>
                </td>
              </tr>
            ) : (
              currentBonuses.map((bonus, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-bold">{bonus.referral_name || "N/A"}</span>
                      <span className="text-xs text-gray-500 lg:hidden mt-1">
                        <span className="font-semibold">Pago:</span> {bonus.paid_at || "N/A"}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 sm:hidden mt-1">
                        {bonus.bonus_amount_formmated || "$ 0"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600 hidden sm:table-cell">
                    {bonus.bonus_amount_formmated || "$ 0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                    {bonus.requested_at || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                    {bonus.paid_at || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                    <p className="font-semibold">{bonus.bank_name || "N/A"}</p>
                    <p>{bonus.account_number || "N/A"}</p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sortedBonuses.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-md">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              Anterior
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{sortedBonuses.length > 0 ? startIndex + 1 : 0}</span> a{' '}
                <span className="font-medium">{Math.min(endIndex, sortedBonuses.length)}</span> de{' '}
                <span className="font-medium">{sortedBonuses.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50 cursor-pointer'
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
                    currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50 cursor-pointer'
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

export default BonusPaymentsTable;
