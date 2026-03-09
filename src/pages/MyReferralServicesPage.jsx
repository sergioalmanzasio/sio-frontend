import { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import Navbar from '../components/Navbar';
import { MessageSquareText, PenLine, WholeWord, ChevronLeft, ChevronRight } from 'lucide-react';
import TransversalHeader from '../components/header/TransversalHeader';
import ServiceRequestsTableSkeleton from '../sections/service-requests-tables/service-requests-table-skeleton';
import useRequest from '../hooks/useRequest';
import useReferral from '../hooks/useReferral';
import { useAuth } from '../context/AuthContext';
import ToastAlert from '../components/alerts/ToastAlert';
import ModalAlertConfirm from '../components/alerts/ModalAlertConfirm';


export default function MyReferralServicesPage() {
  const { userData, isAuthenticated, logout } = useAuth();
  const { 
    getReferralServiceRequests, 
    loadingReferralServiceRequests, 
    addCommentToServiceRequest, 
    loadingAddComment, 
    updateServiceRequestState, 
    loadingUpdateServiceRequestState,
    getServiceRequestComments,
    loadingGetComments,
    updateServiceRequestFilingNumber,
  } = useRequest();
  const { calculateCommission } = useReferral();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const ITEMS_PER_PAGE = 10;
  const [showEditModal, setShowEditModal] = useState(false);

  // Service request states
  // En proceso, suspendida, aprobada, no aprobada y terminada
  const SERVICE_STATES = [
    'En proceso',
    'Suspendida',
    'Aprobada',
    'No aprobada',
    'Terminada',
  ];

  // Fetch service requests
  const fetchServiceRequests = async () => {
    try {
      if (!userData || !userData.email) {
        ToastAlert({
          position: 'center',
          timer: 3000,
          icon: 'error',
          title: 'No se encontró información de usuario',
        });
        setTimeout(() => {
          logout();
          window.location.href = '/';
        }, 3000);
        return;
      }

      const result = await getReferralServiceRequests();
      if (result.data) {
        setServiceRequests(result.data);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !userData) {
      return;
    }
    fetchServiceRequests();
  }, [isAuthenticated, userData]);

  // Handle add comment
  const handleAddComment = async () => {
    const comment = document.getElementById('comment')?.value;
    
    if (!comment || comment.trim() === '') {
      ToastAlert({
        position: 'center',
        timer: 1800,
        icon: 'warning',
        title: 'Por favor escribe un comentario',
      });
      return;
    }

    if (!selectedRequest || !selectedRequest.service_request || !selectedRequest.service_request.id) {
      ToastAlert({
        position: 'center',
        timer: 1800,
        icon: 'error',
        title: 'Error: No se encontró la solicitud',
      });
      return;
    }

    try {
      const result = await addCommentToServiceRequest(
        selectedRequest.service_request.id,
        {
          comment: comment.trim(),
          email: userData.email
        }
      );

      if (result.process === 'success') {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'success',
          title: 'Comentario agregado exitosamente',
        });
        // Clear comment field
        document.getElementById('comment').value = '';
        // Update character counter
        const counter = document.getElementById('char-count');
        if (counter) {
          counter.textContent = '0 / 200 caracteres';
          counter.classList.add('text-gray-500');
          counter.classList.remove('text-amber-500', 'text-red-500', 'font-semibold');
        }
      } else {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'error',
          title: result.message || 'Error al agregar el comentario',
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Expose handleAddComment to window for modal button access
  useEffect(() => {
    window.handleAddCommentClick = handleAddComment;
    return () => {
      delete window.handleAddCommentClick;
    };
  }, [selectedRequest, userData]);

  // Handle show comments history
  const handleShowComments = async (request) => {
    let comments = [];
    try {
      const response = await getServiceRequestComments(request.service_request.id);
      // Determine if response is the array or if it's wrapped in data property
      if (Array.isArray(response)) {
        comments = response;
      } else if (response.data && Array.isArray(response.data)) {
        comments = response.data;
      } else if (response.comments && Array.isArray(response.comments)) {
        comments = response.comments;
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      ToastAlert({
        position: 'center',
        timer: 1800,
        icon: 'error',
        title: 'Error al cargar los comentarios',
      });
      return;
    }


    const commentsHtml = `
      <div class="text-left space-y-4">
        <div class="mt-4">
          <h4 class="font-semibold text-gray-800 mb-2">Información de la solicitud</h4>
          <p class="text-sm text-gray-700"><strong>Cliente:</strong> ${request.client.name}</p>
          <p class="text-sm text-gray-700"><strong>Código de seguimiento:</strong> ${request.client.tracking_code}</p>
          <p class="text-sm text-gray-700"><strong>Estado:</strong> ${request.service_request.state}</p>
        </div>
        <div class="bg-gray-50 p-4 pt-0 rounded-lg max-h-60 overflow-y-auto">
          <h4 class="font-semibold text-gray-800 mb-2 sticky top-0 bg-gray-50 pt-2 pb-2 border-b ">Historial de Comentarios</h4>
          <div class="space-y-3">
            ${comments.length > 0 ? comments.map(comment => `
              <div class="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                <p class="text-xs text-gray-500 flex justify-between">
                  <span>${comment.created_at_formatted || comment.date}</span>
                  <span class="font-medium">${comment.registered_by || comment.author}</span>
                </p>
                <p class="text-sm text-gray-700 mt-1">${comment.comment || comment.text}</p>
              </div>
            `).join('') : '<p class="text-sm text-gray-500 text-center py-4">No tiene comentarios</p>'}
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Nuevo comentario</label>
          <textarea 
            id="new-comment" 
            rows="3"
            style="font-size: 14px;"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Escribe un comentario..."
          ></textarea>
        </div>

        
      </div>
    `;

    ModalAlertConfirm({
      title: 'Comentarios de la solicitud',
      text: commentsHtml,
      isText: false,
      icon: '',
      confirmText: 'Agregar Comentario',
      cancelText: 'Cerrar',
      isShowCancelButton: true,
      confirmCallback: async () => {
        const comment = document.getElementById('new-comment')?.value;
        if (!comment || comment.trim() === '') {
          ToastAlert({
            position: 'center',
            timer: 1800,
            icon: 'warning',
            title: 'El comentario no puede estar vacío',
          });
          return;
        }

        try {
          const result = await addCommentToServiceRequest(
            request.service_request.id,
            {
              comment: comment.trim(),
              email: userData.email
            }
          );

          if (result.process === 'success') {
            ToastAlert({
              position: 'center',
              timer: 2000,
              icon: 'success',
              title: 'Comentario agregado exitosamente',
            });
          } else {
            ToastAlert({
              position: 'center',
              timer: 2000,
              icon: 'error',
              title: result.message || 'Error al agregar el comentario',
            });
          }
        } catch (error) {
          console.error('Error adding comment:', error);
          ToastAlert({
            position: 'center',
            timer: 2000,
            icon: 'error',
            title: 'Error al procesar la solicitud',
          });
        }
      }
    });
  };

  // Handle edit button click
  const handleEdit = (request) => {
    setSelectedRequest({
      ...request,
      selectedState: request.service_request.state
    });
    console.log(request);
    ModalAlertConfirm({
      title: 'Editar estado de solicitud',
      text: buildEditModalContent(request),
      isText: false,
      icon: '',
      confirmText: 'Continuar',
      cancelText: 'Cancelar',
      isShowCancelButton: true,
      confirmCallback: async () => {
        // await handleSaveState(request); // Pass request directly
        confirmChangeState(request);
      },
      cancelCallback: () => {
        setSelectedRequest(null);
      }
    });
  };

  const confirmChangeState = (request) => {
    let newState = document.getElementById('state-selector')?.value;
    let actualState = request.service_request.state;
    const comment = document.getElementById('comment')?.value;
    if (newState === actualState) {
      ToastAlert({
        position: 'center',
        timer: 1800,
        icon: 'info',
        title: 'Usted no seleccionó un nuevo estado para la orden.',
      });
      setTimeout(() => {
        handleEdit(request);
      }, 1800);  
      return;
    }

    if (!comment || comment.trim() === '') {
      ToastAlert({
        position: 'center',
        timer: 1500,
        icon: 'warning',
        title: 'El comentario no puede estar vacío',
      });
      setTimeout(() => {
        handleEdit(request);
      }, 1500);  
      return;
    }

    return Swal.fire({
      title: '¿Cambiar estado de la solicitud',
      html: `
        <div class="text-left space-y-2">
          <p class="text-gray-600 mb-2 text-md mb-4">El estado de la solicitud será actualizado y esta acción no podrá deshacerse.</p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">Información de la solicitud</h4>
            <p class="text-sm"><span class="font-medium">Nombre:</span> ${request.client.name}</p>
            <p class="text-sm"><span class="font-medium">Orden de seguimiento:</span> ${request.client.tracking_code}</p>
          </div>
          
          <div class="bg-orange-50 p-4 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">Detalle del cambio de estado</h4>
            <p class="text-sm"><span class="font-medium">Estado actual:</span> ${actualState}</p>
            <p class="text-sm"><span class="font-medium text-orange-600">Nuevo estado:</span> ${newState}</p>
          </div>
        </div>
      `,
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: "btn-gradient",
        cancelButton: "btn-cancel",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handleSaveState(request, newState, comment);
      }
    });
  }

  // Build modal content
  const buildEditModalContent = (request) => {
    return `
      <div class="text-left space-y-2">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-800 mb-2">Información del cliente</h4>
          <p class="text-sm"><span class="font-medium">Nombre:</span> ${request.client.name}</p>
          <p class="text-sm"><span class="font-medium">Código:</span> ${request.client.tracking_code}</p>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-800 mb-2">Información de la oferta</h4>
          <p class="text-sm"><span class="font-medium">Nombre:</span> ${request.offer.name}</p>
          <p class="text-sm"><span class="font-medium">Descripción:</span> ${request.offer.description}</p>
          <p class="text-sm"><span class="font-medium">Precio:</span> $${Number(request.offer.price).toLocaleString('es-CO')}</p>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-800 mb-2">Información de la solicitud</h4>
          <p class="text-sm"><span class="font-medium">Radicado:</span> ${request.service_request.filing_number}</p>
          <p class="text-sm"><span class="font-medium">Estado Actual:</span> ${request.service_request.state}</p>
        </div>
        
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Cambiar Estado</label>
          <select 
            id="state-selector" 
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-normal text-sm"
            onchange="
              switch(this.value){
                case 'En proceso':
                  document.getElementById('comment').value = 'Solicitud en proceso debido a que ';
                  break;
                case 'No aprobada':
                  document.getElementById('comment').value = 'Solicitud no aprobada debido a que ';
                  break;
                case 'Aprobada':
                  document.getElementById('comment').value = 'Solicitud aprobada debido a que ';
                  break;
                case 'Terminada':
                  document.getElementById('comment').value = 'Solicitud terminada debido a que ';
                  break;
                case 'Suspendida':
                  document.getElementById('comment').value = 'Solicitud suspendida debido a que ';
                  break;  
              }
              document.getElementById('comment').focus()
            "
          >
            ${getAvailableStates(request.service_request.state).map(state => 
              `<option value="${state}" ${state === request.service_request.state ? 'selected' : ''}>${state}</option>`
            ).join('')}
          </select>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Comentario</label>
          <textarea 
            id="comment" 
            maxlength="200"
            rows="3"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-normal text-sm"
            placeholder="Escribe un comentario..."
            oninput="
              const count = this.value.length;
              const maxCount = 200;
              const counter = document.getElementById('char-count');
              counter.textContent = count + ' / ' + maxCount + ' caracteres';
              if (count >= maxCount * 0.9) {
                counter.classList.add('text-amber-500');
                counter.classList.remove('text-gray-500');
              } else {
                counter.classList.add('text-gray-500');
                counter.classList.remove('text-amber-500');
              }
              if (count >= maxCount) {
                counter.classList.add('text-red-500', 'font-semibold');
                counter.classList.remove('text-amber-500', 'text-gray-500');
              }else{
                counter.classList.add('text-gray-500');
                counter.classList.remove('text-red-500', 'font-semibold');
              }
            "
          ></textarea>
          <p id="char-count" class="text-sm text-gray-500 mt-1">0 / 200 caracteres</p>
        </div>
      </div>
    `;
  };

  // Handle save state
  const handleSaveState = async (request, newState, comment) => {
    
    if (!newState) {
      ToastAlert({
        position: 'center',
        timer: 1800,
        icon: 'error',
        title: 'Por favor selecciona un estado',
      });
      return;
    }

    if (!comment || comment.trim() === '') {
      ToastAlert({
        position: 'center',
        timer: 1800,
        icon: 'warning',
        title: 'Por favor escribe un comentario',
      });
      return;
    }

    if (!request || !request.service_request || !request.service_request.id) {
      ToastAlert({
        position: 'center',
        timer: 1800,
        icon: 'error',
        title: 'Error: No se encontró la solicitud',
      });
      return;
    }

    try {
      const result = await updateServiceRequestState({
        service_request_id: request.service_request.id,
        state: newState,
        comment: comment.trim(),
        email: userData.email
      });

      if (result.process === 'success') {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'success',
          title: 'Estado actualizado exitosamente',
        });

        // Calculate commission when state changes to 'Terminada'
        if (newState === 'Terminada') {
          try {
            await calculateCommission(request.client.referral_code);
          } catch (err) {
            console.error('Error calculating commission:', err);
          }
        }

        // Refresh the list
        await fetchServiceRequests();
        setSelectedRequest(null);
      } else {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'error',
          title: result.message || 'Error al actualizar el estado',
        });
      }
    } catch (error) {
      console.error('Error updating state:', error);
    }
  };

  const handleAddFilingNumber = async (request) => {
    Swal.fire({
      title: request.service_request.filing_number == null || request.service_request.filing_number.toLowerCase() == "pendiente" 
       ? "Agregar número de radicado"
       : "Editar número de radicado",
      html: `
        <div class="text-left">
          <p class="text-sm text-gray-700">Orden de seguimiento: <span class="font-semibold">${request.client.tracking_code}</span></p>
        </div>
      `,
      input: "text",
      inputValue: request.service_request.filing_number == null || request.service_request.filing_number.toLowerCase() == "pendiente"
        ? "" 
        : request.service_request.filing_number,
      inputAttributes: {
        autocapitalize: "off",
        autocomplete: "off",
        autocorrect: "off",
        spellcheck: "false",
        maxlength: "200",
        rows: "3",
        placeholder: "Escribe el número de radicado...",
      },
      customClass: {
        confirmButton: "btn-gradient",
        cancelButton: "btn-cancel",
      },
      showCancelButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: async (filingNumber) => {
        if (!filingNumber || filingNumber.trim() === '') {
          return Swal.showValidationMessage('Por favor ingresa un número de radicado');
        }
        if (!request || !request.service_request || !request.service_request.id) {
          return Swal.showValidationMessage('Por favor selecciona una solicitud');
        }
        try {
          const result = await updateServiceRequestFilingNumber({
            tracking_code: request.client.tracking_code,
            filling_number: filingNumber.trim(),
          });
          if (result.process === 'error' || result.process === 'session-expired') {
            return Swal.showValidationMessage(result.message || 'Error al actualizar el radicado');
          }
          return result;
        } catch (error) {
          Swal.showValidationMessage(`Error: ${error.message || error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(async (result) => {
      if (result.isConfirmed) {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'success',
          title: 'Número de radicado agregado exitosamente',
        });
        await fetchServiceRequests();
        setSelectedRequest(null);
      }
    });
  };

  // Returns the available states based on the current state
  const getAvailableStates = (currentState) => {
    const stateTransitions = {
      'En proceso': ['En proceso', 'Suspendida', 'Aprobada', 'No aprobada'],
      'Suspendida': ['Suspendida', 'Aprobada', 'No aprobada'],
      'Aprobada': ['Aprobada', 'Suspendida', 'No aprobada', 'Terminada'],
    };
    return stateTransitions[currentState] || [currentState];
  };

  // Format price
  const formatPrice = (price) => {
    return `$${Number(price).toLocaleString('es-CO')}`;
  };

  if (loadingReferralServiceRequests) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <TransversalHeader
          title="Solicitudes de servicios generadas"
          description="Gestiona las solicitudes de servicios generadas para los clientes referidos."
        />
        <ServiceRequestsTableSkeleton />
      </div>
    );
  }

  const customButtonTable = (toolTipText, handleAction, icon, bgButton) => {
    return <div className="relative group">
                          <button
                            onClick={() => handleAction()}
                            className={`text-${bgButton}-600 hover:text-white bg-${bgButton}-100 hover:bg-${bgButton}-600 px-3 py-1 rounded-md text-xs font-semibold transition duration-150 cursor-pointer`}
                          >
                            <span className="absolute 
                                -top-8 
                                right-0 
                                opacity-0 group-hover:opacity-100
                                bg-gray-900 text-white text-xs px-2 py-1 rounded
                                transition duration-200
                                whitespace-nowrap
                                z-50">
                              {toolTipText}
                            </span>
                            {
                              custonIconButtonTable(icon)
                            }
                          </button>
                        </div>
  }

  const custonIconButtonTable = (name) => {
    switch(name) {
      case "comment":
        return <MessageSquareText className="w-4 h-4" />;
      case "edit":
        return <PenLine className="w-4 h-4" />;
      case "filing":
        return <WholeWord className="w-4 h-4" />;  
      default:
        return <WholeWord className="w-4 h-4" />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Solicitudes de servicios generadas"
        description="Gestiona las solicitudes de servicios generadas para los clientes referidos."
      />

      <div className="w-full md:w-3/4 mt-0 md:mt-4 mx-auto p-4 md:p-0">
        {/* Search Filter */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Buscar por nombre de cliente, orden de seguimiento o radicado..."
            className="w-full md:w-2/4 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                  Orden de seguimiento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">
                  Oferta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden xl:table-cell">
                  Precio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider sm:table-cell">
                  Radicado
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {(() => {
                const filteredRequests = (serviceRequests || []).filter((request) => {
                  if (!searchTerm.trim()) return true;
                  const term = searchTerm.toLowerCase();
                  const clientName = (request.client.name || "").toLowerCase();
                  const trackingCode = (request.client.tracking_code || "").toLowerCase();
                  const filingNumber = (request.service_request.filing_number || "").toLowerCase();
                  return clientName.includes(term) || trackingCode.includes(term) || filingNumber.includes(term);
                });
                const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
                const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                const paginatedRequests = filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
                
                // Store for pagination UI
                window.__paginationMeta = { filteredRequests, totalPages, startIndex };
                
                return paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No hay solicitudes de servicios disponibles.
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map((request, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span className="font-bold">{request.client.name}</span>
                        <span className="text-xs text-gray-500 md:hidden mt-1">
                          <span className="font-semibold">Código:</span> {request.client.tracking_code}
                        </span>
                        <span className="text-xs text-gray-500 lg:hidden mt-1">
                          <span className="font-semibold">Oferta:</span> {request.offer.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                      {request.client.tracking_code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 hidden lg:table-cell">
                      <div className="flex flex-col">
                        <span className="font-semibold">{request.offer.name}</span>
                        <span className="text-xs text-gray-500">{request.offer.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden xl:table-cell">
                      {formatPrice(request.offer.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        request.service_request.state === 'Terminada' ? 'bg-green-100 text-green-800' :
                        request.service_request.state === 'Aprobada' ? 'bg-cyan-100 text-cyan-800' :
                        request.service_request.state === 'En proceso' ? 'bg-pink-100 text-pink-800' :
                        request.service_request.state === 'No aprobada' ? 'bg-red-100 text-red-800' :
                        request.service_request.state === 'Suspendida' ? 'bg-violet-100 text-violet-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.service_request.state}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 sm:table-cell">
                      <div className="flex flex-col">
                        {request.service_request.filing_number}
                        {request.service_request.filing_number === 'Pendiente' && (
                          <span className="text-xs text-pink-600 italic">Cambio de estado no disponible</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex gap-2 justify-center items-center h-full">
                        {/* Icon button for add comment */}
                        {customButtonTable("Agregar comentario", () => handleShowComments(request), "comment", "purple")}
                        {/* <div className="relative group">
                          <button
                            title="Agregar comentario"
                            onClick={() => handleShowComments(request)}
                            className="text-purple-600 hover:text-white bg-purple-100 hover:bg-purple-600 px-3 py-1 rounded-md text-xs font-semibold transition duration-150 cursor-pointer"
                          >
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs px-2 py-1 rounded transition duration-200 whitespace-nowrap">
                              Ver comentarios
                            </span>
                            <MessageSquareText className="w-4 h-4" />
                          </button>
                        </div> */}
                        {request.service_request.state !== 'Terminada' && request.service_request.state !== 'No aprobada' && request.service_request.filing_number !== 'Pendiente' && (
                          customButtonTable("Editar", () => handleEdit(request), "edit", "blue")
                          // <button
                          //   onClick={() => handleEdit(request)}
                          //   className="text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600 px-3 py-1 rounded-md text-xs font-semibold transition duration-150 cursor-pointer"
                          // >
                          //   <PenLine className="w-4 h-4" />
                          // </button>
                        )}
                        {customButtonTable("Número de radicado", () => handleAddFilingNumber(request), "filing", "pink")}
                        {/* <button
                          onClick={() => handleAddFilingNumber(request)}
                          className="text-pink-600 hover:text-white bg-pink-100 hover:bg-pink-600 px-3 py-1 rounded-md text-xs font-semibold transition duration-150 cursor-pointer"
                        >
                          <WholeWord className="w-4 h-4" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                  ))
                );
              })()}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(() => {
          const meta = window.__paginationMeta;
          if (!meta || meta.filteredRequests.length === 0) return null;
          const { filteredRequests, totalPages, startIndex } = meta;
          const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredRequests.length);
          return (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-md">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{startIndex + 1}</span> a <span className="font-medium">{endIndex}</span> de <span className="font-medium">{filteredRequests.length}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                        currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                        currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
