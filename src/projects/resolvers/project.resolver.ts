import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { CreateProjectDto } from '../dto/request/create-project.dto';
import { UpdateProjectDto } from '../dto/request/update-project.dto';
import { AddMemberDto } from '../dto/request/add-member.dto';
import { ProjectResponseDto } from '../dto/response/project.response.dto';
import { ProjectMemberResponseDto } from '../dto/response/project-member.response.dto';
import { ProjectService } from '../application/services/project.service';
import { Project } from '../domain/entities/project.entity';
import { ProjectMember } from '../domain/entities/project-member.entity';

@Resolver()
@UseGuards(JwtAuthGuard)
export class ProjectResolver {
  private readonly logger = new Logger(ProjectResolver.name);

  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => ProjectResponseDto, {
    description: 'Crea un nuevo proyecto',
  })
  async createProject(@Args('input') input: CreateProjectDto): Promise<ProjectResponseDto> {
    this.logger.log(`Creando proyecto: ${input.name}`);
    const project = await this.projectService.createProject(
      input.name,
      input.clientId,
      input.description,
      input.budget,
    );

    return this.mapProjectToResponse(project);
  }

  @Query(() => ProjectResponseDto, {
    description: 'Obtiene un proyecto por ID',
  })
  async getProject(@Args('projectId') projectId: string): Promise<ProjectResponseDto> {
    this.logger.log(`Obteniendo proyecto: ${projectId}`);
    const project = await this.projectService.getProject(projectId);
    return this.mapProjectToResponse(project);
  }

  @Query(() => [ProjectResponseDto], {
    description: 'Lista todos los proyectos',
  })
  async listProjects(
    @Args('clientId', { nullable: true }) clientId?: string,
  ): Promise<ProjectResponseDto[]> {
    this.logger.log(`Listando proyectos${clientId ? ` del cliente: ${clientId}` : ''}`);
    const projects = await this.projectService.listProjects(clientId);
    return projects.map((p) => this.mapProjectToResponse(p));
  }

  @Mutation(() => ProjectResponseDto, {
    description: 'Actualiza un proyecto',
  })
  async updateProject(
    @Args('projectId') projectId: string,
    @Args('input') input: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    this.logger.log(`Actualizando proyecto: ${projectId}`);
    const project = await this.projectService.updateProject(projectId, input);
    return this.mapProjectToResponse(project);
  }

  @Mutation(() => Boolean, {
    description: 'Elimina un proyecto',
  })
  async deleteProject(@Args('projectId') projectId: string): Promise<boolean> {
    this.logger.log(`Eliminando proyecto: ${projectId}`);
    await this.projectService.deleteProject(projectId);
    return true;
  }

  @Mutation(() => ProjectMemberResponseDto, {
    description: 'Agrega un miembro a un proyecto',
  })
  async addProjectMember(
    @Args('projectId') projectId: string,
    @Args('input') input: AddMemberDto,
  ): Promise<ProjectMemberResponseDto> {
    this.logger.log(`Agregando miembro al proyecto: ${projectId}`);
    const member = await this.projectService.addMember(projectId, input.userId, input.role);
    return this.mapMemberToResponse(member);
  }

  @Query(() => [ProjectMemberResponseDto], {
    description: 'Obtiene los miembros de un proyecto',
  })
  async getProjectMembers(
    @Args('projectId') projectId: string,
  ): Promise<ProjectMemberResponseDto[]> {
    this.logger.log(`Obteniendo miembros del proyecto: ${projectId}`);
    const members = await this.projectService.getProjectMembers(projectId);
    return members.map((m) => this.mapMemberToResponse(m));
  }

  private mapProjectToResponse(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      clientId: project.clientId,
      status: project.status,
      methodology: project.methodology,
      budget: project.budget,
      spent: project.spent,
      startDate: project.startDate,
      endDate: project.endDate,
      progress: project.progress,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  private mapMemberToResponse(member: ProjectMember): ProjectMemberResponseDto {
    return {
      id: member.id,
      projectId: member.projectId,
      userId: member.userId,
      role: member.role,
      joinedAt: member.joinedAt,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }
}
