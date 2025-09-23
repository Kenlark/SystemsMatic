import React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseEmail } from './components/BaseEmail';
import { InfoBox } from './components/InfoBox';
import { ActionButton } from './components/ActionButton';

interface AppointmentCancelledProps {
  contactName: string;
  cancelledDate?: string;
  baseUrl: string;
}

export const AppointmentCancelled: React.FC<AppointmentCancelledProps> = ({
  contactName,
  cancelledDate,
  baseUrl,
}) => {
  return (
    <BaseEmail title="Votre rendez-vous a été annulé">
      <Text style={greeting}>Bonjour {contactName},</Text>

      <Text style={paragraph}>
        Votre rendez-vous{' '}
        {cancelledDate ? `du <strong>${cancelledDate}</strong>` : ''} a bien été
        annulé.
      </Text>

      <InfoBox type="success" title="✅ Confirmation">
        <div>
          Votre rendez-vous a été annulé avec succès. Vous pouvez reprendre un
          nouveau rendez-vous à tout moment si nécessaire.
        </div>
      </InfoBox>

      <InfoBox type="info" title="Nouveau rendez-vous">
        <div>
          📅 Prendre un nouveau rendez-vous
          <br />
          📞 Nous contacter directement
          <br />
          💬 Demander un devis personnalisé
        </div>
      </InfoBox>

      <ActionButton href={baseUrl} variant="primary">
        📅 Prendre un nouveau rendez-vous
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
