import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import AdminBenefitsTable from "../sections/admin/admin-benefits-table";

export default function AdminBenefitsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Gestión de Beneficios"
        description="Visualiza todos los beneficios disponibles en el sistema."
      />
      <AdminBenefitsTable />
    </div>
  );
}
