import { useState } from "react";

export default function BonusBanner({
  title = "🎉 Bono activo",
  description = "Gana un bono adicional por cada venta aprobada",
  amount = 10000
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-pink-600 text-white p-5 shadow-lg mb-6 animate-fade-in">
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(120deg,transparent,white,transparent)] animate-shimmer"></div>
      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm opacity-90">
            {description}
          </p>
          <p className="text-2xl font-bold mt-2">
            +$ {new Intl.NumberFormat("es-CO").format(amount)}
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="bg-white text-green-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}