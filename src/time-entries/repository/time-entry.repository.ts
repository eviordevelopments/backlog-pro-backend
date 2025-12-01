import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { TimeEntry } from '@time-entries/domain/entities/time-entry.entity';
import { TimeEntryTypeOrmEntity } from '@time-entries/repository/entities/time-entry.typeorm-entity';
import { TimeEntryMapper } from '@time-entries/repository/mappers/time-entry.mapper';
import { ITimeEntryRepository } from '@time-entries/domain/interfaces/time-entry.repository.interface';

@Injectable()
export class TimeEntryRepository implements ITimeEntryRepository {
  private readonly logger = new Logger(TimeEntryRepository.name);

  constructor(
    @InjectRepository(TimeEntryTypeOrmEntity)
    private readonly repository: Repository<TimeEntryTypeOrmEntity>,
    private readonly mapper: TimeEntryMapper,
  ) {}

  async create(timeEntry: TimeEntry): Promise<TimeEntry> {
    this.logger.log(`Creating time entry for task: ${timeEntry.getTaskId()}`);
    const entity = this.mapper.toPersistence(timeEntry);
    const saved = await this.repository.save(entity);
    return this.mapper.toDomain(saved);
  }

  async update(id: string, data: Partial<TimeEntry>): Promise<TimeEntry> {
    this.logger.log(`Updating time entry: ${id}`);
    const entity = await this.repository.findOne({ where: { id, deletedAt: IsNull() } });
    if (!entity) {
      throw new Error(`Time entry not found: ${id}`);
    }

    const domain = this.mapper.toDomain(entity);

    if (data.getHours !== undefined) {
      domain.setHours(data.getHours());
    }
    if (data.getDescription) {
      domain.setDescription(data.getDescription());
    }
    if (data.getDate) {
      domain.setDate(data.getDate());
    }

    const updated = this.mapper.toPersistence(domain);
    const saved = await this.repository.save(updated);
    return this.mapper.toDomain(saved);
  }

  async getById(id: string): Promise<TimeEntry | null> {
    this.logger.log(`Getting time entry: ${id}`);
    const entity = await this.repository.findOne({ where: { id, deletedAt: IsNull() } });
    return entity ? this.mapper.toDomain(entity) : null;
  }

  async listByTask(taskId: string): Promise<TimeEntry[]> {
    this.logger.log(`Listing time entries for task: ${taskId}`);
    const entities = await this.repository.find({
      where: { taskId, deletedAt: IsNull() },
      order: { date: 'DESC' },
    });
    return entities.map((e) => this.mapper.toDomain(e));
  }

  async listByUser(userId: string): Promise<TimeEntry[]> {
    this.logger.log(`Listing time entries for user: ${userId}`);
    const entities = await this.repository.find({
      where: { userId, deletedAt: IsNull() },
      order: { date: 'DESC' },
    });
    return entities.map((e) => this.mapper.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting time entry: ${id}`);
    await this.repository.update({ id }, { deletedAt: new Date() });
  }
}
