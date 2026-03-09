import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import WithdrawalsTable from "../sections/commissions-tables/withdrawals-table";

export default function CommissionWithdrawalsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <TransversalHeader
        title="Solicitudes de pago"
        description="Gestiona y paga las comisiones solicitadas por los referidos."
      />
      
      <div className="flex-1">
        <WithdrawalsTable />
      </div>
    </div>
  );
}
