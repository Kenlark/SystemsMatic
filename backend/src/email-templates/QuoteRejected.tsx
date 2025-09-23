import React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseEmail } from './components/BaseEmail';
import { InfoBox } from './components/InfoBox';

interface QuoteRejectedProps {
  contactName: string;
  projectDescription: string;
  rejectionReason?: string;
}

export const QuoteRejected: React.FC<QuoteRejectedProps> = ({
  contactName,
  projectDescription,
  rejectionReason,
}) => {
  return (
    <BaseEmail title="Demande de devis - SystemsMatic">
      <Text style={greeting}>Bonjour {contactName},</Text>

      <Text style={paragraph}>
        Nous vous remercions pour votre demande de devis. Après étude de votre
        projet, nous ne sommes malheureusement pas en mesure de vous proposer
        nos services dans ce cas précis.
      </Text>

      {rejectionReason && (
        <InfoBox type="error" title="Raison du refus">
          <div style={{ whiteSpace: 'pre-wrap' }}>{rejectionReason}</div>
        </InfoBox>
      )}

      <InfoBox title="Votre projet :">
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {projectDescription}
        </div>
      </InfoBox>

      <InfoBox type="info" title="Autres possibilités">
        <div>
          Nous vous encourageons à nous recontacter pour d'autres projets
          d'automatisme.
          <br />
          Notre équipe reste à votre disposition pour tout autre besoin.
        </div>
      </InfoBox>

      <Text style={footerNote}>
        Merci de votre compréhension et à bientôt pour de futurs projets.
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
