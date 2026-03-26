import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; 

export const Input = React.forwardRef(({ className, icon: Icon, type, disabled = false, ...props }, ref) => {
  
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const SuffixIcon = showPassword ? EyeOff : Eye;
  const isPasswordToggle = type === 'password';
  return (
    <div className={"relative flex items-center w-full" + className + (disabled ? " opacity-50 cursor-not-allowed" : "")}>
      {Icon && (
        <Icon size={18} className="absolute left-3 text-gray-400 pointer-events-none" />
      )}
      <input
        type={inputType}
        disabled={disabled}
        className={
          "w-full p-2 h-14 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-300 text-base" +
          (Icon ? " pl-10" : " pl-3") + 
          (isPasswordToggle ? " pr-10" : "") 
        }
        ref={ref}
        {...props}
      />
      
      {isPasswordToggle && (
        <button
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