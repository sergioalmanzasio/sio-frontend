import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserData, clearUserData } from "../shared/auth";
import useSignin from "../hooks/useSignin";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthProvider = ({ children }) => {
  const { signin: apiSignin, loading: apiLoading } = useSignin();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = getUserData();
    if (data) {
      setUserData(data);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (formData) => {
    const success = await apiSignin(formData);
    if (success) {
      const data = getUserData();

      setUserData(data);
      setIsAuthenticated(true);
    }
    return success;
  };

  const logout = () => {
    setUserData(null);
    setIsAuthenticated(false);
    clearUserData();
  };

  const value = {
    isAuthenticated,
    userData,
    loading: apiLoading, 
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
