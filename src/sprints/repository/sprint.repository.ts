import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Sprint } from '@sprints/domain/entities/sprint.entity';
import { SprintTypeOrmEntity } from '@sprints/repository/entities/sprint.typeorm-entity';
import { SprintMapper } from '@sprints/repository/mappers/sprint.mapper';
import { ISprintRepository } from '@sprints/domain/interfaces/sprint.repository.interface';

@Injectable()
export class SprintRepository implements ISprintRepository {
  private readonly logger = new Logger(SprintRepository.name);

  constructor(
    @InjectRepository(SprintTypeOrmEntity)
    private readonly repository: Repository<SprintTypeOrmEntity>,
    private readonly mapper: SprintMapper,
  ) {}

  async create(sprint: Sprint): Promise<Sprint> {
    this.logger.log(`Creating sprint: ${sprint.getName()}`);
    const entity = this.mapper.toPersistence(sprint);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, data: Partial<Sprint>): Promise<Sprint> {
    this.logger.log(`Updating sprint: ${id}`);
    const entity = await this.repository.findOne({ where: { id, deletedAt: IsNull() } });
    if (!entity) {
      throw new Error(`Sprint not found: ${id}`);
    }

    const domain = this.mapper.toDomain(entity);
    if (data.getName) {
      domain.setName(data.getName());
    }
    if (data.getGoal) {
      domain.setGoal(data.getGoal());
    }
    if (data.getStatus) {
      domain.setStatus(data.getStatus());
    }
    if (data.getVelocity) {
      domain.setVelocity(data.getVelocity());
    }
    if (data.getStoryPointsCommitted) {
      domain.setStoryPointsCommitted(data.getStoryPointsCommitted());
    }
    if (data.getStoryPointsCompleted) {
      domain.setStoryPointsCompleted(data.getStoryPointsCompleted());
    }
    if (data.getTeamMembers) {
      domain.setTeamMembers(data.getTeamMembers());
    }
    if (data.getSprintPlanningDate) {
      const date = data.getSprintPlanningDate();
      if (date) {
        domain.setSprintPlanningDate(date);
      }
    }
    if (data.getSprintReviewDate) {
      const date = data.getSprintReviewDate();
      if (date) {
        domain.setSprintReviewDate(date);
      }
    }
    if (data.getSprintRetrospectiveDate) {
      const date = data.getSprintRetrospectiveDate();
      if (date) {
        domain.setSprintRetrospectiveDate(date);
      }
    }
    if (data.getRetrospectiveNotes) {
      const notes = data.getRetrospectiveNotes();
      if (notes) {
        domain.setRetrospectiveNotes(notes);
      }
    }

    const updated = this.mapper.toPersistence(domain);
    const saved = await this.repository.save(updated);
    return this.mapper.toDomain(saved);
  }

  async getById(id: string): Promise<Sprint | null> {
    this.logger.log(`Getting sprint: ${id}`);
    const entity = await this.repository.findOne({ where: { id, deletedAt: IsNull() } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async listByProject(projectId: string): Promise<Sprint[]> {
    this.logger.log(`Listing sprints for project: ${projectId}`);
    const entities = await this.repository.find({
      where: { projectId, deletedAt: IsNull() },
      order: { startDate: 'ASC' },
    });
    return entities.map((e) => this.mapper.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting sprint: ${id}`);
    await this.repository.update({ id }, { deletedAt: new Date() });
  }
}
