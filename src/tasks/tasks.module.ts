import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsModule } from '../projects/projects.module';

import { AddDependencyCommandHandler } from './application/commands/add-dependency.command-handler';
import { AddSubtasksCommandHandler } from './application/commands/add-subtasks.command-handler';
import { AssignTaskCommandHandler } from './application/commands/assign-task.command-handler';
import { CreateTaskCommandHandler } from './application/commands/create-task.command-handler';
import { UpdateTaskCommandHandler } from './application/commands/update-task.command-handler';
import { GetTaskQueryHandler } from './application/queries/get-task.query-handler';
import { ListTasksSprintQueryHandler } from './application/queries/list-tasks-sprint.query-handler';
import { TaskService } from './application/services/task.service';
import { TaskTypeOrmEntity } from './repository/entities/task.typeorm-entity';
import { TaskMapper } from './repository/mappers/task.mapper';
import { TaskRepository } from './repository/task.repository';
import { TaskResolver } from './resolvers/task.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TaskTypeOrmEntity]), ProjectsModule],
  providers: [
    TaskMapper,
    TaskRepository,
    CreateTaskCommandHandler,
    UpdateTaskCommandHandler,
    AssignTaskCommandHandler,
    AddSubtasksCommandHandler,
    AddDependencyCommandHandler,
    GetTaskQueryHandler,
    ListTasksSprintQueryHandler,
    TaskService,
    TaskResolver,
  ],
  exports: [TaskService, TaskRepository],
})
export class TasksModule {}
