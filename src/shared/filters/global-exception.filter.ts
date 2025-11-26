import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseDomainException } from '..';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
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
