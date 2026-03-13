import React from 'react';
import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import ReferralBonusesTable from "../sections/referral/referral-bonuses-table";

const ReferralBonusesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <TransversalHeader
        title="Comisiones disponibles"
        description="Visualiza tus comisiones disponibles y solicita el pago."
      />
      <ReferralBonusesTable />
    </div>
  );
};

export default ReferralBonusesPage;
