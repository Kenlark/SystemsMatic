import React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseEmailAdmin } from './components/BaseEmailAdmin';
import { AdminInfoBox } from './components/AdminInfoBox';
import { AdminActionButton } from './components/AdminActionButton';
import { commonStyles } from './styles/common';

interface AdminQuoteNotificationProps {
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  acceptPhone: boolean;
  message: string;
  quoteId: string;
  acceptToken: string;
  rejectToken: string;
  baseUrl: string;
}

export const AdminQuoteNotification: React.FC<AdminQuoteNotificationProps> = ({
  contactName,
  contactEmail,
  contactPhone,
  acceptPhone,
  message,
  quoteId,
  acceptToken,
  rejectToken,
  baseUrl,
}) => {
  return (
    <BaseEmailAdmin title="Nouvelle demande de devis" type="quote">
      <Text style={commonStyles.greeting}>Bonjour Admin,</Text>

      <Text style={commonStyles.paragraph}>
        Une nouvelle demande de devis a été soumise et nécessite votre
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
          <p>
            <strong>Accepte d'être recontacté par téléphone :</strong>
            <br />
            <span
              style={{
                color: acceptPhone ? '#28a745' : '#dc3545',
                fontWeight: 'bold',
              }}
            >
              {acceptPhone ? '✅ Oui' : '❌ Non'}
            </span>
          </p>
        </div>
      </AdminInfoBox>

      <AdminInfoBox type="details" title="💼 Description du projet">
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {message}
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
            href={`${baseUrl}/email-actions/quotes/${quoteId}/accept?token=${acceptToken}`}
            variant="success"
          >
            ✅ Accepter le devis
          </AdminActionButton>
        </div>

        <div style={{ margin: '5px', display: 'inline-block' }}>
          <AdminActionButton
            href={`${baseUrl}/email-actions/quotes/${quoteId}/reject?token=${rejectToken}`}
            variant="danger"
          >
            ❌ Refuser le devis
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

      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <a
          href={`mailto:${contactEmail}?subject=Devis personnalisé - SystemsMatic`}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px',
            textAlign: 'center',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            margin: '10px 5px',
          }}
        >
          📧 Répondre au client
        </a>

        {contactPhone && acceptPhone && (
          <a
            href={`tel:${contactPhone}`}
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              textAlign: 'center',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              margin: '10px 5px',
            }}
          >
            📞 Appeler le client
          </a>
        )}
      </div>

      <Text style={commonStyles.footerNote}>
        Cette notification a été générée automatiquement. Merci de traiter cette
        demande rapidement.
      </Text>
    </BaseEmailAdmin>
  );
};
