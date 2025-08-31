"use client";

import { useState, useEffect } from "react";
import { backofficeService } from "../../../lib/backoffice-api";
import { Appointment, Contact } from "../../../types/appointment";
import "../../styles/admin.css";

interface AppointmentWithContact extends Appointment {
  contact: Contact;
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentWithContact[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // Récupérer les rendez-vous en attente
  const fetchPendingAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await backofficeService.getPendingAppointments();
      setAppointments(data);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des rendez-vous:", err);
      setError(
        err.response?.data?.message ||
          "Erreur lors de la récupération des rendez-vous"
      );
    } finally {
      setLoading(false);
    }
  };

  // Confirmer un rendez-vous
  const confirmAppointment = async (id: string) => {
    try {
      setConfirmingId(id);
      await backofficeService.confirmAppointment(id, {
        scheduledAt: new Date().toISOString(),
        status: "CONFIRMED",
      });

      // Rafraîchir la liste
      await fetchPendingAppointments();
    } catch (err: any) {
      console.error("Erreur lors de la confirmation:", err);
      alert(err.response?.data?.message || "Erreur lors de la confirmation");
    } finally {
      setConfirmingId(null);
    }
  };

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-content">
          <div className="admin-loading-spinner"></div>
          <p className="admin-loading-text">Chargement des rendez-vous...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <div className="admin-error-content">
          <div className="admin-error-icon">⚠️</div>
          <p className="admin-error-text">{error}</p>
          <button
            onClick={fetchPendingAppointments}
            className="admin-error-button"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-card">
          <div className="admin-header">
            <h1 className="admin-title">
              Gestion des Rendez-vous - Backoffice
            </h1>
            <p className="admin-subtitle">
              Rendez-vous en attente de confirmation ({appointments.length})
            </p>
          </div>

          {appointments.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📋</div>
              <h3 className="admin-empty-title">
                Aucun rendez-vous en attente
              </h3>
              <p className="admin-empty-text">
                Tous les rendez-vous ont été traités.
              </p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Raison</th>
                    <th>Date de création</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>
                        <div className="admin-text admin-text-medium">
                          {appointment.contact.firstName}{" "}
                          {appointment.contact.lastName}
                        </div>
                      </td>
                      <td>
                        <div className="admin-text">
                          {appointment.contact.email}
                        </div>
                      </td>
                      <td>
                        <div className="admin-text">
                          {appointment.contact.phone || "-"}
                        </div>
                      </td>
                      <td>
                        <div className="admin-text">
                          {appointment.reason || appointment.reasonOther || "-"}
                        </div>
                      </td>
                      <td>
                        <div className="admin-text">
                          {new Date(appointment.createdAt).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => confirmAppointment(appointment.id)}
                          disabled={confirmingId === appointment.id}
                          className={`admin-button admin-button--confirm ${
                            confirmingId === appointment.id
                              ? "admin-button--disabled"
                              : ""
                          }`}
                        >
                          {confirmingId === appointment.id ? (
                            <>
                              <div className="admin-spinner"></div>
                              Confirmation...
                            </>
                          ) : (
                            "Confirmer"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
