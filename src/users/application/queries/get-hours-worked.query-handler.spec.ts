import { Test, TestingModule } from '@nestjs/testing';
import { GetHoursWorkedQueryHandler } from '@users/application/queries/get-hours-worked.query-handler';
import { GetHoursWorkedQuery } from '@users/application/queries/get-hours-worked.query';
import { TimeEntryRepository } from '@time-entries/repository/time-entry.repository';
import { TimeEntry } from '@time-entries/domain/entities/time-entry.entity';
import * as fc from 'fast-check';

describe('GetHoursWorkedQueryHandler', () => {
  let handler: GetHoursWorkedQueryHandler;
  let timeEntryRepository: TimeEntryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetHoursWorkedQueryHandler,
        {
          provide: TimeEntryRepository,
          useValue: {
            listByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetHoursWorkedQueryHandler>(GetHoursWorkedQueryHandler);
    timeEntryRepository = module.get<TimeEntryRepository>(TimeEntryRepository);
  });

  describe('handle', () => {
    // Feature: backlog-pro-development, Property 4: Hours worked aggregation consistency
    it('should return total hours equal to sum of all time entries', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.array(
            fc.record({
              taskId: fc.uuid(),
              hours: fc.float({ min: 0.25, max: 8 }),
              date: fc.date(),
            }),
            { minLength: 1, maxLength: 20 },
          ),
          async (userId, timeEntriesData) => {
            const timeEntries = timeEntriesData.map(
              (data) =>
                new TimeEntry(
                  data.taskId,
                  userId,
                  data.hours,
                  data.date,
                  'Test entry',
                ),
            );

            (timeEntryRepository.listByUser as jest.Mock).mockResolvedValue(timeEntries);

            const query = new GetHoursWorkedQuery(userId);
            const result = await handler.handle(query);

            // Calculate expected total
            const expectedTotal = timeEntriesData.reduce((sum, entry) => sum + entry.hours, 0);

            // Verify consistency: sum of individual entries equals total
            expect(result.totalHours).toBeCloseTo(expectedTotal, 2);

            // Verify that the sum of grouped hours equals total
            const groupedTotal = Object.values(result.byProject).reduce(
              (sum: number, projectHours: number) => sum + projectHours,
              0,
            );
            expect(groupedTotal).toBeCloseTo(expectedTotal, 2);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should return zero hours when user has no time entries', async () => {
      fc.assert(
        fc.asyncProperty(fc.uuid(), async (userId) => {
          (timeEntryRepository.listByUser as jest.Mock).mockResolvedValue([]);

          const query = new GetHoursWorkedQuery(userId);
          const result = await handler.handle(query);

          expect(result.totalHours).toBe(0);
          expect(Object.keys(result.byProject).length).toBe(0);
        }),
        { numRuns: 100 },
      );
    });

    it('should maintain consistency when aggregating hours by project', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.uuid(),
          fc.array(
            fc.record({
              projectId: fc.uuid(),
              hours: fc.float({ min: 0.25, max: 8 }),
              date: fc.date(),
            }),
            { minLength: 1, maxLength: 20 },
          ),
          async (userId, timeEntriesData) => {
            const timeEntries = timeEntriesData.map(
              (data) =>
                new TimeEntry(
                  data.projectId,
                  userId,
                  data.hours,
                  data.date,
                  'Test entry',
                ),
            );

            (timeEntryRepository.listByUser as jest.Mock).mockResolvedValue(timeEntries);

            const query = new GetHoursWorkedQuery(userId);
            const result = await handler.handle(query);

            // Verify each project's hours is the sum of its entries
            const projectHoursMap: { [key: string]: number } = {};
            timeEntriesData.forEach((entry) => {
              projectHoursMap[entry.projectId] =
                (projectHoursMap[entry.projectId] || 0) + entry.hours;
            });

            Object.entries(projectHoursMap).forEach(([projectId, expectedHours]) => {
              expect(result.byProject[projectId]).toBeCloseTo(expectedHours, 2);
            });
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
