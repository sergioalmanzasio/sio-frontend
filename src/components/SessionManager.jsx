import { useAuth } from "../context/AuthContext";
import useInactivityLogout from "../hooks/useInactivityLogout";
import { INACTIVITY_LOGOUT_TIMER } from "../shared/constanst";

function SessionManager() {
  const { isAuthenticated, logout } = useAuth();
  useInactivityLogout(isAuthenticated ? logout : null, INACTIVITY_LOGOUT_TIMER);
  return null;
}

export default SessionManager;