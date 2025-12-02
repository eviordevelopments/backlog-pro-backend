import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import * as fc from 'fast-check';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('canActivate', () => {
    // Feature: backlog-pro-development, Property 5: Unauthenticated request rejection
    it('should reject requests without authentication token', async () => {
      fc.assert(
        fc.asyncProperty(fc.string(), async (randomString) => {
          const mockContext = {
            getContext: () => ({
              req: {
                headers: {
                  authorization: undefined,
                },
              },
            }),
          } as any;

          const gqlContextSpy = jest
            .spyOn(GqlExecutionContext, 'create')
            .mockReturnValue(mockContext);

          await expect(guard.canActivate(mockContext as ExecutionContext)).rejects.toThrow(
            UnauthorizedException,
          );

          gqlContextSpy.mockRestore();
        }),
        { numRuns: 100 },
      );
    });

    it('should reject requests with invalid token format', async () => {
      fc.assert(
        fc.asyncProperty(fc.string(), async (invalidToken) => {
          const mockContext = {
            getContext: () => ({
              req: {
                headers: {
                  authorization: `Bearer ${invalidToken}`,
                },
              },
            }),
          } as any;

          const gqlContextSpy = jest
            .spyOn(GqlExecutionContext, 'create')
            .mockReturnValue(mockContext);

          (jwtService.verifyAsync as jest.Mock).mockRejectedValue(
            new Error('Invalid token'),
          );

          await expect(guard.canActivate(mockContext as ExecutionContext)).rejects.toThrow(
            UnauthorizedException,
          );

          gqlContextSpy.mockRestore();
        }),
        { numRuns: 100 },
      );
    });

    it('should accept requests with valid token', async () => {
      fc.assert(
        fc.asyncProperty(
          fc.record({
            sub: fc.uuid(),
            email: fc.emailAddress(),
            role: fc.constantFrom('admin', 'user', 'moderator'),
          }),
          async (tokenPayload) => {
            const req = {
              headers: {
                authorization: 'Bearer valid-token',
              },
              user: undefined,
            };

            const mockContext = {
              getContext: () => ({
                req,
              }),
            } as any;

            const gqlContextSpy = jest
              .spyOn(GqlExecutionContext, 'create')
              .mockReturnValue(mockContext);

            (jwtService.verifyAsync as jest.Mock).mockResolvedValue(tokenPayload);

            const result = await guard.canActivate(mockContext as ExecutionContext);

            expect(result).toBe(true);
            expect(req.user).toEqual({
              sub: tokenPayload.sub,
              email: tokenPayload.email,
              role: tokenPayload.role,
            });

            gqlContextSpy.mockRestore();
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
