// src/sections/BentoGridSkeleton.jsx

import SkeletonCard from "../../components/card/SkeletonCard";

// Genera un array de 20 elementos nulos para simular las 20 tarjetas
const SKELETON_ITEMS = Array.from({ length: 20 }, (_, i) => i);

export default function BentoGridSkeletonOffers() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      {/* Loading animation with text */}
      <div className="flex justify-center items-center mb-6 flex-col">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-solid rounded-full border-t-transparent mb-2"></div>
        <p className="ml-2 text-gray-600">Cargando ofertas, por favor espere...</p>
      </div> 

      {/* GRID PRINCIPAL: Mantiene la misma estructura de 6 columnas y el gap */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
        {SKELETON_ITEMS.map((index) => (
          <div
            key={index}
            className={`
                            col-span-1 
                            
                            /* Lógica de Desplazamiento (la misma que en el grid real) */
                            ${
                              index % 4 === 1 || // Columna 2
                              index % 4 === 3 || // Columna 4
                              index % 4 === 5 // Columna 6
                                ? "lg:translate-y-10" // Desplazamiento hacia abajo de 10 unidades
                                : ""
                            }
                        `}
          >
            <SkeletonCard index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
