import claroLogo from "../assets/logos/CLAROLOGO.png";
import movistarLogo from "../assets/logos/MOVISTARLOGO.png";
import womLogo from "../assets/logos/WOMLOGO.png";
import tigoLogo from "../assets/logos/TIGOLOGO.png";
import ToastAlert from "../components/alerts/ToastAlert";


export const getColorOpertator = (nameOperator) => {
  const colors = {
    CLARO: "bg-red-500",
    MOVISTAR: "bg-blue-700",
    TIGO: "bg-blue-400",
    WOM: "bg-purple-500",
  };
  return colors[nameOperator];
};

export const getColorHoverOpertator = (nameOperator) => {
  const colors = {
    CLARO: "bg-yellow-600",
    MOVISTAR: "bg-blue-600",
    TIGO: "bg-green-600",
    WOM: "bg-purple-600",
  };
  return colors[nameOperator];
};

export const getColorShadowOpertator = (nameOperator) => {
  const colors = {
    CLARO: "shadow-red-500/50",
    MOVISTAR: "shadow-blue-500/50",
    TIGO: "shadow-green-500/50",
    WOM: "shadow-purple-500/50",
  };
  return colors[nameOperator];
};

export const getColorButtonBuy = (nameOperator) => {
  const colors = {
    CLARO: "bg-red-800",
    MOVISTAR: "bg-blue-800",
    TIGO: "bg-blue-600",
    WOM: "bg-purple-800",
  };
  return colors[nameOperator];
};

export const getColorButtonBenefits = (nameOperator) => {
  const colors = {
    CLARO: "bg-red-400",
    MOVISTAR: "bg-blue-400",
    TIGO: "bg-blue-300",
    WOM: "bg-purple-400",
  };
  return colors[nameOperator];
};

export const OPERATORS_LOGOS = {
  CLARO: claroLogo,
  MOVISTAR: movistarLogo,
  WOM: womLogo,
  TIGO: tigoLogo,
};

export const sessionExpiredToast = (logout, redirectToHome) => {
  ToastAlert({
    position: "top",
    timer: 2000,
    icon: "warning",
    title: "Su sesión ha expirado. Por favor, inicie sesión de nuevo.",
  });
  
  setTimeout(() => {
    logout();
    redirectToHome();
  }, 2000);
};


export const chipServiceRequestStatus = (status) => {
  const statusMap = {
    'pending': '<Chip class="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-semibold">Pendiente</Chip>',
    'in_progress': '<Chip class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-semibold">En progreso</Chip>',
    'approved': '<Chip class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-semibold">Aprobado</Chip>',
    'completed': '<Chip class="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-semibold">Completado</Chip>',
    'cancelled': '<Chip class="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-semibold">Cancelado</Chip>',
    'rejected_client': '<Chip class="bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-semibold">Cancelado por el solicitante</Chip>'
  };
  return statusMap[status.toLowerCase()] || status;
};



