import { Injectable } from '@nestjs/common';
import { Achievement, UserAchievement } from '@achievements/domain/entities/achievement.entity';
import { AchievementTypeOrmEntity, UserAchievementTypeOrmEntity } from '@achievements/repository/entities/achievement.typeorm-entity';

@Injectable()
export class AchievementMapper {
  toDomain(raw: AchievementTypeOrmEntity): Achievement {
    return new Achievement(
      raw.name,
      raw.description,
      raw.icon,
      raw.category,
      raw.points,
      raw.rarity,
      raw.requirement,
      raw.id,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  toPersistence(achievement: Achievement): Partial<AchievementTypeOrmEntity> {
    return {
      id: achievement.getId(),
      name: achievement.getName(),
      description: achievement.getDescription(),
      icon: achievement.getIcon(),
      category: achievement.getCategory(),
      points: achievement.getPoints(),
      rarity: achievement.getRarity(),
      requirement: achievement.getRequirement(),
      createdAt: achievement.getCreatedAt(),
      updatedAt: achievement.getUpdatedAt(),
    };
  }
}

@Injectable()
export class UserAchievementMapper {
  toDomain(raw: UserAchievementTypeOrmEntity): UserAchievement {
    return new UserAchievement(
      raw.userId,
      raw.achievementId,
      raw.unlockedAt,
      raw.id,
      raw.createdAt,
    );
  }

  toPersistence(userAchievement: UserAchievement): Partial<UserAchievementTypeOrmEntity> {
    return {
      id: userAchievement.getId(),
      userId: userAchievement.getUserId(),
      achievementId: userAchievement.getAchievementId(),
      unlockedAt: userAchievement.getUnlockedAt(),
      createdAt: userAchievement.getCreatedAt(),
    };
  }
}
