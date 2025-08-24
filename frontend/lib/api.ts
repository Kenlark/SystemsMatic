import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Inclure les cookies dans les requêtes
});

// Fonction pour se déconnecter
export const logout = async () => {
  try {
    await api.post("/auth/logout");
    return true;
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return false;
  }
};

// Fonction pour vérifier si l'utilisateur est connecté
export const checkAuth = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    return null;
  }
};
