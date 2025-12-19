import React from 'react';
import Navbar from '../components/Navbar';
import MyReferralsTable from '../sections/referrals-tables/my-referrals-table';
import TransversalHeader from '../components/header/TransversalHeader';

export default function MyReferralsPage() {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar />
      <TransversalHeader
        title="Mis Referidos"
        description="Gestiona y visualiza todos tus clientes referidos."
      />
      <MyReferralsTable />
    </div>
  );
}
