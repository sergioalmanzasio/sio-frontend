import FullScreenLoader from "../components/loader/FullScreenLoader";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthRedirect = () => {
  const { isAuthenticated, login, userData } = useAuth();
  const navigate = useNavigate();

  const redirect = (roleName) => {
    switch (roleName) {
      case 'client' || 'assistant':
        navigate('/offers');
        break;
      case 'referral':
        navigate('/referral/dashboard');
        break;  
      case 'service coordinator':
        navigate('/coordinator/dashboard');
        break;
      case 'sysadmin':
        navigate('/sysadmin/dashboard');
        break;
      default:
        navigate('/');
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      redirect(userData?.roleName);
    }else{
        navigate('/');
    }
  }, [isAuthenticated, navigate]);
  return (
      <FullScreenLoader show={true} message="Validando, espere un momento por favor..." />
  );
}; 

export default AuthRedirect;
