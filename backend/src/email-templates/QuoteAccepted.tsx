import React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseEmail } from './components/BaseEmail';
import { InfoBox } from './components/InfoBox';

interface QuoteAcceptedProps {
  contactName: string;
  projectDescription: string;
}

export const QuoteAccepted: React.FC<QuoteAcceptedProps> = ({
  contactName,
  projectDescription,
}) => {
  return (
    <BaseEmail title="Devis accepté - SystemsMatic">
      <Text style={greeting}>Bonjour {contactName},</Text>

      <Text style={paragraph}>
        Nous avons le plaisir de vous informer que votre demande de devis a été
        acceptée ! Notre équipe va vous recontacter dans les plus brefs délais
        pour planifier la suite.
      </Text>

      <InfoBox type="success" title="✅ Devis accepté">
        <div>
          Votre projet d'automatisme a été validé par notre équipe technique.
        </div>
      </InfoBox>

      <InfoBox title="Votre projet :">
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {projectDescription}
        </div>
      </InfoBox>

      <InfoBox type="info" title="Prochaines étapes">
        <div>
          📞 Contact sous 24h pour planifier l'intervention
          <br />
          💼 Préparation du devis détaillé
          <br />
          📋 Validation des modalités
          <br />
          🚀 Démarrage du projet
        </div>
      </InfoBox>

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
