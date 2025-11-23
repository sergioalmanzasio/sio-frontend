
import { useEffect, useState } from "react";
import Select from "../ui/select";
import { Search, ListFilter, RefreshCcw } from "lucide-react";
import ToastAlert from "../alerts/ToastAlert";
import useOperator from "../../hooks/useOperator";
import useCategory from "../../hooks/useCategory";

const OfferHeader = ({isLoadingOffers = true, onSearch}) => {
  const [service, setService] = useState("");
  const [operator, setOperator] = useState("");

  const { operators: fetchedOperators, loading: loadingOperators, getOperators } = useOperator();
  const { categories: fetchedCategories, loading: loadingCategories, getCategories } = useCategory();

  // Validar que los campos no estén vacíos
  const handleSearch = () => {
    if (!operator && !service) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Por favor, completa todos los campos requeridos."
      });
      return false; // Detiene el envío
    }
    
    const operatorSelected = operator === "Todos" ? {id: "Todos"} : fetchedOperators.find(op => op.name === operator);
    const serviceSelected = service === "Todos" ? {id: "Todos"} : fetchedCategories.find(cat => cat.name === service)
    // Manda los IDs al padre
    onSearch(
      operatorSelected === null || operatorSelected === undefined ? null : operatorSelected.id, 
      serviceSelected === null || serviceSelected === undefined ? null : serviceSelected.id);
    // resetForm();
    // TODO: Implementar la lógica de búsqueda 
  };

  const handleReset = () => {
    resetForm();
    onSearch(null, null);
  };

  // Get Operator to select
  useEffect(() => {
    getOperators();
    getCategories();
  }, [getOperators, getCategories]);


  // Si deseas mantener una lista por defecto hasta que carguen:
  const OPERATORS_LIST = fetchedOperators && fetchedOperators.length > 0
    ? fetchedOperators.map(op => op.name) 
    : [];

  // TODO: Verificar si es necesario agregar el operador "Todos"  
  // Agregar operador llamado "Todos" al final de la lista
  OPERATORS_LIST.push("Todos");

  const SERVICES_LIST = fetchedCategories && fetchedCategories.length > 0
    ? fetchedCategories.map(cat => cat.name) 
    : [];

  // TODO: Verificar si es necesario agregar el servicio "Todos"  
  // Agregar servicio llamado "Todos" al final de la lista
  SERVICES_LIST.push("Todos");
  
  const resetForm = () => {
    setOperator("");
    setService("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 w-full justify-center p-6 md:p-0">
      {/* Contenedor Intermedio para centrar el grupo de 3/4 */}
      <div className="flex flex-col md:flex-row gap-2 md:w-6/6 lg:w-1/2">
        
        {/* Select operadores (w-1/3 del grupo) */}
        <div className="w-full md:w-3/6">
          <Select 
            options={OPERATORS_LIST} 
            label="operador" 
            value={operator} 
            onChange={(e) => setOperator(e.target.value)} />
        </div>
        
        {/* Select servicios (w-1/3 del grupo) */}
        <div className="w-full md:w-3/6">
          <Select 
            options={SERVICES_LIST} 
            label="servicio" 
            value={service} 
            onChange={(e) => setService(e.target.value)} />
        </div>
        
        {/* Button search (w-1/3 del grupo) */}
        <div className="w-full md:w-1/6">
          {/* El botón debe llenar su contenedor de 1/3 en mobile y desktop */}
          <button className="w-full h-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" onClick={handleSearch} disabled={ !operator && !service || isLoadingOffers}>
            Buscar <ListFilter size={20} className="ml-2"/>
          </button>
        </div>

        <div className="w-full md:w-1/6">
            {/* El botón debe llenar su contenedor de 1/3 en mobile y desktop */}
            <button className="w-full h-full bg-lime-300 text-white px-4 py-2 rounded-md hover:bg-lime-400 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer btn-gradient-secondary" onClick={handleReset} disabled={ isLoadingOffers}>
              <RefreshCcw size={20} className="ml-2"/>
            </button>
          </div>  
        
      </div>
    </div>
  );
};

export default OfferHeader;
