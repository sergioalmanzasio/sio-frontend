import { useState, useEffect } from "react";
import ServiceRequestsTableSkeleton from "./service-requests-table-skeleton";
import useRequest from "../../hooks/useRequest";
import { useAuth } from "../../context/AuthContext";
import ModalAlertConfirm from "../../components/alerts/ModalAlertConfirm";
import ToastAlert from "../../components/alerts/ToastAlert";
import OfferDetailModal from "../../components/alerts/OfferDetailModal";
import { OPERATORS_LOGOS, chipServiceRequestStatus } from "../../shared/utils";
import FullScrreenLoader from "../../components/loader/FullScreenLoader"; 

const ServiceRequestsClientTable = () => {

  const { loadingServiceRequestClient, getServiceRequestByClient, loadingServiceRequestDetail, getServiceRequestDetailByID, loadingCancelServiceRequestClient, cancelServiceRequestByClient } = useRequest();
  const { isAuthenticated, userData, logout } = useAuth();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  const buttomDetails = (id) => (
    <button 
      className="text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600 px-3 py-1 rounded-md text-xs font-semibold transition duration-150 cursor-pointer" 
      onClick={() => handleRequestServiceShowMore(id)}
    >
      Ver más
    </button>
  );

  const buttomCancel = (id) => (
    <button 
      className="text-red-600 hover:text-white bg-red-100 hover:bg-red-600 px-3 py-1 rounded-md text-xs font-semibold transition duration-150 cursor-pointer"
      onClick={() => handleCancelServiceRequest(id)}
    >
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

  const buttomLoading = () => (
    <button
      className="text-gray-400 bg-white px-3 py-1 rounded-md text-xs font-semibold cursor-not-allowed border border-gray-200"
      disabled
    >
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400 mr-1"></div>
        Cargando...
      </div>
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

  const handleCancelServiceRequest = async (id) => {
    ModalAlertConfirm({
      title: 'Confirmar cancelación',
      text: '¿Estás seguro(a) de que quieres cancelar esta solicitud de servicio? Esta acción no se puede deshacer.',
      icon: 'warning',
      confirmText: 'Sí, cancelar',
      cancelText: 'No',
      confirmCallback: async () => {
        let cancelServiceRequestByClientResponse = await cancelServiceRequestByClient(id, userData.email);
        if( cancelServiceRequestByClientResponse ) {
          setRefreshCounter(prev => prev + 1);
          ToastAlert({
            position: "center",
            timer: 1800,
            icon: "success",
            title: "Solicitud cancelada exitosamente",
          });
        }
      }
    });
  };

  const timeLine = () => {
    return `
      <div>
        <h5 class="text-lg font-semibold mb-4 text-justify">Historial</h5>
        <ol class="relative border-s border-default">                  
          <li class="mb-5 ms-4 text-justify">
              <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-buffer"></div>
              <time class="text-sm font-normal leading-none text-body">Febrero 2022</time>
              <h5 class="text-sm font-semibold text-heading my-1">Solicitud creada</h5>
          </li>
          <li class="mb-5 ms-4 text-justify">
              <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-buffer"></div>
              <time class="text-sm font-normal leading-none text-body">Marzo 2022</time>
              <h5 class="text-sm font-semibold text-heading my-1">Solicitud aprobada</h5>
          </li>
          <li class="ms-4 text-justify">
              <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-buffer"></div>
              <time class="mb-1 text-sm font-normal leading-none text-body">Abril 2022</time>
              <h5 class="text-sm font-semibold text-heading my-1">En progreso</h5>
          </li>
        </ol>
      </div>
    `;
  };

  const handleRequestServiceShowMore = async (id) => {
    const serviceRequestDetail = await getServiceRequestDetailByID(id);
    if (!serviceRequestDetail) {
      console.error('No se encontró la información detallada de la solicitud');
      return;
    }
    
    const serviceRequestData = serviceRequestDetail.data;
    OfferDetailModal({
      title: 'Solicitud de servicio',
      html: `
        <div class="w-full flex flex-col align-left md:flex-row justify-left items-center gap-4  h-auto">
          <div class="w-1/3">
            <img src="${OPERATORS_LOGOS[serviceRequestData[0]?.operator_name?.toUpperCase()] ?? OPERATORS_LOGOS.CLARO}" alt="${serviceRequestData[0]?.operator_name || 'Operador'}" class="w-48 h-14 object-contain">
          </div>
          <div class="w-2/3 flex flex-col items-start">
            <h2 class="text-2xl font-semibold">${serviceRequestData[0]?.offer_name || 'Título de la solicitud'}</h2>
            <h3 class="text-xl">${serviceRequestData[0]?.offer_description || 'Descripción de la solicitud'}</h3>
            <p class="text-2xl bg-linear-to-r from-red-500 via-green-500 to-purple-500 text-transparent bg-clip-text
              font-semibold text-left">$ ${serviceRequestData[0]?.offer_price || '0.000'}<span class="text-gray-600 text-sm font-normal"> /mes</span>
            </p>
          </div>
        </div>

        <div class="border-t border-gray-200 my-4"></div>
        
        <div class="mt-4 text-sm text-gray-600 text-justify bg-gray-100 p-4 rounded">
          <p><strong>Fecha de solicitud:</strong> ${serviceRequestData[0]?.created_at || 'No fecha'}</p>
          <p><strong>Estado:</strong> ${chipServiceRequestStatus(serviceRequestData[0]?.status) || 'Desconocido'}</p>
          <p><strong>Asesorado(a) por:</strong> ${serviceRequestData[0]?.assited_by || 'Sin asesoramiento'}</p>
          <p><strong>Orden No.:</strong> ${serviceRequestData[0]?.order_number || 'No encontrado'}</p>
        </div>

        <div class="border-t border-gray-200 my-4"></div>
        ${timeLine()}
      `,
      footerText: 'Requiere atención inmediata - Contacta a mercadeo al 3123456789 para más información.',
      confirmText: 'Entendido',
      cancelText: 'Cerrar',
      isCancelButtonVisible: false,
      confirmCallback: () => {
      },
      cancelCallback: () => {
      }
    });
  };

  const getServiceRequests = async () => {
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
      const result = await getServiceRequestByClient(userData.email);
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
  }, [isAuthenticated, userData, refreshCounter]);

  useEffect(() => {
  }, [loadingServiceRequestDetail]);

  useEffect(() => {
  }, [loadingCancelServiceRequestClient]);

  if (loadingServiceRequestClient) {
    return <ServiceRequestsTableSkeleton />;
  }

  return (
    <>
      <FullScrreenLoader isLoading={loadingCancelServiceRequestClient} message="Cancelando solicitud de servicio..." />
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
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
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
                        { loadingServiceRequestDetail ? buttomLoading() : buttomDetails(request.service_request_id)}
                        { request.status.toLowerCase() === 'completed' || request.status.toLowerCase() === 'rejected_client' ? buttomDisabled() : buttomCancel(request.service_request_id)}
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

export default ServiceRequestsClientTable;