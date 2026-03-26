import { useEffect, useState } from "react";
import { X, BadgeDollarSign, DollarSign } from "lucide-react";
import Swal from "sweetalert2";
import { PrimaryButton } from "../ui/button";
import useOffer from "../../hooks/useOffer";
import Select from "../ui/select";
import { Input } from "../ui/input";

export default function OfferCommissionConfigModal({ isOpen, onClose, offer, configs }) {
  const [localConfigs, setLocalConfigs] = useState([]);
  const { updateOfferCommissionConfig } = useOffer();

  useEffect(() => {
    if (isOpen) {
      setLocalConfigs(
        (configs || []).map(c => ({
          ...c,
          _original_is_active: c.is_active,
          _display_value: formatDisplayValue(c.commission_value, c.commission_type)
        }))
      );
    }
  }, [isOpen, configs]);

  if (!isOpen) return null;

  const formatDisplayValue = (value, type) => {
    if (!value) return "";
    value = value.toString().split(".")[0];
    const cleanNum = value.replace(/\D/g, "");
    if (!cleanNum) return "";
    if (type === "Valor fijo") {
      return `$ ${Number(cleanNum).toLocaleString("es-CO")}`;
    }
    return cleanNum;
  };

  const handleTypeChange = (index, value) => {
    const newConfigs = [...localConfigs];
    newConfigs[index].commission_type = value;
    newConfigs[index]._display_value = formatDisplayValue(newConfigs[index].commission_value || "", value);
    setLocalConfigs(newConfigs);
  };

  const handleValueChange = (index, e) => {
    const rawVal = e.target.value;
    const cleanNum = rawVal.replace(/\D/g, "");
    const newConfigs = [...localConfigs];
    newConfigs[index].commission_value = cleanNum || "";
    newConfigs[index]._display_value = formatDisplayValue(cleanNum, newConfigs[index].commission_type);
    setLocalConfigs(newConfigs);
  };

  const handleToggleActive = (index) => {
    const newConfigs = [...localConfigs];
    newConfigs[index].is_active = !newConfigs[index].is_active;
    setLocalConfigs(newConfigs);
  };

  const handleUpdate = async (index) => {
    const item = localConfigs[index];
    
    if(item.commission_value === '' || item.commission_type === '' ){
      Swal.fire({
        title: "Atención",
        text: "Por favor, complete el valor y el tipo de comisión para esta configuración.",
        icon: "warning",
        customClass: {
          confirmButton: "btn-gradient",
          cancelButton: "btn-cancel",
        },
        confirmButtonText: "Entendido",
      });
      return;
    }

    if(Number(item.commission_value) <= 0){
      Swal.fire({
        title: "Atención",
        text: "El valor de la comisión debe ser mayor a 0.",
        icon: "warning",
        customClass: {
          confirmButton: "btn-gradient",
          cancelButton: "btn-cancel",
        },
        confirmButtonText: "Entendido",
      });
      return;
    }

    if (item._original_is_active && !item.is_active) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Al inactivar esta configuración, la oferta también se inactivará ya que no conservará una configuración base.",
        icon: "warning",
        showCancelButton: true,
        customClass: {
          confirmButton: "btn-gradient",
          cancelButton: "btn-cancel",
        },
        confirmButtonText: "Sí, inactivar ambas",
        cancelButtonText: "Cancelar"
      }).then(async (result) => {
        if (result.isConfirmed) {
          const payload = {
            offer_commission_config_id: item.offer_commission_config_id,
            commission_type: item.commission_type,
            commission_value: item.commission_value,
            is_active: item.is_active,
            offer_id: offer.id
          };
          const res = await updateOfferCommissionConfig(payload);
          if (res && res.process === "success") {
            onClose();
          }
        }
      });
    } else {
      const payload = {
        offer_commission_config_id: item.offer_commission_config_id,
        commission_type: item.commission_type,
        commission_value: item.commission_value,
        is_active: item.is_active,
        offer_id: null
      };
      const res = await updateOfferCommissionConfig(payload);
      if (res && res.process === "success") {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10 shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-teal-100 p-2 rounded-lg">
              <BadgeDollarSign className="h-6 w-6 text-teal-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Configuración de Comisiones
              </h2>
              {offer && (
                <p className="text-sm text-gray-500 mt-1">
                  Oferta: <span className="font-semibold text-gray-700">{offer.name}</span>
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto w-full">
          {localConfigs && localConfigs.length > 0 ? (
            <div className="space-y-6">
              {localConfigs.map((config, idx) => (
                <div key={config.offer_commission_config_id || idx} className="p-5 border border-gray-200 rounded-xl bg-gray-50/50 space-y-5">
                  
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">Estado de la configuración</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Activar o inactivar status actual.</p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={config.is_active}
                          onChange={() => handleToggleActive(idx)} 
                        />
                        <div className={`block w-12 h-6 rounded-full transition-colors ${config.is_active ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${config.is_active ? 'transform translate-x-6' : ''}`}></div>
                      </div>
                      <span className={`ml-3 text-sm font-medium w-14 ${config.is_active ? 'text-teal-700' : 'text-gray-500'}`}>
                        {config.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mt-4">
                    <div className="w-full">
                      <Select
                        label="Tipo de comisión"
                        options={["Valor fijo", "Porcentaje"]}
                        value={config.commission_type}
                        onChange={(e) => handleTypeChange(idx, e.target.value)}
                      />
                    </div>
                    
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">
                        Valor
                      </label>
                      <Input
                        icon={DollarSign}
                        value={config._display_value || ""}
                        onChange={(e) => handleValueChange(idx, e)}
                        placeholder={config.commission_type === 'Valor fijo' ? "0" : "0"}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-2">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm cursor-pointer btn-cancel box-shadow-none border-none"
                    >
                      Cancelar
                    </button>
                    <PrimaryButton
                      onClick={() => handleUpdate(idx)}
                      className="box-shadow-none border-none btn-gradient"
                    >
                      Actualizar
                    </PrimaryButton>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
              No hay configuraciones de comisiones registradas para esta oferta.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
