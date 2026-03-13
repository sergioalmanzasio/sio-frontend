import React from 'react';
import Navbar from '../components/Navbar';
import TransversalHeader from '../components/header/TransversalHeader';
import CommissionPaymentsTable from '../sections/commissions-tables/commission-payments-table';

export default function CommissionPaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Comisiones Pagadas"
        description="Consulta el historial de comisiones que ya han sido pagadas."
      />
      <main className="container mx-auto px-4 py-8">
        <CommissionPaymentsTable />
      </main>
    </div>
  );
}
