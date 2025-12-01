import { Injectable } from '@nestjs/common';
import { CreateSprintCommandHandler } from '@sprints/application/commands/create-sprint.command-handler';
import { UpdateSprintCommandHandler } from '@sprints/application/commands/update-sprint.command-handler';
import { ExtendSprintCommandHandler } from '@sprints/application/commands/extend-sprint.command-handler';
import { CompleteSprintCommandHandler } from '@sprints/application/commands/complete-sprint.command-handler';
import { RegisterRetrospectiveCommandHandler } from '@sprints/application/commands/register-retrospective.command-handler';
import { GetSprintQueryHandler } from '@sprints/application/queries/get-sprint.query-handler';
import { ListSprintsProjectQueryHandler } from '@sprints/application/queries/list-sprints-project.query-handler';

@Injectable()
export class SprintService {
  constructor(
    private readonly createSprintHandler: CreateSprintCommandHandler,
    private readonly updateSprintHandler: UpdateSprintCommandHandler,
    private readonly extendSprintHandler: ExtendSprintCommandHandler,
    private readonly completeSprintHandler: CompleteSprintCommandHandler,
    private readonly registerRetrospectiveHandler: RegisterRetrospectiveCommandHandler,
    private readonly getSprintHandler: GetSprintQueryHandler,
    private readonly listSprintsHandler: ListSprintsProjectQueryHandler,
  ) {}

  async createSprint(command: any) {
    return this.createSprintHandler.handle(command);
  }

  async updateSprint(command: any) {
    return this.updateSprintHandler.handle(command);
  }

  async extendSprint(command: any) {
    return this.extendSprintHandler.handle(command);
  }

  async completeSprint(command: any) {
    return this.completeSprintHandler.handle(command);
  }

  async registerRetrospective(command: any) {
    return this.registerRetrospectiveHandler.handle(command);
  }

  async getSprint(query: any) {
    return this.getSprintHandler.handle(query);
  }

  async listSprintsByProject(query: any) {
    return this.listSprintsHandler.handle(query);
  }
}
