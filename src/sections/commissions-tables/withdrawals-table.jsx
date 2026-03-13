import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import ToastAlert from "../../components/alerts/ToastAlert";
import useReferral from "../../hooks/useReferral";
import Swal from "sweetalert2";
import InlineAlert from "../../components/alert/InlineAlert";

const ITEMS_PER_PAGE = 10;

// Helper: parse formatted currency string like "$ 50.000" or "$ 1.200.000" to number
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

const WithdrawalsTable = () => {
  const { getPaymentRequirements, loadingGetPaymentRequirements, payCommission, loadingPayCommission } = useReferral();
  const [withdrawals, setWithdrawals] = useState([]);
  const [totalAmount, setTotalAmount] = useState("$ 0");
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedIds, setSelectedIds] = useState(new Set());

  const loadData = useCallback(async () => {
    try {
      const response = await getPaymentRequirements();
      if (response && response.process === "success") {
        setTotalAmount(response.total_amount || "$ 0");
        if (Array.isArray(response.data)) {
          setWithdrawals(response.data);
        } else {
          setWithdrawals([]);
        }
      } else {
        setWithdrawals([]);
      }
    } catch (error) {
      console.error("Error loading withdrawals:", error);
      setWithdrawals([]);
    }
    setSelectedIds(new Set());
  }, [getPaymentRequirements]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtering
  const filteredWithdrawals = withdrawals.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.referral_name?.toLowerCase().includes(term) ||
      item.account_number?.toLowerCase().includes(term)
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

  const sortedWithdrawals = useMemo(() => {
    if (!sortColumn) return filteredWithdrawals;
    return [...filteredWithdrawals].sort((a, b) => {
      const valA = (a[sortColumn] ?? "").toString().toLowerCase();
      const valB = (b[sortColumn] ?? "").toString().toLowerCase();
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredWithdrawals, sortColumn, sortDirection]);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedWithdrawals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentWithdrawals = sortedWithdrawals.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
    const pageIds = currentWithdrawals.map((item) => item.referral_commission_id);
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

  const allPageSelected = currentWithdrawals.length > 0 && currentWithdrawals.every((item) => selectedIds.has(item.referral_commission_id));
  const somePageSelected = currentWithdrawals.some((item) => selectedIds.has(item.referral_commission_id));

  // Compute selected total
  const selectedItems = useMemo(() => {
    return withdrawals.filter((item) => selectedIds.has(item.referral_commission_id));
  }, [withdrawals, selectedIds]);

  const selectedTotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + parseCurrency(item.commission_to_pay), 0);
  }, [selectedItems]);

  // Handle pay all selected
  const handlePayAll = () => {
    if (selectedIds.size === 0) return;

    const listHtml = selectedItems
      .map(
        (item) =>
          `<tr>
            <td class="py-1 pr-3 text-left">${item.referral_name}</td>
            <td class="py-1 pr-3 text-left">${item.bank_name}</td>
            <td class="py-1 text-right font-semibold">${item.commission_to_pay}</td>
          </tr>`
      )
      .join("");

    Swal.fire({
      title: "¿Pagar todas las comisiones seleccionadas?",
      html: `
        <p class="text-center text-orange-400 font-semibold mb-4">Esta acción no se podrá deshacer.</p>
        <div class="bg-gray-100 p-4 rounded-lg text-sm mt-2 text-left max-h-60 overflow-y-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-300">
                <th class="py-1 text-left text-xs uppercase text-gray-500">Referido</th>
                <th class="py-1 text-left text-xs uppercase text-gray-500">Banco</th>
                <th class="py-1 text-right text-xs uppercase text-gray-500">Monto</th>
              </tr>
            </thead>
            <tbody>${listHtml}</tbody>
          </table>
        </div>
        <div class="mt-4 p-3 bg-teal-50 rounded-lg">
          <p class="text-center font-bold text-teal-700 text-lg">Total: ${formatCurrency(selectedTotal)}</p>
          <p class="text-center text-sm text-gray-500">${selectedIds.size} comisión(es) seleccionada(s)</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: "btn-gradient",
        cancelButton: "btn-cancel",
        popup: "swal-wide",
      },
      confirmButtonText: "Sí, pagar todas",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const tokens = Array.from(selectedIds);
        console.log("Tokens seleccionados para pago:", tokens);

        // Show loading state
        Swal.fire({
          title: "Procesando pagos...",
          text: "Esto puede tomar unos momentos.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        // Process payments sequentially
        let successCount = 0;
        let errorCount = 0;
        for (const id of tokens) {
          try {
            const response = await payCommission(id);
            if (response && response.process === "success") {
              successCount++;
            } else {
              errorCount++;
            }
          } catch (error) {
            console.error("Error al pagar comisión:", id, error);
            errorCount++;
          }
        }

        if (successCount > 0) {
          ToastAlert({
            position: "center",
            timer: 3000,
            icon: "success",
            title: `${successCount} pago(s) registrado(s) exitosamente${errorCount > 0 ? `, ${errorCount} con error` : ""}`,
          });
        } else {
          ToastAlert({
            position: "center",
            timer: 3000,
            icon: "error",
            title: "Error al procesar los pagos",
          });
        }

        setSelectedIds(new Set());
        await loadData();
      }
    });
  };

  const handlePayment = (commission) => {
   Swal.fire({
    title: '¿Esta comisión ha sido pagada?',
    html: `
      <p class="text-center text-orange-400 font-semibold mb-4">Esta acción no se podrá deshacer.</p>
      <div class="bg-gray-100 p-4 rounded-lg text-sm mt-2 text-justify">
        <h4 class="font-semibold text-lg">Datos de pago</h4>
        <p>Referido: ${commission.referral_name}</p>
        <p>Comisión pagada: <span class="font-semibold text-lg">${commission.commission_to_pay}</span></p>
        <p>Banco: <span class="font-semibold text-lg">${commission.bank_name}</span></p>
        <p>No. de cuenta: <span class="font-semibold text-lg">${commission.account_number}</span></p>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    customClass: {
     confirmButton: 'btn-gradient',
     cancelButton: 'btn-cancel',
    },
    confirmButtonText: 'Sí, pagada',
    cancelButtonText: 'Cancelar'
   }).then(async (result) => {
    if (result.isConfirmed) {
      setProcessingId(commission.referral_commission_id);
      try {
        const response = await payCommission(commission.referral_commission_id);
        if (response && response.process === "success") {
          ToastAlert({
            position: 'center',
            timer: 2000,
            icon: 'success',
            title: response.message || 'Pago registrado exitosamente',
          });
          await loadData();
        } else {
          ToastAlert({
            position: 'center',
            timer: 2000,
            icon: 'error',
            title: response?.message || 'Error al procesar el pago',
          });
        }
      } catch (error) {
        console.error("Error al pagar la comisión:", error);
      } finally {
        setProcessingId(null);
      }
    }
   });
  };

  if (loadingGetPaymentRequirements) {
    return <FullScreenLoader show={loadingGetPaymentRequirements} message="Cargando solicitudes de pagos..." />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <InlineAlert
        title="Comisiones por pagar"
        message={<span>Monto total en comisiones por pagar a la fecha: <b className="font-semibold text-lg">{totalAmount}</b>.</span>}
        type="info"
        show={true}
      />

      <div className="overflow-x-auto bg-white shadow-lg rounded-sm mt-6">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar por nombre o número de cuenta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <span className="text-sm text-gray-600 whitespace-nowrap">
                <span className="font-semibold text-teal-600">{selectedIds.size}</span> seleccionado(s) — Total: <span className="font-bold text-teal-700">{formatCurrency(selectedTotal)}</span>
              </span>
            )}
            <button
              onClick={handlePayAll}
              disabled={selectedIds.size === 0}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 shadow-md whitespace-nowrap ${
                selectedIds.size === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 text-white cursor-pointer hover:shadow-lg transform hover:scale-105"
              }`}
            >
              Pagar todas
            </button>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-teal-500 text-white">
            <tr>
              <th className="px-3 py-3 text-center w-10">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  ref={(el) => { if (el) el.indeterminate = somePageSelected && !allPageSelected; }}
                  onChange={handleSelectAllPage}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none hover:bg-teal-600 transition-colors"
                onClick={() => handleSort("referral_name")}
              >
                Referido <SortIcon column="referral_name" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell cursor-pointer select-none hover:bg-teal-600 transition-colors"
                onClick={() => handleSort("bank_name")}
              >
                Banco <SortIcon column="bank_name" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell cursor-pointer select-none hover:bg-teal-600 transition-colors"
                onClick={() => handleSort("account_number")}
              >
                Cuenta <SortIcon column="account_number" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none hover:bg-teal-600 transition-colors"
                onClick={() => handleSort("commission_to_pay")}
              >
                A pagar <SortIcon column="commission_to_pay" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell cursor-pointer select-none hover:bg-teal-600 transition-colors"
                onClick={() => handleSort("requiered_at")}
              >
                Fecha solicitud <SortIcon column="requiered_at" />
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentWithdrawals.length > 0 ? (
              currentWithdrawals.map((item, index) => {
                const isSelected = selectedIds.has(item.referral_commission_id);
                return (
                  <tr key={index} className={`hover:bg-gray-50 transition-colors ${isSelected ? "bg-teal-50" : ""}`}>
                    <td className="px-3 py-4 text-center w-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(item.referral_commission_id)}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span>{item.referral_name}</span>
                        <span className="text-xs text-gray-500 sm:hidden">
                          {item.bank_name} - {item.account_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell font-medium">
                      {item.bank_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                      {item.account_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col">
                        <span className="font-semibold text-teal-600 text-md">{item.commission_to_pay}</span>
                        <span className="text-xs text-gray-500">{item.commission_type} ({item.commission_value})</span>
                        <span className="text-xs text-gray-500">Valor base: {item.base_amount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                      {item.requiered_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex flex-col w-1/2 mx-auto text-center items-center gap-2">
                        <button 
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-150 shadow-md ${
                            processingId === item.referral_commission_id
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-teal-100 hover:bg-teal-200 cursor-pointer hover:shadow-lg transform hover:scale-105 text-teal-600 hover:text-gray-800'
                          }`}
                          onClick={() => handlePayment(item)}
                          disabled={processingId === item.referral_commission_id}
                        >
                          {processingId === item.referral_commission_id ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Procesando...
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
                    <p className="text-lg font-medium text-gray-600">No hay solicitudes de pago disponibles</p>
                    <p className="text-gray-400 mt-1">Cuando los referidos soliciten pagos, aparecerán aquí.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sortedWithdrawals.length > 0 && (
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
                Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, sortedWithdrawals.length)}</span> de <span className="font-medium">{sortedWithdrawals.length}</span> resultados
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

export default WithdrawalsTable;
