import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import {
  CompleteSprintCommand,
  CompleteSprintCommandHandler,
} from 'src/sprints/application/commands';
import { Sprint } from 'src/sprints/domain/entities/sprint.entity';
import { SprintNotFoundException } from 'src/sprints/domain/exceptions';
import { ISprintRepository } from 'src/sprints/domain/interfaces/sprint.repository.interface';
import { SprintRepository } from 'src/sprints/repository/sprint.repository';

describe('CompleteSprintCommandHandler', () => {
  let handler: CompleteSprintCommandHandler;
  let mockRepository: Partial<ISprintRepository>;

  beforeEach(async () => {
    mockRepository = {
      getById: jest.fn(),
      update: jest.fn((_id: string, sprint: Partial<Sprint>) => Promise.resolve(sprint as Sprint)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompleteSprintCommandHandler,
        {
          provide: SprintRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    handler = module.get<CompleteSprintCommandHandler>(CompleteSprintCommandHandler);
  });

  describe('Unit Tests', () => {
    it('should complete sprint and set velocity', async () => {
      const sprint = new Sprint(
        'Sprint 1',
        'project-id',
        'Complete features',
        new Date('2024-01-01'),
        new Date('2024-01-15'),
      );
      sprint.setStoryPointsCompleted(42);

      (mockRepository.getById as jest.Mock).mockResolvedValue(sprint);
      (mockRepository.update as jest.Mock).mockResolvedValue(sprint);

      const command = new CompleteSprintCommand(sprint.getId());
      const result = await handler.handle(command);

      expect(result.getStatus().getValue()).toBe('completed');
      expect(result.getVelocity()).toBe(42);
    });

    it('should throw SprintNotFoundException when sprint does not exist', async () => {
      (mockRepository.getById as jest.Mock).mockResolvedValue(null);

      const command = new CompleteSprintCommand('non-existent-id');

      await expect(handler.handle(command)).rejects.toThrow(SprintNotFoundException);
    });

    it('should set velocity to 0 for sprint with no completed story points', async () => {
      const sprint = new Sprint(
        'Sprint 1',
        'project-id',
        'Complete features',
        new Date('2024-01-01'),
        new Date('2024-01-15'),
      );

      (mockRepository.getById as jest.Mock).mockResolvedValue(sprint);
      (mockRepository.update as jest.Mock).mockResolvedValue(sprint);

      const command = new CompleteSprintCommand(sprint.getId());
      const result = await handler.handle(command);

      expect(result.getVelocity()).toBe(0);
    });
  });
});
