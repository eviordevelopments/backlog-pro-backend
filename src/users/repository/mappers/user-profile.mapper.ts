import { UserProfile } from '@users/domain/entities/user-profile.entity';
import { UserProfileTypeOrmEntity } from '@users/repository/entities/user-profile.typeorm-entity';

export class UserProfileMapper {
  static toDomain(raw: UserProfileTypeOrmEntity): UserProfile {
    return new UserProfile(
      raw.userId,
      raw.name,
      raw.email,
      raw.avatar,
      raw.skills,
      raw.hourlyRate,
      raw.id,
      raw.createdAt,
      raw.updatedAt,
      raw.deletedAt,
    );
  }

  static toPersistence(userProfile: UserProfile): UserProfileTypeOrmEntity {
    const entity = new UserProfileTypeOrmEntity();
    entity.id = userProfile.id;
    entity.userId = userProfile.userId;
    entity.name = userProfile.name;
    entity.email = userProfile.email;
    entity.avatar = userProfile.avatar;
    entity.skills = userProfile.skills;
    entity.hourlyRate = userProfile.hourlyRate;
    entity.createdAt = userProfile.createdAt;
    entity.updatedAt = userProfile.updatedAt;
    entity.deletedAt = userProfile.deletedAt;
    return entity;
  }
}
