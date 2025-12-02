import { Achievement, UserAchievement } from '@achievements/domain/entities/achievement.entity';

export interface IAchievementRepository {
  create(achievement: Achievement): Promise<Achievement>;
  getById(id: string): Promise<Achievement | null>;
  list(): Promise<Achievement[]>;
}

export interface IUserAchievementRepository {
  create(userAchievement: UserAchievement): Promise<UserAchievement>;
  getByUserId(userId: string): Promise<UserAchievement[]>;
  getByUserAndAchievement(userId: string, achievementId: string): Promise<UserAchievement | null>;
  list(): Promise<UserAchievement[]>;
}
