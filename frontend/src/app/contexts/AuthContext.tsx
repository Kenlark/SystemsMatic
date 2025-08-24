"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  ReactNode,
} from "react";
import { checkAuth, logout } from "lib/api";

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logoutUser: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  resetAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const authUser = await checkAuth();

      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification d'authentification:",
        error
      );
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  const logoutUser = async () => {
    try {
      const success = await logout();
      // Même si la requête échoue, on force la déconnexion côté client
      resetAuth();
      // Re-vérifier l'état d'authentification après un court délai
      setTimeout(() => {
        checkAuthStatus();
      }, 100);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // Même en cas d'erreur, on force la déconnexion côté client
      resetAuth();
    }
  };

  const resetAuth = () => {
    setUser(null);
    setIsLoading(false);
    setIsInitialized(true);
  };

  // Vérifier l'authentification au montage du composant
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Re-vérifier l'authentification si l'utilisateur n'est pas défini mais que l'initialisation est terminée
  useEffect(() => {
    if (isInitialized && !user && !isLoading) {
      checkAuthStatus();
    }
  }, [isInitialized, user, isLoading]);

  const value = {
    user,
    isLoading,
    login,
    logoutUser,
    checkAuthStatus,
    resetAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
