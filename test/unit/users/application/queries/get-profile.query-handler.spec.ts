import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import fc from 'fast-check';
import { GetProfileQuery, GetProfileQueryHandler } from 'src/users/application/queries';
import { UserProfile } from 'src/users/domain/entities/user-profile.entity';
import { UserProfileNotFoundException } from 'src/users/domain/exceptions';
import { UserProfileRepository } from 'src/users/repository/user-profile.repository';

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
            expect(result.id).toBe(profileData.id);
            expect(result.userId).toBe(profileData.userId);
            expect(result.name).toBe(profileData.name);
            expect(result.email).toBe(profileData.email);
            expect(result.avatar).toBe(profileData.avatar);
            expect(result.skills).toEqual(profileData.skills);
            expect(result.hourlyRate).toBe(profileData.hourlyRate);
            expect(result.createdAt).toEqual(profileData.createdAt);
            expect(result.updatedAt).toEqual(profileData.updatedAt);
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

          await expect(handler.handle(query)).rejects.toThrow(UserProfileNotFoundException);
        }),
        { numRuns: 100 },
      );
    });
  });
});
