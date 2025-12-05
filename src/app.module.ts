import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AchievementsModule } from './achievements/achievements.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FinancesModule } from './finances/finances.module';
import { GoalsModule } from './goals/goals.module';
import { MeetingsModule } from './meetings/meetings.module';
import { MetricsModule } from './metrics/metrics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProjectsModule } from './projects/projects.module';
import { RisksModule } from './risks/risks.module';
import {
  databaseConfig,
  envsConfig,
  graphqlConfig,
  validationSchemaConfig,
} from './shared/config/index';
import { SharedModule } from './shared/shared.module';
import { SprintsModule } from './sprints/sprints.module';
import { TasksModule } from './tasks/tasks.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';
import { UserStoriesModule } from './user-stories/user-stories.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.moudule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: validationSchemaConfig,
      load: [envsConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      ...graphqlConfig,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    SharedModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    SprintsModule,
    TasksModule,
    TimeEntriesModule,
    ClientsModule,
    FinancesModule,
    MetricsModule,
    MeetingsModule,
    GoalsModule,
    RisksModule,
    UserStoriesModule,
    FeedbackModule,
    AchievementsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
