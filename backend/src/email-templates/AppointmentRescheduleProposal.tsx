import React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseEmail } from './components/BaseEmail';
import { InfoBox } from './components/InfoBox';
import { ActionButton } from './components/ActionButton';

interface AppointmentRescheduleProposalProps {
  contactName: string;
  scheduledDate: string;
  reason?: string;
  confirmUrl: string;
  cancelUrl: string;
}

export const AppointmentRescheduleProposal: React.FC<
  AppointmentRescheduleProposalProps
> = ({ contactName, scheduledDate, reason, confirmUrl, cancelUrl }) => {
  return (
    <BaseEmail title="Proposition de reprogrammation de votre rendez-vous">
      <Text style={greeting}>Bonjour {contactName},</Text>

      <Text style={paragraph}>
        Nous vous proposons de reprogrammer votre rendez-vous à une nouvelle
        date qui pourrait mieux vous convenir.
      </Text>

      <InfoBox title="📅 Nouvelle date proposée">
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

      <InfoBox type="info" title="ℹ️ À noter">
        <div>
          Si vous refusez cette proposition, vous devrez prendre un nouveau
          rendez-vous manuellement depuis notre site.
        </div>
      </InfoBox>

      <Section style={buttonContainer}>
        <ActionButton href={confirmUrl} variant="primary">
          ✅ Accepter cette date
        </ActionButton>
        <br />
        <br />
        <ActionButton href={cancelUrl} variant="danger">
          ❌ Refuser et annuler
        </ActionButton>
      </Section>

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

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const footerNote = {
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center' as const,
  margin: '30px 0 0 0',
};
