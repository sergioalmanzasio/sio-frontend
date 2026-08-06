import Navbar from "../../components/Navbar";
import TransversalHeader from "../../components/header/TransversalHeader";
import AdminUserTable from "../../sections/admin/admin-user-table";

export default function AdminUserPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Gestión de Usuarios"
        description="Visualiza la lista de usuarios registrados en el sistema."
      />
      <AdminUserTable />
    </div>
  );
}
