import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import ServiceFollowUpTable from "../sections/service-follow-up-tables/service-follow-up-table";

export default function ServiceFollowUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar />
      <TransversalHeader
        title="Seguimiento de clientes referidos"
        description="Gestiona y visualiza el seguimiento de los clientes referidos."
      />
      
      <ServiceFollowUpTable />
      
    </div>
  );
}
