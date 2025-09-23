import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface AdminQuoteNotificationProps {
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  acceptPhone: boolean;
  message: string;
}

export const AdminQuoteNotification: React.FC<AdminQuoteNotificationProps> = ({
  contactName,
  contactEmail,
  contactPhone,
  acceptPhone,
  message,
}) => {
  return (
    <Html>
      <Head>
        <title>Nouvelle demande de devis</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerTitle}>Nouvelle demande de devis</Text>
          </Section>

          <Section style={content}>
            <Section style={infoSection}>
              <Text style={sectionTitle}>Informations du client</Text>
              <Text style={infoText}>
                <strong>Nom :</strong>
                <br />
                {contactName}
              </Text>
              <Text style={infoText}>
                <strong>Email :</strong>
                <br />
                {contactEmail}
              </Text>
              {contactPhone && (
                <Text style={infoText}>
                  <strong>Téléphone :</strong>
                  <br />
                  {contactPhone}
                </Text>
              )}
              <Text style={infoText}>
                <strong>Accepte d'être recontacté par téléphone :</strong>
                <br />
                {acceptPhone ? 'Oui' : 'Non'}
              </Text>
            </Section>

            <Section style={detailsSection}>
              <Text style={sectionTitle}>Description du projet</Text>
              <Text style={{ ...infoText, whiteSpace: 'pre-wrap' }}>
                {message}
              </Text>
            </Section>

            <Section style={actionSection}>
              <Text style={actionText}>
                <strong>Action requise :</strong> Contactez le client dans les
                plus brefs délais pour établir un devis personnalisé.
              </Text>
            </Section>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>SystemsMatic - Backoffice</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px 0',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
  borderRadius: '8px 8px 0 0',
  color: 'white',
};

const headerTitle = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  color: 'white',
};

const content = {
  padding: '24px',
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderTop: 'none',
  borderRadius: '0 0 8px 8px',
};

const infoSection = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const detailsSection = {
  backgroundColor: '#ffffff',
  padding: '20px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
};

const actionSection = {
  marginTop: '20px',
  padding: '15px',
  backgroundColor: '#dbeafe',
  borderRadius: '8px',
};

const sectionTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1e293b',
  margin: '0 0 16px 0',
};

const infoText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '0 0 12px 0',
};

const actionText = {
  fontSize: '14px',
  margin: '0',
  color: '#1e40af',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
};

const footer = {
  padding: '20px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0',
};
