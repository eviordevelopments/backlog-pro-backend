import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No se proporcionó token de autenticación');
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Token de autenticación inválido');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);

      request.user = {
        sub: decoded.sub || decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token de autenticación inválido o expirado');
    }
  }
}
