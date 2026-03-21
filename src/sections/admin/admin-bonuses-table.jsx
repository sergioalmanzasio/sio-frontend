import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Edit2, ChevronLeft, ChevronRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import useBonus from "../../hooks/useBonus";
import BonusFormModal from "../../components/modals/BonusFormModal";

const ITEMS_PER_PAGE = 10;

const AdminBonusesTable = () => {
  const { getBonusHistory, createBonus, updateBonus, loading } = useBonus();
  const [bonuses, setBonuses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBonus, setEditingBonus] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const loadData = useCallback(async () => {
    const response = await getBonusHistory();
    if (response && response.process === "success") {
      setBonuses(response.data || []);
    }
  }, [getBonusHistory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtering
  const filteredBonuses = bonuses.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.title || "").toLowerCase().includes(term) ||
      (item.description || "").toLowerCase().includes(term) ||
      (item.is_active || "").toLowerCase().includes(term)
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
      const valA = (a[sortColumn] ?? "").toString().toLowerCase();
      const valB = (b[sortColumn] ?? "").toString().toLowerCase();
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredBonuses, sortColumn, sortDirection]);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(sortedBonuses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBonuses = sortedBonuses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleOpenCreateModal = () => {
    setEditingBonus(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (bonus) => {
    setEditingBonus(bonus);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBonus(null);
  };

  const handleSubmit = async (formData) => {
    let result;
    if (editingBonus) {
      result = await updateBonus(editingBonus.id, formData);
    } else {
      result = await createBonus(formData);
    }

    if (result && result.process === "success") {
      handleCloseModal();
      loadData();
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-0 mt-4 max-w-6xl" >
      {loading && bonuses.length === 0 && (
        <FullScreenLoader show={loading} message="Cargando historial de bonos..." />
      )}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        
        {/* Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar por título, descripción o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
          onClick={handleOpenCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors btn-gradient"
        >
          <Plus className="h-4 w-4" />
          Crear Bono
        </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-500 ">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("title")}
                >
                  Bono <SortIcon column="title" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("bonus_amount_formatted")}
                >
                  Tipo y Monto <SortIcon column="bonus_amount_formatted" />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("apply_type")}
                >
                  Condiciones
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("valid_from")}
                >
                  Vigencia 
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBonuses.length > 0 ? (
                currentBonuses.map((bonus) => (
                  <tr key={bonus.id || bonus._id || bonus.title} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{bonus.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2" title={bonus.description}>
                        {bonus.description}
                      </div >
                      <div className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1.5
                          ${bonus.is_active === "Activo"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}>
                        {bonus.is_active}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {bonus.bonus_type === "PERCENTAGE" ? "Porcentaje" : "Dinero"}
                      </span>
                      <div className="text-sm text-gray-900 mt-1 font-bold">
                        {bonus.bonus_type === "MONEY" ? `${bonus.bonus_amount_formatted}` : `${0}%`}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div><span className="font-medium text-gray-700">Aplica en:</span> {bonus.apply_type}</div>
                      <div><span className="font-medium text-gray-700">Máx. veces:</span> {
                      bonus.apply_type === "Cada venta" ? "Ilimitado" : bonus.max_times_per_user
                      }</div>
                      <div><span className="font-medium text-gray-700">Min. ventas:</span> {bonus.min_sales_required}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div><span className="font-medium">Desde:</span> {bonus.valid_from_formatted}</div>
                      <div><span className="font-medium">Hasta:</span> {bonus.valid_until_formatted}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenEditModal(bonus)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors inline-flex items-center cursor-pointer"
                        title="Editar bono"
                      >
                        <Edit2 className="h-4 w-4 cursor-pointer" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No hay bonos registrados o que coincidan con la búsqueda.
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

      <BonusFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingBonus}
        loading={loading}
      />
    </div>
  );
};

export default AdminBonusesTable;
