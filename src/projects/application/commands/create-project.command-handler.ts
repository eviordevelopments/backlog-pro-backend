import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Project } from '../../domain/entities/project.entity';
import { Budget } from '../../domain/value-objects/budget.vo';
import { ProjectRepository } from '../../repository/project.repository';

import { CreateProjectCommand } from './create-project.command';

@Injectable()
export class CreateProjectCommandHandler {
  private readonly logger = new Logger(CreateProjectCommandHandler.name);

  constructor(private readonly projectRepository: ProjectRepository) {}

  async handle(command: CreateProjectCommand): Promise<Project> {
    this.logger.log(`Creando proyecto: ${command.name}`);

    // Validar presupuesto si se proporciona
    if (command.budget !== undefined) {
      new Budget(command.budget);
    }

    // Crear proyecto
    const project = new Project({
      id: uuidv4(),
      name: command.name,
      clientId: command.clientId,
      description: command.description,
      methodology: command.methodology,
      budget: command.budget || 0,
      spent: 0,
      startDate: command.startDate,
      endDate: command.endDate,
      status: 'planning',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createdProject = await this.projectRepository.create(project);
    this.logger.log(`Proyecto creado exitosamente: ${createdProject.id}`);

    return createdProject;
  }
}
