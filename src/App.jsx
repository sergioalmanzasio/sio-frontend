import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from "./pages/LandingPage";
import OffersPage from "./pages/OffersPage";
import ClientServiceRequests from "./pages/ClientServiceRequests";
import SysAdminDashboard from "./pages/SysAdminDashboard";
import { AuthProvider } from "./context/AuthContext";

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/client-service-requests" element={<ClientServiceRequests />} />
          <Route path="/sysadmin/dashboard" element={<SysAdminDashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
