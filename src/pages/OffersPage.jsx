
import { useEffect, useState, useRef } from "react";
import BentoGridSectionOffers from "../sections/bentro-grid/BentoGridSectionOffers";
import BentoGridSkeletonOffers from "../sections/bentro-grid/BentoGridSkeletonOffers";
import Navbar from "../components/Navbar";
import OfferHeader from "../components/header/OfferHeader";
import useOffer from "../hooks/useOffer";
import ToastAlert from "../components/alerts/ToastAlert";

const OffersPage = () => {
  const { offers: fetchedOffers, loading: loadingOffers, getOffers, getOffersByOperator, getOffersByService, getOffersByOperatorAndService } = useOffer();
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const isFiltered = useRef(false);
  useEffect(() => {
    getOffers();
  }, [getOffers, getOffersByOperator, getOffersByService, getOffersByOperatorAndService]); 

  const getOffersByFilters = (operatorId, serviceId) => {
    setSelectedOperator(operatorId);
    setSelectedService(serviceId);
    const isAll = (v) => !v || v === "Todos";
    isFiltered.current = !isAll(operatorId) || !isAll(serviceId);

    if (operatorId || serviceId) {
      if (!isAll(operatorId) && isAll(serviceId)) {
        getOffersByOperator(operatorId);
      } else if (!isAll(serviceId) && isAll(operatorId)) {
        getOffersByService(serviceId);
      } else if (operatorId === "Todos" && serviceId === "Todos") {
        getOffers();
      } else if (isAll(operatorId) || isAll(serviceId)) {
        getOffers();
      } else {
        getOffersByOperatorAndService(operatorId, serviceId);
      }
    } else {
      getOffers();
    }
  };

  return (
    <>
      <Navbar />
      <section className="py-10 px-6 bg-white"> 
        <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
          Descubre nuestras capacidades
        </h2>
        <p className="text-xl text-gray-600">
          Una plataforma, infinitas soluciones organizadas para ti.
        </p>
      </div>
      <OfferHeader isLoadingOffers={loadingOffers} 
                   onSearch={(operatorId, serviceId) => {
                    getOffersByFilters(operatorId, serviceId);
                  }} 
      />
      <div className="h-px w-full bg-gray-200 my-4 mt-10"></div>
      {
        loadingOffers
        ? <BentoGridSkeletonOffers />
        : fetchedOffers && fetchedOffers.length === 0 && isFiltered.current
          ? (() => {
              ToastAlert({ position: "center", timer: 2500, icon: "info", title: "No se encontraron ofertas con el filtro aplicado." });
              return (
                <div className="flex items-center justify-center py-16 h-auto ">
                  <p className="text-gray-500 text-lg">No se encontraron ofertas.</p>
                </div>
              );
            })()
          : <BentoGridSectionOffers offers={fetchedOffers} />
      }
      </section>
    </>
  );
};

export default OffersPage;

