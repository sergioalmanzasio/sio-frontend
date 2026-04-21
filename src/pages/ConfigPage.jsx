import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, IdCard, Edit2, Save, X, Building, ShieldUser, CreditCard, IdCardLanyard, Landmark, MapPinHouse, Building2, Pencil, UserPen, BanknoteArrowUp, MapPinPen } from 'lucide-react';
import Navbar from '../components/Navbar';
import TransversalHeader from '../components/header/TransversalHeader';
import { Button, PrimaryButton, SecondaryButton } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Select from '../components/ui/select';
import ToastAlert from '../components/alerts/ToastAlert';
import FullScreenLoader from '../components/loader/FullScreenLoader';
import { getDocumentTypes, getDepartments, getCitiesByDepartmentId, getBanks } from '../shared/utils';
import usePerson from '../hooks/usePerson';
import { getUserData } from '../shared/auth';
import SkeletonCard from '../components/card/SkeletonCard';

const DOCUMENT_TYPES = getDocumentTypes();
const HOUSING_TYPES = ["Casa", "Apartamento", "Edificio", "Oficina"];
const BANKS = getBanks();

export default function ConfigPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [departmentCodeSelected, setDepartmentCodeSelected] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName1, setLastName1] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [housingType, setHousingType] = useState("");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [role, setRole] = useState("");
  const [roleColor, setRoleColor] = useState("");

  const [backupData, setBackupData] = useState({});
  const { getPersonInfo, updatePersonInfo, loadingUpdatePersonInfo, updateBankInfo, loadingUpdateBankInfo, updateLocationInfo, loadingUpdateLocationInfo } = usePerson();

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);

      try {
        const userDataSession = getUserData();
        if (!userDataSession?.email) {
          setLoading(false);
          return;
        }

        const response = await getPersonInfo(userDataSession.email);

        if (response.process === "success") {
          const { person_info, data_location, data_bank } = response.data;

          const docType = DOCUMENT_TYPES.find(dt => dt.label === person_info.document_type_name);
          setDocumentType(docType ? docType.acronym : "");

          setDocumentNumber(person_info.document_number);
          setFirstName(person_info.first_name);
          setSecondName(person_info.middle_name);
          setLastName1(person_info.last_name_1);
          setLastName2(person_info.last_name_2);
          setEmail(person_info.email);
          setPhone(person_info.phone);
          setRole(person_info.role_name);

          if (data_location.is_data_location === false) {
          } else {
            setDepartment(data_location.department == 'Pendiente' ? "" : data_location.department);
            setCity(data_location.city == 'Pendiente' ? "" : data_location.city);
            setNeighborhood(data_location.neighborhood);
            setAddress(data_location.address);
            setHousingType(data_location.type_of_housing);
          }

          if (data_bank.is_data_bank === false) {
          } else {
            setBank(data_bank.name);
            setAccountNumber(data_bank.account_number);
          }

        } else {
          ToastAlert({
            position: 'center',
            timer: 2000,
            icon: 'error',
            title: response.message || 'Error al cargar información.'
          });
        }

      } catch (error) {
        console.error("Error loading user info", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [getPersonInfo]);

  useEffect(() => {
    if (department && departments.length > 0 && !departmentCodeSelected) {
      const dept = departments.find(d => d.name === department);
      if (dept) {
        setDepartmentCodeSelected(dept.id);
      }
    }
  }, [department, departments, departmentCodeSelected]);

  useEffect(() => {
    const loadDepartments = async () => {
      const depts = await getDepartments();
      setDepartments(depts);
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    if (!departmentCodeSelected || departmentCodeSelected === '') return;
    const loadCities = async () => {
      setCities([]);
      const citiesList = await getCitiesByDepartmentId(departmentCodeSelected);
      setCities(citiesList);
    };
    loadCities();
  }, [departmentCodeSelected]);

  const handleEditToggle = () => {
    if (!isEditMode) {
      setBackupData({
        documentType,
        documentNumber,
        firstName,
        secondName,
        lastName1,
        lastName2,
        email,
        phone,
        department,
        city,
        neighborhood,
        address,
        housingType,
        bank,
        accountNumber
      });
    }
    setIsEditMode(!isEditMode);
  };

  const handleCancel = () => {
    setDocumentType(backupData.documentType);
    setDocumentNumber(backupData.documentNumber);
    setFirstName(backupData.firstName);
    setSecondName(backupData.secondName);
    setLastName1(backupData.lastName1);
    setLastName2(backupData.lastName2);
    setEmail(backupData.email);
    setPhone(backupData.phone);
    setDepartment(backupData.department);
    setCity(backupData.city);
    setNeighborhood(backupData.neighborhood);
    setAddress(backupData.address);
    setHousingType(backupData.housingType);
    setBank(backupData.bank);
    setAccountNumber(backupData.accountNumber);

    setIsEditMode(false);
  };

  const handleSave = () => {
    if (!firstName || !lastName1 || !email || !phone) {
      ToastAlert({
        position: 'center',
        timer: 2000,
        icon: 'error',
        title: 'Por favor completa todos los campos obligatorios.'
      });
      return;
    }

    ToastAlert({
      position: 'center',
      timer: 2000,
      icon: 'success',
      title: 'Información actualizada correctamente.'
    });

    setIsEditMode(false);
  };

  const handleUpdatePersonalInfo = async () => {
    if (!firstName || !lastName1 || !email || !phone || !documentType || !documentNumber) {
      ToastAlert({
        position: 'center',
        timer: 2000,
        icon: 'error',
        title: 'Por favor completa todos los campos obligatorios.'
      });
      return;
    }

    try {
      const docType = DOCUMENT_TYPES.find(dt => dt.acronym === documentType);
      const documentTypeName = docType ? docType.label : documentType;

      const response = await updatePersonInfo({
        email,
        documentTypeName,
        documentNumber,
        name: firstName,
        middleName: secondName,
        lastNameOne: lastName1,
        lastNameTwo: lastName2,
        phone,
      });

      if (response.process === 'success') {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'success',
          title: response.message || 'Información personal actualizada correctamente.'
        });
      } else {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'error',
          title: response.message || 'Error al actualizar la información personal.'
        });
      }
    } catch (error) {
      console.error('Error updating personal info:', error);
    }
  };

  const handleUpdateBankInfo = async () => {
    if (!bank || !accountNumber) {
      ToastAlert({
        position: 'center',
        timer: 2000,
        icon: 'error',
        title: 'Por favor completa el banco y el número de cuenta.'
      });
      return;
    }

    try {
      const response = await updateBankInfo({
        email,
        bankName: bank,
        accountNumber,
      });

      if (response.process === 'success') {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'success',
          title: response.message || 'Información bancaria actualizada correctamente.'
        });
      } else {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'error',
          title: response.message || 'Error al actualizar la información bancaria.'
        });
      }
    } catch (error) {
      console.error('Error updating bank info:', error);
    }
  };

  const handleUpdateLocationInfo = async () => {
    if (!department || !city || !address) {
      ToastAlert({
        position: 'center',
        timer: 2000,
        icon: 'error',
        title: 'Por favor completa departamento, ciudad y dirección.'
      });
      return;
    }

    try {
      const response = await updateLocationInfo({
        email,
        department,
        city,
        neighborhood,
        address,
        type_of_housing: housingType,
      });

      if (response.process === 'success') {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'success',
          title: response.message || 'Información de ubicación actualizada correctamente.'
        });
      } else {
        ToastAlert({
          position: 'center',
          timer: 2000,
          icon: 'error',
          title: response.message || 'Error al actualizar la información de ubicación.'
        });
      }
    } catch (error) {
      console.error('Error updating location info:', error);
    }
  };

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    setCity("");
    setDepartmentCodeSelected("");

    setTimeout(() => {
      const dept = departments.find(d => d.name === value);
      if (dept) {
        setDepartmentCodeSelected(dept.id);
      }
    }, 100);
  };

  const SkeletonInput = () => {
    return (
      <div className="bg-gray-300 rounded-lg animate-pulse w-full h-10">
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-12 ">
      <Navbar />
      <TransversalHeader
        title="Configuración de Perfil"
        description="Gestiona tu información personal y preferencias de cuenta."
      />

      <FullScreenLoader show={loading || loadingUpdatePersonInfo || loadingUpdateBankInfo || loadingUpdateLocationInfo} message={loadingUpdateLocationInfo ? "Actualizando información de ubicación..." : loadingUpdateBankInfo ? "Actualizando información bancaria..." : loadingUpdatePersonInfo ? "Actualizando información personal..." : "Cargando información del perfil..."} />

      {!loading ? (
        <div className="container mx-auto px-4 mt-8 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-blue-100 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-1xl font-bold mb-1 text-gray-800">
                    {firstName} {secondName} {lastName1} {lastName2}
                  </h2>
                  <p className="text-gray-800 flex items-center gap-2 text-md">
                    <Mail className="w-4 h-4" />
                    {email}
                  </p>
                </div>
                <div className="flex gap-2 hidden">
                  {!isEditMode ? (
                    <button
                      onClick={handleEditToggle}
                      className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                    >
                      <Edit2 className="w-5 h-5" />
                      Editar
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                      >
                        <Save className="w-5 h-5" />
                        Guardar
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Select
                      options={DOCUMENT_TYPES.map(dt => dt.label)}
                      label="Tipo de Documento"
                      value={DOCUMENT_TYPES.find(dt => dt.acronym === documentType)?.label || ""}
                      onChange={(e) => {
                        const selected = DOCUMENT_TYPES.find(dt => dt.label === e.target.value);
                        if (selected) setDocumentType(selected.acronym);
                      }}
                      icon={IdCardLanyard}
                      className={"md:mt-0.2"}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Número de documento"
                      icon={IdCard}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value.replace(/\b\w/g, c => c.toUpperCase()))}
                      placeholder="Primer nombre *"
                      icon={User}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      value={secondName}
                      onChange={(e) => setSecondName(e.target.value.replace(/\b\w/g, c => c.toUpperCase()))}
                      placeholder="Segundo nombre"
                      icon={User}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      value={lastName1}
                      onChange={(e) => setLastName1(e.target.value.replace(/\b\w/g, c => c.toUpperCase()))}
                      placeholder="Primer apellido *"
                      icon={User}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      value={lastName2}
                      onChange={(e) => setLastName2(e.target.value.replace(/\b\w/g, c => c.toUpperCase()))}
                      placeholder="Segundo apellido"
                      icon={User}
                    />
                  </div>

                  <div>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Teléfono *"
                      icon={Phone}
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <PrimaryButton
                      onClick={handleUpdatePersonalInfo}
                    >
                      <div className='flex items-center gap-2 text-sm'>
                        <UserPen className='w-4 h-4 mr-2' />
                        Actualizar datos personales
                      </div>
                    </PrimaryButton>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  Información bancaria
                </h3>
                {(!bank || !accountNumber) && !isEditMode ? (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          El usuario no cuenta con información bancaria registrada.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Select
                      options={BANKS}
                      label="Banco"
                      value={bank || ""}
                      onChange={(e) => setBank(e.target.value)}

                      icon={Landmark}
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      value={accountNumber || ""}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Número de Cuenta"
                      icon={CreditCard}

                    />
                  </div>
                  <div>
                    <PrimaryButton
                      onClick={handleUpdateBankInfo}
                    >
                      <div className='flex items-center gap-2 text-sm'>
                        <BanknoteArrowUp className='w-4 h-4 mr-2' />
                        Actualizar datos bancario
                      </div>
                    </PrimaryButton>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  Información de ubicación
                </h3>
                {(!department || !address) && !isEditMode ? (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          El usuario no cuenta con información de ubicación registrada.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Select
                      options={departments.map(d => d.name)}
                      label="Departamento"
                      value={department || ""}
                      onChange={(e) => handleDepartmentChange(e.target.value)}
                      icon={MapPin}
                    />
                  </div>

                  <div>
                    <Select
                      options={departmentCodeSelected ? cities.map(c => c.name) : ['Seleccione departamento primero']}
                      label="Ciudad"
                      value={city || ""}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={!departmentCodeSelected}
                      icon={MapPin}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      value={neighborhood || ""}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Barrio"
                      icon={MapPinHouse}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      value={address || ""}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Dirección"
                      icon={MapPinHouse}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Select
                      options={HOUSING_TYPES}
                      label="Tipo de Vivienda"
                      value={housingType || ""}
                      onChange={(e) => setHousingType(e.target.value)}
                      icon={Building2}
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <PrimaryButton
                      onClick={handleUpdateLocationInfo}
                    >
                      <div className='flex items-center gap-2 text-sm'>
                        <MapPinPen className='w-4 h-4 mr-2' />
                        Actualizar datos de ubicación
                      </div>
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <SecondaryButton
              onClick={() => navigate('/')}
              className="px-8 py-3 cursor-pointer transform hover:scale-105 transition-transform text-sm"
            >
              Volver al Inicio
            </SecondaryButton>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 mt-8 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gray-100 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-2 bg-gray-300 rounded-lg animate-pulse w-120 h-8">

                  </h2>
                  <p className="text-gray-800 flex items-center gap-2 bg-gray-300 rounded-lg animate-pulse w-48 h-8">

                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <SkeletonInput />
                </div>
                <div>
                  <SkeletonInput />
                </div>
                <div>
                  <SkeletonInput />
                </div>
                <div>
                  <SkeletonInput />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
