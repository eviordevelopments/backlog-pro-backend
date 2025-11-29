import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { HttpException } from '@nestjs/common';
import { BaseDomainException } from '..';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown) {
    if (exception instanceof BaseDomainException) {
      return new GraphQLError(exception.mensaje, {
        extensions: {
          code: exception.codigo,
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (exception instanceof GraphQLError) {
      return exception;
    }

    // Manejar excepciones HTTP de NestJS (UnauthorizedException, ForbiddenException, etc.)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message = typeof response === 'object' && 'message' in response 
        ? (response as any).message 
        : exception.message;

      return new GraphQLError(message || exception.message, {
        extensions: {
          code: `HTTP_${status}`,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // No exponer stack traces al cliente
    return new GraphQLError('Error interno del servidor', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
      },
    });
  }
}
