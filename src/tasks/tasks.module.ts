import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskTypeOrmEntity } from '@tasks/repository/entities/task.typeorm-entity';
import { TaskRepository } from '@tasks/repository/task.repository';
import { TaskMapper } from '@tasks/repository/mappers/task.mapper';
import { CreateTaskCommandHandler } from '@tasks/application/commands/create-task.command-handler';
import { UpdateTaskCommandHandler } from '@tasks/application/commands/update-task.command-handler';
import { AssignTaskCommandHandler } from '@tasks/application/commands/assign-task.command-handler';
import { AddSubtasksCommandHandler } from '@tasks/application/commands/add-subtasks.command-handler';
import { AddDependencyCommandHandler } from '@tasks/application/commands/add-dependency.command-handler';
import { GetTaskQueryHandler } from '@tasks/application/queries/get-task.query-handler';
import { ListTasksSprintQueryHandler } from '@tasks/application/queries/list-tasks-sprint.query-handler';
import { TaskService } from '@tasks/application/services/task.service';
import { TaskResolver } from '@tasks/resolvers/task.resolver';
import { ProjectsModule } from '@projects/projects.module';

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
