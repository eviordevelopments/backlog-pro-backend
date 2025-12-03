import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

import { BaseDomainException } from '../exceptions/index';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const isGraphQL = host.getType<GqlContextType>() === 'graphql';

    if (exception instanceof BaseDomainException) {
      if (isGraphQL) {
        throw new GraphQLError(exception.mensaje, {
          extensions: {
            code: exception.codigo,
            timestamp: new Date().toISOString(),
          },
        });
      }

      const ctx = host.switchToHttp();
      const response = ctx.getResponse<{
        status: (code: number) => { json: (body: unknown) => void };
      }>();
      return response.status(HttpStatus.BAD_REQUEST).json({
        codigo: exception.codigo,
        mensaje: exception.mensaje,
        timestamp: new Date().toISOString(),
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const responseData = exception.getResponse();

      // Extraer detalles de validación
      let message = exception.message;
      let validationErrors: string[] | null = null;

      if (typeof responseData === 'object' && responseData !== null) {
        const responseObj = responseData as { message?: string | string[] };
        if (Array.isArray(responseObj.message)) {
          validationErrors = responseObj.message;
          message = 'Errores de validación';
        } else if (responseObj.message) {
          message = responseObj.message;
        }
      }

      if (isGraphQL) {
        const extensions: Record<string, unknown> = {
          code: `HTTP_${status}`,
          timestamp: new Date().toISOString(),
        };

        if (validationErrors) {
          extensions.validationErrors = validationErrors;
        }

        throw new GraphQLError(message, { extensions });
      }

      const ctx = host.switchToHttp();
      const response = ctx.getResponse<{
        status: (code: number) => { json: (body: unknown) => void };
      }>();
      return response.status(status).json({
        codigo: 'HTTP_ERROR',
        mensaje: message,
        ...(validationErrors && { validationErrors }),
        timestamp: new Date().toISOString(),
      });
    }

    // No exponer stack traces al cliente
    if (isGraphQL) {
      throw new GraphQLError('Error interno del servidor', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{
      status: (code: number) => { json: (body: unknown) => void };
    }>();
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      codigo: 'INTERNAL_ERROR',
      mensaje: 'Error interno del servidor',
      timestamp: new Date().toISOString(),
    });
  }
}
