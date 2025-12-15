import { Injectable, Logger } from '@nestjs/common';
import { EmailOptions } from '../../src/shared/services/email.service';

@Injectable()
export class MockEmailService {
  private readonly logger = new Logger('MockEmailService');
  public sentEmails: EmailOptions[] = [];

  async sendEmail(options: EmailOptions): Promise<void> {
    this.logger.log(`[MOCK] Email would be sent to: ${options.to}`);
    this.logger.log(`[MOCK] Subject: ${options.subject}`);

    // Store the email for test assertions
    this.sentEmails.push(options);

    // Simulate successful sending
    return Promise.resolve();
  }

  async sendConfirmationEmail(email: string, confirmationToken: string): Promise<void> {
    this.logger.log(`[MOCK] Confirmation email would be sent to: ${email}`);
    this.logger.log(`[MOCK] Token: ${confirmationToken.substring(0, 8)}...`);

    // Store the confirmation email details
    this.sentEmails.push({
      to: email,
      subject: 'Confirma tu email - Backlog Pro',
      html: `Mock confirmation email with token: ${confirmationToken}`,
    });

    return Promise.resolve();
  }

  // Utility methods for testing
  clearSentEmails(): void {
    this.sentEmails = [];
  }

  getLastSentEmail(): EmailOptions | undefined {
    return this.sentEmails[this.sentEmails.length - 1];
  }

  getSentEmailsCount(): number {
    return this.sentEmails.length;
  }

  getSentEmailsTo(email: string): EmailOptions[] {
    return this.sentEmails.filter((e) => e.to === email);
  }
}
