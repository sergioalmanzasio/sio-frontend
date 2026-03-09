import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../shared/constanst";

export default function BonusModal() {

  const [open, setOpen] = useState(false);
  const [bonus, setBonus] = useState(null);

  useEffect(() => {
    const seen = localStorage.getItem("bonus_seen");
    if (seen) return;

    fetch(`${API_BASE_URL}/bonus/active`, {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setBonus(data.data);
          setOpen(true);
        }
      })
      .catch(err => console.error("Error al obtener bono activo:", err));
  }, []);

  const handleClose = () => {
    localStorage.setItem("bonus_seen", "true");
    setOpen(false);
  };

  if (!open || !bonus) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ">

      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 animate-fade-in text-white p-5 rounded-xl mb-6">

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {bonus.title}
        </h2>

        <p className="text-gray-600 text-sm mb-4">
          {bonus.description}
        </p>

        <div className="bg-purple-100 border rounded-lg p-4 text-center mb-6">
          <p className="text-sm text-purple-500">
            Recibirás adicional un bono de:
          </p>

          <p className="text-4xl font-bold text-purple-600 mt-1">
            {bonus.bonus_amount_formatted}
          </p>
        </div>

        <div className="rounded-xl mb-6 text-gray-600 text-center">
          <p className="text-sm opacity-90">
            Vigencia: {bonus.valid_from_formatted} - {bonus.valid_until_formatted}
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