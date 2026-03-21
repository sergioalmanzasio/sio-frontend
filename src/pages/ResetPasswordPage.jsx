import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TransversalHeader from "../components/header/TransversalHeader";
import { Input } from "../components/ui/input";
import { PrimaryButton } from "../components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import ToastAlert from "../components/alerts/ToastAlert";
import { API_BASE_URL } from "../shared/constanst";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "info",
        title: "Por favor completa todos los campos."
      });
      return;
    }
    if (password !== confirmPassword) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "info",
        title: "Las contraseñas no coinciden."
      });
      return;
    }

    if (!token) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Enlace de recuperación inválido o expirado."
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          token, 
          newPassword: password, 
          confirmPassword 
        })
      });
      const data = await response.json();

      ToastAlert({
        position: "top",
        timer: 2500,
        icon: data.process === 'success' ? 'success' : 'error',
        title: data.message || "Se ha procesado la solicitud."
      });

      if (data.process === 'success' || response.ok) {
        navigate("/");
      }
    } catch (error) {
      ToastAlert({
        position: "top",
        timer: 1800,
        icon: "error",
        title: "Ocurrió un error al actualizar la contraseña."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <TransversalHeader
        title="Restablecer Contraseña"
        description="Ingresa tu nueva contraseña y confírmala para acceder a tu cuenta."
      />

      <main className="flex-1 flex items-center justify-center p-4 lg:p-0 max-w-6xl mx-auto w-full mb-12">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-fadeIn md:mt-10">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña
                </label>
                <Input
                  type="password"
                  placeholder="Ingresa tu nueva contraseña"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña
                </label>
                <Input
                  type="password"
                  placeholder="Confirma tu nueva contraseña"
                  icon={Lock}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <PrimaryButton
              type="submit"
              disabled={loading}
              className="w-full h-14 flex items-center justify-center text-sm"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="italic animate-pulse">Actualizando...</span>
                </div>
              ) : (
                "Guardar nueva contraseña"
              )}
            </PrimaryButton>
          </form>
        </div>
      </main>
    </div>
  );
}
