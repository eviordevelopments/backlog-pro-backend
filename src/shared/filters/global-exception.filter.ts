import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { BaseDomainException } from '@shared/exceptions';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // No manejar excepciones de GraphQL aquí, dejar que GraphQLExceptionFilter las maneje
    if (host.getType<GqlContextType>() === 'graphql') {
      throw exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof BaseDomainException) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        codigo: exception.codigo,
        mensaje: exception.mensaje,
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return response.status(status).json({
        codigo: 'HTTP_ERROR',
        mensaje: exception.message,
        timestamp: new Date().toISOString(),
      });
    }

    // No exponer stack traces al cliente
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      codigo: 'INTERNAL_ERROR',
      mensaje: 'Error interno del servidor',
      timestamp: new Date().toISOString(),
    });
  }
}
