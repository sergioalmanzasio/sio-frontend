import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';
import Navbar from '../components/Navbar';
import DashboardCard from '../components/dashboard/DashboardCard';
import useReferral from '../hooks/useReferral';
import { useAuth } from '../context/AuthContext';
import FullScreenLoader from '../components/loader/FullScreenLoader';
import BonusModal from '../components/modals/BonusModal';
import { SIO_CUSTOMER_REFERRAL_URL } from '../shared/constanst';
import Swal from 'sweetalert2';

export default function ReferralDashboard() {
  const { myReferrals, loadingMyReferrals, getTotalCommission } = useReferral();
  const { userData } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [totalCommission, setTotalCommission] = useState("$ 0");
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchReferrals = async () => {
      if (userData?.email) {
        try {
            const result = await myReferrals({ email: userData.email });
            if (result && result.data) {
                setReferrals(result.data);
            }
        } catch (error) {
            console.error("Error loading referrals", error);
        }
      }
    };
    fetchReferrals();
  }, [userData]);

  useEffect(() => {
    const fetchTotalCommission = async () => {
      if (userData?.email) {
        try {
          const result = await getTotalCommission();
          if (result && result.data && result.data.total_amount) {
            const formatted = `$ ${Number(result.data.total_amount).toLocaleString('es-CO')}`;
            setTotalCommission(formatted);
          }
        } catch (error) {
          console.error("Error loading total commission", error);
        }
      }
    };
    fetchTotalCommission();
  }, [userData]);

  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const getWeek = (d) => {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    };
    const currentWeek = getWeek(now);

    let countToday = 0;
    let countWeek = 0;
    let countMonth = 0;

    referrals.forEach(ref => {
        const dateString = ref.created_at_formatted || ref.registrationDate || ref.createdAt;
        if (!dateString) return;
        let dateStringHelper = dateString.replace('de', '');
        const refDate = new Date(dateStringHelper);
        const refDateString = new Date(refDate.getTime() - (refDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

        if (refDateString === today) {
            countToday++;
        }
        if (refDate.getMonth() === currentMonth && refDate.getFullYear() === currentYear) {
            countMonth++;
        }
        if (getWeek(refDate) === currentWeek && refDate.getFullYear() === currentYear) {
            countWeek++;
        }
    });

    return [
        { title: "Referidos registrados hoy", value: countToday.toString(), iconName: "users", trend: "neutral", trendValue: "-", color: "blue" },
        { title: "Referidos registrados esta semana", value: countWeek.toString(), iconName: "users", trend: "neutral", trendValue: "-", color: "purple" },
        { title: "Referidos registrados este mes", value: countMonth.toString(), iconName: "users", trend: "neutral", trendValue: "-", color: "green" },
        { title: "Comisiones devengadas", value: totalCommission, iconName: "dollar", trend: "neutral", trendValue: "-", color: "orange" },
    ];
  }, [referrals, totalCommission]);

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(`${SIO_CUSTOMER_REFERRAL_URL}${userData?.referralCode}`);
    Swal.fire({
      title: "¡Enlace copiado!",
      text: "El enlace de referenciación ha sido copiado al portapapeles.",
      icon: "success",
      timer: 2500,
      showConfirmButton: false,
    });
  }
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {loadingMyReferrals && <FullScreenLoader show={loadingMyReferrals} message="Cargando información, espere un momento..." />}
      <BonusModal />
      <main className="container mx-auto px-4 py-8 mt-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hola, {userData?.firstName || 'Referido'}</h1>
          <p className="text-gray-500 mt-2">Aquí tienes el resumen de tu actividad.</p>
          <div className="mt-4 flex flex-col items-center justify-between items-start gap-2 bg-purple-50 p-2 rounded-xl px-4 py-4">
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-gray-900 font-semibold text-sm">Link de referenciación:</h2>
              <p className="text-gray-900 text-sm">A continuación encontrarás el enlace de referenciación, solo da click en el botón de copiar y envía al cliente que desees referenciar</p>
            </div>
            <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:-translate-y-0.5 cursor-pointer " onClick={handleCopyReferralCode}><Copy className="w-4 h-4"/> Copiar</button>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item, index) => (
            <DashboardCard key={index} {...item} />
          ))}
        </div>

        <div className="bg-[#0f172a] rounded-3xl shadow-lg border border-gray-800 p-8 md:p-12 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-6">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-semibold tracking-wide uppercase">
                        Programa de referidos
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        Por cada venta completada <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">gana $50.000</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-xl">
                        Cada cliente que complete su servicio a través de tu gestión te genera una comisión fija.
                    </p>
                    <p className="text-lg text-gray-400 max-w-xl">Vigencia: 01 ene 2026 - 31 mar 2026</p>
                    <button 
                        onClick={() => navigate('/add-referral')}
                        className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transform hover:-translate-y-1 cursor-pointer"
                    >
                        Registrar cliente
                    </button>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 blur-3xl rounded-full transform scale-75"></div>
                    <div className="relative w-full max-w-sm rounded-3xl p-[2px] bg-[conic-gradient(from_0deg,#ec4899,#8b5cf6,#6366f1,#ec4899)] ">
                      <div className="bg-[#1a1f37]/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                          <svg width="100" height="100" viewBox="0 0 100 100">
                            <circle cx="80" cy="20" r="40" fill="url(#paint0_radial)" />
                            <defs>
                              <radialGradient id="paint0_radial" cx="0" cy="0" r="1"
                                gradientUnits="userSpaceOnUse"
                                gradientTransform="translate(80 20) rotate(90) scale(40)">
                                <stop stopColor="#EC4899"/>
                                <stop offset="1" stopColor="#8B5CF6" stopOpacity="0"/>
                              </radialGradient>
                            </defs>
                          </svg>
                        </div>

                        <div className="text-center py-8 space-y-4">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg mb-4">
                            <span className="text-3xl">🎁</span>
                          </div>

                          <h3 className="text-white text-5xl font-bold tracking-tight">
                            $ 50.000
                          </h3>

                          <p className="text-gray-100 font-medium tracking-wide text-md">
                            Por cada cliente que complete su servicio.
                          </p>
                        </div>

                      </div>

                    </div>
                </div>
            </div>
            
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-pink-500/10 blur-3xl rounded-full"></div>
        </div>

      </main>
    </div>
  );
}
