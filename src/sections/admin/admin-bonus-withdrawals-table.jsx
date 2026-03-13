import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import ToastAlert from "../../components/alerts/ToastAlert";
import useBonus from "../../hooks/useBonus";
import Swal from "sweetalert2";
import InlineAlert from "../../components/alert/InlineAlert";

const ITEMS_PER_PAGE = 10;

// Helper: parse formatted currency string to number
const parseCurrency = (value) => {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const cleaned = value.toString().replace(/[^0-9.,]/g, "").replace(/\./g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
};

// Helper: format number to COP-style currency string
const formatCurrency = (value) => {
  return "$ " + Math.round(value).toLocaleString("es-CO");
};

const AdminBonusWithdrawalsTable = () => {
  const { getRequestedBonuses, payBonuses, loading } = useBonus();
  const [bonuses, setBonuses] = useState([]);
  const [totalAmount, setTotalAmount] = useState("$ 0");
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedIds, setSelectedIds] = useState(new Set());

  const loadData = useCallback(async () => {
    try {
      const response = await getRequestedBonuses();
      if (response && response.process === "success") {
        setTotalAmount(response.totalBonus || "$ 0");
        if (Array.isArray(response.data)) {
          setBonuses(response.data);
        } else {
          setBonuses([]);
        }
      } else {
        setBonuses([]);
      }
    } catch (error) {
      console.error("Error loading bonuses:", error);
      setBonuses([]);
    }
    setSelectedIds(new Set());
  }, [getRequestedBonuses]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtering
  const filteredBonuses = bonuses.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.referral_name?.toLowerCase().includes(term) ||
      item.bonus_amount_formatted?.toLowerCase().includes(term)
    );
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

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedBonuses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBonuses = sortedBonuses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Multi-select logic
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllPage = () => {
    const pageIds = currentBonuses.map((item) => item.bonus_transaction_id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const allPageSelected = currentBonuses.length > 0 && currentBonuses.every((item) => selectedIds.has(item.bonus_transaction_id));
  const somePageSelected = currentBonuses.some((item) => selectedIds.has(item.bonus_transaction_id));

  // Compute selected total
  const selectedItems = useMemo(() => {
    return bonuses.filter((item) => selectedIds.has(item.bonus_transaction_id));
  }, [bonuses, selectedIds]);

  const selectedTotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + parseCurrency(item.bonus_amount_formatted), 0);
  }, [selectedItems]);

  // Handle pay all selected
  const handlePayAll = () => {
    if (selectedIds.size === 0) return;

    const listHtml = selectedItems
      .map(
        (item) =>
          `<tr>
            <td class="py-1 pr-3 text-left">${item.referral_name}</td>
            <td class="py-1 text-right font-semibold">${item.bonus_amount_formatted}</td>
          </tr>`
      )
      .join("");

    Swal.fire({
      title: "¿Todos los bonos seleccionados han sido pagados?",
      html: `
        <p class="text-center text-orange-400 font-semibold mb-4">Esta acción no se podrá deshacer.</p>
        <div class="bg-gray-100 p-4 rounded-lg text-sm mt-2 text-left max-h-60 overflow-y-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-300">
                <th class="py-1 text-left text-xs uppercase text-gray-500">Referido</th>
                <th class="py-1 text-right text-xs uppercase text-gray-500">Monto</th>
              </tr>
            </thead>
            <tbody>${listHtml}</tbody>
          </table>
        </div>
        <div class="mt-4 p-3 bg-emerald-50 rounded-lg">
          <p class="text-center font-bold text-emerald-700 text-lg">Total: ${formatCurrency(selectedTotal)}</p>
          <p class="text-center text-sm text-gray-500">${selectedIds.size} bono(s) seleccionado(s)</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "btn-gradient",
        cancelButton: "btn-cancel",
        popup: "swal-wide",
      },
      confirmButtonText: "Sí, pagar todos",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const tokens = Array.from(selectedIds);
        console.log("Tokens seleccionados para pago de bonos:", tokens);

        // Show loading state
        Swal.fire({
          title: "Procesando pagos...",
          text: "Esto puede tomar unos momentos.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const result = await payBonuses(tokens);
        Swal.close();

        if (result && result.process === "success") {
          ToastAlert({
            position: "center",
            timer: 3000,
            icon: "success",
            title: result.data?.message || "Pago de bonos registrado exitosamente.",
          });
          setSelectedIds(new Set());
          await loadData();
        }
      }
    });
  };

  const handlePayment = (bonus) => {
   Swal.fire({
    title: '¿Este bono ha sido pagado?',
    html: `
      <p class="text-center text-orange-400 font-semibold mb-4">Esta acción no se podrá deshacer.</p>
      <div class="bg-gray-100 p-4 rounded-lg text-sm mt-2 text-justify">
        <h4 class="font-semibold text-lg">Datos del bono</h4>
        <p>Referido: ${bonus.referral_name}</p>
        <p>Bono a pagar: <span class="font-semibold text-lg">${bonus.bonus_amount_formatted}</span></p>
        <p>Tipo: <span class="font-semibold text-lg">${bonus.apply_type}</span></p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    customClass: {
     confirmButton: 'btn-gradient',
     cancelButton: 'btn-cancel',
    },
    confirmButtonText: 'Sí, pagado',
    cancelButtonText: 'Cancelar'
   }).then(async (result) => {
    if (result.isConfirmed) {
      setProcessingId(bonus.bonus_transaction_id);
      
      const result = await payBonuses([bonus.bonus_transaction_id]);

      if (result && result.process === "success") {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'success',
          title: result.data?.message || 'Pago registrado exitosamente.',
        });
        await loadData();
      }
      setProcessingId(null);
    }
   });
  };

  if (loading && bonuses.length === 0) {
    return <FullScreenLoader show={true} message="Cargando solicitudes de pagos..." />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <InlineAlert
        title="Bonos por pagar"
        message={<span>Monto total en bonos por pagar a la fecha: <b className="font-semibold text-lg">{totalAmount}</b>.</span>}
        type="info"
        show={true}
      />

      {/* Search and Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-sm mt-6">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar por nombre o monto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <span className="text-sm text-gray-600 whitespace-nowrap hidden sm:inline-block">
                <span className="font-semibold text-emerald-600">{selectedIds.size}</span> seleccionado(s) — Total: <span className="font-bold text-emerald-700">{formatCurrency(selectedTotal)}</span>
              </span>
            )}
            <button
              onClick={handlePayAll}
              disabled={selectedIds.size === 0}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 shadow-md whitespace-nowrap ${
                selectedIds.size === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-lg transform hover:scale-105"
              }`}
            >
              Pagar todos
            </button>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-emerald-500 text-white">
            <tr>
              <th className="px-3 py-3 text-center w-10">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected; }}
                  onChange={handleSelectAllPage}
                  className="h-4 w-4 rounded border-gray-300 accent-emerald-200 cursor-pointer"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none hover:bg-emerald-600 transition-colors"
                onClick={() => handleSort("referral_name")}
              >
                Referido <SortIcon column="referral_name" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell cursor-pointer select-none hover:bg-emerald-600 transition-colors"
                onClick={() => handleSort("apply_type")}
              >
                Tipo <SortIcon column="apply_type" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none hover:bg-emerald-600 transition-colors"
                onClick={() => handleSort("bonus_amount")}
              >
                Monto <SortIcon column="bonus_amount" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell cursor-pointer select-none hover:bg-emerald-600 transition-colors"
                onClick={() => handleSort("requested_at_formatted")}
              >
                Fecha de solicitud <SortIcon column="requested_at_formatted" />
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentBonuses.length > 0 ? (
              currentBonuses.map((item, index) => {
                const isSelected = selectedIds.has(item.bonus_transaction_id);
                return (
                  <tr key={item.bonus_transaction_id || index} className={`hover:bg-gray-50 transition-colors ${isSelected ? "bg-emerald-50" : ""}`}>
                    <td className="px-3 py-4 text-center w-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(item.bonus_transaction_id)}
                        className="h-4 w-4 rounded border-gray-300 accent-emerald-200 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span>{item.referral_name}</span>
                        <span className="text-xs text-gray-500 sm:hidden">
                          {item.apply_type} - {item.bonus_status_translate}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell font-medium">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-100 text-cyan-800">
                        {item.apply_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-semibold text-emerald-600 text-md">{item.bonus_amount_formatted}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                      {item.requested_at_formatted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex flex-col w-3/4 mx-auto text-center items-center gap-2">
                        <button 
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 shadow-md ${
                            processingId === item.bonus_transaction_id
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-emerald-100 hover:bg-emerald-200 cursor-pointer hover:shadow-lg transform hover:scale-105 text-emerald-600 hover:text-gray-800'
                          }`}
                          onClick={() => handlePayment(item)}
                          disabled={processingId === item.bonus_transaction_id}
                        >
                          {processingId === item.bonus_transaction_id ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              ...
                            </span>
                          ) : 'Pagada'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-600">No hay bonos solicitados</p>
                    <p className="text-gray-400 mt-1">Acá aparecerán cuando los referidos soliciten cobrar sus bonos.</p>
                  </div>
                </td>
              </tr>
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
  );
};

export default AdminBonusWithdrawalsTable;
