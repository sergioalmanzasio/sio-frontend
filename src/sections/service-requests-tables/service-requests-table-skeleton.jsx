

const ServiceRequestsTableSkeleton = ({message = "Cargando solicitudes..."}) => {
  return (
    <div className="w-full md:w-3/4 mt-4 md:mt-8 mx-auto py-3 px-6 md:p-0 max-w-6xl">
     <div className="flex justify-center py-4 flex-col items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <h1 className="text-md font-medium text-gray-800 mt-2">{message}</h1>
     </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          
          {/* HEAD */}
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Servicio Solicitado
              </th>
              <th className="px-6 py-3 hidden sm:table-cell text-left text-xs font-medium uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 hidden md:table-cell text-left text-xs font-medium uppercase tracking-wider">
                Fecha de Solicitud
              </th>
              <th className="px-6 py-3 hidden lg:table-cell text-left text-xs font-medium uppercase tracking-wider">
                Asesorado Por
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>

          {/* BODY SKELETON */}
          <tbody className="bg-white divide-y divide-gray-100">

            {[1,2,3].map((i) => (
              <tr key={i} className="animate-pulse">

                {/* SERVICIO */}
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded"></div>

                    {/* Mobile fields */}
                    <div className="sm:hidden flex flex-col space-y-1">
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                      <div className="h-3 w-28 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </td>

                {/* ESTADO (desktop) */}
                <td className="px-6 py-4 hidden sm:table-cell">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </td>

                {/* FECHA (md) */}
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </td>

                {/* ASESOR (lg) */}
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </td>

                {/* ACCIONES */}
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col sm:flex-row sm:space-x-2 sm:space-y-0 space-y-2 justify-center">
                    <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
                    <div className="h-8 w-20 bg-gray-300 rounded-md"></div>
                  </div>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceRequestsTableSkeleton;