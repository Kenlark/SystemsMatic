import React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseEmailAdmin } from './components/BaseEmailAdmin';
import { AdminInfoBox } from './components/AdminInfoBox';
import { AdminActionButton } from './components/AdminActionButton';
import { commonStyles } from './styles/common';

interface AdminAppointmentNotificationProps {
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  requestedDate: string;
  reason?: string;
  reasonOther?: string;
  message?: string;
  appointmentId: string;
  acceptToken: string;
  rejectToken: string;
  rescheduleToken: string;
  baseUrl: string;
}

export const AdminAppointmentNotification: React.FC<
  AdminAppointmentNotificationProps
> = ({
  contactName,
  contactEmail,
  contactPhone,
  requestedDate,
  reason,
  reasonOther,
  message,
  appointmentId,
  acceptToken,
  rejectToken,
  rescheduleToken,
  baseUrl,
}) => {
  return (
    <BaseEmailAdmin title="Nouvelle demande de rendez-vous" type="appointment">
      <Text style={commonStyles.greeting}>Bonjour Admin,</Text>

      <Text style={commonStyles.paragraph}>
        Une nouvelle demande de rendez-vous a été soumise et nécessite votre
        attention.
      </Text>

      <AdminInfoBox type="client" title="👤 Informations du client">
        <div>
          <p>
            <strong>Nom :</strong>
            <br />
            {contactName}
          </p>
          <p>
            <strong>Email :</strong>
            <br />
            <a href={`mailto:${contactEmail}`} style={{ color: '#007bff' }}>
              {contactEmail}
            </a>
          </p>
          {contactPhone && (
            <p>
              <strong>Téléphone :</strong>
              <br />
              <a href={`tel:${contactPhone}`} style={{ color: '#007bff' }}>
                {contactPhone}
              </a>
            </p>
          )}
        </div>
      </AdminInfoBox>

      <AdminInfoBox type="details" title="📅 Détails de la demande">
        <div>
          <p>
            <strong>Date souhaitée :</strong>
            <br />
            <span
              style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}
            >
              {requestedDate}
            </span>
          </p>
          <p>
            <strong>Motif :</strong>
            <br />
            {reason || 'Non spécifié'}
          </p>
          {reasonOther && (
            <p>
              <strong>Précision :</strong>
              <br />
              {reasonOther}
            </p>
          )}
          {message && (
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              <strong>Message :</strong>
              <br />
              {message}
            </p>
          )}
        </div>
      </AdminInfoBox>

      <AdminInfoBox type="action" title="⚡ Actions rapides">
        <div>
          <p style={{ margin: '0 0 15px 0' }}>
            <strong>Gérez cette demande directement depuis cet email :</strong>
          </p>
        </div>
      </AdminInfoBox>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div style={{ margin: '5px', display: 'inline-block' }}>
          <AdminActionButton
            href={`${baseUrl}/email-actions/appointments/${appointmentId}/accept?token=${acceptToken}`}
            variant="success"
          >
            ✅ Accepter le rendez-vous
          </AdminActionButton>
        </div>

        <div style={{ margin: '5px', display: 'inline-block' }}>
          <AdminActionButton
            href={`${baseUrl}/email-actions/appointments/${appointmentId}/reject?token=${rejectToken}`}
            variant="danger"
          >
            ❌ Refuser le rendez-vous
          </AdminActionButton>
        </div>

        <div style={{ margin: '5px', display: 'inline-block' }}>
          <AdminActionButton
            href={`${baseUrl}/email-actions/appointments/${appointmentId}/propose-reschedule?token=${rescheduleToken}`}
            variant="warning"
          >
            📅 Proposer une reprogrammation
          </AdminActionButton>
        </div>
      </div>

      <AdminInfoBox type="action" title="📞 Contact direct">
        <div>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>Ou contactez le client directement :</strong>
          </p>
        </div>
      </AdminInfoBox>

      <AdminActionButton
        href={`mailto:${contactEmail}?subject=Confirmation de votre rendez-vous`}
        variant="primary"
      >
        📧 Répondre au client
      </AdminActionButton>

      {contactPhone && (
        <AdminActionButton href={`tel:${contactPhone}`} variant="secondary">
          📞 Appeler le client
        </AdminActionButton>
      )}

      <Text style={commonStyles.footerNote}>
        Cette notification a été générée automatiquement. Merci de traiter cette
        demande rapidement.
      </Text>
    </BaseEmailAdmin>
  );
};
