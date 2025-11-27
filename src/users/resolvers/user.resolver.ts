import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { UpdateProfileDto } from '../dto/request/update-profile.dto';
import { UpdateAvatarDto } from '../dto/request/update-avatar.dto';
import { UserProfileResponseDto } from '../dto/response/user-profile.response.dto';
import { WorkedHoursResponseDto } from '../dto/response/worked-hours.response.dto';
import { GetProfileQueryHandler } from '../application/queries/get-profile.query-handler';
import { GetWorkedHoursQueryHandler } from '../application/queries/get-worked-hours.query-handler';
import { UpdateProfileCommandHandler } from '../application/commands/update-profile.command-handler';
import { UpdateAvatarCommandHandler } from '../application/commands/update-avatar.command-handler';
import { GetProfileQuery } from '../application/queries/get-profile.query';
import { GetWorkedHoursQuery } from '../application/queries/get-worked-hours.query';
import { UpdateProfileCommand } from '../application/commands/update-profile.command';
import { UpdateAvatarCommand } from '../application/commands/update-avatar.command';

@Resolver()
@UseGuards(JwtAuthGuard)
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);

  constructor(
    private readonly getProfileQueryHandler: GetProfileQueryHandler,
    private readonly getWorkedHoursQueryHandler: GetWorkedHoursQueryHandler,
    private readonly updateProfileCommandHandler: UpdateProfileCommandHandler,
    private readonly updateAvatarCommandHandler: UpdateAvatarCommandHandler,
  ) {}

  @Query(() => UserProfileResponseDto, {
    description: 'Obtiene el perfil del usuario autenticado',
  })
  async getProfile(
    @CurrentUser() currentUser: CurrentUserPayload,
  ): Promise<UserProfileResponseDto> {
    const userId = currentUser.sub;
    this.logger.log(`Obteniendo perfil del usuario: ${userId}`);
    const query = new GetProfileQuery(userId);
    const userProfile = await this.getProfileQueryHandler.handle(query);

    return {
      id: userProfile.id,
      userId: userProfile.userId,
      name: userProfile.name,
      email: userProfile.email,
      avatar: userProfile.avatar,
      skills: userProfile.skills,
      hourlyRate: userProfile.hourlyRate,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
    };
  }

  @Query(() => WorkedHoursResponseDto, {
    description: 'Obtiene las horas trabajadas del usuario autenticado',
  })
  async getWorkedHours(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Args('projectId', { nullable: true }) projectId?: string,
  ): Promise<WorkedHoursResponseDto> {
    const userId = currentUser.sub;
    this.logger.log(`Obteniendo horas trabajadas del usuario: ${userId}`);
    const query = new GetWorkedHoursQuery(userId, projectId);
    return this.getWorkedHoursQueryHandler.handle(query);
  }

  @Mutation(() => UserProfileResponseDto, {
    description: 'Actualiza el perfil del usuario autenticado',
  })
  async updateProfile(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Args('input') input: UpdateProfileDto,
  ): Promise<UserProfileResponseDto> {
    const userId = currentUser.sub;
    this.logger.log(`Actualizando perfil del usuario: ${userId}`);
    const command = new UpdateProfileCommand(userId, input.name, input.skills, input.hourlyRate);
    const userProfile = await this.updateProfileCommandHandler.handle(command);

    return {
      id: userProfile.id,
      userId: userProfile.userId,
      name: userProfile.name,
      email: userProfile.email,
      avatar: userProfile.avatar,
      skills: userProfile.skills,
      hourlyRate: userProfile.hourlyRate,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
    };
  }

  @Mutation(() => UserProfileResponseDto, {
    description: 'Actualiza el avatar del usuario autenticado',
  })
  async updateAvatar(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Args('input') input: UpdateAvatarDto,
  ): Promise<UserProfileResponseDto> {
    const userId = currentUser.sub;
    this.logger.log(`Actualizando avatar del usuario: ${userId}`);
    const command = new UpdateAvatarCommand(userId, input.avatarUrl);
    const userProfile = await this.updateAvatarCommandHandler.handle(command);

    return {
      id: userProfile.id,
      userId: userProfile.userId,
      name: userProfile.name,
      email: userProfile.email,
      avatar: userProfile.avatar,
      skills: userProfile.skills,
      hourlyRate: userProfile.hourlyRate,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
    };
  }
}
