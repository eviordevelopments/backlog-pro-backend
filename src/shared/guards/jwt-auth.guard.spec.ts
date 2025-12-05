import type { ExecutionContext } from '@nestjs/common';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import fc from 'fast-check';

import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeAll(() => {
    // Mockear el Logger de NestJS para silenciar logs
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

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

    // Desabilitar logger de NestJS para tests
    module.useLogger(false);

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);

    // Mockear el logger del guard
    const loggerSpy = jest.spyOn(guard['logger'], 'error').mockImplementation(() => {});
    const warnSpy = jest.spyOn(guard['logger'], 'warn').mockImplementation(() => {});
    const debugSpy = jest.spyOn(guard['logger'], 'debug').mockImplementation(() => {});
  });

  describe('canActivate', () => {
    // Feature: backlog-pro-development, Property 5: Unauthenticated request rejection
    it('should reject requests without authentication token', async () => {
      fc.assert(
        fc.asyncProperty(fc.constant(null), async () => {
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

          (jwtService.verifyAsync as jest.Mock).mockRejectedValue(new Error('Invalid token'));

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
