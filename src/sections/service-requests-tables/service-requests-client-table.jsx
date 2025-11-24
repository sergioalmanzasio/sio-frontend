import ServiceRequestsTableSkeleton from "./service-requests-table-skeleton";
import { useState, useEffect } from "react";


const buttomDetails = () => (
  <button className="text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600 px-3 py-1 rounded-md text-xs font-semibold transition duration-150">
    Ver más
  </button>
);

const buttomCancel = () => (
  <button className="text-red-600 hover:text-white bg-red-100 hover:bg-red-600 px-3 py-1 rounded-md text-xs font-semibold transition duration-150">
    Cancelar
  </button>
);

const buttomDisabled = () => (
  <button
    className="text-gray-400 bg-white px-3 py-1 rounded-md text-xs font-semibold cursor-not-allowed border border-gray-200"
    disabled
  >
    Cancelar
  </button>
);


const tagStatus = (status) => {
  switch (status) {
    case 'pending':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Pendiente</span>;
    case 'in_progress':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  En progreso
                </span>;
    case 'approved':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Aprobado</span>;
    case 'completed':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completado</span>;
    case 'cancelled':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelado</span>;
    case 'rejected':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rechazado</span>;  
    default:
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Desconocido</span>;
  }
};

const listServiceRequest = [
  {
    id: 1,
    service: "Internet + TV - 300MB",
    status: "in_progress",
    date: "24/11/2025",
    advisor: "María Fernanda P."
  },
  {
    id: 2,
    service: "Línea Móvil Ilimitada",
    status: "pending",
    date: "15/11/2025",
    advisor: "Juan Carlos R."
  },
  {
    id: 3,
    service: "Solo Internet - 100MB",
    status: "rejected",
    date: "01/09/2025",
    advisor: "No aplica"
  },
  {
    id: 4,
    service: "Paquete Todo Incluido - 500MB",
    status: "completed",
    date: "10/08/2025",
    advisor: "Ana María L."
  }
];


const ServiceRequestsClientTable = () => {

  const [ isLoading, setIsLoading ] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ServiceRequestsTableSkeleton />;
  }
  
  return (
    <>  
      <div className="w-full md:w-3/4 mt-0 md:mt-8 mx-auto p-6 md:p-0">
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Servicio Solicitado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell"
              >
                Fecha de Solicitud
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell"
              >
                Asesorado Por
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {listServiceRequest.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex flex-col">
                    <span className="font-bold">{request.service}</span>
                    <span className="text-xs text-gray-500 sm:hidden mt-1">
                      <span className="font-semibold">Estado:</span>
                    {tagStatus(request.status)}
                  </span>
                  <span className="text-xs text-gray-500 sm:hidden mt-1">
                    <span className="font-semibold">Fecha:</span>
                    {request.date}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                {tagStatus( request.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                {request.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                    {request.advisor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 justify-center">
                  {buttomDetails()}
                  { request.status === 'completed' || request.status === 'rejected' ? buttomDisabled() : buttomCancel()}
                </div>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
              
      {/* <div className="mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servicio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Asesor
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex flex-col">
                  <span className="font-bold">Línea Móvil Ilimitada</span>
                  <span className="text-xs text-gray-500 sm:hidden mt-1">
                    <span className="font-semibold">Estado:</span>
                    {tagStatus('pending')}
                  </span>
                  <span className="text-xs text-gray-500 sm:hidden mt-1">
                    <span className="font-semibold">Fecha:</span>
                    15/11/2025
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                {tagStatus('pending')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                15/11/2025
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                Carlos Rueda G.
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 justify-center">
                  {buttomDetails()}
                  {buttomCancel()}
                </div>
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex flex-col">
                  <span className="font-bold inline-block max-w-[200px] whitespace-normal wrap-break-word">Solo Internet - 100MB </span>
                  <span className="text-xs text-gray-500 sm:hidden mt-1">
                    <span className="font-semibold">Estado:</span>
                    {tagStatus('completed')}
                  </span>
                  <span className="text-xs text-gray-500 sm:hidden mt-1">
                    <span className="font-semibold">Fecha:</span>
                    01/10/2025
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                {tagStatus('completed')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                01/10/2025
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                Laura Jaramillo L.
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 justify-center">
                  {buttomDetails()}
                  {buttomDisabled()}
                </div>
              </td>
            </tr>

            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex flex-col">
                  <span className="font-bold inline-block max-w-[200px] whitespace-normal wrap-break-word">Solo Internet - 100MB </span>
                  <span className="text-xs text-gray-500 sm:hidden mt-1">
                    <span className="font-semibold">Estado:</span>
                    {tagStatus('rejected')}
                  </span>
                  <span className="text-xs text-gray-500 sm:hidden mt-1">
                    <span className="font-semibold">Fecha:</span>
                    01/09/2025
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell">
                {tagStatus('rejected')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                01/09/2025
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                No aplica
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 justify-center">
                  {buttomDetails()}
                  {buttomDisabled()}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </div>
    </>
  );
};

export default ServiceRequestsClientTable;
