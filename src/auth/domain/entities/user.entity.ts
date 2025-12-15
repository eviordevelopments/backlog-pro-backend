import { randomBytes } from 'crypto';

export class User {
  id!: string;
  email!: string;
  passwordHash!: string;
  name!: string;
  avatar?: string;
  skills?: string[];
  hourlyRate?: number;
  isEmailVerified!: boolean;
  emailConfirmationToken?: string;
  emailConfirmationExpiresAt?: Date;
  passwordResetToken?: string;
  passwordResetExpiresAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }

  isPasswordResetTokenValid(): boolean {
    if (!this.passwordResetToken || !this.passwordResetExpiresAt) {
      return false;
    }
    return this.passwordResetExpiresAt > new Date();
  }

  isEmailConfirmationTokenValid(): boolean {
    if (!this.emailConfirmationToken || !this.emailConfirmationExpiresAt) {
      return false;
    }
    return this.emailConfirmationExpiresAt > new Date();
  }

  generateEmailConfirmationToken(): string {
    const token = randomBytes(32).toString('hex');
    this.emailConfirmationToken = token;
    this.emailConfirmationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
    return token;
  }

  confirmEmail(): void {
    this.isEmailVerified = true;
    this.emailConfirmationToken = undefined;
    this.emailConfirmationExpiresAt = undefined;
  }
}
