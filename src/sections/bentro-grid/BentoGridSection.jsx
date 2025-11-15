// src/sections/BentoGridSection.jsx

import Card from "../../components/card/Card";

// Genera un array de datos para 20 tarjetas
const GRID_ITEMS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Servicio Premium ${i + 1}`,
  description: `Descubre la ${
    i + 1
  }ª ventaja de nuestro sistema: gestión simplificada y resultados en tiempo real.`,
  index: i,
}));

export default function BentoGridSection() {

  const handleBenefitsClick = (id) => {
    console.log("Beneficios", id);
  };

  const handleBuyClick = (id) => {
    console.log("Comprar", id);
  };

  return (

    <section className="py-20 px-6 bg-gray-50">
      {/* GRID PRINCIPAL:
              - Móvil: 1 columna (gap-4)
              - Desktop (lg): 6 columnas (grid-cols-6) con un gap-8
            */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
        {GRID_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`
                        col-span-1 
                        /* Aplicamos el desplazamiento solo a partir de LG (desktop) */
                        lg:mt-0 
                        
                        /* Lógica del Bento: Desplazar las columnas pares (col 2, 4, 6) */
                        ${
                          // La lógica debe aplicar a la posición de la columna, no al índice del item.
                          // Usamos el índice del item para simular la columna, ya que son 6 columnas.
                          item.index % 4 === 1 || // Columna 2
                          item.index % 4 === 3 || // Columna 4
                          item.index % 4 === 5 // Columna 6
                            ? "lg:translate-y-10" // Desplazamiento hacia abajo de 10 unidades (40px)
                            : ""
                        }
                    `}
          >
            <Card
              title={item.title}
              description={item.description}
              index={item.index}
              onBenefitsClick={() => handleBenefitsClick(item.id)}
              onBuyClick={() => handleBuyClick(item.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
