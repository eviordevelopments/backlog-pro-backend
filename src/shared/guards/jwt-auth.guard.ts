import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<{
      req: {
        headers: { authorization?: string };
        user?: { sub: string; email: string; role?: string };
      };
    }>();
    const request = gqlContext.req;

    const authHeader = request.headers.authorization;
    this.logger.debug(`Authorization header: ${authHeader ?? 'none'}`);

    if (!authHeader) {
      this.logger.warn('No authorization header provided');
      throw new UnauthorizedException('No se proporcionó token de autenticación');
    }

    const token = authHeader.replace('Bearer ', '');
    this.logger.debug(`Token extraído: ${token.substring(0, 20)}...`);

    if (!token) {
      this.logger.warn('Token vacío después de extraer');
      throw new UnauthorizedException('Token de autenticación inválido');
    }

    try {
      const decoded = await this.jwtService.verifyAsync<{
        sub?: string;
        userId?: string;
        email: string;
        role?: string;
      }>(token);
      this.logger.debug(`Token verificado correctamente. Usuario: ${decoded.email}`);

      request.user = {
        sub: decoded.sub ?? decoded.userId ?? '',
        email: decoded.email,
        role: decoded.role,
      };

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error al verificar token: ${errorMessage}`);
      throw new UnauthorizedException('Token de autenticación inválido o expirado');
    }
  }
}
