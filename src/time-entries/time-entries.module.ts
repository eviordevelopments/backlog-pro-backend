import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksModule } from '../tasks/tasks.module';

import { DeleteTimeCommandHandler } from './application/commands/delete-time.command-handler';
import { ModifyTimeCommandHandler } from './application/commands/modify-time.command-handler';
import { RegisterTimeCommandHandler } from './application/commands/register-time.command-handler';
import { GetGroupedTimeEntriesQueryHandler } from './application/queries/get-grouped-time-entries.query-handler';
import { GetTimeEntriesQueryHandler } from './application/queries/get-time-entries.query-handler';
import { TimeEntryService } from './application/services/time-entry.service';
import { TimeEntryTypeOrmEntity } from './repository/entities/time-entry.typeorm-entity';
import { TimeEntryMapper } from './repository/mappers/time-entry.mapper';
import { TimeEntryRepository } from './repository/time-entry.repository';
import { TimeEntryResolver } from './resolvers/time-entry.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEntryTypeOrmEntity]), TasksModule],
  providers: [
    TimeEntryMapper,
    TimeEntryRepository,
    RegisterTimeCommandHandler,
    ModifyTimeCommandHandler,
    DeleteTimeCommandHandler,
    GetTimeEntriesQueryHandler,
    GetGroupedTimeEntriesQueryHandler,
    TimeEntryService,
    TimeEntryResolver,
  ],
  exports: [TimeEntryService, TimeEntryRepository],
})
export class TimeEntriesModule {}
