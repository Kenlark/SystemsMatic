import React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseEmail } from './components/BaseEmail';
import { InfoBox } from './components/InfoBox';
import { ActionButton } from './components/ActionButton';

interface AppointmentConfirmationProps {
  contactName: string;
  scheduledDate: string;
  reason?: string;
  cancelUrl: string;
}

export const AppointmentConfirmation: React.FC<
  AppointmentConfirmationProps
> = ({ contactName, scheduledDate, reason, cancelUrl }) => {
  return (
    <BaseEmail title="Rendez-vous confirmé">
      <Text style={greeting}>Bonjour {contactName},</Text>

      <Text style={paragraph}>
        Excellente nouvelle ! Votre rendez-vous a été confirmé.
      </Text>

      <InfoBox type="success" title="📅 Détails du rendez-vous">
        <div>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
            }}
          >
            {scheduledDate}
          </p>
          {reason && (
            <p>
              <strong>Motif :</strong>
              <br />
              {reason}
            </p>
          )}
        </div>
      </InfoBox>

      <InfoBox type="warning" title="⚠️ Important">
        <div>
          Vous ne pouvez annuler ce rendez-vous que jusqu'à 24h avant l'heure
          prévue. Passé ce délai, veuillez nous contacter directement.
        </div>
      </InfoBox>

      <ActionButton href={cancelUrl} variant="danger">
        🚫 Annuler ce rendez-vous
      </ActionButton>

      <Text style={footerNote}>
        En cas de question urgente, n'hésitez pas à nous contacter directement.
      </Text>
    </BaseEmail>
  );
};

const greeting = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1e293b',
  margin: '0 0 16px 0',
};

const paragraph = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '0 0 20px 0',
};

const footerNote = {
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center' as const,
  margin: '30px 0 0 0',
};
