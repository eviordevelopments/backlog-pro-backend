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
import { HealthModule } from './health/health.moudule';
import { MeetingsModule } from './meetings/meetings.module';
import { MetricsModule } from './metrics/metrics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProjectsModule } from './projects/projects.module';
import { RisksModule } from './risks/risks.module';
import { validationSchemaConfig } from './shared/config/config.validation';
import { databaseConfig } from './shared/config/database.config';
import envs from './shared/config/envs.config';
import { graphqlConfig } from './shared/config/graphql.config';
import { SharedModule } from './shared/shared.module';
import { SprintsModule } from './sprints/sprints.module';
import { TasksModule } from './tasks/tasks.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';
import { UserStoriesModule } from './user-stories/user-stories.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: validationSchemaConfig,
      load: [envs],
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
