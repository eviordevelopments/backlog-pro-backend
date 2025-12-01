export class User {
  id!: string;
  email!: string;
  passwordHash!: string;
  name!: string;
  avatar?: string;
  skills?: string[];
  hourlyRate?: number;
  isEmailVerified!: boolean;
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
}
