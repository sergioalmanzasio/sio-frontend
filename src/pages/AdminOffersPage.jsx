import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import AdminOffersTable from "../sections/admin/admin-offers-table";

export default function AdminOffersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Gestión de Ofertas"
        description="Visualiza todas las ofertas disponibles para las ofertas."
      />
      <AdminOffersTable />
    </div>
  );
}
