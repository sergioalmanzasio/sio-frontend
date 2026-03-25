// src/sections/BentoGridSection.jsx

import { useEffect, useState } from "react";
import Card from "../../components/card/Card";
import ToastAlert from "../../components/alerts/ToastAlert";
import OfferDetailModal from "../../components/alerts/OfferDetailModal";
import useBenefit from "../../hooks/useBenefit";
import { OPERATORS_LOGOS } from "../../shared/utils";
import { useAuth } from "../../context/AuthContext";
import OfferBuyBottomModal from "../../components/modals/OfferBuyBottomModal";
import useRequest from "../../hooks/useRequest";
import FullScreenLoader from "../../components/ui/FullScreenLoader";



export default function BentoGridSectionOffers( { offers = [] } ) {
  const { benefits, error, getBenefits } = useBenefit();
  const { validateClienteRequestPending} = useRequest();
  const [offerId, setOfferId] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [offerOperator, setOfferOperator] = useState("");
  const [offerOperatorLogo, setOfferOperatorLogo] = useState("");
  const { isAuthenticated, userData } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loadingAddRequest, setLoadingAddRequest] = useState(false);
  
  useEffect(() => {
    if (benefits) {
      OfferDetailModal({
        title: `Detalle de la oferta`,
        html: `
        <div class="flex flex-col gap-2 text-left">
          <div class="w-full flex flex-col align-left md:flex-row justify-left items-center">
            <img src="${offerOperatorLogo}" alt="${offerOperator}" class="w-48 h-14 object-contain">
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
        isConfirmButtonVisible: false,
        cancelText: "Salir", 
        confirmCallback: () => handleBuyClick(offerId, offerTitle, offerDescription, offerPrice, offerOperator),
        cancelCallback: () => {
          // Do nothing
        }
      });
    }
  }, [benefits, offerDescription, offerTitle]);

  const handleBenefitsClick = async (id, title, description, price, operator, operatorLogo) => {
    setOfferDescription(description);
    setOfferTitle(title);
    setOfferPrice(price);
    setOfferOperator(operator);
    setOfferOperatorLogo(operatorLogo);
    getBenefits(id);
  };

  const handleBuyClick = async (id, title, description, price, operator) => {
    setOfferId(id);
    clearInputCode();
      
    if (!isAuthenticated) {
      ToastAlert({
        position: "center",
        timer: 2000,
        icon: "info",
        title: "Debe iniciar sesión para adquirir la oferta.",
        isColored: false
      });
      return;
    }

    // Validar si el usuario ya tiene una solicitud en estado de pendiente/en progreso
    try {
      const result = await validateClienteRequestPending({
        email: userData?.email // Usar el email del usuario autenticado
      });
      if (result.hasPendingRequest || result.process === 'session-expired') {
        
        return;
      }
      // Proceder con la compra
      setOfferDescription(description);
      setOfferTitle(title);
      setOfferPrice(price);
      setOfferOperator(operator);
      setIsModalOpen(true);
    } catch (error) {
      // console.error("Error validando solicitud pendiente:", error);
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const clearInputCode = ( ) => {
    setCode("");
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
      operatorLogo: offer.operator_logo
    }));
  }

  useEffect(() => {
    if (loadingAddRequest) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";   
    }
  }, [loadingAddRequest]);

  return (
    <>
      <FullScreenLoader show={loadingAddRequest} message="Procesando solicitud, espere un momento." />
      <section className={`${loadingAddRequest ? 'pointer-events-none' : 'py-4 md:py-12 px-6 bg-white'} `}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {GRID_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              className={`col-span-1 lg:mt-0`}
            >
              <Card
                title={item.title}
                description={item.description}
                index={item.index}
                operator={item.operator}
                price={item.price}
                onBenefitsClick={() => handleBenefitsClick(item.id, item.title, item.description, item.price, item.operator, item.operatorLogo)}
                onBuyClick={() => handleBuyClick(item.id, item.title, item.description, item.price, item.operator)}
                operatorLogo={item.operatorLogo}
              />
            </div>
          ))}
        </div>
      </section>
    
      <OfferBuyBottomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalle de la oferta"
        code={code}
        offerID={offerId}
        email={userData?.email}
        onLoadingChange={(state) => setLoadingAddRequest(state)}
      >
        <div className="flex flex-col gap-2 text-left">
          <div className="w-full flex flex-col align-left md:flex-row justify-left items-center">
            <img src={OPERATORS_LOGOS[offerOperator.toUpperCase()] ?? OPERATORS_LOGOS.CLARO} alt={offerOperator} className="w-48 h-14 object-contain"/>
            <div className="w-full">
              <h2 className="text-2xl font-semibold">{offerTitle}</h2>
              <h3 className="text-xl">{offerDescription}</h3>
              <p className="text-2xl 
              bg-linear-to-r from-red-500 via-green-500 to-purple-500 text-transparent bg-clip-text
              font-semibold text-left">{offerPrice}<span className="text-gray-600 text-sm font-normal"> /mes</span></p>
            </div>
          </div>
          <div className="h-px w-full bg-gray-200 my-4"></div>
          <p className="text-md text-gray-600 font-normal text-left">¿Recibió apoyo de un asesor?, por favor digite el código del asesor.</p>
          <div className="flex flex-row items-center gap-2">
            <input className="w-full border border-gray-200 rounded-md p-4" type="text" id="code" name="code" value={code} placeholder="Código del asesor" autoComplete="off" onChange={handleCodeChange}/>
          </div>
        </div>
      </OfferBuyBottomModal>
    </>
  );
}
