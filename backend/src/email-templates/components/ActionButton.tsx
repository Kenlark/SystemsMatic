import React from 'react';
import { Section, Text, Link } from '@react-email/components';

interface ActionButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  href,
  children,
  variant = 'primary',
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: '#f8fafc',
          color: '#1e293b',
          border: '1px solid #e2e8f0',
        };
      case 'danger':
        return {
          backgroundColor: '#dc2626',
          color: 'white',
        };
      default:
        return {
          backgroundColor: '#2563eb',
          color: 'white',
        };
    }
  };

  const styles = getStyles();

  return (
    <Section style={buttonContainer}>
      <Link href={href} style={{ ...buttonStyle, ...styles }}>
        {children}
      </Link>
    </Section>
  );
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const buttonStyle = {
  display: 'inline-block',
  padding: '12px 24px',
  textDecoration: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '14px',
};
