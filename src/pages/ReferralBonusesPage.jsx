import React from 'react';
import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import ReferralBonusesTable from "../sections/referral/referral-bonuses-table";

const ReferralBonusesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <TransversalHeader
        title="Bonos disponibles"
        description="Visualiza tus bonos disponibles y solicita el pago."
      />
      <ReferralBonusesTable />
    </div>
  );
};

export default ReferralBonusesPage;
