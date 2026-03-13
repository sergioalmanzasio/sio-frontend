import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import BonusesHistoryTable from "../sections/referral/bonuses-history-table";

export default function BonusesHistoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Historial de bonos"
        description="Consulta todas tus bonificaciones y el estado actual de cada una."
      />
      <BonusesHistoryTable />
    </div>
  );
}
