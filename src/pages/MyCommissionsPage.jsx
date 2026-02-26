import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import CommissionsTable from "../sections/commissions-tables/commissions-table";

export default function MyCommissionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar />
      <TransversalHeader
        title="Comisiones disponibles"
        description="Visualiza tus comisiones disponibles y solicita el pago."
      />
      
      <CommissionsTable />
      
    </div>
  );
}
