import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import DashboardCard from '../components/dashboard/DashboardCard';
import { RolesChart, ServiceRequestsChart, CommissionsChart } from '../components/dashboard/DashboardCharts';
import useAdmin from '../hooks/useAdmin';
import FullScreenLoader from '../components/loader/FullScreenLoader';

export default function SysAdminDashboard() {
  const { getDashboardCardsData, loadingDashboardCards, dashboardCardsData } = useAdmin();

  useEffect(() => {
    getDashboardCardsData();
  }, [getDashboardCardsData]);

  const summaryData = [
    { title: "Usuarios registrados", value: dashboardCardsData.activeUsers, iconName: "users", trend: "up", trendValue: "12%", color: "blue" },
    { title: "Servicios solicitados", value: dashboardCardsData.serviceRequests, iconName: "activity", trend: "up", trendValue: "5%", color: "purple" },
    { title: "Comisiones pagadas", value: dashboardCardsData.paidCommissions, iconName: "dollar", trend: "down", trendValue: "2%", color: "green" },
    { title: "Servicios pendientes", value: dashboardCardsData.pendingRequests, iconName: "pending", trend: "up", trendValue: "8%", color: "orange" },
  ];

 

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
       {loadingDashboardCards && (
        <FullScreenLoader show={loadingDashboardCards} message="Cargando tablero..." />
      )}
      <main className="container mx-auto px-4 py-8 mt-0 animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel principal SysAdmin</h1>
          <p className="text-gray-500 mt-2">Bienvenido al panel principal del sistema.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryData.map((item, index) => (
            <DashboardCard key={index} {...item} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ServiceRequestsChart data={dashboardCardsData.serviceRequestsByMonth} />
          <RolesChart data={dashboardCardsData.usersByRole} />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <CommissionsChart data={dashboardCardsData.paidCommissionsByMonth} />
        </div>
      </main>
    </div>
  );
}
