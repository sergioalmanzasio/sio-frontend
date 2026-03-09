import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import useReferral from "../../hooks/useReferral";
import InlineAlert from "../../components/alert/InlineAlert";

const ITEMS_PER_PAGE = 10;

const STATUS_COLORS = {
  terminada: "bg-green-100 text-green-800",
  aprobada: "bg-cyan-100 text-cyan-800",
  "en proceso": "bg-pink-100 text-pink-800",
  "no aprobada": "bg-red-100 text-red-800",
  suspendida: "bg-violet-100 text-violet-800",
  pendiente: "bg-yellow-100 text-yellow-800",
};

const getStatusColor = (status) => {
  return STATUS_COLORS[(status || "").toLowerCase()] || "bg-gray-100 text-gray-600";
};

const AdminServiceRequestsTable = () => {
  const { getAdminServiceRequests, loadingAdminServiceRequests } = useReferral();
  const [requests, setRequests] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const loadData = useCallback(async () => {
    try {
      const response = await getAdminServiceRequests();
      if (response && response.process === "success") {
        setTotalCount(response.count || 0);
        if (Array.isArray(response.data)) {
          setRequests(response.data);
        } else {
          setRequests([]);
        }
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error loading service requests:", error);
      setRequests([]);
    }
  }, [getAdminServiceRequests]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtering by referral name or status
  const filteredRequests = requests.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const referralName = (item.referral_name || "").toLowerCase();
    const status = (item.status || "").toLowerCase();
    return referralName.includes(term) || status.includes(term);
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

  const sortedRequests = useMemo(() => {
    if (!sortColumn) return filteredRequests;
    return [...filteredRequests].sort((a, b) => {
      const valA = (a[sortColumn] ?? "").toString().toLowerCase();
      const valB = (b[sortColumn] ?? "").toString().toLowerCase();
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRequests, sortColumn, sortDirection]);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedRequests.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRequests = sortedRequests.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loadingAdminServiceRequests && requests.length === 0) {
    return <FullScreenLoader show={loadingAdminServiceRequests} message="Cargando solicitudes de servicio..." />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <InlineAlert
        title="Información"
        message={<span>Total de solicitudes de servicio registradas hasta la fecha: <b className="font-semibold text-lg text-blue-400">{totalCount}</b></span>}
        type="info"
        show={true}
      />

      {/* Search */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-sm mt-6">
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar por nombre de referido o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm "
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                onClick={() => handleSort("referral_name")}
              >
                Referido <SortIcon column="referral_name" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                onClick={() => handleSort("offer_name")}
              >
                Oferta <SortIcon column="offer_name" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                onClick={() => handleSort("filing_number")}
              >
                Radicado <SortIcon column="filing_number" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                onClick={() => handleSort("status")}
              >
                Estado <SortIcon column="status" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                onClick={() => handleSort("created_at_formatted")}
              >
                Fecha de solicitud <SortIcon column="created_at_formatted" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                onClick={() => handleSort("coordinate_service_assigned")}
              >
                Coordinador <SortIcon column="coordinate_service_assigned" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden xl:table-cell cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                onClick={() => handleSort("tracking_code")}
              >
                Código <SortIcon column="tracking_code" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentRequests.length > 0 ? (
              currentRequests.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-bold">{item.referral_name || "N/A"}</span>
                      <span className="text-xs text-gray-500 md:hidden mt-1">Radicado: {item.filing_number}</span>
                      <span className="text-xs text-gray-400 lg:hidden mt-1">Fecha de solicitud: {item.created_at_formatted}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{item.offer_name}</span>
                      <span className="text-xs text-gray-500 mt-0.5">{item.offer_description}</span>
                      <span className="text-xs font-medium text-indigo-600 mt-0.5">{item.offer_price}</span>
                      <span className="text-xs text-gray-500 mt-0.5">Operador: {item.operator_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                    <span className="bg-gray-100 px-2 py-1 rounded font-medium">{item.filing_number}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                    {item.created_at_formatted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                    {item.coordinate_service_assigned || "Sin asignar"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden xl:table-cell">
                    <span className="bg-gray-100 px-2 py-1 rounded font-bold">{item.tracking_code}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-600">No se encontraron solicitudes de servicio</p>
                    <p className="text-gray-400 mt-1">Intenta con otros criterios de búsqueda.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sortedRequests.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-md">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Anterior
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{sortedRequests.length > 0 ? startIndex + 1 : 0}</span> a{" "}
                <span className="font-medium">{Math.min(endIndex, sortedRequests.length)}</span> de{" "}
                <span className="font-medium">{sortedRequests.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-500 hover:bg-gray-50"
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
                    currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-500 hover:bg-gray-50"
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

export default AdminServiceRequestsTable;
