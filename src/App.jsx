import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from "./pages/LandingPage";
import OffersPage from "./pages/OffersPage";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/offers" element={<OffersPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
