import { Test, TestingModule } from '@nestjs/testing';
import { CreateSprintCommandHandler } from '@sprints/application/commands/create-sprint.command-handler';
import { CreateSprintCommand } from '@sprints/application/commands/create-sprint.command';
import { SprintRepository } from '@sprints/repository/sprint.repository';
import { InvalidSprintDatesException } from '@sprints/domain/exceptions';

describe('CreateSprintCommandHandler', () => {
  let handler: CreateSprintCommandHandler;
  let mockRepository: Partial<SprintRepository>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn((sprint) => Promise.resolve(sprint)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSprintCommandHandler,
        {
          provide: SprintRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<CreateSprintCommandHandler>(
      CreateSprintCommandHandler,
    );
  });

  describe('Unit Tests', () => {
    it('should create sprint with planning status', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-15');
      const command = new CreateSprintCommand(
        'Sprint 1',
        'project-id',
        'Complete features',
        startDate,
        endDate,
      );

      const result = await handler.handle(command);

      expect(result.getName()).toBe('Sprint 1');
      expect(result.getStatus().getValue()).toBe('planning');
      expect(result.getVelocity()).toBe(0);
    });

    it('should reject when endDate is before startDate', async () => {
      const startDate = new Date('2024-01-15');
      const endDate = new Date('2024-01-01');
      const command = new CreateSprintCommand(
        'Sprint 1',
        'project-id',
        'Complete features',
        startDate,
        endDate,
      );

      await expect(handler.handle(command)).rejects.toThrow(
        InvalidSprintDatesException,
      );
    });

    it('should reject when endDate equals startDate', async () => {
      const date = new Date('2024-01-15');
      const command = new CreateSprintCommand(
        'Sprint 1',
        'project-id',
        'Complete features',
        date,
        date,
      );

      await expect(handler.handle(command)).rejects.toThrow(
        InvalidSprintDatesException,
      );
    });
  });
});
