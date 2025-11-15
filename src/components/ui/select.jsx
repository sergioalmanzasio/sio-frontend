// src/components/Select.jsx (o donde lo hayas creado)

import { Briefcase, ChevronDown, TabletSmartphone } from "lucide-react";
import React from 'react'; // Asegúrate de importar React

// El componente ahora espera 'value' y 'onChange' del padre
const Select = ({ options, label, value, onChange }) => {
  // Eliminamos el useState, ya que el estado es manejado por el padre
  
  // Puedes usar una prop 'icon' para hacerlo más dinámico
  const Icon = TabletSmartphone; 

  return (
    <div className="relative">
      <label htmlFor={`select-${label}`} className="sr-only">
        {label}
      </label>
      <select
        // Usamos el 'value' que viene del padre
        value={value} 
        // Usamos la función 'onChange' que viene del padre
        onChange={onChange}
        id={`select-${label}`} 
        className="appearance-none w-full p-2 pl-10 border border-gray-300 rounded-lg text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-300 bg-white"
      >
        <option value="" disabled>
          Selecciona {label}
        </option>
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
      
      {/* Usamos la prop Icon */}
      <Icon
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <ChevronDown
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
};

export default Select;