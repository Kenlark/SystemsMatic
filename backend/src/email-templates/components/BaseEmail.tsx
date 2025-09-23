import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Img,
  Hr,
} from '@react-email/components';

interface BaseEmailProps {
  children: React.ReactNode;
  title: string;
}

export const BaseEmail: React.FC<BaseEmailProps> = ({ children, title }) => {
  return (
    <Html>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://res.cloudinary.com/dfqpyuhyj/image/upload/v1758333945/1755694814429f_-_Ramco_tpoknd.jpg"
              width="50"
              height="50"
              alt="SystemsMatic"
              style={logo}
            />
            <Text style={headerTitle}>SystemsMatic</Text>
          </Section>

          <Section style={content}>{children}</Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>SystemsMatic</Text>
            <Text style={footerText}>
              Cet email a été envoyé automatiquement, merci de ne pas y répondre
              directement.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
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

const logo = {
  margin: '0 auto',
  borderRadius: '50%',
};

const headerTitle = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '10px 0 0 0',
  color: 'white',
};

const content = {
  padding: '24px',
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderTop: 'none',
  borderRadius: '0 0 8px 8px',
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
  margin: '0 0 4px 0',
};
