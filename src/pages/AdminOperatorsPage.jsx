import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import AdminOperatorsTable from "../sections/admin/admin-operators-table";

export default function AdminOperatorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Gestión de Operadores"
        description="Visualiza todos los operadores de servicio en el sistema."
      />
      <AdminOperatorsTable />
    </div>
  );
}
