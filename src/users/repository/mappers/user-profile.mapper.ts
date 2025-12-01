import { UserProfile } from '@users/domain/entities/user-profile.entity';
import { UserProfileTypeOrmEntity } from '@users/repository/entities/user-profile.typeorm-entity';

export class UserProfileMapper {
  static toDomain(raw: UserProfileTypeOrmEntity): UserProfile {
    return new UserProfile({
      id: raw.id,
      userId: raw.userId,
      name: raw.name,
      email: raw.email,
      avatar: raw.avatar,
      skills: raw.skills,
      hourlyRate: raw.hourlyRate,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
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
