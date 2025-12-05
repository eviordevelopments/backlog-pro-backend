import { Injectable } from '@nestjs/common';

import { UserAchievementResponseDto } from '../../dto/response/achievement.response.dto';
import {
  AchievementRepository,
  UserAchievementRepository,
} from '../../repository/achievement.repository';

import { GetUserAchievementsQuery } from './get-user-achievements.query';

@Injectable()
export class GetUserAchievementsQueryHandler {
  constructor(
    private readonly userAchievementRepository: UserAchievementRepository,
    private readonly achievementRepository: AchievementRepository,
  ) {}

  async handle(query: GetUserAchievementsQuery): Promise<UserAchievementResponseDto[]> {
    const userAchievements = await this.userAchievementRepository.getByUserId(query.userId);

    const results = [];
    for (const ua of userAchievements) {
      const achievement = await this.achievementRepository.getById(ua.getAchievementId());
      if (achievement) {
        results.push({
          id: ua.getId(),
          userId: ua.getUserId(),
          achievementId: ua.getAchievementId(),
          achievement: {
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
          },
          unlockedAt: ua.getUnlockedAt(),
          createdAt: ua.getCreatedAt(),
        });
      }
    }

    return results;
  }
}
