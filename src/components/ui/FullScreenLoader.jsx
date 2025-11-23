export default function FullScreenLoader({ show, message = "Procesando solicitud..." }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-9999">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500"></div>
        <span className="text-white text-lg font-medium">{message}</span>
      </div>
    </div>
  );
}