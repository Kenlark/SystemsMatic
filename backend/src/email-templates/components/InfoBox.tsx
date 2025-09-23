import React from 'react';
import { Section, Text } from '@react-email/components';

interface InfoBoxProps {
  children: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  type = 'info',
  title,
}) => {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#f0fdf4',
          borderLeft: '4px solid #059669',
          color: '#065f46',
        };
      case 'warning':
        return {
          backgroundColor: '#fffbeb',
          borderLeft: '4px solid #f59e0b',
          color: '#92400e',
        };
      case 'error':
        return {
          backgroundColor: '#fef2f2',
          borderLeft: '4px solid #dc2626',
          color: '#991b1b',
        };
      default:
        return {
          backgroundColor: '#f8fafc',
          borderLeft: '4px solid #2563eb',
          color: '#1e40af',
        };
    }
  };

  const styles = getStyles();

  return (
    <Section style={{ ...infoBoxStyle, ...styles }}>
      {title && (
        <Text style={{ ...infoBoxTitle, color: styles.color }}>{title}</Text>
      )}
      <Text style={{ ...infoBoxText, color: styles.color }}>{children}</Text>
    </Section>
  );
};

const infoBoxStyle = {
  padding: '20px',
  borderRadius: '8px',
  margin: '25px 0',
};

const infoBoxTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const infoBoxText = {
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
};
