import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import fc from 'fast-check';
import { TimeEntry } from 'src/time-entries/domain/entities/time-entry.entity';
import { TimeEntryRepository } from 'src/time-entries/repository/time-entry.repository';
import { GetHoursWorkedQuery } from 'src/users/application/queries/get-hours-worked.query';
import { GetHoursWorkedQueryHandler } from 'src/users/application/queries/get-hours-worked.query-handler';



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
              hours: fc.float({ min: 0.25, max: 8, noNaN: true }),
              date: fc.date(),
            }),
            { minLength: 1, maxLength: 20 },
          ),
          async (userId, timeEntriesData) => {
            const timeEntries = timeEntriesData.map(
              (data) => new TimeEntry(data.taskId, userId, data.hours, data.date, 'Test entry'),
            );

            (timeEntryRepository.listByUser as jest.Mock).mockResolvedValue(timeEntries);

            const query = new GetHoursWorkedQuery(userId);
            const result = await handler.execute(query);

            // Calculate expected total
            const expectedTotal = timeEntriesData.reduce((sum, entry) => sum + entry.hours, 0);

            // Verify consistency: sum of individual entries equals total
            expect(result.totalHours).toBeCloseTo(expectedTotal, 2);

            // Verify that the sum of grouped hours equals total
            const groupedTotal = Object.values(result.byProject).reduce(
              (sum: number, projectHours: number) => sum + projectHours,
              0 as number,
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
          const result = await handler.execute(query);

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
              taskId: fc.uuid(),
              hours: fc.float({ min: 0.25, max: 8, noNaN: true }),
              date: fc.date(),
            }),
            { minLength: 1, maxLength: 20 },
          ),
          async (userId, timeEntriesData) => {
            const timeEntries = timeEntriesData.map(
              (data) => new TimeEntry(data.taskId, userId, data.hours, data.date, 'Test entry'),
            );

            (timeEntryRepository.listByUser as jest.Mock).mockResolvedValue(timeEntries);

            const query = new GetHoursWorkedQuery(userId);
            const result = await handler.execute(query);

            // Verify each task's hours is the sum of its entries
            const taskHoursMap: { [key: string]: number } = {};
            timeEntriesData.forEach((entry) => {
              taskHoursMap[entry.taskId] = (taskHoursMap[entry.taskId] || 0) + entry.hours;
            });

            Object.entries(taskHoursMap).forEach(([taskId, expectedHours]) => {
              expect(result.byProject[taskId]).toBeCloseTo(expectedHours, 2);
            });
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
