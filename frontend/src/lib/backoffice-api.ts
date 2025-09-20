import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Instance axios pour le backoffice avec cookies automatiques
const backofficeClient = axios.create({
  baseURL: `${API_BASE_URL}/backoffice`,
  withCredentials: true,
});

// Types
export interface AppointmentStatusUpdate {
  status: string;
  scheduledAt?: string;
}

export interface Quote {
  id: string;
  contactId: string;
  projectDescription: string;
  acceptPhone: boolean;
  acceptTerms: boolean;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SENT"
    | "ACCEPTED"
    | "REJECTED"
    | "EXPIRED";
  quoteValidUntil?: string;
  quoteDocument?: string;
  processedAt?: string;
  sentAt?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  emailLogs?: Array<{
    id: string;
    sentAt: string;
    template: string;
  }>;
}

export interface QuoteFilter {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface QuoteUpdate {
  status?: string;
  quoteValidUntil?: string;
  quoteDocument?: string;
}

// API du backoffice
export const backofficeApi = {
  // Récupérer tous les rendez-vous ou filtrer par statut
  getAppointments: async (filter?: string) => {
    const params = filter && filter !== "ALL" ? { status: filter } : {};
    const response = await backofficeClient.get("/appointments", { params });
    return response.data;
  },

  // Mettre à jour le statut d'un rendez-vous
  updateAppointmentStatus: async (
    id: string,
    data: AppointmentStatusUpdate
  ) => {
    const response = await backofficeClient.put(
      `/appointments/${id}/status`,
      data
    );
    return response.data;
  },

  // Supprimer un rendez-vous
  deleteAppointment: async (id: string) => {
    const response = await backofficeClient.delete(`/appointments/${id}`);
    return response.data;
  },

  // Envoyer un rappel
  sendReminder: async (id: string) => {
    const response = await backofficeClient.post(
      `/appointments/${id}/reminder`
    );
    return response.data;
  },

  // Proposer une reprogrammation
  proposeReschedule: async (id: string, newScheduledAt: string) => {
    const response = await backofficeClient.post(
      `/appointments/${id}/reschedule`,
      { newScheduledAt }
    );
    return response.data;
  },

  // Récupérer les statistiques
  getStats: async () => {
    const response = await backofficeClient.get("/appointments/stats");
    return response.data;
  },

  // Récupérer le profil de l'utilisateur connecté
  getProfile: async () => {
    const response = await backofficeClient.get("/profile");
    return response.data;
  },

  // === GESTION DES DEVIS ===

  // Récupérer tous les devis avec filtres
  getQuotes: async (filters?: QuoteFilter) => {
    const response = await backofficeClient.get("/quotes", { params: filters });
    return response.data;
  },

  // Récupérer un devis spécifique
  getQuote: async (id: string) => {
    const response = await backofficeClient.get(`/quotes/${id}`);
    return response.data;
  },

  // Mettre à jour un devis
  updateQuote: async (id: string, data: QuoteUpdate) => {
    const response = await backofficeClient.put(`/quotes/${id}`, data);
    return response.data;
  },

  // Mettre à jour le statut d'un devis
  updateQuoteStatus: async (id: string, status: string, data?: any) => {
    const response = await backofficeClient.put(`/quotes/${id}/status`, {
      status,
      data,
    });
    return response.data;
  },

  // Récupérer les statistiques des devis
  getQuotesStats: async () => {
    const response = await backofficeClient.get("/quotes/stats");
    return response.data;
  },

  // Récupérer le dashboard global (RDV + Devis)
  getDashboard: async () => {
    const response = await backofficeClient.get("/dashboard");
    return response.data;
  },
};
