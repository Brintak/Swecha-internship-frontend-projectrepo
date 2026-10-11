import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  clearSessionToken,
  getCurrentUser,
  getSessionToken,
  loginAccount,
  logoutAccount,
  registerAccount,
  saveSessionToken,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      try {
        if (getSessionToken()) {
          const response = await getCurrentUser();
          if (active) setUser(response.user);
        }
      } catch {
        clearSessionToken();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    initializeAuth();
    return () => {
      active = false;
    };
  }, []);

  const acceptSession = (response) => {
    saveSessionToken(response.token);
    setUser(response.user);
  };

  const signIn = async (credentials) => {
    const response = await loginAccount(credentials);
    acceptSession(response);
    return response;
  };

  const createAccount = async (details) => {
    const response = await registerAccount(details);
    acceptSession(response);
    return response;
  };

  const signOut = async () => {
    try {
      if (getSessionToken()) await logoutAccount();
    } catch {
      // Clear the local session even if the server is unreachable.
    } finally {
      clearSessionToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, createAccount, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};