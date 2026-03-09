import claroLogo from "../assets/logos/CLAROLOGO.png";
import movistarLogo from "../assets/logos/MOVISTARLOGO.png";
import womLogo from "../assets/logos/WOMLOGO.png";
import tigoLogo from "../assets/logos/TIGOLOGO.png";
import ToastAlert from "../components/alerts/ToastAlert";
import { API_COLOMBIA } from "./constanst";


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

export const sessionExpiredToast = (logoutInstance, redirectToHome) => {
  ToastAlert({
    position: "top",
    timer: 2000,
    icon: "warning",
    title: "Su sesión ha expirado. Por favor, inicie sesión de nuevo.",
  });

  setTimeout(() => {
    logoutInstance();
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

export const getRolesToSignUp = () => {
  return [
    { id: 'referral', label: 'Plan referido', description: 'Recomienda servicios y gana comisiones.' },
    { id: 'client', label: 'Soy cliente', description: 'Activa tus servicios hoy.' },
    // { id: 'advisor', label: 'Soy asesor/a', description: 'Brinda asesoría y gestiona solicitudes.' },
  ];
};

export const getDocumentTypes = () => {
  return [
    { acronym: 'CC', label: 'Cédula de ciudadanía' },
    { acronym: 'CE', label: 'Cédula de extranjería' },
    { acronym: 'PA', label: 'Pasaporte' },
  ];
};

export const getBanks = () => {
  return ["Bancolombia", "Davivienda", "Banco de Bogotá", "BBVA", "Nequi", "Daviplata"];
}

export const getDepartments = async () => {
  const urlAPI = `${API_COLOMBIA}/v1/Department?sortBy=name&sortDirection=asc`;
  const response = await fetch(urlAPI);
  const data = await response.json();
  const departmentList = data.map((department) => ({
    id: department.id,
    name: department.name,
  }));
  return departmentList;
}

export const getCitiesByDepartmentId = async (departmentId) => {
  const urlAPI = `${API_COLOMBIA}/v1/Department/${departmentId}/cities?sortBy=name&sortDirection=asc`;
  const response = await fetch(urlAPI);
  const data = await response.json();
  const cityList = data.map((city) => ({
    id: city.id,
    name: city.name,
  }));
  return cityList;
}

export const getHousingTypes = () => {
  return [
    { id: 'Apartamento', label: 'Apartamento' },
    { id: 'Casa', label: 'Casa' },
    { id: 'Edificio', label: 'Edificio' },
    { id: 'Oficina', label: 'Oficina' },
  ];
}