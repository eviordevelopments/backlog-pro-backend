import { Injectable } from '@nestjs/common';

import { DeleteTimeCommandHandler } from '../commands/delete-time.command-handler';
import { DeleteTimeCommand } from '../commands/delete-time.command';
import { ModifyTimeCommandHandler } from '../commands/modify-time.command-handler';
import { ModifyTimeCommand } from '../commands/modify-time.command';
import { RegisterTimeCommandHandler } from '../commands/register-time.command-handler';
import { RegisterTimeCommand } from '../commands/register-time.command';
import { GetGroupedTimeEntriesQueryHandler } from '../queries/get-grouped-time-entries.query-handler';
import { GetGroupedTimeEntriesQuery } from '../queries/get-grouped-time-entries.query';
import { GetTimeEntriesQueryHandler } from '../queries/get-time-entries.query-handler';
import { GetTimeEntriesQuery } from '../queries/get-time-entries.query';

@Injectable()
export class TimeEntryService {
  constructor(
    private readonly registerTimeHandler: RegisterTimeCommandHandler,
    private readonly modifyTimeHandler: ModifyTimeCommandHandler,
    private readonly deleteTimeHandler: DeleteTimeCommandHandler,
    private readonly getTimeEntriesHandler: GetTimeEntriesQueryHandler,
    private readonly getGroupedTimeEntriesHandler: GetGroupedTimeEntriesQueryHandler,
  ) {}

  async registerTime(command: RegisterTimeCommand) {
    return this.registerTimeHandler.handle(command);
  }

  async modifyTime(command: ModifyTimeCommand) {
    return this.modifyTimeHandler.handle(command);
  }

  async deleteTime(command: DeleteTimeCommand) {
    return this.deleteTimeHandler.handle(command);
  }

  async getTimeEntries(query: GetTimeEntriesQuery) {
    return this.getTimeEntriesHandler.handle(query);
  }

  async getGroupedTimeEntries(query: GetGroupedTimeEntriesQuery) {
    return this.getGroupedTimeEntriesHandler.handle(query);
  }
}
