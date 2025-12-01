import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileTypeOrmEntity } from '@users/repository/entities/user-profile.typeorm-entity';
import { UserProfileRepository } from '@users/repository/user-profile.repository';
import { GetProfileQueryHandler } from '@users/application/queries/get-profile.query-handler';
import { GetWorkedHoursQueryHandler } from '@users/application/queries/get-worked-hours.query-handler';
import { UpdateProfileCommandHandler } from '@users/application/commands/update-profile.command-handler';
import { UpdateAvatarCommandHandler } from '@users/application/commands/update-avatar.command-handler';
import { UserResolver } from '@users/resolvers/user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfileTypeOrmEntity])],
  providers: [
    UserProfileRepository,
    GetProfileQueryHandler,
    GetWorkedHoursQueryHandler,
    UpdateProfileCommandHandler,
    UpdateAvatarCommandHandler,
    UserResolver,
  ],
  exports: [UserProfileRepository],
})
export class UsersModule {}
