import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import AdminServiceRequestsTable from "../sections/admin/admin-service-requests-table";

export default function AdminServiceRequestsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Solicitudes de Servicio"
        description="Visualiza todas las solicitudes de servicio registradas."
      />
      <AdminServiceRequestsTable />
    </div>
  );
}
