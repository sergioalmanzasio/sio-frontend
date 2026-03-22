import React from "react";
import { X } from "lucide-react";

export default function BottomModal({ isOpen, onClose, title, description, children, sizeContentMD = 'md:w-1/3', isTitleCenter = true }) {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 flex items-end justify-center z-50 bg-black/40 backdrop-blur-sm animate-fadeIn h-[calc(100vh)]">
      <div className={`w-full bg-white rounded-t-3xl p-6 shadow-xl animate-slideUp relative m-0 ${sizeContentMD}`}>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-50"
          aria-label="Cerrar modal"
        >
          <X size={24} className="cursor-pointer"/>
        </button>
        
        {title && (
          <h2 className={`text-2xl font-semibold mb-2 text-gray-800 ${isTitleCenter ? 'text-center' : 'text-justify ml-2'} md:mb-4`}>
            {title}
          </h2>
        )}
        
        {description && (
          <p className="text-gray-600 text-center mb-6 text-sm">
            {description}
          </p>
        )}

        <div className="text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}
