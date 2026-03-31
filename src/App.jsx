import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { useAuth } from "./context/AuthContext";
import useInactivityLogout from "./hooks/useInactivityLogout";

import LandingPage from "./pages/LandingPage";
import OffersPage from "./pages/OffersPage";
import ClientServiceRequests from "./pages/ClientServiceRequests";
import SysAdminDashboard from "./pages/SysAdminDashboard";
import CoordinatorServiceRequests from "./pages/CoordinatorServiceRequests";
import ServiceCoordinatorDashboard from "./pages/ServiceCoordinatorDashboard";
import AuthRedirect from "./pages/AuthRedirect";
import SignupPage from "./pages/SignupPage";
import ConfigPage from "./pages/ConfigPage";
import MyReferralsPage from "./pages/MyReferralsPage";
import ServiceFollowUpPage from "./pages/ServiceFollowUpPage";
import LandingPageV2 from "./pages/LandingPage-v2";
import ReferralDashboard from "./pages/ReferralDashboard";
import AddReferralPage from "./pages/AddReferralPage";
import AssignedReferralsPage from "./pages/AssignedReferralsPage";
import AssociateOfferPage from "./pages/AssociateOfferPage";
import MyReferralServicesPage from "./pages/MyReferralServicesPage";
import MyCommissionsPage from "./pages/MyCommissionsPage";
import CommissionWithdrawalsPage from "./pages/CommissionWithdrawalsPage";
import CommissionsHistoryPage from "./pages/CommissionsHistoryPage";
import CommissionPaymentsPage from "./pages/CommissionPaymentsPage";
import AdminServiceRequestsPage from "./pages/AdminServiceRequestsPage";
import AdminBonusesPage from "./pages/AdminBonusesPage";
import AdminBenefitsPage from "./pages/AdminBenefitsPage";
import AdminOffersPage from "./pages/AdminOffersPage";
import AdminOperatorsPage from "./pages/AdminOperatorsPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SessionManager from "./components/SessionManager";
import ReferralBonusesPage from "./pages/ReferralBonusesPage";
import AdminBonusWithdrawalsPage from "./pages/AdminBonusWithdrawalsPage";
import BonusesHistoryPage from "./pages/BonusesHistoryPage";
import BonusPaymentsPage from "./pages/BonusPaymentsPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CompensationPlanPage from "./pages/CompensationPlanPage";
import CustomerReferencingPage from "./pages/CustomerReferencingPage";
import "driver.js/dist/driver.css";

function App() {

  return (
    <BrowserRouter>
        <SessionManager />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/compensation-plan" element={<CompensationPlanPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/auth-redirect" element={<AuthRedirect />} />
          <Route path="/customer-referencing" element={<CustomerReferencingPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/client-service-requests" element={<ClientServiceRequests />} />
            <Route path="/sysadmin/dashboard" element={<SysAdminDashboard />} />
            <Route path="/coordinator-service-requests" element={<CoordinatorServiceRequests />} />
            <Route path="/coordinator/dashboard" element={<ServiceCoordinatorDashboard />} />
            <Route path="/coordinator/my-referral-services" element={<MyReferralServicesPage />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="/my-referrals" element={<MyReferralsPage />} />
            <Route path="/referral/dashboard" element={<ReferralDashboard />} />
            <Route path="/referral/bonuses" element={<ReferralBonusesPage />} />
            <Route path="/add-referral" element={<AddReferralPage />} />
            <Route path="/assigned-referrals" element={<AssignedReferralsPage />} />
            <Route path="/associate-offer" element={<AssociateOfferPage />} />
            <Route path="/service-follow-up" element={<ServiceFollowUpPage />} />
            <Route path="/my-commisions" element={<MyCommissionsPage />} />
            <Route path="/commision/withdrawals" element={<CommissionWithdrawalsPage />} />
            <Route path="/commissions/history" element={<CommissionsHistoryPage />} />
            <Route path="/bonuses/history" element={<BonusesHistoryPage />} />
            <Route path="/bonuses/payments" element={<BonusPaymentsPage />} />
            <Route path="/commission-payments" element={<CommissionPaymentsPage />} />
            <Route path="/admin/service-requests" element={<AdminServiceRequestsPage />} />
            <Route path="/admin/bonuses" element={<AdminBonusesPage />} />
            <Route path="/bonuses/withdrawals" element={<AdminBonusWithdrawalsPage />} />
            <Route path="/admin/offers" element={<AdminOffersPage />} />
            <Route path="/admin/operators" element={<AdminOperatorsPage />} />
            <Route path="/admin/benefits" element={<AdminBenefitsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          </Route>

          <Route path="/v2" element={<LandingPageV2 />} />
        </Routes>
      
    </BrowserRouter>
  )
}

export default App
