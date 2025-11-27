import { useState, useEffect } from "react";
import ServiceRequestsTableSkeleton from "./service-requests-table-skeleton";
import useRequest from "../../hooks/useRequest";
import { useAuth } from "../../context/AuthContext";
import ToastAlert from "../../components/alerts/ToastAlert";
import OfferDetailModal from "../../components/alerts/OfferDetailModal";
import AccordionStatus from "../../components/accordion/AccordionStatus";


const ServiceRequestsCoordinatorTable = () => {

  const { loadingServiceRequestsByServiceCoordinator, getServiceRequestsByServiceCoordinator } = useRequest();
  const { isAuthenticated, userData, logout } = useAuth();
  const [serviceRequests, setServiceRequests] = useState([]);
  
  const itemModal = (item, description) => {
    return (
      '<div>' +
        '<span class="text-md font-semibold">' + item + '</span> : ' +
        '<span class="text-md">' + description + '</span>' +
      '</div>' 
    )
  }

  // Expandable section in HTML
  const expandableSection = (status) => {
    return (
      '<div>' +
        '<span class="text-md font-semibold">' + status + '</span>' +
        '<span class="text-md">' + status + '</span>' +
      '</div>' 
    )
  }

  const buttomDetails = (id) => (
    <button 
      className="text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600 px-3 py-1 rounded-md text-xs font-semibold transition duration-150 cursor-pointer" 
      onClick={() => handleRequestServiceShowMore(id)}
    >
      Ver más
    </button>
  );

  const buttonFillingNumber = (id) => (
    <button 
      className="text-purple-600 hover:text-white bg-purple-100 hover:bg-purple-600 px-3 py-1 rounded-md text-xs font-semibold transition duration-150 cursor-pointer" 
      onClick={() => console.log(id)}
    >
      Radicado
    </button>
  );

  const buttonComment = (id) => (
    <button 
      className="text-amber-600 hover:text-white bg-amber-100 hover:bg-amber-600 px-3 py-1 rounded-md text-xs font-semibold transition duration-150 cursor-pointer" 
      onClick={() => console.log(id)}
    >
      Comentario
    </button>
  );

  const tagStatus = (status) => {
    switch (status.toLowerCase()) {
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
      case 'rejected_client':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelado por el solicitante</span>;  
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Desconocido</span>;
    }
  };

  const handleRequestServiceShowMore = (id) => {
    console.log('Service Request ID:', id);
    OfferDetailModal({
      title: 'Solicitud de Servicio',
      html: `
        <div class="flex flex-col gap-2 text-justify mb-2">
          <h4 class="text-lg font-bold text-center">Servicio Solicitado</h4>
          ${itemModal('Servicio', 'Movistar Multioperador Básico')}
          ${itemModal('Tipo', 'Internet móvil')}
          ${itemModal('Operador', 'Movistar')}
          ${itemModal('Estado', 'Pendiente')}
          ${itemModal('Fecha de solicitud', '2025-11-26')}
          ${itemModal('Asesorado por', 'John Doe')}
          ${itemModal('Orden No.', '123456')}
        </div>
        <div class="h-1 w-full bg-gray-100"></div>
        <div class="flex flex-col gap-2 text-justify mb-2">
          <h4 class="text-lg font-bold text-center mt-4">Datos del solicitante</h4>
          ${itemModal('Nombre', 'John Doe')}
          ${itemModal('Correo', 'john.doe@example.com')}
          ${itemModal('Telefono', '123456789')}
        </div>
        <div class="h-1 w-full bg-gray-100"></div>
        <div class="flex flex-col gap-2 text-justify mb-4">
          <h4 class="text-lg font-bold text-center mt-4">Datos del asesor</h4>
          ${itemModal('Nombre', 'John Doe')}
          ${itemModal('Correo', 'john.doe@example.com')}
          ${itemModal('Telefono', '123456789')}
        </div>
        <div class="flex flex-col gap-2 text-justify mb-2 bg-gray-100 py-6 px-4 rounded-md">
          <h4 class="text-lg font-bold">Radicado</h4>
          <input type="text" class="w-full border border-gray-300 rounded-md p-2" placeholder="Escribe el radicado" id="radicado">
          <button class="w-full bg-blue-500 text-white p-2 rounded-md mt-2" id="agregarRadicado">Agregar radicado</button>
        </div>

        <div class="flex flex-col gap-2 text-justify mb-2 bg-amber-50 py-6 px-4 rounded-md">
          <h4 class="text-lg font-bold">Comentario</h4>
          <textarea class="w-full border border-gray-300 rounded-md p-2" placeholder="Escribe el comentario" id="comentario"></textarea>
          <button class="w-full bg-amber-500 text-white p-2 rounded-md mt-2" id="agregarComentario">Agregar comentario</button>
        </div>
        
      `,
      confirmText: 'Cerrar',
      isCancelButtonVisible: false,
      footerText: 'Contactar al solicitante a SysAdmin',
      confirmCallback: () => {
        console.log('Usuario aceptó el modal de detalles');
      },
    });
  };

  const getServiceRequests = async () => {
    console.log('Obteniendo solicitudes de servicio para coordinador...');
    try {
      if (!userData || !userData.email) {
        ToastAlert({
          position: 'center',
          timer: 3000,
          icon: 'error',
          title: 'Lo siento, no se encontró información de usuario',
          isColored: false
        });
        setTimeout(() => {
          logout();
          window.location.href = '/';
        }, 3000);
        return;
      }
      const result = await getServiceRequestsByServiceCoordinator(userData.email);
      console.log(result);
      setServiceRequests(result);
      return result;
    } catch (error) {
      console.error('Error fetching service requests:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !userData) {
      return;
    }
    getServiceRequests();
  }, [isAuthenticated, userData]);

  if (loadingServiceRequestsByServiceCoordinator) {
    return <ServiceRequestsTableSkeleton />;
  }

  return (
    <>
      <div className="w-full md:w-3/4 mt-0 md:mt-4 mx-auto p-4 md:p-0">
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Servicio Solicitado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Estado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Fecha de Solicitud</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Asesorado Por</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">Orden No.</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {
              serviceRequests.count === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay solicitudes de servicio disponibles.
                  </td>
                </tr>
              ) : (
                serviceRequests.data?.map(
                  (request) => (
                    <tr key={request.service_request_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-bold">{request.offer_name || 'N/A'}</span>
                          <span className="text-xs text-gray-500 sm:hidden mt-1">
                            <span className="font-semibold">Estado:</span>
                          {tagStatus(request.status)}
                        </span>
                        <span className="text-xs text-gray-500 sm:hidden mt-1">
                          <span className="font-semibold">Fecha:</span>
                          {request.created_at_formmated}
                        </span>
                        <span className="text-xs text-gray-500 sm:hidden mt-1">
                          <span className="font-semibold">Orden:</span>
                          {request.order_number || 'N/A'}
                        </span>
                        
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden sm:table-cell"> {tagStatus( request.status)} </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell"> {request.created_at_formmated} </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell"> {request.assited_by || 'No aplica'} </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell"> {request.order_number || 'N/A'} </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0 justify-center">
                        { buttomDetails(request.service_request_id)}
                        { buttonFillingNumber(request.service_request_id)}
                        { buttonComment(request.service_request_id)}
                      </div>
                    </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
    </div>
    </>
  );
};

export default ServiceRequestsCoordinatorTable;
