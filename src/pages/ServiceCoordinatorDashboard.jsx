import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import TransversalHeader from '../components/header/TransversalHeader';
import DashboardCard from '../components/dashboard/DashboardCard';
import { MonthlyAssignmentsChart } from '../components/dashboard/CoordinatorCharts';
import useRequest from '../hooks/useRequest';
import FullScreenLoader from '../components/loader/FullScreenLoader';

export default function ServiceCoordinatorDashboard() {
  const { getServiceRequestsCount, getServiceRequestsCountByMonth } = useRequest();
  const [loading, setLoading] = useState(true);
  const [assignmentsData, setAssignmentsData] = useState([]);
  const [summaryData, setSummaryData] = useState([
    { title: "Solicitudes asignadas aún sin gestionar", value: "0", iconName: "activity", color: "orange" },
    { title: "Solicitudes asignadas y terminadas", value: "0", iconName: "check", color: "green" },
    { title: "Total de solicitudes recibidas", value: "0", iconName: "users", color: "blue" },
  ]);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [enGestionRes, finalizadoRes, todasRes, monthlyRes] = await Promise.all([
        getServiceRequestsCount("En proceso"),
        getServiceRequestsCount("Terminada"),
        getServiceRequestsCount("Total"),
        getServiceRequestsCountByMonth(),
      ]);

      setSummaryData([
        { title: "Solicitudes asignadas aún sin gestionar", value: String(enGestionRes?.data?.count ?? "0"), iconName: "activity", color: "orange" },
        { title: "Solicitudes asignadas y terminadas", value: String(finalizadoRes?.data?.count ?? "0"), iconName: "check", color: "green" },
        { title: "Total de solicitudes recibidas", value: String(todasRes?.data?.count ?? "0"), iconName: "users", color: "blue" },
      ]);

      if (monthlyRes?.data && Array.isArray(monthlyRes.data)) {
        const chartData = monthlyRes.data
          .map(item => ({ name: item.mes, asignaciones: Number(item.cantidad) }))
          .reverse();
        setAssignmentsData(chartData);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [getServiceRequestsCount, getServiceRequestsCountByMonth]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Panel principal"
        description="Resumen de gestión y asignaciones de servicios."
      />
      {loading ? <FullScreenLoader show={loading} message="Cargando panel..." /> : null}    
      <main className="container mx-auto px-4 py-8">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* Summary Cards - Top Row */}
          {summaryData.map((item, index) => (
            <div key={index} className="md:col-span-1">
              <DashboardCard {...item} />
            </div>
          ))}

          {/* Chart - Large Block */}
          <div className="md:col-span-4 md:row-span-2">
             <MonthlyAssignmentsChart data={assignmentsData} />
          </div>

          {/* Placeholder for future content or additional stats - Right Column Vertical */}
          <div className="md:col-span-1 md:row-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center hidden">
            <div className="p-4 bg-blue-50 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Actividad Reciente</h3>
            <p className="text-gray-500 text-sm">
              Aquí podrás ver las últimas actualizaciones de tus servicios asignados.
            </p>
            <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Ver historial completo
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
