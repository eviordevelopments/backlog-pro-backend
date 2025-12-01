import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProfileCommandHandler } from '@users/application/commands/update-profile.command-handler';
import { UpdateProfileCommand } from '@users/application/commands/update-profile.command';
import { UserProfileRepository } from '@users/repository/user-profile.repository';
import { UserProfile } from '@users/domain/entities/user-profile.entity';
import { UserProfileNotFoundException } from '@users/domain/exceptions';
import * as fc from 'fast-check';

describe('UpdateProfileCommandHandler', () => {
  let handler: UpdateProfileCommandHandler;
  let repository: UserProfileRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProfileCommandHandler,
        {
          provide: UserProfileRepository,
          useValue: {
            getByUserId: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateProfileCommandHandler>(UpdateProfileCommandHandler);
    repository = module.get<UserProfileRepository>(UserProfileRepository);
  });

  describe('handle', () => {
    // Feature: backlog-pro-development, Property 2: Profile update round trip
    it('should update profile and return updated values', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.record({
            userId: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 255 }),
            email: fc.emailAddress(),
            avatar: fc.webUrl(),
            skills: fc.array(fc.string({ minLength: 1 }), { maxLength: 10 }),
            hourlyRate: fc.float({ min: 0, max: 1000 }),
          }),
          async (updateData) => {
            const originalProfile = new UserProfile(
              updateData.userId,
              'Original Name',
              'original@example.com',
              'https://example.com/avatar.jpg',
              ['skill1'],
              100,
            );

            const updatedProfile = new UserProfile(
              updateData.userId,
              updateData.name,
              updateData.email,
              updateData.avatar,
              updateData.skills,
              updateData.hourlyRate,
              originalProfile.getId(),
              originalProfile.getCreatedAt(),
              new Date(),
            );

            (repository.getByUserId as jest.Mock).mockResolvedValue(originalProfile);
            (repository.update as jest.Mock).mockResolvedValue(updatedProfile);

            const command = new UpdateProfileCommand(
              updateData.userId,
              updateData.name,
              updateData.email,
              updateData.avatar,
              updateData.skills,
              updateData.hourlyRate,
            );

            const result = await handler.handle(command);

            // Verify round trip: update then retrieve returns the same values
            expect(result.getName()).toBe(updateData.name);
            expect(result.getEmail()).toBe(updateData.email);
            expect(result.getAvatar()).toBe(updateData.avatar);
            expect(result.getSkills()).toEqual(updateData.skills);
            expect(result.getHourlyRate()).toBe(updateData.hourlyRate);
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should throw UserProfileNotFoundException when profile does not exist', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.record({
            userId: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 255 }),
            email: fc.emailAddress(),
          }),
          async (updateData) => {
            (repository.getByUserId as jest.Mock).mockResolvedValue(null);

            const command = new UpdateProfileCommand(
              updateData.userId,
              updateData.name,
              updateData.email,
            );

            await expect(handler.handle(command)).rejects.toThrow(
              UserProfileNotFoundException,
            );
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
