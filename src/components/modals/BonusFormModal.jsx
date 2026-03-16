import { useState, useEffect } from "react";
import { Gift, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import Select from "../ui/select";
import Textarea from "../ui/textarea";
import { getBonusApplyTypes } from "../../shared/utils";

export default function BonusFormModal({ isOpen, onClose, onSubmit, initialData, loading = false }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bonus_type: "Dinero",
    bonus_amount: "",
    apply_type: "Primera Venta",
    max_times_per_user: "",
    min_sales_required: "",
    valid_from: "",
    valid_until: "",
    is_active: true
  });

  // Map strings for select to actual logic values
  const typeMapToAPI = {
    "Dinero": "MONEY",
    "Porcentaje": "PERCENTAGE"
  };

  const typeMapFromAPI = {
    "MONEY": "Dinero",
    "PERCENTAGE": "Porcentaje"
  };

  const applyTypeMapFromAPI = getBonusApplyTypes();
  const optionsApplyType = applyTypeMapFromAPI.map((item) => {
    return item.label;
  });
  const getApplyTypeSelected = (applyType, isValueReturn = false) => {
    const applyTypeSelected = applyTypeMapFromAPI.find((item) => {
      return item.label.toLowerCase() === applyType.toLowerCase();
    });
    if(isValueReturn) {
      return applyTypeSelected.id;
    }
    return applyTypeSelected.label;
  }

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        bonus_type: typeMapFromAPI[initialData.bonus_type] || "Dinero",
        bonus_amount: parseCOP(initialData.bonus_amount_formatted) || "",
        apply_type: getApplyTypeSelected(initialData.apply_type) || "Primera Venta",
        max_times_per_user: initialData.max_times_per_user || "",
        min_sales_required: initialData.min_sales_required || "",
        valid_from: formatDateToDDMMYYYY(initialData.valid_from_formatted),
        valid_until: formatDateToDDMMYYYY(initialData.valid_until_formatted),
        is_active: initialData.is_active === "Activo"
      });
    } else {
      setFormData({
        title: "",
        description: "",
        bonus_type: "Dinero",
        bonus_amount: "",
        apply_type: "Primera Venta",
        max_times_per_user: "",
        min_sales_required: "",
        valid_from: "",
        valid_until: "",
        is_active: true
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "valid_from") {
        return {
          ...prev,
          valid_from: value,
          valid_until: "" // limpiar fecha final
        };
      }

      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const outputData = {
        ...formData,
        bonus_type: typeMapToAPI[formData.bonus_type],
        // apply_type: applyTypeMapToAPI[formData.apply_type],
        apply_type: getApplyTypeSelected(formData.apply_type, true),
        is_active: formData.is_active ? true : false
    };
    onSubmit(outputData);
  };

  const formatCOP = value => {
    if (!value) return "";
    return new Intl.NumberFormat("es-CO").format(value);
  };

  const parseCOP = value => {
    if (!value) return 0;
    return Number(value.toString().replace(/[^\d]/g, ""));
  }

  const formatDateToDDMMYYYY = (dateStr) => {
      const months = {
        Ene: "01",
        Feb: "02",
        Mar: "03",
        Abr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Ago: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dic: "12"
      };

      const parts = dateStr.split(" ");

      const day = parts[0].padStart(2, "0");
      const month = months[parts[2]];
      const year = parts[4];

      return `${year}-${month}-${day}`;
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-2xl animate-fade-in relative my-auto">
        
        {/* SweetAlert-like Header */}
        <div className="flex flex-col items-center justify-center pt-8 px-6 pb-2">
            {/* <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 mb-4 ring-4 ring-teal-50">
              <Gift className="h-8 w-8 text-teal-600" />
            </div> */}
            <h2 className="text-2xl font-semibold text-gray-800 text-center">
              {initialData ? "Actualizar bono" : "Crear nuevo bono"}
            </h2>
            <p className="text-gray-500 text-center text-sm mt-2">
              Ingresa la información solicitada para continuar.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <Input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej. Bono de Bienvenida"
              />
            </div>
            
            <div className="md:col-span-2">
              <Textarea
                label="Descripción"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe los detalles y condiciones del bono..."
                rows={3}
              />
            </div>

            <div className="mt-1 relative">
              <Select
                label="Tipo de Bono"
                options={["Dinero"]}
                value={formData.bonus_type}
                onChange={(e) => setFormData({...formData, bonus_type: e.target.value})}
              />
            </div>

            <div className="mt-1 relative">
              <Select
                label="Tipo de Aplicación"
                options={optionsApplyType}
                value={formData.apply_type}
                onChange={(e) => setFormData({...formData, apply_type: e.target.value})}
              />
            </div>

            <div className="mt-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto del Bono
              </label>
              <Input
                type="text"
                name="bonus_amount"
                required
                placeholder="$ 0"
                value={formData.bonus_amount ? `$ ${formatCOP(formData.bonus_amount)}` : ""}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, "");
                  setFormData({
                    ...formData,
                    bonus_amount: rawValue ? Number(rawValue) : ""
                  });
                }}
              />
            </div>
            <div className="mt-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Máx. Veces por Usuario</label>
              <Input
                type="number"
                onWheel={(e) => e.target.blur()}
                pattern="[0-9]*"
                name="max_times_per_user"
                required={formData.apply_type !== "Cada venta"}
                value={formData.max_times_per_user}
                onChange={handleChange}
                placeholder="1"
              />
            </div>

            <div className="mt-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ventas Mínimas Requeridas</label>
              <Input
                type="number"
                onWheel={(e) => e.target.blur()}
                name="min_sales_required"
                required
                value={formData.min_sales_required}
                onChange={handleChange}
                placeholder="Ej. 1"
              />
            </div>
            
            <div className="md:col-span-2 grid grid-cols-2 gap-5 mt-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Válido Desde</label>
                <Input
                  type="date"
                  name="valid_from"
                  required
                  value={formData.valid_from}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Válido Hasta</label>
                <Input
                  type="date"
                  name="valid_until"
                  required
                  value={formData.valid_until}
                  min={formData.valid_from}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-2">
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Estado del bono</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.is_active ? "El bono está activo y disponible" : "El bono está inactivo"}
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
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2.5 rounded-lg font-medium transition-all shadow-md btn-cancel hover:shadow-lg transform hover:scale-105"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-2.5 rounded-lg font-medium transition-all shadow-md btn-gradient text-white hover:shadow-lg transform hover:scale-105 ${loading ? "opacity-50 bg-gray-500 hover:bg-gray-500 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <div className="flex items-center gap-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {initialData ? "Actualizando..." : "Creando bono..."}
                  </div>
                </>
              ) : (
                initialData ? "Actualizar" : "Crear bono"
              )}
            </button>            
            
          </div>
        </form>
      </div>
    </div>
  );
}
