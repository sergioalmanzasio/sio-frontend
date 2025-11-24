import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import ServiceRequestsClientTable from "../sections/service-requests-tables/service-requests-client-table";


const ClientServiceRequests = () => {
  return (
    <div>
      <Navbar />
      <TransversalHeader
        title="Solicitudes de Servicio"
        description="Gestiona las solicitudes de servicio que has realizado y su estado"
      />
      <ServiceRequestsClientTable />
    </div>
  );
};

export default ClientServiceRequests;
