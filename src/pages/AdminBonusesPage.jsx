import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import AdminBonusesTable from "../sections/admin/admin-bonuses-table";

export default function AdminBonusesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Gestión de Bonos"
        description="Administra los bonos disponibles del sistema."
      />
      <AdminBonusesTable />
    </div>
  );
}
