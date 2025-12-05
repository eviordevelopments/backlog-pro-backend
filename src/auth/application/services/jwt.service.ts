import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { envs } from '../../../shared/config/index';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateToken(userId: string, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };
    return this.jwtService.sign(payload, {
      expiresIn: envs.jwt.expiresIn,
    });
  }

  generateResetToken(userId: string, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };
    return this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }
}
