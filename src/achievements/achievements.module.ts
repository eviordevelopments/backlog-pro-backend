import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementTypeOrmEntity, UserAchievementTypeOrmEntity } from '@achievements/repository/entities/achievement.typeorm-entity';
import { AchievementRepository, UserAchievementRepository } from '@achievements/repository/achievement.repository';
import { AchievementMapper, UserAchievementMapper } from '@achievements/repository/mappers/achievement.mapper';
import { GetUserAchievementsQueryHandler } from '@achievements/application/queries/get-user-achievements.query-handler';
import { AchievementResolver } from '@achievements/resolvers/achievement.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([AchievementTypeOrmEntity, UserAchievementTypeOrmEntity])],
  providers: [
    AchievementRepository,
    UserAchievementRepository,
    AchievementMapper,
    UserAchievementMapper,
    GetUserAchievementsQueryHandler,
    AchievementResolver,
  ],
  exports: [AchievementRepository, UserAchievementRepository],
})
export class AchievementsModule {}
