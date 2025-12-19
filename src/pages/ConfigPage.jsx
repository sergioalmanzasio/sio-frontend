import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, IdCard, Edit2, Save, X, Building, ShieldUser, CreditCard } from 'lucide-react';
import Navbar from '../components/Navbar';
import TransversalHeader from '../components/header/TransversalHeader';
import { PrimaryButton, SecondaryButton } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Select from '../components/ui/select';
import ToastAlert from '../components/alerts/ToastAlert';
import FullScreenLoader from '../components/loader/FullScreenLoader';
import { getDocumentTypes, getDepartments, getCitiesByDepartmentId } from '../shared/utils';

const DOCUMENT_TYPES = getDocumentTypes();
const HOUSING_TYPES = ["Casa", "Apartamento", "Edificio", "Oficina"];
const BANKS = ["Bancolombia", "Davivienda", "Banco de Bogotá", "BBVA", "Nequi", "Daviplata"];

// Simulated user data
const MOCK_USER_DATA = {
  documentType: "CC",
  documentNumber: "1234567890",
  firstName: "Juan",
  secondName: "Carlos",
  lastName: "Pérez González",
  email: "juan.perez@example.com",
  phone: "3001234567",
  department: "Cundinamarca",
  city: "Bogotá",
  neighborhood: "Chapinero",
  address: "Calle 45 # 12-34",
  housingType: "Apartamento",
  bank: "Nequi",
  accountNumber: "3001234567",
  role: "Referido",
  roleColor: "bg-gradient-to-r from-purple-500 to-pink-500"
};

export default function ConfigPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [departmentCodeSelected, setDepartmentCodeSelected] = useState("");

  // User data states
  const [documentType, setDocumentType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName, setLastName] = useState("");
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

  // Backup for cancel functionality
  const [backupData, setBackupData] = useState({});

  // Simulate data loading
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Load mock data
      setDocumentType(MOCK_USER_DATA.documentType);
      setDocumentNumber(MOCK_USER_DATA.documentNumber);
      setFirstName(MOCK_USER_DATA.firstName);
      setSecondName(MOCK_USER_DATA.secondName);
      setLastName(MOCK_USER_DATA.lastName);
      setEmail(MOCK_USER_DATA.email);
      setPhone(MOCK_USER_DATA.phone);
      setDepartment(MOCK_USER_DATA.department);
      setCity(MOCK_USER_DATA.city);
      setNeighborhood(MOCK_USER_DATA.neighborhood);
      setAddress(MOCK_USER_DATA.address);
      setHousingType(MOCK_USER_DATA.housingType);
      setBank(MOCK_USER_DATA.bank);
      setAccountNumber(MOCK_USER_DATA.accountNumber);
      setRole(MOCK_USER_DATA.role);
      setRoleColor(MOCK_USER_DATA.roleColor);
      
      setLoading(false);
    };

    loadUserData();
  }, []);

  // Load department code when department is set (for initial load)
  useEffect(() => {
    if (department && departments.length > 0 && !departmentCodeSelected) {
      const dept = departments.find(d => d.name === department);
      if (dept) {
        setDepartmentCodeSelected(dept.id);
      }
    }
  }, [department, departments, departmentCodeSelected]);

  // Load departments
  useEffect(() => {
    const loadDepartments = async () => {
      const depts = await getDepartments();
      setDepartments(depts);
    };
    loadDepartments();
  }, []);

  // Load cities when department changes
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
      // Entering edit mode - backup current data
      setBackupData({
        documentType,
        documentNumber,
        firstName,
        secondName,
        lastName,
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
    // Restore backup data
    setDocumentType(backupData.documentType);
    setDocumentNumber(backupData.documentNumber);
    setFirstName(backupData.firstName);
    setSecondName(backupData.secondName);
    setLastName(backupData.lastName);
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
    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      ToastAlert({
        position: 'center',
        timer: 2000,
        icon: 'error',
        title: 'Por favor completa todos los campos obligatorios.'
      });
      return;
    }

    // Simulate save operation
    ToastAlert({
      position: 'center',
      timer: 2000,
      icon: 'success',
      title: 'Información actualizada correctamente.'
    });
    
    setIsEditMode(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-12 ">
      <Navbar />
      <TransversalHeader
        title="Configuración de Perfil"
        description="Gestiona tu información personal y preferencias de cuenta."
      />

      <FullScreenLoader show={loading} message="Cargando información del perfil..." />

      {!loading && (
        <div className="container mx-auto px-4 mt-8 max-w-6xl">

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-blue-100 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-gray-800">
                    {firstName} {secondName} {lastName}
                  </h2>
                  <p className="text-gray-800 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {email}
                  </p>
                  <p className="text-gray-800 flex items-center gap-2">
                    <ShieldUser className="w-4 h-4" />
                    {role}
                  </p>
                </div>
                <div className="flex gap-2">
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

            {/* Content Section */}
            <div className="p-8">
              {/* Personal Information */}
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
                      disabled={!isEditMode}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Número de documento"
                      icon={IdCard}
                      disabled={!isEditMode}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value.replace(/\b\w/g, c => c.toUpperCase()))}
                      placeholder="Primer nombre *"
                      icon={User}
                      disabled={!isEditMode}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      value={secondName}
                      onChange={(e) => setSecondName(e.target.value.replace(/\b\w/g, c => c.toUpperCase()))}
                      placeholder="Segundo nombre"
                      icon={User}
                      disabled={!isEditMode}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value.replace(/\b\w/g, c => c.toUpperCase()))}
                      placeholder="Apellidos *"
                      icon={User}
                      disabled={!isEditMode}
                    />
                  </div>

                  <div>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Teléfono *"
                      icon={Phone}
                      disabled={!isEditMode}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

              {/* Bank Information */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  Información Bancaria
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Select
                      options={BANKS}
                      label="Banco"
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      disabled={!isEditMode}
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Número de Cuenta"
                      icon={CreditCard}
                      disabled={!isEditMode}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8"></div>

              {/* Address Information */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  Información de Ubicación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Select
                      options={departments.map(d => d.name)}
                      label="Departamento"
                      value={department}
                      onChange={(e) => handleDepartmentChange(e.target.value)}
                      disabled={!isEditMode}
                    />
                  </div>

                  <div>
                    <Select
                      options={departmentCodeSelected ? cities.map(c => c.name) : ['Seleccione departamento primero']}
                      label="Ciudad"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={!isEditMode || !departmentCodeSelected}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Barrio"
                      icon={MapPin}
                      disabled={!isEditMode}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Dirección"
                      icon={MapPin}
                      disabled={!isEditMode}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Select
                      options={HOUSING_TYPES}
                      label="Tipo de Vivienda"
                      value={housingType}
                      onChange={(e) => setHousingType(e.target.value)}
                      disabled={!isEditMode}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <SecondaryButton
              onClick={() => navigate('/')}
              className="px-8 py-3 cursor-pointer transform hover:scale-105 transition-transform"
            >
              Volver al Inicio
            </SecondaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
