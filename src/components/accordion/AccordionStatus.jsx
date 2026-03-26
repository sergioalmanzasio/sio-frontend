import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function AccordionStatus({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <button
        className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-gray-800">Estado de la solicitud</span>

        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="p-4 bg-white text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}