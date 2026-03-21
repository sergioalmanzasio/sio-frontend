import { ChevronDown, TabletSmartphone, IdCardLanyard, Building2, MapPin, DollarSign, HandCoins } from "lucide-react";
import React from "react";

const ICONS = {
  "Tipo de documento": IdCardLanyard,
  "Tipo de vivienda": Building2,
  "Departamento": MapPin,
  "Ciudad": MapPin,
  "Tipo de Bono": DollarSign,
  "Tipo de Aplicación": HandCoins,
  "Tipo de comisión": HandCoins
};

const Select = ({ options, label, value, onChange, disabled = false, icon, className }) => {
  const Icon = icon || ICONS[label] || TabletSmartphone;

  return (
    <div className={"relative w-full" + (disabled ? " opacity-50 cursor-not-allowed" : "")}>
      
      {/* Label visible sobre el Select */}
      <label
        htmlFor={`select-${label}`}
        className={`
          absolute left-3 
          transition-all duration-200 
          pointer-events-none
          bg-white px-1
          text-gray-500
          -top-2 text-xs
        `}
      >
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </label>

      {/* SELECT */}
      <select
        value={value}
        onChange={onChange}
        id={`select-${label}`}
        disabled={disabled}
        className={`appearance-none w-full p-3 pt-5 pl-10 
                   border border-gray-300 rounded-lg text-gray-700 
                   outline-none focus:border-blue-500 focus:ring-1 
                   focus:ring-blue-500 transition duration-300 
                   bg-white text-sm ${className}`}
      >
        <option value="" disabled>
          Selecciona {label}
        </option>
        {options.map((op, index) => (
          <option key={`${op}-${index}`} value={op}>
            {op}
          </option>
        ))}
      </select>

      {/* ICONO IZQUIERDO */}
      <Icon
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/4 text-gray-400 pointer-events-none"
      />

      {/* FLECHA DERECHA */}
      <ChevronDown
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
};

export default Select;