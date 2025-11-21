// src/sections/BentoGridSection.jsx

import { useEffect, useState } from "react";
import Card from "../../components/card/Card";
import ToastAlert from "../../components/alerts/ToastAlert";
import OfferDetailModal from "../../components/alerts/OfferDetailModal";
import useBenefit from "../../hooks/useBenefit";
import { Star } from "lucide-react";
import { OPERATORS_LOGOS } from "../../shared/utils";

export default function BentoGridSectionOffers( { offers = [] } ) {

  const { benefits, loading, error, getBenefits } = useBenefit();
  const [offerDescription, setOfferDescription] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [offerOperator, setOfferOperator] = useState("");

  useEffect(() => {
    if (benefits) {
      OfferDetailModal({
        title: `Detalle de la oferta`,
        html: `
        <div class="flex flex-col gap-2 text-left">
          
          <div class="w-full flex flex-col align-left md:flex-row justify-left items-center">
            <img src="${OPERATORS_LOGOS[offerOperator.toUpperCase()] ?? OPERATORS_LOGOS.CLARO}" alt="${offerOperator}" class="w-48 h-14 object-contain">
            <div class="w-full">
              <h2 class="text-2xl font-semibold">${offerTitle}</h2>
              <h3 class="text-xl">${offerDescription}</h3>
              <p class="text-2xl 
              bg-linear-to-r from-red-500 via-green-500 to-purple-500 text-transparent bg-clip-text
              font-semibold text-left">${offerPrice}<span class="text-gray-600 text-sm font-normal"> /mes</span></p>
            </div>
          </div>
          <div class="h-px w-full bg-gray-200 my-4"></div>
          <p class="text-md text-gray-600 font-semibold text-left">Beneficios</p>
          <div class="flex flex-col gap-2 text-left">
            ${
              benefits.map((benefit) => (
                `<div class="flex flex-row items-center gap-2">
                  <p class="text-sm text-gray-600" > - ${benefit.benefit_description}</p>
                </div>`
              )).join("")
            }
          </div>
        </div>`,
        
        confirmText: "Adquirir",
        cancelText: "Salir", 
        confirmCallback: () => {
          // Do nothing
        },
        cancelCallback: () => {
          // Do nothing
        }
      });
    }
  }, [benefits, offerDescription, offerTitle]);

  const handleBenefitsClick = async (id, title, description, price, operator) => {
    setOfferDescription(description);
    setOfferTitle(title);
    setOfferPrice(price);
    setOfferOperator(operator);
    getBenefits(id);
  };



  const handleBuyClick = (id) => {
    console.log("Comprar", id);
    // TODO: Validar si el usuario está autenticado
    // TODO: Implementar la lógica de búsqueda y mostrar modal con la información de la compra
  };

  let GRID_ITEMS = [];
  if (offers) {
    GRID_ITEMS = offers.map((offer) => ({
      id: offer.offer_id,
      title: offer.offer_name,
      description: offer.offer_description,
      index: offer.offer_id,
      operator: offer.operator_name.toUpperCase(),
      price: offer.price_formatted,
    }));
  }

  return (

    <section className="py-20 px-6 bg-gray-50">
      {/* GRID PRINCIPAL:
              - Móvil: 1 columna (gap-4)
              - Desktop (lg): 4 columnas (grid-cols-4) con un gap-8
            */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
        {GRID_ITEMS.map((item, idx) => (
          <div
            key={item.id}
            className={`
                        col-span-1 
                        /* Aplicamos el desplazamiento solo a partir de LG (desktop) */
                        lg:mt-0 
                        
                        /* Lógica del Bento: Desplazar las columnas pares (col 2, 4) */
                        ${ (idx % 4 === 1 || idx % 4 === 3) ? "lg:translate-y-10" : "" }
                    `}
          >
            <Card
              title={item.title}
              description={item.description}
              index={item.index}
              operator={item.operator}
              price={item.price}
              onBenefitsClick={() => handleBenefitsClick(item.id, item.title, item.description, item.price, item.operator)}
              onBuyClick={() => handleBuyClick(item.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
