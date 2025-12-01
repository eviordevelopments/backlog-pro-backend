import { Injectable } from '@nestjs/common';
import { RegisterTimeCommandHandler } from '@time-entries/application/commands/register-time.command-handler';
import { ModifyTimeCommandHandler } from '@time-entries/application/commands/modify-time.command-handler';
import { DeleteTimeCommandHandler } from '@time-entries/application/commands/delete-time.command-handler';
import { GetTimeEntriesQueryHandler } from '@time-entries/application/queries/get-time-entries.query-handler';
import { GetGroupedTimeEntriesQueryHandler } from '@time-entries/application/queries/get-grouped-time-entries.query-handler';

@Injectable()
export class TimeEntryService {
  constructor(
    private readonly registerTimeHandler: RegisterTimeCommandHandler,
    private readonly modifyTimeHandler: ModifyTimeCommandHandler,
    private readonly deleteTimeHandler: DeleteTimeCommandHandler,
    private readonly getTimeEntriesHandler: GetTimeEntriesQueryHandler,
    private readonly getGroupedTimeEntriesHandler: GetGroupedTimeEntriesQueryHandler,
  ) {}

  async registerTime(command: any) {
    return this.registerTimeHandler.handle(command);
  }

  async modifyTime(command: any) {
    return this.modifyTimeHandler.handle(command);
  }

  async deleteTime(command: any) {
    return this.deleteTimeHandler.handle(command);
  }

  async getTimeEntries(query: any) {
    return this.getTimeEntriesHandler.handle(query);
  }

  async getGroupedTimeEntries(query: any) {
    return this.getGroupedTimeEntriesHandler.handle(query);
  }
}
