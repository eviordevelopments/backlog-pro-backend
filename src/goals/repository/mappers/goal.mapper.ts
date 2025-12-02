import { Injectable } from '@nestjs/common';
import { Goal } from '@goals/domain/entities/goal.entity';
import { GoalTypeOrmEntity } from '@goals/repository/entities/goal.typeorm-entity';

@Injectable()
export class GoalMapper {
  toDomain(raw: GoalTypeOrmEntity): Goal {
    return new Goal(
      raw.title,
      raw.type,
      raw.category,
      raw.period,
      Number(raw.targetValue),
      raw.unit,
      raw.ownerId,
      raw.startDate,
      raw.endDate,
      raw.description,
      Number(raw.currentValue),
      raw.status,
      raw.id,
      raw.createdAt,
      raw.updatedAt,
      raw.deletedAt,
    );
  }

  toPersistence(goal: Goal): Partial<GoalTypeOrmEntity> {
    return {
      id: goal.getId(),
      title: goal.getTitle(),
      description: goal.getDescription(),
      type: goal.getType(),
      category: goal.getCategory(),
      period: goal.getPeriod(),
      targetValue: goal.getTargetValue(),
      currentValue: goal.getCurrentValue(),
      unit: goal.getUnit(),
      ownerId: goal.getOwnerId(),
      startDate: goal.getStartDate(),
      endDate: goal.getEndDate(),
      status: goal.getStatus(),
      createdAt: goal.getCreatedAt(),
      updatedAt: goal.getUpdatedAt(),
      deletedAt: goal.getDeletedAt() ?? undefined,
    };
  }
}
