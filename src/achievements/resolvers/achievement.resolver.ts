import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { CurrentUser } from '@shared/decorators/current-user.decorator';
import { GetUserAchievementsQueryHandler } from '@achievements/application/queries/get-user-achievements.query-handler';
import { GetUserAchievementsQuery } from '@achievements/application/queries/get-user-achievements.query';
import { AchievementRepository } from '@achievements/repository/achievement.repository';
import { AchievementResponseDto, UserAchievementResponseDto } from '@achievements/dto/response/achievement.response.dto';

@Resolver('Achievement')
export class AchievementResolver {
  constructor(
    private readonly getUserAchievementsHandler: GetUserAchievementsQueryHandler,
    private readonly achievementRepository: AchievementRepository,
  ) {}

  @Query(() => [UserAchievementResponseDto])
  @UseGuards(JwtAuthGuard)
  async getUserAchievements(
    @CurrentUser() currentUser: any
  ): Promise<UserAchievementResponseDto[]> {
    const query = new GetUserAchievementsQuery(currentUser.id);
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
