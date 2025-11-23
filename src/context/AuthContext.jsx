// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserData, clearUserData } from "../shared/auth";
import useSignin from "../hooks/useSignin"; // Importamos el hook que maneja la API

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear un Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Crear el Provider (el cerebro del estado global)
export const AuthProvider = ({ children }) => {
  const { signin: apiSignin, loading: apiLoading } = useSignin();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  // Lógica de chequeo inicial (al montar la app)
  useEffect(() => {
    const data = getUserData();
    if (data) {
      setUserData(data);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Función de LOGIN centralizada
  const login = async (formData) => {
    const success = await apiSignin(formData); // Llama al hook que maneja la API

    // Una vez que el hook de API ha terminado su proceso y guardado la sesión,
    // actualizamos el estado global aquí.
    if (success) {
      const data = getUserData(); // Volvemos a leer los datos recién guardados

      setUserData(data);
      setIsAuthenticated(true);
    }
    return success;
  };

  // Función de LOGOUT centralizada
  const logout = () => {
    clearUserData();
    setUserData(null);
    setIsAuthenticated(false);
  };

  // Objeto de valor a compartir con toda la aplicación
  const value = {
    isAuthenticated,
    userData,
    loading: apiLoading, // Puedes pasar también el estado de carga
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
