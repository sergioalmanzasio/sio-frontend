import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import AdminCategoriesTable from "../sections/admin/admin-categories-table";

export default function AdminCategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Gestión de Categorías"
        description="Visualiza y administra todas las categorías del sistema."
      />
      <AdminCategoriesTable />
    </div>
  );
}
