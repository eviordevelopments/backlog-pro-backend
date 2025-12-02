import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { HttpException, BadRequestException } from '@nestjs/common';
import { BaseDomainException } from '@shared/exceptions';

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
      
      // Extraer detalles de validación si existen
      let message = exception.message;
      let validationErrors = null;

      if (typeof response === 'object' && response !== null) {
        const responseObj = response as any;
        
        // Si hay errores de validación, extraerlos
        if (Array.isArray(responseObj.message)) {
          validationErrors = responseObj.message;
          message = 'Errores de validación';
        } else if (responseObj.message) {
          message = responseObj.message;
        }
      }

      return new GraphQLError(message, {
        extensions: {
          code: `HTTP_${status}`,
          timestamp: new Date().toISOString(),
          ...(validationErrors && { validationErrors }),
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
