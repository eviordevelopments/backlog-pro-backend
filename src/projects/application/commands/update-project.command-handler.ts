import { Injectable, Logger } from '@nestjs/common';

import { ProjectNotFoundException } from '../../domain/exceptions/project-not-found.exception';
import { Project } from '../../domain/entities/project.entity';
import { InvalidProgressException } from '../../domain/exceptions/invalid-progress.exception';
import { Budget } from '../../domain/value-objects/budget.vo';
import { ProjectStatus } from '../../domain/value-objects/project-status.vo';
import { ProjectRepository } from '../../repository/project.repository';
import { UpdateProjectCommand } from './update-project.command';

@Injectable()
export class UpdateProjectCommandHandler {
  private readonly logger = new Logger(UpdateProjectCommandHandler.name);

  constructor(private readonly projectRepository: ProjectRepository) {}

  async handle(command: UpdateProjectCommand): Promise<Project> {
    this.logger.log(`Actualizando proyecto: ${command.projectId}`);

    // Obtener proyecto actual
    const project = await this.projectRepository.getById(command.projectId);
    if (!project) {
      throw new ProjectNotFoundException(command.projectId);
    }

    // Validar presupuesto si se proporciona
    if (command.budget !== undefined) {
      new Budget(command.budget);
    }

    // Validar estado si se proporciona
    if (command.status !== undefined) {
      ProjectStatus.create(command.status);
    }

    // Validar progreso si se proporciona
    if (command.progress !== undefined) {
      if (command.progress < 0 || command.progress > 100) {
        throw new InvalidProgressException(command.progress);
      }
    }

    // Actualizar proyecto
    const updateData: Partial<Project> = {};
    if (command.name !== undefined) updateData.name = command.name;
    if (command.description !== undefined) updateData.description = command.description;
    if (command.methodology !== undefined) updateData.methodology = command.methodology;
    if (command.budget !== undefined) updateData.budget = command.budget;
    if (command.status !== undefined) updateData.status = command.status;
    if (command.progress !== undefined) updateData.progress = command.progress;
    if (command.startDate !== undefined) updateData.startDate = command.startDate;
    if (command.endDate !== undefined) updateData.endDate = command.endDate;

    const updatedProject = await this.projectRepository.update(command.projectId, updateData);
    this.logger.log(`Proyecto actualizado: ${command.projectId}`);

    return updatedProject;
  }
}
