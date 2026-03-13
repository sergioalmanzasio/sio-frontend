import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import AdminBonusWithdrawalsTable from "../sections/admin/admin-bonus-withdrawals-table";

export default function AdminBonusWithdrawalsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <TransversalHeader
        title="Solicitudes de pago de bonos"
        description="Gestiona y paga los bonos solicitados por los referidos."
      />
      
      <div className="flex-1">
        <AdminBonusWithdrawalsTable />
      </div>
    </div>
  );
}
