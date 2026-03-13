import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import CommissionsHistoryTable from "../sections/commissions-tables/commissions-history-table";

export default function CommissionsHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar />
      <TransversalHeader
        title="Historial de comisiones"
        description="Consulta todas tus comisiones y el estado actual de cada una."
      />
      <CommissionsHistoryTable />
    </div>
  );
}
