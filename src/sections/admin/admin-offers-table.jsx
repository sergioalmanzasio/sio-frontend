import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Eye, ChevronLeft, ChevronRight, Plus, Pencil, BadgeDollarSign, Loader2 } from "lucide-react";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import useOffer from "../../hooks/useOffer";
import useOperator from "../../hooks/useOperator";
import OfferDetailModal from "../../components/modals/OfferDetailModal";
import OfferFormModal from "../../components/modals/OfferFormModal";
import OfferCommissionConfigModal from "../../components/modals/OfferCommissionConfigModal";
import ToastAlert from '../../components/alerts/ToastAlert'
import { driver } from "driver.js";
import { adminOfferTableDriver } from "../../shared/drivers-object";


const ITEMS_PER_PAGE = 10;

const AdminOffersTable = () => {
  const { getAdminOffers, getAllBenefits, getAllCategories, createOffer, updateOffer, getOfferCommissionConfig, loading: loadingOffers, loadingConfig } = useOffer();
  const { getOperators, operators, loading: loadingOperators } = useOperator();
  
  const [offers, setOffers] = useState([]);
  const [benefitsList, setBenefitsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [offerToEdit, setOfferToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCommissionConfigModalOpen, setIsCommissionConfigModalOpen] = useState(false);
  const [currentCommissionConfigs, setCurrentCommissionConfigs] = useState([]);
  const [selectedOfferForCommission, setSelectedOfferForCommission] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Cargando información...");

  const runTour = useCallback(() => {
    const driverObj = driver(adminOfferTableDriver);

    driverObj.drive();
  }, []);

  const loadData = useCallback(async () => {
    setLoadingMessage("Obteniendo información de las ofertas...");
    const data = await getAdminOffers();
    if (data) setOffers(data);
    getOperators();
    const benefits = await getAllBenefits();
    const categories = await getAllCategories(); 
    if (benefits) setBenefitsList(benefits);
    if (categories) setCategoriesList(categories);
    const hasSeenTour = localStorage.getItem('offers_tour_seen');
    if (!hasSeenTour &&data && data.length > 0) {
      setTimeout(() => {
        runTour();
        localStorage.setItem('offers_tour_seen', 'true');
      }, 500);
    }
  }, [getAdminOffers, getOperators, getAllBenefits]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredOffers = offers.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.name || "").toLowerCase().includes(term) ||
      (item.description || "").toLowerCase().includes(term) ||
      (item.operator_name || "").toLowerCase().includes(term) ||
      (item.category_name || "").toLowerCase().includes(term)
    );
  });

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

  const sortedOffers = useMemo(() => {
    if (!sortColumn) return filteredOffers;
    return [...filteredOffers].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (sortColumn === 'price') {
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
  }, [filteredOffers, sortColumn, sortDirection]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(sortedOffers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOffers = sortedOffers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleOpenDetailModal = (offer) => {
    setSelectedOffer(offer);
    document.querySelector('body').style.overflow = "hidden";
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    document.querySelector('body').style.overflow = "auto";
    setIsDetailModalOpen(false);
    setSelectedOffer(null);
  };

  const handleOpenFormModal = (offer = null) => {
    setOfferToEdit(offer);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    document.querySelector('body').style.overflow = "auto";
    setIsFormModalOpen(false);
    setOfferToEdit(null);
  };

  const handleOpenCommissionsConfigModal = async (offer) => {
    const data = await getOfferCommissionConfig(offer.id);
    if (data !== null) {
      setSelectedOfferForCommission(offer);
      setCurrentCommissionConfigs(data);
      document.querySelector('body').style.overflow = "hidden";
      setIsCommissionConfigModalOpen(true);
    }
  };

  const handleCloseCommissionsConfigModal = () => {
    document.querySelector('body').style.overflow = "auto";
    setIsCommissionConfigModalOpen(false);
    setTimeout(() => {
      setSelectedOfferForCommission(null);
      setCurrentCommissionConfigs([]);
    }, 200);
  };

  const handleSubmitOffer = async (formData) => {
    setIsSubmitting(true);
    let result;
    if (offerToEdit) {
      setLoadingMessage("Actualizando oferta...");
      result = await updateOffer(offerToEdit.id, formData);
    } else {
      setLoadingMessage("Creando oferta...");
      result = await createOffer(formData);
    }
    setIsFormModalOpen(false);
    setIsSubmitting(false);
    
    if (result && result.process === "success") {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "success",
        title: offerToEdit ? "Oferta actualizada exitosamente." : "Oferta creada exitosamente."
      });

      setTimeout(() => {
        handleCloseFormModal();
        loadData();
      }, 1600);
      
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-0 mt-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Buscar por nombre, descripción u operador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          { loadingOffers ? (
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-50 mb-4"></div>
            </div>
          ):(
            <>
              <button
                onClick={() => handleOpenFormModal()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors btn-gradient"
                id="new-offer-btn"
              >
                <Plus className="h-4 w-4" />
                Nueva oferta
              </button>
            </>
          )}
          
        </div>

        {loadingOffers ? (
          <div className="p-4">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            </div>
          </div>
        ): (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-500">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      Oferta <SortIcon column="name" />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                      onClick={() => handleSort("operator_name")}
                    >
                      Operador <SortIcon column="operator_name" />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                      onClick={() => handleSort("category_name")}
                    >
                      Categoria <SortIcon column="category_name" />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                      onClick={() => handleSort("price")}
                    >
                      Precio <SortIcon column="price" />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer select-none hover:bg-indigo-600 transition-colors"
                      onClick={() => handleSort("date_start")}
                    >
                      Vigencia <SortIcon column="date_start" />
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOffers.length > 0 ? (
                    currentOffers.map((offer) => (
                      <tr key={offer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{offer.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1" title={offer.description}>
                            {offer.description}
                          </div>
                          <div className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1.5
                              ${offer.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                              }`}>
                            {offer.is_active ? "Activa" : "Inactiva"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {offer.operator_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {offer.category_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-bold">
                            ${Number(offer.price).toLocaleString("es-CO")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div><span className="font-medium">Inicio:</span> {new Date(offer.date_start).toLocaleDateString()}</div>
                          <div><span className="font-medium">Fin:</span> {new Date(offer.date_end).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => handleOpenDetailModal(offer)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-md transition-colors inline-flex items-center cursor-pointer"
                            title="Ver detalle"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleOpenFormModal(offer)}
                            className="text-pink-600 hover:text-pink-900 bg-pink-50 hover:bg-pink-100 p-2 rounded-md transition-colors inline-flex items-center cursor-pointer ml-2"
                            title="Actualizar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenCommissionsConfigModal(offer)}
                            className="text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 p-2 rounded-md transition-colors inline-flex items-center cursor-pointer ml-2"
                            title="Configurar comisiones"
                          >
                            {loadingConfig ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <BadgeDollarSign className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                        No hay ofertas registradas o que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {sortedOffers.length > 0 && (
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
                      Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, sortedOffers.length)}</span> de <span className="font-medium">{sortedOffers.length}</span> resultados
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
          </>
        )}
      </div>

      <OfferDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        offer={selectedOffer}
      />
      
      <OfferFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleSubmitOffer}
        offerToEdit={offerToEdit}
        operators={operators || []}
        benefitsList={benefitsList || []}
        categoriesList={categoriesList || []}
        isSubmitting={isSubmitting}
      />

      <OfferCommissionConfigModal
        isOpen={isCommissionConfigModalOpen}
        onClose={handleCloseCommissionsConfigModal}
        offer={selectedOfferForCommission}
        configs={currentCommissionConfigs}
      />
    </div>
  );
};

export default AdminOffersTable;
