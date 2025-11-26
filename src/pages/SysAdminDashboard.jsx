import React from 'react';
import Navbar from '../components/Navbar';
import DashboardCard from '../components/dashboard/DashboardCard';
import { RolesChart, ServiceRequestsChart, CommissionsChart } from '../components/dashboard/DashboardCharts';

// Mock data
const summaryData = [
  { title: "Usuarios registrados", value: "1,234", iconName: "users", trend: "up", trendValue: "12%", color: "blue" },
  { title: "Servicios solicitados", value: "856", iconName: "activity", trend: "up", trendValue: "5%", color: "purple" },
  { title: "Comisiones pagadas", value: "$ 45.230", iconName: "dollar", trend: "down", trendValue: "2%", color: "green" },
  { title: "Servicios pendientes", value: "23", iconName: "activity", trend: "up", trendValue: "8%", color: "orange" },
];

const rolesData = [
  { name: 'Admin', value: 5 },
  { name: 'Cliente', value: 800 },
  { name: 'Asesor', value: 100 },
  { name: 'Proveedor', value: 429 },
];

const requestsData = [
  { name: 'Jun', requests: 65 },
  { name: 'Jul', requests: 59 },
  { name: 'Ago', requests: 80 },
  { name: 'Sep', requests: 81 },
  { name: 'Oct', requests: 56 },
  { name: 'Nov', requests: 115 },
];

const commissionsData = [
  { name: 'Jun', amount: 4000 },
  { name: 'Jul', amount: 3000 },
  { name: 'Ago', amount: 5000 },
  { name: 'Sep', amount: 4500 },
  { name: 'Oct', amount: 6000 },
  { name: 'Nov', amount: 7500 },
];

export default function SysAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-0">
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
          <ServiceRequestsChart data={requestsData} />
          <RolesChart data={rolesData} />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <CommissionsChart data={commissionsData} />
        </div>
      </main>
    </div>
  );
}
