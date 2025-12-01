import { Test, TestingModule } from '@nestjs/testing';
import { GetProfileQueryHandler } from '@users/application/queries/get-profile.query-handler';
import { GetProfileQuery } from '@users/application/queries/get-profile.query';
import { UserProfileRepository } from '@users/repository/user-profile.repository';
import { UserProfile } from '@users/domain/entities/user-profile.entity';
import { UserProfileNotFoundException } from '@users/domain/exceptions';
import * as fc from 'fast-check';

describe('GetProfileQueryHandler', () => {
  let handler: GetProfileQueryHandler;
  let repository: UserProfileRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProfileQueryHandler,
        {
          provide: UserProfileRepository,
          useValue: {
            getByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetProfileQueryHandler>(GetProfileQueryHandler);
    repository = module.get<UserProfileRepository>(UserProfileRepository);
  });

  describe('handle', () => {
    // Feature: backlog-pro-development, Property 1: Authenticated user profile completeness
    it('should return profile with all required fields', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.record({
            id: fc.uuid(),
            userId: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 255 }),
            email: fc.emailAddress(),
            avatar: fc.webUrl(),
            skills: fc.array(fc.string({ minLength: 1 }), { maxLength: 10 }),
            hourlyRate: fc.float({ min: 0, max: 1000 }),
            createdAt: fc.date(),
            updatedAt: fc.date(),
          }),
          async (profileData) => {
            const mockProfile = new UserProfile(
              profileData.userId,
              profileData.name,
              profileData.email,
              profileData.avatar,
              profileData.skills,
              profileData.hourlyRate,
              profileData.id,
              profileData.createdAt,
              profileData.updatedAt,
            );

            (repository.getByUserId as jest.Mock).mockResolvedValue(mockProfile);

            const query = new GetProfileQuery(profileData.userId);
            const result = await handler.handle(query);

            // Verify all required fields are present
            expect(result).toBeDefined();
            expect(result.getId()).toBe(profileData.id);
            expect(result.getUserId()).toBe(profileData.userId);
            expect(result.getName()).toBe(profileData.name);
            expect(result.getEmail()).toBe(profileData.email);
            expect(result.getAvatar()).toBe(profileData.avatar);
            expect(result.getSkills()).toEqual(profileData.skills);
            expect(result.getHourlyRate()).toBe(profileData.hourlyRate);
            expect(result.getCreatedAt()).toEqual(profileData.createdAt);
            expect(result.getUpdatedAt()).toEqual(profileData.updatedAt);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should throw UserProfileNotFoundException when profile does not exist', async () => {
      fc.assert(
        fc.asyncProperty(fc.uuid(), async (userId) => {
          (repository.getByUserId as jest.Mock).mockResolvedValue(null);

          const query = new GetProfileQuery(userId);

          await expect(handler.handle(query)).rejects.toThrow(
            UserProfileNotFoundException,
          );
        }),
        { numRuns: 100 },
      );
    });
  });
});
