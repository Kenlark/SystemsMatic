import axios from "axios";
import { Appointment, Contact } from "../types/appointment";

interface AppointmentWithContact extends Appointment {
  contact: Contact;
}

// Configuration axios pour le backoffice avec authentification Basic
const backofficeApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  // Authentification Basic
  auth: {
    username: process.env.NEXT_PUBLIC_BASIC_AUTH_USER || "admin",
    password: process.env.NEXT_PUBLIC_BASIC_AUTH_PASS || "password",
  },
  timeout: 10000,
});

// Service pour le backoffice
export const backofficeService = {
  // Récupérer les rendez-vous en attente
  getPendingAppointments: async (): Promise<AppointmentWithContact[]> => {
    const response = await backofficeApi.get(
      "/backoffice/appointments/pending"
    );
    return response.data;
  },

  // Confirmer un rendez-vous
  confirmAppointment: async (
    id: string,
    data: { scheduledAt: string; status: string }
  ) => {
    const response = await backofficeApi.put(
      `/backoffice/appointments/${id}/confirm`,
      data
    );
    return response.data;
  },
};

export default backofficeApi;
