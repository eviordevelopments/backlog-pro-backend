import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface MetricsUpdateEvent {
  projectId: string;
  type: 'sprint' | 'project' | 'dashboard';
  data: any;
  timestamp: Date;
}

@Injectable()
export class MetricsEventService {
  private projectMetricsUpdated$ = new Subject<MetricsUpdateEvent>();
  private dashboardMetricsUpdated$ = new Subject<MetricsUpdateEvent>();

  getProjectMetricsUpdates() {
    return this.projectMetricsUpdated$.asObservable();
  }

  getDashboardMetricsUpdates() {
    return this.dashboardMetricsUpdated$.asObservable();
  }

  emitProjectMetricsUpdate(event: MetricsUpdateEvent) {
    this.projectMetricsUpdated$.next(event);
  }

  emitDashboardMetricsUpdate(event: MetricsUpdateEvent) {
    this.dashboardMetricsUpdated$.next(event);
  }
}
