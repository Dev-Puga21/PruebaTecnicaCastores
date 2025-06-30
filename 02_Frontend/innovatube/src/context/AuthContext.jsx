
import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const tokenData = localStorage.getItem("tokenData");
    if (tokenData) {
      return { isAuthenticated: true, tokenData };
    } else {
      return { isAuthenticated: false, tokenData: null };
    }
  });

  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem("tokenData", authState.tokenData);
    }
  }, [authState]);

  const setUserData = useCallback((tokenData) => {
    try {
      const decoded = jwtDecode(tokenData);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setAuthState({ isAuthenticated: true, tokenData });
      } else {
        logout();
      }
    } catch (e) {
      console.error("Token inválido:", e);
      logout();
    }
  }, []);

  const logout = useCallback(() => {
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'La sesión ha sido cerrada por seguridad.',
      icon: 'info',
    }).then(() => {
      setAuthState({ isAuthenticated: false, tokenData: null });
      localStorage.removeItem("tokenData");
    });
  }, []);

  const checkTokenExpiration = useCallback(() => {
    if (authState.isAuthenticated) {
      try {
        const decodedToken = jwtDecode(authState.tokenData);
        if (decodedToken?.exp && decodedToken.exp * 1000 < Date.now()) {
          logout();
        }
      } catch (error) {
        console.error('Error al verificar expiración del token:', error);
      }
    }
  }, [authState, logout]);

  useEffect(() => {
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  const getDecodedToken = useCallback(() => {
    try {
      const decodedToken = jwtDecode(authState.tokenData);
      if (decodedToken) {
        const {
          exp,
          Id,
          FirstName,
          LastName,
          Username,
          Email,
          FirstLogin
        } = decodedToken;

        return {
          exp,
          Id,
          FirstName,
          LastName,
          Username,
          Email,
          FirstLogin
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, setUserData, logout, getDecodedToken }}>
      {children}
    </AuthContext.Provider>
  );
};
