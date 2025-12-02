import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntryTypeOrmEntity } from '@time-entries/repository/entities/time-entry.typeorm-entity';
import { TimeEntryRepository } from '@time-entries/repository/time-entry.repository';
import { TimeEntryMapper } from '@time-entries/repository/mappers/time-entry.mapper';
import { RegisterTimeCommandHandler } from '@time-entries/application/commands/register-time.command-handler';
import { ModifyTimeCommandHandler } from '@time-entries/application/commands/modify-time.command-handler';
import { DeleteTimeCommandHandler } from '@time-entries/application/commands/delete-time.command-handler';
import { GetTimeEntriesQueryHandler } from '@time-entries/application/queries/get-time-entries.query-handler';
import { GetGroupedTimeEntriesQueryHandler } from '@time-entries/application/queries/get-grouped-time-entries.query-handler';
import { TimeEntryService } from '@time-entries/application/services/time-entry.service';
import { TimeEntryResolver } from '@time-entries/resolvers/time-entry.resolver';
import { TasksModule } from '@tasks/tasks.module';

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
