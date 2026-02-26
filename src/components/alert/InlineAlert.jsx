import { Info, TriangleAlert, ShieldX, CircleCheckBig } from "lucide-react";

const STYLES = {
  info: {
    container: "bg-cyan-50 border-cyan-200 border-l-cyan-400",
    icon: "text-cyan-400",
    title: "text-cyan-700",
    message: "text-cyan-600",
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 border-l-yellow-400",
    icon: "text-yellow-400",
    title: "text-yellow-700",
    message: "text-yellow-600",
  },
  error: {
    container: "bg-red-50 border-red-200 border-l-red-400",
    icon: "text-red-400",
    title: "text-red-700",
    message: "text-red-600",
  },
  success: {
    container: "bg-green-50 border-green-200 border-l-green-400",
    icon: "text-green-400",
    title: "text-green-700",
    message: "text-green-600",
  },
};

const ICONS = {
  info: Info,
  warning: TriangleAlert,
  error: ShieldX,
  success: CircleCheckBig,
};

export default function InlineAlert({ title, message, type = "info" }) {
  const styles = STYLES[type] || STYLES.info;
  const Icon = ICONS[type] || ICONS.info;

  return (
    <div className={`flex items-start gap-3 border border-l-4 rounded-lg p-4 ${styles.container}`}>
      <div className="flex-shrink-0 mt-0.5">
        <Icon className={`w-6 h-6 ${styles.icon}`} />
      </div>
      <div>
        <p className={`text-sm font-semibold ${styles.title}`}>{title}</p>
        <p className={`text-sm mt-0.5 ${styles.message}`}>{message}</p>
      </div>
    </div>
  );
}
