import { Injectable, Logger } from '@nestjs/common';
import { DeleteProjectCommand } from '@projects/application/commands/delete-project.command';
import { ProjectNotFoundException } from '@projects/domain/exceptions';
import { ProjectRepository } from '@projects/repository/project.repository';

@Injectable()
export class DeleteProjectCommandHandler {
  private readonly logger = new Logger(DeleteProjectCommandHandler.name);

  constructor(private readonly projectRepository: ProjectRepository) {}

  async handle(command: DeleteProjectCommand): Promise<void> {
    this.logger.log(`Eliminando proyecto: ${command.projectId}`);

    // Verificar que el proyecto existe
    const project = await this.projectRepository.getById(command.projectId);
    if (!project) {
      throw new ProjectNotFoundException(command.projectId);
    }

    // Eliminar proyecto (soft delete)
    await this.projectRepository.delete(command.projectId);
    this.logger.log(`Proyecto eliminado: ${command.projectId}`);
  }
}
