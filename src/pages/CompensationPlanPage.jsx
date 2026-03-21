import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import useOffer from "../hooks/useOffer";
import { Loader2 } from "lucide-react";

export default function CompensationPlanPage() {
  const { getCompensationPlan, loading } = useOffer();
  const [compensationPlans, setCompensationPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const plans = await getCompensationPlan();
      if (plans && Array.isArray(plans)) {
        setCompensationPlans(plans);
      }
    };
    fetchPlans();
  }, [getCompensationPlan]);
  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <TransversalHeader
        title="Plan de Compensación"
        description="Consulta las comisiones por operador y tipo de servicio."
      />

      <main className="flex-1 p-4 lg:p-0 max-w-6xl mx-auto w-full mb-12 mt-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
        ) : compensationPlans.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-gray-100">
            No hay planes de compensación disponibles en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compensationPlans.map((plan, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                  {plan.operator_name}
                </h3>
                <div className="space-y-4">
                  {plan.services.map((service, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">{service.service_type}</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 flex items-center h-8 rounded-md border border-emerald-100">
                        {service.commission_value_forrmtaed || `$ ${service.commission}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
