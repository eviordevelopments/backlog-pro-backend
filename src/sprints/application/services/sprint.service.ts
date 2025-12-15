import { Injectable } from '@nestjs/common';
import {
  CreateSprintCommandHandler,
  UpdateSprintCommandHandler,
  ExtendSprintCommandHandler,
  CompleteSprintCommandHandler,
  DeleteSprintCommandHandler,
  RegisterRetrospectiveCommandHandler,
  CreateSprintCommand,
  UpdateSprintCommand,
  ExtendSprintCommand,
  CompleteSprintCommand,
  RegisterRetrospectiveCommand,
  DeleteSprintCommand,
} from '../commands';
import { GetSprintQuery } from '../queries/get-sprint.query';
import { GetSprintQueryHandler } from '../queries/get-sprint.query-handler';
import { ListSprintsProjectQuery } from '../queries/list-sprints-project.query';
import { ListSprintsProjectQueryHandler } from '../queries/list-sprints-project.query-handler';

@Injectable()
export class SprintService {
  constructor(
    private readonly createSprintHandler: CreateSprintCommandHandler,
    private readonly updateSprintHandler: UpdateSprintCommandHandler,
    private readonly extendSprintHandler: ExtendSprintCommandHandler,
    private readonly completeSprintHandler: CompleteSprintCommandHandler,
    private readonly deleteSprintHandler: DeleteSprintCommandHandler,
    private readonly registerRetrospectiveHandler: RegisterRetrospectiveCommandHandler,
    private readonly getSprintHandler: GetSprintQueryHandler,
    private readonly listSprintsHandler: ListSprintsProjectQueryHandler,
  ) {}

  async createSprint(command: CreateSprintCommand) {
    return this.createSprintHandler.handle(command);
  }

  async updateSprint(command: UpdateSprintCommand) {
    return this.updateSprintHandler.handle(command);
  }

  async extendSprint(command: ExtendSprintCommand) {
    return this.extendSprintHandler.handle(command);
  }

  async completeSprint(command: CompleteSprintCommand) {
    return this.completeSprintHandler.handle(command);
  }

  async registerRetrospective(command: RegisterRetrospectiveCommand) {
    return this.registerRetrospectiveHandler.handle(command);
  }

  async getSprint(query: GetSprintQuery) {
    return this.getSprintHandler.handle(query);
  }

  async listSprintsByProject(query: ListSprintsProjectQuery) {
    return this.listSprintsHandler.handle(query);
  }

  async deleteSprint(command: DeleteSprintCommand) {
    return this.deleteSprintHandler.handle(command);
  }
}
