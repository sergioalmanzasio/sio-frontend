import React, { useState } from 'react';
// Asumimos que estás usando lucide-react para los iconos
import { Eye, EyeOff } from 'lucide-react'; 

export const Input = React.forwardRef(({ className, icon: Icon, type, disabled = false, ...props }, ref) => {
  
  // 1. Estado para controlar si se muestra la contraseña
  const [showPassword, setShowPassword] = useState(false);
  
  // 2. Determinar el tipo de input real: 'text' si se muestra, 'password' si se oculta
  // Esto solo aplica si el 'type' original es 'password'
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // 3. Determinar qué icono mostrar
  const SuffixIcon = showPassword ? EyeOff : Eye;
  
  // 4. Determinar si el campo es de tipo contraseña y por lo tanto requiere el toggle
  const isPasswordToggle = type === 'password';

  return (
    // Ajuste: usar paréntesis para envolver la cadena para mejor lectura
    <div className={"relative flex items-center w-full" + className + (disabled ? " opacity-50 cursor-not-allowed" : "")}>
      
      {/* Icono Prefijo (el candado o mail) */}
      {Icon && (
        <Icon size={18} className="absolute left-3 text-gray-400 pointer-events-none" />
      )}
      
      {/* Campo de Input */}
      <input
        // Usamos el tipo dinámico
        type={inputType}
        disabled={disabled}
        className={
          "w-full p-2 h-14 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-300 text-base" +
          // Ajuste de padding izquierdo
          (Icon ? " pl-10" : " pl-3") + 
          // Ajuste de padding derecho para el icono de sufijo
          (isPasswordToggle ? " pr-10" : "") 
        }
        ref={ref}
        {...props}
      />
      
      {/* 5. Icono Sufijo (Toggle de Contraseña) */}
      {isPasswordToggle && (
        <button
          // CRUCIAL: type="button" previene el envío del formulario al hacer clic
          type="button" 
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute right-3 text-gray-400 hover:text-blue-600 transition duration-150 p-1"
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <SuffixIcon size={18} />
        </button>
      )}
    </div>
  );
});