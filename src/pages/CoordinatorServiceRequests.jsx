import React from 'react';
import Navbar from '../components/Navbar';
import ServiceRequestsCoordinatorTable from '../sections/service-requests-tables/service-requests-coordinator-table';
import TransversalHeader from '../components/header/TransversalHeader';

export default function CoordinatorServiceRequests() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Solicitudes de Servicio"
        description="Gestiona las solicitudes de servicio que tienes asignadas."
      />
      <ServiceRequestsCoordinatorTable />
    </div>
  );
}
