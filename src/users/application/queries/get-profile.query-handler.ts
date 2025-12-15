import { Injectable, Logger } from '@nestjs/common';

import { UserProfile } from '../../domain/entities/user-profile.entity';
import { UserProfileNotFoundException } from '../../domain/exceptions/user-profile-not-found.exception';
import { UserProfileRepository } from '../../repository/user-profile.repository';

import { GetProfileQuery } from './get-profile.query';

@Injectable()
export class GetProfileQueryHandler {
  private readonly logger = new Logger(GetProfileQueryHandler.name);

  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async handle(query: GetProfileQuery): Promise<UserProfile> {
    this.logger.log(`Obteniendo perfil del usuario: ${query.userId}`);

    const userProfile = await this.userProfileRepository.getByUserId(query.userId);
    if (!userProfile) {
      throw new UserProfileNotFoundException(query.userId);
    }

    return userProfile;
  }
}
