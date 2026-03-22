import { useState, useEffect } from "react";
import { X, Check, DollarSign } from "lucide-react";
import { Input } from "../ui/input";
import Select from "../ui/select";
import Textarea from "../ui/textarea";

const OfferFormModal = ({ isOpen, onClose, onSubmit, operators = [], benefitsList = [], categoriesList = [], isSubmitting = false, offerToEdit = null }) => {
 
  let objData = {};
  if(!offerToEdit){
    objData = {
      name: "",
      description: "",
      price: "",
      is_range: false,
      date_start: "",
      date_end: "",
      operator_name: "",
      category_name: "",
      is_active: true,
      commission_type: "",
      commission_value: "",
      _display_commission_value: "",
      benefits: []
    }
  }else{
    objData = {
      name: "",
      description: "",
      price: "",
      is_range: false,
      date_start: "",
      date_end: "",
      operator_name: "",
      category_name: "",
      is_active: true,
      benefits: []
    }
  }
  
  const [formData, setFormData] = useState(objData);
  const [errorName, setErrorName] = useState(false);
  const [errorOperator, setErrorOperator] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorCategory, setErrorCategory] = useState(false);
  const [errorPrice, setErrorPrice] = useState(false);
  const [errorDateStart, setErrorDateStart] = useState(false);
  const [errorDateEnd, setErrorDateEnd] = useState(false);
  const [errorCommissionType, setErrorCommissionType] = useState(false);
  const [errorCommissionValue, setErrorCommissionValue] = useState(false);

  const [benefitSearchTerm, setBenefitSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.querySelector('body').style.overflow = 'hidden';
      if (offerToEdit) {
        setFormData({
          name: offerToEdit.name || "",
          description: offerToEdit.description || "",
          price: offerToEdit.price || "",
          is_range: offerToEdit.is_range || false,
          date_start: offerToEdit.date_start ? new Date(offerToEdit.date_start).toISOString().split('T')[0] : "",
          date_end: offerToEdit.date_end ? new Date(offerToEdit.date_end).toISOString().split('T')[0] : "",
          operator_name: offerToEdit.operator_name || "",
          category_name: offerToEdit.category_name || "",
          is_active: offerToEdit.is_active !== undefined ? offerToEdit.is_active : true,
          benefits: offerToEdit.benefits ? offerToEdit.benefits.map(b => b.id || b) : []
        });
      } else {
        setFormData({
          name: "",
          description: "",
          price: "",
          is_range: false,
          date_start: "",
          date_end: "",
          operator_name: "",
          commission_type: "",
          commission_value: "",
          category_name: "",
          is_active: true,
          benefits: []
        });
      }
      setBenefitSearchTerm("");
    }
  }, [isOpen, offerToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleBenefitToggle = (id) => {
    setFormData((prev) => {
      const isSelected = prev.benefits.includes(id);
      if (isSelected) {
        return { ...prev, benefits: prev.benefits.filter((b) => b !== id) };
      } else {
        return { ...prev, benefits: [...prev.benefits, id] };
      }
    });
  };

  const formatDisplayValue = (value, type) => {
    if (!value) return "";
    value = value.toString().split(".")[0];
    const cleanNum = value.replace(/\D/g, "");
    if (!cleanNum) return "";
    if (type === "Valor fijo" || type === "") {
      return `$ ${Number(cleanNum).toLocaleString("es-CO")}`;
    }
    return cleanNum;
  };

  const handleCommissionTypeChange = (e) => {
    const newType = e.target.value;
    const newFormData = { ...formData };
    newFormData.commission_type = newType;
    newFormData._display_commission_value = formatDisplayValue(newFormData.commission_value, newType);
    setFormData(newFormData);
  };

  const handleCommissionValueChange = (e) => {
    const rawVal = e.target.value;
    const cleanNum = rawVal.replace(/\D/g, "");
    const newFormData = { ...formData };
    newFormData.commission_value = cleanNum || "";
    newFormData._display_commission_value = formatDisplayValue(cleanNum, newFormData.commission_type);
    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name === "" || !formData.name.trim()) {
      setErrorName(true);
      return;
    }else{
      setErrorName(false);
    }
    if (formData.description === "" || !formData.description.trim()) {
      setErrorDescription(true);
      return;
    }else{
      setErrorDescription(false);
    }
    if (formData.operator_name === "" || !formData.operator_name.trim()) {
      setErrorOperator(true);
      return;
    }else{
      setErrorOperator(false);
    }
    if (formData.category_name === "" || !formData.category_name.trim()) {
      setErrorCategory(true);
      return;
    }else{
      setErrorCategory(false);
    }
    if (formData.price === "" || !formData.price.trim()) {
      setErrorPrice(true);
      return;
    }else{
      setErrorPrice(false);
    }
    if( formData.date_start === "" || !formData.date_start.trim() ){
      setErrorDateStart(true);
      return;
    }else{
      setErrorDateStart(false);
    }
    if( formData.date_end === "" || !formData.date_end.trim() ){
      setErrorDateEnd(true);
      return;
    }else{
      setErrorDateEnd(false);
    }
    if (formData.commission_type === "" || !formData.commission_type.trim()) {
      setErrorCommissionType(true);
      return;
    }else{
      setErrorCommissionType(false);
    }
    if (formData.commission_value === "" || !formData.commission_value.trim()) {
      setErrorCommissionValue(true);
      return;
    }else{
      setErrorCommissionValue(false);
    }
    
    onSubmit(formData);
    document.querySelector('body').style.overflow = "auto";
    onClose();
  };

  const filteredBenefits = benefitsList.filter((benefit) =>
    benefit.description.toLowerCase().includes(benefitSearchTerm.toLowerCase())
  );



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black/80 transition-opacity" 
          aria-hidden="true" 
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full z-50">
          <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex-shrink-0">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-200">
                <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                  {offerToEdit ? "Actualizar oferta" : "Nueva oferta"}
                </h3>
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  onClick={onClose}
                >
                  <span className="sr-only">Cerrar</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="px-4 sm:px-6 overflow-y-auto flex-grow">
              <div className="mt-2 space-y-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nombre de la oferta"
                      autoComplete="off"
                    />
                    {errorName && (
                      <span className="text-red-500 text-xs mt-1">El campo nombre es requerido</span>
                    )}
                  </div>

                  <div className="md:col-span-2 text-sm">
                    <Textarea
                      label="Descripción"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe la oferta..."
                      rows={3}
                      autoComplete="off"
                      className="text-base"
                    />
                    {errorDescription && (
                      <span className="text-red-500 text-xs mt-1">El campo descripción es requerido</span>
                    )}
                  </div>

                  <div className="md:col-span-1 md:mt-6">
                    <Select
                      label="Operador"
                      options={operators.map(op => op.name)}
                      value={formData.operator_name}
                      onChange={(e) => {
                        e.target.name === "operator_name" ? formData.operator_name !==  "" || formData.operator_name.trim() ? setErrorOperator(false) : setErrorOperator(true) : null;
                        setFormData({...formData, operator_name: e.target.value})
                      }}
                    />
                    {errorOperator && (
                      <span className="text-red-500 text-xs mt-1">El campo operador es requerido</span>
                    )}
                  </div>

                  <div className="md:col-span-1 md:mt-6">
                    <Select
                      label="Categoría"
                      options={categoriesList.map(cat => cat.name)}
                      value={formData.category_name}
                      onChange={(e) => {
                        e.target.name === "category_name" ? formData.category_name !==  "" || formData.category_name.trim() ? setErrorOperator(false) : setErrorCategory(true) : null;
                        setFormData({...formData, category_name: e.target.value})
                      }}
                    />
                    {errorOperator && (
                      <span className="text-red-500 text-xs mt-1">El campo operador es requerido</span>
                    )}
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Ej. 55900"
                      autoComplete="off"
                    />
                    {errorPrice && (
                      <span className="text-red-500 text-xs mt-1">El campo precio es requerido</span>
                    )}
                  </div>

                  <div className="md:col-span-2 pt-2 hidden">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">¿Es rango de precios?</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.is_range ? "Sí, la oferta es un rango" : "No, es precio fijo"}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={formData.is_range}
                          onChange={(e) => setFormData({ ...formData, is_range: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>

                  {offerToEdit && (
                  <div className="md:col-span-2 pt-2">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Estado</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.is_active ? "Activa" : "Inactiva"}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                  )}

                  <div className="md:col-span-2 grid grid-cols-2 gap-5 mt-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Disponible desde</label>
                      <Input
                        type="date"
                        name="date_start"
                        value={formData.date_start}
                        onChange={handleChange}
                      />
                      {errorDateStart && <span className="text-red-500 text-xs mt-1">El campo fecha de inicio es requerido</span>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Disponible hasta</label>
                      <Input
                        type="date"
                        name="date_end"
                        value={formData.date_end}
                        min={formData.date_start}
                        onChange={handleChange}
                      />
                      {errorDateEnd && <span className="text-red-500 text-xs mt-1">El campo fecha de fin es requerido</span>}
                    </div>
                  </div>
                </div>
                
                { !offerToEdit && (
                  <div className="grid grid-cols-2 gap-5 mt-1 mt-6 border-t border-gray-200 pt-4 items-center justify-center">
                    <div className="col-span-2 md:col-span-2">
                      <h5 className="block text-sm font-medium text-gray-700">Configuración de comisión</h5>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <Select
                          label="Tipo de comisión"
                          options={["Valor fijo", "Porcentaje"]}
                          value={formData.commission_type}
                          onChange={handleCommissionTypeChange}
                        />
                        {errorCommissionType && <span className="text-red-500 text-xs mt-1">El campo tipo de comisión es requerido</span>}
                    </div>
                    <div className="col-span-2 md:col-span-1 md:-mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor
                      </label>
                      <Input
                        type="text"
                        name="commission_value"
                        icon={DollarSign}
                        value={formData._display_commission_value || ""}
                        onChange={handleCommissionValueChange}
                        placeholder={formData.commission_type === 'Valor fijo' || formData.commission_type === '' ? "$ 0" : "0"}
                        autoComplete="off"
                        className="bg-white"
                      />
                      {errorCommissionValue && <span className="text-red-500 text-xs mt-1">El campo valor de la comisión es requerido</span>}
                    </div>
                  </div>
                ) }  
                
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-0">Beneficios incluidos</label>
                    <div className="w-full sm:w-1/2">
                      <Input
                        type="text"
                        placeholder="Buscar beneficios..."
                        value={benefitSearchTerm}
                        onChange={(e) => setBenefitSearchTerm(e.target.value)}
                        className="py-1.5 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-2">
                    {filteredBenefits.length > 0 ? (
                      filteredBenefits.map((benefit) => (
                        <div key={benefit.id} className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={`benefit-${benefit.id}`}
                              type="checkbox"
                              checked={formData.benefits.includes(benefit.id)}
                              onChange={() => handleBenefitToggle(benefit.id)}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={`benefit-${benefit.id}`} className="font-medium text-gray-700 cursor-pointer">
                              {benefit.description}
                            </label>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 p-2">
                        {benefitsList.length === 0 ? "No hay beneficios disponibles." : "No se encontraron beneficios."}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
            <div className="mt-8 flex justify-center gap-4 bg-gray-50 px-4 py-3 sm:px-6 rounded-b-lg flex-shrink-0 border-t border-gray-200">
              <button
                type="button"
                className="px-8 py-2.5 rounded-lg font-medium transition-all shadow-md btn-cancel hover:shadow-lg transform hover:scale-105 bg-white border border-gray-300 text-gray-700"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 rounded-lg font-medium transition-all shadow-md btn-gradient text-white hover:shadow-lg transform hover:scale-105 bg-indigo-600 disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : offerToEdit ? "Actualizar oferta" : "Guardar oferta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfferFormModal;
