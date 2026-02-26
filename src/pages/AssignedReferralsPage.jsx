import React from 'react';
import Navbar from '../components/Navbar';
import AssignedReferralsTable from '../sections/referrals-tables/assigned-referrals-table';
import TransversalHeader from '../components/header/TransversalHeader';

export default function AssignedReferralsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Referidos Asignados"
        description="Gestiona los referidos que han sido asignados para gestión de servicios."
      />
      <AssignedReferralsTable />
    </div>
  );
}
