import { Injectable } from '@nestjs/common';

import { UserProfile } from '../../domain/entities/user-profile.entity';
import { UserProfileRepository } from '../../repository/user-profile.repository';
import { ListAllUsersQuery } from './list-all-users.query';

@Injectable()
export class ListAllUsersQueryHandler {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async handle(_query: ListAllUsersQuery): Promise<UserProfile[]> {
    return this.userProfileRepository.list();
  }
}
