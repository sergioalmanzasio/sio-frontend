
import Navbar from "../components/Navbar";
import BentoGridSection from "../sections/bentro-grid/BentoGridSection";
import BentoGridSkeleton from "../sections/bentro-grid/BentoGridSkeleton";
import { useEffect, useState } from "react";
import OfferHeader from "../components/header/OfferHeader";

const OffersPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula una carga de datos
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simula una carga de datos que toma 2 segundos
  }, []);

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
      <OfferHeader isLoadingOffers={isLoading} />
      {isLoading ? <BentoGridSkeleton /> : <BentoGridSection />}
      </section>
    </>
  );
};

export default OffersPage;

