import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UpdateAvatarCommandHandler } from './application/commands/update-avatar.command-handler';
import { UpdateProfileCommandHandler } from './application/commands/update-profile.command-handler';
import { GetProfileQueryHandler } from './application/queries/get-profile.query-handler';
import { GetWorkedHoursQueryHandler } from './application/queries/get-worked-hours.query-handler';
import { UserProfileTypeOrmEntity } from './repository/entities/user-profile.typeorm-entity';
import { UserProfileRepository } from './repository/user-profile.repository';
import { UserResolver } from './resolvers/user.resolver';

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
