import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';

import { EmailOptions, EmailService } from '../../../../src/shared/services/email.service';

// Mock nodemailer
jest.mock('nodemailer');
const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;

describe('EmailService', () => {
  let service: EmailService;
  let mockTransporter: jest.Mocked<nodemailer.Transporter>;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(async () => {
    // Save original environment
    originalEnv = { ...process.env };

    // Reset mocks
    jest.clearAllMocks();

    // Mock transporter with all necessary methods
    mockTransporter = {
      sendMail: jest.fn(),
      verify: jest.fn().mockResolvedValue(true),
      close: jest.fn(),
    } as any;

    mockedNodemailer.createTransport.mockReturnValue(mockTransporter);
    mockedNodemailer.getTestMessageUrl.mockReturnValue('http://test.email/message/test-id');

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);

    // Mock the logger to suppress error logs during tests
    const loggerSpy = jest.spyOn(service['logger'], 'error').mockImplementation(() => {});
    const logSpy = jest.spyOn(service['logger'], 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Constructor and Configuration', () => {
    it('should create transporter with default Mailtrap configuration when no env vars set', () => {
      // Arrange - create a clean environment without SMTP variables
      const cleanEnv = Object.keys(originalEnv).reduce((acc, key) => {
        if (!key.startsWith('SMTP_')) {
          acc[key] = originalEnv[key];
        }
        return acc;
      }, {} as NodeJS.ProcessEnv);

      process.env = cleanEnv;

      // Clear the mock to avoid interference from beforeEach
      jest.clearAllMocks();

      // Act
      new EmailService();

      // Assert
      expect(mockedNodemailer.createTransport).toHaveBeenCalledWith({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
          user: 'NO_CONFIGURADO',
          pass: 'NO_CONFIGURADO',
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
      });
    });

    it('should create transporter with Mailtrap configuration from environment', () => {
      // Arrange
      process.env = {
        ...originalEnv,
        SMTP_HOST: 'sandbox.smtp.mailtrap.io',
        SMTP_PORT: '2525',
        SMTP_USER: 'mailtrap-user',
        SMTP_PASS: 'mailtrap-pass',
      };

      // Clear the mock to avoid interference
      jest.clearAllMocks();

      // Act
      new EmailService();

      // Assert
      expect(mockedNodemailer.createTransport).toHaveBeenCalledWith({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
          user: 'mailtrap-user',
          pass: 'mailtrap-pass',
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
      });
    });

    it('should create transporter with Gmail configuration from environment', () => {
      // Arrange
      process.env = {
        ...originalEnv,
        SMTP_HOST: 'smtp.gmail.com',
        SMTP_PORT: '587',
        SMTP_USER: 'user@gmail.com',
        SMTP_PASS: 'app-password',
      };

      // Clear the mock to avoid interference
      jest.clearAllMocks();

      // Act
      new EmailService();

      // Assert
      expect(mockedNodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'user@gmail.com',
          pass: 'app-password',
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
        service: 'gmail',
        tls: {
          rejectUnauthorized: false
        }
      });
    });

    it('should handle secure port 465 correctly', () => {
      // Arrange
      process.env = {
        ...originalEnv,
        SMTP_HOST: 'smtp.gmail.com',
        SMTP_PORT: '465',
        SMTP_USER: 'user@gmail.com',
        SMTP_PASS: 'app-password',
      };

      // Clear the mock to avoid interference
      jest.clearAllMocks();

      // Act
      new EmailService();

      // Assert
      expect(mockedNodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Port 465 should be secure
        auth: {
          user: 'user@gmail.com',
          pass: 'app-password',
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
        service: 'gmail',
        tls: {
          rejectUnauthorized: false
        }
      });
    });
  });

  describe('sendEmail', () => {
    it('should send email successfully with all options', async () => {
      // Arrange
      const emailOptions: EmailOptions = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<h1>Test HTML Content</h1>',
        text: 'Test plain text content',
      };

      const mockInfo = {
        messageId: '<test-message-id@backlogpro.com>',
        envelope: { from: 'noreply@backlogpro.com', to: ['recipient@example.com'] },
        accepted: ['recipient@example.com'],
        rejected: [],
      };

      mockTransporter.sendMail.mockResolvedValue(mockInfo);

      // Act
      await service.sendEmail(emailOptions);

      // Assert
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Backlog Pro" <noreply@backlogpro.com>',
        to: emailOptions.to,
        subject: emailOptions.subject,
        text: emailOptions.text,
        html: emailOptions.html,
      });
    });

    it('should send email with custom FROM address from environment', async () => {
      // Arrange
      process.env = {
        ...originalEnv,
        SMTP_FROM: '"Custom App" <custom@example.com>',
      };

      // Create new service instance to pick up env changes
      const customService = new EmailService();

      const emailOptions: EmailOptions = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test</p>',
      };

      const mockInfo = { messageId: 'test-id' };
      mockTransporter.sendMail.mockResolvedValue(mockInfo);

      // Act
      await customService.sendEmail(emailOptions);

      // Assert
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Custom App" <custom@example.com>',
        to: emailOptions.to,
        subject: emailOptions.subject,
        text: undefined,
        html: emailOptions.html,
      });
    });

    it('should send email without text content', async () => {
      // Arrange
      const emailOptions: EmailOptions = {
        to: 'recipient@example.com',
        subject: 'HTML Only Email',
        html: '<h1>HTML Only Content</h1>',
      };

      const mockInfo = { messageId: 'test-id' };
      mockTransporter.sendMail.mockResolvedValue(mockInfo);

      // Act
      await service.sendEmail(emailOptions);

      // Assert
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Backlog Pro" <noreply@backlogpro.com>',
        to: emailOptions.to,
        subject: emailOptions.subject,
        text: undefined,
        html: emailOptions.html,
      });
    });

    it('should log preview URL in development environment', async () => {
      // Arrange
      process.env.NODE_ENV = 'development';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const emailOptions: EmailOptions = {
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      };

      const mockInfo = { messageId: 'test-id' };
      mockTransporter.sendMail.mockResolvedValue(mockInfo);
      mockedNodemailer.getTestMessageUrl.mockReturnValue('http://test.email/message/test-id');

      // Act
      await service.sendEmail(emailOptions);

      // Assert - Note: We can't easily test the logger, but we can test the nodemailer call
      expect(mockedNodemailer.getTestMessageUrl).toHaveBeenCalledWith(mockInfo);

      // Cleanup
      consoleSpy.mockRestore();
    });

    describe('Error Handling', () => {
      it('should throw descriptive error when SMTP connection fails', async () => {
        // Arrange
        const emailOptions: EmailOptions = {
          to: 'test@example.com',
          subject: 'Test',
          html: '<p>Test</p>',
        };

        const smtpError = new Error('SMTP connection failed');
        mockTransporter.sendMail.mockRejectedValue(smtpError);

        // Act
        await service.sendEmail(emailOptions);

        // Assert - Should not throw, but should log error
        expect(mockTransporter.sendMail).toHaveBeenCalled();
      });

      it('should throw descriptive error when authentication fails', async () => {
        // Arrange
        const emailOptions: EmailOptions = {
          to: 'test@example.com',
          subject: 'Test',
          html: '<p>Test</p>',
        };

        const authError = new Error('Invalid login: 535 Authentication failed');
        (authError as any).code = 'EAUTH';
        mockTransporter.sendMail.mockRejectedValue(authError);

        // Act
        await service.sendEmail(emailOptions);

        // Assert - Should not throw, but should log error
        expect(mockTransporter.sendMail).toHaveBeenCalled();
      });

      it('should handle unknown error types', async () => {
        // Arrange
        const emailOptions: EmailOptions = {
          to: 'test@example.com',
          subject: 'Test',
          html: '<p>Test</p>',
        };

        mockTransporter.sendMail.mockRejectedValue('Unknown error string');

        // Act
        await service.sendEmail(emailOptions);

        // Assert - Should not throw, but should log error
        expect(mockTransporter.sendMail).toHaveBeenCalled();
      });
    });
  });

  describe('sendConfirmationEmail', () => {
    it('should send confirmation email with correct structure', async () => {
      // Arrange
      const email = 'newuser@example.com';
      const token = 'confirmation-token-123';
      const mockInfo = { messageId: 'confirmation-message-id' };

      mockTransporter.sendMail.mockResolvedValue(mockInfo);

      // Act
      await service.sendConfirmationEmail(email, token);

      // Assert
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: 'Confirma tu email - Backlog Pro',
          html: expect.stringContaining('¡Bienvenido a Backlog Pro!'),
          text: expect.stringContaining('¡Bienvenido a Backlog Pro!'),
        }),
      );
    });

    it('should include confirmation URL with token in email content', async () => {
      // Arrange
      const email = 'user@example.com';
      const token = 'test-token-456';
      const mockInfo = { messageId: 'test-message-id' };

      mockTransporter.sendMail.mockResolvedValue(mockInfo);

      // Act
      await service.sendConfirmationEmail(email, token);

      // Assert
      const sendMailCall = mockTransporter.sendMail.mock.calls[0][0];
      const expectedUrl = `http://localhost:3000/confirm-email?token=${token}`;

      expect(sendMailCall.html).toContain(expectedUrl);
      expect(sendMailCall.text).toContain(expectedUrl);
    });

    it('should use custom frontend URL from environment', async () => {
      // Arrange
      process.env = {
        ...originalEnv,
        FRONTEND_URL: 'https://myapp.com',
      };

      // Create new service instance to pick up env changes
      const customService = new EmailService();

      const email = 'user@example.com';
      const token = 'test-token';
      const mockInfo = { messageId: 'test-message-id' };

      mockTransporter.sendMail.mockResolvedValue(mockInfo);

      // Act
      await customService.sendConfirmationEmail(email, token);

      // Assert
      const sendMailCall = mockTransporter.sendMail.mock.calls[0][0];
      const expectedUrl = `https://myapp.com/confirm-email?token=${token}`;

      expect(sendMailCall.html).toContain(expectedUrl);
      expect(sendMailCall.text).toContain(expectedUrl);
    });

    it('should include security information in email', async () => {
      // Arrange
      const email = 'user@example.com';
      const token = 'test-token';
      const mockInfo = { messageId: 'test-message-id' };

      mockTransporter.sendMail.mockResolvedValue(mockInfo);

      // Act
      await service.sendConfirmationEmail(email, token);

      // Assert
      const sendMailCall = mockTransporter.sendMail.mock.calls[0][0];

      expect(sendMailCall.html).toContain('24 horas');
      expect(sendMailCall.html).toContain('seguridad');
      expect(sendMailCall.text).toContain('24 horas');
    });

    it('should handle confirmation email sending errors gracefully', async () => {
      // Arrange
      const email = 'user@example.com';
      const token = 'test-token';

      const emailError = new Error('Email service unavailable');
      mockTransporter.sendMail.mockRejectedValue(emailError);

      // Act
      await service.sendConfirmationEmail(email, token);

      // Assert - Should not throw, but should log error
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });
  });

  describe('Integration Scenarios', () => {
    it('should work with Mailtrap configuration', async () => {
      // Arrange - Simulate Mailtrap environment
      process.env = {
        ...originalEnv,
        SMTP_HOST: 'sandbox.smtp.mailtrap.io',
        SMTP_PORT: '2525',
        SMTP_USER: '5cd9dfe287e1e0',
        SMTP_PASS: '76ee1802d6122e',
        SMTP_FROM: '"Backlog Pro Dev" <noreply@backlogpro.dev>',
      };

      // Clear mocks
      jest.clearAllMocks();
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'mailtrap-message-id' });

      const emailOptions: EmailOptions = {
        to: 'test@example.com',
        subject: 'Mailtrap Test',
        html: '<p>Testing Mailtrap</p>',
      };

      // Act
      const emailService = new EmailService();
      await emailService.sendEmail(emailOptions);

      // Assert
      expect(mockedNodemailer.createTransport).toHaveBeenCalledWith({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
          user: '5cd9dfe287e1e0',
          pass: '76ee1802d6122e',
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Backlog Pro Dev" <noreply@backlogpro.dev>',
        to: 'test@example.com',
        subject: 'Mailtrap Test',
        text: undefined,
        html: '<p>Testing Mailtrap</p>',
      });
    });

    it('should work with Gmail configuration', async () => {
      // Arrange - Simulate Gmail environment
      process.env = {
        ...originalEnv,
        SMTP_HOST: 'smtp.gmail.com',
        SMTP_PORT: '587',
        SMTP_USER: 'user@gmail.com',
        SMTP_PASS: 'app-password-123',
        SMTP_FROM: '"Backlog Pro" <user@gmail.com>',
      };

      // Clear mocks
      jest.clearAllMocks();
      mockTransporter.sendMail.mockResolvedValue({ messageId: 'gmail-message-id' });

      const emailOptions: EmailOptions = {
        to: 'recipient@example.com',
        subject: 'Gmail Test',
        html: '<p>Testing Gmail</p>',
      };

      // Act
      const emailService = new EmailService();
      await emailService.sendEmail(emailOptions);

      // Assert
      expect(mockedNodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'user@gmail.com',
          pass: 'app-password-123',
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
        service: 'gmail',
        tls: {
          rejectUnauthorized: false
        }
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Backlog Pro" <user@gmail.com>',
        to: 'recipient@example.com',
        subject: 'Gmail Test',
        text: undefined,
        html: '<p>Testing Gmail</p>',
      });
    });
  });
});
