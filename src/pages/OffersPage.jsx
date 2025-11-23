
import { useEffect, useState } from "react";
import BentoGridSectionOffers from "../sections/bentro-grid/BentoGridSectionOffers";
import BentoGridSkeletonOffers from "../sections/bentro-grid/BentoGridSkeletonOffers";
import Navbar from "../components/Navbar";
import OfferHeader from "../components/header/OfferHeader";
import useOffer from "../hooks/useOffer";

const OffersPage = () => {
  const { offers: fetchedOffers, loading: loadingOffers, getOffers, getOffersByOperator, getOffersByService, getOffersByOperatorAndService } = useOffer();
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedService, setSelectedService] = useState(null);  
  useEffect(() => {
    getOffers();
  }, [getOffers, getOffersByOperator, getOffersByService, getOffersByOperatorAndService]); 

  const getOffersByFilters = ( operatorId, serviceId ) => {
    setSelectedOperator(operatorId);
    setSelectedService(serviceId);
    if (operatorId || serviceId) {
      if ( (operatorId !== "Todos" && operatorId !== null) && (!serviceId || serviceId === "Todos" || serviceId === null )) {
        getOffersByOperator(operatorId);
      } else if ( (serviceId !== "Todos" && serviceId !== null) && (!operatorId || operatorId === "Todos" || operatorId === null )) {
        getOffersByService(serviceId);
      } else if ( operatorId === "Todos" && serviceId === "Todos" ) {
        getOffers();
      } else if( (operatorId === "Todos" || !serviceId) || (serviceId === "Todos" || !operatorId) ) {
        getOffers();
      } else {
        getOffersByOperatorAndService(operatorId, serviceId);
      }
    }else{
      getOffers();
    }
  }

  return (
    <>
      <Navbar />
      <section className="py-10 px-6 bg-gray-50"> 
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
        : <BentoGridSectionOffers  offers={fetchedOffers}/>   
      }
      </section>
    </>
  );
};

export default OffersPage;

