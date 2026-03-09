import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../shared/constanst';
import { useAuth } from '../context/AuthContext';
import ToastAlert from '../components/alerts/ToastAlert';
import { sessionExpiredToast } from '../shared/utils';

const useAdmin = () => {
 const { logout } = useAuth();
 const [loadingDashboardCards, setLoadingDashboardCards] = useState(false);
 const [dashboardCardsData, setDashboardCardsData] = useState({
  activeUsers: '0',
  serviceRequests: '0',
  paidCommissions: '$ 0',
  pendingRequests: '0',
  serviceRequestsByMonth: [],
  paidCommissionsByMonth: [],
  usersByRole: [],
 });

 const getDashboardCardsData = useCallback(async () => {
  setLoadingDashboardCards(true);
  try {
   const fetchWithAuth = async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
     method: 'GET',
     credentials: 'include',
     headers: {
      'Content-Type': 'application/json',
     },
    });
    const data = await response.json();
    if (!response.ok) {
     if (response.status === 401) {
      return { error: 'unauthorized' };
     }
     throw new Error(data.message || 'Error');
    }
    return data.data;
   };

   const [users, requests, paid, pending, requestsByMonthData, paidCommissionsByMonthData, usersByRoleData] = await Promise.all([
    fetchWithAuth('/admin/dashboard/total-active-users'),
    fetchWithAuth('/admin/dashboard/total-service-requests'),
    fetchWithAuth('/admin/dashboard/total-paid-commissions'),
    fetchWithAuth('/admin/dashboard/total-pending-service-requests'),
    fetchWithAuth('/admin/dashboard/total-service-requests-by-month'),
    fetchWithAuth('/admin/dashboard/total-paid-commissions-by-month'),
    fetchWithAuth('/admin/dashboard/total-users-by-role'),
   ]);

   if ([users, requests, paid, pending, requestsByMonthData, paidCommissionsByMonthData, usersByRoleData].some(res => res && res.error === 'unauthorized')) {
    sessionExpiredToast(logout, () => window.location.href = '/');
    return;
   }

   const formattedRequestsByMonth = Array.isArray(requestsByMonthData)
    ? requestsByMonthData.map(item => ({
     name: item.mes,
     requests: parseInt(item.cantidad, 10) || 0
    })).reverse()
    : [];

   const formattedPaidCommissionsByMonth = Array.isArray(paidCommissionsByMonthData)
    ? paidCommissionsByMonthData.map(item => ({
     name: item.mes,
     amount: parseFloat(item.total) || 0
    })).reverse()
    : [];

   const roleTranslations = {
    'referral': 'Referido',
    'root': 'Super admin',
    'admplt': 'Admin plataforma',
    'service coordinator': 'Coordinador de servicios',
    'client': 'Cliente',
    'advisor': 'Asesor',
    'provider': 'Proveedor'
   };

   const formattedUsersByRole = Array.isArray(usersByRoleData)
    ? usersByRoleData.map(item => ({
     name: roleTranslations[item.role_name?.toLowerCase()] || item.role_name,
     value: parseInt(item.total_usuarios, 10) || 0
    }))
    : [];

   setDashboardCardsData({
    activeUsers: users?.toString() || '0',
    serviceRequests: requests?.toString() || '0',
    paidCommissions: paid?.toString() || '$ 0',
    pendingRequests: pending?.toString() || '0',
    serviceRequestsByMonth: formattedRequestsByMonth,
    paidCommissionsByMonth: formattedPaidCommissionsByMonth,
    usersByRole: formattedUsersByRole,
   });
  } catch (error) {
   console.error(error);
   ToastAlert({
    position: 'center',
    timer: 2000,
    icon: 'error',
    title: 'Error al cargar datos del tablero',
   });
  } finally {
   setLoadingDashboardCards(false);
  }
 }, [logout]);

 return {
  getDashboardCardsData,
  loadingDashboardCards,
  dashboardCardsData
 };
};

export default useAdmin;
