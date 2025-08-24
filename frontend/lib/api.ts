import axios from "axios";
import { getCookie, setCookie, removeCookie } from "./cookies";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  withCredentials: true, // Inclure les cookies dans les requêtes
});

// Intercepteur pour ajouter le token dans les headers si disponible
api.interceptors.request.use((config) => {
  // Essayer d'abord les cookies
  let token = getCookie("access_token");

  // Fallback vers localStorage en production si les cookies ne fonctionnent pas
  if (!token && process.env.NODE_ENV === "production") {
    token = localStorage.getItem("access_token");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fonction pour stocker le token de manière sécurisée
export const setAuthToken = (token: string) => {
  // Vérifier que le token semble valide (JWT basique)
  if (typeof window !== "undefined" && token && token.split(".").length === 3) {
    // Essayer d'abord les cookies
    setCookie("access_token", token);

    // En production, aussi stocker dans localStorage comme fallback
    if (process.env.NODE_ENV === "production") {
      localStorage.setItem("access_token", token);
    }
  } else {
    console.warn("Token invalide, non stocké");
  }
};

// Fonction pour supprimer le token
export const removeAuthToken = () => {
  removeCookie("access_token");

  // Aussi supprimer de localStorage en production
  if (process.env.NODE_ENV === "production") {
    localStorage.removeItem("access_token");
  }
};

// Fonction pour récupérer le token
export const getAuthToken = () => {
  // Essayer d'abord les cookies
  let token = getCookie("access_token");

  // Fallback vers localStorage en production si les cookies ne fonctionnent pas
  if (!token && process.env.NODE_ENV === "production") {
    token = localStorage.getItem("access_token");
  }

  return token;
};

// Fonction pour se déconnecter
export const logout = async () => {
  try {
    await api.post("/auth/logout");
    removeAuthToken();
    return true;
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    // En cas d'erreur, on force la déconnexion côté client
    removeAuthToken();
    return true;
  }
};

// Fonction pour vérifier si l'utilisateur est connecté
export const checkAuth = async () => {
  try {
    const token = getAuthToken();

    if (!token) {
      console.log("Aucun token valide trouvé");
      return null;
    }

    const response = await api.get("/auth/profile");

    // Vérifier que la réponse contient les données nécessaires
    if (response.data && response.data.id) {
      return response.data;
    }
    return null;
  } catch (error: any) {
    console.error("Erreur lors de la vérification d'authentification:", error);
    if (error.response?.status === 401) {
      // Token expiré ou invalide, le supprimer
      removeAuthToken();
    }
    return null;
  }
};

// Fonction pour se connecter
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });

    if (response.data?.user) {
      // Le token est automatiquement défini dans les cookies par le backend
      // En production, utiliser aussi le token retourné comme fallback
      if (response.data.access_token) {
        setAuthToken(response.data.access_token);
      }

      return response.data.user;
    }

    throw new Error("Données utilisateur manquantes");
  } catch (error: any) {
    console.error("Erreur lors de la connexion:", error);
    throw error;
  }
};
