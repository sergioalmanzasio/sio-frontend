import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import ToastAlert from "../../components/alerts/ToastAlert";
import useReferral from "../../hooks/useReferral";
import { useAuth } from "../../context/AuthContext";
import InlineAlert from "../../components/alert/InlineAlert";

const ITEMS_PER_PAGE = 10;

const CommissionPaymentsTable = () => {
  const { userData } = useAuth();
  const { getDetailedPaidCommissions, loadingDetailedPaidCommissions } = useReferral();
  const [commissions, setCommissions] = useState([]);
  const [totalCommission, setTotalCommission] = useState("$ 0");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const loadData = useCallback(async () => {
    if (userData?.email) {
      try {
        const response = await getDetailedPaidCommissions();
        if (response && response.data) {
          if (Array.isArray(response.data)) {
            setCommissions(response.data);
            setTotalCommission(response.total_amount);
          } else {
            setCommissions([]);
          }
        } else {
          setCommissions([]);
        }
      } catch (error) {
        console.error("Error loading paid commissions:", error);
        setCommissions([]);
      }
    }
  }, [userData?.email, getDetailedPaidCommissions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtering
  const filteredCommissions = commissions.filter(commission => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const clientName = (commission.referral_name || "").toLowerCase();
    const trackingCode = (commission.tracking_code || "").toLowerCase();
    return clientName.includes(term) || trackingCode.includes(term);
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

  const sortedCommissions = useMemo(() => {
    if (!sortColumn) return filteredCommissions;
    return [...filteredCommissions].sort((a, b) => {
      const valA = (a[sortColumn] ?? "").toString().toLowerCase();
      const valB = (b[sortColumn] ?? "").toString().toLowerCase();
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredCommissions, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedCommissions.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCommissions = sortedCommissions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="w-full md:w-4/4 mt-0 md:mt-4 mx-auto p-4 md:p-0">
      {loadingDetailedPaidCommissions && commissions.length === 0 && (
        <FullScreenLoader show={loadingDetailedPaidCommissions} message="Cargando comisiones pagadas..." />
      )}
      <div className="mb-4">
        <InlineAlert 
          title="Total pagado en comisiones" 
          message={<span>Total pagado en comisiones a la fecha: <span class="font-bold text-cyan-600 text-xl">{totalCommission}</span></span>}
          icon="check" 
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Buscar por nombre del referido o código de seguimiento..."
          className="w-full md:w-2/4 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-400 text-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none hover:bg-blue-500 transition-colors"
                onClick={() => handleSort("referral_name")}
              >
                Referido <SortIcon column="referral_name" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell cursor-pointer select-none hover:bg-blue-500 transition-colors"
                onClick={() => handleSort("commission_amount_formmated")}
              >
                Monto <SortIcon column="commission_amount_formmated" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell cursor-pointer select-none hover:bg-blue-500 transition-colors"
                onClick={() => handleSort("requested_at")}
              >
                Fecha de solicitud <SortIcon column="requested_at" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell cursor-pointer select-none hover:bg-blue-500 transition-colors"
                onClick={() => handleSort("paid_at")}
              >
                Fecha de pago <SortIcon column="paid_at" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell cursor-pointer select-none hover:bg-blue-500 transition-colors"
                onClick={() => handleSort("bank_name")}
              >
                Datos bancarios <SortIcon column="bank_name" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell cursor-pointer select-none hover:bg-blue-500 transition-colors"
                onClick={() => handleSort("tracking_code")}
              >
                Código de seguimiento <SortIcon column="tracking_code" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentCommissions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay comisiones pagadas disponibles.
                </td>
              </tr>
            ) : (
              currentCommissions.map((commission, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-bold">{commission.referral_name || "N/A"}</span>
                      <span className="text-xs text-gray-500 md:hidden mt-1">
                        <span className="font-semibold">Código:</span> {commission.tracking_code || commission.code || "N/A"}
                      </span>
                      <span className="text-xs text-gray-500 lg:hidden mt-1">
                        <span className="font-semibold">Fecha pago:</span> {commission.payment_date_formatted || commission.payment_date || commission.created_at_formatted || "N/A"}
                      </span>
                      <span className="text-xs font-bold sm:hidden mt-1">
                        {commission.commission_amount_formmated || "$ 0"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold  hidden sm:table-cell">
                    {commission.commission_amount_formmated || "$ 0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                    {commission.requested_at || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                    {commission.paid_at || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                    <p className="font-semibold">{commission.bank_name || "N/A"}</p>
                    <p>{commission.account_number || "N/A"}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                    <span className="bg-gray-100 px-2 py-1 rounded font-bold">{commission.tracking_code || commission.code || "N/A"}</span>
                  </td>
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sortedCommissions.length > 0 && (
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
                Mostrando <span className="font-medium">{sortedCommissions.length > 0 ? startIndex + 1 : 0}</span> a{' '}
                <span className="font-medium">{Math.min(endIndex, sortedCommissions.length)}</span> de{' '}
                <span className="font-medium">{sortedCommissions.length}</span> resultados
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
  );
};

export default CommissionPaymentsTable;
