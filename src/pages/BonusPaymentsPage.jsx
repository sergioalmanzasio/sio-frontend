import React from 'react';
import Navbar from '../components/Navbar';
import TransversalHeader from '../components/header/TransversalHeader';
import BonusPaymentsTable from '../sections/admin/bonus-payments-table';

export default function BonusPaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Bonos Pagados"
        description="Consulta el historial de bonos que ya han sido pagados."
      />
      <main className="container mx-auto px-4 py-8">
        <BonusPaymentsTable />
      </main>
    </div>
  );
}
