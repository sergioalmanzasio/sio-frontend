import React from 'react';
import Navbar from '../components/Navbar';
import AddClientForm from '../components/forms/AddClientForm';
import { useNavigate } from 'react-router-dom';
import TransversalHeader from '../components/header/TransversalHeader';

export default function AddReferralPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
         title="Agregar cliente"
         description="Ingresa los datos del cliente que deseas referir."
      />
      <main className="container mx-auto px-4 mt-0 md:mt-2">
        <div className="w-full md:w-3/3 md:px-12 mx-auto md:px-0 lg:px-0 max-w-6xl">
           <AddClientForm 
             onSuccess={() => navigate('/my-referrals')}
             onCancel={() => navigate('/referral/dashboard')}
             hasLegend={false}
           />
        </div>
      </main>
    </div>
  );
}
