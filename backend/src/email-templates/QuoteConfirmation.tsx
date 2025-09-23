import React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseEmail } from './components/BaseEmail';
import { InfoBox } from './components/InfoBox';

interface QuoteConfirmationProps {
  contactName: string;
  email: string;
  phone?: string;
  acceptPhone: boolean;
  message: string;
}

export const QuoteConfirmation: React.FC<QuoteConfirmationProps> = ({
  contactName,
  email,
  phone,
  acceptPhone,
  message,
}) => {
  return (
    <BaseEmail title="Confirmation de réception - Demande de devis SystemsMatic">
      <Text style={greeting}>Bonjour {contactName},</Text>

      <Text style={paragraph}>
        Nous avons bien reçu votre demande de devis et nous vous en remercions.
        Notre équipe va l'étudier attentivement et vous recontacter rapidement.
      </Text>

      <InfoBox title="Récapitulatif de votre demande">
        <div>
          <p>
            <strong>Email :</strong>
            <br />
            {email}
          </p>
          {phone && (
            <p>
              <strong>Téléphone :</strong>
              <br />
              {phone}
            </p>
          )}
          <p style={{ color: acceptPhone ? '#059669' : '#dc2626' }}>
            <strong>{acceptPhone ? '✓' : '✗'}</strong>
            <br />
            {acceptPhone
              ? "Vous acceptez d'être recontacté par téléphone"
              : 'Vous préférez être contacté par email uniquement'}
          </p>
        </div>
      </InfoBox>

      <InfoBox title="Votre projet :">
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {message}
        </div>
      </InfoBox>

      <InfoBox type="info" title="Prochaines étapes">
        <div>
          📞 Nous vous contacterons sous 24h
          <br />
          💼 Analyse détaillée de vos besoins
          <br />
          📋 Devis personnalisé et détaillé
          <br />
          🤝 Planification de l'intervention
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
