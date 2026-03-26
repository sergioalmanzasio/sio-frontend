import React from "react";

export default function FullScreenLoader({ show = false, message = "Cargando..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm flex flex-col items-center justify-center px-4">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-500"></div>
      <p className="mt-4 text-white text-lg font-medium text-center max-w-[300px]">
        {message}
      </p>
    </div>
  );
}