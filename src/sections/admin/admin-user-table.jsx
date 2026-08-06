import { useState, useEffect, useMemo } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import useUser from "../../hooks/useUser";
import UserStatusModal from "../../components/modals/UserStatusModal";
import ToastAlert from "../../components/alerts/ToastAlert";

const ITEMS_PER_PAGE = 10;

const AdminUserTable = () => {
  const { getUsers, updateUserStatus, userLoading } = useUser();
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenStatusModal = (user) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleSubmitStatus = async ({ username, is_active }) => {
    setIsSubmitting(true);
    const result = await updateUserStatus(username, is_active);
    setIsSubmitting(false);
    if (result.process === "success") {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "success",
        title: "Estado de usuario actualizado exitosamente."
      });
      handleCloseStatusModal();
      // Reload current page data
      const response = await getUsers(currentPage, ITEMS_PER_PAGE, debouncedSearch);
      if (response.process === "success") {
        setUsers(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.total_pages || 1);
          setTotalRecords(response.pagination.total_records || 0);
        }
      }
    }
  };

  // Debounce the search term to avoid calling API too frequently
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users when page or search term changes
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers(currentPage, ITEMS_PER_PAGE, debouncedSearch);
      if (response.process === "success") {
        setUsers(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.total_pages || 1);
          setTotalRecords(response.pagination.total_records || 0);
        }
      }
    };
    fetchUsers();
  }, [currentPage, debouncedSearch, getUsers]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return <ArrowUpDown className="inline ml-1 h-3.5 w-3.5 opacity-50" />;
    return sortDirection === "asc"
      ? <ArrowUp className="inline ml-1 h-3.5 w-3.5" />
      : <ArrowDown className="inline ml-1 h-3.5 w-3.5" />;
  };

  const sortedUsers = useMemo(() => {
    if (!sortColumn) return users;
    return [...users].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      valA = (valA ?? "").toString().toLowerCase();
      valB = (valB ?? "").toString().toLowerCase();

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, sortColumn, sortDirection]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getRoleBadgeClass = (role) => {
    const roleLower = (role || "").toLowerCase();
    switch (roleLower) {
      case "administrador":
      case "admin":
        return "bg-indigo-100 text-indigo-800 border border-indigo-200";
      case "coordinador de servicio":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "plan referido":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "cliente":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-0 mt-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Buscar por nombre, usuario, rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-500">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  Nombre <SortIcon column="name" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("username")}
                >
                  Usuario <SortIcon column="username" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  Estado <SortIcon column="status" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("role_assigned")}
                >
                  Rol <SortIcon column="role_assigned" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                  onClick={() => handleSort("created_at")}
                >
                  Fecha de registro<SortIcon column="created_at" />
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">

                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : sortedUsers.length > 0 ? (
                sortedUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status && user.status.includes("Activo")
                        ? "bg-green-100 text-green-800"
                        : user.status && user.status.includes("Inactivo")
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                        }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-md ${getRoleBadgeClass(user.role_assigned)}`}>
                        {user.role_assigned}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.created_at}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleOpenStatusModal(user)}
                        className="text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 p-2 rounded-md transition-colors inline-flex items-center cursor-pointer"
                        title="Configurar usuario"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No hay usuarios registrados o que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {sortedUsers.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Anterior
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, totalRecords)}</span> de <span className="font-medium">{totalRecords}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium cursor-pointer ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
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
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium cursor-pointer ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
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

      <UserStatusModal
        isOpen={isModalOpen}
        onClose={handleCloseStatusModal}
        onSubmit={handleSubmitStatus}
        userToEdit={userToEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AdminUserTable;
