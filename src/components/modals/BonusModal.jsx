import { useEffect, useState } from "react";

export default function BonusModal({
  title = "Bono activo",
  description = "Por cada venta aprobada recibirás un bono adicional.",
  amount = 10000
}) {

  const [open, setOpen] = useState(false);
  // const [bonus, setBonus] = useState(null);

  // useEffect(() => {
  //   fetch("/api/bonuses/active")
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data) {
  //         setBonus(data);
  //         setOpen(true);
  //       }
  //     });
  // }, [])

  useEffect(() => {
    const seen = localStorage.getItem("bonus_seen");

    if (!seen) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("bonus_seen", "true");
    setOpen(false);
  };

  if (!open) return null;
  // if (!open || !bonus) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ">

      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 animate-fade-in text-white p-5 rounded-xl mb-6">

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {title}
        </h2>

        <p className="text-gray-600 text-sm mb-4">
          {description}
        </p>

        <div className="bg-purple-100 border rounded-lg p-4 text-center mb-6">
          <p className="text-sm text-purple-500">
            Recibirás adicional un bono de:
          </p>

          <p className="text-4xl font-bold text-purple-600 mt-1">
            $ {new Intl.NumberFormat("es-CO").format(amount)}
          </p>
        </div>

        <div className="rounded-xl mb-6 text-gray-600 text-center">
          <p className="text-sm opacity-90">
            Vigencia: 01 Ene 2026 - 31 Mar 2026
          </p>
        </div>

        <button
          onClick={handleClose}
          className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition text-white cursor-pointer"
        >
          Entendido
        </button>

      </div>
    </div>
  );
}