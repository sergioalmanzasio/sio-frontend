import claroLogo from "../assets/logos/CLAROLOGO.png";
import movistarLogo from "../assets/logos/MOVISTARLOGO.png";
import womLogo from "../assets/logos/WOMLOGO.png";
import tigoLogo from "../assets/logos/TIGOLOGO.png";


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



