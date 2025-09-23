import { render } from '@react-email/render';
import React from 'react';
import {
  AppointmentRequest,
  AppointmentConfirmation,
  AppointmentCancelled,
  AppointmentReminder,
  AppointmentRescheduleProposal,
  QuoteConfirmation,
  QuoteAccepted,
  QuoteRejected,
  AdminAppointmentNotification,
  AdminQuoteNotification,
} from './index';

export class EmailRenderer {
  /**
   * Rend un template React Email en HTML
   */
  private static async renderTemplate(
    component: React.ReactElement,
  ): Promise<string> {
    return await render(component);
  }

  // Templates pour les rendez-vous
  static async renderAppointmentRequest(props: {
    contactName: string;
    requestedDate: string;
    reason?: string;
    reasonOther?: string;
    message?: string;
    cancelUrl: string;
  }): Promise<string> {
    return this.renderTemplate(React.createElement(AppointmentRequest, props));
  }

  static async renderAppointmentConfirmation(props: {
    contactName: string;
    scheduledDate: string;
    reason?: string;
    cancelUrl: string;
  }): Promise<string> {
    return this.renderTemplate(
      React.createElement(AppointmentConfirmation, props),
    );
  }

  static async renderAppointmentCancelled(props: {
    contactName: string;
    cancelledDate?: string;
    baseUrl: string;
  }): Promise<string> {
    return this.renderTemplate(
      React.createElement(AppointmentCancelled, props),
    );
  }

  static async renderAppointmentReminder(props: {
    contactName: string;
    scheduledDate: string;
    reason?: string;
    cancelUrl: string;
  }): Promise<string> {
    return this.renderTemplate(React.createElement(AppointmentReminder, props));
  }

  static async renderAppointmentRescheduleProposal(props: {
    contactName: string;
    scheduledDate: string;
    reason?: string;
    confirmUrl: string;
    cancelUrl: string;
  }): Promise<string> {
    return this.renderTemplate(
      React.createElement(AppointmentRescheduleProposal, props),
    );
  }

  // Templates pour les devis
  static async renderQuoteConfirmation(props: {
    contactName: string;
    email: string;
    phone?: string;
    acceptPhone: boolean;
    message: string;
  }): Promise<string> {
    return this.renderTemplate(React.createElement(QuoteConfirmation, props));
  }

  static async renderQuoteAccepted(props: {
    contactName: string;
    projectDescription: string;
  }): Promise<string> {
    return this.renderTemplate(React.createElement(QuoteAccepted, props));
  }

  static async renderQuoteRejected(props: {
    contactName: string;
    projectDescription: string;
    rejectionReason?: string;
  }): Promise<string> {
    return this.renderTemplate(React.createElement(QuoteRejected, props));
  }

  // Templates pour les notifications admin
  static async renderAdminAppointmentNotification(props: {
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    requestedDate: string;
    reason?: string;
    reasonOther?: string;
    message?: string;
  }): Promise<string> {
    return this.renderTemplate(
      React.createElement(AdminAppointmentNotification, props),
    );
  }

  static async renderAdminQuoteNotification(props: {
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    acceptPhone: boolean;
    message: string;
  }): Promise<string> {
    return this.renderTemplate(
      React.createElement(AdminQuoteNotification, props),
    );
  }
}
