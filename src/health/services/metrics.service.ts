import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private requestCount = 0;
  private status2xx = 0;
  private status4xx = 0;
  private status5xx = 0;

  private totalLatency = 0; // en ms
  private latencyCount = 0;

  recordRequest(statusCode: number, latencyMs: number) {
    this.requestCount++;

    if (statusCode >= 200 && statusCode < 300) this.status2xx++;
    else if (statusCode >= 400 && statusCode < 500) this.status4xx++;
    else if (statusCode >= 500) this.status5xx++;

    this.totalLatency += latencyMs;
    this.latencyCount++;
  }

  getMetrics() {
    const avgLatency = this.latencyCount === 0 ? 0 : this.totalLatency / this.latencyCount;

    const mem = process.memoryUsage();

    return {
      requestCount: this.requestCount,
      status2xx: this.status2xx,
      status4xx: this.status4xx,
      status5xx: this.status5xx,
      avgLatency,
      memRss: mem.rss,
      memHeapUsed: mem.heapUsed,
      uptime: Math.floor(process.uptime()),
    };
  }
}
