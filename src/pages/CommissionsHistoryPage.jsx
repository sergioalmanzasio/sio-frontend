import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import CommissionsHistoryTable from "../sections/commissions-tables/commissions-history-table";

export default function CommissionsHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar />
      <TransversalHeader
        title="Historial de cobros"
        description="Visualiza el historial completo de tus cobros de comisiones."
      />
      
      <CommissionsHistoryTable />
      
    </div>
  );
}
