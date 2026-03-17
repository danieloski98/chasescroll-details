import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  text?: string;
}

/**
 * Service for sending emails using Resend.
 * Requires RESEND_API_KEY environment variable.
 */
export class EmailService {
  /**
   * Sends an email using the Resend API.
   * @param props - Email configuration (to, subject, html, etc.)
   * @returns The Resend response or throws an error.
   */
  static async sendEmail({ to, subject, html, from, text }: SendEmailProps) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined in environment variables');
    }

    try {
      const { data, error } = await resend.emails.send({
        from: from || 'onboarding@resend.dev', // Replace with your verified domain
        to,
        subject,
        html,
        text,
      });

      if (error) {
        console.error('Error from Resend API:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }
}
