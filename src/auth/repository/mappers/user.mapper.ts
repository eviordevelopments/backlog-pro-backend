import { User } from '../../domain/entities/user.entity';
import { UserTypeOrmEntity } from '../entities/user.typeorm-entity';

export class UserMapper {
  static toDomain(raw: UserTypeOrmEntity): User {
    return new User({
      id: raw.id,
      email: raw.email,
      passwordHash: raw.passwordHash,
      name: raw.name,
      avatar: raw.avatar,
      skills: raw.skills,
      hourlyRate: raw.hourlyRate,
      isEmailVerified: raw.isEmailVerified,
      emailConfirmationToken: raw.emailConfirmationToken,
      emailConfirmationExpiresAt: raw.emailConfirmationExpiresAt,
      passwordResetToken: raw.passwordResetToken,
      passwordResetExpiresAt: raw.passwordResetExpiresAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPersistence(user: User): UserTypeOrmEntity {
    const entity = new UserTypeOrmEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.passwordHash = user.passwordHash;
    entity.name = user.name;
    entity.avatar = user.avatar;
    entity.skills = user.skills;
    entity.hourlyRate = user.hourlyRate;
    entity.isEmailVerified = user.isEmailVerified;
    entity.emailConfirmationToken = user.emailConfirmationToken;
    entity.emailConfirmationExpiresAt = user.emailConfirmationExpiresAt;
    entity.passwordResetToken = user.passwordResetToken;
    entity.passwordResetExpiresAt = user.passwordResetExpiresAt;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    entity.deletedAt = user.deletedAt;
    return entity;
  }
}
