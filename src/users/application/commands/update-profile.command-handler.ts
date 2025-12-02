import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { UpdateProfileCommand } from '@users/application/commands/update-profile.command';
import { UserProfile } from '@users/domain/entities/user-profile.entity';
import { HourlyRate } from '@users/domain/value-objects/hourly-rate.vo';
import { UserProfileNotFoundException } from '@users/domain/exceptions';
import { UserProfileRepository } from '@users/repository/user-profile.repository';

@Injectable()
export class UpdateProfileCommandHandler {
  private readonly logger = new Logger(UpdateProfileCommandHandler.name);

  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async handle(command: UpdateProfileCommand): Promise<UserProfile> {
    this.logger.log(`Actualizando perfil del usuario: ${command.userId}`);

    // Obtener perfil actual
    const userProfile = await this.userProfileRepository.getByUserId(command.userId);
    if (!userProfile) {
      throw new UserProfileNotFoundException(command.userId);
    }

    // Validar tarifa horaria si se proporciona
    if (command.hourlyRate !== undefined) {
      new HourlyRate(command.hourlyRate);
    }

    // Actualizar perfil
    const updateData: Partial<UserProfile> = {};
    if (command.name !== undefined) updateData.name = command.name;
    if (command.skills !== undefined) updateData.skills = command.skills;
    if (command.hourlyRate !== undefined) updateData.hourlyRate = command.hourlyRate;

    const updatedProfile = await this.userProfileRepository.update(command.userId, updateData);
    this.logger.log(`Perfil del usuario actualizado: ${command.userId}`);

    return updatedProfile;
  }
}
