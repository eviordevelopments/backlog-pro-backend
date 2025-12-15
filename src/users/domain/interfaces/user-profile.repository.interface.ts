import type { UserProfile } from '../entities/user-profile.entity';

export interface IUserProfileRepository {
  create(userProfile: UserProfile): Promise<UserProfile>;
  getByUserId(userId: string): Promise<UserProfile | null>;
  update(userId: string, userProfile: Partial<UserProfile>): Promise<UserProfile>;
  list(): Promise<UserProfile[]>;
  getWorkedHoursByUserId(userId: string): Promise<number>;
  getWorkedHoursByUserIdAndProject(userId: string, projectId: string): Promise<number>;
}
