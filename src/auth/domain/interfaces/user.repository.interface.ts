import { User } from "@auth/domain/entities/user.entity";

export interface IUserRepository {
  create(user: User): Promise<User>;
  getByEmail(email: string): Promise<User | null>;
  getById(id: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
}
