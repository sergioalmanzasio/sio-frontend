
import { useEffect, useState } from "react";
import BentoGridSectionOffers from "../sections/bentro-grid/BentoGridSectionOffers";
import BentoGridSkeletonOffers from "../sections/bentro-grid/BentoGridSkeletonOffers";
import Navbar from "../components/Navbar";
import OfferHeader from "../components/header/OfferHeader";
import useOffer from "../hooks/useOffer";

const OffersPage = () => {
  const { offers: fetchedOffers, loading: loadingOffers, getOffers } = useOffer();
  
  useEffect(() => {
    getOffers();
  }, [getOffers]); 

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
      <OfferHeader isLoadingOffers={loadingOffers} />
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

