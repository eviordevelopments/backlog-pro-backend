import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { InvalidBudgetException } from '../../domain/exceptions/invalid-budget.exception';
import { ProjectNotFoundException } from '../../domain/exceptions/project-not-found.exception';
import { ClientRepository } from '../../../clients/repository/client.repository';
import { ProjectMember } from '../../domain/entities/project-member.entity';
import { Project } from '../../domain/entities/project.entity';
import { UserAlreadyMemberException } from '../../domain/exceptions/user-already-member.exception';
import { ProjectMemberRepository } from '../../repository/project-member.repository';
import { ProjectRepository } from '../../repository/project.repository';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectMemberRepository: ProjectMemberRepository,
    private readonly clientRepository: ClientRepository,
  ) {}

  async createProject(
    name: string,
    clientId: string,
    description?: string,
    budget?: number,
  ): Promise<Project> {
    this.logger.log(`Creando proyecto: ${name}`);

    // Validate that the client exists
    const client = await this.clientRepository.getById(clientId);
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    if (budget !== undefined && budget < 0) {
      throw new InvalidBudgetException(budget);
    }

    const project = new Project({
      id: uuidv4(),
      name,
      clientId,
      description,
      budget: budget || 0,
      spent: 0,
      status: 'planning',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.projectRepository.create(project);
  }

  async getProject(projectId: string): Promise<Project> {
    this.logger.log(`Obteniendo proyecto: ${projectId}`);

    const project = await this.projectRepository.getById(projectId);
    if (!project) {
      throw new ProjectNotFoundException(projectId);
    }

    return project;
  }

  async listProjects(clientId?: string): Promise<Project[]> {
    this.logger.log(`Listando proyectos${clientId ? ` del cliente: ${clientId}` : ''}`);

    return this.projectRepository.list({
      clientId,
      status: undefined,
    });
  }

  async updateProject(projectId: string, data: Partial<Project>): Promise<Project> {
    this.logger.log(`Actualizando proyecto: ${projectId}`);

    await this.getProject(projectId);

    if (data.budget !== undefined && data.budget < 0) {
      throw new InvalidBudgetException(data.budget);
    }

    return this.projectRepository.update(projectId, data);
  }

  async deleteProject(projectId: string): Promise<void> {
    this.logger.log(`Eliminando proyecto: ${projectId}`);

    await this.getProject(projectId);
    await this.projectRepository.delete(projectId);
  }

  async addMember(
    projectId: string,
    userId: string,
    role: string = 'developer',
  ): Promise<ProjectMember> {
    this.logger.log(`Agregando miembro ${userId} al proyecto ${projectId} con rol ${role}`);

    await this.getProject(projectId);

    const exists = await this.projectMemberRepository.existsByProjectAndUser(projectId, userId);
    if (exists) {
      throw new UserAlreadyMemberException(userId, projectId);
    }

    const member = new ProjectMember({
      id: uuidv4(),
      projectId,
      userId,
      role,
      joinedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.projectMemberRepository.create(member);
  }

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    this.logger.log(`Obteniendo miembros del proyecto: ${projectId}`);

    await this.getProject(projectId);
    return this.projectMemberRepository.listByProject(projectId);
  }
}
