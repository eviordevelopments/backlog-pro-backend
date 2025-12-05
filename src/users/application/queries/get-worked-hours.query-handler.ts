import { Injectable, Logger } from '@nestjs/common';

import { UserProfileRepository } from '../../repository/user-profile.repository';

import { GetWorkedHoursQuery } from './get-worked-hours.query';

export interface WorkedHoursResult {
  userId: string;
  totalHours: number;
  projectId?: string;
}

@Injectable()
export class GetWorkedHoursQueryHandler {
  private readonly logger = new Logger(GetWorkedHoursQueryHandler.name);

  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async handle(query: GetWorkedHoursQuery): Promise<WorkedHoursResult> {
    this.logger.log(
      `Obteniendo horas trabajadas del usuario: ${query.userId}${query.projectId ? ` en proyecto: ${query.projectId}` : ''}`,
    );

    let totalHours: number;

    if (query.projectId) {
      totalHours = await this.userProfileRepository.getWorkedHoursByUserIdAndProject(
        query.userId,
        query.projectId,
      );
    } else {
      totalHours = await this.userProfileRepository.getWorkedHoursByUserId(query.userId);
    }

    return {
      userId: query.userId,
      totalHours,
      projectId: query.projectId,
    };
  }
}
