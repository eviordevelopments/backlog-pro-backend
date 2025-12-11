import { Injectable } from '@nestjs/common';

import { UserStory } from '../../domain/entities/user-story.entity';
import { UserStoryRepository } from '../../repository/user-story.repository';
import { UpdateUserStoryCommand } from './update-user-story.command';

@Injectable()
export class UpdateUserStoryCommandHandler {
  constructor(private readonly userStoryRepository: UserStoryRepository) {}

  async handle(command: UpdateUserStoryCommand): Promise<UserStory> {
    const userStory = await this.userStoryRepository.getById(command.id);
    
    if (!userStory) {
      throw new Error(`User story with id ${command.id} not found`);
    }

    // Update fields if provided
    if (command.title !== undefined) {
      userStory.setTitle(command.title);
    }
    
    if (command.sprintId !== undefined) {
      userStory.setSprintId(command.sprintId);
    }
    
    if (command.storyPoints !== undefined) {
      userStory.setStoryPoints(command.storyPoints);
    }
    
    if (command.status !== undefined) {
      userStory.setStatus(command.status);
    }
    
    if (command.assignedTo !== undefined) {
      userStory.setAssignedTo(command.assignedTo);
    }

    // For other fields that don't have setters, we need to create a new instance
    const updatedUserStory = new UserStory(
      userStory.getProjectId(),
      command.title ?? userStory.getTitle(),
      command.userType ?? userStory.getUserType(),
      command.action ?? userStory.getAction(),
      command.benefit ?? userStory.getBenefit(),
      command.priority ?? userStory.getPriority(),
      command.sprintId !== undefined ? command.sprintId : userStory.getSprintId(),
      command.acceptanceCriteria ? command.acceptanceCriteria.map(desc => ({
        id: require('uuid').v4(),
        description: desc,
        completed: false
      })) : userStory.getAcceptanceCriteria(),
      command.storyPoints ?? userStory.getStoryPoints(),
      command.status ?? userStory.getStatus(),
      command.assignedTo !== undefined ? command.assignedTo : userStory.getAssignedTo(),
      command.definitionOfDone ?? userStory.getDefinitionOfDone(),
      command.impactMetrics ?? userStory.getImpactMetrics(),
      userStory.getId(),
      userStory.getCreatedAt(),
      new Date(), // updatedAt
      userStory.getDeletedAt()
    );

    return this.userStoryRepository.update(command.id, updatedUserStory);
  }
}