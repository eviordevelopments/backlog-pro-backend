import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { MetricsService } from '../services/metrics.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metrics: MetricsService) {}

  use(req: Request, res: Response, next: () => void) {
    const start = performance.now();

    res.on('finish', () => {
      const latency = performance.now() - start;
      const status = res.statusCode;
      this.metrics.recordRequest(status, latency);
    });

    next();
  }
}
