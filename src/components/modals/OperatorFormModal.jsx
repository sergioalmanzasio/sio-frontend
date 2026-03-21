import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import Textarea from "../ui/textarea";

const OperatorFormModal = ({ isOpen, onClose, onSubmit, isSubmitting = false, operatorToEdit = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true
  });
  const [errorName, setErrorName] = useState(false);
  const [errorDescription, setErrorDescription] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.querySelector('body').style.overflow = 'hidden';
      if (operatorToEdit) {
        setFormData({
          name: operatorToEdit.name || "",
          description: operatorToEdit.description || "",
          is_active: operatorToEdit.is_active !== undefined ? operatorToEdit.is_active : true
        });
      } else {
        setFormData({
          name: "",
          description: "",
          is_active: true
        });
      }
    }
  }, [isOpen, operatorToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name === "" || !formData.name.trim()) {
      setErrorName(true);
      return;
    } else {
      setErrorName(false);
    }
    if (formData.description === "" || !formData.description.trim()) {
      setErrorDescription(true);
      return;
    } else {
      setErrorDescription(false);
    }
    
    onSubmit(formData);
    document.querySelector('body').style.overflow = "auto";
  };

  const handleClose = () => {
    document.querySelector('body').style.overflow = "auto";
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-black/80 transition-opacity" 
          aria-hidden="true" 
          onClick={handleClose}
        ></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full z-50">
          <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex-shrink-0">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-200">
                <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                  {operatorToEdit ? "Actualizar operador" : "Nuevo operador"}
                </h3>
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  onClick={handleClose}
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
                      placeholder="Nombre del operador"
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
                      placeholder="Describe el operador..."
                      rows={3}
                      autoComplete="off"
                    />
                    {errorDescription && (
                      <span className="text-red-500 text-xs mt-1">El campo descripción es requerido</span>
                    )}
                  </div>

                  {operatorToEdit && (
                  <div className="md:col-span-2 pt-2">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Estado</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.is_active ? "Activo" : "Inactivo"}
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
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center gap-4 bg-gray-50 px-4 py-3 sm:px-6 rounded-b-lg flex-shrink-0 border-t border-gray-200">
              <button
                type="button"
                className="px-8 py-2.5 rounded-lg font-medium transition-all shadow-md btn-cancel hover:shadow-lg transform hover:scale-105 bg-white border border-gray-300 text-gray-700"
                onClick={handleClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 rounded-lg font-medium transition-all shadow-md btn-gradient text-white hover:shadow-lg transform hover:scale-105 bg-indigo-600 disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : operatorToEdit ? "Actualizar operador" : "Guardar operador"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OperatorFormModal;
