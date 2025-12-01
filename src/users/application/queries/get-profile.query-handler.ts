import { Injectable, Logger } from '@nestjs/common';
import { GetProfileQuery } from '@users/application/queries/get-profile.query';
import { UserProfile } from '@users/domain/entities/user-profile.entity';
import { UserProfileNotFoundException } from '@users/domain/exceptions';
import { UserProfileRepository } from '@users/repository/user-profile.repository';

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
