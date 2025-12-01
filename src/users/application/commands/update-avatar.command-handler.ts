import { Injectable, Logger } from '@nestjs/common';
import { UpdateAvatarCommand } from '@users/application/commands/update-avatar.command';
import { UserProfile } from '@users/domain/entities/user-profile.entity';
import { UserProfileNotFoundException } from '@users/domain/exceptions';
import { InvalidAvatarUrlException } from '@users/domain/exceptions/invalid-avatar-url.exception';
import { UserProfileRepository } from '@users/repository/user-profile.repository';

@Injectable()
export class UpdateAvatarCommandHandler {
  private readonly logger = new Logger(UpdateAvatarCommandHandler.name);

  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async handle(command: UpdateAvatarCommand): Promise<UserProfile> {
    this.logger.log(`Actualizando avatar del usuario: ${command.userId}`);

    // Obtener perfil actual
    const userProfile = await this.userProfileRepository.getByUserId(command.userId);
    if (!userProfile) {
      throw new UserProfileNotFoundException(command.userId);
    }

    // Validar formato de URL
    this.validateAvatarUrl(command.avatarUrl);

    // Actualizar avatar
    const updatedProfile = await this.userProfileRepository.update(command.userId, {
      avatar: command.avatarUrl,
    });

    this.logger.log(`Avatar del usuario actualizado: ${command.userId}`);

    return updatedProfile;
  }

  private validateAvatarUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new InvalidAvatarUrlException(url);
    }
  }
}
