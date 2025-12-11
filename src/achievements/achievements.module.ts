import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GetUserAchievementsQueryHandler } from './application/queries/get-user-achievements.query-handler';
import {
    AchievementRepository,
    UserAchievementRepository,
} from './repository/achievement.repository';
import {
    AchievementTypeOrmEntity,
    UserAchievementTypeOrmEntity,
} from './repository/entities/achievement.typeorm-entity';
import { AchievementMapper, UserAchievementMapper } from './repository/mappers/achievement.mapper';
import { AchievementResolver } from './resolvers/achievement.resolver';

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
