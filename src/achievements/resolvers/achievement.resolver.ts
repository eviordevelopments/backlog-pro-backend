import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { GetUserAchievementsQueryHandler } from '../application/queries/get-user-achievements.query-handler';
import { GetUserAchievementsQuery } from '../application/queries/get-user-achievements.query';
import {
  AchievementResponseDto,
  UserAchievementResponseDto,
} from '../dto/response/achievement.response.dto';
import { AchievementRepository } from '../repository/achievement.repository';

@Resolver('Achievement')
export class AchievementResolver {
  constructor(
    private readonly getUserAchievementsHandler: GetUserAchievementsQueryHandler,
    private readonly achievementRepository: AchievementRepository,
  ) {}

  @Query(() => [UserAchievementResponseDto])
  @UseGuards(JwtAuthGuard)
  async getUserAchievements(
    @CurrentUser() currentUser: { sub: string; email: string },
  ): Promise<UserAchievementResponseDto[]> {
    const query = new GetUserAchievementsQuery(currentUser.sub);
    return this.getUserAchievementsHandler.handle(query);
  }

  @Query(() => [AchievementResponseDto])
  @UseGuards(JwtAuthGuard)
  async getAvailableAchievements(): Promise<AchievementResponseDto[]> {
    const achievements = await this.achievementRepository.list();

    return achievements.map((a) => ({
      id: a.getId(),
      name: a.getName(),
      description: a.getDescription(),
      icon: a.getIcon(),
      category: a.getCategory(),
      points: a.getPoints(),
      rarity: a.getRarity(),
      requirement: a.getRequirement(),
      createdAt: a.getCreatedAt(),
      updatedAt: a.getUpdatedAt(),
    }));
  }
}
