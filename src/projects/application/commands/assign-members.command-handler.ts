import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AssignMembersCommand } from './assign-members.command';
import { ProjectMember } from '../../domain/entities/project-member.entity';
import { ProjectNotFoundException } from '../../domain/exceptions';
import { ProjectRepository } from '../../repository/project.repository';
import { ProjectMemberRepository } from '../../repository/project-member.repository';

@Injectable()
export class AssignMembersCommandHandler {
  private readonly logger = new Logger(AssignMembersCommandHandler.name);

  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectMemberRepository: ProjectMemberRepository,
  ) {}

  async handle(command: AssignMembersCommand): Promise<ProjectMember[]> {
    this.logger.log(`Asignando miembros al proyecto: ${command.projectId}`);

    // Verificar que el proyecto existe
    const project = await this.projectRepository.getById(command.projectId);
    if (!project) {
      throw new ProjectNotFoundException(command.projectId);
    }

    // Asignar miembros
    const assignedMembers: ProjectMember[] = [];

    for (const member of command.members) {
      // Verificar si el miembro ya existe
      const existingMember = await this.projectMemberRepository.getByProjectAndUser(
        command.projectId,
        member.userId,
      );

      if (existingMember) {
        // Actualizar rol si ya existe
        const updated = await this.projectMemberRepository.update(existingMember.id, {
          role: member.role,
        });
        assignedMembers.push(updated);
      } else {
        // Crear nuevo miembro
        const projectMember = new ProjectMember({
          id: uuidv4(),
          projectId: command.projectId,
          userId: member.userId,
          role: member.role,
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const created = await this.projectMemberRepository.create(projectMember);
        assignedMembers.push(created);
      }
    }

    this.logger.log(
      `${assignedMembers.length} miembros asignados al proyecto: ${command.projectId}`,
    );

    return assignedMembers;
  }
}
