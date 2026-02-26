import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TransversalHeader from '../components/header/TransversalHeader';
import { Input } from '../components/ui/input';
import Select from '../components/ui/select';
import { PrimaryButton, SecondaryButton } from '../components/ui/button';
import useOperator from '../hooks/useOperator';
import useOffer from '../hooks/useOffer';
import useRequest from '../hooks/useRequest';
import { useAuth } from '../context/AuthContext';
import ToastAlert from '../components/alerts/ToastAlert';
import ModalAlertConfirm from '../components/alerts/ModalAlertConfirm';

export default function AssociateOfferPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();
  const { operators, loading: loadingOperators, getOperators } = useOperator();
  const { offers, loading: loadingOffers, getOffersByOperator } = useOffer();
  const { addReferralServiceRequest, loadingAddReferralServiceRequest } = useRequest();

  // Get referral data from navigation state
  const referralData = location.state || {};
  const { clientName = '', trackingCode = '', referralId = '' } = referralData;

  // Form states
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedOperatorId, setSelectedOperatorId] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showOffers, setShowOffers] = useState(false);
  const [filingNumber, setFilingNumber] = useState('');

  // Load operators on mount
  useEffect(() => {
    getOperators();
  }, [getOperators]);

  // Redirect back if no referral data
  useEffect(() => {
    if (!trackingCode || !clientName) {
      ToastAlert({
        position: 'center',
        timer: 2000,
        icon: 'error',
        title: 'No se encontró información del referido',
      });
      navigate('/assigned-referrals');
    }
  }, [trackingCode, clientName, navigate]);

  // Handle operator selection
  const handleOperatorChange = (value) => {
    setSelectedOperator(value);
    setShowOffers(false);
    setSelectedOffer(null);
    
    // Find operator ID
    const operator = operators?.find(op => op.name === value);
    if (operator) {
      setSelectedOperatorId(operator.id);
    }
  };

  // Handle fetch offers
  const handleFetchOffers = async () => {
    if (!selectedOperatorId) {
      ToastAlert({
        position: 'center',
        timer: 1800,
        icon: 'warning',
        title: 'Por favor selecciona un operador',
      });
      return;
    }

    await getOffersByOperator(selectedOperatorId);
    console.log('offers', offers);
    setShowOffers(true);
  };

  // Handle offer selection
  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer);
    setFilingNumber(''); // Reset filing number when selecting new offer
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/assigned-referrals');
  };

  // Handle save
  const handleSave = () => {
    if (!selectedOffer) {
      ToastAlert({
        position: 'center',
        timer: 1800,
        icon: 'warning',
        title: 'Por favor selecciona una oferta',
      });
      return;
    }

    ModalAlertConfirm({
      title: '¿Confirmar asociación?',
      text: `¿Estás seguro de asociar la oferta "${selectedOffer.offer_name}" al referido "${clientName}"?`,
      icon: 'question',
      confirmText: 'Sí, asociar',
      cancelText: 'Cancelar',
      isShowCancelButton: true,
      confirmCallback: async () => {
        await handleConfirmSave();
      },
    });
  };

  // Handle confirmed save
  const handleConfirmSave = async () => {
    try {
      const result = await addReferralServiceRequest({
        assigned_referral_code: trackingCode,
        email_service_coordinator: userData.email,
        offer_id: selectedOffer.offer_id,
        filing_number: filingNumber.trim() || undefined, // Send undefined if empty, backend will set 'Pendiente'
      });

      if (result.process === 'success') {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'success',
          title: 'Oferta asociada correctamente',
        });
        navigate('/assigned-referrals');
      } else {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'error',
          title: result.message || 'Error al asociar la oferta',
        });
      }
    } catch (error) {
      console.error('Error associating offer:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TransversalHeader
        title="Asociar Oferta a Referido"
        description="Selecciona un operador y una oferta para asociar al referido asignado."
      />

      <div className="w-full md:w-3/4 lg:w-2/3 mx-auto p-4 md:p-6">
        <div className="bg-white shadow-lg rounded-xl p-6">
          {/* Read-only referral information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Referido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del cliente
                </label>
                <Input 
                  type="text" 
                  value={clientName} 
                  disabled 
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código de referencia
                </label>
                <Input 
                  type="text" 
                  value={trackingCode} 
                  disabled 
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200 my-6"></div>

          {/* Operator selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Selección de Operador y Oferta</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <Select
                  options={operators?.map(op => op.name) || []}
                  label="Operador"
                  value={selectedOperator}
                  onChange={(e) => handleOperatorChange(e.target.value)}
                  disabled={loadingOperators}
                />
              </div>
              <div>
                <PrimaryButton
                  type="button"
                  onClick={handleFetchOffers}
                  disabled={!selectedOperatorId || loadingOffers}
                  className="w-full h-14"
                >
                  {loadingOffers ? 'Cargando...' : 'Buscar Ofertas'}
                </PrimaryButton>
              </div>
            </div>
          </div>

          {/* Offers list */}
          {showOffers && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-3">Ofertas Disponibles</h4>
              {loadingOffers ? (
                <div className="text-center py-4 text-gray-500">Cargando ofertas...</div>
              ) : offers && offers.length > 0 ? (
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden md:table-cell">Descripción</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {offers.map((offer) => (
                        <tr 
                          key={offer.offer_id}
                          className={`hover:bg-gray-50 transition ${selectedOffer?.offer_id === offer.offer_id ? 'bg-blue-50' : ''}`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">{offer.offer_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                            {offer.offer_description || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleSelectOffer(offer)}
                              className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                                selectedOffer?.offer_id === offer.offer_id
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white'
                              }`}
                            >
                              {selectedOffer?.offer_id === offer.offer_id ? 'Seleccionada' : 'Seleccionar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 border border-gray-200 rounded-lg">
                  No hay ofertas disponibles para este operador
                </div>
              )}
            </div>
          )}

          {/* Selected offer details */}
          {selectedOffer && (
            <>
              <div className="h-px bg-gray-200 my-6"></div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Oferta Seleccionada</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la Oferta
                    </label>
                    <Input 
                      type="text" 
                      value={selectedOffer.offer_name} 
                      disabled 
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={selectedOffer.offer_description || 'Sin descripción'}
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Radicado
                    </label>
                    <Input 
                      type="text" 
                      value={filingNumber} 
                      onChange={(e) => setFilingNumber(e.target.value)}
                      placeholder="Ingrese el número de radicado (opcional)"
                      className=""
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Si se deja vacío, se asignará "Pendiente" por defecto
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <PrimaryButton
              type="button"
              onClick={handleSave}
              disabled={!selectedOffer || loadingAddReferralServiceRequest}
              className="flex-1"
            >
              {loadingAddReferralServiceRequest ? 'Guardando...' : 'Guardar'}
            </PrimaryButton>
            <SecondaryButton
              type="button"
              onClick={handleCancel}
              className="flex-1 cursor-pointer btn-cancel shadow-none"
            >
              Cancelar
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
